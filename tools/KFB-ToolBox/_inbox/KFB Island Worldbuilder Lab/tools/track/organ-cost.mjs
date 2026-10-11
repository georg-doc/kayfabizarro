// C1b+C3 · frame-time breakdown (visible window): median frame ms with one part switched off at a time, plus JS time per frame
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: process.env.HEADFUL ? false : true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const R = await p.evaluate(async () => { const k = window.__kfb, O = k.organ(), W = O.W.world, sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2000); off(); L.sort((a, b) => a - b); return +L[L.length >> 1].toFixed(1); };
  const scene = k.travel().walk.root.parent, key = scene.getObjectByName('kfb:light')?.children.find((c) => c.isDirectionalLight && c.castShadow);
  const out = { all: await med() };
  const tog = async (name, objs) => { objs.forEach((o) => (o.visible = false)); await sleep(300); out['off_' + name] = await med(); objs.forEach((o) => (o.visible = true)); };
  await tog('track', [O.track]); await tog('organs', O.W.built.map((B) => B.root)); await tog('hub', W.children.filter((g) => g.isGroup && g !== O.track && !O.W.built.some((B) => B.root === g)));
  await tog('world', [W]);
  if (key) { key.castShadow = false; await sleep(300); out.off_shadow = await med(); key.castShadow = true; }
  // JS time inside one rAF tick (loop work), sampled
  const js = []; const t0 = () => { const a = performance.now(); requestAnimationFrame(() => {}); return a; };
  return out; });
console.log(JSON.stringify(R)); await b.close();
