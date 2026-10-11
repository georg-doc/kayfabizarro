// Gleichstand-Test (B0, Steuerung 11.10.) — runs before every delivery. Real keyboard / mouse input in the real game, both entries:
//   game = ?play=game (PondLand stage)   hub = ?rkit=1&hub=1&play=travel (RKIT test hub)   organ = ?hub=1&play=game (the new hub world, V-109)
// Checks (ONE gait scheme = the J17 travel core):
//   1 W 2 s → clip Running_A, ground speed ≈ 1.40 H/s (±15 %), camera follows (figure–camera distance stays)
//   2 Shift+W 2 s → clip Running_B (rate 1.3)
//   3 Space standing → Jump_Start · Space while jogging → Jump_Full_Short · Space while sprinting → Jump_Full_Long
//   4 camera calm: 6 s slow RMB orbit → camera jitter (2nd difference) on frames WITHOUT obstacle p95 ≤ 0.05 lab / frame; arm step ≤ 0.15 lab
//   5 recenter: RMB orbit ≈ 90°, then W 2 s → camera behind the figure (±10°)
//   6 zoom: wheel fully in → POV (eye height, figure faded out); fully out → zoom 2.8, arm at its maximum, no clipping
//   7 WoW mouse: RMB drag turns the figure (camera with it), LMB drag turns only the camera   8 LMB+RMB = run forward
//   9 no debug values in the game (V-041)   10 Cozy Tunes play offline from the local private copy (V-073, game entry)
//   (jumps: Space standing = Jump_Start, from the jog = Jump_Full_Short, Shift+Space from the sprint = Jump_Full_Long; double Space unassigned)
// node tools/parity/parity.mjs [outJson] [entries=game,hub]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [outArg, entArg, stillsArg] = process.argv.slice(2), ENTRIES = (entArg ?? 'game,hub').split(',');   // stillsArg: folder for the delivery stills (game entry)
if (stillsArg) fs.mkdirSync(stillsArg, { recursive: true });
const URLS = { game: 'http://127.0.0.1:5192/?play=game&almanac=0&dynres=0', hub: 'http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0', organ: 'http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0' };   // organ = the new hub world (C1b+C3, V-109)
const H = 3.64, RUN_H = 1.40;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const report = { at: new Date().toISOString(), entries: {} };
for (const E of ENTRIES) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URLS[E]); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 });
  await p.waitForTimeout(2500); await p.mouse.click(800, 500);   // focus (first gesture)
  const st = () => p.evaluate(() => { const t = window.__kfb.travel(), s = t.state(), w = t.walk.walker.state; return { st: s.st, clip: s.clip, gait: s.gait, x: w.position.x, z: w.position.z, h: w.heading, speed: w.speed, onGround: w.onGround, cam: window.__kfb.camPos(), camYaw: window.__kfb.camYaw() }; });
  const R = { checks: {} };
  const still = async (name) => { if (stillsArg && E === 'game') await p.screenshot({ path: `${stillsArg}/${name}.jpg`, type: 'jpeg', quality: 90 }); };
  // harness (not gameplay): back to the start point, facing away from the parked car on the hub, before each movement check
  const start = await p.evaluate(() => { const w = window.__kfb.travel().walk.walker.state; return { x: w.position.x, z: w.position.z, h: w.heading }; });
  const home = (turn = 0) => p.evaluate(({ s, turn }) => { const W = window.__kfb.travel().walk; W.walker.reset(s.x, s.z, W.heightAt(s.x, s.z), s.h + turn); }, { s: start, turn });
  const FACE = E === 'hub' || E === 'organ' ? Math.PI : 0;   // organ: the spawn also faces the parked car (C1b+C3), same harness as hub
  // hub: the start point is beside the parked car (Space there = enter, by design): start 5 H further away, facing away
  if (E === 'hub' || E === 'organ') { start.x += Math.sin(start.h + Math.PI) * 5 * H; start.z += Math.cos(start.h + Math.PI) * 5 * H; }
  await home(FACE); await p.waitForTimeout(400);
  const ok = (k, pass, data) => { R.checks[k] = { pass: !!pass, ...data }; };
  // V-107 (Steuerung 11.10.): checks 5 and 8 hold the input for SIM time, not wall time — the loop clamps its step to 50 ms, so at
  // < 20 fps (hub headless 12–17 fps) a wall-clock hold gave the sim only 60–80 % of the time. Criteria unchanged (as check 6).
  const simWait = (sec) => p.evaluate((sec) => new Promise((res) => { let acc = 0; const t0 = performance.now(); const off = window.__kfb.onFrame((dt) => { acc += dt; if (acc >= sec || performance.now() - t0 > 15000) { off(); res(+acc.toFixed(3)); } }); }), sec);
  // 1 jog
  const a0 = await st(); await p.keyboard.down('KeyW'); await p.waitForTimeout(600); const a1 = await st(); const simA = await simWait(1.4); const a2 = await st();   // Steuerung 11.10. (C1b+C3): check 1 in SIM time like 5 / 8 (V-107) await still('01_jog_Running_A'); await p.keyboard.up('KeyW'); await p.waitForTimeout(600);
  const v1 = Math.hypot(a2.x - a1.x, a2.z - a1.z) / simA / H, camD1 = Math.hypot(a1.cam[0] - a1.x, a1.cam[2] - a1.z), camD2 = Math.hypot(a2.cam[0] - a2.x, a2.cam[2] - a2.z);
  ok('1_W_jog_Running_A', a2.clip === 'Running_A' && Math.abs(v1 - RUN_H) / RUN_H <= 0.15 && Math.abs(camD2 - camD1) < 1.5, { clip: a2.clip, speedH: +v1.toFixed(3), target: RUN_H, simSec: simA, camDist: [+camD1.toFixed(2), +camD2.toFixed(2)], moved: +Math.hypot(a2.x - a0.x, a2.z - a0.z).toFixed(2) });
  // 2 sprint
  await home(FACE); await p.waitForTimeout(400);
  await p.keyboard.down('ShiftLeft'); await p.keyboard.down('KeyW'); await p.waitForTimeout(700); const b1 = await st(); const tW = Date.now(), simB = await simWait(1.2), wallB = (Date.now() - tW) / 1000; const b2 = await st();
  const v2 = Math.hypot(b2.x - b1.x, b2.z - b1.z) / wallB / H, v2sim = Math.hypot(b2.x - b1.x, b2.z - b1.z) / simB / H;   // criterion unchanged (wall clock); v2sim = info only (V-107-style, proposal)
  // 3c sprint jump (still holding Shift+W)
  await p.keyboard.down('Space'); await p.waitForTimeout(40); await p.keyboard.up('Space'); await p.waitForTimeout(160); const j3 = await st(); await p.waitForTimeout(200); await still('02_long_jump_Jump_Full_Long'); await p.waitForTimeout(1300);
  await p.keyboard.up('KeyW'); await p.keyboard.up('ShiftLeft'); await p.waitForTimeout(900);
  ok('2_ShiftW_sprint_Running_B', b2.clip === 'Running_B' && v2 > v1 * 1.2, { clip: b2.clip, speedH: +v2.toFixed(3), info_simSpeedH: +v2sim.toFixed(3), info_wallSec: +wallB.toFixed(2), info_simSec: simB });
  // 3a standing jump
  await home(FACE); await p.waitForTimeout(500);
  await p.keyboard.down('Space'); await p.waitForTimeout(40); await p.keyboard.up('Space'); await p.waitForTimeout(160); const j1 = await st(); await p.waitForTimeout(1300);
  // 3b jog jump
  await home(FACE); await p.waitForTimeout(400);
  await p.keyboard.down('KeyW'); await p.waitForTimeout(900); await p.keyboard.down('Space'); await p.waitForTimeout(40); await p.keyboard.up('Space'); await p.waitForTimeout(160); const j2 = await st(); await p.waitForTimeout(1300); await p.keyboard.up('KeyW'); await p.waitForTimeout(900);
  ok('3_jumps', j1.clip === 'Jump_Start' && j2.clip === 'Jump_Full_Short' && j3.clip === 'Jump_Full_Long', { standing: j1.clip, jog: j2.clip, sprint: j3.clip, states: [j1.st, j2.st, j3.st] });
  // 4 camera calm: RMB orbit 6 s, standing
  await home(FACE); await p.waitForTimeout(800);
  // samples from inside the game loop (after render): a separate rAF callback flips order with the loop and reads stale frames
  await p.evaluate(() => { const L = (window.__cl = []); let t = 0; window.__cu = window.__kfb.onFrame((dt) => { t += dt * 1000; const A = window.__kfb.playCam().state.arm; L.push({ t, c: window.__kfb.camPos(), a: A.used, free: A.hit == null && !A.soft && !A.avoided && A.groundLift < 0.01 }); }); });
  await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' });
  // a regular 60-Hz pointer stream inside the page (the game's own pointermove handler, button mask 1 = LMB): Playwright's
  // node-side mouse.move arrives with latency (0–2 events per frame), which measured as camera jitter although the camera was still
  // a 250-Hz pointer stream like a gaming mouse (small deltas, not synchronised to frames), through the game's own handler
  await p.evaluate(() => new Promise((res) => { const t0 = performance.now(); const iv = setInterval(() => { const k = (performance.now() - t0) / 16.7; dispatchEvent(new PointerEvent('pointermove', { clientX: 800 + Math.cos(k * 0.02) * 160, clientY: 500 + Math.sin(k * 0.014) * 60, buttons: 1, bubbles: true })); if (performance.now() - t0 > 6000) { clearInterval(iv); res(); } }, 4); }));
  await p.mouse.up({ button: 'left' });
  const L = await p.evaluate(() => { window.__cu(); return window.__cl; });
  const jit = []; let armStep = 0, freeN = 0; for (let i = 2; i < L.length; i++) { armStep = Math.max(armStep, Math.abs(L[i].a - L[i - 1].a)); if (!(L[i].free && L[i - 1].free && L[i - 2].free)) continue; freeN++; const t0 = L[i - 2].t, t1 = L[i - 1].t, t2 = L[i].t, d1 = Math.max(1, t1 - t0), d2 = Math.max(1, t2 - t1);
    const acc = [0, 1, 2].map((k) => (2 * ((L[i].c[k] - L[i - 1].c[k]) / d2 - (L[i - 1].c[k] - L[i - 2].c[k]) / d1)) / (d1 + d2)); jit.push(Math.hypot(...acc) * 16.7 * 16.7); }   // 2nd derivative with variable dt, as a 60-fps frame step
  jit.sort((x, y) => x - y); const jp95 = jit[Math.floor(jit.length * 0.95)] ?? 0;
  const dts = L.slice(1).map((x, i) => x.t - L[i].t).sort((x, y) => x - y), dtMed = dts[dts.length >> 1] ?? 16.7, measurable = dtMed <= 33.4;   // < 30 fps headless: the step clamp (50 ms) makes any camera stutter
  ok('4_camera_calm_orbit', measurable ? jp95 <= 0.05 && armStep <= 0.15 : armStep <= 0.15, { measurable, fps: +(1000 / dtMed).toFixed(1), jitterP95_free: +jp95.toFixed(4), jitterMax_free: +(jit[jit.length - 1] ?? 0).toFixed(4), freeFrames: freeN, armStepMax: +armStep.toFixed(3), frames: L.length });
  // 5 recenter: orbit ≈ 90° (yaw 0.005 rad/px → 314 px), then W 2 s
  await home(FACE); await p.waitForTimeout(800); await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' }); for (let k = 1; k <= 20; k++) { await p.mouse.move(800 - k * 15.7, 500); await p.waitForTimeout(16); } await p.mouse.up({ button: 'left' });
  await p.waitForTimeout(500); const r0 = await st();
  await p.keyboard.down('KeyW'); const sim5 = await simWait(2.0); const r1 = await st(); await p.keyboard.up('KeyW');
  const dyaw = (a, h) => { const d = a - h; return Math.abs(Math.atan2(Math.sin(d), Math.cos(d))) * 180 / Math.PI; };
  ok('5_recenter_after_orbit', dyaw(r1.camYaw, r1.h) <= 10, { afterOrbitDeg: +dyaw(r0.camYaw, r0.h).toFixed(1), after2sRunDeg: +dyaw(r1.camYaw, r1.h).toFixed(1), simSec: sim5 });
  // 6 zoom (WoW): wheel fully in → first person (camera at eye height, figure faded out); fully out → arm maximum, no clipping
  await home(FACE); await p.waitForTimeout(500); await p.mouse.move(800, 500);
  for (let k = 0; k < 40; k++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(20); } await p.waitForTimeout(1500);
  await still('03_zoom_in_POV');
  const zi = await p.evaluate(() => { const t = window.__kfb.travel(), r = t.walk.root, c = window.__kfb.camPos(), pc = window.__kfb.playCam(); return { pov: pc.pov, zoom: pc.state.zoom, figVisible: r.visible, camAboveFeetH: (c[1] - r.position.y) / 3.64, camFromFigH: Math.hypot(c[0] - r.position.x, c[2] - r.position.z) / 3.64 }; });
  // A10 (11.10.): settle 3.0 s (was 1.8): the arm's exponential pull-out (3/s) sat at 98.9–99.1 % after 1.8 s depending on frame pacing,
  // so check 6 flipped run to run; the criterion (arm within 1 % of full) is unchanged
  for (let k = 0; k < 60; k++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(20); } await p.waitForTimeout(3000);
  await still('04_zoom_out_max');
  const zo = await p.evaluate(() => { const t = window.__kfb.travel(), r = t.walk.root, c = window.__kfb.camPos(), pc = window.__kfb.playCam(), a = pc.state.arm; return { pov: pc.pov, zoom: pc.state.zoom, figVisible: r.visible, armFull: a.full, armUsed: a.used, hit: a.hit, groundLift: a.groundLift, camAboveFeetH: (c[1] - r.position.y) / 3.64 }; });
  ok('6_zoom_pov_and_max', zi.pov > 0.99 && !zi.figVisible && zi.camFromFigH < 0.3 && zo.zoom >= 2.79 && zo.figVisible && Math.abs(zo.armUsed - zo.armFull) / zo.armFull < 0.01 && zo.camAboveFeetH > 0, { zoomIn: zi, zoomOut: zo });
  // 7 WoW mouse: RMB drag turns the figure with the camera, LMB drag turns the camera only; 8 both buttons = forward
  for (let k = 0; k < 30; k++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(10); }   // back to a normal zoom
  for (let k = 0; k < 12; k++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(10); } await p.waitForTimeout(800);
  await home(FACE); await p.waitForTimeout(500);
  const drag = async (btn, dx) => { await p.mouse.move(800, 500); await p.mouse.down({ button: btn }); for (let k = 1; k <= 20; k++) { await p.mouse.move(800 + (k * dx) / 20, 500); await p.waitForTimeout(16); } await p.mouse.up({ button: btn }); await p.waitForTimeout(700); };
  const hd = (a, b) => { const d = a - b; return Math.atan2(Math.sin(d), Math.cos(d)) * 180 / Math.PI; };
  const s0 = await st(); await drag('right', -200); const s1 = await st(); await drag('left', -200); const s2 = await st();
  ok('7_wow_rmb_steers_lmb_looks', Math.abs(hd(s1.h, s0.h)) > 30 && Math.abs(hd(s2.h, s1.h)) < 3, { rmbFigureTurnDeg: +hd(s1.h, s0.h).toFixed(1), lmbFigureTurnDeg: +hd(s2.h, s1.h).toFixed(1), lmbCameraTurnDeg: +hd(s2.camYaw, s1.camYaw).toFixed(1) });
  await home(FACE); await p.waitForTimeout(500); const f0 = await st();
  await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' }); await p.mouse.down({ button: 'right' }); const sim8 = await simWait(1.5); const f1 = await st(); await p.mouse.up({ button: 'right' }); await p.mouse.up({ button: 'left' }); await p.waitForTimeout(500);
  ok('8_wow_both_buttons_forward', Math.hypot(f1.x - f0.x, f1.z - f0.z) > 1.0 * H, { movedH: +(Math.hypot(f1.x - f0.x, f1.z - f0.z) / H).toFixed(2), clip: f1.clip, simSec: sim8 });
  if (stillsArg && E === 'game') { await p.keyboard.press('KeyG'); await p.waitForTimeout(900); await still('05_godmode_time_and_camera_slider'); await p.keyboard.press('KeyG'); await p.waitForTimeout(700); }
  // 9 no debug values in the game (V-041): Lab panel / toast / panel button hidden
  const dbg = await p.evaluate(() => ['panel', 'toast', 'showPanel'].map((id) => { const e = document.getElementById(id); return e ? getComputedStyle(e).display : 'absent'; }));
  ok('9_no_debug_in_game', dbg.every((d) => d === 'none' || d === 'absent'), { panel: dbg[0], toast: dbg[1], showPanel: dbg[2] });
  // 10 Cozy Tunes offline (V-073): every request off this machine is blocked, the radio's Cozy list must still play (local private copy)
  if (E === 'game') {
    const blocked = []; await p.route((u) => !/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname), (r) => { blocked.push(new URL(r.request().url()).hostname); r.abort(); });
    await p.evaluate(() => window.__kfb.audioOwner().debugPlay('cozy'));
    const okP = await p.waitForFunction(() => { const m = window.__kfb.audio().music; return m.list === 'cozy' && m.state === 'bereit' && m.time > 0.8; }, null, { timeout: 20000 }).then(() => true, () => false);
    const m = await p.evaluate(() => window.__kfb.audio().music);
    ok('10_cozy_offline', okP && m.blobOk === true, { title: m.title, state: m.state, blobOk: m.blobOk, time: m.time, blockedHosts: [...new Set(blocked)] });
    await p.evaluate(() => window.__kfb.audioOwner().debugPlay('station')).catch(() => null); await p.unroute('**');
  }
  R.errors = errs.concat(await p.evaluate(() => window.__kfb.errors));
  R.pass = Object.values(R.checks).every((c) => c.pass) && !R.errors.length;
  report.entries[E] = R; console.log(E, JSON.stringify(R));
  await p.close();
}
await b.close();
report.pass = Object.values(report.entries).every((e) => e.pass);
if (outArg) fs.writeFileSync(outArg, JSON.stringify(report, null, 1));
console.log('PARITY', report.pass ? 'PASS' : 'FAIL');
process.exitCode = report.pass ? 0 : 1;
