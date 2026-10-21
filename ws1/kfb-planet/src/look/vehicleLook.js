// Fahrzeug-Look A „Lack“ (Georg 21.10.) · Werte 1:1 aus der Gelände-Probe (carLookPrep / carLookApply / carDistLift, probe @ws1/preview 677a844).
// Warum: Meshy legt Metall je Racer zwischen 45 und 98 % der Fläche an, die Grundhelligkeit reicht von 0,22 bis 0,46. Ohne Spiegelumgebung wird
// Metall fast schwarz – je mehr Metall, desto dunkler und fremder wirkt das Modell, aus der Ferne nur noch ein schwarzer Fleck.
// A: Metall × 0,35 (helle Blechflächen behalten bis + 0,65 → Dächer gedimmt statt weiß), Rauheit ≥ 0,5, Spiegelung eines Himmel/Boden-Verlaufs,
// Grundhelligkeit auf 0,33 angeglichen (× 0,85 … 1,5); Umgebungslicht wächst mit dem Kameraabstand (0,8 ab 20 m → 1,6 ab 120 m Probe-Maß, × K im Spiel) in der Lackfarbe.
// applyVehicleLook(root) einmal auf das geladene Modell (vor dem Klonen: Klone teilen die Materialien). Ohne DOM (Node-Tests) passiert nichts.
import * as THREE from 'three'
import { K } from '../m1/m1Scale.js'

export const VEHICLE_LOOK = { metal: 0.35, keep: 0.65, keepFrom: 0.42, keepSpan: 0.3, rough: 0.5, lum: 0.33, gainMin: 0.85, gainMax: 1.5, env: 0.8, envFar: 1.6, near: 20 * K, far: 120 * K,   /* Abstände wie in der Probe, auf die Spielwelt umgerechnet (K) */ sky: '#cfe6ef', ground: '#8a7a62' }
const L = VEHICLE_LOOK
let ENV = null

// Himmel/Boden-Verlauf als Spiegelumgebung (wie die Hemisphäre der Probe): oben Himmel, Horizont aufgehellt, unten Boden
function envFor(renderer) {
  if (ENV) return ENV
  const W = 64, H = 32, d = new Uint8Array(W * H * 4), top = new THREE.Color(L.sky), hor = top.clone().lerp(new THREE.Color('#ffffff'), 0.35), bot = new THREE.Color(L.ground)
  for (let y = 0; y < H; y++) {
    const v = 1 - (y + 0.5) / H, c = v > 0.5 ? hor.clone().lerp(top, (v - 0.5) * 2) : bot.clone().lerp(hor, Math.pow(v * 2, 3))
    for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; d[k] = c.r * 255; d[k + 1] = c.g * 255; d[k + 2] = c.b * 255; d[k + 3] = 255 }
  }
  const t = new THREE.DataTexture(d, W, H); t.mapping = THREE.EquirectangularReflectionMapping; t.flipY = true; t.needsUpdate = true
  const pm = new THREE.PMREMGenerator(renderer); ENV = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); return ENV
}

function pixels(img, W, H) { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H); return { c, x, id: x.getImageData(0, 0, W, H) } }

export function applyVehicleLook(root) {
  if (typeof document === 'undefined' || !root) return { applied: 0 }
  const info = { applied: 0, gain: {} }, mats = new Set(), pos = new THREE.Vector3()
  root.traverse((m) => { if (m.isMesh) for (const mt of [].concat(m.material)) mats.add(mt) })
  for (const mt of mats) {
    const mp = mt.map, mr = mt.metalnessMap || mt.roughnessMap
    if (!mp?.image || !mr?.image || mt.userData.vehicleLook) continue
    try {
      const sm = pixels(mp.image, 64, 64).id.data; let s = 0, n = 0
      for (let i = 0; i < sm.length; i += 4) { if (sm[i + 3] < 10) continue; s += (sm[i] + sm[i + 1] + sm[i + 2]) / 765; n++ }
      const gain = Math.min(L.gainMax, Math.max(L.gainMin, L.lum / Math.max(0.05, n ? s / n : L.lum)))
      const img = mr.image, W = Math.min(1024, img.width), H = Math.round(img.height * W / img.width), al = pixels(mp.image, W, H).id.data, { c, x, id } = pixels(img, W, H), d = id.data
      for (let i = 0; i < d.length; i += 4) {
        const lu = (al[i] + al[i + 1] + al[i + 2]) / 765, t = Math.min(1, Math.max(0, (lu - L.keepFrom) / L.keepSpan))
        d[i + 1] = Math.max(d[i + 1], L.rough * 255); d[i + 2] = d[i + 2] * (L.metal + L.keep * t * t * (3 - 2 * t))
      }
      x.putImageData(id, 0, 0)
      const tex = new THREE.CanvasTexture(c); tex.flipY = mr.flipY; tex.wrapS = mr.wrapS; tex.wrapT = mr.wrapT; tex.channel = mr.channel
      mt.metalnessMap = mt.roughnessMap = tex; mt.color.setScalar(gain); mt.envMapIntensity = L.env; mt.userData.vehicleLook = { gain: +gain.toFixed(3), tex }
      mt.needsUpdate = true; info.gain[mt.name || 'mat' + info.applied] = +gain.toFixed(3); info.applied++
    } catch (e) { console.warn('vehicleLook', e) }
  }
  // Spiegelumgebung braucht den Renderer, Abstandslicht die Kamera: beides beim Zeichnen (gilt auch für Klone, sie teilen die Materialien)
  root.traverse((m) => {
    if (!m.isMesh) return
    const prev = m.onBeforeRender
    m.onBeforeRender = function (renderer, scene, camera, geo, mat, group) {
      for (const mt of [].concat(m.material)) {
        if (!mt.userData.vehicleLook) continue
        if (mt.envMap !== ENV || !ENV) { mt.envMap = envFor(renderer); mt.needsUpdate = true }
        const k = Math.min(1, Math.max(0, (m.getWorldPosition(pos).distanceTo(camera.position) - L.near) / (L.far - L.near)))
        mt.envMapIntensity = L.env + (L.envFar - L.env) * k * k * (3 - 2 * k)
      }
      if (prev) prev.call(this, renderer, scene, camera, geo, mat, group)
    }
  })
  return info
}
