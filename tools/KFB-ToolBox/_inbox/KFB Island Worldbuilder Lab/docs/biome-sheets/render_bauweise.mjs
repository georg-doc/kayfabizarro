// Renders the R2 boards (full page height): node docs/biome-sheets/render_r2.mjs (lab dev server on 5192)
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const b = await chromium.launch({ executablePath: exe, headless: true });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
for (const id of ['bauweise']) {
  await p.goto(`http://127.0.0.1:5192/docs/biome-sheets/${id}.html?v=${Date.now()}`);
  await p.waitForFunction(() => [...document.images].every((i) => i.complete));
  await p.screenshot({ path: `docs/biome-sheets/R2_${id}.jpg`, type: 'jpeg', quality: 88, fullPage: true });
  console.log('shot', id);
}
await b.close();
