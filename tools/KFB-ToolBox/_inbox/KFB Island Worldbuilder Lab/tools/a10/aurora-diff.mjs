// A10 · aurora contribution in the game image per elevation: screenshot with the aurora (stark 1) and without (stark 0), mean
// added brightness and share of pixels brightened > 8/255 in the top third of the frame. node tools/a10/aurora-diff.mjs <outDir> -10,-5,0,5,10,20,source
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, list] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0&time=night&circle=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(3500);
const res = {};
for (const e of list.split(',')) {
  await p.evaluate((e) => { const s = window.__kfb.skyOwner(); s.setAuroraElevation(e === 'source' ? null : Number(e)); s.host.aurora.setStark(1); }, e); await p.waitForTimeout(1200);
  const on = (await p.screenshot({ type: 'png' })).toString('base64');
  await p.evaluate(() => window.__kfb.skyOwner().host.aurora.setStark(0)); await p.waitForTimeout(400);
  const off = (await p.screenshot({ type: 'png' })).toString('base64');
  await p.evaluate(() => window.__kfb.skyOwner().host.aurora.setStark(1));
  fs.writeFileSync(`${out}/aurora_on_${e}.png`, Buffer.from(on, 'base64'));
  res[e] = await p.evaluate(async ({ on, off }) => {
    const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [A, B] = await Promise.all([ld(on), ld(off)]), c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const g = c.getContext('2d');
    const H3 = Math.floor(A.height / 3); g.drawImage(A, 0, 0); const a = g.getImageData(0, 80, A.width, H3 - 80).data; g.drawImage(B, 0, 0); const d = g.getImageData(0, 80, A.width, H3 - 80).data;
    let sum = 0, n = 0, lit = 0; for (let i = 0; i < a.length; i += 4) { const x = (a[i] - d[i] + a[i + 1] - d[i + 1] + a[i + 2] - d[i + 2]) / 3; sum += Math.max(0, x); n++; if (x > 8) lit++; }
    return { meanAdded: +(sum / n).toFixed(2), litShare: +(lit / n).toFixed(3) };
  }, { on, off });
  console.log(e, JSON.stringify(res[e]));
}
fs.writeFileSync(`${out}/aurora-diff.json`, JSON.stringify(res, null, 1));
await b.close();
