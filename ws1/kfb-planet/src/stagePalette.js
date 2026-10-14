// V-245 · Bühnen-Palette: Karte → Deck-Genre → benannte Cartoon-Palette (world-palettes.js) → Rollen (palette-roles.js R2, EIN Besitzer)
// → Anwendung auf Billboard, Amphitheater, Boden und Himmel. Ohne three, ohne DOM.
// Was hier steht und nicht im Besitzer: (1) die Zuordnung Genre → Palette (Vorschlag WS1, data/stage-palette.genre.json, Georg urteilt am
// Bildbogen); (2) welche Rollen das Amphitheater trägt (das Meshy-Modell hat keine Rollen-Teile wie der Clay-Stage-Kit; seine Helligkeit
// wird auf einen Drei-Stufen-Verlauf aus Rollen gelegt). Billboard und Himmel nutzen die Rollen so wie Clay Stage R2 (frame/trim/post, skyTop/skyBottom).
import { NAMED_PALETTES } from './vendor/palette/world-palettes.js'
import { roles, mix, DEFAULT_ACCENT } from './vendor/palette/palette-roles.js'
import { cardSemanticVector, makeWorldContext } from './vendor/palette/world-context.js'
import TABLE from './data/stage-palette.genre.json'
import GENRES from './data/deck-genres.json'

const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, '0')).join('')
export const PALETTE_IDS = NAMED_PALETTES.map((p) => p.id)
export const FADE_S = 1.2 // weicher Wechsel (V-011); Dauer = Vorschlag WS1

// Palette eines Decks: genre[0] (bekannt) → Tabelle; sonst bundle → Genre → Tabelle; sonst null (Rückfall Biom)
export function paletteForDeck(deckId) {
  const d = GENRES.decks[deckId]; if (!d) return { id: null, via: 'kein Deck-Eintrag' }
  for (const g of d.genre) if (TABLE.genreToPalette[g]) return { id: TABLE.genreToPalette[g], via: 'genre ' + g }
  const g = d.bundle && TABLE.bundleToGenre[d.bundle]
  if (g && TABLE.genreToPalette[g]) return { id: TABLE.genreToPalette[g], via: 'bundle ' + d.bundle + ' → ' + g }
  return { id: null, via: 'genre/bundle unbekannt' }
}

// Zweiter Akzent (wcAccent) wie Clay Stage R2 computeContext (stage.js Z. 146–154): Kartenvektor → stärkste Dimension → Story-Modus
// (DIM_MODE, in R2 „aus H13 übernommen, Vorschlag, nicht Kanon“) → makeWorldContext(...).accent. Er färbt u. a. skyTop, accent2, column.
const DIM_MODE = { melancholy: 'tragic', humor: 'comic', chaos: 'absurd', power: 'heroic', wonder: 'mystical', threat: 'forbidden', lore: 'mystical', name: 'heroic' }
export function cardAccent(card) {
  if (!card) return { accent: DEFAULT_ACCENT, storyMode: null }
  const c = { cardName: card.name || '', power: card.power || '', lore: card.lore || '' } // Spielkarte → Feldnamen des Deck-JSON
  const vec = cardSemanticVector(c, GENRES.decks[card.deck?.id]?.role || null), top = Object.keys(vec).sort((a, b) => vec[b] - vec[a])[0]
  const wc = makeWorldContext({ cardTriplet: { current: c }, storyMode: DIM_MODE[top] || 'heroic', seeds: ['kfb-billboard', 'b-1'] }) // Seeds wie R2 (biomeSeed b-1)
  return { accent: wc.accent, storyMode: wc.storyModeName || wc.storyMode }
}

// Stufen [dunkel, mitte, hell] aus einem Biom (Rückfall, BIOMES aus billboard-stage.js): Fels in Straße, Fels, Oberfläche in Papier
const biomeStops = (b) => [mix(b.rock, b.road, 0.55), b.rock, mix(b.top, b.paper, 0.45)]

// options: { override: Paletten-Kennung oder 'biome', biome (Rückfall) }
export function stagePaletteFor(card, { override = null, biome = null } = {}) {
  let id = null, via = null
  if (override && override !== 'biome' && PALETTE_IDS.includes(override)) { id = override; via = 'override' }
  else if (!override && card?.deck?.id) ({ id, via } = paletteForDeck(card.deck.id))
  const named = id && NAMED_PALETTES.find((p) => p.id === id)
  const stops = named ? named.stops.map(hex) : biome ? biomeStops(biome) : null
  if (!stops) return null
  const { accent, storyMode } = cardAccent(card)
  const R = roles(stops, accent, false)
  const pid = id || 'biome:' + (biome?.name || '?')
  return {
    id: pid, key: pid + '|' + accent, via: via || 'Rückfall Biom', storyMode, wcAccent: accent, stops, roles: R,
    billboard: { frame: R.frame, trim: R.trim, post: R.post, ground: R.flat }, // wie Billboard Family v1 / Clay Stage R2
    amph: { c0: R.dark, c1: mix(R.stone, R.frame, 0.5), c2: R.trim, ground: R.flat }, // Steinzeichnung: Fugen dunkel, Stein in Palettenmitte, Kanten hell
    sky: { top: R.skyTop, bottom: R.skyBottom },
  }
}
