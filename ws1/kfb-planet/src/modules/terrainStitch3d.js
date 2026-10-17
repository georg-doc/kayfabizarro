// Slice 1 · Terrain-Schürze um ein Diorama (V-341, V-342) als Modul nach Host-Vertrag R1.2: create(options) -> { object3d, update, dispose }.
// Rechnet nichts selbst: Ringe, Höhen und Farben kommen aus src/world/terrainStitch.js (rein, Node-geprüft). Hier nur BufferGeometry mit
// Eckfarben (Rand edge → Zonenboden ground, Anteil t je Ecke), ohne Texturen. Knet-Relief (triplanare Detail-Normal, V-341) und toneMapped:false
// (V-346, Modul toneSplit) setzt die Hülle wie beim Boden; das Material ist austauschbar (options.material).
// options: { entry (Eintrag aus kfb.stage-edges/1) | stitch (fertiges stitchFor-Ergebnis), stitchOptions?, ground? (Zonenboden-Farbe statt
//            fromColors), edge? (Randfarbe), material? }
// island → leere Gruppe (kein Anschluss, Felsrand bleibt sichtbar).
import * as THREE from 'three'
import { stitchFor, stitchMesh } from '../world/terrainStitch.js'

export const stitchLog = { create: 0, update: 0, dispose: 0 }

export function createTerrainStitch(options = {}) {
  stitchLog.create++
  const st = options.stitch !== undefined ? options.stitch : stitchFor(options.entry, options.stitchOptions || {})
  const root = new THREE.Group(); root.name = 'terrain-stitch'
  let geo = null, mat = null, info = { stage: options.entry?.stage ?? st?.stage ?? null, mode: st ? st.mode : 'island', tris: 0 }
  if (st) {
    const m = stitchMesh(st)
    geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(m.positions, 3))
    // Farbe je Ecke: sRGB-Hex → Arbeitsfarbraum (THREE.Color wandelt), gemischt mit t
    const cIn = new THREE.Color(options.edge || st.edge || st.ground || '#888888'), cOut = new THREE.Color(options.ground || st.ground || '#888888'), c = new THREE.Color()
    const col = new Float32Array(m.blend.length * 3)
    m.blend.forEach((t, i) => { c.copy(cIn).lerp(cOut, t); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b })
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('blend', new THREE.BufferAttribute(m.blend, 1)) // für einen späteren Knet-Shader (Rand-Steine, V-341)
    geo.setIndex(new THREE.BufferAttribute(m.indices, 1))
    geo.computeVertexNormals(); geo.computeBoundingSphere()
    mat = options.material || new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 })
    const mesh = new THREE.Mesh(geo, mat); mesh.name = 'terrain-stitch:' + (st.stage || '?'); mesh.receiveShadow = true; mesh.castShadow = false
    root.add(mesh)
    info = { stage: st.stage, mode: st.mode, ring: st.ring, tris: m.indices.length / 3, rings: st.rings.length, ground: st.ground, edge: st.edge, skirt_m: st.skirt_m }
  }
  return {
    object3d: root,
    stitch: st,
    info: () => info,
    update() { stitchLog.update++ },
    dispose() { stitchLog.dispose++; geo?.dispose(); if (mat && !options.material) mat.dispose(); root.clear() },
  }
}
