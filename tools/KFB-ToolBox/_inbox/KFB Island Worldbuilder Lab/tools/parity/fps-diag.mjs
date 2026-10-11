import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const [name, url] of [['hub', 'http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0'], ['game', 'http://127.0.0.1:5192/?play=game&almanac=0&dynres=0&sound=0']]) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(url); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 }); await p.waitForTimeout(2500);
  const meas = async (label) => { await p.evaluate(() => { window.__fl = []; let last = performance.now(); window.__kfb.onFrame(() => { const n = performance.now(); window.__fl.push(n - last); last = n; }); }); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const a = window.__fl.slice(2).sort((x, y) => x - y); const i = window.__kfb.renderer?.()?.info?.render; return { n: a.length, med: +a[Math.floor(a.length / 2)].toFixed(1), p90: +a[Math.floor(a.length * 0.9)].toFixed(1), max: +a[a.length - 1].toFixed(1) }; }); console.log(name, label, JSON.stringify(r)); };
  await meas('stand'); await p.keyboard.down('KeyW'); await p.waitForTimeout(300); await meas('run'); await p.keyboard.up('KeyW');
  await p.close();
}
await b.close();
