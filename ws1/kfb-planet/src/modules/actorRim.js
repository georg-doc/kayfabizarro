// L2 Schritt 1 (V-340) · Licht-Identität je Figur als Randlicht (Fresnel) im Material, keine zusätzlichen Lichter (Georg-Absicht §2, V-329 bleibt bindend).
// Modul nach Host-Vertrag R1.2: hängt an die festen Materialien der Figuren (MeshStandard/Phong/Lambert; Shader-Materialien wie das Augen-Rig und
// durchsichtige Teile bleiben unberührt) einen Randterm rimColor · rimStrength · (1 − n·v)^3 an, sobald die Figur sichtbar ist; dispose nimmt ihn wieder ab.
// Gesichter bleiben gleichmäßig: Der Rand wirkt nur an der Silhouette (n·v klein).
// options: { targets: () => [{ module, intent: { rimColor, rimStrength } }] }
import * as THREE from 'three'

const KEY = 'kfbRim'
function patch(mat, intent) {
  if (!mat || mat.isShaderMaterial || mat.userData[KEY] || !(mat.isMeshStandardMaterial || mat.isMeshPhongMaterial || mat.isMeshLambertMaterial)) return false
  if (mat.transparent && (mat.opacity == null || mat.opacity < 0.98)) return false
  const U = { rimColor: { value: new THREE.Color(intent.rimColor) }, rimStrength: { value: intent.rimStrength } }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform vec3 rimColor; uniform float rimStrength;\n' + sh.fragmentShader.replace('#include <lights_fragment_begin>',
      '{ float kfbNv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0); totalEmissiveRadiance += rimColor * rimStrength * pow(1.0 - kfbNv, 3.0); }\n#include <lights_fragment_begin>')
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|kfb-rim'
  mat.userData[KEY] = { U, prev, prevKey }; mat.needsUpdate = true; return true
}
function unpatch(mat) { const d = mat?.userData?.[KEY]; if (!d) return; mat.onBeforeCompile = d.prev || (() => {}); mat.customProgramCacheKey = d.prevKey || (() => ''); delete mat.userData[KEY]; mat.needsUpdate = true }

export function createActorRim({ targets = () => [] } = {}) {
  const root = new THREE.Group(); root.name = 'actor-rim'
  const patched = new Set() // alle gepatchten Materialien (auch nach einem Materialwechsel, z. B. Knet-Look, wird je Bild nachgezogen)
  const count = new Map()
  return {
    object3d: root,
    update() {
      for (const { module: a, intent } of targets() || []) {
        if (!a?.object3d || a.status?.().shown === false || a.status?.().status !== 'OK') continue
        let n = 0; a.object3d.traverse((o) => { if (!o.isMesh) return; [].concat(o.material).forEach((m) => { if (m?.userData?.[KEY]) n++; else if (patch(m, intent)) { patched.add(m); n++ } }) })
        count.set(a, n)
      }
    },
    info: () => [...count.values()],
    dispose() { patched.forEach(unpatch); patched.clear(); count.clear() },
  }
}
