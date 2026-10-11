// Reference renders from the donor (Claude Design Island Kit R2 · R2D v0 + Scholle Bench v7), served locally on :5196.
// Protocol §2 refs/: the critic judges G2/G6 against the real donor, not against a description.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const dog = setTimeout(async () => { console.error('watchdog'); await browser.close(); process.exit(3); }, 420000);
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
const hideUI = () => page.evaluate(() => { const cv = document.querySelector('canvas'); for (const el of document.body.querySelectorAll('*')) if (el !== cv && !el.contains(cv)) el.style.visibility = 'hidden'; if (cv) { cv.style.visibility = 'visible'; } });
const shot = async (name) => { await hideUI(); await page.evaluate(() => new Promise((r) => setTimeout(r, 1200))); await page.screenshot({ path: path.join(OUT, name), type: 'jpeg', quality: 92 }); console.log('ref', name); };
// R2D v0 island: biome burg (seed 3) and protopia (seed 11)
await page.goto('http://127.0.0.1:5196/' + encodeURIComponent('KFB World Core R2D v0 Insel.dc.html'), { waitUntil: 'load' });
await page.waitForFunction(() => window.__r2d && window.__r2d.info && window.__r2d.info.loadMs, null, { timeout: 240000 });
for (const [seed, biome] of [[3, 'burg'], [11, 'protopia']]) {
  await page.evaluate(([s, b]) => window.__r2d.build(s, b), [seed, biome]);
  for (const v of ['mittel', 'seite', 'unten']) { await page.evaluate((v) => window.__r2d.setView(v), v); await shot(`ref_r2d_v0_${biome}_${v}.jpg`); }
}
// Scholle bench v7: the 8 benchmark presets side by side, then preset D (Food Point) and I (Hütte) large
await page.goto('http://127.0.0.1:5196/' + encodeURIComponent('KFB Scholle Bench v7.dc.html'), { waitUntil: 'load' });
await page.waitForFunction(() => window.__scholle, null, { timeout: 240000 });
await shot('ref_scholle_v7_bench_alle.jpg');
for (const [i, n] of [[1, 'D_foodpoint'], [0, 'I_huette']]) { await page.evaluate((i) => window.__scholle.setFocus(i), i); await shot(`ref_scholle_v7_${n}.jpg`); }
console.log('errors', errs.slice(0, 5));
clearTimeout(dog); await browser.close();
