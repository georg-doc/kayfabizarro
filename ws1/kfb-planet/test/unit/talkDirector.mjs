// WS-NPC Wechselrede hinter #chat=syl (src/npc/talkDirector.js, Lead 24.10.), ohne Browser:
// Plan je Anlass (Bemerken, Begrüßung, Liedende, Disco-Pause) · Antwort 0,3–0,5 s nach dem Ende des Vorredners · höchstens 2 Blasen zugleich
// · Blase steht max(start + dur, Lesezeit) und hält bis zur gelesenen Antwort · nur ausgegebene Zeilen (S5b), Rufe genau V-712, gesperrte Karten nie
// · ohne Laut (speak → null) gilt die Lesezeit · Altbestand beim Start wird nicht nachgespielt · Bühnen-Dialog (busy) verwirft · MC-Ruf meldet onCall
import { report } from './_report.mjs'
import { createTalkDirector, planOccasion, readTime, signatureDeck, deckCards, TALK, GREET_CALL } from '../../src/npc/talkDirector.js'
import { createPoolReader, callLine, isIssuedLine } from '../../src/poolReader.js'
import { isBlocked, tr1Line, tr1Start, lineT, createSentenceOpenerRotation } from '../../src/dialog/ssotLines.js'
import CARDS from '../../src/data/cards.json' with { type: 'json' }
import { PerspectiveCamera, Vector3 } from 'three'

const byKey = new Map(); CARDS.cards.forEach(([d, num, name, power, lore]) => byKey.set(CARDS.decks[d][0] + '#' + num, { name, power, lore }))
const reader = createPoolReader({ cardSource: (deckId, num) => byKey.get(deckId + '#' + num) || null })
const V712 = ['Bingo!', 'Boggle...?', 'Bongo.', 'Blödsinn!', 'Humbug?!']

function rig({ speakDur = 1.0, speakStart = 0, mute = false, tr1 = false, busy = () => false, cam = null, anchorAt } = {}) {
  const src = { band: { ev: [] }, disco: { ev: [] }, npc: { ev: [] } }
  for (const k of Object.keys(src)) src[k].events = () => src[k].ev.slice()
  const said = [], spoken = [], calls = []
  let seq = 0
  const D = createTalkDirector({ sources: () => src, reader, callLine, tr1, busy, seed: 's1', ...(anchorAt ? { anchorAt } : {}),
    say: (anchor, line, life) => said.push({ t: +T.t.toFixed(3), anchor, line, life }),
    speak: (a) => { spoken.push({ t: +T.t.toFixed(3), ...a }); return mute ? null : { dur: speakDur, start: speakStart } },
    onCall: (b, occ) => calls.push({ group: occ.group, call: b.bt.call, mc: !!b.bt.mc }) })
  const T = { t: 0 }
  const run = (s, dt = 1 / 60) => { for (let i = 0; i < Math.round(s / dt); i++) { T.t += dt; D.update(dt, cam ? { camera: cam } : undefined) } }
  const push = (k, e) => src[k].ev.push({ ...e, seq: ++seq, t: +T.t.toFixed(3) })
  return { D, src, said, spoken, calls, run, push, T }
}

const C = {}, X = {}
// Register und Decks: Witch und Avian Swordsman haben Karten, Orc Brute (the_uruk_rumble) keine
X.decks = { witch: signatureDeck('witch'), avian: signatureDeck('avian_swordsman'), brute: signatureDeck('orc_brute'), lore: signatureDeck('lorekeeper') }
C.signatureDecks = !!X.decks.witch && !!X.decks.avian && deckCards(X.decks.witch).length > 0 && deckCards(X.decks.brute).length === 0
C.noBlockedInDecks = Object.values(X.decks).filter(Boolean).every((d) => deckCards(d).every((n) => !isBlocked(d, n)))

// Plan je Anlass
const card = (id) => (id === 'witch' ? { deck: { id: X.decks.witch }, num: deckCards(X.decks.witch)[0] } : null)
const sp = (id) => ({ anchor: 'a-' + id, characterId: id })
C.planNotice = JSON.stringify(planOccasion({ cause: 'notice', reason: 'first', group: 'disco_k12', speakers: [sp('frizzlebob')] }, card)) === JSON.stringify([{ sp: 0, call: 'boggle', mc: true }])
  && planOccasion({ cause: 'notice', reason: 'known', group: 'orc_band', speakers: [sp('orc_brute')] }, card)[0].call === 'bingo'
C.planGreet = Object.entries(GREET_CALL).every(([r, c]) => planOccasion({ cause: 'greet', reason: r, speakers: [sp('x')] }, card)[0].call === c) && GREET_CALL.fight === 'bloedsinn'
const pSong = planOccasion({ cause: 'songEnd', speakers: [sp('orc_brute'), sp('witch')] }, card)
C.planSongEndCardFirst = pSong.length === 2 && pSong[0].sp === 1 && pSong[0].role === 'line' && pSong[1].sp === 0 && pSong[1].call === 'bingo'   // wer ein Deck hat, beginnt
const pPause = planOccasion({ cause: 'pause', speakers: [sp('witch'), sp('orc_brute')] }, card)
C.planPauseBoggleLore = pPause.map((b) => b.call || b.role).join() === 'line,boggle,lore' && pPause[0].sp === 0 && pPause[1].sp === 1 && pPause[2].sp === 0
C.planNoCardOneCall = planOccasion({ cause: 'songEnd', speakers: [sp('orc_brute'), sp('nobody')] }, card).map((b) => b.call).join() === 'bingo'

// Lauf: Disco-Pause mit Witch (Karte) und Avian (Karte), Laut 1,0 s
{
  const R = rig()
  R.src.disco.ev.push({ type: 'chatter', group: 'disco_k12', cause: 'pause', id: 'old', characterId: 'witch', seq: 0, t: 0 })   // Altbestand
  R.run(0.5)
  C.oldNotReplayed = R.said.length === 0
  R.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'pause', mood: 'introspektiv', id: 'witch', characterId: 'witch', at: [1, 2] })
  R.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'pause', mood: 'introspektiv', id: 'avian', characterId: 'avian_swordsman', at: [3, 2] })
  R.src.disco.ev[R.src.disco.ev.length - 1].t = R.src.disco.ev[R.src.disco.ev.length - 2].t   // ein Anlass (gleiche Zeit)
  R.run(12)
  X.pause = R.said.map((s) => ({ t: s.t, anchor: s.anchor, text: s.line.text, src: s.line.source, life: +s.life.toFixed(2) }))
  const [a, b, c] = R.said
  C.pauseThreeBeats = R.said.length === 3 && a.anchor === 'disco-witch' && b.anchor === 'disco-avian' && c.anchor === 'disco-witch'
  C.pauseBoggleThenLore = b?.line.text === 'Boggle...?' && c?.line.source === 'CARD' && /ssot-(B|BOGGLE)/.test(c?.line.field)
  const g1 = b.t - a.t - 1.0, g2 = c.t - b.t - 1.0
  X.gaps = [+g1.toFixed(3), +g2.toFixed(3)]
  C.replyGap = [g1, g2].every((g) => g >= TALK.replyGap[0] - 0.02 && g <= TALK.replyGap[1] + 0.02)
  // A bleibt stehen, bis B gelesen ist; höchstens 2 Blasen gleichzeitig (A2 ersetzt A am selben Anker)
  C.bubbleHoldsForReply = a.life >= 1.0 + g1 + readTime(b.line.text) - 1 / 30 && b.life >= 1.0 + g2 + readTime(c.line.text) - 1 / 30   // g gemessen auf Bildtakt (1/60)
  const live = (t) => { const m = new Map(); for (const s of R.said) if (s.t <= t && t < s.t + s.life) m.set(s.anchor, s); return m.size }
  X.maxLive = Math.max(...Array.from({ length: 600 }, (_, i) => live(i * 0.02)))
  C.maxTwoBubbles = X.maxLive <= TALK.maxBubbles
  C.allIssued = R.said.every((s) => isIssuedLine(s.line)) && R.said.every((s) => s.line.source !== 'CALL' || V712.includes(s.line.text))
  C.callsBoldParts = R.said.filter((s) => s.line.source === 'CALL').every((s) => s.line.parts[0] === `*${s.line.text}*` && s.line.speaker === s.anchor)
  C.speakArgs = R.spoken.length === 3 && R.spoken.every((s) => s.group === 'disco_k12' && s.characterId && /^(call|line|lore)$/.test(s.kind) && s.pos?.x === (s.characterId === 'witch' ? 1 : 3)) && R.spoken[1].kind === 'call' && R.spoken[1].text === '*Boggle...?*'
  C.lifeAtLeastRead = R.said.every((s) => s.life >= readTime(s.line.text) - 1e-6)
}
// ohne Laut: Lesezeit; WS-Audio-Verzögerung start verschiebt die Blase
{
  const R = rig({ mute: true })
  R.run(0.1); R.push('npc', { type: 'greet', reason: 'known', id: 'farmer_b', characterId: 'farmer_b' }); R.run(3)
  C.greetCallNoAudio = R.said.length === 1 && R.said[0].anchor === 'npc-farmer_b' && R.said[0].line.text === 'Bingo!' && Math.abs(R.said[0].life - readTime('Bingo!')) < 1e-6
  const Q = rig({ speakStart: 0.4, speakDur: 0.8 })
  Q.run(0.1); Q.push('npc', { type: 'greet', reason: 'fight', id: 'x', source: 'partner', characterId: 'gothgirl' }); Q.run(2)
  X.delayed = Q.said.map((s) => s.t); X.spokeAt = Q.spoken.map((s) => s.t)
  C.startDelaysBubble = Q.said.length === 1 && Q.said[0].anchor === 'stage-right' && Q.said[0].line.text === 'Blödsinn!' && Math.abs(Q.said[0].t - Q.spoken[0].t - 0.4) < 0.03
}
// Liedende Band (Orc Brute ohne Deck + Witch als Gast) · Bemerken der Disco meldet den MC-Ruf · busy verwirft
{
  const R = rig()
  R.run(0.1)
  R.push('band', { type: 'chatter', group: 'orc_band', cause: 'songEnd', id: 'drummer', characterId: 'orc_brute' })
  R.push('band', { type: 'chatter', group: 'orc_band', cause: 'songEnd', id: 'guest', characterId: 'witch' }); R.src.band.ev[1].t = R.src.band.ev[0].t
  R.run(8)
  C.songEndCardThenBingo = R.said.length === 2 && R.said[0].anchor === 'band-guest' && R.said[0].line.source === 'CARD' && R.said[1].anchor === 'band-drummer' && R.said[1].line.text === 'Bingo!'
  R.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'notice', reason: 'first', id: 'mc', characterId: 'frizzlebob' }); R.run(3)
  C.mcNoticeCall = R.said.at(-1)?.anchor === 'disco-mc' && R.said.at(-1)?.line.text === 'Boggle...?' && R.calls.some((c) => c.mc && c.group === 'disco_k12' && c.call === 'boggle')
  let b = false; const B = rig({ busy: () => b })
  B.run(0.1); b = true; B.push('npc', { type: 'greet', reason: 'known', id: 'y', characterId: 'farmer_b' }); B.run(1); b = false; B.run(2)
  C.busyDrops = B.said.length === 0 && B.D.stats().dropped === 1
  // veraltete Anlässe verfallen (staleS), statt nachzuklappern
  const S = rig({ speakDur: 4.5 })
  S.run(0.1); S.push('npc', { type: 'greet', reason: 'known', id: 'a', characterId: 'farmer_b' }); S.run(0.05)
  for (let i = 0; i < 3; i++) S.push('npc', { type: 'greet', reason: 'known', id: 'b' + i, characterId: 'farmer_b' })
  S.run(20)
  C.staleDropped = S.D.stats().dropped >= 1 && S.said.length < 4
}
// tr1 (nur mit lines=tr1): A sagt die Triplet-Zeile mit Satz-Opener
{
  const R = rig({ tr1: true })
  R.run(0.1)
  R.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'pause', id: 'w', characterId: 'witch' })
  R.run(10)
  X.tr1 = R.said.map((s) => s.line.text)
  C.tr1OrFallback = R.said.length >= 1 && R.said[0].line.source === 'CARD' && /ssot-(T|A)/.test(R.said[0].line.field)
}
// Laut nur mit Blase: Sprecher außerhalb des Bildes sprechen nicht (Kamera im Ursprung, Blick nach −z; Disco vorn, Band hinten)
{
  const cam = new PerspectiveCamera(55, 16 / 9, 0.1, 500); cam.updateMatrixWorld()
  const at = (id, out) => (/^disco-/.test(id) ? out.set(0, 1, -8) : /^band-/.test(id) ? out.set(0, 1, 8) : null)
  const R = rig({ cam, anchorAt: at })
  R.run(0.1)
  R.push('band', { type: 'chatter', group: 'orc_band', cause: 'notice', reason: 'first', id: 'drummer', characterId: 'orc_brute' }); R.run(2)
  R.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'notice', reason: 'first', id: 'mc', characterId: 'frizzlebob' }); R.run(2)
  X.view = { said: R.said.map((s) => s.anchor), stats: R.D.stats() }
  C.onlyVisibleSpeak = R.said.length === 1 && R.said[0].anchor === 'disco-mc' && R.spoken.length === 1 && R.D.stats().unseen === 1
  // ungesehener MC-Ruf: keine Blase, kein Laut, aber der MC wird freigegeben (tanzt)
  const Q = rig({ cam, anchorAt: (id, out) => (id === 'disco-mc' ? out.set(0, 1, 8) : null) })
  Q.run(0.1); Q.push('disco', { type: 'chatter', group: 'disco_k12', cause: 'notice', reason: 'first', id: 'mc', characterId: 'frizzlebob' }); Q.run(1)
  // zu weit weg (über nearR), obwohl im Bild: schweigt
  const F = createTalkDirector({ sources: () => ({ disco: { events: () => fe.slice() } }), reader, callLine, anchorAt: (id, out) => out.set(0, 1, -40), player: () => ({ x: 0, z: 0 }), say: () => fs.push(1), speak: () => null })
  const fe = [], fs = []; F.update(0.1, { camera: cam }); fe.push({ type: 'chatter', group: 'disco_k12', cause: 'notice', reason: 'first', id: 'mc', characterId: 'frizzlebob', seq: 1, t: 0 }); for (let i = 0; i < 30; i++) F.update(1 / 30, { camera: cam })
  C.farSilent = fs.length === 0 && F.stats().unseen === 1
  C.unseenMcStillFreed = Q.said.length === 0 && Q.spoken.length === 0 && Q.calls.some((c) => c.mc)
}
// Prüfhilfe inject: ein Bewohner erzählt eine Karte (Lorekeeper hat ein Signatur-Deck mit Karten)
{
  const R = rig(); R.run(0.1)
  R.D.inject({ group: 'resident', cause: 'songEnd', speakers: [{ anchor: 'npc-lorekeeper', characterId: 'lorekeeper' }] }); R.run(3)
  C.injectUsesRealPath = R.said.length === 1 && R.said[0].anchor === 'npc-lorekeeper' && R.said[0].line.source === 'CARD' && isIssuedLine(R.said[0].line)
}
// tr1-Satzbau (SSOT S8, Georg TUNE 25.10.): über alle tr1-Zeilen nie ein Satz-Opener vor einem Imperativ o. Ä. ('other'), own_clause mit Punkt, kein „know collect“
{
  const rot = createSentenceOpenerRotation(); let n = 0, bad = []
  for (const [d, num, name] of CARDS.cards.map(([di, nu, na]) => [CARDS.decks[di][0], nu, na])) { const t = tr1Line(d, num); if (!t) continue; const card = { deck: { id: d }, num, name }, st = tr1Start(card), o = rot.next(st), l = lineT(card, o, t); n++
    if ((o.slot !== 'own_clause' && st === 'other') || (o.slot === 'own_clause' && o.stance !== 'Szenenwechsel' && !l.startsWith(o.text + '. '))) bad.push(l) }
  X.tr1Grammar = { lines: n, bad: bad.slice(0, 3) }
  C.tr1OpenerFitsStart = n > 400 && bad.length === 0
}
// cardHint (S3): nur aus dem eigenen Signatur-Deck; eine fremde Szenen-Karte wird ignoriert
{ const own = deckCards(signatureDeck('witch'))[3], R1 = createTalkDirector({ sources: () => ({}), reader, callLine, say: () => {}, cardHint: (cid) => (cid === 'witch' ? { deck: { id: signatureDeck('witch') }, num: own } : { deck: { id: 'kayfabizarro_pulitzer_punk' }, num: 1 }) })
  R1.inject({ group: 'disco_k12', cause: 'songEnd', speakers: [{ anchor: 'disco-witch', characterId: 'witch' }] }); R1.update(0.1); const L1 = R1.log()[0]
  R1.inject({ group: 'disco_k12', cause: 'songEnd', speakers: [{ anchor: 'disco-minion', characterId: 'skeleton_minion' }] }); for (let i = 0; i < 400; i++) R1.update(0.05); const L2 = R1.log().find((e) => e.anchor === 'disco-minion')
  X.hint = [L1?.text, L2?.text]
  const t1 = byKey.get(signatureDeck('witch') + '#' + own)?.name.replace(/\s*\(.*\)\s*/, '').trim(), t2 = byKey.get('kayfabizarro_pulitzer_punk#1')?.name.replace(/\s*\(.*\)\s*/, '').trim()
  X.hintTitles = [t1, t2]
  C.cardHintOwnDeckOnly = !!L1 && !!L2 && L1.source === 'CARD' && L1.text.includes(t1) && L2.source === 'CARD' && !L2.text.includes(t2) }
process.exit(report('unit-talkDirector (WS-NPC Wechselrede chat=syl)', C, X))
