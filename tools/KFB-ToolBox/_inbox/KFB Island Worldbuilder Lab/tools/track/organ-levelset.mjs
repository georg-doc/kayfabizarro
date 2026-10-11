import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
for (const [id, tier] of [['niere', 'light'], ['herz', 'light'], ['herz', 'hero']]) console.log(JSON.stringify(await p.evaluate(({ id, tier }) => window.__kfb.organ().testLevelSet(id, tier), { id, tier }).catch((e) => ({ id, tier, error: String(e).slice(0, 300) }))));
await b.close();
