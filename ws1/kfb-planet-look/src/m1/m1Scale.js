// V-345 · M1/M2 in J17-Metern (FB 1,81 m statt 2,79 m): eine Stelle für den Faktor der Bewegungs-Seite. Die Zahlen in M1/M2 bleiben die
// abgenommenen alten WS1-Werte, umgerechnet wird beim Festlegen (wie Stage.jsx mit worldScale.K). wscale=legacy = alte Größe zum Vergleich.
//   Längen und Tempi × K · Schwerkraft G = 9,81 (§60; legacy 14) · Absprungtempo × JUMP_K (Sprunghöhe × K bei G) ·
//   Federn/Dämpfer der Kapsel × K³ (Masse ∝ Volumen, gleiche Eigenfrequenz) · Drehfedern × K⁵ (Trägheit ∝ Masse × Länge²)
import { worldKFor } from '../worldScale.js'

export const K = worldKFor(typeof location !== 'undefined' ? location.hash : '')
export const G = K === 1 ? 14 : 9.81
export const JUMP_K = Math.sqrt((G * K) / 14)
export const MASS_K = K ** 3, INERTIA_K = K ** 5
export const kk = (v) => (Array.isArray(v) ? v.map((x) => x * K) : v * K)
