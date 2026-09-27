import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = process.cwd();
const TARGET = 'https://kayfabizarro.pages.dev/asset-librarian/';
const RENDER_URL = 'https://kayfabizarro.pages.dev/tools/asset_registry/librarian/render.js';
const EXPECTED_SOURCE = process.env.EXPECTED_SOURCE_COMMIT || '';
const OUT = path.join(ROOT, 'artifacts', 'asset-librarian-public-domain-r3-live');
const CASES = [
  {
    query: 'Bathing suit',
    path: 'media/public_domain/met/bathing-suit-1890-95.jpg',
    provider: 'met',
    sourceId: '86434',
    sha: '8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c',
  },
  {
    query: 'Great Wave',
    path: 'media/public_domain/aic/great-wave-hokusai-1830-33.jpg',
    provider: 'aic',
    sourceId: '24645',
    sha: 'e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56',
  },
  {
    query: 'Silent film',
    path: 'media/public_domain/commons/silent-film.svg',
    provider: 'commons',
    sourceId: 'File:Silent film.svg',
    sha: 'e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7',
  },
  {
    query: 'The General',
    path: 'media/public_domain/ia/the-general-1926-item-tile.jpg',
    provider: 'ia',
    sourceId: 'TheGeneral1926',
    sha: 'bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19',
  },
];

const assert = (value, message) => { if (!value) throw new Error(message); };

function browserExe() {
  return execFileSync(
    'bash',
    ['-lc', 'command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],
    { encoding: 'utf8' },
  ).trim();
}

async function poll(fn, label, timeoutMs = 120000, delayMs = 400) {
  const end = Date.now() + timeoutMs;
  let last;
  while (Date.now() < end) {
    try {
      last = await fn();
      if (last) return last;
    } catch (error) {
      last = error.message;
    }
    await sleep(delayMs);
  }
  throw new Error(`Timeout waiting for ${label}: ${JSON.stringify(last)}`);
}

async function waitForCloudflareRevision() {
  const started = Date.now();
  return poll(async () => {
    const url = `${RENDER_URL}?pd_r3=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store', redirect: 'follow' });
    if (!response.ok) return { ok: false, status: response.status };
    const text = await response.text();
    const ready = text.includes('rights provenance') &&
      text.includes('external source ID') &&
      text.includes('rights evidence sidecar');
    if (!ready) return false;
    return {
      ok: true,
      status: response.status,
      finalUrl: response.url,
      elapsedMs: Date.now() - started,
      markerCount: ['rights provenance','external source ID','rights evidence sidecar'].filter(x => text.includes(x)).length,
    };
  }, 'Cloudflare render.js revision', 900000, 10000);
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.consoleErrors = [];
    this.exceptions = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.id) {
        const pending = this.pending.get(msg.id);
        if (!pending) return;
        this.pending.delete(msg.id);
        msg.error ? pending.reject(new Error(msg.error.message)) : pending.resolve(msg.result || {});
        return;
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        this.consoleErrors.push(msg.params.args?.map(a => a.value ?? a.description ?? '').join(' ') || 'console.error');
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        this.exceptions.push(msg.params?.exceptionDetails?.text || 'Runtime exception');
      }
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'evaluation failed');
    return result.result?.value;
  }
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out opening CDP websocket')), 15000);
    ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP websocket error')); }, { once: true });
  });
  return new CDP(ws);
}

async function screenshot(cdp, name) {
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const file = path.join(OUT, `${name}.png`);
  writeFileSync(file, Buffer.from(shot.data, 'base64'));
  return file;
}

async function searchAndOpen(cdp, item, index) {
  await cdp.eval(`(() => {
    const search = document.getElementById('searchInput');
    const kind = document.getElementById('kindFilter');
    const pack = document.getElementById('packFilter');
    const collection = document.getElementById('collectionFilter');
    if (!search || !kind || !pack || !collection) throw new Error('required filters missing');
    search.value = ${JSON.stringify(item.query)};
    kind.value = 'image-2d';
    pack.value = '';
    collection.value = '';
    for (const input of document.querySelectorAll('#typeFilterOptions input,#formatFilterOptions input')) input.checked = false;
    return window.KFBAssetLibrarianV17.runSearch();
  })()`);

  await poll(
    () => cdp.eval(`[...document.querySelectorAll('#resultList .result-card')].some(c => c.dataset.assetId === ${JSON.stringify(item.path)})`),
    `public search result ${item.query}`,
    90000,
  );

  const exactCount = await cdp.eval(
    `[...document.querySelectorAll('#resultList .result-card')].filter(c => c.dataset.assetId === ${JSON.stringify(item.path)}).length`,
  );
  assert(exactCount === 1, `${item.path}: expected one exact public result, got ${exactCount}`);

  await cdp.eval(`(() => {
    const card = [...document.querySelectorAll('#resultList .result-card')].find(c => c.dataset.assetId === ${JSON.stringify(item.path)});
    card.querySelector('.result-open').click();
    return true;
  })()`);

  await poll(
    () => cdp.eval(`document.getElementById('detailPath')?.textContent === ${JSON.stringify(item.path)}`),
    `public detail ${item.path}`,
    90000,
  );

  await poll(
    () => cdp.eval(`document.getElementById('previewStatus')?.textContent === 'Loaded' && document.getElementById('imagePreviewImg')?.naturalWidth > 0`),
    `public image preview ${item.path}`,
    90000,
  );

  const provenance = await cdp.eval(`document.getElementById('provenanceFacts')?.innerText || ''`);
  for (const expected of ['explicit-sidecar', item.provider, item.sourceId, item.sha, '.license.json']) {
    assert(String(provenance).includes(expected), `${item.path}: public provenance missing ${expected}: ${provenance}`);
  }

  const imageMeta = await cdp.eval(`document.getElementById('imageMeta')?.textContent || ''`);
  const shot = await screenshot(cdp, `${String(index + 1).padStart(2, '0')}-${item.provider}`);
  return { query: item.query, path: item.path, imageMeta, provenance, screenshot: shot };
}

async function run() {
  mkdirSync(OUT, { recursive: true });
  assert(/^[0-9a-f]{40}$/.test(EXPECTED_SOURCE), `EXPECTED_SOURCE_COMMIT invalid: ${EXPECTED_SOURCE}`);

  const cloudflareRevision = await waitForCloudflareRevision();
  const exe = browserExe();
  assert(exe, 'No Chrome/Chromium found');

  const port = 9235;
  const profile = `/tmp/kfb-pd-r3-live-${process.pid}`;
  const browser = spawn(exe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
    '--ignore-certificate-errors',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--window-size=1500,1100',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let stderr = '';
  browser.stderr.on('data', chunk => { stderr += chunk.toString(); });
  const result = {
    schema: 'kfb.asset-librarian-public-domain-r3-live.v1',
    target: TARGET,
    expectedRegistrySourceCommit: EXPECTED_SOURCE,
    cloudflareRevision,
    cases: [],
    result: 'FAIL',
  };

  try {
    const version = await poll(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/version`);
        return response.ok ? await response.json() : false;
      } catch {
        return false;
      }
    }, 'Chrome debugging endpoint', 90000);

    const targetResponse = await fetch(
      `http://127.0.0.1:${port}/json/new?${encodeURIComponent(TARGET)}`,
      { method: 'PUT' },
    );
    assert(targetResponse.ok, `Could not create CDP target: ${targetResponse.status}`);
    const target = await targetResponse.json();
    const cdp = await connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

    await poll(
      () => cdp.eval(`window.KFBAssetLibrarianV17?.version === '1.7' && document.getElementById('registryStatus')?.textContent === 'Registry ready'`),
      'public Librarian ready',
      180000,
    );

    const route = await cdp.eval(`({href:location.href,host:location.host,path:location.pathname})`);
    assert(route.host === 'kayfabizarro.pages.dev', `wrong public host: ${JSON.stringify(route)}`);

    const state = await cdp.eval(`window.KFBAssetLibrarianV17.getState()`);
    assert(state.registryMode === 'live', `public Librarian not in Live mode: ${JSON.stringify(state)}`);
    assert(state.sourceCommit === EXPECTED_SOURCE, `Live Registry source mismatch: ${state.sourceCommit} != ${EXPECTED_SOURCE}`);

    const sourceLabel = await cdp.eval(`document.getElementById('sourceCommit')?.textContent || ''`);
    assert(String(sourceLabel).includes(EXPECTED_SOURCE), `visible source label missing expected commit: ${sourceLabel}`);
    assert(String(sourceLabel).toUpperCase().includes('LIVE'), `visible source label is not LIVE: ${sourceLabel}`);

    for (let i = 0; i < CASES.length; i += 1) {
      result.cases.push(await searchAndOpen(cdp, CASES[i], i));
    }

    assert(cdp.consoleErrors.length === 0, `console errors: ${cdp.consoleErrors.join(' | ')}`);
    assert(cdp.exceptions.length === 0, `runtime exceptions: ${cdp.exceptions.join(' | ')}`);

    result.browser = version.Browser;
    result.finalRoute = route;
    result.registryState = state;
    result.visibleSourceLabel = sourceLabel;
    result.consoleErrors = cdp.consoleErrors;
    result.runtimeExceptions = cdp.exceptions;
    result.result = 'PASS';

    writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    cdp.ws.close();
  } catch (error) {
    result.failure = String(error.stack || error);
    result.browserStderr = stderr.slice(-12000);
    writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(result, null, 2) + '\n');
    writeFileSync(path.join(OUT, 'failure.txt'), `${error.stack || error}\n\n${stderr}`);
    throw error;
  } finally {
    browser.kill('SIGTERM');
  }
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
