// Check 4 (camera calm orbit) of parity.mjs, isolated, with optional main-thread load per frame (spinMs) to find out whether the
// jitter measure depends on the frame rate (pointer stream batching) rather than on the camera. Same harness and formula as parity.mjs.
// node tools/parity/jitter-probe.mjs <game|hub|organ> [spinMs=0] [runs=2] [extra query]
import { chromium } from 'playwright-core';
const [E = 'game', spin = '0', runs = '2', extra = ''] = process.argv.slice(2);
const URLS = { game: 'http://127.0.0.1:5192/?play=game&almanac=0&dynres=0', hub: 'http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0', organ: 'http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0' };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto(URLS[E] + (extra ? '&' + extra : '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 600000 });
await p.waitForTimeout(2500); await p.mouse.click(800, 500);
if (+spin > 0) await p.evaluate((ms) => { window.__kfb.onFrame(() => { const t = performance.now(); while (performance.now() - t < ms); }); }, +spin);
for (let r = 0; r < +runs; r++) {
  await p.waitForTimeout(800);
  await p.evaluate(() => { const L = (window.__cl = []); let t = 0; window.__cu = window.__kfb.onFrame((dt) => { t += dt * 1000; const A = window.__kfb.playCam().state.arm; L.push({ t, rt: performance.now(), fs: window.__kfb.sky?.()?.fogSampleMs?.n ?? 0, c: window.__kfb.camPos(), a: A.used, free: A.hit == null && !A.soft && !A.avoided && A.groundLift < 0.01 }); }); });
  await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' });
  await p.evaluate(() => new Promise((res) => { const t0 = performance.now(); const iv = setInterval(() => { const k = (performance.now() - t0) / 16.7; dispatchEvent(new PointerEvent('pointermove', { clientX: 800 + Math.cos(k * 0.02) * 160, clientY: 500 + Math.sin(k * 0.014) * 60, buttons: 1, bubbles: true })); if (performance.now() - t0 > 6000) { clearInterval(iv); res(); } }, 4); }));
  await p.mouse.up({ button: 'left' });
  const L = await p.evaluate(() => { window.__cu(); return window.__cl; });
  const jit = []; for (let i = 2; i < L.length; i++) { if (!(L[i].free && L[i - 1].free && L[i - 2].free)) continue; const t0 = L[i - 2].t, t1 = L[i - 1].t, t2 = L[i].t, d1 = Math.max(1, t1 - t0), d2 = Math.max(1, t2 - t1);
    const acc = [0, 1, 2].map((k) => (2 * ((L[i].c[k] - L[i - 1].c[k]) / d2 - (L[i - 1].c[k] - L[i - 2].c[k]) / d1)) / (d1 + d2)); jit.push(Math.hypot(...acc) * 16.7 * 16.7); }
  jit.sort((x, y) => x - y); const dts = L.slice(1).map((x, i) => x.t - L[i].t).sort((x, y) => x - y), dtMed = dts[dts.length >> 1], dtP90 = dts[Math.floor(dts.length * 0.9)];
  const rd = L.slice(1).map((x, i) => x.rt - L[i].rt), sm = L.slice(1).map((x, i) => x.fs !== L[i].fs), rs = [...rd].sort((x, y) => x - y), onS = rd.filter((x, i) => sm[i]), offS = rd.filter((x, i) => !sm[i]).sort((x, y) => x - y);
  const big = jit.length ? jit[Math.floor(jit.length * 0.95)] : 0;
  console.log(JSON.stringify({ realMs: { p50: +rs[rs.length >> 1].toFixed(1), p90: +rs[Math.floor(rs.length * 0.9)].toFixed(1), max: +rs.at(-1).toFixed(1), over50: rd.filter((x) => x > 50).length }, sampleFrames: onS.map((x) => +x.toFixed(1)), otherP90: +offS[Math.floor(offS.length * 0.9)].toFixed(1) }));
  console.log(JSON.stringify({ E, extra, spinMs: +spin, run: r, fps: +(1000 / dtMed).toFixed(1), dtP90: +dtP90.toFixed(1), jitterP95: +jit[Math.floor(jit.length * 0.95)].toFixed(4), n: jit.length }));
}
await b.close();
