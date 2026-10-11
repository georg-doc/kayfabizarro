// V-125 drive test, R2 (Steuerung 11.10., concept C1b_C3_KONZEPT_R1 (b)): an autopilot drives the REAL k2b (createStreamDrive → stepDriver,
// no own physics) only through its keys — gas / brake / left / right / boost — at a speed it chooses from the track ahead:
//   v_target(s) = min(vmax, min over the next 150 m of  sqrt(v_curve(s')² + 2 · b · (s' − s)))
//   v_curve = the lower of  sqrt(aMax / κ)  and the k2b yaw capability  v · κ · (1 − assist) ≤ 0.8 · yawMax(v)   (κ from the frame tangents ±2 m)
// Steering: bang-bang on the yaw error to ψ_d = clamp(0.08 · lat, ±0.25) — the track bend is NOT handed in (with assist 0 the car must steer
// every curve itself). Runs: assist 0, assist 0.8 (game), and a limit run with boost. Each run: the whole lap + 200 m over start / finish.
// Measured: under the deck while grounded, stuck, barrier contacts (k2b `hit` events) and |lat| beyond the k2b limit (tunnelling), every
// take-off / landing (k2b events: s, energy, on a deck?, |lat| ≤ limit) and rescues, rail camera inside the tube / not behind a body, lap
// time, max lateral acceleration, frame and road-mesh seams. Loaded by the probe page; nothing in the game imports it.
import * as THREE from 'three';
import { createStreamDrive } from './drive';
import { RACE_W } from './camera';
import { outline } from '../world/tunnel/tunnel-insert';
import { FLOW, FEEL } from './vendor/kfb-drive.k2b.js';

export async function runDriveTest(scene: THREE.Scene, organ: any, o: { car?: string; assist?: number; vmax?: number; aMax?: number; boost?: boolean; edge?: boolean; exit?: boolean; maxT?: number; camEvery?: number } = {}) {
  const td = organ.td, S = td.samples, N = S.length, ds = td.ds, dt = 1 / 60, assist = o.assist ?? 0, aMax = o.aMax ?? 14, bMax = 20, t0 = performance.now();
  const vmax = o.vmax ?? (o.boost ? FEEL.boostMaxForward : FLOW.maxForward) - 1;
  const drv: any = await createStreamDrive(scene, td, organ.sCar, o.car), d = drv.driver, F = drv.frame, L = F.L;
  const cam = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 9000);
  // curvature per sample about the frame up axis (±2 m), and the speed the car can hold there
  const turn = (a: number[], b: number[], u: number[]) => { const cx = a[1] * b[2] - a[2] * b[1], cy = a[2] * b[0] - a[0] * b[2], cz = a[0] * b[1] - a[1] * b[0]; return Math.atan2(cx * u[0] + cy * u[1] + cz * u[2], a[0] * b[0] + a[1] * b[1] + a[2] * b[2]); };
  const kap = new Float32Array(N); for (let i = 0; i < N; i++) { const a = S[(i - 4 + N) % N], b = S[(i + 4) % N]; kap[i] = Math.abs(turn(a.T, b.T, S[i].U)) / (8 * ds); }
  const yawMax = (v: number) => Math.abs(FLOW.steerBase) * Math.PI / 180 * 8.2 / (1 + v * 0.048);
  const vCurve = new Float32Array(N); for (let i = 0; i < N; i++) { const k = Math.max(1e-5, kap[i]); let v = Math.min(vmax, Math.sqrt(aMax / k)); if (assist < 1) while (v > 4 && v * k * (1 - assist) > 0.8 * yawMax(v)) v -= 0.25; vCurve[i] = v; }
  const vTarget = (s: number) => { let v = vmax; for (let m = 0; m <= 150; m += 2) { const i = Math.floor((((s + m) % L) + L) % L / ds) % N; v = Math.min(v, Math.sqrt(vCurve[i] ** 2 + 2 * bMax * m)); } return v; };
  // tunnels: interior contour per tunnel (rail camera test)
  const tun = (td.tunnels || []).map((t: any) => { const O = outline(td.tunnelRings[S[t.i0].tunnel?.ringId ?? 0].map((p: number[]) => [p[0], p[1]]) as any); return { i0: t.i0, i1: t.i1, poly: O.P }; });
  const inPoly = (P: number[][], x: number, y: number) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
  const bodies: { box: THREE.Box3; meshes: THREE.Mesh[] }[] = []; organ.W.built.forEach((B: any) => { const ms: THREE.Mesh[] = []; B.root.traverse((m: any) => { if (m.isMesh && !/water|harnleiter/.test(m.name)) ms.push(m); }); const box = new THREE.Box3(); ms.forEach((m) => box.expandByObject(m)); bodies.push({ box: box.expandByScalar(30), meshes: ms }); });
  const rc = new THREE.Raycaster(), seg = new THREE.Vector3(), pieceAt = (i: number) => { let pc = ''; for (const j of td.joints || []) if (j.index <= i) pc = j.piece; return pc; };
  const R: any = { car: o.car ?? 'cars/Cicada/CICADA_LOW.fbx', carSize: drv.car.userData.size, assist, vmax, aMax, boost: !!o.boost, dt, steps: 0,
    underRoad: 0, underRoadMin: 0, stuck: [] as any[], hitEvents: 0, hitAt: [] as any[], tunnelling: 0, takeoffs: [] as any[], landings: [] as any[], rescues: [] as any[], camClipTunnel: 0, camClipBody: 0, camChecks: 0, maxLatAcc: 0, maxLatAccAt: 0, vSum: 0, steerSteps: 0, brakeSteps: 0, routeSteps: {} as Record<string, number>, exit: !!o.exit };
  const sStart = d.s; let t = 0, slowT = 0, sTravel = 0, sPrev = d.s, prevPos: THREE.Vector3 | null = null, prevV: THREE.Vector3 | null = null, aWin: number[] = [], lapTime: number | null = null;
  const maxT = o.maxT ?? 900, camEvery = o.camEvery ?? 3;
  while (t < maxT && sTravel < L + 200) {
    // edge run: the car hugs the right barrier (lat target = k2b limit + 0.15 → it touches): the only k2b quantity that depends on the car is its
    // half width, so barrier contacts and lap must differ between cars here
    // C4c (V-161): in a two-lane band (exit taper / entry converge) the bot aims at the main lane, or with `exit` at the branch (then the merge)
    const qE = F.at(d.s), limE = Math.max(0.5, qE.half - (drv.car.userData.size?.halfWidthTrack ?? 1.08)), rt = drv.state().route, latT = o.edge ? limE + 0.15 : qE.zone ? ((o.exit && rt !== 'c4_back' ? qE.zone.other : qE.zone.main) - qE.c) : 0;
    R.routeSteps[rt] = (R.routeSteps[rt] ?? 0) + 1;
    const vt = vTarget(d.s), wantPsi = Math.max(-0.25, Math.min(0.25, 0.08 * (d.lat - latT))), err = wantPsi - d.psi, flying = !!d.fly;
    const inp = { gas: d.speed < vt - 0.5, brake: d.speed > vt + 1.5, left: !flying && err > 0.004, right: !flying && err < -0.004, boost: !!o.boost && vt >= vmax - 0.5 && d.speed > 20 };
    if (inp.left || inp.right) R.steerSteps++; if (inp.brake) R.brakeSteps++;
    drv.update(dt, inp, { assist }); t += dt; R.steps++; R.vSum += d.speed;
    for (const e of d.events) { if (e.type === 'hit') { R.hitEvents++; if (R.hitAt.length < 12) R.hitAt.push({ s: +e.s.toFixed(1), side: e.side, energy: +e.energy.toFixed(2), piece: pieceAt(Math.floor(e.s / ds)) }); }
      if (e.type === 'takeoff') R.takeoffs.push({ s: +e.s.toFixed(1), v: +e.v.toFixed(1), piece: pieceAt(Math.floor(e.s / ds)) });
      if (e.type === 'land') { const q = F.at(d.s), limit = Math.max(0.5, q.half - (drv.car.userData.size?.halfWidthTrack ?? 1.08)); R.landings.push({ s: +e.s.toFixed(1), energy: +e.energy.toFixed(2), onDeck: q.surface >= 0.5, lat: +d.lat.toFixed(2), latOk: Math.abs(d.lat) <= limit + 1e-6, piece: pieceAt(q.i) }); }
      if (e.type === 'rescue') R.rescues.push({ s: +e.s.toFixed(1), piece: pieceAt(Math.floor(e.s / ds)) }); }
    const P = drv.pose(), q = F.at(d.s);
    let dS = d.s - sPrev; if (dS < -L / 2) dS += L; if (dS > L / 2) dS -= L; sTravel += dS; sPrev = d.s;
    if (lapTime == null && sTravel >= L) lapTime = t;
    const h = (P.P[0] - q.p[0]) * q.U[0] + (P.P[1] - q.p[1]) * q.U[1] + (P.P[2] - q.p[2]) * q.U[2], grounded = !d.fly && d.onGround && !d.air;
    if (grounded && h < -0.05) { R.underRoad++; R.underRoadMin = Math.min(R.underRoadMin, h); }
    if (Math.abs(d.speed) < 1 && t > 3) { slowT += dt; if (slowT > 1 && (!R.stuck.length || R.stuck[R.stuck.length - 1].t < t - 2)) R.stuck.push({ t: +t.toFixed(1), s: +d.s.toFixed(1), piece: pieceAt(q.i) }); } else slowT = 0;
    const limit = Math.max(0.5, q.half - (drv.car.userData.size?.halfWidthTrack ?? 1.08)); if (grounded && Math.abs(d.lat) > limit + 1e-6) R.tunnelling++;
    const pos = drv.car.position.clone().divideScalar(RACE_W); if (prevPos && grounded) { const v = pos.clone().sub(prevPos).divideScalar(dt); if (prevV) { const a = v.clone().sub(prevV).divideScalar(dt); aWin.push(a.dot(new THREE.Vector3(...P.X))); if (aWin.length > 15) aWin.shift(); const am = Math.abs(aWin.reduce((x, y) => x + y, 0) / aWin.length); if (aWin.length === 15 && am > R.maxLatAcc) { R.maxLatAcc = am; R.maxLatAccAt = +d.s.toFixed(1); } } prevV = v; } else { prevV = null; aWin = []; } prevPos = pos;
    drv.chase(dt, cam);
    if (R.steps % camEvery === 0) { R.camChecks++; const cm = cam.position.clone().divideScalar(RACE_W), T = tun.find((x: any) => q.i >= x.i0 + 25 && q.i <= x.i1 - 25);
      if (T) { let sC = d.s; for (let k = 0; k < 4; k++) { const qq = F.at(sC); sC += (cm.x - qq.p[0]) * qq.T[0] + (cm.y - qq.p[1]) * qq.T[1] + (cm.z - qq.p[2]) * qq.T[2]; } const qc = F.at(sC), rel = [cm.x - qc.p[0], cm.y - qc.p[1], cm.z - qc.p[2]];
        if (!inPoly(T.poly, rel[0] * qc.R[0] + rel[1] * qc.R[1] + rel[2] * qc.R[2], rel[0] * qc.U[0] + rel[1] * qc.U[1] + rel[2] * qc.U[2])) R.camClipTunnel++; }
      const eye = drv.car.position.clone().addScaledVector(new THREE.Vector3(...P.U), 1.5 * RACE_W);
      for (const B of bodies) { if (!B.box.containsPoint(cam.position)) continue; seg.copy(cam.position).sub(eye); const Lr = seg.length(); rc.set(eye, seg.normalize()); rc.far = Lr; if (rc.intersectObjects(B.meshes, false).length) R.camClipBody++; } }
  }
  R.lap = lapTime != null ? { seconds: +lapTime.toFixed(2), length: +L.toFixed(1), avgKmh: +((L / lapTime) * 3.6).toFixed(1) } : null;
  R.distance = +sTravel.toFixed(1); R.overStartFinish_m = +(sTravel - L).toFixed(1); R.sStart = +sStart.toFixed(1); R.t = +t.toFixed(1);
  R.vMean = +(R.vSum / Math.max(1, R.steps)).toFixed(2); delete R.vSum; R.steerShare = +(R.steerSteps / R.steps).toFixed(3); R.brakeShare = +(R.brakeSteps / R.steps).toFixed(3);
  R.maxLatAcc = +R.maxLatAcc.toFixed(2); R.maxLatAccG = +(R.maxLatAcc / 9.81).toFixed(2); R.maxLatAccPiece = pieceAt(Math.floor(R.maxLatAccAt / ds));
  R.landingsOk = R.landings.length === R.takeoffs.length && R.landings.every((x: any) => x.onDeck && x.latOk) && R.rescues.length === 0;
  // frame seams (piece joints, chunk seams) and road mesh seams, as R1
  const seams: { i: number; kind: string }[] = []; (td.joints || []).forEach((j: any) => seams.push({ i: j.index, kind: 'joint:' + j.piece })); (organ.chunks || []).forEach((c: any) => seams.push({ i: c.i0, kind: 'chunk' }));
  let maxDh = 0, maxDa = 0; for (const sm of seams) { const s = S[Math.min(N - 1, sm.i)].s, a = F.at(s - 0.25), b = F.at(s + 0.25), mid = F.at(s); maxDh = Math.max(maxDh, Math.abs((b.p[0] - a.p[0]) * mid.U[0] + (b.p[1] - a.p[1]) * mid.U[1] + (b.p[2] - a.p[2]) * mid.U[2])); maxDa = Math.max(maxDa, Math.acos(Math.min(1, a.U[0] * b.U[0] + a.U[1] * b.U[1] + a.U[2] * b.U[2])) * 180 / Math.PI); }
  R.frameSeams = { count: seams.length, maxHeightJump_m_over_0_5m: +maxDh.toFixed(4), maxNormalJump_deg: +maxDa.toFixed(3) };
  R.routeSwitches = drv.state().switches; R.netLog = drv.state().netLog; R.ms = Math.round(performance.now() - t0); scene.remove(drv.car);
  return R;
}
