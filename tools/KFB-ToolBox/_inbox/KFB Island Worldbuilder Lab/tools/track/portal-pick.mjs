// what draws the pixels of the prototype's portal_near still (same camera as delivery-stills.mjs, field tunnel set): mesh path + hit point in the track frame
import { chromium } from 'playwright-core';
const pts = JSON.parse(process.argv[2]), q = process.argv[3] ?? 'tunnel=race_tube&tunnelField=hirn';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), f = [...O.fieldTun.values()][0].hero.ft[0], S = O.td.samples, i = Math.round(f.i0 - f.mouthIn / O.td.ds), q = S[i], V = (a) => new T.Vector3(...a);
  const P = V(q.p), cam = P.clone().addScaledVector(V(q.T), -30).addScaledVector(V(q.U), 5), look = P.clone().addScaledVector(V(q.U), 5); window.__kfb.camOverride(cam.multiplyScalar(1.46).toArray(), look.multiplyScalar(1.46).toArray()); });
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate((pts) => { const O = window.__kfb.organ(), T = window.__kfb.three(), f = [...O.fieldTun.values()][0].hero.ft[0], S = O.td.samples, i = Math.round(f.i0 - f.mouthIn / O.td.ds), q = S[i], V = (a) => new T.Vector3(...a);
  return pts.map(([x, y]) => window.__kfb.pick(x, y).slice(0, 2).map((h) => h.path + ' d' + h.d)); }, pts), null, 1));
await b.close();
