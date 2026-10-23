// Staubfahne (Georg 23.10., Lead-Auftrag; WS0 Particle-First „APPROVED DIRECTION“, Hash dust3=1): viele kleine, einzeln fast durchsichtige Partikel
// entlang der früheren Wagenbahn – die Fahne entsteht durch Überlagerung, nicht durch große Formen (keine Scheiben, Knet-Wolken, Rauch-Bilder, Kugeln).
// r2 (Lead 23.10.): Bewegung auf der GPU. Die CPU schreibt je Bild nur die NEUEN Partikel in einen Ringpuffer (Startposition, Startgeschwindigkeit,
// Geburtszeit, Lebensdauer, Zufallswerte, Farbe; Teil-Upload per addUpdateRange). Position, Wachstum und Verblassen rechnet der Vertex-Shader aus dem
// Alter, analytisch: Bremsung v₀·(1−e^(−kt))/k, Auftrieb b/k·(t − (1−e^(−kt))/k), Wind mit dem Alter einsetzend, Wirbel als Sinus-Versatz je Partikel
// mit wachsender Weite → die Fahne wird nach hinten breiter und höher. Junge Partikel klein und dicht an den Rädern, alte bis ≈ 30 CSS-px, sehr blass.
// Ausstoß an den Schwebe-Ankern (Kontaktpunkte) über die Strecke seit dem letzten Bild und die ganze Wagenbreite; Menge nach Tempo und Driften, je Bild
// gedeckelt, in der Luft und im Stand nichts; Neustart (alle Anker springen) leert die Fahne. Farbe aus der Bodenpalette (dustColor), Licht des einen
// Rigs (nur gelesen), nachts gedämpft (ohne Schatten wirkte der Staub sonst heller als der Boden), Tonemapping und Farbraum wie die Szene. Ein THREE.Points.
// Mischung ohne Sortierung: je Partikel Deckkraft ≤ 0,12 und Farbstreuung ±5 % → der Reihenfolgefehler einer Überlagerung liegt unter ≈ 0,5 % Helligkeit.
import * as THREE from 'three'

export const DUST3 = Object.freeze({
  on: !(typeof location !== 'undefined' && /(^|[#,])dust3=0(,|$)/.test(location.hash)),   // Standard seit Georgs Übernahme (23.10., puffs2); dust3=0 = alter Staub
  count: 115000,          // Ringpuffer (gemessen und begründet in test/dustTrail.mjs: Belegung, Kosten)
  life: [2.2, 4.0],       // s
  rate: 30000,            // Partikel/s bei Vollgas (alle Anker); × (1 + driftK·|drift|)
  driftK: 0.5,
  maxPerFrame: 2200,      // neue Partikel je Bild (Deckel)
  minSpeed: 0.06,         // speed01, darunter kein Staub
  hMax: 2.2,              // Anker-Höhe über Grund (× unit × 1,6): darüber (Luft) kein Staub
  back: [0.10, 0.30],     // Startimpuls nach hinten (× Wagengeschwindigkeit)
  side: [0.8, 3.0],       // seitlich (m/s × unit), beim Driften zur Außenseite
  rise: [0.6, 1.8],       // m/s × unit
  drag: 1.6,              // 1/s
  buoy: 0.55,             // Auftrieb m/s² × unit (Fahne steigt nach hinten)
  wind: [0.45, 0.0, 0.22],// Verwehung m/s × unit (setzt mit dem Alter ein)
  swirl: [1.6, 0.9],      // Wirbelweite waagrecht/senkrecht (m × unit) bei Lebensende – die Fahne weitet sich
  size: [0.25, 3.2],      // Weltgröße jung/alt (m × unit)
  cssYoung: 14, cssOld: 30, // Bildschirm-Deckel: jung (dicht an den Rädern) → alt (sehr blass)
  minPx: 1.5,             // Gerätepixel, darunter blasser statt kleiner
  oldK: 0.35,             // Deckkraft-Faktor am Lebensende (Volumen statt Körnung); jung 0,09–0,12
  nightK: 0.4,            // Licht-Dämpfung nachts (Staub ohne Schatten wirkte nachts 1,3–1,4 × heller als der Boden, Ziel ≤ 1,15)
  nightLum: [0.5, 1.5],   // Lichtmenge (Luma Sonne + Himmel) Nacht → Tag
  nightAlpha: 1.0,        // Puff-Deckkraft nachts (0,6 gemessen: heller Kern bleibt, nicht besser – daher aus)
  tone: Object.freeze({ lift: 0.07, sat: 0.78, maxL: 0.88 }),   // puffs2 (Georg 23.10.): nah am Bodenton wie die Vorlage, aber als Staub lesbar (vorher +0,2 / ×0,55 = zu weiß)
  spawnY: 0.18,           // m × unit über der glatten Höhe (Netz + Knet-Relief liegen darüber)
  jump: 6,                // Anker-Sprung (m × unit) je Bild: Neustart/Teleport
})
// Weg A (Georg 23.10., Bericht STAUBFAHNE_TECHNIK_R1): Körner nur noch in Radnähe (Aufspritzen, kurz), dazu wenige große weiche Puffs (Schwaden)
export const DUST3_GRAIN = Object.freeze({ ...DUST3, count: 50000, rate: 12000, maxPerFrame: 900, life: [0.5, 1.4], swirl: [0.4, 0.25], size: [0.2, 0.9], oldK: 0.5 })
export const DUST3_PUFF = Object.freeze({ ...DUST3, sideSym: true, driftSpread: 1.4, driftSize: 1.9, driftSwirl: 1.2, count: 1600, rate: 140, driftK: 1.5, maxPerFrame: 10, life: [3.0, 5.2], side: [0.6, 2.6], rise: [0.25, 0.8], buoy: 0.32, drag: 1.2,
  swirl: [1.0, 0.4], size: [2.0, 9.5], alpha: [0.26, 0.38], areaK: 0.5, spin: 0.25, erode: [0.18, 0.80], groundFade: 0.9, nearFade: [1.2, 4.5] })
const VERT = /* glsl */`attribute vec3 aVel; attribute vec2 aBL; attribute vec4 aRnd; attribute vec3 aColor;
uniform float uTime, uDrag, uBuoy, uProj, uMinPx, uCssYoung, uCssOld, uPR, uOldK, uSize0, uSize1; uniform vec3 uWind; uniform vec2 uSwirl;
varying float vA; varying vec3 vC;
void main(){ float age = uTime - aBL.x, L = aBL.y, f = age / L;
  if (age < 0.0 || f >= 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vA = 0.0; return; }
  float e = exp(-uDrag * age), g = (1.0 - e) / uDrag;
  vec3 p = position + aVel * g + vec3(0.0, uBuoy / uDrag * (age - g), 0.0);
  float wk = age * age / (age + 0.8); p += uWind * wk;                                   // Wind setzt mit dem Alter ein
  float sw = pow(f, 0.8), ph = aRnd.x * 6.2832, w = 0.6 + aRnd.y * 1.2;                  // Wirbel: Weite wächst mit dem Alter
  p += vec3(sin(ph + age * w) * uSwirl.x * sw, (0.5 + 0.5 * sin(ph * 1.7 + age * w * 0.8)) * uSwirl.y * sw, cos(ph * 1.3 + age * w * 1.1) * uSwirl.x * sw);
  vec4 mv = modelViewMatrix * vec4(p, 1.0); float z = max(0.05, -mv.z);
  float size = mix(uSize0, uSize1, sqrt(f)) * (0.8 + 0.4 * aRnd.z), s = size * uProj / z;
  float cap = mix(uCssYoung, uCssOld, smoothstep(0.05, 0.6, f)) * uPR, ps = clamp(s, uMinPx, cap);
  float a0 = mix(0.09, 0.12, aRnd.w);
  vA = a0 * smoothstep(0.0, 0.015, f) * (1.0 - smoothstep(0.55, 1.0, f)) * mix(1.0, uOldK, smoothstep(0.1, 0.8, f)) * min(1.0, (s * s) / (uMinPx * uMinPx));
  vC = aColor; gl_PointSize = ps; gl_Position = projectionMatrix * mv; }`
const FRAG = /* glsl */`varying float vA; varying vec3 vC; uniform vec3 uLight; uniform float uCov;
void main(){ if (vA <= 0.002) discard; vec2 p = gl_PointCoord - 0.5; float r2 = dot(p, p) * 4.0; if (r2 >= 1.0) discard;
  float k = (exp(-3.0 * r2) - exp(-3.0)) / (1.0 - exp(-3.0)); float a = vA * k;
  if (uCov > 0.5) { gl_FragColor = vec4(1.0, 1.0, 1.0, a); return; }   // Prüfhilfe: Deckung
  gl_FragColor = vec4(vC * uLight, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

let seed = 1234567
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Emitter (unabhängig von der Darstellung, Lead 23.10.): Ringpuffer mit Startwerten je Partikel + Ausstoß. Die Darstellung (heute Points, später ggf.
// Quads/Puffs) liest dieselben Felder: pos (Start), vel (Startgeschwindigkeit), bl (Geburtszeit, Lebensdauer), rn (4 Zufallswerte), col (Farbe), time.
// options: { unit, colorAt(x, z) → THREE.Color, groundAt(x, z) → y | null, count? }
export function createDustEmitter({ unit = 1, colorAt = null, groundAt = null, P: PP = DUST3, count = PP.count } = {}) {   // P: Parametersatz (Körner, Puffs)
  const N = count, pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), bl = new Float32Array(N * 2), rn = new Float32Array(N * 4), col = new Float32Array(N * 3), ext = new Float32Array(N)   // ext: Drift beim Ausstoß (0…1)
  for (let j = 0; j < N; j++) { bl[j * 2] = -1e6; bl[j * 2 + 1] = 1 }   // leer: längst verstorben
  const prev = [], mid = new THREE.Vector3(), fwd = new THREE.Vector3(0, 0, 1), side = new THREE.Vector3(1, 0, 0), c = new THREE.Color()
  const listeners = new Set()   // Darstellungen: onWrite(start, n) für Teil-Uploads, onClear()
  let next = 0, acc = 0
  const E = { N, unit, P: PP, pos, vel, bl, rn, col, ext, time: 0, stats: { emitted: 0, overwritten: 0, cpuMs: 0, frames: 0, lastEmit: 0, restarts: 0, uploads: 0 }, listen: (l) => { listeners.add(l); return () => listeners.delete(l) } }
  function clear() { for (let j = 0; j < N; j++) bl[j * 2] = -1e6; prev.length = 0; acc = 0; for (const l of listeners) l.onClear?.() }
  // in: anchors [Vector3 Welt], speed01, carVel (Vector3, m/s), heading (Vector3 vorwärts), drift −1…1
  function update(dt, { anchors = [], speed01 = 0, carVel = null, heading = null, drift = 0 } = {}) {
    const st = E.stats, t0 = performance.now(); dt = Math.min(dt || 0, 0.1); E.time += dt; const time = E.time; st.lastEmit = 0
    const da = Math.min(1, Math.abs(drift || 0))
    if (heading) { fwd.copy(heading).setY(0).normalize(); side.set(fwd.z, 0, -fwd.x) }   // side = links der Fahrtrichtung
    if (anchors.length && prev.length === anchors.length && anchors.every((P, i) => prev[i].distanceTo(P) > PP.jump * unit)) { clear(); st.restarts++ }
    const start = next; let written = 0
    if (dt > 0 && speed01 > PP.minSpeed && anchors.length) {
      acc += PP.rate * Math.min(1, speed01) * (1 + PP.driftK * da) * dt
      let want = Math.min(Math.floor(acc), PP.maxPerFrame); acc -= want; if (acc > PP.maxPerFrame) acc = PP.maxPerFrame
      const per = Math.ceil(want / anchors.length); mid.set(0, 0, 0); for (const P of anchors) mid.add(P); mid.multiplyScalar(1 / anchors.length)
      const sp = carVel ? Math.hypot(carVel.x, carVel.z) : 0
      for (let ai = 0; ai < anchors.length && want > 0; ai++) {
        const P = anchors[ai], Q = prev[ai], gy = groundAt ? groundAt(P.x, P.z) : null
        if (gy == null || P.y - gy > PP.hMax * unit * 1.6) continue   // in der Luft: nichts
        const jumped = !Q || Q.distanceTo(P) > PP.jump * unit, cc = colorAt ? colorAt(P.x, P.z) : c.set('#d8c39a')
        for (let n = 0; n < per && want > 0; n++, want--) {
          const u = jumped ? 1 : rnd(), w = rnd() * 1.1, j = next; next = (next + 1) % N; written++
          if (time - bl[j * 2] < bl[j * 2 + 1]) st.overwritten++
          const x = (jumped ? P.x : Q.x + (P.x - Q.x) * u) + (mid.x - P.x) * w + (rnd() - 0.5) * 0.35 * unit, z = (jumped ? P.z : Q.z + (P.z - Q.z) * u) + (mid.z - P.z) * w + (rnd() - 0.5) * 0.35 * unit
          pos[j * 3] = x; pos[j * 3 + 1] = gy + PP.spawnY * unit; pos[j * 3 + 2] = z
          const bk = (PP.back[0] + rnd() * (PP.back[1] - PP.back[0])) * sp
          let s2 = (rnd() * 2 - 1) * (PP.side[0] + rnd() * (PP.side[1] - PP.side[0])) * unit
          if (da > 0.05) s2 = PP.sideSym ? s2 * (1 + (PP.driftSpread ?? 0) * da) : Math.abs(s2) * (0.4 + da) * Math.sign(drift)   // Körner: Wurf zur Außenseite; Puffs: nach beiden Seiten weiter (Kurvenwolke)
          ext[j] = da
          vel[j * 3] = -fwd.x * bk + side.x * s2; vel[j * 3 + 1] = (PP.rise[0] + rnd() * (PP.rise[1] - PP.rise[0])) * unit; vel[j * 3 + 2] = -fwd.z * bk + side.z * s2
          bl[j * 2] = time - rnd() * dt; bl[j * 2 + 1] = PP.life[0] + rnd() * (PP.life[1] - PP.life[0])
          rn[j * 4] = rnd(); rn[j * 4 + 1] = rnd(); rn[j * 4 + 2] = rnd(); rn[j * 4 + 3] = rnd()
          const jit = 0.95 + 0.1 * rnd(); col[j * 3] = cc.r * jit; col[j * 3 + 1] = cc.g * jit; col[j * 3 + 2] = cc.b * jit
          st.emitted++; st.lastEmit++ }
      }
    }
    if (written) { st.uploads++; if (start + written <= N) for (const l of listeners) l.onWrite?.(start, written); else for (const l of listeners) { l.onWrite?.(start, N - start); l.onWrite?.(0, start + written - N) } }
    anchors.forEach((P, i) => { if (!prev[i]) prev[i] = new THREE.Vector3(); prev[i].copy(P) })
    st.cpuMs += performance.now() - t0; st.frames++
  }
  const live = () => { let n = 0; for (let j = 0; j < N; j++) { const a = E.time - bl[j * 2]; if (a >= 0 && a < bl[j * 2 + 1]) n++ } return n }
  const young = (maxAge) => { const out = []; for (let j = 0; j < N; j++) { const a = E.time - bl[j * 2]; if (a >= 0 && a <= maxAge && a < bl[j * 2 + 1]) out.push([pos[j * 3], pos[j * 3 + 2]]) } return out }   // Prüfhilfe
  return Object.assign(E, { update, clear, live, young })
}

// Darstellung „Points“ (ein Draw Call): liest die Startwerte des Emitters, Bewegung im Vertex-Shader; Teil-Upload nur der neu geschriebenen Einträge
export function createDustPointsView(E) {
  const dyn = (arr, k) => new THREE.BufferAttribute(arr, k).setUsage(THREE.DynamicDrawUsage), geo = new THREE.BufferGeometry(), unit = E.unit
  const A = { position: dyn(E.pos, 3), aVel: dyn(E.vel, 3), aBL: dyn(E.bl, 2), aRnd: dyn(E.rn, 4), aColor: dyn(E.col, 3) }
  for (const [k, a] of Object.entries(A)) geo.setAttribute(k, a)
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e9)
  const U = { uTime: { value: 0 }, uDrag: { value: E.P.drag }, uBuoy: { value: E.P.buoy * unit }, uProj: { value: 600 }, uMinPx: { value: E.P.minPx }, uCssYoung: { value: E.P.cssYoung }, uCssOld: { value: E.P.cssOld },
    uPR: { value: 1 }, uOldK: { value: E.P.oldK }, uSize0: { value: E.P.size[0] * unit }, uSize1: { value: E.P.size[1] * unit }, uWind: { value: new THREE.Vector3(...E.P.wind).multiplyScalar(unit) },
    uSwirl: { value: new THREE.Vector2(E.P.swirl[0] * unit, E.P.swirl[1] * unit) }, uLight: { value: new THREE.Color(1, 1, 1) }, uCov: { value: 0 } }
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: U, transparent: true, depthWrite: false, depthTest: true })
  const pts = new THREE.Points(geo, mat); pts.name = 'dust-trail'; pts.frustumCulled = false; pts.renderOrder = 2
  // je Bild: Zeit, Bildschirm-Maßstab, Pixeldichte, Licht aus dem Rig (Sonne · Höhe + Himmel, nur gelesen), nachts gedämpft
  let sun = null, hemi = null; const sd = new THREE.Vector3(), sz = new THREE.Vector2()
  pts.onBeforeRender = (r, scene, cam) => { U.uTime.value = E.time; r.getDrawingBufferSize(sz); const t = r.getRenderTarget(), h = t ? t.height : sz.y
    U.uProj.value = cam.isPerspectiveCamera ? h / (2 * Math.tan((cam.fov * Math.PI) / 360)) : h / ((cam.top - cam.bottom) / cam.zoom); U.uPR.value = r.getPixelRatio()
    if (!sun || !sun.parent) { sun = scene.getObjectByName('sun'); hemi = scene.getObjectByName('hemi') }
    const L = U.uLight.value.setRGB(0, 0, 0); let up = 1
    if (sun?.isDirectionalLight) { sd.copy(sun.position).sub(sun.target.position).normalize(); up = sd.y; const k = sun.intensity * Math.max(0, sd.y); L.r += sun.color.r * k; L.g += sun.color.g * k; L.b += sun.color.b * k }
    if (hemi?.isHemisphereLight) { L.r += hemi.color.r * hemi.intensity; L.g += hemi.color.g * hemi.intensity; L.b += hemi.color.b * hemi.intensity }
    if (!sun && !hemi) L.setRGB(1, 1, 1)
    const lum = 0.2126 * L.r + 0.7152 * L.g + 0.0722 * L.b; U.uLum = lum   // Nacht nach der Lichtmenge des Rigs (nachts ist die „Sonne“ der Mond, oft hoch)
    L.multiplyScalar((E.P.nightK + (1 - E.P.nightK) * THREE.MathUtils.smoothstep(lum, E.P.nightLum[0], E.P.nightLum[1])) * (E.lightK ?? 1)) }   // wenig Licht: gedämpft; lightK: Nacht-Bodenton aus der Zusammensetzung
  const off = E.listen({ onWrite: (from, n) => { for (const a of Object.values(A)) { a.addUpdateRange(from * a.itemSize, n * a.itemSize); a.needsUpdate = true } },
    onClear: () => { for (const a of Object.values(A)) { a.clearUpdateRanges(); a.needsUpdate = true } } })
  return { object3d: pts, material: mat, dispose() { off(); geo.dispose(); mat.dispose(); pts.removeFromParent() } }
}

// Darstellung „Puffs“ (Weg A): InstancedMesh-Quads (Points würden am Bildrand wegploppen), Billboard im Vertex-Shader, dieselbe analytische Bewegung.
// Gegen die Scheibe: Noise-Maske statt Kreis (prozedural, fbm), Zufallsdrehung + langsames Weiterdrehen, Alpha-Erosion mit dem Alter (Rand zerfällt in
// Flocken), weiches Auslaufen am Boden (Höhe über dem Bodenpunkt des Puffs – der Boden ist ein Höhenfeld; optional Tiefentextur, s. depthTex), Ausblenden
// nahe der Kamera, Deckkraft sinkt mit der Fläche (Masse bleibt etwa gleich).
const PUFF_VERT = /* glsl */`attribute vec3 aStart; attribute vec3 aVel; attribute vec2 aBL; attribute vec4 aRnd; attribute vec3 aColor; attribute float aExt;
uniform float uTime, uDrag, uBuoy, uSize0, uSize1, uSpin, uA0, uA1, uAreaK, uSpawnY, uDriftSize, uDriftSwirl; uniform vec3 uWind; uniform vec2 uSwirl;
varying vec2 vUv; varying float vA, vF, vH, vSeed; varying vec3 vC, vW;
void main(){ float age = uTime - aBL.x, L = aBL.y, f = age / L;
  if (age < 0.0 || f >= 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float e = exp(-uDrag * age), g = (1.0 - e) / uDrag;
  vec3 c = aStart + aVel * g + vec3(0.0, uBuoy / uDrag * (age - g), 0.0) + uWind * (age * age / (age + 0.8));
  float sw = pow(f, 0.8), ph = aRnd.x * 6.2832, w = 0.5 + aRnd.y * 0.8;
  float swx = uSwirl.x * (1.0 + uDriftSwirl * aExt);                                    // Drift-Puffs breiten sich weiter aus
  c += vec3(sin(ph + age * w) * swx * sw, (0.5 + 0.5 * sin(ph * 1.7 + age * w)) * uSwirl.y * sw, cos(ph * 1.3 + age * w * 1.1) * swx * sw);
  float size = mix(uSize0, uSize1 * mix(1.0, uDriftSize, aExt), sqrt(f)) * (0.75 + 0.5 * aRnd.z);   // … und werden im Alter größer (Kurvenwolke)
  c.y += size * 0.32;                                                                    // Puff sitzt auf dem Boden, nicht halb darin
  float ang = aRnd.w * 6.2832 + age * uSpin * (aRnd.y - 0.5) * 2.0, cs = cos(ang), sn = sin(ang);
  vec2 q = vec2(cs * position.x - sn * position.y, sn * position.x + cs * position.y) * size;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = c + right * q.x + up * q.y; vW = wp; vH = wp.y - (aStart.y - uSpawnY);         // Höhe über dem Bodenpunkt
  vUv = position.xy + 0.5; vF = f; vSeed = aRnd.x * 37.0 + aRnd.z * 11.0; vC = aColor;
  vA = mix(uA0, uA1, aRnd.w) * smoothstep(0.0, 0.06, f) * (1.0 - smoothstep(0.6, 1.0, f)) * pow(uSize0 / size, uAreaK);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`
const PUFF_FRAG = /* glsl */`uniform vec3 uLight; uniform float uCov, uTime, uGroundFade, uNightA; uniform vec2 uErode, uNear;
varying vec2 vUv; varying float vA, vF, vH, vSeed; varying vec3 vC, vW;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
void main(){ if (vA <= 0.003) discard;
  vec2 p = vUv - 0.5; float r = length(p) * 2.0; if (r >= 1.0) discard;
  float n = fbm(vUv * 3.2 + vSeed + vec2(0.0, uTime * 0.05)), n2 = fbm(vUv * 7.0 - vSeed * 0.7);
  float body = (1.0 - r * r) * 0.85 + (n - 0.5) * 0.9 + (n2 - 0.5) * 0.35;                // unregelmäßige Masse statt Kreis
  float th = mix(uErode.x, uErode.y, vF);                                                 // Erosion: Schwelle steigt mit dem Alter
  float a = vA * uNightA * smoothstep(th, th + 0.35, body);
  a *= smoothstep(0.0, uGroundFade, vH);                                                  // weich am Boden statt Schnittkante
  a *= smoothstep(uNear.x, uNear.y, length(vW - cameraPosition));                          // nahe der Kamera aus
  if (a <= 0.002) discard;
  if (uCov > 0.5) { gl_FragColor = vec4(1.0, 1.0, 1.0, a); return; }
  gl_FragColor = vec4(vC * uLight, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
export function createDustPuffView(E) {
  const P = E.P, unit = E.unit, base = new THREE.PlaneGeometry(1, 1), geo = new THREE.InstancedBufferGeometry()
  geo.index = base.index; geo.setAttribute('position', base.attributes.position); geo.instanceCount = E.N
  const dyn = (arr, k) => new THREE.InstancedBufferAttribute(arr, k).setUsage(THREE.DynamicDrawUsage)
  const A = { aStart: dyn(E.pos, 3), aVel: dyn(E.vel, 3), aBL: dyn(E.bl, 2), aRnd: dyn(E.rn, 4), aColor: dyn(E.col, 3), aExt: dyn(E.ext, 1) }
  for (const [k, a] of Object.entries(A)) geo.setAttribute(k, a)
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e9)
  const U = { uTime: { value: 0 }, uDrag: { value: P.drag }, uBuoy: { value: P.buoy * unit }, uSize0: { value: P.size[0] * unit }, uSize1: { value: P.size[1] * unit }, uSpin: { value: P.spin },
    uA0: { value: P.alpha[0] }, uA1: { value: P.alpha[1] }, uDriftSize: { value: P.driftSize ?? 1 }, uDriftSwirl: { value: P.driftSwirl ?? 0 }, uAreaK: { value: P.areaK }, uSpawnY: { value: P.spawnY * unit }, uWind: { value: new THREE.Vector3(...P.wind).multiplyScalar(unit) },
    uSwirl: { value: new THREE.Vector2(P.swirl[0] * unit, P.swirl[1] * unit) }, uLight: { value: new THREE.Color(1, 1, 1) }, uCov: { value: 0 }, uGroundFade: { value: P.groundFade * unit },
    uErode: { value: new THREE.Vector2(...P.erode) }, uNightA: { value: 1 }, uNear: { value: new THREE.Vector2(P.nearFade[0] * unit, P.nearFade[1] * unit) } }
  const mat = new THREE.ShaderMaterial({ vertexShader: PUFF_VERT, fragmentShader: PUFF_FRAG, uniforms: U, transparent: true, depthWrite: false, depthTest: true, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'dust-puffs'; mesh.frustumCulled = false; mesh.renderOrder = 3
  mesh.onBeforeRender = () => { U.uTime.value = E.time }
  const off = E.listen({ onWrite: (from, n) => { for (const a of Object.values(A)) { a.addUpdateRange(from * a.itemSize, n * a.itemSize); a.needsUpdate = true } },
    onClear: () => { for (const a of Object.values(A)) { a.clearUpdateRanges(); a.needsUpdate = true } } })
  return { object3d: mesh, material: mat, uniforms: U, dispose() { off(); geo.dispose(); base.dispose(); mat.dispose(); mesh.removeFromParent() } }
}

// Licht aus dem einen Rig (nur gelesen) für alle Staub-Materialien: Sonne · Höhe + Himmel, nachts nach der Lichtmenge gedämpft
// Nacht-Anteil 0 (Tag) … 1 (Nacht) aus der Lichtmenge des einen Rigs (Sonne + Himmel), wie beim Staub; für den Antrieb (vehicleRig uNight)
export function rigNight(scene, cache) { if (!cache.sd) { cache.sd = new THREE.Vector3(); cache.c = new THREE.Color() } return 1 - THREE.MathUtils.smoothstep(rigLight(scene, cache.c, cache), DUST3.nightLum[0], DUST3.nightLum[1]) }
function rigLight(scene, out, cache) { if (!cache.sun || !cache.sun.parent) { cache.sun = scene.getObjectByName('sun'); cache.hemi = scene.getObjectByName('hemi') }
  const { sun, hemi } = cache, L = out.setRGB(0, 0, 0)
  if (sun?.isDirectionalLight) { cache.sd.copy(sun.position).sub(sun.target.position).normalize(); const k = sun.intensity * Math.max(0, cache.sd.y); L.r += sun.color.r * k; L.g += sun.color.g * k; L.b += sun.color.b * k }
  if (hemi?.isHemisphereLight) { L.r += hemi.color.r * hemi.intensity; L.g += hemi.color.g * hemi.intensity; L.b += hemi.color.b * hemi.intensity }
  if (!sun && !hemi) L.setRGB(1, 1, 1)
  const lum = 0.2126 * L.r + 0.7152 * L.g + 0.0722 * L.b; L.multiplyScalar(DUST3.nightK + (1 - DUST3.nightK) * THREE.MathUtils.smoothstep(lum, DUST3.nightLum[0], DUST3.nightLum[1])); return lum }

// Zusammengesetzt (Weg A): Körner (Points, Radnähe) + Puffs (Schwaden), zwei Emitter mit eigenem Parametersatz, eine Gruppe
export function createDustTrail(opts = {}) {
  const EG = createDustEmitter({ ...opts, P: DUST3_GRAIN }), EP = createDustEmitter({ ...opts, P: DUST3_PUFF }), VG = createDustPointsView(EG), VP = createDustPuffView(EP)
  const root = new THREE.Group(); root.name = 'dust-trail'; root.add(VG.object3d, VP.object3d)
  // Zeichenreihenfolge (Georg 23.10.): Staub NACH den Düsen/Flammen (dort renderOrder 2–5, alle transparent ohne Tiefe) – Staub zwischen Kamera und Düse
  // deckt die Flammen sichtbar ab, statt dass sie wie aufgeklebt durchscheinen; gilt für beide Flammen-Stile (clay, glow)
  // Körner (klein, nachts dunkel) vor den Flammen (Georg 23.10., glow: sonst dunkle Punkte auf der Fahne), die Puffs danach decken weiter ab
  const ORDER = { alt: [2, 3], neu: [6, 7], korn: [2, 7] }, order = (k) => { VG.object3d.renderOrder = ORDER[k][0]; VP.object3d.renderOrder = ORDER[k][1] }; order('korn')
  const cache = { sd: new THREE.Vector3() }, light = new THREE.Color()
  let ratio = 1
  VP.object3d.onBeforeRender = (r, scene) => { VP.uniforms.uTime.value = EP.time; const lum = rigLight(scene, light, cache)
    // Nacht: zusätzlich auf den Bodenton (Verhältnis Boden/Staub am Wagen), gemischt nach der Lichtmenge
    const night = 1 - THREE.MathUtils.smoothstep(lum, DUST3.nightLum[0], DUST3.nightLum[1]), k = 1 + (ratio - 1) * night
    light.multiplyScalar(k); VP.uniforms.uNightA.value = 1 + (DUST3.nightAlpha - 1) * night; VP.uniforms.uLight.value.copy(light); EG.lightK = k; VG.material.uniforms.uLum = lum; VG.material.uniforms.uNightK = +k.toFixed(3) }   // Körner: gleicher Faktor (ein Bild später)
  const mats = [VG.material, VP.material]
  return { object3d: root, material: VG.material, materials: mats, emitters: { grain: EG, puff: EP },
    update(dt, inp) { EG.update(dt, inp); EP.update(dt, inp); const A = inp?.anchors; if (A?.length && opts.colorAt?.groundRatio) { const m = A[0]; ratio = Math.min(1, opts.colorAt.groundRatio(m.x, m.z)) } }, clear() { EG.clear(); EP.clear() },
    young: (a) => [...EG.young(a), ...EP.young(a)], live: () => EG.live() + EP.live(),
    order,                                                                                 // Prüfhilfe A/B: 'alt' (vor den Flammen) | 'neu' (beide danach) | 'korn' (Standard)
    coverage(on) { for (const m of mats) m.uniforms.uCov.value = on ? 1 : 0 },            // Prüfhilfe
    layer(n, on) { root.traverse((o) => (on ? o.layers.enable(n) : o.layers.disable(n))) },  // Prüfhilfe
    info: () => { const g = EG.stats, p = EP.stats, fr = Math.max(1, g.frames); return { count: EG.N + EP.N, live: EG.live() + EP.live(), liveGrain: EG.live(), livePuff: EP.live(), overwritten: g.overwritten + p.overwritten, emitted: g.emitted + p.emitted,
      lastEmit: g.lastEmit + p.lastEmit, restarts: g.restarts, cpuMsPerFrame: +((g.cpuMs + p.cpuMs) / fr).toFixed(4) } },
    dispose() { VG.dispose(); VP.dispose(); root.removeFromParent() } }
}

// Ein-/Aushängen für den Host (M2Car): hält object3d/dispose aus der React-Komponente heraus (contract-static: Komponenten sind keine Module).
// Je Szene wird EINE Fahne angelegt und beim Aushängen nur geleert und abgehängt, nicht freigegeben: Der Racer-Wechsel hängt die Komponente
// neu ein, und neu angelegte Materialien übersetzten jedes Mal ihre Shader neu (vehicles-r1 cachedSwap, 2 Programme je Wechsel).
const KEPT = new WeakMap()
export function mountDustTrail(scene, opts = {}) {
  let T = KEPT.get(scene); if (!T) { T = createDustTrail(opts); KEPT.set(scene, T) }
  T.clear(); scene.add(T.object3d)
  return { trail: T, unmount() { T.clear(); T.object3d.removeFromParent() } }
}
