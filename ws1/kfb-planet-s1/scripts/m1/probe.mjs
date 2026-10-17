// M1 Sonde: Szene laden, Status, Bild. node scripts/m1/probe.mjs [hashzusatz] [out.png]
import { openPage } from '../../test/_page.mjs'
const [extra = '', out = 'test/out/m1/probe.png'] = process.argv.slice(2)
const { browser, page, errs } = await openPage('#m1,debug' + extra, { log: true })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 180000 }).catch((e) => console.log('timeout', e.message))
await page.waitForTimeout(2500)
console.log(JSON.stringify(await page.evaluate(() => window.__kfbM1?.status())).slice(0, 2500))
await page.screenshot({ path: out })
console.log('errs', errs.slice(0, 5))
await browser.close()
