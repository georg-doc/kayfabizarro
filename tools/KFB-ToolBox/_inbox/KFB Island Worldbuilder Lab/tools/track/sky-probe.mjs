// sky state in the organ world: shell, variant, fog, fog colour hook (LAB PATCH N1)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + (process.argv[2] ?? '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => { const pr = window.__kfb.sky(); return { fogHook: pr.fogHook, shell: pr.shell, variant: pr.variant, fog: pr.fog }; })));
await b.close();
