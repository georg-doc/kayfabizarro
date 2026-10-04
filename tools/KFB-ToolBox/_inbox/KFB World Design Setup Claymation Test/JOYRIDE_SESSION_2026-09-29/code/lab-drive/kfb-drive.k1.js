/* KFB-Fahrphysik K1 · im Streckenrahmen (29.09.)
 * Zahlen UNVERÄNDERT aus KFB-Stunt-Car-Race · KFB Cologne Race Option C-3 · lab-v9/cologne-play.v1.js
 * (Race v0.8: RACE_FLOW_RUNTIME_CONFIG.json · flow, RACE_FEEL_V08_CONFIG.json · feel), stepDriver():
 * Gas/Bremse/Drag, Lenkformel (steerBase × speedFactor × 8,2), Drift, Zentrifugal MIT dt, weiche Bande
 * (softStart/softBase/softGain), Bandenprall (bounceBase/bounceSpeed/retention/cooldown), Sprung, Lage.
 * Geändert gegenüber dem Spender: Integration im Streckenrahmen (s, Querlage, relative Gierung psi) statt in x/z.
 * Dadurch fahren Helix, Looping und Überführungen ohne Mehrdeutigkeit, und die Bande ist per Bau eine Bande.
 * Neu (KFB-Zusatz, Georg 29.09.): ASSIST · Spurhilfe zieht psi zur Streckenrichtung, Knetgummi-Bande
 * spiegelt die Gierung und behält fast das ganze Tempo. assist 0 = Spenderverhalten (du lenkst jede Kurve). */
export const FLOW = {
  accel: 18.5, brake: 28, reverseAccel: 10.5, drag: 0.95,
  maxForward: 41, maxReverse: 9, steerBase: -13.8,
  lateralDamping: 3.05, centrifugalGain: 0.085, proxyHalfWidth: 1.08,
  softStart: 0.76, softBase: 5, softGain: 19,
  bounceBase: 4.6, bounceLat: 0.76, bounceSpeed: 0.085,
  retention: 0.985, cooldown: 0.2
};
export const FEEL = {
  driftMinSpeed: 7.5, driftSteerScale: 1.28, driftDampingScale: 0.28,
  driftKickScale: 0.035, driftYawGain: 1.32, regripSeconds: 0.34,
  regripDampingScale: 1.85, accelPitchGain: 0.0075, lateralRollGain: 0.0028,
  surfaceSpring: 34, surfaceDamping: 8.2, hoverBase: 0.045,
  boostAccelScale: 1.55, boostMaxForward: 48.5, boostPitchBias: 0.035,
  jumpImpulse: 7.8, jumpGravity: 19.0
};
export const ASSIST = { follow: 0.8, align: 2.4, alignSteer: 0.25, psiMax: 0.85, wallReflect: 0.4, wallKeep: 0.995, squash: 1 };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/* Streckenrahmen aus einem T4-Stream: at(s) → Lage, Tangente, Oben, Rechts, Fahrbahnmitte und -halbbreite */
export function makeFrame(S, ds) {
  const N = S.length, L = S[N - 1].s;
  const at = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
    const mix = (u, w) => [u[0] + (w[0] - u[0]) * f, u[1] + (w[1] - u[1]) * f, u[2] + (w[2] - u[2]) * f], nz = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
    const l6 = a.slots[6][0] + (b.slots[6][0] - a.slots[6][0]) * f, l7 = a.slots[7][0] + (b.slots[7][0] - a.slots[7][0]) * f;
    return { p: mix(a.p, b.p), T: nz(mix(a.T, b.T)), U: nz(mix(a.U, b.U)), R: nz(mix(a.R, b.R)), c: (l6 + l7) / 2, half: (l7 - l6) / 2, surface: Math.min(a.prm.surface ?? 1, b.prm.surface ?? 1), tags: a.tags, i }; };
  return { at, L, N };
}
const turnAbout = (T0, T1, U) => { const cx = T0[1] * T1[2] - T0[2] * T1[1], cy = T0[2] * T1[0] - T0[0] * T1[2], cz = T0[0] * T1[1] - T0[1] * T1[0];
  return Math.atan2(cx * U[0] + cy * U[1] + cz * U[2], T0[0] * T1[0] + T0[1] * T1[1] + T0[2] * T1[2]); };   // + = Strecke biegt nach links

export function createDriver(s0) {
  return { s: s0, lat: 0, psi: 0, speed: 0, latV: 0, airY: 0, airV: 0, onGround: true, air: false,
    drift: 0, driftDir: 0, regrip: 0, boosting: false, pitch: 0, roll: 0, steerAngle: 0, hitCooldown: 0,
    squash: 0, squashV: 0, hits: 0, lastHit: 0, atWall: false, lap: 1 };
}

/* in: { gas, brake, left, right, driftL, driftR, boost, jump } · o: { assist 0..1, motorK, halfWidth } */
export function stepDriver(d, F, inp, dt, o = {}) {
  const assist = o.assist ?? ASSIST.follow, mk = o.motorK ?? 1, halfW = o.halfWidth ?? FLOW.proxyHalfWidth;
  d.boosting = inp.boost && d.speed > 4;
  const maxF = (d.boosting ? FEEL.boostMaxForward : FLOW.maxForward) * Math.sqrt(mk), acc = FLOW.accel * mk * (d.boosting ? FEEL.boostAccelScale : 1);
  if (inp.gas) d.speed += acc * dt;
  else if (inp.brake) d.speed -= (d.speed > 0 ? FLOW.brake : FLOW.reverseAccel) * dt;
  else d.speed *= Math.pow(FLOW.drag, dt * 4);
  d.speed = clamp(d.speed, -FLOW.maxReverse, maxF);

  const steerIn = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), speedFactor = 1 / (1 + Math.abs(d.speed) * 0.048);
  let yawRate = -steerIn * FLOW.steerBase * Math.PI / 180 * speedFactor * 8.2;   // + = links (Spender, gemessen)
  const wantDrift = (inp.driftL ? -1 : 0) + (inp.driftR ? 1 : 0);
  if (wantDrift && Math.abs(d.speed) > FEEL.driftMinSpeed) {
    if (!d.drift) d.driftDir = wantDrift; d.drift = Math.min(1, d.drift + dt * 3.4); d.regrip = FEEL.regripSeconds;
    yawRate *= FEEL.driftSteerScale; yawRate += -d.driftDir * FEEL.driftYawGain * 0.42 * Math.min(1, Math.abs(d.speed) / 22) * d.drift;
    const target = d.driftDir * 7.5 * d.drift; d.latV += (target - d.latV) * Math.min(1, 9 * dt / 7.5);
  } else { d.drift = Math.max(0, d.drift - dt * 2.6); d.regrip = Math.max(0, d.regrip - dt); }
  d.steerAngle += (steerIn * 0.42 - d.steerAngle) * Math.min(1, dt * 9);

  // Relative Gierung: eigene Drehung minus Streckenbiegung. Spurhilfe: die Biegung wird zum Anteil `assist` mitgenommen.
  const q0 = F.at(d.s);
  d.psi += yawRate * dt * (d.speed >= 0 ? 1 : -1);
  const ds = d.speed * Math.cos(d.psi) * dt, q1 = F.at(d.s + ds), bend = turnAbout(q0.T, q1.T, q0.U);
  d.psi -= bend * (1 - assist);
  const aK = ASSIST.align * assist * (steerIn ? ASSIST.alignSteer : 1) * (d.drift > 0.05 ? 0.3 : 1);
  d.psi -= d.psi * Math.min(1, aK * dt); d.psi = clamp(d.psi, -ASSIST.psiMax, ASSIST.psiMax);
  d.s += ds; if (d.s > F.L - 2) { d.s = 2; d.lap++; } if (d.s < 2) d.s = 2;

  // Quer (Spender: Zentrifugal mit dt, gedämpft); latV + = links, lat + = rechts
  const damp = FLOW.lateralDamping * (d.drift > 0.05 ? FEEL.driftDampingScale : (d.regrip > 0 ? FEEL.regripDampingScale : 1));
  d.latV += -yawRate * d.speed * FLOW.centrifugalGain * dt; d.latV -= d.latV * Math.min(1, damp * dt); d.latV = clamp(d.latV, -11, 11);
  d.lat -= (d.speed * Math.sin(d.psi) + d.latV) * dt;

  // Bande: weich (Spender), dann Knetgummi-Prall mit Tempo-Erhalt
  const q = F.at(d.s), limit = Math.max(0.5, q.half - halfW);
  d.atWall = Math.abs(d.lat) > limit - 0.25;
  const over = Math.abs(d.lat) - limit * FLOW.softStart;
  if (over > 0) d.lat -= Math.sign(d.lat) * (FLOW.softBase + FLOW.softGain * (over / Math.max(1, limit))) * dt;
  if (Math.abs(d.lat) > limit) {
    if (d.hitCooldown <= 0) { const into = Math.sign(d.lat) * -Math.sin(d.psi) > 0;   // fährt auf die Wand zu
      d.latV = Math.sign(d.lat) * (FLOW.bounceBase + Math.abs(d.speed) * FLOW.bounceSpeed);
      if (into) d.psi = -d.psi * ASSIST.wallReflect;
      d.speed *= assist > 0 ? ASSIST.wallKeep : FLOW.retention; d.hitCooldown = FLOW.cooldown;
      d.squashV += ASSIST.squash * clamp(Math.abs(d.speed) / 30, 0.3, 1.2); d.hits++; d.lastHit = Math.sign(d.lat); }
    d.lat = Math.sign(d.lat) * limit; }
  d.hitCooldown = Math.max(0, d.hitCooldown - dt);

  // Luft: Stream ohne Fahrfläche = Flug; Sprungtaste wie Spender
  d.air = q.surface < 0.5;
  if (inp.jump && d.onGround && !d.air) { d.airV = FEEL.jumpImpulse; d.onGround = false; }
  if (!d.onGround) { d.airV -= FEEL.jumpGravity * dt; d.airY += d.airV * dt; if (d.airY <= 0) { if (d.airV < -6) d.squashV += 0.6; d.airY = 0; d.airV = 0; d.onGround = true; } }

  // Lage + Knetgummi-Feder
  d.pitch += ((inp.gas ? -1 : inp.brake ? 1 : 0) * Math.abs(d.speed) * FEEL.accelPitchGain * 0.55 + (d.boosting ? -FEEL.boostPitchBias : 0) - d.pitch) * Math.min(1, dt * 6);
  d.roll += (-d.latV * FEEL.lateralRollGain * 6 - d.roll) * Math.min(1, dt * 5);
  d.squashV += (-d.squash * 180 - d.squashV * 9) * dt; d.squash += d.squashV * dt;
  return q;
}

/* Pose im Weltraum: Basis (links, oben, vorn) wie KayKit (+Z vorn) */
export function pose(d, q, hover = FEEL.hoverBase) {
  const L = [-q.R[0], -q.R[1], -q.R[2]], c = Math.cos(d.psi), s = Math.sin(d.psi);
  const Fw = [q.T[0] * c + L[0] * s, q.T[1] * c + L[1] * s, q.T[2] * c + L[2] * s];
  const lat = q.c + d.lat, h = hover + d.airY + 0.04 + 2.08 * Math.abs(d.pitch) + 1.08 * Math.abs(d.roll);
  const P = [q.p[0] + q.R[0] * lat + q.U[0] * h, q.p[1] + q.R[1] * lat + q.U[1] * h, q.p[2] + q.R[2] * lat + q.U[2] * h];
  const X = [q.U[1] * Fw[2] - q.U[2] * Fw[1], q.U[2] * Fw[0] - q.U[0] * Fw[2], q.U[0] * Fw[1] - q.U[1] * Fw[0]];
  return { P, F: Fw, U: q.U, X, lat };
}
