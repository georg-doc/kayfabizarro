// B1-Schnellprobe: #stagetest laden, warten bis Karte (CARD) und beide Darsteller da sind, Bild + Info. node scripts/b1/probe.mjs [view] [out] [card]
import { openPage } from '../../test/_page.mjs'
const view = process.argv[2] || 'two', out = process.argv[3] || 'test/out/stage_probe.png', card = process.argv[4] || 'forget_utopia:1'
const { browser, page, errs } = await openPage(`#stagetest,debug,view=${view},card=${card}`, { log: false, viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbBillboard?.info()?.source === 'CARD' && window.__kfbStageActors?.left?.status().status === 'OK' && window.__kfbStageActors?.right?.status().status === 'OK', null, { timeout: 180000 }).catch((e) => console.log('timeout', e.message))
await page.waitForTimeout(2500)
console.log(JSON.stringify(await page.evaluate(() => ({ bb: window.__kfbBillboard?.info(), l: window.__kfbStageActors?.left?.status(), r: window.__kfbStageActors?.right?.status() }))))
await page.screenshot({ path: out }); console.log('errs', errs); await browser.close()
