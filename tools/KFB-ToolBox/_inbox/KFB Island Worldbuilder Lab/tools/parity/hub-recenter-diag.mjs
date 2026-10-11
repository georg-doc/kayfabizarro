// Diagnosis for parity check 5 on the hub (recenter after orbit): reproduces the harness steps (start 5 H from the car, facing
// away, LMB orbit ≈ 90°, W 2 s) and logs per frame: dt, walker speed, gait / clip, camera orbit yaw offset, state.
// node tools/parity/hub-recenter-diag.mjs <out.json> [runs]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, runsArg] = process.argv.slice(2), H = 3.64;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const res = [];
for (let run = 0; run < Number(runsArg ?? 2); run++) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 }); await p.waitForTimeout(1500);
  await p.evaluate((H) => { const W = window.__kfb.travel().walk, s = W.walker.state; const x = s.position.x + Math.sin(s.heading + Math.PI) * 5 * H, z = s.position.z + Math.cos(s.heading + Math.PI) * 5 * H; W.walker.reset(x, z, W.heightAt(x, z), s.heading + Math.PI); }, H);
  await p.waitForTimeout(800);
  await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' }); for (let k = 1; k <= 20; k++) { await p.mouse.move(800 - k * 15.7, 500); await p.waitForTimeout(16); } await p.mouse.up({ button: 'left' });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const L = (window.__dlog = []); let last = performance.now(); window.__kfb.onFrame(() => { const now = performance.now(), t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, c = window.__kfb.playCam().state; L.push({ t: +(now).toFixed(1), dt: +(now - last).toFixed(1), v: +w.speed.toFixed(2), gait: s.gait, clip: s.clip, st: s.st, yawOff: +c.orbit.yawOff.toFixed(3), onGround: w.onGround }); last = now; }); });
  const tDown = await p.evaluate(() => performance.now()); await p.keyboard.down('KeyW'); await p.waitForTimeout(2000); await p.keyboard.up('KeyW');
  const L = await p.evaluate(() => window.__dlog);
  const first = L.find((x) => x.t > tDown && x.v > 0.2), long = L.filter((x) => x.t > tDown).sort((a, c) => c.dt - a.dt).slice(0, 5).map((x) => ({ t: +(x.t - tDown).toFixed(0), dt: x.dt, gait: x.gait }));
  const ev = await p.evaluate(() => (window.__kfb.travel().core.events || []).slice(-12).map((e) => ({ t: e.t, type: e.type, st: e.st, clip: e.clip, role: e.role, why: e.why })));
  res.push({ run, moveStartMs: first ? +(first.t - tDown).toFixed(0) : null, frames: L.filter((x) => x.t > tDown).length, longestFrames: long, endYawOffDeg: +(L[L.length - 1].yawOff * 180 / Math.PI).toFixed(1), gaits: [...new Set(L.map((x) => x.gait))], states: [...new Set(L.map((x) => x.st))], events: ev });
  console.log(JSON.stringify(res[res.length - 1]));
  await p.close();
}
fs.writeFileSync(out, JSON.stringify(res, null, 1));
await b.close();
