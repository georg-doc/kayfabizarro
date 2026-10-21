// WS-NPC A1 · Hindernisse der M1-Welt für die Prüfung von POIs und Routen (rein, Node-geprüft in test/unit/npcWorld.mjs).
// Spiegel der Werte aus src/m1/M1World.jsx (HARVEST_ZONES, DEMO_PATH, LOOT_ZONES; JSX ist in Node nicht ladbar) und der Baumstellen-Formel aus
// src/modules/orchard3d.js (createOrchard3d, Ring um den Anker-Baum). Der Browser-Test test/npc-a.mjs vergleicht den Spiegel mit dem laufenden
// Spiel (mods.orchard.trees(), mods.found, mods.lanterns): weicht der Spielstand ab, FAILt er – dann hier nachziehen.
import { rngOf } from '../world/fluff.js'
import { placeLoot } from '../world/loot.js'
import { WORLD_K as K } from '../worldScale.js'

export const MIRROR = Object.freeze({
  harvestZones: [{ zone: 'goblin', center: [-26 * K, 46 * K], seed: 3 }, { zone: 'atlantis', center: [26 * K, 46 * K], seed: 5 }, { zone: 'utopia', center: [0, 74 * K], seed: 7 }],
  demoPath: { pts: [[0, 30 * K], [0, 44 * K], [-14 * K, 50 * K], [-26 * K, 46 * K]], halfW: 1.3 },
  lootZones: [{ zone: 'wiese', center: [9 * K, 40 * K], r: 9 }, { zone: 'goblin', center: [-26 * K, 46 * K], r: 12 }, { zone: 'atlantis', center: [26 * K, 46 * K], r: 12 }, { zone: 'utopia', center: [0, 74 * K], r: 12 }],
  lootSeed: 18, trees: 5, spacing: [5.5, 8.5], lanterns: { n: 8, offset: 0.9 },
})

// Baumstellen wie orchard3d (gleiche Zufallsfolge: Winkel, Radius ab dem zweiten Baum, Drehung, Modell)
export function orchardTreesXZ(M = MIRROR) {
  const out = []
  for (const Z of M.harvestZones) {
    const rng = rngOf('orchard', Z.zone, Z.seed ?? 0), n = M.trees
    for (let i = 0; i < n; i++) {
      const a = (i / Math.max(1, n - 1)) * Math.PI * 2 + rng() * 0.9, r = i === 0 ? 0 : M.spacing[0] + rng() * (M.spacing[1] - M.spacing[0])
      rng(); rng() // Drehung, Modell
      out.push({ ref: `orchard:${Z.zone}:t${i}`, x: Z.center[0] + Math.cos(a) * r, z: Z.center[1] + Math.sin(a) * r })
    }
  }
  return out
}

// Laternen wie gemLanterns.lanternsAlongPath (nur xz)
export function lanternsXZ(M = MIRROR) {
  const path = M.demoPath, P = path.pts, seg = P.slice(1).map((b, i) => { const a = P[i]; return { a, b, L: Math.hypot(b[0] - a[0], b[1] - a[1]) } }), total = seg.reduce((s, x) => s + x.L, 0), out = []
  const dist = (x, z) => Math.min(...seg.map(({ a, b }) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz, t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L)); return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t) }))
  const { n, offset } = M.lanterns
  for (let k = 0; k < n; k++) {
    let d = (k + 0.5) / n * total, i = 0; while (i < seg.length - 1 && d > seg[i].L) { d -= seg[i].L; i++ }
    const { a, b, L } = seg[i], u = Math.min(1, d / L), tx = (b[0] - a[0]) / L, tz = (b[1] - a[1]) / L, w = path.halfW + offset
    const at = (side) => [a[0] + (b[0] - a[0]) * u - tz * w * side, a[1] + (b[1] - a[1]) * u + tx * w * side]
    let side = k % 2 ? 1 : -1, [x, z] = at(side)
    if (dist(x, z) < path.halfW + offset * 0.6) { side = -side; [x, z] = at(side) }
    out.push({ x, z })
  }
  return out
}

export function npcWorldObstacles(M = MIRROR) {
  return { trees: orchardTreesXZ(M), loot: placeLoot({ zones: M.lootZones, path: M.demoPath, seed: M.lootSeed }).map((l) => ({ key: l.key, x: l.x, z: l.z })), lanterns: lanternsXZ(M) }
}
