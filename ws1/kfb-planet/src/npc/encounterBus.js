// WS-NPC A0 · Begegnungs-Bus (V-585, BRIEF_WS1_NPC_LIFE_R2 Block 3: „#210 EncounterBeatBus wiederverwenden und um Abbruch/Neuplanung erweitern“).
// Spender: georg-doc/kayfabizarro PR #210 tools/resident_atlas/life/encounter-bus.js @f534a056 (Blob 8f6382b2), Verhalten im Modus 'legacy' unverändert
// (alte Prüfungen in test/unit/npcEncounter.mjs). Rein: ohne three, ohne DOM, Node-geprüft.
// Erweiterung WS-NPC (Modus 'kfb', Begegnungs-Grammatik aus dem Brief):
//   notice → approach → orient → greet | silent → react → part → resume
//   · greet oder silent entscheidet der Aufrufer beim Start (decision), Schweigen ist ein gültiger Ausgang (R0.7)
//   · interrupt(reason) friert die laufende Begegnung ein (Zeit steht, Teilnehmer bleiben belegt), resume() setzt am selben Beat fort
//   · cancel(reason) bricht ab: Beat 'part' (kurz) und dann 'resume', danach frei – kein hängender Teilnehmer
//   · IDs stabil aus dem Aufrufer (encounterKey, z. B. Tag + Plan-Slot) statt enc-<Zähler>; ohne Schlüssel wie #210
// Der Host besitzt Legalität, Beat-Zeit und Belegung; Bewegung, Clips und Text sind Verbraucher (movement-Rückruf, Bus-Abonnenten).

export const ENCOUNTER_BEATS = Object.freeze(['approach', 'greet', 'offer', 'react', 'accept', 'decline', 'leave']) // #210, öffentlich und fest
export const GRAMMAR_BEATS = Object.freeze(['notice', 'approach', 'orient', 'greet', 'silent', 'react', 'part', 'resume'])

const EMITTED = new Set([...ENCOUNTER_BEATS, ...GRAMMAR_BEATS])
const LINEAR = Object.freeze({ legacy: ['approach', 'greet', 'offer', 'react'], kfb: ['notice', 'approach', 'orient', '*', 'react', 'part'] })
export const KFB_SECONDS = Object.freeze({ notice: 0.5, approach: 2.4, orient: 0.6, greet: 1.6, silent: 1.2, react: 1.4, part: 1.2, resume: 0.01 })

export class EncounterBeatBus {
  #listeners = new Set()
  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function')
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }
  emit(event) {
    if (!event || !EMITTED.has(event.beat)) throw new Error('invalid encounter beat')
    const frozen = Object.freeze({ ...event })
    for (const listener of [...this.#listeners]) listener(frozen)
    return frozen
  }
}

export function defaultEncounterLegality({ actorId, targetId, combatLocked = false, disabled = false } = {}) {
  return Boolean(actorId && targetId && actorId !== targetId && !combatLocked && !disabled)
}

export function createEncounterHost({ bus, legality = defaultEncounterLegality, offerProvider = () => null, movement = () => {}, durations = {}, grammar = 'legacy' } = {}) {
  if (!(bus instanceof EncounterBeatBus)) throw new TypeError('EncounterBeatBus required')
  if (!LINEAR[grammar]) throw new Error('unknown grammar: ' + grammar)
  const kfb = grammar === 'kfb'
  const seconds = Object.freeze(kfb ? { ...KFB_SECONDS, ...durations } : { approach: 1.35, greet: 0.85, offer: 0.95, react: 0.9, accept: 0.65, decline: 0.65, leave: 1.35, ...durations })
  const chain = LINEAR[grammar]
  const busy = new Set()
  let current = null, serial = 0

  const snapshot = () => current ? {
    encounterId: current.id, beat: current.beat, actorId: current.actorId, targetId: current.targetId, targetKind: current.targetKind,
    relationship: current.relationship, offer: current.offer, decision: current.decision, elapsed: current.elapsed, done: false,
    ...(kfb ? { paused: current.paused, pauseReason: current.pauseReason, cancelled: current.cancelled } : {}),
  } : null

  function eventFor(beat) {
    let speakerId = current.actorId
    if (beat === 'react') speakerId = current.targetKind === 'resident' ? current.targetId : current.actorId
    if (beat === 'accept' || beat === 'decline') speakerId = current.targetKind === 'resident' ? current.targetId : null
    if (kfb && (beat === 'silent' || beat === 'notice' || beat === 'resume')) speakerId = null
    return { type: 'kfb.encounter.beat', version: kfb ? 2 : 1, encounterId: current.id, beat, actorId: current.actorId, targetId: current.targetId, targetKind: current.targetKind,
      speakerId, relationship: current.relationship, offer: current.offer, decision: current.decision, context: current.context, ...(kfb ? { cancelled: current.cancelled } : {}) }
  }

  function enter(beat) {
    current.beat = beat; current.elapsed = 0
    if (beat === 'offer') current.offer = offerProvider({ ...snapshot(), context: current.context })
    bus.emit(eventFor(beat))
  }

  function finish() {
    const done = { ...snapshot(), beat: kfb ? 'resume' : 'leave', done: true }
    busy.delete(current.actorId)
    if (current.targetKind === 'resident') busy.delete(current.targetId)
    current = null
    return done
  }

  function start({ actorId, targetId, targetKind = 'resident', relationship = 'neutral', context = {}, decision = null, encounterKey = null } = {}) {
    if (current) return { ok: false, reason: 'host-busy' }
    const legal = legality({ actorId, targetId, targetKind, relationship, context, combatLocked: !!context.combatLocked, disabled: !!context.disabled })
    if (!legal) return { ok: false, reason: 'illegal' }
    if (busy.has(actorId) || (targetKind === 'resident' && busy.has(targetId))) return { ok: false, reason: 'participant-busy' }
    const choices = kfb ? ['greet', 'silent'] : ['accept', 'decline']
    if (decision != null && !choices.includes(decision)) return { ok: false, reason: 'bad-decision' }
    const id = encounterKey != null ? String(encounterKey) : `enc-${++serial}`
    current = { id, actorId, targetId, targetKind, relationship, context, decision, offer: null, beat: chain[0], elapsed: 0, paused: false, pauseReason: null, cancelled: null }
    busy.add(actorId)
    if (targetKind === 'resident') busy.add(targetId)
    enter(chain[0])
    return { ok: true, encounterId: id }
  }

  function choose(decision) {
    if (!current) return false
    if (!(kfb ? ['greet', 'silent'] : ['accept', 'decline']).includes(decision)) return false
    current.decision = decision
    return true
  }

  // WS-NPC: Unterbrechen (z. B. Spieler kommt dazu) – Zeit steht, Teilnehmer bleiben belegt; resume() setzt am selben Beat fort
  function interrupt(reason = 'interrupt') { if (!current || !kfb || current.paused || current.cancelled) return false; current.paused = true; current.pauseReason = String(reason); return true }
  function resume() { if (!current || !current.paused) return false; current.paused = false; current.pauseReason = null; return true }
  // WS-NPC: Abbruch (z. B. Plan-Fenster vorbei) – sofort 'part', danach 'resume' und frei. Legacy: sofort frei ohne Beat (kein Verhalten in #210)
  function cancel(reason = 'cancel') {
    if (!current) return null
    if (!kfb) return finish()
    current.cancelled = String(reason); current.paused = false; current.pauseReason = null
    if (current.beat !== 'part') enter('part')
    return snapshot()
  }

  function update(dt) {
    if (!current) return null
    if (current.paused) return snapshot()
    const step = Math.max(0, Number(dt) || 0)
    current.elapsed += step
    const span = Math.max(0.0001, (current.cancelled && current.beat === 'part' ? Math.min(seconds.part, 0.5) : seconds[current.beat]) || 0.5)
    movement({ ...snapshot(), progress: Math.min(1, current.elapsed / span), context: current.context })
    if (current.elapsed < span) return snapshot()
    if (kfb) {
      if (current.beat === 'part') { enter('resume'); return finish() }
      const i = chain.indexOf(current.beat === 'greet' || current.beat === 'silent' ? '*' : current.beat)
      const next = chain[i + 1]
      enter(next === '*' ? (current.decision || 'greet') : next)
      return snapshot()
    }
    if (chain.includes(current.beat)) {
      const idx = chain.indexOf(current.beat)
      if (idx < chain.length - 1) enter(chain[idx + 1])
      else enter(current.decision || 'decline')
      return snapshot()
    }
    if (current.beat === 'accept' || current.beat === 'decline') { enter('leave'); return snapshot() }
    if (current.beat === 'leave') return finish()
    throw new Error(`unknown encounter host state: ${current.beat}`)
  }

  return {
    start, update, choose, interrupt, resume, cancel, seconds,
    get current() { return snapshot() },
    get busyIds() { return [...busy] },
    get isActive() { return !!current },
    // Gesamtdauer der kfb-Grammatik ohne Unterbrechung (für den Tagesplan: das Sozial-Fenster muss sie fassen)
    totalSeconds: (decision = 'greet') => (kfb ? ['notice', 'approach', 'orient', decision, 'react', 'part', 'resume'] : []).reduce((s, b) => s + seconds[b], 0),
  }
}

// Clip je Beat nur aus dem, was die Figur wirklich hat (Idee aus #210 npc-life-01.adapters.js createMotionBeatAdapter, ohne Waving: nicht im Spiel)
export const MOTION_CANDIDATES = Object.freeze({
  notice: ['Idle_B', 'Idle_A'], approach: ['Walking_B', 'Walking_A', 'Walking_C'], orient: ['Idle_A'], greet: ['Waving', 'Interact', 'Idle_B', 'Idle_A'], silent: ['Idle_A'],
  react: ['Interact', 'Idle_B', 'Idle_A'], part: ['Idle_A'], resume: ['Idle_A'], offer: ['Use_Item', 'Interact', 'Idle_B', 'Idle_A'], accept: ['Interact', 'Waving', 'Idle_B', 'Idle_A'],
  decline: ['Idle_B', 'Idle_A'], leave: ['Walking_A', 'Walking_B', 'Walking_C', 'Running_A'],
})
export function createMotionBeatAdapter({ availableFor, play } = {}) {
  if (typeof availableFor !== 'function' || typeof play !== 'function') throw new TypeError('motion adapter callbacks required')
  return (event) => {
    const id = event.speakerId || event.actorId
    const available = new Set(availableFor(id) || [])
    const clip = (MOTION_CANDIDATES[event.beat] || []).find((name) => available.has(name)) || null
    if (clip) play({ actorId: id, clip, beat: event.beat, encounterId: event.encounterId })
    return clip
  }
}
