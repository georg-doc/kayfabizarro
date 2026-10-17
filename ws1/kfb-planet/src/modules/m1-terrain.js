// M1 · Offenes Knet-Gelände um das Amphitheater, Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose }.
// Material wie der Boden des Amphitheater-Moduls (V-230): makeClayFamily des Billboard-Spenders (billboard-clay.js 1:1), gleiche Parameter
// (uClayNear 30 · uClayFar 90 · uClayScale 1,4 · uClayAmt 0,45, oct 2, near, nicht „stick“), Farbe = Biom-Boden (BIOMES.top).
// Form (vorläufig, austauschbar bis zur Look-Referenz aus Claude Design, Briefing M1 letzter Abschnitt):
//   • flacher Platz um das Theater (r ≤ flatR) genau auf Bodenhöhe des Amphitheater-Moduls (−0,125 m, Bodenschluss zur Bodenplatte);
//   • sanfte Hügel bis r = hillR (Höhe aus deterministischem Wertrauschen, Saat fest), Steigung unter dem Steigungsgrenzwert des Controllers;
//   • Randwall ab hillR bis R (begrenzt die Welt, dort endet das Laufen); Weltgröße 2 × hillR ≥ 400 m (Briefing M1 Punkt 5).
// Kein Hex (V-194). Kein React: Kollision baut der Host aus colliderData() (Rapier-Trimesh in Weltkoordinaten).
import * as THREE from 'three'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { K } from '../m1/m1Scale.js'

// V-345: ganzes Gelände × K (gleiche Form in J17-Metern); Zahlen = alte WS1-Werte
export const GROUND_Y = -0.125 * K // = Boden des Amphitheater-Moduls (modules/amphitheater.js: (minY − floorY)·s + 0,11)
export const TERRAIN = Object.freeze({ flatR: 46 * K, blendR: 95 * K, hillR: 225 * K, R: 270 * K, hillAmp: 7 * K, rimH: 32 * K, noiseL: 55 * K, seg: 180, seed: 20261014 })
export const terrainLog = { create: 0, update: 0, dispose: 0, freed: null }

// deterministisches Wertrauschen (2D, glatt), Saat fest → gleiche Welt bei jedem Start (Replay-Tests)
function makeNoise(seed) {
  const P = new Uint8Array(512); let s = seed >>> 0
  const rnd = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const base = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [base[i], base[j]] = [base[j], base[i]] }
  for (let i = 0; i < 512; i++) P[i] = base[i & 255]
  const val = (i, j) => P[(P[i & 255] + j) & 511] / 255
  const sm = (t) => t * t * (3 - 2 * t)
  const n2 = (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = sm(x - i), fz = sm(z - j); const a = val(i, j), b = val(i + 1, j), c = val(i, j + 1), d = val(i + 1, j + 1); return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz }
  return (x, z) => (n2(x, z) * 0.6 + n2(x * 2.03 + 17.1, z * 2.03 - 9.4) * 0.3 + n2(x * 4.1 - 3.3, z * 4.1 + 5.7) * 0.1) * 2 - 1
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

export function terrainHeight(x, z, T = TERRAIN, noise = DEFAULT_NOISE) {
  const r = Math.hypot(x, z)
  const hills = noise(x / T.noiseL, z / T.noiseL) * T.hillAmp + T.hillAmp * 0.55
  const h = GROUND_Y + smooth(T.flatR, T.blendR, r) * hills
  return h + smooth(T.hillR, T.R, r) * T.rimH
}
const DEFAULT_NOISE = makeNoise(TERRAIN.seed)

// options: { biome (Farbe aus BIOMES), terrain?: Teilwerte von TERRAIN }
export function createTerrain(options = {}) {
  terrainLog.create++
  const T = { ...TERRAIN, ...(options.terrain || {}) }
  const noise = T.seed === TERRAIN.seed ? DEFAULT_NOISE : makeNoise(T.seed)
  const H = (x, z) => terrainHeight(x, z, T, noise)
  const root = new THREE.Group(); root.name = 'm1-terrain'
  const geo = new THREE.PlaneGeometry(T.R * 2, T.R * 2, T.seg, T.seg); geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i)))
  geo.computeVertexNormals()
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: 0.45 } }, { oct: 2, near: true, stick: false })
  const mat = fam.std(options.biome?.top || '#9aab62', 0.95)
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'm1-terrain-clay'; mesh.receiveShadow = true
  root.add(mesh)
  // Steigung (Grad) bis hillR, für die Prüfung „begehbar“ (Controller slopeMaxAngle)
  let maxSlope = 0
  for (let k = 0; k < 4000; k++) { const a = (k * 2.399963) % (Math.PI * 2), r = T.hillR * Math.sqrt((k + 0.5) / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r, e = 0.5
    const gx = (H(x + e, z) - H(x - e, z)) / (2 * e), gz = (H(x, z + e) - H(x, z - e)) / (2 * e); maxSlope = Math.max(maxSlope, Math.atan(Math.hypot(gx, gz)) * 180 / Math.PI) }
  const info = { diameterWalkable: T.hillR * 2, diameterTotal: T.R * 2, flatR: T.flatR, groundY: GROUND_Y, tris: T.seg * T.seg * 2, maxSlopeDeg: +maxSlope.toFixed(1) }
  return {
    object3d: root,
    height: H,
    info: () => info,
    // Rapier-Trimesh in Weltkoordinaten (das Gelände liegt im Ursprung, ohne Drehung/Skalierung)
    colliderData: () => ({ vertices: new Float32Array(pos.array), indices: new Uint32Array(geo.index.array) }),
    update() { terrainLog.update++ },
    dispose() { terrainLog.dispose++; geo.dispose(); mat.dispose(); terrainLog.freed = { geometries: 1, materials: 1 }; root.clear() },
  }
}
