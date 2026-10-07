// Loads a showcase URL in headless Chrome and prints a window expression as JSON (assets-module verification helper).
// node src/modules/assets/tools/probe.mjs "/?showcase=assets&view=gallery" "window.__kfbMaterials"
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const [url, expr] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const logs = [];
page.on('console', (m) => { if (m.type() !== 'debug') logs.push(m.type() + ': ' + m.text().slice(0, 400)); });
for (let i = 0; i < 3; i++) {
  try {
    await page.goto(new URL(url + '&shot=1', 'http://127.0.0.1:5180').toString(), { waitUntil: 'load' });
    await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 120000 });
    console.log(JSON.stringify(await page.evaluate(expr), null, 1));
    break;
  } catch (e) { console.log('retry', String(e).slice(0, 120)); }
}
console.log(logs.filter((l) => /assets|error|warn/i.test(l)).slice(0, 30).join('\n'));
await browser.close();
