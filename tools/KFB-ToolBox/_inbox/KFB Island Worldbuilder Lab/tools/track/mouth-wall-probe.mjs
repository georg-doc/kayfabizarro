// prototype mouth: per metre from the field mouth (0..25 m), which visible hero mesh owns the bore wall triangles above the deck, and how far
// those triangles lie from the cut contour (|sd|), to see where the TC1 wall colour actually starts
import { chromium } from 'playwright-core';
const [q = 'tunnel=race_tube&tunnelField=hirn'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(async () => { const O = window.__kfb.organ(), T = window.__kfb.three(), tf = await import('/src/world/tunnel/tunnel-field.ts'), [id, e] = [...O.fieldTun.entries()][0], f = e.hero.ft[0], S = O.td.samples, ds = O.td.ds, B = O.W.built.find((x) => x.id === id), ms = [];
  B.tiers.hero.g.traverse((m) => { if (m.isMesh) ms.push(m); }); O.W.world.updateMatrixWorld(true); const inv = O.W.world.matrixWorld.clone().invert(), V = (a) => new T.Vector3(...a);
  const mIn = Math.round(f.i0 - f.mouthIn / ds), q0 = S[mIn], P0 = V(q0.p), R0 = V(q0.R), U0 = V(q0.U), T0 = V(q0.T), H = {};
  for (const m of ms) { const g = m.geometry, pos = g.attributes.position, ix = g.index?.array, n = ix ? ix.length : pos.count, M = inv.clone().multiply(m.matrixWorld);
    for (let t = 0; t < n; t += 3) { const v = [0, 1, 2].map((k) => new T.Vector3().fromBufferAttribute(pos, ix ? ix[t + k] : t + k).applyMatrix4(M)), c = v[0].clone().add(v[1]).add(v[2]).divideScalar(3), d = c.clone().sub(P0), s = d.dot(T0), lat = d.dot(R0), up = d.dot(U0);
      if (s < -4 || s > 25 || up < 0.5) continue; const sd = tf.sdPoly(f.grown, lat, up); if (Math.abs(sd) > 3) continue; const k = Math.floor(s), h = (H[k] ??= {}); const nm = m.name || 'sheet'; h[nm] = (h[nm] ?? 0) + 1; if (nm === 'body') { h.sdBody = h.sdBody ?? []; if (h.sdBody.length < 400) h.sdBody.push(sd); } } }
  for (const k in H) if (H[k].sdBody) { const a = H[k].sdBody.sort((x, y) => x - y); H[k].sdBody = [+a[0].toFixed(2), +a[a.length >> 1].toFixed(2), +a[a.length - 1].toFixed(2)]; }
  return H; })));
await b.close();
