// WS-NPC Phase D (SPEC_NPC_PATROL_R1) · Skelett-Patrouille (src/npc/groupPatrol.js, Daten residents.r1.json groups[0]), 60 Schritte/s:
//   Fahrplan: Lage = reine Funktion der Zeit (stetig, Halte an zwei Punkten), Formation (Folger hinter und seitlich vom Anführer, Abstand stabil)
//   Bemerken: Spieler ≤ notice.r → alle halten, schauen hin, Anführer Skeletons_Taunt, nach holdS weiter, holen ≤ 1,25 × auf; Abklingzeit
//   Weggehen/Zurückkommen: außerhalb der Blase exakt auf dem Plan, im Bild nie ein Sprung; gleiche Eingabe = gleiche Folge
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { createGroupPatrol, GROUP } from '../../src/npc/groupPatrol.js'

const def = W.groups[0], DT = 1 / 60
const C = {}, X = {}
const g0 = createGroupPatrol(def)
// Plan stetig, Halte
let maxJump = 0, prev = null, waitSteps = 0
for (let t = 0; t < 2 * g0.lapT; t += DT) { const p = g0.plan(t)[0]; if (prev) { const d = Math.hypot(p.x - prev.x, p.z - prev.z); maxJump = Math.max(maxJump, d); if (d < 1e-9) waitSteps++ } prev = p }
C.planContinuous = maxJump <= def.speed * DT * (1 + 2 * GROUP.accordion.amp) + 1e-6
C.stopsWait = Math.abs(waitSteps * DT - 2 * def.route.stops.reduce((a, s) => a + s.wait, 0)) < 0.2
// Formation: Folger hinter dem Anführer (Abstand ≈ hypot(back, side) ± Ziehharmonika, in Kurven enger), nie näher als 0,9 m
let fMin = Infinity, fMax = 0
for (let t = 1; t < g0.lapT; t += 0.5) { const [a, b, c] = g0.plan(t); for (const f of [b, c]) { const d = Math.hypot(f.x - a.x, f.z - a.z); fMin = Math.min(fMin, d); fMax = Math.max(fMax, d) } }
const want = Math.hypot(def.members[1].back, def.members[1].side)
C.formationStable = fMin > 0.9 && fMax < want + 0.6 // in Kurven rückt der innere Folger näher, nie auf Tuchfühlung
X.formation = { fMin: +fMin.toFixed(2), fMax: +fMax.toFixed(2), want: +want.toFixed(2) }
// Bemerken: Spieler steht 4 s neben der Route, dort wo die Gruppe gleich vorbeikommt
function run({ player = () => null, near = () => true, until = 120 } = {}) {
  const g = createGroupPatrol(def), log = []; let pv = null, maxStep = 0
  for (let t = 0; t < until; t += DT) { const pl = player(t), nr = near(t), outs = g.step(t, DT, { player: pl, near: nr })
    if (pv && nr && pv.near) outs.forEach((o, k) => { maxStep = Math.max(maxStep, Math.hypot(o.x - pv.o[k][0], o.z - pv.o[k][1]) / (def.speed * GROUP.catchK * DT * 1.6)) })
    pv = { o: outs.map((o) => [o.x, o.z]), near: nr }
    log.push({ t, mode: outs[0].mode, clips: outs.map((o) => o.clip && [].concat(o.clip.name)[0]), yaws: outs.map((o) => o.yaw), pos: outs.map((o) => [o.x, o.z]), lag: g.lagAt(t) }) }
  return { g, log, maxStep }
}
const meet = 30, spot = g0.plan(meet)[0], pl = { x: spot.x + 3.5, z: spot.z + 1.5, y: 0 }
const r1 = run({ player: (t) => (t >= meet - 6 && t < meet + 2 ? pl : { x: 200, z: 200 }), until: 90 })
const a0 = r1.log.findIndex((e) => e.mode === 'alert'), a1 = r1.log.findIndex((e, i) => i > a0 && e.mode !== 'alert')
C.noticesOnce = r1.g.state().stats.alerts === 1 && a0 > 0
C.leaderTaunts = r1.log[a0].clips[0] === 'Skeletons_Taunt' && r1.log[a0].clips.slice(1).every((c) => c === 'Skeletons_Idle')
C.holdsAndFaces = (() => { const e = r1.log[a1 - 1]; return e.pos.every((p, k) => Math.abs(Math.atan2(Math.sin(e.yaws[k] - Math.atan2(pl.x - p[0], pl.z - p[1])), Math.cos(e.yaws[k] - Math.atan2(pl.x - p[0], pl.z - p[1])))) < 0.1) && Math.hypot(r1.log[a0 + 30].pos[0][0] - r1.log[a1 - 1].pos[0][0], r1.log[a0 + 30].pos[0][1] - r1.log[a1 - 1].pos[0][1]) < 1e-9 })()
C.holdDuration = Math.abs((a1 - a0) * DT - def.notice.holdS) < 0.05
C.catchesUp = r1.log.at(-1).lag < 1e-6 && r1.g.state().stats.maxSpeedK <= GROUP.catchK + 1e-6 && r1.g.state().stats.maxSpeedK > 1.01
C.noJumpWhileNear = r1.maxStep <= 1.3 // äußerer Folger in der Kurve: Radius (cornerR + side)/cornerR ≈ 1,5 × Tempo, dazu Aufholen; Teleport läge weit darüber
X.notice = { a0t: +(a0 * DT).toFixed(2), holdS: +((a1 - a0) * DT).toFixed(2), maxSpeedK: +r1.g.state().stats.maxSpeedK.toFixed(3), maxStep: +r1.maxStep.toFixed(3) }
// Weggehen 40 s (außerhalb der Blase), zurückkommen: exakt auf dem Plan
const r2 = run({ near: (t) => !(t >= 20 && t < 60), until: 70 })
const back = r2.log.find((e) => e.t >= 60 - 1e-9), plan60 = r2.g.plan(back.t)
C.backOnPlan = back.pos.every((p, k) => Math.hypot(p[0] - plan60[k].x, p[1] - plan60[k].z) < 1e-6)
C.deterministic = JSON.stringify(run({ until: 50 }).log.at(-1)) === JSON.stringify(run({ until: 50 }).log.at(-1))
process.exit(report('unit-groupPatrol (WS-NPC Phase D, Skelett-Patrouille)', C, { L: +g0.length.toFixed(1), lapT: +g0.lapT.toFixed(1), maxJump: +maxJump.toFixed(4), waitS: +(waitSteps * DT).toFixed(2), ...X }))
