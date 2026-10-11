// Performance-Fix · before/after stills at DPR 2, same fixed camera near the figure (pixel ratio 2 + shadow 4096 vs 1.5 / 1.0 + 2048). node tools/stage2/perf-stills.mjs <outDir>
import { chromium } from 'playwright-core';
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const [name, q] of [['before_pr2_shadow4096', 'prCap=2&shadow=4096&dynres=0'], ['after_pr15_shadow2048', 'prCap=1.5&shadow=2048&dynres=0'], ['after_pr10_dynfloor_shadow2048', 'prCap=1&shadow=2048&dynres=0']]) {
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 })).newPage();
  await page.goto('http://127.0.0.1:5192/?shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&spawnOff=4&' + q, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { const t = window.__kfb.travel(), r = t.walk.root, h = t.walk.walker.state.heading, H = 3.64, a = h + 0.6, c = [r.position.x, r.position.y + 0.45 * H, r.position.z];
    window.__kfb.camOverride([c[0] + Math.sin(a) * 2.6 * H, c[1] + 0.9 * H, c[2] + Math.cos(a) * 2.6 * H], c); });
  await page.waitForTimeout(1200);
  const pr = await page.evaluate(() => window.__kfb.stats().pixelRatio);
  await page.screenshot({ path: `${out}/still_${name}.jpg`, type: 'jpeg', quality: 92 });
  console.log(name, 'pixelRatio', pr); await page.close();
}
await browser.close();
