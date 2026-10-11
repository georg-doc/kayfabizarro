// Phase C · C1a · J17 original vs Lab page, same camera.
//   orig: the staged donors (donors/joyride-j17-staged = J16 r2 + J17 code), three 0.160 + CDNs from the network, served from disk
//         by Playwright routing (no server, no file changed) — exactly what J17 ran.
//   lab:  the Lab page public/vendor/joyride-j17/…lab.html through the Lab's Vite, three r186, OFFLINE: every non-local request
//         is aborted and logged; the service worker must answer all of them (misses = offline gaps).
// Shots: J17's own chase camera (mode fahren, placeCar(s, v)) at the given s list; identical calls on both pages.
// node tools/track/j17-pair.mjs <outDir> <name:s,name:s,…> [speed]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const LAB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [out, list, speedArg] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const SHOTS = list.split(',').map((x) => { const [n, s] = x.split(':'); return [n, Number(s)]; }), SPEED = Number(speedArg ?? 0);
const STAGED = path.join(LAB, 'donors/joyride-j17-staged'), PAGE = 'KFB Joyride J17 · FB Cabrio';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary', '.css': 'text/css' };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const report = {};
for (const side of ['orig', 'lab']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'allow' }), p = await ctx.newPage(), logs = [], blocked = new Set();
  p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/attribute|\{\{/.test(m.text())) logs.push(m.type() + ' ' + m.text().slice(0, 200)); });
  if (side === 'orig') {
    await ctx.route('http://j17.local/**', async (r) => { const u = decodeURIComponent(new URL(r.request().url()).pathname).slice(1), f = path.join(STAGED, u);
      return fs.existsSync(f) ? r.fulfill({ status: 200, contentType: MIME[path.extname(f)] ?? 'application/octet-stream', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: 'nf' }); });
    await p.goto('http://j17.local/' + encodeURIComponent(PAGE + '.dc.html'));
  } else {
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => { blocked.add(r.request().url().slice(0, 140)); return r.abort(); });
    await p.goto('http://127.0.0.1:5192/vendor/joyride-j17/' + encodeURIComponent(PAGE + '.lab.html'));
  }
  const t0 = Date.now();
  await p.waitForFunction(() => window.__j12?.T?.S?.length, null, { timeout: 300000 }); await p.waitForTimeout(6000);
  const info = await p.evaluate(() => { const a = window.__j12; return { three: (window.__THREE_REV ?? null), L: Math.round(a.T.S[a.T.S.length - 1].s), errors: (a.info?.errors ?? []).slice(0, 10), tunnel: window.__tc1?.info?.look ?? null }; });
  info.rev = await p.evaluate(async () => (await import('three')).REVISION);
  info.bootMs = Date.now() - t0;
  for (const [n, s] of SHOTS) {
    await p.evaluate(({ s, v }) => { const a = window.__j12; a.setMode('fahren'); a.placeCar(s, v, 0); }, { s, v: SPEED }); await p.waitForTimeout(2600);
    const cv = await p.evaluateHandle(() => [...document.querySelectorAll('canvas')].sort((x, y) => y.width * y.height - x.width * x.height)[0]);
    await cv.asElement().screenshot({ path: `${out}/${side}_${n}.jpg`, type: 'jpeg', quality: 88 });
  }
  if (side === 'lab') info.swMisses = await p.evaluate(() => new Promise((res) => { const c = navigator.serviceWorker.controller; if (!c) return res('no controller'); navigator.serviceWorker.addEventListener('message', (e) => res(e.data.misses), { once: true }); c.postMessage('misses'); setTimeout(() => res('timeout'), 3000); }));
  report[side] = { ...info, logs: logs.slice(0, 15), blockedNetwork: [...blocked] };
  console.log(side, JSON.stringify(report[side]).slice(0, 900));
  await ctx.close();
}
// per shot: mean |Δ| (0–255) over the 3D canvas, orig vs lab
{ const p = await b.newPage(); report.diff = {};
  for (const [n] of SHOTS) report.diff[n] = await p.evaluate(async ({ a, c }) => { const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/jpeg;base64,' + s; });
    const [A, B] = await Promise.all([ld(a), ld(c)]), cv = document.createElement('canvas'); cv.width = A.width; cv.height = A.height; const g = cv.getContext('2d');
    g.drawImage(A, 0, 0); const x = g.getImageData(0, 0, A.width, A.height).data; g.drawImage(B, 0, 0); const y = g.getImageData(0, 0, A.width, A.height).data;
    let s = 0, big = 0; for (let i = 0; i < x.length; i += 4) { const d = (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])) / 3; s += d; if (d > 24) big++; }
    return { meanAbs: +(s / (x.length / 4)).toFixed(2), over24: +(big / (x.length / 4)).toFixed(4) }; }, { a: fs.readFileSync(`${out}/orig_${n}.jpg`).toString('base64'), c: fs.readFileSync(`${out}/lab_${n}.jpg`).toString('base64') });
  console.log('diff', JSON.stringify(report.diff)); await p.close(); }
fs.writeFileSync(`${out}/j17-pair.json`, JSON.stringify(report, null, 1));
await b.close();
