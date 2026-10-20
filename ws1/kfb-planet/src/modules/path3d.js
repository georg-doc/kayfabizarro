// C3b · Ein Weg durch die Demo-Wiese (Brief Fundsachen-Demo: „ein Weg“, Fundsachen nie darauf): flaches Band entlang einer Polylinie, 3 cm über der
// gerenderten Geländefläche, Ecken gerundet (Stützpunkte alle 0,4 m mit Catmull-Rom), matt in Sandton. Rand als Sprenkel-Band (V-403) folgt mit dem Gelände-Look.
// Modul nach Host-Vertrag R1.2. options: { path: { pts: [[x, z]…], halfW }, terrainH(x, z), color }
import * as THREE from 'three'

export function createPath3d({ path, terrainH, color = '#cdb48c' } = {}) {
  const root = new THREE.Group(); root.name = 'demo-path'
  const curve = new THREE.CatmullRomCurve3(path.pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal')
  const n = Math.max(8, Math.ceil(curve.getLength() / 0.4)), P = curve.getSpacedPoints(n), pos = [], idx = []
  for (let i = 0; i <= n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l
    for (const s of [-1, 1]) { const x = P[i].x + nx * path.halfW * s, z = P[i].z + nz * path.halfW * s; pos.push(x, terrainH(x, z) + 0.03, z) }
    if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2) }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'demo-path-band'; mesh.receiveShadow = true; root.add(mesh)
  return { object3d: root, update() {}, info: () => ({ length: +curve.getLength().toFixed(2), halfW: path.halfW, verts: pos.length / 3 }), dispose() { geo.dispose(); mat.dispose(); root.clear() } }
}
