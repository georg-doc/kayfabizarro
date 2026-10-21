// WS-NPC Phase C P1 (V-583, Lead-OK 21.10. b) · tainted-Kügelchen in der Ernte (src/world/harvest.js createOrchard): fallen und kommen zur Ruhe wie
// alle anderen (native Gelände-Physik, gleiche Bahnen), sind aber nicht aufsammelbar; unberührte Kügelchen desselben Gartens bleiben aufsammelbar.
// Die Darstellung (dunkle Instanzfarbe, Einsinken) prüft der Browser-Test fluffer.
import { report, readJson } from './_report.mjs'
import { terrainFrom } from '../../src/world/fluff.js'
import { fruitFromAnchors } from '../../src/world/grammar.js'
import { createOrchard, createHarvestState } from '../../src/world/harvest.js'

const J = readJson('src/data/world/kaykit-tree-fluff-anchors.v1.json'), canopy = Object.keys(J.models).filter((k) => J.models[k].kind === 'canopy')
const terrain = terrainFrom(0)
function run(taintT0) {
  const trees = [0, 1].map((i) => ({ id: 't' + i, balls: fruitFromAnchors(J, canopy[i % canopy.length], i, { id: 't' + i, zone: 'z', place: { pos: [i * 8, 0, 0], rotY: 0, scale: 0.616 } }).hanging }))
  const o = createOrchard({ zone: 'z', seed: 3, trees, terrain, state: createHarvestState() })
  if (taintT0) for (const b of trees[0].balls) b.tainted = true
  o.hit('t0', 'explosion'); o.hit('t1', 'explosion')
  for (let k = 0; k < 60 * 12; k++) o.advance(1 / 60)
  const rest = o.balls.filter((b) => b.state === 'resting')
  const got0 = trees[0].balls.flatMap((b) => (b.state === 'resting' ? o.collect({ pos: b.body.p, mode: 'walk' }).keys : []))
  const got1 = trees[1].balls.flatMap((b) => (b.state === 'resting' ? o.collect({ pos: b.body.p, mode: 'walk' }).keys : []))
  return { o, trees, rest: rest.length, got0, got1, paths: trees[0].balls.map((b) => b.body?.p.map((v) => +v.toFixed(6)).join(',')).join('|') }
}
const plain = run(false), dark = run(true)
process.exit(report('unit-taint (WS-NPC Phase C, tainted nicht aufsammelbar)', {
  taintedFallAndRestLikeOthers: dark.rest === plain.rest && dark.rest > 0 && dark.paths === plain.paths,
  taintedNotCollectable: dark.got0.length === 0 && plain.got0.length > 0,
  othersStillCollectable: dark.got1.length > 0 && dark.got1.length === plain.got1.length,
  noTaintedMarkedCollected: dark.trees[0].balls.every((b) => b.state !== 'collected'),
}, { rest: dark.rest, plainGot0: plain.got0.length, got1: dark.got1.length }))
