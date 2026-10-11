// V-115: near camera — frame ms with point lights hidden, and with the key light's shadow off (visible window)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&' + (process.argv[2] ?? '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const R = await p.evaluate(async () => { const k = window.__kfb, O = k.organ(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)); let sc = O.W.world; while (sc.parent) sc = sc.parent;
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2500); off(); L.sort((a, b) => a - b); return +L[L.length >> 1].toFixed(1); };
  const pts = [], dirs = []; sc.traverse((o) => { if (o.isPointLight && o.visible) pts.push(o); if (o.isDirectionalLight && o.castShadow) dirs.push(o); });
  const out = { all: await med(), points: pts.length }; pts.forEach((l) => (l.visible = false)); await sleep(400); out.noPoints = await med(); pts.forEach((l) => (l.visible = true));
  dirs.forEach((l) => (l.castShadow = false)); await sleep(400); out.noShadow = await med(); dirs.forEach((l) => (l.castShadow = true));
  out.all2 = await med(); return out; });
console.log(JSON.stringify(R)); await b.close();
