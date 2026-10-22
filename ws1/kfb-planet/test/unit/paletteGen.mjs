// V-619 · Prozedurale Biom-Farbplatten (Georg 22.10.): je Familie 50 Seeds – deterministisch, gültige Hexfarben, Platten unterscheidbar
// (kleinster OKLab-Abstand zweier Flächenrollen ≥ 0,04, kleinster Helligkeitsabstand ≥ 0,03), nie Neon (Chroma ≤ 0,2).
import BD from '../../src/data/worlds/kfb-biome-drive.r1.json' with { type: 'json' }
import { generatePalette, plateStats, ROLES } from '../../src/look/paletteGen.js'
let fail = 0, n = 0, worst = { dE: 9, dL: 9, C: 0 }
for (const [k, fam] of Object.entries(BD.paletteGen.families)) for (let s = 0; s < 50; s++) {
  const P = generatePalette({ ...fam, key: k }, s), Q = generatePalette({ ...fam, key: k }, s), st = plateStats(P); n++
  if (JSON.stringify(P) !== JSON.stringify(Q) || !ROLES.every((r) => /^#[0-9a-f]{6}$/.test(P[r]))) { fail++; console.log('nicht deterministisch/ungültig', k, s) }
  worst = { dE: Math.min(worst.dE, st.minDeltaE), dL: Math.min(worst.dL, st.minDeltaL), C: Math.max(worst.C, st.maxChroma) }
  if (st.minDeltaE < 0.04 || st.minDeltaL < 0.03 || st.maxChroma > 0.2) { fail++; console.log('Platten', k, s, JSON.stringify(st)) }
}
console.log(JSON.stringify({ palettes: n, worst }))
console.log(fail ? 'FAIL paletteGen' : 'PASS paletteGen'); process.exit(fail ? 1 : 0)
