// Slice 1 · Leistungsbudget V-370: Konstanten, p95, Auswertung je Posten, Zielgerät/Referenz, Ringpuffer, Overlay-Zeile. Ohne Browser.
import { report, near } from './_report.mjs'
import { BUDGET, percentile, evaluate, createFrameSampler, overlayLine, MB } from '../../src/world/perfBudget.js'

const hundred = Array.from({ length: 100 }, (_, i) => i + 1) // 1..100 ms
const good = Array.from({ length: 200 }, (_, i) => (i % 20 === 0 ? 30 : 16.7)) // 5 % Spitzen von 30 ms → p95 = 16,7 ms
const spiky = Array.from({ length: 200 }, (_, i) => (i % 10 === 0 ? 45 : 16.7)) // 10 % Spitzen → p95 = 45 ms
const info = { render: { calls: 212, triangles: 480_000 } }
const ok = evaluate({ info, frameMs: good, bytes: { firstLoad: 38 * MB, zone: 12.5 * MB } })
const bad = evaluate({ info: { render: { calls: 340, triangles: 720_000 } }, frameMs: spiky, bytes: { firstLoad: 41 * MB, zone: 16 * MB } })
const ref = evaluate({ info, frameMs: Array(100).fill(20), device: 'reference' }) // 50 fps: reicht fürs Zielgerät, nicht für die Referenz
const tgt = evaluate({ info, frameMs: Array(100).fill(20) })
const edge = evaluate({ frameMs: Array(100).fill(1000 / 30) }) // genau 30 fps
const partial = evaluate({ info: { calls: 100, triangles: 1000 } }), empty = evaluate()
const S = createFrameSampler(4); [10, 20, 30, 40, 50, NaN, -1].forEach((x) => S.push(x))
const line = overlayLine(ok)

process.exit(report('unit-perfBudget', {
  constantsV370: BUDGET.target.p95Fps === 30 && BUDGET.reference.p95Fps === 60 && BUDGET.drawCalls === 300 && BUDGET.triangles === 600000 && BUDGET.firstLoadMB === 40 && BUDGET.zoneMB === 15,
  percentileNearestRank: percentile(hundred, 95) === 95 && percentile(hundred, 50) === 50 && percentile([7], 95) === 7 && percentile([], 95) === null && percentile([3, NaN, 1, 2], 100) === 3,
  p95FromSamples: near(ok.p95Ms, 16.7) && near(ok.p95Fps, 1000 / 16.7, 1e-9) && bad.p95Ms === 45 && ok.frames === 200,
  allPass: ok.pass === true && Object.values(ok.items).every((x) => x.pass === true) && ok.failed.length === 0,
  allFail: bad.pass === false && bad.failed.sort().join() === 'drawCalls,firstLoadMB,fps,triangles,zoneMB',
  devicePerTarget: tgt.items.fps.pass === true && ref.items.fps.pass === false && ref.items.fps.limit === 60,
  boundaryInclusive: edge.items.fps.pass === true && evaluate({ info: { calls: 300, triangles: 600000 } }).pass === true,
  unmeasuredIsNull: partial.items.fps.pass === null && partial.items.firstLoadMB.pass === null && partial.pass === true && empty.pass === null,
  megabytesDecimal: ok.items.firstLoadMB.value === 38 && ok.items.zoneMB.value === 12.5,
  samplerRing: S.count() === 4 && S.samples().join() === '20,30,40,50',
  overlayLine: /p95 16\.7 ms \(60 fps ✓\)/.test(line) && /Calls 212\/300 ✓/.test(line) && /480k\/600k ✓/.test(line),
}, { ok: ok.items, bad: bad.items, line }))
