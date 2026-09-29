import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const ROUTE = 'https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-arch-01/';
const MARKER = ROUTE + 'SOURCE.json';
const HUB = 'https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/';
const OUT = 'playcanvas-arch-01-public-evidence';
await fs.mkdir(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let marker = null;
let markerText = '';
let lastStatus = 0;
for (let i = 0; i < 90; i++) {
  try {
    const r = await fetch(MARKER, { cache: 'no-store' });
    lastStatus = r.status;
    markerText = await r.text();
    if (r.ok) {
      const parsed = JSON.parse(markerText);
      if (parsed?.status === 'REAL_BROWSER_BASELINE_CANDIDATE' &&
          parsed?.frozenImplementationHead === 'a072514f111ebf6068606fbf06a017f33f617102') {
        marker = parsed;
        break;
      }
    }
  } catch {}
  await sleep(2000);
}
if (!marker) throw new Error(`public marker not current: HTTP ${lastStatus} body=${markerText.slice(0,240)}`);

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

await page.goto(ROUTE, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForFunction(() => document.documentElement.dataset.pcArchReady === '1', null, { timeout: 90000 });
const source = await page.evaluate(() => ({
  title: document.title,
  ready: window.__PC_ARCH_BENCH__?.ready,
  engineVersion: window.__PC_ARCH_BENCH__?.engineVersion,
  modeText: document.querySelector('#status')?.textContent,
  controls: {
    entities: Boolean(document.querySelector('[data-mode="entities"]')),
    instanced: Boolean(document.querySelector('[data-mode="instanced"]')),
    count2000: Boolean(document.querySelector('[data-count="2000"]'))
  }
}));
if (!source.ready || source.engineVersion !== '2.22.4') throw new Error('public bench boot/source mismatch '+JSON.stringify(source));
if (!source.controls.entities || !source.controls.instanced || !source.controls.count2000) throw new Error('public controls missing '+JSON.stringify(source.controls));
if (pageErrors.length || consoleErrors.length) throw new Error('public runtime errors '+JSON.stringify({pageErrors,consoleErrors}));

await page.screenshot({ path: `${OUT}/desktop.png`, fullPage: true });

const hubText = await (await fetch(HUB, { cache: 'no-store' })).text();
if (!hubText.includes("id:'playcanvas-arch-01'") || !hubText.includes("url:'/kfb-hub/stage/playcanvas-arch-01/'")) {
  throw new Error('Hub card not current');
}

const report = {
  schema:'kfb.playcanvas-arch-01.public-proof/1',
  route:ROUTE,
  marker,
  source,
  pageErrors,
  consoleErrors,
  hubCard:true,
  result:'PASS'
};
await fs.writeFile(`${OUT}/public.json`, JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
