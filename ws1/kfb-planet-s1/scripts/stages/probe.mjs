// Prüfsonde Meshy-Bühne: #stage,scene=<id>,actors=fb – Bild + Status (Bühne, Bildfläche, Figuren). node scripts/stages/probe.mjs <scene> [hash-zusatz] [out]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const scene = process.argv[2] || 'comic', extra = process.argv[3] || '', out = process.argv[4] || `test/out/stages/${scene}.png`
fs.mkdirSync('test/out/stages', { recursive: true })
const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,scene=${scene}${extra}`, { viewport: { width: 1920, height: 1080 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status !== 'LOADING' && S?.billboard?.info() && S.left?.status().shown && S.right?.status().shown }, null, { timeout: 300000 })
await page.waitForTimeout(2500)
fs.writeFileSync(out, await page.screenshot())
console.log(JSON.stringify(await page.evaluate(() => { const S = window.__kfbStageMods, cam = window.__kfbStageCamera
  return { stage: S.amph.status(), screen: S.billboard.info(), cam: cam.position.toArray().map((v) => +v.toFixed(2)), left: S.left.object3d.position.toArray(), right: S.right.object3d.position.toArray() } })), 'errs', errs.slice(0, 3))
await browser.close()
