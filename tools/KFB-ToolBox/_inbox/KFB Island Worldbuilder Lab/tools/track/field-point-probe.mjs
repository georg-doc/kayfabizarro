// Prototyp debug: for track-frame points in the middle of the first field tunnel: nearest tunnel sample by field distance, lat / up / s, sdT
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&tunnelField=hirn'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(async () => { const O = window.__kfb.organ(), T = window.__kfb.three(), tf = await import('/src/world/tunnel/tunnel-field.ts'), om = await import('/src/world/organ/vendor/lab-organ/organ-world.lab.js');
  const e = O.fieldTun.get('hirn').hero, f = e.ft[0], G = e.G, M = e.M, inv = M.clone().invert(), S = O.td.samples, N = S.length, V = (a) => new T.Vector3(...a), mid = Math.round((f.i0 + f.i1) / 2), q = S[mid];
  const kf = inv.getMaxScaleOnAxis(), smp = []; for (let i = f.a; i <= f.b; i += 2) { const s = S[((i % N) + N) % N]; smp.push({ i, p: V(s.p).applyMatrix4(inv), s }); }
  return { kf, h: G.h, rootScale: M.getMaxScaleOnAxis(), pts: [[0, 3], [0, 8], [0, 10], [12, 3], [-12, 3]].map(([lat, up]) => { const w = V(q.p).addScaledVector(V(q.R), lat).addScaledVector(V(q.U), up), fp = w.clone().applyMatrix4(inv);
    let best = null, bd = Infinity; for (const x of smp) { const d = x.p.distanceToSquared(fp); if (d < bd) { bd = d; best = x; } } const back = fp.clone().applyMatrix4(M), rel = back.clone().sub(V(best.s.p));
    const l2 = rel.dot(V(best.s.R)), u2 = rel.dot(V(best.s.U)); return { lat, up, nearestI: best.i, midI: mid, lat2: +l2.toFixed(2), up2: +u2.toFixed(2), sd: +tf.sdPoly(f.grown, l2, u2).toFixed(2), field: +om.sampField(G, fp.x, fp.y, fp.z).toFixed(3), backErr: +back.distanceTo(w).toFixed(4) }; }) }; })));
await b.close();
