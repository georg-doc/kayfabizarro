// Szenen-Adapter: Schwerkraft, „oben“, Start, Bühne und Ortsname je Welt (Hex-Insel oder Kleinplaneten)
import * as THREE from 'three'
import { PLANETS, nearestPlanet, surfaceR, STAGE_DIR, placeOnSurface } from './world'
import { buildTower, SPAWN, STAGE_POS, groundHeight } from './hex'

export const SCENE = typeof location !== 'undefined' && location.hash.includes('planets') ? 'planets' : 'hex'
export const G = 14
const INFLUENCE = 28
const FOOT = 1.0
export const TOWER = SCENE === 'hex' ? buildTower() : null

const planets = {
  gravity(pos, out) {
    const { planet, altitude } = nearestPlanet(pos)
    if (altitude > INFLUENCE) return out.set(0, 0, 0)
    return out.subVectors(planet.center, pos).normalize().multiplyScalar(G)
  },
  up(pos, out) { const { planet } = nearestPlanet(pos); return out.subVectors(pos, planet.center).normalize() },
  name(pos) { const { planet, altitude } = nearestPlanet(pos); return altitude > INFLUENCE ? 'Weltraum' : planet.name },
  start() { const p = PLANETS[0]; const d = new THREE.Vector3(0.12, 1, -0.05).normalize(); return p.center.clone().addScaledVector(d, surfaceR(p, d) + FOOT + 0.6) },
  stage() { return placeOnSurface(PLANETS[0], STAGE_DIR, 0, -0.05) },
}

const hex = {
  gravity(pos, out) { return out.set(0, -G, 0) },
  up(pos, out) { return out.set(0, 1, 0) },
  name(pos) {
    const t = TOWER, dx = pos.x - t.base.x, dz = pos.z - t.base.z
    if (Math.hypot(dx, dz) < t.radius + 6) return pos.y > t.base.y + 2 ? `Deck-Turm · ${t.deck.title}` : 'Am Deck-Turm'
    return 'Hex-Insel'
  },
  start() { return new THREE.Vector3(SPAWN.x + 2, SPAWN.y + FOOT + 0.6, SPAWN.z + 2) },
  stage() { return { position: STAGE_POS.clone().setY(groundHeight(STAGE_POS.x, STAGE_POS.z)), quaternion: new THREE.Quaternion() } },
}

export const adapter = SCENE === 'planets' ? planets : hex
