/* KFB World Core R2D v0 · eine zusammenhängende Knet-Insel (03.10.2026)
 * Brief R2D @ 14a1c55, Schritte 3–5 als erster sichtbarer Schnitt.
 * Unsichtbares Hexraster (9 logische Zellen, R2C-Maß S = 10) → EIN Geländekörper (Oberseite + Rand + Unterseite, ein Mesh).
 * Straße: Track Core (compileRecipe → buildTrack), unverändert. Gelände bekommt Straßenbett, Damm/Einschnitt, Brückenkopf.
 * Knete: clay-material.v10 Parität wie R2C. Paletten: PAL aus hex-archipel.r2c.js. Haus: KayKit building_A, Golden-Weg v8.
 * Biome (03.10.): BIOMES-Tabelle je Biom = Palette, Pflanzen-Satz, Geländecharakter, Unterseite, Landmarke, Himmel. Schnee aus dem KayKit Medieval Snow Biome.
 * Bäume: KayKit Forest, instanziert. Keine Figur (Register-To-do). Kein zweiter Owner für Straße, Fassade, Audio. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
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
const HEX_PIN = '34cde3f8f752d481a03c9714f1c3b3a8b2c15c46', SNOW_PIN = 'ab65e8c46ca3c07db4294214a63384975fb7d0d9';   // jüngster Commit je Pack-Ordner (GitHub API, 03.10.2026)
const FEST_PIN = '7600fa9e29d396eaa9c5a11532e63cdad7689e75', FESTP = 'media/3D_Assets/Kaykit_Festive Mini-Pack/assets/gltf/';
const HEXP = 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/', SNOWP = 'media/3D_Assets/Kaykit_Medieval Snow Biome/Models/objects/gltf/';
const fo = n => ({ id: n, url: () => RAW(PIN.asset, FOREST + n + '.gltf') }), sn = n => ({ id: n, url: () => RAW(SNOW_PIN, SNOWP + n + '.gltf.glb') }), fe = n => ({ id: n, url: () => RAW(FEST_PIN, FESTP + n + '.gltf.glb') }), hx = p => ({ id: p.split('/').pop().replace('.gltf', ''), url: () => RAW(HEX_PIN, HEXP + p) });
/* Schnee: Palette und Himmel sind lokale Kandidaten (R2C hat kein Schnee-Biom). Besitzer bleibt PAL in hex-archipel.r2c.js bzw. SKY_PRESETS in sky-core.r0a.js. */
export const SNOW_PAL = { grass: '#eef2f5', grass2: '#e3e9ee', paved: '#aeb4bb', sand: '#cfd6dd', rock: '#8b5a3c', lip: '#e6ecf1', hill: '#dbe3ea', water: '#62cfe2' };
const WINTER_SKY = { label: 'Winter (lokal R2D)', gradient: [[0, '#7fa6c9'], [0.4, '#a9c4dc'], [0.75, '#d6e3ee'], [1, '#eef2f5']], fog: '#cfdce7', sun: ['#f3f6ff', 2.5], hemi: ['#e8f0f8', '#97a3b2', 1.05], back: ['#dce6ff', 0.5], expo: 0.88 };
/* Je Biom: terr = Gelände (amp Hügelhöhe, fq Hügelgröße, terrace Stufenhöhe, roll = Randabfall [Tiefe, Breite])
   under = Unterseite v6 (depth Faktor, pw Verjüngung <1 bauchig · >1 schlank, drips senkrechte Ausläufer, soft Verschmelzradius m, strata Schichtrippen m, cap/ov Rundung der Oberfläche über die Kante m)
   treeF = Baumhöhe relativ zur Burg · lmk = Landmarke aus R2C LMK (H Zielhöhe m) · house = Haus statt building_A */
export const BIOMES = {
  burg: { label: 'Burg', pal: 'burg', sky: 'claybound', terr: { amp: 1, fq: 1, terrace: 0, roll: [0.6, 2.0] }, under: { depth: 1, pw: 0.85, drips: 4, soft: 2.6, strata: 0.18, cap: 1.4, ov: 0.45 },
    trees: ['Tree_1_A_Color1', 'Tree_1_B_Color1', 'Tree_1_C_Color1'].map(fo), bushes: ['Bush_1_A_Color1', 'Bush_2_A_Color1'].map(fo), treeF: 1, lmk: { ...hx('buildings/red/building_castle_red.gltf'), H: 15 }, house: null },
  utopia: { label: 'Utopia', pal: 'utopia', sky: 'tiny-tag', terr: { amp: 0.55, fq: 0.8, terrace: 0, roll: [1.0, 3.5] }, under: { depth: 0.75, pw: 0.6, drips: 2, soft: 3.2, strata: 0.1, cap: 1.6, ov: 0.5 },
    trees: ['Tree_2_A_Color1', 'Tree_2_C_Color1', 'Tree_3_A_Color1'].map(fo), bushes: ['Bush_3_A_Color1', 'Bush_3_B_Color1'].map(fo), treeF: 0.95, lmk: { ...hx('buildings/blue/building_church_blue.gltf'), H: 14 }, house: null },
  dystopia: { label: 'Dystopia', pal: 'dystopia', sky: 'tiny-abend', terr: { amp: 1.6, fq: 1.25, terrace: 1.7, roll: [0.3, 1.0] }, under: { depth: 1.2, pw: 1.05, drips: 6, soft: 1.9, strata: 0.3, cap: 1.1, ov: 0.35 },
    trees: ['Tree_Bare_1_A_Color1', 'Tree_Bare_2_A_Color1', 'Tree_Bare_1_C_Color1'].map(fo), bushes: ['Bush_4_A_Color1', 'Bush_4_C_Color1'].map(fo), treeF: 1.05, lmk: { ...hx('buildings/yellow/building_mine_yellow.gltf'), H: 10 }, house: null },
  protopia: { label: 'Protopia', pal: 'protopia', sky: 'claybound', terr: { amp: 1.5, fq: 0.7, terrace: 0, roll: [0.6, 2.0] }, under: { depth: 1, pw: 0.8, drips: 4, soft: 2.6, strata: 0.18, cap: 1.4, ov: 0.45 },
    trees: ['Tree_4_A_Color1', 'Tree_4_B_Color1', 'Tree_3_B_Color1'].map(fo), bushes: ['Bush_1_C_Color1', 'Bush_2_C_Color1'].map(fo), treeF: 1, lmk: { ...hx('buildings/green/building_windmill_green.gltf'), H: 14 }, house: null },
  schnee: { label: 'Schnee', pal: null, sky: 'winter', terr: { amp: 1.3, fq: 0.9, terrace: 0, roll: [0.4, 1.5] }, under: { depth: 1.05, pw: 0.95, drips: 5, soft: 2.2, strata: 0.15, cap: 1.6, ov: 0.5 },
    trees: ['tree_snow_medium', 'tree_snow_tall', 'tree_snow_low'].map(fe), bushes: [], treeF: 1, lmk: { ...sn('castle_snow'), H: 15 }, house: { ...sn('house_snow'), H: 8 } } };

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
function planIsland(seed, TC, shape = 'frei', cfg = BIOMES.burg) {
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
  const T0 = cfg.terr, natural = (x, z) => { let h = T0.amp * (1.7 * fbm(x * 0.03 * T0.fq, z * 0.03 * T0.fq, seed + 5) + 0.55 * fbm(x * 0.09 * T0.fq, z * 0.09 * T0.fq, seed + 9));
    if (T0.terrace) { const st = T0.terrace, q = Math.floor(h / st), f = h / st - q; h = (q + sstep(0.35, 0.65, f)) * st; } return h; };   // terrace: Tafelberge mit weichen Stufen
  // Gebäudeplätze: Zellmitten abseits der Straße und des Rands
  const padR = 6.5, cand = C.slice(1).map(c => ({ c, rd: roadDist(c.xz[0], c.xz[1]), e: -sdf(c.xz[0], c.xz[1]) })).filter(o => o.rd > hw + 8 && o.e > 8.5).sort((a, b) => b.rd - a.rd);
  const pads = []; for (const o of cand) { if (pads.length >= 3) break; if (pads.every(p => Math.hypot(p.x - o.c.xz[0], p.z - o.c.xz[1]) > padR * 2 + 6)) pads.push({ x: o.c.xz[0], z: o.c.xz[1], r: padR, h: natural(o.c.xz[0], o.c.xz[1]) * 0.6 + 0.35, cell: [o.c.q, o.c.r] }); }
  pads.forEach((p, i) => p.kind = i === 0 ? 'landmark' : 'house');   // weitester Platz von der Straße trägt die Landmarke
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
  if (B) { if (Sm) paths.push([[Sm.x, Sm.z], [B.x, B.z]]); paths.push([[B.x, B.z], nearestRoadPt(B.x, B.z)]); if (pads[1]) paths.push([[pads[1].x, pads[1].z], [B.x, B.z]]); if (pads[2]) paths.push([[pads[2].x, pads[2].z], [B.x, B.z]]); }
  // Teich: offenster freier Punkt außerhalb von Straße, Häusern, Plätzen und Wegen
  let pond = null, ps = -1e9; const pr = 4.5;
  for (let x = c0[0] - 45; x <= c0[0] + 45; x += 2) for (let z = c0[1] - 45; z <= c0[1] + 45; z += 2) { const e = -sdf(x, z); if (e < pr + 4) continue;
    const sc = Math.min(e - pr - 4, roadDist(x, z) - hw - pr - 4, ...[...pads, ...plazas].map(p => Math.hypot(p.x - x, p.z - z) - p.r - pr - 3), ...paths.map(s => distSeg(x, z, s[0], s[1]) - pr - 2)); if (sc > ps) { ps = sc; pond = { x, z, r: pr }; } }
  if (pond && ps < 0) pond = null; if (pond) pond.h = natural(pond.x, pond.z) * 0.6 + 0.1;
  // Bach: vom Teich zur Inselkante, mäandernd, bevorzugt unter der Straße hindurch (dort Schlucht + Brücke), endet als Wasserfall
  let creek = null;
  if (pond) {
    /* Bach-Führung (Georg 03.10.: »muss deutlich unter der Strecke durchfließen«): Teich → quer unter der Straßenmitte → gegenüber zur Kante.
       Kreuzungspunkt = Straßenprobe mit größtem Abstand zur Inselkante; Querung senkrecht zur Fahrtrichtung, 2 × (hw + 7) m lang. */
    let mi = 0, me = -1e9; for (let i = 2; i < poly.length - 2; i++) { const e = -sdf(poly[i][0], poly[i][1]); if (e > me) { me = e; mi = i; } }
    const m = poly[mi], ta = poly[mi - 2], tb = poly[mi + 2], tl = Math.hypot(tb[0] - ta[0], tb[1] - ta[1]) || 1, nx0 = -(tb[1] - ta[1]) / tl, nz0 = (tb[0] - ta[0]) / tl;
    const sg = Math.sign((pond.x - m[0]) * nx0 + (pond.z - m[1]) * nz0) || 1, nx = nx0 * sg, nz = nz0 * sg, off = hw + 7;
    const A = [m[0] + nx * off, m[1] + nz * off], Bp = [m[0] - nx * off, m[1] - nz * off];
    let er = 0; while (er < 120 && sdf(m[0] - nx * er, m[1] - nz * er) < 0) er += 0.5; const E = [m[0] - nx * (er + 3), m[1] - nz * (er + 3)];
    const ctrl = [[pond.x, pond.z], A, Bp, E].map(p => new THREE.Vector3(p[0], 0, p[1])), cv = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal'), raw = cv.getSpacedPoints(64);
    const ph = R() * 6.28, pts = raw.map((v, i) => { const t = i / 64, w = 1.4 * Math.sin(t * Math.PI * 3 + ph) * (1 - sstep(0.3, 0.45, t) * (1 - sstep(0.55, 0.7, t))), a = raw[Math.max(0, i - 1)], b = raw[Math.min(64, i + 1)], l = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      return [v.x - (b.z - a.z) / l * w, v.z + (b.x - a.x) / l * w]; }).filter(p => Math.hypot(p[0] - pond.x, p[1] - pond.z) > pond.r * 0.6);
    const cross = m.slice();
    let lip = null; for (let i = 1; i < pts.length; i++) if (sdf(pts[i][0], pts[i][1]) >= -0.3) { const ddx = pts[i][0] - pts[i - 1][0], ddz = pts[i][1] - pts[i - 1][1], l = Math.hypot(ddx, ddz) || 1; lip = { p: pts[i], i, dir: [ddx / l, ddz / l] }; break; }
    if (me > 9) creek = { pts, w: 1.3, cross, lip, dist: (x, z) => { let b = 1e9; for (let i = 0; i < pts.length - 1; i++) { const d = distSeg(x, z, pts[i], pts[i + 1]); if (d < b) b = d; } return b; } }; }
  return { seed, shape, roll: cfg.terr.roll, cells: C, c0, sdf, NA, edgeR, rAt, recipe, stream, width, hw, roadY: roadSurf, roadDist, natural, pads, plazas, paths, poly, pond, creek };
}

/* Höhe und Maske an jedem Punkt — analytisch, also für Gelände, Raster, Bäume und Häuser dieselbe Wahrheit */
function fields(P) {
  const { sdf, roadDist, natural, pads, plazas, paths, hw, roadY, pond, creek, roll } = P;
  const carveAt = (x, z) => { if (!creek) return [0, 1e9, 0]; const dc = creek.dist(x, z); let c = 1.1 * (1 - sstep(creek.w, creek.w + 2.6, dc)), k = 0;
    if (creek.cross) { k = 1 - sstep(7, 16, Math.hypot(x - creek.cross[0], z - creek.cross[1])); k *= sstep(3, 15, -sdf(x, z)); c += k * 6.5 * (1 - sstep(creek.w + 1.2, creek.w + 8, dc)); }
    let keep = 0; for (const p of [...pads, ...plazas]) keep = Math.max(keep, 1 - sstep(p.r + 0.5, p.r + 3.5, Math.hypot(x - p.x, z - p.z))); c *= 1 - keep; return [c, dc, k * (1 - keep)]; };
  const heightAt = (x, z) => { const e = -sdf(x, z); let h = natural(x, z) - roll[0] * Math.pow(1 - sstep(0, roll[1], e), 2);
    for (const p of [...pads, ...plazas]) { const w = 1 - sstep(p.r, p.r + 4, Math.hypot(x - p.x, z - p.z)); h = lerp(h, p.h, w); }
    if (pond) { const dp = Math.hypot(x - pond.x, z - pond.z); h = lerp(h, pond.h, 1 - sstep(pond.r + 1, pond.r + 5, dp)); h -= 0.9 * Math.pow(1 - sstep(0, pond.r + 0.6, dp), 0.7); }
    const d = roadDist(x, z), w = 1 - sstep(hw, hw + 7, d); h = lerp(h, roadY - 0.35, w); return h - carveAt(x, z)[0]; };
  // Übergangsgewichte für das Joyride-Patch-Muster (kfbBlend): Sand an Bankett und Ufer, Pflaster an Plätzen und Wegen, Fels am Rand
  const weightsAt = (x, z) => { const e = -sdf(x, z), d = roadDist(x, z);
    let sand = 1 - sstep(hw + 0.6, hw + 3.4, d), pav = 0;
    if (pond) sand = Math.max(sand, 1 - sstep(pond.r + 0.8, pond.r + 3.6, Math.hypot(x - pond.x, z - pond.z)));
    for (const p of [...pads, ...plazas]) pav = Math.max(pav, 1 - sstep(p.r - 1.2, p.r + 1.4, Math.hypot(x - p.x, z - p.z)));
    for (const s of paths) pav = Math.max(pav, 1 - sstep(0.8, 2.4, distSeg(x, z, s[0], s[1])));
    let rock = 0; if (creek) { const [, dc, k] = carveAt(x, z); sand = Math.max(sand, 1 - sstep(creek.w + 0.6, creek.w + 3, dc)); rock = Math.max(rock, k * (1 - sstep(creek.w + 1, creek.w + 6, dc))); }
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
function buildTerrain(P, F, pal, U0 = { depth: 1, pw: 0.85, drips: 4, soft: 2.6, strata: 0.18, cap: 1.4, ov: 0.45 }) {
  const { c0, NA, edgeR, seed } = P, NR = 44, NU = 4, rows = NR + 1 + NU, pos = new Float32Array(rows * NA * 3), colW = new Float32Array(rows * NA * 3), colM = new Float32Array(rows * NA * 3), counts = {};
  const C = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; }, cg = C(pal.grass), cg2 = C(pal.grass2), chill = C(pal.hill), cpav = C(pal.paved), csand = C(pal.sand), clip = C(pal.lip), crock = C(pal.rock), MC = Object.fromEntries(Object.entries(MASK).map(([k, v]) => [k, C(v[1])]));
  const R = rng(seed * 31 + 7), D = (30 + R() * 8) * U0.depth;
  let vi = 0; const wts = new Float32Array(rows * NA * 3);
  const put = (x, y, z, cw, m, wv = [0, 0, 1]) => { pos.set([x, y, z], vi * 3); colW.set(cw, vi * 3); colM.set(MC[m], vi * 3); wts.set(wv, vi * 3); counts[m] = (counts[m] || 0) + 1; vi++; };
  const edgeY = new Float32Array(NA);
  for (let i = 0; i <= NR; i++) { const t = 1 - Math.pow(1 - i / NR, 1.35);
    for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2, r = edgeR[a] * t, x = c0[0] + Math.cos(th) * r, z = c0[1] + Math.sin(th) * r, y = F.heightAt(x, z), m = F.maskAt(x, z), e = -P.sdf(x, z);
      const pn = fbm(x * 0.07, z * 0.07, seed + 21), d = P.roadDist(x, z);
      let cw = pn > 0.14 ? cg2 : pn < -0.32 ? chill : cg;
      if (m === 'building' || m === 'interact' || m === 'walk') cw = cpav; else if (d < P.hw + 1.6 && d >= P.hw - 2.2) cw = csand; else if (e < 1.3) cw = clip;
      if (i === NR) edgeY[a] = y; put(x, y, z, [1, 1, 1], m, F.weightsAt(x, z)); } }
  /* Kante (Georg 03.10.: kein Wulst, Schnee bis zum Rand): die Oberfläche rundet sich als Viertelkreis über die Kante und taucht dann in den Felskörper.
     Eckfarbe weiß → Farbkarte der Oberseite (Gras/Schnee) gilt auch auf der Rundung. */
  const capH = U0.cap, ov = U0.ov;
  for (let j = 1; j <= NU; j++) for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th), eR = edgeR[a], eY = edgeY[a]; let r, y;
    if (j <= 3) { const ang = j / 3 * Math.PI / 2; r = eR + ov * Math.sin(ang); y = eY - capH * (1 - Math.cos(ang)); } else { r = eR - 1.5; y = eY - capH - 1.0; }   // taucht direkt in die Scholle
    put(c0[0] + ct * r, y, c0[1] + st * r, j <= 3 ? [1, 1, 1] : crock.map(v => Math.min(1, v * 1.5)), 'under', [0, 0, 0]); }
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
  const body = buildBody(P, F, pal, U0, edgeY, D);
  return { geo: g, top: mk(0, cut), under: mk(cut, ix.length), body: body.geo, bodyInfo: body.info, box, depth: +body.info.depth.toFixed(1) };
}

/* Felskörper v6 (Georg 03.10. nach Studium der 8 Benchmarks): EINE schwebende Erd-/Felsscholle mit zentralem Schwerpunkt.
   Benchmarks gemeinsam: flache Oberseite, dünnes Band unter der Kante, darunter ein Körper, der sich vom Umriss der Insel zu EINER Hauptspitze
   unter dem Flächenschwerpunkt verjüngt; 2–6 kleinere Spitzen hängen im unteren Drittel SENKRECHT nach unten, nie seitlich.
   Umsetzung als Abstandsfeld → Marching Cubes:
     Scholle    : Querschnitt in Tiefe h = Inselumriss, um den Schwerpunkt auf k(h) = (1 − h/D)^pw geschrumpft (folgt dem Umriss, kein Drehkörper)
     Spitze     : Kugel am Ende, weich vereinigt → rund
     Ausläufer  : runde Kegel, Achse exakt senkrecht, Fuß in der Scholle (40–75 % Tiefe), Spitze oberhalb der Hauptspitze
     Oberseite  : Körper endet 1,6 m unter dem tiefsten Gelände der Umgebung (Minimumfilter 4 m) und 0,7 m innerhalb der Kante → stößt nirgends durch. */
function sdRoundCone(px, py, pz, a, b, r1, r2) { const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], l2 = bx * bx + by * by + bz * bz, rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2], y = qx * bx + qy * by + qz * bz, z = y - l2, cx = qx * l2 - bx * y, cy = qy * l2 - by * y, cz = qz * l2 - bz * y, x2 = cx * cx + cy * cy + cz * cz, y2 = y * y * l2, z2 = z * z * l2, k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2; if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1; return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1; }
function buildBody(P, F, pal, U0, edgeY, D) {
  const t0 = performance.now(), { c0, NA, edgeR, seed } = P, R = rng(seed * 53 + 17);
  let eyM = 0, Rm = 0, Rx = 0; for (let a = 0; a < NA; a++) { eyM += edgeY[a]; Rm += edgeR[a]; Rx = Math.max(Rx, edgeR[a]); } eyM /= NA; Rm /= NA;
  const G = 120, x0 = c0[0] - Rx - 4, z0 = c0[1] - Rx - 4, W = 2 * Rx + 8, cell = W / (G - 1), g2 = new Float32Array(G * G), gH = new Float32Array(G * G), gTop = new Float32Array(G * G);
  let ax = 0, az = 0, an = 0;
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) { const x = x0 + i * cell, z = z0 + j * cell, e = P.sdf(x, z), o = j * G + i; g2[o] = e; gH[o] = e < 1 ? F.heightAt(x, z) : 1e9; if (e < 0) { ax += x; az += z; an++; } }
  const Cx = an ? ax / an : c0[0], Cz = an ? az / an : c0[1], rad = Math.ceil(4 / cell);   // Flächenschwerpunkt
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) { let m = 1e9; for (let dj = -rad; dj <= rad; dj++) { const jj = j + dj; if (jj < 0 || jj >= G) continue; for (let di = -rad; di <= rad; di++) { const ii = i + di; if (ii < 0 || ii >= G || di * di + dj * dj > rad * rad) continue; m = Math.min(m, gH[jj * G + ii]); } }
    const x = x0 + i * cell, z = z0 + j * cell, e = g2[j * G + i], f = Math.atan2(z - c0[1], x - c0[0]) / (Math.PI * 2), fa = (f % 1 + 1) % 1 * NA, ia = Math.floor(fa), ta = fa - ia;
    const hl = e < 0 ? F.heightAt(x, z) : lerp(edgeY[ia % NA], edgeY[(ia + 1) % NA], ta), rim = hl - U0.cap * 0.75, inner = (m > 1e8 ? eyM : m) - 1.6;
    gTop[j * G + i] = lerp(inner, Math.min(rim, inner + 3), sstep(-5, -2, e)); }   // Rand: Scholle sitzt direkt unter der Kantenrundung, innen 1,6 m unter dem tiefsten Gelände
  const bil = (A, x, z) => { const fi0 = (x - x0) / cell, fj0 = (z - z0) / cell; if (fi0 < 0 || fj0 < 0 || fi0 > G - 1 || fj0 > G - 1) return 1e3;   // außerhalb = weit draußen (sonst Splitter unter der Spitze)
    const fi = Math.min(fi0, G - 1.001), fj = Math.min(fj0, G - 1.001), i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j, o = j * G + i;
    return lerp(lerp(A[o], A[o + 1], u), lerp(A[o + G], A[o + G + 1], u), v); };
  const yRef = eyM - U0.cap - 0.5, Dm = Math.max(Rm * 1.15, D * 1.05) * U0.depth, apex = [Cx + (R() - 0.5) * 0.08 * Rm, yRef - Dm, Cz + (R() - 0.5) * 0.08 * Rm], tipR = Rm * 0.035;
  const tipA = [apex[0], apex[1] + Dm * 0.28, apex[2]];
  const kAt = (y, x, z) => { const u = clamp((yRef - y) / Dm, 0, 1); return Math.max(0.015, Math.pow(1 - u, U0.pw) * (1 + 0.1 * vnoise(x * 0.045, z * 0.045 + y * 0.03, seed + 81))); };
  const sdScholle = (x, y, z) => { const k = kAt(y, x, z), cx = lerp(apex[0], Cx, k), cz = lerp(apex[2], Cz, k), qx = cx + (x - cx) / k, qz = cz + (z - cz) / k;
    return Math.max(Math.min(50, (bil(g2, qx, qz) - U0.ov * 0.8)) * k, y - bil(gTop, x, z)); };   // oben bündig unter dem Überhang der Kante
  // Ausläufer: senkrecht, Fuß im unteren Teil der Scholle, Abstand untereinander
  const drips = []; for (let n = 0, tries = 0; n < U0.drips && tries < 3000; tries++) { const u = 0.4 + 0.35 * R(), y = yRef - u * Dm, k = Math.pow(1 - u, U0.pw), ang = R() * Math.PI * 2, f = 0.45 + 0.35 * R();
    let rr = 0; while (rr < Rx && sdScholle(apex[0] + Math.cos(ang) * rr, y, apex[2] + Math.sin(ang) * rr) < 0) rr += 0.5; if (rr < 3) continue;
    const x = apex[0] + Math.cos(ang) * rr * f, z = apex[2] + Math.sin(ang) * rr * f, r1 = clamp(rr * (0.4 + 0.2 * R()), 1.4, Rm * 0.2);
    if (drips.some(d => Math.hypot(d.a[0] - x, d.a[2] - z) < (d.r1 + r1) * 1.1)) continue;
    const len = Math.min(r1 * (2.4 + 1.4 * R()), (y - apex[1]) * 0.85); drips.push({ a: [x, y + r1 * 0.6, z], b: [x, y - len, z], r1, r2: Math.max(0.55, r1 * 0.22) }); n++; }
  for (const c of drips) { const m = c.r1 + U0.soft * 2; c.min = [c.a[0] - m, c.b[1] - c.r2 - m, c.a[2] - m]; c.max = [c.a[0] + m, c.a[1] + m, c.a[2] + m]; }
  const yLo = apex[1] - tipR - 2, yHi = Math.max(...edgeY) + 0.5;
  const N = 96, mc = new MarchingCubes(N, new THREE.MeshBasicMaterial(), false, false, 300000), ISO = 80, Ly = yHi - yLo, k0 = U0.soft, st = U0.strata;
  for (let iz = 0; iz < N; iz++) { const z = z0 + iz / N * W;
    for (let iy = 0; iy < N; iy++) { const y = yLo + iy / N * Ly;
      for (let ix = 0; ix < N; ix++) { const x = x0 + ix / N * W;
        const e0 = bil(g2, x, z); if (e0 > 4 || y > bil(gTop, x, z) + 3) { mc.field[ix + N * iy + N * N * iz] = 0; continue; }   // sicher außen
        let d = sdScholle(x, y, z); d = smin(d, sdRoundCone(x, y, z, tipA, apex, Rm * 0.16, tipR), 3);   // Spitze läuft als Kegel aus, keine Kugel
        for (const c of drips) { if (x < c.min[0] || x > c.max[0] || y < c.min[1] || y > c.max[1] || z < c.min[2] || z > c.max[2]) continue; d = smin(d, sdRoundCone(x, y, z, c.a, c.b, c.r1, c.r2), k0); }
        if (d < 2.5) d += Math.min(1, kAt(y, x, z) * 3) * st * Math.sin(y * 0.8 + 2.5 * vnoise(x * 0.05, z * 0.05, seed + 71)) + Math.min(1, kAt(y, x, z) * 3) * 0.5 * vnoise(x * 0.12 + y * 0.05, z * 0.12 - y * 0.04, seed + 73);
        mc.field[ix + N * iy + N * N * iz] = ISO - d * 6; } } }
  mc.isolation = ISO; mc.update();
  const n = mc.count, pa = mc.positionArray, na = mc.normalArray, pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3), crock = new THREE.Color(pal.rock);
  const sx = W / 2, sy = Ly / 2, sz = W / 2;
  for (let i = 0; i < n; i++) { const x = x0 + (pa[i * 3] + 1) * sx, y = yLo + (pa[i * 3 + 1] + 1) * sy, z = z0 + (pa[i * 3 + 2] + 1) * sz; pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    let nx = na[i * 3] / sx, ny = na[i * 3 + 1] / sy, nz = na[i * 3 + 2] / sz; const l = Math.hypot(nx, ny, nz) || 1; nor[i * 3] = nx / l; nor[i * 3 + 1] = ny / l; nor[i * 3 + 2] = nz / l;
    const u = clamp((yRef - y) / Dm, 0, 1), layer = Math.floor((yRef - y) / 3 + 0.5 * vnoise(x * 0.05, z * 0.05, seed + 75)), tone = (layer % 2 ? 0.94 : 1) * (1 - 0.22 * u);
    col[i * 3] = Math.min(1, crock.r * 1.5) * tone; col[i * 3 + 1] = Math.min(1, crock.g * 1.5) * tone; col[i * 3 + 2] = Math.min(1, crock.b * 1.5) * tone; }
  mc.geometry.dispose();
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  return { geo, info: { tris: n / 3, cones: drips.length, depth: eyM - apex[1] + tipR, apexOff: +Math.hypot(apex[0] - Cx, apex[2] - Cz).toFixed(2), ms: Math.round(performance.now() - t0), voxels: N } };
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
  const [V10, REL, V8, SOFT, FIT, R2C, TC, ST, BL, SKYM] = await Promise.all([r('lab-clay/clay-material.v10.js'), r('lab-clay/clay-relief.v2.js'), r('golden/k1/lab-clay/clay-material.v8.js'), r('golden/k1/lab-clay/clay-soften.v1.js'), r('lab-world/shadow-fit.v1.js'), r('lab-world/hex-archipel.r2c.js'),
    importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/track-core.mjs'), importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/stream-to-three.mjs'), importPinned(PIN.r2c, J14 + 'lab-track/road-markings.m1.js'), r('lab-world/sky-core.r0a.js')]);
  info.modules = MODLOG.length;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede'); scene.fog = new THREE.Fog('#96bede', 260, 900);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.maxDistance = 600;
  const DAY = { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95 };
  const sun = new THREE.DirectionalLight(DAY.sun, DAY.sunI); sun.castShadow = true; const hemi = new THREE.HemisphereLight(DAY.hemiS, DAY.hemiG, DAY.hemiI); scene.add(sun, sun.target, hemi);
  const fill = new THREE.DirectionalLight('#ffe6d6', DAY.sunI * 0.15); scene.add(fill);
  const el = THREE.MathUtils.degToRad(DAY.el), az = THREE.MathUtils.degToRad(DAY.az), lightDir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).normalize(); fill.position.copy(lightDir).multiplyScalar(-60).setY(20);
  // Himmel je Biom: Kuppel + Licht aus sky-core.r0a.js (R2C-Besitzer), Patch wie in hex-archipel.r2c.js
  const SKY = SKYM.makeSkyDome(THREE, 1200); SKY.mesh.material.fragmentShader = SKY.mesh.material.fragmentShader.replace('max(vD.y, 0.0)', 'abs(vD.y) * 0.8').replace(/\}\s*$/, ' gl_FragColor = linearToOutputTexel(gl_FragColor); }'); SKY.mesh.material.needsUpdate = true; scene.add(SKY.mesh);
  const SKYP = { ...SKYM.SKY_PRESETS, winter: WINTER_SKY };
  const setSky = k => { const p = SKYP[k] || SKYP.claybound; SKY.paint(p); scene.background = new THREE.Color(p.fog); scene.fog.color.set(p.fog); sun.color.set(p.sun[0]); sun.intensity = p.sun[1];
    hemi.color.set(p.hemi[0]); hemi.groundColor.set(p.hemi[1]).lerp(new THREE.Color('#e6d3bd'), 0.45); hemi.intensity = p.hemi[2]; fill.color.set(p.back[0]); fill.intensity = p.back[1] * 0.72; renderer.toneMappingExposure = p.expo; };
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
  const donors = {}, hOf = parts => { const b = new THREE.Box3(); parts.forEach(p => { p.geo.computeBoundingBox(); b.union(p.geo.boundingBox); }); return b.max.y - b.min.y; };
  const donor = async d => { if (d.id in donors) return donors[d.id]; try { const p = await loadParts(d.url()); p.h = hOf(p); { const b = new THREE.Box3(); p.forEach(q => b.union(q.geo.boundingBox)); p.rxz = Math.max(-b.min.x, b.max.x, -b.min.z, b.max.z); } donors[d.id] = p; } catch (e) { info.errors.push(d.id + ': ' + e.message); donors[d.id] = null; } return donors[d.id]; };
  await Promise.all([...BIOMES.burg.trees, ...BIOMES.burg.bushes].map(donor));
  // Maß: Burg-Bäume (Tree_1_A × 1,5) und Büsche (Bush_1_A × 3,2) von gestern sind die Referenzhöhe für alle Biome
  const REF = { tree: (donors.Tree_1_A_Color1 ? donors.Tree_1_A_Color1.h : 4) * 1.5, bush: (donors.Bush_1_A_Color1 ? donors.Bush_1_A_Color1.h : 1) * 3.2 };
  const waterGeo = new THREE.IcosahedronGeometry(1, 2);
  // Gebäude (Haus, Landmarke) im Golden-Weg v8: Sockel weg (cutY absolut oder cutFrac der Höhe), weich, Knete. Cache je Modell.
  const bcache = {}; let U8 = null;
  const prepBuilding = async (key, url, { cutY = null, cutFrac = 0, soft = true } = {}) => { if (key in bcache) return bcache[key];
    try { const parts = await loadParts(url); const ts = performance.now(), b0 = new THREE.Box3(); parts.forEach(p => { p.geo.computeBoundingBox(); b0.union(p.geo.boundingBox); });
      const doCut = cutY != null || cutFrac > 0, plateTop = cutY != null ? cutY : b0.min.y + (b0.max.y - b0.min.y) * cutFrac; let cutTris = 0;
      if (doCut) parts.forEach(p => { const P3 = p.geo.attributes.position, ix = p.geo.index ? Array.from(p.geo.index.array) : [...Array(P3.count).keys()], keep = [], lo = i => P3.getY(i) <= plateTop + 0.002;
        for (let t = 0; t < ix.length; t += 3) { if (lo(ix[t]) && lo(ix[t + 1]) && lo(ix[t + 2])) { cutTris++; continue; } keep.push(ix[t], ix[t + 1], ix[t + 2]); } p.geo.setIndex(keep); });
      if (!U8) { const relT = mkTex(REL.makeClayRelief({ size: 1024, seed: 11 })); U8 = V8.makeClayUniforms(THREE, relT); if (print) { U8.uClayPrint.value = print; U8.uClayPrintOn.value = 1; } else U8.uClayPrint.value = relT; }
      // soft = Golden-Weg v8 (weich + Knet-Verformung, nur building_A). soft:false = Geometrie unverändert, nur Knet-Oberfläche wie die Bäume (v10):
      // Hexagon- und Schnee-Modelle sind Low-Poly mit Einzelteilen (Fahnen, Zinnen), die Verformung reißt sie auseinander.
      const mc = new Map(), grp = new THREE.Group(); parts.forEach((p, i) => { if (!p.geo.attributes.normal) p.geo.computeVertexNormals(); let g = p.geo; if (soft) { g = SOFT.softenGeometry(THREE, p.geo, soft === 'gentle' ? { iters: 4, lump: 0.003, maxLevels: 2, maxTris: 60000 } : {}).geometry; g = V8.seedGeometry(THREE, g.clone(), 101 + i) || g; }
        if (!mc.has(p.mat)) mc.set(p.mat, null); grp.add(Object.assign(new THREE.Mesh(g, p.mat), { castShadow: true, receiveShadow: true })); });
      grp.traverse(o => { if (o.isMesh) { const sm = o.material; if (!mc.get(sm)) mc.set(sm, soft === true ? V8.makeClayMaterial(THREE, U8, { src: sm, profile: V8.PROFILES.house }) : clay('prop', { src: sm, key: 'lm' })); o.material = mc.get(sm); } });
      const bb = new THREE.Box3().setFromObject(grp); if (doCut) bb.min.y = plateTop; return bcache[key] = { grp, bb, softMs: Math.round(performance.now() - ts), cutTris };
    } catch (e) { info.errors.push(key + ': ' + e.message); return bcache[key] = null; } };
  const house = await prepBuilding('building_A', RAW(FAC_PIN, CITY + 'building_A.gltf'), { cutY: 0.1 }); info.plateCutTris = house ? house.cutTris : 0;
  // Nachbearbeitung
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { samples: 4, type: THREE.HalfFloatType })); composer.addPass(new RenderPass(scene, camera));
  let ao = null; try { ao = new GTAOPass(scene, camera, 4, 4); ao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.4, thickness: 1.6, scale: 1.0, samples: 12 }); ao.blendIntensity = 0.85; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());

  const world = new THREE.Group(); scene.add(world); const anims = [];
  let P = null, Fd = null, T = null, terrain = null, hexL = null, biome = 'burg', layer = 'welt', showHex = false, shape = 'frei', topMat = null, topMask = null, tTop = null, tUnder = null, tBody = null;
  const disposeWorld = () => { anims.length = 0; world.traverse(o => { if (o.geometry && o.userData.own) o.geometry.dispose(); }); world.clear(); };
  async function build(seed, bio = biome, shp = shape) {
    biome = bio; shape = shp; const tb = performance.now(); onNote('Insel ' + seed + ' planen …'); disposeWorld();
    const cfg = BIOMES[biome] || BIOMES.burg; P = planIsland(seed, TC, shape, cfg); Fd = fields(P); const pal = cfg.pal ? R2C.PAL[cfg.pal] : SNOW_PAL; setSky(cfg.sky);
    onNote('Biom ' + cfg.label + ': Pflanzen und Landmarke laden …'); await Promise.all([...cfg.trees, ...cfg.bushes].map(donor));
    const lmk = await prepBuilding(cfg.lmk.id, cfg.lmk.url(), { cutFrac: cfg.lmk.cut || 0, soft: 'gentle' }), hs = cfg.house ? await prepBuilding(cfg.house.id, cfg.house.url(), { cutFrac: cfg.house.cut || 0, soft: 'gentle' }) : house;
    T = buildTerrain(P, Fd, pal, cfg.under); const MP = paintMaps(P, pal, T.box); if (T && topMat && topMat.map) topMat.map.dispose(); if (topMask && topMask.map) topMask.map.dispose(); T.maps = MP;
    topMat = patchTop(clay('terrainFg', { src: new THREE.MeshStandardMaterial({ map: MP.world }), key: 'tt' }), pal); topMask = new THREE.MeshLambertMaterial({ map: MP.mask });
    terrain = new THREE.Group(); tTop = new THREE.Mesh(T.top, layer === 'masken' ? topMask : topMat); tUnder = new THREE.Mesh(T.under, layer === 'masken' ? underMask : underMat);
    tBody = new THREE.Mesh(T.body, layer === 'masken' ? underMask : underMat);
    [tTop, tUnder, tBody].forEach(m => { m.castShadow = m.receiveShadow = true; m.userData.own = true; }); terrain.add(tTop, tUnder, tBody); world.add(terrain);
    hexL = new THREE.LineSegments(P.shape === 'hex' ? hexLines(P, Fd) : new THREE.BufferGeometry(), hexMat); hexL.visible = showHex; hexL.userData.own = true; world.add(hexL);
    const road = ST.buildTrack(THREE, P.stream, trackMat); road.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.own = true; } }); world.add(road);
    let checks = []; try { checks = TC.runChecks(P.stream).results; } catch (e) { checks = [{ id: 'checks', pass: false }]; }
    // Natur als eine Familie (KayKit Forest Nature): Gruppen nach Rule of Three statt Streu; Felsen am Rand; Grasbüschel auf den Übergängen
    const R = rng(seed * 101 + 5), free = (x, z) => Fd.maskAt(x, z) === 'veg', all = [];
    const scatter = (n, cx, cz, r0, r1, minD, test, tries = 200) => { const out = []; for (let k = 0; k < tries && out.length < n; k++) { const a = R() * Math.PI * 2, rr = r0 + (r1 - r0) * Math.sqrt(R()), x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
      if (!test(x, z) || [...out, ...all].some(o => Math.hypot(o[0] - x, o[1] - z) < minD)) continue; out.push([x, z]); } all.push(...out); return out; };
    /* Georg 03.10.: Bäume standen auf der Straße, im Hang und am Bach. Jetzt zählt der GRUNDRISS (gemessener Kronenradius × Maßstab):
       Krone frei von Straße, Platz, Weg, Wasser und Rand; Hang unter der Krone höchstens 0,8 m + 0,2·r Höhenunterschied. */
    const T3 = cfg.trees.map(d => d.id), B2 = cfg.bushes.map(d => d.id), groups = { trees: [[], [], []], bush: [[], []], boulder: [], edge: [], grass: [] };
    const tSc = id => donors[id] ? REF.tree * (cfg.treeF || 1) / donors[id].h : 0, bSc = id => donors[id] ? REF.bush / donors[id].h : 0, fp = (id, sc) => donors[id] ? donors[id].rxz * sc * 1.15 : 1.5;
    let rejected = 0; const fits = R0 => (x, z) => { const ok = (() => { if (Fd.maskAt(x, z) !== 'veg') return false; const q = R0 * 0.6;
      if (P.roadDist(x, z) < P.hw + R0 + 0.8 || -P.sdf(x, z) < q + 1.5) return false;
      if (P.creek && P.creek.dist(x, z) < P.creek.w + 3 + q) return false; if (P.pond && Math.hypot(x - P.pond.x, z - P.pond.z) < P.pond.r + 2 + q) return false;
      for (const p of [...P.pads, ...P.plazas]) if (Math.hypot(x - p.x, z - p.z) < p.r + q) return false; for (const sg of P.paths) if (distSeg(x, z, sg[0], sg[1]) < 1.4 + q * 0.6) return false;
      let lo = 1e9, hi = -1e9; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, h = Fd.heightAt(x + Math.cos(a) * q, z + Math.sin(a) * q); lo = Math.min(lo, h); hi = Math.max(hi, h); } return hi - lo < 0.8 + 0.2 * q; })(); if (!ok) rejected++; return ok; };
    const centres = scatter(3, P.c0[0], P.c0[1], 0, 40, 15, (x, z) => -P.sdf(x, z) > 8 && fits(3)(x, z), 1200);
    centres.forEach((c, k) => { const ti = T3[k % T3.length], tr = fp(ti, tSc(ti)), bi = B2.length ? B2[k % B2.length] : null, br = bi ? fp(bi, bSc(bi)) : 1;
      groups.trees[k].push(...scatter(3, c[0], c[1], 0, 5 + tr, Math.max(3.4, tr * 1.3), fits(tr), 400)); if (bi) groups.bush[k % 2].push(...scatter(3, c[0], c[1], 3.5, 7 + br, Math.max(2.2, br * 1.4), fits(br), 300)); });
    groups.edge = []; { const ec = scatter(3, P.c0[0], P.c0[1], 0, 60, 14, (x, z) => { const e = -P.sdf(x, z); return Fd.maskAt(x, z) === 'edge' && e > 0.9 && e < 2.4; }, 1500);
      ec.forEach(c => groups.edge.push(c, ...scatter(2, c[0], c[1], 1.4, 2.6, 1.2, (x, z) => -P.sdf(x, z) > 0.7 && Fd.maskAt(x, z) !== 'road'))); }
    groups.grass = [];   // Georg 03.10.: keine einzelnen Halme oder Blätter streuen; Gras nur als Teil einer Gruppe
    const trees = groups.trees.flat(), rocks = [];   // Felsen nicht gerendert, Zähler zeigt das Gerenderte
    const inst = (name, pts, scale, pk, opt = {}) => { const parts = donors[name]; if (!parts || !pts.length) return 0; let tris = 0;
      parts.forEach(p => { const m = opt.mat || clay(pk, { src: p.mat, key: 'i' + pk }); const im = new THREE.InstancedMesh(p.geo, m, pts.length); const M = new THREE.Matrix4(), q = new THREE.Quaternion();
        pts.forEach((pt, i) => { const s = scale * (0.85 + 0.3 * hash2(pt[0], pt[1], 3)); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash2(pt[0], pt[1], 7) * Math.PI * 2); M.compose(new THREE.Vector3(pt[0], Fd.heightAt(pt[0], pt[1]) - (opt.sink ?? 0.08), pt[1]), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M); });
        im.castShadow = opt.cast !== false; im.receiveShadow = true; im.userData.own = false; world.add(im); tris += (p.geo.index ? p.geo.index.count : p.geo.attributes.position.count) / 3 * pts.length; }); return tris; };
    let propTris = 0, treeShown = 0, bushShown = 0;
    groups.trees.forEach((pts, k) => { const id = T3[k % T3.length], d = donors[id]; if (d) { propTris += inst(id, pts, REF.tree * (cfg.treeF || 1) / d.h, 'nature'); treeShown += pts.length; } });
    groups.bush.forEach((pts, k) => { const id = B2[k % Math.max(1, B2.length)], d = id && donors[id]; if (d) { propTris += inst(id, pts, REF.bush / d.h, 'nature'); bushShown += pts.length; } });
    propTris += 0
      // Georg 03.10.: Felsen (KayKit Rock_1/2/3) raus, wirken unecht und falsch platziert. Zurück erst mit eigener Platzierungsregel.
      + inst('Grass_1_A_Color1', groups.grass.filter((_, i) => i % 2 === 0), 1.5, 'nature', { cast: false, sink: 0.02 }) + inst('Grass_2_A_Color1', groups.grass.filter((_, i) => i % 2 === 1), 1.5, 'nature', { cast: false, sink: 0.02 });
    // Georg 03.10.: Quaternius-Trittsteine raus (irreführend als Design). Zurück erst mit Bauanleitung, siehe POSTMORTEM_QUATERNIUS_PFADSTEINE.
    const stones = []; if (false) { for (const s of P.paths) { const L = Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]); for (let t = 1.4; t < L - 1.2; t += 2.4) { const u = t / L, j = (hash2(t, L, 5) - 0.5) * 0.5; const nx = -(s[1][1] - s[0][1]) / L, nz = (s[1][0] - s[0][0]) / L; stones.push([lerp(s[0][0], s[1][0], u) + nx * j, lerp(s[0][1], s[1][1], u) + nz * j]); } }
    propTris += inst('stone', stones, 1, 'prop', { sink: 0.06, cast: false }); }
    // Teich: Wasserfläche + Knet-Tröpfchen, die zum Ufer hin auslaufen
    let drops = 0;
    if (P.pond) { const pd = P.pond, wl = pd.h - 0.32, wg = new THREE.CircleGeometry(pd.r + 0.9, 64); wg.rotateX(-Math.PI / 2);
      { const pa = wg.attributes.position; for (let i = 1; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i), a = Math.atan2(z, x), k = 1 + 0.08 * vnoise(Math.cos(a) * 2, Math.sin(a) * 2, seed + 71); pa.setXYZ(i, x * k, 0, z * k); } }
      wg.translate(pd.x, wl, pd.z); seedGeometry10(wg, 909); const wm = clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water }), key: 'w' }); wm.roughness = 0.3; const water = new THREE.Mesh(wg, wm); water.receiveShadow = true; water.userData.own = true; world.add(water);
      // Georg 03.10.: Ufer-Knetperlen raus (gleiches Bastel-Muster wie die Strömungsperlen)
      if (false) { const n = 260, im = new THREE.InstancedMesh(waterGeo, clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water }), key: 'wi' }), n), M = new THREE.Matrix4(), q = new THREE.Quaternion(); let k = 0;
      for (let i = 0; i < n * 4 && k < n; i++) { const a = R() * Math.PI * 2, t = Math.pow(R(), 1.8), rr = pd.r + 0.4 + t * 3.6, x = pd.x + Math.cos(a) * rr, z = pd.z + Math.sin(a) * rr; if (Fd.maskAt(x, z) === 'road') continue;
        const s = (0.07 + 0.16 * R()) * (1 - 0.6 * t); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), R() * 6.28); M.compose(new THREE.Vector3(x, Math.max(Fd.heightAt(x, z), wl) + s * 0.35, z), q, new THREE.Vector3(s, s * 0.62, s)); im.setMatrixAt(k++, M); }
      im.count = k; drops = k; im.castShadow = false; im.receiveShadow = true; world.add(im); } }
    // Bach, Wasserfall, Schluchtbrücke
    let fallDrops = 0, piers = 0;
    if (P.creek) { const C = P.creek, end = C.lip ? C.lip.i : C.pts.length - 1, hw2 = C.w + 1.15, NL = 8, rows = [];
      /* Georg 03.10. (2): Bach und Wasserfall sind EINE Fläche. Kein Saumstreifen, keine hängende Zunge als zweites Teil, keine Strömungsperlen.
         Die Bachfläche läuft über die Kante weiter, biegt nach unten; an ihrem Saum ziehen sich Tropfen aus der Fläche heraus (Saum-Vertices werden mitgezogen). */
      for (let i = 0; i <= end; i++) { const pa = C.pts[Math.max(0, i - 1)], pb = C.pts[Math.min(C.pts.length - 1, i + 1)], tx = pb[0] - pa[0], tz = pb[1] - pa[1], l = Math.hypot(tx, tz) || 1;
        rows.push({ x: C.pts[i][0], z: C.pts[i][1], y: Fd.heightAt(C.pts[i][0], C.pts[i][1]) + 0.42, tx: tx / l, tz: tz / l, w: hw2 }); }
      const R0 = rows[rows.length - 1], dv = C.lip ? C.lip.dir : [R0.tx, R0.tz], NT = C.lip ? 10 : 0;
      for (let k = 1; k <= NT; k++) { const u = k / NT, out = 1.35 * Math.sin(u * Math.PI * 0.5), down = 0.3 * u * u + 1.2 * u * u * u, bt = sstep(0, 0.4, u);
        rows.push({ x: R0.x + dv[0] * out, z: R0.z + dv[1] * out, y: R0.y - down, tx: lerp(R0.tx, dv[0], bt), tz: lerp(R0.tz, dv[1], bt), w: hw2 * (1 - 0.1 * u * u), hem: k === NT ? 1 : k === NT - 1 ? 0.45 : 0 }); }
      const NV = NL + 1, wpos = new Float32Array(rows.length * NV * 3), base = new Float32Array(rows.length * NV * 3), widx = [];
      rows.forEach((r, i) => { const nx = -r.tz, nz = r.tx; for (let b2 = 0; b2 < NV; b2++) { const v = b2 / NL, q = v * 2 - 1, lat = q * r.w, dome = 0.07 * (1 - q * q) * (r.hem === undefined ? 1 : 1 - (i - end) / NT);
        const wob = r.hem ? -0.1 * Math.sin(v * Math.PI * 2.6 + seed) : 0; base.set([r.x + nx * lat, r.y + dome + wob, r.z + nz * lat], (i * NV + b2) * 3); }
        if (i) for (let b2 = 0; b2 < NL; b2++) { const v0 = (i - 1) * NV + b2; widx.push(v0, v0 + NV, v0 + 1, v0 + 1, v0 + NV, v0 + NV + 1); } });
      wpos.set(base); const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(wpos, 3)); cg.setIndex(widx); cg.computeVertexNormals(); seedGeometry10(cg, 911);
      const wmat = clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water, side: THREE.DoubleSide }), key: 'w2' }); wmat.side = THREE.DoubleSide; wmat.roughness = 0.3;
      const cm = new THREE.Mesh(cg, wmat); cm.receiveShadow = true; cm.userData.own = true; world.add(cm);
      if (C.lip) { const hemRow = rows.length - 1, hemAt = v => { const f = v * NL, b0 = Math.min(NL - 1, Math.floor(f)), t = f - b0, o0 = (hemRow * NV + b0) * 3, o1 = o0 + 3; return [lerp(base[o0], base[o1], t), lerp(base[o0 + 1], base[o1 + 1], t), lerp(base[o0 + 2], base[o1 + 2], t)]; };
        const dmat = clay('water', { src: new THREE.MeshStandardMaterial({ color: pal.water, transparent: true }), key: 'wd' }); dmat.transparent = true; dmat.depthWrite = false;
        // Rinnsale: wenige feste Abrisspunkte am Saum, je Punkt eine Perlenfolge. Tropfen und Saum teilen sich die Form.
        const K = 6, PER = 4, n = K * PER, seedD = []; for (let k = 0; k < K; k++) { const v = (k + 0.5) / K + (R() - 0.5) * 0.05, sp = 0.8 + 0.4 * R(); for (let j = 0; j < PER; j++) seedD.push([j / PER + R() * 0.08, v, 0.15 + 0.08 * R(), sp]); }
        const op = new Float32Array(n).fill(1), im = new THREE.InstancedMesh(waterGeo.clone(), dmat, n); im.geometry.setAttribute('aOp', new THREE.InstancedBufferAttribute(op, 1));
        { const ob = dmat.onBeforeCompile, ck = dmat.customProgramCacheKey; dmat.onBeforeCompile = (sh, rr) => { ob(sh, rr); sh.vertexShader = 'attribute float aOp; varying float vOp;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vOp = aOp;');
          sh.fragmentShader = 'varying float vOp;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.a *= vOp;'); }; dmat.customProgramCacheKey = () => ck() + '-drip'; }
        im.castShadow = false; im.frustumCulled = false; world.add(im); fallDrops = n; const M = new THREE.Matrix4(), q = new THREE.Quaternion(), V3 = new THREE.Vector3(), Sc = new THREE.Vector3(), pull = new Float32Array(NV);
        // Phasen: 0–0,4 Saum beult sich aus, Tropfen schwillt darin an · 0,4–0,5 Hals, Saum federt zurück · 0,5–1 fallen, strecken, ausblenden
        anims.push(now => { pull.fill(0);
          for (let i = 0; i < n; i++) { const [ph, v, sz, sp] = seedD[i], t = (ph + now * 0.00016 * sp) % 1, h = hemAt(v); let x = h[0], y = h[1], z = h[2], s, st = 1, o = 1, pl = 0;
            if (t < 0.4) { const g = t / 0.4; s = sz * (0.3 + 0.7 * g * g); pl = sz * 1.3 * g * g; y -= pl + s * 0.45; }
            else if (t < 0.5) { const g = (t - 0.4) / 0.1; s = sz; st = 1 + 0.7 * g; pl = sz * 1.3 * (1 - g); y -= sz * 1.3 + sz * 0.45 + g * sz * 1.4; }
            else { const g = (t - 0.5) / 0.5; s = sz * (1 - 0.3 * g); st = 1.7 + 1.4 * g; y -= sz * 3.15 + 28 * g * g; x += dv[0] * 1.4 * g; z += dv[1] * 1.4 * g; o = 1 - sstep(0.4, 1, g); }
            if (pl > 0) for (let b2 = 0; b2 < NV; b2++) { const dl = (b2 / NL - v) * 2 * hw2 / (sz * 2.2); pull[b2] = Math.max(pull[b2], pl * Math.exp(-dl * dl)); }
            V3.set(x, y, z); Sc.set(s, s * st, s); M.compose(V3, q, Sc); im.setMatrixAt(i, M); op[i] = o; }
          for (let b2 = 0; b2 < NV; b2++) { const o1 = (hemRow * NV + b2) * 3 + 1, o0 = o1 - NV * 3; wpos[o1] = base[o1] - pull[b2]; wpos[o0] = base[o0] - pull[b2] * 0.35; }
          cg.attributes.position.needsUpdate = true; cg.computeVertexNormals(); im.instanceMatrix.needsUpdate = true; im.geometry.attributes.aOp.needsUpdate = true; }); }
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
    // Häuser und Landmarke auf den Gebäudeplätzen, Front zum großen Platz; Maßstab = Zielhöhe, gedeckelt durch den Platz
    const big = P.plazas.find(p => p.kind === 'big'), face = big ? [big.x, big.z] : P.c0;
    const placeB = (b, pd, H) => { const g = b.grp.clone(true), sz = b.bb.getSize(new THREE.Vector3()), k = Math.min(H / sz.y, pd.r * 2 * 0.95 / Math.max(sz.x, sz.z)); g.scale.setScalar(k);
      g.position.set(-(b.bb.min.x + b.bb.max.x) / 2 * k, pd.h - b.bb.min.y * k - 0.04, -(b.bb.min.z + b.bb.max.z) / 2 * k);
      const pivot = new THREE.Group(); pivot.position.set(pd.x, 0, pd.z); pivot.add(g); pivot.rotation.y = Math.atan2(face[0] - pd.x, face[1] - pd.z); world.add(pivot); return { k, h: sz.y * k }; };
    let lmkFit = null, houses = 0; P.pads.forEach(pd => { if (pd.kind === 'landmark') { if (lmk) lmkFit = placeB(lmk, pd, cfg.lmk.H); } else if (hs) { placeB(hs, pd, cfg.house ? cfg.house.H : 9); houses++; } });
    // Schatten auf die Insel gepasst
    const bb = new THREE.Box3().setFromObject(terrain); P.bb = bb; const fit = FIT.fitShadow(renderer, sun, lightDir, bb.clone().expandByScalar(4), { pad: 1.02 });
    let terrTris = T.geo.index.count / 3 + T.bodyInfo.tris, roadTris = 0; road.traverse(o => { if (o.isMesh) roadTris += o.geometry.index.count / 3; });
    Object.assign(info, { seed, biome, shape, cells: P.cells.map(c => c.q != null ? [c.q, c.r] : c.xz.map(v => +v.toFixed(1)).concat(+c.rad.toFixed(1))), buildMs: Math.round(performance.now() - tb), terrTris, roadTris, propTris: Math.round(propTris), trees: trees.length, rocks: rocks.length, bushes: bushShown, treesShown: treeShown, vegRejected: rejected, houses, biomeLabel: cfg.label, sky: cfg.sky, treeSet: T3.join(' · '), bushSet: B2.join(' · ') || 'keine',
      lmk: cfg.lmk.id + (lmk ? (lmkFit ? ' · ' + lmkFit.h.toFixed(1) + ' m hoch' : ' · kein Platz') + ' · ' + (lmk.cutTris ? lmk.cutTris + ' △ Sockel weg' : 'ungeschnitten') : ' · FEHLT'), grass: groups.grass.length, stones: stones.length, drops, pond: !!P.pond, creek: !!P.creek, canyon: !!(P.creek && P.creek.cross), waterfall: !!(P.creek && P.creek.lip), fallDrops, piers,
      checks: checks.length, checkFails: checks.filter(c => c.pass === false).map(c => c.id), core: TC.CORE_VERSION, samples: P.stream.samples.length, width: P.width, depth: T.depth, body: T.bodyInfo, masks: MP.areas,
      pads: P.pads.length, plazas: P.plazas.map(p => p.kind + ' r' + p.r), shadow: '±' + fit.r + ' m', houseSoftMs: house ? house.softMs : null, span: bb.getSize(new THREE.Vector3()).toArray().map(v => Math.round(v)) });
    setView(view); onNote('Insel ' + seed + ' · ' + biome); return info; }

  let view = 'mittel', drive = null;
  const setView = id => { view = id; drive = null; controls.enabled = true; if (!P) return; const c = new THREE.Vector3(P.c0[0], 0, P.c0[1]);
    const S0 = P.stream.samples, big = P.plazas.find(p => p.kind === 'big') || { x: P.c0[0], z: P.c0[1], h: 0 };
    const orbit = (d, elv, azm, ty = 0) => { const e = THREE.MathUtils.degToRad(elv), a = THREE.MathUtils.degToRad(azm); camera.position.set(c.x + Math.sin(a) * Math.cos(e) * d, ty + Math.sin(e) * d, c.z + Math.cos(a) * Math.cos(e) * d); controls.target.set(c.x, ty, c.z); };
    if (id === 'top') { camera.position.set(c.x, 150, c.z + 0.01); controls.target.copy(c); }
    else if (id === 'mittel') orbit(105, 32, 35, -4);
    else if (id === 'fern') orbit(280, 26, 35, -8);
    else if (id === 'seite') orbit(125, 10, 35, -16);   // Benchmark-Blick: knapp über dem Horizont, Oberseite und Unterseite zugleich
    else if (id === 'unten') { orbit(95, -14, 140, -10); }
    else if (id === 'bach') { const C = P.creek; if (C && C.cross) { const t = C.cross; let i = 0, bd = 1e9; C.pts.forEach((p, k) => { const d = Math.hypot(p[0] - t[0], p[1] - t[1]); if (d < bd) { bd = d; i = k; } }); const a = C.pts[Math.max(0, i - 3)], b = C.pts[Math.min(C.pts.length - 1, i + 3)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, dx = (b[0] - a[0]) / l, dz = (b[1] - a[1]) / l, gy = Fd.heightAt(t[0] + dx * 8, t[1] + dz * 8);
        const cp = C.pts[Math.max(0, i - 13)], cx = cp[0], cz = cp[1]; camera.position.set(cx, Fd.heightAt(cx, cz) + 1.8, cz); controls.target.set(t[0], Fd.heightAt(t[0], t[1]) + 1.4, t[1]); } else orbit(105, 32, 35, -4); }
    else if (id === 'fall') { const C = P.creek; if (C && C.lip) { const t = C.lip.p, dv = C.lip.dir, gy = Fd.heightAt(t[0], t[1]); camera.position.set(t[0] + dv[0] * 14 - dv[1] * 7, gy + 1.5, t[1] + dv[1] * 14 + dv[0] * 7); controls.target.set(t[0] + dv[0] * 1.2, gy - 2.2, t[1] + dv[1] * 1.2); } else orbit(95, -14, 140, -10); }
    else if (id === 'lmk') { const L = P.pads.find(p => p.kind === 'landmark'); if (L) { const dx = L.x - P.c0[0], dz = L.z - P.c0[1], l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l;
        camera.position.set(L.x - ux * 36 + uz * 14, L.h + 12, L.z - uz * 36 - ux * 14); controls.target.set(L.x, L.h + 5, L.z); } else orbit(105, 32, 35, -4); }
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
    for (const f of anims) { try { f(now); } catch (e) { if (!f._err) { f._err = 1; info.errors.push('Animation: ' + e.message); console.error(e); } } }
    renderer.info.reset(); const a = performance.now(); if (aoOn && ao) composer.render(); else renderer.render(scene, camera); const b = performance.now();
    frames++; acc += b - a; if (now - (stat._t || 0) > 1000) { stat.fps = Math.round(frames * 1000 / (now - (stat._t || now - 1000))); stat.ms = +(acc / Math.max(1, frames)).toFixed(1); frames = 0; acc = 0; stat._t = now; }
    stat.calls = renderer.info.render.calls; stat.tris = renderer.info.render.triangles; stat.geoms = renderer.info.memory.geometries; stat.tex = renderer.info.memory.textures; };
  await build(3);   // Seed 3: Teich, Bach, Schlucht unter der Straße und Wasserfall in einer Insel
  info.loadMs = Math.round(performance.now() - t0);
  loop();
  return { info, stat, build, setView, startDrive, BIOMES,
    snapshot(q = 0.85) { controls.update(); for (const f of anims) { try { f(performance.now()); } catch (e) {} } if (aoOn && ao) composer.render(); else renderer.render(scene, camera); return canvas.toDataURL('image/jpeg', q); }, _plan: () => P, renderNow() { controls.update(); for (const f of anims) { try { f(performance.now()); } catch (e) {} } if (aoOn && ao) composer.render(); else renderer.render(scene, camera); }, stopDrive: () => { drive = null; controls.enabled = true; },
    setLayer(l) { layer = l; if (tTop) { tTop.material = l === 'masken' ? topMask : topMat; tUnder.material = tBody.material = l === 'masken' ? underMask : underMat; } },
    setHex(v) { showHex = v; if (hexL) hexL.visible = v; }, setAO(v) { aoOn = v; },
    recipe() { if (!P) return null; return { schema: 'kfb.r2d.island-recipe/0', seed: P.seed, shape: P.shape, grid: P.shape === 'hex' ? { kind: 'hex-pointy', S, cells: P.cells.map(c => [c.q, c.r]) } : { kind: 'free-blobs', blobs: P.cells.map(c => ({ xz: c.xz, r: c.rad })) }, biome, palette: BIOMES[biome] && BIOMES[biome].pal ? { source: 'hex-archipel.r2c.js PAL @ ' + PIN.r2c.slice(0, 7), key: BIOMES[biome].pal, values: R2C.PAL[BIOMES[biome].pal] } : { source: 'R2D lokal, Schnee-Kandidat', key: biome, values: SNOW_PAL },
      biomeCfg: (({ trees, bushes, lmk, house, ...rest }) => rest)(BIOMES[biome] || BIOMES.burg),
      masks: Object.fromEntries(Object.entries(MASK).map(([k, v]) => [k, { label: v[0], areaM2: (T.maps.areas || {})[k] || 0 }])), track: { core: TC.CORE_VERSION, pin: PIN.track, recipe: P.recipe }, pads: P.pads, plazas: P.plazas, paths: P.paths,
      assets: (c => [...c.trees, ...c.bushes, c.lmk, c.house].filter(Boolean).map(d => d.url()).concat(c.house ? [] : [RAW(FAC_PIN, CITY + 'building_A.gltf')]))(BIOMES[biome] || BIOMES.burg), transitions: { owner: 'Joyride J14 road-markings.m1.js KFB_BLEND_GLSL @ ' + PIN.r2c.slice(0, 7), layers: ['Fels am Rand', 'Sand an Bankett/Ufer', 'Pflaster an Plätzen/Wegen'] }, pond: P.pond,
      lod: 'v0: keine LOD-Stufen; ein Terrain-Mesh, instanzierte Natur', underside: { depth: T.depth } }; },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); } };
}
