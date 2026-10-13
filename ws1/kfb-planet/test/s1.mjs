// S1 Kartenbilder · cardImage(deckId, n) über card-art-2d (1:1), Bildpaar gegen die Inventur-Referenz,
// Name gegen das Deck-JSON, echte Bilder auf Turm, Bühne und Sammlung. Braucht Netz (raw.githubusercontent).
import fs from 'fs'
import crypto from 'crypto'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out', { recursive: true })
const vendor = fs.readFileSync('src/vendor/card-art-2d.js')
const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${vendor.length}\0`), vendor])).digest('hex')
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'))
const di = cards.decks.findIndex((d) => d[0] === 'forget_utopia')
const spikeName = cards.cards.find((c) => c[0] === di && c[1] === 7)?.[2]
const ref = 'data:image/png;base64,' + fs.readFileSync('test/ref/card_forget_utopia_7.png').toString('base64')

const { browser, page, errs } = await openPage('#debug')
await page.waitForFunction(() => window.__kfbCardImage && window.__kfbStore, null, { timeout: 60000 })
const r = await page.evaluate(async (refUrl) => {
  const a = await window.__kfbCardImage('forget_utopia', 7)
  if (!a) return null
  const load = (u) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = u })
  const [ours, theirs] = await Promise.all([load(a.png), load(refUrl)])
  // Bildpaar: beide auf 298×166, mittlere Abweichung je Kanal (0..255)
  const W = 298, H = 166, px = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, H); return g.getImageData(0, 0, W, H).data }
  const p1 = px(ours), p2 = px(theirs)
  let d = 0, v = 0, m = 0
  for (let i = 0; i < p1.length; i += 4) { for (let k = 0; k < 3; k++) { d += Math.abs(p1[i + k] - p2[i + k]); m += p1[i + k] } }
  const mean = m / (W * H * 3)
  for (let i = 0; i < p1.length; i += 4) v += (p1[i] - mean) ** 2
  // Paar-Bild: links Referenz, rechts Stand
  const pair = document.createElement('canvas'); pair.width = 1200; pair.height = 340
  const g = pair.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 1200, 340)
  g.drawImage(theirs, 0, 0, 596, 332); g.drawImage(ours, 604, 0, 596, 332)
  // Name gegen das Deck-JSON derselben Kartenquelle
  const base = window.OW_SRC.kfb('')
  const idx = await (await fetch(base + 'index.json')).json()
  const deck = idx.decks.find((x) => x.packId === 'forget_utopia')
  const json = await (await fetch(base + deck.data)).json()
  const jname = (json.cards || []).find((c) => String(c.cardNumber) === '7')?.cardName
  return { page: a.page, quad: a.quad, ar: a.ar, diff: d / (W * H * 3), variance: v / (W * H), pair: pair.toDataURL('image/png'), jname }
}, ref)
if (r) fs.writeFileSync('test/out/s1_pair_forget_utopia_7.png', Buffer.from(r.pair.split(',')[1], 'base64'))

// Turm: erste Karte freispielen -> echte Textur; Bühne: Actor setzen; Sammlung: Kartenbild im DOM
const t = await page.evaluate(async () => {
  const s = window.__kfbStore.getState(); s.closeDialog()
  const tower = window.__kfbTower(); const card = tower[0]
  s.collect(card); s.setActor(tower[1])
  const base = window.OW_SRC.kfb('')
  const idx = await (await fetch(base + 'index.json')).json()
  const deck = idx.decks.find((x) => x.packId === card.deck.id)
  const json = await (await fetch(base + deck.data)).json()
  const jname = (json.cards || []).find((c) => String(c.cardNumber) === String(card.num))?.cardName
  return { deck: card.deck.id, n: card.num, name: card.name, jname }
})
await page.waitForFunction(() => window.__kfbCardStats().loaded >= 2, null, { timeout: 90000 }).catch(() => {})
await page.waitForFunction(() => document.querySelector('.chip .card-art.ok'), null, { timeout: 60000 }).catch(() => {})
const stats = await page.evaluate(() => ({ ...window.__kfbCardStats(), chipArt: !!document.querySelector('.chip .card-art.ok') }))
await page.screenshot({ path: 'test/out/s1_scene.png' })
await browser.close()
process.exit(report('s1 card images', {
  vendorByteIdentical: blob === 'd14b497eda84f8e48ccb37e57882b4bcf934753b',
  quarterLoaded: !!r,
  mappingPage3Quad2: r?.page === 3 && r?.quad === 2,
  landscape: r?.ar > 1.6 && r?.ar < 2.0,
  notBlank: r?.variance > 200,
  pairMatchesReference: r?.diff < 12,
  nameMatchesJson: r?.jname === 'The Moving Launch Date' && spikeName === r?.jname,
  towerNameMatchesJson: !!t.jname && t.jname === t.name,
  towerAndStageRealTextures: stats.loaded >= 2 && stats.failed === 0,
  collectionShowsArt: stats.chipArt,
  noPageErrors: errs.length === 0,
}, { blob, ref: { page: r?.page, quad: r?.quad, ar: r?.ar, diff: r?.diff, variance: r?.variance, jname: r?.jname, spikeName }, tower: t, stats, errs }))
