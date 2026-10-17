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
  boostAccelScale: 1.55, boostMaxForward: 48.5 * K, boostPitchBias: 0.035, // k2b-Boost (M3, Shift)
  accelPitchGain: 0.0075 / K, lateralRollGain: 0.0028 / K, hoverBase: 0.045 * K, jumpImpulse: 7.8 * JUMP_K, jumpGravity: 19.0 * GK }
export const ASSIST = { wallReflect: 0.4, wallKeep: 0.995, flyGravity: 13.3 * GK, squash: 1, soft: { back: 0.08, keep: 0.6, lat: 0.25, squash: 0.5 } } // soft = Figuren (KFB-Zusatz)
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
// M3 Stufe B (V-379, neu gebaut – die Spender setzen erst nach dem Umkippen zurück): Lage des Wagens getrennt von der Bodennormale der Physik.
// Am Boden folgt die Lage der Normale gedämpft (ground, 1/s; kein harter Schnapp an Rampenkanten), in der Luft richtet sie sich gedämpft (air) nach
// der Flugbahn: Nase × follow des Bahnwinkels, höchstens maxPitch, Rollen → 0. So bleibt nach einer Kicker-Rampe die Nase nicht steil oben stehen
// und der Wagen landet nie auf Dach oder Seite (K2B ist kinematisch: Überschlag gibt es nur in der Darstellung, und die ist hiermit begrenzt).
// M3 Stufe C (V-379) Landehilfe in Fahrtrichtung. Spender k2b ASSIST flySteer 0,35 (Lenken in der Luft dreht die Flugrichtung), Handover v1_41
// (nach der Landung nur die Normalbewegung begrenzen, Tangentialfahrt bleibt), Landungs-Squash vN/12; WS1-Werte (begründet im Status): Grip-Fenster
// grip s lang – Querrutschen gedämpft (gripDamp 1/s), Gierung dreht zur Bewegungsrichtung (align 1/s, ≤ 10° nach 0,3 s); harter Aufprall (vN über
// bounceVN): kleiner Hüpfer bounce × vN statt Spin-Out. Lande-Boost (V-379 Entscheid 2): boostT s mit Schub × FEEL.boostAccelScale bei Gas, boostOn.
// Schalter Fahrhilfe M3 (Vergleich „M3-Assist | vorher“, Georgs Fühlprobe): aus = Stand M2 (Lage schnappt/steht, keine Landehilfe, kein Anti-Steckenbleiben)
export const ASSIST_M3 = { on: true }
export const LAND = { flySteer: 0.35, grip: 0.3, gripDamp: 14, align: 12, bounceVN: 13 * K, bounce: 0.18, boostT: 0.45, boostOn: true }
// M3 Stufe D (V-379) Anti-Steckenbleiben. Spender: K2B rescue (flyMax 8 s), Reverse-Assist (drive-intent), P2 recover; X/Y/Z setzt WS1:
// „klemmt“ siehe unten (X = minProgress m in Y = window s, Z = Versuche). T1: Rück-Nudge (nudge m/s gegen die Fahrtrichtung über nudgeS s, Drehung
// yawNudge weg von der Wand); T2 = Lage-Aufrichten (Stufe B, immer an); T3 nach tries vergeblichen T1 binnen windowS:
// weicher Respawn am letzten sicheren Punkt (≥ safeAge s alt, frei gefahren) in Fahrtrichtung – mit Hüpfer (dropH m), kein harter Schnitt
// (V-379 Entscheid 3); Ereignis respawn für Puff-VFX. Luft länger als flyMax s (k2b) → ebenso T3.
export const STUCK = { window: 0.7, minProgress: 1 * K, nudge: 5 * K, nudgeS: [0.6, 1.0], yawNudge: 0.9, tries: 3, windowS: 4, safeAge: 1.2, safeEvery: 0.25, dropH: 1.2 * K, flyMax: 8 }
// M3 Stufe F (V-379) Zonen, P2-Zustände free/capture/commit/release (Stunt-Repo _inbox/KFB_P2_GUIDED_DRIVING_v0_1 assist-profile „chill“).
// Rampen-Zone (env.zone): weich einfangen (Querkraft lateralK·e, Gier yawK zur Spur, Tempo-Fenster), stabiler commit, Abbruch per Lenkung
// (> abortSteer für abortHold s, Tastatur = voller Einschlag), Launch-Zusatzimpuls launchVy an der Lippe. Kräfte der 2D-Simulation × FS (m/s²).
// „Pull“ = Neugier, kein Sog: außerhalb der Zone wirkt nichts. Tempi × K (P2 rechnete in alten KFB-Metern).
export const PUSH = { capture: { lateralK: 0.65, yawK: 0.75, maxForce: 0.95, maxYaw: 0.72, speedMin: 7 * K, speedMax: 27 * K }, commit: { lateralK: 1.05, yawK: 1.15, maxForce: 1.35, maxYaw: 1.05, speedMin: 10 * K, speedMax: 26 * K },
  abortHold: 0.32, FS: 4, launchVy: 2.2 * K }
// Wandfahrt (V-379 Entscheid 1): nur bei Kontakt mit markierter Fläche (sweep.ride), flach (|Anlauf| < maxInto) und schnell genug. Dann Zwei-Rad an der
// Wand (lab-v7 vehicle-twowheel.v1.js wallride: holdMs 1400, Kippwinkel = Umfallwinkel + (90° − Umfallwinkel) × WALL_LEAN 0,45 – M2Car setzt leanRad aus
// dem Wagen), Gierung parallel zur Wand, leichter Zug zur Wand; Freigabe nach hold, bei Wandende (contactLoss s ohne Kontakt) oder Weglenken (abortHold s).
// Eingefangen wird an der Vorderecke; parallel steht die Seite noch bis ≈ 0,8 m von der Wand (Sonde probe-ride 17.10.) – deshalb pullIn bis zur ersten
// Seitenberührung und grace s Kulanz, bevor „Wandende“ zählt.
export const RIDE = { speedMin: 8 * K, maxInto: 0.55, holdS: 1.4, leanRad: 1.2, rise: 0.25, fall: 0.8, minRate: 1.2, contactLoss: 0.25, grace: 0.5, abortHold: 0.32, pull: 1.5 * K, pullIn: 4 * K }
// M3 Stufe G (V-379, optional, Präsentation): Tricks ohne eigenen Stunt-Modus, Physik fährt unverändert weiter (Lenkung bleibt aktiv).
// Fassrolle = im Sprung Leertaste erneut + A/D ab minSpeed: Ereignis trick/tumble (Darstellung: lab-v7 vehicle-tumble.v1.js, landet auf
// ganzen Umdrehungen = immer auf den Rädern); Zwei-Rad frei = X + A/D ab minSpeed: holdS auf zwei Rädern knapp unter dem Umfallwinkel
// (vehicle-twowheel.v1.js variant free: TIP_SAFETY 0,92, M2Car setzt freeLeanRad); danach Schlingern als Erholung (vehicle-fishtail.v1.js).
export const TRICK = { minSpeed: 6 * K, lockS: 2.2, holdS: 1.4, freeLeanRad: 0.8, airMin: 0.15 }
export const ATT = { ground: 14, air: 2.5, follow: 0.5, maxPitch: (25 * Math.PI) / 180 }
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const fx0 = (d) => Math.sin(d.yaw), fz0 = (d) => Math.cos(d.yaw)

export function createK2t(x, y, z, yaw) {
  return { x, y, z, yaw, speed: 0, latV: 0, drift: 0, driftDir: 0, regrip: 0, vy: 0, vyG: 0, squash: 0, squashV: 0, events: [], signals: { speed: 0, longAccel: 0, lateral: 0, bank: 0, drift: 0 }, air: false, pitch: 0, roll: 0, up: [0, 1, 0], hits: 0 }
}

// in: { gas, brake, left, right, driftL, driftR, boost, jump } · env: { ground(x, z, fromY) → { y, n:[x,y,z] } | null, sweep(from[3], delta[3]) → { delta[3], hit, n } }
// Ereignisse und Signale je Schritt – Namen und Wertebereiche wie der Vorlage-Deformer (KFB-Stunt-Car-Race @df1e35b5, KFB_Vehicle_Lab_v4/lab-v7/
// vehicle-cartoon-deformer.v2.js, Schema kfb.cartoon-vehicle-deformer/2), damit Deformer, Zwei-Rad (§55) und VFX 1:1 andocken, ohne die Fahrphysik
// anzufassen:
//   d.events: { type: 'railImpact', side (+1 = Wand rechts, −1 = links), strength 0…1, contact, frontal } · { type: 'landing', strength 0…1 } ·
//             { type: 'takeoff', vy, speed, jump? }
//   d.signals: { speed 0…1, longAccel −1…1 (+ Gas), lateral −1…1 (+ nach rechts), bank −1…1 (Querneigung des Bodens), drift −1…1 (+ nach rechts, E) }
export function stepK2t(d, inp, dt, env) {
  d.events.length = 0; const v0 = d.speed, yaw0 = d.yaw
  const steerIn = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), slow = !d.air && steerIn ? Math.max(0, 1 - Math.abs(d.speed) / TURN.below) : 0 // Wenden (KFB)
  // Längs (k2b wörtlich)
  d.landBoostT = Math.max(0, (d.landBoostT || 0) - dt); d.gripT = Math.max(0, (d.gripT || 0) - dt)
  d.boosting = (!!inp.boost || d.landBoostT > 0) && d.speed > 4 * K // Boost (k2b wörtlich: Shift, ab 4 m/s, mehr Schub und höheres Höchsttempo)
  const maxF = d.boosting ? FEEL.boostMaxForward : FLOW.maxForward, acc = FLOW.accel * (d.boosting ? FEEL.boostAccelScale : 1)
  // über dem Höchsttempo (Boost losgelassen) gleitend zurück statt Sprung (KFB-Zusatz; k2b schneidet hart ab)
  if (d.speed > maxF && !inp.brake) d.speed = Math.max(maxF, d.speed - FLOW.accel * dt)
  else if (inp.gas) d.speed = Math.min(maxF, d.speed + acc * (slow ? Math.min(1, slow * TURN.ramp) : 1) * dt)
  else if (inp.brake) d.speed -= (d.speed > 0 ? FLOW.brake : FLOW.reverseAccel) * dt
  else d.speed *= Math.pow(FLOW.drag, dt * 4)
  d.speed = Math.max(-FLOW.maxReverse, d.speed)
  // Lenkung (k2b wörtlich; + = links); in der Luft keine Lenkung über die Räder
  const speedFactor = 1 / (1 + Math.abs(d.speed) * 0.048 / K)
  const A3 = ASSIST_M3.on
  let yawRate = d.air ? (A3 ? steerIn * LAND.flySteer : 0) : -steerIn * FLOW.steerBase * Math.PI / 180 * speedFactor * 8.2 * (1 + TURN.yaw * slow) // Luft: k2b flySteer
  // Drift (k2b wörtlich, K3-Zeile): Q/E am Boden ab driftMinSpeed – Gierung verstärkt, Heck rutscht in Driftrichtung, danach kurz griffiger (regrip)
  const wantDrift = (inp.driftL ? -1 : 0) + (inp.driftR ? 1 : 0)
  if (wantDrift && !d.air && Math.abs(d.speed) > FEEL.driftMinSpeed) {
    if (!d.drift) d.driftDir = wantDrift; d.drift = Math.min(1, d.drift + dt * 3.4); d.regrip = FEEL.regripSeconds
    yawRate *= FEEL.driftSteerScale; yawRate += -d.driftDir * FEEL.driftYawGain * 0.42 * Math.min(1, Math.abs(d.speed) / (22 * K)) * d.drift
    const target = -d.driftDir * 7.5 * K * d.drift; d.latV += (target - d.latV) * Math.min(1, 9 * dt / 7.5)
  } else { d.drift = Math.max(0, d.drift - dt * 2.6); d.regrip = Math.max(0, d.regrip - dt) }
  d.yaw += yawRate * dt * (d.speed >= 0 ? 1 : -1)
  // Rampen-Zone (Stufe F)
  { const z = A3 && !d.air && env.zone ? env.zone(d.x, d.z) : null, Zs = d.zone || (d.zone = { id: null, abortT: 0, aborted: false, seg: null })
    if (!z || z.id !== Zs.id) { Zs.id = z?.id ?? null; Zs.abortT = 0; Zs.aborted = false }
    Zs.seg = z && !Zs.aborted ? z.seg : null
    if (z && !Zs.aborted) { Zs.abortT = steerIn && z.seg === 'capture' ? Zs.abortT + dt : Math.max(0, Zs.abortT - 2 * dt); if (Zs.abortT >= PUSH.abortHold) { Zs.aborted = true; d.events.push({ type: 'zone', phase: 'abort', id: z.id }) } }
    if (Zs.seg) { const P = PUSH[Zs.seg], err = Math.atan2(Math.sin(d.yaw - z.dir), Math.cos(d.yaw - z.dir)), want = clamp(-(z.e / K) * 0.24, -0.7, 0.7)
      d.yaw += clamp(P.yawK * (want - err), -P.maxYaw, P.maxYaw) * dt
      d.latV += clamp(-P.lateralK * (z.e / K) * PUSH.FS, -P.maxForce * PUSH.FS, P.maxForce * PUSH.FS) * K * dt
      if (d.speed < P.speedMin && inp.gas) d.speed += clamp((P.speedMin - d.speed) * 1.5, 0, 4.2 * K) * dt
      else if (d.speed > P.speedMax && !d.boosting) d.speed -= clamp((d.speed - P.speedMax) * 1.25, 0, 5.5 * K) * dt } }
  // Wandfahrt (Stufe F): Gierung parallel zur Wand, Zug zur Wand, Freigabe
  if (d.ride) { const R = d.ride, n = R.n; let tx = -n[2], tz = n[0]; if (tx * fx0(d) + tz * fz0(d) < 0) { tx = -tx; tz = -tz }
    const want = Math.atan2(tx, tz), e = Math.atan2(Math.sin(want - d.yaw), Math.cos(want - d.yaw)); d.yaw += e * Math.min(1, 10 * dt); R.aligned = Math.abs(e) < 0.08; d.latV = -R.side * (R.touched ? RIDE.pull : RIDE.pullIn) // bis zur ersten Seitenberührung kräftiger
    R.t += dt; R.contactT += dt; R.abortT = steerIn === R.side ? R.abortT + dt : 0
    const why = R.t >= RIDE.holdS ? 'hold' : R.contactT > RIDE.contactLoss ? 'end' : R.abortT >= RIDE.abortHold ? 'abort' : d.air ? 'air' : null
    if (why) { d.events.push({ type: 'twoWheel', phase: 'release', why, t: +R.t.toFixed(2) }); d.rideLast = { why, t: R.t }; d.ride = null } }
  if (d.freeTip) { d.freeTip.t += dt; if (d.freeTip.t >= TRICK.holdS || d.air || d.ride) { d.events.push({ type: 'trick', kind: 'recover', side: d.freeTip.side }); d.freeTip = null } }
  { const tgt = d.ride ? -d.ride.side * RIDE.leanRad : d.freeTip ? -d.freeTip.side * TRICK.freeLeanRad : 0, // Vorzeichen: wandseitige Räder heben ab (Drehung um die wandferne Aufstandslinie)
    rate = Math.abs(tgt) > Math.abs(d.lean || 0) ? 1 / RIDE.rise : 1 / RIDE.fall, l0 = d.lean || 0, gap = tgt - l0
    // gedämpft, aber mit Mindesttempo minRate (rad/s): sonst läuft das Zurückkippen exponentiell aus (m3-g 17.10.: 1,3 s nach der Freigabe noch 9°)
    let stp = gap * Math.min(1, rate * dt); if (Math.abs(stp) < RIDE.minRate * dt) stp = Math.sign(gap) * Math.min(Math.abs(gap), RIDE.minRate * dt); d.lean = l0 + stp }
  // Quer (k2b: Zentrifugal mit dt, gedämpft – im Drift weicher, beim Wiedergreifen härter; latV + = links)
  const damp = FLOW.lateralDamping * (d.drift > 0.05 ? FEEL.driftDampingScale : (d.regrip > 0 ? FEEL.regripDampingScale : 1))
  if (!d.air) { d.latV += -yawRate * d.speed * FLOW.centrifugalGain * dt; d.latV -= d.latV * Math.min(1, damp * dt); d.latV = clamp(d.latV, -11 * K, 11 * K) }
  // Grip-Fenster nach der Landung (Stufe C): Querrutschen weg, Nase gedämpft zur Bewegungsrichtung (Rest-Querrutschen latV gegen Tempo)
  if (!d.air && d.gripT > 0 && Math.abs(d.speed) > 1 * K) { const err = Math.atan2(d.latV, Math.abs(d.speed)), k = Math.min(1, LAND.align * dt)
    d.yaw += err * k * Math.sign(d.speed); d.latV -= Math.abs(d.speed) * Math.tan(err * k) // Rahmen dreht mit, Bewegung bleibt
    d.latV *= Math.max(0, 1 - LAND.gripDamp * dt) }
  const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), lx = fz, lz = -fx // vorn (+Z bei yaw 0), links
  let delta = [(fx * d.speed + lx * d.latV) * dt, 0, (fz * d.speed + lz * d.latV) * dt]
  // senkrecht: am Boden der Bodenhöhe folgen (Schwebe hoverBase), sonst Wurf mit flyGravity
  // Tricks (Stufe G): Sperre, solange einer läuft; Fassrolle ersetzt den Sprung, Zwei-Rad frei über X
  d.trickT = Math.max(0, (d.trickT || 0) - dt)
  const trickSide = (inp.right ? 1 : 0) - (inp.left ? 1 : 0)
  const jumpEdge = !!inp.jump && !d.jumpHeld; d.jumpHeld = !!inp.jump; d.airT = d.air ? (d.airT || 0) + dt : 0
  // Fassrolle in der Luft (Leertaste erneut + A/D, frühestens airMin s nach dem Abheben); Zwei-Rad frei am Boden (X + A/D). Der normale Sprung bleibt.
  if (A3 && !d.ride && !d.trickT && trickSide && Math.abs(d.speed) >= TRICK.minSpeed && ((d.air && jumpEdge && d.airT >= TRICK.airMin) || (!d.air && inp.tip))) {
    d.trickT = TRICK.lockS; d.tricks = (d.tricks || 0) + 1
    if (d.air) d.events.push({ type: 'trick', kind: 'tumble', side: trickSide, speed: clamp(Math.abs(d.speed) / FLOW.maxForward, 0, 1) })
    else { d.freeTip = { side: trickSide, t: 0 }; /* nach rechts gelenkt: die rechten (inneren) Räder heben ab */ d.events.push({ type: 'trick', kind: 'twoWheel', side: trickSide }) } }
  if (inp.jump && !d.air) { d.vy = FEEL.jumpImpulse; d.air = true; d.events.push({ type: 'takeoff', vy: d.vy, speed: Math.abs(d.speed), jump: true }) }
  if (d.air) { d.vy -= ASSIST.flyGravity * dt; delta[1] = d.vy * dt }
  // Wände: verschieben mit Shape-Cast; Prall wie k2b-Bande
  // Drehung ohne Durchschwenken (m3-a 17.10.: 2/50 Anfahrten an ecke-2 durch die Wand – die Gierung dreht den Kasten ohne Sweep, eine Ecke schwenkte
  // in die Wand, danach griff der Shape-Cast nicht mehr): steckt der Wagen nach der Drehung in einem Hindernis, vorher aber nicht, gilt die Drehung nicht
  if (d.yaw !== yaw0 && env.blocked && env.blocked(d.x, d.y, d.z, d.yaw) && !env.blocked(d.x, d.y, d.z, yaw0)) { d.yaw = yaw0; d.turnBlocked = (d.turnBlocked || 0) + 1 }
  const sw = env.sweep([d.x, d.y, d.z], delta)
  const wallN = sw.hit ? sw.n : null
  // Wandfahrt: Kontakt hält, kein Prall. Seitenberührung zählt erst, wenn der Wagen parallel steht (beim Ausrichten streift noch die Vorderecke)
  if (sw.hit && sw.n && Math.abs(sw.n[1]) < 0.7 && sw.ride && d.ride) { d.ride.contactT = Math.min(d.ride.contactT, 0); if (d.ride.aligned) d.ride.touched = true }
  else if (sw.hit && sw.n && Math.abs(sw.n[1]) < 0.7 && sw.ride && A3 && !d.air && Math.abs(d.speed) >= RIDE.speedMin && Math.abs(fx * sw.n[0] + fz * sw.n[2]) < RIDE.maxInto) {
    const side = lx * sw.n[0] + lz * sw.n[2] > 0 ? 1 : -1; d.ride = { side, n: [sw.n[0], sw.n[1], sw.n[2]], t: 0, contactT: -RIDE.grace, abortT: 0, touched: false }; d.rides = (d.rides || 0) + 1
    d.events.push({ type: 'twoWheel', phase: 'capture', side }) }
  else if (sw.hit && sw.n && Math.abs(sw.n[1]) < 0.7) {
    const into = fx * sw.n[0] + fz * sw.n[2] // < 0: fährt auf die Wand zu
    // weich (sw.soft: Figur – FrizzleBob, GothGirl): Georg 16.10. „prallt extrem weit zurück“ → kleiner Rückstoß, kleiner Knet-Stoß, die Figur bleibt stehen
    const SOFT = sw.soft ? ASSIST.soft : null
    if (into < -0.2) { const e = clamp(Math.abs(d.speed) / (30 * K), 0.3, 1.2); d.squashV += ASSIST.squash * e * (SOFT ? SOFT.squash : 1) // Knet-Stoß (k2b: Bandenprall)
      d.events.push({ type: 'railImpact', side: lx * sw.n[0] + lz * sw.n[2] > 0 ? 1 : -1, strength: clamp((Math.abs(d.speed) * -into) / (30 * K), 0, 1) * (SOFT ? 0.5 : 1), contact: true, frontal: into < -0.7, soft: !!SOFT, speed: Math.abs(d.speed), normal: [sw.n[0], sw.n[1], sw.n[2]] }) // WALL_IMPACT {speed, normal} (V-379 E)
      d.speed = into < -0.7 ? -Math.abs(d.speed) * (SOFT ? SOFT.back : A3 ? ASSIST.wallReflect : 0.35) : d.speed * (SOFT ? SOFT.keep : ASSIST.wallKeep) // streifend: k2b-Bande (Tempo bleibt), frontal: federnd zurück (Georg 16.10.: „von der Wand wegbouncen“)
      d.latV += Math.sign(lx * sw.n[0] + lz * sw.n[2]) * (FLOW.bounceBase + Math.abs(d.speed) * FLOW.bounceSpeed) * (SOFT ? SOFT.lat : 1); d.yaw += Math.sign(fx * sw.n[2] - fz * sw.n[0]) * 0.02; d.hits++ }
  }
  d.x += sw.delta[0]; d.z += sw.delta[2]; d.y += sw.delta[1]
  const g = env.ground(d.x, d.z, d.y + 1.5 * K)
  const want = g ? g.y + FEEL.hoverBase : -Infinity
  // Kuppe/Rampe: am Boden zählt die senkrechte Bodengeschwindigkeit (vyG); fällt der Boden schneller weg, als die Schwerkraft zieht, hebt das Auto
  // mit vyG ab – so springen Hügel wie Rampen (V-290)
  if (d.air) { if (d.y <= want && d.vy <= 0) { const vN = -d.vy; d.events.push({ type: 'landing', strength: clamp(vN / (12 * K), 0, 1) }); d.squashV += 0.9 * clamp(vN / (12 * K), 0.3, 1.4); d.y = want // Landung: Knet-Stoß (k2b flyStep)
      if (A3 && vN > LAND.bounceVN) d.vy = vN * LAND.bounce // zu harter Aufprall: kleiner Hüpfer, Lage richtet sich in der Luft weiter auf (Stufe B)
      else { d.vy = 0; d.air = false; if (A3) { d.gripT = LAND.grip; if (LAND.boostOn) d.landBoostT = LAND.boostT } } } }
  else if (!g || want < d.y + (d.vyG - ASSIST.flyGravity * dt) * dt - SLOPE.takeoffGap) { d.air = true; d.vy = d.vyG + (d.zone?.seg === 'commit' ? PUSH.launchVy : 0); if (d.zone?.seg === 'commit') { d.events.push({ type: 'launch', id: d.zone.id }); d.launches = (d.launches || 0) + 1 } d.events.push({ type: 'takeoff', vy: d.vy, speed: Math.abs(d.speed) }) }
  // Steigtempo des Bodens nach oben höchstens aus dem Fahrtempo (Rampe bis ≈ 35°) – eine Stufe unter dem stehenden Wagen ist kein Katapult
  // (m3-a 17.10.: knapp unter der Fahrhöhe abgesetzt → 7,8 m/s Abhub → Wagen landete auf einem 3-m-Dach)
  else { d.vyG = Math.min(12 * K, Math.abs(d.speed) * 0.7 + 1 * K, Math.max(-15 * K, (want - d.y) / dt)); d.y = want } // begrenzt: eine Stufe (Bordkante) ist kein Katapult
  // Sicherung (Georg 16.10.: „fällt endlos“): nie unter dem Gelände-Höhenfeld – darunter sofort auf die Fläche, Fall beendet
  if (g?.floor != null && d.y < g.floor - 0.05 * K) { d.y = g.floor; if (d.vy < 0) d.vy = 0; d.air = false; d.rescues = (d.rescues || 0) + 1 }
  { let t = g && !d.air ? g.n : null, rate = ATT.ground
    if (!A3) { if (t) rate = 1e6; else t = d.up } // Stand M2: am Boden Schnapp, in der Luft fest
    if (!t) { const vh = Math.max(Math.abs(d.speed), 1 * K), p = clamp(Math.atan2(d.vy, vh) * ATT.follow, -ATT.maxPitch, ATT.maxPitch), c = Math.cos(p), s = Math.sin(p)
      t = [-fx * s, c, -fz * s]; rate = ATT.air } // oben ⟂ Nase (fx·c, s, fz·c)
    const k = Math.min(1, rate * dt), u = [d.up[0] + (t[0] - d.up[0]) * k, d.up[1] + (t[1] - d.up[1]) * k, d.up[2] + (t[2] - d.up[2]) * k], l = Math.hypot(...u) || 1
    d.up = [u[0] / l, u[1] / l, u[2] / l] }
  if (g && !d.air) {
    // Hangabtrieb: waagrechter Anteil der Bodennormale zeigt bergab; längs → Tempo, quer → Rutschen
    d.speed += SLOPE.g * (fx * g.n[0] + fz * g.n[2]) * dt; d.latV += SLOPE.g * SLOPE.lateral * (lx * g.n[0] + lz * g.n[2]) * dt
    if (!inp.gas && !inp.brake && Math.abs(d.speed) < SLOPE.stopBelow && g.n[1] > SLOPE.flatNy) { d.speed = 0; d.latV *= 0.5 }
  }
  // Anti-Steckenbleiben (Stufe D). „klemmt“ = mit Gas/Bremse in window s weniger als minProgress m vorangekommen (auch Pendeln in der Ecke:
  // m3-d 17.10. – Prall und Rückprall ergaben nie ein Dauer-Klemmen). T1 = Rück-Nudge über nudgeS[n] s mit gleichmäßiger Drehung weg von der Wand
  // (jede Teildrehung durch env.blocked geprüft); nach tries Versuchen binnen windowS → T3.
  { const U = STUCK, St = d.stuck || (d.stuck = { tries: [], safe: [], safeT: 0, clock: 0, airT: 0, hist: [], nudge: null }); St.clock += dt
    const pushing = (inp.gas || inp.brake) && !d.air, win = Math.round(U.window / dt)
    St.airT = d.air ? St.airT + dt : 0
    if (!d.air && !St.nudge && Math.abs(d.speed) > 3 * K && (St.safeT += dt) >= U.safeEvery) { St.safeT = 0; St.safe.push({ x: d.x, y: d.y, z: d.z, yaw: d.yaw, t: St.clock }); if (St.safe.length > 40) St.safe.shift() }
    St.tries = St.tries.filter((t) => St.clock - t < U.windowS)
    if (pushing && !St.nudge) { St.hist.push([d.x, d.z]); if (St.hist.length > win) St.hist.shift() } else if (!St.nudge) St.hist.length = 0
    const respawn = () => { const p = [...St.safe].reverse().find((q) => St.clock - q.t >= U.safeAge) || St.safe[0] || env.home?.(); if (!p) return // ohne sicheren Punkt: Startplatz
      d.events.push({ type: 'respawn', from: [d.x, d.y, d.z], to: [p.x, p.y, p.z] }); d.x = p.x; d.z = p.z; d.y = p.y + U.dropH; d.vy = 0; d.air = true; d.yaw = p.yaw; d.speed = 0; d.latV = 0
      d.squashV += 0.6; St.tries = []; St.hist = []; St.nudge = null; St.safe = St.safe.filter((q) => q !== p); d.rescues = (d.rescues || 0) + 1; d.t3 = (d.t3 || 0) + 1 }
    if (!A3) { St.hist.length = 0; St.nudge = null }
    else if (St.airT > U.flyMax) respawn()
    else if (St.nudge) { const N = St.nudge; N.t -= dt; d.speed = -N.dir * U.nudge; d.latV *= 0.5; d.yaw += (N.turn / N.T) * dt; if (N.t <= 0) { St.nudge = null; St.hist = [] } }
    else if (St.hist.length >= win && Math.hypot(d.x - St.hist[0][0], d.z - St.hist[0][1]) < U.minProgress) {
      St.tries.push(St.clock); d.t1 = (d.t1 || 0) + 1; St.hist = []
      if (St.tries.length >= U.tries) respawn()
      else { const dir = inp.gas ? 1 : -1, side = wallN ? Math.sign(lx * wallN[0] + lz * wallN[2]) || (St.tries.length % 2 ? 1 : -1) : (St.tries.length % 2 ? 1 : -1), T = U.nudgeS[Math.min(U.nudgeS.length - 1, St.tries.length - 1)]
        St.nudge = { t: T, T, dir, turn: side * U.yawNudge * dir }; d.events.push({ type: 'nudge', tier: 1 }) } } }
  // Signale für Deformer/VFX (Vorlage-Wertebereiche)
  { const S = d.signals, up = d.up; S.speed = clamp(Math.abs(d.speed) / FLOW.maxForward, 0, 1); S.longAccel = clamp((d.speed - v0) / dt / FLOW.accel, -1, 1)
    S.lateral = clamp(-d.latV / (11 * K), -1, 1); S.bank = clamp(-(lx * up[0] + lz * up[2]), -1, 1); S.drift = d.driftDir * d.drift }
  // Knet-Feder (k2b wörtlich)
  d.squashV += (-d.squash * 180 - d.squashV * 9) * dt; d.squash += d.squashV * dt
  // Lage (k2b wörtlich): Nicken bei Gas/Bremse, Rollen aus der Querbewegung
  d.pitch += ((inp.gas ? -1 : inp.brake ? 1 : 0) * Math.abs(d.speed) * FEEL.accelPitchGain * 0.55 + (d.boosting ? -FEEL.boostPitchBias : 0) - d.pitch) * Math.min(1, dt * 6)
  d.roll += (-d.latV * FEEL.lateralRollGain * 6 - d.roll) * Math.min(1, dt * 5)
  return d
}

// Lage der Darstellung in Grad (Tests Stufe B): Nase über der Waagrechten (+ = oben) und Rollen, aus d.up, Gierung und den Lage-Zusätzen (pitch/roll)
export function attitude(d) {
  const u = d.up, l = Math.hypot(u[0], u[1], u[2]) || 1, ux = u[0] / l, uy = u[1] / l, uz = u[2] / l
  const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), fd = fx * ux + fz * uz, nx = fx - fd * ux, ny = -fd * uy, nz = fz - fd * uz, nl = Math.hypot(nx, ny, nz) || 1
  const rx = uy * nz / nl - uz * ny / nl, ry = uz * nx / nl - ux * nz / nl, rz = ux * ny / nl - uy * nx / nl // rechts = oben × vorn
  const D = 180 / Math.PI
  return { pitchDeg: Math.asin(clamp(ny / nl, -1, 1)) * D - d.pitch * D, rollDeg: Math.asin(clamp(ry, -1, 1)) * D + d.roll * D, upY: uy }
}
