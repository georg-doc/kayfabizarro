// S5b · Host-Seite: Pool einmal laden (Contents API, Consumer-Vertrag #365) und den Pool-Leser bereitstellen.
// Fällt das Laden aus, gibt es keinen Pool: Blasen zeigen dann wörtlichen Kartentext oder „…“ (Vertrag §5).
import { createPoolReader, loadPool, isIssuedLine, SILENCE } from './poolReader'
import deckBlobs from './data/deck-blobs.json'
import { MEDIA_COMMIT } from './cardMapping'
import { DEBUG, expose } from './debug'

const deckCache = new Map()
const deckJson = (deckId) => {
  const d = deckBlobs.decks[deckId]
  if (!d) return Promise.reject(new Error('DECK_UNKNOWN'))
  if (!deckCache.has(deckId)) deckCache.set(deckId, fetch(`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${MEDIA_COMMIT}/media/kfb/${encodeURIComponent(d.data)}`).then((r) => r.json()))
  return deckCache.get(deckId)
}

let reader = createPoolReader({ deckBlobs: deckBlobs.decks, deckJson })
let loadState = { loading: true, error: null }
export const ready = loadPool().then(({ pool, blob, error }) => {
  loadState = { loading: false, error }
  if (pool) reader = createPoolReader({ pool, poolBlob: blob, deckBlobs: deckBlobs.decks, deckJson })
  return reader
})
export const getReader = () => reader
export { isIssuedLine, SILENCE }

expose('Pool', () => ({ ...reader.status(), ...loadState }))
expose('LineFor', async (card, field) => { const l = await reader.lineFor(card, { field }); return { text: l.text, source: l.source, field: l.field ?? null } })
