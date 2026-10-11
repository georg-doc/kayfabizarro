// C1b+C3 smoke test runner: loads /organ-test.html offline (non-local requests aborted), waits for the build, prints the summary
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; if (out) fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [], blocked = [];
p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ' ' + m.text().slice(0, 200)); });
await p.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => { blocked.push(r.request().url().slice(0, 140)); return r.abort(); });
await p.goto('http://127.0.0.1:5192/organ-test.html');
const T0 = Date.now(); let lastN = -1;
while (true) { const st = await p.evaluate(() => ({ done: !!window.__organ?.done, notes: window.__organ?.notes ?? [] })).catch(() => ({ done: false, notes: [] }));
  if (st.notes.length !== lastN) { console.log(Math.round((Date.now() - T0) / 1000) + 's', st.notes.slice(-1)[0], '| logs', logs.length); lastN = st.notes.length; }
  if (st.done) break; if (Date.now() - T0 > Number(process.env.SMOKE_MS ?? 900000)) { console.log('TIMEOUT', JSON.stringify({ notes: st.notes.slice(-5), logs: logs.slice(0, 15), blocked: [...new Set(blocked)].slice(0, 10) }, null, 1)); await b.close(); process.exit(1); }
  await new Promise((r) => setTimeout(r, 5000)); }
await p.waitForTimeout(2000);
const r = await p.evaluate(() => { const o = window.__organ; const { W, ...rest } = o; return rest; });
if (out) await p.screenshot({ path: out + '/smoke_overview.jpg', type: 'jpeg', quality: 85 });
console.log(JSON.stringify({ ...r, logs: logs.slice(0, 20), blocked: [...new Set(blocked)].slice(0, 20) }, null, 1).slice(0, 5000));
await b.close();
