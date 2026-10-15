// F-3a · Vorschau-Text für G4 (WS0 15.10.): drei Karten mit Georgs eigenen Fassungen, Opener als eigene Schicht, als Vorschau gekennzeichnet.
// Schreibt src/data/pool/preview-g4-georg.json im Pool-Format kfb.voice.triplet-opener-pool/1 und prüft es mit dem Pool-Kern 1:1
// (validatePool, makePacket(preview:true), consumePacket(preview:true)). Kein ACCEPTED: Beats und Opener stehen auf EDITORIAL_CANDIDATE.
// Belegstellen (evidence) werden aus dem Drucktext (src/data/cards.json, V-242) gesucht, nicht geraten: jede zitierte Stelle steht wörtlich
// auf der Karte, jede gesprochene Stelle wörtlich in Georgs Zeile. node scripts/pool/build-preview-g4.mjs
import fs from 'fs'
import { validatePool, makePacket, consumePacket, POOL_SCHEMA } from '../../src/vendor/triplet-pool-core.mjs'

const SRC = { path: 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WS0_TO_WS1.md', revision: '80e6c65515e5571860e8757bb178706e574e2c4b', note: 'WS0 15.10. früh, F-3a: Georgs Fassungen (Opener in eckigen Klammern)' }
const C = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), ids = C.decks.map((d) => d[0])
const BLOBS = JSON.parse(fs.readFileSync('src/data/deck-blobs.json', 'utf8'))
const card = (d, n) => { const c = C.cards.find((x) => ids[x[0]] === d && x[1] === n); return { cardNumber: n, cardName: c[2], power: c[3], lore: c[4] } }

// Georgs Zeilen (Opener getrennt). Titel in Druck-Schreibweise, wo der Druck ihn anders schreibt (Vertrag: Titel wörtlich, case-sensitiv).
// spans: [Feld, Zitat auf der Karte, gesprochen in der Zeile]
const ITEMS = [
  { deck: 'kayfabizarro_monomyth_mayhem', n: 1, opener: 'Welcome to', georg: 'The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home.',
    spans: [['cardName', 'The Ordinary World', 'The Ordinary World'], ['power', 'Stasis Loop', 'stasis loop'], ['power', 'nothing changes', 'nothing changes'],
      ['lore', 'Dysfunction', 'Dysfunction'], ['lore', 'habit', 'habit'], ['lore', 'normalize the pain', 'Normalize pain'], ['lore', 'feels like home', 'feels like home']],
    coverage: { power: 'Stasis Loop: nichts ändert sich', lore: 'Dysfunktion als Gewohnheit, Schmerz normalisiert', reframe: 'Stillstand fühlt sich wie Zuhause an' } },
  { deck: 'kayfabizarro_monomyth_mayhem', n: 5, opener: 'Remember', georg: "Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill.",
    spans: [['cardName', 'Crossing the Threshold', 'Crossing the Threshold'], ['power', 'new cards', 'new cards'], ['power', 'The old self is dead', 'old self dead'],
      ['lore', 'fear becomes movement', 'Fear becomes movement'], ['lore', 'the pill', 'the pill']],
    coverage: { power: 'neue Hand, das alte Selbst ist tot', lore: 'Angst wird Bewegung, die Pille ist nicht zurückzunehmen', reframe: 'un-take → un-fluff (Georgs Wortspiel)' } },
  { deck: 'help_i_am_a_human', n: 10, opener: 'You know', georg: 'Jean-Jacques Rousseau, Natural Goodness: man born free, everywhere in chains.', titleAsPrint: true,
    spans: [['cardName', 'JEAN-JACQUES ROUSSEAU', 'JEAN-JACQUES ROUSSEAU'], ['power', 'Natural Goodness', 'Natural Goodness'], ['lore', 'Man is born free', 'man born free'],
      ['lore', 'everywhere he is in chains', 'everywhere in chains']],
    coverage: { power: 'Natural Goodness', lore: 'frei geboren, überall in Ketten', reframe: 'Rousseau als Karte' } },
]
const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
const openers = [], beats = [], report = []
for (const it of ITEMS) {
  const c = card(it.deck, it.n), meta = BLOBS.decks[it.deck]
  let surface = it.georg; if (it.titleAsPrint) surface = surface.replace(/^Jean-Jacques Rousseau/, c.cardName)
  const oid = 'georg-' + slug(it.opener)
  if (!openers.find((o) => o.openerId === oid)) openers.push({ openerId: oid, version: 1, kind: 'OPENER', pattern: it.opener + ' {title}', sourceClass: 'SOURCE_NEUTRAL', requiredEvidence: [], performerFiction: false,
    status: 'EDITORIAL_CANDIDATE', enabled: true, owner: 'Georg (Fassung) · WS1 (Einbau, Vorschau F-3a)', reviewer: null, source: { path: SRC.path, revision: SRC.revision }, history: [] })
  const evidence = it.spans.map(([field, quote, spoken]) => { const start = c[field].indexOf(quote); if (start < 0) throw new Error(`Zitat nicht auf der Karte: ${it.deck}#${it.n} ${field} „${quote}“`)
    if (!surface.includes(spoken)) throw new Error(`gesprochen nicht in der Zeile: „${spoken}“`); return { field, quote, start, end: start + quote.length, spoken } })
  beats.push({ beatId: `${it.deck}:${it.n}:georg-preview`, version: 1, deckId: it.deck, cardNumber: it.n, cardBlob: meta.blob, mode: 'COMPACT', surfaceText: surface,
    status: 'EDITORIAL_CANDIDATE', owner: 'Georg (Fassung) · WS1 (Einbau)', reviewer: null, humanAcceptance: 'PENDING', evidence,
    semanticCoverage: { ...it.coverage, newClaims: 'keine neuen Kartenfakten; Georgs eigene Fassung', humanAcceptance: 'PENDING', editorialReview: 'Vorschau für G4 (F-3a), nicht ACCEPTED' },
    speaker: { id: 'stage' }, delivery: { pauseBeforeMs: 300, pauseAfterMs: 800, rate: 1, pitch: 1, emphasis: 'Georg-Fassung' }, performerFictionApproval: false,
    openerId: oid, openerVersion: 1, history: [], titleNote: it.titleAsPrint ? 'Titel in Druck-Schreibweise (Vertrag: Titel wörtlich); Georg schrieb „Jean-Jacques Rousseau“' : null })
  report.push([it.deck + '#' + it.n, it.opener, surface])
}
const pool = { schema: POOL_SCHEMA, contentRevision: 'g4-preview-georg-2026-10-15-r1', canonicalDefault: false, status: 'PREVIEW', preview: true,
  owner: { repo: 'georg-doc/kayfabizarro', note: 'WS1 Vorschau F-3a; Pool r6 kommt erst mit sauberen Triplets (WS0 F-3b)' }, source: SRC,
  openers, beats, bridges: [], sets: [{ setId: 'g4-preview', orderedBeatIds: beats.map((b) => b.beatId), note: 'Reihenfolge der G4-Vorschau' }] }
validatePool(pool)
// Prüfung wie der Leser: je Karte ein Paket mit preview:true, Verbrauch nur mit ausdrücklichem preview:true; ohne preview wird es abgelehnt
for (const b of beats) {
  const c = card(b.deckId, b.cardNumber), meta = BLOBS.decks[b.deckId], deck = { cards: [c] }
  const pk = makePacket({ pool, meta: { deckId: b.deckId, cardBlob: meta.blob, pdfPath: meta.pdf, coverOffset: meta.coverOffset }, deck, beats: { [b.cardNumber]: b }, selection: [b.cardNumber], preview: true, contentBlob: null, registryBlob: null })
  const out = consumePacket(pk, { preview: true }); if (out.beats[0].surfaceText !== b.surfaceText) throw new Error('Paket weicht ab')
  let refused = false; try { consumePacket(pk) } catch (e) { refused = /EXPLICIT_PREVIEW_REQUIRED/.test(e.message) } if (!refused) throw new Error('Vorschau ohne preview angenommen')
}
fs.mkdirSync('src/data/pool', { recursive: true }); fs.writeFileSync('src/data/pool/preview-g4-georg.json', JSON.stringify(pool, null, 1))
for (const r of report) console.log(r.join(' | '))
