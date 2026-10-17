// Mundbild-Spur ohne Ton auf dem Modellmund: vier Aufnahmen während say(), dazu Ruhe davor/danach. node scripts/fb/mouth-strip.mjs <out-dir>
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const out = process.argv[2] || 'test/out/mouth'; fs.mkdirSync(out, { recursive: true })
const { browser, page } = await openPage('#actortest,debug,view=face', { viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbActor && window.__kfbActor.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(2000)
const clip = { x: 300, y: 540, width: 300, height: 150 }, shots = []
shots.push(['Ruhe', await page.screenshot({ clip })])
await page.evaluate(() => window.__kfbActor.say('Hallo, ich bin FrizzleBob!'))
for (const ms of [200, 520, 900, 1500]) { await page.waitForTimeout(ms - (shots.length > 1 ? [200, 520, 900, 1500][shots.length - 2] : 0)); const k = await page.evaluate(() => window.__kfbActor.report().lip); shots.push([k || '?', await page.screenshot({ clip })]) }
await page.waitForTimeout(2500); shots.push(['danach', await page.screenshot({ clip })])
shots.forEach(([k, b], i) => fs.writeFileSync(`${out}/m${i}_${k}.png`, b)); console.log(shots.map((s) => s[0]).join(' ')); await browser.close()
