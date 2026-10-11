// Stufe 2 · Probe video for Georg (Steuerung 10.10.): 20–40 s from the game camera, scripted keys: set off, walk + run to the
// car, enter, drive hub_town (S-curves, short drift), brake, exit, walk away. The WebGL canvas is recorded in the page
// (MediaRecorder, MP4/H.264 when the browser has it, else WebM) and streamed to disk in chunks; a state timeline goes beside it.
// node tools/stage2/video.mjs <outFile without extension> [road] [spawnOff]
import fs from 'node:fs';
import { openLab } from '../stage1/browser.mjs';
const [out, road = '0', spawnOff = '14', seat = 'none', car = '', extra = ''] = process.argv.slice(2);   // MVP-1 (Georg 10.10.): closed Cicada, no seat variant
const { page, errors, close } = await openLab(`shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=${road}&spawnOff=${spawnOff}&seat=${seat}${car ? '&car=' + car : ''}${extra ? '&' + extra : ''}`, { maxMs: 420000 });
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
let fd = null, ext = null, bytes = 0;
await page.exposeFunction('__saveChunk', (b64, mime) => { if (!fd) { ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm'; fd = fs.openSync(out + '.' + ext, 'w'); } const b = Buffer.from(b64, 'base64'); fs.writeSync(fd, b); bytes += b.length; });
const mime = await page.evaluate(() => {
  const c = document.querySelector('canvas'), st = c.captureStream(30);
  const mime = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((t) => MediaRecorder.isTypeSupported(t));
  const rec = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: 14e6 });
  let chain = Promise.resolve();
  rec.ondataavailable = (e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(window.__saveChunk(String(fr.result).split(',')[1], mime)); fr.readAsDataURL(e.data); })); };
  window.__rec = { rec, done: new Promise((r) => { rec.onstop = () => chain.then(r); }) };
  const log = (window.__vlog = []), t0 = performance.now(); const tick = () => { const tr = window.__kfb.travel(), s = tr.state(), cp = window.__kfb.camPos(), car = tr.drive.car; car.updateMatrixWorld(true);
  const l = car.worldToLocal(car.position.clone().set(cp[0], cp[1], cp[2])), B = tr.carHop ? tr.carHop.metrics().car : null, inCar = !!B && Math.abs(l.x) < B.halfW && l.y > 0 && l.y < B.top && Math.abs(l.z) < 3;   // camera inside the car body box (car frame)
  log.push({ t: +((performance.now() - t0) / 1000).toFixed(2), st: s.st, v: s.carSpeed, fade: s.carFade, cam: cp, inCar, yaw: window.__kfb.camYaw(), ph: s.hopPhase, cc: s.camCatch, arm: tr.carHop ? tr.carHop.metrics().armAbdW : 0 }); if (window.__rec) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  rec.start(1000); return mime;
});
const wait = (ms) => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
const keys = (k) => page.evaluate((k) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; Object.assign(t.keys, k); }, k);
const until = async (fn, arg, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await wait(40); } return false; };
const tap = async () => { await page.evaluate(() => { window.__kfb.travel().keys.jump = true; }); await wait(120); await page.evaluate(() => { window.__kfb.travel().keys.jump = false; }); };
const R = await page.evaluate(() => window.__kfb.travel().gates.R_ENTER_lab);

const SCRIPT = process.env.SCRIPT ?? 'p6';
// per-frame gait log (walker speed in H/s per clip) and drive log (wall hits, lateral offset) for the before/after table
await page.evaluate(() => { const G = (window.__glog = { gait: {}, hits0: window.__kfb.travel().drive.driver.hits || 0, latMax: 0, vMax: 0 }); const f = () => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state, d = t.drive.driver;
  const now = performance.now(), p = w.position, dt = G.lt ? (now - G.lt) / 1000 : 0, hs = dt > 0 && G.lp ? Math.hypot(p.x - G.lp.x, p.z - G.lp.z) / dt : 0; G.lt = now; G.lp = { x: p.x, z: p.z };   // horizontal ground speed from the position (lab/s)
  if (s.mode === 'WALK' && !s.cut && w.onGround && s.clip && dt > 0 && dt < 0.1) { const g = (G.gait[s.clip] ??= { n: 0, max: 0, sum: 0, rate: 0 }); if (hs > 0.2) { g.n++; g.sum += hs; g.max = Math.max(g.max, hs); g.rate = s.rate ?? g.rate; } }
  if (s.mode === 'AUTO') { G.latMax = Math.max(G.latMax, Math.abs(d.lat)); G.vMax = Math.max(G.vMax, Math.abs(d.speed)); }
  if (window.__rec) requestAnimationFrame(f); }; requestAnimationFrame(f); });
if (SCRIPT === 'p5') {   // Probe 5 as delivered (walk default then, scripted drive keys incl. drift): the 'before' measurement
  await wait(1500); await keys({ ctrl: true, fwd: true }); await wait(900); await tap(); await wait(900); await keys({ fwd: true });
  await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.75, 7000);
  await keys({ ctrl: true, fwd: true }); await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.6, 2000);
  await keys({}); await wait(700); await tap();
  await until(() => /^AUTO\.(SEATED|PARKED)$/.test(window.__kfb.travel().state().st), null, 4000); await wait(500);
  await keys({ fwd: true }); await wait(1900); await keys({ fwd: true, strafeL: true, left: true }); await wait(700); await keys({ fwd: true }); await wait(300);
} else {   // Probe 6 (Georg): stand, jog (W), sprint to the car (Shift+W), stop beside it, enter
  await wait(1000);
  await keys({ fwd: true }); await wait(2500);                       // jog: Running_A, no start hop
  await keys({ fwd: true, shift: true });                            // sprint: Running_B
  await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.75, 8000);
  await keys({ fwd: true }); await until((r) => window.__kfb.travel().state().doorDistLab < r, R * 0.6, 2000);
  await keys({}); await wait(500); await tap();
  await until(() => /^AUTO\.(SEATED|PARKED)$/.test(window.__kfb.travel().state().st), null, 4000); await wait(400);
  // clean line: lane autopilot over the keys (psi aims back to the centre line), gas + boost, braking in time before the closure
  await page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(), d = t.drive.driver, b = t.drive.bounds; const t0 = performance.now();
    const f = () => { for (const n of Object.keys(t.keys)) t.keys[n] = false;
      const want = Math.max(-0.22, Math.min(0.22, 0.12 * d.lat)), e = want - d.psi; if (e > 0.02) t.keys.left = true; else if (e < -0.02) t.keys.right = true;   // left key = psi + (k2b), psi + moves the car left (lat −)
      const stop = (d.speed * d.speed) / (2 * 28) + 4;
      if (b.sMax - d.s > stop) { t.keys.fwd = true; t.keys.shift = true; } else if (d.speed > 0.3) t.keys.back = true; else { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; }
      if (performance.now() - t0 > 15000) { for (const n of Object.keys(t.keys)) t.keys[n] = false; r(); return; } requestAnimationFrame(f); }; f(); }));
}
await page.evaluate(() => new Promise((r) => { const t = window.__kfb.travel(); for (const n of Object.keys(t.keys)) t.keys[n] = false; t.keys.back = true; const t0 = performance.now();
  const f = () => { if (t.drive.driver.speed <= 0.3 || performance.now() - t0 > 6000) { t.keys.back = false; r(); } else requestAnimationFrame(f); }; f(); }));
await wait(800);
await tap();                                                         // exit
await until(() => window.__kfb.travel().state().st === 'WALK.GROUND', null, 4000); await wait(600);
// walk away with a turn away from the car (the exit lands on the entry side): the camera follows behind, never through the car
const awayLeft = await page.evaluate(() => { const t = window.__kfb.travel(), car = t.drive.car; car.updateMatrixWorld(true); return car.worldToLocal(t.walk.root.position.clone()).x > 0; });   // car frame +x = left
await keys({ fwd: true, [awayLeft ? 'left' : 'right']: true }); await wait(200); await keys({ fwd: true }); await wait(1500);
// (no sprint here: the walk-away ends at the road-end closure)
await keys({}); await wait(1200);
await page.evaluate(() => { const R = window.__rec; R.rec.stop(); });
await page.evaluate(() => window.__rec.done);
const glog = await page.evaluate(() => { const G = window.__glog, d = window.__kfb.travel().drive.driver; return { gait: Object.fromEntries(Object.entries(G.gait).map(([k, g]) => [k, { meanHs: +(g.sum / Math.max(1, g.n) / 3.64).toFixed(3), maxHs: +(g.max / 3.64).toFixed(3), frames: g.n, rate: g.rate }])), wallHits: (d.hits || 0) - G.hits0, latMaxTrack: +G.latMax.toFixed(3), vMaxTrack: +G.vMax.toFixed(2), vMaxLabS: +(G.vMax * 1.46).toFixed(1), halfWidthTrack: window.__kfb.travel().drive.car.userData.size.halfWidthTrack, laneHalfTrack: +window.__kfb.travel().drive.frame.at(window.__kfb.travel().drive.driver.s).half.toFixed(3) }; });
console.log('glog', JSON.stringify(glog));
const vlog = await page.evaluate(() => { const L = window.__vlog; window.__rec = null; return L; });
const endState = await page.evaluate(() => window.__kfb.travel().state()), cabM = await page.evaluate(async () => (await window.__kfb.travel().seatInfo()).cab);
if (fd) fs.closeSync(fd);
const seq = []; for (const x of vlog) if (!seq.length || seq[seq.length - 1].st !== x.st) seq.push({ t: x.t, st: x.st });
// camera turn rate (deg/s) over 0.25 s windows: hop windows (cuts, hand-overs, 1.5 s after) and everything else
const rate = (pick) => { let m = 0, at = null; for (let j = 0, i0 = 0; j < vlog.length; j++) { while (i0 < j && vlog[j].t - vlog[i0].t > 0.25) i0++; const dt = vlog[j].t - vlog[i0].t; if (dt < 0.15 || !pick(j)) continue; let d = vlog[j].yaw - vlog[i0].yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); const r = Math.abs(d) / dt * 180 / Math.PI; if (r > m) { m = r; at = vlog[j].t; } } return { maxDegS: +m.toFixed(1), at }; };
// hop window = the cuts, the camera hand-overs and the capped catch-up after them (camCatch)
const nearHop = (j) => /CUT|CAM\./.test(vlog[j].st) || vlog[j].cc;
const camRate = { hop: rate(nearHop), walk: rate((j) => !nearHop(j) && /WALK/.test(vlog[j].st)), drive: rate((j) => !nearHop(j) && /AUTO/.test(vlog[j].st)) };
const armPeak = Math.max(0, ...vlog.map((x) => x.arm || 0)), jumpT = vlog.filter((x) => x.st === 'WALK.JUMP').map((x) => x.t);
const camSteps = vlog.slice(1).map((x, i) => ({ t: x.t, st: x.st, d: /WALK|CUT/.test(x.st) ? Math.hypot(x.cam[0] - vlog[i].cam[0], x.cam[1] - vlog[i].cam[1], x.cam[2] - vlog[i].cam[2]) : 0, dt: +(x.t - vlog[i].t).toFixed(3) })).sort((p, q) => q.d - p.d).slice(0, 4);
console.log('camStepTop', JSON.stringify(camSteps));
console.log('camRate', JSON.stringify(camRate), 'armsDownWeightMax', armPeak, 'walkJump', jumpT[0], jumpT[jumpT.length - 1]);
fs.writeFileSync(out + '.timeline.json', JSON.stringify({ mime, camRate, camStepTop: camSteps, glog, script: SCRIPT, armsDownWeightMax: armPeak, walkJumpT: [jumpT[0], jumpT[jumpT.length - 1]], bytes, duration: vlog[vlog.length - 1]?.t, frames: vlog.length, states: seq, vMax: Math.max(...vlog.map((x) => x.v)), fadeMin: Math.min(...vlog.map((x) => x.fade)), camStepMaxWalk: Math.max(0, ...vlog.slice(1).map((x, i) => (/WALK|CUT/.test(x.st) ? Math.hypot(x.cam[0] - vlog[i].cam[0], x.cam[1] - vlog[i].cam[1], x.cam[2] - vlog[i].cam[2]) : 0))), camInCarFrames: vlog.filter((x) => x.inCar).length, hop: await page.evaluate(() => window.__kfb.travel().hopInfo()), seatErrMaxH: endState.seatErrMaxH, clipHipSwayH: endState.clipHipSwayH, cab: cabM }, null, 1));
console.log('seatErrMaxH', endState.seatErrMaxH, 'clipHipSwayH', endState.clipHipSwayH);
console.log(JSON.stringify({ file: out + '.' + ext, mime, bytes, duration: vlog[vlog.length - 1]?.t, fps: +(vlog.length / (vlog[vlog.length - 1]?.t || 1)).toFixed(1), states: seq.map((x) => x.t + ' ' + x.st).join(' | ') }));
console.log('errors', errors.filter((x) => !x.includes('404')).slice(0, 5));
await close();
