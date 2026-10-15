// V-270 · Bühnen-Paletten als Harmonie-Systeme: Karte → Deck-Genre → Insel-Palette (Lab palettes.ts, Joyride-Linie) → Rollen je Bühnenteil
// (ENV_ROLES: accent, stone, paved, ground, bark …) → Story-Tint aus dem Fluff-Farbschema (storymode.v4.js), höchstens ~15 % über der Palette.
// Ohne three, ohne DOM. Die Zuordnung Genre → Palette ist Vorschlag WS1 (data/stage-palette.genre.json), Georg urteilt an den Einzelbildern.
// Ersetzt die Stimmungs-Stufen aus V-245 (world-palettes/palette-roles); der Story-Modus der Karte kommt weiter aus world-context wie in R2.
import { PALETTES, ENV_ROLES } from './vendor/palette/island-palettes.js'
import { MODES } from './vendor/palette/storymode.v4.js'
import { cardSemanticVector, makeWorldContext } from './vendor/palette/world-context.js'
import TABLE from './data/stage-palette.genre.json'
import GENRES from './data/deck-genres.json'

export const PALETTE_IDS = Object.keys(PALETTES)
export const FADE_S = 1.2 // weicher Wechsel (V-011)
export const TINT_K = 0.12 // Story-Tint: Anteil des Modus-Akzents (WS0: höchstens ~15 %)
// Tint als gerade Mischung der sRGB-Werte: 12 % sind 12 % des Abstands je Kanal (mix aus palette-roles mischt linear-hell und wirkt dadurch stärker)
const lerpHex = (a, b, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('')

// Palette eines Decks: genre[0] (bekannt) → Tabelle; sonst bundle → Genre → Tabelle; sonst null
export function paletteForDeck(deckId) {
  const d = GENRES.decks[deckId]; if (!d) return { id: null, via: 'kein Deck-Eintrag' }
  for (const g of d.genre) if (TABLE.genreToPalette[g]) return { id: TABLE.genreToPalette[g], via: 'genre ' + g }
  const g = d.bundle && TABLE.bundleToGenre[d.bundle]
  if (g && TABLE.genreToPalette[g]) return { id: TABLE.genreToPalette[g], via: 'bundle ' + d.bundle + ' → ' + g }
  return { id: null, via: 'genre/bundle unbekannt' }
}

// Story-Modus der Karte wie Clay Stage R2 computeContext: Kartenvektor → stärkste Dimension → Modus (DIM_MODE aus R2)
const DIM_MODE = { melancholy: 'tragic', humor: 'comic', chaos: 'absurd', power: 'heroic', wonder: 'mystical', threat: 'forbidden', lore: 'mystical', name: 'heroic' }
export function cardStoryMode(card) {
  if (!card) return null
  const c = { cardName: card.name || '', power: card.power || '', lore: card.lore || '' }
  const vec = cardSemanticVector(c, GENRES.decks[card.deck?.id]?.role || null), top = Object.keys(vec).sort((a, b) => vec[b] - vec[a])[0]
  return makeWorldContext({ cardTriplet: { current: c }, storyMode: DIM_MODE[top] || 'heroic', seeds: ['kfb-billboard', 'b-1'] }).storyMode
}

// Variante B (Georg 15.10., §36): jede Rolle auf ein eigenes Bühnenteil wie Joyride setWorld (table = top, hill, tower, strang, trunk, path, sky, cloud)
// statt einer Rollenfamilie fürs ganze Amphitheater. amph.mode 'b': cols = [tower0, tower1, hill0, hill1, sand, rock] (Bedeutung im Amphitheater-Shader).
// options: { override: Paletten-Kennung, noTint: true (Bildpaar ohne Tint), variant: 'a' | 'b' }
export function stagePaletteFor(card, { override = null, noTint = false, variant = 'a' } = {}) {
  let id = null, via = null
  if (override && PALETTE_IDS.includes(override)) { id = override; via = 'override' }
  else if (card?.deck?.id) ({ id, via } = paletteForDeck(card.deck.id))
  if (!id) { id = TABLE.fallback; via = (via ? via + ' → ' : '') + 'Rückfall ' + TABLE.fallback }
  const P = PALETTES[id], E = ENV_ROLES[id]
  const story = cardStoryMode(card), M = MODES.find((m) => m.id === story) || null
  const t = (hex) => (M && !noTint ? lerpHex(hex, M.accent, TINT_K) : hex)
  const ramp = (three) => [t(three[2]), t(three[1]), t(three[0])] // ENV_ROLES hell → dunkel; Verlauf dunkel → hell
  if (variant === 'b') return {
    id, key: id + '|' + (story || '-') + (noTint ? '|plain' : '') + '|b', via, variant, storyMode: story, tint: M && !noTint ? M.accent : null, palette: P, env: E,
    billboard: { frame: t(P.strang), trim: t(P.path), post: t(P.trunk), ground: t(P.hill[1]) }, // pad (Joyride-Pfeile) fehlt im Lab: Leiste = path (hell)
    amph: { mode: 'b', cols: [P.tower[0], P.tower[1], P.hill[0], P.hill[1], P.sand, P.rock].map(t), ground: t(P.top) }, // Bühnenboden sand (hebt sich von den Rängen ab), Gelände = Tisch der Insel
    sky: { top: t(P.sky), bottom: t(P.cloud) },
  }
  return {
    id, key: id + '|' + (story || '-') + (noTint ? '|plain' : ''), via, storyMode: story, tint: M && !noTint ? M.accent : null, palette: P, env: E,
    billboard: { frame: t(E.accent[0]), trim: t(E.accent[2]), post: t(E.bark[1]), ground: t(E.ground[1]) }, // Rollen wie Vorlagen-Zeile §28.2: Rahmen accent[0], Leiste accent[2], Pfosten Rinde
    amph: { wall: ramp(E.stone), floor: ramp(E.paved), ground: t(E.ground[1]) }, // senkrecht Stein, waagrecht Pflaster (Normalen-Kriterium im Shader)
    sky: { top: t(P.sky), bottom: t(P.cloud) },
  }
}
