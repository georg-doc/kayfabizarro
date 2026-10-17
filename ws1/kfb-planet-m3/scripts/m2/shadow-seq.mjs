// M2 · Schatten-Bildfolge (Georg 17.10.: Doppelschatten am Gelände-Übergang): Auto fährt vom Platz in die Hügel, je 25 Schritte ein Bild.
// node scripts/m2/shadow-seq.mjs <tag> → test/out/shadow/<tag>_<kind>_<tod>_<i>.png; je Fahrsystem (k2b, ecctrl) und Tageszeit (day, gold).
// dist/ aus dem Arbeitsbaum, in dem das Skript gestartet wird (vorher/nachher = zwei Bäume).
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const tag = process.argv[2] || 'shot'
fs.mkdirSync('test/out/shadow', { recursive: true })
for (const tod of ['day', 'gold']) {
  const { browser, page, errs } = await openPage(`#m1,debug,replay,car,tod=${tod}`, { viewport: { width: 640, height: 360 } })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  for (const kind of ['k2b', 'ecctrl']) {
    await page.evaluate(async (kind) => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, x = -6 * K, z = 32 * K
      M.input(null); M2.setKind(kind, { p: [x, (M.terrainH(x, z) ?? 0) + 1 * K, z], yaw: 0.35 }); const t = C.steps + 90; await new Promise((r) => { const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
      M.input({ forward: true }) }, kind)
    for (let i = 0; i < 6; i++) { await page.evaluate(() => new Promise((r) => { const C = window.__kfbM1.clock, t = C.steps + 25; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }))
      await page.screenshot({ path: `test/out/shadow/${tag}_${kind}_${tod}_${i}.png` }) }
    await page.evaluate(() => window.__kfbM1.input(null))
  }
  console.log(tod, JSON.stringify(errs.slice(0, 2)))
  await browser.close()
}
