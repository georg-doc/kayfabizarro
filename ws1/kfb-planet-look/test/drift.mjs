// WS0 zu §24.2 · Dialog-Karten: drift-freie Seiten bevorzugt (Auswahl, nicht Beschnitt). Daten = scripts/b1/build-drift-cards.py am gepinnten Kartenstand.
import fs from 'fs'
import { execSync } from 'child_process'
import { openPage, report } from './_page.mjs'

const D = JSON.parse(fs.readFileSync('src/data/drift-cards.json', 'utf8')), media = /MEDIA_COMMIT = '([0-9a-f]{40})'/.exec(fs.readFileSync('src/cardMapping.js', 'utf8'))[1]
const before = fs.readFileSync('src/data/drift-cards.json', 'utf8'); execSync('python3 scripts/b1/build-drift-cards.py'); const regen = fs.readFileSync('src/data/drift-cards.json', 'utf8') === before
const DECK = 'academic_anarchy_intellectual', drift = new Set(D.decks[DECK])
// Deck mit Drift auf den Seiten 9–11 (Karten 29–40): Start bei #27, sechs Karten → 27, 28, dann über die Drift-Seiten hinweg ab 41
const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,card=${DECK}:27,dialog=6`, { viewport: { width: 640, height: 360 } })
await page.waitForFunction(() => window.__kfbStageCtl?.deck, null, { timeout: 120000 })
const a = await page.evaluate(() => window.__kfbStageCtl.deck.map((c) => c.num)); await browser.close()
// Start auf einer Drift-Karte: sie bleibt vorn (ausdrücklich gewählt), danach nur drift-freie
const s = Math.min(...drift)
const o = await openPage(`#stage,debug,actors=fb,card=${DECK}:${s},dialog=4`, { viewport: { width: 640, height: 360 } })
await o.page.waitForFunction(() => window.__kfbStageCtl?.deck, null, { timeout: 120000 })
const b = await o.page.evaluate(() => window.__kfbStageCtl.deck.map((c) => c.num)); await o.browser.close()
process.exit(report('drift selection', {
  dataPinnedAndReproducible: D.media === media && regen,
  sixCardsSkipDriftPages: JSON.stringify(a) === JSON.stringify([27, 28, 41, 42, 43, 44]),
  chosenStartKeptRestFree: b.length === 4 && b[0] === s && b.slice(1).every((n) => !drift.has(n)) && b.slice(1).every((n) => n > s),
  noPageErrors: errs.length === 0 && o.errs.length === 0,
}, { a, b, drift: [...drift] }))
