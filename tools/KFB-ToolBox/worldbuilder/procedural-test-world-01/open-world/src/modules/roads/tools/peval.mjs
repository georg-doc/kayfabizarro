// Evaluate JS in the running app (headless Chrome) and print the JSON result.
//   node src/modules/roads/tools/peval.mjs "/?showcase=roads&seed=42" "window.__roads.find()"
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
const [url, expr] = process.argv.slice(2);
const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const t = setTimeout(() => { console.log('timeout'); browser.close(); process.exit(3); }, 240000);
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  await page.goto(new URL(url, 'http://127.0.0.1:5180').toString());
  await page.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 120000 });
  let cdp = null;
  if (process.env.PROF) { cdp = await context.newCDPSession(page); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start'); }
  const res = await page.evaluate(expr);
  if (cdp) {
    const { profile: p } = await cdp.send('Profiler.stop');
    const byId = new Map(p.nodes.map((n) => [n.id, n]));
    const self = new Map(); const tot = new Map();
    p.samples.forEach((s, i) => { const n = byId.get(s); const k = n.callFrame.functionName + ' ' + n.callFrame.url.split('/').slice(-2).join('/') + ':' + n.callFrame.lineNumber; self.set(k, (self.get(k) ?? 0) + (p.timeDeltas[i] ?? 0)); });
    console.log([...self].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, t]) => (t / 1000).toFixed(0) + 'ms ' + k).join('\n'));
  }
  console.log(JSON.stringify(res, null, 1));
  if (errs.length) console.log('CONSOLE:', errs.slice(0, 10).join('\n'));
} finally { clearTimeout(t); await browser.close(); }
