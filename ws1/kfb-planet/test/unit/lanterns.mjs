// V-487 Stufe 3 · Laternen-Plätze ohne Browser: n Laternen gleichmäßig über den Weg, nie auf dem Weg (Abstand zur Mittellinie ≥ halfW + 0,5), links/rechts und
// Rubin/Saphir im Wechsel, Höhe aus dem Gelände.
import { report } from './_report.mjs'
import { lanternsAlongPath } from '../../src/modules/gemLanterns.js'
const path = { pts: [[0, 0], [0, 10], [-6, 14], [-12, 12]], halfW: 1.3 }
const L = lanternsAlongPath(path, { n: 8, terrainH: (x, z) => 0.1 * x + 0.05 * z })
const segD = (p, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz))); return Math.hypot(p[0] - a[0] - u * dx, p[1] - a[1] - u * dz) }
const dmin = L.map((l) => Math.min(...path.pts.slice(1).map((b, i) => segD([l.pos[0], l.pos[2]], path.pts[i], b))))
process.exit(report('unit-lanterns (V-487/3)', {
  count: L.length === 8,
  offPath: dmin.every((d) => d >= path.halfW + 0.5),
  alternating: L.every((l, i) => l.preset === (i % 2 ? 'sapphire' : 'ruby')),
  onTerrain: L.every((l) => Math.abs(l.pos[1] - (0.1 * l.pos[0] + 0.05 * l.pos[2])) < 1e-9),
}, { dmin: dmin.map((d) => +d.toFixed(2)) }))
