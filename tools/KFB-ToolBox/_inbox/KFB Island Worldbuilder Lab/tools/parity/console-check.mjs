// Console check: boot one URL headless, wait for the world, list warnings / errors / page errors. node tools/parity/console-check.mjs "<query>"
import { chromium } from 'playwright-core';
const q = process.argv[2] ?? '';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1000, height: 700 } }), L = [];
p.on('response', (r) => { if (r.status() >= 400) L.push('http ' + r.status() + ' ' + r.url().slice(0, 200)); });
p.on('pageerror', (e) => L.push('pageerror ' + e.message)); p.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/GPU stall|GroupMarkerNotSet/.test(m.text())) L.push(m.type() + ' ' + m.text().slice(0, 240)); });
await p.goto('http://127.0.0.1:5192/' + q); await p.waitForFunction(() => window.__kfb?.travel?.() || window.__kfb?.world, null, { timeout: 300000 }).catch(() => L.push('timeout waiting for world')); await p.waitForTimeout(4000);
console.log(JSON.stringify({ q, warnings: L.length, L }, null, 1)); await b.close();
