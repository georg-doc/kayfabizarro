// V-128 cost (V-115 stays the limit): frame time WHILE DRIVING in a visible window (1600×1000), variants one after the other:
// base (?fx=0&racesfx=0) · vfx (?racesfx=0) · sfx (?fx=0) · both. Each: walk to the car, enter, put the car on the same straight at
// 30 m/s, gas 2 s, then gas + boost 5 s measured (frame ms median / p90, draw calls, triangles).
// node tools/track/race-cost.mjs <out.json> [rounds=2]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, rounds = '2'] = process.argv.slice(2);
const VAR = { base: 'fx=0&racesfx=0', vfx: 'racesfx=0', sfx: 'fx=0', both: '' };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000', '--autoplay-policy=no-user-gesture-required'] });
const R = { at: new Date().toISOString(), runs: [] };
for (let r = 0; r < +rounds; r++) for (const [name, qq] of Object.entries(r % 2 ? Object.entries(VAR).reverse().reduce((o, [k, v]) => ((o[k] = v), o), {}) : VAR)) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('http://127.0.0.1:5192/?hub=1&play=game&almanac=0&dynres=0&' + qq); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, f = t.walk.root.position; return { st: s.st, fig: [f.x, f.y, f.z], fwd: [w.forward?.x ?? Math.sin(w.heading), w.forward?.z ?? Math.cos(w.heading)], car: s.car }; });
  const up = async (k) => { try { await p.keyboard.up(k); } catch {} };
  await p.mouse.click(800, 500);
  const target = await p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), f = t.walk.root.position, c = s.car, dx = f.x - c[0], dz = f.z - c[2], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * 3.2, c[2] + dz / l * 3.2]; });
  { const t0 = Date.now(); await p.keyboard.down('KeyW'); while (Date.now() - t0 < 20000) { const x = await st(), dx = target[0] - x.fig[0], dz = target[1] - x.fig[2], dist = Math.hypot(dx, dz); if (dist < 1) break; const cross = x.fwd[0] * dz - x.fwd[1] * dx, dot = (x.fwd[0] * dx + x.fwd[1] * dz) / (dist || 1); if (Math.abs(cross / (dist || 1)) > 0.12 || dot < 0) { await up(cross > 0 ? 'KeyD' : 'KeyA'); await p.keyboard.down(cross > 0 ? 'KeyA' : 'KeyD'); } else { await up('KeyA'); await up('KeyD'); } await p.waitForTimeout(50); } await up('KeyW'); await up('KeyA'); await up('KeyD'); await p.waitForTimeout(300); }
  await p.keyboard.press('Space'); for (let k = 0; k < 80; k++) { if (/^AUTO/.test((await st()).st)) break; await p.waitForTimeout(100); }
  await p.waitForTimeout(1200);
  await p.evaluate(() => { const O = window.__kfb.organ(), d = window.__kfb.travel().drive.driver; d.s = O.sCar + 150; d.lat = 0; d.psi = 0; d.speed = 30; });
  await p.keyboard.down('KeyW'); await p.waitForTimeout(2000); await p.keyboard.down('ShiftLeft');
  await p.evaluate(() => { window.__fl = []; let last = performance.now(); window.__fo = window.__kfb.onFrame(() => { const n = performance.now(); window.__fl.push(n - last); last = n; }); });
  await p.waitForTimeout(5000);
  const m = await p.evaluate(() => { window.__fo(); const a = window.__fl.slice(2).sort((x, y) => x - y), med = a[Math.floor(a.length / 2)], st = window.__kfb.stats(), r = window.__kfb.race(); return { frames: a.length, medMs: +med.toFixed(1), fpsMed: +(1000 / med).toFixed(1), p90Ms: +a[Math.floor(a.length * 0.9)].toFixed(1), calls: st.calls, tris: st.tris, fxAlive: r.fx?.alive ?? null, fxPeak: r.fx?.peak ?? null, engine: r.sfx?.engineRate ?? null, mode: window.__kfb.travel().state().st }; });
  await up('ShiftLeft'); await up('KeyW');
  R.runs.push({ round: r, name, ...m }); console.log(r, name, JSON.stringify(m)); await p.close();
}
const agg = {}; for (const x of R.runs) (agg[x.name] ??= []).push(x.medMs); R.medianOfMedians = Object.fromEntries(Object.entries(agg).map(([k, v]) => [k, v.sort((a, b) => a - b)[Math.floor(v.length / 2)]]));
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R.medianOfMedians)); await b.close();
