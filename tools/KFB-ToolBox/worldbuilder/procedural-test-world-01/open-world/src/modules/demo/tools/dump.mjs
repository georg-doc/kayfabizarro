#!/usr/bin/env node
// Dump the demo plan of a seed (window.__kfb.demo()) and write its real-input route scripts as JSON files.
//   node src/modules/demo/tools/dump.mjs --seed 42 [--url "/?seed=42"] --out tools/out/demo/r2
// → <out>/plan_<seed>.json, <out>/script_<seed>_<demo_run|bridge_run|forest_run|bridge_walk|forest_walk>.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : acc), []));
const seed = a.seed ?? 'default';
const out = path.resolve(ROOT, a.out ?? 'tools/out/demo/r2');
fs.mkdirSync(out, { recursive: true });
const url = new URL(a.url ?? (a.seed ? `/?seed=${a.seed}` : '/'), 'http://127.0.0.1:5180');
url.searchParams.set('shot', '1');
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
setTimeout(() => browser.close().finally(() => process.exit(3)), 400000).unref();
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
await page.goto(url.toString(), { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__kfb && window.__kfb.ready && window.__kfb.demo, null, { timeout: 300000, polling: 500 });
const d = await page.evaluate(() => window.__kfb.demo());
await browser.close();
const { scripts, ...plan } = d;
fs.writeFileSync(path.join(out, `plan_${seed}.json`), JSON.stringify(plan, null, 1));
for (const [k, s] of Object.entries(scripts ?? {})) fs.writeFileSync(path.join(out, `script_${seed}_${k}.json`), JSON.stringify(s, null, 1));
const c = plan.candidates?.[0];
console.log(JSON.stringify({ seed: plan.seed, village: plan.village?.id, spawn: plan.spawn, landmarks: plan.landmarks, distances: plan.distances_m, travel: plan.travel, best: c && { total: c.total, points: c.points }, planMs: plan.planMs }, null, 1));
