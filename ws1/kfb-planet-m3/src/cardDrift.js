// Drift-freie Karten bevorzugen (WS0 zu §24.2): Auswahl, nicht Beschnitt. Karten bleiben geviertelt (Georg 15.10.); Seiten, auf denen der
// Inhalt tiefer sitzt als die Seitenmitte, zeigen am Rand Zeilen der Nachbarkarte. Daten: src/data/drift-cards.json (scripts/b1/build-drift-cards.py).
import DRIFT from './data/drift-cards.json'
import { MEDIA_COMMIT } from './cardMapping'

const sets = new Map(Object.entries(DRIFT.decks).map(([d, ns]) => [d, new Set(ns)]))
export const DRIFT_PINNED = DRIFT.media === MEDIA_COMMIT
export const isCardOnDriftPage = (deckId, n) => !!sets.get(deckId)?.has(n)

// Reihenfolge bleibt; drift-freie Karten zuerst, Drift-Karten nur zum Auffüllen. keepFirst: die ausdrücklich gewählte Startkarte bleibt vorn.
export function preferDriftFree(cards, count, { keepFirst = true } = {}) {
  const [first, ...rest] = cards
  const pool = keepFirst ? rest : cards, head = keepFirst && first ? [first] : []
  const free = pool.filter((c) => !isCardOnDriftPage(c.deck.id, c.num)), drift = pool.filter((c) => isCardOnDriftPage(c.deck.id, c.num))
  return [...head, ...free, ...drift].slice(0, count)
}
