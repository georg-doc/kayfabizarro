// L1 (V-329) · Ein Licht für die Bühne: Ankerstimmungen Tag / Goldene Stunde / Story-Nacht und ein Zeit-Parameter timeOfDay (0 = Nacht, 0,5 = Gold, 1 = Tag).
// Ohne three, ohne DOM: liefert Farben, Stärken und Sonnenrichtung; geschrieben wird nur im Licht-Schreiber (Stage.jsx, LightRig).
// Quellen: Tag = J17 track-look.v5.js Z. 126–129 (replies/light-presets.json j17DaySource), Richtung = WSA_LIGHT_STUDY_C_R1 (Elevation 48,99°, Azimut −53,13° ab +Z,
// Richtung ZUM Licht), Ausgabe ACES + sRGB wie J17 (Z. 93). Gold = E50-Vorschlag (light-presets.json proposals): Sonne #ffd3ae, Hemi/Gegenlicht neutral wie J17,
// Stärken im Verhältnis E50 : Lab-Tag (Key 2,04/2,4, Hemi 0,961/1,25, Fill 0,675/0,9) auf die J17-Tageswerte übertragen. Nacht und die Sonnenhöhen von Gold/Nacht
// sind WS1-Vorschlag (PROPOSED, nicht von Georg angenommen): Sonne fast aus, Hemisphäre kühl und gedämpft; Lesbarkeit kommt aus den lokalen Lichtern (practicals).
import { hexToOklch, oklchToHex, dHue } from './vendor/palette/kfb-cartoon-palette.js'
export const LIGHT_ANCHORS = Object.freeze({
  day: { sun: '#fff4e6', sunI: 2.9, hemiSky: '#eef4fa', hemiGround: '#9a8a78', hemiI: 1.05, back: '#ffe6d6', backI: 0.6, elev: 48.99, az: -53.13, src: 'J17' },
  gold: { sun: '#ffd3ae', sunI: 2.9 * (2.04 / 2.4), hemiSky: '#eef4fa', hemiGround: '#9a8a78', hemiI: 1.05 * (0.960714286 / 1.25), back: '#ffe6d6', backI: 0.6 * (0.675 / 0.9), elev: 16, az: -53.13, src: 'E50 + PROPOSED elev' },
  night: { sun: '#9fb4ff', sunI: 0.18, hemiSky: '#6f82b8', hemiGround: '#2c2a36', hemiI: 0.42, back: '#7d8fd0', backI: 0.18, elev: 35, az: -53.13, src: 'PROPOSED' },
})
export const TOD_NAMES = Object.freeze({ night: 0, gold: 0.5, day: 1 })

// Tageszeit × Palette (BRIEF_WS1_LIGHT_R1 Regel 3): Tag = Himmelsfarbe der Palette genau; Goldene Stunde = in OKLCH um höchstens 25° Richtung Orange
// gedreht und leicht entsättigt; Nacht = Helligkeit × 0,35, Buntheit × 0,5, Farbton Richtung Blau. Orange = 55°, Blau = 262° (OKLCH, WS1-Wahl der Zielwinkel).
const ORANGE = 55, BLUE = 262
const toward = (h, target, maxDeg) => { const d = -dHue(h, target); return h + Math.sign(d) * Math.min(Math.abs(d), maxDeg) }
const goldOf = (hex) => { const c = hexToOklch(hex); return oklchToHex(c.L, c.C * 0.85, toward(c.h, ORANGE, 25)) }
const nightOf = (hex) => { const c = hexToOklch(hex); return oklchToHex(c.L * 0.35, c.C * 0.5, toward(c.h, BLUE, Math.abs(dHue(c.h, BLUE)) * 0.6)) }
export function skyAtTod(hex, tod = 1) {
  const t = Math.min(1, Math.max(0, tod)), ease = (u) => u * u * (3 - 2 * u)
  return t <= 0.5 ? mixHex(nightOf(hex), goldOf(hex), ease(t / 0.5)) : mixHex(goldOf(hex), hex, ease((t - 0.5) / 0.5))
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const toHex = (c) => '#' + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4), srgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055)
// Farben linear-hell mischen (wie die E50-Herleitung „linear-sRGB-Mittel“), Zahlen gerade
const mixHex = (a, b, k) => toHex(hex(a).map((v, i) => srgb(lin(v) + (lin(hex(b)[i]) - lin(v)) * k)))
const mixAnchor = (A, B, k) => ({ sun: mixHex(A.sun, B.sun, k), sunI: A.sunI + (B.sunI - A.sunI) * k, hemiSky: mixHex(A.hemiSky, B.hemiSky, k), hemiGround: mixHex(A.hemiGround, B.hemiGround, k),
  hemiI: A.hemiI + (B.hemiI - A.hemiI) * k, back: mixHex(A.back, B.back, k), backI: A.backI + (B.backI - A.backI) * k, elev: A.elev + (B.elev - A.elev) * k, az: A.az + (B.az - A.az) * k })

// timeOfDay 0–1 stufenlos: 0 → Nacht, 0,5 → Gold, 1 → Tag (stückweise linear, weich an den Ankern)
export function lightAt(tod = 1) {
  const t = Math.min(1, Math.max(0, tod)), ease = (u) => u * u * (3 - 2 * u)
  const L = t <= 0.5 ? mixAnchor(LIGHT_ANCHORS.night, LIGHT_ANCHORS.gold, ease(t / 0.5)) : mixAnchor(LIGHT_ANCHORS.gold, LIGHT_ANCHORS.day, ease((t - 0.5) / 0.5))
  return { ...L, tod: t, sunDir: sunDirection(L.elev, L.az) }
}
// Richtung ZUM Licht als Einheitsvektor (Azimut ab +Z, positiv Richtung +X)
export function sunDirection(elevDeg, azDeg) {
  const e = (elevDeg * Math.PI) / 180, a = (azDeg * Math.PI) / 180
  return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)]
}
// Hash: tod=day|gold|night|0..1
export function parseTod(hash) {
  const m = /tod=([\w.]+)/.exec(hash || ''); if (!m) return 1
  return m[1] in TOD_NAMES ? TOD_NAMES[m[1]] : Math.min(1, Math.max(0, parseFloat(m[1]) || 1))
}
