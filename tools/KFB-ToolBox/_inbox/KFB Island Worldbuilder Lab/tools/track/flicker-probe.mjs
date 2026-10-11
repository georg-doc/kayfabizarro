// Flicker probe (Georg live 11.10.: „Flackern, auch im Stand“): the game page with the figure standing still and the camera at rest; N screenshots
// ~150 ms apart; per consecutive pair the mean absolute grey difference and the share of pixels changing by > 16/255 (downsampled 480×300),
// plus the drawing-buffer size (dynamic resolution steps show up there). node tools/track/flicker-probe.mjs <out.json> [query] [n=40]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('../../node_modules/.pnpm/sharp@0.35.5/node_modules/sharp');
const [out, q = '', nArg = '40', dprArg = '2'] = process.argv.slice(2), N = +nArg, DPR = +dprArg;   // Georg's Mac: devicePixelRatio 2 (dynres can step between 1.0 and 1.5 only there)
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: DPR });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&hud=0' + (q ? '&' + q : '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 });
await p.waitForTimeout(6000);   // settle (dynres warm-up, streaming)
const frames = [], sizes = [];
for (let k = 0; k < N; k++) { const png = await p.screenshot({ type: 'png' }); const { data } = await sharp(png).resize(480, 300).greyscale().raw().toBuffer({ resolveWithObject: true }); frames.push(data);
  sizes.push(await p.evaluate(() => { const c = document.querySelector('canvas'); return c ? c.width + 'x' + c.height : null; })); await p.waitForTimeout(150); }
const pairs = []; for (let k = 1; k < N; k++) { const a = frames[k - 1], c = frames[k]; let s = 0, n16 = 0; for (let i = 0; i < a.length; i++) { const d = Math.abs(a[i] - c[i]); s += d; if (d > 16) n16++; } pairs.push({ k, mean: +(s / a.length).toFixed(3), changed: +(100 * n16 / a.length).toFixed(2), size: sizes[k] }); }
const R = { at: new Date().toISOString(), q, N, sizes: [...new Set(sizes)], meanOfMeans: +(pairs.reduce((x, y) => x + y.mean, 0) / pairs.length).toFixed(3), maxChanged: Math.max(...pairs.map((x) => x.changed)), flickerPairs: pairs.filter((x) => x.changed > 0.5).length, pairs };
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify({ q, sizes: R.sizes, meanOfMeans: R.meanOfMeans, maxChanged: R.maxChanged, flickerPairs: R.flickerPairs, series: pairs.map((x) => x.changed) }));
await b.close();
