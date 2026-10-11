// A10 · AUTO skydome crossfade (LAB addition): dusk stills mid-transition + seam test — mean |Δ| of the frame between phases just
// before / after each key (0.34 · 0.42 · 0.50 · 0.60) against a same-size step inside a segment. node tools/a10/dome-fade.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0&time=auto&circle=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(3500);
// a camera that sees mostly sky (horizon low in frame)
const f = await p.evaluate(() => { const r = window.__kfb.travel().walk.root; return [r.position.x, r.position.y + 5, r.position.z]; });
await p.evaluate((f) => window.__kfb.camOverride(f, [f[0] + 100, f[1] + 18, f[2] + 30]), f);
const at = async (ph) => { await p.evaluate((ph) => { const h = window.__kfb.skyOwner().host; h.dn.setEnabled(false); h.dn.setPhase(ph); }, ph); await p.waitForTimeout(500); return (await p.screenshot({ type: 'png' })).toString('base64'); };
const diff = (a, c) => p.evaluate(async ({ a, c }) => { const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
  const [A, B] = await Promise.all([ld(a), ld(c)]), cv = document.createElement('canvas'); cv.width = A.width; cv.height = A.height; const g = cv.getContext('2d');
  g.drawImage(A, 0, 0); const x = g.getImageData(0, 80, A.width, A.height - 80).data; g.drawImage(B, 0, 0); const y = g.getImageData(0, 80, A.width, A.height - 80).data;
  let s = 0; for (let i = 0; i < x.length; i += 4) s += (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])) / 3; return +(s / (x.length / 4)).toFixed(3); }, { a, c });
const R = { seams: {}, inside: {} }, e = 0.002;
for (const k of [0.34, 0.42, 0.5, 0.6]) R.seams[k] = await diff(await at(k - e), await at(k + e));
for (const k of [0.38, 0.46, 0.55, 0.7]) R.inside[k] = await diff(await at(k - e), await at(k + e));
for (const [n, ph] of [['day', 0.2], ['dusk_day_to_evening', 0.38], ['evening', 0.46], ['dusk_evening_to_night', 0.55], ['night', 0.7]]) {
  await at(ph); R[n] = await p.evaluate(() => window.__kfb.sky().fx.domeFade); await p.screenshot({ path: `${out}/07_auto_${n}.jpg`, type: 'jpeg', quality: 88 });
}
fs.writeFileSync(`${out}/dome-fade.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
await b.close();
