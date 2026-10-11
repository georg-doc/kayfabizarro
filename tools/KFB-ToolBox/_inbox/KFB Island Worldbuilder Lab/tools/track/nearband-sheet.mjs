// V-053 near band (Steuerung decision b, measured before it becomes default): organ world, 3 cameras (near: game camera on the hub road ·
// mid: an organ at ≈ 450 lab · overview: the ring), each with clay v10 (?nearband=0) and the near band (?nearband=1): stills + frame ms
// in a VISIBLE window (1600×1000, pixel ratio 1). node tools/track/nearband-sheet.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const R = {};
for (const nb of [0, 1]) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&nearband=${nb}`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
  await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });   // stills: no editor panel (hud=0)
  const cams = await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), herz = O.W.built.find((B) => B.id === 'herz'), c = herz.I.Cw.clone().multiplyScalar(1.46), hub = O.hubCentre;
    const dir = c.clone().sub(hub).setY(0).normalize();
    return { near: null, mid: { p: c.clone().addScaledVector(dir, -450).add(new T.Vector3(0, 160, 0)).toArray(), t: c.toArray() }, overview: { p: [hub.x * 0.2 - 3400, 2600, 3400], t: [0, 150, 0] } }; });
  const med = () => p.evaluate(async () => { const k = window.__kfb, L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await new Promise((r) => setTimeout(r, 3000)); off(); L.sort((a, c) => a - c); return +L[L.length >> 1].toFixed(1); });
  for (const [k, c] of Object.entries(cams)) {
    await p.evaluate((c) => window.__kfb.camOverride(c ? c.p : null, c ? c.t : undefined), c); await p.waitForTimeout(2500);
    const ms = await med(); (R[k] ||= {})[nb ? 'nearband' : 'v10'] = { ms, fps: +(1000 / ms).toFixed(1), tris: (await p.evaluate(() => window.__kfb.stats().tris)) };
    await p.screenshot({ path: `${out}/${k}_${nb ? 'nearband' : 'v10'}.jpg`, type: 'jpeg', quality: 90 });
    console.log(k, nb, ms);
  }
  await p.close();
}
// v10 vs near band: mean |Δ| (0–255) and share of pixels with Δ > 12, per camera
{ const p = await b.newPage();
  for (const k of Object.keys(R)) R[k].diff = await p.evaluate(async ({ a, c }) => { const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/jpeg;base64,' + s; });
    const [A, B] = await Promise.all([ld(a), ld(c)]), cv = document.createElement('canvas'); cv.width = A.width; cv.height = A.height; const g = cv.getContext('2d');
    g.drawImage(A, 0, 0); const x = g.getImageData(0, 0, A.width, A.height).data; g.drawImage(B, 0, 0); const y = g.getImageData(0, 0, A.width, A.height).data;
    let s = 0, big = 0; for (let i = 0; i < x.length; i += 4) { const d = (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])) / 3; s += d; if (d > 12) big++; }
    return { meanAbs: +(s / (x.length / 4)).toFixed(2), over12: +(big / (x.length / 4)).toFixed(4) }; }, { a: fs.readFileSync(`${out}/${k}_v10.jpg`).toString('base64'), c: fs.readFileSync(`${out}/${k}_nearband.jpg`).toString('base64') });
  await p.close(); }
fs.writeFileSync(`${out}/nearband.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
await b.close();
