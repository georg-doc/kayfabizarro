// R1a (V-481) · Antriebs-Modul am Racer einhängen (ohne React, damit M2Car.jsx kein Modul-Text wird): Modell in rig.stretch, rig unter die Deformer-Gruppe.
// mountRacerRig({ body, model, racer, unit, seed, scene, dustColor }) → { rig, release() } · scene: Weltraum-Staub (Bodennähe), dustColor: Geländefarbe
import { createVehicleRig } from '../modules/vehicleRig.js'

export function mountRacerRig({ body, model, racer, unit, seed = 1, scene = null, dustColor = null }) {
  const rig = createVehicleRig({ anchors: racer.anchors, hover: racer.hover, glow: racer.glow, unit, seed })
  model.scale.setScalar(unit); rig.stretch.add(model); body.add(rig.object3d); if (scene) scene.add(rig.world); if (dustColor) rig.setDustColor(dustColor)
  return { rig, release: () => { body.remove(rig.object3d); rig.stretch.remove(model); rig.dispose() } }
}

// Bodennähe-Partikel je Terraintyp (V-487 Stufe 1): aus Höhe und Steigung des Geländes – flach = Sand-Knete, Hang = Erde, steil = Fels, Hügelkuppe = Gras
export const DUST_TYPES = Object.freeze({ sand: '#c9b48a', earth: '#9c7f5c', rock: '#8f877c', grass: '#97a45c' })
export function terrainDustColor(H, x, z, { flatY = 0.6 } = {}) {
  const e = 0.6, y = H(x, z), sl = Math.hypot(H(x + e, z) - H(x - e, z), H(x, z + e) - H(x, z - e)) / (2 * e)
  return sl > 0.7 ? DUST_TYPES.rock : sl > 0.3 ? DUST_TYPES.earth : y > flatY ? DUST_TYPES.grass : DUST_TYPES.sand
}
