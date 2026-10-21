// Düsen-Umfrage über den Browser (rig-extra r1): Heck-Höhenbild + Basisfarbe kommen von der GPU (survey.html),
// die Erkennung ist dieselbe wie in thrust-survey r1 (Senkenfüllung, RANSAC-Kreis, Becher/Vorsprung, Textur, Symmetrie).
// Aufruf: node survey-browser.mjs  -> survey-browser.raw.json + validation.json + ../out/vehicles/debug/<id>_rear_survey.png
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { detectNozzles, scoreCandidates } from '/Users/georgvonwestphalen/kfb-ws1/thrust-survey/lib/detect.mjs'
import { VIEWS } from '/Users/georgvonwestphalen/kfb-ws1/thrust-survey/lib/raster.mjs'
import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire('/Users/georgvonwestphalen/kfb-ws1/thrust-survey/survey.mjs')
const sharp = require('sharp')

const HERE = new URL('.', import.meta.url).pathname
const OUT = HERE + '../out/vehicles/debug/'; fs.mkdirSync(OUT, { recursive: true })
const SIX = ['rustwing_cruiser', 'graffiti_jet_cruiser', 'street_racer_hoverbeast', 'crimson_flame_dragster', 'crimson_thunderjet', 'ironclad_skycruiser']
const EIGHT = ['brasswing_roadster', 'iron_phantom_hovercar', 'ironclad_wrecker', 'jetbound_roadster', 'rust_runner', 'rustfire_interceptor', 'rustwing_hauler', 'wasteland_beetle']
const ids = process.argv.slice(2).length ? process.argv.slice(2) : [...SIX, ...EIGHT]
const RIG = JSON.parse(fs.readFileSync('/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8')).vehicles

const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
page.on('console', (m) => { if (m.type() === 'error') console.log('[page]', m.text()) })
await page.goto('http://127.0.0.1:8794/probe/tests/rig-extra/survey.html')
await page.waitForFunction(() => window.ready === true)

const unb64 = (s, T) => { const b = Buffer.from(s, 'base64'); return new T(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)) }
const dedupe = (cs) => { const keep = []; for (const c of cs.slice().sort((a, b) => b.confidence - a.confidence)) { if (!keep.find((k) => Math.hypot(k.img.cx - c.img.cx, k.img.cy - c.img.cy) < 0.8 * Math.max(k.img.r, c.img.r))) keep.push(c) } return keep }
function drawCircle(buf, nx, ny, cx, cy, r, col) {
  for (let j = Math.floor(cy - r - 3); j <= cy + r + 3; j++) for (let i = Math.floor(cx - r - 3); i <= cx + r + 3; i++) {
    if (i < 0 || j < 0 || i >= nx || j >= ny) continue
    if (Math.abs(Math.hypot(i + 0.5 - cx, j + 0.5 - cy) - r) < 1.3) { const k = j * nx + i; buf[3 * k] = col[0]; buf[3 * k + 1] = col[1]; buf[3 * k + 2] = col[2] }
  }
}
const raw = {}, validation = {}
for (const id of ids) {
  const t0 = Date.now()
  const r = await page.evaluate(([id]) => window.rasterRear(id, 0.01), [id])
  const meta = JSON.parse(fs.readFileSync(HERE + 'json/' + id + '.json', 'utf8'))
  const H = unb64(r.H, Float32Array), RGB = unb64(r.RGB, Uint8Array), COV = unb64(r.COV, Uint8Array)
  const hb = new Float32Array(H.length), fb = new Int32Array(H.length)
  for (let k = 0; k < H.length; k++) { hb[k] = COV[k] ? H[k] : -Infinity; fb[k] = COV[k] ? 0 : -1 }
  const R = { view: 'rear', V: VIEWS.rear, px: r.px, nx: r.nx, ny: r.ny, umin: r.umin, wmax: r.wmax, hb, fb, rgb: RGB,
    pxToU: (i) => r.umin + (i + 0.5) * r.px, pyToW: (j) => r.wmax - (j + 0.5) * r.px }
  const mn = r.bbox.min, mx = r.bbox.max, W = mx[0] - mn[0], L = mx[2] - mn[2]
  const { cands: rc } = detectNozzles(R, { width: W, label: 'rear' }); scoreCandidates(rc, { W, L, zmin: mn[2], view: 'rear' })
  const { cands: rb } = detectNozzles(R, { width: W, label: 'rear-boss', mode: 'boss' }); scoreCandidates(rb, { W, L, zmin: mn[2], view: 'rear' })
  const rcD = dedupe(rc), rbD = dedupe(rb)
  for (const c of rcD) {   // Becher + konzentrischer Außenkörper = Rohr mit Rand
    const b = rbD.find((o) => Math.hypot(o.img.cx - c.img.cx, o.img.cy - c.img.cy) < 0.4 * o.img.r && o.img.r >= 0.95 * c.img.r && o.img.r <= 2.6 * c.img.r && o.confidence >= 0.3)
    if (b) { b.matched = true; c.outerRadius = b.radius; c.confidence = +Math.min(1, c.confidence + 0.08).toFixed(2) }
  }
  const wheels = Object.entries(meta.anchors).filter(([k]) => k.startsWith('kfb_wheel_')).map(([, v]) => v.pos), wheelR = meta.dimensions?.wheel_radius?.[0] ?? 0.5
  for (const b of rbD) if (wheels.find((p) => Math.hypot(p[0] - b.pos[0], p[1] - b.pos[1]) < Math.max(wheelR * 1.3, b.radius))) b.isWheel = true
  const rbKeep = rbD.filter((b) => !b.matched && !b.isWheel && 2 * b.radius / W >= 0.08 && !rcD.some((c) => Math.hypot(b.img.cx - c.img.cx, b.img.cy - c.img.cy) < Math.max(b.img.r, c.img.r)))
  const all = [...rcD, ...rbKeep].sort((a, b) => b.confidence - a.confidence)
  raw[id] = { bbox: r.bbox, candidates: all.map((c) => ({ kind: c.kind, pos: c.pos.map((v) => +v.toFixed(3)), dir: c.dir.map((v) => +v.toFixed(3)), radius: +c.radius.toFixed(3), outerRadius: c.outerRadius ? +c.outerRadius.toFixed(3) : undefined, confidence: c.confidence, img: c.img })) }
  // Prüfbild Heck mit Kandidaten (grün ≥0,6, gelb ≥0,45, magenta darunter, blau = Vorsprung)
  const buf = Buffer.alloc(r.nx * r.ny * 3, 255)
  for (let k = 0; k < r.nx * r.ny; k++) if (COV[k]) { buf[3 * k] = RGB[3 * k]; buf[3 * k + 1] = RGB[3 * k + 1]; buf[3 * k + 2] = RGB[3 * k + 2] }
  for (const c of all) if (c.confidence >= 0.3) drawCircle(buf, r.nx, r.ny, c.img.cx, c.img.cy, c.img.r, c.kind === 'boss' ? [0, 160, 255] : c.confidence >= 0.6 ? [0, 230, 0] : c.confidence >= 0.45 ? [255, 210, 0] : [255, 0, 255])
  await sharp(buf, { raw: { width: r.nx, height: r.ny, channels: 3 } }).png().toFile(OUT + id + '_rear_survey.png')
  console.log(`${id}: ${all.length} Kandidaten, ≥0,45: ${all.filter((c) => c.confidence >= 0.45).length} (${Date.now() - t0} ms)`)
  for (const c of all.filter((c) => c.confidence >= 0.3)) console.log(`   ${c.kind} ${c.confidence.toFixed(2)} pos ${c.pos.map((v) => v.toFixed(3))} r ${c.radius.toFixed(3)} dir ${c.dir.map((v) => v.toFixed(2))}`)
  // Abgleich mit den bekannten Ankern (nur die 6 aus r1)
  if (RIG[id]) {
    const good = all.filter((c) => c.confidence >= 0.3)
    validation[id] = RIG[id].anchors.map((a) => {
      let best = null; for (const c of good) { const d = Math.hypot(c.pos[0] - a.pos[0], c.pos[1] - a.pos[1], c.pos[2] - a.pos[2]); if (!best || d < best.d) best = { d, c } }
      return { id: a.id, type: a.type, known: a.pos, found: best ? best.c.pos.map((v) => +v.toFixed(3)) : null, dist: best ? +best.d.toFixed(3) : null, dr: best ? +(best.c.radius - a.radius).toFixed(3) : null, conf: best ? best.c.confidence : null }
    })
    for (const v of validation[id]) console.log(`   ✓ ${v.id}: Abstand ${v.dist} (Δr ${v.dr}, conf ${v.conf})`)
  }
}
fs.writeFileSync(HERE + 'survey-browser.raw.json', JSON.stringify(raw, null, 1))
fs.writeFileSync(HERE + 'validation.json', JSON.stringify(validation, null, 1))
await browser.close()
