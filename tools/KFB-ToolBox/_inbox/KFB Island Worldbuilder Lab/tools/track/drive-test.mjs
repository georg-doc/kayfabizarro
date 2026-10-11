// V-125 drive test runner R2 (concept C1b_C3_KONZEPT_R1 (b)): boots the organ world headless and runs src/play/drive-test.ts for each car ×
// {assist 0, assist 0.8, limit run with boost}; then the foot test: the figure WALKS (keys, closed loop on its own heading) from its spawn to
// the car door, enters (Space), exits, and walks a loop of waypoints over the hex tiles; every 50 ms figure height vs the walk surface.
// node tools/track/drive-test.mjs <out.json> [cars comma-separated | -]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, carsArg = 'cars/Cicada/CICADA_LOW.fbx,kaykit:city/car_sedan.gltf'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)); });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(1500);
const R = { at: new Date().toISOString(), runs: [], logs };
const RUNS = (process.env.RUNS ? (r) => r.filter((x) => process.env.RUNS.split(',').includes(x.name)) : (r) => r)([{ name: 'assist0', assist: 0 }, { name: 'assist08', assist: 0.8 }, { name: 'limit_boost', assist: 0, boost: true, aMax: 18 }, { name: 'edge_right', assist: 0.8, edge: true }, { name: 'exit_assist08', assist: 0.8, exit: true }, { name: 'exit_assist0', assist: 0, exit: true }]);   // C4c (env RUNS=a,b selects runs): one lap over the exit, the plaza and the entry
for (const car of carsArg.split(',').filter((c) => c && c !== '-')) for (const run of RUNS) {
  const r = await p.evaluate(async ({ car, run }) => { const m = await import('/src/play/drive-test.ts'), O = window.__kfb.organ(); let sc = O.W.world; while (sc.parent) sc = sc.parent; return m.runDriveTest(sc, O, { car, ...run }); }, { car, run });
  r.run = run.name; R.runs.push(r);
  console.log(car, run.name, JSON.stringify({ routes: r.routeSteps, switches: r.routeSwitches, lap: r.lap, over: r.overStartFinish_m, vMean: r.vMean, under: r.underRoad, stuck: r.stuck.length, hits: r.hitEvents, tunnelling: r.tunnelling, takeoffs: r.takeoffs.length, landings: r.landings.length, landingsOk: r.landingsOk, rescues: r.rescues.length, camT: r.camClipTunnel, camB: r.camClipBody, latG: r.maxLatAccG, steer: r.steerShare, brake: r.brakeShare, ms: r.ms }));
}
// ---- foot test: walk to the door with keys, enter, exit, walk over the hex tiles
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position, sv = t.surfaceAt(f.x, f.z); return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], surf: sv ? sv.y : null, role: sv ? sv.role : null, car: s.car, door: s.doorDistLab }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
const walkTo = async (target, stopDist, maxMs, log) => { const t0 = Date.now(); let x = await st(); await p.keyboard.down('KeyW');
  while (Date.now() - t0 < maxMs) { x = await st(); log.push(x); const dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < stopDist) break;
    const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1);
    if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { await up(cross > 0 ? 'KeyD' : 'KeyA'); await p.keyboard.down(cross > 0 ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); }
    await p.waitForTimeout(50); }
  await up('KeyW'); await up('KeyA'); await up('KeyD'); await p.waitForTimeout(300); return st(); };
await p.mouse.click(320, 200);
const D = { start: await st(), log: [] };
// door target: the point beside the car on the figure's side, 1.2 lab off the car's flank (doorDistLab must fall under R_ENTER)
D.toDoor = await walkTo(await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; }), 1.0, 20000, D.log);
await p.keyboard.press('Space'); D.enter = await (async () => { for (let k = 0; k < 80; k++) { const x = await st(); if (/^AUTO/.test(x.st)) return x; await p.waitForTimeout(100); } return st(); })();
await p.waitForTimeout(1500); await p.keyboard.press('Space'); D.exit = await (async () => { for (let k = 0; k < 80; k++) { const x = await st(); if (/^WALK/.test(x.st)) return x; await p.waitForTimeout(100); } return st(); })();
await p.waitForTimeout(1200);
// hex waypoints: points on hub tiles (surface role hex_*) around the hub centre, 6 directions × 2 radii
const wps = await p.evaluate(() => { const O = window.__kfb.organ(), t = window.__kfb.travel(), c = O.hubCentre, out = []; for (const r of [35, 70]) for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + (r > 50 ? Math.PI / 6 : 0); for (let rr = r; rr > 10; rr -= 5) { const x = c.x + Math.cos(a) * rr, z = c.z + Math.sin(a) * rr, s = t.surfaceAt(x, z); if (s && /^hex/.test(s.role)) { out.push([x, z]); break; } } } return out; });
D.waypoints = wps.length; D.walk = [];
for (const w of wps) D.walk.push(await walkTo(w, 3, 12000, D.log));
const L = D.log.filter((x) => /^WALK/.test(x.st) && x.surf != null);
D.summary = { samples: D.log.length, onSurface: L.length, maxAbove: +Math.max(...L.map((x) => x.fig[1] - x.surf)).toFixed(2), minAbove: +Math.min(...L.map((x) => x.fig[1] - x.surf)).toFixed(2), belowSurface: L.filter((x) => x.fig[1] < x.surf - 0.3).length, airborneOver1H: L.filter((x) => x.fig[1] > x.surf + 3.64).length,
  roles: [...new Set(L.map((x) => x.role))], reachedDoor: D.toDoor.door, entered: D.enter.st, exited: D.exit.st, reached: D.walk.filter((x, k) => Math.hypot(x.fig[0] - wps[k][0], x.fig[2] - wps[k][1]) < 4).length + '/' + wps.length };
delete D.log; R.foot = D; console.log('foot', JSON.stringify(D.summary));
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(logs.slice(0, 5)); await b.close();
