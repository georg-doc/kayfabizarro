#!/usr/bin/env node
// KFB GEM_R1 · headless probe: state sheet (idle / active / moving), capture frame strip, shader cost. Drives ../gem-proof.html, which uses
// the ONE proof stage (kfb-proof-stage.v1.2 with the gem hook, light v1.1). Same server rules as render.mjs: own 127.0.0.1 server on an
// ephemeral port (never 5180/5192/8765), root = KFB_HUB, extra files only from --assets <dir> under $HOME, nothing under "KFB Open World".
//   KFB_CHROME=<chrome-headless-shell> node gem-proof.mjs --assets <dir with gem_*.glb from make-test-assets.mjs> --out <dir> [--only states,capture,perf]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), HUB = path.resolve(HERE, '../../../..'), HOME = process.env.HOME;
const argv = process.argv.slice(2), A = {}; for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) A[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
if (!A.assets || !A.out) { console.error('usage: node gem-proof.mjs --assets <dir> --out <dir> [--only states,capture,perf]'); process.exit(2); }
const ASSETS = path.resolve(A.assets), OUT = path.resolve(A.out), ONLY = new Set(String(A.only || 'states,capture,perf').split(','));
if (!ASSETS.startsWith(HOME + path.sep) || /KFB Open World/.test(ASSETS)) { console.error('assets must be under $HOME and not in KFB Open World'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname); let f = null;
  if (u.startsWith('/@assets/')) { const c = path.join(ASSETS, path.basename(u)); if (/^gem_\w+\.glb$/.test(path.basename(u))) f = c; }
  else { const c = path.join(HUB, u); if (c.startsWith(HUB) && !/KFB Open World/.test(c)) f = c; }
  if (!f || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) { server.close(); process.exit(2); }
const LAB = path.join(HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const { chromium } = createRequire(path.join(process.env.KFB_PLAYWRIGHT_DIR || LAB, 'package.json'))('playwright-core');
const browser = await chromium.launch({ headless: true, executablePath: process.env.KFB_CHROME, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const save = (name, url) => { fs.writeFileSync(path.join(OUT, name), Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('  wrote ' + name); };
const report = { created: new Date().toISOString(), port: PORT };
let code = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
  await page.goto(`http://127.0.0.1:${PORT}/30_DECISIONS/replies/GEM_R1/gem-proof.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_GEM_READY === true, null, { timeout: 30000 });
  const G = (fn, arg) => page.evaluate(fn, arg);
  const url = (n) => `/@assets/${n}.glb`;
  if (ONLY.has('states')) {
    const cells = [];
    for (const mood of ['day', 'night']) {
      const r = await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_pair'), mood, id: 'gem_pair' });
      report['states_' + mood] = r;
      await G((m) => window.KFB_GEM.setStates(m), { 'active': 'active' });
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: `${mood === 'day' ? 'Tag' : 'Nacht'} · vorn · v. l.: Rubin idle · Rubin ACTIVE · Saphir idle · Saphir ACTIVE` });
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'threeq'), caption: `${mood === 'day' ? 'Tag' : 'Nacht'} · ¾ · gleiche Reihenfolge (active = hellere Adern + weicher Rand)` });
    }
    await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_pair'), mood: 'day', id: 'gem_pair' });
    await G((m) => window.KFB_GEM.setStates(m), { 'active': 'moving' });
    for (const t of [0.4, 0.8]) { await G((s) => window.KFB_GEM.advance(s), t === 0.4 ? 0.4 : 0.4); cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: `Tag · MOVING t = ${t.toFixed(1)} s (2. und 4. Figur: Schimmer, Facetten drehen langsam)` }); }
    save('gem_states_idle_active_moving.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 · Zustände idle / active / moving (Damen, Satz M r2)', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA · Paare: links idle, rechts active · unten: moving nach 0,4 s / 0,8 s', cells, cols: 2 }));
  }
  if (ONLY.has('capture')) {
    const r = await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_capture'), mood: 'day', id: 'gem_capture' }); report.capture = r;
    const cells = [], times = [0, 0.12, 0.35, 0.65, 1.0]; let at = 0;
    for (const t of times) {
      if (t > 0 && at === 0) await G((m) => window.KFB_GEM.setStates(m), { '.': 'captured' });
      if (t > at) { report['capture_t' + t] = await G((s) => window.KFB_GEM.advance(s), t - at); at = t; }
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: t === 0 ? 't = 0 (vor dem Schlag)' : `captured · t = ${t.toFixed(2)} s` });
    }
    save('gem_capture_strip.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 · captured: Cartoon-Bruch (wenige große Scherben, springen, verblassen, ≤ 1,2 s)', sub: 'Rubin-Dame + Saphir-Springer · Schnitt der echten Hülle (Morph-Chess-Bruch, 8 Scherben je Figur) · Bühne v1.2, Tag · Ausblenden ab 0,72 s, weg bei 1,2 s', cells, cols: 5, tw: 576, th: 432 }));
  }
  if (ONLY.has('perf')) {
    for (const [n, view, mood] of [['gem_perf32', 'front', 'day'], ['gem_perf32', 'front', 'night'], ['gem_start', 'threeq', 'day']]) {
      await G((a) => window.KFB_GEM.load(a), { glbUrl: url(n), mood, id: n });
      const p = await G((a) => window.KFB_GEM.perf(a), { view, frames: 60 });
      report[`perf_${n}_${view}_${mood}`] = p; console.log(n, view, mood, JSON.stringify(p));
      if (n === 'gem_perf32' && mood === 'day') save('gem_perf32_front_day.png', await G((v) => window.KFB_GEM.render(v), 'front'));
    }
  }
  report.pageErrors = errs; if (errs.length) console.log('page errors: ' + errs.slice(0, 5).join(' | '));
} catch (e) { console.error('gem-proof: ' + e.message); code = 2; }
finally { fs.writeFileSync(path.join(OUT, 'gem_probe_report.json'), JSON.stringify(report, null, 1)); await browser.close(); server.close(); }
process.exit(code);
