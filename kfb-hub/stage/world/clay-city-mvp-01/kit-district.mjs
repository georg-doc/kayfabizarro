/* KFB CLAY-CITY-MVP-01 · deterministic Kit district
   One recipe per building, shared by rendering AND collision:
     family + floorCount + body + roof + facadeRhythm + palette + deformationSeed (+ transform)
   · archetypes are the verified donors of kit-donors.mjs (gate 0), one InstancedMesh per archetype;
   · per-instance colour tint and one-time squash/stretch/lean baked into the instance matrix (no per-frame
     mesh deformation);
   · taller accents/landmark = a second donor stacked on the first (setback), never an invented box;
   · foundation pad follows the terrain, the building stays upright;
   · collision proxy = the recipe's oriented box (same transform, same size) → walker + vehicle.
   OSM is used only for the road graph (lots face the real streets). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DONORS, loadDonor, measureDonor, flattenDonor } from './kit-donors.mjs';

export const DISTRICT_RULE = Object.freeze({
  id: 'kfb-kit-district-v1', seed: 20260928, maxBuildings: 110,
  pocketRadiusM: 38, gapM: [1.2, 3.6], rowSetbackM: [0.5, 1.2], houseSetbackM: [3, 5.5], clearM: 0.45, tileMarginM: 4
});
/* storey counts read from the isolated renders (donors.html) · scale = world metres per source unit */
export const ARCHETYPES = Object.freeze({
  'kk-A': { floors: 2, scale: 5.6, role: 'shop', roof: 'flat-parapet', rhythm: 'kk-3bay-shopfront' },
  'kk-B': { floors: 2, scale: 5.6, role: 'row', roof: 'flat-parapet', rhythm: 'kk-4bay' },
  'kk-C': { floors: 3, scale: 5.6, role: 'row', roof: 'flat-parapet', rhythm: 'kk-3bay' },
  'kk-D': { floors: 3, scale: 5.6, role: 'row', roof: 'flat-parapet', rhythm: 'kk-4bay' },
  'kk-E': { floors: 3, scale: 5.6, role: 'shop', roof: 'flat-parapet', rhythm: 'kk-4bay-groundshop' },
  'kk-F': { floors: 3, scale: 5.6, role: 'shop', roof: 'flat-parapet', rhythm: 'kk-5bay-shopfront' },
  'kk-G': { floors: 3, scale: 5.6, role: 'row', roof: 'flat-parapet', rhythm: 'kk-5bay' },
  'kk-H': { floors: 4, scale: 5.6, role: 'accent', roof: 'flat-parapet', rhythm: 'kk-stepped-4' },
  'ks-a': { floors: 1, scale: 7.2, role: 'house', roof: 'gable-cluster', rhythm: 'ks-door-2win' },
  'ks-c': { floors: 1, scale: 7.2, role: 'house', roof: 'gable-cluster', rhythm: 'ks-door-2win' },
  'ks-h': { floors: 1, scale: 7.2, role: 'house', roof: 'gable-split', rhythm: 'ks-door-2win' },
  'ks-m': { floors: 1, scale: 7.2, role: 'house', roof: 'gable-long', rhythm: 'ks-door-2win' },
  'tt-house': { floors: 1, scale: 1.3, role: 'house', roof: 'gable-cross', rhythm: 'tt-door-2win' }
});
const PALETTE = ['#fff1c9', '#ffd9cf', '#d9f0e4', '#dce9ff', '#f6dcf0', '#eef6c9', '#ffe2c2', '#e6ddfa', '#ffffff', '#ffffff'];
const MIX = {
  pocket: ['kk-A', 'kk-E', 'kk-F', 'kk-A', 'kk-E', 'kk-C', 'kk-G'],
  residential: ['ks-a', 'ks-c', 'ks-h', 'ks-m', 'tt-house', 'ks-a', 'ks-c', 'kk-B'],
  mixed: ['kk-B', 'kk-C', 'kk-D', 'kk-G', 'kk-B', 'ks-m', 'kk-D', 'kk-C'],
  accent: [['kk-H'], ['kk-C', 'kk-B'], ['kk-D', 'kk-A']]
};
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* oriented rectangle helpers */
function corners(b, pad = 0) {
  const c = Math.cos(b.yaw), s = Math.sin(b.yaw), hx = b.w / 2 + pad, hz = b.d / 2 + pad, out = [];
  for (const [u, v] of [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz], [0, -hz], [0, hz], [-hx, 0], [hx, 0], [0, 0]]) out.push({ x: b.x + u * c + v * s, z: b.z - u * s + v * c });
  return out;
}
function obbOverlap(a, b, pad) {
  const axes = [a.yaw, a.yaw + Math.PI / 2, b.yaw, b.yaw + Math.PI / 2].map((t) => [Math.sin(t), Math.cos(t)]);
  const proj = (o, [ax, az]) => { const pts = corners(o, pad).slice(0, 4).map((p) => p.x * ax + p.z * az); return [Math.min(...pts), Math.max(...pts)]; };
  return axes.every((ax) => { const A = proj(a, ax), B = proj(b, ax); return A[0] < B[1] && B[0] < A[1]; });
}
export function insideOBB(b, x, z, pad = 0) {
  const dx = x - b.x, dz = z - b.z, c = Math.cos(b.yaw), s = Math.sin(b.yaw);
  const u = dx * c - dz * s, v = dx * s + dz * c;
  return Math.abs(u) <= b.w / 2 + pad && Math.abs(v) <= b.d / 2 + pad;
}

/* road chains inside the tile (same OSM graph as the clay road) */
function driveLines(zone, rect, widths) {
  const out = [];
  for (const r of zone.roads) {
    const w = widths[r.cls]; if (!w || r.tunnel === 'yes' || r.layer < 0 || !r.line || r.line.length < 2) continue;
    if (!r.line.some((p) => p.x > rect.minX - 20 && p.x < rect.maxX + 20 && p.z > rect.minZ - 20 && p.z < rect.maxZ + 20)) continue;
    out.push({ id: r.id, cls: r.cls, name: r.name, hw: w / 2, pts: r.line.map((p) => ({ x: p.x, z: p.z })) });
  }
  return out;
}
function crossroads(lines, rect) {
  const key = (p) => Math.round(p.x) + ',' + Math.round(p.z), deg = new Map();
  for (const l of lines) for (const p of l.pts) { const k = key(p); const e = deg.get(k) || { p, n: 0, cls: new Set() }; e.n++; e.cls.add(l.id); deg.set(k, e); }
  const cx = (rect.minX + rect.maxX) / 2, cz = (rect.minZ + rect.maxZ) / 2;
  let best = null;
  for (const e of deg.values()) {
    if (e.cls.size < 2) continue;
    const d = Math.hypot(e.p.x - cx, e.p.z - cz); if (d > 75) continue;
    const score = e.cls.size * 25 - d; if (!best || score > best.score) best = { ...e.p, degree: e.cls.size, score };
  }
  return best || { x: cx, z: cz, degree: 0, score: 0 };
}

export function planDistrict({ zone, rect, road, heightAt, reserved = [], rule = DISTRICT_RULE, widths }) {
  const rnd = mulberry32(rule.seed), pick = (a) => a[Math.floor(rnd() * a.length)], lerp = (a, b) => a + (b - a) * rnd();
  const lines = driveLines(zone, rect, widths), pocket = crossroads(lines, rect);
  const placed = [], rejected = { road: 0, overlap: 0, tile: 0, reserved: 0 };
  const SW = road.sidewalkM;
  const zoneOf = (x, z, cls) => Math.hypot(x - pocket.x, z - pocket.z) < rule.pocketRadiusM ? 'pocket' : cls === 'residential' || cls === 'service' ? 'residential' : 'mixed';
  function tryPlace(recipe) {
    const pts = corners(recipe, rule.clearM);
    for (const p of pts) {
      if (p.x < rect.minX + rule.tileMarginM || p.x > rect.maxX - rule.tileMarginM || p.z < rect.minZ + rule.tileMarginM || p.z > rect.maxZ - rule.tileMarginM) { rejected.tile++; return false; }
      if (road.dDrive(p.x, p.z, 50) < SW + 0.2 || road.dFoot(p.x, p.z, 50) < 0.25) { rejected.road++; return false; }
    }
    if (reserved.some((r) => pts.some((p) => Math.hypot(p.x - r.x, p.z - r.z) < r.r) || Math.hypot(recipe.x - r.x, recipe.z - r.z) < r.r + Math.max(recipe.w, recipe.d) / 2)) { rejected.reserved++; return false; }
    if (placed.some((o) => obbOverlap(o, recipe, 0.6))) { rejected.overlap++; return false; }
    placed.push(recipe); return true;
  }
  function recipeAt(p, n, side, hw, arch, zoneId, extra = {}) {
    const A = ARCHETYPES[arch], seed = Math.floor(rnd() * 1e9);
    const sx = lerp(0.95, 1.07), sy = lerp(0.93, 1.1), sz = lerp(0.95, 1.07), lean = (rnd() - 0.5) * 0.05, twist = (rnd() - 0.5) * 0.06;
    const w = A.size.x * A.scale * sx, d = A.size.z * A.scale * sz, h = A.size.y * A.scale * sy;
    const set = A.role === 'house' ? lerp(...rule.houseSetbackM) : lerp(...rule.rowSetbackM);
    const off = hw + SW + set + d / 2, x = p.x + n.x * side * off, z = p.z + n.z * side * off;
    const fx = -n.x * side, fz = -n.z * side, yaw = Math.atan2(fx, fz) + twist;
    return {
      id: '', family: A.family, archetype: arch, floorCount: A.floors, zone: zoneId,
      body: { w: +w.toFixed(2), d: +d.toFixed(2), h: +h.toFixed(2) }, roof: A.roof, facadeRhythm: A.rhythm,
      palette: pick(PALETTE), deformationSeed: seed, deform: { sx: +sx.toFixed(3), sy: +sy.toFixed(3), sz: +sz.toFixed(3), lean: +lean.toFixed(3) },
      x, z, yaw, w, d, h, stack: [], ...extra
    };
  }
  /* 1 · landmark at the crossroads corner: kk-F base + kk-H upper (setback) = 7 storeys */
  /* walk a polyline by arc length; fn returns the advance in metres, or 'stop' */
  const tryLine = (l, start, fn) => {
    const pts = l.pts; let acc = 0, next = start;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], L = Math.hypot(b.x - a.x, b.z - a.z); if (L < 1e-3) continue;
      const tx = (b.x - a.x) / L, tz = (b.z - a.z) / L, n = { x: -tz, z: tx };
      while (next < acc + L) {
        const t = next - acc, res = fn({ x: a.x + tx * t, z: a.z + tz * t }, n, next);
        if (res === 'stop') return;
        next += typeof res === 'number' ? res : 2;
      }
      acc += L;
    }
  };
  let landmark = null;
  const byPocket = lines.slice().sort((a, b) => Math.min(...a.pts.map((p) => Math.hypot(p.x - pocket.x, p.z - pocket.z))) - Math.min(...b.pts.map((p) => Math.hypot(p.x - pocket.x, p.z - pocket.z))));
  for (const l of byPocket) {
    tryLine(l, 0, (p, n) => {
      if (Math.hypot(p.x - pocket.x, p.z - pocket.z) > 30 || Math.hypot(p.x - pocket.x, p.z - pocket.z) < 12) return 2;
      for (const side of [1, -1]) {
        const r = recipeAt(p, n, side, l.hw, 'kk-F', 'landmark');
        r.deform.sy = 1.05; r.h = ARCHETYPES['kk-F'].size.y * ARCHETYPES['kk-F'].scale * 1.05;
        if (tryPlace(r)) {
          const U = ARCHETYPES['kk-H'], k = 0.86;
          r.stack.push({ archetype: 'kk-H', scale: k, yOffset: r.h * 0.955, h: U.size.y * U.scale * k });
          r.floorCount = ARCHETYPES['kk-F'].floors + U.floors; r.roof = 'stepped-setback + sign socket'; r.h = r.h * 0.955 + U.size.y * U.scale * k;
          r.signSocket = { y: +r.h.toFixed(2), kind: 'billboard-roof', media: 'none (no autoplay)' };
          landmark = r; return 'stop';
        }
      }
      return 2;
    });
    if (landmark) break;
  }
  /* 2 · street lots, both sides, ordered by distance to the pocket */
  let accents = 0;
  for (const l of byPocket) {
    for (const side of [1, -1]) {
      tryLine(l, lerp(1, 5), (p, n) => {
        if (placed.length >= rule.maxBuildings) return 'stop';
        const z = zoneOf(p.x, p.z, l.cls);
        let arch = pick(MIX[z]), stack = null;
        if (z !== 'residential' && accents < 9 && rnd() < 0.14) { const combo = pick(MIX.accent); arch = combo[0]; stack = combo[1] || null; }
        const r = recipeAt(p, n, side, l.hw, arch, z);
        if (stack) {
          const U = ARCHETYPES[stack], k = 0.96;
          r.stack.push({ archetype: stack, scale: k, yOffset: r.h * 0.955, h: U.size.y * U.scale * k });
          r.floorCount += U.floors; r.h = r.h * 0.955 + U.size.y * U.scale * k;
        }
        if (!tryPlace(r)) return 2.5;
        if (r.floorCount >= 4) accents++;
        return r.w + lerp(...rule.gapM);
      });
    }
  }
  /* 3 · second row of small houses behind the residential/mixed street front (garden lots) */
  for (const l of byPocket) {
    if (l.cls === 'primary') continue;
    for (const side of [1, -1]) {
      tryLine(l, lerp(3, 9), (p, n) => {
        if (placed.length >= rule.maxBuildings) return 'stop';
        if (Math.hypot(p.x - pocket.x, p.z - pocket.z) < rule.pocketRadiusM) return 4;
        const arch = pick(MIX.residential), r = recipeAt(p, n, side, l.hw + 15 + lerp(0, 4), arch, 'residential-back');
        if (!tryPlace(r)) return 3;
        return r.w + lerp(2.5, 6);
      });
    }
  }
  placed.forEach((r, i) => {
    r.id = 'kfb-kit-' + String(i).padStart(3, '0');
    let lo = Infinity, hi = -Infinity; for (const p of corners(r, 0.35)) { const y = heightAt(p.x, p.z); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    r.baseY = hi + 0.12; r.padBottomY = lo - 0.6;
  });
  const floors = {}; for (const r of placed) floors[r.floorCount] = (floors[r.floorCount] || 0) + 1;
  const zones = {}; for (const r of placed) zones[r.zone] = (zones[r.zone] || 0) + 1;
  return { recipes: placed, pocket, landmark, report: { rule: rule.id, seed: rule.seed, buildings: placed.length, floors, zones, rejected, pocket: { x: +pocket.x.toFixed(1), z: +pocket.z.toFixed(1), degree: pocket.degree }, landmark: landmark && { id: landmark.id, floors: landmark.floorCount, h: +landmark.h.toFixed(1) } } };
}

/* instance matrix from the recipe: T(base) · R(yaw) · lean shear · S(scale·deform) */
const _m = new THREE.Matrix4(), _sh = new THREE.Matrix4(), _r = new THREE.Matrix4(), _s = new THREE.Matrix4();
export function recipeMatrix(r, part = null) {
  const A = ARCHETYPES[part ? part.archetype : r.archetype], k = part ? part.scale : 1;
  /* a stacked part starts where the leaning body below ends: local offset (lean·y, y, 0), rotated by yaw */
  const oy = part ? part.yOffset : 0, ox = r.deform.lean * oy, c = Math.cos(r.yaw), s = Math.sin(r.yaw);
  _m.makeTranslation(r.x + ox * c, r.baseY + oy, r.z - ox * s);
  _r.makeRotationY(r.yaw);
  _sh.set(1, r.deform.lean, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  _s.makeScale(A.scale * r.deform.sx * k, A.scale * r.deform.sy * (part ? k : 1), A.scale * r.deform.sz * k);
  return new THREE.Matrix4().multiplyMatrices(_m, _r).multiply(_sh).multiply(_s);
}

export async function loadArchetypes({ makeMaterial, seedGeometry }) {
  const measured = [], meshes = {};
  await Promise.all(DONORS.map(async (d) => {
    const l = await loadDonor(d); measured.push(measureDonor(l));
    const f = flattenDonor(l.scene), parts = f.parts;
    const geo = mergeGeometries(parts.map((p) => mergeGeometries(p.geos.map((g) => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); if (g.attributes.color) g.deleteAttribute('color'); return g; }))), true);
    seedGeometry(geo, d.id.split('').reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7));
    geo.computeBoundingBox();
    meshes[d.id] = { geo, materials: parts.map((p) => makeMaterial(p.material)), size: f.size };
    Object.defineProperty(ARCHETYPES[d.id], 'size', { value: f.size.clone(), enumerable: false, configurable: true });
    ARCHETYPES[d.id].family = d.family;
  }));
  measured.sort((a, b) => a.id.localeCompare(b.id));
  return { measured, meshes };
}

export function buildDistrict({ plan, meshes, padMaterial }) {
  const group = new THREE.Group(); group.name = 'KFB kit district · ' + DISTRICT_RULE.id;
  const count = {};
  const push = (arch, M, color) => { (count[arch] ||= []).push({ M, color }); };
  for (const r of plan.recipes) {
    const c = new THREE.Color(r.palette);
    push(r.archetype, recipeMatrix(r), c);
    for (const part of r.stack) push(part.archetype, recipeMatrix(r, part), c);
  }
  const instanced = [];
  for (const [arch, list] of Object.entries(count)) {
    const m = meshes[arch], mat = m.materials.length > 1 ? m.materials : m.materials[0];
    const im = new THREE.InstancedMesh(m.geo, mat, list.length);
    list.forEach((e, i) => { im.setMatrixAt(i, e.M); im.setColorAt(i, e.color); });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); im.castShadow = true; im.receiveShadow = true; im.name = 'kit:' + arch;
    group.add(im); instanced.push({ arch, n: list.length });
  }
  /* foundation pads: one instanced box, footprint + 0.35 m, from below the terrain up to the base */
  const pad = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), padMaterial, plan.recipes.length);
  plan.recipes.forEach((r, i) => {
    const h = r.baseY - r.padBottomY, M = new THREE.Matrix4().compose(new THREE.Vector3(r.x, r.padBottomY + h / 2, r.z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), r.yaw), new THREE.Vector3(r.w + 0.7, h, r.d + 0.7));
    pad.setMatrixAt(i, M);
  });
  pad.receiveShadow = true; pad.name = 'kit:foundation-pads'; group.add(pad);
  return { group, instanced, drawCalls: instanced.length + 1 };
}

/* collision from the SAME recipes: oriented boxes (pad + body) → trimesh, and a point query */
export function districtCollision(plan) {
  const V = [], I = [];
  for (const r of plan.recipes) {
    const c = Math.cos(r.yaw), s = Math.sin(r.yaw), hx = r.w / 2 + 0.35, hz = r.d / 2 + 0.35, y0 = r.padBottomY, y1 = r.baseY + r.h;
    const base = V.length / 3;
    for (const y of [y0, y1]) for (const [u, v] of [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]]) V.push(r.x + u * c + v * s, y, r.z - u * s + v * c);
    const q = [[0, 1, 2, 0, 2, 3], [4, 6, 5, 4, 7, 6], [0, 4, 5, 0, 5, 1], [1, 5, 6, 1, 6, 2], [2, 6, 7, 2, 7, 3], [3, 7, 4, 3, 4, 0]];
    for (const f of q) for (const k of f) I.push(base + k);
  }
  const cell = 16, hash = new Map();
  plan.recipes.forEach((r, i) => {
    const R = Math.hypot(r.w, r.d) / 2 + 1;
    for (let a = Math.floor((r.x - R) / cell); a <= Math.floor((r.x + R) / cell); a++) for (let b = Math.floor((r.z - R) / cell); b <= Math.floor((r.z + R) / cell); b++) { const k = a + ',' + b; if (!hash.has(k)) hash.set(k, []); hash.get(k).push(i); }
  });
  const at = (x, z, pad = 0.35) => { const L = hash.get(Math.floor(x / cell) + ',' + Math.floor(z / cell)); if (!L) return null; for (const i of L) { const r = plan.recipes[i]; if (insideOBB(r, x, z, pad)) return r; } return null; };
  return { vertices: new Float32Array(V), indices: new Uint32Array(I), at };
}
