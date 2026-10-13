import * as THREE from 'three'
// Prüfmodul für den Host-Vertrag: zählt Aufrufe, räumt GPU-Ressourcen auf.
export const probeLog = { create: 0, update: 0, dispose: 0, lastCtx: null }
export function createProbe({ color = '#e0475b', pos = [0, 6, 0] } = {}) {
  probeLog.create++
  const geo = new THREE.BoxGeometry(1, 1, 1), mat = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geo, mat); mesh.position.fromArray(pos)
  return {
    object3d: mesh,
    update(dt, ctx) { probeLog.update++; probeLog.lastCtx = { hasCam: !!ctx.camera, hasPlayer: !!ctx.player, hasGame: !!ctx.game }; mesh.rotation.y += dt },
    dispose() { probeLog.dispose++; geo.dispose(); mat.dispose() },
  }
}
if (typeof window !== 'undefined') window.__kfbProbeLog = probeLog
