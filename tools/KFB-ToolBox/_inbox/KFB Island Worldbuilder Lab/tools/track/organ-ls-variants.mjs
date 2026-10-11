// V-116 cause stills: one spot, one tier, several URL variants (SN / LS settings), same camera.
// node tools/track/organ-ls-variants.mjs <outDir> <organ> <x,y,z> <tier> <dist> "<name>=<query>" ...
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, organ, at, tier, dist, ...vars] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const A = at.split(',').map(Number), b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const v of vars) { const [name, q] = v.split('=', 2).length === 2 ? [v.slice(0, v.indexOf('=')), v.slice(v.indexOf('=') + 1)] : [v, ''];
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=${tier}&${q}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
  await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.wb-panel,#wb').forEach((e) => (e.style.display = 'none')); });
  await p.evaluate(({ organ, A, dist }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === organ), c = B.I.Cw.clone().multiplyScalar(1.46), a = new T.Vector3(...A), dir = a.clone().sub(c).normalize();
    window.__kfb.camOverride(a.clone().addScaledVector(dir, dist).add(new T.Vector3(0, dist / 4, 0)).toArray(), a.toArray()); }, { organ, A, dist: +dist }); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 90 }); console.log(name); await p.close(); }
await b.close();
