// Schnellprobe Darsteller-Slot: #actortest laden, Status + Bild. node scripts/fb/probe.mjs [view] [out.png]
import { openPage } from '../../test/_page.mjs'
const view = process.argv[2] || 'face', out = process.argv[3] || 'test/out/actor_probe.png'
const { browser, page, errs } = await openPage(`#actortest,debug,view=${view}`, { log: true, viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbActor && window.__kfbActor.status().status !== 'LOADING', null, { timeout: 120000 })
await page.waitForTimeout(2500)
console.log(JSON.stringify(await page.evaluate(() => ({ st: window.__kfbActor.status(), rep: window.__kfbActor.report() }))).slice(0, 1500))
await page.screenshot({ path: out }); console.log('errs', errs); await browser.close()
