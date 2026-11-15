// Lichtkante R1 · rendert die Stilbild-Paare (heute | Lichtkante) headless. Eigener statischer Server (root = replies/), wird am Ende geschlossen.
// Aufruf: node tests/render.mjs [--p '{"rim":3.5,"ring":0.25,"wall":0.8,"depth":1.25,"maxSlope":1.4}'] [--only fb,terrain] [--tag r1]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), DIR = path.resolve(HERE, '..'), ROOT = path.resolve(DIR, '..'), EVD = path.join(DIR, 'evidence');
const LAB = path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const { chromium } = createRequire(path.join(LAB, 'package.json'))('playwright-core');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const P = arg('--p') ? JSON.parse(arg('--p')) : undefined, ONLY = arg('--only') ? arg('--only').split(',') : null, TAG = arg('--tag') || 'r1';
fs.mkdirSync(EVD, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const PRIV = path.join(process.env.HOME, 'kfb-ws0/stamm-wt/src/private'); // assets/private (FB-Web-Kanon), nur gelesen, nichts kopiert
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname), base = u.startsWith('/private/') ? PRIV : ROOT, f = path.join(base, u.startsWith('/private/') ? u.slice(9) : u);
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
  page.on('console', (m) => { if (m.type() === 'error' || /WebGLProgram|shader/i.test(m.text())) errors.push(m.text().slice(0, 1500)); });
  await page.goto(`http://127.0.0.1:${PORT}/CLAY_LICHTKANTE_R1/lichtkante.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_LK_READY === true, null, { timeout: 120000 });
  const cfg = { only: ONLY }; if (P) cfg.p = P;
  if (process.argv.includes('--range')) console.log('RANGE', JSON.stringify(await page.evaluate(() => window.KFB_LK_RANGE())));
  const MATCH = process.argv.includes('--match') || process.argv.includes('--range'); if (process.argv.includes('--match')) console.log('MATCH', JSON.stringify(await page.evaluate(() => window.KFB_LK_MATCH())));
  const r = MATCH ? { out: {}, info: {} } : await page.evaluate((c) => (c.fb ? window.KFB_LK.runFB(c) : window.KFB_LK.run(c)), { ...cfg, fb: process.argv.includes('--fb') });
  for (const [k, url] of Object.entries(r.out)) { const f = path.join(EVD, `${k}_${TAG}.png`); fs.writeFileSync(f, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('wrote', path.relative(DIR, f)); }
  console.log(JSON.stringify(r.info));
} finally {
  await browser.close(); server.close();
  if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
}
