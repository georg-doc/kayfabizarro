// Unterschiedskarte zweier gleich großer PNGs: Abweichung > 25 rot über einem blassen Bild A. node scripts/fb/diffmap.mjs a.png b.png out.png
import fs from 'fs'
import { chromium } from 'playwright'
const [a, bb, out] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage()
const d = await p.evaluate(async ([A, B]) => { const L = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u }); const [x, y] = await Promise.all([L(A), L(B)])
  const c = document.createElement('canvas'); c.width = x.width; c.height = x.height; const g = c.getContext('2d'); g.drawImage(x, 0, 0); const P = g.getImageData(0, 0, c.width, c.height); g.drawImage(y, 0, 0); const Q = g.getImageData(0, 0, c.width, c.height)
  const O = g.createImageData(c.width, c.height); for (let i = 0; i < P.data.length; i += 4) { const dd = Math.abs(P.data[i] - Q.data[i]) + Math.abs(P.data[i + 1] - Q.data[i + 1]) + Math.abs(P.data[i + 2] - Q.data[i + 2]); const l = (P.data[i] + P.data[i + 1] + P.data[i + 2]) / 3
    if (dd > 75) { O.data[i] = 255; O.data[i + 1] = 0; O.data[i + 2] = 0 } else { O.data[i] = O.data[i + 1] = O.data[i + 2] = 200 + l * 0.2 } O.data[i + 3] = 255 }
  g.putImageData(O, 0, 0); return c.toDataURL('image/png') }, ['data:image/png;base64,' + fs.readFileSync(a).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(bb).toString('base64')])
fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await b.close()
