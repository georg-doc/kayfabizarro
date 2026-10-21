// C3b (V-434/V-437, Brief WS1 Fundsachen-Demo R1) · Fundsachen im Gelände: Auswahl und Platzierung, rein (ohne three, ohne DOM), deterministisch (Seed), Node-geprüft
// (test/unit/loot.mjs). Häufig Essen, Süßes und Getränke, selten Werkzeug und Requisiten; gruppiert nach Platzierungs-Grammatik R2 (nest 1 : 3 : Rest, ungerade
// Gruppenzahl je Zone, Abstände ≥ 25 % Luft), nie auf dem Weg. Modelle: WSB B28 r2 (ersetzt seit 18.10. die KayKit/Tiny-Treats-Platzhalter).
import { rngOf } from './fluff.js'
import { nest } from './grammar.js'

// Beute: WSB B28 r2 (V-434/V-450, 53 öffentliche GLBs, CC0-Quellen) mit Beute-Tabelle loot_items.r2.json (byte-gleich, Branch assets/kfb-wsb-public-2026-10-18
// @0d9a632e). Seltenheit common/rare als Gewicht, Typ food/drink/sweet → häufig, tool_prop → selten; floatTilt (≥ 2:1 und Werkzeuge mit Griff) kippt 35°.
import TABLE from '../data/world/loot_items.r2.json' with { type: 'json' }
export const LOOT_PIN = '0d9a632ee5b2ef4577b95a852f05e0bbf76f7b5d'
const ICON = { food: 'candy', drink: 'potion', sweet: 'candy', tool_prop: 'spark' }
export const LOOT = Object.freeze(TABLE.items.map((it) => Object.freeze({ id: it.id, n: it.name_de, glb: it.glb, type: it.type === 'tool_prop' ? 'tool' : it.type, icon: ICON[it.type] || 'spark',
  w: it.rarity === 'rare' ? 0.12 : 1, rarity: it.rarity, tilt: !!it.floatTilt, size_m: it.size_m, sha256: it.sha256 })))
export const lootUrl = (it, pin = LOOT_PIN) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${pin}/media/3D_Assets/WSB_BLENDER/public_r1/B28/${it.glb}`
export const LOOT_RULES = Object.freeze({ groups: [3, 5], spread: 1.75, R0: 0.55, pathClear: 0.8, airK: 1.25, minRing: 2.5 })

// Abstand Punkt → Polylinie in xz
export function distToPath(x, z, pts) {
  let best = Infinity
  for (let i = 0; i + 1 < pts.length; i++) { const [ax, az] = pts[i], [bx, bz] = pts[i + 1], dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz, t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0
    best = Math.min(best, Math.hypot(x - (ax + t * dx), z - (az + t * dz))) }
  return best
}
const pick = (rng, table) => { const tot = table.reduce((a, t) => a + t.w, 0); let x = rng() * tot; for (const t of table) { x -= t.w; if (x < 0) return t } return table[table.length - 1] }

// zones: [{ zone, center: [x, z], r }] · path: { pts: [[x, z]…], halfW } · Ergebnis: [{ key, zone, id, n, icon, type, x, z, phase }]
export function placeLoot({ zones = [], path = null, seed = 0, table = LOOT, R = LOOT_RULES } = {}) {
  const out = []
  for (const Z of zones) {
    const rng = rngOf('loot', Z.zone, seed), groups = R.groups[Math.floor(rng() * R.groups.length)] // ungerade
    let g = 0, tries = 0
    while (g < groups && tries < 60) {
      tries++
      const a = rng() * Math.PI * 2, d = R.minRing + rng() * Math.max(0.1, Z.r - R.minRing), cx = Z.center[0] + Math.cos(a) * d, cz = Z.center[1] + Math.sin(a) * d
      const count = 1 + 2 * Math.floor(rng() * 3) // 1 / 3 / 5 je Gruppe (Anker, Stützen, Rest)
      const pts = nest([cx, 0, cz], [0, 1, 0], count, 1, { R0: R.R0, rng, spread: R.spread }).map((p) => [p.pt[0], p.pt[2]])
      if (path && pts.some(([x, z]) => distToPath(x, z, path.pts) < path.halfW + R.pathClear)) continue // nie auf dem Weg
      if (pts.some(([x, z]) => out.some((o) => Math.hypot(o.x - x, o.z - z) < R.R0 * 2 * R.airK))) continue // Luft zu anderen Gruppen
      const main = pick(rng, table)
      pts.forEach(([x, z], i) => { const it = i === 0 || rng() < 0.5 ? main : pick(rng, table)
        out.push({ key: `${Z.zone}:loot${g}:${i}`, zone: Z.zone, id: it.id, n: it.n, icon: it.icon, type: it.type, tilt: it.tilt, x: +x.toFixed(4), z: +z.toFixed(4), phase: +(rng() * Math.PI * 2).toFixed(4) }) })
      g++
    }
  }
  return out
}
