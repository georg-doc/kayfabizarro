// V-137 click hunt: enter the car, mute music + bed (only the racer sound on the SFX bus), drive a steady straight with gas (no barrier),
// capture the master as raw PCM (audio-owner capturePcm, no codec) and count clicks; then the same with a barrier rub, and idle.
// node tools/track/click-probe.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message));
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&almanac=0&dynres=0&hud=1&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position; return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], car: s.car }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
await p.mouse.click(400, 250);
for (let tries = 0; tries < 4; tries++) { const target = await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; });
  { const t0 = Date.now(); await p.keyboard.down('KeyW'); while (Date.now() - t0 < 12000) { const x = await st(), dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < 1) break; const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1); if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { const a = cross > 0; await up(a ? 'KeyD' : 'KeyA'); await p.keyboard.down(a ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); } await p.waitForTimeout(50); } await up('KeyW'); await up('KeyA'); await up('KeyD'); }
  await p.keyboard.press('Space'); let ok = false; for (let k = 0; k < 50; k++) { if (/^AUTO/.test((await st()).st)) { ok = true; break; } await p.waitForTimeout(100); } if (ok) break; }
await p.waitForTimeout(3000);
const R = { at: new Date().toISOString(), query: q, logs };
if (process.env.LISTEN) {   // V-137 listening file: radio low (music bus 0.25), gas 14 s, one barrier touch, brake, idle 10 s
  await p.evaluate(() => { const a = window.__kfb.audioOwner(); a.debugBus('music', 0.25); });
  await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver; d.s = O.sCar + 300; d.lat = 0; d.psi = 0; d.speed = 10; });
  await p.evaluate(() => window.__kfb.audioOwner().recordStart()); await p.waitForTimeout(2500);
  await p.keyboard.down('KeyW'); await p.waitForTimeout(12000); await p.keyboard.down('KeyD'); await p.waitForTimeout(900); await up('KeyD'); await p.keyboard.down('KeyA'); await p.waitForTimeout(500); await up('KeyA'); await p.waitForTimeout(3000); await up('KeyW');
  await p.keyboard.down('KeyS'); await p.waitForTimeout(3000); await up('KeyS'); await p.waitForTimeout(10000);
  const rec = await p.evaluate(() => window.__kfb.audioOwner().recordStop()); fs.writeFileSync(out, Buffer.from(rec.b64, 'base64')); console.log(out, rec.mime, fs.statSync(out).size); await b.close(); process.exit(0); }
await p.evaluate(() => { const a = window.__kfb.audioOwner(); a.debugBus('music', 0); a.debugBus('bed', 0); });
// straight away from the hub: put the car 300 m on, centred, 30 m/s
await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver; d.s = O.sCar + 300; d.lat = 0; d.psi = 0; d.speed = 30; });
await p.keyboard.down('KeyW'); await p.waitForTimeout(800);
R.gas = await p.evaluate(() => window.__kfb.audioOwner().capturePcm(12));
await p.keyboard.down('KeyD'); await p.waitForTimeout(300);
R.barrier = await p.evaluate(() => window.__kfb.audioOwner().capturePcm(4)); await up('KeyD'); await up('KeyW');
await p.keyboard.down('KeyS'); await p.waitForTimeout(3000); await up('KeyS');
R.idle = await p.evaluate(() => window.__kfb.audioOwner().capturePcm(12));
R.race = await p.evaluate(() => window.__kfb.race().sfx);
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify({ gas: R.gas, barrier: R.barrier, idle: R.idle, engine: R.race && { rate: R.race.engineRate, gain: R.race.engineGain, impacts: R.race.impacts } }).slice(0, 1500)); await b.close();
