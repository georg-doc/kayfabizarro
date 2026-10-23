// Sichtbarkeit des Scheinwerfer-Kegels, gemessen (Lead 23.10., Korrektur hlt=cone): im selben Bild zweimal zeichnen, Kegel-Mesh an und aus (Kontaktfläche
// beide Male an), auf der Bildschirmlinie von der projizierten Lampenmitte bis zum projizierten Fleck-Anfang (Treffpunkt der Unterkante) alle Pixel abtasten.
// Kriterium Nacht: ΔHelligkeit ≥ 10/255 auf ≥ 95 % der Linie, kein Stück unter 10/255 länger als 5 % der Linie; Gold ≥ 6/255; Tag nur berichten. Je Lampe.
// Ansichten: Spielkamera (Standard, hinten oben), Seite nah, Draufsicht, dazu 3 s Fahrt in der Spielkamera (Messung je ~0,5 s).
// Diagnose (HB_DIAG=1): dieselbe Messung ohne Wagen (Verdeckung durch die Nase). Linie ab Glasvorderkante (Lampenmitte + Achse · Glasradius, Lead 23.10.).
// Aufruf: node test/headbeam-line.mjs [racer,…]   Ausgabe JSON je Wagen/Ansicht/Lampe; HB_OUT=datei.json schreibt sie zusätzlich.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const RAC = (process.argv[2] || 'wasteland_beetle,crimson_flame_dragster').split(','), DIAG = !!process.env.HB_DIAG
const TODS = (process.env.HB_TODS || 'nacht,gold,tag').split(','), TH = { nacht: [',tod=night', 10], gold: [',tod=gold', 6], tag: ['', 0] }
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0,hlt=cone', VP = { width: 1600, height: 900 }
const VIEWS = { spielkamera: null, 'seite-nah': { dist: 10, yaw: 1.5, pitch: 0.14, ty: 0.4, ahead: 3.5 }, draufsicht: { dist: 17, yaw: Math.PI, pitch: 1.42, ty: 0, ahead: 5.5 } }
const out = { date: new Date().toISOString(), criterion: 'Nacht Δ≥10/255 auf ≥95 % der Linie, Lücke ≤5 %; Gold Δ≥6/255; Tag Bericht', results: {} }

// eine Messung im aktuellen Bild: je Lampe Linie Lampe → Fleck-Anfang; variants: Liste von { hideCar }
const measure = (page, thr, variants) => page.evaluate(({ thr, variants }) => {
  const M = window.__kfbM2, H = M.headlights, hl = H.inst, B = hl.headbeam, b = H.lastBeam, gl = M.renderer(), cam = M.camera(), g = M.ground, ctx = gl.getContext()
  let root = hl.group; while (root.parent) root = root.parent
  const V3 = b.origin.constructor, W = ctx.drawingBufferWidth, Hh = ctx.drawingBufferHeight
  const lamps = [1, -1].map((s) => { const P0 = b.origin.clone().addScaledVector(b.R, s * b.half), P = P0.clone().addScaledVector(b.axis, b.r0), dir = b.axis.clone().addScaledVector(b.U, -b.tanV); let hit = null
    for (let t = 0; t < b.len; t += 0.01) { const w = P0.clone().addScaledVector(b.U, -b.r0).addScaledVector(dir, t); if (w.y <= g(w.x, w.z)) { hit = w; break } }
    return { P, hit } })
  const proj = (v) => { const p = v.clone().project(cam); return { x: (p.x * 0.5 + 0.5) * W, y: (p.y * 0.5 + 0.5) * Hh, ok: p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 } }
  const grab = () => { const a = new Uint8Array(W * Hh * 4); gl.render(root, cam); ctx.readPixels(0, 0, W, Hh, ctx.RGBA, ctx.UNSIGNED_BYTE, a); return a }
  const L = (a, i) => 0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2]
  const car = M.stats.rig?.stretch, res = []
  M.freeze(true)
  for (const v of variants) { if (v.hideCar && car) car.visible = false
    B.mesh.visible = true; const on = grab(); B.mesh.visible = false; const off = grab(); let occ = null
    if (car && !v.hideCar) { car.visible = false; occ = grab(); }   // Wagen-Maske: Pixel, die sich ohne Wagen ändern = vom Wagen verdeckt
    B.mesh.visible = true; if (car) car.visible = true
    const lampRes = lamps.map(({ P, hit }, k) => { if (!hit) return { lamp: k, noHit: true }; const a = proj(P), e = proj(hit); const n = Math.max(2, Math.round(Math.hypot(e.x - a.x, e.y - a.y))), d = [], cov = []
      for (let i = 0; i <= n; i++) { const x = Math.round(a.x + (e.x - a.x) * i / n), y = Math.round(a.y + (e.y - a.y) * i / n); if (x < 0 || y < 0 || x >= W || y >= Hh) { d.push(null); continue } const j = (y * W + x) * 4; d.push(L(on, j) - L(off, j)); if (occ) cov.push(Math.abs(L(off, j) - L(occ, j)) > 3) }
      const ok = d.filter((x) => x != null && x >= thr).length, valid = d.filter((x) => x != null).length; let run = 0, maxRun = 0; for (const x of d) { if (x == null || x < thr) { run++; maxRun = Math.max(maxRun, run) } else run = 0 }
      const q = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((f) => { const x = d[Math.round(f * (d.length - 1))]; return x == null ? null : +x.toFixed(1) })
      return { lamp: k, px: d.length, carCoveredFrac: occ ? +(cov.filter(Boolean).length / Math.max(1, cov.length)).toFixed(3) : null, onScreen: a.ok && e.ok, a: [Math.round(a.x), Math.round(a.y), a.ok], e: [Math.round(e.x), Math.round(e.y), e.ok], camY: +cam.position.y.toFixed(2), carY: +b.origin.y.toFixed(2), fracAbove: +(ok / Math.max(1, d.length)).toFixed(3), maxGapFrac: +(maxRun / Math.max(1, d.length)).toFixed(3), minDelta: +Math.min(...d.filter((x) => x != null)).toFixed(1), meanDelta: +(d.filter((x) => x != null).reduce((s, x) => s + x, 0) / Math.max(1, valid)).toFixed(1), along: q, pass: thr ? ok / d.length >= 0.95 && maxRun / d.length <= 0.05 : null } })
    res.push({ hideCar: !!v.hideCar, lamps: lampRes }) }
  M.freeze(false); return res }, { thr, variants })

const VARIANTS = DIAG ? [{}, { hideCar: true }] : [{}]
for (const tod of TODS) { const [th, thr] = TH[tod]
  const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const page = await (await browser.newContext({ viewport: VP })).newPage(); page.on('pageerror', (e) => console.log('err', e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + th + ',racer=' + RAC[0]); await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  await page.mouse.click(800, 450); await page.waitForTimeout(2000)
  const start = await page.evaluate(() => { const c = window.__kfbM2.car(), p = c.pos(); return { x: p.x, z: p.z, yaw: c.yaw?.() ?? 0 } })
  for (const id of RAC) {
    await page.evaluate(async (id) => { const M = window.__kfbM2; if (M.stats.modelId !== id) M.setRacer(id); await new Promise((res) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id && M.headlights.inst ? res() : setTimeout(w, 50)); w() }) }, id)
    const R = (out.results[id] ||= {})
    for (const [vn, pose] of Object.entries(VIEWS)) {
      await page.evaluate((s) => { const M = window.__kfbM2; M.camPose(null); M.setKind('k2b', { p: [s.x, M.ground(s.x, s.z) + 1.5, s.z], yaw: s.yaw }) }, start); await page.waitForTimeout(2200)
      await page.evaluate((p) => window.__kfbM2.camPose(p), pose); await page.waitForTimeout(900)
      R[`${vn}-${tod}`] = await measure(page, thr, VARIANTS); console.log(id, vn, tod, JSON.stringify(R[`${vn}-${tod}`].map((v) => ({ hideCar: v.hideCar, l: v.lamps.map((l) => ({ ok: l.fracAbove, gap: l.maxGapFrac, pass: l.pass, px: l.px, covered: l.carCoveredFrac, along: l.along })) }))))
    }
    if (tod === 'nacht') { // 3 s Fahrt in der Spielkamera, je ~0,5 s eine Messung
      await page.evaluate((s) => { const M = window.__kfbM2; M.camPose(null); M.setKind('k2b', { p: [s.x, M.ground(s.x, s.z) + 1.5, s.z], yaw: s.yaw }) }, start); await page.waitForTimeout(2200)
      await page.keyboard.down('KeyW'); const drive = []
      for (let k = 0; k < 6; k++) { await page.waitForTimeout(500); drive.push((await measure(page, thr, [{}]))[0]) }
      await page.keyboard.up('KeyW'); R['fahrt-nacht'] = drive; console.log(id, 'fahrt', JSON.stringify(drive.map((v) => v.lamps.map((l) => [l.fracAbove, l.maxGapFrac, l.pass]))))
    }
  }
  await browser.close() }
if (process.env.HB_OUT) fs.writeFileSync(process.env.HB_OUT, JSON.stringify(out, null, 1))
