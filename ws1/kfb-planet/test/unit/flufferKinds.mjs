// WS-NPC K15 (Lead 22.10.) · Plan der Dark Fluffer je Obstgarten-Zone (src/npc/flufferKinds.js) mit den Daten aus residents.r1.json und
// fluffer.kinds.k15.json, ohne Browser: drei Zonen an eigenen Bäumen · goblin bleibt Ghost · atlantis zuerst Mushroom · Sorten je Durchgang
// verschieden und aus den 15 · gleicher Tag = gleiche Sorten (Seed) · Erscheinen n bei T0 + offsetS + n·dayS · Routen frei (Bäume, Loot, Laternen)
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import KF from '../../src/data/npc/fluffer.kinds.k15.json' with { type: 'json' }
import { appearanceAt, kindsForDay } from '../../src/npc/flufferKinds.js'
import { npcWorldObstacles } from '../../src/npc/npcWorld.js'

const C = {}, F = W.fluffers, kinds = KF.kinds.map((k) => k.kind)
C.threeZonesOwnTrees = F.length === 3 && new Set(F.map((f) => f.tree.zone)).size === 3 && F.map((f) => f.tree.zone).join() === 'goblin,atlantis,utopia' && F[0].tree.id === 't4'
C.kindsIndex = kinds.length === 15 && KF.kinds.every((k) => /^[0-9a-f]{64}$/.test(k.sha256) && /^KFB_\w+_healed\.k11c\.glb$/.test(k.file)) && !kinds.includes('ghost')
const days = Array.from({ length: 40 }, (_, d) => ({ d, n0: kindsForDay(F, kinds, d, () => 0), n1: kindsForDay(F, kinds, d, () => 1) }))
C.goblinGhost = days.every(({ n0, n1 }) => n0.dark_fluffer_ghost === 'ghost' && n1.dark_fluffer_ghost === 'ghost')
C.atlantisMushroomFirst = days.every(({ n0 }) => n0.dark_fluffer_atlantis === 'mushroom')
C.distinctFromPool = days.every(({ n0, n1 }) => [n0, n1].every((m) => new Set(Object.values(m)).size === 3 && [m.dark_fluffer_atlantis, m.dark_fluffer_utopia].every((k) => kinds.includes(k))))
C.seededByDay = JSON.stringify(kindsForDay(F, kinds, 5, () => 1)) === JSON.stringify(kindsForDay(F, kinds, 5, () => 1)) && new Set(days.map(({ n1 }) => n1.dark_fluffer_utopia)).size >= 6
const ap = (f, t) => appearanceAt(f, 4, W.dayS, t)
C.schedule = ap(F[1], 0).n === 0 && ap(F[1], 0).t0 === 24 && ap(F[1], 24 + W.dayS - 0.01).n === 0 && ap(F[1], 24 + W.dayS).n === 1 && ap(F[2], 44 + 2 * W.dayS).t0 === 44 + 2 * W.dayS
// Routen frei wie beim Ghost: start → via → stand mindestens 2 m von fremden Bäumen, Loot und Laternen; stand 3,9 m, target 1,2 m vor dem eigenen Stamm
const O = npcWorldObstacles(), pts = [...O.trees.map((t) => ({ ...t, k: t.ref })), ...O.loot, ...O.lanterns]
let clr = Infinity, geo = true
for (const f of F.slice(1)) {
  const P = [f.start, ...f.via, f.stand], tree = O.trees.find((t) => t.ref === `orchard:${f.tree.zone}:${f.tree.id}`)
  geo &&= Math.abs(Math.hypot(f.stand[0] - tree.x, f.stand[1] - tree.z) - 3.9) < 0.1 && Math.abs(Math.hypot(f.target[0] - tree.x, f.target[1] - tree.z) - 1.2) < 0.1
  for (let i = 1; i < P.length; i++) for (let s = 0; s <= 1; s += 0.02) { const x = P[i - 1][0] + (P[i][0] - P[i - 1][0]) * s, z = P[i - 1][1] + (P[i][1] - P[i - 1][1]) * s
    for (const p of pts) if (p.k !== tree.ref) clr = Math.min(clr, Math.hypot(p.x - x, p.z - z)) }
}
C.routesClear = clr >= 2 && geo
process.exit(report('unit-flufferKinds (WS-NPC K15, Dark Fluffer je Obstgarten-Zone)', C, { day0: days[0].n0, day1n1: days[1].n1, day2n1: days[2].n1, clr: +clr.toFixed(2) }))
