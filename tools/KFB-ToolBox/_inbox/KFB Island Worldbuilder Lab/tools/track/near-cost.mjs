// V-115 near camera cost: median frame ms with each top-level scene child switched off in turn (+ world off, + HUD hidden). Visible window.
import { chromium } from 'playwright-core';
const q = process.argv[2] ?? '';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&' + q); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const R = await p.evaluate(async () => { const k = window.__kfb, O = k.organ(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)); let sc = O.W.world; while (sc.parent) sc = sc.parent;
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2000); off(); L.sort((a, b) => a - b); return +L[L.length >> 1].toFixed(1); };
  const out = { all: await med(), pr: k.renderer().getPixelRatio(), size: [k.renderer().domElement.width, k.renderer().domElement.height], children: [] };
  for (const c of sc.children) { if (!c.visible) continue; c.visible = false; await sleep(250); out.children.push([c.name || c.type, await med()]); c.visible = true; }
  const huds = [...document.body.children].filter((e) => e.tagName !== 'CANVAS' && e.tagName !== 'SCRIPT'); huds.forEach((e) => (e.style.display = 'none')); await sleep(300); out.noDom = await med(); huds.forEach((e) => (e.style.display = ''));
  return out; });
console.log(JSON.stringify(R)); await b.close();
