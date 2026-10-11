// Shared headless Chrome for Stufe 1 checks (one browser, watchdog, no orphans). Lab dev server on 127.0.0.1:5192.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';

export const BASE = process.env.LAB_BASE ?? 'http://127.0.0.1:5192';
export async function openLab(query, { w = 1600, h = 1000, maxMs = 300000, path = '' } = {}) {
  const CH = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const executablePath = CH.find((c) => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
  const dog = setTimeout(async () => { console.error('watchdog: browser killed after', maxMs, 'ms'); try { await browser.close(); } catch {} process.exit(3); }, maxMs);
  dog.unref();
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, async () => { try { await browser.close(); } catch {} process.exit(3); });
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE + '/' + path + '?' + query, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__kfb?.ready, null, { timeout: 180000 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
  return { browser, page, errors, close: async () => { clearTimeout(dog); await browser.close(); } };
}
