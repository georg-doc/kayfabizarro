// Fraktaler Almanach (7, Georgs Korrektur 11.10.) · acceptance stills on the PondLand stage, 12 collected cards (fan shows 7 + „+5“):
// 01 fan closed (right, straight) · 02 fan open by a real hover (straight down) · 03 overlay (tab per deck, grid of quarters) after a
// real click on a card · 04 viewer after a real click on a quarter. node tools/stage2/almanac-shots.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const logs = [], external = new Set();
p.on('pageerror', (e) => logs.push('pageerror ' + e.message));
p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) external.add(u.hostname + u.pathname.slice(0, 50)); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=3,7,12,18,21,27,33,38,41,47,52,56');
await p.waitForFunction(() => window.__kfb?.almanac?.()?.drawn >= 7, null, { timeout: 180000 });
await p.waitForTimeout(1500);
const A = () => p.evaluate(() => window.__kfb.almanac());
const report = { shots: {} };
await p.screenshot({ path: `${out}/01_fan_closed.jpg`, type: 'jpeg', quality: 90 }); report.shots.closed = await A();
const box = await p.evaluate(() => { const c = [...document.querySelectorAll('[data-almanac-card]')].sort((a, b) => +b.style.zIndex - +a.style.zIndex)[0]?.getBoundingClientRect(); return c ? { x: c.x + c.width / 2, y: c.y + c.height / 2 } : null; });
await p.mouse.move(box.x, box.y); await p.waitForTimeout(1100);
await p.screenshot({ path: `${out}/02_fan_open_hover.jpg`, type: 'jpeg', quality: 90 }); report.shots.hover = await A();
await p.mouse.click(box.x, box.y); await p.waitForFunction(() => window.__kfb.almanac().mode === 'overlay' && window.__kfb.almanac().gridDrawn >= 8, null, { timeout: 30000 }).catch(() => null); await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/03_overlay_tabs_grid.jpg`, type: 'jpeg', quality: 90 }); report.shots.overlay = await A();
const q = await p.evaluate(() => { const c = document.querySelector('[data-almanac-quarter]')?.getBoundingClientRect(); return c ? { x: c.x + c.width / 2, y: c.y + c.height / 2 } : null; });
await p.mouse.click(q.x, q.y); await p.waitForFunction(() => window.__kfb.almanac().mode === 'viewer', null, { timeout: 20000 }); await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/04_viewer_open.jpg`, type: 'jpeg', quality: 90 }); report.shots.viewer = await A();
report.external = [...external]; report.logs = logs; report.errors = await p.evaluate(() => window.__kfb.errors);
fs.writeFileSync(`${out}/almanac-shots.json`, JSON.stringify(report, null, 1)); console.log(JSON.stringify(report));
await b.close();
