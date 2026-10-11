// Clay-Audit (Steuerung 10.10.): stills from fixed cameras near the figure (face front / 3/4) and of the hub surfaces
// (ground, asphalt, kerb, walk, barrier, car), plus the eye-rig status. Read-only: camOverride only.
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&spawnOff=4');
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
const wait = (ms) => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
await wait(1500);
const info = await page.evaluate(() => { const K = window.__kfb, t = K.travel(), res = t.walk.res, obj = res.obj; const names = []; obj.traverse((o) => { if (/eye|lid|pupil/i.test(o.name)) names.push(o.name); });
  const mats = []; obj.traverse((o) => { if (o.isMesh) mats.push({ mesh: o.name, mat: o.material?.type, clay: !!(o.material?.userData?.clay || o.material?.customProgramCacheKey?.toString().includes('clay') || o.material?.onBeforeCompile?.toString().length > 30) }); });
  return { eyesMounted: !!res.eyes, eyeNodes: names.slice(0, 12), mats: mats.slice(0, 12), warnings: (K.warnings || []).filter((w) => /eye|resident/i.test(w)).slice(0, 5) }; });
const H = 3.64;
const shot = async (name, camFn) => { await page.evaluate(camFn); await wait(500); await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 90 }); };
// game camera, as played
await shot('00_game_camera', () => window.__kfb.camOverride(null));
// face front and 3/4: camera at head height, 1.1 H in front of the figure
for (const [n, ang] of [['01_face_front', 0], ['02_face_34', 0.75]]) await shot(n, `(() => { const t = window.__kfb.travel(), r = t.walk.root, h = t.walk.walker.state.heading, H = ${H}, a = h + ${ang};
  const head = [r.position.x, r.position.y + 0.82 * H, r.position.z], cam = [head[0] + Math.sin(a) * 1.1 * H, head[1] + 0.05 * H, head[2] + Math.cos(a) * 1.1 * H]; window.__kfb.camOverride(cam, head); })()`);
// surfaces near the car: asphalt, kerb, walk, barrier (car frame: +x left)
await shot('03_road_kerb_close', `(() => { const car = window.__kfb.travel().drive.car; car.updateMatrixWorld(true); const V = (x, y, z) => car.localToWorld(car.position.clone().set(x, y, z)).toArray();
  window.__kfb.camOverride(V(-2.5, 3.2, -7), V(-5.5, 0.2, 2)); })()`);
await shot('04_car_close', `(() => { const car = window.__kfb.travel().drive.car; car.updateMatrixWorld(true); const V = (x, y, z) => car.localToWorld(car.position.clone().set(x, y, z)).toArray();
  window.__kfb.camOverride(V(-5, 3.5, 5), V(0, 1.6, 0)); })()`);
await shot('05_ground_close', `(() => { const t = window.__kfb.travel(), r = t.walk.root, h = t.walk.walker.state.heading, p = r.position;
  window.__kfb.camOverride([p.x - Math.sin(h) * 2, p.y + 2.6, p.z - Math.cos(h) * 2], [p.x + Math.sin(h) * 3, p.y, p.z + Math.cos(h) * 3]); })()`);
await shot('06_figure_body_close', `(() => { const t = window.__kfb.travel(), r = t.walk.root, h = t.walk.walker.state.heading, H = ${H}, a = h + 0.5;
  const c = [r.position.x, r.position.y + 0.5 * H, r.position.z]; window.__kfb.camOverride([c[0] + Math.sin(a) * 1.8 * H, c[1] + 0.2 * H, c[2] + Math.cos(a) * 1.8 * H], c); })()`);
fs.writeFileSync(path.join(outDir, 'audit.json'), JSON.stringify({ ...info, errors: errors.filter((e) => !e.includes('404')).slice(0, 5) }, null, 1));
console.log(JSON.stringify(info));
await close();
