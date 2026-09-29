import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL = 'http://127.0.0.1:4173/game-container/turbo-kfb/bench/playcanvas-arch-01/';
const OUT = 'playcanvas-arch-01-evidence';
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok: Boolean(ok), detail });
  if (!ok) throw new Error(`${name}: ${detail}`);
};

await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForFunction(() => document.documentElement.dataset.pcArchReady === '1', null, { timeout: 90000 });

const engine = await page.evaluate(() => ({
  ready: window.__PC_ARCH_BENCH__?.ready,
  engineVersion: window.__PC_ARCH_BENCH__?.engineVersion,
  snapshot: window.__PC_ARCH_BENCH__?.snapshot()
}));
check('bench ready', engine.ready === true, JSON.stringify(engine));
check('engine pin', engine.engineVersion === '2.22.4', engine.engineVersion);
check('WebGL2 device', engine.snapshot?.webgl2 === true && engine.snapshot?.deviceType === 'webgl2', JSON.stringify(engine.snapshot));

async function runCase(label, input, seconds = 0.8) {
  await page.evaluate(async (cfg) => window.__PC_ARCH_BENCH__.setCase(cfg), input);
  const result = await page.evaluate(async (s) => {
    const sampled = await window.__PC_ARCH_BENCH__.sample(s);
    return { ...window.__PC_ARCH_BENCH__.snapshot(), sampled };
  }, seconds);
  check(`${label} frames`, result.sampled.frames > 5, JSON.stringify(result.sampled));
  check(`${label} finite stats`, Number.isFinite(result.sampled.frameMs) && Number.isFinite(result.sampled.cpuRenderMs) && Number.isFinite(result.sampled.drawCalls), JSON.stringify(result.sampled));
  return result;
}

const e100 = await runCase('entities 100', { mode: 'entities', count: 100, shadows: false, pixelRatio: false });
const i100 = await runCase('instanced 100', { mode: 'instanced', count: 100, shadows: false, pixelRatio: false });
const e500 = await runCase('entities 500', { mode: 'entities', count: 500, shadows: false, pixelRatio: false });
const i500 = await runCase('instanced 500', { mode: 'instanced', count: 500, shadows: false, pixelRatio: false });
const i2000 = await runCase('instanced 2000', { mode: 'instanced', count: 2000, shadows: false, pixelRatio: false });
const e100Shadow = await runCase('entities 100 shadows', { mode: 'entities', count: 100, shadows: true, pixelRatio: false });

check('entity submissions scale with objects', e100.sampled.drawCalls >= 90 && e500.sampled.drawCalls >= 450, `e100=${e100.sampled.drawCalls}, e500=${e500.sampled.drawCalls}`);
check('instancing collapses draw calls 100', i100.sampled.drawCalls < e100.sampled.drawCalls / 10, `entities=${e100.sampled.drawCalls}, instanced=${i100.sampled.drawCalls}`);
check('instancing collapses draw calls 500', i500.sampled.drawCalls < e500.sampled.drawCalls / 20, `entities=${e500.sampled.drawCalls}, instanced=${i500.sampled.drawCalls}`);
check('2000 instanced remains few draw calls', i2000.sampled.drawCalls <= 8, `draws=${i2000.sampled.drawCalls}`);
check('shadows add submissions', e100Shadow.sampled.drawCalls > e100.sampled.drawCalls, `off=${e100.sampled.drawCalls}, on=${e100Shadow.sampled.drawCalls}`);
check('no page errors', pageErrors.length === 0, pageErrors.join('\n'));
check('no console errors', consoleErrors.length === 0, consoleErrors.join('\n'));

await page.screenshot({ path: `${OUT}/desktop.png`, fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(async () => window.__PC_ARCH_BENCH__.setCase({ mode: 'instanced', count: 1000, shadows: false, pixelRatio: false }));
const mobileVisible = await page.locator('#mode-controls').isVisible() && await page.locator('#results').isVisible();
check('mobile controls visible', mobileVisible, '390x844');
await page.screenshot({ path: `${OUT}/mobile.png`, fullPage: true });

const report = {
  schema: 'kfb.playcanvas-arch-01.browser-proof/1',
  url: URL,
  engineVersion: engine.engineVersion,
  environment: { viewport: '1280x720', renderer: 'Chromium SwiftShader WebGL2' },
  cases: { e100, i100, e500, i500, i2000, e100Shadow },
  checks,
  pageErrors,
  consoleErrors,
  totals: { passed: checks.filter(x => x.ok).length, failed: checks.filter(x => !x.ok).length }
};
await fs.writeFile(`${OUT}/browser.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
