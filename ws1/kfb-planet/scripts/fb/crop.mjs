import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const { browser, page } = await openPage('#actortest,debug,view=face', { viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbActor && window.__kfbActor.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(2000)
fs.writeFileSync('test/out/crop_open.png', await page.screenshot({ clip: { x: 250, y: 340, width: 420, height: 170 } }))
await page.evaluate(() => { const rig = window.__kfbActor.debugRig(); rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 }); await page.waitForTimeout(400)
fs.writeFileSync('test/out/crop_shut.png', await page.screenshot({ clip: { x: 250, y: 340, width: 420, height: 170 } }))
await browser.close()
