// WS-NPC A2–A4 · Live-Schicht (src/npc/residentSim.js) mit den echten Daten (residents.r1.json), 60 Schritte/s wie M1Loop:
// (1) ohne Spieler deckt sich die Live-Lage exakt mit dem Plan; (2) jeden Tag genau eine Begegnung mit der vollen Grammatik und stabiler ID;
// (3) Spieler unterbricht Farmer B auf dem Weg: Stillstand, Drehung zum Spieler, danach Aufholen ≤ 1,25 × Plantempo bis zum Plan, nie ein Sprung;
// (4) Spieler kommt mitten in die Begegnung: Pause am selben Beat, danach Fortsetzen; bleibt er, bricht das Plan-Fenster sie sauber ab;
// (5) weggehen (außerhalb der Blase) und zurückkommen: beide stehen exakt auf dem Plan; (6) gleiche Eingabe = gleiche Folge.
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { buildRoutes, planAt, meetingAt } from '../../src/npc/npcDay.js'
import { createResidentSim, SIM } from '../../src/npc/residentSim.js'

const ctx = { pois: Object.fromEntries(W.pois.map((p) => [p.id, p])), routes: buildRoutes(W.routes), dayS: W.dayS }
const DT = 1 / 60, fb = W.days.find((d) => d.residentId === 'farmer_b'), lk = W.days.find((d) => d.residentId === 'lorekeeper')
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))
function run({ from = 0, to = W.dayS, player = () => null, near = () => true, each = () => {}, rules = SIM } = {}) {
  const sim = createResidentSim({ days: W.days, ctx, activities: W.activities, rules })
  let prev = null, maxStep = 0, n = 0
  for (let k = Math.round(from / DT); k < Math.round(to / DT); k++) {
    const t = k * DT, pl = player(t), nr = near(t)
    const outs = sim.step(t, DT, { player: pl, near: () => nr })
    if (prev && nr && prev.near) outs.forEach((o, i) => { maxStep = Math.max(maxStep, Math.hypot(o.x - prev.o[i].x, o.z - prev.o[i].z) / (W.days[i].speed * SIM.catchK * DT)) })
    prev = { o: outs.map((o) => ({ x: o.x, z: o.z })), near: nr }
    each(t, outs, sim); n++
  }
  return { sim, maxStep, n }
}
const C = {}, X = {}
// (1) Plan-Treue ohne Spieler, ein ganzer Tag
let dev1 = 0
const r1 = run({ each: (t, outs) => outs.forEach((o, i) => { const p = planAt(W.days[i], ctx, t); dev1 = Math.max(dev1, Math.hypot(o.x - p.x, o.z - p.z)) }) })
C.followsPlanExactly = dev1 <= 1e-6
C.neverFasterThanPlan = r1.sim.brains.every((b) => b.state().stats.maxSpeedK <= 1 + 1e-6)
X.dev1 = dev1
// (2) Begegnung je Tag, drei Tage
const r2 = run({ to: 3 * W.dayS })
const byKey = {}; for (const e of r2.sim.encounter().log) (byKey[e.id] ||= []).push(e.beat)
const keys = Object.keys(byKey)
C.oneEncounterPerDay = keys.length === 3 && keys.every((k, d) => k === meetingAt(fb, lk, ctx, d * W.dayS + 0.33 * W.dayS).key)
C.fullGrammarEachDay = keys.every((k) => ['notice,approach,orient,greet,react,part,resume', 'notice,approach,orient,silent,react,part,resume'].includes(byKey[k].join(',')))
X.encounters = byKey
// (3) Spieler stellt sich Farmer B in den Weg (Tag 0, Weg zur Arbeit), 4 s, dann geht er
const p0 = planAt(fb, ctx, 25)
let held = 0, faced = false, lagMax = 0, caught = null, ip = null
const r3 = run({ to: 120, player: (t) => (t >= 25 && t < 29 ? (ip ||= { x: p0.x + 1.5, z: p0.z + 1.5, y: 0 }) : { x: 60, z: 60, y: 0 }), each: (t, outs, sim) => {
  const o = outs[0]
  if (t > 25.1 && t < 29) { if (o.speed < 1e-6) held++; if (Math.abs(wrap(o.yaw - Math.atan2(ip.x - o.x, ip.z - o.z))) < 0.05) faced = true }
  lagMax = Math.max(lagMax, o.lag); if (t > 29 && caught === null && o.lag < 1e-6 && lagMax > 0) caught = t } })
const s3 = r3.sim.byId.get('farmer_b').state().stats
C.stopsForPlayer = held > 200
C.turnsToPlayer = faced
C.catchesUpToPlan = caught !== null && caught < planAt(fb, ctx, 25).stayEnd
C.catchUpWithinGaitWindow = s3.maxSpeedK <= SIM.catchK + 1e-6 && s3.maxSpeedK > 1.01
C.noTeleportWhileNear = r3.maxStep <= 1 + 1e-6
X.interrupt = { held, lagMax: +lagMax.toFixed(2), caught: caught && +caught.toFixed(2), maxSpeedK: +s3.maxSpeedK.toFixed(3), maxStep: +r3.maxStep.toFixed(3) }
// (4a) Spieler tritt in die laufende Begegnung (Tag 0, im Entscheidungs-Takt greet/silent), 3 s, geht wieder → Pause, dann gleicher Beat weiter
const m0 = meetingAt(fb, lk, ctx, 0.33 * W.dayS)
const fbSpot = ctx.pois.fb_social.pos
let pauseSeen = null, beatAtPause = null, beatAfter = null, tP = null
const r4 = run({ from: m0.start - 40, to: m0.end + 5, player: (t) => (tP !== null && t < tP + 3 ? { x: fbSpot[0] + 1.2, z: fbSpot[1] + 1.4, y: 0 } : { x: 60, z: 60, y: 0 }), each: (t, outs, sim) => {
  const c = sim.host.current
  if (tP === null && c && (c.beat === 'greet' || c.beat === 'silent')) tP = t // Entscheidungs-Takt (je nach Tag greet oder silent)
  if (c?.paused && pauseSeen === null) { pauseSeen = t; beatAtPause = c.beat }
  if (pauseSeen !== null && beatAfter === null && c && !c.paused) beatAfter = c.beat } })
const log4 = r4.sim.encounter().log.filter((e) => e.id === m0.key).map((e) => e.beat)
C.encounterPausesForPlayer = pauseSeen !== null && beatAtPause === beatAfter
C.encounterCompletesOrCancelsCleanly = log4.at(-1) === 'resume' && !r4.sim.host.isActive && log4[0] === 'notice'
X.joinEncounter = { pauseSeen: pauseSeen && +pauseSeen.toFixed(2), beatAtPause, beatAfter, log4 }
// (4b) Spieler stellt sich ab 'notice' zwischen beide und bleibt länger als das Fenster (Haltegrenze hier 30 s statt 9 s) → das Plan-Fenster reicht nicht mehr → Abbruch (part, resume), frei
const mid = { x: (ctx.pois.fb_social.pos[0] + ctx.pois.lk_social.pos[0]) / 2, z: (ctx.pois.fb_social.pos[1] + ctx.pois.lk_social.pos[1]) / 2 + 1.2, y: 0 }
const r4b = run({ from: m0.start - 40, to: m0.end + 5, player: (t) => (t >= m0.start - 2.5 ? mid : { x: 60, z: 60, y: 0 }), rules: { ...SIM, holdMaxS: 30 } })
const log4b = r4b.sim.encounter().log.filter((e) => e.id === m0.key)
C.windowEndCancels = log4b.some((e) => e.cancelled === 'window-end') && log4b.at(-1).beat === 'resume' && !r4b.sim.host.isActive
X.stay = log4b.map((e) => e.beat + (e.cancelled ? '!' : ''))
// (5) weggehen 70 s (außerhalb der Blase), zurückkommen: exakt auf dem Plan, danach stetig
let devBack = null, devAfter = 0
const r5 = run({ from: 20, to: 140, near: (t) => !(t >= 50 && t < 120), each: (t, outs) => {
  outs.forEach((o, i) => { const p = planAt(W.days[i], ctx, t), d = Math.hypot(o.x - p.x, o.z - p.z); if (Math.abs(t - 120) < DT / 2) devBack = Math.max(devBack ?? 0, d); if (t > 120) devAfter = Math.max(devAfter, d) }) } })
C.backExactlyOnPlan = devBack !== null && devBack <= 1e-6
C.continuousAfterReturn = devAfter <= 1e-6 && r5.maxStep <= 1 + 1e-6
X.away = { devBack, devAfter }
// (6) Determinismus
const sig = (r) => JSON.stringify(r.sim.brains.map((b) => [b.out.x, b.out.z, b.out.yaw])) + JSON.stringify(r.sim.encounter().log)
C.deterministic = sig(run({ to: 150 })) === sig(run({ to: 150 }))

process.exit(report('unit-npcSim (WS-NPC A2–A4, Plan, Begegnung, Unterbrechen, Weggehen)', C, X))
