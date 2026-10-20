// Elan S1 · Schwungflug („Skyriding“) als reine Logik (research/DRAGONRIDING_RESEARCH_R1.md §6.2–§6.10). Kein React, kein Rapier, kein DOM:
// elanStep(state, input, dt, env) → state. env liefert Bodenhöhe und Kollisions-Sweep; die Figur (M1Player) setzt danach nur noch die Lage.
//   Tempo   a = −g·sin θ·D·Ausblendung − c1·s − c2·max(0, s − sDive)²   (θ = Bahnneigung; Sturz steiler als θDive: D = kDive;
//           Schwerkraft trägt nur bis sDive, darüber nur Fähigkeiten)
//   Bahn    folgt der Nase: v_dir ← slerp(v_dir, nose, 1 − exp(−kAlign·L·dt)), L = clamp(s / sStall) – beim Hochziehen bleibt erst das Tempo
//   Abriss  unter sStall: v.y −= g·(1 − L)·dt, Nase sinkt Richtung −10°, Sinkrate ≤ vSinkMax (Fallschirm)
//   Wenden  ω_max(s) = lerp(ωLow, ωHigh, s / sDive); Schräglage φ = atan(s·ω / g) (nur Darstellung, ±60°)
//   Fähig.  Leertaste = Steigen (1 Ladung) · Shift = Schub (1 Ladung) · Leertaste, dann A/D binnen 150 ms = Fassrolle (Abklingzeit 6 s);
//           wer A/D schon hält, bekommt Steigen (Fenster zählt nur ein neues Drücken)
//   Laden   Boden 3 s · Luft 8 s · Thrill (s ≥ sThrill seit ≥ 0,5 s) 4 s · bodennah (h < 4 m, s ≥ 20 m/s) zusätzlich 1 je 6 s; nie schlechter als Luft
// Startwerte §6.2 in J17-Metern (× J für wscale=legacy); WS0/Georg tunen in der Fühlprobe.
export const ELAN = Object.freeze({
  sStall: 12, sThrill: 40, sDive: 60, sBoostMax: 85, thetaDive: (40 * Math.PI) / 180, kDive: 1.25, c1: 0.06, c2: 0.02, kAlign: 4,
  wLow: 2.2, wHigh: 1.0, vSinkMax: 8, pitchRate: 1.6, pitchMax: (80 * Math.PI) / 180, autoLevel: 0.35, cruise: (-7 * Math.PI) / 180, stallNose: (-10 * Math.PI) / 180, bankMax: Math.PI / 3,
  charges: 6, ascentUp: 12, ascentFwd: 3, surge: 10, lockS: 0.6, rollS: 0.55, rollFwd: 12, rollSide: 4, rollCd: 6, rollWindow: 0.15,
  regenGround: 3, regenAir: 8, regenThrill: 4, thrillAfter: 0.5, skimH: 4, skimS: 20, regenSkim: 6,
})
// Elan S2 · Profil „racer“ (§6.5, WS1-Entscheid 18.10.): Dieselpunk-Schwebe-Racer. Rumpf gleitet schlechter (kAlign × 0,5, Sinkrate × 1,5), lebt vom
// Dauerschub (W, thrust m/s²) und dem Kesseldruck P (Shift halten = Boost: −drain/s; füllt sich mit fill/s, mit Thrill fillThrill/s, bodennah fillSkim/s;
// leer und weiter Boost = „Kessel kocht“ boilS s ohne Boost). S = Luftbremse. Ladungen nur für Steigen und Rolle (Shift ist Boost). Schwebefeder unter
// 3·h0 (ω, ζ), Bodeneffekt unter 1,5·h0 (c1 × groundDrag). Zurück zur Fahrt (K2B), sobald h < 1,2·h0 und vy ≤ 0 (Ereignis land).
export const RACER = Object.freeze({ kAlignK: 0.5, sinkK: 1.5, thrust: 3.0, airBrake: 10, boostAcc: 8, drain: 0.25, fill: 0.08, fillThrill: 0.15, fillSkim: 0.2,
  boilS: 1.5, h0: 0.45, hoverW: 6, hoverZeta: 0.7, groundDrag: 0.7, cruise: (-12 * Math.PI) / 180, landK: 1.2 })
const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const len = (v) => Math.hypot(v[0], v[1], v[2])

// J = Längenmaß (1 in J17-Metern), g = Fallbeschleunigung der Welt
export function createElan({ pos, yaw = 0, speed = 22, J = 1, g = 9.81, profile = 'figure', h0 = RACER.h0 } = {}) {
  const s = speed * J
  return { J, g, pos: [...pos], v: [Math.sin(yaw) * s, 0, Math.cos(yaw) * s], pitch: 0, yaw, bank: 0, charges: ELAN.charges, regen: 0, skimT: 0, thrillT: 0,
    lock: 0, rollT: 0, rollDir: 0, rollCd: 0, spaceT: -1, prevSteer: 0, kick: 0, kickV: 0, mode: 'GLIDE', grounded: false, events: [], hit: null,
    profile, h0: h0 * J, P: 1, boilT: 0, boosting: false, landed: false }
}
export const elanSpeed = (st) => len(st.v)
export const elanEnergy = (st) => 0.5 * len(st.v) ** 2 + st.g * st.pos[1]

// input: { noseUp, noseDown, left, right, space, shift, mousePitch? (rad, direkt), invert? } – space/shift als gehaltene Tasten (Kanten erkennt die Logik)
//        Racer zusätzlich: thrust (W, Dauerschub), airBrake (S), boost (Shift gehalten) – noseUp/noseDown dort über Pfeiltasten
// env:   { ground(x, z) → y, sweep(from[3], delta[3]) → { delta[3], hit, n } }
export function elanStep(st, inp, dt, env, opt = {}) {
  const E = ELAN, J = st.J, g = st.g, ab = opt.abilities !== false, R = st.profile === 'racer'
  st.events.length = 0; st.hit = null
  const hNow = env?.ground ? st.pos[1] - env.ground(st.pos[0], st.pos[2]) : Infinity
  let s = len(st.v)
  // Neigung (Tastatur mit Rate, ohne Eingabe sanft zum Gleitwinkel) und Gieren mit tempoabhängiger Wendigkeit
  const pitchIn = ((inp.noseUp ? 1 : 0) - (inp.noseDown ? 1 : 0)) * (inp.invert ? -1 : 1)
  if (inp.mousePitch != null) st.pitch = clamp(inp.mousePitch, -E.pitchMax, E.pitchMax)
  else if (pitchIn) st.pitch = clamp(st.pitch + pitchIn * E.pitchRate * dt, -E.pitchMax, E.pitchMax)
  else st.pitch += ((R && !inp.thrust ? RACER.cruise : E.cruise) - st.pitch) * Math.min(1, E.autoLevel * dt) // ohne Eingabe: zum Gleitwinkel (≈ 7° nach unten, sCruise §6.2)
  const steer = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), w = lerp(E.wLow, E.wHigh, clamp(s / (E.sDive * J), 0, 1)) * steer
  st.yaw += w * dt
  st.bank += (clamp(Math.atan2(s * w, g), -E.bankMax, E.bankMax) - st.bank) * Math.min(1, 6 * dt)
  // Abriss: unter sStall sinkt die Nase von selbst Richtung −10°
  const L = clamp(s / (E.sStall * J), 0, 1)
  if (L < 1 && !pitchIn) st.pitch += (E.stallNose - st.pitch) * Math.min(1, (1 - L) * 2 * dt)
  const cp = Math.cos(st.pitch), nose = [Math.sin(st.yaw) * cp, Math.sin(st.pitch), Math.cos(st.yaw) * cp]
  // 1 · Tempo entlang der Bahn (θ = Bahnneigung)
  const dir = s > 1e-6 ? [st.v[0] / s, st.v[1] / s, st.v[2] / s] : nose, theta = Math.asin(clamp(dir[1], -1, 1))
  let grav = -g * Math.sin(theta) * (theta < -E.thetaDive ? E.kDive : 1)
  if (theta < 0) grav *= 1 - smoothstep(0.95 * E.sDive * J, E.sDive * J, s) // Schwerkraft trägt nur bis sDive (Fenster 0,95–1,0: mit 0,9 pendelte sich der Sturz bei 57,7 m/s ein, Gate G2)
  const c1 = opt.noDrag ? 0 : E.c1 * (R && hNow < 1.5 * st.h0 ? RACER.groundDrag : 1), c2 = opt.noDrag ? 0 : E.c2 / J
  s = Math.max(0, s + (grav - c1 * s - c2 * Math.max(0, s - E.sDive * J) ** 2) * dt)
  // Racer: Dauerschub, Luftbremse, Boost aus dem Kesseldruck
  if (R) {
    st.boilT = Math.max(0, st.boilT - dt)
    s += ((inp.thrust ? RACER.thrust : 0) - (inp.airBrake ? RACER.airBrake : 0)) * J * dt; s = Math.max(0, s)
    // nach dem Kochen erst wieder nach Loslassen (sonst stottert gehaltenes Shift: Mini-Schub aus dem Nachfüllen, gleich wieder kochen)
    if (!inp.boost) st.boilLatch = false
    const want = !!inp.boost && st.boilT <= 0 && !st.boilLatch
    if (want && st.P > 0) { if (!st.boosting) { st.events.push({ type: 'surge' }); st.kick += 4 } st.boosting = true; s += RACER.boostAcc * J * dt; st.P = Math.max(0, st.P - RACER.drain * dt)
      if (st.P <= 0) { st.boilT = RACER.boilS; st.boosting = false; st.boilLatch = true; st.events.push({ type: 'boil' }) } }
    else { st.boosting = false }
  }
  // 2 · Bahn folgt der Nase (Betrag bleibt)
  const k = 1 - Math.exp(-E.kAlign * (R ? RACER.kAlignK : 1) * L * dt)
  const nd = [dir[0] + (nose[0] - dir[0]) * k, dir[1] + (nose[1] - dir[1]) * k, dir[2] + (nose[2] - dir[2]) * k], nl = len(nd) || 1
  st.v = [(nd[0] / nl) * s, (nd[1] / nl) * s, (nd[2] / nl) * s]
  // 3 · Fallschirm unter sStall
  // Fallschirm nur mit Nase nicht im Sturz: wer aus dem Abriss die Nase senkt, soll Tempo aufnehmen können (elan-browser 18.10.: der Deckel hielt die
  // Figur sonst unter sStall gefangen, Sturz aus dem Stand brachte nur 8,6 m/s)
  if (L < 1 && st.pitch > -E.thetaDive * 0.5) st.v[1] = Math.max(-E.vSinkMax * (R ? RACER.sinkK : 1) * J, st.v[1] - g * (1 - L) * dt)
  // Racer: Schwebefeder unter 3·h0 (kritisch nah gedämpft), hält den Rumpf über dem Boden
  if (R && hNow < 3 * st.h0) { const w = RACER.hoverW; st.v[1] += (w * w * (st.h0 - hNow) - 2 * RACER.hoverZeta * w * st.v[1]) * dt }
  // Fähigkeiten
  st.lock = Math.max(0, st.lock - dt); st.rollCd = Math.max(0, st.rollCd - dt)
  const spaceEdge = !!inp.space && !st.spaceHeld, shiftEdge = !!inp.shift && !st.shiftHeld; st.spaceHeld = !!inp.space; st.shiftHeld = !!inp.shift
  const steerEdge = steer !== 0 && st.prevSteer === 0; st.prevSteer = steer
  if (ab) {
    if (spaceEdge && st.spaceT < 0) st.spaceT = 0 // Leertaste: 150 ms auf ein neues A/D warten (Fassrolle), sonst Steigen
    if (st.spaceT >= 0) {
      if (steerEdge && st.rollCd <= 0) { st.rollT = E.rollS; st.rollDir = -steer; st.rollCd = E.rollCd; st.spaceT = -1; const f = E.rollFwd * J; st.v = st.v.map((x, i) => x + nose[i] * f); st.kick += 6; st.events.push({ type: 'roll', dir: st.rollDir }) }
      else if ((st.spaceT += dt) >= E.rollWindow) { st.spaceT = -1
        if (st.charges >= 1 && st.lock <= 0) { st.charges -= 1; st.lock = E.lockS; st.v[1] += E.ascentUp * J; const f = E.ascentFwd * J; st.v[0] += Math.sin(st.yaw) * f; st.v[2] += Math.cos(st.yaw) * f; st.events.push({ type: 'ascent' }) } }
    }
    if (!R && shiftEdge && st.charges >= 1 && st.lock <= 0) { st.charges -= 1; st.lock = E.lockS; st.v = st.v.map((x, i) => x + nose[i] * E.surge * J); st.kick += 4; st.events.push({ type: 'surge' }) }
  }
  // Fassrolle: seitlicher Versatz über die Rollzeit (4 m), Drehung nur Darstellung (rollT/rollDir)
  let side = [0, 0, 0]
  if (st.rollT > 0) { const a = Math.min(dt, st.rollT); st.rollT -= dt; const r = [Math.cos(st.yaw), 0, -Math.sin(st.yaw)], m = (E.rollSide * J * a / E.rollS) * st.rollDir; side = r.map((x) => x * m) }
  // Höchsttempo mit Fähigkeiten
  s = len(st.v); if (s > E.sBoostMax * J) st.v = st.v.map((x) => (x * E.sBoostMax * J) / s)
  // Bewegung mit Sweep (keine Wand-Durchflüge), Boden = Landung
  const want = [st.v[0] * dt + side[0], st.v[1] * dt, st.v[2] * dt + side[2]]
  const sw = env?.sweep ? env.sweep(st.pos, want) : { delta: want, hit: false }
  if (sw.hit) { st.hit = sw.n; const n = sw.n, into = st.v[0] * n[0] + st.v[1] * n[1] + st.v[2] * n[2]; if (into < 0) st.v = st.v.map((x, i) => x - into * n[i]) } // Anteil in die Wand weg, Gleiten entlang
  st.pos = [st.pos[0] + sw.delta[0], st.pos[1] + sw.delta[1], st.pos[2] + sw.delta[2]]
  const gy = env?.ground ? env.ground(st.pos[0], st.pos[2]) : -Infinity, h = st.pos[1] - gy
  st.grounded = h <= 0.02 * J; if (st.grounded) { st.pos[1] = gy; if (st.v[1] < 0) st.v[1] = 0 }
  // Aufladen: Grundwert Luft, schneller mit Thrill, Boden am schnellsten, bodennah zusätzlich
  s = len(st.v); st.thrillT = s >= E.sThrill * J ? st.thrillT + dt : 0
  const thrill = st.thrillT >= E.thrillAfter, every = st.grounded ? E.regenGround : thrill ? E.regenThrill : E.regenAir
  if (st.charges < E.charges) { st.regen += dt; if (st.regen >= every) { st.regen -= every; st.charges += 1; st.events.push({ type: 'charge', why: st.grounded ? 'ground' : thrill ? 'thrill' : 'air' }) } } else st.regen = 0
  const skim = !st.grounded && h < E.skimH * J && s >= E.skimS * J
  if (skim && st.charges < E.charges) { st.skimT += dt; if (st.skimT >= E.regenSkim) { st.skimT -= E.regenSkim; st.charges += 1; st.events.push({ type: 'charge', why: 'skim' }) } } else if (!skim) st.skimT = 0
  // Kick (FOV-Stoß) klingt über eine kritisch gedämpfte Feder ab (ω ≈ 8)
  const om = 8; st.kickV += (-om * om * st.kick - 2 * om * st.kickV) * dt; st.kick += st.kickV * dt
  // Racer: Kessel füllt sich (schneller mit Thrill, bodennah am schnellsten), Landung = zurück zur Fahrt
  if (st.profile === 'racer') {
    if (!st.boosting && st.boilT <= 0) st.P = Math.min(1, st.P + (skim ? RACER.fillSkim : thrill ? RACER.fillThrill : RACER.fill) * dt)
    if (!st.landed && h < RACER.landK * st.h0 && st.v[1] <= 0) { st.landed = true; st.events.push({ type: 'land' }) }
  }
  st.mode = st.grounded ? 'GROUND' : st.rollT > 0 ? 'ROLL' : s < E.sStall * J ? 'STALL' : theta < -E.thetaDive ? 'DIVE' : 'GLIDE'
  st.h = h; st.thrill = thrill; st.skim = skim
  return st
}

// Kamera-Kurve §6.6 (rein): FOV = 55 + 15·smoothstep(20, 65, s) + Kick, Deckel 75; Abstand distFly + 3·J·(s / sDive); Rollen ≤ 15 % der Schräglage,
// höchstens 8°. Komfortmodus: FOV 55, kein Kick, kein Rollen.
export function elanCamera(st, { comfort = false, fov0 = 55, distFly = 7.8 } = {}) {
  const J = st.J, s = len(st.v)
  if (comfort) return { fov: fov0, dist: distFly + 3 * J * Math.min(1, s / (ELAN.sDive * J)), roll: 0 }
  const fov = Math.min(75, fov0 + 15 * smoothstep(20 * J, 65 * J, s) + st.kick)
  return { fov, dist: distFly + 3 * J * Math.min(1, s / (ELAN.sDive * J)), roll: clamp(st.bank * 0.15, -(8 * Math.PI) / 180, (8 * Math.PI) / 180) }
}
