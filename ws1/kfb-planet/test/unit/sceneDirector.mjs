// WS-NPC S3 Regie R0 + Platzhalter-Raster (src/npc/sceneDirector.js, sceneGrid.js, sceneTypes.js), ohne Browser:
// Raster deterministisch je Seed (P1), höchstens ein Platz je Zelle, steile Zellen ohne Platz · nur freigegebene Typen im Pool (Entwürfe nur mit Schalter)
// · Takt über die Strecke, Mindestabstand, keine Flut im Stehen · kein Typ zweimal hintereinander · Platz voraus im Kegel · Kontext-Auslöser · T1 · kfb.scene/1 gültig
import { report } from './_report.mjs'
import { createSceneGrid } from '../../src/npc/sceneGrid.js'
import { createSceneDirector, REGIE } from '../../src/npc/sceneDirector.js'
import { SCENE_TYPES, poolTypes, validScene } from '../../src/npc/sceneTypes.js'

const groundAt = (x, z) => 3 * Math.sin(x / 40) * Math.cos(z / 55) + (x > 400 ? (x - 400) * 0.5 : 0)   // ab x > 400 steiler Hang (Neigung 0,5)
const C = {}, X = {}
const g1 = createSceneGrid({ seed: 7, cell: 48, groundAt }), g2 = createSceneGrid({ seed: 7, cell: 48, groundAt }), g3 = createSceneGrid({ seed: 8, cell: 48, groundAt })
const cells = []; for (let cx = -3; cx < 3; cx++) for (let cz = -3; cz < 3; cz++) cells.push([cx, cz])
C.gridDeterministic = cells.every(([a, b]) => JSON.stringify(g1.spotOf(a, b)) === JSON.stringify(g2.spotOf(a, b))) && cells.some(([a, b]) => JSON.stringify(g1.spotOf(a, b)) !== JSON.stringify(g3.spotOf(a, b)))
C.spotInsideCell = cells.every(([a, b]) => { const s = g1.spotOf(a, b); return !s || (Math.floor(s.x / 48) === a && Math.floor(s.z / 48) === b) })
C.steepHasNoSpot = g1.spotOf(12, 0) === null   // x 576–624 m: Hang 0,5 > maxSlope
C.spotsAroundSorted = (() => { const L = g1.spotsAround(0, 0, 120); return L.length > 3 && L.every((s, i) => i === 0 || s.d >= L[i - 1].d) })()

// Pool: heute alle „entwurf“ → ohne Schalter leer
C.poolOnlyReleased = poolTypes().length === 0 && poolTypes({ includeDraft: true }).length === SCENE_TYPES.length && SCENE_TYPES.every((t) => t.freigabe === 'entwurf')
const D0 = createSceneDirector({ seed: 3, grid: g1, taktM: [60, 140], ahead: [25, 60] })
C.noSceneWithoutRelease = Array.from({ length: 50 }, (_, i) => D0.step({ t: i * 2, movedM: 10, pos: { x: 0, z: i * 10 }, heading: 0 })).every((s) => s === null)

// Fahrt geradeaus (+z, 4 m/s), Takt 60–140 m, Plätze 25–60 m voraus
function drive(seed, { v = 4, secs = 400, stand = null } = {}) {
  const D = createSceneDirector({ seed, grid: g1, includeDraft: true, taktM: [60, 140], ahead: [25, 60] }), out = []
  let z = -100
  for (let t = 0; t <= secs; t += 0.5) { const moving = !(stand && t >= stand[0] && t < stand[1]); const mv = moving ? v * 0.5 : 0; z += mv
    const s = D.step({ t, movedM: mv, pos: { x: 0, z }, heading: 0 }); if (s) out.push({ t, z, s }) }
  return { D, out }
}
const A = drive(11), B = drive(11)
X.scenes = A.out.map((o) => [o.t, o.s.typ, o.s.phase, o.s.tau, o.s.zelle.join(',')])
C.t1Deterministic = JSON.stringify(A.out.map((o) => o.s)) === JSON.stringify(B.out.map((o) => o.s)) && A.out.length >= 8
C.allValid = A.out.every((o) => validScene(o.s) && o.s.ausloeser === 'zufall' && o.s.freigabe === 'entwurf')
C.noFlufferWithoutTrees = A.out.every((o) => o.s.typ !== 'fluffer')
C.noTypeTwiceInRow = A.out.every((o, i) => i === 0 || o.s.typ !== A.out[i - 1].s.typ)
C.minGap = A.out.every((o, i) => i === 0 || o.t - A.out[i - 1].t >= REGIE.minGapS)
const gaps = A.out.slice(1).map((o, i) => o.z - A.out[i].z); X.gapsM = gaps.map((g) => +g.toFixed(0))
C.taktByDistance = gaps.every((g) => g >= 60 - 1e-6)
C.spotAheadInCone = A.out.every((o) => { const dz = o.s.anker.z - o.z, dx = o.s.anker.x; const d = Math.hypot(dx, dz); return d >= 25 && d <= 60 && Math.abs(Math.atan2(dx, dz)) <= (35 * Math.PI) / 180 + 1e-6 })
C.facesPlayerLine = A.out.every((o) => Math.abs(o.s.anker.yaw - Math.atan2(0 - o.s.anker.x, o.z - o.s.anker.z)) < 1e-3)
C.phasesCycle = (() => { const p = A.out.map((o) => o.s.phase); return p.slice(0, 12).join() === 'aufbau,aufbau,aufbau,konflikt,konflikt,konflikt,konflikt,konflikt,ruhe,ruhe,ruhe,ruhe' })()
// im Stehen keine Flut: 200 s Stand → höchstens eine Szene in dieser Zeit (die schon fällige)
const St = drive(11, { stand: [100, 300] }), inStand = St.out.filter((o) => o.t > 100 && o.t < 300).length; X.inStand = inStand
C.noFloodWhenStanding = inStand <= 1
// Kontext: request zieht vor (Takt umgangen, Pool nicht)
{ const D = createSceneDirector({ seed: 5, grid: g1, includeDraft: true, taktM: [60, 140], ahead: [25, 60] }); D.request('disco', 'test')
  const s = D.step({ t: 0, movedM: 0, pos: { x: 0, z: -100 }, heading: 0 }); D.request('ufo', 'nicht im Pool'); const u = D.step({ t: 30, movedM: 0, pos: { x: 0, z: -100 }, heading: 0 })
  C.kontextTrigger = s?.typ === 'disco' && s.ausloeser === 'kontext' && s.grund === 'test' && u === null }
// Neigungsbedarf je Typ: auf einem Raster nur mit steilen Plätzen kommt keine Band (< 1,1°), andere Typen schon
{ const steep = { spotsAround: (x, z) => [{ cell: [0, 1], x, z: z + 40, y: 0, R: 8, slope: 0.2, d: 40 }] }, D = createSceneDirector({ seed: 2, grid: steep, includeDraft: true, taktM: [10, 20], ahead: [25, 60] })
  const got = []; for (let t = 0; t < 400; t += 1) { const s = D.step({ t, movedM: 5, pos: { x: 0, z: t * 5 }, heading: 0 }); if (s) { got.push(s.typ); D.release(s.zelle) } }
  X.steepTypes = [...new Set(got)]; C.slopeNeedRespected = got.length > 3 && !got.includes('band') }
// Konflikt-Typen (Lead 25.10.): in der Konflikt-Phase wählt die Regie Patrouille bzw. Fluffer (Potenzial 0,8), τ steigt; Fluffer nur an Bäumen (spotSources),
// Karte aus cardFor; ohne Bäume voraus kein Fluffer
{ const trees = (x, z) => [{ cell: ['baum', 'dark_fluffer_ghost'], x: x + 5, z: z + 40, y: 0, R: 6, slope: 0, ref: 'dark_fluffer_ghost', d: Math.hypot(5, 40) }]
  const D = createSceneDirector({ seed: 11, grid: g1, includeDraft: true, taktM: [60, 140], ahead: [25, 60], spotSources: { fluffer: trees }, cardFor: (b, n) => (b[0].characterId === 'skeleton_warrior' ? 'deck_x:' + n : null) }), got = []
  let z = -100; for (let t = 0; t <= 600; t += 0.5) { z += 2; const s = D.step({ t, movedM: 2, pos: { x: 0, z }, heading: 0 }); if (s) { got.push(s); D.release(s.zelle) } }
  const konf = got.filter((s) => s.phase === 'konflikt'); X.konflikt = konf.map((s) => s.typ + ':' + s.tau)
  C.conflictTypesInConflictPhase = konf.length >= 3 && konf.filter((s) => s.typ === 'patrouille' || s.typ === 'fluffer').length >= Math.ceil(konf.length / 2)
  C.tauRisesInConflict = Math.max(...konf.map((s) => s.tau)) > 0.4
  C.flufferOnlyAtTree = got.filter((s) => s.typ === 'fluffer').every((s) => s.anker.ort === 'dark_fluffer_ghost' && s.besetzung[0].sorte && /^q_/.test(s.besetzung[0].characterId))
  C.cardFromCardFor = got.filter((s) => s.typ === 'patrouille').every((s) => /^deck_x:\d+$/.test(s.karte)) && got.filter((s) => s.typ !== 'patrouille').every((s) => s.karte === null)
  C.allValidWithConflict = got.every(validScene) && new Set(got.map((s) => s.typ)).size >= 4 }
process.exit(report('unit-sceneDirector (WS-NPC S3 Regie R0, Platzhalter-Raster)', C, X))
