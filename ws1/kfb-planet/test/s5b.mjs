// S5b Pool-Leser · deterministisch in Node, ohne Netz (Vertrag §5, Consumer-Vertrag #365).
// Fixtures: test/fixtures/pool-r5.json (= Pool r5, Blob dfb5435b), test/fixtures/wrinkle_rumble.json (Deck-JSON am
// MEDIA_COMMIT, Blob 695e74af). Die ACCEPTED-Variante ist eine ausdrücklich markierte Test-Kopie (humanApproval TEST FIXTURE),
// keine Freigabe.
import fs from 'fs'
import crypto from 'crypto'
import { loadPool, createPoolReader, isIssuedLine, SILENCE } from '../src/poolReader.js'
import { report } from './_page.mjs'
const blobOf = (buf) => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex')
const poolBuf = fs.readFileSync('test/fixtures/pool-r5.json'), deckBuf = fs.readFileSync('test/fixtures/wrinkle_rumble.json')
const deckBlobs = JSON.parse(fs.readFileSync('src/data/deck-blobs.json', 'utf8')).decks
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'))
const cardOf = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); const c = cards.cards.find((x) => x[0] === di && x[1] === n); return { deck: { id: deck }, num: n, name: c[2], power: c[3], lore: c[4] } }
const fakeFetch = (buf) => async () => ({ ok: true, json: async () => ({ sha: blobOf(buf), content: buf.toString('base64') }) })
const deckJson = async (id) => { if (id !== 'wrinkle_rumble') throw new Error('nur Fixture'); return JSON.parse(deckBuf.toString('utf8')) }

// a · Pool r5 laden
const a = await loadPool({ fetchImpl: fakeFetch(poolBuf) })
const r5 = createPoolReader({ pool: a.pool, poolBlob: a.blob, deckBlobs, deckJson })
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
const b = await loadPool({ fetchImpl: fakeFetch(accBuf) })
const rAcc = createPoolReader({ pool: b.pool, poolBlob: b.blob, deckBlobs, deckJson })
const l3 = await rAcc.lineFor(cookie)
// c · Beat ACCEPTED, aber Opener nur PROPOSED -> keine Pool-Zeile, Kartentext
const prop = JSON.parse(accBuf.toString('utf8')); prop.beats[0].openerId = 'ANYONE_HEARD_OF'; prop.beats[0].openerVersion = 1
const c = await loadPool({ fetchImpl: fakeFetch(Buffer.from(JSON.stringify(prop))) })
const rProp = createPoolReader({ pool: c.pool, poolBlob: c.blob, deckBlobs, deckJson })
const l4 = await rProp.lineFor(cookie)
// d · Karte ohne Lore -> „…“; ohne Pool -> Kartentext
const noLore = { ...cookie, lore: 'None' }
const l5 = await r5.lineFor(noLore, { field: 'lore' })
const l6 = await createPoolReader({}).lineFor(cookie)
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
  noPoolGivesCard: l6.source === 'CARD',
  unreachablePoolIsNull: e.pool === null && e.error === 'HTTP 403',
  forgedLineRejected: !isIssuedLine(forged),
}, { l1: l1.text, l2: l2.text, l3: l3.text, l4: l4.source, rejects: rProp.status().rejects, blob: a.blob }))
