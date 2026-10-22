// V-632 kfb-groundfx: Prüfseite test/fixtures/groundfx.html (welliges Gelände: Hang, Mulde, Kante) über einen kleinen lokalen Server.
// Bilder test/out/groundfx/{cone,pool,ring}.png, Messung GPU-Zeit 0 vs 16 Plätze (volle Bildfläche Gelände, A/B im Wechsel, Median) ≤ 0,5 ms.
// Prüft außerdem: Shader kompiliert unter r186 (keine Seitenfehler), Effekt hellt am Zielpunkt auf allen drei Formen auf, Mischer (Vorrang, Zählung).
import http from 'http'
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import { report } from './_page.mjs'
const ROOT = path.resolve('.'), OUT = 'test/out/groundfx/'; fs.mkdirSync(OUT, { recursive: true })
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' }
const srv = http.createServer((q, s) => { if (q.url === '/favicon.ico') { s.writeHead(204); return s.end() } const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end() } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s) })
await new Promise((r) => srv.listen(0, r)); const port = srv.address().port
const gpu = !!process.env.PW_GPU
const browser = await chromium.launch(gpu ? { channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] } : { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const DPR = gpu ? +(process.env.GFX_DPR || 1.25) : 1   // 1,25 = Spiel-Standard (src/start/quality.js), GFX_DPR=2 für den Härtefall
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: DPR }), errs = []
page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)) })
await page.goto(`http://localhost:${port}/test/fixtures/groundfx.html`); await page.waitForFunction(() => window.__gfx?.ready, null, { timeout: 60000 })
const res = { three: await page.evaluate(() => __gfx.three), lift: {}, stats: {} }
// Aufhellung je Form an den drei Stellen (Ziel: Zielpunkt heller als ohne Effekt)
for (const form of ['cone', 'pool', 'ring']) {
  const off = await page.evaluate((f) => { __gfx.show('none'); return __gfx.samples(f) }, form)
  const on = await page.evaluate((f) => { __gfx.show(f); return __gfx.samples(f) }, form)
  await page.waitForTimeout(150); await page.screenshot({ path: OUT + form + '.png' })
  res.lift[form] = { off, on }; res.stats[form] = await page.evaluate(() => __gfx.stats())
}
// Kosten (nur mit Test-Slot, GFX_COST=1): alle 16 Plätze belegt gegen 0, A/B im Wechsel (Maschine geteilt), je 40 Bilder, 7 Durchgänge
const COST = !!process.env.GFX_COST, A = { on: [], off: [] }
if (COST) for (let i = 0; i < 7; i++) for (const m of ['full', 'none']) { const t = await page.evaluate((m) => { __gfx.show(m); __gfx.timeDraws(10); return __gfx.timeDraws(40) }, m); A[m === 'full' ? 'on' : 'off'].push(t) }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return +s[s.length >> 1].toFixed(3) }
res.cost = !COST ? { skipped: 'GFX_COST=1 mit kfb-slot' } : { full16ms: med(A.on), noneMs: med(A.off), deltaMs: +(med(A.on) - med(A.off)).toFixed(3), dpr: DPR, pixels: Math.round(1440 * 900 * DPR * DPR), gpu }
// Mischer: 16 Disco + Scheinwerfer mit Vorrang → Scheinwerfer behalten ihre Plätze
res.mixer = await page.evaluate(() => { __gfx.show('full'); const a = __gfx.stats(); __gfx.show('cone'); return { full: a, cone: __gfx.stats() } })
await browser.close(); srv.close()
fs.writeFileSync(OUT + 'results.json', JSON.stringify(res, null, 1)); console.log(JSON.stringify(res))
const lifted = (f) => res.lift[f].on.every((v, i) => v > res.lift[f].off[i] + 6)
process.exit(report('groundfx V-632 (Kegel, Pfütze, Ring auf Hang/Mulde/Kante)', {
  noPageErrors: !errs.length,
  coneLiftsAll3: lifted('cone'), poolLiftsAll3: lifted('pool'), ringLiftsAll3: lifted('ring'),
  mixerFull16: res.mixer.full.n === 16, mixerCountsOwner: res.mixer.cone.owners.headlights === 3,
  budget05ms: !gpu || !COST || res.cost.deltaMs <= 0.5,
}, { images: ['cone', 'pool', 'ring'].map((f) => OUT + f + '.png'), errs: errs.slice(0, 3) }))
