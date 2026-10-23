// WS-Audio · Ton von GitHub (Status 16): Laufzeit gegen zwei fremde Hosts (lokal nachgestellt: zwei Server mit CORS * und Range 206, wie jsDelivr und raw),
// Ablage aus `site-copy.mjs --publish`. Prüft: erster Host lädt, erster Musik-Ton, Web Audio hört die Musik (CORS), Rückfall-Host je Datei und je Modul,
// beide Hosts weg → Spiel läuft ohne Ton. Optional echte Hosts: KFB_AUDIO_REMOTE=jsdelivr-url,raw-url. Engine: PW_ENGINE=webkit (Safari) oder chromium.
// Ohne Ablage: SKIP (PASS). Aufruf: PW_GPU=1 node test/audio-remote.mjs
import fs from 'fs'
import os from 'os'
import path from 'path'
import http from 'http'
import net from 'net'
import { spawn } from 'child_process'
import { chromium, webkit } from 'playwright'
import { report } from './_page.mjs'

const PUB = process.env.KFB_AUDIO_PUBLISH || path.join(os.homedir(), 'kfb-ws1/.kfb-audio-publish/r1'), ENGINE = process.env.PW_ENGINE || 'chromium'
if (!fs.existsSync(path.join(PUB, 'index.json'))) { console.log('SKIP audio-remote: keine Ablage (node scripts/audio/site-copy.mjs --publish)'); console.log('PASS audio-remote (skip)'); process.exit(0) }
const TYPES = { '.json': 'application/json', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.md': 'text/plain' }
const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)) }) })
function cdn(port) { const hits = { n: 0, range: 0 }
  const srv = http.createServer((req, res) => { hits.n++; const p = path.join(PUB, decodeURIComponent(new URL(req.url, 'http://x').pathname)); res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Accept-Ranges', 'bytes')
    if (!p.startsWith(PUB) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.statusCode = 404; return res.end() }
    const size = fs.statSync(p).size, m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || ''); res.setHeader('Content-Type', TYPES[path.extname(p)] || 'application/octet-stream'); res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    if (m) { hits.range++; const a = m[1] ? +m[1] : 0, b = m[2] ? Math.min(+m[2], size - 1) : size - 1; res.statusCode = 206; res.setHeader('Content-Range', `bytes ${a}-${b}/${size}`); res.setHeader('Content-Length', b - a + 1); return fs.createReadStream(p, { start: a, end: b }).pipe(res) }
    res.setHeader('Content-Length', size); fs.createReadStream(p).pipe(res) }); srv.listen(port, '127.0.0.1'); return { srv, hits } }
const real = process.env.KFB_AUDIO_REMOTE?.split(',')
const [pa, pb, pv] = [await freePort(), await freePort(), await freePort()], A = real ? null : cdn(pa), B = real ? null : cdn(pb)
const ROOT = real ? real[0] : `http://127.0.0.1:${pa}/`, FALL = real ? real[1] : `http://127.0.0.1:${pb}/`
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(pv), '--strictPort', '--host', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, BROWSER: 'none', VITE_KFB_AUDIO_ROOT: ROOT, VITE_KFB_AUDIO_FALLBACK: FALL } })
let vlog = ''; vite.stdout.on('data', (d) => { vlog += d }); vite.stderr.on('data', (d) => { vlog += d })
for (const t0 = Date.now(); !/Local:|ready in/i.test(vlog);) { if (Date.now() - t0 > 60000) throw new Error('vite startet nicht'); await new Promise((r) => setTimeout(r, 200)) }
const HASH = '#m1,harvest,look=terrain3,world=probe,debug', BASE = `http://127.0.0.1:${pv}/`
const launch = () => ENGINE === 'webkit' ? webkit.launch() : process.env.PW_GPU ? chromium.launch({ channel: 'chromium', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }) : chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
// ein Durchgang: Seite öffnen, erste Eingabe, warten bis Musik klingt bzw. Module da sind; block = Regex auf URLs, die scheitern sollen
async function run(name, block, seek = false) {
  const browser = await launch(), page = await browser.newPage({ viewport: { width: 1024, height: 640 } }), errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.addInitScript(() => { const A = window.Audio; window.__auds = []; window.Audio = function (...a) { const el = new A(...a); window.__auds.push(el); return el }; window.Audio.prototype = A.prototype }) // Jukebox-Decks sichtbar machen (nur Test)
  if (block) await page.route(block, (r) => r.abort())
  await page.goto(BASE + HASH); await page.waitForFunction(() => window.__kfbM1?.status?.().amphTris > 0, null, { timeout: 180000 }).catch(() => {})
  await page.mouse.click(500, 300); await page.keyboard.press('KeyW'); const t0 = Date.now()
  const ok = await page.waitForFunction(() => { const s = window.__kfbAudio?.stats?.(); return s && (s.mode === 'public' || (s.music?.firstMs != null && s.loads?.ready)) }, null, { timeout: 60000 }).then(() => true).catch(() => false)
  await page.keyboard.down('KeyW'); await page.waitForTimeout(4000); await page.keyboard.up('KeyW')
  let pre = null
  if (seek) { // Vorladen: laufenden Titel 27 s vor Ende → nächster Titel wird ins freie Deck geladen; 4 s vor Ende → Wechsel nutzt das vorgeladene Deck
    const cur = () => page.evaluate(() => window.__auds.find((e) => !e.paused && e.duration > 0)?.duration ?? null); if (await cur()) {
      await page.evaluate(() => { const e = window.__auds.find((x) => !x.paused && x.duration > 0); e.currentTime = e.duration - 27 }); await page.waitForTimeout(2500); const a = await page.evaluate(() => window.__kfbAudio.stats().music)
      await page.evaluate(() => { const e = window.__auds.find((x) => !x.paused && x.duration > 0); e.currentTime = e.duration - 4 }); await page.waitForTimeout(5000); const b = await page.evaluate(() => window.__kfbAudio.stats().music)
      pre = { prepAfterSeek: a.prep, prepared: b.prepared, started: b.started } } }
  const st = await page.evaluate(() => { const s = window.__kfbAudio?.stats?.(), p = window.__kfbAudio?.musicPulse?.(); return s && { mode: s.mode, host: s.host, fb: s.hostFallbacks, music: s.music, loads: Object.fromEntries(Object.entries(s.loads || {}).map(([k, v]) => [k, v.ok])), readyMs: s.loads?.ready?.ms, errors: s.errors.slice(0, 4), pulse: p ? { audible: p.audible01, bass: +(p.bass || 0).toFixed(3) } : null, outDb: s.outDb, player: !!window.__kfbM1?.player?.() } })
  await browser.close(); return { name, ok, wallMs: Date.now() - t0, errs, pre, ...st }
}
const out = {}
try {
  out.normal = await run('normal', null, true)
  if (!real) { out.primaryDown = await run('primaryDown', `http://127.0.0.1:${pa}/**`)
    out.musicPrimaryDown = await run('musicPrimaryDown', new RegExp(`127\\.0\\.0\\.1:${pa}/music/`))
    out.bothDown = await run('bothDown', new RegExp(`127\\.0\\.0\\.1:(${pa}|${pb})/`)) }
} finally { vite.kill('SIGTERM'); A?.srv.close(); B?.srv.close() }
const n = out.normal, checks = {
  normalFirstHost: n.ok && n.mode === 'full' && n.host === ROOT && n.errs.length === 0,
  firstMusicFast: n.music?.firstMs != null && n.music.firstMs <= (real ? 1500 : 1500),
  musicHeardByWebAudio: (n.pulse?.bass ?? 0) > 0 || n.outDb > -60, // CORS: MediaElementSource liefert echten Pegel, nicht Stille
  allModules: ['index', 'ambience', 'bankFirst', 'combat', 'bank'].every((k) => n.loads[k]) && (n.loads.steps || n.loads.racer),
  rangeUsed: real ? true : A.hits.range > 0,
  nextTrackPreloaded: n.pre?.prepAfterSeek === true && n.pre.prepared >= 1,
  ...(real ? {} : {
    primaryDownFallback: out.primaryDown.mode === 'full' && out.primaryDown.host === FALL && out.primaryDown.music?.firstMs != null && out.primaryDown.errs.length === 0,
    musicFileFallback: out.musicPrimaryDown.host === ROOT && out.musicPrimaryDown.fb > 0 && out.musicPrimaryDown.music?.firstMs != null && !out.musicPrimaryDown.music?.dead,
    bothDownGameRuns: out.bothDown.mode === 'public' && out.bothDown.errs.length === 0 && out.bothDown.player }),
}
fs.mkdirSync('test/out/audio', { recursive: true }); fs.writeFileSync(`test/out/audio/remote-${ENGINE}.json`, JSON.stringify({ engine: ENGINE, root: ROOT, fallback: FALL, out, checks }, null, 1))
process.exit(report(`audio-remote-${ENGINE}`, checks, { engine: ENGINE, root: ROOT, normal: { firstMs: n.music?.firstMs, readyMs: n.readyMs, host: n.host }, primaryDown: out.primaryDown?.host, musicFb: out.musicPrimaryDown?.fb, bothDown: out.bothDown?.mode }))
