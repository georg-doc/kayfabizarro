import { chromium } from 'playwright-core';
import path from 'node:path';
const [src, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
await p.goto('file://' + path.resolve(src)); await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true }); await b.close();
