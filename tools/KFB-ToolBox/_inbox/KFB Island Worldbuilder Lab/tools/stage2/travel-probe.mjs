// Stufe 2 · Ein- und Aussteigen: scripted loop on the hub road from the game camera (stills) + per-frame log: state, figure
// yaw during the cuts (Dreh-Fehler proof: total turn), camera step per frame (hand-over without a jump), gates.
// node tools/stage2/travel-probe.mjs <outDir> [road] [island]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir, road = '1', island = 'rkit_hub', seat = 'none', car = ''] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(`shot=1&rkit=1&hub=1&bg=b0c6d8&play=travel&island=${island}&road=${road}&seat=${seat}${car ? '&car=' + car : ''}`);
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
const info = await page.evaluate(async () => { const t = window.__kfb.travel(); return { surface: t.surface, gates: t.gates, spawnFound: t.spawnFound, seat: (await t.seatInfo()).seat, carSize: t.drive.car.userData.size }; });
await page.evaluate(() => { const log = (window.__tlog = []); let lp = null; const tick = () => { const t = window.__kfb.travel(), c = window.__kfb.playCam();
  const s = t.state(), cp = window.__kfb.camPos(); log.push({ ...s, camMode: c.state.mode, handT: c.state.handT, cam: cp, camYaw: window.__kfb.camYaw(), tms: performance.now() }); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
const keys = (k) => page.evaluate((k) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; Object.assign(t.keys, k); }, k);
const wait = (ms) => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
const st = () => page.evaluate(() => window.__kfb.travel().state());
const until = async (fn, arg, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await wait(50); } return false; };
const shot = (n) => page.screenshot({ path: path.join(outDir, n + '.jpg'), type: 'jpeg', quality: 88 });
const tap = async () => { await page.evaluate(() => { window.__kfb.travel().keys.jump = true; }); await wait(120); await page.evaluate(() => { window.__kfb.travel().keys.jump = false; }); };
// phase-triggered stills (Kritiker 2): wait in the page for the hop phase (+ an offset into it), then shoot
const atPhase = (ph, ms = 0) => page.evaluate(([ph, ms]) => new Promise((r) => { const t0 = performance.now(); const f = () => { const h = window.__kfb.travel().carHop; if (h && h.phase === ph) { if (ms) setTimeout(r, ms); else r(); } else if (performance.now() - t0 > 8000) r(); else requestAnimationFrame(f); }; f(); }), [ph, ms]);
const marks = [];
const mark = async (name) => marks.push([name, await page.evaluate(() => window.__tlog.length)]);

await mark('01_spawn'); await wait(1500); await shot('01_spawn');
await mark('02_walk_to_car'); await keys({ fwd: true });
const reached = await until((r) => window.__kfb.travel().state().doorDistLab < r, info.gates.R_ENTER_lab * 0.7, 12000);
await keys({}); await wait(600); await shot('02_at_car');
const isCab = await page.evaluate(() => !!window.__kfb.travel().cabSeat);
await mark('03_enter'); await tap();
if (isCab) { await wait(380); await shot('03a_enter_cut'); }
else { // closed car (MVP-1): enter sequence — crouch, arc, on the roof, plop (J17 hop timeline: 0.40 / 0.67 / 0.33 / 0.20 s)
  for (const [ph, ms, n] of [['runToDoor', 150, '03a_enter_run'], ['crouchIn', 250, '03a_enter_crouch'], ['hopIn', 280, '03b_enter_arc'], ['landRoof', 60, '03c_enter_roof'], ['plop', 60, '03d_enter_plop']]) { await atPhase(ph, ms); await shot(n); } }
const seated = await until(() => window.__kfb.travel().state().st === 'AUTO.SEATED' || window.__kfb.travel().state().st === 'AUTO.PARKED', null, 4000); await wait(300); await shot(isCab ? '03b_seated' : '03e_seated_cam');
if (isCab) {
// seat check from the side (Go 1: check the seat with a still): orbit the game camera ≈ 90° around the parked car
await page.evaluate(() => window.__kfb.playCam().orbit(-310, 60)); await wait(700); await shot('03c_seat_side');
await page.evaluate(() => window.__kfb.playCam().orbit(310, -60)); await wait(500);
// hands at the wheel, close (car frame: from the passenger side, above the door, looking at the rim)
const close3 = await page.evaluate(() => { const car = window.__kfb.travel().drive.car, V = (x, y, z) => car.localToWorld(car.position.clone().set(x, y, z)).toArray();
  car.updateMatrixWorld(true); window.__kfb.camOverride(V(4.6, 5.0, 4.4), V(1.0, 2.9, 0.6)); return true; });
await wait(400); await shot('03d_hands_close'); await page.evaluate(() => window.__kfb.camOverride(null)); await wait(300);
}
await mark('04_drive'); await keys({ fwd: true }); await wait(2500); await shot('04_drive');
await mark('05_brake'); await page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; t.keys.back = true; const t0 = performance.now();
  const f = () => { if (t.drive.driver.speed <= 0.3 || performance.now() - t0 > 8000) { t.keys.back = false; r(); } else requestAnimationFrame(f); }; f(); }));   // release in the frame the car stops (else k2b reverses)
await wait(500); await shot('05_stopped');
await mark('06_exit'); await tap();
if (isCab) { await wait(420); await shot('06a_exit_cut'); }
else { for (const [ph, ms, n] of [['popOut', 120, '06a_exit_pop'], ['hopOut', 300, '06b_exit_arc'], ['landOut', 120, '06c_exit_land']]) { await atPhase(ph, ms); await shot(n); } }
const walking = await until(() => window.__kfb.travel().state().st === 'WALK.GROUND', null, 4000); await wait(300); await shot(isCab ? '06b_landed' : '06d_standing');
await mark('07_walk_away'); await keys({ fwd: true }); await wait(1800); await keys({}); await shot('07_walk_away');
await mark('end');
const res = await page.evaluate((marks) => { const L = window.__tlog, out = [];
  for (let i = 0; i < marks.length - 1; i++) { const [name, a] = marks[i], b = marks[i + 1][1], S = L.slice(a, b);
    const states = []; for (const x of S) if (states[states.length - 1] !== x.st) states.push(x.st);
    // total figure turn while a cut runs (unwrapped)
    let turn = 0, prev = null; for (const x of S) { if (!x.cut) { prev = null; continue; } if (prev != null) { let d = x.yaw - prev; d = Math.atan2(Math.sin(d), Math.cos(d)); turn += Math.abs(d); } prev = x.yaw; }
    const camSteps = []; for (let j = 1; j < S.length; j++) if (S[j].cam && S[j - 1].cam) camSteps.push(Math.hypot(S[j].cam[0] - S[j - 1].cam[0], S[j].cam[1] - S[j - 1].cam[1], S[j].cam[2] - S[j - 1].cam[2]));
    // camera turn rate (deg/s) over a 0.25 s window: max over the segment
    let camRate = 0; for (let j = 0, i0 = 0; j < S.length; j++) { while (i0 < j && S[j].tms - S[i0].tms > 250) i0++; const dt = (S[j].tms - S[i0].tms) / 1000; if (dt > 0.15) { let d = S[j].camYaw - S[i0].camYaw; d = Math.atan2(Math.sin(d), Math.cos(d)); camRate = Math.max(camRate, Math.abs(d) / dt * 180 / Math.PI); } }
    const e = S[S.length - 1] || {};
    out.push({ seg: name, n: S.length, states, cutTurnDeg: +(turn * 180 / Math.PI).toFixed(1), camStepMax: camSteps.length ? +Math.max(...camSteps).toFixed(3) : null, camStepMedian: camSteps.length ? +camSteps.sort((p, q) => p - q)[camSteps.length >> 1].toFixed(3) : null,
      camTurnMaxDegS: +camRate.toFixed(1), rejects: [...new Set(S.map((x) => x.reject).filter(Boolean))], end: { st: e.st, mode: e.mode, vis: e.vis, doorDistLab: e.doorDistLab, carSpeed: e.carSpeed, fig: e.fig, car: e.car, camMode: e.camMode } }); }
  return out; }, marks);
const cab = await page.evaluate(async () => (await window.__kfb.travel().seatInfo()).cab), hopM = await page.evaluate(() => window.__kfb.travel().hopInfo());
console.log('hop', JSON.stringify(hopM));
const json = { island, road, info, flags: { reached, seated, walking }, cab, hop: hopM, segments: res };
console.log('cab', JSON.stringify(cab));
fs.writeFileSync(path.join(outDir, 'travel-probe.json'), JSON.stringify(json, null, 1));
fs.writeFileSync(path.join(outDir, 'travel-frames.json'), JSON.stringify(await page.evaluate(() => window.__tlog.map((x) => ({ st: x.st, yaw: x.yaw, cam: x.cam && x.cam.map((v) => +v.toFixed(3)), camMode: x.camMode, handT: x.handT, fig: x.fig, car: x.car, vis: x.vis, clip: x.clip, gait: x.gait, carFade: x.carFade, occ: x.carOccludes })))));
console.log(JSON.stringify({ info, flags: json.flags }));
for (const r of res) console.log(JSON.stringify(r));
console.log('errors', errors.filter((x) => !x.includes('404')).slice(0, 5));
await close();
