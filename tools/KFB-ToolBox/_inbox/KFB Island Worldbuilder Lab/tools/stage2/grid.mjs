// image grid (contact sheet) of JPG/PNG files with labels, via headless Chrome. node tools/stage2/grid.mjs <out.jpg> <cols> <img…>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const [out, colsArg, ...imgs] = process.argv.slice(2), cols = Number(colsArg);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
const data = imgs.map((f) => ({ name: path.basename(f).replace(/\.\w+$/, ''), src: 'data:image/' + (f.endsWith('png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(f).toString('base64') }));
const b64 = await p.evaluate(async ({ data, cols }) => {
  const im = await Promise.all(data.map((d) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = d.src; })));
  const W = 800, H = Math.round(W * im[0].height / im[0].width), rows = Math.ceil(im.length / cols);
  const c = document.createElement('canvas'); c.width = W * cols; c.height = H * rows; const g = c.getContext('2d'); g.font = 'bold 22px sans-serif';
  im.forEach((i, k) => { const x = (k % cols) * W, y = Math.floor(k / cols) * H; g.drawImage(i, x, y, W, H); g.fillStyle = '#000b'; g.fillRect(x, y, g.measureText(data[k].name).width + 16, 32); g.fillStyle = '#fff'; g.fillText(data[k].name, x + 8, y + 23); });
  return c.toDataURL('image/jpeg', 0.88).split(',')[1];
}, { data, cols });
fs.writeFileSync(out, Buffer.from(b64, 'base64')); await b.close(); console.log('grid', out);
