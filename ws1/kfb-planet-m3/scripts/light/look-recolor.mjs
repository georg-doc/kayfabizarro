// Look-Slice-Probe (Georg 17.10.): Amphitheater unter Mesa-Licht im Original (Umfärbung 18 %, V-286) gegen volle Umfärbung nach Helligkeit mit Rollen
// je Bauteil (palv=b: Türme, Ränge, Sand, Fels) in den drei Joyride-Paletten A Canyon, B Bucht, C O-Town. Totale 16:9, Gold und Tag, ohne Bedien-Elemente.
// node scripts/light/look-recolor.mjs [out]
import fs from 'fs'
import sharp from 'sharp'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/look'; fs.mkdirSync(OUT, { recursive: true })
const shot = async (h) => { const o = await openPage('#stage,debug,actors=fb,light=l1,nobar' + h, { viewport: { width: 1600, height: 900 } })
  await o.page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && (S.clay?.info?.() || []).length >= 1 }, null, { timeout: 480000 })
  await o.page.waitForTimeout(2200); await o.page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#kfb-cam-marks,#kfb-compare,#kfb-preview-badge{display:none!important}'; document.head.appendChild(st) })
  await o.page.waitForTimeout(300); const b = await o.page.screenshot(); await o.browser.close(); return b }
const label = (t, w) => Buffer.from(`<svg width="${w}" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(20,16,12,0.85)"/><text x="20" y="44" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#fff">${t}</text></svg>`)
for (const [tod, name] of [['gold', 'Goldene Stunde'], ['day', 'Tag']]) {
  const V = [['Original · 18 % (V-286)', ''], ['A · Canyon · voll nach Rollen', ',palette=canyon,palv=b,pamt=1'], ['B · Bucht · voll nach Rollen', ',palette=bucht,palv=b,pamt=1'], ['C · O-Town · voll nach Rollen', ',palette=otown,palv=b,pamt=1']]
  const comp = [], cw = 960, ch = 540
  for (const [i, [lab, h]] of V.entries()) { const b = await shot(`,tod=${tod}${h}`); fs.writeFileSync(`${OUT}/recolor_${tod}_${i}.png`, b)
    const x = (i % 2) * cw, y = 90 + Math.floor(i / 2) * (ch + 64); comp.push({ input: label(lab, cw), left: x, top: y }, { input: await sharp(b).resize(cw, ch).png().toBuffer(), left: x, top: y + 64 }) }
  comp.unshift({ input: Buffer.from(`<svg width="1920" height="90" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1c1610"/><text x="24" y="60" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#fff">Look-Probe · Mesa-Licht · ${name} · Umfärbung nach Helligkeit</text></svg>`), left: 0, top: 0 })
  await sharp({ create: { width: 1920, height: 90 + 2 * (ch + 64), channels: 3, background: '#1c1610' } }).composite(comp).png().toFile(`${OUT}/tafel_recolor_${tod}.png`)
}
