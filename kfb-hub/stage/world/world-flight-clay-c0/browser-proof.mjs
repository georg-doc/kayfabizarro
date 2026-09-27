import fs from 'node:fs';
import crypto from 'node:crypto';

const { chromium } = await import(process.env.KFB_PLAYWRIGHT_PATH || 'playwright');

const base = (process.env.WORLD_FLIGHT_CLAY_C0_BASE_URL || 'http://127.0.0.1:4175/kfb-hub/stage/world/world-flight-clay-c0/').replace(/\/?$/, '/');
const out = process.env.WORLD_FLIGHT_CLAY_C0_PROOF_DIR || 'world-flight-clay-c0-proof';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.KFB_BROWSER_EXECUTABLE || undefined });
let count = 0;
function ok(name, condition, detail = '') {
  if (!condition) throw Error('FAIL ' + name + (detail ? ' · ' + detail : ''));
  console.log('ok ' + (++count) + ' - ' + name);
}

for (const spec of [{ name: 'desktop', width: 1280, height: 820 }, { name: 'narrow', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
  const errors = [], failed = [], httpErrors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failed.push(r.url() + ' :: ' + r.failure()?.errorText));
  page.on('response', r => { if (r.status() >= 400) httpErrors.push(r.status() + ' ' + r.url()); });
  await page.goto(base + '?world=huerth', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => document.body.dataset.c0Ready === 'true', null, { timeout: 120000 });
  await page.waitForTimeout(1200);

  const initial = await page.evaluate(() => ({
    marker: document.body.dataset.kfbStage,
    ready: document.body.dataset.c0Ready,
    mobility: document.body.dataset.c0Mobility,
    look: document.body.dataset.c0Look,
    report: window.__worldFlightClayC0.report(),
    overflow: document.documentElement.scrollWidth > innerWidth,
    controls: [...document.querySelectorAll('#c0-bar button')].every(button => { const r = button.getBoundingClientRect(); return r.width > 20 && r.left >= 0 && r.right <= innerWidth; })
  }));
  ok(spec.name + ' C0 marker', initial.marker === 'WORLD-FLIGHT-CLAY-C0');
  ok(spec.name + ' World runtime ready', initial.ready === 'true' && initial.report.clay.world === 'huerth');
  ok(spec.name + ' ST01 recipe mounted', initial.report.track.sourceRevision === '2026-09-19.st01.1' && initial.report.track.samples === 181);
  ok(spec.name + ' track has entry/exit and width range', initial.report.track.connectors.length === 2 && initial.report.track.widthM[0] === 10.8 && initial.report.track.widthM[1] === 21.6);
  ok(spec.name + ' starts in walk/original', initial.mobility === 'walk' && initial.look === 'original');
  ok(spec.name + ' compact controls visible', initial.controls);
  ok(spec.name + ' no horizontal overflow', !initial.overflow);
  const originalPng = await page.screenshot({ path: out + '/' + spec.name + '-walk-original.png' });

  await page.click('#c0-flight');
  await page.waitForFunction(() => document.body.dataset.c0Mobility === 'flight');
  const beforeY = await page.evaluate(() => window.__worldFlightClayC0.flight.report().position[1]);
  await page.keyboard.down('Space');
  await page.waitForTimeout(450);
  await page.keyboard.up('Space');
  const afterFlight = await page.evaluate(() => window.__worldFlightClayC0.report());
  ok(spec.name + ' same-world flight enabled', afterFlight.mobility.mode === 'flight' && afterFlight.mobility.sameWorld);
  ok(spec.name + ' flight ascends', afterFlight.mobility.position[1] > beforeY + .5, `${beforeY} -> ${afterFlight.mobility.position[1]}`);

  await page.click('#c0-clay');
  await page.waitForFunction(() => document.body.dataset.c0Look === 'clay');
  const clayReport = await page.evaluate(() => window.__worldFlightClayC0.report());
  ok(spec.name + ' reversible Clay look enabled', clayReport.clay.mode === 'clay' && clayReport.clay.reversible);
  ok(spec.name + ' world collision owner unchanged', clayReport.clay.collisionOwner === 'World r2 unchanged');
  ok(spec.name + ' variable building heights measured', clayReport.clay.buildingHeightM[1] > clayReport.clay.buildingHeightM[0]);
  const clayPng = await page.screenshot({ path: out + '/' + spec.name + '-flight-clay.png' });
  ok(spec.name + ' Original/Clay pixels differ', crypto.createHash('sha256').update(originalPng).digest('hex') !== crypto.createHash('sha256').update(clayPng).digest('hex'));

  await page.click('#c0-info');
  ok(spec.name + ' inline documentation opens', await page.locator('#c0-help').isVisible());
  await page.click('#c0-walk');
  await page.click('#c0-original');
  const restored = await page.evaluate(() => window.__worldFlightClayC0.report());
  ok(spec.name + ' returns to walk/original', restored.mobility.mode === 'walk' && restored.clay.mode === 'original');
  ok(spec.name + ' no page/console errors', errors.length === 0, errors.join(' | '));
  ok(spec.name + ' no failed source requests', failed.length === 0, failed.slice(0, 5).join(' | '));
  ok(spec.name + ' no HTTP errors', httpErrors.length === 0, httpErrors.slice(0, 5).join(' | '));
  await page.close();
}
await browser.close();
console.log('WORLD FLIGHT CLAY C0 BROWSER PASS ' + count + '/' + count);
