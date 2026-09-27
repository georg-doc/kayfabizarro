import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const STAGE_URL = process.env.TRAVEL_MODES_STAGE_URL || 'https://kayfabizarro.pages.dev/kfb-hub/stage/travel/travel-modes-01/';
const HUB_URL = 'https://kayfabizarro.pages.dev/kfb-hub/';
const EXPECTED_HEAD = 'f5ea32f817403cda0e30a426e70f37db8ce03d66';
const outDir = process.env.TRAVEL_MODES_PROOF_DIR || 'travel-modes-01-public-proof';
fs.mkdirSync(outDir, { recursive: true });

const checks = [];
function check(name, condition, detail = null) {
  checks.push({ name, pass: Boolean(condition), detail });
  if (!condition) throw new Error('FAIL: ' + name + (detail ? ' · ' + detail : ''));
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function deployedMarker() {
  let last = null;
  for (let attempt = 1; attempt <= 18; attempt++) {
    try {
      const response = await fetch(new URL('SOURCE.json', STAGE_URL), { cache: 'no-store' });
      const text = await response.text();
      let marker = null;
      try { marker = JSON.parse(text); } catch {}
      last = { attempt, status: response.status, marker };
      if (
        response.ok &&
        marker?.revision === 'TRAVEL-MODES-01' &&
        marker?.travel?.implementationHead === EXPECTED_HEAD
      ) return last;
    } catch (error) {
      last = { attempt, error: String(error) };
    }
    await sleep(10000);
  }
  throw new Error('Exact deployed SOURCE marker not visible: ' + JSON.stringify(last));
}

const markerProof = await deployedMarker();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(String(error)));

try {
  const response = await page.goto(STAGE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  check('stage HTTP 200', response?.status() === 200, String(response?.status()));
  await page.waitForFunction(() => Boolean(window.__travelModes01), null, { timeout: 30000 });

  check('exact Stage URL opened', page.url().startsWith(STAGE_URL), page.url());
  check('revision heading visible', (await page.locator('h1').textContent())?.includes('TRAVEL-MODES-01'));
  check('accepted 400 ms visible', (await page.locator('body').innerText()).includes('400 ms'));

  const initial = await page.evaluate(() => ({
    acceptedDoubleSpaceMs: window.__travelModes01.acceptedDoubleSpaceMs,
    unavailableAudit: window.__travelModes01.unavailableAudit,
    report: window.__travelModes01.report(),
  }));
  check('accepted 400 ms runtime evidence', initial.acceptedDoubleSpaceMs === 400);
  check('Ground initial movement owner', initial.report.activeMovementOwner === 'wb0-ground-controller', initial.report.activeMovementOwner);
  check('Ground initial camera owner', initial.report.activeCameraOwner === 'wb0-ground-controller', initial.report.activeCameraOwner);
  check('Drive unavailable before adapter', initial.unavailableAudit.find((x) => x.mode === 'DRIVE')?.pass === true);
  check('Water unavailable before adapter', initial.unavailableAudit.find((x) => x.mode === 'WATER')?.pass === true);
  check('Drive control disabled', await page.locator('[data-mode="DRIVE"]').isDisabled());
  check('Water control disabled', await page.locator('[data-mode="WATER"]').isDisabled());

  await page.locator('[data-mode="FLIGHT"]').click();
  const flight = await page.evaluate(() => window.__travelModes01.report());
  check('Flight selected atomically', flight.mode === 'FLIGHT', flight.mode);
  check('Flight movement owner carpet.js', flight.activeMovementOwner === 'carpet.js', flight.activeMovementOwner);
  check('Flight camera owner camera-rig.js', flight.activeCameraOwner === 'camera-rig.js', flight.activeCameraOwner);
  check('Flight transition committed', flight.lastTransition?.status === 'COMMITTED', flight.lastTransition?.status);
  await page.screenshot({ path: path.join(outDir, 'travel-modes-01-flight.png'), fullPage: true });

  await page.locator('[data-mode="GROUND"]').click();
  const ground = await page.evaluate(() => window.__travelModes01.report());
  check('Ground return selected atomically', ground.mode === 'GROUND', ground.mode);
  check('Ground return movement owner', ground.activeMovementOwner === 'wb0-ground-controller', ground.activeMovementOwner);
  check('no browser page errors', pageErrors.length === 0, pageErrors.join(' | '));

  const sourceResponse = await fetch(new URL('SOURCE.json', STAGE_URL), { cache: 'no-store' });
  const source = await sourceResponse.json();
  check('deployed marker pins tested Travel head', source.travel?.implementationHead === EXPECTED_HEAD, source.travel?.implementationHead);
  check('deployed marker keeps Drive source-required', source.modeStatus?.DRIVE === 'SOURCE_REQUIRED', source.modeStatus?.DRIVE);
  check('deployed marker keeps Water source-required', source.modeStatus?.WATER === 'SOURCE_REQUIRED', source.modeStatus?.WATER);

  const hub = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const hubResponse = await hub.goto(HUB_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  check('Hub HTTP 200', hubResponse?.status() === 200, String(hubResponse?.status()));
  const hubHtml = await hub.content();
  check('Hub carries Travel router title', hubHtml.includes('Travel · Movement Mode Router'));
  check('Hub carries direct Stage URL', hubHtml.includes(STAGE_URL));
  await hub.screenshot({ path: path.join(outDir, 'kfb-hub-travel-modes-01.png'), fullPage: true });
  await hub.close();

  const report = {
    schema: 'kfb.travel-modes-01-public-proof/1',
    stageUrl: STAGE_URL,
    hubUrl: HUB_URL,
    expectedTravelHead: EXPECTED_HEAD,
    markerAttempt: markerProof.attempt,
    checks: checks.length,
    passed: checks.filter((x) => x.pass).length,
    failed: checks.filter((x) => !x.pass).length,
    pageErrors,
    status: 'PASS',
  };
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const report = {
    schema: 'kfb.travel-modes-01-public-proof/1',
    stageUrl: STAGE_URL,
    hubUrl: HUB_URL,
    expectedTravelHead: EXPECTED_HEAD,
    markerAttempt: markerProof?.attempt ?? null,
    checks: checks.length,
    passed: checks.filter((x) => x.pass).length,
    failed: checks.filter((x) => !x.pass).length + 1,
    pageErrors,
    status: 'FAIL',
    error: String(error?.stack || error),
  };
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  try { await page.screenshot({ path: path.join(outDir, 'failure.png'), fullPage: true }); } catch {}
  console.error(JSON.stringify(report, null, 2));
  throw error;
} finally {
  await browser.close();
}
