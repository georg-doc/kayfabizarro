// drive stills from the REAL game chase camera (FAHREN, J17 rail chase, V-103): the figure walks to the car door with keys and enters (Space),
// then the driver is put ~40 m before the shot point at 30 m/s and the game runs on its own (no camera override) until the shot.
// node tools/track/chase-stills.mjs <outDir> <suffix> [query]   → drive_curve_<suffix>.jpg, drive_straight_<suffix>.jpg, drive_mag_<suffix>.jpg
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, suf, q = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast', 'hud']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position; return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], car: s.car }; });
const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
const walkTo = async (target, stopDist, maxMs) => { const t0 = Date.now(); await p.keyboard.down('KeyW');
  while (Date.now() - t0 < maxMs) { const x = await st(), dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < stopDist) break;
    const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1);
    if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { await up(cross > 0 ? 'KeyD' : 'KeyA'); await p.keyboard.down(cross > 0 ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); }
    await p.waitForTimeout(50); }
  await up('KeyW'); await up('KeyA'); await up('KeyD'); await p.waitForTimeout(300); };
await p.mouse.click(800, 500);
await walkTo(await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; }), 1.0, 20000);
await p.keyboard.press('Space'); let entered = false; for (let k = 0; k < 80 && !entered; k++) { entered = /^AUTO/.test((await st()).st); await p.waitForTimeout(100); }
if (!entered) { console.log('could not enter the car', JSON.stringify(await st())); await b.close(); process.exit(1); }
await p.waitForTimeout(1500);
const info = await p.evaluate(() => { const O = window.__kfb.organ(), td = O.td, S = td.samples, N = S.length, tun = td.tunnels, inT = (i) => tun.some((t) => i >= t.i0 - 60 && i <= t.i1 + 60);
  let bestC = 0, bc = -1, bestS = 0, bs = 1e9, mag = 0; for (let i = 200; i < N - 200; i += 10) { if (inT(i)) continue; const a = S[i - 20].T, c = S[i + 20].T, U = S[i].U; if (U[1] < 0.97 || Math.abs(a[1]) > 0.08 || Math.abs(c[1]) > 0.08) continue;
    const k = Math.abs(Math.atan2(a[0] * c[2] - a[2] * c[0], a[0] * c[0] + a[2] * c[2])); if (k > bc && (S[i].prm?.surface ?? 1) !== 0) { bc = k; bestC = i; } if (k < bs && S[i].skin !== 'mag' && S[i + 80]?.skin !== 'mag' && Math.hypot(S[i].p[0] * 1.46 - O.hubCentre.x, S[i].p[2] * 1.46 - O.hubCentre.z) > 600) { bs = k; bestS = i; }
    if (!mag && S[i].skin === 'mag' && S[i + 80]?.skin === 'mag' && k < 0.05) mag = i; }
  return { curve: bestC, straight: bestS, mag, ds: td.ds }; });
for (const [name, i] of [['drive_curve', info.curve], ['drive_straight', info.straight], ['drive_mag', info.mag]]) { if (!i) continue;
  await p.evaluate(({ i, ds }) => { const t = window.__kfb.travel(), d = t.drive.driver, S = window.__kfb.organ().td.samples; d.s = S[Math.max(0, i - Math.round(40 / ds))].s; d.lat = 0; d.psi = 0; d.speed = 30; }, { i, ds: info.ds });
  await p.waitForTimeout(1300); await p.screenshot({ path: `${out}/${name}_${suf}.jpg`, type: 'jpeg', quality: 90 }); console.log(`${out}/${name}_${suf}.jpg`); }
await b.close();
