// The streaming scheduler: radius policy, priorities, time-sliced chunk builds, deferred unloads, world prefetch.
//
// It takes over chunk lifecycle from ChunkManager.update(): core keeps its API (wanted(), loaded, unload(),
// buildAllNow() for boot / verification), but with budgetMs < 0, urgentRadius < 0 and a huge unloadMargin its
// per-frame update builds and unloads nothing; this scheduler does both, in slices, nearest/ahead/in-view first.
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { CoreContext } from '../../core/types';
import { chunkKey } from '../../core/hex';
import { CHUNK, HEX_WIDTH } from '../../core/units';
import { BuildJob, WARM_BORDER, PLAN_STEP_MS, type Step } from './job';

/** ChunkManager.wanted() counts a chunk as wanted when its centre is within radius + this (≈ half diagonal). */
export const CHUNK_R = CHUNK * HEX_WIDTH * 0.6;
/** Centre → farthest corner of a chunk parallelogram (m). */
const CHUNK_FAR = 104;

export interface StreamConfig {
  /** Per-frame ms for build steps + prefetch inside update() (ARCHITECTURE §8: ≤ 6 ms). */
  budgetMs: number;
  /** Chunks whose area comes within this many metres of the focus are built immediately (whole). */
  urgentM: number;
  /** Build this many seconds of travel beyond the load radius (min/max metres below). */
  lookaheadS: number;
  lookMin: number;
  lookMax: number;
  /** Prefetch world cells this many seconds of travel beyond the build zone. */
  prefetchS: number;
  /** Extra metres before a chunk is unloaded (hysteresis). */
  unloadMargin: number;
  /** Use requestIdleCallback for world prefetch in the idle tail of frames. */
  idle: boolean;
  /** Forced load radius (m), 0 = policy. */
  radius: number;
  /** Colliders only for chunks whose centre is within this + CHUNK_R of the player or focus (0 = all chunks). */
  colliderM: number;
  /** Before ready only this ring (m, ChunkManager's wanted() radius) is routed and built; the rest grows after. */
  bootR: number;
  /** Per-frame budget while the disc grows from the boot ring to the load radius after ready. */
  growBudgetMs: number;
  /** Run the roads prefetcher before ready (default off: lazy evaluation of the boot ring is cheaper). */
  bootRoads: boolean;
}

interface Phys {
  cx: number;
  cz: number;
  descs: RAPIER.ColliderDesc[];
  body: RAPIER.RigidBody | null;
  pos: number;
}

interface Want { cx: number; cz: number; d: number; key: string; score: number }

type RoadsPrefetcher = { update(fx: number, fz: number, budgetMs: number): void; radiusCells: number; done: number; ms: number; gen?: unknown };

const DEFAULT_COST: Record<string, number> = { warm: 0.4, plan: 4, module: 2.5, finish: 0.8, compile: 1, adopt: 0.2 };
/** Modules whose `services.<id>.prefetch(cx, cz)` computes a pure, cached chunk plan. */
const PLAN_MODULES = ['nature', 'props', 'terrain', 'villages', 'roads'];
const COLLIDER_BATCH = 120;

export class Streamer {
  cfg: StreamConfig;
  /** Radius the policy wants (m). */
  targetR = 190;
  /** Every chunk counted as wanted at this radius is loaded (m). */
  coveredR = 190;
  /** What ChunkManager.config.loadRadius (→ environment fog edge) is set to. */
  configR = 190;
  speed = 0;
  readonly vel = new THREE.Vector2();
  private prevFocus = new THREE.Vector3();
  private hasPrev = false;
  private camFwd = new THREE.Vector2(0, -1);

  job: BuildJob | null = null;
  /** Finished jobs waiting for background shader compilation before adoption. */
  readonly waiting: BuildJob[] = [];
  /** Until the engine is ready: build the whole load disc synchronously (boot / loading screen). */
  boot = true;
  /** Boot timeline (ms since navigation start) and the work done before ready. */
  readonly bootT = { initAt: 0, firstUpdateAt: 0, readyAt: 0, fullAt: 0, roadsMs: 0, buildMs: 0, chunks: 0 };
  /** Disc still growing from the boot ring to the load radius. */
  growing = true;
  /** After a focus jump: larger budget until the disc is covered again. */
  recover = false;
  /** Smallest covered radius seen while playing (a dip below target pulls the fog in) and how often it happened. */
  minCovered = Infinity;
  fogPulls = 0;
  lastPull: unknown = null;
  buildQ: Want[] = [];
  prefetchQ: Want[] = [];
  readonly warmed = new Set<string>();
  planMs = 0;
  /** `<chunk>|<module>` plans already prefetched. */
  readonly planned = new Set<string>();
  private warmIt: Generator<void> | null = null;
  private warmKey = '';
  roads: RoadsPrefetcher | null = null;
  private cost = new Map<string, number>();
  private qAge = 99;
  private qFocus = new THREE.Vector3(1e9, 0, 0);
  private qR = 0;

  // stats
  frameWork = 0; // ms of scheduler work this frame
  frameNote = '';
  /** Work done in requestIdleCallback since the last frame (reported with the next frame). */
  idleNote = '';
  maxFrameWork = 0;
  built = 0;
  urgentBuilt = 0;
  unloaded = 0;
  prefetchMs = 0;
  idleMs = 0;
  jobMs: number[] = [];
  maxStep = { ms: 0, what: '' };

  constructor(private ctx: CoreContext, cfg: Partial<StreamConfig>) {
    this.cfg = { budgetMs: 6, urgentM: 70, lookaheadS: 6, lookMin: 30, lookMax: 90, prefetchS: 10, unloadMargin: 40, idle: true, radius: 0, colliderM: 110, bootR: 120, growBudgetMs: 10, bootRoads: false, ...cfg };
    ctx.events.on('surface:changed',()=>{
      this.job?.abort();this.job=null;for(const j of this.waiting)j.abort();this.waiting.length=0;
      this.warmIt=null;this.warmed.clear();this.planned.clear();this.buildQ=[];this.prefetchQ=[];this.qAge=99;
    });
    ctx.events.on('chunk:unloaded', ({ cx, cz }) => {
      const k = chunkKey(cx, cz);
      const p = this.phys.get(k);
      if (p?.body) this.ctx.physics.world.removeRigidBody(p.body);
      this.phys.delete(k);
      this.warmed.delete(k);
      for (const id of PLAN_MODULES) this.planned.delete(k + '|' + id);
    });
  }

  /** Collider descs of chunks built by this scheduler; bodies exist only near the player / focus. */
  readonly phys = new Map<string, Phys>();
  physBodies = 0;
  physColliders = 0;

  /** Hand chunk lifecycle over from ChunkManager.update() to this scheduler. */
  takeOver(): void {
    const ch = this.ctx.chunks;
    ch.configure({ budgetMs: -1, urgentRadius: -1, unloadMargin: 1e7 });
    // buildAllNow() / __kfb.waitIdle() build through us too → every chunk gets streamed colliders
    ch.externalBuild = (cx, cz) => this.buildNow(cx, cz);
  }

  /** Synchronous whole build (core's buildAllNow via externalBuild, urgent chunks). */
  buildNow(cx: number, cz: number): void {
    const key = chunkKey(cx, cz);
    if (this.ctx.chunks.loaded.has(key)) return;
    const wi = this.waiting.findIndex((j) => j.key === key);
    const job = this.job?.key === key ? this.job : wi >= 0 ? this.waiting.splice(wi, 1)[0] : new BuildJob(cx, cz, this.ctx, !this.warmed.has(key));
    job.finishNow();
    if (job === this.job) this.job = null;
    if (!job.aborted) {
      this.built++;
      this.urgentBuilt++;
      this.noteJob(job);
    }
  }

  /** Give it back (module failure / dispose). */
  release(): void {
    this.ctx.chunks.externalBuild = null;
    this.job?.abort();
    this.job = null;
    for (const j of this.waiting) j.abort();
    this.waiting.length = 0;
    this.ctx.chunks.configure({ budgetMs: 6, urgentRadius: 70, unloadMargin: 40 });
  }

  get lookM(): number {
    return THREE.MathUtils.clamp(this.speed * this.cfg.lookaheadS, this.cfg.lookMin, this.cfg.lookMax);
  }

  // ---------------------------------------------------------------- policy
  /** Load radius: what the environment says the current view needs (fog edge), else the core default. */
  policyRadius(): number {
    if (this.cfg.radius > 0) return this.cfg.radius;
    const env = this.ctx.services.get<{ requiredLoadRadius?: number }>('environment');
    const r = env?.requiredLoadRadius;
    return typeof r === 'number' && r > 0 ? r : 190;
  }

  /**
   * Nature hides near detail (bushes, small rocks, grass) per chunk by the chunk centre's distance to the camera
   * (default 125 m): items up to ~100 m closer than the centre appeared at 70–100 m ahead at 12 m/s (critic r2).
   * 250 m puts the switch at ≥ ~150 m, inside the haze (+20 draw calls, +0.12 M triangles, GPU within noise).
   */
  private natDone = '';
  private natFarDefault = -1;
  natureDetailR = 250;
  private natureRadii(): void {
    const P = this.ctx.params;
    const nat = this.ctx.services.get<{ detailRadius?: number; farRadius?: number }>('nature');
    if (!nat || !('detailRadius' in nat)) return;
    if (this.natFarDefault < 0) this.natFarDefault = nat.farRadius ?? 150;
    // camera height above the focus ground: follow cameras (≤ 25 m) keep full detail; high views (≥ 60 m: overview,
    // aerial, disc) see every chunk from far away → far-LOD trees beyond 60 m and near detail only within 100 m
    // (measured aerial seed 42: 1.71 M tris / 410 draw calls → 1.12 M / 325; disc 1.69 M → 1.25 M)
    const f = this.ctx.chunks.focus, cam = this.ctx.camera.position;
    const h = cam.y - this.ctx.world.heightAt(f.x, f.z);
    const k = THREE.MathUtils.clamp((h - 25) / 35, 0, 1);
    const q10 = (x: number) => Math.round(x / 10) * 10;
    const detail = q10(THREE.MathUtils.lerp(Math.min(this.natureDetailR, this.targetR), 100, k));
    const far = q10(THREE.MathUtils.lerp(this.natFarDefault, 60, k));
    const key = detail + '/' + far;
    if (key === this.natDone) return;
    this.natDone = key;
    if (!P.has('natdetail')) nat.detailRadius = detail;
    if (!P.has('natfar') && 'farRadius' in nat) nat.farRadius = far;
  }

  // ---------------------------------------------------------------- per frame
  update(dt: number): void {
    const t0 = performance.now();
    if (!this.bootT.firstUpdateAt) this.bootT.firstUpdateAt = Math.round(t0);
    this.frameNote = '';
    const ch = this.ctx.chunks;
    const f = ch.focus;
    // focus velocity (smoothed), teleport → reset
    if (this.hasPrev && dt > 0) {
      const dx = f.x - this.prevFocus.x, dz = f.z - this.prevFocus.z;
      if (Math.hypot(dx, dz) > 20) {
        // teleport / verification preset jump (> 20 m in one frame; 12 m/s moves ≤ 1.2 m): keep the fog where the view needs it (core's buildAllNow in
        // __kfb.waitIdle builds the disc synchronously) and catch up with a larger per-frame budget
        this.vel.set(0, 0);
        this.recover = true;
        this.configR = Math.max(this.configR, this.policyRadius());
      }
      else {
        const k = 1 - Math.exp(-dt / 0.4);
        this.vel.x += (dx / dt - this.vel.x) * k;
        this.vel.y += (dz / dt - this.vel.y) * k;
      }
    }
    this.prevFocus.copy(f);
    this.hasPrev = true;
    this.speed = this.vel.length();
    const cam = this.ctx.camera;
    const fw = new THREE.Vector3();
    cam.getWorldDirection(fw);
    if (Math.hypot(fw.x, fw.z) > 1e-3) this.camFwd.set(fw.x, fw.z).normalize();

    this.targetR = this.policyRadius();
    this.natureRadii();
    const look = this.lookM;
    const buildR = this.targetR + look;

    // queues (cheap; refreshed every few frames or after moving)
    if (++this.qAge >= 4 || this.boot || this.qFocus.distanceToSquared(f) > 25 || Math.abs(buildR - this.qR) > 5) this.refreshQueues(buildR);

    // covered radius → ChunkManager.config.loadRadius (fog edge never beyond what is built)
    let cov = this.targetR;
    let missing: Want | null = null;
    for (const w of this.buildQ)
      if (w.d - CHUNK_R - 1 < cov && !ch.loaded.has(w.key)) {
        cov = w.d - CHUNK_R - 1;
        missing = w;
      }
    this.coveredR = cov;
    if (this.recover && cov >= this.targetR - 1) this.recover = false;
    // a real dip: something inside the current fog radius is missing (the fog has to come in)
    if (!this.boot && !this.recover && cov < this.configR - 1 && cov < this.minCovered) this.minCovered = cov;
    if (this.boot) this.configR = cov; // loading screen: no smoothing, the disc is built synchronously
    else if (this.recover) this.configR = Math.max(this.configR, this.targetR);
    else if (cov < this.configR) {
      if (this.configR - cov > 1) {
        this.fogPulls++;
        const c = missing ? ch.chunkCenter(missing.cx, missing.cz) : null;
        const dot = c && missing && this.speed > 0.5 ? ((c.x - f.x) * this.vel.x + (c.z - f.z) * this.vel.y) / (missing.d * this.speed) : null;
        this.lastPull = { t: +(performance.now() / 1000).toFixed(1), from: Math.round(this.configR), to: Math.round(cov), key: missing?.key, d: missing && Math.round(missing.d), dot: dot === null ? null : +dot.toFixed(2), speed: +this.speed.toFixed(1), job: this.job?.key ?? null, waiting: this.waiting.map((j) => j.key), focus: [Math.round(f.x), Math.round(f.z)], target: this.targetR };
      }
      this.configR = Math.max(90, cov);
    } else this.configR = Math.min(this.targetR, cov, this.configR + 40 * Math.min(dt, 0.1));
    const R = Math.round(this.configR);
    if (Math.abs(ch.config.loadRadius - R) >= 1) ch.configure({ loadRadius: R });

    // 0. loading screen: only the boot ring is built (roads evaluated lazily for exactly those cells). Measured seed
    //    123: running the roads prefetcher here (even for the boot ring) cost 8.8 s vs 7.4 s for the lazy ring build —
    //    it also routes regions/rivers the ring never reads. After ready it prefetches the rest in slices.
    const bootR = Math.min(this.cfg.bootR, this.targetR);
    if (this.boot && this.roads && this.cfg.bootRoads) {
      const tb = performance.now();
      this.roads.radiusCells = (bootR + CHUNK_FAR) / HEX_WIDTH + 2;
      this.roads.update(f.x, f.z, 60000);
      const bm = performance.now() - tb;
      this.bootT.roadsMs += bm;
      if (bm > 4) this.frameNote += `boot roads-prefetch ${bm.toFixed(0)}ms; `;
    }

    // 1. urgent chunks: whole build now (before 'ready': the whole disc, like ChunkManager.buildAllNow)
    for (const w of this.buildQ) {
      // (boot ring ≥ load radius: also the look-ahead band, so nothing is adopted in the first seconds after ready)
      const bootEdge = bootR >= this.targetR ? buildR : bootR;
      if (this.boot ? w.d - CHUNK_R > bootEdge : w.d - CHUNK_FAR >= this.cfg.urgentM) break; // buildQ is distance-sorted
      if (ch.loaded.has(w.key)) continue;
      const ts = performance.now();
      this.buildNow(w.cx, w.cz);
      const ms = performance.now() - ts;
      if (this.boot) {
        this.bootT.buildMs += ms;
        this.bootT.chunks++;
      }
      this.frameNote += `urgent ${w.key} ${ms.toFixed(0)}ms; `;
    }

    // 2. deferred unload (at most one per frame; more only when far behind). Chunks ahead of travel are kept up to
    //    the build zone, everything else beyond the load radius + margin goes.
    const keepR = this.targetR + this.cfg.unloadMargin;
    const keepAheadR = buildR + this.cfg.unloadMargin;
    const vx = this.speed > 0.5 ? this.vel.x / this.speed : 0, vz = this.speed > 0.5 ? this.vel.y / this.speed : 0;
    let unl = 0;
    // the ground under the player stays even while a verification camera looks far away (focus ≠ player)
    const pl = this.ctx.services.get<{ position?: THREE.Vector3 }>('player')?.position;
    for (const [k, c] of ch.loaded) {
      const cc = ch.chunkCenter(c.cx, c.cz);
      const d = Math.hypot(cc.x - f.x, cc.z - f.z);
      if (d - CHUNK_R <= keepR) continue;
      if (pl && Math.hypot(cc.x - pl.x, cc.z - pl.z) - CHUNK_FAR <= 60) continue;
      if (d - CHUNK_R <= keepAheadR && ((cc.x - f.x) * vx + (cc.z - f.z) * vz) / d > -0.5) continue;
      if (unl >= 1 && d - CHUNK_R < keepR + 200) continue;
      ch.unload(k);
      this.warmed.delete(k);
      this.unloaded++;
      unl++;
      this.frameNote += `unload ${k}; `;
      if (unl >= 4) break;
    }

    // 3. time-sliced build steps
    // growing from the boot ring to the full disc right after ready: a bit more per frame (+ idle slices)
    if (!this.boot && this.growing && cov >= this.targetR - 1) {
      this.growing = false;
      this.bootT.fullAt = Math.round(performance.now());
    }
    const budget = this.recover ? Math.max(this.cfg.budgetMs, 24) : this.growing && !this.boot ? Math.max(this.cfg.budgetMs, this.cfg.growBudgetMs) : this.cfg.budgetMs;
    let spent: number;
    // jobs waiting for their shaders: adopt the ones that are ready (cheap)
    // (at most one adoption per frame: each new chunk uploads its buffers on its first render)
    for (let i = this.waiting.length - 1, adopted = 0; i >= 0 && adopted < 1; i--) {
      const j = this.waiting[i];
      if (j.blocked) continue;
      adopted++;
      this.waiting.splice(i, 1);
      j.step();
      if (!j.aborted) {
        this.built++;
        this.noteJob(j);
        this.frameNote += `built ${j.key}; `;
      }
    }
    spent = performance.now() - t0;
    while (spent < budget) {
      if (this.job?.blocked) {
        this.waiting.push(this.job);
        this.job = null;
      }
      if (!this.job) this.job = this.nextJob();
      if (!this.job) break;
      const s = this.job.peek();
      const pred = s ? this.predict(s) : 0;
      if (spent > 0.5 && spent + pred > budget) break;
      const what = s ? s.kind + (s.id ? ':' + s.id : '') : '';
      const ms = this.job.step();
      if (s) this.learn(s, ms);
      if (ms > this.maxStep.ms) this.maxStep = { ms: +ms.toFixed(1), what };
      if (ms > 4) this.frameNote += `${what} ${ms.toFixed(0)}ms; `;
      spent = performance.now() - t0;
      if (this.job.done) {
        if (!this.job.aborted) {
          this.built++;
          this.noteJob(this.job);
          this.frameNote += `built ${this.job.key}; `;
        }
        this.job = null;
      }
    }

    // 4. colliders near the player / focus only
    this.physicsPass();
    spent = performance.now() - t0;

    // 5. prefetch with what is left
    if (spent < budget) {
      const p0 = performance.now();
      this.prefetch(budget - spent);
      const pm = performance.now() - p0;
      this.prefetchMs += pm;
      if (pm > 4) this.frameNote += `prefetch ${pm.toFixed(0)}ms; `;
    }
    this.frameWork = performance.now() - t0;
    if (this.frameWork > this.maxFrameWork) this.maxFrameWork = this.frameWork;
    // biggest item first, with the scheduler's total and any idle-callback work since the last frame
    const items = (this.frameNote + this.idleNote).split('; ').filter(Boolean);
    const msOf = (x: string) => Number(/(\d+(?:\.\d+)?)ms$/.exec(x)?.[1] ?? 0);
    items.sort((a, b) => msOf(b) - msOf(a));
    this.frameNote = items.length || this.frameWork > 4 ? `streaming ${this.frameWork.toFixed(0)}ms: ${items.join('; ')}` : '';
    this.idleNote = '';
    if (this.cfg.idle) this.scheduleIdle();
  }

  /**
   * Rapier holds only chunks near the player or the focus: per-step cost scales with the collider count (measured
   * 0.70 ms/step with 5.7 k colliders vs 0.15 ms with 1 k). Chunks that must have ground now get all colliders at
   * once; others in batches; far ones are removed (one per frame).
   */
  private physicsPass(): void {
    const W = this.ctx.physics.world;
    const ch = this.ctx.chunks;
    const pts: { x: number; z: number }[] = [ch.focus];
    const pl = this.ctx.services.get<{ position?: THREE.Vector3 }>('player')?.position;
    if (pl && Math.hypot(pl.x - ch.focus.x, pl.z - ch.focus.z) > 5) pts.push(pl);
    const onR = this.cfg.colliderM > 0 ? this.cfg.colliderM + CHUNK_R : Infinity;
    const offR = onR + 60;
    let budget = COLLIDER_BATCH, removed = 0;
    let bodies = 0, cols = 0;
    for (const [k, p] of this.phys) {
      const c = ch.chunkCenter(p.cx, p.cz);
      let d = Infinity;
      for (const q of pts) d = Math.min(d, Math.hypot(c.x - q.x, c.z - q.z));
      if (d <= onR) {
        const must = d - CHUNK_FAR <= 35; // the player may stand on it within a second
        if (!p.body) p.body = W.createRigidBody(this.ctx.rapier.RigidBodyDesc.fixed());
        while (p.pos < p.descs.length && (must || budget > 0)) {
          try {
            W.createCollider(p.descs[p.pos], p.body);
          } catch (e) {
            console.warn('[streaming] collider failed', e);
          }
          p.pos++;
          budget--;
        }
      } else if (p.body && d > offR && removed < 1) {
        W.removeRigidBody(p.body);
        p.body = null;
        p.pos = 0;
        removed++;
        this.frameNote += `colliders off ${k}; `;
      }
      if (p.body) {
        bodies++;
        cols += p.pos;
      }
    }
    this.physBodies = bodies;
    this.physColliders = cols;
  }

  private noteJob(j: BuildJob): void {
    if (j.out.colliders.length) this.phys.set(j.key, { cx: j.cx, cz: j.cz, descs: j.out.colliders, body: null, pos: 0 });
    this.jobMs.push(+j.ms.toFixed(1));
    if (this.jobMs.length > 200) this.jobMs.shift();
  }

  private predict(s: Step): number {
    return this.cost.get(s.kind + (s.id ?? '')) ?? DEFAULT_COST[s.kind] ?? 2;
  }

  private learn(s: Step, ms: number): void {
    const k = s.kind + (s.id ?? '');
    const p = this.cost.get(k);
    // pessimistic EMA: rises fast, decays slowly
    this.cost.set(k, p === undefined ? ms : ms > p ? p + (ms - p) * 0.5 : p + (ms - p) * 0.1);
  }

  private score(cx: number, cz: number, d: number): number {
    const ch = this.ctx.chunks;
    const c = ch.chunkCenter(cx, cz);
    const f = ch.focus;
    const ux = (c.x - f.x) / (d || 1), uz = (c.z - f.z) / (d || 1);
    let s = d;
    if (this.speed > 0.5) {
      const vx = this.vel.x / this.speed, vz = this.vel.y / this.speed;
      s -= Math.max(0, ux * vx + uz * vz) * Math.min(d, this.speed * 5 + 30);
    }
    s -= 25 * Math.max(0, ux * this.camFwd.x + uz * this.camFwd.y);
    return s;
  }

  private refreshQueues(buildR: number): void {
    const ch = this.ctx.chunks;
    this.qAge = 0;
    this.qR = buildR;
    this.qFocus.copy(ch.focus);
    // build zone: the load disc all around + the look-ahead band in the direction of travel (the same rule, with
    // hysteresis, keeps chunks from being unloaded → no build/unload thrash)
    const ux = this.speed > 0.5 ? this.vel.x / this.speed : 0, uz = this.speed > 0.5 ? this.vel.y / this.speed : 0;
    this.buildQ = ch
      .wanted(buildR)
      .filter((w) => {
        if (w.d - CHUNK_R <= this.targetR) return true;
        const c = ch.chunkCenter(w.cx, w.cz);
        // everything not behind: chunks also enter the disc from the flanks (a 0.2 cut let them arrive unbuilt and
        // pulled the fog in once in a real-input run)
        return ((c.x - ch.focus.x) * ux + (c.z - ch.focus.z) * uz) / w.d > -0.3;
      })
      .map((w) => ({ ...w, key: chunkKey(w.cx, w.cz), score: this.score(w.cx, w.cz, w.d) }));
    // prefetch: ahead of travel (or all around when standing) beyond the build zone
    const preR = buildR + Math.max(60, this.speed * this.cfg.prefetchS);
    const vx = this.speed > 0.5 ? this.vel.x / this.speed : 0, vz = this.speed > 0.5 ? this.vel.y / this.speed : 0;
    this.prefetchQ = ch
      .wanted(preR)
      .filter((w) => {
        const key = chunkKey(w.cx, w.cz);
        if (ch.loaded.has(key) || this.warmed.has(key)) return false;
        if (this.speed <= 0.5 || w.d - CHUNK_R <= buildR) return true;
        const c = ch.chunkCenter(w.cx, w.cz);
        return ((c.x - ch.focus.x) * vx + (c.z - ch.focus.z) * vz) / w.d > 0.2;
      })
      .map((w) => ({ ...w, key: chunkKey(w.cx, w.cz), score: this.score(w.cx, w.cz, w.d) }))
      .sort((a, b) => a.score - b.score);
  }

  private nextJob(): BuildJob | null {
    const ch = this.ctx.chunks;
    let best: Want | null = null;
    // while the disc grows after boot: strictly nearest first (even rings → no fog pull from an unbuilt flank chunk)
    const sc = (w: Want) => (this.growing ? w.d : w.score);
    for (const w of this.buildQ) if (!ch.loaded.has(w.key) && !this.waiting.some((j) => j.key === w.key) && (!best || sc(w) < sc(best))) best = w;
    if (!best) return null;
    return new BuildJob(best.cx, best.cz, this.ctx, !this.warmed.has(best.key));
  }

  // ---------------------------------------------------------------- prefetch
  /** Warm world cells of upcoming chunks (cell-granular) and the roads network ahead (if available). */
  prefetch(budgetMs: number): void {
    const t0 = performance.now();
    // roads/rivers network ahead of travel first: its first query per macro region is the big one
    if (this.roads) {
      const f = this.ctx.chunks.focus;
      // radius: the prefetcher's river part reads stage-3 cells (= road regions) up to its radius; a disc narrower
      // than this lets those reads compute whole road regions lazily inside one step (measured on a 1.75 km
      // flythrough: 77 vs 24 own-CPU frames > 33 ms with the narrower disc)
      const ahead = this.speed > 0.5 ? Math.min(this.speed * 8, 150) / this.speed : 0;
      this.roads.radiusCells = (this.targetR + CHUNK_FAR) / HEX_WIDTH + 4;
      this.roads.update(f.x + this.vel.x * ahead, f.z + this.vel.y * ahead, Math.max(0.5, budgetMs * 0.6));
      const rm = performance.now() - t0;
      if (rm > 4) this.frameNote += `roads-prefetch ${rm.toFixed(0)}ms; `;
    }
    // module plan hooks (nature, props, …) for the next chunks of the build order, once their cells are warm:
    // one hook call per slice (each can be several ms), nearest/ahead first
    if (performance.now() - t0 < budgetMs) {
      const sv = this.ctx.services;
      let n = 0;
      // the build queue in build order, then the warmed chunks further ahead (props' village plans cost 18–63 ms
      // each when not prefetched: compute them well before the chunk is due)
      const cands: { cx: number; cz: number; key: string }[] = [...this.buildQ].sort((a, b) => a.score - b.score);
      for (const k of this.warmed) {
        const [cx, cz] = k.split(',').map(Number);
        cands.push({ cx, cz, key: k });
      }
      outer: for (const w of cands) {
        if (this.ctx.chunks.loaded.has(w.key) || w.key === this.job?.key) continue;
        if (++n > 40) break;
        if (!this.warmed.has(w.key)) continue;
        for (const id of PLAN_MODULES) {
          const pk = w.key + '|' + id;
          if (this.planned.has(pk)) continue;
          const svc = sv.get<{ prefetch?: (cx: number, cz: number) => void; prefetchStep?: (cx: number, cz: number, ms?: number) => boolean }>(id);
          const step = svc?.prefetchStep, h = svc?.prefetch;
          if (typeof step !== 'function' && typeof h !== 'function') {
            this.planned.add(pk);
            continue;
          }
          const ts = performance.now();
          try {
            // resumable modules (props): small slices until done, never the drain-all call in a frame
            if (typeof step === 'function') {
              const left = Math.max(1, Math.min(PLAN_STEP_MS, budgetMs - (ts - t0)));
              if (step(w.cx, w.cz, left) !== false) this.planned.add(pk);
            } else {
              this.planned.add(pk);
              h!(w.cx, w.cz);
            }
          } catch (e) {
            this.planned.add(pk);
            console.warn(`[streaming] ${id}.prefetch threw`, e);
          }
          const hm = performance.now() - ts;
          this.planMs += hm;
          if (hm > 4) this.frameNote += `plan:${id} ${w.key} ${hm.toFixed(0)}ms; `;
          break outer;
        }
      }
    }
    while (performance.now() - t0 < budgetMs) {
      if (!this.warmIt) {
        const w = this.prefetchQ.find((x) => !this.warmed.has(x.key) && !this.ctx.chunks.loaded.has(x.key) && x.key !== this.job?.key && this.roadsReady(x.cx, x.cz));
        if (!w) return;
        this.warmKey = w.key;
        this.warmIt = this.warmChunk(w.cx, w.cz);
      }
      const ts = performance.now();
      const fin = this.warmIt.next().done;
      const ws = performance.now() - ts;
      if (ws > 4) this.frameNote += `warm ${this.warmKey} ${ws.toFixed(0)}ms; `;
      if (fin) {
        this.warmed.add(this.warmKey);
        this.warmIt = null;
      }
    }
  }

  /** Road network handle (hasRegion) + macro size, set by the module when the roads module is present. */
  roadNet: { hasRegion(I: number, J: number): boolean } | null = null;
  macro = 13;
  /**
   * Don't warm a chunk's cells before the roads prefetcher has routed its macro regions: the first cell lookup in an
   * unrouted region computes the whole region (100–900 ms) in one call; the prefetcher does it in slices.
   */
  private roadsReady(cx: number, cz: number): boolean {
    const n = this.roadNet;
    if (!n) return true;
    const M = this.macro;
    const q0 = Math.floor((cx * CHUNK - WARM_BORDER) / M), q1 = Math.floor(((cx + 1) * CHUNK + WARM_BORDER) / M);
    const r0 = Math.floor((cz * CHUNK - WARM_BORDER) / M), r1 = Math.floor(((cz + 1) * CHUNK + WARM_BORDER) / M);
    for (let I = q0; I <= q1; I++) for (let J = r0; J <= r1; J++) if (!n.hasRegion(I, J)) return false;
    return true;
  }

  private *warmChunk(cx: number, cz: number): Generator<void> {
    const w = this.ctx.world;
    let n = 0;
    for (let r = cz * CHUNK - WARM_BORDER; r < (cz + 1) * CHUNK + WARM_BORDER; r++)
      for (let q = cx * CHUNK - WARM_BORDER; q < (cx + 1) * CHUNK + WARM_BORDER; q++) {
        w.cell(q, r);
        if (++n % 6 === 0) yield;
      }
  }

  private idlePending = false;
  private scheduleIdle(): void {
    if (this.idlePending || typeof requestIdleCallback !== 'function') return;
    this.idlePending = true;
    requestIdleCallback(
      (dl) => {
        this.idlePending = false;
        const left = dl.timeRemaining() - 2;
        if (left < 1) return;
        const t = performance.now();
        const note = this.frameNote;
        this.frameNote = '';
        try {
          this.prefetch(Math.min(left, 8));
        } catch (e) {
          console.warn('[streaming] idle prefetch failed', e);
        }
        const im = performance.now() - t;
        this.idleMs += im;
        if (im > 4) this.idleNote += this.frameNote.split('; ').filter(Boolean).map((x) => 'idle ' + x).join('; ') + `; idle-prefetch ${im.toFixed(0)}ms; `;
        this.frameNote = note;
      },
      { timeout: 500 },
    );
  }

  /** Chunks counted as wanted at the target radius that are not loaded yet. */
  pendingAtTarget(): number {
    let n = 0;
    for (const w of this.buildQ) if (w.d - CHUNK_R <= this.targetR && !this.ctx.chunks.loaded.has(w.key)) n++;
    return n;
  }
}
