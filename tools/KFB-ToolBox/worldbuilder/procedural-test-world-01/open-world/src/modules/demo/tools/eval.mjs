#!/usr/bin/env node
// Load a game URL, wait for ready, evaluate a JS expression (async ok), print JSON.
//   node src/modules/demo/tools/eval.mjs "/?seed=123" "__kfb.demo().boot"
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const [u, expr] = process.argv.slice(2);
const url = new URL(u, 'http://127.0.0.1:5180'); url.searchParams.set('shot', '1');
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
setTimeout(() => browser.close().finally(() => process.exit(3)), 400000).unref();
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
const logs = []; page.on('console', (m) => { if (m.type() !== 'log' && m.type() !== 'debug') logs.push(m.type() + ': ' + m.text()); });
await page.goto(url.toString(), { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000, polling: 500 });
const r = await page.evaluate(`(async () => (${expr}))()`);
console.log(JSON.stringify(r, null, 1));
if (logs.length) console.log('console:', logs.slice(0, 10));
await browser.close();
