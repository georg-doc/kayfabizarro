// V-403 · Sichtprobe Sprenkel-Band am Amphitheater: Totale von oben-schräg (Übergang Bühne → Gelände sichtbar), Laufhöhe, Konsole auf Shader-Fehler.
// node scripts/look/speckle-shot.mjs [out]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/look'; fs.mkdirSync(OUT, { recursive: true })
const { browser, page, errs } = await openPage('#stage,debug,actors=fb,light=l1,nobar', { viewport: { width: 1600, height: 900 } })
const logs = []; page.on('console', (m) => { if (/error|warn/i.test(m.type()) || /shader|glsl|program/i.test(m.text())) logs.push(m.type() + ': ' + m.text().slice(0, 300)) })
await page.waitForFunction(() => window.__kfbStageMods?.amph?.status().status === 'OK', null, { timeout: 480000 }); await page.waitForTimeout(2500)
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#kfb-cam-marks,#kfb-compare,#kfb-preview-badge,#kfb-figure-status{display:none!important}'; document.head.appendChild(st) })
const views = { oben: [[0, 26, 30], [0, 0, 0]], rand: [[13, 3.2, 13], [6, 0, 6]], lauf: [[0, 1.6, 14], [0, 0.8, 4]] }
const info = await page.evaluate(() => window.__kfbStageMods.amph.status().info)
for (const [k, [p, t]] of Object.entries(views)) { await page.evaluate(([p, t]) => { const O = window.__kfbStageOrbit, c = window.__kfbStageCamera; O.setActive?.(true); c.position.set(...p); O.controls.target.set(...t); O.controls.update() }, [p, t]); await page.waitForTimeout(900); fs.writeFileSync(`${OUT}/speckle_${k}.png`, await page.screenshot()) }
console.log(JSON.stringify({ info, errs, logs: logs.slice(0, 8) }).slice(0, 1500)); await browser.close()
