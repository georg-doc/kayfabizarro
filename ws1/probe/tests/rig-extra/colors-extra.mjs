// Antriebsfarben + Materialwerte für alle 14 (rig-extra r1).
// Farbregel = thrust-survey/colors.mjs (r1), unverändert übernommen, damit die 8 neuen zu den 6 alten passen:
//   Basisfarb-Textur 256² → HSL-Histogramm (36 Hue-Bins, graue/zu dunkle/zu helle Pixel raus), Karosserie = Bin mit größtem n·s;
//   Rost/Messing (Hue 12–48°, s < 0,55) oder grau (s < 0,22) → Fahne = kräftigster Akzent (Hue > 40° weg, s > 0,35), sonst Bernstein 32°;
//   farbige Karosserie → Fahne = Karosserie-Hue. Fahne HSL(h, 0,95, 0,58); Kern HSL(h+20°, 0,6, 0,88); Funken HSL(35° bzw. Karosserie+30°, 1, 0,62).
// Erweiterung r1b siehe unten (nur die 8 neuen). Aufruf: node colors-extra.mjs -> colors-extra.json
import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire('/Users/georgvonwestphalen/kfb-ws1/thrust-survey/survey.mjs')
const { NodeIO } = require('@gltf-transform/core'), { ALL_EXTENSIONS } = require('@gltf-transform/extensions'), sharp = require('sharp')
const HERE = new URL('.', import.meta.url).pathname
const IDS = ['rustwing_cruiser', 'graffiti_jet_cruiser', 'street_racer_hoverbeast', 'crimson_flame_dragster', 'crimson_thunderjet', 'ironclad_skycruiser',
  'brasswing_roadster', 'iron_phantom_hovercar', 'ironclad_wrecker', 'jetbound_roadster', 'rust_runner', 'rustfire_interceptor', 'rustwing_hauler', 'wasteland_beetle']
const RIG = JSON.parse(fs.readFileSync('/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8')).vehicles
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; if (mx === mn) return [0, 0, l]; const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [h * 60, s, l] }
const hex = (h, s, l) => { const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0') }; return '#' + f(0) + f(8) + f(4) }
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const out = {}
for (const id of IDS) {
  const doc = await io.read(HERE + 'glb/' + id + '.glb'), mats = doc.getRoot().listMaterials(), mat = mats[0], tex = mat.getBaseColorTexture()
  // Farbregel r1 (wörtlich)
  const { data, info } = await sharp(Buffer.from(tex.getImage())).resize(256, 256, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true })
  const bins = new Array(36).fill(0).map(() => ({ n: 0, s: 0, l: 0 })); let grey = 0, n = 0
  for (let i = 0; i < data.length; i += info.channels) { const [h, s, l] = hsl(data[i], data[i + 1], data[i + 2]); n++; if (s < 0.18 || l < 0.12 || l > 0.92) { grey++; continue } const b = bins[Math.floor(h / 10) % 36]; b.n++; b.s += s; b.l += l }
  const ranked = bins.map((b, k) => ({ h: k * 10 + 5, n: b.n, s: b.n ? b.s / b.n : 0, l: b.n ? b.l / b.n : 0 })).filter((b) => b.n > 0).sort((a, b) => b.n * b.s - a.n * a.s)
  const body = ranked[0], dist = (a, b) => Math.abs(((a - b + 540) % 360) - 180)
  const accent = ranked.filter((b) => dist(b.h, body.h) > 40 && b.n > n * 0.001 && b.s > 0.35).sort((a, b) => b.n * b.s * b.s - a.n * a.s * a.s)[0] || null
  const brown = body.h >= 12 && body.h <= 48 && body.s < 0.55, greyBody = brown || body.s < 0.22
  const plumeH = greyBody ? (accent ? accent.h : 32) : body.h
  const glow = { core: hex((plumeH + 20) % 360, 0.6, 0.88), plume: hex(plumeH, 0.95, 0.58), spark: hex(greyBody ? 35 : (body.h + 30) % 360, 1, 0.62) }
  // Erweiterung r1b (nur wenn r1 im Bernstein-Rückfall landet): kühle Zweitfarbe ≥ 90° vom Karosserie-Hue (lockerer: s ≥ 0,12, Cluster ±10° ≥ 0,8 % der Pixel)
  // → Fahne in dieser Farbe; sonst Fahne aus dem Karosserie-Hue selbst: Rost/Kupfer (≤ 28°) → 18°, Messing (> 28°) → 42°. Kern/Funken wie r1.
  let glowB = glow, ruleB = 'r1'
  if (greyBody && !accent) {
    const lb = new Array(36).fill(0).map(() => ({ n: 0, h: 0 }))
    for (let i = 0; i < data.length; i += info.channels) { const [h, s, l] = hsl(data[i], data[i + 1], data[i + 2]); if (s < 0.12 || l < 0.08 || l > 0.92) continue; const b = lb[Math.floor(h / 10) % 36]; b.n++; b.h += h }
    let best = null
    for (let q = 0; q < 36; q++) { const c = q * 10 + 5; if (dist(c, body.h) < 90) continue; const grp = [35, 0, 1].map((o) => lb[(q + o) % 36]), cnt = grp.reduce((a, b) => a + b.n, 0); if (cnt / n >= 0.008 && (!best || cnt > best.cnt)) best = { cnt, h: lb[q].n ? lb[q].h / lb[q].n : c } }
    const ph = best ? best.h : body.h <= 28 ? 18 : 42
    glowB = { core: hex((ph + 20) % 360, 0.6, 0.88), plume: hex(ph, 0.95, 0.58), spark: hex(35, 1, 0.62) }
    ruleB = best ? `r1b Zweitfarbe ${Math.round(best.h)}° (${(100 * best.cnt / n).toFixed(1)} %)` : `r1b Karosserie-Hue ${body.h}° → ${ph}°`
  }
  // Texturwerte (512², sRGB → HSV-Sättigung, lineare Luminanz) und Metall/Rauheit
  const big = await sharp(Buffer.from(tex.getImage())).resize(512, 512, { fit: 'fill' }).removeAlpha().raw().toBuffer()
  let S = 0, L = 0, Ls = 0, k = 0
  for (let i = 0; i < big.length; i += 3) { const r = big[i] / 255, g = big[i + 1] / 255, b = big[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b); S += mx > 0 ? (mx - mn) / mx : 0; L += 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); Ls += 0.2126 * r + 0.7152 * g + 0.0722 * b; k++ }
  const mrTex = mat.getMetallicRoughnessTexture(); let mr = null
  if (mrTex) { const m = await sharp(Buffer.from(mrTex.getImage())).resize(256, 256, { fit: 'fill' }).removeAlpha().raw().toBuffer(); let R = 0, M = 0, j = 0; for (let i = 0; i < m.length; i += 3) { R += m[i + 1] / 255; M += m[i + 2] / 255; j++ } mr = { roughMean: +(R / j * mat.getRoughnessFactor()).toFixed(3), metalMean: +(M / j * mat.getMetallicFactor()).toFixed(3) } }
  const sz = (t) => (t ? t.getSize() : null)
  out[id] = {
    materials: mats.length, metallicFactor: mat.getMetallicFactor(), roughnessFactor: mat.getRoughnessFactor(), mrMap: !!mrTex, ...(mr || {}),
    emissiveMap: !!mat.getEmissiveTexture(), emissiveFactor: mat.getEmissiveFactor(), normalMap: !!mat.getNormalTexture(), baseColorFactor: mat.getBaseColorFactor().map((v) => +v.toFixed(3)),
    baseSize: sz(tex), texSat: +(S / k).toFixed(3), texLumLin: +(L / k).toFixed(3), texLumSrgb: +(Ls / k).toFixed(3),
    body: hex(body.h, Math.min(1, body.s), body.l), bodyHue: body.h, bodyShare: +(1 - grey / n).toFixed(2), greyBody, accent: accent && hex(accent.h, Math.min(1, accent.s), accent.l), glowR1: glow, glow: RIG[id] ? glow : glowB, glowRule: RIG[id] ? 'r1 (bestehend)' : ruleB,
    glowMatchesR1: RIG[id] ? JSON.stringify(RIG[id].glow) === JSON.stringify(glow) : null,
  }
  console.log(id.padEnd(24), JSON.stringify(out[id].glow), out[id].glowRule, RIG[id] ? (out[id].glowMatchesR1 ? 'r1 ✓' : 'r1 ✗ ' + JSON.stringify(RIG[id].glow)) : '', `metal ${out[id].metallicFactor}/${out[id].metalMean} rough ${out[id].roughnessFactor}/${out[id].roughMean} em ${out[id].emissiveMap} sat ${out[id].texSat} lum ${out[id].texLumLin}`)
}
fs.writeFileSync(HERE + 'colors-extra.json', JSON.stringify({ rule: 'r1 wie thrust-survey/colors.mjs; r1b für die 8 neuen, wenn r1 im Bernstein-Rückfall landet: kühle Zweitfarbe ≥ 90° vom Karosserie-Hue (s ≥ 0,12, ≥ 0,8 %), sonst Rost/Kupfer → 18°, Messing → 42°. r1 (Kern Fahne-Hue +20°, L 0,88; Fahne = Karosserie-Hue satt; Rost/Messing/grau → kräftigster Akzent, sonst Bernstein 32°; Funken 35° bzw. Karosserie +30°)', vehicles: out }, null, 1))
