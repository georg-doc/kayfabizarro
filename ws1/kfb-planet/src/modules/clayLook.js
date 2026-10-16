// L2 Schritt 2 (V-340) · Ein Knet-Look für KayKit-Figuren und Meshy-Fahrzeuge: Materialien werden auf K1/H0-Golden clay-material.v8 umgestellt
// (Profil `figure` bzw. `vehicle`, clay-profiles.v2; Wahl und Herkunft in vendor/clay/SOURCE.md). Nur Material, keine Netzänderung (V-336, SSOT „Characters“).
// Ausgenommen: Gesicht und Augen (Augen-Rig, Lider, Mund, Brauen; eigener Besitzer), Shader-Materialien, durchsichtige Teile. Die Farbtextur der
// Quelle bleibt erhalten (src-Material), daher bleiben Meshy- und KayKit-Texturen erkennbar. Modul nach Host-Vertrag R1.2; dispose stellt die
// Original-Materialien wieder her.
// options: { targets: () => [Modul mit object3d], profile = 'figure', seed = 11 }
import * as THREE from 'three'
import { makeClayRelief } from '../vendor/clay/clay-relief.v2.js'
import { makeClayUniforms, makeClayMaterial, PROFILES } from '../vendor/clay/clay-material.v8.js'

const SKIP = /eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash|brow|nose|moust|beard|kfb-lid|clay-lid|eyerig|faceHost|face-host|decal/i // wie contact-ao v1, dazu Nase/Bart (Gesichtsteile)
// Kopf: sanftes Profil, damit Gesichter gleichmäßig und lesbar bleiben (L2 G1/G7); WS1-Vorschlag auf Basis von `figure` (weniger Striche, Abdrücke, Dellen)
const HEAD = /(^|_)head$/i
const FACE_PROFILE = { ...PROFILES.figure, stroke: 0.35, print: 0.25, dent: 0.1, facet: 0.6, crease: 0.4 }
let SHARED = null
function shared() {
  if (SHARED) return SHARED
  const rel = makeClayRelief({ size: 1024, seed: 11 })
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true
  const U = makeClayUniforms(THREE, tex); U.uClayPrint.value = tex // Fingerabdruck-Rückfall wie im K1-Katalog
  SHARED = { tex, U }; return SHARED
}
const pathOf = (o, root) => { const a = []; for (let n = o; n && n !== root; n = n.parent) a.push(n.name || ''); return a.join('/') }
const convertible = (m) => m && !m.isShaderMaterial && !m.userData?.clay && (m.isMeshStandardMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial) && !(m.transparent && (m.opacity == null || m.opacity < 0.98))

export function createClayLook({ targets = () => [], profile = 'figure' } = {}) {
  const root = new THREE.Group(); root.name = 'clay-look:' + profile
  const { U } = shared()
  const done = new Map() // Modul → [{ mesh, before, after }]
  return {
    object3d: root,
    uniforms: U,
    update() {
      for (const a of targets() || []) {
        const o3 = a?.object3d; if (!o3 || done.has(a) || a.status?.().shown === false || (a.status && a.status().status !== 'OK')) continue
        const cache = new Map(), list = []
        o3.traverse((o) => {
          if (!o.isMesh || SKIP.test(pathOf(o, o3))) return
          const pf = HEAD.test(o.name || '') ? FACE_PROFILE : profile, key = (m) => m.uuid + (pf === FACE_PROFILE ? '|face' : '')
          const conv = (m) => { if (!convertible(m)) return m; if (!cache.has(key(m))) cache.set(key(m), makeClayMaterial(THREE, U, { src: m, profile: pf })); return cache.get(key(m)) }
          const before = o.material, after = Array.isArray(before) ? before.map(conv) : conv(before)
          if (after !== before) { o.material = after; list.push({ mesh: o, before }) }
        })
        done.set(a, { list, made: [...cache.values()] })
      }
    },
    info: () => [...done.values()].map((d) => d.list.length),
    dispose() { for (const d of done.values()) { d.list.forEach(({ mesh, before }) => { mesh.material = before }); d.made.forEach((m) => m.dispose()) } done.clear(); root.clear() },
  }
}
