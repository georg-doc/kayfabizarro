// C1b+C3 · frame median vs render scale (pixel ratio) in the visible window — the clay shader is fill-bound
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const out = {};
for (const pr of [1, 0.75, 0.6]) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&prCap=${pr}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
  out[pr] = await p.evaluate(async () => { const k = window.__kfb, sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(3000); off(); L.sort((a, b) => a - b); return { medMs: +L[L.length >> 1].toFixed(1), fps: +(1000 / L[L.length >> 1]).toFixed(1), pr: k.stats().pixelRatio }; });
  console.log(pr, JSON.stringify(out[pr])); await p.close();
}
await b.close();
