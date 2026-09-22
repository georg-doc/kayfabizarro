import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const STAGE_DIR = path.resolve('kfb-hub/stage/toolbox/card-zone-lab-v2-source');
const SOURCE_DIR = path.resolve('tools/KFB-ToolBox/_inbox/KFB Card Zone Lab v2/card-zone-lab-v2-full_2026-09-22');
const BASE_URL = process.env.KFB_CARD_ZONE_BASE_URL || 'http://127.0.0.1:4173/kfb-hub/stage/toolbox/card-zone-lab-v2-source/';
const PROOF_DIR = path.resolve(process.env.KFB_CARD_ZONE_PROOF_DIR || 'card-zone-lab-v2-source-proof');
const EXPECTED_SHA256 = 'a619d3a867064ec033a149f400da708b57e8e05d24e44b709d18dd8c7a62284b';
const EXPECTED_MARKER = 'KFB_CARD_ZONE_LAB_V2_SOURCE_2026_09_22';

const report = {
  schema: 'kfb.card-zone-source-proof/1',
  baseUrl: BASE_URL,
  checks: [],
  browserErrors: [],
  allowedDonorMessages: [],
  observedFailedRequests: [],
};

function check(name, pass, detail = null) {
  const item = { name, pass: Boolean(pass), detail };
  report.checks.push(item);
  if (!item.pass) process.exitCode = 1;
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function walk(root) {
  const out = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else out.push(path.relative(root, full).split(path.sep).join('/'));
    }
  };
  visit(root);
  return out.sort();
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch (error) {
    const explicit = process.env.KFB_PLAYWRIGHT_MODULE;
    if (!explicit) throw error;
    return await import(explicit.startsWith('file:') ? explicit : pathToFileURL(explicit).href);
  }
}

fs.mkdirSync(PROOF_DIR, { recursive: true });

const sourceEntry = path.join(SOURCE_DIR, 'KFB Card Zone Lab v2.dc.html');
const stageEntry = path.join(STAGE_DIR, 'index.html');
const stageNamedEntry = path.join(STAGE_DIR, 'KFB Card Zone Lab v2.dc.html');
const sourceFiles = walk(SOURCE_DIR);
const copiedFiles = walk(STAGE_DIR).filter((name) => !['index.html', 'SOURCE.json', 'proof.mjs'].includes(name));

check('source export contains 26 files', sourceFiles.length === 26, sourceFiles.length);
check('Stage source-tree roster is unchanged', JSON.stringify(copiedFiles) === JSON.stringify(sourceFiles), { sourceFiles: sourceFiles.length, copiedFiles: copiedFiles.length });
check('Stage index is byte-identical to 2026-09-22 source', sha256(stageEntry) === EXPECTED_SHA256, sha256(stageEntry));
check('Named Stage app is byte-identical to source', sha256(stageNamedEntry) === EXPECTED_SHA256, sha256(stageNamedEntry));
check('Inbox source still matches pinned SHA-256', sha256(sourceEntry) === EXPECTED_SHA256, sha256(sourceEntry));

const mismatches = sourceFiles.filter((name) => sha256(path.join(SOURCE_DIR, name)) !== sha256(path.join(STAGE_DIR, name)));
check('All 26 copied source files are byte-identical', mismatches.length === 0, mismatches);

const sourceText = fs.readFileSync(stageEntry, 'utf8');
check('Donor loads original DudV texture', sourceText.includes("KFB/waterdudv.jpg"), null);
check('Donor loads original water map', sourceText.includes("KFB/water.jpg"), null);
check('Donor keeps constructive foam-off constant', sourceText.includes("'  float u = 0.5;'"), null);
check('Donor has no invented uFoam control', !sourceText.includes('uFoam'), null);
check('Donor includes CardStack + reveal methods', sourceText.includes('buildStack()') && sourceText.includes('prepReveal(rec)') && sourceText.includes('tickReveal(dt)'), null);
check('Donor includes projector beam methods', sourceText.includes('buildProjection()') && sourceText.includes('updateProjection()'), null);
check('Donor includes Card Cube canvas-face source', sourceText.includes('faceTexture(kind, card)') && sourceText.includes('buildCardCube()') && sourceText.includes("document.createElement('canvas')"), null);

const { chromium } = await loadPlaywright();
const launch = { headless: true };
if (process.env.KFB_CHROME_EXECUTABLE) launch.executablePath = process.env.KFB_CHROME_EXECUTABLE;
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

page.on('pageerror', (error) => report.browserErrors.push(`pageerror: ${String(error)}`));
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  const sourceUrl = message.location().url || '';
  if (text === 'SCRIPT failed to load' || (text.includes('Failed to load resource') && sourceUrl.endsWith('/favicon.ico'))) report.allowedDonorMessages.push(`${text} · ${sourceUrl}`);
  else report.browserErrors.push(`console: ${text}`);
});
page.on('requestfailed', (request) => report.observedFailedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));

try {
  const markerResponse = await page.request.get(new URL('SOURCE.json', BASE_URL).href);
  const marker = markerResponse.ok() ? await markerResponse.json() : null;
  check('SOURCE marker HTTP 200', markerResponse.ok(), markerResponse.status());
  check('SOURCE marker exact', marker?.marker === EXPECTED_MARKER, marker?.marker || null);
  check('SOURCE marker pins donor blob', marker?.source?.gitBlob === 'e7bb09e49b2a885eb076e8c43c0ff561a9cebb72', marker?.source?.gitBlob || null);

  const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  check('Stage route HTTP 200', Boolean(response?.ok()), response?.status() || null);
  await page.waitForFunction(() => {
    const app = window.__CZLAB;
    return Boolean(app?.r && app?.fluid && app?.card && app?.stack && app?.holo && app?.cube && app?.cubeFaces?.length === 6);
  }, {}, { timeout: 180000 });
  await page.waitForFunction(() => {
    const app = window.__CZLAB;
    return Boolean(app?.fluidU?.uDudv?.value && app?.fluidU?.uMap?.value && app?.fluidU?.uHasMap?.value === 1);
  }, {}, { timeout: 120000 });

  const runtime = await page.evaluate(() => {
    const app = window.__CZLAB;
    return {
      renderer: Boolean(app.r?.isWebGLRenderer),
      sceneChildren: app.scene?.children?.length || 0,
      fluidShader: Boolean(app.fluid?.material?.isShaderMaterial),
      fluidVertices: app.fluid?.geometry?.attributes?.position?.count || 0,
      dudvLoaded: Boolean(app.fluidU?.uDudv?.value),
      mapLoaded: Boolean(app.fluidU?.uMap?.value),
      hasMap: app.fluidU?.uHasMap?.value,
      fragment: app.fluid?.material?.fragmentShader || '',
      stackCount: app.stack?.count || 0,
      stackIsInstanced: Boolean(app.stack?.isInstancedMesh),
      reveal: app.rev,
      revealLabel: app.state?.reveal,
      card: Boolean(app.card && app.pivot),
      beam: Boolean(app.holo?.material?.isShaderMaterial),
      beamVisible: Boolean(app.holo?.visible),
      beamCorners: app.holoU?.uG?.value?.length || 0,
      cubeFaces: app.cubeFaces?.length || 0,
      canvasFaces: (app.cubeFaces || []).filter((face) => face.material?.map?.isCanvasTexture && face.material?.map?.image instanceof HTMLCanvasElement && face.material.map.image.width === 512 && face.material.map.image.height === 512).length,
      pool: app.pool?.length || 0,
    };
  });

  check('WebGL source object is running', runtime.renderer && runtime.sceneChildren > 0, runtime);
  check('Original fluid is a populated ShaderMaterial', runtime.fluidShader && runtime.fluidVertices > 0, { fluidShader: runtime.fluidShader, fluidVertices: runtime.fluidVertices });
  check('Original DudV + water map are loaded', runtime.dudvLoaded && runtime.mapLoaded && runtime.hasMap === 1, { dudvLoaded: runtime.dudvLoaded, mapLoaded: runtime.mapLoaded, hasMap: runtime.hasMap });
  check('Browser shader keeps foam constructively off', runtime.fragment.includes('float u = 0.5;') && runtime.fragment.includes('(1.0 - shore)') && !runtime.fragment.includes('uFoam'), null);
  check('Real CardStack is mounted closed', runtime.stackIsInstanced && runtime.stackCount > 0 && runtime.reveal === 0 && runtime.revealLabel === 'verdeckt', { stackCount: runtime.stackCount, reveal: runtime.reveal, revealLabel: runtime.revealLabel });
  check('Real card pool is active', runtime.card && runtime.pool > 0, { card: runtime.card, pool: runtime.pool });
  check('Projector beam source object is mounted', runtime.beam && runtime.beamVisible && runtime.beamCorners === 4, { beam: runtime.beam, beamVisible: runtime.beamVisible, beamCorners: runtime.beamCorners });
  check('Card Cube has six canvas-textured faces', runtime.cubeFaces === 6 && runtime.canvasFaces === 6, { cubeFaces: runtime.cubeFaces, canvasFaces: runtime.canvasFaces });

  await page.evaluate(() => {
    const app = window.__CZLAB;
    app.setState({ autoReveal: false });
    if (app.state.fluid !== 'wasser') app.set({ fluid: 'wasser' });
    app.poseCard(0);
    app.rev = 0;
    app.revDir = 0;
    app.setState({ reveal: 'verdeckt' });
  });
  await page.screenshot({ path: path.join(PROOF_DIR, 'desktop-water-stack-closed.png'), fullPage: true });

  const timeBefore = await page.evaluate(() => window.__CZLAB.fluidU.uTime.value);
  await page.waitForFunction((before) => window.__CZLAB?.fluidU?.uTime?.value > before, timeBefore, { timeout: 5000 });
  const timeAfter = await page.evaluate(() => window.__CZLAB.fluidU.uTime.value);
  check('DudV fluid time advances in browser', timeAfter > timeBefore, { before: timeBefore, after: timeAfter });

  await page.evaluate(() => { window.__CZLAB.revDir = 1; });
  await page.waitForFunction(() => window.__CZLAB?.rev === 1 && window.__CZLAB?.state?.reveal === 'offen', {}, { timeout: 10000 });
  const opened = await page.evaluate(() => {
    const app = window.__CZLAB;
    return {
      reveal: app.rev,
      label: app.state.reveal,
      cardScale: app.pivot?.scale?.x || 0,
      cardY: app.pivot?.position?.y || 0,
      stackTopVisible: Boolean(app.stackTop?.visible),
      cubeVisible: Boolean(app.cube?.visible),
      projectorVisible: Boolean(app.projector?.visible),
      beamVisible: Boolean(app.holo?.visible),
      beamGain: app.holoU?.uGain?.value || 0,
      beamPermutation: app.holoPerm || [],
    };
  });
  check('CardStack reveal reaches real open Sky Card', opened.reveal === 1 && opened.label === 'offen' && opened.cardScale > 0.95 && opened.stackTopVisible, opened);
  check('Sky Card beam is live with Card Cube after reveal', opened.cubeVisible && opened.beamVisible && opened.beamGain > 0 && new Set(opened.beamPermutation).size === 4, opened);
  await page.screenshot({ path: path.join(PROOF_DIR, 'desktop-water-reveal-beam-cube.png'), fullPage: true });

  await page.evaluate(async () => {
    const app = window.__CZLAB;
    app.state.proj = 'offen';
    await app.loadProjector();
  });
  await page.waitForFunction(() => window.__CZLAB?.projector && !window.__CZLAB?.cube, {}, { timeout: 120000 });
  const projector = await page.evaluate(() => ({
    visible: window.__CZLAB.projector.visible,
    beamVisible: window.__CZLAB.holo.visible,
    beamGain: window.__CZLAB.holoU.uGain.value,
  }));
  check('Original physical projector + beam source is live', projector.visible && projector.beamVisible && projector.beamGain > 0, projector);
  await page.screenshot({ path: path.join(PROOF_DIR, 'desktop-sky-card-projector-beam.png'), fullPage: true });

  await page.evaluate(async () => {
    const app = window.__CZLAB;
    app.state.proj = 'cube';
    await app.loadProjector();
  });
  await page.waitForFunction(() => window.__CZLAB?.cube && window.__CZLAB?.cubeFaces?.length === 6, {}, { timeout: 120000 });

  await page.evaluate(() => window.__CZLAB.enterFocus(0));
  await page.waitForFunction(() => {
    const app = window.__CZLAB;
    const rect = app?.panelEl?.getBoundingClientRect();
    return app?.state?.focus === 0 && Number.parseFloat(app.panelEl.style.opacity || '0') > 0.9 && rect?.width > 200 && rect?.height > 200;
  }, {}, { timeout: 10000 });
  const focus = await page.evaluate(() => {
    const app = window.__CZLAB;
    const rect = app.panelEl.getBoundingClientRect();
    return { opacity: Number.parseFloat(app.panelEl.style.opacity), width: rect.width, height: rect.height, left: rect.left, top: rect.top };
  });
  check('Card Cube HTML face focus opens from source object', focus.opacity > 0.9 && focus.width > 200 && focus.height > 200, focus);
  await page.screenshot({ path: path.join(PROOF_DIR, 'desktop-card-cube-html-face.png'), fullPage: true });
  await page.evaluate(() => window.__CZLAB.exitFocus());

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  const mobile = await page.evaluate(() => ({ canvasWidth: window.__CZLAB?.canvas?.clientWidth || 0, canvasHeight: window.__CZLAB?.canvas?.clientHeight || 0, reveal: window.__CZLAB?.state?.reveal }));
  check('Mobile viewport keeps the live source canvas', mobile.canvasWidth > 0 && mobile.canvasHeight > 0 && mobile.reveal === 'offen', mobile);
  await page.screenshot({ path: path.join(PROOF_DIR, 'mobile-water-reveal-beam-cube.png'), fullPage: true });
} catch (error) {
  report.browserErrors.push(String(error?.stack || error));
  process.exitCode = 1;
} finally {
  check('No unexpected page/console errors', report.browserErrors.length === 0, report.browserErrors);
  fs.writeFileSync(path.join(PROOF_DIR, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
  const passed = report.checks.filter((item) => item.pass).length;
  console.log(`${passed}/${report.checks.length} PASS`);
  if (process.exitCode) console.error(JSON.stringify(report, null, 2));
}
