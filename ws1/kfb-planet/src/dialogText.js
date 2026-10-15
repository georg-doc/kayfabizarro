// S5b · Host-Seite: Pool einmal laden (Contents API, Consumer-Vertrag #365) und den Pool-Leser bereitstellen.
// Fällt das Laden aus, gibt es keinen Pool: Blasen zeigen dann wörtlichen Kartentext oder „…“ (Vertrag §5).
import { createPoolReader, loadPool, isIssuedLine, SILENCE } from './poolReader'
import deckBlobs from './data/deck-blobs.json'
import { MEDIA_COMMIT } from './cardMapping'
import { DEBUG, expose } from './debug'
import data from './data/cards.json'
import previewG4 from './data/pool/preview-g4-georg.json'

// Vorschau-Text (F-3a): nur mit ausdrücklichem Schalter #…,preview=g4; sonst nie (kein Standard, nicht ACCEPTED)
export const PREVIEW = typeof location !== 'undefined' && /(^|[#,])preview=g4(,|$)/.test(location.hash) ? previewG4 : null

const deckCache = new Map()
const deckJson = (deckId) => {
  const d = deckBlobs.decks[deckId]
  if (!d) return Promise.reject(new Error('DECK_UNKNOWN'))
  if (!deckCache.has(deckId)) deckCache.set(deckId, fetch(`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${MEDIA_COMMIT}/media/kfb/${encodeURIComponent(d.data)}`).then((r) => r.json()))
  return deckCache.get(deckId)
}

// Kartenquelle: src/data/cards.json (Kartentext = Druck V-242, Titel normal V-271, media/kfb @a71de421; Texte wörtlich), Schlüssel deckId#Nummer
const byKey = new Map()
data.cards.forEach(([d, num, name, power, lore]) => byKey.set(data.decks[d][0] + '#' + num, { name, power, lore }))
const cardSource = (deckId, num) => byKey.get(deckId + '#' + num) || null
const cache = { get: () => JSON.parse(localStorage.getItem('kfb-ws1-pool-cache') || 'null'), set: (v) => localStorage.setItem('kfb-ws1-pool-cache', JSON.stringify(v)) }

let reader = createPoolReader({ deckBlobs: deckBlobs.decks, deckJson, cardSource, preview: PREVIEW })
let loadState = { loading: true, error: null }
let poolReady = false
export const isPoolReady = () => poolReady // der Lade-Versuch ist beendet (mit oder ohne Pool)
export const ready = loadPool({ cache }).then(({ pool, blob, error, cached }) => {
  poolReady = true
  loadState = { loading: false, error, cached: !!cached }
  if (pool) reader = createPoolReader({ pool, poolBlob: blob, deckBlobs: deckBlobs.decks, deckJson, cardSource, preview: PREVIEW })
  return reader
})
export const getReader = () => reader
export { isIssuedLine, SILENCE }

expose('Pool', () => ({ ...reader.status(), ...loadState }))
expose('LineFor', async (card, field) => { const l = await reader.lineFor(card, { field }); return { text: l.text, source: l.source, field: l.field ?? null } })
