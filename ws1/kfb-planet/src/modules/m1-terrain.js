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
import { createProbeHeight, PROBE_HEIGHT_SRC } from '../world/probeHeight.js'
import PROBE_RECIPE from '../data/worlds/kfb-world-probe.r1.json' with { type: 'json' }
import { hydro, carve, HYDRO_SOURCE_SHA } from '../world/kfb-hydro.v1.js'
import { createWater } from '../look/kfbWater.js'
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

// #439 world=probe: Geländeform der Gelände-Probe (Rezept kfb-world-probe.r1 = „Sanfte Hügel“, Wasserstand 0; Höhe 1:1 aus probe/port/gen_height.py).
//   Platz = Diorama-Anker der Probe im Ursprung (R = flatR, Anschluss blendR − flatR, wie smooth(flatR, blendR)), Sockelhöhe wie die Probe (ringY);
//   alles so verschoben, dass der Platz auf GROUND_Y liegt (Amphitheater wie bisher); Randwall ab hillR wie im Standard obendrauf. 1 Probe-m = 1 Spiel-m (J17).
//   seg: halbes Probe-Gitter (600/256 m ÷ 2), damit Formen im 2,34-m-Raster der Probe nicht verschliffen werden; gedeckelt bei 400k Dreiecken
export const PROBE_NE = 600 / 256
export const PROBE_WATER = 0.06   // Wasserstand der Spielwelt = Georgs Probe-Einstellung (6 %): Meer in den Talböden, Flüsse münden dort
export function createProbeWorld(T = TERRAIN, recipe = { ...PROBE_RECIPE, stylize: { ...PROBE_RECIPE.stylize, waterLevel: PROBE_WATER } }) {
  const P = createProbeHeight(recipe)
  const plaza = { kind: 'plaza', x: 0, z: 0, R: T.flatR, y: 0, on: false, bh: 0, bw: 0.1, open: 0, hx: 0, hz: 0, rot: 0, blend: T.blendR - T.flatR }
  plaza.y = P.ringY(plaza); plaza.on = true; P.anchors.push(plaza)   // wie SPAWN_A der Probe: Höhe bei ausgeschaltetem Anker, dann an
  const dy = GROUND_Y - plaza.y, base = (x, z) => P.height(x, z) + dy
  const full = (x, z) => base(x, z) + smooth(T.hillR, T.R, Math.hypot(x, z)) * T.rimH
  /* Flüsse, Bergseen, Wasserfälle (kfb-hydro.v1, erzeugt aus der Probe): einmal beim Erzeugen, 4-m-Raster über die ganze Welt; Meer in den Talböden wie in der Probe
     (Wasserstand aus dem Rezept), Flüsse münden dort. Das Talprofil ersetzt das Gelände (Netz zuerst) → Bild, Kollision und Platzierung in derselben Rinne */
  const t0 = performance.now(), HG = 4, HN = Math.ceil((2 * T.R) / HG) + 1, o0 = -HG * (HN - 1) / 2, Hr = new Float32Array(HN * HN)
  for (let j = 0; j < HN; j++) for (let i = 0; i < HN; i++) Hr[j * HN + i] = full(o0 + i * HG, o0 + j * HG)
  const seaY = P.settings.water > 0.005 ? P.settings.water * P.settings.amp + 0.15 + dy : null   /* Meer wie in der Probe (Pegel uWater·uAmp + 0,15), im Spiel verschoben */
  const hyd = hydro({ H: Hr, HN, HG, ox: o0, oz: o0, cx: 0, cz: 0, wl: seaY ?? -1e6, hgt: full })
  const hydMs = performance.now() - t0
  return { base, full, hyd, hydMs, seaY, grid: { HG, HN, o: o0 }, height: (x, z) => carve(hyd.field, x, z, full(x, z)), plazaY: plaza.y, shift: dy, settings: P.settings,
    seg: Math.min(447, Math.ceil((2 * T.R) / (PROBE_NE / 2))) }
}
// Höhe der aktiven Welt für Aufrufer ohne Modul-Zugriff (Spieler-Grenzen, Kamera, Auto, Ringe): Standard = terrainHeight, world=probe = Probe-Höhe;
// minY = tiefster Geländepunkt (nur world=probe: Täler liegen bis ≈ 17 m unter dem Platz, die Absturzgrenze rechnet von dort)
export const terrainActive = { height: null, minY: null }
export const groundHeight = (x, z) => (terrainActive.height ? terrainActive.height(x, z) : terrainHeight(x, z))

// options: { biome (Farbe aus BIOMES), terrain?: Teilwerte von TERRAIN }
export function createTerrain(options = {}) {
  terrainLog.create++
  const T = { ...TERRAIN, ...(options.terrain || {}) }
  const noise = T.seed === TERRAIN.seed ? DEFAULT_NOISE : makeNoise(T.seed)
  const T2 = options.look === 'terrain2', T3 = options.look === 'terrain3'
  const tPW = options.world === 'probe' && !T2 ? performance.now() : 0
  const PW = tPW ? createProbeWorld(T) : null // #439 world=probe (terrain2 nutzt world für seine Palette)
  if (PW && !(options.terrain && options.terrain.seg)) T.seg = PW.seg
  const H = PW ? PW.height : T2 ? (x, z) => terrainHeight(x, z, T, noise) + terrain2Berm(x, z) : (x, z) => terrainHeight(x, z, T, noise) // #439: Erdwall um den Bühnenfuß nur in der Variante
  const root = new THREE.Group(); root.name = 'm1-terrain'
  const geo = new THREE.PlaneGeometry(T.R * 2, T.R * 2, T.seg, T.seg); geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i)))
  // world=probe: Farbspanne terrain3 = echte Höhenspanne der Probe-Fläche bis hillR (ohne Randwall); Bauzeit der Höhen für den Bericht
  let pwRange = null; if (PW) { let lo = Infinity, hi = -Infinity; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); if (x * x + z * z <= T.hillR * T.hillR) { const h = pos.getY(i) - smooth(T.hillR, T.R, Math.hypot(x, z)) * T.rimH; if (h < lo) lo = h; if (h > hi) hi = h } } pwRange = [lo, hi] }
  const heightMs = PW ? performance.now() - tPW : 0
  geo.computeVertexNormals()
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: T2 ? TERRAIN2_CFG.clayAmt : T3 ? 0.25 : 0.45 } }, { oct: 2, near: true, stick: false }) // #439: Knete ruhiger (keine Flecken über den Farbflächen)
  const mat = fam.std(options.biome?.top || '#9aab62', 0.95)
  const t2 = T2 ? applyTerrain2(mat, { world: options.world, ring: options.ring }) : null // #439: Farbflächen + Palettenschatten (Variante, Standard unverändert)
  const t3 = T3 ? applyTerrain3(mat, { palette: options.palette, hMin: pwRange ? pwRange[0] : GROUND_Y, hMax: pwRange ? pwRange[1] : GROUND_Y + T.hillAmp * 1.6 }) : null // #439 terrain3: Fließfarben der Gelände-Probe + Palettenschatten
  const ink = applyInkPatches(mat) // WS-NPC Phase C (V-583): Tusche-Flecken, erst ab dem ersten Patch im Shader (ohne Patch byte-gleich)
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'm1-terrain-clay'; mesh.receiveShadow = true
  root.add(mesh)
  // world=probe: Wasser (kfbWater, erzeugt aus der Probe) liest die Höhen des Netzes (gleiche Dreiecke) als Textur
  let water = null; if (PW && typeof document !== 'undefined') { const gd = new Float32Array(pos.count); for (let i = 0; i < pos.count; i++) gd[i] = pos.getY(i)
    water = createWater({ hyd: PW.hyd, ground: { data: gd, seg: T.seg, ox: -T.R, oz: -T.R, cell: (2 * T.R) / T.seg }, seaY: PW.seaY, size: 2 * T.R }); root.add(water.object3d) }
  // Steigung (Grad) bis hillR, für die Prüfung „begehbar“ (Controller slopeMaxAngle)
  let maxSlope = 0
  for (let k = 0; k < 4000; k++) { const a = (k * 2.399963) % (Math.PI * 2), r = T.hillR * Math.sqrt((k + 0.5) / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r, e = 0.5
    const gx = (H(x + e, z) - H(x - e, z)) / (2 * e), gz = (H(x, z + e) - H(x, z - e)) / (2 * e); maxSlope = Math.max(maxSlope, Math.atan(Math.hypot(gx, gz)) * 180 / Math.PI) }
  const info = { look: t2 ? 'terrain2' : 'standard', palette: t2?.palette || null, diameterWalkable: T.hillR * 2, diameterTotal: T.R * 2, flatR: T.flatR, groundY: GROUND_Y, tris: T.seg * T.seg * 2, maxSlopeDeg: +maxSlope.toFixed(1) }
  if (PW) { Object.assign(info, { water: water ? water.info() : { lines: PW.hyd.lines.length, lakes: PW.hyd.lakes.length, falls: PW.hyd.falls.length }, hydroMs: +PW.hydMs.toFixed(1), hydroSha: HYDRO_SOURCE_SHA, world: 'probe', seg: T.seg, cell: (2 * T.R) / T.seg, heightMs: +heightMs.toFixed(1), createMs: +(performance.now() - tPW).toFixed(1), hRange: pwRange, plazaY: PW.plazaY, shift: PW.shift, source: PROBE_HEIGHT_SRC.blocksSha256 }); terrainActive.height = H; terrainActive.minY = pwRange[0] }
  // world=probe: Höhe je Gitterpunkt nur einmal rechnen (Probe-Höhe ≈ 10 µs); gleiche Punkte und Zahlen wie ohne Zwischenspeicher
  const NODE = PW ? new Float64Array((T.seg + 1) * (T.seg + 1)).fill(NaN) : null
  const Hn = PW ? (x0, z0, ix, iz) => { const k = iz * (T.seg + 1) + ix; let v = NODE[k]; if (v !== v) { v = H(x0, z0); NODE[k] = v } return v } : null
  return {
    object3d: root,
    height: H,
    // C3: Höhe der tatsächlich gerenderten Dreiecke (PlaneGeometry-Raster, Teilung a-b-d / b-c-d) statt der glatten Funktion H, damit liegende
    // Kügelchen exakt auf der sichtbaren Fläche sitzen (Einsinken 0 gegen das Netz, nicht gegen H)
    surfaceAt: (x, z) => { const c = (2 * T.R) / T.seg, u0 = (x + T.R) / c, v0 = (z + T.R) / c, ix = Math.min(T.seg - 1, Math.max(0, Math.floor(u0))), iz = Math.min(T.seg - 1, Math.max(0, Math.floor(v0)))
      const x0 = -T.R + ix * c, z0 = -T.R + iz * c, u = u0 - ix, v = v0 - iz
      const ha = Hn ? Hn(x0, z0, ix, iz) : H(x0, z0), hb = Hn ? Hn(x0, z0 + c, ix, iz + 1) : H(x0, z0 + c), hc = Hn ? Hn(x0 + c, z0 + c, ix + 1, iz + 1) : H(x0 + c, z0 + c), hd = Hn ? Hn(x0 + c, z0, ix + 1, iz) : H(x0 + c, z0)
      return u + v <= 1 ? ha + (hd - ha) * u + (hb - ha) * v : hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v) },
    info: () => ({ ...info, ink: ink.installed() }),
    // world=probe: Prüfhilfe – je ein Punkt an Fall, Fluss und Meer (für feste Kameras)
    waterSpots: () => { if (!PW) return null; const h = PW.hyd, f = h.falls[0], L = [...h.lines].sort((a, b) => b.pts.length - a.pts.length)[0], q = L?.pts[Math.floor(L.pts.length / 2)]
      let sea = null; if (PW.seaY != null) for (let k = 0; k < 4000 && !sea; k++) { const a = k * 2.399963, r = 140 * Math.sqrt((k + 0.5) / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r; if (H(x, z) < PW.seaY - 0.6) sea = [x, PW.seaY, z] }
      return { fall: f ? [f.b.x, f.bot, f.b.z] : null, river: q ? [q.x, q.lv, q.z] : null, sea } },
    // WS-NPC Phase C (Lead-OK 21.10. a): höchstens 4 Tusche-Flecken [{ x, z, r, amount, seed }]; Kollision und Höhen bleiben unberührt
    setInkPatches: (patches) => ink.set(patches),
    // world=probe, WS-Audio R1 (V-598): Wasser lesend für den Ton (Fluss-Linien, Bergseen, Fälle, Meeresspiegel, 4-m-Raster der Seezellen)
    hydro: () => (PW ? { lines: PW.hyd.lines, lakes: PW.hyd.lakes, falls: PW.hyd.falls, seaY: PW.seaY, grid: PW.grid, height: H, R: T.R } : null),
    // Rapier-Trimesh in Weltkoordinaten (das Gelände liegt im Ursprung, ohne Drehung/Skalierung)
    colliderData: () => ({ vertices: new Float32Array(pos.array), indices: new Uint32Array(geo.index.array) }),
    update(dt = 1 / 60) { terrainLog.update++; t3?.update(dt); water?.update(dt) },
    dispose() { terrainLog.dispose++; water?.dispose(); if (PW && terrainActive.height === H) { terrainActive.height = null; terrainActive.minY = null } geo.dispose(); mat.dispose(); terrainLog.freed = { geometries: 1, materials: 1 }; root.clear() },
  }
}
