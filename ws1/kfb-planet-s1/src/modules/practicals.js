// L1 (V-329) · Lokale Lichtquellen einer Bühne (practicals[] im Bühnen-Deskriptor, Format WS1_STATUS §43.4) als Modul nach Host-Vertrag R1.2.
// Fester Pool von POOL PointLights ohne Schatten: three.js kompiliert alle Materialien neu, wenn sich die Zahl der Lichter ändert, deshalb werden
// Lichter nie hinzugefügt oder entfernt, nur Position, Farbe und Stärke geschaltet; aktiv sind die zur Kamera nächstgelegenen. Meshy-GLBs haben eine
// gemalte Textur, einzelne Lampen lassen sich nicht emissiv schalten: jedes practical bekommt einen additiven Leuchthof (halo) an seiner Stelle.
// Stärke folgt weight() (Licht-Schreiber: nachts 1, tags fast 0), dazu optional Flackern.
// Figuren-Licht (L2 Schritt 1: „the talking actor may borrow one pooled light“, hier für L1-G1 nachts beide Figuren): je Figur ein Pool-Licht schräg
// vor ihr Richtung Kamera (1,2 m) und über Kopfhöhe (2,1 m), warm, Stärke × weight; die übrigen Pool-Lichter gehen an die nächstgelegenen practicals.
// options: { practicals: [{ id, type, pos: [x,y,z] in Metern (Bühne), color, intensity, range, flicker?, halo? }], weight: () => 0..1, pool = 6,
//            actors: () => [Modul mit object3d], actorLight = { color: '#ffd9a8', intensity: 4, range: 4.5 }, actorOffset = [vor der Figur, über dem Boden] m }
import * as THREE from 'three'

export const POOL = 6
const TYPE = { lantern: { i: 6, flicker: { amp: 0.08, hz: 5 }, halo: 0.3 }, neon: { i: 5, flicker: null, halo: 0.45 }, crystal: { i: 7, flicker: { amp: 0.05, hz: 1.2 }, halo: 0.5 },
  torch: { i: 8, flicker: { amp: 0.2, hz: 7 }, halo: 0.4 }, monitor: { i: 4, flicker: { amp: 0.03, hz: 9 }, halo: 0.35 } }
let HALO = null
const haloTex = () => { if (HALO) return HALO; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,0.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); HALO = new THREE.CanvasTexture(c); return HALO }

export function createPracticals({ practicals = [], weight = () => 1, pool = POOL, actors = () => [], actorLight = { color: '#ffd9a8', intensity: 4, range: 4.5 }, actorOffset = [1.2, 2.1] } = {}) {
  const root = new THREE.Group(); root.name = 'practicals'
  const items = practicals.map((p, i) => {
    const T = TYPE[p.type] || TYPE.lantern, color = new THREE.Color(p.color || '#ffc15a')
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
    const size = (p.halo?.size ?? T.halo); halo.scale.set(size, size, 1); halo.position.fromArray(p.pos); halo.name = 'halo:' + (p.id || i); root.add(halo)
    return { p, color, base: (p.intensity ?? 1) * T.i, range: p.range ?? 4, flicker: p.flicker === undefined ? T.flicker : p.flicker, phase: i * 1.7, halo }
  })
  const lights = Array.from({ length: pool }, (_, i) => { const L = new THREE.PointLight('#ffffff', 0, 4, 2); L.castShadow = false; L.name = 'pool:' + i; root.add(L); return L })
  const state = { t: 0, active: [] }
  const camPos = new THREE.Vector3(), aPos = new THREE.Vector3(), toCam = new THREE.Vector3(), aColor = new THREE.Color(actorLight.color)
  return {
    object3d: root,
    update(dt, ctx) {
      state.t += dt || 0; const w = Math.max(0, Math.min(1, weight()))
      if (ctx?.camera) ctx.camera.getWorldPosition(camPos)
      const f = (it) => (it.flicker ? 1 + it.flicker.amp * Math.sin(state.t * Math.PI * 2 * it.flicker.hz + it.phase) : 1)
      items.forEach((it) => { it.halo.material.opacity = Math.min(1, 0.25 + 0.75 * w) * f(it) })
      const acts = w > 0.01 ? (actors() || []).filter((a) => a?.object3d && a.status?.().shown !== false).slice(0, pool) : []
      acts.forEach((a, i) => { const L = lights[i]; a.object3d.getWorldPosition(aPos); toCam.copy(camPos).sub(aPos).setY(0).normalize()
        L.position.copy(aPos).addScaledVector(toCam, actorOffset[0]).setY(aPos.y + actorOffset[1]); L.color.copy(aColor); L.distance = actorLight.range; L.intensity = actorLight.intensity * w })
      const near = items.map((it) => ({ it, d: camPos.distanceToSquared(it.halo.position) })).sort((a, b) => a.d - b.d).slice(0, pool - acts.length)
      lights.forEach((L, i) => { if (i < acts.length) return; const n = near[i - acts.length]; if (!n) { L.intensity = 0; return }
        L.position.copy(n.it.halo.position); L.color.copy(n.it.color); L.distance = n.it.range; L.intensity = n.it.base * w * f(n.it) })
      state.active = near.map((n) => n.it.p.id); state.actors = acts.length
    },
    info: () => ({ practicals: items.length, pool: lights.length, active: state.active.slice(), actors: state.actors || 0, lit: lights.filter((L) => L.intensity > 0).length }),
    dispose() { items.forEach((it) => it.halo.material.dispose()); lights.forEach((L) => L.dispose?.()); root.clear() }, // Hof-Textur geteilt
  }
}
