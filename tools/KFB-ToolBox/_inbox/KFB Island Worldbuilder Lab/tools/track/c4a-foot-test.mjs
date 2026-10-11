// C4a foot test: the figure walks (keys) from its spawn to the car door, enters, exits, then crosses the B7 bay (asphalt bay → kerb →
// platform → foot) onto the hex tiles on the bay side and visits 6 tile points; every 50 ms: figure height vs the walk surface, role.
// node tools/track/c4a-foot-test.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2), FLIP = process.env.FLIP === '1';   // A/D sense of the steering (checked per run)
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message));
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(1500);
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position, sv = t.surfaceAt(f.x, f.z); return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], surf: sv ? sv.y : null, role: sv ? sv.role : null, car: s.car, door: s.doorDistLab }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
const walkTo = async (target, stopDist, maxMs, log) => { const t0 = Date.now(); let x = await st(); await p.keyboard.down('KeyW');
  while (Date.now() - t0 < maxMs) { x = await st(); log.push(x); const dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < stopDist) break;
    const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1);
    if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { const turnA = (cross > 0) !== FLIP; await up(turnA ? 'KeyD' : 'KeyA'); await p.keyboard.down(turnA ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); }
    await p.waitForTimeout(50); }
  await up('KeyW'); await up('KeyA'); await up('KeyD'); await p.waitForTimeout(250); return st(); };
await p.mouse.click(320, 200);
// V-159: foot / drive tests count only at ≥ 50 fps (low fps = large walker steps that jump thin walls / holes): game-loop fps over the whole run
await p.evaluate(() => { const F = (window.__fps = { n: 0, t: 0 }); window.__fpsOff = window.__kfb.onFrame((dt) => { F.n++; F.t += dt; }); });
const D = { start: await st(), log: [] };
D.toDoor = await walkTo(await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; }), 1.0, 20000, D.log);
if (process.env.DEBUG) { const L2 = D.log.slice(-12).map((x) => [x.fig.map((v) => +v.toFixed(1)), x.surf && +x.surf.toFixed(2), x.role]); console.log('toDoor', JSON.stringify(D.start.fig.map((v) => +v.toFixed(1))), JSON.stringify(L2)); }
await p.keyboard.press('Space'); D.enter = await (async () => { for (let k = 0; k < 80; k++) { const x = await st(); if (/^AUTO/.test(x.st)) return x; await p.waitForTimeout(100); } return st(); })();
await p.waitForTimeout(1500); await p.keyboard.press('Space'); D.exit = await (async () => { for (let k = 0; k < 80; k++) { const x = await st(); if (/^WALK/.test(x.st)) return x; await p.waitForTimeout(100); } return st(); })();
await p.waitForTimeout(1200);
// route in the track frame at the car (metres; bay on the right, +R): bay platform, below the foot, then 6 tile points
const route = await p.evaluate(() => { const O = window.__kfb.organ(), t = window.__kfb.travel(), S = O.td.samples, ds = O.td.ds, at = (x) => S[Math.round((O.sCar + x) / ds)], half = 7.2;
  const P = (x, lat) => { const q = at(x); return [(q.p[0] + q.R[0] * lat) * 1.46, (q.p[2] + q.R[2] * lat) * 1.46]; };
  const pts = [{ k: 'platform', p: P(7, half + 2.05 + 0.2 + 2.2) }, { k: 'below_foot', p: P(0, half + 9) }];
  for (const [x, lat] of [[-12, 14], [0, 18], [12, 14], [-20, 24], [0, 30], [20, 24]]) { const pp = P(x, half + lat), s = t.surfaceAt(pp[0], pp[1]); pts.push({ k: 'hex', p: pp, role: s?.role ?? null }); }
  return pts; });
D.route = route; D.walk = [];
const loc = (x) => p.evaluate((f) => { const O = window.__kfb.organ(), S = O.td.samples, q = S[Math.round(O.sCar / O.td.ds)], dx = f[0] / 1.46 - q.p[0], dz = f[2] / 1.46 - q.p[2]; return { along: +(dx * q.T[0] + dz * q.T[2]).toFixed(1), lat: +(dx * q.R[0] + dz * q.R[2]).toFixed(1) }; }, x.fig);
D.exitLoc = await loc(D.exit);
// leave the car first: 7 m along the road from the exit point (the car is a collider), then across
{ const e = D.exit, pp = await p.evaluate((f) => { const O = window.__kfb.organ(), S = O.td.samples, q = S[Math.round(O.sCar / O.td.ds)]; return [f[0] + q.T[0] * 7 * 1.46, f[2] + q.T[2] * 7 * 1.46]; }, e.fig); const x = await walkTo(pp, 1.5, 8000, D.log); D.clearCar = await loc(x); }
for (const r of route) { const x = await walkTo(r.p, 2.5, 14000, D.log); D.walk.push({ k: r.k, reached: Math.hypot(x.fig[0] - r.p[0], x.fig[2] - r.p[1]) < 3, role: x.role, at: await loc(x) }); }
const L = D.log.filter((x) => /^WALK/.test(x.st) && x.surf != null);
D.summary = { samples: D.log.length, onSurface: L.length, maxAbove: +Math.max(...L.map((x) => x.fig[1] - x.surf)).toFixed(2), minAbove: +Math.min(...L.map((x) => x.fig[1] - x.surf)).toFixed(2), belowSurface: L.filter((x) => x.fig[1] < x.surf - 0.3).length, airborneOver1H: L.filter((x) => x.fig[1] > x.surf + 3.64).length,
  roles: [...new Set(L.map((x) => x.role))], reachedDoor: D.toDoor.door, entered: D.enter.st, exited: D.exit.st, hexReached: D.walk.filter((w) => w.k === 'hex' && w.reached).length + '/6', bay: D.walk.slice(0, 2), exitLoc: D.exitLoc, clearCar: D.clearCar, legs: D.walk.map((w) => w.at) };
{ const F = await p.evaluate(() => { window.__fpsOff(); return window.__fps; }); D.summary.fps = +(F.n / Math.max(1e-6, F.t)).toFixed(1); D.summary.fpsOk = D.summary.fps >= 50; }
delete D.log; fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), ...D, logs }, null, 1)); console.log(JSON.stringify(D.summary)); await b.close();
