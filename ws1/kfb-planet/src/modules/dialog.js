// D1 · Karten-Dialog als Modul (V-208 Strang B, V-228 §6): create(options) -> { object3d, update(dt, ctx), dispose() }. Kein React, kein Store,
// keine Szene: alles, was sichtbar oder hörbar wird, geht über Ports, die der Host übergibt (Billboard, Darsteller, Blase, Spielerwahl).
// Ablauf je Karte (ein „Beat“):
//   1. CARD    – billboard.setCard(card); weiter, wenn die Karte steht (oder nach cardWaitMs mit Platzhalter).
//   2. A       – Sprecher A (wechselt je Karte) sagt die Pool-Zeile der Karte (Triplet, V-231/V-235), sonst den Kartentitel wörtlich.
//   3. B       – Sprecher B antwortet mit dem wörtlichen Power-Text (kein Pool-Satz für Antworten, nichts erzeugt).
//   4. CHOICE  – Spielerwahl (2×2 Zurufe oder bis 8 eigene Wörter, S5c); weiter, wenn die Wahl eintrifft (onChoice) oder nach choiceMs.
//   5. PAUSE   – kurze Pause, dann die nächste Karte. Nach der letzten Karte: DONE.
// Text nur aus dem Pool-Leser (POOL / CARD / SILENCE, Vertrag §5). Opener laufen je Dialog höchstens einmal (V-222, excludeOpeners).
// Sprechdauer = Länge der Mundbild-Spur des Darstellers (say(text) → Spur ohne Ton, V-228 §4); hat der Darsteller keinen Mund (F1-Figur),
// gilt eine Lesedauer aus der Wortzahl. Der Zuhörer schaut zum Sprecher (lookAt), danach wieder „Leben“.
// Takt = dt des Hosts; der Überhang einer Phase wird in die nächste übertragen (S.t -= Schwelle). Wiederholbar ist der Ablauf bei gleicher dt-Folge
// und gleicher Antwortzeit der Ports (Test d1); im Browser schwanken beide. Asynchrone Schritte (Karte, Zeile) sperren den Übergang, höchstens
// cardWaitMs bzw. lineWaitMs lang; danach geht es mit Platzhalter bzw. „…“ weiter (Prüfer 8, Befund 1).
import { Group } from 'three'
import { SSOT_LINES_ON, createOpenerRotation, isBlocked } from '../dialog/ssotLines.js'   // lines=ssot (Georg 24.10.): TRIPLET_SSOT_R1-Rückfall, Sperrliste

export const D1 = Object.freeze({ cardWaitMs: 12000, lineWaitMs: 8000, gapMs: 600, pauseMs: 900, choiceMs: 20000, wordMs: 380, minLineMs: 1400 })
export const dialogLog = { create: 0, update: 0, dispose: 0 }

// options: { cards, reader, billboard, actors: { left, right }, say(anchorId, line), openChoice() → choiceId, closeChoice(), anchors: { left, right }, timing?, onEvent?,
//            isReady?() – der Dialog beginnt erst, wenn der Host bereit meldet (Bühne, Karte, Figuren geladen) }
export function createDialog(options) {
  dialogLog.create++
  const { cards = [], reader, billboard, actors = {}, say, openChoice = () => {}, closeChoice = () => {}, anchors = { left: 'stage-left', right: 'stage-right' }, onEvent = () => {}, isReady = () => true } = options
  const T = { ...D1, ...(options.timing || {}) }
  const ssot = options.ssot ?? SSOT_LINES_ON, rot = ssot ? createOpenerRotation() : null
  const S = { i: -1, phase: 'IDLE', t: 0, wait: null, busy: false, usedOpeners: new Set(), usedBeats: new Set(), log: [], disposed: false, choice: null, choiceId: null }
  S.clock = 0
  const emit = (type, data = {}) => { const e = { type, beat: S.i, t: +S.clock.toFixed(3), ...data }; S.log.push(e); onEvent(e) }
  const side = (k) => (S.i % 2 === 0 ? k : k === 'left' ? 'right' : 'left') // Sprecher A wechselt je Karte
  const durOf = (actor, line) => {
    const tr = actor?.say ? actor.say(line.text) : null
    if (Array.isArray(tr) && tr.length) return Math.max(T.minLineMs, tr.reduce((s, x) => s + x.ms, 0))
    const words = String(line.text || '').trim().split(/\s+/).filter(Boolean).length
    return Math.max(T.minLineMs, words * T.wordMs)
  }
  const look = (listener, speakerSide) => { const a = actors[listener]; if (!a?.lookAt) return; a.lookAt(speakerSide === 'left' ? -0.7 : 0.7, 0.05) }
  const free = (k) => actors[k]?.lookAt?.(null)
  // asynchroner Schritt: sperrt, bis das Promise erfüllt ist; Ergebnis landet in S.wait.value
  // Ports dürfen synchron werfen: die Ausnahme wird zum abgelehnten Schritt (Prüfer 8, Befund 8)
  const gate = (fn) => { S.busy = true; const g = S.wait = { value: undefined, done: false }; let p; try { p = typeof fn === 'function' ? fn() : fn } catch (e) { p = Promise.reject(e) } Promise.resolve(p).then((v) => { if (S.wait === g) { g.value = v; g.done = true; S.busy = false } }, (e) => { if (S.wait === g) { g.value = null; g.error = String(e?.message || e); g.done = true; S.busy = false } }) }

  function speak(k, line0) {
    const line = line0 || reader.silence() // Zeile nicht ladbar oder zu spät → „…“ (Vertrag §5)
    let ms; try { ms = durOf(actors[k], line) } catch (e) { ms = T.minLineMs }
    if (line.source === 'POOL') { if (line.openerId && line.openerId !== 'DIRECT') S.usedOpeners.add(line.openerId); if (line.beatId) S.usedBeats.add(line.beatId) }
    try { say(anchors[k], line) } catch (e) { emit('port-error', { port: 'say', error: String(e?.message || e) }) }
    look(k === 'left' ? 'right' : 'left', k)
    emit('line', { speaker: k, source: line.source, field: line.field ?? null, openerId: line.openerId ?? null, text: line.text, ms })
    return ms
  }

  function next() {
    S.i++
    while (ssot && cards[S.i] && isBlocked(cards[S.i].deck.id, cards[S.i].num)) { emit('blocked', { card: cards[S.i].deck.id + '#' + cards[S.i].num }); S.i++ }   // SSOT S12: nie sprechen
    if (S.i >= cards.length) { S.phase = 'DONE'; emit('done', { beats: cards.length }); return }
    const card = cards[S.i]
    S.phase = 'CARD'; emit('card', { card: card ? card.deck.id + '#' + card.num : null })
    gate(() => (billboard?.setCard ? billboard.setCard(card) : null))
  }

  function step(dtMs) {
    S.t += dtMs
    const card = cards[S.i]
    switch (S.phase) {
      case 'IDLE': next(); return
      case 'CARD':
        if (S.busy && S.t < T.cardWaitMs) return
        if (S.busy) emit('card-timeout')
        S.phase = 'A_LOAD'; S.t = 0
        gate(() => (ssot ? reader.ssotLine(card, 'A', rot.next()) : reader.lineFor(card, { field: 'cardName', excludeOpeners: S.usedOpeners, excludeBeats: S.usedBeats })))
        return
      case 'A_LOAD':
        if (S.busy && S.t < T.lineWaitMs) return
        if (S.busy) { emit('line-timeout', { speaker: side('left') }); S.wait = null; S.busy = false }
        S.phase = 'A'; S.t = 0; S.lineMs = speak(side('left'), S.wait?.value)
        return
      case 'A':
        if (S.t < S.lineMs + T.gapMs) return
        free(side('left') === 'left' ? 'right' : 'left')
        S.phase = 'B_LOAD'; S.t -= S.lineMs + T.gapMs
        gate(() => (ssot ? reader.ssotLine(card, 'B') : reader.lineFor(card, { field: 'power', pool: false }))) // Antwort: nie Pool, nur wörtlich (ein Triplet je Karte, V-231); mit lines=ssot bereinigte Lore statt Power
        return
      case 'B_LOAD':
        if (S.busy && S.t < T.lineWaitMs) return
        if (S.busy) { emit('line-timeout', { speaker: side('right') }); S.wait = null; S.busy = false }
        S.phase = 'B'; S.t = 0
        S.lineMs = speak(side('right'), S.wait?.value)
        return
      case 'B':
        if (S.t < S.lineMs + T.gapMs) return
        free('left'); free('right')
        S.phase = 'CHOICE'; S.t -= S.lineMs + T.gapMs; S.choice = null
        try { S.choiceId = openChoice() ?? null } catch (e) { S.choiceId = null; emit('port-error', { port: 'openChoice', error: String(e?.message || e) }) }
        emit('choice-open', { choiceId: S.choiceId })
        return
      case 'CHOICE':
        if (!S.choice && S.t < T.choiceMs) return
        if (!S.choice) { closeChoice(); emit('choice-timeout') } else emit('choice', { id: S.choice.id, label: S.choice.label ?? null })
        S.phase = 'PAUSE'; S.t = S.choice ? 0 : S.t - T.choiceMs; S.choiceId = null
        return
      case 'PAUSE':
        if (S.t < T.pauseMs) return
        S.t -= T.pauseMs; next(); return
      default: return
    }
  }

  return {
    object3d: new Group(), // keine eigene Darstellung
    update(dt) { if (S.disposed || S.phase === 'DONE') return; if (S.phase === 'IDLE' && !isReady()) return; dialogLog.update++; S.clock += dt; step(dt * 1000) },
    // nur die Wahl, die dieser Dialog geöffnet hat (choiceId), und nur in der Phase CHOICE (Prüfer 8, Befund 7)
    onChoice(res) { if (S.phase !== 'CHOICE' || S.choice) return; if (S.choiceId != null && res?.choiceId != null && res.choiceId !== S.choiceId) return; S.choice = res || { id: 'none' } },
    state: () => ({ phase: S.phase, beat: S.i, cards: cards.length, usedOpeners: [...S.usedOpeners], usedBeats: [...S.usedBeats], waiting: S.busy }),
    log: () => S.log.slice(),
    dispose() { dialogLog.dispose++; const own = S.phase === 'CHOICE'; S.disposed = true; S.wait = null; if (own) closeChoice(); free('left'); free('right') },
  }
}
