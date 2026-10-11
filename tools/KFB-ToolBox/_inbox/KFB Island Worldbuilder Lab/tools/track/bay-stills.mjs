// C4a stills of the B7 bay on the hub straight (track-frame cameras, figure + car as placed by the game): approach on the road, across the
// bay from the far side, on the platform looking at the hex tiles, the transition head from low. node tools/track/bay-stills.mjs <outDir> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast', 'hud']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.wb-panel,#wb').forEach((e) => (e.style.display = 'none')); });
const shot = async (name) => { await p.waitForTimeout(1800); await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 90 }); console.log(name); };
// camera at s (track metres from the car), lateral lat, height up; looking at s + ls, lat ll, up lu (track frame at the car)
const cam = (s, lat, up, ls, ll, lu) => p.evaluate(({ s, lat, up, ls, ll, lu }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), S = O.td.samples, ds = O.td.ds, at = (x) => S[Math.round((O.sCar + x) / ds)], V = (a) => new T.Vector3(...a);
  const pt = (x, l, u) => { const q = at(x); return V(q.p).addScaledVector(V(q.R), l).addScaledVector(V(q.U), u).multiplyScalar(1.46).toArray(); }; window.__kfb.camOverride(pt(s, lat, up), pt(ls, ll, lu)); }, { s, lat, up, ls, ll, lu });
await cam(-40, -3, 4, 0, 9, 0.5); await shot('bay_approach');
await cam(0, -14, 5, 0, 12, 0); await shot('bay_across');
await cam(-16, 11.5, 2.4, 4, 24, -0.5); await shot('bay_platform_to_hex');
await cam(-30, 20, 1.5, -18, 9, 0.5); await shot('bay_head_low');
await cam(0, 34, 9, 0, 9, 0); await shot('bay_from_hex');
await cam(-6, 6.2, 1.6, 4, 9.5, 0.1); await shot('bay_kerb_near');            // V-138: kerb, sidewalk, edge stones close
await cam(-24, 17, 2.8, -12, 11, -0.3); await shot('bay_kerb_head_slope');     // V-138: kerb head (sidewalk end) and the clay slope onto the hex tiles
await cam(6, 21, 1.4, 0, 14, -0.4); await shot('bay_slope_near');
await b.close();
