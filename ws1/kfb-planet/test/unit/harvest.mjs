// Slice 1 · C3 Fluff-Ernte Mechanik (V-423, V-368/V-371): Trefferregel 3/2/1 mit Staffel, Windfall auf Gelände (Einsinken 0, Energie, Ruhe, Hang),
// Obstgarten in 3 Zonen mit Messwerten, Aufsammeln und Spielstand kfb.save/1. Ohne Browser.
import { report, readJson, near } from './_report.mjs'
import { FLUFF_KINDS, makeBody, simulateTerrain, stepBodyTerrain, terrainFrom, TERRAIN_FALL } from '../../src/world/fluff.js'
import { fruitFromAnchors, assignLeads } from '../../src/world/grammar.js'
import { HIT, WEAPONS, createTreeHarvest, createHarvestState, createOrchard } from '../../src/world/harvest.js'
import { freshSave, serializeSave, parseSave } from '../../src/world/save.js'
import { mulberry32 } from '../../src/vendor/palette/kfb-cartoon-palette.js'

const J = readJson('src/data/world/kaykit-tree-fluff-anchors.v1.json'), canopy = Object.keys(J.models).filter((k) => J.models[k].kind === 'canopy')
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0), sum = (o) => Object.values(o).reduce((a, x) => a + x, 0)

// ---------------------------------------------------------------- Trefferregel über 1000 Bäume (B2-Anker, Seed je Baum)
const rT = mulberry32(2026), trees = Array.from({ length: 1000 }, (_, i) => { const id = canopy[Math.floor(rT() * canopy.length)]; return { id: 'h' + i, balls: fruitFromAnchors(J, id, i, { id: 'h' + i }).hanging } })
const hitsBy = Object.fromEntries(WEAPONS.map((w) => [w, []])), seqs = Object.fromEntries(WEAPONS.map((w) => [w, []]))
for (const t of trees) for (const w of WEAPONS) {
  const h = createTreeHarvest({ id: t.id, balls: t.balls, seed: 7 }), seq = []
  while (!h.empty() && seq.length < 10) seq.push(h.hit(w).length)
  hitsBy[w].push(h.hits); seqs[w].push({ seq, n: t.balls.length, t: h.tough, L: h.L })
}
const meanHits = Object.fromEntries(WEAPONS.map((w) => [w, +mean(hitsBy[w]).toFixed(3)]))
const avgOk = near(meanHits.punch, 3, 0.15) && near(meanHits.shot, 2, 0.15) && near(meanHits.explosion, 1, 1e-12)
const varies = new Set(hitsBy.punch).size === 3 && new Set(hitsBy.shot).size === 3 // milde Streuung: 2/3/4 bzw. 1/2/3
// Staffel: Schlag 1–2 → 3–4 (je mittlerer Treffer) → Rest; Schuss (t = 0): 1–2 → Rest; Explosion: alles auf einmal
const staggerPunch = seqs.punch.every(({ seq, n }) => seq.length >= 2 && seq[0] >= 1 && seq[0] <= 2 && seq.slice(1, -1).every((k) => (k >= 3 && k <= 4) || (n < 2 + 3 * (seq.length - 2) && k >= 1)) && seq.at(-1) >= 1 && sum(seq) === n) // H2: bei wenigen Kügelchen kürzere Mittelstufen
const staggerShot = seqs.shot.filter((s) => s.t === 0).every(({ seq, n }) => seq.length === 2 && seq[0] >= 1 && seq[0] <= 2 && seq[1] === n - seq[0])
const staggerBoom = seqs.explosion.every(({ seq, n }) => seq.length === 1 && seq[0] === n)
const noEmptyHit = WEAPONS.every((w) => seqs[w].every(({ seq }) => seq.every((k) => k > 0)))
// gemischte Waffen: Schlag, Schuss, Schlag … leert, jeder Treffer wirft etwas ab; Determinismus; Welle; unbekannte Waffe
const mix = trees.slice(0, 200).map((t) => { const h = createTreeHarvest({ id: t.id, balls: t.balls, seed: 3 }), seq = []; let k = 0; while (!h.empty() && k < 10) seq.push(h.hit(k++ % 2 ? 'shot' : 'punch').length); return { seq, n: t.balls.length } })
const mixOk = mix.every(({ seq, n }) => sum(seq) === n && seq.every((k) => k > 0) && seq.length <= 4)
const det = (() => { const a = createTreeHarvest({ id: 'x', balls: trees[5].balls, seed: 1 }), b = createTreeHarvest({ id: 'x', balls: trees[5].balls, seed: 1 }); return JSON.stringify([a.hit('punch'), a.lastWave, a.hit('shot')]) === JSON.stringify([b.hit('punch'), b.lastWave, b.hit('shot')]) })()
const order = (() => { const h = createTreeHarvest({ id: 'o', balls: trees[9].balls, seed: 1 }), first = h.hit('punch'), ripest = trees[9].balls.slice().sort((a, b) => a.drop - b.drop).map((b) => b.key); return first.every((k, i) => k === ripest[i]) })()
const waveP = (() => { const h = createTreeHarvest({ id: 'w', balls: trees[3].balls, seed: 2 }); h.hit('punch'); return h.lastWave })(), waveE = (() => { const h = createTreeHarvest({ id: 'w', balls: trees[3].balls, seed: 2 }); h.hit('explosion'); return h.lastWave })()
const waveOk = waveP[0].at === HIT.wave.punch.loosen && waveP.every((e, i) => i === 0 || (e.at - waveP[i - 1].at >= 0.08 - 1e-4 && e.at - waveP[i - 1].at <= 0.15 + 1e-4)) &&
  waveE[0].at === 0 && waveE.every((e, i) => i === 0 || e.at > waveE[i - 1].at) && waveE.at(-1).at < 1
let threw = false; try { createTreeHarvest({ balls: ['a'] }).hit('laser') } catch { threw = true }
const tiny = createTreeHarvest({ id: 't', balls: ['a', 'b'], seed: 0 }); const tinySeq = []; while (!tiny.empty()) tinySeq.push(tiny.hit('punch').length)
const none = createTreeHarvest({ id: 'n', balls: [], seed: 0 }), noneOk = none.empty() && none.hit('punch').length === 0 && none.hits === 0

// ---------------------------------------------------------------- Windfall auf Gelände
// Buckeliges Gelände mit leichtem Gefälle (max. ≈ 25°), Normale analytisch
const hb = (x, z) => 0.12 * x + 0.25 * Math.sin(0.7 * x + 0.3) * Math.cos(0.5 * z) + 0.08 * Math.sin(1.9 * x - 1.3 * z)
const gb = (x, z) => [0.12 + 0.175 * Math.cos(0.7 * x + 0.3) * Math.cos(0.5 * z) + 0.152 * Math.cos(1.9 * x - 1.3 * z), -0.125 * Math.sin(0.7 * x + 0.3) * Math.sin(0.5 * z) - 0.104 * Math.cos(1.9 * x - 1.3 * z)]
const BUMPY = { heightAt: hb, normalAt: (x, z) => { const [gx, gz] = gb(x, z), l = Math.hypot(gx, 1, gz); return [-gx / l, 1 / l, -gz / l] } }
const normalCheck = (() => { const e = 1e-5, x = 1.3, z = -2.1, gx = (hb(x + e, z) - hb(x - e, z)) / (2 * e), gz = (hb(x, z + e) - hb(x, z - e)) / (2 * e); const [ax, az] = gb(x, z); return near(gx, ax, 1e-6) && near(gz, az, 1e-6) })()
const rD = mulberry32(17), drops = []
for (let i = 0; i < 600; i++) {
  const x = rD() * 30 - 15, z = rD() * 30 - 15, r = 0.06 + rD() * 0.2, b = makeBody([x, hb(x, z) + r + 0.5 + rD() * 5.5, z], [rD() * 3.2 - 1.6, rD() * 1.4, rD() * 3.2 - 1.6]); b.r = r
  const s = simulateTerrain(b, BUMPY, TERRAIN_FALL, { trace: true }); let inc = 0
  for (let k = 1; k < s.energies.length; k++) if (s.energies[k] - s.energies[k - 1] > 1e-9) inc++
  drops.push({ t: s.seconds, sink: s.maxSink, inc, timedOut: s.timedOut, bounces: s.bounces, path: s.path, lifts: b.lifts || 0, h: b.p[1] - hb(b.p[0], b.p[2]) - r })
}
const restT = drops.map((d) => d.t).sort((a, b) => a - b), maxSink = Math.max(...drops.map((d) => d.sink))
// 45°-Hang mit Auslauf (C¹-Übergang der Breite 2w): nie mitten am Hang liegen bleiben; endloser 45°-Hang: rollt bis tMax
const w = 1.5, h45 = (x) => (x < -w ? -x : x > w ? 0 : (x - w) ** 2 / (4 * w)), d45 = (x) => (x < -w ? -1 : x > w ? 0 : (x - w) / (2 * w))
const SLOPE = { heightAt: (x) => h45(x), normalAt: (x) => { const g = d45(x), l = Math.hypot(g, 1); return [-g / l, 1 / l, 0] } }
const rS = mulberry32(45), slope = Array.from({ length: 80 }, () => { const x = -9 + rS() * 7, b = makeBody([x, h45(x) + 0.15 + rS() * 2, rS() * 4 - 2], [rS() - 0.5, 0, rS() - 0.5]); b.r = 0.15; const s = simulateTerrain(b, SLOPE); return { x: b.p[0], slopeDeg: Math.atan(-d45(b.p[0])) * 180 / Math.PI, t: s.seconds, to: s.timedOut, sink: s.maxSink } })
const notMidSlope = slope.every((s) => s.slopeDeg <= Math.atan(TERRAIN_FALL.rollMu) * 180 / Math.PI + 1e-9 && s.x > -w && !s.to) && Math.max(...slope.map((s) => s.sink)) <= 0
const inf = makeBody([0, 0.15, 0]); inf.r = 0.15; const sInf = simulateTerrain(inf, { heightAt: (x) => -x, normalAt: () => [Math.SQRT1_2, Math.SQRT1_2, 0] })
const rollsOn45 = sInf.timedOut && inf.p[0] > 20 && sInf.maxSink <= 0
// 30° hält, 40° nicht (Grenzwinkel atan(rollMu) ≈ 34°): Start in Ruhe auf dem Hang
const holdAt = (deg) => { const k = Math.tan((deg * Math.PI) / 180), b = makeBody([0, 0.15, 0]); b.r = 0.15; const s = simulateTerrain(b, { heightAt: (x) => -k * x, normalAt: () => { const l = Math.hypot(k, 1); return [k / l, 1 / l, 0] } }); return { rest: !s.timedOut, x: b.p[0] } }
const h30 = holdAt(30), h40 = holdAt(40)
// sanfter Hang und flacher Boden: Ruhe in 1–4 s; terrainFrom(0) = flach, Ruhe auf y = r
const gentle = [1, 2, 3, 4].map((hgt) => { const b = makeBody([0, hgt, 0], [0.8, 0.5, 0.3]); b.r = 0.12; return simulateTerrain(b, terrainFrom((x) => -0.1 * x)).seconds })
const flatB = makeBody([0, 3, 0], [1.2, 1.0, 0.4]); flatB.r = 0.12; const sFlat = simulateTerrain(flatB, terrainFrom(0), TERRAIN_FALL, { trace: true })
const flatOk = flatB.mode === 'rest' && near(flatB.p[1], 0.12, 1e-12) && sFlat.bounces >= 2 && sFlat.seconds >= 1 && sFlat.seconds <= 4
// Ruhe bleibt Ruhe (bis gesammelt)
const still = JSON.stringify(flatB); for (let i = 0; i < 100; i++) stepBodyTerrain(flatB, terrainFrom(0)); const staysPut = JSON.stringify(flatB) === still
// Determinismus des Integrators
const dA = makeBody([1, 3, 2], [0.4, 0.9, -0.7]); dA.r = 0.1; const dB = makeBody([1, 3, 2], [0.4, 0.9, -0.7]); dB.r = 0.1
simulateTerrain(dA, BUMPY); simulateTerrain(dB, BUMPY); const integratorDet = JSON.stringify(dA) === JSON.stringify(dB)

// ---------------------------------------------------------------- Obstgarten: 3 Zonen (Gate: Treffer je Baum, Kügelchen je Bühne, Ruhezeit, Einsinken 0)
const ZONES = [{ zone: 'goblin', main: 'absurd', weapon: 'punch', x0: -18 }, { zone: 'atlantis', main: 'tragic', weapon: 'shot', x0: 0 }, { zone: 'utopia', main: 'heroic', weapon: 'explosion', x0: 18 }]
const buildZone = (Z, state) => {
  const ids = Array.from({ length: 5 }, (_, i) => 't' + i), leads = assignLeads(ids.map((id) => Z.zone + ':' + id), { main: Z.main, seed: 11, zone: Z.zone })
  const ts = ids.map((id, i) => { const x = Z.x0 + (i % 3) * 5 - 5, z = Math.floor(i / 3) * 6 - 3, model = canopy[(i * 5 + Z.x0 + 18) % canopy.length]; return { id, balls: fruitFromAnchors(J, model, 31 + i, { id, zone: Z.zone, main: Z.main, lead: leads[Z.zone + ':' + id], place: { pos: [x, hb(x, z), z], rotY: i * 0.9 }, terrain: BUMPY }).balls } })
  return createOrchard({ zone: Z.zone, seed: 5, trees: ts, terrain: BUMPY, state })
}
const run = (frameDt) => {
  const state = createHarvestState(freshSave(0)), out = []
  for (const Z of ZONES) {
    const O = buildZone(Z, state), total = O.balls.length, hangingStart = O.stats().hanging, hits = []
    for (const [id, h] of O.harvest) { while (!h.empty()) O.hit(id, Z.weapon); hits.push(h.hits) }
    let t = 0; while ((O.stats().hanging + O.stats().falling) > 0 && t < 30) { O.advance(frameDt); t += frameDt }
    const settled = O.stats(), restPos = O.balls.map((b) => b.body.p.map((v) => +v.toFixed(9)))
    for (const b of O.balls) if (b.state === 'resting') O.collect({ pos: [b.body.p[0], hb(b.body.p[0], b.body.p[2]), b.body.p[2]], mode: 'walk' })
    out.push({ Z, O, total, hangingStart, hits, settled, restPos, after: O.stats() })
  }
  return { state, out }
}
const A = run(1 / 60), B = run(1 / 144), C30 = run(1 / 30)
const fpsIndependent = A.out.every((z, i) => JSON.stringify(z.restPos) === JSON.stringify(B.out[i].restPos) && JSON.stringify(z.restPos) === JSON.stringify(C30.out[i].restPos))
const zonesSettled = A.out.every((z) => z.settled.hanging === 0 && z.settled.falling === 0 && z.settled.timedOut === 0 && z.settled.maxSink <= 0)
const zonesCollected = A.out.every((z) => z.after.collected === z.total)
const zoneHitsOk = A.out.every((z) => z.hits.every((h) => h >= HIT.need[z.Z.weapon] - 1 && h <= HIT.need[z.Z.weapon] + 1) && (z.Z.weapon !== 'explosion' || z.hits.every((h) => h === 1)))
// Spielstand: Zähler je Sorte = gesammelte Kügelchen, Rundreise durch serialize/parse, Schlüssel je Zone, Neustart überspringt Gesammeltes
const counts = A.state.counts(), kindsAll = A.out.flatMap((z) => z.O.balls.map((b) => b.kind)), expect = Object.fromEntries(FLUFF_KINDS.map((k) => [k, kindsAll.filter((x) => x === k).length]))
const saved = A.state.toSave(), text = serializeSave(saved, { now: 0 }), parsed = parseSave(text, { now: 0 })
const roundTrip = parsed.status === 'ok' && JSON.stringify(parsed.state.fluff) === JSON.stringify(expect) && parsed.state.collected.length === kindsAll.length && saved.schema === 'kfb.save/1' && Object.keys(saved).sort().join() === Object.keys(freshSave(0)).sort().join()
const byZone = A.state.byZone(), byZoneOk = ZONES.every((Z, i) => (byZone[Z.zone] || []).length === A.out[i].total)
const restored = createHarvestState(parsed.state), again = buildZone(ZONES[1], restored), skipOk = again.stats().collected === again.balls.length && again.stats().hanging === 0 && [...again.harvest.values()].every((h) => h.empty())
const markTwice = (() => { const s = createHarvestState(freshSave(0)); return s.mark('z:a:f0', 'comic') && !s.mark('z:a:f0', 'comic') && s.counts().comic === 1 })()

const zoneRows = A.out.map((z) => ({ zone: z.Z.zone, weapon: z.Z.weapon, trees: z.hits.length, hitsPerTree: +mean(z.hits).toFixed(2), ballsOnStage: z.total, hangingStart: z.hangingStart, restMean: +z.settled.restMean.toFixed(2), restMax: +z.settled.restMax.toFixed(2), bounces: +z.settled.bouncesMean.toFixed(2), path: +z.settled.pathMean.toFixed(2), maxSink: z.settled.maxSink }))
process.exit(report('unit-harvest', {
  hitAverages321: avgOk,
  hitsMildlyVary: varies,
  staggerPunch12_34_rest: staggerPunch,
  staggerShot: staggerShot,
  staggerExplosionAllAtOnce: staggerBoom,
  everyHitDrops: noEmptyHit && tinySeq.join() === '1,1' && noneOk,
  mixedWeaponsEmpty: mixOk,
  harvestDeterministic: det,
  ripestDropFirst: order,
  waveTiming: waveOk,
  unknownWeaponThrows: threw,
  terrainNormalAnalytic: normalCheck,
  sinkZeroRandomDrops: maxSink <= 0 && drops.every((d) => d.lifts === 0 && d.h >= -1e-12),
  energyNeverIncreases: drops.every((d) => d.inc === 0) && sFlat.energies.every((e, i) => i === 0 || e <= sFlat.energies[i - 1] + 1e-9),
  allComeToRest: drops.every((d) => !d.timedOut),
  restTimeCartoon: mean(restT) >= 1 && mean(restT) <= 4 && restT[Math.floor(restT.length * 0.95)] <= 4 && restT.at(-1) <= 6,
  bounceAndRoll: mean(drops.map((d) => d.bounces)) >= 1.5 && mean(drops.map((d) => d.path)) > 0.5,
  noRestMidSlope45: notMidSlope,
  endless45RollsToTMax: rollsOn45,
  holds30Not40: h30.rest && Math.abs(h30.x) < 1e-9 && !h40.rest && h40.x > 10,
  gentleAndFlatRest: gentle.every((s) => s >= 1 && s <= 4) && flatOk,
  restStaysPut: staysPut,
  integratorDeterministic: integratorDet,
  framerateIndependent: fpsIndependent,
  zonesSettleSinkZero: zonesSettled,
  zonesHitRule: zoneHitsOk,
  collectAll: zonesCollected,
  saveCountsPerKind: JSON.stringify(counts) === JSON.stringify(expect),
  saveRoundTrip: roundTrip && byZoneOk && markTwice,
  savedKeysSkipped: skipOk,
}, {
  meanHitsPerTree: meanHits, ballsPerTree: { mean: +mean(trees.map((t) => t.balls.length)).toFixed(2), min: Math.min(...trees.map((t) => t.balls.length)), max: Math.max(...trees.map((t) => t.balls.length)) },
  drops: { n: drops.length, restMean: +mean(restT).toFixed(3), restP95: +restT[Math.floor(restT.length * 0.95)].toFixed(3), restMax: +restT.at(-1).toFixed(3), bouncesMean: +mean(drops.map((d) => d.bounces)).toFixed(2), pathMean: +mean(drops.map((d) => d.path)).toFixed(2), maxSink },
  slope45: { restXmin: +Math.min(...slope.map((s) => s.x)).toFixed(2), restMaxSlopeDeg: +Math.max(...slope.map((s) => s.slopeDeg)).toFixed(1), restMax: +Math.max(...slope.map((s) => s.t)).toFixed(2), endlessX: +inf.p[0].toFixed(1) },
  gentle: gentle.map((s) => +s.toFixed(2)), flat: +sFlat.seconds.toFixed(2), zones: zoneRows, counts,
}))
