// V-112 tunnel stills: per tunnel the mouth (in front, 45 m out, 9 m up), the mouth close (18 m), and the interior (on the deck, 3 m up, looking
// along the track). node tools/track/organ-tunnel-stills.mjs <outDir> [query] [tunnel indices e.g. 0,1]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = '', which] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=hero&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.wb-panel,#wb').forEach((e) => (e.style.display = 'none')); });
const n = await p.evaluate(() => window.__kfb.organ().td.tunnels.length), shots = [];
for (let k = 0; k < n; k++) { if (which && !which.split(',').includes(String(k))) continue;
  for (const [tag, kind] of [['mouth', 0], ['mouthnear', 1], ['inside', 2]]) {
    await p.evaluate(({ k, kind }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, t = td.tunnels[k], S = td.samples, K = 1.46, V = (a) => new T.Vector3(a[0], a[1], a[2]);
      const ext = 25 + 2, i = kind === 2 ? Math.round((t.i0 + t.i1) / 2) : t.i0 - ext, q = S[i], P = V(q.p), Tg = V(q.T), U = V(q.U);
      let cam, look; if (kind === 2) { cam = P.clone().addScaledVector(U, 3).addScaledVector(Tg, -6); look = P.clone().addScaledVector(U, 3).addScaledVector(Tg, 30); }
      else { const d = kind === 0 ? 45 : 18; cam = P.clone().addScaledVector(Tg, -d).addScaledVector(U, kind === 0 ? 9 : 5).addScaledVector(V(q.R), kind === 0 ? 10 : 3); look = P.clone().addScaledVector(U, 5); }
      window.__kfb.camOverride(cam.multiplyScalar(K).toArray(), look.multiplyScalar(K).toArray()); }, { k, kind }); await p.waitForTimeout(1500);
    const f = `${out}/t${k}_${tag}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 88 }); shots.push(f); } }
await b.close(); console.log(shots.join('\n'));
