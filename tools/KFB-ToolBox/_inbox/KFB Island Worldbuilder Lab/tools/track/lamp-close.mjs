import { chromium } from 'playwright-core';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=hero'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, t = td.tunnels[1], i = Math.round((t.i0 + t.i1) / 2), q = td.samples[i], V = (a) => new T.Vector3(...a);
  const P = V(q.p), cam = P.clone().addScaledVector(V(q.U), 6).addScaledVector(V(q.R), -6), look = P.clone().addScaledVector(V(q.U), 8).addScaledVector(V(q.R), 11).addScaledVector(V(q.T), 4);
  window.__kfb.camOverride(cam.multiplyScalar(1.46).toArray(), look.multiplyScalar(1.46).toArray()); });
await p.waitForTimeout(1500); await p.screenshot({ path: out, type: 'jpeg', quality: 90 }); await b.close();
