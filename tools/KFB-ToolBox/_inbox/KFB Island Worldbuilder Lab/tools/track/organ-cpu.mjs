// C1b+C3 · CPU time inside WebGLRenderer.render (submit + culling) and inside the rest of the frame callback, vs frame time
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
for (const url of ['http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0', 'http://127.0.0.1:5192/?play=game&sound=0&almanac=0&dynres=0']) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(url); await p.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
  console.log(url.includes('hub') ? 'organ' : 'game', JSON.stringify(await p.evaluate(async () => { const k = window.__kfb, R = k.renderer(), orig = R.render, rs = [];
    R.render = function (s, c) { const a = performance.now(); orig.call(this, s, c); rs.push(performance.now() - a); };
    const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await new Promise((r) => setTimeout(r, 3000)); off(); R.render = orig;
    const m = (a) => { a.sort((x, y) => x - y); return +a[a.length >> 1].toFixed(1); }; return { frameMs: m(L), renderCallsPerFrame: +(rs.length / L.length).toFixed(2), renderCpuMs: m(rs) }; })));
  await p.close();
}
await b.close();
