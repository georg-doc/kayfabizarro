// S5b · Pool-Leser (Host-Vertrag R1.2 §5, V-215; Consumer-Vertrag #365 TRIPLET_OPENER_POOL_CONSUMER_CONTRACT_R1).
// Daten-Modul: reine Funktionen, kein three, kein React, kein Store. Text für eine Blase kommt nur aus
//   1. POOL  – einem ACCEPTED-Beat mit ACCEPTED-Opener, über makePacket(preview:false) + consumePacket() aus
//             triplet-pool-core.mjs 1:1 (derselbe Code-Pfad wie die Audio-Site v11), oder
//   2. CARD  – dem wörtlichen Kartentext der eigenen Karte (Name, Power oder Lore, unverändert, nichts kombiniert), sonst
//   3. SILENCE – „…“.
// Das Spiel erzeugt keine Triplets und keine Brücken. Jede ausgegebene Zeile wird registriert; der Host zeigt nur
// registrierte Zeilen (isIssuedLine), alles andere wird zu „…“.
import { POOL_SCHEMA, validatePool, makePacket, consumePacket } from './vendor/triplet-pool-core.mjs'

// Einziger getesteter Lesepfad laut Consumer-Vertrag: GitHub Contents API auf dem Voice-Branch (#379)
export const POOL_PATH = 'skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json'
export const POOL_REF = 'planning/kfb-chatterbox-voice-layer-v1-2026-10-08'
export const POOL_URL = `https://api.github.com/repos/georg-doc/kayfabizarro/contents/${POOL_PATH}?ref=${encodeURIComponent(POOL_REF)}`
export const SILENCE = '…'

const issued = new WeakSet()
const issue = (line) => { issued.add(line); return Object.freeze(line) }
export const isIssuedLine = (line) => !!line && typeof line === 'object' && issued.has(line)

// Pool laden: Base64 dekodieren, Schema prüfen, Blob-SHA getrennt von contentRevision festhalten.
export async function loadPool({ fetchImpl = fetch, url = POOL_URL } = {}) {
  try {
    const r = await fetchImpl(url, { headers: { Accept: 'application/vnd.github+json' } })
    if (!r.ok) return { pool: null, blob: null, error: 'HTTP ' + r.status }
    const j = await r.json()
    const bin = Uint8Array.from(atob(j.content.replace(/\s/g, '')), (c) => c.charCodeAt(0))
    const pool = validatePool(JSON.parse(new TextDecoder().decode(bin)))
    return { pool, blob: j.sha, error: null }
  } catch (e) { return { pool: null, blob: null, error: String(e.message || e) } }
}

// Deck-JSON aus media/kfb: cardNumber steht dort als Zeichenkette, der Pool-Kern erwartet eine Zahl (Anpassung, sonst unverändert).
const normDeck = (deck) => ({ ...deck, cards: (deck.cards || []).map((c) => ({ ...c, cardNumber: Number(c.cardNumber) })) })

// pool: validierter Pool oder null · poolBlob: SHA des Pool-Blobs · deckBlobs: src/data/deck-blobs.json (decks)
// deckJson(deckId) -> Promise<Deck-JSON am MEDIA_COMMIT> (nur gebraucht, wenn ein ACCEPTED-Beat für die Karte existiert)
export function createPoolReader({ pool = null, poolBlob = null, deckBlobs = {}, deckJson = null } = {}) {
  const status = { schema: POOL_SCHEMA, loaded: !!pool, contentRevision: pool?.contentRevision ?? null, blob: poolBlob,
    acceptedBeats: pool ? pool.beats.filter((b) => b.status === 'ACCEPTED').length : 0,
    acceptedOpeners: pool ? pool.openers.filter((o) => o.status === 'ACCEPTED').length : 0, rejects: [] }

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

  return {
    status: () => ({ ...status, rejects: status.rejects.slice(-10) }),
    // field: 'cardName' | 'power' | 'lore' – welcher Kartentext gilt, wenn es keine Pool-Zeile gibt
    async lineFor(card, { field = 'cardName' } = {}) {
      const p = await poolLine(card)
      if (p) return p
      const key = field === 'cardName' ? 'name' : field
      const t = typeof card[key] === 'string' ? card[key] : ''
      if (t.trim() && !/^none$/i.test(t.trim())) return issue({ text: t, parts: [t], source: 'CARD', field, card: card.deck.id + '#' + card.num })
      return issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE', card: card.deck.id + '#' + card.num })
    },
    silence: () => issue({ text: SILENCE, parts: [SILENCE], source: 'SILENCE' }),
  }
}

// Nur für Tests mit URL-Schalter (#debug/#hosttest): ausdrücklich markierte Prüf-Zeile, nie im Spiel.
export const testLine = (parts) => issue({ text: parts.join(' / '), parts, source: 'TEST' })
