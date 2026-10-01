/* KFB · SKY1 · kfb.environment.spindle-sky/0.3-candidate
 * Georg 01.10. (13:07): »spindel unten ist kein lava shader, sondern irgendetwas schlecht gebasteltes · oben … visuell ein FAIL → hier soll ein sky shader gezeigt werden,
 *   analog zum lava/grund shader · beide shader und farb-paletten austauschbar · spindel-enden sollen einen auslaufenden trichter darstellen, nur den entfernten lava-grund
 *   bzw. sky oben sieht man klein mit sauberem nebel/übergang zu den spindel-karten.«
 * v0.2 (Polkappen-Rosette) ist damit FAIL und bleibt als spindle-sky.v2.js liegen.
 * v0.3: Mantel = himmel.v4.js UNVERÄNDERT (Zylinder, sechs Kartenmotive, Backsteinverband, Dunst). Dessen Halbkugel-Abschluss (`himmel-trichter`) wird nur unsichtbar gestellt.
 *   spindel.v4.js (Kuppel, Seen, Glut) wird NICHT mehr gebaut — die Enden sind neu:
 *   · je Ende ein auslaufender Trichter: Profil r(s) = r_e + (R − r_e)·(1 − smoothstep(s)), y(s) = L·s. Tangente bei s = 0 senkrecht (stetig an der Mantelkante),
 *     bei s = 1 parallel (läuft als dünne Röhre aus). Kein Pol, also kein Nadelstern.
 *   · Kartentextur läuft weiter (dieselbe Textur, wrapT Repeat wie im Donor), v wächst mit R/r — die Karten werden zum Ende hin in BEIDEN Richtungen kleiner (winkeltreu), statt zu Strahlen zu ziehen.
 *   · Nebel je Ende: die Karten laufen ab s ≈ 0,3 in die Nebelfarbe der End-Palette aus; am Ende sitzt klein die End-Fläche (Grund-Shader unten, Himmels-Shader oben), deren Rand in dieselbe Nebelfarbe läuft.
 *   · End-Shader und Paletten sind austauschbar: unten lava · saeure · bubblegum · wirbel; oben himmel · bubblegum · aurora · abendrot. Paletten: Vorgabe je Shader, oder aus den
 *     Welt-Rollen (WORLDS canyon/bucht/otown aus vendor-j15/lab-track/track-look.v5.js, Werte wörtlich) bzw. dem Deck-Mittelwert, mit stabiler Saat (Farbton ±9°).
 *   · Deckungsprobe eigen (C29-Verfahren): Strahlen über die ganze Kugel von der Spielpose, Ziele = Mantel + Trichter + Endflächen, Fehlstrahlen und Höchstabstand gegen far 120. */
import { loadCards, SOURCES } from './spindle-sky.v1.js';
export { loadCards, SOURCES };
const HIMMEL = new URL('../_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/himmel.v4.js', import.meta.url).href;
export const CONTRACT = 'kfb.environment.spindle-sky/0.3-candidate'; /* Datei v4 = Shader-Korrektur derselben Fassung (Farbraum-Ausgabe, Lava ohne Radialfluss) */
export const FUNNEL = { L: 1.15, rEnd: 0.16, rings: 40, seg: 96, fog0: 0.28, fog1: 0.9 };
export const ENDS = { unten: ['lava', 'saeure', 'bubblegum', 'wirbel'], oben: ['himmel', 'bubblegum', 'aurora', 'abendrot'] };
export const ENDS_LABEL = { lava: 'Lava', saeure: 'Säure-See', bubblegum: 'Bubblegum', wirbel: 'Wirbel', himmel: 'Himmel', aurora: 'Aurora', abendrot: 'Abendrot' };
const PRESET_PAL = {
  lava: ['#140806', '#3b1a10', '#b8361f', '#f2c93c'], saeure: ['#0b2410', '#2d6e2a', '#9fe04a', '#efff9a'], bubblegum: ['#5a1e4a', '#e05a9c', '#ffb3d9', '#fff2f8'], wirbel: ['#120e14', '#3a3040', '#b8361f', '#f2c93c'],
  himmel: ['#2f6fb0', '#8fc6ea', '#fff6e6', '#ffe7a8'], 'bubblegum-sky': ['#9a5ac8', '#f7a1c4', '#fff0f7', '#ffd1e8'], aurora: ['#050918', '#13284a', '#5cf2b0', '#c08cff'], abendrot: ['#33285e', '#e8743a', '#f2b632', '#ffe2a0']
};
/* Welt-Rollen wörtlich aus vendor-j15/lab-track/track-look.v5.js WORLDS (Joyride J15) */
const WORLD_ROLES = {
  canyon: { sky: '#96bede', strang: '#ef5a22', table: '#8b68c7', hill: '#7b5bb8', cloud: '#e2d0bc', pad: '#f2b632', trunk: '#8a5a3a' },
  bucht: { sky: '#8fd6ec', strang: '#f2708a', table: '#f0cf7e', hill: '#46adb2', cloud: '#fff4e2', pad: '#f7d23c', trunk: '#c9895a' },
  otown: { sky: '#a8d8b9', strang: '#e9b53b', table: '#3aa596', hill: '#2f8f83', cloud: '#f3ead8', pad: '#fff06a', trunk: '#6b4a8a' }
};
export const PALETTE_SOURCES = ['shader', 'canyon', 'bucht', 'otown', 'deck'];

function paletteFor(THREE, wo, preset, source = 'shader', seed = 1, basis = null) {
  const C = h => new THREE.Color(h), key = wo === 'oben' && preset === 'bubblegum' ? 'bubblegum-sky' : preset;
  let p;
  if (source === 'shader' || !source) p = PRESET_PAL[key].map(C);
  else if (source === 'deck') { const b = basis || [58, 48, 40], m = new THREE.Color(b[0] / 255, b[1] / 255, b[2] / 255); p = wo === 'oben' ? [m.clone().multiplyScalar(0.55), m.clone().lerp(C('#ffffff'), 0.35), C('#fff6e6'), C('#f2c93c')] : [m.clone().multiplyScalar(0.18), m.clone().multiplyScalar(0.5), C('#b8361f'), C('#f2c93c')]; }
  else { const w = WORLD_ROLES[source]; p = wo === 'oben' ? [C(w.hill).multiplyScalar(0.8), C(w.sky), C(w.cloud), C(w.pad)] : [C(w.trunk).multiplyScalar(0.35), C(w.table).multiplyScalar(0.7), C(w.strang), C(w.pad)]; }
  if (seed && seed !== 1) { let a = seed * 2654435761 >>> 0; const r = () => ((a = (a * 1664525 + 1013904223) >>> 0) / 4294967296); const dh = (r() - 0.5) * 0.05; for (const c of p) { const hsl = {}; c.getHSL(hsl); c.setHSL((hsl.h + dh + 1) % 1, hsl.s, hsl.l); } }
  const fog = p[1].clone().lerp(p[2], wo === 'oben' ? 0.45 : 0.5);
  return { cols: p, fog, source, seed };
}

const END_VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const NOISE = `
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p + n)); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= 0.5; } return s; }
vec3 vor(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0; vec2 id = vec2(0); for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){ vec2 g = vec2(x, y), o = h22(i + g); float d = length(g + o - f); if (d < d1){ d2 = d1; d1 = d; id = i + g; } else if (d < d2) d2 = d; } return vec3(d1, d2, h21(id)); }
`;
const GROUND_FRAG = `precision highp float; varying vec2 vUv; uniform float uTime, uPreset, uBright; uniform vec3 uA, uB, uC, uD, uFog;` + NOISE + `
void main(){
  vec2 p = (vUv - 0.5) * 2.0; float r = length(p); if (r > 1.0) discard; float t = uTime; vec3 c;
  if (uPreset < 0.5) {
    // LAVA: Kruste in Schollen (Voronoi), glühende Risse dazwischen, Magma fließt langsam zur Mitte, Glut pulsiert
    vec2 q = p * 4.2 + vec2(t * 0.035, t * 0.02); q += 0.45 * vec2(fbm(q * 0.6 + t * 0.04), fbm(q * 0.6 - t * 0.03 + 3.1));
    vec3 v = vor(q); float e = v.y - v.x;
    float pool = smoothstep(0.58, 0.7, fbm(p * 1.6 + vec2(-t * 0.02, t * 0.015)));          // offene Magmafelder ohne Kruste
    float heat = fbm(q * 1.3 - t * 0.1);
    vec3 magma = mix(uC, uD, smoothstep(0.3, 0.8, heat)) * (1.15 + 0.35 * sin(t * 0.9 + heat * 6.0));
    vec3 crust = mix(uA, uB, 0.35 * v.z + 0.65 * fbm(q * 3.0)) * (0.8 + 0.4 * smoothstep(0.0, 0.25, e));
    float crackM = 1.0 - smoothstep(0.015, 0.075, e);                                       // schmale Risse
    float glow = exp(-e * 16.0);                                                            // Glut an den Schollenrändern
    c = mix(crust + uC * glow * 0.45, magma, max(crackM, pool));
  } else if (uPreset < 1.5) {
    // SÄURE-SEE: Kaustik-Wellen, aufsteigende Blasen (Zellen mit eigener Phase), Schaumrand
    vec2 q = p * 4.0; float w = 0.0; for (int i = 0; i < 3; i++){ float fi = float(i); w += sin(q.x * (1.3 + fi) + t * (0.9 + fi * 0.3) + fbm(q + fi + t * 0.1) * 3.0) * cos(q.y * (1.1 + fi * 0.7) - t * 0.7); }
    float caust = pow(0.5 + 0.5 * sin(w * 1.4), 6.0);
    vec3 v = vor(p * 6.0 + vec2(0.0, t * 0.08)); float ph = fract(t * 0.35 + v.z * 7.0), rad = ph * 0.42;
    float ring = smoothstep(0.035, 0.0, abs(v.x - rad)) * (1.0 - ph) * step(0.45, v.z);
    float dome = smoothstep(rad, rad * 0.6, v.x) * (1.0 - ph) * step(0.45, v.z) * 0.6;
    c = mix(uA, uB, 0.45 + 0.55 * fbm(p * 2.5 + t * 0.05)); c += uC * caust * 0.55; c = mix(c, uD, ring * 0.9 + dome * 0.35);
  } else if (uPreset < 2.5) {
    // BUBBLEGUM: Marmorschlieren, langsam gerührt, Glanzflecken
    float a = atan(p.y, p.x), sw = a + 1.2 * (1.0 - r) * sin(t * 0.15) + t * 0.05; vec2 q = vec2(cos(sw), sin(sw)) * r * 3.0;
    float m = fbm(q + fbm(q * 1.5 + t * 0.07) * 2.0);
    c = mix(uA, uB, smoothstep(0.25, 0.6, m)); c = mix(c, uC, smoothstep(0.55, 0.8, m));
    vec3 v = vor(p * 5.0 + t * 0.03); c = mix(c, uD, smoothstep(0.16, 0.0, v.x) * 0.55 * step(0.6, v.z));
  } else {
    // WIRBEL: logarithmische Spirale, schwarzer Schlund
    float a = atan(p.y, p.x), w = a * 3.0 + 4.0 * log(max(r, 0.02)) * -1.0 - t * 0.6;
    float band = pow(0.5 + 0.5 * sin(w + fbm(p * 3.0) * 2.0), 3.0);
    c = mix(uA, mix(uC, uD, band), band * smoothstep(0.08, 0.7, r)); c = mix(c, vec3(0.01), smoothstep(0.3, 0.04, r));
  }
  c = mix(c, uFog, smoothstep(0.62, 1.0, r));
  gl_FragColor = vec4(c * uBright, 1.0);
  #include <colorspace_fragment>
}`;
const SKY_FRAG = `precision highp float; varying vec2 vUv; uniform float uTime, uPreset, uBright; uniform vec3 uA, uB, uC, uD, uFog;` + NOISE + `
void main(){
  vec2 p = (vUv - 0.5) * 2.0; float r = length(p); if (r > 1.0) discard; float t = uTime; vec3 c;
  if (uPreset < 0.5) {
    // HIMMEL: Zenit tief, zum Rand hell, ziehende Wolken (fbm), Sonnenhof
    c = mix(uA, uB, smoothstep(0.0, 0.95, r));
    float cl = fbm(p * 2.2 + vec2(t * 0.03, t * 0.012)); cl = smoothstep(0.48, 0.72, cl + 0.15 * (r - 0.5));
    c = mix(c, uC, cl * 0.85);
    vec2 sp = vec2(0.32, -0.22); float sd = length(p - sp); c += uD * (0.9 * exp(-sd * sd * 60.0) + 0.25 * exp(-sd * 4.0));
  } else if (uPreset < 1.5) {
    // BUBBLEGUM-HIMMEL: Wattebäusche in Rosa/Lila
    c = mix(uA, uB, smoothstep(0.0, 1.0, r)); vec2 q = p * 2.6 + vec2(t * 0.02, -t * 0.015);
    float puff = fbm(q + fbm(q * 2.0) * 0.6); c = mix(c, uC, smoothstep(0.45, 0.7, puff)); c = mix(c, uD, smoothstep(0.7, 0.85, puff) * 0.6);
  } else if (uPreset < 2.5) {
    // AURORA: Nacht, funkelnde Sterne, Vorhänge
    c = mix(uA, uB, smoothstep(0.0, 1.0, r) * 0.7);
    vec2 g = floor(p * 70.0); float s = h21(g); float tw = 0.5 + 0.5 * sin(t * 2.0 + s * 40.0); c += vec3(1.0) * step(0.985, s) * tw * smoothstep(0.5, 0.0, length(fract(p * 70.0) - 0.5));
    for (int i = 0; i < 3; i++){ float fi = float(i); float y = p.y + 0.25 * sin(p.x * (2.0 + fi) + t * (0.2 + fi * 0.07)) + 0.3 * (fi - 1.0); float band = exp(-y * y * 70.0) * (0.6 + 0.4 * fbm(vec2(p.x * 6.0 + t * 0.3, fi)));
      float rays = 0.55 + 0.45 * vn(vec2(p.x * 38.0 + fi * 7.0, t * 0.6)); c += mix(uC, uD, fi * 0.5) * band * rays * 0.75; }
  } else {
    // ABENDROT: Bänder, tiefe Sonne am Rand
    float b = p.y * 0.5 + 0.5; c = mix(uA, uB, smoothstep(0.1, 0.75, b)); c = mix(c, uC, smoothstep(0.6, 0.95, b));
    float cl = fbm(vec2(p.x * 3.0 + t * 0.02, p.y * 9.0)); c = mix(c, uA * 0.8 + uB * 0.4, smoothstep(0.55, 0.75, cl) * 0.6);
    float sd = length(p - vec2(0.0, 0.78)); c += uD * exp(-sd * sd * 30.0);
  }
  c = mix(c, uFog, smoothstep(0.6, 1.0, r));
  gl_FragColor = vec4(c * uBright, 1.0);
  #include <colorspace_fragment>
}`;

function funnelGeometry(THREE, R, H, wo, o = FUNNEL) {
  const L = o.L * R, re = o.rEnd * R, M = o.rings, N = o.seg, prof = [];
  const sm = s => s * s * (3 - 2 * s);
  prof.push({ s: 0, r: R, h: -0.4 }); /* 0,4 u Überlapp in den Mantel: keine Fuge zwischen zwei Netzen (Deckungsprobe: 3 Fehlstrahlen genau auf der Naht) */
  for (let j = 0; j <= M; j++) { const s = j / M; prof.push({ s, r: re + (R - re) * (1 - sm(s)), h: L * s }); }
  let acc = -0.4 / H * H; prof[0].v = -0.4 / H; acc = 0; prof[1].v = 0; for (let j = 2; j <= M + 1; j++) { const a = prof[j - 1], b = prof[j], ds = Math.hypot(b.r - a.r, b.h - a.h); acc += ds * R / ((a.r + b.r) / 2); b.v = acc / H; }
  /* Ringe von oben nach unten ordnen (wie CylinderGeometry), damit Umlaufsinn und uv-Richtung dem Mantel entsprechen */
  const rings = wo === 'oben' ? prof.slice().reverse().map(q => ({ ...q, y: H / 2 + q.h, vv: 1 + q.v })) : prof.map(q => ({ ...q, y: -H / 2 - q.h, vv: -q.v }));
  const pos = [], uv = [], fog = [], idx = [];
  rings.forEach(q => { for (let i = 0; i <= N; i++) { const u = i / N, th = u * Math.PI * 2; pos.push(q.r * Math.sin(th), q.y, q.r * Math.cos(th)); uv.push(u, q.vv); fog.push(Math.min(1, Math.max(0, (q.s - o.fog0) / (o.fog1 - o.fog0))) ** 1.3); } });
  for (let y = 0; y < rings.length - 1; y++) for (let x = 0; x < N; x++) { const a = y * (N + 1) + x, b = (y + 1) * (N + 1) + x, c = b + 1, d = a + 1; idx.push(a, b, d, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('aFog', new THREE.Float32BufferAttribute(fog, 1)); g.setIndex(idx); g.computeVertexNormals();
  return { geo: g, endY: wo === 'oben' ? H / 2 + L : -H / 2 - L, endR: re, L };
}
function funnelMaterial(THREE, tex) {
  const fogU = { value: new THREE.Color() };
  const m = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, toneMapped: false, fog: false, depthTest: false, depthWrite: false });
  m.onBeforeCompile = sh => { sh.uniforms.uEndFog = fogU;
    sh.vertexShader = 'attribute float aFog; varying float vEndFog;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vEndFog = aFog;');
    sh.fragmentShader = 'uniform vec3 uEndFog; varying float vEndFog;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb = mix(diffuseColor.rgb, uEndFog, vEndFog);'); };
  m.customProgramCacheKey = () => 'kfb-spindle-funnel-v3'; m.userData.fog = fogU; return m;
}

export function createSpindleSky({ THREE }) {
  let hi = null, group = null, poseCam = null, cards = [], mounted = false, ends = {}, t = 0, last = null;
  const cfg = { unten: 'lava', oben: 'himmel', palUnten: 'shader', palOben: 'shader', seed: 1 };
  const normalised = fn => { const s = group.scale.x, p = group.position.clone(); group.scale.setScalar(1); group.position.set(0, 0, 0); group.updateMatrixWorld(true);
    try { return fn(); } finally { group.scale.setScalar(s); group.position.copy(p); group.updateMatrixWorld(true); } };
  const buildEnd = wo => {
    const H = hi.hoehe, R = hi.radius, f = funnelGeometry(THREE, R, H, wo), mat = funnelMaterial(THREE, hi.tex), mesh = new THREE.Mesh(f.geo, mat);
    mesh.name = 'spindel-trichter-' + wo; mesh.renderOrder = -800; mesh.frustumCulled = false; hi.mesh.add(mesh);
    const U = { uTime: { value: 0 }, uPreset: { value: 0 }, uBright: { value: 1 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uD: { value: new THREE.Color() }, uFog: { value: new THREE.Color() } };
    const emat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: END_VERT, fragmentShader: wo === 'oben' ? SKY_FRAG : GROUND_FRAG, side: THREE.DoubleSide, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
    const eg = new THREE.CircleGeometry(f.endR * 1.02, 64); eg.rotateX(wo === 'oben' ? Math.PI / 2 : -Math.PI / 2);
    const emesh = new THREE.Mesh(eg, emat); emesh.name = 'spindel-ende-' + wo; emesh.position.y = f.endY + (wo === 'oben' ? -0.02 : 0.02); emesh.renderOrder = -799; emesh.frustumCulled = false; hi.mesh.add(emesh);
    ends[wo] = { mesh, mat, geo: f.geo, emesh, emat, egeo: eg, U, f, pal: null };
  };
  const applyEnd = wo => {
    const e = ends[wo]; if (!e) return; const preset = cfg[wo], list = ENDS[wo], pal = paletteFor(THREE, wo, preset, wo === 'oben' ? cfg.palOben : cfg.palUnten, cfg.seed, hi.basis);
    e.U.uPreset.value = Math.max(0, list.indexOf(preset)); [e.U.uA.value, e.U.uB.value, e.U.uC.value, e.U.uD.value].forEach((c, i) => c.copy(pal.cols[i])); e.U.uFog.value.copy(pal.fog); e.mat.userData.fog.value.copy(pal.fog); e.pal = pal;
  };
  const self = {
    contract: CONTRACT, get mounted() { return mounted; }, get group() { return group; }, get config() { return { ...cfg }; },
    async mount(parent, c) {
      cards = c.cards || []; if (cards.length !== 6) throw new Error('SOURCE_REQUIRED: sechs echte Kartenmotive nötig, ' + cards.length + ' geliefert');
      const { default: Himmel } = await import(HIMMEL);
      group = new THREE.Group(); group.name = 'spindle-sky'; group.scale.setScalar(c.scale || 1); parent.add(group);
      hi = new Himmel({ THREE, an: true, log: () => {} }); hi.mount(group); cards.forEach((k, i) => hi.fuellen(i, k.canvas, k.q)); hi.farbeLesen(null, null);
      if (hi.trichter) hi.trichter.visible = false;
      poseCam = new THREE.PerspectiveCamera(46, 16 / 9, 0.05, 120); poseCam.position.set(0, 5.9, 0); poseCam.updateMatrixWorld(true);
      Object.assign(cfg, c.ends || {});
      buildEnd('oben'); buildEnd('unten'); applyEnd('oben'); applyEnd('unten');
      mounted = true; return group;
    },
    setEnds(p = {}) { for (const k of ['unten', 'oben']) if (p[k] && ENDS[k].includes(p[k])) cfg[k] = p[k]; if (p.palUnten) cfg.palUnten = p.palUnten; if (p.palOben) cfg.palOben = p.palOben; if (p.seed != null) cfg.seed = p.seed; applyEnd('unten'); applyEnd('oben'); },
    setPreset(p = {}) { if (p.see) self.setEnds({ unten: p.see === 'aus' ? cfg.unten : p.see }); },
    pinned: false,
    follow(camera) { if (group && !self.pinned) group.position.set(camera.position.x, camera.position.y - 5.9 * group.scale.x, camera.position.z); },
    update(dt, sig = {}) {
      if (!mounted) return; t += dt; hi.update(dt);
      const k = sig.brightness != null ? sig.brightness : 1; hi.mat.color.setRGB(k, k, k);
      for (const e of Object.values(ends)) { e.mat.color.setRGB(k, k, k); e.U.uTime.value = t; e.U.uBright.value = 0.35 + 0.65 * k; }
    },
    /* Deckung: 15 Höhenwinkel × 24 Azimute von der Spielpose, Ziele Mantel + Trichter + Endflächen (BackSide/DoubleSide wie gezeichnet) */
    measure() {
      return last = normalised(() => {
        const rc = new THREE.Raycaster(), o = new THREE.Vector3(0, 5.9, 0), targets = [hi.mesh, ...Object.values(ends).flatMap(e => [e.mesh, e.emesh])]; let n = 0, miss = 0, beyond = 0, dmax = 0, up = 0, down = 0;
        for (let i = 0; i < 15; i++) { const el = -84 + i * 12; for (let j = 0; j < 24; j++) { const az = j * 15 + 1.7, d = new THREE.Vector3(Math.cos(el * Math.PI / 180) * Math.sin(az * Math.PI / 180), Math.sin(el * Math.PI / 180), -Math.cos(el * Math.PI / 180) * Math.cos(az * Math.PI / 180)); rc.set(o, d); n++;
          const h = rc.intersectObjects(targets, false)[0]; if (!h) { miss++; if (el > 0) up++; else down++; continue; } dmax = Math.max(dmax, h.distance); if (h.distance > 120) beyond++; } }
        return { pass: miss === 0 && beyond === 0, rays: n, miss, up, down, beyond, dmax: +dmax.toFixed(1), text: n + ' Strahlen · ' + miss + ' fehl (oben ' + up + ', unten ' + down + ') · ' + beyond + ' jenseits far 120 · max ' + dmax.toFixed(1) + ' u' };
      });
    },
    probe() {
      if (!mounted) return { contract: CONTRACT, mounted: false };
      const m = self.measure(), meshes = []; group.traverse(o => { if (o.isMesh && o.visible) meshes.push(o); });
      const tris = meshes.reduce((a, o) => a + (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3, 0), h = normalised(() => hi.probe());
      const pe = wo => { const e = ends[wo]; return { shader: cfg[wo], palette: e.pal.source + (cfg.seed !== 1 ? ' · Saat ' + cfg.seed : ''), cols: e.pal.cols.map(c => '#' + c.getHexString()), fog: '#' + e.pal.fog.getHexString(), L: +e.f.L.toFixed(1), rEnd: +e.f.endR.toFixed(1), endY: +e.f.endY.toFixed(1) }; };
      return { contract: CONTRACT, mounted: true, meshes: meshes.map(o => o.name), tris: Math.round(tris), materials: new Set(meshes.map(o => o.material)).size, tor: m,
        himmel: { belegt: h.belegt, motive: h.motive, atlas: h.atlas, radius: h.radius, hoehe: h.hoehe, reihen: h.reihen }, enden: { unten: pe('unten'), oben: pe('oben') }, cards: cards.map(k => ({ n: k.n, page: k.page, quadrant: k.q })) };
    },
    dispose() {
      if (!mounted) return; mounted = false;
      for (const e of Object.values(ends)) { e.mesh.removeFromParent(); e.emesh.removeFromParent(); e.geo.dispose(); e.mat.dispose(); e.egeo.dispose(); e.emat.dispose(); } ends = {};
      hi.dispose(); group.removeFromParent(); group = null; hi = null; poseCam = null;
    }
  };
  return self;
}
