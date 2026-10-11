// track-frame point(s) → nearest sample, lat / up, metres from the field-tunnel mouths. node tools/track/track-locate.mjs "x,y,z;…" [query]
import { chromium } from 'playwright-core';
const [pts, q = 'tunnel=race_tube&tunnelField=hirn'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate((pts) => { const O = window.__kfb.organ(), T = window.__kfb.three(), S = O.td.samples, ds = O.td.ds, f = [...O.fieldTun.values()][0].hero.ft[0], mIn = f.i0 - f.mouthIn / ds, mOut = f.i1 + f.mouthOut / ds, V = (a) => new T.Vector3(...a);
  return pts.split(';').map((s) => { const v = V(s.split(',').map(Number)); let bi = -1, bd = Infinity; S.forEach((x, i) => { const d = v.distanceToSquared(V(x.p)); if (d < bd) { bd = d; bi = i; } }); const x = S[bi], d = v.clone().sub(V(x.p));
    return { i: bi, fromMouthIn_m: +((bi - mIn) * ds).toFixed(1), toMouthOut_m: +((mOut - bi) * ds).toFixed(1), lat: +d.dot(V(x.R)).toFixed(2), up: +d.dot(V(x.U)).toFixed(2), along: +d.dot(V(x.T)).toFixed(2) }; }); }, pts)));
await b.close();
