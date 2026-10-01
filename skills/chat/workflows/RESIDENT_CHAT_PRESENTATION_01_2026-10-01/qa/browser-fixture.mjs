import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = process.env.KFB_BROWSER_BASE || 'http://127.0.0.1:4173';
const HOST_PATH = '/tools/KFB-ToolBox/_inbox/KFB%20Resident%20Card%20Speculation%20Scene/npc-card-spec-01_2026-09-24/NPC%20Card%20Speculation%20Scene.dc.html';
const HOST_URL = BASE + HOST_PATH;
const OUT = process.env.KFB_BROWSER_OUT ||
  fileURLToPath(new URL('../evidence/browser/', import.meta.url));

await fs.mkdir(OUT, { recursive: true });

const report = {
  schema: 'kfb.resident-chat-presentation-browser-proof/0.1',
  url: HOST_URL,
  viewport: { width: 1280, height: 720 },
  semantic: null,
  owners: null,
  captures: [],
  errors: [],
  httpErrors: [],
  requestFailures: [],
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
  viewport: report.viewport,
  deviceScaleFactor: 1,
});

const page = await context.newPage();

page.on('pageerror', (error) => {
  report.errors.push({ type: 'pageerror', message: String(error && error.message || error) });
});

page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  // Chromium emits an opaque console line for any 4xx resource. The response
  // listener below owns URL/status validation; do not double-count that line.
  if (/^Failed to load resource:/i.test(text)) return;
  if (/favicon/i.test(text)) return;
  report.errors.push({ type: 'console', message: text });
});

page.on('response', (response) => {
  const status = response.status();
  if (status < 400) return;
  const url = response.url();
  if (/\/favicon(?:\.ico)?(?:\?|$)/i.test(url)) return;
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(url)) return;
  const essential =
    url.startsWith(BASE) ||
    /cdn\.jsdelivr\.net|raw\.githubusercontent\.com|cdnjs\.cloudflare\.com/i.test(url);
  if (!essential) return;
  report.httpErrors.push({ url, status });
});

page.on('requestfailed', (request) => {
  const url = request.url();
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(url)) return;
  const essential =
    url.startsWith(BASE) ||
    /cdn\.jsdelivr\.net|raw\.githubusercontent\.com|cdnjs\.cloudflare\.com/i.test(url);
  if (!essential) return;
  report.requestFailures.push({
    url,
    errorText: request.failure()?.errorText || 'request failed',
  });
});

function capturePath(name) {
  return path.join(OUT, name + '.png');
}

async function semanticAndOwnerProof() {
  const proof = await page.evaluate(() => {
    const x = window.NPCCardSpecScene;
    return {
      hidden: document.hidden,
      semantic: x.semanticReport(),
      owners: x.scene.report(),
      state: x.scene.state(),
      canvas: {
        width: x.renderer.domElement.width,
        height: x.renderer.domElement.height,
        clientWidth: x.renderer.domElement.clientWidth,
        clientHeight: x.renderer.domElement.clientHeight,
      },
    };
  });

  assert.equal(proof.hidden, false, 'browser document must remain visible');
  assert.match(proof.semantic.source, /RESIDENT-CHAT-POC-01 deterministic adapter/i);
  assert.equal(proof.semantic.poolEntries, 4, 'shared donor pool must contain four entries');
  assert.equal(proof.semantic.selected.A.length, 2, 'actor A must expose two deterministic variants');
  assert.equal(proof.semantic.selected.B.length, 2, 'actor B must expose two deterministic variants');
  assert.equal(proof.owners.owners.eyeRigs, 2);
  assert.equal(proof.owners.owners.mouths, 2);
  assert.equal(proof.owners.owners.mixers, 2);
  assert.equal(proof.owners.card.name, 'The Doomsday Clock');
  assert.equal(proof.owners.root.children.length, 3);
  assert.ok(proof.canvas.clientWidth >= 1000 && proof.canvas.clientHeight >= 600, 'render canvas too small');

  report.semantic = proof.semantic;
  report.owners = proof.owners;
  return proof;
}

async function captureSceneVariant(variant, at, name) {
  const state = await page.evaluate(({ variant, at }) => {
    const x = window.NPCCardSpecScene;
    x.scene.setReview('scene');
    return x.seek(at, variant);
  }, { variant, at });

  assert.equal(state.review, 'scene');
  assert.equal(state.variant, variant);

  const bubbleProof = await page.evaluate(() => {
    const canvases = [...document.querySelectorAll('canvas')];
    return {
      canvasCount: canvases.length,
      visibleOverlayCanvases: canvases.filter((cv) => {
        const s = getComputedStyle(cv);
        return s.position === 'absolute' && Number(s.opacity) > 0.05 && cv !== window.NPCCardSpecScene.renderer.domElement;
      }).length,
      aTalking: !!window.NPCCardSpecScene.scene.actors.A.mouth?.talking,
      bTalking: !!window.NPCCardSpecScene.scene.actors.B.mouth?.talking,
    };
  });

  assert.ok(bubbleProof.visibleOverlayCanvases >= 1, 'scene variant must show an existing donor bubble');

  const file = capturePath(name);
  await page.screenshot({ path: file, fullPage: true });
  report.captures.push({ name, kind: 'scene', variant, at, state, bubbleProof, file: path.basename(file) });
}

async function captureIsolation(mode, name) {
  const proof = await page.evaluate(({ mode }) => {
    const x = window.NPCCardSpecScene;
    const s = x.scene;
    const T = x.THREE;
    const cam = x.camera;
    const renderer = x.renderer;

    s.setReview(mode);
    const focus = s.focus(mode);
    if (!focus) throw new Error('missing focus for ' + mode);

    const dir = new T.Vector3(0, 0.07, 1)
      .applyAxisAngle(new T.Vector3(0, 1, 0), s.root.rotation.y);
    cam.position.copy(focus.target).addScaledVector(dir, focus.dist);
    cam.lookAt(focus.target);

    const vw = renderer.domElement.clientWidth || 1280;
    const vh = renderer.domElement.clientHeight || 720;
    for (let i = 0; i < 45; i++) s.update(1 / 30, cam, vw, vh);
    renderer.render(x.world, cam);

    return {
      state: s.state(),
      aVisible: s.actors.A.wrap.visible,
      bVisible: s.actors.B.wrap.visible,
      aTalking: !!s.actors.A.mouth?.talking,
      bTalking: !!s.actors.B.mouth?.talking,
      camera: cam.position.toArray().map((v) => +v.toFixed(3)),
    };
  }, { mode });

  assert.equal(proof.state.review, mode);

  if (mode === 'actor-a') {
    assert.equal(proof.aVisible, true);
    assert.equal(proof.bVisible, false);
    assert.equal(proof.aTalking, true);
  } else if (mode === 'actor-b') {
    assert.equal(proof.aVisible, false);
    assert.equal(proof.bVisible, true);
    assert.equal(proof.bTalking, true);
  } else if (mode === 'mouths') {
    assert.equal(proof.aVisible, true);
    assert.equal(proof.bVisible, true);
    assert.notEqual(proof.aTalking, proof.bTalking, 'mouth isolation alternates one active talker');
  }

  const file = capturePath(name);
  await page.screenshot({ path: file, fullPage: true });
  report.captures.push({ name, kind: 'isolation', mode, proof, file: path.basename(file) });
}

try {
  await page.goto(HOST_URL, { waitUntil: 'domcontentloaded', timeout: 120_000 });

  await page.waitForFunction(() => {
    return !!(
      window.NPCCardSpecScene &&
      window.NPCCardSpecScene.scene &&
      typeof window.NPCCardSpecScene.semanticReport === 'function'
    );
  }, { timeout: 180_000 });

  await page.waitForTimeout(1200);
  await semanticAndOwnerProof();

  // Existing donor timing: A interpretation bubble is alive around 7.2 s;
  // B interpretation bubble is alive around 14.2 s. Use 14.2 for both variants
  // so the screenshot proves the provider-selected B turn and Card composition.
  await captureSceneVariant(0, 14.2, 'scene-variant-0');
  await captureSceneVariant(1, 14.2, 'scene-variant-1');

  await captureIsolation('actor-a', 'isolation-actor-a');
  await captureIsolation('actor-b', 'isolation-actor-b');
  await captureIsolation('mouths', 'isolation-mouths');

  const stopText = await page.locator('body').innerText();
  assert.doesNotMatch(stopText, /STOP\s*·/i, 'host rendered STOP error panel');

  if (report.httpErrors.length) {
    throw new Error('essential HTTP errors: ' + JSON.stringify(report.httpErrors, null, 2));
  }
  if (report.requestFailures.length) {
    throw new Error('essential request failures: ' + JSON.stringify(report.requestFailures, null, 2));
  }
  if (report.errors.length) {
    throw new Error('page/runtime errors: ' + JSON.stringify(report.errors, null, 2));
  }

  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.failure = String(error && error.stack || error);
  throw error;
} finally {
  await fs.writeFile(
    path.join(OUT, 'browser-proof.json'),
    JSON.stringify(report, null, 2) + '\n',
    'utf8'
  );
  await browser.close();
}
