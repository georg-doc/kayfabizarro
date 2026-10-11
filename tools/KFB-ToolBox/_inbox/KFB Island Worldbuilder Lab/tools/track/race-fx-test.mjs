// V-128 / V-129 function test (organ track world, sound ON): walk to the car, enter (Space), gas 5 s, boost 3 s, put the car 60 m before
// the first tunnel and drive through, exit; samples __kfb.race() (VFX counts, engine rate / gain, contacts, hall) and __kfb.audio()
// (driving flag, radio list / state). node tools/track/race-fx-test.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 240)); });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&almanac=0&dynres=0&hud=1&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position; return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], car: s.car }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
const walkTo = async (target, stopDist, maxMs) => { const t0 = Date.now(); await p.keyboard.down('KeyW');
  while (Date.now() - t0 < maxMs) { const x = await st(), dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < stopDist) break;
    const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1);
    if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { await up(cross > 0 ? 'KeyD' : 'KeyA'); await p.keyboard.down(cross > 0 ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); }
    await p.waitForTimeout(50); }
  await up('KeyW'); await up('KeyA'); await up('KeyD'); await p.waitForTimeout(300); };
const snap = (tag) => p.evaluate((tag) => { const r = window.__kfb.race(), a = window.__kfb.audio(), d = window.__kfb.travel().drive.driver; return { tag, st: window.__kfb.travel().state().st, speed: +d.speed.toFixed(1), s: +d.s.toFixed(0), fx: r.fx && { roll: r.fx.roll, drift: r.fx.drift, boost: r.fx.boost, scrape: r.fx.scrape, landing: r.fx.landing, alive: r.fx.alive, peak: r.fx.peak, culled: r.fx.culled, emitted: r.fx.emitted, calls: r.fx.calls }, sfx: r.sfx && { rate: r.sfx.engineRate, gain: r.sfx.engineGain, loaded: r.sfx.loaded, hall: r.sfx.hall, impacts: r.sfx.impacts, oneShots: r.sfx.oneShots, jingles: r.sfx.jingles, finish: r.sfx.finish, contacts: r.sfx.contact?.activeContacts, cstate: r.sfx.contact?.contextState ?? r.sfx.contact, samples: r.sfx.contact?.sampleStatus, errors: r.sfx.errors }, audio: a && { ctx: a.context, contexts: a.contexts, driving: a.driving, music: a.music, rms: a.masterRms, errors: a.errors } }; }, tag);
const R = { at: new Date().toISOString(), snaps: [], logs };
await p.mouse.click(640, 360); await p.waitForTimeout(500); R.snaps.push(await snap('walk'));
await walkTo(await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; }), 1.0, 20000);
await p.keyboard.press('Space'); for (let k = 0; k < 80; k++) { if (/^AUTO/.test((await st()).st)) break; await p.waitForTimeout(100); }
await p.waitForTimeout(1500); R.snaps.push(await snap('entered'));
await p.keyboard.down('KeyW'); await p.waitForTimeout(5000); R.snaps.push(await snap('gas5s'));
await p.keyboard.down('ShiftLeft'); await p.waitForTimeout(3000); R.snaps.push(await snap('boost3s')); await up('ShiftLeft');
// steer into the wall briefly (contact + impact)
await p.keyboard.down('KeyD'); await p.waitForTimeout(2500); R.snaps.push(await snap('steerRight')); await up('KeyD');
await p.keyboard.down('KeyA'); await p.waitForTimeout(600); await up('KeyA');
// tunnel: car 60 m before the first tunnel, drive through
await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver, t = O.td.tunnels[0]; d.s = O.td.samples[t.i0].s - 60; d.lat = 0; d.psi = 0; d.speed = 30; });
await p.waitForTimeout(3500); R.snaps.push(await snap('inTunnel'));
await up('KeyW'); await p.keyboard.down('KeyS'); for (let k = 0; k < 120; k++) { const v = await p.evaluate(() => window.__kfb.travel().drive.driver.speed); if (Math.abs(v) < 0.5) break; await p.waitForTimeout(100); } await up('KeyS'); await p.waitForTimeout(600);
R.snaps.push(await snap('stoppedInTunnel')); R.rejectInTunnel = await p.evaluate(() => window.__kfb.travel().state().reject);
await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver; d.s = O.sCar; d.lat = 0; d.psi = 0; d.speed = 0; }); await p.waitForTimeout(1500);
await p.keyboard.press('Space'); for (let k = 0; k < 80; k++) { if (/^WALK/.test((await st()).st)) break; await p.waitForTimeout(100); }
await p.waitForTimeout(3500); R.snaps.push(await snap('exited'));
fs.writeFileSync(out, JSON.stringify(R, null, 1)); for (const s of R.snaps) console.log(JSON.stringify(s)); console.log('logs', JSON.stringify(logs.slice(0, 8))); await b.close();
