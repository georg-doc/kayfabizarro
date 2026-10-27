// WS-NPC · Wechselrede hinter #chat=syl (Lead-Auftrag 24.10., Georg-GO: „niedlich, aber man hat nicht das Gefühl, dass sie miteinander sprechen“).
// Liest die Sprech-Anlässe (Band und Disco: events() chatter; Bewohner und gothgirl: npc.events() greet) und macht daraus kurze Wechselreden:
// je Beat eine Blase (store.say) und ein Laut (WS-Audio speak → { dur, start }); nur Sprecher im Bild sprechen (Laut nur mit Blase). Die Blase steht max(start + dur, Lesezeit) und bleibt stehen,
// solange die Antwort läuft (so sieht man, wer wem antwortet); höchstens 2 Blasen gleichzeitig.
// Text nur aus geprüften Quellen (S5b): Rufe V-712 (poolReader.callLine) und Kartenzeilen über reader.ssotLine (tr1 nur mit lines=tr1, sonst
// TRIPLET_SSOT-Rückfall „Opener + **Titel**“ bzw. bereinigte Lore). Gesperrte Karten nie. Nichts erzeugt.
// Ruf-Grammatik (Georg 24.10.): Bingo! ja · Boggle...? hä, mehr davon (hält offen) · Bongo. weiches Nein · Blödsinn! hartes Nein (beendet) · Humbug?! vergiss es.
// Rein bis auf die Ports: say, speak, reader, anchorAt – Node-geprüft (test/unit/talkDirector.mjs).
import { Box3, Group, Vector3 } from 'three'
import { CHATTER } from './chatterCues.js'
import { resolveCharacterId } from '../characters/registry.js'
import CARDS from '../data/cards.json' with { type: 'json' }
import TRATSCH from '../data/npc/tratsch/tratsch-data.r1.json' with { type: 'json' }
import { isBlocked, tr1Line, tr1Start, TR1_ON, createOpenerRotation, createSentenceOpenerRotation } from '../dialog/ssotLines.js'

// replyGap: Antwort 0,3–0,5 s nach dem Ende des Vorredners (Lead) · Lesezeit: Wörter / 3 je s, mindestens 1,2 s (Rückfall ohne Laut, mit WS-Audio abgestimmt)
// staleS: ein Anlass, der länger wartet, verfällt (Bemerken und Begrüßung sind nur im Moment sinnvoll)
// nearR: Gesprächsnähe = äußerer Bemerken-Radius (CHATTER.noticeOut); weiter weg spricht niemand, auch wenn er im Bild ist (Video 24.10.: Band am Horizont)
export const TALK = Object.freeze({ replyGap: [0.3, 0.5], wps: 3, readMin: 1.2, maxBubbles: 2, staleS: 4, anchorPollS: 1, nearR: CHATTER.noticeOut })
// Begrüßung: erstes Sehen = „hä?“, bekannt bzw. geheilt = „ja!“, Kampf = hartes Nein
export const GREET_CALL = Object.freeze({ first: 'boggle', known: 'bingo', cure: 'bingo', fight: 'bloedsinn' })

const words = (t) => String(t || '').replace(/\*/g, '').trim().split(/\s+/).filter(Boolean).length
export const readTime = (text) => Math.max(TALK.readMin, words(text) / TALK.wps)
const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0 }

// Signatur-Deck je Figur (Georg 20.10., SIGNATURE_DECKS_R1 im Tratsch-Schnappschuss): Register-ID über die Modellnamen; ohne Deck nur Rufe
const SIG = new Map()
const names = (m) => { const b = String(m).replace(/\s*\(.*\)\s*/, '').trim(); return [b, b.replace(/([a-z])([A-Z])/g, '$1_$2'), b.replace(/\s+/g, '_')] }   // 'AvianSwordsman' → 'Avian_Swordsman' (Register: avian_swordsman)
for (const f of TRATSCH.signature.figures) for (const m of [...f.models, f.figure]) for (const n of names(m)) { const id = resolveCharacterId(n); if (id && !SIG.has(id)) SIG.set(id, f.deck) }
export const signatureDeck = (characterId) => SIG.get(characterId) || null
// Karten eines Decks aus der Druckfassung (cards.json), gesperrte nie (SSOT S12)
const BY_DECK = new Map()
CARDS.cards.forEach(([d, num]) => { const id = CARDS.decks[d][0]; if (isBlocked(id, num)) return; if (!BY_DECK.has(id)) BY_DECK.set(id, []); BY_DECK.get(id).push(+num) })
export const deckCards = (deckId) => BY_DECK.get(deckId) || []

// S3 (Lead 25.10.): Signatur-Karte einer Szene → 'deck:num' | null
// Mitglieder mit Signatur-Deck reihum je Szenen-Nummer (Disco: sieben Tänzer), Karte im Deck reihum; gesperrte nie (deckCards)
export function sceneCard(besetzung, n = 0) {
  const withDeck = besetzung.filter((b) => deckCards(signatureDeck(b.characterId) || '').length)
  if (!withDeck.length) return null
  const b = withDeck[n % withDeck.length], deck = signatureDeck(b.characterId), all = deckCards(deck)
  return deck + ':' + all[(hash(b.characterId) + n) % all.length]
}
export const parseCard = (k) => { const m = /^(.+):(\d+)$/.exec(k || ''); return m ? { deck: { id: m[1] }, num: +m[2] } : null }

// Anlass → Beats. occ: { group, cause: 'songEnd'|'pause'|'notice'|'greet', reason?, speakers: [{ anchor, characterId, … }] }
// card(characterId) → { deck: { id }, num } | null. Beat: { sp, call } oder { sp, card, role: 'line'|'lore' }
export function planOccasion(occ, card) {
  const sp = occ.speakers
  if (!sp.length) return []
  if (occ.cause === 'greet') return [{ sp: 0, call: GREET_CALL[occ.reason] || 'boggle' }]
  if (occ.cause === 'notice') return [{ sp: 0, call: occ.reason === 'first' ? 'boggle' : 'bingo', mc: occ.group === 'disco_k12' }]
  // Wer ein Deck hat, beginnt; ohne Karte bei beiden bleibt es bei einem Ruf
  let a = 0, c = card(sp[0].characterId)
  if (!c && sp.length > 1) { const c1 = card(sp[1].characterId); if (c1) { a = 1; c = c1 } }
  const b = sp.length > 1 ? 1 - a : null
  if (!c) return [{ sp: a, call: occ.cause === 'pause' ? 'boggle' : 'bingo' }]
  if (occ.cause === 'songEnd') return b == null ? [{ sp: a, card: c, role: 'line' }] : [{ sp: a, card: c, role: 'line' }, { sp: b, call: 'bingo' }]
  // Pause: A erzählt, B fragt nach (Boggle hält offen), A legt die Lore nach; ohne ungesagte Lore antwortet B mit Bingo! und es endet
  if (b == null) return [{ sp: a, card: c, role: 'line' }]
  return [{ sp: a, card: c, role: 'line' }, { sp: b, call: 'boggle', needLore: true }, { sp: a, card: c, role: 'lore' }]
}

// options: { sources: () => ({ band, disco, npc }), say(anchor, line, life), speak({ text, characterId, pos, kind, group }) → { dur, start } | null,
//   reader (ssotLine), callLine(key, speaker), anchorAt(id, out) → Vector3 | null, registerAnchor, busy?() (Bühnen-Dialog läuft), onCall?(beat, occ), player?() → { x, z },
//   tr1? (Standard lines=tr1), seed? }
export function createTalkDirector(options) {
  const { say, speak = () => null, reader, callLine, anchorAt = () => null, registerAnchor = null, busy = () => false, onCall = () => {} } = options
  const tr1 = options.tr1 ?? TR1_ON, rot = createOpenerRotation(), rotT = createSentenceOpenerRotation()
  const S = { t: 0, cam: null, seen: new Map(), queue: [], cur: null, shown: [], log: [], anchors: new Map(), anchorT: 0, rnd: hash(options.seed ?? 'talk'), used: new Map(), stats: { occasions: 0, beats: 0, dropped: 0, unseen: 0, calls: 0, cards: 0 } }
  // Laut nur mit Blase: ein Sprecher außerhalb des Bildes (hinter der Kamera, außerhalb des Bildausschnitts) spricht nicht; ohne Kamera (Node-Test) gilt jeder als sichtbar
  const inView = (anchor) => { if (!S.cam) return true; const p = anchorAt(anchor, VEC); if (!p) return false
    const pl = options.player?.(); if (pl && Math.hypot(p.x - pl.x, p.z - pl.z) > TALK.nearR) return false
    p.project(S.cam); return p.z > -1 && p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 }
  const rnd = () => { S.rnd = (Math.imul(S.rnd, 1664525) + 1013904223) >>> 0; return S.rnd / 4294967296 }
  const gap = () => TALK.replyGap[0] + (TALK.replyGap[1] - TALK.replyGap[0]) * rnd()
  // Karte einer Figur: reihum durch ihr Signatur-Deck, mit tr1 bevorzugt Karten mit tr1-Zeile; keine Karte zweimal, bevor das Deck durch ist
  function cardFor(characterId) {
    // S3: Karte der Szene, in der die Figur steht – nur aus ihrem eigenen Signatur-Deck (sonst erzählt jede Tänzerin die Karte der Szene)
    const hint = options.cardHint?.(characterId); if (hint && hint.deck.id === signatureDeck(characterId) && !isBlocked(hint.deck.id, hint.num)) return hint
    const deck = signatureDeck(characterId), all = deck ? deckCards(deck) : []
    if (!all.length) return null
    const pref = tr1 ? all.filter((n) => tr1Line(deck, n)) : all, list = pref.length ? pref : all
    const k = (S.used.get(characterId) ?? hash(characterId)) % list.length
    S.used.set(characterId, k + 1)
    return { deck: { id: deck }, num: list[k] }
  }
  // Zeilen eines Plans vorab bauen (alle synchron): A mit tr1 → T + Boggle-Lore, sonst Rückfall A (Opener + Titel) + B (bereinigte Lore)
  function lines(plan, occ) {
    const out = []
    for (const bt of plan) {
      const who = occ.speakers[bt.sp]
      let line, kind
      if (bt.call) { line = callLine(bt.call, who.anchor); kind = 'call' }
      else if (bt.role === 'line') { const t = tr1 && tr1Line(bt.card.deck.id, bt.card.num); line = t ? reader.ssotLine(bt.card, 'T', rotT.next(tr1Start(bt.card))) : reader.ssotLine(bt.card, 'A', rot.next()); bt.viaT = !!t; kind = 'line' }
      else { const viaT = out[0]?.bt.viaT; line = reader.ssotLine(bt.card, viaT ? 'BOGGLE' : 'B'); kind = 'lore' }
      if (!line || line.source === 'SILENCE') {
        if (bt.role === 'lore' && out.length >= 2 && out[out.length - 1].bt.needLore) { out[out.length - 1] = { bt: { ...out[out.length - 1].bt, call: 'bingo' }, who: out[out.length - 1].who, line: callLine('bingo', out[out.length - 1].who.anchor), kind: 'call' }; break }   // nichts nachzulegen: B sagt Bingo!, Ende
        if (!out.length) return []
        break
      }
      out.push({ bt, who, line, kind })
    }
    return out
  }
  const posOf = (who) => { const p = anchorAt(who.anchor, VEC); return p ? { x: p.x, y: p.y, z: p.z } : who.at ? { x: who.at[0], y: 0, z: who.at[1] } : null }

  // neue Ereignisse einsammeln: chatter (Band, Disco) und greet (Bewohner, gothgirl) – je Quelle nach seq; gleiche Gruppe, Ursache und Zeit = ein Anlass
  function collect() {
    const src = options.sources?.() || {}, fresh = []
    for (const [name, mod] of Object.entries(src)) {
      const ev = mod?.events?.() || [], last = S.seen.get(name) ?? (ev.length ? ev[ev.length - 1].seq : 0)
      if (!S.seen.has(name)) { S.seen.set(name, last); continue }   // Altbestand beim Start nicht nachspielen
      for (const e of ev) if (e.seq > last && (e.type === 'chatter' || e.type === 'greet')) fresh.push({ src: name, e })
      if (ev.length) S.seen.set(name, Math.max(last, ev[ev.length - 1].seq))
    }
    const occs = new Map()
    for (const { src: name, e } of fresh) {
      const group = e.type === 'greet' ? (e.source === 'partner' ? 'partner' : 'resident') : e.group
      const key = e.type === 'greet' ? name + ':greet:' + e.seq : name + ':' + e.cause + ':' + e.t
      const anchor = e.type === 'greet' ? (e.source === 'partner' ? 'stage-right' : 'npc-' + e.id) : group === 'orc_band' ? 'band-' + e.id : 'disco-' + e.id
      if (!occs.has(key)) occs.set(key, { group, cause: e.type === 'greet' ? 'greet' : e.cause, reason: e.reason, at: S.t, speakers: [] })
      occs.get(key).speakers.push({ anchor, id: e.id, characterId: e.characterId ?? null, at: e.at, group })
    }
    for (const o of occs.values()) { S.queue.push(o); S.stats.occasions++ }
  }

  // Blasen-Buchhaltung: höchstens maxBubbles gleichzeitig; eine neue Blase am selben Anker ersetzt die alte (bubbleLayer)
  function show(beat, life) {
    S.shown = S.shown.filter((b) => b.until > S.t && b.anchor !== beat.who.anchor)
    while (S.shown.length >= TALK.maxBubbles) S.shown.shift()
    S.shown.push({ anchor: beat.who.anchor, until: S.t + life })
    say(beat.who.anchor, beat.line, life)
    S.stats.beats++; if (beat.kind === 'call') S.stats.calls++; else S.stats.cards++
    S.log.push({ t: +S.t.toFixed(3), anchor: beat.who.anchor, group: beat.who.group, kind: beat.kind, text: beat.line.text, source: beat.line.source, field: beat.line.field ?? null, life: +life.toFixed(3) })
    if (S.log.length > 80) S.log.shift()
  }

  function startBeat() {
    const X = S.cur, beat = X.beats[X.i], who = beat.who
    // Bildschirmtext mit *fett* an den Ton (WS-Audio betont ihn leicht), Satzzeichen bleiben
    let r = null; try { r = speak({ text: beat.line.parts.join(' '), characterId: who.characterId, pos: posOf(who), kind: beat.kind, group: who.group === 'orc_band' || who.group === 'disco_k12' ? who.group : undefined }) } catch (e) { r = null }
    const start = Math.max(0, +r?.start || 0), talk = r && r.dur > 0 ? r.dur : readTime(beat.line.text)
    const next = X.beats[X.i + 1], g = gap()
    // Blase: eigene Rede bzw. Lesezeit; folgt eine Antwort eines anderen, bleibt sie stehen, bis die Antwort gelesen ist
    let life = Math.max(start + talk, readTime(beat.line.text)) - start
    if (next && next.who.anchor !== who.anchor) life = Math.max(life, talk + g + readTime(next.line.text))
    if (beat.bt.mc || beat.kind === 'call') onCall(beat, X.occ)
    X.pending = { at: S.t + start, beat, life }
    X.nextAt = S.t + start + talk + g
    X.i++
  }

  return {
    object3d: new Group(),
    update(dt, hctx) {
      S.t += Math.min(dt, 0.25); S.cam = hctx?.camera || null
      // Anker für Band und Disco nachmelden (die Figuren laden asynchron)
      if (registerAnchor && (S.anchorT -= dt) <= 0) {
        S.anchorT = TALK.anchorPollS
        const src = options.sources?.() || {}
        for (const a of Object.values(src).flatMap((m) => m?.anchors?.() || [])) {   // Band, Disco und Szenen-Module (S3)
          const had = S.anchors.get(a.id); if (had && had.object3d === a.object3d) continue
          const top = a.top ?? topOf(a.object3d); if (!(top > 0)) continue   // Kopfhöhe über dem Fußpunkt, einmal gemessen (Box der Figur)
          had?.off?.(); S.anchors.set(a.id, { object3d: a.object3d, top, off: registerAnchor({ id: a.id, object3d: a.object3d, offset: [0, top, 0] }) })
        }
      }
      collect()
      if (busy()) { S.stats.dropped += S.queue.length + (S.cur && (S.cur.pending || S.cur.i < S.cur.beats.length) ? 1 : 0); S.queue.length = 0; S.cur = null; return }   // Bühnen-Dialog: Anlässe verfallen
      const X = S.cur
      if (X?.pending && S.t >= X.pending.at) { show(X.pending.beat, X.pending.life); X.pending = null }
      if (X && !X.pending && S.t >= X.nextAt) { if (X.i < X.beats.length && inView(X.beats[X.i].who.anchor)) startBeat(); else { if (X.i < X.beats.length) S.stats.unseen++; S.cur = null } }
      if (!S.cur) {
        while (S.queue.length && S.t - S.queue[0].at > TALK.staleS) { S.queue.shift(); S.stats.dropped++ }
        const occ = S.queue.shift()
        // erster Sprecher nicht im Bild: der Anlass verfällt (im Spiel z. B. die Band, während man an der Disco steht)
        // Ein ungesehener MC-Ruf gibt den MC trotzdem frei (sonst bliebe er ruhig, bis man wiederkommt); man hat ihn ja nicht springen sehen
        const unseen = (o) => { S.stats.unseen++; const p = planOccasion(o, () => null)[0]; if (p?.mc) onCall({ bt: p, who: o.speakers[0], unseen: true }, o) }
        if (occ && !occ.speakers.some((w) => inView(w.anchor))) unseen(occ)
        else if (occ) { const beats = lines(planOccasion(occ, cardFor), occ); if (beats.length && !inView(beats[0].who.anchor)) unseen(occ); else if (beats.length) { S.cur = { occ, beats, i: 0, nextAt: S.t, pending: null }; startBeat() } }
      }
      // ein bereits fälliger Beat ohne Verzögerung erscheint im selben Takt
      if (S.cur?.pending && S.t >= S.cur.pending.at) { show(S.cur.pending.beat, S.cur.pending.life); S.cur.pending = null }
    },
    // Prüfhilfe (Abnahmebilder): einen Anlass über den echten Weg auslösen (Plan, Zeilen, Sichtbarkeit, Blase, Laut); occ wie aus collect()
    inject: (occ) => { S.queue.push({ reason: null, ...occ, at: S.t, speakers: occ.speakers.map((w) => ({ group: occ.group, ...w })) }); S.stats.occasions++ },
    log: () => S.log.slice(),
    stats: () => ({ ...S.stats, queue: S.queue.length, busy: !!S.cur, shown: S.shown.filter((b) => b.until > S.t).length, anchors: [...S.anchors.keys()] }),
    dispose() { for (const a of S.anchors.values()) a.off?.(); S.anchors.clear(); S.queue.length = 0; S.cur = null },
  }
}
const VEC = new Vector3(), BOX = new Box3(), FOOT = new Vector3()
function topOf(o) { if (!o) return null; o.updateWorldMatrix(true, true); BOX.setFromObject(o, true); if (BOX.isEmpty()) return null; return BOX.max.y - o.getWorldPosition(FOOT).y }
