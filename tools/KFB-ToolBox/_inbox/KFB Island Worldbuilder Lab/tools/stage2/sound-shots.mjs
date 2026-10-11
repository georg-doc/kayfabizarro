// Klang (6) · acceptance: stills + screencast frames + the game's master mix (one AudioContext, recorded through the owner),
// then tools/stage2/frames2mp4.mjs lays the sound under the frames. Flow: gesture → on foot (island bed) → car → radio on
// (biome station) → drive → playlist menu → Cozy Tunes → backpack → God-Mode → back. Second page: every island theme entry
// is switched live (bed loads, level > 0).  node tools/stage2/sound-shots.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2];
fs.mkdirSync(`${out}/frames`, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const BASE = 'http://127.0.0.1:5192/?hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4';
const report = { url: BASE, shots: {}, levels: {}, checks: {}, islands: {} };
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.hud?.() && window.__kfb.audio?.(), null, { timeout: 180000 });
const wait = (ms) => page.waitForTimeout(ms);
const A = () => page.evaluate(() => window.__kfb.audio());
const keys = (k) => page.evaluate((k) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; Object.assign(t.keys, k); }, k);
const until = async (fn, arg, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await wait(60); } return false; };
const tap = async () => { await page.evaluate(() => { window.__kfb.travel().keys.jump = true; }); await wait(120); await page.evaluate(() => { window.__kfb.travel().keys.jump = false; }); };
const level = async (tag) => { const v = []; for (let i = 0; i < 8; i++) { v.push((await A()).masterRms); await wait(120); } report.levels[tag] = { rmsMax: Math.max(...v), rmsMean: +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(4) }; };
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 92 }); report.shots[name] = { audio: await A(), hud: await page.evaluate(() => window.__kfb.hud()) }; console.log(name, JSON.stringify(report.shots[name].audio.music), report.shots[name].audio.island, report.shots[name].audio.masterRms); };

// the first user gesture starts the one AudioContext
report.checks.contextBeforeGesture = (await A()).context;
await page.mouse.click(800, 500);
await until(() => window.__kfb.audio().bedLoaded > 0, null, 15000);
report.checks.contextAfterGesture = (await A()).context;
const R = await page.evaluate(() => window.__kfb.travel().gates.R_ENTER_lab);
// screencast + master mix from here
const cdp = await ctx.newCDPSession(page), frames = [];
cdp.on('Page.screencastFrame', async (f) => { const n = frames.length + 1, name = `f_${String(n).padStart(5, '0')}.jpg`; frames.push({ name, t: f.metadata.timestamp }); fs.writeFileSync(`${out}/frames/${name}`, Buffer.from(f.data, 'base64')); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {} });
report.checks.recordMime = await page.evaluate(() => window.__kfb.audioOwner().recordStart());
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1600, maxHeight: 1000, everyNthFrame: 1 });
await wait(2500); await level('walk_bed'); await snap('01_walk_bed');
await keys({ fwd: true }); await wait(1200); await keys({ fwd: true, shift: true });
await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.75, 8000);
await keys({ fwd: true }); await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.6, 2000);
await keys({}); await wait(500); await tap();
await until(() => /^AUTO\.(SEATED|PARKED)$/.test(window.__kfb.travel().state().st), null, 5000); await wait(600);
// radio on (note knob): the biome station starts
await page.locator('[aria-label="Musik an / aus"]').click();
report.checks.stationReady = await until(() => { const m = window.__kfb.audio().music; return m.state === 'bereit' && m.time > 0.5; }, null, 20000);
await level('car_station');
const driveDone = page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(), d = t.drive.driver, b = t.drive.bounds; const t0 = performance.now();
  const f = () => { for (const n of Object.keys(t.keys)) t.keys[n] = false;
    const want = Math.max(-0.22, Math.min(0.22, 0.12 * d.lat)), e = want - d.psi; if (e > 0.02) t.keys.left = true; else if (e < -0.02) t.keys.right = true;
    const stop = (d.speed * d.speed) / (2 * 28) + 4;
    if (b.sMax - d.s > stop) { t.keys.fwd = true; t.keys.shift = true; } else if (d.speed > 0.3) t.keys.back = true; else { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; }
    if (performance.now() - t0 > 15000) { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; } requestAnimationFrame(f); }; f(); }));
if (await until(() => Math.abs(window.__kfb.travel().drive.driver.speed) > 18, null, 9000)) await snap('02_drive_radio_station');
await driveDone; if (!report.shots['02_drive_radio_station']) await snap('02_drive_radio_station');
await wait(800);
// playlist menu → Cozy Tunes
await page.locator('[aria-label="Playlist wählen"]').click(); await wait(700);
await snap('03_radio_menu_cozy');
await page.locator('[data-kfb-hud] button', { hasText: 'Cozy Tunes' }).first().click();
report.checks.cozyReady = await until(() => { const m = window.__kfb.audio().music; return m.list === 'cozy' && m.state === 'bereit' && m.time > 0.5; }, null, 25000);
await wait(1500); await level('car_cozy'); await snap('04_radio_cozy_playing');
// backpack + God-Mode (music keeps playing)
await page.keyboard.press('KeyB'); await wait(2500); await snap('05_bag_open'); await page.keyboard.press('Escape'); await wait(800);
await page.keyboard.press('KeyG'); await wait(600);
await page.mouse.move(1000, 560); await page.mouse.down(); await page.mouse.move(760, 520, { steps: 50 }); await page.mouse.up(); await wait(1500);
await snap('06_god_mode'); await page.keyboard.press('KeyG'); await wait(1500);
await cdp.send('Page.stopScreencast');
const rec = await page.evaluate(() => window.__kfb.audioOwner().recordStop());
if (rec) fs.writeFileSync(`${out}/sound_master.${rec.mime.includes('mp4') ? 'm4a' : 'webm'}`, Buffer.from(rec.b64, 'base64'));
fs.writeFileSync(`${out}/frames/frames.json`, JSON.stringify(frames));
report.frames = { n: frames.length, seconds: frames.length ? +(frames[frames.length - 1].t - frames[0].t).toFixed(2) : 0 };
report.checks.final = await A();
report.checks.errors = await page.evaluate(() => window.__kfb.errors);
await ctx.close();

// every island theme entry, switched live on the hub (?soundIsland pins the bed; setIsland swaps it)
const ctx2 = await browser.newContext({ viewport: { width: 800, height: 500 } }), p2 = await ctx2.newPage();
await p2.goto(BASE + '&soundIsland=rkit_hub', { waitUntil: 'load' });
await p2.waitForFunction(() => window.__kfb?.audio?.(), null, { timeout: 180000 });
await p2.mouse.click(400, 250);
const ids = await p2.evaluate(() => fetch('/themes/island-themes.json').then((r) => r.json()).then((t) => Object.keys(t.islands)));
for (const id of ids) {
  await p2.evaluate((id) => window.__kfb.audioOwner().setIsland(id), id);
  const t0 = Date.now(); let st; do { await p2.waitForTimeout(250); st = await p2.evaluate(() => window.__kfb.audio()); } while ((st.island !== id || st.bedLoaded < st.bed.length) && Date.now() - t0 < 12000);
  await p2.waitForTimeout(2600); st = await p2.evaluate(() => window.__kfb.audio());
  report.islands[id] = { biome: st.biome, bed: st.bed, bedLoaded: st.bedLoaded, rms: st.masterRms, station: null };
}
report.islandErrors = (await p2.evaluate(() => window.__kfb.audio())).errors;
await ctx2.close();
report.logs = logs.slice(0, 40);
await browser.close();
fs.writeFileSync(`${out}/sound-shots.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ checks: { ...report.checks, final: undefined }, levels: report.levels, islands: report.islands, frames: report.frames }, null, 0));
