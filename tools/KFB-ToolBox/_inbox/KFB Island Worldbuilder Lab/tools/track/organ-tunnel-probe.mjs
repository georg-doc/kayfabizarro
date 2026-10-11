// V-112 tunnel join probe: per organ / tier booleans, times, union topology, part triangle counts. node tools/track/organ-tunnel-probe.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)); });
const t0 = Date.now(); await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = { bootMs: Date.now() - t0, ...(await p.evaluate(() => { const O = window.__kfb.organ(); return { buildMs: O.info.buildMs, tunnels: O.tunnelReports, checks: O.checkMeshes() }; })), logs };
fs.writeFileSync(out, JSON.stringify(R, null, 1));
console.log('boot', R.bootMs, 'build', R.buildMs); for (const t of R.tunnels) console.log(JSON.stringify(t)); console.log(logs.slice(0, 5));
await b.close();
