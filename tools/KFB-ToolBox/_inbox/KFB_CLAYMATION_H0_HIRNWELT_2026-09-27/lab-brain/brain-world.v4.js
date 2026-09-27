/* KFB Hirnwelt H0 · brain-world v4 (v4: Gegenlicht, Orte-Kamera, Insel = 34/35 · v2/v3: Band über die ganze Breite geprüft, paralleles Laden, Beschriftung ohne Überlappung, Insula = Region 34/35)
 * Ein Knet-Hirn als kleine Welt. Gelände aus BodyParts3D 3.0 (DBCLS, CC BY-SA 2.1 JP), 44 Netze
 * (Gyri, Kleinhirn, Hirnstamm), gebacken auf eine Würfelkugel (brain-world.v1.bin, siehe .json).
 * Knet-Material, Vorstufe und Relief unverändert aus lab-clay (clay-material.v4, clay-soften.v1,
 * clay-relief.v2). Figuren aus dem Resident Atlas (Rig_Medium / Rig_Large, KayKit Character
 * Animations 1.1), Häuser und Autos KayKit City Builder Bits. Alles @2ff8b350, byteweise geprüft.
 *
 * Anatomie als Landschaft: Gyri = Hügelrücken, Sulci = Flüsse (Wasserschale unter der stark
 * geglätteten Oberfläche), Fissura longitudinalis = Schlucht mit Brücken. Straßen suchen über
 * Dijkstra den Grat der Windungen und überspannen Furchen als Brücke (Hüllkurve über dem Gelände).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture } from '../lab-clay/clay-material.v4.js';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';

const here = f => new URL(f, import.meta.url).href;
const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
const KIT = 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const MS = 'media/3D_Assets/KayKit_Mystery_Series6/';
const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';

const N = 160, V = (N + 1) * (N + 1), NV = 6 * V;
const WS = 0.25;              // Welteinheiten je mm: Hirn 170 mm lang → 42,5 Einheiten
const KS = 0.47;              // KayKit-Figuren: Medium 2,3–2,6 u → 1,1–1,2 Einheiten (≈ 4,5 mm), Large bleibt ≈ 2× (Atlas S20)

const LOBE = {}; const REGION = {};
[[1,'Gyrus frontalis superior','frontal','R'],[2,'Gyrus frontalis superior','frontal','L'],[3,'Gyrus frontalis medius','frontal','R'],[4,'Gyrus frontalis medius','frontal','L'],
 [5,'Gyri orbitales','frontal',''],[6,'Gyrus praecentralis','frontal','R'],[7,'Gyrus praecentralis','frontal','L'],[8,'Gyrus postcentralis','parietal','R'],[9,'Gyrus postcentralis','parietal','L'],
 [10,'Gyrus supramarginalis','parietal','R'],[11,'Gyrus supramarginalis','parietal','L'],[12,'Gyrus angularis','parietal','R'],[13,'Gyrus angularis','parietal','L'],
 [14,'Lobulus parietalis superior','parietal','R'],[15,'Lobulus parietalis superior','parietal','L'],[16,'Lobus occipitalis','occipital','R'],[17,'Lobus occipitalis','occipital','L'],
 [18,'Gyrus temporalis superior','temporal','R'],[19,'Gyrus temporalis superior','temporal','L'],[20,'Gyrus temporalis superior','temporal','R'],[21,'Gyrus temporalis superior','temporal','L'],
 [22,'Gyrus temporalis medius','temporal','R'],[23,'Gyrus temporalis medius','temporal','L'],[24,'Gyrus temporalis inferior','temporal','R'],[25,'Gyrus temporalis inferior','temporal','L'],
 [26,'Gyrus fusiformis','temporal','R'],[27,'Gyrus fusiformis','temporal','L'],[28,'Gyrus parahippocampalis','limbic','R'],[29,'Gyrus parahippocampalis','limbic','L'],
 [30,'Gyrus cinguli','limbic','R'],[31,'Gyrus cinguli','limbic','L'],[32,'Insula','insula','R'],[33,'Insula','insula','L'],[34,'Insula','insula','R'],[35,'Insula','insula','L'],
 [40,'Cerebellum','cerebellum',''],[41,'Pons','stem',''],[42,'Medulla oblongata','stem',''],[43,'Mesencephalon','stem',''],[44,'Pedunculus cerebri','stem',''],[45,'Hypothalamus','stem',''],[46,'Chiasma opticum','stem','']
].forEach(([id, de, lobe, side]) => { LOBE[id] = lobe; REGION[id] = { de, lobe, side }; });

export const PALETTES = {
  hirn:  { name: 'Knethirn', frontal: '#eaa39c', parietal: '#e79e98', occipital: '#e59b9a', temporal: '#e8a49a', limbic: '#e3a4a0', insula: '#e6a698', cerebellum: '#e4999a', stem: '#e7b3a3', deep: '#b8686d', water: '#5983ac' },
  lappen:{ name: 'Lappen', frontal: '#ef5a22', parietal: '#f2b632', occipital: '#5983ac', temporal: '#8b68c7', limbic: '#cdc666', insula: '#e8743a', cerebellum: '#1f7a3e', stem: '#e2d0bc', deep: null, water: '#5983ac' },
  land:  { name: 'Landschaft', frontal: '#f0a27c', parietal: '#cdc666', occipital: '#a582d9', temporal: '#57a59b', limbic: '#fde892', insula: '#f2b632', cerebellum: '#1f7a3e', stem: '#5d6f86', deep: null, water: '#5983ac' }
};
const C = { track: '#5d6f86', line: '#e2d0bc', wall: '#5983ac', roof: '#ef5a22', accent: '#f2b632', cloud: '#e2d0bc', leaf: '#1f7a3e', lime: '#cdc666', trunk: '#8b5a3c', sky: '#96bede', white: '#f4f1ea', ink: '#26303b' };
const MOODS = {
  day:    { sun: '#fff4e6', sunI: 2.8, el: 38, az: -30, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, sky: '#96bede' },
  golden: { sun: '#ffd2a1', sunI: 2.6, el: 14, az: -64, hemiS: '#f0b49a', hemiG: '#6b3e5a', hemiI: 0.8, sky: '#e9a07c' },
  nacht:  { sun: '#9fb4d8', sunI: 0.9, el: 50, az: 20, hemiS: '#2e4262', hemiG: '#0f131b', hemiI: 0.6, sky: '#1b2533' }
};

const faceAx = f => { const k = f >> 1, s = (f & 1) ? -1 : 1; return [k, s, (k + 1) % 3, (k + 2) % 3]; };
const dirOf = (f, a, b) => {
  const [k, s, i, j] = faceAx(f); const p = [0, 0, 0];
  p[k] = s; p[i] = Math.tan((-1 + 2 * a / N) * Math.PI / 4); p[j] = Math.tan((-1 + 2 * b / N) * Math.PI / 4);
  const l = Math.hypot(p[0], p[1], p[2]); return [p[0] / l, p[1] / l, p[2] / l];
};
function locate(x, y, z) {
  const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
  const k = ax > ay ? (ax > az ? 0 : 2) : (ay > az ? 1 : 2);
  const d = [x, y, z]; const f = k * 2 + (d[k] < 0 ? 1 : 0);
  const [, s, i, j] = faceAx(f); const dd = s * d[k];
  return [f, (Math.atan(d[i] / dd) * 4 / Math.PI + 1) / 2 * N, (Math.atan(d[j] / dd) * 4 / Math.PI + 1) / 2 * N];
}
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export async function boot(canvas, onNote = () => {}) {
  const state = { palette: 'hirn', mood: 'day', relief: true, ao: true, labels: true, traffic: true, cam: 'totale', knet: 3, water: 2.2, speed: 1 };
  const info = { fps: 0, tris: 0, errors: [], loaded: 0, roadLen: 0, bridges: 0, chars: 0, cars: 0, coverage: '98,9 %', knet: 3 };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 600);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.minDistance = 3; controls.maxDistance = 220;
  camera.position.set(-58, 34, 70); controls.target.set(0, 0, 0); controls.update();

  // Relief wie D1
  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 23 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex);
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('prints: ' + e.message); U.uClayPrint.value = tex; }
  const clay = (color, role = 'world', extra = {}) => makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, vertexColors: !!extra.vc }), role, ...extra });

  // Licht
  const sun = new THREE.DirectionalLight('#fff', 3); sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 10, far: 160 });
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#fff', '#888', 1); scene.add(hemi);
  const fill = new THREE.DirectionalLight('#ffe6d6', 0.7); scene.add(fill);   // Gegenlicht, damit die Unterseite (Kleinhirn, Hirnstamm) nicht absäuft

  // ---------- Gelände aus dem Bake ----------
  onNote('Hirn wird geladen (BodyParts3D) …');
  const buf = await fetch(here('brain-world.v1.bin')).then(r => { if (!r.ok) throw new Error('brain-world.v1.bin ' + r.status); return r.arrayBuffer(); });
  const R0g = new Float32Array(buf, 0, NV), ID0g = new Uint8Array(buf, NV * 4, NV);
  const G2W = new Int32Array(NV); const keyMap = new Map(); const dirsW = [], r0W = [], idW = [];
  for (let f = 0; f < 6; f++) for (let b = 0; b <= N; b++) for (let a = 0; a <= N; a++) {
    const gi = f * V + b * (N + 1) + a, d = dirOf(f, a, b);
    const key = Math.round(d[0] * 1e5) + ',' + Math.round(d[1] * 1e5) + ',' + Math.round(d[2] * 1e5);
    let w = keyMap.get(key);
    if (w === undefined) { w = r0W.length; keyMap.set(key, w); dirsW.push(d[0], d[1], d[2]); r0W.push(R0g[gi]); idW.push(ID0g[gi]); }
    else if (!idW[w] && ID0g[gi]) idW[w] = ID0g[gi];
    G2W[gi] = w;
  }
  const M = r0W.length, DIR = new Float32Array(dirsW), RAW0 = new Float32Array(r0W), RID = new Uint8Array(idW);
  const idx = [];
  for (let f = 0; f < 6; f++) {
    const g = (a, b) => G2W[f * V + b * (N + 1) + a];
    const d00 = dirOf(f, 0, 0), d10 = dirOf(f, 1, 0), d01 = dirOf(f, 0, 1);
    const e1 = [d10[0] - d00[0], d10[1] - d00[1], d10[2] - d00[2]], e2 = [d01[0] - d00[0], d01[1] - d00[1], d01[2] - d00[2]];
    const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const out = cr[0] * d00[0] + cr[1] * d00[1] + cr[2] * d00[2] > 0;
    for (let b = 0; b < N; b++) for (let a = 0; a < N; a++) {
      const v00 = g(a, b), v10 = g(a + 1, b), v11 = g(a + 1, b + 1), v01 = g(a, b + 1);
      if (out) idx.push(v00, v10, v11, v00, v11, v01); else idx.push(v00, v11, v10, v00, v01, v11);
    }
  }
  // Nachbarn (CSR)
  const nb = Array.from({ length: M }, () => []);
  for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) {
    const a = idx[t + e], b = idx[t + (e + 1) % 3];
    if (!nb[a].includes(b)) nb[a].push(b); if (!nb[b].includes(a)) nb[b].push(a);
  }
  const NBo = new Int32Array(M + 1); for (let i = 0; i < M; i++) NBo[i + 1] = NBo[i] + nb[i].length;
  const NBi = new Int32Array(NBo[M]); for (let i = 0; i < M; i++) NBi.set(nb[i], NBo[i]);
  // Region auch für die gefüllten Punkte (Nachbar-Ausbreitung)
  for (let pass = 0, left = 1; left && pass < 50; pass++) {
    left = 0;
    for (let i = 0; i < M; i++) if (!RID[i]) { for (let k = NBo[i]; k < NBo[i + 1]; k++) if (RID[NBi[k]]) { RID[i] = RID[NBi[k]]; break; } if (!RID[i]) left++; }
  }
  const smooth = (src, iters, lam = 0.5, mu = -0.53) => {
    let a = Float32Array.from(src), b = new Float32Array(M);
    for (let it = 0; it < iters; it++) for (const k of (mu ? [lam, mu] : [lam])) {
      for (let i = 0; i < M; i++) { let s = 0; const o = NBo[i], e = NBo[i + 1]; for (let q = o; q < e; q++) s += a[NBi[q]]; b[i] = a[i] + k * (s / (e - o) - a[i]); }
      const t = a; a = b; b = t;
    }
    return a;
  };
  onNote('Windungen werden geknetet …');
  await new Promise(r => setTimeout(r, 10));
  const RBAR = smooth(RAW0, 70, 0.9, 0);      // Hüllfläche für Wasser und Tiefe
  let RK = smooth(RAW0, state.knet);

  const tpos = new Float32Array(M * 3), tcol = new Float32Array(M * 3);
  const terrGeo = new THREE.BufferGeometry();
  terrGeo.setAttribute('position', new THREE.BufferAttribute(tpos, 3));
  terrGeo.setAttribute('color', new THREE.BufferAttribute(tcol, 3));
  terrGeo.setIndex(idx);
  const applyTerrain = () => {
    for (let i = 0; i < M; i++) { const r = RK[i] * WS; tpos[i * 3] = DIR[i * 3] * r; tpos[i * 3 + 1] = DIR[i * 3 + 1] * r; tpos[i * 3 + 2] = DIR[i * 3 + 2] * r; }
    terrGeo.attributes.position.needsUpdate = true; terrGeo.computeVertexNormals(); terrGeo.computeBoundingSphere();
  };
  applyTerrain();
  seedGeometry(THREE, terrGeo, 5);
  const terrMat = clay('#ffffff', 'world', { vc: true, scale: 1.1 });
  const terrain = new THREE.Mesh(terrGeo, terrMat); terrain.castShadow = terrain.receiveShadow = true; scene.add(terrain);

  const paintTerrain = () => {
    const P = PALETTES[state.palette]; const col = new THREE.Color(), deep = new THREE.Color(P.deep || '#000'), cache = {};
    const lob = l => cache[l] || (cache[l] = new THREE.Color(P[l] || P.frontal));
    for (let i = 0; i < M; i++) {
      const id = RID[i]; col.copy(lob(LOBE[id] || 'stem'));
      const d = RBAR[i] - RK[i];                        // mm unter der Hüllfläche: > 0 Furche, < 0 Grat
      const j = (hash(id) - 0.5) * 0.08;                // jede Windung ein eigener Klumpen
      col.offsetHSL(0, 0, j);
      if (P.deep) col.lerp(deep, THREE.MathUtils.clamp((d - 0.4) / 4.5, 0, 0.75));
      else col.multiplyScalar(1 - THREE.MathUtils.clamp((d - 0.6) / 6, 0, 0.3));
      if (d < -1.2) col.offsetHSL(0, 0, THREE.MathUtils.clamp((-d - 1.2) / 10, 0, 0.06));
      tcol[i * 3] = col.r; tcol[i * 3 + 1] = col.g; tcol[i * 3 + 2] = col.b;
    }
    terrGeo.attributes.color.needsUpdate = true;
    waterMat.color.set(P.water);
  };

  // Wasser: Schale unter der Hüllfläche, taucht nur in Furchen auf
  const wpos = new Float32Array(M * 3);
  const waterGeo = new THREE.BufferGeometry(); waterGeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3)); waterGeo.setIndex(idx);
  const waterMat = clay(C.wall, 'knetbar', { scale: 0.9 });
  const water = new THREE.Mesh(waterGeo, waterMat); water.receiveShadow = true; scene.add(water);
  const applyWater = () => {
    for (let i = 0; i < M; i++) { const r = Math.max(8, RBAR[i] - state.water) * WS; wpos[i * 3] = DIR[i * 3] * r; wpos[i * 3 + 1] = DIR[i * 3 + 1] * r; wpos[i * 3 + 2] = DIR[i * 3 + 2] * r; }
    waterGeo.attributes.position.needsUpdate = true; waterGeo.computeVertexNormals(); seedGeometry(THREE, waterGeo, 9);
  };
  applyWater();
  paintTerrain();

  // Abfragen auf der Kugel
  const sampleArr = (x, y, z, arr) => {
    const [f, gx, gy] = locate(x, y, z);
    const a0 = Math.min(N - 1, Math.max(0, Math.floor(gx))), b0 = Math.min(N - 1, Math.max(0, Math.floor(gy)));
    const fx = THREE.MathUtils.clamp(gx - a0, 0, 1), fy = THREE.MathUtils.clamp(gy - b0, 0, 1);
    const g = (a, b) => arr[G2W[f * V + b * (N + 1) + a]];
    return (g(a0, b0) * (1 - fx) + g(a0 + 1, b0) * fx) * (1 - fy) + (g(a0, b0 + 1) * (1 - fx) + g(a0 + 1, b0 + 1) * fx) * fy;
  };
  const nearestW = (x, y, z) => { const [f, gx, gy] = locate(x, y, z); return G2W[f * V + Math.min(N, Math.max(0, Math.round(gy))) * (N + 1) + Math.min(N, Math.max(0, Math.round(gx)))]; };
  const nrmAt = (d) => { const n = terrGeo.attributes.normal; const w = nearestW(d.x, d.y, d.z); return new THREE.Vector3(n.getX(w), n.getY(w), n.getZ(w)).normalize(); };
  const rAt = d => sampleArr(d.x, d.y, d.z, RK);
  const surf = d => d.clone().multiplyScalar(rAt(d) * WS);
  const aboveWater = d => rAt(d) > sampleArr(d.x, d.y, d.z, RBAR) - state.water + 0.35;

  // Ankerpunkt je Region: nah an der Mitte, oben auf dem Grat, flach
  const regionVerts = {};
  for (let i = 0; i < M; i++) (regionVerts[RID[i]] = regionVerts[RID[i]] || []).push(i);
  const anchorOf = (id, bias = null) => {
    const vs = regionVerts[id] || []; const c = new THREE.Vector3();
    if (!vs.length) { info.errors.push('Region ' + id + ' nicht an der Oberfläche'); const i0 = nearestW(0, 1, 0); return { i: i0, dir: new THREE.Vector3(DIR[i0 * 3], DIR[i0 * 3 + 1], DIR[i0 * 3 + 2]) }; }
    vs.forEach(i => { c.x += DIR[i * 3]; c.y += DIR[i * 3 + 1]; c.z += DIR[i * 3 + 2]; });
    c.normalize(); if (bias) c.lerp(bias, 0.5).normalize();
    let best = -1e9, bi = vs[0];
    const n = terrGeo.attributes.normal, v = new THREE.Vector3();
    for (const i of vs) {
      v.set(DIR[i * 3], DIR[i * 3 + 1], DIR[i * 3 + 2]);
      const flat = n.getX(i) * v.x + n.getY(i) * v.y + n.getZ(i) * v.z;
      const s = -Math.acos(Math.min(1, v.dot(c))) * 9 + (RK[i] - RBAR[i]) * 0.35 + flat * 2.2;
      if (s > best) { best = s; bi = i; }
    }
    return { i: bi, dir: new THREE.Vector3(DIR[bi * 3], DIR[bi * 3 + 1], DIR[bi * 3 + 2]) };
  };
  const A = {}; const anc = (id, bias) => A[id + (bias ? 'b' : '')] || (A[id + (bias ? 'b' : '')] = anchorOf(id, bias));

  // ---------- Straßen ----------
  onNote('Straßen werden über die Windungen gelegt …');
  await new Promise(r => setTimeout(r, 10));
  const PX = new Float32Array(M), PY = new Float32Array(M), PZ = new Float32Array(M);
  for (let i = 0; i < M; i++) { PX[i] = DIR[i * 3] * RK[i]; PY[i] = DIR[i * 3 + 1] * RK[i]; PZ[i] = DIR[i * 3 + 2] * RK[i]; }
  const dist = new Float64Array(M), prev = new Int32Array(M), done = new Uint8Array(M);
  const route = (s, t) => {
    dist.fill(Infinity); prev.fill(-1); done.fill(0);
    const hN = [], hD = [];
    const push = (n, d) => { hN.push(n); hD.push(d); let i = hN.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (hD[p] <= hD[i]) break; [hN[p], hN[i]] = [hN[i], hN[p]]; [hD[p], hD[i]] = [hD[i], hD[p]]; i = p; } };
    const pop = () => { const n = hN[0]; const ln = hN.pop(), ld = hD.pop(); if (hN.length) { hN[0] = ln; hD[0] = ld; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < hN.length && hD[l] < hD[m]) m = l; if (r < hN.length && hD[r] < hD[m]) m = r; if (m === i) break; [hN[m], hN[i]] = [hN[i], hN[m]]; [hD[m], hD[i]] = [hD[i], hD[m]]; i = m; } } return n; };
    const tx = DIR[t * 3], ty = DIR[t * 3 + 1], tz = DIR[t * 3 + 2];
    const H = i => Math.acos(Math.min(1, DIR[i * 3] * tx + DIR[i * 3 + 1] * ty + DIR[i * 3 + 2] * tz)) * 20;
    dist[s] = 0; push(s, H(s));
    while (hN.length) {
      const u = pop(); if (done[u]) continue; done[u] = 1; if (u === t) break;
      for (let q = NBo[u]; q < NBo[u + 1]; q++) {
        const v = NBi[q]; if (done[v]) continue;
        const L = Math.hypot(PX[v] - PX[u], PY[v] - PY[u], PZ[v] - PZ[u]);
        const deep = Math.max(0, RBAR[v] - RK[v]);
        const c = L * (1 + 0.8 * deep + 0.25 * deep * deep + 2.5 * Math.abs(RK[v] - RK[u]) / (L + 1e-6));
        const nd = dist[u] + c;
        if (nd < dist[v]) { dist[v] = nd; prev[v] = u; push(v, nd + H(v)); }
      }
    }
    const out = []; for (let v = t; v !== -1; v = prev[v]) out.push(v); return out.reverse();
  };
  // Die große Hirnrunde: rechts vorn über Motorik, Scheitel, Schläfe zur Sehrinde, links zurück
  const WAY = [1, 6, 8, 10, 20, 18, 22, 12, 14, 16, 17, 15, 13, 23, 19, 21, 11, 9, 7, 2];
  const chain = [];
  WAY.forEach((id, k) => {
    const a = anc(id).i, b = anc(WAY[(k + 1) % WAY.length]).i;
    const seg = route(a, b); if (k) seg.shift(); chain.push(...seg);
  });
  chain.pop();
  let path = chain.map(i => new THREE.Vector3(DIR[i * 3], DIR[i * 3 + 1], DIR[i * 3 + 2]));
  const cyc = (arr, i) => arr[(i % arr.length + arr.length) % arr.length];
  for (let pass = 0; pass < 6; pass++) path = path.map((_, i) => { const s = new THREE.Vector3(); for (let k = -3; k <= 3; k++) s.add(cyc(path, i + k)); return s.normalize(); });
  // gleichmäßig abtasten (0,8 mm)
  const rs = [];
  { const pts = path.map(d => d.clone().multiplyScalar(rAt(d)));
    let acc = 0; rs.push(path[0].clone());
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const L = a.distanceTo(b); let t = 0.8 - acc;
      while (t <= L) { rs.push(a.clone().lerp(b, t / L).normalize()); t += 0.8; } acc = L - (t - 0.8); } }
  const RS = rs.length; info.roadLen = Math.round(RS * 0.8);
  const road = { dir: rs, rt: new Float32Array(RS), rr: new Float32Array(RS), P: [], up: [], side: [], fwd: [], len: 0, cum: new Float32Array(RS + 1) };
  const HW = 0.4;
  const roadGroup = new THREE.Group(); scene.add(roadGroup);
  const roadMat = clay('#ffffff', 'world', { vc: true, scale: 0.5 });
  const pillarMat = clay(C.line, 'world', { scale: 0.6 });
  const buildRoad = () => {
    roadGroup.clear();
    for (let i = 0; i < RS; i++) {   // Gelände über die ganze Bandbreite, nicht nur in der Mitte
      const d = rs[i], t = rs[(i + 1) % RS].clone().sub(rs[(i - 1 + RS) % RS]), sd = t.cross(d).normalize();
      const r0 = rAt(d), ang = (HW * 1.15) / (r0 * WS); let m = r0;
      for (const k of [-1, -0.5, 0.5, 1]) m = Math.max(m, rAt(d.clone().addScaledVector(sd, ang * k).normalize()));
      road.rt[i] = m;
    }
    const mx = new Float32Array(RS);
    for (let i = 0; i < RS; i++) { let m = -1e9; for (let k = -7; k <= 7; k++) m = Math.max(m, road.rt[(i + k + RS) % RS]); mx[i] = m; }
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < RS; i++) { let s = 0, w = 0; for (let k = -8; k <= 8; k++) { const g = Math.exp(-k * k / 20); s += g * mx[(i + k + RS) % RS]; w += g; } road.rr[i] = s / w; }
    for (let i = 0; i < RS; i++) road.rr[i] = Math.max(road.rr[i], road.rt[i]) + 0.45;
    road.P = []; road.up = []; road.side = []; road.fwd = [];
    for (let i = 0; i < RS; i++) road.P.push(rs[i].clone().multiplyScalar(road.rr[i] * WS));
    const ups = rs.map((d, i) => { const lift = THREE.MathUtils.clamp((road.rr[i] - road.rt[i] - 0.45) / 1.5, 0, 1); return nrmAt(d).multiplyScalar(0.55).add(d.clone().multiplyScalar(0.45)).normalize().lerp(d, lift).normalize(); });
    for (let i = 0; i < RS; i++) {
      const u = new THREE.Vector3(); for (let k = -4; k <= 4; k++) u.add(ups[(i + k + RS) % RS]); u.normalize();
      const f = road.P[(i + 1) % RS].clone().sub(road.P[(i - 1 + RS) % RS]).normalize();
      const s = f.clone().cross(u).normalize(); u.copy(s.clone().cross(f)).normalize();
      road.up.push(u); road.side.push(s); road.fwd.push(f);
    }
    road.cum[0] = 0; for (let i = 0; i < RS; i++) road.cum[i + 1] = road.cum[i] + road.P[i].distanceTo(road.P[(i + 1) % RS]); road.len = road.cum[RS];
    // Band mit Knetwülsten am Rand und Mittelstrich
    const prof = [[-1, -0.1], [-1, 0.05], [-0.86, 0.12], [-0.74, 0.03], [-0.05, 0.03], [0.05, 0.03], [0.74, 0.03], [0.86, 0.12], [1, 0.05], [1, -0.1]];
    const cT = new THREE.Color(C.track), cL = new THREE.Color(C.line);
    const pos = [], col = [];
    const vtx = (i, k) => road.P[i].clone().addScaledVector(road.side[i], prof[k][0] * HW).addScaledVector(road.up[i], prof[k][1]);
    for (let i = 0; i < RS; i++) {
      const j = (i + 1) % RS;
      for (let k = 0; k < prof.length; k++) {
        const k2 = (k + 1) % prof.length;
        const strip = k;
        const c = (strip <= 2 || (strip >= 6 && strip <= 8)) ? cL : strip === 4 ? ((i % 8) < 4 ? cL : cT) : cT;
        const a = vtx(i, k), b = vtx(i, k2), cc = vtx(j, k2), d = vtx(j, k);
        pos.push(a.x, a.y, a.z, d.x, d.y, d.z, cc.x, cc.y, cc.z, a.x, a.y, a.z, cc.x, cc.y, cc.z, b.x, b.y, b.z);
        for (let q = 0; q < 6; q++) col.push(c.r, c.g, c.b);
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    seedGeometry(THREE, g, 31);
    const m = new THREE.Mesh(g, roadMat); m.castShadow = m.receiveShadow = true; roadGroup.add(m);
    // Pfeiler unter den Brücken
    const pil = []; let bridges = 0, inB = false;
    for (let i = 0; i < RS; i++) {
      const gap = road.rr[i] - road.rt[i] - 0.45;
      if (gap > 1.2 && !inB) { bridges++; inB = true; } else if (gap < 0.5) inB = false;
      if (gap > 1.6 && i % 9 === 0) {
        const top = road.P[i].clone().addScaledVector(road.up[i], -0.1), bot = rs[i].clone().multiplyScalar((road.rt[i] - 1) * WS);
        const L = top.distanceTo(bot); const c = new THREE.CapsuleGeometry(0.09, L, 4, 10);
        c.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(bot).normalize()));
        c.translate((top.x + bot.x) / 2, (top.y + bot.y) / 2, (top.z + bot.z) / 2); pil.push(c);
      }
    }
    info.bridges = bridges;
    if (pil.length) { const pg = mergeGeometries(pil); seedGeometry(THREE, pg, 41); const pm = new THREE.Mesh(pg, pillarMat); pm.castShadow = pm.receiveShadow = true; roadGroup.add(pm); }
  };
  buildRoad();
  const nearRoad = (p, clear) => { for (let i = 0; i < RS; i += 2) if (road.P[i].distanceToSquared(p) < clear * clear) return true; return false; };
  const roadAt = s => {
    s = ((s % road.len) + road.len) % road.len;
    let lo = 0, hi = RS; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (road.cum[m] <= s) lo = m; else hi = m; }
    const j = (lo + 1) % RS, t = (s - road.cum[lo]) / Math.max(1e-6, road.cum[lo + 1] - road.cum[lo]);
    return { P: road.P[lo].clone().lerp(road.P[j], t), up: road.up[lo].clone().lerp(road.up[j], t).normalize(), fwd: road.fwd[lo].clone().lerp(road.fwd[j], t).normalize(), side: road.side[lo].clone().lerp(road.side[j], t).normalize(), i: lo };
  };
  const sOfIndex = i => road.cum[i];
  const nearestRoadIndex = d => { let best = 1e9, bi = 0; for (let i = 0; i < RS; i++) { const q = 1 - rs[i].dot(d); if (q < best) { best = q; bi = i; } } return bi; };

  // ---------- Platzieren ----------
  const placed = [];   // { obj, dir, lift, yaw, blend }
  const orient = (obj, p, up, fwd) => {
    const f = fwd.clone().addScaledVector(up, -fwd.dot(up)).normalize(); const x = up.clone().cross(f);
    obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, f)); obj.position.copy(p);
  };
  const tangentOf = (n, yaw) => { const ref = Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0); const t = ref.clone().cross(n).normalize(); return t.applyAxisAngle(n, yaw); };
  const put = (obj, dir, { lift = 0, yaw = 0, blend = 0.5, face = null } = {}) => {
    const rec = { obj, dir: dir.clone().normalize(), lift, yaw, blend, face };
    const go = () => {
      const d = rec.dir, n = d.clone().lerp(nrmAt(d), rec.blend).normalize(), p = surf(d).addScaledVector(n, rec.lift);
      let f = tangentOf(n, rec.yaw); if (rec.face) f = rec.face.clone().sub(p).normalize();
      orient(rec.obj, p, n, f);
    };
    rec.go = go; go(); placed.push(rec); scene.add(obj); return rec;
  };
  const around = (dir, dist, ang) => { const t1 = tangentOf(dir, 0), t2 = dir.clone().cross(t1); return dir.clone().multiplyScalar(1).addScaledVector(t1, Math.cos(ang) * dist).addScaledVector(t2, Math.sin(ang) * dist).normalize(); };
  const scatter = (dir, n, rMin, rMax, clear, seed, extra = () => true) => {
    const out = []; let tries = 0;
    while (out.length < n && tries < n * 40) {
      tries++; const a = hash(seed + tries * 1.7) * Math.PI * 2, r = rMin + (rMax - rMin) * Math.sqrt(hash(seed + tries * 3.1));
      const d = around(dir, r / 22, a); const p = surf(d);
      if (!aboveWater(d) || nearRoad(p, HW + 0.7) || out.some(q => surf(q).distanceTo(p) < clear) || !extra(d)) continue;
      out.push(d);
    }
    return out;
  };

  // ---------- Modelle ----------
  const loader = new GLTFLoader();
  const softCache = new Map();
  const clayify = (root, { role = 'world', soften = true, softOpt = {}, seed = 1 } = {}) => {
    const mc = new Map();
    root.traverse(o => {
      if (!o.isMesh) return; o.castShadow = o.receiveShadow = true;
      const conv = s => { if (!mc.has(s)) mc.set(s, makeClayMaterial(THREE, U, { src: s, role, scale: 0.5 })); return mc.get(s); };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
      if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
      if (soften && !o.isSkinnedMesh) {
        let g = softCache.get(o.geometry);
        if (!g) { try { g = softenGeometry(THREE, o.geometry, softOpt).geometry; } catch (e) { g = o.geometry; } softCache.set(o.geometry, g); }
        o.geometry = seedGeometry(THREE, g.clone(), seed + o.id);
      } else if (!o.isSkinnedMesh) o.geometry = seedGeometry(THREE, o.geometry.clone(), seed + o.id);
    });
  };
  const gltfCache = new Map();
  const loadG = p => { if (!gltfCache.has(p)) gltfCache.set(p, loader.loadAsync(RAW(p)).then(g => { info.loaded++; return g; })); return gltfCache.get(p); };
  // Modell auf Fußpunkt setzen (Mitte unten = Ursprung), in Hülle skalieren
  const footed = (src, { height = null, length = null, scale = null } = {}) => {
    const inner = src; inner.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inner), size = box.getSize(new THREE.Vector3());
    const s = scale ?? (height ? height / size.y : length ? length / Math.max(size.x, size.z) : 1);
    const wrap = new THREE.Group(); const mid = new THREE.Group(); mid.add(inner);
    inner.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    mid.scale.setScalar(s); wrap.add(mid); wrap.userData.size = size.clone().multiplyScalar(s); return wrap;
  };
  // alles früh anstoßen, parallel
  const FA = MS + '12 - June 2026 - Farmers/gltf/', CV = MS + '8 - February 2025 - Caveman/assets/gltf/';
  [...['building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H', 'streetlight', 'bench', 'car_sedan', 'car_taxi', 'car_hatchback', 'car_police', 'car_stationwagon'].map(n => KIT + n + '.gltf'),
   FA + 'dirt_plot.gltf', FA + 'carrot.gltf', FA + 'lettuce.gltf', FA + 'wheelbarrow.gltf', CV + 'Campfire_Base.gltf', CV + 'Campfire_Logs.gltf',
   ...['Medium', 'Large'].flatMap(r => ['General', 'MovementBasic'].map(k => ANIM + 'Rig_' + r + '/Rig_' + r + '_' + k + '.glb'))].forEach(p => loadG(p).catch(() => {}));
  const prop = async (file, opt = {}) => { const g = await loadG(file); const sc = g.scene.clone(true); clayify(sc, opt); return footed(sc, opt); };

  const labels = [];   // { title, sub, dir, lift }
  const lab = (title, sub, dir, lift = 1.8, ri = null) => labels.push({ title, sub, dir: dir.clone(), lift, ri });

  // Plinthe: flacher Knetfladen unter Häusern, damit nichts auf der Wölbung schwebt
  const plinthMat = clay(C.line, 'world', { scale: 0.7 });
  const plinth = (w, d, seed) => { const g = new THREE.SphereGeometry(1, 28, 14); g.scale(w * 0.62, 0.22, d * 0.62); seedGeometry(THREE, g, seed); const m = new THREE.Mesh(g, plinthMat); m.castShadow = m.receiveShadow = true; return m; };

  onNote('Stirnstadt wird gebaut …');
  const BUILD = ['building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H'];
  const town = async (id, seed, n = 6) => {
    const a = anc(id).dir; const spots = scatter(a, n, 1.2, 4.2, 2.3, seed);
    await Promise.all(spots.map(async (_, k) => {
      try {
        const b = await prop(KIT + BUILD[(seed + k * 3) % BUILD.length] + '.gltf', { height: 1.9 + hash(seed + k) * 1.4, seed: seed * 10 + k });
        const g = new THREE.Group(); g.add(b); const sz = b.userData.size; const pl = plinth(sz.x + 0.22, sz.z + 0.22, seed + k); g.add(pl);
        b.position.y = 0.06;
        put(g, spots[k], { lift: -0.12, yaw: hash(seed * 3 + k) * 6.28, blend: 0.35, face: surf(a) });
      } catch (e) { info.errors.push(BUILD[k] + ': ' + e.message); }
    }));
    const lamps = scatter(a, 3, 0.6, 3.5, 1.2, seed + 99);
    await Promise.all(lamps.map(async d => { try { put(await prop(KIT + 'streetlight.gltf', { height: 1.1 }), d, { lift: -0.05, blend: 0.2 }); } catch (e) {} }));
    return a;
  };
  const [tR, tL, tM] = await Promise.all([town(1, 11), town(2, 23), town(3, 37, 4)]);
  lab('Stirnstadt', 'Gyrus frontalis superior · rechts', tR);
  lab('Stirnstadt Ost', 'Gyrus frontalis superior · links', tL);
  lab('Planungsamt', 'Gyrus frontalis medius · rechts', tM, 1.6);

  // Motorik-Ring: Starttor über der Straße auf dem Gyrus praecentralis
  {
    const i = nearestRoadIndex(anc(6).dir); const q = roadAt(sOfIndex(i));
    const gate = new THREE.Group(); const gm = clay(C.roof, 'soft', { scale: 0.5 }), bm = clay(C.accent, 'soft', { scale: 0.5 });
    [-1, 1].forEach(sd => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 1.5, 4, 12), gm); c.position.set(sd * (HW + 0.2), 0.85, 0); c.castShadow = true; gate.add(c); });
    const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 2 * (HW + 0.2), 4, 14), bm); bar.rotation.z = Math.PI / 2; bar.position.y = 1.65; bar.castShadow = true; gate.add(bar);
    gate.traverse(o => { if (o.isMesh) seedGeometry(THREE, o.geometry, 70 + o.id); });
    orient(gate, q.P, q.up, q.fwd); scene.add(gate);
    placed.push({ go: () => { const q2 = roadAt(sOfIndex(i)); orient(gate, q2.P, q2.up, q2.fwd); } });
    lab('Motorik-Ring · Start', 'Gyrus praecentralis · rechts', rs[i], 2.2);
  }

  // Sternwarte der Sehrinde: Turm mit Auge am Okzipitalpol
  {
    const d = anc(16).dir; const tw = new THREE.Group();
    const wm = clay(C.wall, 'world', { scale: 0.6 }), rm = clay(C.roof, 'soft', { scale: 0.5 }), em = clay(C.white, 'knetbar', { scale: 0.4 }), im = clay('#57a59b', 'knetbar', { scale: 0.4 }), pm = clay(C.ink, 'knetbar', { scale: 0.4 });
    const add = (g, m, y, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(0, y, z); o.castShadow = o.receiveShadow = true; tw.add(o); seedGeometry(THREE, g, 80 + tw.children.length); return o; };
    add(new THREE.CylinderGeometry(0.42, 0.62, 2.4, 28, 6), wm, 1.2);
    add(new THREE.TorusGeometry(0.5, 0.1, 10, 28), rm, 2.4).rotation.x = Math.PI / 2;
    add(new THREE.SphereGeometry(0.62, 32, 20), em, 3.0);
    add(new THREE.SphereGeometry(0.3, 24, 14), im, 3.08, 0.42);
    add(new THREE.SphereGeometry(0.14, 16, 10), pm, 3.12, 0.63);
    const p0 = plinth(1.8, 1.8, 88); tw.add(p0);
    put(tw, d, { lift: -0.1, yaw: 0.4, blend: 0.3 });
    lab('Sternwarte', 'Lobus occipitalis · Sehrinde', d, 4.1);
  }

  // Bäume aus ineinandergesteckten Kugeln
  const crownMat = clay('#ffffff', 'soft', { vc: true, scale: 0.6 }), trunkMat = clay(C.trunk, 'world', { scale: 0.5 });
  const forest = (dirs, seed, big = 1) => {
    const crowns = [], trunks = []; const cA = new THREE.Color(C.leaf), cB = new THREE.Color(C.lime);
    dirs.forEach((d, k) => {
      const n = d.clone().lerp(nrmAt(d), 0.25).normalize(), p = surf(d).addScaledVector(n, -0.05);
      const m = new THREE.Matrix4().makeBasis(tangentOf(n, 0).cross(n).negate(), n, tangentOf(n, 0)).setPosition(p);
      const h = (0.32 + hash(seed + k) * 0.25) * big;
      const tr = new THREE.CylinderGeometry(0.05 * big, 0.08 * big, h, 8); tr.translate(0, h / 2, 0); tr.applyMatrix4(m); trunks.push(tr);
      const nball = 3 + Math.floor(hash(seed + k * 7) * 3); const tint = cA.clone().lerp(cB, hash(seed + k * 5) * 0.55);
      for (let b = 0; b < nball; b++) {
        const r = (0.15 + hash(seed + k * 11 + b) * 0.13) * big;
        const g = new THREE.IcosahedronGeometry(r, 2);
        const a = hash(seed + k + b * 13) * 6.28, off = b ? 0.15 * big : 0;
        g.translate(Math.cos(a) * off, h + r * 0.6 + (b ? hash(k + b) * 0.25 * big : 0.1), Math.sin(a) * off);
        g.applyMatrix4(m);
        const c = new Float32Array(g.attributes.position.count * 3); const tt = tint.clone().offsetHSL(0, 0, (b - 1) * 0.03);
        for (let q = 0; q < c.length; q += 3) { c[q] = tt.r; c[q + 1] = tt.g; c[q + 2] = tt.b; }
        g.setAttribute('color', new THREE.BufferAttribute(c, 3)); crowns.push(g);
      }
    });
    if (!crowns.length) return;
    const cg = mergeGeometries(crowns.map(g => g.index ? g.toNonIndexed() : g)), tg = mergeGeometries(trunks.map(g => g.index ? g.toNonIndexed() : g));
    seedGeometry(THREE, cg, seed); seedGeometry(THREE, tg, seed + 1);
    const cm = new THREE.Mesh(cg, crownMat), tm = new THREE.Mesh(tg, trunkMat); cm.castShadow = cm.receiveShadow = tm.castShadow = true;
    scene.add(cm, tm); forests.push(cm, tm);
  };
  const forests = [];
  const plantAll = () => {
    forests.forEach(m => { scene.remove(m); m.geometry.dispose(); }); forests.length = 0;
    const cer = scatter(anc(40).dir, 130, 0, 9, 0.55, 501, d => RID[nearestW(d.x, d.y, d.z)] === 40);
    forest(cer, 501, 1.1);
    [22, 23, 24, 25, 12, 13].forEach((id, k) => forest(scatter(anc(id).dir, 9, 0.3, 4, 0.9, 600 + k * 31), 600 + k * 31, 0.9));
  };
  plantAll();
  lab('Lebensbaum-Wald', 'Cerebellum · Arbor vitae', anc(40).dir, 2.4);

  // Felder am Scheitel (Farmers-Pack)
  const fieldD = anc(15).dir;
  try {
    const plots = scatter(fieldD, 5, 0.8, 3, 1.3, 71);
    for (let k = 0; k < plots.length; k++) {
      put(await prop(FA + 'dirt_plot.gltf', { scale: KS * 1.2, seed: 700 + k }), plots[k], { lift: -0.03, yaw: k * 1.3, blend: 0.6 });
      put(await prop(FA + (k % 2 ? 'carrot.gltf' : 'lettuce.gltf'), { scale: KS * 1.2, seed: 720 + k }), plots[k], { lift: 0.05, yaw: k, blend: 0.6 });
    }
    const wb = scatter(fieldD, 1, 1.5, 3.5, 1, 77); if (wb[0]) put(await prop(FA + 'wheelbarrow.gltf', { scale: KS * 1.2 }), wb[0], { lift: -0.02, yaw: 2, blend: 0.6 });
  } catch (e) { info.errors.push('farm: ' + e.message); }
  lab('Scheitelfelder', 'Lobulus parietalis superior · links', fieldD, 1.6);

  // Stammhirn-Lager (Caveman-Pack)
  const campD = anc(41).dir;
  try { put(await prop(CV + 'Campfire_Base.gltf', { scale: KS }), campD, { lift: -0.02, blend: 0.5 }); put(await prop(CV + 'Campfire_Logs.gltf', { scale: KS }), campD, { lift: 0, blend: 0.5 }); }
  catch (e) { info.errors.push('camp: ' + e.message); }
  lab('Brückenlager', 'Pons · die Brücke', campD, 2.2);

  // Gedächtnisarchiv
  const archD = anc(29).dir;
  try { put(await prop(KIT + 'building_C.gltf', { height: 1.6 }), around(archD, 0.05, 1), { lift: -0.1, yaw: 1.2, blend: 0.4 }); put(await prop(KIT + 'bench.gltf', { height: 0.3 }), around(archD, 0.035, 3), { lift: 0, blend: 0.5 }); }
  catch (e) { info.errors.push('archiv: ' + e.message); }
  lab('Gedächtnisarchiv', 'Gyrus parahippocampalis · links', archD, 2.2);

  // Balkenbrücke: höchste Brücke über der Längsschlucht (nur Scheitelseite)
  let bridgeI = 0; { let best = -1; for (let i = 0; i < RS; i++) { const g = road.rr[i] - road.rt[i]; if (rs[i].y > 0.3 && Math.abs(rs[i].x) < 0.08 && g > best) { best = g; bridgeI = i; } } }
  lab('Balkenbrücke', 'über der Fissura longitudinalis', rs[bridgeI], 1.0, bridgeI);
  // Zentralfurche: Brücke zwischen den Ankern von Gyrus prae- und postcentralis
  { const a = nearestRoadIndex(anc(6).dir), b = nearestRoadIndex(anc(8).dir); let best = -1, bi = a;
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) { const g = road.rr[i] - road.rt[i]; if (g > best) { best = g; bi = i; } }
    lab('Zentralfurche', 'Sulcus centralis', rs[bi], 0.9, bi); }
  const insD = anc(35).dir; lab('Insel', 'Insula · links, frei ohne Operculum frontale', insD, 1.6);
  lab('Hörbühne', 'Gyrus temporalis superior · Wernicke-Areal', anc(21).dir, 1.8);
  lab('Mandelkern', 'Temporalpol · Amygdala darunter', anc(18).dir, 2.8);

  // ---------- Figuren (Resident Atlas) ----------
  onNote('Bewohner ziehen ein …');
  const rigClips = {};
  const clipsFor = async rig => {
    if (rigClips[rig]) return rigClips[rig];
    const [gen, mov] = await Promise.all([loadG(ANIM + 'Rig_' + rig + '/Rig_' + rig + '_General.glb'), loadG(ANIM + 'Rig_' + rig + '/Rig_' + rig + '_MovementBasic.glb')]);
    const clean = c => new THREE.AnimationClip(c.name, c.duration, c.tracks.filter(t => { const [node, prop] = [t.name.slice(0, t.name.lastIndexOf('.')), t.name.slice(t.name.lastIndexOf('.') + 1)]; return prop !== 'scale' && (prop !== 'position' || /^(root|hips|pelvis)$/i.test(node)); }));
    const all = [...gen.animations, ...mov.animations].map(clean); const by = n => all.find(c => c.name === n);
    return (rigClips[rig] = { idle: by('Idle_A') || all[0], idle2: by('Idle_B'), walk: by('Walking_A'), all });
  };
  const mixers = [], walkers = [];
  const CAST = [
    { n: 'Black Knight', p: MS + '3 - September 2024 - Black Knight/characters/BlackKnight.glb', rig: 'Large', at: 'bridge' },
    { n: 'Demon Lord', p: MS + 'DemonLord/characters/DemonLord.glb', rig: 'Large', at: 18 },
    { n: 'Monstrosity', p: MS + '4 - October 2025 - Monstrosity/Monstrosity.glb', rig: 'Large', at: 40 },
    { n: 'Orc Brute', p: MS + '2 - August 2025 - Orc Brute/OrcBrute.glb', rig: 'Large', at: 41, off: [0.07, 2] },
    { n: 'Caveman', p: MS + '8 - February 2025 - Caveman/characters/Caveman.glb', rig: 'Medium', at: 41, off: [0.045, 4.4] },
    { n: 'Farmer A', p: MS + '12 - June 2026 - Farmers/Farmer_A.glb', rig: 'Medium', at: 15, off: [0.04, 1] },
    { n: 'Farmer B', p: MS + '12 - June 2026 - Farmers/Farmer_B.glb', rig: 'Medium', at: 15, off: [0.06, 3.6] },
    { n: 'Lorekeeper', p: MS + '1 - July 2025 - Lorekeeper/Lorekeeper.glb', rig: 'Medium', at: 29, off: [0.02, 5] },
    { n: 'Witch', p: MS + '5 - November 2024 - Witch/characters/Witch.glb', rig: 'Medium', at: 35 },
    { n: 'Goth Girl', p: MS + 'GothGirl/characters/GothGirl.glb', rig: 'Medium', at: 21 },
    { n: 'Clown', p: MS + '11 - May 2024 - Clown/characters/Clown.glb', rig: 'Medium', at: 10 },
    { n: 'Ultra Turbo Hero Man', p: MS + 'UltraTurboHeroMan/characters/UltraTurboHeroMan.glb', rig: 'Medium', walk: 0.12 },
    { n: 'Toy Soldier', p: MS + '6 - December 2025 - Toy Soldier/ToySoldier.glb', rig: 'Medium', walk: 0.47 },
    { n: 'Cleric', p: MS + '3 - September 2025 - Cleric/Cleric.glb', rig: 'Medium', walk: 0.78 }
  ];
  const guardI = (() => { for (let k = 1; k < 60; k++) { const i = (bridgeI + k) % RS; if (road.rr[i] - road.rt[i] < 0.6) return i; } return bridgeI; })();
  await Promise.all(CAST.map(async (c, k) => {
    try {
      const [g, clips] = await Promise.all([loadG(c.p), clipsFor(c.rig)]);
      const sc = g.scene; clayify(sc, { role: 'soft', soften: false, seed: 900 + k * 17 });
      sc.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
      const w = footed(sc, { scale: KS });
      const mixer = new THREE.AnimationMixer(sc); mixers.push(mixer);
      if (c.walk != null) {
        const a = mixer.clipAction(clips.walk || clips.idle); a.play(); a.time = hash(k) * 2;
        scene.add(w); walkers.push({ obj: w, s: c.walk * road.len, v: 0.55, act: a });
      } else {
        const a = mixer.clipAction((k % 3 === 2 && clips.idle2) ? clips.idle2 : clips.idle); a.play(); a.time = hash(k * 3) * 3;
        let d;
        if (c.at === 'bridge') { const q = roadAt(sOfIndex(guardI)); d = q.P.clone().addScaledVector(q.side, -(HW + 0.45)).normalize(); }
        else { const base = anc(c.at).dir; d = c.off ? around(base, c.off[0], c.off[1]) : base; }
        put(w, d, { lift: -0.02, yaw: hash(k * 7) * 6.28, blend: 0.25 });
      }
      info.chars++;
    } catch (e) { info.errors.push(c.n + ': ' + e.message); }
  }));

  // ---------- Autos ----------
  onNote('Verkehr rollt an …');
  const CARS = ['car_sedan', 'car_taxi', 'car_hatchback', 'car_police', 'car_stationwagon', 'car_sedan', 'car_taxi', 'car_hatchback'];
  const cars = [];
  await Promise.all(CARS.map(async (n, k) => {
    try {
      const g = await loadG(KIT + n + '.gltf'); const sc = g.scene.clone(true);
      clayify(sc, { soften: true, softOpt: { maxEdge: 0.03, iters: 4, lump: 0.002 }, seed: 1200 + k * 13 });
      const wheels = []; sc.traverse(o => { if (/wheel/i.test(o.name)) wheels.push(o); });
      const w = footed(sc, { length: 1.25 }); scene.add(w);
      cars.push({ obj: w, s: (k / CARS.length) * road.len, v: 2.4 + hash(k * 9) * 1.1, wheels, r: 0.09 });
      info.cars++;
    } catch (e) { info.errors.push(n + ': ' + e.message); }
  }));
  cars.sort((a, b) => a.s - b.s);

  // ---------- Wolken aus ineinandergesteckten Kugeln ----------
  const cloudMat = clay(C.cloud, 'soft', { scale: 0.75 });
  const clouds = new THREE.Group(); scene.add(clouds);
  for (let k = 0; k < 9; k++) {
    const g = new THREE.Group(); const n = 4 + Math.floor(hash(k * 5) * 4);
    for (let b = 0; b < n; b++) {
      const r = (0.9 + hash(k * 13 + b) * 1.0) * (b ? 0.8 : 1.2);
      const geo = new THREE.IcosahedronGeometry(r, 4); geo.scale(1, 0.8, 0.85); seedGeometry(THREE, geo, 300 + k * 10 + b);
      const m = new THREE.Mesh(geo, cloudMat); m.castShadow = true;
      m.position.set((b - n / 2) * 0.62 + hash(b + k) * 0.35, (hash(k + b * 3) - 0.35) * 0.6, (hash(k * b + 1) - 0.5) * 1.2); g.add(m);
    }
    const piv = new THREE.Group(); piv.add(g);
    const rad = 30 + hash(k * 17) * 7; g.position.set(0, 0, rad);
    g.lookAt(0, 0, 0);
    piv.rotation.set((hash(k * 3) - 0.5) * 2.2, hash(k * 7) * 6.28, 0);
    piv.userData.spin = (0.012 + hash(k * 11) * 0.02) * (k % 2 ? 1 : -1);
    clouds.add(piv);
  }

  // ---------- Beschriftung ----------
  const host = canvas.parentElement; const layer = document.createElement('div');
  Object.assign(layer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden', zIndex: 1 });
  host.appendChild(layer);
  labels.forEach(L => {
    const el = document.createElement('div');
    Object.assign(el.style, { position: 'absolute', left: '0', top: '0', transform: 'translate(-50%,-100%)', background: 'rgba(255,255,255,.94)', border: '1px solid #dfe3e8', borderRadius: '10px', padding: '5px 9px', boxShadow: '0 8px 22px rgba(19,25,35,.10)', whiteSpace: 'nowrap', fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif', lineHeight: '1.2', transition: 'opacity .18s' });
    el.innerHTML = '<div style="font-weight:800;font-size:12px;color:#17191d"></div><div style="font-size:10.5px;color:#6d737d"></div>';
    el.children[0].textContent = L.title; el.children[1].textContent = L.sub;
    layer.appendChild(el); L.el = el;
  });
  const updLabels = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; const cp = camera.position; const taken = [];
    const order = labels.map(L => [L, cp.distanceTo(surf(L.dir))]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    for (const L of order) {
      const p = (L.ri != null ? road.P[L.ri].clone() : surf(L.dir)).addScaledVector(L.dir, L.lift);
      const facing = L.dir.dot(cp.clone().sub(p).normalize());
      const v = p.clone().project(camera);
      let vis = state.labels && facing > 0.08 && v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 && cp.distanceTo(p) < 120;
      const sx = (v.x + 1) / 2 * w, sy = (1 - v.y) / 2 * h, lw = (L.w || (L.w = L.el.offsetWidth || 150)), lh = 38;
      if (vis && taken.some(r => Math.abs(r[0] - sx) < (r[2] + lw) / 2 + 4 && Math.abs(r[1] - sy) < lh + 2)) vis = false;
      if (vis) taken.push([sx, sy, lw]);
      L.el.style.opacity = vis ? String(Math.min(1, (facing - 0.08) * 5)) : '0';
      if (vis) L.el.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px,${((1 - v.y) / 2 * h).toFixed(1)}px) translate(-50%,-100%)`;
    }
  };

  // ---------- Nachbearbeitung ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try {
    const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js');
    aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1.4, thickness: 1.4, scale: 1.0, samples: 16 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.85; composer.addPass(aoPass);
  } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());

  const apply = () => {
    const Mo = MOODS[state.mood];
    const el = THREE.MathUtils.degToRad(Mo.el), az = THREE.MathUtils.degToRad(Mo.az);
    sun.position.set(Math.sin(az) * Math.cos(el) * 80, Math.sin(el) * 80, Math.cos(az) * Math.cos(el) * 80); sun.target.position.set(0, 0, 0);
    fill.position.copy(sun.position).multiplyScalar(-1); fill.intensity = Mo.sunI * 0.22;
    sun.color.set(Mo.sun); sun.intensity = Mo.sunI; hemi.color.set(Mo.hemiS); hemi.groundColor.set(Mo.hemiG); hemi.intensity = Mo.hemiI;
    scene.background = new THREE.Color(Mo.sky);
    U.uClayOn.value = state.relief ? 1 : 0;
    if (aoPass) aoPass.enabled = state.ao;
    let tris = 0; scene.traverse(o => { if (o.isMesh && o.visible) { const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } }); info.tris = Math.round(tris);
  };
  apply();

  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  // ---------- Kamera ----------
  const ORTE = [
    { n: 'Totale', cam: [-58, 34, 70], t: [0, 0, 0] },
    ...labels.map(L => ({ n: L.title, dir: L.dir }))
  ];
  let fly = null;
  const flyTo = k => {
    const o = ORTE[k]; if (!o) return;
    state.cam = 'totale'; controls.enabled = true; camera.up.set(0, 1, 0);
    let p, t;
    if (o.dir) { const s = surf(o.dir); t = s.clone().addScaledVector(o.dir, 0.8); const side = tangentOf(o.dir, 0.9); p = s.clone().addScaledVector(o.dir, 15).addScaledVector(side, 6); }
    else { p = new THREE.Vector3(...o.cam); t = new THREE.Vector3(...o.t); }
    if (!Number.isFinite(p.x + t.x)) return;
    const p0 = Number.isFinite(camera.position.x) ? camera.position.clone() : new THREE.Vector3(-58, 34, 70);
    fly = { p0, t0: Number.isFinite(controls.target.x) ? controls.target.clone() : new THREE.Vector3(), p, t, k: 0 };
  };
  const chase = { pos: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), look: new THREE.Vector3(), init: false };

  let last = performance.now(), acc = 0, frames = 0, alive = true;
  const tmpQ = new THREE.Quaternion();
  const loop = () => {
    if (!alive) return; requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    acc += dt; frames++; if (acc > 1) { info.fps = Math.round(frames / acc); acc = 0; frames = 0; }
    const sp = state.speed;
    mixers.forEach(m => m.update(dt * sp));
    if (state.traffic) {
      for (const c of cars) {
        c.s += c.v * dt * sp; const q = roadAt(c.s);
        orient(c.obj, q.P.clone().addScaledVector(q.side, HW * 0.38).addScaledVector(q.up, 0.035), q.up, q.fwd);
        c.wheels.forEach(w => w.rotation.x += c.v * dt * sp / c.r * 0.35);
      }
      for (const w of walkers) {
        w.s -= w.v * dt * sp; const q = roadAt(w.s);
        orient(w.obj, q.P.clone().addScaledVector(q.side, -HW * 0.45).addScaledVector(q.up, 0.035), q.up, q.fwd.clone().negate());
      }
    }
    clouds.children.forEach(p => p.rotation.y += p.userData.spin * dt * sp);
    if (state.cam === 'fahrt' && cars[0]) {
      const c = cars[0], q = roadAt(c.s);
      const want = q.P.clone().addScaledVector(q.up, 1.5).addScaledVector(q.fwd, -3.6), look = q.P.clone().addScaledVector(q.fwd, 2.4).addScaledVector(q.up, 0.4);
      const k = chase.init ? 1 - Math.exp(-dt * 5) : 1; chase.init = true;
      chase.pos.lerp(want, k); chase.look.lerp(look, k); chase.up.lerp(q.up, k).normalize();
      camera.position.copy(chase.pos); camera.up.copy(chase.up); camera.lookAt(chase.look);
    } else {
      if (fly) { fly.k = Math.min(1, fly.k + dt / 1.6); const e = fly.k * fly.k * (3 - 2 * fly.k); camera.position.lerpVectors(fly.p0, fly.p, e); controls.target.lerpVectors(fly.t0, fly.t, e); if (fly.k >= 1) fly = null; }
      controls.autoRotate = state.cam === 'rundflug'; controls.autoRotateSpeed = 0.6;
      controls.update();
    }
    updLabels();
    composer.render();
  };
  loop();
  onNote('');

  const replaceAll = () => { placed.forEach(r => r.go && r.go()); };
  return {
    info, ORTE: ORTE.map(o => o.n),
    get state() { return { ...state }; },
    flyTo,
    set(k, v) {
      if (k === 'cam') { state.cam = v; if (v === 'fahrt') { controls.enabled = false; chase.init = false; } else { controls.enabled = true; camera.up.set(0, 1, 0); if (v === 'totale') flyTo(0); } return; }
      if (k === 'knet') { state.knet = v; info.knet = v; RK = smooth(RAW0, v); applyTerrain(); paintTerrain(); buildRoad(); replaceAll(); plantAll(); apply(); return; }
      if (k === 'water') { state.water = v; applyWater(); return; }
      if (k === 'palette') { state.palette = v; paintTerrain(); return; }
      if (k in state) { state[k] = v; apply(); return; }
      if (k === 'stroke') U.uClayStroke.value = v; else if (k === 'grain') U.uClayGrain.value = v; else if (k === 'print') U.uClayPrintK.value = v;
      else if (k === 'facet') U.uClayFacet.value = v; else if (k === 'oil') U.uClayOil.value = v;
    },
    dispose() { alive = false; ro.disconnect(); layer.remove(); renderer.dispose(); },
    THREE, scene, camera, renderer
  };
}
