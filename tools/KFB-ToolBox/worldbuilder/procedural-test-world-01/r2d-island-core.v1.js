import {compileTraversal} from './open-world/src/owners/track-core/traversal.mjs';
/* KFB R2D island core v1
 * Source-derived from exact Claude Design donor:
 * tools/KFB-ToolBox/_inbox/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js
 * blob 6952697d7d3c9cd159ac3fdd924f24fa333c904d
 *
 * PURE WORLD DATA ONLY.
 * No renderer, scene, camera, animation loop, material owner or movement owner.
 */
export const SCHEMA='kfb.r2d-island-core/1';
export const SOURCE=Object.freeze({repo:'georg-doc/kayfabizarro',donorBlob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d',donorPath:"tools/KFB-ToolBox/_inbox/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js"});
export const S = 10, AP = S * Math.sqrt(3) / 2;
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
export function planIsland(seed, TC, shape = 'frei', finalizedRecipe = null) {
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
  if(finalizedRecipe?.islandLayout){C=finalizedRecipe.islandLayout.lobes.map(c=>({...c}));sdf=(x,z)=>{let d=1e9;for(const c of C)d=smin(d,Math.hypot(x-c.xz[0],z-c.xz[1])-c.rad,9);return d+2.2*fbm(x*.04,z*.04,seed+3)-.4;};}
  const c0 = [C.reduce((a, c) => a + c.xz[0], 0) / C.length, C.reduce((a, c) => a + c.xz[1], 0) / C.length];
  const NA = 192, edgeR = new Float32Array(NA);
  for (let a = 0; a < NA; a++) { const th = a / NA * Math.PI * 2, cx = Math.cos(th), cz = Math.sin(th); let r = 0; while (r < 250 && sdf(c0[0] + cx * r, c0[1] + cz * r) < 0) r += 0.5;
    let lo = Math.max(0, r - 0.5), hi = r; for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (sdf(c0[0] + cx * m, c0[1] + cz * m) < 0) lo = m; else hi = m; } edgeR[a] = lo; }
  const rAt = th => { const f = ((th / (Math.PI * 2)) % 1 + 1) % 1 * NA, i = Math.floor(f), t = f - i; return lerp(edgeR[i % NA], edgeR[(i + 1) % NA], t); };
  // Straße: Track Core, quer durch die Insel, Enden als Brückenköpfe zur Nachbarinsel
  const roadY = 0.6, turn = 16 + Math.floor(R() * 11), sgn = R() < 0.5 ? 1 : -1;
  const ext = rAt(-Math.PI / 2) + rAt(Math.PI / 2), zIn = c0[1] - rAt(-Math.PI / 2) - 6, arc = 45 * turn * Math.PI / 180, tail = Math.max(4, ext + 12 - 6 - 2 * arc * 0.97);
  const LOW = { barrierH: { to: 0.3 }, barrierOuterTop: { to: 0.25 } }, HIGH = { barrierH: { to: 1.35 }, barrierOuterTop: { to: 1.18 } };
  let recipe = { schema: 'kfb.route-recipe/0.1-draft', id: 'R2D_V0_ISLAND_' + seed, label: 'R2D v0 · Inselquerung', start: { p: [c0[0] + sgn * 3, roadY, zIn], headingDeg: 0 },
    defaults: { widthClass: 'NARROW', markings: 'STREET' },
    pieces: [{ id: 'kopf_in', type: 'STRAIGHT', length: 6 }, { id: 's1', type: 'CURVE_EASE', turn: turn * sgn, radius: 45, bankDeg: 0, params: LOW }, { id: 's2', type: 'CURVE_EASE', turn: -turn * sgn, radius: 45, bankDeg: 0 }, { id: 'kopf_out', type: 'STRAIGHT', length: +tail.toFixed(1), params: HIGH }] };
  let stream = TC.compileRecipe(recipe);
  { const S0 = stream.samples, L = S0[S0.length - 1].s; let sl = 0; for (const q of S0) if (sdf(q.p[0], q.p[2]) < 0) sl = q.s;   // Brückenkopf: Ende 6 m hinter dem letzten Inselpunkt
    const over = L - sl - 6, pc = recipe.pieces[3]; if (Math.abs(over) > 1) { pc.length = +Math.max(3, pc.length - over).toFixed(1); stream = TC.compileRecipe(recipe); } }
  // Replay the saved complete recipe, never a mutable current fixture.
  let graph=null;
  if(finalizedRecipe){recipe=structuredClone(finalizedRecipe);if(recipe.routes){graph=TC.compileGraph(recipe);const checks=TC.runGraphChecks(graph);if(!checks.pass)throw Error('Track graph failed '+JSON.stringify(checks));stream=compileTraversal(graph,recipe.traversal.parts,recipe.traversal);}else stream=TC.compileRecipe(recipe);}
  const samp = stream.samples, width = samp[0].prm.width;
  // Fahrbahnmitte aus den Slots (Rolle 'road' liegt zwischen Slot 6 und 7), nicht aus p: der Kern legt die Fahrbahn seitlich versetzt
  const sw = (q, i) => [0, 1, 2].map(k => q.p[k] + q.R[k] * q.slots[i][0] + q.U[k] * q.slots[i][1]);
  const poly = samp.map(q => { const a = sw(q, 6), b = sw(q, 7); return [(a[0] + b[0]) / 2, (a[2] + b[2]) / 2]; });
  const q0 = samp[Math.floor(samp.length / 2)], lats = q0.slots.map(s => s[0]), mid = (q0.slots[6][0] + q0.slots[7][0]) / 2;
  const hw = (graph?Math.max(...Object.values(graph.routes).flatMap(r=>r.samples[0].slots.map(q=>Math.abs(q[0])))):Math.max(...lats.map(l => Math.abs(l - mid)))) + 1.0, roadSurf = (sw(q0, 6)[1] + sw(q0, 7)[1]) / 2;
  const roadDist = (x, z) => { let best = 1e9;if(graph){for(const r of Object.values(graph.routes))for(let i=1;i<r.samples.length;i++){const a=r.samples[i-1].p,b=r.samples[i].p;best=Math.min(best,distSeg(x,z,[a[0],a[2]],[b[0],b[2]]));}for(const n of graph.nodes)best=Math.min(best,Math.abs(Math.hypot(x-n.center[0],z-n.center[2])-n.island-n.ringWidth/2));return best;} for (let i = 0; i < poly.length - 1; i += 1) { const d = distSeg(x, z, poly[i], poly[i + 1]); if (d < best) best = d; } return best; };
  const natural = (x, z) => 1.7 * fbm(x * 0.03, z * 0.03, seed + 5) + 0.55 * fbm(x * 0.09, z * 0.09, seed + 9);
  // Gebäudeplätze: Zellmitten abseits der Straße und des Rands
  const padR = 6.5, cand = C.slice(1).map(c => ({ c, rd: roadDist(c.xz[0], c.xz[1]), e: -sdf(c.xz[0], c.xz[1]) })).filter(o => o.rd > hw + 8 && o.e > 8.5).sort((a, b) => b.rd - a.rd);
  const pads = []; for (const o of cand) { if (pads.length >= 2) break; if (pads.every(p => Math.hypot(p.x - o.c.xz[0], p.z - o.c.xz[1]) > padR * 2 + 6)) pads.push({ x: o.c.xz[0], z: o.c.xz[1], r: padR, h: natural(o.c.xz[0], o.c.xz[1]) * 0.6 + 0.35, cell: [o.c.q, o.c.r] }); }
  if(recipe.islandLayout?.pads){pads.splice(0,pads.length,...structuredClone(recipe.islandLayout.pads));}
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
  return { seed, shape, cells: C, c0, sdf, NA, edgeR, rAt, recipe, stream, graph, width, hw, roadY: roadSurf, roadDist, natural, pads, plazas, paths, poly, pond, creek };
}

/* Höhe und Maske an jedem Punkt — analytisch, also für Gelände, Raster, Bäume und Häuser dieselbe Wahrheit */
export function fields(P) {
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


export function makeIslandCore(seed, trackCore, shape='frei', finalizedRecipe=null){
  const plan=planIsland(seed,trackCore,shape,finalizedRecipe);
  const field=fields(plan);
  return {schema:SCHEMA,source:SOURCE,plan,field};
}
