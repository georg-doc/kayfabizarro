// Kontaktbogen der Schatten-Bildfolgen: Zeilen vorher/nachher × Fahrsystem × Tageszeit, Spalten = Bilder 0–5 → test/out/shadow/sheet_<kind>.png
import { chromium } from 'playwright'
import path from 'path'
const before = path.resolve(process.env.BEFORE || '../kfb-planet-m2/test/out/shadow'), after = path.resolve('test/out/shadow'), TAG = process.env.TAG || 'nachher'
for (const kind of ['k2b', 'ecctrl']) {
  const rows = []
  for (const tod of ['day', 'gold']) for (const [tag, dir] of [['vorher', before], [TAG, after]])
    rows.push(`<div class="r"><b>${tag}<br>${tod}</b>${[0, 1, 2, 3, 4, 5].map((i) => `<img src="file://${dir}/${tag}_${kind}_${tod}_${i}.png">`).join('')}</div>`)
  const html = `<html><body style="margin:0;background:#222;color:#eee;font:13px sans-serif"><style>.r{display:flex;align-items:center}.r b{width:70px;text-align:center}img{width:320px;height:180px;margin:2px}</style><div style="padding:4px 8px">${kind}: Fahrt vom Platz in die Hügel, je 25 Schritte</div>${rows.join('')}</body></html>`
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 2020, height: 780 } })
  const f = path.resolve(`test/out/shadow/sheet_${kind}.html`); (await import('fs')).writeFileSync(f, html); await p.goto('file://' + f); await p.waitForTimeout(500); await p.screenshot({ path: `test/out/shadow/sheet_${kind}.png`, fullPage: true }); await b.close()
}
