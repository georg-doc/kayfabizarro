// WS-NPC Phase D3 (R0.6 §3/§4, SPEC_NPC_PATROL_R1) · Treffer, Aggro und Cartoon-KO der Skelett-Patrouille (src/npc/groupPatrol.js), 60 Schritte/s:
//   1. Treffer: Warnung (Hit_A) + 1 Fluff · 2. Treffer: Drohung (Hit_B, Anführer lange Drohung) + 3 Fluff · 3. Treffer: Aggro (verlässt die Route, folgt dem
//   Spieler bis stopAt, Leine um den Austrittspunkt) · weitere Treffer: KO je Mitglied (liegt koS s, steht an Ort und Stelle auf, gleiche ID, zurück in
//   Formation) + 1 Fluff einmal je Mitglied und Fenster · Treffer auf Liegende zählen nicht · Ende (giveUpS ohne Treffer / Leine / Spieler weit) → zurück
//   zum Austrittspunkt → Route, aufholen bis exakt auf dem Plan · Fluff endlich, Tags eindeutig (mit Welttag je Gruppe und Tag) · nie ein Sprung · außerhalb der Blase sofort Plan · deterministisch
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { createGroupPatrol, GROUP } from '../../src/npc/groupPatrol.js'

const def = W.groups[0], DT = 1 / 60, ids = def.members.map((m) => m.id)
const C = {}, X = {}
const g0 = createGroupPatrol(def), T0 = 30, spot = g0.plan(T0)[0], yaw0 = g0.plan(T0)[0].yaw
const P0 = { x: spot.x + Math.cos(yaw0) * 5, z: spot.z - Math.sin(yaw0) * 5, y: 0 } // 5 m seitlich der Route
function run({ player = () => P0, near = () => true, hits = {}, until = 240 } = {}) {
  const g = createGroupPatrol(def), log = [], ev = []; let pv = null, maxStep = 0
  const H = Object.entries(hits).map(([t, id]) => [+t, id]).sort((a, b) => a[0] - b[0]); let hi = 0
  for (let i = 0; i * DT < until; i++) { const t = i * DT, nr = near(t), hs = []
    while (hi < H.length && H[hi][0] <= t + 1e-9) hs.push(H[hi++][1])
    const outs = g.step(t, DT, { player: player(t), near: nr, hits: hs })
    if (pv && nr && pv.near) outs.forEach((o, k) => { maxStep = Math.max(maxStep, Math.hypot(o.x - pv.o[k][0], o.z - pv.o[k][1])) })
    pv = { o: outs.map((o) => [o.x, o.z]), near: nr }
    for (const e of g.drainEvents()) ev.push(e)
    log.push({ t, mode: outs[0].mode, st: g.state(), clips: outs.map((o) => o.clip && [].concat(o.clip.name)[0]), pos: outs.map((o) => [o.x, o.z]), yaws: outs.map((o) => o.yaw), ko: outs.map((o) => o.ko), lag: g.lagAt(t) }) }
  return { g, log, ev, maxStep }
}
const at = (r, t) => r.log[Math.round(t / DT)]
// Ablauf 1: drei Treffer, dann KO von Rogue und Warrior, doppelter Treffer auf den liegenden Rogue, danach Ruhe
const hits = { 30: ids[0], 34: ids[1], 38: ids[2], 44: ids[1], 45: ids[1], 46: ids[0] }
const r = run({ hits })
const e = (type) => r.ev.filter((x) => x.type === type), fl = e('fluff')
C.hit1Warn = at(r, 30).st.hit.n === 1 && at(r, 30).clips[0] === 'Hit_A' && at(r, 30.5).mode === 'hit' && fl[0]?.n === 1
C.hit2Threat = at(r, 34).st.hit.n === 2 && at(r, 34).clips[1] === 'Hit_B' && at(r, 34).clips[0] === 'Skeletons_Taunt_Longer' && fl[1]?.n === 3
C.hit3Aggro = at(r, 38).mode === 'aggro' && e('aggro').length === 1 && fl.filter((x) => x.t < 38.5).length === 2 // die Aggro selbst wirft kein Fluff
// Aggro: Anführer geht auf den Spieler zu und bleibt bei stopAt stehen, schaut hin
const a43 = at(r, 43.9), dLead = Math.hypot(a43.pos[0][0] - P0.x, a43.pos[0][1] - P0.z)
C.aggroApproachesAndStops = Math.abs(dLead - GROUP.aggro.stopAt) < 0.05 && Math.abs(Math.atan2(Math.sin(a43.yaws[0] - Math.atan2(P0.x - a43.pos[0][0], P0.z - a43.pos[0][1])), Math.cos(a43.yaws[0] - Math.atan2(P0.x - a43.pos[0][0], P0.z - a43.pos[0][1])))) < 0.1
C.aggroTaunts = r.log.some((x) => x.t > 38.5 && x.t < 44 && x.clips[0] === 'Skeletons_Taunt')
// KO: Rogue liegt, zweiter Treffer auf den Liegenden zählt nicht, liegt koS s, steht auf (Awaken), gleiche ID, zurück in Formation
const ko = e('ko'), aw = e('awake')
C.koOncePerHitOnStanding = ko.length === 2 && ko[0].id === ids[1] && ko[1].id === ids[0] && r.g.state().stats.hits === 5
C.koLiesStill = (() => { const a = at(r, 44.1).pos[1], b = at(r, 53.9).pos[1]; return at(r, 44.1).ko[1] && at(r, 53.9).ko[1] && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9 && at(r, 44).clips[1] === 'Skeletons_Death' })()
C.koAwakensInPlace = aw.length === 2 && Math.abs(aw[0].t - (44 + GROUP.hit.koS)) < 0.05 && at(r, 54).clips[1] === 'Skeletons_Awaken_Floor' && !at(r, 54 + GROUP.hit.awakeS + 0.1).ko[1] && r.log.at(-1).pos.length === 3
C.koFluffOncePerMember = fl.filter((x) => /:ko:/.test(x.tag)).length === 2
C.fluffFiniteUniqueTags = fl.reduce((a, x) => a + x.n, 0) === 1 + 3 + 2 * GROUP.hit.koFluff && new Set(fl.map((x) => x.tag)).size === fl.length
// Ende: giveUpS nach dem letzten Treffer → calm → zurück → Route; holt auf bis exakt auf dem Plan
const calm = e('calm')[0], back = r.log.findIndex((x, i) => x.t > 46 && x.mode === 'patrol')
C.calmsAfterGiveUp = !!calm && Math.abs(calm.t - (46 + GROUP.aggro.giveUpS)) < 0.05
C.returnsToAnchor = back > 0 && (() => { const s = r.log[back - 1].st.anchor, p = r.log[back].pos[0]; return !!s && Math.hypot(p[0] - s.x, p[1] - s.z) < 0.06 })()
C.catchesUpOnPlan = r.log.at(-1).lag < 1e-6 && (() => { const pl = r.g.plan(r.log.at(-1).t); return r.log.at(-1).pos.every((p, k) => Math.hypot(p[0] - pl[k].x, p[1] - pl[k].z) < 1e-6) })()
// nie ein Sprung: höchstens Einrast-Schritt (Aufholen in Kurven) bzw. memberMax je Schritt
const stepMax = Math.max(GROUP.memberMax, def.speed * GROUP.catchK * GROUP.lockK) * DT + 1e-6
C.noJumpWhileNear = r.maxStep <= stepMax
X.r = { maxStep: +r.maxStep.toFixed(4), stepMax: +stepMax.toFixed(4), dLead: +dLead.toFixed(3), calmT: calm && +calm.t.toFixed(2), backT: back > 0 && +(back * DT).toFixed(2), stats: r.g.state().stats, fluff: fl.map((x) => [x.n, x.tag]) }
// Ablauf 2: Leine – Spieler läuft nach dem 3. Treffer davon (1,5 m/s), der Anführer folgt höchstens leashR, dann zurück
const away = (t) => (t < 39 ? P0 : { x: P0.x + Math.cos(yaw0) * (t - 39) * 1.5, z: P0.z - Math.sin(yaw0) * (t - 39) * 1.5, y: 0 })
const r2 = run({ player: away, hits: { 30: ids[0], 34: ids[0], 38: ids[0] }, until: 200 })
const calm2 = r2.ev.find((x) => x.type === 'calm')
C.leashHolds = !!calm2 && r2.g.state().stats.maxLeash <= GROUP.aggro.leashR + 0.05 && r2.g.state().stats.maxLeash > GROUP.aggro.leashR - 0.5 && calm2.t < 38 + GROUP.aggro.giveUpS
C.leashBackOnPlan = r2.log.at(-1).lag < 1e-6 && r2.maxStep <= stepMax
X.r2 = { maxLeash: +r2.g.state().stats.maxLeash.toFixed(2), calmT: calm2 && +calm2.t.toFixed(2) }
// Ablauf 3: Fenster – nach disengageS ohne Treffer beginnt die Zählung neu (wieder Warnung, neue Tags)
const r3 = run({ hits: { 30: ids[0], [30 + GROUP.hit.disengageS + 1]: ids[0] }, until: 90 })
const f3 = r3.ev.filter((x) => x.type === 'fluff')
C.windowResets = f3.length === 2 && f3[0].n === 1 && f3[1].n === 1 && f3[0].tag !== f3[1].tag && r3.g.state().hit.win === 2
// Ablauf 4: außerhalb der Blase während der Aggro → sofort Plan, Begegnung vorbei, KO aufgehoben
const r4 = run({ hits: { 30: ids[0], 34: ids[0], 38: ids[0], 40: ids[1] }, near: (t) => !(t >= 42 && t < 60), until: 61 })
const b4 = at(r4, 60), p4 = r4.g.plan(b4.t)
C.outOfBubbleSnapsAndResets = b4.mode === 'patrol' && b4.ko.every((k) => !k) && b4.pos.every((p, k) => Math.hypot(p[0] - p4[k].x, p[1] - p4[k].z) < 1e-6) && b4.st.hit.n === 0
// Treffer außerhalb der Blase zählen nicht
const r5 = run({ hits: { 30: ids[0] }, near: (t) => t < 25, until: 35 })
C.noHitsOutsideBubble = r5.ev.length === 0
// mit Welttag: zweites Fenster am selben Tag hat dieselben Tags (Wirt gibt kein neues Fluff), am nächsten Tag neue
const tags = (day) => { const g = createGroupPatrol(def), out = []; for (let i = 0; i * DT < 90; i++) { const t = i * DT; g.step(t, DT, { player: P0, near: true, day: day(t), hits: i === 1800 || i === 1800 + 60 * (GROUP.hit.disengageS + 1) ? [ids[0]] : [] }); out.push(...g.drainEvents().filter((x) => x.type === 'fluff').map((x) => x.tag)) } return out }
const sameDay = tags(() => 3), nextDay = tags((t) => (t < 60 ? 3 : 4))
C.fluffPerDayFinite = sameDay.length === 2 && sameDay[0] === sameDay[1] && nextDay[0] !== nextDay[1] && /:d3:/.test(nextDay[0]) && /:d4:/.test(nextDay[1])
C.deterministic = JSON.stringify(run({ hits, until: 80 }).log.at(-1)) === JSON.stringify(run({ hits, until: 80 }).log.at(-1))
process.exit(report('unit-groupAggro (WS-NPC Phase D3, Treffer, Aggro, Cartoon-KO)', C, X))
