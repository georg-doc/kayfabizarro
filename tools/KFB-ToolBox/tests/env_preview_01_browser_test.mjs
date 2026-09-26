import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.ENV_PREVIEW_BASE || 'http://127.0.0.1:4173';
const OUT = 'env-preview-proof';
fs.mkdirSync(OUT, { recursive: true });

const atlasUrl = BASE + '/tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/KFB_Resident_Atlas_S9.html';
const toolboxUrl = BASE + '/tools/KFB-ToolBox/_inbox/KFB%20ToolBox%20Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/KFB%20ToolBox%20Production-01.dc.html';

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader']
});

const results = [];
const add = (consumer, name, pass, detail='') => {
  results.push({ consumer, name, pass: !!pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + ' · ' + consumer + ' · ' + name + (detail ? ' · ' + detail : ''));
};

async function exerciseAtlas() {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  await page.goto(atlasUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(() => window.__atlas && window.__atlas.ENV && window.__atlas.cur && window.__atlas.cur(), null, { timeout: 90000 });

  const world = await page.evaluate(() => ({
    probe: window.__atlas.ENV.probe(),
    resident: window.__atlas.cur()?.residentId || window.__atlas.cur()?.display || 'loaded',
    canvas: document.querySelectorAll('#stage canvas').length,
    envOn: window.__atlas.ENV.on
  }));

  add('Resident Atlas', 'real resident loaded', !!world.resident, String(world.resident));
  add('Resident Atlas', 'single host canvas', world.canvas === 1, 'canvas=' + world.canvas);
  add('Resident Atlas', 'WORLD_MATCH default', world.probe.requestedMode === 'WORLD_MATCH' && world.envOn, world.probe.resolvedPreset);
  add('Resident Atlas', 'current Travel source head resolved', world.probe.sourceHead === '8614282aab2ced43bb5dda9fcf7abadf9768100a', world.probe.sourceHead || 'null');

  await page.screenshot({ path: OUT + '/resident-world-match.png', fullPage: true });

  const isolated = await page.evaluate(() => {
    window.__atlas.ENV.setOn(false);
    return window.__atlas.ENV.probe();
  });
  add('Resident Atlas', 'SOURCE_ISOLATION switch', isolated.requestedMode === 'SOURCE_ISOLATION' && isolated.sourceHead === null, isolated.resolvedPreset);
  await page.screenshot({ path: OUT + '/resident-source-isolation.png', fullPage: true });

  const evening = await page.evaluate(() => {
    window.__atlas.ENV.setOn(true);
    window.__atlas.ENV.setTime(18);
    return window.__atlas.ENV.probe();
  });
  add('Resident Atlas', 'source-backed Evening preset', evening.resolvedPreset === 'evening', evening.resolvedPreset);
  add('Resident Atlas', 'no page errors', pageErrors.length === 0, pageErrors.join(' | '));
  await page.close();
}

async function exerciseToolbox() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  await page.goto(toolboxUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(() => window.__kfbTB && window.__kfbEnvPreview && window.__kfbTB.runtime, null, { timeout: 120000 });

  const world = await page.evaluate(() => ({
    probe: window.__kfbEnvPreview.probe(),
    kind: window.__kfbTB.runtime?.kind || null,
    canvas: document.querySelectorAll('#kfb-stage canvas').length,
    selector: !!document.querySelector('#kfb-env-preview-mode')
  }));

  add('ToolBox', 'real actor runtime loaded', !!world.kind, String(world.kind));
  add('ToolBox', 'single host canvas', world.canvas === 1, 'canvas=' + world.canvas);
  add('ToolBox', 'compact environment selector mounted', world.selector);
  add('ToolBox', 'WORLD_MATCH default', world.probe.requestedMode === 'WORLD_MATCH', world.probe.resolvedPreset);
  add('ToolBox', 'current Travel source head resolved', world.probe.sourceHead === '8614282aab2ced43bb5dda9fcf7abadf9768100a', world.probe.sourceHead || 'null');

  await page.screenshot({ path: OUT + '/toolbox-world-match.png', fullPage: true });

  const isolated = await page.evaluate(() => {
    const s = document.querySelector('#kfb-env-preview-mode');
    s.value = 'SOURCE_ISOLATION::world.current';
    s.dispatchEvent(new Event('change', { bubbles: true }));
    return window.__kfbEnvPreview.probe();
  });
  add('ToolBox', 'SOURCE_ISOLATION switch', isolated.requestedMode === 'SOURCE_ISOLATION' && isolated.sourceHead === null, isolated.resolvedPreset);
  await page.screenshot({ path: OUT + '/toolbox-source-isolation.png', fullPage: true });

  const night = await page.evaluate(() => {
    const s = document.querySelector('#kfb-env-preview-mode');
    s.value = 'CONSUMER_PRESET::world.night';
    s.dispatchEvent(new Event('change', { bubbles: true }));
    return window.__kfbEnvPreview.probe();
  });
  add('ToolBox', 'source-backed Night preset', night.requestedMode === 'CONSUMER_PRESET' && night.resolvedPreset === 'night', night.resolvedPreset);
  add('ToolBox', 'no page errors', pageErrors.length === 0, pageErrors.join(' | '));
  await page.close();
}

let fatal = null;
try {
  await exerciseAtlas();
  await exerciseToolbox();
} catch (e) {
  fatal = String(e && e.stack || e);
  console.error(fatal);
}
await browser.close();

const failed = results.filter(r => !r.pass);
const report = {
  schema: 'kfb.env-preview-01-browser-proof/1',
  base: BASE,
  results,
  passed: results.length - failed.length,
  total: results.length,
  fatal
};
fs.writeFileSync(OUT + '/results.json', JSON.stringify(report, null, 2));

console.log('\n' + report.passed + '/' + report.total + ' browser checks PASS');
if (fatal || failed.length) process.exit(1);
