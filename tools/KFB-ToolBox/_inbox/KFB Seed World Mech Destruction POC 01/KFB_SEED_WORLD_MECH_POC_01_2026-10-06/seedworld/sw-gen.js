/* KFB Seed World · POC 01 · generator
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA
   Pure logic, no three.js: runs on the main thread and inside the chunk worker from the same source.
   CARD / WORLD SEED → sub-seeds → terrain → settlements/districts → street graph → blocks + parcels →
   BuildingRecipes → vegetation → chunk recipes. Seed paths follow the World Kernel convention
   (FNV-1a over `${seed}|g${generatorVersion}|${path}`, world-kernel.js / PR #363).
   Façade numbers (floor 3.1 m, window 1.25 × 1.55, sill 0.85, spacing 2.7, margin 0.8, door 1.25 × 2.25,
   roof overhang 0.25, ledge every floor, ridge parallel to the closest street) are the defaults of
   p-schulz/osm_building_grammar@81f1b50 default_config.json (Apache-2.0). No OSM input. */

export const GEN_VERSION = 1;
export const CHUNK = 64;

export function hash32(input) {
  let h = 0x811c9dc5; const s = String(input);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export const derive = (seed, path) => hash32(`${seed}|g${GEN_VERSION}|${path}`);
export function mix32(x) { x = Math.imul(x ^ (x >>> 16), 0x7feb352d); x = Math.imul(x ^ (x >>> 15), 0x846ca68b); return (x ^ (x >>> 16)) >>> 0; }
export function rng(s) {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
function unit(seed, x, y) { return mix32((seed ^ Math.imul(x | 0, 0x9e3779b1) ^ Math.imul(y | 0, 0x85ebca6b)) >>> 0) / 4294967295; }
export function vnoise(seed, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y); let tx = x - x0, ty = y - y0; tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
  const a = unit(seed, x0, y0), b = unit(seed, x0 + 1, y0), c = unit(seed, x0, y0 + 1), d = unit(seed, x0 + 1, y0 + 1);
  return (a + (b - a) * tx + (c - a + (a - b + d - c) * tx) * ty) * 2 - 1;
}
export function srgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.pow(c / 255, 2.2)); }

/* One settlement type per seed. Values are authored for this POC, not KFB canon. */
const BASE = {
  floors: [2, 5], floorH: 3.1, shopH: 3.7, indH: 4.6, pitch: 0.55, overhang: 0.25, parapet: 0, twist: 7, lean: 0.01,
  block: [46, 34], parcelW: [7, 11], depth: [9, 12], setback: [0.4, 3.5], gapEdge: 0.3, square: 0.5, shop: 0.4, industrial: 0.06,
  vegK: 1, tree: 'round', terrainAmp: 14
};
export const TYPES = [
  { ...BASE, id: 'giebelstadt', name: 'Giebelstadt', note: 'European gable town',
    roofs: { gable: 0.62, hip: 0.26, flat: 0.12 },
    walls: ['#ead9b8', '#e6b39b', '#e1bf74', '#b4c8d4', '#c2cd9c', '#f0e4cc'], roofC: ['#b4523a', '#8f3e2e', '#5f6170', '#a65e3c'],
    trim: '#f6f0e4', door: '#6b4630', grass: '#93b06a', grass2: '#7d9b58', road: '#a59c8f', walk: '#d0c6b4', plaza: '#cbb99a', dirt: '#a88a62',
    crown: ['#5f8f45', '#6f9e4c', '#4f7f3d'], trunk: '#7a5536', sky: '#cbe0e6', fog: '#d6e1dc' },
  { ...BASE, id: 'machiya', name: 'Machiya-Gasse', note: 'low timber street, deep eaves',
    floors: [1, 3], floorH: 3.0, pitch: 0.42, overhang: 0.85, twist: 4, block: [40, 30], parcelW: [5.5, 8.5], depth: [10, 13], setback: [0.2, 1.6], shop: 0.55,
    roofs: { hip: 0.55, gable: 0.37, flat: 0.08 }, tree: 'cone', terrainAmp: 18,
    walls: ['#5c4030', '#ece2cf', '#6e4b36', '#e0d2b8', '#4c3b31'], roofC: ['#3f4a57', '#4a4e58', '#353b46'],
    trim: '#3a2c22', door: '#3b2b20', grass: '#9cb07a', grass2: '#86a066', road: '#b7ac98', walk: '#d6ccb8', plaza: '#c6baa3', dirt: '#9c8566',
    crown: ['#4d7a4a', '#5d8a52', '#7a9a5a'], trunk: '#6a4a34', sky: '#d9e2e4', fog: '#dfe3df' },
  { ...BASE, id: 'adobe', name: 'Lehmdorf', note: 'flat-roof clay village',
    floors: [1, 3], floorH: 3.0, pitch: 0.15, overhang: 0.06, parapet: 0.55, twist: 5, block: [36, 36], parcelW: [7, 12], depth: [8, 12], setback: [0.3, 2.5], vegK: 0.45,
    roofs: { flat: 0.85, shed: 0.15 }, tree: 'palm', terrainAmp: 10, square: 0.7,
    walls: ['#d9a46a', '#e4bd86', '#c98a5a', '#ecd2a6', '#b9764e'], roofC: ['#c27a4e', '#b5683f', '#d39a68'],
    trim: '#7c4a2c', door: '#4f7f8c', grass: '#d6be89', grass2: '#c7a972', road: '#c3a37a', walk: '#e2c9a0', plaza: '#dfc396', dirt: '#b98c5c',
    crown: ['#6f9a4a', '#87a855', '#5d8a40'], trunk: '#8a6440', sky: '#e8dcc6', fog: '#eadbc2' },
  { ...BASE, id: 'toytown', name: 'Spielzeugstadt', note: 'saturated toy town, strong torsion',
    floors: [2, 6], floorH: 3.2, pitch: 0.85, overhang: 0.35, twist: 14, lean: 0.022, block: [44, 34], parcelW: [6.5, 10], setback: [0.5, 3],
    roofs: { gable: 0.55, hip: 0.3, flat: 0.15 }, terrainAmp: 16,
    walls: ['#f2c94c', '#f28c8c', '#7fc8e8', '#a6dd8b', '#c9a0e8', '#fbf6ee'], roofC: ['#e5484d', '#3e7ce0', '#8e4ec6', '#22a06b'],
    trim: '#ffffff', door: '#3b2b6b', grass: '#9fd88a', grass2: '#86c977', road: '#b9b3c8', walk: '#e9e3f2', plaza: '#f3d9a4', dirt: '#c9a37a',
    crown: ['#58c46b', '#3fae5f', '#8fd36c'], trunk: '#8a5a3a', sky: '#cfe6f5', fog: '#dceaf2' },
  { ...BASE, id: 'werkhafen', name: 'Werkhafen', note: 'brick works district',
    floors: [2, 6], floorH: 3.4, indH: 5.2, pitch: 0.4, parapet: 0.45, twist: 5, block: [56, 40], parcelW: [9, 15], depth: [11, 15], setback: [0.5, 4], industrial: 0.35, shop: 0.2, vegK: 0.6,
    roofs: { flat: 0.45, gable: 0.4, hip: 0.15 }, terrainAmp: 9,
    walls: ['#a65440', '#8f4a3a', '#b8a89a', '#7c7f86', '#c26b4b'], roofC: ['#4a4d55', '#5f6168', '#3a3c42'],
    trim: '#e8e0d2', door: '#2f3d4d', grass: '#8c9b6a', grass2: '#76875a', road: '#8e8a86', walk: '#b5aea6', plaza: '#a39d94', dirt: '#8a7a64',
    crown: ['#5c7f45', '#6b8a4c'], trunk: '#5f4a38', sky: '#d2d8dc', fog: '#d4d8d6' }
];
export const DONOR = { floorH: 3.1, win: { w: 1.25, h: 1.55, sill: 0.85, spacing: 2.7, margin: 0.8 }, door: { w: 1.25, h: 2.25 }, overhang: 0.25, ledge: { depth: 0.16, h: 0.08 } };

export function createGen(seedIn) {
  const seed = seedIn >>> 0;
  const W = `world:${seed}`;
  const type = TYPES[derive(seed, 'type') % TYPES.length];
  const pr = rng(derive(seed, `${W}/params`));
  const P = { amp: type.terrainAmp * (0.7 + pr() * 0.6), density: 0.88 + pr() * 0.24, heightK: 0.85 + pr() * 0.35, curve: 0.5 + pr() * 0.9, rhythm: 0.88 + pr() * 0.24, veg: 0.7 + pr() * 0.6 };
  const sT = [1, 2, 3, 4].map((k) => derive(seed, `${W}/terrain/band:${k}`));
  const sForest = derive(seed, `${W}/vegetation/forest`), sGround = derive(seed, `${W}/terrain/ground`);
  const C = { walls: type.walls.map(srgb), roofs: type.roofC.map(srgb), trim: srgb(type.trim), door: srgb(type.door), grass: srgb(type.grass), grass2: srgb(type.grass2), road: srgb(type.road), walk: srgb(type.walk), plaza: srgb(type.plaza), dirt: srgb(type.dirt), crown: type.crown.map(srgb), trunk: srgb(type.trunk) };
  const CELL = 700;

  function baseH(x, z) {
    return P.amp * (0.6 * vnoise(sT[0], x / 460, z / 460) + 0.28 * vnoise(sT[1], x / 190, z / 190) + 0.12 * vnoise(sT[2], x / 70, z / 70)) + 0.35 * vnoise(sT[3], x / 17, z / 17);
  }

  /* ---------- settlements (one per coarse cell, main at the origin) ---------- */
  const setCache = new Map();
  function settlement(ci, cj) {
    const key = ci * 100003 + cj; if (setCache.has(key)) return setCache.get(key);
    const id = `s${ci}_${cj}`, r = rng(derive(seed, `${W}/settlement:${id}`)), main = ci === 0 && cj === 0;
    let s = null;
    const roll = r();
    if (main || roll < 0.55) {
      let cx = main ? 0 : (ci + 0.2 + r() * 0.6) * CELL, cz = main ? 0 : (cj + 0.2 + r() * 0.6) * CELL;
      const R = main ? 250 * P.density : 95 + r() * 75;
      if (!main) { const d = Math.hypot(cx, cz), min = 250 * P.density + R + 110; if (d < min) { const k = min / Math.max(d, 1); cx *= k; cz *= k; } }
      const theta = r() * Math.PI, A = (6 + r() * 9) * P.curve;
      s = { id, ci, cj, main, cx, cz, R, theta, c: Math.cos(theta), sn: Math.sin(theta),
        bu: type.block[0] * (0.9 + r() * 0.22), bv: type.block[1] * (0.9 + r() * 0.22),
        A1: A, A2: A * (0.5 + r() * 0.6), f1: (2 * Math.PI) / (220 + r() * 160), f2: (2 * Math.PI) / (240 + r() * 160), p1: r() * 6.283, p2: r() * 6.283,
        sb: derive(seed, `${W}/settlement:${id}/boundary`) };
      s.h0 = baseH(cx, cz);
    }
    setCache.set(key, s); return s;
  }
  const nearCache = new Map();
  function near(x, z) {
    const ci = Math.floor(x / CELL), cj = Math.floor(z / CELL), key = ci * 100003 + cj;
    let l = nearCache.get(key);
    if (!l) { l = []; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const s = settlement(ci + a, cj + b); if (s) l.push(s); } settlement(0, 0); if (!l.includes(setCache.get(0))) { const m = setCache.get(0); if (Math.hypot(m.cx - x, m.cz - z) < 1600) l.push(m); } nearCache.set(key, l); }
    return l;
  }
  const L2 = [0, 0];
  function toLocal(s, x, z, out = L2) {
    const dx = x - s.cx, dz = z - s.cz, a = dx * s.c + dz * s.sn, b = -dx * s.sn + dz * s.c;
    let u = a, v = b;
    for (let k = 0; k < 4; k++) { u = a - s.A1 * Math.sin(v * s.f1 + s.p1); v = b - s.A2 * Math.sin(u * s.f2 + s.p2); }
    out[0] = u; out[1] = v; return out;
  }
  function toWorld(s, u, v) {
    const a = u + s.A1 * Math.sin(v * s.f1 + s.p1), b = v + s.A2 * Math.sin(u * s.f2 + s.p2);
    return [s.cx + a * s.c - b * s.sn, s.cz + a * s.sn + b * s.c];
  }
  function townR(s, u, v) {
    const ang = Math.atan2(v, u);
    const k = 0.82 + 0.36 * (0.5 + 0.5 * vnoise(s.sb, Math.cos(ang) * 1.6 + 7, Math.sin(ang) * 1.6 + 7));
    return Math.hypot(u, v) / (s.R * k);
  }
  function owner(x, z) {
    let best = null, br = 1;
    for (const s of near(x, z)) { if (Math.hypot(x - s.cx, z - s.cz) > s.R * 1.6) continue; const [u, v] = toLocal(s, x, z); const r = townR(s, u, v); if (r < br) { br = r; best = { s, u, v, r }; } }
    return best;
  }

  /* ---------- street graph: primary axes (u=0, v=0, leave town as paths) + secondary grid ---------- */
  function road(x, z) {
    let best = null, bs = 1e9;
    for (const s of near(x, z)) {
      if (Math.hypot(x - s.cx, z - s.cz) > s.R * 3.6) continue;
      const [u, v] = toLocal(s, x, z), r = townR(s, u, v);
      if (r < 3.2) {
        const d = Math.min(Math.abs(u), Math.abs(v)), hw = r < 1.1 ? 4.6 : lerp(4.6, 2.2, smoothstep(1.1, 2.4, r));
        if (d - hw < bs) { bs = d - hw; best = { d, hw, kind: r < 1.1 ? 'primary' : 'path', s }; }
      }
      if (r < 1.04) {
        const du = Math.abs(u - Math.round(u / s.bu) * s.bu), dv = Math.abs(v - Math.round(v / s.bv) * s.bv), d = Math.min(du, dv);
        if (d - 3 < bs) { bs = d - 3; best = { d, hw: 3, kind: 'street', s }; }
      }
    }
    return best;
  }
  function streetIds(s) {
    const ids = [`${W}/street:${s.id}.P0`, `${W}/street:${s.id}.P1`];
    const n = Math.ceil((s.R * 1.2) / s.bu), m = Math.ceil((s.R * 1.2) / s.bv);
    for (let k = -n; k <= n; k++) if (k) ids.push(`${W}/street:${s.id}.u${k}`);
    for (let k = -m; k <= m; k++) if (k) ids.push(`${W}/street:${s.id}.v${k}`);
    return ids;
  }

  /* ---------- terrain ---------- */
  function height(x, z, rd) {
    let h = baseH(x, z);
    for (const s of near(x, z)) { const d = Math.hypot(x - s.cx, z - s.cz); if (d > s.R * 1.5) continue; const t = smoothstep(s.R * 1.5, s.R * 0.95, d); h = lerp(h, s.h0 + (h - s.h0) * 0.16, t); }
    if (rd === undefined) rd = road(x, z);
    if (rd) h -= 0.14 * smoothstep(rd.hw + 0.8, rd.hw - 0.4, rd.d);
    return h;
  }

  /* ---------- blocks + parcels ---------- */
  const blockCache = new Map();
  function block(s, i, j) {
    const key = s.id + ':' + i + ',' + j; let b = blockCache.get(key); if (b) return b;
    const u0 = i * s.bu, u1 = u0 + s.bu, v0 = j * s.bv, v1 = v0 + s.bv, uc = (u0 + u1) / 2, vc = (v0 + v1) / 2;
    const r = townR(s, uc, vc), R = rng(derive(seed, `${W}/block:${s.id}.${i}.${j}`));
    let kind = 'none';
    if (r < 1) {
      const [wx, wz] = toWorld(s, uc, vc), own = owner(wx, wz);
      if (!own || own.s !== s) kind = 'none';
      else if ((i === 0 || i === -1) && (j === 0 || j === -1) && R() < type.square * 0.5) kind = 'square';
      else if (R() < 0.03 + type.gapEdge * r * r) kind = 'yard';
      else kind = 'built';
    }
    b = { s, i, j, u0, u1, v0, v1, r, kind, parcels: [], yard: 1e9, district: `${W}/district:${s.id}.${r < 0.4 ? 'core' : r < 0.75 ? 'mid' : 'edge'}` };
    if (kind === 'built') {
      const dense = r < 0.55 + 0.1 * (R() - 0.5);
      let yard = 0;
      for (const e of [0, 1]) {
        const vS = e === 0 ? v0 : v1, prim = Math.round(vS / s.bv) === 0, hw = (prim ? 4.6 : 3) + 1.6;
        const hw0 = (i === 0 ? 4.6 : 3) + 1.6, hw1 = (i + 1 === 0 ? 4.6 : 3) + 1.6;
        const uS = u0 + hw0 + 0.3, uE = u1 - hw1 - 0.3, maxDepth = s.bv / 2 - hw - 1.4;
        let cur = uS + (dense ? 0 : R() * 2), k = 0; const row = [];
        while (uE - cur > type.parcelW[0] * 0.8 && k < 24) {
          let w = lerp(type.parcelW[0], type.parcelW[1], R()) * (1 + 0.35 * r) * P.rhythm, role = 'residential';
          const rr1 = R(), rr2 = R();
          if (r > 0.62 && rr1 < type.industrial * (1 + r)) { role = 'industrial'; w *= 1.9; } else if (r < 0.5 && rr2 < type.shop) role = 'shop';
          const rem = uE - cur; if (rem < w * 1.45) w = rem; if (w < type.parcelW[0] * 0.7) break;
          const depth = Math.max(5, Math.min(maxDepth, lerp(type.depth[0], type.depth[1], R()) * (role === 'industrial' ? 1.45 : 1)));
          const sb = lerp(type.setback[0], type.setback[1], Math.min(1, r * 1.1)) * (0.6 + 0.8 * R());
          const vf = e === 0 ? v0 + hw + sb : v1 - hw - sb, inw = e === 0 ? 1 : -1, ua = cur, ub = cur + w;
          const jb = () => (R() - 0.5) * 0.8, jf = () => (R() - 0.5) * 0.25 * r;
          const Lc = e === 0
            ? [[ua + jf(), vf + jf()], [ub + jf(), vf + jf()], [ub + jb(), vf + inw * depth + jb()], [ua + jb(), vf + inw * depth + jb()]]
            : [[ub + jf(), vf + jf()], [ua + jf(), vf + jf()], [ua + jb(), vf + inw * depth + jb()], [ub + jb(), vf + inw * depth + jb()]];
          yard = Math.max(yard, hw + sb + depth + 1.6);
          row.push({ e, k, L: Lc, role, ua, ub });
          cur = ub + (dense ? 0 : 1.6 + R() * 4.5 * r); k++;
        }
        row.forEach((p, n) => {
          const atA = (n === 0 && p.ua <= uS + 0.01) ? 'street' : dense ? 'party' : 'side';
          const atB = (n === row.length - 1 && Math.abs(p.ub - uE) < 0.02) ? 'street' : dense ? 'party' : 'side';
          // e=0: side1 at ub, side3 at ua · e=1: side1 at ua, side3 at ub
          p.kinds = e === 0 ? ['street', atB, 'back', atA] : ['street', atA, 'back', atB];
          b.parcels.push(p);
        });
      }
      b.yard = yard;
    }
    blockCache.set(key, b); if (blockCache.size > 30000) blockCache.clear();
    return b;
  }

  /* ---------- BuildingRecipe ---------- */
  const recCache = new Map();
  function pick(R, weights) { let t = R() * Object.values(weights).reduce((a, v) => a + v, 0); for (const k in weights) { t -= weights[k]; if (t <= 0) return k; } return Object.keys(weights)[0]; }
  function recipe(b, p) {
    const s = b.s, sid = `${s.id}.${b.i}.${b.j}.${p.e}.${p.k}`, id = `${W}/building:${sid}`;
    let rec = recCache.get(id); if (rec) return rec;
    const bseed = derive(seed, id), R = rng(bseed);
    const corners = p.L.map(([u, v]) => toWorld(s, u, v));
    const cx = (corners[0][0] + corners[1][0] + corners[2][0] + corners[3][0]) / 4, cz = (corners[0][1] + corners[1][1] + corners[2][1] + corners[3][1]) / 4;
    const fr = p.role === 'industrial' ? [1, 2] : type.floors;
    let floors = Math.round(lerp(fr[1], fr[0], Math.pow(b.r, 0.8)) * (p.role === 'industrial' ? 1 : P.heightK) + (R() - 0.5) * 1.8);
    floors = clamp(floors, fr[0], fr[1] + 1);
    const floorH = []; for (let f = 0; f < floors; f++) floorH.push(p.role === 'industrial' ? type.indH : f === 0 && p.role === 'shop' ? type.shopH : type.floorH * (0.96 + R() * 0.08));
    const bh = floorH.reduce((a, v) => a + v, 0);
    const sides = [0, 1, 2, 3].map((k) => {
      const A = corners[k], B = corners[(k + 1) % 4], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const bays = Math.max(1, Math.floor((len - 2 * DONOR.win.margin - DONOR.win.w) / DONOR.win.spacing) + 1);
      return { kind: p.kinds[k], len, bays };
    });
    const depth = (sides[1].len + sides[3].len) / 2;
    let roofT = p.role === 'industrial' ? (type.id === 'werkhafen' ? (R() < 0.6 ? 'sawtooth' : 'flat') : (R() < 0.5 ? 'shed' : 'flat')) : pick(R, type.roofs);
    const rh = roofT === 'gable' || roofT === 'hip' ? type.pitch * depth * 0.5 : roofT === 'shed' ? Math.max(0.6, type.pitch * depth * 0.35) : roofT === 'sawtooth' ? 2.2 : 0;
    const entrance = Math.floor(sides[0].bays / 2);
    const wall = C.walls[(R() * C.walls.length) | 0], roofC = C.roofs[(R() * C.roofs.length) | 0];
    const tw = type.twist * (R() * 2 - 1) * (0.5 + bh / 22) * (p.role === 'industrial' ? 0.4 : 1);
    const ang = R() * 6.283, lean = type.lean * (R() * 2 - 1);
    rec = {
      id, parcel: `${W}/parcel:${sid}`, seed: bseed, settlement: s.id, district: b.district, role: p.role,
      corners, centroid: [cx, cz], baseY: 0, floors, floorH, height: bh, sides, depth, front: 0, entranceBay: entrance,
      roof: { type: roofT, h: rh, ov: type.overhang * (0.8 + R() * 0.4), parapet: roofT === 'flat' || roofT === 'sawtooth' ? Math.max(type.parapet, 0.35) : 0, chimney: (roofT === 'gable' || roofT === 'hip') && R() < 0.6 },
      wall, roofC, trim: C.trim, door: C.door,
      deform: { twist: tw, lean: [Math.cos(ang) * lean, Math.sin(ang) * lean], wob: 0.06 + R() * 0.14, ph: R() * 6.283 },
      hp: p.role === 'industrial' ? { wall: 9, corner: 14, roof: 6, slab: 10 } : { wall: 6, corner: 10, roof: 5, slab: 8 }
    };
    let mn = Infinity; for (const [x, z] of corners) mn = Math.min(mn, height(x, z)); mn = Math.min(mn, height(cx, cz));
    rec.baseY = mn - 0.35;
    rec.chunk = [Math.floor(cx / CHUNK), Math.floor(cz / CHUNK)];
    recCache.set(id, rec); if (recCache.size > 20000) recCache.clear();
    return rec;
  }

  /* ---------- vegetation ---------- */
  function vegDensity(x, z) {
    const rd = road(x, z); if (rd && rd.d < rd.hw + 2.4) return 0;
    const own = owner(x, z);
    if (own) {
      const { s, u, v } = own, b = block(s, Math.floor(u / s.bu), Math.floor(v / s.bv));
      if (b.kind === 'yard') return 0.5 * P.veg;
      if (b.kind === 'square') return 0.03;
      if (b.kind === 'built') { const dv = Math.min(v - b.v0, b.v1 - v), du = Math.min(u - b.u0, b.u1 - u); return dv > b.yard && du > 6 ? 0.35 * P.veg : 0; }
      return 0.08;
    }
    const f = vnoise(sForest, x / 210, z / 210);
    return clamp(P.veg * type.vegK * (0.05 + 0.55 * Math.max(0, f)), 0, 0.7);
  }
  function trees(cx, cz) {
    const R = rng(derive(seed, `${W}/vegetation:${cx},${cz}`)), out = [], n = 10, st = CHUNK / n;
    for (let gz = 0; gz < n; gz++) for (let gx = 0; gx < n; gx++) {
      const x = cx * CHUNK + (gx + R()) * st, z = cz * CHUNK + (gz + R()) * st, roll = R(), sc = R(), rot = R(), col = R(), bush = R();
      if (roll > vegDensity(x, z)) continue;
      const isBush = bush < 0.32, y = height(x, z);
      out.push({ x, y, z, s: isBush ? 0.6 + sc * 0.6 : 0.85 + sc * 0.9, rot: rot * 6.283, c: (col * C.crown.length) | 0, bush: isBush });
    }
    return out;
  }

  /* ---------- ground colour ---------- */
  function ground(x, z, rd) {
    if (rd === undefined) rd = road(x, z);
    const n = vnoise(sGround, x / 9, z / 9) * 0.05;
    // roads + kerbs are no longer painted into terrain vertex colours (grid-stepped edges); sw-mesh.js lays them as ribbons
    void rd;
    const own = owner(x, z);
    if (own) { const b = block(own.s, Math.floor(own.u / own.s.bu), Math.floor(own.v / own.s.bv)); if (b.kind === 'square') { const c = C.plaza; return [c[0] * (1 + n), c[1] * (1 + n), c[2] * (1 + n)]; } }
    const t = 0.5 + 0.5 * vnoise(sGround, x / 40 + 9, z / 40 + 3), d = smoothstep(0.55, 0.85, vnoise(sGround, x / 23 - 4, z / 23 + 8));
    const g = [lerp(C.grass[0], C.grass2[0], t), lerp(C.grass[1], C.grass2[1], t), lerp(C.grass[2], C.grass2[2], t)];
    return [lerp(g[0], C.dirt[0], d * 0.6) * (1 + n), lerp(g[1], C.dirt[1], d * 0.6) * (1 + n), lerp(g[2], C.dirt[2], d * 0.6) * (1 + n)];
  }

  /* ---------- chunk recipe ---------- */
  function chunkRecipe(cx, cz) {
    const x0 = cx * CHUNK, z0 = cz * CHUNK, x1 = x0 + CHUNK, z1 = z0 + CHUNK, mx = x0 + CHUNK / 2, mz = z0 + CHUNK / 2;
    const buildings = [], blocks = new Set();
    for (const s of near(mx, mz)) {
      if (Math.hypot(mx - s.cx, mz - s.cz) > s.R * 1.35 + 70) continue;
      let umin = 1e9, umax = -1e9, vmin = 1e9, vmax = -1e9;
      for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [mx, z0], [mx, z1], [x0, mz], [x1, mz]]) { const [u, v] = toLocal(s, x, z); umin = Math.min(umin, u); umax = Math.max(umax, u); vmin = Math.min(vmin, v); vmax = Math.max(vmax, v); }
      for (let i = Math.floor((umin - 24) / s.bu); i <= Math.floor((umax + 24) / s.bu); i++)
        for (let j = Math.floor((vmin - 24) / s.bv); j <= Math.floor((vmax + 24) / s.bv); j++) {
          const b = block(s, i, j); if (b.kind !== 'built') continue;
          for (const p of b.parcels) { const r = recipe(b, p); if (r.centroid[0] >= x0 && r.centroid[0] < x1 && r.centroid[1] >= z0 && r.centroid[1] < z1) { buildings.push(r); blocks.add(`${W}/block:${s.id}.${i}.${j}`); } }
        }
    }
    buildings.sort((a, b) => (a.id < b.id ? -1 : 1));
    return { key: `${W}/chunk:${cx},${cz}`, cx, cz, buildings, trees: trees(cx, cz), blocks: [...blocks] };
  }

  return { seed, W, type, P, C, CELL, settlement, near, toLocal, toWorld, townR, owner, road, height, ground, block, recipe, chunkRecipe, streetIds, vegDensity };
}
