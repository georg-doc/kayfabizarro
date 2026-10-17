// V-256 Schritt 1 · Bildpaar vor | nach dem Schnitt (Träger + Inhalt): dasselbe Bild aus #stagetest (zwei Figuren, Karte forget_utopia #1)
// und eine Platzhalter-Karte. node scripts/b1/split-shot.mjs <ausgabe-präfix>
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/split/now'; fs.mkdirSync(OUT.replace(/\/[^/]*$/, ''), { recursive: true })
const { browser, page, errs } = await openPage('#stagetest,debug,view=two,card=forget_utopia:1', { viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbBillboard?.info()?.source === 'CARD' && window.__kfbStageActors?.left?.status().status === 'OK' && window.__kfbStageActors?.right?.status().status === 'OK', null, { timeout: 240000 })
// Figuren-Leben aus, damit nur der Schnitt den Unterschied machen kann
await page.evaluate(() => { for (const a of [window.__kfbStageActors.left, window.__kfbStageActors.right]) { const R = a.debugRig?.(); if (R) { R.setLife?.({ on: false }); R._blinkK = -1; R._blinkT = 1e9; R.pointTo?.(0, 0) } } })
await page.waitForTimeout(2500)
const bb = await page.evaluate(() => window.__kfbBillboard.info())
fs.writeFileSync(OUT + '_card.png', await page.screenshot())
const ph = await page.evaluate(async () => { const C = window.__kfbStageTestCtl, { DECKS, cardAt, cardsOfDeck } = C.cards, di = DECKS.findIndex((d) => d.id === 'anti_rules_toolkit'); return window.__kfbBillboard.setCard(cardAt(cardsOfDeck(di)[0])) })
await page.waitForTimeout(1500); fs.writeFileSync(OUT + '_placeholder.png', await page.screenshot())
console.log(JSON.stringify({ bb, ph, errs })); await browser.close()
