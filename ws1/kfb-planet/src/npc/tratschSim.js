// WS-NPC Karten-Tratsch · Stufe 0 (Konzept docs/ws-npc/KARTEN_TRATSCH_KONZEPT_R1.md, Georg-Freigabe 23.10.): Text-Simulation, rein, ohne three/DOM,
// deterministisch über den Seed (Node-geprüft: test/unit/tratschSim.mjs). Keine Spieländerung – das Spiel liest dieses Modul (noch) nicht.
// Figuren erzählen einander Karten (Triplet t1, sonst Kartentext roh „Name: Power“ bzw. Schweigen), der Hörer antwortet mit einem Call
// Ruf-Grammatik (Georg 24.10., eine Bedeutung je Ruf überall): Bingo! ja/annehmen (+) · Boggle...? hä, mehr davon (offen, Gegenüber legt nach) ·
// Bongo. nicht jetzt/anders – weiches Nein, Tür bleibt offen (Erzähler legt dieselbe Karte anders oder eine andere nach; neutral, Wiederholung erlaubt) ·
// Blödsinn! hartes Nein, Dialog endet (−, Streit) · Humbug?! vergiss es (MiB-Blitzdingsen, V-530).
// Ob eine Karte zündet, hängt nie am Inhalt (Georg 23.10.), nur an Beziehung, Status, Wiederholung, Blasen-Nähe, roh/erzählt, Art und gedeckeltem Zufall.
// Dramaturg (Georg „Conflict is king!“, Lead §4b): greift nur in die AUSWAHL ein (wer wem begegnet, welche Karte), nie in die Bewertung.
import { rngOf } from '../world/fluff.js'

export const TRATSCH = Object.freeze({
  slotsPerDay: 12, firstHour: 8, starter: 6, chainMax: 3, perCardPerDay: 2, bubbleMax: 140,
  // Stellwerte Stufe 0 (kalibriert 23.10. auf die Zielbänder T2/T9; Georg stellt sie am Protokoll ein). bubC = typische Nähe (Mitte der Blasen-Nähe)
  // raw 0,35 (vorher 0,6): roh heißt jetzt Titel + Lore erzählt, nicht mehr Regeltext vorgelesen (Lead 23.10.)
  w: Object.freeze({ rel: 0.35, sta: 0.3, rep: 0.35, bub: 1.4, bubC: 0.15, raw: 0.35, rnd: 0.55 }),
  // Bänder des Werts s: Bingo! ≥ hi · Boggle...? ≥ lo · Bongo. ≥ soft · sonst Blödsinn! (nach dem Nachlegen nur noch Bingo!/Bongo./Blödsinn!)
  theta: Object.freeze({ hi: 0.45, lo: -0.1, soft: -0.6, boggle: 0.45 }),
  art: Object.freeze({ Tratschmaul: 0.4, Skeptiker: -0.6, 'Übertreiber': 0.25, Schweiger: 0 }),
  talk: Object.freeze({ Tratschmaul: 1.6, Skeptiker: 1, 'Übertreiber': 1.3, Schweiger: 0.4 }),
  meet: Object.freeze({ same: 3, resident: 1.4, cross: 0.5 }),
  // Lauf 2 (Lead 23.10., T13 technisch): Konflikt-Phase länger (5 statt 4 Slots), Aufbau kürzer (3), Glättung schneller (α 0,5 statt 0,35) –
  // die geglättete Spannung erreicht ihr Phasenziel sonst nicht innerhalb einer Phase (Raster s1–10: T13 0,153 → 0,217, Q 0,35, T14 0,37, T8 0,82)
  // tr1-Lauf (24.10.): Phasenziele schärfer (Konflikt 0,8, Ruhe 0,1) – mit den tr1-Zeilen lag T13 bei 0,18; Raster s1–10: 0,224 bei Q 0,37, T14 0,46, T8 0,79
  drama: Object.freeze({ phases: Object.freeze([['Aufbau', 3, 0.4], ['Konflikt', 5, 0.8], ['Ruhe', 4, 0.1]]), alpha: 0.5, k: 2.2, debateMax: 3, crossOverlap: 0.2 }),
  gegenrede: 0.25, mib: Object.freeze({ perDay: 3 }),
  // Lauf 2 (Georg 23.10.): wählerischer mit wachsendem Wissen (Sättigung über fremde Decks) und eigenes Deck als Identität (Anteil am Weltbild)
  sat: 0.35, ident: Object.freeze({ min: 0.5, w: 1.6 }), ruheBubble: 1.2,
  conflict: Object.freeze({ bloedsinn: 1, boggle: 0.5, bongo: 0.4, bingo: 0.1, debate: 0.3 }),
})
export const ARTS = Object.freeze(['Tratschmaul', 'Skeptiker', 'Übertreiber', 'Schweiger'])
export const LOYALTY = Object.freeze(['angepasst', 'rebellisch'])

const STOP = new Set(['the', 'and', 'der', 'die', 'das', 'des', 'von', 'mode'])
const words = (s) => (String(s).toLowerCase().match(/[a-z0-9½]+/g) || []).filter((x) => x.length >= 3 && !STOP.has(x))
// Triplet gehört zur Karte, wenn das erste Namenswort vorn steht und ≥ 50 % der Namenswörter im Kopf (8 Wörter) vorkommen („Titel vorn“, Spec R2);
// Name ohne „Lvl n:“/„Mode n:“-Präfix und ohne Untertitel nach „ – “ oder „(“
// tr1 (SSOT 24.10.): ganze Sätze, Titel IRGENDWO im Satz (W2: ≤ 70 % mit Titel vorn) → ≥ 50 % der Namenswörter kommen in der Zeile vor
export function lineFits(name, line) { const base = String(name).replace(/^(lvl|mode)\s*\d+\s*:\s*/i, '').split(/ – | - |\(/)[0], nw = new Set(words(base)), lw = new Set(words(line)); return !nw.size || [...nw].filter((x) => lw.has(x)).length / nw.size >= 0.5 }
// beginnt die Zeile mit dem Titel? (nur dann passt ein into_title-Opener grammatisch)
export function startsWithTitle(name, line) { const base = String(name).replace(/^(lvl|mode)\s*\d+\s*:\s*/i, '').split(/ – | - |\(/)[0].trim().toLowerCase(), l = String(line).toLowerCase(); return !!base && (l.startsWith(base) || l.startsWith('the ' + base.replace(/^the /, ''))) }
export function tripletFits(name, triplet) {
  const base = String(name).replace(/^(lvl|mode)\s*\d+\s*:\s*/i, '').split(/ – | - |\(/)[0], nw = words(base), head = words(String(triplet).split(/\s+/).slice(0, 8).join(' '))
  return !nw.length || (head.slice(0, 3).includes(nw[0]) && nw.filter((x) => head.includes(x)).length / new Set(nw).size >= 0.5)
}

// Daten: cards = src/data/cards.json, data = src/data/npc/tratsch/tratsch-data.r1.json
// Rückfall ohne abgenommenes Triplet (Georg 23.10., ersetzt „Titel: Power“): Titel + gedruckte Lore wörtlich, Power-Mechanik nie; Lore in ganzen
// Sätzen bis zur Blasengrenze (nur weglassen, nie ergänzen); passt kein Satz, nur der Titel
// Rückfall-Bereinigung R1.2 (Georg 24.10., SSOT_SPOKEN_LINES/lore_fallback.py, 1:1): Klammerzusätze, Stat-/Power-Angaben, führende Etiketten mit
// Doppelpunkt (Titel oder Versalien-Label) weg, restliche Doppelpunkte → Punkt; nur weglassen, nie ergänzen
const LF_STAT = /\b(power|rage|attack|focus|hp|xp|score|level|lvl)\s*:?\s*[-+]?\d+(\.\d+)?\s*\.?/gi, LF_BRACKET = /\s*[([{][^)\]}]*[)\]}]/g
const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export function cleanLore(title, lore) {
  let s = String(lore || '').trim()
  s = s.replace(LF_BRACKET, '').replace(LF_STAT, '')
  s = s.replace(new RegExp('^\\s*' + reEsc(String(title).trim()) + '\\s*[:\\-–—]\\s*', 'i'), '')
  s = s.replace(/^\s*[A-Z0-9][A-Z0-9 '&!?.\-]{2,}:\s*/, '').replace(/\s*:\s*/g, '. ').replace(/\.\s*\./g, '.').replace(/\s{2,}/g, ' ').replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')
  if (s && s[0] === s[0].toLowerCase() && s[0] !== s[0].toUpperCase()) s = s[0].toUpperCase() + s.slice(1)
  return s
}
const cleaned = (c) => ({ ...c, lore: cleanLore(c.name, c.lore) })
export const rawText = (c, max = 140) => { const head = `${c.name}.`, room = max - head.length - 1, lore = room > 0 ? loreText(cleaned(c), room) : null; return lore ? `${head} ${lore}` : head }
export function loreText(c, max = 140) { const S = String(c.lore).match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [String(c.lore)]; let out = ''; for (const x of S) { if ((out + x).trim().length > max) break; out += x } return out.trim() || (String(c.lore).length <= max ? String(c.lore) : null) } // null: kein Satz passt in die Blase

// Baukasten (Deck-Songs, BAUKASTEN_SPOKEN_LINES_SSOT_R1 §5): fester Text + Opener aus dem Pool (nur status POOL), Opener und Karte als EIN Satz
// into_title: „Opener Titel …“ (Frage-Opener → „?“ am Ende) · own_clause: „Opener: …“ · interjection: „Opener, …“ (nur in Debatten)
// Kartenpassung („I once met“ nur Personen, „Ever tasted“ nur Essbares, „I found a“ nur Objekte, „You played“ nur Spielbares): Kartenart fehlt → weglassen
export const OPENER_FIT_ONLY = Object.freeze(['I once met', 'My neighbour is', 'Ever tasted', 'I found a', 'You played'])
// Georg 24.10. (Urteil Lauf 2): überspezifisch, lenkt von der Karte ab – nie verwenden, auch wenn der Pool ihn noch als POOL führt (Deck-Songs streicht ihn)
export const OPENER_BANNED = Object.freeze(['You with the card in your hand'])
// Streichvorschläge bei WS0 (Status §31, Deck-Songs 24.10.): meiden, bis WS0 entscheidet – fällt die Entscheidung, hier nachziehen
export const OPENER_AVOID_PENDING = Object.freeze(['You played', 'Welcome to', 'Ever tasted', 'This one has a rule', 'The deck insists on', 'Here is something nobody asked for', 'Before we continue',
  'Meanwhile elsewhere']) // Audit PRÜFEN „nur Song, nicht Tratsch“ (behauptet Ortswechsel), Deck-Songs 24.10.
// tr1-Zeilen sind ganze Sätze (SSOT S2): davor passen nur Opener, die einen Satz einleiten (S8 „Opener + Zeile = ein Satz“). Opener, die ein Substantiv
// verlangen („Let me tell you about“, „Welcome to“, „Did you hear of“ …), ergäben „… about The Happy Dagger is happy“ – sie bleiben für tr1 aus.
export const CLAUSE_OPENERS = Object.freeze(['What if', 'You know', 'Do you know', 'I used to believe', 'Remember'])
// Wörter, die nach Komma bzw. Satz-Opener klein werden dürfen (keine Namen); beginnt die Zeile mit dem Titel, bleibt sie groß
const FUNC = new Set(['a', 'an', 'the', 'any', 'every', 'each', 'no', 'some', 'in', 'on', 'at', 'for', 'as', 'when', 'if', 'so', 'once', 'after', 'before', 'with', 'by', 'to', 'from', 'all', 'most', 'nobody', 'everyone', 'everybody', 'there', 'this', 'that', 'these', 'those', 'it', 'its', 'one', 'two', 'three', 'only', 'even', 'never', 'always', 'here'])
export function lineStart(name, line) { if (startsWithTitle(name, line)) return 'title'; const w = (String(line).match(/^[A-Za-z']+/) || [''])[0]; return FUNC.has(w.toLowerCase()) ? 'func' : 'other' }
const lower1 = (line, start) => (start === 'func' ? line.charAt(0).toLowerCase() + line.slice(1) : line)
export function composeLine(op, line, start = 'title', rawTitle = null) {
  if (!op) return line
  // Rückfall „Titel. Lore“ mit Frage-Opener: das „?“ gehört hinter den Titel („Did you hear of The Maze? You cannot leave.“)
  if (rawTitle && op.slot === 'into_title' && op.class === 'Q' && line.startsWith(rawTitle + '.')) return `${op.opener} ${rawTitle}?${line.slice(rawTitle.length + 1)}`
  if (op.slot === 'own_clause') { const comma = op.stance === 'Szenenwechsel'; return `${op.opener.replace(/[.:!?,]+$/, '')}${comma ? ',' : '.'} ${comma ? lower1(line, start) : line}` } // S1: nie Doppelpunkt
  if (op.slot === 'interjection') return `${op.opener.replace(/[,.]+$/, '')}, ${lower1(line, start)}`
  const t = `${op.opener} ${lower1(line, start)}`; return op.class === 'Q' || op.opener === 'What if' ? t.replace(/[.!?…]*$/, '?') : t // Frage-Opener und „What if“ → Frage
}
// darf dieser Opener vor dieser Zeile stehen? into_title nur Satz-Opener und nur vor Titel- oder Funktionswort-Anfang; own_clause (Punkt) immer
// Deck-Songs 24.10. (Pool @a428e091: Satzbau into_clause, Feld clause_ok): vor einer tr1-Zeile nur Satz-Opener (into_clause/clause_ok) oder own_clause;
// Substantiv-Opener (into_title ohne clause_ok) nur vor dem Titel, also im Rückfall „Titel. Lore“
export const isClauseOpener = (op) => op.slot === 'into_clause' || op.clause_ok === true || (op.clause_ok == null && CLAUSE_OPENERS.includes(op.opener))
export const openerFits = (op, start, tr1 = true, raw = false) => (op.slot !== 'into_title' && op.slot !== 'into_clause') || !tr1 || (raw ? start === 'title' : isClauseOpener(op) && start !== 'other')
// BOGGLE-Nachlegen (Deck-Songs 23.10.): der Lore-Satz, der im Triplet NICHT steckt (Wortanteil < 50 %); nichts wird doppelt gesprochen
export function loreRest(c0, triplet, max = 140) {
  const c = cleaned(c0); if (!triplet) return loreText(c, max)
  const tw = new Set(words(triplet)), S = String(c.lore).match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [String(c.lore)]
  const fresh = S.filter((x) => { const w = words(x); return w.length && w.filter((v) => tw.has(v)).length / w.length < 0.5 })
  let out = ''; for (const x of fresh) { if ((out + x).trim().length > max) break; out += x } return out.trim() || null
}

export function buildLibrary(cards, data) {
  const decks = new Map(), title = new Map(), misfit = []
  cards.decks.forEach((d, i) => { title.set(d[0], d[1]); decks.set(d[0], new Map()) })
  for (const c of cards.cards) decks.get(cards.decks[c[0]][0]).set(c[1], { name: c[2], power: c[3], lore: c[4] })
  for (const [dk, P] of Object.entries(data.print || {})) { const m = new Map(); for (const [n, [name, power, lore]] of Object.entries(P.cards)) m.set(+n, { name, power, lore, print: true }); decks.set(dk, m) } // Druck ist maßgeblich
  const trip = new Map()
  for (const [dk, T] of Object.entries(data.triplets || {})) for (const [n, t] of Object.entries(T.cards)) {
    const c = decks.get(dk)?.get(+n), fits = data.source?.revision === 'tr1' ? lineFits : tripletFits; if (c && fits(c.name, t)) trip.set(dk + '#' + n, t); else misfit.push({ card: dk + '#' + n, name: c?.name ?? null, triplet: t.slice(0, 60) }) }
  // SSOT S12: gesperrte Karten werden nie gesprochen, auch nicht roh – sie kommen weder ins Starter-Set noch in Erzählungen
  const blocked = new Set(Object.entries(data.blocked || {}).flatMap(([dk, B]) => Object.keys(B.cards).map((n) => dk + '#' + n)))
  const openers = (data.openers?.openers || []).filter((o) => o.status === 'POOL' && !OPENER_FIT_ONLY.includes(o.opener) && !OPENER_BANNED.includes(o.opener) && !OPENER_AVOID_PENDING.includes(o.opener))
  return { decks, title, trip, misfit, openers, blocked, tr1: data.source?.revision === 'tr1', card: (k) => { const [d, n] = k.split('#'); return decks.get(d)?.get(+n) ?? null }, deckOf: (k) => k.split('#')[0] }
}

// fallback: 'roh' = Titel + Lore (Georg 23.10.), 'stumm' = ohne Triplet schweigen (Vergleich)
export function createTratschSim({ lib, cast, seed = 7, drama = true, fallback = 'roh', mib = false, R = TRATSCH }) {
  const rng = rngOf('tratsch', seed), pick = (arr) => arr[Math.floor(rng() * arr.length)]
  const wpick = (items, wt) => { const ws = items.map(wt), sum = ws.reduce((a, b) => a + b, 0); if (!(sum > 0)) return null; let r = rng() * sum; for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i] } return items.at(-1) }
  const F = cast.map((c) => ({ ...c }))
  const ids = F.map((f) => f.id), byId = Object.fromEntries(F.map((f) => [f.id, f]))
  const t1Decks = [...new Set([...lib.trip.keys()].map(lib.deckOf))].sort()
  // SIM-Aufstellung (keine Kanon-Zuordnung): Deck aus der Signatur-Liste, sonst per Seed aus den Decks mit t1-Set; Art/Haltung per Seed
  for (const f of F) {
    const n = f.deck ? (lib.decks.get(f.deck)?.size ?? 0) : 0
    if (!f.deck || n === 0) { const free = t1Decks.filter((d) => !F.some((g) => g.deck === d)); f.deckNote = f.deck ? `Signatur-Deck ${f.deck} hat 0 Karten → SIM-Seed` : 'keine Signatur-Zeile → SIM-Seed'; f.deck = pick(free); f.deckBasis = 'SIM-Seed' }
    f.art = f.art || pick(ARTS); f.loyal = f.loyal || pick(LOYALTY)
  }
  // Wissen: Map karte → { from, chain, day, via, k }
  const K = Object.fromEntries(F.map((f) => [f.id, new Map()]))
  for (const f of F) { const nums = [...lib.decks.get(f.deck).keys()].filter((n) => !lib.blocked?.has(f.deck + '#' + n)).sort((a, b) => a - b), start = []; const pool = nums.slice(); while (start.length < R.starter && pool.length) start.push(pool.splice(Math.floor(rng() * pool.length), 1)[0])
    for (const n of start.sort((a, b) => a - b)) K[f.id].set(f.deck + '#' + n, { from: 'start', chain: [], day: 0, via: 'start', k: 3 }) }
  const rel = {}, relOf = (a, b) => rel[a + '>' + b] ?? (byId[a].group === byId[b].group ? 1 : 0), addRel = (a, b, d) => { rel[a + '>' + b] = Math.max(-3, Math.min(3, relOf(a, b) + d)) }
  const convinced = Object.fromEntries(ids.map((i) => [i, new Set()])), status = (i) => { const n = convinced[i].size; return n >= 6 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0 }
  const heard = Object.fromEntries(ids.map((i) => [i, new Map()])), rejected = Object.fromEntries(ids.map((i) => [i, new Set()])), told = new Set(), wiped = Object.fromEntries(ids.map((i) => [i, new Map()]))
  const silenced = Object.fromEntries(ids.map((i) => [i, new Set()])), defiant = Object.fromEntries(ids.map((i) => [i, new Set()]))
  const OP = { usedToday: new Set(), recentFam: [], lastClass: {} } // Opener: nicht zweimal am Tag, Familienabstand ≥ 10, Frage/Behauptung im Wechsel je Erzähler
  const overlap = (a, b) => { const A = K[a], B = K[b]; let i = 0; for (const k of A.keys()) if (B.has(k)) i++; const u = A.size + B.size - i; return u ? i / u : 0 }
  const S = { day: 1, slot: 0, tension: 0, phase: null, log: [], series: [], adoptToday: new Map(), perCard: new Map(), mibToday: new Set(), mibQueue: [], stats: { ex: 0, ms: 0 }, bub: Object.fromEntries(F.map((f) => [f.id, f.group])) } // Blasen: Start = Gruppen, dann täglich aus dem BINGO-Graphen

  function textOf(card, raw) { const c = lib.card(card); return raw ? rawText(c, R.bubbleMax) : lib.trip.get(card) }
  function pickOpener(E, base, raw, inDebate, start = 'title', rawName = null) {
    if (!lib.openers.length) return null
    const want = OP.lastClass[E] === 'Q' ? 'notQ' : 'Q'
    const ok = lib.openers.filter((o) => !OP.usedToday.has(o.opener) && !(o.family && OP.recentFam.includes(o.family)) && openerFits(o, start, lib.tr1, raw) && (o.slot !== 'interjection' || inDebate) && composeLine(o, base, start, raw ? rawName : null).length <= R.bubbleMax)
    if (!ok.length) return null
    const o = wpick(ok, (x) => ((want === 'Q') === (x.class === 'Q') ? 3 : 1))
    OP.usedToday.add(o.opener); if (o.family) { OP.recentFam.push(o.family); if (OP.recentFam.length > 10) OP.recentFam.shift() } OP.lastClass[E] = o.class
    return o
  }
  // Sättigung: Zahl der fremden Decks im Wissen; Identität: Anteil des eigenen Signatur-Decks, falls die fremde Karte dazukäme (nie Inhalt)
  const foreignDecks = (H) => new Set([...K[H].keys()].map(lib.deckOf).filter((d) => d !== byId[H].deck)).size
  const ownShare = (H, extra = 0) => { let own = 0; for (const k of K[H].keys()) if (lib.deckOf(k) === byId[H].deck) own++; return own / Math.max(1, K[H].size + extra) }
  function identPenalty(H, card) { if (lib.deckOf(card) === byId[H].deck || K[H].has(card)) return 0; const after = ownShare(H, 1); return -R.ident.w * Math.max(0, R.ident.min - after) / R.ident.min }
  // Bewertung (nie Kartentext): Faktoren und Wert s; rnd getrennt für T8
  function judge(H, E, card, raw) {
    const ov = overlap(H, E), f = { rel: R.w.rel * relOf(H, E), sta: R.w.sta * status(E), rep: R.w.rep * Math.min(3, heard[H].get(card)?.size ?? 0), bub: R.w.bub * (ov - R.w.bubC), raw: raw ? -R.w.raw : 0, art: R.art[byId[H].art] ?? 0, sat: -R.sat * Math.log2(1 + foreignDecks(H)), ident: identPenalty(H, card), rnd: R.w.rnd * (rng() * 2 - 1) }
    const s = Object.values(f).reduce((a, b) => a + b, 0); return { s, f, ov }
  }
  const callOf = (s, raw, second) => (s >= R.theta.hi ? 'BINGO' : !second && s >= R.theta.lo ? 'BOGGLE' : s >= R.theta.soft ? 'BONGO' : 'Blödsinn')

  function cardsFor(E, H) {
    const today = S.day
    return [...K[E].entries()].filter(([k, v]) => !lib.blocked?.has(k) && v.from !== H && !v.chain.includes(H) && !told.has(E + '>' + H + '>' + k) && !rejected[H].has(k + '<' + E) && !silenced[E].has(k) && (S.perCard.get(E + '|' + k + '|' + today) ?? 0) < R.perCardPerDay && (fallback !== 'stumm' || lib.trip.has(k)))
  }
  function chooseCard(E, H, mode) {
    const C = cardsFor(E, H); if (!C.length) return null
    return wpick(C, ([k, v]) => { let w = v.k + (S.day - v.day <= 1 && v.from !== 'start' ? 2 : 0) + (lib.deckOf(k) === byId[E].deck ? 1 : 0) + (defiant[E].has(k) ? 2 : 0)
      if (mode === 'konflikt') { const rej = ids.filter((i) => rejected[i].has(k + '<' + E) || [...rejected[i]].some((x) => x.startsWith(k + '<'))).length, mode2 = S.adoptToday.get(k)?.size ?? 0; w *= 1 + rej + mode2 }
      if (mode === 'ruhe') { const friends = ids.filter((i) => i !== H && S.bub[i] === S.bub[H] && K[i].has(k)).length; w *= 1 + friends }
      return w })?.[0] ?? null
  }

  function chooseCardExcept(E, H, not) { const C = cardsFor(E, H).filter(([k]) => k !== not); if (!C.length) return null; return wpick(C, ([k, v]) => v.k + (lib.deckOf(k) === byId[E].deck ? 1 : 0))?.[0] ?? null }
  function adopt(H, E, card, via) {
    const src = K[E].get(card), kE = byId[E].art === 'Übertreiber' ? 3 : src.k, old = K[H].get(card)
    if (old) old.k = Math.min(3, old.k + 1); else K[H].set(card, { from: E, chain: [E, ...src.chain].slice(0, R.chainMax), day: S.day, via, k: Math.max(1, kE - 1), orig: src.from === 'start' ? E : (src.orig ?? src.chain.at(-1) ?? E) })
    wiped[H].delete(card); addRel(H, E, 1); convinced[E].add(H)
    if (!S.adoptToday.has(card)) S.adoptToday.set(card, new Set()); S.adoptToday.get(card).add(H)
  }
  // ein Austausch E → H; Rückgabe Protokoll-Eintrag
  function exchange(E, H, card, tag) {
    const t0 = performance.now(), raw = !lib.trip.has(card), base = raw ? textOf(card, true) : textOf(card, false), st0 = lineStart(lib.card(card).name, base), op = pickOpener(E, base, raw, !!tag, st0, raw ? lib.card(card).name : null)
    const e = { kind: 'tell', E, H, card, raw, base, start: st0, opener: op ? op.opener : null, text: composeLine(op, base, st0, raw ? lib.card(card).name : null), steps: [], tag }
    told.add(E + '>' + H + '>' + card); S.perCard.set(E + '|' + card + '|' + S.day, (S.perCard.get(E + '|' + card + '|' + S.day) ?? 0) + 1)
    let j = judge(H, E, card, raw), call = callOf(j.s, raw, false), j0 = j.s - j.f.rnd
    if (!heard[H].has(card)) heard[H].set(card, new Set()); heard[H].get(card).add(E) // erst nach der Bewertung: „gehört“ zählt frühere Erzähler
    e.steps.push({ call, s: j.s, f: j.f, ov: j.ov, noRnd: callOf(j0, raw, false) })
    if (call === 'BONGO') {
      // Bongo. = anders bitte: rohe Karte → dieselbe als Triplet; sonst eine andere Karte (einmal nachlegen)
      if (raw && lib.trip.has(card)) { const b2 = textOf(card, false), s2t = lineStart(lib.card(card).name, b2), o2 = pickOpener(E, b2, false, true, s2t); e.steps.push({ add: 'Triplet', card, text: composeLine(o2, b2, s2t), base: b2, start: s2t, opener: o2 ? o2.opener : null }); j = judge(H, E, card, false); call = callOf(j.s, false, true); e.steps.push({ call, s: j.s, f: j.f, ov: j.ov, noRnd: callOf(j.s - j.f.rnd, false, true) }) }
      else { const k2 = (cardsFor(E, H).map(([k]) => k).filter((k) => k !== card))[0] ? chooseCardExcept(E, H, card) : null
        if (!k2) { e.steps.push({ add: 'nichts anderes' }); call = 'BONGO' }
        else { const r2 = !lib.trip.has(k2), b2 = textOf(k2, r2), s2t = lineStart(lib.card(k2).name, b2), o2 = pickOpener(E, b2, r2, true, s2t, r2 ? lib.card(k2).name : null)
          e.steps.push({ add: 'andere Karte', card: k2, raw: r2, text: composeLine(o2, b2, s2t, r2 ? lib.card(k2).name : null), base: b2, start: s2t, opener: o2 ? o2.opener : null }); e.card2 = k2
          told.add(E + '>' + H + '>' + k2); S.perCard.set(E + '|' + k2 + '|' + S.day, (S.perCard.get(E + '|' + k2 + '|' + S.day) ?? 0) + 1)
          j = judge(H, E, k2, r2); if (!heard[H].has(k2)) heard[H].set(k2, new Set()); heard[H].get(k2).add(E)
          call = callOf(j.s, r2, true); e.steps.push({ call, s: j.s, f: j.f, ov: j.ov, noRnd: callOf(j.s - j.f.rnd, r2, true) }) } }
    } else if (call === 'BOGGLE') {
      const lore = loreRest(lib.card(card), raw ? e.base : lib.trip.get(card), R.bubbleMax), boost = lore ? R.theta.boggle : 0 // Lore-Satz, der im Triplet nicht steckt; sonst keine Antwort, kein Bonus
      e.steps.push(lore ? { add: 'Lore', text: lore } : { add: 'ohne Antwort' }); const s2 = j.s + boost; call = callOf(s2, raw, true)
      e.steps.push({ call, s: s2, noRnd: callOf(j.s - j.f.rnd + boost, raw, true) })
    }
    const first = e.steps[0].call
    const target = e.card2 ?? card // nach Bongo. mit anderer Karte gilt der Ausgang für die zweite Karte
    if (call === 'BINGO') { adopt(H, E, target, first === 'BOGGLE' ? 'boggle-bingo' : first === 'BONGO' ? 'bongo-bingo' : 'bingo'); e.out = 'übernommen' }
    else if (call === 'Blödsinn') { addRel(H, E, -1); rejected[H].add(target + '<' + E); e.out = 'abgelehnt' }
    else { for (const k of [card, e.card2].filter(Boolean)) told.delete(E + '>' + H + '>' + k); e.out = 'später' } // Bongo.: neutral, Tür offen, Wiederholung erlaubt
    // über Blasengrenze: andere Gruppe und kaum geteilte Karten
    e.cross = S.bub[E] !== S.bub[H] && j.ov < R.drama.crossOverlap; S.stats.ex++; S.stats.ms += performance.now() - t0
    const C = R.conflict; let c = e.steps.reduce((a, x) => a + (x.call === 'Blödsinn' ? C.bloedsinn : x.call === 'BOGGLE' ? C.boggle : x.call === 'BONGO' ? C.bongo : x.call === 'BINGO' ? C.bingo : 0), 0); if (e.cross) c *= 1.2
    e.conflict = c; return e
  }

  function phaseAt(slot) { let s = slot; for (const [name, len, target] of R.drama.phases) { if (s < len) return { name, target }; s -= len } return { name: R.drama.phases[0][0], target: R.drama.phases[0][2] } }
  function choosePair(ph) {
    const pairs = []; for (const a of ids) for (const b of ids) if (a !== b) pairs.push([a, b])
    const base = ([E, H]) => { const g = byId[E].group === byId[H].group ? R.meet.same : (byId[E].group === 'bewohner' || byId[H].group === 'bewohner') ? R.meet.resident : R.meet.cross; return g * (R.talk[byId[E].art] ?? 1) }
    if (!drama) return wpick(pairs, base)
    const want = S.tension < ph.target ? 1 : -1 // unter Ziel: Konflikt suchen, darüber: beruhigen
    // Konfliktpotenzial eines Paars (nur Zustände): andere Gruppe, gestörte Beziehung, kaum geteilte Karten → 0…1, zentriert
    const cp = ([E, H]) => 0.5 * (S.bub[E] !== S.bub[H]) + 0.3 * (relOf(H, E) < 0 ? 1 : 0) + 0.2 * (1 - Math.min(1, overlap(E, H) * 3)) - 0.5
    // Ruhe-Phase (Lauf 2): bevorzugt innerhalb der Blase paaren – Blasen schärfen sich, Konflikt bleibt den Konflikt-Slots
    const ruhe = ph.name === 'Ruhe' ? ([E, H]) => Math.exp(R.ruheBubble * (S.bub[E] === S.bub[H] ? 1 : -1)) : () => 1
    return wpick(pairs, (p) => base(p) * Math.exp(want * R.drama.k * cp(p)) * ruhe(p))
  }

  function runMib() {
    for (const { card, victims } of S.mibQueue.splice(0)) {
      const e = { kind: 'mib', card, victims, by: [] }
      for (const v of victims) { if (!K[v].has(card)) continue; K[v].delete(card); wiped[v].set(card, S.day) }
      for (const i of ids) if (!victims.includes(i) && K[i].has(card)) { if (byId[i].loyal === 'rebellisch') { K[i].get(card).k = 3; defiant[i].add(card); e.by.push([i, 'rebellisch', 'merkt sich die Karte erst recht']) } else { silenced[i].add(card); e.by.push([i, 'angepasst', 'erzählt sie nicht mehr weiter']) } }
      S.log.push({ ...e, day: S.day, slot: S.slot }); S.tension = S.tension * (1 - R.drama.alpha) + R.drama.alpha * 1
    }
  }

  function step() {
    const ph = phaseAt(S.slot); S.phase = ph.name
    if (mib && S.mibQueue.length) runMib()
    const pair = choosePair(ph); if (!pair) return
    const [E, H] = pair, mode = !drama ? null : S.tension < ph.target ? 'konflikt' : 'ruhe', card = chooseCard(E, H, mode)
    if (!card) { S.log.push({ kind: 'still', E, H, day: S.day, slot: S.slot, phase: ph.name }); S.series.push({ day: S.day, slot: S.slot, tension: S.tension, phase: ph.name }); return }
    const e = exchange(E, H, card, null); e.day = S.day; e.slot = S.slot; e.phase = ph.name; S.log.push(e)
    let c = e.conflict
    // Debatte: Dramaturg im Konflikt über Blasengrenze, sonst Gegenrede nach Blödsinn! (Zufall); abwechselnd, jede Seite eigene Karte, Ende bei Blödsinn! oder nach k Runden
    const debate = (drama && ph.name === 'Konflikt' && e.cross) || (e.out === 'abgelehnt' && rng() < R.gegenrede)
    if (debate) { let a = H, b = E; for (let r = 0; r < R.drama.debateMax; r++) { const k2 = chooseCard(a, b, drama ? 'konflikt' : null); if (!k2) break; const d = exchange(a, b, k2, 'Debatte ' + (r + 1)); d.day = S.day; d.slot = S.slot; d.phase = ph.name; S.log.push(d); c += d.conflict + R.conflict.debate; if (d.out === 'abgelehnt') break; [a, b] = [b, a] } }
    S.tension = S.tension * (1 - R.drama.alpha) + R.drama.alpha * Math.min(1, c)
    S.series.push({ day: S.day, slot: S.slot, tension: +S.tension.toFixed(3), phase: ph.name })
    if (mib) for (const [k, set] of S.adoptToday) if (set.size >= R.mib.perDay && !S.mibToday.has(k)) { S.mibToday.add(k); S.mibQueue.push({ card: k, victims: [...set].sort() }) } // Opfer beim Vormerken festhalten
  }
  function updateBubbles() { const edges = S.log.filter((e) => e.kind === 'tell' && e.out === 'übernommen').map((e) => [e.E, e.H]); if (edges.length < 3) return; const B = bubbles(ids, edges); for (const i of ids) S.bub[i] = B.label[i] }
  function runDays(n) { for (let d = 0; d < n; d++) { for (S.slot = 0; S.slot < R.slotsPerDay; S.slot++) step(); S.day++; S.adoptToday = new Map(); S.mibToday = new Set(); OP.usedToday = new Set(); updateBubbles() } }
  return { F, K, byId, ids, S, lib, runDays, overlap, status, relOf, rejected, wiped, heard, ownShare, foreignDecks, opts: { seed, drama, fallback, mib } }
}

// Blasen: Modularität Q über deterministisches lokales Verschieben (Louvain, Phase 1) auf dem BINGO-Graphen (ungerichtet, gewichtet)
export function bubbles(ids, edges) {
  const W = new Map(), key = (a, b) => (a < b ? a + '|' + b : b + '|' + a)
  for (const [a, b] of edges) if (a !== b) W.set(key(a, b), (W.get(key(a, b)) ?? 0) + 1)
  const w = (a, b) => W.get(key(a, b)) ?? 0, m = [...W.values()].reduce((x, y) => x + y, 0)
  const deg = Object.fromEntries(ids.map((i) => [i, ids.reduce((x, j) => x + (j !== i ? w(i, j) : 0), 0)]))
  const L = Object.fromEntries(ids.map((i) => [i, i]))
  const Q = () => { if (!m) return 0; let q = 0; for (const i of ids) for (const j of ids) if (L[i] === L[j]) q += (i !== j ? w(i, j) : 0) - (deg[i] * deg[j]) / (2 * m); return q / (2 * m) }
  for (let it = 0; it < 30 && m; it++) { let moved = false
    for (const i of ids) { const cur = L[i]; let best = cur, bq = Q()
      for (const c of [...new Set(ids.filter((j) => j !== i && w(i, j) > 0).map((j) => L[j]))].sort()) { if (c === cur) continue; L[i] = c; const q = Q(); if (q > bq + 1e-9) { bq = q; best = c } L[i] = cur }
      if (best !== cur) { L[i] = best; moved = true } }
    if (!moved) break }
  const groups = {}; for (const i of ids) (groups[L[i]] ||= []).push(i)
  return { label: L, Q: Q(), groups: Object.values(groups).filter((g) => g.length > 1 || deg[g[0]] > 0) }
}
