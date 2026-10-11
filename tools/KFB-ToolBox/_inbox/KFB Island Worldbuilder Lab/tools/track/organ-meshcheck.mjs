// V-112 mesh checks on the running organ world (open / non-manifold edges per organ, tier, body / water)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const r = await p.evaluate(() => window.__kfb.organ().checkMeshes());
if (out) fs.writeFileSync(out, JSON.stringify(r, null, 1));
for (const o of r) for (const [k, t] of Object.entries(o.tiers)) console.log(o.id, k, 'body', JSON.stringify(t.body), 'water', JSON.stringify(t.water));
await b.close();
