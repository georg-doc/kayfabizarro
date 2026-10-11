// Phase C · C1a · offline mirror for the vendored J17 page (public/vendor/joyride-j17/, donors unchanged).
// Loads the J17 DC page from the Lab's Vite, maps unpkg three@0.160.0 → the Lab's three r186 (public/vendor/three@0.186.1/), and
// records every OTHER external request it makes (boot, drive at several s, tunnel, world presets) into
// public/vendor/joyride-j17/_remote/<sha1>.<ext> + _remote/manifest.json {url → file, type, sha256, bytes, pinned}.
// The Lab page then runs offline through a service worker that serves exactly these files (offline-sw.js).
// node tools/track/j17-capture.mjs
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const LAB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const V = path.join(LAB, 'public/vendor/joyride-j17'), R = path.join(V, '_remote'), T186 = path.join(LAB, 'public/vendor/three@0.186.1');
fs.mkdirSync(R, { recursive: true });
const MF = path.join(R, 'manifest.json'), man = fs.existsSync(MF) ? JSON.parse(fs.readFileSync(MF, 'utf8')) : { schema: 'kfb.offline-mirror/1', files: {} };
const EXT = { 'text/javascript': '.js', 'application/javascript': '.js', 'application/json': '.json', 'text/css': '.css', 'image/png': '.png', 'image/jpeg': '.jpg', 'font/woff2': '.woff2', 'model/gltf-binary': '.glb', 'model/gltf+json': '.gltf', 'audio/mpeg': '.mp3', 'audio/ogg': '.ogg' };
const THREE160 = 'https://unpkg.com/three@0.160.0/';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [];
p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('response', (r) => { if (r.status() >= 400) logs.push('http ' + r.status() + ' ' + r.url().slice(0, 200)); }); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 240)); });
let n = 0;
await p.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, async (r) => {
  const url = r.request().url();
  if (url.startsWith(THREE160)) { const f = path.join(T186, url.slice(THREE160.length).split('?')[0]); return fs.existsSync(f) ? r.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: 'r186 missing ' + url }); }
  if (man.files[url]) { const e = man.files[url]; return r.fulfill({ status: 200, contentType: e.type, body: fs.readFileSync(path.join(R, e.file)) }); }
  try {
    const resp = await r.fetch(); const body = await resp.body(), type = (resp.headers()['content-type'] || 'application/octet-stream').split(';')[0].trim();
    if (resp.status() === 200) {
      const h = crypto.createHash('sha1').update(url).digest('hex').slice(0, 20), ext = EXT[type] ?? (path.extname(new URL(url).pathname) || '.bin');
      fs.writeFileSync(path.join(R, h + ext), body);
      man.files[url] = { file: h + ext, type, bytes: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex'), pinned: /@[0-9a-f]{40}|\/[0-9a-f]{40}\/|@\d+\.\d+\.\d+/.test(url) }; n++;
    }
    return r.fulfill({ response: resp, body });
  } catch (e) { logs.push('fetch fail ' + url + ' ' + e.message); return r.abort(); }
});
await p.goto('http://127.0.0.1:5192/vendor/joyride-j17/' + encodeURIComponent('KFB Joyride J17 · FB Cabrio.dc.html'));
try { await p.waitForFunction(() => window.__j12?.T?.S?.length, null, { timeout: Number(process.env.BOOT_MS ?? 300000) }); } catch (e) { fs.writeFileSync(MF, JSON.stringify(man, null, 1)); console.log("BOOT FAIL", JSON.stringify({ logs, n, note: await p.evaluate(() => document.body.innerText.slice(0, 600)) }, null, 1)); await b.close(); process.exit(1); } await p.waitForTimeout(6000);
const L = await p.evaluate(() => window.__j12.T.S[window.__j12.T.S.length - 1].s);
for (const f of [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95]) { await p.evaluate((s) => { const a = window.__j12; a.setMode('fahren'); a.placeCar(s, 0, 0); }, f * L); await p.waitForTimeout(1500); }
for (const w of ['bucht', 'otown', 'canyon']) { await p.evaluate((w) => window.__j12.set('world', w), w); await p.waitForTimeout(2500); }
await p.keyboard.press('KeyI'); await p.waitForTimeout(4000);   // on foot (travel figure + clips)
fs.writeFileSync(MF, JSON.stringify(man, null, 1));
const byHost = {}; for (const u of Object.keys(man.files)) { const h = new URL(u).host; byHost[h] = (byHost[h] || 0) + 1; }
console.log(JSON.stringify({ newFiles: n, total: Object.keys(man.files).length, byHost, unpinned: Object.entries(man.files).filter(([, e]) => !e.pinned).map(([u]) => u.slice(0, 120)), logs: logs.slice(0, 20) }, null, 1));
await b.close();
