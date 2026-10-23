// Schatten-Hebel (Georg 24.10.): Fundsachen und Plakat warfen Schatten, obwohl sie nicht im Bild waren (≈ 55 000 Dreiecke im Schattenbild).
// Alle 0,2 s: ein Teil wirft nur dann Schatten, wenn seine Hüllkugel – um die Schattenreichweite vergrößert – das Kamerabild berührt. So fällt kein
// Schatten weg, der von knapp außerhalb ins Bild reichen würde. Im Bild sichtbar ändert sich nichts. scull=0 schaltet ab.
import * as THREE from 'three'

export const SHADOW_CULL_ON = !(typeof location !== 'undefined' && /(^|[#,])scull=0(,|$)/.test(location.hash))

export function createShadowCull({ roots, camera, reach = 6, every = 0.2 }) {
  const fr = new THREE.Frustum(), m = new THREE.Matrix4(), sph = new THREE.Sphere(), wanted = new WeakMap(), stats = { casting: 0, culled: 0 }
  let t = 0
  return {
    update(dt) {
      if ((t -= dt) > 0) return; t = every
      camera.updateMatrixWorld(); m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); fr.setFromProjectionMatrix(m)
      stats.casting = stats.culled = 0
      for (const r of roots()) {
        if (!r) continue
        r.traverse((o) => {
          if (!o.isMesh) return
          if (!wanted.has(o)) wanted.set(o, o.castShadow)   // ursprünglicher Wunsch des Moduls (wer nie Schatten warf, bleibt so)
          if (!wanted.get(o)) return
          if (o.isInstancedMesh) { if (!o.boundingSphere) o.computeBoundingSphere(); sph.copy(o.boundingSphere) } else { if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); sph.copy(o.geometry.boundingSphere) }
          sph.applyMatrix4(o.matrixWorld); sph.radius += reach
          o.castShadow = fr.intersectsSphere(sph); o.castShadow ? stats.casting++ : stats.culled++
        })
      }
    },
    status: () => ({ ...stats }),
  }
}
