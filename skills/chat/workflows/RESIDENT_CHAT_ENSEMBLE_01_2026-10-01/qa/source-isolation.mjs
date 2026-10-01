import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = process.env.KFB_BROWSER_BASE || 'http://127.0.0.1:4173';
const HOST = '/tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/KFB_Resident_Atlas_S15.html';
const OUT = process.env.KFB_BROWSER_OUT ||
  fileURLToPath(new URL('../evidence/source-isolation/', import.meta.url));
const SOURCE_PATH = fileURLToPath(new URL('../SOURCE.json', import.meta.url));
const source = JSON.parse(await fs.readFile(SOURCE_PATH, 'utf8'));

await fs.mkdir(OUT, { recursive: true });

const report = {
  schema: 'kfb.resident-chat-ensemble-source-isolation/0.1',
  sourceHost: source.atlas.host,
  cast: source.atlas.cast,
  residents: [],
  result: 'PENDING',
};

const browser = await chromium.launch({
  headless: false,
  args: [
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
    '--no-sandbox',
  ],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

function essentialUrl(url) {
  // Resident Atlas promo/reference GIFs are optional review aids, not actor/set/rig truth.
  // The transported session cut intentionally omits >2 MB ref/atlas GIFs while retaining
  // the exact actor/prop source recipes. Do not turn those known reference-only 404s into
  // a source-isolation blocker.
  if (/\/ref\/atlas\/[^/?#]+\.gif(?:[?#]|$)/i.test(url)) return false;
  return (
    url.startsWith(BASE) ||
    /raw\.githubusercontent\.com|unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/i.test(url)
  );
}

try {
  for (const expected of source.residents) {
    const page = await context.newPage();
    const item = {
      residentId: expected.residentId,
      expected,
      pageErrors: [],
      consoleErrors: [],
      httpErrors: [],
      requestFailures: [],
    };
    report.residents.push(item);

    page.on('pageerror', (error) => {
      item.pageErrors.push(String(error?.message || error));
    });
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (/^Failed to load resource:/i.test(text)) return; // response listener owns URL/status
      if (/favicon/i.test(text)) return;
      item.consoleErrors.push(text);
    });
    page.on('response', (response) => {
      if (response.status() < 400) return;
      const url = response.url();
      if (/\/favicon(?:\.ico)?(?:\?|$)/i.test(url)) return;
      if (!essentialUrl(url)) return;
      item.httpErrors.push({ url, status: response.status() });
    });
    page.on('requestfailed', (request) => {
      const url = request.url();
      if (!essentialUrl(url)) return;
      item.requestFailures.push({
        url,
        errorText: request.failure()?.errorText || 'request failed',
      });
    });

    const hostUrl = BASE + HOST + '#' + encodeURIComponent(expected.residentId);
    item.url = hostUrl;
    await page.goto(hostUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 });

    await page.waitForFunction((residentId) => {
      const A = window.__atlas;
      const c = A && A.cur && A.cur();
      return !!(A && c && c.recipe && c.recipe.residentId === residentId && window.__S12?.root);
    }, expected.residentId, { timeout: 240_000 });

    await page.waitForTimeout(1000);

    const proof = await page.evaluate((residentId) => {
      const A = window.__atlas;
      const c = A.cur();
      const V = A.V;
      const root = window.__S12.root;
      const visibleVignettes = V.scene.children
        .filter((x) => x.visible && /^vignette:/.test(x.name || ''))
        .map((x) => x.name);
      const actor = c.nodes.get(c.recipe.actor.id);
      const sourcePaths = [
        c.recipe.actor.a,
        ...(c.recipe.habitat || []).map((x) => x.a),
        ...(c.recipe.signatureProps || []).map((x) => x.a),
      ].filter(Boolean);

      return {
        selected: document.querySelector('#who')?.value || null,
        residentId: c.recipe.residentId,
        displayName: c.recipe.name,
        rootName: root?.name || null,
        rootVisible: !!root?.visible,
        visibleVignettes,
        nodeCount: c.nodes.size,
        nodeIds: [...c.nodes.keys()],
        actorId: c.recipe.actor.id,
        actorPresent: !!actor,
        actorVisible: !!actor?.visible,
        rigFamily: c.recipe.actor.rigFamily,
        pose: String(c.recipe.actor.pose),
        sourcePaths,
        rName: document.querySelector('#rName')?.textContent?.trim() || '',
        countText: document.querySelector('#cnt')?.textContent?.trim() || '',
        qaClass: document.querySelector('#qa')?.className || '',
        qaText: document.querySelector('#qa')?.textContent?.trim() || '',
        hud: document.querySelector('#hud')?.textContent?.trim() || '',
        canvas: {
          clientWidth: V.renderer.domElement.clientWidth,
          clientHeight: V.renderer.domElement.clientHeight,
          width: V.renderer.domElement.width,
          height: V.renderer.domElement.height,
        },
        bodyText: document.body.innerText,
      };
    }, expected.residentId);

    item.proof = proof;

    assert.equal(proof.selected, expected.residentId, 'Atlas selector did not keep requested resident');
    assert.equal(proof.residentId, expected.residentId);
    assert.equal(proof.rootName, 'vignette:' + expected.residentId);
    assert.equal(proof.rootVisible, true);
    assert.deepEqual(
      proof.visibleVignettes,
      ['vignette:' + expected.residentId],
      'source isolation must contain exactly one visible Resident vignette'
    );
    assert.equal(proof.actorId, expected.actorId);
    assert.equal(proof.actorPresent, true);
    assert.equal(proof.actorVisible, true);
    assert.equal(proof.rigFamily, expected.rigFamily);
    assert.match(proof.pose, new RegExp(expected.pose.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&')));
    assert.ok(proof.nodeCount >= 1, 'Resident source vignette contains no nodes');
    assert.ok(proof.canvas.clientWidth >= 700 && proof.canvas.clientHeight >= 500, 'Atlas canvas too small');
    assert.doesNotMatch(proof.qaClass, /bad/i);
    assert.doesNotMatch(proof.bodyText, /STOP\s*·/i);

    for (const fragment of expected.expectedSourceFragments) {
      assert.ok(
        proof.sourcePaths.some((p) => String(p).includes(fragment)),
        `missing source fragment ${fragment} for ${expected.residentId}`
      );
    }

    assert.deepEqual(item.pageErrors, [], 'page errors');
    assert.deepEqual(item.consoleErrors, [], 'console errors');
    assert.deepEqual(item.httpErrors, [], 'essential HTTP errors');
    assert.deepEqual(item.requestFailures, [], 'essential request failures');

    const screenshot = path.join(OUT, 'source-' + expected.residentId + '.png');
    const stage = page.locator('#stage');
    if (await stage.count()) {
      await stage.screenshot({ path: screenshot });
    } else {
      await page.screenshot({ path: screenshot, fullPage: true });
    }
    item.screenshot = path.basename(screenshot);
    await page.close();
  }

  assert.equal(report.residents.length, 4);
  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.failure = String(error?.stack || error);
  throw error;
} finally {
  await fs.writeFile(
    path.join(OUT, 'source-isolation.json'),
    JSON.stringify(report, null, 2) + '\n',
    'utf8'
  );
  await browser.close();
}
