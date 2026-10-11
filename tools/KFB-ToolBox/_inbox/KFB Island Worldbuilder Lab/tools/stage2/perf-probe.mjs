// Leistungsprobe (Lückenliste Punkt 4): route hub on foot (jog, sprint) + enter + drive (lane autopilot, boost) + exit + jog,
// WITHOUT video recording. Per frame: rAF time (performance.now), phase; every 0.5 s __kfb.stats() (calls, tris).
// Reports median / p5 fps, longest frame, frame-time spread per phase. node tools/stage2/perf-probe.mjs <out.json> [headful]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [out, headful = '', dsf = '1', extra = ''] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: !headful, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
const dog = setTimeout(async () => { try { await browser.close(); } catch {} process.exit(3); }, 300000); dog.unref();
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(dsf) })).newPage();
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://127.0.0.1:5192/?hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&spawnOff=26' + (extra ? '&' + extra : ''), { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
await page.evaluate(() => { const L = (window.__plog = { f: [], s: [] }); let last = performance.now(), ls = 0;
  const f = (now) => { const t = window.__kfb.travel(), st = t.state(); L.f.push([+(now - last).toFixed(2), st.mode === 'AUTO' && !st.cut ? 'drive' : st.cut ? 'cut' : 'walk']); last = now;
    if (now - ls > 500) { ls = now; L.s.push({ ...window.__kfb.stats(), mode: st.mode }); } if (!window.__stop) requestAnimationFrame(f); }; requestAnimationFrame(f); });
const wait = (ms) => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
const keys = (k) => page.evaluate((k) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; Object.assign(t.keys, k); }, k);
const until = async (fn, arg, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await wait(40); } return false; };
const tap = async () => { await page.evaluate(() => { window.__kfb.travel().keys.jump = true; }); await wait(120); await page.evaluate(() => { window.__kfb.travel().keys.jump = false; }); };
const R = await page.evaluate(() => window.__kfb.travel().gates.R_ENTER_lab);
await keys({ fwd: true }); await wait(3000); await keys({ fwd: true, shift: true });
await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.75, 9000);
await keys({ fwd: true }); await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.6, 2000); await keys({}); await wait(400); await tap();
await until(() => /^AUTO\.(SEATED|PARKED)$/.test(window.__kfb.travel().state().st), null, 5000); await wait(300);
await page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(), d = t.drive.driver, b = t.drive.bounds, t0 = performance.now();
  const f = () => { for (const n of Object.keys(t.keys)) t.keys[n] = false; const want = Math.max(-0.22, Math.min(0.22, 0.12 * d.lat)), e = want - d.psi; if (e > 0.02) t.keys.left = true; else if (e < -0.02) t.keys.right = true;
    if (b.sMax - d.s > (d.speed * d.speed) / 56 + 4) { t.keys.fwd = true; t.keys.shift = true; } else if (d.speed > 0.3) t.keys.back = true; else { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; }
    if (performance.now() - t0 > 15000) { r(); return; } requestAnimationFrame(f); }; f(); }));
await wait(600); await tap(); await until(() => window.__kfb.travel().state().st === 'WALK.GROUND', null, 5000);
await keys({ fwd: true }); await wait(2500); await keys({}); await wait(500);
const L = await page.evaluate(() => { window.__stop = true; return window.__plog; });
const q = (a, p) => { const b = [...a].sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };
const sum = (arr) => { const dt = arr.map((x) => x[0]).filter((x) => x > 0); if (!dt.length) return null; return { frames: dt.length, medianFps: +(1000 / q(dt, 0.5)).toFixed(1), p5Fps: +(1000 / q(dt, 0.95)).toFixed(1), longestMs: +Math.max(...dt).toFixed(1), over33ms: dt.filter((x) => x > 33.4).length, over50ms: dt.filter((x) => x > 50).length, dtP25: q(dt, 0.25), dtP75: q(dt, 0.75) }; };
const all = L.f.slice(5);
const res = { headless: !headful, dsf: Number(dsf), extra, pixelRatio: [...new Set(L.s.map((s) => s.pixelRatio))], shadowMap: L.s[0]?.shadowMap, all: sum(all), walk: sum(all.filter((x) => x[1] === 'walk')), drive: sum(all.filter((x) => x[1] === 'drive')), cut: sum(all.filter((x) => x[1] === 'cut')),
  stats: { callsMax: Math.max(...L.s.map((s) => s.calls)), callsMedian: q(L.s.map((s) => s.calls), 0.5), trisMax: Math.max(...L.s.map((s) => s.tris)), trisMedian: q(L.s.map((s) => s.tris), 0.5), fpsCounter: L.s.map((s) => s.fps) }, errors };
fs.writeFileSync(out, JSON.stringify({ ...res, frameTimes: L.f }, null, 0));
console.log(JSON.stringify(res));
clearTimeout(dog); await browser.close();
