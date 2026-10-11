// C1b+C3 · triangle / call breakdown of the game view by group (hide one group at a time, read renderer stats)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const r = await p.evaluate(async () => { const k = window.__kfb, O = k.organ(), W = O.W.world, wait = () => new Promise((r) => setTimeout(r, 400)), st = () => k.stats();
  await wait(); const all = st(), out = { all: { tris: all.tris, calls: all.calls } };
  const groups = { track: [O.track], organs: O.W.built.map((B) => B.root), hub: W.children.filter((g) => g.isGroup && g !== O.track && !O.W.built.some((B) => B.root === g)) };
  for (const [n, gs] of Object.entries(groups)) { gs.forEach((g) => (g.visible = false)); await wait(); const s = st(); out['without_' + n] = { tris: s.tris, calls: s.calls, delta: all.tris - s.tris }; gs.forEach((g) => (g.visible = true)); }
  const figCar = [k.travel().walk.root, k.travel().drive.car]; figCar.forEach((g) => (g.visible = false)); await wait(); const s2 = st(); out.without_fig_car = { tris: s2.tris, delta: all.tris - s2.tris }; figCar.forEach((g) => (g.visible = true));
  return out; });
console.log(JSON.stringify(r, null, 1)); await b.close();
