// Weltdaten und Geometrie-Helfer: Planeten, Gelände, Platzierung auf der Oberfläche
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const rng = mulberry32

export const PLANETS = [
  {
    id: 'home', name: 'Heimatplanet', center: new THREE.Vector3(0, 0, 0), r: 14, amp: 0.9, seed: 7,
    colors: { low: '#6fb6c9', mid: '#9ccf6a', high: '#5f9a4a', top: '#d8c79a' },
  },
  {
    id: 'prison', name: 'Gefängnisplanet', center: new THREE.Vector3(52, 14, -26), r: 12, amp: 0.5, seed: 21,
    colors: { low: '#6d6585', mid: '#9a8fa8', high: '#7c6f8f', top: '#c9b6a0' },
    flatCap: { dir: new THREE.Vector3(0, 1, 0), angle: 1.35 }, // ebene Kappe für das Labyrinth
  },
]

const noises = new Map()
function noiseFor(p) {
  if (!noises.has(p.id)) noises.set(p.id, createNoise3D(mulberry32(p.seed)))
  return noises.get(p.id)
}

// Geländehöhe (Abstand vom Zentrum) für eine Richtung (normiert)
export function surfaceR(p, dir) {
  const n = noiseFor(p)
  let h = n(dir.x * 1.6, dir.y * 1.6, dir.z * 1.6) * 0.7 + n(dir.x * 4, dir.y * 4, dir.z * 4) * 0.3
  h = h * p.amp
  if (p.flatCap) {
    const ang = dir.angleTo(p.flatCap.dir)
    const k = THREE.MathUtils.smoothstep(ang, p.flatCap.angle * 0.85, p.flatCap.angle * 1.15)
    h *= k
  }
  return p.r + h
}

export function buildPlanetGeometry(p, detail = 48) {
  let g = new THREE.IcosahedronGeometry(1, detail)
  g.deleteAttribute('normal'); g.deleteAttribute('uv')
  g = mergeVertices(g)
  const pos = g.attributes.position
  const col = new Float32Array(pos.count * 3)
  const d = new THREE.Vector3(), c = new THREE.Color()
  const C = Object.fromEntries(Object.entries(p.colors).map(([k, v]) => [k, new THREE.Color(v)]))
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize()
    const R = surfaceR(p, d)
    pos.setXYZ(i, d.x * R, d.y * R, d.z * R)
    const t = (R - p.r) / Math.max(p.amp, 0.01) // ~ -1..1
    if (t < -0.35) c.copy(C.low)
    else if (t < 0.25) c.copy(C.mid).lerp(C.high, (t + 0.35) / 0.6)
    else c.copy(C.high).lerp(C.top, Math.min(1, (t - 0.25) / 0.5))
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.computeVertexNormals()
  return g
}

const UP = new THREE.Vector3(0, 1, 0)
// Position + Rotation für ein Objekt, das aufrecht auf der Oberfläche steht
export function placeOnSurface(p, dir, yaw = 0, lift = 0) {
  const d = dir.clone().normalize()
  const pos = p.center.clone().addScaledVector(d, surfaceR(p, d) + lift)
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d)
  q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, yaw))
  return { position: pos, quaternion: q }
}

export function nearestPlanet(pos) {
  let best = PLANETS[0], bestD = Infinity
  for (const p of PLANETS) {
    const dd = pos.distanceTo(p.center) - p.r
    if (dd < bestD) { bestD = dd; best = p }
  }
  return { planet: best, altitude: bestD }
}

export const planetById = (id) => PLANETS.find((p) => p.id === id)

// Labyrinth auf der ebenen Kappe des Gefängnisplaneten (Recursive Backtracker)
export function generateMaze(p, n = 7, cell = 3.2, seed = Date.now()) {
  const rand = mulberry32(seed)
  const vis = Array.from({ length: n }, () => Array(n).fill(false))
  // Wände: h[y][x] = horizontale Wand oberhalb Zelle (x,y); v[y][x] = vertikale Wand links von Zelle
  const h = Array.from({ length: n + 1 }, () => Array(n).fill(true))
  const v = Array.from({ length: n }, () => Array(n + 1).fill(true))
  const stack = [[0, 0]]; vis[0][0] = true
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => [x + dx, y + dy, dx, dy])
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < n && ny < n && !vis[ny][nx])
    if (!nb.length) { stack.pop(); continue }
    const [nx, ny, dx, dy] = nb[Math.floor(rand() * nb.length)]
    if (dx === 1) v[y][x + 1] = false
    if (dx === -1) v[y][x] = false
    if (dy === 1) h[y + 1][x] = false
    if (dy === -1) h[y][x] = false
    vis[ny][nx] = true; stack.push([nx, ny])
  }
  h[0][Math.floor(n / 2)] = false // Eingang
  h[n][Math.floor(n / 2)] = false // Ausgang
  const half = (n * cell) / 2
  const segs = []
  for (let y = 0; y <= n; y++) for (let x = 0; x < n; x++) if (h[y][x]) segs.push({ x: -half + (x + 0.5) * cell, z: -half + y * cell, yaw: 0 })
  for (let y = 0; y < n; y++) for (let x = 0; x <= n; x++) if (v[y][x]) segs.push({ x: -half + x * cell, z: -half + (y + 0.5) * cell, yaw: Math.PI / 2 })
  // Ebene (x,z) -> Kugel: azimutal-äquidistant um die Kappenmitte
  const pole = p.flatCap.dir
  return segs.map((s, i) => {
    const dist = Math.hypot(s.x, s.z)
    const ang = dist / p.r
    const tang = new THREE.Vector3(s.x, 0, s.z)
    let dir = pole.clone()
    if (dist > 1e-4) {
      const axis = new THREE.Vector3().crossVectors(pole, tang).normalize()
      dir.applyAxisAngle(axis, ang)
    }
    const yawAdj = s.yaw
    return {
      id: `maze-${seed}-${i}`, kind: 'wall', planet: p.id, tag: 'maze',
      dir: dir.toArray(), yaw: yawAdj, size: [cell + 0.4, 2.4, 0.5],
    }
  })
}

// Gemeinsamer, veränderlicher Spielerzustand (ohne React-Render)
export const playerState = { pos: new THREE.Vector3() }

// Bühne auf dem Heimatplaneten (Ort des Kayfabulierens)
export const STAGE_DIR = new THREE.Vector3(0.0, 1, 0.42).normalize()
export function stagePosition() {
  const p = PLANETS[0]
  return p.center.clone().addScaledVector(STAGE_DIR, surfaceR(p, STAGE_DIR))
}
