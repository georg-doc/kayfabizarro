// L3 · Bildpaar „wie gebaut (R2/J17, AgX)“ | „gemütlich (cozy, ACES)“ für Tag und Gold, Totale 16:9, ohne Bedien-Elemente, mit Knet (Georg 17.10.).
// node scripts/light/l3-cozy-pair.mjs [out]
import fs from 'fs'
import { execFileSync } from 'child_process'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/l3'; fs.mkdirSync(OUT, { recursive: true })
const shot = async (h) => { const o = await openPage('#stage,debug,actors=fb,light=l1,nobar' + h, { viewport: { width: 1600, height: 900 } })
  await o.page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && (S.clay?.info?.() || []).length >= 1 }, null, { timeout: 480000 })
  await o.page.waitForTimeout(2200); await o.page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#kfb-cam-marks,#kfb-compare,#kfb-preview-badge{display:none!important}'; document.head.appendChild(st) })
  await o.page.waitForTimeout(300); const b = await o.page.screenshot(); await o.browser.close(); return b }
const B = process.env.B || 'mesa'
for (const [tod, name] of (process.env.TODS ? process.env.TODS.split(',').map((t) => [t, { day: 'Tag', gold: 'Goldene Stunde', night: 'Nacht' }[t]]) : [['day', 'Tag'], ['gold', 'Goldene Stunde'], ['night', 'Nacht']])) {
  const a = `${OUT}/${B}_${tod}_a.png`, b = `${OUT}/${B}_${tod}_b.png`
  fs.writeFileSync(a, await shot(`,tod=${tod},lset=r2,tm=agx`)); fs.writeFileSync(b, await shot(`,tod=${tod},lset=${B},tm=aces`))
  execFileSync('node', ['scripts/amph/palette-pair.mjs', a, b, `${OUT}/paar_${B}_${tod}.png`, `L3 · ${name} · wie gebaut | ${B === 'mesa' ? 'Mesa (Krazy Kat)' : 'gemütlich'}`, B === 'mesa' ? 'Mesa: warme Sonne · violette Schatten · Türkis-Himmel, Pfirsich am Horizont · ACES' : 'Gemütlich: wärmere, schwächere, tiefere Sonne · weniger Füllung · ACES', 'WIE GEBAUT · J17 + AgX', B === 'mesa' ? 'MESA · Krazy Kat + ACES' : 'GEMÜTLICH · cozy + ACES'])
}
