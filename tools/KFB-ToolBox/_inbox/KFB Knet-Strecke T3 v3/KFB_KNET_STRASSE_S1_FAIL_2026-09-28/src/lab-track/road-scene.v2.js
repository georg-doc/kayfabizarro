/* KFB road-scene v2 (S1 v2, 28.09.) — Georg 28.09. zu v1: Markierungen fragmentarisch, keine gemeinsame Formsprache; Bürgersteige passen
 * nicht zur Straße, Bordsteine kantig, Fugen kaum sichtbar; Lampen und Ampeln sinnlos platziert; Fahrbahn nicht immer grau,
 * Markierung nicht immer weiß: alles folgt Palette und Cartoon-Farbschema der Welt, auch Ampeln, Schilder, Pfähle.
 *
 * PRINZIP »Knetwurst« — jede Markierung und jedes Schildsymbol ist aus EINEM Stück gebaut: einer gerollten, flach gedrückten
 * Knetwurst mit runden Enden (Pille). Drei Stärken (S 0,3 · M 0,6 · L 1,2 m), eine Höhe (5 cm, gewölbt), Längen auf dem
 * 1,5-m-Raster. Durchgezogene Linien sind Würste zu 4,5 m mit Fuge, Striche 3 oder 4,5 m, Punkte sind Würste so lang wie breit.
 * Wo zwei Würste sich treffen (Pfeilspitze, Zickzack), sitzt ein runder Knubbel. Keine Fläche wird bemalt.
 * FARBE — je Welt eine Straßenpalette (ROADPAL): Fahrbahn, Markierung, Mittelakzent, Spielakzent, Bürgersteig, Bordstein,
 * Pfahl, Signalfarben. Stadtmöbel (KayKit) werden auf diese Palette gezogen: Grau → Pfahl/Hell, Rot/Gelb/Grün/Blau → Signalfarben.
 * ORT — Ampel rechts vor der Haltelinie, Blick zum ankommenden Verkehr; Laternen am äußeren Rand des Bürgersteigs, Arm über die
 * Fahrbahn (Arm-Richtung am Modell gemessen); Schilder vor dem, was sie ankündigen; Bordstein am Zebra abgesenkt.
 * ECKEN — wie die Häuser: jede Ecke von Fahrbahn, Bürgersteig und Bordsteinlinie ist ausgerundet (0,8 m außen, 0,5 m in Buchten). */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../lab-clay/clay-relief.v5.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v10.js?r=2';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v2.js';
import { WORLDS } from './track-look.v4.js?r=1';

const here = f => new URL(f, import.meta.url).href;
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + p.split('/').map(encodeURIComponent).join('/');
const KK = n => RAW('media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/' + n + '.gltf');
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };

export const ROADPAL = {
  canyon: { road: '#3f5a86', paint: '#f6e6cf', paint2: '#f2b632', accent: '#f2b632', pave: '#a9bcd8', curb: '#f6e6cf', pole: '#3b3552', light: '#fbe9d6', red: '#e8472a', amber: '#f2b632', green: '#58b368', blue: '#5983ac' },
  bucht:  { road: '#2f6f86', paint: '#fff4d6', paint2: '#ff9eb0', accent: '#f7d23c', pave: '#9fd0d8', curb: '#fff4d6', pole: '#46406e', light: '#fff6e0', red: '#f2708a', amber: '#f7d23c', green: '#8fcf45', blue: '#46adb2' },
  otown:  { road: '#5a4270', paint: '#fff2c8', paint2: '#e9b53b', accent: '#fff06a', pave: '#c7b3d6', curb: '#fff2c8', pole: '#2f5d63', light: '#fff8e6', red: '#e0679f', amber: '#e9b53b', green: '#4cb5a5', blue: '#6b8fd6' }
};
const W = { S: 0.3, M: 0.6, L: 1.2 };
// Stile: nur Würste. line = durchgezogen (4,5-m-Würste mit Fuge), dash [an, aus], dots, chev, zig, wave, grid. col: paint · paint2 · accent
export const STYLES = {
  stadt:    { name: 'Stadt', short: 'Rand durchgezogen S, Mitte Striche S 3 m / 6 m.', els: H => [{ k: 'line', u: H - 0.45, w: W.S }, { k: 'line', u: -(H - 0.45), w: W.S }, { k: 'dash', u: 0, w: W.S, on: 3, off: 6 }] },
  land:     { name: 'Landstraße', short: 'Rand durchgezogen S, Mitte Striche S 4,5 m / 9 m.', els: H => [{ k: 'line', u: H - 0.45, w: W.S }, { k: 'line', u: -(H - 0.45), w: W.S }, { k: 'dash', u: 0, w: W.S, on: 4.5, off: 9 }] },
  verbot:   { name: 'Überholverbot', short: 'Mitte doppelt durchgezogen in der Mittelfarbe.', els: H => [{ k: 'line', u: H - 0.45, w: W.S }, { k: 'line', u: -(H - 0.45), w: W.S }, { k: 'line', u: 0.3, w: W.S, col: 'paint2' }, { k: 'line', u: -0.3, w: W.S, col: 'paint2' }] },
  autobahn: { name: 'Autobahn', short: 'Rand M, Mitte doppelt, Spuren Striche S 4,5 m / 9 m.', els: H => [{ k: 'line', u: H - 0.55, w: W.M }, { k: 'line', u: -(H - 0.55), w: W.M }, { k: 'line', u: 0.3, w: W.S, col: 'paint2' }, { k: 'line', u: -0.3, w: W.S, col: 'paint2' }, { k: 'dash', u: H / 2, w: W.S, on: 4.5, off: 9 }, { k: 'dash', u: -H / 2, w: W.S, on: 4.5, off: 9 }] },
  renn:     { name: 'Rennstrecke', short: 'Rand M, keine Mitte, Startwinkel aus Würsten M.', els: H => [{ k: 'line', u: H - 0.55, w: W.M }, { k: 'line', u: -(H - 0.55), w: W.M }, { k: 'grid', gap: 9 }] },
  magnet:   { name: 'Magnet', short: 'Boost-Pfeile aus zwei Würsten M mit Knubbel, Spielakzent.', els: H => [{ k: 'line', u: H - 0.45, w: W.S }, { k: 'line', u: -(H - 0.45), w: W.S }, { k: 'chev', gap: 3, span: 0.6, col: 'accent' }] },
  looping:  { name: 'Looping', short: 'Zwei Leitbänder L im Spielakzent, Mitte Punkte M. Liest auch kopfüber als Spur.', els: H => [{ k: 'line', u: H * 0.46, w: W.L, col: 'accent' }, { k: 'line', u: -H * 0.46, w: W.L, col: 'accent' }, { k: 'dots', u: 0, w: W.M, gap: 1.5 }] },
  bucht:    { name: 'Bikini-Bucht', short: 'Mitte Welle aus kurzen Würsten S in der Mittelfarbe, Rand Punkte M.', els: H => [{ k: 'wave', u: 0, w: W.S, amp: 0.6, len: 9, col: 'paint2' }, { k: 'dots', u: H - 0.55, w: W.M, gap: 1.5 }, { k: 'dots', u: -(H - 0.55), w: W.M, gap: 1.5 }] },
  otown:    { name: 'O-Town', short: 'Mitte Zickzack aus Würsten S mit Knubbeln, Rand Striche S ungleich lang.', els: H => [{ k: 'zig', u: 0, w: W.S, amp: 0.6, len: 3, col: 'paint2' }, { k: 'dash', u: H - 0.45, w: W.S, on: 3, off: 1.5, jit: 0.5 }, { k: 'dash', u: -(H - 0.45), w: W.S, on: 3, off: 1.5, jit: 0.5 }] },
  canyon:   { name: 'Canyon · Piste', short: 'Keine Linien. Kieselketten aus Punkten S am Rand und in der Mitte.', els: H => [{ k: 'dots', u: H - 0.6, w: W.S, gap: 1.5, jit: 0.5 }, { k: 'dots', u: -(H - 0.6), w: W.S, gap: 1.5, jit: 0.5 }, { k: 'dots', u: 0, w: W.S, gap: 3, jit: 0.8 }] }
};
export const STYLE_ORDER = ['stadt', 'land', 'verbot', 'autobahn', 'renn', 'magnet', 'looping', 'bucht', 'otown', 'canyon'];

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, errors: [], props: 0, marks: 0, curbs: 0, orient: {} };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.2, 3000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;

  onNote('Knete wird angerührt …'); await new Promise(r => setTimeout(r, 30));
  const tex = (d, n = 1024) => { const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  const rel = makeClayRelief({ size: 1024, seed: 31 }), relT = tex(rel.data);
  const U = makeClayUniforms(THREE, relT); U.uClayMottle.value = 0.04;
  const tr = await makeToolReliefs({ size: 1024, seed: 41, onStep: t => onNote('Werkzeug ' + t + ' …') });
  [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tr.maps.map(d => tex(d)); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0;
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = relT; }
  const K = 3; U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;

  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.15;
  Object.assign(sun.shadow.camera, { left: -230, right: 230, top: 230, bottom: -230, near: 10, far: 700 }); sun.position.set(-120, 220, 140); sun.target.position.set(0, 0, -60); scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05)); const back = new THREE.DirectionalLight('#ffe6d6', 0.6); back.position.set(160, 100, -160); scene.add(back);

  // ---------- Materialien: je Masse eins, Farbe aus ROADPAL ----------
  const M = {};
  const mat = (key, p, mix, role) => (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...p, tools: mix ? TOOLMIX[mix] : null, legacy: mix ? 0 : 1 }, role }));
  mat('road', prof('road', 0.5, K), 'road'); mat('roadLegacy', prof('road', 0.5, K), null);
  for (const k of ['paint', 'paint2']) mat(k, prof('prop', 0.4, K, QUIET), 'paint');
  mat('accent', prof('water', 0.9, K, { print: 0.2, dent: 0 }), 'paint', 'knetbar');
  mat('pave', prof('prop', 0.6, K, QUIET), 'pave'); mat('curb', prof('prop', 0.5, K, QUIET), 'curb');
  mat('table', prof('terrainBg', 3.2, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }), 'terrain');
  for (const k of ['pole', 'light', 'red', 'amber', 'green', 'blue']) mat('p_' + k, prof('prop', 0.5, K, QUIET), 'curb', k === 'pole' ? 'world' : 'knetbar');
  for (const k of ['kart0', 'kart1', 'skin']) mat(k, prof('vehicle', 0.5, 1, { dent: 0 }), 'vehicle');
  mat('tyre', prof('vehicle', 0.5, 1, { dent: 0 }), 'vehicle'); mat('eye', prof('figure', 0.5, 1, { dent: 0 }), null, 'knetbar'); mat('pupil', prof('figure', 0.5, 1, { dent: 0 }), null, 'knetbar');
  M.tyre.color.set('#2e2c3a'); M.eye.color.set('#fbf6ec'); M.pupil.color.set('#17151d'); M.skin.color.set('#f2b48c');

  const root = new THREE.Group(); scene.add(root);
  const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g.index ? g.toNonIndexed() : g); };
  const roadMeshes = [];
  const flush = () => { for (const [k, list] of Object.entries(bins)) { list.forEach(g => { if (g.attributes.uv) g.deleteAttribute('uv'); }); const o = new THREE.Mesh(mergeGeometries(list, false), M[k]); o.castShadow = k !== 'table'; o.receiveShadow = true; o.name = k; root.add(o); if (k === 'road') roadMeshes.push(o); } };
  const fillet = (pts, r, closed = true, n = 6) => { const out = [], N = pts.length;
    for (let i = 0; i < N; i++) { const p = pts[i], a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
      if (!closed && (i === 0 || i === N - 1)) { out.push(p); continue; }
      const ax = a[0] - p[0], az = a[1] - p[1], bx = b[0] - p[0], bz = b[1] - p[1], la = Math.hypot(ax, az), lb = Math.hypot(bx, bz);
      if (la < 1e-4 || lb < 1e-4) continue; const cr = (ax * bz - az * bx) / (la * lb); if (Math.abs(cr) < 0.02) { out.push(p); continue; }
      const cosA = (ax * bx + az * bz) / (la * lb), half = Math.acos(Math.max(-1, Math.min(1, cosA))) / 2, rr = Math.min(r, Math.tan(half) * Math.min(la, lb) * 0.45), d = rr / Math.tan(half);
      const p0 = [p[0] + ax / la * d, p[1] + az / la * d], p1 = [p[0] + bx / lb * d, p[1] + bz / lb * d];
      for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p1[1]]); } }
    return out; };
  const slab = (pts, top, depth, bevel, key, seed) => { const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 8 }); g.rotateX(-Math.PI / 2); g.translate(0, top - depth - bevel, 0); put(key, g, seed); };

  // ---------- Die Knetwurst: eine Pille von a nach b, Breite w, 5 cm hoch, gewölbt ----------
  const PH = 0.05;
  const pill = (a, b, w, key, seed, y = 0) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), r = w / 2, sh = new THREE.Shape();
    const bv = Math.min(0.05, r * 0.45), rr = Math.max(0.01, r - bv);
    if (L < 1e-3) sh.absarc(0, 0, rr, 0, Math.PI * 2, false); else { sh.moveTo(0, -rr); sh.lineTo(L, -rr); sh.absarc(L, 0, rr, -Math.PI / 2, Math.PI / 2, false); sh.lineTo(0, rr); sh.absarc(0, 0, rr, Math.PI / 2, Math.PI * 1.5, false); }
    const g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.005, PH - bv * 2), bevelEnabled: true, bevelThickness: bv, bevelSize: bv, bevelSegments: 3, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.rotateY(-Math.atan2(dz, dx)); g.translate(a[0], y + bv + 0.004, a[1]); put(key, g, seed); info.marks++; };
  const knob = (p, w, key, seed, y = 0) => pill(p, p, w * 1.35, key, seed, y);
  // Kette entlang einer Linie in einem (s, u)-Rahmen
  const RND = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const markRun = (o, t, L, H, style, seed) => { const n = [-t[1], t[0]], P = (s, u) => [o[0] + t[0] * s + n[0] * u, o[1] + t[1] * s + n[1] * u];
    for (const e of STYLES[style].els(H)) { const key = e.col || 'paint';
      if (e.k === 'line') for (let s = 0.75; s < L - 0.75; s += 4.5) pill(P(s, e.u), P(Math.min(L - 0.75, s + 4.5 - 0.35 - e.w), e.u), e.w, key, seed);
      if (e.k === 'dash') { let s = 1.5; while (s < L - 1.5) { const on = e.on * (1 + (e.jit ? (RND() - 0.5) * e.jit : 0)); pill(P(s, e.u), P(Math.min(L - 1.5, s + on - e.w), e.u), e.w, key, seed); s += on + e.off; } }
      if (e.k === 'dots') for (let s = 1.5; s < L - 1; s += e.gap) { const j = e.jit ? (RND() - 0.5) * e.jit : 0; pill(P(s + j * 0.6, e.u + j * 0.3), P(s + j * 0.6, e.u + j * 0.3), e.w * (1 + j * 0.5), key, seed); }
      if (e.k === 'wave') for (let s = 1.5; s < L - 1.5; s += 1.5) { const u0 = e.u + Math.sin(s / e.len * 6.2832) * e.amp, u1 = e.u + Math.sin((s + 1.2) / e.len * 6.2832) * e.amp; pill(P(s, u0), P(s + 1.2, u1), e.w, key, seed); }
      if (e.k === 'zig') { let prev = null; for (let s = 1.5, i = 0; s < L - 1.5; s += e.len / 2, i++) { const p = P(s, e.u + (i % 2 ? e.amp : -e.amp)); if (prev) pill(prev, p, e.w, key, seed); knob(p, e.w, key, seed); prev = p; } }
      if (e.k === 'chev') for (let s = 2; s < L - 2; s += e.gap) { const hw = e.span * H, tip = P(s + 1.5, 0); pill(P(s, -hw), tip, W.M, key, seed); pill(P(s, hw), tip, W.M, key, seed); knob(tip, W.M, key, seed); }
      if (e.k === 'grid') for (let s = 6, i = 0; s < L - 3; s += e.gap, i++) { const u = (i % 2 ? -1 : 1) * H * 0.45, c = P(s, u); pill(P(s, u - 1.5), P(s, u + 1.5), W.M, 'paint', seed); pill(P(s, u - 1.5), P(s - 1.5, u - 1.5), W.M, 'paint', seed); pill(P(s, u + 1.5), P(s - 1.5, u + 1.5), W.M, 'paint', seed); knob(P(s, u - 1.5), W.M, 'paint', seed); knob(P(s, u + 1.5), W.M, 'paint', seed); } } };

  // ---------- Tisch ----------
  { const g = new RoundedBoxGeometry(520, 10, 420, 6, 4); g.translate(0, -5.6, -70); put('table', g, 77); }

  // ---------- Verkehrsplatz ----------
  const H = 5.4, A = 70, F = 4, PK = [15, 57, 2.4], SW = 5, CT = 0.3;       // CT: Oberkante Bürgersteig
  const arc = (cx, cz, r, a0, a1, n = 8) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
  const inRoad = (x, z) => Math.abs(z) < H || Math.abs(x) < H || (x > PK[0] && x < PK[1] && z > 0 && z < H + PK[2]) || (Math.abs(x) < H + F && Math.abs(z) < H + F && Math.hypot(Math.abs(x) - (H + F), Math.abs(z) - (H + F)) > F);
  { const P = [[-A, -H], ...arc(-(H + F), -(H + F), F, Math.PI / 2, 0), [-H, -A], [H, -A], ...arc(H + F, -(H + F), F, Math.PI, Math.PI / 2), [A, -H], [A, H], [PK[1], H], [PK[1], H + PK[2]], [PK[0], H + PK[2]], [PK[0], H],
      ...arc(H + F, H + F, F, -Math.PI / 2, -Math.PI), [H, A], [-H, A], ...arc(-(H + F), H + F, F, 0, -Math.PI / 2), [-A, H]];
    slab(fillet(P, 0.5), 0, 0.45, 0.15, 'road', 5); }
  const zebraAt = (x, z) => { const ax = Math.abs(x), az = Math.abs(z); return (ax > H + 8.5 && ax < H + 13.5 && az < H + 1.5) || (az > H + 8.5 && az < H + 13.5 && ax < H + 1.5); };
  const curbRun = pts => { let acc = [pts[0]], rest = 0; const blocks = [];
    for (let i = 1; i < pts.length; i++) { let [x0, z0] = pts[i - 1]; const [x1, z1] = pts[i], d = Math.hypot(x1 - x0, z1 - z0); let s = 0;
      while (rest + (d - s) >= 1.5) { const need = 1.5 - rest; s += need; const t = s / d, p = [x0 + (x1 - x0) * t, z0 + (z1 - z0) * t]; blocks.push([acc[0], p]); acc = [p]; rest = 0; } rest += d - s; }
    for (const [a, b] of blocks) { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L, mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      const sg = inRoad(mx + nx * 0.6, mz + nz * 0.6) ? -1 : 1, low = zebraAt(mx, mz), hh = low ? 0.14 : CT + 0.1;
      const g = new RoundedBoxGeometry(L - 0.06, hh, 0.5, 3, low ? 0.06 : 0.16); g.rotateY(-Math.atan2(dz, dx)); g.translate(mx + nx * sg * 0.25, hh / 2 - 0.02, mz + nz * sg * 0.25); put('curb', g, 900 + info.curbs++); } };
  const quad = (sx, sz) => { const pk = sx > 0 && sz > 0, out = H + SW + (pk ? PK[2] : 0), inner = [[sx * A, sz * H]];
    if (pk) inner.push([PK[1], H], [PK[1], H + PK[2]], [PK[0], H + PK[2]], [PK[0], H]);
    inner.push(...arc(sx * (H + F), sz * (H + F), F, sz > 0 ? -Math.PI / 2 : Math.PI / 2, sx > 0 ? (sz > 0 ? -Math.PI : Math.PI) : 0, 12), [sx * H, sz * A]);
    const innerR = fillet(inner, 0.5, false), poly = fillet([...inner, [sx * (H + SW), sz * A], [sx * (H + SW), sz * out], [sx * A, sz * out]], 0.8);
    slab(poly, CT, 0.25, 0.08, 'pave', 20 + sx + sz * 3); curbRun(innerR); };
  quad(1, 1); quad(-1, 1); quad(1, -1); quad(-1, -1);
  // Arme: Rahmen (o = Kreuzungsmitte, t nach außen), Rechtsverkehr: ankommende Spur u < 0
  const ARMS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const armP = (t, s, u) => [t[0] * s - t[1] * u, t[1] * s + t[0] * u];
  for (const t of ARMS) {
    for (let s = H + 17; s < A - 3; s += 9) pill(armP(t, s, 0), armP(t, s + 3 - W.S, 0), W.S, 'paint', 40);           // Leitlinie Stadt
    for (let u = -H + 0.9; u <= H - 0.9; u += 1.2) pill(armP(t, H + 9, u), armP(t, H + 13.5 - W.M, u), W.M, 'paint', 41);   // Zebra: Würste M × 4,5 m
    pill(armP(t, H + 15.5, -0.3), armP(t, H + 15.5, -(H - 0.5)), W.M, 'paint', 42);                                  // Haltelinie
    pill(armP(t, H + 15.5, -0.3), armP(t, H + 15.5, -0.3), W.M, 'paint', 42);
  }
  for (let x = PK[0] + 0.6; x <= PK[1] - 0.4; x += 5.25) pill([x, H + 0.35], [x, H + PK[2] - 0.35], W.S, 'paint', 43);     // Buchten
  pill([PK[0] + 0.6, H + 0.2], [PK[1] - 0.6, H + 0.2], W.S, 'paint', 44);

  // ---------- Musterstraße ----------
  const MZ = -150, MH = 7.2, SEG = 40, MX0 = -(STYLE_ORDER.length * SEG) / 2;
  slab(fillet([[MX0 - 6, MZ - MH], [-MX0 + 6, MZ - MH], [-MX0 + 6, MZ + MH], [MX0 - 6, MZ + MH]], 3), 0, 0.45, 0.3, 'road', 6);
  STYLE_ORDER.forEach((st, i) => markRun([MX0 + i * SEG + 1, MZ], [1, 0], SEG - 2, MH, st, 100 + i));

  // ---------- Schilder aus Knete: Pfahl + Tafel + Symbol aus Würsten ----------
  const sign = (x, z, faceDir, shape, sym) => { const yaw = Math.atan2(faceDir[0], faceDir[1]), c = Math.cos(yaw), s = Math.sin(yaw), T = (lx, ly, lz) => [x + lx * c + lz * s, ly, z - lx * s + lz * c];
    const pole = new THREE.CapsuleGeometry(0.1, 2.9, 4, 12); pole.translate(x, CT + 1.55, z); put('p_pole', pole, 700 + info.props);
    const face = shape === 'round' ? new THREE.CylinderGeometry(0.55, 0.55, 0.12, 32) : new RoundedBoxGeometry(1.1, 1.1, 0.12, 3, 0.14);
    if (shape === 'round') face.rotateX(Math.PI / 2); face.rotateY(yaw); const fp = T(0, CT + 3.2, 0.12); face.translate(...fp); put(shape === 'round' ? 'p_red' : 'p_blue', face, 710 + info.props);
    const rim = new THREE.TorusGeometry(shape === 'round' ? 0.5 : 0.52, 0.06, 8, shape === 'round' ? 32 : 4); if (shape !== 'round') rim.rotateZ(Math.PI / 4); rim.rotateY(yaw); rim.translate(...T(0, CT + 3.2, 0.19)); put('p_light', rim, 720 + info.props);
    for (const [a, b] of sym) { const pa = T(a[0], CT + 3.2 + a[1], 0.2), pb = T(b[0], CT + 3.2 + b[1], 0.2), g = new THREE.CapsuleGeometry(0.07, Math.max(0.01, Math.hypot(b[0] - a[0], b[1] - a[1])), 4, 10);
      const d = new THREE.Vector3(pb[0] - pa[0], pb[1] - pa[1], pb[2] - pa[2]); if (d.length() > 1e-4) g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())); g.translate((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2); put('p_light', g, 730 + info.props); }
    info.props++; };
  const SYM_P = [[[-0.16, -0.3], [-0.16, 0.3]], [[-0.16, 0.3], [0.1, 0.3]], [[0.1, 0.3], [0.2, 0.15]], [[0.2, 0.15], [0.1, 0.0]], [[0.1, 0.0], [-0.16, 0.0]]];
  const SYM_ZEBRA = [[[-0.28, -0.25], [0, 0.3]], [[0, 0.3], [0.28, -0.25]], [[0.28, -0.25], [-0.28, -0.25]]];
  const SYM_BAR = [[[-0.3, 0], [0.3, 0]]];
  sign(PK[0] - 1.5, H + PK[2] + 1.0, [0, -1], 'square', SYM_P);
  for (const t of ARMS) { const p = armP(t, H + 22, -(H + 1.0)); sign(p[0], p[1], t, 'square', SYM_ZEBRA); }
  { const p = armP([0, -1], A - 8, H + 1.0); sign(p[0], p[1], [0, 1], 'round', SYM_BAR); }

  // ---------- Karts ----------
  const kart = (x, z, yaw, ci) => { const g = new THREE.Group(); const add = (geo, m, px, py, pz) => { seedGeometry(THREE, geo, 4000 + ci * 30 + g.children.length); const o = new THREE.Mesh(geo, M[m]); o.position.set(px, py, pz); o.castShadow = o.receiveShadow = true; g.add(o); };
    add(new RoundedBoxGeometry(2.3, 0.75, 3.7, 4, 0.34), 'kart' + ci, 0, 0.78, 0); add(new RoundedBoxGeometry(1.7, 0.5, 1.3, 4, 0.24), 'kart' + ci, 0, 1.05, 1.55); add(new RoundedBoxGeometry(1.4, 1.0, 0.4, 4, 0.18), 'kart' + ci, 0, 1.55, -1.05);
    add(new THREE.SphereGeometry(0.72, 28, 20), 'skin', 0, 2.2, -0.35); for (const sx of [-0.27, 0.27]) { add(new THREE.SphereGeometry(0.26, 18, 14), 'eye', sx, 2.38, 0.22); add(new THREE.SphereGeometry(0.12, 12, 10), 'pupil', sx * 1.05, 2.4, 0.46); }
    for (const [wx, wz] of [[-1.25, 1.25], [1.25, 1.25], [-1.25, -1.2], [1.25, -1.2]]) add(new THREE.CylinderGeometry(0.62, 0.62, 0.62, 22).rotateZ(Math.PI / 2), 'tyre', wx, 0.62, wz);
    g.position.set(x, 0, z); g.rotation.y = yaw; g.scale.setScalar(0.78); root.add(g); };
  kart(PK[0] + 3.2, H + 1.2, Math.PI / 2, 0); kart(PK[0] + 13.7, H + 1.2, Math.PI / 2, 1);
  { const p = armP([1, 0], H + 17.5, -2.7); kart(p[0], p[1], -Math.PI / 2, 0); } kart(MX0 + 6 * SEG + 20, MZ - 2.5, Math.PI / 2, 1);

  onNote('Straßenmöbel (KayKit) …');
  flush();

  // ---------- KayKit: Knete, Palette, Ausrichtung gemessen ----------
  let curWorld = 'otown';
  const loader = new GLTFLoader(), cache = new Map();
  const loadKK = n => { if (!cache.has(n)) cache.set(n, loader.loadAsync(KK(n)).then(g => g.scene).catch(e => { info.errors.push(n + ': ' + (e.message || e)); return null; })); return cache.get(n); };
  const CLS = ['pole', 'light', 'red', 'amber', 'green', 'blue'], propMeshes = [], atlas = new Map();
  M.propVC = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true }), profile: { ...prof('prop', 0.5, K, QUIET), tools: TOOLMIX.curb, legacy: 0 } });
  const pixels = tx => { if (atlas.has(tx)) return atlas.get(tx); const im = tx.image, cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
    const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(im, 0, 0); const d = { w: cv.width, h: cv.height, px: cx.getImageData(0, 0, cv.width, cv.height).data, flipY: tx.flipY }; atlas.set(tx, d); return d; };
  const paintProp = (m, R) => { const cls = m.userData.cls, col = m.geometry.attributes.color, c = new THREE.Color(); for (let i = 0; i < cls.length; i++) { c.set(R[CLS[cls[i]]]); col.setXYZ(i, c.r, c.g, c.b); } col.needsUpdate = true; };
  const classOf = c => { const hsl = {}; c.getHSL(hsl, THREE.SRGBColorSpace); if (hsl.s < 0.2) return hsl.l < 0.45 ? 'pole' : 'light'; const h = hsl.h * 360; return h < 25 || h > 330 ? 'red' : h < 70 ? 'amber' : h < 170 ? 'green' : 'blue'; };
  const armOffset = o => { const b = new THREE.Box3().setFromObject(o), c = b.getCenter(new THREE.Vector3()); return [c.x, c.z]; };
  const place = async (n, x, z, dir, height, { byArm = false, byLamp = false } = {}) => { const src = await loadKK(n); if (!src) return; const o = src.clone(true);
    o.traverse(m => { if (!m.isMesh) return; m.castShadow = m.receiveShadow = true; const sm = Array.isArray(m.material) ? m.material[0] : m.material;
      m.geometry = m.geometry.clone(); seedGeometry(THREE, m.geometry, 600 + info.props); const g = m.geometry, n = g.attributes.position.count, uv = g.attributes.uv, cls = new Uint8Array(n), tmp = new THREE.Color();
      const P = sm.map && sm.map.image && uv ? pixels(sm.map) : null;
      for (let i = 0; i < n; i++) { if (P) { let u = uv.getX(i) % 1, v = uv.getY(i) % 1; if (u < 0) u += 1; if (v < 0) v += 1; const x = Math.min(P.w - 1, Math.floor(u * P.w)), y = Math.min(P.h - 1, Math.floor((P.flipY ? 1 - v : v) * P.h)), k = (y * P.w + x) * 4;
          tmp.setRGB(P.px[k] / 255, P.px[k + 1] / 255, P.px[k + 2] / 255, THREE.SRGBColorSpace); } else tmp.copy(sm.color || new THREE.Color('#888'));
        cls[i] = CLS.indexOf(classOf(tmp)); }
      g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3)); m.userData.cls = cls; m.material = M.propVC; paintProp(m, ROADPAL[curWorld]); propMeshes.push(m); });
    o.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(o), h = b.max.y - b.min.y, sc = height / (h || 1);
    let phi0 = Math.PI;
    if (byLamp) { // Blickrichtung gemessen: Schwerpunkt der Lampen (rot/gelb/grün) gegen Schwerpunkt des Pfahls, im Modellraum
      const lp = new THREE.Vector3(), pp = new THREE.Vector3(), v = new THREE.Vector3(); let nl = 0, np = 0;
      o.traverse(m => { if (!m.isMesh || !m.userData.cls) return; const pos = m.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { const c = m.userData.cls[i]; if (c < 2 && c !== 0) continue; v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        if (c === 0) { pp.add(v); np++; } else if (c <= 4) { lp.add(v); nl++; } } });
      if (nl && np) { lp.multiplyScalar(1 / nl); pp.multiplyScalar(1 / np); const dx = lp.x - pp.x, dz = lp.z - pp.z; if (Math.hypot(dx, dz) > 0.02) phi0 = Math.atan2(dx, dz); }
      info.orient[n] = +(phi0 * 180 / Math.PI).toFixed(0); }
    if (byArm) { const [ox, oz] = armOffset(o); phi0 = Math.atan2(ox, oz); info.orient[n] = +(phi0 * 180 / Math.PI).toFixed(0); }
    o.scale.setScalar(sc); o.rotation.y = Math.atan2(dir[0], dir[1]) - phi0; o.position.set(x, CT - b.min.y * sc, z); root.add(o); info.props++; };
  const jobs = [];
  for (const t of ARMS) { const p = armP(t, H + 16.2, -(H + 1.1)); jobs.push(place('trafficlight_A', p[0], p[1], t, 5.6, { byLamp: true })); }
  for (const t of ARMS) for (let s = H + 24; s < A - 4; s += 18) { const p = armP(t, s, H + SW - 0.9); jobs.push(place('streetlight', p[0], p[1], [t[1], -t[0]], 7.5, { byArm: true })); }
  { const p = armP([-1, 0], H + 30, -(H + SW - 1.3)); jobs.push(place('bench', p[0], p[1], [0, 1], 1.3)); const q = armP([-1, 0], H + 32.5, -(H + SW - 1.1)); jobs.push(place('trash_A', q[0], q[1], [0, 1], 1.4)); }
  { const p = armP([0, -1], H + 27, -(H + 1.0)); jobs.push(place('firehydrant', p[0], p[1], [1, 0], 1.1)); }
  { const p = armP([0, 1], H + 34, -(H + SW - 1.1)); jobs.push(place('trash_B', p[0], p[1], [1, 0], 1.4)); }
  await Promise.all(jobs);

  // ---------- Kameras ----------
  const segX = i => MX0 + i * SEG + SEG / 2;
  const shots = {
    platz: { pos: new THREE.Vector3(-46, 52, 62), tgt: new THREE.Vector3(6, 0, 0) },
    zebra: { pos: new THREE.Vector3(H + 32, 5, -8), tgt: new THREE.Vector3(H + 10, 0, 1) },
    parken: { pos: new THREE.Vector3(PK[0] + 22, 9, H + 22), tgt: new THREE.Vector3(PK[0] + 14, 0, H + 1) },
    ampel: { pos: new THREE.Vector3(H + 40, 3.2, -3.5), tgt: new THREE.Vector3(H + 16, 3, -(H + 1)) },
    bordstein: { pos: new THREE.Vector3(H + F + 6, 2.2, -(H + 7)), tgt: new THREE.Vector3(H + 2, 0.2, -(H + 2)) },
    muster: { pos: new THREE.Vector3(MX0 - 40, 55, MZ + 70), tgt: new THREE.Vector3(MX0 + 150, 0, MZ) }
  };
  STYLE_ORDER.forEach((st, i) => { shots['m_' + st] = { pos: new THREE.Vector3(segX(i) - 24, 6.5, MZ - 1.5), tgt: new THREE.Vector3(segX(i) + 8, 0, MZ) }; });

  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let ao = null; try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); ao = new GTAOPass(scene, camera, 2, 2);
    ao.updateGtaoMaterial({ radius: 1.2, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); ao.blendIntensity = 0.8; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const shot = id => { const v = shots[id] || shots.platz; camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update(); };
  const setWorld = key => { curWorld = key; const Wd = WORLDS[key], R = ROADPAL[key]; propMeshes.forEach(m => paintProp(m, R)); scene.background = new THREE.Color(Wd.sky); M.table.color.set(Wd.table);
    M.road.color.set(R.road); M.roadLegacy.color.set(R.road); M.paint.color.set(R.paint); M.paint2.color.set(R.paint2); M.accent.color.set(R.accent); M.pave.color.set(R.pave); M.curb.color.set(R.curb);
    for (const k of ['pole', 'light', 'red', 'amber', 'green', 'blue']) M['p_' + k].color.set(R[k]); M.kart0.color.set(Wd.kart[0]); M.kart1.color.set(Wd.kart[2]); };
  setWorld('otown'); shot('platz');
  let raf = 0, frames = 0, fT = performance.now();
  const loop = () => { raf = requestAnimationFrame(loop); controls.update(); composer.render(); frames++; const n = performance.now(); if (n - fT > 1000) { info.fps = Math.round(frames * 1000 / (n - fT)); frames = 0; fT = n; } };
  loop();
  return { info, STYLES, STYLE_ORDER, WORLDS, ROADPAL, shot,
    set(k, v) { if (k === 'world') setWorld(v); else if (k === 'ao' && ao) ao.enabled = !!v; else if (k === 'roadMat') roadMeshes.forEach(o => o.material = v === 'legacy' ? M.roadLegacy : M.road); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); } };
}
