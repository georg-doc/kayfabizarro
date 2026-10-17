// Slice 1 · Fluff-Ernte (V-368, V-371): Sorten/Farben, Gewichte je Zone, Verteilung nach Seed, Windfall-Integrator, Aufsammeln. Ohne Browser.
import { report, near } from './_report.mjs'
import { createFluffField3d } from '../../src/modules/fluffField3d.js'
import { FLUFF, FLUFF_KINDS, zoneWeights, countsFor, distribute, makeBody, simulate, stepBody, energyOf, FALL, release, gustSchedule, collect, createFluffField } from '../../src/world/fluff.js'

// V-292 (Register-Zeile, satte Farben) – hier bewusst als Text gegen die Quelle in kfb-cartoon-palette.js geprüft
const V292 = { tragic: '#3e6a83', comic: '#7a8d4a', absurd: '#e9c14a', heroic: '#d97c3a', mystical: '#6b4e7d', forbidden: '#a64670' }
const sum = (o) => Object.values(o).reduce((a, x) => a + x, 0)
const zones = FLUFF_KINDS.map((k) => ({ k, w: zoneWeights(k) }))
const biased = zoneWeights('mystical', { bias: { comic: 5, tragic: 0 } })
let threw = false; try { zoneWeights('pink') } catch { threw = true }
const c100 = countsFor(zoneWeights('heroic'), 100), c7 = countsFor(zoneWeights('heroic'), 7)

// Verteilung: gleicher Seed → gleich, anderer Seed → anders; Anteile wie Gewichte; Anker an der Krone des Spawns
const spawns = [{ id: 't1', pos: [0, 0, 0], type: 'tree' }, { id: 't2', pos: [10, 0.5, 4], type: 'tree' }, { id: 'b1', pos: [-5, 0, 6], type: 'bush' }, { id: 'b2', pos: [3, 0, -7], type: 'bush' }]
const A = distribute({ zone: 'goblin', seed: 42, n: 18, spawns, main: 'absurd' }), B = distribute({ zone: 'goblin', seed: 42, n: 18, spawns, main: 'absurd' })
const C = distribute({ zone: 'goblin', seed: 43, n: 18, spawns, main: 'absurd' }), Z2 = distribute({ zone: 'atlantis', seed: 42, n: 18, spawns, main: 'absurd' })
const big = distribute({ zone: 'z', seed: 1, n: 100, spawns: Array.from({ length: 20 }, (_, i) => ({ id: 's' + i, pos: [i * 4, 0, 0], type: i % 2 ? 'bush' : 'tree' })), main: 'tragic' })
const share = Object.fromEntries(FLUFF_KINDS.map((k) => [k, big.filter((b) => b.kind === k).length / big.length]))
const capOk = spawns.every((s) => A.filter((b) => b.spawn === s.id).length <= (s.type === 'tree' ? 6 : 3))
const anchorsOk = A.every((b) => { const s = spawns.find((x) => x.id === b.spawn); return Math.hypot(b.anchor[0] - s.pos[0], b.anchor[2] - s.pos[2]) <= (s.type === 'tree' ? 1.1 : 0.55) + 1e-9 && b.anchor[1] > s.pos[1] })

// Windfall: Ruhe innerhalb T, Energie nimmt nie zu (flach), Hüpfer, Ruhe auf dem Boden; Hang: rollt bergab (steil) bzw. bleibt liegen (flach)
const T_SETTLE = 4
const flat = simulate(makeBody([0, 3, 0], [1.2, 1.0, 0.4]), 0, FALL, { trace: true })
let inc = 0, maxInc = 0; for (let i = 1; i < flat.energies.length; i++) { const d = flat.energies[i] - flat.energies[i - 1]; if (d > 1e-9) { inc++; maxInc = Math.max(maxInc, d) } }
const drops = [0.5, 1.5, 3, 5].map((h) => simulate(makeBody([0, h, 0], [0.8, 0.5, 0]), 0).seconds)
const steep = makeBody([0, 2, 0]), steepH = (x) => -0.45 * x; simulate(steep, steepH) // ≈ 24°: Hangabtrieb > Rollreibung
const gentle = makeBody([0, 2, 0]), gentleH = (x) => -0.1 * x; simulate(gentle, gentleH)
// Determinismus des Integrators: zweimal gleich
const d1 = simulate(makeBody([1, 2.5, -1], [0.3, 1.1, -0.9]), (x, z) => 0.05 * Math.sin(x)), d2 = simulate(makeBody([1, 2.5, -1], [0.3, 1.1, -0.9]), (x, z) => 0.05 * Math.sin(x))
// erster Hüpfer: Rückprall = e × Aufprall
const one = makeBody([0, 2, 0]); let vBefore = 0; while (one.bounces === 0) { vBefore = one.v[1]; stepBody(one, 0) }

// Abwurf und Böe deterministisch
const r1 = release({ ...A[0], state: 'hanging' }, 9), r2 = release({ ...A[0], state: 'hanging' }, 9)
const g1 = gustSchedule(A, 5), g2 = gustSchedule(A, 5)

// Aufsammeln: Radius zu Fuß/Fahrzeug, hängende nie, Kapsel (schnelle Fahrt zwischen zwei Bildern), Höhenfenster, Driften im Bogen
const lying = (key, p) => ({ key, state: 'resting', body: { p } })
const L = [lying('a', [0.7, 0.12, 0]), lying('b', [1.5, 0.12, 0]), lying('c', [3, 0.12, 0]), { key: 'h', state: 'hanging', body: null, anchor: [0, 2, 0] }, lying('top', [0, 3.5, 0])]
const walk = collect(L, { pos: [0, 0, 0], mode: 'walk' }), car = collect(L, { pos: [0, 0, 0], mode: 'vehicle' })
const tunnel = collect([lying('m', [10, 0.12, 0.5])], { pos: [20, 0, 0], prev: [0, 0, 0], mode: 'vehicle' }) // 20 m in einem Bild
const noTunnel = collect([lying('m', [10, 0.12, 0.5])], { pos: [20, 0, 0], mode: 'vehicle' })
const arcBalls = [lying('front', [3.2, 0.12, 1.0]), lying('back', [-3.2, 0.12, 0])]
const drift = collect(arcBalls, { pos: [0, 0, 0], mode: 'vehicle', vel: [12, 0, 0], drifting: true }), noDrift = collect(arcBalls, { pos: [0, 0, 0], mode: 'vehicle', vel: [12, 0, 0] })
const slowDrift = collect(arcBalls, { pos: [0, 0, 0], mode: 'vehicle', vel: [3, 0, 0], drifting: true })

// Feld: Böe → alle liegen nach ≤ T, Durchfahren sammelt, Zähler je Sorte, Spielstand-Schlüssel überspringen, Nachwachsen
const F = createFluffField({ zone: 'goblin', seed: 42, n: 18, spawns, main: 'absurd' })
F.gust(); let t = 0; while (F.stats().falling + F.stats().hanging > 0 && t < 10) { F.advance(1 / 60); t += 1 / 60 }
const settledAll = F.stats().resting === 18
const before = F.stats().resting
for (const s of spawns) for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; F.collect({ pos: [s.pos[0] + Math.cos(a) * 1.2, s.pos[1], s.pos[2] + Math.sin(a) * 1.2], mode: 'vehicle' }) }
const firstPass = sum(F.counts()) // Kreis um jeden Spawn; was weiter gerollt ist, wird danach direkt angefahren
for (const b of F.balls) if (b.state === 'resting') F.collect({ pos: [b.body.p[0] - 0.5, 0, b.body.p[2]], mode: 'walk' })
const got = sum(F.counts()), keys = F.collectedKeys()
const F2 = createFluffField({ zone: 'goblin', seed: 42, n: 18, spawns, main: 'absurd', collected: keys })
const R = createFluffField({ zone: 'r', seed: 1, n: 3, spawns: [spawns[0]], main: 'comic', regrow_s: 5 })
R.shake('t1'); for (let i = 0; i < 400; i++) R.advance(1 / 60); R.collect({ pos: [0, 0, 0], radius: 3 }); const afterCollect = R.stats().collected
for (let i = 0; i < 360; i++) R.advance(1 / 60)

// 3D-Modul (three in Node, ohne Renderer): ein InstancedMesh, Böe + Drüberlaufen, gesammelte auf Größe 0
const M = createFluffField3d({ field: createFluffField({ zone: 'm', seed: 3, n: 6, spawns: [spawns[0]], main: 'heroic' }) })
M.field.shake('t1'); for (let i = 0; i < 300; i++) M.update(1 / 60, { player: { x: 50, y: 0, z: 50 } })
const restBalls = M.field.balls.filter((b) => b.state === 'resting'); let got3d = 0
for (const b of restBalls) { M.update(1 / 60, { player: { x: b.body.p[0], y: 0, z: b.body.p[2] } }); got3d = M.info().collected }
const inst = M.object3d.children[0], e = new Float32Array(16); inst.instanceMatrix.array.slice(0, 16).forEach((v, i) => (e[i] = v))
const mod3d = inst.isInstancedMesh && inst.count === 6 && M.info().drawCalls === 1 && got3d === 6 && e[0] === 0
M.dispose()

process.exit(report('unit-fluff', {
  sixKindsV292: FLUFF_KINDS.length === 6 && FLUFF_KINDS.every((k) => FLUFF[k].color === V292[k]),
  weightsSumOne: zones.every(({ w }) => near(sum(w), 1, 1e-12)) && near(sum(biased), 1, 1e-12),
  mainIs40: zones.every(({ k, w }) => near(w[k], 0.4, 1e-12)),
  othersAtLeast8: zones.every(({ k, w }) => FLUFF_KINDS.filter((x) => x !== k).every((x) => w[x] >= 0.08 - 1e-12)) && FLUFF_KINDS.filter((x) => x !== 'mystical').every((x) => biased[x] >= 0.08 - 1e-12),
  biasShiftsOthers: biased.comic > biased.heroic && near(biased.tragic, 0.08, 1e-12),
  unknownKindThrows: threw,
  countsExact: c100.heroic === 40 && FLUFF_KINDS.filter((k) => k !== 'heroic').every((k) => c100[k] === 12) && sum(c7) === 7 && c7.heroic >= 2,
  sameSeedSame: JSON.stringify(A) === JSON.stringify(B),
  otherSeedDiffers: JSON.stringify(A) !== JSON.stringify(C) && JSON.stringify(A.map((b) => b.anchor)) !== JSON.stringify(Z2.map((b) => b.anchor)),
  distributionShares: near(share.tragic, 0.4, 0.011) && FLUFF_KINDS.filter((k) => k !== 'tragic').every((k) => share[k] >= 0.08),
  everyKindInZone: FLUFF_KINDS.every((k) => A.some((b) => b.kind === k)),
  capacityAndAnchors: capOk && anchorsOk && A.every((b) => b.state === 'hanging'),
  settlesWithinT: flat.body.mode === 'rest' && flat.seconds <= T_SETTLE && drops.every((s) => s <= T_SETTLE),
  energyNeverIncreases: inc === 0,
  energyLost: flat.energies.at(-1) < flat.energies[0] * 0.2,
  restsOnGround: near(flat.body.p[1], FALL.radius, 1e-6) && flat.body.bounces >= 2,
  restitution: near(one.v[1], -FALL.e * vBefore, 0.15) || one.mode === 'roll',
  rollsDownSteep: steep.p[0] > 1 && steep.p[1] < 2,
  staysOnGentle: gentle.mode === 'rest' && gentle.p[0] < 1.5,
  integratorDeterministic: JSON.stringify(d1.body.p) === JSON.stringify(d2.body.p) && d1.steps === d2.steps,
  releaseDeterministic: JSON.stringify(r1.body.v) === JSON.stringify(r2.body.v) && r1.body.v[1] > 0,
  gustDeterministic: JSON.stringify(g1) === JSON.stringify(g2) && g1.length === A.length && g1.every((e) => e.at >= 0 && e.at <= 1.6),
  pickupRadius: walk.keys.join() === 'a' && car.keys.sort().join() === 'a,b',
  neverHanging: !walk.keys.includes('h') && !car.keys.includes('h'),
  heightWindow: !car.keys.includes('top'),
  driveThroughCapsule: tunnel.keys.join() === 'm' && noTunnel.keys.length === 0,
  driftArc: drift.keys.join() === 'front' && drift.drift.join() === 'front' && noDrift.keys.length === 0 && slowDrift.keys.length === 0,
  fieldGustSettles: settledAll && t <= 1.6 + T_SETTLE,
  fieldCollectsAndCounts: got === before && got === 18 && JSON.stringify(F.counts()) === JSON.stringify(countsFor(zoneWeights('absurd'), 18)),
  savedKeysSkipped: F2.stats().collected === 18 && F2.stats().hanging === 0,
  module3d: mod3d,
  regrows: afterCollect === 3 && R.stats().hanging === 3 && R.balls.every((b) => b.key.endsWith('#1')),
}, { counts: F.counts(), share, flatSeconds: +flat.seconds.toFixed(3), drops: drops.map((s) => +s.toFixed(2)), bounces: flat.body.bounces, steep: steep.p.map((v) => +v.toFixed(2)), gentle: gentle.p.map((v) => +v.toFixed(2)), gustT: +t.toFixed(2), firstPass }))
