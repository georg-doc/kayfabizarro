import { surfaceFor } from '../../core/surface';
// villages module: stage-3 village layer (buildings facing roads, one colour per village, well square, fields with
// stone walls), per-chunk rendering + fitted colliders, `villages` service, showcase. See NOTES.md.
import * as THREE from 'three';
import type { CameraView, CellData, CoreContext, GameModule, WorldLayer } from '../../core/types';
import { hexToWorld, hexDistance, edgeVector, worldToHex } from '../../core/hex';
import { LEVEL_H } from '../../core/units';
import { orbitToView } from '../../core/debug';
import { allAssetIds, ALL_TYPES, type BuildingType } from './catalog';
import { corners, overlaps } from './fit';
import { bindPlanner } from './plan';
import { VillageRenderer } from './render';
import { villagesNear, nearestVillage, villageAt, villageItemsAt, ruralNear, type VillageInfo } from './api';
import { buildDoorRig, rigTypeIds, RIG_Y, RIG_DZ } from './doors';

// ------------------------------------------------------------------ stage-3 layer
const villageLayer: WorldLayer = {
  id: 'villages',
  stage: 3,
  apply(cell: CellData, ctx) {
    // never touch roads, rivers, bridges, water, coast, ramps, rocks, reserved cells
    if (cell.roadMask || cell.riverMask || cell.bridge || cell.water || cell.coastMask || cell.slope || cell.reserved) return;
    const pl = bindPlanner(ctx.seed, (q, r) => ctx.cellAt(3, q, r));
    // core flattening (integrator permission, round 4): one-level steps inside the core move outward
    const fl = pl.flatAt(cell.q, cell.r);
    if (fl !== null && fl !== cell.level) {
      cell.tags.push('village-fit-intent:'+fl);
      cell.tags = cell.tags.filter((t) => t !== 'cliff');
      cell.tags.push('flattened');
    }
    const hit = pl.cell(cell.q, cell.r);
    if (!hit) return;
    const { plan, cell: pc } = hit;
    cell.village = { id: plan.id, color: plan.color, role: pc.role };
    cell.tags.push('village');
    if (plan.feature) cell.tags.push('rural', 'rural:' + plan.feature);
    if (pc.asset && pc.type) {
      cell.building = { asset: pc.asset, rotY: pc.rotY };
      cell.reserved = true;
      for (const it of pc.items) {
        const b = 'bld:' + it.type;
        if (!cell.tags.includes(b)) cell.tags.push(b);
        if (it.door >= 0 && !cell.tags.includes('door:' + it.door)) cell.tags.push('door:' + it.door);
      }
      if (pc.items.length > 1) cell.tags.push('pair');
    }
    if (pc.square) cell.tags.push('square', 'well', 'toward:' + pc.items[0].face);
    if (pc.plaza) cell.tags.push('plaza');
    if (pc.field) cell.tags.push('field', 'crop:' + (pc.crop ?? 'grain'));
    if (pc.garden) cell.tags.push('garden');
    for (const d of pc.fences) cell.tags.push('fence:' + d);
    for (const d of pc.gates) cell.tags.push('gate:' + d);
    cell.forest = 0;
  },
};

// ------------------------------------------------------------------ feature search for presets (deterministic)
const found = new Map<string, VillageInfo | null>();
function pickVillage(ctx: CoreContext, which: 'village' | 'any'): VillageInfo | null {
  const k = which + ctx.world.seed;
  if (found.has(k)) return found.get(k)!;
  let v: VillageInfo | null = null;
  if (which === 'any') v = villagesNear(ctx.world.seed, 0, 0, 70)[0] ?? null;
  else v = nearestVillage(ctx.world.seed, 0, 0, 70);
  found.set(k, v);
  return v;
}

const yawOf = (vx: number, vz: number) => (Math.atan2(vx, vz) * 180) / Math.PI;
const fallback = (ctx: CoreContext): CameraView => orbitToView({ target: [0, ctx.world.heightAt(0, 0), 0], yaw: 30, pitch: 40, dist: 120 });

/** Unit xz vector from the village centre along its longest street arm. */
function armDir(v: VillageInfo): { x: number; z: number } {
  const far = [...v.streets].sort((a, b) => b.ds - a.ds)[0];
  const c = hexToWorld(v.centre.q, v.centre.r);
  if (!far || far.ds === 0) return { x: 0.6, z: 0.8 };
  const f = hexToWorld(far.q, far.r);
  const l = Math.hypot(f.x - c.x, f.z - c.z) || 1;
  return { x: (f.x - c.x) / l, z: (f.z - c.z) / l };
}

function streetView(v: VillageInfo, ctx: CoreContext): CameraView {
  // stand on a flat street cell 2–3 cells out at the village level, eye height, look toward the centre
  const flat = v.streets.filter((s) => s.ds >= 2 && !ctx.world.cell(s.q, s.r).slope && ctx.world.cell(s.q, s.r).level === v.level);
  // the street with the most frontage: building cells next to the street cell
  const bld = new Set(v.cells.filter((c) => c.items.length).map((c) => c.q + ',' + c.r));
  const front = (s: { q: number; r: number }) => [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]].filter(([a, b]) => bld.has(s.q + a + ',' + (s.r + b))).length;
  const st = flat.sort((a, b) => front(b) - front(a) || Math.abs(a.ds - 3) - Math.abs(b.ds - 3) || a.q - b.q || a.r - b.r)[0];
  const c = hexToWorld(v.centre.q, v.centre.r);
  if (!st) return fallback(ctx);
  const s = hexToWorld(st.q, st.r);
  const gy = ctx.world.heightAt(s.x, s.z);
  return { position: [s.x, gy + 1.75, s.z], target: [c.x, v.world.y + 2.0, c.z], fov: 60 };
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  centre: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v) return fallback(ctx);
    const a = armDir(v);
    // look between two arms (rotate 30° off the street)
    const ang = Math.atan2(a.z, a.x) + 0.5;
    return orbitToView({ target: [v.world.x, v.world.y + 1, v.world.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 34, dist: 48 });
  },
  street: (ctx) => {
    const v = pickVillage(ctx, 'village');
    return v ? streetView(v, ctx) : fallback(ctx);
  },
  overview: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v) return fallback(ctx);
    const a = armDir(v);
    const ang = Math.atan2(a.z, a.x) + 0.9;
    return orbitToView({ target: [v.world.x, v.world.y, v.world.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 48, dist: 130 });
  },
  fields: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v || !v.fields.length) return fallback(ctx);
    let fx = 0, fz = 0;
    for (const f of v.fields) {
      const w = hexToWorld(f.q, f.r);
      fx += w.x / v.fields.length;
      fz += w.z / v.fields.length;
    }
    // camera beyond the fields looking back toward the village
    const dx = fx - v.world.x, dz = fz - v.world.z;
    const ang = Math.atan2(dz, dx) + 0.6;
    return orbitToView({ target: [fx, v.world.y + 1, fz], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 30, dist: 55 });
  },
  /** where the demo spawns: the village spawn point on its street, seen from ~10 m behind at head height */
  spawn: (ctx) => {
    const v = pickVillage(ctx, 'any');
    if (!v?.spawn) return fallback(ctx);
    const p = v.spawn.world, h = v.spawn.heading;
    const dx = Math.sin(h), dz = Math.cos(h);
    return { position: [p.x - dx * 10, p.y + 3.2, p.z - dz * 10], target: [p.x + dx * 10, p.y + 1.6, p.z + dz * 10], fov: 55 };
  },
  /** walk-out view: from the village's outermost street cell along that road, head-up, 200 m deep */
  walkout: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v) return fallback(ctx);
    const far = [...v.streets].sort((a, b) => b.ds - a.ds || a.q - b.q || a.r - b.r)[0];
    const c = hexToWorld(v.centre.q, v.centre.r), f = hexToWorld(far.q, far.r);
    const dx = f.x - c.x, dz = f.z - c.z, l = Math.hypot(dx, dz) || 1;
    const y = ctx.world.heightAt(f.x, f.z);
    return { position: [f.x - (dx / l) * 8, y + 7, f.z - (dz / l) * 8], target: [f.x + (dx / l) * 200, y, f.z + (dz / l) * 200], fov: 55 };
  },
  ...Object.fromEntries(
    (['farmstead', 'watchtower', 'mine', 'lumbercamp', 'chapel'] as const).map((f) => [
      `rural_${f}`,
      (ctx: CoreContext) => {
        const r = ruralNear(ctx.world.seed, 0, 0, 90).find((x) => x.feature === f);
        if (!r) return fallback(ctx);
        const it = r.cells.find((c) => c.items.length)!.items[0];
        const e = { x: Math.cos((it.face * Math.PI) / 3), z: -Math.sin((it.face * Math.PI) / 3) };
        const ang = Math.atan2(e.z, e.x) + 0.6;
        return orbitToView({ target: [it.world.x, it.world.y + 3, it.world.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 20, dist: 34 });
      },
    ]),
  ),
  /** close-up of the plaza edge against the crossing tile (seen from the crossing, low) */
  plaza: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v?.plaza) return fallback(ctx);
    const p = hexToWorld(v.plaza.q, v.plaza.r);
    const e = edgeVector(v.plaza.toward);
    const mx = p.x + e.x * 7.5, mz = p.z + e.z * 7.5; // shared edge midpoint
    const ang = Math.atan2(e.z, e.x) + 0.6;
    return orbitToView({ target: [mx, v.world.y + 0.3, mz], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 22, dist: 11 });
  },
  /** close-up of a house door (ground contact, stairs) */
  door: (ctx) => {
    const v = pickVillage(ctx, 'village');
    const d = v?.doors.find((x) => x.type === 'home_B') ?? v?.doors[0];
    if (!v || !d) return fallback(ctx);
    const e = edgeVector(d.d);
    const ang = Math.atan2(e.z, e.x) + 0.7;
    return orbitToView({ target: [d.world.x, d.world.y + 1.5, d.world.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 14, dist: 16 });
  },
  well: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v?.well) return fallback(ctx);
    const w = v.well.world;
    const ang = Math.atan2(w.z - v.world.z, w.x - v.world.x) + 2.6;
    return orbitToView({ target: [w.x, w.y + 1.2, w.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 18, dist: 13 });
  },
  wall: (ctx) => {
    const v = pickVillage(ctx, 'village');
    const f = v?.cells.find((c) => c.field && c.fences.length);
    if (!v || !f) return fallback(ctx);
    const c = hexToWorld(f.q, f.r);
    const e = edgeVector(f.fences[0]);
    const x = c.x + e.x * 7.5, z = c.z + e.z * 7.5;
    const ang = Math.atan2(e.z, e.x) + 0.5;
    return orbitToView({ target: [x, v.world.y + 1, z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 16, dist: 15 });
  },
  /** debug: top-down on the village centre */
  top: (ctx) => {
    const v = pickVillage(ctx, 'village');
    if (!v) return fallback(ctx);
    return orbitToView({ target: [v.world.x, v.world.y, v.world.z], yaw: 0, pitch: 89, dist: 150 });
  },
  // close-ups of the first building of each type near the origin (ground contact / facing checks)
  ...Object.fromEntries(
    ALL_TYPES.map((t) => [
      `type_${t}`,
      (ctx: CoreContext) => {
        for (const v of villagesNear(ctx.world.seed, 0, 0, 70)) {
          const c = v.cells.find((x) => x.type === t);
          if (!c) continue;
          const w = hexToWorld(c.q, c.r);
          const e = edgeVector(c.door >= 0 ? c.door : 0);
          const ang = Math.atan2(e.z, e.x) + 0.55;
          return orbitToView({ target: [w.x, v.world.y + 2.5, w.z], yaw: yawOf(Math.cos(ang), Math.sin(ang)), pitch: 16, dist: 22 });
        }
        return fallback(ctx);
      },
    ]),
  ),
  ...Object.fromEntries(
    Array.from({ length: 19 }, (_, i) => [`door_row${i}`, () => orbitToView({ target: [0, RIG_Y + 4, -i * RIG_DZ], yaw: 0, pitch: 16, dist: 270, fov: 14 })]),
  ),
};

// ------------------------------------------------------------------ module
let renderer: VillageRenderer | null = null;

const mod: GameModule = {
  id: 'villages',
  layer: villageLayer,

  async init(ctx) {
    const seed = ctx.world.seed;
    bindPlanner(seed, (q, r) => ctx.world.cellAt(3, q, r));
    const surface=surfaceFor(seed);
    const planner=bindPlanner(seed,(q,r)=>ctx.world.cellAt(3,q,r));
    surface.contribute({id:'10-village-foundations',owner:'village',sample:(x,z)=>{
      const a=worldToHex(x,z);let result:null|{height:number;weight:number}=null;
      for(const plan of planner.plansNear(a.q,a.r)) {
        const centre=hexToWorld(plan.centre.q,plan.centre.r);
        const radius=Math.max(30,...[...plan.cells.values()].map(c=>{const w=hexToWorld(c.q,c.r);return Math.hypot(w.x-centre.x,w.z-centre.z)+12;}));
        const t=Math.max(0,Math.min(1,(radius-Math.hypot(x-centre.x,z-centre.z))/15));
        const weight=t*t*(3-2*t);if(weight && (!result||weight>result.weight))result={height:surface.baseHeight(centre.x,centre.z),weight};
      }
      return result;
    }});
    await ctx.assets.preload(allAssetIds());
    renderer = new VillageRenderer(ctx);
    const api = {
      villagesNear: (q: number, r: number, radius: number) => villagesNear(seed, q, r, radius),
      nearestVillage: (q = 0, r = 0, radius = 60) => nearestVillage(seed, q, r, radius),
      villageAt: (q: number, r: number) => villageAt(seed, q, r),
      villageItemsAt: (q: number, r: number) => villageItemsAt(seed, q, r),
      ruralNear: (q: number, r: number, radius: number) => ruralNear(seed, q, r, radius),
      stats: () => ({ render: renderer?.stats }),
    };
    ctx.services.set('villages', api);
    (window as unknown as Record<string, unknown>).__villages = {
      ...api,
      census: (R = 40) => census(seed, R),
      rejects: () => bindPlanner(seed, (q, r) => ctx.world.cellAt(3, q, r)).rejects,
      find: () => ({ village: pickVillage(ctx, 'village'), any: pickVillage(ctx, 'any') }),
    };
  },

  buildChunk(chunk, out) {
    renderer?.build(chunk, out);
  },

  showcaseUses: ['terrain', 'roads', 'nature'],
  async showcase(ctx, params) {
    if (params.get('view') === 'doors') {
      await ctx.assets.preload(rigTypeIds());
      buildDoorRig(ctx);
      return;
    }
    ctx.chunks.configure({ loadRadius: 260, urgentRadius: 260 });
    const v = presets.overview(ctx);
    ctx.chunks.focus.set(v.target[0], 0, v.target[2]);
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
  },

  cameraPresets: presets,
};

/** Village statistics in a hex disc of radius R around the origin. */
function census(seed: number, R: number) {
  const vs = villagesNear(seed, 0, 0, R);
  const areaKm2 = (3 * R * R + 3 * R + 1) * ((15 * 15 * Math.sqrt(3)) / 2) / 1e6;
  const villages = vs.filter((v) => v.kind === 'village');
  const hamlets = vs.filter((v) => v.kind === 'hamlet');
  const bld = (v: VillageInfo) => v.cells.reduce((s, c) => s + c.items.filter((i) => i.type !== 'well').length, 0);
  const vv = vs.filter((v) => v.kind === 'village');
  let minSpacing = Infinity;
  for (const a of vv) for (const b of vv) if (a !== b) minSpacing = Math.min(minSpacing, hexDistance(a.centre.q, a.centre.r, b.centre.q, b.centre.r));
  const types: Record<string, number> = {};
  const colors: Record<string, number> = {};
  for (const v of vs) {
    colors[v.color] = (colors[v.color] ?? 0) + 1;
    for (const c of v.cells) for (const it of c.items) types[it.type] = (types[it.type] ?? 0) + 1;
  }
  return {
    areaKm2: +areaKm2.toFixed(2),
    villages: villages.length,
    hamlets: hamlets.length,
    perKm2: +((villages.length + hamlets.length) / areaKm2).toFixed(2),
    villagesPerKm2: +(villages.length / areaKm2).toFixed(2),
    buildingsPerVillage: villages.length ? +(villages.reduce((s, v) => s + bld(v), 0) / villages.length).toFixed(1) : 0,
    buildingsPerHamlet: hamlets.length ? +(hamlets.reduce((s, v) => s + bld(v), 0) / hamlets.length).toFixed(1) : 0,
    minMax: villages.length ? [Math.min(...villages.map(bld)), Math.max(...villages.map(bld))] : [],
    wells: vs.filter((v) => v.well).length,
    plazas: vs.filter((v) => v.plaza).length,
    pairs: vs.reduce((s, v) => s + v.cells.filter((c) => c.items.length > 1).length, 0),
    gardens: vs.reduce((s, v) => s + v.cells.filter((c) => c.garden).length, 0),
    minVillageSpacing: minSpacing,
    rural: (() => {
      const rs = ruralNear(seed, 0, 0, R);
      const by: Record<string, number> = {};
      for (const x of rs) by[x.feature!] = (by[x.feature!] ?? 0) + 1;
      return { total: rs.length, perKm2: +(rs.length / areaKm2).toFixed(2), by };
    })(),
    footprintOverlaps: (() => {
      let n = 0;
      for (const v of vs) {
        const its = v.cells.flatMap((c) => c.items.map((it) => corners(it.type as BuildingType, it.rotY, it.world.x, it.world.z, 0.1)));
        for (let i = 0; i < its.length; i++) for (let j = i + 1; j < its.length; j++) if (overlaps(its[i], its[j])) n++;
      }
      return n;
    })(),
    fieldsPerVillage: villages.length ? +(villages.reduce((s, v) => s + v.fields.length, 0) / villages.length).toFixed(1) : 0,
    types,
    colors,
    nearest: vs[0] ? { id: vs[0].id, d: hexDistance(0, 0, vs[0].centre.q, vs[0].centre.r) } : null,
  };
}

void LEVEL_H;
export default mod;
