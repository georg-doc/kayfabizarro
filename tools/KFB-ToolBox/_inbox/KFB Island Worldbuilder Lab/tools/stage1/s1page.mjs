import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await (await b.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
await p.goto('http://127.0.0.1:5192/speckle.html?solo=new&cam=walk', { waitUntil: 'load' });
await p.waitForTimeout(2500);
await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 90 });
await b.close();
