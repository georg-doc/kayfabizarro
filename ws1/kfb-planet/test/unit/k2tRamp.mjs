// k2t · Rampe ohne Nachhüpfen (Audit C 21.10.: vyG blieb nach der Landung stehen → der alte Rampen-Schwung ließ den Wagen 6× statt 2× abheben;
// Georg: „Dauer-Hüpfer“). Gerade Strecke in +z: flach → Rampe 25° über 6 m → Plateau 12 m → Kante → flach. Vollgas, 1/60 s, 6 s.
// Erwartet: höchstens 2 Abhebungen (Rampenkante, Plateaukante), nach der letzten Landung kein weiteres Abheben, der Wagen fährt weiter.
import { createK2t, stepK2t } from '../../src/m2/k2t.js'
import { K } from '../../src/m1/m1Scale.js'
import { report } from './_report.mjs'

const RIDE = 0.35 * K, R0 = 10 * K, RL = 6 * K, H = RL * Math.tan(25 * Math.PI / 180), PL = 12 * K
const groundH = (z) => (z < R0 ? 0 : z < R0 + RL ? (z - R0) * Math.tan(25 * Math.PI / 180) : z < R0 + RL + PL ? H : 0)
const env = {
  ground: (x, z) => { const y = groundH(z), e = 0.05 * K, s = (groundH(z + e) - groundH(z - e)) / (2 * e), l = Math.hypot(s, 1); return { y: y + RIDE, n: [0, 1 / l, -s / l], floor: y + RIDE } },
  sweep: (from, delta) => ({ delta, hit: false, n: null, soft: false, ride: false }),
  blocked: () => false,
  home: () => ({ x: 0, y: RIDE, z: 0, yaw: 0 }),
}
const d = createK2t(0, RIDE, 0, 0)
let takeoffs = 0, landings = 0, lastLandT = -1, afterLast = 0, t = 0
for (let i = 0; i < 360; i++) { t = i / 60
  stepK2t(d, { gas: true }, 1 / 60, env)
  for (const e of d.events) { if (e.type === 'takeoff') { takeoffs++; if (lastLandT >= 0 && d.z > R0 + RL + PL + 4 * K) afterLast++ } if (e.type === 'landing') { landings++; lastLandT = t } } }
process.exit(report('k2t-ramp', {
  takeoffsAtMost2: takeoffs <= 2,
  landedAtLeastOnce: landings >= 1,
  noHopAfterPlateau: afterLast === 0,
  stillDriving: d.z > R0 + RL + PL + 8 * K && !d.air,
}, { takeoffs, landings, z: +(d.z / K).toFixed(1), air: d.air }))
