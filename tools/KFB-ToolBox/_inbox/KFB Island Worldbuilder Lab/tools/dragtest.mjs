// Dev check: drags the three-inspect pane title bar with real mouse input and reports its position before/after.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const executablePath = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const b = await chromium.launch({ executablePath, headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
p.on('console', (m) => m.type() === 'error' && console.log('ERR', m.text()));
await p.goto('http://127.0.0.1:5192/?inspect=1&shot=1');
await p.waitForTimeout(7000);
const r = () => p.evaluate(() => [...document.querySelectorAll('.draggable-container')].map((e) => { const t = e.querySelector('.tp-rotv_t').getBoundingClientRect(); return { left: e.getBoundingClientRect().left, top: e.getBoundingClientRect().top, title: [t.x, t.y, t.width, t.height] }; }));
const before = await r(); console.log('before', JSON.stringify(before));
const t = before[0].title; const x = t[0] + t[2] / 2, y = t[1] + t[3] / 2;
console.log('hit', await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e.tagName + '.' + e.className; }, [x, y]));
await p.mouse.move(x, y); await p.mouse.down(); for (let i = 1; i <= 10; i++) await p.mouse.move(x - i * 30, y + i * 20); await p.mouse.up();
await p.waitForTimeout(300);
console.log('after', JSON.stringify(await r()));
await b.close();
