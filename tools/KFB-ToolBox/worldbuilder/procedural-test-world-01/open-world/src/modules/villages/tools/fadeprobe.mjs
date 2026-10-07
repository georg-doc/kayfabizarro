// Occluder-fade probe: game mode, put the player next to a building (debug spawn), orbit the follow camera with real
// mouse drags so the building comes between camera and player, screenshot.  node fadeprobe.mjs <name> <seed> "<extra query>" x,z[,heading] ...
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
const [name, seed, extra, ...spots] = process.argv.slice(2);
const OUT = 'tools/out/villages/';
const exe = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));
await page.addInitScript(() => { window.__kfbNoPointerLock = true; });
await page.goto(`http://127.0.0.1:5180/?seed=${seed}&shot=1${extra}`);
await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 120000 });
async function drag(dx, dy = 0, ms = 500) { const n = Math.max(4, Math.round(ms / 16)); await page.mouse.move(640, 360); await page.mouse.down(); for (let i = 1; i <= n; i++) { await page.mouse.move(640 + (dx * i) / n, 360 + (dy * i) / n); await page.waitForTimeout(ms / n); } await page.mouse.up(); }
let k = 0;
for (const sp of spots) {
  const [x, z, h] = sp.split(',').map(Number);
  await page.evaluate(([x, z, h]) => { const p = window.__kfb.engine.ctx.services.get('player'); p.spawn(x, window.__kfb.engine.world.heightAt(x, z) + 0.3, z, (h * Math.PI) / 180); }, [x, z, h ?? 0]);
  await page.evaluate(() => window.__kfb.waitIdle(20000));
  await page.waitForTimeout(1200);
  for (const [i, dx] of [[0, 0], [1, 360], [2, 360], [3, 360]]) {
    if (dx) await drag(dx, 0, 600);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}${name}__s${k}_o${i}.jpg`, type: 'jpeg', quality: 85 });
  }
  k++;
}
const st = await page.evaluate(() => window.__kfb.stats());
console.log(JSON.stringify({ errs, fps: st.fps, drawCalls: st.drawCalls, triangles: st.triangles }));
await browser.close();
