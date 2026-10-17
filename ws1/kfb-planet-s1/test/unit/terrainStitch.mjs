// Slice 1 · terrainStitch (V-341/V-342) gegen die echten Bühnen-Ränder (src/data/stages/kfb-stage-edges.r1.json, WS0 @d4e24f15). Ohne Browser.
import { report, readJson, near } from './_report.mjs'
import { stitchFor, stitchAll, stitchMesh, normalizeRing, isClockwise, signedAreaXZ, pointInRing, ringIsSimple, distToRing, groundColorOf, blendAt, triXZ } from '../../src/world/terrainStitch.js'
import { createTerrainStitch } from '../../src/modules/terrainStitch3d.js'

const doc = readJson('src/data/stages/kfb-stage-edges.r1.json')
const all = stitchAll(doc)
const ids = Object.keys(doc.stages), joined = ids.filter((id) => all[id]), islands = ids.filter((id) => doc.stages[id].terrainMode === 'island')
const xz = (r) => r.map((p) => [p[0], p[2]])
const per = {}
for (const id of joined) {
  const st = all[id], e = doc.stages[id], src = e[st.ring], out = xz(st.outer), m = stitchMesh(st)
  let down = 0, abs = 0; for (let k = 0; k < m.indices.length; k += 3) { const s = triXZ(m.positions, m.indices[k], m.indices[k + 1], m.indices[k + 2]); if (s >= 0) down++; abs += Math.abs(s) }
  const ann = signedAreaXZ(out) - st.area_m2
  per[id] = {
    ring: st.ring, n: st.footprint.length, cw: isClockwise(st.footprint) && isClockwise(out),
    // Meter = u × scale_m_per_u (Punkt 0 nach Normalisierung, dafür den Originalpunkt suchen)
    metres: src.points.every(([x, z]) => st.footprint.some((p) => near(p[0], x * e.scale_m_per_u, 1e-9) && near(p[1], z * e.scale_m_per_u, 1e-9))),
    areaMatchesWs0: Math.abs(st.area_m2 - src.area_m2) / src.area_m2 < 0.02,
    outerSimple: ringIsSimple(out), outerOutside: out.every((p) => !pointInRing(p, st.footprint)), minGap: +Math.min(...out.map((p) => distToRing(p, st.footprint))).toFixed(3),
    meshUp: down, overlap: +(abs / ann - 1).toFixed(4), tris: m.indices.length / 3,
  }
}
const vals = Object.values(per)
// Ring geschlossen: doppelter Schlusspunkt wird entfernt, Umlaufsinn wird auf Uhrzeigersinn gedreht
const sq = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]], sqN = normalizeRing(sq), ccw = normalizeRing([[0, 0], [0, 1], [1, 1], [1, 0]])
// Farbe deterministisch und = fromColors der drei größten Anteile
const g1 = groundColorOf(doc.stages.goblin_bank.edgePalette), g2 = groundColorOf(doc.stages.goblin_bank.edgePalette.slice().reverse())
const giza = all.giza_pyramid
// Höhen: außen = Geländehöhe, innen = Bühnenboden; marble_terraces mit Figurenboden aus dem Slot (−0,042 u) liegt der Rand tiefer
const hill = stitchFor(doc.stages.goblin_bank, { outerY: (x, z) => 1.5 }), marble = stitchFor(doc.stages.marble_terraces, { floorY_u: -0.042 })
const b = blendAt(all.goblin_bank, 0, 0), bOut = blendAt(all.goblin_bank, 1000, 0)
// 3D-Modul (three in Node, ohne Renderer): Geometrie mit Farben, island = leer, dispose räumt auf
const mod = createTerrainStitch({ entry: doc.stages.goblin_bank }), modIsl = createTerrainStitch({ entry: doc.stages.snow_island })
const gGeo = mod.object3d.children[0]?.geometry, tri = mod.info().tris
mod.dispose(); modIsl.dispose()
let threw = false; try { normalizeRing([[0, 0], [0, 0], [1, 1]]) } catch { threw = true }

process.exit(report('unit-terrainStitch', {
  nineteenStages: ids.length === 19,
  islandsNull: islands.length === 4 && islands.every((id) => all[id] === null),
  plinthUsesBase: all.giza_pyramid.ring === 'footprintBase' && all.portal_ruin.ring === 'footprintBase',
  groundUsesFootprint: joined.filter((id) => doc.stages[id].terrainMode === 'ground').every((id) => all[id].ring === 'footprint'),
  ringClosedNoDuplicate: sqN.length === 4 && near(signedAreaXZ(sqN), 1),
  degenerateThrows: threw,
  clockwiseEnforced: isClockwise(ccw) && isClockwise(sqN) && vals.every((v) => v.cw),
  metresAreUTimesScale: vals.every((v) => v.metres),
  areaMatchesWs0: vals.every((v) => v.areaMatchesWs0),
  outerRingSimple: vals.every((v) => v.outerSimple),
  outerOutsideInner: vals.every((v) => v.outerOutside && v.minGap >= 3.9), // skirt 4 m, Raster 0,2 m
  meshFacesUp: vals.reduce((a, v) => a + v.meshUp, 0) <= 2, // ein gefaltetes Dreieck in prison_panopticon (Kerbe), s. overlap
  meshCoversAnnulus: vals.every((v) => v.overlap >= -1e-6 && v.overlap < 0.01),
  colourDeterministic: g1.ground === g2.ground && g1.ground === groundColorOf(doc.stages.goblin_bank.edgePalette).ground && /^#[0-9a-f]{6}$/.test(g1.ground),
  colourFromTop3: g1.from.length === 3 && g1.from[0] === '#4e4341',
  plinthColourFromBase: giza.palette.from[0] === doc.stages.giza_pyramid.footprintBase.edgePalette[0].hex,
  outerHeightFollowsTerrain: hill.outer.every((p) => near(p[1], 1.5)) && hill.inner.every((p) => near(p[1], 0)),
  floorOffsetMarble: near(marble.y0, (doc.stages.marble_terraces.groundY_u + 0.042) * doc.stages.marble_terraces.scale_m_per_u, 1e-9) && all.marble_terraces.y0 === 0,
  blendInsideOutside: b.inside && b.t === 0 && !bOut.inside && bOut.t === 1,
  module3d: !!gGeo && gGeo.getAttribute('color')?.count === gGeo.getAttribute('position').count && tri > 0 && modIsl.object3d.children.length === 0,
}, { per, goblinGround: g1, marbleY0: marble.y0 }))
