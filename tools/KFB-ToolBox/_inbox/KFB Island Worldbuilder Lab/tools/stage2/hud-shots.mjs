// Spiel-Oberfläche (5) · acceptance stills + short page video (DOM HUD included, Playwright recordVideo):
// frames: CDP screencast (WebGL + DOM HUD) with timestamps → frames/ + frames.json; tools/stage2/frames2mp4.mjs builds the mp4.
// on foot → sprint to the car → enter → drive (lane autopilot) → stop → backpack open (B) → close → God-Mode (G) → back.
// node tools/stage2/hud-shots.mjs <outDir> [extra url params]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2], extra = process.argv[3] ?? '';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const tCtx = Date.now();
const logs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
const url = 'http://127.0.0.1:5192/?hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4' + (extra ? '&' + extra : '');
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.hud?.(), null, { timeout: 180000 });
const readyS = (Date.now() - tCtx) / 1000;   // the world load before the game is ready (not in the video)
fs.mkdirSync(`${out}/frames`, { recursive: true });
const cdp = await ctx.newCDPSession(page), frames = [];
cdp.on('Page.screencastFrame', async (f) => { const n = frames.length + 1, name = `f_${String(n).padStart(5, '0')}.jpg`; frames.push({ name, t: f.metadata.timestamp }); fs.writeFileSync(`${out}/frames/${name}`, Buffer.from(f.data, 'base64')); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {} });
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1600, maxHeight: 1000, everyNthFrame: 1 });
const wait = (ms) => page.waitForTimeout(ms);
const keys = (k) => page.evaluate((k) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; Object.assign(t.keys, k); }, k);
const until = async (fn, arg, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await wait(40); } return false; };
const tap = async () => { await page.evaluate(() => { window.__kfb.travel().keys.jump = true; }); await wait(120); await page.evaluate(() => { window.__kfb.travel().keys.jump = false; }); };
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 92 }); const s = await page.evaluate(() => ({ hud: window.__kfb.hud(), st: window.__kfb.travel().state().st, kmh: +(Math.abs(window.__kfb.travel().drive.driver.speed) * 3.6).toFixed(1), panelVisible: getComputedStyle(document.getElementById('panel')).display !== 'none' })); report.shots[name] = s; console.log(name, JSON.stringify(s)); };
const report = { url, readyS, shots: {}, checks: {} };
const R = await page.evaluate(() => window.__kfb.travel().gates.R_ENTER_lab);

await wait(3000);
await snap('01_hud_walk');
// jog, sprint to the car, enter
await keys({ fwd: true }); await wait(1500);
await keys({ fwd: true, shift: true });
await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.75, 8000);
await keys({ fwd: true }); await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.6, 2000);
await keys({}); await wait(500); await tap();
await until(() => /^AUTO\.(SEATED|PARKED)$/.test(window.__kfb.travel().state().st), null, 5000); await wait(400);
// drive with the lane autopilot (as video.mjs Probe 6); still at speed
let shotTaken = false;
const driveDone = page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(), d = t.drive.driver, b = t.drive.bounds; const t0 = performance.now();
  const f = () => { for (const n of Object.keys(t.keys)) t.keys[n] = false;
    const want = Math.max(-0.22, Math.min(0.22, 0.12 * d.lat)), e = want - d.psi; if (e > 0.02) t.keys.left = true; else if (e < -0.02) t.keys.right = true;
    const stop = (d.speed * d.speed) / (2 * 28) + 4;
    if (b.sMax - d.s > stop) { t.keys.fwd = true; t.keys.shift = true; } else if (d.speed > 0.3) t.keys.back = true; else { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; }
    if (performance.now() - t0 > 15000) { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; } requestAnimationFrame(f); }; f(); }));
if (await until(() => Math.abs(window.__kfb.travel().drive.driver.speed) > 18, null, 9000)) { await snap('02_hud_drive'); shotTaken = true; }
await driveDone;
if (!shotTaken) await snap('02_hud_drive');
await wait(800);
// backpack: B opens the overlay; previews render through the on-demand second context
await page.keyboard.press('KeyB');
await wait(3500);
await snap('03_hud_bag_open');
report.checks.propContextWhileOpen = await page.evaluate(() => window.__kfb.hud().propContext);
await page.keyboard.press('Escape');
await wait(2600);
report.checks.propContextAfterClose = await page.evaluate(() => window.__kfb.hud().propContext);
report.checks.bagOpenAfterEscape = await page.evaluate(() => window.__kfb.hud().bagOpen);
// God-Mode: G (orbit camera, editor panel), then a small orbit so the view is clearly free
await page.keyboard.press('KeyG');
await wait(600);
await page.mouse.move(1000, 560); await page.mouse.down(); await page.mouse.move(700, 520, { steps: 60 }); await page.mouse.up();
await wait(2500);
await snap('04_god_mode');
await page.keyboard.press('KeyG');
await wait(1500);
await snap('05_back_to_game');
report.checks.errors = await page.evaluate(() => window.__kfb.errors);
report.logs = logs.slice(0, 40);
await cdp.send('Page.stopScreencast');
fs.writeFileSync(`${out}/frames/frames.json`, JSON.stringify(frames));
report.frames = { n: frames.length, seconds: frames.length ? +(frames[frames.length - 1].t - frames[0].t).toFixed(2) : 0 };
await ctx.close();
await browser.close();
fs.writeFileSync(`${out}/hud-shots.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report.checks), 'logs', logs.length);
