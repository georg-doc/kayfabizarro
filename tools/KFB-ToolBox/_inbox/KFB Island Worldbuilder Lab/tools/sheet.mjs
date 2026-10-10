// Contact sheet: node tools/sheet.mjs <out.jpg> <cols> <img1> <img2> ... (paths relative to the lab root, served by the dev server)
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const [out, cols, ...imgs] = process.argv.slice(2);
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const b = await chromium.launch({ executablePath: exe, headless: true });
const W = 1800, cw = Math.floor(W / Number(cols));
const p = await b.newPage({ viewport: { width: W, height: 400 } });
await p.goto('http://127.0.0.1:5192/lineup.html?sheet=1').catch(() => {});
await p.setContent(`<body style="margin:0;background:#fff;display:grid;grid-template-columns:repeat(${cols},${cw}px)">${imgs.map((i) => `<img src="http://127.0.0.1:5192/${i}?v=${Date.now()}" style="width:${cw}px;display:block">`).join('')}</body>`);
await p.waitForFunction(() => [...document.images].every((i) => i.complete));
await p.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 85 });
await b.close();
