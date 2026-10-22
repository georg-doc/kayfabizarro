// V-619 · Biom-Feld der endlosen Fahrt: welches Biom wo liegt, nur aus dem Seed (kfb-biome-drive.r1.json). Ohne three, ohne DOM (Node-Tests).
// Regionen = Voronoi-Zellen (Zelle cell_m, Mittelpunkt je Zelle gewürfelt), Ränder verbogen (Domain-Warp: kein gerader Rand über Hunderte Meter).
// Übergang (V-403): je Punkt sechs Gewichte, die an jeder Grenze über eine Breite von band_m[0]…band_m[1] (je Grenzstelle anders, Wertrauschen)
// ineinanderlaufen. Die Gewichte sind glatt; WIE sie ineinanderlaufen, entscheidet im Bild das Sprenkel-Modul (biomeTerrain.js), nie ein Verlauf.
// Zweites, breiteres Gewicht für die Geländehöhe je Biom (heightBand_m), damit Höhenunterschiede keine Stufe bilden. Um den Platz (Amphitheater)
// liegt immer das Start-Biom (startR_m), der Platz selbst bleibt auf seiner Höhe.
import CFG from '../data/worlds/kfb-biome-drive.r1.json' with { type: 'json' }
import { valueNoise } from '../vendor/speckle/kfb-speckle-transition.v1.js'

export const BIOME_CFG = CFG
export const BIOMES = CFG.order                       // Index 0..5 = Reihenfolge der Gewichte (Shader, Bewuchs, Licht)
export const NB = BIOMES.length
const fract = (v) => v - Math.floor(v)
const hash2 = (i, j, s) => fract(Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453)
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

// opts: { seed, cell_m, ... } überschreiben die Datei (Tests)
export function createBiomeField(opts = {}) {
  const C = { ...CFG, ...opts }, CELL = C.cell_m, S = (C.seed % 9973) + 0.5
  const startIx = BIOMES.indexOf(C.start)
  const cellBiome = new Map()
  // Biom je Zelle: gewürfelt, Nachbarn möglichst verschieden (sonst verschmelzen zwei Zellen zu einer Riesenregion)
  const biomeOf = (i, j) => { const key = i + ',' + j; let b = cellBiome.get(key); if (b !== undefined) return b
    b = Math.floor(hash2(i, j, S) * NB) % NB
    const left = Math.floor(hash2(i - 1, j, S) * NB) % NB, down = Math.floor(hash2(i, j - 1, S) * NB) % NB
    for (let k = 0; k < NB && (b === left || b === down); k++) b = (b + 1 + Math.floor(hash2(j, i, S + k) * 3)) % NB
    if (i === 0 && j === 0) b = startIx
    cellBiome.set(key, b); if (cellBiome.size > 4096) cellBiome.clear(); return b }
  const center = (i, j) => [(i + 0.2 + 0.6 * hash2(i, j, S + 1.3)) * CELL, (j + 0.2 + 0.6 * hash2(i, j, S + 2.7)) * CELL]
  const warp = (x, z) => { const a = C.warp.amp_m, s = C.warp.scale_m
    return [x + a * (valueNoise(x / s + 11.3, z / s + 3.1) * 2 - 1), z + a * (valueNoise(x / s - 7.9, z / s + 19.4) * 2 - 1)] }
  const cand = new Float64Array(9 * 4)   // je Kandidat: cx, cz, d², Biom
  const ctr = new Map()                     // Zell-Mittelpunkte zwischengespeichert (Tausende Abfragen je Chunk)
  const centerC = (i, j) => { const key = i * 100003 + j; let c = ctr.get(key); if (!c) { c = center(i, j); if (ctr.size > 8192) ctr.clear(); ctr.set(key, c) } return c }
  const MUL = BIOMES.map((b) => C.biomes[b].height ?? 1), tmpH = new Float32Array(NB)
  // ein Voronoi-Suchlauf, zwei Bänder: Farbe (band_m, je Grenzstelle anders) → out, Höhe (heightBand_m) → Rückgabe = Höhenfaktor
  function blend(out, full, n, best, bd) {
    const hw = full / 4; out.fill(0)
    for (let k = 0; k < n; k++) { let raw = 1
      if (k !== best) { const e = (Math.sqrt(cand[k * 4 + 2]) - Math.sqrt(bd)) / 2; raw = 1 - sstep(0, 2 * hw, e) }   // halbe Abstandsdifferenz ≈ Abstand zur Grenze, überall stetig (auch an Dreiländerecken)
      if (raw > 0) out[cand[k * 4 + 3]] += raw }
    let s = 0; for (let b = 0; b < NB; b++) s += out[b]; for (let b = 0; b < NB; b++) out[b] /= s
  }
  const startW = (x, z) => { const r = Math.hypot(x, z); return r < C.startR_m[1] ? 1 - sstep(C.startR_m[0], C.startR_m[1], r) : 0 }
  // sample(x, z, out[6] | null) → Höhenfaktor; out = Farbgewichte (Summe 1) mit Start-Biom um den Platz (startR_m: voll bis r0, aus bis r1)
  function sample(x, z, out = null) {
    const [wx, wz] = warp(x, z), ci = Math.floor(wx / CELL), cj = Math.floor(wz / CELL)
    let n = 0, best = 0, bd = Infinity
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const i = ci + di, j = cj + dj, c = centerC(i, j), d2 = (wx - c[0]) ** 2 + (wz - c[1]) ** 2
      cand[n * 4] = c[0]; cand[n * 4 + 1] = c[1]; cand[n * 4 + 2] = d2; cand[n * 4 + 3] = biomeOf(i, j); if (d2 < bd) { bd = d2; best = n } n++ }
    const k = startW(x, z)
    if (out) { blend(out, C.band_m[0] + (C.band_m[1] - C.band_m[0]) * valueNoise(x / 260 + 5.5, z / 260 - 2.2), n, best, bd)
      if (k > 0) { for (let b = 0; b < NB; b++) out[b] *= 1 - k; out[startIx] += k } }
    blend(tmpH, C.heightBand_m, n, best, bd); let m = 0; for (let b = 0; b < NB; b++) m += tmpH[b] * MUL[b]
    return m + (MUL[startIx] - m) * k
  }
  const weights = (x, z, out = new Float32Array(NB)) => { sample(x, z, out); return out }
  const heightMul = (x, z) => sample(x, z, null)
  const tmp = new Float32Array(NB)
  const dominant = (x, z) => { sample(x, z, tmp); let bi = 0; for (let b = 1; b < NB; b++) if (tmp[b] > tmp[bi]) bi = b; return { index: bi, key: BIOMES[bi], w: tmp[bi] } }
  return { sample, weights, heightMul, dominant, cellOf: (x, z) => { const [wx, wz] = warp(x, z); return [Math.floor(wx / CELL), Math.floor(wz / CELL)] }, cfg: C }
}
