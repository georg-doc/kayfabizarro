// V-253 · Abnahme-Bilder für Georg: jede Ansicht ein eigenes großes Querformat-Bild (1920 × 1080), Beschriftung groß im Bild,
// keine Bildbögen. Liste aus einer JSON-Datei: [{ hash, title, sub, out, waitPhase? }]. node scripts/present/shots.mjs <liste.json>
import fs from 'fs'
import path from 'path'
import { openPage } from '../../test/_page.mjs'
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
for (const s of list) {
  const { browser, page, errs } = await openPage(s.hash, { viewport: { width: 1920, height: 1080 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD'
    && (!S.left || S.left.status().shown !== false) && (!S.right || S.right.status().status === 'OK') }, null, { timeout: 300000 })
  if (s.waitPhase) for (let t0 = Date.now(); Date.now() - t0 < 240000;) { const ph = await page.evaluate(() => window.__kfbStageMods?.dialog?.state()?.phase); if (ph === s.waitPhase) break; await page.waitForTimeout(150) }
  await page.waitForTimeout(s.waitPhase ? 700 : 2000)
  // Beschriftung als große Leiste unten (gehört zum Bild, nicht zur Szene)
  await page.evaluate(({ title, sub }) => { const d = document.createElement('div'); d.id = 'kfb-caption'
    d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:22px 40px;background:rgba(20,16,12,.78);color:#fff;font:600 44px/1.15 system-ui,sans-serif;z-index:99999'
    d.innerHTML = `<div>${title}</div>${sub ? `<div style="font:400 28px/1.3 system-ui,sans-serif;opacity:.9;margin-top:6px">${sub}</div>` : ''}`; document.body.appendChild(d) }, { title: s.title, sub: s.sub || '' })
  await page.waitForTimeout(150)
  fs.mkdirSync(path.dirname(s.out), { recursive: true }); fs.writeFileSync(s.out, await page.screenshot())
  console.log(s.out, 'errs', errs.length); await browser.close()
}
