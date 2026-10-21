// Elan S1 · Ringkurs ohne Browser: Gelände wie M1 (terrainHeight), Autopilot im Schwungflug (Nase und Gierung auf den nächsten Ring, A/D-Rate begrenzt,
// Steigen/Schub bei Bedarf). Prüft: Kurs ist mit dem Elan-Modell fliegbar (alle 10 Ringe in ≤ 120 s), Zeit läuft nur zwischen erstem und letztem Ring,
// Reihenfolge zählt (ein ausgelassener Ring hält den Lauf an), Ringe liegen über dem Gelände.
import { createElan, elanStep, elanSpeed, ELAN } from '../src/m1/elan.js'
import { makeCourse, createRun, stepRun } from '../src/m1/elanCourse.js'
import { terrainHeight } from '../src/modules/m1-terrain.js'
const DT = 1 / 60, env = { ground: (x, z) => terrainHeight(x, z), sweep: (p, d) => ({ delta: d, hit: false }) }
const course = makeCourse(terrainHeight), run = createRun(course)
const r0 = course.rings[0], st = createElan({ pos: [r0.pos[0] - r0.normal[0] * 40, r0.pos[1] + 6, r0.pos[2] - r0.normal[2] * 40], yaw: Math.atan2(r0.normal[0], r0.normal[2]), speed: 30 })
let t = 0, minClear = 1e9; const events = []
while (!run.done && t < 120) {
  const tg = course.rings[Math.min(run.next, 9)].pos, d = [tg[0] - st.pos[0], tg[1] - st.pos[1], tg[2] - st.pos[2]], hd = Math.hypot(d[0], d[2])
  const wantYaw = Math.atan2(d[0], d[2]), dy = Math.atan2(Math.sin(wantYaw - st.yaw), Math.cos(wantYaw - st.yaw)), pitch = Math.max(-0.7, Math.min(0.6, Math.atan2(d[1], hd)))
  const a = [...st.pos]; elanStep(st, { mousePitch: pitch, left: dy > 0.03, right: dy < -0.03, space: d[1] > 6 && st.charges > 1 && (t % 1) < DT, shift: elanSpeed(st) < 25 && st.charges > 2 && (t % 1.5) < DT }, DT, env)
  const ev = stepRun(run, a, st.pos, DT); if (ev) events.push({ ...ev, t: +t.toFixed(2) }); t += DT
  minClear = Math.min(minClear, st.pos[1] - terrainHeight(st.pos[0], st.pos[2]))
}
const ringsAbove = course.rings.every((r) => r.pos[1] - terrainHeight(r.pos[0], r.pos[2]) >= 9)
// Reihenfolge: Ring 1 vor Ring 0 durchflogen zählt nicht
const run2 = createRun(course), r1 = course.rings[1], n = r1.normal, skip = stepRun(run2, [r1.pos[0] - n[0], r1.pos[1] - n[1], r1.pos[2] - n[2]], [r1.pos[0] + n[0], r1.pos[1] + n[1], r1.pos[2] + n[2]], DT)
const out = { done: run.done, courseTime: run.last && +run.last.toFixed(2), flightTime: +t.toFixed(1), rings: run.passes.length, minClear: +minClear.toFixed(1), ringsAbove, orderEnforced: skip === null && run2.next === 0, firstEvent: events[0], lastEvent: events.at(-1) }
const checks = { flyable10in120s: run.done && run.passes.length === 10, timeStartsAtFirstRing: events[0]?.type === 'start' && run.last > 0 && run.last < t, orderEnforced: out.orderEnforced, ringsAboveTerrain: ringsAbove }
console.log(JSON.stringify({ ...out, checks }))
const fail = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
console.log(fail.length ? 'FAIL elan-course: ' + fail.join(', ') : 'PASS elan-course'); process.exit(fail.length ? 1 : 0)
