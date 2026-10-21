// k2t · Coyote-Zeit (Georg 21.10., Audit-Vorschlag): rollt der Wagen über eine Kante, zählt die Leertaste noch JUMP.coyote = 0,12 s als Sprung –
// nicht nach einem eigenen Sprung (kein Doppelsprung). Gerade Strecke in +z: Plateau 3 m hoch bis z = 60 m, dann Abbruchkante auf 0. Vollgas, 1/60 s.
// Erwartet: Druck 5 Schritte (≈ 0,083 s) nach dem Abrollen → Sprung (takeoff jump, vy > 0, Wagen steigt); Druck nach 12 Schritten (0,2 s) → kein
// Sprung; auf flachem Boden zweiter Druck 5 Schritte nach dem Sprung → kein zweiter Sprung, vy fällt weiter.
import * as k2t from '../../src/m2/k2t.js'
import { K } from '../../src/m1/m1Scale.js'
import { report } from './_report.mjs'

const { createK2t, stepK2t } = k2t, DT = 1 / 60
const RIDE = 0.35 * K, H = 3 * K, Z0 = 60 * K
const mkEnv = (groundH) => ({
  ground: (x, z) => { const y = groundH(z); return { y: y + RIDE, n: [0, 1, 0], floor: y + RIDE } },
  sweep: (from, delta) => ({ delta, hit: false, n: null, soft: false, ride: false }),
  blocked: () => false,
  home: () => ({ x: 0, y: RIDE, z: 0, yaw: 0 }),
})
const cliff = mkEnv((z) => (z < Z0 ? H : 0)), flat = mkEnv(() => 0)

// über die Kante rollen, Druck `after` Schritte nach dem Abheben (ein Schritt lang)
function edge(after) {
  const d = createK2t(0, H + RIDE, 0, 0); let offAt = -1, jumps = [], vyPress = null, yPress = null, yMax = -Infinity
  for (let i = 0; i < 600; i++) {
    const press = offAt >= 0 && i === offAt + after
    stepK2t(d, { gas: true, jump: press }, DT, cliff)
    for (const e of d.events) { if (e.type === 'takeoff' && !e.jump && offAt < 0) offAt = i; if (e.type === 'takeoff' && e.jump) jumps.push({ i, vy: e.vy, via: e.via }) }
    if (press) { vyPress = d.vy; yPress = d.y }
    if (yPress != null && d.air) yMax = Math.max(yMax, d.y)
    if (offAt >= 0 && !d.air && i > offAt + after + 2) break
  }
  return { offAt, jumps, vyPress, rise: yPress == null ? 0 : yMax - yPress }
}
// eigener Sprung auf flachem Boden, zweiter Druck `after` Schritte später
function double(after) {
  const d = createK2t(0, RIDE, 0, 0); let at = -1, jumps = 0, vyBefore = null, vyAfter = null
  for (let i = 0; i < 200; i++) {
    const p1 = i === 60, p2 = at >= 0 && i === at + after
    if (p2) vyBefore = d.vy
    stepK2t(d, { gas: true, jump: p1 || p2 }, DT, flat)
    for (const e of d.events) if (e.type === 'takeoff' && e.jump) { jumps++; if (at < 0) at = i }
    if (p2) vyAfter = d.vy
  }
  return { jumps, vyBefore, vyAfter }
}
const early = edge(5), late = edge(12), dbl = double(5)
process.exit(report('k2t-coyote', {
  constant: k2t.JUMP?.coyote === 0.12,
  rolledOff: early.offAt > 0 && late.offAt > 0,
  coyoteJumpAt83ms: early.jumps.length === 1 && early.vyPress > 0 && early.rise > 0.3 * K,
  noJumpAt200ms: late.jumps.length === 0,
  noDoubleJump: dbl.jumps === 1 && dbl.vyAfter < dbl.vyBefore,
}, { early: { ...early, rise: +(early.rise / K).toFixed(2) }, late: { offAt: late.offAt, jumps: late.jumps.length }, dbl }))
