// M3 · Daten des Stunt-Testfelds (ohne three/React, auch für Node-Tests): Lage, Maße, Keil-Ecken, Gebäude-Quader. Darstellung: stuntField.jsx.
import { K } from '../m1/m1Scale.js'
import { WORLD_K } from '../worldScale.js'

export const J = K / WORLD_K // J17-Meter (1) bzw. alte Größe (legacy)
export const GY = -0.125 * K // Bodenhöhe des Platzes (m1-terrain GROUND_Y)
// Keil: Fuß bei (x, z), steigt in Richtung yaw (0 = +Z) über len auf h, Breite w; Tafel = Auffahrt + Plateau (top) + senkrechte Kante
export const STUNT = Object.freeze({
  ramps: [
    { id: 'flach', x: 14, z: 10, yaw: Math.PI, w: 4, len: 6.1, h: 1.3 },
    { id: 'steil', x: 19, z: 10, yaw: Math.PI, w: 4, len: 5, h: 2.0 },
    { id: 'kicker', x: 24, z: 10, yaw: Math.PI, w: 4, len: 2.2, h: 1.4 },
    { id: 'tafel', x: 29, z: 10, yaw: Math.PI, w: 4, len: 2.2, h: 0.7, top: 4 },
  ].map((r) => ({ ...r, deg: +((Math.atan2(r.h, r.len) * 180) / Math.PI).toFixed(1) })),
  walls: [
    { id: 'block-a', x: -24, z: 8, w: 6, d: 6, h: 5 },
    { id: 'block-b', x: -24, z: -8, w: 4, d: 24, h: 4, ride: true }, // markierte Wandfläche (Stufe F): nur hier Wandfahrt; 24 m lang, damit die Haltezeit 1,4 s Platz hat
    { id: 'ecke-1', x: -16, z: 23, w: 8, d: 2, h: 3 }, { id: 'ecke-2', x: -19, z: 19, w: 2, d: 6, h: 3 },
    { id: 'gasse-1', x: -14, z: -17.5, w: 6, d: 2.5, h: 4 }, { id: 'gasse-2', x: -14, z: -23.2, w: 6, d: 2.5, h: 4 },
  ],
})
// Welt-Ecken eines Keils (für ConvexHullCollider und Netz): Unterseite 0,4 m unter dem Boden, damit kein Spalt zum Gelände bleibt
export function rampVerts(r) {
  const c = Math.cos(r.yaw), s = Math.sin(r.yaw), L = r.len * J, T = (r.top || 0) * J, W = (r.w * J) / 2, H = r.h * J, B = -0.4 * J
  const P = (u, v, y) => [r.x * J + u * s + v * c, GY + y, r.z * J + u * c - v * s] // u längs (Steigrichtung), v quer
  const pts = [P(0, -W, 0), P(0, W, 0), P(L, -W, H), P(L, W, H), P(0, -W, B), P(0, W, B)]
  if (T) pts.push(P(L + T, -W, H), P(L + T, W, H), P(L + T, -W, B), P(L + T, W, B), P(L, -W, B), P(L, W, B))
  else pts.push(P(L, -W, B), P(L, W, B))
  return pts
}
export const wallBox = (b) => ({ c: [b.x * J, GY + (b.h * J) / 2 - 0.2 * J, b.z * J], h: [(b.w * J) / 2, (b.h * J) / 2 + 0.2 * J, (b.d * J) / 2] })
// liegt (x, z) im Grundriss eines Gebäudes (Tests: Durchfahrt)?
export const inWall = (x, z, pad = 0, y = -Infinity) => STUNT.walls.some((b) => { const q = wallBox(b); return Math.abs(x - q.c[0]) < q.h[0] - pad && Math.abs(z - q.c[2]) < q.h[2] - pad && y < q.c[1] + q.h[1] - 0.1 * J })
// y gegeben: nur unterhalb des Dachs zählt (auf dem Dach stehen ist keine Durchfahrt – nach einem Hügelsprung landet der Wagen dort)


// Rampen-Zonen (Stufe F, P2-Zustände): Spur vor jedem Keil in Steigrichtung. u = Weg ab Rampenfuß (negativ = davor), e = Querabstand zur Spurmitte.
// capture [CAP0, CAP1) · commit [CAP1, Lippe) · release ab der Lippe (Luft). Breiten wie P2 (half capture 2,5 · commit 1,85), in J17-Metern.
export const ZONE = Object.freeze({ cap0: -14, cap1: -5, halfCapture: 2.5, halfCommit: 1.85, capWidth: 4.5 })
export function rampZone(x, z) {
  for (const r of STUNT.ramps) {
    const s = Math.sin(r.yaw), c = Math.cos(r.yaw), dx = x - r.x * J, dz = z - r.z * J, u = (dx * s + dz * c) / J, e = (dx * c - dz * s) / J, lip = r.len + (r.top || 0)
    if (u < ZONE.cap0 || u > lip || Math.abs(e) > ZONE.capWidth) continue
    return { id: r.id, u, e: e * J, dir: r.yaw, seg: u < ZONE.cap1 ? 'capture' : 'commit', half: (u < ZONE.cap1 ? ZONE.halfCapture : ZONE.halfCommit) * J, lip: lip * J }
  }
  return null
}
