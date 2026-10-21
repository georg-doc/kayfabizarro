// WS-NPC A1 · Daten der Bewohner (src/data/npc/residents.r1.json) gegen die echte M1-Welt (#m1,harvest): POIs mit Aktionsraum ≥ 1,5 m (V-496),
// Ziel-Baum in Reichweite, Routen frei von Stämmen, Fundsachen, Laternen, Rang-Zaun und vorderem Theaterring, Steigung begrenzt; Tagespläne gültig,
// beide Routen-Varianten werden benutzt, gleicher Seed = gleicher Tag, das Treffen findet jeden Tag statt und fasst die Begegnungs-Grammatik.
// Baumstellen und Fundsachen werden wie im Spiel deterministisch berechnet (orchard3d bzw. loot.placeLoot); der Browser-Test npc-a prüft die
// Baumstellen zusätzlich gegen mods.orchard.trees().
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { buildRoutes, validateDay, validatePoi, planAt, meetingAt, routeFor } from '../../src/npc/npcDay.js'
import { distPointSeg } from '../../src/npc/npcRoute.js'
import { createEncounterHost, EncounterBeatBus } from '../../src/npc/encounterBus.js'
import { npcWorldObstacles } from '../../src/npc/npcWorld.js'
import { inRankFence, rankFenceClear } from '../../src/m1/m1Host.js'
import { terrainHeight } from '../../src/modules/m1-terrain.js'

const pois = Object.fromEntries(W.pois.map((p) => [p.id, p])), routes = buildRoutes(W.routes), ctx = { pois, routes, dayS: W.dayS }
const OB = npcWorldObstacles()
const C = { trunk: 0.9, loot: 0.6, lantern: 0.6, fence: 0.6, ringR: 7.4, slopeDeg: 22 }
const dayOf = (id) => W.days.find((d) => d.residentId === id)
const bad = []; const ALL = process.argv.includes("--all")
// POIs
for (const p of W.pois) {
  for (const e of validatePoi(p)) bad.push('poi ' + e)
  const [x, z] = p.pos, tgt = p.target?.ref
  for (const t of OB.trees) { const d = Math.hypot(t.x - x, t.z - z); if (t.ref === tgt) { if (d < p.target.reach[0] || d > p.target.reach[1]) bad.push(`${p.id}: Ziel ${t.ref} ${d.toFixed(2)} m außerhalb Reichweite`) } else if (d < p.actionR) bad.push(`${p.id}: Baum ${t.ref} ${d.toFixed(2)} m im Aktionsraum`) }
  for (const l of OB.loot) if (Math.hypot(l.x - x, l.z - z) < p.actionR) bad.push(`${p.id}: Fundsache ${l.key} im Aktionsraum`)
  for (const l of OB.lanterns) if (Math.hypot(l.x - x, l.z - z) < p.actionR) bad.push(`${p.id}: Laterne im Aktionsraum`)
  for (const q of W.pois) if (q !== p && q.meetSpot !== p.meetSpot && Math.hypot(q.pos[0] - x, q.pos[1] - z) < p.actionR + q.actionR) bad.push(`${p.id}: POI ${q.id} überlappt`)
  if (inRankFence(x, z) || rankFenceClear(x, z) < p.actionR) bad.push(`${p.id}: zu nah am Rang-Zaun`)
  if (Math.hypot(x, z) < C.ringR) bad.push(`${p.id}: im Theaterring`)
}
// Routen
let minTrunk = Infinity, minLoot = Infinity, minLantern = Infinity, minFence = Infinity, maxSlope = 0
for (const r of routes) {
  const s = r.sample(0.25), ends = [pois[r.from], pois[r.to]].map((p) => p.target?.ref).filter(Boolean)
  for (const p of s) {
    for (const t of OB.trees) { const d = Math.hypot(t.x - p.x, t.z - p.z); if (ends.includes(t.ref) && d >= 1.0) continue; if (!ends.includes(t.ref)) minTrunk = Math.min(minTrunk, d); if (d < (ends.includes(t.ref) ? 1.0 : C.trunk)) bad.push(`${r.id}: Stamm ${t.ref} ${d.toFixed(2)} m bei s=${p.s.toFixed(1)}`) }
    for (const l of OB.loot) { const d = Math.hypot(l.x - p.x, l.z - p.z); minLoot = Math.min(minLoot, d); if (d < C.loot) bad.push(`${r.id}: Fundsache ${l.key} ${d.toFixed(2)} m`) }
    for (const l of OB.lanterns) { const d = Math.hypot(l.x - p.x, l.z - p.z); minLantern = Math.min(minLantern, d); if (d < C.lantern) bad.push(`${r.id}: Laterne ${d.toFixed(2)} m`) }
    const fc = rankFenceClear(p.x, p.z); minFence = Math.min(minFence, fc); if (inRankFence(p.x, p.z) || fc < C.fence) bad.push(`${r.id}: Zaun bei s=${p.s.toFixed(1)}`)
    if (Math.hypot(p.x, p.z) < C.ringR) bad.push(`${r.id}: Theaterring bei s=${p.s.toFixed(1)}`)
    if (Math.abs(p.x) < 1.6 && p.z > 4 && p.z < 14.6) bad.push(`${r.id}: Bühnenrampe`)
  }
  for (let i = 1; i < s.length; i++) { const dh = terrainHeight(s[i].x, s[i].z) - terrainHeight(s[i - 1].x, s[i - 1].z), dl = Math.hypot(s[i].x - s[i - 1].x, s[i].z - s[i - 1].z); if (dl > 1e-3) maxSlope = Math.max(maxSlope, Math.atan2(Math.abs(dh), dl) * 180 / Math.PI) }
}
// Tagespläne
for (const d of W.days) for (const e of validateDay(d, ctx)) bad.push(`${d.residentId}: ${e}`)
const fb = dayOf('farmer_b'), lk = dayOf('lore_ph')
const used = new Set(); for (const d of W.days) for (let day = 0; day < 12; day++) for (let i = 0; i < d.entries.length; i++) { const r = routeFor(d, routes, day, i); if (r) used.add(r.id) }
const pairs = new Set(W.routes.map((r) => r.from + '>' + r.to)), bothVariants = [...pairs].every((p) => W.routes.filter((r) => r.from + '>' + r.to === p).every((r) => used.has(r.id)))
const host = createEncounterHost({ bus: new EncounterBeatBus(), grammar: 'kfb' }), need = host.totalSeconds('greet') + 1
const meets = []; for (let day = 0; day < 8; day++) { const t = day * W.dayS + 0.33 * W.dayS; meets.push(meetingAt(fb, lk, ctx, t)) }
// Plan-Stetigkeit: Lage springt nie (≤ Tempo · dt + Eckenrundung) über drei Tage
let maxJump = 0; for (const d of W.days) { let prev = null; for (let t = 0; t < 3 * W.dayS; t += 1 / 30) { const p = planAt(d, ctx, t); if (prev) maxJump = Math.max(maxJump, Math.hypot(p.x - prev.x, p.z - prev.z)); prev = p } }
const same = JSON.stringify([0, 77, 151.5, 400, 899].map((t) => planAt(fb, ctx, t))) === JSON.stringify([0, 77, 151.5, 400, 899].map((t) => planAt(fb, ctx, t)))
const otherSeed = (() => { const f2 = { ...fb, seed: fb.seed + 1 }; let diff = 0; for (let day = 0; day < 12; day++) for (let i = 0; i < fb.entries.length; i++) if (routeFor(fb, routes, day, i)?.id !== routeFor(f2, routes, day, i)?.id) diff++; return diff })()

process.exit(report('unit-npcWorld (WS-NPC A1, POIs/Routen/Pläne in der M1-Welt)', {
  noViolations: bad.length === 0,
  poisHaveActionSpace: W.pois.every((p) => p.actionR >= 1.5),
  twoVariantsPerWay: [...pairs].every((p) => W.routes.filter((r) => r.from + '>' + r.to === p).length >= 2),
  bothVariantsUsedOver12Days: bothVariants,
  slopeWalkable: maxSlope <= C.slopeDeg,
  meetsEveryDay: meets.every((m) => m && m.end - m.start >= need),
  planContinuous: maxJump <= Math.max(fb.speed, lk.speed) / 30 + 0.05,
  deterministic: same,
  otherSeedOtherRoutes: otherSeed > 0,
  placeholdersMarked: W.residents.every((r) => !('placeholder' in r) || /PLATZHALTER/.test(r.placeholder)) && /PLATZHALTER/.test(W.residents.find((r) => r.residentId === 'lore_ph').placeholder),
  farmerIsRealFigure: W.residents.find((r) => r.residentId === 'farmer_b').stageCastId === 'farmer-b' && !('placeholder' in W.residents.find((r) => r.residentId === 'farmer_b')),
}, { bad: ALL ? bad : bad.slice(0, 20), minTrunk: +minTrunk.toFixed(2), minLoot: +minLoot.toFixed(2), minLantern: +minLantern.toFixed(2), minFence: +minFence.toFixed(2), maxSlope: +maxSlope.toFixed(1),
  meetWindows: meets.map((m) => m && +(m.end - m.start).toFixed(1)), need: +need.toFixed(2), routesUsed: used.size, routes: routes.length, otherSeed, lengths: Object.fromEntries(routes.map((r) => [r.id, +r.length.toFixed(1)])) }))
