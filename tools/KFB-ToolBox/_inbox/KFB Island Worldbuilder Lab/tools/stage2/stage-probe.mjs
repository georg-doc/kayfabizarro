// stage ground probe: heights the walker sees around a point (walls = 60+). node tools/stage2/stage-probe.mjs
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
p.on('response', (r) => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0'); await p.waitForFunction(() => window.__kfb?.play?.(), null, { timeout: 180000 });
console.log(await p.evaluate(() => { const P = window.__kfb.play(), s = P.walker.state.position, st = window.__kfb.stage(); const rows = [];
  for (let dz = -8; dz <= 8; dz += 2) { let r = ''; for (let dx = -8; dx <= 8; dx += 2) { const h = window.__kfb.stageAt(s.x + dx, s.z + dz); r += (h ? (h.wall ? 'W:' : '') + h.role.replace(/^solid:M_/, '').slice(0, 9) + '@' + h.y.toFixed(1) : '--').padEnd(18); } rows.push(r); }
  return JSON.stringify({ pos: s.toArray(), heading: P.walker.state.heading, spawn: st.spawn }) + '\n' + rows.join('\n'); }));
await b.close();
