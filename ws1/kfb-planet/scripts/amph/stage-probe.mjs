// Bühnen-Probe: #stage laden, warten bis Amphitheater + Karte (+ Figuren) da sind, Bild + Status. node scripts/amph/stage-probe.mjs [cam] [out] [actors]
import { openPage } from '../../test/_page.mjs'
const cam = process.argv[2] || 'two', out = process.argv[3] || 'test/out/stage.png', actors = process.argv[4] || 'none'
const { browser, page, errs } = await openPage(`#stage,debug,cam=${cam},actors=${actors}`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction((a) => { const S = window.__kfbStageMods; return S?.amph?.status().status !== 'LOADING' && S?.billboard?.info()?.source === 'CARD' && (a === 'none' || (S.left?.status().status === 'OK' && S.right?.status().status === 'OK')) }, actors, { timeout: 240000 })
await page.waitForTimeout(2500)
console.log(JSON.stringify(await page.evaluate(() => ({ amph: window.__kfbStageMods.amph.status(), bb: window.__kfbStageMods.billboard.info() }))))
await page.screenshot({ path: out }); console.log('errs', errs); await browser.close()
