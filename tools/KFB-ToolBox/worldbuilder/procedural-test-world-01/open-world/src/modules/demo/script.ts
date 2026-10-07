// Real-input route scripts for tools/shoot.mjs, derived from the demo plan — KFB ground-controls canon: W/S forward/
// back · A/D turn (the character owns its heading, `__kfb.player().yaw`) · Shift sprint. Only keys, no teleports, no mouse.
// Closed loop throughout:
//  - steering: at the start of every straight stretch A (yaw +) or D (yaw −) is held UNTIL the bearing from the
//    player's live position to the stretch's end point is within TURN_LEAD of the yaw (the eased yaw rate carries the
//    rest) — while moving (W stays down through bends) or on the spot from a stand;
//  - driving: W (jog) or Shift+W (sprint) held UNTIL the player passes the stretch's end plane;
//  - arrival: the end plane AND ≤ 3 m lateral distance to the landmark (passing beside the bridge does not count).
// Goals:
//   'demo'   spawn → centre → bridge → far bank → forest edge beyond the bridge (the showcase route)
//   'bridge' spawn → centre (stop) → TIMED centre → bridge (A1 leg 1)
//   'forest' spawn → centre (stop) → TIMED centre → nearest forest edge (A1 leg 2)
// Timing: an `{"until": "true"}` marker right before the timed W press and the `until` of the last stretch both land in
// the shoot log's `inputTrace` (wall-clock ms) → leg seconds = t(arrive) − t(go). No screenshots while keys are held.
import type { DemoPlan, V3 } from './plan';

/** turns smaller than this are not steered (the road tile is wide enough) */
const MIN_TURN = (8 * Math.PI) / 180;
/** A/D release tolerance (rad), on top of the predicted carry-over (see aimed()) */
const TURN_LEAD = 0.075;
/** fine aim tolerance (rad) after the coarse turn: a tap of A then of D, each held until within it */
const FINE = 0.05;
/** a long stretch gets a fine re-aim at the end point every this many metres */
const REAIM_M = 15;
/** metres the gait carries on after W is released */
const OVERSHOOT = { sprint: 0.9, jog: 0.5 };

export interface ScriptStep { [k: string]: unknown }
export type Goal = 'demo' | 'bridge' | 'forest';
/** canon: 'sprint' = Shift+W (Running_B), 'jog' = W (Running_A) */
export type Gait = 'sprint' | 'jog';

interface Run { h: number; len: number; from: V3; to: V3 }

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Douglas–Peucker in xz: drops zig-zag cell-centre / edge-midpoint vertices that lie within `tol` m of a chord. */
export function simplify(pts: V3[], tol = 2.5): V3[] {
  if (pts.length < 3) return pts.slice();
  const a = pts[0], b = pts[pts.length - 1];
  const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz) || 1;
  let worst = -1, wd = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((pts[i][0] - a[0]) * dz - (pts[i][2] - a[2]) * dx) / L;
    if (d > wd) { wd = d; worst = i; }
  }
  if (wd <= tol) return [a, b];
  return [...simplify(pts.slice(0, worst + 1), tol).slice(0, -1), ...simplify(pts.slice(worst), tol)];
}

/** Merge a polyline into straight runs (after simplification: the road tile / open grass is wider than the error). */
export function runsOf(pts: V3[]): Run[] {
  const runs: Run[] = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dx = b[0] - a[0], dz = b[2] - a[2];
    const len = Math.hypot(dx, dz);
    if (len < 0.3) continue;
    const h = Math.atan2(dx, dz);
    const last = runs[runs.length - 1];
    if (last && Math.abs(wrap(h - last.h)) < MIN_TURN) {
      last.len += len;
      last.to = b;
      last.h = Math.atan2(b[0] - last.from[0], b[2] - last.from[2]);
    } else runs.push({ h, len, from: a, to: b });
  }
  return runs;
}

/** JS condition: the player has passed the plane `lead` m before `to`, normal = run direction. `within`: and is at most
 *  that far from `to` laterally (arrival legs: passing the plane beside the bridge, e.g. in the river, does not count). */
function passed(r: Run, lead: number, within = 0): string {
  const ux = Math.sin(r.h), uz = Math.cos(r.h);
  const lat = within > 0 ? `&&Math.abs((p[0]-(${r.to[0]}))*(${uz.toFixed(4)})-(p[2]-(${r.to[2]}))*(${ux.toFixed(4)}))<${within}` : '';
  return `(()=>{const p=__kfb.player().pos;return (p[0]-(${r.to[0]}))*(${ux.toFixed(4)})+(p[2]-(${r.to[2]}))*(${uz.toFixed(4)})>${(-lead).toFixed(2)}${lat}})()`;
}
const AT_REST = '(()=>{const s=__kfb.player();return s.speed<0.25})()';
/**
 * JS condition: the bearing from the player to (x, z) will be within `lead` of its yaw once the key is released,
 * turning from the side `dir` (+1: A, yaw increasing; −1: D). Predictive: the yaw rate is measured between polls
 * (window.__aim) and the carry-over after release (measured on seed 97: 0.18 rad after a 3 rad/s turn ≈ rate·0.06 s; the 50 ms poll adds ±0.075 rad → TURN_LEAD) is
 * subtracted, so a fast turn is released early and a short correction tap stops on target.
 */
function aimed(x: number, z: number, dir: number, lead: number): string {
  // dir 0: either side (|predicted error| < lead) — for the initial alignment, whatever the start yaw
  const cmp = dir > 0 ? `e-c<${lead}` : dir < 0 ? `e-c>${-lead}` : `Math.abs(e-c)<${lead}`;
  return `(()=>{const s=__kfb.player(),p=s.pos,t=performance.now(),w=window.__aim||(window.__aim={y:s.yaw,t:0});let r=0;if(t-w.t>5&&t-w.t<300){let d=s.yaw-w.y;d=Math.atan2(Math.sin(d),Math.cos(d));r=d/((t-w.t)/1000)}w.y=s.yaw;w.t=t;const c=r*0.06;let e=Math.atan2(${x}-p[0],${z}-p[2])-s.yaw;e=Math.atan2(Math.sin(e),Math.cos(e));return ${cmp}})()`;
}

/** Polylines of a goal: [untimed approach, timed leg] (the plan's smoothed steering lines). */
export function legsOf(plan: DemoPlan, goal: Goal): V3[][] | null {
  const c = plan.landmarks.villageCentre;
  const s = plan.spawn.world;
  if (goal === 'demo') return plan.demoPath ? [[], plan.demoPath.smooth ?? plan.demoPath.points] : null;
  if (!c) return null;
  const leg = goal === 'bridge' ? plan.route.toBridge : plan.route.toForest;
  if (!leg) return null;
  // the spawn is a street cell 1–2 out facing the crossing: straight to the centre, then the leg
  return [[s, c], leg.smooth ?? leg.points];
}

export function makeRouteScript(plan: DemoPlan, speeds: { run: number; walk: number }, goal: Goal = 'demo', gait: Gait = 'sprint'): ScriptStep[] {
  const steps: ScriptStep[] = [{ camera: 'follow' }, { wait: 1500 }, { shot: 'start' }];
  const legs = legsOf(plan, goal);
  if (!legs) return steps;
  // canon speeds: sprint = Running_B (player gaitSpeeds.run), jog = Running_A (gaitSpeeds.walk in canon)
  const v = gait === 'sprint' ? speeds.run : speeds.walk;
  const keys = gait === 'sprint' ? ['ShiftLeft', 'KeyW'] : ['KeyW'];
  const over = OVERSHOOT[gait];
  let heading = plan.spawn.heading;
  let moving = false;
  const stop = () => {
    if (!moving) return;
    for (const k of [...keys].reverse()) steps.push({ up: k });
    steps.push({ until: AT_REST, timeout: 4000 });
    moving = false;
  };
  /** fine aim at (x, z): tap A until the bearing error < FINE, then D until > −FINE (one of them is a no-op tap) */
  const fine = (to: V3) => {
    steps.push({ down: 'KeyA' }, { until: aimed(to[0], to[2], 1, FINE), timeout: 1500 }, { up: 'KeyA' });
    steps.push({ down: 'KeyD' }, { until: aimed(to[0], to[2], -1, FINE), timeout: 1500 }, { up: 'KeyD' });
  };
  let aligned = false;
  legs.forEach((pts, li) => {
    const runs = runsOf(simplify(pts, 0.5));
    const timed = goal === 'demo' || li === 1;
    if (!aligned && runs.length) {
      // initial alignment from a stand, independent of the actual start yaw: turn with A until aimed (≤ one revolution)
      aligned = true;
      steps.push({ down: 'KeyA' }, { until: aimed(runs[0].to[0], runs[0].to[2], 0, 0.06), timeout: 3500 }, { up: 'KeyA' }, { wait: 250 });
      heading = runs[0].h;
    }
    runs.forEach((r, i) => {
      const dh = wrap(r.h - heading);
      if (Math.abs(dh) >= MIN_TURN) {
        // closed-loop turn toward the stretch's end point (A = yaw +, D = yaw −), moving or on the spot
        const key = dh > 0 ? 'KeyA' : 'KeyD';
        steps.push({ down: key }, { until: aimed(r.to[0], r.to[2], dh > 0 ? 1 : -1, TURN_LEAD), timeout: 4000 }, { up: key });
        if (!moving) steps.push({ wait: 250 });
      }
      fine(r.to);
      heading = r.h;
      if (!moving) {
        if (timed && i === 0) steps.push({ until: 'true', mark: `go:${goal}:${gait}` });
        for (const k of keys) steps.push({ down: k });
        moving = true;
      }
      const last = i === runs.length - 1;
      const arrive = last && li === legs.length - 1;
      const lead = arrive ? 0.3 : last ? over : 0;
      // long stretch: re-aim at the end point every REAIM_M metres (drift from the eased turn / collisions)
      for (let d = REAIM_M; d < r.len - 8; d += REAIM_M) {
        const t = d / r.len;
        const mid: Run = { ...r, to: [r.from[0] + (r.to[0] - r.from[0]) * t, 0, r.from[2] + (r.to[2] - r.from[2]) * t] };
        steps.push({ until: passed(mid, 0), timeout: Math.round((REAIM_M / v) * 3000 + 6000) });
        fine(r.to);
      }
      // arrival: bridge = past the plane on the deck (≤ 3 m lateral); forest edge = also within 4 m of the point (trunks
      // deflect a runner sideways right at the edge, so the plane test alone could be missed)
      const near = arrive && goal !== 'bridge' ? `||(()=>{const p=__kfb.player().pos;return Math.hypot(p[0]-(${r.to[0]}),p[2]-(${r.to[2]}))<4})()` : '';
      steps.push({ until: passed(r, lead, arrive ? 3 : 0) + near, timeout: Math.round((r.len / v) * 2500 + 8000), mark: arrive ? `arrive:${goal}:${gait}` : `run${li}.${i}` });
    });
    if (li === 0 && runs.length) stop();
  });
  stop();
  steps.push({ wait: 1200 }, { shot: 'end' });
  return steps;
}
