// V-346 Punkt 3 · Tonemapping geteilt: ACES bleibt global (Licht und Figuren wirken damit besser), der Boden bzw. die Bühne sieht aus wie „ohne“
// (Georg am Bildpaar). Dafür setzt dieses Modul toneMapped = false auf allen Materialien der Ziele, sobald sie geladen sind; dispose stellt sie wieder her.
// Ziele: Amphitheater bzw. Meshy-Bühne, in der Aufstellung nur die Bodenfläche. Figuren, Fahrzeuge, Himmel und Karte bleiben, wie sie sind
// (die Kartenfläche ist ohnehin toneMapped: false, G3). Modul nach Host-Vertrag R1.2.
// options: { targets: () => [{ object3d, ready: () => bool }] }
import * as THREE from 'three'

export function createToneSplit({ targets = () => [] } = {}) {
  const root = new THREE.Group(); root.name = 'tone-split'
  const done = new Set(), changed = new Map() // Ziel-Objekt; Material → vorheriger Wert
  return {
    object3d: root,
    update() {
      for (const t of targets() || []) {
        const o3 = t?.object3d; if (!o3 || done.has(o3) || (t.ready && !t.ready())) continue
        o3.traverse((o) => { if (!o.isMesh) return; [].concat(o.material).forEach((m) => { if (m && m.toneMapped !== false && !changed.has(m)) { changed.set(m, m.toneMapped); m.toneMapped = false; m.needsUpdate = true } }) })
        done.add(o3)
      }
    },
    info: () => ({ targets: done.size, materials: changed.size }),
    dispose() { changed.forEach((v, m) => { m.toneMapped = v; m.needsUpdate = true }); changed.clear(); done.clear() },
  }
}
