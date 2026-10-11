// quick stage check: ?play=game (demo island stage) loads, spawn on ground, walk a few seconds, still. node tools/stage2/stage-check.mjs <out.jpg> [extra]
import { chromium } from 'playwright-core';
const [out, extra] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const logs = []; p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); }); p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('response', (r) => { if (r.status() >= 400) logs.push(r.status() + ' ' + r.url()); }); const external = new Set(); p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob')) external.add(u.hostname + u.pathname.slice(0, 60)); });
await p.goto('http://127.0.0.1:5192/?play=game' + (extra ? '&' + extra : '')); await p.waitForFunction(() => window.__kfb?.play?.() && window.__kfb.hud?.(), null, { timeout: 180000 });
await p.waitForTimeout(2500);
const pos = () => p.evaluate(() => window.__kfb.play().walker.state.position.toArray().map((v) => +v.toFixed(2)));
const a = await pos();
await p.mouse.click(800, 500);
await p.evaluate(() => { window.__kfb.play().keys.fwd = true; }); await p.waitForTimeout(2500); await p.evaluate(() => { window.__kfb.play().keys.fwd = false; }); await p.waitForTimeout(800);
const c = await pos();
await p.screenshot({ path: out, type: 'jpeg', quality: 90 });
console.log(JSON.stringify({ external: [...external], sky: await p.evaluate(() => window.__kfb.sky?.()), stage: await p.evaluate(() => window.__kfb.stage()), start: a, after: c, audio: await p.evaluate(() => window.__kfb.audio()), errors: await p.evaluate(() => window.__kfb.errors), logs }));
await b.close();
