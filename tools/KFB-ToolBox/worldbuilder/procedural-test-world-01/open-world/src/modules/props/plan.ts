// Stage-6 prop placement: small hand-composed VIGNETTES, each with a reason, per village. Pure function of
// (seed, village plan, final cells, terrain height, asset geometry) → cached per village. Nothing is ever scattered:
// every prop belongs to a door, the well, a work building's yard, a field edge or a village-entry flag.
//
// Placement model (see NOTES.md)
//  - A vignette is a TEMPLATE (a few props in a "wall frame": `a` along the wall, `o` away from it, optional stacking,
//    probabilistic items, seeded per-instance jitter of position / rotation) applied at a SLOT of a building (front
//    beside the door, side wall, back, toward a field, around the well, field edge).
//  - Wall slots come in from OUTSIDE until the group first touches the building's ground footprint (footprint.ts),
//    10 cm clearance → props stand flush against the outer wall.
//  - Every prop must then stand on the village's own cells or on the GRASS VERGE of its street cells (≥ 2.6 m from
//    the road strip centreline: the sand stays free), off doors / stairs, off walls / cliffs / water / other props,
//    on flat ground, and never leave a wedge gap (flush ≤ 0.2 m or ≥ 1.2 m from walls; ≤ 0.25 or ≥ 0.8 m between
//    solid props). A failing slot is rejected, never nudged elsewhere.
import type { StaticAsset } from '../../core/types';
import type { WorldModel } from '../../core/world';
import { DIRS, edgeVector, hexDistance, hexToWorld, worldToHex } from '../../core/hex';
import { HEX_SIZE, LEVEL_H } from '../../core/units';
import { hash, rand01 } from '../../core/rng';
import type { VillageInfo } from '../villages/api';
// namespace imports: the villages module evolves; a renamed export must not break this module's import
import * as VPlan from '../villages/plan';
import * as VApi from '../villages/api';
import { buildFootprint, fpHit, type Footprint } from './footprint';

export const INNER = (HEX_SIZE * Math.sqrt(3)) / 2; // 7.5 m
const P = 'hex/decoration/props/';
export const PROP_IDS = [
  'barrel', 'bucket_empty', 'bucket_water', 'crate_A_big', 'crate_A_small', 'crate_B_big', 'crate_B_small',
  'crate_long_A', 'crate_long_B', 'crate_long_C', 'crate_long_empty', 'crate_open', 'sack', 'pallet',
  'resource_lumber', 'resource_stone', 'wheelbarrow', 'flag_blue', 'flag_green', 'flag_red', 'flag_yellow',
].map((s) => P + s);

/** Props the player would bump into get a collider (small simple shapes). */
const SOLID = new Set(['barrel', 'crate_A_big', 'crate_B_big', 'crate_long_A', 'crate_long_B', 'crate_long_C', 'crate_long_empty',
  'crate_open', 'resource_lumber', 'resource_stone']); // wheelbarrows: low, open frame → no collider (pocket traps)

/**
 * Door corridor per building type: local x-range (asset units at rotation 0, door on local +Z) of the door and its
 * stairs. Nothing may stand in front of the building inside this range (+0.5 m each side). Calibrated from the
 * footprints and top views of the rig (?showcase=props&view=rig).
 */
export const DOOR_X: Record<string, [number, number]> = {
  home_A: [-0.12, 0.12],
  home_B: [-0.08, 0.34],
  tavern: [-0.32, 0.02],
  blacksmith: [-0.66, 0.7], // workshop door on the left + the open forge / anvil front: the whole front stays free
  market: [-0.16, 0.16], // the middle stall is the shop's way in; goods may stand before the outer stalls
  church: [-0.3, 0.3],
  windmill: [-0.24, 0.24],
  lumbermill: [-0.24, 0.12],
  stage_B: [-0.3, 0.3],
  stage_C: [-0.3, 0.3],
};
export const UNIT = 7.5;
/** Props keep this far (m) from every road strip centreline (KayKit road strip ≈ 4.6 m wide): the sand stays free. */
const ROAD_CLEAR = 2.45;

/**
 * Per-prop size factor on top of HEX_PROP_SCALE (documented exception, NOTES.md): the pack's buckets read thigh-high
 * next to a 1.9 m figure at 4.5; at ×0.7 a bucket is ≈ 0.4 m tall.
 */
export const PROP_K: Record<string, number> = { bucket_empty: 0.7, bucket_water: 0.7 };

export type Kind = 'door' | 'well' | 'tavern' | 'market' | 'smith' | 'lumber' | 'mill' | 'field' | 'flag' | 'paddock' | 'farm' | 'sign' | 'rest';

export interface Placed {
  id: string;
  x: number; y: number; z: number;
  /** three.js Y rotation */
  rot: number;
  /** barrel lying on its side (axis horizontal along the item's local Z) */
  lie: boolean;
  /** world footprint OBB: centre, half extents along the item's local x / z, top height above y */
  cx: number; cz: number; hx: number; hz: number; h: number;
  base: Placed | null;
  solid: boolean;
  /** uniform size factor (PROP_K), 1 for most */
  k?: number;
  /** non-uniform scale + pre-translation (fence pieces) */
  scl?: [number, number, number];
  pre?: [number, number, number];
}

export interface Vignette {
  kind: Kind;
  /** cell of the building the group belongs to */
  q: number; r: number;
  items: Placed[];
  /** centroid (ground) and outward direction, for camera presets */
  focus: { x: number; y: number; z: number };
  out: { x: number; z: number };
}

export interface VillageProps {
  id: string;
  vignettes: Vignette[];
  /** cell key → props standing on that cell (stacked props follow their base) */
  byCell: Map<string, Placed[]>;
  counts: Record<string, number>;
  ms: number;
}

const key = (q: number, r: number) => q + ',' + r;
const EV = [0, 1, 2, 3, 4, 5].map((d) => edgeVector(d));

// ---------------------------------------------------------------- environment
interface Spec { sx: number; sy: number; sz: number; bcx: number; bcz: number }

export interface Bld {
  type: string;
  q: number; r: number;
  x: number; y: number; z: number; rot: number;
  c: number; s: number;
  fp: Footprint;
  /** door corridor x-range (local metres) */
  door: [number, number] | null;
  /** bounding radius of the footprint around the pose (m) */
  rad: number;
}

export class PropEnv {
  private specs = new Map<string, Spec | null>();
  private fps = new Map<string, Footprint | null>();
  private blds = new Map<string, Bld[]>();
  private segs = new Map<string, [number, number, number, number][]>();
  /** time spent fitting building footprints (one-time per building model) */
  fpMs = 0;
  /** road-side life (pasture paddocks, farm road-side groups, crossing signposts); `?proproad=0` turns it off (A/B) */
  roadside = true;
  constructor(readonly seed: number, readonly world: WorldModel, readonly getAsset: (id: string) => StaticAsset | null) {}

  spec(id: string): Spec | null {
    if (this.specs.has(id)) return this.specs.get(id)!;
    const a = this.getAsset(id);
    const s = a
      ? { sx: a.bounds.max.x - a.bounds.min.x, sy: a.bounds.max.y - Math.max(0, a.bounds.min.y), sz: a.bounds.max.z - a.bounds.min.z, bcx: (a.bounds.max.x + a.bounds.min.x) / 2, bcz: (a.bounds.max.z + a.bounds.min.z) / 2 }
      : null;
    this.specs.set(id, s);
    return s;
  }

  /** Buildings standing on a cell, with their exact world poses (as the villages renderer places them). */
  buildings(q: number, r: number): Bld[] {
    const k = key(q, r);
    let l = this.blds.get(k);
    if (l) return l;
    l = cellBuildings(this, q, r);
    if (this.blds.size > 20000) this.blds.clear();
    this.blds.set(k, l);
    return l;
  }

  /** Road strip centreline of a road cell: segments centre → road-edge midpoints (the villages module's model). */
  roadSegs(q: number, r: number): [number, number, number, number][] {
    const k = key(q, r);
    let l = this.segs.get(k);
    if (l) return l;
    l = [];
    const c = this.world.cell(q, r);
    if (c.roadMask) {
      const w = hexToWorld(q, r);
      for (let d = 0; d < 6; d++) if (c.roadMask & (1 << d)) l.push([w.x, w.z, w.x + EV[d].x * INNER, w.z + EV[d].z * INNER]);
    }
    if (this.segs.size > 20000) this.segs.clear();
    this.segs.set(k, l);
    return l;
  }

  footprint(asset: string): Footprint | null {
    const canon = asset.replace(/_(red|green|yellow)$/, '_blue').replace(/\/(red|green|yellow)\//, '/blue/');
    if (this.fps.has(canon)) return this.fps.get(canon)!;
    const a = this.getAsset(canon) ?? this.getAsset(asset);
    const t0 = performance.now();
    const f = a ? buildFootprint(a) : null;
    this.fpMs += performance.now() - t0;
    this.fps.set(canon, f);
    return f;
  }
}

interface VItem { type: string; asset: string; x: number; z: number; rotY: number }

/** Building items of a cell: the villages API's exact poses, else the planner's items. */
function cellBuildings(env: PropEnv, q: number, r: number): Bld[] {
  const c = env.world.cell(q, r);
  if (!c.village || !c.building) return [];
  const ctr = hexToWorld(q, r);
  let items: VItem[] | null = null;
  let y = env.world.heightAt(ctr.x,ctr.z);
  try {
    const api = (VApi as { villageItemsAt?: (s: number, q: number, r: number) => { type: string; asset: string; rotY: number; world: { x: number; y: number; z: number } }[] }).villageItemsAt;
    const its = api?.(env.seed, q, r);
    if (Array.isArray(its) && its.length) {
      items = its.map((it) => ({ type: it.type, asset: it.asset, x: it.world.x, z: it.world.z, rotY: it.rotY }));
      y = env.world.heightAt(its[0].world.x,its[0].world.z);
    }
  } catch {
    items = null;
  }
  try {
    if (!items) {
      const pl = (VPlan as { plannerOf?: (s: number) => { cell(q: number, r: number): { cell: { items?: VItem[] } } | null } | null }).plannerOf?.(env.seed);
      const its = pl?.cell(q, r)?.cell?.items;
      if (Array.isArray(its) && its.length) items = its.map((it) => ({ type: it.type, asset: it.asset, x: ctr.x + it.x, z: ctr.z + it.z, rotY: it.rotY }));
    }
  } catch {
    items = null;
  }
  if (!items) items = [{ type: c.tags.find((x) => x.startsWith('bld:'))?.slice(4) ?? 'home_A', asset: c.building.asset, x: ctr.x, z: ctr.z, rotY: c.building.rotY }];
  const out: Bld[] = [];
  for (const it of items) {
    const fp = env.footprint(it.asset);
    if (!fp) continue;
    const dx = DOOR_X[it.type];
    const b = fp.box;
    out.push({
      type: it.type, q, r, x: it.x, y, z: it.z, rot: it.rotY, c: Math.cos(it.rotY), s: Math.sin(it.rotY), fp,
      door: dx ? [dx[0] * UNIT, dx[1] * UNIT] : null,
      rad: Math.hypot(Math.max(-b.x0, b.x1), Math.max(-b.z0, b.z1)) + 0.3,
    });
  }
  return out;
}

const toWorld = (b: { x: number; z: number; c: number; s: number }, lx: number, lz: number) => ({ x: b.x + b.c * lx + b.s * lz, z: b.z - b.s * lx + b.c * lz });
const toLocal = (b: { x: number; z: number; c: number; s: number }, wx: number, wz: number) => {
  const dx = wx - b.x, dz = wz - b.z;
  return { x: b.c * dx - b.s * dz, z: b.s * dx + b.c * dz };
};

/** Is world xz within `r` m of the ground footprint of any building (camera presets, validator)? */
export function buildingAt(env: PropEnv, x: number, z: number, r: number): boolean {
  const h = worldToHex(x, z);
  for (const [dq, dr] of [[0, 0], ...DIRS]) {
    for (const b of env.buildings(h.q + dq, h.r + dr)) {
      if (Math.hypot(b.x - x, b.z - z) > b.rad + r) continue;
      const l = toLocal(b, x, z);
      if (fpHit(b.fp, l.x, l.z, r)) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------- village + cell context
interface VCtx {
  env: PropEnv;
  /** cells of the village */
  vcells: Set<string>;
  /** street cells of the village that touch a village cell (their grass verges may carry props) */
  streets: Set<string>;
  plaza: { q: number; r: number } | null;
  spawn: { x: number; z: number } | null;
  /** every prop placed so far in this village */
  items: Placed[];
}

interface CellCtx {
  q: number; r: number;
  cx: number; cz: number;
  level: number;
  /** buildings within 2 cells (collision / door tests) */
  near: Bld[];
  v: VCtx;
}

function cellCtx(vc: VCtx, q: number, r: number): CellCtx {
  const env = vc.env;
  const ctr = hexToWorld(q, r);
  const near: Bld[] = [];
  for (let dq = -2; dq <= 2; dq++)
    for (let dr = -2; dr <= 2; dr++) {
      if (hexDistance(0, 0, dq, dr) > 2) continue;
      near.push(...env.buildings(q + dq, r + dr));
    }
  return { q, r, cx: ctr.x, cz: ctr.z, level: env.world.cell(q, r).level, near, v: vc };
}

function segDist(px: number, pz: number, s: [number, number, number, number]): number {
  const vx = s[2] - s[0], vz = s[3] - s[1];
  const t = Math.max(0, Math.min(1, ((px - s[0]) * vx + (pz - s[1]) * vz) / (vx * vx + vz * vz)));
  return Math.hypot(px - s[0] - vx * t, pz - s[1] - vz * t);
}

/** Can a prop (corner) stand at world xz? null = yes, else the reason. */
function spotProblem(cc: CellCtx, x: number, z: number, solid: boolean): string | null {
  const vc = cc.v, env = vc.env, W = env.world;
  const h = worldToHex(x, z);
  const k = key(h.q, h.r);
  if (!vc.vcells.has(k) && !vc.streets.has(k)) return 'out';
  const c = W.cell(h.q, h.r);
  if (c.water || c.slope || c.bridge || c.riverMask) return 'ground';
  if (c.level !== cc.level) return 'level';
  const ctr = hexToWorld(h.q, h.r);
  const dx = x - ctr.x, dz = z - ctr.z;
  let minDD = Infinity;
  for (let d = 0; d < 6; d++) minDD = Math.min(minDD, INNER - (dx * EV[d].x + dz * EV[d].z));
  // the tile rim bevel dips toward every hex seam: nothing may lie across it
  if (minDD < 0.4) return 'seam';
  // the paved plaza stays walkable: solid props only on its rim (outer 1.8 m)
  if (solid && vc.plaza && vc.plaza.q === h.q && vc.plaza.r === h.r && minDD > 1.8) return 'plaza';
  for (let d = 0; d < 6; d++) {
    const e = EV[d];
    const dd = INNER - (dx * e.x + dz * e.z);
    if (dd > 1.2) continue;
    const nq = h.q + DIRS[d][0], nr = h.r + DIRS[d][1];
    const n = W.cell(nq, nr);
    if (n.level !== c.level || n.water || n.riverMask) {
      if (dd < 1.0) return 'edge';
    } else if (c.tags.includes('fence:' + d) || n.tags.includes('fence:' + ((d + 3) % 6)) || c.tags.includes('gate:' + d) || n.tags.includes('gate:' + ((d + 3) % 6))) {
      if (dd < 1.0) return 'fence';
    } else if (!vc.vcells.has(key(nq, nr)) && !vc.streets.has(key(nq, nr))) {
      if (dd < 0.5) return 'hex';
    }
  }
  // the road surface stays free: keep off every strip centreline around
  for (const [dq, dr] of [[0, 0], ...DIRS]) for (const s of env.roadSegs(h.q + dq, h.r + dr)) if (segDist(x, z, s) < ROAD_CLEAR) return 'road';
  return null;
}

// ---------------------------------------------------------------- items + checks
function corners(p: { cx: number; cz: number; hx: number; hz: number; rot: number }, grow = 0): [number, number][] {
  const c = Math.cos(p.rot), s = Math.sin(p.rot);
  const hx = p.hx + grow, hz = p.hz + grow;
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [p.cx + c * hx * i + s * hz * j, p.cz - s * hx * i + c * hz * j]);
}

/** Do the two footprint boxes come closer than m (SAT on the boxes grown by m/2 each)? */
function obbOverlap(a: Placed, b: Placed, m: number): boolean {
  const A = corners(a, m / 2), B = corners(b, m / 2);
  const axes = [a.rot, b.rot].flatMap((r) => [[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]);
  for (const [ax, az] of axes) {
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const [x, z] of A) { const d = x * ax + z * az; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
    for (const [x, z] of B) { const d = x * ax + z * az; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
    if (a1 < b0 || b1 < a0) return false;
  }
  return true;
}

/** Sample points over an OBB (edges + interior, ≤ 0.15 m apart: thin plinth bevels and log ends can't slip between). */
function samples(p: Placed, step = 0.15): [number, number][] {
  const out: [number, number][] = [];
  const nx = Math.max(1, Math.ceil((p.hx * 2) / step)), nz = Math.max(1, Math.ceil((p.hz * 2) / step));
  const c = Math.cos(p.rot), s = Math.sin(p.rot);
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j <= nz; j++) {
      const lx = -p.hx + (2 * p.hx * i) / nx, lz = -p.hz + (2 * p.hz * j) / nz;
      out.push([p.cx + c * lx + s * lz, p.cz - s * lx + c * lz]);
    }
  return out;
}

function makeItem(env: PropEnv, id: string, x: number, z: number, rot: number, lie: boolean): Placed | null {
  const sp0 = env.spec(P + id);
  if (!sp0) return null;
  const k = PROP_K[id] ?? 1;
  const sp = k === 1 ? sp0 : { sx: sp0.sx * k, sy: sp0.sy * k, sz: sp0.sz * k, bcx: sp0.bcx * k, bcz: sp0.bcz * k };
  if (lie) {
    const r = sp.sx / 2;
    return { id: P + id, x, y: 0, z, rot, lie, cx: x, cz: z, hx: r, hz: sp.sy / 2, h: 2 * r, base: null, solid: SOLID.has(id), k };
  }
  const c = Math.cos(rot), s = Math.sin(rot);
  return {
    id: P + id, x, y: 0, z, rot, lie, cx: x + c * sp.bcx + s * sp.bcz, cz: z - s * sp.bcx + c * sp.bcz,
    hx: sp.sx / 2, hz: sp.sz / 2, h: sp.sy, base: null, solid: SOLID.has(id) || /flag_/.test(id), k,
  };
}

/** Does the prop come within `gap` m of a building footprint? */
function hitsBuilding(cc: CellCtx, p: Placed, gap: number, step = 0.15, only: Bld | null = null): boolean {
  let pts: [number, number][] | null = null;
  const pr = Math.hypot(p.hx, p.hz);
  for (const b of only ? [only] : cc.near) {
    if (Math.hypot(b.x - p.cx, b.z - p.cz) > b.rad + pr + gap) continue;
    pts ??= samples(p, step);
    for (const [x, z] of pts) {
      const l = toLocal(b, x, z);
      if (fpHit(b.fp, l.x, l.z, gap)) return true;
    }
  }
  return false;
}

/** In front of a door (door/stairs x-range + pad, anything in front of the building's middle)? */
function inDoorway(cc: CellCtx, pts: [number, number][], pad: number): boolean {
  for (const b of cc.near) {
    if (!b.door) continue;
    const zMid = (b.fp.box.z0 + b.fp.box.z1) / 2;
    for (const [x, z] of pts) {
      const l = toLocal(b, x, z);
      if (l.z > zMid && l.z < b.fp.box.z1 + 9 && l.x > b.door[0] - pad && l.x < b.door[1] + pad) return true;
    }
  }
  return false;
}

function otherProblem(cc: CellCtx, p: Placed, placed: Placed[]): string | null {
  const vc = cc.v, W = vc.env.world;
  const h0 = worldToHex(p.cx, p.cz);
  for (const [x, z] of [...corners(p), [p.cx, p.cz] as [number, number]]) {
    const h = worldToHex(x, z);
    if (h.q !== h0.q || h.r !== h0.r) return 'seam';
    const why = spotProblem(cc, x, z, p.solid);
    if (why) return why;
  }
  if (hitsBuilding(cc, p, 0.1)) return 'building';
  if (inDoorway(cc, samples(p), 0.5)) return 'door';
  for (const o of vc.items) if (!o.base && obbOverlap(p, o, 0.06)) return 'overlap';
  for (const o of placed) if (o !== p && !o.base && obbOverlap(p, o, 0.05)) return 'overlap';
  if (vc.spawn && Math.hypot(p.cx - vc.spawn.x, p.cz - vc.spawn.z) < 3.5) return 'spawn';
  let y0 = Infinity, y1 = -Infinity;
  for (const [x, z] of corners(p)) {
    const y = W.heightAt(x, z);
    y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if (y1 - y0 > 0.08) return 'slope';
  p.y = W.heightAt(p.x, p.z);
  return null;
}

/**
 * No wedge traps for the character: a solid prop stands flush against a wall (≤ 0.2 m) or leaves ≥ 1.2 m; two solid
 * props touch (≤ 0.25 m) or leave ≥ 0.8 m.
 */
function trapProblem(cc: CellCtx, items: Placed[]): string | null {
  const solids = items.filter((it) => it.solid && !it.base);
  for (const it of solids) {
    if (hitsBuilding(cc, it, 1.2) && !hitsBuilding(cc, it, 0.25)) return 'trap-wall';
    for (const o of [...cc.v.items, ...solids]) {
      if (o === it || !o.solid || o.base) continue;
      if (obbOverlap(it, o, 0.8) && !obbOverlap(it, o, 0.25)) return 'trap-prop';
    }
  }
  return null;
}

// ---------------------------------------------------------------- pockets (capsule traps)
const CAP_R = 0.3; // character capsule radius
/** Narrowest passage the character must always fit through: capsule diameter + 0.5 m → clearance ≥ 0.55 m. */
const PASS_CLEAR = (2 * CAP_R + 0.5) / 2;
const PG = 0.2;

function pointInBox(p: Placed, x: number, z: number, grow = 0): boolean {
  const c = Math.cos(p.rot), s = Math.sin(p.rot);
  const dx = x - p.cx, dz = z - p.cz;
  const lx = c * dx - s * dz, lz = s * dx + c * dz;
  return Math.abs(lx) <= p.hx + grow && Math.abs(lz) <= p.hz + grow;
}

/**
 * Configuration-space pocket test around `focus` (solid props): obstacles = building footprints, solid props, terrain
 * rising > 0.45 m; clearance = distance to the nearest obstacle (chamfer transform on a 0.2 m grid). Open space is
 * flood-filled from the region border through cells with clearance ≥ PASS_CLEAR. A pocket is a component of cells the
 * capsule fits into (clearance ≥ CAP_R + 0.02) that the open space does not reach, within 1.6 m of a focus prop.
 * Returns the number of pocket components (≥ 2 cells).
 */
export function pocketCount(env: PropEnv, near: Bld[], focus: Placed[], solids: Placed[]): number {
  if (!focus.length) return 0;
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const f of focus) for (const [x, z] of corners(f)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  const M = 3.2;
  x0 -= M; z0 -= M; x1 += M; z1 += M;
  const nx = Math.ceil((x1 - x0) / PG), nz = Math.ceil((z1 - z0) / PG);
  const W = env.world;
  const gy = W.heightAt(focus[0].x, focus[0].z);
  const blds = near.filter((b) => Math.hypot(b.x - (x0 + x1) / 2, b.z - (z0 + z1) / 2) < b.rad + Math.hypot(x1 - x0, z1 - z0) / 2);
  const sol = solids.filter((p) => !p.base && p.cx > x0 - 3 && p.cx < x1 + 3 && p.cz > z0 - 3 && p.cz < z1 + 3);
  const INF = 1e9;
  const D = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++)
    for (let i = 0; i < nx; i++) {
      const x = x0 + (i + 0.5) * PG, z = z0 + (j + 0.5) * PG;
      let ob = W.heightAt(x, z) > gy + 0.45;
      if (!ob) for (const p of sol) if (pointInBox(p, x, z)) { ob = true; break; }
      if (!ob) for (const b of blds) { const l = toLocal(b, x, z); if (fpHit(b.fp, l.x, l.z, 0)) { ob = true; break; } }
      D[j * nx + i] = ob ? 0 : INF;
    }
  // chamfer distance (metres)
  const a = PG, b2 = PG * Math.SQRT2;
  for (let j = 0; j < nz; j++)
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      let v = D[k];
      if (i > 0) v = Math.min(v, D[k - 1] + a);
      if (j > 0) {
        v = Math.min(v, D[k - nx] + a);
        if (i > 0) v = Math.min(v, D[k - nx - 1] + b2);
        if (i < nx - 1) v = Math.min(v, D[k - nx + 1] + b2);
      }
      D[k] = v;
    }
  for (let j = nz - 1; j >= 0; j--)
    for (let i = nx - 1; i >= 0; i--) {
      const k = j * nx + i;
      let v = D[k];
      if (i < nx - 1) v = Math.min(v, D[k + 1] + a);
      if (j < nz - 1) {
        v = Math.min(v, D[k + nx] + a);
        if (i < nx - 1) v = Math.min(v, D[k + nx + 1] + b2);
        if (i > 0) v = Math.min(v, D[k + nx - 1] + b2);
      }
      D[k] = v;
    }
  // the grid border is open space (obstacles beyond it unknown → treat as free)
  const reach = new Uint8Array(nx * nz);
  const st: number[] = [];
  for (let i = 0; i < nx; i++) st.push(i, (nz - 1) * nx + i);
  for (let j = 0; j < nz; j++) st.push(j * nx, j * nx + nx - 1);
  while (st.length) {
    const k = st.pop()!;
    if (reach[k] || D[k] < PASS_CLEAR) continue;
    reach[k] = 1;
    const i = k % nx, j = (k / nx) | 0;
    if (i > 0) st.push(k - 1);
    if (i < nx - 1) st.push(k + 1);
    if (j > 0) st.push(k - nx);
    if (j < nz - 1) st.push(k + nx);
  }
  // cells near reached open space are part of it (the capsule centre may stand there and step back out)
  const R2 = Math.ceil(PASS_CLEAR / PG);
  const open = new Uint8Array(nx * nz);
  for (let k = 0; k < nx * nz; k++) {
    if (!reach[k]) continue;
    const i = k % nx, j = (k / nx) | 0;
    for (let dj = -R2; dj <= R2; dj++)
      for (let di = -R2; di <= R2; di++) {
        const ii = i + di, jj = j + dj;
        if (ii >= 0 && jj >= 0 && ii < nx && jj < nz && di * di + dj * dj <= R2 * R2) open[jj * nx + ii] = 1;
      }
  }
  const seen = new Uint8Array(nx * nz);
  let count = 0;
  for (let k = 0; k < nx * nz; k++) {
    if (seen[k] || open[k] || D[k] < CAP_R + 0.02) continue;
    const comp: number[] = [];
    const q2 = [k];
    seen[k] = 1;
    while (q2.length) {
      const c = q2.pop()!;
      comp.push(c);
      const i = c % nx, j = (c / nx) | 0;
      for (const nk of [i > 0 ? c - 1 : -1, i < nx - 1 ? c + 1 : -1, j > 0 ? c - nx : -1, j < nz - 1 ? c + nx : -1]) {
        if (nk < 0 || seen[nk] || open[nk] || D[nk] < CAP_R + 0.02) continue;
        seen[nk] = 1;
        q2.push(nk);
      }
    }
    if (comp.length < 2) continue;
    const near1 = comp.some((c) => {
      const x = x0 + ((c % nx) + 0.5) * PG, z = z0 + (((c / nx) | 0) + 0.5) * PG;
      return focus.some((f) => pointInBox(f, x, z, 1.6));
    });
    if (near1) count++;
  }
  return count;
}

/** debug: why slots were rejected (counts) */
export const REASONS: Record<string, number> = {};
const reason = (w: string) => (REASONS[w] = (REASONS[w] ?? 0) + 1);

// ---------------------------------------------------------------- templates
interface TItem {
  id: string;
  /** along the wall (m) */
  a: number;
  /** away from the wall (m); the back row is 0 */
  o: number;
  /** yaw relative to the wall frame: 0 = item local +Z points away from the wall, local X along the wall */
  r?: number;
  /** yaw jitter (± rad); default ±0.3 (≈ 17°) for boxes */
  jr?: number;
  lie?: boolean;
  /** stacked on template item index (a/o are then offsets from that item's centre) */
  on?: number;
  /** extra height on the base (lying barrel pyramids) */
  dy?: number;
  /** probability (decided per instance) */
  p?: number;
}
type Tpl = TItem[];

const R90 = Math.PI / 2;
const B = (a: number, o = 0, p?: number): TItem => ({ id: 'barrel', a, o, jr: 3, p });
const T: Record<string, Tpl[]> = {
  // house door groups (2–4 pieces); every village uses its own seeded subset ("village style")
  door: [
    [B(0.45), B(1.4, 0.02), { id: 'bucket_water', a: 2.05, o: 0, jr: 3, p: 0.6 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_A_small', a: 0.03, o: -0.02, on: 0, jr: 0.6 }, { id: 'sack', a: 1.32, o: 0.02, r: R90, jr: 0.5 }],
    [B(0.45), { id: 'crate_B_big', a: 1.5, o: 0 }, { id: 'sack', a: 2.3, o: 0, jr: 0.8, p: 0.6 }],
    [{ id: 'crate_B_big', a: 0.5, o: 0 }, { id: 'sack', a: 0, o: 0, on: 0, r: R90, jr: 0.5 }, { id: 'sack', a: 1.25, o: 0, r: R90, jr: 0.4 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_B_small', a: 1.35, o: -0.1 }, B(2.15, 0, 0.6)],
    [{ id: 'crate_long_A', a: 0.95, o: 0, jr: 0.15 }, { id: 'sack', a: 0.3, o: 0, on: 0, r: R90, jr: 0.4, p: 0.7 }, B(2.3, 0, 0.5)],
    [B(0.45), { id: 'crate_A_small', a: 0, o: 0, on: 0, jr: 0.7 }, { id: 'sack', a: 1.15, o: 0, jr: 0.4 }, { id: 'sack', a: 1.7, o: 0.03, jr: 0.4, p: 0.5 }],
    [B(0.45), B(1.4, 0, 0.8), { id: 'crate_A_small', a: 0.02, o: 0, on: 1, jr: 0.7, p: 0.6 }],
    [{ id: 'crate_B_big', a: 0.5, o: 0 }, { id: 'crate_B_small', a: 1.3, o: -0.12 }, { id: 'bucket_empty', a: 1.95, o: 0, jr: 3 }],
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.85, o: 0.03 }, { id: 'sack', a: 0.28, o: 0, on: 0, r: R90, jr: 0.4 }, B(1.65, 0, 0.7)],
    [{ id: 'barrel', a: 0.5, o: 0.03, lie: true, jr: 0.1 }, B(1.45), { id: 'bucket_water', a: 2.15, o: 0, jr: 3, p: 0.5 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_A_big', a: 0.0, o: 0, on: 0, jr: 0.4, p: 0.4 }, B(1.5), { id: 'sack', a: 2.25, o: 0, p: 0.5 }],
    [{ id: 'crate_long_C', a: 0.95, o: 0, jr: 0.15 }, { id: 'crate_B_small', a: 2.25, o: 0 }, { id: 'sack', a: 2.85, o: 0, p: 0.5 }],
    [B(0.45), { id: 'bucket_water', a: 1.1, o: 0, jr: 3 }, { id: 'crate_A_small', a: 1.7, o: 0 }],
  ],
  // tavern: kegs, never twice the same
  tavern_front: [
    [B(0.45), B(1.4, 0.04), B(2.38, 0, 0.6), { id: 'crate_A_small', a: 0.95, o: 0.85, p: 0.5 }],
    [B(0.45), B(1.42, 0.03), { id: 'barrel', a: 0.93, o: 0.9, lie: true, r: R90, jr: 0.3, p: 0.7 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, B(1.5), { id: 'crate_A_small', a: 0, o: 0, on: 0, jr: 0.6, p: 0.6 }],
    [B(0.45), B(1.45, 0.1), { id: 'bucket_empty', a: 2.1, o: 0, jr: 3, p: 0.6 }],
  ],
  tavern_side: [
    // pyramid of lying barrels (+ a standing one)
    [{ id: 'barrel', a: 0.48, o: 0.05, lie: true, jr: 0.06 }, { id: 'barrel', a: 1.45, o: 0.05, lie: true, jr: 0.06 }, { id: 'barrel', a: 0.485, o: 0, lie: true, on: 0, dy: -0.14, jr: 0.03 }, B(2.45, 0, 0.6)],
    // two lying barrels side by side + crate
    [{ id: 'barrel', a: 0.48, o: 0.05, lie: true, jr: 0.08 }, { id: 'barrel', a: 1.45, o: 0.05, lie: true, jr: 0.08 }, { id: 'crate_B_big', a: 2.5, o: 0, p: 0.7 }],
    // a loose cluster of kegs
    [B(0.45), B(1.38, 0.15), B(0.9, 0.95, 0.7), { id: 'crate_B_small', a: 2.1, o: 0, p: 0.5 }],
    [{ id: 'crate_long_B', a: 0.95, o: 0, jr: 0.12 }, B(2.35, 0, 0.8)],
  ],
  // market: goods outside the stalls
  market: [
    [{ id: 'crate_long_A', a: 0.95, o: 0, jr: 0.12 }, { id: 'sack', a: -0.35, o: 0, on: 0, r: R90, jr: 0.4 }, { id: 'sack', a: 0.38, o: 0.02, on: 0, r: R90, jr: 0.4, p: 0.7 }, { id: 'crate_A_big', a: 2.42, o: 0, p: 0.8 }, { id: 'crate_A_small', a: 0, o: 0, on: 3, jr: 0.6, p: 0.5 }],
    [{ id: 'crate_long_B', a: 0.95, o: 0, jr: 0.12 }, { id: 'crate_long_C', a: 0.95, o: 0.98, jr: 0.15, p: 0.8 }, B(2.35, 0, 0.7)],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_B_big', a: 1.5, o: 0 }, { id: 'sack', a: 0, o: 0, on: 1, r: R90, jr: 0.5 }, { id: 'crate_A_small', a: 0, o: 0, on: 0, jr: 0.6, p: 0.6 }],
    [{ id: 'crate_long_C', a: 0.95, o: 0, jr: 0.12 }, { id: 'sack', a: 2.25, o: 0 }, { id: 'sack', a: 2.8, o: 0.03, p: 0.7 }],
    [{ id: 'crate_open', a: 0.85, o: 0 }, { id: 'sack', a: 1.95, o: 0 }, { id: 'sack', a: 2.48, o: 0.02, p: 0.6 }],
    [B(0.45), B(1.4), { id: 'crate_A_small', a: 0, o: 0, on: 0, jr: 0.6, p: 0.6 }, { id: 'sack', a: 2.1, o: 0 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'crate_B_small', a: -0.2, o: 0, on: 0 }, { id: 'sack', a: 0.3, o: 0, on: 0, jr: 0.3 }, { id: 'crate_open', a: 2.3, o: 0, p: 0.6 }],
  ],
  // blacksmith: ore / stone, crates of goods, water barrels, charcoal sacks
  smith: [
    [{ id: 'resource_stone', a: 1.0, o: 0, jr: 0.5 }, { id: 'crate_B_big', a: 2.4, o: 0 }, { id: 'crate_B_small', a: 0, o: 0, on: 1, jr: 0.6, p: 0.6 }],
    [{ id: 'crate_B_big', a: 0.5, o: 0 }, { id: 'crate_A_small', a: 0, o: 0, on: 0, jr: 0.6 }, B(1.5), B(2.45, 0.05, 0.7)],
    [B(0.45), B(1.4, 0.05), { id: 'crate_long_empty', a: 2.9, o: 0, jr: 0.12 }, { id: 'sack', a: 4.1, o: 0, p: 0.6 }],
    [{ id: 'crate_long_A', a: 0.95, o: 0, jr: 0.12 }, { id: 'sack', a: 0.2, o: 0, on: 0, r: R90, jr: 0.4 }, { id: 'resource_stone', a: 3.0, o: 0, jr: 0.5 }],
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.85, o: 0.03 }, { id: 'sack', a: 0.28, o: 0, on: 0, r: R90 }, { id: 'crate_B_big', a: 1.75, o: 0 }],
  ],
  smith_stone: [
    [{ id: 'resource_stone', a: 1.0, o: 0, jr: 0.5 }, { id: 'crate_A_small', a: 2.4, o: 0 }, B(3.15, 0, 0.6)],
    [{ id: 'resource_stone', a: 1.0, o: 0, jr: 0.5 }, B(2.4), { id: 'sack', a: 3.1, o: 0, p: 0.6 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_B_small', a: 1.3, o: -0.1 }, { id: 'resource_stone', a: 2.75, o: 0, jr: 0.5 }],
  ],
  // lumbermill: lumber only
  lumber: [
    [{ id: 'resource_lumber', a: 1.6, o: 0, jr: 0.06 }, { id: 'resource_lumber', a: 0.05, o: 0, on: 0, jr: 0.1, p: 0.5 }],
    [{ id: 'resource_lumber', a: 1.6, o: 0, jr: 0.06 }, { id: 'resource_lumber', a: 1.6, o: 1.6, jr: 0.12 }],
    [{ id: 'resource_lumber', a: 1.6, o: 0, jr: 0.06 }],
  ],
  lumber_cart: [
    [{ id: 'wheelbarrow', a: 1.2, o: 0.1, r: R90, jr: 0.35 }, { id: 'resource_lumber', a: 4.0, o: 0, jr: 0.1, p: 0.6 }],
    [{ id: 'resource_lumber', a: 1.6, o: 0, jr: 0.1 }, { id: 'wheelbarrow', a: 4.6, o: 0.2, r: R90 + 0.4, jr: 0.4, p: 0.6 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'resource_lumber', a: 2.9, o: 0, jr: 0.1 }],
  ],
  // windmill door: flour sacks
  mill_door: [
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.85, o: 0.03 }, { id: 'sack', a: 0.27, o: 0, on: 0, r: R90, jr: 0.4 }, { id: 'crate_B_small', a: 1.55, o: 0, p: 0.5 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'sack', a: -0.26, o: 0, on: 0 }, { id: 'sack', a: 0.26, o: 0, on: 0 }],
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.82, o: 0.05 }, { id: 'sack', a: 1.34, o: 0.0, p: 0.7 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'sack', a: 0, o: 0, on: 0, r: R90, jr: 0.4 }, { id: 'sack', a: 1.25, o: 0 }],
  ],
  // field edge: harvest gear
  field: [
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'sack', a: -0.26, o: 0.02, on: 0 }, { id: 'sack', a: 0.26, o: -0.03, on: 0 }, { id: 'sack', a: 0.02, o: 0, on: 1, r: R90, jr: 0.4, p: 0.6 }, { id: 'wheelbarrow', a: 2.6, o: 0.3, r: R90, jr: 0.4, p: 0.5 }],
    [{ id: 'wheelbarrow', a: 1.2, o: 0.2, r: R90, jr: 0.4 }, { id: 'sack', a: 2.7, o: 0.1, jr: 0.4, p: 0.7 }],
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.82, o: 0.04 }, { id: 'bucket_empty', a: 1.45, o: 0, jr: 3, p: 0.6 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'crate_B_small', a: -0.2, o: 0, on: 0 }, { id: 'sack', a: 0.3, o: 0, on: 0 }],
    [{ id: 'wheelbarrow', a: 1.2, o: 0.2, r: -R90, jr: 0.4 }, { id: 'pallet', a: 3.0, o: 0, p: 0.6 }],
  ],
  // plaza rim: a water barrel, a trough, crates (the paved middle stays walkable)
  rim: [
    [B(0.45), B(1.4, 0.05, 0.7), { id: 'bucket_water', a: 2.05, o: 0, jr: 3, p: 0.6 }],
    [{ id: 'crate_long_empty', a: 0.95, o: 0, jr: 0.08 }, { id: 'bucket_water', a: 2.2, o: 0, jr: 3 }],
    [{ id: 'crate_A_big', a: 0.5, o: 0 }, { id: 'crate_B_small', a: 0, o: 0, on: 0, jr: 0.6, p: 0.6 }, B(1.5)],
    [B(0.45), { id: 'sack', a: 1.15, o: 0 }, { id: 'sack', a: 1.7, o: 0.03, p: 0.6 }],
  ],
  // beside a field gate (on the street verge, the opening stays free)
  gate: [
    [{ id: 'sack', a: 0.3, o: 0 }, { id: 'sack', a: 0.85, o: 0.03 }, { id: 'sack', a: 0.28, o: 0, on: 0, r: R90 }, { id: 'wheelbarrow', a: 2.6, o: 0.1, r: R90, jr: 0.4, p: 0.6 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'sack', a: -0.26, o: 0, on: 0 }, { id: 'sack', a: 0.26, o: 0, on: 0 }, B(2.0, 0, 0.6)],
    [{ id: 'wheelbarrow', a: 1.2, o: 0.1, r: R90, jr: 0.4 }, { id: 'sack', a: 2.7, o: 0 }, { id: 'bucket_empty', a: 3.3, o: 0, jr: 3, p: 0.6 }],
    [B(0.45), { id: 'crate_B_big', a: 1.45, o: 0 }, { id: 'sack', a: 2.25, o: 0, p: 0.7 }],
  ],
  // inside a fenced pasture: a feeding trough, water, feed sacks — the fence encloses a working paddock
  paddock: [
    [{ id: 'crate_long_empty', a: 0.95, o: 0, jr: 0.15 }, { id: 'bucket_water', a: 2.2, o: 0, jr: 3 }, { id: 'bucket_empty', a: 2.75, o: 0.1, jr: 3, p: 0.5 }],
    [{ id: 'pallet', a: 0.75, o: 0 }, { id: 'sack', a: -0.26, o: 0, on: 0 }, { id: 'sack', a: 0.26, o: 0, on: 0 }, { id: 'sack', a: 0, o: 0, on: 1, r: R90, p: 0.6 }, B(2.0, 0, 0.7)],
    [{ id: 'crate_long_empty', a: 0.95, o: 0, jr: 0.15 }, { id: 'crate_long_empty', a: 0.95, o: 1.1, jr: 0.2, p: 0.5 }, B(2.4)],
    [B(0.45), { id: 'bucket_water', a: 1.1, o: 0, jr: 3 }, { id: 'crate_long_empty', a: 2.4, o: 0, jr: 0.2 }],
  ],
  // the farm's road-side stand (churn barrels, goods for the market cart)
  farmroad: [
    [B(0.45), B(1.4, 0.05), { id: 'crate_A_small', a: 0.02, o: 0, on: 0, jr: 0.6, p: 0.6 }],
    [{ id: 'wheelbarrow', a: 1.2, o: 0.1, r: R90, jr: 0.4 }, { id: 'sack', a: 2.65, o: 0 }, { id: 'sack', a: 3.2, o: 0.03, p: 0.6 }],
    [{ id: 'crate_B_big', a: 0.5, o: 0 }, { id: 'crate_A_big', a: 1.5, o: 0 }, { id: 'sack', a: 0, o: 0, on: 1, jr: 0.5 }, B(2.45, 0, 0.6)],
    [{ id: 'crate_long_A', a: 0.95, o: 0, jr: 0.15 }, B(2.35), { id: 'bucket_water', a: 3.0, o: 0, jr: 3, p: 0.5 }],
  ],
  // well: buckets (the plaza stays free of solid props)
  well: [
    [{ id: 'bucket_water', a: 0, o: 0, jr: 3 }, { id: 'bucket_empty', a: 0.55, o: 0.06, jr: 3 }],
    [{ id: 'bucket_water', a: 0, o: 0, jr: 3 }, { id: 'bucket_water', a: 0.52, o: 0.1, jr: 3 }, { id: 'sack', a: 1.2, o: 0, p: 0.5 }],
    [{ id: 'bucket_empty', a: 0, o: 0, jr: 3 }, { id: 'sack', a: 0.65, o: 0 }],
    [{ id: 'bucket_water', a: 0, o: 0, jr: 3 }],
    [{ id: 'bucket_empty', a: 0, o: 0, jr: 3 }, { id: 'bucket_water', a: 0.5, o: 0.12, jr: 3 }, { id: 'bucket_empty', a: 1.0, o: 0, jr: 3, p: 0.5 }],
  ],
};

interface Slot {
  /** building-local origin, normal (away from the wall), tangent */
  ox: number; oz: number;
  nx: number; nz: number;
  tx: number; tz: number;
  maxPush: number;
  /** not wall-bound: keep moving until everything holds (field edges) */
  free?: boolean;
}

/** Apply a template at a slot (outside-in onto the wall), with seeded per-instance jitter; validate. */
function tryTemplate(cc: CellCtx, pose: { x: number; z: number; c: number; s: number; rot: number; fp?: Footprint }, slot: Slot, tpl: Tpl, rnd: () => number, extra?: (items: Placed[]) => boolean): Placed[] | null {
  // wall slots lean on their OWN building (a neighbour's wall is an obstacle, never the anchor)
  const own = pose.fp ? (pose as Bld) : null;
  const env = cc.v.env;
  const yawN = Math.atan2(slot.nx, slot.nz);
  const jr = tpl.map((t) => (t.jr ?? (t.on !== undefined ? 0.5 : 0.3)) * (rnd() * 2 - 1));
  const ja = tpl.map((t) => (t.on !== undefined ? 0.04 : 0.14) * (rnd() * 2 - 1));
  const jo = tpl.map((t) => (t.on !== undefined ? 0.04 : t.o > 0.3 ? 0.15 : 0.03) * rnd());
  /** extra offset per item: real bounds, ≥ 5 cm apart (computed once; the layout is rigid) */
  const shift = tpl.map(() => 0);
  const layout = (push: number, withShift: boolean): Placed[] | null => {
    const items: Placed[] = [];
    for (let i = 0; i < tpl.length; i++) {
      const t = tpl[i];
      let lx: number, lz: number;
      if (t.on !== undefined) {
        const base = items[t.on];
        if (!base) return null;
        const bl = toLocal(pose, base.x, base.z);
        lx = bl.x + slot.tx * (t.a + ja[i]) + slot.nx * (t.o + jo[i]);
        lz = bl.z + slot.tz * (t.a + ja[i]) + slot.nz * (t.o + jo[i]);
      } else {
        // back-row items slide along the wall, front-row items (o > 0.3) slide away from it
        const front = t.o > 0.3;
        const a = t.a + ja[i] + (withShift && !front ? shift[i] : 0);
        const o = t.o + jo[i] + (withShift && front ? shift[i] : 0);
        lx = slot.ox + slot.tx * a + slot.nx * (o + push);
        lz = slot.oz + slot.tz * a + slot.nz * (o + push);
      }
      const w = toWorld(pose, lx, lz);
      const it = makeItem(env, t.id, w.x, w.z, pose.rot + yawN + (t.r ?? 0) + jr[i], !!t.lie);
      if (!it) return null;
      if (t.on !== undefined) {
        it.base = items[t.on];
        it.y = t.dy ?? 0; // relative until resolved
      }
      items.push(it);
    }
    return items;
  };
  // auto-spacing with real (rotated) bounds
  if (!layout(0, false)) return null;
  for (let i = 0; i < tpl.length; i++) {
    if (tpl[i].on !== undefined) continue;
    for (let k = 0; k < 40; k++) {
      const items = layout(0, true)!;
      const me = items[i];
      if (!items.some((o, j) => j < i && !o.base && obbOverlap(me, o, 0.05))) break;
      shift[i] += 0.05;
    }
  }
  const blocked = (items: Placed[], step = 0.15) => items.some((it) => hitsBuilding(cc, it, 0.15, step, own));
  const finish = (items: Placed[]): Placed[] | null => {
    let why: string | null = null;
    for (const it of items) if (!it.base && (why = otherProblem(cc, it, items))) break;
    if (!why && items.some((it) => it.base && hitsBuilding(cc, it, 0.1))) why = 'building';
    why ??= trapProblem(cc, items);
    if (!why) {
      const f = items.filter((it) => it.solid && !it.base);
      if (f.length && pocketCount(cc.v.env, cc.near, f, [...cc.v.items, ...items].filter((it) => it.solid && !it.base))) why = 'pocket';
    }
    if (why) {
      reason(why);
      return null;
    }
    for (const it of items) if (it.base) it.y = it.base.y + it.base.h + it.y;
    if (extra && !extra(items)) return null;
    return items;
  };
  if (slot.free) {
    for (let push = 0; push <= slot.maxPush; push += 0.08) {
      const items = layout(push, true);
      if (!items || items.some((it) => hitsBuilding(cc, it, 0.15))) continue;
      if (items.some((it) => !it.base && otherProblem(cc, it, items))) continue;
      const res = finish(items);
      if (res) return res;
    }
    return null;
  }
  // wall slots: come in from OUTSIDE until the group first touches the building → flush against the outer wall
  let last: Placed[] | null = null;
  let hit = -1;
  for (let push = slot.maxPush; push >= 0; push -= 0.3) {
    const items = layout(push, true);
    if (!items) return null;
    // coarse pass with a coarse sampling + 0.15 m extra reach (never misses a wall the fine pass would find)
    if (items.some((it) => hitsBuilding(cc, it, 0.3, 0.3, own))) { hit = push; break; }
    last = items;
  }
  if (hit < 0 || !last) return null;
  for (let push = Math.min(slot.maxPush, hit + 0.3) - 0.05; push > hit - 0.6 && push >= 0; push -= 0.05) {
    const items = layout(push, true)!;
    if (blocked(items)) break;
    last = items;
  }
  return finish(last);
}

/** Template with its probabilistic items resolved (stacked items vanish with their base). */
function resolve(tpl: Tpl, rnd: () => number): Tpl {
  const keep: boolean[] = [];
  const idx: number[] = [];
  const out: Tpl = [];
  tpl.forEach((t, i) => {
    let k = t.p === undefined || rnd() < t.p;
    if (t.on !== undefined && !keep[t.on]) k = false;
    keep[i] = k;
    if (k) {
      idx[i] = out.length;
      out.push(t.on !== undefined ? { ...t, on: idx[t.on] } : t);
    }
  });
  return out;
}

/** Same template without its last free-standing item (fallback for tight yards). */
function shrink(tpl: Tpl, min = 1): Tpl | null {
  const free = tpl.map((t, i) => (t.on === undefined ? i : -1)).filter((i) => i >= 0);
  if (free.length <= min || tpl.length <= min) return null;
  const drop = free[free.length - 1];
  const out: Tpl = [];
  const idx: number[] = [];
  tpl.forEach((t, i) => {
    if (i === drop || t.on === drop) return;
    idx[i] = out.length;
    out.push(t.on !== undefined ? { ...t, on: idx[t.on] } : t);
  });
  return out;
}

// ---------------------------------------------------------------- slots of a building
function frontSlots(b: Bld): Slot[] {
  if (!b.door) return [];
  const reach = b.fp.box.z1 + 3;
  return [
    { ox: b.door[0] - 0.55, oz: 0, nx: 0, nz: 1, tx: -1, tz: 0, maxPush: reach },
    { ox: b.door[1] + 0.55, oz: 0, nx: 0, nz: 1, tx: 1, tz: 0, maxPush: reach },
  ];
}
/** Side walls starting at the front corner, running back. */
function sideSlots(b: Bld): Slot[] {
  const f = b.fp.box;
  const z = f.z1 - 0.15;
  return [
    { ox: 0, oz: z, nx: -1, nz: 0, tx: 0, tz: -1, maxPush: -f.x0 + 3 },
    { ox: 0, oz: z, nx: 1, nz: 0, tx: 0, tz: -1, maxPush: f.x1 + 3 },
  ];
}
/** Side walls starting at the back corner, running forward. */
function sideBackSlots(b: Bld): Slot[] {
  const f = b.fp.box;
  const z = f.z0 + 0.15;
  return [
    { ox: 0, oz: z, nx: -1, nz: 0, tx: 0, tz: 1, maxPush: -f.x0 + 3 },
    { ox: 0, oz: z, nx: 1, nz: 0, tx: 0, tz: 1, maxPush: f.x1 + 3 },
  ];
}
function backSlots(b: Bld): Slot[] {
  const f = b.fp.box;
  return [
    { ox: f.x1 - 0.15, oz: 0, nx: 0, nz: -1, tx: -1, tz: 0, maxPush: -f.z0 + 3 },
    { ox: f.x0 + 0.15, oz: 0, nx: 0, nz: -1, tx: 1, tz: 0, maxPush: -f.z0 + 3 },
  ];
}
/** Slot facing a world direction (e.g. toward a field), group centred on the building axis. */
function towardSlot(b: Bld, wx: number, wz: number, span: number): Slot {
  const l = { x: b.c * wx - b.s * wz, z: b.s * wx + b.c * wz };
  const n = Math.hypot(l.x, l.z) || 1;
  const nx = l.x / n, nz = l.z / n;
  const tx = -nz, tz = nx;
  return { ox: -tx * span / 2, oz: -tz * span / 2, nx, nz, tx, tz, maxPush: 9 };
}
/** Free slot at the hex edge d of the cell (e.g. shared with a field): starts at the edge, moves inward. */
function edgeSlot(b: Bld, cc: CellCtx, d: number, span: number, shift: number): Slot {
  const e = EV[d];
  const tw = { x: -e.z, z: e.x };
  const w0 = { x: cc.cx + e.x * (INNER - 1.1) + tw.x * (shift - span / 2), z: cc.cz + e.z * (INNER - 1.1) + tw.z * (shift - span / 2) };
  const o = toLocal(b, w0.x, w0.z);
  const n = { x: b.c * -e.x - b.s * -e.z, z: b.s * -e.x + b.c * -e.z };
  const t = { x: b.c * tw.x - b.s * tw.z, z: b.s * tw.x + b.c * tw.z };
  return { ox: o.x, oz: o.z, nx: n.x, nz: n.z, tx: t.x, tz: t.z, maxPush: 4, free: true };
}

// ---------------------------------------------------------------- the village planner
const RANDS = (h: number) => {
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function villageCtx(env: PropEnv, v: VillageInfo): VCtx {
  const vcells = new Set(v.cells.map((c) => key(c.q, c.r)));
  const streets = new Set<string>();
  for (const s of v.streets) {
    if (DIRS.some(([dq, dr]) => vcells.has(key(s.q + dq, s.r + dr)))) streets.add(key(s.q, s.r));
  }
  if (v.kind === 'rural') streets.add(key(v.centre.q, v.centre.r));
  const vv = v as VillageInfo & { plaza?: { q: number; r: number } | null; spawn?: { world: { x: number; z: number } } | null };
  return {
    env, vcells, streets,
    plaza: vv.plaza ? { q: vv.plaza.q, r: vv.plaza.r } : null,
    spawn: vv.spawn ? { x: vv.spawn.world.x, z: vv.spawn.world.z } : null,
    items: [],
  };
}

/** Plan a village in one go (drains `planVillageSteps`). */
export function planVillage(env: PropEnv, v: VillageInfo): VillageProps {
  const t0 = performance.now();
  const g = planVillageSteps(env, v);
  let r = g.next();
  while (!r.done) r = g.next();
  r.value.ms = performance.now() - t0;
  return r.value;
}

/**
 * Resumable village planner: yields after every building / field / phase so a caller can spread one village over
 * several frames. The sequence of placements (hence the output) is identical however it is driven.
 */
export function* planVillageSteps(env: PropEnv, v: VillageInfo): Generator<void, VillageProps, void> {
  const S = hash(env.seed, 0x50524f50); // 'PROP'
  const vc = villageCtx(env, v);
  const cells = new Map<string, CellCtx>();
  const ctxOf = (q: number, r: number): CellCtx => {
    const k = key(q, r);
    let cc = cells.get(k);
    if (!cc) cells.set(k, (cc = cellCtx(vc, q, r)));
    return cc;
  };
  const vignettes: Vignette[] = [];
  const counts: Record<string, number> = {};

  const commit = (kind: Kind, cc: CellCtx, items: Placed[], outX: number, outZ: number) => {
    vc.items.push(...items);
    let fx = 0, fz = 0, fy = 0;
    for (const it of items) { fx += it.x / items.length; fz += it.z / items.length; fy += it.y / items.length; }
    vignettes.push({ kind, q: cc.q, r: cc.r, items, focus: { x: fx, y: fy, z: fz }, out: { x: outX, z: outZ } });
    counts[kind] = (counts[kind] ?? 0) + 1;
    counts.props = (counts.props ?? 0) + items.length;
  };
  const outDir = (b: Bld, s: Slot) => ({ x: b.c * s.nx + b.s * s.nz, z: -b.s * s.nx + b.c * s.nz });

  /** Try templates (seeded order) × slots; commit the first that fits. */
  const place = function* (kind: Kind, cc: CellCtx, b: Bld, tpls: Tpl[], slots: Slot[], salt: number, extra?: (items: Placed[]) => boolean, minItems = 1): Generator<void, boolean, void> {
    if (!slots.length) return false;
    const bs = Math.round(b.x * 10) ^ Math.round(b.z * 10);
    const rnd = RANDS(hash(S, cc.q, cc.r, salt, bs));
    const order = shuffle(tpls.map((_, i) => i), rnd);
    for (const ti of order) {
      let tpl: Tpl | null = resolve(tpls[ti], rnd);
      while (tpl && tpl.length) {
        for (const s of slots) {
          const items = tryTemplate(cc, b, s, tpl, RANDS(hash(S, cc.q, cc.r, salt, ti, bs, s.ox * 10 | 0, s.nx * 10 | 0, s.nz * 10 | 0)), extra);
          yield;
          if (items) {
            const o = outDir(b, s);
            commit(kind, cc, items, o.x, o.z);
            return true;
          }
        }
        tpl = shrink(tpl, minItems);
      }
    }
    return false;
  };
  /** Free-standing group with a synthetic pose (plaza rim, field gate). */
  const placeFree = function* (kind: Kind, cc: CellCtx, tpls: Tpl[], slots: Slot[], salt: number): Generator<void, boolean, void> {
    const pose = { x: cc.cx, z: cc.cz, c: 1, s: 0, rot: 0 };
    const rnd = RANDS(hash(S, cc.q, cc.r, salt));
    for (const ti of shuffle(tpls.map((_, i) => i), rnd)) {
      let tpl: Tpl | null = resolve(tpls[ti], rnd);
      while (tpl && tpl.length) {
        for (const sl of slots) {
          const items = tryTemplate(cc, pose, sl, tpl, RANDS(hash(S, cc.q, cc.r, salt, ti, sl.ox * 10 | 0, sl.oz * 10 | 0)));
          yield;
          if (items) {
            commit(kind, cc, items, sl.nx, sl.nz);
            return true;
          }
        }
        tpl = shrink(tpl, 2);
      }
    }
    return false;
  };
  /** Free slot in world terms for a synthetic identity pose centred on cc. */
  const freeSlot = (cc: CellCtx, ox: number, oz: number, n: { x: number; z: number }, t: { x: number; z: number }, maxPush = 1.6): Slot =>
    ({ ox: ox - cc.cx, oz: oz - cc.cz, nx: n.x, nz: n.z, tx: t.x, tz: t.z, maxPush, free: true });

  /** every building of the village: [cell ctx, building] (cells in plan order → deterministic) */
  const all: [CellCtx, Bld][] = [];
  for (const c of v.cells) for (const b of env.buildings(c.q, c.r)) all.push([ctxOf(c.q, c.r), b]);
  const byType = (...t: string[]) => all.filter(([, b]) => t.includes(b.type));
  const vr = (k: number) => rand01(S, v.centre.q, v.centre.r, k);
  const R = (b: Bld, k: number) => RANDS(hash(S, b.q, b.r, k, Math.round(b.x * 10)));

  // --- well: buckets at its foot
  for (const [cc, b] of byType('well')) {
    yield;
    const rnd = R(b, 11);
    const angs = shuffle([70, 110, 250, 290, 150, 210, 30, 330].map((a) => (a * Math.PI) / 180), rnd);
    const radial: Slot[] = angs.map((a) => ({ ox: 0, oz: 0, nx: Math.sin(a), nz: Math.cos(a), tx: Math.cos(a), tz: -Math.sin(a), maxPush: 4 }));
    yield* place('well', cc, b, T.well, radial, 12);
    // plaza rim: 1–2 groups along rim edges whose neighbour is not a road (the lane / streets stay open)
    const rims: Slot[] = [];
    for (const d of shuffle([0, 1, 2, 3, 4, 5], rnd)) {
      const n = env.world.cell(cc.q + DIRS[d][0], cc.r + DIRS[d][1]);
      if (n.roadMask) continue;
      const e = EV[d], t = { x: -e.z, z: e.x };
      const sg = rnd() < 0.5 ? 1 : -1;
      const tt = { x: t.x * sg, z: t.z * sg };
      rims.push(freeSlot(cc, cc.cx + e.x * (INNER - 0.95) - tt.x * 1.5, cc.cz + e.z * (INNER - 0.95) - tt.z * 1.5, { x: -e.x, z: -e.z }, tt, 0.9));
    }
    const nRim = 1 + (rnd() < 0.5 ? 1 : 0);
    let rimDone = 0;
    for (let i = 0; i < rims.length && rimDone < nRim; i++) if (yield* placeFree('well', cc, T.rim, [rims[i]], 15 + i)) rimDone++;
  }

  // --- work buildings
  for (const [cc, b] of byType('tavern')) {
    yield;
    yield* place('tavern', cc, b, T.tavern_front, shuffle(frontSlots(b), R(b, 21)), 22);
    yield* place('tavern', cc, b, T.tavern_side, [...shuffle(sideSlots(b), R(b, 23)), ...sideBackSlots(b)], 24);
  }
  for (const [cc, b] of byType('market')) {
    yield;
    const fr = shuffle(frontSlots(b), R(b, 31));
    const sides = shuffle([...sideSlots(b), ...sideBackSlots(b)], R(b, 35));
    yield* place('market', cc, b, T.market, [...fr, ...sides], 32);
    yield* place('market', cc, b, T.market, [...fr.slice().reverse(), ...sides], 33);
    yield* place('market', cc, b, T.market, [...sides, ...backSlots(b)], 34);
  }
  for (const [cc, b] of byType('blacksmith')) {
    yield;
    const sides = shuffle([...sideSlots(b), ...sideBackSlots(b)], R(b, 41));
    yield* place('smith', cc, b, T.smith, sides, 42);
    yield* place('smith', cc, b, T.smith_stone, [...sides.slice().reverse(), ...backSlots(b)], 43);
  }
  for (const [cc, b] of byType('lumbermill')) {
    yield;
    const sides = shuffle(sideSlots(b), R(b, 51));
    yield* place('lumber', cc, b, T.lumber, [...sides, ...sideBackSlots(b)], 52);
    yield* place('lumber', cc, b, T.lumber_cart, [...frontSlots(b), ...sides.slice().reverse(), ...backSlots(b)], 53);
  }

  // --- fields: clusters of field cells
  const fieldSet = new Set(v.fields.map((f) => key(f.q, f.r)));
  const clusters: { q: number; r: number }[][] = [];
  {
    const seen = new Set<string>();
    for (const f of v.fields) {
      const k0 = key(f.q, f.r);
      if (seen.has(k0)) continue;
      const cl: { q: number; r: number }[] = [];
      const st = [f];
      seen.add(k0);
      while (st.length) {
        const c = st.pop()!;
        cl.push(c);
        for (const [dq, dr] of DIRS) {
          const k = key(c.q + dq, c.r + dr);
          if (fieldSet.has(k) && !seen.has(k)) { seen.add(k); st.push({ q: c.q + dq, r: c.r + dr }); }
        }
      }
      clusters.push(cl);
    }
  }
  const served = new Set<number>();
  const nearEdge = (cc: CellCtx, d: number) => (items: Placed[]) =>
    items.every((it) => (it.x - cc.cx) * EV[d].x + (it.z - cc.cz) * EV[d].z > INNER - 3.8);
  const fieldVignette = function* (kind: Kind, cc: CellCtx, b: Bld, salt: number): Generator<void, boolean, void> {
    for (let d = 0; d < 6; d++) {
      const nq = cc.q + DIRS[d][0], nr = cc.r + DIRS[d][1];
      const k = key(nq, nr);
      if (!fieldSet.has(k)) continue;
      if (env.world.cell(nq, nr).level !== cc.level) continue;
      const ci = clusters.findIndex((cl) => cl.some((f) => key(f.q, f.r) === k));
      if (served.has(ci)) continue;
      const e = EV[d];
      if (yield* place(kind, cc, b, T.field, [edgeSlot(b, cc, d, 3.2, 0), edgeSlot(b, cc, d, 3.2, -1.6), edgeSlot(b, cc, d, 3.2, 1.6), towardSlot(b, e.x, e.z, 2.6)], salt + d, nearEdge(cc, d))) {
        served.add(ci);
        return true;
      }
    }
    return false;
  };
  for (const [cc, b] of byType('windmill')) {
    yield;
    yield* place('mill', cc, b, T.mill_door, [...shuffle(frontSlots(b), R(b, 71)), ...sideSlots(b)], 72);
    yield* fieldVignette('mill', cc, b, 73);
  }
  for (let ci = 0; ci < clusters.length; ci++) {
    yield;
    if (served.has(ci)) continue;
    const cand: [CellCtx, Bld][] = [];
    for (const f of clusters[ci])
      for (const [dq, dr] of DIRS) {
        const q = f.q + dq, r = f.r + dr, k = key(q, r);
        if (fieldSet.has(k) || !vc.vcells.has(k)) continue;
        for (const b of env.buildings(q, r)) if (b.type !== 'well' && !cand.some(([, x]) => x === b)) cand.push([ctxOf(q, r), b]);
      }
    shuffle(cand, RANDS(hash(S, ci, clusters[ci][0].q, clusters[ci][0].r, 81)));
    for (const [cc, b] of cand) if (yield* fieldVignette('field', cc, b, 82)) break;
  }

  // --- field gates: harvest gear on the street verge beside the gate (the opening stays free)
  for (const f of v.fields) {
    yield;
    const fc = env.world.cell(f.q, f.r);
    for (const tg of fc.tags) {
      if (!tg.startsWith('gate:')) continue;
      const d = Number(tg.slice(5));
      const oq = f.q + DIRS[d][0], or = f.r + DIRS[d][1];
      if (!vc.streets.has(key(oq, or)) && !vc.vcells.has(key(oq, or))) continue;
      const cc = ctxOf(oq, or);
      const fw = hexToWorld(f.q, f.r), e = EV[d], t = { x: -e.z, z: e.x };
      const mx = fw.x + e.x * INNER, mz = fw.z + e.z * INNER;
      const rnd = RANDS(hash(S, f.q, f.r, 85));
      const slots: Slot[] = [];
      for (const sg of rnd() < 0.5 ? [1, -1] : [-1, 1]) {
        const tt = { x: t.x * sg, z: t.z * sg };
        slots.push(freeSlot(cc, mx + e.x * 1.1 + tt.x * 1.5, mz + e.z * 1.1 + tt.z * 1.5, e, tt));
      }
      yield* placeFree('field', cc, T.gate, slots, 86);
    }
  }

  // --- pastures: a working paddock inside every fenced pasture (trough, water, feed), so the fence encloses something
  if (env.roadside) {
    const done = new Set<string>();
    for (const f of v.fields) {
      yield;
      const fc = env.world.cell(f.q, f.r);
      if (!fc.tags.includes('crop:pasture')) continue;
      // one paddock group per pasture cluster cell pair: skip cells next to a pasture cell that already got one
      if (DIRS.some(([dq, dr]) => done.has(key(f.q + dq, f.r + dr)))) continue;
      const cc = ctxOf(f.q, f.r);
      const rnd = RANDS(hash(S, f.q, f.r, 120));
      const slots: Slot[] = [];
      for (let k = 0; k < 4; k++) {
        const a = rnd() * Math.PI * 2;
        const n = { x: Math.cos(a), z: Math.sin(a) };
        const t = { x: -n.z, z: n.x };
        slots.push(freeSlot(cc, cc.cx - n.x * 1.6 - t.x * 1.4, cc.cz - n.z * 1.6 - t.z * 1.4, n, t, 3.0));
      }
      if (yield* placeFree('paddock', cc, T.paddock, slots, 121)) done.add(key(f.q, f.r));
    }
  }

  // --- farmsteads: a road-side stand on the verge of the farm's road cell, toward the farm (≈ 70 % of farms)
  if (env.roadside && v.kind === 'rural' && vr(130) < 0.7) {
    yield;
    const cc = ctxOf(v.centre.q, v.centre.r);
    const rnd = RANDS(hash(S, v.centre.q, v.centre.r, 131));
    const toward: number[] = [];
    for (let d = 0; d < 6; d++) if (vc.vcells.has(key(v.centre.q + DIRS[d][0], v.centre.r + DIRS[d][1]))) toward.push(d);
    const slots: Slot[] = [];
    for (const d of shuffle(toward, rnd)) {
      const e = EV[d], t = { x: -e.z, z: e.x };
      for (const lat of [1.6, -1.6, 3.2, -3.2]) {
        const sgn = lat < 0 ? -1 : 1;
        const tt = { x: t.x * sgn, z: t.z * sgn };
        slots.push(freeSlot(cc, cc.cx + e.x * 3.3 + t.x * lat - tt.x * 1.5, cc.cz + e.z * 3.3 + t.z * lat - tt.z * 1.5, e, tt, 3.0));
      }
    }
    if (slots.length) yield* placeFree('farm', cc, T.farmroad, slots, 132);
  }

  // --- houses: ~75–85 % get a group beside the door / stairs (small or medium, seeded), else at the front corner
  const homes = shuffle(byType('home_A', 'home_B'), RANDS(hash(S, v.centre.q, v.centre.r, 91)));
  const frac = 0.75 + 0.12 * vr(92);
  let want = Math.max(homes.length >= 2 ? 1 : 0, Math.round(homes.length * frac));
  counts.homes = homes.length;
  // village style: each village dresses its doors from its own seeded subset of the door groups
  const style = shuffle(T.door.map((_, i) => i), RANDS(hash(S, v.centre.q, v.centre.r, 97))).slice(0, 6).map((i) => T.door[i]);
  for (const [cc, b] of homes) {
    yield;
    if (want <= 0) break;
    const rnd = R(b, 93);
    // door side only: beside the jamb / stair cheek, never at the window-side corner
    const slots = shuffle(frontSlots(b), rnd);
    if ((yield* place('door', cc, b, style, slots, 94, undefined, 2)) || (yield* place('door', cc, b, T.door, slots, 95, undefined, 2))) want--;
  }

  // --- village-entry flags in the village colour
  yield;
  if (v.kind === 'village') placeFlags(env, v, S, vc, ctxOf, commit);
  yield;

  const byCell = new Map<string, Placed[]>();
  for (const vg of vignettes) {
    for (const it of vg.items) {
      let root = it;
      while (root.base) root = root.base;
      const h = worldToHex(root.cx, root.cz);
      const k = key(h.q, h.r);
      let l = byCell.get(k);
      if (!l) byCell.set(k, (l = []));
      l.push(it);
    }
  }
  return { id: v.id, vignettes, byCell, counts, ms: 0 };
}

/**
 * Village-entry flags: on the grass verge of the last street cell, where the village road leaves the village (next to
 * the last buildings), at the road edge (ROAD_CLEAR from the strip centreline) — a flag planted in a barrel with a
 * seeded companion lined up along the road: hand cart, crate stack, barrels, sacks, or a second flag across the road
 * (a gate). No companion fits → no flag.
 */
function placeFlags(env: PropEnv, v: VillageInfo, S: number, vc: VCtx, ctxOf: (q: number, r: number) => CellCtx,
  commit: (kind: Kind, cc: CellCtx, items: Placed[], ox: number, oz: number) => void): void {
  const flagId = 'flag_' + v.color;
  const rnd = RANDS(hash(S, v.centre.q, v.centre.r, 101));
  const flagAt = (cc: CellCtx, x: number, z: number, out: { x: number; z: number }, placed: Placed[]): Placed[] | null => {
    const base = makeItem(env, 'barrel', x, z, rnd() * Math.PI * 2, false);
    if (!base || hitsBuilding(cc, base, 0.4) || otherProblem(cc, base, placed)) return null;
    const f = makeItem(env, flagId, base.cx, base.cz, Math.atan2(-out.x, -out.z), false);
    if (!f || hitsBuilding(cc, f, 0.35)) return null;
    f.base = base;
    f.y = base.y + base.h * 0.55;
    return [base, f];
  };
  const exits: { q: number; r: number; d: number }[] = [];
  const streetAll = new Set(v.streets.map((s) => key(s.q, s.r)));
  for (const s of v.streets) {
    if (!vc.streets.has(key(s.q, s.r))) continue;
    const c = env.world.cell(s.q, s.r);
    if (c.slope || c.bridge) continue;
    for (let d = 0; d < 6; d++) {
      if (!(c.roadMask & (1 << d))) continue;
      const nq = s.q + DIRS[d][0], nr = s.r + DIRS[d][1];
      if (streetAll.has(key(nq, nr)) || (nq === v.centre.q && nr === v.centre.r)) continue;
      exits.push({ q: s.q, r: s.r, d });
    }
  }
  shuffle(exits, rnd);
  const maxEntry = 1 + (rnd() < 0.6 ? 1 : 0);
  let entry = 0;
  for (const ex of exits) {
    if (entry >= maxEntry) break;
    const cc = ctxOf(ex.q, ex.r);
    const out = EV[ex.d];
    const side0 = { x: -out.z, z: out.x };
    let done = false;
    for (const t of [0.72, 0.58, 0.86, 0.45]) {
      for (const sg of rnd() < 0.5 ? [1, -1] : [-1, 1]) {
        if (done) break;
        const off = ROAD_CLEAR + 0.75 + rnd() * 0.25;
        const x = cc.cx + out.x * INNER * t + side0.x * sg * off, z = cc.cz + out.z * INNER * t + side0.z * sg * off;
        const fl = flagAt(cc, x, z, out, []);
        if (!fl) continue;
        const base = fl[0];
        // companion, toward the village along the road edge
        const kinds = shuffle([0, 1, 2, 3, 4], rnd);
        for (const kind of kinds) {
          const comp: Placed[] = [];
          const at = (d: number, lat = 0) => ({ x: base.cx - out.x * d + side0.x * sg * lat, z: base.cz - out.z * d + side0.z * sg * lat });
          const yawR = Math.atan2(out.x, out.z);
          const mk = (id: string, p: { x: number; z: number }, yaw: number, lie = false) => {
            const it = makeItem(env, id, p.x, p.z, yaw, lie);
            if (it) comp.push(it);
            return it;
          };
          if (kind === 0) mk('wheelbarrow', at(1.85, 0.15), yawR + (rnd() - 0.5) * 0.6);
          else if (kind === 1) {
            const c1 = mk(rnd() < 0.5 ? 'crate_A_big' : 'crate_B_big', at(1.1), yawR + (rnd() - 0.5) * 0.5);
            if (c1 && rnd() < 0.6) {
              const top = makeItem(env, rnd() < 0.5 ? 'crate_A_small' : 'crate_B_small', c1.cx, c1.cz, c1.rot + (rnd() - 0.5) * 0.8, false);
              if (top) { top.base = c1; top.y = 0; comp.push(top); }
            }
            if (rnd() < 0.5) mk('sack', at(1.15, 0.85), yawR + rnd() * 3);
          } else if (kind === 2) {
            mk('barrel', at(1.0, 0.1), 0);
            if (rnd() < 0.6) mk('barrel', at(1.95, 0.15), 0);
          } else if (kind === 3) {
            mk('sack', at(0.8, 0.1), yawR + (rnd() - 0.5));
            mk('sack', at(1.35, 0.15), yawR + (rnd() - 0.5));
            if (rnd() < 0.5) mk('crate_B_small', at(2.0, 0.05), yawR + (rnd() - 0.5) * 0.5);
          } else {
            // gate: a second flag across the road
            const gx = x - side0.x * sg * 2 * off, gz = z - side0.z * sg * 2 * off;
            const fl2 = flagAt(cc, gx, gz, out, [base]);
            if (fl2) comp.push(...fl2);
          }
          if (!comp.length) continue;
          const placed = [base];
          let ok = true;
          for (const c of comp) {
            if (c.base) continue;
            if (hitsBuilding(cc, c, 0.1) || otherProblem(cc, c, placed) || placed.some((o) => obbOverlap(c, o, 0.05))) { ok = false; break; }
            placed.push(c);
          }
          if (ok && trapProblem(cc, [base, ...comp])) ok = false;
          if (ok) {
            const f = [base, ...comp].filter((it) => it.solid && !it.base);
            if (pocketCount(env, cc.near, f, [...vc.items, ...f].filter((it) => it.solid && !it.base))) ok = false;
          }
          if (!ok) continue;
          for (const c of comp) if (c.base) c.y = c.base.y + (/flag_/.test(c.id) ? c.base.h * 0.55 : c.base.h);
          commit('flag', cc, [...fl, ...comp], -side0.x * sg, -side0.z * sg);
          done = true;
          break;
        }
      }
      if (done) break;
    }
    if (done) entry++;
  }
}

// ---------------------------------------------------------------- crossings outside settlements: signposts
const COLORS4 = ['blue', 'red', 'green', 'yellow'];

/**
 * A fork / crossing of the road network outside any village or hamlet (≥ 3 road edges, no settlement cell around):
 * a signpost — a pole planted in a stone cairn on the grass verge in the widest gap between two roads, with one
 * pennant per road (≤ 3) pointing along it, at stepped heights, each in the colour of the village that road leads to
 * (seeded colour if none in reach). 50 %: a cart or crates beside it. Pure function of (seed, q, r, world).
 * `colourOf(d)` resolves the destination colour of branch d (may return null).
 */
export function planCrossing(env: PropEnv, q: number, r: number, colourOf: (d: number) => string | null): Vignette | null {
  const W = env.world;
  const c = W.cell(q, r);
  if (!c.roadMask || c.slope || c.bridge || c.riverMask || c.water) return null;
  const dirs: number[] = [];
  for (let d = 0; d < 6; d++) if (c.roadMask & (1 << d)) dirs.push(d);
  if (dirs.length < 3) return null;
  for (const [dq, dr] of DIRS) {
    const n = W.cell(q + dq, r + dr);
    if (n.tags.includes('village') && !n.tags.includes('rural')) return null; // villages / hamlets dress their own
  }
  const S = hash(env.seed, 0x5349474e, q, r); // 'SIGN'
  const rnd = RANDS(S);
  const ctr = hexToWorld(q, r);
  const y0 = W.heightAt(ctr.x, ctr.z);
  // gaps between consecutive road edges (in edge steps), widest first
  const gaps: { mid: number; w: number }[] = [];
  for (let i = 0; i < dirs.length; i++) {
    const a = dirs[i], b = dirs[(i + 1) % dirs.length];
    const w = ((b - a + 6) % 6) || 6;
    if (w >= 2) gaps.push({ mid: a + w / 2, w });
  }
  gaps.sort((g1, g2) => g2.w - g1.w || rnd() - 0.5);
  const segs: [number, number, number, number][] = [];
  for (const [dq, dr] of [[0, 0], ...DIRS]) segs.push(...env.roadSegs(q + dq, r + dr));
  const okAt = (it: Placed): boolean => {
    for (const [x, z] of [...corners(it, 0.1), [it.cx, it.cz] as [number, number]]) {
      const h = worldToHex(x, z);
      if (h.q !== q || h.r !== r) return false;
      const dx = x - ctr.x, dz = z - ctr.z;
      for (let d = 0; d < 6; d++) if (INNER - (dx * EV[d].x + dz * EV[d].z) < 0.6) return false;
      for (const sg of segs) if (segDist(x, z, sg) < ROAD_CLEAR + 0.2) return false;
      if (Math.abs(W.heightAt(x, z) - y0) > 0.05) return false;
      if (buildingAt(env, x, z, 0.5)) return false;
    }
    return true;
  };
  for (const g of gaps) {
    const ang = (g.mid * Math.PI) / 3;
    const e = { x: Math.cos(ang), z: -Math.sin(ang) };
    for (const dist of [4.9, 4.4, 5.4, 3.9]) {
      const x = ctr.x + e.x * dist, z = ctr.z + e.z * dist;
      const cairn = makeItem(env, 'resource_stone', x, z, rnd() * Math.PI * 2, false);
      if (!cairn || !okAt(cairn)) continue;
      cairn.y = W.heightAt(cairn.x, cairn.z);
      const items: Placed[] = [cairn];
      // arms: up to 3 roads, nearest-to-the-gap last so the lowest pennant points across the verge
      const arms = shuffle(dirs.slice(), rnd).slice(0, 3);
      arms.forEach((d, k) => {
        const ea = EV[d];
        const col = colourOf(d) ?? COLORS4[hash(S, d) % 4];
        const f = makeItem(env, 'flag_' + col, cairn.cx, cairn.cz, Math.atan2(-ea.x, -ea.z), false);
        if (!f) return;
        f.base = cairn;
        f.y = cairn.y + cairn.h * 0.5 + k * 0.42;
        items.push(f);
      });
      if (items.length < 3) continue;
      // companion: a cart or crates on the same verge, along the gap
      if (rnd() < 0.55) {
        const t = { x: -e.z, z: e.x };
        const sg = rnd() < 0.5 ? 1 : -1;
        for (const [off, sgn] of [[2.7, sg], [2.7, -sg], [3.2, sg], [3.2, -sg]]) {
          const px = cairn.cx + t.x * sgn * off, pz = cairn.cz + t.z * sgn * off;
          const kind = rnd();
          const comp: Placed[] = [];
          if (kind < 0.45) {
            const w = makeItem(env, 'wheelbarrow', px, pz, Math.atan2(t.x, t.z) + (rnd() - 0.5) * 0.8, false);
            if (w) comp.push(w);
          } else {
            const b1 = makeItem(env, kind < 0.75 ? 'crate_B_big' : 'barrel', px, pz, rnd() * 0.6, false);
            if (b1) {
              comp.push(b1);
              if (rnd() < 0.6) {
                const s2 = makeItem(env, 'sack', px + t.x * sgn * 0.8, pz + t.z * sgn * 0.8, rnd() * 3, false);
                if (s2) comp.push(s2);
              }
            }
          }
          if (comp.length && comp.every((it) => okAt(it) && !obbOverlap(it, cairn, 0.25) && !(obbOverlap(it, cairn, 0.8) && !obbOverlap(it, cairn, 0.25)))) {
            for (const it of comp) it.y = W.heightAt(it.x, it.z);
            items.push(...comp);
            break;
          }
        }
      }
      return { kind: 'sign', q, r, items, focus: { x: cairn.cx, y: cairn.y, z: cairn.cz }, out: e };
    }
  }
  return null;
}

// ---------------------------------------------------------------- rest spots along long road stretches
export const FENCE_PROP = 'hex/buildings/neutral/fence_wood_straight';
const FENCE_LEN = 0.45; // × one hex edge (8.66 m) → 3.9 m
const FENCE_H = 0.22; // × 4.1 m → 0.9 m: a low wayside fence

/** A short wooden fence piece centred at (x, z), running along yaw-local Z. */
function fencePiece(env: PropEnv, x: number, z: number, rot: number): Placed | null {
  const a = env.getAsset(FENCE_PROP);
  if (!a) return null;
  const bx = (a.bounds.max.x + a.bounds.min.x) / 2;
  const hx = (a.bounds.max.x - a.bounds.min.x) / 2, hz = ((a.bounds.max.z - a.bounds.min.z) / 2) * FENCE_LEN;
  return {
    id: FENCE_PROP, x, y: 0, z, rot, lie: false, cx: x, cz: z, hx, hz, h: (a.bounds.max.y) * FENCE_H, base: null, solid: true,
    scl: [1, FENCE_H, FENCE_LEN], pre: [-bx, 0, 0],
  };
}

/**
 * A rest spot on a long road stretch outside settlements (a straight or bend road cell, ≥ 3 cells from any
 * settlement): a short wooden fence along the grass verge on the outer side, with a small group flush against it —
 * a bench-like long crate + barrel, a cart with crates, barrels, or a woodpile. Every corner ≥ ROAD_CLEAR + 0.3 from
 * the road strips, ≥ 1.5 m inside the hex (roadside trees of the nature module stand on the neighbouring cells),
 * flat; no pocket (see pocketCount). Pure function of (seed, q, r, world).
 */
export function planRest(env: PropEnv, q: number, r: number): Vignette | null {
  const W = env.world;
  const c = W.cell(q, r);
  if (!c.roadMask || c.slope || c.bridge || c.riverMask || c.water) return null;
  const dirs: number[] = [];
  for (let d = 0; d < 6; d++) if (c.roadMask & (1 << d)) dirs.push(d);
  if (dirs.length !== 2) return null;
  const S = hash(env.seed, 0x52455354, q, r); // 'REST'
  const rnd = RANDS(S);
  const ctr = hexToWorld(q, r);
  const y0 = W.heightAt(ctr.x, ctr.z);
  const segs: [number, number, number, number][] = [];
  for (const [dq, dr] of [[0, 0], ...DIRS]) segs.push(...env.roadSegs(q + dq, r + dr));
  const okAt = (it: Placed): boolean => {
    for (const [x, z] of [...corners(it, 0.05), [it.cx, it.cz] as [number, number]]) {
      const h = worldToHex(x, z);
      if (h.q !== q || h.r !== r) return false;
      const dx = x - ctr.x, dz = z - ctr.z;
      for (let d = 0; d < 6; d++) if (INNER - (dx * EV[d].x + dz * EV[d].z) < 1.5) return false;
      for (const sg of segs) if (segDist(x, z, sg) < ROAD_CLEAR + 0.3) return false;
      if (Math.abs(W.heightAt(x, z) - y0) > 0.05) return false;
      if (buildingAt(env, x, z, 0.8)) return false;
    }
    return true;
  };
  // outer side: the wider arc between the two road edges (straight road: seeded side)
  const [d1, d2] = dirs;
  const w12 = (d2 - d1 + 6) % 6;
  const arcs = [{ mid: d1 + w12 / 2, w: w12 }, { mid: d2 + (6 - w12) / 2, w: 6 - w12 }];
  arcs.sort((a, b) => b.w - a.w || rnd() - 0.5);
  const tpls: string[][] = [
    ['crate_long_A', 'barrel', 'bucket_water'],
    ['wheelbarrow', 'crate_B_big', 'crate_A_small'],
    ['barrel', 'barrel', 'crate_B_big', 'sack'],
    ['resource_lumber', 'sack'],
    ['crate_long_C', 'sack', 'sack'],
  ];
  const tpl = tpls[hash(S, 7) % tpls.length];
  for (const arc of arcs) {
    const ang = (arc.mid * Math.PI) / 3;
    const n = { x: Math.cos(ang), z: -Math.sin(ang) }; // away from the road, into the verge
    const t = { x: -n.z, z: n.x };
    const yawFence = Math.atan2(t.x, t.z); // fence local Z along t
    for (const dist of [4.9, 4.5, 5.3]) {
      const fx = ctr.x + n.x * dist, fz = ctr.z + n.z * dist;
      const fence = fencePiece(env, fx, fz, yawFence + (rnd() - 0.5) * 0.08);
      if (!fence || !okAt(fence)) continue;
      fence.y = W.heightAt(fx, fz);
      const items: Placed[] = [fence];
      // group flush in front of the fence (toward the road), laid out along t
      let along = -1.5 + rnd() * 0.4;
      let ok = true;
      for (const id of tpl) {
        const it0 = makeItem(env, id, 0, 0, 0, false);
        if (!it0) continue;
        const yaw = Math.atan2(n.x, n.z) + (id === 'wheelbarrow' ? Math.PI / 2 : 0) + (rnd() - 0.5) * (id === 'barrel' ? 3 : 0.4);
        const probe = makeItem(env, id, 0, 0, yaw, false)!;
        // depth of the rotated box along n
        const cs = Math.cos(yaw), sn = Math.sin(yaw);
        const ex = Math.abs(probe.hx * cs) + Math.abs(probe.hz * sn), ez = Math.abs(probe.hx * sn) + Math.abs(probe.hz * cs);
        const depth = Math.abs(n.x) * ex + Math.abs(n.z) * ez;
        const width = Math.abs(t.x) * ex + Math.abs(t.z) * ez;
        const off = dist - fence.hx - 0.08 - depth;
        const px = ctr.x + n.x * off + t.x * (along + width), pz = ctr.z + n.z * off + t.z * (along + width);
        const it = makeItem(env, id, px - (probe.cx), pz - (probe.cz), yaw, false)!;
        along += 2 * width + 0.08;
        if (along > 1.9) { ok = items.length > 2; break; }
        if (!okAt(it) || items.some((o) => obbOverlap(it, o, 0.04))) { ok = false; break; }
        it.y = W.heightAt(it.x, it.z);
        items.push(it);
      }
      if (!ok || items.length < 3) continue;
      // small stack on a crate now and then
      const big = items.find((it) => /crate_B_big|crate_A_big/.test(it.id));
      if (big && rnd() < 0.5) {
        const top = makeItem(env, 'crate_A_small', big.cx, big.cz, big.rot + (rnd() - 0.5) * 0.6, false);
        if (top) { top.base = big; top.y = big.y + big.h; items.push(top); }
      }
      const sol = items.filter((it) => it.solid && !it.base);
      if (pocketCount(env, [], sol, sol)) continue;
      return { kind: 'rest', q, r, items, focus: { x: fx, y: fence.y, z: fz }, out: { x: -n.x, z: -n.z } };
    }
  }
  return null;
}

// ---------------------------------------------------------------- validator (debug API: __props.validate())
/** Independent re-check of a planned village: ground, roads, buildings, doors, overlaps, traps, plaza, spawn. */
export function validateVillage(env: PropEnv, vp: VillageProps, v: VillageInfo): Record<string, number | string[]> {
  const res = { items: 0, float: 0, slope: 0, spot: 0, building: 0, door: 0, overlap: 0, trap: 0, stackGap: 0, spawn: 0, pocket: 0, bad: [] as string[] };
  const vc = villageCtx(env, v);
  const flag = (k: keyof typeof res, it: Placed, extra = '') => {
    (res[k] as number)++;
    if (res.bad.length < 12) res.bad.push(`${k}:${it.id.split('/').pop()}@${it.x.toFixed(1)},${it.z.toFixed(1)}${extra}`);
  };
  const all: { it: Placed; vg: number }[] = [];
  vp.vignettes.forEach((vg, i) => vg.items.forEach((it) => all.push({ it, vg: i })));
  for (const { it, vg } of all) {
    res.items++;
    const own = vp.vignettes[vg];
    const cc = cellCtx(vc, own.q, own.r);
    if (it.base) {
      if (/flag_/.test(it.id)) continue; // planted in its barrel by design
      if (it.y < it.base.y + it.base.h - 0.15 || it.y > it.base.y + it.base.h + 0.01) flag('stackGap', it);
      continue;
    }
    const g = env.world.heightAt(it.x, it.z);
    if (Math.abs(it.y - g) > 0.03) flag('float', it);
    let y0 = Infinity, y1 = -Infinity;
    for (const [x, z] of corners(it)) {
      const gy = env.world.heightAt(x, z);
      y0 = Math.min(y0, gy); y1 = Math.max(y1, gy);
      const why = spotProblem(cc, x, z, it.solid);
      if (why) flag('spot', it, ' ' + why);
    }
    if (y1 - y0 > 0.08) flag('slope', it);
    if (samples(it).some(([x, z]) => buildingAt(env, x, z, 0))) flag('building', it);
    if (inDoorway(cc, samples(it), 0.2)) flag('door', it);
    if (vc.spawn && Math.hypot(it.cx - vc.spawn.x, it.cz - vc.spawn.z) < 3) flag('spawn', it);
    if (it.solid && hitsBuilding(cc, it, 1.15) && !hitsBuilding(cc, it, 0.3)) flag('trap', it, ' wall');
  }
  const allSolid = all.map((a) => a.it).filter((it) => it.solid && !it.base);
  vp.vignettes.forEach((vg) => {
    const f = vg.items.filter((it) => it.solid && !it.base);
    if (!f.length) return;
    const n = pocketCount(env, cellCtx(vc, vg.q, vg.r).near, f, allSolid);
    if (n) { res.pocket += n; if (res.bad.length < 12) res.bad.push(`pocket:${vg.kind}@${vg.focus.x.toFixed(1)},${vg.focus.z.toFixed(1)}`); }
  });
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const A = all[i], Bv = all[j];
      if (A.it.base || Bv.it.base) continue;
      if (Math.hypot(A.it.cx - Bv.it.cx, A.it.cz - Bv.it.cz) > 6) continue;
      if (obbOverlap(A.it, Bv.it, 0)) flag('overlap', A.it, ' with ' + Bv.it.id.split('/').pop());
      else if (A.it.solid && Bv.it.solid && obbOverlap(A.it, Bv.it, 0.75) && !obbOverlap(A.it, Bv.it, 0.3)) flag('trap', A.it, ' prop');
    }
  return res;
}
