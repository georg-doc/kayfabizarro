// Spawn-village scorer (pure of the world + a canopy provider; works for ANY seed's WorldModel, offline in the page).
//
// Score 0..100 (higher = better) = village quality (35) + bridge leg (25) + forest leg (20) + route continuity (10)
// + spawn view (10) − distance from the origin (≤ 3). See NOTES.md for the exact terms.
//  phase 1 (cheap: cells of stages < 5, no nature): quality, bridge by road, spawn view
//  phase 2 (final cells + real crowns): forest edge on foot (road or open ground), forest beyond the bridge
import type { WorldModel } from '../../core/world';
import { DIRS, hexDistance, hexToChunk, hexToWorld, worldToHex } from '../../core/hex';
import { LEVEL_H } from '../../core/units';
import { canStep } from '../terrain/api';
import * as VA from '../villages/api';
import { villagesNear, type VillageInfo } from '../villages/api';
import { CanopyIndex, canopyBaseAt, inForest } from '../nature/api';
import {
  type Cell, type ForestTest, type Get, type Node, type V3, EDGE_T, STEP,
  dirIndex, edgePoint, isForest, key, pathTo, polyLen, polyline, pt, roadTree, walkSearch,
} from './graph';

/** The village whose crossing is (q, r) (villageAt() only knows lot cells, not the crossing). One small lookup. */
export function villageCentredAt(seed: number, q: number, r: number): VillageInfo | null {
  return villagesNear(seed, q, r, 1).find((v) => v.centre.q === q && v.centre.r === r) ?? null;
}

/** Real-tree canopy queries (nature's crowns). */
export interface Cover {
  inForest(x: number, z: number): number;
  canopyBaseAt(x: number, z: number, r: number): number | null;
}

/** Canopy built lazily from per-chunk crown lists (nature `Plan.crowns`, flat [x, z, r, base, …]). */
export function lazyCover(crownsOf: (cx: number, cz: number) => number[] | null): Cover & { chunks: number } {
  const index = new CanopyIndex();
  const done = new Set<string>();
  const ensure = (x: number, z: number, R: number) => {
    for (const [dx, dz] of [[-R, -R], [R, -R], [-R, R], [R, R], [0, 0]]) {
      const h = worldToHex(x + dx, z + dz);
      const { cx, cz } = hexToChunk(h.q, h.r);
      const k = cx + ',' + cz;
      if (done.has(k)) continue;
      done.add(k);
      const crowns = crownsOf(cx, cz);
      if (crowns) index.set(k, crowns);
    }
  };
  return {
    inForest(x, z) { ensure(x, z, 13); return inForest(index, x, z); },
    canopyBaseAt(x, z, r) { ensure(x, z, r + 7); return canopyBaseAt(index, x, z, r); },
    get chunks() { return done.size; },
  };
}

/** Forest cell on REAL trees: ≥ 50 % crown cover around its centre and ≥ 2 neighbours ≥ 35 % (no road / water). */
export function crownForestTest(cover: Cover): ForestTest {
  const memo = new Map<string, number>();
  const cv = (q: number, r: number) => {
    const k = key(q, r);
    let v = memo.get(k);
    if (v === undefined) {
      const w = hexToWorld(q, r);
      memo.set(k, (v = cover.inForest(w.x, w.z)));
    }
    return v;
  };
  return (_get, c) => {
    if (c.water || c.roadMask || c.riverMask || cv(c.q, c.r) < 0.5) return false;
    let n = 0;
    for (const [dq, dr] of DIRS) if (cv(c.q + dq, c.r + dr) >= 0.35) n++;
    return n >= 2;
  };
}

/** Move a forest-edge point onto the first crown along the approach (1 m before it). */
export function edgeOnCrowns(world: WorldModel, cover: Cover, from: Cell, f: Cell): V3 | null {
  const a = hexToWorld(from.q, from.r), b = hexToWorld(f.q, f.r);
  const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz);
  for (let s = 4; s <= L * 1.6; s += 0.25) {
    const x = a.x + (dx / L) * s, z = a.z + (dz / L) * s;
    if (cover.canopyBaseAt(x, z, 0.4) !== null) {
      const back = Math.max(4, s - 1.0);
      return pt(world, a.x + (dx / L) * back, a.z + (dz / L) * back);
    }
  }
  return null;
}

// ------------------------------------------------------------------ evaluation
export interface Breakdown {
  id: string;
  centre: Cell;
  dist_m: number;
  degree: number;
  color: string;
  quality: { buildings: number; onLevel: number; coreCells: number; coreOnLevel: number; cliffEdges: number; plaza: boolean; well: boolean; civic: number };
  bridge_m: number | null;
  forest_m: number | null;
  beyond_m: number | null;
  /** landmark: a watchtower / chapel (rural feature) in the spawn view — REPORTED ONLY, not scored */
  view: { buildings: number; well: boolean; wall_m: number | null; landmark?: { feature: string; dist_m: number } | null };
  points: { village: number; bridge: number; forest: number; route: number; view: number; dist: number };
  phase: 1 | 2;
  total: number;
}

export interface VillageEval {
  v: VillageInfo;
  b: Breakdown;
  road: Map<string, Node>;
  bridge: (Cell & { cost: number; path: Cell[] }) | null;
  walk: ReturnType<typeof walkSearch> | null;
  forest: { edge: ReturnType<typeof walkSearch>['edges'][number]; point: V3; length: number } | null;
  beyond: { search: ReturnType<typeof walkSearch>; edge: ReturnType<typeof walkSearch>['edges'][number]; point: V3; length: number; far: Cell } | null;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** full points up to `ok`, falling linearly to 0 at `zero` */
const ramp = (x: number, ok: number, zero: number) => clamp01((zero - x) / (zero - ok));
const r1 = (x: number) => Math.round(x * 10) / 10;

/** A1 limits (run 4.39 m/s): village→bridge ≤ 25 s ≈ 110 m, village→forest edge ≤ 18 s ≈ 80 m. */
export const A1 = { bridge_m: 110, forest_m: 80 };

function quality(get: Get, v: VillageInfo) {
  const L = v.level;
  let coreCells = 0, coreOnLevel = 0, cliffEdges = 0;
  const { q: cq, r: cr } = v.centre;
  for (let dq = -2; dq <= 2; dq++)
    for (let dr = -2; dr <= 2; dr++) {
      const q = cq + dq, r = cr + dr;
      if (hexDistance(q, r, cq, cr) > 2) continue;
      const c = get(q, r);
      if (c.water) continue;
      coreCells++;
      if (c.level === L && !c.slope) coreOnLevel++;
      for (let d = 0; d < 3; d++) {
        const nq = q + DIRS[d][0], nr = r + DIRS[d][1];
        if (hexDistance(nq, nr, cq, cr) > 2) continue;
        const n = get(nq, nr);
        if (n.water) continue;
        if (!canStep(c, n)) cliffEdges++;
      }
    }
  let buildings = 0, onLevel = 0, civic = 0;
  const civicTypes = new Set<string>();
  for (const c of v.cells)
    for (const it of c.items) {
      if (it.type === 'well') continue;
      buildings++;
      if (Math.abs(it.world.y - L * LEVEL_H) < 0.5) onLevel++;
      if (it.type === 'tavern' || it.type === 'market' || it.type === 'church' || it.type === 'blacksmith') civicTypes.add(it.type);
    }
  civic = civicTypes.size;
  const q = { buildings, onLevel, coreCells, coreOnLevel, cliffEdges, plaza: !!v.plaza, well: !!v.well, civic };
  const pts =
    10 * clamp01(buildings / 18) * (buildings ? 0.5 + 0.5 * (onLevel / buildings) : 0) +
    (q.plaza ? 2 : 0) + (q.well ? 1 : 0) + Math.min(1, civic / 3) +
    11 * (coreCells ? coreOnLevel / coreCells : 0) +
    10 * clamp01(1 - cliffEdges / 8);
  return { q, pts };
}

function spawnView(world: WorldModel, v: VillageInfo) {
  if (!v.spawn) return { view: { buildings: 0, well: false, wall_m: null as number | null, landmark: null }, pts: 0 };
  const s = v.spawn.world, h = v.spawn.heading;
  const fx = Math.sin(h), fz = Math.cos(h);
  const inCone = (x: number, z: number, deg: number, lo: number, hi: number) => {
    const dx = x - s.x, dz = z - s.z, d = Math.hypot(dx, dz);
    if (d < lo || d > hi) return false;
    return (dx * fx + dz * fz) / d >= Math.cos((deg * Math.PI) / 180);
  };
  let buildings = 0;
  for (const c of v.cells) for (const it of c.items) if (it.type !== 'well' && inCone(it.world.x, it.world.z, 38, 5, 55)) buildings++;
  const well = !!v.well && inCone(v.well.world.x, v.well.world.z, 35, 3, 45);
  // a terrain wall in the face: first ground point within 25 m that rises > 1.5 m above the spawn
  let wall_m: number | null = null;
  for (let d = 2; d <= 25; d += 1) {
    if (world.heightAt(s.x + fx * d, s.z + fz * d) > s.y + 1.5) { wall_m = d; break; }
  }
  const pts = 6 * clamp01(buildings / 5) + (well ? 2 : 0) + 2 * (wall_m === null ? 1 : ramp(25 - wall_m, 0, 15));
  // visible landmark (reported only): a watchtower / chapel within 150 m in a ±45° cone of the spawn view
  let landmark: { feature: string; dist_m: number } | null = null;
  const ruralNear = (VA as { ruralNear?: (seed: number, q: number, r: number, radius: number) => VillageInfo[] }).ruralNear;
  if (ruralNear) {
    const sc = worldToHex(s.x, s.z);
    for (const r of ruralNear(world.seed, sc.q, sc.r, 10)) {
      if (r.feature !== 'watchtower' && r.feature !== 'chapel') continue;
      for (const c of r.cells) for (const it of c.items) {
        if (!inCone(it.world.x, it.world.z, 45, 10, 150)) continue;
        const d = Math.round(Math.hypot(it.world.x - s.x, it.world.z - s.z));
        if (!landmark || d < landmark.dist_m) landmark = { feature: r.feature, dist_m: d };
      }
    }
  }
  return { view: { buildings, well, wall_m, landmark }, pts };
}

const originDist = (v: VillageInfo) => {
  const w = hexToWorld(v.centre.q, v.centre.r);
  return Math.hypot(w.x, w.z);
};

/** Phase 1: quality + bridge by road + spawn view (cells of stages < 5 only). */
export function evalPhase1(world: WorldModel, v: VillageInfo): VillageEval {
  const getRoad: Get = (q, r) => world.cellAt(5, q, r);
  const road = roadTree(getRoad, v.centre.q, v.centre.r);
  let bridge: VillageEval['bridge'] = null;
  for (const n of road.values())
    if (getRoad(n.q, n.r).bridge && (!bridge || n.cost < bridge.cost)) bridge = { q: n.q, r: n.r, cost: n.cost, path: [] };
  let bridge_m: number | null = null;
  if (bridge) {
    bridge.path = pathTo(road, bridge.q, bridge.r);
    bridge_m = polyline(world, getRoad, bridge.path).length;
  }
  const Q = quality(getRoad, v);
  const V = spawnView(world, v);
  const dist = originDist(v);
  const points = {
    village: r1(Q.pts),
    bridge: r1(bridge_m === null ? 0 : 25 * ramp(bridge_m, A1.bridge_m, A1.bridge_m + 60)),
    forest: 0,
    route: 0,
    view: r1(V.pts),
    dist: r1(-3 * clamp01(dist / 600)),
  };
  const b: Breakdown = {
    id: v.id, centre: { ...v.centre }, dist_m: Math.round(dist), degree: v.degree, color: v.color, quality: Q.q,
    bridge_m, forest_m: null, beyond_m: null, view: V.view, points, phase: 1, total: 0,
  };
  b.total = r1(points.village + points.bridge + points.view + points.dist);
  return { v, b, road, bridge, walk: null, forest: null, beyond: null };
}

/** Phase 2: forest edge on foot from the crossing, and the forest beyond the bridge (final cells + crowns). */
export function evalPhase2(world: WorldModel, e: VillageEval, cover: Cover | null): VillageEval {
  const get: Get = (q, r) => world.cell(q, r);
  const ft = cover ? crownForestTest(cover) : isForest;
  const v = e.v;
  const walk = walkSearch(get, [{ q: v.centre.q, r: v.centre.r, cost: 0 }], new Set(), ft);
  e.walk = walk;
  const legTo = (tree: Map<string, Node>, ed: ReturnType<typeof walkSearch>['edges'][number], prefix: Cell[] = []) => {
    const p = (cover && edgeOnCrowns(world, cover, ed.from, ed.f)) || edgePoint(world, ed.from, ed.f);
    const cells = [...prefix, ...pathTo(tree, ed.from.q, ed.from.r)];
    return { point: p, length: polyline(world, get, cells, undefined, p).length };
  };
  // nearest by real path length among the first few candidate edges (Dijkstra cost ≠ metres off-road)
  let best: VillageEval['forest'] = null;
  for (const ed of walk.edges.slice(0, 6)) {
    const l = legTo(walk.tree, ed);
    if (!best || l.length < best.length) best = { edge: ed, ...l };
  }
  e.forest = best;
  if (e.bridge && e.bridge.path.length >= 2) {
    const path = e.bridge.path;
    const prev = path[path.length - 2];
    const d = dirIndex(prev, e.bridge);
    if (d >= 0) {
      const far = { q: e.bridge.q + DIRS[d][0], r: e.bridge.r + DIRS[d][1] };
      const s = walkSearch(get, [{ q: far.q, r: far.r, cost: e.bridge.cost + STEP, prev: null }], new Set([key(e.bridge.q, e.bridge.r)]), ft);
      let bb: VillageEval['beyond'] = null;
      for (const ed of s.edges.slice(0, 6)) {
        const l = legTo(s.tree, ed, path);
        if (!bb || l.length < bb.length) bb = { search: s, edge: ed, far, ...l };
      }
      e.beyond = bb;
    }
  }
  const b = e.b;
  b.forest_m = best ? best.length : null;
  b.beyond_m = e.beyond ? e.beyond.length : null;
  b.points.forest = r1(best ? 20 * ramp(best.length, A1.forest_m, A1.forest_m + 50) : 0);
  b.points.route = r1(e.beyond && b.bridge_m !== null ? 10 * ramp(e.beyond.length - b.bridge_m, 45, 110) : 0);
  b.phase = 2;
  b.total = r1(b.points.village + b.points.bridge + b.points.forest + b.points.route + b.points.view + b.points.dist);
  return e;
}

/**
 * Rank the proper villages within `radius` cells (40 ≈ 600 m) of the origin: phase 1 for all, phase 2 for the best
 * `top` by phase 1 (phase 2 adds at most 30 points, so a village more than 30 behind the leader cannot win).
 */
export function rankVillages(world: WorldModel, cover: Cover | null, opts: { radius?: number; top?: number; only?: string; at?: Cell | null } = {}) {
  const t0 = performance.now();
  // `at`: score just the village owning that cell (one planner lookup — the game's lazy route planning)
  const one = opts.at ? villageCentredAt(world.seed, opts.at.q, opts.at.r) : null;
  let vs = (opts.at ? (one ? [one] : []) : villagesNear(world.seed, 0, 0, opts.radius ?? 40)).filter((v) => v.kind === 'village' && v.degree >= 3);
  if (opts.only) vs = vs.filter((v) => v.id === opts.only);
  const p1 = vs.map((v) => evalPhase1(world, v)).sort((a, b) => b.b.total - a.b.total);
  const t1 = performance.now();
  const lead = p1[0]?.b.total ?? 0;
  const full: VillageEval[] = [];
  for (const e of p1.slice(0, opts.top ?? 3)) if (e.b.total >= lead - 30) full.push(evalPhase2(world, e, cover));
  full.sort((a, b) => b.b.total - a.b.total);
  const rest = p1.filter((e) => !full.includes(e));
  return { ranked: [...full, ...rest], ms: { phase1: Math.round(t1 - t0), phase2: Math.round(performance.now() - t1) } };
}

export { polyLen };
