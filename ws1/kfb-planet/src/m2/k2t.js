// M2 · G0-Kandidat A: J17-Fahrphysik k2b (lab-drive/kfb-drive.k2b.js, J14-Schnitt 30.09.) frei auf dem Gelände statt im Streckenrahmen (V-290/V-313).
// Zahlen FLOW/FEEL 1:1 aus k2b; Formeln für Gas/Bremse/Drag, Lenkung (steerBase × speedFactor × 8,2), Zentrifugal mit Querdämpfung, Sprung, Lage
// (Nicken/Rollen) wörtlich. Geändert, weil es keine Strecke gibt:
//   – Lage in x/z mit Gierung yaw statt (s, lat, psi); keine Spurhilfe (ASSIST.follow/align brauchen eine Streckenrichtung).
//   – Boden = Strahlen auf Gelände und Theater (ground-Rückruf), Neigung aus der Bodennormale; Luft, wenn der Boden schneller wegfällt als die Feder folgt.
//   – Bande = Wände (sweep-Rückruf: Rapier-Shape-Cast, wie der Flug in M1); Prall wie k2b (Tempo-Erhalt wallKeep, Querimpuls bounceBase).
//   – Drift Q/E seit V-347 wörtlich k2b (= K3-Zeile, K2B-Δ1); Boost fehlt noch. Überschlag gibt es in diesem Modell grundsätzlich nicht (kinematisch).
import { K, G, JUMP_K } from '../m1/m1Scale.js'
const GK = G / 14 // Fallbeschleunigung: Welt jetzt 9,81 statt 14 (legacy 1)
// V-345 (J17-Meter): Zahlen wie abgenommen, Tempi/Beschleunigungen/Längen × K, damit das Auto im kleineren Maß genauso fährt (Bild und Zeitverlauf
// gleich); Fallbeschleunigungen × G/14 (Welt 9,81 statt 14), Absprung × JUMP_K (Sprunghöhe × K). Winkel, Raten (1/s) und Anteile bleiben.
export const FLOW = {
  accel: 18.5 * K, brake: 28 * K, reverseAccel: 10.5 * K, drag: 0.95,
  maxForward: 41 * K, maxReverse: 9 * K, steerBase: -13.8,
  lateralDamping: 3.05, centrifugalGain: 0.085,
  bounceBase: 4.6 * K, bounceSpeed: 0.085, retention: 0.985,
}
export const FEEL = {
  driftMinSpeed: 7.5 * K, driftSteerScale: 1.28, driftDampingScale: 0.28, driftYawGain: 1.32, regripSeconds: 0.34, regripDampingScale: 1.85, // k2b-Drift (V-347)
  accelPitchGain: 0.0075 / K, lateralRollGain: 0.0028 / K, hoverBase: 0.045 * K, jumpImpulse: 7.8 * JUMP_K, jumpGravity: 19.0 * GK }
export const ASSIST = { wallKeep: 0.995, flyGravity: 13.3 * GK, squash: 1, soft: { back: 0.08, keep: 0.6, lat: 0.25, squash: 0.5 } } // soft = Figuren (KFB-Zusatz)
// Knet-Squash (V-103/V-033, Georg 16.10. „cartoonig deformieren … mit Recovery“): Dynamik wörtlich aus k2b stepDriver/flyStep (Feder 180, Dämpfung 9;
// Stoß an der Bande ASSIST.squash · clamp(v/30, 0,3…1,2), Landung 0,9 · clamp(vN/12, 0,3…1,4)); Optik im Host wie J17 joyride-drive.j10 Z. 289.
export const SQUASH_LOOK = Object.freeze({ x: 0.12, y: -0.18, z: 0.06 })
// KFB-Zusatz frei auf dem Gelände (Georg 16.10.: „am Hügel fährt sie alleine ewig weiter, ohne dass die Physik Einfluss hat“): Hangabtrieb wie die
// Welt-Schwerkraft (14 m/s²) längs und quer zur Fahrtrichtung, Stillstand ohne Gas auf ebenem Boden; Abheben erst ab 8 cm Bodenverlust je Schritt.
export const SLOPE = { g: G, lateral: 0.5, stopBelow: 0.4 * K, flatNy: 0.99, takeoffGap: 0.08 * K }
// KFB-Zusatz Wenden (V-347 (2), Georg 16.10.: „das Auto auf kleiner Fläche umdrehen“): k2b lenkt mit dem Tempo schwächer, aus dem Stand mit Vollgas
// wird die Drehung so 16 Wagenlängen weit. Lenkt man unter `below` m/s, zieht das Gas nur bis `below` (Anteil `ramp` vor der Grenze) und die Gierung
// wächst um `yaw` × Anteil – Kreis mit Vollgas ≈ 2 Wagenlängen (scripts/m2/turn-circle.mjs); schneller als `below` bleibt k2b unverändert.
export const TURN = { below: 10 * K, yaw: 0.3, ramp: 3 }
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))

export function createK2t(x, y, z, yaw) {
  return { x, y, z, yaw, speed: 0, latV: 0, drift: 0, driftDir: 0, regrip: 0, vy: 0, vyG: 0, squash: 0, squashV: 0, events: [], signals: { speed: 0, longAccel: 0, lateral: 0, bank: 0, drift: 0 }, air: false, pitch: 0, roll: 0, up: [0, 1, 0], hits: 0 }
}

// in: { gas, brake, left, right, driftL, driftR, jump } · env: { ground(x, z, fromY) → { y, n:[x,y,z] } | null, sweep(from[3], delta[3]) → { delta[3], hit, n } }
// Ereignisse und Signale je Schritt – Namen und Wertebereiche wie der Vorlage-Deformer (KFB-Stunt-Car-Race @df1e35b5, KFB_Vehicle_Lab_v4/lab-v7/
// vehicle-cartoon-deformer.v2.js, Schema kfb.cartoon-vehicle-deformer/2), damit Deformer, Zwei-Rad (§55) und VFX 1:1 andocken, ohne die Fahrphysik
// anzufassen:
//   d.events: { type: 'railImpact', side (+1 = Wand rechts, −1 = links), strength 0…1, contact, frontal } · { type: 'landing', strength 0…1 } ·
//             { type: 'takeoff', vy, speed, jump? }
//   d.signals: { speed 0…1, longAccel −1…1 (+ Gas), lateral −1…1 (+ nach rechts), bank −1…1 (Querneigung des Bodens), drift −1…1 (+ nach rechts, E) }
export function stepK2t(d, inp, dt, env) {
  d.events.length = 0; const v0 = d.speed
  const steerIn = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), slow = !d.air && steerIn ? Math.max(0, 1 - Math.abs(d.speed) / TURN.below) : 0 // Wenden (KFB)
  // Längs (k2b wörtlich)
  if (inp.gas) d.speed += FLOW.accel * (slow ? Math.min(1, slow * TURN.ramp) : 1) * dt
  else if (inp.brake) d.speed -= (d.speed > 0 ? FLOW.brake : FLOW.reverseAccel) * dt
  else d.speed *= Math.pow(FLOW.drag, dt * 4)
  d.speed = clamp(d.speed, -FLOW.maxReverse, FLOW.maxForward)
  // Lenkung (k2b wörtlich; + = links); in der Luft keine Lenkung über die Räder
  const speedFactor = 1 / (1 + Math.abs(d.speed) * 0.048 / K)
  let yawRate = d.air ? 0 : -steerIn * FLOW.steerBase * Math.PI / 180 * speedFactor * 8.2 * (1 + TURN.yaw * slow)
  // Drift (k2b wörtlich, K3-Zeile): Q/E am Boden ab driftMinSpeed – Gierung verstärkt, Heck rutscht in Driftrichtung, danach kurz griffiger (regrip)
  const wantDrift = (inp.driftL ? -1 : 0) + (inp.driftR ? 1 : 0)
  if (wantDrift && !d.air && Math.abs(d.speed) > FEEL.driftMinSpeed) {
    if (!d.drift) d.driftDir = wantDrift; d.drift = Math.min(1, d.drift + dt * 3.4); d.regrip = FEEL.regripSeconds
    yawRate *= FEEL.driftSteerScale; yawRate += -d.driftDir * FEEL.driftYawGain * 0.42 * Math.min(1, Math.abs(d.speed) / (22 * K)) * d.drift
    const target = -d.driftDir * 7.5 * K * d.drift; d.latV += (target - d.latV) * Math.min(1, 9 * dt / 7.5)
  } else { d.drift = Math.max(0, d.drift - dt * 2.6); d.regrip = Math.max(0, d.regrip - dt) }
  d.yaw += yawRate * dt * (d.speed >= 0 ? 1 : -1)
  // Quer (k2b: Zentrifugal mit dt, gedämpft – im Drift weicher, beim Wiedergreifen härter; latV + = links)
  const damp = FLOW.lateralDamping * (d.drift > 0.05 ? FEEL.driftDampingScale : (d.regrip > 0 ? FEEL.regripDampingScale : 1))
  if (!d.air) { d.latV += -yawRate * d.speed * FLOW.centrifugalGain * dt; d.latV -= d.latV * Math.min(1, damp * dt); d.latV = clamp(d.latV, -11 * K, 11 * K) }
  const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), lx = fz, lz = -fx // vorn (+Z bei yaw 0), links
  let delta = [(fx * d.speed + lx * d.latV) * dt, 0, (fz * d.speed + lz * d.latV) * dt]
  // senkrecht: am Boden der Bodenhöhe folgen (Schwebe hoverBase), sonst Wurf mit flyGravity
  if (inp.jump && !d.air) { d.vy = FEEL.jumpImpulse; d.air = true; d.events.push({ type: 'takeoff', vy: d.vy, speed: Math.abs(d.speed), jump: true }) }
  if (d.air) { d.vy -= ASSIST.flyGravity * dt; delta[1] = d.vy * dt }
  // Wände: verschieben mit Shape-Cast; Prall wie k2b-Bande
  const sw = env.sweep([d.x, d.y, d.z], delta)
  if (sw.hit && sw.n && Math.abs(sw.n[1]) < 0.7) {
    const into = fx * sw.n[0] + fz * sw.n[2] // < 0: fährt auf die Wand zu
    // weich (sw.soft: Figur – FrizzleBob, GothGirl): Georg 16.10. „prallt extrem weit zurück“ → kleiner Rückstoß, kleiner Knet-Stoß, die Figur bleibt stehen
    const SOFT = sw.soft ? ASSIST.soft : null
    if (into < -0.2) { const e = clamp(Math.abs(d.speed) / (30 * K), 0.3, 1.2); d.squashV += ASSIST.squash * e * (SOFT ? SOFT.squash : 1) // Knet-Stoß (k2b: Bandenprall)
      d.events.push({ type: 'railImpact', side: lx * sw.n[0] + lz * sw.n[2] > 0 ? 1 : -1, strength: clamp((Math.abs(d.speed) * -into) / (30 * K), 0, 1) * (SOFT ? 0.5 : 1), contact: true, frontal: into < -0.7, soft: !!SOFT })
      d.speed = into < -0.7 ? -Math.abs(d.speed) * (SOFT ? SOFT.back : 0.35) : d.speed * (SOFT ? SOFT.keep : ASSIST.wallKeep) // streifend: k2b-Bande (Tempo bleibt), frontal: federnd zurück (Georg 16.10.: „von der Wand wegbouncen“)
      d.latV += Math.sign(lx * sw.n[0] + lz * sw.n[2]) * (FLOW.bounceBase + Math.abs(d.speed) * FLOW.bounceSpeed) * (SOFT ? SOFT.lat : 1); d.yaw += Math.sign(fx * sw.n[2] - fz * sw.n[0]) * 0.02; d.hits++ }
  }
  d.x += sw.delta[0]; d.z += sw.delta[2]; d.y += sw.delta[1]
  const g = env.ground(d.x, d.z, d.y + 1.5 * K)
  const want = g ? g.y + FEEL.hoverBase : -Infinity
  // Kuppe/Rampe: am Boden zählt die senkrechte Bodengeschwindigkeit (vyG); fällt der Boden schneller weg, als die Schwerkraft zieht, hebt das Auto
  // mit vyG ab – so springen Hügel wie Rampen (V-290)
  if (d.air) { if (d.y <= want && d.vy <= 0) { d.events.push({ type: 'landing', strength: clamp(-d.vy / (12 * K), 0, 1) }); d.squashV += 0.9 * clamp(-d.vy / (12 * K), 0.3, 1.4); d.y = want; d.vy = 0; d.air = false } } // Landung: Knet-Stoß (k2b flyStep)
  else if (!g || want < d.y + (d.vyG - ASSIST.flyGravity * dt) * dt - SLOPE.takeoffGap) { d.air = true; d.vy = d.vyG; d.events.push({ type: 'takeoff', vy: d.vy, speed: Math.abs(d.speed) }) }
  else { d.vyG = Math.min(12 * K, Math.max(-15 * K, (want - d.y) / dt)); d.y = want } // begrenzt: eine Stufe (Bordkante) ist kein Katapult
  // Sicherung (Georg 16.10.: „fällt endlos“): nie unter dem Gelände-Höhenfeld – darunter sofort auf die Fläche, Fall beendet
  if (g?.floor != null && d.y < g.floor - 0.05 * K) { d.y = g.floor; if (d.vy < 0) d.vy = 0; d.air = false; d.rescues = (d.rescues || 0) + 1 }
  if (g && !d.air) {
    d.up = g.n
    // Hangabtrieb: waagrechter Anteil der Bodennormale zeigt bergab; längs → Tempo, quer → Rutschen
    d.speed += SLOPE.g * (fx * g.n[0] + fz * g.n[2]) * dt; d.latV += SLOPE.g * SLOPE.lateral * (lx * g.n[0] + lz * g.n[2]) * dt
    if (!inp.gas && !inp.brake && Math.abs(d.speed) < SLOPE.stopBelow && g.n[1] > SLOPE.flatNy) { d.speed = 0; d.latV *= 0.5 }
  }
  // Signale für Deformer/VFX (Vorlage-Wertebereiche)
  { const S = d.signals, up = d.up; S.speed = clamp(Math.abs(d.speed) / FLOW.maxForward, 0, 1); S.longAccel = clamp((d.speed - v0) / dt / FLOW.accel, -1, 1)
    S.lateral = clamp(-d.latV / (11 * K), -1, 1); S.bank = clamp(-(lx * up[0] + lz * up[2]), -1, 1); S.drift = d.driftDir * d.drift }
  // Knet-Feder (k2b wörtlich)
  d.squashV += (-d.squash * 180 - d.squashV * 9) * dt; d.squash += d.squashV * dt
  // Lage (k2b wörtlich): Nicken bei Gas/Bremse, Rollen aus der Querbewegung
  d.pitch += ((inp.gas ? -1 : inp.brake ? 1 : 0) * Math.abs(d.speed) * FEEL.accelPitchGain * 0.55 - d.pitch) * Math.min(1, dt * 6)
  d.roll += (-d.latV * FEEL.lateralRollGain * 6 - d.roll) * Math.min(1, dt * 5)
  return d
}
