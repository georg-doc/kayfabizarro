// C1b+C3 · the new hub default world (?hub=1&play=game): boot offline, organ info, spawn / floor, frame time + triangles in the game view,
// stills. node tools/track/organ-probe.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [], blocked = new Set();
p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && !/GPU stall/.test(m.text()))) logs.push(m.type() + ' ' + m.text().slice(0, 220)); });
await p.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => { blocked.add(r.request().url().slice(0, 120)); return r.abort(); });
const t0 = Date.now();
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0');
await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(4000);
const R = { bootMs: Date.now() - t0 };
R.organ = await p.evaluate(() => window.__kfb.organ().info);
R.travel = await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(); return { st: s.st, fig: s.fig, car: s.car, doorDistLab: s.doorDistLab, spawnFound: t.spawnFound }; });
R.surfaceUnderFig = await p.evaluate(() => { const t = window.__kfb.travel(), f = t.walk.root.position; return t.surfaceAt(f.x, f.z); });
const frames = async () => { await p.evaluate(() => { window.__fl = []; let l = performance.now(); window.__fo = window.__kfb.onFrame(() => { const n = performance.now(); window.__fl.push(n - l); l = n; }); }); await p.waitForTimeout(2500);
  return p.evaluate(() => { window.__fo(); const a = window.__fl.slice(2).sort((x, y) => x - y); const s = window.__kfb.stats(); return { medMs: +a[a.length >> 1].toFixed(1), fps: +(1000 / a[a.length >> 1]).toFixed(1), tris: s.tris, calls: s.calls }; }); };
R.perfStand = await frames();
await p.screenshot({ path: `${out}/01_spawn_game.jpg`, type: 'jpeg', quality: 88 });
R.errors = await p.evaluate(() => window.__kfb.errors); R.logs = logs.slice(0, 20); R.blocked = [...blocked];
fs.writeFileSync(`${out}/organ-probe.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1).slice(0, 4000));
await b.close();
