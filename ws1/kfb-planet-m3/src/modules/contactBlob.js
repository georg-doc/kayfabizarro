// V-203 · Weicher Knet-Kontaktfleck am Boden (1:1 aus dem Lab, donors/contact-blob.ts: car-hop-Blob, radialer Canvas-Verlauf, #2a211d, Deckkraft 0,62,
// Polygon-Versatz −4, ohne Tiefenschreiben, Render-Reihenfolge 2). Liegt flach in der eigenen XZ-Ebene. Hier nur nach JavaScript übertragen.
import * as THREE from 'three'

let TEX = null
const tex = () => { if (TEX) return TEX; const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.55, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); TEX = new THREE.CanvasTexture(c); return TEX }
const GEO = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
export function contactBlob(sx, sz = sx, opacity = 0.62) {
  const m = new THREE.Mesh(GEO, new THREE.MeshBasicMaterial({ map: tex(), color: '#2a211d', transparent: true, depthWrite: false, opacity, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }))
  m.scale.set(sx, 1, sz); m.renderOrder = 2; m.name = 'contact-blob'; m.castShadow = m.receiveShadow = false; m.userData.op0 = opacity; return m
}

// Modul nach Host-Vertrag R1.2: je Figur ein Kontaktfleck, der ihr am Boden folgt (L1: Kontaktschatten für alle Figuren, auch nachts).
// options: { targets: () => [Modul mit object3d und status()] , size = 0.95, opacity = 0.55 }
export function createContactBlobs({ targets = () => [], size = 0.95, opacity = 0.55 } = {}) {
  const root = new THREE.Group(); root.name = 'contact-blobs'
  const blobs = []
  const p = new THREE.Vector3()
  return {
    object3d: root,
    update() {
      const ts = targets() || []
      while (blobs.length < ts.length) { const b = contactBlob(size, size, opacity); blobs.push(b); root.add(b) }
      blobs.forEach((b, i) => { const a = ts[i], o = a?.object3d; if (!o || a.status?.().shown === false) { b.visible = false; return }
        o.getWorldPosition(p); b.position.set(p.x, p.y + 0.012, p.z); b.visible = true })
    },
    count: () => blobs.filter((b) => b.visible).length,
    dispose() { blobs.forEach((b) => b.material.dispose()); root.clear() }, // Geometrie und Textur sind geteilt (Lab-Spender)
  }
}
