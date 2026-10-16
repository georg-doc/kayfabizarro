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

// L2 Schritt 1 (V-340) · Look B „warmer Krazy-Kat-Grundton“ neben A (= L1 genau). Keine zweite Palette: B verschiebt nur Farbtöne der vorhandenen
// Werte in OKLCH (V-305-Rechenart). Sonne wärmer (Farbton Richtung 50°, Buntheit +0,03), Bodenreflex Terrakotta/Ocker (Hemi-Boden Richtung 45°, satter),
// Gegenlicht als kühler Gegenakzent (Richtung Violett 290°), Himmel oben Richtung Koralle (30°), unten Richtung Ocker (75°), je höchstens 70 % des Wegs.
// Alle Zielwinkel und Anteile sind WS1-Vorschlag (PROPOSED), Georg urteilt am Bildpaar A | B.
const shiftTo = (hex, target, k, dC = 0, Lmul = 1) => { const c = hexToOklch(hex); const h = c.h + -dHue(c.h, target) * k; return oklchToHex(c.L * Lmul, Math.max(0, c.C + dC), h) }
export function lookB(L) {
  return { ...L, sun: shiftTo(L.sun, 50, 0.7, 0.03), hemiGround: shiftTo(L.hemiGround, 45, 0.8, 0.05), hemiSky: shiftTo(L.hemiSky, 60, 0.35, 0.01), back: shiftTo(L.back, 290, 0.8, 0.04) }
}
export function skyLookB(top, bottom) { return { top: shiftTo(top, 30, 0.7, 0.03), bottom: shiftTo(bottom, 75, 0.7, 0.02) } }
// Licht-Identität je Figur (L2 Schritt 1, Georg-Absicht §2): Daten, keine zusätzlichen Lichter. rimColor/rimStrength = Randlicht im Material,
// fillTint = Tönung des Figuren-Fills (Pool-Licht nachts), keyBias warm|cool, priority. Startprofile nach V-340: FB warm heroisch, GothGirl violett mystisch.
export const LIGHT_INTENT = Object.freeze({
  frizzlebob: { rimColor: '#ffb066', rimStrength: 0.55, fillTint: '#ffd9a8', keyBias: 'warm', priority: 1 },
  gothgirl: { rimColor: '#a98bff', rimStrength: 0.5, fillTint: '#d8c8ff', keyBias: 'cool', priority: 2 },
  default: { rimColor: '#ffe2c0', rimStrength: 0.35, fillTint: '#ffe6cc', keyBias: 'warm', priority: 3 },
})
// Story-Mode-Voreinstellungen für später (gewürfelt, V-342): nur Hinweise für Rand und Fill, nie der ganze Boden
export const STORY_INTENT = Object.freeze({ tragic: { fillTint: '#9fb8d6' }, heroic: { rimColor: '#ffb066', keyBias: 'warm' }, mystical: { rimColor: '#a98bff' }, forbidden: { rimColor: '#c4507f' }, comic: { rimColor: '#e9e36a' }, absurd: { rimColor: '#e9c14a' } })

// L1 Regel 4 · Sonnenschatten folgt dem Ziel (Figur zu Fuß, Fahrzeug im Auto; Georg 16.10.: „fährt aus dem Schatten raus, extrem pixelig“).
// Ein enges Frustum (±size m) um das Ziel, Mittelpunkt auf das Texelraster der Schattenkarte gerastet (sonst flimmern die Schattenkanten beim
// Bewegen), Sonnenwinkel unverändert. Je Bild vom Host aufrufen; ohne three-Import (Duck-Typing auf DirectionalLight). sunDir = Richtung ZUM Licht (Einheit).
// light: DirectionalLight mit shadow.camera (orthografisch) · target: { x, y, z } · opts: { size = 12, dist = 40, near = 1, far = 90, sunDir }
export function followShadow(light, target, { size = 12, dist = 40, near = 1, far = 90, sunDir } = {}) {
  const d = sunDir || (() => { const p = light.position, t = light.target.position, l = Math.hypot(p.x - t.x, p.y - t.y, p.z - t.z) || 1; return [(p.x - t.x) / l, (p.y - t.y) / l, (p.z - t.z) / l] })()
  // Lichtraum-Basis: f zeigt von der Sonne zum Ziel; r, u spannen die Ebene der Schattenkarte auf
  const f = [-d[0], -d[1], -d[2]], up = Math.abs(f[1]) > 0.99 ? [0, 0, 1] : [0, 1, 0]
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l) }
  const r = nrm(cr(up, f)), u = cr(f, r), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const map = light.shadow?.mapSize?.x || 2048, texel = (2 * size) / map, T = [target.x, target.y, target.z]
  const pr = dot(T, r), pu = dot(T, u), sr = Math.round(pr / texel) * texel - pr, su = Math.round(pu / texel) * texel - pu
  const c = [T[0] + r[0] * sr + u[0] * su, T[1] + r[1] * sr + u[1] * su, T[2] + r[2] * sr + u[2] * su]
  light.target.position.set(c[0], c[1], c[2]); light.target.updateMatrixWorld?.()
  light.position.set(c[0] + d[0] * dist, c[1] + d[1] * dist, c[2] + d[2] * dist)
  const cam = light.shadow?.camera
  if (cam && (cam.left !== -size || cam.far !== far || cam.near !== near)) { Object.assign(cam, { left: -size, right: size, top: size, bottom: -size, near, far }); cam.updateProjectionMatrix?.() }
  return { center: c, texel }
}
