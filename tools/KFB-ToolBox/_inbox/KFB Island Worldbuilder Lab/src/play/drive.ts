// Stufe 2 · Fahren (Steuerung 10.10., Go 1): Vorlage zuerst (QA-Protokoll §1a). The physics is Joyride's kfb-drive.k2b.js,
// taken over unchanged (src/play/vendor, md5 in SOURCE.md): pure math in a track frame (s, lateral, relative yaw), FLOW /
// FEEL / ASSIST as in the donor. This file is the Lab adapter only:
//  · road-bed → frame stream (kfb.road-bed/1 stations → evenly sampled T4-like samples: p, T, U, R, lane edges slots[6]/[7],
//    prm.surface), in track metres: lab ÷ RACE_W (Steuerung: the Joyride world runs in track-core metres × 1.46 → lab);
//  · surface 0 where the island does not carry the road (before a bridge head: the abutment crown, no deck yet);
//  · leaving the road: k2b's own soft barrier (softStart / Knetgummi-Prall) keeps the car in the lane band; at an open road
//    end the car stops softly (no wrap to the start). Free driving on terrain is not part of MVP-1.
//  · pose back to lab units, car = Lab Retro car (Cicada, 6 lab long).
import * as THREE from 'three';
// @ts-ignore – vendored template, plain JS
import { makeFrame, createDriver, stepDriver, pose, FLOW } from './vendor/kfb-drive.k2b.js';
import J06 from './vendor/joyride.j06.json';
import { loadCar, loadModel } from '../island/island';
import { bedFromS, type RoadBedSpec } from '../island/roadbed';
import { RACE_W } from './camera';
import { placeRoadEndClosures } from './road-ends';
import { loadCabrio } from './cabrio';
import type { App } from '../main';

export interface DriveKeys { gas?: boolean; brake?: boolean; left?: boolean; right?: boolean; driftL?: boolean; driftR?: boolean; boost?: boolean; jump?: boolean }

/** frame stream from one road of a road bed: samples every `ds` track metres along the centre line (island-local + pos) */
export function streamFromRoadBed(spec: RoadBedSpec, roadIdx: number, pos: number[], ds = 1, onLand: (x: number, z: number) => boolean = () => true, edgeKey = 0) {
  const road = spec.roads[roadIdx], s0 = bedFromS(spec, roadIdx), W = (v: number[]) => new THREE.Vector3(v[0] + pos[0], v[1] + pos[1], v[2] + pos[2]).divideScalar(RACE_W);
  const C = road.sections.map((S) => ({ s: S.s, c: W(S.L[0]).add(W(S.R[0])).multiplyScalar(0.5), l: W(S.L[0]), r: W(S.R[0]), land: S.s >= s0 && onLand((S.L[0][0] + S.R[0][0]) / 2 + pos[0], (S.L[0][2] + S.R[0][2]) / 2 + pos[2]), le: W(S.L[Math.min(edgeKey, S.L.length - 1)]), re: W(S.R[Math.min(edgeKey, S.R.length - 1)]) }));
  const acc = [0]; for (let i = 1; i < C.length; i++) acc.push(acc[i - 1] + C[i].c.distanceTo(C[i - 1].c));
  const L = acc[acc.length - 1], n = Math.max(2, Math.floor(L / ds) + 1), out: any[] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const s = Math.min(L, k * ds); while (j < C.length - 2 && acc[j + 1] < s) j++;
    const t = (s - acc[j]) / Math.max(1e-6, acc[j + 1] - acc[j]), A = C[j], B = C[j + 1];
    const p = A.c.clone().lerp(B.c, t), T = B.c.clone().sub(A.c).normalize(), U = new THREE.Vector3(0, 1, 0), R = new THREE.Vector3().crossVectors(T, U).normalize();
    U.crossVectors(R, T).normalize();
    const le = A.le.clone().lerp(B.le, t), re = A.re.clone().lerp(B.re, t), l6 = le.sub(p).dot(R), l7 = re.sub(p).dot(R);
    out.push({ s, p: p.toArray(), T: T.toArray(), U: U.toArray(), R: R.toArray(), slots: { 6: [Math.min(l6, l7)], 7: [Math.max(l6, l7)] }, prm: { surface: (t < 0.5 ? A.land : B.land) ? 1 : 0 }, tags: [] });
  }
  return { S: out, ds, L };
}

/** V-126 KayKit City car: the clay model (loadModel), cloned. V-153: ONE kit factor for all KayKit cars = the sedan's factor to
 *  joyride.j06.json vehicles.len track metres (lab = × RACE_W), so the cars keep their proportions (hatchback 5.40 × 2.80, not stretched) */
let kayKitK: Promise<number> | null = null;
const kayKitFactor = () => (kayKitK ??= loadModel('city/car_sedan.gltf').then((s) => { const z = new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3()); return ((J06 as any).vehicles.len * RACE_W) / Math.max(z.x, z.z); }));
async function loadKayKitCar(asset: string) {
  const src = await loadModel('city/' + asset.replace(/^city\//, '')), m = src.clone(true);
  m.scale.setScalar(await kayKitFactor()); m.traverse((o) => { const x = o as THREE.Mesh; if (x.isMesh) { x.castShadow = x.receiveShadow = true; } }); return m;
}

/** the player car (Retro FBX / cabrio), turned to +Z forward, added to the scene; k2b half width (track m) from its body box + margin */
export async function loadDriveCar(scene: THREE.Scene, carAsset = 'cars/Cicada/CICADA_LOW.fbx', margin = 0, useBody = true) {
  const car = new THREE.Group(); car.name = 'player-car';
  // the Retro FBX cars have no fixed forward axis: the front wheels (or front lamps) against the rear wheels mark it; turn
  // the model so the front looks along +Z, the frame's forward in makeBasis below
  // V-126: KayKit City cars ('kaykit:city/car_sedan.gltf'), closed; V-153 one kit factor (sedan = joyride.j06.json vehicles.len 4.3 m)
  const model = carAsset === 'cabrio' ? await loadCabrio() : carAsset.startsWith('kaykit:') ? await loadKayKitCar(carAsset.slice(7)) : await loadCar(carAsset), front = new THREE.Vector3(), cnt = { f: 0, b: 0 }, back = new THREE.Vector3(), bb = new THREE.Box3();
  model.updateMatrixWorld(true);
  model.traverse((o) => {
    const m = o as THREE.Mesh, n = m.name.toLowerCase(); if (!m.isMesh) return;
    const c = bb.setFromObject(m).getCenter(new THREE.Vector3());
    if (/front_wheel|front_lamp|^wheelf|wheel_front/.test(n)) { front.add(c); cnt.f++; }   // Retro FBX: front_wheel…; KFB cabrio: WheelFL/FR; KayKit: …_wheel_front_left
    if (/rear_wheel|rear_lamp|back_lamp|^wheelr|wheel_rear/.test(n)) { back.add(c); cnt.b++; }
  });
  const dir = cnt.f && cnt.b ? front.divideScalar(cnt.f).sub(back.divideScalar(cnt.b)) : new THREE.Vector3(0, 0, 1);
  const turn = new THREE.Group(); turn.rotation.y = -Math.atan2(dir.x, dir.z); turn.add(model); car.add(turn); scene.add(car);
  car.userData.frontYaw = +turn.rotation.y.toFixed(3);
  // physics body follows the car (Steuerung: the collision hull moves with the cabrio; feel values unchanged): k2b halfWidth in track m
  car.updateMatrixWorld(true); const cbox = new THREE.Box3();   // body without mirrors (they may stand out over the kerb)
  car.traverse((o) => { const m = o as THREE.Mesh; let v = true; for (let x: THREE.Object3D | null = m; x; x = x.parent) v &&= x.visible; if (m.isMesh && v && !/mirror/i.test(m.name)) cbox.union(new THREE.Box3().setFromObject(m)); });
  const halfWidth = useBody ? ((cbox.max.x - cbox.min.x) / 2 + margin) / RACE_W : undefined;
  car.userData.size = { length: +(cbox.max.z - cbox.min.z).toFixed(3), width: +(cbox.max.x - cbox.min.x).toFixed(3), height: +(cbox.max.y - cbox.min.y).toFixed(3), halfWidthTrack: halfWidth ?? null };
  return { car, halfWidth };
}

/** C1 (V-103): J17 rail chase camera, FAHREN only — joyride-drive.j10.js:318–329 1:1 (no free-look / FO branch), values
 *  joyride.j06.json drive.camera (vendored); the wish point rides the track frame `boom` metres behind the car, clamped sideways
 *  into the corridor, camera up follows the road up, FOV rises with speed / boost. Track metres × RACE_W → lab. */
export function makeRailChase(F: any, d: any, car: THREE.Object3D, qNow: () => any, pNow: () => any, Fv: THREE.Vector3, Uv: THREE.Vector3) {
  const CAM = (J06 as any).drive.camera, cp = new THREE.Vector3(), cu = new THREE.Vector3(0, 1, 0), want = new THREE.Vector3(), lk = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  let cInit = false;
  const chase = (dt: number, cam: THREE.PerspectiveCamera) => {
    const P = pNow(), q = qNow(); if (!P) return false;
    const W = RACE_W, sp = Math.abs(d.speed) / FLOW.maxForward, boom = CAM.boom + sp * CAM.boomSpeed, cl = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
    if (d.fly) {
      const fh = new THREE.Vector3(Fv.x, 0, Fv.z).normalize();
      want.copy(car.position).addScaledVector(fh, -boom * W).add(lk.set(0, (CAM.height + 1.2) * W, 0));
      cp.lerp(want, 1 - Math.exp(-dt * CAM.follow)); cu.lerp(Y, 1 - Math.exp(-dt * 4)).normalize();
      cam.up.copy(cu); cam.position.copy(cp); cam.lookAt(car.position.x + fh.x * 10 * W, car.position.y, car.position.z + fh.z * 10 * W);
    } else {
      const qc: any = F.at(d.s - boom), latC = cl(q.c + d.lat * CAM.latFollow, qc.c - qc.half - CAM.side, qc.c + qc.half + CAM.side), hC = CAM.height + sp * 0.9;
      want.set(qc.p[0] + qc.R[0] * latC + qc.U[0] * hC, qc.p[1] + qc.R[1] * latC + qc.U[1] * hC, qc.p[2] + qc.R[2] * latC + qc.U[2] * hC).multiplyScalar(W);
      if (!cInit || cp.distanceTo(want) > 55 * W) { cp.copy(want); cu.fromArray(qc.U); cInit = true; } else cp.lerp(want, 1 - Math.exp(-dt * CAM.follow));
      cu.lerp(Uv, 1 - Math.exp(-dt * 4)).normalize(); cam.up.copy(cu); cam.position.copy(cp);
      lk.copy(car.position).addScaledVector(Fv, 11 * W).addScaledVector(Uv, 1.2 * W); cam.lookAt(lk);
    }
    const fov = CAM.fov + sp * 14 + (d.boosting ? 7 : 0); if (Math.abs(cam.fov - fov) > 0.05) { cam.fov += (fov - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix(); }
    return true;
  };
  return { chase, reset() { cInit = false; } };
}

export async function createDrivePlay(app: App, scene: THREE.Scene, islandId: string, roadIdx = 1, carAsset = 'cars/Cicada/CICADA_LOW.fbx') {
  const isl = app.islands.get(islandId)!, spec = (isl as any).roadSpec as RoadBedSpec, P0 = isl.spec.pos;
  // island-carried = after the bridge head (bedFromS) and the centre inside the outline: both ends of a road can be bridge heads
  // lane band (Steuerung 10.10., Georg drives himself): the band edge is the kerb face (section key 2, `kerb in`), and the
  // car's own half width + a 0.15 lab margin go into k2b's halfWidth below, so the soft band holds the BODY before the kerb
  // (the centre limit = kerb face − half car width − margin); k2b itself unchanged. ?kerbFit=0 = before (key 0, proxy width)
  const kerbFit = new URLSearchParams(location.search).get('kerbFit') !== '0', KERB_MARGIN = 0.15;
  const fld: any = isl.field, { S, ds } = streamFromRoadBed(spec, roadIdx, P0, 1, (x, z) => fld.sd(x - P0[0], z - P0[2]) > 1.5, kerbFit ? 2 : 0);
  const F = makeFrame(S, ds, false);
  const { car, halfWidth } = await loadDriveCar(scene, carAsset, kerbFit ? KERB_MARGIN : 0, carAsset === 'cabrio' || kerbFit);
  // drivable stretch = the first island-carried run; the car holds 3 m inside both of its ends (soft stop, no open edge)
  const i0 = Math.max(0, S.findIndex((x: any) => x.prm.surface === 1)); let i1 = i0; while (i1 + 1 < S.length && S[i1 + 1].prm.surface === 1) i1++;
  const sMin = S[i0].s + 3, sMax = Math.max(sMin + 1, S[i1].s - 3);
  const d = createDriver(Math.min(sMax, sMin + 1)), keys: DriveKeys = {};
  // built closures 3.5 m beyond both hold points (the car is ≈ 2 m half-length): the open road cut never shows in a test drive
  const closureAt = (sT: number) => {
    const q0 = F.at(sT), p = new THREE.Vector3(...q0.p).multiplyScalar(RACE_W), T = new THREE.Vector3(q0.T[0], 0, q0.T[2]).normalize(), Rl = new THREE.Vector3(-T.z, 0, T.x);
    let best: any = null, bd = Infinity; for (const sec of spec.roads[roadIdx].sections) { const c = new THREE.Vector3((sec.L[0][0] + sec.R[0][0]) / 2 + P0[0], 0, (sec.L[0][2] + sec.R[0][2]) / 2 + P0[2]), dd = c.distanceToSquared(new THREE.Vector3(p.x, 0, p.z)); if (dd < bd) { bd = dd; best = sec; } }
    const prof = [...best.L, ...best.R].map((v: number[]) => [(v[0] + P0[0] - p.x) * Rl.x + (v[2] + P0[2] - p.z) * Rl.z, v[1] + P0[1]]).sort((a: number[], b: number[]) => a[0] - b[0]);
    const yAt = (lat: number) => { if (lat <= prof[0][0]) return prof[0][1]; for (let k = 1; k < prof.length; k++) if (lat <= prof[k][0]) { const t = (lat - prof[k - 1][0]) / Math.max(1e-6, prof[k][0] - prof[k - 1][0]); return prof[k - 1][1] + (prof[k][1] - prof[k - 1][1]) * t; } return prof[prof.length - 1][1]; };
    return { p, T, half: Math.min(-prof[0][0], prof[prof.length - 1][0]), yAt };
  };
  const closures = await placeRoadEndClosures(scene, isl.group, '/roadbeds/' + islandId + '.parts.glb', [closureAt(Math.max(0, sMin - 3.5)), closureAt(Math.min(F.L, sMax + 3.5))]).catch((e) => ({ error: String(e) }));
  let q = F.at(d.s), lapBase = d.lap, stopped = false;
  const basis = new THREE.Matrix4(), Fv = new THREE.Vector3(), Uv = new THREE.Vector3(), Xv = new THREE.Vector3();
  let P: any = null;   // last k2b pose (track metres: P, F, U, X)
  const place = () => {
    P = pose(d, q);
    Fv.fromArray(P.F); Uv.fromArray(P.U); Xv.fromArray(P.X);
    basis.makeBasis(Xv, Uv, Fv);   // model turned to +Z forward (see above), +X left
    car.quaternion.setFromRotationMatrix(basis);
    car.position.set(P.P[0], P.P[1], P.P[2]).multiplyScalar(RACE_W);
    // C1 (Steuerung 11.10., V-103): J17 squash 1:1 (joyride-drive.j10.js:289 holder.scale(1+.12sq, 1−.18sq, 1+.06sq)); was .15/.25/.15 (no Georg number)
    car.scale.set(1 + d.squash * 0.12, 1 - d.squash * 0.18, 1 + d.squash * 0.06);
  };
  place();
  // ---- C1 (V-103): J17 rail chase camera, FAHREN only — joyride-drive.j10.js:318–329 1:1 (no free-look / FO branch), values
  // joyride.j06.json drive.camera (vendored); the wish point rides the track frame `boom` metres behind the car, clamped sideways
  // into the corridor, camera up follows the road up, FOV rises with speed / boost. Track metres × RACE_W → lab.
  const rail = makeRailChase(F, d, car, () => q, () => P, Fv, Uv);
  return {
    chase: rail.chase, resetChase: rail.reset,
    car, driver: d, frame: F, keys, bounds: { sMin, sMax }, closures,
    /** one step; `input` replaces the keys (the travel core filters them: parked = brake only) */
    update(dt: number, input?: Record<string, unknown>) {
      const sPrev = d.s, K: any = input ?? keys;
      q = stepDriver(d, F, { gas: !!K.gas, brake: !!K.brake, left: !!K.left, right: !!K.right, driftL: !!K.driftL, driftR: !!K.driftR, boost: !!K.boost, jump: !!K.jump }, dt, { assist: 0.8, halfWidth });
      // open road: k2b wraps an open stream to its start; here the road ends softly: a braking zone (≤ √(2 · 10 m/s² · rest))
      // and a hold 3 m inside both ends of the island-carried stretch; reversing stays possible
      if (d.lap !== lapBase) { d.lap = lapBase; d.s = sPrev; q = F.at(d.s); }
      const rest = sMax - d.s, back = d.s - sMin;
      if (rest <= 0) { d.s = sMax; d.speed = Math.min(0, d.speed); q = F.at(d.s); }
      else if (d.speed > 0) d.speed = Math.min(d.speed, Math.sqrt(2 * 10 * rest));
      if (back <= 0) { d.s = sMin; d.speed = Math.max(0, d.speed); q = F.at(d.s); }
      else if (d.speed < 0) d.speed = Math.max(d.speed, -Math.sqrt(2 * 10 * back));
      stopped = rest < 1 || back < 1;
      place();
    },
    state() { return { s: +d.s.toFixed(2), L: +F.L.toFixed(1), speed: +d.speed.toFixed(2), speedLab: +(d.speed * RACE_W).toFixed(2), lat: +d.lat.toFixed(2), psi: +d.psi.toFixed(3), atWall: d.atWall, hits: d.hits, fly: !!d.fly, onGround: d.onGround, roadEnd: stopped, frontYaw: car.userData.frontYaw, surf: q.surface, air: !!d.air, pos: car.position.toArray().map((v) => +v.toFixed(2)) }; },
    heading: () => Math.atan2(Fv.x, Fv.z),
    pose: () => P,
  };
}

/** C1b+C3 (V-109): drive on a closed Track Core stream (the O1 ring, track metres; its world group is scaled by RACE_W) — k2b straight
 *  on the stream frame as J17 does (makeFrame(S, ds, closed)), so no road ends / closures; same interface as createDrivePlay */
/** V-161 / C4c (Steuerung 11.10.): the exit / entry at the hex hub as ONE drive frame for k2b. The driver keeps a single s: the branch routes
 *  continue the ring's index parameter (c4_off from its _div start, c4_back after c4_off), so lap, audio and the rail chase see no jump.
 *  · in the EXIT taper (ring _div) the drivable band spans the main road AND the branch; once the car is on the branch side (beyond the gore
 *    middle) a soft assist settles it into the branch lane — it never pulls a car back onto the main; no key, no indicator (V-151 chill & fun)
 *  · past the nose, a car on the branch side continues on c4_off, then c4_back; in c4_back's CONVERGE the band spans branch + main and the
 *    assist guides into the main lane; at its end the car is handed to the ring (lap + 1: it passed the start line on the branch)
 *  The lateral position is kept absolute across band changes (d.lat is corrected by the band centre's shift per step). */
function graphNet(G: any, td: any) {
  const ds = td.ds, R = makeFrame(td.samples, ds, true), B = makeFrame(G.routes.c4_off.samples, ds, false), C = makeFrame(G.routes.c4_back.samples, ds, false);
  const ji = (S: any, re: RegExp) => (S.joints || []).find((j: any) => re.test(j.piece))?.index ?? -1;
  const iDiv = ji(td, /^c4_off_div$/), iNose = ji(td, /^c4_off_nose$/), iConv = ji(td, /^c4_on_conv$/), kIn = ji(G.routes.c4_back, /^c4_back_in$/);
  if (iDiv < 0 || iNose < 0 || iConv < 0 || kIn < 0) return null;
  const NB = (G.routes.c4_off.samples.length - 1) * ds, NC = (G.routes.c4_back.samples.length - 1) * ds, offB = iDiv * ds;
  let cur: 'ring' | 'c4_off' | 'c4_back' = 'ring', offC = 0, cOld = 0, switches = 0; const log: any[] = []; let tPrev: number | null = null;
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  // a band over two lanes: q is the frame the driver rides, o the other road (its lateral offset measured along q.R)
  // exit: the band reaches 2 m (≈ shoulder) beyond the branch's outer edge, else the branch lane sits in k2b's soft edge zone (FLOW.softStart) and is pushed off
  const widen = (q: any, o: any, toMain: boolean) => { const off = dot(sub(o.p, q.p), q.R), oc = off + o.c, m = toMain ? 0 : 2.0, l = Math.min(q.c - q.half, oc - o.half - (oc < q.c ? m : 0)), r = Math.max(q.c + q.half, oc + o.half + (oc > q.c ? m : 0));
    return { ...q, c: (l + r) / 2, half: (r - l) / 2, zone: { main: toMain ? oc : q.c, other: toMain ? q.c : oc, mid: (Math.max(q.c - q.half, oc - o.half) + Math.min(q.c + q.half, oc + o.half)) / 2,
      intent: toMain ? null : (oc < q.c ? q.c - q.half + 1.5 : q.c + q.half - 1.5) } }; };   // exit intent: within 1.5 m of the main's edge on the branch side
  const at = (s: number) => {
    if (cur === 'c4_off') return B.at(s - offB);
    if (cur === 'c4_back') { const q = C.at(s - offC); return q.i >= kIn ? widen(q, R.at(iConv * ds + (s - offC) - kIn * ds), true) : q; }   // interpolated mapping (index steps made the target jitter)
    const q = R.at(s); return q.i >= iDiv && q.i <= iNose ? widen(q, B.at(s - offB), false) : q; };
  const frame = { at, get L() { return cur === 'ring' ? R.L : 1e9; }, get N() { return R.N; }, closed: true };
  const toBranch = (d: any) => { const zq = R.at(d.s), b = B.at(d.s - offB), abs = at(d.s).c + d.lat, P = [zq.p[0] + zq.R[0] * abs, zq.p[1] + zq.R[1] * abs, zq.p[2] + zq.R[2] * abs];
    d.lat = dot(sub(P, b.p), b.R) - b.c; cur = 'c4_off'; switches++; if (log.length < 8) log.push({ to: 'c4_off', s: +d.s.toFixed(1), i: zq.i, iNose, latB: +d.lat.toFixed(2), half: +b.half.toFixed(2), speed: +d.speed.toFixed(1), psi: +d.psi.toFixed(3) }); };
  const toRing = (d: any) => { const qb = C.at(d.s - offC), sR = iConv * ds + (d.s - offC) - kIn * ds, qm = R.at(sR), abs = at(d.s).c + d.lat, P = [qb.p[0] + qb.R[0] * abs, qb.p[1] + qb.R[1] * abs, qb.p[2] + qb.R[2] * abs];
    cur = 'ring'; d.s = sR; d.lat = dot(sub(P, qm.p), qm.R) - qm.c; d.lap++; switches++; if (log.length < 8) log.push({ to: 'ring', s: +d.s.toFixed(1), lat: +d.lat.toFixed(2), half: +qm.half.toFixed(2) }); };
  return {
    frame, get cur() { return cur; }, get switches() { return switches; }, log,
    /** before the k2b step: hand over at the PREDICTED station (k2b clamps against the band at its new s inside the step) and shift d.lat by the
     *  band centre's change to that station, so the clamp sees the car where it really is */
    before(d: any, dt: number) {
      const sN = d.s + Math.max(0, d.speed) * dt, qN = at(sN), z = at(d.s).zone;
      if (cur === 'ring' && z && qN.i >= iNose - 1 && at(d.s).c + d.lat < z.mid) toBranch(d);
      else if (cur === 'c4_off' && sN - offB >= NB - 0.5) { offC = offB + NB; cur = 'c4_back'; switches++; }
      else if (cur === 'c4_back' && sN - offC >= NC - 0.5) toRing(d);
      const c0 = at(d.s).c, c1 = at(d.s + Math.max(0, d.speed) * dt).c; d.lat -= c1 - c0; cOld = c1; },
    after(d: any, assist: number, dt: number) {
      const q = at(d.s); d.lat -= q.c - cOld;   // residual (the real step differs a little from the prediction)
      const z = q.zone; if (!z || d.fly) tPrev = null; if (z && !d.fly) { const abs = q.c + d.lat, target = cur === 'c4_back' ? z.main : (z.other < z.main ? abs < z.intent : abs > z.intent) ? z.other : null;   // exit: only once the car is on the branch side (never pulls a car back), entry: into the main lane
        if (target == null) tPrev = null; else {
        if (tPrev != null) d.lat += (target - tPrev) * Math.min(1, assist / 0.5); tPrev = target;   // feed-forward: carry the lane's own drift (taper / converge)
        const pull = Math.max(-6, Math.min(6, (target - abs) * 2.5)) * assist;   // chill (V-151): follows the moving lane centre (the branch shifts 9.6 m over the 80 m taper), ≤ 4.8 m/s at assist 0.8
        d.lat += pull * dt * Math.min(1, Math.abs(d.speed) / 10); } } },
  };
}

export async function createStreamDrive(scene: THREE.Scene, td: any, sStart: number, carAsset = 'cars/Cicada/CICADA_LOW.fbx') {
  const net = td.graph?.routes?.c4_off && td.graph?.routes?.c4_back ? graphNet(td.graph, td) : null;
  const F: any = net ? net.frame : makeFrame(td.samples, td.ds, !!td.closed);
  const { car, halfWidth } = await loadDriveCar(scene, carAsset, 0.15, true);
  const d = createDriver(sStart), keys: DriveKeys = {};
  let q = F.at(d.s), P: any = null;
  const basis = new THREE.Matrix4(), Fv = new THREE.Vector3(), Uv = new THREE.Vector3(), Xv = new THREE.Vector3();
  const place = () => {
    P = pose(d, q); Fv.fromArray(P.F); Uv.fromArray(P.U); Xv.fromArray(P.X);
    basis.makeBasis(Xv, Uv, Fv); car.quaternion.setFromRotationMatrix(basis);
    car.position.set(P.P[0], P.P[1], P.P[2]).multiplyScalar(RACE_W);
    car.scale.set(1 + d.squash * 0.12, 1 - d.squash * 0.18, 1 + d.squash * 0.06);   // J17 squash (V-103)
  };
  place();
  const rail = makeRailChase(F, d, car, () => q, () => P, Fv, Uv);
  return {
    chase: rail.chase, resetChase: rail.reset,
    car, driver: d, frame: F, keys, bounds: { sMin: 0, sMax: F.L }, closures: null,
    /** `o.assist` only for the drive test (V-125: also without the lane assist); the game uses 0.8 */
    update(dt: number, input?: Record<string, unknown>, o?: { assist?: number }) {
      const K: any = input ?? keys;
      const assist = o?.assist ?? 0.8; net?.before(d, dt);
      q = stepDriver(d, F, { gas: !!K.gas, brake: !!K.brake, left: !!K.left, right: !!K.right, driftL: !!K.driftL, driftR: !!K.driftR, boost: !!K.boost, jump: !!K.jump }, dt, { assist, halfWidth });
      if (net) { net.after(d, assist, dt); q = F.at(d.s); }
      place();
    },
    state() { return { route: net?.cur ?? 'ring', switches: net?.switches ?? 0, netLog: net?.log ?? [], s: +d.s.toFixed(2), L: +Math.min(F.L, 1e8).toFixed(1), speed: +d.speed.toFixed(2), speedLab: +(d.speed * RACE_W).toFixed(2), lat: +d.lat.toFixed(2), psi: +d.psi.toFixed(3), atWall: d.atWall, hits: d.hits, fly: !!d.fly, onGround: d.onGround, lap: d.lap }; },
    heading: () => Math.atan2(Fv.x, Fv.z),
    pose: () => P,
  };
}
