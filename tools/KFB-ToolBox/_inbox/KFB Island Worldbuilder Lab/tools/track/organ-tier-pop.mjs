// C1b+C3 lever 2 · Hero ↔ Light at the switch distances (350 in / 420 out lab from the Herz centre): same camera, tier forced, stills +
// mean |Δ|; plus the mid camera (450 lab) frame ms after the change. Visible window. node tools/track/organ-tier-pop.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
const R = {};
const camAt = (d) => p.evaluate((d) => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === 'herz'), c = B.I.Cw.clone().multiplyScalar(1.46), dir = c.clone().sub(O.hubCentre).setY(0).normalize();
  const pos = c.clone().addScaledVector(dir, -d).add(new T.Vector3(0, d * 0.35, 0)); window.__kfb.camOverride(pos.toArray(), c.toArray()); return pos.distanceTo(c); }, d);
const force = (tier) => p.evaluate((tier) => { const B = window.__kfb.organ().W.built.find((x) => x.id === 'herz'); for (const [k, T] of Object.entries(B.tiers)) T.g.visible = k === tier; window.__hold = setInterval(() => { for (const [k, T] of Object.entries(B.tiers)) T.g.visible = k === tier; }, 16); }, tier);
const release = () => p.evaluate(() => clearInterval(window.__hold));
const med = () => p.evaluate(async () => { const k = window.__kfb, L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await new Promise((r) => setTimeout(r, 2500)); off(); L.sort((a, c) => a - c); return +L[L.length >> 1].toFixed(1); });
for (const d of [350, 420]) { R[d] = { camDist: await camAt(d) };
  for (const tier of ['hero', 'light']) { await force(tier); await p.waitForTimeout(1200); await p.screenshot({ path: `${out}/pop_${d}_${tier}.jpg`, type: 'jpeg', quality: 92 }); R[d][tier + 'Ms'] = await med(); await release(); } }
await camAt(450); await p.waitForTimeout(2000); R.mid450 = { tier: await p.evaluate(() => window.__kfb.organ().tierAt('herz')), ms: await med(), tris: await p.evaluate(() => window.__kfb.stats().tris) };
await p.screenshot({ path: `${out}/mid450_auto.jpg`, type: 'jpeg', quality: 90 });
const q = await b.newPage();
for (const d of [350, 420]) R[d].diff = await q.evaluate(async ({ a, c }) => { const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/jpeg;base64,' + s; });
  const [A, B] = await Promise.all([ld(a), ld(c)]), cv = document.createElement('canvas'); cv.width = A.width; cv.height = A.height; const g = cv.getContext('2d');
  g.drawImage(A, 0, 0); const x = g.getImageData(0, 0, A.width, A.height).data; g.drawImage(B, 0, 0); const y = g.getImageData(0, 0, A.width, A.height).data;
  let s = 0, big = 0; for (let i = 0; i < x.length; i += 4) { const dd = (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])) / 3; s += dd; if (dd > 12) big++; }
  return { meanAbs: +(s / (x.length / 4)).toFixed(2), over12: +(big / (x.length / 4)).toFixed(4) }; }, { a: fs.readFileSync(`${out}/pop_${d}_hero.jpg`).toString('base64'), c: fs.readFileSync(`${out}/pop_${d}_light.jpg`).toString('base64') });
fs.writeFileSync(`${out}/tier-pop.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R)); await b.close();
