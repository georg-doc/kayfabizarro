import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [inp, out, x, y, w, h, s = 4] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage(); const data = 'data:image/jpeg;base64,' + fs.readFileSync(inp).toString('base64');
const url = await p.evaluate(async ({ data, x, y, w, h, s }) => { const i = new Image(); await new Promise((r) => { i.onload = r; i.src = data; }); const c = document.createElement('canvas'); c.width = w * s; c.height = h * s; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(i, x, y, w, h, 0, 0, w * s, h * s); return c.toDataURL('image/png'); }, { data, x: +x, y: +y, w: +w, h: +h, s: +s });
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close();
