// Renders the speckle comparison (old kfbLayer vs S1) per camera at full size: node tools/render-speckle.mjs (lab dev server on 5192)
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
fs.mkdirSync('docs/feedback/speckle', { recursive: true });
for (const cam of ['overview', 'drive', 'walk']) for (const kind of ['old', 'new']) {
  await p.goto(`http://127.0.0.1:5192/speckle.html?solo=${kind}&cam=${cam}&v=${Date.now()}`);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `docs/feedback/speckle/speckle_${cam}_${kind}.jpg`, type: 'jpeg', quality: 88 });
  console.log('shot', cam, kind);
}
await b.close();
