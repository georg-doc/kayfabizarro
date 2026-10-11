// V-128 / V-129 acceptance recording (≤ 60 s, 720p, with the game's master mix): walk to the car, enter (radio hands over to the Suno
// RoadTrip list), gas, boost, a barrier touch, CUT (car set 80 m before the first tunnel), through the tunnel (hall), CUT (back to the hub
// straight), stop, exit (radio back), a few steps. Screencast frames go to <framesDir>; then tools/stage2/frames2mp4.mjs builds the mp4.
// node tools/track/drive-recording.mjs <framesDir> <out.json>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [fdir, out] = process.argv.slice(2); fs.mkdirSync(fdir, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } }), p = await ctx.newPage(), logs = []; p.on('pageerror', (e) => logs.push(e.message));
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position; return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], car: s.car }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
const marks = [], mark = async (m) => marks.push({ m, t: Date.now() - T0, race: await p.evaluate(() => { const r = window.__kfb.race(), a = window.__kfb.audio(); return { fx: r.fx?.alive, peak: r.fx?.peak, rate: r.sfx?.engineRate, hall: r.sfx?.hall, impacts: r.sfx?.impacts, one: r.sfx?.oneShots, list: a?.music.list, title: a?.music.title, driving: a?.driving, rms: a?.masterRms }; }) });
await p.mouse.click(640, 360); await p.waitForTimeout(400);
const cdp = await ctx.newCDPSession(p), frames = [];
cdp.on('Page.screencastFrame', async (f) => { const n = frames.length + 1, name = `f_${String(n).padStart(5, '0')}.jpg`; frames.push({ name, t: f.metadata.timestamp }); fs.writeFileSync(`${fdir}/${name}`, Buffer.from(f.data, 'base64')); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {} });
const mime = await p.evaluate(() => window.__kfb.audioOwner().recordStart());
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 });
const T0 = Date.now(); await mark('start');
let tries = 0; for (; tries < 4; tries++) {
  const target = await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; });
  { const t0 = Date.now(); await p.keyboard.down('KeyW'); while (Date.now() - t0 < 15000) { const x = await st(), dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < 1) break; const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1); if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { await up(cross > 0 ? 'KeyD' : 'KeyA'); await p.keyboard.down(cross > 0 ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); } await p.waitForTimeout(50); } await up('KeyW'); await up('KeyA'); await up('KeyD'); }
  await p.waitForTimeout(400); const door = await p.evaluate(() => { const s = window.__kfb.travel().state(); return { door: s.doorDistLab, space: s.space, ok: s.spaceOk, reject: s.reject }; }); marks.push({ m: 'door', t: Date.now() - T0, door });
  await p.keyboard.press('Space'); let ok = false; for (let k = 0; k < 60; k++) { if (/^AUTO/.test((await st()).st)) { ok = true; break; } await p.waitForTimeout(100); } if (ok) break; }
await mark('entered'); await p.waitForTimeout(2500);
await p.keyboard.down('KeyW'); await p.waitForTimeout(7000); await mark('gas');
await p.keyboard.down('ShiftLeft'); await p.waitForTimeout(4000); await up('ShiftLeft'); await mark('boost');
await p.keyboard.down('KeyD'); await p.waitForTimeout(1600); await up('KeyD'); await p.keyboard.down('KeyA'); await p.waitForTimeout(500); await up('KeyA'); await mark('barrier');
await p.waitForTimeout(2000);
await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver, t = O.td.tunnels[0]; d.s = O.td.samples[t.i0].s - 80; d.lat = 0; d.psi = 0; d.speed = 38; }); await mark('cut_tunnel');
await p.waitForTimeout(3000); await mark('tunnel'); await p.waitForTimeout(5000); await mark('tunnel_deep');
await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver; d.s = O.sCar - 60; d.lat = 0; d.psi = 0; d.speed = 20; }); await mark('cut_hub');
await up('KeyW'); await p.keyboard.down('KeyS'); for (let k = 0; k < 80; k++) { const v = await p.evaluate(() => window.__kfb.travel().drive.driver.speed); if (Math.abs(v) < 0.5) break; await p.waitForTimeout(100); } await up('KeyS'); await p.waitForTimeout(800);
await p.keyboard.press('Space'); for (let k = 0; k < 80; k++) { if (/^WALK/.test((await st()).st)) break; await p.waitForTimeout(100); } await mark('exited');
await p.waitForTimeout(1500); await p.keyboard.down('KeyW'); await p.waitForTimeout(3000); await up('KeyW'); await p.waitForTimeout(1500); await mark('end');
await cdp.send('Page.stopScreencast');
const rec = await p.evaluate(() => window.__kfb.audioOwner().recordStop());
if (rec) fs.writeFileSync(`${fdir}/sound_master.${rec.mime.includes('mp4') ? 'm4a' : 'webm'}`, Buffer.from(rec.b64, 'base64'));
fs.writeFileSync(`${fdir}/frames.json`, JSON.stringify(frames));
const R = { at: new Date().toISOString(), mime, frames: frames.length, seconds: (frames.at(-1).t - frames[0].t).toFixed(1), marks, logs };
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify({ frames: R.frames, seconds: R.seconds, mime })); for (const m of marks) console.log(JSON.stringify(m)); await b.close();
