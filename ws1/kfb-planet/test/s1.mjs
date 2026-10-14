// S1 Kartenbilder · cardImage(deckId, n) über card-art-2d (1:1). Deterministisch über #seed=4242 (fester Turm).
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
// Paare: forget_utopia #7 (Karte der Inventur) und die erste Turmkarte bei Seed 4242
const PAIRS = [
  { deck: 'forget_utopia', n: 7, ref: ref('card_forget_utopia_7.png'), page: 3, quad: 2 },
  { deck: 'project_gateway_kayfabe', n: 2, ref: ref('card_project_gateway_kayfabe_2.png'), page: 1, quad: 1 },
]
const SEED_TOWER = 'project_gateway_kayfabe'
// Name gegen Bild: Titel der Referenz, mit Apple Vision gelesen (test/ref/*.json), muss den Kartennamen enthalten.
// Gleiche Regel wie scripts/audit-mapping.py: ≥70 % der Namenswörter (≥3 Zeichen) in den ersten 5 Zeilen.
const norm = (s) => s.toUpperCase().replace(/’/g, "'").replace(/[^A-Z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean)
const titleMatches = (name, lines) => { const nt = norm(name).filter((t) => t.length >= 3); const got = new Set(lines.slice(0, 5).flatMap(norm)); return nt.length > 0 && nt.filter((t) => got.has(t)).length / nt.length >= 0.7 }
const refMeta = (deck, n) => JSON.parse(fs.readFileSync(`test/ref/card_${deck}_${n}.json`, 'utf8'))
const imageTitles = PAIRS.map((p) => ({ deck: p.deck, n: p.n, name: spikeName(p.deck, p.n), ocr: refMeta(p.deck, p.n).ocr.slice(0, 5), ok: titleMatches(spikeName(p.deck, p.n), refMeta(p.deck, p.n).ocr) }))

const { browser, page, errs, warns } = await openPage('#debug,seed=4242')
await page.waitForFunction(() => window.__kfbCardImage && window.__kfbStore && window.__kfbTower, null, { timeout: 60000 })

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

// Decks ohne geprüfte Zuordnung (Audit UNSAFE) liefern kein Bild; der Turm (Seed 4242) ist ein SAFE-Deck
const gate = await page.evaluate(async () => ({
  blockedNull: (await window.__kfbCardImage('suppressed_book_deck', 13)) === null && (await window.__kfbCardImage('nibelungen_booster_pack_design', 2)) === null,
  safe: window.__kfbSafeDecks(),
  towerDeck: window.__kfbTower()[0].deck.id,
}))

// Turm freispielen (12), Bühne mit drei Szenen + Quest, Actor setzen, Sammlung im DOM
const before = await page.evaluate(() => window.__kfbCardStats().loaded)
const staged = await page.evaluate(() => {
  const s = window.__kfbStore.getState(); s.closeDialog()
  const tower = window.__kfbTower()
  for (const c of tower) s.collect(c)
  s.setActor(tower[0])
  s.setEpisode({ quest: tower[11], die: 1, stage: [tower[8], tower[9], tower[10]], transcript: [], finale: false, turn: 0 })
  return tower.map((c) => c.deck.id + '#' + c.num)
})
await page.waitForFunction((n) => window.__kfbCardStats().loaded >= n, before + 12, { timeout: 180000 }).catch(() => {})
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
  unsafeDeckGivesNoImage: gate.blockedNull,
  towerDeckFixedBySeed: gate.towerDeck === SEED_TOWER,
  towerDeckAuditedSafe: gate.safe.includes(gate.towerDeck) && gate.safe.length >= 40,
  towerStageActorRealTextures: stats.loaded >= before + 12 && stats.failed === 0,
  collectionShowsArt: stats.chipArt,
  noCardWarnings: warns.length === 0,
  noPageErrors: errs.length === 0,
}, { blob, pairs: pairs.out.map(({ pair, ...p }) => p), imageTitles, gate: { ...gate, safe: gate.safe.length }, staged, stats, warns, errs }))
