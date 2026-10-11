// C4c stills (exit / entry at the hex hub, track-frame cameras at the hub start E = isle_HX joint): approach to the exit, the gore + nose,
// the branch ramp onto the plaza, the plaza road, the entry merge, a top view. node tools/track/c4c-stills.mjs <outDir> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } }), errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&shot=1&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const shot = async (n) => { await p.waitForTimeout(900); await p.screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 88 }); console.log(n); };
// camera at s (track metres from the hub start E), lateral lat (+ = right), height up; looking at s + ls, lat ll, up lu — frame of the ring sample at E (straight)
const cam = (s, lat, up, ls, ll, lu) => p.evaluate(({ s, lat, up, ls, ll, lu }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, j = td.joints.find((x) => x.piece === 'isle_HX'), q = td.samples[j.index], V = (a) => new T.Vector3(...a);
  const pt = (x, l, u) => V(q.p).addScaledVector(V(q.T), x).addScaledVector(V(q.R), l).addScaledVector(V(q.U), u).multiplyScalar(1.46).toArray(); window.__kfb.camOverride(pt(s, lat, up), pt(ls, ll, lu)); }, { s, lat, up, ls, ll, lu });
await cam(-130, -2, 6, -60, -6, 0); await shot('c4c_exit_approach');
await cam(-30, -4, 5, 0, -14, 0); await shot('c4c_gore_nose');
await cam(-6, -30, 9, 20, -18, 0); await shot('c4c_ramp_down');
await cam(60, -45, 18, 60, -16, 0); await shot('c4c_plaza_side');
await cam(100, -3, 6, 160, -8, 0); await shot('c4c_entry_merge');
await cam(80, -10, 260, 80, -10, 0); await shot('c4c_top');
await cam(-14, -9, 3.2, 2, -16, 0.5); await shot('c4c_nose_close');
await cam(70, -27, 2.6, 52, -20, 0.2); await shot('c4c_bollards_zebra');
await cam(150, -12, 3, 175, -6, 0.4); await shot('c4c_entry_nose');
await cam(132, -5, 2.2, 150, -14, 0.3); await shot('c4c_entry_close');
await cam(205, -9, 2.4, 222, -12, 0.3); await shot('c4c_entry_end');
await cam(-70, -5, 2.2, -50, -12, 0.3); await shot('c4c_exit_close');
fs.writeFileSync(`${out}/stills_errs.json`, JSON.stringify(errs)); await b.close();
