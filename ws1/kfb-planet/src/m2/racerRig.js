// R1a (V-481) · Antriebs-Modul am Racer einhängen (ohne React, damit M2Car.jsx kein Modul-Text wird): Modell in rig.stretch, rig unter die Deformer-Gruppe.
// mountRacerRig({ body, model, racer, unit, seed, scene, dustColor }) → { rig, release() } · scene: Weltraum-Staub (Bodennähe), dustColor: Geländefarbe
import { createVehicleRig } from '../modules/vehicleRig'

export function mountRacerRig({ body, model, racer, unit, seed = 1, scene = null, dustColor = null }) {
  const rig = createVehicleRig({ anchors: racer.anchors, hover: racer.hover, glow: racer.glow, unit, seed })
  model.scale.setScalar(unit); rig.stretch.add(model); body.add(rig.object3d); if (scene) scene.add(rig.world); if (dustColor) rig.setDustColor(dustColor)
  return { rig, release: () => { body.remove(rig.object3d); rig.stretch.remove(model); rig.dispose() } }
}
