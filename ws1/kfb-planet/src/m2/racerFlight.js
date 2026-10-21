// Elan S2 · Racer fliegt (research/DRAGONRIDING_RESEARCH_R1.md §6.5, WS1-Entscheid 18.10.): Übergang K2B ↔ Elan-Profil racer als reine Logik, ohne
// three/React. Am Boden fährt der Wagen in K2B (k2t.js); er hebt in den Schwungflug ab
//   Rampe        takeoff-Ereignis von K2B (kein Sprung) mit Tempo ≥ 0,5·sThrill und Steigwinkel > 8°, dazu vy ≥ 4·J oder Start aus einer Rampen-Zone
//                (launch im selben Schritt; WS1-Entscheid 18.10.: sonst hob eine Bodenwelle bei Tempo kurz ab)
//   Doppel-Leer  zweiter Leertasten-Druck in der Luft höchstens 0,4 s nach dem ersten (ohne A/D – mit A/D bleibt es die K2B-Fassrolle); Steig-Impuls ohne Ladung
// und kehrt zurück, sobald Elan das Ereignis land meldet (h < 1,2·h0 und vy ≤ 0): Tempo längs/quer und vy gehen an K2B, das in der Luft weiterrechnet.
// Eingabe im Flug: W Dauerschub, S Luftbremse, A/D gieren, Pfeil hoch/runter Nase (die Pfeiltasten sind sonst W/S – dort dann kein Schub/Bremse),
// RMB gehalten Nase aus der Kameraneigung, Leertaste Steigen (Ladung), Leertaste+A/D Fassrolle, Shift Boost aus dem Kessel.
import { ELAN, createElan, elanStep, elanSpeed } from '../m1/elan.js'

export const RFLY = Object.freeze({ climbMin: (8 * Math.PI) / 180, speedK: 0.5, vyMin: 4, doubleS: 0.4, boilPulseS: 0.25 })

export const createRacerFlight = (J = 1, g = 9.81) => ({ J, g, st: null, charges: ELAN.charges, lastJump: -1e9, t: 0, jumpHeld: false, boilPulse: 0, surgeN: 0, ascentN: 0, flights: 0, lands: 0, events: [] })

// Abheben: Elan-Zustand aus der K2B-Lage (Fahrtrichtung, Längs-/Quertempo, vy)
export function racerTakeoff(F, d, why) {
  const J = F.J, st = createElan({ pos: [d.x, d.y, d.z], yaw: d.yaw, speed: 0, J, g: F.g, profile: 'racer' }), s = d.speed, l = d.latV || 0
  st.v = [Math.sin(d.yaw) * s + Math.cos(d.yaw) * l, d.vy || 0, Math.cos(d.yaw) * s - Math.sin(d.yaw) * l]
  if (why === 'double') st.v[1] = Math.max(st.v[1], 0) + ELAN.ascentUp * J
  st.pitch = Math.atan2(st.v[1], Math.max(1e-3, Math.hypot(st.v[0], st.v[2])))
  st.charges = F.charges; F.st = st; F.flights++; F.events.push({ type: 'fly', why }); return st
}
// Landen: zurück an K2B (in der Luft, K2B rechnet Aufsetzen, Federung und Landehilfe)
export function racerLand(F, d) {
  const st = F.st; if (!st) return
  d.x = st.pos[0]; d.y = st.pos[1]; d.z = st.pos[2]; d.yaw = st.yaw
  d.speed = st.v[0] * Math.sin(st.yaw) + st.v[2] * Math.cos(st.yaw); d.latV = st.v[0] * Math.cos(st.yaw) - st.v[2] * Math.sin(st.yaw)
  d.vy = st.v[1]; d.vyG = 0; d.air = true; d.pitch = 0; d.roll = 0
  F.charges = st.charges; F.st = null; F.lands++; F.events.push({ type: 'land' })
}

// je Physik-Schritt VOR stepK2t: true = der Schritt ist geflogen (K2B auslassen). k = { gas, brake, left, right, jump, boost, noseUp, noseDown, mousePitch }
// env = { ground(x, z) → Boden-y unter dem Wagen (Fahrhöhe eingerechnet), sweep(from, delta) → { delta, hit, n } }
export function racerFlightStep(F, d, k, dt, env) {
  F.t += dt; F.events.length = 0; F.boilPulse = Math.max(0, F.boilPulse - dt)
  const jumpEdge = !!k.jump && !F.jumpHeld; F.jumpHeld = !!k.jump
  if (!F.st) {
    // Doppel-Leertaste in der Luft (erster Druck = K2B-Sprung oder schon in der Luft), A/D frei
    if (jumpEdge) { if (d.air && !k.left && !k.right && F.t - F.lastJump <= RFLY.doubleS) { F.lastJump = -1e9; racerTakeoff(F, d, 'double') } else F.lastJump = F.t }
    if (!F.st) return false
  }
  const st = F.st; d.events.length = 0
  elanStep(st, { thrust: !!k.gas && !k.noseUp, airBrake: !!k.brake && !k.noseDown, noseUp: !!k.noseUp, noseDown: !!k.noseDown, left: !!k.left, right: !!k.right, space: !!k.jump, boost: !!k.boost, mousePitch: k.mousePitch ?? null }, dt, env)
  for (const e of st.events) { if (e.type === 'surge') F.surgeN++; if (e.type === 'ascent') F.ascentN++; if (e.type === 'boil') F.boilPulse = RFLY.boilPulseS }
  d.x = st.pos[0]; d.y = st.pos[1]; d.z = st.pos[2]; d.yaw = st.yaw; d.air = true; d.pitch = -st.pitch; d.roll = -st.bank; d.up = [0, 1, 0]
  d.speed = Math.hypot(st.v[0], st.v[2]); d.vy = st.v[1]; d.latV = 0
  F.charges = st.charges
  if (st.events.some((e) => e.type === 'land')) racerLand(F, d)
  return true
}
// nach stepK2t: Rampen-Abflug aus dem takeoff-Ereignis von K2B
export function racerAfterK2t(F, d) {
  if (F.st) return
  const e = d.events.find((x) => x.type === 'takeoff' && !x.jump); if (!e) return
  const s = Math.abs(d.speed), climb = Math.atan2(d.vy || 0, Math.max(1e-3, s))
  const zone = d.events.some((x) => x.type === 'launch')
  if (d.speed > 0 && s >= RFLY.speedK * ELAN.sThrill * F.J && climb > RFLY.climbMin && ((d.vy || 0) >= RFLY.vyMin * F.J || zone)) racerTakeoff(F, d, zone ? 'zone' : 'ramp')
}
// Antriebs-Modul im Flug: Gas weich aus Schub, Kessel leer → Gas × 0,3 und Funken über einen Brems-Puls
export const racerDrive = (F, k) => { const st = F.st; return st ? { gas: !!k.gas && !k.noseUp, brake: (!!k.brake && !k.noseDown) || F.boilPulse > 0, boost: st.boosting, jump: false, air: true, fly: true, boil: st.boilT > 0, surgeN: F.surgeN, ascentN: F.ascentN, P: st.P, speed01: Math.min(1, elanSpeed(st) / (ELAN.sDive * F.J)) } : null }
