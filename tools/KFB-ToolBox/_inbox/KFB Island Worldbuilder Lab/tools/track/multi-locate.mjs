// locate body-local points (e.g. multi-edges from body-closed.mjs) relative to the field tunnel of a body: nearest track sample, lat / up / s from the mouth
// node tools/track/multi-locate.mjs <bodyId> <tier> "x,y,z;x,y,z" [query]
import { chromium } from 'playwright-core';
const [id, tier, pts, q = 'tunnel=race_tube&tunnelField=hirn'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(({ id, tier, pts }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === id), ms = []; B.tiers[tier].g.traverse((m) => { if (m.isMesh) ms.push(m); });
  O.W.world.updateMatrixWorld(true); const toTrack = O.W.world.matrixWorld.clone().invert().multiply(ms[0].matrixWorld), S = O.td.samples, ft = O.fieldTun.get(id)?.[tier]?.ft ?? [];
  return pts.split(';').map((s) => { const v = new T.Vector3(...s.split(',').map(Number)).applyMatrix4(toTrack); let bi = -1, bd = Infinity; S.forEach((x, i) => { const d = v.distanceToSquared(new T.Vector3(...x.p)); if (d < bd) { bd = d; bi = i; } });
    const x = S[bi], d = v.clone().sub(new T.Vector3(...x.p)); return { track: v.toArray().map((a) => +a.toFixed(1)), i: bi, dist: +Math.sqrt(bd).toFixed(1), lat: +d.dot(new T.Vector3(...x.R)).toFixed(2), up: +d.dot(new T.Vector3(...x.U)).toFixed(2), tunnels: ft.map((f) => [f.a, f.i0, f.i1, f.b]) }; }); }, { id, tier, pts })));
await b.close();
