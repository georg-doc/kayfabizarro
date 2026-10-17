// Slice 1 (V-341/V-396/V-403) · Gelände um eine Meshy-Bühne: Knet-Boden auf Höhe des Bühnen-Rands, Übergang als Sprenkel-Band (kfb-speckle-transition.v1,
// Preset diorama↔ground), nie als Farbverlauf. An der Naht die Bühnenfarbe (größter Anteil der edgePalette, ≤ +10 % L, V-396), außen der Zonenboden.
// Gewicht je Vertex nach dem Abstand zum Umriss (footprint bzw. footprintBase bei Sockel-Bühnen, aus kfb.stage-edges/1 über world/terrainStitch.stitchFor).
// Schwebende Inseln (terrainMode island) bekommen kein Gelände. Höhenfeld-Anschluss kommt später (WS0: langfristig Höhenfeld, Schürze als Zwischenstufe).
// Modul nach Host-Vertrag R1.2. options: { stitch (stitchFor-Ergebnis), zoneColor, radius = 70 (m), seed }
import * as THREE from 'three'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { createSpeckle } from '../vendor/speckle/kfb-speckle-transition.v1.js'
import { signedDistToRing } from '../world/terrainStitch.js'

export function createStageGround({ stitch, zoneColor = '#8b68c7', radius = 70, seed = 'stage' } = {}) {
  const root = new THREE.Group(); root.name = 'stage-ground'
  const state = { status: stitch ? 'OK' : 'NONE', ring: stitch?.ground || null, y0: stitch?.y0 ?? null, mode: stitch?.mode ?? 'island' }
  if (!stitch) return { object3d: root, update() {}, info: () => state, dispose() {} }
  const fam = makeClayFamily('SG', { uClayNear: { value: 20 }, uClayFar: { value: 70 }, uClayScale: { value: 1.2 }, uClayAmt: { value: 0.45 } }, { oct: 2, near: true, stick: false })
  const mat = fam.std(zoneColor, 0.95)
  const speckle = createSpeckle({ seed, preset: 'diorama-ground' })
  const spH = speckle.patch(mat, { layers: [{ weight: 'aSW.x', color: stitch.ground || zoneColor, name: 'ring' }] })
  const geo = new THREE.RingGeometry(0, radius, 256, 220).rotateX(-Math.PI / 2)
  speckle.bake(geo, (x, y, z) => Math.max(0, signedDistToRing([x, z], stitch.footprint)))
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'stage-ground-clay'; mesh.receiveShadow = true; mesh.position.y = stitch.y0 - 0.02 // knapp unter dem Bühnenboden (kein Z-Kampf)
  root.add(mesh)
  return {
    object3d: root,
    update() {},
    setZone(hex) { mat.color.set(hex) },
    info: () => ({ ...state, verts: geo.attributes.position.count, cell_m: speckle.cell_m ?? null, uniforms: Object.keys(spH.uniforms || {}).length }),
    dispose() { speckle.dispose(); geo.dispose(); mat.dispose(); root.clear() },
  }
}
