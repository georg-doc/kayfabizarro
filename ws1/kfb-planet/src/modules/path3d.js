// C3b · Ein Weg durch die Demo-Wiese (Brief Fundsachen-Demo: „ein Weg“, Fundsachen nie darauf): flaches Band entlang einer Polylinie, auf der
// gerenderten Geländefläche (Mitte +4 mm, Kanten eingesunken), Ecken gerundet (Stützpunkte alle 0,4 m mit Catmull-Rom), matt in Sandton. Rand als Sprenkel-Band (V-403) folgt mit dem Gelände-Look.
// Modul nach Host-Vertrag R1.2. options: { path: { pts: [[x, z]…], halfW }, terrainH(x, z), color }
import * as THREE from 'three'
import { SPECKLE_GLSL_NOSIN, WARP_GLSL, WS1_SHAPE_GLSL, WS1_BI_GLSL, ws1LayerGLSL, speckleK, speckleBiK } from '../vendor/speckle/kfb-speckle-transition.v1.js'

export function createPath3d({ path, terrainH, color = '#cdb48c', shade = null } = {}) { // shade(mat): Look-Haken (terrain3: Palettenschatten)
  const root = new THREE.Group(); root.name = 'demo-path'
  const curve = new THREE.CatmullRomCurve3(path.pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal')
  const n = Math.max(8, Math.ceil(curve.getLength() / 0.4)), P = curve.getSpacedPoints(n), pos = [], idx = [], wts = [], XS = 15, BAND = 1.1
  for (let i = 0; i <= n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l
    /* runde Kappen an beiden Enden (Kritiker MVP R1 C2: „Start auf beiger Rechteck-Platte mit geraden Kanten“) – Breite über 1,4·halfW elliptisch auf ≈ 0 */
    const sL = (i / n) * curve.getLength(), capL = 1.4 * path.halfW, u = Math.min(sL, curve.getLength() - sL) / capL, cap = u >= 1 ? 1 : Math.max(0.04, Math.sqrt(1 - (1 - u) * (1 - u))), hw = path.halfW * cap
    /* V-654 C6 (Kritiker MVP R1/R2: „helle, kantige Kuppe“, „Block“): quer 11 Punkte, jeder auf der Geländefläche – der Weg liegt IM Gelände statt sich über Kuppen
       zu wölben; Ränder eingesunken und wellig (nie zwei Parallelen) */
    // Rand (V-654 C6, V-403): das Band reicht BAND m über die Wegkante hinaus; das Gewicht fällt dort weich ab und das Sprenkel-Modul entscheidet je Bildpunkt
    // Weg oder Gelände (Ausschnitt per discard, kein Alpha) – Weg-Flecken laufen ins Gelände, Gelände-Inseln in den Weg, keine Kante
    const wob = 1 + 0.12 * Math.sin(sL * 0.9 + 1.3) + 0.06 * Math.sin(sL * 2.3)
    for (let c = 0; c < XS; c++) { const s = -1 + (2 * c) / (XS - 1), off = s * (hw + BAND * cap), x = P[i].x + nx * off, z = P[i].z + nz * off
      const d = Math.abs(off), w = 1 - Math.min(1, Math.max(0, (d - hw * 0.75 * wob) / (hw * 0.25 * wob + BAND * cap))); pos.push(x, terrainH(x, z) + (Math.abs(s) > 0.999 ? -0.02 : 0.004), z); wts.push(Math.min(1, w * cap + (cap < 1 ? 0 : 0))) }   // Kanten sinken ein: Schnitt statt Flimmern am Rand; Mitte auf Bodenhöhe (+4 mm, Tiefenversatz gewinnt), sonst steckt die Ferse im Weg (Georg 21.10.)
    if (i < n) { const k = i * XS; for (let c = 0; c < XS - 1; c++) idx.push(k + c, k + c + 1, k + c + XS, k + c + 1, k + c + XS + 1, k + c + XS) }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('aPathW', new THREE.Float32BufferAttribute(wts, 1)); geo.setIndex(idx); geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  shade?.(mat)
  { const U = { uSpeckleK: { value: speckleK() }, uSpBiK: { value: speckleBiK() }, uSpMix: { value: 0.3 } }, lib = SPECKLE_GLSL_NOSIN + WARP_GLSL + WS1_SHAPE_GLSL + WS1_BI_GLSL + ws1LayerGLSL('kfbPathLayer', true, true)
    const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
    mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, U)
      sh.vertexShader = 'attribute float aPathW; varying float vPathW; varying vec2 vPathXZ;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vPathW = aPathW; vPathXZ = (modelMatrix * vec4(transformed, 1.0)).xz;')
      sh.fragmentShader = 'varying float vPathW; varying vec2 vPathXZ;\n' + lib + '\n' + sh.fragmentShader.replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
  { vec2 q = vPathXZ + vec2(13.7, 5.1); vec2 wq = kfbWarpV2(q, 0.9) + kfbWs1Shape2(q, 0.9); float rimP; float selP = kfbPathLayer(q + 31.7 + wq, 0.9, clamp(vPathW, 0.0, 1.0), rimP);
    if (selP < 0.5) discard; }`) }
    mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|pathSpeckle'; mat.needsUpdate = true }
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'demo-path-band'; mesh.receiveShadow = true; root.add(mesh)
  return { object3d: root, update() {}, info: () => ({ length: +curve.getLength().toFixed(2), halfW: path.halfW, verts: pos.length / 3 }), dispose() { geo.dispose(); mat.dispose(); root.clear() } }
}
