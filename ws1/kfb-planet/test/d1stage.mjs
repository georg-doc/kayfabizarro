// D1 auf der Bühne (#stage, Platzhalter-Figuren F1, 2 Karten): Sprechblasen an den Ankern der Sprecher, Billboard wechselt die Karte,
// Spielerwahl öffnet sich, Taste 1 → Zuruf-Blase am Publikums-Anker, der Dialog geht weiter. Mechanik, kein Look (FrizzleBob gestoppt).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,cam=two,actors=rogue,dialog=2,lines=alt', { viewport: { width: 1280, height: 720 } })
const st = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state())
const until = async (f, ms = 240000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await st(); if (s && f(s)) return s; await page.waitForTimeout(100) } throw new Error('timeout ' + JSON.stringify(await st())) }
const bubbles = () => page.evaluate(() => window.__kfbBubbles())
await until((s) => s.phase === 'A'); await page.waitForTimeout(400); const bA = await bubbles()
await until((s) => s.phase === 'B'); await page.waitForTimeout(400); const bB = await bubbles()
await until((s) => s.phase === 'CHOICE'); await page.waitForTimeout(600); const open = await page.evaluate(() => window.__kfbChoice.isOpen())
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/d1stage_choice.png', await page.screenshot())
await page.keyboard.press('1'); await page.waitForTimeout(700); const bZ = await bubbles(), last = await page.evaluate(() => window.__kfbChoice.last())
await until((s) => s.beat === 1 && s.phase === 'A'); await page.waitForTimeout(400); const card2 = await page.evaluate(() => window.__kfbStageMods.billboard.info().card), bA2 = await bubbles()
const log = await page.evaluate(() => window.__kfbStageMods.dialog.log()), deck = await page.evaluate(() => window.__kfbStageCtl.deck.map((c) => ({ id: c.deck.id + '#' + c.num, name: c.name, power: c.power })))
await browser.close()
const shown = (b, anchor, text) => b.some((x) => x.anchor === anchor && x.shown && x.text === text)
const lines = log.filter((e) => e.type === 'line')
process.exit(report('d1 stage', {
  startsWhenReady: log[0]?.type === 'card' && log[0].card === deck[0].id,
  aBubbleOnLeftActor: shown(bA, 'stage-left', deck[0].name) && lines[0].source === 'CARD',
  bBubbleOnRightActor: shown(bB, 'stage-right', deck[0].power),
  choiceOpensAfterB: open === true,
  zurufOnPlayerAnchor: last?.label === 'KayfaBINGO!' && shown(bZ, 'player', 'KayfaBINGO!'),
  choiceReachedDialog: log.some((e) => e.type === 'choice' && e.id === 'bingo') && !log.some((e) => e.type === 'choice-timeout'), // Verdrahtung lastChoice → Dialog, kein Zeitablauf
  nextCardOnBillboard: card2 === deck[1].id && shown(bA2, 'stage-right', deck[1].name),
  noPageErrors: errs.length === 0,
}, { deck, lines: lines.map((e) => [e.speaker, e.source, e.text.slice(0, 30)]), card2, errs }))
