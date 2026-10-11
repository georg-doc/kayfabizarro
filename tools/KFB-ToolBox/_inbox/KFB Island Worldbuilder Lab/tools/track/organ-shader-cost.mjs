// C1b+C3 · is the frame fill-bound by the clay shader? median frame ms: as built / all world materials swapped for MeshStandardMaterial
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
const R = await p.evaluate(async () => { const k = window.__kfb, T = k.three(), O = k.organ(), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2500); off(); L.sort((a, b) => a - b); return +L[L.length >> 1].toFixed(1); };
  const out = { clay: await med() }; const keep = new Map();
  O.W.world.traverse((m) => { if (m.isMesh) { keep.set(m, m.material); const c = (Array.isArray(m.material) ? m.material[0] : m.material).color; m.material = new T.MeshStandardMaterial({ color: c ? c.clone() : 0xcccccc, vertexColors: !!m.geometry.attributes.color }); } });
  await sleep(800); out.plainStandard = await med(); keep.forEach((mat, m) => (m.material = mat)); await sleep(500); out.clayAgain = await med(); return out; });
console.log(JSON.stringify(R)); await b.close();
