// camera calm test (B0): 10 s of RMB/LMB orbit circles around the standing figure on ?play=game, per frame: camera step (lab),
// arm full / used, hit, ground lift. node tools/parity/cam-orbit.mjs [url params] [seconds=10]
import { chromium } from 'playwright-core';
const [extra, secArg] = process.argv.slice(2), SEC = Number(secArg ?? 10);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0' + (extra ? '&' + extra : ''));
await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 });
await p.waitForTimeout(2500);
await p.evaluate(() => { const L = (window.__camlog = []); let last = null; const f = () => { const c = window.__kfb.camPos(), a = window.__kfb.playCam().state.arm; L.push({ t: performance.now(), step: last ? Math.hypot(c[0] - last[0], c[1] - last[1], c[2] - last[2]) : 0, ...a }); last = c; if (window.__camrun) requestAnimationFrame(f); }; window.__camrun = true; requestAnimationFrame(f); });
// orbit: drag in a slow ellipse (yaw ±, pitch ±) like a player
await p.mouse.move(800, 500); await p.mouse.down({ button: process.env.BTN ?? 'left' });
const t0 = Date.now(); let k = 0;
while (Date.now() - t0 < SEC * 1000) { const a = k * 0.05; await p.mouse.move(800 + Math.cos(a) * 260 + k * 0.6, 500 + Math.sin(a * 0.7) * 120); k++; await p.waitForTimeout(16); }
await p.mouse.up({ button: process.env.BTN ?? 'left' });
const L = await p.evaluate(() => { window.__camrun = false; return window.__camlog; });
const steps = L.map((x) => x.step).slice(1).sort((a, b) => a - b), q = (k) => steps[Math.min(steps.length - 1, Math.floor(k * steps.length))];
const used = L.map((x) => x.used), full = L[0]?.full;
let armJumps = 0; for (let i = 1; i < L.length; i++) if (Math.abs(L[i].used - L[i - 1].used) > 0.3) armJumps++;
console.log(JSON.stringify({ frames: L.length, stepMedian: +q(0.5).toFixed(3), stepP95: +q(0.95).toFixed(3), stepMax: +steps[steps.length - 1].toFixed(3), armFull: full, armUsedMin: Math.min(...used), armUsedMax: Math.max(...used), armJumpsOver0_3: armJumps,
  hitFrames: L.filter((x) => x.hit != null).length, floorFrames: L.filter((x) => x.clampedByFloor).length, liftFrames: L.filter((x) => x.groundLift > 0.01).length, liftMax: Math.max(...L.map((x) => x.groundLift)) }));
await b.close();
