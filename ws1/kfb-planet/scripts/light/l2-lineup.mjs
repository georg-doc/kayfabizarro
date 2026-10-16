// L2 Schritt 3 (V-340) · Aufstellung: alle 14 Fahrzeuge (v3) + FB + GothGirl, Tag / Goldene Stunde / Nacht, gleiche Kamera, 16:9 und 9:16, Look B mit Knet
// (Fahrzeuge Profil vehicle, KayKit Profil figure); dazu Bildpaar ohne | mit Knet bei Tag. Messwerte (Längen in m, Maßstab) in lineup.json.
import fs from 'fs'
import { execFileSync } from 'child_process'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/l2lineup'; fs.mkdirSync(OUT, { recursive: true })
const shots = [['day', 'Tag', ',clay=1'], ['gold', 'Goldene Stunde', ',clay=1'], ['night', 'Story-Nacht', ',clay=1'], ['day', 'Tag', '']]
const rows = []
for (const [mid, mname, clay] of shots) for (const [aid, W, H] of clay ? [['16x9', 1920, 1080], ['9x16', 1080, 1920]] : [['16x9', 1920, 1080]]) {
  if (process.env.SKIP_DONE && fs.existsSync(`${OUT}/lineup_${mid}${clay ? '_clay' : ''}_${aid}.png`)) continue
  const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,lineup=1,light=l1,tod=${mid},look=b${clay}`, { viewport: { width: W, height: H } })
  await page.waitForFunction((c) => { const S = window.__kfbStageMods; return S?.lineup?.status().status === 'OK' && S.left?.status().shown && S.right?.status().shown !== false && (!c || (S.clayV?.info?.() || []).length === 1) }, !!clay, { timeout: 480000 })
  await page.waitForTimeout(2500)
  const info = await page.evaluate(() => ({ st: window.__kfbStageMods.lineup.status(), lens: window.__kfbStageMods.lineup.info(), clayV: window.__kfbStageMods.clayV?.info?.() || null }))
  await page.evaluate(() => document.getElementById('kfb-cam-marks')?.style.setProperty('display', 'none'))
  await page.evaluate(({ t, s }) => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:20px 36px;background:rgba(20,16,12,.78);color:#fff;font:600 40px/1.15 system-ui,sans-serif;z-index:99999'
    d.innerHTML = `<div>${t}</div><div style="font:400 24px/1.3 system-ui,sans-serif;opacity:.9;margin-top:6px">${s}</div>`; document.body.appendChild(d) }, { t: `L2 · Aufstellung 14 Fahrzeuge + FB + GothGirl · ${mname}`, s: (clay ? 'Look B, Knet (Fahrzeuge vehicle, KayKit figure)' : 'Look B, ohne Knet') + ` · Maßstab ${info.st.scale?.toFixed(3)} m/Rig` })
  await page.waitForTimeout(200)
  const file = `${OUT}/lineup_${mid}${clay ? '_clay' : ''}_${aid}.png`; fs.writeFileSync(file, await page.screenshot({ timeout: 180000 })) // 14 Modelle im Software-Renderer: Foto dauert
  rows.push({ mid, clay: !!clay, aid, file, ...info, errs: errs.length }); console.log(file, JSON.stringify(info.st), 'errs', errs.length); await browser.close()
}
fs.writeFileSync(`${OUT}/lineup.json`, JSON.stringify(rows, null, 1))
execFileSync('node', ['scripts/amph/palette-pair.mjs', `${OUT}/lineup_day_16x9.png`, `${OUT}/lineup_day_clay_16x9.png`, `${OUT}/paar_lineup_clay.png`, 'L2 · Fahrzeuge: Meshy-Material | Knet (K1/H0 v8, Profil vehicle)', 'Gleiche Kamera, Tag, Look B · nur Material, Texturen bleiben erkennbar', 'OHNE Knet', 'MIT Knet'])
