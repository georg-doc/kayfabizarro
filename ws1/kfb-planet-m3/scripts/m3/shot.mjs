// M3 · Bild vom Stunt-Testfeld (Sichtprüfung): Auto vor den Rampen, Kamera hinter dem Auto. node scripts/m3/shot.mjs [x z yaw] → test/out/m3/field.png
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const [x = 21, z = 26, yaw = Math.PI] = process.argv.slice(2).map(Number)
fs.mkdirSync('test/out/m3', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,replay,car', { viewport: { width: 960, height: 540 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
await page.evaluate(async ([x, z, yaw]) => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
  M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 1, z], yaw }); const t = C.steps + 120; await new Promise((r) => { const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }) }, [x, z, yaw])
await page.screenshot({ path: 'test/out/m3/field.png' })
console.log(JSON.stringify({ errs: errs.slice(0, 3) }))
await browser.close()
