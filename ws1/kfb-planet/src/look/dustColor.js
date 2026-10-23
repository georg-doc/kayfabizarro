// Staub-Probe r2 (Georg 23.10., Schritt 4 aus WS0 Particle-First, Hash dust2=1): Staubfarbe aus der Bodenpalette am Ort statt aus dem Höhenton
// (terrainDustColor). Grob nach Zone/Rolle wie WS0 empfiehlt, keine Nachbildung des Shader-Farbfelds: terrain3 mischt die Bänder peak/sand/low/mid/high
// (+ mid/high) per Rauschen – der Staub nimmt deren Mittel (linear). In der Biom-Fahrt das Mittel je Biom, nach den Biom-Gewichten am Rad gemischt.
// Staub = aufgewirbelter heller Boden: etwas heller (+lift in HSL-L) und leicht entsättigt (× sat), damit er sich vom Boden abhebt.
import * as THREE from 'three'
import { TERRAIN3_CFG } from './terrain3.js'

export const DUST_TONE = Object.freeze({ lift: 0.12, sat: 0.65, maxL: 0.86 })
const BANDS = ['peak', 'sand', 'low', 'mid', 'high']
// Bodenmittel einer Palette (die sechs terrain3-Bänder, das sechste = Mitte aus mid und high), linear gemittelt
export function groundMean(P) {
  const c = new THREE.Color(0, 0, 0), t = new THREE.Color(); let n = 0
  for (const r of BANDS) if (P[r]) { c.add(t.set(P[r])); n++ }
  if (P.mid && P.high) { c.add(t.set(P.mid).lerp(new THREE.Color(P.high), 0.5)); n++ }
  return n ? c.multiplyScalar(1 / n) : c.set('#c9b48a')
}
export function dustTone(c, T = DUST_TONE) { const h = {}; c.getHSL(h); return c.clone().setHSL(h.h, h.s * T.sat, Math.min(T.maxL, h.l + T.lift)) }

// colorAt(x, z) → THREE.Color (geteilt, nicht behalten). opts: { palette: Palettenobjekt | null, biome: { weights(x, z, out[6]), palettes: [6] } | null }
export function createDustColorAt({ palette = null, biome = null, tone = DUST_TONE } = {}) {   // tone: Aufhellung/Entsättigung (Staubfahne heller als r2)
  const base = dustTone(groundMean(palette || TERRAIN3_CFG.palettes[TERRAIN3_CFG.palette]), tone), out = new THREE.Color(), w = new Float32Array(6)
  let bm = null, bmOf = null
  const biomeMeans = () => { if (bmOf !== biome.palettes || !bm || bm.key !== biome.palettes.map((p) => p.sand).join()) { bm = biome.palettes.map((p) => dustTone(groundMean(p), tone)); bm.key = biome.palettes.map((p) => p.sand).join(); bmOf = biome.palettes } return bm }   // neu, wenn die Paletten getauscht werden (palseed)
  const lumOf = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b, gBase = groundMean(palette || TERRAIN3_CFG.palettes[TERRAIN3_CFG.palette]), gOut = new THREE.Color()
  let gm = null
  const fn = (x, z) => {
    if (!biome) return out.copy(base)
    const M = biomeMeans(); biome.weights(x, z, w); let s = 0; out.setRGB(0, 0, 0)
    for (let i = 0; i < M.length && i < 6; i++) if (w[i] > 0) { out.r += M[i].r * w[i]; out.g += M[i].g * w[i]; out.b += M[i].b * w[i]; s += w[i] }
    return s > 0 ? out.multiplyScalar(1 / s) : out.copy(base)
  }
  // Helligkeitsverhältnis Boden/Staub am Ort (Nacht: Staub zurück auf den Bodenton, damit er ohne Schatten nicht leuchtet)
  fn.groundRatio = (x, z) => { if (!biome) return lumOf(gBase) / Math.max(1e-4, lumOf(base))
    if (!gm || gm.key !== biome.palettes.map((p) => p.sand).join()) { gm = biome.palettes.map((p) => groundMean(p)); gm.key = biome.palettes.map((p) => p.sand).join() }
    const d = fn(x, z), w2 = new Float32Array(6); biome.weights(x, z, w2); let s = 0; gOut.setRGB(0, 0, 0)
    for (let i = 0; i < gm.length && i < 6; i++) if (w2[i] > 0) { gOut.r += gm[i].r * w2[i]; gOut.g += gm[i].g * w2[i]; gOut.b += gm[i].b * w2[i]; s += w2[i] }
    return s > 0 ? lumOf(gOut.multiplyScalar(1 / s)) / Math.max(1e-4, lumOf(d)) : 1 }
  return fn
}
