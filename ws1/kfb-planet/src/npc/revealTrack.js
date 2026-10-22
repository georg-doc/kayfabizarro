// WS-NPC E3 (WS0 V-634, Lead 22.10.: „Trupp aus dem Geschenk“) · Auswertung der Geschenk-Enthüllung, rein, Node-geprüft (test/unit/revealTrack.mjs).
// 1:1 nach Resident Atlas lib/studio.js makeReveal (Cut 2026-10-04 r2): Schlüssel [t, wert], Easing je Spur (EASE unten wortgleich), bool-Werte springen,
// vor dem ersten Schlüssel gilt der erste, nach dem letzten der letzte. Eigenschaften: visible, x/y/z (Versatz zur Grundlage, u), scale [x,y,z] und
// scaleAll (Faktor auf die Grundlage), rz/ry (Grad zur Grundlage). Im Spiel läuft die Spur einmal (kein loop) ab dem Auslöser.
export const EASE = Object.freeze({
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  outBack: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.5 * Math.pow(t - 1, 2),
  outElastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
})
const lerp = (a, b, t) => (Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * t) : a + (b - a) * t)

// Wert einer Spur zur Zeit t (Sekunden seit Auslöser)
export function trackValue(tr, t) {
  const keys = tr.keys
  if (t <= keys[0][0]) return keys[0][1]
  if (t >= keys[keys.length - 1][0]) return keys[keys.length - 1][1]
  let i = 0; while (i < keys.length - 2 && keys[i + 1][0] <= t) i++
  const [t0, v0] = keys[i], [t1, v1] = keys[i + 1], raw = (t - t0) / (t1 - t0)
  return typeof v0 === 'boolean' ? v0 : lerp(v0, v1, (EASE[tr.ease] || EASE.linear)(raw))
}
// alle Spuren eines Knotens zur Zeit t → { visible?, x?, y?, z?, scale?, scaleAll?, rz?, ry? }
export function nodeAt(spec, node, t) { const o = {}; for (const tr of spec.tracks) if (tr.node === node) o[tr.prop] = trackValue(tr, t); return o }
// Ruhestand: Zeitpunkt, an dem jede Spur ihren letzten Schlüssel erreicht hat (studio.js „rest“)
export const restTime = (spec) => Math.min(spec.duration, Math.max(0, ...spec.tracks.map((tr) => tr.keys[tr.keys.length - 1][0])))
// Phase zur Zeit t (Liste [t, name] aus der Spur)
export function phaseAt(spec, t) { let p = spec.phases?.[0]?.[1] ?? null; for (const [pt, name] of spec.phases || []) if (t >= pt) p = name; return p }
