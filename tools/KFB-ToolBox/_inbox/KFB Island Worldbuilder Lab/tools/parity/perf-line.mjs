// Leistungszeile (Steuerung 11.10., C1a): fps median hub + game in a VISIBLE browser window (headless: false), standing 3 s and
// running 3 s, plus triangles / draw calls from __kfb.stats(). node tools/parity/perf-line.mjs <out.json> [hub,organ,organ_nofog,game] (organ_nofog = ?fogSample=0, A/B for the fog horizon sampling)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const R = { at: new Date().toISOString(), viewport: [1600, 1000], mode: 'headful' };
const WORLDS = { hub: 'http://127.0.0.1:5192/?rkit=1&hub=1&play=travel&island=rkit_hub&road=0&spawnOff=4&sound=0&almanac=0&dynres=0', organ: 'http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0', organ_nofog: 'http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&fogSample=0', organ_dyn: 'http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0', game_dyn: 'http://127.0.0.1:5192/?play=game&almanac=0&sound=0', game: 'http://127.0.0.1:5192/?play=game&almanac=0&dynres=0&sound=0' };
for (const [name, url] of Object.entries(WORLDS).filter(([n]) => !process.argv[3] || process.argv[3].split(',').includes(n))) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(url); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
  const meas = async () => { await p.evaluate(() => { window.__fl = []; let last = performance.now(); window.__fo = window.__kfb.onFrame(() => { const n = performance.now(); window.__fl.push(n - last); last = n; }); }); await p.waitForTimeout(3000);
    return p.evaluate(() => { window.__fo(); const a = window.__fl.slice(2).sort((x, y) => x - y), med = a[Math.floor(a.length / 2)]; return { frames: a.length, medMs: +med.toFixed(1), fpsMed: +(1000 / med).toFixed(1), p90Ms: +a[Math.floor(a.length * 0.9)].toFixed(1) }; }); };
  const stand = await meas(); await p.keyboard.down('KeyW'); await p.waitForTimeout(300); const run = await meas(); await p.keyboard.up('KeyW');
  const st = await p.evaluate(() => window.__kfb.stats());
  const fog = await p.evaluate(() => { const s = window.__kfb.sky?.(); return s ? { hook: s.fogHook, sampleMs: s.fogSampleMs } : null; });   // fog horizon sampling (2 Hz dome render + readback): cost per sample
  R[name] = { stand, run, tris: st.tris, calls: st.calls, pixelRatio: st.pixelRatio, shadowMap: st.shadowMap, fog };
  console.log(name, JSON.stringify(R[name]));
  await p.close();
}
fs.writeFileSync(out, JSON.stringify(R, null, 1));
await b.close();
