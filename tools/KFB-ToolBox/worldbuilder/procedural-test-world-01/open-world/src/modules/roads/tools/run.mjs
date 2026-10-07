// Screenshot-free real-input runner (disk-light): node src/modules/roads/tools/run.mjs <url> <script.json> [sampleMs]
// Same step semantics as tools/shoot.mjs (wait / down / up / drag / until / camera); "shot" steps only log the player
// state. Samples __kfb.player() every sampleMs while the script runs. Prints JSON {samples, marks, errors}.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [url, scriptPath, every = '300'] = process.argv.slice(2);
const steps = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const ctxB = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctxB.newPage();
await page.addInitScript(() => { window.__kfbNoPointerLock = true; }); // as tools/shoot.mjs: drags orbit the camera
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await page.goto(new URL(url, 'http://127.0.0.1:5180').toString());
await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
await page.evaluate(() => window.__kfb.waitIdle(60000));
const box = { x: 960, y: 540 };
await page.mouse.move(box.x, box.y);
const samples = [], marks = [];
const t0 = Date.now();
let live = true;
(async () => { while (live) { try { const p = await page.evaluate(() => { const e = window.__kfb.engine, c = e.camera.position, pl = window.__kfb.player(); pl.cam = +(c.y - e.ctx.world.heightAt(c.x, c.z)).toFixed(2); pl.ground = +e.ctx.world.heightAt(pl.pos[0], pl.pos[2]).toFixed(3); return pl; }); samples.push({ t: Date.now() - t0, pos: p.pos.map((v) => +v.toFixed(3)), speed: +(+p.speed).toFixed(2), wallStops: p.wallStops, gait: p.gait, footY: p.footY, cam: p.cam, ground: p.ground }); } catch {} await page.waitForTimeout(Number(every)); } })();
for (const s of steps) {
  // setup only (not input): place the player, e.g. {"spawn": [x, z, heading]}
  if (s.spawn) { await page.evaluate(([x, z, h]) => { const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x, window.__kfb.engine.ctx.world.heightAt(x, z) + 0.2, z, h); }, s.spawn); await page.evaluate(() => window.__kfb.waitIdle(30000)); }
  if (s.camera) await page.evaluate((c) => window.__kfb.setCamera(c), s.camera);
  if (s.wait) await page.waitForTimeout(s.wait);
  if (s.down) await page.keyboard.down(s.down);
  if (s.up) await page.keyboard.up(s.up);
  if (s.hold) { await page.keyboard.down(s.hold); await page.waitForTimeout(s.ms ?? 300); await page.keyboard.up(s.hold); }
  if (s.drag) {
    const { dx = 0, dy = 0, ms = 400 } = s.drag, n = Math.max(4, Math.round(ms / 16));
    await page.mouse.move(box.x, box.y); await page.mouse.down();
    for (let i = 1; i <= n; i++) { await page.mouse.move(box.x + (dx * i) / n, box.y + (dy * i) / n); await page.waitForTimeout(ms / n); }
    await page.mouse.up(); await page.mouse.move(box.x, box.y);
  }
  if (s.until) { let ok = 'met'; try { await page.waitForFunction(s.until, null, { timeout: s.timeout ?? 15000, polling: 50 }); } catch { ok = 'timeout'; } marks.push({ t: Date.now() - t0, mark: s.mark ?? 'until', ok }); }
  if (s.shot) marks.push({ t: Date.now() - t0, mark: 'shot:' + s.shot, st: await page.evaluate(() => window.__kfb.player()).then((p) => ({ pos: p.pos.map((v) => +v.toFixed(2)), speed: p.speed, wallStops: p.wallStops })) });
}
live = false;
await page.waitForTimeout(400);
console.log(JSON.stringify({ samples, marks, errs }));
await b.close();
