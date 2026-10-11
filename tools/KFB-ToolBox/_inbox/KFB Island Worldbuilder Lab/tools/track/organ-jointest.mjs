import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } }); const logs = []; p.on('pageerror', (e) => logs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
for (const id of ['herz', 'hirn', 'darm', 'niere']) for (const tier of ['hero', 'light']) console.log(JSON.stringify(await p.evaluate(({ id, tier }) => window.__kfb.organ().testJoin(id, tier), { id, tier }).catch((e) => ({ id, tier, error: String(e).slice(0, 300) }))));
console.log('logs', logs.slice(0, 5)); await b.close();
