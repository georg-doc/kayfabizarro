// Incremental (time-sliced) chunk build. Same result as ChunkManager.build(), split into steps the scheduler can
// spread over frames: warm world cells (batches) → one step per module buildChunk → merge (finish) → adopt into the
// ChunkManager (scene + 'chunk:loaded'). Colliders are NOT created here: the job keeps the collider descs and the
// scheduler's physics pass creates/removes them by distance (only chunks near the player/focus are in Rapier).
import * as THREE from 'three';
import { ChunkBuilder } from '../../core/chunks';
import { chunkCells, chunkKey } from '../../core/hex';
import { CHUNK } from '../../core/units';
import type { ChunkInfo, CoreContext, GameModule } from '../../core/types';

let warmRT: THREE.WebGLRenderTarget | null = null;

/** The environment routes the frame through a composer (scene rendered into a render target). */
export function usesComposer(): boolean {
  return !!(window as unknown as { __kfb?: { engine?: { renderOverride?: unknown } } }).__kfb?.engine?.renderOverride;
}


export type StepKind = 'warm' | 'plan' | 'module' | 'finish' | 'compile' | 'adopt';

type Prefetchable = { prefetch?: (cx: number, cz: number) => void; prefetchStep?: (cx: number, cz: number, budgetMs?: number) => boolean };
/** Budget per call of a resumable module plan (`prefetchStep`). */
export const PLAN_STEP_MS = 3;

/** Cells read around a chunk by the modules (neighbour masks, density blends): chunk + this many cells of border. */
export const WARM_BORDER = 2;
const WARM_BATCH = 24;

export interface Step {
  kind: StepKind;
  /** module id for 'module' / 'plan' steps */
  id?: string;
  /** Returns false when the step is not finished yet (it runs again on the next step() call). */
  run(): void | boolean;
}

export class BuildJob {
  readonly key: string;
  readonly info: ChunkInfo;
  readonly out: ChunkBuilder;
  private steps: Step[] = [];
  private i = 0;
  private group: THREE.Group | null = null;
  readonly started = performance.now();
  /** ms spent in this job's steps */
  ms = 0;
  maxStepMs = 0;
  aborted = false;

  constructor(readonly cx: number, readonly cz: number, private ctx: CoreContext, warm: boolean) {
    this.key = chunkKey(cx, cz);
    this.info = { cx, cz, cells: [...chunkCells(cx, cz)] };
    this.out = new ChunkBuilder(this.info, ctx.assets,ctx.world.seed);
    const ch = ctx.chunks;
    if (warm) {
      const cells: [number, number][] = [];
      for (let r = cz * CHUNK - WARM_BORDER; r < (cz + 1) * CHUNK + WARM_BORDER; r++)
        for (let q = cx * CHUNK - WARM_BORDER; q < (cx + 1) * CHUNK + WARM_BORDER; q++) cells.push([q, r]);
      for (let s = 0; s < cells.length; s += WARM_BATCH) {
        const part = cells.slice(s, s + WARM_BATCH);
        this.steps.push({ kind: 'warm', run: () => { for (const [q, r] of part) ctx.world.cell(q, r); } });
      }
    }
    const mods = ch.modules.filter((m) => m.buildChunk && (!ch.moduleFilter || ch.moduleFilter.has(m.id)));
    // modules that offer a pure, cached plan (`services.<id>.prefetch(cx, cz)`: nature, props, …) get it computed in
    // its own step (own frame) → their buildChunk step is merge-only. Idle-time prefetch usually did it already.
    for (const m of mods) {
      const svc = ctx.services.get<Prefetchable>(m.id);
      if (typeof svc?.prefetchStep === 'function') {
        // resumable: the step repeats (one slice per scheduler step) until the module reports the plan complete
        this.steps.push({ kind: 'plan', id: m.id, run: () => this.runPlanStep(m.id, svc) });
        continue;
      }
      if (typeof svc?.prefetch !== 'function') continue;
      this.steps.push({ kind: 'plan', id: m.id, run: () => this.runPlan(m.id, svc) });
    }
    // modules that can build in slices (`services.<id>.buildSteps(chunk, out)` generator, same output as buildChunk)
    // get one slice per scheduler step (CORE_REQUESTS #13); others build in one step
    for (const m of mods) {
      const bs = ctx.services.get<{ buildSteps?: (c: ChunkInfo, o: ChunkBuilder) => Generator<void> }>(m.id)?.buildSteps;
      if (typeof bs === 'function') {
        let it: Generator<void> | null = null;
        this.steps.push({
          kind: 'module',
          id: m.id,
          run: () => {
            try {
              this.out.currentModule = m.id;
              it ??= bs(this.info, this.out);
              return !!it.next().done;
            } catch (e) {
              const ch = this.ctx.chunks;
              ch.degraded.set(m.id, (ch.degraded.get(m.id) ?? 0) + 1);
              if ((ch.degraded.get(m.id) ?? 0) <= 3) console.warn(`[module:${m.id}] buildSteps(${this.cx},${this.cz}) threw`, e);
              return true;
            }
          },
        });
      } else this.steps.push({ kind: 'module', id: m.id, run: () => this.runModule(m) });
    }
    // merge: one bucket per step when core offers ChunkBuilder.finishSteps (CORE_REQUESTS #8), else in one go
    this.steps.push({ kind: 'finish', run: () => this.runFinish() });
    // compile the chunk's shader variants in the background (KHR_parallel_shader_compile) before it is shown:
    // a material variant seen for the first time otherwise stalls the first render (measured 94 ms, 2 programs)
    this.steps.push({ kind: 'compile', run: () => this.compile() });
    this.steps.push({ kind: 'adopt', run: () => this.adopt() });
  }

  private compiled = true;
  private compileDeadline = 0;
  /** Synchronous mode (urgent): no waiting for background shader compiles. */
  sync = false;

  /** Waiting for background shader compilation before adoption. */
  get blocked(): boolean {
    return !this.compiled && this.steps[this.i]?.kind === 'adopt' && performance.now() < this.compileDeadline;
  }

  private compile(): void {
    const r = this.ctx.renderer as THREE.WebGLRenderer & { compileAsync?: (o: THREE.Object3D, c: THREE.Camera, s?: THREE.Scene) => Promise<unknown> };
    if (this.sync || !this.group || typeof r.compileAsync !== 'function') return;
    this.compiled = false;
    this.compileDeadline = performance.now() + 2000;
    // only the variant actually rendered: into a render target when the environment's post composer is active
    // (linear output, no tone mapping), else straight to the canvas — three keys programs on the output target.
    // Compiling the unused variant too made the GPU process stall ~0.85 s a few seconds later.
    const viaRT = usesComposer();
    let p: Promise<unknown>;
    if (viaRT) {
      warmRT ??= new THREE.WebGLRenderTarget(1, 1);
      const prev = r.getRenderTarget();
      r.setRenderTarget(warmRT);
      p = r.compileAsync(this.group, this.ctx.camera, this.ctx.scene);
      r.setRenderTarget(prev);
    } else p = r.compileAsync(this.group, this.ctx.camera, this.ctx.scene);
    p.then(
      () => void (this.compiled = true),
      () => void (this.compiled = true),
    );
  }

  get done(): boolean {
    return this.i >= this.steps.length;
  }

  /** Kind (and module id) of the next step, for cost prediction. */
  peek(): Step | null {
    return this.steps[this.i] ?? null;
  }

  get progress(): string {
    const s = this.steps[this.i];
    return s ? `${s.kind}${s.id ? ':' + s.id : ''} ${this.i}/${this.steps.length}` : 'done';
  }

  /** Run exactly one step. Returns its duration (ms). */
  step(): number {
    if (this.done) return 0;
    if (this.ctx.chunks.loaded.has(this.key)) {
      // someone else (buildAllNow / waitIdle) built it meanwhile → drop ours
      this.abort();
      return 0;
    }
    const s = this.steps[this.i];
    const t0 = performance.now();
    if (s.run() !== false) this.i++;
    const d = performance.now() - t0;
    this.ms += d;
    if (d > this.maxStepMs) this.maxStepMs = d;
    return d;
  }

  /** Finish everything now (urgent chunk). */
  finishNow(): number {
    this.sync = true;
    this.compiled = true;
    let t = 0;
    while (!this.done) t += this.step();
    return t;
  }

  private finishIt: Generator<void, THREE.Group, void> | null = null;
  private runFinish(): boolean {
    const fs = (this.out as unknown as { finishSteps?: () => Generator<void, THREE.Group, void> }).finishSteps;
    if (typeof fs !== 'function' || (this.sync && !this.finishIt)) {
      this.group = this.out.finish();
      return true;
    }
    this.finishIt ??= fs.call(this.out);
    const r = this.finishIt.next();
    if (!r.done) return false;
    this.group = r.value;
    return true;
  }

  private runPlanStep(id: string, svc: Prefetchable): boolean {
    try {
      // synchronous (urgent) builds drain it; sliced builds take one small slice per step
      return svc.prefetchStep!(this.cx, this.cz, this.sync ? Infinity : PLAN_STEP_MS) !== false;
    } catch (e) {
      console.warn(`[streaming] ${id}.prefetchStep(${this.cx},${this.cz}) threw`, e);
      return true;
    }
  }

  private runPlan(id: string, svc: Prefetchable): void {
    try {
      svc.prefetch!(this.cx, this.cz);
    } catch (e) {
      console.warn(`[streaming] ${id}.prefetch(${this.cx},${this.cz}) threw`, e);
    }
  }

  private runModule(m: GameModule): void {
    const ch = this.ctx.chunks;
    this.out.currentModule = m.id;
    try {
      m.buildChunk!(this.info, this.out, this.ctx);
    } catch (e) {
      ch.degraded.set(m.id, (ch.degraded.get(m.id) ?? 0) + 1);
      if ((ch.degraded.get(m.id) ?? 0) <= 3) console.warn(`[module:${m.id}] buildChunk(${this.cx},${this.cz}) threw`, e);
      this.ctx.events.emit('module:error', { id: m.id, error: e });
    }
  }

  private adopt(): void {
    // ChunkManager.adopt: scene + loaded map + 'chunk:loaded' (colliders are streamed separately by the scheduler)
    this.ctx.chunks.adopt(this.cx, this.cz, this.group!, null);
  }

  /** Drop an unfinished job (nothing of it is in the scene yet). */
  abort(): void {
    if (this.aborted) return;
    this.aborted = true;
    this.i = this.steps.length;
    this.group?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry && !m.userData.sharedGeometry && !m.geometry.userData?.shared) m.geometry.dispose();
    });
    this.group = null;
  }
}
