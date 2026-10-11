// C1b+C3 · frame cost of the sky parts in the organ world (visible window): god rays / aurora / stars / dome off one at a time
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.() && window.__kfb.skyOwner?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(async () => { const k = window.__kfb, h = k.skyOwner().host, sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2500); off(); L.sort((a, b) => a - b); return +L[L.length >> 1].toFixed(1); };
  const out = { all: await med(), radius: k.sky().radius, kAtm: h.kAtm };
  for (const [n, g] of [['rays', h.rays.group], ['aurora', h.aurora.group], ['stars', h.stars.group], ['dome', h.shell?.dome?.group]]) { if (!g) continue; const v = g.visible; g.visible = false; await sleep(300); out['off_' + n] = await med(); g.visible = v; }
  const fog = k.organ().W.world.parent.fog; out.fog = fog ? { near: fog.near, far: fog.far } : null; return out; })));
await b.close();
