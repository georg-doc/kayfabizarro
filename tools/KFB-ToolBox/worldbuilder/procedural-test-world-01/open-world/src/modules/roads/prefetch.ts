// Time-sliced prefetch of the road / river networks around a focus point. Chunk builds read world cells
// synchronously; without this, the first chunk of a new macro region computes the routing halo (nodes, feasibility
// probes, routes, repair routes, pruning rounds) in one frame. The prefetcher computes exactly the same memoised,
// pure values ahead of time, LEAF-FIRST, and every A* is resumable (`*Iter` twins yield every ~1 500 expansions), so
// a single step stays at a few ms. Results are bit-identical to the synchronous path (same functions, same memos).
//
// Order per macro region (I, J) — region() reads nodes I-1..I+2 (= B); alive(…, PRUNE) reaches PRUNE lattice steps out:
//   1. nodes             B ± (PRUNE + 7)     (terrain around each jittered point warmed in batches first)
//   2. feasibility       hash-selected edges B ± (PRUNE + 6); all six edges B ± (PRUNE + 5)
//   3. routes            kept edges          B ± (PRUNE + 4)   (pathIter → strict / fallback / free, recursion yield*)
//   4. repair routes     allDirs / pathAny   B ± (PRUNE + 2)
//   5. pruning rounds    alive(…, r)         B ± (PRUNE + 1 − r)
//   6. region(I, J)
// Rivers: gate cells read stage-3 cells (= road regions + villages) → their road regions go through the same closure.
import { DIRS, hexDistance, worldToHex } from '../../core/hex';
import { isRetrySignal, type WorldModel } from '../../core/world';
import { HEX_WIDTH } from '../../core/units';
import { MACRO, Missing, PRUNE, type RoadNet } from './net';
import { GATE, type RiverNet } from './rivers';

export class Prefetcher {
  gen: Generator<void> | null = null;
  private key = '';
  /** regions finished by the prefetcher (stats) */
  done = 0;
  ms = 0;
  /** longest single step (ms) */
  maxStep = 0;
  /** phase of the current step (diagnostics) */
  phase = '';
  maxPhase = '';
  slow: string[] = [];
  /** sync wrappers throw Missing during steps (off while touching world layers ≥ 3) */
  strict = true;

  constructor(private world: WorldModel, private net: RoadNet, private rivers: RiverNet | null, public radiusCells: number) {}

  update(fx: number, fz: number, budgetMs: number): void {
    const h = worldToHex(fx, fz);
    const I = Math.floor(h.q / MACRO), J = Math.floor(h.r / MACRO);
    const key = I + ',' + J + ',' + Math.round(this.radiusCells);
    if (key !== this.key) {
      this.key = key;
      this.center = [h.q, h.r];
      this.restarts = 0;
      this.gen = this.run(h.q, h.r);
    }
    if (!this.gen) return;
    const t0 = performance.now();
    for (;;) {
      const s0 = performance.now();
      this.net.strictCache = this.strict;
      let r: IteratorResult<void>;
      try {
        r = this.gen.next();
      } catch (e) {
        if (isRetrySignal(e) && this.restarts++ < 1000) {
          // a dependency surfaced through a path the step did not wrap (e.g. world.cell → another layer → roads):
          // compute it with the resumable twin and run the closure again (everything done so far is memoised)
          this.gen = this.restart(e);
          r = { done: false, value: undefined };
        } else {
          // never let a prefetch error escape into the frame (pure computations: the sync path will redo it)
          if (!isRetrySignal(e)) console.warn('[roads] prefetch step failed', e);
          r = { done: true, value: undefined };
        }
      } finally {
        this.net.strictCache = false;
      }
      const dt = performance.now() - s0;
      if (dt > this.maxStep) { this.maxStep = dt; this.maxPhase = this.phase; }
      if (dt > 12 && this.slow.length < 40) this.slow.push(this.phase + ' ' + dt.toFixed(1));
      if (r.done) {
        this.gen = null;
        break;
      }
      if (performance.now() - t0 >= budgetMs) break;
    }
    this.ms += performance.now() - t0;
  }

  private center: [number, number] = [0, 0];
  private skips = 0;
  private restarts = 0;
  private *restart(e: unknown): Generator<void> {
    if (e instanceof Missing) yield* this.resolve(e);
    else yield;
    yield* this.run(this.center[0], this.center[1]);
  }

  private *warm(cells: Iterable<[number, number]>): Generator<void> {
    let n = 0;
    for (const [q, r] of cells) {
      this.world.cellAt(2, q, r);
      if (++n % 8 === 0) yield;
    }
  }

  private nodeDone = new Set<string>();
  private *nodes(i0: number, i1: number, j0: number, j1: number): Generator<void> {
    const net = this.net;
    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++) {
        const k = i + ',' + j;
        if (++this.skips % 48 === 0) yield; // memoised skips are cheap but there are many: never run them all in one step
        if (this.nodeDone.has(k)) continue;
        const p = net.basePoint(i, j);
        const c = worldToHex(p.x * HEX_WIDTH, p.z * HEX_WIDTH);
        const cells: [number, number][] = [];
        for (let dq = -6; dq <= 6; dq++) for (let dr = -6; dr <= 6; dr++) if (Math.abs(dq + dr) <= 6) cells.push([c.q + dq, c.r + dr]);
        yield* this.warm(cells);
        net.node(i, j);
        if (this.nodeDone.size > 20000) this.nodeDone.clear();
        this.nodeDone.add(k);
        yield;
      }
  }

  /** Run a generator; whenever a sync wrapper reports a Missing dependency, compute it resumably and restart. */
  private *guard(make: () => Generator<void, unknown>): Generator<void> {
    for (let tries = 0; tries < 100000; tries++) {
      try {
        yield* make();
        return;
      } catch (e) {
        if (e instanceof Missing) yield* this.resolve(e);
        else if (isRetrySignal(e)) yield; // another module's retry signal: try again next slice
        else throw e;
      }
    }
  }
  private *resolve(m: Missing): Generator<void> {
    const net = this.net;
    yield* this.guard(() => (m.kind === 'feas' ? net.feasibleIter(m.i, m.j, m.k) : m.kind === 'path' ? net.pathIter(m.i, m.j, m.k) : net.extraIter(m.i, m.j, m.k)));
    yield;
  }

  /** Leaf-first closure of region(I, J). */
  /** Evaluate a sync net query; on a Missing dependency compute it resumably and retry (never restarts the caller). */
  private *sync<T>(fn: () => T): Generator<void, T> {
    for (;;) {
      try {
        return fn();
      } catch (e) {
        if (e instanceof Missing) yield* this.resolve(e);
        else if (isRetrySignal(e)) yield; // another module's retry signal: try again next slice
        else throw e;
      }
    }
  }

  /** Leaf-first closure of region(I, J); every step is a slice of resumable work. */
  *regionIter(I: number, J: number): Generator<void> {
    const net = this.net;
    if (net.hasRegion(I, J)) return;
    const P = PRUNE;
    const lo = (m: number) => [I - 1 - m, I + 2 + m, J - 1 - m, J + 2 + m] as const;
    // 1. nodes
    this.phase = 'nodes';
    {
      const [a, b, c, d] = lo(P + 7);
      yield* this.nodes(a, b, c, d);
    }
    // 2. feasibility probes (terrain-only, resumable): hash-selected edges, then all six of the inner window
    this.phase = 'feas';
    for (const [m, all] of [[P + 6, false], [P + 5, true]] as [number, boolean][]) {
      const [a, b, c, d] = lo(m);
      for (let i = a; i <= b; i++)
        for (let j = c; j <= d; j++) {
          if (++this.skips % 16 === 0) yield;
          if (!net.node(i, j)) continue;
          for (let k = 0; k < 6; k++) {
            if ((!all && !net.hsel(i, j, k)) || !net.node(i + DIRS[k][0], j + DIRS[k][1]) || net.hasFeasible(i, j, k)) continue;
            yield* this.warm(net.routeCells(i, j, k));
            yield* net.feasibleIter(i, j, k);
            yield;
          }
        }
    }
    // 3. generation-1 routes
    this.phase = 'paths';
    {
      const [a, b, c, d] = lo(P + 4);
      for (let i = a; i <= b; i++)
        for (let j = c; j <= d; j++) {
          if (++this.skips % 16 === 0) yield;
          if (!net.node(i, j)) continue;
          const ks = yield* this.sync(() => net.keptDirs(i, j));
          for (const k of ks) {
            if (net.hasPath(i, j, k)) continue;
            this.phase = 'paths ' + i + ',' + j + ',' + k;
            yield* this.warm(net.routeCells(i, j, k)); // terrain for the route box in small slices, not inside the A*
            yield* this.guard(() => net.pathIter(i, j, k));
            yield;
          }
        }
    }
    // 4. repair routes
    this.phase = 'extra';
    {
      const [a, b, c, d] = lo(P + 2);
      for (let i = a; i <= b; i++)
        for (let j = c; j <= d; j++) {
          if (!net.node(i, j)) continue;
          this.phase = 'extra-dirs ' + i + ',' + j;
          const ks = yield* this.sync(() => net.allDirs(i, j));
          for (const k of ks) {
            this.phase = 'extra ' + i + ',' + j + ',' + k;
            yield* this.guard(() => net.pathAnyIter(i, j, k));
            yield;
          }
        }
    }
    // 5. pruning rounds
    this.phase = 'alive';
    for (let round = 1; round <= P; round++) {
      const [a, b, c, d] = lo(P + 1 - round);
      for (let i = a; i <= b; i++)
        for (let j = c; j <= d; j++) {
          if (!net.node(i, j)) continue;
          const ks = yield* this.sync(() => net.allDirs(i, j));
          for (const k of ks) yield* this.sync(() => net.alive(i, j, k, round));
          yield;
        }
    }
    // 6.
    this.phase = 'region';
    yield* this.sync(() => net.region(I, J));
    this.done++;
    yield;
  }

  private *run(q0: number, r0: number): Generator<void> {
    const net = this.net;
    const R = Math.ceil(this.radiusCells / MACRO) + 1;
    const I0 = Math.floor(q0 / MACRO), J0 = Math.floor(r0 / MACRO);
    const regions: [number, number, number][] = [];
    for (let I = I0 - R; I <= I0 + R; I++)
      for (let J = J0 - R; J <= J0 + R; J++) {
        const d = hexDistance((I + 0.5) * MACRO, (J + 0.5) * MACRO, q0, r0);
        if (d <= this.radiusCells + MACRO) regions.push([I, J, d]);
      }
    regions.sort((a, b) => a[2] - b[2]);
    this.strict = true;
    for (const [I, J] of regions) if (!net.hasRegion(I, J)) yield* this.guard(() => this.regionIter(I, J));

    // rivers: gates read stage-3 cells (road regions + villages) → prefetch those first, then resumable links
    const rn = this.rivers;
    if (!rn) return;
    this.phase = 'rivers';
    // stage-4 reads go through world layers (villages may call the roads API): never strict there
    this.strict = false;
    const region = function* (this: Prefetcher, I: number, J: number) {
      if (net.hasRegion(I, J)) return;
      this.strict = true;
      yield* this.guard(() => this.regionIter(I, J));
      this.strict = false;
    }.bind(this);
    // villages (stage 3) read road-node degrees around a cell: nodes within VR + 8 of its 8×8 block, their rivals
    // within MIN_SPACING (15) of those, rural features within SETTLE_CLEAR → nodes up to ≈ 33 cells away. Every
    // stage-4 read is preceded by the road regions in a ±VREACH macro-region neighbourhood (streaming request §12;
    // a region's closure computes the degrees of its own and the neighbouring nodes).
    const VREACH = 3;
    const around = function* (this: Prefetcher, q: number, r: number) {
      const I = Math.floor(q / MACRO), J = Math.floor(r / MACRO);
      for (let a = I - VREACH; a <= I + VREACH; a++) for (let b = J - VREACH; b <= J + VREACH; b++) yield* region(a, b);
    }.bind(this);
    const Rc = this.radiusCells;
    const ids = new Set<number>();
    let vmin = Infinity, vmax = -Infinity;
    for (const [dq, dr] of [[-Rc, 0], [Rc, 0], [0, -Rc], [0, Rc], [Rc, -Rc], [-Rc, Rc], [0, 0]]) {
      const q = Math.round(q0 + dq), r = Math.round(r0 + dr);
      ids.add(rn.corr(q, r).id);
      const v = rn.vOf(q, r);
      vmin = Math.min(vmin, v);
      vmax = Math.max(vmax, v);
    }
    const kmin = Math.min(...ids) - 1, kmax = Math.max(...ids) + 1;
    for (let n = Math.floor(vmin / GATE) - 2; n <= Math.ceil(vmax / GATE) + 2; n++)
      for (let k = kmin; k <= kmax; k++) {
        if (rn.hasLink(k, n)) continue;
        // gate n, then gates n+1 … until an open one (a blocked gate is skipped by the link, ≤ n+3)
        for (let nn = n; nn <= n + 3; nn++) {
          if (nn > n + 1 && (!rn.gate(k, n) || rn.gate(k, nn - 1))) break;
          for (const [q, r] of rn.gateCells(k, nn)) {
            yield* around(q, r);
            this.phase = 'rivers-gate4';
            this.world.cellAt(4, q, r); // villages (stage 3) for this cell
            yield;
          }
          yield;
          this.phase = 'rivers-gate';
          rn.gate(k, nn);
          yield;
        }
        const g0 = rn.gate(k, n);
        let g1 = g0 ? rn.gate(k, n + 1) : null;
        for (let nn = n + 2; g0 && !g1 && nn <= n + 3; nn++) g1 = rn.gate(k, nn);
        if (g0 && g1) {
          // the link's A* box reads stage-4 cells: all road regions over the box, ±VREACH macro regions (villages' reach)
          const qa = Math.min(g0.q, g1.q) - 6, qb = Math.max(g0.q, g1.q) + 6, ra = Math.min(g0.r, g1.r) - 6, rb = Math.max(g0.r, g1.r) + 6;
          for (let a = Math.floor(qa / MACRO) - VREACH; a <= Math.floor(qb / MACRO) + VREACH; a++)
            for (let b = Math.floor(ra / MACRO) - VREACH; b <= Math.floor(rb / MACRO) + VREACH; b++) yield* region(a, b);
          // and the stage-4 cells of the box themselves, one per slice (villages plans there are then cheap)
          this.phase = 'rivers-box4';
          for (let q = qa; q <= qb; q++)
            for (let r = ra; r <= rb; r++) {
              this.world.cellAt(4, q, r);
              yield; // one cell per slice: a new stage-4 cell may plan a village
            }
        }
        this.phase = 'rivers-link';
        yield* rn.linkIter(k, n);
        yield;
      }
  }
}
