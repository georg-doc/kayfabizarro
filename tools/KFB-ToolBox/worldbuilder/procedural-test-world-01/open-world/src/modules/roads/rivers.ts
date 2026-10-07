// Stage-4 river network: endless single-cell rivers along terrain's valley corridors (ARCHITECTURE §4).
//
// Terrain's corridors are iso-lines u = k·SPACING of a warped coordinate across a seed-rotated axis A. We estimate A
// once (corridor.ts) and put GATES along every river: gate (k, n) is the best centre cell of corridor k on the line
// v = n·GATE (v = coordinate along the rivers). Consecutive gates are joined by A* (heading-aware, ≤ 60° per cell,
// gentle) that stays inside corridor k. Every gate is passed straight through with a heading taken from its neighbour
// gates, so links join without kinks. Pure and local: a cell's river mask needs only the links of nearby gates.
//
// Rules: never through village cells, coast, water, rock or mountain; one level along the river (terrain flattens the
// corridor; links refuse level changes); road cells are entered only as BRIDGES: straight road whose axis differs from
// the river heading, river straight through (→ hex_river_crossing tile); never through road nodes / ramps.
import type { CellData } from '../../core/types';
import { DIRS, hexDistance, hexRound, hexToWorld, worldToAxial } from '../../core/hex';
import { HEX_WIDTH } from '../../core/units';
import { fbm2, hash, rand01, simplex2, strSeed } from '../../core/rng';
import { MinHeap } from './heap';
import { corridorFn, riverAxis, riverSpacing, type CorridorInfo } from './corridor';
import { drain, type CellGetter } from './net';

/** Gate spacing along a river (cells). */
export const GATE = 5;
const cdiff6 = (a: number, b: number) => { const d = (((a - b) % 6) + 6) % 6; return Math.min(d, 6 - d); };
export const DEBUG_RIV = { straightGates: false };
const PAD = 6;

export interface RiverStep {
  q: number;
  r: number;
  dir: number;
}
export interface RiverCell {
  mask: number;
}

const bitsOf = (m: number) => {
  const out: number[] = [];
  for (let d = 0; d < 6; d++) if ((m >> d) & 1) out.push(d);
  return out;
};
const cdiff = (a: number, b: number) => {
  const d = (((a - b) % 6) + 6) % 6;
  return Math.min(d, 6 - d);
};

function bearing(dx: number, dz: number): number {
  const a = Math.atan2(-dz, dx) / (Math.PI / 3);
  return ((a % 6) + 6) % 6;
}

export class RiverNet {
  readonly corr: (q: number, r: number) => CorridorInfo;
  private A: { ax: number; az: number };
  private S: number;
  private gateMemo = new Map<string, { q: number; r: number } | null>();
  private linkMemo = new Map<string, RiverStep[] | null>();
  private cellMemo = new Map<string, Map<string, number>>();
  stats = { links: 0, failed: 0, relaxed: 0, ms: 0 };
  private sM: number;

  constructor(readonly seed: number, readonly get: CellGetter) {
    this.corr = corridorFn(seed);
    this.A = riverAxis(seed);
    this.S = riverSpacing();
    this.sM = hash(seed, strSeed('rivers.meander'));
  }

  /** Along-river coordinate (cells) of a cell. */
  vOf(q: number, r: number): number {
    const w = hexToWorld(q, r);
    return (-this.A.az * w.x + this.A.ax * w.z) / HEX_WIDTH;
  }

  private riverFree(c: Readonly<CellData>): boolean {
    return !c.water && c.coastMask === 0 && c.biome !== 'mountain' && !c.village && !c.building && !c.tags.includes('rock') && !c.slope;
  }

  /** Gate cell of river k on cross line n (null if the river cannot pass there). */
  gate(k: number, n: number): { q: number; r: number } | null {
    const key = k + ',' + n;
    if (this.gateMemo.has(key)) return this.gateMemo.get(key)!;
    if (this.gateMemo.size > 50000) this.gateMemo.clear();
    const { ax, az } = this.A;
    const vx = -az, vz = ax;
    // jittered cross line + a lateral target that wanders across the valley (irregular meanders)
    const v = n * GATE + (rand01(this.sM, k, n, 7) - 0.5) * 1.6;
    // meander: the target swings across the valley from gate to gate (bends every ~3–6 cells), amplitude varies
    const swing = (n & 1 ? 1 : -1) * (simplex2(this.sM, n * 0.21 + k * 17.3, k * 3.1) > 0.45 ? -1 : 1);
    const off = swing * (1.0 + 0.45 * rand01(this.sM, k, n, 11));
    const cands: { h: { q: number; r: number }; t: number; dist: number }[] = [];
    const seen = new Set<string>();
    for (let t = k * this.S - this.S - 12; t <= k * this.S + this.S + 12; t += 0.5) {
      const x = (v * vx + t * ax) * HEX_WIDTH, z = (v * vz + t * az) * HEX_WIDTH;
      const fa = worldToAxial(x, z);
      const h = hexRound(fa.q, fa.r);
      const ck = h.q + ',' + h.r;
      if (seen.has(ck)) continue;
      seen.add(ck);
      const ci = this.corr(h.q, h.r);
      if (!ci.corridor || ci.id !== k) continue;
      cands.push({ h, t, dist: ci.dist });
    }
    let best: { q: number; r: number } | null = null;
    if (cands.length) {
      let t0 = cands[0].t, dmin = Infinity;
      for (const c of cands) if (c.dist < dmin) { dmin = c.dist; t0 = c.t; }
      let bestScore = Infinity;
      for (const c of cands) {
        const cell = this.get(c.h.q, c.h.r);
        if (!this.riverFree(cell) || cell.roadMask) continue;
        const score = Math.abs(c.t - (t0 + off)) + Math.abs(this.vOf(c.h.q, c.h.r) - v) * 0.5 + (c.dist > 1.65 ? 3 : 0);
        if (score < bestScore) {
          bestScore = score;
          best = c.h;
        }
      }
    }
    this.gateMemo.set(key, best);
    return best;
  }

  /** Corridor cells gate(k, n) will inspect (no world access) — the prefetcher warms their stage-3 data first. */
  gateCells(k: number, n: number): [number, number][] {
    const { ax, az } = this.A;
    const vx = -az, vz = ax;
    const v = n * GATE + (rand01(this.sM, k, n, 7) - 0.5) * 1.6;
    const out: [number, number][] = [];
    const seen = new Set<string>();
    for (let t = k * this.S - this.S - 12; t <= k * this.S + this.S + 12; t += 0.5) {
      const fa = worldToAxial((v * vx + t * ax) * HEX_WIDTH, (v * vz + t * az) * HEX_WIDTH);
      const h = hexRound(fa.q, fa.r);
      const ck = h.q + ',' + h.r;
      if (seen.has(ck)) continue;
      seen.add(ck);
      const ci = this.corr(h.q, h.r);
      if (ci.corridor && ci.id === k) out.push([h.q, h.r]);
    }
    return out;
  }

  /**
   * Jog at gate (k, n): −1 / 0 / +1 (60° turn of the river IN the gate cell; pure hash, alternating sides, never on
   * two consecutive gates the same way). Otherwise every gate was crossed straight (arrive along the gate heading,
   * leave along it) and long straight runs formed across gates.
   */
  jogAt(k: number, n: number): number {
    if (DEBUG_RIV.straightGates) return 0;
    if (rand01(this.sM, k, n, 23) >= 0.8) return 0;
    // jog toward the side the next gate lies on (gates alternate sides of the valley centre)
    const g = this.gate(k, n), nx = this.gate(k, n + 1);
    if (!g || !nx) return 0;
    const a = hexToWorld(g.q, g.r), b = hexToWorld(nx.q, nx.r);
    let dd = bearing(b.x - a.x, b.z - a.z) - this.gateDir(k, n);
    dd = ((dd % 6) + 9) % 6 - 3;
    return dd > 0.12 ? 1 : dd < -0.12 ? -1 : 0;
  }

  /** Heading through gate (k, n): from the previous toward the next gate. */
  gateDir(k: number, n: number): number {
    const g = this.gate(k, n)!;
    const p = this.gate(k, n - 1) ?? g, nx = this.gate(k, n + 1) ?? g;
    const a = hexToWorld(p.q, p.r), b = hexToWorld(nx.q, nx.r);
    let dx = b.x - a.x, dz = b.z - a.z;
    if (Math.hypot(dx, dz) < 1) {
      dx = -this.A.az;
      dz = this.A.ax;
    }
    return Math.round(bearing(dx, dz)) % 6;
  }

  /** Cells from gate n to gate n+1 of river k (inclusive), each with its entry heading. */
  link(k: number, n: number): RiverStep[] | null {
    return drain(this.linkIter(k, n));
  }
  hasLink(k: number, n: number): boolean {
    return this.linkMemo.has(k + ',' + n);
  }
  /** Resumable twin of link() (identical result; yields inside the A*). Gates must be cheap → prefetch them first. */
  *linkIter(k: number, n: number): Generator<void, RiverStep[] | null> {
    const key = k + ',' + n;
    if (this.linkMemo.has(key)) return this.linkMemo.get(key)!;
    let res: RiverStep[] | null = null;
    const g0 = this.gate(k, n);
    // a blocked gate (every candidate cell taken by a road / village / ramp …) is skipped: the link runs on to the
    // next open gate (≤ 2 further), else the river would end on both sides of it (seed 7 after terrain's valley change)
    let n1 = n + 1, g1 = g0 ? this.gate(k, n1) : null;
    while (g0 && !g1 && n1 < n + 3) g1 = this.gate(k, ++n1);
    if (g0 && g1) {
      const gd = this.gateDir(k, n), d1 = this.gateDir(k, n1);
      const jog0 = this.jogAt(k, n), jog1 = this.jogAt(k, n1);
      // the jogged departure first, then the straight one, then the relaxations (always straight departure). The next
      // link may leave its gate jogged or straight → arrivals stay within 60° of both (no 120° turn in a gate cell).
      const tries: [number, number][] = jog0 ? [[0, jog0], [0, 0], [1, jog0], [1, 0], [2, 0], [4, 0], [5, 0], [6, 0]] : [[0, 0], [1, 0], [2, 0], [4, 0], [5, 0], [6, 0]];
      for (const [relax, jog] of tries) {
        if (res) break;
        res = yield* this.routeIter(k, g0, g1, (gd + jog + 6) % 6, d1, relax, jog, jog1, n);
      }
      if (!this.linkMemo.has(key)) {
        this.stats.links++;
        if (!res) this.stats.failed++;
      }
    }
    if (this.linkMemo.size > 50000) this.linkMemo.clear();
    this.linkMemo.set(key, res);
    return res;
  }

  /**
   * relax 0: strict (exit gate straight, enter next gate with its heading, ≤ 60° turns).
   * relax 1: free arrival heading at the next gate. relax 2: also allow 120° turns.
   */
  *routeIter(k: number, g0: { q: number; r: number }, g1: { q: number; r: number }, d0: number, d1: number, relax: number, jog0 = 0, jog1 = 0, nOf = 0): Generator<void, RiverStep[] | null> {
    const d1j = (d1 + jog1 + 6) % 6;
    const qmin = Math.min(g0.q, g1.q) - PAD, qmax = Math.max(g0.q, g1.q) + PAD;
    const rmin = Math.min(g0.r, g1.r) - PAD, rmax = Math.max(g0.r, g1.r) + PAD;
    const W = qmax - qmin + 1, H = rmax - rmin + 1, N = W * H;
    const L0 = this.get(g0.q, g0.r).level;
    // per-cell: 0 unknown, 1 free, 2 blocked, 3 bridge-able road (straight, not node), value = road axis in roadAxis
    const kind = new Uint8Array(N);
    const roadAxis = new Int8Array(N);
    const cost = new Float32Array(N);
    const idx = (q: number, r: number) => (q < qmin || q > qmax || r < rmin || r > rmax ? -1 : (r - rmin) * W + (q - qmin));
    const prep = (q: number, r: number, id: number) => {
      kind[id] = 2;
      const ci = this.corr(q, r);
      if (!ci.corridor || ci.id !== k) return;
      const c = this.get(q, r);
      if (c.level !== L0) return;
      if (c.roadMask) {
        const b = bitsOf(c.roadMask);
        if (b.length !== 2 || (b[1] - b[0]) !== 3 || c.slope || c.tags.includes('road-node') || c.water || c.coastMask) return;
        kind[id] = 3;
        roadAxis[id] = b[0];
        cost[id] = 1.5 + 0.4 * ci.dist;
        return;
      }
      if (!this.riverFree(c)) return;
      kind[id] = 1;
      const w = hexToWorld(q, r);
      cost[id] = 1 + 0.12 * ci.dist + 1.2 * (fbm2(this.sM, w.x / 32, w.z / 32, 2) + 1) / 2;
    };
    const K = (q: number, r: number, id: number) => {
      if (kind[id] === 0) prep(q, r, id);
      return kind[id];
    };
    const s0 = idx(g0.q, g0.r), s1 = idx(g1.q, g1.r);
    // state = (cell*6 + heading)*10 + run*2 + sign: heading = direction we entered the cell with, run = straight cells
    // since the last 60° turn (0..4), sign = side of that turn. Meander: a straight run of ≥ JOG cells costs extra, and
    // two same-side turns in a row (a hairpin curl) are not allowed → the river jogs left/right every 2–4 cells.
    const S8 = 10, JOG = 3;
    const NS = N * 6 * S8;
    const g = new Float32Array(NS).fill(Infinity);
    const parent = new Int32Array(NS).fill(-1);
    const closed = new Uint8Array(NS);
    const heap = new MinHeap();
    // relax 4: the departure may also jog either way the previous link's arrival allows (gate heading or its jog);
    // relax 5: any 60° departure / arrival around the gate headings (gate cells never turn more than 120°, so the
    // river cannot double back on itself there and leave a spur); relax 6 (last resort): anything goes
    const jogPrev = this.jogAt(k, nOf);
    const starts = relax >= 6 ? [0, 1, 5, 2, 4] : relax === 5 ? [0, 1, 5] : relax === 4 ? (jogPrev ? [0, (jogPrev + 6) % 6] : [0, 1, 5]) : [0];
    for (const t of starts) {
      const dd = (d0 + t) % 6;
      const first = { q: g0.q + DIRS[dd][0], r: g0.r + DIRS[dd][1] };
      const fi = idx(first.q, first.r);
      if (fi < 0) continue;
      const fk = K(first.q, first.r, fi);
      if (fk === 2 || (fk === 3 && roadAxis[fi] % 3 === dd % 3)) continue;
      if (first.q === g1.q && first.r === g1.r) return [{ q: g0.q, r: g0.r, dir: dd }, { q: g1.q, r: g1.r, dir: dd }];
      // gate jog (d0 = gate heading ± 1): the gate cell itself is a 60° bend → state "just turned"
      const st = (fi * 6 + dd) * S8 + (t === 0 ? (jog0 === 0 ? 2 * 2 : jog0 > 0 ? 0 : 1) : t === 1 ? 0 : 1);
      g[st] = cost[fi] + (t ? (t === 1 || t === 5 ? 1 : 4) : 0);
      heap.push(g[st] + hexDistance(first.q, first.r, g1.q, g1.r), st);
    }
    let goal = -1;
    let exp = 0;
    while (heap.size && exp < 40000) {
      const s = heap.pop();
      if (closed[s]) continue;
      closed[s] = 1;
      exp++;
      if (exp % 400 === 0) yield;
      const cs = Math.floor(s / S8), run = (s % S8) >> 1, sign = s % 2;
      const ci = Math.floor(cs / 6), m = cs % 6;
      const cq = qmin + (ci % W), cr = rmin + Math.floor(ci / W);
      const onBridge = kind[ci] === 3;
      const turns = onBridge ? [0] : relax >= 2 ? [0, 1, 5, 2, 4] : [0, 1, 5];
      for (const t of turns) {
        // meander rules (relaxed from relax 1 on: no curl ban)
        const tsign = t === 1 ? 0 : 1;
        if ((t === 1 || t === 5) && run === 0 && tsign === sign && relax < 1) continue;
        const nrun = t === 0 ? Math.min(4, run + 1) : 0;
        const nsign = t === 0 ? sign : t === 1 || t === 2 ? 0 : 1;
        const jog = t === 0 && run + 1 >= JOG ? (run + 1 === JOG ? 2.0 : 6.0) : 0;
        const d = (m + t) % 6;
        const nq = cq + DIRS[d][0], nr = cr + DIRS[d][1];
        if (nq === g1.q && nr === g1.r) {
          if (relax === 0 && d !== d1) continue;
          // the next link leaves the gate along d1 or d1 + jog1: never a 120° turn in the gate cell, never a curl
          if (relax < 5 && d !== d1 && !(jog1 !== 0 && d === d1j)) continue; // arrive along a heading the next link may leave with
          if (relax === 5 && d !== d1 && d !== (d1 + 1) % 6 && d !== (d1 + 5) % 6) continue;
          if (relax < 1 && jog1 !== 0 && (t === 1 || t === 5) && (t === 1 ? 1 : -1) === jog1) continue;
          const gs = ((s1 * 6 + d) * S8) | 0;
          if (g[s] < g[gs]) {
            g[gs] = g[s];
            parent[gs] = s;
          }
          goal = gs;
          break;
        }
        const ni = idx(nq, nr);
        if (ni < 0 || ni === s0) continue;
        const nk = K(nq, nr, ni);
        if (nk === 2) continue;
        if (nk === 3 && roadAxis[ni] % 3 === d % 3) continue;
        const c = g[s] + cost[ni] + jog + (t ? (t === 1 || t === 5 ? 0.35 : 4) : 0);
        const ns = (ni * 6 + d) * S8 + nrun * 2 + nsign;
        if (c < g[ns] && !closed[ns]) {
          g[ns] = c;
          parent[ns] = s;
          heap.push(c + hexDistance(nq, nr, g1.q, g1.r), ns);
        }
      }
      if (goal >= 0) break;
    }
    if (goal < 0) return null;
    const steps: RiverStep[] = [];
    for (let s = goal; s >= 0; s = parent[s]) {
      const cs = Math.floor(s / S8), ci = Math.floor(cs / 6);
      steps.push({ q: qmin + (ci % W), r: rmin + Math.floor(ci / W), dir: cs % 6 });
    }
    steps.reverse();
    // a bridge must be passed straight: verify (the goal step from a bridge is not constrained in the loop above)
    for (let t = 0; t + 1 < steps.length; t++) {
      const i0 = idx(steps[t].q, steps[t].r);
      if (i0 >= 0 && kind[i0] === 3 && steps[t + 1].dir !== steps[t].dir) return null;
    }
    steps.unshift({ q: g0.q, r: g0.r, dir: d0 });
    if (relax) this.stats.relaxed++;
    (this.stats as unknown as Record<string, number>)['r' + relax + (jog0 ? 'j' : '')] = ((this.stats as unknown as Record<string, number>)['r' + relax + (jog0 ? 'j' : '')] ?? 0) + 1;
    return steps;
  }

  /** River mask of a cell (0 when dry). */
  mask(q: number, r: number): number {
    const ci = this.corr(q, r);
    if (!ci.corridor) return 0;
    const k = ci.id;
    const n0 = Math.floor(this.vOf(q, r) / GATE);
    const key = k + ',' + n0;
    let m = this.cellMemo.get(key);
    if (!m) {
      if (this.cellMemo.size > 20000) this.cellMemo.clear();
      m = new Map();
      for (let n = n0 - 4; n <= n0 + 2; n++) {
        const st = this.link(k, n);
        if (!st) continue;
        for (let t = 0; t < st.length; t++) {
          const s = st[t];
          let bits = 0;
          if (t > 0) bits |= 1 << ((s.dir + 3) % 6);
          if (t < st.length - 1) bits |= 1 << st[t + 1].dir;
          // gates: the neighbouring links supply the other half (exit / entry)
          const kk = s.q + ',' + s.r;
          m.set(kk, (m.get(kk) ?? 0) | bits);
        }
      }
      this.cellMemo.set(key, m);
    }
    return m.get(q + ',' + r) ?? 0;
  }

  cell(q: number, r: number): RiverCell | null {
    const m = this.mask(q, r);
    return m ? { mask: m } : null;
  }
}
