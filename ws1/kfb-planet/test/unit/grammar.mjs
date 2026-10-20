// Slice 1 · C3 Platzierungs-Grammatik R2 (V-400, SPEC_PLACEMENT_GRAMMAR_R2 §0–§3): Operatoren, Zahlen-Regeln, Farbe, B2-Anker der KayKit-Bäume. Ohne Browser.
import fs from 'fs'
import crypto from 'crypto'
import { report, readJson, near } from './_report.mjs'
import { FLUFF, FLUFF_KINDS } from '../../src/world/fluff.js'
import { GRAMMAR, SUN, vec, candidates, score, stands, ripeness, fruitCount, stand, embed, nest, relax, fall, ruleReport, toneOf, assignLeads, grow, fruitFromAnchors, baseRadius } from '../../src/world/grammar.js'
import { mulberry32 } from '../../src/vendor/palette/kfb-cartoon-palette.js'

const FILE = 'src/data/world/kaykit-tree-fluff-anchors.v1.json', J = readJson(FILE), raw = fs.readFileSync(FILE)
const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${raw.length}\0`), raw])).digest('hex')
const canopy = Object.keys(J.models).filter((k) => J.models[k].kind === 'canopy'), bare = Object.keys(J.models).filter((k) => J.models[k].kind === 'bare')
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length

// Synthetische Krone: Kugel (Mitte C, Radius Rc) über einem Stamm, hs = Höhe / Spitze
const C = [0, 2.6, 0], Rc = 1.4, top = C[1] + Rc
const sphere = (d) => { const p = vec.add(C, vec.mul(d, Rc)); return { p, n: d.slice(), hs: p[1] / top } }
const cand = candidates(sphere), candB = candidates(sphere), candCactus = candidates(sphere, 220, { carrier: 'cactus' })
const candOk = cand.length > 40 && cand.every((c) => vec.dot(c.n, c.d) >= 0.45 - 1e-12 && c.hs >= 0.18) && candCactus.every((c) => c.hs >= 0.55) && candCactus.length < cand.length
const fib = (() => { const c = candidates(() => ({ p: [0, 0, 0], n: [0, 1, 0], hs: 1 }), 220); return c.length > 0 && c.every((x) => x.d[1] >= 0.45 - 1e-12) })() // nur Richtungen mit n·d ≥ 0,45 bei flacher Normale

// score / stands
const rA = mulberry32(5), rB = mulberry32(5), sA = cand.map((c) => score(c, rA)), sB = cand.map((c) => score(c, rB))
const scored = cand.map((c, i) => ({ ...c, score: sA[i] })), st = stands(scored, 7, 0.62 * Rc), stSmall = stands(scored, 3, 0.62 * Rc, { top: false })
const minPair = (arr) => { let m = Infinity; for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) m = Math.min(m, vec.dist(arr[i].p, arr[j].p)); return m }
const scoreSpan = sA.every((s, i) => s >= -0.3 - 1e-9 && s <= 1.4 + 1e-9 && s === sB[i])

// ripeness / stand / embed
const ripLowSun = ripeness({ hs: 0.2, sun: 1 }), ripHighShade = ripeness({ hs: 0.95, sun: 0 }), ripExact = ripeness({ hs: 0.5, sun: 0.5 })
const ripBounds = Array.from({ length: 200 }, (_, i) => ripeness({ hs: (i % 20) / 19, sun: (i % 7) / 6 }, mulberry32(i))).every((r) => r >= 0.12 && r <= 1)
const S1 = stand({ p: [0, 3, 1], n: [0, 0, 1] }, 0.3, { R0: 0.2 }), S2 = stand({ p: [0, 3, 1], n: [0, 0, 1] }, 0.5, { R0: 0.2 }), S3 = stand({ p: [0, 3, 1], n: [0, 0, 1] }, 0.8, { R0: 0.2, rng: mulberry32(2) })
const sizesOk = near(S3[1].r / S3[0].r, 0.74, 0.74 * 0.18) && near(S3[2].r / S3[0].r, 0.56, 0.56 * 0.18) && near(S1[0].r, 0.2 * (0.42 + 0.62 * 0.3), 1e-12)
const gapOk = S3.slice(1).every((f) => { const d = vec.dist(f.pt, S3[0].pt), s = S3[0].r + f.r; return d >= 1.15 * s - 1e-9 && d <= 1.5 * s + 1e-9 })
const sagOk = S3.every((f) => near(f.c[1], f.pt[1] + 0 - 0.14 * f.r * 0.8, 1e-12) && near(f.c[2] - f.pt[2], 0.45 * f.r, 1e-12)) // Normale +z: Mitte 0,45 r davor, reif tiefer
const emb = embed({ pt: [1, 2, 3], n: [0, 2, 0], r: 0.2 })

// nest: 1 groß, 3 mittel, Rest klein; Abstand (R + r)·0,86·spread
const NS = nest([0, 3, 1.4], [0, 0, 1], 7, 1, { R0: 0.2, rng: mulberry32(3) })
const nestOk = NS.length === 7 && NS.filter((x) => x.role === 'anchor').length === 1 && NS.filter((x) => x.role === 'support').length === 3 && NS.filter((x) => x.role === 'pebble').length === 3 &&
  NS.filter((x) => x.role === 'support').every((x) => near(x.r / 0.2, 0.62, 0.62 * 0.12)) && NS.filter((x) => x.role === 'pebble').every((x) => near(x.r / 0.2, 0.38, 0.38 * 0.12)) &&
  NS.filter((x) => x.role === 'support').every((x) => { const d = vec.dist(x.pt, NS[0].pt), b = (NS[0].r + x.r) * 0.86 * 1.75; return d >= b * 0.9 - 1e-9 && d <= b * 1.2 + 1e-9 })

// relax / fall
const RX = relax([{ c: [0, 0, 0], r: 0.2 }, { c: [0.1, 0, 0], r: 0.15 }, { c: [0.05, 0.08, 0], r: 0.1 }], 40)
const relaxOk = RX.every((a, i) => RX.every((b, j) => { const q = vec.dist(a.c, b.c) / (a.r + b.r); return j <= i || q <= 0.85 + 1e-6 || q >= 1.25 - 1e-6 })) // Kontur-Regel (WS0 18.10.)
const FL = fall({ p: [1, 3, 0] }, 2, { crownR: 2, centre: [0, 2, 0], R0: 0.2, groundAt: (x, z) => 0.1 * x })
const fallOk = FL.length === 2 && FL.every((f, i) => near(f.c[1], 0.1 * f.c[0] + f.r, 1e-12) && near(Math.hypot(f.c[0] - 1, f.c[2]), 2 * (0.25 + 0.3 * i), 1e-9) && f.c[0] > 1) && near(FL[1].r, 0.2 * 0.83, 1e-12)

// Zahlen-Regeln: Prüfer erkennt Verstöße
const even = ruleReport([{ c: [0, 0, 0], r: 0.1 }, { c: [1, 0, 0], r: 0.2 }])
const same = ruleReport([{ c: [0, 0, 0], r: 0.1 }, { c: [0.3, 0, 0], r: 0.102 }, { c: [2, 0, 0], r: 0.3 }])
const line = ruleReport([{ c: [0, 0, 0], r: 0.1 }, { c: [0.3, 0.005, 0], r: 0.14 }, { c: [0.62, 0, 0], r: 0.18 }, { c: [0.3, 1.5, 0], r: 0.25 }, { c: [3, 3, 0], r: 0.4 }])
const grid = ruleReport(Array.from({ length: 9 }, (_, i) => ({ c: [(i % 3) * 1, Math.floor(i / 3) * 1, 0], r: 0.1 + 0.03 * i })))
const good = ruleReport([{ c: [0, 0, 0], r: 0.2 }, { c: [0.45, 0.1, 0], r: 0.14 }, { c: [1.6, 0.4, 0.2], r: 0.1 }])
const detects = even.failed.includes('odd') && same.failed.includes('sameSizeAdjacent') && line.failed.includes('collinear') && grid.failed.includes('neighbourSpread') && good.ok

// Farbe
const toneOk = toneOf('tragic', 0.4).tone === 'dunkel' && toneOf('tragic', 0.4).color === FLUFF.tragic.dark && toneOf('tragic', 0.6).color === FLUFF.tragic.color &&
  toneOf('comic', 0.2, { green: true }).tone === 'satt' && toneOf('comic', 0.2).tone === 'dunkel'

// grow (raycast-Oberfläche): deterministisch, Spitze, ≤ 7 Stände, Regeln, Leitfarbe + ≤ 1 Akzent
const g1 = grow(sphere, { id: 'p1', seed: 4, crownR: Rc, centre: C, main: 'heroic' }), g2 = grow(sphere, { id: 'p1', seed: 4, crownR: Rc, centre: C, main: 'heroic' }), g3 = grow(sphere, { id: 'p1', seed: 5, crownR: Rc, centre: C, main: 'heroic' })
const bush = grow(sphere, { id: 'b', seed: 1, carrier: 'bush', crownR: Rc, centre: C, lead: 'tragic', accent: 'absurd' })
const growOk = JSON.stringify(g1) === JSON.stringify(g2) && JSON.stringify(g1.hanging) !== JSON.stringify(g3.hanging) && g1.stands.length <= 7 && g1.stands[0].hs > 0.86 && g1.report.ok &&
  new Set(g1.hanging.map((f) => f.kind)).size <= 2 && g1.fallen.length === 2 && bush.stands.length <= 3 && bush.fallen.length === 1 && bush.hanging.every((f) => (f.stand === bush.stands.length - 1 ? f.kind === 'absurd' : f.kind === 'tragic'))
const onSurface = g1.hanging.every((f) => near(vec.dist(f.pt, C), Rc, 1e-9)) // Folgefrüchte zurück auf die Krone projiziert

// B2-Anker: alle Laubbäume × 100 Seeds
const runs = []
for (let s = 0; s < 100; s++) for (const id of canopy) runs.push(fruitFromAnchors(J, id, s, { main: FLUFF_KINDS[s % 6] }))
const rulesAll = runs.every((r) => r.report.ok && r.hanging.length % 2 === 1)
const twoKinds = runs.every((r) => new Set(r.hanging.map((b) => b.kind)).size <= 2 && r.hanging.every((b) => b.kind === r.meta.lead || ([1, 4].includes(b.stand) && b.kind === r.meta.accent)))
const allGreen = canopy.every((id) => J.models[id].anchors.every((a) => a.bgColor && a.contrastDE.Comic < 40)) // KayKit-Laub: Comic-Kontrast < 40 überall
const tonesAll = runs.every((r) => r.hanging.every((b) => b.tone === (b.rip < 0.5 && b.kind !== 'comic' ? 'dunkel' : 'satt') && b.color === (b.tone === 'dunkel' ? FLUFF[b.kind].dark : FLUFF[b.kind].color)))
const comicGreen = runs.flatMap((r) => r.hanging.filter((b) => b.kind === 'comic')), comicNeverDark = comicGreen.every((b) => b.tone === 'satt')
const maxROk = runs.every((r) => r.hanging.every((b) => b.r <= 0.35 + 1e-12))
const keysUnique = runs.every((r) => new Set(r.balls.map((b) => b.key)).size === r.balls.length && r.balls.every((b) => b.key.startsWith('zone:' + r.meta.treeId + ':f')))
const fallenOk = runs.every((r) => r.fallen.length === 2 && r.fallen.every((b) => b.state === 'resting' && b.body.mode === 'rest' && near(b.body.p[1], b.r, 1e-12)))
const dropOk = runs.every((r) => { const d = r.hanging.map((b) => b.drop).sort((a, b) => a - b); return d.every((x, i) => x === i) && r.hanging.every((b) => r.hanging.every((o) => b.drop >= o.drop || b.rip >= o.rip)) })
const det = JSON.stringify(fruitFromAnchors(J, 'Tree_2_E_Color1', 9, { main: 'absurd' })) === JSON.stringify(fruitFromAnchors(J, 'Tree_2_E_Color1', 9, { main: 'absurd' }))
const differs = JSON.stringify(fruitFromAnchors(J, 'Tree_2_E_Color1', 9).hanging) !== JSON.stringify(fruitFromAnchors(J, 'Tree_2_E_Color1', 10).hanging)
const bareSkip = bare.every((id) => fruitFromAnchors(J, id, 1).balls.length === 0), bareOn = fruitFromAnchors(J, 'Tree_Bare_1_C_Color1', 1, { bare: true }).hanging.length > 0
let threw = 0; try { fruitFromAnchors(J, 'Tree_9', 1) } catch { threw++ } try { fruitFromAnchors({ schema: 'x' }, 'Tree_1_A_Color1', 1) } catch { threw++ }
// Platzierung in der Welt (Drehung, Verschiebung, Gelände): Fallobst auf dem Gelände, hangabwärts
const terr = { heightAt: (x, z) => 0.2 * z, normalAt: () => vec.norm([0, 1, -0.2]) }
const placed = fruitFromAnchors(J, 'Tree_1_C_Color1', 2, { id: 't7', zone: 'goblin', place: { pos: [10, 0.2 * -4, -4], rotY: 1.1 }, terrain: terr })
const placedOk = placed.fallen.every((b) => near(b.body.p[1], terr.heightAt(b.body.p[0], b.body.p[2]) + b.r, 1e-12)) && placed.balls.every((b) => b.key.startsWith('goblin:t7:f')) && placed.hanging.every((b) => b.anchor[1] > terr.heightAt(b.anchor[0], b.anchor[2]))

// Zone: Leitfarben exakt nach V-368 über 100 Bäume
const leads = assignLeads(Array.from({ length: 100 }, (_, i) => 'z:t' + i), { main: 'absurd', seed: 3 }), lc = Object.fromEntries(FLUFF_KINDS.map((k) => [k, Object.values(leads).filter((x) => x === k).length]))
const leadsOk = lc.absurd === 40 && FLUFF_KINDS.every((k) => lc[k] >= 8)

const balls = runs.map((r) => r.hanging.length), tries = runs.map((r) => r.meta.tries)
process.exit(report('unit-grammar', {
  anchorsByteIdentical: blob === '0287cbe93cfefcfde68b626734c2c53e64bcea2a',
  anchorsLoaded: J.schema === 'kfb.tree-fluff-anchors.v1' && Object.keys(J.models).length === 20 && canopy.length === 14 && bare.length === 6,
  candidatesFiltered: candOk && fib,
  candidatesDeterministic: JSON.stringify(cand) === JSON.stringify(candB),
  scoreFormula: scoreSpan && near(score({ n: SUN.slice() }, () => 0), 0.5 + vec.dot(SUN, vec.norm([0.25, 0, 1])) * 0.3, 1e-12),
  standsTopAndSpacing: st.length === 7 && st[0].hs > 0.86 && minPair(st) > 0.62 * Rc && stSmall.length === 3 && stSmall[0] === scored.slice().sort((a, b) => b.score - a.score)[0],
  ripenessFormula: ripLowSun > ripHighShade && near(ripExact, 0.22 + 0.31 + 0.16, 1e-12) && ripBounds && ripeness({ hs: 0, sun: 1 }) === 1 && ripeness({ hs: 1, sun: 0 }) === 0.22,
  standFruitCounts: S1.length === 1 && S2.length === 2 && S3.length === 3 && fruitCount(0.36) === 1 && fruitCount(0.62) === 2 && fruitCount(0.63) === 3,
  standSizesGapsSag: sizesOk && gapOk && sagOk,
  embedHalfIn: near(emb[1], 2 + 0.09, 1e-12) && emb[0] === 1 && emb[2] === 3,
  nestOneThreeRest: nestOk,
  relaxSeparates: relaxOk,
  fallOnGroundDownhill: fallOk,
  ruleCheckerDetects: detects,
  toneRules: toneOk,
  growDeterministicTopRules: growOk && onSurface,
  anchorTreesFollowRules: rulesAll,
  leadPlusOneAccent: twoKinds,
  darkToneBelowHalf: allGreen && tonesAll,
  comicOnGreenNeverDark: comicGreen.length > 0 && comicNeverDark,
  radiusWithinMaxBallR: maxROk,
  keysUniqueZoned: keysUnique,
  fallenOnGround: fallenOk,
  dropOrderRipestFirst: dropOk,
  anchorsDeterministic: det && differs,
  bareTreesNoFluff: bareSkip && bareOn,
  unknownThrows: threw === 2,
  placedInWorld: placedOk,
  zoneLeadsV368: leadsOk,
}, { ballsPerTree: { mean: +mean(balls).toFixed(2), min: Math.min(...balls), max: Math.max(...balls) }, triesMean: +mean(tries).toFixed(2), triesMax: Math.max(...tries), standsMean: +mean(runs.map((r) => r.meta.stands)).toFixed(2), comicBalls: comicGreen.length, leadCounts: lc, R0: +baseRadius(1.6).toFixed(4), sample: runs[0].meta, G: GRAMMAR.stands.tree }))
