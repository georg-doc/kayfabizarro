// Third-person spring-arm camera (round 5: round-3 spring arm + round-4 canopy logic and head/near-plane guards).
// pivot (feet + 1.5 m, critically damped) → safe pivot (pushed out of solids) → sphere cast (r 0.4) along the view
// line against WORLD solids (thin trunks ignored) → camera at the free length: pulled in fast but over a few frames,
// eased out with a spring. If the free arm is shorter than minArm a small pitch lift (≤ +15°) is tried; if that does
// not help the camera keeps minArm and the near plane cuts the blocker away (never the character).
// The user owns yaw / pitch / zoom; their input always acts on the resolved camera immediately. Nothing rotates the
// camera on its own. Under forest canopy the camera stays below the crown base (shorter arm, then lower pitch).
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { CoreContext, CameraView } from '../../core/types';
import { CAMERA_QUERY_GROUPS } from '../../core/groups';


const D2R = Math.PI / 180;

/** All tunables in one place (metres, radians, seconds). See NOTES.md. */
export const CAM = {
  pivotHeight: 1.5,
  /** head centre / helmet top above the feet (knight) */
  headHeight: 1.55,
  headTop: 2.0,
  defaultDist: 7,
  minDist: 3.5,
  maxDist: 16,
  defaultPitch: 20 * D2R,
  minPitch: -5 * D2R,
  maxPitch: 45 * D2R,
  /** pitch window at minimum zoom (lerps to minPitch…maxPitch by closeEnd m): no eye-level / helmet-top close-ups */
  minPitchClose: 12 * D2R,
  maxPitchClose: 32 * D2R,
  closeEnd: 6,
  /** pitch floor rises from minPitch at farStart (m) to minPitchFar at maxDist */
  farStart: 9,
  minPitchFar: 6 * D2R,
  /** rad per mouse px (horizontal / vertical) */
  sensitivity: 0.0042,
  sensitivityY: 0.0021,
  /** zoom factor per wheel deltaY unit (100 ≈ one notch → ×1.13) */
  wheelZoom: 0.0012,
  zoomOmega: 9,
  pivotOmegaH: 10,
  pivotOmegaV: 4.5,
  /** max pivot lag (m): horizontal; below (rising); above (falling: leaves terraces quickly) */
  maxLagH: 0.8,
  maxLagDown: 1.1,
  maxLagUp: 1.2,
  /** airborne band around the take-off height in which the pivot stays put (m) */
  airBandUp: 1.8,
  airBandDown: 0.4,
  /** collision sphere radius (m) */
  radius: 0.35,
  /** the camera itself keeps this much clearance from walls / roofs / cliffs (a roof edge 0.4 m from the lens fills
   *  half the frame) */
  clearRadius: 0.5,
  /** colliders thinner than this (trunk / post radius, m) never shorten the arm (nature dithers them) */
  thinRadius: 0.6,
  trunkRadius: 1.0,
  /** look-ahead of the predictive cast along the character's motion (s): starts pull-ins early */
  predictT: 0.3,
  /** line-of-sight sweep radius (the camera sphere itself is kept CAM.radius clear) */
  lineRadius: 0.15,
  /** per frame, a camera inside geometry keeps at most this fraction of its penetration */
  penetrationKeep: 0.8,
  /** largest pull-in per frame while the camera is not inside geometry (m) */
  pullMaxStep: 0.8,
  /** pull-in rate (1/s; plus: penetration at least halves per frame) and ease-out spring (1/s, ≈ 0.5 s) */
  pullOmega: 16,
  easeOutOmega: 6,
  /** shortest arm (m): a blocker closer than this is cut by the near plane instead (camera keeps minArm inside it).
   *  1.6 m showed only the back of the chibi helmet (it hides the whole body from there), 2.3 m shows helmet + body */
  minArm: 1.1,
  /** never closer than this to the character's actual head (m), whatever the pivot lag does */
  headFloor: 1.8,
  /** pitch lift when the arm at the user pitch is shorter than minArm: candidates, easing in/out (1/s), hold (s) */
  liftSteps: [4, 8, 12].map((d) => d * D2R),
  liftStepsDrop: [4, 8, 12, 18, 24, 30].map((d) => d * D2R),
  liftIn: 8,
  liftOut: 3,
  liftHold: 0.4,
  /** lift fades in over this much arm above minArm (m) */
  liftFade: 3,
  /** total pitch never exceeds max(user pitch, this) */
  pitchCeil: 52 * D2R,
  /** effective view pitch caps (arm pitch incl. lift/raise, and the final aim): long arm / short arm (< 4 m) */
  viewCapFar: 47 * D2R,
  viewCapNear: 40 * D2R,
  /** effective pitch cap at the shortest (collision-shortened) arm: eye-level-ish over-the-shoulder */
  viewCapShort: 25 * D2R,
  /** a solid corner / ledge hiding head or hips for longer than this (s) pulls the camera in front of it */
  occSolid: 0.1,
  /** arm growth rate limit while easing out (m/s) */
  maxGrow: 6,
  /** solids in view closer than this to the lens shorten the arm a little (m) */
  lensClear: 1.2,
  /** a solid-occluder pull-in never goes shorter than this (m) */
  occMinArm: 1.1,
  /** pinned below this clear arm (m) → slide sideways to a yaw with ≥ slideArm of clear arm; ease in / out (1/s) */
  pinArm: 2.8,
  slideArm: 3.3,
  slideIn: 10,
  /** walking out of a corner: the slide is held at most this long (s) before the chase swings back behind him */
  moveHold: 1.2,
  /** chase: yaw lag behind the heading (1/s, ≈ 0.4 s) and orbit-offset return while moving (1/s, ≈ 0.8 s) */
  chaseOmega: 4,
  orbitReturn: 3.5,
  /** minimum boom at buildings / props (m): the camera never collapses below this; the near plane cuts the building */
  minBoom: 2.8,
  /** pitch-over-a-building lift (rad) */
  boxLiftMax: 18 * D2R,
  /** camera closer than squeezeDist (m) to the head: raise it up to squeezeUp (m) above the head */
  squeezeDist: 1.8,
  squeezeUp: 0.9,
  squeezePitch: 50 * D2R,
  /** the aim never points more than this above the horizon */
  lookUpMax: 6 * D2R,
  slideClear: 1.1,
  /** 10° steps searched each side: 10 = ±100° (a flat wall at the character's back needs > 90° — ±70° only ever
   *  resolves edges and corners) */
  slideSteps: 35,
  slideOut: 5,
  /** a thin-occluder pull-in never goes shorter than this (m) */
  thinMinArm: 4.0,
  /** pull-in speed limit (m/s) unless the camera would otherwise intersect (then it snaps) */
  maxPull: 40,
  /** aim height at the shortest arm (upper body / head) */
  upperBody: 1.35,
  /** short (collision-shortened) arm: raise the arm by up to this so the body stays in frame */
  shortRaise: 8 * D2R,
  /** thin occluder (trunk / pole) on the line to head or hips for longer than occHold (s): pull in in front of it */
  occHold: 0.25,
  /** forest: keep the camera this far below the crown base (m); canopy sample radius; shortest canopy arm (m) */
  canopyClear: 0.4,
  canopyR: 1.5,
  canopyMinArm: 4.0,
  /** under canopy: max pitch, and the lowest pitch a long zoom may push it to */
  canopyPitchMax: 35 * D2R,
  canopyPitchMin: 6 * D2R,
  /** under forest canopy the camera stays at least this high above the ground (above the bushes) */
  forestClear: 2.0,
  canopyIn: 4,
  canopyOut: 1.8,
  /** under canopy, the part of the pitch above what fits is kept at this fraction (so pitch input still acts) */
  canopyKnee: 0.35,
  /** camera never closer than this to the terrain surface below it (m); soft lift rates (1/s) */
  groundClear: 0.4,
  groundIn: 14,
  groundOut: 3,
  /** near plane (m) and its guard: never closer than this to the character's body points (head: +0.15) */
  near: 0.1,
  bodyGuard: 0.7,
  /** extra near-plane guard for the head (helmet radius + lean while running) */
  headGuard: 0.3,
  nearMax: 2.5,
  /** buildings / props are faded by core (src/core/fade.ts); the near plane only cuts a blocker this close to the lens */
  nearCutMax: 0.6,
  /** arm shorter than the zoom (blocked): widen the fov up to this much (rad of vertical fov) so zoom always acts */
  fovBlocked: 9,
  fovOmega: 4,
  /** character fade below this camera→head distance (only reachable in degenerate cases) */
  fadeStart: 1.6,
  fadeEnd: 1.1,
  fadeMin: 0.45,
  /** override release blend (s) */
  releaseBlend: 0.7,
  /** framing: look above the pivot (m per m of distance); close up aim lower; screen margins for head / feet (rad) */
  frameLift: 0.04,
  closeDrop: 0.15,
  /** below this arm length (m) the aim moves to the character's body centre (feet + bodyCentre) */
  centreFrom: 6,
  bodyCentre: 1.0,
  /** arm shorter than closeFrom (m): pivot drops by up to pivotDrop (m) at minArm */
  closeFrom: 4.5,
  pivotDrop: 0.35,
  dropOmega: 5,
  marginTop: 0.06,
  marginBottom: 0.03,
  /** aim correction for the feet: at most this much lower than the default aim (rad); easing (1/s) */
  aimDownMax: 8 * D2R,
  aimOmega: 6,
};

/** Implicit critically damped spring step (stable for any dt). */
export function spring(x: number, v: number, goal: number, omega: number, dt: number): [number, number] {
  const f = 1 + 2 * dt * omega;
  const oo = omega * omega;
  const hoo = dt * oo;
  const hhoo = dt * hoo;
  const inv = 1 / (f + hhoo);
  return [(f * x + dt * v + hhoo * goal) * inv, (v + hoo * (goal - x)) * inv];
}

export function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

const ease = (x: number, goal: number, kIn: number, kOut: number, dt: number, up = true) =>
  x + (goal - x) * (1 - Math.exp(-((goal > x) === up ? kIn : kOut) * dt));

const _q = { x: 0, y: 0, z: 0, w: 1 };
const _goal = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _o = new THREE.Vector3();
const _t = new THREE.Vector3();
const _pred = new THREE.Vector3();
const _head = new THREE.Vector3();
const _sv = new THREE.Vector3();
const _sw = new THREE.Vector3();
const _sd = new THREE.Vector3();
const _rc = new THREE.Vector3();

/** Rapier queries against WORLD solids only (sensors excluded; thin trunks/posts optionally ignored). */
export class CameraProbe {
  private balls = new Map<number, RAPIER.Ball>();
  private thin = new Map<number, boolean>();
  /** when set, box colliders (buildings, props) are ignored by every query (terrain-only checks) */
  skipBoxes = false;
  private box = new Map<number, boolean>();
  private readonly notThin = (c: RAPIER.Collider) => !this.isThin(c) && !(this.skipBoxes && this.isBox(c));
  isBox(c: RAPIER.Collider): boolean {
    let b = this.box.get(c.handle);
    if (b === undefined) {
      const T = this.ctx.rapier.ShapeType;
      const st = (c.shape as unknown as { type: number }).type;
      b = st === T.Cuboid || st === T.RoundCuboid;
      if (this.box.size > 50000) this.box.clear();
      this.box.set(c.handle, b);
    }
    return b;
  }
  /** run `fn` with box colliders ignored */
  terrain<T>(fn: () => T): T {
    const prev = this.skipBoxes;
    this.skipBoxes = true;
    try { return fn(); } finally { this.skipBoxes = prev; }
  }
  constructor(private ctx: CoreContext) {}

  private ball(r: number): RAPIER.Ball {
    let b = this.balls.get(r);
    if (!b) this.balls.set(r, (b = new this.ctx.rapier.Ball(r)));
    return b;
  }

  private get flags() {
    return this.ctx.rapier.QueryFilterFlags.EXCLUDE_SENSORS;
  }

  isThin(c: RAPIER.Collider): boolean {
    let t = this.thin.get(c.handle);
    if (t === undefined) {
      const sh = c.shape as unknown as { type: number; radius?: number; halfHeight?: number };
      const T = this.ctx.rapier.ShapeType;
      const r = sh.radius ?? 9;
      // thin posts / trunks; also tall trunks up to trunkRadius (the stage's fat trunks), never short fat drums (barrels)
      // round shapes = nature trunks / rocks / stumps and barrels: never camera blockers (whole-instance fades handle
      // them); only terrain hulls, buildings and box props shape the arm
      void r;
      t = sh.type === T.Cylinder || sh.type === T.Capsule || sh.type === T.Cone || sh.type === T.Ball;
      if (this.thin.size > 50000) this.thin.clear();
      this.thin.set(c.handle, t);
    }
    return t;
  }

  /** Sphere cast from `from` along unit `dir`; returns the free centre distance (≤ max). */
  arm(from: THREE.Vector3, dir: THREE.Vector3, max: number, radius = CAM.radius): { len: number; hit: RAPIER.Collider | null } {
    const h = this.ctx.physics.world.castShape(
      { x: from.x, y: from.y, z: from.z }, _q, { x: dir.x, y: dir.y, z: dir.z }, this.ball(radius),
      0, max, true, this.flags, CAMERA_QUERY_GROUPS, undefined, undefined, this.notThin,
    );
    if (!h) return { len: max, hit: null };
    return { len: Math.max(0, h.time_of_impact - 0.02), hit: h.collider };
  }

  /**
   * Arm length for the camera: a thin sweep (lineRadius) for the line of sight, then the camera end is backed off
   * along the arm until the camera sphere (CAM.radius) is clear. A ledge or corner that only grazes the line near
   * the character (but leaves the view to the head clear) no longer pulls the camera in.
   */
  armClear(from: THREE.Vector3, dir: THREE.Vector3, max: number): number {
    let len = this.arm(from, dir, max, CAM.lineRadius).len;
    const w = this.ctx.physics.world;
    for (let i = 0; i < 12 && len > 0; i++) {
      const p = { x: from.x + dir.x * len, y: from.y + dir.y * len, z: from.z + dir.z * len };
      const pr = w.projectPoint(p, true, this.flags, CAMERA_QUERY_GROUPS, undefined, undefined, this.notThin);
      if (!pr) break;
      let d = Math.hypot(p.x - pr.point.x, p.y - pr.point.y, p.z - pr.point.z);
      if (pr.isInside) d = -d;
      if (d >= CAM.clearRadius - 0.02) break;
      len = Math.max(0, len - Math.max(0.1, CAM.clearRadius - d));
    }
    return len;
  }

  /** Ray → first non-thin WORLD solid with its surface normal, or null. */
  rayNormal(from: THREE.Vector3, dir: THREE.Vector3, max: number): { toi: number; nx: number; ny: number; nz: number; box: boolean } | null {
    const R = this.ctx.rapier;
    const h = this.ctx.physics.world.castRayAndGetNormal(new R.Ray({ x: from.x, y: from.y, z: from.z }, { x: dir.x, y: dir.y, z: dir.z }),
      max, false, this.flags, CAMERA_QUERY_GROUPS, undefined, undefined, this.notThin);
    if (!h) return null;
    const T = R.ShapeType;
    const st = (h.collider.shape as unknown as { type: number }).type;
    return { toi: h.timeOfImpact, nx: h.normal.x, ny: h.normal.y, nz: h.normal.z, box: st === T.Cuboid || st === T.RoundCuboid };
  }

  /** Ray → distance to the first WORLD solid (thin ones too when `withThin`), or null. */
  ray(from: THREE.Vector3, dir: THREE.Vector3, max: number, withThin = false): number | null {
    const R = this.ctx.rapier;
    const h = this.ctx.physics.world.castRay(new R.Ray({ x: from.x, y: from.y, z: from.z }, { x: dir.x, y: dir.y, z: dir.z }),
      max, false, this.flags, CAMERA_QUERY_GROUPS, undefined, undefined, withThin ? undefined : this.notThin);
    return h ? h.timeOfImpact : null;
  }

  /** Move `p` out of any solid so a sphere of CAM.radius fits there (pivot next to a wall / inside a low box). */
  safe(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    out.copy(p);
    const w = this.ctx.physics.world;
    for (let i = 0; i < 5; i++) {
      const pr = w.projectPoint({ x: out.x, y: out.y, z: out.z }, true, this.flags, CAMERA_QUERY_GROUPS, undefined, undefined, this.notThin);
      if (!pr) break;
      const dx = out.x - pr.point.x, dy = out.y - pr.point.y, dz = out.z - pr.point.z;
      const d = Math.hypot(dx, dy, dz);
      if (pr.isInside || d < 1e-4) {
        out.y += 0.3;
        continue;
      }
      const need = CAM.radius + 0.03 - d;
      if (need <= 0) break;
      out.x += (dx / d) * need;
      out.y += (dy / d) * need;
      out.z += (dz / d) * need;
    }
    return out;
  }
}

export interface RigTarget {
  /** feet position */
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  heading?: number;
  /** false while airborne (jump/fall); undefined = unknown (treated as grounded) */
  grounded?: boolean;
}

/** (x, z, radius) → lowest crown-base world y over that disk, or null (no canopy). */
export type CanopyFn = (x: number, z: number, r?: number) => number | null;

function armDir(yaw: number, pitch: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set(Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch), Math.cos(pitch) * Math.cos(yaw));
}

/**
 * Orbit follow camera. yaw/pitch in radians, same convention as core orbitToView:
 * camera offset = (cos p · sin yaw, sin p, cos p · cos yaw) · distance from the pivot.
 * Camera forward on the ground plane = (−sin yaw, 0, −cos yaw).
 */
export class CameraRig {
  yaw = 0;
  /** user pitch (always inside the zoom-dependent window, see pitchWindow) */
  pitch = CAM.defaultPitch;
  zoomGoal = CAM.defaultDist;
  zoom = CAM.defaultDist;
  private zoomVel = 0;
  /** actual arm length after collision + easing */
  distance = CAM.defaultDist;
  private distVel = 0;
  /** automatic pitch lift (rad, 0…15°) and canopy dip (rad, ≤ 0) */
  lift = 0;
  liftEff = 0;
  private liftArm = CAM.defaultDist;
  private drop = 0;
  dip = 0;
  private liftHold = 0;
  /** arm cap under canopy (eased) */
  /** eased canopy clearance height above the safe pivot (m) */
  private canopyH = 100;
  private groundLift = 0;
  /** effective pitch used this frame */
  pitchNow = CAM.defaultPitch;
  /** framing correction of the aim depression (rad, eased) */
  private aimOff = 0;
  /** time a thin occluder has been on the line to the character (s) */
  private occT = 0;
  private occSolidT = 0;
  private rimLift = 0;
  private moveT = 0;
  private rimHold = 0;
  private canopyK = 0;
  /** chase mode (canon) vs legacy user-yaw mode (?controls=legacy) */
  chase = true;
  /** eased yaw behind the player's heading, and the RMB orbit offset on top (rad) */
  followYaw = 0;
  orbitOff = 0;
  private boxLift = 0;
  private boxHold = 0;
  private squeeze = 0;
  /** automatic sideways slide (yaw offset, rad) while pinned; effective yaw = user yaw + offset */
  yawOff = 0;
  yawEff = 0;
  private slideHold = 0;
  private slideSide = 0;
  private offGoalPrev = 0;
  private dragT = 0;
  private prevYaw = 0;
  private yawRate = 0;
  /** current effective view pitch cap (rad) */
  viewCap = 52 * D2R;
  /** extra vertical fov (deg) while the arm is shorter than the zoom */
  fovAdd = 0;
  /** camera near plane wanted by the rig (m) */
  near = CAM.near;
  /** last arm result */
  lastArm = { len: CAM.defaultDist, blocked: false };
  /** round 6 cutaway is gone (the camera never enters solids); kept false for debug compatibility */
  cutActive = false;
  /** canopy provider (nature service or the showcase stage); optional */
  canopyAt: CanopyFn | null = null;
  /** base vertical fov (deg), set by the module */
  baseFov = 50;
  readonly pivot = new THREE.Vector3();
  readonly safePivot = new THREE.Vector3();
  private pivotVel = new THREE.Vector3();
  private groundY: number | null = null;
  private hasPivot = false;
  readonly probe: CameraProbe;
  readonly lookAt = new THREE.Vector3();
  readonly position = new THREE.Vector3();
  /** character feet / head top used for framing (debug) */
  readonly feet = new THREE.Vector3();

  constructor(private ctx: CoreContext) {
    this.probe = new CameraProbe(ctx);
  }

  /** Pitch window for a zoom distance: [min, max]. */
  pitchWindow(zoom: number): [number, number] {
    const k = THREE.MathUtils.clamp((zoom - CAM.minDist) / (CAM.closeEnd - CAM.minDist), 0, 1);
    // far zoom: no ground-level shots from 16 m away (the camera would skim the grass through bushes)
    const kf = THREE.MathUtils.clamp((zoom - CAM.farStart) / (CAM.maxDist - CAM.farStart), 0, 1);
    return [THREE.MathUtils.lerp(CAM.minPitchClose, CAM.minPitch, k) + kf * (CAM.minPitchFar - CAM.minPitch), THREE.MathUtils.lerp(CAM.maxPitchClose, CAM.maxPitch, k)];
  }

  /** Set the view yaw (presets / tools): chase mode → as an orbit offset over the chase yaw (eases back on movement). */
  setYaw(y: number): void {
    if (this.chase) this.orbitOff = wrapAngle(y - this.followYaw);
    this.yaw = wrapAngle(y);
  }

  applyInput(dx: number, dy: number, wheel: number): boolean {
    let touched = false;
    if (dx) {
      // canon: an RMB drag adds an orbit offset on top of the chase yaw (eases back behind the player once he moves);
      // legacy (?controls=legacy): the drag sets the user's yaw, which the character steers by.
      // The automatic slide offset is a view-only term on top, held (not re-acquired / animated) while dragging.
      if (this.chase) this.orbitOff = wrapAngle(this.orbitOff - dx * CAM.sensitivity);
      else this.yaw = wrapAngle(this.yaw - dx * CAM.sensitivity);
      this.dragT = 0.4;
      touched = true;
    }
    if (dy) {
      // start from what is on screen (no hidden stored pitch), then apply the drag inside the window
      const [lo, hi] = this.pitchWindow(this.zoom);
      this.pitch = THREE.MathUtils.clamp(THREE.MathUtils.clamp(this.pitch, lo, hi) + dy * CAM.sensitivityY, lo, hi);
      touched = true;
    }
    if (wheel) {
      this.zoomGoal = THREE.MathUtils.clamp(this.zoomGoal * Math.exp(wheel * CAM.wheelZoom), CAM.minDist, CAM.maxDist);
      touched = true;
    }
    return touched;
  }

  snap(target: RigTarget): void {
    if (target.heading !== undefined) this.yaw = this.followYaw = wrapAngle(target.heading + Math.PI);
    this.orbitOff = 0;
    this.pivot.copy(target.position).y += CAM.pivotHeight;
    this.pivotVel.set(0, 0, 0);
    this.zoom = this.zoomGoal;
    this.zoomVel = 0;
    this.distance = this.zoom;
    this.distVel = 0;
    this.lift = this.dip = this.liftEff = this.drop = this.aimOff = 0;
    this.liftArm = this.zoom;
    this.canopyH = 100;
    this.hasPivot = true;
  }

  private armAt(pitch: number, max = this.zoom): number {
    return this.probe.armClear(this.safePivot, armDir(this.yawEff, pitch, _dir), max);
  }

  update(dt: number, target: RigTarget, _touched: boolean): void {
    // --- pivot goal; airborne: hold the take-off height inside a band (hops don't bob the view)
    const goal = _goal.copy(target.position);
    if (target.grounded !== false || this.groundY === null) this.groundY = target.position.y;
    else if (target.position.y < this.groundY - CAM.airBandDown || target.position.y > this.groundY + CAM.airBandUp) {
      this.groundY = THREE.MathUtils.clamp(this.groundY, target.position.y - CAM.airBandUp, target.position.y + CAM.airBandDown);
    }
    goal.y = (target.grounded === false ? this.groundY : target.position.y) + CAM.pivotHeight;
    if (!this.hasPivot || this.pivot.distanceToSquared(goal) > 15 * 15) this.snap(target);

    [this.zoom, this.zoomVel] = spring(this.zoom, this.zoomVel, this.zoomGoal, CAM.zoomOmega, dt);

    // --- pivot follow: horizontal tight, vertical calm, bounded lag
    let x, vx, y, vy, z, vz;
    [x, vx] = spring(this.pivot.x, this.pivotVel.x, goal.x, CAM.pivotOmegaH, dt);
    [z, vz] = spring(this.pivot.z, this.pivotVel.z, goal.z, CAM.pivotOmegaH, dt);
    [y, vy] = spring(this.pivot.y, this.pivotVel.y, goal.y, CAM.pivotOmegaV, dt);
    this.pivot.set(x, y, z);
    this.pivotVel.set(vx, vy, vz);
    const lx = this.pivot.x - goal.x, lz = this.pivot.z - goal.z;
    const lh = Math.hypot(lx, lz);
    if (lh > CAM.maxLagH) {
      this.pivot.x = goal.x + (lx / lh) * CAM.maxLagH;
      this.pivot.z = goal.z + (lz / lh) * CAM.maxLagH;
    }
    if (this.pivot.y < goal.y - CAM.maxLagDown) this.pivot.y = goal.y - CAM.maxLagDown;
    if (this.pivot.y > goal.y + CAM.maxLagUp) this.pivot.y = goal.y + CAM.maxLagUp;
    // --- user pitch inside the zoom-dependent window (follows the eased zoom, so it changes smoothly)
    const [pLo, pHi] = this.pitchWindow(this.zoom);
    const userPitch = THREE.MathUtils.clamp(this.pitch, pLo, pHi);
    this.probe.safe(this.pivot, this.safePivot);
    const feetY = target.position.y;
    // --- chase (KFB ground-controls canon): the camera follows behind the player's heading with a smooth lag; an RMB
    //     orbit offset rides on top and eases back once the player moves (it stays while he stands still)
    if (this.chase && target.heading !== undefined) {
      const goalY = wrapAngle(target.heading + Math.PI);
      this.followYaw = wrapAngle(this.followYaw + wrapAngle(goalY - this.followYaw) * (1 - Math.exp(-CAM.chaseOmega * dt)));
      const moving = Math.hypot(target.velocity.x, target.velocity.z) > 0.5;
      if (!this.ctx.input.orbiting && moving) {
        this.orbitOff *= Math.exp(-CAM.orbitReturn * dt);
        if (Math.abs(this.orbitOff) < 1e-3) this.orbitOff = 0;
      }
      this.yaw = wrapAngle(this.followYaw + this.orbitOff);
    }
    this.yawEff = this.yaw + this.yawOff;
    this.dragT -= dt;
    this.feet.copy(target.position);

    // --- lift (≤ 12°): only when the arm at the user pitch is blocked — now or from where the pivot will be in
    //     predictT — and a small lift buys a clearly longer arm (a ledge / terrace edge between camera and character).
    const hasPred = Math.hypot(target.velocity.x, target.velocity.z) > 0.5 || target.velocity.y < -2;
    if (hasPred) {
      _pred.copy(this.safePivot).addScaledVector(target.velocity, CAM.predictT);
      _pred.y = this.safePivot.y + Math.min(0, target.velocity.y) * 0.15; // falling: where the pivot is heading
      this.probe.safe(_pred, _pred);
    }
    const armBoth = (p: number) => Math.min(this.armAt(p), hasPred ? this.probe.armClear(_pred, armDir(this.yawEff, p, _dir), this.zoom) : Infinity);
    const lenUser = armBoth(userPitch);
    let liftGoal = 0;
    let liftArmGoal = lenUser;
    if (lenUser < this.zoom - 0.3) {
      const need = Math.min(this.zoom - 0.3, lenUser + 1.5);
      // dropping off a ledge (pivot still above the character): the ledge edge cuts the arm — allow a bigger lift (still
      // under the view cap) so the camera looks over the edge instead of collapsing onto the ledge
      const dropping = this.pivot.y - (feetY + CAM.pivotHeight) > 0.4 || target.velocity.y < -2;
      for (const st of dropping ? CAM.liftStepsDrop : CAM.liftSteps) {
        const l = armBoth(userPitch + st);
        if (l >= need) {
          liftGoal = st;
          liftArmGoal = l;
          break;
        }
      }
      if (liftGoal > 0) this.liftHold = CAM.liftHold;
    }
    this.liftArm = ease(this.liftArm, liftArmGoal, 4, 4, dt);
    if (liftGoal < this.lift && (this.liftHold -= dt) > 0) liftGoal = this.lift;
    this.lift = ease(this.lift, liftGoal, CAM.liftIn, CAM.liftOut, dt);
    if (this.lift < 1e-3 && liftGoal === 0) this.lift = 0;
    // the lift is for long arms only (looking over a ledge from afar); a short arm never climbs
    const liftK = THREE.MathUtils.clamp((this.liftArm - 2.5) / CAM.liftFade, 0, 1);
    this.liftEff = this.lift * liftK;
    // effective pitch cap: 47° normally; a collision-shortened arm flattens toward eye level (≤ 25° at ~1.1 m) instead
    // of climbing — backing into a wall gives an over-the-shoulder view, never a helmet-top view
    const shortArm = Math.min(Math.max(lenUser, this.liftArm), this.zoom); // a lift that buys a long arm is not a short arm
    this.viewCap = THREE.MathUtils.lerp(CAM.viewCapFar, CAM.viewCapShort, THREE.MathUtils.clamp((4 - shortArm) / (4 - CAM.minArm), 0, 1));
    const pBase = Math.min(userPitch + this.liftEff, this.viewCap);

    // --- forest canopy (unchanged since round 5): keep the camera height above the safe pivot ≤ H (crown base −
    //     clearance); first a shorter arm, then compress (not cancel) the pitch above what fits
    let Hraw = Infinity;
    if (this.canopyAt) {
      armDir(this.yawEff, Math.max(userPitch, 0), _dir);
      for (const f of [this.zoom, this.zoom * 0.6, this.zoom * 0.35]) {
        const c = this.canopyAt(this.safePivot.x + _dir.x * f, this.safePivot.z + _dir.z * f, CAM.canopyR);
        if (c !== null) Hraw = Math.min(Hraw, c - CAM.canopyClear - this.safePivot.y);
      }
    }
    const sB = Math.sin(Math.max(pBase, 0.05));
    const Hgoal = Math.min(Hraw, this.zoom * sB + 0.5);
    this.canopyH = ease(this.canopyH, Hgoal, CAM.canopyOut, CAM.canopyIn, dt);
    const H = this.canopyH;
    let canopyCap = CAM.maxDist;
    let pCanopy = pBase;
    // under canopy (eased in/out): pitch capped at canopyPitchMax, and a long zoom lowers the pitch so the arm stays
    // under the crowns (pull in horizontally at a LOW pitch instead of raising/steepening — critic r5); whatever still
    // does not fit shortens the arm, never below canopyMinArm. Crowns/bushes/trunks are faded by nature, not collided.
    this.canopyK = ease(this.canopyK, Hraw < Infinity ? 1 : 0, 3, 1.5, dt);
    if (this.canopyK > 1e-3) {
      const k = this.canopyK;
      let pc = pBase - k * Math.max(0, pBase - CAM.canopyPitchMax);
      if (H > 0 && this.zoom * Math.sin(Math.max(pc, 0.05)) > H) {
        const pFit = Math.max(Math.asin(THREE.MathUtils.clamp(H / this.zoom, -1, 1)), CAM.canopyPitchMin);
        pc = Math.min(pc, pc + k * (pFit - pc));
      }
      pCanopy = pc;
      const sc = Math.sin(Math.max(pc, 0.05));
      if (this.zoom * sc > H) canopyCap = Math.max(H > 0 ? H / sc : 0, Math.min(CAM.canopyMinArm, this.zoom));
    } else this.canopyK = 0;
    this.dip = pCanopy - pBase;

    const p0 = Math.max(CAM.minPitch, pBase + this.dip);
    // --- pinned: no room behind the character at the user's yaw (clear arm < pinArm): slide sideways along the
    //     blocker — smallest yaw offset (10° steps, ≤ ±100°) with a clear arm ≥ slideArm and line of sight to head and
    //     hips; prefer the current side, then the side the character moves toward, then the longer arm. Eased in
    //     (~0.3 s), decays (~0.6 s) once the arm behind is clear again; a user drag always wins (see applyInput).
    // (terrain only: buildings / props never trigger a slide — at them the camera keeps its minimum boom and the near
    //  plane cuts the building between camera and knight, so the user's orbit is never fought)
    const clearAt = (yw: number): number => this.probe.terrain(() => {
      armDir(yw, p0, _o);
      const l = this.probe.armClear(this.safePivot, _o, this.zoom);
      for (const hgt of [CAM.headHeight, 0.7]) {
        _head.set(target.position.x, feetY + hgt, target.position.z);
        _t.copy(this.safePivot).addScaledVector(_o, l).sub(_head);
        const ll = _t.length();
        if (ll < 0.5) continue;
        const h = this.probe.ray(_head, _t.divideScalar(ll), ll);
        if (h !== null && h < ll - 0.2) return Math.min(l, h);
      }
      // the same sight lines the final guarantee uses (chest ±0.3 m): a slide position that would be pulled in anyway
      // does not count as room
      _rc.copy(this.safePivot).addScaledVector(_o, l);
      return l * this.sightFrac(target, _rc);
    });
    // slide candidates must also leave the camera ≥ slideClear away from walls (no grazing views hugging a cliff)
    const slideAt = (yw: number): number => {
      const l = clearAt(yw);
      if (l < CAM.slideArm) return l;
      armDir(yw, p0, _o);
      _t.copy(this.safePivot).addScaledVector(_o, Math.min(l, CAM.slideArm + 0.5));
      const pr = this.ctx.physics.world.projectPoint({ x: _t.x, y: _t.y, z: _t.z }, true, this.ctx.rapier.QueryFilterFlags.EXCLUDE_SENSORS,
        CAMERA_QUERY_GROUPS, undefined, undefined, (c: RAPIER.Collider) => !this.probe.isThin(c));
      if (pr && Math.hypot(pr.point.x - _t.x, pr.point.y - _t.y, pr.point.z - _t.z) < CAM.slideClear && pr.point.y > _t.y - 1) return 0;
      return l;
    };
    const baseArm = clearAt(this.yaw);
    let offGoal = 0;
    // (the character steers from cameraRig.yaw = the user's yaw, so the slide never changes the steering; still, while
    //  the player runs under steering input the view does not rotate on its own either: the slide is frozen)
    const inp = this.ctx.input;
    const steering = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].some((k) => inp.isDown(k))
      && Math.hypot(target.velocity.x, target.velocity.z) > 1.0;
    const pinnedHard = baseArm < CAM.pinArm;
    this.moveT = steering ? this.moveT + dt : 0;
    if (steering) {
      // moving: the chase always returns behind player.yaw (slide decays, ≈ 0.6 s) — after at most moveHold s if the
      // way behind him is still blocked (he is walking out of a corner: don't swing the camera into the wall at once)
      if (baseArm >= Math.min(this.zoom, CAM.slideArm)) {
        offGoal = 0; // behind him is clear: return (cut if the way round is blocked)
        if (this.yawOff !== 0) {
          const step = Math.sign(this.yawOff) * Math.min(Math.abs(this.yawOff), 15 * D2R);
          if (clearAt(this.yaw + this.yawOff - step) < Math.min(this.zoom, CAM.slideArm)) this.yawOff = 0;
        }
      } else if (this.moveT < CAM.moveHold) offGoal = this.yawOff;
      else {
        // still blocked behind after moveHold: rotate back step-wise only through clear yaws
        const step = Math.sign(this.yawOff) * Math.min(Math.abs(this.yawOff), 15 * D2R);
        offGoal = this.yawOff !== 0 && clearAt(this.yaw + this.yawOff - step) >= Math.min(this.zoom, CAM.slideArm) ? this.yawOff - step : this.yawOff;
      }
    } else if (this.dragT > 0 && !pinnedHard) {
      offGoal = this.yawOff; // dragging with room: the slide offset is held — never fights the drag
    } else if (target.grounded === false && this.yawOff === 0) {
      offGoal = 0; // no new slide while airborne: a drop's ledge resolves itself as the pivot follows down
    } else if (baseArm < CAM.pinArm || (this.yawOff !== 0 && baseArm < CAM.slideArm)) {
      // pinned (or not yet clear enough to return): smallest offset with room, committed side first
      const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw); // camera right on the ground; +offset moves the camera right
      const lat = target.velocity.x * rx + target.velocity.z * rz;
      const first = this.slideSide || (Math.abs(lat) > 0.5 ? Math.sign(lat) : 0);
      const best = (sd: number): [number, number] => {
        for (let k = 1; k <= CAM.slideSteps; k++) {
          const l = slideAt(this.yaw + sd * k * 10 * D2R);
          if (l >= CAM.slideArm) return [k, l];
        }
        return [99, 0];
      };
      let found = 0;
      if (this.yawOff !== 0 && Math.abs(this.yawOff - this.offGoalPrev) < 2 * D2R && clearAt(this.yaw + this.yawOff) >= CAM.slideArm) {
        found = this.yawOff; // the current slide still has room: keep it (no churn while the character moves)
      } else if (this.slideSide) {
        // committed: stay on this side while it has room (no flip-flopping), else try the other — never while dragging
        // (a flip mid-drag swings the view by 150°+)
        const [k, ] = best(this.slideSide);
        if (k < 99) found = this.slideSide * k * 10 * D2R;
        else if (this.dragT > 0) found = this.yawOff;
        else {
          const [k2] = best(-this.slideSide);
          if (k2 < 99) found = -this.slideSide * k2 * 10 * D2R;
        }
      } else if (this.dragT > 0) {
        found = this.yawOff; // a drag pushing into terrain: no new slide (a 150° jump mid-drag) — the edge guard holds the view
      } else {
        const [kp, lp] = best(1);
        const [kn, ln] = best(-1);
        // smallest offset wins; on a tie the side the character moves toward, then the longer arm
        const sd = kp < kn ? 1 : kn < kp ? -1 : first ? first : lp >= ln ? 1 : -1;
        const k = Math.min(kp, kn);
        if (k < 99) found = sd * k * 10 * D2R;
      }
      if (found) {
        offGoal = found;
        this.slideSide = Math.sign(found);
        this.slideHold = 0.4;
      } else offGoal = (this.slideHold -= dt) > 0 ? this.yawOff : 0; // nowhere to go: fade fallback
    } else if (this.yawOff !== 0) {
      // clear behind again: return toward the user's yaw only while the next 15° step is clear (never sweep the
      // camera back through the blocker)
      const step = Math.sign(this.yawOff) * Math.min(Math.abs(this.yawOff), 15 * D2R);
      // (the next step must keep (nearly) the current arm: rotating into a building would otherwise snap the camera in)
      const stepOk = clearAt(this.yaw + this.yawOff - step) >= Math.min(this.zoom, Math.max(CAM.slideArm, this.distance - 0.5));
      if (stepOk) offGoal = 0;
      else if (this.dragT <= 0 && baseArm >= Math.min(this.zoom, CAM.slideArm + 1)) {
        // the user's own yaw has plenty of room but the way back is blocked (orbited all the way round a corner): cut
        this.yawOff = 0;
        offGoal = 0;
      } else offGoal = this.yawOff;
    }
    if (this.yawOff === 0 && offGoal === 0) this.slideSide = 0;
    this.offGoalPrev = offGoal;
    // switching the slide to the other side would sweep the camera through the blocker behind the knight (and through
    // the knight): cut to the new side instead
    if (offGoal !== 0 && this.yawOff !== 0 && Math.sign(offGoal) !== Math.sign(this.yawOff) && Math.abs(offGoal - this.yawOff) > 60 * D2R) this.yawOff = offGoal;
    this.yawOff = ease(this.yawOff, offGoal, CAM.slideIn, CAM.slideOut, dt, Math.sign(offGoal || this.yawOff) >= 0);
    if (Math.abs(this.yawOff) < 1e-3 && offGoal === 0) this.yawOff = 0;
    this.yawEff = this.yaw + this.yawOff;
    // edge guard: never rotate the view (drag, chase turn, quantised slide goal) from a yaw with room into terrain that
    // would cut the arm below minBoom — the view stops at the edge of the open sector instead of collapsing into the
    // head. While walking only for the first moveHold s (after that the chase must get behind him, see above).
    if (!steering || this.moveT < CAM.moveHold) {
      const want = Math.min(CAM.minBoom, this.zoom);
      const dy = wrapAngle(this.yawEff - this.prevYaw);
      if (Math.abs(dy) > 1e-4 && Math.abs(dy) < 90 * D2R) {
        const lNew = clearAt(this.yawEff);
        if (lNew < want) {
          const lOld = clearAt(this.prevYaw);
          if (lOld > lNew + 0.3) {
            this.yawOff = wrapAngle(this.prevYaw - this.yaw);
            this.yawEff = this.yaw + this.yawOff;
            if (this.yawOff !== 0) this.slideSide = Math.sign(this.yawOff); // stay on this side when the drag ends
          }
        }
      }
    }

    // building / prop (box colliders) cuts the arm below minBoom: pitch up over it (6° steps, ≤ the view cap), eased
    let boxGoal = 0;
    {
      const lAll = this.probe.armClear(this.safePivot, armDir(this.yawEff, p0, _o), this.zoom);
      const want = Math.min(CAM.minBoom, this.zoom);
      if (lAll < want) {
        const lTer = this.probe.terrain(() => this.probe.armClear(this.safePivot, armDir(this.yawEff, p0, _o), this.zoom));
        if (lTer > lAll + 0.3) {
          boxGoal = Math.max(0, Math.min(CAM.boxLiftMax, this.viewCap - p0));
          for (let st = 6 * D2R; st <= CAM.boxLiftMax + 1e-4 && p0 + st <= this.viewCap + 1e-4; st += 6 * D2R) {
            if (this.probe.armClear(this.safePivot, armDir(this.yawEff, p0 + st, _o), this.zoom) >= want) { boxGoal = st; break; }
          }
          this.boxHold = 0.5;
        }
      }
      if (boxGoal < this.boxLift && (this.boxHold -= dt) > 0) boxGoal = this.boxLift;
      this.boxLift = ease(this.boxLift, boxGoal, 5, 2, dt);
      if (this.boxLift < 1e-3 && boxGoal === 0) this.boxLift = 0;
    }
    const pitchNow = Math.min(p0 + this.boxLift + this.rimLift, Math.max(p0, this.viewCap, this.rimLift > 0 ? CAM.viewCapFar : 0));
    this.pitchNow = pitchNow;
    armDir(this.yawEff, pitchNow, _dir);

    // --- arm. `hard` = longest arm whose camera sphere (r 0.35) is clear of terrain / buildings / props: the camera is
    //     NEVER inside them (no near-plane cutting, no cutaway). Thin trunks/posts are ignored here (dithered by nature).
    const hard = this.probe.armClear(this.safePivot, _dir, this.zoom);
    // terrain-only arm: the camera may stand in / behind a building or prop down to the minimum boom (the near plane
    // cuts it away), never inside terrain
    const hardT = this.probe.terrain(() => this.probe.armClear(this.safePivot, _dir, this.zoom));
    const boomFloor = Math.min(CAM.minBoom, this.zoom, hardT);
    // line of sight to the actual head and hips: a corner / ledge / terrain lip hiding the character for > occSolid s
    // (or a thin trunk for > occHold s) pulls the camera in front of it, promptly but over several frames
    let solidCap = Infinity;
    let thinCap = Infinity;
    for (const hgt of [CAM.headHeight, 1.05, 0.6]) {
      _head.set(target.position.x, feetY + hgt, target.position.z);
      _o.copy(this.safePivot).addScaledVector(_dir, hard).sub(_head);
      const l = _o.length();
      if (l < 0.5) continue;
      _o.divideScalar(l);
      // small sphere (r 0.12) from 0.25 m out along the sight line: a knight at a cliff corner is noticed even when
      // a single centre ray would just graze the edge
      _t.copy(_head).addScaledVector(_o, 0.25);
      const hsArm = this.probe.terrain(() => this.probe.arm(_t, _o, l - 0.25, 0.12));
      const hs = hsArm.hit ? hsArm.len + 0.25 : null;
      // (airborne: a ledge the character just dropped off hides it for a moment — the lagging pivot resolves that;
      //  and never pull closer than occMinArm for an occluder: below that the camera would sit on the ledge itself)
      if (hs !== null && hs < l - 0.2 && target.grounded !== false) {
        const c = hard * (hs / l) - 0.3;
        if (c >= CAM.occMinArm) solidCap = Math.min(solidCap, c);
      }
      const ht = this.probe.ray(_head, _o, l, true);
      // (only if the camera can get in front of the trunk at a comfortable distance; a trunk right beside the
      //  character is cut out by the nature/stage foliage dither instead)
      if (ht !== null && ht < l - 0.3) {
        const c = hard * (ht / l) - 0.4;
        if (c >= CAM.thinMinArm) thinCap = Math.min(thinCap, c);
      }
    }
    this.occSolidT = solidCap < Infinity ? this.occSolidT + dt : 0;
    this.occT = thinCap < Infinity ? this.occT + dt : 0;
    const occCap = Math.min(this.occSolidT >= CAM.occSolid ? solidCap : Infinity, this.occT >= CAM.occHold ? thinCap : Infinity);
    let soft = hard;
    if (hasPred) soft = Math.min(soft, this.probe.armClear(_pred, _dir, this.zoom) + 0.3);
    // orbiting: where the arm will be in 0.25 s (so an orbit into a building starts pulling in before it hits)
    const yr = wrapAngle(this.yawEff - this.prevYaw) / Math.max(dt, 1e-3);
    this.prevYaw = this.yawEff;
    this.yawRate += (yr - this.yawRate) * (1 - Math.exp(-12 * dt));
    if (Math.abs(this.yawRate) > 0.3) {
      const yawP = this.yawEff + THREE.MathUtils.clamp(this.yawRate * 0.25, -1, 1);
      _o.set(Math.cos(pitchNow) * Math.sin(yawP), Math.sin(pitchNow), Math.cos(pitchNow) * Math.cos(yawP));
      soft = Math.min(soft, this.probe.armClear(this.safePivot, _o, this.zoom) + 0.2);
    }
    this.lastArm = { len: hard, blocked: hard < this.zoom - 0.01 };
    // (round 11: bushes are no camera blockers any more — the camera passes through low bushes and nature fades whole
    //  bush instances near the camera / on the sight line)
    const bushCap = Infinity;
    // a wall / roof corner close to the lens and in view (not on the line, so the arm is free) fills a quarter of the
    // frame: step the arm back (0.5 m steps) until such solids are ≥ lensClear away. Pure function of the geometry along
    // the desired arm → stable (no pumping, nothing moves while idle).
    let lensCap = Infinity;
    {
      const L0 = Math.min(soft, this.zoom, canopyCap, occCap, bushCap);
      const flags = this.ctx.rapier.QueryFilterFlags.EXCLUDE_SENSORS;
      const notThin = (c: RAPIER.Collider) => !this.probe.isThin(c);
      for (let L = L0, k = 0; k < 8 && L > CAM.occMinArm; k++, L -= 0.5) {
        _o.copy(this.safePivot).addScaledVector(_dir, L);
        const pr = this.ctx.physics.world.projectPoint({ x: _o.x, y: _o.y, z: _o.z }, true, flags, CAMERA_QUERY_GROUPS, undefined, undefined, notThin);
        if (!pr) break;
        const dx = pr.point.x - _o.x, dy = pr.point.y - _o.y, dz = pr.point.z - _o.z;
        const dd = Math.hypot(dx, dy, dz);
        const front = -(dx * _dir.x + dy * _dir.y + dz * _dir.z) / Math.max(dd, 1e-3); // camera looks along −_dir
        if (dd >= CAM.lensClear || front < 0.2 || dy < -0.3) break; // clear, behind the lens, or just the ground
        lensCap = Math.max(CAM.occMinArm, CAM.minBoom, L - 0.5);
      }
    }
    const goalLen = Math.max(Math.min(soft, this.zoom, canopyCap, occCap, bushCap, lensCap), Math.min(CAM.minArm, hard), boomFloor);
    if (goalLen < this.distance) {
      // pull in: fast but over ≥ 2 frames (≤ 50 % of the gap per frame, also at low fps)
      const next = goalLen + (this.distance - goalLen) * Math.max(Math.exp(-CAM.pullOmega * dt), 0.5);
      this.distance = Math.max(next, this.distance - CAM.maxPull * Math.max(dt, 1 / 60)); // ≤ maxPull m/s
      this.distVel = 0;
    } else {
      // ease out: critically damped spring, growth rate ≤ maxGrow m/s (no snap when a wall / trunk releases the arm)
      const prevD = this.distance;
      [this.distance, this.distVel] = spring(this.distance, this.distVel, goalLen, CAM.easeOutOmega, dt);
      if (this.distVel < 0) this.distVel = 0;
      if (this.distVel > CAM.maxGrow) this.distVel = CAM.maxGrow;
      if (this.distance > prevD + CAM.maxGrow * dt) this.distance = prevD + CAM.maxGrow * dt;
    }
    if (Math.abs(this.distance - goalLen) < 1e-3 && Math.abs(this.distVel) < 1e-3) {
      this.distance = goalLen;
      this.distVel = 0;
    }
    // never inside geometry: the only instant correction
    if (this.distance > Math.max(hard, boomFloor)) {
      this.distance = Math.max(hard, boomFloor);
      this.distVel = 0;
    }
    this.position.copy(this.safePivot).addScaledVector(_dir, this.distance);

    // terrain: stay above the surface where the ground is below the chest (soft); the lift itself is collision-checked
    const g0 = this.ctx.world.heightAt(this.position.x, this.position.z);
    const clear = Hraw < Infinity ? CAM.forestClear : CAM.groundClear;
    // (only where the ground under the camera is below the chest — never lift the camera onto an upper terrace)
    const gGoal = g0 < this.pivot.y - 0.2 ? Math.max(0, g0 + clear - this.position.y) : 0;
    this.groundLift = ease(this.groundLift, gGoal, CAM.groundIn, CAM.groundOut, dt);
    if (this.groundLift < 1e-3 && gGoal === 0) this.groundLift = 0;
    if (this.groundLift > 0) {
      _o.set(0, 1, 0);
      const up = this.probe.arm(this.position, _o, this.groundLift);
      this.position.y += up.len;
    }

    // final guarantee: the line of sight from the character's chest and head to the camera is free of solids
    // (terrain, buildings); otherwise the camera moves in along that line in front of the blocker — instantly, it is
    // the "never behind a wall" rule (the fade covers a very close camera)
    // (centre of chest and head, plus the chest 0.3 m to either side of the sight line: a cliff corner hiding half
    //  the body counts too)
    // Never pulled closer than minBoom (≈2.6 m) by terrain: if the pull-in would go below it, look for a higher pitch
    // (≤ the view cap) whose camera position has a clear arm and clear sight lines — rise over the rim instead of
    // collapsing into the head; that pitch is then eased in via rimLift. Only if nothing helps the old pull-in remains.
    {
      const frac = this.sightFrac(target, this.position);
      let rimGoal = 0;
      if (frac < 1) {
        const dNow = this.position.distanceTo(this.safePivot);
        if (frac * dNow >= Math.min(CAM.minBoom, dNow) - 1e-3) {
          _t.copy(this.position).sub(this.safePivot).multiplyScalar(frac);
          this.position.copy(this.safePivot).add(_t);
        } else {
          for (let st = 6 * D2R; this.pitchNow + st <= Math.max(this.viewCap, CAM.viewCapFar) + 1e-4; st += 6 * D2R) {
            armDir(this.yawEff, this.pitchNow + st, _rc);
            const L = Math.min(this.zoom, this.probe.terrain(() => this.probe.armClear(this.safePivot, _rc, this.zoom)));
            if (L < Math.min(CAM.minBoom, this.zoom)) continue;
            _t.copy(this.safePivot).addScaledVector(_rc, L);
            if (this.sightFrac(target, _t) >= 0.999) { rimGoal = st; break; }
          }
          if (rimGoal > 0) {
            // this frame: the higher candidate directly (a cut, but never inside the head)
            armDir(this.yawEff, this.pitchNow + rimGoal, _rc);
            const L = Math.min(this.distance, this.probe.terrain(() => this.probe.armClear(this.safePivot, _rc, this.zoom)));
            this.position.copy(this.safePivot).addScaledVector(_rc, Math.max(L, Math.min(CAM.minBoom, this.zoom)));
            this.rimLift = Math.max(this.rimLift, rimGoal);
            this.rimHold = 0.6;
          } else {
            _t.copy(this.position).sub(this.safePivot).multiplyScalar(frac);
            this.position.copy(this.safePivot).add(_t);
          }
        }
      }
      if (rimGoal === 0 && (this.rimHold -= dt) <= 0) this.rimLift = ease(this.rimLift, 0, 2, 2, dt);
      if (this.rimLift < 1e-3) this.rimLift = 0;
    }

    // squeezed close to the knight (concave corner behind him, no slide room): raise the camera moderately above his
    // head (collision-checked, eased) so it looks down at him instead of at his back / the sky
    {
      _head.set(target.position.x, feetY + CAM.headHeight, target.position.z);
      const dh = this.position.distanceTo(_head);
      const goalR = dh < CAM.squeezeDist ? THREE.MathUtils.clamp(_head.y + CAM.squeezeUp - this.position.y, 0, CAM.squeezeUp + 1) * (1 - dh / CAM.squeezeDist) * 1.5 : 0;
      this.squeeze = ease(this.squeeze, Math.min(goalR, CAM.squeezeUp + 1), 6, 3, dt);
      if (this.squeeze > 1e-3) {
        // never steeper than squeezePitch: the rise is limited by the horizontal distance to the head
        const hz = Math.hypot(this.position.x - _head.x, this.position.z - _head.z);
        const rise = Math.min(this.squeeze, Math.max(0, Math.tan(CAM.squeezePitch) * hz - (this.position.y - _head.y)));
        _o.set(0, 1, 0);
        if (rise > 1e-3) this.position.y += this.probe.arm(this.position, _o, rise).len;
      } else this.squeeze = 0;
    }

    // --- fov: widen a little while the arm is shorter than the zoom (blocked / canopy), so the wheel always acts
    const d = this.position.distanceTo(this.safePivot);
    const fovGoal = CAM.fovBlocked * THREE.MathUtils.clamp(Math.log(Math.max(this.zoom, d) / Math.max(d, 0.5)) / Math.log(10), 0, 1);
    this.fovAdd = ease(this.fovAdd, fovGoal, CAM.fovOmega, CAM.fovOmega, dt);
    if (Math.abs(this.fovAdd - fovGoal) < 1e-3) this.fovAdd = fovGoal;
    const half = ((this.baseFov + this.fovAdd) * D2R) / 2;

    // --- framing: default aim above the pivot; below centreFrom the aim moves to the actual character (body centre,
    //     rising to the upper body / head at the shortest arms); helmet top always inside the top edge
    const close = THREE.MathUtils.clamp((4.5 - this.distance) / 2.5, 0, 1);
    this.lookAt.copy(this.pivot);
    this.lookAt.y += CAM.frameLift * this.distance - CAM.closeDrop * close;
    const kC = THREE.MathUtils.clamp((CAM.centreFrom - this.distance) / (CAM.centreFrom - 2.6), 0, 1);
    const aimH = THREE.MathUtils.lerp(CAM.bodyCentre, CAM.upperBody, THREE.MathUtils.clamp((2.6 - this.distance) / (2.6 - CAM.minArm), 0, 1));
    if (kC > 0) this.lookAt.lerp(_t.set(target.position.x, feetY + aimH, target.position.z), kC * 0.9);
    const ax = this.lookAt.x - this.position.x, az = this.lookAt.z - this.position.z;
    const ah = Math.hypot(ax, az);
    const ch = Math.max(0.3, Math.hypot(target.position.x - this.position.x, target.position.z - this.position.z));
    if (ah > 0.05) {
      const c0 = Math.atan2(this.position.y - this.lookAt.y, ah);
      const aTop = Math.atan2(this.position.y - (feetY + CAM.headTop), ch);
      const aFeet = Math.atan2(this.position.y - feetY, ch);
      const hi = aTop + half - CAM.marginTop;
      const lo = Math.min(aFeet - half + CAM.marginBottom, c0 + CAM.aimDownMax * (1 + 0.75 * close));
      const aimWant = Math.min(Math.max(c0, lo), hi) - c0;
      this.aimOff += (aimWant - this.aimOff) * (1 - Math.exp(-CAM.aimOmega * dt));
      const c = Math.min(c0 + this.aimOff, hi, Math.max(this.viewCap, pitchNow) + 4 * D2R);
      if (Math.abs(c - c0) > 1e-4) this.lookAt.set(this.position.x + ax, this.position.y - Math.tan(c) * ah, this.position.z + az);
    }

    // pinned with no room behind the character (wall/cliff right at its back: the camera sphere cannot fit between):
    // the camera ends up at the character's head and the character is faded out (module) — look along the user's
    // view direction instead of at the character, i.e. an over-the-head first-person glance, never a cut-open wall
    const wF = THREE.MathUtils.clamp((0.9 - this.distance) / 0.5, 0, 1);
    if (wF > 0) this.lookAt.lerp(_t.copy(this.position).addScaledVector(_dir, -4), wF);
    // never look up into the sky: the aim is at most lookUpMax above the horizon, never straight up / down
    {
      const lx = this.lookAt.x - this.position.x, lz = this.lookAt.z - this.position.z;
      let lh = Math.hypot(lx, lz);
      if (lh < 0.3) {
        // degenerate (camera right above / at the character): look down at his chest, slightly ahead along the
        // user's yaw so the view direction is defined — the character stays in frame
        this.lookAt.set(target.position.x - Math.sin(this.yaw) * 0.8, feetY + 0.9, target.position.z - Math.cos(this.yaw) * 0.8);
        lh = Math.max(0.3, Math.hypot(this.lookAt.x - this.position.x, this.lookAt.z - this.position.z));
      }
      const maxY = this.position.y + Math.tan(CAM.lookUpMax) * lh;
      if (this.lookAt.y > maxY) this.lookAt.y = maxY;
    }

    // near plane: a building / prop between the camera (held at the minimum boom) and the knight is cut away —
    // never the knight himself (≥ 0.7 m / head 1.0 m in front of him) and never the ground in the lower frame.
    // Terrain never needs this (the camera is never inside or behind terrain).
    {
      let nearGoal = CAM.near;
      let cap = CAM.nearMax;
      for (const hgt of [0.35, 1.05, CAM.headHeight]) {
        _t.set(target.position.x, feetY + hgt, target.position.z);
        _o.copy(this.position).sub(_t);
        const dc = _o.length();
        cap = Math.min(cap, dc - CAM.bodyGuard - (hgt === CAM.headHeight ? CAM.headGuard : 0));
        if (dc < 0.3) continue;
        _o.divideScalar(dc);
        const h = this.probe.ray(_t, _o, dc);
        if (h !== null && h < dc - 0.02 && dc - h < CAM.nearCutMax) nearGoal = Math.max(nearGoal, dc - h + 0.08);
      }
      const aim = Math.atan2(this.position.y - this.lookAt.y, Math.max(0.05, Math.hypot(this.lookAt.x - this.position.x, this.lookAt.z - this.position.z)));
      const hc = this.position.y - feetY;
      if (hc > 0.05 && aim + half > 0.05) cap = Math.min(cap, (hc * Math.cos(half)) / Math.sin(Math.min(aim + half, Math.PI / 2)) - 0.25);
      nearGoal = THREE.MathUtils.clamp(nearGoal, CAM.near, Math.max(CAM.near, cap));
      this.near = nearGoal > this.near ? nearGoal : this.near + (nearGoal - this.near) * (1 - Math.exp(-12 * dt));
    }
    this.cutActive = false;
  }

  /**
   * Terrain sight lines from the character (chest centre, head, chest ±0.3 m sideways — side samples inside a wall he
   * leans against are skipped) to `cam`: the smallest free fraction of the sight line (1 = all clear).
   */
  private sightFrac(target: RigTarget, cam: THREE.Vector3): number {
    const feetY = target.position.y;
    const sx = cam.z - target.position.z, sz = -(cam.x - target.position.x);
    const sl = Math.hypot(sx, sz) || 1;
    let frac = 1;
    for (const [hgt, lat] of [[1.05, 0], [CAM.headHeight, 0], [1.05, 0.3], [1.05, -0.3]]) {
      _sv.set(target.position.x + (sx / sl) * lat, feetY + hgt, target.position.z + (sz / sl) * lat);
      if (lat !== 0) {
        _sw.set(target.position.x, feetY + hgt, target.position.z);
        _sd.copy(_sv).sub(_sw);
        const ll = _sd.length();
        if (this.probe.terrain(() => this.probe.ray(_sw, _sd.divideScalar(ll), ll + 0.1)) !== null) continue;
      }
      _sd.copy(cam).sub(_sv);
      const l = _sd.length();
      if (l < 0.3) continue;
      _sd.divideScalar(l);
      const h = this.probe.terrain(() => this.probe.ray(_sv, _sd, l));
      if (h !== null && h < l - 0.05) frac = Math.min(frac, Math.max(0.02, h - 0.3) / l);
    }
    return frac;
  }

  /** Instant collision-safe view for presets. */
  view(feet: THREE.Vector3, yaw: number, pitch: number, dist: number, fov?: number): CameraView {
    const pivot = feet.clone();
    pivot.y += CAM.pivotHeight;
    const sp = this.probe.safe(pivot, new THREE.Vector3());
    const dir = armDir(yaw, pitch, new THREE.Vector3());
    const len = this.probe.armClear(sp, dir, dist);
    const pos = sp.clone().addScaledVector(dir, len);
    const g = this.ctx.world.heightAt(pos.x, pos.z) + CAM.groundClear;
    if (pos.y < g) pos.y = g;
    const look = pivot.clone();
    look.y += CAM.frameLift * len;
    return { position: pos.toArray() as [number, number, number], target: look.toArray() as [number, number, number], fov };
  }
}
