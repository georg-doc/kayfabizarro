// A10 · aurora: per-curtain elevation / distance seen from the figure (night), then a still aimed at the brightest curtain.
// node tools/a10/aurora-aim.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0&time=night'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(4000);
const geo = await p.evaluate(() => { const T = window.__kfb.three(), h = window.__kfb.skyOwner().host, cam = h.camera, r = window.__kfb.travel().walk.root;
  const eye = r.position.clone().add(new T.Vector3(0, 3.64 * 0.9, 0)), out = [];
  h.aurora.group.updateMatrixWorld(true);
  h.aurora.group.traverse((m) => { if (!m.isMesh) return; const bx = new T.Box3().setFromObject(m), c = bx.getCenter(new T.Vector3()), d = c.clone().sub(eye), hz = Math.hypot(d.x, d.z);
    out.push({ elevDeg: +(Math.atan2(d.y, hz) * 180 / Math.PI).toFixed(1), dist: +d.length().toFixed(0), hz: +hz.toFixed(0), sizeY: +(bx.max.y - bx.min.y).toFixed(0), c: c.toArray() }); });
  return { eye: eye.toArray(), kAtm: h.kAtm, radius: h.radius, camFov: cam.fov, camPitchDeg: null, curtains: out }; });
// the game camera's own pitch (behind the figure)
geo.gameCamPitchDeg = await p.evaluate(() => { const T = window.__kfb.three(), d = window.__kfb.skyOwner().host.camera.getWorldDirection(new T.Vector3()); return +(Math.asin(d.y) * 180 / Math.PI).toFixed(1); });
const lo = geo.curtains.slice().sort((a, b2) => a.elevDeg - b2.elevDeg)[0];
await p.evaluate(({ e, c }) => window.__kfb.camOverride(e, c), { e: geo.eye, c: lo.c }); await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/04b_aurora_aimed.jpg`, type: 'jpeg', quality: 90 });
fs.writeFileSync(`${out}/aurora-aim.json`, JSON.stringify(geo, null, 1)); console.log(JSON.stringify({ ...geo, curtains: geo.curtains.map((c) => [c.elevDeg, c.dist, c.hz, c.sizeY]) }));
await b.close();
