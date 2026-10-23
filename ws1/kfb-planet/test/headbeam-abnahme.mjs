// Abnahme Scheinwerfer-Kegel (Georg 22.10., Konzept nach HEADLIGHTS_RESEARCH_R1, hlt=cone): alt = v2 (Standard), neu = cone – im selben Moment, gleiche Kamera
// (HEADLIGHT_TUNE.mode zur Laufzeit + HEADLIGHTS.rebuild, Antrieb eingefroren). Einzelbilder 1600×900 @2 (= 3200×1800), JPG 88, #debug,clean.
// Ablage ~/kfb-ws1/research/audits/abnahme/scheinwerfer4/<racer>-<fall>-<tag|gold|nacht>-<alt|neu>.jpg + index.json mit Prüfwerten:
//   Treffpunkt der Kegel-Unterkante (vom unteren Glasrand) mit dem Gelände ↔ Anfang der Kontaktfläche (50 % des weichen Rands, Shader-Formel 1:1 nachgerechnet), ±0,1 m
//   Kegel-Ende am Boden ↔ Fleck (F6), Lampenhöhe im Stand ↔ restH, Kegel hängt nicht nach (Lampe ↔ Kegel-Ursprung beim Zeichnen, 20 s Fahrt), Kosten je Wagen.
// Fälle: seite-nah, hinten-oben, draufsicht, vorn (eben), hang-auf, hang-ab, querhang, sprung-3, sprung-8. Tag und Gold nur seite-nah, hinten-oben, vorn.
// Nur mit Test-Slot. Aufruf: node test/headbeam-abnahme.mjs [racer,…]   HB_QUICK=1: nur neu, nur Nacht, @1 (Selbstprüfung)
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const QUICK = !!process.env.HB_QUICK
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/' + (process.env.HL_OUT || (QUICK ? 'scheinwerfer4-selbst' : 'scheinwerfer4'))); fs.mkdirSync(OUT, { recursive: true })
const RAC = (process.argv[2] || 'wasteland_beetle,brasswing_roadster,crimson_flame_dragster').split(',')
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0', VP = { width: 1600, height: 900 }, index = [], checks = {}
const MODES = QUICK ? [['neu', 'cone']] : [['alt', 'v2'], ['neu', 'cone']]
const TODS = QUICK ? [['nacht', ',tod=night']] : [['tag', ''], ['gold', ',tod=gold'], ['nacht', ',tod=night']]
const POSE = {
  'seite-nah': { dist: 10, yaw: 1.5, pitch: 0.14, ty: 0.4, ahead: 3.5 },
  'hinten-oben': { dist: 12, yaw: Math.PI, pitch: 0.62, ty: 0.3, ahead: 7 },
  draufsicht: { dist: 17, yaw: Math.PI, pitch: 1.42, ty: 0, ahead: 5.5 },
  vorn: { dist: 11, yaw: 0.45, pitch: 0.22, ty: 0.4, ahead: 1.5 },
  hang: { dist: 11, yaw: 1.5, pitch: 0.16, ty: 0.3, ahead: 4 },
  querhang: { dist: 12, yaw: Math.PI - 0.5, pitch: 0.45, ty: 0.3, ahead: 5 },
  sprung: { dist: 13, yaw: 1.5, pitch: 0.2, ty: -1, ahead: 4 },
}
const DAYCASES = ['seite-nah', 'hinten-oben', 'vorn']

async function open(extra) {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), errs = []
  const page = await (await browser.newContext({ viewport: VP, deviceScaleFactor: QUICK ? 1 : 2 })).newPage(); page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + extra + ',hlt=cone,racer=' + RAC[0]); await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  await page.addStyleTag({ content: '#m2-kind,#m2-keys{display:none!important}' }); await page.mouse.click(800, 450); await page.waitForTimeout(1500); return { browser, page, errs }
}
const swap = (page, id) => page.evaluate(async (id) => { const M = window.__kfbM2; if (M.stats.modelId !== id) M.setRacer(id); await new Promise((res) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id && M.headlights.inst ? res() : setTimeout(w, 50)); w() }) }, id)
const setMode = (page, mode) => page.evaluate((mode) => { window.__kfbM2.headlightTune.mode = mode; window.__kfbM2.headlights.rebuild?.() }, mode)
const shoot = async (page, id, fall, hash) => { const f = `${id}-${fall}.jpg`; await sharp(await page.screenshot()).jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, racer: id, fall, hash: BASE + hash + ',racer=' + id }); console.log('ok', f) }
const shootData = async (url, id, fall, hash) => { const f = `${id}-${fall}.jpg`; await sharp(Buffer.from(url.split(',')[1], 'base64')).flatten().jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, racer: id, fall, hash: BASE + hash + ',racer=' + id }); console.log('ok', f) }
const place = (page, at) => page.evaluate((s) => { const M = window.__kfbM2; M.freeze(false); M.camPose(null); M.setKind('k2b', s ? { p: [s.x, M.ground(s.x, s.z) + (s.lift ?? 1.5), s.z], yaw: s.yaw } : null) }, at)

// Prüfrechnung im Spiel (Szenen-Koordinaten = Welt): Unterkante der linken Lampe gegen das Gelände marschieren; Kontaktfläche = beam2-Formel aus kfb-groundfx 1:1
const measure = (page) => page.evaluate(() => {
  const M = window.__kfbM2, H = M.headlights, b = H.lastBeam, it = H.lastPools?.[0], g = M.ground; if (!b || !it) return null
  const V = (x, y, z) => ({ x, y, z }), add = (a, c, k = 1) => V(a.x + c.x * k, a.y + c.y * k, a.z + c.z * k), dot = (a, c) => a.x * c.x + a.y * c.y + a.z * c.z, sub = (a, c) => add(a, c, -1)
  const ax = b.axis, R = b.R, U = b.U, P = add(b.origin, R, b.half), hz = (() => { const l = Math.hypot(ax.x, ax.z); return V(ax.x / l, 0, ax.z / l) })()
  const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) }
  // Unterkante: P − U·r0 + t·(ax − U·tanV)
  const hzR = V(hz.z, 0, -hz.x); let edge = null, lat = 0
  for (let t = 0; t < b.len; t += 0.005) { const w = add(add(P, U, -(b.r0 + t * b.tanV)), ax, t); if (w.y <= g(w.x, w.z)) { const d = sub(w, P); edge = dot(d, hz); lat = dot(d, hzR); break } }
  const Q = add(P, hzR, lat)   // Messlinie: parallel zur Fahrtrichtung durch den Treffpunkt
  // Oberkante
  let top = null; for (let t = 0; t < b.len; t += 0.01) { const w = add(add(P, U, b.r0 + t * b.tanV), ax, t); if (w.y <= g(w.x, w.z)) { top = Math.hypot(w.x - P.x, w.z - P.z); break } }
  // Kontaktfläche entlang der Bodenlinie unter der Lampe (Ebene durch die Lampe und die Achse)
  const kAt = (wp) => { const L = sub(wp, b.origin), t = dot(L, ax); if (t <= 0 || t > b.len) return 0
    const rh = b.r0 + t * b.tanH, rv = b.r0 + t * b.tanV, v = dot(L, R), y = dot(L, U), s = 0.12 + 0.025 * t
    const k1 = ((q) => { const e = Math.max(Math.hypot(q[0], q[1]), 1e-4), m = (e - 1) / e * Math.hypot(q[0] * rh, q[1] * rv); return 1 - sm(-0.5 * s, 0.5 * s, m) })([(v - b.half) / rh, y / rv])
    const k2 = ((q) => { const e = Math.max(Math.hypot(q[0], q[1]), 1e-4), m = (e - 1) / e * Math.hypot(q[0] * rh, q[1] * rv); return 1 - sm(-0.5 * s, 0.5 * s, m) })([(v + b.half) / rh, y / rv])
    const c = k1 + k2; return (1 - Math.exp(-1.6 * c)) / (1 - Math.exp(-1.6)) * sm(0, 0.3, t) * (1 - sm(b.len * 0.6, b.len, t)) }
  let s50 = null, s10 = null, kmax = 0, prof = []
  for (let d = 0; d < b.len; d += 0.01) { const x = Q.x + hz.x * d, z = Q.z + hz.z * d, k = kAt(V(x, g(x, z), z)); kmax = Math.max(kmax, k); if (s10 == null && k >= 0.1) s10 = d; if (s50 == null && k >= 0.5) s50 = d; if (Math.abs(d * 100 % 50) < 1) prof.push([+d.toFixed(1), +k.toFixed(2)]) }
  // Mesh-Uniforms = dieselben Zahlen wie der Bodeneintrag?
  const Bu = H.inst.headbeam?.uniforms, same = !!Bu && Math.abs(Bu.uLen.value - it.len) < 1e-6 && Math.abs(Bu.uTanV.value - it.tanV) < 1e-6 && Math.abs(Bu.uR0.value - it.r0) < 1e-6 && Bu.uAx.value.distanceTo(it.dir) < 1e-6
  const hNow = P.y - g(P.x, P.z)
  return { restH: +b.h.toFixed(3), lampHeightNow: +hNow.toFixed(3), r0: +b.r0.toFixed(3), alphaDeg: +(b.alpha * 180 / Math.PI).toFixed(1), halfVDeg: +(Math.atan(b.tanV) * 180 / Math.PI).toFixed(1), halfHDeg: +(Math.atan(b.tanH) * 180 / Math.PI).toFixed(1), len: +b.len.toFixed(2),
    rollDeg: +(b.roll * 180 / Math.PI).toFixed(1), edgeHit: edge && +edge.toFixed(2), spotStart50: s50 && +s50.toFixed(2), spotStart10: s10 && +s10.toFixed(2), topHit: top && +top.toFixed(2), kmax: +kmax.toFixed(2),
    startDelta: edge != null && s50 != null ? +(s50 - edge).toFixed(3) : null, meshEqualsGround: same, profile: prof.slice(0, 40) }
})
// Hang suchen: Steigung sMin..sMax in Fahrtrichtung, quer flach (oder quer steil für querhang)
const findSpot = (page, kind) => page.evaluate((kind) => { const g = window.__kfbM2.ground, c = window.__kfbM2.car().pos(); let best = null
  for (let k = 0; k < 4000; k++) { const a = k * 2.399963, r = 6 + 140 * Math.sqrt(k / 4000), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r
    for (let j = 0; j < 8; j++) { const h = j * Math.PI / 4, sl = (g(x + Math.sin(h) * 10, z + Math.cos(h) * 10) - g(x, z)) / 10, side = (g(x + Math.cos(h) * 3, z - Math.sin(h) * 3) - g(x - Math.cos(h) * 3, z + Math.sin(h) * 3)) / 6
      const back = (g(x, z) - g(x - Math.sin(h) * 4, z - Math.cos(h) * 4)) / 4
      const ok = kind === 'auf' ? sl > 0.22 && sl < 0.38 && Math.abs(side) < 0.08 && back > 0.15 : kind === 'ab' ? sl < -0.18 && sl > -0.35 && Math.abs(side) < 0.08 && back < -0.1 : Math.abs(sl) < 0.06 && Math.abs(side) > 0.18 && Math.abs(side) < 0.3
      const score = kind === 'quer' ? Math.abs(Math.abs(side) - 0.24) : Math.abs(Math.abs(sl) - 0.28)
      if (ok && (!best || score < best.score)) best = { x, z, yaw: h, s: +sl.toFixed(2), side: +side.toFixed(2), score } } } return best }, kind)

const SPOTS = {}
for (const [tod, th] of TODS) {
  const { browser, page, errs } = await open(th)
  SPOTS.start ||= await page.evaluate(() => { const c = window.__kfbM2.car(), p = c.pos(); return { x: p.x, z: p.z, yaw: c.yaw?.() ?? 0 } })   // fester Startplatz (eben): nach der Fahrt nicht dort weitermachen, wo der Wagen stehen blieb
  if (!SPOTS.auf) for (const k of ['auf', 'ab', 'quer']) SPOTS[k] = await findSpot(page, k)
  for (const id of RAC) { await swap(page, id)
    const cases = [['seite-nah', null], ['hinten-oben', null], ['draufsicht', null], ['vorn', null], ['hang-auf', SPOTS.auf], ['hang-ab', SPOTS.ab], ['querhang', SPOTS.auf && { ...SPOTS.auf, yaw: SPOTS.auf.yaw + Math.PI / 2 }], ['sprung-3', { lift: 3 }], ['sprung-8', { lift: 8 }]]
    for (const [fall, spot] of cases) {
      if (tod !== 'nacht' && !DAYCASES.includes(fall)) continue
      if (fall.startsWith('hang') || fall === 'querhang') { if (!spot) { console.log('kein Hang', fall); continue } }
      const jump = fall.startsWith('sprung')
      if (jump) { // Sprung: Wagen über dem Boden absetzen, sofort einfrieren (Antrieb + Physik stehen bei freeze('rig')? – Höhe wird gemessen und ausgewiesen)
        await place(page, { ...SPOTS.start, lift: spot.lift + 0.6 })
      } else if (spot) { await place(page, { ...spot, lift: 0.9 }); await page.waitForTimeout(900) }   // am Hang kurz nach dem Aufsetzen (rollt sonst zurück und dreht sich quer)
      else { await place(page, SPOTS.start); await page.waitForTimeout(1500) }
      const pz = POSE[fall.startsWith('hang') ? 'hang' : jump ? 'sprung' : fall]
      await page.evaluate((p) => { window.__kfbM2.camPose(p); window.__kfbM2.freeze('rig') }, pz); await page.waitForTimeout(jump ? 30 : 800)
      // alt und neu im SELBEN Moment: ein Seiten-Rechenschritt, in dem nichts weiterläuft (Stufe wechseln, Scheinwerfer 40 Schritte einschwingen, zeichnen, Bild lesen)
      const shots = await page.evaluate((modes) => { const M = window.__kfbM2, H = M.headlights, gl = M.renderer(), cam = M.camera(), out = [], pr = gl.getPixelRatio(); gl.setPixelRatio(devicePixelRatio)   // echte 3200×1800 (das Spiel begrenzt die Pixeldichte)
        for (const mode of modes) { M.headlightTune.mode = mode; H.rebuild(); const hl = H.inst; for (let i = 0; i < 40; i++) hl.update(1 / 60, { daylight: H.lastDay, camera: cam })
          let root = hl.group; while (root.parent) root = root.parent; cam.updateMatrixWorld(); gl.render(root, cam); out.push(gl.domElement.toDataURL('image/png')) }
        gl.setPixelRatio(pr); return out }, MODES.map((m) => m[1]))
      if (tod === 'nacht') { const m = await measure(page); (checks[id] ||= {})[fall] = m; console.log(id, fall, JSON.stringify({ ...m, profile: undefined })) }
      for (let k = 0; k < MODES.length; k++) await shootData(shots[k], id, `${fall}-${tod}-${MODES[k][0]}`, th + ',hlt=' + MODES[k][1])
      await page.evaluate(() => { window.__kfbM2.freeze(false); window.__kfbM2.camPose(null) }) }
    if (tod === 'nacht') { // 20 s Fahrt: Kegel-Ursprung beim Zeichnen ↔ Lampe (kein Nachziehen), Bildzeiten, CPU-Zeit; danach Zeichenkosten Kegel + Kontaktfläche
      await setMode(page, 'cone'); await place(page, SPOTS.start); await page.waitForTimeout(1500)
      await page.keyboard.down('KeyW')
      const drive = await page.evaluate(async () => { const M = window.__kfbM2, H = M.headlights, hl = H.inst, B = hl.headbeam, sd = hl.sides[0]; let lagMax = 0, n = 0, last = performance.now(), fmax = 0, fsum = 0, fn = 0
        const wp = new (B.uniforms.uP.value[0].constructor)(), prev = B.mesh.onBeforeRender
        B.mesh.onBeforeRender = (...a) => { prev(...a); const sides = hl.sides, P = [0, 1].map((i) => sides[Math.min(i, sides.length - 1)].pos.clone()), car = sides[0].star.parent.parent
          car.updateWorldMatrix(true, false); const mid = P[0].add(P[1]).multiplyScalar(0.5); car.localToWorld(mid)
          const o = B.uniforms.uP.value[0].clone().add(B.uniforms.uP.value[1]).multiplyScalar(0.5); lagMax = Math.max(lagMax, o.distanceTo(mid)); n++ }
        H.ms = 0; H.n = 0; const t0 = performance.now()
        await new Promise((res) => { const f = () => { const t = performance.now(), d = t - last; last = t; if (fn > 5) { fmax = Math.max(fmax, d); fsum += d } fn++; if (t - t0 < 20000) requestAnimationFrame(f); else res() }; requestAnimationFrame(f) })
        B.mesh.onBeforeRender = prev; return { lagMaxM: +lagMax.toFixed(4), samples: n, frameAvgMs: +(fsum / (fn - 6)).toFixed(2), frameMaxMs: +fmax.toFixed(1), cpuMsPerFrame: +(H.ms / Math.max(1, H.n)).toFixed(4) } }).catch((e) => ({ err: String(e) }))
      await page.keyboard.up('KeyW'); await page.waitForTimeout(1500)
      checks[id] ||= {}; checks[id].fahrt20s = drive
      const gpuAt = []
      for (const pz of [POSE['hinten-oben'], POSE['seite-nah']]) { await place(page, SPOTS.start); await page.waitForTimeout(1500); await page.evaluate((p) => window.__kfbM2.camPose(p), pz); await page.waitForTimeout(800)
      gpuAt.push(await page.evaluate(() => { const M = window.__kfbM2, gl = M.renderer(), cam = M.camera(), ctx = gl.getContext(), px = new Uint8Array(4), H = M.headlights, hl = H.inst
        let root = hl.group; while (root.parent) root = root.parent
        const recv = [], all = []; root.traverse((o) => { if (o.isMesh || o.isSprite || o.isPoints || o.isLine) { all.push([o, o.visible]); if ([].concat(o.material).some((m) => m?.userData?.kfbGFX)) recv.push(o) } })
        const only = (list) => { for (const [o] of all) o.visible = false; for (const o of list) o.visible = true }, restore = () => { for (const [o, v] of all) o.visible = v }
        const time = (k) => { gl.render(root, cam); ctx.readPixels(0, 0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px); const t = performance.now(); for (let i = 0; i < k; i++) gl.render(root, cam); ctx.readPixels(0, 0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px); return (performance.now() - t) / k }
        // abwechselnd mit/ohne, Median der Differenzen (die Maschine ist geteilt, Einzelmessungen streuen um ±2 ms)
        const pairs = (a, b, n = 31) => { const d = []; for (let i = 0; i < n; i++) { a(); const x = time(30); b(); const y = time(30); d.push(x - y) } d.sort((p, q) => p - q); return { med: +d[n >> 1].toFixed(3), q1: +d[n >> 2].toFixed(3), q3: +d[(3 * n) >> 2].toFixed(3) } }
        M.freeze(true)
        const contact = pairs(() => { hl.setOn(true); only(recv) }, () => { hl.setOn(false); only(recv) })
        const mesh = pairs(() => { hl.setOn(true); only(recv.concat([hl.headbeam.mesh])) }, () => { hl.setOn(true); only(recv) })
        const total = pairs(() => { restore(); hl.setOn(true) }, () => { restore(); hl.setOn(false) })
        restore(); hl.setOn(true); M.freeze(false)
        return { contactMs: contact, meshMs: mesh, allWithGlassMs: total, viewport: innerWidth + 'x' + innerHeight + '@' + devicePixelRatio, drawCallsMesh: 1, groundfxSlots: H.lastPools?.length ?? 0 } })) }
      await page.evaluate(() => window.__kfbM2.camPose(null))
      const worst = (k) => gpuAt.reduce((a, g) => (g[k].med > a.med ? g[k] : a), gpuAt[0][k])
      const gpu = { ...gpuAt[0], contactMs: worst('contactMs'), meshMs: worst('meshMs'), allWithGlassMs: worst('allWithGlassMs'), views: ['hinten-oben', 'seite-nah'], perView: gpuAt }
      checks[id].gpu = gpu; console.log(id, 'fahrt', JSON.stringify(drive), 'gpu', JSON.stringify(gpu)) }
  }
  if (errs.length) { console.log('errs', errs.slice(0, 3)); checks.errs = errs.slice(0, 5) } await browser.close() }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: QUICK ? '1600x900@1' : '1600x900@2', quality: 88, source: 'kfb-planet ws1/vehicles-r1 test/headbeam-abnahme.mjs', ab: 'alt = v2 (Standard), neu = cone (hlt=cone)', spots: SPOTS, checks, items: index }, null, 1))
console.log('DONE headbeam-abnahme', index.length, 'Bilder →', OUT)
