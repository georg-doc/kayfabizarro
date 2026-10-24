// S5b · Pool-Leser (Host-Vertrag R1.2 §5, V-215; Consumer-Vertrag #365 TRIPLET_OPENER_POOL_CONSUMER_CONTRACT_R1).
// Daten-Modul: reine Funktionen, kein three, kein React, kein Store. Text für eine Blase kommt nur aus
//   1. POOL  – einem ACCEPTED-Beat mit ACCEPTED-Opener, über makePacket(preview:false) + consumePacket() aus
//             triplet-pool-core.mjs 1:1 (derselbe Code-Pfad wie die Audio-Site v11), oder
//   1b. PREVIEW – nur mit ausdrücklich übergebenem Vorschau-Pool (F-3a, G4): Georgs Fassungen über makePacket(preview:true) +
//             consumePacket(preview:true), derselbe Kern; Opener als eigene Schicht (erster Teil der Blase). Nie ACCEPTED, nie Standard.
//   2. CARD  – dem wörtlichen Kartentext der eigenen Karte (Name, Power oder Lore, unverändert, nichts kombiniert), sonst
//   3. SILENCE – „…“.
// Das Spiel erzeugt keine Triplets und keine Brücken. Jede ausgegebene Zeile wird registriert; der Host zeigt nur
// registrierte Zeilen (isIssuedLine), alles andere wird zu „…“.
import { POOL_SCHEMA, validatePool, makePacket, consumePacket } from './vendor/triplet-pool-core.mjs'

// Lesepfad (Lead B13, 22.10.): raw.githubusercontent.com an einem gepinnten Commit des Voice-Branch (#379) statt der Contents API
// (anonym 60 Abrufe je Stunde und IP – im Spiel träfe die Grenze jeden Spieler). Auf der Site geht die Adresse automatisch über den
// /raw-Proxy (siteRaw.js). Die Blob-SHA steht nicht mehr in der Antwort: sie wird aus dem geladenen Inhalt nachgerechnet (git hash-object)
// und muss dem gepinnten Blob gleichen. Neuer Pool-Stand = POOL_COMMIT und POOL_BLOB hier nachziehen (git log -1 <ref> -- POOL_PATH).
export const POOL_PATH = 'skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json'
export const POOL_REF = 'planning/kfb-chatterbox-voice-layer-v1-2026-10-08'
export const POOL_COMMIT = 'f4c23f72945dde9bd7449ad6e15d5b61c1ca5def' // letzter Commit auf POOL_REF, der POOL_PATH ändert (13.10., Pool r5 cookie-tune-v11)
export const POOL_BLOB = 'dfb5435bc0c913ea48f8f5558f801b293962fbc8' // git rev-parse POOL_COMMIT:POOL_PATH
export const POOL_URL = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${POOL_COMMIT}/${POOL_PATH}`
export const SILENCE = '…'

import { lineA as ssotLineA, lineB as ssotLineB, lineT as ssotLineT, boggleLore as ssotBoggleLore, tr1Line, CALLS } from './dialog/ssotLines.js'
const issued = new WeakSet()
// tief einfrieren: auch parts ist danach unveränderlich (blinder Prüfer 3, Befund 4)
const issue = (line) => { if (line.parts) Object.freeze(line.parts); Object.freeze(line); issued.add(line); return line }
export const isIssuedLine = (line) => !!line && typeof line === 'object' && issued.has(line)

// git-Blob-SHA (wie git hash-object) über die Web-Crypto-API (Browser und Node ≥ 20)
export async function gitBlobSha(bytes) {
  const head = new TextEncoder().encode(`blob ${bytes.length}\0`), all = new Uint8Array(head.length + bytes.length); all.set(head); all.set(bytes, head.length)
  return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-1', all))].map((b) => b.toString(16).padStart(2, '0')).join('')
}
const toB64 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s) }

// Pool laden: Rohinhalt holen, Blob-SHA nachrechnen (expectBlob: gepinnter Blob; null = jede, nur für Tests mit eigenen Fixtures), Schema prüfen,
// Blob-SHA getrennt von contentRevision festhalten.
// cache: { get(): {sha, content (Base64), t, rev} | null, set(v) } – spart Abrufe; ein frischer Stand (< maxAgeMs) derselben Revision wird ohne Netz
// genutzt; scheitert der Abruf, gilt ein älterer Cache-Stand (< 24 h), markiert als cached.
export async function loadPool({ fetchImpl = fetch, url = POOL_URL, rev = POOL_COMMIT, expectBlob = POOL_BLOB, cache = null, maxAgeMs = 10 * 60 * 1000, now = Date.now } = {}) {
  const decode = (j) => validatePool(JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(j.content.replace(/\s/g, '')), (c) => c.charCodeAt(0)))))
  let hit = null
  try { hit = cache?.get() || null } catch (e) { hit = null }
  if (hit && hit.rev === rev && now() - hit.t < maxAgeMs) { try { return { pool: decode(hit), blob: hit.sha, error: null, cached: true } } catch (e) { hit = null } }
  const fallback = (error) => {
    if (hit && now() - hit.t < 24 * 3600 * 1000) { try { return { pool: decode(hit), blob: hit.sha, error, cached: true } } catch (e) { /* weiter */ } }
    return { pool: null, blob: null, error }
  }
  try {
    const r = await fetchImpl(url)
    if (!r.ok) return fallback('HTTP ' + r.status)
    const bytes = new Uint8Array(await r.arrayBuffer()), sha = await gitBlobSha(bytes)
    if (expectBlob && sha !== expectBlob) return fallback('BLOB_MISMATCH ' + sha.slice(0, 8))
    const j = { sha, content: toB64(bytes) }, pool = decode(j)
    try { cache?.set({ ...j, t: now(), rev }) } catch (e) { /* ohne Cache weiter */ }
    return { pool, blob: sha, error: null, cached: false }
  } catch (e) { return fallback(String(e.message || e)) }
}

// Deck-JSON aus media/kfb: cardNumber steht dort als Zeichenkette, der Pool-Kern erwartet eine Zahl (Anpassung, sonst unverändert).
const normDeck = (deck) => ({ ...deck, cards: (deck.cards || []).map((c) => ({ ...c, cardNumber: Number(c.cardNumber) })) })

// pool: validierter Pool oder null · poolBlob: SHA des Pool-Blobs · deckBlobs: src/data/deck-blobs.json (decks)
// deckJson(deckId) -> Promise<Deck-JSON am MEDIA_COMMIT> (nur gebraucht, wenn ein ACCEPTED-Beat für die Karte existiert)
// cardSource(deckId, num) -> { name, power, lore } aus der Kartenquelle oder null. Kartentext kommt NUR von dort, nie aus dem
// übergebenen Objekt (blinder Prüfer 3, Befund 5).
export function createPoolReader({ pool = null, poolBlob = null, deckBlobs = {}, deckJson = null, cardSource = null, preview = null } = {}) {
  const status = { schema: POOL_SCHEMA, loaded: !!pool, contentRevision: pool?.contentRevision ?? null, blob: poolBlob,
    acceptedBeats: pool ? pool.beats.filter((b) => b.status === 'ACCEPTED').length : 0,
    acceptedOpeners: pool ? pool.openers.filter((o) => o.status === 'ACCEPTED').length : 0, rejects: [],
    preview: preview ? { contentRevision: preview.contentRevision, beats: preview.beats.length } : null }

  async function poolLine(card) {
    if (!pool || !deckJson) return null
    const beat = pool.beats.find((b) => b.deckId === card.deck.id && b.cardNumber === card.num && b.status === 'ACCEPTED')
    if (!beat) return null
    const meta = deckBlobs[card.deck.id]
    if (!meta) { status.rejects.push({ card: card.deck.id + '#' + card.num, reason: 'DECK_BLOB_UNKNOWN' }); return null }
    try {
      const deck = normDeck(await deckJson(card.deck.id))
      const packet = makePacket({ pool, meta: { deckId: card.deck.id, cardBlob: meta.blob, pdfPath: meta.pdf, coverOffset: meta.coverOffset ?? 1 },
        deck, beats: { [card.num]: beat }, selection: [card.num], preview: false, contentBlob: poolBlob, registryBlob: null })
      const out = consumePacket(packet) // Standard: accepted-only
      const b = out.beats[0]
      return issue({ text: b.surfaceText, parts: [b.surfaceText], source: 'POOL', beatId: b.beatId, beatVersion: b.version, openerId: b.openerId, openerVersion: b.openerVersion, poolBlob, card: card.deck.id + '#' + card.num })
    } catch (e) { status.rejects.push({ card: card.deck.id + '#' + card.num, reason: String(e.message || e) }); return null }
  }

  // Vorschau-Zeile (F-3a): gleicher Kern, preview:true auf beiden Seiten; Opener-Text = Muster ohne {title} (eigene Schicht)
  async function previewLine(card) {
    if (!preview || !deckJson) return null
    const beat = preview.beats.find((b) => b.deckId === card.deck.id && b.cardNumber === card.num)
    if (!beat) return null
    const meta = deckBlobs[card.deck.id]
    if (!meta) { status.rejects.push({ card: card.deck.id + '#' + card.num, reason: 'DECK_BLOB_UNKNOWN' }); return null }
    try {
      const deck = normDeck(await deckJson(card.deck.id))
      const packet = makePacket({ pool: preview, meta: { deckId: card.deck.id, cardBlob: meta.blob, pdfPath: meta.pdf, coverOffset: meta.coverOffset ?? 1 },
        deck, beats: { [card.num]: beat }, selection: [card.num], preview: true, contentBlob: null, registryBlob: null })
      const b = consumePacket(packet, { preview: true }).beats[0], o = packet.Openers.find((x) => x.openerId === b.openerId)
      const lead = o ? o.pattern.replace('{title}', '').trim() : ''
      return issue({ text: (lead ? lead + ' ' : '') + b.surfaceText, parts: lead ? [lead, b.surfaceText] : [b.surfaceText], source: 'PREVIEW', preview: true,
        beatId: b.beatId, beatVersion: b.version, openerId: b.openerId, openerVersion: b.openerVersion, contentRevision: preview.contentRevision, card: card.deck.id + '#' + card.num })
    } catch (e) { status.rejects.push({ card: card.deck.id + '#' + card.num, reason: 'PREVIEW ' + String(e.message || e) }); return null }
  }

  return {
    status: () => ({ ...status, rejects: status.rejects.slice(-10) }),
    // field: 'cardName' | 'power' | 'lore' – welcher Kartentext gilt, wenn es keine Pool-Zeile gibt
    // excludeOpeners: Opener-IDs, die in diesem Set/Akt/Dialog schon liefen (V-222: keine Variante zweimal). Trifft die Pool-Zeile
    // einen davon, gilt der wörtliche Kartentext; 'DIRECT' (ohne Opener) ist nie gesperrt.
    // pool: false = nur wörtlicher Kartentext (z. B. die Antwort im Dialog D1; ein Triplet gibt es je Karte genau einmal, V-231)
    // excludeBeats: Beat-IDs, die in diesem Dialog schon gesprochen wurden (V-231: ein Triplet je Karte, keine wortgleiche Wiederholung)
    async lineFor(card, { field = 'cardName', excludeOpeners = null, excludeBeats = null, pool = true } = {}) {
      const src = cardSource ? cardSource(card?.deck?.id, card?.num) : null
      if (!src) return issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE', card: (card?.deck?.id ?? '?') + '#' + (card?.num ?? '?'), reason: 'CARD_NOT_IN_SOURCE' })
      const p = pool ? ((await previewLine(card)) || (await poolLine(card))) : null // Vorschau nur, wenn ein Vorschau-Pool übergeben wurde
      if (p && !(excludeOpeners && p.openerId !== 'DIRECT' && excludeOpeners.has(p.openerId)) && !(excludeBeats && excludeBeats.has(p.beatId))) return p
      const key = field === 'cardName' ? 'name' : field
      const t = typeof src[key] === 'string' ? src[key] : ''
      if (t.trim() && !/^none$/i.test(t.trim())) return issue({ text: t, parts: [t], source: 'CARD', field, card: card.deck.id + '#' + card.num })
      return issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE', card: card.deck.id + '#' + card.num })
    },
    silence: () => issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE' }),
    // TRIPLET_SSOT_R1 (lines=ssot, Georg 24.10.): Rückfall A = Opener + **Titel**, B = bereinigte Lore; Power nie. text = Klartext (Mund/Ton), parts = Anzeige mit *fett* (V-699, Blasen-Kern)
    ssotLine(card, role, opener) {
      const key = (card?.deck?.id ?? '?') + '#' + (card?.num ?? '?'), src = cardSource ? cardSource(card?.deck?.id, card?.num) : null
      const tr = tr1Line(card?.deck?.id, card?.num)
      const disp = !src ? null : role === 'A' ? ssotLineA({ name: src.name }, opener) : role === 'B' ? ssotLineB({ name: src.name, lore: src.lore })
        : role === 'T' ? (tr ? ssotLineT({ name: src.name }, opener, tr) : null) : role === 'CALL' ? `*${CALLS[opener] || CALLS.bingo}*` : role === 'BOGGLE' ? (tr ? ssotBoggleLore({ name: src.name, lore: src.lore }, tr) : null) : null
      if (!disp) return issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE', card: key, reason: src ? 'SSOT_EMPTY' : 'CARD_NOT_IN_SOURCE' })
      return issue({ text: disp.replace(/\*/g, ''), parts: [disp], source: 'CARD', field: 'ssot-' + role, openerId: role === 'A' || role === 'T' ? opener?.id ?? null : null, card: key })
    },
  }
}

// Spielerwahl (S5c): feste Zurufe aus dem Studio-Vertrag oder bis zu 8 eigene Wörter des Spielers. Beides ist
// kein vom Spiel erzeugter Text; der Host zeigt es als Sprechblase der Spielfigur.
// Schreibweise V-699 (Georg 24.10.): Rufe fett, genau so; eine Bedeutung je Ruf überall (Interaktion, Tratsch, Spielerchat). Humbug?! ruft der Spieler nicht.
export const ZURUF_LABELS = ['Bingo!', 'Boggle...?', 'Bongo.', 'Blödsinn!']
// speaker 'player': der Host zeigt diese Zeilen nur am Anker der Spielfigur (Befund 6)
// Blase: Ruf fett über die Fett-Syntax des Blasen-Kerns (*…*, chatterbox-core parse); text bleibt der Ruf selbst
export function zurufLine(label) { return ZURUF_LABELS.includes(label) ? issue({ text: label, parts: [`*${label}*`], source: 'ZURUF', speaker: 'player' }) : null }
export function playerLine(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim(); const n = t ? t.split(' ').length : 0
  return n >= 1 && n <= 8 ? issue({ text: t, parts: [t], source: 'PLAYER', speaker: 'player' }) : null
}

// Nur für Tests mit URL-Schalter (#debug/#hosttest): ausdrücklich markierte Prüf-Zeile, nie im Spiel.
export const testLine = (parts) => issue({ text: parts.join(' / '), parts, source: 'TEST' })
