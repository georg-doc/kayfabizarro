// world sizes (Unity m) of named objects in a StreakByte demo scene (scale audit for the stage factor). node tools/research/demo-measure.mjs 07 "Bench,Gate,Light,Bridge"
import { chromium } from 'playwright-core';
const [sc, names] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto(`http://127.0.0.1:5192/demo-scenes.html?scene=${sc}`); await p.waitForFunction(() => window.__kfb?.ready, null, { timeout: 120000 });
console.log(JSON.stringify(await p.evaluate((n) => window.__kfb.sizeOf(n), names)));
console.log(JSON.stringify(await p.evaluate(() => window.__kfb.info())));
await b.close();
