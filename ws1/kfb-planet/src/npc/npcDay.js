// WS-NPC A0 · Tagesplan `kfb.npc-day/1` (Brief R2 Phase A: „Zeit → POI, Aktivität“) und POIs `kfb.npc-poi/1`. Rein: ohne three, ohne DOM, Node-geprüft.
// Fahrplan statt Simulation (SPEC_NPC_PATROL_R1 Punkt 2): planAt(t) rechnet aus Plan + Routen + Weltzeit exakt, wo ein Bewohner ist und was er tut –
// ohne Vorgeschichte. Darum stehen Bewohner nach Weggehen und Zurückkommen dort, wo der Plan sie sieht.
//   Tag d = floor(t / dayS). Eintrag i (at = Tagesanteil) heißt: zu dieser Zeit vom vorigen POI zum POI des Eintrags aufbrechen; Ankunft nach
//   Routenlänge / Tempo, danach die Aktivität bis zum nächsten Eintrag. Der letzte Eintrag läuft bis zum ersten des nächsten Tags.
//   Routen-Variante je (Tag, Eintrag) aus dem Seed des Bewohners (zwei Varianten je Weg, Brief Phase A) – gleicher Seed, gleicher Tag.
import { rngOf } from '../world/fluff.js'
import { createRoute } from './npcRoute.js'

export const DAY_SCHEMA = 'kfb.npc-day/1', POI_SCHEMA = 'kfb.npc-poi/1'
export const POI_KINDS = Object.freeze(['home', 'work', 'social'])
export const DAY_RULES = Object.freeze({ minActionR: 1.5, endTol: 0.05, minStayS: 4, speed: [0.6, 1.6] }) // V-496: Aktionsraum ≥ 1,5 m je POI

export function validatePoi(p) {
  const e = []
  if (!p || typeof p.id !== 'string') return ['poi: id fehlt']
  if (!POI_KINDS.includes(p.kind)) e.push(`${p.id}: kind ${p.kind}`)
  if (!Array.isArray(p.pos) || p.pos.length !== 2 || !p.pos.every(Number.isFinite)) e.push(`${p.id}: pos`)
  if (!(p.actionR >= DAY_RULES.minActionR)) e.push(`${p.id}: actionR < ${DAY_RULES.minActionR}`)
  if (!(Number.isFinite(p.face) || (Array.isArray(p.faceTo) && p.faceTo.length === 2))) e.push(`${p.id}: face/faceTo fehlt`)
  return e
}
export const poiYaw = (p) => (Number.isFinite(p.face) ? p.face : Math.atan2(p.faceTo[0] - p.pos[0], p.faceTo[1] - p.pos[1]))

export function validateDay(day, { pois = {}, routes = [], dayS } = {}) {
  const e = []
  if (!day || day.schema !== DAY_SCHEMA) return ['schema ≠ ' + DAY_SCHEMA]
  if (typeof day.residentId !== 'string' || !day.residentId) e.push('residentId')
  if (!Number.isInteger(day.seed)) e.push('seed')
  if (!(day.speed >= DAY_RULES.speed[0] && day.speed <= DAY_RULES.speed[1])) e.push('speed außerhalb ' + DAY_RULES.speed.join('–'))
  const E = day.entries || []
  if (E.length < 2) e.push('entries < 2')
  for (let i = 0; i < E.length; i++) {
    const it = E[i]
    if (!(it.at >= 0 && it.at < 1)) e.push(`entry ${i}: at`)
    if (i && !(it.at > E[i - 1].at)) e.push(`entry ${i}: at nicht aufsteigend`)
    if (!pois[it.poi]) e.push(`entry ${i}: POI ${it.poi} fehlt`)
    if (typeof it.activity !== 'string') e.push(`entry ${i}: activity`)
  }
  if (e.length) return e
  // Wege: jede Folge (vorheriger POI → POI) braucht ≥ 1 Route (≥ 2 Varianten, wenn die POIs verschieden sind); Enden auf den POIs; Reise passt ins Fenster
  for (let i = 0; i < E.length; i++) {
    const prev = E[(i - 1 + E.length) % E.length].poi, to = E[i].poi
    const gap = ((E[(i + 1) % E.length].at - E[i].at + 1) % 1 || 1) * (dayS ?? 1)
    if (prev === to) continue
    const vs = routes.filter((r) => r.from === prev && r.to === to)
    if (vs.length < 2) e.push(`Weg ${prev}→${to}: ${vs.length} Variante(n) < 2`)
    for (const r of vs) {
      const a = r.at(0), b = r.at(r.length), P = pois[prev].pos, Q = pois[to].pos
      if (Math.hypot(a.x - P[0], a.z - P[1]) > DAY_RULES.endTol || Math.hypot(b.x - Q[0], b.z - Q[1]) > DAY_RULES.endTol) e.push(`${r.id}: Enden nicht auf den POIs`)
      if (dayS && r.length / day.speed > gap - DAY_RULES.minStayS) e.push(`${r.id}: Reise ${(r.length / day.speed).toFixed(1)} s passt nicht in ${gap.toFixed(1)} s`)
    }
  }
  return e
}

// Routen aus Definitionen bauen (Map id → Route)
export const buildRoutes = (defs) => defs.map((d) => createRoute(d))

// Welche Variante an (Tag, Eintrag)? Gleicher Seed + Tag + Eintrag → gleiche Variante; Varianten sortiert nach id (stabil)
export function routeFor(day, routes, d, i) {
  const E = day.entries, prev = E[(i - 1 + E.length) % E.length].poi, to = E[i].poi
  if (prev === to) return null
  const vs = routes.filter((r) => r.from === prev && r.to === to).sort((a, b) => (a.id < b.id ? -1 : 1))
  if (!vs.length) return null
  const k = Math.floor(rngOf('npc-route', day.residentId, day.seed, d, i)() * vs.length)
  return vs[Math.min(vs.length - 1, k)]
}

// Plan zur Weltzeit t (Sekunden): { day, idx, slot, phase: 'travel' | 'stay', poi, from, activity, meet, x, z, yaw, routeId, s, progress,
//   depart, arrive, stayEnd } – alles in Weltsekunden; slot = stabiler Schlüssel `${residentId}:d${day}:e${idx}` (Begegnungs-IDs, Phase B)
export function planAt(day, { pois, routes, dayS }, t) {
  const E = day.entries, D = Math.floor(t / dayS), f = t - D * dayS
  let i = E.length - 1, d = D
  for (let k = 0; k < E.length; k++) if (E[k].at * dayS <= f) i = k
  if (E[0].at * dayS > f) { i = E.length - 1; d = D - 1 } // vor dem ersten Eintrag: letzter Eintrag des Vortags läuft noch
  const it = E[i], depart = d * dayS + it.at * dayS
  const nx = i + 1 < E.length ? d * dayS + E[i + 1].at * dayS : (d + 1) * dayS + E[0].at * dayS
  const poi = pois[it.poi], from = E[(i - 1 + E.length) % E.length].poi
  const r = routeFor(day, routes, d, i), travel = r ? r.length / day.speed : 0, arrive = depart + travel
  const base = { day: d, idx: i, slot: `${day.residentId}:d${d}:e${i}`, poi: it.poi, from, activity: it.activity, meet: it.meet ?? null, depart, arrive, stayEnd: nx, routeId: r?.id ?? null }
  if (r && t < arrive) { const p = r.at((t - depart) * day.speed); return { ...base, phase: 'travel', x: p.x, z: p.z, yaw: p.yaw, s: p.s, progress: p.u, speed: day.speed } }
  return { ...base, phase: 'stay', x: poi.pos[0], z: poi.pos[1], yaw: poiYaw(poi), s: r ? r.length : 0, progress: 1, speed: 0 }
}

// Gemeinsames Treffen zweier Pläne an einem Sozial-POI im selben Slot-Fenster: Beginn = spätere Ankunft, Ende = früheres Fenster-Ende.
// null, wenn sie sich (an diesem Tag) nicht treffen. Pläne verweisen gegenseitig über entry.meet.
export function meetingAt(dayA, dayB, ctx, t) {
  const a = planAt(dayA, ctx, t), b = planAt(dayB, ctx, t)
  const spot = (id) => ctx.pois[id]?.meetSpot ?? id
  if (a.meet !== dayB.residentId || b.meet !== dayA.residentId || spot(a.poi) !== spot(b.poi)) return null
  const start = Math.max(a.arrive, b.arrive), end = Math.min(a.stayEnd, b.stayEnd)
  if (!(end > start)) return null
  return { key: `meet:${[dayA.residentId, dayB.residentId].sort().join('+')}:d${a.day}:${spot(a.poi)}`, spot: spot(a.poi), start, end, a, b }
}
