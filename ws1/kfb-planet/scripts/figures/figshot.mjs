import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const out = process.argv[2]
const { browser, page, errs } = await openPage('#stage,debug,actors=fb,light=l1,nobar', { viewport: { width: 1600, height: 900 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S.left?.status().shown && S.right?.status().shown !== false && (S.clay?.info?.() || []).length >= 1 }, null, { timeout: 480000 }).catch(() => {})
await page.waitForTimeout(2500)
const info = await page.evaluate(() => ({ figs: window.__kfbStageCtl.figures, right: window.__kfbStageMods.right.status(), left: window.__kfbStageMods.left.status().status, rightLog: (window.__kfbStageMods.right.report?.() || {}).log?.slice?.(-6) || null }))
fs.writeFileSync(out + '/fig_total.png', await page.screenshot())
await page.evaluate(() => { const O = window.__kfbStageOrbit, cam = window.__kfbStageCamera, S = window.__kfbStageMods, V = cam.position.constructor; O.setActive?.(true); const h = new V(); S.right.object3d.getWorldPosition(h); h.y = 1.2; const d = cam.position.clone().sub(h).setY(0).normalize(); O.controls.target.copy(h); cam.position.copy(h).addScaledVector(d, 1.4).setY(1.3); O.controls.update() })
await page.waitForTimeout(1200); fs.writeFileSync(out + '/fig_gg_nah.png', await page.screenshot())
console.log(JSON.stringify({ info, errs }).slice(0, 1500)); await browser.close()
