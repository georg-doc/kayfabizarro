// V-116 · levelSet bodies: build stats per organ / tier, shape distance to the field isosurface (levelSet vs Surface Nets, in cells),
// topology on the index + position-welded check. node tools/track/organ-ls-probe.mjs <out.json> [lsK]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, lsK] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } }); const logs = []; p.on('pageerror', (e) => logs.push(e.message));
const t0 = Date.now();
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0' + (lsK ? '&lsK=' + lsK : '')); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = { bootMs: Date.now() - t0, ...(await p.evaluate(() => { const O = window.__kfb.organ(); return { buildMs: O.info.buildMs, meshStats: O.meshStats, shape: O.shapeCheck(), checks: O.checkMeshes() }; })), logs };
fs.writeFileSync(out, JSON.stringify(R, null, 1));
console.log('build', R.buildMs, 'ms; levelSet total', R.meshStats.reduce((a, x) => a + x.ms, 0), 'ms');
for (const s of R.shape) for (const [k, t] of Object.entries(s.tiers)) { const c = R.checks.find((x) => x.id === s.id).tiers[k]; console.log(s.id, k, 'cell', t.cell, 'LS→SN', JSON.stringify(t.lsToSn), 'SN→LS', JSON.stringify(t.snToLs), 'tris', t.trisUsed, '/', t.trisSN, '| topo', JSON.stringify(c.bodyTopo), 'weld nm', c.body.nonManifold); }
await b.close();
