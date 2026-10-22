// V-631 Abnahme-Unterlage Scheinwerfer-Anker (Lead 22.10., WS0 J-6): je Racer mit „im Rig-Studio prüfen“ zwei Ansichten (gerade von vorn, schräg von vorn)
// mit Marken: grün = jetzt im Spiel gewählte Lampen, gelb mit Nummer = weitere Kandidaten der Automatik (links/rechts gespiegelt).
// Ausgabe: test/out/anchors/anchors-<id>.png und anchors-sheet.png; Liste ws1/audits/VEHICLES_R1_ANKER.md schreibt der Mensch daraus (Vorlage im Bericht).
// Aufruf: PW_GPU=1 node test/anchors-sheet.mjs [alle]   (Einzeltest; Modelle von der öffentlichen kayfabizarro-Adresse am Commit)
import http from 'http'
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const ROOT = path.resolve('.'), OUT = 'test/out/anchors/'; fs.mkdirSync(OUT, { recursive: true })
const RIG = JSON.parse(fs.readFileSync('src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8')).vehicles
const ANC = JSON.parse(fs.readFileSync('test/fixtures/headlight-anchors.r1.json', 'utf8')).vehicles
const COMMIT = '9bd8e0376105b29375377ea3052e33528d50fbb6'
const IDS = Object.keys(RIG).filter((id) => process.argv[2] === 'alle' || RIG[id].headlights.check).sort((a, b) => RIG[a].name_de.localeCompare(RIG[b].name_de, 'de', { numeric: true }))
const TYPES = { '.html': 'text/html', '.js': 'text/javascript' }
const srv = http.createServer((q, s) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end() } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s) })
await new Promise((r) => srv.listen(0, r))
const browser = await chromium.launch(process.env.PW_GPU ? { channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] } : {})
const VW = 900, VH = 620, tiles = []
for (const id of IDS) {
  const url = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${COMMIT}/${RIG[id].path}`, cur = RIG[id].headlights.lamps, cands = ANC[id].candidates || []
  const row = []
  for (const view of ['front', 'quarter']) {
    const page = await browser.newPage({ viewport: { width: VW, height: VH } })
    await page.goto(`http://localhost:${srv.address().port}/test/fixtures/anchors.html?view=${view}&url=${encodeURIComponent(url)}`); await page.waitForFunction(() => window.__anc?.ready, null, { timeout: 120000 })
    const png = await page.screenshot()
    const marks = await page.evaluate(({ cur, cands }) => ({ cur: cur.map((l) => ({ p: __anc.project([l.pos])[0], r: Math.max(7, __anc.scale(l.pos, l.r)) })),
      cand: cands.flatMap((c) => [1, -1].map((sx) => ({ i: c.i, p: __anc.project([[c.pos[0] * sx, c.pos[1], c.pos[2]]])[0], r: Math.max(6, __anc.scale(c.pos, c.r)) }))) }), { cur, cands })
    await page.close()
    const svg = `<svg width="${VW}" height="${VH}" xmlns="http://www.w3.org/2000/svg">` +
      marks.cand.map((m) => `<circle cx="${m.p[0]}" cy="${m.p[1]}" r="${m.r}" fill="none" stroke="#ffd400" stroke-width="2" stroke-dasharray="4 3"/><text x="${m.p[0] + m.r + 2}" y="${m.p[1] - m.r}" font-size="15" font-weight="bold" font-family="sans-serif" fill="#ffd400" stroke="#000" stroke-width="0.6">${m.i + 1}</text>`).join('') +
      marks.cur.map((m) => `<circle cx="${m.p[0]}" cy="${m.p[1]}" r="${m.r + 3}" fill="none" stroke="#22e36b" stroke-width="3"/>`).join('') + '</svg>'
    row.push(await sharp(png).composite([{ input: Buffer.from(svg) }]).png().toBuffer())
  }
  const HD = 34, a = ANC[id], lab = `${RIG[id].name_de} · grün = jetzt gewählt (${a.source})${a.note ? ' · ' + a.note : ''}`.replace(/&/g, '&amp;').slice(0, 150)
  const tile = await sharp({ create: { width: 2 * VW, height: VH + HD, channels: 3, background: '#15151b' } }).composite([
    { input: Buffer.from(`<svg width="${2 * VW}" height="${HD}" xmlns="http://www.w3.org/2000/svg"><text x="10" y="23" font-size="18" font-family="sans-serif" fill="#fff">${lab}</text></svg>`), left: 0, top: 0 },
    { input: row[0], left: 0, top: HD }, { input: row[1], left: VW, top: HD }]).png().toBuffer()
  fs.writeFileSync(OUT + `anchors-${id}.png`, tile); tiles.push(tile); console.log('ok', id)
}
const TH = VH + 34
await sharp({ create: { width: 2 * VW, height: TH * tiles.length, channels: 3, background: '#15151b' } }).composite(tiles.map((t, i) => ({ input: t, left: 0, top: i * TH }))).png().toFile(OUT + 'anchors-sheet.png')
await browser.close(); srv.close(); console.log('PASS anchors-sheet', IDS.length)
