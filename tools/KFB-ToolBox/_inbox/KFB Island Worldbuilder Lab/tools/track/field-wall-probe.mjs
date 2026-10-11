// Prototyp „Tunnel im Feld“: where is the field's wall in the tube? zero crossings of the shaped field along vertical / lateral lines in the
// track frame at the middle of the first field tunnel, compared with the Core ring (and its grown contour)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&tunnelField=hirn'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(async () => { const O = window.__kfb.organ(), T = window.__kfb.three(), m = await import('/src/world/organ/vendor/lab-organ/organ-world.lab.js');
  const e = O.fieldTun.get('hirn').hero, f = e.ft[0], G = e.G, inv = e.M.clone().invert(), S = O.td.samples, i = Math.round((f.i0 + f.i1) / 2), q = S[i], V = (a) => new T.Vector3(...a);
  const at = (lat, up) => { const pt = V(q.p).addScaledVector(V(q.R), lat).addScaledVector(V(q.U), up).applyMatrix4(inv); return m.sampField(G, pt.x, pt.y, pt.z); };
  const cross = (fn, a, b2) => { const out = []; let prev = fn(a); for (let t = a + 0.25; t <= b2; t += 0.25) { const v = fn(t); if ((prev > 0) !== (v > 0)) out.push(+t.toFixed(2)); prev = v; } return out; };
  return { ringTop: f.top, grownTop: Math.max(...f.grown.map((x) => x[1])), grownHalf: Math.max(...f.grown.map((x) => Math.abs(x[0]))), h: G.h, vertical_lat0: cross((u) => at(0, u), -8, 25), vertical_lat8: cross((u) => at(8, u), -8, 25), lateral_up3: cross((l) => at(l, 3), -25, 25), lateral_up8: cross((l) => at(l, 8), -25, 25), sampleVals: [at(0, 3), at(0, 12), at(0, 20), at(0, -3)].map((x) => +x.toFixed(3)) }; })));
await b.close();
