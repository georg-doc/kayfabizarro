// Prüfsonde: Eingänge des Brauen-Lebens auf der Bühne über die Zeit (Augenradius, Blick, Maßstab, dt). node scripts/fb/stage-brows-why.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage(`#stage,debug,cam=near,actors=fb`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.left?.status().status === 'OK' }, null, { timeout: 240000 })
await page.evaluate(() => { window.__dts = []; let last = performance.now(); const f = () => { const n = performance.now(); window.__dts.push(n - last); last = n; requestAnimationFrame(f) }; requestAnimationFrame(f) })
for (let i = 0; i < 12; i++) {
  console.log(JSON.stringify(await page.evaluate(() => { const S = window.__kfbStageMods, R = S.left.debugRig(), f = R.eyeFrame(), d = window.__dts.splice(0)
    return { maxDt: Math.max(...d) | 0, n: d.length, R: +f.radius.toFixed(3), max: R._max, px: R.eyes.map((e) => [e._px, e._py].map((v) => +(+v).toExponential(2))), blinkK: R._blinkK } })))
  await page.waitForTimeout(2500)
}
await browser.close()
