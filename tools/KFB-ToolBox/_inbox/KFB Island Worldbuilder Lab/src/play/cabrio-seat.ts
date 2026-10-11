// Stufe 2 · Sitz im KFB-Cabrio (Steuerung 10.10.). Vorlage zuerst: J17 cabrio-seat.j17.js (vendored, src/play/vendor/j17) and
// its seat contract FB-CAR-01 (hips socket, hop timeline + Bézier path as hop.py, steering wheel, grips at 10 / 2 o'clock).
// This file ports the J17 seat layer to the Lab for any Rig_Medium figure (Farmer A first, FB next): J17 binds it to FB and
// to Joyride's api (carG / drv / TV.late) — here it takes the Lab car, the walker and the travel core. Ported 1:1: hop pose
// recipe (stand → crouch 45 % → seated pose held in flight → land with dip), hips path, yaw 90→180 / 180→270, placeRoot,
// leg fix, reach lean, 2-bone arm IK onto the rim, lean / bounce / body roll, wheel angle. Not ported: the J14 roof-dive cut
// (with its 360° spin), FB face / ears (next step). Units: model-local = cabrio units (contract), world = lab.
// Gates measured every frame (Steuerung): hands on the rim ≤ 0.03 H over a full steering sweep, hips on the seat ≤ 0.02 H,
// feet above the cabin floor, hips never below the seat, no knee / foot edge through dash or pedals.
import * as THREE from 'three';
// @ts-ignore – vendored template, plain JS
import { CAR_K, b2g } from './vendor/j17/cabrio-seat.j17.js';
import { CAB_UNIT } from './cabrio';

const H_LAB = 3.64, D2R = Math.PI / 180, Y = new THREE.Vector3(0, 1, 0), V3 = () => new THREE.Vector3();
const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x)), clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
type Pose = Map<string, { q: THREE.Quaternion; p: THREE.Vector3 }>;

export interface CabSeatOpts { car: THREE.Object3D; model: THREE.Object3D; contract: any; root: THREE.Object3D; fig: THREE.Object3D; mixer: THREE.AnimationMixer; idle: THREE.AnimationClip; drive: THREE.AnimationClip;
  walkerReset(x: number, z: number, heading: number): void; groundOk(x: number, z: number): boolean; wheelMaxDeg?: number;
  /** figure card seat: hips above the seat contact (lab); the socket height follows the card, not FB's contract value */ hipsAboveSeat?: number; legFixW?: number; seatShift?: [number, number, number]; reachCap?: number;
  /** steering column toward the driver (model units, +z = backward): the car adapts to the figure's reach, not the figure */ wheelBack?: number; headUp?: number }

export function createCabSeat(o: CabSeatOpts) {
  const C = o.contract, HP = C.hop, F = HP.marks, fr = (a: number[]) => (a[1] - a[0] + 1) / HP.fps;
  const T_IN = { stand: fr(F.standIn), crouch: fr(F.crouchIn), hop: fr(F.hopIn), land: fr(F.landIn) }, T_OUT = { dip: fr(F.dipOut), hop: fr(F.hopOut), land: fr(F.landOut), stand: fr(F.standOut) };
  // DIP 0 (J17: 0.07 rig): the landing / take-off dip pushed the hips under the cushion — gate »hips never below the seat«
  const HD = C.driverSeat.hipsSocket as number[], PEAK = HP.peakHipsZRig / CAR_K, OUTX = HP.standOutsideX, CROUCH_DROP = 0.14 / CAR_K, DIP = 0, CTRL = 0.15 / CAR_K;
  const model = o.model, fig = o.fig, root = o.root;
  // ---- figure poses (snapshots on this rig, J17 figData)
  const by: Record<string, THREE.Object3D> = {}; fig.traverse((x) => { if ((x as THREE.Bone).isBone) by[x.name] = x; });
  const trackBones = [...new Set(o.drive.tracks.map((t) => t.name.split('.')[0]))].filter((n) => by[n]);
  const snap = (clip: THREE.AnimationClip, t: number): Pose => { const mx = new THREE.AnimationMixer(fig), a = mx.clipAction(clip); a.play(); mx.setTime(t); const out: Pose = new Map(); for (const n of trackBones) out.set(n, { q: by[n].quaternion.clone(), p: by[n].position.clone() }); a.stop(); mx.uncacheRoot(fig); return out; };
  const blend = (A: Pose, B: Pose, t: number): Pose => { const r: Pose = new Map(); for (const [n, a] of A) { const b = B.get(n) || a; r.set(n, { q: a.q.clone().slerp(b.q, t), p: a.p.clone().lerp(b.p, t) }); } return r; };
  const writePose = (P: Pose) => { for (const [n, v] of P) { const b = by[n]; if (!b) continue; b.quaternion.copy(v.q); if (n === 'hips') b.position.copy(v.p); } };
  const livePose = (): Pose => { const r: Pose = new Map(); for (const n of trackBones) r.set(n, { q: by[n].quaternion.clone(), p: by[n].position.clone() }); return r; };
  const STAND = snap(o.idle, 0), SEAT = snap(o.drive, 0), CROUCH = blend(STAND, SEAT, 0.45);
  // seated: pelvis, torso and legs hold the checked seat pose (sweep: feet over the floor, no edge through dash / pedals); the
  // drive clip keeps the head, the arms come from the IK onto the rim
  const HOLD: Pose = new Map([...SEAT].filter(([n]) => /^(root|hips|spine|chest|upperleg|lowerleg|foot|toes)/.test(n)));
  writePose(STAND); const rq = root.quaternion.clone(), rp = root.position.clone(); root.quaternion.identity(); root.position.set(0, 0, 0); root.updateMatrixWorld(true);
  const dropM = by.hips.getWorldPosition(V3()).y - Math.min(by.toesl.getWorldPosition(V3()).y, by.toesr.getWorldPosition(V3()).y);   // lab
  root.quaternion.copy(rq); root.position.copy(rp); root.updateMatrixWorld(true);
  const standZ = C.vehicle.groundZ + dropM / CAB_UNIT + 0.03 / CAR_K;
  // ---- cabrio references (J17 cabRefs)
  const sw = model.getObjectByName('SteeringWheel'), rim = model.getObjectByName('Torus');
  const WB = o.wheelBack ?? 0;   // column shortened: wheel node and contract centre move back together
  if (sw && WB) { const d = model.localToWorld(new THREE.Vector3(0, 0, WB)).sub(model.localToWorld(new THREE.Vector3())); sw.position.add(sw.parent!.worldToLocal(sw.parent!.getWorldPosition(V3()).add(d))); }
  const W = C.steeringWheel, cen = b2g(W.centre).add(new THREE.Vector3(0, 0, WB)), nrm = b2g(W.axis).normalize(), upB = new THREE.Vector3(...W.up), nB = new THREE.Vector3(...W.axis), sideB = nB.clone().cross(upB).normalize();
  if (sideB.x < 0) sideB.negate(); const up = b2g(upB.toArray()).normalize(), side = b2g(sideB.toArray()).normalize();
  const gripM = (s: string) => { const a = (s === 'l' ? -60 : 60) * D2R; return cen.clone().addScaledVector(up, W.radius * Math.cos(a)).addScaledVector(side, W.radius * Math.sin(a)).addScaledVector(nrm, C.hands.gripInsetAlongAxis); };
  const poleM = (s: string) => gripM(s).add(b2g([(s === 'l' ? -1 : 1) * 0.6 / CAR_K, -0.5 / CAR_K, -0.4 / CAR_K]));
  model.updateMatrixWorld(true);
  const sw0q = sw ? sw.quaternion.clone() : null, sw0p = sw ? sw.position.clone() : null; let axisP: THREE.Vector3 | null = null, cenP: THREE.Vector3 | null = null;
  if (sw) { const pw = sw.parent!.getWorldQuaternion(new THREE.Quaternion()), mw = model.getWorldQuaternion(new THREE.Quaternion()), rel = mw.clone().invert().multiply(pw);
    axisP = nrm.clone().applyQuaternion(rel.clone().invert()).normalize(); cenP = sw.parent!.worldToLocal(model.localToWorld(cen.clone())); }
  const gripL: Record<string, THREE.Vector3> = {}; for (const s of ['l', 'r']) gripL[s] = (rim || sw || model).worldToLocal(model.localToWorld(gripM(s)));
  const pole = { l: poleM('l'), r: poleM('r') } as Record<string, THREE.Vector3>, socket = b2g(HD).add(new THREE.Vector3(...(o.seatShift ?? [0, 0, 0]))), yaw0 = model.quaternion.clone();
  const parts: Record<string, THREE.Mesh> = {}; for (const nm of ['CarMesh', 'Dash', 'DoorL', 'DoorR', 'SeatL', 'Interior', 'Brake', 'Clutch', 'Gas', 'InstrCLuster', 'Torus', 'SteeringWheel2']) { const m = model.getObjectByName(nm) as THREE.Mesh; if (m?.isMesh) parts[nm] = m; }
  // ---- placement (J17 placeRoot: the root goes where the hips sit at the target, objmat in hop.py)
  const qM = new THREE.Quaternion(), qY = new THREE.Quaternion(), hw = V3(), tg = V3();
  const placeRoot = (hipsModel: THREE.Vector3, yawDeg: number, upLift = 0) => {
    model.getWorldQuaternion(qM); qY.setFromAxisAngle(Y, yawDeg * D2R); root.quaternion.copy(qM).multiply(qY); root.position.set(0, 0, 0); root.scale.set(1, 1, 1); root.updateMatrixWorld(true);
    by.hips.getWorldPosition(hw); tg.copy(hipsModel); model.localToWorld(tg); if (upLift) tg.addScaledVector(Y.clone().applyQuaternion(qM), upLift);
    root.position.copy(tg).sub(hw); root.updateMatrixWorld(true); return tg.clone(); };
  const rotW = (b: THREE.Object3D, axis: THREE.Vector3, ang: number) => { if (!b || !ang) return; const pq = b.parent!.getWorldQuaternion(new THREE.Quaternion()), wq = pq.clone().multiply(b.quaternion); wq.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang)); b.quaternion.copy(pq.invert().multiply(wq)); };
  const fromTo = (b: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3) => { const pq = b.parent!.getWorldQuaternion(new THREE.Quaternion()), wq = pq.clone().multiply(b.quaternion); wq.premultiply(new THREE.Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize())); b.quaternion.copy(pq.invert().multiply(wq)); b.updateMatrixWorld(true); };
  const LEG = { knee: 0.9, thigh: 0.12 }; let legW = o.legFixW ?? 1;
  const legFix = (w = 1) => { const Fw = V3().set(0, 0, -1).transformDirection(model.matrixWorld); for (const s of ['l', 'r']) { const ul = by['upperleg' + s], ll = by['lowerleg' + s], ft = by['foot' + s]; if (!ul || !ll || !ft) continue;
      const H0 = ul.getWorldPosition(V3()), K0 = ll.getWorldPosition(V3()), d1 = K0.clone().sub(H0); fromTo(ul, d1, d1.clone().normalize().lerp(Fw, LEG.thigh * w));
      const K1 = ll.getWorldPosition(V3()), d2 = ft.getWorldPosition(V3()).sub(K1), hang = Fw.clone().multiplyScalar(0.55).add(V3().set(0, -0.85, 0).transformDirection(model.matrixWorld)).normalize(); fromTo(ll, d2, d2.clone().normalize().lerp(hang, LEG.knee * w)); } };
  const gripW = (s: string) => (rim || sw || model).localToWorld(gripL[s].clone());
  const headUp = o.headUp ?? 0.15;   // 0.3 tipped the hat back in the rear view
  let armLen: Record<string, number> | null = null, reachMax = 0, reachCap = o.reachCap ?? 0.3;   // J17 0.30 rad
  const reachLean = (w = 1) => { if (!armLen) armLen = Object.fromEntries(['l', 'r'].map((s) => [s, by['upperarm' + s].getWorldPosition(V3()).distanceTo(by['lowerarm' + s].getWorldPosition(V3())) + by['lowerarm' + s].getWorldPosition(V3()).distanceTo(by['wrist' + s].getWorldPosition(V3()))]));
    const q = model.getWorldQuaternion(new THREE.Quaternion()), Lw = V3().set(1, 0, 0).applyQuaternion(q).negate(); let tot = 0;
    for (let it = 0; it < 5 && tot < reachCap; it++) { let need = 0; for (const s of ['l', 'r']) need = Math.max(need, by['upperarm' + s].getWorldPosition(V3()).distanceTo(gripW(s)) - armLen![s] * 0.985); if (need <= 0.001) break;
      const lever = Math.max(0.1, by.spine.getWorldPosition(V3()).distanceTo(by.upperarml.getWorldPosition(V3()))), d = Math.min(reachCap - tot, (need / lever) * w * 1.1); rotW(by.spine, Lw, d * 0.5); rotW(by.chest, Lw, d * 0.5); root.updateMatrixWorld(true); tot += d; }
    reachMax = Math.max(reachMax, tot); return tot; };
  const ik = (w: number) => { const out: Record<string, number> = {}; for (const s of ['l', 'r']) { const ua = by['upperarm' + s], la = by['lowerarm' + s], wr = by['wrist' + s]; if (!ua || !la || !wr) continue;
      const T = gripW(s); if (w > 0) { const q0u = ua.quaternion.clone(), q0l = la.quaternion.clone(), A = ua.getWorldPosition(V3()), B = la.getWorldPosition(V3()), Cw = wr.getWorldPosition(V3());
        const a = B.distanceTo(A), b = Cw.distanceTo(B), dv = T.clone().sub(A), d = clamp(dv.length(), 1e-4, (a + b) * 0.9999), dir = dv.normalize();
        const P = model.localToWorld(pole[s].clone()).sub(A), perp = P.addScaledVector(dir, -P.dot(dir)); if (perp.lengthSq() < 1e-10) perp.set(0, -1, 0); perp.normalize();
        const ca = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), E = A.clone().addScaledVector(dir, ca * a).addScaledVector(perp, Math.sqrt(1 - ca * ca) * a);
        fromTo(ua, B.clone().sub(A), E.clone().sub(A)); const B2 = la.getWorldPosition(V3()), C2 = wr.getWorldPosition(V3()); fromTo(la, C2.sub(B2), T.clone().sub(B2));
        if (w < 1) { ua.quaternion.copy(q0u.slerp(ua.quaternion.clone(), w)); la.quaternion.copy(q0l.slerp(la.quaternion.clone(), w)); ua.updateMatrixWorld(true); } }
      out[s] = wr.getWorldPosition(V3()).distanceTo(T);
      const hd = by['hand' + s], hs = by['handslot' + s]; if (w > 0 && hd && hs) { const cw = model.localToWorld(cen.clone()), nW = nrm.clone().transformDirection(model.matrixWorld), inw = cw.sub(T); inw.addScaledVector(nW, -inw.dot(nW) - 0.2 * inw.length()); const W0 = wr.getWorldPosition(V3()), dirH = hs.getWorldPosition(V3()).sub(W0);
        const q0w = wr.quaternion.clone(); fromTo(wr, dirH, dirH.clone().normalize().lerp(inw.normalize(), 0.85)); if (w < 1) { wr.quaternion.copy(q0w.slerp(wr.quaternion.clone(), w)); wr.updateMatrixWorld(true); } } }
    return out; };
  // ---- hop timeline (J17 hopAt, values in cabrio units / Blender axes)
  const bez = (P0: number[], P1: number[], P2: number[], t: number) => { const q = 1 - t; return [0, 1, 2].map((i) => q * q * P0[i] + 2 * q * t * P1[i] + t * t * P2[i]); };
  const hopAt = (h: any, t: number): any => { const SZ = h.standZ, OX = h.ox, Y0 = h.y0, SP = [OX, HD[1], SZ], CT = CTRL * Math.sign(OUTX * OX);   // control point bends outward on either side
    if (h.kind === 'enter') { let u = t;
      if (u < h.A) { const k = ss(u / h.A); return { A: STAND, B: STAND, bt: 0, hips: b2g(SP).lerp(h.startM, 1 - k), hipsIsModel: true, yaw: h.yaw0 + (Y0 - h.yaw0) * k, ik: 0, ph: 'approach' }; } u -= h.A;
      if (u < T_IN.stand) return { A: STAND, B: STAND, bt: 0, hipsB: SP, yaw: Y0, ik: 0, ph: 'standIn' }; u -= T_IN.stand;
      if (u < T_IN.crouch) { const k = ss(u / T_IN.crouch); return { A: STAND, B: CROUCH, bt: k, hipsB: [OX, HD[1], SZ - CROUCH_DROP * k], yaw: Y0, ik: 0, ph: 'crouchIn' }; } u -= T_IN.crouch;
      if (u < T_IN.hop) { const k = u / T_IN.hop, P0 = [OX, HD[1], SZ - CROUCH_DROP], P2 = h.hd, P1 = [(P0[0] + P2[0]) / 2 - CT, HD[1], PEAK * 2 - (P0[2] + P2[2]) / 2];
        return { A: CROUCH, B: SEAT, bt: ss(Math.min(1, k * 2.5)), hipsB: bez(P0, P1, P2, k), yaw: Y0 + (180 - Y0) * ss(k), ik: 0, ph: 'hopIn' }; } u -= T_IN.hop;
      const k = Math.min(1, u / T_IN.land); return { A: SEAT, B: SEAT, bt: 0, hipsB: [h.hd[0], h.hd[1], h.hd[2] - DIP * Math.sin(Math.PI * k)], yaw: 180, ik: ss(k), ph: 'landIn' }; }
    let u = t;
    if (u < T_OUT.dip) { const k = ss(u / T_OUT.dip); return { A: h.live, B: h.live, bt: 0, hipsB: [h.hd[0], h.hd[1], h.hd[2] - DIP * k], yaw: 180, ik: 1 - k, ph: 'dipOut' }; } u -= T_OUT.dip;
    if (u < T_OUT.hop) { const k = u / T_OUT.hop, P0 = [h.hd[0], h.hd[1], h.hd[2] - DIP], P2 = [OX, HD[1], SZ - CROUCH_DROP], P1 = [(P0[0] + P2[0]) / 2 - CT, HD[1], PEAK * 2 - (P0[2] + P2[2]) / 2];
      return { A: h.live, B: CROUCH, bt: ss(Math.max(0, (k - 0.5) * 2)), hipsB: bez(P0, P1, P2, k), yaw: 180 + (Y0 === 90 ? 90 : -90) * ss(k), ik: 0, ph: 'hopOut' }; } u -= T_OUT.hop;
    if (u < T_OUT.land) { const k = ss(u / T_OUT.land); return { A: CROUCH, B: STAND, bt: k, hipsB: [OX, HD[1], SZ - CROUCH_DROP * (1 - k)], yaw: Y0 === 90 ? 270 : 90, ik: 0, ph: 'landOut' }; }
    return { A: STAND, B: STAND, bt: 0, hipsB: SP, yaw: Y0 === 90 ? 270 : 90, ik: 0, ph: 'standOut' }; };
  // ---- kinematics for lean / bounce / body roll / wheel (J17 update, car node in lab)
  const K: any = { p: null, v: V3(), a: V3(), lean: 0, bx: 0, bv: 0, roll: 0, hd: null, om: 0 }, BOUNCE = { gain: 0.25, max: 0.03 * (H_LAB / 1.85) }, WHEELBASE = 1.392 * CAB_UNIT;
  const M = { legLog: [] as number[][], feetBy: {} as Record<string, number>, gripRest: 0, gripTurn: 0, grip: 0, gripN: 0, hipsErr: 0, seatGap: 0, seatGapN: 0, feetBelowFloor: 0, feetDepth: 0, hipsBelowSeat: -1, legHits: 0, legChecks: 0, wheelDeg: [0, 0], phases: [] as string[], frames: 0 };
  let wheelMax = (o.wheelMaxDeg ?? W.maxDeg) * D2R;
  const setWheel = (wheel: number) => { if (sw && axisP && sw0q && sw0p && cenP) { const qa = new THREE.Quaternion().setFromAxisAngle(axisP, wheel); sw.quaternion.copy(qa).multiply(sw0q); sw.position.copy(cenP).add(sw0p.clone().sub(cenP).applyQuaternion(qa)); sw.updateMatrixWorld(true); } };
  const kin = (dt: number, steerAngle: number) => {
    o.car.updateMatrixWorld(true);   // the drive step moved the car this frame: gates and placement on the fresh pose (stale = false hits)
    const P = o.car.position; if (!K.p) K.p = P.clone(); const v = P.clone().sub(K.p).divideScalar(Math.max(1e-4, dt)); K.p.copy(P);
    if (v.length() > 200) { K.v.copy(v); K.a.set(0, 0, 0); } else { const a = v.clone().sub(K.v).divideScalar(Math.max(1e-4, dt)); K.v.lerp(v, 0.35); K.a.lerp(a, 0.2); }
    const q = o.car.quaternion, Fw = V3().set(0, 0, 1).applyQuaternion(q), Uw = V3().set(0, 1, 0).applyQuaternion(q), Rw = Fw.clone().cross(Uw), sc = 1.85 / H_LAB;   // accelerations in figure metres (J17 constants)
    const aR = K.a.dot(Rw) * sc, aU = K.a.dot(Uw) * sc + 9.81 * (Uw.y - 1);
    K.lean += (clamp(-0.02 * aR, -0.06, 0.06) - K.lean) * Math.min(1, dt * 10);   // J17 ±0.35: the shoulders left the reach of the rim
    K.bv += (-60 * K.bx - 7 * K.bv - BOUNCE.gain * aU * (H_LAB / 1.85)) * dt; K.bx = clamp(K.bx + K.bv * dt, 0, BOUNCE.max);   // upward only: a downward bounce put hips and feet through cushion, floor and pedals
    K.roll += (clamp(-0.012 * aR, -0.06, 0.06) - K.roll) * Math.min(1, dt * 8);
    model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), K.roll).multiply(yaw0);
    const hd = Math.atan2(Fw.x, Fw.z); let om = 0; if (K.hd != null) { let dh = hd - K.hd; dh = Math.atan2(Math.sin(dh), Math.cos(dh)); om = dh / Math.max(1e-4, dt); } K.hd = hd; K.om += (om - K.om) * Math.min(1, dt * 6);
    const sp = Math.max(1, v.length()), stK = Math.abs(steerAngle) > 1e-3 ? steerAngle : Math.atan((WHEELBASE * K.om) / sp);
    const wheel = clamp(-stK * W.ratio, -wheelMax, wheelMax); setWheel(wheel);
    model.updateMatrixWorld(true); K.fw = Fw; K.wheel = wheel; M.wheelDeg[0] = Math.min(M.wheelDeg[0], wheel / D2R); M.wheelDeg[1] = Math.max(M.wheelDeg[1], wheel / D2R); };
  // ---- gates in the model frame (cabrio units): cabin floor and seat cushion measured once by rays onto the car's own parts;
  // per frame the lowest skinned foot / toe vertex and the lowest pelvis / thigh vertex are compared against them
  const rc = new THREE.Raycaster(), floorMeshes = [parts.Interior, parts.CarMesh].filter(Boolean), seatMeshes = [parts.SeatL].filter(Boolean);
  const topAt = (lx: number, lz: number, meshes: THREE.Mesh[], fromY = 1.6) => { const o = model.localToWorld(new THREE.Vector3(lx, fromY, lz)), d = model.localToWorld(new THREE.Vector3(lx, fromY - 1, lz)).sub(o).normalize(); rc.set(o, d); rc.far = 50; const h = rc.intersectObjects(meshes, false)[0]; return h ? model.worldToLocal(h.point.clone()).y : null; };
  const footZ = socket.z - 0.3;   // footwell at the pedals: forward of the seat (model −z = car forward; Interior front edge −0.49)
  const floorY = topAt(socket.x, footZ, floorMeshes, 0.3) ?? C.vehicle.groundZ, seatY = topAt(socket.x, socket.z, seatMeshes) ?? socket.y;
  if (o.hipsAboveSeat != null) socket.y = seatY + o.hipsAboveSeat / CAB_UNIT;   // hips on the cushion by the card (Steuerung: seat point from the figure card)
  const groups: Record<string, { m: THREE.SkinnedMesh; i: number[] }[]> = { foot: [], pelvis: [] };
  fig.traverse((x) => { const m = x as THREE.SkinnedMesh; if (!m.isSkinnedMesh) return; const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight, n = m.geometry.attributes.position.count, f: number[] = [], pl: number[] = [];
    for (let i = 0; i < n; i++) { let bi = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } } const bn = m.skeleton.bones[bi]?.name ?? ''; if (/^foot|^toes/.test(bn)) f.push(i); else if (/^hips$|^upperleg/.test(bn)) pl.push(i); }
    groups.foot.push({ m, i: f }); groups.pelvis.push({ m, i: pl }); });
  const lowest = (g: string, foot: boolean) => { let y = Infinity; const v = V3(); for (const { m, i } of groups[g]) for (const k of i) { m.getVertexPosition(k, v); v.applyMatrix4(m.matrixWorld); model.worldToLocal(v);
      const inFoot = Math.abs(v.x) < 0.95 && v.z > -0.45 && v.z < 0.9, inSeat = Math.abs(v.x - socket.x) < 0.32 && Math.abs(v.z - socket.z) < 0.35;
      if (foot ? inFoot : inSeat) y = Math.min(y, v.y); } return y; };
  const U2H = CAB_UNIT / H_LAB;   // cabrio unit → H
  const gate = (ph: string) => { M.frames++;
    const fy = lowest('foot', true); if (fy < Infinity && fy < floorY - 0.004) { M.feetBelowFloor++; M.feetDepth = Math.max(M.feetDepth, (floorY - fy) * U2H); M.feetBy[ph] = Math.max(M.feetBy[ph] ?? 0, +((floorY - fy) * U2H).toFixed(4)); }
    if (/seated|landIn|dipOut|hopIn|hopOut/.test(ph)) { const py = lowest('pelvis', false); if (py < Infinity) { M.hipsBelowSeat = Math.max(M.hipsBelowSeat, (seatY - py) * U2H); if (ph === 'seated') { M.seatGap = Math.max(M.seatGap, Math.abs(py - seatY) * U2H); M.seatGapN++; } } } };
  // leg edges vs dash / pedals (J17 collide, Möller–Trumbore on segments) — every 6th seated frame
  const e1 = V3(), e2 = V3(), pv = V3(), tv = V3(), qv = V3();
  const segTri = (O: THREE.Vector3, d: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => { e1.subVectors(b, a); e2.subVectors(c, a); pv.crossVectors(d, e2); const det = e1.dot(pv); if (Math.abs(det) < 1e-12) return false; const inv = 1 / det; tv.subVectors(O, a); const u = tv.dot(pv) * inv; if (u < 0 || u > 1) return false; qv.crossVectors(tv, e1); const v = d.dot(qv) * inv; if (v < 0 || u + v > 1) return false; const t = e2.dot(qv) * inv; return t >= 0 && t <= 1; };
  const legCollide = () => { const edges: [THREE.Vector3, THREE.Vector3][] = [], bb = new THREE.Box3(), v = V3();
    fig.traverse((x) => { const m = x as THREE.SkinnedMesh; if (!m.isSkinnedMesh) return; const g = m.geometry, idx = g.index, n = idx ? idx.count / 3 : g.attributes.position.count / 3, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, step = Math.max(1, Math.floor(n / 1500)), cache = new Map<number, THREE.Vector3>();
      const P = (i: number) => { let p = cache.get(i); if (!p) { p = m.getVertexPosition(i, V3()).applyMatrix4(m.matrixWorld); cache.set(i, p); } return p; };
      const leg = (i: number) => { let bi = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } } return /lowerleg|foot|toes/.test(m.skeleton.bones[bi]?.name ?? ''); };
      for (let t = 0; t < n; t += step) { const ia = idx ? idx.getX(t * 3) : t * 3, ib = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, ic = idx ? idx.getX(t * 3 + 2) : t * 3 + 2; if (!leg(ia)) continue; const a = P(ia), b = P(ib), c = P(ic); bb.expandByPoint(a).expandByPoint(b).expandByPoint(c); edges.push([a, b], [b, c], [c, a]); } });
    let hits = 0;
    for (const nm of ['Dash', 'Brake', 'Clutch', 'Gas', 'InstrCLuster', 'Torus', 'SteeringWheel2']) { const mesh = parts[nm]; if (!mesh) continue; const g = mesh.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count / 3 : pos.count / 3, tris: THREE.Vector3[][] = [];
      for (let t = 0; t < n; t++) { const ia = idx ? idx.getX(t * 3) : t * 3, ib = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, ic = idx ? idx.getX(t * 3 + 2) : t * 3 + 2; const a = V3().fromBufferAttribute(pos, ia).applyMatrix4(mesh.matrixWorld), b = V3().fromBufferAttribute(pos, ib).applyMatrix4(mesh.matrixWorld), c = V3().fromBufferAttribute(pos, ic).applyMatrix4(mesh.matrixWorld); if (bb.containsPoint(a) || bb.containsPoint(b) || bb.containsPoint(c)) tris.push([a, b, c]); }
      for (const [p, q] of edges) { v.subVectors(q, p); for (const [a, b, c] of tris) if (segTri(p, v, a, b, c)) { hits++; break; } } }
    M.legChecks++; M.legHits = Math.max(M.legHits, hits); return hits; };
  // ---- the hop for the travel core (host.hop), J17 hop.step
  const hop = {
    wants: () => true,
    step(c: any, dt: number, _Pz: any, S: any) { S.pose = null; c.t += dt;
      if (!c.h) { const hd = [socket.x, -socket.z, socket.y];   // seat socket back in the contract's Blender axes (x, y forward, z up)
        const sideOk = (ox: number) => { const L = model.localToWorld(b2g([ox, HD[1], C.vehicle.groundZ])); return o.groundOk(L.x, L.z); };
        const h = c.h = { kind: c.kind, standZ, A: 0, T: 0, startM: null as any, yaw0: 90, live: null as any, ox: OUTX, y0: 90, hd };
        if (c.kind === 'enter') { const hp = by.hips.getWorldPosition(V3()); h.startM = model.worldToLocal(hp.clone());
          // hop over the door on the figure's own side (J17 always used the driver door: from the far side the straight approach
          // ran through the car — Kritiker f_7_2); mirrored: stand point, yaw 270 instead of 90
          if (Math.sign(h.startM.x) !== Math.sign(OUTX) && sideOk(-OUTX)) { h.ox = -OUTX; h.y0 = 270; } const f = V3().set(0, 0, 1).applyQuaternion(root.quaternion).applyQuaternion(model.getWorldQuaternion(new THREE.Quaternion()).invert());
          h.yaw0 = Math.atan2(f.x, f.z) / D2R; while (h.yaw0 - h.y0 > 180) h.yaw0 -= 360; while (h.yaw0 - h.y0 < -180) h.yaw0 += 360;
          const dm = (h.startM.distanceTo(b2g([h.ox, HD[1], h.standZ])) * CAB_UNIT) * (1.85 / H_LAB); h.A = dm < 0.25 ? 0 : Math.min(1.4, dm / 3.5); h.T = h.A + T_IN.stand + T_IN.crouch + T_IN.hop + T_IN.land; }
        else { h.live = livePose(); h.T = T_OUT.dip + T_OUT.hop + T_OUT.land + T_OUT.stand; if (!sideOk(OUTX) && sideOk(-OUTX)) { h.ox = -OUTX; h.y0 = 270; } } }
      if (c.t >= c.h.T && c.kind === 'exit') { const L = model.localToWorld(b2g([c.h.ox, HD[1], C.vehicle.groundZ])), f = V3().set(0, 0, 1).applyQuaternion(model.getWorldQuaternion(qM).multiply(qY.setFromAxisAngle(Y, (c.h.y0 === 90 ? 270 : 90) * D2R)));
        if (o.groundOk(L.x, L.z)) o.walkerReset(L.x, L.z, Math.atan2(f.x, f.z)); }
      return c.t >= c.h.T; } };
  let driveAct: THREE.AnimationAction | null = null, phase = 'off';
  const stopOthers = () => { for (const a of (o.mixer as any)._actions as THREE.AnimationAction[]) if (a !== driveAct) a.stop(); };
  /** late step (after the travel core): hop poses, or seated (drive clip + placeRoot + legs + reach + IK) */
  const update = (dt: number, S: any, steerAngle: number) => {
    kin(dt, steerAngle);
    if (S.cut && S.cut.hop && S.cut.h) {
      const h = S.cut.h, p = hopAt(h, S.cut.t); phase = 'hop.' + p.ph;
      if (h.kind === 'exit' && driveAct?.isRunning()) driveAct.stop();
      writePose(p.bt ? blend(p.A, p.B, p.bt) : p.A);
      placeRoot(p.hipsIsModel ? p.hips : b2g(p.hipsB), p.yaw);
      const lw = (/landIn|dipOut/.test(p.ph) ? 1 : p.ph === 'hopIn' ? p.bt : p.ph === 'hopOut' ? 1 - p.bt : 0) * legW; if (lw > 0) legFix(lw);   // × the seat's leg weight (sweep: 0)
      if (p.ik > 0) { reachLean(p.ik); ik(p.ik); }
      root.visible = true; gate(p.ph); M.phases.includes(p.ph) || M.phases.push(p.ph); return;
    }
    if (S.mode === 'AUTO' && !S.cut) {
      phase = 'seated';
      if (!driveAct || !driveAct.isRunning()) { driveAct = o.mixer.clipAction(o.drive); stopOthers(); driveAct.reset().setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).play(); o.mixer.update(0); }   // the last hop frame is the drive clip at t 0: no blend, no bind pose
      writePose(HOLD); const tgt = placeRoot(socket, 180, K.bx);
      const Fw = K.fw; rotW(by.spine, Fw, 0.5 * K.lean); rotW(by.chest, Fw, 0.5 * K.lean); rotW(by.head, Fw, -0.3 * K.lean);
      // eyes on the road: the drive clip looks down at the wheel (in J17 the reach lean lifted it; here the column comes to the
      // hands and the torso stays upright) — pitch the head up about the car's lateral axis
      rotW(by.head, Fw.clone().cross(V3().set(0, 1, 0).applyQuaternion(o.car.quaternion)), headUp); root.updateMatrixWorld(true);
      legFix(legW); reachLean(1); const g = ik(1);
      const hp = by.hips.getWorldPosition(V3()); M.hipsErr = Math.max(M.hipsErr, hp.distanceTo(tgt));
      M.grip = Math.max(M.grip, g.l ?? 0, g.r ?? 0); M.gripN++; if (Math.abs(K.wheel ?? 0) < 5 * D2R) M.gripRest = Math.max(M.gripRest, g.l ?? 0, g.r ?? 0); else M.gripTurn = Math.max(M.gripTurn, g.l ?? 0, g.r ?? 0);
      root.visible = true; gate('seated'); if (M.gripN % 6 === 0) { const hh = legCollide(); if (M.legLog.length < 40) M.legLog.push([hh, +((K.wheel ?? 0) / D2R).toFixed(1), +K.lean.toFixed(3), +K.bx.toFixed(3), +K.roll.toFixed(3)]); }
      return;
    }
    if (driveAct?.isRunning()) driveAct.stop(); phase = 'off';
  };
  const H = (x: number) => +(x / H_LAB).toFixed(4);
  /** static check in the seated pose (drive clip t 0): leg weight, seat shift (model units), wheel sweep → gates per setting */
  const evalStatic = (cfg: { legW: number; shift: [number, number, number]; angles: number[]; reachCap?: number }) => {
    const s0 = socket.clone(), lw0 = legW, rc0 = reachCap; reachCap = cfg.reachCap ?? reachCap; socket.add(new THREE.Vector3(...cfg.shift)); legW = cfg.legW; model.updateMatrixWorld(true);
    setWheel(0); writePose(SEAT); placeRoot(socket, 180); legFix(legW); const base = livePose();
    const fy = lowest('foot', true), py = lowest('pelvis', false), hits = legCollide(), grips: number[][] = [];
    for (const a of cfg.angles) { setWheel(a * D2R); writePose(base); placeRoot(socket, 180); const lean = reachLean(1), g = ik(1); grips.push([a, +(Math.max(g.l ?? 0, g.r ?? 0) / H_LAB).toFixed(4), +lean.toFixed(3)]); }
    setWheel(0); socket.copy(s0); legW = lw0; reachCap = rc0;
    return { legW: cfg.legW, shift: cfg.shift, feetAboveFloorH: +((fy - floorY) * U2H).toFixed(4), pelvisAboveSeatH: +((py - seatY) * U2H).toFixed(4), legHits: hits, grips };
  };
  const setWheelMax = (deg: number) => { wheelMax = deg * D2R; };
  const setLegW = (w: number) => { legW = w; };
  const shiftSocket = (d: [number, number, number]) => { socket.add(new THREE.Vector3(...d)); };
  const metrics = () => ({ phase, gripMaxH: H(M.grip), gripRestH: H(M.gripRest), gripTurnH: H(M.gripTurn), feetByPhaseH: M.feetBy, gripFrames: M.gripN, hipsErrMaxH: H(M.hipsErr), floorY: +floorY.toFixed(3), seatY: +seatY.toFixed(3), seatGapMaxH: +M.seatGap.toFixed(4), feetBelowFloorFrames: M.feetBelowFloor, feetDepthMaxH: +M.feetDepth.toFixed(4), hipsBelowSeatMaxH: +M.hipsBelowSeat.toFixed(4), legHitsMax: M.legHits, legLog: M.legLog, legChecks: M.legChecks, reachLeanMaxRad: +reachMax.toFixed(3), wheelDeg: M.wheelDeg.map((v) => +v.toFixed(1)), phases: M.phases, frames: M.frames });
  return { hop, update, metrics, evalStatic, setWheelMax, setLegW, shiftSocket, get phase() { return phase; }, standZ, dropM };
}
