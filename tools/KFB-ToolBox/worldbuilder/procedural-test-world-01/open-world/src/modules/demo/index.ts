// demo module: the game mode's demo world — spawn village choice, landmarks + road routes (village → bridge → forest
// edge), travel times from the character's measured gaits, verification presets, a fading controls hint. See NOTES.md.
import * as THREE from 'three';
import type { CameraView, CoreContext, GameModule } from '../../core/types';
import { orbitToView } from '../../core/debug';
import { DIRS, edgeVector, hexToWorld } from '../../core/hex';
import { planDemo, type DemoPlan, type V3 } from './plan';
import { lazyCover, type Cover } from './score';
import { makeRouteScript } from './script';
import { chooseSpawn, healSpawn, type Choice } from './choice';
import { ControlsHint } from './hint';

interface PlayerApi {
  position: THREE.Vector3;
  spawn(x: number, y: number, z: number, heading?: number): void;
  debugState?(): { gaitSpeeds?: { walk: number; run: number } } & Record<string, unknown>;
}
interface NatureApi { plan?(cx: number, cz: number): { crowns: number[] } | null }

let plan: DemoPlan | null = null;
let hint: ControlsHint | null = null;
let cover: (Cover & { chunks: number }) | null = null;
let spawned = false;
let choice: Choice | null = null;
let initMs = 0;
let healMs = 0;
let ctxRef: CoreContext | null = null;

const active = (ctx: CoreContext) => ctx.mode === 'game' || ctx.params.get('showcase') === 'demo';
const D = (rad: number) => (rad * 180) / Math.PI;

function speeds(ctx: CoreContext): { walk: number; run: number } | null {
  const s = ctx.services.get<PlayerApi>('player')?.debugState?.()?.gaitSpeeds;
  return s && s.run > 0 ? s : null;
}

function travel(ctx: CoreContext) {
  const s = speeds(ctx);
  if (!plan || !s) return null;
  const t = (len: number | undefined, v: number) => (len === undefined ? null : +(len / v).toFixed(1));
  const b = plan.route.toBridge?.length, f = plan.route.toForest?.length, fb = plan.route.toForestBeyondBridge?.length, p = plan.demoPath?.length;
  const walk = { toBridge_s: t(b, s.walk), toForest_s: t(f, s.walk), toForestBeyondBridge_s: t(fb, s.walk), demoPath_s: t(p, s.walk) };
  const run = { toBridge_s: t(b, s.run), toForest_s: t(f, s.run), toForestBeyondBridge_s: t(fb, s.run), demoPath_s: t(p, s.run) };
  return {
    speeds_mps: { ...s, jog: s.walk, sprint: s.run },
    // canon controls: W = jog (Running_A, the character's 'walk' gait slot), Shift+W = sprint (Running_B, 'run')
    jog: walk,
    sprint: run,
    walk,
    run,
    note: 'computed = road-polyline length / measured clip ground speed (player.debugState().gaitSpeeds; canon: walk slot = jog, run = sprint); excludes start/turn lag',
  };
}

/** Public summary (service + window.__kfb.demo()). */
function summary(ctx: CoreContext) {
  ensurePlan(ctx);
  if (!plan) return null;
  const tr = travel(ctx);
  return {
    seed: plan.seed,
    boot: { choice, initMs, healMs, planMs: plan.ms, plannedLazily: !ctx.params.has('demoScore') },
    village: plan.village,
    spawn: plan.spawn,
    landmarks: plan.landmarks,
    distances_m: {
      straight: {
        toBridge: dist(plan.landmarks.villageCentre, plan.landmarks.bridge),
        toForest: dist(plan.landmarks.villageCentre, plan.landmarks.forestEdge),
      },
      road: { toBridge: plan.route.toBridge?.length ?? null, toForest: plan.route.toForest?.length ?? null, toForestBeyondBridge: plan.route.toForestBeyondBridge?.length ?? null, demoPath: plan.demoPath?.length ?? null },
    },
    route: plan.route,
    demoPath: plan.demoPath,
    bridgeCell: plan.bridgeCell,
    forest: plan.forest,
    forestBeyond: plan.forestBeyond,
    forestOnCrowns: !!cover,
    coverChunks: cover?.chunks ?? 0,
    travel: tr,
    candidates: plan.candidates,
    /** real-input shoot scripts: demo route (run) + the two timed A1 legs from the centre, run and walk */
    scripts: () => {
      if (!tr) return null;
      const sp = tr.speeds_mps;
      return {
        demo_run: makeRouteScript(plan!, sp, 'demo', 'sprint'),
        bridge_run: makeRouteScript(plan!, sp, 'bridge', 'sprint'),
        forest_run: makeRouteScript(plan!, sp, 'forest', 'sprint'),
        bridge_jog: makeRouteScript(plan!, sp, 'bridge', 'jog'),
        forest_jog: makeRouteScript(plan!, sp, 'forest', 'jog'),
      };
    },
    planMs: plan.ms,
  };
}

function dist(a: V3 | null, b: V3 | null): number | null {
  return a && b ? +Math.hypot(a[0] - b[0], a[2] - b[2]).toFixed(1) : null;
}

function doSpawn(ctx: CoreContext): boolean {
  const player = ctx.services.get<PlayerApi>('player');
  const sp = choice?.spawn ?? plan?.spawn;
  if (!player || !sp) return false;
  const [x, y, z] = sp.world;
  player.spawn(x, y + 0.2, z, sp.heading);
  spawned = true;
  return true;
}

// ------------------------------------------------------------------ camera presets
/**
 * Obstruction of a view: fraction of samples along the eye→target segment (5–92 %) that pass through a tree crown
 * (nature crowns, pure chunk plans: base … base + 9 m) or below the ground.
 */
function sightCost(ctx: CoreContext, v: CameraView): number {
  const [px, py, pz] = v.position, [tx, ty, tz] = v.target;
  let bad = 0, n = 0;
  for (let t = 0.05; t <= 0.92; t += 0.03) {
    const x = px + (tx - px) * t, y = py + (ty - py) * t, z = pz + (tz - pz) * t;
    n++;
    if (ctx.world.heightAt(x, z) > y - 0.3) { bad++; continue; }
    const base = cover?.canopyBaseAt(x, z, 0.8) ?? null;
    if (base !== null && y > base - 0.5 && y < base + 9) bad++;
  }
  return n ? bad / n : 0;
}

function fallbackView(ctx: CoreContext): CameraView {
  return orbitToView({ target: [0, ctx.world.heightAt(0, 0), 0], yaw: 30, pitch: 40, dist: 90 });
}

/**
 * Routes + landmarks of the chosen village (scorer phases for ONE village + polylines). Never at boot: run in idle
 * time after `ready`, or on demand (service / __kfb.demo() / presets). `?demoScore=1` = offline mode: rank every village
 * within `?demoR` (default 40 cells) at boot and spawn at the winner (seconds — verification only).
 */
function ensurePlan(ctx: CoreContext): DemoPlan {
  if (!plan) {
    const R = Number(ctx.params.get('demoR') ?? 0);
    // nature's pure per-chunk plans (cached by nature → the chunk builds reuse them) give the real crowns
    const nat = ctx.services.get<NatureApi>('nature');
    cover = nat?.plan ? lazyCover((cx, cz) => nat.plan!(cx, cz)?.crowns ?? null) : null;
    const full = ctx.params.has('demoScore') || !choice?.centre;
    plan = planDemo(ctx.world, {
      radius: R > 0 ? R : undefined,
      top: Number(ctx.params.get('demoEval') ?? 0) || undefined,
      at: full ? null : choice!.centre,
      cover,
    });
    if (choice && !full && plan.village?.id === choice.id) {
      // the player stands where the choice put him (incl. a landmark-aimed heading): route scripts start from there
      plan.spawn = { ...plan.spawn, world: choice.spawn.world, heading: choice.spawn.heading };
    }
  }
  return plan;
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  /** what the player sees at the start: the follow camera's default pose behind the spawn point */
  spawn: (ctx) => {
    const p = ensurePlan(ctx);
    const [x, y, z] = p.spawn.world;
    return orbitToView({ target: [x, y + 1.5, z], yaw: D(p.spawn.heading + Math.PI), pitch: 20, dist: 7 });
  },
  /** the spawn village from above-side, seen from behind the spawn street */
  village: (ctx) => {
    const p = ensurePlan(ctx);
    const c = p.landmarks.villageCentre;
    if (!c) return fallbackView(ctx);
    return orbitToView({ target: [c[0], c[1] + 2, c[2]], yaw: D(p.spawn.heading + Math.PI) + 25, pitch: 34, dist: 70 });
  },
  /** on the road from the village toward the bridge, eye height a little raised, looking along the road */
  road: (ctx) => {
    const p = ensurePlan(ctx);
    const pts = p.route.toBridge?.points;
    if (!pts || pts.length < 3) return fallbackView(ctx);
    const i = Math.max(1, Math.floor(pts.length * 0.45));
    const a = pts[i - 1], b = pts[Math.min(pts.length - 1, i + 2)];
    const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz) || 1;
    return { position: [a[0] - (dx / L) * 6, a[1] + 4.5, a[2] - (dz / L) * 6], target: [b[0] + (dx / L) * 20, b[1] + 1, b[2] + (dz / L) * 20], fov: 55 };
  },
  /** the bridge from the side (across the road axis) */
  bridge: (ctx) => {
    const p = ensurePlan(ctx);
    const b = p.landmarks.bridge;
    if (!b || !p.bridgeCell) return fallbackView(ctx);
    const e = edgeVector(p.bridgeCell.axis >= 0 ? p.bridgeCell.axis : 0);
    // side vector: perpendicular to the road axis, turned 35° toward the approach; then the nearest yaw (±15° steps,
    // either side of the river) whose line of sight is free of tree crowns and terrain
    const ang = Math.atan2(-e.x, e.z) + 0.6;
    const yaw0 = D(Math.atan2(Math.cos(ang), Math.sin(ang)));
    const target: V3 = [b[0], b[1] + 1, b[2]];
    let best: CameraView | null = null, bestCost = Infinity;
    for (const k of [0, 1, -1, 2, -2, 3, -3, 4, -4, 12, 11, 13, 10, 14, 9, 15, 8, 16]) {
      const v = orbitToView({ target, yaw: yaw0 + k * 15, pitch: 22, dist: 30 });
      const c = sightCost(ctx, v) + Math.abs(k > 6 ? k - 12 : k) * 0.05 + (k > 6 ? 0.3 : 0);
      if (c < bestCost) { bestCost = c; best = v; }
      if (c < 0.05) break;
    }
    return best!;
  },
  /** the forest edge seen from the road it is reached from */
  forest: (ctx) => {
    const p = ensurePlan(ctx);
    const f = p.forestBeyond ?? p.forest;
    if (!f) return fallbackView(ctx);
    const a = hexToWorld(f.from.q, f.from.r);
    const [x, y, z] = f.world;
    const dx = x - a.x, dz = z - a.z, L = Math.hypot(dx, dz) || 1;
    return { position: [x - (dx / L) * 16, y + 3.5, z - (dz / L) * 16], target: [x + (dx / L) * 8, y + 3, z + (dz / L) * 8], fov: 55 };
  },
  /** the whole demo route from above */
  overview: (ctx) => {
    const p = ensurePlan(ctx);
    const pts = [...(p.demoPath?.points ?? []), ...(p.landmarks.villageCentre ? [p.landmarks.villageCentre] : [])];
    if (!pts.length) return fallbackView(ctx);
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, y = 0;
    for (const q of pts) {
      x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); z0 = Math.min(z0, q[2]); z1 = Math.max(z1, q[2]); y += q[1] / pts.length;
    }
    const span = Math.max(x1 - x0, z1 - z0, 60);
    return orbitToView({ target: [(x0 + x1) / 2, y, (z0 + z1) / 2], yaw: D(p.spawn.heading + Math.PI) + 15, pitch: 58, dist: span * 1.25 + 40 });
  },
};

// ------------------------------------------------------------------ module
const ALL = ['terrain', 'roads', 'villages', 'nature', 'props', 'character', 'camera', 'streaming'];

const mod: GameModule = {
  id: 'demo',
  showcaseUses: ALL,

  init(ctx) {
    ctxRef = ctx;
    if (!active(ctx)) return;
    const t0 = performance.now();
    if (ctx.params.has('demoScore')) {
      ensurePlan(ctx); // offline verification mode: full scorer at boot
      choice = { id: plan!.village?.id ?? null, centre: plan!.village?.centre ?? null, spawn: { world: plan!.spawn.world, heading: plan!.spawn.heading }, source: 'nearest', ms: Math.round(plan!.ms) };
    } else choice = chooseSpawn(ctx);
    if (!doSpawn(ctx)) console.warn('[module:demo] no player service; spawn skipped');
    initMs = Math.round(performance.now() - t0);
    const api = {
      get landmarks() { return ensurePlan(ctx).landmarks; },
      get route() { return ensurePlan(ctx).route; },
      get travel() { ensurePlan(ctx); return travel(ctx); },
      get plan() { return ensurePlan(ctx); },
      get choice() { return choice; },
      summary: () => summary(ctx),
      scripts: () => summary(ctx)?.scripts() ?? null,
      respawn: () => doSpawn(ctx),
    };
    ctx.services.set('demo', api);
    const k = (window as unknown as { __kfb?: Record<string, unknown> }).__kfb;
    if (k) k.demo = () => {
      const s = summary(ctx);
      return s ? { ...s, scripts: s.scripts() } : null;
    };
    // routes / landmarks: lazily, in idle time after the first frames
    ctx.events.on('ready', () => {
      // self-healing spawn: the precomputed table may be stale after world changes → live planned spawn, silently
      if (choice && !ctx.params.has('demoScore')) {
        const t = performance.now();
        const fixed = healSpawn(ctx, choice);
        if (fixed) {
          choice = fixed;
          if (plan && plan.village?.id !== fixed.id) plan = null; // re-plan for the healed village
          if (plan) plan.spawn = { ...plan.spawn, world: fixed.spawn.world, heading: fixed.spawn.heading };
          doSpawn(ctx);
        }
        healMs = Math.round(performance.now() - t);
      }
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      const run = () => { if (!plan) ensurePlan(ctx); };
      if (idle) idle(run, { timeout: 4000 });
      else setTimeout(run, 1500);
    });
    if (ctx.params.get('hint') !== '0' && !ctx.params.has('shotNoHint')) hint = new ControlsHint();
  },

  update(dt, ctx) {
    if (!active(ctx)) return;
    if (!spawned) doSpawn(ctx);
    if (hint) {
      const p = ctx.services.get<PlayerApi>('player')?.position;
      const s = choice?.spawn.world;
      const moved = p && s ? Math.hypot(p.x - s[0], p.z - s[2]) : 0;
      if (!hint.update(dt, moved, !!ctx.getCameraOverride())) hint = null;
    }
  },

  showcase(ctx) {
    // the demo showcase IS the game mode world (all modules), staged at the demo spawn
    ensurePlan(ctx);
    void ctxRef;
  },

  cameraPresets: presets,
};

export default mod;
