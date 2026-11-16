// Diagnose G2 (v1.4): FB-Gesicht, lo/hi, v14k und v11, einmal normal und einmal ohne Schattenwurf der Brauen (?noshadow=1). Nur Messung, kein Gate.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
import * as M from './clay-metrics.v1.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const { chromium } = createRequire(path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab/package.json'))('playwright-core');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
function decodePNG(buf) { let p = 8, w, h, idat = []; while (p < buf.length) { const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8); if (type === 'IHDR') { w = buf.readUInt32BE(p + 8); h = buf.readUInt32BE(p + 12); } if (type === 'IDAT') idat.push(buf.subarray(p + 8, p + 8 + len)); p += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)), bpp = 4, stride = w * bpp, out = new Uint8ClampedArray(w * h * 4); let prev = new Uint8Array(stride);
  for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), cur = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) { const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0; let v = row[x]; if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; } cur[x] = v & 255; }
    out.set(cur, y * stride); prev = cur; } return { w, h, data: out }; }
const browser = await chromium.launch({ headless: true, executablePath: process.env.KFB_CHROME, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const rows = [];
try { for (const ns of [0, 2]) for (const variant of ['v14k', 'v11']) for (const [res, w, h] of [['lo', 800, 450], ['hi', 1600, 900]]) {
  const page = await browser.newPage(); await page.goto(`http://127.0.0.1:${server.address().port}/CLAY_SSOT_R1/golden.v1.4.html?${ns === 2 ? 'hidebrow=1' : 'noshadow=0'}`); await page.waitForFunction(() => window.KFB_GOLDEN_READY === true, null, { timeout: 120000 });
  const r = await page.evaluate((c) => window.KFB_GOLDEN.run(c), { variant, w, h, only: ['fb'] }); await page.close();
  const on = r.renders.find((x) => x.key === 'fb_face'), off = r.renders.find((x) => x.key === 'fb_face_flat');
  const A = decodePNG(Buffer.from(on.png.slice(on.png.indexOf(',') + 1), 'base64')), B = decodePNG(Buffer.from(off.png.slice(off.png.indexOf(',') + 1), 'base64'));
  const m = M.stripeMetrics(M.gray(A), M.gray(B), A.w, on.rect); rows.push({ brauen: ns === 2 ? 'ausgeblendet' : 'normal', variant, res, stripePeak: m.stripePeak, coherence: m.coherence }); } }
finally { await browser.close(); server.close(); }
console.table(rows); fs.writeFileSync(path.join(HERE, '../evidence/g2diag.v1.4.json'), JSON.stringify(rows, null, 1));
