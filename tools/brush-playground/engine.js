/* KFB Brush Playground · engine.js
 * Rendering, import, history, export, sessions and the Procreate-preview comparison.
 * DOM-light: it only touches the #paper canvas and reports to the UI through events
 * (status, history, hud, stroke, select, params, pick, compare). UI lives in ui.js.
 */
(function () {
'use strict';
const C = window.KFBBrushCore;
const paper = document.getElementById('paper'), W = paper.width, H = paper.height, view = paper.getContext('2d');
const PAPER = '#f3ead3', PAPER_DARK = '#1f1a14'; // KFB paper-cream / ink-black
const listeners = {};
function on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); }
function emit(ev, data) { for (const fn of listeners[ev] || []) { try { fn(data); } catch (e) { console.error(e); } } }
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const committed = mk(W, H), cctx = committed.getContext('2d');
const active = mk(W, H), actx = active.getContext('2d', { willReadFrequently: true });
const grained = mk(W, H), gctx = grained.getContext('2d');

/* ---------------- brushes ---------------- */
const brushes = new Map();        // id -> brush
const overrides = new Map();      // id -> partial params from the UI
let currentId = null;

const ROUND_ID = 'builtin:round';
brushes.set(ROUND_ID, makeRoundBrush());

function makeRoundBrush() {
  const c = mk(256, 256), x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 120);
  g.addColorStop(0, '#fff'); g.addColorStop(.8, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  return { id: ROUND_ID, name: 'Round test tip (built-in)', builtin: true, mips: buildMips(c), grain: null, grains: [], grainIdx: 0,
    params: Object.assign(C.mapSettings({}), { spacing: .08, pressureSize: .6, pressureOpacity: .3 }), settings: {} };
}

function buildMips(mask) {
  const mips = [{ size: mask.width, canvas: mask }];
  let src = mask;
  while (src.width > 16) {
    const s = src.width >> 1, c = mk(s, s), x = c.getContext('2d');
    x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, s, s);
    mips.unshift({ size: s, canvas: c }); src = c;
  }
  return mips; // ascending
}

/* luminance -> alpha, white RGB. Procreate shapes: white paints, black is empty (unless inverted). */
function lumToAlpha(bitmap, invert, side) {
  const w = side || bitmap.width, h = side || bitmap.height;
  const c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(bitmap, 0, 0, w, h);
  const im = x.getImageData(0, 0, w, h), d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    let l = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) * d[i + 3] / 255;
    if (invert) l = 255 - l;
    d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = l;
  }
  x.putImageData(im, 0, 0);
  return c;
}

/* SUBSTITUTE grain: Procreate's bundled grains are not inside .brush files. A seeded fibrous
   tile stands in and is labelled as such everywhere it is used. */
function substituteGrain(seed) {
  const S = 256, c = mk(S, S), x = c.getContext('2d'), r = C.rng(seed);
  x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
  x.globalCompositeOperation = 'destination-out';
  x.lineCap = 'round';
  for (let i = 0; i < 1100; i++) {
    const px = r() * S, py = r() * S, a = r() * Math.PI, len = 2 + r() * 12;
    x.lineWidth = 0.5 + r() * 1.4; x.strokeStyle = 'rgba(0,0,0,' + (0.25 + r() * 0.7).toFixed(3) + ')';
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      x.beginPath(); x.moveTo(px + ox, py + oy); x.lineTo(px + ox + Math.cos(a) * len, py + oy + Math.sin(a) * len); x.stroke();
    }
  }
  const im = x.getImageData(0, 0, S, S), d = im.data;
  for (let i = 3; i < d.length; i += 4) if (r() < 0.1) d[i] = Math.min(d[i], r() * 255);
  x.putImageData(im, 0, 0);
  return c;
}

const grainVariants = new Map();
function grainPattern(ctx, brush, strength, scale, idx) {
  const grain = brush.grains ? brush.grains[idx || 0] : null;
  if (!grain || strength <= 0) return null;
  const key = brush.id + '|' + (idx || 0) + '|' + strength.toFixed(2);
  let tile = grainVariants.get(key);
  if (!tile) {
    const src = grain.canvas, t = mk(src.width, src.height), x = t.getContext('2d', { willReadFrequently: true });
    x.drawImage(src, 0, 0);
    const im = x.getImageData(0, 0, t.width, t.height), d = im.data;
    for (let i = 3; i < d.length; i += 4) d[i] = 255 * (1 - strength * (1 - d[i] / 255));
    x.putImageData(im, 0, 0);
    tile = t; grainVariants.set(key, tile);
  }
  const pat = ctx.createPattern(tile, 'repeat');
  const k = (256 * 0.6 * scale) / tile.width;
  pat.setTransform(new DOMMatrix().scale(k, k));
  return pat;
}

async function hashBytes(bytes) {
  try {
    const h = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(h).slice(0, 8), b => b.toString(16).padStart(2, '0')).join('');
  } catch (_) {
    let h = 0x811c9dc5; for (let i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 16777619); }
    return 'fnv' + (h >>> 0).toString(16);
  }
}

async function decodeImage(bytes, label) {
  const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
  if (bmp.width > C.LIMITS.imageSide || bmp.height > C.LIMITS.imageSide || bmp.width * bmp.height > C.LIMITS.imagePixels) {
    bmp.close(); throw Error(label + ' exceeds ' + C.LIMITS.imageSide + ' px');
  }
  return bmp;
}

function concatBytes(a, b) { const o = new Uint8Array(a.length + b.length); o.set(a, 0); o.set(b, a.length); return o; }
/* Procreate's blank grain means "no texture": no substitute is invented for it. */
const isBlankGrain = name => /blank/i.test(name || '');

async function buildBrush(entry, source) {
  // identity = archive + shape content, so the same brush from a .brush and from a .brushset is one entry
  const id = 'brush:' + await hashBytes(concatBytes(entry.archiveBytes, entry.shapePng));
  if (brushes.has(id)) return { brush: brushes.get(id), duplicate: true };
  const params = C.mapSettings(entry.settings);
  const shape = await decodeImage(entry.shapePng, 'Shape.png');
  const mask = lumToAlpha(shape, params.shapeInverted, Math.min(1024, Math.max(shape.width, shape.height)));
  let grain = null;
  if (entry.grainPng) {
    const g = await decodeImage(entry.grainPng, 'Grain.png');
    grain = { source: 'file', canvas: lumToAlpha(g, params.grainInverted, Math.min(512, g.width)), label: 'Grain.png from file' };
    g.close();
  } else if (params.bundledGrain && isBlankGrain(params.bundledGrain)) {
    grain = null;
  } else if (params.bundledGrain) {
    grain = { source: 'substitute', canvas: substituteGrain(7), label: 'SUBSTITUTE grain · Procreate built-in “' + params.bundledGrain + '” is not in the file' };
  }
  const thumb = entry.thumbPng ? await decodeImage(entry.thumbPng, 'Thumbnail.png') : null;
  const brush = { id, name: params.name, fileName: source.fileName, setName: source.setName || null, folder: entry.folder || '', order: source.order,
    settings: entry.settings, params, shape, mask, mips: buildMips(mask), grains: grain ? [grain] : [], grainIdx: 0, thumb,
    fields: Object.keys(entry.settings).length };
  Object.defineProperty(brush, 'grain', { get() { return this.grains[this.grainIdx] || null; } });
  brushes.set(id, brush);
  return { brush, duplicate: false };
}

async function importFile(file, progress) {
  if (file.size > C.LIMITS.setBytes) throw Error('File exceeds ' + C.LIMITS.setBytes / 1e6 + ' MB private-import limit');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const info = C.inspectArchive(bytes, window.fflate);
  const setName = info.kind === 'brushset' ? (info.setName || file.name.replace(/\.brushset$/i, '')) : null;
  const out = { kind: info.kind, setName, added: [], duplicates: 0, skipped: info.skipped };
  for (let i = 0; i < info.brushes.length; i++) {
    if (progress) progress(i + 1, info.brushes.length);
    const r = await buildBrush(info.brushes[i], { fileName: file.name, setName, order: i });
    if (r.duplicate) out.duplicates++; else out.added.push(r.brush);
    await new Promise(res => setTimeout(res, 0)); // keep the tab responsive during large sets
  }
  return out;
}

/* Replace the current grain with a user image (e.g. the real Procreate grain). Older strokes keep theirs. */
async function replaceGrain(file, id) {
  const b = brushes.get(id || currentId); if (!b || b.builtin) throw Error('Select an imported brush first');
  if (file.size > 30e6) throw Error('Grain image too large');
  const bmp = await decodeImage(new Uint8Array(await file.arrayBuffer()), 'grain image');
  b.grains.push({ source: 'user', canvas: lumToAlpha(bmp, b.params.grainInverted, Math.min(512, bmp.width)), label: 'Grain from your image “' + file.name + '”' });
  bmp.close();
  b.grainIdx = b.grains.length - 1;
}

/* ---------------- effective parameters ---------------- */
/* Default grain strength (HEURISTIC, calibrated against the Procreate previews of 24 brushes, R1.6):
   - old archives without grainDepth: 0.85 (CRAYONIC tone matched, Georg OK 21.10.)
   - newer archives: grainDepth; for the high-contrast SUBSTITUTE tile 0.3 × grainDepth, because the
     paper grains it stands in for barely dim ink strokes (19 set brushes: error 0.11 → 0.02). */
const SUBSTITUTE_DEPTH = 0.3;
function decodedWithGrain(b) {
  let g = 0;
  if (b.grain) {
    if (b.params.grainDepth == null) g = 0.85;
    else g = b.params.grainDepth * (b.grain.source === 'substitute' ? SUBSTITUTE_DEPTH : 1);
  }
  return Object.assign({ grainStrength: +g.toFixed(3) }, b.params);
}
function effectiveParams(id) { const b = brushes.get(id); return Object.assign(decodedWithGrain(b), overrides.get(id) || {}); }

/* ---------------- stamp drawing ---------------- */
const tintCache = new Map();
function tinted(brush, color, level) {
  const key = brush.id + '|' + color + '|' + level;
  let c = tintCache.get(key);
  if (!c) {
    const m = brush.mips[level].canvas; c = mk(m.width, m.height); const x = c.getContext('2d');
    x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    tintCache.set(key, c);
    if (tintCache.size > 400) tintCache.delete(tintCache.keys().next().value);
  }
  return c;
}
/* Uniform glaze: opaque gray stamps (gray = mask × stamp alpha) combined with 'lighten' = per-pixel maximum. */
const GRAY_Q = 32, grayCache = new Map();
function grayStamp(brush, level, q) {
  const key = brush.id + '|' + level + '|' + q;
  let c = grayCache.get(key);
  if (!c) {
    const m = brush.mips[level].canvas; c = mk(m.width, m.height); const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.globalAlpha = q / GRAY_Q; x.drawImage(m, 0, 0);
    grayCache.set(key, c);
    if (grayCache.size > 800) grayCache.delete(grayCache.keys().next().value);
  }
  return c;
}
function prepBuffer(ctx, uniform, r) {
  const c = ctx.canvas; r = r || { x: 0, y: 0, w: c.width, h: c.height };
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (uniform) { ctx.fillStyle = '#000'; ctx.fillRect(r.x, r.y, r.w, r.h); } else ctx.clearRect(r.x, r.y, r.w, r.h);
}
/* conservative bounds of a finished stroke: sample bbox + the largest possible stamp radius */
function strokeBounds(rec, w, h) {
  const b = newBox(), P = rec.params;
  const maxSize = rec.size * 2 * 2 * (1 + Math.max(0, P.tiltSize || 0)) + 8;
  for (const p of rec.points) grow(b, p.x, p.y, maxSize * 0.75 + P.jitter * maxSize * 4);
  return clip(b, w, h);
}
function mipLevel(brush, size) {
  const m = brush.mips; for (let i = 0; i < m.length; i++) if (m[i].size >= size) return i; return m.length - 1;
}
function drawStamps(ctx, brush, color, stamps, box, uniform) {
  ctx.globalCompositeOperation = uniform ? 'lighten' : 'source-over';
  for (const s of stamps) {
    const lv = mipLevel(brush, s.size), h = s.size / 2;
    let img;
    if (uniform) { const q = Math.round(s.alpha * GRAY_Q); if (!q) continue; img = grayStamp(brush, lv, q); ctx.globalAlpha = 1; }
    else { img = tinted(brush, color, lv); ctx.globalAlpha = s.alpha; }
    ctx.setTransform(Math.cos(s.angle), Math.sin(s.angle), -Math.sin(s.angle), Math.cos(s.angle), s.x, s.y);
    ctx.drawImage(img, -h, -h, s.size, s.size);
    if (box) grow(box, s.x, s.y, s.size * 0.71 + 2);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function newBox() { return { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }; }
function grow(b, x, y, r) { b.x0 = Math.min(b.x0, x - r); b.y0 = Math.min(b.y0, y - r); b.x1 = Math.max(b.x1, x + r); b.y1 = Math.max(b.y1, y + r); }
function clip(b, w, h) {
  const x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.max(0, Math.floor(b.y0)), x1 = Math.min(w, Math.ceil(b.x1)), y1 = Math.min(h, Math.ceil(b.y1));
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}

/* stroke buffer -> grain -> target (glaze: the stroke never exceeds its own opacity) */
function compositeStroke(target, src, tmp, r, brush, rec) {
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  if (rec.params.glazeUniform) {
    const im = src.getContext('2d', { willReadFrequently: true }).getImageData(r.x, r.y, r.w, r.h), d = im.data, [cr, cg, cb] = hexRgb(rec.eraser ? '#000000' : rec.color);
    for (let i = 0; i < d.length; i += 4) { d[i + 3] = d[i]; d[i] = cr; d[i + 1] = cg; d[i + 2] = cb; }
    tctx.putImageData(im, r.x, r.y);
  } else {
    tctx.clearRect(r.x, r.y, r.w, r.h);
    tctx.drawImage(src, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
  }
  const pat = grainPattern(tctx, brush, rec.params.grainStrength || 0, rec.params.grainScale || 1, rec.grainIdx);
  if (pat) { tctx.save(); tctx.globalCompositeOperation = 'destination-in'; tctx.fillStyle = pat; tctx.fillRect(r.x, r.y, r.w, r.h); tctx.restore(); }
  target.save();
  target.globalAlpha = rec.opacity;
  target.globalCompositeOperation = rec.eraser ? 'destination-out' : 'source-over';
  target.drawImage(tmp, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
  target.restore();
}

/* Bake a finished stroke record (full deterministic replay incl. end taper). */
const bakeA = mk(W, H), bakeG = mk(W, H);
function bakeStroke(targetCtx, rec, canvases) {
  const [bufA, bufG] = canvases || [bakeA, bakeG];
  const brush = brushes.get(rec.brushId) || brushes.get(ROUND_ID);
  const stamps = C.stampsForStroke(rec), box = newBox(), bctx = bufA.getContext('2d', { willReadFrequently: true });
  const uniform = !!rec.params.glazeUniform;
  const area = strokeBounds(rec, bufA.width, bufA.height);
  if (!area) return { stamps: stamps.length, rect: null };
  prepBuffer(bctx, uniform, area);
  bctx.save(); bctx.beginPath(); bctx.rect(area.x, area.y, area.w, area.h); bctx.clip();
  drawStamps(bctx, brush, rec.eraser ? '#000000' : rec.color, stamps, box, uniform);
  bctx.restore();
  const b = clip(box, bufA.width, bufA.height);
  const r = b && clip({ x0: Math.max(b.x, area.x), y0: Math.max(b.y, area.y), x1: Math.min(b.x + b.w, area.x + area.w), y1: Math.min(b.y + b.h, area.y + area.h) }, bufA.width, bufA.height);
  if (r) compositeStroke(targetCtx, bufA, bufG, r, brush, rec);
  return { stamps: stamps.length, rect: r };
}

/* ---------------- history ---------------- */
const done = [], undone = [];
let lastRebuildMs = 0;
/* checkpoints: a copy of the committed layer every SNAP_EVERY actions, so undo replays at most that many */
const SNAP_EVERY = 10, SNAP_MAX = 6, snaps = new Map(); // done.length -> canvas
function snapshotIfDue() {
  const n = done.length; if (n % SNAP_EVERY) return;
  const c = mk(W, H); c.getContext('2d').drawImage(committed, 0, 0); snaps.set(n, c);
  while (snaps.size > SNAP_MAX) snaps.delete(Math.min(...snaps.keys()));
}
function dropSnapsAbove(n) { for (const k of [...snaps.keys()]) if (k > n) snaps.delete(k); }
function rebuildCommitted() {
  const t0 = performance.now();
  let from = 0; for (const k of snaps.keys()) if (k <= done.length && k > from) from = k;
  cctx.clearRect(0, 0, W, H);
  if (from) cctx.drawImage(snaps.get(from), 0, 0);
  for (let i = from; i < done.length; i++) { const a = done[i]; if (a.type === 'clear') cctx.clearRect(0, 0, W, H); else bakeStroke(cctx, a); }
  lastRebuildMs = performance.now() - t0;
}
function refreshView(r) {
  r = r || { x: 0, y: 0, w: W, h: H };
  view.clearRect(r.x, r.y, r.w, r.h);
  view.drawImage(committed, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
}
function syncButtons() { emit('history', { canUndo: done.length > 0, canRedo: undone.length > 0, strokes: done.filter(a => a.type === 'stroke').length }); }
function pushAction(a) { dropSnapsAbove(done.length); done.push(a); undone.length = 0; snapshotIfDue(); syncButtons(); }
function undo() { if (!done.length || live) return; undone.push(done.pop()); rebuildCommitted(); refreshView(); syncButtons(); }
function redo() {
  if (!undone.length || live) return; const a = undone.pop(); done.push(a);
  if (a.type === 'clear') cctx.clearRect(0, 0, W, H); else bakeStroke(cctx, a);
  if (!snaps.has(done.length)) snapshotIfDue();
  refreshView(); syncButtons();
}
function clearCanvas() { if (!done.length || live) return false; cctx.clearRect(0, 0, W, H); pushAction({ type: 'clear' }); refreshView(); return true; }

/* ---------------- live input ---------------- */
let live = null; // {rec, stamper, box, dirty, pointerId}
let seedCounter = 1;
/* UI-owned drawing state. tool: 'brush' | 'eraser' | 'pick' (eyedropper) */
const state = { tool: 'brush', color: '#1f1a14', size: 70, opacity: 1, mousePressure: 0.6, darkPaper: false };

function sampleOf(e) {
  const b = paper.getBoundingClientRect();
  const pen = e.pointerType === 'pen';
  let p = pen ? (e.pressure > 0 ? e.pressure : 0.01) : state.mousePressure;
  let alt = null;
  if (pen) {
    if (typeof e.altitudeAngle === 'number') alt = e.altitudeAngle;
    else if (e.tiltX || e.tiltY) {
      const tx = Math.tan(e.tiltX * Math.PI / 180), ty = Math.tan(e.tiltY * Math.PI / 180);
      alt = Math.atan(1 / Math.hypot(tx, ty));
    } else alt = Math.PI / 2;
  }
  return { x: (e.clientX - b.left) * W / b.width, y: (e.clientY - b.top) * H / b.height, t: e.timeStamp, p: Math.min(1, Math.max(0, p)), alt };
}
function hud(e, s, speed) {
  emit('hud', { input: e.pointerType, simulated: e.pointerType !== 'pen', pressure: s.p, tilt: s.alt == null ? null : Math.round(90 - s.alt * 180 / Math.PI), speed });
}
/* eyedropper: colour of the painted layer under the pointer (transparent → no change) */
function pickAt(e) {
  const b = paper.getBoundingClientRect();
  const x = Math.floor((e.clientX - b.left) * W / b.width), y = Math.floor((e.clientY - b.top) * H / b.height);
  if (x < 0 || y < 0 || x >= W || y >= H) return null;
  const d = cctx.getImageData(x, y, 1, 1).data;
  if (d[3] < 8) return null;
  const hex = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
  emit('pick', hex);
  return hex;
}

paper.addEventListener('pointerdown', e => {
  if (live || (e.pointerType === 'mouse' && e.button !== 0)) return;
  e.preventDefault();
  if (state.tool === 'pick' || e.altKey) { pickAt(e); return; }
  paper.setPointerCapture(e.pointerId);
  const id = currentId || ROUND_ID, s = sampleOf(e), eraser = state.tool === 'eraser';
  // Eraser (heuristic): same shape and size dynamics, but full flow without pressure/speed fade or grain,
  // so it can actually remove paint. Procreate's separate erase presets are not decoded.
  const params = eraser ? Object.assign(effectiveParams(id), { flow: 1, pressureOpacity: 0, speedOpacity: 0, jitterOpacity: 0, tiltOpacity: 0, grainStrength: 0 }) : effectiveParams(id);
  const rec = { type: 'stroke', brushId: id, color: state.color, size: state.size, opacity: state.opacity,
    eraser, seed: (seedCounter++ * 2654435761) | 0, params, input: e.pointerType, grainIdx: (brushes.get(id).grainIdx || 0),
    speedScale: paper.getBoundingClientRect().width / W, points: [s] };
  prepBuffer(actx, !!rec.params.glazeUniform);
  live = { rec, stamper: C.createStamper({ size: rec.size, seed: rec.seed, params: rec.params, speedScale: rec.speedScale }), box: newBox(), dirty: newBox(), pointerId: e.pointerId, lastT: s.t, lastX: s.x, lastY: s.y };
  addStamps(live.stamper.add(s));
  hud(e, s); schedule();
});
paper.addEventListener('pointermove', e => {
  if (!live || e.pointerId !== live.pointerId) return;
  const list = (e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e];
  let s;
  for (const ev of list) { s = sampleOf(ev); if (s.t < live.rec.points[live.rec.points.length - 1].t) s.t = live.rec.points[live.rec.points.length - 1].t; live.rec.points.push(s); addStamps(live.stamper.add(s)); }
  if (s) {
    const dt = Math.max(1, s.t - live.lastT);
    if (dt > 30) { live.speed = Math.hypot(s.x - live.lastX, s.y - live.lastY) * live.rec.speedScale / dt; live.lastT = s.t; live.lastX = s.x; live.lastY = s.y; }
    hud(e, s, live.speed);
  }
  schedule();
});
function addStamps(stamps) {
  if (!stamps.length) return;
  const brush = brushes.get(live.rec.brushId);
  const b = newBox();
  drawStamps(actx, brush, live.rec.eraser ? '#000000' : live.rec.color, stamps, b, !!live.rec.params.glazeUniform);
  grow(live.box, b.x0, b.y0, 0); grow(live.box, b.x1, b.y1, 0);
  grow(live.dirty, b.x0, b.y0, 0); grow(live.dirty, b.x1, b.y1, 0);
}
let rafPending = false;
function schedule() { if (!rafPending) { rafPending = true; requestAnimationFrame(frame); } }
const perf = { frames: 0, frameMsMax: 0, frameMsSum: 0, commitMsMax: 0 };
function frame() {
  const t0 = performance.now();
  rafPending = false;
  try { frameBody(); } finally { const dt = performance.now() - t0; perf.frames++; perf.frameMsSum += dt; perf.frameMsMax = Math.max(perf.frameMsMax, dt); }
}
function frameBody() {
  if (!live) return;
  const r = clip(live.dirty, W, H); live.dirty = newBox();
  if (!r) return;
  refreshView(r);
  const brush = brushes.get(live.rec.brushId);
  compositeStroke(view, active, grained, r, brush, live.rec);
}
function finish(e) {
  if (!live || e.pointerId !== live.pointerId) return;
  const rec = live.rec, r = clip(live.box, W, H);
  live = null;
  const t0 = performance.now();
  const res = bakeStroke(cctx, rec);
  perf.commitMsMax = Math.max(perf.commitMsMax, performance.now() - t0);
  pushAction(rec);
  refreshView(unionRect(r, res.rect));
  emit('stroke', { n: done.filter(a => a.type === 'stroke').length, samples: rec.points.length, stamps: res.stamps, brush: brushes.get(rec.brushId).name });
}
function unionRect(a, b) { if (!a) return b; if (!b) return a; const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; }
paper.addEventListener('pointerup', finish);
paper.addEventListener('pointercancel', finish);

/* ---------------- export ---------------- */
function exportCanvas(opaque) {
  const out = mk(W, H), x = out.getContext('2d');
  if (opaque) { x.fillStyle = state.darkPaper ? PAPER_DARK : PAPER; x.fillRect(0, 0, W, H); }
  x.drawImage(committed, 0, 0);
  return out;
}
function downloadBlob(blob, name) {
  const a = document.createElement('a'); a.download = name; a.href = URL.createObjectURL(blob); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function download(opaque) { exportCanvas(opaque).toBlob(blob => downloadBlob(blob, 'georg-brush-playground' + (opaque ? '-paper' : '') + '.png'), 'image/png'); }

/* ---------------- drawing session (strokes + settings, no brush data) ---------------- */
const SESSION_FORMAT = 'kfb.brush-playground.session/1';
function sessionJSON() {
  const used = new Set(done.filter(a => a.type === 'stroke').map(a => a.brushId));
  return JSON.stringify({
    format: SESSION_FORMAT, created: new Date().toISOString(), canvas: { width: W, height: H },
    brushes: [...used].map(id => { const b = brushes.get(id); return { id, name: b.name, setName: b.setName || null, fileName: b.fileName || null, builtin: !!b.builtin }; }),
    actions: done
  });
}
function loadSession(text) {
  const j = JSON.parse(text);
  if (!j || j.format !== SESSION_FORMAT || !Array.isArray(j.actions)) throw Error('Not a Brush Playground drawing (' + SESSION_FORMAT + ')');
  if (!j.canvas || j.canvas.width !== W || j.canvas.height !== H) throw Error('Canvas size differs');
  const missing = (j.brushes || []).filter(b => !brushes.has(b.id));
  if (missing.length) throw Error('Import these brushes first: ' + missing.map(b => b.name + (b.fileName ? ' (' + b.fileName + ')' : '')).join(', '));
  for (const a of j.actions) if (a.type !== 'clear' && (a.type !== 'stroke' || !Array.isArray(a.points) || !a.params)) throw Error('Malformed action');
  done.length = 0; undone.length = 0; snaps.clear(); cctx.clearRect(0, 0, W, H);
  for (const a of j.actions) { if (a.type === 'clear') cctx.clearRect(0, 0, W, H); else bakeStroke(cctx, a); done.push(a); snapshotIfDue(); }
  refreshView(); syncButtons();
  return j.actions.length;
}
/* ---------------- comparison with the Procreate preview stroke ----------------
   Path and pressure are recovered from the reference silhouette (column centroid + width).
   The simulation then replays that path with the DECODED parameters (no UI overrides, no fitting). */
const REF_SPEED = 0.25; // px/ms, slow constant speed (assumption, recorded in the report)
function alphaOf(canvas) {
  const d = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
  const a = new Uint8ClampedArray(canvas.width * canvas.height); for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]; return a;
}
function profile(A, w, h, T) {
  const cols = [];
  for (let x = 0; x < w; x++) {
    let sw = 0, sy = 0, y0 = -1, y1 = -1;
    for (let y = 0; y < h; y++) { const v = A[y * w + x]; if (v > T) { if (y0 < 0) y0 = y; y1 = y; } sw += v; sy += v * y; }
    if (y0 >= 0 && y1 - y0 >= 1) cols.push({ x, cy: sy / sw, ext: y1 - y0 + 1 });
  }
  const sm = (arr, k, r) => arr.map((c, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - r); j <= Math.min(arr.length - 1, i + r); j++) { s += arr[j][k]; n++; } return s / n; });
  const cy = sm(cols, 'cy', 6);
  return cols.map((c, i) => {
    const slope = (cy[Math.min(cols.length - 1, i + 3)] - cy[Math.max(0, i - 3)]) / Math.max(1, cols[Math.min(cols.length - 1, i + 3)].x - cols[Math.max(0, i - 3)].x);
    return { x: c.x, y: cy[i], w: c.ext * Math.cos(Math.atan(slope)) };
  });
}
function maskContentFraction(b) {
  const m = b.mips[b.mips.length - 1].canvas, A = alphaOf(m), n = m.width;
  let x0 = n, x1 = 0, y0 = n, y1 = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (A[y * n + x] > 25) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return ((x1 - x0 + 1) + (y1 - y0 + 1)) / 2 / n;
}
function compareWithReference(id, patch) {
  const b = brushes.get(id || currentId); if (!b || !b.thumb) throw Error('No reference stroke in this brush file');
  const w = b.thumb.width, h = b.thumb.height;
  const rc = mk(w, h); rc.getContext('2d').drawImage(b.thumb, 0, 0);
  const A = alphaOf(rc), T = 40;
  const prof = profile(A, w, h, T);
  const ws = prof.map(c => c.w), wsm = ws.map((v, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - 4); j <= Math.min(ws.length - 1, i + 4); j++) { s += ws[j]; n++; } return s / n; });
  const maxW = Math.max(...wsm), cf = maskContentFraction(b);
  const points = []; let t = 0, prev = null;
  for (let i = 0; i < prof.length; i += 2) {
    const pt = { x: prof[i].x, y: prof[i].y, p: Math.max(0.02, Math.min(1, wsm[i] / maxW)), alt: null };
    if (prev) t += Math.hypot(pt.x - prev.x, pt.y - prev.y) / REF_SPEED; pt.t = t; points.push(pt); prev = pt;
  }
  const params = Object.assign(decodedWithGrain(b), patch || {});
  const rec = { type: 'stroke', brushId: b.id, color: '#ffffff', size: maxW / cf, opacity: params.opacity || 1, eraser: false, seed: 1, params, points };
  const sim = mk(w, h), sctx = sim.getContext('2d');
  bakeStroke(sctx, rec, [mk(w, h), mk(w, h)]);
  const B = alphaOf(sim);
  let inter = 0, uni = 0, nA = 0, nB = 0, sA = 0, sB = 0, qA = 0, qB = 0;
  for (let i = 0; i < A.length; i++) {
    const a = A[i] > 32, bb = B[i] > 32;
    if (a && bb) inter++; if (a || bb) uni++;
    if (a) { nA++; sA += A[i]; qA += A[i] * A[i]; }
    if (bb) { nB++; sB += B[i]; qB += B[i] * B[i]; }
  }
  const mA = sA / nA, mB = sB / Math.max(1, nB);
  const pB = profile(B, w, h, T);
  const byX = new Map(pB.map(c => [c.x, c.w]));
  let werr = 0, wn = 0; for (const c of prof) if (byX.has(c.x)) { werr += Math.abs(byX.get(c.x) - c.w) / Math.max(1, c.w); wn++; }
  const out = {
    brush: b.name, refSize: w + '×' + h, recoveredBaseSize: +(maxW / cf).toFixed(1), samples: points.length, assumedSpeedPxMs: REF_SPEED,
    silhouetteIoU: +(inter / uni).toFixed(3), areaRatio: +(nB / nA).toFixed(3),
    meanAlphaRef: +(mA / 255).toFixed(3), meanAlphaSim: +(mB / 255).toFixed(3),
    alphaStdRef: +(Math.sqrt(qA / nA - mA * mA) / 255).toFixed(3), alphaStdSim: +(Math.sqrt(qB / Math.max(1, nB) - mB * mB) / 255).toFixed(3),
    widthProfileError: +(werr / Math.max(1, wn)).toFixed(3), columnsCompared: wn,
    grain: b.grain ? b.grain.source : 'none'
  };
  lastCompare = { id: b.id, sim };
  emit('compare', { id: b.id, metrics: out, sim });
  return out;
}
let lastCompare = null;


/* ---------------- stroke previews (library rows, Brush Studio pad) ----------------
   A fixed S-curve with a pressure swell, drawn with the brush's effective parameters. */
function previewPoints(w, h, opts) {
  const n = 60, pts = [], pad = h * 0.28;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = w * 0.06 + u * w * 0.88;
    const y = h / 2 + Math.sin(u * Math.PI * 2) * (h / 2 - pad) * (opts.flat ? 0.35 : 0.8);
    const p = opts.pressure != null ? opts.pressure : Math.max(0.05, Math.sin(Math.PI * Math.min(1, u * 1.05)));
    pts.push({ x, y, p, alt: null, t: i * (opts.dt || 14) });
  }
  return pts;
}
const previewBufs = new Map();
function renderPreview(id, canvas, opts) {
  opts = opts || {};
  const b = brushes.get(id); if (!b) return;
  const w = canvas.width, h = canvas.height, key = w + 'x' + h;
  if (!previewBufs.has(key)) previewBufs.set(key, [mk(w, h), mk(w, h)]);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  if (opts.background) { ctx.fillStyle = opts.background; ctx.fillRect(0, 0, w, h); }
  const params = Object.assign({}, opts.params || effectiveParams(id));
  const rec = { type: 'stroke', brushId: id, color: opts.color || '#f3ead3', size: opts.size || h * 0.42, opacity: opts.opacity || 1, eraser: false,
    seed: 11, params, grainIdx: b.grainIdx || 0, speedScale: 1, points: previewPoints(w, h, opts) };
  bakeStroke(ctx, rec, previewBufs.get(key));
}
function setCurrent(id) { currentId = id; emit('select', id); }
function setOverride(id, key, value) {
  const o = Object.assign({}, overrides.get(id)); o[key] = value; overrides.set(id, o); emit('params', id);
}
function resetOverrides(id) { overrides.delete(id); emit('params', id); }

window.KFBEngine = {
  C, W, H, PAPER, PAPER_DARK, ROUND_ID, state, brushes, overrides, on, emit, mk,
  get currentId() { return currentId; }, setCurrent, effectiveParams, decodedWithGrain, setOverride, resetOverrides,
  importFile, replaceGrain, isBlankGrain, tinted, mipLevel,
  undo, redo, clearCanvas, history: () => ({ done, undone }), get live() { return !!live; },
  exportCanvas, download, downloadBlob, sessionJSON, loadSession,
  compare: compareWithReference, renderPreview, pickAt,
  perf, get lastRebuildMs() { return lastRebuildMs; },
  _internal: { bakeStroke, pushAction, refreshView, cctx, done }
};
syncButtons();
})();
