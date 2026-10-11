// Stufe 2 · Ein- und Aussteigen (Steuerung 10.10., Go 5). Vorlage zuerst (QA-Protokoll §1a): the J17 travel core is taken
// over (src/play/vendor/travel-core.j17.js: states, gates V_EXIT 0.5 m/s · R_ENTER 3.5 m, Space scheme wsa6, J14 cut,
// camera hand-over); its one LAB PATCH removes the 360° spin of the exit cut (Dreh-Fehler, lead a). This file is the Lab host,
// after J17 travel-modes: walker + figure from walk.ts, car from drive.ts, visibility / squash of the cut, camera target.
// Units: the core keeps the template's metres (figure 1.85 m), so the Lab is seen through a metre façade:
// lab = figure metres × 3.64/1.85 (K2 figures); the car comes from k2b track metres × RACE_W 1.46.
// Not taken over: FB + cabrio seat layer (cabrio-seat.j17: hop, arm IK, ears/face from jsDelivr); the Retro cars get the J14 cut.
import * as THREE from 'three';
// @ts-ignore – vendored template, plain JS
import { createTravelCore, T_CAM, V_EXIT, R_ENTER } from './vendor/travel-core.j17.js';
import { createFigureWalker, measureProfiles, M2LAB_FIG } from './figure';
import { buildPlayable, loadFigureCatalog } from '../residents/figure-b2';
import type { SurfaceHit } from './surface';
import { createDrivePlay } from './drive';
import { buildSurfaceField } from './surface';
import { RACE_W } from './camera';
import { measureDrivePose, measureCabin, seatFor, loadDriveClip, type SeatMode } from './seat';
import { createCabSeat } from './cabrio-seat';
import { createCarHop } from './car-hop';
import { roleColor } from '../palettes';
import type { App } from '../main';

const KM = M2LAB_FIG;   // template metre (figure scale) → lab

/** `turnA` (B0, WoW mouse): analog turn while RMB steers — rad/s divided by the walker's turnRate; 0 = A/D */
export interface TravelKeys { fwd?: boolean; back?: boolean; left?: boolean; right?: boolean; strafeL?: boolean; strafeR?: boolean; shift?: boolean; ctrl?: boolean; jump?: boolean; turnA?: number }

/** B0 (Steuerung 11.10.): ONE gait scheme. The stage (?play=game, a demo island without a road) runs the same J17 travel core on
 *  foot: its own walk surface + spawn, and a parked, invisible stand-in car far away (the core's door distance is then never
 *  reached; no hop, no driving). */
export interface TravelStage { surface: { at(x: number, z: number): SurfaceHit | null; cells?: number; tris?: number }; spawn: [number, number, number];
  /** C1b+C3 (V-109): a real car on the stage's own closed stream (the O1 ring) instead of the parked stand-in; the hop works as on the hub */
  drive?: unknown;
  /** world height of the walkable floor: the wall sentinel sits 50–60 lab above it (the O1 hub floor is at ≈ 175 lab, not 0) */
  baseY?: number }
function standInDrive() {
  const car = new THREE.Group(); car.position.set(1e5, 0, 1e5);
  const m = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 4), new THREE.MeshBasicMaterial()); m.visible = false; m.position.y = 0.75; car.add(m);
  const driver: any = { speed: 0, onGround: true, fly: false, s: 0, lat: 0, psi: 0, hits: 0, squashV: 0, steerAngle: 0 };
  return { car, driver, bounds: { sMin: 0, sMax: 0 }, update() {}, heading: () => 0, pose: () => ({ P: [1e5 / RACE_W, 0, 1e5 / RACE_W], F: [0, 0, 1], U: [0, 1, 0], X: [1, 0, 0] }) } as unknown as Awaited<ReturnType<typeof createDrivePlay>>;
}

export async function createTravelPlay(app: App, scene: THREE.Scene, islandId: string, roadIdx = 1, spawnOff = 4, seatMode: SeatMode | 'none' = 'none', carAsset?: string, stage?: TravelStage, figure?: string) {
  const isl = app.islands.get(islandId)!, P0 = stage ? [0, stage.baseY ?? 0, 0] : isl.spec.pos;
  const drive = (stage ? (stage.drive ?? standInDrive()) : await createDrivePlay(app, scene, islandId, roadIdx, carAsset)) as Awaited<ReturnType<typeof createDrivePlay>>;
  // walk surface: island ground + the built RKIT parts (barriers are walls)
  const meshes: THREE.Mesh[] = [];
  if (!stage) isl.group.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && (m.name === 'ground' || m.name === 'road-preview' || (m.userData.rkitRole && !/^(slot|iron)$/.test(m.userData.rkitRole)))) meshes.push(m); });
  const surface = stage ? stage.surface as ReturnType<typeof buildSurfaceField> : buildSurfaceField(meshes);
  // car size in its own frame (lab)
  const car = drive.car, q0 = car.quaternion.clone(); car.quaternion.identity(); car.updateMatrixWorld(true);
  let cb = new THREE.Box3().setFromObject(car), carH = cb.max.y - cb.min.y, halfW = (cb.max.x - cb.min.x) / 2;
  car.quaternion.copy(q0); car.updateMatrixWorld(true);
  // spawn: beside the parked car on walkable ground, facing it
  const P = drive.pose(), Cp = new THREE.Vector3(...P.P).multiplyScalar(RACE_W), X = new THREE.Vector3(...P.X), Fd = new THREE.Vector3(...P.F);
  let spawn: [number, number, number] | undefined = stage?.spawn;
  if (!stage) for (const side of [-1, 1]) for (const off of [spawnOff, spawnOff + 2, spawnOff + 4, 4]) {
    if (spawn) break;
    const s = Cp.clone().addScaledVector(X, side * (halfW + off)).addScaledVector(Fd, -4), h = surface.at(s.x, s.z);
    if (h && !h.wall) spawn = [s.x, s.z, Math.atan2(Cp.x - s.x, Cp.z - s.z)];
  }
  const W = await createFigureWalker(app, scene, islandId, { surface, spawn, figure, base: P0 });
  const root = W.root, walker = W.walker;
  // ---- visible driver (Steuerung 10.10.): seat from the driving pose measured on this figure; the car adapts (scale / open
  // roof), the figure is never scaled
  // seat numbers come from the figure card (SSOT, SPEC_CHARACTER_INTEGRITY_R1: the seat is read only from the card); `seat=measure`
  // measures the pose live instead (tools/stage2/seat-measure.mjs writes the card from it)
  const card = seatMode === 'none' || (seatMode as string) === 'measure' ? null : await fetch('/cards/farmer_a.card.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const Hc = 3.64, cs = card?.seat;
  const seatPose = seatMode === 'none' ? null : cs ? { hips: [cs.hipOffset[0] * Hc, 0, cs.hipOffset[2] * Hc] as [number, number, number], seatY: -cs.hipOffset[1] * Hc, hipsAboveSeat: cs.hipOffset[1] * Hc, shoulderAboveSeat: cs.shoulderAboveSeatH * Hc, headAboveSeat: cs.headAboveSeatH * Hc, feetBelowSeat: cs.feetBelowSeatH * Hc, kneeFwd: cs.kneeFwdH * Hc, backBehind: 0, halfWidth: cs.halfWidthH * Hc } : await measureDrivePose(root, W.res.obj);
  const driveClip = seatPose ? await loadDriveClip() : undefined;
  const seat = seatPose && driveClip && (seatMode === 'closed' || seatMode === 'open') ? seatFor(measureCabin(car), seatPose, seatMode) : null;
  const clipPlane = new THREE.Plane(), localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  if (seat) {
    car.children[0].scale.setScalar(seat.carScale);   // the model's turn group: wheels stay on the ground (model base at y 0)
    if (seatMode === 'open') {   // cartoon cabrio: roof, pillars and glass cut at the window line
      localPlane.constant = seat.beltY + 0.04;
      car.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; for (const mm of Array.isArray(m.material) ? m.material : [m.material]) { mm.clippingPlanes = [clipPlane]; mm.side = THREE.DoubleSide; mm.needsUpdate = true; } });
    }
    const q1 = car.quaternion.clone(); car.quaternion.identity(); car.updateMatrixWorld(true);
    cb = new THREE.Box3().setFromObject(car); carH = (seatMode === 'open' ? seat.beltY : cb.max.y) - cb.min.y; halfW = (cb.max.x - cb.min.x) / 2;
    car.quaternion.copy(q1); car.updateMatrixWorld(true);
  }
  const socket = seat ? new THREE.Vector3(...seat.socket) : null, contact = seatPose ? new THREE.Vector3(seatPose.hips[0], seatPose.seatY, seatPose.hips[2]) : null;
  let driveAct: THREE.AnimationAction | null = null, seated = false, seatErr = 0, seatErrMax = 0, seatSway = 0;
  const seatTgt = new THREE.Vector3(); let hipsRef: THREE.Vector3 | null = null;
  const hipsBone = W.res.obj.getObjectByName('hips')!, hipsW = new THREE.Vector3();
  const sitDown = (on: boolean) => {
    if (on === seated || !driveClip) return; seated = on; const mx = W.res.mixer!;
    if (on) { for (const a of (mx as any)._actions as THREE.AnimationAction[]) if (a.isRunning()) a.fadeOut(0.12); driveAct = mx.clipAction(driveClip); driveAct.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.12).play(); }
    else driveAct?.fadeOut(0.05);
  };
  // ---- metre façade
  // the walker's ground: the car's footprint is a wall (set once the car hop exists; the hop itself never uses it)
  let carWall: ((x: number, z: number) => boolean) | null = null;
  const walkHeight = (x: number, z: number) => (carWall && carWall(x, z) ? P0[1] + 60 : W.heightAt(x, z));
  const walkerM = {
    get state() { const s = walker.state; return { ...s, position: s.position.clone().divideScalar(KM), speed: s.speed / KM }; },
    reset: (x: number, z: number, y: number, h: number) => walker.reset(x * KM, z * KM, y * KM, h),
    setInput: (x: number, y: number) => walker.setInput(x, y),
    setParams: (p: any) => walker.setParams(p),
    get params() { return walker.params; },   // LAB (B0): the core paces the full jump clips to the flight (jumpV, gravity, windup)   // speeds come from the profile set measured on the Lab rig: already lab/s
    jump: () => walker.jump(),
    update: (dt: number, o: any) => walker.update(dt, o, walkHeight),
  };
  const WALL = P0[1] + 50;
  const ground = {
    st: { s: 0, y: 0 },
    info(x: number, z: number, s?: number) { const y = W.heightAt(x * KM, z * KM), h = surface.at(x * KM, z * KM), ok = y < WALL;
      return { ok, y: y / KM, s: s ?? 0, id: h ? h.role : 'none', why: ok ? '' : h?.wall ? 'Bande' : 'kein Boden' }; },
    heightAt: (x: number, z: number) => W.heightAt(x * KM, z * KM) / KM,
    follow() {},
  };
  let Pz: any = null;
  const toM = (p: any) => p && { P: p.P.map((v: number) => (v * RACE_W) / KM), F: p.F, U: p.U, X: p.X };
  const host: any = { halfW: () => halfW / KM, carH: () => carH / KM, carPose: () => Pz, squash: (k: number) => { drive.driver.squashV += k; } };
  // ---- KFB cabrio (Steuerung 10.10.): its own seat layer (J17 port) drives the hop in / out and the seated driver
  let cabNode: any = null; car.traverse((x) => { if (x.userData.cabrio) cabNode = x.userData.cabrio; });
  const cabSeat = cabNode ? createCabSeat({ car, model: cabNode.model, contract: cabNode.contract, root, fig: W.res.obj, mixer: W.res.mixer!, idle: W.clipMap.get('Idle_A')!, drive: (await loadDriveClip())!,
    walkerReset: (x, z, h) => walker.reset(x, z, W.heightAt(x, z), h), groundOk: (x, z) => W.heightAt(x, z) < P0[1] + 50,
    // sweeps 10.10. (tools/stage2/cab-sweep.mjs): leg fix 0 (forward seat shifts push the knees into the dash)
    // + steering column 0.07 cabrio units back (car adapts to the figure's reach): hands ≤ 0.017 H up to ±45° without any forward lean
    legFixW: 0, wheelMaxDeg: 45, wheelBack: Number(new URLSearchParams(location.search).get('wheelBack') ?? 0.07), reachCap: Number(new URLSearchParams(location.search).get('reachCap') ?? 0),
    hipsAboveSeat: card?.seat ? card.seat.hipOffset[1] * 3.64 : (await fetch('/cards/farmer_a.card.json').then((r) => r.json()).catch(() => null))?.seat?.hipOffset?.[1] * 3.64 }) : null;
  // closed Retro car (MVP-1, Georg 10.10.): the J17 hop onto the roof by the door, a clay puff, gone; exit mirrored
  const carHop = cabSeat || (stage && !stage.drive) ? null : createCarHop({ car, scene, root, fig: W.res.obj, idle: W.clipMap.get('Idle_A')!, tuck: (await loadDriveClip())!, raceW: RACE_W,
    walkerReset: (x, z, h) => walker.reset(x, z, W.heightAt(x, z), h), groundY: (x, z) => { const y = W.heightAt(x, z); return y < P0[1] + 50 ? y : null; },
    // run to the door with the run profile measured on this rig; dust in the island's light sand role (ENV_ROLES, not the vfx city palette)
    run: W.clipMap.get(W.profiles.profiles.run.clip)!, runSpeed: W.profiles.profiles.run.worldSpeed, runRate: W.profiles.profiles.run.playbackRate,
    dustColors: ['sand.0', 'sand.1', 'sand.0', 'sand.2'].map((r) => roleColor(isl ? isl.spec.palette : 'otown', r)) });
  if (stage && !stage.drive && !cabSeat) host.hop = null;
  if (cabSeat) host.hop = cabSeat.hop; else if (carHop) { host.hop = carHop.hop; carWall = (x, z) => carHop.inFootWorld(x, z); }
  const actor = { id: W.res.entry.id, rig: 'Rig_' + W.res.entry.rig, root, mixer: W.res.mixer, clips: W.clipMap, feet: W.feet };
  const core: any = (createTravelCore as any)({ THREE, td: null, W: null, ground, boxes: [], turnarounds: [], walker: walkerM, actor, profiles: W.profiles, animMap: null, host, scheme: 'wsa6' });
  // start on foot (J17 starts seated; Georg's test: walk to the car first)
  Object.assign(core.S, { mode: 'WALK', st: 'WALK.GROUND', cam: 'walk', space: 'Springen', act: null });
  const keys: TravelKeys = {};
  // ---- camera target: walk = figure, drive = car; on a mode change the target itself eases over T_CAM (no pivot jump)
  let camMode: 'walk' | 'drive' = 'walk', blend = 1, fromH = 0, lastH = 0;
  const fromP = new THREE.Vector3(), lastP = new THREE.Vector3().copy(root.position), tgt = new THREE.Vector3(), cutT = new THREE.Vector3();
  let first = true, cutY = -Infinity, holdH: number | null = null, outH = 0, prevH = 0, catching = false;
  const camTarget = (dt: number) => {
    // exit cut: the camera hands over to the walk framing as the figure is spat out and aims at the landing point (in the car
    // framing the flight left the frame upwards); the core's own walk hand-over (CAM.TO_WALK) then continues from there
    const st: string = core.S.st, m = st === 'CAM.TO_AUTO' || st.startsWith('AUTO') ? 'drive' : 'walk';
    // enter cut: the target height only rises with the figure and never above the roof (no swing up to the arc apex, no drop
    // with the sink into the roof and its unseen snap back); the heading stays the player's until the hand-over
    const c = core.S.cut;
    if (c?.kind === 'enter') cutY = Math.min(c.to[1] * KM, Math.max(cutY, root.position.y)); else cutY = -Infinity;
    const tp = m === 'drive' ? car.position : c?.hop ? (c.kind === 'enter' ? cutT.copy(root.position).setY(cutY) : root.position) : c?.kind === 'enter' ? cutT.copy(root.position).setY(cutY) : c?.kind === 'exit' ? cutT.set(c.to[0], c.to[1], c.to[2]).multiplyScalar(KM).setY(Math.max(c.to[1] * KM, root.position.y - 0.6 * 3.64)) : root.position;   // exit: the target rises with the spat-out figure (at most 0.6 H below it) so the arc stays in frame
    // after the exit the core turns the figure 0.9 rad outward: behind it the camera would look across the car. It keeps the
    // car's heading until the player walks, then eases behind the figure (again over T_CAM)
    if (st === 'CUT.EXIT') holdH = drive.heading();
    if (holdH != null && st === 'WALK.GROUND' && walker.state.speed > 0.2) { holdH = null; fromP.copy(lastP); fromH = lastH; blend = 0; }
    // enter hop: the camera starts easing to the car's heading from the press (capped below), so the hand-over is spread over
    // the whole cut and the figure ends on the roof facing that way (no 90° swing after it)
    const th = m === 'drive' ? drive.heading() : holdH ?? (c?.hop && c.kind === 'enter' ? drive.heading() : walker.state.heading);
    if (first) { lastP.copy(tp); lastH = th; outH = prevH = th; first = false; }
    if (m !== camMode) { camMode = m; blend = 0; fromP.copy(lastP); fromH = lastH; }
    blend = Math.min(1, blend + dt / T_CAM);
    const e = blend * blend * (3 - 2 * blend); let dh = th - fromH; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    tgt.copy(fromP).lerp(tp, e); const h = fromH + dh * e; lastP.copy(tgt); lastH = h;
    // turn-rate cap (Kritiker 2: the spring arm swung ~90° in 1 s around the hops): in the cuts, the camera hand-overs and the
    // post-exit hold the heading follows at ≤ 36°/s and keeps that cap until it has caught up; plain walking and driving are
    // not capped (feel numbers unchanged)
    if (st.startsWith('CUT') || st.startsWith('CAM.') || holdH != null || (m === 'walk' && blend < 1)) catching = true;
    let dp = h - prevH; dp = Math.atan2(Math.sin(dp), Math.cos(dp)); prevH = h;
    if (catching && m === 'drive' && !st.startsWith('CAM.')) outH += dp;   // driving: follow the car's own turn, cap only the remaining gap
    let dq = h - outH; dq = Math.atan2(Math.sin(dq), Math.cos(dq));
    // cap 36°/s: with the spring's own smoothing and the target's travel the measured camera rate stays ≤ 45°/s
    if (catching) { const cap = 36 * Math.PI / 180 * dt; outH += Math.max(-cap, Math.min(cap, dq)); if (Math.abs(dq) < 0.02 && !(st.startsWith('CUT') || st.startsWith('CAM.') || holdH != null)) catching = false; }
    else outH = h;
    return { mode: m as 'walk' | 'drive', position: tgt, heading: outH, speedK: m === 'drive' ? Math.min(1, Math.abs(drive.driver.speed) / 41) : 0, moving: !!walker.state.moving };
  };
  const update = (dt: number) => {
    const S = core.S, shift = !!keys.shift;
    // Georg (Probe 5) / Seed-World canon: W = jog (Running_A), Shift+W = sprint (Running_B), Ctrl+W = walk (sneaking up to the
    // car); in the car Shift = boost. The core's own scheme: W = run, Ctrl = walk, boost = sprint
    core.setCtrl(!!keys.ctrl);
    const K = { gas: keys.fwd ? 1 : 0, brake: keys.back ? 1 : 0, left: keys.left ? 1 : 0, right: keys.right ? 1 : 0, driftL: keys.strafeL ? 1 : 0, driftR: keys.strafeR ? 1 : 0, boost: shift ? 1 : 0, jump: keys.jump ? 1 : 0, turnA: keys.turnA ?? 0 };
    const inp = core.carInput(K, drive.driver); lastInp = inp;   // V-128: engine level reads gas
    drive.update(dt, inp);
    Pz = toM(drive.pose());
    core.update(dt, drive.driver, Pz);
    // the core writes the actor in metres: back to lab; visibility / squash of the cut (J17 travel-modes `visuals`)
    const hopRan = carHop ? carHop.update(dt, S) : false;   // closed car: hop poses + puff (late, after the core)
    if (hopRan) { /* placed by the hop */ }
    else if (cabSeat && (S.cut?.hop || (S.mode === 'AUTO' && !S.cut))) cabSeat.update(dt, S, drive.driver.steerAngle ?? 0);   // hop poses / seated driver (late, after the core)
    else if (S.cut && S.pose) { root.position.set(S.pose.p[0], S.pose.p[1], S.pose.p[2]).multiplyScalar(KM); root.rotation.set(0, S.pose.yaw, 0); root.visible = S.pose.vis; root.scale.set(S.pose.s[0], S.pose.s[1], S.pose.s[2]); }
    else if (S.mode === 'WALK') { root.position.copy(walker.state.position); root.rotation.set(0, walker.state.heading, 0); root.visible = true; root.scale.set(1, 1, 1); }
    else if (seat && socket && contact) {   // seated: the measured seat contact sits on the car's seat point (hips on the seat)
      sitDown(true); car.updateMatrixWorld();
      root.quaternion.copy(car.quaternion); root.scale.set(1, 1, 1); root.visible = true;
      // J17 placeRoot (hop.py objmat): the root goes where the LIVE hips sit on the seat point (+ their measured height above
      // the seat surface); the driving clip moves the hips up to 0.11 H, so a fixed contact point would lift them off the seat
      root.position.set(0, 0, 0); root.updateMatrixWorld(true);
      const hl = root.worldToLocal(hipsBone.getWorldPosition(hipsW)).clone();   // live hips in the root frame
      if (!hipsRef) hipsRef = hl.clone(); seatSway = Math.max(seatSway, hl.distanceTo(hipsRef));   // how far the clip moves the hips (taken up by the root)
      seatTgt.copy(socket).setY(socket.y + seatPose!.hipsAboveSeat); car.localToWorld(seatTgt);
      root.position.copy(seatTgt).sub(hl.applyQuaternion(car.quaternion));
      root.updateMatrixWorld(true); seatErr = hipsBone.getWorldPosition(hipsW).distanceTo(seatTgt);   // hips on the seat (≤ 0.02 H)
    }
    else root.visible = false;
    if (seated && driveAct && driveAct.getEffectiveWeight() > 0.99) seatErrMax = Math.max(seatErrMax, seatErr);
    if (!(S.mode === 'AUTO' && !S.cut)) sitDown(false);
    if (cabSeat && S.mode === 'WALK' && !S.cut) cabSeat.update(dt, S, drive.driver.steerAngle ?? 0);   // parked: wheel / body roll settle
    if (seat && seatMode === 'open') { car.updateMatrixWorld(); clipPlane.copy(localPlane).applyMatrix4(car.matrixWorld); }
    W.res.eyes?.update(dt);
  };
  // ---- occlusion (Steuerung 10.10.): when the car stands between camera and figure it dithers to ≈ 35 % (screen-door alpha:
  // no sorting, no pop) and comes back in ≈ 0.2 s; the test is the car's own box against camera → figure (chest, head)
  const carMats: { m: THREE.Material; o: number }[] = [];
  car.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; for (const mm of Array.isArray(m.material) ? m.material : [m.material]) if (!carMats.some((x) => x.m === mm)) { carMats.push({ m: mm, o: mm.opacity }); if (!mm.transparent) { mm.alphaHash = true; mm.needsUpdate = true; } } });   // hashed from the start (toggling recompiles = a hitch); glass stays blended (hash on 0.55 opacity = grain)
  const carBoxL = cb.clone().translate(car.position.clone().negate()).expandByScalar(0.15);
  if (seat && seatMode === 'open') carBoxL.max.y = Math.min(carBoxL.max.y, seat.beltY + 0.15);   // the cut-away roof does not hide anything
  const inv = new THREE.Matrix4(), ray = new THREE.Ray(), hitP = new THREE.Vector3(), pt = new THREE.Vector3();
  const occRc = new THREE.Raycaster();
  // cb was measured with the car at its start pose: express it in the car's own frame (position only, rotation was identity)
  let fade = 1, occluded = false;
  const occlude = (dt: number, cam: THREE.Vector3) => {
    occluded = false;
    if (root.visible && core.S.mode === 'WALK' && !core.S.cut) {   // on foot only: in the cuts the figure goes into / out of the car
      car.updateMatrixWorld(); inv.copy(car.matrixWorld).invert();
      for (const h of [0.5, 0.85]) {
        pt.copy(root.position).setY(root.position.y + h * 3.64).applyMatrix4(inv); const o = cam.clone().applyMatrix4(inv), dir = pt.clone().sub(o), len = dir.length();
        ray.set(o, dir.divideScalar(len)); if (!(ray.intersectBox(carBoxL, hitP) && hitP.distanceTo(o) < len)) continue;
        // box hit: confirm on the body itself (Messung 07: beside the door the line of sight clipped the box corner and the
        // car dithered while the figure stood fully visible)
        if (!carHop) { occluded = true; break; }
        const pw = root.position.clone().setY(root.position.y + h * 3.64), d = pw.clone().sub(cam), L = d.length(); occRc.set(cam, d.divideScalar(L)); occRc.far = L;
        if (occRc.intersectObjects(carHop.carMeshes, false).length) { occluded = true; break; }
      }
    }
    const target = occluded ? 0.35 : 1; fade += Math.sign(target - fade) * Math.min(Math.abs(target - fade), (0.65 / 0.2) * dt);
    for (const x of carMats) x.m.opacity = x.o * fade;
  };
  let lastInp: any = null;   // V-128: the last car input (engine bed level)
  const state = () => { const S = core.S, d = drive.driver; return { mode: S.mode, st: S.st, space: S.space, spaceOk: S.spaceOk, reject: S.reject?.text ?? null, cut: S.cut ? { kind: S.cut.kind, t: +S.cut.t.toFixed(3) } : null,
    yaw: S.pose ? +S.pose.yaw.toFixed(3) : +walker.state.heading.toFixed(3), vis: root.visible, rootScaleY: +root.scale.y.toFixed(3), gait: S.gait, clip: S.clip,
    fig: root.position.toArray().map((v) => +v.toFixed(2)), car: car.position.toArray().map((v) => +v.toFixed(2)), carSpeed: +d.speed.toFixed(2), doorDistLab: +Math.hypot(root.position.x - car.position.x, root.position.z - car.position.z).toFixed(2), seated, seatErrH: +(seatErr / 3.64).toFixed(4), seatErrMaxH: +(seatErrMax / 3.64).toFixed(4), clipHipSwayH: +(seatSway / 3.64).toFixed(4), carFade: +fade.toFixed(3), carOccludes: occluded, hopPhase: carHop ? carHop.phase : null, camCatch: catching }; };
  // ---- B2 (Steuerung 11.10.): swap the player figure — same root, walker and core (core.setActor); the profile set is
  // measured on the new figure's own rig (Large: Rig_Large clips). The car seat layers stay Farmer_A's card (hub driving).
  let swapping: Promise<any> | null = null;
  const setFigure = (id: string, variant = 0) => (swapping = (async () => {
    await swapping?.catch(() => null);
    const e = (await loadFigureCatalog()).find((x) => x.id === id); if (!e) return null;
    const F = await buildPlayable(e, variant);
    W.res.dispose(); root.add(F.obj);
    const prof = measureProfiles(F, root);
    W.res = F; W.profiles = prof; W.clipMap = new Map(F.clips.map((c) => [c.name, c])); W.feet = F.feet ?? { l: F.obj, r: F.obj };
    core.setActor({ id: e.id, rig: 'Rig_' + e.rig, root, mixer: F.mixer, clips: W.clipMap, feet: W.feet }, prof, null);
    return figureInfo();
  })());
  const figureInfo = () => { const F = W.res, p = W.profiles; return { id: F.entry.id, label: F.entry.label, group: F.entry.group, rig: F.entry.rig, variant: F.variant, eyes: F.eyeReport, clips: F.clips.map((c) => c.name).filter((n) => n !== 'T-Pose'), unmapped: p.unmapped ?? [], tempo: p.tempo ?? 'gemessen', run: p.profiles?.run?.worldSpeed ?? null }; };
  const seatInfo = async () => ({ mode: seatMode, seat, pose: seatPose, card: card ? card.id : null, cab: cabSeat ? cabSeat.metrics() : null, H: 3.64 });
  return { core, drive, walk: W, keys, setFigure, figureInfo, update, camTarget, occlude, state, carInput: () => lastInp, seatInfo, cabSeat, carHop, hopInfo: () => (carHop ? carHop.metrics() : null), surface: { cells: surface.cells, tris: surface.tris }, surfaceAt: (x: number, z: number) => surface.at(x, z), gates: { V_EXIT, R_ENTER_m: R_ENTER, R_ENTER_lab: +(R_ENTER * KM).toFixed(2) }, spawnFound: !!spawn };
}
