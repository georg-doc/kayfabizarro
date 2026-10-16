// L1 (V-329) · feste Bildreihe für Georg (V-253): je Bühne Tag / Goldene Stunde / Nacht an identischer Kamera, 16:9 und 9:16, große Beschriftung im Bild.
// Dazu je Bühne „vorher“ (bisheriges Bühnenlicht) zum Bildpaar. Messwerte je Bild (Licht-Info, Pool, Kontaktschatten, Bildzeit) in series.json.
// node scripts/light/l1-series.mjs [out] [filter: amph|goblin|atlantis]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/l1'; fs.mkdirSync(OUT, { recursive: true })
const ONLY = process.argv[3] || null
const STAGES = [['amph', '', 'Amphitheater (Dialogszene)'], ['goblin', ',scene=goblin', 'Goblin-Bank v2'], ['atlantis', ',scene=atlantis', 'Atlantis']]
const MOODS = [['before', '', 'vorher · bisheriges Bühnenlicht'], ['day', ',light=l1,tod=day', 'L1 · Tag (J17)'], ['gold', ',light=l1,tod=gold', 'L1 · Goldene Stunde (E50)'], ['night', ',light=l1,tod=night', 'L1 · Story-Nacht']]
const ASPECTS = [['16x9', 1920, 1080], ['9x16', 1080, 1920]]
const rows = []
for (const [sid, sh, sname] of STAGES) {
  if (ONLY && ONLY !== sid) continue
  for (const [mid, mh, mname] of MOODS) for (const [aid, W, H] of ASPECTS) {
    if (mid === 'before' && aid === '9x16') continue
    const { browser, page, errs } = await openPage(`#stage,debug,actors=fb${sh}${mh}`, { viewport: { width: W, height: H } })
    await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info() && S.left?.status().shown && S.right?.status().shown !== false }, null, { timeout: 420000 })
    await page.waitForTimeout(2500)
    const info = await page.evaluate(async () => { const S = window.__kfbStageMods, t0 = performance.now(); let n = 0; await new Promise((r) => { const f = () => { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else r() }; requestAnimationFrame(f) })
      return { light: window.__kfbStageLight?.info() || null, pract: S.practicals?.info?.() || null, blobs: S.blobs?.count?.() ?? null, fps: +(n / ((performance.now() - t0) / 1000)).toFixed(1), card: S.billboard.info()?.source } })
    await page.evaluate(() => document.getElementById('kfb-cam-marks')?.style.setProperty('display', 'none'))
    await page.evaluate(({ t, s }) => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:20px 36px;background:rgba(20,16,12,.78);color:#fff;font:600 42px/1.15 system-ui,sans-serif;z-index:99999'
      d.innerHTML = `<div>${t}</div><div style="font:400 26px/1.3 system-ui,sans-serif;opacity:.9;margin-top:6px">${s}</div>`; document.body.appendChild(d) }, { t: `${sname} · ${mname}`, s: aid === '9x16' ? 'Hochformat 9:16' : 'Querformat 16:9' })
    await page.waitForTimeout(200)
    const file = `${OUT}/${sid}_${mid}_${aid}.png`; fs.writeFileSync(file, await page.screenshot())
    rows.push({ sid, mid, aid, file, ...info, errs: errs.length }); console.log(file, JSON.stringify(info), 'errs', errs.length); await browser.close()
  }
}
fs.writeFileSync(`${OUT}/series${ONLY ? '-' + ONLY : ''}.json`, JSON.stringify(rows, null, 1))
