// Writes public/roadbeds/<islandId>.outline.json (kfb.island-outline/1) for RKIT.
//   node tools/export-outline.mjs rkit_hub            (uses ?hub=1 so the runtime-only test island exists)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2] ?? 'rkit_hub';
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const p = await b.newPage();
await p.goto(`http://127.0.0.1:5192/?shot=1&hub=1`);
await p.waitForFunction(() => window.__kfb?.ready && window.__kfb.exportOutline, null, { timeout: 90000 });
const out = await p.evaluate((i) => window.__kfb.exportOutline(i, 1), id);
const file = path.join(ROOT, 'public/roadbeds', `${id}.outline.json`);
fs.writeFileSync(file, JSON.stringify(out));
const filled = out.ground.data.filter((v) => v !== null).length;
console.log(JSON.stringify({ file, hash: out.outlineHash, poly: out.poly.length, radius: out.radius, grid: [out.ground.nx, out.ground.nz], inside: filled, bytes: fs.statSync(file).size }));
await b.close();
