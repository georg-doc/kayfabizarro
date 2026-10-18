#!/usr/bin/env node
// KFB GEM_R1 · headless probe: state sheet (idle / active / moving), capture frame strip, shader cost. Drives ../gem-proof.html, which uses
// the ONE proof stage (kfb-proof-stage.v1.2 with the gem hook, light v1.1). Same server rules as render.mjs: own 127.0.0.1 server on an
// ephemeral port (never 5180/5192/8765), root = KFB_HUB, extra files only from --assets <dir> under $HOME, nothing under "KFB Open World".
//   KFB_CHROME=<chrome-headless-shell> node gem-proof.mjs --assets <dir with gem_*.glb from make-test-assets.mjs> --out <dir> [--only states,capture,perf]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), HUB = path.resolve(HERE, '../../../..'), HOME = process.env.HOME;
const argv = process.argv.slice(2), A = {}; for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) A[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
if (!A.assets || !A.out) { console.error('usage: node gem-proof.mjs --assets <dir> --out <dir> [--only states,capture,perf]'); process.exit(2); }
const ASSETS = path.resolve(A.assets), OUT = path.resolve(A.out), ONLY = new Set(String(A.only || 'states,capture,perf').split(','));
if (!ASSETS.startsWith(HOME + path.sep) || /KFB Open World/.test(ASSETS)) { console.error('assets must be under $HOME and not in KFB Open World'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname); let f = null;
  if (u.startsWith('/@assets/')) { const c = path.join(ASSETS, path.basename(u)); if (/^gem_\w+\.glb$/.test(path.basename(u))) f = c; }
  else { const c = path.join(HUB, u); if (c.startsWith(HUB) && !/KFB Open World/.test(c)) f = c; }
  if (!f || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port; if ([5180, 5192, 8765].includes(PORT)) { server.close(); process.exit(2); }
const LAB = path.join(HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const { chromium } = createRequire(path.join(process.env.KFB_PLAYWRIGHT_DIR || LAB, 'package.json'))('playwright-core');
const browser = await chromium.launch({ headless: true, executablePath: process.env.KFB_CHROME, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const save = (name, url) => { fs.writeFileSync(path.join(OUT, name), Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('  wrote ' + name); };
const report = { created: new Date().toISOString(), port: PORT };
let code = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
  await page.goto(`http://127.0.0.1:${PORT}/30_DECISIONS/replies/GEM_R1/gem-proof.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.KFB_GEM_READY === true, null, { timeout: 30000 });
  const G = (fn, arg) => page.evaluate(fn, arg);
  const url = (n) => `/@assets/${n}.glb`;
  if (ONLY.has('states')) {
    const cells = [];
    for (const mood of ['day', 'night']) {
      const r = await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_pair'), mood, id: 'gem_pair' });
      report['states_' + mood] = r;
      await G((m) => window.KFB_GEM.setStates(m), { 'active': 'active' });
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: `${mood === 'day' ? 'Tag' : 'Nacht'} · vorn · v. l.: Rubin idle · Rubin ACTIVE · Saphir idle · Saphir ACTIVE` });
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'threeq'), caption: `${mood === 'day' ? 'Tag' : 'Nacht'} · ¾ · gleiche Reihenfolge (active = hellere Adern + weicher Rand)` });
    }
    await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_pair'), mood: 'day', id: 'gem_pair' });
    await G((m) => window.KFB_GEM.setStates(m), { 'active': 'moving' });
    for (const t of [0.4, 0.8]) { await G((s) => window.KFB_GEM.advance(s), t === 0.4 ? 0.4 : 0.4); cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: `Tag · MOVING t = ${t.toFixed(1)} s (2. und 4. Figur: Schimmer, Facetten drehen langsam)` }); }
    save('gem_states_idle_active_moving.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 · Zustände idle / active / moving (Damen, Satz M r2)', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA · Paare: links idle, rechts active · unten: moving nach 0,4 s / 0,8 s', cells, cols: 2 }));
  }
  if (ONLY.has('capture')) {
    const r = await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_capture'), mood: 'day', id: 'gem_capture' }); report.capture = r;
    const cells = [], times = [0, 0.12, 0.35, 0.65, 1.0]; let at = 0;
    for (const t of times) {
      if (t > 0 && at === 0) await G((m) => window.KFB_GEM.setStates(m), { '.': 'captured' });
      if (t > at) { report['capture_t' + t] = await G((s) => window.KFB_GEM.advance(s), t - at); at = t; }
      cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: t === 0 ? 't = 0 (vor dem Schlag)' : `captured · t = ${t.toFixed(2)} s` });
    }
    save('gem_capture_strip.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 · captured: Cartoon-Bruch (wenige große Scherben, springen, verblassen, ≤ 1,2 s)', sub: 'Rubin-Dame + Saphir-Springer · Schnitt der echten Hülle (Morph-Chess-Bruch, 8 Scherben je Figur) · Bühne v1.2, Tag · Ausblenden ab 0,72 s, weg bei 1,2 s', cells, cols: 5, tw: 576, th: 432 }));
  }
  if (ONLY.has('lanterns')) {
    const r = await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_lanterns'), mood: 'night', id: 'gem_lanterns' }); report.lanterns = r;
    const cells = [];
    await G((s) => window.KFB_GEM.advance(s), 1.0);
    cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: 'Nacht · vorn · t = 1,0 s · nur Eigenleuchten (emissive), kein Licht' });
    await G((s) => window.KFB_GEM.advance(s), 4.2);
    cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: 'Nacht · vorn · t = 5,2 s (halbe Pulsperiode 0,12 Hz später) · nur emissive' });
    cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'threeq'), caption: 'Nacht · ¾ · t = 5,2 s · nur emissive' });
    report.lanternLights = await G((on) => window.KFB_GEM.practicals(on), true);
    cells.push({ url: await G((v) => window.KFB_GEM.render(v), 'front'), caption: 'Nacht · vorn · t = 5,2 s · lantern: getPracticalLight() -> Practicals-Pool (Licht-Modul), nur wenn WS1 es erlaubt' });
    save('gem_lanterns_night.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 r2 · Laternen bei Nacht (4 Figuren frei auf dem Boden, ohne Brett)', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA Nacht · Adern + Innenleuchten nach Stimmung (glow 1), Puls 0,12 Hz · unten rechts: optionales Praktisches Licht über den Hook', cells, cols: 2 }));
  }
  if (ONLY.has('r3')) {
    const R = (v) => G((x) => window.KFB_GEM.render(x), v), cap = (m) => ({ day: 'Tag', dusk: 'Abend', night: 'Nacht' })[m];
    let cells = [];
    for (const [mood, t] of [['night', 1.0], ['dusk', 1.0]]) {
      await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_lanterns'), mood, id: 'gem_lanterns' }); await G((x) => window.KFB_GEM.advance(x), t);
      if (mood === 'night') {
        cells.push({ url: await R('front'), caption: `Nacht · vorn · t = ${t} s · OHNE Halo (nur emissive)` });
        await G((on) => window.KFB_GEM.setHalo(on), true);
        cells.push({ url: await R('front'), caption: `Nacht · vorn · t = ${t} s · MIT Halo (halo: true)` });
        await G((x) => window.KFB_GEM.advance(x), 4.2);
        cells.push({ url: await R('threeq'), caption: 'Nacht · ¾ · t = 5,2 s (andere Pulsphase) · mit Halo' });
      } else { await G((on) => window.KFB_GEM.setHalo(on), true); cells.push({ url: await R('front'), caption: 'Abend (glow 0,4) · vorn · t = 1 s · mit Halo: teilweise Eigenleuchten' }); }
    }
    save('gem_r3_lanterns.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 r3 · Laternen: Leuchten von innen (4 Figuren frei, ohne Brett)', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA · heißer Kern -> dunklerer Rand, Glühen folgt der Anatomie (Dünne), Flackern über dem 0,12-Hz-Puls · Halo ohne Post-Processing', cells, cols: 2 }));
    cells = [];
    await G((a) => window.KFB_GEM.load(a), { glbUrl: url('gem_capture'), mood: 'night', id: 'gem_queen_knight' }); await G((x) => window.KFB_GEM.advance(x), 1.0);
    cells.push({ url: await R('front'), caption: 'Nacht · Dame (Rubin) + Springer (Saphir) · vorn · ohne Halo' });
    cells.push({ url: await R('near_face'), caption: 'Nacht · Detail Mitte (Kronenspitzen, Mähne/Ohren) · ohne Halo' });
    await G((on) => window.KFB_GEM.setHalo(on), true);
    cells.push({ url: await R('threeq'), caption: 'Nacht · ¾ · mit Halo' });
    await G((x) => window.KFB_GEM.advance(x), 4.2);
    cells.push({ url: await R('front'), caption: 'Nacht · vorn · t = 5,2 s · mit Halo' });
    save('gem_r3_closeup_queen_knight_night.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 r3 · Nahaufnahme Dame + Springer bei Nacht', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA Nacht · Kern weiß-gold / weiß-eis, Rand dunkler, dünne Teile am hellsten', cells, cols: 2 }));
  }
  if (ONLY.has('r4')) {
    const R = (v) => G((x) => window.KFB_GEM.render(x), v), L = (mood, glb, id) => G((a) => window.KFB_GEM.load(a), { glbUrl: url(glb), mood, id });
    const adv = async (t) => { await G((x) => window.KFB_GEM.advance(x), t); return G(() => window.KFB_GEM.refreshLights()); };
    let cells = [];
    for (const [mood, dark] of [['night', false], ['night', true]]) {
      await L(mood, 'gem_lanterns', 'gem_lanterns'); if (dark) await G((on) => window.KFB_GEM.nightDark(on), true);
      report['r4_lights_' + (dark ? 'dark' : 'night')] = await adv(1.0);
      cells.push({ url: await R('front'), caption: `${dark ? 'Nacht dunkel (Hemi −50 %, nur Laternentest)' : 'Nacht'} · vorn · t = 1,0 s · Lichtpfütze + Praktische Lichter + Halo` });
      await adv(4.2);
      cells.push({ url: await R('threeq'), caption: `${dark ? 'Nacht dunkel' : 'Nacht'} · ¾ · t = 5,2 s (tiefe Pulsphase: Glut statt aus)` });
    }
    await L('dusk', 'gem_lanterns', 'gem_lanterns'); await adv(1.0);
    cells.push({ url: await R('front'), caption: 'Abend (glow 0,4) · vorn · t = 1,0 s' });
    cells.push({ url: await R('threeq'), caption: 'Abend · ¾ · t = 1,0 s' });
    save('gem_r4_lanterns.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 r4 · Laternen: Licht in die Umgebung, Glut im Pulstief (4 Figuren frei, ohne Brett)', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA · Bodenpfütze je Figur (Gem-Modul) + getPracticalLight() -> Practicals-Pool des Licht-Moduls (≤ 6 Lichter) · Adern in Glutfarbe · Spiegelung außen 12 %', cells, cols: 2 }));
    cells = [];
    await L('night', 'gem_capture', 'gem_queen_knight'); await adv(1.0);
    cells.push({ url: await R('front'), caption: 'Nacht · Dame + Springer · vorn · t = 1,0 s' });
    cells.push({ url: await R('near_face'), caption: 'Nacht · Detail Mitte · t = 1,0 s' });
    await adv(4.2);
    cells.push({ url: await R('threeq'), caption: 'Nacht · ¾ · t = 5,2 s (Pulstief)' });
    await L('night', 'gem_capture', 'gem_queen_knight'); await G((on) => window.KFB_GEM.nightDark(on), true); await adv(1.0);
    cells.push({ url: await R('front'), caption: 'Nacht dunkel (Hemi −50 %) · vorn · t = 1,0 s' });
    save('gem_r4_closeup_queen_knight_night.png', await G((a) => window.KFB_GEM.sheet(a), { title: 'kfb-gem.v1 r4 · Nahaufnahme Dame + Springer bei Nacht', sub: 'Bühne v1.2 + Licht v1.1, MOODS_MESA Nacht · Glühen von innen, Lichtpfütze am Boden, Streulicht auf Nachbar und Wand', cells, cols: 2 }));
  }
  if (ONLY.has('perf')) {
    for (const [n, view, mood] of (process.env.PERF_SET === 'quick' ? [['gem_perf32', 'front', 'night'], ['gem_perf32', 'front', 'day']] : [['gem_perf32', 'front', 'day'], ['gem_perf32', 'front', 'night'], ['gem_start', 'threeq', 'day'], ['gem_perf32', 'front', 'day']])) {
      await G((a) => window.KFB_GEM.load(a), { glbUrl: url(n), mood, id: n });
      const p = await G((a) => window.KFB_GEM.perf(a), { view, frames: 60 });
      report[`perf_${n}_${view}_${mood}`] = p; console.log(n, view, mood, JSON.stringify(p));
      if (n === 'gem_perf32' && mood === 'day') save('gem_perf32_front_day.png', await G((v) => window.KFB_GEM.render(v), 'front'));
    }
  }
  report.pageErrors = errs; if (errs.length) console.log('page errors: ' + errs.slice(0, 5).join(' | '));
} catch (e) { console.error('gem-proof: ' + e.message); code = 2; }
finally { fs.writeFileSync(path.join(OUT, 'gem_probe_report.json'), JSON.stringify(report, null, 1)); await browser.close(); server.close(); }
process.exit(code);
