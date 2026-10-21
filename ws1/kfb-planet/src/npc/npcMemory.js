// WS-NPC Phase B (V-585, Brief R2 Phase B; Speicher-Owner WS1-Lead: src/world/worldSave.js, kfb.world-save/1) · Lean Memory der Bewohner, rein, Node-geprüft
// (test/unit/npcMemory.mjs). Ein Beleg je bedeutendem Erlebnis, jeweils mit der Wissensform (gesehen / beteiligt / erzählt), nie allwissend:
//   Begegnung zweier Bewohner fertig        → beide participated, kind greeted|silent, eventKey = Treffen (meet:…:d<Tag>:<Ort>)
//   Bewohner bemerkt den Spieler             → participated interrupted_by_player (einmal je Plan-Slot)
//   Bewohner bemerkt einen feindlichen Fluffer → observed plague_seen (einmal je Fluffer)
//   Fluffer geheilt                          → observed fluffer_cured NUR für Bewohner in Sichtweite (Radius, in der Spielerblase)
//   Gruppe (Phase D3, R0.6): Treffer 1/2 → alle Mitglieder participated hit_warning · Aggro → alle participated hostile_response, Bewohner in Sichtweite
//   observed · KO → das Mitglied participated resident_downed, die anderen und Bewohner in Sichtweite observed · Aufstehen → participated respawned
//   (eventKey grp:<Gruppe>:d<Tag>:…, je Tag einmal, idempotent)
//   In der nächsten Begegnung erzählt, wer etwas gesehen hat, dem, der es nicht weiß → told (from = Erzähler), ein Thema je Begegnung
// Daraus abgeleitet (nicht gespeichert): die Begrüßung des Spielers. Unbekannt → nur bemerken (Idle_B); kennt den Spieler → winkt (Waving);
// hat die Heilung gesehen oder davon gehört → jubelt (Cheering); hat den Kampf mit den Skeletten gesehen oder davon gehört → erzählt davon (Interact).
// Gerücht (V-602): erzählt wird nur Selbsterlebtes (ein Schritt), mit Quelle, eine Stufe weniger sicher, höchstens einmal je Erzähler und Tag. Kit-Clips as-is (Rig_Medium General/Simulation).
// Weltzeit wird nicht gespeichert: Tag/Anteil kommen aus der Sitzung (gleiche Schlüssel → idempotent, kein doppelter Beleg).
import { freshWorldSave, addReceipt, receiptsOf, knows } from '../world/worldSave.js'

// topics: was erzählt wird, wichtigstes zuerst; nur aus erster Hand (told-of-told ist im Schema kfb.world-save/1 nicht erlaubt, Gerücht-Ketten = WS0-Frage)
export const MEMORY = Object.freeze({ witnessR: 25, topics: ['fluffer_cured', 'resident_downed', 'hostile_response', 'plague_seen'],
  salience: { greeted: 1, silent: 1, interrupted_by_player: 1, plague_seen: 2, fluffer_cured: 3, hit_warning: 1, hostile_response: 2, resident_downed: 3, respawned: 1 } })

export function createNpcMemory({ store = null, ws = null, dayS = 300 } = {}) {
  let state = ws || (store ? store.load().state : freshWorldSave())
  const loadStatus = store && !ws ? 'loaded' : 'fresh'
  const log = []
  const when = (t) => ({ day: Math.max(0, Math.floor(t / dayS)), t: Math.min(1, Math.max(0, (t - Math.floor(t / dayS) * dayS) / dayS)) })
  function record(r, t) {
    const res = addReceipt(state, { ...r, ...when(t), salience: r.salience ?? MEMORY.salience[r.kind] ?? 1 })
    if (res.added) { state = res.ws; log.push({ t: +t.toFixed(3), residentId: r.residentId, kind: r.kind, mode: r.mode, eventKey: r.eventKey, from: r.from ?? null }); if (log.length > 80) log.shift(); store?.save(state) }
    return res.added
  }
  const has = (id, eventKey) => knows(state, id, eventKey)
  const knowsPlayer = (id) => receiptsOf(state, id).some((e) => e.with.includes('player') || e.kind === 'player_greeted' || e.kind === 'interrupted_by_player')
  const heardCure = (id) => receiptsOf(state, id).some((e) => e.kind === 'fluffer_cured')
  const heardFight = (id) => receiptsOf(state, id).some((e) => e.kind === 'resident_downed' || e.kind === 'hostile_response') // gesehen oder gehört: der Spieler hat sich mit den Skeletten angelegt
  return {
    state: () => state, log: () => log.slice(), loadStatus,
    receipts: (id) => receiptsOf(state, id),
    has, knowsPlayer, heardCure, heardFight,
    // Ereignisse aus der Live-Schicht (residentSim hooks.onEvent) und der Welt (Fluffer)
    onEncounterDone({ key, a, b, decision, t }) { const kind = decision === 'silent' ? 'silent' : 'greeted'; record({ residentId: a, eventKey: key, kind, mode: 'participated', with: [b] }, t); record({ residentId: b, eventKey: key, kind, mode: 'participated', with: [a] }, t) },
    onPlayerNotice({ id, slot, t }) { return record({ residentId: id, eventKey: `player:${slot}`, kind: 'interrupted_by_player', mode: 'participated', with: ['player'] }, t) },
    onThreatNotice({ id, flufferId, t }) { return record({ residentId: id, eventKey: `fluffer:${flufferId}:seen`, kind: 'plague_seen', mode: 'observed', with: [] }, t) },
    // Heilung: nur Zeugen in Sichtweite (residents: [{ id, x, z, near }])
    onCured({ flufferId, at, residents, t }) { const key = `fluffer:${flufferId}:cured`, w = []
      for (const r of residents) if (r.near && Math.hypot(r.x - at[0], r.z - at[1]) <= MEMORY.witnessR) { if (record({ residentId: r.id, eventKey: key, kind: 'fluffer_cured', mode: 'observed', with: ['player'] }, t)) w.push(r.id) }
      return w },
    // Gruppen-Ereignis (groupLife onEvent): { type, id, n?, group, members: [IDs], at: [x, z], residents: [{ id, x, z, near }], t }
    onGroupEvent({ type, id, n, group, members = [], at, residents = [], t }) {
      const base = `grp:${group}:d${when(t).day}`, out = [], rec = (residentId, eventKey, kind, mode, salience) => { if (record({ residentId, eventKey, kind, mode, with: ['player'], salience }, t)) out.push(residentId) }
      const witnesses = (key, kind) => { if (at) for (const r of residents) if (r.near && Math.hypot(r.x - at[0], r.z - at[1]) <= MEMORY.witnessR) rec(r.id, key, kind, 'observed') }
      if (type === 'hit' && n <= 2) for (const m of members) rec(m, `${base}:warn${n}`, 'hit_warning', 'participated', n)
      else if (type === 'aggro') { const key = `${base}:aggro`; for (const m of members) rec(m, key, 'hostile_response', 'participated'); witnesses(key, 'hostile_response') }
      else if (type === 'ko') { const key = `${base}:ko:${id}`; rec(id, key, 'resident_downed', 'participated'); for (const m of members) if (m !== id) rec(m, key, 'resident_downed', 'observed'); witnesses(key, 'resident_downed') }
      else if (type === 'awake') rec(id, `${base}:up:${id}`, 'respawned', 'participated')
      return out },
    // Thema für eine Begegnung: was der Sprecher gesehen hat und der Zuhörer nicht weiß (höchste Bedeutung zuerst); null = nichts zu erzählen
    topic(speaker, listener) {
      for (const kind of MEMORY.topics) {
        const e = receiptsOf(state, speaker).find((x) => x.kind === kind && x.mode !== 'told')
        if (e && !has(listener, e.eventKey)) return { eventKey: e.eventKey, kind }
      }
      return null
    },
    // Weitererzählen (WS0 V-602, Phase D2): nur ein Schritt (Quelle = Zeuge), Sicherheit eine Stufe unter „gesehen“, höchstens einmal je Erzähler und Tag
    toldToday: (speaker, t) => state.npc.receipts.some((e) => e.mode === 'told' && e.from === speaker && e.day === when(t).day),
    tell({ speaker, listener, topic, t }) {
      if (!topic || has(speaker, topic.eventKey) === 'told' || has(speaker, topic.eventKey) === null) return false
      if (state.npc.receipts.some((e) => e.mode === 'told' && e.from === speaker && e.day === when(t).day)) return false
      return record({ residentId: listener, eventKey: topic.eventKey, kind: topic.kind, mode: 'told', from: speaker, with: [speaker], salience: Math.max(0, (MEMORY.salience[topic.kind] ?? 1) - 1) }, t) },
    // Begrüßung des Spielers (Clip-Wunschliste) und Grund – abgeleitet, nicht gespeichert
    greetPlayer(id) { if (heardCure(id)) return { clip: ['Cheering', 'Waving', 'Idle_B'], why: 'cure' }; if (heardFight(id)) return { clip: ['Interact', 'Waving', 'Idle_B'], why: 'fight' }; if (knowsPlayer(id)) return { clip: ['Waving', 'Idle_B'], why: 'known' }; return { clip: ['Idle_B'], why: 'first' } },
  }
}
