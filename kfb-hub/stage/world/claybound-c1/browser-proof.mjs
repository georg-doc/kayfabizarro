import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const base = (process.env.CLAYBOUND_C1_BASE_URL || 'http://127.0.0.1:4173/kfb-hub/stage/world/claybound-c1/').replace(/\/?$/, '/');
const out = process.env.CLAYBOUND_C1_PROOF_DIR || 'claybound-c1-proof';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
let count = 0;
function ok(name, condition, detail = '') {
  if (!condition) throw Error('FAIL ' + name + (detail ? ' · ' + detail : ''));
  console.log('ok ' + (++count) + ' - ' + name);
}
for (const spec of [{ name: 'desktop', width: 1280, height: 820 }, { name: 'narrow', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failed.push(r.url() + ' :: ' + r.failure()?.errorText));
  await page.goto(base + '?world=huerth&selftest=wi1', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__clayboundC1 && document.querySelector('#wiTest')?.textContent?.split('\n').filter(x => x.startsWith('PASS · ')).length >= 55, null, { timeout: 180000 });
  const original = await page.evaluate(() => ({
    report: window.__clayboundC1.report(),
    checks: document.querySelector('#wiTest').textContent.split('\n').filter(x => x.startsWith('PASS · ')).length,
    marker: document.body.dataset.kfbStage,
    overflow: document.documentElement.scrollWidth > innerWidth,
    buttons: ['c1Original', 'c1ClayBound'].every(id => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.width > 20 && r.left >= 0 && r.right <= innerWidth; })
  }));
  ok(spec.name + ' C1 marker', original.marker === 'CLAYBOUND-WORLD-C1');
  ok(spec.name + ' accepted Hürth 55/55', original.checks === 55);
  ok(spec.name + ' direct A/B controls visible', original.buttons);
  ok(spec.name + ' no horizontal overflow', !original.overflow);
  ok(spec.name + ' eligible visual wall mesh', original.report.eligibleBuildings > 0 && original.report.formVertices >= 40 && original.report.sampledMaxFormM >= .04, JSON.stringify(original.report));
  const origPng = await page.screenshot({ path: out + '/' + spec.name + '-original.png' });
  await page.click('#c1ClayBound');
  const clay = await page.evaluate(() => window.__clayboundC1.report());
  ok(spec.name + ' ClayBound mode', clay.mode === 'claybound');
  ok(spec.name + ' route/contact numerics unchanged', clay.collisionUnchanged);
  ok(spec.name + ' source geometry numerically unchanged', clay.geometryUnchanged);
  ok(spec.name + ' identical camera', clay.cameraUnchanged);
  const clayPng = await page.screenshot({ path: out + '/' + spec.name + '-claybound.png' });
  ok(spec.name + ' visible A/B pixels differ', crypto.createHash('sha256').update(origPng).digest('hex') !== crypto.createHash('sha256').update(clayPng).digest('hex'));
  await page.waitForTimeout(1200);
  const idle = await page.evaluate(() => window.__clayboundC1.report());
  ok(spec.name + ' no idle geometry drift', idle.geometryUnchanged && idle.collisionUnchanged);
  const walk = await page.evaluate(() => { window.__wb2d.play.drive({ iy: 1 }, .8); return window.__clayboundC1.report(); });
  ok(spec.name + ' no walk form swimming', walk.geometryUnchanged && walk.collisionUnchanged);
  await page.click('#c1Original');
  const back = await page.evaluate(() => window.__clayboundC1.report());
  ok(spec.name + ' reversible to Original', back.mode === 'original' && back.geometryUnchanged && back.collisionUnchanged);
  ok(spec.name + ' no page/console errors', errors.length === 0, errors.join(' | '));
  ok(spec.name + ' no failed source requests', failed.length === 0, failed.slice(0, 5).join(' | '));
  await page.close();
}
await browser.close();
console.log('CLAYBOUND C1 BROWSER PASS ' + count + '/' + count);
