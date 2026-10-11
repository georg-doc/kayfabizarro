// where is the deck actually roofed? rays from 3 m above the deck along U (25 m) against the field-tunnel body, metres relative to the field mouths
import { chromium } from 'playwright-core';
const [q = 'tunnel=race_tube&tunnelField=hirn'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), [id, e] = [...O.fieldTun.entries()][0], f = e.hero.ft[0], S = O.td.samples, ds = O.td.ds, B = O.W.built.find((x) => x.id === id), ms = [];
  B.tiers.hero.g.traverse((m) => { if (m.isMesh) ms.push(m); }); O.W.world.updateMatrixWorld(true); const rc = new T.Raycaster(), V = (a) => new T.Vector3(...a), toW = O.W.world.matrixWorld;
  const roof = (i) => { const s = S[i], o = V(s.p).addScaledVector(V(s.U), 3).applyMatrix4(toW), d = V(s.U).transformDirection(toW); rc.set(o, d); rc.far = 25 * 1.46; const h = rc.intersectObjects(ms, false)[0]; return h ? +(h.distance / 1.46 + 3).toFixed(1) : null; };
  const mIn = Math.round(f.i0 - f.mouthIn / ds), mOut = Math.round(f.i1 + f.mouthOut / ds), row = (c) => { const r = []; for (let m = -40; m <= 20; m += 2) r.push([m, roof(c + Math.round(m / ds))]); return r; };
  return { mouthIn: f.mouthIn, mouthOut: f.mouthOut, a: f.a, b: f.b, i0: f.i0, i1: f.i1, inMouth: row(mIn), outMouthReversed: (() => { const r = []; for (let m = -20; m <= 40; m += 2) r.push([m, roof(mOut + Math.round(m / ds))]); return r; })() }; })));
await b.close();
