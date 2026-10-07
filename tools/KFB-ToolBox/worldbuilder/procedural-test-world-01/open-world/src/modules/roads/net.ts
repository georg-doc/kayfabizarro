// Stage-2 road network. Pure function of (seed, terrain stage-1 cells); continuous across chunks; any query order.
//
//  1. Macro nodes: one per MACRO×MACRO axial cell, jittered, snapped to a "clearing" (node cell + ring 1 flat, dry,
//     same level, no coast/rock/mountain, away from river valleys). Invalid when no clearing is near.
//  2. Edges on the triangular macro lattice: every node "wants" its 3 lightest (hash-weighted) lattice edges; an edge is
//     kept when both ends want it, nodes left with < 2 edges rescue their lightest ones, and in every lattice triangle
//     whose three edges survive the heaviest one is dropped (no macro triangles). All purely local.
//  3. Ports: each node gives every kept edge its own hex edge to leave through, as close to the bearing as possible,
//     never two ports 60° apart on a 2-road node (so a waypoint is at most a wide 60° bend).
//  4. Routing: A* per edge with state (cell, heading, mode) inside a corridor around the node-node segment that is
//     carved Voronoi-style against neighbouring edges (+ margin) → paths never touch each other except at their nodes.
//     Max 60° turn per cell; level changes only through straight road ramps (cell.level L, next cell L+1) or existing
//     terrain ramps traversed along their slope; 2-level steps are walls. Costs: gentle low-frequency noise (winding),
//     turn penalty, forest, shore proximity, river valleys (cross straight, never run along).
import type { CellData } from '../../core/types';
import { DIRS, hexDistance, hexRound, hexToWorld } from '../../core/hex';
import { fbm2, hash, rand01, strSeed } from '../../core/rng';
import { HEX_WIDTH } from '../../core/units';
import { MinHeap } from './heap';
import { corridorFn, type CorridorInfo } from './corridor';

export type CellGetter = (q: number, r: number) => Readonly<CellData>;

/** Macro node spacing in cells (≈ 195 m). */
export const MACRO = 13;
const JIT = 0.15;
const HALF_W = 4.5;
const MARGIN = 1.3;
const NEAR = 3;
const PAD = 9;
/** dead-end pruning rounds */
export const PRUNE = 4;
/** max roads per node */
const MAX_DEG = 3;
/** triangles of roads shorter than this (cells, perimeter) lose their heaviest road */
const LOOP_MAX = 42;
/** extra cost of a non-tongue (pocket / walled foot) road ramp */
export let RAMP_FALLBACK = 20;
export function setRampFallback(v: number): void { RAMP_FALLBACK = v; }

export interface RoadNode {
  i: number;
  j: number;
  q: number;
  r: number;
  level: number;
  /** world position in cell units (metres / HEX_WIDTH) */
  x: number;
  z: number;
}

export interface PathStep {
  q: number;
  r: number;
  /** 0 flat, 1 notch ramp up (upper cell lowered, rises toward heading), 2 notch ramp down (rises toward where we came from), 3/4 terrain ramp */
  mode: number;
  /** heading when entering this cell */
  dir: number;
}

export interface RoadPath {
  a: RoadNode;
  b: RoadNode;
  steps: PathStep[];
  /** true when routed with the strict rules (ports, margins). */
  strict: boolean;
}

export interface RoadCell {
  mask: number;
  /** notch ramp: the cell is lowered to this level (else null) */
  level: number | null;
  /** Road ramp added by the road layer (terrain ramps keep their own slope). */
  slope: { dir: number; steps: 1 } | null;
  node: RoadNode | null;
}

const isRock = (c: Readonly<CellData>) => c.tags.includes('rock');
const passable = (c: Readonly<CellData>) => !c.water && c.coastMask === 0 && c.biome !== 'mountain' && !isRock(c);
const siteCell = (c: Readonly<CellData>) => passable(c) && !c.slope;
const cdiff = (a: number, b: number) => {
  const d = (((a - b) % 6) + 6) % 6;
  return Math.min(d, 6 - d);
};
const cdiffF = (a: number, b: number) => {
  const d = (((a - b) % 6) + 6) % 6;
  return Math.min(d, 6 - d);
};

function cellXZ(q: number, r: number): { x: number; z: number } {
  const w = hexToWorld(q, r);
  return { x: w.x / HEX_WIDTH, z: w.z / HEX_WIDTH };
}

/** Bearing in hex-direction units (0..6, edge d at d·60° from +X toward −Z). */
function bearing(dx: number, dz: number): number {
  const a = Math.atan2(-dz, dx) / (Math.PI / 3);
  return ((a % 6) + 6) % 6;
}

function segDist(px: number, pz: number, ax: number, az: number, bx: number, bz: number): number {
  const vx = bx - ax, vz = bz - az;
  const l2 = vx * vx + vz * vz;
  let t = l2 ? ((px - ax) * vx + (pz - az) * vz) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(px - (ax + t * vx), pz - (az + t * vz));
}

const nkey = (i: number, j: number) => i + ',' + j;
const DQ = Int8Array.from(DIRS, (d) => d[0]), DR = Int8Array.from(DIRS, (d) => d[1]);
/** numeric cell key (|q|, |r| < 32768) */
const ckey = (q: number, r: number) => (q + 0x8000) * 0x10000 + (r + 0x8000);

/** Run a step generator to completion (sync twin of every *Iter method; identical results). */
export function drain<T>(g: Generator<void, T>): T {
  let r = g.next();
  while (!r.done) r = g.next();
  return r.value;
}
/**
 * Thrown by the sync wrappers while `strictCache` is on (only during a prefetch step) instead of computing an
 * expensive value inline; the prefetcher computes it with the resumable twin and retries. Never escapes otherwise.
 */
export class Missing {
  /** core/world.ts isRetrySignal(): never memoised, never disables a layer (integrator 2026-10-06). */
  readonly kfbRetry = true;
  constructor(readonly kind: 'feas' | 'path' | 'extra' | 'link', readonly i: number, readonly j: number, readonly k: number) {}
}
/** A* expansions between two yields of a resumable route. */
const SLICE = 250;
const MEMO_CAP = 50000;

export const DEBUG = { pocket: false, noLevels: false, noSector: false, noCorr: false, noAvoid: false, loose1: false, oldRamp: false, noStraight: false, wide: false, noLoop: false, trace: null as null | unknown[] };

/** Reusable A* scratch buffers (per-cell + per-state), stamped per route instead of cleared. */
interface Scratch {
  cap: number;
  stamp: number;
  allowed: Uint8Array;
  cost: Float32Array;
  lvl: Int16Array;
  sdir: Int8Array;
  ssteps: Int8Array;
  inCorr: Uint8Array;
  gbear: Float64Array;
  cstamp: Uint32Array;
  g: Float32Array;
  parent: Int32Array;
  gstamp: Uint32Array;
  closed: Uint32Array;
  heap: MinHeap;
}
const scratchPool: Scratch[] = [];
function acquireScratch(ns: number): Scratch {
  let s = scratchPool.pop();
  if (!s || s.cap < ns) {
    const cap = Math.max(ns, s ? s.cap * 2 : 1 << 16), n = Math.ceil(cap / 48);
    s = {
      cap, stamp: 0,
      allowed: new Uint8Array(n), cost: new Float32Array(n), lvl: new Int16Array(n), sdir: new Int8Array(n), ssteps: new Int8Array(n),
      inCorr: new Uint8Array(n), gbear: new Float64Array(n), cstamp: new Uint32Array(n),
      g: new Float32Array(cap), parent: new Int32Array(cap), gstamp: new Uint32Array(cap), closed: new Uint32Array(cap), heap: new MinHeap(),
    };
  }
  s.stamp++;
  if (s.stamp >= 0xffffffff) { s.stamp = 1; s.cstamp.fill(0); s.gstamp.fill(0); s.closed.fill(0); }
  s.heap.clear();
  return s;
}
function releaseScratch(s: Scratch): void {
  if (scratchPool.length < 4) scratchPool.push(s);
}

export class RoadNet {
  private sN: number;
  private sE: number;
  private sC: number;
  private nodeMemo = new Map<string, RoadNode | null>();
  private rescueMemo = new Map<string, number[]>();
  private keptMemo = new Map<string, number[]>();
  private portMemo = new Map<string, Map<number, number>>();
  private pathMemo = new Map<string, RoadPath | null>();
  private regionMemo = new Map<string, Map<string, RoadCell>>();
  private degreeMemo = new Map<string, number>();
  readonly corr: (q: number, r: number) => CorridorInfo;
  stats: { paths: number; failed: number; relaxed: number; ms: number; expansions: number; fb?: number; fbOk?: number; maxOkExp?: number; failExp?: number; searchMs?: number; cellMs?: number; preps?: number; routes?: number } = { paths: 0, failed: 0, relaxed: 0, ms: 0, expansions: 0 };

  /** Terrain cell getter with a numeric-keyed reference cache (the world memo keys by string). */
  readonly get: CellGetter;
  constructor(readonly seed: number, getCell: CellGetter) {
    const cache = new Map<number, Readonly<CellData>>();
    this.get = (q, r) => {
      const key = (q + 0x8000) * 0x10000 + (r + 0x8000);
      let c = cache.get(key);
      if (c === undefined) {
        if (cache.size > 400000) cache.clear();
        const t0 = performance.now();
        c = getCell(q, r);
        this.stats.cellMs = (this.stats.cellMs ?? 0) + performance.now() - t0;
        cache.set(key, c);
      }
      return c;
    };
    this.sN = hash(seed, strSeed('roads.node'));
    this.sE = hash(seed, strSeed('roads.edge'));
    this.sC = hash(seed, strSeed('roads.cost'));
    this.corr = corridorFn(seed);
  }

  // ------------------------------------------------------------------ nodes
  node(i: number, j: number): RoadNode | null {
    const k = nkey(i, j);
    if (this.nodeMemo.has(k)) return this.nodeMemo.get(k)!;
    if (this.nodeMemo.size > MEMO_CAP) this.nodeMemo.clear();
    const fq = i * MACRO + (rand01(this.sN, i, j, 1) - 0.5) * 2 * JIT * MACRO;
    const fr = j * MACRO + (rand01(this.sN, i, j, 2) - 0.5) * 2 * JIT * MACRO;
    const h = hexRound(fq, fr);
    const ok = new Map<string, boolean>();
    const site = (q: number, r: number) => {
      const kk = q + ',' + r;
      let v = ok.get(kk);
      if (v === undefined) {
        const c = this.get(q, r);
        v = siteCell(c) && !this.corr(q, r).corridor;
        ok.set(kk, v);
      }
      return v;
    };
    let best: RoadNode | null = null;
    let bestScore = -1e9;
    // search ring by ring band: 0..3, then (if nothing) 4..5 (e.g. the jittered point fell into a river valley)
    for (const [R0, SR] of [[0, i === 0 && j === 0 ? 5 : 3], [4, 5]] as [number, number][]) {
    if (best) break;
    for (let dq = -SR; dq <= SR; dq++)
      for (let dr = Math.max(-SR, -dq - SR); dr <= Math.min(SR, -dq + SR); dr++) {
        const q = h.q + dq, r = h.r + dr;
        if (hexDistance(q, r, h.q, h.r) < R0 || !site(q, r)) continue;
        const L = this.get(q, r).level;
        let good = true;
        for (const [a, b] of DIRS) if (!site(q + a, r + b) || this.get(q + a, r + b).level !== L) { good = false; break; }
        if (!good) continue;
        // ring 2: no valley within 2 cells; count flat same-level cells (room for a village)
        let room = 0;
        for (let d = 0; d < 6; d++)
          for (let s = 0; s < 2; s++) {
            const a = DIRS[d], b = s ? DIRS[(d + 1) % 6] : DIRS[d];
            const qq = q + a[0] + b[0], rr = r + a[1] + b[1];
            if (this.corr(qq, rr).corridor) { good = false; break; }
            if (site(qq, rr) && this.get(qq, rr).level === L) room++;
          }
        if (!good) continue;
        const score = -0.45 * hexDistance(q, r, h.q, h.r) + 0.2 * room + 0.3 * rand01(this.sN, q, r, 3);
        if (score > bestScore) {
          bestScore = score;
          const p = cellXZ(q, r);
          best = { i, j, q, r, level: L, x: p.x, z: p.z };
        }
      }
    }
    this.nodeMemo.set(k, best);
    return best;
  }

  /** Edge weight (canonical, symmetric). */
  private weight(i: number, j: number, k: number): number {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    return i < i2 || (i === i2 && j < j2) ? rand01(this.sE, i, j, i2, j2) : rand01(this.sE, i2, j2, i, j);
  }

  /** Jittered macro point (cell units) before snapping — hash only, used where a node's exact cell is not needed. */
  basePoint(i: number, j: number): { x: number; z: number } {
    const fq = i * MACRO + (rand01(this.sN, i, j, 1) - 0.5) * 2 * JIT * MACRO;
    const fr = j * MACRO + (rand01(this.sN, i, j, 2) - 0.5) * 2 * JIT * MACRO;
    const w = hexToWorld(fq, fr);
    return { x: w.x / HEX_WIDTH, z: w.z / HEX_WIDTH };
  }

  // ---- hash-only lattice selection (no terrain dependency → shallow, cheap)
  private hwantMemo = new Map<string, number[]>();
  private hwants(i: number, j: number): number[] {
    const key = nkey(i, j);
    let w = this.hwantMemo.get(key);
    if (!w) {
      if (this.hwantMemo.size > MEMO_CAP) this.hwantMemo.clear();
      w = [0, 1, 2, 3, 4, 5].sort((a, b) => this.weight(i, j, a) - this.weight(i, j, b)).slice(0, 3);
      this.hwantMemo.set(key, w);
    }
    return w;
  }
  private hphaseA(i: number, j: number, k: number): boolean {
    return this.hwants(i, j).includes(k) && this.hwants(i + DIRS[k][0], j + DIRS[k][1]).includes((k + 3) % 6);
  }
  private hrescue(i: number, j: number): number[] {
    const key = nkey(i, j);
    let r = this.rescueMemo.get(key);
    if (r) return r;
    if (this.rescueMemo.size > MEMO_CAP) this.rescueMemo.clear();
    const all = [0, 1, 2, 3, 4, 5];
    const deg = all.filter((k) => this.hphaseA(i, j, k)).length;
    r = deg < 2 ? all.filter((k) => !this.hphaseA(i, j, k)).sort((a, b) => this.weight(i, j, a) - this.weight(i, j, b)).slice(0, 2 - deg) : [];
    this.rescueMemo.set(key, r);
    return r;
  }
  private hsel0(i: number, j: number, k: number): boolean {
    return this.hphaseA(i, j, k) || this.hrescue(i, j).includes(k) || this.hrescue(i + DIRS[k][0], j + DIRS[k][1]).includes((k + 3) % 6);
  }
  /** Hash-only selected lattice edge: both-want ∪ rescue, minus the heaviest edge of every fully selected triangle. */
  private hselT(i: number, j: number, k: number): boolean {
    if (!this.hsel0(i, j, k)) return false;
    const w = this.weight(i, j, k);
    const bi = i + DIRS[k][0], bj = j + DIRS[k][1];
    for (const s of [1, 5]) {
      const k2 = (k + s) % 6;
      const ci = i + DIRS[k2][0], cj = j + DIRS[k2][1];
      let kb = -1;
      for (let t = 0; t < 6; t++) if (bi + DIRS[t][0] === ci && bj + DIRS[t][1] === cj) kb = t;
      if (kb >= 0 && this.hsel0(i, j, k2) && this.hsel0(bi, bj, kb) && w > this.weight(i, j, k2) && w > this.weight(bi, bj, kb)) return false;
    }
    return true;
  }

  /** Hash-selected edge, capped to the MAX_DEG lightest per node (clean Y / T junctions). */
  hsel(i: number, j: number, k: number): boolean {
    return this.hselT(i, j, k) && this.capRank(i, j).includes(k) && this.capRank(i + DIRS[k][0], j + DIRS[k][1]).includes((k + 3) % 6);
  }
  private capMemo = new Map<string, number[]>();
  private capRank(i: number, j: number): number[] {
    const key = nkey(i, j);
    let c = this.capMemo.get(key);
    if (c) return c;
    if (this.capMemo.size > MEMO_CAP) this.capMemo.clear();
    c = [0, 1, 2, 3, 4, 5].filter((k) => this.hselT(i, j, k)).sort((a, b) => this.weight(i, j, a) - this.weight(i, j, b)).slice(0, MAX_DEG);
    this.capMemo.set(key, c);
    return c;
  }

  private feasMemo = new Map<string, boolean>();
  /**
   * Cheap reachability test for a lattice edge: BFS over passable cells inside an ellipse around the two nodes where
   * every step changes the level by at most one (a road ramp can bridge it). 2-level terraces are walls.
   */
  /** While true (prefetch steps only) sync wrappers throw Missing instead of computing routes inline. */
  strictCache = false;

  feasible(i: number, j: number, k: number): boolean {
    if (this.strictCache && !this.hasFeasible(i, j, k)) throw new Missing('feas', i, j, k);
    return drain(this.feasibleIter(i, j, k));
  }
  hasFeasible(i: number, j: number, k: number): boolean {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    return i < i2 || (i === i2 && j < j2) ? this.feasMemo.has(i + ',' + j + ',' + k) : this.feasMemo.has(i2 + ',' + j2 + ',' + ((k + 3) % 6));
  }
  *feasibleIter(i: number, j: number, k: number): Generator<void, boolean> {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    if (!(i < i2 || (i === i2 && j < j2))) return yield* this.feasibleIter(i2, j2, (k + 3) % 6);
    const key = i + ',' + j + ',' + k;
    let v = this.feasMemo.get(key);
    if (v !== undefined) return v;
    const a = this.node(i, j), b = this.node(i2, j2);
    v = !!a && !!b && (yield* this.bfsFeasible(a, b)) && !!(yield* this.routeIter(i, j, k, 'probe'));
    if (this.feasMemo.size > MEMO_CAP) this.feasMemo.clear();
    this.feasMemo.set(key, v);
    return v;
  }

  private bfsSeen: Uint32Array | null = null;
  private bfsStamp = 0;
  /** Cheap BFS (≤ 1 level per step, ellipse around the nodes) before the expensive probe route. */
  private *bfsFeasible(a: RoadNode, b: RoadNode): Generator<void, boolean> {
    const D = hexDistance(a.q, a.r, b.q, b.r) + 5;
    // every visited cell lies within D of a (ellipse test) → a (2D+1)² box around a, stamped
    const BW = 2 * D + 1;
    if (!this.bfsSeen || this.bfsSeen.length < BW * BW) this.bfsSeen = new Uint32Array(Math.max(BW * BW, 4096));
    const seenA = this.bfsSeen;
    const stamp = ++this.bfsStamp;
    const bid = (q: number, r: number) => (q - a.q + D) * BW + (r - a.r + D);
    seenA[bid(a.q, a.r)] = stamp;
    const Q: [number, number, number][] = [[a.q, a.r, a.level]];
    for (let h = 0; h < Q.length; h++) {
      if (h % 400 === 399) {
        // resumable: another BFS may run while this one is suspended → re-stamp the visited cells after the yield
        yield;
        if (this.bfsSeen !== seenA || this.bfsStamp !== stamp) return yield* this.bfsFeasible(a, b);
      }
      const [q, r, L] = Q[h];
      for (const [dq, dr] of DIRS) {
        const nq = q + dq, nr = r + dr;
        if (nq === b.q && nr === b.r) return true;
        if (hexDistance(nq, nr, a.q, a.r) + hexDistance(nq, nr, b.q, b.r) > D) continue;
        const kk = bid(nq, nr);
        if (seenA[kk] === stamp) continue;
        seenA[kk] = stamp;
        const n = this.get(nq, nr);
        if (!passable(n) || Math.abs(n.level - L) > 1) continue;
        Q.push([nq, nr, n.level]);
      }
    }
    return false;
  }

  /** Selected edge whose nodes exist and that looks routable. */
  private ok(i: number, j: number, k: number): boolean {
    return this.hsel(i, j, k) && !!this.node(i, j) && !!this.node(i + DIRS[k][0], j + DIRS[k][1]) && this.feasible(i, j, k);
  }

  private okDeg(i: number, j: number): number {
    let d = 0;
    for (let k = 0; k < 6; k++) if (this.ok(i, j, k)) d++;
    return d;
  }

  /** Terrain left a node with < 2 roads: add its lightest routable lattice edges (towns never sit at a dead end). */
  private rescue2Memo = new Map<string, number[]>();
  private rescue2(i: number, j: number): number[] {
    const key = nkey(i, j);
    let r = this.rescue2Memo.get(key);
    if (r) return r;
    if (this.rescue2Memo.size > MEMO_CAP) this.rescue2Memo.clear();
    r = [];
    if (this.node(i, j)) {
      const deg = [0, 1, 2, 3, 4, 5].filter((k) => this.ok(i, j, k)).length;
      // the origin node is always a crossing (the demo spawns in the nearest village): a clean 3-way Y
      const origin = i === 0 && j === 0;
      const want = origin ? 3 : 2;
      if (deg < want)
        r = [0, 1, 2, 3, 4, 5]
          .filter((k) => !this.ok(i, j, k) && this.node(i + DIRS[k][0], j + DIRS[k][1]) && this.feasible(i, j, k) && (origin || this.okDeg(i + DIRS[k][0], j + DIRS[k][1]) < MAX_DEG))
          .sort((a, b) => this.weight(i, j, a) - this.weight(i, j, b))
          .slice(0, want - deg);
    }
    this.rescue2Memo.set(key, r);
    return r;
  }

  /** Kept lattice directions of node (i, j). */
  keptDirs(i: number, j: number): number[] {
    const key = nkey(i, j);
    let out = this.keptMemo.get(key);
    if (out) return out;
    if (this.keptMemo.size > MEMO_CAP) this.keptMemo.clear();
    out = [];
    if (this.node(i, j))
      for (let k = 0; k < 6; k++) {
        const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
        if (this.cand(i, j, k)) out.push(k);
      }
    this.keptMemo.set(key, out);
    return out;
  }

  private cand(i: number, j: number, k: number): boolean {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    return this.ok(i, j, k) || this.rescue2(i, j).includes(k) || (!!this.node(i2, j2) && this.rescue2(i2, j2).includes((k + 3) % 6));
  }

  /** Hex edge (port) each kept lattice direction leaves the node through. */
  ports(i: number, j: number): Map<number, number> {
    const key = nkey(i, j);
    let pm = this.portMemo.get(key);
    if (pm) return pm;
    if (this.portMemo.size > MEMO_CAP) this.portMemo.clear();
    pm = new Map();
    const n = this.node(i, j);
    const ks = this.keptDirs(i, j);
    if (n && ks.length) {
      const bs = ks.map((k) => {
        const o = this.node(i + DIRS[k][0], j + DIRS[k][1])!;
        return bearing(o.x - n.x, o.z - n.z);
      });
      const deg = ks.length;
      // a port whose forward cells (beyond the ring) don't continue at the node level leads into a wall
      const portBad = [0, 1, 2, 3, 4, 5].map((p) => {
        const pq = n.q + DIRS[p][0], pr = n.r + DIRS[p][1];
        let flat = 0;
        for (const t of [p, (p + 1) % 6, (p + 5) % 6]) {
          const f = this.get(pq + DIRS[t][0], pr + DIRS[t][1]);
          if (passable(f) && f.level === n.level && !f.slope) flat++;
        }
        return flat === 0 ? 40 : flat === 1 ? 2 : 0;
      });
      let best: number[] = [];
      let bestCost = Infinity;
      const cur: number[] = [];
      const used = new Array(6).fill(false);
      const rec = (idx: number, cost: number) => {
        if (cost >= bestCost) return;
        if (idx === deg) {
          bestCost = cost;
          best = cur.slice();
          return;
        }
        for (let p = 0; p < 6; p++) {
          if (used[p]) continue;
          const dv = cdiffF(p, bs[idx]);
          let c = cost + dv * dv + Math.max(0, dv - 1.1) * 8 + portBad[p];
          for (let t = 0; t < idx; t++) {
            const dd = cdiff(p, cur[t]);
            if (dd === 1) c += deg === 2 ? 60 : deg === 3 ? 40 : 1.5; // Y junctions: ports 120° apart
          }
          used[p] = true;
          cur.push(p);
          rec(idx + 1, c);
          cur.pop();
          used[p] = false;
        }
      };
      rec(0, 0);
      ks.forEach((k, t) => pm!.set(k, best[t]));
    }
    this.portMemo.set(key, pm);
    return pm;
  }

  /**
   * Notch ramp (terrain's pocket rule): an UPPER cell U (level H) is lowered to H−1 and rises toward s. Its high edge
   * s and flanks s±1 must be plateau at ≥ H (full-height walls hide the ramp's sides), s±2 preferably H (else H−1),
   * the foot s+3 is the road cell before it at H−1. Nothing around may be water or lower than H−1.
   */
  /**
   * TONGUE road ramp (terrain's ramp rule since whole-game critic r2): a LOWER cell at L rises toward s; ONLY s is at
   * L+1 (flat, passable); the flanks s±1, s±2 and the approach s+3 stay at L (flat, dry), so the ramp leans against
   * a straight cliff and terrain's embankments on the flank cells meet its side edges (no partial-height dirt walls).
   */
  private tongueCost(q: number, r: number, s: number, L: number): number {
    let c = 3.5;
    for (let dd = 0; dd < 6; dd++) {
      const e = (s + dd) % 6;
      const n = this.get(q + DIRS[e][0], r + DIRS[e][1]);
      if (dd === 0) {
        if (n.level !== L + 1 || n.slope || !passable(n)) return Infinity;
        continue;
      }
      if (dd === 3) {
        if (n.level !== L || n.slope || !passable(n)) return Infinity;
        continue;
      }
      if (n.water || n.coastMask || n.level !== L || n.slope) return Infinity;
    }
    // the cliff continues on both sides of s (a straight edge, not a lone pillar): s±1's other neighbours
    return c;
  }

  notchCost(q: number, r: number, s: number, H: number): number {
    // notch (pocket) ramps cut V-notches into the plateau edge: costly fallback only
    let c = 3 + (DEBUG.pocket ? 0 : RAMP_FALLBACK);
    for (let dd = 0; dd < 6; dd++) {
      if (dd === 3) {
        // approach cell: the road arrives straight from here
        const f = this.get(q + DIRS[(s + 3) % 6][0], r + DIRS[(s + 3) % 6][1]);
        if (f.level !== H - 1 || f.slope || !passable(f)) return Infinity;
        continue;
      }
      const e = (s + dd) % 6;
      const n = this.get(q + DIRS[e][0], r + DIRS[e][1]);
      if (n.water || n.coastMask) return Infinity;
      if (dd === 0) {
        if (n.level !== H || n.slope || !passable(n)) return Infinity;
      } else if (dd === 1 || dd === 5) {
        if (DEBUG.loose1 && n.level === H - 1 && !n.slope) { c += 3; continue; }
        if (n.level < H || n.slope) return Infinity;
        if (n.level > H) c += 1;
      } else {
        if (n.level < H - 1) return Infinity;
        if (n.level === H - 1) c += 2.5;
        else if (n.level > H) c += 1;
        if (n.slope) c += 2;
      }
    }
    return c;
  }
  /**
   * Foot-cell ramp (assets' rule): a LOWER cell at L rises toward s; its flanks s±1 must be at ≥ L+1 (walls hide the
   * ramp's raised sides), s±2 at L or L+1, nothing lower than L, s at L+1.
   */
  footCost(q: number, r: number, s: number, L: number): number {
    // tongue ramps first; the old foot rule (flanks s±1 high: partial-height walls beside the ramp) only as a costly
    // fallback so the network keeps its reach (tongue-only lost 60 % of the roads)
    const tc = DEBUG.pocket ? Infinity : this.tongueCost(q, r, s, L);
    if (tc < Infinity) return tc;
    let c = 3.5 + (DEBUG.pocket ? 0 : RAMP_FALLBACK);
    for (let dd = 0; dd < 6; dd++) {
      if (dd === 3) {
        const f = this.get(q + DIRS[(s + 3) % 6][0], r + DIRS[(s + 3) % 6][1]);
        if (f.level !== L || f.slope || !passable(f)) return Infinity;
        continue;
      }
      const e = (s + dd) % 6;
      const n = this.get(q + DIRS[e][0], r + DIRS[e][1]);
      if (n.water || n.coastMask) return Infinity;
      if (dd === 0) {
        if (n.level !== L + 1 || n.slope || !passable(n)) return Infinity;
      } else if (dd === 1 || dd === 5) {
        if (DEBUG.oldRamp && n.level >= L && n.level < L + 1) { c += 2; continue; }
        if (n.level < L + 1) return Infinity;
        if (n.level > L + 1 || n.slope) c += 1;
      } else {
        if (DEBUG.oldRamp && n.level >= L) { c += 1; continue; }
        if (n.level < L || n.level > L + 1) return Infinity;
        if (n.level === L) c += 2.5; // pocket (s±2 high) hides the ramp's side triangles
        if (n.slope) c += 2;
      }
    }
    return c;
  }

  /** notchCost (kind 0) / footCost (kind 1), memoised per (cell, direction, level): pure terrain functions. */
  private rampMemo = new Map<number, number>();
  private rampCost(kind: number, q: number, r: number, s: number, L: number): number {
    const key = (((q + 0x8000) * 0x10000 + (r + 0x8000)) * 16 + kind * 8 + s) * 64 + (L + 32);
    let v = this.rampMemo.get(key);
    if (v === undefined) {
      if (this.rampMemo.size > 400000) this.rampMemo.clear();
      v = kind === 0 ? this.notchCost(q, r, s, L) : this.footCost(q, r, s, L);
      this.rampMemo.set(key, v);
    }
    return v;
  }

  /** Terrain-only part of a road cell's cost (shared by every route; memoised). */
  private scMemo = new Map<number, { k: number; corr: boolean }>();
  private staticCost(q: number, r: number): { k: number; corr: boolean } {
    const key = (q + 0x8000) * 0x10000 + (r + 0x8000);
    let v = this.scMemo.get(key);
    if (v) return v;
    if (this.scMemo.size > 200000) this.scMemo.clear();
    const c = this.get(q, r);
    const p = cellXZ(q, r);
    let k = 1 + 1.5 * ((fbm2(this.sC, p.x / 8, p.z / 8, 2) + 1) / 2) + 0.8 * c.forest;
    let shore = false, cliff = false, rampNb = false;
    for (const [dq, dr] of DIRS) {
      const n = this.get(q + dq, r + dr);
      if (n.water || n.coastMask) shore = true;
      else if (n.level !== c.level && !n.slope && !c.slope) cliff = true;
      if (n.slope && !c.slope) rampNb = true;
    }
    if (shore) k += 0.6;
    if (rampNb) k += 1.5;
    if (cliff) k += 0.25;
    const corr = this.corr(q, r).corridor;
    if (corr && !DEBUG.noCorr) k += 3.5;
    v = { k, corr };
    this.scMemo.set(key, v);
    return v;
  }

  // ------------------------------------------------------------------ routing
  /** Routed path of lattice edge (i, j) → direction k (canonical cache; null if unroutable or not kept). */
  hasPath(i: number, j: number, k: number): boolean {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    return i < i2 || (i === i2 && j < j2) ? this.pathMemo.has(i + ',' + j + ',' + k) : this.pathMemo.has(i2 + ',' + j2 + ',' + ((k + 3) % 6));
  }

  /**
   * Cells a route of lattice edge (i, j, k) will read (axial box around the two node points) — the prefetcher warms
   * terrain for them in small time slices so the route itself never computes terrain cold.
   */
  *routeCells(i: number, j: number, k: number): Generator<[number, number]> {
    const a = this.node(i, j), b = this.node(i + DIRS[k][0], j + DIRS[k][1]);
    if (!a || !b) return;
    const P = 7;
    for (let q = Math.min(a.q, b.q) - P; q <= Math.max(a.q, b.q) + P; q++)
      for (let r = Math.min(a.r, b.r) - P; r <= Math.max(a.r, b.r) + P; r++) {
        const p = cellXZ(q, r);
        if (segDist(p.x, p.z, a.x, a.z, b.x, b.z) <= HALF_W + 6) yield [q, r]; // widest corridor + 2 (ramp-cost reads)
      }
  }

  path(i: number, j: number, k: number): RoadPath | null {
    if (this.strictCache && !this.hasPath(i, j, k)) throw new Missing('path', i, j, k);
    return drain(this.pathIter(i, j, k));
  }
  *pathIter(i: number, j: number, k: number): Generator<void, RoadPath | null> {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    if (!(i < i2 || (i === i2 && j < j2))) return yield* this.pathIter(i2, j2, (k + 3) % 6);
    const key = i + ',' + j + ',' + k;
    if (this.pathMemo.has(key)) return this.pathMemo.get(key)!;
    let res: RoadPath | null = null;
    if (this.keptDirs(i, j).includes(k)) {
      res = (yield* this.indepIter(i, j, k)) ?? (yield* this.fallbackIter(i, j, k, 2));
      if (!this.pathMemo.has(key)) {
        this.stats.paths++;
        if (!res) this.stats.failed++;
        else if (!res.strict) this.stats.relaxed++;
      }
    }
    if (this.pathMemo.size > MEMO_CAP) this.pathMemo.clear();
    this.pathMemo.set(key, res);
    return res;
  }

  /** Route that depends only on terrain + selection (strict, then relaxed Voronoi). Canonical key only. */
  private indepMemo = new Map<string, RoadPath | null>();
  private *indepIter(i: number, j: number, k: number): Generator<void, RoadPath | null> {
    const key = i + ',' + j + ',' + k;
    if (this.indepMemo.has(key)) return this.indepMemo.get(key)!;
    const r = yield* this.routeIter(i, j, k, 'strict');
    if (this.indepMemo.size > MEMO_CAP) this.indepMemo.clear();
    this.indepMemo.set(key, r);
    return r;
  }

  /**
   * Last resort: no Voronoi corridor, but keep ≥ 1 cell away from every neighbouring road that is already decided
   * (independent routes, and fallback routes of higher-priority = lighter edges). Pure: the recursion only follows
   * strictly lighter edges.
   */
  private fbMemo = new Map<string, RoadPath | null>();
  private fb1Memo = new Map<string, RoadPath | null>();
  /** level 2: avoids strict routes + level-1 fallbacks of lighter neighbours; level 1: avoids strict routes only. */
  private *fallbackIter(i: number, j: number, k: number, level: number): Generator<void, RoadPath | null> {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    if (!(i < i2 || (i === i2 && j < j2))) return yield* this.fallbackIter(i2, j2, (k + 3) % 6, level);
    const key = i + ',' + j + ',' + k;
    const memo = level === 2 ? this.fbMemo : this.fb1Memo;
    if (memo.has(key)) return memo.get(key)!;
    // (no cycle guard needed: level 2 reads only level-1 fallbacks, level 1 only strict routes)
    const w = this.weight(i, j, k);
    const a = this.node(i, j)!, b = this.node(i2, j2)!;
    const avoid = new Set<number>();
    const ring = new Set<number>();
    for (const n of [a, b])
      for (const [t, p] of this.ports(n.i, n.j)) {
        if ((n === a && t === k) || (n === b && t === (k + 3) % 6)) continue;
        ring.add(ckey(n.q + DIRS[p][0], n.r + DIRS[p][1]));
      }
    const seen = new Set<string>();
    const nodesAround: RoadNode[] = [a, b];
    for (const n of [a, b])
      for (let t = 0; t < 6; t++) {
        const o = this.node(n.i + DIRS[t][0], n.j + DIRS[t][1]);
        if (o && !nodesAround.includes(o)) nodesAround.push(o);
      }
    for (const n of nodesAround)
      for (const t of this.keptDirs(n.i, n.j)) {
        const ni = n.i + DIRS[t][0], nj = n.j + DIRS[t][1];
        const ck = n.i < ni || (n.i === ni && n.j < nj) ? n.i + ',' + n.j + ',' + t : ni + ',' + nj + ',' + ((t + 3) % 6);
        if (seen.has(ck) || ck === key) continue;
        seen.add(ck);
        const [ci, cj, ckk] = ck.split(',').map(Number);
        const p = (yield* this.indepIter(ci, cj, ckk)) ?? (level === 2 && this.weight(ci, cj, ckk) < w ? yield* this.fallbackIter(ci, cj, ckk, 1) : null);
        if (!p) continue;
        for (const st of p.steps) {
          const dn = Math.min(hexDistance(st.q, st.r, a.q, a.r), hexDistance(st.q, st.r, b.q, b.r));
          if (dn === 1) ring.add(ckey(st.q, st.r));
          if (dn <= 1) continue;
          avoid.add(ckey(st.q, st.r));
          if (dn <= 2) continue; // next to our own nodes only the road cells themselves are off limits
          for (const [dq, dr] of DIRS) avoid.add(ckey(st.q + dq, st.r + dr));
        }
      }
    // free ports: also keep 120° from every other road at the node (no 60° forks with a thin grass lens)
    const ring2 = new Set(ring);
    for (const n of [a, b])
      for (let d = 0; d < 6; d++) {
        const rq = n.q + DIRS[d][0], rr = n.r + DIRS[d][1];
        if (!ring.has(ckey(rq, rr))) continue;
        for (const e of [(d + 1) % 6, (d + 5) % 6]) ring2.add(ckey(n.q + DIRS[e][0], n.r + DIRS[e][1]));
      }
    const r = (yield* this.routeIter(i, j, k, 'fallback', DEBUG.noAvoid ? new Set() : avoid))
      ?? (yield* this.routeIter(i, j, k, 'free', new Set([...avoid, ...ring2])))
      ?? (yield* this.routeIter(i, j, k, 'free', new Set([...avoid, ...ring])));
    if (!memo.has(key)) {
      this.stats.fb = (this.stats.fb ?? 0) + 1;
      if (r) this.stats.fbOk = (this.stats.fbOk ?? 0) + 1;
    }
    if (memo.size > MEMO_CAP) memo.clear();
    memo.set(key, r);
    return r;
  }

  route(i: number, j: number, k: number, mode: 'strict' | 'relaxed' | 'fallback' | 'probe' | 'free', avoid?: Set<number>): RoadPath | null {
    return drain(this.routeIter(i, j, k, mode, avoid));
  }

  private *routeIter(i: number, j: number, k: number, mode: 'strict' | 'relaxed' | 'fallback' | 'probe' | 'free', avoid?: Set<number>): Generator<void, RoadPath | null> {
    const strict = mode === 'strict';
    const probe = mode === 'probe';
    const anyEnd = probe || mode === 'free';
    const a = this.node(i, j)!;
    const b = this.node(i + DIRS[k][0], j + DIRS[k][1])!;
    const pa = anyEnd ? 0 : this.ports(i, j).get(k)!;
    const pb = anyEnd ? 0 : this.ports(b.i, b.j).get((k + 3) % 6)!;
    const halfW = DEBUG.wide ? 30 : strict ? HALF_W : probe ? HALF_W + 1.5 : HALF_W + 3;
    const margin = strict ? MARGIN : 0;

    // neighbouring kept segments and nodes
    const segs: [number, number, number, number][] = [];
    const others: RoadNode[] = [];
    const seen = new Set<number>();
    const around = [a, b];
    for (const n of [a, b])
      for (let t = 0; t < 6; t++) {
        const o = this.node(n.i + DIRS[t][0], n.j + DIRS[t][1]);
        if (o && o !== a && o !== b && !others.includes(o)) others.push(o);
      }
    // a and b: their real kept edges; neighbours: hash-selected edges, far endpoints at their hash base point
    const addSeg = (i1: number, j1: number, i2: number, j2: number, p1: { x: number; z: number }, p2: { x: number; z: number }) => {
      const sk = i1 < i2 || (i1 === i2 && j1 < j2) ? ((i1 + 512) * 1024 + (j1 + 512)) * 1048576 + (i2 + 512) * 1024 + (j2 + 512) : ((i2 + 512) * 1024 + (j2 + 512)) * 1048576 + (i1 + 512) * 1024 + (j1 + 512);
      if (seen.has(sk)) return;
      seen.add(sk);
      if ((i1 === a.i && j1 === a.j && i2 === b.i && j2 === b.j) || (i2 === a.i && j2 === a.j && i1 === b.i && j1 === b.j)) return;
      segs.push([p1.x, p1.z, p2.x, p2.z]);
    };
    const near = (i2: number, j2: number) => this.node(i2, j2);
    if (!probe) for (const n of around)
      for (const t of this.keptDirs(n.i, n.j)) {
        const o = this.node(n.i + DIRS[t][0], n.j + DIRS[t][1])!;
        addSeg(n.i, n.j, o.i, o.j, n, o);
      }
    if (!probe) for (const n of others)
      for (let t = 0; t < 6; t++) {
        const i2 = n.i + DIRS[t][0], j2 = n.j + DIRS[t][1];
        const o2 = this.hsel(n.i, n.j, t) ? near(i2, j2) : null;
        if (o2) addSeg(n.i, n.j, i2, j2, n, o2);
      }
    yield;
    const portsA = probe ? [] : [...this.ports(a.i, a.j).values()];
    const portsB = probe ? [] : [...this.ports(b.i, b.j).values()];

    const qmin = Math.min(a.q, b.q) - PAD, qmax = Math.max(a.q, b.q) + PAD;
    const rmin = Math.min(a.r, b.r) - PAD, rmax = Math.max(a.r, b.r) + PAD;
    const W = qmax - qmin + 1, H = rmax - rmin + 1;
    const N = W * H;
    // scratch buffers from a pool, stamped instead of cleared (a route abandoned mid-search just drops its set)
    const scr = acquireScratch(N * 48);
    this.stats.routes = (this.stats.routes ?? 0) + 1;
    try {
    const { allowed, cost, lvl, sdir, ssteps, inCorr, gbear, cstamp } = scr;
    const CS = scr.stamp;
    const idx = (q: number, r: number) => (q < qmin || q > qmax || r < rmin || r > rmax ? -1 : (r - rmin) * W + (q - qmin));

    const sectorOk = (n: RoadNode, ports: number[], p: number, q: number, r: number): boolean => {
      const dist = hexDistance(q, r, n.q, n.r);
      if (dist > NEAR) return true;
      if (dist === 0) return false;
      if (dist === 1) return q === n.q + DIRS[p][0] && r === n.r + DIRS[p][1];
      const c = cellXZ(q, r);
      const bb = bearing(c.x - n.x, c.z - n.z);
      const own = cdiffF(bb, p);
      if (!strict) {
        // relaxed: only keep clear of the other roads' port cells and their straight continuation
        if (dist > 2 || mode === 'fallback') return true;
        for (const o of ports) if (o !== p && cdiffF(bb, o) < 0.5) return false;
        return true;
      }
      for (const o of ports) if (o !== p && cdiffF(bb, o) < own + 0.25) return false;
      return own <= 1.0;
    };

    const prep = (q: number, r: number, id: number): boolean => {
      cstamp[id] = CS;
      allowed[id] = 2;
      if (avoid && avoid.has(ckey(q, r))) return false;
      const p = cellXZ(q, r);
      const d = segDist(p.x, p.z, a.x, a.z, b.x, b.z);
      if (d > halfW) return false; // (before the terrain read: cells outside the corridor are never read)
      const c = this.get(q, r);
      if (!passable(c)) return false;
      if (!DEBUG.wide) for (const o of others) if (hexDistance(q, r, o.q, o.r) <= 2) return false;
      const nearA = hexDistance(q, r, a.q, a.r) <= NEAR, nearB = hexDistance(q, r, b.q, b.r) <= NEAR;
      if (!anyEnd && !DEBUG.noSector && nearA && !sectorOk(a, portsA, pa, q, r)) return false;
      if (!anyEnd && !DEBUG.noSector && nearB && !sectorOk(b, portsB, pb, q, r)) return false;
      if (DEBUG.noSector && (q === a.q && r === a.r || q === b.q && r === b.r)) return false;
      let soft = 0;
      if (!nearA && !nearB)
        for (const s of segs) {
          // exact skip: the distance to the segment's bounding box is a lower bound of the distance to the segment;
          // when it clears the soft band (MARGIN + 0.4 ≥ margin) neither test below can fire
          const lx = Math.max(0, Math.min(s[0], s[2]) - p.x, p.x - Math.max(s[0], s[2]));
          const lz = Math.max(0, Math.min(s[1], s[3]) - p.z, p.z - Math.max(s[1], s[3]));
          const lim = d + MARGIN + 0.4 + 1e-6;
          if (lx * lx + lz * lz > lim * lim) continue;
          const ds = segDist(p.x, p.z, s[0], s[1], s[2], s[3]);
          if (mode === 'strict' && d + margin > ds) return false;
          if (d + MARGIN + 0.4 > ds) soft = Math.max(soft, 3 * (d + MARGIN + 0.4 - ds));
        }
      const sc = this.staticCost(q, r);
      cost[id] = sc.k + soft + 0.06 * d * d;
      inCorr[id] = sc.corr && !DEBUG.noCorr ? 1 : 0;
      lvl[id] = DEBUG.noLevels ? 0 : c.level;
      if (c.slope && !DEBUG.noLevels) {
        sdir[id] = c.slope.dir;
        ssteps[id] = c.slope.steps;
      } else {
        sdir[id] = -1;
        ssteps[id] = 0;
      }
      gbear[id] = q === PB.q && r === PB.r ? -1 : bearing(PBxz.x - p.x, PBxz.z - p.z);
      allowed[id] = 1;
      return true;
    };
    const ok = (q: number, r: number, id: number) => (cstamp[id] !== CS ? prep(q, r, id) : allowed[id] === 1);
    const levelAt = (q: number, r: number) => {
      const id = idx(q, r);
      if (id >= 0 && cstamp[id] === CS && allowed[id] === 1) return lvl[id];
      return this.get(q, r).level;
    };
    const notchCost = (q: number, r: number, sd: number, H: number) => this.rampCost(0, q, r, sd, H);
    const footCost = (q: number, r: number, sd: number, L: number) => this.rampCost(1, q, r, sd, L);
    const PA = anyEnd ? { q: a.q, r: a.r } : { q: a.q + DIRS[pa][0], r: a.r + DIRS[pa][1] };
    const goalDir = (pb + 3) % 6;
    const PB = anyEnd ? { q: b.q, r: b.r } : { q: b.q + DIRS[pb][0], r: b.r + DIRS[pb][1] };
    const PBxz = cellXZ(PB.q, PB.r);
    const sA = idx(PA.q, PA.r), sB = idx(PB.q, PB.r);
    if (DEBUG.trace) DEBUG.trace.push(['start', PA, PB, sA, sB, sA >= 0 && ok(PA.q, PA.r, sA), sB >= 0 && ok(PB.q, PB.r, sB)]);
    if (sA < 0 || sB < 0 || !ok(PA.q, PA.r, sA) || !ok(PB.q, PB.r, sB)) return null;
    if (!DEBUG.noLevels && (lvl[sA] !== a.level || lvl[sB] !== b.level || sdir[sA] >= 0 || sdir[sB] >= 0)) return null;

    // modes: 0 flat · 1/2 notch ramp up/down · 3/4 terrain ramp up/down · 5 flat right after a ramp (straight) · 6/7 foot ramp up/down
    const M = 8;
    const NS = N * 6 * M;
    const { g, parent, gstamp, closed, heap } = scr;
    for (let p0 = 0; p0 < 6; p0++) {
      if (!anyEnd && p0 !== pa) continue;
      const st0 = sA * 48 + p0 * M;
      g[st0] = cost[sA];
      gstamp[st0] = CS;
      parent[st0] = -1;
      heap.push(g[st0] + hexDistance(PA.q, PA.r, PB.q, PB.r), st0);
    }
    let goal = -1;
    let exp = 0;
    // successful routes need < 2 000 expansions (measured max 1 647); a route still searching at 20 000 is failing
    const maxExp = 20000;
    // the search itself runs in plain (non-generator) closures, sliced by SLICE expansions (same order as before)
    const relax = (ni: number, d: number, nm: number, c: number, s: number, hN: number, nq: number, nr: number) => {
      const ns = ni * 48 + d * M + nm;
      if (DEBUG.trace && nm !== 0) DEBUG.trace.push([nq, nr, d, nm, +c.toFixed(1)]);
      if (c < (gstamp[ns] === CS ? g[ns] : Infinity) && closed[ns] !== CS) {
        g[ns] = c;
        gstamp[ns] = CS;
        parent[ns] = s;
        heap.push(c + hN, ns);
      }
    };
    const PBq = PB.q, PBr = PB.r;
    const expand = (s: number): boolean => {
      const ci = Math.floor(s / 48), m = Math.floor((s % 48) / M), mode = s % M;
      const cq = qmin + (ci % W), cr = rmin + Math.floor(ci / W);
      const L = lvl[ci];
      const h = mode === 2 ? L - 1 : mode === 3 ? L + ssteps[ci] : mode === 6 ? L + 1 : L;
      if (ci === sB && (DEBUG.noLevels || h === b.level) && (anyEnd ? mode === 0 : mode === 0 ? cdiff(goalDir, m) <= 1 : mode === 5 && m === goalDir)) return true;
      const nd = mode === 0 ? 3 : 1;
      const flatLike = mode === 0 || mode === 5;
      const gs = g[s];
      for (let di = 0; di < nd; di++) {
        const d = di === 0 ? m : di === 1 ? (m + 1) % 6 : (m + 5) % 6;
        const nq = cq + DQ[d], nr = cr + DR[d];
        const ni = idx(nq, nr);
        if (ni < 0 || !ok(nq, nr, ni)) continue;
        // heading cost: discourages loops / U-turns (deviation from the bearing to the goal, hex units)
        const gb = gbear[ni];
        let dev = 0;
        if (gb >= 0) {
          const dd = (((d - gb) % 6) + 6) % 6;
          dev = Math.min(dd, 6 - dd);
        }
        const base = gs + cost[ni] + 0.12 * dev * dev + (d !== m ? 0.6 + (inCorr[ci] || inCorr[ni] ? 8 : 0) : 0);
        const hq = nq - PBq, hr = nr - PBr;
        const hN = (Math.abs(hq) + Math.abs(hr) + Math.abs(hq + hr)) / 2;
        const nl = lvl[ni];
        if (sdir[ni] >= 0) {
          const sd = sdir[ni];
          if (d === sd && h === nl) relax(ni, d, 3, base + 1, s, hN, nq, nr);
          else if (d === (sd + 3) % 6 && h === nl + ssteps[ni]) relax(ni, d, 4, base + 1, s, hN, nq, nr);
          continue;
        }
        if (nl === h) {
          relax(ni, d, 0, base, s, hN, nq, nr);
          // foot ramp up: this cell stays at h and rises toward the next (h+1)
          if (flatLike && !inCorr[ni] && levelAt(nq + DQ[d], nr + DR[d]) === nl + 1) {
            const rc = footCost(nq, nr, d, nl);
            if (rc < Infinity) relax(ni, d, 6, base + rc, s, hN, nq, nr);
          }
          // notch ramp down: this cell drops to h−1, the next one is at h−1
          if (flatLike && !inCorr[ni] && levelAt(nq + DQ[d], nr + DR[d]) === nl - 1) {
            const rc = notchCost(nq, nr, (d + 3) % 6, nl);
            if (rc < Infinity) relax(ni, d, 2, base + rc, s, hN, nq, nr);
          }
        } else if (nl === h - 1 && flatLike && !inCorr[ni]) {
          // foot ramp down: this lower cell rises back toward where we came from
          const rc = footCost(nq, nr, (d + 3) % 6, nl);
          if (rc < Infinity) relax(ni, d, 7, base + rc, s, hN, nq, nr);
        } else if (nl === h + 1 && flatLike && !inCorr[ni]) {
          // notch ramp up: this upper cell drops to h and rises toward d
          const rc = notchCost(nq, nr, d, nl);
          if (rc < Infinity) relax(ni, d, 1, base + rc, s, hN, nq, nr);
        }
      }
      return false;
    };
    let pend = -1;
    /** 0 = paused after SLICE expansions (the popped state is expanded on resume), 1 = finished */
    const slice = (): number => {
      for (;;) {
        let s: number;
        if (pend >= 0) {
          s = pend;
          pend = -1;
        } else {
          if (!(heap.size && exp < maxExp)) return 1;
          s = heap.pop();
          if (closed[s] === CS) continue;
          closed[s] = CS;
          exp++;
          if (exp % SLICE === 0) {
            pend = s;
            return 0;
          }
        }
        if (expand(s)) {
          goal = s;
          return 1;
        }
      }
    };
    for (;;) {
      const t0 = performance.now();
      const st = slice();
      this.stats.searchMs = (this.stats.searchMs ?? 0) + performance.now() - t0;
      if (st !== 0) break;
      yield;
    }
    this.stats.expansions += exp;
    if (DEBUG.trace) DEBUG.trace.push(['exp', exp, 'goal', goal]);
    if (goal >= 0) this.stats.maxOkExp = Math.max(this.stats.maxOkExp ?? 0, exp);
    else this.stats.failExp = (this.stats.failExp ?? 0) + exp;
    if (goal < 0) return null;
    const steps: PathStep[] = [];
    for (let s = goal; s >= 0; s = parent[s]) {
      const ci = Math.floor(s / 48);
      const md = s % M;
      steps.push({ q: qmin + (ci % W), r: rmin + Math.floor(ci / W), mode: md === 5 ? 0 : md, dir: Math.floor((s % 48) / M) });
    }
    steps.reverse();
    // no loops: two non-consecutive cells of one road never touch
    if (probe) return { a, b, steps, strict: false };
    // no switchbacks: a road may not be much longer than the straight line between its nodes
    if (steps.length > (mode === 'free' ? 1.7 : 1.35) * hexDistance(a.q, a.r, b.q, b.r) + 3) return null;
    // no doubling back: the heading may not turn by more than 120° within any 5 consecutive moves
    {
      const turns: number[] = [];
      for (let t = 2; t < steps.length; t++) turns.push(((steps[t].dir - steps[t - 1].dir + 9) % 6) - 3);
      for (let t = 0; t < turns.length; t++) {
        let sum = 0;
        for (let u = t; u < Math.min(turns.length, t + 5); u++) {
          sum += turns[u];
          if (Math.abs(sum) > 2) return null;
        }
      }
    }
    if (!DEBUG.noLoop) for (let x = 0; x < steps.length; x++)
      for (let y = x + 2; y < steps.length; y++) if (hexDistance(steps[x].q, steps[x].r, steps[y].q, steps[y].r) <= 1) return null;
    if (!anyEnd) {
      steps.unshift({ q: a.q, r: a.r, mode: 0, dir: (pa + 3) % 6 });
      steps.push({ q: b.q, r: b.r, mode: 0, dir: goalDir });
    }
    return { a, b, steps, strict };
    } finally {
      releaseScratch(scr);
    }
  }

  // ------------------------------------------------------------------ second generation (repair after routing)
  /** Roads that actually routed at node (i, j) in generation 1. */
  private deg1Memo = new Map<string, number>();
  deg1(i: number, j: number): number {
    const key = nkey(i, j);
    let d = this.deg1Memo.get(key);
    if (d !== undefined) return d;
    if (this.deg1Memo.size > MEMO_CAP) this.deg1Memo.clear();
    d = 0;
    if (this.node(i, j)) for (const k of this.keptDirs(i, j)) if (this.path(i, j, k)) d++;
    this.deg1Memo.set(key, d);
    return d;
  }

  /** Repair edges a node asks for when routing left it with < 2 roads (lightest feasible unused lattice edges). */
  private needMemo = new Map<string, number[]>();
  private needs(i: number, j: number): number[] {
    const key = nkey(i, j);
    let r = this.needMemo.get(key);
    if (r) return r;
    if (this.needMemo.size > MEMO_CAP) this.needMemo.clear();
    r = [];
    const d1 = this.node(i, j) ? this.deg1(i, j) : 2;
    const want = i === 0 && j === 0 ? 3 : 2;
    if (d1 < want) {
      const kept = this.keptDirs(i, j);
      r = [0, 1, 2, 3, 4, 5]
        .filter((k) => !kept.includes(k) && this.node(i + DIRS[k][0], j + DIRS[k][1]) && this.feasible(i, j, k) && this.deg1(i + DIRS[k][0], j + DIRS[k][1]) < MAX_DEG)
        .sort((a, b) => this.weight(i, j, a) - this.weight(i, j, b))
        .slice(0, want - d1);
    }
    this.needMemo.set(key, r);
    return r;
  }

  /** Generation-2 lattice directions of node (i, j). */
  extraDirs(i: number, j: number): number[] {
    if (!this.node(i, j)) return [];
    const out: number[] = [];
    for (let k = 0; k < 6; k++) {
      if (this.keptDirs(i, j).includes(k)) continue;
      const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
      if (this.needs(i, j).includes(k) || (this.node(i2, j2) && this.needs(i2, j2).includes((k + 3) % 6))) out.push(k);
    }
    return out;
  }

  allDirs(i: number, j: number): number[] {
    return [...this.keptDirs(i, j), ...this.extraDirs(i, j)];
  }

  /** Generation-2 route: free ports, off every generation-1 road around (1-cell halo) and off lighter repairs. */
  private exMemo = new Map<string, RoadPath | null>();
  extraPath(i: number, j: number, k: number): RoadPath | null {
    if (this.strictCache) {
      const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
      const key = i < i2 || (i === i2 && j < j2) ? i + ',' + j + ',' + k : i2 + ',' + j2 + ',' + ((k + 3) % 6);
      if (!this.exMemo.has(key)) throw new Missing('extra', i, j, k);
    }
    return drain(this.extraIter(i, j, k));
  }
  *extraIter(i: number, j: number, k: number): Generator<void, RoadPath | null> {
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    if (!(i < i2 || (i === i2 && j < j2))) return yield* this.extraIter(i2, j2, (k + 3) % 6);
    const key = i + ',' + j + ',' + k;
    if (this.exMemo.has(key)) return this.exMemo.get(key)!;
    const a = this.node(i, j)!, b = this.node(i2, j2)!;
    const w = this.weight(i, j, k);
    const avoid = new Set<number>();
    const around: RoadNode[] = [a, b];
    for (const n of [a, b])
      for (let t = 0; t < 6; t++) {
        const o = this.node(n.i + DIRS[t][0], n.j + DIRS[t][1]);
        if (o && !around.includes(o)) around.push(o);
      }
    const seen = new Set<string>();
    for (const n of around)
      for (const t of this.allDirs(n.i, n.j)) {
        const ni = n.i + DIRS[t][0], nj = n.j + DIRS[t][1];
        const ck = n.i < ni || (n.i === ni && n.j < nj) ? n.i + ',' + n.j + ',' + t : ni + ',' + nj + ',' + ((t + 3) % 6);
        if (seen.has(ck) || ck === key) continue;
        seen.add(ck);
        const [ci, cj, ckk] = ck.split(',').map(Number);
        const kept = this.keptDirs(ci, cj).includes(ckk);
        const p = kept ? yield* this.pathIter(ci, cj, ckk) : null;
        void w;
        if (!p) continue;
        for (const st of p.steps) {
          if ((st.q === a.q && st.r === a.r) || (st.q === b.q && st.r === b.r)) continue;
          avoid.add(ckey(st.q, st.r));
          const dn = Math.min(hexDistance(st.q, st.r, a.q, a.r), hexDistance(st.q, st.r, b.q, b.r));
          if (dn <= 2) continue;
          for (const [dq, dr] of DIRS) avoid.add(ckey(st.q + dq, st.r + dr));
        }
      }
    const r = yield* this.routeIter(i, j, k, 'free', avoid);
    if (this.exMemo.size > MEMO_CAP) this.exMemo.clear();
    this.exMemo.set(key, r);
    return r;
  }

  /** Route of any generation. */
  *pathAnyIter(i: number, j: number, k: number): Generator<void, RoadPath | null> {
    if (this.keptDirs(i, j).includes(k)) return yield* this.pathIter(i, j, k);
    if (this.extraDirs(i, j).includes(k)) return yield* this.extraIter(i, j, k);
    return null;
  }

  pathAny(i: number, j: number, k: number): RoadPath | null {
    return this.keptDirs(i, j).includes(k) ? this.path(i, j, k) : this.extraDirs(i, j).includes(k) ? this.extraPath(i, j, k) : null;
  }

  // ------------------------------------------------------------------ dead-end pruning
  private aliveMemo = new Map<string, boolean>();
  /**
   * Routed edge that survives PRUNE rounds of dead-end pruning: an edge dies when one of its nodes has fewer than two
   * surviving edges in the previous round (roads never stop in the middle of nowhere; short spurs disappear).
   */
  alive(i: number, j: number, k: number, round = PRUNE): boolean {
    if (round === 0) return !!this.pathAny(i, j, k) && !this.smallLoop(i, j, k) && !this.parallelSibling(i, j, k);
    const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
    if (!(i < i2 || (i === i2 && j < j2))) return this.alive(i2, j2, (k + 3) % 6, round);
    const key = i + ',' + j + ',' + k + '#' + round;
    let v = this.aliveMemo.get(key);
    if (v !== undefined) return v;
    if (this.aliveMemo.size > MEMO_CAP) this.aliveMemo.clear();
    v = this.alive(i, j, k, round - 1) && this.aliveDeg(i, j, round - 1) >= 2 && this.aliveDeg(i2, j2, round - 1) >= 2;
    this.aliveMemo.set(key, v);
    return v;
  }

  /** Edge closes a short triangle of roads (perimeter < LOOP_MAX cells) and is its heaviest edge → dropped. */
  private smallLoop(i: number, j: number, k: number): boolean {
    const e = this.pathAny(i, j, k);
    if (!e) return false;
    const w = this.weight(i, j, k);
    const bi = i + DIRS[k][0], bj = j + DIRS[k][1];
    for (const s of [1, 5]) {
      const k2 = (k + s) % 6;
      const ci = i + DIRS[k2][0], cj = j + DIRS[k2][1];
      let kb = -1;
      for (let t = 0; t < 6; t++) if (bi + DIRS[t][0] === ci && bj + DIRS[t][1] === cj) kb = t;
      if (kb < 0 || !this.allDirs(i, j).includes(k2) || !this.allDirs(bi, bj).includes(kb)) continue;
      const e1 = this.pathAny(i, j, k2), e2 = this.pathAny(bi, bj, kb);
      if (!e1 || !e2) continue;
      if (e.steps.length + e1.steps.length + e2.steps.length >= LOOP_MAX) continue;
      if (w > this.weight(i, j, k2) && w > this.weight(bi, bj, kb)) return true;
    }
    return false;
  }

  /**
   * Edge runs alongside a lighter sibling road (same node) for ≥ 4 cells within 2 cells of it, away from the shared
   * node → redundant parallel branch, dropped.
   */
  private parallelSibling(i: number, j: number, k: number): boolean {
    const e = this.pathAny(i, j, k);
    if (!e) return false;
    const w = this.weight(i, j, k);
    const ends: [number, number, number][] = [[i, j, k], [i + DIRS[k][0], j + DIRS[k][1], (k + 3) % 6]];
    for (const [ni, nj, nk] of ends) {
      const n = this.node(ni, nj)!;
      for (const t of this.allDirs(ni, nj)) {
        if (t === nk || this.weight(ni, nj, t) >= w) continue;
        const f = this.pathAny(ni, nj, t);
        if (!f) continue;
        const fc = new Set(f.steps.map((s) => s.q + ',' + s.r));
        let close = 0;
        for (const s of e.steps) {
          if (hexDistance(s.q, s.r, n.q, n.r) <= 3 || fc.has(s.q + ',' + s.r)) continue;
          let near = false;
          for (const st of f.steps) if (hexDistance(s.q, s.r, st.q, st.r) <= 2) { near = true; break; }
          if (near) close++;
        }
        if (close >= 4) return true;
      }
    }
    return false;
  }

  private aliveDeg(i: number, j: number, round: number): number {
    let d = 0;
    for (const k of this.allDirs(i, j)) if (this.alive(i, j, k, round)) d++;
    return d;
  }

  // ------------------------------------------------------------------ per-cell queries
  hasRegion(I: number, J: number): boolean {
    return this.regionMemo.has(I + ',' + J);
  }

  region(I: number, J: number): Map<string, RoadCell> {
    const key = I + ',' + J;
    let m = this.regionMemo.get(key);
    if (m) return m;
    if (this.regionMemo.size > 4000) this.regionMemo.clear();
    m = new Map();
    const q0 = I * MACRO, r0 = J * MACRO;
    const inR = (q: number, r: number) => q >= q0 && q < q0 + MACRO && r >= r0 && r < r0 + MACRO;
    const done = new Set<string>();
    const cellOf = (q: number, r: number): RoadCell => {
      const k = q + ',' + r;
      let c = m!.get(k);
      if (!c) m!.set(k, (c = { mask: 0, slope: null, node: null, level: null }));
      return c;
    };
    for (let i = I - 1; i <= I + 2; i++)
      for (let j = J - 1; j <= J + 2; j++) {
        const n = this.node(i, j);
        if (!n) continue;
        if (inR(n.q, n.r) && this.degree(i, j) > 0) cellOf(n.q, n.r).node = n;
        for (const k of this.allDirs(i, j)) {
          const i2 = i + DIRS[k][0], j2 = j + DIRS[k][1];
          const ek = i < i2 || (i === i2 && j < j2) ? i + ',' + j + ',' + k : i2 + ',' + j2 + ',' + ((k + 3) % 6);
          if (done.has(ek)) continue;
          done.add(ek);
          if (!this.alive(i, j, k)) continue;
          const st = this.pathAny(i, j, k)!.steps;
          for (let t = 0; t < st.length; t++) {
            const s = st[t];
            if (!inR(s.q, s.r)) continue;
            const c = cellOf(s.q, s.r);
            if (t > 0) c.mask |= 1 << ((st[t].dir + 3) % 6);
            if (t < st.length - 1) c.mask |= 1 << st[t + 1].dir;
            if (s.mode === 6 || s.mode === 7) c.slope = { dir: s.mode === 6 ? s.dir : (s.dir + 3) % 6, steps: 1 };
            if (s.mode === 1 || s.mode === 2) {
              c.slope = { dir: s.mode === 1 ? s.dir : (s.dir + 3) % 6, steps: 1 };
              c.level = this.get(s.q, s.r).level - 1;
            }
          }
        }
      }
    this.regionMemo.set(key, m);
    return m;
  }

  /** Road data of a cell (null when no road). */
  cell(q: number, r: number): RoadCell | null {
    return this.region(Math.floor(q / MACRO), Math.floor(r / MACRO)).get(q + ',' + r) ?? null;
  }

  /** Number of successfully routed roads at node (i, j). */
  degree(i: number, j: number): number {
    const key = nkey(i, j);
    let d = this.degreeMemo.get(key);
    if (d !== undefined) return d;
    if (this.degreeMemo.size > MEMO_CAP) this.degreeMemo.clear();
    d = 0;
    if (this.node(i, j)) d = this.aliveDeg(i, j, PRUNE);
    this.degreeMemo.set(key, d);
    return d;
  }

  /** Macro node owning cell (q, r) as its node cell, if any. */
  nodeAtCell(q: number, r: number): RoadNode | null {
    const I = Math.round(q / MACRO), J = Math.round(r / MACRO);
    for (let i = I - 1; i <= I + 1; i++)
      for (let j = J - 1; j <= J + 1; j++) {
        const n = this.node(i, j);
        if (n && n.q === q && n.r === r) return n;
      }
    return null;
  }

  /** Nodes (with degree) whose cell lies within `radius` cells of (q, r). */
  nodesNear(q: number, r: number, radius: number): { node: RoadNode; degree: number }[] {
    const out: { node: RoadNode; degree: number }[] = [];
    const span = Math.ceil(radius / MACRO) + 2;
    const I = Math.round(q / MACRO), J = Math.round(r / MACRO);
    for (let i = I - span; i <= I + span; i++)
      for (let j = J - span; j <= J + span; j++) {
        const n = this.node(i, j);
        if (!n || hexDistance(q, r, n.q, n.r) > radius) continue;
        const d = this.degree(i, j);
        if (d > 0) out.push({ node: n, degree: d });
      }
    out.sort((x, y) => hexDistance(q, r, x.node.q, x.node.r) - hexDistance(q, r, y.node.q, y.node.r));
    return out;
  }
}
