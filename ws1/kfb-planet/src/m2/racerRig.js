// R1a (V-481) · Antriebs-Modul am Racer einhängen (ohne React, damit M2Car.jsx kein Modul-Text wird): Modell in rig.stretch, rig unter die Deformer-Gruppe.
// mountRacerRig({ body, model, racer, unit, seed, scene, dustColor }) → { rig, release() } · scene: Weltraum-Staub (Bodennähe), dustColor: Geländefarbe
import { createVehicleRig } from '../modules/vehicleRig.js'
import { createHeadlights } from '../look/headlights.js'

export function mountRacerRig({ body, model, racer, unit, seed = 1, scene = null, dustColor = null, style = 'glow' }) {
  const rig = createVehicleRig({ anchors: racer.anchors, hover: racer.hover, glow: racer.glow, unit, seed, style })   // style 'clay' = Knet-Flamme (V-654)
  model.scale.setScalar(unit); rig.stretch.add(model); body.add(rig.object3d); if (scene) scene.add(rig.world); if (dustColor) rig.setDustColor(dustColor)
  // Entsorgen verzögert (V-631 Racer-Wechsel): three.js gibt die Shader frei, sobald der letzte Nutzer entsorgt ist – der neue Wagen müsste sie dann neu
  // übersetzen (Ruckler). So übernimmt er die fertigen Programme, die alten Materialien gehen 3 s später.
  return { rig, release: () => { body.remove(rig.object3d); rig.stretch.remove(model); if (scene) scene.remove(rig.world); setTimeout(() => rig.dispose(), 3000) } }
}

// Bodennähe-Partikel je Terraintyp (V-487 Stufe 1): aus Höhe und Steigung des Geländes – flach = Sand-Knete, Hang = Erde, steil = Fels, Hügelkuppe = Gras
export const DUST_TYPES = Object.freeze({ sand: '#c9b48a', earth: '#9c7f5c', rock: '#8f877c', grass: '#97a45c' })
export function terrainDustColor(H, x, z, { flatY = 0.6 } = {}) {
  const e = 0.6, y = H(x, z), sl = Math.hypot(H(x + e, z) - H(x - e, z), H(x, z + e) - H(x, z - e)) / (2 * e)
  return sl > 0.7 ? DUST_TYPES.rock : sl > 0.3 ? DUST_TYPES.earth : y > flatY ? DUST_TYPES.grass : DUST_TYPES.sand
}

// V-631 · Front-Scheinwerfer am Racer (ohne React, wie das Antriebs-Modul): Gläser am Modell, Kegel in der Szene, Lichtfleck über den groundfx-Kanal.
// release(): sofort aus (Kegel weg, Pfützen leer), entsorgt 3 s später – die Shader bleiben so für den nächsten Wagen übersetzt.
export function mountHeadlights({ model, racer, scene, pools, ground, unit }) {
  const a = racer.headlights; if (!a) return null
  const hl = createHeadlights({ car: model, anchors: a.lamps.map((l) => ({ pos: l.pos, r: l.r, dir: a.dir })), color: racer.glow.plume, core: racer.glow.core, scene, pools, ground, unit,
    restH: unit * (a.lamps.reduce((s, l) => s + l.pos[1], 0) / a.lamps.length + (racer.locomotion === 'wheels' ? 0 : 0.7)) })   // Lampenhöhe im Stand (Schwebehöhe 0,7 Rig bei Schwebern)
  return { hl, release: () => { hl.setOn(false); setTimeout(() => hl.dispose(), 3000) } }
}

// Geladenes Racer-Modell freigeben (Speicher-Deckel in M2Car: höchstens 5 Racer): Geometrie, Texturen (auch die umgerechneten von Look und Heldenfarbe), Materialien
export function releaseModel(root) {
  root?.traverse((o) => { if (!o.isMesh) return; o.geometry.dispose()
    for (const mt of [].concat(o.material)) { const src = mt.userData.kfbClay?.src; for (const m of src ? [mt, src] : [mt]) { for (const v of Object.values(m)) if (v?.isTexture) v.dispose(); m.userData.vehicleLook?.tex?.dispose(); m.userData.hero?.orig?.dispose(); for (const t of Object.values(m.userData.vclay || {})) if (t?.isTexture) t.dispose(); m.dispose() } } })   // Knet-Stufe: auch das Quell-Material und die umgetönten Texturen
}
