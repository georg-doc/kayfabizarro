// which triangles of the field-tunnel body are drawn as tc1-strang near the mouths? area, s from the mouth, lat / up, normal·T
import { chromium } from 'playwright-core';
const [q = 'tunnel=race_tube&tunnelField=hirn'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), [id, e] = [...O.fieldTun.entries()][0], f = e.hero.ft[0], S = O.td.samples, ds = O.td.ds, B = O.W.built.find((x) => x.id === id), ms = [];
  B.tiers.hero.g.traverse((m) => { if (m.isMesh) ms.push(m); }); O.W.world.updateMatrixWorld(true); const inv = O.W.world.matrixWorld.clone().invert(), V = (a) => new T.Vector3(...a);
  const mIn = Math.round(f.i0 - f.mouthIn / ds), q0 = S[mIn], P0 = V(q0.p), R0 = V(q0.R), U0 = V(q0.U), T0 = V(q0.T), out = { meshes: ms.map((m) => [m.name, m.geometry.index ? m.geometry.index.count / 3 : m.geometry.attributes.position.count / 3]) , big: [] };
  for (const m of ms) { if (!/strang|cloud/.test(m.name)) continue; const g = m.geometry, pos = g.attributes.position, ix = g.index?.array, n = ix ? ix.length : pos.count, M = inv.clone().multiply(m.matrixWorld);
    for (let t = 0; t < n; t += 3) { const v = [0, 1, 2].map((k) => new T.Vector3().fromBufferAttribute(pos, ix ? ix[t + k] : t + k).applyMatrix4(M)), c = v[0].clone().add(v[1]).add(v[2]).divideScalar(3), d = c.clone().sub(P0), s = d.dot(T0);
      if (s < -6 || s > 6) continue; const nn = v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])), area = nn.length() / 2; nn.normalize();
      if (area > 0.3) out.big.push({ mesh: m.name, area: +area.toFixed(2), s: +s.toFixed(2), lat: +d.dot(R0).toFixed(1), up: +d.dot(U0).toFixed(1), nT: +nn.dot(T0).toFixed(2) }); } }
  out.big.sort((a, b) => b.area - a.area); out.nBig = out.big.length; out.big = out.big.slice(0, 25); return out; })));
await b.close();
