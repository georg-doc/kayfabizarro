// S5b Pool-Leser · deterministisch in Node, ohne Netz (Vertrag §5, Consumer-Vertrag #365).
// Fixtures: test/fixtures/pool-r5.json (= Pool r5, Blob dfb5435b), test/fixtures/wrinkle_rumble.json (Deck-JSON am
// MEDIA_COMMIT, Blob 695e74af). Die ACCEPTED-Variante ist eine ausdrücklich markierte Test-Kopie (humanApproval TEST FIXTURE),
// keine Freigabe.
import fs from 'fs'
import crypto from 'crypto'
import { loadPool, createPoolReader, isIssuedLine, SILENCE, zurufLine, playerLine, POOL_URL, POOL_COMMIT, POOL_BLOB, gitBlobSha } from '../src/poolReader.js'
import { report } from './_page.mjs'
const blobOf = (buf) => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex')
const poolBuf = fs.readFileSync('test/fixtures/pool-r5.json'), deckBuf = fs.readFileSync('test/fixtures/wrinkle_rumble.json')
const deckBlobs = JSON.parse(fs.readFileSync('src/data/deck-blobs.json', 'utf8')).decks
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'))
const cardSource = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); const c = di < 0 ? null : cards.cards.find((x) => x[0] === di && x[1] === n); return c ? { name: c[2], power: c[3], lore: c[4] } : null }
const cardOf = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); const c = cards.cards.find((x) => x[0] === di && x[1] === n); return { deck: { id: deck }, num: n, name: c[2], power: c[3], lore: c[4] } }
const fakeFetch = (buf) => async () => ({ ok: true, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length) }) // raw.githubusercontent.com (Lead B13)
const deckJson = async (id) => { if (id !== 'wrinkle_rumble') throw new Error('nur Fixture'); return JSON.parse(deckBuf.toString('utf8')) }

// a · Pool r5 laden
const a = await loadPool({ fetchImpl: fakeFetch(poolBuf) })
const r5 = createPoolReader({ pool: a.pool, poolBlob: a.blob, deckBlobs, deckJson, cardSource })
const cookie = cardOf('wrinkle_rumble', 10)
const l1 = await r5.lineFor(cookie)
const l2 = await r5.lineFor(cookie, { field: 'power' })
const l2b = await r5.lineFor(cookie, { field: 'power' })
// b · Test-Kopie: Opener DIRECT + Cookie-Beat ACCEPTED -> Pool-Zeile über makePacket/consumePacket
const acc = JSON.parse(poolBuf.toString('utf8'))
const ok = { authority: 'Georg', evidence: 'TEST FIXTURE ws1/s5b – keine Freigabe' }
Object.assign(acc.openers.find((o) => o.openerId === 'DIRECT'), { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok })
Object.assign(acc.beats[0], { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok })
const accBuf = Buffer.from(JSON.stringify(acc))
const b = await loadPool({ expectBlob: null, fetchImpl: fakeFetch(accBuf) })
const rAcc = createPoolReader({ pool: b.pool, poolBlob: b.blob, deckBlobs, deckJson, cardSource })
const l3 = await rAcc.lineFor(cookie)
// c · Beat ACCEPTED, aber Opener nur PROPOSED -> keine Pool-Zeile, Kartentext
const prop = JSON.parse(accBuf.toString('utf8')); prop.beats[0].openerId = 'ANYONE_HEARD_OF'; prop.beats[0].openerVersion = 1
const c = await loadPool({ expectBlob: null, fetchImpl: fakeFetch(Buffer.from(JSON.stringify(prop))) })
const rProp = createPoolReader({ pool: c.pool, poolBlob: c.blob, deckBlobs, deckJson, cardSource })
const l4 = await rProp.lineFor(cookie)
// d · Karte ohne Lore -> „…“; ohne Pool -> Kartentext
// leeres Feld: eine Karte der Quelle, deren Lore leer bzw. „None“ ist
// (die echte Kartenquelle enthält keine Karte mit leerer Lore – build-cards.py filtert sie; daher eine markierte Testquelle)
const emptyLore = { deck: { id: 'testdeck' }, num: 1 }
const l5 = await createPoolReader({ cardSource: () => ({ name: 'Testkarte', power: 'Testpower', lore: 'None' }) }).lineFor(emptyLore, { field: 'lore' })
const l6 = await createPoolReader({ cardSource }).lineFor(cookie)
// gefälschte Karte (nicht in der Quelle) bzw. untergeschobener Text auf echter Karte -> nur Quelltext oder „…“
const lFake = await r5.lineFor({ deck: { id: 'nirgends' }, num: 99, name: 'Erfundener Satz but therefore anything' })
const lSwap = await r5.lineFor({ ...cookie, name: 'Untergeschobener Name' })
// Zeile nachträglich verändern -> unmöglich (tief eingefroren)
let mutated = false; try { 'use strict'; l1.parts[0] = 'Manipuliert'; mutated = l1.parts[0] === 'Manipuliert' } catch (e) { mutated = false }
// Beat mit falschem cardBlob -> keine Pool-Zeile
const blobBad = JSON.parse(accBuf.toString('utf8')); blobBad.beats[0].cardBlob = '0'.repeat(40)
const d2 = await loadPool({ expectBlob: null, fetchImpl: fakeFetch(Buffer.from(JSON.stringify(blobBad))) })
const rBlob = createPoolReader({ pool: d2.pool, poolBlob: d2.blob, deckBlobs, deckJson, cardSource })
const lBlob = await rBlob.lineFor(cookie)
// Zwischenspeicher: frisch -> ohne Netz; Abruf scheitert (403) -> älterer Stand als cached
let store = null; const cache = { get: () => store, set: (v) => { store = v } }
let calls = 0; const countingFetch = async (...x) => { calls++; return fakeFetch(poolBuf)(...x) }
const k1 = await loadPool({ fetchImpl: countingFetch, cache, now: () => 1000 })
const k2 = await loadPool({ fetchImpl: countingFetch, cache, now: () => 1000 + 60 * 1000 })
const k3 = await loadPool({ fetchImpl: async () => ({ ok: false, status: 403 }), cache, now: () => 1000 + 3600 * 1000 })
// Zurufe/eigene Wörter: nur feste Labels bzw. ≤ 8 Wörter, an die Spielfigur gebunden
const z1 = zurufLine('KayfaBINGO!'), z2 = zurufLine('Erfunden!'), p1 = playerLine('one two three'), p2 = playerLine('a b c d e f g h i')
// B13 · gepinnter Rohpfad: Blob aus dem Inhalt nachgerechnet; fremder Inhalt am gepinnten Pfad abgewiesen (Cache als Rückfall); Cache einer anderen Revision nicht als frisch
const mm = await loadPool({ fetchImpl: fakeFetch(accBuf) })
let store2 = { ...store, rev: 'alt' }; const cache2 = { get: () => store2, set: (v) => { store2 = v } }; let calls2 = 0
const kRev = await loadPool({ fetchImpl: async (...x) => { calls2++; return fakeFetch(poolBuf)(...x) }, cache: cache2, now: () => 1000 + 60 * 1000 })
const shaOk = (await gitBlobSha(new Uint8Array(poolBuf))) === blobOf(poolBuf)
// e · Pool nicht erreichbar -> kein Pool, kein Fehler nach außen
const e = await loadPool({ fetchImpl: async () => ({ ok: false, status: 403 }) })
const forged = { text: 'Erfundener Satz', parts: ['Erfundener Satz'], source: 'POOL' }

process.exit(report('s5b pool reader', {
  poolR5Loaded: !!a.pool && a.blob === 'dfb5435bc0c913ea48f8f5558f801b293962fbc8' && a.pool.contentRevision === 'triplet-opener-pool-r5-cookie-tune-v11',
  deckFixtureIsPinnedBlob: blobOf(deckBuf) === deckBlobs.wrinkle_rumble.blob,
  r5HasNoAccepted: r5.status().acceptedBeats === 0 && r5.status().acceptedOpeners === 0,
  r5GivesCardName: l1.source === 'CARD' && l1.text === cookie.name && isIssuedLine(l1),
  r5GivesCardPowerVerbatim: l2.source === 'CARD' && l2.text === cookie.power,
  deterministic: l2b.text === l2.text && l2b.source === l2.source,
  acceptedGivesPoolLine: l3.source === 'POOL' && l3.text === acc.beats[0].surfaceText && l3.openerId === 'DIRECT' && isIssuedLine(l3),
  proposedOpenerBlocked: l4.source === 'CARD' && rProp.status().rejects.some((r) => /OPENER/.test(r.reason)),
  emptyFieldIsSilence: l5.source === 'SILENCE' && l5.text === SILENCE,
  fakeCardIsSilence: lFake.source === 'SILENCE' && lFake.reason === 'CARD_NOT_IN_SOURCE',
  textComesFromSourceNotObject: lSwap.source === 'CARD' && lSwap.text === cookie.name,
  issuedLineImmutable: !mutated && l1.parts[0] === cookie.name,
  wrongCardBlobRejected: lBlob.source === 'CARD' && rBlob.status().rejects.some((r) => /BEAT_SOURCE_REVISION_CONFLICT/.test(r.reason)),
  cacheFreshNoFetch: k1.cached === false && k2.cached === true && calls === 1,
  cacheFallbackOn403: !!k3.pool && k3.cached === true && k3.error === 'HTTP 403',
  zurufAndPlayerBoundToPlayer: z1?.speaker === 'player' && z2 === null && p1?.speaker === 'player' && p2 === null,
  noPoolGivesCard: l6.source === 'CARD',
  b13RawPinnedUrl: POOL_URL === `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${POOL_COMMIT}/skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json` && /^[0-9a-f]{40}$/.test(POOL_COMMIT) && POOL_BLOB === blobOf(poolBuf),
  b13BlobComputed: shaOk && a.blob === POOL_BLOB && a.cached === false,
  b13ForeignContentRejected: mm.pool === null && /^BLOB_MISMATCH/.test(mm.error),
  b13CacheOtherRevRefetched: calls2 === 1 && kRev.cached === false && store2.rev === POOL_COMMIT,
  unreachablePoolIsNull: e.pool === null && e.error === 'HTTP 403',
  forgedLineRejected: !isIssuedLine(forged),
}, { l1: l1.text, l2: l2.text, l3: l3.text, l4: l4.source, rejects: rProp.status().rejects, blob: a.blob }))
