#!/usr/bin/env node
// Reproducible streaming perf test (headless Chrome on the GPU, 1920×1080, real keyboard/mouse input).
//
//   node src/modules/streaming/tools/perf.mjs --mode run   --secs 45 [--seed 1337] [--name base] [--prof]
//   node src/modules/streaming/tools/perf.mjs --mode fly   --secs 30 [--speed 12]      (uses /?flythrough=1)
//   node src/modules/streaming/tools/perf.mjs --mode idle  --secs 10
//
// run:  game mode `/`, follow camera, holds W (run gait, 4.4 m/s) for --secs; every --turnEvery s a short real mouse
//       drag turns the camera (and so the run direction) so the player keeps crossing new terrain instead of
//       pressing into one cliff.
// fly:  `/?flythrough=1` — the streaming module moves the chunk focus + camera at --speed m/s along a fixed path.
// The in-page recorder measures every rAF delta (= frame time), draw calls, triangles, chunk build ms; the result
// (p50/p95/p99/max, histogram, worst frames with what happened in them) is printed as JSON and written to
// src/modules/streaming/tools/out/<name>.json. --prof adds a CPU profile (top self-time functions). --shots N takes
// N JPEG screenshots spread over the run (look at them: holes/popping near the player).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const a = {};
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (!k.startsWith('--')) continue;
  const v = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true;
  a[k.slice(2)] = v;
}
const mode = a.mode ?? 'run';
const secs = Number(a.secs ?? 40);
const name = a.name ?? `${mode}_${a.seed ?? 1337}`;
const outDir = path.resolve(a.out ?? path.join(HERE, 'out'));
fs.mkdirSync(outDir, { recursive: true });
const st = fs.statfsSync(outDir);
if ((st.bavail * st.bsize) / 1e9 < 1.5) { console.error('ABORT: < 1.5 GB free disk'); process.exit(4); }
const [W, H] = (a.size ?? '1920x1080').split('x').map(Number);
const url = new URL(a.url ?? (mode === 'fly' ? '/?flythrough=1' : '/'), a.base ?? 'http://127.0.0.1:5180');
if (a.seed) url.searchParams.set('seed', a.seed);
if (mode === 'fly' && a.speed) url.searchParams.set('flyspeed', a.speed);
if (a.hud) url.searchParams.set('hud', '1');
for (const kv of String(a.params ?? '').split('&').filter(Boolean)) { const [k, v = ''] = kv.split('='); url.searchParams.set(k, v); }

const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome']
  .filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: !a.headed, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const kill = setTimeout(async () => { console.error('watchdog'); try { await browser.close(); } catch {} process.exit(3); }, (secs + 240) * 1000);
const res = { url: url.toString(), mode, secs, consoleErrors: [], pageErrors: [], warnings: [] };
// other agents share this machine's GPU/CPU: record how many other verification browsers were running
const others = () => {
  const ps = spawnSync('ps', ['-axo', 'command'], { encoding: 'utf8' }).stdout ?? '';
  return ps.split('\n').filter((l) => /tools\/shoot\.mjs|peval\.mjs|perf\.mjs/.test(l) && !l.includes(name)).length;
};
res.otherRunsAtStart = others();
try {
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (m) => { const t = m.text(); if (m.type() === 'error') res.consoleErrors.push(t); else if (m.type() === 'warning') res.warnings.push(t); });
  page.on('pageerror', (e) => res.pageErrors.push(String(e)));
  await page.addInitScript(() => { window.__kfbNoPointerLock = true; });
  // --noremove: test hook — DOM overlays are hidden instead of removed (isolates compositor re-layering stalls)
  // always log DOM removals of body children (time, id, text) — they re-layer the compositor
  await page.addInitScript(() => { const r = Element.prototype.remove; window.__removed = []; Element.prototype.remove = function () { if (this.parentElement === document.body) window.__removed.push([+(performance.now() / 1000).toFixed(2), this.id || this.className || this.tagName, (this.textContent || '').slice(0, 40)]); return r.call(this); }; const rc = Node.prototype.removeChild; Node.prototype.removeChild = function (c) { if (this === document.body) window.__removed.push([+(performance.now() / 1000).toFixed(2), 'removeChild ' + (c.id || c.className || c.tagName), (c.textContent || '').slice(0, 40)]); return rc.call(this, c); }; });
  if (a.noremove) await page.addInitScript(() => { const r = Element.prototype.remove; Element.prototype.remove = function () { if (this.style && this.parentElement === document.body) { this.style.opacity = '0'; this.style.visibility = 'hidden'; this.style.pointerEvents = 'none'; return; } return r.call(this); }; });
  const tLoad = Date.now();
  await page.goto(url.toString(), { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 120000 });
  res.bootMs = Date.now() - tLoad;
  // another agent saving a module file makes Vite reload the page: the run is then invalid (matrix.sh retries)
  page.on('framenavigated', (fr) => { if (fr === page.mainFrame()) res.reloadedMidRun = (res.reloadedMidRun ?? 0) + 1; });
  await page.evaluate(() => window.__kfb.setCamera('follow'));
  await page.waitForTimeout(Number(a.settle ?? 2500));
  let cdp = null;
  if (a.prof) {
    cdp = await context.newCDPSession(page);
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 250 });
    await cdp.send('Profiler.start');
  }
  // in-page frame recorder (independent of the streaming module so the same tool measures before/after)
  await page.evaluate((attr) => {
    const k = window.__kfb, e = k.engine;
    const R = (window.__perfRec = { dt: [], info: [], pos: [], t0: performance.now(), on: true, acc: {}, attr: [] });
    if (attr) {
      // test-harness-only attribution: wrap module update/lateUpdate/buildChunk, chunk update, physics, render and
      // every world layer's apply (time spent computing world cells, nested layers counted once at the outer call)
      const add = (key, d) => (R.acc[key] = (R.acc[key] ?? 0) + d);
      const wrap = (o, fn, key) => {
        const f = o[fn];
        if (typeof f !== 'function') return;
        o[fn] = function (...a) { const t = performance.now(); try { return f.apply(this, a); } finally { add(key, performance.now() - t); } };
      };
      for (const m of e.modules) { wrap(m, 'update', 'u:' + m.id); wrap(m, 'lateUpdate', 'l:' + m.id); wrap(m, 'buildChunk', 'b:' + m.id); }
      wrap(e.chunks, 'update', 'chunks.update');
      wrap(e.chunks, 'unload', 'chunks.unload');
      wrap(e.physics, 'step', 'physics');
      wrap(e.renderer, 'render', 'render');
      // idle callbacks (streaming's idle prefetch) run outside the engine tick: attribute them too
      const ric = window.requestIdleCallback;
      if (ric) window.requestIdleCallback = (cb, o) => ric((dl) => { const t = performance.now(); try { cb(dl); } finally { add('idle', performance.now() - t); } }, o);
      let depth = 0;
      for (const l of e.world.layers) {
        const f = l.apply;
        l.apply = (c, cx) => { const t = performance.now(); depth++; try { return f(c, cx); } finally { depth--; if (!depth) add('world', performance.now() - t); } };
      }
    }
    let last = performance.now(), built = e.chunks.builtThisSession, unl = 0;
    R.lp = e.renderer.info.programs?.length ?? 0; R.lt = e.renderer.info.memory.textures; R.lg = e.renderer.info.memory.geometries;
    e.events.on('chunk:unloaded', () => unl++);
    const f = () => {
      if (!R.on) return;
      const now = performance.now();
      const d = now - last;
      last = now;
      const b = e.chunks.builtThisSession;
      const ri = e.renderer.info.render;
      R.dt.push(d);
      const progs = e.renderer.info.programs?.length ?? 0, texs = e.renderer.info.memory.textures, geos = e.renderer.info.memory.geometries;
      const heap = performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0;
      R.info.push([+(now - R.t0).toFixed(1), +d.toFixed(2), ri.calls, ri.triangles, b - built, unl, +e.chunks.lastBuildMs.toFixed(2), e.chunks.loaded.size, progs - R.lp, texs - R.lt, geos - R.lg, e.frame, +(heap - (R.heap ?? heap)).toFixed(1)]);
      R.heap = heap;
      if (progs > R.lp) {
        const ps = e.renderer.info.programs.slice(R.lp);
        (R.newProgs ??= []).push({ t: +(now - R.t0).toFixed(0), names: ps.map((p) => p.name + ' ' + String(p.cacheKey).slice(0, 2000)) });
      }
      R.lp = progs; R.lt = texs; R.lg = geos;
      R.attr.push(R.acc);
      R.acc = {};
      built = b; unl = 0;
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
    R.posTimer = setInterval(() => {
      const p = e.ctx.services.get('player')?.position ?? e.chunks.focus;
      R.pos.push([+((performance.now() - R.t0) / 1000).toFixed(1), +p.x.toFixed(1), +p.z.toFixed(1)]);
    }, 1000);
  }, !!a.attr);
  const shots = Number(a.shots ?? 0);
  const shotAt = new Set(Array.from({ length: shots }, (_, i) => Math.round(((i + 1) * secs) / (shots + 1))));
  const t0 = Date.now();
  if (mode === 'run') {
    await page.mouse.move(W / 2, H / 2);
    await page.keyboard.down('KeyW');
  }
  const turnEvery = Number(a.turnEvery ?? 8);
  let sec = 0, dir = 1, lastP = null;
  while (Date.now() - t0 < secs * 1000) {
    await page.waitForTimeout(1000 - ((Date.now() - t0) % 1000));
    sec++;
    if (shotAt.has(sec)) await page.screenshot({ path: path.join(outDir, `${name}__t${String(sec).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    let stuck = false;
    if (mode === 'run') {
      // a human would steer away from a wall: if the player moved < 1.5 m in the last second, turn 90° (real drag)
      const p = await page.evaluate(() => { const q = window.__kfb.engine.ctx.services.get('player')?.position; return q ? [q.x, q.z] : null; });
      if (p && lastP && Math.hypot(p[0] - lastP[0], p[1] - lastP[1]) < 1.5) stuck = true;
      lastP = p;
    }
    if (mode === 'run' && (stuck || (turnEvery > 0 && sec % turnEvery === 0))) {
      // real mouse drag: turn the camera ~38° (or ~90° when stuck), alternating, so the run bends instead of hitting one wall
      const dx = (stuck ? 375 : 160) * dir; dir = -dir;
      if (stuck) res.steers = (res.steers ?? 0) + 1;
      await page.mouse.move(W / 2, H / 2); await page.mouse.down();
      for (let i = 1; i <= 10; i++) { await page.mouse.move(W / 2 + (dx * i) / 10, H / 2); await page.waitForTimeout(16); }
      await page.mouse.up();
    }
  }
  if (mode === 'run') await page.keyboard.up('KeyW');
  const rec = await page.evaluate(() => {
    const R = window.__perfRec;
    R.on = false;
    clearInterval(R.posTimer);
    const s = window.__kfb.stats();
    const sv = window.__kfb.engine.ctx.services;
    const extra = {};
    try { extra.streaming = sv.get('streaming')?.stats?.(); } catch {}
    try { extra.gpuFrames = window.__kfb.streaming?.gpuFrames?.() ?? []; } catch {}
    try { extra.terrain = sv.get('terrain')?.stats?.(); } catch {}
    try { extra.nature = sv.get('nature')?.stats?.(); } catch {}
    try { extra.roads = window.__roads?.perf?.(); } catch {}
    return { removed: window.__removed ?? [], readyAt: performance.now() / 1000 - (performance.now() - R.t0) / 1000, dt: R.dt, info: R.info, attr: R.attr, newProgs: R.newProgs ?? [], pos: R.pos, stats: s, extra, inPageErrors: window.__kfb.errors.slice() };
  });
  if (cdp) {
    const { profile: p } = await cdp.send('Profiler.stop');
    const byId = new Map(p.nodes.map((n) => [n.id, n]));
    const self = new Map();
    p.samples.forEach((s, i) => {
      const n = byId.get(s);
      const k = (n.callFrame.functionName || '(anon)') + ' ' + n.callFrame.url.split('/').slice(-2).join('/') + ':' + n.callFrame.lineNumber;
      self.set(k, (self.get(k) ?? 0) + (p.timeDeltas[i] ?? 0));
    });
    res.profileTop = [...self].sort((x, y) => y[1] - x[1]).slice(0, 40).map(([k, t]) => `${(t / 1000).toFixed(0)}ms ${k}`);
  }
  const dt = rec.dt.slice(5); // drop the first frames after the recorder starts
  const sorted = [...dt].sort((x, y) => x - y);
  const q = (p) => +sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))].toFixed(1);
  const bins = [8, 12, 17, 20, 25, 33, 50, 100, 200, 500, Infinity];
  const hist = {};
  let lo = 0;
  for (const b of bins) { hist[`${lo}-${b === Infinity ? '∞' : b}`] = dt.filter((x) => x > lo && x <= b).length; lo = b; }
  const total = dt.reduce((s, x) => s + x, 0);
  const calls = rec.info.map((i) => i[2]).sort((x, y) => x - y), tris = rec.info.map((i) => i[3]).sort((x, y) => x - y);
  const gpuOf = new Map(rec.extra.gpuFrames ?? []);
  const gpuAll = [...gpuOf.values()].sort((x, y) => x - y);
  res.gpu = gpuAll.length ? { p50: +gpuAll[gpuAll.length >> 1].toFixed(1), p95: +gpuAll[Math.floor(gpuAll.length * 0.95)].toFixed(1), max: +gpuAll[gpuAll.length - 1].toFixed(1), n: gpuAll.length } : null;
  delete rec.extra.gpuFrames;
  const round = (o) => Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v >= 0.5).sort((x, y) => y[1] - x[1]).map(([k, v]) => [k, +v.toFixed(1)]));
  const worst = rec.info.map((i, n) => [i, n]).sort((x, y) => y[0][1] - x[0][1]).slice(0, 12)
    .map(([i, n]) => ({ t: i[0], ms: i[1], gpuMs: [gpuOf.get(i[11] - 1), gpuOf.get(i[11])].map((x) => (x === undefined ? null : +x.toFixed(1))), heapDeltaMB: i[12], built: i[4], unloaded: i[5], loaded: i[7], newPrograms: i[8], newTextures: i[9], newGeometries: i[10], ...(a.attr ? { attr: round(rec.attr[n]) } : {}) }));
  let attrTotals;
  if (a.attr) {
    attrTotals = {};
    for (const f of rec.attr) for (const [k, v] of Object.entries(f)) attrTotals[k] = (attrTotals[k] ?? 0) + v;
    const nF = rec.attr.length;
    // frames > 33 ms whose measured tick CPU work (all wrapped parts; nested world time counted inside its caller) is
    // < 12 ms: the stall was outside the game's JS (GPU, compositor, or other processes sharing the machine)
    let ext = 0, own = 0;
    rec.info.forEach((i, n) => {
      if (i[1] <= 33.4) return;
      const f = rec.attr[n] ?? {};
      const cpu = Object.entries(f).filter(([k]) => k !== 'world' && !k.startsWith('b:')).reduce((s2, [, v]) => s2 + v, 0);
      if (cpu < 12) ext++; else own++;
    });
    res.over33Split = { externalOrGpu: ext, ownCpu: own };
    attrTotals = Object.fromEntries(Object.entries(attrTotals).sort((x, y) => y[1] - x[1]).map(([k, v]) => [k, +(v / nF).toFixed(2)]));
  }
  let dist = 0;
  for (let i = 1; i < rec.pos.length; i++) dist += Math.hypot(rec.pos[i][1] - rec.pos[i - 1][1], rec.pos[i][2] - rec.pos[i - 1][2]);
  Object.assign(res, {
    frames: dt.length,
    fpsAvg: +((dt.length / total) * 1000).toFixed(1),
    p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +sorted[sorted.length - 1].toFixed(1),
    over33: dt.filter((x) => x > 33.4).length, over50: dt.filter((x) => x > 50).length,
    hist,
    drawCalls: { p50: calls[calls.length >> 1], max: calls[calls.length - 1] },
    triangles: { p50: tris[tris.length >> 1], max: tris[tris.length - 1] },
    chunksBuilt: rec.info.reduce((s, i) => s + i[4], 0),
    distanceM: +dist.toFixed(0),
    worst,
    newPrograms: rec.newProgs,
    domRemovals: rec.removed,
    recorderStartS: +rec.readyAt.toFixed(2),
    attrPerFrameAvg: attrTotals,
    path: rec.pos.filter((_, i) => i % 5 === 0),
    stats: { ...rec.stats, modules: undefined },
    modules: rec.stats.modules?.filter((m) => m.status !== 'ok'),
    extra: rec.extra,
    inPageErrors: rec.inPageErrors,
  });
} catch (e) {
  res.fatal = String(e);
}
res.otherRunsAtEnd = others();
clearTimeout(kill);
await browser.close();
fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(res, null, 1));
const brief = { ...res };
delete brief.path; delete brief.warnings;
console.log(JSON.stringify(brief, null, 1));
