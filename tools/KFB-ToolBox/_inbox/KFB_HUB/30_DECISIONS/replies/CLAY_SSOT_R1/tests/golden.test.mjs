// KFB Clay v1 · golden regression (headless Chrome via playwright-core from the Lab node_modules, read only).
// Run from CLAY_SSOT_R1:  node tests/golden.test.mjs            (full: 2 loads x 4 variants x 2 resolutions)
//                         node tests/golden.test.mjs --smoke    (v1, low res, FrizzleBob only)
// Starts its OWN static server on an ephemeral port (never 5180/5192, never 8765) with root = replies/, closes it at the end.
// Pass conditions (set before the first run, see RETURN.md):
//   G1 determinism   SSIM(load 1, load 2) >= 0.995 for every v1 render at both resolutions
//   G0 metric        the stripe metric separates synthetic cases: lit isotropic noise and lit craters pass, the same with a faint stripe patch fails
//   G2 no stripes    face relief (relief on - relief off): stripePeak (FFT orientation spike over the cos² light shape) <= 3.0 and
//                    structure-tensor coherence <= 0.70, all figures, both res. (First draft 0.45 / raw FFT 1.6 ignored that a lit relief
//                    is a directional derivative; recalibrated on the synthetic G0 cases, see RETURN.md.)
//   G3 scale         FrizzleBob face at stage scale x1 vs x2.5: SSIM >= 0.98
//   G4 resolution    SSIM(down2(1600x900), 800x450) for v1 >= the same value for the unclayed figure - 0.01
//   G5 colour        V-346: mean OKLab chroma in the figure mask, v1 / original >= 0.95
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as M from './clay-metrics.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), DIR = path.resolve(HERE, '..'), ROOT = path.resolve(DIR, '..'), EVD = path.join(DIR, 'evidence');
const LAB = path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const { chromium } = createRequire(path.join(LAB, 'package.json'))('playwright-core');
const SMOKE = process.argv.includes('--smoke');
fs.mkdirSync(EVD, { recursive: true });

/* ---------- static server (own process-local, closed at the end) ---------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname), f = path.join(ROOT, u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) throw new Error('port collision ' + PORT);
const BASE = `http://127.0.0.1:${PORT}/CLAY_SSOT_R1/golden.html`;

/* ---------- PNG decode / encode ---------- */
function decodePNG(buf) {
  let p = 8, w = 0, h = 0, ct = 0; const idat = [];
  while (p < buf.length) { const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len); if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8 || d[12]) throw new Error('png: 8 bit, no interlace only'); } else if (type === 'IDAT') idat.push(d); p += 12 + len; }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : 0; if (!bpp) throw new Error('png colour type ' + ct);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp, out = new Uint8ClampedArray(w * h * 4), cur = Buffer.alloc(stride), prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) { const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0; let v = row[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; } cur[x] = v & 255; }
    for (let x = 0; x < w; x++) { out[(y * w + x) * 4] = cur[x * bpp]; out[(y * w + x) * 4 + 1] = cur[x * bpp + 1]; out[(y * w + x) * 4 + 2] = cur[x * bpp + 2]; out[(y * w + x) * 4 + 3] = bpp === 4 ? cur[x * bpp + 3] : 255; }
    cur.copy(prev); }
  return { w, h, data: out };
}
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function encodePNG(img) {
  const raw = Buffer.alloc((img.w * 4 + 1) * img.h); for (let y = 0; y < img.h; y++) { raw[y * (img.w * 4 + 1)] = 0; Buffer.from(img.data.buffer, img.data.byteOffset + y * img.w * 4, img.w * 4).copy(raw, y * (img.w * 4 + 1) + 1); }
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(img.w, 0); ih.writeUInt32BE(img.h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const fromDataURL = (u) => Buffer.from(u.slice(u.indexOf(',') + 1), 'base64');
function cropImg(img, [x0, y0, w, h]) { const o = new Uint8ClampedArray(w * h * 4); for (let y = 0; y < h; y++) o.set(img.data.subarray(((y0 + y) * img.w + x0) * 4, ((y0 + y) * img.w + x0 + w) * 4), y * w * 4); return { w, h, data: o }; }
function reliefViz(on, off, rect, gain = 6) { const a = cropImg(on, rect), b = cropImg(off, rect), o = new Uint8ClampedArray(a.data.length);
  for (let i = 0; i < a.data.length; i += 4) { const d = ((a.data[i] - b.data[i]) * 0.2126 + (a.data[i + 1] - b.data[i + 1]) * 0.7152 + (a.data[i + 2] - b.data[i + 2]) * 0.0722) * gain; o[i] = o[i + 1] = o[i + 2] = Math.max(0, Math.min(255, 128 + d)); o[i + 3] = 255; } return { w: a.w, h: a.h, data: o }; }

/* ---------- run ---------- */
const RES = SMOKE ? { lo: [800, 450] } : { lo: [800, 450], hi: [1600, 900] };
const VARIANTS = SMOKE ? ['v1'] : ['v1', 'none', 'v8ws1', 'v8proof'];
const LOADS = SMOKE ? [1] : [1, 2];
const browser = await chromium.launch({ headless: true, channel: process.env.KFB_CHROME ? undefined : 'chrome', executablePath: process.env.KFB_CHROME || undefined, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const R = {}; let gpu = null; const errors = [];
const t0 = Date.now();
try {
  for (const L of LOADS) for (const variant of VARIANTS) for (const [res, [w, h]] of Object.entries(RES)) {
    const page = await browser.newPage({ viewport: { width: 900, height: 500 } });
    page.on('pageerror', (e) => errors.push(`${variant}/${res}/L${L}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' || /THREE\.WebGLProgram|shader/i.test(m.text())) errors.push(`${variant}/${res}/L${L} console: ${m.text().slice(0, 400)}`); });
    await page.goto(`${BASE}?load=${L}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.KFB_GOLDEN_READY === true, null, { timeout: 120000 });
    const r = await page.evaluate((cfg) => window.KFB_GOLDEN.run(cfg), { variant, w, h, bust: `L${L}`, only: SMOKE ? ['fb', 'scale'] : null });
    gpu = r.info.gpu;
    for (const x of r.renders) { const img = decodePNG(fromDataURL(x.png)); ((R[L] ??= {})[variant] ??= {})[res] ??= {}; R[L][variant][res][x.key] = { img, rect: x.rect, png: x.png }; }
    console.log(`L${L} ${variant} ${res} ${w}x${h}: ${r.renders.length} renders, ${r.info.ms} ms` + (variant === 'v1' && res === 'lo' ? '  k=' + JSON.stringify(Object.fromEntries(Object.entries(r.info).filter(([, v]) => v && v.k).map(([k, v]) => [k, [v.scaleRef, v.k.slice(0, 3)]]))) : ''));
    await page.close();
  }
} finally { await browser.close(); server.close(); }
if (errors.length) { console.log('\nERRORS:\n' + errors.slice(0, 20).join('\n')); }

/* ---------- evidence ---------- */
const save = (name, buf) => fs.writeFileSync(path.join(EVD, name), buf);
const L1 = R[1];
for (const [res] of Object.entries(RES)) for (const [key, v] of Object.entries(L1.v1[res])) if (!key.endsWith('_flat')) save(`v1_${res}_${key}.png`, fromDataURL(v.png));
if (!SMOKE) for (const variant of ['none', 'v8ws1', 'v8proof']) for (const key of ['fb_face', 'goth_face', 'hunky_face', 'fb_full', 'fb_face_x2.5']) { const v = L1[variant].lo[key]; if (v) save(`${variant}_lo_${key}.png`, fromDataURL(v.png)); }

/* ---------- metrics ---------- */
const out = { gpu, three: 'r180 (CDN)', resolutions: RES, ms: Date.now() - t0, errors: errors.length, tests: {} };
const T = out.tests; const pf = (b) => (b ? 'PASS' : 'FAIL');
const LIM = { stripePeak: 3.0, coherence: 0.70 }, okStripe = (m) => m.stripePeak <= LIM.stripePeak && m.coherence <= LIM.coherence;
{ const st = M.stripeSelfTest(); T.G0 = { rule: 'synthetic: isotropic + craters pass, + faint stripes fail', limits: LIM, ...st, result: pf(okStripe(st.isotropic) && okStripe(st.craters) && !okStripe(st.isotropicPlusStripes) && !okStripe(st.cratersPlusStripes)) }; }
const figs = SMOKE ? ['fb'] : ['fb', 'goth', 'hunky'];
// G1 determinism
if (!SMOKE) {
  T.G1 = { rule: 'SSIM(load1,load2) >= 0.995, every v1 render, both resolutions', rows: [], other: {} };
  for (const res of Object.keys(RES)) for (const key of Object.keys(R[1].v1[res])) {
    const a = R[1].v1[res][key].img, b = R[2].v1[res][key].img, s = M.ssim(M.gray(a), M.gray(b), a.w, a.h), d = M.rgbaDiff(a, b);
    T.G1.rows.push({ res, key, ssim: +s.toFixed(5), maxDiff: d.max, changedPct: +d.pct.toFixed(4) });
  }
  for (const variant of ['none', 'v8ws1', 'v8proof']) { let mn = 1, mx = 0; for (const res of Object.keys(RES)) for (const key of Object.keys(R[1][variant][res])) { const a = R[1][variant][res][key].img, b = R[2][variant][res][key].img; mn = Math.min(mn, M.ssim(M.gray(a), M.gray(b), a.w, a.h)); mx = Math.max(mx, M.rgbaDiff(a, b).max); } T.G1.other[variant] = { minSsim: +mn.toFixed(5), maxDiff: mx }; }
  T.G1.minSsim = Math.min(...T.G1.rows.map((r) => r.ssim)); T.G1.maxDiff = Math.max(...T.G1.rows.map((r) => r.maxDiff)); T.G1.result = pf(T.G1.minSsim >= 0.995);
}
// G2 stripes
T.G2 = { rule: 'face relief: stripePeak <= 3.0 and coherence <= 0.70 (v1, all figures, both resolutions)', rows: [] };
for (const variant of SMOKE ? ['v1'] : ['v1', 'v8ws1', 'v8proof']) for (const res of Object.keys(RES)) for (const f of figs) {
  const on = R[1][variant][res][`${f}_face`], off = R[1][variant][res][`${f}_face_flat`]; if (!on || !off) continue;
  const m = M.stripeMetrics(M.gray(on.img), M.gray(off.img), on.img.w, on.rect);
  T.G2.rows.push({ variant, res, fig: f, ...m });
  if (res === 'lo') save(`relief_${variant}_${f}_face.png`, encodePNG(reliefViz(on.img, off.img, on.rect)));
}
const g2v1 = T.G2.rows.filter((r) => r.variant === 'v1');
T.G2.result = pf(g2v1.length > 0 && g2v1.every(okStripe));
// G3 scale invariance
T.G3 = { rule: 'FrizzleBob face, stage scale x1 vs x2.5: SSIM >= 0.98 (v1)', rows: [] };
for (const variant of SMOKE ? ['v1'] : ['v1', 'none', 'v8ws1', 'v8proof']) for (const res of Object.keys(RES)) {
  const a = R[1][variant][res].fb_face?.img, b = R[1][variant][res]['fb_face_x2.5']?.img; if (!a || !b) continue;
  T.G3.rows.push({ variant, res, ssim: +M.ssim(M.gray(a), M.gray(b), a.w, a.h).toFixed(4) });
}
{ const g3 = T.G3.rows.filter((r) => r.variant === 'v1'); T.G3.result = pf(g3.length > 0 && g3.every((r) => r.ssim >= 0.98)); }
// G4 resolution independence
if (!SMOKE) {
  T.G4 = { rule: 'SSIM(down2(hi), lo) for v1 >= unclayed - 0.01 (faces and full figures)', rows: [] };
  for (const variant of ['v1', 'none', 'v8ws1', 'v8proof']) for (const f of figs) for (const view of ['face', 'full']) {
    const hi = R[1][variant].hi[`${f}_${view}`].img, lo = R[1][variant].lo[`${f}_${view}`].img, d = M.down2(M.gray(hi), hi.w, hi.h);
    T.G4.rows.push({ variant, fig: f, view, ssim: +M.ssim(d.g, M.gray(lo), lo.w, lo.h).toFixed(4) });
  }
  const ref = (f, v) => T.G4.rows.find((r) => r.variant === 'none' && r.fig === f && r.view === v).ssim;
  T.G4.result = pf(T.G4.rows.filter((r) => r.variant === 'v1').every((r) => r.ssim >= ref(r.fig, r.view) - 0.01));
}
// G5 colour (V-346)
if (!SMOKE) {
  T.G5 = { rule: 'OKLab chroma in figure mask, clay / original >= 0.95 (lo res)', rows: [] };
  for (const variant of ['v1', 'v8ws1', 'v8proof']) for (const f of figs) for (const view of ['full', 'face']) {
    const mask = R[1].none.lo[`${f}_${view}_mask`].img, o = M.colourStats(R[1].none.lo[`${f}_${view}`].img, mask), c = M.colourStats(R[1][variant].lo[`${f}_${view}`].img, mask);
    T.G5.rows.push({ variant, fig: f, view, chromaRatio: +(c.chroma / o.chroma).toFixed(3), lightRatio: +(c.L / o.L).toFixed(3) });
  }
  T.G5.result = pf(T.G5.rows.filter((r) => r.variant === 'v1').every((r) => r.chromaRatio >= 0.95));
}
fs.writeFileSync(path.join(EVD, SMOKE ? 'golden_smoke.json' : 'golden_results.json'), JSON.stringify(out, null, 1));
console.log('\nGPU:', gpu);
for (const [k, t] of Object.entries(T)) console.log(`${k} ${t.result}  ${t.rule}`);
if (T.G1) console.log('G1 min SSIM', T.G1.minSsim, 'max px diff', T.G1.maxDiff, 'others', JSON.stringify(T.G1.other));
console.table(T.G2.rows); console.table(T.G3.rows); if (T.G4) console.table(T.G4.rows); if (T.G5) console.table(T.G5.rows);
process.exitCode = Object.values(T).every((t) => t.result === 'PASS') && !errors.length ? 0 : 1;
