// WS-NPC Phase B · Weltstand kfb.world-save/1 mit NPC-Belegen (Schema WS-NPC 21.10.): idempotentes Hinzufügen, Kappen (salience, dann alt),
// Zeuge vs. Nicht-Zeuge, told-Kette, Reparatur kaputter Einträge, Rundlauf bitgleich, kaputt/Zukunft, Spieler-Save unberührt. Ohne Browser.
import { report } from './_report.mjs'
import { WORLD_SAVE_SCHEMA, WORLD_SAVE_LIMITS, freshWorldSave, serializeWorldSave, parseWorldSave, validateWorldSave, createWorldSaveStore, memoryBackend, addReceipt, receiptsOf, knows, receiptId } from '../../src/world/worldSave.js'
import { SAVE_KEY, createSaveStore } from '../../src/world/save.js'

const NOW = Date.parse('2026-10-21T08:00:00Z'), EV = 'enc:farmer_harke+adventurer-mage:d3:social1'
const R = (o) => ({ residentId: 'farmer_harke', eventKey: EV, kind: 'met', mode: 'participated', with: ['adventurer-mage'], day: 3, t: 0.4, salience: 2, ...o })
let ws = freshWorldSave(NOW)
let a = addReceipt(ws, R()); ws = a.ws
const again = addReceipt(ws, R({ salience: 1 }))   // gleiches Ereignis → kein zweiter Eintrag
ws = addReceipt(ws, R({ residentId: 'adventurer-mage', with: ['farmer_harke'] })).ws
const toldOk = addReceipt(ws, R({ residentId: 'lorekeeper', mode: 'told', from: 'farmer_harke', with: [], salience: 1 })); ws = toldOk.ws
const toldBad = addReceipt(ws, R({ residentId: 'witch_a', mode: 'told', from: 'skeleton_1', with: [], eventKey: EV }))   // Quelle hat das nicht erlebt
const idem = a.added && !again.added && receiptsOf(ws, 'farmer_harke').length === 1
const witness = knows(ws, 'farmer_harke', EV) === 'participated' && knows(ws, 'lorekeeper', EV) === 'told' && knows(ws, 'witch_a', EV) === null && !toldBad.added

// Erweiterung R0.6 Phase D: neue kind angenommen, unbekannte weiter abgelehnt
const phaseD = ['hit_warning', 'hostile_response', 'resident_downed', 'respawned'].map((kind, i) => addReceipt(freshWorldSave(NOW), R({ residentId: 'skel_warrior', kind, eventKey: 'grp:d' + i, with: ['player'] })))
const kindsD = phaseD.every((x) => x.added && x.ws.npc.receipts[0].kind === ['hit_warning', 'hostile_response', 'resident_downed', 'respawned'][phaseD.indexOf(x)]) && !addReceipt(freshWorldSave(NOW), R({ kind: 'telepathy', eventKey: 'zz2' })).added

// Kappen je Bewohner: 16, niedrigste salience fliegt zuerst, dann der älteste
let cap = freshWorldSave(NOW); for (let i = 0; i < 20; i++) cap = addReceipt(cap, R({ eventKey: 'ev' + i, day: i, salience: i < 4 ? 0 : 2 })).ws
const capList = receiptsOf(cap, 'farmer_harke'), capOk = capList.length === WORLD_SAVE_LIMITS.perResident && capList.every((e) => e.salience === 2)

// Reparatur: kaputte Einträge verworfen, Duplikate zusammengelegt, unbekannte kind raus
const half = parseWorldSave(JSON.stringify({ ...ws, npc: { v: 1, receipts: [...ws.npc.receipts, ws.npc.receipts[0], { residentId: 'X Y', eventKey: 'e', kind: 'met', mode: 'observed', day: 1, t: 0.1 }, R({ kind: 'telepathy', eventKey: 'zz' }), R({ eventKey: 'tt', t: 3 })] } }))
const repaired = half.status === 'repaired' && half.state.npc.receipts.length === ws.npc.receipts.length

const text = serializeWorldSave(ws, { now: NOW }), back = parseWorldSave(text), roundTrip = back.status === 'ok' && serializeWorldSave(back.state, { now: NOW }) === text
const bad = ['{', 'null', '42', '[1]', '{"schema":"kfb.world-save/1","version":"eins"}'].map((t) => parseWorldSave(t))
const future = parseWorldSave(JSON.stringify({ ...ws, version: 9 }))
const be = memoryBackend({ 'kfb.world-save': '{kaputt' }), st = createWorldSaveStore({ backend: be, now: NOW }), l1 = st.load(), saved = st.save(ws)
const be2 = memoryBackend({ 'kfb.world-save': JSON.stringify({ ...ws, version: 7 }) }), st2 = createWorldSaveStore({ backend: be2, now: NOW }); st2.load(); const blocked = st2.save(ws)
const pBe = memoryBackend(), ps = createSaveStore({ backend: pBe, now: NOW }); ps.save(ps.load().state); createWorldSaveStore({ backend: pBe, now: NOW }).save(ws)
const playerUntouched = Object.keys(pBe.dump()).sort().join(',') === [SAVE_KEY, 'kfb.world-save'].sort().join(',') && JSON.parse(pBe.dump()[SAVE_KEY]).schema === 'kfb.save/1'

process.exit(report('world-save', {
  schema: ws.schema === WORLD_SAVE_SCHEMA && ws.npc.v === 1,
  idempotent: idem && ws.npc.receipts[0].id === receiptId('farmer_harke', EV, 'participated'),
  witnessVsNot: witness,
  toldChain: toldOk.added,
  kindsPhaseD: kindsD,
  capPerResident: capOk,
  repaired,
  roundTripBitEqual: roundTrip,
  badInputsFresh: bad.every((r) => r.status === 'corrupt' && r.state.schema === WORLD_SAVE_SCHEMA),
  futureNotTouched: future.status === 'future' && blocked.ok === false,
  corruptBackedUp: l1.status === 'corrupt' && l1.backup === 'kfb.world-save.bak' && saved.ok,
  playerSaveUntouched: playerUntouched,
  noFreeText: !JSON.stringify(ws).includes('"about"'),
}, { receipts: ws.npc.receipts.length, halfErrors: half.errors }))
