// k2t · Mini-Turbo und Boost-Anzeige (Georg 21.10., Audit-Vorschlag). Flacher Boden, 1/60 s, Vollgas. Sollwerte aus dem Auftrag:
//   Drift am Boden lädt d.driftCharge, Stufen ab 0,6 / 1,2 / 2,0 s (Ereignis driftCharge {stage}); Loslassen von Q/E → driftBoost {stage},
//   Boost 0,35 / 0,6 / 0,9 s; Anzeige d.boostMeter 0…1 (Start 1): Shift zieht 0,35/s, Boost nur mit Füllung, passiv + 0,05/s, Drift-Stufe + 0,2 / 0,4 / 0,7.
//   Abbruch (Sprung im Drift) → Ladung verfällt; Lande-Boost (LAND.boostOn) verbraucht keine Anzeige.
import * as k2t from '../../src/m2/k2t.js'
import { K } from '../../src/m1/m1Scale.js'
import { report } from './_report.mjs'

const { createK2t, stepK2t, FLOW } = k2t, DT = 1 / 60, RIDE = 0.35 * K
const SPEC = { stages: [0.6, 1.2, 2.0], boostT: [0.35, 0.6, 0.9], fill: [0.2, 0.4, 0.7], drain: 0.35, regen: 0.05 }
const env = {
  ground: () => ({ y: RIDE, n: [0, 1, 0], floor: RIDE }),
  sweep: (from, delta) => ({ delta, hit: false, n: null, soft: false, ride: false }),
  blocked: () => false,
  home: () => ({ x: 0, y: RIDE, z: 0, yaw: 0 }),
}
const near = (a, b, e) => typeof a === 'number' && Math.abs(a - b) <= e
// Abschnitte [Sekunden, Eingabe]; je Schritt Ereignisse und Zustand
function drive(d, parts) {
  const log = []; let i = 0
  for (const [sec, inp] of parts) for (let n = Math.round(sec / DT); n > 0; n--, i++) {
    stepK2t(d, inp, DT, env)
    log.push({ i, ev: d.events.map((e) => ({ ...e })), boosting: d.boosting, meter: d.boostMeter, speed: d.speed, air: d.air, latch: d.boostLatch })
  }
  return log
}
const evs = (log, type) => log.flatMap((s) => s.ev.filter((e) => e.type === type).map((e) => ({ ...e, i: s.i })))
const G = { gas: true }, GS = { gas: true, boost: true }, GD = { gas: true, driftR: true }

// 1 · Anzeige: Shift zieht 0,35/s, leer = kein Boost (bis Shift losgelassen), dann wieder
const d1 = createK2t(0, RIDE, 0, 0), m0 = d1.boostMeter
const l1 = drive(d1, [[2, G], [1, GS]]), m1s = d1.boostMeter
const l1b = drive(d1, [[2.2, GS]]), emptyStops = !l1b[l1b.length - 1].boosting && l1b.some((s) => s.meter === 0)
const l1c = drive(d1, [[1 / 60, G], [2 / 60, GS]]), rearm = l1c[l1c.length - 1].boosting
const d1d = createK2t(0, RIDE, 0, 0); drive(d1d, [[2, G], [2, GS]]); const mLow = d1d.boostMeter; drive(d1d, [[2, G]]); const regen = d1d.boostMeter - mLow

// 2 · Stufe 3: Anzeige auf 0,3 leeren, 2,2 s driften, loslassen
const d2 = createK2t(0, RIDE, 0, 0); drive(d2, [[3, G], [2, GS]])
const l2 = drive(d2, [[2.2, GD], [1.5, G]]), c2 = evs(l2, 'driftCharge'), b2 = evs(l2, 'driftBoost')
const rel2 = Math.round(2.2 / DT), boost2 = l2.filter((s) => s.i > rel2 && s.boosting).length, vmax2 = Math.max(...l2.filter((s) => s.i > rel2).map((s) => s.speed))
const chargeAt = c2.map((e) => +((e.i + 1) * DT).toFixed(3))

// 3 · Stufe 1: 0,8 s driften → Boost 0,35 s, Anzeige + 0,2
const d3 = createK2t(0, RIDE, 0, 0); drive(d3, [[3, G], [2, GS]])
const l3 = drive(d3, [[0.8, GD], [1, G]]), b3 = evs(l3, 'driftBoost'), rel3 = Math.round(0.8 / DT)
const boost3 = l3.filter((s) => s.i > rel3 && s.boosting).length, jumpM3 = b3.length ? l3[b3[0].i].meter - l3[b3[0].i - 1].meter : null

// 4 · Abbruch: 1 s driften, im Drift springen (Q/E gehalten), nach der Landung loslassen → keine Stufe, kein Boost
const d4 = createK2t(0, RIDE, 0, 0); drive(d4, [[3, G]])
const l4 = drive(d4, [[1, GD], [1 / 60, { ...GD, jump: true }], [1.2, GD], [1, G]]), b4 = evs(l4, 'driftBoost')

// 5 · Lande-Boost: Shift gehalten, solange der Lande-Boost läuft (LAND.boostT 0,45 s) – Anzeige sinkt nicht
const d5 = createK2t(0, RIDE, 0, 0); drive(d5, [[2, G]]); d5.boostMeter = 0.5
let land5 = null; drive(d5, [[1 / 60, { gas: true, jump: true }]])
for (let n = 0; n < 240 && !land5; n++) { stepK2t(d5, G, DT, env); if (d5.events.some((e) => e.type === 'landing') && !d5.air) land5 = n }
const mLand = d5.boostMeter, l5b = drive(d5, [[0.3, GS]]), mAfter = l5b[l5b.length - 1].meter, landBoosting = l5b.every((s) => s.boosting)

process.exit(report('k2t-drift-boost', {
  constants: JSON.stringify(k2t.DRIFTBOOST && { stages: k2t.DRIFTBOOST.stages, boostT: k2t.DRIFTBOOST.boostT, fill: k2t.DRIFTBOOST.fill, drain: k2t.DRIFTBOOST.drain, regen: k2t.DRIFTBOOST.regen }) === JSON.stringify(SPEC),
  meterStartsFull: m0 === 1,
  shiftDrains035: near(m1s, 1 - 0.35, 0.02),
  emptyNoBoost: emptyStops,
  rearmAfterRelease: rearm,
  passiveRegen: near(regen, 2 * 0.05, 0.005),
  stages123: c2.map((e) => e.stage).join() === '1,2,3' && near(chargeAt[0], 0.6, 0.04) && near(chargeAt[1], 1.2, 0.04) && near(chargeAt[2], 2.0, 0.04),
  release3: b2.length === 1 && b2[0].stage === 3 && near(boost2 * DT, 0.9, 0.05) && vmax2 > FLOW.maxForward * 1.05,
  release1: b3.length === 1 && b3[0].stage === 1 && near(boost3 * DT, 0.35, 0.05) && near(jumpM3, 0.2, 0.01),
  abortLosesCharge: b4.length === 0,
  landBoostFree: land5 != null && landBoosting && mAfter >= mLand,
}, { m1s, regen: typeof regen === 'number' ? +regen.toFixed(4) : regen, chargeAt, b2, boost2: +(boost2 * DT).toFixed(3), vmax2: +(vmax2 / K).toFixed(1), b3, boost3: +(boost3 * DT).toFixed(3), jumpM3, b4: b4.length, mLand, mAfter }))
