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
import { applyTerrain2, terrain2Berm, TERRAIN2_CFG } from '../look/terrain2.js'
import { applyTerrain3 } from '../look/terrain3.js'
import { applyInkPatches } from '../look/inkPatch.js'

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
  const T2 = options.look === 'terrain2', T3 = options.look === 'terrain3'
  const H = T2 ? (x, z) => terrainHeight(x, z, T, noise) + terrain2Berm(x, z) : (x, z) => terrainHeight(x, z, T, noise) // #439: Erdwall um den Bühnenfuß nur in der Variante
  const root = new THREE.Group(); root.name = 'm1-terrain'
  const geo = new THREE.PlaneGeometry(T.R * 2, T.R * 2, T.seg, T.seg); geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i)))
  geo.computeVertexNormals()
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: T2 ? TERRAIN2_CFG.clayAmt : T3 ? 0.25 : 0.45 } }, { oct: 2, near: true, stick: false }) // #439: Knete ruhiger (keine Flecken über den Farbflächen)
  const mat = fam.std(options.biome?.top || '#9aab62', 0.95)
  const t2 = T2 ? applyTerrain2(mat, { world: options.world, ring: options.ring }) : null // #439: Farbflächen + Palettenschatten (Variante, Standard unverändert)
  const t3 = T3 ? applyTerrain3(mat, { palette: options.palette, hMin: GROUND_Y, hMax: GROUND_Y + T.hillAmp * 1.6 }) : null // #439 terrain3: Fließfarben der Gelände-Probe + Palettenschatten
  const ink = applyInkPatches(mat) // WS-NPC Phase C (V-583): Tusche-Flecken, erst ab dem ersten Patch im Shader (ohne Patch byte-gleich)
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'm1-terrain-clay'; mesh.receiveShadow = true
  root.add(mesh)
  // Steigung (Grad) bis hillR, für die Prüfung „begehbar“ (Controller slopeMaxAngle)
  let maxSlope = 0
  for (let k = 0; k < 4000; k++) { const a = (k * 2.399963) % (Math.PI * 2), r = T.hillR * Math.sqrt((k + 0.5) / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r, e = 0.5
    const gx = (H(x + e, z) - H(x - e, z)) / (2 * e), gz = (H(x, z + e) - H(x, z - e)) / (2 * e); maxSlope = Math.max(maxSlope, Math.atan(Math.hypot(gx, gz)) * 180 / Math.PI) }
  const info = { look: t2 ? 'terrain2' : 'standard', palette: t2?.palette || null, diameterWalkable: T.hillR * 2, diameterTotal: T.R * 2, flatR: T.flatR, groundY: GROUND_Y, tris: T.seg * T.seg * 2, maxSlopeDeg: +maxSlope.toFixed(1) }
  return {
    object3d: root,
    height: H,
    // C3: Höhe der tatsächlich gerenderten Dreiecke (PlaneGeometry-Raster, Teilung a-b-d / b-c-d) statt der glatten Funktion H, damit liegende
    // Kügelchen exakt auf der sichtbaren Fläche sitzen (Einsinken 0 gegen das Netz, nicht gegen H)
    surfaceAt: (x, z) => { const c = (2 * T.R) / T.seg, u0 = (x + T.R) / c, v0 = (z + T.R) / c, ix = Math.min(T.seg - 1, Math.max(0, Math.floor(u0))), iz = Math.min(T.seg - 1, Math.max(0, Math.floor(v0)))
      const x0 = -T.R + ix * c, z0 = -T.R + iz * c, u = u0 - ix, v = v0 - iz, ha = H(x0, z0), hb = H(x0, z0 + c), hc = H(x0 + c, z0 + c), hd = H(x0 + c, z0)
      return u + v <= 1 ? ha + (hd - ha) * u + (hb - ha) * v : hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v) },
    info: () => ({ ...info, ink: ink.installed() }),
    // WS-NPC Phase C (Lead-OK 21.10. a): höchstens 4 Tusche-Flecken [{ x, z, r, amount, seed }]; Kollision und Höhen bleiben unberührt
    setInkPatches: (patches) => ink.set(patches),
    // Rapier-Trimesh in Weltkoordinaten (das Gelände liegt im Ursprung, ohne Drehung/Skalierung)
    colliderData: () => ({ vertices: new Float32Array(pos.array), indices: new Uint32Array(geo.index.array) }),
    update(dt = 1 / 60) { terrainLog.update++; t3?.update(dt) },
    dispose() { terrainLog.dispose++; geo.dispose(); mat.dispose(); terrainLog.freed = { geometries: 1, materials: 1 }; root.clear() },
  }
}
