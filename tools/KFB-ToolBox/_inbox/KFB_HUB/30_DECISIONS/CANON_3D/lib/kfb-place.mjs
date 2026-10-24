// CLI zu kfb-place-core v1: node kfb-place.mjs <seed> [biome] [out.json]  → Rezept für eine 64-m-Zelle (P0: Lichtung am Waldrand)
// Gelände hier nur als Platzhalter-Hang (Höhen-Owner liefert später das echte h(x,z)); --golden prüft gleichen Seed = gleichen Hash.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { placeChunk, recipeHash } from './kfb-place-core.v1.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const cfg = JSON.parse(readFileSync(join(here, 'kfb_place.r1.json'), 'utf8'))
const args = process.argv.slice(2), golden = args.includes('--golden'), pos = args.filter((a) => !a.startsWith('--'))
const seed = pos[0] || 'p0-lichtung', biome = pos[1] || 'moos', out = pos[2]
const terrain = { h: (x, z) => 0.06 * z + 0.6 * Math.sin(x / 9) * Math.cos(z / 11) }   // Platzhalter: sanfter Hang nach +z
const run = () => placeChunk({ cfg, seed, chunk: { x0: 0, z0: 0, size: 64 }, terrain, biome, stamps: [{ id: 'stumpf', recipe: 'stump_stamp', x: 30, z: 34 }] })
const r = run()
if (golden) { const a = recipeHash(r), b = recipeHash(run()); console.log(a === b ? `GOLDEN PASS ${a}` : `GOLDEN FAIL ${a} ≠ ${b}`); process.exit(a === b ? 0 : 1) }
if (out) writeFileSync(out, JSON.stringify(r, null, 1))
const k = r.instances.reduce((m, x) => ((m[x.role] = (m[x.role] || 0) + 1), m), {})
console.log(JSON.stringify({ hash: recipeHash(r), instances: r.instances.length, roles: k, groups: r.report.groups, zone: r.report.zone }, null, 1))
