// Demo graph + geometry helpers (pure): road-graph BFS, open-ground walk Dijkstra to forest edges, road-following polylines.
import type { CellData } from '../../core/types';
import type { WorldModel } from '../../core/world';
import { DIRS, hexToWorld, opposite, worldToHex } from '../../core/hex';
import { canStep } from '../terrain/api';


export type V3 = [number, number, number];
export type Cell = { q: number; r: number };

export interface Leg {
  /** polyline (world points, y = ground) from the start to the landmark: cell centres + shared-edge midpoints */
  points: V3[];
  /** 3-D length of the polyline in metres */
  length: number;
  /** hex cells of the path (start cell … last cell before the landmark) */
  cells: Cell[];
  /** metres of the leg on road cells */
  onRoad_m?: number;
  /** the polyline with safe shortcuts (route scripts steer along it), see smoothPoints */
  smooth?: V3[];
}

export interface ForestEdge {
  /** standing point at the forest edge (on the ground just before the first crowns) */
  world: V3;
  /** cell the forest is entered from, the forest cell, forest density of that cell */
  from: Cell;
  forestCell: Cell & { density: number };
  /** true if reached across the chosen bridge */
  beyondBridge: boolean;
}

export const STEP = 15; // hex pitch (m)
export const ROAD_STEPS = 12; // road BFS depth (180 m)
export const WALK_BUDGET = 150; // walk Dijkstra budget (m-equivalent; A1 forest leg ≤ ~80 m, anything past ~130 m scores 0)
export const OFFROAD = 1.25; // cost factor for a step touching a non-road cell
const FOREST_MIN = 0.5;
export const EDGE_T = 0.56; // initial forest-edge point: fraction from the last open cell centre toward the forest cell centre

export type Get = (q: number, r: number) => Readonly<CellData>;
export const key = (q: number, r: number) => q + ',' + r;

// ------------------------------------------------------------------ graphs
export function roadNbrs(get: Get, q: number, r: number): Cell[] {
  const c = get(q, r);
  const out: Cell[] = [];
  for (let d = 0; d < 6; d++) {
    if (!((c.roadMask >> d) & 1)) continue;
    const nq = q + DIRS[d][0], nr = r + DIRS[d][1];
    if ((get(nq, nr).roadMask >> opposite(d)) & 1) out.push({ q: nq, r: nr });
  }
  return out;
}

export interface Node { q: number; r: number; prev: string | null; cost: number }

export function roadTree(get: Get, q0: number, r0: number): Map<string, Node> {
  const seen = new Map<string, Node>([[key(q0, r0), { q: q0, r: r0, prev: null, cost: 0 }]]);
  let frontier = [seen.get(key(q0, r0))!];
  for (let s = 1; s <= ROAD_STEPS && frontier.length; s++) {
    const next: Node[] = [];
    for (const n of frontier)
      for (const m of roadNbrs(get, n.q, n.r)) {
        const k = key(m.q, m.r);
        if (seen.has(k)) continue;
        const node = { q: m.q, r: m.r, prev: key(n.q, n.r), cost: s * STEP };
        seen.set(k, node);
        next.push(node);
      }
    frontier = next;
  }
  return seen;
}

const hasTag = (c: Readonly<CellData>, t: string) => c.tags.includes(t);

/** Cell a walker may cross on the way to a forest edge (open ground, no structures). */
export function passable(c: Readonly<CellData>): boolean {
  if (c.water || c.biome === 'mountain') return false;
  if (c.riverMask && !c.bridge) return false;
  if (c.building || (c.reserved && !c.bridge)) return false;
  for (const t of c.tags) if (t === 'field' || t === 'garden' || t === 'rock' || t === 'mountain' || t === 'well' || t === 'square') return false;
  return true;
}

export function walled(a: Readonly<CellData>, b: Readonly<CellData>, d: number): boolean {
  return hasTag(a, 'fence:' + d) || hasTag(b, 'fence:' + opposite(d));
}

export function isForest(get: Get, c: Readonly<CellData>): boolean {
  if (c.forest < FOREST_MIN) return false;
  let n = 0;
  for (const [dq, dr] of DIRS) if (get(c.q + dq, c.r + dr).forest >= FOREST_MIN) n++;
  return n >= 2;
}

/** Dijkstra over open ground from `starts`; collects forest edges (forest cells adjacent to reached open cells). */
export type ForestTest = (get: Get, c: Readonly<CellData>) => boolean;

export function walkSearch(get: Get, starts: { q: number; r: number; cost: number; prev?: string | null }[], banned: Set<string>, forestTest: ForestTest = isForest) {
  const best = new Map<string, Node>();
  const open: Node[] = [];
  for (const s of starts) {
    const n = { q: s.q, r: s.r, prev: s.prev ?? null, cost: s.cost };
    best.set(key(s.q, s.r), n);
    open.push(n);
  }
  const edges: { from: Node; f: Readonly<CellData>; dist: number }[] = [];
  const done = new Set<string>();
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].cost < open[bi].cost) bi = i;
    const n = open.splice(bi, 1)[0];
    const k = key(n.q, n.r);
    if (done.has(k)) continue;
    done.add(k);
    const a = get(n.q, n.r);
    for (let d = 0; d < 6; d++) {
      const q = n.q + DIRS[d][0], r = n.r + DIRS[d][1];
      const kk = key(q, r);
      if (banned.has(kk)) continue;
      const b = get(q, r);
      if (!canStep(a, b) || walled(a, b, d)) continue;
      if (a.bridge || b.bridge) {
        // a bridge is entered and left only along its road
        if (!((a.roadMask >> d) & 1) || !((b.roadMask >> opposite(d)) & 1)) continue;
      }
      if (!a.slope && !b.slope && !a.bridge && forestTest(get, b)) {
        edges.push({ from: n, f: b, dist: n.cost + STEP * EDGE_T });
        continue;
      }
      if (!passable(b)) continue;
      const c = n.cost + STEP * (a.roadMask && b.roadMask ? 1 : OFFROAD);
      if (c > WALK_BUDGET) continue;
      const old = best.get(kk);
      if (old && old.cost <= c) continue;
      const m = { q, r, prev: k, cost: c };
      best.set(kk, m);
      open.push(m);
    }
  }
  edges.sort((x, y) => x.dist - y.dist || y.f.forest - x.f.forest);
  return { tree: best, edges };
}

export function pathTo(tree: Map<string, Node>, q: number, r: number): Cell[] {
  const out: Cell[] = [];
  for (let k: string | null = key(q, r); k; ) {
    const n: Node = tree.get(k)!;
    out.push({ q: n.q, r: n.r });
    k = n.prev;
  }
  return out.reverse();
}

// ------------------------------------------------------------------ geometry
export const r2 = (x: number) => +x.toFixed(2);

export function pt(world: WorldModel, x: number, z: number): V3 {
  return [r2(x), r2(world.heightAt(x, z)), r2(z)];
}

export function polyLen(pts: V3[]): number {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
  return L;
}

/** Polyline through the cell centres and the shared-edge midpoints (follows the road tiles), ground y. */
export function polyline(world: WorldModel, get: Get, cells: Cell[], start?: V3, end?: V3): Leg {
  const pts: V3[] = [];
  let onRoad = 0;
  if (start) pts.push(start);
  for (let i = 0; i < cells.length; i++) {
    const w = hexToWorld(cells[i].q, cells[i].r);
    if (!(start && i === 0)) pts.push(pt(world, w.x, w.z));
    if (i + 1 < cells.length) {
      const w2 = hexToWorld(cells[i + 1].q, cells[i + 1].r);
      pts.push(pt(world, (w.x + w2.x) / 2, (w.z + w2.z) / 2));
      if (get(cells[i].q, cells[i].r).roadMask && get(cells[i + 1].q, cells[i + 1].r).roadMask) onRoad += STEP;
    }
  }
  if (end) pts.push(end);
  return { points: pts, length: +polyLen(pts).toFixed(1), cells: cells.map((c) => ({ ...c })), onRoad_m: onRoad };
}

export function edgePoint(world: WorldModel, from: Cell, f: Cell): V3 {
  const a = hexToWorld(from.q, from.r), b = hexToWorld(f.q, f.r);
  return pt(world, a.x + (b.x - a.x) * EDGE_T, a.z + (b.z - a.z) * EDGE_T);
}

export function dirIndex(a: Cell, b: Cell): number {
  for (let d = 0; d < 6; d++) if (a.q + DIRS[d][0] === b.q && a.r + DIRS[d][1] === b.r) return d;
  return -1;
}

/**
 * Greedy shortcut of a leg polyline for steering: from each vertex jump to the farthest later vertex whose chord
 * (sampled every 0.75 m) stays inside the leg's own cells (+ `extra`), and — on road / village cells, where houses
 * may overhang onto the street cell's grass and props stand by the road — within 2 m of the original polyline.
 */
export function smoothPoints(get: Get, pts: V3[], cells: Cell[], extra: Cell[] = []): V3[] {
  if (pts.length < 3) return pts.slice();
  const ok = new Set([...cells, ...extra].map((c) => key(c.q, c.r)));
  const segDist = (x: number, z: number) => {
    let best = Infinity;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dx = b[0] - a[0], dz = b[2] - a[2], L2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[2]) * dz) / L2));
      best = Math.min(best, Math.hypot(x - a[0] - t * dx, z - a[2] - t * dz));
    }
    return best;
  };
  const clear = (a: V3, b: V3) => {
    const L = Math.hypot(b[0] - a[0], b[2] - a[2]);
    let prev: Cell | null = null;
    for (let s = 0; s <= L; s += 0.75) {
      const x = a[0] + ((b[0] - a[0]) * s) / L, z = a[2] + ((b[2] - a[2]) * s) / L;
      const h = worldToHex(x, z);
      if (!ok.has(key(h.q, h.r))) return false;
      const c = get(h.q, h.r);
      if ((c.roadMask || c.village || c.building || c.reserved) && segDist(x, z) > 2) return false;
      // crossing into another cell: it must be a neighbour the walker can step to, with no wall on the shared edge
      if (prev && (prev.q !== h.q || prev.r !== h.r)) {
        const d = dirIndex(prev, h);
        const pc = get(prev.q, prev.r);
        if (d < 0 || !canStep(pc, c) || walled(pc, c, d)) return false;
      }
      prev = h;
    }
    return true;
  };
  // pinned vertices: everything within 8 m of a bridge cell centre (edge midpoints before / after it, the deck centre)
  // — a bridge is entered and left along its axis, never cut diagonally (the walker would end in the river beside it)
  const bridges = cells.filter((c) => get(c.q, c.r).bridge).map((c) => hexToWorld(c.q, c.r));
  const pinned = pts.map((p) => bridges.some((b) => Math.hypot(p[0] - b.x, p[2] - b.z) < 8));
  const out: V3[] = [pts[0]];
  let i = 0;
  while (i < pts.length - 1) {
    let lim = pts.length - 1;
    for (let k = i + 1; k < pts.length; k++) if (pinned[k]) { lim = k; break; }
    let j = i + 1;
    for (let k = lim; k > i + 1; k--) if (clear(pts[i], pts[k])) { j = k; break; }
    out.push(pts[j]);
    i = j;
  }
  return out;
}
