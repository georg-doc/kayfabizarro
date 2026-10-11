// Stufe 2 · Fahren: scripted drive on the hub road from the game camera (stills) + measurements per segment: speed (track
// m/s, lab/s, H/s), lateral position, barrier hits, road end, camera arm. node tools/stage2/drive-probe.mjs <outDir> [road]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir, road = '1'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(`shot=1&hub=1&bg=b0c6d8&play=drive&island=rkit_hub&road=${road}`);
await page.waitForFunction(() => window.__kfb?.drive?.(), null, { timeout: 120000 });
await page.evaluate(() => { const log = (window.__driveLog = []); const tick = () => { const d = window.__kfb.drive(), c = window.__kfb.playCam(); log.push({ ...d.state(), arm: c.state.arm, cam: c.state.mode, hand: c.state.handT }); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
const segs = [];
const seg = async (name, keys, sec) => {
  const a = await page.evaluate(() => window.__driveLog.length);
  await page.evaluate((k) => { const d = window.__kfb.drive(); for (const key of Object.keys(d.keys)) d.keys[key] = false; Object.assign(d.keys, k); }, keys);
  await page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), sec * 1000 - 250);
  await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 88 });
  const b = await page.evaluate(() => window.__driveLog.length);
  segs.push([name, a, b]);
};
// stream overview: island-carried stretches (surface 1) vs. bridge / air pieces, and curvature (rad/m, + = left)
const stream = await page.evaluate(() => { const F = window.__kfb.drive().frame, runs = [], curv = []; let cur = null;
  for (let s = 0; s <= F.L; s += 0.5) { const q = F.at(s), v = q.surface >= 0.5 ? 1 : 0; if (!cur || cur.surface !== v) { cur = { surface: v, s0: s, s1: s }; runs.push(cur); } cur.s1 = s;
    if (s + 2 <= F.L) { const a = F.at(s).T, b = F.at(s + 2).T; curv.push([s, (a[2] * b[0] - a[0] * b[2]) / 2]); } }
  const km = Math.max(...curv.map((c) => Math.abs(c[1]))); return { L: F.L, runs, maxCurv: km, minRadius: 1 / km }; });
if (road === '0') {   // hub_town (Steuerung 10.10.): S-curves, bridge pieces — top speed, cornering, drift, bridge in/out
  // the island carries only ≈ 70 m of it (both ends bridge heads): drift at speed in the middle, then brake, then to the closure
  await seg('01_stand', {}, 1.0);
  await seg('02_gas_boost', { gas: true, boost: true }, 1.8);
  await seg('03_drift', { gas: true, driftL: true, left: true }, 1.0);
  await seg('04_recover', { gas: true }, 0.6);
  await seg('05_brake', { brake: true }, 1.2);
  await seg('06_to_end', { gas: true }, 5);
} else {
  await seg('01_stand', {}, 1.5);
  await seg('02_gas', { gas: true }, 2.2);
  await seg('03_gas_left', { gas: true, left: true }, 1.5);
  await seg('04_gas_right', { gas: true, right: true }, 2.5);
  await seg('05_drift', { gas: true, driftL: true, left: true }, 1.5);
  await seg('06_brake', { brake: true }, 2);
  await seg('07_to_end', { gas: true }, 5);
}
const res = await page.evaluate((segs) => segs.map(([name, a, b]) => { const L = window.__driveLog.slice(a, b), e = L[L.length - 1] || {};
  const vmax = Math.max(...L.map((x) => Math.abs(x.speed))); return { seg: name, n: L.length, vEnd: e.speed, vMax: +vmax.toFixed(2), vMaxLab: +(vmax * 1.46).toFixed(2), vMaxH: +(vmax * 1.46 / 3.64).toFixed(2), latRange: [Math.min(...L.map((x) => x.lat)), Math.max(...L.map((x) => x.lat))].map((v) => +v.toFixed(2)), hits: e.hits, roadEnd: L.some((x) => x.roadEnd), fly: L.some((x) => x.fly), air: L.some((x) => x.air), surf0: L.some((x) => x.surf < 0.5), psiMaxDeg: +(Math.max(...L.map((x) => Math.abs(x.psi))) * 180 / Math.PI).toFixed(1), sRange: [L[0]?.s, e.s], arm: e.arm, cam: e.cam }; }), segs);
fs.writeFileSync(path.join(outDir, 'drive-probe.json'), JSON.stringify({ road, stream, segments: res }, null, 1));
console.log(JSON.stringify(stream));
console.log('bounds', JSON.stringify(await page.evaluate(() => { const d = window.__kfb.drive(); return { bounds: d.bounds, closures: d.closures.error ?? { rolls: d.closures.rolls, pieces: d.closures.pieces } }; })));
for (const r of res) console.log(JSON.stringify(r));
console.log('errors', errors.filter((x) => !x.includes('404')).slice(0, 5));
await close();
