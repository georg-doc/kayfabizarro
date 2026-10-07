// dump errors/warnings of a page that never gets ready: node dbg.mjs "<url>" [secs]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
const [url, secs] = process.argv.slice(2);
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal'] });
const page = await (await browser.newContext()).newPage();
const msgs = [];
page.on('console', (m) => msgs.push(m.type() + ': ' + m.text().slice(0, 300)));
page.on('pageerror', (e) => msgs.push('pageerror: ' + e.message));
await page.goto(new URL(url, 'http://127.0.0.1:5180').toString());
await new Promise((r) => setTimeout(r, Number(secs ?? 30) * 1000));
console.log(msgs.slice(0, 30).join('\n'));
console.log('ready:', await page.evaluate(() => window.__kfb?.ready).catch((e) => 'eval failed ' + e.message));
await browser.close();
