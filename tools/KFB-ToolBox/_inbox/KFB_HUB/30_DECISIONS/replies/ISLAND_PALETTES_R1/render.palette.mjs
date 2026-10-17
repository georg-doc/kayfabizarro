#!/usr/bin/env node
// KFB · Abnahme-Bühne v1 with an island palette (WS0 ISLAND_PALETTES_R1, 18.10.2026).
// A COPY of PROOF_STAGE_R1/render.mjs (same server rules, same playwright/Chrome harness, same original proof-stage.html and
// kfb-proof-stage.v1.js, unchanged) plus two optional parameters:
//
//   node render.palette.mjs --palette island_palettes.r1.json --island <id|all> --out evidence/_privat [--views threeq,far,top] [--diag]
//
//   --palette <json>   kfb.island-palettes/1; each island entry names its GLB (`glb`, hub:… path)
//   --island <id|all>  one island id (e.g. 06_Iceland) or all
//   --views            stage views (threeq, far, …) plus `top` (see below); default threeq,far,top
//   --diag             false-colour role map instead of the palette (diagnosis only: which role sits where)
//
// How the palette gets in: after the original page is ready, the CLI imports GLTFLoader (the same three r180 module instance the page
// uses, via the page's import map URL) and apply-island-palette.v1.js, and wraps GLTFLoader.prototype.parse. So the palette is set
// on the materials by name BEFORE the stage's own clay pass (kfb-clay.v1.1 copies material.color). Light, tone, cove, clay, gates:
// untouched stage v1.
//
// `top` is NOT a stage-v1 preset. It is rendered here with the stage's own scene, light rig (rig.update with the new camera),
// contact AO, renderer and FOV: turntable 0°, camera elevation 80° over the footprint centre, the footprint (2·r_xz) fills 80 % of
// the frame height. Marked "(Zusatz, nicht Bühne v1)" on the sheet.
//
// Output per island: <out>/<id>/<id>_<view>.png, <id>_palette_sheet.png, proof_manifest.json (stage manifest + palette report).
// With --island all also <out>/ISLAND_PALETTES_R1_overview.png. Exit 0 = all PASS, 1 = a gate FAILed, 2 = error.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STAGE_DIR = path.resolve(HERE, '../PROOF_STAGE_R1');
const HUB = path.resolve(HERE, '../../..');
const HOME = process.env.HOME;
const LAB = path.join(HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const STAGE_VIEWS = ['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref'];
const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.180.0/';

const argv = process.argv.slice(2), A = {};
for (let i = 0; i < argv.length; i++) { const k = argv[i]; if (k.startsWith('--')) { const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; A[k.slice(2)] = v; } }
const die = (m, code = 2) => { console.error('render.palette.mjs: ' + m); process.exit(code); };
if (A.help || !A.palette || !A.island || !A.out) die('usage: node render.palette.mjs --palette <json> --island <id|all> --out <dir> [--views threeq,far,top] [--diag]');
const views = String(A.views || 'threeq,far,top').split(',').map((s) => s.trim()).filter(Boolean);
for (const v of views) if (v !== 'top' && !STAGE_VIEWS.includes(v)) die('unknown view ' + v);
const PAL_PATH = path.resolve(A.palette), PAL = JSON.parse(fs.readFileSync(PAL_PATH, 'utf8'));
if (PAL.schema !== 'kfb.island-palettes/1') die('palette is not kfb.island-palettes/1');
const ids = A.island === 'all' ? Object.keys(PAL.islands) : String(A.island).split(',');
for (const id of ids) if (!PAL.islands[id]) die('island not in palette: ' + id);
const OUT = path.resolve(A.out); fs.mkdirSync(OUT, { recursive: true });
const forbidden = (f) => /KFB Open World/.test(f);
const expand = (p) => (p.startsWith('hub:') ? path.join(HUB, p.slice(4)) : p.startsWith('~/') ? path.join(HOME, p.slice(2)) : path.resolve(p));
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const urlFor = (f) => { f = path.resolve(f); if (forbidden(f)) die('refused: ' + f); if (!fs.existsSync(f)) die('missing file: ' + f); if (!f.startsWith(HUB + path.sep)) die('file must be inside KFB_HUB: ' + f); return '/' + path.relative(HUB, f).split(path.sep).map(encodeURIComponent).join('/'); };

/* diagnosis palette: one clear hue per role, tones light/mid/dark (never an approval image) */
const DIAG_HUES = { ground: 30, grass: 120, stone: 260, bark: 0, leaf: 150, bloom: 300, water: 210, accent: 60, sand: 45, paved: 180, earth: 15, snow: 230, cloud: 280 };
const hsl = (h, s, l) => { const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); }; return '#' + f(0) + f(8) + f(4); };
const diagEntry = (id) => ({ id, roles: Object.fromEntries(Object.entries(DIAG_HUES).map(([r, h]) => [r, [hsl(h, 0.9, 0.72), hsl(h, 0.9, 0.5), hsl(h, 0.9, 0.3)]])) });

/* static server (as render.mjs): ephemeral 127.0.0.1 port, root KFB_HUB, never KFB Open World */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname), c = path.join(HUB, u);
  if (!c.startsWith(HUB) || forbidden(c) || !fs.existsSync(c) || fs.statSync(c).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(c).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(c).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) { server.close(); die('port collision ' + PORT); }
const PAGE = `http://127.0.0.1:${PORT}${urlFor(path.join(STAGE_DIR, 'proof-stage.html'))}?headless=1`;
const APPLY_URL = urlFor(path.join(HERE, 'apply-island-palette.v1.js'));
console.log(`server 127.0.0.1:${PORT} (own process, closed at the end)`);

const PW = process.env.KFB_PLAYWRIGHT_DIR ? path.resolve(process.env.KFB_PLAYWRIGHT_DIR) : LAB;
const { chromium } = createRequire(path.join(PW, 'package.json'))('playwright-core');
const browser = await chromium.launch({ headless: true, channel: process.env.KFB_CHROME ? undefined : 'chrome', executablePath: process.env.KFB_CHROME || undefined, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const save = (file, dataUrl) => { const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64'); fs.writeFileSync(file, buf); return crypto.createHash('sha256').update(buf).digest('hex'); };
let code = 0; const overview = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)); });
  await page.goto(PAGE, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_PROOF_READY === true, null, { timeout: 30000 });
  /* hook: same GLTFLoader module instance as the page (import-map URL), palette applied in parse() */
  await page.evaluate(async ({ cdn, applyUrl }) => {
    const { GLTFLoader } = await import(cdn + 'examples/jsm/loaders/GLTFLoader.js');
    const AP = await import(applyUrl);
    window.__KFB_PAL = { entry: null, report: null, AP };
    AP.patchGLTFLoader(GLTFLoader, () => window.__KFB_PAL.entry, (r) => { const P = window.__KFB_PAL; (P.reports = P.reports || []).push(r); if (!P.report || r.touched > P.report.touched) P.report = r; });   // the stage also loads the FB silhouette (0 role materials)
    const THREE = await import(cdn + 'build/three.module.js');
    /* `top`: stage scene/light/AO/renderer, own camera (not a stage-v1 preset) */
    window.__KFB_TOP = () => {
      const st = window.KFB_PROOF.stage, S = st.debug(), info = window.KFB_PROOF.info(), fov = info.frame.fov, Wd = info.frame.w, Hd = info.frame.h;
      S.turntable.rotation.y = 0; S.aoProxy.rotation.y = 0; S.turntable.updateMatrixWorld(true);
      if (S.sil) S.sil.root.visible = false;
      const t = Math.tan((fov * Math.PI) / 360), c = S.bounds.getCenter(new THREE.Vector3()), el = (80 * Math.PI) / 180;
      const d = (2 * S.rxz / 0.8) / (2 * t) + S.Hs * 0.6;
      const tgt = new THREE.Vector3(c.x, S.Hs * 0.35, c.z);
      const cam = new THREE.PerspectiveCamera(fov, Wd / Hd, 0.02, 400);
      cam.position.set(tgt.x, tgt.y + d * Math.sin(el), tgt.z + d * Math.cos(el)); cam.lookAt(tgt); cam.updateMatrixWorld(true);
      S.rig.update(0, { camera: cam }); S.ao.update(0, { camera: cam });
      st.renderer.render(S.scene, cam);
      return st.dataURL();
    };
    /* palette sheet: 3 views in a row + header + role swatches */
    window.__KFB_SHEET = async ({ shots, entry, title, sub, gates, foot }) => {
      const tw = 800, th = 600, gap = 16, cap = 28, top = 96, sw = 230, Wd = shots.length * tw + (shots.length + 1) * gap;
      const roles = Object.keys(entry.roles), rowH = 30, cols = Math.max(1, Math.floor((Wd - gap) / (sw + gap))), rows = Math.ceil(roles.length / cols);
      const moodH = 52, Hd = top + th + cap + gap + moodH + rows * (rowH + 8) + 40;
      const cv = document.createElement('canvas'); cv.width = Wd; cv.height = Hd; const g = cv.getContext('2d');
      g.fillStyle = '#f4efe6'; g.fillRect(0, 0, Wd, Hd);
      g.fillStyle = '#2a2622'; g.font = '600 28px system-ui, Helvetica, Arial, sans-serif'; g.fillText(title, gap, 38);
      g.font = '16px system-ui, Helvetica, Arial, sans-serif'; g.fillStyle = '#5d564d'; g.fillText(sub, gap, 62);
      let x = gap; g.font = '600 14px system-ui, Helvetica, Arial, sans-serif';
      for (const [k, v] of Object.entries(gates || {})) { const col = v.result === 'PASS' ? '#2f7d4a' : v.result === 'FAIL' ? '#b0182f' : v.result === 'WARN' ? '#b7791f' : '#7a746b', txt = `${k} ${v.result}`, w = g.measureText(txt).width + 16; g.fillStyle = col; g.fillRect(x, 70, w, 20); g.fillStyle = '#fff'; g.fillText(txt, x + 8, 85); x += w + 6; }
      for (let i = 0; i < shots.length; i++) {
        const im = new Image(); im.src = shots[i].url; await im.decode();
        const cx = gap + i * (tw + gap); g.drawImage(im, cx, top, tw, th);
        g.fillStyle = '#2a2622'; g.fillRect(cx, top + th, tw, cap); g.fillStyle = '#fff'; g.font = '15px system-ui, Helvetica, Arial, sans-serif'; g.fillText(shots[i].label, cx + 10, top + th + 19);
      }
      let y = top + th + cap + gap; g.fillStyle = '#2a2622'; g.font = 'italic 15px system-ui, Helvetica, Arial, sans-serif';
      const words = String(entry.mood || '').split(' '); let line = '', ly = y + 16;
      for (const w of words) { if (g.measureText(line + w).width > Wd - 2 * gap) { g.fillText(line, gap, ly); ly += 20; line = ''; } line += w + ' '; } g.fillText(line, gap, ly);
      y += moodH; g.font = '12px ui-monospace, Menlo, monospace';
      roles.forEach((r, i) => {
        const cx = gap + (i % cols) * (sw + gap), cy = y + Math.floor(i / cols) * (rowH + 8);
        entry.roles[r].forEach((hex, k) => { g.fillStyle = hex; g.fillRect(cx + k * 34, cy, 32, rowH); });
        g.fillStyle = '#2a2622'; g.fillText(r, cx + 108, cy + 12); g.fillStyle = '#6d665d'; g.fillText(entry.roles[r][1], cx + 108, cy + 26);
      });
      g.fillStyle = '#6d665d'; g.font = '12px ui-monospace, Menlo, monospace'; g.fillText(foot, gap, Hd - 14);
      return cv.toDataURL('image/png');
    };
    window.__KFB_OVERVIEW = async ({ tiles, title, foot }) => {
      const tw = 600, th = 450, gap = 14, cap = 26, top = 60, cols = 4, rows = Math.ceil(tiles.length / cols), sh = 18;
      const Wd = cols * tw + (cols + 1) * gap, Hd = top + rows * (th + cap + sh + gap) + 34;
      const cv = document.createElement('canvas'); cv.width = Wd; cv.height = Hd; const g = cv.getContext('2d');
      g.fillStyle = '#f4efe6'; g.fillRect(0, 0, Wd, Hd); g.fillStyle = '#2a2622'; g.font = '600 26px system-ui, Helvetica, Arial, sans-serif'; g.fillText(title, gap, 38);
      for (let i = 0; i < tiles.length; i++) {
        const im = new Image(); im.src = tiles[i].url; await im.decode();
        const cx = gap + (i % cols) * (tw + gap), cy = top + Math.floor(i / cols) * (th + cap + sh + gap);
        g.drawImage(im, cx, cy, tw, th); g.fillStyle = '#2a2622'; g.fillRect(cx, cy + th, tw, cap); g.fillStyle = '#fff'; g.font = '15px system-ui, Helvetica, Arial, sans-serif'; g.fillText(tiles[i].label, cx + 10, cy + th + 18);
        const sw = tiles[i].swatch, w = tw / sw.length; sw.forEach((hex, k) => { g.fillStyle = hex; g.fillRect(cx + k * w, cy + th + cap, w, sh); });
      }
      g.fillStyle = '#6d665d'; g.font = '12px ui-monospace, Menlo, monospace'; g.fillText(foot, gap, Hd - 12);
      return cv.toDataURL('image/png');
    };
  }, { cdn: THREE_CDN, applyUrl: APPLY_URL });

  for (const id of ids) {
    const isl = PAL.islands[id], entry = A.diag ? diagEntry(id) : { id, ...isl };
    const glbPath = expand(isl.glb), dir = path.join(OUT, id); fs.mkdirSync(dir, { recursive: true });
    const before = new Set(fs.readdirSync(dir)); errors.length = 0;
    await page.evaluate((e) => { window.__KFB_PAL.entry = e; window.__KFB_PAL.report = null; window.__KFB_PAL.reports = []; }, entry);
    const t0 = Date.now();
    const r = await page.evaluate((a) => window.KFB_PROOF.load(a), { id: null, cardUrl: null, glbUrl: urlFor(glbPath), type: 'stage', units: 'kaykit', glbName: 'hub:' + path.relative(HUB, glbPath) });
    const rep = await page.evaluate(() => window.__KFB_PAL.report);
    console.log(`${id} · ${r.status} · ${r.info.size_m.join('×')} m · palette ${rep ? rep.touched + ' materials' : 'NOT APPLIED'}${rep?.missing?.length ? ' · missing ' + rep.missing.join(',') : ''} · ${Date.now() - t0} ms`);
    for (const [k, g] of Object.entries(r.gates)) console.log(`  ${k} ${g.result.padEnd(4)} ${g.detail.slice(0, 110)}`);
    if (!rep || rep.touched === 0) throw new Error('palette was not applied for ' + id);
    if (r.status !== 'PASS') code = 1;
    const files = {}, shots = [];
    const LABEL = { threeq: '¾ 35° (Bühne v1)', far: 'Totale (Bühne v1)', top: 'Draufsicht 80° (Zusatz, nicht Bühne v1)', front: 'vorn 0°', side: 'Seite 90°', back: 'hinten 180°' };
    for (const v of views) {
      const url = v === 'top' ? await page.evaluate(() => window.__KFB_TOP()) : await page.evaluate((vv) => window.KFB_PROOF.render(vv, 'rest'), v);
      const name = `${id}${A.diag ? '_diag' : ''}_${v}.png`; files[name] = { view: v, sha256: save(path.join(dir, name), url) }; shots.push({ url, label: LABEL[v] || v });
      if (v === 'threeq') overview.push({ url, label: `${id.replace('_', ' · ')} · ${r.status}`, swatch: isl.lead6 || isl.six || [] });
    }
    const head = {
      title: `KFB Insel-Palette · ${id}${A.diag ? ' · DIAGNOSE Rollen-Falschfarben' : ''} · PRIVAT (Kauf-Asset, nur lokal)`,
      sub: `GLB ${path.basename(glbPath)} · ${r.info.size_m.join(' × ')} m · ${A.diag ? 'Falschfarben je Rolle' : isl.recipe?.call || ''} · Laufzeit-Palette ${rep.touched} Materialien · Clay ${r.info.clay.version} ${r.info.clay.profile}`,
      gates: r.gates, entry,
      foot: `kfb-proof-stage.v1 (unverändert) · kfb-clay.v1.1 · kfb-stage-light.v1 MOODS_MESA Tag · ACES 1 · apply-island-palette.v1 · ${PAL.schema} · ${new Date().toISOString().slice(0, 10)}`,
    };
    const sheetName = `${id}${A.diag ? '_diag' : ''}_palette_sheet.png`;
    files[sheetName] = { sheet: true, sha256: save(path.join(dir, sheetName), await page.evaluate((x) => window.__KFB_SHEET(x), { shots, ...head })) };
    const man = await page.evaluate((f) => window.KFB_PROOF.manifest(f), files);
    man.input.glbPathLocal = glbPath.replace(HOME, '~'); man.input.glbSha256_node = sha(glbPath);
    man.palette = { file: path.relative(HUB, PAL_PATH), sha256: sha(PAL_PATH), island: id, diag: !!A.diag, report: rep, module: 'apply-island-palette.v1.js', moduleSha256: sha(path.join(HERE, 'apply-island-palette.v1.js')) };
    man.cli = { command: 'node render.palette.mjs ' + argv.join(' '), views, node: process.version, chrome: process.env.KFB_CHROME ? path.basename(path.dirname(process.env.KFB_CHROME)) : 'channel chrome', ms: Date.now() - t0, pageErrors: [...errors], topView: 'Zusatz (nicht Bühne v1): turntable 0°, elevation 80°, footprint 80 % frame height, stage scene/light/AO' };
    man.vendor = Object.fromEntries(fs.readdirSync(path.join(STAGE_DIR, 'vendor')).filter((f) => f.endsWith('.js')).map((f) => [f, sha(path.join(STAGE_DIR, 'vendor', f))]));
    man.vendor['kfb-proof-stage.v1.js'] = sha(path.join(STAGE_DIR, 'kfb-proof-stage.v1.js')); man.vendor['proof-stage.html'] = sha(path.join(STAGE_DIR, 'proof-stage.html'));
    man.staleFilesInOut = [...before].filter((f) => !files[f] && f !== 'proof_manifest.json' && !(A.diag ? false : f.includes('_diag')));
    fs.writeFileSync(path.join(dir, A.diag ? 'proof_manifest_diag.json' : 'proof_manifest.json'), JSON.stringify(man, null, 1));
    if (errors.length) console.log('  page errors: ' + errors.slice(0, 5).join(' | '));
  }
  if (ids.length > 1 && overview.length) {
    const name = A.diag ? 'ISLAND_PALETTES_R1_diag_overview.png' : 'ISLAND_PALETTES_R1_overview.png';
    save(path.join(OUT, name), await page.evaluate((x) => window.__KFB_OVERVIEW(x), { tiles: overview, title: `KFB Insel-Paletten R1 · ¾-Ansicht · Bühne v1 + Laufzeit-Palette${A.diag ? ' · DIAGNOSE' : ''} · PRIVAT (nur lokal)`, foot: `Streifen = die sechs flächengrößten Farben je Insel (area_shares.r1.json) · ${PAL.schema} · ${new Date().toISOString().slice(0, 10)}` }));
    console.log('overview -> ' + path.join(OUT, name));
  }
} catch (e) { console.error('render.palette.mjs: ' + e.message); code = 2; }
finally { await browser.close(); server.close(); }
process.exit(code);
