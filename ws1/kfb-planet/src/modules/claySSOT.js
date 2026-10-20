// V-429 · Knete nur noch über das zentrale Modul kfb-clay.v1.1 (WS0 CLAY_SSOT_R1, byte-gleich in vendor/clay/): drei feste Profile (character, midground,
// background), Maßstab relativ zum Objekt (nicht UV-abhängig), fester Seed aus der Figurenkarte (clayOptionsFromCard), keine eigenen Knet-Werte in WS1.
// Wirt-Modul nach Host-Vertrag R1.2: wartet je Ziel, bis das Modul steht (status OK und sichtbar), wendet applyClay einmal an und nimmt es beim Abbau zurück.
// options: { targets: () => [{ module, profile?, seed?, scaleRef?, card?, skip? }] }  (skip: RegExp/Funktion wie applyClay, Standard SKIP_DEFAULT)  (card → Profil/Seed aus der Karte; sonst profile + seed)
import * as THREE from 'three'
import { applyClay, removeClay, clayOptionsFromCard, VERSION } from '../vendor/clay/kfb-clay.v1.1.js'

export function createClaySSOT({ targets = () => [] } = {}) {
  const root = new THREE.Group(); root.name = 'clay-ssot'
  const done = new Map() // Modul → { handle, target }
  return {
    object3d: root,
    update() {
      for (const t of targets() || []) {
        const a = t?.module, o3 = a?.object3d; if (!o3 || done.has(a)) continue
        const st = a.status?.(); if (st && (st.status !== 'OK' || st.shown === false)) continue
        const base = t.card ? clayOptionsFromCard(t.card) : { profile: t.profile || 'character', seed: t.seed ?? o3.name ?? 'kfb', scaleRef: 'object' }
        const handle = applyClay(o3, THREE, { ...base, ...(t.scaleRef ? { scaleRef: t.scaleRef } : {}), ...(t.skip ? { skip: t.skip } : {}) })
        done.set(a, { handle, target: o3 })
      }
    },
    info: () => [...done.values()].map((d) => d.handle.info()),
    version: VERSION,
    dispose() { for (const { target } of done.values()) removeClay(target); done.clear(); root.clear() },
  }
}
