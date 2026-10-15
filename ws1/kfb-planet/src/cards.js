// Kartenbestand aus der KFB-Registry. Texte bleiben wörtlich; Fragmente sind Ausschnitte, keine Umformulierungen.
import data from './data/cards.json'

export const DECKS = data.decks.map(([id, title, type, use]) => ({ id, title, type, use, med: id.startsWith('medkayfab_') }))
// MED-Decks gehören in eigene Welten mit eigenem Metanarrativ; im KFB-Kernspiel nicht im Zufallspool
const PLAY = []
// Blanko-Karten (zum Selbstbeschriften) sind keine spielbaren Entitäten im Zufallspool
const isBlank = (c) => /^[—–-]?\s*blank card\s*#/i.test(c[2]) || /^\s*\[.*\]\s*$/.test(c[3]) || /^\s*\[.*\]\s*$/.test(c[4])
for (let i = 0; i < data.cards.length; i++) if (!DECKS[data.cards[i][0]].med && !isBlank(data.cards[i])) PLAY.push(i)
const PLAY_DECKS = DECKS.map((d, i) => i).filter((i) => !DECKS[i].med)
export const SOURCE_COMMIT = 'a71de421' // Kartentext = Druck (V-242), Titel normal geschrieben (V-271), media/kfb, gebaut mit scripts/build-cards-media.py

export function cardAt(i) {
  const [d, num, name, power, lore] = data.cards[i]
  return { idx: i, deck: DECKS[d], num, name, power, lore }
}
export const CARD_COUNT = data.cards.length

export function randomCard(rand = Math.random) { return cardAt(PLAY[Math.floor(rand() * PLAY.length)]) }
export function randomDeckIndex(rand = Math.random) { return PLAY_DECKS[Math.floor(rand() * PLAY_DECKS.length)] }
export const PLAY_STATS = { decks: PLAY_DECKS.length, cards: PLAY.length }
export function cardsOfDeck(di) {
  const out = []
  for (let i = 0; i < data.cards.length; i++) if (data.cards[i][0] === di) out.push(i)
  return out
}

// fragments/pickFragments/CONNECTORS (Spike) entfernt: Ausschnitte und Verbinder erzeugten Triplets/Brücken (Vertrag §5).

export const STORY_MODES = [
  { n: 1, name: 'Tragic', de: 'Tragisch', hint: 'Loss is real. Push forward anyway.', color: '#5b7bd5' },
  { n: 2, name: 'Comic', de: 'Komisch', hint: "Things go wrong. It's your fault. Play the gap.", color: '#f2c94c' },
  { n: 3, name: 'Absurd', de: 'Absurd', hint: "The impossible is normal. Don't explain it.", color: '#5fd0a0' },
  { n: 4, name: 'Heroic', de: 'Heroisch', hint: 'Your Character is right for this moment. Play the peak.', color: '#f08a3c' },
  { n: 5, name: 'Mystical', de: 'Mystisch', hint: "Something's happening beneath the surface.", color: '#a77be0' },
  { n: 6, name: 'Forbidden', de: 'Verboten', hint: "Cross the line the story's been avoiding. Sell it.", color: '#e0475b' },
]

export function deckColor(id) {
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return `hsl(${h % 360} 55% 62%)`
}
