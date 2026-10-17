// V-391 Regel 2 · Sichtbare Ablehnung statt stiller Ersatzfigur: An der Stelle der Figur steht ein rotes Schild „FIGURE REFUSED · <id> · <Grund>“.
// Modul nach Host-Vertrag R1.2 mit der Darsteller-Schnittstelle (say/lookAt/blinkNow tun nichts), damit Bühne und Dialog weiterlaufen.
// options: { id, reason, position = [0,0,0], yaw = 0, scale = 1 }
import * as THREE from 'three'

export function createRefusedFigure({ id = '?', reason = '', position = [0, 0, 0], yaw = 0, scale = 1 } = {}) {
  const root = new THREE.Group(); root.name = 'figure-refused:' + id; root.position.fromArray(position); root.rotation.y = yaw
  const c = document.createElement('canvas'); c.width = 1024; c.height = 384; const g = c.getContext('2d')
  g.fillStyle = '#b3121b'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = '#fff'; g.lineWidth = 14; g.strokeRect(14, 14, c.width - 28, c.height - 28)
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '700 84px system-ui, sans-serif'; g.fillText('FIGURE REFUSED', c.width / 2, 140)
  g.font = '600 52px system-ui, sans-serif'; g.fillText(id, c.width / 2, 225); g.font = '400 38px system-ui, sans-serif'; g.fillText(String(reason).slice(0, 52), c.width / 2, 300)
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6 * scale, 0.6 * scale), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })); sign.position.y = 1.1 * scale; sign.name = 'refused-sign'; root.add(sign)
  return {
    object3d: root, bubbleAnchors: [], faceDriver: 'NONE', refused: true,
    update() {}, say: () => null, lookAt() {}, blinkNow() {},
    status: () => ({ status: 'REFUSED', shown: true, reason, actor: id }),
    report: () => ({ refused: true, id, reason }),
    dispose() { tex.dispose(); sign.geometry.dispose(); sign.material.dispose(); root.clear() },
  }
}
