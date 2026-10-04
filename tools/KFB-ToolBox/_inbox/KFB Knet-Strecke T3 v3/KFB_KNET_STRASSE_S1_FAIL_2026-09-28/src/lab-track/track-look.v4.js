/* KFB track-look v4 (28.09.) — T3 auf Material K2: clay-material.v10 + Werkzeugkarten clay-relief.v4 + Mischungen clay-toolmix.v1.
 *   Fahrbahn behält das Straßenprofil von T2 21:30 (legacy 1, keine Werkzeuge). Alle anderen Massen: Werkzeuge in Zonen,
 *   Facetten laufen aus, Kachelzellen folgen einem Richtungsfeld, keine v2-Querriefen und keine Macro-Maserung mehr.
 *   Geometrie, Welten, Kameras unverändert wie v3.
 * KFB track-look v3 (27.09.) — T3 · Knetstrang. Eigene Bühne nach lab-track/KONZEPT_S4_KNETSTRANG.md.
 * Richtung Georg 27.09.: bunt, lebendig, harmonisch-schräg; Rocko × SpongeBob × Wallace & Gromit × Mario Kart, Maßstab Claybound.
 * Prinzip: die Strecke ist EIN Strang aus Knete (Hohlkehle + Randwulst + Bauch, eine Farbe), darauf die Fahrbahn exakt aus dem Stream.
 *   · Fahrbahn road_L..road_R unverformt, Straßenprofil wie T2 21:30 (k = 3, »das einzig Gute«).
 *   · Bedeutung durch Form: Querrippen in der Hohlkehle innen in Kurven, Prallwulst außen in engen Kurven, Boost-Pfeile als Knetplatten.
 *   · Stützen: Elefantenfuß, Taille, Bauch, Kapitell-Kissen; hohe Stützen gestapelt und doppelt mit Brücke.
 *   · Welt: Knettisch, Hügel, schiefe Türme, Bäume mit krummem Stamm (Kugel-in-Kugel), Büsche, Fels, Wolken, Karts.
 * Nichts aus track-kit.v2 (Slots-je-Farbe) wird benutzt. Material clay-material.v8 unverändert. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v10.js?r=2';
import { makeToolReliefs } from '../lab-clay/clay-relief.v4.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js?r=2';

const here = f => new URL(f, import.meta.url).href;
const V = a => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

export const WORLDS = {
  canyon: {
    name: 'A · Claybound-Canyon', short: 'Claybound pur: oranger Strang auf violettem Tisch, schieferblaue Fahrbahn, orange Tafeltürme, grüne Kugelbäume, gelbe Boost-Pfeile.',
    sky: '#96bede', roadStreet: '#566680', roadTrack: '#3d4a60', strang: '#ef5a22', table: '#8b68c7', hill: ['#a582d9', '#7b5bb8'],
    tower: ['#ef5a22', '#e8743a'], leaf: ['#1f7a3e', '#2f8a45', '#cdc666'], trunk: '#8a5a3a', rock: '#e2d0bc', cloud: '#e2d0bc', pad: '#f2b632',
    kart: ['#f2b632', '#5983ac', '#e2d0bc']
  },
  bucht: {
    name: 'B · Bikini-Bucht', short: 'Unterwasser-Strand: korallenroter Strang auf Sand, Aqua-Dünen, violette Korallentürme, Tangbäume mit rosa Blüten, zitronengelbe Pfeile.',
    sky: '#8fd6ec', roadStreet: '#5f7f9a', roadTrack: '#3e5d7c', strang: '#f2708a', table: '#f0cf7e', hill: ['#5cc3bf', '#46adb2'],
    tower: ['#9a6fd0', '#b08ae0'], leaf: ['#8fcf45', '#5fb84a', '#f7a1c4'], trunk: '#c9895a', rock: '#9a6fd0', cloud: '#fff4e2', pad: '#f7d23c',
    kart: ['#f7d23c', '#9a6fd0', '#fff4e2']
  },
  otown: {
    name: 'C · O-Town', short: 'Schräge Vorstadt: senfgelber Strang auf Petrol, magentafarbene Wackeltürme, orange Baumkronen auf lila Stämmen, Mintgrün als Himmel.',
    sky: '#a8d8b9', roadStreet: '#6a6e8f', roadTrack: '#4a4d6e', strang: '#e9b53b', table: '#3aa596', hill: ['#2f8f83', '#4cb5a5'],
    tower: ['#c9508f', '#e0679f'], leaf: ['#f08a2c', '#f5b041', '#c9508f'], trunk: '#6b4a8a', rock: '#e0679f', cloud: '#f3ead8', pad: '#fff06a',
    kart: ['#fff06a', '#6b4a8a', '#f08a2c']
  }
};

// Profil nach Handmaß: Maßstab und Spurgrößen × k, Überschreibungen wie T2 clayDetail (keine Krater, keine Risse auf Massen)
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };

// ---------- Fahrbahn: Knetflecken zwischen Straße (0) und Bahn (1) über eine stetige Größe ----------
const ROAD_V = `attribute float aW; attribute vec2 aSU; varying float vW; varying vec2 vSU;\n`;
const ROAD_F = /* glsl */`
uniform vec3 uRoadA, uRoadB; varying float vW; varying vec2 vSU;
vec2 kfbH2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float kfbPatchV(vec2 su, float cell){ vec2 x = su / cell, b = floor(x); float best = 9.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cc = b + vec2(float(i), float(j)); vec2 p = cc + 0.15 + 0.7 * kfbH2(cc);
    float h = kfbH2(cc + 3.0).x; vec2 dv = (x - p) * vec2(1.0, 1.3); best = min(best, h * 0.75 + 0.35 * length(dv)); }
  return best; }
`;
const ROAD_APPLY = /* glsl */`
{ float w = vW; vec3 c = w > 0.999 ? uRoadB : uRoadA; float rim = 0.0;
  if (w > 0.001 && w < 0.999) { float v = kfbPatchV(vSU, 1.7), th = w * 1.1; c = v < th ? uRoadB : uRoadA; rim = 1.0 - smoothstep(0.0, 0.035, abs(v - th)); }
  diffuseColor.rgb = c * (1.0 - 0.22 * rim); }
`;

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, tris: 0, errors: [], buildMs: 0, pillars: 0, pads: 0, clusters: 0, world: 'canyon', cam: 'uebersicht', centreErr: 0 };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.3, 5000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;

  onNote('Strecke wird geladen …');
  const td = await fetch(here('data/td03.stream.json')).then(r => r.json());
  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 31 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = 0.04;
  { const tr = await makeToolReliefs({ size: 1024, seed: 41, onStep: t => onNote('Werkzeug ' + t + ' …') });
    const mk = d => { const t = new THREE.DataTexture(d, tr.size, tr.size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tr.maps.map(mk); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; info.toolMs = tr.ms; }
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = tex; }
  const K = 3;   // Handmaß wie T2 21:30: Hand 1,5 m, Kachel 4,8 m, Abdruck 13,5 m
  U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;

  // ---------- Licht (warmweiß, How-to §3) ----------
  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.3; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05); scene.add(hemi);
  const back = new THREE.DirectionalLight('#ffe6d6', 0.6); scene.add(back);

  // ---------- Materialien je Masse ----------
  const M = {};
  const MIXKEY = { strang: 'strang', table: 'terrain', hill0: 'terrain', hill1: 'terrain', tower0: 'house', tower1: 'house', leaf0: 'nature', leaf1: 'nature', leaf2: 'nature', trunk: 'trunk', rock: 'rock', cloud: 'cloud' };
  const clay = (key, color, profile, extra = {}) => { const mk = MIXKEY[key], p = { ...profile, tools: mk ? TOOLMIX[mk] : null, legacy: mk ? 0 : 1 };
    return (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, side: extra.side ?? THREE.FrontSide }), profile: p, role: extra.role })); };
  const W0 = WORLDS.canyon;
  const RU = { uRoadA: { value: new THREE.Color(W0.roadStreet) }, uRoadB: { value: new THREE.Color(W0.roadTrack) } };
  {
    const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...prof('road', 0.5, K), legacy: 1 } });
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, RU);
      sh.vertexShader = ROAD_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vSU = aSU;');
      sh.fragmentShader = ROAD_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + ROAD_APPLY); };
    m.customProgramCacheKey = () => 'kfb-clay-v10-road4'; M.road = m;
  }
  clay('strang', W0.strang, prof('house', 0.6, K, QUIET));
  clay('pad', W0.pad, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });
  clay('table', W0.table, prof('terrainBg', 3.2, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }));
  W0.hill.forEach((c, i) => clay('hill' + i, c, prof('terrainFg', 1.1, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 })));
  W0.tower.forEach((c, i) => clay('tower' + i, c, prof('house', 0.6, K, QUIET)));
  W0.leaf.forEach((c, i) => clay('leaf' + i, c, prof('nature', 0.6, K, { print: 0.4, dent: 0 })));
  clay('trunk', W0.trunk, prof('nature', 0.6, K, { print: 0.4, dent: 0 }));
  clay('rock', W0.rock, prof('prop', 0.5, K, QUIET));
  clay('cloud', W0.cloud, prof('cloud', 0.75, K, { dent: 0 }));
  W0.kart.forEach((c, i) => clay('kart' + i, c, prof('vehicle', 0.5, 1, { dent: 0 })));
  clay('tyre', '#2e2c3a', prof('vehicle', 0.5, 1, { dent: 0 }));
  clay('eye', '#fbf6ec', prof('figure', 0.5, 1, { dent: 0 }), { role: 'knetbar' });
  clay('pupil', '#17151d', prof('figure', 0.5, 1, { dent: 0 }), { role: 'knetbar' });
  clay('skin', '#f2b48c', prof('figure', 0.5, 1, { dent: 0 }));

  const root = new THREE.Group(); scene.add(root);
  const addMesh = (g, mat, { cast = true, recv = true, name = '' } = {}) => { const o = new THREE.Mesh(g, mat); o.castShadow = cast; o.receiveShadow = recv; o.name = name; root.add(o); info.tris += (g.index ? g.index.count : g.attributes.position.count) / 3; return o; };
  const bake = parts => { // parts: [geom] → eine Geometrie (nicht indiziert, ohne uv)
    const gs = parts.map(g => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; });
    return mergeGeometries(gs, false);
  };

  const t0 = performance.now();
  const S = td.samples, N = S.length, ds = td.ds;
  const at = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
    const l = (u, w) => V(u).lerp(V(w), f); return { p: l(a.p, b.p), T: l(a.T, b.T).normalize(), U: l(a.U, b.U).normalize(), R: l(a.R, b.R).normalize(), i }; };
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  const jIdx = n => td.joints.find(j => j.piece === n)?.index ?? 0;

  // Krümmung (vorzeichenbehaftet: > 0 = Rechtskurve, innen = rechts), geglättet über ±8 m
  const kr = new Float32Array(N), ks = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = S[Math.max(0, i - 4)], b = S[Math.min(N - 1, i + 4)], q = S[i];
    const d = (b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]; kr[i] = d / Math.max(0.5, b.s - a.s); }
  for (let i = 0; i < N; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; }

  // ---------- Querschnitt des Strangs je Seite (seitenlokal: x nach außen, y hoch) ----------
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } };
  const RIB = 3.5;   // Rippenabstand (m), eine Rippe = zwei Handbreiten
  const sideProfile = (q, i, sd) => {
    const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), H = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    const inner = sstep(0.008, 0.022, ks[i] * sd), outer = sstep(0.014, 0.04, -ks[i] * sd);
    const wave = 0.06 * (vnoise(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (H + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer);
    const cx = Math.max(ib, e + 0.4) + 0.85 * r + 0.12 * outer, top = H + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]];
    const xa = cx - 0.94 * r, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t);
      y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * r + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * r + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * r, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts;
  };
  const ringOf = (q, i) => { const L = sideProfile(q, i, -1), R = sideProfile(q, i, 1);
    const pts = L.map(([x, y]) => W3(q, (q.prm.offset || 0) - x, y)); for (let n = R.length - 1; n >= 0; n--) pts.push(W3(q, (q.prm.offset || 0) + R[n][0], R[n][1])); return pts; };

  // Läufe mit Fahrfläche (surface 1); Luft bleibt frei
  const runs = []; { let a = -1; for (let i = 0; i <= N; i++) { const on = i < N && (S[i].prm.surface ?? 1) > 0; if (on && a < 0) a = i; if (!on && a >= 0) { if (i - a > 2) runs.push([a, i - 1]); a = -1; } } }

  // Skin-Feld der Fahrbahn: 0 Straße, 1 Bahn (mag fährt auf Bahn); Fugen als Flecken über 24 m
  const skinW = S.map(q => q.skin === 'street' ? 0 : 1), wS = new Float32Array(N);
  { const ev = []; for (let i = 1; i < N; i++) if (skinW[i] !== skinW[i - 1]) ev.push({ s: S[i].s, a: skinW[i - 1], b: skinW[i] });
    for (let i = 0; i < N; i++) { const s = S[i].s; let w = skinW[i];
      for (const e of ev) if (Math.abs(s - e.s) < 14) w = lerp(e.a, e.b, sstep(e.s - 10, e.s + 14, s));
      wS[i] = w; } }

  onNote('Strang wird gerollt …');
  const lips = [];
  { const sp = [], si = [], rp = [], rw = [], rsu = [], ri = []; let sBase = 0, rBase = 0;
    for (const [a, b] of runs) {
      let nr = 0;
      for (let i = a; i <= b; i++) { const q = S[i], ring = ringOf(q, i); nr = ring.length; ring.forEach(p => sp.push(...p));
        const L = q.slots[6], Rr = q.slots[7];
        for (let n = 0; n <= 6; n++) { const lat = lerp(L[0], Rr[0], n / 6), h = lerp(L[1], Rr[1], n / 6); rp.push(...W3(q, lat, h)); rw.push(wS[i]); rsu.push(q.s, lat); }
        if (i > a) { const A = sBase + (i - a - 1) * nr, B = sBase + (i - a) * nr; for (let k = 0; k < nr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1);
          const C = rBase + (i - a - 1) * 7, E = rBase + (i - a) * 7; for (let k = 0; k < 6; k++) ri.push(C + k, C + k + 1, E + k, C + k + 1, E + k + 1, E + k); } }
      // Kappen an den Laufenden (flach, der Stream verjüngt dort ohnehin)
      for (const [i, dir] of [[a, -1], [b, 1]]) { const base = sBase + (i - a) * nr, c = [0, 0, 0];
        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++) c[j] += sp[(base + k) * 3 + j] / nr;
        const ci = sp.length / 3; sp.push(...c); const T = S[i].T;
        for (let k = 0; k < nr - 1; k++) { const p0 = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)), p1 = V(sp.slice((base + k + 1) * 3, (base + k + 1) * 3 + 3));
          const nrm = p0.clone().sub(V(c)).cross(p1.clone().sub(V(c))); if (nrm.dot(V(T)) * dir > 0) si.push(ci, base + k, base + k + 1); else si.push(ci, base + k + 1, base + k); } }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of [a, b]) { const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);
        g.rotateZ(Math.PI / 2); g.applyMatrix4(new THREE.Matrix4().makeBasis(V(q.R), V(q.U), V(q.T).negate()));
        const c = W3(q, (q.slots[0][0] + q.slots[13][0]) / 2, -0.5); g.translate(c[0], c[1], c[2]); seedGeometry(THREE, g, 700 + i); lips.push(g); }
    }
    const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); gs.setIndex(si); gs.computeVertexNormals(); seedGeometry(THREE, gs, 11);
    addMesh(gs, M.strang, { name: 'strang' }); addMesh(bake(lips), M.strang, { name: 'lippen' });
    const gr = new THREE.BufferGeometry(); gr.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); gr.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1));
    gr.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); gr.setIndex(ri); gr.computeVertexNormals(); seedGeometry(THREE, gr, 5);
    addMesh(gr, M.road, { name: 'fahrbahn' });
    // Mittellinie gegen p (Prüfung Bedingung 1): Mitte der Fahrbahnreihe = p + R·offset
    let err = 0; for (let i = 0; i < N; i += 25) { const q = S[i], m = W3(q, (q.slots[6][0] + q.slots[7][0]) / 2, 0), c = W3(q, q.prm.offset || 0, 0); err = Math.max(err, Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2])); }
    info.centreErr = err;
  }

  // ---------- Boost-Pfeile (Magnet-Balken als Knetplatten, Spitze in Fahrtrichtung) ----------
  { const parts = [];
    for (const mk of td.markings.filter(m => m.at === 'bars')) {
      const sm = (mk.s0 + mk.s1) / 2, i = Math.round(sm / ds), q = S[clamp(i, 0, N - 1)], rw = q.slots[7][0] - q.slots[6][0];
      const w = mk.span * rw, th = 0.95, tip = Math.min(2.0, w * 0.22);
      const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(0, tip); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, -th); sh.lineTo(0, tip - th); sh.lineTo(-w / 2, -th); sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.16, bevelSegments: 3, curveSegments: 4 });
      const a = at(sm), m = new THREE.Matrix4().makeBasis(a.R, a.T, a.U); m.setPosition(a.p.clone().addScaledVector(a.U, 0.02).addScaledVector(a.R, q.prm.offset || 0));
      g.applyMatrix4(m); seedGeometry(THREE, g, 300 + parts.length); parts.push(g);
    }
    info.pads = parts.length; if (parts.length) addMesh(bake(parts), M.pad, { name: 'boost' });
  }

  // ---------- Tisch, Abstandsfeld ----------
  const box = new THREE.Box3(); S.forEach(q => box.expandByPoint(V(q.p)));
  const ctr = box.getCenter(new THREE.Vector3()), ext = box.getSize(new THREE.Vector3());
  const GY = -0.6;
  { const w = ext.x + 420, d = ext.z + 420, r = 90, sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -d / 2); sh.lineTo(w / 2 - r, -d / 2); sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r); sh.lineTo(w / 2, d / 2 - r);
    sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); sh.lineTo(-w / 2 + r, d / 2); sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); sh.lineTo(-w / 2, -d / 2 + r); sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 4, bevelSize: 8, bevelSegments: 6, curveSegments: 28 });
    g.rotateX(-Math.PI / 2); g.translate(ctr.x, GY - 10, ctr.z); seedGeometry(THREE, g, 77); addMesh(g, M.table, { cast: false, name: 'tisch' }); }
  const CELL = 8, grid = new Map();
  for (let i = 0; i < N; i += 4) { const q = S[i], k = Math.floor(q.p[0] / CELL) + ',' + Math.floor(q.p[2] / CELL); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(q.p); }
  const distXZ = (x, z, maxR = 80) => { const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), n = Math.ceil(maxR / CELL); let best = maxR;
    for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) { const L = grid.get((cx + a) + ',' + (cz + b)); if (!L) continue; for (const p of L) { const d = Math.hypot(p[0] - x, p[2] - z); if (d < best) best = d; } }
    return best; };
  const R = rng(20260927);
  const pick = arr => arr[Math.floor(R() * arr.length)];
  const TW = ext.x + 380, TD = ext.z + 380;
  const place = (minD, maxD, tries = 60) => { for (let n = 0; n < tries; n++) { const x = ctr.x + (R() - 0.5) * TW, z = ctr.z + (R() - 0.5) * TD, d = distXZ(x, z, maxD + 2); if (d >= minD && d <= maxD) return [x, z]; } return null; };

  // ---------- Stützen mit Cartoon-Anatomie ----------
  onNote('Stützen werden geknetet …');
  const pillarCands = [];
  { const parts = [];
    const lathe = (h, Rr, segs) => { // Elefantenfuß · je Glied Taille und Bauch · Kissen an den Fugen · Kapitell
      const P = [[0.001, 0], [1.62 * Rr, 0], [1.66 * Rr, 0.18 * Rr], [1.45 * Rr, 0.6 * Rr], [1.08 * Rr, 1.1 * Rr]];
      const y0 = 1.1 * Rr, y1 = h - 1.0 * Rr, L = (y1 - y0) / segs;
      for (let k = 0; k < segs; k++) { const a = y0 + k * L; P.push([0.86 * Rr, a + 0.28 * L], [1.06 * Rr, a + 0.7 * L]);
        if (k < segs - 1) P.push([0.98 * Rr, a + 0.92 * L], [1.26 * Rr, a + L], [0.98 * Rr, a + L + 0.08 * L]); }
      P.push([0.98 * Rr, y1], [1.42 * Rr, h - 0.45 * Rr], [1.36 * Rr, h - 0.08 * Rr], [0.001, h]);
      const cv = new THREE.CatmullRomCurve3(P.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal');
      const pts = cv.getPoints(Math.max(40, segs * 22)).map(v => new THREE.Vector2(Math.max(0.001, v.x), v.y));
      return new THREE.LatheGeometry(pts, 30);
    };
    let s = 8; const Lend = S[N - 1].s;
    while (s < Lend - 4) {
      const i = Math.round(s / ds), q = S[i]; const step = Math.abs(ks[i]) > 0.02 ? 11 : 16; s += step;
      if ((q.prm.surface ?? 1) < 1 || q.U[1] < 0.93 || q.tags.includes('LOOP')) continue;
      const bot = W3(q, q.prm.offset || 0, q.slots[0][1] - 0.02), top = bot[1] + 0.3, h = top - GY;
      if (h < 3) continue;
      let below = false; for (let j = 0; j < N; j += 2) { const p = S[j].p; if (Math.abs(S[j].s - q.s) > 25 && p[1] < bot[1] - 1 && Math.hypot(p[0] - bot[0], p[2] - bot[2]) < 12) { below = true; break; } }
      if (below) continue;
      const rw = q.slots[7][0] - q.slots[6][0], dbl = h > 14;
      const d = clamp(h / 3, 2.4, dbl ? 4.2 : 4.6), Rr = d / 2, segs = Math.max(1, Math.round(h / (3.6 * d)));
      const legs = dbl ? [-Math.min(rw * 0.28, 4.6), Math.min(rw * 0.28, 4.6)] : [0];
      const tilt = (R() - 0.5) * 2 * 0.05, yaw = R() * Math.PI;
      for (const lat of legs) { const g = lathe(h, Rr, segs); g.rotateY(yaw); g.rotateZ(tilt * (lat >= 0 ? 1 : -1));
        const p = W3(q, (q.prm.offset || 0) + lat, 0); g.translate(p[0], GY - 0.15, p[2]); seedGeometry(THREE, g, 500 + parts.length); parts.push(g); }
      if (dbl) { const L = 1.1 * Rr, span = legs[1] - legs[0], hs = [];
        for (let k = 1; k < segs; k++) hs.push(GY + 1.1 * Rr + k * (h - 2.1 * Rr) / segs); if (!hs.length) hs.push(GY + h * 0.55);
        for (const y of hs) { const g = new THREE.CapsuleGeometry(0.5 * L, span, 8, 18); g.rotateZ(Math.PI / 2);
          const R3 = V(q.R), c = W3(q, q.prm.offset || 0, 0); g.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.atan2(-R3.z, R3.x))); g.translate(c[0], y, c[2]);
          seedGeometry(THREE, g, 900 + parts.length); parts.push(g); } }
      info.pillars++;
      if (!info.pillarShot && h > 8 && h < 20) { const p = V(W3(q, 0, 0)), Rv = V(q.R); pillarCands.push({ p, R: Rv, h }); }
    }
    if (parts.length) addMesh(bake(parts), M.strang, { name: 'stuetzen' });
  }

  // ---------- Welt ----------
  onNote('Welt wird aufgestellt …');
  const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g); };
  const blob = (r, detail = 3, lumpK = 0.12, seed = 1) => { let g = new THREE.IcosahedronGeometry(r, detail + 2); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g); const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = v.clone().normalize(); const f = 1 + lumpK * (Math.sin(n.x * 3.1 + seed) * Math.sin(n.y * 2.7 + seed * 1.7) * Math.sin(n.z * 3.3 + seed * 0.3)); v.copy(n.multiplyScalar(r * f)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g; };
  // Hügel: gedrückte, schief geschobene Knetbuckel am Rand
  for (let n = 0; n < 22; n++) { const rx = 22 + R() * 34, ry = 9 + R() * 20, rz = rx * (0.6 + R() * 0.5), at2 = place(rx * 1.05 + 16, 400); if (!at2) continue;
    const g = new THREE.SphereGeometry(1, 56, 36), p = g.attributes.position, lean = (R() - 0.5) * 0.6;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, x * rx + lean * rx * y * y, y * ry, z * rz); }
    g.computeVertexNormals(); g.rotateY(R() * Math.PI); g.translate(at2[0], GY - ry * 0.32, at2[1]); put('hill' + (n % 2), g, 40 + n); }
  // Schiefe Türme (Claybound-Tafelberg × O-Town): gestapelte Kissenblöcke, jeder verdreht und versetzt
  for (let n = 0; n < 12; n++) { const base = 13 + R() * 14, at2 = place(base * 1.1 + 22, 330); if (!at2) continue; let y = GY - 1, w = base, dx = 0, dz = 0; const lv = 3 + Math.floor(R() * 3), key = 'tower' + (n % 2);
    for (let k = 0; k < lv; k++) { const hgt = w * (0.7 + R() * 0.5), g = new RoundedBoxGeometry(w, hgt, w * (0.8 + R() * 0.3), 5, Math.min(w, hgt) * 0.22);
      g.rotateY(R() * Math.PI); g.rotateZ((R() - 0.5) * 0.18); g.rotateX((R() - 0.5) * 0.14); g.translate(at2[0] + dx, y + hgt / 2, at2[1] + dz); put(k % 2 ? 'tower' + ((n + 1) % 2) : key, g, 60 + n * 5 + k);
      y += hgt * 0.94; dx += (R() - 0.5) * w * 0.3; dz += (R() - 0.5) * w * 0.3; w *= 0.62 + R() * 0.18; }
    if (R() < 0.6) { const g = blob(w * 0.55, 3, 0.1, n); g.scale(1, 0.8, 1); g.translate(at2[0] + dx, y + w * 0.3, at2[1] + dz); put(pick(['leaf0', 'leaf1', 'leaf2']), g, 90 + n); } }
  // Rule of Three: Baum (Anker) · zwei Büsche (Stütze) · Fels (Akzent). Stamm krumm, Krone Kugel-in-Kugel.
  const tree = (x, z, sc, seed) => { const h = (11 + R() * 9) * sc, bend = (R() - 0.5) * 0.5 * h, bend2 = (R() - 0.5) * 0.35 * h, ang = R() * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang);
    const pts = [[0, 0], [bend * 0.15, h * 0.3], [bend, h * 0.62], [bend + bend2, h]].map(([u, y]) => new THREE.Vector3(x + u * c, GY - 0.3 + y, z + u * s));
    const cv = new THREE.CatmullRomCurve3(pts), rT = (0.75 + R() * 0.4) * sc;
    const g = new THREE.TubeGeometry(cv, 24, rT, 12, false); put('trunk', g, seed);
    const foot = blob(rT * 1.9, 2, 0.08, seed); foot.scale(1, 0.45, 1); foot.translate(x, GY - 0.1, z); put('trunk', foot, seed + 1);
    const tp = pts[3], cr = (4.2 + R() * 2.6) * sc, key = pick(['leaf0', 'leaf0', 'leaf1', 'leaf2']);
    const main = blob(cr, 3, 0.1, seed); main.scale(1, 0.9, 1); main.translate(tp.x, tp.y + cr * 0.55, tp.z); put(key, main, seed + 2);
    const nb = 2 + Math.floor(R() * 3); for (let k = 0; k < nb; k++) { const a = R() * Math.PI * 2, rr = cr * (0.45 + R() * 0.25), g2 = blob(rr, 3, 0.1, seed + k);
      g2.translate(tp.x + Math.cos(a) * cr * 0.75, tp.y + cr * (0.3 + R() * 0.7), tp.z + Math.sin(a) * cr * 0.75); put(R() < 0.25 ? pick(['leaf0', 'leaf1', 'leaf2']) : key, g2, seed + 3 + k); } };
  const bush = (x, z, sc, seed) => { const key = pick(['leaf0', 'leaf1', 'leaf2']), n = 2 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) { const r = (2.0 + R() * 1.4) * sc, g = blob(r, 3, 0.12, seed + k); g.scale(1, 0.78, 1); g.translate(x + (R() - 0.5) * r * 1.6, GY + r * 0.35, z + (R() - 0.5) * r * 1.6); put(key, g, seed + k); } };
  const rock = (x, z, sc, seed) => { const r = (2.2 + R() * 2.0) * sc, g = blob(r, 3, 0.25, seed); g.scale(1, 0.62, 1.1); g.rotateY(R() * 3); g.translate(x, GY + r * 0.2, z); put('rock', g, seed); };
  for (let n = 0; n < 52; n++) { const a = place(20, 95); if (!a) continue; const sc = 0.85 + R() * 0.5, ang = R() * Math.PI * 2;
    tree(a[0], a[1], sc, 1000 + n * 20);
    for (let k = 0; k < 2; k++) { const bx = a[0] + Math.cos(ang + k * 1.4) * (6 + R() * 3), bz = a[1] + Math.sin(ang + k * 1.4) * (6 + R() * 3); if (distXZ(bx, bz, 18) >= 15) bush(bx, bz, sc, 1000 + n * 20 + 8 + k * 3); }
    const rx = a[0] + Math.cos(ang - 1.6) * (8 + R() * 3), rz = a[1] + Math.sin(ang - 1.6) * (8 + R() * 3); if (distXZ(rx, rz, 18) >= 15) rock(rx, rz, sc, 1000 + n * 20 + 16);
    info.clusters++; }
  // Wolken: Kugel-in-Kugel, flache Unterseite
  for (let n = 0; n < 14; n++) { const x = ctr.x + (R() - 0.5) * TW * 1.1, z = ctr.z + (R() - 0.5) * TD * 1.1, y = 85 + R() * 60, sc = 7 + R() * 7, k = 4 + Math.floor(R() * 3);
    for (let j = 0; j < k; j++) { const r = sc * (0.6 + R() * 0.55) * (j === 0 ? 1.3 : 1), g = blob(r, 3, 0.07, n * 10 + j); g.scale(1, 0.82, 1); g.translate(x + (j - k / 2) * sc * 0.95, y + (R() - 0.2) * sc * 0.4, z + (R() - 0.5) * sc * 0.8); put('cloud', g, 3000 + n * 10 + j); } }
  for (const [key, list] of Object.entries(bins)) addMesh(bake(list), M[key], { name: key, cast: key !== 'cloud', recv: key !== 'cloud' });

  // ---------- Karts ----------
  const karts = [];
  const mkKart = (ci) => { const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const add = (geo, mat, x, y, z, par = body) => { seedGeometry(THREE, geo, 4000 + ci * 30 + par.children.length); const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; par.add(m); return m; };
    add(new RoundedBoxGeometry(2.3, 0.75, 3.7, 4, 0.34), M['kart' + ci], 0, 0.78, 0);
    add(new RoundedBoxGeometry(1.7, 0.5, 1.3, 4, 0.24), M['kart' + ci], 0, 1.05, 1.55);
    add(new RoundedBoxGeometry(1.4, 1.0, 0.4, 4, 0.18), M['kart' + ci], 0, 1.55, -1.05);
    const head = add(new THREE.SphereGeometry(0.72, 28, 20), M.skin, 0, 2.2, -0.35);
    for (const sx of [-0.27, 0.27]) { add(new THREE.SphereGeometry(0.26, 18, 14), M.eye, sx, 2.38, 0.22); add(new THREE.SphereGeometry(0.12, 12, 10), M.pupil, sx * 1.05, 2.4, 0.46); }
    add(new THREE.SphereGeometry(0.2, 14, 10), M.skin, 0, 2.12, 0.38);
    const wheels = [];
    for (const [x, z] of [[-1.25, 1.25], [1.25, 1.25], [-1.25, -1.2], [1.25, -1.2]]) { const w = add(new THREE.CylinderGeometry(0.62, 0.62, 0.62, 22).rotateZ(Math.PI / 2), M.tyre, x, 0.62, z, g); wheels.push(w); }
    return { g, body, wheels, head };
  };
  const KV = [{ lat: -3.0, v: 24, s: 0 }, { lat: 2.6, v: 22.5, s: 0 }, { lat: 0, v: 21, s: 0 }];
  const Lroute = S[N - 1].s;
  const startS = S[jIdx('atrium_up')].s - 50;
  KV.forEach((k, n) => { const kt = mkKart(n); k.s = startS + 14 * (2 - n); k.obj = kt; root.add(kt.g); karts.push(k); });
  const placeKart = (k, t) => { const a = at(k.s), m = new THREE.Matrix4().makeBasis(a.R.clone().negate(), a.U, a.T);
    const p = a.p.clone().addScaledVector(a.R, k.lat); m.setPosition(p); k.obj.g.matrixAutoUpdate = false; k.obj.g.matrix.copy(m); k.obj.g.matrixWorldNeedsUpdate = true;
    k.obj.body.scale.set(1 - 0.03 * Math.sin(t * 9 + k.lat), 1 + 0.05 * Math.sin(t * 9 + k.lat), 1); k.obj.head.position.y = 2.2 + 0.08 * Math.sin(t * 7 + k.lat * 2);
    k.obj.wheels.forEach(w => { w.rotation.x = k.s / 0.62; }); };

  // ---------- Kameras ----------
  const view = (s, lat, lift, back, lat2, lift2, fwd) => { const a = at(s - back), b = at(s + fwd); return { pos: a.p.clone().addScaledVector(a.R, lat).addScaledVector(a.U, lift), tgt: b.p.clone().addScaledVector(b.R, lat2).addScaledVector(b.U, lift2) }; };
  const hp = Math.round((jIdx('plaza_hairpin') + jIdx('east_run')) / 2), hpSide = Math.sign(ks[hp]) || 1, hpS = S[hp].s, hpE = S[hp].slots[7][0];
  const dr = Math.round(jIdx('drift_ring') + (jIdx('to_orange') - jIdx('drift_ring')) * 0.45), drS = S[dr].s, drOut = -(Math.sign(ks[dr]) || 1);
  const airS = S[jIdx('air')].s, magS = S[jIdx('mag_in')].s;
  const loopC = new THREE.Vector3(); { const a = jIdx('roof_loop'), b = jIdx('loop_out'); for (let i = a; i <= b; i++) loopC.add(V(S[i].p)); loopC.multiplyScalar(1 / (b - a + 1)); }
  const loopR = V(S[jIdx('roof_loop')].R);
  let PS = null; for (const c of pillarCands) { for (const sg of [1, -1]) { const pos = c.p.clone().addScaledVector(c.R, sg * 58); if (distXZ(pos.x, pos.z, 30) >= 28) { PS = { ...c, pos }; break; } } if (PS) break; }
  const shots = {
    uebersicht: { pos: new THREE.Vector3(ctr.x - 250, 250, ctr.z - 400), tgt: new THREE.Vector3(ctr.x + 10, 0, ctr.z + 10) },
    nah: view(hpS, hpSide * (hpE - 4), 7.5, 9, hpSide * (hpE + 1.4), 0, 7),
    prall: view(drS, -drOut * 2, 3.2, 18, drOut * 10.5, 0.8, 4),
    stuetzen: PS ? { pos: new THREE.Vector3(PS.pos.x, GY + PS.h * 0.45, PS.pos.z), tgt: new THREE.Vector3(PS.p.x, GY + PS.h * 0.45, PS.p.z) } : null,
    boost: view(magS + 6, -1.2, 3.6, 12, 0, 0.4, 14),
    kicker: { pos: at(airS - 10).p.clone().addScaledVector(at(airS).R, 34).add(new THREE.Vector3(0, 5, 0)), tgt: at(airS + 4).p.clone().add(new THREE.Vector3(0, -1, 0)) },
    loop: { pos: loopC.clone().addScaledVector(loopR, 78).add(new THREE.Vector3(0, 4, 0)), tgt: loopC }
  };
  if (!shots.stuetzen) shots.stuetzen = shots.uebersicht;

  // Sonne und Schattenkasten über den ganzen Tisch
  sun.position.set(ctr.x - 160, 260, ctr.z + 120); sun.target.position.copy(ctr);
  Object.assign(sun.shadow.camera, { left: -330, right: 330, top: 330, bottom: -330, near: 20, far: 800 }); sun.shadow.camera.updateProjectionMatrix();
  back.position.set(ctr.x + 200, 120, ctr.z - 160);
  info.buildMs = Math.round(performance.now() - t0);

  // ---------- Nachbearbeitung ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.8; composer.addPass(aoPass); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const st = { world: 'canyon', cam: 'uebersicht', run: true, grey: false };
  const setWorld = key => { const Wd = WORLDS[key] || W0; st.world = info.world = key;
    scene.background = new THREE.Color(Wd.sky); scene.fog = new THREE.Fog(Wd.sky, 700, 1900);
    RU.uRoadA.value.set(Wd.roadStreet); RU.uRoadB.value.set(Wd.roadTrack);
    M.strang.color.set(Wd.strang); M.pad.color.set(Wd.pad); M.table.color.set(Wd.table); M.trunk.color.set(Wd.trunk); M.rock.color.set(Wd.rock); M.cloud.color.set(Wd.cloud);
    Wd.hill.forEach((c, i) => M['hill' + i].color.set(c)); Wd.tower.forEach((c, i) => M['tower' + i].color.set(c)); Wd.leaf.forEach((c, i) => M['leaf' + i].color.set(c)); Wd.kart.forEach((c, i) => M['kart' + i].color.set(c)); };
  setWorld('canyon');
  const shot = id => { st.cam = info.cam = id; if (id === 'fahrt') { controls.enabled = false; return; } controls.enabled = true; const v = shots[id] || shots.uebersicht; camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update(); };
  shot('uebersicht');

  let raf = 0, last = performance.now(), frames = 0, fpsT = last, tAll = 0;
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(); let camInit = false;
  const loop = () => { raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; tAll += dt;
    for (const k of karts) { if (st.run) { k.s += k.v * dt; if (k.s > Lroute - 2) k.s = 2; } placeKart(k, tAll); }
    if (st.cam === 'fahrt') { const k = karts[0], a = at(k.s - 11), b = at(k.s + 12);
      const p = a.p.clone().addScaledVector(a.U, 4.4).addScaledVector(a.R, k.lat * 0.6), t = b.p.clone().addScaledVector(b.U, 1.0).addScaledVector(b.R, k.lat * 0.4);
      if (!camInit) { camPos.copy(p); camTgt.copy(t); camInit = true; } camPos.lerp(p, 0.2); camTgt.lerp(t, 0.2); camera.up.lerp(a.U, 0.15).normalize(); camera.position.copy(camPos); camera.lookAt(camTgt); }
    else { camInit = false; camera.up.set(0, 1, 0); controls.update(); }
    composer.render(); frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; } };
  loop();

  return {
    info, WORLDS, shot,
    set(k, v) { if (k === 'world') setWorld(v); else if (k === 'run') st.run = !!v; else if (k === 'ao' && aoPass) aoPass.enabled = !!v; else if (k === 'grey') { st.grey = !!v; canvas.style.filter = v ? 'grayscale(1)' : ''; } },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); }
  };
}
