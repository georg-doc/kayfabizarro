// WS-NPC Phase D2 · Gerücht, ein Schritt (WS0 V-602; Schema kfb.world-save/1 unverändert), ohne Browser:
//   Zeuge erzählt einem Dritten → told mit Quelle, Sicherheit eine Stufe unter „gesehen“ · höchstens einmal je Erzähler und Tag (am nächsten Tag wieder)
//   · wer nur gehört hat, erzählt nicht weiter (kein told-of-told) · wer nichts gesehen und nichts gehört hat, reagiert nicht (Begrüßung unverändert)
//   · wer es gehört hat, reagiert (Begrüßung „fight“) · Kappen 16 je Bewohner · Rundlauf ohne Reparatur
import { report } from './_report.mjs'
import { createNpcMemory, MEMORY } from '../../src/npc/npcMemory.js'
import { serializeWorldSave, parseWorldSave, WORLD_SAVE_LIMITS } from '../../src/world/worldSave.js'

const D = 300, m = createNpcMemory({ dayS: D }), C = {}
const before = { lk: m.greetPlayer('lorekeeper').why, witch: m.greetPlayer('witch_a').why }
// farmer_b sieht den KO eines Skeletts (Tag 0)
m.onGroupEvent({ type: 'ko', id: 'skel_rogue', group: 'skeleton_patrol', members: ['skel_warrior', 'skel_rogue', 'skel_mage'], at: [0, 0], residents: [{ id: 'farmer_b', x: 5, z: 0, near: true }], t: 30 })
const key = m.receipts('farmer_b').find((e) => e.kind === 'resident_downed').eventKey
const tp = m.topic('farmer_b', 'lorekeeper'), t1 = m.tell({ speaker: 'farmer_b', listener: 'lorekeeper', topic: tp, t: 60 })
const rcv = m.receipts('lorekeeper').find((e) => e.eventKey === key), seen = m.receipts('farmer_b').find((e) => e.eventKey === key)
C.toldWithSource = t1 && rcv?.mode === 'told' && rcv.from === 'farmer_b' && m.has('lorekeeper', key) === 'told'
C.lessSureThanSeen = rcv && seen && rcv.salience === seen.salience - 1 && seen.salience === MEMORY.salience.resident_downed
const t2 = m.tell({ speaker: 'farmer_b', listener: 'witch_a', topic: m.topic('farmer_b', 'witch_a'), t: 120 })
C.oncePerSpeakerPerDay = !t2 && m.has('witch_a', key) === null
const t3 = m.tell({ speaker: 'lorekeeper', listener: 'witch_a', topic: { eventKey: key, kind: 'resident_downed' }, t: 130 })
C.noRetellOfHearsay = !t3 && m.topic('lorekeeper', 'witch_a') === null && m.has('witch_a', key) === null
C.unawareDoesNotReact = before.witch === 'first' && m.greetPlayer('witch_a').why === 'first'
C.heardReacts = before.lk === 'first' && m.greetPlayer('lorekeeper').why === 'fight' && m.greetPlayer('farmer_b').why === 'fight'
const t4 = m.tell({ speaker: 'farmer_b', listener: 'witch_a', topic: m.topic('farmer_b', 'witch_a'), t: D + 40 })
C.nextDayAgain = t4 && m.has('witch_a', key) === 'told' && m.receipts('witch_a')[0].from === 'farmer_b'
// Kappen: 20 erzählte Dinge an einen Zuhörer (je Tag einer) → höchstens 16 bleiben
for (let d = 2; d < 22; d++) { const k = `grp:x:d${d}:ko:a`; m.onGroupEvent({ type: 'ko', id: 'a', group: 'x', members: ['a'], at: [0, 0], residents: [{ id: 'farmer_b', x: 0, z: 0, near: true }], t: d * D + 10 })
  m.tell({ speaker: 'farmer_b', listener: 'lorekeeper', topic: { eventKey: k, kind: 'resident_downed' }, t: d * D + 20 }) }
C.capped = m.receipts('lorekeeper').length <= WORLD_SAVE_LIMITS.perResident && m.receipts('farmer_b').length <= WORLD_SAVE_LIMITS.perResident
const rt = parseWorldSave(serializeWorldSave(m.state()))
C.roundTripClean = rt.status === 'ok' && rt.errors.length === 0
process.exit(report('unit-rumor (WS-NPC Phase D2, Gerücht ein Schritt)', C, { tp, rcv, seen: seen && { salience: seen.salience }, lk: m.receipts('lorekeeper').length, fb: m.receipts('farmer_b').length, rt: rt.errors }))
