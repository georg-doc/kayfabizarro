// C1b+C3 · per organ: visible tier, terrain / water / figures / other triangles (scene graph count, not the render stats)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => { const O = window.__kfb.organ(), cnt = (o) => { let t = 0; o.traverse((m) => { if (m.isMesh) { let v = true; for (let x = m; x; x = x.parent) v &&= x.visible; if (v) t += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; } }); return Math.round(t); };
  return O.W.built.map((B) => { const tiers = Object.fromEntries(Object.entries(B.tiers).map(([k, T]) => [k, { vis: T.g.visible, tris: cnt(T.g) }])), figs = B.figs.reduce((a, f) => a + cnt(f.obj), 0); return { id: B.id, total: cnt(B.root), tiers, figs, other: cnt(B.root) - figs - Object.values(tiers).reduce((a, t) => a + (t.vis ? t.tris : 0), 0) }; }); }), null, 1));
await b.close();
