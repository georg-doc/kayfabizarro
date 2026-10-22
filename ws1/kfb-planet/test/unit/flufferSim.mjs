// WS-NPC Phase C P1 (V-583) · Ablauf des Dark Fluffers (src/npc/flufferSim.js) mit den Daten aus residents.r1.json (fluffers[0], Ghost am Goblin-Baum t4):
// Anmarsch → 3 Spucken (Ansage 0,34 s, Flug nach Distanz, Aufprall = Fleck 0,4/0,7/1,0) → tainted nach dem 1., Abwurf nach dem 2. Aufprall → lauern;
// Heilen: sofort kein Abgang mehr, EIN bunter Fluff-Burst, Fleck verblasst, friedlich; ohne Heilen läuft der Fleck nach expireS ab und der Fluffer geht.
// Determinismus: gleicher Seed = gleiche Ereignisse, anderer Seed = andere Aufprallpunkte; Ereignisse kommen genau einmal, auch bei grober Abtastung.
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { createFlufferSim, FLUFFER } from '../../src/npc/flufferSim.js'

const def = { ...W.fluffers[0], t0: 10 }
const collect = (sim, T, dt, onT = () => {}) => { const ev = []; for (let t = 0; t <= T + 1e-9; t += dt) { onT(t, sim); ev.push(...sim.events(t - dt, t)) } return ev }
const a = createFlufferSim(def), evA = collect(a, 400, 1 / 60)
const types = evA.map((e) => e.type)
const impacts = evA.filter((e) => e.type === 'impact')
const C = {}
C.threeSpitsThreeImpacts = types.filter((t) => t === 'spit').length === 3 && impacts.length === 3
C.windupBeforeSpit = a.spits.every((s) => Math.abs(s.release - s.windup - FLUFFER.windup) < 1e-9)
C.patchGrowsInSteps = [0, 1, 2].every((k) => Math.abs(a.at(a.spits[k].impact + 0.01).patch.amount - FLUFFER.amounts[k]) < 1e-9) && a.at(a.spits[0].impact - 0.01).patch === null
C.taintAfterFirstDropAfterSecond = Math.abs(evA.find((e) => e.type === 'taint').t - a.spits[0].impact) < 1e-9 && Math.abs(evA.find((e) => e.type === 'drop').t - a.spits[1].impact) < 1e-9
C.finiteNoMoreSpits = types.filter((t) => t === 'spit').length === FLUFFER.spits
C.expiresWithoutHeal = a.at(a.lastImpact + FLUFFER.expireS + FLUFFER.fadeS + 0.1).patch === null && types.includes('gone') && !types.includes('burst')
C.walksToStandThenFacesTarget = a.at(def.t0 + 1).phase === 'anmarsch' && a.at(a.spits[0].windup + 0.1).phase === 'spucken' && a.at(a.spits[0].windup + 0.1).clip === 'Bite_Front'
// Heilen mitten im zweiten Spucken (nach dem Abgang): fliegende Spucke landet noch, dritte kommt nie
const b = createFlufferSim(def); let healed = null
const evB = collect(b, 400, 1 / 60, (t, s) => { if (healed === null && t >= b.spits[1].release + 0.1) { healed = s.heal(t) ? t : null } })
C.healOnce = healed !== null && b.heal(healed + 5) === false
C.healStopsSpitting = evB.filter((e) => e.type === 'spit').length === 2 && evB.filter((e) => e.type === 'impact').length === 2
C.healBurstOnce = evB.filter((e) => e.type === 'burst').length === 1 && evB.find((e) => e.type === 'burst').n === 6 && evB.find((e) => e.type === 'burst').tag === `heal:${def.id}`
C.healFadesPatch = b.at(healed + FLUFFER.fadeS + 0.01).patch === null && b.at(healed + FLUFFER.fadeS * 0.5).patch.amount < 0.7 && !b.at(healed + 1).hostile && !b.at(healed + 1).target
C.healedJoyClips = b.at(healed + 0.2).clip === 'Yes' && b.at(healed + FLUFFER.joyS * 0.75).clip === 'Dance'
C.healedNotGone = !evB.some((e) => e.type === 'gone') && b.at(399).phase === 'geheilt'
// Heilen schon im Anmarsch: nie gespuckt, trotzdem genau ein Burst
const c = createFlufferSim(def), evC = collect(c, 200, 1 / 60, (t, s) => { if (t >= def.t0 + 2 && t < def.t0 + 2 + 1 / 60) s.heal(t) })
C.healDuringApproach = evC.filter((e) => e.type === 'spit').length === 0 && evC.filter((e) => e.type === 'burst').length === 1
// Determinismus und grobe Abtastung
C.deterministic = JSON.stringify(collect(createFlufferSim(def), 400, 1 / 60)) === JSON.stringify(evA)
C.otherSeedOtherImpacts = JSON.stringify(createFlufferSim({ ...def, seed: def.seed + 1 }).spits.map((s) => s.at)) !== JSON.stringify(a.spits.map((s) => s.at))
C.eventsOnceWithCoarseSteps = JSON.stringify(collect(createFlufferSim(def), 400, 0.5).map((e) => [e.type, e.k ?? null])) === JSON.stringify(evA.map((e) => [e.type, e.k ?? null]))
C.impactsNearTarget = impacts.every((e) => Math.hypot(e.at[0] - def.target[0], e.at[1] - def.target[1]) <= FLUFFER.impactJitter + 1e-9)
// WS0 V-616: Fleck zieht mit der Größe mit (patchR gilt für refH 1,1 m); Daten heightM 0,8
const pr = (h) => { const s = createFlufferSim({ ...def, heightM: h }); return s.at(s.spits[0].impact + 0.01).patch.r }
C.patchScalesWithHeight = def.heightM === 0.8 && Math.abs(pr(0.8) - FLUFFER.patchR * 0.8 / FLUFFER.refH) < 1e-9 && Math.abs(pr(1.1) - FLUFFER.patchR) < 1e-9
process.exit(report('unit-flufferSim (WS-NPC Phase C P1)', C, { arrive: +a.arrive.toFixed(2), spits: a.spits.map((s) => +s.impact.toFixed(2)), healed, types: types.join(',') }))
