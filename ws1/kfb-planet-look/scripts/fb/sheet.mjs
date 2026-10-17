// Bildbogen: node scripts/fb/sheet.mjs <out.png> <kachel-px> "Beschriftung=pfad.png" ... (eine Zeile, gleiche Kachelgröße)
import fs from 'fs'
import { chromium } from 'playwright'
const [out, px, ...items] = process.argv.slice(2), T = +px
const list = items.map((s) => { const i = s.indexOf('='); return [s.slice(0, i), 'data:image/png;base64,' + fs.readFileSync(s.slice(i + 1)).toString('base64')] })
const b = await chromium.launch(); const p = await b.newPage()
const d = await p.evaluate(async ([list, T]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const ims = await Promise.all(list.map((x) => load(x[1])))
  const c = document.createElement('canvas'); c.width = list.length * (T + 8) - 8; c.height = T + 28; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  ims.forEach((im, i) => { const s = Math.min(T / im.width, T / im.height), w = im.width * s, h = im.height * s; g.drawImage(im, i * (T + 8) + (T - w) / 2, 28 + (T - h) / 2, w, h); g.fillStyle = '#000'; g.font = '16px sans-serif'; g.fillText(list[i][0], i * (T + 8) + 4, 19) })
  return c.toDataURL('image/png')
}, [list, T])
fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await b.close()
