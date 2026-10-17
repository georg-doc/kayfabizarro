import fs from 'fs'
import { chromium } from 'playwright'
const [a, bb, out, crop] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage()
const d = await p.evaluate(async ([A, B, crop]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const [x, y] = await Promise.all([load(A), load(B)]); const [cx, cy, cw, ch] = crop ? crop.split(',').map(Number) : [0, 0, x.width, x.height]
  const c = document.createElement('canvas'); c.width = cw * 2 + 10; c.height = ch + 26; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  g.drawImage(x, cx, cy, cw, ch, 0, 26, cw, ch); g.drawImage(y, cx, cy, cw, ch, cw + 10, 26, cw, ch); g.fillStyle = '#000'; g.font = '18px sans-serif'; g.fillText('Studio (Quelle cloudflare-live)', 6, 19); g.fillText('R3F · WS1 F1', cw + 16, 19)
  return c.toDataURL('image/png')
}, ['data:image/png;base64,' + fs.readFileSync(a).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(bb).toString('base64'), crop])
fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await b.close()
