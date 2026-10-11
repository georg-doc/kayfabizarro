// V-116 shape equality stills: Surface Nets (?mesher=sn) vs levelSet (default), same camera, organs Herz + Hirn, near (200 lab) + mid (1100 lab,
// light tier). node tools/track/organ-mesher-sheet.mjs <outDir> [lsK]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, lsK] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const shots = [];
for (const m of ['sn', 'ls']) {
  const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&mesher=${m}${lsK ? '&lsK=' + lsK : ''}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
  await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
  for (const id of ['herz', 'hirn']) for (const [tag, d] of [['near', 260], ['mid', 1100]]) {
    await p.evaluate(({ id, d }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === id), c = B.I.Cw.clone().multiplyScalar(1.46), dir = c.clone().sub(O.hubCentre).setY(0).normalize();
      window.__kfb.camOverride(c.clone().addScaledVector(dir, -d).add(new T.Vector3(0, d * 0.3, 0)).toArray(), c.toArray()); }, { id, d }); await p.waitForTimeout(1800);
    const f = `${out}/${id}_${tag}_${m}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 90 }); shots.push(f); }
  await p.close();
}
await b.close(); console.log(shots.join('\n'));
