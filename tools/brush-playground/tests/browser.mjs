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
const fresh = async () => { await page.evaluate(() => { window.scrollTo(0, 0); KFB.ui.closeAll(); KFB.ui.closeStudio(); }); box = await page.locator('#paper').boundingBox(); };
// the Procreate-style UI keeps commands in the Actions popover: open it, pick the tab, click the row
const action = async (tab, id) => { await page.evaluate(() => KFB.ui.closeAll()); await page.click('#btnActions'); await page.click(`#popActions .tab[data-tab="${tab}"]`); await page.click('#' + id); };
// public screenshots hide what comes straight from the brush file: shape, derived stamp, grain, Procreate's preview
const MASK = '#isoShape,#isoMask,#isoGrain,#refCanvas{visibility:hidden}';

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
const hash = () => px(() => { const d = KFB.flatCanvas().getContext('2d').getImageData(0, 0, 1600, 1000).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); });
const regionHash = r => px(r => { const d = KFB.flatCanvas().getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }, r);
// thickness (alpha>20 rows) and mean alpha of a column band [x, x+w) between y0..y1
const band = (x, w, y0, y1) => px(([x, w, y0, y1]) => {
  /* layers without background */ const d = KFB.flatCanvas().getContext('2d').getImageData(x, y0, w, y1 - y0).data; let th = 0, sa = 0, n = 0, r = 0, g = 0, b = 0, amax = 0;
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
  await px(() => KFB.ui.openStudio('shape'));
  ok(await page.locator('#iso').isVisible(), 'isolation tiles hidden in Brush Studio · Shape');
  // luminance -> alpha: stamp must be transparent in the corner and opaque in the middle (not a square)
  const a = await px(() => { const x = document.getElementById('isoMask').getContext('2d'); return [x.getImageData(4, 4, 1, 1).data[3], x.getImageData(128, 128, 1, 1).data[3]]; });
  ok(a[0] === 0 && a[1] > 120, 'mask alpha corner/center ' + a);
  ok(/SUBSTITUTE/.test(await page.textContent('#isoGrainLabel')), 'substitute grain not labelled');
  await page.screenshot({ path: path.join(PRIV, 'B02_studio_shape_isolation.png') });
  await px(() => KFB.ui.openStudio('grain')); await page.screenshot({ path: path.join(PRIV, 'B02_studio_grain.png') });
  await px(() => KFB.ui.closeStudio());
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
  await mouse(hline(420, 1000, 250, 16, 0), 16);  // ~2.3 css px/ms; long enough for the speed smoothing to settle
  const slow = await band(C(150), 40, C(200), C(305)), fast = await band(C(820), 40, C(200), C(305)); // second half of the fast stroke
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
  const h0 = await hash(); await action('canvas', 'clear');
  const n = await band(0, 1600, 0, 1000); ok(n.n === 0, 'not empty');
  await page.click('#undo'); ok(await hash() === h0, 'undo clear');
  return 'cleared and restored';
});

await t('B11 transparent PNG export (download) matches canvas', async () => {
  const [dl] = await Promise.all([page.waitForEvent('download'), action('share', 'png')]);
  const f = path.join(PRIV, 'B11_export_transparent.png'); await dl.saveAs(f);
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  ok(info.width === 1600 && info.height === 1000 && info.channels === 4, JSON.stringify(info));
  let painted = 0, transparent = 0; for (let i = 3; i < data.length; i += 4) { if (data[i] > 20) painted++; if (data[i] === 0) transparent++; }
  const onCanvas = (await band(0, 1600, 0, 1000)).n;
  ok(data[3] === 0, 'corner not transparent');
  ok(Math.abs(painted - onCanvas) / onCanvas < 0.001, `png ${painted} vs canvas ${onCanvas}`);
  const [dl2] = await Promise.all([page.waitForEvent('download'), action('share', 'pngOpaque')]);
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
  for (const [i, id] of ids.entries()) { await px(id => { KFB.select(id); KFB.ui.openStudio('about'); KFB.compare(id); }, id); await page.locator('[data-section="about"]').screenshot({ path: path.join(PRIV, `B12_compare_${i}.png`) }); }
  await px(() => KFB.ui.closeStudio());
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
  const groups = await page.$$eval('#libSets li', els => els.map(e => e.textContent));
  ok(groups.some(g => /21$/.test(g)), 'set list ' + groups);
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
  const [dl] = await Promise.all([page.waitForEvent('download'), action('share', 'saveSession')]);
  const f = path.join(PRIV, 'B22_drawing.json'); await dl.saveAs(f);
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  ok(j.format === 'kfb.brush-playground.session/2' && j.actions.length > 5, 'format/actions ' + j.format + ' ' + j.actions.length);
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
  // a single-layer drawing saved by R1.6 (session/1, no layer ids) must load into Layer 1 identically
  const v1 = JSON.parse(fs.readFileSync(f, 'utf8')); v1.format = 'kfb.brush-playground.session/1'; for (const a of v1.actions) delete a.layerId;
  const f1 = path.join(PRIV, 'B22_drawing_v1.json'); fs.writeFileSync(f1, JSON.stringify(v1));
  await p2.evaluate(() => { document.getElementById('status').textContent = ''; });
  await p2.setInputFiles('#loadSession', f1);
  await p2.waitForFunction(() => /Loaded drawing/.test(document.getElementById('status').textContent));
  const hv1 = await p2.evaluate(() => { const d = KFB.flatCanvas().getContext('2d').getImageData(0, 0, 1600, 1000).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); });
  const h2 = await p2.evaluate(() => { const d = KFB.flatCanvas().getContext('2d').getImageData(0, 0, 1600, 1000).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); });
  await p2.close();
  ok(!e2.length, e2.join('; '));
  ok(h2 === hBefore, `fresh tab ${h2} vs ${hBefore}`);
  ok(hv1 === hBefore, `session/1 file ${hv1} vs ${hBefore}`);
  return `${j.actions.length} actions, ${(fs.statSync(f).size / 1024).toFixed(0)} KB, no image data · missing brushes named · fresh-tab hash ${h2} identical · session/1 file identical`;
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


/* ================= R1.7 · Procreate-style interface ================= */
await t('B25 eyedropper picks the red stroke colour and returns to the brush', async () => {
  await fresh();
  await page.click('#eyedrop');
  ok(await page.getAttribute('#eyedrop', 'aria-pressed') === 'true', 'eyedropper not active');
  await page.mouse.click(box.x + 210, box.y + 360);
  const c = await px(() => KFB.color()), rgb = core.fromHex(c);
  // the eyedropper samples the composite as seen: 40 % red over paper
  const seen = await px(([x, y]) => { const d = document.getElementById('paper').getContext('2d').getImageData(x, y, 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); }, [Math.floor(C(210)), Math.floor(C(360))]);
  ok(c === seen && rgb[0] > rgb[1] + 30 && rgb[0] > rgb[2] + 30, 'picked ' + c + ' vs view ' + seen);
  ok(await page.getAttribute('#brushMode', 'aria-pressed') === 'true', 'tool not restored');
  await px(() => KFB.setColor('#1f1a14'));
  return 'picked ' + c;
});

await t('B26 sidebar sliders: size is logarithmic px, opacity linear, keyboard steps', async () => {
  await fresh();
  const sb = await page.locator('#sizeSlider').boundingBox();
  await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height - 2); await page.mouse.down();
  await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 4 });
  const mid = Number(await page.inputValue('#size'));
  await page.mouse.move(sb.x + sb.width / 2, sb.y + 1, { steps: 4 }); await page.mouse.up();
  const top = Number(await page.inputValue('#size'));
  ok(mid > 18 && mid < 40 && top >= 370, `half → ${mid} px, top → ${top} px`);
  await page.focus('#sizeSlider'); await page.keyboard.press('ArrowDown');
  ok(Number(await page.inputValue('#size')) < top, 'ArrowDown');
  const ob = await page.locator('#opacitySlider').boundingBox();
  await page.mouse.click(ob.x + ob.width / 2, ob.y + ob.height / 2);
  const op = Number(await page.inputValue('#opacity'));
  ok(Math.abs(op - 0.525) < 0.04, 'opacity at half ' + op);
  await setVal('#size', 70); await setVal('#opacity', 1);
  return `size half ${mid} px · top ${top} px · opacity half ${op}`;
});

await t('B27 Brush Studio: an edited setting reaches the next stroke, the pad redraws, reset restores', async () => {
  const cray = await px(() => KFB.brushes().find(b => b.name === 'The CRAYONIC').id);
  await px(id => { KFB.select(id); KFB.ui.openStudio('stroke'); }, cray);
  const padBefore = await px(() => document.getElementById('pad').toDataURL().length);
  await setVal('#st_spacing', 0.4);
  await page.waitForTimeout(100);
  ok(await page.$eval('#snav [data-s="stroke"]', el => el.classList.contains('edited')), 'nav not marked edited');
  ok(/edited/i.test(await page.textContent('.set[data-k="spacing"] .chip')), 'chip not edited');
  const padAfter = await px(() => document.getElementById('pad').toDataURL().length);
  ok(padAfter !== padBefore, 'pad did not redraw');
  await page.screenshot({ path: path.join(PRIV, 'B27_studio_stroke_edited.png') });
  await pen(hline(430, 760, 500, 30, 0.8));
  const rec = await px(() => KFB.lastStroke());
  ok(Math.abs(rec.params.spacing - 0.4) < 1e-9, 'stroke spacing ' + rec.params.spacing);
  await px(() => KFB.ui.openStudio('stroke')); await page.click('#resetDyn');
  const eff = await px(id => KFB.brushParams(id).spacing, cray);
  ok(Math.abs(Number(await page.inputValue('#st_spacing')) - eff) < 0.006 && await page.isDisabled('#resetDyn'), 'reset ' + await page.inputValue('#st_spacing') + ' vs ' + eff);
  await px(() => KFB.ui.closeStudio());
  return `spacing 0.4 in stroke · pad redrawn · reset → ${eff.toFixed(3)}`;
});

await t('B28 Brush Library: tap active brush tool opens it, previews render, tap selected brush opens Studio', async () => {
  await fresh();
  await page.click('#brushMode');
  ok(await page.isVisible('#popBrushes'), 'library not open');
  await page.waitForFunction(() => [...document.querySelectorAll('#lib li canvas')].filter(c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 64) if (d[i]) return true; return false; }).length === document.querySelectorAll('#lib li canvas').length, null, { timeout: 15000 });
  const n = await page.$$eval('#lib li canvas', els => els.length);
  await page.locator('#libSets li').filter({ hasText: /21$/ }).click();
  const first = page.locator('#lib li[role=option]').first();
  await first.click();
  const sel = await px(() => KFB.current());
  ok(await first.getAttribute('aria-selected') === 'true', 'not selected');
  await page.screenshot({ path: path.join(PRIV, 'B28_library.png') });
  await first.click();
  ok(await page.isVisible('#studio'), 'second tap did not open Brush Studio');
  await px(() => KFB.ui.closeStudio());
  return `${n} previews rendered · selected ${sel.slice(6, 12)} · second tap → Brush Studio`;
});

await t('B29 colour disc and value sliders set HSB', async () => {
  await fresh();
  await page.click('#btnColor');
  const d = await page.locator('#disc').boundingBox();
  await page.mouse.click(d.x + d.width * 0.5, d.y + d.height * 0.5); // centre of the square: s .5, b .5
  const c1 = core.rgbToHsv(...core.fromHex(await px(() => KFB.color())));
  ok(Math.abs(c1[1] - 0.5) < 0.06 && Math.abs(c1[2] - 0.5) < 0.06, 'square centre hsv ' + c1.map(v => v.toFixed(2)));
  await page.mouse.click(d.x + d.width * 0.5, d.y + d.height * 0.035); // top of the ring = hue 0
  const c2 = core.rgbToHsv(...core.fromHex(await px(() => KFB.color())));
  ok(c2[0] < 0.03 || c2[0] > 0.97, 'ring top hue ' + c2[0]);
  await page.click('#popColor .tab[data-tab="value"]');
  await setVal('#hH', 120); await setVal('#hS', 100); await setVal('#hB', 100);
  ok(await px(() => KFB.color()) === '#00ff00', 'value sliders ' + await px(() => KFB.color()));
  await page.screenshot({ path: path.join(PRIV, 'B29_colour.png') });
  return 'square centre → s/b 0.5 · ring top → hue 0 · H120 S100 B100 → #00ff00';
});

await t('B30 palettes: swatch sets colour, .swatches import and export round trip', async () => {
  await page.click('#popColor .tab[data-tab="palettes"]');
  await page.click('#palettes .palette >> nth=0 >> .sw >> nth=0');
  ok(await px(() => KFB.color()) === '#e9c14a', 'swatch → ' + await px(() => KFB.color()));
  const cols = ['#c2412c', '#3e6a83', null, '#7a8d4a', '#1f1a14'];
  const f = path.join(PRIV, 'Test_Palette.swatches'); fs.writeFileSync(f, core.buildSwatches('Test Palette', cols, fflate));
  const n0 = (await px(() => KFB.palettes())).palettes.length;
  await page.setInputFiles('#swatchFile2', f);
  await page.waitForFunction(n0 => KFB.palettes().palettes.length === n0 + 1, n0);
  const pal = await px(() => KFB.palettes());
  ok(pal.palettes[pal.current].name === 'Test Palette' && pal.palettes[pal.current].colors.join() === cols.join(), JSON.stringify(pal.palettes[pal.current]));
  await page.screenshot({ path: path.join(PRIV, 'B30_palettes.png') });
  const [dl] = await Promise.all([page.waitForEvent('download'), action('share', 'swatchExport')]);
  const g = path.join(PRIV, 'B30_export.swatches'); await dl.saveAs(g);
  const [back] = core.parseSwatches(fs.readFileSync(g), fflate);
  ok(back.name === 'Test Palette' && back.colors.join() === cols.join(), JSON.stringify(back));
  return `swatch → #e9c14a · imported 5 slots · exported ${dl.suggestedFilename()} round trip identical`;
});

await t('B31 keyboard: B toggles the library, Esc closes, E/I switch tools', async () => {
  await fresh(); await page.click('#paper', { position: { x: 5, y: 5 }, trial: true });
  await page.keyboard.press('b'); ok(await page.isVisible('#popBrushes'), 'b did not open library');
  await page.keyboard.press('Escape'); ok(!(await page.isVisible('#popBrushes')), 'Esc');
  await page.keyboard.press('e'); ok(await page.getAttribute('#eraser', 'aria-pressed') === 'true', 'e');
  await page.keyboard.press('i'); ok(await page.getAttribute('#eyedrop', 'aria-pressed') === 'true', 'i');
  await page.keyboard.press('i'); await page.keyboard.press('b');
  ok(await page.getAttribute('#brushMode', 'aria-pressed') === 'true', 'back to brush');
  await page.keyboard.press('Escape');
  return 'b · Esc · e · i · b';
});

/* ================= R1.8 · layers ================= */
const viewPx = (x, y) => px(([x, y]) => Array.from(document.getElementById('paper').getContext('2d').getImageData(x, y, 1, 1).data), [Math.floor(x), Math.floor(y)]);
const layerAlpha = (id, r) => px(([id, r]) => { const L = KFB.layerCanvas(id); const d = L.getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++; return n; }, [id, r]);
const histDone = async () => (await px(() => KFB.history())).done;
const openLayers = async () => { if (!(await page.isVisible('#popLayers'))) await page.click('#btnLayers'); };
const openLayerOpts = async id => {
  await openLayers();
  if (!(await page.isVisible(`.lopts[data-for="${id}"]`))) await page.click(`#layerList li.layer[data-id="${id}"] .blendbtn`);
  await page.waitForTimeout(60); // the panel re-renders on the next frame after a selection
};

await t('B32 layers: new layer above, strokes go to the selected layer, hide/show, thumbnails', async () => {
  await fresh(); await setVal('#color', '#3e6a83');
  await page.click('#btnLayers'); await page.click('#layerAdd');
  let L = await px(() => KFB.layers());
  ok(L.layers.length === 2 && L.active === L.layers[1].id && L.layers[1].name === 'Layer 2', JSON.stringify(L));
  const h0 = await hash();
  await pen(hline(1000, 1300, 120, 30, 0.9));
  const L2 = L.active, r = { x: Math.round(C(990)), y: Math.round(C(80)), w: Math.round(C(330)), h: Math.round(C(80)) };
  ok(await layerAlpha(L2, r) > 500, 'stroke not on Layer 2');
  ok(await layerAlpha(L.layers[0].id, r) === 0, 'stroke leaked into Layer 1');
  const hWith = await hash();
  await openLayers(); await page.click(`#layerList li.layer[data-id="${L2}"] .vis`);
  ok(await hash() === h0, 'hidden layer still visible');
  await page.click(`#layerList li.layer[data-id="${L2}"] .vis`);
  ok(await hash() === hWith, 'shown again');
  const thumbs = await page.$$eval('#layerList canvas.thumb', cs => cs.map(c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; }));
  ok(thumbs.length === 2 && thumbs.every(n => n > 0), 'thumbnails ' + thumbs);
  ok((await page.textContent('#layerCount')) === '2 / 16', 'count');
  await page.screenshot({ path: path.join(PRIV, 'B32_layers.png') });
  return `Layer 2 active · stroke only on Layer 2 · hide/show exact · thumbnails ${thumbs.join('/')} px`;
});

await t('B33 blend mode Multiply is computed against what lies below (incl. paper)', async () => {
  const L2 = (await px(() => KFB.layers())).active;
  const at = [C(1150), C(120)];
  const normal = await viewPx(...at);
  await openLayerOpts(L2);
  await page.selectOption('#layerBlend', 'multiply');
  const mult = await viewPx(...at);
  ok(mult.slice(0, 3).every((v, i) => v <= normal[i]) && mult.slice(0, 3).some((v, i) => v < normal[i] - 4), `normal ${normal} vs multiply ${mult}`);
  const st = (await px(() => KFB.layers())).layers.find(l => l.id === L2);
  ok(st.blend === 'multiply' && /^M$/.test((await page.textContent(`#layerList li.layer[data-id="${L2}"] .blendbtn`)).trim()), 'label');
  await page.click('#undo'); ok((await px(() => KFB.layers())).layers.find(l => l.id === L2).blend === 'normal', 'undo blend');
  await page.click('#redo');
  return `pixel ${normal.slice(0, 3)} → ${mult.slice(0, 3)} · undo/redo`;
});

await t('B34 layer opacity: slider previews live, one undo step on release', async () => {
  const L2 = (await px(() => KFB.layers())).active, n0 = await histDone();
  await openLayerOpts(L2);
  const sl = page.locator('#layerOpacity'), b = await sl.boundingBox();
  await page.mouse.move(b.x + b.width - 2, b.y + b.height / 2); await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.6, b.y + b.height / 2, { steps: 3 });
  const mid = (await px(() => KFB.layers())).layers.find(l => l.id === L2).opacity;
  ok(await histDone() === n0, 'history grew during drag');
  await page.mouse.move(b.x + b.width * 0.3, b.y + b.height / 2, { steps: 3 }); await page.mouse.up();
  const end = (await px(() => KFB.layers())).layers.find(l => l.id === L2).opacity;
  ok(await histDone() === n0 + 1 && end < 0.4 && mid > end, `mid ${mid} end ${end} history ${n0} → ${await histDone()}`);
  await page.click('#undo'); ok((await px(() => KFB.layers())).layers.find(l => l.id === L2).opacity === 1, 'undo opacity');
  await page.click('#redo');
  return `drag preview ${mid.toFixed(2)} → commit ${end.toFixed(2)} as one step · undo → 1`;
});

await t('B35 alpha lock: paint stays inside existing paint of the layer', async () => {
  const L2 = (await px(() => KFB.layers())).active;
  await openLayerOpts(L2); await page.click('#layerAlpha');
  ok((await px(() => KFB.layers())).layers.find(l => l.id === L2).alphaLock, 'alpha lock not set');
  const outside = { x: Math.round(C(1000)), y: Math.round(C(170)), w: Math.round(C(300)), h: Math.round(C(60)) };
  const inside = { x: Math.round(C(1000)), y: Math.round(C(95)), w: Math.round(C(300)), h: Math.round(C(50)) };
  const redIn = () => px(([id, r]) => { const d = KFB.layerCanvas(id).getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 8 && d[i] > d[i + 2] + 40) n++; return n; }, [L2, inside]);
  const before = await layerAlpha(L2, outside), red0 = await redIn();
  await setVal('#color', '#c2412c');
  await pen(hline(1000, 1300, 120, 30, 1).map(([x, y, f], i) => [x, y + (i % 2 ? 50 : -10), f]));
  const after = await layerAlpha(L2, outside), red1 = await redIn();
  ok(after === before, `pixels outside existing paint ${before} → ${after}`);
  ok(red1 > red0 + 200, `red inside the existing paint ${red0} → ${red1}`);
  await openLayerOpts(L2); await page.click('#layerAlpha');
  await setVal('#color', '#1f1a14');
  return `zig-zag over the edge: outside ${before} → ${after} px · red inside ${red0} → ${red1} px`;
});

await t('B36 duplicate, move, merge down, delete: each one undo step, exact on undo and redo', async () => {
  const L2 = (await px(() => KFB.layers())).active;
  await openLayerOpts(L2);
  const states = [{ h: await hash(), n: (await px(() => KFB.layers())).layers.length }];
  const step = async label => { states.push({ h: await hash(), n: (await px(() => KFB.layers())).layers.length, label }); };
  await page.click('#layerDup'); await step('duplicate');
  const dup = (await px(() => KFB.layers())).active;
  await openLayerOpts(dup); await page.click('#layerDown'); await step('move down');
  await page.click('#layerMerge'); await step('merge down');
  const merged = (await px(() => KFB.layers())).active;
  await openLayerOpts(merged); await page.click('#layerDel'); await step('delete');
  ok(states.map(s => s.n).join() === '2,3,3,2,1', 'layer counts ' + states.map(s => s.n));
  for (let i = states.length - 1; i > 0; i--) { await page.click('#undo'); ok(await hash() === states[i - 1].h, 'undo ' + states[i].label); }
  for (let i = 1; i < states.length; i++) { await page.click('#redo'); ok(await hash() === states[i].h, 'redo ' + states[i].label); }
  for (let i = states.length - 1; i > 0; i--) await page.click('#undo');
  ok((await px(() => KFB.layers())).layers.length === 2, 'back to 2 layers');
  return 'layers 2 → 3 → 3 → 2 → 1 · every undo and redo pixel-identical';
});

await t('B37 background colour: hide shows transparency, swatch takes current colour, PNG transparent unaffected', async () => {
  await fresh();
  const corner = () => viewPx(3, 3);
  ok((await corner())[3] === 255, 'background not opaque');
  await openLayers(); await page.click('#bgVis');
  ok((await corner())[3] === 0, 'hidden background still painted');
  const flatA = await hash();
  await page.click('#bgVis');
  await setVal('#color', '#6b4e7d'); await openLayers(); await page.click('#bgColor');
  ok((await corner()).slice(0, 3).join() === '107,78,125', 'bg colour ' + await corner());
  ok(await hash() === flatA, 'layers changed by background');
  const [dl] = await Promise.all([page.waitForEvent('download'), action('share', 'pngOpaque')]);
  const f = path.join(PRIV, 'B37_paper_violet.png'); await dl.saveAs(f);
  const o = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  ok(o.data[0] === 107 && o.data[1] === 78 && o.data[2] === 125 && o.data[3] === 255, 'export bg ' + Array.from(o.data.slice(0, 4)));
  await page.click('#undo'); ok((await corner()).slice(0, 3).join() === '243,234,211', 'undo bg colour');
  await setVal('#color', '#1f1a14');
  return 'hide → α 0 · violet swatch → view and PNG on paper · undo → paper cream';
});

/* ================= R1.9 · clipping masks ================= */
const flatAlpha = r => px(r => { const d = KFB.flatCanvas().getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let s = 0, n = 0; for (let i = 3; i < d.length; i += 4) { s += d[i]; if (d[i] > 8) n++; } return { sum: s, n }; }, r);
const rowsOf = (id, x) => px(([id, x]) => { const d = KFB.layerCanvas(id).getContext('2d').getImageData(x, 0, 1, 1000).data; let y0 = -1, y1 = -1; for (let y = 0; y < 1000; y++) if (d[y * 4 + 3] > 8) { if (y0 < 0) y0 = y; y1 = y; } return [y0, y1]; }, [id, Math.round(x)]);
let CL = {};
await t('B38 clipping mask: clipped paint shows only inside the base, content kept, toggle + undo exact', async () => {
  await fresh(); await openLayers(); await page.click('#layerAdd');
  const base = (await px(() => KFB.layers())).active;
  await setVal('#size', 120); await setVal('#color', '#4f8a85');
  await pen(hline(1060, 1320, 440, 30, 1));
  await openLayers(); await page.click('#layerAdd');
  const clip = (await px(() => KFB.layers())).active;
  await openLayerOpts(clip); await page.click('#layerClip');
  ok((await px(() => KFB.layers())).layers.find(l => l.id === clip).clip, 'clip flag');
  await page.waitForSelector(`#layerList li.layer.clipped[data-id="${clip}"]`, { timeout: 3000 }).catch(() => null);
  ok(await page.$eval(`#layerList li.layer[data-id="${clip}"]`, el => el.classList.contains('clipped')), 'row not shown as clipped');
  await page.screenshot({ path: path.join(PRIV, 'B38_clip_panel.png') });
  await setVal('#size', 240); await setVal('#color', '#c2412c');
  await pen(hline(1000, 1360, 440, 40, 1));
  await setVal('#size', 70); await setVal('#color', '#1f1a14');
  const xc = C(1190), [b0, b1] = await rowsOf(base, xc), [c0, c1] = await rowsOf(clip, xc);
  ok(b0 > 0 && c0 < b0 - 8 && c1 > b1 + 8, `clipped stroke must extend beyond the base: base ${b0}-${b1}, clipped ${c0}-${c1}`);
  const outside = { x: Math.round(xc - 40), y: b1 + 4, w: 80, h: Math.max(4, c1 - b1 - 6) };
  const inside = { x: Math.round(xc - 40), y: Math.round((b0 + b1) / 2) - 6, w: 80, h: 12 };
  ok(await layerAlpha(clip, outside) > 100, 'clipped layer has no content outside the base (test region)');
  const out1 = await flatAlpha(outside);
  ok(out1.n === 0, 'clipped paint visible outside the base: ' + out1.n + ' px');
  const red = await px(r => { const d = KFB.flatCanvas().getContext('2d').getImageData(r.x, r.y, r.w, r.h).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 8 && d[i] > d[i + 1] + 40) n++; return n; }, inside);
  ok(red > 200, 'clipped colour not inside the base: ' + red);
  const hClip = await hash();
  await openLayerOpts(clip); await page.click('#layerClip');
  const out2 = await flatAlpha(outside);
  ok(out2.n > 100, 'clip off: paint outside should appear, got ' + out2.n);
  await page.click('#undo'); ok(await hash() === hClip, 'undo clip-off');
  await page.click('#redo'); ok((await flatAlpha(outside)).n === out2.n, 'redo clip-off');
  await page.click('#undo');
  CL = { base, clip, outside, inside, box: { x: Math.round(C(1000)), y: c0, w: Math.round(C(360)), h: c1 - c0 + 1 } };
  await page.screenshot({ path: path.join(PRIV, 'B38_clipping.png') });
  return `outside base: ${out1.n} px with clip, ${out2.n} px without · ${red} red px inside · undo/redo exact`;
});

await t('B39 clipped Multiply keeps the base coverage (no filling up)', async () => {
  const { base, clip } = CL, region = { x: CL.box.x, y: CL.box.y, w: CL.box.w, h: CL.box.h };
  await openLayerOpts(clip); await page.click(`#layerList li.layer[data-id="${clip}"] .vis`);
  const baseOnly = await flatAlpha(region), basePx = await viewPx(CL.inside.x + 40, CL.inside.y + 6);
  await page.click(`#layerList li.layer[data-id="${clip}"] .vis`);
  await openLayerOpts(clip); await page.selectOption('#layerBlend', 'multiply');
  const grp = await flatAlpha(region), mulPx = await viewPx(CL.inside.x + 40, CL.inside.y + 6);
  ok(Math.abs(grp.sum - baseOnly.sum) <= baseOnly.sum * 0.002, `alpha sum base ${baseOnly.sum} vs group ${grp.sum}`);
  ok(mulPx[1] < basePx[1] - 10, `multiply should darken green: ${basePx} → ${mulPx}`);
  return `alpha sum ${baseOnly.sum} → ${grp.sum} · pixel ${basePx.slice(0, 3)} → ${mulPx.slice(0, 3)}`;
});

await t('B40 hiding the base hides its clipping group', async () => {
  const { base, clip } = CL;
  await openLayers(); await page.click(`#layerList li.layer[data-id="${base}"] .vis`);
  const a = await flatAlpha(CL.box);
  ok(a.n === 0, 'group still visible: ' + a.n + ' px');
  await page.click(`#layerList li.layer[data-id="${base}"] .vis`);
  ok((await flatAlpha(CL.box)).n > 1000, 'group back');
  return 'base hidden → 0 px in the group area';
});

await t('B41 merge a clipped layer into its base: pixels unchanged, undo restores both layers', async () => {
  const { clip } = CL;
  await openLayerOpts(clip); await page.selectOption('#layerBlend', 'normal');
  const n0 = (await px(() => KFB.layers())).layers.length, h0 = await hash();
  await openLayerOpts(clip); await page.click('#layerMerge');
  ok((await px(() => KFB.layers())).layers.length === n0 - 1, 'layer count');
  const h1 = await hash();
  ok(h1 === h0, `merge changed pixels ${h0} → ${h1}`);
  await page.click('#undo'); ok((await px(() => KFB.layers())).layers.length === n0 && await hash() === h0, 'undo merge');
  await page.click('#redo'); ok(await hash() === h1, 'redo merge');
  await page.click('#undo');
  return `merge down of the clipped layer: hash ${h0} kept · undo/redo exact`;
});

/* ---- screenshots (before the synthetic performance strokes) ---- */
await fresh();
await px(() => KFB.select(KFB.brushes()[0].id));
await page.screenshot({ path: path.join(PRIV, 'editor_full_private.png') });
await page.locator('#paper').screenshot({ path: path.join(PUB, 'canvas_drawing.png') });
await page.screenshot({ path: path.join(PUB, 'editor_ui_canvas.png') });
const mask = await page.addStyleTag({ content: MASK });
await px(() => KFB.ui.openStudio('pencil')); await page.screenshot({ path: path.join(PUB, 'editor_ui_studio_masked.png') }); await px(() => KFB.ui.closeStudio());
await page.click('#btnColor'); await page.click('#popColor .tab[data-tab="palettes"]'); await page.screenshot({ path: path.join(PUB, 'editor_ui_palettes.png') });
await px(() => KFB.ui.closeAll()); await page.click('#btnLayers'); await page.click('#layerList li.layer >> nth=0 >> .blendbtn'); await page.waitForTimeout(60); await page.screenshot({ path: path.join(PUB, 'editor_ui_layers.png') });
await mask.evaluate(n => n.remove());
await fresh();

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
  await page.addStyleTag({ content: MASK });
  const w = await px(() => [document.documentElement.scrollWidth, innerWidth, document.querySelector('.topbar').scrollWidth]);
  ok(w[0] <= w[1] && w[2] <= w[1], 'scrollWidth ' + w);
  await px(() => KFB.ui.openStudio('shape')); await page.screenshot({ path: path.join(PUB, 'editor_ipad_studio_masked.png') }); await px(() => KFB.ui.closeStudio());
  await page.screenshot({ path: path.join(PUB, 'editor_ipad_portrait.png') });
  return 'scrollWidth ' + w[0] + ' / ' + w[1];
});

await t('B17 no console errors during the whole run', async () => { ok(!errors.length, errors.join('; ')); });

await browser.close();
const summary = { date: new Date().toISOString(), browser: 'chromium ' + browser.version(), pass: results.filter(r => r.status === 'PASS').length, fail: results.filter(r => r.status === 'FAIL').length, results, metrics };
fs.writeFileSync(path.join(PRIV, 'results.json'), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(PUB, 'browser-results.json'), JSON.stringify(summary, null, 2));
console.log(`\n${summary.pass} passed, ${summary.fail} failed · ${summary.browser}`);
process.exit(summary.fail ? 1 : 0);
