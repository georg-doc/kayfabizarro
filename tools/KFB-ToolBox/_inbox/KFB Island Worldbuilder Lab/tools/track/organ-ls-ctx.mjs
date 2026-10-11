import { chromium } from 'playwright-core';
const [out, extra = ''] = process.argv.slice(2), at = [-1832, 155, 1450];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const m of extra ? ['ls'] : ['sn', 'ls']) {
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=light&mesher=${m}&lsK=1.0&lsTol=0.25${extra}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500); await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.wb-panel,#wb').forEach((e) => (e.style.display = 'none')); });
  const info = await p.evaluate((at) => { const O = window.__kfb.organ(), T = window.__kfb.three(), a = new T.Vector3(...at); const tl = O.W.tunLights.map((l) => l.position.clone().multiplyScalar(1.46).distanceTo(a)).sort((x, y) => x - y).slice(0, 3);
    const td = O.td, near = td.samples.map((s, i) => [i, new T.Vector3(...s.p).multiplyScalar(1.46).distanceTo(a)]).sort((x, y) => x[1] - y[1])[0];
    const B = O.W.built.find((x) => x.id === 'herz'), c = B.I.Cw.clone().multiplyScalar(1.46), dir = a.clone().sub(c).normalize();
    window.__kfb.camOverride(a.clone().addScaledVector(dir, 250).add(new T.Vector3(0, 60, 0)).toArray(), a.toArray()); return { tunLightDist: tl.map((x) => +x.toFixed(1)), nearestTrack: near.map((x) => +x.toFixed(1)), tunnelAt: td.tunnels?.length }; }, at);
  console.log(m, JSON.stringify(info)); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/ctx_${m}${extra.replace(/[&=]/g, '_')}.jpg`, type: 'jpeg', quality: 88 }); await p.close();
}
await b.close();
