/* KFB World Core R2D v0 · eine zusammenhängende Knet-Insel (03.10.2026)
 * Brief R2D @ 14a1c55, Schritte 3–5 als erster sichtbarer Schnitt.
 * Unsichtbares Hexraster (9 logische Zellen, R2C-Maß S = 10) → EIN Geländekörper (Oberseite + Rand + Unterseite, ein Mesh).
 * Straße: Track Core (compileRecipe → buildTrack), unverändert. Gelände bekommt Straßenbett, Damm/Einschnitt, Brückenkopf.
 * Knete: clay-material.v10 Parität wie R2C. Paletten: PAL aus hex-archipel.r2c.js. Haus: KayKit building_A, Golden-Weg v8.
 * Bäume/Felsen: KayKit Hexagon Pack, instanziert. Keine Figur (Register-To-do). Kein zweiter Owner für Straße, Fassade, Audio. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { importPinned, PIN, DIR, RAW, MODLOG } from '../KFB_R2D_S0/bench.js';

const S = 10, AP = S * Math.sqrt(3) / 2;
const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const hexXZ = (q, r) => [S * Math.sqrt(3) * (q + r / 2), S * 1.5 * r];
const FAC_PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';   // building_A-Pin aus golden/facade-ab-01.js
const CITY = 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
export const MASK = { road: ['Fahrbahn + Sicherheitsrand', '#e2522a'], walk: ['Gehwege', '#f29a2e'], interact: ['Bewohner-/Interaktionsplatz', '#f2d24a'],
  building: ['Gebäude/Landmarke', '#4f7bd9'], veg: ['Vegetation/Props', '#5aa84a'], water: ['Wasser + Ufer', '#3f8fd6'], edge: ['Inselrand, Absturzsicherheit', '#8a4fc4'], under: ['Unterseite', '#6b6f78'] };
const FOREST = 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/', QUAT = 'media/3D_Assets/Rocks + Pebbles + Path Tiles by Quaternius/';
const J14 = 'tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t, sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash2 = (x, y, s) => { const h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
const vnoise = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s); return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1; };
const fbm = (x, y, s, o = 4) => { let a = 0, f = 1, w = 0.5; for (let i = 0; i < o; i++) { a += w * vnoise(x * f, y * f, s + i * 13); f *= 2.03; w *= 0.5; } return a; };
const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
function sdHex(dx, dz, r) { const kx = -0.866025404, ky = 0.5, kz = 0.577350269; let px = Math.abs(dz), py = Math.abs(dx); const d = 2 * Math.min(kx * px + ky * py, 0); px -= d * kx; py -= d * ky; px -= clamp(px, -kz * r, kz * r); py -= r; return Math.hypot(px, py) * Math.sign(py); }
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const distSeg = (px, pz, a, b) => { const vx = b[0] - a[0], vz = b[1] - a[1], l2 = vx * vx + vz * vz || 1, t = clamp(((px - a[0]) * vx + (pz - a[1]) * vz) / l2, 0, 1); return Math.hypot(px - a[0] - vx * t, pz - a[1] - vz * t); };

/* ---------- Plan: Zellen, Umriss, Straße, Plätze (reine Daten, deterministisch je Seed) ---------- */
function planIsland(seed, TC, shape = 'frei') {
  const R = rng(seed * 7919 + 13); let C, sdf;
  if (shape === 'hex') { const cells = [[0, 0], ...DIRS.map(d => [d[0], d[1]])];
    const d0 = Math.floor(R() * 6), n = DIRS[d0]; cells.push([n[0] * 2, n[1] * 2], [n[0] + DIRS[(d0 + 1) % 6][0], n[1] + DIRS[(d0 + 1) % 6][1]]);
    C = cells.map(([q, r]) => ({ q, r, xz: hexXZ(q, r) }));
    sdf = (x, z) => { let d = 1e9; for (const c of C) d = smin(d, sdHex(x - c.xz[0], z - c.xz[1], AP * 1.02), 6); return d + 1.8 * fbm(x * 0.045, z * 0.045, seed + 3) - 0.4; };
  } else {   // freie Form: wenige weiche Knetballen um eine Mitte, kein Raster im Umriss
    const n = 6 + Math.floor(R() * 3); C = [{ q: null, r: null, xz: [0, 0], rad: 21 + R() * 4 }];
    for (let i = 1; i < n; i++) { const a = i / (n - 1) * Math.PI * 2 + R() * 0.9, d = 15 + R() * 11; C.push({ q: null, r: null, xz: [Math.cos(a) * d, Math.sin(a) * d], rad: 11 + R() * 7 }); }
    sdf = (x, z) => { let d = 1e9; for (const c of C) d = smin(d, Math.hypot(x - c.xz[0], z - c.xz[1]) - c.rad, 9); return d + 2.2 * fbm(x * 0.04, z * 0.04, seed + 3) - 0.4; };
  }
  const c0 = [C.reduce((a, c) => a + c.xz[0], 0) / C.length, C.reduce((a, c) => a + c.xz[1], 0) / C.length];
  const NA = 192, edgeR = new Float32Array(NA);
  for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2, cx = Math.cos(th), cz = Math.sin(th); let r = 0; while (r < 95 && sdf(c0[0] + cx * r, c0[1] + cz * r) < 0) r += 0.5;
    let lo = Math.max(0, r - 0.5), hi = r; for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (sdf(c0[0] + cx * m, c0[1] + cz * m) < 0) lo = m; else hi = m; } edgeR[a] = lo; }
  const rAt = th => { const f = ((th / (Math.PI * 2)) % 1 + 1) % 1 * NA, i = Math.floor(f), t = f - i; return lerp(edgeR[i % NA], edgeR[(i + 1) % NA], t); };
  // Straße: Track Core, quer durch die Insel, Enden als Brückenköpfe zur Nachbarinsel
  const roadY = 0.6, turn = 16 + Math.floor(R() * 11), sgn = R() < 0.5 ? 1 : -1;
  const ext = rAt(-Math.PI / 2) + rAt(Math.PI / 2), zIn = c0[1] - rAt(-Math.PI / 2) - 6, arc = 45 * turn * Math.PI / 180, tail = Math.max(4, ext + 12 - 6 - 2 * arc * 0.97);
  const LOW = { barrierH: { to: 0.3 }, barrierOuterTop: { to: 0.25 } }, HIGH = { barrierH: { to: 1.35 }, barrierOuterTop: { to: 1.18 } };
  const recipe = { schema: 'kfb.route-recipe/0.1-draft', id: 'R2D_V0_ISLAND_' + seed, label: 'R2D v0 · Inselquerung', start: { p: [c0[0] + sgn * 3, roadY, zIn], headingDeg: 0 },
    defaults: { widthClass: 'NARROW', markings: 'STREET' },
    pieces: [{ id: 'kopf_in', type: 'STRAIGHT', length: 6 }, { id: 's1', type: 'CURVE_EASE', turn: turn * sgn, radius: 45, bankDeg: 0, params: LOW }, { id: 's2', type: 'CURVE_EASE', turn: -turn * sgn, radius: 45, bankDeg: 0 }, { id: 'kopf_out', type: 'STRAIGHT', length: +tail.toFixed(1), params: HIGH }] };
  let stream = TC.compileRecipe(recipe);
  { const S0 = stream.samples, L = S0[S0.length - 1].s; let sl = 0; for (const q of S0) if (sdf(q.p[0], q.p[2]) < 0) sl = q.s;   // Brückenkopf: Ende 6 m hinter dem letzten Inselpunkt
    const over = L - sl - 6, pc = recipe.pieces[3]; if (Math.abs(over) > 1) { pc.length = +Math.max(3, pc.length - over).toFixed(1); stream = TC.compileRecipe(recipe); } }
  const samp = stream.samples, width = samp[0].prm.width;
  // Fahrbahnmitte aus den Slots (Rolle 'road' liegt zwischen Slot 6 und 7), nicht aus p: der Kern legt die Fahrbahn seitlich versetzt
  const sw = (q, i) => [0, 1, 2].map(k => q.p[k] + q.R[k] * q.slots[i][0] + q.U[k] * q.slots[i][1]);
  const poly = samp.map(q => { const a = sw(q, 6), b = sw(q, 7); return [(a[0] + b[0]) / 2, (a[2] + b[2]) / 2]; });
  const q0 = samp[Math.floor(samp.length / 2)], lats = q0.slots.map(s => s[0]), mid = (q0.slots[6][0] + q0.slots[7][0]) / 2;
  const hw = Math.max(...lats.map(l => Math.abs(l - mid))) + 1.0, roadSurf = (sw(q0, 6)[1] + sw(q0, 7)[1]) / 2;
  const roadDist = (x, z) => { let best = 1e9; for (let i = 0; i < poly.length - 1; i += 1) { const d = distSeg(x, z, poly[i], poly[i + 1]); if (d < best) best = d; } return best; };
  const natural = (x, z) => 1.7 * fbm(x * 0.03, z * 0.03, seed + 5) + 0.55 * fbm(x * 0.09, z * 0.09, seed + 9);
  // Gebäudeplätze: Zellmitten abseits der Straße und des Rands
  const padR = 6.5, cand = C.slice(1).map(c => ({ c, rd: roadDist(c.xz[0], c.xz[1]), e: -sdf(c.xz[0], c.xz[1]) })).filter(o => o.rd > hw + 8 && o.e > 8.5).sort((a, b) => b.rd - a.rd);
  const pads = []; for (const o of cand) { if (pads.length >= 2) break; if (pads.every(p => Math.hypot(p.x - o.c.xz[0], p.z - o.c.xz[1]) > padR * 2 + 6)) pads.push({ x: o.c.xz[0], z: o.c.xz[1], r: padR, h: natural(o.c.xz[0], o.c.xz[1]) * 0.6 + 0.35, cell: [o.c.q, o.c.r] }); }
  // großer Platz: offenster Punkt (Abstand zu Rand, Straße, Häusern)
  let big = null, bs = -1e9;
  for (let x = c0[0] - 45; x <= c0[0] + 45; x += 2) for (let z = c0[1] - 45; z <= c0[1] + 45; z += 2) { const e = -sdf(x, z); if (e < 8) continue;
    const sc = Math.min(e - 8, roadDist(x, z) - hw - 5, ...pads.map(p => Math.hypot(p.x - x, p.z - z) - p.r - 4)); if (sc > bs) { bs = sc; big = { x, z }; } }
  const plazas = [];
  if (big) plazas.push({ kind: 'big', x: big.x, z: big.z, r: 6, h: natural(big.x, big.z) * 0.6 + 0.35, note: 'Tanzen · Geschenke · Rauferei' });
  if (pads[0]) { const p = pads[0], tx = (big ? big.x : c0[0]) - p.x, tz = (big ? big.z : c0[1]) - p.z, l = Math.hypot(tx, tz) || 1, sx = p.x + tx / l * (p.r + 4), sz = p.z + tz / l * (p.r + 4);
    plazas.push({ kind: 'small', x: sx, z: sz, r: 3.5, h: p.h, note: 'Spieler + 2 Figuren' }); }
  // Gehwege: kleiner Platz → großer Platz → Straßenrand; Haus 2 → großer Platz
  const nearestRoadPt = (x, z) => { let bi = 0, bd = 1e9; poly.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); if (d < bd) { bd = d; bi = i; } }); const p = poly[bi], dx = x - p[0], dz = z - p[1], l = Math.hypot(dx, dz) || 1; return [p[0] + dx / l * (hw + 0.5), p[1] + dz / l * (hw + 0.5)]; };
  const paths = [];
  const B = plazas.find(p => p.kind === 'big'), Sm = plazas.find(p => p.kind === 'small');
  if (B) { if (Sm) paths.push([[Sm.x, Sm.z], [B.x, B.z]]); paths.push([[B.x, B.z], nearestRoadPt(B.x, B.z)]); if (pads[1]) paths.push([[pads[1].x, pads[1].z], [B.x, B.z]]); }
  // Teich: offenster freier Punkt außerhalb von Straße, Häusern, Plätzen und Wegen
  let pond = null, ps = -1e9; const pr = 4.5;
  for (let x = c0[0] - 45; x <= c0[0] + 45; x += 2) for (let z = c0[1] - 45; z <= c0[1] + 45; z += 2) { const e = -sdf(x, z); if (e < pr + 4) continue;
    const sc = Math.min(e - pr - 4, roadDist(x, z) - hw - pr - 4, ...[...pads, ...plazas].map(p => Math.hypot(p.x - x, p.z - z) - p.r - pr - 3), ...paths.map(s => distSeg(x, z, s[0], s[1]) - pr - 2)); if (sc > ps) { ps = sc; pond = { x, z, r: pr }; } }
  if (pond && ps < 0) pond = null; if (pond) pond.h = natural(pond.x, pond.z) * 0.6 + 0.1;
  // Bach: vom Teich zur Inselkante, mäandernd, bevorzugt unter der Straße hindurch (dort Schlucht + Brücke), endet als Wasserfall
  let creek = null;
  if (pond) { let best = null, bsc = -1e9;
    const sideAt = (x, z) => { let bi = 0, bd = 1e9; for (let i = 0; i < poly.length - 1; i++) { const d = distSeg(x, z, poly[i], poly[i + 1]); if (d < bd) { bd = d; bi = i; } } const a = poly[bi], b = poly[bi + 1]; return Math.sign((b[0] - a[0]) * (z - a[1]) - (b[1] - a[1]) * (x - a[0])); };
    const s0 = sideAt(pond.x, pond.z);
    for (let k = 0; k < 64; k++) { const th = k / 64 * Math.PI * 2, er = rAt(th), E = [c0[0] + Math.cos(th) * (er + 3), c0[1] + Math.sin(th) * (er + 3)], L = Math.hypot(E[0] - pond.x, E[1] - pond.z); let hit = 0;
      const ex = c0[0] + Math.cos(th) * (er - 2), ez = c0[1] + Math.sin(th) * (er - 2), cross = sideAt(ex, ez) !== s0 && roadDist(ex, ez) > hw;
      for (let t = 0; t <= 1; t += 0.02) { const x = lerp(pond.x, E[0], t), z = lerp(pond.z, E[1], t); for (const p of [...pads, ...plazas]) if (Math.hypot(x - p.x, z - p.z) < p.r + 2.5) hit++; }
      const sc = (cross ? 200 : 0) - 0.35 * L - (cross ? 12 : 30) * hit; if (sc > bsc) { bsc = sc; best = { E, L }; } }
    if (best) { const ph = R() * 6.28, pts = [], N = 48, dx = (best.E[0] - pond.x) / best.L, dz = (best.E[1] - pond.z) / best.L;
      for (let i = 0; i <= N; i++) { const t = i / N, s0 = pond.r * 0.6 + t * (best.L - pond.r * 0.6), off = 2.2 * Math.sin(t * Math.PI * 2.3 + ph) * Math.sin(Math.PI * Math.min(1, t * 1.15)); pts.push([pond.x + dx * s0 - dz * off, pond.z + dz * s0 + dx * off]); }
      let cross = null; for (const p of pts) if (roadDist(p[0], p[1]) < 1.6) { cross = p; break; }
      let lip = null; for (let i = 1; i < pts.length; i++) if (sdf(pts[i][0], pts[i][1]) >= -0.3) { const ddx = pts[i][0] - pts[i - 1][0], ddz = pts[i][1] - pts[i - 1][1], l = Math.hypot(ddx, ddz) || 1; lip = { p: pts[i], i, dir: [ddx / l, ddz / l] }; break; }
      creek = { pts, w: 1.3, cross, lip, dist: (x, z) => { let b = 1e9; for (let i = 0; i < pts.length - 1; i++) { const d = distSeg(x, z, pts[i], pts[i + 1]); if (d < b) b = d; } return b; } }; } }
  return { seed, shape, cells: C, c0, sdf, NA, edgeR, rAt, recipe, stream, width, hw, roadY: roadSurf, roadDist, natural, pads, plazas, paths, poly, pond, creek };
}

/* Höhe und Maske an jedem Punkt — analytisch, also für Gelände, Raster, Bäume und Häuser dieselbe Wahrheit */
function fields(P) {
  const { sdf, roadDist, natural, pads, plazas, paths, hw, roadY, pond, creek } = P;
  const carveAt = (x, z) => { if (!creek) return [0, 1e9, 0]; const dc = creek.dist(x, z); let c = 1.1 * (1 - sstep(creek.w, creek.w + 2.6, dc)), k = 0;
    if (creek.cross) { k = 1 - sstep(4, 11, Math.hypot(x - creek.cross[0], z - creek.cross[1])); c += k * 4.4 * (1 - sstep(creek.w + 0.5, creek.w + 5.5, dc)); }
    let keep = 0; for (const p of [...pads, ...plazas]) keep = Math.max(keep, 1 - sstep(p.r + 0.5, p.r + 3.5, Math.hypot(x - p.x, z - p.z))); c *= 1 - keep; return [c, dc, k * (1 - keep)]; };
  const heightAt = (x, z) => { const e = -sdf(x, z); let h = natural(x, z) * sstep(1.5, 11, e) - 1.4 * Math.pow(1 - sstep(0, 3.2, e), 2);
    for (const p of [...pads, ...plazas]) { const w = 1 - sstep(p.r, p.r + 4, Math.hypot(x - p.x, z - p.z)); h = lerp(h, p.h, w); }
    if (pond) { const dp = Math.hypot(x - pond.x, z - pond.z); h = lerp(h, pond.h, 1 - sstep(pond.r + 1, pond.r + 5, dp)); h -= 0.9 * Math.pow(1 - sstep(0, pond.r + 0.6, dp), 0.7); }
    const d = roadDist(x, z), w = 1 - sstep(hw, hw + 7, d); h = lerp(h, roadY - 0.35, w); return h - carveAt(x, z)[0]; };
  // Übergangsgewichte für das Joyride-Patch-Muster (kfbBlend): Sand an Bankett und Ufer, Pflaster an Plätzen und Wegen, Fels am Rand
  const weightsAt = (x, z) => { const e = -sdf(x, z), d = roadDist(x, z);
    let sand = 1 - sstep(hw + 0.6, hw + 3.4, d), pav = 0;
    if (pond) sand = Math.max(sand, 1 - sstep(pond.r + 0.8, pond.r + 3.6, Math.hypot(x - pond.x, z - pond.z)));
    for (const p of [...pads, ...plazas]) pav = Math.max(pav, 1 - sstep(p.r - 1.2, p.r + 1.4, Math.hypot(x - p.x, z - p.z)));
    for (const s of paths) pav = Math.max(pav, 1 - sstep(0.8, 2.4, distSeg(x, z, s[0], s[1])));
    let rock = 1 - sstep(0.3, 2.8, e); if (creek) { const [, dc, k] = carveAt(x, z); sand = Math.max(sand, 1 - sstep(creek.w + 0.6, creek.w + 3, dc)); rock = Math.max(rock, k * (1 - sstep(creek.w + 1, creek.w + 6, dc))); }
    return [sand, pav, rock]; };
  const maskAt = (x, z) => { const e = -sdf(x, z), d = roadDist(x, z); if (d < hw) return 'road';
    if (creek && creek.dist(x, z) < creek.w + 0.8) return 'water';
    if (pond && Math.hypot(x - pond.x, z - pond.z) < pond.r + 1.5) return 'water';
    for (const p of pads) if (Math.hypot(x - p.x, z - p.z) < p.r) return 'building';
    for (const p of plazas) if (Math.hypot(x - p.x, z - p.z) < p.r) return 'interact';
    for (const s of paths) if (distSeg(x, z, s[0], s[1]) < 1.4) return 'walk';
    return e < 2.2 ? 'edge' : 'veg'; };
  return { heightAt, maskAt, weightsAt };
}

/* ---------- Geländekörper: Oberseite → Rand → Unterseite, ein Mesh, keine Säulen ---------- */
function buildTerrain(P, F, pal) {
  const { c0, NA, edgeR, seed } = P, NR = 44, NU = 30, rows = NR + 1 + NU, pos = new Float32Array(rows * NA * 3), colW = new Float32Array(rows * NA * 3), colM = new Float32Array(rows * NA * 3), counts = {};
  const C = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; }, cg = C(pal.grass), cg2 = C(pal.grass2), chill = C(pal.hill), cpav = C(pal.paved), csand = C(pal.sand), clip = C(pal.lip), crock = C(pal.rock), MC = Object.fromEntries(Object.entries(MASK).map(([k, v]) => [k, C(v[1])]));
  const R = rng(seed * 31 + 7), D = 24 + R() * 7;
  let vi = 0; const wts = new Float32Array(rows * NA * 3);
  const put = (x, y, z, cw, m, wv = [0, 0, 1]) => { pos.set([x, y, z], vi * 3); colW.set(cw, vi * 3); colM.set(MC[m], vi * 3); wts.set(wv, vi * 3); counts[m] = (counts[m] || 0) + 1; vi++; };
  const edgeY = new Float32Array(NA);
  for (let i = 0; i <= NR; i++) { const t = 1 - Math.pow(1 - i / NR, 1.35);
    for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2, r = edgeR[a] * t, x = c0[0] + Math.cos(th) * r, z = c0[1] + Math.sin(th) * r, y = F.heightAt(x, z), m = F.maskAt(x, z), e = -P.sdf(x, z);
      const pn = fbm(x * 0.07, z * 0.07, seed + 21), d = P.roadDist(x, z);
      let cw = pn > 0.14 ? cg2 : pn < -0.32 ? chill : cg;
      if (m === 'building' || m === 'interact' || m === 'walk') cw = cpav; else if (d < P.hw + 1.6 && d >= P.hw - 2.2) cw = csand; else if (e < 1.3) cw = clip;
      if (i === NR) edgeY[a] = y; put(x, y, z, [1, 1, 1], m, F.weightsAt(x, z)); } }
  for (let j = 1; j <= NU; j++) { const s = j / NU;
    for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2;
      let rf = (1 + 0.05 * Math.sin(Math.min(1, s / 0.1) * Math.PI)) * Math.pow(1 - s, 0.8); rf *= 1 + 0.1 * fbm(th * 2.2, s * 5, seed + 31) * sstep(0.05, 0.3, s);
      const r = edgeR[a] * rf, y = edgeY[a] - 0.9 * sstep(0, 0.1, s) - D * Math.pow(s, 1.25) + 0.8 * fbm(th * 3, s * 3, seed + 41) * sstep(0.1, 0.4, s);
      const band = fbm(y * 0.35 + th * 0.6, th, seed + 51) > 0.05 ? 0.78 : 1, cw = crock.map(v => v * band * (1 - 0.25 * s));
      put(c0[0] + Math.cos(th) * r, y, c0[1] + Math.sin(th) * r, cw, 'under'); } }
  const idx = [];
  for (let k = 0; k < rows - 1; k++) for (let a = 0; a < NA; a++) { const a1 = (a + 1) % NA, v00 = k * NA + a, v01 = k * NA + a1, v10 = (k + 1) * NA + a, v11 = (k + 1) * NA + a1; idx.push(v00, v10, v11, v00, v11, v01); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colW.slice(), 3)); g.setIndex(idx); g.computeVertexNormals();
  if (g.attributes.normal.getY(NA * 5) < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.index.needsUpdate = true; g.computeVertexNormals(); }
  // Oberseite bekommt eine Farbkarte in Draufsicht-UV (scharfe Knetflecken statt Eckfarben), Unterseite behält Eckfarben.
  // Beide teilen dieselben Attribute und Normalen: kein Schattierungssprung am Rand.
  let mx = Infinity, Mx = -Infinity, mz = Infinity, Mz = -Infinity; for (let i = 0; i < vi; i++) { const x = pos[i * 3], z = pos[i * 3 + 2]; if (x < mx) mx = x; if (x > Mx) Mx = x; if (z < mz) mz = z; if (z > Mz) Mz = z; }
  const W = Math.max(Mx - mx, Mz - mz) + 2, box = { minX: mx - 1, minZ: mz - 1, W }, uv = new Float32Array(vi * 2);
  for (let i = 0; i < vi; i++) { uv[i * 2] = (pos[i * 3] - box.minX) / W; uv[i * 2 + 1] = (pos[i * 3 + 2] - box.minZ) / W; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('aTW', new THREE.BufferAttribute(wts, 3));
  const ix = g.index.array, cut = (NR + 3) * NA * 6, mk = (a, b) => { const s = new THREE.BufferGeometry(); for (const k of ['position', 'normal', 'color', 'uv', 'aTW']) s.setAttribute(k, g.attributes[k]); s.setIndex(Array.from(ix.slice(a, b))); s.computeBoundingBox(); s.computeBoundingSphere(); return s; };
  return { geo: g, top: mk(0, cut), under: mk(cut, ix.length), box, depth: +D.toFixed(1) };
}

/* Farbkarte und Maskenkarte, 1024² über die Insel: Knetflecken je Pixel aus Rauschen, Wege und Plätze als gezeichnete Formen */
const hexRGB = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
function paintMaps(P, pal, box, N = 1024) {
  const seed = P.seed, px = (wx, wz) => [(wx - box.minX) / box.W * N, (wz - box.minZ) / box.W * N], m2px = m => m / box.W * N;
  const mkc = () => { const c = document.createElement('canvas'); c.width = c.height = N; return c; }, cw = mkc(), cm = mkc(), xw = cw.getContext('2d'), xm = cm.getContext('2d');
  const iw = xw.createImageData(N, N), im = xm.createImageData(N, N), G = hexRGB(pal.grass), G2 = hexRGB(pal.grass2), HL = hexRGB(pal.hill), LIP = hexRGB(pal.lip), MV = hexRGB(MASK.veg[1]), ME = hexRGB(MASK.edge[1]), MU = hexRGB(MASK.under[1]);
  for (let j = 0; j < N; j++) { const wz = box.minZ + (j + 0.5) / N * box.W;
    for (let i = 0; i < N; i++) { const wx = box.minX + (i + 0.5) / N * box.W, e = -P.sdf(wx, wz), o = (j * N + i) * 4;
      let c, m; if (e < 0) { c = G; m = MU; } else { const n = fbm(wx * 0.07, wz * 0.07, seed + 21, 3) + 0.05 * vnoise(wx * 1.4, wz * 1.4, seed + 99); c = n > 0.14 ? G2 : n < -0.32 ? HL : G; m = e < 2.2 ? ME : MV; }
      iw.data[o] = c[0]; iw.data[o + 1] = c[1]; iw.data[o + 2] = c[2]; iw.data[o + 3] = 255; im.data[o] = m[0]; im.data[o + 1] = m[1]; im.data[o + 2] = m[2]; im.data[o + 3] = 255; } }
  xw.putImageData(iw, 0, 0); xm.putImageData(im, 0, 0);
  const ragged = (x, cx, cz, r, s) => { x.beginPath(); for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2, rr = r * (1 + 0.07 * vnoise(Math.cos(a) * 2 + s, Math.sin(a) * 2, seed + 61)), [u, v] = px(cx + Math.cos(a) * rr, cz + Math.sin(a) * rr); k ? x.lineTo(u, v) : x.moveTo(u, v); } x.closePath(); x.fill(); };
  const stroke = (x, pts, wM, col) => { x.strokeStyle = col; x.lineWidth = m2px(wM); x.lineCap = x.lineJoin = 'round'; x.beginPath(); pts.forEach((p, k) => { const [u, v] = px(p[0], p[1]); k ? x.lineTo(u, v) : x.moveTo(u, v); }); x.stroke(); };
  // Weltkarte trägt nur noch die Grasflecken; Sand, Pflaster und Fels kommen als Joyride-Patchmuster im Shader. Maskenkarte zeichnet die Planung.
  for (const [x, sh, wk, pl, bd] of [[xm, MASK.road[1], MASK.walk[1], MASK.interact[1], MASK.building[1]]]) {
    stroke(x, P.poly, 2 * (x === xw ? P.hw + 1.6 : P.hw), sh);
    for (const s of P.paths) stroke(x, s, 2.8, wk);
    x.fillStyle = pl; P.plazas.forEach((p, k) => ragged(x, p.x, p.z, p.r, k * 3.1));
    x.fillStyle = bd; P.pads.forEach((p, k) => ragged(x, p.x, p.z, p.r, 7 + k * 3.1));
    if (P.pond) { x.fillStyle = MASK.water[1]; ragged(x, P.pond.x, P.pond.z, P.pond.r + 1.5, 13); }
    if (P.creek) stroke(x, P.creek.pts.slice(0, (P.creek.lip ? P.creek.lip.i : P.creek.pts.length) + 1), 2 * (P.creek.w + 0.8), MASK.water[1]); }
  const areas = {}, d = xm.getImageData(0, 0, N, N).data, pal7 = Object.entries(MASK).map(([k, v]) => [k, hexRGB(v[1])]), a1 = (box.W / N) ** 2;
  for (let o = 0; o < d.length; o += 16) { let bk = null, bd = 1e9; for (const [k, c] of pal7) { const dd = Math.abs(d[o] - c[0]) + Math.abs(d[o + 1] - c[1]) + Math.abs(d[o + 2] - c[2]); if (dd < bd) { bd = dd; bk = k; } } areas[bk] = (areas[bk] || 0) + 4 * a1; }
  Object.keys(areas).forEach(k => areas[k] = Math.round(areas[k]));
  const tex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t; };
  return { world: tex(cw), mask: tex(cm), areas };
}
function _unused() {
  const cells = {};
  return { cells };
}

function hexLines(P, F) { const pts = [];
  for (const c of P.cells) { const v = [...Array(6).keys()].map(i => { const a = Math.PI / 6 + i * Math.PI / 3 + Math.PI / 2; return [c.xz[0] + Math.cos(a) * S, c.xz[1] + Math.sin(a) * S]; });
    for (let i = 0; i < 6; i++) { const A = v[i], B = v[(i + 1) % 6]; for (let k = 0; k < 10; k++) { const t0 = k / 10, t1 = (k + 1) / 10, x0 = lerp(A[0], B[0], t0), z0 = lerp(A[1], B[1], t0), x1 = lerp(A[0], B[0], t1), z1 = lerp(A[1], B[1], t1);
      pts.push(x0, F.heightAt(x0, z0) + 0.25, z0, x1, F.heightAt(x1, z1) + 0.25, z1); } } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g; }

export async function boot(canvas, onNote = () => {}) {
  const t0 = performance.now(), info = { errors: [] };
  onNote('Module am Pin laden …');
  const r = f => importPinned(PIN.r2c, DIR.r2c + f);
  const [V10, REL, V8, SOFT, FIT, R2C, TC, ST, BL] = await Promise.all([r('lab-clay/clay-material.v10.js'), r('lab-clay/clay-relief.v2.js'), r('golden/k1/lab-clay/clay-material.v8.js'), r('golden/k1/lab-clay/clay-soften.v1.js'), r('lab-world/shadow-fit.v1.js'), r('lab-world/hex-archipel.r2c.js'),
    importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/track-core.mjs'), importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/stream-to-three.mjs'), importPinned(PIN.r2c, J14 + 'lab-track/road-markings.m1.js')]);
  info.modules = MODLOG.length;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede'); scene.fog = new THREE.Fog('#96bede', 260, 900);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.maxDistance = 600;
  const DAY = { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95 };
  const sun = new THREE.DirectionalLight(DAY.sun, DAY.sunI); sun.castShadow = true; scene.add(sun, sun.target); scene.add(new THREE.HemisphereLight(DAY.hemiS, DAY.hemiG, DAY.hemiI));
  const fill = new THREE.DirectionalLight('#ffe6d6', DAY.sunI * 0.15); scene.add(fill);
  const el = THREE.MathUtils.degToRad(DAY.el), az = THREE.MathUtils.degToRad(DAY.az), lightDir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).normalize(); fill.position.copy(lightDir).multiplyScalar(-60).setY(20);
  onNote('Knete (Relief, Fingerabdrücke) …');
  const mkTex = (rel) => { const t = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  const tex31 = mkTex(REL.makeClayRelief({ size: 1024, seed: 31 })), U = V10.makeClayUniforms(THREE, tex31);
  let print = null; try { print = await V10.makePrintTexture(THREE, RAW(PIN.r2c, 'tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png').replace('raw.githubusercontent.com/georg-doc/kayfabizarro/', 'cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'), 2048); } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); }
  U.uClayToolOn.value = 0; U.uClayLegacyStroke.value = 1; U.uClayHexK.value = 3; U.uClayHexRot.value = 1; U.uClayHexFlow.value = 0; U.uClayFacetSoft.value = 0; U.uClayHand.value = 0.5; U.uClayTile.value = 1.6; U.uClayPrintTile.value = 4.5;
  if (print) { U.uClayPrint.value = print; U.uClayPrintOn.value = 1; } else U.uClayPrint.value = tex31;
  const clay = (pk, { vc = false, src = null, key = '' } = {}) => { const m = V10.makeClayMaterial(THREE, U, { src: src || new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: vc }), profile: { ...V10.PROFILES[pk], legacy: 1 } });
    const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, rr) => { ob(sh, rr); sh.fragmentShader = sh.fragmentShader.replace('if (uClayPrintOn > 0.5) {', 'if (uClayPrintOn > 0.5 && lodNear > 0.0) {');
      sh.vertexShader = sh.vertexShader.replace('vClayP = position; vClayN = normal;', '\n#ifdef USE_INSTANCING\n vClayP = (instanceMatrix * vec4(position, 1.0)).xyz; vClayN = mat3(instanceMatrix) * normal;\n#else\n vClayP = position; vClayN = normal;\n#endif\n'); };
    m.customProgramCacheKey = () => ck() + '-r2d' + key; return m; };
  const seedGeometry10 = (g, s) => V10.seedGeometry(THREE, g, s);
  const underMat = clay('terrainFg', { vc: true, key: 't' }), underMask = new THREE.MeshLambertMaterial({ color: MASK.under[1] }), hexMat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthTest: true });
  const trackMat = clay('road', { vc: true, key: 'r' });
  /* Übergänge: Joyride-Patchmuster kfbBlend (road-markings.m1.js @ 927a1b4, KFB_BLEND_GLSL) — drei Lagen über den Grasflecken:
     Fels am Rand (aTW.z), Sand an Bankett und Ufer (aTW.x), Pflaster an Plätzen und Wegen (aTW.y). Kein Alpha, keine Farbrampe. */
  const patchTop = (m, pal) => { const PU = { uTS: { value: new THREE.Color(pal.sand) }, uTP: { value: new THREE.Color(pal.paved) }, uTR: { value: new THREE.Color(pal.rock) }, uTCell: { value: 1.1 } };
    const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, rr) => { ob(sh, rr); Object.assign(sh.uniforms, PU);
      sh.vertexShader = 'attribute vec3 aTW; varying vec3 vTW; varying vec2 vTS;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vTW = aTW; vTS = (modelMatrix * vec4(position, 1.0)).xz;');
      sh.fragmentShader = 'uniform vec3 uTS, uTP, uTR; uniform float uTCell; varying vec3 vTW; varying vec2 vTS;\n' + BL.KFB_BLEND_GLSL + `
// Drei Größen je Übergang (Georg 03.10.): große Knetflecken (kfbBlend wie Joyride), dazu mittlere und kleine Tropfen nach außen
// und Tropfen der Grundfarbe zurück in die Fläche. Alles aus derselben kfbBlend-Funktion, nur Zellgröße und Gewicht verschieden.
float kfbLayer(vec2 p, float cell, float w, out float rim){ float r1, r2, r3, r4;
  float a = kfbBlend(p, cell, w, r1);
  float m = kfbBlend(p + 13.1, cell * 0.42, smoothstep(0.0, 0.95, w) * 0.5, r2);
  float s = kfbBlend(p + 27.7, cell * 0.2, smoothstep(0.0, 0.7, w) * 0.32, r3);
  float b = kfbBlend(p + 41.3, cell * 0.36, smoothstep(0.0, 0.95, 1.0 - w) * 0.42, r4);
  float sel = max(a, max(m, s)) * (1.0 - b); rim = max(max(r1 * a, r2 * m), max(r3 * s, r4 * b)); return sel; }
` + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
{ float r1, r2, r3; float a = kfbLayer(vTS, uTCell * 1.3, vTW.z, r1); diffuseColor.rgb = mix(diffuseColor.rgb, uTR, a) * (1.0 - 0.10 * r1);
  float b = kfbLayer(vTS + 31.7, uTCell, vTW.x, r2); diffuseColor.rgb = mix(diffuseColor.rgb, uTS, b) * (1.0 - 0.10 * r2);
  float c = kfbLayer(vTS + 57.3, uTCell * 0.8, vTW.y, r3); diffuseColor.rgb = mix(diffuseColor.rgb, uTP, c) * (1.0 - 0.12 * r3); }`); };
    m.customProgramCacheKey = () => ck() + '-tpatch'; m.userData.patch = PU; return m; };
  // Spender
  onNote('Natur-Spender laden (KayKit Forest, Quaternius) …');
  const loader = new GLTFLoader(), loadParts = async url => { const gl = await loader.loadAsync(url); gl.scene.updateMatrixWorld(true); const parts = []; gl.scene.traverse(o => { if (o.isMesh) { const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); parts.push({ geo: g, mat: o.material }); } }); return parts; };
  const NAT = ['Tree_1_A_Color1', 'Tree_1_B_Color1', 'Tree_1_C_Color1', 'Bush_1_A_Color1', 'Bush_2_A_Color1', 'Rock_1_A_Color1', 'Rock_2_A_Color1', 'Rock_3_A_Color1', 'Grass_1_A_Color1', 'Grass_2_A_Color1'], donors = {};
  const STONE = 'Rock Path Round Small by Quaternius - GMttpOEFKT.glb';
  await Promise.all([...NAT.map(n => loadParts(RAW(PIN.asset, FOREST + n + '.gltf')).then(p => donors[n] = p).catch(e => info.errors.push(n + ': ' + e.message))),
    loadParts(RAW(PIN.asset, QUAT + STONE)).then(p => { const bb = new THREE.Box3(); p.forEach(q => { q.geo.computeBoundingBox(); bb.union(q.geo.boundingBox); }); const s = bb.getSize(new THREE.Vector3()), k = 2.2 / Math.max(s.x, s.z);
      p.forEach(q => { q.geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); q.geo.scale(k, k, k); }); donors.stone = p; }).catch(e => info.errors.push('Quaternius: ' + e.message))]);
  const waterGeo = new THREE.IcosahedronGeometry(1, 2);
  let house = null;
  try { const parts = await loadParts(RAW(FAC_PIN, CITY + 'building_A.gltf')); const ts = performance.now();
    // Bodenplatte entfernen (Georg 03.10.): Dreiecke ganz auf oder unter der Plattenoberkante y = 0,1 fallen weg; das Haus steht danach mit seiner Unterkante im Gelände
    const plateTop = 0.1; let cutTris = 0;
    parts.forEach(p => { const P3 = p.geo.attributes.position, ix = p.geo.index ? Array.from(p.geo.index.array) : [...Array(P3.count).keys()], keep = [], lo = i => P3.getY(i) <= plateTop + 0.002;
      for (let t = 0; t < ix.length; t += 3) { if (lo(ix[t]) && lo(ix[t + 1]) && lo(ix[t + 2])) { cutTris++; continue; } keep.push(ix[t], ix[t + 1], ix[t + 2]); } p.geo.setIndex(keep); });
    info.plateCutTris = cutTris;
    const mc = new Map(), grp = new THREE.Group(); parts.forEach((p, i) => { if (!p.geo.attributes.normal) p.geo.computeVertexNormals(); let g = SOFT.softenGeometry(THREE, p.geo, {}).geometry; g = V8.seedGeometry(THREE, g.clone(), 101 + i) || g;
      if (!mc.has(p.mat)) mc.set(p.mat, null); grp.add(Object.assign(new THREE.Mesh(g, p.mat), { castShadow: true, receiveShadow: true })); });
    const relT = mkTex(REL.makeClayRelief({ size: 1024, seed: 11 })), U8 = V8.makeClayUniforms(THREE, relT); if (print) { U8.uClayPrint.value = print; U8.uClayPrintOn.value = 1; } else U8.uClayPrint.value = relT;
    grp.traverse(o => { if (o.isMesh) { const s = o.material; if (!mc.get(s)) mc.set(s, V8.makeClayMaterial(THREE, U8, { src: s, profile: V8.PROFILES.house })); o.material = mc.get(s); } });
    const bb = new THREE.Box3().setFromObject(grp); bb.min.y = plateTop; house = { grp, bb, softMs: Math.round(performance.now() - ts) };
  } catch (e) { info.errors.push('building_A: ' + e.message); }
  // Nachbearbeitung
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { samples: 4, type: THREE.HalfFloatType })); composer.addPass(new RenderPass(scene, camera));
  let ao = null; try { ao = new GTAOPass(scene, camera, 4, 4); ao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.4, thickness: 1.6, scale: 1.0, samples: 12 }); ao.blendIntensity = 0.85; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());

  const world = new THREE.Group(); scene.add(world); const anims = [];
  let P = null, Fd = null, T = null, terrain = null, hexL = null, biome = 'burg', layer = 'welt', showHex = false, shape = 'frei', topMat = null, topMask = null, tTop = null, tUnder = null;
  const disposeWorld = () => { anims.length = 0; world.traverse(o => { if (o.geometry && o.userData.own) o.geometry.dispose(); }); world.clear(); };
  async function build(seed, bio = biome, shp = shape) {
    biome = bio; shape = shp; const tb = performance.now(); onNote('Insel ' + seed + ' planen …'); disposeWorld();
    P = planIsland(seed, TC, shape); Fd = fields(P); const pal = R2C.PAL[biome] || R2C.PAL.burg;
    T = buildTerrain(P, Fd, pal); const MP = paintMaps(P, pal, T.box); if (T && topMat && topMat.map) topMat.map.dispose(); if (topMask && topMask.map) topMask.map.dispose(); T.maps = MP;
    topMat = patchTop(clay('terrainFg', { src: new THREE.MeshStandardMaterial({ map: MP.world }), key: 'tt' }), pal); topMask = new THREE.MeshLambertMaterial({ map: MP.mask });
    terrain = new THREE.Group(); tTop = new THREE.Mesh(T.top, layer === 'masken' ? topMask : topMat); tUnder = new THREE.Mesh(T.under, layer === 'masken' ? underMask : underMat);
    [tTop, tUnder].forEach(m => { m.castShadow = m.receiveShadow = true; m.userData.own = true; }); terrain.add(tTop, tUnder); world.add(terrain);
    hexL = new THREE.LineSegments(P.shape === 'hex' ? hexLines(P, Fd) : new THREE.BufferGeometry(), hexMat); hexL.visible = showHex; hexL.userData.own = true; world.add(hexL);
    const road = ST.buildTrack(THREE, P.stream, trackMat); road.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.own = true; } }); world.add(road);
    let checks = []; try { checks = TC.runChecks(P.stream).results; } catch (e) { checks = [{ id: 'checks', pass: false }]; }
    // Natur als eine Familie (KayKit Forest Nature): Gruppen nach Rule of Three statt Streu; Felsen am Rand; Grasbüschel auf den Übergängen
    const R = rng(seed * 101 + 5), free = (x, z) => Fd.maskAt(x, z) === 'veg', all = [];
    const scatter = (n, cx, cz, r0, r1, minD, test, tries = 200) => { const out = []; for (let k = 0; k < tries && out.length < n; k++) { const a = R() * Math.PI * 2, rr = r0 + (r1 - r0) * Math.sqrt(R()), x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
      if (!test(x, z) || [...out, ...all].some(o => Math.hypot(o[0] - x, o[1] - z) < minD)) continue; out.push([x, z]); } all.push(...out); return out; };
    const centres = scatter(3, P.c0[0], P.c0[1], 0, 40, 15, (x, z) => free(x, z) && -P.sdf(x, z) > 8, 1200);
    const T3 = ['Tree_1_A_Color1', 'Tree_1_B_Color1', 'Tree_1_C_Color1'], groups = { trees: [[], [], []], bush: [[], []], boulder: [], edge: [], grass: [] };
    centres.forEach((c, k) => { groups.trees[k].push(...scatter(3, c[0], c[1], 0, 5, 3.4, free)); groups.bush[k % 2].push(...scatter(3, c[0], c[1], 3.5, 7, 2.2, free)); groups.boulder.push(...scatter(1, c[0], c[1], 5, 8, 2, free)); });
    groups.edge = []; { const ec = scatter(3, P.c0[0], P.c0[1], 0, 60, 14, (x, z) => { const e = -P.sdf(x, z); return Fd.maskAt(x, z) === 'edge' && e > 0.9 && e < 2.4; }, 1500);
      ec.forEach(c => groups.edge.push(c, ...scatter(2, c[0], c[1], 1.4, 2.6, 1.2, (x, z) => -P.sdf(x, z) > 0.7 && Fd.maskAt(x, z) !== 'road'))); }
    groups.grass = [];   // Georg 03.10.: keine einzelnen Halme oder Blätter streuen; Gras nur als Teil einer Gruppe
    const trees = groups.trees.flat(), rocks = [...groups.boulder, ...groups.edge];
    const inst = (name, pts, scale, pk, opt = {}) => { const parts = donors[name]; if (!parts || !pts.length) return 0; let tris = 0;
      parts.forEach(p => { const m = opt.mat || clay(pk, { src: p.mat, key: 'i' + pk }); const im = new THREE.InstancedMesh(p.geo, m, pts.length); const M = new THREE.Matrix4(), q = new THREE.Quaternion();
        pts.forEach((pt, i) => { const s = scale * (0.85 + 0.3 * hash2(pt[0], pt[1], 3)); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash2(pt[0], pt[1], 7) * Math.PI * 2); M.compose(new THREE.Vector3(pt[0], Fd.heightAt(pt[0], pt[1]) - (opt.sink ?? 0.08), pt[1]), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M); });
        im.castShadow = opt.cast !== false; im.receiveShadow = true; im.userData.own = false; world.add(im); tris += (p.geo.index ? p.geo.index.count : p.geo.attributes.position.count) / 3 * pts.length; }); return tris; };
    let propTris = 0; groups.trees.forEach((pts, k) => propTris += inst(T3[k], pts, 1.5, 'nature'));
    propTris += inst('Bush_1_A_Color1', groups.bush[0], 3.2, 'nature') + inst('Bush_2_A_Color1', groups.bush[1], 3.2, 'nature') + inst('Rock_2_A_Color1', groups.boulder, 2.6, 'prop')
      + inst('Rock_1_A_Color1', groups.edge.filter((_, i) => i % 2 === 0), 2.2, 'prop') + inst('Rock_3_A_Color1', groups.edge.filter((_, i) => i % 2 === 1), 2.2, 'prop')
      + inst('Grass_1_A_Color1', groups.grass.filter((_, i) => i % 2 === 0), 1.5, 'nature', { cast: false, sink: 0.02 }) + inst('Grass_2_A_Color1', groups.grass.filter((_, i) => i % 2 === 1), 1.5, 'nature', { cast: false, sink: 0.02 });
    // Trittsteine (Quaternius) auf den Gehwegen
    const stones = []; for (const s of P.paths) { const L = Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]); for (let t = 1.4; t < L - 1.2; t += 2.4) { const u = t / L, j = (hash2(t, L, 5) - 0.5) * 0.5; const nx = -(s[1][1] - s[0][1]) / L, nz = (s[1][0] - s[0][0]) / L; stones.push([lerp(s[0][0], s[1][0], u) + nx * j, lerp(s[0][1], s[1][1], u) + nz * j]); } }
    propTris += inst('stone', stones, 1, 'prop', { sink: 0.06, cast: false });
    // Teich: Wasserfläche + Knet-Tröpfchen, die zum Ufer hin auslaufen
    let drops = 0;
    if (P.pond) { const pd = P.pond, wl = pd.h - 0.32, wg = new THREE.CircleGeometry(pd.r + 0.9, 64); wg.rotateX(-Math.PI / 2);
      { const pa = wg.attributes.position; for (let i = 1; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i), a = Math.atan2(z, x), k = 1 + 0.08 * vnoise(Math.cos(a) * 2, Math.sin(a) * 2, seed + 71); pa.setXYZ(i, x * k, 0, z * k); } }
      wg.translate(pd.x, wl, pd.z); seedGeometry10(wg, 909); const wm = clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water }), key: 'w' }); wm.roughness = 0.3; const water = new THREE.Mesh(wg, wm); water.receiveShadow = true; water.userData.own = true; world.add(water);
      const n = 260, im = new THREE.InstancedMesh(waterGeo, clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water }), key: 'wi' }), n), M = new THREE.Matrix4(), q = new THREE.Quaternion(); let k = 0;
      for (let i = 0; i < n * 4 && k < n; i++) { const a = R() * Math.PI * 2, t = Math.pow(R(), 1.8), rr = pd.r + 0.4 + t * 3.6, x = pd.x + Math.cos(a) * rr, z = pd.z + Math.sin(a) * rr; if (Fd.maskAt(x, z) === 'road') continue;
        const s = (0.07 + 0.16 * R()) * (1 - 0.6 * t); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), R() * 6.28); M.compose(new THREE.Vector3(x, Math.max(Fd.heightAt(x, z), wl) + s * 0.35, z), q, new THREE.Vector3(s, s * 0.62, s)); im.setMatrixAt(k++, M); }
      im.count = k; drops = k; im.castShadow = false; im.receiveShadow = true; world.add(im); }
    // Bach, Wasserfall, Schluchtbrücke
    let fallDrops = 0, piers = 0;
    if (P.creek) { const C = P.creek, end = C.lip ? C.lip.i : C.pts.length - 1, wpos = [], widx = [], hw2 = C.w + 1.15;
      for (let i = 0; i <= end; i++) { const a = C.pts[Math.max(0, i - 1)], b = C.pts[Math.min(C.pts.length - 1, i + 1)], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1, nx = -tz / l, nz = tx / l, y = Fd.heightAt(C.pts[i][0], C.pts[i][1]) + 0.42;
        for (const sd of [-1, 1]) wpos.push(C.pts[i][0] + nx * sd * hw2, y, C.pts[i][1] + nz * sd * hw2); if (i) { const v = (i - 1) * 2; widx.push(v, v + 2, v + 1, v + 1, v + 2, v + 3); } }
      const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(wpos, 3)); cg.setIndex(widx); cg.computeVertexNormals(); seedGeometry10(cg, 911);
      const wmat = clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water, side: THREE.DoubleSide }), key: 'w2' }); wmat.side = THREE.DoubleSide; wmat.roughness = 0.3;
      const cm = new THREE.Mesh(cg, wmat); cm.receiveShadow = true; cm.userData.own = true; world.add(cm);
      if (C.lip) { const L0 = C.lip.p, dv = C.lip.dir, y0 = Fd.heightAt(L0[0], L0[1]) + 0.42, nx = -dv[1], nz = dv[0], fp = [], fi = [], NF = 32, curve = t => [L0[0] + dv[0] * (0.6 + 3.8 * t), y0 - 24 * t * t, L0[1] + dv[1] * (0.6 + 3.8 * t)];
        for (let k2 = 0; k2 <= NF; k2++) { const t = k2 / NF, p = curve(t), w = hw2 * (0.85 + 0.45 * t); for (const sd of [-1, 1]) fp.push(p[0] + nx * sd * w, p[1], p[2] + nz * sd * w); if (k2) { const v = (k2 - 1) * 2; fi.push(v, v + 2, v + 1, v + 1, v + 2, v + 3); } }
        const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fg.setIndex(fi); fg.computeVertexNormals(); seedGeometry10(fg, 913);
        const fm = new THREE.Mesh(fg, wmat); fm.userData.own = true; world.add(fm);
        const n = 120, im = new THREE.InstancedMesh(waterGeo, clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water }), key: 'wd' }), n), seedD = [...Array(n)].map(() => [R(), R() * 2 - 1, 0.18 + 0.22 * R()]);
        im.castShadow = false; world.add(im); fallDrops = n; const M = new THREE.Matrix4(), q = new THREE.Quaternion(), V3 = new THREE.Vector3(), Sc = new THREE.Vector3();
        anims.push(now => { for (let i = 0; i < n; i++) { const [ph, lat, sz] = seedD[i], t = (ph + now * 0.00032) % 1, p = curve(t), w = hw2 * (0.85 + 0.45 * t) * lat, s = sz * (1 - 0.65 * t) * Math.min(1, t * 12);
          V3.set(p[0] + nx * w + dv[0] * 0.25, p[1] + 0.15, p[2] + nz * w + dv[1] * 0.25); Sc.set(s, s * 1.25, s); M.compose(V3, q, Sc); im.setMatrixAt(i, M); } im.instanceMatrix.needsUpdate = true; }); }
      // Stützen unter der Schluchtbrücke: Elefantenfuß · Taille · Bauch · Kapitell nach dem J14-Rezept (track-look.v5.js). PLATZHALTER bis buildClayStrand im Joyride-Owner.
      if (C.cross) { const S0 = P.stream.samples; let i0 = 0, bd = 1e9; P.poly.forEach((p, i) => { const d = Math.hypot(p[0] - C.cross[0], p[1] - C.cross[1]); if (d < bd) { bd = d; i0 = i; } });
        const lathe = (h, Rr) => { const segs = Math.max(1, Math.round(h / (3.6 * Rr * 2))), Pp = [[0.001, 0], [1.62 * Rr, 0], [1.66 * Rr, 0.18 * Rr], [1.45 * Rr, 0.6 * Rr], [1.08 * Rr, 1.1 * Rr]], y0 = 1.1 * Rr, y1 = h - 1.0 * Rr, Ls = (y1 - y0) / segs;
          for (let k2 = 0; k2 < segs; k2++) { const a = y0 + k2 * Ls; Pp.push([0.86 * Rr, a + 0.28 * Ls], [1.06 * Rr, a + 0.7 * Ls]); if (k2 < segs - 1) Pp.push([0.98 * Rr, a + 0.92 * Ls], [1.26 * Rr, a + Ls], [0.98 * Rr, a + Ls + 0.08 * Ls]); }
          Pp.push([0.98 * Rr, y1], [1.42 * Rr, h - 0.45 * Rr], [1.36 * Rr, h - 0.08 * Rr], [0.001, h]);
          const cv = new THREE.CatmullRomCurve3(Pp.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal'); return new THREE.LatheGeometry(cv.getPoints(50).map(v => new THREE.Vector2(Math.max(0.001, v.x), v.y)), 28); };
        const pm = clay('prop', { src: new THREE.MeshStandardMaterial({ color: pal.paved }), key: 'pier' });
        for (const off of [-4.2, 4.2]) { const tgt = S0[i0].s + off; let q = S0[0]; for (const qq of S0) { if (qq.s >= tgt) { q = qq; break; } }
          const mid = (q.slots[6][0] + q.slots[7][0]) / 2, x = q.p[0] + q.R[0] * mid, z = q.p[2] + q.R[2] * mid, gy = Fd.heightAt(x, z), top = q.p[1] + q.U[1] * q.slots[0][1] + 0.25, h = top - gy;
          if (h < 1.4) continue; const g = lathe(h + 0.4, clamp(h / 6, 0.75, 1.3)); g.rotateY(R() * Math.PI); g.rotateZ((R() - 0.5) * 0.08); g.translate(x, gy - 0.4, z); seedGeometry10(g, 500 + piers);
          const me = new THREE.Mesh(g, pm); me.castShadow = me.receiveShadow = true; me.userData.own = true; world.add(me); piers++; } } }
    // Häuser auf den Gebäudeplätzen, Front zum großen Platz
    const big = P.plazas.find(p => p.kind === 'big');
    if (house) P.pads.forEach(pd => { const g = house.grp.clone(true), sz = house.bb.getSize(new THREE.Vector3()), k = 9 / sz.y; g.scale.setScalar(k);
      g.position.set(pd.x - (house.bb.min.x + house.bb.max.x) / 2 * k, pd.h - house.bb.min.y * k - 0.04, pd.z - (house.bb.min.z + house.bb.max.z) / 2 * k);
      const tx = (big ? big.x : P.c0[0]) - pd.x, tz = (big ? big.z : P.c0[1]) - pd.z; const pivot = new THREE.Group(); pivot.position.set(pd.x, 0, pd.z); g.position.x -= pd.x; g.position.z -= pd.z; pivot.add(g); pivot.rotation.y = Math.atan2(tx, tz); world.add(pivot); });
    // Schatten auf die Insel gepasst
    const bb = new THREE.Box3().setFromObject(terrain); P.bb = bb; const fit = FIT.fitShadow(renderer, sun, lightDir, bb.clone().expandByScalar(4), { pad: 1.02 });
    let terrTris = T.geo.index.count / 3, roadTris = 0; road.traverse(o => { if (o.isMesh) roadTris += o.geometry.index.count / 3; });
    Object.assign(info, { seed, biome, shape, cells: P.cells.map(c => c.q != null ? [c.q, c.r] : c.xz.map(v => +v.toFixed(1)).concat(+c.rad.toFixed(1))), buildMs: Math.round(performance.now() - tb), terrTris, roadTris, propTris: Math.round(propTris), trees: trees.length, rocks: rocks.length, bushes: groups.bush.flat().length, grass: groups.grass.length, stones: stones.length, drops, pond: !!P.pond, creek: !!P.creek, canyon: !!(P.creek && P.creek.cross), waterfall: !!(P.creek && P.creek.lip), fallDrops, piers,
      checks: checks.length, checkFails: checks.filter(c => c.pass === false).map(c => c.id), core: TC.CORE_VERSION, samples: P.stream.samples.length, width: P.width, depth: T.depth, masks: MP.areas,
      pads: P.pads.length, plazas: P.plazas.map(p => p.kind + ' r' + p.r), shadow: '±' + fit.r + ' m', houseSoftMs: house ? house.softMs : null, span: bb.getSize(new THREE.Vector3()).toArray().map(v => Math.round(v)) });
    setView(view); onNote('Insel ' + seed + ' · ' + biome); return info; }

  let view = 'mittel', drive = null;
  const setView = id => { view = id; drive = null; controls.enabled = true; if (!P) return; const c = new THREE.Vector3(P.c0[0], 0, P.c0[1]);
    const S0 = P.stream.samples, big = P.plazas.find(p => p.kind === 'big') || { x: P.c0[0], z: P.c0[1], h: 0 };
    const orbit = (d, elv, azm, ty = 0) => { const e = THREE.MathUtils.degToRad(elv), a = THREE.MathUtils.degToRad(azm); camera.position.set(c.x + Math.sin(a) * Math.cos(e) * d, ty + Math.sin(e) * d, c.z + Math.cos(a) * Math.cos(e) * d); controls.target.set(c.x, ty, c.z); };
    if (id === 'top') { camera.position.set(c.x, 150, c.z + 0.01); controls.target.copy(c); }
    else if (id === 'mittel') orbit(105, 32, 35, -4);
    else if (id === 'fern') orbit(280, 26, 35, -8);
    else if (id === 'unten') { orbit(95, -14, 140, -10); }
    else if (id === 'bach') { const C = P.creek; if (C && C.cross) { const t = C.cross, i = C.pts.indexOf(t), a = C.pts[Math.max(0, i - 3)], b = C.pts[Math.min(C.pts.length - 1, i + 3)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, dx = (b[0] - a[0]) / l, dz = (b[1] - a[1]) / l, gy = Fd.heightAt(t[0], t[1]);
        const cx = t[0] + dx * 22 - dz * 9, cz = t[1] + dz * 22 + dx * 9; camera.position.set(cx, Math.max(gy + 7, Fd.heightAt(cx, cz) + 3), cz); controls.target.set(t[0], gy + 1.2, t[1]); } else orbit(105, 32, 35, -4); }
    else if (id === 'fall') { const C = P.creek; if (C && C.lip) { const t = C.lip.p, dv = C.lip.dir, gy = Fd.heightAt(t[0], t[1]); camera.position.set(t[0] + dv[0] * 26 - dv[1] * 14, gy - 8, t[1] + dv[1] * 26 + dv[0] * 14); controls.target.set(t[0] + dv[0] * 3, gy - 10, t[1] + dv[1] * 3); } else orbit(95, -14, 140, -10); }
    else if (id === 'fahr') { const q = S0[Math.floor(S0.length * 0.18)], p = new THREE.Vector3(...q.p), Tt = new THREE.Vector3(...q.T); camera.position.copy(p).addScaledVector(Tt, -7).add(new THREE.Vector3(0, 2.2, 0)); controls.target.copy(p).addScaledVector(Tt, 25).add(new THREE.Vector3(0, 1, 0)); }
    else if (id === 'lauf') { const pd = P.pads[0] || { x: P.c0[0], z: P.c0[1] }; const dx = pd.x - big.x, dz = pd.z - big.z, l = Math.hypot(dx, dz) || 1;
      camera.position.set(big.x - dx / l * 4, Fd.heightAt(big.x, big.z) + 1.7, big.z - dz / l * 4); controls.target.set(pd.x, Fd.heightAt(pd.x, pd.z) + 3, pd.z); }
    controls.update(); };
  const startDrive = () => { if (!P) return; drive = { s: 0, t0: performance.now() }; controls.enabled = false; view = 'fahrt'; };
  const resize = () => { const w = canvas.clientWidth || 4, h = canvas.clientHeight || 3; renderer.setSize(w, h, false); composer.setSize(w, h); if (ao) ao.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  let raf = 0, frames = 0, acc = 0, last = performance.now(), aoOn = true;
  const stat = { fps: 0, ms: 0, calls: 0, tris: 0, geoms: 0, tex: 0 };
  const loop = () => { raf = requestAnimationFrame(loop); const now = performance.now(), dt = now - last; last = now;
    if (drive && P) { const S0 = P.stream.samples, L = S0[S0.length - 1].s, sp = 14; drive.s = ((now - drive.t0) / 1000 * sp) % L; let i = S0.findIndex(q => q.s >= drive.s); if (i < 1) i = 1;
      const q = S0[i], p = new THREE.Vector3(...q.p), Tt = new THREE.Vector3(...q.T), U3 = new THREE.Vector3(...q.U); camera.position.copy(p).addScaledVector(Tt, -6).addScaledVector(U3, 2.3); camera.lookAt(p.clone().addScaledVector(Tt, 18).addScaledVector(U3, 1)); }
    else controls.update();
    for (const f of anims) f(now);
    renderer.info.reset(); const a = performance.now(); if (aoOn && ao) composer.render(); else renderer.render(scene, camera); const b = performance.now();
    frames++; acc += b - a; if (now - (stat._t || 0) > 1000) { stat.fps = Math.round(frames * 1000 / (now - (stat._t || now - 1000))); stat.ms = +(acc / Math.max(1, frames)).toFixed(1); frames = 0; acc = 0; stat._t = now; }
    stat.calls = renderer.info.render.calls; stat.tris = renderer.info.render.triangles; stat.geoms = renderer.info.memory.geometries; stat.tex = renderer.info.memory.textures; };
  await build(3);   // Seed 3: Teich, Bach, Schlucht unter der Straße und Wasserfall in einer Insel
  info.loadMs = Math.round(performance.now() - t0);
  loop();
  return { info, stat, build, setView, startDrive, _plan: () => P, stopDrive: () => { drive = null; controls.enabled = true; },
    setLayer(l) { layer = l; if (tTop) { tTop.material = l === 'masken' ? topMask : topMat; tUnder.material = l === 'masken' ? underMask : underMat; } },
    setHex(v) { showHex = v; if (hexL) hexL.visible = v; }, setAO(v) { aoOn = v; },
    recipe() { if (!P) return null; return { schema: 'kfb.r2d.island-recipe/0', seed: P.seed, shape: P.shape, grid: P.shape === 'hex' ? { kind: 'hex-pointy', S, cells: P.cells.map(c => [c.q, c.r]) } : { kind: 'free-blobs', blobs: P.cells.map(c => ({ xz: c.xz, r: c.rad })) }, biome, palette: { source: 'hex-archipel.r2c.js PAL @ ' + PIN.r2c.slice(0, 7), key: biome, values: R2C.PAL[biome] },
      masks: Object.fromEntries(Object.entries(MASK).map(([k, v]) => [k, { label: v[0], areaM2: (T.maps.areas || {})[k] || 0 }])), track: { core: TC.CORE_VERSION, pin: PIN.track, recipe: P.recipe }, pads: P.pads, plazas: P.plazas, paths: P.paths,
      assets: [...NAT.map(n => 'KayKit_Forest_Nature_Pack_1.0_FREE/' + n + ' @ ' + PIN.asset.slice(0, 7)), 'Quaternius/' + STONE + ' @ ' + PIN.asset.slice(0, 7), 'KayKit_City_Builder_Bits_1.0_FREE/building_A @ ' + FAC_PIN.slice(0, 7)], transitions: { owner: 'Joyride J14 road-markings.m1.js KFB_BLEND_GLSL @ ' + PIN.r2c.slice(0, 7), layers: ['Fels am Rand', 'Sand an Bankett/Ufer', 'Pflaster an Plätzen/Wegen'] }, pond: P.pond,
      lod: 'v0: keine LOD-Stufen; ein Terrain-Mesh, instanzierte Natur', underside: { depth: T.depth } }; },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); } };
}
