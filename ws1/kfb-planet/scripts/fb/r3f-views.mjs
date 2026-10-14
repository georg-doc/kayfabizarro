// Spiel-Seite des Bildpaars (V-240): #actortest je Ansicht, Bindepose, Augen eingefroren wie die Spender-Aufnahme. node scripts/fb/r3f-views.mjs <ordner> [view …]
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const OUT = process.argv[2] || 'test/out/r3f08', VIEWS = process.argv.slice(3).length ? process.argv.slice(3) : ['face', 'q', 'side']
fs.mkdirSync(OUT, { recursive: true })
for (const v of VIEWS) {
  const { browser, page, errs } = await openPage(`#actortest,debug,view=${v},partcolors=model`, { viewport: { width: 900, height: 900 } })
  await page.waitForFunction(() => window.__kfbActor && window.__kfbActor.status().status === 'OK' && window.__kfbActor.status().hair && window.__kfbActor.status().ao?.baked, null, { timeout: 120000 }) // Kontaktschatten fertig eingebacken
  await page.waitForTimeout(1500)
  await page.evaluate(() => { const R = window.__kfbActor.debugRig(); R.setLife({ on: false }); R._blinkK = -1; R._blinkT = 1e9; R.setGazeFollow(true); R.pointTo(0, 0); window.__kfbActor.debugFace().set('brow.life.on', false) })
  await page.waitForTimeout(2000)
  fs.writeFileSync(`${OUT}/r3f_${v}.png`, await page.screenshot())
  if (v === VIEWS[0]) console.log(JSON.stringify(await page.evaluate(() => ({ st: window.__kfbActor.status(), rep: window.__kfbActor.report() }))).slice(0, 900), 'errs', errs)
  await browser.close()
}
