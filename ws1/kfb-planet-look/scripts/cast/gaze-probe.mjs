// Prüfsonde: KayKit-Kandidat rechts – Pupillen bei lookAt(−0,7; 0,05) und nach lookAt(null). node scripts/cast/gaze-probe.mjs <actorId>
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const id = process.argv[2] || 'adventurer-mage'
const { browser, page } = await openPage(`#stage,debug,actors=fb,cast=${id}`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbStageMods?.right?.status().status === 'OK', null, { timeout: 300000 }); await page.waitForTimeout(1500)
const clip = { x: 1000, y: 330, width: 260, height: 170 }
const st = () => page.evaluate(() => { const R = window.__kfbStageMods.right.debugRig(); return { follow: R.gazeFollow ?? R._gazeFollow ?? null, px: R.eyes.map((e) => [e._px, e._py].map((v) => +(+v).toFixed(3))), max: R._max } })
const out = {}
out.start = await st(); fs.writeFileSync(`test/out/cast/gaze_0_${id}.png`, await page.screenshot({ clip }))
await page.evaluate(() => window.__kfbStageMods.right.lookAt(-0.7, 0.05)); await page.waitForTimeout(1200)
out.look = await st(); fs.writeFileSync(`test/out/cast/gaze_1_${id}.png`, await page.screenshot({ clip }))
await page.evaluate(() => window.__kfbStageMods.right.lookAt(null)); await page.waitForTimeout(1500)
out.free = await st(); fs.writeFileSync(`test/out/cast/gaze_2_${id}.png`, await page.screenshot({ clip }))
console.log(JSON.stringify(out)); await browser.close()
