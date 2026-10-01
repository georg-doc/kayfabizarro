import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url = process.env.KFB_PROC_P0B_URL ||
  'http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-p0/source-isolation-soft.html';

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
const pageErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => pageErrors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForFunction(() => window.__KFB_PROC_P0B?.ready === true, null, { timeout: 60000 });

const state = await page.evaluate(() => window.__KFB_PROC_P0B);
const problems = [];
if (state?.stats?.families !== 3) problems.push('families != 3');
if (state?.stats?.totalInstances !== 48) problems.push('totalInstances != 48');
for (const k of ['tuft','pebble','tree']) {
  if (state?.stats?.instances?.[k] !== 16) problems.push(`${k} instances != 16`);
}
if (!(state?.stats?.triangles > 0 && state.stats.triangles < 50000)) problems.push('triangles outside bounded proof');
if (!(state?.stats?.calls > 0 && state.stats.calls < 40)) problems.push('draw calls outside bounded proof');
if (state?.donor?.head !== 'be10166e44f3d89db922ebb90671c10b89cd3e62') problems.push('donor pin mismatch');
if (!/smooth stylized/i.test(state?.donor?.visualBrief || '')) problems.push('visual brief missing');
if (consoleErrors.length) problems.push(`consoleErrors=${consoleErrors.length}`);
if (pageErrors.length) problems.push(`pageErrors=${pageErrors.length}`);

await fs.mkdir('procedural-props-p0b-evidence', { recursive: true });
await page.screenshot({ path: 'procedural-props-p0b-evidence/source-isolation-soft.png' });
await fs.writeFile(
  'procedural-props-p0b-evidence/source-isolation-soft.json',
  JSON.stringify({ url, state, consoleErrors, pageErrors, problems }, null, 2)
);

await browser.close();

console.log(JSON.stringify({ state, consoleErrors, pageErrors, problems }, null, 2));
if (problems.length) process.exit(1);
