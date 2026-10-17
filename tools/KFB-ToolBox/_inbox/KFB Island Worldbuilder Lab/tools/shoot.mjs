#!/usr/bin/env node
// Verification tool. Loads the app in Chrome (GPU, headless), waits for window.__kfb.ready, applies camera presets /
// time of day, writes PNG + JSON log, optionally drives REAL keyboard/mouse input from a script and records a video
// plus a contact sheet of frames. See tools/README.md.
//
//   node tools/shoot.mjs --url "/?showcase=terrain" --name terrain --presets overview,aerial,low --time 10
//   node tools/shoot.mjs --url "/" --name walk --script tools/scripts/walk.json --video --sheet
//
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const BASE = args.base ?? 'http://127.0.0.1:5190';
const url = new URL(args.url ?? '/', BASE);
url.searchParams.set('shot', '1');
if (args.seed) url.searchParams.set('seed', args.seed);
const [W, H] = (args.size ?? '1920x1080').split('x').map(Number);
const outDir = path.resolve(ROOT, args.out ?? 'tools/out');
const name = args.name ?? 'shot';
// presets separated by ';' or by ',' not followed by a number (orbit:x,y,z,yaw,pitch,dist keeps its commas)
const presets = (args.presets ?? '').split(/;|,(?![-\d.])/).filter(Boolean);
fs.mkdirSync(outDir, { recursive: true });
// Disk guard: the machine ran low on space (screenshots + swap from parallel browsers). Refuse below 1.0 GB free (1.5 GB with --video).
try {
  const st = fs.statfsSync(outDir);
  const freeGB = (st.bavail * st.bsize) / 1e9;
  if (freeGB < (args.video ? 1.5 : 1.0)) { console.error(`ABORT: only ${freeGB.toFixed(2)} GB free on disk. Delete old files in tools/out first (old *.webm, scratch shots).`); process.exit(4); }
} catch {}
// Default image format JPEG q90 (≈1/5 of PNG). --png forces PNG.
const EXT = args.png ? 'png' : 'jpg';
const SHOT_OPTS = args.png ? {} : { type: 'jpeg', quality: 90 };

const log = { url: url.toString(), name, startedAt: new Date().toISOString(), size: [W, H], consoleErrors: [], pageErrors: [], warnings: [], shots: [], stats: null, ready: false };

const CHROMES = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const executablePath = CHROMES.find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
if (!executablePath) throw new Error('no working Chrome found; set CHROME=/path/to/chrome');
const browser = await chromium.launch({
  executablePath,
  headless: args.headed ? false : true,
  args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'],
});
// Watchdog: never leave an orphaned Chrome behind (hung runs, killed agents).
const killAll = async (why) => {
  log.fatal = log.fatal ?? why;
  try { fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(log, null, 2)); } catch {}
  try { await browser.close(); } catch {}
  process.exit(3);
};
setTimeout(() => killAll(`watchdog: exceeded --maxMs ${args.maxMs ?? 600000} ms`), Number(args.maxMs ?? 600000)).unref();
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => killAll(`killed by ${sig}`));
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error') log.consoleErrors.push(t);
  else if (m.type() === 'warning') log.warnings.push(t);
});
page.on('pageerror', (e) => log.pageErrors.push(String(e)));
await page.addInitScript(() => { window.__kfbNoPointerLock = true; });

try {
  // Vite full-reloads the page when another agent saves a file → retry load+ready a few times.
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(url.toString(), { waitUntil: 'load', timeout: 60000 });
      await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: Number(args.timeout ?? 90000) });
      await page.waitForTimeout(300);
      await page.evaluate(() => window.__kfb.ready);
      break;
    } catch (e) {
      if (attempt >= 3 || !/context was destroyed|navigation|Target closed|frame was detached/i.test(String(e))) throw e;
      log.retries = (log.retries ?? 0) + 1;
      log.consoleErrors.length = 0; log.pageErrors.length = 0; log.warnings.length = 0;
    }
  }
  log.ready = true;
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) { log.reloadedMidRun = (log.reloadedMidRun ?? 0) + 1; console.warn('WARNING: page navigated/reloaded mid-run — results after this point are unreliable'); } });
  log.presets = await page.evaluate(() => window.__kfb.presets());
  if (args.time) log.timeSet = await page.evaluate((h) => window.__kfb.setTime(h), Number(args.time));
  await settle(Number(args.settle ?? 1500));

  // lab: --eval "expr;;expr" prints JSON results (log.eval)
  if (args.eval) { log.eval = []; for (const e of String(args.eval).split(';;')) { try { log.eval.push(await page.evaluate(e)); } catch (x) { log.eval.push('ERR ' + String(x).slice(0, 300)); } } console.log('EVAL', JSON.stringify(log.eval)); }
  for (const p of presets) await shot(p);
  if (!presets.length && !args.script && !args.eval) await shot('default');

  // lab: --perf records every frame interval (rAF) during the script → median fps and 1 % low (fps of the 99th-percentile frame time)
  if (args.perf) await page.evaluate(() => { window.__labFT = []; let last = performance.now(); const f = (t) => { window.__labFT.push(t - last); last = t; if (window.__labFT.length < 100000) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  if (args.script) await runScript(JSON.parse(fs.readFileSync(path.resolve(ROOT, args.script), 'utf8')));
  if (args.perf) {
    log.perf = await page.evaluate(() => { const a = window.__labFT.slice(5).sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(a.length * p))];
      return { frames: a.length, medianFps: +(1000 / q(0.5)).toFixed(1), low1Fps: +(1000 / q(0.99)).toFixed(1), worstMs: +a[a.length - 1].toFixed(1), meanFps: +(1000 * a.length / a.reduce((s, v) => s + v, 0)).toFixed(1) }; });
    console.log('PERF', JSON.stringify(log.perf));
  }

  log.stats = await page.evaluate(() => window.__kfb.stats());
  log.streaming = await page.evaluate(() => window.__kfb.streaming?.report?.() ?? null).catch(() => null);
  log.inPageErrors = await page.evaluate(() => window.__kfb.errors.slice());
  log.inPageWarnings = (await page.evaluate(() => window.__kfb.warnings.slice())).slice(0, 50);
} catch (e) {
  log.fatal = String(e);
  try { await page.screenshot({ path: path.join(outDir, `${name}__FATAL.${EXT}`), ...SHOT_OPTS }); } catch {}
}
log.finishedAt = new Date().toISOString();
log.errorCount = log.consoleErrors.length + log.pageErrors.length + (log.fatal ? 1 : 0);
fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(log, null, 2));
await browser.close();
console.log(JSON.stringify({ name, ready: log.ready, presets: log.presets, errors: log.errorCount, fatal: log.fatal, fps: log.stats?.fps, drawCalls: log.stats?.drawCalls, triangles: log.stats?.triangles, gpu: log.stats?.gpu, files: log.shots.map((s) => s.file) }, null, 1));
if (log.consoleErrors.length || log.pageErrors.length) console.log('ERRORS:\n' + [...log.pageErrors, ...log.consoleErrors].slice(0, 20).join('\n'));
process.exit(log.fatal ? 2 : 0);

// ---------------------------------------------------------------------------

async function settle(ms) {
  await page.evaluate(() => window.__kfb.waitIdle(20000));
  await page.waitForTimeout(ms);
}

async function shot(preset, label) {
  if (preset && preset !== 'current') await page.evaluate((p) => window.__kfb.setCamera(p), parsePreset(preset));
  await settle(Number(args.settle ?? 800));
  // measure fps over 1 s with the camera held
  const stats = await page.evaluate(async () => { await new Promise((r) => setTimeout(r, 1000)); return window.__kfb.stats(); });
  const file = `${name}__${(label ?? preset).replace(/[^\w.-]+/g, '_')}.${EXT}`;
  await page.screenshot({ path: path.join(outDir, file), ...SHOT_OPTS });
  log.shots.push({ preset, file, fps: stats.fps, drawCalls: stats.drawCalls, triangles: stats.triangles, chunks: stats.chunks });
}

function parsePreset(p) {
  // "orbit:x,y,z,yaw,pitch,dist" or preset name
  if (typeof p === 'string' && p.startsWith('orbit:')) {
    const [x, y, z, yaw, pitch, dist] = p.slice(6).split(',').map(Number);
    return { target: [x, y, z], yaw, pitch, dist };
  }
  return p;
}

async function runScript(steps) {
  // Real input only: Playwright keyboard + mouse. No teleport, no state writes.
  const box = { x: W / 2, y: H / 2 };
  await page.mouse.move(box.x, box.y);
  let rec = null;
  if (args.video) {
    await page.evaluate(() => {
      const c = document.querySelector('canvas');
      const stream = c.captureStream(30);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
      const r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
      window.__rec = { r, chunks: [] };
      r.ondataavailable = (e) => e.data.size && window.__rec.chunks.push(e.data);
      r.start(250);
    });
    rec = true;
  }
  const sheet = [];
  const sheetEvery = Number(args.sheetEvery ?? 150);
  let sheetTimer = null;
  if (args.sheet) {
    sheetTimer = setInterval(async () => {
      try {
        const b64 = await page.evaluate((crop) => {
          const c = document.querySelector('canvas');
          const t = document.createElement('canvas');
          const g = t.getContext('2d');
          if (crop) {
            // square crop (crop px in canvas pixels) centred on the player's feet, scaled to 480x480
            const e = window.__kfb.engine, p = e.ctx.services.get('player')?.position;
            let sx = c.width / 2, sy = c.height / 2;
            if (p) {
              const v = p.clone().project(e.camera);
              sx = (v.x * 0.5 + 0.5) * c.width; sy = (-v.y * 0.5 + 0.5) * c.height;
            }
            t.width = 480; t.height = 480;
            g.drawImage(c, sx - crop / 2, sy - crop * 0.7, crop, crop, 0, 0, 480, 480);
          } else {
            t.width = 480; t.height = Math.round((480 * c.height) / c.width);
            g.drawImage(c, 0, 0, t.width, t.height);
          }
          return t.toDataURL('image/jpeg', 0.85);
        }, args.sheetCrop ? Number(args.sheetCrop) : 0);
        const st = await page.evaluate(() => window.__kfb.player());
        sheet.push({ b64, t: Date.now(), st });
      } catch {}
    }, sheetEvery);
  }
  const t0 = Date.now();
  const trace = [];
  for (const s of steps) {
    trace.push({ t: Date.now() - t0, step: s });
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.down) await page.keyboard.down(s.down);
    if (s.up) await page.keyboard.up(s.up);
    if (s.press) await page.keyboard.press(s.press, { delay: s.delay ?? 80 });
    if (s.hold) {
      const keys = [].concat(s.hold);
      for (const k of keys) await page.keyboard.down(k);
      await page.waitForTimeout(s.ms ?? 1000);
      for (const k of keys.reverse()) await page.keyboard.up(k);
    }
    if (s.drag) {
      // orbit: a real mouse drag in small moves. KFB canon (2026-10-07): the camera orbits on a RIGHT drag
      // (default button 'right'); {"drag":{…,"button":"left"}} only does something with ?lmbOrbit=1.
      const { dx = 0, dy = 0, ms = 400, button = 'right' } = s.drag;
      const n = Math.max(4, Math.round(ms / 16));
      await page.mouse.move(box.x, box.y);
      await page.mouse.down({ button });
      for (let i = 1; i <= n; i++) {
        await page.mouse.move(box.x + (dx * i) / n, box.y + (dy * i) / n);
        await page.waitForTimeout(ms / n);
      }
      await page.mouse.up({ button });
      await page.mouse.move(box.x, box.y);
    }
    if (s.wheel) {
      const n = 6;
      for (let i = 0; i < n; i++) { await page.mouse.wheel(0, s.wheel / n); await page.waitForTimeout(30); }
    }
    if (s.camera) await page.evaluate((p) => window.__kfb.setCamera(p), parsePreset(s.camera));
    if (s.until) {
      // closed-loop wait: a JS expression evaluated in the page, e.g. "__kfb.player().pos[0] > 40"
      try { await page.waitForFunction(s.until, null, { timeout: s.timeout ?? 15000, polling: 50 }); trace.push({ t: Date.now() - t0, until: 'met' }); }
      catch { trace.push({ t: Date.now() - t0, until: 'timeout' }); }
    }
    if (s.shot) {
      const file = `${name}__${s.shot}.${EXT}`;
      await page.screenshot({ path: path.join(outDir, file), ...SHOT_OPTS });
      const st = await page.evaluate(() => ({ stats: window.__kfb.stats(), player: window.__kfb.player() }));
      log.shots.push({ preset: 'script', file, fps: st.stats.fps, drawCalls: st.stats.drawCalls, player: st.player });
    }
  }
  if (sheetTimer) clearInterval(sheetTimer);
  log.inputTrace = trace;
  if (rec) {
    const b64 = await page.evaluate(async () => {
      const { r, chunks } = window.__rec;
      await new Promise((res) => { r.onstop = res; r.stop(); });
      const blob = new Blob(chunks, { type: 'video/webm' });
      const buf = await blob.arrayBuffer();
      let s = ''; const u = new Uint8Array(buf);
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return btoa(s);
    });
    const file = `${name}.webm`;
    fs.writeFileSync(path.join(outDir, file), Buffer.from(b64, 'base64'));
    log.video = file;
  }
  if (sheet.length) {
    // contact sheets of 4x3 frames each, composed in the page (no native deps)
    const per = 12;
    log.sheets = [];
    log.sheetStates = sheet.map((f) => ({ t: f.t - sheet[0].t, st: f.st }));
    for (let i = 0; i < sheet.length; i += per) {
      const group = sheet.slice(i, i + per);
      const png = await page.evaluate(async (frames) => {
        const imgs = await Promise.all(frames.map((f) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = f.b64; })));
        const w = imgs[0].width, h = imgs[0].height, cols = 4, rows = Math.ceil(imgs.length / cols);
        const c = document.createElement('canvas');
        c.width = w * cols; c.height = h * rows;
        const g = c.getContext('2d');
        g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
        imgs.forEach((im, k) => {
          g.drawImage(im, (k % cols) * w, Math.floor(k / cols) * h);
          g.fillStyle = '#000a'; g.fillRect((k % cols) * w, Math.floor(k / cols) * h, 150, 20);
          g.fillStyle = '#fff'; g.font = '13px monospace';
          const st = frames[k].st;
          g.fillText(`+${frames[k].t - frames[0].t}ms ${st?.gait ?? ''}`, (k % cols) * w + 4, Math.floor(k / cols) * h + 14);
        });
        return c.toDataURL('image/jpeg', 0.9);
      }, group);
      const file = `${name}__sheet${String(i / per).padStart(2, '0')}.jpg`;
      fs.writeFileSync(path.join(outDir, file), Buffer.from(png.split(',')[1], 'base64'));
      log.sheets.push(file);
    }
  }
}

function parseArgs(a) {
  const o = {};
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2);
    const v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
    o[k] = v;
  }
  return o;
}
