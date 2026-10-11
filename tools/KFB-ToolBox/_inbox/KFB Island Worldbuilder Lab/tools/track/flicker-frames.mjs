// Flicker per rendered frame (Georg live 11.10.): renderer.render is wrapped in the page; after every render a 240×150 grid of the drawing buffer is
// read (gl.readPixels per row band) and compared with the previous frame: share of grid points whose luma changes by > 12/255, mean |Δ|.
// Figure standing, camera at rest, DPR 2 (Georg's Mac). node tools/track/flicker-frames.mjs <out.json> [query] [frames=180]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = '', nArg = '180'] = process.argv.slice(2), N = +nArg;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&hud=0' + (q ? '&' + q : '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 });
await p.waitForTimeout(6000);
const R = await p.evaluate((N) => new Promise((res) => { const r = window.__kfb.renderer(), gl = r.getContext(), orig = r.render.bind(r), GX = 240, GY = 150; let prev = null; const rows = []; const t0 = performance.now();
  r.render = (s, c) => { orig(s, c); if (rows.length >= N) return; const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4), cur = new Float32Array(GX * GY);
    for (let j = 0; j < GY; j++) { const y = Math.floor((j + 0.5) * h / GY), line = new Uint8Array(w * 4); gl.readPixels(0, y, w, 1, gl.RGBA, gl.UNSIGNED_BYTE, line); for (let i = 0; i < GX; i++) { const x = Math.floor((i + 0.5) * w / GX) * 4; cur[j * GX + i] = 0.299 * line[x] + 0.587 * line[x + 1] + 0.114 * line[x + 2]; } }
    if (prev) { let n = 0, s2 = 0; for (let k = 0; k < cur.length; k++) { const d = Math.abs(cur[k] - prev[k]); s2 += d; if (d > 12) n++; } rows.push({ t: Math.round(performance.now() - t0), changed: +(100 * n / cur.length).toFixed(2), mean: +(s2 / cur.length).toFixed(3), w, h }); }
    prev = cur; if (rows.length >= N) { r.render = orig; res(rows); } }; }), N);
const ch = R.map((x) => x.changed), sizes = [...new Set(R.map((x) => x.w + 'x' + x.h))], spikes = R.filter((x) => x.changed > 1);
const out2 = { at: new Date().toISOString(), q, frames: R.length, fps: +(1000 * R.length / (R.at(-1).t - R[0].t)).toFixed(1), sizes, meanChanged: +(ch.reduce((a, c) => a + c, 0) / ch.length).toFixed(3), maxChanged: Math.max(...ch), spikes: spikes.length, spikeTimes: spikes.slice(0, 30).map((x) => [x.t, x.changed]), rows: R };
fs.writeFileSync(out, JSON.stringify(out2, null, 1)); console.log(JSON.stringify((({ rows, ...o }) => o)(out2)));
await b.close();
