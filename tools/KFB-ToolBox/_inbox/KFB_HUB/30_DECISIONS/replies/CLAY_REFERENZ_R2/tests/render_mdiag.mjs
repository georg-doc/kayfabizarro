// CLAY_REFERENZ_R2 · rendert das Stilbild „Claybound | v1.1 | v1.3“ headless. Eigener statischer Server (root = replies/), am Ende geschlossen.
// /private/ = ~/kfb-ws0/stamm-wt/src/private (FB-Web-Kanon), /place/ = ~/kfb-ws0/stamm-wt/src/assets/place (Fels); beides nur gelesen.
// Aufruf (aus CLAY_REFERENZ_R2):  KFB_CHROME=<chrome-headless-shell> node tests/render.mjs [--tag r1]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), DIR = path.resolve(HERE, '..'), ROOT = path.resolve(DIR, '..'), EVD = path.join(DIR, 'evidence');
const LAB = path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const { chromium } = createRequire(path.join(LAB, 'package.json'))('playwright-core');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TAG = arg('--tag') || 'r1';
fs.mkdirSync(EVD, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg' };
const STAMM = path.join(process.env.HOME, 'kfb-ws0/stamm-wt/src');
const MOUNTS = [['/tex/', '/private/tmp/claude-501/-Users-georgv-westphalen--claude-spares-spare-FK2Xc1/ed1049d0-5c7d-4029-b810-c6f206b64faf/scratchpad/tex'], ['/private/', path.join(STAMM, 'private')], ['/place/', path.join(STAMM, 'assets/place')]];
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname); let base = ROOT, rel = u;
  for (const [p, dir] of MOUNTS) if (u.startsWith(p)) { base = dir; rel = u.slice(p.length - 1); }
  const f = path.join(base, rel);
  if (!f.startsWith(base) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) throw new Error('port collision ' + PORT);
const browser = await chromium.launch({ headless: true, channel: process.env.KFB_CHROME ? undefined : 'chrome', executablePath: process.env.KFB_CHROME || undefined, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 500 } });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || /WebGLProgram|shader/i.test(m.text())) errors.push(m.text().slice(0, 2000)); });
  await page.goto(`http://127.0.0.1:${PORT}/CLAY_REFERENZ_R2/knete_v13.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_V13_READY === true, null, { timeout: 120000 });
  const r = await page.evaluate((o) => window.KFB_MUNDDIAG(o), JSON.parse(process.env.KFB_OPTS || '{}'));
  for (const [k, url] of Object.entries(r.out)) { const f = path.join(EVD, `${k}_${TAG}.jpg`); fs.writeFileSync(f, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('wrote', path.relative(DIR, f), (fs.statSync(f).size / 1024).toFixed(0) + ' KB'); }
  fs.writeFileSync(path.join(EVD, `info_${TAG}.json`), JSON.stringify(r.info, null, 1));
  console.log(JSON.stringify(r.info));
} finally {
  await browser.close(); server.close();
  if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
}
