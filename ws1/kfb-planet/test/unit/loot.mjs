// C3b (V-434/V-437) · Fundsachen-Platzierung: deterministisch, ungerade Gruppenzahl je Zone, 1/3/5 Stücke je Gruppe, nie auf dem Weg (Abstand ≥ Halbbreite + 0,8 m),
// Luft zwischen Gruppen, Essen/Süßes/Getränke häufig, Werkzeug selten (über viele Seeds), Adressen fest gepinnt (kein main-Link).
import { report } from './_report.mjs'
import { placeLoot, distToPath, LOOT, lootUrl, LOOT_PIN } from '../../src/world/loot.js'
const path = { pts: [[0, 19], [0, 29], [-9, 33], [-17, 30]], halfW: 1.3 }
const zones = [{ zone: 'wiese', center: [6, 26], r: 9 }, { zone: 'goblin', center: [-17, 30], r: 12 }, { zone: 'atlantis', center: [17, 30], r: 12 }]
const a = placeLoot({ zones, path, seed: 18 }), b = placeLoot({ zones, path, seed: 18 }), c = placeLoot({ zones, path, seed: 19 })
const groups = {}; for (const it of a) { const g = it.key.split(':').slice(0, 2).join(':'); (groups[g] ||= []).push(it) }
const perZone = {}; for (const g of Object.keys(groups)) { const z = g.split(':')[0]; perZone[z] = (perZone[z] || 0) + 1 }
let food = 0, tool = 0; for (let s = 0; s < 200; s++) for (const it of placeLoot({ zones, path, seed: s })) { if (it.type === 'tool') tool++; else food++ }
const minPath = Math.min(...a.map((it) => distToPath(it.x, it.z, path.pts)))
process.exit(report('unit-loot (C3b V-434)', {
  deterministic: JSON.stringify(a) === JSON.stringify(b) && JSON.stringify(a) !== JSON.stringify(c),
  oddGroupsPerZone: Object.values(perZone).every((n) => n % 2 === 1) && Object.keys(perZone).length === zones.length,
  groupSizes135: Object.values(groups).every((g) => [1, 3, 5].includes(g.length)),
  neverOnPath: minPath >= path.halfW + 0.8 - 1e-9,
  foodOftenToolsRare: food > tool * 5 && tool > 0,
  phasesDiffer: new Set(a.map((it) => it.phase)).size === a.length,
  urlsPinned: LOOT.every((t) => lootUrl(t).includes('/' + LOOT_PIN + '/') && !lootUrl(t).includes('/main/')),
}, { items: a.length, perZone, food, tool, minPath: +minPath.toFixed(3) }))
