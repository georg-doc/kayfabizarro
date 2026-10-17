// Slice 1 · Sichtprobe Gelände um eine Meshy-Bühne (Sprenkel-Band an der Naht): Totale aus der Slot-Kamera und Blick von oben-schräg.
// node scripts/look/scene-shot.mjs [scene=goblin] [out]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const SC = process.argv[2] || 'goblin', OUT = process.argv[3] || 'test/out/look'; fs.mkdirSync(OUT, { recursive: true })
const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,light=l1,nobar,scene=${SC}`, { viewport: { width: 1600, height: 900 } })
await page.waitForFunction(() => window.__kfbStageMods?.amph?.status().status === 'OK' && window.__kfbStageMods.left?.status().shown, null, { timeout: 480000 }).catch(() => {}); await page.waitForTimeout(2500)
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#kfb-cam-marks,#kfb-compare,#kfb-preview-badge,#kfb-figure-status{display:none!important}'; document.head.appendChild(st) })
fs.writeFileSync(`${OUT}/scene_${SC}_slot.png`, await page.screenshot())
await page.evaluate(() => { const O = window.__kfbStageOrbit, c = window.__kfbStageCamera; O.setActive?.(true); c.position.set(9, 9, 13); O.controls.target.set(0, 0.5, 0); O.controls.update() })
await page.waitForTimeout(900); fs.writeFileSync(`${OUT}/scene_${SC}_oben.png`, await page.screenshot())
console.log(JSON.stringify({ ground: await page.evaluate(() => window.__kfbStageMods.ground?.info?.()), errs })); await browser.close()
