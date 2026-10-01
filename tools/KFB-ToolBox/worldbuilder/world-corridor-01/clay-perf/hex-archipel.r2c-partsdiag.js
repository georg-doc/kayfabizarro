/* WC1 Clay Parts diagnostic world.
 * Exact R2C world logic with imports redirected to the diagnostic v10 material only.
 * No geometry/world/layout changes.
 */
/* KFB World Core R2C · Hex-Archipel nach KayKit-Katalog (01.10.) — Basis R2A/R2B.
 * R2C: Bau-Logik wie KayKit Medieval Hexagon Pack (Promo + Nature Usage Guide): Höhenstufen = ganze Kachelhöhen (hex_grass + hex_grass_bottom),
 *   Übergang hex_grass_sloped_high, Polster hill_single_A–C an Stufenwänden, Berge/Hügel/Wälder je EINE Zelle (Fußabdruck innerhalb der Kachel).
 *   Katalogfarben aus dem Atlas gelesen und je Insel auf die KFB-Palette gelegt. Quaternius-Berge entfallen (brauner Saum).
 *   Strecke: Mindestradius 22 m, rot-weiß in festen 4,5 m je Bordkante mit exakten Schnittkanten.
 * Ursprünglich: KFB World Core R2A · Hex-Archipel (01.10.)
 * Prozedurale schwebende Hex-Inseln, verbunden durch eine Joyride-Strecke (Brückenbänder, Looping, Straßenprofil auf den Inseln).
 * Architektur nach Briefing 01.10.:
 *   1. Hex-Trägerstruktur: EINE gemeinsame Low-Poly-Geometrie je Kacheltyp, InstancedMesh, Farbe + Knet-Saat je Instanz.
 *      Keine Subdivision und keine eigene Knet-Kopie je Kachel. Knete kommt aus dem Shader (K2, lab-clay, unverändert).
 *   2. Terrain-Formen: wenige echte Formen (Rule of Three: 3 Hügel-, 3 Baum-Varianten), ebenfalls instanziert.
 *   3. Unterseite: EIN zusammenhängender Felskörper je Insel aus der äußeren Hex-Kontur, keine Hex-Säulen.
 * A/B-Prüfung: Bauweise A baut dieselbe Welt als Einzel-Meshes mit eigener, hoch aufgelöster und verformter Kopie je Kachel
 * (= HX1-Fall). Gleiche Kamera, Inseln, Strecke, Licht, Schatten. Messlauf misst ms/Bild GPU-synchron, Calls, Dreiecke.
 * Shader-Ergänzung (nur hier): bei Instanzen liest K2 Position/Normale im Instanzraum, sonst klebt das Muster an der Kachel. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayRelief } from '../baseline-source/lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, PROFILES, makePrintTexture } from './clay-material.v10-partsdiag.js';
import { makeGlobalClayPack } from './global-clay-pack.v1.js';
import { makeDerekRgbTexture } from './derek-rgb-pack.v1.js';
import { makePlainMaterial, makeGlobalClayLiteMaterial, makeDerekRgbMaterial } from './lightweight-materials.v1.js';
import { makeShadowFollow } from '../baseline-source/lab-world/shadow-fit.v1.js';
import { makeToolReliefs } from '../baseline-source/lab-clay/clay-relief.v4.js';
import { TOOLMIX } from '../baseline-source/lab-clay/clay-toolmix.v1.js';
import { SKY_PRESETS, makeSkyDome } from '../baseline-source/lab-world/sky-core.r0a.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const here = f => new URL(f, import.meta.url).href;
const HEXKIT = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/';
const LMK = { burg: ['buildings/red/building_castle_red.gltf', 1.35], utopia: ['buildings/blue/building_church_blue.gltf', 1.1], dystopia: ['buildings/yellow/building_mine_yellow.gltf', 1.15], protopia: ['buildings/green/building_windmill_green.gltf', 1.15] };

const D2R = Math.PI / 180, clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (i, j, k, s) => { let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1440662683) + Math.imul(s, 974711)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
function vn(x, y, z, s = 0) { const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), f = t => t * t * (3 - 2 * t), fx = f(x - X), fy = f(y - Y), fz = f(z - Z); let r = 0;
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) r += hash(X + a, Y + b, Z + c, s) * (a ? fx : 1 - fx) * (b ? fy : 1 - fy) * (c ? fz : 1 - fz); return r; }
const col = hex => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mulc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

/* ---------- Hex-Raster (spitz oben, axial q/r) ---------- */
const S = 10, AP = S * Math.sqrt(3) / 2, SK = 6;
const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];          // Richtung d ↔ Winkel 60·d
const key = (q, r) => q + ',' + r;
const hexXZ = (q, r) => [S * Math.sqrt(3) * (q + r / 2), S * 1.5 * r];
const hexDist = (q, r) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
function xzHex(x, z) { const fq = (Math.sqrt(3) / 3 * x - z / 3) / S, fr = (2 / 3 * z) / S, fs = -fq - fr;
  let q = Math.round(fq), r = Math.round(fr), s = Math.round(fs); const dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
  if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s; return [q, r]; }

export const PAL = {
  burg:     { grass: '#7cba48', grass2: '#6aa83c', paved: '#e8dcc6', sand: '#e3c98f', rock: '#9b6b4a', lip: '#5f9a38', hill: '#6fae40', water: '#5aa6d6' },
  utopia:   { grass: '#a6d7a8', grass2: '#bfe3b4', paved: '#f3ecdf', sand: '#f1dcb5', rock: '#cdb59a', lip: '#8cc497', hill: '#9ccf9e', water: '#7cc4e4' },
  dystopia: { grass: '#9a74cc', grass2: '#8a66bd', paved: '#d4c8da', sand: '#b591d9', rock: '#6e4a3a', lip: '#7a58aa', hill: '#8b66c2', water: '#5f8fae' },
  protopia: { grass: '#6aae3a', grass2: '#88b840', paved: '#e6d3a8', sand: '#d9b04a', rock: '#8a5634', lip: '#58932f', hill: '#5f9f34', water: '#4fa3c9' }
};
const MAIN = [
  { id: 'burg', label: 'Burg · King Kayfabian', pos: [0, 70, 0], rings: 4, pal: 'burg', water: 0, hills: 2, boards: [0, 2] },
  { id: 'utopia', label: 'A · Utopia', pos: [430, 30, -150], rings: 3, pal: 'utopia', water: 2, hills: 2, boards: [0] },
  { id: 'dystopia', label: 'B · Dystopia', pos: [170, -10, 430], rings: 3, pal: 'dystopia', water: 1, hills: 3, boards: [2, 2] },
  { id: 'protopia', label: 'C · Protopia', pos: [-420, 20, 170], rings: 3, pal: 'protopia', water: 3, hills: 3, boards: [1] }
];
const RING = ['burg', 'utopia', 'dystopia', 'LOOP', 'protopia'];
const POSTERS = [{ sub: 'Forget Utopia', pack: 'forget_utopia' }, { sub: 'Embrace Protopia', pack: 'embrace_protopia' }, { sub: 'MedKayfab', pack: 'medkayfab_cardiology' }];

/* ---------- Gemeinsame Geometrien (Low-Poly, einmal im Speicher) ---------- */
function hexOutline(nArc, rc = 1.8) { const out = [], ci = (AP - rc) / Math.cos(30 * D2R);
  for (let k = 0; k < 6; k++) { const a = (30 + 60 * k) * D2R, cx = Math.cos(a) * ci, cz = Math.sin(a) * ci;
    for (let j = 0; j < nArc; j++) { const th = a + (-30 + 60 * j / (nArc - 1)) * D2R; out.push([cx + rc * Math.cos(th), cz + rc * Math.sin(th)]); } }
  return out; }
function makeTile({ nArc = 3, Rt = 2, nB = 3, nS = 1, dish = false, noise = 0, seed = 1 } = {}) {
  const OL = hexOutline(nArc), M = OL.length, rB = 0.9, fT = 1 - rB / AP;
  const topY = f => dish ? -1.8 * (1 - sst(0.42, 0.9, f / fT)) : 0.22 * (1 - (f / fT) ** 2);
  const R = [];
  for (let i = 1; i <= Rt; i++) { const f = fT * i / Rt; R.push([f, topY(f), 1]); }
  for (let j = 1; j <= nB; j++) { const ph = Math.PI / 2 * j / nB; R.push([1 - (rB / AP) * (1 - Math.sin(ph)), -rB * (1 - Math.cos(ph)), 0]); }
  for (let j = 1; j <= nS; j++) R.push([1 - 0.02 * j / nS, -rB - (SK - rB) * j / nS, 0]);
  const pos = [0, topY(0) + (noise ? noise * (vn(0, 0, 0, seed) - 0.5) : 0), 0], idx = [];
  R.forEach(([f, y, top], i) => OL.forEach(([x, z]) => { let px = x * f, pz = z * f, py = y;
    if (noise) { if (top) py += noise * (vn(px * 0.35, i * 0.7, pz * 0.35, seed) - 0.5); const k = 1 + noise * 0.025 * (vn(px * 0.2 + 9, i, pz * 0.2, seed + 3) - 0.5); px *= k; pz *= k; }
    pos.push(px, py, pz); }));
  const v = (i, j) => 1 + i * M + (j % M);
  for (let j = 0; j < M; j++) idx.push(0, v(0, j + 1), v(0, j));
  for (let i = 0; i < R.length - 1; i++) for (let j = 0; j < M; j++) { const a = v(i, j), b = v(i, j + 1), c = v(i + 1, j), d = v(i + 1, j + 1); idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
function makePlate(nArc = 3) { const OL = hexOutline(nArc), M = OL.length, pos = [0, 0, 0], idx = [];
  OL.forEach(([x, z]) => pos.push(x * 0.74, 0, z * 0.74)); for (let j = 0; j < M; j++) idx.push(0, 1 + (j + 1) % M, 1 + j);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }
const clean = g => { for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') g.deleteAttribute(k); return g; };
const paint = (g, c) => { const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set(c, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
const ni = g => (g.index ? g.toNonIndexed() : g);
function blob(r, det, seed, amp = 0.12, sq = [1, 1, 1]) { let g = new THREE.IcosahedronGeometry(r, det); g.deleteAttribute('uv'); g.deleteAttribute('normal'); g = mergeVertices(g, 1e-4);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + amp * 2 * (vn(x / r * 1.7 + 3, y / r * 1.7, z / r * 1.7, seed) - 0.5); p.setXYZ(i, x * k * sq[0], y * k * sq[1], z * k * sq[2]); }
  g.computeVertexNormals(); return g; }
function lathe(pts, seg, seed, amp) { let g = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg); g.deleteAttribute('uv'); g.deleteAttribute('normal'); g = mergeVertices(g, 1e-4);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z); if (r < 1e-3) continue; const a = Math.atan2(z, x), k = 1 + amp * 2 * (vn(Math.cos(a) * 1.6 + 5, y * 1.3, Math.sin(a) * 1.6, seed) - 0.5); p.setX(i, x * k); p.setZ(i, z * k); }
  g.computeVertexNormals(); return g; }
function makeHill(v, hi) { const seg = hi ? 48 : 14, rows = hi ? 24 : 6, P = [];
  if (v === 1) [[1.04, -0.2], [1, 0], [0.95, 0.5], [0.82, 0.86], [0.55, 1], [0, 1.02]].forEach(p => P.push(p));
  else for (let i = 0; i <= rows; i++) { const ph = i / rows * Math.PI / 2; P.push([Math.max(0.001, Math.cos(ph)) * 1.04, Math.sin(ph) ** (v === 2 ? 0.8 : 1.15) - (i ? 0 : 0.2)]); }
  if (hi && v === 1) { const Q = []; for (let i = 0; i < P.length - 1; i++) for (let k = 0; k < 4; k++) Q.push([lerp(P[i][0], P[i + 1][0], k / 4), lerp(P[i][1], P[i + 1][1], k / 4)]); Q.push(P[P.length - 1]); P.length = 0; P.push(...Q); }
  return lathe(P, seg, 40 + v, v === 2 ? 0.16 : 0.08); }
function makeTree(v, hi) { const det = hi ? 3 : 1, seg = hi ? 16 : 7, parts = [], trunk = col('#7a4a2c');
  const h = v === 2 ? 6.5 : 4.2, tr = new THREE.CylinderGeometry(0.38, 0.6, h, seg, 1); tr.translate(0, h / 2 - 0.4, 0); parts.push(paint(clean(tr), trunk));
  if (v === 0) { const c = col('#2a8a45'); [[3.4, 3.0, 1], [5.6, 2.5, 0.78]].forEach(([y, s, k], i) => { const b = lathe([[0.01, 0], [3.0, 0.25], [3.25, 0.9], [2.4, 2.4], [0.01, 3.3]], seg + 3, 60 + i, 0.07); b.scale(k, k, k); b.translate(0, y, 0); parts.push(paint(clean(b), c)); }); }
  else if (v === 1) { const b = blob(2.9, det, 71, 0.13, [1, 0.86, 1]); b.translate(0, 5.6, 0); parts.push(paint(clean(b), col('#1f7a3e'))); }
  else { const c = col('#b5b04a'); [[0, 7.2, 0, 1.9], [1.3, 6.2, 0.6, 1.5], [-1.1, 6.4, -0.7, 1.4]].forEach(([x, y, z, r], i) => { const b = blob(r, det, 80 + i, 0.12); b.translate(x, y, z); parts.push(paint(clean(b), mulc(c, 1 - i * 0.06))); }); }
  return mergeGeometries(parts.map(ni)); }
function makeRock(hi, seed = 5) { const g = blob(1, hi ? 3 : 1, seed, 0.22, [1.2, 0.7, 1]); return clean(g); }
function makeCloud(L, seed, det) {
  const r = rng(seed * 97 + 3), n = 3 + Math.floor(r() * 3), lumps = [];
  for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : i / (n - 1) - 0.5, rad = L * (0.2 + 0.13 * (1 - Math.abs(t) * 1.6)) * (0.85 + r() * 0.3); lumps.push([t * L * 0.62, rad * (0.15 + r() * 0.25), (r() - 0.5) * L * 0.18, rad]); }
  const yb = -L * 0.07, k = L * 0.09, smin = (a, b) => { const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return lerp(b, a, h) - k * h * (1 - h); };
  const sdf = (x, y, z) => { let d = 1e9; for (const [cx, cy, cz, rd] of lumps) d = smin(d, Math.hypot(x - cx, (y - cy) * 1.12, z - cz) - rd); const hb = yb - y, kk = L * 0.03, h = clamp(0.5 - 0.5 * (hb - d) / kk, 0, 1); return lerp(hb, d, h) + kk * h * (1 - h); };
  const g = new THREE.IcosahedronGeometry(1, det), p = g.attributes.position, c0 = [0, L * 0.05, 0];
  for (let i = 0; i < p.count; i++) { const dx = p.getX(i) * L * 0.6, dy = p.getY(i) * L * 0.3, dz = p.getZ(i) * L * 0.3, dl = Math.hypot(dx, dy, dz), ux = dx / dl, uy = dy / dl, uz = dz / dl;
    let lo = 0, hi = L; for (let s = 0; s < 20; s++) { const m = (lo + hi) / 2; if (sdf(c0[0] + ux * m, c0[1] + uy * m, c0[2] + uz * m) < 0) lo = m; else hi = m; } p.setXYZ(i, c0[0] + ux * lo, c0[1] + uy * lo, c0[2] + uz * lo); }
  g.deleteAttribute('uv'); g.deleteAttribute('normal'); const m = mergeVertices(g, 1e-3); m.computeVertexNormals(); return m; }
function makeFrame() {   // Knet-Billboard: Rundrahmen 12 × 6 m Bildfläche, Rückplatte, zwei Pfosten
  const rr = (s, w, h, r) => { const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  const sh = rr(new THREE.Shape(), 13.4, 7.4, 1.0); sh.holes.push(rr(new THREE.Path(), 12, 6, 0.5));
  const fr = new THREE.ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.28, bevelSegments: 3, curveSegments: 5 }); fr.translate(0, 8.6, -0.1);
  const back = new THREE.BoxGeometry(12.6, 6.6, 0.3); back.translate(0, 8.6, -0.05);
  const p1 = new THREE.CylinderGeometry(0.42, 0.5, 6.2, 8); p1.translate(-3.6, 3.0, -0.25); const p2 = p1.clone(); p2.translate(7.2, 0, 0);
  return mergeGeometries([paint(clean(fr), col('#8a4a24')), paint(clean(back), col('#5b3219')), paint(clean(p1), col('#3a2a20')), paint(clean(p2), col('#3a2a20'))].map(ni)); }
function makeCastle() { const parts = [], wall = col('#e6dac4'), tow = col('#d8c9ae'), roof = col('#e0552a'), dark = col('#2a2220');
  const box = (w, h, d, x, y, z, c) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); parts.push(paint(clean(g), c)); };
  const cyl = (r, h, x, y, z, c) => { const g = new THREE.CylinderGeometry(r, r * 1.06, h, 12); g.translate(x, y, z); parts.push(paint(clean(g), c)); };
  const cone = (r, h, x, y, z, c, seg = 12) => { const g = new THREE.ConeGeometry(r, h, seg); g.translate(x, y, z); parts.push(paint(clean(g), c)); };
  box(12, 18, 12, 0, 9, 0, wall); cone(10, 9, 0, 22.5, 0, roof, 4);
  for (const [x, z] of [[-10, -10], [10, -10], [-10, 10], [10, 10]]) { cyl(3.2, 15, x, 7.5, z, tow); cone(4.1, 7, x, 18.5, z, roof); }
  box(20, 8, 2, 0, 4, -10, wall); box(20, 8, 2, 0, 4, 10, wall); box(2, 8, 20, -10, 4, 0, wall); box(2, 8, 20, 10, 4, 0, wall);
  box(4.4, 5.6, 0.6, 0, 2.8, 11.1, dark); cyl(0.12, 6, 0, 30, 0, dark); box(2.6, 1.6, 0.12, 1.3, 32, 0, roof);
  return mergeGeometries(parts.map(ni)); }

/* ---------- Insel-Generator ---------- */
function genCells(rings, seed, minR = 1) { const set = new Map();
  for (let q = -rings - 1; q <= rings + 1; q++) for (let r = -rings - 1; r <= rings + 1; r++) { const d = hexDist(q, r); if (d > rings + 1) continue;
    const n = vn(q * 0.55 + 3.1, r * 0.55 - 1.7, 0.5, seed); if (d <= minR || d + (n - 0.5) * 2.4 < rings + 0.2) set.set(key(q, r), { q, r }); }
  const keep = new Map(), st = [[0, 0]]; while (st.length) { const [q, r] = st.pop(), k = key(q, r); if (keep.has(k) || !set.has(k)) continue; keep.set(k, set.get(k)); for (const [a, b] of DIRS) st.push([q + a, r + b]); }
  for (let it = 0; it < 2; it++) for (let q = -rings - 1; q <= rings + 1; q++) for (let r = -rings - 1; r <= rings + 1; r++) { const k = key(q, r); if (keep.has(k)) continue;
    if (DIRS.filter(([a, b]) => keep.has(key(q + a, r + b))).length >= 4) keep.set(k, { q, r }); }
  return keep; }
function finishCells(cmap) { for (const c of cmap.values()) { [c.x, c.z] = hexXZ(c.q, c.r); c.edge = DIRS.some(([a, b]) => !cmap.has(key(c.q + a, c.r + b))); c.lift = c.lift || 0; c.type = c.type || 'grass'; } }
function bfsDist(cmap, src) { const D = new Map(), qu = []; for (const c of src) { D.set(key(c.q, c.r), 0); qu.push(c); }
  while (qu.length) { const c = qu.shift(), d = D.get(key(c.q, c.r)); for (const [a, b] of DIRS) { const k = key(c.q + a, c.r + b); if (cmap.has(k) && !D.has(k)) { D.set(k, d + 1); qu.push(cmap.get(k)); } } } return D; }

/* Felskörper: äußere Kontur der Hexfläche → geglättet → Lippe, Wulst, Profilkurve (vanAchen-Anatomie aus R1A), Nebenzapfen */
const PROF = [[0.03, 1.0], [0.08, 1.02], [0.16, 1.0], [0.26, 0.93], [0.36, 0.82], [0.46, 0.68], [0.56, 0.6], [0.66, 0.56], [0.76, 0.45], [0.86, 0.33], [0.94, 0.2]];
function rockBody(cells, pal, seed, depthK, P0) {
  const has = new Set(cells.map(c => key(c.q, c.r))), next = new Map(), pts = new Map(), ck = (x, z) => Math.round(x * 100) + ':' + Math.round(z * 100);
  for (const c of cells) for (let d = 0; d < 6; d++) { const [dq, dr] = DIRS[d]; if (has.has(key(c.q + dq, c.r + dr))) continue;
    const a0 = (60 * d - 30) * D2R, a1 = (60 * d + 30) * D2R, A = [c.x + S * Math.cos(a0), c.z + S * Math.sin(a0)], B = [c.x + S * Math.cos(a1), c.z + S * Math.sin(a1)];
    next.set(ck(...A), ck(...B)); pts.set(ck(...A), A); pts.set(ck(...B), B); }
  let loop = []; const seen = new Set();
  for (const k0 of next.keys()) { if (seen.has(k0)) continue; const L = []; let k = k0, g = 0; while (k !== undefined && !seen.has(k) && g++ < 20000) { seen.add(k); L.push(pts.get(k)); k = next.get(k); } if (L.length > loop.length) loop = L; }
  for (let it = 0; it < 2; it++) { const Q = []; for (let i = 0; i < loop.length; i++) { const a = loop[i], b = loop[(i + 1) % loop.length]; Q.push([lerp(a[0], b[0], 0.25), lerp(a[1], b[1], 0.25)], [lerp(a[0], b[0], 0.75), lerp(a[1], b[1], 0.75)]); } loop = Q; }
  const cum = [0]; for (let i = 1; i <= loop.length; i++) cum.push(cum[i - 1] + Math.hypot(loop[i % loop.length][0] - loop[i - 1][0], loop[i % loop.length][1] - loop[i - 1][1]));
  const M = clamp(Math.round(cum[loop.length] / 3), 36, 160), Lp = []; let si = 0;
  for (let k = 0; k < M; k++) { const s = k / M * cum[loop.length]; while (cum[si + 1] < s) si++; const t = (s - cum[si]) / (cum[si + 1] - cum[si] || 1), a = loop[si], b = loop[(si + 1) % loop.length]; Lp.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]); }
  let area = 0; for (let i = 0; i < M; i++) { const a = Lp[i], b = Lp[(i + 1) % M]; area += a[0] * b[1] - b[0] * a[1]; }
  const sg = area > 0 ? 1 : -1, N = Lp.map((p, i) => { const a = Lp[(i - 1 + M) % M], b = Lp[(i + 1) % M], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1; return [sg * tz / l, -sg * tx / l]; });
  const c = [Lp.reduce((s, p) => s + p[0], 0) / M, Lp.reduce((s, p) => s + p[1], 0) / M], meanR = Lp.reduce((s, p) => s + Math.hypot(p[0] - c[0], p[1] - c[1]), 0) / M;
  const r0 = rng(seed), depth = depthK * 2 * meanR, tip = [(r0() - 0.5) * 0.5 * meanR, (r0() - 0.5) * 0.5 * meanR];
  const rock = col(pal.rock), lip = col(pal.lip), rings = [], off = (o, y) => Lp.map((p, i) => [p[0] + N[i][0] * o, y, p[1] + N[i][1] * o]);
  rings.push([off(-1.6, -1.3), mulc(rock, 0.55)], [off(0.6, -0.65), lip], [off(1.6, -0.35), lip], [off(2.4, -1.5), mixc(lip, rock, 0.6)]);
  const side = off(2.0, -3.3); rings.push([side, rock]);
  PROF.forEach(([u, s], li) => { const amp = 0.07 * sst(0, 0.15, u), tp = [tip[0] * u ** 1.6, tip[1] * u ** 1.6];
    rings.push([side.map(p => { const dx = p[0] - c[0], dz = p[2] - c[1], a = Math.atan2(dz, dx), ca = Math.cos(a), sa = Math.sin(a);
      const nn = 1 + amp * 2 * (vn(ca * 2.3 + li * 0.37, sa * 2.3, u * 5, seed) - 0.5) + amp * (vn(ca * 6, sa * 6, u * 9, seed + 1) - 0.5);
      return [c[0] + dx * s * nn + tp[0], -3.3 - u * depth + depth * 0.04 * (vn(ca * 3, sa * 3, li, seed + 2) - 0.5), c[1] + dz * s * nn + tp[1]]; }), mulc(rock, 1 - 0.38 * u)]); });
  const pos = [c[0], -1.3, c[1]], cols = [...mulc(rock, 0.55)], idx = [];
  rings.forEach(([R, cc]) => R.forEach(p => { pos.push(...p); cols.push(...cc); }));
  const tipI = pos.length / 3; pos.push(c[0] + tip[0], -3.3 - depth, c[1] + tip[1]); cols.push(...mulc(rock, 0.6));
  const v = (i, j) => 1 + i * M + (j % M);
  for (let j = 0; j < M; j++) idx.push(0, v(0, j + 1), v(0, j));
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < M; j++) { const a = v(i, j), b = v(i, j + 1), cc = v(i + 1, j), d = v(i + 1, j + 1); idx.push(a, b, cc, b, d, cc); }
  for (let j = 0; j < M; j++) idx.push(v(rings.length - 1, j), v(rings.length - 1, j + 1), tipI);
  let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.setIndex(idx); g.computeVertexNormals();
  const parts = [g.toNonIndexed()], nz = depthK > 0.85 ? 1 : 2 + Math.floor(r0() * 2);
  for (let k = 0; k < nz; k++) { const u0 = 0.34 + r0() * 0.26, rb = (0.1 + r0() * 0.07) * meanR, len = (0.13 + r0() * 0.2) * 2 * meanR, phi = (k / nz + r0() * 0.2) * Math.PI * 2, rho = (0.3 + r0() * 0.3) * meanR * 0.6;
    const cn = new THREE.ConeGeometry(rb, len, 7, 2, true); cn.rotateX(Math.PI); cn.translate(c[0] + tip[0] * u0 ** 1.6 + Math.cos(phi) * rho, -3.3 - u0 * depth + rb * 0.5 - len / 2, c[1] + tip[1] * u0 ** 1.6 + Math.sin(phi) * rho);
    clean(cn); cn.computeVertexNormals(); parts.push(paint(cn, mulc(rock, 0.72)).toNonIndexed()); }
  g = mergeGeometries(parts); g.translate(P0[0], P0[1], P0[2]); return { geo: g, meanR, depth }; }

/* ---------- Fremd-Assets: Zerlegen, Glätten, Normieren ---------- */
function sceneParts(scene, keepUV) { scene.updateMatrixWorld(true); const parts = [];
  scene.traverse(o => { if (!o.isMesh) return; const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); for (const k of Object.keys(g.attributes)) if (!(k === 'position' || k === 'normal' || (keepUV && k === 'uv'))) g.deleteAttribute(k);
    parts.push({ geo: g, name: (o.material && o.material.name) || '', map: (o.material && o.material.map) || null }); }); return parts; }
const onlyPos = g => { const o = new THREE.BufferGeometry(); o.setAttribute('position', g.attributes.position.clone()); if (g.index) o.setIndex(g.index.clone()); return mergeVertices(o, 1e-3); };
function subGeo(g, tris) { const P = g.attributes.position, idx = g.index.array, mp = new Map(), pos = [], ind = [];
  for (const t of tris) for (let k = 0; k < 3; k++) { const v = idx[t * 3 + k]; if (!mp.has(v)) { mp.set(v, pos.length / 3); pos.push(P.getX(v), P.getY(v), P.getZ(v)); } ind.push(mp.get(v)); }
  const o = new THREE.BufferGeometry(); o.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); o.setIndex(ind); return o; }
function components(g) { const idx = g.index.array, n = g.attributes.position.count, par = new Int32Array(n); for (let i = 0; i < n; i++) par[i] = i;
  const f = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let i = 0; i < idx.length; i += 3) { const a = f(idx[i]); par[f(idx[i + 1])] = a; par[f(idx[i + 2])] = a; }
  const G = new Map(); for (let i = 0; i < idx.length; i += 3) { const r = f(idx[i]); if (!G.has(r)) G.set(r, []); G.get(r).push(i / 3); }
  return [...G.values()].map(t => subGeo(g, t)); }
function taubin(g, it = 3, lam = 0.5, mu = -0.53) { const P = g.attributes.position, n = P.count, idx = g.index.array, nb = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < idx.length; i += 3) { const a = idx[i], b = idx[i + 1], c = idx[i + 2]; nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  for (let k = 0; k < it * 2; k++) { const w = k % 2 ? mu : lam, cur = P.array.slice();
    for (let v = 0; v < n; v++) { const m = nb[v].size; if (!m) continue; let x = 0, y = 0, z = 0; for (const u of nb[v]) { x += cur[u * 3]; y += cur[u * 3 + 1]; z += cur[u * 3 + 2]; }
      P.array[v * 3] = cur[v * 3] + w * (x / m - cur[v * 3]); P.array[v * 3 + 1] = cur[v * 3 + 1] + w * (y / m - cur[v * 3 + 1]); P.array[v * 3 + 2] = cur[v * 3 + 2] + w * (z / m - cur[v * 3 + 2]); } }
  P.needsUpdate = true; return g; }
function cloudVariants(scene) { const parts = sceneParts(scene); if (!parts.length) return null; const g = onlyPos(parts.length > 1 ? mergeGeometries(parts.map(p => p.geo.index ? p.geo.toNonIndexed() : p.geo)) : parts[0].geo);
  const comps = components(g).filter(c => c.attributes.position.count >= 40).sort((a, b) => b.attributes.position.count - a.attributes.position.count).slice(0, 5);
  return comps.map(c => { taubin(c, 3); c.computeBoundingBox(); const b = c.boundingBox, half = Math.max(b.max.x - b.min.x, b.max.z - b.min.z) / 2 || 1;
    c.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, -(b.min.z + b.max.z) / 2); c.scale(45 / half, 45 / half, 45 / half); c.computeVertexNormals(); return c; }); }
function peakVariants(scene) { const PC = { stone: col('#a39486'), snow: col('#f6f1e7'), dirt: col('#86603f') };
  const tagged = sceneParts(scene).map(p => ({ k: /snow/i.test(p.name) ? 'snow' : /dirt/i.test(p.name) ? 'dirt' : 'stone', comps: components(onlyPos(p.geo)) }));
  const box = g => { g.computeBoundingBox(); return g.boundingBox; }, size = g => box(g).getSize(new THREE.Vector3()).length(), ctr = g => box(g).getCenter(new THREE.Vector3());
  const stones = tagged.filter(t => t.k === 'stone').flatMap(t => t.comps); if (!stones.length) return null; const dmax = Math.max(...stones.map(size));
  const big = stones.filter(g => size(g) >= 0.3 * dmax), groups = big.map(g => [paint(g, PC.stone)]);
  const assign = (g, c) => { const p = ctr(g); let bi = 0, bd = 1e9; big.forEach((b, i) => { const q = ctr(b), d = Math.hypot(p.x - q.x, p.z - q.z); if (d < bd) { bd = d; bi = i; } }); groups[bi].push(paint(g, c)); };
  stones.filter(g => !big.includes(g)).forEach(g => assign(g, PC.stone)); tagged.filter(t => t.k !== 'stone').forEach(t => t.comps.forEach(g => assign(g, PC[t.k])));
  return groups.map(gs => { const g = mergeGeometries(gs), b = box(g), c = b.getCenter(new THREE.Vector3()); g.translate(-c.x, -b.min.y, -c.z); const P = g.attributes.position; let rm = 0;
    for (let i = 0; i < P.count; i++) rm = Math.max(rm, Math.hypot(P.getX(i), P.getZ(i))); const k = 1 / (rm || 1); g.scale(k, k, k); g.computeVertexNormals(); g.computeBoundingBox(); return { geo: g, h: g.boundingBox.max.y }; })
    .sort((a, b) => b.h - a.h).slice(0, 4); }

/* ---------- Katalog: KayKit Medieval Hexagon Pack 1.0 FREE (Repo main, Assets/gltf) ---------- */
const NAT = 'decoration/nature/';
export const KAY = { tile: 'tiles/base/hex_grass', bottom: 'tiles/base/hex_grass_bottom', ramp: 'tiles/base/hex_grass_sloped_high', water: 'tiles/base/hex_water',
  ...Object.fromEntries(['mountain_A', 'mountain_B', 'mountain_C', 'mountain_A_grass', 'mountain_B_grass_trees', 'mountain_C_grass', 'hills_A', 'hills_A_trees', 'hills_B_trees', 'hills_C',
    'hill_single_A', 'hill_single_B', 'hill_single_C', 'trees_A_small', 'trees_A_medium', 'trees_B_medium', 'trees_B_large', 'tree_single_A', 'tree_single_B',
    'rock_single_A', 'rock_single_B', 'rock_single_C', 'rock_single_D', 'rock_single_E'].map(n => [n, NAT + n])) };
const SETS = {   // Rule of Three je Insel
  burg:     { mtn: ['mountain_A', 'mountain_B_grass_trees'], hill: ['hills_A', 'hills_B_trees'], tree: ['trees_A_medium', 'trees_B_medium', 'tree_single_A'], rock: ['rock_single_A', 'rock_single_C', 'rock_single_E'] },
  utopia:   { mtn: ['mountain_A_grass', 'mountain_C_grass'], hill: ['hills_A_trees', 'hills_C'], tree: ['trees_A_small', 'trees_A_medium', 'tree_single_B'], rock: ['rock_single_B', 'rock_single_D', 'rock_single_E'] },
  dystopia: { mtn: ['mountain_B', 'mountain_C', 'mountain_A'], hill: ['hills_C', 'hills_A'], tree: ['trees_B_large', 'trees_B_medium', 'tree_single_A'], rock: ['rock_single_A', 'rock_single_B', 'rock_single_C'] },
  protopia: { mtn: ['mountain_C_grass', 'mountain_B_grass_trees'], hill: ['hills_B_trees', 'hills_A_trees'], tree: ['trees_A_medium', 'trees_B_large', 'tree_single_B'], rock: ['rock_single_C', 'rock_single_D', 'rock_single_E'] } };
const PADS = ['hill_single_A', 'hill_single_B', 'hill_single_C'];
const LV = AP;      // eine Höhenstufe = eine Kachelhöhe (hex_grass −1…0, hex_grass_sloped_high steigt 0…1)
const RMIN = 22;    // Mindestradius der Strecke in m (Halbbreite 7,6 m + Rand)
function relaxMinR(pts, { closed = false, fixed = () => false, Rmin = 20, step = 2, iters = 500 } = {}) {
  const n = pts.length, at = i => closed ? pts[((i % n) + n) % n] : pts[clamp(i, 0, n - 1)];
  const rad = (a, b, c) => { const ab = Math.hypot(b[0] - a[0], b[1] - a[1]), bc = Math.hypot(c[0] - b[0], c[1] - b[1]), ca = Math.hypot(a[0] - c[0], a[1] - c[1]), A2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])); return A2 < 1e-9 ? 1e9 : ab * bc * ca / (2 * A2); };
  for (let it = 0; it < iters; it++) { let bad = 0;
    for (let i = 0; i < n; i++) { if (!closed && (i < step || i >= n - step)) continue; if (fixed(i) || rad(at(i - step), pts[i], at(i + step)) >= Rmin) continue; bad++;
      for (let j = i - step; j <= i + step; j++) { const jj = closed ? ((j % n) + n) % n : j; if (!closed && (jj <= 0 || jj >= n - 1)) continue; if (fixed(jj)) continue;
        const a = at(jj - 1), b = at(jj + 1), p = pts[jj]; p[0] = lerp(p[0], (a[0] + b[0]) / 2, 0.5); p[1] = lerp(p[1], (a[1] + b[1]) / 2, 0.5); } }
    if (!bad) return it; }
  return iters; }

/* ---------- Welt ---------- */
function genWorld(seed, X = {}) {
  const R = rng(seed * 7919 + 13), NC = X.nCloud || 3, W = { islands: [], items: [], clouds: [], boards: [], rocksGeo: [], labels: [], cellsAll: [], relax: 0 };
  const byId = Object.fromEntries(MAIN.map(m => [m.id, m])), order = RING.filter(x => x !== 'LOOP'), rot6 = () => Math.floor(R() * 6) * Math.PI / 3, sd = () => [R(), R(), R()];
  for (const spec of MAIN) {
    const ii = order.indexOf(spec.id), prev = byId[order[(ii - 1 + order.length) % order.length]], next = byId[order[(ii + 1) % order.length]], pal = PAL[spec.pal], set = SETS[spec.id], iseed = (seed * 31 + ii * 977) | 0;
    const cmap = genCells(spec.rings, iseed); finishCells(cmap);
    const dirTo = o => { const dx = o.pos[0] - spec.pos[0], dz = o.pos[2] - spec.pos[2], l = Math.hypot(dx, dz); return [dx / l, dz / l]; };
    const pickEdge = (dv, not) => { let best = null, bs = -1e9; for (const c of cmap.values()) { if (not && hexDist(c.q - not.q, c.r - not.r) < 3) continue; for (let d = 0; d < 6; d++) { const [a, b] = DIRS[d]; if (cmap.has(key(c.q + a, c.r + b))) continue;
        const ex = Math.cos(60 * d * D2R), ez = Math.sin(60 * d * D2R), s = ex * dv[0] + ez * dv[1] + 0.004 * Math.hypot(c.x, c.z); if (s > bs) { bs = s; best = { c, ex, ez }; } } } return best; };
    let ap = Math.atan2(dirTo(prev)[1], dirTo(prev)[0]), an = Math.atan2(dirTo(next)[1], dirTo(next)[0]); const df = ((an - ap + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    if (Math.abs(df) < 2.1) { const dl = (2.1 - Math.abs(df)) / 2, sg = Math.sign(df) || 1; ap -= sg * dl; an += sg * dl; }
    const ent = pickEdge([Math.cos(ap), Math.sin(ap)]), ext = pickEdge([Math.cos(an), Math.sin(an)], ent.c) || pickEdge([Math.cos(an), Math.sin(an)]);
    /* Inselweg als eine Bézier-Kurve: rein senkrecht zur Eingangskante, raus senkrecht zur Ausgangskante (keine Kehre an den Enden) */
    const V3 = ([x, z]) => new THREE.Vector3(x, 0, z), p0 = [ent.c.x + ent.ex * (AP + 4), ent.c.z + ent.ez * (AP + 4)], p3 = [ext.c.x + ext.ex * (AP + 4), ext.c.z + ext.ez * (AP + 4)], Ld = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    const cv = new THREE.CubicBezierCurve3(V3(p0), V3([p0[0] - ent.ex * Ld * 0.5, p0[1] - ent.ez * Ld * 0.5]), V3([p3[0] - ext.ex * Ld * 0.5, p3[1] - ext.ez * Ld * 0.5]), V3(p3)), n = Math.ceil(cv.getLength() / 2), line = [];
    for (let i = 0; i <= n; i++) { const p = cv.getPointAt(i / n); line.push([p.x, p.z]); }
    W.relax = Math.max(W.relax, relaxMinR(line, { Rmin: RMIN + 2, fixed: i => i < 2 || i > line.length - 3 }));
    for (const [x, z] of line) { const [q0, r0] = xzHex(x, z); for (const [a, b] of [[0, 0], ...DIRS]) { const q = q0 + a, r = r0 + b, [cx, cz] = hexXZ(q, r), d = Math.hypot(cx - x, cz - z);
      if (d < 9.6) { const k = key(q, r); if (!cmap.has(k)) cmap.set(k, { q, r }); cmap.get(k).type = 'paved'; cmap.get(k).path = true; } } }
    finishCells(cmap);
    const cells = [...cmap.values()], dP = bfsDist(cmap, cells.filter(c => c.path)); cells.forEach(c => c.dP = dP.get(key(c.q, c.r)) ?? 9);
    const free = c => !c.path && c.dP >= 2 && !c.used, inner = c => free(c) && !c.edge, nb = (c, d) => cmap.get(key(c.q + DIRS[d][0], c.r + DIRS[d][1]));
    const by = (arr, f) => arr.slice().sort((a, b) => f(b) - f(a)), clear = (x, z, m) => line.every(([lx, lz]) => Math.hypot(lx - x, lz - z) > m);
    const lm = by(cells.filter(inner), c => c.dP * 2 - Math.hypot(c.x, c.z) / S)[0], groups = [];
    if (lm) { lm.used = 'landmark'; lm.type = 'paved';
      if (spec.id === 'burg') { const grp = [lm]; lm.lv = 1; for (let d = 0; d < 6; d++) { const c = nb(lm, d); if (c && !c.path && c.dP >= 2 && !c.used) { c.used = 'plaza'; c.type = 'paved'; c.lv = 1; grp.push(c); } } groups.push(grp); } }
    const water = [], cand = cells.filter(c => inner(c) && !(lm && hexDist(c.q - lm.q, c.r - lm.r) < 2));
    if (spec.water && cand.length) { let w = cand[Math.floor(R() * cand.length)]; while (w && water.length < spec.water) { w.used = 'water'; w.type = 'water'; water.push(w);
      w = DIRS.map(([a, b]) => cmap.get(key(w.q + a, w.r + b))).find(c => c && inner(c) && !(lm && hexDist(c.q - lm.q, c.r - lm.r) < 2)); } }
    const nPl = (spec.id === 'burg' ? 1 : 0) + 1 + (R() < 0.5 ? 1 : 0);
    for (const s0 of by(cells.filter(inner), c => vn(c.q * 0.8 + 11, c.r * 0.8, 1, iseed))) { if (groups.length >= nPl) break;
      if (s0.used || [0, 1, 2, 3, 4, 5].some(d => { const n2 = nb(s0, d); return n2 && n2.lv; })) continue;
      const grp = [s0]; s0.lv = 1; s0.used = 'plateau'; const want = 2 + Math.floor(R() * 3);
      for (let g = 0; g < 16 && grp.length < want; g++) { const b = grp[Math.floor(R() * grp.length)], n2 = nb(b, Math.floor(R() * 6)); if (n2 && free(n2) && !n2.used) { n2.lv = 1; n2.used = 'plateau'; grp.push(n2); } }
      groups.push(grp); }
    cells.forEach(c => { c.lift = c.lv ? LV : 0; });
    for (const grp of groups) { let ramp = false;
      for (const c of grp) for (let d = 0; d < 6; d++) { const n2 = nb(c, d); if (!n2 || n2.lv || n2.path || (n2.used && n2.used !== 'pad')) continue; const th = ((d + 3) % 6) * Math.PI / 3;
        if (!ramp && !n2.edge && n2.dP >= 1 && !n2.used) { n2.used = 'ramp'; n2.rampTh = th; ramp = true; continue; }
        if (R() < 0.55) { n2.used = 'pad'; (n2.pads = n2.pads || []).push(th); } } }
    by(cells.filter(c => !c.path && c.dP >= 2 && (!c.used || c.used === 'plateau')), c => (c.edge ? 1 : 0) + (c.lv ? 0.6 : 0) + vn(c.q * 1.7, c.r * 1.7, 9, iseed)).slice(0, spec.id === 'dystopia' ? 3 : 2)
      .forEach((c, i) => { c.used = c.used === 'plateau' ? 'plateau · berg' : 'berg'; W.items.push({ cat: 'mtn', a: set.mtn[i % set.mtn.length], pal: spec.pal, x: c.x + spec.pos[0], y: spec.pos[1] + c.lift, z: c.z + spec.pos[2], rot: rot6(), s: 1, tint: [1, 1, 1], seed: sd(), island: spec.id }); });
    by(cells.filter(free), c => vn(c.q * 1.3, c.r * 1.3, 4, iseed)).slice(0, spec.hills)
      .forEach((c, i) => { c.used = 'hügel'; W.items.push({ cat: 'hill', a: set.hill[i % set.hill.length], pal: spec.pal, x: c.x + spec.pos[0], y: spec.pos[1], z: c.z + spec.pos[2], rot: rot6(), s: 1, tint: [1, 1, 1], seed: sd(), island: spec.id }); });
    const sideCells = []; for (const t of [0.3, 0.7]) sideCells.push(Math.floor(line.length * t));
    spec.boards.forEach((tex, bi) => { const li = sideCells[bi % 2], p = line[li], q = line[Math.min(line.length - 1, li + 2)], tx = q[0] - p[0], tz = q[1] - p[1], l = Math.hypot(tx, tz) || 1;
      for (const sgn of bi % 2 ? [-1, 1] : [1, -1]) { const bx = p[0] - tz / l * 13.5 * sgn, bz = p[1] + tx / l * 13.5 * sgn, [hq, hr] = xzHex(bx, bz), c = cmap.get(key(hq, hr));
        if (!c || c.path || c.used || c.lift) continue; c.used = 'board';
        W.boards.push({ x: bx + spec.pos[0], y: spec.pos[1] + 0.1, z: bz + spec.pos[2], rot: Math.atan2(p[0] - bx, p[1] - bz), tex, seed: sd() }); break; } });
    const g1 = col(pal.grass), g2 = col(pal.grass2), ratio = [g2[0] / g1[0], g2[1] / g1[1], g2[2] / g1[2]];
    for (const c of cells) { const wx = c.x + spec.pos[0], wz = c.z + spec.pos[2], y0 = spec.pos[1], y = y0 + c.lift, nn = vn(c.q * 0.7, c.r * 0.7, 2, iseed);
      if (c.type === 'grass' && c.edge && !c.used && vn(c.q * 1.1 + 4, c.r * 1.1, 3, iseed) > 0.55) c.type = 'sand';
      const ov = c.type === 'paved' ? 'paved' : c.type === 'sand' || c.type === 'water' ? 'sand' : '', kb = 0.97 + R() * 0.06;
      const tint = ov ? [kb, kb, kb] : mulc(mixc([1, 1, 1], ratio, sst(0.35, 0.65, nn)), kb), base = { pal: spec.pal, ov, tint, island: spec.id, iseed };
      if (c.lv) W.items.push({ ...base, cat: 'tile', a: 'bottom', x: wx, y: y0, z: wz, rot: 0, seed: sd() });
      W.items.push({ ...base, cat: c.type === 'water' ? 'water' : 'tile', a: c.used === 'ramp' ? 'ramp' : c.type === 'water' ? 'water' : 'tile', rampTh: c.rampTh, x: wx, y, z: wz, rot: rot6(), seed: sd(), cell: c });
      for (const th of c.pads || []) W.items.push({ cat: 'pad', a: PADS[Math.floor(R() * 3)], pal: spec.pal, x: wx + Math.cos(th) * AP * 0.58, y: y0, z: wz + Math.sin(th) * AP * 0.58, rot: R() * 6.28, s: 1, tint: [1, 1, 1], seed: sd(), island: spec.id });
      if (c.type === 'grass' && (!c.used || c.used === 'plateau') && c.dP >= 1) { const f = vn(c.q * 0.9 + 21, c.r * 0.9, 5, iseed);
        if (f > 0.56 && clear(c.x, c.z, AP + 8)) { c.used = c.used || 'wald'; W.items.push({ cat: 'tree', a: set.tree[Math.floor(R() * 2)], pal: spec.pal, x: wx, y, z: wz, rot: rot6(), s: 1, tint: [1, 1, 1], seed: sd(), island: spec.id }); }
        else if (R() < 0.45) { const a = R() * 6.28, rr = R() * AP * 0.45; if (clear(c.x + Math.cos(a) * rr, c.z + Math.sin(a) * rr, 11)) W.items.push({ cat: 'tree', a: set.tree[2], pal: spec.pal, x: wx + Math.cos(a) * rr, y, z: wz + Math.sin(a) * rr, rot: R() * 6.28, s: 0.9 + R() * 0.3, tint: [1, 1, 1], seed: sd(), island: spec.id }); } }
      if ((c.type === 'sand' || c.edge) && !c.path && !c.used && R() < 0.4) { const ox = (R() - 0.5) * AP, oz = (R() - 0.5) * AP; if (clear(c.x + ox, c.z + oz, 10)) W.items.push({ cat: 'rock', a: set.rock[Math.floor(R() * 3)], pal: spec.pal, x: wx + ox, y, z: wz + oz, rot: R() * 6.28, s: 0.8 + R() * 0.6, tint: [1, 1, 1], seed: sd(), island: spec.id }); } }
    const rb = rockBody(cells, pal, iseed, spec.id === 'burg' ? 0.62 : 0.74, spec.pos); W.rocksGeo.push({ id: spec.id, geo: rb.geo });
    const isl = { ...spec, palette: pal, cells, line: line.map(([x, z]) => [x + spec.pos[0], z + spec.pos[2]]), lm: lm && { x: lm.x + spec.pos[0], y: spec.pos[1] + lm.lift, z: lm.z + spec.pos[2] }, meanR: rb.meanR, iseed };
    W.islands.push(isl); W.labels.push({ txt: spec.label, p: [spec.pos[0], spec.pos[1] + 46, spec.pos[2]], kind: 'isl' });
    cells.forEach(c => W.cellsAll.push({ x: c.x + spec.pos[0], y: spec.pos[1] + c.lift, z: c.z + spec.pos[2], island: spec.id, q: c.q, r: c.r, type: c.type, used: c.used || '' }));
  }
  const raw = [], I = Object.fromEntries(W.islands.map(x => [x.id, x])), DECK = 0.45, SW = 14, RL = 20;
  for (let k = 0; k < order.length; k++) { const A = I[order[k]], B = I[order[(k + 1) % order.length]], loop = RING[RING.indexOf(order[k]) + 1] === 'LOOP';
    A.line.forEach(([x, z]) => raw.push({ p: new THREE.Vector3(x, A.pos[1] + DECK, z), up: new THREE.Vector3(0, 1, 0), z: 0, isl: A.id }));
    const la = A.line, lb = B.line, E1 = new THREE.Vector3(la[la.length - 1][0], A.pos[1] + DECK, la[la.length - 1][1]), E2 = new THREE.Vector3(lb[0][0], B.pos[1] + DECK, lb[0][1]);
    const d1 = new THREE.Vector3(la[la.length - 1][0] - la[la.length - 2][0], 0, la[la.length - 1][1] - la[la.length - 2][1]).normalize(), d2 = new THREE.Vector3(lb[1][0] - lb[0][0], 0, lb[1][1] - lb[0][1]).normalize();
    const L = E1.distanceTo(E2), bz = new THREE.CubicBezierCurve3(E1, E1.clone().addScaledVector(d1, L * 0.38), E2.clone().addScaledVector(d2, -L * 0.38), E2), nb = Math.ceil(L / 3), hump = Math.min(38, L * 0.05);
    const at = t => { const p = bz.getPoint(t); p.y += Math.sin(Math.PI * t) * hump; return p; };
    let mid = null, tg = null, side = null; if (loop) { mid = at(0.5); tg = bz.getTangent(0.5).setY(0).normalize(); side = new THREE.Vector3(-tg.z, 0, tg.x); }
    for (let i = 1; i < nb; i++) { const t = i / nb, p = at(t);
      if (loop) { const o = t < 0.5 ? -SW / 2 * sst(0.22, 0.5, t) : SW / 2 * (1 - sst(0.5, 0.78, t)); p.addScaledVector(side, o);
        if (t >= 0.5 && (i - 1) / nb < 0.5) { for (let q = 1; q < 80; q++) { const a = q / 80 * Math.PI * 2, lat = -SW / 2 + SW * q / 80;
            const lp = mid.clone().addScaledVector(tg, Math.sin(a) * RL).add(new THREE.Vector3(0, RL - Math.cos(a) * RL, 0)).addScaledVector(side, lat), cen = mid.clone().add(new THREE.Vector3(0, RL, 0)).addScaledVector(side, lat);
            raw.push({ p: lp, up: cen.sub(lp).normalize(), z: 1 }); }
          W.labels.push({ txt: 'Looping', p: [mid.x, mid.y + RL * 2 + 10, mid.z], kind: 'tag' }); } }
      raw.push({ p, up: new THREE.Vector3(0, 1, 0), z: 1 }); } }
  W.raw = raw;
  for (let k = 0, tries = 0; k < 7 && tries < 200; tries++) { const a = R() * 6.28, rr = 260 + R() * 620, p = [Math.cos(a) * rr, -70 + R() * 210, Math.sin(a) * rr];
    if (W.islands.some(m => Math.hypot(m.pos[0] - p[0], m.pos[2] - p[2]) < m.meanR + 110)) continue;
    let near = 1e9; for (let i = 0; i < raw.length; i += 4) near = Math.min(near, raw[i].p.distanceTo(new THREE.Vector3(...p))); if (near < 90) continue;
    const pk = Object.keys(PAL)[Math.floor(R() * 4)], pal = PAL[pk], is = (seed * 131 + k * 71) | 0, cmap = genCells(R() < 0.5 ? 1 : 2, is, 0); finishCells(cmap); const cells = [...cmap.values()];
    for (const c of cells) { const wx = c.x + p[0], wz = c.z + p[2], ov = c.edge && R() < 0.4 ? 'sand' : '', kb = 0.97 + R() * 0.06;
      W.items.push({ cat: 'tile', a: 'tile', pal: pk, ov, tint: [kb, kb, kb], x: wx, y: p[1], z: wz, rot: 0, seed: sd(), island: 'islet' + k, cell: c, iseed: is });
      if (R() < 0.6) { const aa = R() * 6.28, r2 = R() * AP * 0.4; W.items.push({ cat: 'tree', a: SETS[pk].tree[2], pal: pk, x: wx + Math.cos(aa) * r2, y: p[1], z: wz + Math.sin(aa) * r2, rot: R() * 6.28, s: 0.9 + R() * 0.3, tint: [1, 1, 1], seed: sd(), island: 'islet' + k }); } }
    W.rocksGeo.push({ id: 'islet' + k, geo: rockBody(cells, pal, is, 0.95, p).geo }); k++; }
  for (let i = 0, t = 0; i < 10 && t < 300; t++) { const a = R() * 6.28, rr = 250 + R() * 750, x = Math.cos(a) * rr, z = Math.sin(a) * rr; if (W.islands.some(m => Math.hypot(m.pos[0] - x, m.pos[2] - z) < m.meanR + 150)) continue;
    W.clouds.push({ v: i % NC, x, y: -40 + R() * 160, z, s: 0.5 + R() * 0.5, rot: R() * 6.28, seed: sd() }); i++; }
  for (let i = 0; i < 44; i++) { const a = R() * 6.28, rr = 500 + Math.sqrt(R()) * 2600; W.clouds.push({ v: i % NC, sea: true, x: Math.cos(a) * rr, y: -460 - R() * 80, z: Math.sin(a) * rr, s: 1.4 + R() * 1.2, rot: R() * 6.28, seed: sd() }); }
  return W; }

/* ---------- Strecke: Profil-Sweep, Straße ↔ Brückenstrang mit Joyride-Übergang ---------- */
const HALF = [  // [s, u] Brücke · [s, u] Straße · Farbschlüssel
  [0, 0.05, 0, 0.05, 'dash'], [0.22, 0.05, 0.22, 0.05, 'dash'], [0.22, 0.05, 0.22, 0.05, 'asph'], [4.0, 0.05, 4.0, 0.05, 'asph'], [4.0, 0.05, 4.0, 0.05, 'line'], [4.5, 0.05, 4.5, 0.05, 'line'],
  [4.5, 0.05, 4.5, 0.05, 'asph'], [4.95, 0.05, 4.95, 0.05, 'asph'], [4.95, 0.05, 4.95, 0.05, 'rail'], [5.05, 0.72, 5.0, 0.4, 'rail'], [5.45, 1.14, 5.3, 0.52, 'rail'], [6.05, 1.14, 7.4, 0.52, 'rail'],
  [6.42, 0.62, 7.62, 0.28, 'rail'], [6.35, -0.28, 7.62, -0.7, 'rail'], [6.35, -0.28, 7.62, -0.7, 'under'], [5.4, -1.5, 6.6, -0.95, 'under']];
const PROFILE = [...HALF.slice().reverse().map(([a, b, c, d, k]) => [-a, b, -c, d, k]), ...HALF.slice(1)];
const TC = { asph: col('#4f5d78'), line: col('#efe8da'), dash: col('#efe8da'), railB: col('#e2522a'), railS: col('#e8dfcf'), underB: col('#c9441f'), underS: col('#8c7a66'), red: col('#d33a26'), white: col('#f3ede2') };
function buildTrack(raw) {
  const N = raw.length, cum = [0]; for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + raw[i % N].p.distanceTo(raw[i - 1].p));
  const L = cum[N], n = Math.floor(L / 2.5), ds = L / n, P = [], U0 = [], Z = []; let si = 0;
  for (let k = 0; k < n; k++) { const s = k * ds; while (cum[si + 1] < s) si++; const t = (s - cum[si]) / (cum[si + 1] - cum[si] || 1), a = raw[si], b = raw[(si + 1) % N];
    P.push(a.p.clone().lerp(b.p, t)); U0.push(a.up.clone().lerp(b.up, t).normalize()); Z.push(lerp(a.z, b.z, t)); }
  const fx = new Uint8Array(n); for (let k = 0; k < n; k++) if (U0[k].y < 0.97) for (let j = -8; j <= 8; j++) fx[(k + j + n) % n] = 1;
  const XZ = P.map(p => [p.x, p.z]), relaxIt = relaxMinR(XZ, { closed: true, fixed: i => fx[i] === 1, Rmin: RMIN, iters: 1500 }); P.forEach((p, i) => { p.x = XZ[i][0]; p.z = XZ[i][1]; });
  const box = (arr, r) => arr.map((_, i) => { let s = 0; for (let j = -r; j <= r; j++) s += arr[(i + j + n) % n]; return s / (2 * r + 1); });
  const bz = box(Z, 6), bw = box(Z, 13), T = [], Sd = [], U = [];
  for (let k = 0; k < n; k++) { const t = P[(k + 1) % n].clone().sub(P[(k - 1 + n) % n]).normalize(), sd = new THREE.Vector3().crossVectors(t, U0[k]).normalize(), u = new THREE.Vector3().crossVectors(sd, t).normalize(); T.push(t); Sd.push(sd); U.push(u); }
  const EDGE = 6.2, edgeP = (k, sg) => P[k % n].clone().addScaledVector(Sd[k % n], sg * EDGE), sL = [0], sR = [0];
  for (let k = 1; k <= n; k++) { sL.push(sL[k - 1] + edgeP(k, -1).distanceTo(edgeP(k - 1, -1))); sR.push(sR[k - 1] + edgeP(k, 1).distanceTo(edgeP(k - 1, 1))); }
  const bzE = [...bz, bz[0]], bwE = [...bw, bw[0]], sC = Array.from({ length: n + 1 }, (_, k) => k * ds), lerpA = (A, f) => { const k = Math.floor(f), t = f - k; return lerp(A[k], A[Math.min(k + 1, n)], t); };
  const perL = sL[n] / (2 * Math.max(1, Math.round(sL[n] / 9))), perR = sR[n] / (2 * Math.max(1, Math.round(sR[n] / 9))), perC = L / (2 * Math.max(1, Math.round(L / 6)));
  const inv = (A, v) => { let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (A[m] <= v) lo = m; else hi = m; } return lo + (v - A[lo]) / ((A[lo + 1] - A[lo]) || 1); };
  const zone = (A, per) => Array.from({ length: Math.round(A[n] / per) + 1 }, (_, m) => { const w = lerpA(bwE, Math.min(n - 1e-6, inv(A, (m + 0.5) * per))); return w > 0.01 && w < 0.99; });
  const zL = zone(sL, perL), zR = zone(sR, perR);
  const state = f => { const b = lerpA(bzE, f), mL = Math.floor(lerpA(sL, f) / perL), mR = Math.floor(lerpA(sR, f) / perR), aL = !!zL[mL], aR = !!zR[mR], dash = b < 0.5 && Math.floor(lerpA(sC, f) / perC) % 2 === 0;
    const rail = (on, m) => on ? (m % 2 ? TC.white : TC.red) : mixc(TC.railS, TC.railB, b);
    return { key: (aL ? 'L' + (mL % 2) : 'l') + (aR ? 'R' + (mR % 2) : 'r') + (dash ? 'd' : ''), b, cols: PROFILE.map(([sB, , , , c]) => c === 'rail' ? (sB < 0 ? rail(aL, mL) : rail(aR, mR)) : c === 'under' ? mixc(TC.underS, TC.underB, b) : c === 'dash' ? (dash ? TC.dash : TC.asph) : TC[c]) }; };
  const NP = PROFILE.length, pos = [], colA = [], idx = []; let rings = 0;
  const ringAt = (f, st) => { const k0 = Math.floor(f) % n, k1 = (k0 + 1) % n, t = f - Math.floor(f), p = P[k0].clone().lerp(P[k1], t), sd = Sd[k0].clone().lerp(Sd[k1], t).normalize(), u = U[k0].clone().lerp(U[k1], t).normalize();
    for (let j = 0; j < NP; j++) { const [sB, uB, sS, uS] = PROFILE[j], s = lerp(sS, sB, st.b), uu = lerp(uS, uB, st.b); pos.push(p.x + sd.x * s + u.x * uu, p.y + sd.y * s + u.y * uu, p.z + sd.z * s + u.z * uu); colA.push(...st.cols[j]); } rings++; };
  for (let k = 0; k < n; k++) { ringAt(k, state(k)); const ev = [];
    for (const [A, per] of [[sL, perL], [sR, perR], [sC, perC]]) { const a0 = A[k], a1 = A[k + 1]; for (let m = Math.ceil(a0 / per + 1e-9); m * per < a1; m++) ev.push((m * per - a0) / (a1 - a0)); }
    ev.sort((x, y) => x - y); for (const t of ev) { if (t < 1e-3 || t > 1 - 1e-3) continue; const s0 = state(k + t - 1e-4), s1 = state(k + t + 1e-4); if (s0.key === s1.key) continue; ringAt(k + t, s0); ringAt(k + t, s1); } }
  for (let r = 0; r < rings; r++) { const r2 = (r + 1) % rings; for (let j = 0; j < NP; j++) { const j2 = (j + 1) % NP, a = r * NP + j, b2 = r * NP + j2, c = r2 * NP + j, d = r2 * NP + j2; idx.push(a, c, b2, b2, c, d); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(colA, 3)); g.setIndex(idx); g.computeVertexNormals();
  const lm = new Uint8Array(n); for (let k = 0; k < n; k++) if (U0[k].y < 0.97) for (let j = -40; j <= 40; j++) lm[(k + j + n) % n] = 1;
  let cross = 0; for (let i = 0; i < n; i += 2) if (!lm[i]) for (let j = i + 24; j < n; j += 2) { if (n - (j - i) < 24 || lm[j]) continue; const a = P[i], c = P[j]; if (Math.hypot(a.x - c.x, a.z - c.z) < 15 && Math.abs(a.y - c.y) < 10 && U0[i].y > 0.97 && U0[j].y > 0.97) { cross++; i += 12; break; } }
  return { geo: g, P, T, U, L, n, ds, relaxIt, cross }; }

function posterCanvas(i, cover) { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const x = cv.getContext('2d');
  x.fillStyle = '#efe5cf'; x.fillRect(0, 0, 1024, 512); x.strokeStyle = 'rgba(120,80,40,.22)'; x.lineWidth = 16; x.beginPath(); x.arc(600, 210, 150, 0, 6.28); x.stroke();
  let ox = 0; if (cover) { const h = 512, w = Math.min(460, h * cover.ar); x.drawImage(cover.canvas, 0, 0, w, h); ox = w; }
  const cx = ox + (1024 - ox) / 2, k = cover ? 0.62 : 1; x.save(); x.translate(cx, 250); x.rotate(-0.06);
  x.fillStyle = '#17110d'; x.font = `italic 900 ${150 * k}px Georgia, serif`; x.textAlign = 'center'; x.fillText('Kayfa', -110 * k, -10 * k);
  x.rotate(-0.08); x.fillStyle = '#b8232f'; x.fillRect(-250 * k, 20 * k, 560 * k, 150 * k); x.fillStyle = '#fbf3e6'; x.font = `900 ${128 * k}px Georgia, serif`; x.fillText('Bizarro', 30 * k, 135 * k); x.restore();
  x.fillStyle = '#3a2a20'; x.font = '800 34px "Nunito Sans", system-ui, sans-serif'; x.textAlign = 'center'; x.fillText(POSTERS[i].sub.toUpperCase(), cx, 470); return cv; }

/* ---------- Boot ---------- */
export async function boot(canvas, labelHost, onNote = () => {}, opts = {}) {
  const t0 = performance.now(), info = { fps: 0, calls: 0, tris: 0, geoms: 0, tex: 0, progs: 0, loadMs: 0, buildMs: 0, errors: [], mode: 'B', view: 'kosmos', trackLen: 0, boardSrc: 'Fallback-Plakat', cloudSrc: 'prozedural' };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 16 / 9, 1, 16000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.zoomToCursor = true;

  // ---------- Knete K2 (wie R1A, unverändert) ----------
  onNote('Knete wird angerührt …'); await new Promise(r => setTimeout(r, 0));
  const rel = makeClayRelief({ size: 1024, seed: 31 }), tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = 0.05;
  let globalClayTexture = null, globalClayMeta = null;
  let derekTexture = null, derekMeta = null;
  const _st = window.setTimeout, mc = new MessageChannel(), mq = []; mc.port1.onmessage = () => { const f = mq.shift(); f && f(); };
  window.setTimeout = (f, d, ...a) => (d ? _st(f, d, ...a) : (mq.push(() => f(...a)), mc.port2.postMessage(0), 0));
  let trl; try { trl = await makeToolReliefs({ size: 1024, seed: 41, onStep: s => onNote('Werkzeug ' + s + ' …') }); } finally { window.setTimeout = _st; mc.port1.close(); }
  { const mk = d => { const x = new THREE.DataTexture(d, trl.size, trl.size, THREE.RGBAFormat); x.wrapS = x.wrapT = THREE.RepeatWrapping; x.magFilter = THREE.LinearFilter; x.minFilter = THREE.LinearMipmapLinearFilter; x.generateMipmaps = true; x.anisotropy = renderer.capabilities.getMaxAnisotropy(); x.needsUpdate = true; return x; };
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = trl.maps.map(mk); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; }
  /* Knete: 'parity' = FACADE-A/B-01 MATCH (01.10., Georg): v10 auf K1/v8-Werte, Handmaß 0,5 in Weltmetern, Fingerabdrücke an, Werkzeuge aus.
     'r2a' = alter Stand (Handmaß ×10, Werkzeuge) — im Gate TUNE, nur noch zum Vergleich. */
  const PAR = opts.clay !== 'r2a'; info.clay = PAR ? 'K1-Parität (FACADE-A/B-01 MATCH)' : 'R2A alt (Gate: TUNE)';
  if (PAR) { U.uClayToolOn.value = 0; U.uClayLegacyStroke.value = 1; U.uClayHexK.value = 3; U.uClayHexRot.value = 1; U.uClayHexFlow.value = 0; U.uClayFacetSoft.value = 0;
    try { U.uClayPrint.value = await makePrintTexture(THREE, 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png', 2048); U.uClayPrintOn.value = 1; } catch (e) { U.uClayPrint.value = tex; info.errors.push('Fingerabdrücke: ' + e.message); } }
  else { U.uClayPrint.value = tex; U.uClayPrintOn.value = 0; U.uClayMacro.value = 0.45; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.75; }
  const K = PAR ? 1 : 10, MATS = [];
  const prof = (k, over) => { const p = { ...PROFILES[k], ...over }; p.scale *= K; p.gougeSize *= K; p.crackSize *= K; p.dentSize *= K; return p; };
  U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K;
  const clay = (color, pkey, mix, over = {}, vc = false) => { const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, vertexColors: vc, side: THREE.DoubleSide }), profile: PAR ? { ...prof(pkey, {}), legacy: 1 } : { ...prof(pkey, over), tools: TOOLMIX[mix], legacy: 0 } });
    m.side = THREE.DoubleSide; const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, r) => { ob(sh, r); if (PAR) sh.fragmentShader = sh.fragmentShader
      .replace('if (uClayPrintOn > 0.5) {', 'if (uClayPrintOn > 0.5 && lodNear > 0.0) {')
      .replace('if (uClayPerfPrint > 0.5 && uClayPrintOn > 0.5) {', 'if (uClayPerfPrint > 0.5 && uClayPrintOn > 0.5 && lodNear > 0.0) {'); sh.vertexShader = sh.vertexShader.replace('vClayP = position; vClayN = normal;', '\n#ifdef USE_INSTANCING\n vClayP = (instanceMatrix * vec4(position, 1.0)).xyz; vClayN = mat3(instanceMatrix) * normal;\n#else\n vClayP = position; vClayN = normal;\n#endif\n'); };
    m.customProgramCacheKey = () => ck() + (PAR ? '-r2a-par' : '-r2a'); MATS.push(m); return m; };
  const GROUND = { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 };
  const MAT = {
    ground: [clay('#ffffff', 'terrainFg', 'terrain', GROUND), clay('#ffffff', 'terrainFg', 'terrain', GROUND, true)],
    water: [clay('#ffffff', 'water', 'terrain', { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.4 }), clay('#ffffff', 'water', 'terrain', { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.4 }, true)],
    rock: clay('#ffffff', 'terrainFg', 'rock', { print: 0, dent: 0.2, gouge: 0.2, crack: 0.2, facet: 1.2 }, true),
    tree: clay('#ffffff', 'nature', 'nature', {}, true),
    stone: [clay('#ffffff', 'prop', 'rock'), clay('#ffffff', 'prop', 'rock', {}, true)],
    cloud: clay('#f4efe6', 'cloud', 'cloud', { print: 0, gouge: 0, crack: 0 }),
    track: clay('#ffffff', 'road', 'strang', { print: 0, crack: 0 }, true),
    frame: clay('#ffffff', 'prop', 'house', {}, true),
    castle: clay('#ffffff', 'house', 'house', {}, true),
    peak: clay('#ffffff', 'terrainFg', 'rock', { print: 0, dent: 0.3, gouge: 0.25, crack: 0.15, facet: 1.0 }, true) };
  MAT.water.forEach(m => { m.roughness = 0.35; });

  // ---------- Faire Vergleichsmaterialien: jedes Look-Ziel hat seinen eigenen kleinen Shader ----------
  const liteShared = {
    texture: { value: tex }, scale: { value: 1 / 9 }, bump: { value: 0.42 },
    color: { value: 0.22 }, rough: { value: 0.55 }
  };
  const derekShared = {
    texture: { value: tex }, scale: { value: 0.32 }, blend: { value: 6.0 },
    spread: { value: 0.32 }, hue: { value: 0.14 }, roughBias: { value: 0.10 }
  };
  const variants = { plain: new Map(), lite: new Map(), derek: new Map() };
  const reverseVariant = new Map();
  let activeMaterialLook = 'procedural';
  const variantFor = (proc, kind) => {
    if (!proc || !MATS.includes(proc) || kind === 'procedural') return proc;
    const mp = variants[kind];
    if (!mp.has(proc)) {
      const v = kind === 'plain' ? makePlainMaterial(proc)
        : kind === 'lite' ? makeGlobalClayLiteMaterial(proc, liteShared)
        : makeDerekRgbMaterial(proc, derekShared);
      mp.set(proc, v);
      reverseVariant.set(v, proc);
    }
    return mp.get(proc);
  };
  const procOf = m => MATS.includes(m) ? m : (reverseVariant.get(m) || null);
  const switchAllMaterials = kind => {
    activeMaterialLook = kind;
    scene.traverse(o => {
      if (!o.isMesh || !o.material) return;
      if (Array.isArray(o.material)) {
        let changed = false;
        const next = o.material.map(m => {
          const p = procOf(m);
          if (!p) return m;
          changed = true;
          return variantFor(p, kind);
        });
        if (changed) o.material = next;
      } else {
        const p = procOf(o.material);
        if (p) o.material = variantFor(p, kind);
      }
    });
  };

  // ---------- Licht + Himmel ----------
  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = opts.shadows !== false; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.6; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05), back = new THREE.DirectionalLight('#ffe6d6', 0.6), bounce = new THREE.DirectionalLight('#f3dcc4', 1.1); bounce.position.set(0.25, -1, 0.35).multiplyScalar(900); scene.add(hemi, back, bounce);
  { const el = 46 * D2R, az = 128 * D2R, d = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    sun.position.copy(d).multiplyScalar(1500).add(new THREE.Vector3(0, 0, 60)); sun.target.position.set(0, 0, 60); Object.assign(sun.shadow.camera, { left: -720, right: 720, top: 720, bottom: -720, near: 300, far: 3400 }); sun.shadow.camera.updateProjectionMatrix();
    back.position.set(-d.x, 0.45, -d.z).multiplyScalar(900); sun.userData.dir = d.clone(); }
  /* Schatten nach LESSONS_SHADOWS (Welt-Rezept): folgt dem Blickziel, texelgerastet, Bias im Texelmaß. Ersetzt das feste ±720-m-Feld mit normalBias 0,6. */
  const shadowFollow = makeShadowFollow(renderer, sun, sun.userData.dir, { min: 60, max: 760, k: 1.2, bias: -0.00003, depth: 1600 });
  const SKY = makeSkyDome(THREE, 9000); SKY.mesh.material.fragmentShader = SKY.mesh.material.fragmentShader.replace('max(vD.y, 0.0)', 'abs(vD.y) * 0.8').replace(/\}\s*$/, ' gl_FragColor = linearToOutputTexel(gl_FragColor); }'); SKY.mesh.material.needsUpdate = true; scene.add(SKY.mesh);
  const setSky = k => { const P = SKY_PRESETS[k] || SKY_PRESETS.claybound; SKY.paint(P); scene.fog = new THREE.Fog(P.fog, 1700, 5600); sun.color.set(P.sun[0]); sun.intensity = P.sun[1];
    hemi.color.set(P.hemi[0]); hemi.groundColor.set(P.hemi[1]).lerp(new THREE.Color('#e6d3bd'), 0.45); hemi.intensity = P.hemi[2]; back.color.set(P.back[0]); back.intensity = P.back[1]; renderer.toneMappingExposure = P.expo; info.sky = k; };
  setSky(opts.sky || 'claybound');

  // ---------- Basisgeometrien ----------
  onNote('Kacheln werden geformt …'); await new Promise(r => setTimeout(r, 0));
  const G = { tile: makeTile(), dish: makeTile({ Rt: 4, dish: true }), plate: makePlate(), hill: [0, 1, 2].map(v => makeHill(v, false)), tree: [0, 1, 2].map(v => makeTree(v, false)), rock: makeRock(false),
    cloud: [60, 85, 115].map((L, i) => makeCloud(L, 11 + i, 3)), frame: makeFrame(), image: (() => { const g = new THREE.PlaneGeometry(12, 6); g.translate(0, 8.6, 0.46); return g; })(), castle: makeCastle() };
  const KG = {}, sampler = map => { const im = map && map.image; if (!im) return () => [0.6, 0.6, 0.6]; const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const x = cv.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
    const D = x.getImageData(0, 0, cv.width, cv.height).data, Wd = cv.width, Ht = cv.height;
    return (u, v) => { const px = Math.min(Wd - 1, Math.floor((((u % 1) + 1) % 1) * Wd)), py = Math.min(Ht - 1, Math.floor((((v % 1) + 1) % 1) * Ht)), i = (py * Wd + px) * 4; return [D[i] / 255, D[i + 1] / 255, D[i + 2] / 255]; }; };
  { const ldr = new GLTFLoader(), load = u => Promise.race([ldr.loadAsync(u), new Promise((_, rj) => setTimeout(() => rj(new Error('Zeitüberschreitung')), 25000))]);
    const flat = (scene, uv) => { const P = sceneParts(scene, uv), gs = P.map(p => p.geo.index ? p.geo.toNonIndexed() : p.geo); return { geo: gs.length > 1 ? mergeGeometries(gs) : gs[0], map: (P.find(p => p.map) || {}).map || null }; };
    onNote('Katalog wird geladen (KayKit Hexagon, Wolken) …'); G.lmk = {};
    await Promise.all([
      load('https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/KFB/Clouds%20by%20Jarlan%20Perez%20-%20b3Kia9N2fS2.glb').then(g => { const v = cloudVariants(g.scene); if (v && v.length) { G.cloud = v; info.cloudSrc = 'Jarlan Perez GLB · ' + v.length + ' Formen'; } }).catch(e => info.errors.push('Wolken-GLB: ' + e.message)),
      ...Object.entries(KAY).map(([k, p]) => load(HEXKIT + p + '.gltf').then(g => { const f = flat(g.scene, true); f.geo.scale(AP, AP, AP); KG[k] = { geo: f.geo, sample: sampler(f.map) }; }).catch(e => info.errors.push('KayKit ' + k + ': ' + e.message))),
      ...Object.entries(LMK).map(([id, [p, k]]) => load(HEXKIT + p).then(g => { const f = flat(g.scene, true); f.geo.scale(AP * k, AP * k, AP * k); const m = clay('#ffffff', 'house', 'house', {}); if (f.map) { m.map = f.map; m.needsUpdate = true; } G.lmk[id] = { geo: f.geo, mat: m }; }).catch(e => info.errors.push('KayKit ' + id + ': ' + e.message)))]);
    if (KG.ramp) { const P = KG.ramp.geo.attributes.position; let x = 0, z = 0, m = 0; for (let i = 0; i < P.count; i++) if (P.getY(i) > AP * 0.6) { x += P.getX(i); z += P.getZ(i); m++; } KG.ramp.a0 = Math.atan2(z / (m || 1), x / (m || 1)); }
    info.catalog = 'KayKit ' + Object.keys(KG).length + '/' + Object.keys(KAY).length + ' Teile'; }
  const LEAF = { burg: '#2a8a45', utopia: '#5fae72', dystopia: '#3f7f6a', protopia: '#4f8f2f' }, bakeCache = new Map();
  const slotOf = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); let h = 0;
    if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    if (l > 0.86 && s < 0.3) return 'snow'; if (s < 0.16) return 'stone'; if (h >= 185 && h <= 255) return 'water'; if (h >= 82 && h < 185) return 'leaf'; if (h >= 45 && h < 82) return 'grass'; if (h >= 24 && h < 45 && l > 0.6) return 'sand'; return 'dirt'; };
  const bakeKay = (a, palK, ov) => { const k = a + '|' + palK + '|' + (ov || ''); if (bakeCache.has(k)) return bakeCache.get(k); const src = KG[a], pal = PAL[palK] || PAL.burg;
    const SC2 = { grass: col(ov === 'paved' ? pal.paved : ov === 'sand' ? pal.sand : pal.grass), dirt: col(pal.rock), stone: mixc(col('#c9c1b4'), col(pal.rock), 0.12), leaf: col(LEAF[palK] || LEAF.burg), water: col(pal.water), sand: col(pal.sand), snow: col('#f4efe6') };
    const g = src.geo.clone(), uv = g.attributes.uv, n = g.attributes.position.count, cl = new Float32Array(n * 3), sl = new Array(n), Ls = new Float32Array(n), sum = {}, cnt = {};
    for (let i = 0; i < n; i++) { const [r, gg, b] = uv ? src.sample(uv.getX(i), uv.getY(i)) : [0.6, 0.6, 0.6], c = slotOf(r, gg, b), Lm = 0.2126 * r + 0.7152 * gg + 0.0722 * b; sl[i] = c; Ls[i] = Lm; sum[c] = (sum[c] || 0) + Lm; cnt[c] = (cnt[c] || 0) + 1; }
    for (let i = 0; i < n; i++) cl.set(mulc(SC2[sl[i]], clamp(Ls[i] / (sum[sl[i]] / cnt[sl[i]] || 1), 0.72, 1.18)), i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(cl, 3)); if (uv) g.deleteAttribute('uv'); bakeCache.set(k, g); return g; };
  const ptex = POSTERS.map((_, i) => { const t = new THREE.CanvasTexture(posterCanvas(i)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });
  const imgMat = ptex.map(t => new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
  const gateTex = (() => { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 128; const x = cv.getContext('2d'); for (let i = 0; i < 32; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#17110d' : '#f3ede2'; x.fillRect(i * 32, j * 32, 32, 32); }
    x.fillStyle = '#e2522a'; x.fillRect(300, 8, 424, 112); x.fillStyle = '#fbf3e6'; x.font = '900 72px "Nunito Sans", system-ui, sans-serif'; x.textAlign = 'center'; x.fillText('START · ZIEL', 512, 90); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();

  // ---------- Welt ----------
  let seed = opts.seed ?? 7, W, TR, staticGrp = new THREE.Group(); scene.add(staticGrp);
  const lab = document.createElement('div'); lab.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden'; labelHost.appendChild(lab); let labels = [], showLabels = true;
  const content = new THREE.Group(); scene.add(content); let batches = [], pickables = [], tileIM = null;
  const grid = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#fffaf0', transparent: true, opacity: 0.75 })); grid.visible = false; scene.add(grid);
  const marker = new THREE.Mesh(new THREE.RingGeometry(AP * 0.86, AP * 1.02, 6, 1, Math.PI / 6), new THREE.MeshBasicMaterial({ color: opts.accent || '#5d4cff', side: THREE.DoubleSide, toneMapped: false })); marker.rotation.x = -Math.PI / 2; marker.visible = false; scene.add(marker);
  const st = { mode: opts.mode === 'A' ? 'A' : 'B', fugen: opts.fugen || 'weich', muster: opts.muster || 'kachel', kachel: opts.kachel || 'kaykit' };

  function regen() {
    onNote('Inseln werden gewürfelt …'); W = genWorld(seed, { nCloud: G.cloud.length }); TR = buildTrack(W.raw); info.trackLen = Math.round(TR.L); info.trackRelax = TR.relaxIt + ' / Inseln ' + W.relax; info.trackCross = TR.cross;
    staticGrp.traverse(o => { if (o.geometry && o.userData.own) o.geometry.dispose(); }); staticGrp.clear();
    const add = (geo, m, name, sd) => { seedGeometry(THREE, geo, sd); const me = new THREE.Mesh(geo, m); me.name = name; me.castShadow = me.receiveShadow = true; me.userData.own = true; staticGrp.add(me); return me; };
    add(TR.geo, MAT.track, 'strecke', 77);
    const burg = W.islands.find(i => i.id === 'burg');
    for (const I of W.islands) { if (!I.lm) continue; const k = G.lmk[I.id];
      if (k) { const g = k.geo.clone(); g.rotateY(Math.floor(hash(I.iseed, 1, 2, 3) * 6) * Math.PI / 3); g.translate(I.lm.x, I.lm.y, I.lm.z); add(g, k.mat, 'landmark-' + I.id, 91 + (I.iseed % 50)); }
      else if (I.id === 'burg') { const cg = G.castle.clone(); cg.translate(I.lm.x, I.lm.y, I.lm.z); add(cg, MAT.castle, 'burg', 91); } }
    // Start/Ziel-Tor auf der Burg-Insel
    { const m = burg.line[Math.floor(burg.line.length * 0.5)], P = new THREE.Vector3(m[0], burg.pos[1], m[1]); let k0 = 0, bd = 1e9; TR.P.forEach((p, k) => { const d = p.distanceTo(P); if (d < bd) { bd = d; k0 = k; } });
      const p = TR.P[k0], sd = new THREE.Vector3().crossVectors(TR.T[k0], TR.U[k0]).normalize(), parts = [];
      for (const s of [-8.6, 8.6]) { const c = new THREE.CylinderGeometry(0.75, 0.9, 10, 10); c.translate(0, 5, 0); const o = new THREE.Object3D(); o.position.copy(p).addScaledVector(sd, s); o.updateMatrix(); c.applyMatrix4(o.matrix); parts.push(paint(clean(c), col('#e2522a')).toNonIndexed()); }
      add(mergeGeometries(parts), MAT.frame, 'tor-pfosten', 33);
      const ban = new THREE.Mesh(new THREE.BoxGeometry(18.4, 2.3, 0.5), [null, null, null, null, new THREE.MeshBasicMaterial({ map: gateTex, toneMapped: false }), new THREE.MeshBasicMaterial({ map: gateTex, toneMapped: false })].map(x => x || new THREE.MeshStandardMaterial({ color: '#e2522a' })));
      ban.position.copy(p).add(new THREE.Vector3(0, 9.2, 0)); ban.lookAt(ban.position.clone().add(TR.T[k0].clone().setY(0))); ban.castShadow = true; ban.userData.own = true; staticGrp.add(ban);
      W.labels.push({ txt: 'Start / Ziel', p: [p.x, p.y + 15, p.z], kind: 'tag' }); W.sf = k0; }
    // Raster-Linien (logische Struktur)
    { const L = []; for (const c of W.cellsAll) for (let k = 0; k < 6; k++) { const a0 = (30 + 60 * k) * D2R, a1 = (90 + 60 * k) * D2R; L.push(c.x + S * Math.cos(a0), c.y + 0.5, c.z + S * Math.sin(a0), c.x + S * Math.cos(a1), c.y + 0.5, c.z + S * Math.sin(a1)); }
      grid.geometry.dispose(); grid.geometry = new THREE.BufferGeometry(); grid.geometry.setAttribute('position', new THREE.Float32BufferAttribute(L, 3)); }
    lab.innerHTML = ''; labels = W.labels.map(L => { const d = document.createElement('div'); d.textContent = L.txt;
      d.style.cssText = opts.labelStyle === 'atlas'
        ? 'position:absolute;left:0;top:0;white-space:nowrap;font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;padding:5px 7px;border-radius:5px;' + (L.kind === 'isl' ? 'background:#14130fee;color:#f3ecd8;border:1px solid #403d2c' : 'background:#c9a227;color:#1a1710;border:1px solid #e8c84a')
        : 'position:absolute;left:0;top:0;white-space:nowrap;font:800 12px/1 "Nunito Sans",system-ui,sans-serif;letter-spacing:.02em;padding:6px 9px;border-radius:9px;' + (L.kind === 'isl' ? 'background:rgba(255,255,255,.92);color:#17191d;border:1px solid #dfe3e8' : 'background:#17191d;color:#fffaf0;font-size:11px');
      lab.appendChild(d); return { d, p: new THREE.Vector3(...L.p) }; });
    build(); }

  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), C3 = new THREE.Color();
  const triCount = g => (g.index ? g.index.count : g.attributes.position.count) / 3;
  function build() {
    const tb = performance.now(); marker.visible = false;
    content.traverse(o => { if (o.userData.own && o.geometry) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); }); content.clear(); batches = []; pickables = []; tileIM = null;
    const B = st.mode === 'B', fs = { sichtbar: 0.955, weich: 0.995, geschlossen: 1.035 }[st.fugen] || 0.995;
    const seedOf = it => st.muster === 'durchgehend' && it.iseed != null ? [((it.iseed * 0.618) % 1 + 1) % 1, 0.37, 0.71] : it.seed;
    const tf = (it, sx, sy, sz) => { V.set(it.x, it.y, it.z); Q.setFromAxisAngle(Y, it.rot || 0); SC.set(sx, sy, sz); return M4.compose(V, Q, SC); };
    const CM = { tile: MAT.ground[1], water: MAT.water[1], mtn: MAT.peak, hill: MAT.ground[1], pad: MAT.ground[1], tree: MAT.tree, rock: MAT.stone[1] }, KGR = new Map();
    for (const it of W.items) { if (!KG[it.a]) continue; const k = it.a + '|' + it.pal + '|' + (it.ov || ''); if (!KGR.has(k)) KGR.set(k, []); KGR.get(k).push(it); }
    const kgroups = [...KGR.values()].map(list => { const a = list[0], tileLike = a.cat === 'tile' || a.cat === 'water';
      return { name: a.a + ' · ' + a.pal + (a.ov ? ' · ' + a.ov : ''), list, geo: () => bakeKay(a.a, a.pal, a.ov), hi: () => bakeKay(a.a, a.pal, a.ov).clone(), mat: [CM[a.cat], CM[a.cat]],
        m: it => it.a === 'ramp' ? tf({ ...it, rot: (KG.ramp.a0 || 0) - it.rampTh }, fs, 1, fs) : tileLike ? tf(it, fs, 1, fs) : tf(it, it.s || 1, it.s || 1, it.s || 1), c: it => it.tint || [1, 1, 1], vcMul: true, pick: list.every(x => x.cell) }; });
    const groups = [...kgroups,
      ...G.cloud.map((_, v) => ({ name: 'Wolke ' + 'abcdef'[v], list: W.clouds.filter(h => h.v === v && !h.sea), geo: () => G.cloud[v], hi: () => G.cloud[v].clone(), mat: [MAT.cloud, MAT.cloud], m: it => tf(it, it.s, it.s, it.s), c: null, noShadowRecv: true })),
      ...G.cloud.map((_, v) => ({ name: 'Wolkenmeer ' + 'abcdef'[v], list: W.clouds.filter(h => h.v === v && h.sea), geo: () => G.cloud[v], hi: () => G.cloud[v].clone(), mat: [MAT.cloud, MAT.cloud], m: it => tf(it, it.s, it.s * 0.7, it.s), c: null, noShadowRecv: true, noCast: true })),
      { name: 'Billboard · Rahmen', list: W.boards, geo: () => G.frame, hi: () => G.frame.clone(), mat: [MAT.frame, MAT.frame], m: it => tf(it, 1, 1, 1), c: null },
      ...[0, 1, 2].map(ti => ({ name: 'Billboard · Bild ' + (ti + 1), list: W.boards.filter(b => b.tex === ti), geo: () => G.image, hi: () => G.image.clone(), mat: [imgMat[ti], imgMat[ti]], m: it => tf(it, 1, 1, 1), c: null, basic: true }))];
    for (const gr of groups) { if (!gr.list.length) continue; const mats = Array.isArray(gr.mat) ? gr.mat : [gr.mat, gr.mat];
      if (B) { const g = gr.geo().clone(), im = new THREE.InstancedMesh(g, mats[0], gr.list.length), sd = new Float32Array(gr.list.length * 3);
        gr.list.forEach((it, i) => { im.setMatrixAt(i, gr.m(it)); if (gr.c) im.setColorAt(i, C3.setRGB(...gr.c(it))); sd.set(seedOf(it), i * 3); });
        if (!gr.basic) g.setAttribute('claySeed', new THREE.InstancedBufferAttribute(sd, 3)); im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
        im.castShadow = !gr.basic && !gr.noCast; im.receiveShadow = !gr.noShadowRecv; im.userData.own = true; im.userData.group = gr; im.name = gr.name; content.add(im);
        if (gr.pick) { pickables.push(im); if (gr.name === 'Hex · Boden') tileIM = im; }
        batches.push({ name: gr.name, kind: 'Instanced', n: gr.list.length, tri: triCount(g), calls: 1 }); }
      else { let tri = 0; gr.list.forEach(it => { const g = gr.hi(it); clean(g);
          if (gr.c) { const c = gr.c(it); if (gr.vcMul && g.attributes.color) { const a = g.attributes.color; for (let i = 0; i < a.count; i++) a.setXYZ(i, a.getX(i) * c[0], a.getY(i) * c[1], a.getZ(i) * c[2]); } else paint(g, c); }
          if (!gr.basic) seedGeometry(THREE, g, (seedOf(it)[0] * 100000) | 0); const me = new THREE.Mesh(g, gr.c && !gr.vcMul ? mats[1] : mats[0]); me.matrixAutoUpdate = false; me.matrix.copy(gr.m(it)); me.updateMatrixWorld(true);
          me.castShadow = !gr.basic && !gr.noCast; me.receiveShadow = !gr.noShadowRecv; me.userData.own = true; me.userData.item = it; me.name = gr.name; content.add(me); if (gr.pick) pickables.push(me); tri += triCount(g); });
        batches.push({ name: gr.name, kind: 'Einzel-Mesh', n: gr.list.length, tri: Math.round(tri / gr.list.length), calls: gr.list.length }); } }
    if (B) { const geo = mergeGeometries(W.rocksGeo.map(r => seedGeometry(THREE, r.geo.clone(), r.id.length * 131 + r.id.charCodeAt(0)))), me = new THREE.Mesh(geo, MAT.rock); me.castShadow = me.receiveShadow = true; me.userData.own = true; content.add(me);
      batches.push({ name: 'Felskörper (alle Inseln)', kind: 'Mesh · verschmolzen', n: W.rocksGeo.length, tri: Math.round(triCount(geo) / W.rocksGeo.length), calls: 1 }); }
    else { let tri = 0; W.rocksGeo.forEach(r => { const g = seedGeometry(THREE, r.geo.clone(), r.id.length * 131 + r.id.charCodeAt(0)), me = new THREE.Mesh(g, MAT.rock); me.castShadow = me.receiveShadow = true; me.userData.own = true; content.add(me); tri += triCount(g); });
      batches.push({ name: 'Felskörper', kind: 'Einzel-Mesh', n: W.rocksGeo.length, tri: Math.round(tri / W.rocksGeo.length), calls: W.rocksGeo.length }); }
    batches.push({ name: 'Strecke', kind: 'Mesh', n: 1, tri: triCount(TR.geo), calls: 1 });
    if (activeMaterialLook !== 'procedural') switchAllMaterials(activeMaterialLook);
    info.buildMs = Math.round(performance.now() - tb); info.mode = st.mode; }

  regen();

  // Kartenbilder im Hintergrund: echte Deck-Cover über bb-scene (Registry + pdf.js), sonst bleibt das Plakat
  (async () => { try { const bb = await Promise.race([import('../bb-scene.js'), new Promise((_, rj) => setTimeout(() => rj(new Error('Zeitüberschreitung')), 20000))]);
      let ok = 0; for (let i = 0; i < POSTERS.length; i++) { try { const pg = await Promise.race([bb.renderDeckPage(POSTERS[i].pack, 1, 700), new Promise((_, rj) => setTimeout(() => rj(new Error('t')), 20000))]);
          ptex[i].image = posterCanvas(i, pg); ptex[i].needsUpdate = true; ok++; } catch (e) { /* bleibt Plakat */ } }
      info.boardSrc = ok ? `Deck-Cover ${ok}/${POSTERS.length} (Registry)` : 'Fallback-Plakat'; }
    catch (e) { info.boardSrc = 'Fallback-Plakat (' + e.message + ')'; } })();

  // ---------- Auswahl per instanceId ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null, pickCb = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera); const t = performance.now(), h = ray.intersectObjects(pickables, false)[0], ms = performance.now() - t;
    if (!h) { marker.visible = false; info.pick = null; pickCb && pickCb(null); return; }
    const it = h.object.isInstancedMesh ? h.object.userData.group.list[h.instanceId] : h.object.userData.item, c = it.cell;
    marker.position.set(it.x, it.y + 0.9, it.z); marker.visible = true;
    info.pick = { island: it.island, q: c.q, r: c.r, type: c.type + (c.used ? ' · ' + c.used : ''), lift: c.lift, via: h.object.isInstancedMesh ? `instanceId ${h.instanceId} in „${h.object.name}“` : 'eigenes Mesh', ms: ms.toFixed(1) };
    pickCb && pickCb(info.pick); });

  // ---------- Ansichten ----------
  const isl = id => { const I = W.islands.find(x => x.id === id), tg = new THREE.Vector3(I.pos[0], I.pos[1] - 8, I.pos[2]); return { tg, pos: tg.clone().add(new THREE.Vector3(0.62, 0.48, 0.66).normalize().multiplyScalar(I.meanR * 3.1)) }; };
  const VIEWS = { kosmos: () => ({ pos: new THREE.Vector3(260, 540, 1180), tg: new THREE.Vector3(10, -10, 130) }),
    raster: () => ({ pos: new THREE.Vector3(0, 1700, 70), tg: new THREE.Vector3(0, 0, 60) }),
    horizont: () => ({ pos: new THREE.Vector3(1320, 30, 720), tg: new THREE.Vector3(0, -10, 60) }),
    unterseite: () => ({ pos: new THREE.Vector3(420, -760, 640), tg: new THREE.Vector3(0, -60, 60) }),
    burg: () => isl('burg'), utopia: () => isl('utopia'), dystopia: () => isl('dystopia'), protopia: () => isl('protopia') };
  let tween = null, chase = null;
  const shot = (id, instant) => { info.view = id; if (id === 'fahrt') { chase = { s: TR.ds * (W.sf || 0), up: new THREE.Vector3(0, 1, 0) }; controls.enabled = false; tween = null; return; }
    if (chase) { chase = null; camera.up.set(0, 1, 0); controls.enabled = true; } if (!VIEWS[id]) id = 'kosmos'; const Vw = VIEWS[id]();
    if (instant) { camera.position.copy(Vw.pos); controls.target.copy(Vw.tg); tween = null; camera.userData.set = 1; return; }
    tween = { t0: performance.now(), p0: camera.position.clone(), g0: controls.target.clone(), p1: Vw.pos, g1: Vw.tg, first: !camera.userData.set }; camera.userData.set = 1; };
  const sampleTr = s => { const L = TR.L, n = TR.n, f = (((s % L) + L) % L) / TR.ds, k = Math.floor(f), t = f - k, k2 = (k + 1) % n;
    return { p: TR.P[k].clone().lerp(TR.P[k2], t), T: TR.T[k].clone().lerp(TR.T[k2], t).normalize(), U: TR.U[k].clone().lerp(TR.U[k2], t).normalize() }; };
  let inset = opts.inset || 0;
  const resize = () => { const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h;
    if (inset > 0 && w > 720) camera.setViewOffset(w + inset, h, 0, 0, w, h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const v3 = new THREE.Vector3();
  const drawLabels = () => { const w = canvas.clientWidth, h = canvas.clientHeight; lab.style.display = showLabels && !chase ? '' : 'none'; if (lab.style.display) return;
    for (const L of labels) { v3.copy(L.p).project(camera); const vis = v3.z < 1 && Math.abs(v3.x) < 1.1 && Math.abs(v3.y) < 1.1; L.d.style.display = vis ? '' : 'none';
      if (vis) L.d.style.transform = `translate(${(v3.x * 0.5 + 0.5) * w}px,${(-v3.y * 0.5 + 0.5) * h}px) translate(-50%,-100%)`; } };
  let frames = 0, fpsT = performance.now(), alive = true, paused = false, lastDraw = 0, lastT = performance.now();
  const render = () => { renderer.info.reset(); renderer.render(scene, camera); info.calls = renderer.info.render.calls; info.tris = renderer.info.render.triangles; info.geoms = renderer.info.memory.geometries; info.tex = renderer.info.memory.textures; info.progs = (renderer.info.programs || []).length; };
  const draw = () => { const now = performance.now(), dt = Math.min(0.05, (now - lastT) / 1000); lastT = now; lastDraw = now;
    if (chase) { chase.s += dt * 32; const a = sampleTr(chase.s), b = sampleTr(chase.s + 26); chase.up.lerp(a.U, 0.12).normalize(); camera.up.copy(chase.up);
      camera.position.copy(a.p).addScaledVector(a.U, 5.2).addScaledVector(a.T, -13); camera.lookAt(b.p.clone().addScaledVector(b.U, 2.2)); }
    else { if (tween) { const k = tween.first ? 1 : sst(0, 1, (now - tween.t0) / 800); camera.position.lerpVectors(tween.p0, tween.p1, k); controls.target.lerpVectors(tween.g0, tween.g1, k); if (k >= 1) tween = null; } controls.update(); }
    { const tg = chase ? camera.position.clone().add(new THREE.Vector3().subVectors(controls.target, camera.position).setLength(0)) : controls.target, dist = chase ? 80 : camera.position.distanceTo(controls.target);
      const sf = shadowFollow(chase ? camera.position : tg, dist); info.shadow = `folgt · Feld ±${sf.r} m · Texel ${(sf.texel * 100).toFixed(1)} cm · normalBias ${sf.normalBias.toFixed(3)}`; }
    render(); drawLabels(); frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; } };
  const loop = () => { if (!alive) return; requestAnimationFrame(loop); if (!paused) { try { draw(); } catch (e) { if (!info.errors.includes('draw: ' + e.message)) { info.errors.push('draw: ' + e.message); console.error(e); } } } }; requestAnimationFrame(loop);
  const iv = setInterval(() => { if (alive && !paused && performance.now() - lastDraw > 250) { try { draw(); } catch (e) { /* in loop gemeldet */ } } }, 120);
  shot(opts.view || 'kosmos', true); info.loadMs = Math.round(performance.now() - t0); onNote('');

  // ---------- Messlauf A/B: gleiche Kamera, GPU-synchron ----------
  const gl = renderer.getContext(), px = new Uint8Array(4), sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
  async function bench(onStep = () => {}) { const keep = st.mode, cam = { p: camera.position.clone(), t: controls.target.clone(), ch: chase }; paused = true; chase = null; camera.up.set(0, 1, 0); const out = [];
    const pr0 = renderer.getPixelRatio();
    try { for (const m of ['B', 'Bk', 'Bh', 'A']) { onStep('Baue ' + m + ' …'); await new Promise(r => setTimeout(r, 30)); const mm = m[0]; if (st.mode !== mm || m === 'B') { st.mode = mm; build(); }
        U.uClayOn.value = m === 'Bk' ? 0 : 1; renderer.setPixelRatio(m === 'Bh' ? pr0 * 0.5 : pr0); resize(); camera.position.set(260, 540, 1180); controls.target.set(10, -10, 130); camera.lookAt(controls.target);
        for (let i = 0; i < 8; i++) { render(); sync(); await new Promise(r => setTimeout(r, 0)); }
        const ts = []; for (let i = 0; i < 60; i++) { const a = performance.now(); render(); sync(); ts.push(performance.now() - a); if (i % 10 === 0) { onStep(m + ' · Bild ' + i + '/60'); await new Promise(r => setTimeout(r, 0)); } }
        ts.sort((a, b) => a - b); const avg = ts.reduce((s, x) => s + x, 0) / ts.length;
        out.push({ mode: m, ms: +avg.toFixed(2), p95: +ts[Math.floor(ts.length * 0.95)].toFixed(2), fps: Math.round(1000 / avg), calls: info.calls, tris: info.tris, geoms: info.geoms, tex: info.tex, build: info.buildMs, shadows: sun.castShadow }); } }
    finally { U.uClayOn.value = 1; renderer.setPixelRatio(pr0); resize(); st.mode = keep; build(); camera.position.copy(cam.p); controls.target.copy(cam.t); if (cam.ch) { chase = cam.ch; } paused = false; }
    return out; }

  async function setGlobalClayLite(donor = 'Clay002', size = 1024, repeatM = 9) {
    const built = await makeGlobalClayPack(THREE, { donor, size });
    if (globalClayTexture && globalClayTexture !== built.texture) globalClayTexture.dispose();
    globalClayTexture = built.texture; globalClayMeta = { ...built.meta, repeatM };
    globalClayTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    liteShared.texture.value = globalClayTexture;
    liteShared.scale.value = 1 / Math.max(0.5, repeatM);
    switchAllMaterials('lite');
    info.clayLook = 'Global Clay Lite · ' + donor + ' · ' + size + '² · ' + repeatM + ' m';
    return globalClayMeta;
  }
  function setGlobalClayRepeat(repeatM = 9) {
    liteShared.scale.value = 1 / Math.max(0.5, repeatM);
    if (globalClayMeta) globalClayMeta = { ...globalClayMeta, repeatM };
    if (activeMaterialLook === 'lite') info.clayLook = 'Global Clay Lite · Clay002 · 1024² · ' + repeatM + ' m';
    return repeatM;
  }
  async function setDerekRgb(size = 512) {
    if (!derekTexture || derekMeta?.size !== size) {
      const built = await makeDerekRgbTexture(THREE, { size });
      if (derekTexture && derekTexture !== built.texture) derekTexture.dispose();
      derekTexture = built.texture; derekMeta = built.meta;
      derekTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    }
    derekShared.texture.value = derekTexture;
    switchAllMaterials('derek');
    info.clayLook = 'Derek RGB · ' + size + '²';
    return derekMeta;
  }
  function setProceduralClay() {
    switchAllMaterials('procedural');
    info.clayLook = 'Procedural Clay · K1 parity';
  }
  function setClayOff() {
    switchAllMaterials('plain');
    info.clayLook = 'Clay off';
  }

  return { info, U, renderer, sun, get batches() { return batches; }, get world() { return W; },
    get globalClayMeta() { return globalClayMeta; }, get derekMeta() { return derekMeta; },
    setGlobalClayLite, setGlobalClayRepeat, setDerekRgb, setProceduralClay, setClayOff,
    shot, bench, onPick(cb) { pickCb = cb; },
    set(k, v) { if (k === 'mode') { st.mode = v === 'A' ? 'A' : 'B'; build(); }
      else if (k === 'fugen') { st.fugen = v; build(); } else if (k === 'muster') { st.muster = v; build(); } else if (k === 'kachel') { st.kachel = v; build(); }
      else if (k === 'seed') { seed = +v | 0; regen(); }
      else if (k === 'shadows') { sun.castShadow = !!v; }
      else if (k === 'grid') grid.visible = !!v; else if (k === 'labels') showLabels = !!v; else if (k === 'sky') setSky(v);
      else if (k === 'clouds') content.children.forEach(o => { if (/^Wolke/.test(o.name || '')) o.visible = !!v; });
      else if (k === 'inset') { inset = +v || 0; resize(); } },
    dispose() { alive = false; clearInterval(iv); ro.disconnect(); controls.dispose();
      if (globalClayTexture) globalClayTexture.dispose(); if (derekTexture) derekTexture.dispose();
      Object.values(variants).forEach(mp => mp.forEach(m => m.dispose()));
      renderer.dispose(); lab.remove(); } };
}
