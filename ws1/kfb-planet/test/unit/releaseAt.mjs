// WS-NPC Phase C P1 (V-583, Lead-OK 21.10. c) · fluff.releaseAt(pos, n, seed): n Kügelchen an einem Punkt (geheilter Dark Fluffer), gleiche Physik wie
// der Baum-Abwurf. Prüft: nur die sechs Sorten (ab n ≥ 6 jede mindestens einmal), deterministisch je Seed, andere Seeds andere Bahnen, über
// createOrchard.addFalling fallen sie, kommen zur Ruhe (ohne Einsinken) und sind aufsammelbar; gleicher Schlüssel zweimal wird nicht doppelt aufgenommen.
import { report } from './_report.mjs'
import { releaseAt, FLUFF_KINDS, terrainFrom } from '../../src/world/fluff.js'
import { createOrchard, createHarvestState } from '../../src/world/harvest.js'

const terrain = terrainFrom(0), pos = [2, 1.1, -3]
const a = releaseAt(pos, 6, 9, { tag: 'heal:ghost:d0' }), b = releaseAt(pos, 6, 9, { tag: 'heal:ghost:d0' }), c = releaseAt(pos, 6, 10, { tag: 'heal:ghost:d0' })
const sig = (l) => JSON.stringify(l.map((x) => [x.key, x.kind, x.body.v]))
const sA = sig(a), sB = sig(b), sC = sig(c) // vor der Simulation (a wird danach bewegt)
const st = createHarvestState(), o = createOrchard({ zone: 'burst', trees: [], terrain, state: st })
const added = o.addFalling(a), again = o.addFalling(releaseAt(pos, 6, 9, { tag: 'heal:ghost:d0' }))
for (let k = 0; k < 60 * 12; k++) o.advance(1 / 60)
const rest = o.balls.filter((x) => x.state === 'resting'), sink = Math.max(...rest.map((x) => terrain.heightAt(x.body.p[0], x.body.p[2]) + x.r - x.body.p[1]))
const got = rest.flatMap((x) => o.collect({ pos: x.body.p, mode: 'walk' }).keys)
process.exit(report('unit-releaseAt (WS-NPC Phase C, bunter Fluff an einem Punkt)', {
  onlySixKinds: a.every((x) => FLUFF_KINDS.includes(x.kind)),
  allSixWhenSix: new Set(a.map((x) => x.kind)).size === 6,
  deterministic: sA === sB,
  otherSeedOtherPaths: sA !== sC,
  stableKeys: a.every((x, i) => x.key === `heal:ghost:d0:${i}`),
  fallsAndRests: rest.length === 6 && sink <= 0.01,
  collectable: got.length === 6 && Object.values(st.counts()).reduce((s, v) => s + v, 0) === 6,
  noDoubleAdd: o.balls.length === 6 && added === 6 && again === 6,
}, { kinds: a.map((x) => x.kind), rest: rest.length, sink: +sink.toFixed(4), got: got.length }))
