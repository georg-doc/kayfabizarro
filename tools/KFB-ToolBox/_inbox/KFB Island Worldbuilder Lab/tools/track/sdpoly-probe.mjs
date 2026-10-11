import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&tunnelField=hirn'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(async () => { const O = window.__kfb.organ(), m = await import('/src/world/tunnel/tunnel-field.ts'); const f = O.fieldTun.get('hirn').hero.ft[0];
  return { n: f.grown.length, first: f.grown.slice(0, 3), last: f.grown.slice(-3), sd: [[0, 3], [0, 10], [0, 11.5], [10, 3], [14, 3], [14.5, 3], [-14, 3], [0, 12.5]].map(([x, y]) => [x, y, +m.sdPoly(f.grown, x, y).toFixed(2)]), mouth: [f.mouthIn, f.mouthOut, f.a, f.b, f.i0, f.i1] }; })));
await b.close();
