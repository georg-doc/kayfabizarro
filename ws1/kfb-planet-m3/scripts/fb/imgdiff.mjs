// Mittlere Helligkeitsabweichung zweier gleich großer PNGs (0–255): node scripts/fb/imgdiff.mjs a.png b.png [x,y,w,h]
import fs from 'fs'
import { chromium } from 'playwright'
const [a, bb, crop] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage()
const r = await p.evaluate(async ([A, B, crop]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const [x, y] = await Promise.all([load(A), load(B)]); const [cx, cy, cw, ch] = crop ? crop.split(',').map(Number) : [0, 0, x.width, x.height]
  const px = (im) => { const c = document.createElement('canvas'); c.width = cw; c.height = ch; const g = c.getContext('2d'); g.drawImage(im, cx, cy, cw, ch, 0, 0, cw, ch); return g.getImageData(0, 0, cw, ch).data }
  const P = px(x), Q = px(y); let s = 0, n = 0, big = 0
  for (let i = 0; i < P.length; i += 4) { const l1 = 0.299 * P[i] + 0.587 * P[i + 1] + 0.114 * P[i + 2], l2 = 0.299 * Q[i] + 0.587 * Q[i + 1] + 0.114 * Q[i + 2], d = Math.abs(l1 - l2); s += d; n++; if (d > 40) big++ }
  return { mean: +(s / n).toFixed(3), over40: big, px: n }
}, ['data:image/png;base64,' + fs.readFileSync(a).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(bb).toString('base64'), crop])
console.log(JSON.stringify(r)); await b.close()
