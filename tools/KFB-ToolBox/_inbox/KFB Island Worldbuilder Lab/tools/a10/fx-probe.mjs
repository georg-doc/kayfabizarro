// A10 (V-092) · TinySkies effects on PondLand: one still per effect + measured weights, and the AUTO cycle through light.ts.
//   flare_day      camera at the figure looking toward the sun (lens flare + god rays, day)
//   rain_game      game camera, REGEN (200 streaks + glass drops on screen)
//   rain_god       real clicks: G → REGEN chip (God-Mode weather row)
//   aurora_game    night, game camera: aurora in the game image (LAB PATCH elevation)
//   lichtkreis     night, game camera: WhackMan Fog of War light on (60 %) / off
//   auto_<phase>   AUTO at day / evening / night phase: the Lab's own lights (key = shadow sun, hemi, fill) read back
// Screen check per effect: the effect's own objects projected into the frame (no rescaling — out of frame is reported).
// node tools/a10/fx-probe.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [], external = new Set();
p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)); });
p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) external.add(u.hostname + u.pathname.slice(0, 50)); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(3000);
const R = { shots: {} };
const snap = async (name) => { await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 90 }); };
const fx = () => p.evaluate(() => window.__kfb.sky().fx);
// lights the Lab actually renders with (light.ts owner): the shadow-casting sun, hemisphere, fill
const labLights = () => p.evaluate(() => { const sc = window.__kfb.skyOwner().host.scene, o = {}; sc.traverse((l) => { if (!l.isLight || l.parent?.name !== 'kfb:light') return; const k = l.isHemisphereLight ? 'hemi' : l.isDirectionalLight ? (l.castShadow ? 'key' : 'fill') : null; if (k && !o[k]) o[k] = { i: +l.intensity.toFixed(3), c: '#' + l.color.getHexString() }; }); return o; });
// fraction of an effect group's vertices / centre inside the view frustum
const onScreen = (which) => p.evaluate((which) => { const T = window.__kfb.three(), h = window.__kfb.skyOwner().host, cam = h.camera, g = which === 'aurora' ? h.aurora.group : h.rays.group;
  cam.updateMatrixWorld(); g.updateMatrixWorld(true); const pts = []; g.traverse((m) => { if (m.isMesh && m.visible) { const b = new T.Box3().setFromObject(m); pts.push(b.getCenter(new T.Vector3())); } });
  const ndc = pts.map((v) => v.clone().project(cam)), inF = ndc.filter((v) => Math.abs(v.x) < 1 && Math.abs(v.y) < 1 && v.z < 1).length;
  const c = pts.reduce((a, v) => a.add(v), new T.Vector3()).divideScalar(Math.max(1, pts.length));
  return { parts: pts.length, inFrame: inF, centre: c.toArray().map((x) => +x.toFixed(1)), distFromCam: +c.distanceTo(cam.position).toFixed(1), camFar: cam.far }; }, which);
const fig = () => p.evaluate(() => { const r = window.__kfb.travel().walk.root; return [r.position.x, r.position.y + 3.64 * 0.9, r.position.z]; });

// 1 · day: lens flare + god rays, looking toward the sun (low over the figure's shoulder)
await p.evaluate(() => window.__kfb.skyOwner().setTime('day')); await p.waitForTimeout(1500);
{ const f = await fig(), d = (await p.evaluate(() => window.__kfb.sky().sun.dir)); const e = [f[0] - d[0] * 6, f[1] + 1.5, f[2] - d[2] * 6];
  await p.evaluate(({ e, d }) => window.__kfb.camOverride(e, [e[0] + d[0] * 100, e[1] + d[1] * 100, e[2] + d[2] * 100]), { e, d }); await p.waitForTimeout(1500);
  R.shots.flare_day = { fx: await fx(), godrays: await onScreen('rays'), sunDir: d }; await snap('01_flare_day'); }
await p.evaluate(() => window.__kfb.camOverride(null)); await p.waitForTimeout(800);
// 2 · rain in the game camera
await p.evaluate(() => window.__kfb.skyOwner().setWeather('rain')); await p.waitForTimeout(5000);
R.shots.rain_game = { fx: await fx() }; await snap('02_rain_game');
// 3 · the God-Mode weather row by real clicks (KLAR, then REGEN again)
await p.keyboard.press('KeyG'); await p.waitForTimeout(800);
await p.getByText('KLAR', { exact: true }).click(); await p.waitForTimeout(2500); const afterKlar = await fx();
await p.getByText('REGEN', { exact: true }).click(); await p.waitForTimeout(4500);
R.shots.rain_god = { afterKlar, afterRegen: await fx() }; await snap('03_rain_godmode_chips');
await p.getByText('KLAR', { exact: true }).click(); await p.keyboard.press('KeyG'); await p.waitForTimeout(4000);
// 4 · night, game camera (no override): aurora in the game image (elevation LAB PATCH, default 20°), Lichtkreis on (60 %) / off
await p.evaluate(() => window.__kfb.skyOwner().setTime('night')); await p.waitForTimeout(3500);
R.shots.aurora_game = { fx: await fx(), aurora: await onScreen('aurora'), camPitchDeg: await p.evaluate(() => { const T = window.__kfb.three(), d = window.__kfb.skyOwner().host.camera.getWorldDirection(new T.Vector3()); return +(Math.asin(d.y) * 180 / Math.PI).toFixed(1); }) };
await snap('04_aurora_night_game');
R.shots.circle_on = await p.evaluate(() => window.__kfb.lightCircle(0.6)); await p.waitForTimeout(600); await snap('05_lichtkreis_night_on');
R.shots.circle_off = await p.evaluate(() => window.__kfb.lightCircle(0)); await p.waitForTimeout(600); await snap('05_lichtkreis_night_off');
await p.evaluate(() => window.__kfb.lightCircle(0.6));
// 5 · AUTO: the cycle drives the Lab lights (skyRig adapter) — three phases, game camera
await p.evaluate(() => window.__kfb.skyOwner().setTime('auto'));
R.auto = {};
for (const [k, ph] of [['day', 0.18], ['evening', 0.46], ['night', 0.70]]) {
  await p.evaluate((ph) => window.__kfb.skyOwner().host.dn.setPhase(ph), ph); await p.waitForTimeout(1800);
  R.auto[k] = { sky: await p.evaluate(() => { const s = window.__kfb.sky(); return { time: s.time, phase: s.phase, night: s.night, day: s.day, sun: s.sun, fog: s.fog }; }), lab: await labLights(), fx: await fx(), lichtkreis: await p.evaluate(() => window.__kfb.lightCircle()) };
  await snap('06_auto_' + k);
}
// the cycle runs on its own: phase after 4 s of AUTO
{ const a = await p.evaluate(() => window.__kfb.sky().phase); await p.waitForTimeout(4000); const c = await p.evaluate(() => window.__kfb.sky().phase); R.auto.runs = { from: a, to: c, perSec: +((c - a) / 4).toFixed(5), minutesPerCycle: c > a ? +((4 / (c - a)) / 60).toFixed(2) : null }; }
R.errors = await p.evaluate(() => window.__kfb.errors); R.logs = logs; R.external = [...external];
fs.writeFileSync(`${out}/fx-probe.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1).slice(0, 6000));
await b.close();
