#!/usr/bin/env node
// KFB Abnahme-Bühne v1 · headless export (WS0 PROOF_STAGE_R1). Drives proof-stage.html in headless Chrome (playwright-core from the Lab
// node_modules, read only, as in the CLAY_SSOT golden test) and writes PNGs + contact sheet + proof_manifest.json.
//
//   node render.mjs --card <figure.json | id> [--glb <path>] [--type character|prop|stage] [--views front,threeq,...] [--eyes rest,half,closed]
//                   [--units kaykit|m] [--stage v1.2|v1.1|v1] [--pose auto|float|ground] --out <dir>
//   --pose (v1.2): auto = found items with a KFB_Pickup node float at the Medium rig's hip height (V-437); float / ground force it.
//   Default views: character = front,threeq,side,back,near_face,far,scale_ref · prop/stage (v1.1) = front,threeq,side,back,top,near_face,
//   detail_low,far,scale_ref (3 x 3 sheet, no empty cells). --stage v1 drives proof-stage.v1.html (kfb-proof-stage.v1, frozen).
//   node render.mjs --id frizzlebob --out out/fb                (id from sources.json: card + GLB resolved locally)
//   node render.mjs --glb ../../../50_BLENDER/B22/KFB_Billboard_Lamps.r2.glb --type prop --out out/lamps
//
// Chrome: KFB_CHROME=<path to chrome-headless-shell> (recommended; else the Chrome channel is tried).
// playwright-core: from the Lab's node_modules (read only), or KFB_PLAYWRIGHT_DIR=<folder whose node_modules contains playwright-core>.
// Exit: 0 = all gates PASS (images written) · 1 = a gate FAILed (only proof_manifest.json + <id>_contact_sheet_FAIL.png, no approval PNGs)
//       · 2 = could not load / usage error.
// Server: own static server on an ephemeral 127.0.0.1 port (never 5180/5192/8765), root = KFB_HUB; files outside KFB_HUB only if they
// are named on the command line or in sources.json (route /@home/…), never anything under "KFB Open World". Closed at the end.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HUB = path.resolve(HERE, '../../..');
const HOME = process.env.HOME;
const LAB = path.join(HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const ALL_VIEWS = ['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref', 'top', 'detail_low', 'detail_right'], ALL_EYES = ['rest', 'half', 'closed'];

/* ---------- args ---------- */
const argv = process.argv.slice(2), A = {};
for (let i = 0; i < argv.length; i++) { const k = argv[i]; if (k.startsWith('--')) { const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; A[k.slice(2)] = v; } }
const die = (m, code = 2) => { console.error('render.mjs: ' + m); process.exit(code); };
if (A.help || (!A.card && !A.glb && !A.id) || !A.out) die('usage: node render.mjs --card <figure.json|id> [--glb <path>] [--type character|prop|stage] [--views a,b] [--eyes rest,half,closed] [--units kaykit|m] --out <dir>');
let views = A.views ? String(A.views).split(',').map((s) => s.trim()).filter(Boolean) : null;   // default per type after load (DEFAULT_VIEWS)
const STAGE = String(A.stage || 'v1.2'); if (!['v1', 'v1.1', 'v1.2'].includes(STAGE)) die('--stage v1 | v1.1 | v1.2');   // v1.2 = proof-stage.html; v1.1 / v1 = frozen pages
if (A.pose && !['auto', 'float', 'ground'].includes(String(A.pose))) die('--pose auto | float | ground');
const eyes = String(A.eyes || 'rest,half,closed').split(',').map((s) => s.trim()).filter(Boolean);  // v1.1.1: default = all three eye states (uniform sheets)
for (const v of views || []) if (!ALL_VIEWS.includes(v)) die('unknown view ' + v + ' (' + ALL_VIEWS.join(', ') + ')');
for (const e of eyes) if (!ALL_EYES.includes(e)) die('unknown eye state ' + e + ' (' + ALL_EYES.join(', ') + ')');
const OUT = path.resolve(A.out); fs.mkdirSync(OUT, { recursive: true });
const before = new Set(fs.readdirSync(OUT));                                       // nothing is deleted; leftovers are reported
const SOURCES = JSON.parse(fs.readFileSync(path.join(HERE, 'sources.json'), 'utf8'));
const expand = (p) => (p.startsWith('hub:') ? path.join(HUB, p.slice(4)) : p.startsWith('~/') ? path.join(HOME, p.slice(2)) : path.resolve(p));
const forbidden = (f) => /KFB Open World/.test(f);

/* allow-list for files outside the hub */
const allow = new Set();
const urlFor = (file) => {
  const f = path.resolve(file); if (forbidden(f)) die('refused: ' + f);
  if (!fs.existsSync(f)) die('missing file: ' + f);
  if (f.startsWith(HUB + path.sep)) return '/' + path.relative(HUB, f).split(path.sep).map(encodeURIComponent).join('/');
  if (f.startsWith(HOME + path.sep)) { allow.add(f); return '/@home/' + path.relative(HOME, f).split(path.sep).map(encodeURIComponent).join('/'); }
  die('file must be under $HOME: ' + f);
};
for (const v of Object.values(SOURCES.figures)) { const f = expand(v.glb); if (!f.startsWith(HUB) && fs.existsSync(f) && !forbidden(f)) allow.add(f); }
/* v1.2 scale figures + their idle clips (sources.json scale_ref), served by local path only */
for (const v of Object.values(SOURCES.scale_ref || {})) if (v && typeof v === 'object') for (const k of ['glb', 'anim']) if (v[k]) { const f = expand(v[k]); if (!f.startsWith(HUB) && f.startsWith(HOME + path.sep) && fs.existsSync(f) && !forbidden(f)) allow.add(f); }

let id = A.id || null, cardUrl = null, glbUrl = null, glbPath = null, cardPath = null;
if (A.card && !/[\\/]|\.json$/i.test(A.card)) id = A.card;                     // --card <id>
else if (A.card) { cardPath = path.resolve(A.card); cardUrl = urlFor(cardPath); }
if (A.glb) { glbPath = path.resolve(A.glb); glbUrl = urlFor(glbPath); }
if (id && !SOURCES.figures[id] && !glbUrl) die(`id "${id}" not in sources.json and no --glb given`);
if (id && SOURCES.figures[id]) { const s = SOURCES.figures[id]; if (!glbPath) glbPath = expand(s.glb); if (!fs.existsSync(glbPath)) die('GLB from sources.json missing: ' + glbPath); }
if (id && !cardPath) { const s = SOURCES.figures[id]; const cp = s?.card ? expand(s.card) : path.join(expand(SOURCES.cards), id + '.figure.json'); if (fs.existsSync(cp)) { cardPath = cp; cardUrl = urlFor(cp); } }
if (glbPath && !glbUrl) glbUrl = urlFor(glbPath);
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

/* ---------- static server ---------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.bin': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = null;
  if (u.startsWith('/@home/')) { const c = path.join(HOME, u.slice(7)); if (allow.has(c)) f = c; }
  else { const c = path.join(HUB, u); if (c.startsWith(HUB) && !forbidden(c)) f = c; }
  if (!f || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) { server.close(); die('port collision ' + PORT); }
const PAGE = `http://127.0.0.1:${PORT}/${path.relative(HUB, path.join(HERE, { v1: 'proof-stage.v1.html', 'v1.1': 'proof-stage.v1.1.html', 'v1.2': 'proof-stage.html' }[STAGE])).split(path.sep).map(encodeURIComponent).join('/')}?headless=1`;

/* ---------- run ---------- */
const PW = process.env.KFB_PLAYWRIGHT_DIR ? path.resolve(process.env.KFB_PLAYWRIGHT_DIR) : LAB;   // a folder whose node_modules has playwright-core
const { chromium } = createRequire(path.join(PW, 'package.json'))('playwright-core');
const browser = await chromium.launch({ headless: true, channel: process.env.KFB_CHROME ? undefined : 'chrome', executablePath: process.env.KFB_CHROME || undefined, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const errors = []; let code = 0;
const save = (name, dataUrl) => { const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64'); fs.writeFileSync(path.join(OUT, name), buf); return crypto.createHash('sha256').update(buf).digest('hex'); };
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)); });
  await page.goto(PAGE, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_PROOF_READY === true, null, { timeout: 30000 });
  const t0 = Date.now();
  let r;
  try { r = await page.evaluate((a) => window.KFB_PROOF.load(a), { id: id && SOURCES.figures[id] ? id : null, cardUrl, glbUrl, type: A.type || null, units: A.units || 'kaykit', pose: String(A.pose || 'auto'), glbName: glbPath ? path.relative(HUB, glbPath).startsWith('..') ? glbPath.replace(HOME, '~') : 'hub:' + path.relative(HUB, glbPath) : null }); }
  catch (e) { throw new Error('load failed: ' + e.message); }
  const fid = r.input.id, hasEyes = !!(r.info.eyes && r.info.eyes.seat);
  console.log(`${fid} · ${r.input.type} · ${r.info.height_m} m · eyes ${r.info.eyes.seat || r.info.eyes.status} · clay ${r.info.clay.version}/${r.info.clay.profile} · ${Date.now() - t0} ms`);
  for (const [k, g] of Object.entries(r.gates)) console.log(`  ${k} ${g.result.padEnd(4)} ${g.name}: ${g.detail}`);
  if (!views) views = r.info.defaultViews || (await page.evaluate(() => window.KFB_PROOF.DEFAULT_VIEWS || null))?.[r.input.type] || ['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref'];   // v1.2: lineups swap side for detail_right
  const combos = []; for (const v of views) for (const e of hasEyes ? eyes : ['rest']) combos.push([v, e]);
  const renders = {}, files = {};
  if (r.status === 'PASS') {
    for (const [v, e] of combos) {
      const u = await page.evaluate(([v, e]) => window.KFB_PROOF.render(v, e), [v, e]);
      const name = `${fid}_${v}${hasEyes ? '_' + e : ''}.png`; renders[`${v}|${e}`] = u; files[name] = { view: v, eyes: hasEyes ? e : null, sha256: save(name, u) };
    }
    const sh = await page.evaluate((x) => window.KFB_PROOF.sheet(x), renders);
    files[`${fid}_contact_sheet.png`] = { sheet: true, sha256: save(`${fid}_contact_sheet.png`, sh) };
  } else {
    code = 1;                                                                        // gate FAIL: diagnosis sheet only, no approval images
    for (const [v, e] of combos) renders[`${v}|${e}`] = await page.evaluate(([v, e]) => window.KFB_PROOF.render(v, e), [v, e]);
    const sh = await page.evaluate((x) => window.KFB_PROOF.sheet(x, 'FAIL'), renders);
    files[`${fid}_contact_sheet_FAIL.png`] = { sheet: true, fail: true, sha256: save(`${fid}_contact_sheet_FAIL.png`, sh) };
  }
  const man = await page.evaluate((f) => window.KFB_PROOF.manifest(f), files);
  man.input.glbPathLocal = glbPath ? glbPath.replace(HOME, '~') : null; man.input.cardPathLocal = cardPath ? cardPath.replace(HOME, '~') : null;
  if (glbPath) man.input.glbSha256_node = sha(glbPath); if (cardPath) man.input.cardSha256_node = sha(cardPath);
  man.cli = { command: 'node render.mjs ' + argv.join(' '), views, eyes: hasEyes ? eyes : null, node: process.version, chrome: process.env.KFB_CHROME ? path.basename(path.dirname(process.env.KFB_CHROME)) : 'channel chrome', ms: Date.now() - t0, pageErrors: errors };
  man.vendor = Object.fromEntries(fs.readdirSync(path.join(HERE, 'vendor')).filter((f) => f.endsWith('.js')).map((f) => [f, sha(path.join(HERE, 'vendor', f))]));
  for (const f of ['kfb-proof-stage.v1.js', 'kfb-proof-stage.v1.1.js', 'kfb-proof-stage.v1.2.js']) man.vendor[f] = sha(path.join(HERE, f)); man.cli.stagePage = STAGE; man.vendor['kfb-proof-eyes.v1.js'] = sha(path.join(HERE, 'kfb-proof-eyes.v1.js'));
  man.staleFilesInOut = [...before].filter((f) => !files[f] && f !== 'proof_manifest.json');
  if (man.staleFilesInOut.length) console.log('  note: files from an earlier run stay in the folder (not part of this manifest): ' + man.staleFilesInOut.join(', '));
  fs.writeFileSync(path.join(OUT, 'proof_manifest.json'), JSON.stringify(man, null, 1));
  console.log(`${r.status} · ${Object.keys(files).length} file(s) -> ${OUT}` + (errors.length ? `\n  page errors: ${errors.slice(0, 5).join(' | ')}` : ''));
} catch (e) { console.error('render.mjs: ' + e.message + (errors.length ? '\n  page errors: ' + errors.slice(0, 8).join(' | ') : '')); code = 2; }
finally { await browser.close(); server.close(); }
process.exit(code);
