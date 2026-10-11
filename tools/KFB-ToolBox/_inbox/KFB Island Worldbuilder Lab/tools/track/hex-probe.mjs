import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), t = window.__kfb.travel(); let sc = O.W.world; while (sc.parent) sc = sc.parent; const hex = []; sc.traverse((m) => { if (m.isMesh && m.name === 'hex') hex.push(m); });
  const c = O.hubCentre, rc = new T.Raycaster(), out = []; for (const [x, z] of [[0, 0], [20, 0], [0, 30], [-40, 10]]) { rc.set(new T.Vector3(c.x + x, c.y + 200, c.z + z), new T.Vector3(0, -1, 0)); const hs = rc.intersectObjects(hex, false).slice(0, 3).map((h) => [+h.point.y.toFixed(1), h.object.parent?.name, h.object.type]); out.push({ x, z, hits: hs, surf: t.surfaceAt(c.x + x, c.z + z) }); }
  return { c: c.toArray(), hex: hex.map((m) => [m.parent?.name, m.type, m.geometry.attributes.position.count]), out, spawn: O.spawn }; })));
await b.close();
