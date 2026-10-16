// L2 Schritt 1 (V-340) · Licht-Identität je Figur als Randlicht (Fresnel) im Material, keine zusätzlichen Lichter (Georg-Absicht §2, V-329 bleibt bindend).
// Modul nach Host-Vertrag R1.2: hängt an die festen Materialien der Figuren (MeshStandard/Phong/Lambert; Shader-Materialien wie das Augen-Rig und
// durchsichtige Teile bleiben unberührt) einen Randterm rimColor · rimStrength · (1 − n·v)^rimPower an, sobald die Figur sichtbar ist; dispose nimmt ihn wieder ab.
// Gesichter bleiben gleichmäßig: Der Rand wirkt nur an der Silhouette (n·v klein).
// V-346 · Gesichts-Fill (faceFill > 0): Kopf und Mund (FACE) bekommen zusätzlich faceFill × eigene Grundfarbe als Selbstleuchten, und der Kopf empfängt
// keinen Sonnenschatten mehr (Georg: „FBs Mundpartie zu dunkel“). Teilt sich der Kopf ein Material mit dem Körper, bekommt er eine eigene Kopie, damit
// nur das Gesicht heller wird. Durchsichtige Gesichtsteile (Mund-Decal) bekommen nur das Fill, keinen Rand.
// options: { targets: () => [{ module, intent: { rimColor, rimStrength, rimPower = 3, faceFill = 0 } }] }
import * as THREE from 'three'

const KEY = 'kfbRim'
const FACE = /(^|[_/\s-])(head|face|mouth|lips?)([_/\s-]|$)/i
function patch(mat, intent, face) {
  if (!mat || mat.isShaderMaterial || mat.userData[KEY] || !(mat.isMeshStandardMaterial || mat.isMeshPhongMaterial || mat.isMeshLambertMaterial)) return false
  const see = mat.transparent && (mat.opacity == null || mat.opacity < 0.98)
  if (see && !face) return false
  const fill = face ? intent.faceFill || 0 : 0
  const U = { rimColor: { value: new THREE.Color(intent.rimColor) }, rimStrength: { value: see ? 0 : intent.rimStrength }, rimPower: { value: intent.rimPower ?? 3 }, faceFill: { value: fill } }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform vec3 rimColor; uniform float rimStrength; uniform float rimPower; uniform float faceFill;\n' + sh.fragmentShader.replace('#include <lights_fragment_begin>',
      '{ float kfbNv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0); totalEmissiveRadiance += rimColor * rimStrength * pow(1.0 - kfbNv, rimPower) + diffuseColor.rgb * faceFill; }\n#include <lights_fragment_begin>')
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|kfb-rim'
  mat.userData[KEY] = { U, prev, prevKey, face: fill > 0 }; mat.needsUpdate = true; return true
}
function unpatch(mat) { const d = mat?.userData?.[KEY]; if (!d) return; mat.onBeforeCompile = d.prev || (() => {}); mat.customProgramCacheKey = d.prevKey || (() => ''); delete mat.userData[KEY]; mat.needsUpdate = true }

export function createActorRim({ targets = () => [] } = {}) {
  const root = new THREE.Group(); root.name = 'actor-rim'
  const patched = new Set() // alle gepatchten Materialien (auch nach einem Materialwechsel, z. B. Knet-Look, wird je Bild nachgezogen)
  const own = new Map() // Gesichts-Mesh → { before, receive, mine } (Original-Material, Schattenempfang vorher, eigene Kopie)
  const count = new Map(), faces = new Map()
  return {
    object3d: root,
    update() {
      for (const { module: a, intent } of targets() || []) {
        if (!a?.object3d || a.status?.().shown === false || a.status?.().status !== 'OK') continue
        let n = 0, f = 0
        a.object3d.traverse((o) => {
          if (!o.isMesh) return
          const face = (intent.faceFill || 0) > 0 && FACE.test(o.name || '') // nur das Mesh selbst (Kopf, Mund), nicht alles unter dem Kopf-Knochen (Ohren, Haare)
          if (face && !own.has(o)) {
            const d = { before: o.material, receive: o.receiveShadow, mine: null }; own.set(o, d)
            if (/head/i.test(o.name || '')) o.receiveShadow = false
            const m = o.material
            if (m && !Array.isArray(m) && !m.isShaderMaterial && !m.userData?.[KEY]) { let shared = false; a.object3d.traverse((x) => { if (x !== o && x.material === m) shared = true }); if (shared) { o.material = d.mine = m.clone() } }
          }
          ;[].concat(o.material).forEach((m) => { if (m?.userData?.[KEY]) { n++; if (m.userData[KEY].face) f++ } else if (patch(m, intent, face)) { patched.add(m); n++; if (m.userData[KEY].face) f++ } })
        })
        count.set(a, n); faces.set(a, f)
      }
    },
    info: () => [...count.values()],
    faceInfo: () => [...faces.values()],
    dispose() {
      patched.forEach(unpatch); patched.clear()
      own.forEach((d, o) => { o.receiveShadow = d.receive; if (d.mine && o.material === d.mine) { o.material = d.before; d.mine.dispose() } }); own.clear(); count.clear(); faces.clear()
    },
  }
}
