/* KFB Flug-VFX R2
 *   Speedlines      · zwei Bänder an den Außenkanten von Jetpack oder Fahrzeug (Port TinySkies Contrails.ts über Travel Globe v13 contrails.js)
 *   Manöver-Linien  · radiale, helle Linien am Bildrand, nur auf Auslöser (Barrel Roll, Boost)
 *   Jetpack-Schub   · Knet-Wülste + Tropfen; Schweben = Minimalschub
 *   Überflug        · Staub über Boden, Gischt über Wasser (Port TinySkies CarpetWake.ts über Travel Globe v13 carpet-wake.js), optional
 *   Start/Lande-Puff· Rubbel-Ring + Krümel
 *
 *   const vfx = createFlightVfx({ scene, camera, body: figure,
 *     nozzles: [{ object: jetpack, offset, dir }], trails: [{ object: jetpack, offset }],
 *     surfaceAt: (x, z) => ({ y, water }) });
 *   vfx.update(dt, speedKmh, thrust01)
 *   vfx.maneuver(strength, seconds)         // Manöver-Linien auslösen
 *   vfx.setTrailAnchors(list)               // z. B. beim Wechsel Jetpack ↔ Kart
 *   vfx.setGrounded(bool, groundPos)        // Puff beim Übergang
 *   hoverPose(t)                            // Schwebe-Pose für den Figur-Owner
 *
 * Kein zweiter Renderpfad, feste Pools, keine Allokation im Frame.
 */
import * as THREE from 'three';

export const FLIGHT_VFX_THEME = {
  trail: '#FFF6E6', lineGlow: '#FFF4E2',
  core: '#FFF1C9', hot: '#FFC3A2', mid: '#FFA97A', lo: '#B87B60', smoke: '#A99CC6',
  dust: '#E4D3B4', dustLo: '#B59D78', spray: '#F4FAFF'
};
export const FLIGHT_IDLE = 0.14; // Schub im Schweben
export const VFX_CAPS = { lines: 32, trailPts: 72, jet: 64, puff: 40, skim: 240 };

const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/* Schwebe-Pose: langsames Auf und Ab, leichtes Pendeln, Beine baumeln nach. Werte relativ, der Figur-Owner addiert sie. */
export function hoverPose(t, seed = 0) {
  const w = Math.PI * 2 * 0.55;
  return {
    y: Math.sin(t * w) * 0.12 + Math.sin(t * 1.7 + seed) * 0.035,
    pitch: Math.sin(t * w - 0.9) * 0.05,
    roll: Math.sin(t * 0.9 + seed) * 0.06,
    leg: Math.sin(t * w - 1.6) * 0.22
  };
}

/* ---------- Knet-Material ---------- */
const NOISE_GLSL = `
float kfbH(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
float kfbN(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(kfbH(i),kfbH(i+vec3(1,0,0)),f.x),mix(kfbH(i+vec3(0,1,0)),kfbH(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(kfbH(i+vec3(0,0,1)),kfbH(i+vec3(1,0,1)),f.x),mix(kfbH(i+vec3(0,1,1)),kfbH(i+vec3(1,1,1)),f.x),f.y),f.z); }`;
function clayMat(glow, key) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = { value: glow };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFade;\nvarying float vFade;\nvarying vec3 vLp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade; vLp = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uGlow;\nvarying float vFade;\nvarying vec3 vLp;' + NOISE_GLSL)
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nfloat kn = 1.0;\nif (vFade > 0.001) { kn = kfbN(vLp*3.1)*0.65 + kfbN(vLp*7.7+3.0)*0.35; if (kn < vFade) discard; }')
      .replace('#include <color_fragment>', '#include <color_fragment>\nif (vFade > 0.001) diffuseColor.rgb *= mix(0.7, 1.0, smoothstep(vFade, vFade + 0.07, kn));')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;');
  };
  m.customProgramCacheKey = () => 'kfbClayVfx_' + key;
  return m;
}
function lumpGeo(seed) {
  const g = new THREE.SphereGeometry(1, 14, 10), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 1 + 0.07 * Math.sin(v.x * 3.1 + seed) * Math.cos(v.y * 2.7 - seed) + 0.05 * Math.sin(v.z * 4.3 + v.y * 1.9);
    p.setXYZ(i, v.x * k, v.y * k, v.z * k);
  }
  g.computeVertexNormals(); return g;
}
function instMesh(geo, mat, cap) {
  const g = geo.clone(); const fade = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1); fade.setUsage(THREE.DynamicDrawUsage); g.setAttribute('aFade', fade);
  const m = new THREE.InstancedMesh(g, mat, cap); m.count = 0; m.frustumCulled = false;
  m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3); m.instanceColor.setUsage(THREE.DynamicDrawUsage);
  return { mesh: m, fade };
}

/* ======================= Speedlines · Bänder an den Außenkanten =======================
 * Quelle: TinySkies Contrails.ts, gelesen über travel/KFB Travel Globe v13-1/globe-v13/contrails.js und
 * travel/KFB Travel Combat v25/terrain-v25/card-contrails.js. 1:1: 72 Stützpunkte, zwei Vertices je Punkt,
 * Index a,c,b / b,c,d, Querachse = Fahrtrichtung × Blick zur Kamera (Fallback letzte Querachse bzw. (0,1,0)),
 * Breite × fade, Alpha × fade², additiv, premultipliert, toneMapped aus.
 * Aus v13 übernommen: Anker als Object3D IM Träger (erbt Bank, Roll, Bob), Mindestschritt, Tempo-Blende auf
 * absolutem Tempo, Einzug unter der Schwelle, kein Tiefentest.
 * Neu: warmes Creme statt Eisblau, weißer Kern ab Vollgas (aus card-contrails), Maße für 1,7-m-Figur. */
export function createSpeedTrails({ anchors = [], params = {} } = {}) {
  const SEG = VFX_CAPS.trailPts;
  const P = Object.assign({ width: 0.032, alphaGain: 0.62, minStep: 0.14, kmhOn: 18, kmhFull: 70, white: 0.9, tint: FLIGHT_VFX_THEME.trail, renderOrder: 6 }, params);
  const group = new THREE.Group(); group.name = 'kfbSpeedTrails';
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTint: { value: new THREE.Color(P.tint) }, uWhite: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: `attribute float aAlpha; attribute float aSide; varying float vA; varying float vSide;
      void main(){ vA = aAlpha; vSide = aSide; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uTint; uniform float uWhite; uniform float uOpacity; varying float vA; varying float vSide;
      void main(){
        float core = 1.0 - abs(vSide);
        float soft = smoothstep(0.0, 0.55, core);
        vec3 col = mix(uTint, vec3(1.0), core * core * uWhite);
        float a = vA * soft * uOpacity;
        if (a <= 0.002) discard;
        gl_FragColor = vec4(col * a, a);
      }`,
    transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, premultipliedAlpha: true, toneMapped: false
  });
  const _dir = new THREE.Vector3(), _toCam = new THREE.Vector3(), _cross = new THREE.Vector3(), _fb = new THREE.Vector3(0, 1, 0), _p = new THREE.Vector3(), _cam = new THREE.Vector3();
  function makeRibbon() {
    const pos = new Float32Array(SEG * 6), alpha = new Float32Array(SEG * 2), side = new Float32Array(SEG * 2);
    for (let i = 0; i < SEG; i++) { side[i * 2] = -1; side[i * 2 + 1] = 1; }
    const geo = new THREE.BufferGeometry();
    const posA = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage), alA = new THREE.BufferAttribute(alpha, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posA); geo.setAttribute('aAlpha', alA); geo.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
    const idx = []; for (let i = 0; i < SEG - 1; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
    geo.setIndex(idx); geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = P.renderOrder; group.add(mesh);
    return { mesh, geo, posA, alA, pos, alpha, pts: new Float32Array(SEG * 3), n: 0, lastCross: new THREE.Vector3(0, 1, 0), anchor: null };
  }
  let ribbons = [], opacity = 0, active = true;
  function setAnchors(list) {
    ribbons.forEach((rb) => { rb.anchor && rb.anchor.parent && rb.anchor.parent.remove(rb.anchor); group.remove(rb.mesh); rb.geo.dispose(); });
    ribbons = (list || []).map((a) => {
      const rb = makeRibbon(); const o = new THREE.Object3D(); o.name = 'speedTrailAnchor';
      o.position.fromArray(a.offset || [0, 0, 0]); a.object && a.object.add(o); rb.anchor = o; return rb;
    });
  }
  function push(rb, x, y, z) {
    if (rb.n > 0) { const dx = x - rb.pts[0], dy = y - rb.pts[1], dz = z - rb.pts[2]; if (dx * dx + dy * dy + dz * dz < P.minStep * P.minStep) { rb.pts[0] = x; rb.pts[1] = y; rb.pts[2] = z; return; } }
    rb.pts.copyWithin(3, 0, (SEG - 1) * 3); rb.pts[0] = x; rb.pts[1] = y; rb.pts[2] = z; if (rb.n < SEG) rb.n++;
  }
  function write(rb) {
    const { pts, pos, alpha } = rb;
    for (let i = 0; i < SEG; i++) {
      const o = i * 6, ao = i * 2;
      if (i >= rb.n) { pos.fill(0, o, o + 6); alpha[ao] = alpha[ao + 1] = 0; continue; }
      const pi = i * 3, px = pts[pi], py = pts[pi + 1], pz = pts[pi + 2];
      const pv = Math.max(i - 1, 0) * 3, nx = Math.min(i + 1, rb.n - 1) * 3;
      _dir.set(pts[pv] - pts[nx], pts[pv + 1] - pts[nx + 1], pts[pv + 2] - pts[nx + 2]);
      if (_dir.lengthSq() < 1e-10) _cross.copy(rb.lastCross);
      else {
        _dir.normalize(); _toCam.set(_cam.x - px, _cam.y - py, _cam.z - pz).normalize();
        _cross.crossVectors(_dir, _toCam); if (_cross.lengthSq() < 1e-10) _cross.crossVectors(_dir, _fb);
        _cross.normalize(); rb.lastCross.copy(_cross);
      }
      const fade = 1 - i / SEG, w = P.width * fade;
      pos[o] = px + _cross.x * w; pos[o + 1] = py + _cross.y * w; pos[o + 2] = pz + _cross.z * w;
      pos[o + 3] = px - _cross.x * w; pos[o + 4] = py - _cross.y * w; pos[o + 5] = pz - _cross.z * w;
      alpha[ao] = alpha[ao + 1] = fade * fade * P.alphaGain;
    }
    rb.posA.needsUpdate = true; rb.alA.needsUpdate = true;
  }
  function reset() { for (const rb of ribbons) { rb.n = 0; rb.alpha.fill(0); rb.pos.fill(0); rb.posA.needsUpdate = rb.alA.needsUpdate = true; } }
  setAnchors(anchors);
  return {
    group, params: P, setAnchors, reset,
    update(dt, kmh, camera) {
      const f = smooth(P.kmhOn, P.kmhFull, kmh || 0), want = active ? f : 0;
      opacity += (want - opacity) * Math.min(1, dt * (want > opacity ? 5 : 3));
      mat.uniforms.uOpacity.value = opacity; mat.uniforms.uWhite.value = f * P.white;
      if (!camera) return; camera.getWorldPosition(_cam);
      for (const rb of ribbons) {
        if (!rb.anchor) continue;
        rb.anchor.updateWorldMatrix(true, false); rb.anchor.getWorldPosition(_p);
        push(rb, _p.x, _p.y, _p.z);
        if (f <= 0.01 && rb.n > 1) rb.n--; // Einzug: keine Bewegung, keine Striche
        write(rb);
      }
      group.visible = opacity > 0.002;
    },
    setActive(on) { active = !!on; if (!on) reset(); },
    get count() { return ribbons.length; },
    get points() { return ribbons.length ? ribbons[0].n : 0; },
    get opacity() { return opacity; },
    dispose() { setAnchors([]); mat.dispose(); }
  };
}

/* ======================= Manöver-Linien · radial, hell, nur auf Auslöser =======================
 * Spindel-Shader und Ring-Logik aus travel/KFB Travel Combat v25/terrain-v25/speed-lines.js (Port TinySkies SpeedLines.ts).
 * R2: additiv statt Knet-Lila, damit sie aufhellen; Auslöser statt Dauerbetrieb. */
function maneuverLines(T, P) {
  const N = VFX_CAPS.lines, R = rng(P.seed ^ 0x51);
  const active = new Uint8Array(N), life = new Float32Array(N), maxLife = new Float32Array(N), rate = new Float32Array(N);
  const ang = new Float32Array(N), off = new Float32Array(N), len = new Float32Array(N), wid = new Float32Array(N), sd = new Float32Array(N);
  const positions = new Float32Array(N * 12), uvs = new Float32Array(N * 8), lifeA = new Float32Array(N * 4), seedA = new Float32Array(N * 4), index = new Uint16Array(N * 6);
  for (let i = 0; i < N; i++) { const v = i * 4; index.set([v, v + 1, v + 2, v, v + 2, v + 3], i * 6); uvs.set([0, 0, 1, 0, 1, 1, 0, 1], v * 2); }
  const geo = new THREE.BufferGeometry();
  const posA = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  const lifeBA = new THREE.BufferAttribute(lifeA, 1).setUsage(THREE.DynamicDrawUsage);
  const seedBA = new THREE.BufferAttribute(seedA, 1).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posA); geo.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2)); geo.setAttribute('aLife', lifeBA); geo.setAttribute('aSeed', seedBA);
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uGlow: { value: new THREE.Color(T.lineGlow) }, uOpacity: { value: 0 }, uLump: { value: P.lineLump } },
    vertexShader: `attribute vec2 aUv; attribute float aLife; attribute float aSeed; varying vec2 vUv; varying float vLife; varying float vSeed;
      void main(){ vUv = aUv; vLife = aLife; vSeed = aSeed; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `uniform vec3 uGlow; uniform float uOpacity; uniform float uLump; varying vec2 vUv; varying float vLife; varying float vSeed;
      void main(){
        float taper = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
        float halfW = taper * 0.35 * (1.0 + uLump * sin(vUv.x * 13.0 + vSeed * 6.283) * sin(vUv.x * 5.0 - vSeed * 3.1));
        float d = abs(vUv.y - 0.5);
        float shape = 1.0 - smoothstep(halfW * 0.6, halfW, d);
        float fade = smoothstep(0.0, 0.4, vLife) * smoothstep(1.0, 0.5, vLife);
        float a = shape * fade * uOpacity;
        if (a <= 0.002) discard;
        float core = 1.0 - smoothstep(0.0, halfW * 0.7, d);
        vec3 col = mix(uGlow, vec3(1.0), core);
        gl_FragColor = vec4(col * a, a);
      }`,
    transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, premultipliedAlpha: true, toneMapped: false
  });
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 999; mesh.name = 'kfbManeuverLines';
  let spawnAcc = 0, gOp = 0, cursor = 0, aspect = 16 / 9;
  const rnd = (a, b) => a + R() * (b - a);
  const hide = (v) => { lifeA[v] = lifeA[v + 1] = lifeA[v + 2] = lifeA[v + 3] = 0; };
  function spawn() {
    let i = -1; for (let k = 0; k < N; k++) { const j = (cursor + k) % N; if (!active[j]) { i = j; break; } }
    if (i < 0) return; cursor = (i + 1) % N;
    active[i] = 1; life[i] = 0; ang[i] = R() * Math.PI * 2;
    if (P.keepFigureFree && Math.sin(ang[i]) < -0.55 && Math.abs(Math.cos(ang[i])) < 0.5) ang[i] += Math.PI;
    off[i] = rnd(P.r0, P.r1); len[i] = rnd(P.lenMin, P.lenMax); wid[i] = rnd(P.widMin, P.widMax);
    rate[i] = rnd(0.5, 1.3); maxLife[i] = rnd(0.3, 0.7); sd[i] = R();
  }
  return {
    mesh,
    setAspect(a) { if (a > 0) aspect = a; },
    get live() { let c = 0; for (let i = 0; i < N; i++) c += active[i]; return c; },
    get opacity() { return mat.uniforms.uOpacity.value; },
    update(dt, f) {
      gOp += (f - gOp) * Math.min(1, dt * (f > gOp ? 14 : 4));
      mat.uniforms.uOpacity.value = gOp * P.lineOpacity;
      if (f > 0.02) { const iv = 0.015 + (1 - f) * 0.06; spawnAcc += dt; let g = 0; while (spawnAcc >= iv && g++ < N) { spawnAcc -= iv; spawn(); } } else spawnAcc = 0;
      for (let i = 0; i < N; i++) {
        const v = i * 4; if (!active[i]) { hide(v); continue; }
        life[i] += dt * rate[i]; if (life[i] >= maxLife[i]) { active[i] = 0; hide(v); continue; }
        const t = life[i] / maxLife[i], r = off[i] - t * 0.15, ca = Math.cos(ang[i]), sa = Math.sin(ang[i]);
        const cx = ca * r, cy = sa * r, hx = ca * len[i] * 0.5, hy = sa * len[i] * 0.5, w = wid[i] * (1 + 0.35 * f) * 0.5, px = -sa * w, py = ca * w, p = v * 3;
        positions[p] = (cx - hx - px) / aspect; positions[p + 1] = cy - hy - py;
        positions[p + 3] = (cx + hx - px) / aspect; positions[p + 4] = cy + hy - py;
        positions[p + 6] = (cx + hx + px) / aspect; positions[p + 7] = cy + hy + py;
        positions[p + 9] = (cx - hx + px) / aspect; positions[p + 10] = cy - hy + py;
        lifeA[v] = lifeA[v + 1] = lifeA[v + 2] = lifeA[v + 3] = t; seedA[v] = seedA[v + 1] = seedA[v + 2] = seedA[v + 3] = sd[i];
      }
      posA.needsUpdate = true; lifeBA.needsUpdate = true; seedBA.needsUpdate = true;
      mesh.visible = mat.uniforms.uOpacity.value > 0.002;
    },
    reset() { active.fill(0); lifeA.fill(0); gOp = 0; spawnAcc = 0; lifeBA.needsUpdate = true; },
    dispose() { geo.dispose(); mat.dispose(); }
  };
}

/* ======================= Überflug · Staub über Boden, Gischt über Wasser =======================
 * Quelle: TinySkies CarpetWake.ts über travel/KFB Travel Globe v13-1/globe-v13/carpet-wake.js.
 * Übernommen: Emission an der Oberfläche UNTER dem Fahrzeug in zwei Fahnen links/rechts, Ringpuffer, Ein-Blende,
 * Alpha (1−t)², Größe (1 − t/2), echter Projektionsfaktor + Pixeldeckel (v13-Befund 3).
 * Neu: flache Welt statt Globus, Höhen-Tor, Boden als Knet-Staub mit dunklerem Rand, Raten auf Sekunden statt Bilder. */
function skimFx(T, P) {
  const N = VFX_CAPS.skim;
  const pos = new Float32Array(N * 3), colA = new Float32Array(N * 3), alp = new Float32Array(N), siz = new Float32Array(N);
  const px = new Float32Array(N * 3), vel = new Float32Array(N * 3), age = new Float32Array(N), life = new Float32Array(N), size0 = new Float32Array(N);
  const geo = new THREE.BufferGeometry();
  const aP = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage), aC = new THREE.BufferAttribute(colA, 3).setUsage(THREE.DynamicDrawUsage);
  const aA = new THREE.BufferAttribute(alp, 1).setUsage(THREE.DynamicDrawUsage), aS = new THREE.BufferAttribute(siz, 1).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', aP); geo.setAttribute('aCol', aC); geo.setAttribute('aAlpha', aA); geo.setAttribute('aSize', aS);
  const mat = new THREE.ShaderMaterial({
    uniforms: { projF: { value: 600 }, maxPx: { value: 48 } },
    vertexShader: `attribute float aAlpha; attribute float aSize; attribute vec3 aCol; uniform float projF; uniform float maxPx; varying float vA; varying vec3 vC;
      void main(){ vA = aAlpha; vC = aCol; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(maxPx, aSize * projF / max(0.35, -mv.z)); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; varying vec3 vC;
      void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard;
        float a = vA * (1.0 - smoothstep(0.72, 1.0, d)); if (a <= 0.003) discard;
        gl_FragColor = vec4(mix(vC, vC * 0.8, smoothstep(0.5, 0.9, d)), a); }`,
    transparent: true, depthWrite: false
  });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false; points.renderOrder = 3; points.name = 'kfbSkim';
  const cDust = new THREE.Color(T.dust), cSpray = new THREE.Color(T.spray), R = rng(P.seed ^ 0x77);
  const _b = new THREE.Vector3(), _last = new THREE.Vector3(), _f = new THREE.Vector3(), _r = new THREE.Vector3();
  let slot = 0, acc = 0, blend = 0, live = 0, hasLast = false, water = false, enabled = P.skim !== false;
  function emit(ox, oy, oz, sx, sz, isWater) {
    const k = slot; slot = (slot + 1) % N; const b = k * 3, c = isWater ? cSpray : cDust;
    life[k] = isWater ? 0.6 + R() * 0.7 : 0.5 + R() * 0.6; age[k] = 0;
    size0[k] = (isWater ? 0.22 : 0.34) * (0.7 + 0.6 * R());
    px[b] = ox + (R() - 0.5) * 0.3; px[b + 1] = oy + 0.05; px[b + 2] = oz + (R() - 0.5) * 0.3;
    const out = (0.5 + R()) * (isWater ? 3.2 : 2.4), up = (0.4 + R()) * (isWater ? 3.4 : 1.6);
    vel[b] = sx * out; vel[b + 1] = up; vel[b + 2] = sz * out;
    colA[b] = c.r; colA[b + 1] = c.g; colA[b + 2] = c.b;
  }
  return {
    points,
    get live() { return live; }, get blend() { return blend; }, get water() { return water; },
    setEnabled(on) { enabled = !!on; if (!on) { life.fill(0); alp.fill(0); aA.needsUpdate = true; blend = 0; } },
    get enabled() { return enabled; },
    setViewHeight(h, fov) { mat.uniforms.projF.value = h / (2 * Math.tan((fov || 52) * Math.PI / 360)); },
    update(dt, kmh, body, surfaceAt) {
      let gate = 0;
      if (body && enabled) {
        body.updateWorldMatrix(true, false); body.getWorldPosition(_b);
        const s = surfaceAt ? surfaceAt(_b.x, _b.z) : { y: 0, water: false }; water = !!s.water;
        const h = _b.y - (s.y || 0);
        gate = smooth(P.skimKmhOn, P.skimKmhFull, kmh) * (1 - smooth(P.skimAltFull, P.skimAltMax, h));
        if (hasLast) _f.set(_b.x - _last.x, 0, _b.z - _last.z); else _f.set(0, 0, -1);
        if (_f.lengthSq() < 1e-8) _f.set(0, 0, -1); _f.normalize(); _r.set(-_f.z, 0, _f.x);
        blend += (gate - blend) * Math.min(1, dt * 6);
        if (blend > 0.01) {
          acc += dt * P.skimRate * blend; let g = 0;
          while (acc >= 1 && g++ < 24) {
            acc -= 1; const sgn = g & 1 ? 1 : -1;
            emit(_b.x + _r.x * sgn * 0.4 + _f.x * 0.3, s.y || 0, _b.z + _r.z * sgn * 0.4 + _f.z * 0.3, _r.x * sgn, _r.z * sgn, water);
          }
        } else acc = 0;
        _last.copy(_b); hasLast = true;
      }
      let n = 0; const G = P.skimGravity * dt;
      for (let i = 0; i < N; i++) {
        if (life[i] <= 0) { if (alp[i] !== 0) { alp[i] = 0; siz[i] = 0; } continue; }
        age[i] += dt; if (age[i] >= life[i]) { life[i] = 0; alp[i] = 0; siz[i] = 0; continue; }
        n++; const b = i * 3, t = age[i] / life[i];
        const drag = Math.exp(-2.2 * dt); vel[b] *= drag; vel[b + 2] *= drag; vel[b + 1] -= G;
        px[b] += vel[b] * dt; px[b + 1] = Math.max(0.02, px[b + 1] + vel[b + 1] * dt); px[b + 2] += vel[b + 2] * dt;
        pos[b] = px[b]; pos[b + 1] = px[b + 1]; pos[b + 2] = px[b + 2];
        alp[i] = Math.min(1, age[i] / 0.12) * (1 - t) * (1 - t) * P.skimAlpha;
        siz[i] = size0[i] * (1 - t * 0.5) * (1 + t * 0.9);
      }
      live = n; aP.needsUpdate = aA.needsUpdate = aS.needsUpdate = aC.needsUpdate = true;
      points.visible = n > 0;
    },
    reset() { life.fill(0); alp.fill(0); aA.needsUpdate = true; blend = 0; hasLast = false; },
    dispose() { geo.dispose(); mat.dispose(); }
  };
}

/* ======================= createFlightVfx ======================= */
export function createFlightVfx({ scene, camera, palette = {}, nozzles = [], trails = [], body = null, surfaceAt = null, speedMax = 220, seed = 7, params = {} } = {}) {
  const T = { ...FLIGHT_VFX_THEME, ...palette };
  const P = Object.assign({
    seed,
    r0: 0.95, r1: 1.10, lenMin: 0.35, lenMax: 0.84, widMin: 0.006, widMax: 0.012, lineOpacity: 0.85, lineLump: 0.14, keepFigureFree: true,
    jetRate: 46, jetLife: [0.32, 0.62], jetSpeed: [2.2, 6.5], jetSize: [0.07, 0.15], inherit: 0.78, dropGravity: 5.5, idleThrust: 0.14,
    puffCount: 12,
    skim: true, skimRate: 110, skimKmhOn: 50, skimKmhFull: 140, skimAltFull: 1.6, skimAltMax: 4.5, skimGravity: 6, skimAlpha: 0.85
  }, params);
  const R = rng(seed);
  const root = new THREE.Group(); root.name = 'kfbFlightVfx';
  const lines = maneuverLines(T, P);
  const trailFx = createSpeedTrails({ anchors: trails, params: { tint: T.trail, ...(params.trails || {}) } });
  const skim = skimFx(T, P);
  const base = lumpGeo(1.3);
  const jet = instMesh(base, clayMat(0.62, 'jet'), VFX_CAPS.jet);
  const dust = instMesh(base, clayMat(0.0, 'dust'), VFX_CAPS.puff);
  jet.mesh.name = 'kfbJetClay'; dust.mesh.name = 'kfbPuffClay';
  root.add(jet.mesh, dust.mesh, skim.points, trailFx.group); scene.add(root, lines.mesh);

  const C = { core: new THREE.Color(T.core), hot: new THREE.Color(T.hot), mid: new THREE.Color(T.mid), lo: new THREE.Color(T.lo), smoke: new THREE.Color(T.smoke), dust: new THREE.Color(T.dust), dustLo: new THREE.Color(T.dustLo) };
  const RAMP = [C.core, C.hot, C.mid, C.lo, C.smoke];
  const col = new THREE.Color(), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), V = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  const ramp = (t, out) => { const x = clamp01(t) * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(x)); return out.copy(RAMP[i]).lerp(RAMP[i + 1], x - i); };

  const JN = VFX_CAPS.jet, CORE = 3;
  const jp = Array.from({ length: JN }, () => ({ on: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), age: 0, life: 1, s: 1, sd: 0 }));
  const dp = Array.from({ length: VFX_CAPS.puff }, () => ({ on: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), age: 0, life: 1, s: 1, ground: 0, crumb: 0, rx: 0 }));
  let noz = [], jetAcc = 0, t = 0, grounded = null, thrustDisp = 0, man = { amt: 0, el: 0, dur: 0, str: 0 };
  function setNozzles(list) {
    noz = (list || []).map((n) => ({ object: n.object, offset: new THREE.Vector3().fromArray(n.offset || [0, 0, 0]), dir: new THREE.Vector3().fromArray(n.dir || [0, -1, 0]).normalize(), scale: n.scale || 1,
      wp: new THREE.Vector3(), wd: new THREE.Vector3(), last: null, vel: new THREE.Vector3() }));
  }
  setNozzles(nozzles);
  const takeJ = () => { for (let i = CORE * 2; i < JN; i++) if (!jp[i].on) return jp[i]; return null; };
  const takeD = () => { for (const d of dp) if (!d.on) return d; return null; };

  function puff(pos, { strength = 1 } = {}) {
    const n = Math.round(P.puffCount * (0.6 + 0.4 * strength)), at = new THREE.Vector3().copy(pos);
    for (let i = 0; i < n; i++) {
      const d = takeD(); if (!d) break;
      const a = (i / n) * Math.PI * 2 + R() * 0.4, sp = (1.6 + R() * 1.6) * (0.7 + 0.5 * strength);
      d.on = 1; d.age = 0; d.life = 0.7 + R() * 0.45; d.s = (0.22 + R() * 0.16) * (0.8 + 0.4 * strength); d.crumb = 0; d.ground = at.y; d.rx = R() * 6;
      d.p.set(at.x + Math.cos(a) * 0.35, at.y + 0.08, at.z + Math.sin(a) * 0.35); d.v.set(Math.cos(a) * sp, 0.5 + R() * 0.7, Math.sin(a) * sp);
    }
    for (let i = 0; i < 4 + Math.round(3 * strength); i++) {
      const d = takeD(); if (!d) break;
      const a = R() * Math.PI * 2, sp = 2.4 + R() * 2.2;
      d.on = 1; d.age = 0; d.life = 0.9 + R() * 0.4; d.s = 0.06 + R() * 0.05; d.crumb = 1; d.ground = at.y; d.rx = R() * 6;
      d.p.set(at.x, at.y + 0.1, at.z); d.v.set(Math.cos(a) * sp, 2.2 + R() * 1.8, Math.sin(a) * sp);
    }
  }

  function update(dt, speed = 0, thrust = 0) {
    dt = Math.min(0.05, Math.max(0, dt)); t += dt;
    const kmh = +speed || 0;
    const th = clamp01(thrust); thrustDisp += (th - thrustDisp) * (1 - Math.exp(-10 * dt));
    if (camera && camera.aspect) lines.setAspect(camera.aspect);
    if (man.dur > 0) { man.el += dt; const rem = man.dur - man.el; man.amt = rem > 0 ? man.str * smooth(0, 0.12, man.el) * smooth(0, 0.35, rem) : 0; if (rem <= 0) man.dur = 0; }
    lines.update(dt, man.amt);
    trailFx.update(dt, kmh, camera);
    skim.update(dt, kmh, body, surfaceAt);

    for (const n of noz) {
      if (!n.object) continue;
      n.object.updateWorldMatrix(true, false);
      n.wp.copy(n.offset).applyMatrix4(n.object.matrixWorld);
      n.wd.copy(n.dir).transformDirection(n.object.matrixWorld);
      if (n.last && dt > 0) n.vel.subVectors(n.wp, n.last).divideScalar(dt); else n.vel.set(0, 0, 0);
      (n.last = n.last || new THREE.Vector3()).copy(n.wp);
    }
    if (thrustDisp > 0.03 && noz.length) {
      jetAcc += dt * P.jetRate * (0.35 + thrustDisp) * thrustDisp / Math.max(thrustDisp, 0.3) * noz.length; // Schweben: wenige Tropfen
      let g = 0;
      while (jetAcc >= 1 && g++ < 16) {
        jetAcc -= 1; const n = noz[Math.floor(R() * noz.length)], q = takeJ(); if (!q) break;
        const sp = P.jetSpeed[0] + (P.jetSpeed[1] - P.jetSpeed[0]) * thrustDisp * (0.8 + 0.4 * R());
        q.on = 1; q.age = 0; q.life = P.jetLife[0] + (P.jetLife[1] - P.jetLife[0]) * R(); q.sd = R();
        q.s = (P.jetSize[0] + (P.jetSize[1] - P.jetSize[0]) * thrustDisp) * n.scale * (0.8 + 0.4 * R());
        q.p.copy(n.wp).addScaledVector(n.wd, 0.06);
        q.v.copy(n.wd).multiplyScalar(sp).addScaledVector(n.vel, P.inherit);
        q.v.x += (R() - 0.5) * 0.9; q.v.y += (R() - 0.5) * 0.9; q.v.z += (R() - 0.5) * 0.9;
      }
    } else jetAcc = 0;

    let k = 0; const fa = jet.fade.array;
    noz.slice(0, 2).forEach((n, ni) => {
      for (let c = 0; c < CORE; c++) {
        if (thrustDisp < 0.03) continue;
        const wob = Math.sin(t * (21 + c * 4) + ni * 1.7 + c) * 0.08 + Math.sin(t * 9.3 + c) * 0.05;
        const L = (0.05 + 0.13 * c) * (0.55 + 0.9 * thrustDisp) * n.scale;
        const s = (0.085 - c * 0.018) * (0.75 + 0.6 * thrustDisp) * n.scale * (1 + wob);
        V.copy(n.wp).addScaledVector(n.wd, L);
        Q.setFromUnitVectors(UP, n.wd); S.set(s * (1 - wob * 0.5), s * (1.5 + thrustDisp * 0.9 + wob), s * (1 - wob * 0.5));
        M.compose(V, Q, S); jet.mesh.setMatrixAt(k, M); jet.mesh.setColorAt(k, ramp(c * 0.16, col)); fa[k] = 0; k++;
      }
    });
    for (let i = CORE * 2; i < JN; i++) {
      const q = jp[i]; if (!q.on) continue;
      q.age += dt; const u = q.age / q.life; if (u >= 1) { q.on = 0; continue; }
      const drag = u < 0.35 ? 3.5 : 1.6; q.v.multiplyScalar(Math.exp(-drag * dt));
      if (u > 0.35) q.v.y -= P.dropGravity * dt;
      q.p.addScaledVector(q.v, dt);
      const grow = u < 0.18 ? 0.6 + u / 0.18 * 0.55 : 1.15 - (u - 0.18) / 0.82 * 0.7;
      const st = u < 0.35 ? 1 + Math.min(1.1, q.v.length() * 0.09) : 0.92 + 0.2 * Math.sin(q.age * 30 + q.sd * 6);
      const s = q.s * grow;
      V.copy(q.v); if (V.lengthSq() < 1e-6) V.set(0, -1, 0); V.normalize(); Q.setFromUnitVectors(UP, V);
      S.set(s / Math.sqrt(st), s * st, s / Math.sqrt(st)); M.compose(q.p, Q, S);
      jet.mesh.setMatrixAt(k, M); jet.mesh.setColorAt(k, ramp(0.12 + u * 0.9, col)); fa[k] = smooth(0.5, 1, u) * 0.92; k++;
    }
    jet.mesh.count = k; jet.mesh.instanceMatrix.needsUpdate = true; jet.mesh.instanceColor.needsUpdate = true; jet.fade.needsUpdate = true;

    let m = 0; const da = dust.fade.array;
    for (const d of dp) {
      if (!d.on) continue;
      d.age += dt; const u = d.age / d.life; if (u >= 1) { d.on = 0; continue; }
      if (d.crumb) {
        d.v.y -= 14 * dt; d.p.addScaledVector(d.v, dt);
        if (d.p.y < d.ground + d.s) { d.p.y = d.ground + d.s; d.v.y = Math.abs(d.v.y) * 0.35; d.v.x *= 0.72; d.v.z *= 0.72; }
        d.rx += dt * 9;
        Q.setFromAxisAngle(V.set(d.v.z, 0, -d.v.x).normalize(), d.rx); S.setScalar(d.s * (1 - smooth(0.75, 1, u)));
        col.copy(C.dustLo);
      } else {
        d.v.multiplyScalar(Math.exp(-3.2 * dt)); d.v.y -= 0.6 * dt; d.p.addScaledVector(d.v, dt);
        const g = 0.55 + smooth(0, 0.35, u) * 0.75; const s = d.s * g;
        Q.setFromAxisAngle(UP, d.rx); S.set(s * 1.25, s * (0.78 - 0.3 * u), s * 1.1);
        col.copy(C.dust).lerp(C.dustLo, u * 0.6);
      }
      M.compose(d.p, Q, S); dust.mesh.setMatrixAt(m, M); dust.mesh.setColorAt(m, col);
      da[m] = d.crumb ? 0 : smooth(0.35, 1, u) * 0.95; m++;
    }
    dust.mesh.count = m; dust.mesh.instanceMatrix.needsUpdate = true; dust.mesh.instanceColor.needsUpdate = true; dust.fade.needsUpdate = true;
  }

  function setGrounded(b, pos) {
    if (grounded !== null && b !== grounded && pos) puff(pos, { strength: b ? 1 : 0.75 });
    grounded = !!b;
  }

  return {
    update, puff, setGrounded, setNozzles,
    setTrailAnchors(list) { trailFx.setAnchors(list); },
    maneuver(strength = 1, seconds = 0.9) { man = { amt: man.amt, el: 0, dur: Math.max(0.2, seconds), str: clamp01(strength) }; },
    takeoff: (pos) => puff(pos, { strength: 0.75 }), land: (pos) => puff(pos, { strength: 1 }),
    setSkim(on) { skim.setEnabled(on); },
    setViewHeight(px, fov) { skim.setViewHeight(px, fov || (camera && camera.fov)); },
    setVisible(v) { root.visible = !!v; lines.mesh.visible = !!v; },
    reset() { jp.forEach((q) => (q.on = 0)); dp.forEach((d) => (d.on = 0)); lines.reset(); trailFx.reset(); skim.reset(); thrustDisp = 0; jetAcc = 0; man.dur = 0; man.amt = 0; },
    stats() {
      return { drawCalls: 3 + trailFx.count + (skim.enabled ? 1 : 0), trails: trailFx.count, trailPts: trailFx.points, trailOpacity: +trailFx.opacity.toFixed(2),
        lines: lines.live, lineOpacity: +lines.opacity.toFixed(2), jet: jet.mesh.count, puff: dust.mesh.count,
        skim: skim.live, skimOn: skim.enabled, skimBlend: +skim.blend.toFixed(2), overWater: skim.water, caps: { ...VFX_CAPS } };
    },
    params: P, theme: T, trails: trailFx,
    dispose() { scene.remove(root, lines.mesh); lines.dispose(); trailFx.dispose(); skim.dispose(); [jet, dust].forEach((x) => { x.mesh.geometry.dispose(); x.mesh.material.dispose(); x.mesh.dispose(); }); base.dispose(); }
  };
}
