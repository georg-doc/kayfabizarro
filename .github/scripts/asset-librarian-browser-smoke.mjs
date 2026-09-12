import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = process.cwd();
const BASE_URL = process.env.LIBRARIAN_URL || 'http://127.0.0.1:8765/tools/asset_registry/librarian/';
const ARTIFACT_DIR = path.join(ROOT, 'artifacts', 'asset-librarian-smoke');
const SOURCE_COMMIT = '11d7df978c63b9e375707bd8d9431b4c8358cda8';
const ASSETS = {
  embeddedRig: 'media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb',
  externalGltf: 'media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/lettuce.gltf',
  animated: 'media/3D_Assets/MonsterPack_Quaternius/Big/glTF/Alien.gltf',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findBrowser() {
  if (process.env.BROWSER_EXE) return process.env.BROWSER_EXE;
  const script = 'command -v google-chrome-stable || command -v google-chrome || command -v chromium || command -v chromium-browser || true';
  return execFileSync('bash', ['-lc', script], { encoding: 'utf8' }).trim();
}

async function waitHttp(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message || 'unknown error'}`);
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.consoleErrors = [];
    this.exceptions = [];
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result || {});
        return;
      }
      if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
        this.consoleErrors.push(message.params.args?.map((arg) => arg.value ?? arg.description ?? '').join(' ') || 'console.error');
      }
      if (message.method === 'Runtime.exceptionThrown') {
        this.exceptions.push(message.params?.exceptionDetails?.text || 'Runtime exception');
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const response = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.text || `Evaluation failed: ${expression.slice(0, 120)}`);
    }
    return response.result?.value;
  }
}

async function connectCDP(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out opening CDP websocket')), 10000);
    ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    ws.addEventListener('error', (event) => { clearTimeout(timer); reject(event.error || new Error('CDP websocket error')); }, { once: true });
  });
  return new CDP(ws);
}

async function waitForEval(cdp, expression, label, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    try {
      last = await cdp.evaluate(expression);
      if (last) return last;
    } catch (error) {
      last = error.message;
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${label}; last=${JSON.stringify(last)}`);
}

async function setFiltersAndSearch(cdp, { query = '', kind = 'model-3d', pack = '', format = '', dependency = '', rigged = '', animated = '', clip = '', joint = '' }) {
  const values = { searchInput: query, kindFilter: kind, packFilter: pack, formatFilter: format, dependencyFilter: dependency, rigFilter: rigged, animatedFilter: animated, clipFilter: clip, jointFilter: joint };
  await cdp.evaluate(`(() => {
    const values = ${JSON.stringify(values)};
    for (const [id, value] of Object.entries(values)) {
      const el = document.getElementById(id);
      if (!el) throw new Error('Missing control: ' + id);
      el.value = value;
    }
    document.getElementById('searchButton').click();
    return true;
  })()`);
  await waitForEval(cdp, `!document.body.classList.contains('loading')`, `search '${query}' completion`);
}

async function openAsset(cdp, assetPath) {
  const assetLiteral = JSON.stringify(assetPath);
  await waitForEval(cdp, `(() => [...document.querySelectorAll('.result-card')].some((card) => card.dataset.assetId === ${assetLiteral}))()`, `asset result ${assetPath}`);
  const clicked = await cdp.evaluate(`(() => {
    const target = [...document.querySelectorAll('.result-card')].find((card) => card.dataset.assetId === ${assetLiteral});
    if (!target) return false;
    target.querySelector('.result-open').click();
    return true;
  })()`);
  assert(clicked, `Could not click asset ${assetPath}`);
  await waitForEval(cdp, `document.getElementById('detailPath')?.textContent === ${assetLiteral}`, `detail ${assetPath}`);
  await waitForEval(cdp, `(() => {
    const text = document.getElementById('previewStatus')?.textContent || '';
    return text && text !== 'Idle' && text !== 'Loading…';
  })()`, `preview ${assetPath}`, 90000);
  const status = await cdp.evaluate(`document.getElementById('previewStatus').textContent`);
  assert(!String(status).startsWith('Preview failed:'), `${assetPath}: ${status}`);
  const raw = await cdp.evaluate(`document.getElementById('openRaw').href`);
  assert(raw.includes(`/georg-doc/kayfabizarro/${SOURCE_COMMIT}/`), `${assetPath}: pinned RAW does not use registry source commit: ${raw}`);
  return { status, raw };
}

async function probeCanvas(cdp) {
  const result = await cdp.evaluate(`new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const canvas = document.getElementById('previewCanvas');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      if (!canvas || !gl) return resolve({ ok: false, reason: 'no-webgl-context' });
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      const sw = Math.min(160, w);
      const sh = Math.min(160, h);
      const x = Math.max(0, Math.floor((w - sw) / 2));
      const y = Math.max(0, Math.floor((h - sh) / 2));
      const pixels = new Uint8Array(sw * sh * 4);
      gl.readPixels(x, y, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let nonTransparent = 0;
      let nonBlack = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 0) nonTransparent++;
        if (pixels[i] || pixels[i + 1] || pixels[i + 2]) nonBlack++;
      }
      resolve({
        ok: true,
        width: w,
        height: h,
        nonTransparent,
        nonBlack,
        renderer: String(gl.getParameter(gl.RENDERER) || ''),
        version: String(gl.getParameter(gl.VERSION) || ''),
        error: gl.getError(),
      });
    }));
  })`);
  assert(result?.ok, `WebGL probe failed: ${JSON.stringify(result)}`);
  assert(result.width > 0 && result.height > 0, `WebGL canvas has invalid size: ${JSON.stringify(result)}`);
  assert(result.error === 0, `WebGL error after readPixels: ${JSON.stringify(result)}`);
  assert(result.nonTransparent > 0 || result.nonBlack > 0, `Preview canvas appears empty: ${JSON.stringify(result)}`);
  return result;
}

async function screenshot(cdp, name) {
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  const file = path.join(ARTIFACT_DIR, `${name}.png`);
  writeFileSync(file, Buffer.from(result.data, 'base64'));
  return file;
}

async function run() {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const browserExe = findBrowser();
  assert(browserExe, 'No Chrome/Chromium executable found on runner');

  const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  const browser = spawn(browserExe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/kfb-librarian-chrome',
    '--window-size=1600,1200',
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let browserStderr = '';
  browser.stderr.on('data', (chunk) => { browserStderr += chunk.toString(); });

  try {
    await waitHttp(`${BASE_URL}index.html`);
    const version = await waitHttp('http://127.0.0.1:9222/json/version');
    const browserVersion = await version.json();
    const create = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' });
    assert(create.ok, `Could not create CDP target: ${create.status} ${create.statusText}`);
    const target = await create.json();
    const cdp = await connectCDP(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');

    await waitForEval(cdp, `document.getElementById('registryStatus')?.textContent === 'Registry ready'`, 'registry bootstrap', 60000);
    const metrics = await cdp.evaluate(`document.getElementById('metrics').innerText`);
    assert(String(metrics).includes('12,767') || String(metrics).includes('12.767'), `Registry metrics do not show 12,767 assets: ${metrics}`);

    await setFiltersAndSearch(cdp, { query: '4GTN', rigged: 'yes' });
    const embedded = await openAsset(cdp, ASSETS.embeddedRig);
    const embeddedCanvas = await probeCanvas(cdp);
    const embeddedRig = await cdp.evaluate(`document.getElementById('rigFacts').innerText`);
    assert(String(embeddedRig).includes('23'), `4GTN rig facts do not expose expected joint count: ${embeddedRig}`);
    await screenshot(cdp, '01-embedded-glb-4gtn');

    await setFiltersAndSearch(cdp, { query: 'lettuce', dependency: 'complete' });
    const external = await openAsset(cdp, ASSETS.externalGltf);
    const externalCanvas = await probeCanvas(cdp);
    const dependencies = await cdp.evaluate(`document.getElementById('dependencyFacts').innerText`);
    assert(String(dependencies).includes('lettuce.bin'), `Lettuce dependencies missing BIN: ${dependencies}`);
    assert(String(dependencies).includes('farmer_texture_A.png'), `Lettuce dependencies missing texture: ${dependencies}`);
    assert(!String(dependencies).includes('MISSING'), `Lettuce dependency display reports missing file: ${dependencies}`);
    await screenshot(cdp, '02-external-gltf-lettuce');

    await setFiltersAndSearch(cdp, { query: 'Alien', animated: 'yes' });
    const animated = await openAsset(cdp, ASSETS.animated);
    const animatedCanvas = await probeCanvas(cdp);
    assert(String(animated.status).includes('playing first'), `Animated preview is not playing a clip: ${animated.status}`);
    await cdp.evaluate(`document.getElementById('toggleSelection').click(); true`);
    await waitForEval(cdp, `document.getElementById('selectionCount').textContent === '1 selected'`, 'selection count');

    for (const consumer of ['combat-arena', 'frankenstein-studio', 'kfb-stunt-car-race', 'animation-lab']) {
      const value = await cdp.evaluate(`(() => {
        const select = document.getElementById('consumerSelect');
        select.value = ${JSON.stringify(consumer)};
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return { value: select.value, boundary: document.getElementById('consumerBoundary').innerText };
      })()`);
      assert(value.value === consumer, `Consumer profile unavailable: ${consumer}`);
      assert(String(value.boundary).trim().length > 10, `Consumer boundary missing for ${consumer}`);
    }
    const handoffEnabled = await cdp.evaluate(`!document.getElementById('copyHandoff').disabled && !document.getElementById('downloadHandoff').disabled`);
    assert(handoffEnabled, 'Handoff controls are not enabled for selected asset');
    await screenshot(cdp, '03-animated-alien-handoff');

    const result = {
      schema: 'kfb.asset-librarian-browser-smoke.v1',
      testedUrl: BASE_URL,
      browser: browserVersion.Browser,
      registrySourceCommit: SOURCE_COMMIT,
      assets: {
        embeddedRig: { path: ASSETS.embeddedRig, previewStatus: embedded.status, canvas: embeddedCanvas },
        externalGltf: { path: ASSETS.externalGltf, previewStatus: external.status, canvas: externalCanvas },
        animated: { path: ASSETS.animated, previewStatus: animated.status, canvas: animatedCanvas },
      },
      handoffProfilesChecked: ['combat-arena', 'frankenstein-studio', 'kfb-stunt-car-race', 'animation-lab'],
      consoleErrors: cdp.consoleErrors,
      runtimeExceptions: cdp.exceptions,
      result: 'PASS',
    };
    writeFileSync(path.join(ARTIFACT_DIR, 'result.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    assert(cdp.exceptions.length === 0, `Runtime exceptions seen: ${cdp.exceptions.join(' | ')}`);
    cdp.ws.close();
  } catch (error) {
    writeFileSync(path.join(ARTIFACT_DIR, 'failure.txt'), `${error.stack || error}\n\nBrowser stderr:\n${browserStderr}\n`);
    throw error;
  } finally {
    browser.kill('SIGTERM');
    server.kill('SIGTERM');
  }
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
