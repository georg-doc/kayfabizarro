/* KFB · UFO Tractor Beam Event Lab · isolated visual/audio proof · r1 2026-10-06 · r2 2026-10-07
   NO OPEN WORLD WRITES · NO PERSISTENCE · NO WORLD STATE. Renders an event; it does not resolve one.
   The whole event is a pure function of t: scrubbable, seeded, no per-frame random.

   FILE MAP (top → bottom)
     sources        UFOS / BEAMS: pinned repo GLBs, loaded at runtime via jsDelivr → raw.githubusercontent fallback
     CLS            target classes prop | pet | castle: one grammar, different numbers (Dd, Ft, n, size, clear, lift, spin)
     fit/stats      normalise any UFO to UFO_W, measure tris/meshes/mats/clips (source-isolation gate)
     buildTarget    clay proxies (NOT source assets) + dissolve shader patch (threshold front, rim, shadow)
     sampleTarget   surface-sampled particles with per-particle threshold, flight time, size, chunk flag
     BEAM_VS/FS     open cone shader: radius uRT→uRB, Fresnel body, upward bands, swirl, leading edge
     POOL_FS        soft ground footprint under the beam base (no hard rim since r2)
     schedule()     phase table + semantic hooks + event names → the contract (see EVENT_CONTRACT.json)
     mount()        scene, UFO rig, beam, emitter, particles, evaluate(t), loop, public API

   UFO RIG   ufoRoot (position, tilt) → ufoBody (squash) → ufoSpin (yaw) → model
   EMITTER   per model: raycast up at the aperture ring → emitY = highest hull hit + 8 cm (inside the hull).
             Beam, emitter glow, emitter light and Kenney donor beam are placed from ufoBody space every frame,
             so they tilt/squash with the UFO and the hull hides the cone's top edge.
   RUNTIME HANDOFF  only schedule() phases/hooks and CLS numbers are meant to survive; rendering is replaceable. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createPreviewAudio, AUDIO_POOL } from './ufo-audio.js';

const REPO = 'georg-doc/kayfabizarro';
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const cdn = (s) => `https://cdn.jsdelivr.net/gh/${REPO}@${s.commit}/${enc(s.path)}`;
const raw = (s) => `https://raw.githubusercontent.com/${REPO}/${s.commit}/${enc(s.path)}`;
const KPIN = '378b209355b13304e3cff656ec0806ca5b89df28', KT = 'media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/';

export const UFOS = [
  { key: 'rick', label: "Rick's UFO · eeee", role: 'PRIMÄR · Georg', path: 'media/3D_Assets/KFB/ricks ufo by eeee - q6vNUoHZXr.glb', commit: '276728f3f82f729cd1656b61e81d278856d736bb', blob: '4e338d000ab07fd791f5f25ed348a10ec146a097' },
  { key: 'ka', label: 'Kenney UFO A', role: 'Alternative', path: KT + 'enemy-ufo-a.glb', commit: KPIN },
  { key: 'kb', label: 'Kenney UFO B', role: 'Alternative', path: KT + 'enemy-ufo-b.glb', commit: KPIN },
  { key: 'kc', label: 'Kenney UFO C', role: 'Alternative', path: KT + 'enemy-ufo-c.glb', commit: KPIN },
  { key: 'kd', label: 'Kenney UFO D', role: 'Alternative', path: KT + 'enemy-ufo-d.glb', commit: KPIN }
];
export const BEAMS = [
  { key: 'kbeam', label: 'Kenney beam', role: 'Beam-Donor', path: KT + 'enemy-ufo-beam.glb', commit: KPIN },
  { key: 'kburst', label: 'Kenney beam burst', role: 'Beam-Donor', path: KT + 'enemy-ufo-beam-burst.glb', commit: KPIN }
];

/* target classes: same grammar, different numbers */
export const CLS = {
  prop:   { label: 'Kleines Prop', Dd: 1.5, Ft: 0.95, n: 520,  size: [0.055, 0.11], clear: 4.4, lift: 1.0,  spin: 1.3, hop: 0.22, ns: 3.0, cam: [13, 5.6, 19],  look: [0, 4.4, 0] },
  pet:    { label: 'Resident / Cube-Pet', Dd: 1.9, Ft: 1.15, n: 860, size: [0.065, 0.13], clear: 4.8, lift: 0.75, spin: 1.15, hop: 0.3, ns: 2.6, cam: [14, 6.2, 21],  look: [0, 4.9, 0] },
  castle: { label: 'Burg', Dd: 3.6, Ft: 1.7, n: 3400, size: [0.2, 0.44], clear: 5.5, lift: 0.3, spin: 0.75, hop: 0, ns: 0.45, cam: [44, 18, 57], look: [0, 12.5, 0] }
};
const UFO_W = 7, APERTURE = 0.085; // UFO width in m (constant across targets: the scale joke), emitter radius as share of width
const SPREAD = 0.3; // cone slant: base radius grows by this per metre of beam length (minimum)

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k;
const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); }, eo3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

async function fetchFirst(s) {
  let err;
  for (const u of [cdn(s), raw(s)]) { try { const r = await fetch(u); if (!r.ok) throw new Error(r.status + ''); return { buf: await r.arrayBuffer(), url: u }; } catch (e) { err = e; } }
  throw err;
}
async function loadGLB(s) {
  const { buf, url } = await fetchFirst(s);
  const g = await new GLTFLoader().parseAsync(buf, url.slice(0, url.lastIndexOf('/') + 1));
  return { gltf: g, bytes: buf.byteLength, url };
}
function statsOf(root, gltf, bytes) {
  let tris = 0, meshes = 0; const mats = new Set();
  root.updateMatrixWorld(true);
  root.traverse((o) => { if (!o.isMesh) return; meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; [].concat(o.material).forEach((m) => mats.add(m.uuid)); });
  const s = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  return { tris: Math.round(tris), meshes, mats: mats.size, size: [s.x, s.y, s.z].map((v) => +v.toFixed(2)), clips: gltf ? gltf.animations.length : 0, bytes };
}
/* fit to width w, centre at origin; returns half height */
function fit(model, w) {
  const holder = new THREE.Group(); holder.add(model); model.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(model), s = b.getSize(new THREE.Vector3()), k = w / Math.max(s.x, s.z, 1e-6);
  model.scale.multiplyScalar(k); model.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(model), c = b2.getCenter(new THREE.Vector3()); model.position.sub(c);
  holder.userData.halfH = (b2.max.y - b2.min.y) / 2;
  model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return holder;
}

/* ---------- dissolve: clay material with a seeded breakup front + transition rim ---------- */
const NOISE = `
float hh(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hh(i), hh(i + vec3(1,0,0)), f.x), mix(hh(i + vec3(0,1,0)), hh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hh(i + vec3(0,0,1)), hh(i + vec3(1,0,1)), f.x), mix(hh(i + vec3(0,1,1)), hh(i + vec3(1,1,1)), f.x), f.y), f.z); }
float dval(vec3 lp){ float hn = clamp((lp.y - uH0) / (uH1 - uH0), 0.0, 1.0), rn = clamp(length(lp.xz) / uR, 0.0, 1.0);
  return (1.0 - hn) * 0.6 + (1.0 - rn) * 0.12 + vn(lp * uNS + uSeed) * 0.28; }
`;
const DHEAD = 'uniform float uThr, uRimK, uH0, uH1, uR, uNS, uSeed; uniform vec3 uRim; varying vec3 vLP;\n';
function patch(sh, D, rim) {
  Object.assign(sh.uniforms, D);
  sh.vertexShader = 'uniform mat4 uInv; varying vec3 vLP;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n vLP = (uInv * modelMatrix * vec4(transformed, 1.0)).xyz;');
  let f = DHEAD + NOISE + sh.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n float dv = dval(vLP); if (dv < uThr) discard;');
  if (rim) f = f.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += uRim * uRimK * (1.0 - smoothstep(uThr, uThr + 0.055, dv)) * 2.6;');
  sh.fragmentShader = f;
}
function clayMat(color, D) { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.84, metalness: 0 }); m.onBeforeCompile = (sh) => patch(sh, D, true); return m; }
function depthMat(D) { const m = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }); m.onBeforeCompile = (sh) => patch(sh, D, false); return m; }

/* ---------- proxy targets (clay primitives; proxies, not source assets) ---------- */
function buildTarget(kind, D) {
  const g = new THREE.Group(), cache = {}, dm = depthMat(D);
  const add = (geo, color, x, y, z, o = {}) => {
    const m = new THREE.Mesh(geo, cache[color] || (cache[color] = clayMat(color, D)));
    m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rx) m.rotation.x = o.rx; if (o.s) m.scale.set(...o.s);
    m.castShadow = m.receiveShadow = true; m.customDepthMaterial = dm; g.add(m); return m;
  };
  const RB = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 3, r);
  if (kind === 'prop') {
    add(RB(1.1, 1.0, 1.1, 0.08), '#c98a4b', 0, 0.5, 0);
    add(RB(1.15, 0.12, 1.15, 0.04), '#8a5a2e', 0, 0.18, 0); add(RB(1.15, 0.12, 1.15, 0.04), '#8a5a2e', 0, 0.82, 0);
    add(new THREE.SphereGeometry(0.24, 22, 16), '#d9473a', 0, 1.22, 0);
    add(new THREE.CylinderGeometry(0.025, 0.032, 0.16, 8), '#5a3a22', 0, 1.5, 0);
    add(new THREE.SphereGeometry(0.08, 12, 8), '#6fa34a', 0.09, 1.49, 0, { s: [1.7, 0.35, 0.8] });
  } else if (kind === 'pet') {
    add(RB(1.3, 1.15, 1.25, 0.24), '#f0b94e', 0, 0.9, 0);
    for (const [x, z] of [[-0.4, 0.38], [0.4, 0.38], [-0.4, -0.38], [0.4, -0.38]]) add(new THREE.CylinderGeometry(0.13, 0.15, 0.36, 12), '#d79a35', x, 0.18, z);
    for (const x of [-0.28, 0.28]) {
      add(new THREE.SphereGeometry(0.17, 18, 12), '#fbf6ea', x, 1.04, 0.6, { s: [1, 1, 0.55] });
      add(new THREE.SphereGeometry(0.085, 14, 10), '#2a2230', x, 1.02, 0.68, { s: [1, 1, 0.6] });
      add(new THREE.SphereGeometry(0.075, 10, 8), '#ef8a76', x * 1.65, 0.8, 0.6, { s: [1, 0.6, 0.5] });
      add(new THREE.ConeGeometry(0.17, 0.36, 14), '#e3a43f', x * 1.35, 1.64, -0.05);
    }
    add(new THREE.SphereGeometry(0.13, 12, 10), '#e3a43f', 0, 0.72, -0.66);
  } else {
    const wall = '#dcc9a1', tower = '#cfb98f', roof = '#b9583f';
    add(RB(13, 6, 1.2, 0.22), wall, 0, 3, 6.4); add(RB(13, 6, 1.2, 0.22), wall, 0, 3, -6.4);
    add(RB(1.2, 6, 13, 0.22), wall, 6.4, 3, 0); add(RB(1.2, 6, 13, 0.22), wall, -6.4, 3, 0);
    for (let i = 0; i < 6; i++) { const x = -4.6 + i * 1.84; add(RB(0.9, 0.8, 1.3, 0.12), wall, x, 6.4, 6.4); add(RB(0.9, 0.8, 1.3, 0.12), wall, x, 6.4, -6.4); add(RB(1.3, 0.8, 0.9, 0.12), wall, 6.4, 6.4, x); add(RB(1.3, 0.8, 0.9, 0.12), wall, -6.4, 6.4, x); }
    for (const [x, z] of [[-6.4, -6.4], [6.4, -6.4], [-6.4, 6.4], [6.4, 6.4]]) { add(new THREE.CylinderGeometry(1.9, 2.1, 9, 22), tower, x, 4.5, z); add(new THREE.ConeGeometry(2.5, 3.6, 22), roof, x, 10.8, z); }
    add(RB(5.5, 10, 5.5, 0.28), '#e3d3b0', 0, 5, 0);
    add(new THREE.ConeGeometry(4.3, 4.2, 4), '#a84d36', 0, 12.1, 0, { ry: Math.PI / 4 });
    add(RB(2.6, 3.6, 0.4, 0.12), '#4a3a33', 0, 1.8, 7.05);
    for (const y of [6.5, 8.4]) add(RB(0.8, 1.1, 0.2, 0.06), '#4a3a33', 0, y, 2.8);
    add(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8), '#5a4a3f', 0, 15.6, 0);
    add(RB(1.5, 0.85, 0.08, 0.03), '#f3c34a', 0.78, 16.5, 0);
  }
  g.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g);
  g.userData.H0 = b.min.y; g.userData.H1 = b.max.y; g.userData.R = Math.max(Math.hypot(b.max.x, b.max.z), Math.hypot(b.min.x, b.min.z));
  return g;
}

/* surface samples = clay particles; release threshold uses the same formula as dval() (noise term replaced by a seeded draw) */
function sampleTarget(g, n, seed, cls) {
  const r = rng(seed), parts = [];
  let total = 0;
  g.children.forEach((m) => {
    const geo = m.geometry.clone().applyMatrix4(m.matrix), p = geo.attributes.position, idx = geo.index;
    let area = 0; const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), tri = new THREE.Triangle();
    const cnt = idx ? idx.count : p.count;
    for (let i = 0; i < cnt; i += 3) { const a = idx ? idx.getX(i) : i, b2 = idx ? idx.getX(i + 1) : i + 1, c = idx ? idx.getX(i + 2) : i + 2; A.fromBufferAttribute(p, a); B.fromBufferAttribute(p, b2); C.fromBufferAttribute(p, c); area += tri.set(A, B, C).getArea(); }
    parts.push({ geo, area, color: m.material.color }); total += area;
  });
  const { H0, H1, R } = g.userData, P = { n: 0, p: new Float32Array(n * 3), nrm: new Float32Array(n * 3), col: new Float32Array(n * 3), size: new Float32Array(n), thr: new Float32Array(n), ft: new Float32Array(n), rr: new Float32Array(n), rot: new Float32Array(n * 3), chunk: new Uint8Array(n) };
  const pos = new THREE.Vector3(), nor = new THREE.Vector3();
  for (const part of parts) {
    const k = Math.round(n * part.area / total); if (!k) continue;
    const s = new MeshSurfaceSampler(new THREE.Mesh(part.geo)).setRandomGenerator(r).build();
    for (let j = 0; j < k && P.n < n; j++) {
      const i = P.n++; s.sample(pos, nor);
      P.p.set([pos.x, pos.y, pos.z], i * 3); P.nrm.set([nor.x, nor.y, nor.z], i * 3); P.col.set([part.color.r, part.color.g, part.color.b], i * 3);
      const chunk = r() < 0.16; P.chunk[i] = chunk ? 1 : 0;
      P.size[i] = lerp(cls.size[0], cls.size[1], r()) * (chunk ? 1.7 : 1);
      const hn = clamp((pos.y - H0) / (H1 - H0)), rn = clamp(Math.hypot(pos.x, pos.z) / R);
      P.thr[i] = (1 - hn) * 0.6 + (1 - rn) * 0.12 + r() * 0.28;
      P.ft[i] = cls.Ft * (0.8 + 0.4 * r()); P.rr[i] = 0.15 + 0.55 * r();
      P.rot.set([r() * 6.28, r() * 6.28, r() * 6.28], i * 3);
    }
  }
  return P;
}

/* ---------- beam: open cone, radius driven by target bounds, Fresnel + upward bands ---------- */
const BEAM_VS = `uniform float uRT, uRB, uLen; varying float vT, vAng; varying vec3 vN, vW;
void main(){ float t = -position.y; float r = mix(uRT, uRB, t); vec2 d = normalize(position.xz + vec2(1e-5));
  vec3 p = vec3(d.x * r, -t * uLen, d.y * r); vT = t; vAng = atan(d.y, d.x);
  vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * vec3(d.x, (uRB - uRT) / max(uLen, 0.001), d.y));
  gl_Position = projectionMatrix * viewMatrix * w; }`;
const BEAM_FS = `uniform vec3 uCore, uGlow; uniform float uAlpha, uReach, uTime, uLen, uK; varying float vT, vAng; varying vec3 vN, vW;
void main(){ if (vT > uReach) discard;
  vec3 V = normalize(cameraPosition - vW); float f = 1.0 - abs(dot(normalize(vN), V));
  float body = uK * 0.06 + pow(f, 2.4) * 0.5;
  float bands = 0.7 + 0.3 * sin(vT * uLen * 1.25 + uTime * 5.0);
  float swirl = 0.86 + 0.14 * sin(vAng * 7.0 + vT * uLen * 0.5 - uTime * 2.2);
  float fade = smoothstep(0.0, 0.05, vT) * (1.0 - 0.6 * smoothstep(0.8, 1.0, vT));
  float edge = smoothstep(uReach - 0.07, uReach, vT) * (1.0 - step(0.995, uReach));
  float a = clamp((body * bands * swirl * fade + edge * 0.45) * uAlpha, 0.0, 1.0);
  vec3 col = mix(uGlow, uCore, clamp((1.0 - vT) * 0.3 + edge * 0.8, 0.0, 1.0)) * 0.8;
  gl_FragColor = vec4(col * a, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
function beamMesh(U) {
  const geo = new THREE.CylinderGeometry(1, 1, 1, 72, 28, true).translate(0, -0.5, 0);
  const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: U, vertexShader: BEAM_VS, fragmentShader: BEAM_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor }));
  m.frustumCulled = false; m.renderOrder = 20; return m;
}
const POOL_FS = `uniform vec3 uGlow, uCore; uniform float uAlpha, uTime; varying vec2 vUv;
void main(){ float r = length(vUv - 0.5) * 2.0; if (r > 1.0) discard;
  float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.6) * 0.3;
  a *= 0.8 + 0.2 * sin(r * 14.0 + uTime * 5.0); a *= uAlpha;
  gl_FragColor = vec4(mix(uGlow, uCore, 1.0 - r) * a, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function labelSprite(lines, accent) {
  const cv = document.createElement('canvas'); cv.width = 640; cv.height = 200; const c = cv.getContext('2d');
  c.fillStyle = 'rgba(19,17,25,0.88)'; c.beginPath(); c.roundRect(4, 4, 632, 192, 18); c.fill();
  c.fillStyle = accent; c.font = '700 40px "JetBrains Mono", ui-monospace, monospace'; c.fillText(lines[0], 26, 58);
  c.fillStyle = '#cfc6dd'; c.font = '400 26px "JetBrains Mono", ui-monospace, monospace'; lines.slice(1).forEach((l, i) => c.fillText(l, 26, 104 + i * 38));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthWrite: false })); s.scale.set(4.8, 1.5, 1); return s;
}

/* ---------- schedule ---------- */
function schedule(c, ending) {
  const P = []; let t = 0; const add = (id, hook, d, ev) => { P.push({ id, hook, ev, t0: t, t1: t + d }); t += d; };
  const Ttr = c.Dd + c.Ft * 1.2;
  add('ARRIVE', 'ufo.arrive', 2.6, 'UFO_APPROACHING');
  add('HOVER', 'ufo.hover', 1.1, 'UFO_HOVERING');
  add('LOCK', 'beam.lock', 0.9, 'TRACTOR_BEAM_TARGET_LOCKED');
  add('CHARGE', 'beam.charge', 1.1, 'ABDUCTION_STARTED');
  add('DEMAT', 'beam.transfer.start', c.Dd * 0.5, 'ABDUCTION_MATERIAL_BREAKUP');
  add('TRANSFER', 'beam.transfer.loop', Ttr - c.Dd * 0.5, '—');
  add('COMPLETE', 'beam.transfer.complete', 1.0, 'ABDUCTION_COMPLETED');
  if (ending === 'return') add('RETURN', 'ufo.drop', 0.35 + 0.6 + Ttr + 0.8, 'ABDUCTED_OBJECT_RETURNED');
  add('DEPART', 'ufo.depart', 2.4, 'UFO_DEPARTING');
  const by = Object.fromEntries(P.map((p) => [p.id, p]));
  return { phases: P, by, dur: t, Ttr };
}

const LS = 'kfb-ufo-lab-v1';

export async function mount(host, opts = {}) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } })();
  const S = { target: saved.target || opts.target || 'pet', ufo: saved.ufo || 'rick', ending: saved.ending || 'return', beam: saved.beam || 'shader', view: saved.view || 'event', t: +saved.t || 0, playing: false, speed: 1, seed: opts.seed ?? 7, density: opts.density ?? 1 };
  const tint = new THREE.Color(opts.beamTint || '#c8f59a'), core = new THREE.Color('#fffbe2');

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1200);
  const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.495; controls.minDistance = 3; controls.maxDistance = 220;

  /* sky, fog, light, ground */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { uTop: { value: new THREE.Color('#2d2b57') }, uHor: { value: new THREE.Color('#e9a283') }, uGlow: { value: new THREE.Color('#ffd3a3') } },
    vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 uTop, uHor, uGlow; varying vec3 vD; void main(){ float h = normalize(vD).y; vec3 c = mix(uHor, uTop, smoothstep(-0.02, 0.55, h)); c = mix(c, uGlow, exp(-abs(h) * 14.0) * 0.45); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}' }));
  scene.add(sky); scene.fog = new THREE.Fog('#c99a8a', 90, 420);
  scene.add(new THREE.HemisphereLight('#bcb6ef', '#7a6248', 1.15));
  const sun = new THREE.DirectionalLight('#ffd6ae', 2.5); sun.position.set(-25, 50, 22); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(500, 72).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#8e9a64', roughness: 1 })); ground.receiveShadow = true; scene.add(ground);
  { const r = rng(3), cols = ['#7f8c58', '#a1a46c', '#6f7d4c', '#b39c6c']; const geo = new THREE.SphereGeometry(1, 16, 10);
    for (let i = 0; i < 70; i++) { const a = r() * 6.283, d = 24 + r() * 150, s = 0.6 + r() * 2.6; const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: cols[i % 4], roughness: 0.95 })); m.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); m.scale.set(s * (1 + r()), s * 0.45, s * (1 + r() * 0.6)); m.rotation.y = r() * 3; m.castShadow = m.receiveShadow = true; scene.add(m); } }

  const ev = new THREE.Group(), src = new THREE.Group(); scene.add(ev, src);

  /* UFO rig: root (position, tilt) → body (squash) → spin → model */
  const ufoRoot = new THREE.Group(), ufoBody = new THREE.Group(), ufoSpin = new THREE.Group(); ufoRoot.add(ufoBody); ufoBody.add(ufoSpin); ev.add(ufoRoot);
  const models = {}, stats = {}, loading = {}; let mixer = null, clipDur = 0, halfH = 1, lastRW = 0;
  const beamLight = new THREE.PointLight(tint, 0, 30, 2); ev.add(beamLight);

  /* beam */
  const BU = { uRT: { value: 1 }, uRB: { value: 2 }, uLen: { value: 5 }, uCore: { value: core }, uGlow: { value: tint }, uAlpha: { value: 0 }, uReach: { value: 0 }, uTime: { value: 0 }, uK: { value: 1.35 } };
  const beam = new THREE.Group(), beamOuter = beamMesh(BU); beam.add(beamOuter); ev.add(beam);
  const PU = { uGlow: { value: tint }, uCore: { value: core }, uAlpha: { value: 0 }, uTime: BU.uTime };
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: PU, transparent: true, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: POOL_FS }));
  pool.position.y = 0.04; pool.renderOrder = 19; ev.add(pool);
  const glowTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
  const emitGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color().copy(tint).lerp(core, 0.55), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); emitGlow.renderOrder = 21; ev.add(emitGlow);
  const emitLight = new THREE.PointLight(tint, 0, UFO_W * 0.7, 2); ev.add(emitLight);
  let emitY = -1; // emitter height in UFO body space: just above the hull surface around the aperture (raycast per model)
  let donorBeam = null;

  /* target + particles */
  const D = { uThr: { value: -1 }, uRimK: { value: 0 }, uH0: { value: 0 }, uH1: { value: 1 }, uR: { value: 1 }, uNS: { value: 1 }, uSeed: { value: 0 }, uRim: { value: tint }, uInv: { value: new THREE.Matrix4() } };
  const tRoot = new THREE.Group(); ev.add(tRoot);
  let target = null, P = null, sched = null;
  const CAP = Math.ceil(CLS.castle.n * 1.6);
  const pMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.78 });
  const blobs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), pMat, CAP), chunks = new THREE.InstancedMesh(new RoundedBoxGeometry(1.4, 1, 1.1, 2, 0.22), pMat, CAP);
  for (const m of [blobs, chunks]) { m.count = 0; m.frustumCulled = false; m.castShadow = true; m.setColorAt(0, new THREE.Color()); ev.add(m); }

  function setupTarget() {
    if (target) { tRoot.remove(target); target.traverse((o) => { if (o.isMesh) o.geometry.dispose(); }); }
    const c = CLS[S.target]; target = buildTarget(S.target, D); tRoot.add(target);
    D.uH0.value = target.userData.H0; D.uH1.value = target.userData.H1; D.uR.value = target.userData.R; D.uNS.value = c.ns; D.uSeed.value = (S.seed % 97) * 1.37;
    P = sampleTarget(target, Math.round(c.n * S.density), S.seed * 131 + S.target.length, c);
    sched = schedule(c, S.ending); S.t = clamp(S.t, 0, sched.dur);
    const ext = Math.max(16, target.userData.R * 2 + 10); Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 160 }); sun.shadow.camera.updateProjectionMatrix();
    frame();
  }
  function frame() {
    if (S.view === 'sources') { camera.position.set(4, 12, 33); controls.target.set(4, -0.5, -3); }
    else { const c = CLS[S.target]; camera.position.set(...c.cam); controls.target.set(...c.look); }
    controls.update();
  }
  function bellyY(inst) {
    inst.updateWorldMatrix(true, true); const W = inst.matrixWorld, inv = W.clone().invert(), rc = new THREE.Raycaster(), up = new THREE.Vector3(0, 1, 0).transformDirection(W), ys = [];
    const rr = UFO_W * APERTURE * 1.15;
    for (let k = 0; k <= 12; k++) { const a = k * Math.PI / 6, rad = k ? rr : 0; rc.set(new THREE.Vector3(Math.cos(a) * rad, -halfH * 3, Math.sin(a) * rad).applyMatrix4(W), up);
      const h = rc.intersectObject(inst, true)[0]; if (h) ys.push(h.point.clone().applyMatrix4(inv).y); }
    return ys.length ? Math.max(...ys) + 0.08 : -halfH * 0.6;
  }
  function useUfo(key) {
    const m = models[key]; if (!m) return false;
    ufoSpin.clear(); const inst = m.event; ufoSpin.add(inst); halfH = inst.userData.halfH; mixer = null; clipDur = 0;
    emitY = bellyY(inst);
    const clips = m.gltf ? m.gltf.animations : [];
    if (clips.length) { mixer = new THREE.AnimationMixer(inst); clips.forEach((cl) => { mixer.clipAction(cl).play(); clipDur = Math.max(clipDur, cl.duration); }); }
    S.ufo = key; return true;
  }

  /* ---------- the event as a function of t ---------- */
  const DN = new THREE.Vector3(), G = new THREE.Vector3(), F = new THREE.Vector3(), C1 = new THREE.Vector3(), H = new THREE.Vector3(), A = new THREE.Vector3(), V = new THREE.Vector3(), N = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler(), SC = new THREE.Vector3(), M4 = new THREE.Matrix4(), COL = new THREE.Color(), BC = new THREE.Color(), NM = new THREE.Matrix3();
  const L = { hover: 0, transfer: 0, sweep: 0 };
  function evaluate(t) {
    const c = CLS[S.target], B = sched.by, Ttr = sched.Ttr, R = target.userData.R, top = target.userData.H1;
    H.set(0, top + c.clear + halfH, 0);
    let x = H.x, y = H.y, z = H.z, tx = 0, tz = 0, sx = 1, sy = 1;
    const ua = (t - B.ARRIVE.t0) / (B.ARRIVE.t1 - B.ARRIVE.t0);
    if (ua < 1) {
      F.set(-70, 26, -55).add(H); C1.set(-14, 9, -26).add(H); const e = eo3(ua), q = 1 - e;
      x = q * q * F.x + 2 * q * e * C1.x + e * e * H.x; y = q * q * F.y + 2 * q * e * C1.y + e * e * H.y; z = q * q * F.z + 2 * q * e * C1.z + e * e * H.z;
      tz = 0.42 * q; tx = 0.2 * q;
    } else {
      const v = t - B.ARRIVE.t1; y -= 0.55 * Math.exp(-3.5 * v) * Math.sin(v * 6.5);
      y += 0.2 * Math.sin(t * 2.1) * clamp(v / 0.8); tx += 0.035 * Math.sin(t * 1.3); tz += 0.03 * Math.sin(t * 1.7 + 1);
    }
    const ul = (t - B.LOCK.t0) / (B.LOCK.t1 - B.LOCK.t0);
    if (ul > 0 && ul < 1) { const k = Math.sin(Math.PI * ul); y -= 0.35 * k; sy -= 0.08 * k; sx += 0.05 * k; }
    const uc = (t - B.CHARGE.t0) / (B.CHARGE.t1 - B.CHARGE.t0);
    if (uc > 0 && uc < 1) y += 0.03 * Math.sin(t * 53) * uc;
    const vg = t - (B.COMPLETE.t0 + 0.35);
    if (vg > 0) { const k = Math.exp(-5 * vg) * Math.cos(13 * vg); sy -= 0.17 * k; sx += 0.1 * k; }
    const ud = (t - B.DEPART.t0) / (B.DEPART.t1 - B.DEPART.t0);
    if (ud > 0) {
      const pre = clamp(ud / 0.22), go = clamp((ud - 0.22) / 0.78), k = Math.sin(Math.PI * pre) * (go > 0 ? 0 : 1);
      y -= 0.6 * k; sy -= 0.12 * k; sx += 0.06 * k;
      x += Math.pow(go, 2.4) * 110; z -= Math.pow(go, 2.4) * 46; y += Math.pow(go, 1.6) * 52;
      tz -= 0.38 * clamp(go * 4); tx -= 0.12 * clamp(go * 4); sx -= 0.1 * Math.sin(Math.PI * go); sy += 0.1 * Math.sin(Math.PI * go);
    }
    ufoRoot.position.set(x, y, z); ufoRoot.rotation.set(tx, 0, tz); ufoBody.scale.set(sx, sy, sx); ufoSpin.rotation.y = t * 0.6;
    if (mixer) mixer.setTime(clipDur ? t % clipDur : 0);
    ufoRoot.updateMatrixWorld(true); A.set(0, emitY, 0); ufoBody.localToWorld(A); ev.worldToLocal(A);
    DN.set(0, -1, 0).applyQuaternion(ufoRoot.quaternion);

    /* beam + abduction clock tau (seconds since breakup; Ttr = all particles inside) */
    let reach = 0, alpha = 0, tau = -1, popV = -1, pre = 0;
    if (t >= B.LOCK.t0 && t < B.LOCK.t1) pre = sm(ul / 0.4) * (0.55 + 0.25 * Math.sin(ul * Math.PI * 4));
    if (t >= B.CHARGE.t0 && t < B.DEMAT.t0) pre = 0.6;
    if (t >= B.CHARGE.t0 && t < B.DEMAT.t0) { reach = eo3(uc); alpha = Math.sqrt(clamp(uc)); }
    if (t >= B.DEMAT.t0 && t < B.COMPLETE.t0) { reach = 1; alpha = 1; tau = t - B.DEMAT.t0; }
    if (t >= B.COMPLETE.t0) { tau = Ttr + 1; const u = (t - B.COMPLETE.t0) / 0.55; if (u < 1) { reach = 1 - eo3(u); alpha = 1 - sm(u); } }
    if (B.RETURN && t >= B.RETURN.t0) {
      const r0 = B.RETURN.t0 + 0.35, rm0 = r0 + 0.6, rm1 = rm0 + Ttr;
      if (t >= r0 && t < rm0) { const u = (t - r0) / 0.6; reach = eo3(u); alpha = Math.sqrt(u); }
      if (t >= rm0 && t < rm1) { reach = 1; alpha = 1; tau = Ttr - (t - rm0); }
      if (t >= rm1) { tau = -1; popV = t - rm1; const u = popV / 0.55; reach = u < 1 ? 1 - eo3(u) : 0; alpha = u < 1 ? 1 - sm(u) : 0; }
    }
    const Pd = tau < 0 ? 0 : clamp(tau / c.Dd), rTop = UFO_W * APERTURE;
    const len = Math.max(0.1, (A.y - 0.02) / Math.max(0.3, -DN.y)), rB = Math.max(R * 1.25 + 0.4, rTop + len * SPREAD); lastRW = rB;
    G.copy(DN).multiplyScalar(len).add(A);
    beam.position.copy(A); beam.quaternion.copy(ufoRoot.quaternion);
    BU.uRT.value = rTop; BU.uRB.value = rB; BU.uLen.value = len; BU.uAlpha.value = alpha; BU.uReach.value = reach; BU.uTime.value = t;
    const useDonor = S.beam === 'kenney' && donorBeam;
    beamOuter.visible = !useDonor && alpha > 0.001;
    if (donorBeam) { donorBeam.visible = !!useDonor && alpha > 0.001; donorBeam.position.copy(A); donorBeam.quaternion.copy(ufoRoot.quaternion); donorBeam.scale.set((rTop + rB) / 2, len * reach, (rTop + rB) / 2); donorBeam.userData.mats.forEach((m) => { m.opacity = 0.55 * alpha; }); }
    const foot = alpha * sm((reach - 0.85) / 0.15);
    pool.visible = foot > 0.001; pool.scale.setScalar(rB * 1.2); pool.position.x = G.x; pool.position.z = G.z; PU.uAlpha.value = foot;
    /* emitter: lights up during LOCK, carries the beam, flashes shut on COMPLETE */
    const fl = t - (B.COMPLETE.t0 + 0.45), flash = fl > 0 && fl < 0.4 ? Math.exp(-7 * fl) * sm(fl / 0.04) : 0;
    const em = Math.max(pre, alpha * (0.85 + 0.15 * Math.sin(t * 9)), flash * 1.6);
    emitGlow.visible = em > 0.001; emitGlow.position.copy(DN).multiplyScalar(rTop * 0.35).add(A);
    emitGlow.scale.setScalar(rTop * (3.2 + 1.6 * flash)); emitGlow.material.opacity = Math.min(1, 0.9 * em);
    emitLight.position.copy(DN).multiplyScalar(0.7).add(A); emitLight.intensity = em * 9;
    beamLight.position.lerpVectors(A, G, 0.55); beamLight.distance = len * 1.8; beamLight.intensity = alpha * 2.2 * len * len;

    /* target: wobble, lift, dissolve, pop */
    const thr = tau < 0 ? -1 : Pd * 1.04 - 0.02, k = Pd * (1 - Pd) * 4;
    D.uThr.value = thr; D.uRimK.value = tau < 0 ? 0 : sm(Pd / 0.04) * (1 - sm((Pd - 0.96) / 0.04));
    let ty = 0, tsy = 1, trz = 0;
    if (tau >= 0) { ty = c.lift * sm(tau / (c.Dd * 0.35)); tsy = 1 - 0.06 * Math.sin(tau * 11) * k; trz = 0.16 * Math.sin(tau * 3.1) * k * (S.target === 'castle' ? 0.1 : 1); }
    if (ul > 0 && ul < 1 && c.hop) { const h = Math.sin(Math.PI * clamp((ul - 0.35) / 0.4)); ty += c.hop * h; tsy *= 1 - 0.12 * Math.sin(Math.PI * clamp(ul / 0.35)) + 0.06 * h; }
    if (popV >= 0) tsy *= 1 + 0.16 * Math.exp(-5 * popV) * Math.sin(12 * popV);
    tRoot.position.set(0, ty, 0); tRoot.rotation.set(0, 0, trz); tRoot.scale.set(1 / Math.sqrt(tsy), tsy, 1 / Math.sqrt(tsy));
    tRoot.updateMatrixWorld(true); D.uInv.value.copy(tRoot.matrixWorld).invert();
    target.visible = thr < 1.0;

    /* particles: released when the front passes their threshold, then funnel + swirl into the aperture */
    let nb = 0, nc = 0;
    if (tau >= 0 && tau <= Ttr) {
      NM.getNormalMatrix(tRoot.matrixWorld); const popAmp = c.size[1] * 4, spin = c.spin * Math.PI * 2;
      for (let i = 0; i < P.n; i++) {
        const rel = ((P.thr[i] + 0.02) / 1.04) * c.Dd, s = (tau - rel) / P.ft[i];
        if (s <= 0 || s >= 1) continue;
        V.fromArray(P.p, i * 3).applyMatrix4(tRoot.matrixWorld); N.fromArray(P.nrm, i * 3).applyMatrix3(NM).normalize();
        const dx = V.x - A.x, dz = V.z - A.z, r0 = Math.hypot(dx, dz), th0 = Math.atan2(dz, dx);
        const e = s * s * (3 - 2 * s), r = lerp(r0, rTop * P.rr[i], Math.pow(s, 0.75)), th = th0 + spin * Math.pow(s, 1.4), yy = lerp(V.y, A.y, e);
        const bump = Math.sin(Math.min(1, s / 0.22) * Math.PI) * (1 - s) * popAmp;
        V.set(A.x + Math.cos(th) * r + N.x * bump, yy + N.y * bump, A.z + Math.sin(th) * r + N.z * bump);
        const sc = P.size[i] * Math.min(1, 0.35 + s / 0.08) * (1 - 0.78 * s * s);
        SC.set(sc * (1 - 0.2 * s), sc * (1 + 0.45 * s), sc * (1 - 0.2 * s));
        Q.setFromEuler(E.set(P.rot[i * 3] + s * 6, P.rot[i * 3 + 1] + s * 4, P.rot[i * 3 + 2]));
        M4.compose(V, Q, SC);
        COL.setRGB(P.col[i * 3], P.col[i * 3 + 1], P.col[i * 3 + 2]).lerp(BC.copy(tint), 0.6 * s * s);
        if (P.chunk[i]) { chunks.setMatrixAt(nc, M4); chunks.setColorAt(nc++, COL); } else { blobs.setMatrixAt(nb, M4); blobs.setColorAt(nb++, COL); }
      }
    }
    blobs.count = nb; chunks.count = nc;
    for (const m of [blobs, chunks]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }

    /* audio levels (silence before the beam: hover bed ducks out during LOCK) */
    const inB = (id, a = 0, b = 1) => B[id] && t >= lerp(B[id].t0, B[id].t1, a) && t < lerp(B[id].t0, B[id].t1, b);
    L.hover = (t >= lerp(B.ARRIVE.t0, B.ARRIVE.t1, 0.4) && t < lerp(B.LOCK.t0, B.LOCK.t1, 0.55)) || t >= B.COMPLETE.t0 + 0.4 && t < lerp(B.DEPART.t0, B.DEPART.t1, 0.6) ? 1 : 0;
    L.transfer = tau >= 0 && tau <= Ttr ? alpha * (0.4 + 0.6 * Math.min(1, (nb + nc) / Math.max(1, P.n * 0.15))) : 0;
    L.sweep = clamp(tau / Ttr); if (inB('RETURN')) L.sweep = 1 - L.sweep;
    return { nb, nc, tau, Pd };
  }

  /* ---------- sources: isolate every donor first ---------- */
  function placeSources() {
    src.clear();
    const all = [...UFOS, ...BEAMS];
    all.forEach((s, i) => {
      const m = models[s.key]; const ufo = i < UFOS.length, x = 4 + (ufo ? [0, -12.8, -6.4, 6.4, 12.8][i] : (i - UFOS.length - 0.5) * 12), z = ufo ? (i === 0 ? 2 : 0) : -12;
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.4, 40), new THREE.MeshStandardMaterial({ color: s.key === S.ufo ? '#e8d4a8' : '#b6ac93', roughness: 0.9 }));
      ped.position.set(x, 0.2, z); ped.receiveShadow = ped.castShadow = true; src.add(ped);
      const st = stats[s.key], status = loading[s.key];
      const lines = [s.label, s.role + (s.key === S.ufo ? ' · aktiv' : ''), st ? `${st.tris} tris · ${st.meshes} mesh · ${st.clips} clip` : status === 'error' ? 'FEHLER beim Laden' : 'lädt …'];
      const lab = labelSprite(lines, ufo && i === 0 ? '#ffd9a0' : '#ece6f5'); lab.position.set(x, ufo ? 5.6 : 4.6, z); src.add(lab);
      if (m) { const c = m.src; c.position.set(x, 0.4 + c.userData.halfH + 0.5, z); src.add(c); }
    });
  }

  /* ---------- loading ---------- */
  function emitSoon() { emitAt = 0; }
  async function loadOne(s, isBeam) {
    loading[s.key] = 'loading'; emitSoon();
    try {
      const { gltf, bytes } = await loadGLB(s);
      const sceneObj = gltf.scene; stats[s.key] = statsOf(sceneObj, gltf, bytes);
      const ev1 = fit(sceneObj, isBeam ? 2 : UFO_W);
      const { gltf: g2 } = { gltf }; const src1 = fit(sceneObj.clone(true), isBeam ? 3.2 : 4.4);
      models[s.key] = { gltf: g2, event: ev1, src: src1 };
      loading[s.key] = 'ok';
      if (isBeam && s.key === 'kbeam') makeDonorBeam(sceneObj.clone(true));
    } catch (e) { loading[s.key] = 'error'; stats[s.key] = { err: String(e.message || e) }; }
    if (!isBeam && s.key === S.ufo) useUfo(s.key);
    if (!isBeam && !models[S.ufo] && models[s.key] && loading[S.ufo] === 'error') useUfo(s.key);
    placeSources(); emitSoon();
  }
  function makeDonorBeam(obj) {
    obj.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(obj), s = b.getSize(new THREE.Vector3());
    const holder = new THREE.Group(), inner = new THREE.Group(); inner.add(obj); holder.add(inner);
    inner.scale.set(2 / Math.max(s.x, 1e-6), 1 / Math.max(s.y, 1e-6), 2 / Math.max(s.z, 1e-6));
    const c = b.getCenter(new THREE.Vector3()); obj.position.x -= c.x; obj.position.y -= b.max.y; obj.position.z -= c.z;
    /* keep only the outermost shell (the GLB nests a second, inner cone), render it unlit and front-faces only:
       no back faces showing through, no sun-lit facet */
    const meshes = []; obj.traverse((o) => { if (o.isMesh) meshes.push(o); });
    const wOf = (o) => new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()).x, wMax = Math.max(...meshes.map(wOf));
    const mats = [];
    for (const o of meshes) {
      if (wOf(o) < wMax * 0.92) { o.visible = false; continue; }
      o.material = [].concat(o.material).map((m) => { const k = new THREE.MeshBasicMaterial({ color: m.color ? m.color.clone() : new THREE.Color('#ffffff'), map: m.map || null, transparent: true, depthWrite: false, opacity: 0, side: THREE.FrontSide }); mats.push(k); return k; });
      if (o.material.length === 1) o.material = o.material[0]; o.castShadow = false; o.renderOrder = 20;
    }
    holder.userData.mats = mats; holder.visible = false; donorBeam = holder; ev.add(holder);
  }

  /* ---------- audio (preview only) ---------- */
  const audio = createPreviewAudio(() => emitSoon());

  /* ---------- loop ---------- */
  let raf = 0, last = performance.now(), emitAt = 0, saveAt = 0, hookLog = [], lastInfo = { nb: 0, nc: 0 };
  function fireHooks(t0, t1) {
    for (const p of sched.phases) if (t0 < p.t0 && t1 >= p.t0) { hookLog.unshift({ t: p.t0, hook: p.hook, ev: p.ev }); audio.hook(p.hook, p.hook === 'ufo.drop' ? 'main' : 'all'); }
    if (sched.by.RETURN) { const pop = sched.by.RETURN.t0 + 0.95 + sched.Ttr; if (t0 < pop && t1 >= pop) { hookLog.unshift({ t: pop, hook: 'ufo.drop · pop', ev: 'rematerialized' }); audio.hook('ufo.drop', 'layer'); } }
    hookLog = hookLog.slice(0, 9);
  }
  function resize() { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (S.playing && S.view === 'event') {
      const t0 = S.t; S.t = Math.min(sched.dur, S.t + dt * S.speed); fireHooks(t0, S.t);
      if (S.t >= sched.dur) { S.playing = false; audio.silence(); emitSoon(); }
    }
    controls.update();
    if (S.view === 'event' && target) { lastInfo = evaluate(S.t); if (S.playing) audio.levels(L); else audio.silence(); }
    else audio.silence();
    if (S.view === 'sources') src.children.forEach((o) => { if (o.userData.halfH) o.rotation.y = now / 1000 * 0.4; });
    renderer.render(scene, camera);
    opts.onTick && opts.onTick(S.t, sched ? sched.dur : 1);
    if (now > emitAt) { emitAt = now + 120; emit(); }
    if (now > saveAt) { saveAt = now + 1500; try { localStorage.setItem(LS, JSON.stringify({ target: S.target, ufo: S.ufo, ending: S.ending, beam: S.beam, view: S.view, t: S.t })); } catch (e) {} }
  }
  function phaseAt(t) { return sched.phases.find((p) => t >= p.t0 && t < p.t1) || sched.phases[sched.phases.length - 1]; }
  function emit() {
    if (!opts.onState || !sched) return;
    const ph = phaseAt(S.t);
    opts.onState({
      t: S.t, dur: sched.dur, playing: S.playing, speed: S.speed, target: S.target, ufo: S.ufo, ending: S.ending, beam: S.beam, view: S.view,
      phase: ph.id, hook: ph.hook, ev: ph.ev, phases: sched.phases.map((p) => ({ id: p.id, hook: p.hook, ev: p.ev, t0: p.t0, t1: p.t1, on: p === ph })),
      hooks: hookLog.slice(), particles: lastInfo.nb + lastInfo.nc, sampled: P ? P.n : 0, rWide: +lastRW.toFixed(2),
      sources: [...UFOS, ...BEAMS].map((s) => ({ ...s, status: loading[s.key] || 'idle', stats: stats[s.key] || null, active: s.key === S.ufo })),
      donorBeam: !!donorBeam, audioOn: audio.on, audio: audio.rows(), pool: AUDIO_POOL
    });
  }

  setupTarget();
  raf = requestAnimationFrame(tick);
  ev.visible = S.view === 'event'; src.visible = S.view === 'sources';
  /* primary first, then alternates and beam donors */
  const first = UFOS.find((u) => u.key === S.ufo) || UFOS[0];
  loadOne(first, false).then(() => Promise.all([...UFOS.filter((u) => u !== first).map((u) => loadOne(u, false)), ...BEAMS.map((b) => loadOne(b, true))]));

  const api = {
    play() { if (S.t >= sched.dur - 0.01) S.t = 0; if (S.t <= 0.001) fireHooks(-1, 0); if (S.view !== 'event') api.setView('event'); S.playing = true; emitSoon(); },
    pause() { S.playing = false; audio.silence(); emitSoon(); },
    toggle() { S.playing ? api.pause() : api.play(); },
    restart() { S.t = 0; hookLog = []; fireHooks(-1, 0); S.playing = true; if (S.view !== 'event') api.setView('event'); emitSoon(); },
    seek(t) { S.t = clamp(t, 0, sched.dur); emitSoon(); },
    seekFrac(f) { api.seek(f * sched.dur); },
    setSpeed(x) { S.speed = x; emitSoon(); },
    setTarget(k) { if (!CLS[k]) return; const f = S.t / sched.dur; S.target = k; setupTarget(); S.t = f * sched.dur; emitSoon(); },
    setEnding(k) { const f = S.t / sched.dur; S.ending = k; sched = schedule(CLS[S.target], k); S.t = clamp(f * sched.dur, 0, sched.dur); emitSoon(); },
    setBeam(k) { S.beam = k; emitSoon(); },
    setUfo(k) { if (useUfo(k)) { placeSources(); emitSoon(); } },
    setView(v) { S.view = v; ev.visible = v === 'event'; src.visible = v === 'sources'; if (v === 'sources') S.playing = false; frame(); emitSoon(); },
    reframe() { frame(); },
    setTint(hex) { tint.set(hex); emitSoon(); },
    setDensity(d) { S.density = d; setupTarget(); },
    setSeed(s) { S.seed = s; setupTarget(); },
    audio,
    async setAudio(v) { await audio.enable(v); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); audio.dispose(); renderer.dispose(); renderer.domElement.remove(); }
  };
  return api;
}
