// D1 · Dialog-Ablauf (Mechanik) · deterministisch in Node, ohne Netz und ohne Darstellung.
// Echter Pool-Leser (src/poolReader.js) mit den S5b-Fixtures: Pool r5 + ausdrücklich markierte Test-Kopie (humanApproval TEST FIXTURE,
// keine Freigabe) mit Opener ANYONE_HEARD_OF für die Cookie-Karte (wrinkle_rumble #10). Darsteller/Billboard/Blase/Wahl sind Attrappen der Ports.
import fs from 'fs'
import crypto from 'crypto'
import { loadPool, createPoolReader, isIssuedLine } from '../src/poolReader.js'
import { createDialog, D1 } from '../src/modules/dialog.js'
import { report } from './_page.mjs'
const blobOf = (buf) => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex')
const poolBuf = fs.readFileSync('test/fixtures/pool-r5.json'), deckBuf = fs.readFileSync('test/fixtures/wrinkle_rumble.json')
const deckBlobs = JSON.parse(fs.readFileSync('src/data/deck-blobs.json', 'utf8')).decks
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'))
const cardSource = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); const c = di < 0 ? null : cards.cards.find((x) => x[0] === di && x[1] === n); return c ? { name: c[2], power: c[3], lore: c[4] } : null }
const cardOf = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); const c = cards.cards.find((x) => x[0] === di && x[1] === n); return { deck: { id: deck }, num: n, name: c[2], power: c[3], lore: c[4] } }
const fakeFetch = (buf) => async () => ({ ok: true, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length) }) // raw.githubusercontent.com (Lead B13)
const deckJson = async (id) => { if (id !== 'wrinkle_rumble') throw new Error('nur Fixture'); return JSON.parse(deckBuf.toString('utf8')) }
const fx = JSON.parse(poolBuf.toString('utf8')), ok = { authority: 'Georg', evidence: 'TEST FIXTURE ws1/d1 – keine Freigabe' }
const op = fx.openers.find((o) => o.openerId === 'ANYONE_HEARD_OF'); Object.assign(op, { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok, enabled: true })
Object.assign(fx.beats[0], { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok, openerId: 'ANYONE_HEARD_OF', openerVersion: op.version })
const fb = Buffer.from(JSON.stringify(fx)), P = await loadPool({ expectBlob: null, fetchImpl: fakeFetch(fb) })
const reader = createPoolReader({ pool: P.pool, poolBlob: P.blob, deckBlobs, deckJson, cardSource })
const cookie = cardOf('wrinkle_rumble', 10), other = cardOf('wrinkle_rumble', 11)

// Attrappen der Ports
const mkActor = (name, withMouth) => ({ name, looks: [], say: withMouth ? (t) => [{ key: 'ah', ms: 1200 }, { key: 'm', ms: 800 }] : undefined, lookAt(x, y) { this.looks.push(x == null ? null : [x, y]) } })
function run({ deck, mouth = true, choose = true, choiceAfterMs = 500, maxS = 120 }) {
  const said = [], bb = { cards: [], setCard(c) { this.cards.push(c); return Promise.resolve({ source: 'CARD' }) } } // feste Antwortzeit (Mikrotask): Wiederholung vergleichbar
  const actors = { left: mkActor('left', mouth), right: mkActor('right', mouth) }
  let open = 0, closed = 0
  const d = createDialog({ cards: deck, reader, billboard: bb, actors, say: (a, l) => said.push({ a, l }), openChoice: () => { open++ }, closeChoice: () => { closed++ } })
  return (async () => {
    const dt = 1 / 60; let t = 0, choiceAt = null
    while (d.state().phase !== 'DONE' && t < maxS) {
      d.update(dt); t += dt
      if (d.state().phase === 'CHOICE') { choiceAt ??= t; if (choose && (t - choiceAt) * 1000 >= choiceAfterMs) { d.onChoice({ id: 'bingo', label: 'KayfaBINGO!' }); choiceAt = null } }
      await new Promise((r) => setImmediate(r)) // asynchrone Schritte (Karte, Zeile) dürfen fertig werden
    }
    return { d, said, bb, actors, open, closed, log: d.log(), t }
  })()
}
const A = await run({ deck: [cookie, other] })
const lines = A.log.filter((e) => e.type === 'line'), seq = A.log.map((e) => e.type).join(' ')
const B = await run({ deck: [cookie, cookie] }) // dieselbe Karte zweimal: Opener darf nur einmal laufen (V-222)
const linesB = B.log.filter((e) => e.type === 'line')
const C = await run({ deck: [other], mouth: false, choose: false }) // ohne Mund (F1-Figur) und ohne Wahl → Lesedauer, Zeitablauf
const linesC = C.log.filter((e) => e.type === 'line')
const R1 = await run({ deck: [cookie, other] }), R2 = await run({ deck: [cookie, other] }) // Wiederholung bildgenau gleich
// Zusatzfälle (blinder Prüfer 8)
const tick = async (d, n) => { for (let k = 0; k < n; k++) { d.update(1 / 60); await new Promise((r) => setImmediate(r)) } }
const X = {}
{ // dispose hält an: zwei gleiche Dialoge bis Phase A, einer wird abgebaut; danach wächst nur das Log des anderen
  const mk = () => createDialog({ cards: [cookie, other], reader, billboard: { setCard: () => Promise.resolve() }, actors: {}, say: () => {} })
  const a = mk(), b = mk(); await tick(a, 20); await tick(b, 20)
  const pa = a.state().phase, na = a.log().length; a.dispose(); await tick(a, 600); await tick(b, 600)
  X.disposeStops = pa !== 'CARD' && pa !== 'IDLE' && a.log().length === na && b.log().length > na
}
{ // Zeile kommt nie (Abruf hängt) → nach lineWaitMs „…“ und weiter
  const hang = { lineFor: () => new Promise(() => {}), silence: () => reader.silence() }, said = []
  const d = createDialog({ cards: [cookie], reader: hang, billboard: { setCard: () => Promise.resolve() }, actors: {}, say: (a, l) => said.push(l) })
  await tick(d, Math.ceil((D1.lineWaitMs + 200) / (1000 / 60)) + 5)
  X.timeout = d.log().some((e) => e.type === 'line-timeout') && said[0]?.source === 'SILENCE' && isIssuedLine(said[0]) && d.state().phase !== 'A_LOAD'
}
{ // nur die eigene Wahl: fremde choiceId wird ignoriert, eigene angenommen; dispose schließt nur eine eigene Wahl
  let closed = 0
  const d = createDialog({ cards: [other], reader, billboard: { setCard: () => Promise.resolve() }, actors: {}, say: () => {}, openChoice: () => 5, closeChoice: () => { closed++ } })
  let n = 0; while (d.state().phase !== 'CHOICE' && n++ < 2000) await tick(d, 1)
  d.onChoice({ id: 'x', choiceId: 4 }); await tick(d, 2); const ignored = d.state().phase === 'CHOICE'
  d.onChoice({ id: 'bingo', choiceId: 5 }); await tick(d, 2); const taken = d.log().some((e) => e.type === 'choice' && e.id === 'bingo')
  const c2 = createDialog({ cards: [other], reader, billboard: { setCard: () => Promise.resolve() }, actors: {}, say: () => {}, closeChoice: () => { closed += 100 } }); await tick(c2, 3); c2.dispose()
  X.ownChoice = ignored && taken && closed < 100
}
{ // Opener DIRECT zählt nicht als verbraucht; dieselbe Karte zweimal → Beat nur einmal (V-231), danach wörtlicher Titel
  const f2 = JSON.parse(poolBuf.toString('utf8'))
  Object.assign(f2.openers.find((o) => o.openerId === 'DIRECT'), { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok }); Object.assign(f2.beats[0], { status: 'ACCEPTED', reviewer: 'ws1-test', humanApproval: ok })
  const b2 = Buffer.from(JSON.stringify(f2)), P2 = await loadPool({ expectBlob: null, fetchImpl: fakeFetch(b2) })
  const r2 = createPoolReader({ pool: P2.pool, poolBlob: P2.blob, deckBlobs, deckJson, cardSource }), lines = []
  const d = createDialog({ cards: [cookie, cookie], reader: r2, billboard: { setCard: () => Promise.resolve() }, actors: {}, say: (a, l) => lines.push(l), openChoice: () => null })
  let n = 0; while (d.state().phase !== 'DONE' && n++ < 20000) { await tick(d, 1); if (d.state().phase === 'CHOICE') d.onChoice({ id: 'bingo' }) }
  X.direct = lines[0].source === 'POOL' && lines[0].openerId === 'DIRECT' && lines[2].source === 'CARD' && lines[2].text === cookie.name && d.state().usedOpeners.length === 0 && d.state().usedBeats.length === 1
}
{ // Ports, die synchron werfen, reißen update() nicht ab
  let threw = false
  const d = createDialog({ cards: [other], reader, billboard: { setCard: () => { throw new Error('bb') } }, actors: {}, say: () => { throw new Error('say') }, openChoice: () => { throw new Error('oc') } })
  try { await tick(d, 400) } catch (e) { threw = true }
  X.throws = !threw && d.log().some((e) => e.type === 'port-error' && e.port === 'say') && d.log().some((e) => e.type === 'line')
}
const strip = (log) => log.map((e) => ({ ...e }))
const dA = lines[0], dB = lines[1], gap = (A.log.find((e) => e.type === 'line' && e.beat === 0 && e.speaker === 'right').t - dA.t) * 1000
process.exit(report('d1 dialog', {
  sequencePerCard: seq === 'card line line choice-open choice card line line choice-open choice done',
  billboardGetsEachCard: A.bb.cards.length === 2 && A.bb.cards[0] === cookie && A.bb.cards[1] === other,
  speakersAlternate: lines[0].speaker === 'left' && lines[1].speaker === 'right' && lines[2].speaker === 'right' && lines[3].speaker === 'left',
  aPoolTripletElseTitle: dA.source === 'POOL' && dA.openerId === 'ANYONE_HEARD_OF' && lines[2].source === 'CARD' && lines[2].text === other.name,
  bAlwaysLiteralPower: [1, 3].every((i) => lines[i].source === 'CARD' && lines[i].field === 'power') && lines[1].text === cookie.power && lines[3].text === other.power,
  allLinesIssued: A.said.every((x) => isIssuedLine(x.l)) && A.said.map((x) => x.a).join(',') === 'stage-left,stage-right,stage-right,stage-left',
  openerOncePerDialog: linesB[0].source === 'POOL' && linesB[2].source === 'CARD' && linesB[2].text === cookie.name && B.d.state().usedOpeners.join() === 'ANYONE_HEARD_OF',
  durationFromMimeTrack: dA.ms === 2000 && gap - (dA.ms + D1.gapMs) >= 0 && gap - (dA.ms + D1.gapMs) <= 3 * 1000 / 60 + 1, // + Ladeschritt der Antwortzeile (≤ 3 Bilder)
  durationWithoutMouthFromWords: linesC[0].ms === Math.max(D1.minLineMs, other.name.split(/\s+/).length * D1.wordMs),
  listenerLooksAtSpeaker: A.actors.right.looks[0]?.[0] === -0.7 && A.actors.left.looks.some((l) => l && l[0] === 0.7) && A.actors.left.looks.includes(null),
  choiceWaitsAndTimesOut: A.open === 2 && C.log.some((e) => e.type === 'choice-timeout') && C.closed >= 1,
  deterministicReplay: JSON.stringify(strip(R1.log)) === JSON.stringify(strip(R2.log)),
  disposeStops: X.disposeStops,
  lineTimeoutGivesSilence: X.timeout,
  onlyOwnChoiceCounts: X.ownChoice,
  directNotCountedBeatOnce: X.direct,
  throwingPortsContained: X.throws,
}, { seq, lines: lines.map(({ speaker, source, field, openerId, ms }) => ({ speaker, source, field, openerId, ms })), linesB: linesB.map((l) => l.source), gap }))
