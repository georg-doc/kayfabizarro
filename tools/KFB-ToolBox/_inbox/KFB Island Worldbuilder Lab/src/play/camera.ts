// Stufe 2 · Spielkamera (Steuerung 10.10.): own module. Vorlage zuerst (QA-Protokoll §1a):
//  · spring arm = Seed World sw-mech.js:434-448 (three 0.170): the boom keeps its direction in the camera frame and only
//    SHORTENS on occlusion, never below 70 % of its length, never lifts the camera; hits closer than 0.3 are ignored, it
//    stays 0.5 off the hit and 0.8 above ground; rigid follow in the actor frame (no positional lag), only the offset is
//    smoothed (30/s when shortening, 8/s when lengthening); the view direction eases to the heading (40/s).
//  · hand-over walk ⇄ drive = Joyride J17 travel-modes / travel-core (T_CAM 0.7 s, smoothstep).
// New: everything in H (1 H = 3.64 lab; Seed World h = 2.6 POC-m figure height, its metre constants divided by it), the
// drive arm from Joyride's chase numbers in track metres × RACE_W 1.46, hooks for raycast / ground from the Lab.
// C1 (Steuerung 11.10., V-103): FAHREN now rides Joyride J17's rail camera (drive.ts `chase`, joyride-drive.j10.js 1:1) through the
// `rail` hook, blended over T_CAM; on foot the Seed-World spring arm stays (V-020…026). Not taken over: J17's 2.5 m orbit / free look.
// B0 calm camera (Steuerung 11.10., measured: arm jumped full ⇄ 70 % 4× in 10 s orbit, ground lift up to 1.9 lab from tree
// canopies, step max 3.3 lab): the arm length is critically damped (no snap), an occlusion must hold 2 frames before it counts,
// the ground lift is smoothed, the orbit input eases, wheel zoom 0.55–2.8 (Seed World sw-mech) with the delta normalised like
// the world-builder ground-controller (clamp ±120 → exp; touchpad pixel deltas and wheel lines alike) and inertia; recenter
// (WoW logic, Georg): only while the actor MOVES the camera eases back behind it, standing keeps the free look.
import * as THREE from 'three';

export const H = 3.64;
export const RACE_W = 1.46;   // track-core metres → lab (Steuerung 10.10.: the Joyride world = road profiles)
export const T_CAM = 0.7;
const QS = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
const DRIVE_UP = Number(QS?.get('camUp') ?? 0), DRIVE_PITCH = Number(QS?.get('camPitch') ?? -0.28);   // delivered values (Messung 01–04); camUp / camPitch = tuning overrides (cabrio tuning paused 10.10.)      // J17 travel-core: camera hand-over seconds

/** arm per mode, in lab units: pivot height, side / up / back offset in the camera frame */
export const ARM = {
  // Seed World with h = 1 H: pivot 0.62 h; arm (0.42 h, (0.75 h + 0.6 m)·0.6 on the ground, 2.9 h + 2.6 m) with 0.6 m / 2.6 m ≙ 0.23 h / 1 h
  walk: { pivot: 0.62 * H, side: 0.42 * H, up: (0.75 + 0.6 / 2.6) * 0.6 * H, back: (2.9 + 2.6 / 2.6) * H, pitch: -0.15 },
  // Joyride j06 chase: boom 9 m (+3.4 · v/vmax), height 3.5 m (+0.9 · v/vmax) in track metres × RACE_W; no side offset
  // pitch (view only): Joyride aims at a look-ahead point 11 m in front of the car; with the boom 9 m back and 3.5 m up the
  // car then sits in the lower third at ≈ −0.28 rad
  // Steuerung 10.10. (Kritiker M04: Hut verdeckt die Straße / Fahrer hinter den Lehnen): height and pitch may rise, the
  // distance stays (Georg's feel decision); tuning for the cabrio (seat backs hide the driver) paused with the cabrio port
  drive: { pivot: 0.5 * H, side: 0, up: 3.5 * RACE_W + DRIVE_UP, back: 9 * RACE_W, upV: 0.9 * RACE_W, backV: 3.4 * RACE_W, pitch: DRIVE_PITCH },
};
/** zoom: Seed World 0.55–2.8 + a POV step below (Steuerung 11.10.: WoW logic down to first person) */
const ZOOM_POV = 0.12, ZOOM_POV_IN = 0.4, POV_EYE = 0.92 * H;
const MIN_ARM = 0.7, HIT_IGNORE = 0.3 / 2.6 * H, HIT_KEEP = 0.5 / 2.6 * H, GROUND_CLEAR = 0.8 / 2.6 * H;

export interface CamHooks {
  /** first hit along a ray (world): distance or null */
  raycast(origin: THREE.Vector3, dir: THREE.Vector3, far: number, mode?: 'walk' | 'drive'): number | null;
  /** ground height under x/z (world) */
  ground(x: number, z: number): number;
  /** optional avoidance after the arm rule (e.g. never inside the car): a corrected camera point or null */
  avoid?(p: THREE.Vector3, mode: 'walk' | 'drive'): THREE.Vector3 | null;
  /** optional soft obstacle (the parked player car on foot): the arm eases to its hit at SOFT_RATE instead of the 30/s snap */
  softRaycast?(origin: THREE.Vector3, dir: THREE.Vector3, far: number, mode?: 'walk' | 'drive'): number | null;
  /** C1 (V-103): J17 rail chase camera for FAHREN — writes position / up / look / fov into `cam`, true when it drove it */
  rail?(dt: number, cam: THREE.PerspectiveCamera): boolean;
}
export interface CamTarget { position: THREE.Vector3; heading: number; speedK?: number }

export function createPlayCamera(camera: THREE.PerspectiveCamera, hooks: CamHooks) {
  let mode: 'walk' | 'drive' = 'walk', from: 'walk' | 'drive' = 'walk', handT = 1;
  const orbit = { yawOff: 0, pitch: 0 }, orbitT = { yawOff: 0, pitch: 0 };
  let zoom = 1, zoomT = 1, armLen = -1, liftS = 0, hitHold = 0, pov = 0;
  const ov = { yawOff: 0, pitch: 0 };   // orbit spring velocities
  const SOFT_RATE = 5; let softLen = 0;
  const smooth = new THREE.Quaternion(), heading = new THREE.Quaternion(), euler = new THREE.Euler(0, 0, 0, 'YXZ'), armQ = new THREE.Quaternion(), armS = new THREE.Quaternion();
  const camOff = new THREE.Vector3(), pivot = new THREE.Vector3(), arm = new THREE.Vector3(), camT = new THREE.Vector3(), tmp = new THREE.Vector3();
  let first = true, lastArm = { full: 0, used: 0, hit: null as number | null, clampedByFloor: false, groundLift: 0 };
  // C1: the rail camera works on its own scratch camera; the spring result and the rail pose are blended over the hand-over T_CAM
  // (into and out of FAHREN), so the switch is never a cut; on foot the spring camera alone drives the view (V-020…026 unchanged)
  const railCam = new THREE.PerspectiveCamera(camera.fov, camera.aspect, camera.near, camera.far), baseFov = camera.fov;
  let railOn = false; const sP = new THREE.Vector3(), sQ = new THREE.Quaternion();
  const armOf = (m: 'walk' | 'drive', k: number) => {
    const a = ARM[m] as any;
    return { pivot: a.pivot, side: a.side, up: a.up + (a.upV ?? 0) * k, back: a.back + (a.backV ?? 0) * k, pitch: a.pitch };
  };
  return {
    get mode() { return mode; },
    setMode(m: 'walk' | 'drive') { if (m === mode) return; from = mode; mode = m; handT = 0; },
    orbit(dx: number, dy: number) { orbitT.yawOff = orbitT.yawOff - dx * 0.005; orbitT.pitch = Math.max(-0.6, Math.min(0.5, orbitT.pitch - dy * 0.004)); },
    /** WoW RMB steering: the free-look yaw is handed to the actor (returns it, the camera keeps its view) */
    absorbYaw() { const y = orbitT.yawOff; orbitT.yawOff = 0; orbit.yawOff -= y; return y; },   // the full target offset: the figure turns at once (WoW), the view eases after it
    /** WoW logic: called while the actor moves; the free look eases back behind it (soft, ≈ 1.6/s), standing keeps it */
    recenter(dt: number) { const k = 1 - Math.exp(-1.6 * dt); orbitT.yawOff = Math.atan2(Math.sin(orbitT.yawOff), Math.cos(orbitT.yawOff)); orbit.yawOff = Math.atan2(Math.sin(orbit.yawOff), Math.cos(orbit.yawOff)); orbitT.yawOff -= orbitT.yawOff * k; orbitT.pitch -= orbitT.pitch * k; },   // back to the default view (yaw + pitch); the zoom stays (V-025)
    /** default camera (RollerCoaster v11 „Pet-Position“ slider, 1:1 logic): 0 = POV anchor, > 0 = linear 0.08…1 over the zoom range 0.55–2.8 */
    setDefault(v: number) { zoomT = v <= 0.01 ? ZOOM_POV : 0.55 + (2.8 - 0.55) * Math.max(v, 0.08); },
    /** wheel zoom: deltaY in pixels (touchpad) or lines × 16 (wheel), clamped ±120 then exp (ground-controller), 0.55–2.8 (sw-mech) */
    zoomBy(deltaY: number) { zoomT = Math.max(ZOOM_POV, Math.min(2.8, zoomT * Math.exp(Math.max(-120, Math.min(120, deltaY)) * 0.0012))); },
    /** first-person weight 0…1 (WoW zoom-in: below ZOOM_POV_IN the camera moves to head height; the host fades the figure by 1 − pov) */
    get pov() { return pov; },
    get state() { return { mode, handT: +handT.toFixed(3), arm: lastArm, orbit: { ...orbit }, zoom: +zoom.toFixed(3) }; },
    update(dt: number, t: CamTarget) {
      handT = Math.min(1, handT + dt / T_CAM);
      // eased inputs: orbit = critically damped spring, zoom 8/s (inertia)
      // critically damped spring (ω 7.5/s, second order): uneven pointer events per frame do not reach the view as steps
      { const W = 7.5, h = Math.min(dt, 0.05); for (const k of ['yawOff', 'pitch'] as const) { const x = orbit[k] - orbitT[k]; ov[k] += (-2 * W * ov[k] - W * W * x) * h; orbit[k] += ov[k] * h; } }
      zoom += (zoomT - zoom) * (1 - Math.exp(-8 * dt));
      const e = handT * handT * (3 - 2 * handT), k = t.speedK ?? 0, A = armOf(mode, k), B = armOf(from, k), mix = (a: number, b: number) => b + (a - b) * e;
      const P = { pivot: mix(A.pivot, B.pivot), side: mix(A.side, B.side), up: mix(A.up, B.up), back: mix(A.back, B.back), pitch: mix(A.pitch, B.pitch) };
      // view direction: behind the actor (camera looks along its heading), eased (Seed World: 40/s)
      heading.setFromEuler(euler.set(P.pitch + orbit.pitch, t.heading + Math.PI + orbit.yawOff, 0, 'YXZ'));
      if (first) smooth.copy(heading); else smooth.slerp(heading, 1 - Math.exp(-40 * dt));
      // POV: below ZOOM_POV_IN the arm folds to zero and the pivot rises to eye height (smoothstep)
      { const u = Math.max(0, Math.min(1, (ZOOM_POV_IN - zoom) / (ZOOM_POV_IN - ZOOM_POV))); pov = mode === 'walk' ? u * u * (3 - 2 * u) : 0; }
      pivot.copy(t.position).add(tmp.set(0, P.pivot + (POV_EYE - P.pivot) * pov, 0));
      // camera frame: +x right, +y up, +z back (three cameras look down −z)
      // the boom hangs on the yaw (+ the player's orbit pitch) only; the base pitch tilts the VIEW: coupled, a steeper look
      // also lifted the camera and the car stayed under the frame
      armQ.setFromEuler(euler.set(orbit.pitch, t.heading + Math.PI + orbit.yawOff, 0, 'YXZ'));
      if (first) armS.copy(armQ); else armS.slerp(armQ, 1 - Math.exp(-40 * dt));
      const zk = Math.max(zoom, 0.55) * (1 - pov);   // the third-person arm keeps the Seed-World floor 0.55, the POV step folds it away
      arm.set(P.side * (1 - pov), P.up * Math.sqrt(zk), Math.max(1e-3, P.back * zk)).applyQuaternion(armS);
      let len = arm.length(); arm.divideScalar(len); const full = len;
      const hit = hooks.raycast(pivot, arm, len + HIT_KEEP, mode);
      let floor = false, want = full;
      hitHold = hit != null && hit > HIT_IGNORE ? hitHold + 1 : 0;   // an occlusion must hold 2 frames (single-frame grazes ignored)
      if (hitHold >= 2) { const w = Math.min(len, hit! - HIT_KEEP); want = Math.max(MIN_ARM * full, w); floor = w < MIN_ARM * full; }
      // critically damped arm: in 10/s, out 3/s, never a step
      { const d = want - armLen, step = first || armLen < 0 ? d : d * (1 - Math.exp(-(d < 0 ? 8 : 3) * dt)), cap = 7.5 * dt;   // ≤ 0.12 lab / frame at 60 fps
        armLen = first || armLen < 0 ? want : armLen + Math.max(-cap, Math.min(cap, step)); }
      len = Math.min(armLen, full);
      // soft obstacle: its own length eases to the hit (and back) so a swing behind the parked car pulls in without a jump
      const sh = hooks.softRaycast?.(pivot, arm, full + HIT_KEEP, mode), softWant = sh != null && sh > HIT_IGNORE ? Math.max(MIN_ARM * full, Math.min(full, sh - HIT_KEEP)) : full;
      softLen = first ? softWant : softLen + (softWant - softLen) * (1 - Math.exp(-SOFT_RATE * dt)); len = Math.min(len, softLen);
      camT.copy(pivot).addScaledVector(arm, len);
      const gc = hooks.ground(camT.x, camT.z) + GROUND_CLEAR; let lift = 0;
      // never into the ground and never under the actor's feet (+0.25 H): at the long arm a low orbit pitch otherwise ends below
      // the island top (parity 6: −0.89 H on the hub) — that is clipping from below
      const floorY = Math.max(isFinite(gc) ? gc : -Infinity, t.position.y + 0.25 * H); if (camT.y < floorY) lift = floorY - camT.y;
      liftS = first ? lift : liftS + (lift - liftS) * (1 - Math.exp(-10 * dt)); camT.y += liftS; lift = liftS;   // smoothed ground lift
      const av = hooks.avoid?.(camT, mode); if (av) { lift += av.y - camT.y; camT.copy(av); }
      // rigid in the actor frame, only the offset is smoothed (shortening fast, lengthening slow)
      camT.sub(pivot);
      if (first) camOff.copy(camT);
      camOff.copy(camT);   // the arm length and the lift are already damped: rigid in the actor frame (Seed World)
      camera.position.copy(pivot).add(camOff);
      camera.quaternion.copy(smooth);
      // C1 rail (FAHREN): blend spring → rail on the way in, rail (last pose) → spring on the way out
      const into = mode === 'drive', outOf = from === 'drive' && mode !== 'drive' && handT < 1;
      if (hooks.rail && (into || outOf)) {
        if (into) { railCam.aspect = camera.aspect; railOn = hooks.rail(dt, railCam) || railOn; }
        if (railOn) {
          const w = into ? e : 1 - e; sP.copy(camera.position); sQ.copy(camera.quaternion);
          camera.position.lerpVectors(sP, railCam.position, w); camera.quaternion.slerpQuaternions(sQ, railCam.quaternion, w);
          const fv = baseFov + (railCam.fov - baseFov) * w; if (Math.abs(camera.fov - fv) > 0.01) { camera.fov = fv; camera.updateProjectionMatrix(); }
        }
      } else if (railOn && mode !== 'drive') { railOn = false; railCam.fov = baseFov; if (camera.fov !== baseFov) { camera.fov = baseFov; camera.updateProjectionMatrix(); } }
      first = false;
      lastArm = { full: +full.toFixed(3), used: +len.toFixed(3), hit: hit != null ? +hit.toFixed(3) : null, clampedByFloor: floor, groundLift: +lift.toFixed(3), soft: sh != null && sh > HIT_IGNORE, avoided: !!av } as any;
    },
  };
}
