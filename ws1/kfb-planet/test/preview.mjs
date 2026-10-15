// F-3a · Vorschau-Text G4 (ohne Browser): Vorschau-Pool im Pool-Format, Pool-Leser mit und ohne Vorschau, Opener als eigene Schicht,
// Antwort B wörtlich aus dem Druck, Opener-Sperre (V-222), Kartenbild-Freigabe (Platzhalter), deck-blobs = MEDIA_COMMIT.
// Deck-JSON kommt wie im Spiel von media/kfb am MEDIA_COMMIT (Netz).
import fs from 'fs'
import { createPoolReader } from '../src/poolReader.js'
import { validatePool } from '../src/vendor/triplet-pool-core.mjs'
import { report } from './_page.mjs'

const MEDIA = /MEDIA_COMMIT = '([0-9a-f]{40})'/.exec(fs.readFileSync('src/cardMapping.js', 'utf8'))[1]
const BLOBS = JSON.parse(fs.readFileSync('src/data/deck-blobs.json', 'utf8')), P = JSON.parse(fs.readFileSync('src/data/pool/preview-g4-georg.json', 'utf8'))
const C = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), ids = C.decks.map((d) => d[0])
const A = JSON.parse(fs.readFileSync('src/data/mapping-audit.json', 'utf8')), AD = A.decks || A
const src = (d, n) => { const c = C.cards.find((x) => ids[x[0]] === d && x[1] === n); return c ? { name: c[2], power: c[3], lore: c[4] } : null }
const cache = new Map(), deckJson = (d) => { if (!cache.has(d)) cache.set(d, fetch(`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${MEDIA}/media/kfb/${encodeURIComponent(BLOBS.decks[d].data)}`).then((r) => r.json())); return cache.get(d) }
const CARDS = P.sets[0].orderedBeatIds.map((id) => { const [d, n] = id.split(':'); return { deck: { id: d }, num: +n } })
const EXPECT = [['Welcome to', 'The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home.'],
  ['Remember', "Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill."],
  ['You know', 'JEAN-JACQUES ROUSSEAU, Natural Goodness: man born free, everywhere in chains.']]

let poolOk = false; try { validatePool(P); poolOk = true } catch (e) { poolOk = false }
const plain = createPoolReader({ deckBlobs: BLOBS.decks, deckJson, cardSource: src })
const prev = createPoolReader({ deckBlobs: BLOBS.decks, deckJson, cardSource: src, preview: P })
const noPrev = [], withPrev = [], answers = []
for (const c of CARDS) { noPrev.push(await plain.lineFor(c, { field: 'cardName' })); withPrev.push(await prev.lineFor(c, { field: 'cardName' })); answers.push(await prev.lineFor(c, { field: 'power', pool: false })) }
const blocked = await prev.lineFor(CARDS[0], { field: 'cardName', excludeOpeners: new Set([withPrev[0].openerId]) })
const safe = CARDS.map((c) => (AD[c.deck.id]?.status === 'SAFE') && (AD[c.deck.id]?.ok || []).includes(c.num))

process.exit(report('preview F-3a (G4 Vorschau-Text)', {
  deckBlobsMatchMediaCommit: BLOBS.media === MEDIA, // V-242-Umstellung: Deck-Blobs am selben Stand wie Bilder und Text
  previewPoolValidNeverAccepted: poolOk && P.preview === true && P.canonicalDefault === false && [...P.beats, ...P.openers].every((x) => x.status === 'EDITORIAL_CANDIDATE'),
  noPreviewWithoutSwitch: noPrev.every((l) => l.source === 'CARD'), // ohne Vorschau-Pool: Kartentitel wörtlich, nie Georgs Fassung
  georgLinesWithOpenerLayer: withPrev.every((l, i) => l.source === 'PREVIEW' && l.preview === true && l.parts.length === 2 && l.parts[0] === EXPECT[i][0] && l.parts[1] === EXPECT[i][1]),
  threeDifferentOpeners: new Set(withPrev.map((l) => l.openerId)).size === 3,
  answerIsPrintPower: answers.every((l, i) => l.source === 'CARD' && l.text === src(CARDS[i].deck.id, CARDS[i].num).power),
  usedOpenerFallsBackToCard: blocked.source === 'CARD' && blocked.text === src(CARDS[0].deck.id, CARDS[0].num).name,
  unsafeCardsShowPlaceholder: safe.every((x) => x === false), // keine der drei ist gesichert → Billboard zeigt Platzhalter mit Drucktext (WS0 F-3a)
  noRejects: prev.status().rejects.length === 0,
}, { withPrev: withPrev.map((l) => [l.source, l.parts]), answers: answers.map((l) => l.text.slice(0, 60)), rejects: prev.status().rejects, safe }))
