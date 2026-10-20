// Elan S2 · Übergang K2B ↔ Racer-Flug (src/m2/racerFlight.js) ohne Browser: echte K2B-Fahrphysik (k2t.js) auf einem Testgelände mit Rampe (J17).
//   T1 Rampe        Vollgas + Boost auf eine 14°-Rampe: Abflug in den Schwungflug (why ramp) mit Tempo ≥ 0,5·sThrill
//   T2 Fliegen      W gehalten 3 s: bleibt in der Luft, Höhe über Grund > 2 m
//   T3 Landen       Schub weg, Nase runter: genau ein land, zurück an K2B, K2B setzt binnen 3 s auf, Tempo nach der Landung > 0, alles endlich
//   T4 Langsam      Rampe mit halbem Tempo: kein Abflug (K2B springt nur)
//   T5 Doppel-Leer  ebene Strecke, Leertaste, nach 0,2 s nochmal: Flug (why double); mit A gehalten: kein Flug (bleibt K2B-Fassrolle)
//   T7 Buckel       9°-Buckel mit 22 m/s (Steigwinkel > 8°, vy < 4·J): kein Abflug, K2B fährt weiter (WS1-Entscheid 18.10.)
//   T6 Kessel       im Flug Boost bis leer: surge genau 1, boil → Antrieb meldet brake-Puls und boil, Gas des Antriebs bleibt Schub
import { createK2t, stepK2t } from '../src/m2/k2t.js'
import { createRacerFlight, racerFlightStep, racerAfterK2t, racerDrive } from '../src/m2/racerFlight.js'
import { ELAN } from '../src/m1/elan.js'
import { K, G } from '../src/m1/m1Scale.js'
import { WORLD_K } from '../src/worldScale.js'
const DT = 1 / 60, J = K / WORLD_K, A = (14 * Math.PI) / 180
// Rampe von z 60 bis 80 (14°), danach Abbruchkante auf 0
let RAMP = { a: A, len: 20 }
const h = (x, z) => (z > 60 && z < 60 + RAMP.len ? (z - 60) * Math.tan(RAMP.a) : 0)
const n = (x, z) => (z > 60 && z < 60 + RAMP.len ? [0, Math.cos(RAMP.a), -Math.sin(RAMP.a)] : [0, 1, 0])
const env = { ground: (x, z) => ({ y: h(x, z), n: n(x, z), floor: 0 }), sweep: (f, dl) => ({ delta: dl, hit: false }), zone: () => null, blocked: () => false, home: () => ({ x: 0, y: 0, z: 0, yaw: 0 }) }
const fenv = { ground: (x, z) => h(x, z), sweep: (p, dl) => ({ delta: dl, hit: false }) }
const ok = (v) => Number.isFinite(v)
function sim(start, n, input) {
  const d = createK2t(0, h(0, start), start, 0), F = createRacerFlight(J, G), log = []
  for (let i = 0; i < n; i++) { const t = i * DT, k = input(t, d, F)
    const flew = racerFlightStep(F, d, k, DT, fenv)
    if (!flew) { stepK2t(d, { gas: k.gas, brake: k.brake, left: k.left, right: k.right, boost: k.boost, jump: k.jump }, DT, env); racerAfterK2t(F, d) }
    log.push({ t, fly: !!F.st, air: d.air, vy: d.vy, y: d.y, z: d.z, sp: d.speed, ev: F.events.map((e) => e.type + (e.why ? ':' + e.why : '')), drv: racerDrive(F, k) }) }
  return { d, F, log }
}
const out = {}
{ let landT = null, flyT = null, onGround = null
  const r = sim(0, 60 * 14, (t, d, F) => { if (F.st && flyT == null) flyT = t
    const fly3 = flyT != null && t - flyT < 3; return { gas: landT == null && (flyT == null || fly3), boost: flyT == null, noseDown: flyT != null && !fly3 && !F.lands, brake: false } })
  const L = r.log, iFly = L.findIndex((x) => x.fly), takeoff = L[iFly], ev = L.flatMap((x) => x.ev)
  const after3 = L.filter((x) => x.fly && x.t - takeoff.t > 2.5 && x.t - takeoff.t < 3).map((x) => x.y - h(0, x.z))
  const iLand = L.findIndex((x) => x.ev.includes('land')), iGround = L.findIndex((x, i) => i > iLand && !x.air)
  out.T1 = { why: ev.find((e) => e.startsWith('fly')), speed: iFly > 0 && +L[iFly - 1].sp.toFixed(1), need: +(0.5 * ELAN.sThrill * J).toFixed(1), z: takeoff && +takeoff.z.toFixed(1) }
  out.T2 = { minH3: after3.length ? +Math.min(...after3).toFixed(1) : null }
  out.T3 = { lands: ev.filter((e) => e === 'land').length, groundAfter: iGround > 0 ? +((iGround - iLand) * DT).toFixed(2) : null, speedAfter: iGround > 0 && +L[iGround].sp.toFixed(1), finite: L.every((x) => ok(x.y) && ok(x.z) && ok(x.sp)) } }
{ const r = sim(0, 60 * 8, (t, d) => ({ gas: d.speed < 9 * J })); out.T4 = { flights: r.F.flights, airborne: r.log.some((x) => x.air && x.z > 79) } }
{ const tap = (hold) => sim(0, 60 * 4, (t, d) => ({ gas: true, jump: (t > 1 && t < 1.05) || (t > 1.25 && t < 1.3), left: hold && t > 1.2 }))
  const a = tap(false), b = tap(true); out.T5 = { why: a.log.flatMap((x) => x.ev).find((e) => e.startsWith('fly')), withA: b.F.flights } }
{ const d = createK2t(0, 40, 0, 0), F = createRacerFlight(J, G); d.speed = 30 * J; d.air = true; F.lastJump = 0; F.t = 0.1
  racerFlightStep(F, d, { jump: true }, DT, fenv); let surge0 = F.surgeN, pulse = false, boil = false, gas = true
  for (let i = 0; i < 60 * 6; i++) { racerFlightStep(F, d, { gas: true, boost: true, mousePitch: 0.05 }, DT, fenv); const dv = racerDrive(F, { gas: true, boost: true }); if (!dv) break; pulse ||= dv.brake; boil ||= dv.boil; gas &&= dv.gas }
  out.T6 = { surges: F.surgeN - surge0, brakePulse: pulse, boil, gas, flying: !!F.st } }
{ RAMP = { a: (9 * Math.PI) / 180, len: 4 }; const r = sim(0, 60 * 8, (t, d) => ({ gas: d.speed < 22 * J })); const tk = r.log.findIndex((x, i) => i > 0 && x.air && !r.log[i - 1].air && x.z > 60)
  out.T7 = { flights: r.F.flights, leftGround: tk > 0, vyAt: tk > 0 ? +r.log[tk].vy.toFixed(2) : null, climbDeg: tk > 0 ? +((Math.atan2(r.log[tk].vy, r.log[tk].sp) * 180) / Math.PI).toFixed(1) : null, speedAt: tk > 0 ? +r.log[tk].sp.toFixed(1) : null }; RAMP = { a: A, len: 20 } }
const checks = {
  T1_ramp: out.T1.why === 'fly:ramp' && out.T1.speed >= out.T1.need,
  T2_flies: out.T2.minH3 != null && out.T2.minH3 > 2,
  T3_land: out.T3.lands === 1 && out.T3.groundAfter != null && out.T3.groundAfter <= 3 && out.T3.speedAfter > 0 && out.T3.finite,
  T4_slow: out.T4.flights === 0,
  T5_double: out.T5.why === 'fly:double' && out.T5.withA === 0,
  T7_bump: out.T7.flights === 0 && out.T7.leftGround && out.T7.climbDeg > 8 && out.T7.vyAt < 4 * J,
  T6_boiler: out.T6.surges === 1 && out.T6.brakePulse && out.T6.boil && out.T6.gas && out.T6.flying,
}
console.log(JSON.stringify({ ...out, checks }))
const fail = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
console.log(fail.length ? 'FAIL elan-racer-k2b: ' + fail.join(', ') : 'PASS elan-racer-k2b'); process.exit(fail.length ? 1 : 0)
