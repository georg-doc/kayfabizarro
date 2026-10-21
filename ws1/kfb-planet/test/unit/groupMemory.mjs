// WS-NPC Phase D3 (R0.6 §4, RECEIPT_KINDS Erweiterung 21.10.) · Gedächtnis der Gruppen-Ereignisse (npcMemory.onGroupEvent über kfb.world-save/1), ohne Browser:
//   Ereignisse aus einem echten groupPatrol-Lauf (3 Treffer, 2 KO, Aufstehen) → Mitglieder: hit_warning ×2, hostile_response, resident_downed (selbst
//   participated, die anderen observed), respawned · Bewohner in Sichtweite (≤ witnessR, in der Blase) observed, weiter weg nichts · idempotent ·
//   Weitererzählen nur aus erster Hand (Zeuge → told; wer nur gehört hat, erzählt nicht weiter) · Rundlauf ohne Reparatur
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { createGroupPatrol } from '../../src/npc/groupPatrol.js'
import { createNpcMemory, MEMORY } from '../../src/npc/npcMemory.js'
import { serializeWorldSave, parseWorldSave } from '../../src/world/worldSave.js'

const def = W.groups[0], DT = 1 / 60, ids = def.members.map((m) => m.id), T0 = 81
const g = createGroupPatrol(def), sp = g.plan(30)[0], P0 = { x: sp.x + Math.cos(sp.yaw) * 5, z: sp.z - Math.sin(sp.yaw) * 5, y: 0 }
const hits = { 1800: ids[0], 2040: ids[1], 2280: ids[2], 2640: ids[1], 2760: ids[0] }, events = []
for (let i = 0; i < 90 * 60; i++) { g.step(i * DT, DT, { player: P0, near: true, hits: hits[i] ? [hits[i]] : [] }); events.push(...g.drainEvents().filter((e) => e.type !== 'fluff')) }
const near = (id, d) => ({ id, x: P0.x + d, z: P0.z, near: true })
const residents = [near('farmer_b', 6), near('lorekeeper', MEMORY.witnessR + 20)]
const m = createNpcMemory({ dayS: W.dayS })
const feed = () => events.map((e) => m.onGroupEvent({ ...e, group: def.id, members: ids, residents, t: e.t + T0 }))
const first = feed(), n0 = m.state().npc.receipts.length, again = feed(), n1 = m.state().npc.receipts.length
const R = (id) => m.receipts(id), kinds = (id, mode) => R(id).filter((e) => !mode || e.mode === mode).map((e) => e.kind)
const ko = events.filter((e) => e.type === 'ko').map((e) => e.id)
const C = {
  eventsFromRun: events.filter((e) => e.type === 'hit').length === 5 && ko.length === 2 && events.filter((e) => e.type === 'awake').length === 2 && events.some((e) => e.type === 'aggro'),
  membersWarned: ids.every((id) => kinds(id, 'participated').filter((k) => k === 'hit_warning').length === 2),
  membersHostile: ids.every((id) => kinds(id, 'participated').includes('hostile_response')),
  downedSelfAndSeen: ko.every((id) => R(id).some((e) => e.kind === 'resident_downed' && e.mode === 'participated' && e.eventKey.endsWith(':ko:' + id)) && ids.filter((x) => x !== id).every((x) => R(x).some((e) => e.kind === 'resident_downed' && e.mode === 'observed' && e.eventKey.endsWith(':ko:' + id)))),
  respawned: ko.every((id) => kinds(id, 'participated').includes('respawned')),
  witnessNearOnly: kinds('farmer_b', 'observed').filter((k) => k === 'resident_downed').length === 2 && kinds('farmer_b').includes('hostile_response') && R('lorekeeper').length === 0,
  idempotent: n0 === n1 && again.every((x) => x.length === 0) && first.some((x) => x.length > 0),
  salience: R(ids[0]).find((e) => e.kind === 'resident_downed' && e.mode === 'participated')?.salience === 3 && R('farmer_b').find((e) => e.kind === 'hostile_response')?.salience === 2,
}
// Weitererzählen: farmer_b (Zeuge) erzählt lorekeeper das Wichtigste; lorekeeper (nur gehört) erzählt es niemandem weiter
const tp = m.topic('farmer_b', 'lorekeeper'), told = m.tell({ speaker: 'farmer_b', listener: 'lorekeeper', topic: tp, t: 100 + T0 })
C.tellFirstHand = tp?.kind === 'resident_downed' && told && m.has('lorekeeper', tp.eventKey) === 'told'
C.noRetell = m.topic('lorekeeper', 'witch_a') === null
const rt = parseWorldSave(serializeWorldSave(m.state()))
C.roundTripClean = rt.status === 'ok' && rt.errors.length === 0 && rt.state.npc.receipts.length === m.state().npc.receipts.length
process.exit(report('unit-groupMemory (WS-NPC Phase D3, Gruppen-Ereignisse im Gedächtnis)', C, { receipts: m.state().npc.receipts.length, byMember: Object.fromEntries(ids.map((id) => [id, kinds(id)])), farmer_b: kinds('farmer_b'), topic: tp, rt: rt.errors }))
