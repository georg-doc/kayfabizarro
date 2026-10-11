// V-115 performance bar: median frame ms in a VISIBLE window (1600×1000, pixel ratio 1) for 3 cameras (near = game camera at the spawn,
// mid = Herz at 450 lab, overview = the ring), per URL variant. node tools/track/perf3.mjs <out.json> "<name>=<query>" ...
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, ...vars] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const R = { at: new Date().toISOString(), viewport: [1600, 1000], mode: 'headful', runs: {} };
for (const v of vars.length ? vars : ['default=']) { const name = v.slice(0, v.indexOf('=')), q = v.slice(v.indexOf('=') + 1);
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&${q}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
  const cams = await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), herz = O.W.built.find((B) => B.id === 'herz'), c = herz.I.Cw.clone().multiplyScalar(1.46), hub = O.hubCentre, dir = c.clone().sub(hub).setY(0).normalize();
    return { near: null, mid: { p: c.clone().addScaledVector(dir, -450).add(new T.Vector3(0, 160, 0)).toArray(), t: c.toArray() }, overview: { p: [hub.x * 0.2 - 3400, 2600, 3400], t: [0, 150, 0] } }; });
  const med = () => p.evaluate(async () => { const k = window.__kfb, L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await new Promise((r) => setTimeout(r, 3000)); off(); L.sort((a, c) => a - c); return { med: +L[L.length >> 1].toFixed(1), p90: +L[Math.floor(L.length * 0.9)].toFixed(1) }; });
  const r = {}; for (const [k, c] of Object.entries(cams)) { await p.evaluate((c) => window.__kfb.camOverride(c ? c.p : null, c ? c.t : undefined), c); await p.waitForTimeout(2500); const m = await med(), st = await p.evaluate(() => window.__kfb.stats()); r[k] = { ms: m.med, p90: m.p90, fps: +(1000 / m.med).toFixed(1), tris: st.tris, calls: st.calls }; console.log(name, k, JSON.stringify(r[k])); }
  R.runs[name] = { query: q, ...r }; await p.close(); }
fs.writeFileSync(out, JSON.stringify(R, null, 1)); await b.close();
