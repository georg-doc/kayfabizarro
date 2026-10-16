// L2 Schritt 1 (V-340) · feste Bildreihe A | B: je Bühne Look A (L1 genau) und Look B (warmer Krazy-Kat-Grundton), beide mit Randlicht je Figur,
// bei Tag und Goldener Stunde, 16:9 (Amphitheater zusätzlich 9:16), gleiche Kamera. Bildpaare A | B je Bühne und Stimmung. node scripts/light/l2-series.mjs [out] [filter]
import fs from 'fs'
import { execFileSync } from 'child_process'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/l2'; fs.mkdirSync(OUT, { recursive: true })
const ONLY = process.argv[3] || null
const STAGES = [['amph', '', 'Amphitheater'], ['goblin', ',scene=goblin', 'Goblin-Bank v2'], ['atlantis', ',scene=atlantis', 'Atlantis']]
const MOODS = [['day', 'Tag'], ['gold', 'Goldene Stunde'], ['night', 'Story-Nacht']]
const rows = []
for (const [sid, sh, sname] of STAGES) {
  if (ONLY && ONLY !== sid) continue
  for (const [mid, mname] of MOODS) for (const look of ['a', 'b']) for (const [aid, W, H] of sid === 'amph' ? [['16x9', 1920, 1080], ['9x16', 1080, 1920]] : [['16x9', 1920, 1080]]) {
    const { browser, page, errs } = await openPage(`#stage,debug,actors=fb${sh},light=l1,tod=${mid},look=${look}`, { viewport: { width: W, height: H } })
    await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info() && S.left?.status().shown && S.right?.status().shown !== false && (S.rim?.info?.() || []).length === 2 }, null, { timeout: 420000 })
    await page.waitForTimeout(2500)
    const info = await page.evaluate(() => ({ light: window.__kfbStageLight?.info(), rim: window.__kfbStageMods.rim?.info?.(), sky: (() => { let s = null; window.__kfbStageMods.amph.object3d.traverseAncestors((o) => { if (o.isScene) s = o }); const m = s?.getObjectByName('sky'); return m ? ['#' + m.material.uniforms.top.value.getHexString(), '#' + m.material.uniforms.bottom.value.getHexString()] : null })() }))
    await page.evaluate(() => document.getElementById('kfb-cam-marks')?.style.setProperty('display', 'none'))
    const file = `${OUT}/${sid}_${mid}_${look}_${aid}.png`; fs.writeFileSync(file, await page.screenshot())
    rows.push({ sid, mid, look, aid, file, ...info, errs: errs.length }); console.log(file, JSON.stringify(info).slice(0, 220), 'errs', errs.length); await browser.close()
  }
  for (const [mid, mname] of MOODS) execFileSync('node', ['scripts/amph/palette-pair.mjs', `${OUT}/${sid}_${mid}_a_16x9.png`, `${OUT}/${sid}_${mid}_b_16x9.png`, `${OUT}/paar_${sid}_${mid}.png`,
    `L2 · ${sname} · ${mname} · Look A | Look B`, 'A = L1 (J17) · B = warm mit kühlem Gegenakzent · Randlicht: FB warm, GothGirl violett · Karte unverändert', 'A · L1 (J17)', 'B · warm (Krazy Kat)'])
}
fs.writeFileSync(`${OUT}/series${ONLY ? '-' + ONLY : ''}.json`, JSON.stringify(rows, null, 1))
