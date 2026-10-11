// Stufe 2 · Ein- und Aussteigen am geschlossenen Retro-Auto (Georg 10.10. abends: MVP-1 fährt im Cicada, die Figur ist beim
// Fahren nicht zu sehen). Vorlage zuerst: the J17 hop (cabrio-seat.j17.js / FB-CAR-01 hop.py): pose recipe stand → crouch
// (45 % towards seated) → seated tuck held in flight → land, timeline 12 / 20 / 10 frames at 30 fps in, 10 / 20 / 12 / 20 out,
// quadratic Bézier hips path, yaw eased in flight. For a closed car the hop does not end in a seat: the figure lands tucked on
// the roof above its door (lowest skinned vertex on the roof skin), and a clay puff (Joyride clay-vfx v1, landing · city)
// covers the "plop" — it squashes into the roof contact and is gone; nothing ever passes through the body (Kritiker f_7_2).
// Exit mirrored: pop out of the roof with a puff, hop off, land beside the door facing forward. Every pose is a clip snapshot
// (no bind / T-pose frame). Gate measured every hop frame: lowest skinned vertex over the car ≥ the car's top skin, beside it
// ≥ the ground.
// Fix-Liste nach Kritiker-Runde 2 (Steuerung 10.10.): run to the door (docking point 0.3 H beside the front door) before the
// take-off, tight arc over the roof, landing 0.3 H beside the door, soft blob contact shadow through the whole hop, dust = 5 light
// clay dabs in the island's sand colour that pop, squash and shrink to zero in ≤ 0.4 s (clay-vfx profile override, data only).
import * as THREE from 'three';
// @ts-ignore – vendored template, plain JS
import { makeClayVFX } from './vendor/clay-vfx.v1.js';
// @ts-ignore – vendored data
import PP from './vendor/clay-particle-profiles.v1.json';

type Pose = Map<string, { q: THREE.Quaternion; p: THREE.Vector3 }>;
const V3 = () => new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const RIG = 1.6;   // lab per rig unit (K2 FIG_SCALE): J17 offsets given in rig units
const F30 = (n: number) => n / 30;
const T_IN = { crouch: F30(12), hop: F30(20), land: F30(10), plop: 0.2 }, T_OUT = { pop: 0.2, hop: F30(20), land: F30(12), stand: F30(20) };
const ROOF_CLEAR = 0.06, APEX = 0.5, H = 3.64;   // tight arc: 0.5 lab over the higher end (J17's 1.25 rig over the cabrio sill read as a big leap)
const T_TURN = 0.25;   // at the door: turn to face it

export interface CarHopOpts { car: THREE.Object3D; scene: THREE.Scene; root: THREE.Object3D; fig: THREE.Object3D; idle: THREE.AnimationClip; tuck: THREE.AnimationClip; raceW: number;
  walkerReset(x: number, z: number, heading: number): void; groundY(x: number, z: number): number | null;
  /** run to the door with the measured run profile (world speed lab/s, playback rate): the feet do not skate */ run: THREE.AnimationClip; runSpeed: number; runRate: number;
  /** dust colours from the island palette (ENV_ROLES sand) */ dustColors: string[] }

export function createCarHop(o: CarHopOpts) {
  const { car, root, fig } = o;
  // ---- poses from the clips (J17 figData snapshots): every hop frame is written from these, never the bind pose
  const by: Record<string, THREE.Object3D> = {}; fig.traverse((x) => { if ((x as THREE.Bone).isBone) by[x.name] = x; });
  const bones = [...new Set([...o.tuck.tracks, ...o.idle.tracks, ...o.run.tracks].map((t) => t.name.split('.')[0]))].filter((n) => by[n]);
  const snap = (clip: THREE.AnimationClip, t: number): Pose => { const mx = new THREE.AnimationMixer(fig), a = mx.clipAction(clip); a.play(); mx.setTime(t); const out: Pose = new Map(); for (const n of bones) out.set(n, { q: by[n].quaternion.clone(), p: by[n].position.clone() }); a.stop(); mx.uncacheRoot(fig); return out; };
  const blend = (A: Pose, B: Pose, t: number): Pose => { const r: Pose = new Map(); for (const [n, a] of A) { const b = B.get(n) || a; r.set(n, { q: a.q.clone().slerp(b.q, t), p: a.p.clone().lerp(b.p, t) }); } return r; };
  const writePose = (P: Pose) => { for (const [n, v] of P) { const b = by[n]; b.quaternion.copy(v.q); b.position.copy(v.p); } };
  const STAND = snap(o.idle, 0), TUCK = snap(o.tuck, 0), CROUCH = blend(STAND, TUCK, 0.45);
  // run cycle sampled straight from its tracks (no second mixer): the approach to the door at the profile's own speed × rate
  const runTr = o.run.tracks.map((t) => ({ n: t.name.split('.')[0], prop: t.name.split('.').pop()!, it: (t as any).createInterpolant() as THREE.Interpolant })).filter((x) => by[x.n] && (x.prop === 'quaternion' || x.prop === 'position'));
  const runAt = (time: number): Pose => { const P = blend(STAND, STAND, 0), tt = time % o.run.duration; for (const x of runTr) { const r = x.it.evaluate(tt), e = P.get(x.n); if (!e) continue; if (x.prop === 'quaternion') e.q.fromArray(r as any); else e.p.fromArray(r as any); } return P; };
  // walking jump (Kritiker 2, point 6): every KayKit jump clip spreads the arms 46–88° (Idle 31°); the arms take the standing pose
  const ARMS = [...STAND.keys()].filter((n) => /upperarm|lowerarm|wrist|hand/i.test(n));
  let armW = 0;
  // measured live: sagittal-plane abduction of upperarm → wrist in the root frame, max over the walking-jump frames (deg)
  const armPair = (sd: string) => [ARMS.find((n) => /upperarm/i.test(n) && n.toLowerCase().endsWith(sd)), ARMS.find((n) => /wrist/i.test(n) && n.toLowerCase().endsWith(sd))].map((n) => n && by[n]);
  const armsLR = [armPair('l'), armPair('r')].filter((x) => x[0] && x[1]) as THREE.Object3D[][], rootInv = new THREE.Matrix4();
  const abd = { jumpMaxDeg: 0, minDeg: 180, frames: 0 };
  // in: at once at take-off (the jump clip itself fades in over 0.08 s, its arms never show); out: 0.15 s back to the gait
  const armsDown = (dt: number, on: boolean) => { armW = on ? 1 : Math.max(0, armW - dt / 0.15); if (armW > 0) for (const n of ARMS) { const v2 = STAND.get(n)!; by[n].quaternion.slerp(v2.q, armW); }
    if (!on) return; root.updateMatrixWorld(true); rootInv.copy(root.matrixWorld).invert(); abd.frames++;
    for (const [u, w] of armsLR) { const a = u.getWorldPosition(V3()).applyMatrix4(rootInv), b = w.getWorldPosition(V3()).applyMatrix4(rootInv), d = b.sub(a); const deg = Math.asin(Math.min(1, Math.abs(d.x) / d.length())) * 180 / Math.PI; abd.jumpMaxDeg = Math.max(abd.jumpMaxDeg, deg); abd.minDeg = Math.min(abd.minDeg, deg); } };
  // skinned vertices (all) for the contact / gate: lowest point in a frame
  const skins: THREE.SkinnedMesh[] = []; fig.traverse((x) => { if ((x as THREE.SkinnedMesh).isSkinnedMesh) skins.push(x as THREE.SkinnedMesh); });
  const v = V3();
  const lowestIn = (frame: THREE.Matrix4) => { let best = Infinity; const at = V3(); for (const m of skins) { const n = m.geometry.attributes.position.count; for (let i = 0; i < n; i += 2) { m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld).applyMatrix4(frame); if (v.y < best) { best = v.y; at.copy(v); } } } return at; };
  // hips above the lowest point, per pose (root at identity)
  const dropOf = (P: Pose) => { writePose(P); const q = root.quaternion.clone(), p = root.position.clone(), s = root.scale.clone(); root.quaternion.identity(); root.position.set(0, 0, 0); root.scale.set(1, 1, 1); root.updateMatrixWorld(true);
    const h = by.hips.getWorldPosition(V3()).y, low = lowestIn(new THREE.Matrix4()).y; root.quaternion.copy(q); root.position.copy(p); root.scale.copy(s); root.updateMatrixWorld(true); return h - low; };
  const dropStand = dropOf(STAND), dropTuck = dropOf(TUCK), dropCrouch = dropOf(CROUCH);   // hips over the lowest point: the crouch pose already bends the knees
  // ---- the car in its own frame (lab, +x left, +z forward, base y 0): box and roof skin by rays onto its meshes
  const meshes: THREE.Mesh[] = []; car.traverse((x) => { const m = x as THREE.Mesh; if (m.isMesh) meshes.push(m); });
  const q0 = car.quaternion.clone(), p0 = car.position.clone(); car.quaternion.identity(); car.position.set(0, 0, 0); car.updateMatrixWorld(true);
  const box = new THREE.Box3(); for (const m of meshes) box.union(new THREE.Box3().setFromObject(m));
  car.quaternion.copy(q0); car.position.copy(p0); car.updateMatrixWorld(true);
  const rc = new THREE.Raycaster();
  const topAt = (lx: number, lz: number) => { car.updateMatrixWorld(true); const a = car.localToWorld(new THREE.Vector3(lx, box.max.y + 2, lz)), b = car.localToWorld(new THREE.Vector3(lx, box.min.y - 1, lz)); rc.set(a, b.sub(a).normalize()); rc.far = box.max.y - box.min.y + 3; const h = rc.intersectObjects(meshes, false)[0]; return h ? car.worldToLocal(h.point.clone()).y : null; };
  const halfW = (box.max.x - box.min.x) / 2, inFoot = (p: THREE.Vector3) => p.x > box.min.x && p.x < box.max.x && p.z > box.min.z && p.z < box.max.z;
  // door: the Retro FBX has no door part; the front door's middle sits at +0.08 of the length in front of the centre (door seam
  // and handle in the side view); docking point 0.3 H beside the body side
  const DOOR_Z = 0.08 * (box.max.z - box.min.z), DOOR_OUT = halfW + 0.3 * H, ROOF_X = 0.32 * halfW, ROOF_Z = DOOR_Z;
  // ---- clay puff (Joyride clay-vfx v1 in its own metres: a group scaled by RACE_W)
  const vfxRoot = new THREE.Group(); vfxRoot.name = 'clay-vfx'; vfxRoot.scale.setScalar(o.raceW); o.scene.add(vfxRoot);
  // dust (Kritiker 2: dark hard balls that stayed on the asphalt): the city landing profile with the island's sand colours,
  // 5 small soft squashed drops flung out in a ring (apart, not one lump), no sticking / bouncing, life 0.30–0.36 s (pop in
  // 0.07 s, squash on contact, shrink to zero)
  const PPD = JSON.parse(JSON.stringify(PP)); PPD.profiles = PPD.profiles.map((p: any) => (p.id !== 'city.landing' ? p : { ...p, palette: o.dustColors, meshSet: { drop: 1 }, sizeRange: [0.13, 0.2], speedRange: [2.2, 3.0], lifetimeRange: [0.3, 0.36], stickChance: 0, bounce: 0, gravityScale: 0.6, bigLumps: null }));
  const VFX = makeClayVFX(vfxRoot, PPD, {});
  const dust = { t: 0, since: -1, lifeMax: 0 };
  const puff = (pw: THREE.Vector3) => { const k = 1 / o.raceW; VFX.emit('landing', 'city', { pos: pw.clone().multiplyScalar(k), dir: Y.clone(), groundY: pw.y * k, count: 5 }); dust.since = dust.t; };
  // ---- blob contact shadow (soft clay spot, no hard edge) under the lowest point through the whole hop
  const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!, r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.55, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, color: '#2a211d', transparent: true, depthWrite: false, opacity: 0.62, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  blob.name = 'hop-blob-shadow'; blob.renderOrder = 2; blob.visible = false; o.scene.add(blob);
  // ---- placement in the car frame: root yaw relative to the car, hips at a car-local point
  const qY = new THREE.Quaternion(), hw = V3(), carInv = new THREE.Matrix4();
  const place = (hipsL: THREE.Vector3, yaw: number, scaleY = 1, contactL?: THREE.Vector3) => {
    car.updateMatrixWorld(true); root.quaternion.copy(car.quaternion).multiply(qY.setFromAxisAngle(Y, yaw)); root.scale.set(1, 1, 1); root.position.set(0, 0, 0); root.updateMatrixWorld(true);
    by.hips.getWorldPosition(hw); root.position.copy(car.localToWorld(hipsL.clone())).sub(hw);
    if (scaleY < 1 && contactL) { const c = car.localToWorld(contactL.clone()), xz = 1 + 0.35 * (1 - scaleY); root.scale.set(xz, Math.max(0.001, scaleY), xz); root.position.sub(c).multiply(root.scale).add(c); }
    root.updateMatrixWorld(true); };
  // ---- surface under a car-local point (car top skin over the footprint, else the ground), car-local y
  const surfL = (l: THREE.Vector3) => { if (inFoot(l)) { const t = topAt(l.x, l.z); if (t != null) return t; } const w = car.localToWorld(l.clone()), g = o.groundY(w.x, w.z); return g == null ? null : car.worldToLocal(w.setY(g)).y; };
  // ---- gate
  const M = { by: {} as Record<string, number>, where: {} as Record<string, string>, frames: 0, below: 0, depthMax: 0, minClear: Infinity, phases: [] as string[] };
  const Q = { takeoff: null as null | { outH: number; dzH: number }, landing: null as null | { outH: number; dzH: number }, path: [] as number[][], blobFrames: 0, hopFrames: 0 };
  let lastLow = V3(), lastSurf: number | null = null;
  const gate = (ph: string) => { car.updateMatrixWorld(true); carInv.copy(car.matrixWorld).invert(); root.updateMatrixWorld(true); const low = lowestIn(carInv); M.frames++;
    const surf = surfL(low); lastLow = low; lastSurf = surf;
    if (surf != null) { const d = low.y - surf; M.minClear = Math.min(M.minClear, d); if (d < -0.02) { M.below++; M.depthMax = Math.max(M.depthMax, -d); M.by[ph] = Math.max(M.by[ph] ?? 0, +(-d / 3.64).toFixed(4)); M.where[ph] = inFoot(low) ? 'car' : 'ground'; } }
    if (!M.phases.includes(ph)) M.phases.push(ph); };
  // door distance: the hips' lateral distance from the body side (H) and their offset from the door's middle along the car (H)
  const doorDist = () => { const l = by.hips.getWorldPosition(V3()).applyMatrix4(carInv.copy(car.matrixWorld).invert()); return { outH: +((Math.abs(l.x) - halfW) / H).toFixed(3), dzH: +((l.z - DOOR_Z) / H).toFixed(3) }; };
  // ---- the hop for the travel core (host.hop): time, side, path; poses are written in update (late)
  let side = 1;
  const doorL = (sd: number) => new THREE.Vector3(sd * DOOR_OUT, 0, DOOR_Z);
  const okL = (l: THREE.Vector3) => { const w = car.localToWorld(l.clone()); return o.groundY(w.x, w.z) != null; };
  const carYaw = () => { const f = V3().set(0, 0, 1).applyQuaternion(car.quaternion); return Math.atan2(f.x, f.z); };
  const hop = {
    wants: () => true,
    step(c: any, dt: number, _Pz: any, S: any) { S.pose = null; c.t += dt;
      if (!c.h) { car.updateMatrixWorld(true); carInv.copy(car.matrixWorld).invert(); const h: any = c.h = { kind: c.kind };
        const roofY = (sd: number) => topAt(sd * ROOF_X, ROOF_Z) ?? box.max.y;
        if (c.kind === 'enter') { const hp = root.position.clone().applyMatrix4(carInv); side = hp.x >= 0 ? 1 : -1;   // the door on the figure's own side
          if (!okL(doorL(side)) && okL(doorL(-side))) side = -side;
          // approach: straight to the docking point; if the car body is in the way (figure in front of / behind it), round its corner
          const D = doorL(side), m = 0.5, pts = [hp.clone().setY(0)];
          const hits = (a: THREE.Vector3, b: THREE.Vector3) => { for (let k = 0; k <= 20; k++) { const q = a.clone().lerp(b, k / 20); if (q.x > box.min.x - m && q.x < box.max.x + m && q.z > box.min.z - m && q.z < box.max.z + m) return true; } return false; };
          if (hits(pts[0], D)) pts.push(new THREE.Vector3(side * DOOR_OUT, 0, hp.z > 0 ? box.max.z + 0.8 : box.min.z - 0.8));
          pts.push(D); h.path = pts; h.len = pts.slice(1).reduce((a, q, k) => a + q.distanceTo(pts[k]), 0);
          h.Ta = h.len < 0.2 ? 0 : h.len / o.runSpeed + 0.075; h.runYaw = root.rotation.y; h.faceYaw = carYaw() - side * Math.PI / 2;
          h.roof = new THREE.Vector3(side * ROOF_X, roofY(side) + dropTuck + ROOF_CLEAR, ROOF_Z); h.contact = new THREE.Vector3(side * ROOF_X, roofY(side) + ROOF_CLEAR, ROOF_Z);
          h.t0 = h.Ta + T_TURN; h.T = h.t0 + T_IN.crouch + T_IN.hop + T_IN.land + T_IN.plop; Q.path = pts.map((q) => [+q.x.toFixed(2), +q.z.toFixed(2)]); }
        else { side = okL(doorL(side)) ? side : okL(doorL(-side)) ? -side : side;
          const lw = car.localToWorld(doorL(side)), gy = o.groundY(lw.x, lw.z) ?? lw.y;
          h.roof = new THREE.Vector3(side * ROOF_X, roofY(side) + dropTuck + ROOF_CLEAR, ROOF_Z); h.contact = new THREE.Vector3(side * ROOF_X, roofY(side) + ROOF_CLEAR, ROOF_Z);
          h.landY = groundL(car.worldToLocal(lw.clone().setY(gy))); h.land = new THREE.Vector3(side * DOOR_OUT, h.landY + dropCrouch, DOOR_Z); h.T = T_OUT.pop + T_OUT.hop + T_OUT.land + T_OUT.stand; } }
      if (c.t >= c.h.T && c.kind === 'exit') { const w = car.localToWorld(doorL(side)); o.walkerReset(w.x, w.z, carYaw()); }
      return c.t >= c.h.T; } };
  // J17 hop.py path: the control point puts the arc's middle at the peak (higher end + apex lift)
  // ground under a car-local point: the highest walkable height within 0.6 lab (kerbs, sloped edges: no foot below the ground)
  const groundL = (l: THREE.Vector3) => { let best = -Infinity; for (const [dx, dz] of [[0, 0], [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6], [0.42, 0.42], [-0.42, 0.42], [0.42, -0.42], [-0.42, -0.42]]) { const w = car.localToWorld(new THREE.Vector3(l.x + dx, 0, l.z + dz)), g = o.groundY(w.x, w.z); if (g != null) best = Math.max(best, car.worldToLocal(w.setY(g)).y); } return best === -Infinity ? l.y : best; };
  const bez = (P0: THREE.Vector3, P2: THREE.Vector3, k: number) => { const peak = Math.max(P0.y, P2.y) + APEX, P1 = P0.clone().lerp(P2, 0.5); P1.y = 2 * peak - (P0.y + P2.y) / 2; const q = 1 - k; return P0.clone().multiplyScalar(q * q).addScaledVector(P1, 2 * q * k).addScaledVector(P2, k * k); };
  const yawLerp = (a: number, b: number, k: number) => { let d = b - a; d = Math.atan2(Math.sin(d), Math.cos(d)); return a + d * k; };
  // ground phases: a blend between two measured poses can dip its lowest point slightly — lift by the exact difference
  const keepAbove = (gyL: number) => { car.updateMatrixWorld(true); carInv.copy(car.matrixWorld).invert(); root.updateMatrixWorld(true); const low = lowestIn(carInv); if (low.y < gyL) { root.position.addScaledVector(Y.clone().applyQuaternion(car.quaternion), gyL - low.y); root.updateMatrixWorld(true); } };
  // on the ground in world terms (run / turn): root on the ground point, world yaw
  const placeGround = (l: THREE.Vector3, yawW: number) => { const w = car.localToWorld(l.clone().setY(0)), g = o.groundY(w.x, w.z); root.position.set(w.x, g ?? w.y, w.z); root.rotation.set(0, yawW, 0); root.scale.set(1, 1, 1); root.updateMatrixWorld(true); };
  const along = (pts: THREE.Vector3[], d: number) => { for (let k = 1; k < pts.length; k++) { const L = pts[k].distanceTo(pts[k - 1]); if (d <= L || k === pts.length - 1) { const q = Math.min(1, d / Math.max(1e-6, L)); return { p: pts[k - 1].clone().lerp(pts[k], q), dir: pts[k].clone().sub(pts[k - 1]) }; } d -= L; } return { p: pts[0].clone(), dir: V3() }; };
  // blob contact shadow: under the hips on the surface below, smaller and fainter with height; w = phase fade
  const blobAt = (w: number) => { if (w <= 0.001 || lastSurf == null) { blob.visible = false; return; }
    const hl = by.hips.getWorldPosition(V3()).applyMatrix4(carInv.copy(car.matrixWorld).invert()), s = surfL(hl.clone().setY(lastLow.y)) ?? lastSurf, up = Math.max(0, lastLow.y - s), k = Math.min(1, up / 2.5);
    blob.position.copy(car.localToWorld(new THREE.Vector3(hl.x, s + 0.03, hl.z))); blob.quaternion.copy(car.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2));
    const d = 1.5 * (1 - 0.35 * k) * Math.max(0.3, root.scale.x); blob.scale.set(d, d, 1); (blob.material as THREE.MeshBasicMaterial).opacity = 0.62 * w * (1 - 0.55 * k); blob.visible = true; Q.blobFrames++; };
  let phase = 'off', puffed = '';
  /** late step (after the travel core): writes the hop pose and places the figure; false when no hop runs */
  const update = (dt: number, S: any) => {
    VFX.update(dt); dust.t += dt;
    if (dust.since >= 0 && VFX.stats.alive === 0) { dust.lifeMax = Math.max(dust.lifeMax, dust.t - dust.since); dust.since = -1; }
    armsDown(dt, S.st === 'WALK.JUMP' && !S.cut);
    if (!(S.cut && S.cut.hop && S.cut.h)) { phase = 'off'; puffed = ''; blob.visible = false; return false; }
    const h = S.cut.h, t = S.cut.t; let bw = 1; Q.hopFrames++;
    if (h.kind === 'enter') {
      if (t < h.Ta) { const d = o.runSpeed * (t < 0.15 ? (t * t) / 0.3 : t - 0.075), a = along(h.path, d), runP = runAt(t * o.runRate);
        if (a.dir.lengthSq() > 1e-6) { const dw = a.dir.clone().transformDirection(car.matrixWorld); h.runYaw = yawLerp(h.runYaw, Math.atan2(dw.x, dw.z), 1 - Math.exp(-14 * dt)); }
        writePose(blend(STAND, runP, Math.min(1, t / 0.12))); h.runEnd = runP; placeGround(a.p, h.runYaw); keepAbove(groundL(a.p)); phase = 'runToDoor'; bw = 0; }
      else if (t < h.t0) { const k = ss((t - h.Ta) / T_TURN), D = h.path[h.path.length - 1]; writePose(blend(h.runEnd ?? STAND, STAND, k)); placeGround(D, yawLerp(h.runYaw, h.faceYaw, k)); keepAbove(groundL(D)); phase = 'turnToDoor'; bw = k;
        h.startW = by.hips.getWorldPosition(V3()); }
      else {
        if (!h.start) { const hp = (h.startW ?? by.hips.getWorldPosition(V3())).clone().applyMatrix4(carInv.copy(car.matrixWorld).invert()); hp.y = groundL(hp) + dropStand; h.start = hp; h.yawHop = Math.atan2(h.roof.x - hp.x, h.roof.z - hp.z); h.yaw0 = h.faceYaw - carYaw(); }
        const tt = t - h.t0, crouchStart = h.start.clone(), crouchEnd = h.start.clone().setY(h.start.y - (dropStand - dropCrouch));   // J17 lowered by 0.14 rig on top of the crouch pose: feet went into the ground
        if (tt < T_IN.crouch) { const k = ss(tt / T_IN.crouch); writePose(blend(STAND, CROUCH, k)); place(crouchStart.lerp(crouchEnd, k), yawLerp(h.yaw0, h.yawHop, k)); keepAbove(h.start.y - dropStand); phase = 'crouchIn'; }
        else if (tt < T_IN.crouch + T_IN.hop) { const k = (tt - T_IN.crouch) / T_IN.hop; if (!Q.takeoff || phase === 'crouchIn') Q.takeoff = doorDist(); writePose(blend(CROUCH, TUCK, ss(Math.min(1, k * 2.5)))); place(bez(crouchEnd, h.roof, k), yawLerp(h.yawHop, 0, ss(k))); phase = 'hopIn'; }
        else if (tt < T_IN.crouch + T_IN.hop + T_IN.land) { writePose(TUCK); place(h.roof, 0); phase = 'landRoof'; }
        else { const k = ss((tt - T_IN.crouch - T_IN.hop - T_IN.land) / T_IN.plop); writePose(TUCK); place(h.roof, 0, 1 - k, h.contact); phase = 'plop'; bw = 1 - k;
          if (puffed !== 'in') { puff(car.localToWorld(h.contact.clone())); puffed = 'in'; } } }
      root.visible = phase !== 'plop' || t < h.T - 0.02;
    } else {
      if (t < T_OUT.pop) { const k = ss(t / T_OUT.pop); writePose(TUCK); place(h.roof, 0, Math.max(0.001, k), h.contact); phase = 'popOut'; bw = k; if (puffed !== 'out') { puff(car.localToWorld(h.contact.clone())); puffed = 'out'; } }
      else if (t < T_OUT.pop + T_OUT.hop) { const k = (t - T_OUT.pop) / T_OUT.hop; writePose(blend(TUCK, CROUCH, ss(Math.max(0, (k - 0.5) * 2)))); place(bez(h.roof, h.land, k), 0); phase = 'hopOut'; }
      else if (t < T_OUT.pop + T_OUT.hop + T_OUT.land) { const k = ss((t - T_OUT.pop - T_OUT.hop) / T_OUT.land); writePose(blend(CROUCH, STAND, k)); place(h.land.clone().setY(h.landY + dropCrouch + (dropStand - dropCrouch) * k), 0); keepAbove(h.landY); if (phase === 'hopOut') Q.landing = doorDist(); phase = 'landOut';
        if (puffed !== 'land') { puff(car.localToWorld(new THREE.Vector3(h.land.x, h.landY, h.land.z))); puffed = 'land'; } }
      else { const k = ss((t - T_OUT.pop - T_OUT.hop - T_OUT.land) / T_OUT.stand); writePose(STAND); place(h.land.clone().setY(h.landY + dropStand), 0); phase = 'standOut'; bw = 1 - k; }
      root.visible = true;
    }
    gate(phase); blobAt(bw); return true;
  };
  const metrics = () => ({ phase, belowByPhaseH: M.by, belowWhere: M.where, frames: M.frames, belowSurfaceFrames: M.below, belowDepthMaxH: +(M.depthMax / 3.64).toFixed(4), minClearanceH: M.minClear === Infinity ? null : +(M.minClear / 3.64).toFixed(4), phases: M.phases, doorTakeoffH: Q.takeoff, doorLandingH: Q.landing, approachPath: Q.path, blobFrames: Q.blobFrames, hopFrames: Q.hopFrames, dustLifeMaxS: +dust.lifeMax.toFixed(3), dustEmitted: VFX.stats.emitted, dustPeak: VFX.stats.peak, door: { z: +DOOR_Z.toFixed(2), out: +DOOR_OUT.toFixed(2) }, armAbdW: +armW.toFixed(2), walkJumpArmAbdMaxDeg: +abd.jumpMaxDeg.toFixed(1), walkJumpArmAbdMinDeg: +abd.minDeg.toFixed(1), walkJumpFrames: abd.frames, armBones: armsLR.length, dropStandLab: +dropStand.toFixed(3), dropTuckLab: +dropTuck.toFixed(3), car: { halfW: +halfW.toFixed(2), top: +box.max.y.toFixed(2) } });
  /** camera avoidance (Steuerung: never through the car): a point inside the car box goes up over the roof */
  const avoid = (pw: THREE.Vector3) => { car.updateMatrixWorld(true); const l = car.worldToLocal(pw.clone()), m = 0.4; if (l.x < box.min.x - m || l.x > box.max.x + m || l.z < box.min.z - m || l.z > box.max.z + m || l.y > box.max.y + m) return null; l.y = box.max.y + m; return car.localToWorld(l); };
  /** the parked / driven car is a wall for the walker (Kritiker f_7_2 family: no walking through the body); margin in lab */
  const inFootWorld = (x: number, z: number, m = 0.35) => { const l = car.worldToLocal(new THREE.Vector3(x, car.position.y, z)); return l.x > box.min.x - m && l.x < box.max.x + m && l.z > box.min.z - m && l.z < box.max.z + m; };
  return { hop, update, metrics, avoid, inFootWorld, carMeshes: meshes, get phase() { return phase; }, vfx: VFX };
}
