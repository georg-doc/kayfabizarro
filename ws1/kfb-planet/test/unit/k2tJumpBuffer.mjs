// k2t · Sprung-Puffer (Georg 21.10., Audit-Vorschlag): Leertaste bis JUMP.buffer = 0,12 s vor dem Aufsetzen → der Wagen springt beim Aufsetzen
// sofort. Fassrolle (Leertaste + A/D in der Luft, TRICK.airMin) bleibt: ein Druck, der einen Trick auslöst, wird nicht gepuffert.
// Flacher Boden, Vollgas, Sprung bei 1 s; Landeschritt L aus einem Bezugslauf (Druck in der Luft ändert die Bahn nicht).
// Erwartet: Druck bei L − 5 (≈ 0,083 s) → im Landeschritt landing + takeoff (jump); Druck bei L − 12 (0,2 s) → kein Sprung nach der Landung;
// Druck bei L − 5 mit D gehalten → Fassrolle (trick tumble), kein Sprung nach der Landung.
import * as k2t from '../../src/m2/k2t.js'
import { K } from '../../src/m1/m1Scale.js'
import { report } from './_report.mjs'

const { createK2t, stepK2t } = k2t, DT = 1 / 60, RIDE = 0.35 * K
const env = {
  ground: () => ({ y: RIDE, n: [0, 1, 0], floor: RIDE }),
  sweep: (from, delta) => ({ delta, hit: false, n: null, soft: false, ride: false }),
  blocked: () => false,
  home: () => ({ x: 0, y: RIDE, z: 0, yaw: 0 }),
}
// pressAt: Schritt des zweiten Drucks (null = keiner); right: D gehalten ab pressAt
function run(pressAt, right = false) {
  const d = createK2t(0, RIDE, 0, 0), log = []; let land = -1
  for (let i = 0; i < 240; i++) {
    const p2 = pressAt != null && i === pressAt
    stepK2t(d, { gas: true, jump: i === 60 || p2, right: right && pressAt != null && i >= pressAt && land < 0 }, DT, env)
    for (const e of d.events) { log.push({ i, ...e }); if (e.type === 'landing' && land < 0 && i > 60) land = i }
  }
  const after = log.filter((e) => e.type === 'takeoff' && e.jump && e.i >= land)
  return { land, after, tricks: log.filter((e) => e.type === 'trick').length, sameStep: after.some((e) => e.i === land) }
}
const ref = run(null), L = ref.land
const near = run(L - 5), far = run(L - 12), trick = run(L - 5, true)
process.exit(report('k2t-jump-buffer', {
  constant: k2t.JUMP?.buffer === 0.12,
  landed: L > 60 && near.land === L && far.land === L,
  noJumpWithoutPress: ref.after.length === 0,
  bufferedJumpAtLanding: near.after.length === 1 && near.sameStep,
  noBufferAt200ms: far.after.length === 0,
  trickStillWorks: trick.tricks === 1 && trick.after.length === 0,
}, { L, near: { after: near.after.length, sameStep: near.sameStep }, far: far.after.length, trick: { tricks: trick.tricks, after: trick.after.length } }))
