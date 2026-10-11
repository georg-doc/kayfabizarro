// V-116 close stills where levelSet and Surface Nets differ most (clusters from organ-ls-far.mjs), SN vs LS, same camera, tier pinned.
// node tools/track/organ-ls-close.mjs <far.json> <outDir> [lsK]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [farF, out, lsK] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const far = JSON.parse(fs.readFileSync(farF, 'utf8')), spots = [];
for (const s of far) for (const [tier, t] of Object.entries(s.tiers)) for (const [dir, L] of [['ls', t.farLS], ['sn', t.farSN]]) if (L[0] && L[0].max > 1) spots.push({ id: s.id, tier, dir, at: L[0].world, max: L[0].max });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const shots = [];
for (const tier of [...new Set(spots.map((x) => x.tier))]) for (const m of ['sn', 'ls']) {
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=${tier}&mesher=${m}${lsK ? '&lsK=' + lsK : ''}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
  await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
  for (const [i, s] of spots.entries()) { if (s.tier !== tier) continue;
    await p.evaluate(({ s }) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === s.id), c = B.I.Cw.clone().multiplyScalar(1.46), a = new T.Vector3(...s.at);
      const dir = a.clone().sub(c).normalize(); window.__kfb.camOverride(a.clone().addScaledVector(dir, 60).add(new T.Vector3(0, 15, 0)).toArray(), a.toArray()); }, { s }); await p.waitForTimeout(1500);
    const f = `${out}/${String(i).padStart(2, '0')}_${s.id}_${tier}_far${s.dir}_${m}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 90 }); shots.push(f); }
  await p.close();
}
await b.close(); fs.writeFileSync(`${out}/spots.json`, JSON.stringify(spots, null, 1)); console.log(shots.join('\n'));
