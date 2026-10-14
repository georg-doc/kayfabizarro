// S1 Kartenbilder · cardImage(deckId, n) über card-art-2d (1:1). Feste Karten, ohne Turm (der Deck-Turm ist Legacy, V-216).
// Bildpaare gegen unabhängige Referenzen (macOS PDFKit, scripts/make-ref.py), nicht gegen pdf.js selbst.
// Braucht Netz (raw.githubusercontent, jsDelivr).
import fs from 'fs'
import crypto from 'crypto'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out', { recursive: true })
const vendor = fs.readFileSync('src/vendor/card-art-2d.js')
const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${vendor.length}\0`), vendor])).digest('hex')
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'))
const spikeName = (deck, n) => { const di = cards.decks.findIndex((d) => d[0] === deck); return cards.cards.find((c) => c[0] === di && c[1] === n)?.[2] }
const ref = (f) => 'data:image/png;base64,' + fs.readFileSync('test/ref/' + f).toString('base64')
const PP_PAGE = JSON.parse(fs.readFileSync('test/ref/card_plot_pusher_posse_2.json', 'utf8')).page // aus make-ref.py (Registry am MEDIA_COMMIT)
// Paare: forget_utopia #7 (Karte der Inventur) und plot_pusher_posse #2 (zweites, unabhängig gewähltes Deck)
const PAIRS = [
  { deck: 'forget_utopia', n: 7, ref: ref('card_forget_utopia_7.png'), page: 3, quad: 2 },
  { deck: 'plot_pusher_posse', n: 2, ref: ref('card_plot_pusher_posse_2.png'), page: PP_PAGE, quad: 1 },
]
// gesperrte Beispiele aus dem Audit: eine Karte eines UNSAFE-Decks und eine einzeln gesperrte Karte eines SAFE-Decks
const AUDIT = JSON.parse(fs.readFileSync('src/data/mapping-audit.json', 'utf8')).decks
const unsafeDeck = Object.keys(AUDIT).find((k) => AUDIT[k].status === 'UNSAFE' && (AUDIT[k].blocked || []).length)
const safeWithBlock = Object.keys(AUDIT).find((k) => AUDIT[k].status === 'SAFE' && (AUDIT[k].blocked || []).length)
const BLOCKED = [[unsafeDeck, AUDIT[unsafeDeck].blocked[0]], [safeWithBlock, AUDIT[safeWithBlock].blocked[0]]]
const OKCARD = [safeWithBlock, AUDIT[safeWithBlock].ok[0]]
// Name gegen Bild: Titel der Referenz, mit Apple Vision gelesen (test/ref/*.json). Regel wie card_ok() in
// scripts/audit-mapping.py: eigener Name ≥ 0,75 (Wortanteil ohne Füllwörter, sonst Zeichenähnlichkeit) und besser
// als jeder andere Kartenname des Decks. Die Zeichenähnlichkeit ist hier ein einfacher Bigramm-Dice statt SequenceMatcher.
const STOP = new Set(['THE', 'A', 'AN', 'OF', 'AND', 'TO', 'IN', 'ON', 'FOR', 'DER', 'DIE', 'DAS', 'UND', 'LE', 'LA'])
const toks = (s) => s.normalize('NFKC').toUpperCase().replace(/’/g, "'").split(/[^\p{L}\p{N}_]+/u).filter(Boolean)
const dice = (a, b) => { const bg = (x) => { const m = new Map(); for (let i = 0; i < x.length - 1; i++) { const k = x.slice(i, i + 2); m.set(k, (m.get(k) || 0) + 1) } return m }; const A = bg(a), B = bg(b); let n = 0; for (const [k, v] of A) n += Math.min(v, B.get(k) || 0); const t = Math.max(1, a.length - 1 + b.length - 1); return 2 * n / t }
const score = (name, lines) => { const head = lines.slice(0, 7); if (!head.length) return 0; const got = new Set(head.flatMap(toks)); let nt = toks(name).filter((t) => !STOP.has(t) && t.length >= 2); if (!nt.length) nt = toks(name); if (!nt.length) return 0; const tok = nt.filter((t) => got.has(t)).length / nt.length; const nn = toks(name).join(' '); const seq = Math.max(...head.map((l) => dice(nn, toks(l).join(' ')))); return Math.max(tok, seq) }
const deckNames = (deck) => { const di = cards.decks.findIndex((d) => d[0] === deck); return cards.cards.filter((c) => c[0] === di).map((c) => [c[1], c[2]]) }
const titleMatches = (deck, n, lines) => { const own = score(spikeName(deck, n), lines); const other = Math.max(0, ...deckNames(deck).filter(([m]) => m !== n).map(([, nm]) => score(nm, lines))); return own >= 0.75 && own > other }
const refMeta = (deck, n) => JSON.parse(fs.readFileSync(`test/ref/card_${deck}_${n}.json`, 'utf8'))
const imageTitles = PAIRS.map((p) => ({ deck: p.deck, n: p.n, name: spikeName(p.deck, p.n), ocr: refMeta(p.deck, p.n).ocr.slice(0, 5), ok: titleMatches(p.deck, p.n, refMeta(p.deck, p.n).ocr) }))

const { browser, page, errs, warns } = await openPage('#debug')
await page.waitForFunction(() => window.__kfbCardImage && window.__kfbStore && window.__kfbCard, null, { timeout: 60000 })

const pairs = await page.evaluate(async (list) => {
  const load = (u) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = u })
  const W = 298, H = 166
  const px = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, H); return g.getImageData(0, 0, W, H).data }
  const base = window.OW_SRC.kfb('')
  const idx = await (await fetch(base + 'index.json')).json()
  const out = []
  for (const p of list) {
    const a = await window.__kfbCardImage(p.deck, p.n)
    if (!a) { out.push({ deck: p.deck, n: p.n, loaded: false }); continue }
    const [ours, theirs] = await Promise.all([load(a.png), load(p.ref)])
    const p1 = px(ours), p2 = px(theirs)
    let d = 0, m = 0, v = 0
    for (let i = 0; i < p1.length; i += 4) for (let k = 0; k < 3; k++) { d += Math.abs(p1[i + k] - p2[i + k]); m += p1[i + k] }
    const mean = m / (W * H * 3)
    for (let i = 0; i < p1.length; i += 4) v += (p1[i] - mean) ** 2
    const pair = document.createElement('canvas'); pair.width = 1200; pair.height = 340
    const g = pair.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 1200, 340)
    g.drawImage(theirs, 0, 0, 596, 332); g.drawImage(ours, 604, 0, 596, 332)
    const deck = idx.decks.find((x) => x.packId === p.deck)
    const json = await (await fetch(base + deck.data)).json()
    const jname = (json.cards || []).find((c) => String(c.cardNumber) === String(p.n))?.cardName
    out.push({ deck: p.deck, n: p.n, loaded: true, page: a.page, quad: a.quad, ar: a.ar, diff: d / (W * H * 3), variance: v / (W * H), jname, pair: pair.toDataURL('image/png') })
  }
  return { out }
}, PAIRS)
for (const p of pairs.out) if (p.pair) fs.writeFileSync(`test/out/s1_pair_${p.deck}_${p.n}.png`, Buffer.from(p.pair.split(',')[1], 'base64'))

// Gesperrte Karten liefern kein Bild, freigegebene schon (Freigabe je Karte)
const gate = await page.evaluate(async ([blocked, okc]) => ({
  blockedNull: (await Promise.all(blocked.map(([d, n]) => window.__kfbCardImage(d, n)))).every((r) => r === null),
  cardGate: [window.__kfbCardSafe(okc[0], okc[1]), window.__kfbCardSafe(blocked[1][0], blocked[1][1])],
  safe: window.__kfbSafeDecks(),
}), [BLOCKED, OKCARD])

// Sammlung, Actor-Abzeichen und Bühnen-Aufsteller mit festen, freigegebenen Karten (kein Turm)
const before = await page.evaluate(() => window.__kfbCardStats().loaded)
const fixed = [['forget_utopia', 7], ['forget_utopia', 8], ['forget_utopia', 9], ['forget_utopia', 10], ['plot_pusher_posse', 2]]
const staged = await page.evaluate((fixed) => {
  const s = window.__kfbStore.getState(); s.closeDialog()
  const cs = fixed.map(([d, n]) => window.__kfbCard(d, n))
  for (const c of cs) s.collect(c)
  s.setActor(cs[0])
  s.setEpisode({ quest: cs[4], die: 1, stage: [cs[1], cs[2], cs[3]], transcript: [], finale: false, turn: 0 })
  return cs.map((c) => c.deck.id + '#' + c.num)
}, fixed)
await page.waitForFunction((n) => window.__kfbCardStats().loaded >= n, before + 3, { timeout: 180000 }).catch(() => {})
await page.waitForFunction(() => document.querySelector('.chip .card-art.ok'), null, { timeout: 60000 }).catch(() => {})
const stats = await page.evaluate(() => ({ ...window.__kfbCardStats(), chipArt: !!document.querySelector('.chip .card-art.ok') }))
await page.screenshot({ path: 'test/out/s1_scene.png' })
await browser.close()

process.exit(report('s1 card images', {
  vendorByteIdentical: blob === 'd14b497eda84f8e48ccb37e57882b4bcf934753b',
  pairsLoaded: pairs.out.every((p) => p.loaded),
  mappingPageQuad: PAIRS.every((p, i) => pairs.out[i].page === p.page && pairs.out[i].quad === p.quad),
  landscape: pairs.out.every((p) => p.ar > 1.6 && p.ar < 2.0),
  notBlank: pairs.out.every((p) => p.variance > 200),
  // Trennschärfe (blinder Prüfer): gleiche Karte ~10, Nachbarkarte 43–57, 3 px Versatz 36
  pairsMatchReference: pairs.out.every((p) => p.diff < 14),
  namesMatchJson: pairs.out.every((p) => p.jname && p.jname === spikeName(p.deck, p.n)),
  imageTitleMatchesName: imageTitles.every((t) => t.ok),
  blockedCardsGiveNoImage: gate.blockedNull,
  perCardGate: gate.cardGate[0] === true && gate.cardGate[1] === false,
  auditSafeDecks: gate.safe.length >= 55,
  stageActorRealTextures: stats.loaded >= before + 3 && stats.failed === 0,
  collectionShowsArt: stats.chipArt,
  noCardWarnings: warns.length === 0,
  noPageErrors: errs.length === 0,
}, { blob, pairs: pairs.out.map(({ pair, ...p }) => p), imageTitles, gate: { ...gate, safe: gate.safe.length, BLOCKED, OKCARD }, staged, stats, warns, errs }))
