// L2 Schritt 2 (V-340) · Ein Knet-Look für KayKit-Figuren und Meshy-Fahrzeuge: Materialien werden auf K1/H0-Golden clay-material.v8 umgestellt
// (Profil `figure` bzw. `vehicle`, clay-profiles.v2; Wahl und Herkunft in vendor/clay/SOURCE.md). Nur Material, keine Netzänderung (V-336, SSOT „Characters“).
// Ausgenommen: Gesicht und Augen (Augen-Rig, Lider, Mund, Brauen; eigener Besitzer), Shader-Materialien, durchsichtige Teile. Die Farbtextur der
// Quelle bleibt erhalten (src-Material), daher bleiben Meshy- und KayKit-Texturen erkennbar. Modul nach Host-Vertrag R1.2; dispose stellt die
// Original-Materialien wieder her.
// V-346 · Abstimmung je Ziel (tune): sheen = Samtschicht des Knets (Profil-Rolle soft: 0,18; sie legt einen hellen, staubigen Schleier auf satte Texturen),
// colorK = Faktor auf die Grundfarbe (Belichtung des Knets je Figur). Fahrzeuge: sheen 0 und Farbe unverändert, Knet nur als Relief/Rauheit
// (Georg: Texturfarben nicht auswaschen, Sättigung ≥ 95 % der Meshy-Textur). GothGirl: Belichtung zurück (Georg: „überstrahlt“).
// options: { targets: () => [Modul mit object3d | { module, tune: { sheen?, colorK? } }], profile = 'figure', tune = {} }
import * as THREE from 'three'
import { makeClayRelief } from '../vendor/clay/clay-relief.v2.js'
import { makeClayUniforms, makeClayMaterial, PROFILES } from '../vendor/clay/clay-material.v8.js'

const SKIP = /eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash|brow|nose|moust|beard|kfb-lid|clay-lid|eyerig|faceHost|face-host|decal/i // wie contact-ao v1, dazu Nase/Bart (Gesichtsteile)
// Kopf: sanftes Profil, damit Gesichter gleichmäßig und lesbar bleiben (L2 G1/G7); WS1-Vorschlag auf Basis von `figure` (weniger Striche, Abdrücke, Dellen)
const HEAD = /(^|_)head$/i
const FACE_PROFILE = { ...PROFILES.figure, stroke: 0.35, print: 0.25, dent: 0.1, facet: 0.6, crease: 0.4 }
// Knete-Look R2 (V-400, WS0): mehr Dellen-Varianz, weniger Ölglanz, Mindest-Rauheit ≈ 0,6, Samt ≤ 0,05 (Samt kommt über tune). Über Profil und gemeinsame
// Regler gelöst, die Spender-Datei clay-material.v8 bleibt byte-gleich; der Shader klemmt Rauheit erst bei 0,3, deshalb heben wir die Basis-Rauheit an.
const KNETE_R2 = { oil: 0.08, dent: { figure: 0.55, vehicle: 0.5 }, minRough: 0.95 }
const profileR2 = (pf) => (typeof pf === 'string' && KNETE_R2.dent[pf] != null ? { ...PROFILES[pf], dent: KNETE_R2.dent[pf] } : pf)
let SHARED = null
function shared() {
  if (SHARED) return SHARED
  const rel = makeClayRelief({ size: 1024, seed: 11 })
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true
  const U = makeClayUniforms(THREE, tex); U.uClayPrint.value = tex // Fingerabdruck-Rückfall wie im K1-Katalog
  U.uClayOil.value = KNETE_R2.oil // Knete R2: weniger Ölglanz (Spender 0,22)
  SHARED = { tex, U }; return SHARED
}
const pathOf = (o, root) => { const a = []; for (let n = o; n && n !== root; n = n.parent) a.push(n.name || ''); return a.join('/') }
const convertible = (m) => m && !m.isShaderMaterial && !m.userData?.clay && (m.isMeshStandardMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial) && !(m.transparent && (m.opacity == null || m.opacity < 0.98))

// Ein einzelnes Material auf Knete (Knete-Look R2) umstellen, mit denselben gemeinsamen Reglern wie die Figuren (Look-Slice: Amphitheater als Knete).
// Die Farbtextur der Quelle bleibt; der Aufrufer darf weitere onBeforeCompile-Haken anhängen (sie müssen den vorhandenen zuerst aufrufen).
export function clayFrom(src, profile = 'house') {
  const { U } = shared(), c = makeClayMaterial(THREE, U, { src, profile: profileR2(profile) }); c.roughness = Math.max(c.roughness, KNETE_R2.minRough); c.sheen = 0
  if (typeof profile === 'string') c.userData.clay.profile = profile; return c
}

export function createClayLook({ targets = () => [], profile = 'figure', tune = {} } = {}) {
  const root = new THREE.Group(); root.name = 'clay-look:' + profile
  const { U } = shared()
  const done = new Map() // Modul → [{ mesh, before, after }]
  return {
    object3d: root,
    uniforms: U,
    update() {
      for (const t of targets() || []) {
        const a = t?.module || t, T = { ...tune, ...(t?.module ? t.tune : null) }
        const o3 = a?.object3d; if (!o3 || done.has(a) || a.status?.().shown === false || (a.status && a.status().status !== 'OK')) continue
        const cache = new Map(), list = []
        o3.traverse((o) => {
          if (!o.isMesh || SKIP.test(pathOf(o, o3))) return
          const pf = HEAD.test(o.name || '') ? FACE_PROFILE : profileR2(profile), key = (m) => m.uuid + (pf === FACE_PROFILE ? '|face' : '')
          const conv = (m) => { if (!convertible(m)) return m; if (!cache.has(key(m))) { const c = makeClayMaterial(THREE, U, { src: m, profile: pf }); c.roughness = Math.max(c.roughness, KNETE_R2.minRough); if (typeof profile === 'string' && pf !== FACE_PROFILE) c.userData.clay.profile = profile; if (T.sheen != null) c.sheen = T.sheen; if (T.colorK != null) c.color.multiplyScalar(T.colorK); c.userData.clay.tune = T; cache.set(key(m), c) } return cache.get(key(m)) }
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
