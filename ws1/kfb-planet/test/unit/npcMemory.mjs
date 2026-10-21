// WS-NPC Phase B (V-585) · Lean Memory über drei Spieltage mit dem echten Weltstand kfb.world-save/1 (src/world/worldSave.js, Owner WS1-Lead, Speicher
// im Arbeitsspeicher-Backend) und einem Neuladen. Ablauf:
//   Tag 0  Spieler trifft den Lorekeeper-Platzhalter (erste Begrüßung = nur bemerken)
//   Tag 1  Spieler trifft ihn wieder (kennt ihn → winkt); abends geht er am Fluffer vorbei (plague_seen), der Fluffer wird geheilt, er sieht es
//          (fluffer_cured, observed); Farmer B ist weit weg und erfährt nichts (kein allwissendes Wissen)
//   Tag 2  Begegnung am Wiesenrand: der Lorekeeper erzählt Farmer B davon (told, from = lorekeeper); danach trifft der Spieler Farmer B → sie jubelt
//   Neu laden: Belege bleiben, Begrüßung bleibt, dieselben Ereignisse ein zweites Mal ergeben keine Doppel; neu ist nur echte Weitergabe (told);
//   kfb.save/1 bleibt unberührt
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { buildRoutes, planAt, meetingAt } from '../../src/npc/npcDay.js'
import { createResidentSim } from '../../src/npc/residentSim.js'
import { createFlufferSim } from '../../src/npc/flufferSim.js'
import { createNpcMemory } from '../../src/npc/npcMemory.js'
import { createWorldSaveStore, memoryBackend, WORLD_SAVE_KEY } from '../../src/world/worldSave.js'

const ctx = { pois: Object.fromEntries(W.pois.map((p) => [p.id, p])), routes: buildRoutes(W.routes), dayS: W.dayS }, DT = 1 / 60, D = W.dayS
const fbD = W.days.find((d) => d.residentId === 'farmer_b'), lkD = W.days.find((d) => d.residentId === 'lorekeeper')
const backend = memoryBackend()
function session({ until, heal = true }) {
  const store = createWorldSaveStore({ backend }), mem = createNpcMemory({ store, dayS: D })
  const fl = createFlufferSim({ ...W.fluffers[0], t0: D + 0.84 * D - 40 })
  const greets = []
  const hooks = { greetPlayer: (id) => mem.greetPlayer(id), topic: (a, b) => mem.topic(a, b),
    onEvent: (e) => { if (e.type === 'playerNotice') { greets.push({ id: e.id, t: e.t }); mem.onPlayerNotice(e) } else if (e.type === 'threatNotice') mem.onThreatNotice(e)
      else if (e.type === 'encounterDone') mem.onEncounterDone(e); else if (e.type === 'told') mem.tell({ speaker: e.speaker, listener: e.listener, topic: e.topic, t: e.t }) } }
  const sim = createResidentSim({ days: W.days, ctx, activities: W.activities, hooks })
  // Spieler-Auftritte: kurz neben einem Bewohner (je 3 s), sonst weit weg
  const visits = [{ id: 'lorekeeper', at: 0.12 * D }, { id: 'lorekeeper', at: D + 0.12 * D }, { id: 'farmer_b', at: 2 * D + 0.46 * D }]
  const clips = []
  let healedAt = null
  for (let t = 0; t < until; t += DT) {
    const v = visits.find((x) => t >= x.at && t < x.at + 3), tgt = v ? sim.byId.get(v.id).out : null
    const player = tgt ? { x: tgt.x + 1.4, z: tgt.z + 1.0, y: 0 } : { x: 80, z: -80, y: 0 }
    const fs = fl.at(t), threat = fs.hostile ? { x: fs.x, z: fs.z, id: W.fluffers[0].id } : null
    const outs = sim.step(t, DT, { player, near: () => true, threat: () => threat })
    outs.forEach((o, i) => { if (o.clip && v && sim.brains[i].id === v.id && o.mode === 'player') clips.push({ id: v.id, clip: [].concat(o.clip.name)[0], why: o.greetWhy, day: Math.floor(t / D) }) })
    // Heilen 3 s nachdem der Lorekeeper den Fluffer bemerkt hat (er steht nah dabei)
    if (heal && healedAt === null && sim.byId.get('lorekeeper').state().stats.alerts > 0 && fs.target) { const st = sim.byId.get('lorekeeper').state(); if (t > (st.threatUntil ?? 0) - 1) { if (fl.heal(t)) { healedAt = t
      mem.onCured({ flufferId: W.fluffers[0].id, at: [fs.x, fs.z], residents: sim.brains.map((b) => ({ id: b.id, x: b.out.x, z: b.out.z, near: true })), t }) } } }
  }
  return { mem, clips, healedAt, sim }
}
const A = session({ until: 2 * D + 0.5 * D })
const m = A.mem, lk = 'lorekeeper', fb = 'farmer_b', cured = `fluffer:${W.fluffers[0].id}:cured`, seen = `fluffer:${W.fluffers[0].id}:seen`
const meet2 = meetingAt(fbD, lkD, ctx, 2 * D + 0.33 * D).key
const clipsBy = (id) => A.clips.filter((c) => c.id === id)
const n0 = m.state().npc.receipts.length
// Neu laden (gleiches Backend): Belege da, Begrüßung gleich; dieselben Ereignisse noch einmal → keine neuen Belege
const B = session({ until: 2 * D + 0.5 * D })
const n1 = B.mem.state().npc.receipts.length, ids0 = new Set(m.state().npc.receipts.map((e) => e.id)), R1 = B.mem.state().npc.receipts
const fresh = R1.filter((e) => !ids0.has(e.id)), noDupes = new Set(R1.map((e) => e.id)).size === R1.length
process.exit(report('unit-npcMemory (WS-NPC Phase B, Lean Memory über worldSave)', {
  firstGreetOnlyNotice: clipsBy(lk)[0]?.why === 'first' && clipsBy(lk)[0]?.clip === 'Idle_B',
  secondGreetWaves: clipsBy(lk)[1]?.why === 'known' && clipsBy(lk)[1]?.clip === 'Waving',
  witnessSawPlague: m.has(lk, seen) === 'observed',
  witnessSawCure: A.healedAt !== null && m.has(lk, cured) === 'observed',
  farAwayDidNotSee: !m.receipts(fb).some((e) => e.eventKey === seen || (e.eventKey === cured && e.mode !== 'told')),
  toldAtNextMeeting: m.has(fb, cured) === 'told' && m.receipts(fb).find((e) => e.eventKey === cured).from === lk,
  encounterIsExperienceOfBoth: m.has(fb, meet2) === 'participated' && m.has(lk, meet2) === 'participated',
  changedGreetingAfterTold: clipsBy(fb)[0]?.why === 'cure' && clipsBy(fb)[0]?.clip === 'Cheering',
  reloadKeepsReceipts: B.mem.loadStatus === 'loaded' && n0 > 0 && [...ids0].every((id) => R1.some((e) => e.id === id)) && noDupes,
  reloadOnlyNewTelling: fresh.every((e) => e.mode === 'told' && e.residentId === fb && e.from === lk && e.kind === 'plague_seen'),
  reloadKeepsGreeting: B.clips.filter((c) => c.id === lk)[0]?.why !== 'first' && B.mem.greetPlayer(fb).why === 'cure',
  playerSaveUntouched: backend.get('kfb.save') == null && backend.get(WORLD_SAVE_KEY) != null,
  noTranscript: m.state().npc.receipts.every((e) => Object.keys(e).every((k) => ['id', 'residentId', 'eventKey', 'kind', 'mode', 'with', 'day', 't', 'salience', 'from'].includes(k))),
}, { receipts: m.state().npc.receipts.map((e) => `${e.residentId}:${e.kind}:${e.mode}${e.from ? '<' + e.from : ''}@d${e.day}`), clips: A.clips, reClips: B.clips.slice(0, 3), healedAt: A.healedAt && +A.healedAt.toFixed(2), n0, n1, fresh: fresh.map((e) => `${e.residentId}:${e.kind}:${e.mode}<${e.from}`) }))
