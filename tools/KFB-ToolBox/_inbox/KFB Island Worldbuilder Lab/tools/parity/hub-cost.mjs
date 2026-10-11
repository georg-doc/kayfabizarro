// hub render cost snapshot: draw calls, triangles, programs, lights (visible / casting), pixel ratio, canvas size
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const [name, url] of [['hub', 'http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0'], ['game', 'http://127.0.0.1:5192/?play=game&almanac=0&dynres=0&sound=0']]) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(url); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 }); await p.waitForTimeout(2500);
  console.log(name, JSON.stringify(await p.evaluate(() => { const k = window.__kfb, sc = k.travel().walk.root.parent, st = k.stats(); const L = []; sc?.traverse((o) => { if (o.isLight) L.push({ t: o.type, vis: o.visible, i: +o.intensity.toFixed(2), cast: !!o.castShadow, name: o.name }); });
    return { lights: L.filter((l) => l.vis).length, lightsList: L.filter((l) => l.vis).map((l) => l.t[0] + (l.cast ? '*' : '') + l.i).join(' '), stats: st }; })));
  await p.close();
}
await b.close();
