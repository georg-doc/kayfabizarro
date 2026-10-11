// V-116 diagnosis: where do levelSet and Surface Nets differ by more than ½ cell (world positions, clusters) + component sizes.
// node tools/track/organ-ls-far.mjs <out.json> [lsK] [organs, e.g. herz,hirn]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, lsK, only] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0' + (lsK ? '&lsK=' + lsK : '')); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = await p.evaluate(() => window.__kfb.organ().shapeCheck().map((s) => ({ id: s.id, tiers: Object.fromEntries(Object.entries(s.tiers).map(([k, t]) => [k, { cell: t.cell, lsToSn: t.lsToSn, snToLs: t.snToLs, farLS: t.farLS, farSN: t.farSN, compLS: t.compLS, compSN: t.compSN }])) })));
const sel = R.filter((s) => !only || only.split(',').includes(s.id));
fs.writeFileSync(out, JSON.stringify(sel, null, 1));
for (const s of sel) for (const [k, t] of Object.entries(s.tiers)) console.log(s.id, k, 'compLS', t.compLS.join('/'), 'compSN', t.compSN.join('/'), '\n farLS', JSON.stringify(t.farLS), '\n farSN', JSON.stringify(t.farSN));
await b.close();
