// V-157 stair foot test on RKIT's trail anchors (Track Core 0.16.7 trailStairs, docs/handoff/rkit_trail_stairs_foottest_v1.json): the organ world
// with ?trailTest=1 builds ramp 6 % · 9 steps (riser 0.444 / tread 0.889) · ramp 3.3 % as walk-surface solids; per gait (walk Ctrl+W, jog W,
// sprint Shift+W) the figure starts 4 lab before the route on its axis and holds the keys; per frame: route position z, height, surface.
// Pass = reaches the top ramp without hopping (no WALK.JUMP) and without getting stuck. node … <out> [trailH=&trailTread=] [gaits] V-159: fps reported, valid only at ≥ 50 fps.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, extra = '', gaitsArg = 'walk,jog,sprint'] = process.argv.slice(2), GAITS = gaitsArg.split(',');
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 960, height: 600 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message));
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&trailTest=1' + (extra ? '&' + extra : '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
await p.mouse.click(480, 300);
const info = await p.evaluate(() => window.__kfb.organ().trailTest); const R = { at: new Date().toISOString(), info, runs: [], logs };
if (!info || info.error) { console.log('no trail test', JSON.stringify(info)); fs.writeFileSync(out, JSON.stringify(R, null, 1)); await b.close(); process.exit(1); }
for (const [name, keys] of [['walk', ['ControlLeft', 'KeyW']], ['jog', ['KeyW']], ['sprint', ['ShiftLeft', 'KeyW']]].filter(([n]) => GAITS.includes(n))) {
  await p.evaluate((I) => { const W = window.__kfb.travel().walk, x = I.origin[0] - I.T[0] * 4, z = I.origin[2] - I.T[2] * 4; W.walker.reset(x, z, W.heightAt(x, z), Math.atan2(I.T[0], I.T[2])); }, info);
  await p.waitForTimeout(600);
  await p.evaluate((I) => { const L = (window.__tl = []); window.__tu = window.__kfb.onFrame((dt) => { const t = window.__kfb.travel(), w = t.walk.walker.state, P = w.position, s = t.state(), sv = t.surfaceAt(P.x, P.z);
    L.push({ dt, z: +((P.x - I.origin[0]) * I.T[0] + (P.z - I.origin[2]) * I.T[2]).toFixed(3), x: +((P.x - I.origin[0]) * I.R[0] + (P.z - I.origin[2]) * I.R[2]).toFixed(3), y: +(P.y - I.y0).toFixed(3), surf: sv ? +(sv.y - I.y0).toFixed(3) : null, role: sv?.role ?? null, st: s.st, clip: s.clip }); }); }, info);
  for (const k of keys) await p.keyboard.down(k);
  const t0 = Date.now(); while (Date.now() - t0 < (name === 'walk' ? 40000 : 14000)) { await p.waitForTimeout(250); const last = await p.evaluate(() => window.__tl[window.__tl.length - 1]); if (last && last.z >= info.topZ) break; }
  for (const k of [...keys].reverse()) await p.keyboard.up(k);
  const L = await p.evaluate(() => { window.__tu(); return window.__tl; }); await p.waitForTimeout(500);
  const t = L.reduce((a, f) => a + f.dt, 0), maxZ = Math.max(...L.map((f) => f.z)), jumps = L.filter((f) => /JUMP/.test(f.st)).length;
  // stuck: the longest time with z advancing < 0.05 lab while the keys were held, before the top was reached
  let stuck = 0, run = 0, zp = L[0]?.z ?? 0; for (const f of L) { if (f.z >= info.topZ - 1) break; if (f.z - zp < 0.002) run += f.dt; else run = 0; stuck = Math.max(stuck, run); zp = f.z; }
  const stepAt = maxZ < info.stairsZ[0] ? 'ramp_in' : maxZ < info.stairsZ[1] ? 'step_' + Math.floor((maxZ - info.stairsZ[0]) / info.tread) : 'ramp_out';
  const below = L.filter((f) => f.surf != null && f.y < f.surf - 0.05).length, above = Math.max(...L.filter((f) => f.surf != null).map((f) => f.y - f.surf));
  R.runs.push({ gait: name, fps: +(L.length / t).toFixed(1), reachedTop: maxZ >= info.topZ - 1, maxZ: +maxZ.toFixed(2), stoppedAt: maxZ >= info.topZ - 1 ? null : stepAt, stuckS: +stuck.toFixed(2), jumpFrames: jumps, belowSurface: below, maxAbove: +above.toFixed(2), clips: [...new Set(L.map((f) => f.clip))], roles: [...new Set(L.map((f) => f.role))], trace: L.filter((_, i) => i % 6 === 0).map((f) => [f.z, f.y, f.surf]) });
  console.log(name, JSON.stringify((({ trace, ...r }) => r)(R.runs.at(-1))));
}
fs.writeFileSync(out, JSON.stringify(R, null, 1)); await b.close();
