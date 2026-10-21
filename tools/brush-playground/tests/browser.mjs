// KFB Brush Playground · real-browser functional tests (Chromium via Playwright, file:// page)
// The private .brush files are read from BRUSH_DIR and never copied into the repository.
//
//   node tests/browser.mjs
// Defaults: brushes from ./brushes (git-ignored), private evidence to ./evidence-private/run (git-ignored),
// Playwright from ~/kfb-ws1/kfb-planet/node_modules. Override with BRUSH_DIR, EVIDENCE_PRIVATE, PLAYWRIGHT.
// Private evidence (isolated shape, Procreate reference, comparisons) never leaves EVIDENCE_PRIVATE.
// Public-safe evidence (drawn canvas, UI with the inspector masked, metrics JSON) goes to ./evidence.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(import.meta.url);
const home = os.homedir(), tilde = p => p && p.replace(/^~/, home);
const here = path.dirname(new URL(import.meta.url).pathname);
const proto = path.resolve(here, '..');
const { chromium } = require(tilde(process.env.PLAYWRIGHT || '~/kfb-ws1/kfb-planet/node_modules/playwright'));
const sharp = require(path.join(path.dirname(require.resolve(tilde(process.env.PLAYWRIGHT || '~/kfb-ws1/kfb-planet/node_modules/playwright'))), '..', 'sharp'));
const fflate = require(path.join(proto, 'vendor', 'fflate-0.8.3.umd.js'));
const core = require(path.join(proto, 'brush-core.js'));
const LEGACY_DIR = path.resolve(proto, '..', 'KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_BRUSH_PLAYGROUND_R1/Demo Brushes');
const BRUSH_DIR = tilde(process.env.BRUSH_DIR) || [path.join(proto, 'brushes'), LEGACY_DIR].find(d => fs.existsSync(d)) || tilde('~/Downloads');
const PRIV = tilde(process.env.EVIDENCE_PRIVATE || path.join(proto, 'evidence-private', 'run'));
const PUB = path.join(proto, 'evidence');
fs.mkdirSync(PRIV, { recursive: true }); fs.mkdirSync(PUB, { recursive: true });
const CRAY = path.join(BRUSH_DIR, 'The_CRAYONIC (1).brush'), PASTEL = path.join(BRUSH_DIR, 'The_PASTEL.brush'), ACRY = path.join(BRUSH_DIR, 'The_ACRYLOID_dry_2.0.brush');
const SET = path.join(BRUSH_DIR, 'GvW_Comic_Ink_Brushes_02.brushset'), MEGA = path.join(BRUSH_DIR, 'GvW Inktober MEGA MARKER WET P5.brush');
for (const f of [CRAY, PASTEL, ACRY, SET, MEGA]) if (!fs.existsSync(f)) { console.error('missing private brush: ' + f); process.exit(2); }

const results = []; const metrics = {};
async function t(name, fn) {
  try { const info = await fn(); results.push({ status: 'PASS', name, info: info || '' }); console.log('PASS ', name, info ? '· ' + info : ''); }
  catch (e) { results.push({ status: 'FAIL', name, info: e.message }); console.log('FAIL ', name, '·', e.message); }
}
const ok = (c, m) => { if (!c) throw Error(m); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 960 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [], requests = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => requests.push(r.url()));
const cdp = await ctx.newCDPSession(page);
await page.goto('file://' + path.join(proto, 'index.html'));
let box = await page.locator('#paper').boundingBox();
const S = 1600 / box.width; // canvas px per css px
// buttons below the fold scroll the page, so input helpers re-read the canvas position every time
const fresh = async () => { await page.evaluate(() => window.scrollTo(0, 0)); box = await page.locator('#paper').boundingBox(); };

/* ---- input helpers (css coordinates relative to the canvas) ---- */
async function pen(points, opts = {}) {
  await fresh();
  const send = (type, x, y, force, extra) => cdp.send('Input.dispatchMouseEvent', Object.assign({ type, x: box.x + x, y: box.y + y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1, pointerType: 'pen', force }, extra));
  const ex = opts.tiltX != null ? { tiltX: opts.tiltX, tiltY: opts.tiltY || 0 } : {};
  await send('mousePressed', points[0][0], points[0][1], points[0][2], ex);
  for (const [x, y, f] of points.slice(1)) { await send('mouseMoved', x, y, f, ex); await page.waitForTimeout(opts.dt ?? 12); }
  const l = points[points.length - 1]; await send('mouseReleased', l[0], l[1], 0, ex);
  await page.waitForTimeout(30);
}
async function mouse(points, dt) {
  await fresh();
  await page.mouse.move(box.x + points[0][0], box.y + points[0][1]); await page.mouse.down();
  for (const [x, y] of points.slice(1)) { await page.mouse.move(box.x + x, box.y + y); await page.waitForTimeout(dt); }
  await page.mouse.up(); await page.waitForTimeout(30);
}
const hline = (x0, x1, y, n, f) => Array.from({ length: n + 1 }, (_, i) => [x0 + (x1 - x0) * i / n, y, typeof f === 'function' ? f(i / n) : f]);

/* ---- pixel helpers (canvas px) ---- */
const px = (fn, ...a) => page.evaluate(fn, ...a);
const hash = () => px(() => { const d = document.getElementById('paper').getContext('2d').getImageData(0, 0, 1600, 1000).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); });
const regionHash = r => px(r => { const d = document.getElementById('paper').getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }, r);
// thickness (alpha>20 rows) and mean alpha of a column band [x, x+w) between y0..y1
const band = (x, w, y0, y1) => px(([x, w, y0, y1]) => {
  const d = document.getElementById('paper').getContext('2d').getImageData(x, y0, w, y1 - y0).data; let th = 0, sa = 0, n = 0, r = 0, g = 0, b = 0, amax = 0;
  for (let c = 0; c < w; c++) { let rows = 0; for (let y = 0; y < y1 - y0; y++) { const i = (y * w + c) * 4, a = d[i + 3]; if (a > 20) { rows++; sa += a; n++; r += d[i]; g += d[i + 1]; b += d[i + 2]; } amax = Math.max(amax, a); } th += rows; }
  return { thickness: th / w, meanAlpha: n ? sa / n / 255 : 0, maxAlpha: amax / 255, rgb: n ? [r / n, g / n, b / n].map(Math.round) : null, n };
}, [x, w, y0, y1].map(Math.round));
const C = v => v * S; // css -> canvas
const setVal = (sel, v) => page.$eval(sel, (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));

/* ================= tests ================= */
await t('B01 page loads from file:// without errors', async () => { ok(await page.title() === 'Georg Brush Playground', 'title'); ok(!errors.length, errors.join('; ')); });

await t('B02 private CRAYONIC import: archive decoded, original shape isolated', async () => {
  await page.setInputFiles('#file', CRAY);
  await page.waitForFunction(() => KFB.brushes().length === 1);
  const [b] = await px(() => KFB.brushes());
  ok(b.name === 'The CRAYONIC' && b.fields === 52, JSON.stringify(b));
  ok(b.shape[0] === 1024 && b.grain === 'substitute' && b.hasReference, 'shape/grain/ref');
  ok(await page.locator('#iso').isVisible(), 'isolation tiles hidden');
  // luminance -> alpha: stamp must be transparent in the corner and opaque in the middle (not a square)
  const a = await px(() => { const x = document.getElementById('isoMask').getContext('2d'); return [x.getImageData(4, 4, 1, 1).data[3], x.getImageData(128, 128, 1, 1).data[3]]; });
  ok(a[0] === 0 && a[1] > 120, 'mask alpha corner/center ' + a);
  ok(/SUBSTITUTE/.test(await page.textContent('#isoGrainLabel')), 'substitute grain not labelled');
  await page.locator('.inspector').screenshot({ path: path.join(PRIV, 'B02_inspector_isolation.png') });
  return `${b.fields} fields · shape ${b.shape.join('×')} · stamp alpha corner ${a[0]} / centre ${a[1]}`;
});

await t('B03 pen pressure: hardware pressure reaches the stroke and widens it', async () => {
  await pen(hline(60, 760, 70, 70, f => 0.05 + 0.95 * f));
  const h = await px(() => KFB.history()); const s = h.strokes[0];
  ok(s.input === 'pen' && s.pmin < 0.1 && s.pmax > 0.95, JSON.stringify(s));
  const lo = await band(C(140), 20, C(20), C(120)), hi = await band(C(680), 20, C(20), C(120));
  ok(hi.thickness > lo.thickness * 2, `thickness light ${lo.thickness.toFixed(1)} vs heavy ${hi.thickness.toFixed(1)}`);
  metrics.pressure = { light: lo, heavy: hi };
  return `pressure ${s.pmin.toFixed(2)}→${s.pmax.toFixed(2)} · thickness ${lo.thickness.toFixed(1)} → ${hi.thickness.toFixed(1)} px`;
});

await t('B04 pen tilt: tilted pen paints wider (tiltSize 0.39)', async () => {
  await pen(hline(60, 360, 160, 30, 0.8));
  await pen(hline(420, 720, 160, 30, 0.8), { tiltX: 60 });
  const flat = await band(C(150), 30, C(110), C(215)), tilt = await band(C(520), 30, C(110), C(215));
  ok(tilt.thickness > flat.thickness * 1.12, `upright ${flat.thickness.toFixed(1)} vs tilted ${tilt.thickness.toFixed(1)}`);
  metrics.tilt = { upright: flat, tilted: tilt };
  return `upright ${flat.thickness.toFixed(1)} px · tilted ${tilt.thickness.toFixed(1)} px`;
});

await t('B05 speed: fast stroke lighter (speedOpacity .76) and wider (speedSize −.27)', async () => {
  await mouse(hline(60, 360, 250, 100, 0), 16);   // ~0.19 css px/ms
  await mouse(hline(420, 720, 250, 8, 0), 16);    // ~2.3 css px/ms
  const slow = await band(C(150), 40, C(200), C(305)), fast = await band(C(520), 40, C(200), C(305));
  ok(fast.meanAlpha < slow.meanAlpha * 0.85, `alpha slow ${slow.meanAlpha.toFixed(3)} fast ${fast.meanAlpha.toFixed(3)}`);
  ok(fast.thickness > slow.thickness * 1.05, `thickness slow ${slow.thickness.toFixed(1)} fast ${fast.thickness.toFixed(1)}`);
  metrics.speed = { slow, fast };
  return `alpha ${slow.meanAlpha.toFixed(3)} → ${fast.meanAlpha.toFixed(3)} · thickness ${slow.thickness.toFixed(1)} → ${fast.thickness.toFixed(1)}`;
});

await t('B06 color, size and opacity controls act on new strokes', async () => {
  const before = await band(C(150), 40, C(200), C(305));
  await setVal('#color', '#c0392b'); await setVal('#size', 140); await setVal('#opacity', 0.4);
  await mouse(hline(60, 360, 360, 100, 0), 16);
  const r = await band(C(150), 40, C(300), C(430));
  ok(r.rgb && r.rgb[0] > r.rgb[1] + 80 && r.rgb[0] > r.rgb[2] + 80, 'not red ' + r.rgb);
  ok(r.maxAlpha <= 0.4 + 0.02, 'opacity cap ' + r.maxAlpha.toFixed(3));
  ok(r.thickness > before.thickness * 1.6, `size ${before.thickness.toFixed(1)} → ${r.thickness.toFixed(1)}`);
  await setVal('#color', '#2b211d'); await setVal('#size', 70); await setVal('#opacity', 1);
  metrics.controls = r;
  return `rgb ${r.rgb} · max alpha ${r.maxAlpha.toFixed(3)} · thickness ${r.thickness.toFixed(1)}`;
});

await t('B07 undo/redo restore exact pixels (deterministic replay)', async () => {
  const hAfter = await hash();
  await page.click('#undo'); const hUndo = await hash();
  await page.click('#undo'); await page.click('#redo'); await page.click('#redo');
  const hRedo = await hash();
  ok(hUndo !== hAfter, 'undo changed nothing');
  ok(hRedo === hAfter, `redo ${hRedo} != ${hAfter}`);
  await page.keyboard.press('Meta+z'); ok(await hash() === hUndo, 'Cmd+Z'); await page.keyboard.press('Meta+Shift+z'); ok(await hash() === hAfter, 'Shift+Cmd+Z');
  return 'hash ' + hAfter + ' restored after undo×2/redo×2 and keyboard';
});

await t('B08 brush switch: strokes keep their own brush across undo rebuilds', async () => {
  const first = { x: Math.round(C(60)), y: Math.round(C(20)), w: Math.round(C(700)), h: Math.round(C(100)) };
  const h0 = await regionHash(first);
  await page.setInputFiles('#file', PASTEL); await page.waitForFunction(() => KFB.brushes().length === 2 && KFB.current() === KFB.brushes()[1].id);
  await pen(hline(60, 760, 470, 60, 0.9));
  const ids = await px(() => KFB.brushes().map(b => b.id));
  await px(id => KFB.select(id), ids[0]);
  await pen(hline(60, 760, 540, 60, 0.9));
  const hAll = await hash();
  for (let i = 0; i < 3; i++) await page.click('#undo');
  for (let i = 0; i < 3; i++) await page.click('#redo');
  ok(await hash() === hAll, 'rebuild differs');
  ok(await regionHash(first) === h0, 'first CRAYONIC stroke changed after brush switch');
  const h = await px(() => KFB.history().strokes.map(s => s.brushId.slice(6, 12)));
  ok(new Set(h).size === 2, 'expected two brush ids: ' + h);
  return 'stroke brushes ' + h.join(',');
});

await t('B09 eraser removes paint, undo restores it', async () => {
  const sumA = b => b.meanAlpha * b.n;
  const bx = C(415) - 15, before = await band(bx, 30, C(20), C(120)), h0 = await hash();
  await page.click('#eraser');
  await mouse([[415, 0], [415, 40], [415, 80], [415, 120]].map(p => [p[0], p[1] + 10]), 30);
  await page.click('#brushMode');
  const after = await band(bx, 30, C(20), C(120));
  ok(sumA(after) < sumA(before) * 0.3, `alpha sum ${sumA(before).toFixed(0)} → ${sumA(after).toFixed(0)}`);
  await page.click('#undo'); ok(await hash() === h0, 'undo eraser');
  await page.click('#redo');
  return `alpha sum in band ${sumA(before).toFixed(0)} → ${sumA(after).toFixed(0)} (painted px ${before.n} → ${after.n})`;
});

await t('B10 clear is undoable', async () => {
  const h0 = await hash(); await page.click('#clear');
  const n = await band(0, 1600, 0, 1000); ok(n.n === 0, 'not empty');
  await page.click('#undo'); ok(await hash() === h0, 'undo clear');
  return 'cleared and restored';
});

await t('B11 transparent PNG export (download) matches canvas', async () => {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#png')]);
  const f = path.join(PRIV, 'B11_export_transparent.png'); await dl.saveAs(f);
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  ok(info.width === 1600 && info.height === 1000 && info.channels === 4, JSON.stringify(info));
  let painted = 0, transparent = 0; for (let i = 3; i < data.length; i += 4) { if (data[i] > 20) painted++; if (data[i] === 0) transparent++; }
  const onCanvas = (await band(0, 1600, 0, 1000)).n;
  ok(data[3] === 0, 'corner not transparent');
  ok(Math.abs(painted - onCanvas) / onCanvas < 0.001, `png ${painted} vs canvas ${onCanvas}`);
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#pngOpaque')]);
  const f2 = path.join(PRIV, 'B11_export_paper.png'); await dl2.saveAs(f2);
  const o = await sharp(f2).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  ok(o.data[3] === 255, 'paper export corner not opaque');
  fs.copyFileSync(f, path.join(PUB, 'export_transparent.png'));
  metrics.export = { width: info.width, height: info.height, painted, transparent, file: dl.suggestedFilename() };
  return `${info.width}×${info.height} RGBA · ${painted} painted px · ${transparent} fully transparent px`;
});

await t('B12 comparison with original Procreate strokes (file previews)', async () => {
  await page.setInputFiles('#file', ACRY); await page.waitForFunction(() => KFB.brushes().length === 3);
  const all = await px(() => KFB.brushes().map(b => { KFB.select(b.id); return KFB.compare(b.id); }));
  const ids = await px(() => KFB.brushes().map(b => b.id));
  for (const [i, id] of ids.entries()) { await px(id => { KFB.select(id); KFB.compare(id); }, id); await page.locator('#refBox').screenshot({ path: path.join(PRIV, `B12_compare_${i}.png`) }); }
  metrics.comparison = all;
  const cr = all.find(r => r.brush === 'The CRAYONIC');
  ok(cr.silhouetteIoU >= 0.75, 'CRAYONIC silhouette IoU ' + cr.silhouetteIoU);
  await px(id => KFB.select(id), ids[0]);
  return all.map(r => `${r.brush}: IoU ${r.silhouetteIoU}, width err ${r.widthProfileError}, alpha ${r.meanAlphaSim}/${r.meanAlphaRef}, σ ${r.alphaStdSim}/${r.alphaStdRef}`).join(' | ');
});

await t('B13 rejects broken files; a set without usable brushes is an error with reasons', async () => {
  const bad = path.join(PRIV, 'not-a-brush.brush'); fs.writeFileSync(bad, 'hello');
  await page.setInputFiles('#file', bad); await page.waitForFunction(() => /Import error/.test(document.getElementById('status').textContent));
  const set = path.join(PRIV, 'fake.brush'); fs.writeFileSync(set, fflate.zipSync({ 'brushset.plist': new Uint8Array(8), 'a/Brush.archive': new Uint8Array(8) }));
  await page.setInputFiles('#file', set); await page.waitForFunction(() => /no usable brush in this set · skipped 1/.test(document.getElementById('status').textContent));
  ok((await px(() => KFB.brushes().length)) === 3, 'bad file was added');
  return (await page.textContent('#status')).slice(0, 120);
});


/* ================= R1.6 · brushset, curves, grain replace, sessions ================= */
await t('B18 real .brushset import: 21 brushes, set name and order, grouped and filterable', async () => {
  const n0 = await px(() => KFB.brushes().length);
  await page.setInputFiles('#file', SET);
  await page.waitForFunction(() => /Loaded set|Import error/.test(document.getElementById('status').textContent), null, { timeout: 60000 });
  const st = await page.textContent('#status');
  const bs = (await px(() => KFB.brushes())).slice(n0);
  ok(bs.length === 21, bs.length + ' brushes · ' + st);
  const expected = core.inspectArchive(fs.readFileSync(SET), fflate).setName; // read independently in Node
  ok(new Set(bs.map(b => b.setName)).size === 1 && bs[0].setName === expected, 'set name ' + bs[0].setName + ' vs ' + expected);
  ok(bs[0].name === 'GvW DUPA SKETCHPAINT color tilt P5', 'plist order, first = ' + bs[0].name);
  ok(bs.every(b => b.fields >= 169), 'field counts');
  const groups = await page.$$eval('#lib .group', els => els.map(e => e.textContent));
  ok(groups.some(g => /21/.test(g)), 'group header ' + groups);
  await setVal('#libSearch', 'kolinsky');
  const shown = await page.$$eval('#lib li[role=option]', els => els.length);
  await setVal('#libSearch', '');
  const want = (await px(() => KFB.brushes())).filter(b => /kolinsky/i.test(b.name)).length;
  ok(shown === want && want > 0, 'filter kolinsky shows ' + shown + ', expected ' + want);
  metrics.brushset = { brushes: bs.length, setName: bs[0].setName, grains: bs.reduce((m, b) => (m[b.grain || 'none'] = (m[b.grain || 'none'] || 0) + 1, m), {}) };
  return `${bs.length} brushes · “${bs[0].setName}” · filter “kolinsky” → ${shown} · grains ${JSON.stringify(metrics.brushset.grains)}`;
});

await t('B19 importing the same set again adds no duplicates', async () => {
  const n0 = await px(() => KFB.brushes().length);
  await page.setInputFiles('#file', SET);
  await page.waitForFunction(() => /already imported/.test(document.getElementById('status').textContent), null, { timeout: 60000 });
  ok(await px(() => KFB.brushes().length) === n0, 'count changed');
  return (await page.textContent('#status')).slice(0, 110);
});

await t('B20 Procreate 5 pressure curve decoded (MEGA MARKER WET P5)', async () => {
  await page.setInputFiles('#file', MEGA);
  await page.waitForFunction(() => KFB.brushes().some(b => /MEGA MARKER/.test(b.name)));
  const b = await px(() => KFB.brushes().find(b => /MEGA MARKER/.test(b.name)));
  ok(b.fields === 175 && b.sizeCurve, JSON.stringify(b));
  return `${b.fields} fields · size curve decoded`;
});

await t('B21 replace grain: new strokes use the new grain, older strokes keep theirs', async () => {
  const cray = await px(() => KFB.brushes().find(b => b.name === 'The CRAYONIC').id);
  await px(id => KFB.select(id), cray);
  const reg = { x: Math.round(C(60)), y: Math.round(C(130)), w: Math.round(C(320)), h: Math.round(C(60)) };
  const h0 = await regionHash(reg);
  const g = path.join(PRIV, 'test-grain.png');
  await sharp({ create: { width: 256, height: 256, channels: 3, background: '#fff' } }).composite([{ input: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><g stroke="#000" stroke-width="5">' + Array.from({ length: 32 }, (_, i) => `<line x1="0" y1="${i * 8}" x2="256" y2="${i * 8}"/>`).join('') + '</g></svg>') }]).png().toFile(g);
  await page.setInputFiles('#grainFile', g);
  await page.waitForFunction(() => /Grain replaced/.test(document.getElementById('status').textContent));
  const b = await px(id => KFB.brushes().find(b => b.id === id), cray);
  ok(b.grain === 'user' && b.grainVersions === 2, JSON.stringify(b));
  await pen(hline(60, 360, 230, 30, 0.9));
  const n = (await px(() => KFB.history())).done;
  await px(n => { for (let i = 0; i < n; i++) KFB.undo(); for (let i = 0; i < n; i++) KFB.redo(); }, n);
  ok(await regionHash(reg) === h0, 'old stroke changed after grain replace + rebuild');
  const last = await px(() => KFB.lastStroke());
  ok(last.grainIdx === 1, 'new stroke grainIdx ' + last.grainIdx);
  return `grain versions 2 · old stroke region unchanged after ${n}× undo + ${n}× redo (full rebuild) · new stroke grainIdx 1`;
});

await t('B22 save drawing as JSON and load it in a fresh tab: identical pixels', async () => {
  const hBefore = await hash();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#saveSession')]);
  const f = path.join(PRIV, 'B22_drawing.json'); await dl.saveAs(f);
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  ok(j.format === 'kfb.brush-playground.session/1' && j.actions.length > 5, 'format/actions');
  ok(!/Shape\.png|data:image|iVBOR/.test(fs.readFileSync(f, 'utf8')), 'session contains image data');
  const p2 = await ctx.newPage(); const e2 = []; p2.on('pageerror', e => e2.push(e.message));
  await p2.goto('file://' + path.join(proto, 'index.html'));
  await p2.setInputFiles('#loadSession', f);
  await p2.waitForFunction(() => /Load error/.test(document.getElementById('status').textContent));
  const missingMsg = await p2.textContent('#status');
  ok(/CRAYONIC/.test(missingMsg), 'missing-brush message: ' + missingMsg);
  await p2.setInputFiles('#file', [CRAY, PASTEL, ACRY, SET]);
  await p2.waitForFunction(() => KFB.brushes().length >= 24, null, { timeout: 60000 });
  // grain versions are part of the session state: replay the same replacement in the fresh tab
  await p2.evaluate(id => KFB.select(id), await px(() => KFB.brushes().find(b => b.name === 'The CRAYONIC').id));
  await p2.setInputFiles('#grainFile', path.join(PRIV, 'test-grain.png'));
  await p2.waitForFunction(() => /Grain replaced/.test(document.getElementById('status').textContent));
  await p2.setInputFiles('#loadSession', f);
  await p2.waitForFunction(() => /Loaded drawing/.test(document.getElementById('status').textContent));
  const h2 = await p2.evaluate(() => { const d = document.getElementById('paper').getContext('2d').getImageData(0, 0, 1600, 1000).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); });
  await p2.close();
  ok(!e2.length, e2.join('; '));
  ok(h2 === hBefore, `fresh tab ${h2} vs ${hBefore}`);
  return `${j.actions.length} actions, ${(fs.statSync(f).size / 1024).toFixed(0)} KB, no image data · missing brushes named · fresh-tab hash ${h2} identical`;
});

await t('B23 comparison over all 21 set brushes against their Procreate previews', async () => {
  const rows = await px(() => KFB.brushes().filter(b => b.setName).map(b => KFB.compare(b.id)));
  ok(rows.length === 21, rows.length + ' set brushes compared');
  const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const iou = rows.map(r => r.silhouetteIoU), dA = rows.map(r => Math.abs(r.meanAlphaSim - r.meanAlphaRef));
  metrics.brushsetComparison = { medianIoU: med(iou), minIoU: Math.min(...iou), medianAlphaError: +med(dA).toFixed(3), rows };
  ok(med(iou) >= 0.8, 'median IoU ' + med(iou));
  return `median IoU ${med(iou)} (min ${Math.min(...iou)}) · median |α sim − ref| ${med(dA).toFixed(3)}`;
});

await t('B24 drawing with four set brushes (pen, pressure ramps)', async () => {
  const names = ['GvW INKUS MAXIMUS black P5', 'GvW KOLINSKY 2.1', 'GvW DUPA Marker', 'GvW PEYO 2.0'];
  const all = await px(() => KFB.brushes());
  const used = [];
  for (const [i, n] of names.entries()) {
    const b = all.find(x => x.name === n); ok(b, 'missing ' + n);
    await px(id => KFB.select(id), b.id);
    await setVal('#size', 34);
    const y = 345 + i * 32;
    await pen(Array.from({ length: 41 }, (_, k) => [430 + k * 8, y + Math.sin(k / 6) * 9, 0.1 + 0.9 * Math.sin(Math.PI * k / 40)]));
    used.push((await px(() => KFB.lastStroke())).brushId === b.id);
  }
  await setVal('#size', 70);
  ok(used.every(Boolean), 'brush ids ' + used);
  return names.join(', ');
});

/* ---- screenshots (before the synthetic performance strokes) ---- */
await page.evaluate(() => window.scrollTo(0, 0));
await px(() => KFB.select(KFB.brushes()[0].id));
await px(() => KFB.compare(KFB.brushes()[0].id));
await page.screenshot({ path: path.join(PRIV, 'editor_full_private.png') });
await page.locator('aside.panel').first().screenshot({ path: path.join(PRIV, 'library_brushset_private.png') });
await page.locator('#paper').screenshot({ path: path.join(PUB, 'canvas_drawing.png') });
const mask = await page.addStyleTag({ content: '.inspector canvas,.lib canvas{visibility:hidden}' });
await page.screenshot({ path: path.join(PUB, 'editor_ui_inspector_masked.png') });
await mask.evaluate(n => n.remove());

await t('B14 performance: live frame and commit cost, 60-stroke rebuild', async () => {
  await px(() => KFB.resetPerf());
  const yMid = box.height * 0.86;
  const long = Array.from({ length: 241 }, (_, i) => [80 + i * 2.8, yMid + Math.sin(i / 20) * 25, 0.4 + 0.5 * Math.abs(Math.sin(i / 30))]);
  const n0 = (await px(() => KFB.history())).strokes.length;
  await pen(long, { dt: 8 });
  const perf = await px(() => KFB.perf());
  ok((await px(() => KFB.history())).strokes.length === n0 + 1, 'live pen stroke not recorded');
  const rec = await px(() => KFB.lastStroke()), y0 = C(yMid), pts0 = rec.points;
  for (let i = 0; i < 52; i++) { rec.seed = 1000 + i; rec.points = pts0.map(p => ({ ...p, y: 80 + (i % 26) * 34 + (p.y - y0) * 0.4 })); await px(r => KFB.addStroke(r), rec); }
  await page.click('#undo');
  const rebuild = await px(() => KFB.rebuildMs()); await page.click('#redo');
  const strokes = (await px(() => KFB.history())).strokes.length;
  metrics.performance = { frames: perf.frames, frameMsMean: +(perf.frameMsSum / perf.frames).toFixed(2), frameMsMax: +perf.frameMsMax.toFixed(2), commitMsMax: +perf.commitMsMax.toFixed(2), rebuildMs: +rebuild.toFixed(1), strokes };
  ok(perf.frameMsSum / perf.frames < 8, 'mean frame cost ' + (perf.frameMsSum / perf.frames).toFixed(2));
  return JSON.stringify(metrics.performance);
});

await t('B15 privacy: no network requests besides local files', async () => {
  const remote = requests.filter(u => !u.startsWith('file:') && !u.startsWith('blob:') && !u.startsWith('data:'));
  ok(!remote.length, remote.join(', '));
  return requests.length + ' requests, all file:/blob:';
});


await t('B16 narrow viewport (iPad portrait 820×1180): no horizontal scroll', async () => {
  await page.setViewportSize({ width: 820, height: 1180 }); await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: '.inspector canvas,.lib canvas{visibility:hidden}' });
  const w = await px(() => [document.documentElement.scrollWidth, innerWidth]);
  ok(w[0] <= w[1], 'scrollWidth ' + w);
  await page.screenshot({ path: path.join(PUB, 'editor_ipad_portrait_masked.png') });
  return 'scrollWidth ' + w[0] + ' / ' + w[1];
});

await t('B17 no console errors during the whole run', async () => { ok(!errors.length, errors.join('; ')); });

await browser.close();
const summary = { date: new Date().toISOString(), browser: 'chromium ' + browser.version(), pass: results.filter(r => r.status === 'PASS').length, fail: results.filter(r => r.status === 'FAIL').length, results, metrics };
fs.writeFileSync(path.join(PRIV, 'results.json'), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(PUB, 'browser-results.json'), JSON.stringify(summary, null, 2));
console.log(`\n${summary.pass} passed, ${summary.fail} failed · ${summary.browser}`);
process.exit(summary.fail ? 1 : 0);
