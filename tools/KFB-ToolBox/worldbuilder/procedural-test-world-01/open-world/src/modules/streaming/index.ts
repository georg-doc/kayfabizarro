// streaming module: owns chunk lifecycle timing (time-sliced builds, deferred unloads, prefetch), the load-radius
// policy, a perf HUD (?hud=1), frame-time statistics (service `streaming`, window.__kfb.streaming) and a flythrough
// perf test (?flythrough=1, /?showcase=streaming). See NOTES.md.
import * as THREE from 'three';
import type { CameraView, CoreContext, GameModule } from '../../core/types';
import { orbitToView } from '../../core/debug';
import { FrameRecorder } from './recorder';
import { Streamer, CHUNK_R } from './streamer';
import { Flythrough } from './fly';
import { Hud } from './hud';
import { GpuTimer } from './gpu';
import { usesComposer } from './job';
import { AdaptiveQuality } from './adaptive';

let ctxRef: CoreContext | null = null;
let rec: FrameRecorder | null = null;
let streamer: Streamer | null = null;
let fly: Flythrough | null = null;
let hud: Hud | null = null;
let gpu: GpuTimer | null = null;
let adaptive: AdaptiveQuality | null = null;
let active = false;
let failures = 0;
let flyPending: null | { speed: number; secs: number; dir: number } = null;
let lastFly: ReturnType<Flythrough['summary']> | null = null;
let ready = false;
let frameNo = 0;
let warmState = 0;
let forced: THREE.Object3D[] = [];

/**
 * Behind the loading screen: render one frame with every chunk object visible (nature's near-detail / far-LOD
 * objects are normally hidden by distance), so their shader variants — incl. shadow-depth and post-pass override
 * variants that renderer.compileAsync cannot reach — are compiled before play. Without it the first bush/grass chunk
 * entering the detail radius stalled one render by 50–94 ms (2 new programs) a few seconds after spawn.
 */
function warmPrograms(ctx: CoreContext): void {
  if (warmState === 0) {
    ctx.chunks.root.traverse((o) => {
      if (!o.visible) {
        o.visible = true;
        forced.push(o);
      }
    });
    // objects outside the boot camera's frustum are not rendered by that frame: compile every chunk material for
    // both output targets (composer render target / canvas) — a lake outside the first view otherwise compiled its
    // water/shore programs (103 ms) the moment it came into view
    const r = ctx.renderer;
    try {
      if (usesComposer()) {
        const rt = new THREE.WebGLRenderTarget(1, 1);
        const prev = r.getRenderTarget();
        r.setRenderTarget(rt);
        r.compile(ctx.chunks.root, ctx.camera, ctx.scene);
        r.setRenderTarget(prev);
        rt.dispose();
      } else r.compile(ctx.chunks.root, ctx.camera, ctx.scene);
    } catch (e) {
      console.warn('[streaming] boot shader compile failed', e);
    }
    // and draw the full pipeline (environment's composer if present) once per 60° of yaw: the GPU process builds
    // its pipeline states for every program × target on first draw — measured as 40–135 ms GPU frames in the first
    // seconds of a run, when the camera first turns
    // shadow-depth variants (alpha-tested maps, instancing) are compiled by the shadow pass on first use and
    // compileAsync cannot reach them: put one tiny caster per material (plain + instanced) at the spawn for the
    // warm-up draws below (measured: late ' depth' programs stalled single frames by 67–124 ms)
    const dummies = new THREE.Group();
    const box = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    try {
      const mats = new Set<THREE.Material>(ctx.assets.allMaterials());
      ctx.chunks.root.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (m) for (const x of Array.isArray(m) ? m : [m]) mats.add(x);
      });
      const f = ctx.chunks.focus;
      const y = ctx.world.heightAt(f.x, f.z) + 1;
      let i = 0;
      for (const m of mats) {
        const a = new THREE.Mesh(box, m);
        const b = new THREE.InstancedMesh(box, m, 1);
        for (const o of [a, b]) {
          o.castShadow = o.receiveShadow = true;
          o.position.set(f.x + (i % 12) * 0.4 - 2.4, y + Math.floor(i / 12) * 0.4, f.z);
          o.frustumCulled = false;
          dummies.add(o);
          i++;
        }
      }
      ctx.scene.add(dummies);
    } catch (e) {
      console.warn('[streaming] shadow warm-up casters failed', e);
    }
    try {
      const eng = (window as unknown as { __kfb?: { engine?: { renderOverride?: ((dt: number) => void) | null } } }).__kfb?.engine;
      const cam = ctx.camera;
      const pos = cam.position.clone(), quat = cam.quaternion.clone();
      const f = ctx.chunks.focus;
      const y = ctx.world.heightAt(f.x, f.z);
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        cam.position.set(f.x - Math.sin(a) * 9, y + 4, f.z - Math.cos(a) * 9);
        cam.lookAt(f.x + Math.sin(a) * 30, y, f.z + Math.cos(a) * 30);
        cam.updateMatrixWorld();
        if (eng?.renderOverride) eng.renderOverride(0);
        else r.render(ctx.scene, cam);
      }
      cam.position.copy(pos);
      cam.quaternion.copy(quat);
      cam.updateMatrixWorld();
    } catch (e) {
      console.warn('[streaming] boot warm-up render failed', e);
    }
    ctx.scene.remove(dummies);
    dummies.traverse((o) => (o as THREE.InstancedMesh).isInstancedMesh && (o as THREE.InstancedMesh).dispose());
    box.dispose();
    warmState = 1;
  } else if (warmState === 1) {
    for (const o of forced) o.visible = false;
    forced = [];
    warmState = 2;
  }
}

const num = (p: URLSearchParams, k: string, d: number) => (p.has(k) && p.get(k) !== '' && Number.isFinite(Number(p.get(k))) ? Number(p.get(k)) : d);

function startFly(speed: number, secs: number, dir: number): void {
  const ctx = ctxRef;
  if (!ctx || !fly || !rec) return;
  const p = ctx.services.get<{ position?: THREE.Vector3 }>('player')?.position ?? ctx.chunks.focus;
  fly.speed = speed;
  fly.secs = secs;
  fly.start(p.x, p.z, dir);
  rec.reset();
}

function stats() {
  const ctx = ctxRef!;
  const s = streamer;
  const w = rec?.window(300);
  const ri = ctx.renderer.info.render;
  return {
    active,
    frame: w,
    gpu: gpu?.available ? gpu.window(300) : null,
    adaptive: adaptive ? { level: adaptive.level, changes: adaptive.changes } : null,
    session: rec?.report(),
    drawCalls: ri.calls,
    triangles: ri.triangles,
    chunks: ctx.chunks.loaded.size,
    pendingAtTarget: s?.pendingAtTarget() ?? ctx.chunks.pending,
    queued: s ? s.buildQ.filter((q) => !ctx.chunks.loaded.has(q.key)).length : 0,
    job: s?.job?.progress ?? null,
    waitingShaders: s?.waiting.length ?? 0,
    built: s?.built ?? 0,
    urgentBuilt: s?.urgentBuilt ?? 0,
    unloaded: s?.unloaded ?? 0,
    frameWorkMs: s ? +s.frameWork.toFixed(2) : 0,
    maxFrameWorkMs: s ? +s.maxFrameWork.toFixed(1) : 0,
    maxStep: s?.maxStep,
    jobMsAvg: s && s.jobMs.length ? +(s.jobMs.reduce((a, b) => a + b, 0) / s.jobMs.length).toFixed(1) : 0,
    prefetch: s && { warmed: s.warmed.size, queue: s.prefetchQ.length, ms: +s.prefetchMs.toFixed(0), idleMs: +s.idleMs.toFixed(0), roads: s.roads ? { regions: s.roads.done, ms: +s.roads.ms.toFixed(0) } : null },
    radius: s && { target: s.targetR, covered: Math.round(s.coveredR), load: ctx.chunks.config.loadRadius, look: Math.round(s.lookM), minCovered: Number.isFinite(s.minCovered) ? Math.round(s.minCovered) : null, fogPulls: s.fogPulls, lastPull: s.lastPull, recovering: s.recover },
    speed: s ? +s.speed.toFixed(2) : 0,
    physics: s && { bodies: s.physBodies, colliders: s.physColliders, total: ctx.physics.world.colliders.len() },
    budgetMs: s?.cfg.budgetMs,
    flythrough: fly?.active ? { t: +fly.t.toFixed(1), speed: fly.speed, distanceM: +fly.distance.toFixed(0) } : null,
    lastFlythrough: lastFly,
    boot: s?.bootT,
  };
}

/**
 * Label a hitch honestly: the named causes must account for at least half of the frame, else "unexplained" (the
 * cause list is kept for reference).
 */
function labelHitch(h: { ms: number; note: string; frame?: number }): string {
  const g = h.frame !== undefined && gpu ? Math.max(gpu.byFrame.get(h.frame) ?? 0, gpu.byFrame.get(h.frame - 1) ?? 0) : 0;
  const own = Number(/^streaming (\d+)ms/.exec(h.note)?.[1] ?? 0);
  const idle = [...h.note.matchAll(/idle-prefetch (\d+)ms/g)].reduce((a, m) => a + Number(m[1]), 0);
  const explained = Math.max(own + idle, g);
  if (explained >= h.ms * 0.5) return g > own + idle ? `GPU-bound (gpu ${g.toFixed(0)} ms)` + (h.note ? ` · ${h.note}` : '') : h.note;
  return `unexplained (named ${Math.round(explained)} of ${Math.round(h.ms)} ms; gpu ${g.toFixed(0)} ms)` + (h.note ? ` · ${h.note}` : '');
}

function hudLines(): string[] {
  const st = stats();
  const w = st.frame!;
  const se = st.session!;
  const out = [
    `fps ${w.fps.toFixed(1).padStart(5)}   frame p50 ${w.p50}  p95 ${w.p95}  max ${w.max} ms  (last ${(w.n / Math.max(1, w.fps)).toFixed(0)} s)`,
    `session ${se.frames} frames · >33 ms: ${se.over33} · >50 ms: ${se.over50} · worst ${se.max} ms`,
    `draw calls ${st.drawCalls}   triangles ${(st.triangles / 1e6).toFixed(2)} M${st.gpu ? `   gpu p50 ${st.gpu.p50}  p95 ${st.gpu.p95}  max ${st.gpu.max} ms` : ''}${st.adaptive ? `   quality ${['full', 'AO off', 'post off'][st.adaptive.level]}` : ''}`,
    `chunks ${st.chunks} loaded · ${st.pendingAtTarget} pending · ${st.queued} queued${st.job ? ' · job ' + st.job : ''}${st.waitingShaders ? ` · ${st.waitingShaders} compiling` : ''}`,
  ];
  if (st.active && st.radius) {
    out.push(`stream ${st.frameWorkMs.toFixed(1)} ms/frame (budget ${st.budgetMs}) · max step ${st.maxStep?.ms} ms ${st.maxStep?.what} · built ${st.built} · unloaded ${st.unloaded}`);
    out.push(`radius target ${st.radius.target} · covered ${st.radius.covered} (min ${st.radius.minCovered ?? '-'}, fog pulls ${st.radius.fogPulls}) · load/fog ${st.radius.load} · build +${st.radius.look} m · ${st.speed.toFixed(1)} m/s`);
    out.push(`prefetch ${st.prefetch!.warmed} chunks warm · queue ${st.prefetch!.queue}${st.prefetch!.roads ? ` · roads regions ${st.prefetch!.roads.regions}` : ''} · physics ${st.physics!.bodies} chunks / ${st.physics!.colliders} colliders`);
  } else out.push('streaming passive (?stream=0): core ChunkManager schedules');
  if (st.flythrough) out.push(`flythrough ${st.flythrough.speed} m/s · ${st.flythrough.t} s · ${st.flythrough.distanceM} m`);
  else if (st.lastFlythrough) {
    const f = st.lastFlythrough;
    out.push(`last flythrough ${f.speed} m/s ${f.distanceM} m: p50 ${f.p50} p95 ${f.p95} p99 ${f.p99} max ${f.max} ms · >50: ${f.over50}`);
  }
  const hw = se.worst[0];
  if (hw) out.push(`worst @${hw.t}s ${hw.ms} ms: ${labelHitch(hw)}`.slice(0, 170));
  return out;
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  /** Behind the focus along the flythrough heading (or a follow-like view of the focus). */
  fly(ctx) {
    const f = ctx.chunks.focus;
    const h = fly?.active ? fly.heading() : THREE.MathUtils.degToRad(20);
    const y = ctx.world.heightAt(f.x, f.z);
    return { position: [f.x - Math.cos(h) * 36, y + 24, f.z - Math.sin(h) * 36], target: [f.x + Math.cos(h) * 30, y + 1, f.z + Math.sin(h) * 30], fov: 50 };
  },
  /** High view of the loaded disc and its fog edge. */
  disc(ctx) {
    const f = ctx.chunks.focus;
    return orbitToView({ target: [f.x, ctx.world.heightAt(f.x, f.z), f.z], yaw: 30, pitch: 55, dist: 260 });
  },
};

const mod: GameModule = {
  id: 'streaming',
  showcaseUses: ['terrain', 'roads', 'villages', 'nature', 'props', 'environment'],

  async init(ctx) {
    ctxRef = ctx;
    const P = ctx.params;
    rec = new FrameRecorder();
    if (P.get('gpu') !== '0') gpu = new GpuTimer(ctx.renderer.getContext());
    if (P.get('adaptive') === '1' && gpu?.available) adaptive = new AdaptiveQuality(() => ctx.services.get('environment'));
    active = P.get('stream') !== '0';
    fly = new Flythrough(ctx, num(P, 'flyspeed', 12), num(P, 'flysecs', ctx.mode === 'showcase' ? 0 : 60));
    fly.onDone = (r) => void (lastFly = r);
    if (active) {
      streamer = new Streamer(ctx, {
        budgetMs: num(P, 'sbudget', 6),
        radius: num(P, 'sradius', 0),
        idle: P.get('sidle') !== '0',
        colliderM: num(P, 'scol', 110),
        // boot builds the whole load disc (critic r3: a smaller boot ring showed the fog wall retreating after ready)
        bootR: num(P, 'sbootr', 10000),
        bootRoads: P.get('sbootroads') === '1',
      });
      streamer.takeOver();
      streamer.bootT.initAt = Math.round(performance.now());
      // the environment stops steering the radius as soon as this service exists
      ctx.services.set('streaming', api);
      ctx.chunks.configure({ loadRadius: Math.round(streamer.policyRadius()) });
      streamer.configR = streamer.coveredR = ctx.chunks.config.loadRadius;
      // roads/rivers network prefetch (time-sliced per node/route). Prefer a roads service hook; else the
      // roads module's own Prefetcher class (CORE_REQUESTS.md #4).
      const roadsSvc = ctx.services.get<{ prefetcher?: () => unknown }>('roads');
      if (roadsSvc && P.get('roadpf') !== '0') {
        try {
          const own = roadsSvc.prefetcher?.();
          if (own) streamer.roads = own as never;
          else {
            const [{ Prefetcher }, L, N] = await Promise.all([import('../roads/prefetch'), import('../roads/layers'), import('../roads/net')]);
            const net = L.roadNetOf(ctx.world.seed);
            if (net) {
              streamer.roads = new Prefetcher(ctx.world, net, L.riverNetOf(ctx.world.seed), 0) as unknown as never;
              streamer.roadNet = net;
              streamer.macro = N.MACRO;
            }
          }
        } catch (e) {
          console.warn('[streaming] roads prefetcher unavailable', e);
        }
      }
    }
    (window as unknown as { __kfb?: Record<string, unknown> }).__kfb!.streaming = api;
    if (P.get('hud') === '1' || (ctx.mode === 'showcase' && P.get('showcase') === 'streaming' && P.get('hud') !== '0')) hud = new Hud();
    if (P.get('flythrough') === '1' || (ctx.mode === 'showcase' && P.get('showcase') === 'streaming' && P.get('fly') !== '0'))
      flyPending = { speed: fly.speed, secs: fly.secs, dir: num(P, 'flydir', 20) };
    ctx.events.on('ready', () => {
      // the whole boot disc exists now and the loading overlay still covers the canvas: compile + draw the full
      // pipeline from 6 directions so every first-wave buffer and shader variant is on the GPU before the first
      // visible frame (critic r3: 52–73 ms hitch at ready + 0.5 s, 61–64 ms at the first camera drag)
      if (active && warmState === 0 && ctx.params.get('swarm') !== '0') warmPrograms(ctx);
      // The world behind the loading overlay is complete (whole disc + warm-up), so drop the overlay now instead of
      // core's 0.4 s fade + remove(): removing a full-screen element above the WebGL canvas half a second into play
      // made the compositor re-layer the canvas → 57–95 ms frame at ready + 0.5 s (A/B 2/2 vs 2/2). CORE_REQUESTS #14.
      if (active && ctx.params.get('keepfade') !== '1') document.getElementById('loading')?.remove();
      ready = true;
      if (streamer) streamer.bootT.readyAt = Math.round(performance.now());
      if (streamer) streamer.boot = false;
      api.resetStats();
    });
  },

  update(dt, ctx) {
    frameNo++;
    if (warmState === 1) warmPrograms(ctx); // restore the visibility forced for the warm-up draws
    const now = performance.now();
    const engFrame = (window as unknown as { __kfb?: { engine?: { frame?: number } } }).__kfb?.engine?.frame ?? frameNo;
    const frameMs = rec ? rec.tick(now, engFrame - 1) : 0;
    gpu?.frame(engFrame);
    if (ready && flyPending) {
      startFly(flyPending.speed, flyPending.secs, flyPending.dir);
      flyPending = null;
    }
    // the flythrough moves the focus first, the scheduler then plans for it
    try {
      fly?.update(dt, frameMs);
    } catch (e) {
      console.warn('[streaming] flythrough stopped', e);
      fly?.stop();
    }
    if (active && streamer) {
      try {
        streamer.update(dt);
        failures = 0;
      } catch (e) {
        failures++;
        if (failures <= 2) console.warn('[streaming] scheduler error', e);
        if (failures >= 3) {
          // give the lifecycle back to the core ChunkManager rather than freezing the world
          streamer.release();
          active = false;
          console.warn('[streaming] scheduler disabled after repeated errors; core ChunkManager takes over');
        }
      }
      if (rec) rec.prevNote = streamer.frameNote;
    }
    if (adaptive && gpu && rec) adaptive.update(dt, gpu.window(180).p95, rec.window(180).p95);
    hud?.update(dt, hudLines);
  },

  showcase(ctx) {
    // real streamed world from the origin; the flythrough starts once the first disc is built (ready)
    ctx.chunks.focus.set(0, 0, 0);
    const v = presets.fly(ctx);
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
  },

  cameraPresets: presets,
};

const api = {
  stats,
  report: () => {
    const session = rec?.report();
    if (session) session.worst = session.worst.map((h) => ({ ...h, note: labelHitch(h) }));
    return { session, window: rec?.window(1800), gpu: gpu?.available ? gpu.window(600) : null, flythrough: lastFly ?? fly?.summary() };
  },
  /** [engine frame, GPU ms] of recent frames (perf tool joins them with its own frame records). */
  gpuFrames: () => (gpu ? [...gpu.byFrame] : []),
  resetStats: () => {
    rec?.reset();
    gpu?.reset();
    if (streamer) {
      streamer.minCovered = Infinity;
      streamer.fogPulls = 0;
      streamer.maxFrameWork = 0;
      streamer.maxStep = { ms: 0, what: '' };
    }
  },
  get config() {
    return streamer?.cfg;
  },
  /** Start a flythrough (m/s, seconds (0 = endless), heading degrees). */
  fly: (speed = 12, secs = 60, dir = 20) => startFly(speed, secs, dir),
  stopFly: () => fly?.stop(),
  get flying() {
    return !!fly?.active;
  },
  get chunkRadius() {
    return CHUNK_R;
  },
};

export default mod;
