/* KFB road-scene v1 (S1, 28.09.) — Bühne S1 · Knet-Straße. Markierungen, Fahrbahn, Bürgersteig, Bordstein, Ampeln im Knet-Look.
 * Georg 28.09.: Fahrbahn mit optimieren; Mittelstreifen passend zu Track/Biom; übliche Verkehrssituationen (auch für FS01 später);
 * Looping-Streifen als Teil des Markierungskonzepts; Zebrastreifen, Parkzonen; Bürgersteige mit Bordstein; Ampeln (KayKit zuerst).
 * Prinzip wie T3: Markierung ist KEINE Farbe auf der Fläche, sondern flach gedrückte Knete auf der Fahrbahn (2–5 cm, gerundet),
 * wie die Boost-Pfeile. Stile als Daten (STYLES), Aufbau über (s, u) auf einem Pfad; derselbe Aufbau geht später auf Stream-Rahmen.
 * Zwei Teile: Verkehrsplatz (Kreuzung, Zebra, Haltelinien, Parkbuchten, Bürgersteig, Bordstein, Ampeln, Laternen, Bank, Hydrant)
 * und Musterstraße (10 Markierungsstile nebeneinander, je 40 m). Material clay-material.v10 + Werkzeuge, Mischungen clay-toolmix.v2. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../lab-clay/clay-relief.v4.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v10.js?r=2';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v2.js';
import { WORLDS } from './track-look.v4.js?r=1';

const here = f => new URL(f, import.meta.url).href;
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + p.split('/').map(encodeURIComponent).join('/');
const KK = n => RAW('media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/' + n + '.gltf');
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };

// ---------- Markierungsstile (Daten). u quer (m, + links in Fahrtrichtung), Werte in Metern. H = halbe Fahrbahnbreite ----------
// col: paint (Knetweiß) · accent (Spielzustand, Farbe der Welt) · rut (Fahrbahn dunkler, eingedrückte Spur)
export const STYLES = {
  stadt:    { name: 'Stadt', short: 'Randlinie durchgezogen, Mitte Leitlinie 3 m / 6 m.', els: H => [{ k: 'line', u: H - 0.4, w: 0.25 }, { k: 'line', u: -(H - 0.4), w: 0.25 }, { k: 'line', u: 0, w: 0.15, dash: [3, 6] }] },
  land:     { name: 'Landstraße', short: 'Randlinien, Mitte Leitlinie 6 m / 12 m.', els: H => [{ k: 'line', u: H - 0.4, w: 0.25 }, { k: 'line', u: -(H - 0.4), w: 0.25 }, { k: 'line', u: 0, w: 0.15, dash: [6, 12] }] },
  verbot:   { name: 'Überholverbot', short: 'Doppelte durchgezogene Mittellinie.', els: H => [{ k: 'line', u: H - 0.4, w: 0.25 }, { k: 'line', u: -(H - 0.4), w: 0.25 }, { k: 'line', u: 0.22, w: 0.15 }, { k: 'line', u: -0.22, w: 0.15 }] },
  autobahn: { name: 'Autobahn', short: 'Vier Streifen, Leitlinien 6 m / 12 m, breite Randlinie.', els: H => [{ k: 'line', u: H - 0.45, w: 0.35 }, { k: 'line', u: -(H - 0.45), w: 0.35 }, { k: 'line', u: 0, w: 0.2 }, { k: 'line', u: H / 2, w: 0.15, dash: [6, 12] }, { k: 'line', u: -H / 2, w: 0.15, dash: [6, 12] }] },
  renn:     { name: 'Rennstrecke', short: 'Keine Mitte. Startaufstellung als Winkel, Randlinie breit.', els: H => [{ k: 'line', u: H - 0.5, w: 0.4 }, { k: 'line', u: -(H - 0.5), w: 0.4 }, { k: 'grid', gap: 9 }] },
  magnet:   { name: 'Magnet', short: 'Boost-Pfeile in der Akzentfarbe, Randlinien.', els: H => [{ k: 'line', u: H - 0.4, w: 0.25 }, { k: 'line', u: -(H - 0.4), w: 0.25 }, { k: 'chev', gap: 3, span: 0.7, col: 'accent' }] },
  looping:  { name: 'Looping', short: 'Zwei Leitbänder in der Akzentfarbe, dazwischen eine Perlenkette. Liest auch kopfüber als Spur.', els: H => [{ k: 'line', u: H * 0.46, w: 0.55, col: 'accent' }, { k: 'line', u: -H * 0.46, w: 0.55, col: 'accent' }, { k: 'beads', u: 0, r: 0.38, gap: 1.8 }] },
  bucht:    { name: 'Bikini-Bucht', short: 'Wellenlinie in der Mitte, Rand als Perlen.', els: H => [{ k: 'wave', u: 0, w: 0.3, amp: 0.6, len: 9 }, { k: 'beads', u: H - 0.5, r: 0.28, gap: 1.4 }, { k: 'beads', u: -(H - 0.5), r: 0.28, gap: 1.4 }] },
  otown:    { name: 'O-Town', short: 'Zickzack in der Mitte, Randstriche ungleich lang.', els: H => [{ k: 'zig', u: 0, w: 0.25, amp: 0.45, len: 4 }, { k: 'line', u: H - 0.4, w: 0.25, dash: [4, 2.5], jit: 0.6 }, { k: 'line', u: -(H - 0.4), w: 0.25, dash: [4, 2.5], jit: 0.6 }] },
  canyon:   { name: 'Canyon · Piste', short: 'Keine Farbe. Zwei eingedrückte Fahrspuren.', els: H => [{ k: 'line', u: H * 0.34, w: 1.3, col: 'rut' }, { k: 'line', u: -H * 0.34, w: 1.3, col: 'rut' }] }
};
export const STYLE_ORDER = ['stadt', 'land', 'verbot', 'autobahn', 'renn', 'magnet', 'looping', 'bucht', 'otown', 'canyon'];

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, errors: [], props: 0, marks: 0 };
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

  // Materialien
  const M = {}, W0 = WORLDS.otown;
  const mat = (key, color, p, mix, extra = {}) => (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color }), profile: { ...p, tools: mix ? TOOLMIX[mix] : null, legacy: mix ? 0 : 1 }, role: extra.role }));
  mat('road', W0.roadStreet, prof('road', 0.5, K), 'road');
  mat('roadLegacy', W0.roadStreet, prof('road', 0.5, K), null);
  mat('paint', '#f3ead8', prof('prop', 0.4, K, QUIET), 'paint');
  mat('accent', W0.pad, prof('water', 0.9, K, { print: 0.2, dent: 0 }), 'paint', { role: 'knetbar' });
  mat('rut', '#3c3f5a', prof('road', 0.5, K), 'road');
  mat('pave', '#d9ccb8', prof('prop', 0.6, K, QUIET), 'pave');
  mat('curb', '#efe4d2', prof('prop', 0.5, K, QUIET), 'curb');
  mat('table', W0.table, prof('terrainBg', 3.2, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }), 'terrain');
  mat('kart0', W0.kart[0], prof('vehicle', 0.5, 1, { dent: 0 }), 'vehicle'); mat('kart1', W0.kart[2], prof('vehicle', 0.5, 1, { dent: 0 }), 'vehicle');
  mat('tyre', '#2e2c3a', prof('vehicle', 0.5, 1, { dent: 0 }), 'vehicle'); mat('eye', '#fbf6ec', prof('figure', 0.5, 1, { dent: 0 }), null, { role: 'knetbar' });
  mat('pupil', '#17151d', prof('figure', 0.5, 1, { dent: 0 }), null, { role: 'knetbar' }); mat('skin', '#f2b48c', prof('figure', 0.5, 1, { dent: 0 }), 'vehicle');

  const root = new THREE.Group(); scene.add(root);
  const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g.index ? g.toNonIndexed() : g); };
  const flush = () => { for (const [k, list] of Object.entries(bins)) { list.forEach(g => g.deleteAttribute('uv')); const o = new THREE.Mesh(mergeGeometries(list, false), M[k]); o.castShadow = o.receiveShadow = true; o.name = k; root.add(o); if (k === 'road') roadMeshes.push(o); } };
  const roadMeshes = [];
  // Platte aus Polygon (x, z): Oberkante y = top, gerundete Kante
  const slab = (pts, top, depth, bevel, key, seed) => { const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 8 }); g.rotateX(-Math.PI / 2); g.translate(0, top - depth - bevel, 0); put(key, g, seed); };
  // Band aus Mittellinie (x, z) mit Breite w, flach gedrückt
  const band = (pts, w, key, seed, h = 0.02) => { if (pts.length < 2) return; const L = [], R = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1, nx = -tz / l, nz = tx / l;
      L.push([pts[i][0] + nx * w / 2, pts[i][1] + nz * w / 2]); R.push([pts[i][0] - nx * w / 2, pts[i][1] - nz * w / 2]); }
    const poly = [...L, ...R.reverse()], sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z))), bv = Math.min(0.05, w * 0.28);
    const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: true, bevelThickness: 0.03, bevelSize: bv, bevelSegments: 2, curveSegments: 4 }); g.rotateX(-Math.PI / 2); g.translate(0, 0.005, 0); put(key, g, seed); info.marks++; };
  const bead = (x, z, r, key, seed) => { const g = new THREE.SphereGeometry(r, 16, 10); g.scale(1, 0.22, 1); g.translate(x, 0.02, z); put(key, g, seed); info.marks++; };
  // Markierung auf geradem Pfad: Ursprung o, Richtung t (Einheitsvektor xz), Länge L, halbe Breite H, Stil
  const RND = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const markRun = (o, t, L, H, style, seed) => { const n = [-t[1], t[0]], P = (s, u) => [o[0] + t[0] * s + n[0] * u, o[1] + t[1] * s + n[1] * u];
    for (const e of STYLES[style].els(H)) { const key = e.col === 'accent' ? 'accent' : e.col === 'rut' ? 'rut' : 'paint';
      if (e.k === 'line') { if (!e.dash) band([P(0.5, e.u), P(L - 0.5, e.u)], e.w, key, seed, e.col === 'rut' ? 0.008 : 0.02);
        else { let s = 1; while (s < L - 1) { const on = e.dash[0] * (1 + (e.jit ? (RND() - 0.5) * e.jit : 0)); band([P(s, e.u), P(Math.min(L - 1, s + on), e.u)], e.w, key, seed); s += on + e.dash[1] * (1 + (e.jit ? (RND() - 0.5) * e.jit : 0)); } } }
      if (e.k === 'wave' || e.k === 'zig') { const pts = []; for (let s = 0.5; s <= L - 0.5; s += e.k === 'wave' ? 0.5 : e.len / 2) { const ph = s / e.len; pts.push(P(s, e.u + (e.k === 'wave' ? Math.sin(ph * 6.2832) * e.amp : ((Math.round(ph * 2) % 2) ? e.amp : -e.amp)))); } band(pts, e.w, key, seed); }
      if (e.k === 'beads') for (let s = 1; s < L - 0.5; s += e.gap) bead(...P(s, e.u), e.r, key, seed);
      if (e.k === 'chev') for (let s = 2; s < L - 2; s += e.gap) { const w = e.span * 2 * H, tip = Math.min(2, w * 0.22), th = 0.9; band([P(s, -w / 2), P(s + tip, 0), P(s, w / 2)], th, key, seed, 0.04); }
      if (e.k === 'grid') for (let s = 4, i = 0; s < L - 4; s += e.gap, i++) { const u = (i % 2 ? -1 : 1) * H * 0.45; band([P(s, u - 1.6), P(s, u + 1.6)], 0.3, key, seed); band([P(s, u - 1.6), P(s - 2.2, u - 1.6)], 0.3, key, seed); band([P(s, u + 1.6), P(s - 2.2, u + 1.6)], 0.3, key, seed); } } };

  // ---------- Tisch ----------
  { const g = new RoundedBoxGeometry(520, 10, 420, 6, 4); g.translate(0, -5.6, -70); put('table', g, 77); }

  // ---------- Verkehrsplatz: Kreuzung 10,8 m, Parkstreifen Nord-Ost, Bürgersteige 5 m ----------
  const H = 5.4, A = 70, F = 4, PK = [14, 60, 2.6], SW = 5;
  const arc = (cx, cz, r, a0, a1, n = 8) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
  { // Fahrbahn als EIN Polygon (keine überlappenden Deckflächen), Innenecken ausgerundet
    const P = [[-A, -H], ...arc(-(H + F), -(H + F), F, Math.PI / 2, 0), [-H, -A], [H, -A], ...arc(H + F, -(H + F), F, Math.PI, Math.PI / 2), [A, -H], [A, H], [PK[1], H], [PK[1], H + PK[2]], [PK[0], H + PK[2]], [PK[0], H],
      ...arc(H + F, H + F, F, -Math.PI / 2, -Math.PI), [H, A], [-H, A], ...arc(-(H + F), H + F, F, 0, -Math.PI / 2), [-A, H]];
    slab(P, 0, 0.45, 0.15, 'road', 5); }
  // Bürgersteige als L-Stücke mit Bordstein an der Innenkante
  const quad = (sx, sz) => { const inner = [], z0 = sx > 0 && sz > 0 ? H + PK[2] : H, out = H + SW + (sx > 0 && sz > 0 ? PK[2] : 0);
    inner.push([sx * A, sz * H]); if (sx > 0 && sz > 0) inner.push([PK[1], H], [PK[1], H + PK[2]], [PK[0], H + PK[2]], [PK[0], H]);
    inner.push(...arc(sx * (H + F), sz * (H + F), F, sz > 0 ? -Math.PI / 2 : Math.PI / 2, sx > 0 ? (sz > 0 ? -Math.PI : Math.PI) : 0, 10));
    inner.push([sx * H, sz * A]);
    const poly = [...inner, [sx * (H + SW), sz * A], [sx * (H + SW), sz * out], [sx * A, sz * out]];
    slab(poly, 0.34, 0.25, 0.1, 'pave', 20 + sx + sz * 3); band(inner, 0.55, 'curb', 30 + sx + sz * 3, 0.36); };
  quad(1, 1); quad(-1, 1); quad(1, -1); quad(-1, -1);
  // Markierung Platz: Mitte Leitlinie, Rand, Zebra an allen vier Armen, Haltelinien, Parkbuchten
  for (const [o, t] of [[[H + 18, 0], [1, 0]], [[-(H + 18), 0], [-1, 0]], [[0, H + 18], [0, 1]], [[0, -(H + 18)], [0, -1]]]) {
    const n = [-t[1], t[0]], L = A - (H + 18) - 1, P = (s, u) => [o[0] + t[0] * s + n[0] * u, o[1] + t[1] * s + n[1] * u];
    let s = 1; while (s < L) { band([P(s, 0), P(Math.min(L, s + 3), 0)], 0.15, 'paint', 40); s += 9; }
    // Zebra quer über die Fahrbahn, 4 m lang, Streifen 0,5 m, Abstand 0,5 m
    for (let u = -H + 0.7; u <= H - 0.7; u += 1.0) band([P(-9, u), P(-5, u)], 0.5, 'paint', 41);
    band([P(-2.5, -0.2), P(-2.5, -(H - 0.4))], 0.45, 'paint', 42);   // Haltelinie der zulaufenden Spur (Rechtsverkehr: u < 0)
  }
  for (let x = PK[0] + 0.3; x <= PK[1]; x += 5.6) band([[x, H + 0.15], [x, H + PK[2] - 0.1]], 0.15, 'paint', 43);
  band([[PK[0] + 0.3, H + 0.08], [PK[1] - 0.3, H + 0.08]], 0.12, 'paint', 44);

  // ---------- Musterstraße: 10 Stile × 40 m, 14,4 m breit ----------
  const MZ = -150, MH = 7.2, SEG = 40, MX0 = -(STYLE_ORDER.length * SEG) / 2;
  slab([[MX0 - 6, MZ - MH], [-MX0 + 6, MZ - MH], [-MX0 + 6, MZ + MH], [MX0 - 6, MZ + MH]], 0, 0.45, 0.3, 'road', 6);
  STYLE_ORDER.forEach((st, i) => markRun([MX0 + i * SEG + 1, MZ], [1, 0], SEG - 2, MH, st, 100 + i));

  // ---------- Karts in den Buchten ----------
  const kart = (x, z, yaw, ci) => { const g = new THREE.Group(); const add = (geo, m, px, py, pz) => { seedGeometry(THREE, geo, 4000 + ci * 30 + g.children.length); const o = new THREE.Mesh(geo, M[m]); o.position.set(px, py, pz); o.castShadow = o.receiveShadow = true; g.add(o); };
    add(new RoundedBoxGeometry(2.3, 0.75, 3.7, 4, 0.34), 'kart' + ci, 0, 0.78, 0); add(new RoundedBoxGeometry(1.7, 0.5, 1.3, 4, 0.24), 'kart' + ci, 0, 1.05, 1.55); add(new RoundedBoxGeometry(1.4, 1.0, 0.4, 4, 0.18), 'kart' + ci, 0, 1.55, -1.05);
    add(new THREE.SphereGeometry(0.72, 28, 20), 'skin', 0, 2.2, -0.35); for (const sx of [-0.27, 0.27]) { add(new THREE.SphereGeometry(0.26, 18, 14), 'eye', sx, 2.38, 0.22); add(new THREE.SphereGeometry(0.12, 12, 10), 'pupil', sx * 1.05, 2.4, 0.46); }
    for (const [wx, wz] of [[-1.25, 1.25], [1.25, 1.25], [-1.25, -1.2], [1.25, -1.2]]) add(new THREE.CylinderGeometry(0.62, 0.62, 0.62, 22).rotateZ(Math.PI / 2), 'tyre', wx, 0.62, wz);
    g.position.set(x, 0, z); g.rotation.y = yaw; g.scale.setScalar(0.78); root.add(g); };
  kart(PK[0] + 3.1, H + 1.3, Math.PI / 2, 0); kart(PK[0] + 14.3, H + 1.3, -Math.PI / 2, 1); kart(-22, -2.7, Math.PI / 2, 0); kart(MX0 + 6 * SEG + 20, MZ - 2.5, Math.PI / 2, 1);

  onNote('Straßenmöbel (KayKit) …');
  flush();
  // ---------- KayKit Stadtmöbel, auf Knete umgestellt, Höhe gemessen und gesetzt ----------
  const loader = new GLTFLoader(), cache = new Map();
  const loadKK = n => { if (!cache.has(n)) cache.set(n, loader.loadAsync(KK(n)).then(g => g.scene).catch(e => { info.errors.push(n + ': ' + (e.message || e)); return null; })); return cache.get(n); };
  const propMats = new Map();
  const place = async (n, x, z, yaw, height) => { const src = await loadKK(n); if (!src) return; const o = src.clone(true);
    o.traverse(m => { if (!m.isMesh) return; m.castShadow = m.receiveShadow = true; const conv = s => { if (!propMats.has(s)) propMats.set(s, makeClayMaterial(THREE, U, { src: s, profile: { ...prof('prop', 0.5, K, QUIET), tools: TOOLMIX.curb, legacy: 0 } })); return propMats.get(s); };
      m.material = Array.isArray(m.material) ? m.material.map(conv) : conv(m.material); if (!m.geometry.attributes.claySeed) { m.geometry = m.geometry.clone(); seedGeometry(THREE, m.geometry, 600 + info.props); } });
    const b = new THREE.Box3().setFromObject(o), h = b.max.y - b.min.y, sc = height / (h || 1); o.scale.setScalar(sc); o.position.set(x, 0.34 - b.min.y * sc, z); o.rotation.y = yaw; root.add(o); info.props++; info.measured = info.measured || {}; info.measured[n] = +(h).toFixed(3); };
  const cx = H + 2.2, jobs = [];
  for (const [sx, sz, yaw] of [[1, 1, Math.PI], [-1, 1, -Math.PI / 2], [1, -1, Math.PI / 2], [-1, -1, 0]]) jobs.push(place('trafficlight_A', sx * (H + F + 2.4), sz * cx, yaw, 5.6));
  for (let x = 22; x < A - 4; x += 16) { jobs.push(place('streetlight', x, -(H + SW - 1.2), 0, 7.5)); jobs.push(place('streetlight', -x, H + SW - 1.2, Math.PI, 7.5)); }
  jobs.push(place('bench', -(H + 12), -(H + SW - 1.4), 0, 1.3), place('firehydrant', H + F + 5, -(H + 1.6), 0, 1.1), place('trash_A', -(H + F + 5), H + 1.6, 0, 1.4), place('trash_B', H + 1.6, -(H + 22), 0, 1.4));
  await Promise.all(jobs);

  // ---------- Kameras ----------
  const segX = i => MX0 + i * SEG + SEG / 2;
  const shots = {
    platz: { pos: new THREE.Vector3(-46, 52, 62), tgt: new THREE.Vector3(6, 0, 0) },
    zebra: { pos: new THREE.Vector3(H + 30, 5, -9), tgt: new THREE.Vector3(H + 10, 0, 1) },
    parken: { pos: new THREE.Vector3(PK[0] + 22, 9, H + 22), tgt: new THREE.Vector3(PK[0] + 14, 0, H + 1) },
    ampel: { pos: new THREE.Vector3(H + F + 12, 5.5, H + 12), tgt: new THREE.Vector3(H + F + 2, 3, cx) },
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
  const setWorld = key => { const Wd = WORLDS[key]; scene.background = new THREE.Color(Wd.sky); M.road.color.set(Wd.roadStreet); M.roadLegacy.color.set(Wd.roadStreet); M.accent.color.set(Wd.pad); M.table.color.set(Wd.table);
    M.rut.color.set(new THREE.Color(Wd.roadStreet).multiplyScalar(0.72)); M.kart0.color.set(Wd.kart[0]); M.kart1.color.set(Wd.kart[2]); };
  setWorld('otown'); shot('platz');
  let raf = 0, frames = 0, fT = performance.now();
  const loop = () => { raf = requestAnimationFrame(loop); controls.update(); composer.render(); frames++; const n = performance.now(); if (n - fT > 1000) { info.fps = Math.round(frames * 1000 / (n - fT)); frames = 0; fT = n; } };
  loop();
  return { info, STYLES, STYLE_ORDER, WORLDS, shot,
    set(k, v) { if (k === 'world') setWorld(v); else if (k === 'ao' && ao) ao.enabled = !!v; else if (k === 'roadMat') roadMeshes.forEach(o => o.material = v === 'legacy' ? M.roadLegacy : M.road); else if (k === 'debug') U.uClayDebug.value = v; },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); } };
}
