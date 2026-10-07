#!/usr/bin/env node
// Seed scan driver: loads the game once per batch (fresh page = fresh per-seed caches), runs the in-page scorer
// (src/modules/demo/scan.ts) for each seed, appends results to a JSON-lines file.
//   node src/modules/demo/tools/scan.mjs --from 1 --to 200 --batch 10 --out tools/out/demo/scan.jsonl
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : acc), []));
const from = Number(a.from ?? 1), to = Number(a.to ?? 20), batch = Number(a.batch ?? 10);
const seeds = a.seeds ? String(a.seeds).split(',').map(Number) : Array.from({ length: to - from + 1 }, (_, i) => from + i);
const out = path.resolve(ROOT, a.out ?? 'tools/out/demo/scan.jsonl');
const done = new Set();
if (fs.existsSync(out)) for (const l of fs.readFileSync(out, 'utf8').split('\n')) if (l.trim()) try { done.add(JSON.parse(l).seed); } catch {}
const todo = seeds.filter((s) => !done.has(s));
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
setTimeout(() => { console.error('watchdog'); browser.close().finally(() => process.exit(3)); }, Number(a.maxMs ?? 3600000)).unref();
const t0 = Date.now();
for (let i = 0; i < todo.length; i += batch) {
  const part = todo.slice(i, i + batch);
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  // a far-away tiny world view: the page only hosts the layers + nature protos
  await page.goto(`http://127.0.0.1:5180/?seed=${part[0]}&shot=1&hint=0&dpr=1`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: Number(a.timeout ?? 300000), polling: 500 });
  for (const s of part) {
    let r = null;
    for (let attempt = 0; attempt < 3 && !r; attempt++) {
      try {
        r = await page.evaluate(async (seed) => {
          const m = await import('/src/modules/demo/scan.ts');
          return (await m.scanSeeds([seed]))[0];
        }, s);
      } catch (e) {
        // Vite reloads the page when a module file is saved → wait for the app again and retry
        console.log(`seed ${s}: ${String(e).slice(0, 120)} → retry`);
        await page.waitForTimeout(3000);
        await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000, polling: 500 }).catch(() => {});
      }
    }
    if (!r) r = { seed: s, error: 'evaluate failed 3x' };
    fs.appendFileSync(out, JSON.stringify(r) + '\n');
    const b = r.best;
    console.log(`seed ${s} ${r.ms}ms ${r.error ? 'ERROR ' + r.error.slice(0, 200) : b ? `${b.id} total ${b.total} v${b.points.village} b${b.points.bridge}(${b.bridge_m}) f${b.points.forest}(${b.forest_m}) r${b.points.route} view${b.points.view}` : 'no village'}  [${Math.round((Date.now() - t0) / 1000)}s]`);
  }
  if (errs.length) console.log('page errors:', errs.slice(0, 3));
  await page.close();
}
await browser.close();
