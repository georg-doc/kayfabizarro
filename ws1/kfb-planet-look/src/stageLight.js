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
const goldOf = (hex) => { const c = hexToOklch(hex); return oklchToHex(c.L * 0.84, c.C * 0.85, toward(c.h, ORANGE, 25)) } // L3: Gold-Himmel dunkler (R2-Tabelle)
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

// L3 (Regel 3, LIGHT_MODEL_R2): Look B wärmt nur noch den Himmel (skyLookB), nie das Licht; lookB() und die Licht-Identität je Figur (Randlicht) sind entfernt.
const shiftTo = (hex, target, k, dC = 0, Lmul = 1) => { const c = hexToOklch(hex); const h = c.h + -dHue(c.h, target) * k; return oklchToHex(c.L * Lmul, Math.max(0, c.C + dC), h) }
// V-346 (Georg: „anderer Skydome als bei A“): derselbe Himmel, nur getönt. Vorher (v340) drehte B den Farbton um 70 % des Wegs Richtung Koralle/Ocker –
// aus Hellblau wurde Rosa. Jetzt wird die Himmelsfarbe nur linear ein wenig mit warmem Licht gemischt (oben 12 % Pfirsich, unten 15 % Ocker-Creme):
// Blau bleibt Blau, nur wärmer. Alle Werte WS1-Vorschlag.
// mesa (Georg 17.10., Krazy Kat / Painted Desert): oben Richtung tiefes Türkis-Cerulean, unten Richtung Pfirsich (je 40 % linear gemischt)
export const SKY_TINT = Object.freeze({ v340: { rotate: true, k: 0.7, dC: [0.03, 0.02] }, v346: { rotate: false, mix: [0.12, 0.15], toward: ['#ffcfb0', '#ffe2b0'] }, mesa: { rotate: false, mix: [0.42, 0.4], toward: ['#2f93c4', '#f7b788'] } })
export function skyLookB(top, bottom, T = SKY_TINT.v346) {
  if (T.rotate) return { top: shiftTo(top, 30, T.k, T.dC[0]), bottom: shiftTo(bottom, 75, T.k, T.dC[1]) }
  return { top: mixHex(top, T.toward[0], T.mix[0]), bottom: mixHex(bottom, T.toward[1], T.mix[1]) }
}
// V-346 Punkt 2 · Schattenlänge je Meter Figurenhöhe = 1 / tan(Sonnenhöhe); Richtung = Gegenrichtung des Sonnen-Azimuts. Beides kommt nur aus timeOfDay.
export const shadowLength = (elevDeg) => 1 / Math.tan((Math.max(1, elevDeg) * Math.PI) / 180)

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
