// Schatten-Hebel (Georg 24.10.): der Racer wirft seinen Schatten über eine vereinfachte Kopie SEINER Form (kein runder Ersatz, Blob-Schatten = Kanon-FAIL).
// Alle schattenwerfenden Teile werden im Modell-Raum zusammengelegt, gleiche Positionen verschweißt und mit meshoptimizer auf ≈ 10 % der Dreiecke
// vereinfacht (Fehler relativ zur Modellgröße). Im Hauptbild zeichnet die Kopie nichts: ihr Material schiebt jede Ecke aus dem Bild (der Schattenpass
// nimmt ein eigenes Tiefen-Material und sieht die echte Form). Ebenen gehen nicht: three prüft auch im Schattenpass die Ebenen der Hauptkamera.
// Seit 24.10. Standard (Georg), rshadow=full zeigt den vollen Schatten.
import * as THREE from 'three'
import { MeshoptSimplifier } from 'meshoptimizer'

export const SHADOW_PROXY_ON = !(typeof location !== 'undefined' && /(^|[#,])rshadow=full(,|$)/.test(location.hash))   // Georg 24.10.: Standard; rshadow=full = voller Schatten
export const SHADOW_PROXY = Object.freeze({ ratio: 0.2, error: 0.005 })   // Georg 24.10.: „pixeliger?“ – feiner vereinfacht (20 % statt 10 %), Vorderseiten werfen wie das Original (V-440)
const MAT = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }), CACHE = new WeakMap()   // Modell → Kopie (nicht in userData: Object3D.clone kopiert userData per JSON)
MAT.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);') }   // Hauptbild: alles außerhalb, keine Pixel
MAT.customProgramCacheKey = () => 'kfbShadowProxy'
MAT.shadowSide = THREE.FrontSide   // wie kfb-stage-light v1.1 für alle Werfer (V-440: Vorderseiten werfen, sonst Säume/Akne am eigenen Körper)

// root: das geladene Modell (vor dem Einhängen); gibt die Kopie zurück oder null. Teure Arbeit einmal je Modell (Ergebnis am Modell zwischengespeichert)
export async function buildShadowProxy(root, { ratio = SHADOW_PROXY.ratio, error = SHADOW_PROXY.error } = {}) {
  if (CACHE.has(root)) return CACHE.get(root)
  await MeshoptSimplifier.ready
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), m = new THREE.Matrix4(), v = new THREE.Vector3(), pos = [], idx = []
  let base = 0
  root.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || !o.castShadow || !o.geometry?.attributes?.position) return
    const g = o.geometry, p = g.attributes.position; m.multiplyMatrices(inv, o.matrixWorld)
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z) }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i)); else for (let i = 0; i < p.count; i++) idx.push(base + i)
    base += p.count
  })
  if (!idx.length) { CACHE.set(root, null); return null }
  const P = new Float32Array(pos), remap = MeshoptSimplifier.generatePositionRemap(P, 3), I = new Uint32Array(idx.length)
  for (let i = 0; i < idx.length; i++) I[i] = remap[idx[i]]
  const target = Math.max(300, Math.floor((I.length / 3) * ratio) * 3)
  const [out] = MeshoptSimplifier.simplify(I, P, 3, target, error, ['Prune'])
  const packed = out.slice(), [remap2, n] = MeshoptSimplifier.compactMesh(packed)   // packed wird an Ort und Stelle umnummeriert, remap2: alt → neu
  const used = new Float32Array(n * 3)
  for (let i = 0; i < out.length; i++) { const o = out[i], nn = remap2[o]; used[nn * 3] = P[o * 3]; used[nn * 3 + 1] = P[o * 3 + 1]; used[nn * 3 + 2] = P[o * 3 + 2] }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(used, 3)); geo.setIndex(new THREE.BufferAttribute(packed, 1)); geo.computeBoundingSphere()
  const mesh = new THREE.Mesh(geo, MAT); mesh.name = 'shadow-proxy'; mesh.castShadow = true; mesh.receiveShadow = false; mesh.frustumCulled = false
  mesh.userData.stats = { trisIn: I.length / 3, trisOut: packed.length / 3 }
  CACHE.set(root, mesh)
  return mesh
}

// Kopie einhängen: Original wirft keinen Schatten mehr, die Kopie wirft ihn
export function attachShadowProxy(root, proxy) {
  if (!proxy) return () => {}
  const prev = []; root.traverse((o) => { if (o.isMesh && o !== proxy && o.castShadow) { prev.push(o); o.castShadow = false } })
  root.add(proxy)
  return () => { proxy.removeFromParent(); for (const o of prev) o.castShadow = true }
}
