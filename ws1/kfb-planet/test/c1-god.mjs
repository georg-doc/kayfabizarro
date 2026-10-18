// C1 Kamera (V-408) · God-Mode/Bühne: Zoom zum Cursor trifft den Punkt unter dem Cursor (Abweichung ≤ 2 % der Bildbreite), hinein und heraus, an drei
// Cursor-Stellen; echte Mausrad-Ereignisse (Raste −120/+120). Punkt = Treffer des Strahls unter dem Cursor beim ersten Rad-Ereignis (StageZoom.p).
import { openPage, report } from './_page.mjs'
const W = 1280, H = 720
const { browser, page, errs } = await openPage('#stage,debug', { viewport: { width: W, height: H } })
await page.waitForFunction(() => window.__kfbStageOrbit?.controls && window.__kfbStageZoom && window.__kfbStageCtl?.log?.().amph?.create > 0, null, { timeout: 240000 })
await page.waitForTimeout(2500)
const runs = []
for (const [cx, cy] of [[0.62, 0.55], [0.35, 0.62], [0.5, 0.45]]) for (const dir of [-1, 1]) {
  const x = Math.round(cx * W), y = Math.round(cy * H)
  await page.evaluate(() => window.__kfbStageOrbit.jump('standard')); await page.waitForTimeout(1600)
  await page.mouse.move(x, y)
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 120 * dir); await page.waitForTimeout(60) }
  await page.waitForTimeout(1500)
  const r = await page.evaluate(([W, H]) => { const c = window.__kfbStageOrbit.controls, cam = c.object, p = window.__kfbStageZoom.p.clone(); cam.updateMatrixWorld(); p.project(cam)
    return { sx: (p.x + 1) * W / 2, sy: (1 - p.y) * H / 2, dist: +cam.position.distanceTo(c.target).toFixed(2) } }, [W, H])
  runs.push({ cursor: [x, y], dir, ...r, devPct: +(Math.hypot(r.sx - x, r.sy - y) / W * 100).toFixed(2) })
}
await browser.close()
process.exit(report('c1-god', {
  zoomToCursor2pct: runs.every((r) => r.devPct <= 2),
  zoomChangesDistance: runs.filter((r) => r.dir < 0).every((r) => r.dist > 0),
  noPageErrors: errs.length === 0,
}, { runs, errs: errs.slice(0, 3) }))
