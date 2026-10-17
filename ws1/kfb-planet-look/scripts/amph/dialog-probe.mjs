// D1 auf der Bühne: #stage mit Figuren (ACTORS, Standard rogue) und 3 Karten; Kamera/Stellung per CAM/PLACE (G4-Probe: CAM=near PLACE=near), Bilder unter OUT; Bilder bei der ersten Zeile, der Antwort und der Spielerwahl; Wahl per Taste 1.
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,cam=' + (process.env.CAM || 'two') + ',actors=' + (process.env.ACTORS || 'rogue') + (process.env.PLACE ? ',place=' + process.env.PLACE : '') + ',dialog=3', { viewport: { width: 1280, height: 720 } })
const phase = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state())
const until = async (f, ms = 240000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await phase(); if (s && f(s)) return s; await page.waitForTimeout(150) } throw new Error('timeout ' + JSON.stringify(await phase())) }
await until((s) => s.phase === 'A'); await page.waitForTimeout(500); await page.screenshot({ path: (process.env.OUT || 'test/out/d1') + '_a.png' })
await until((s) => s.phase === 'B'); await page.waitForTimeout(500); await page.screenshot({ path: (process.env.OUT || 'test/out/d1') + '_b.png' })
await until((s) => s.phase === 'CHOICE'); await page.waitForTimeout(700); await page.screenshot({ path: (process.env.OUT || 'test/out/d1') + '_choice.png' })
await page.keyboard.press('1'); await page.waitForTimeout(900); await page.screenshot({ path: (process.env.OUT || 'test/out/d1') + '_zuruf.png' })
await until((s) => s.beat === 1 && s.phase === 'A'); await page.waitForTimeout(500); await page.screenshot({ path: (process.env.OUT || 'test/out/d1') + '_a2.png' })
console.log(JSON.stringify(await page.evaluate(() => ({ st: window.__kfbStageMods.dialog.state(), log: window.__kfbStageMods.dialog.log().map((e) => [e.type, e.speaker, e.source, (e.text || '').slice(0, 40)]), bubbles: window.__kfbBubbles?.() }))).slice(0, 2500))
console.log('errs', errs); await browser.close()
