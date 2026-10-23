// Scheinwerfer-Kegel Variante A (Georg 23.10., Lead; HEADLIGHTS_PHYSIK_R2): Kegel aus dem Lichtbild des Abblendlichts, Fleck 0,15 L … L, scharfe Grenze bei L.
// Kriterien G1–G6 gemessen (in index.json), Bilder im selben Rechenschritt (Versuch 2 = hlt=v2 / neu = hlt=cone), JPG 88, 3200×1800, nur im Test-Slot.
//   G1 Spielkamera eben Nacht: Linie Glasvorderkante → Fleck-Beginn (halbe Höhe der Oberkante über Grund), Kegel-Mesh an/aus; auf dem nicht vom Wagen
//      verdeckten Teil ≥ 10/255 auf ≥ 95 % (Lead 23.10.: Länge berichten statt fordern; zusätzlich bis L).
//   G2 eben: Formel 1:1 (beam2) entlang der Bodenlinie je Lampe: Beginn (10 % des Maximums) ≈ h/tan 12° ± 0,05 L, Maximum 0,5–0,7 L, Ende (50 %) L ± 0,05 L,
//      Kantenbreite (90 → 10 %) ≤ 0,08 L; dazu dieselben Werte aus dem Bild (Draufsicht, Fleck allein an/aus über HEADLIGHTS.groundK).
//   G3 Hang vorn bergauf: Beginn/Ende näher als eben (Formel + Bild); bergab ≥ 1 % / Kuppe: helles Ende fehlt; Querhang: Fleck schräg (linke/rechte Lampe verschieden).
//   G4 Seite nah, Draufsicht: Linie Glasvorderkante → Fleck-Anfang ≥ 10/255 auf ≥ 95 %, Lücke ≤ 5 % (je Lampe; abgewandte Lampe seitlich hinter dem Wagen ausgewiesen).
//   G5 20 s Fahrt mit Bremsen: Versatz Lampe ↔ Kegel beim Zeichnen 0, Fleck-Ende beim Bremsen näher, Bildsprünge des Fleck-Endes.
//   G6 Kosten Kontaktfläche + Kegel (abwechselnd an/aus, Median), 1 Draw Call, 1 groundfx-Platz.
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const QUICK = !!process.env.HB_QUICK, ONLY_HANG = process.env.HB_ONLY === 'hang', HANG2 = process.env.HB_ONLY === 'hang2', R2 = process.env.HB_ONLY === 'r2'   // nur Hang-Bilder neu (übrige index.json bleibt); hang2: offene Plätze, im Bild geprüft
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/' + (process.env.HL_OUT || (QUICK ? 'scheinwerfer5-quick' : 'scheinwerfer5'))); fs.mkdirSync(OUT, { recursive: true })   // Schnellmodus nie in die Abnahme-Ablage
const RAC = (process.argv[2] || 'wasteland_beetle,crimson_flame_dragster').split(',')
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0,hlt=cone', VP = { width: 1600, height: 900 }, index = [], checks = {}
// Lage der Spielkamera nachgestellt (gemessen eben: ≈ 7 m hinter, 5 m über dem Wagen) – vor dem Hang zieht die Folgekamera nach dem Versetzen nicht nach
const GAMECAM = { dist: 8.6, yaw: Math.PI, pitch: 0.62, ty: 0.4, ahead: 0 }
const POSE = { "seite-nah": { dist: 12, yaw: 1.5, pitch: 0.14, ty: 0.4, ahead: 6 }, draufsicht: { dist: 45, yaw: Math.PI, pitch: 1.42, ty: 0, ahead: 18 } }

// ---------- im Seitenkontext ----------
const PAGE_LIB = () => {
  const M = window.__kfbM2, H = M.headlights, g = M.ground
  const L = (a, i) => 0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2]
  const rootOf = () => { let r = H.inst.group; while (r.parent) r = r.parent; return r }
  const settle = () => { const cam = M.camera(); for (let i = 0; i < 40; i++) H.inst.update(1 / 60, { daylight: H.lastDay, camera: cam }) }
  const setMode = (m) => { if (M.headlightTune.mode !== m) { M.headlightTune.mode = m; H.rebuild() } settle() }
  const grab = () => { const gl = M.renderer(), ctx = gl.getContext(), W = ctx.drawingBufferWidth, Hh = ctx.drawingBufferHeight, a = new Uint8Array(W * Hh * 4); gl.render(rootOf(), M.camera()); ctx.readPixels(0, 0, W, Hh, ctx.RGBA, ctx.UNSIGNED_BYTE, a); return { a, W, Hh } }
  const proj = (v, W, Hh) => { const p = v.clone().project(M.camera()); return { x: (p.x * 0.5 + 0.5) * W, y: (p.y * 0.5 + 0.5) * Hh } }
  const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) }
  // beam2-Formel 1:1 (kfb-groundfx.v1.js) für einen Bodenpunkt
  const kAt = (b, wp) => { const Lv = wp.clone().sub(b.origin), t = Lv.dot(b.axis); if (t <= 0 || t > b.len) return 0
    const rh = b.r0 + t * b.tanH, rv = b.r0 + t * b.tanV, v = Lv.dot(b.R), y = Lv.dot(b.U), u = 0.5 * (y / rv + 1), yr = y / rv - 0.036 * sm(0, 1, v / (b.half + rh))
    const vert = sm(0, 0.06, u) * (0.3 + 0.7 * sm(0, 0.88, u)) * (1 - 0.75 * sm(0.88, 1, u)), sl = (dv) => { const qx = dv / (1.4 * rh), e = Math.hypot(qx, yr), w = qx * qx / Math.max(e * e, 1e-4); return 1 - sm(0.75 - 0.15 * w, 1, e) }
    const c = (sl(v - b.half) + sl(v + b.half)) * vert; return (1 - Math.exp(-1.6 * c)) / (1 - Math.exp(-1.6)) * sm(0, 0.3, t) * (1 - sm(b.len * 0.65, b.len, t)) }
  // Profil-Kennwerte entlang einer Folge (Abstand, Wert)
  const profile = (ds, ks) => { let kmax = 0, im = 0; ks.forEach((k, i) => { if (k > kmax) { kmax = k; im = i } }); if (kmax <= 0.02) return { empty: true, kmax: +kmax.toFixed(3) }
    const first = (f) => ds[ks.findIndex((k) => k >= f * kmax)], lastFrom = (f) => { let j = ks.length - 1; while (j > im && ks[j] < f * kmax) j--; return ds[j] }
    return { start: +first(0.1).toFixed(2), max: +ds[im].toFixed(2), end: +lastFrom(0.5).toFixed(2), edge: +(lastFrom(0.1) - lastFrom(0.9)).toFixed(2), kmax: +kmax.toFixed(3) } }
  const lampsOf = (b) => [1, -1].map((s) => b.origin.clone().addScaledVector(b.R, s * b.half))
  // G2/G3 Formel: Bodenlinie unter der Lampe in Fahrtrichtung
  const formulaProfiles = (plane) => { const b = H.lastBeam, hz = b.axis.clone().setY(0).normalize(); return lampsOf(b).map((P) => { const ds = [], ks = [], g0 = g(P.x, P.z)   // plane: ideale Ebene in Bodenhöhe unter der Lampe
    for (let d = 0; d <= b.len * 1.1; d += 0.02) { const x = P.x + hz.x * d, z = P.z + hz.z * d, w = new b.origin.constructor(x, plane ? g0 : g(x, z), z); ds.push(d); ks.push(kAt(b, w)) } return profile(ds, ks) }) }
  // Bild-Profil: Fleck allein an/aus (groundK), Bodenlinie unter der Lampe projiziert
  const imageProfiles = () => { const b = H.lastBeam, hz = b.axis.clone().setY(0).normalize(); H.groundK = 1; const on = grab(); H.groundK = 0; const off = grab(); H.groundK = 1
    return lampsOf(b).map((P) => { const ds = [], ks = []; for (let d = 0; d <= b.len * 1.1; d += 0.05) { const x = P.x + hz.x * d, z = P.z + hz.z * d, p = proj(new b.origin.constructor(x, g(x, z) + 0.02, z), on.W, on.Hh), xi = Math.round(p.x), yi = Math.round(p.y)
      if (xi < 0 || yi < 0 || xi >= on.W || yi >= on.Hh) continue; const j = (yi * on.W + xi) * 4; ds.push(d); ks.push(Math.max(0, L(on.a, j) - L(off.a, j))) } return profile(ds, ks) }) }
  // Linie A → E auf dem Bildschirm: Δ Kegel-Mesh an/aus, Wagenverdeckung ausgewiesen
  const lineDelta = (pairs, thr) => { const B = H.inst.headbeam, car = M.stats.rig?.stretch; B.mesh.visible = true; const on = grab(); B.mesh.visible = false; const off = grab(); if (car) car.visible = false; const nc = grab(); if (car) car.visible = true; B.mesh.visible = true
    return pairs.map(([A, E]) => { const a = proj(A, on.W, on.Hh), e = proj(E, on.W, on.Hh), n = Math.max(2, Math.round(Math.hypot(e.x - a.x, e.y - a.y))), vis = [], all = []; let sat = 0
      for (let i = 0; i <= n; i++) { const x = Math.round(a.x + (e.x - a.x) * i / n), y = Math.round(a.y + (e.y - a.y) * i / n); if (x < 0 || y < 0 || x >= on.W || y >= on.Hh) continue; const j = (y * on.W + x) * 4, d = L(on.a, j) - L(off.a, j), covered = Math.abs(L(off.a, j) - L(nc.a, j)) > 3; all.push(d); if (!covered) vis.push(d); if (Math.max(on.a[j], on.a[j + 1], on.a[j + 2]) >= 250) sat++ }
      const fr = (arr) => { const ok = arr.filter((x) => x >= thr).length; let run = 0, mr = 0; for (const x of arr) { if (x < thr) { run++; mr = Math.max(mr, run) } else run = 0 }
        const q = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((f) => (arr.length ? +arr[Math.round(f * (arr.length - 1))].toFixed(0) : null))
        return { px: arr.length, frac: +(ok / Math.max(1, arr.length)).toFixed(3), gap: +(mr / Math.max(1, arr.length)).toFixed(3), mean: +(arr.reduce((s, x) => s + x, 0) / Math.max(1, arr.length)).toFixed(1), along: q } }
      return { screenPx: n, scale: on.W / 1600, visible: fr(vis), all: fr(all), saturiert: +(sat / Math.max(1, n)).toFixed(3) } }) }
  // r2: Sprünge am Fleck-Ende (Licht an − aus entlang der Bodenlinie, Bildschirm-Pixel) und Rundung (Ende je Seitenabstand, Formel auf idealer Ebene)
  const endJumps = () => { const b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize(), hl = H.inst, car = M.stats.rig?.stretch; hl.setOn(true); const on = grab(); hl.setOn(false); const off = grab(); if (car) car.visible = false; const nc = grab(); if (car) car.visible = true; hl.setOn(true)
    return lampsOf(b).map((P) => { const pts = []; let last = null
      for (let d = 0.5 * gg.L; d <= 1.15 * gg.L; d += 0.02) { const x = P.x + hz.x * d, z = P.z + hz.z * d, p = proj(new b.origin.constructor(x, g(x, z) + 0.02, z), on.W, on.Hh), xi = Math.round(p.x), yi = Math.round(p.y)
        if (xi < 0 || yi < 0 || xi >= on.W || yi >= on.Hh || (last && last[0] === xi && last[1] === yi)) continue; last = [xi, yi]; const j = (yi * on.W + xi) * 4
        if (Math.abs(L(off.a, j) - L(nc.a, j)) > 3) { pts.length && pts.push(null); continue }   // vom Wagen verdeckt: Lücke, kein Vergleich darüber hinweg
        pts.push([d, L(on.a, j) - L(off.a, j), L(off.a, j)]) }
      let mx = 0, at = null, mxDark = 0; for (let i = 1; i < pts.length; i++) { if (!pts[i] || !pts[i - 1]) continue; const jmp = Math.abs(pts[i][1] - pts[i - 1][1]), albedo = Math.abs(pts[i][2] - pts[i - 1][2]); if (jmp > mx) { mx = jmp; at = pts[i][0] } if (albedo < 2) mxDark = Math.max(mxDark, jmp) }
      const vp = pts.filter(Boolean); return { px: vp.length, maxSprung: +mx.toFixed(1), beiM: at && +at.toFixed(1), maxSprungOhneGelaendekante: +mxDark.toFixed(1), profil: vp.filter((_, i) => i % Math.max(1, Math.floor(vp.length / 14)) === 0).map((q) => [+q[0].toFixed(1), +q[1].toFixed(0)]) } }) }
  const roundness = () => { const b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize(), side = b.R.clone().setY(0).normalize(), O = b.origin, g0 = g(O.x, O.z), W = b.half + (b.r0 + gg.len * b.tanH) * 1.4, out = []
    for (let s = -W; s <= W + 1e-6; s += W / 10) { let kmax = 0; const ks = []; for (let d = 0; d <= gg.len * 1.1; d += 0.05) { const w = O.clone().addScaledVector(hz, d).addScaledVector(side, s); w.y = g0; const k = kAt(b, w); ks.push([d, k]); kmax = Math.max(kmax, k) }
      let end = null; if (kmax > 0.02) for (let i = ks.length - 1; i >= 0; i--) if (ks[i][1] >= 0.5 * kmax) { end = +ks[i][0].toFixed(2); break } out.push([+s.toFixed(2), end]) }
    return { L: +gg.L.toFixed(2), endeJeSeite: out } }
  // Lichtform allein: Formel 1:1 auf idealer Ebene (Bodenhöhe unter der Lampe), auf die Bildschirm-Pixel der Kamera projiziert; skaliert auf das gemessene Maximum
  const designJumps = (scale255) => { const b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize(), cam = M.camera(), W = M.renderer().getContext().drawingBufferWidth, Hh = M.renderer().getContext().drawingBufferHeight
    return lampsOf(b).map((P) => { const g0 = g(P.x, P.z), px = new Map(); let kmax = 0
      for (let d = 0.4 * gg.L; d <= 1.1 * gg.L; d += 0.01) { const w = new b.origin.constructor(P.x + hz.x * d, g0, P.z + hz.z * d), k = kAt(b, w), p = w.clone().project(cam), key = Math.round((p.x * 0.5 + 0.5) * W) + ',' + Math.round((p.y * 0.5 + 0.5) * Hh); kmax = Math.max(kmax, k); if (!px.has(key)) px.set(key, [d, k]) }
      const arr = [...px.values()]; let mx = 0, at = null; for (let i = 1; i < arr.length; i++) { const j = Math.abs(arr[i][1] - arr[i - 1][1]) * scale255 / Math.max(kmax, 1e-4); if (j > mx) { mx = j; at = arr[i][0] } }
      return { px: arr.length, maxSprung: +mx.toFixed(1), beiM: at && +at.toFixed(1) } }) }
  window.__hb5 = { M, H, g, setMode, settle, grab, rootOf, formulaProfiles, imageProfiles, lineDelta, lampsOf, kAt, endJumps, roundness, designJumps }
}
const lib = (page) => page.evaluate(PAGE_LIB)
// Bilder im selben Rechenschritt: Zustände (v2 | cone) zeichnen
const shots = (page, states) => page.evaluate((states) => { const { M, setMode, rootOf } = window.__hb5, gl = M.renderer(), pr = gl.getPixelRatio(); gl.setPixelRatio(devicePixelRatio); M.camera().updateMatrixWorld(); M.freeze(true)
  const out = states.map((st) => { setMode(st); gl.render(rootOf(), M.camera()); return gl.domElement.toDataURL('image/png') }); setMode('cone'); M.freeze(false); gl.setPixelRatio(pr); return out }, states)
const save = async (url, id, fall, hash) => { const f = `${id}-${fall}.jpg`; await sharp(Buffer.from(url.split(',')[1], 'base64')).flatten().jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, racer: id, fall, hash: BASE + hash + ',racer=' + id }); console.log('ok', f) }
// Plätze: Hang vorn (eben am Wagen, steigt 3–15 m voraus um 5–15 %), bergab vorn (eben, fällt ≥ 1 %), Querhang (seitlich 15–25 %)
const findSpot = (page, kind) => page.evaluate((kind) => { const g = window.__kfbM2.ground, c = window.__kfbM2.car().pos(); let best = null
  for (let k = 0; k < 5000; k++) { const a = k * 2.399963, r = 6 + 150 * Math.sqrt(k / 5000), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r
    if ((kind === 'hang' || kind === 'bergab' || kind === 'eben2') && r < 45) continue   // Startbereich hat Kisten/Bauten, die die Spielkamera verdecken
    for (let j = 0; j < 8; j++) { const h = j * Math.PI / 4, fx = Math.sin(h), fz = Math.cos(h), at = (d) => g(x + fx * d, z + fz * d), side = (g(x + fz * 3, z - fx * 3) - g(x - fz * 3, z + fx * 3)) / 6
      const here = Math.abs(at(1.5) - at(-1.5)) / 3, ahead = (at(15) - at(3)) / 12
      // Sicht der Spielkamera (≈ 7 m hinter, 5 m über dem Wagen): kein Gelände zwischen Kamera und Wagen, hinten flach und frei (±4 m quer)
      let clear = true; for (let d = 0; d <= 9 && clear; d += 0.5) { const yLine = at(0) + 1.3 + (5 / 7) * d; for (const q of [-4, 0, 4]) if (g(x - fx * d + fz * q, z - fz * d - fx * q) > Math.min(yLine, at(0) + 1.0 + 0.1 * d) ) clear = false }
      let flat = kind === 'eben2'; if (flat) for (let d = 2; d <= 48 && flat; d += 2) for (const q of [-5, 0, 5]) if (Math.abs(g(x + fx * d + fz * q, z + fz * d - fx * q) - at(0)) > 0.012 * d + 0.08) flat = false   // eben bis über L hinaus, ohne Becken (See)
      if (kind === 'eben2') { if (flat && clear) { const c = { x, z, yaw: h, here: +here.toFixed(3), ahead: +ahead.toFixed(3), side: +side.toFixed(3), score: here + 0.001 * r }; ((window.__spots ||= {}).eben2 ||= []).push(c); if (!best || c.score < best.score) best = c } continue }
      const ok = kind === 'hang' ? clear && here < 0.03 && Math.abs(side) < 0.05 && ahead > 0.05 && ahead < 0.15 : kind === 'bergab' ? here < 0.02 && Math.abs(side) < 0.05 && ahead < -0.02 && ahead > -0.12 : Math.abs(ahead) < 0.04 && here < 0.05 && Math.abs(side) > 0.15 && Math.abs(side) < 0.25
      const score = kind === 'hang' ? Math.abs(ahead - 0.08) + here : kind === 'bergab' ? Math.abs(ahead + 0.05) + here : Math.abs(Math.abs(side) - 0.2)
      if (ok) { const c = { x, z, yaw: h, here: +here.toFixed(3), ahead: +ahead.toFixed(3), side: +side.toFixed(3), score }; (window.__spots ||= {})[kind] ||= []; window.__spots[kind].push(c); if (!best || score < best.score) best = c } } } return best }, kind)
const spotList = (page, kind, n) => page.evaluate(({ kind, n }) => (window.__spots?.[kind] || []).sort((a, b) => a.score - b.score).filter((c, i, arr) => arr.findIndex((d) => Math.hypot(d.x - c.x, d.z - c.z) < 25) === i).slice(0, n), { kind, n })

const SPOTS = {}
for (const [tod, th, thr] of (ONLY_HANG || HANG2 ? [['nacht', ',tod=night', 10]] : R2 ? [['nacht', ',tod=night', 10], ['gold', ',tod=gold', 6]] : [['nacht', ',tod=night', 10], ['gold', ',tod=gold', 6]])) {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const page = await (await browser.newContext({ viewport: VP, deviceScaleFactor: QUICK ? 1 : 2 })).newPage(); page.on('pageerror', (e) => console.log('err', e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + th + ',racer=' + RAC[0]); await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  await page.mouse.click(800, 450); await page.waitForTimeout(2000); await lib(page)
  SPOTS.eben ||= await page.evaluate(() => { const c = window.__kfbM2.car(), p = c.pos(); return { x: p.x, z: p.z, yaw: c.yaw?.() ?? 0 } })
  if (tod === 'nacht') for (const k of ['hang', 'bergab', 'quer']) SPOTS[k] ||= await findSpot(page, k)
  if (R2) SPOTS.eben2 ||= await findSpot(page, 'eben2')
  const place = async (s, wait = 2200) => { await page.evaluate((s) => { const M = window.__kfbM2; M.camPose(null); M.setKind('k2b', { p: [s.x, M.ground(s.x, s.z) + 1.2, s.z], yaw: s.yaw }) }, s); await page.waitForTimeout(wait) }
  const cam = (p) => page.evaluate((p) => window.__kfbM2.camPose(p), p).then(() => page.waitForTimeout(900))
  for (const id of RAC) {
    await page.evaluate(async (id) => { const M = window.__kfbM2; if (M.stats.modelId !== id) M.setRacer(id); await new Promise((res) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id && M.headlights.inst ? res() : setTimeout(w, 50)); w() }) }, id)
    await page.evaluate(() => window.__hb5.setMode('cone')); const C = (checks[id] ||= {}); C.geometry ||= await page.evaluate(() => { const gg = window.__kfbM2.headlights.inst.coneGeo, D = 180 / Math.PI; return { h: +gg.h.toFixed(3), r0: +gg.r0.toFixed(3), L: +gg.L.toFixed(2), neigungDeg: +(gg.alpha * D).toFixed(2), halbSenkrechtDeg: +(Math.atan(gg.tanV) * D).toFixed(2), oberkanteDeg: +((gg.alpha - Math.atan(gg.tanV)) * D).toFixed(2), unterkanteDeg: +((gg.alpha + Math.atan(gg.tanV)) * D).toFixed(2), seitlichDeg: +(Math.atan(gg.tanH) * D).toFixed(1), flachBeginn: +gg.startFlat.toFixed(2), flachEnde: +gg.endFlat.toFixed(2), kegelLaenge: +gg.len.toFixed(2) } })
    if (R2) { const C2 = ((checks[id] ||= {}).r2 ||= {})
      // ebener Platz ohne Requisiten im Lichtweg: Kandidaten im Bild prüfen (Fleck zwischen 0,3 und 0,6 L aus der Spielkamera sichtbar beleuchtet)
      if (!SPOTS.eben2ok) { for (const c of await spotList(page, 'eben2', 25)) { await place(c, 2600); await cam(GAMECAM)
          const ok = await page.evaluate(() => { const { H, g, grab, lampsOf } = window.__hb5, b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize(), hl = H.inst, M = window.__kfbM2, cam = M.camera()
            hl.setOn(true); const on = grab(); hl.setOn(false); const off = grab(); hl.setOn(true); let n = 0, lit = 0, n2 = 0, free = 0
            // nur Gelände zeichnen (alles andere aus): wo sich das Bild ohne Licht unterscheidet, verdeckt ein Objekt den Boden
            let root = hl.group; while (root.parent) root = root.parent; const vis = []; root.children.forEach((c) => { vis.push([c, c.visible]); if (c.name !== 'm1-terrain') c.visible = false })
            hl.setOn(false); const terr = grab(); vis.forEach(([c, v]) => (c.visible = v)); hl.setOn(true)
            for (const P of lampsOf(b)) for (let d = 0.3 * gg.L; d <= 1.05 * gg.L; d += 0.5) { const x = P.x + hz.x * d, z = P.z + hz.z * d, p = new b.origin.constructor(x, g(x, z) + 0.02, z).project(cam), xi = Math.round((p.x * 0.5 + 0.5) * on.W), yi = Math.round((p.y * 0.5 + 0.5) * on.Hh)
              if (xi < 0 || yi < 0 || xi >= on.W || yi >= on.Hh) continue; const j = (yi * on.W + xi) * 4
              if (d <= 0.6 * gg.L) { n++; if (on.a[j] + on.a[j + 1] + on.a[j + 2] - off.a[j] - off.a[j + 1] - off.a[j + 2] > 60) lit++ }
              if (d >= 0.6 * gg.L) { n2++; if (Math.abs(off.a[j] - terr.a[j]) + Math.abs(off.a[j + 1] - terr.a[j + 1]) + Math.abs(off.a[j + 2] - terr.a[j + 2]) < 12) free++ } }
            return n > 10 && lit / n >= 0.9 && n2 > 6 && free / n2 >= 0.95 })
          console.log(id, 'eben2', c.x.toFixed(1), c.z.toFixed(1), ok); if (ok) { SPOTS.eben2ok = c; break } } }
      const E2 = SPOTS.eben2ok || SPOTS.eben; C2.platzEben = E2; await place(E2, 2600); await cam(GAMECAM); C2[`sprung-spielkamera-${tod}`] = await page.evaluate(() => window.__hb5.endJumps()); C2[`formelGelaende-${tod}`] = await page.evaluate(() => window.__hb5.formulaProfiles(false)); { const mxL = Math.max(...C2[`sprung-spielkamera-${tod}`].flatMap((l) => l.profil.map((q) => q[1]))); C2[`sprungLichtformEbene-${tod}`] = await page.evaluate((m) => window.__hb5.designJumps(m), mxL) }
      { const im = await shots(page, ['cone']); await save(im[0], id, `spielkamera-eben-${tod}-r2`, th) }
      if (tod === 'nacht') { C2.rundung = await page.evaluate(() => window.__hb5.roundness()); C2.G2 = { formulaPlane: await page.evaluate(() => window.__hb5.formulaProfiles(true)) }
        await place(E2, 2600); await cam(POSE.draufsicht); C2.draufsichtBild = await page.evaluate(() => window.__hb5.imageProfiles()); { const im = await shots(page, ['cone']); await save(im[0], id, `draufsicht-eben-${tod}-r2`, th) }
        const hs = process.env.HB_HANGSPOT.split(',').map(Number); await place({ x: hs[0], z: hs[1], yaw: hs[2] }, 1500); await cam(GAMECAM); { const im = await shots(page, ['v2', 'cone']); await save(im[0], id, `spielkamera-hang2-${tod}-versuch2-r2`, th + ',hlt=v2'); await save(im[1], id, `spielkamera-hang2-${tod}-r2`, th) }
        const bg = (await spotList(page, 'bergab', 12)).find((c) => Math.hypot(c.x - 12.5, c.z + 27.5) < 3) || (await spotList(page, 'bergab', 1))[0]; if (bg) { await place(bg, 1500); await cam(GAMECAM); const im = await shots(page, ['cone']); await save(im[0], id, `spielkamera-bergab-hang2-${tod}-r2`, th) } }
      console.log(id, tod, 'r2', JSON.stringify(C2).slice(0, 1500)); continue }
    if (HANG2) { // offene Plätze: Kandidaten der Reihe nach, angenommen wenn der Strahl aus der Spielkamera-Lage unverdeckt sichtbar ist
      for (const [kind, states, tag] of [['hang', ['v2', 'cone'], 'hang2'], ['bergab', ['cone'], 'bergab-hang2']].filter(([k]) => !process.env.HB_KINDS || process.env.HB_KINDS.split(',').includes(k))) { let done = false
        const forced = kind === 'hang' && process.env.HB_HANGSPOT ? [Object.fromEntries(['x', 'z', 'yaw', 'ahead'].map((k, i) => [k, +process.env.HB_HANGSPOT.split(',')[i]]))] : null   // gemeinsamer offener Platz für alle Wagen
        for (const c of forced || await spotList(page, kind, 12)) { await place(c, 1500); await cam(GAMECAM)
          const v = await page.evaluate((thr) => { const { H, g, lineDelta, lampsOf } = window.__hb5, b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize()
            return lineDelta(lampsOf(b).map((P) => { const q = P.clone().addScaledVector(hz, 0.5 * gg.L), gy = g(q.x, q.z); q.y = gy + 0.5 * Math.max(0.2, P.y + b.r0 - Math.tan(gg.alpha - Math.atan(gg.tanV)) * 0.5 * gg.L - gy); return [P.clone().addScaledVector(b.axis, b.r0), q] }), thr) }, thr)
          const okv = v.every((l) => l.visible.px / l.scale >= 60 && l.visible.frac >= 0.9); console.log(id, kind, c.x.toFixed(1), c.z.toFixed(1), okv, v.map((l) => [Math.round(l.visible.px / l.scale), l.visible.frac]))
          if (!okv) continue
          const im = await shots(page, states); for (let k = 0; k < states.length; k++) await save(im[k], id, `spielkamera-${tag}-${tod}-${states[k] === 'v2' ? 'versuch2' : 'neu'}`, th + ',hlt=' + states[k])
          ;(checks[id] ||= {})[`platz-${tag}`] = { x: +c.x.toFixed(2), z: +c.z.toFixed(2), yaw: c.yaw, steigungVorn: c.ahead, sichtbarkeit: v.map((l) => ({ px1600: Math.round(l.visible.px / l.scale), frac: l.visible.frac })), formula: await page.evaluate(() => window.__hb5.formulaProfiles(false)) }; done = true; break }
        if (!done) console.log(id, kind, 'kein offener Platz gefunden') }
      continue }
    if (ONLY_HANG) { const s = SPOTS.hang; await place(s, 1500); await page.waitForTimeout(1500); await cam(GAMECAM); const im = await shots(page, ['v2', 'cone']); await save(im[0], id, `spielkamera-hang-${tod}-versuch2`, th + ',hlt=v2'); await save(im[1], id, `spielkamera-hang-${tod}-neu`, th); continue }
    // --- Spielkamera eben
    await place(SPOTS.eben); await cam(null)
    if (tod === 'nacht') { C.G1 = await page.evaluate((thr) => { const { H, g, lineDelta, lampsOf } = window.__hb5, b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize()
        const pairs = lampsOf(b).map((P) => { const A = P.clone().addScaledVector(b.axis, b.r0), q = P.clone().addScaledVector(hz, gg.startFlat), gy = g(q.x, q.z), topY = P.y + b.r0 - Math.tan(gg.alpha - Math.atan(gg.tanV)) * gg.startFlat; q.y = gy + 0.5 * Math.max(0, topY - gy); return [A, q] })   // Lead 23.10.: Strahl hinter der Wagen-Silhouette bis zum Fleck(-Beginn)
        const air = (f) => lampsOf(b).map((P) => { const A = P.clone().addScaledVector(b.axis, b.r0), q = P.clone().addScaledVector(hz, f * gg.L), gy = g(q.x, q.z); q.y = gy + 0.5 * Math.max(0, P.y + b.r0 - Math.tan(gg.alpha - Math.atan(gg.tanV)) * f * gg.L - gy); return [A, q] })
        const pairsL = air(0.5), pairs75 = air(0.75)
        const rS = lineDelta(pairs, thr).map((r) => ({ ...r, sichtbarPx1600: Math.round(r.visible.px / r.scale), pass: r.visible.frac >= 0.95 })), rL = lineDelta(pairsL, thr).map((r) => ({ ...r, sichtbarPx1600: Math.round(r.visible.px / r.scale), pass: r.visible.frac >= 0.95 })), r75 = lineDelta(pairs75, thr).map((r) => ({ ...r, sichtbarPx1600: Math.round(r.visible.px / r.scale), pass: r.visible.frac >= 0.95 }))
        return { bisFleckBeginn: rS, bis05L: rL, bis075L: r75 } }, thr)
      C.G2 = { formulaPlane: await page.evaluate(() => window.__hb5.formulaProfiles(true)), formulaTerrain: await page.evaluate(() => window.__hb5.formulaProfiles(false)), L: C.geometry.L }
      const Lr = C.geometry.L, fp = C.G2.formulaPlane; const S0 = C.geometry.flachBeginn; C.G2.soll = { beginn: S0, max: [+(0.5 * Lr).toFixed(1), +(0.7 * Lr).toFixed(1)], ende: Lr, kanteMax: +(0.08 * Lr).toFixed(2) }; C.G2.pass = fp.every((p) => !p.empty && Math.abs(p.start - S0) <= 0.05 * Lr && p.max >= 0.5 * Lr && p.max <= 0.7 * Lr && Math.abs(p.end - Lr) <= 0.05 * Lr && p.edge <= 0.08 * Lr)
      console.log(id, 'G1', JSON.stringify(C.G1), 'G2', JSON.stringify(C.G2)) }
    if (!QUICK) { const st = tod === 'nacht' ? ['v2', 'cone'] : ['cone'], im = await shots(page, st); for (let k = 0; k < st.length; k++) await save(im[k], id, `spielkamera-eben-${tod}-${st[k] === 'v2' ? 'versuch2' : 'neu'}`, th + ',hlt=' + st[k]) }
    if (tod !== 'nacht') { C[`G1-${tod}`] = await page.evaluate((thr) => { const { H, lineDelta, lampsOf, g } = window.__hb5, b = H.lastBeam, gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize()
        return lineDelta(lampsOf(b).map((P) => { const q = P.clone().addScaledVector(hz, 0.5 * gg.L), gy = g(q.x, q.z); q.y = gy + 0.5 * Math.max(0, P.y + b.r0 - Math.tan(gg.alpha - Math.atan(gg.tanV)) * 0.5 * gg.L - gy); return [P.clone().addScaledVector(b.axis, b.r0), q] }), thr) }, thr); continue }
    // --- G2 Bild (Draufsicht), G4 Seite nah + Draufsicht
    for (const v of ['draufsicht', 'seite-nah']) { await place(SPOTS.eben); await cam(POSE[v])
      if (v === 'draufsicht') C.G2.image = await page.evaluate(() => window.__hb5.imageProfiles())
      C[`G4-${v}`] = await page.evaluate((thr) => { const { H, g, lineDelta, lampsOf } = window.__hb5, b = H.lastBeam
        // Linie im Kegel: Glasvorderkante → Punkt bei 0,15 L (Fleck-Beginn) auf halber Höhe der Oberkante über Grund (die Unterkante selbst ist die Volumengrenze)
        const gg = H.inst.coneGeo, hz = b.axis.clone().setY(0).normalize(), dep = gg.alpha - Math.atan(gg.tanV)
        return lineDelta(lampsOf(b).map((P) => { const A = P.clone().addScaledVector(b.axis, b.r0), q = P.clone().addScaledVector(hz, 0.15 * gg.L), gy = g(q.x, q.z); q.y = gy + 0.5 * Math.max(0, P.y + b.r0 - Math.tan(dep) * 0.15 * gg.L - gy); return [A, q] }), thr).map((r) => ({ ...r, pass: r.visible.frac >= 0.95 && r.visible.gap <= 0.05, passMitVerdeckung: r.all.frac >= 0.95 && r.all.gap <= 0.05 })) }, thr)
      if (v === 'seite-nah' && !QUICK) { const im = await shots(page, ['cone']); await save(im[0], id, `seite-nah-eben-${tod}-neu`, th) } }
    console.log(id, 'G2i', JSON.stringify(C.G2.image), 'G4', JSON.stringify([C['G4-seite-nah'], C['G4-draufsicht']].map((x) => x.map((l) => ({ vis: [l.visible.px, l.visible.frac, l.visible.gap, l.visible.along], all: [l.all.frac, l.all.gap], pass: l.pass })))))
    // --- G3 Hang vorn / bergab / Querhang
    C.G3 = {}
    for (const k of ['hang', 'bergab', 'quer']) { const s = SPOTS[k]; if (!s) { C.G3[k] = { noSpot: true }; continue } await place(s, 1500)
      C.G3[k] = { spot: { here: s.here, ahead: s.ahead, side: s.side }, formula: await page.evaluate(() => window.__hb5.formulaProfiles(false)), roll: await page.evaluate(() => +(window.__kfbM2.headlights.lastBeam.roll * 57.3).toFixed(1)) }
      if (k === 'hang') { await cam(GAMECAM); if (!QUICK) { const im = await shots(page, ['v2', 'cone']); await save(im[0], id, `spielkamera-hang-${tod}-versuch2`, th + ',hlt=v2'); await save(im[1], id, `spielkamera-hang-${tod}-neu`, th) }
        await cam(POSE.draufsicht); C.G3[k].image = await page.evaluate(() => window.__hb5.imageProfiles()) } }
    console.log(id, 'G3', JSON.stringify(C.G3))
    // --- G5 20 s Fahrt mit Bremsen
    await place(SPOTS.eben); await cam(null)
    const drv = page.evaluate(async () => { const { H, M } = window.__hb5, hl = H.inst, B = hl.headbeam; let lag = 0, n = 0; const ends = [], prev = B.mesh.onBeforeRender
      B.mesh.onBeforeRender = (...a) => { prev(...a); const sides = hl.sides, car = sides[0].star.parent.parent; car.updateWorldMatrix(true, false); const mid = sides[0].pos.clone().add((sides[1] || sides[0]).pos).multiplyScalar(0.5); car.localToWorld(mid)
        const o = B.uniforms.uP.value[0].clone().add(B.uniforms.uP.value[1]).multiplyScalar(0.5); lag = Math.max(lag, o.distanceTo(mid)); n++
        let ch = car; while (ch && ch.name !== 'vehicle-rig') ch = ch.parent; ch = ch?.parent; const b = H.lastBeam
        if (ch) { const f = new b.axis.constructor(0, 0, 1), qb = new B.mesh.quaternion.constructor(); ch.getWorldQuaternion(qb); f.applyQuaternion(qb); const up = new b.axis.constructor(0, 1, 0).applyQuaternion(qb)
          const dep = Math.atan2(-b.axis.dot(up), b.axis.dot(f)) - Math.atan(b.tanV); ends.push([performance.now(), dep]) } }   // Neigung der Grenze unter der Fahrzeugebene (Physik-Körper)
      await new Promise((r) => setTimeout(r, 20000)); B.mesh.onBeforeRender = prev; return { lagMaxM: +lag.toFixed(4), samples: n, ends } })
    await page.keyboard.down('KeyW'); await page.waitForTimeout(6000); await page.keyboard.up('KeyW'); await page.keyboard.down('KeyS'); await page.waitForTimeout(1500); await page.keyboard.up('KeyS')
    await page.keyboard.down('KeyW'); await page.waitForTimeout(6000); await page.keyboard.up('KeyW'); await page.keyboard.down('KeyS'); await page.waitForTimeout(1500); await page.keyboard.up('KeyS'); await page.waitForTimeout(5500)
    const dr = await drv, hgt = C.geometry.h, deg = dr.ends.map((e) => e[1] * 57.2958), jumps = []
    for (let i = 1; i < deg.length; i++) jumps.push(Math.abs(deg[i] - deg[i - 1]))
    const srt = deg.slice().sort((a, b) => a - b), dAt = (dg) => (dg > 0.3 ? +(hgt / Math.tan(dg / 57.2958)).toFixed(1) : 'über dem Horizont')
    C.G5 = { lagMaxM: dr.lagMaxM, samples: dr.samples, grenzeDeg: { min: +srt[0].toFixed(2), median: +srt[srt.length >> 1].toFixed(2), max: +srt[srt.length - 1].toFixed(2) }, grenzeEbenM: { beimBremsen: dAt(srt[srt.length - 1]), median: dAt(srt[srt.length >> 1]), beimBeschleunigen: dAt(srt[0]) }, maxSprungJeBildDeg: +Math.max(...jumps).toFixed(3), note: 'Neigung der Hell-Dunkel-Grenze unter der Fahrzeugebene des Physik-Körpers (Soll 2°, ± 30 % Cartoon-Nicken); daraus Abstand auf ebenem Boden unter dem Wagen' }
    console.log(id, 'G5', JSON.stringify(C.G5))
    // --- G6 Kosten (Spielkamera, eben)
    await place(SPOTS.eben); await cam(null)
    C.G6 = await page.evaluate(() => { const { M, H, rootOf } = window.__hb5, gl = M.renderer(), cam = M.camera(), ctx = gl.getContext(), px = new Uint8Array(4), hl = H.inst, root = rootOf()
      const recv = [], all = []; root.traverse((o) => { if (o.isMesh || o.isSprite || o.isPoints || o.isLine) { all.push([o, o.visible]); if ([].concat(o.material).some((m) => m?.userData?.kfbGFX)) recv.push(o) } })
      const only = (list) => { for (const [o] of all) o.visible = false; for (const o of list) o.visible = true }, restore = () => { for (const [o, v] of all) o.visible = v }
      const time = (k) => { gl.render(root, cam); ctx.readPixels(0, 0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px); const t = performance.now(); for (let i = 0; i < k; i++) gl.render(root, cam); ctx.readPixels(0, 0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px); return (performance.now() - t) / k }
      const pairs = (a, b, n = 31) => { const d = []; for (let i = 0; i < n; i++) { a(); const x = time(30); b(); const y = time(30); d.push(x - y) } d.sort((p, q) => p - q); return { med: +d[n >> 1].toFixed(3), q1: +d[n >> 2].toFixed(3), q3: +d[(3 * n) >> 2].toFixed(3) } }
      M.freeze(true); const contact = pairs(() => { hl.setOn(true); only(recv) }, () => { hl.setOn(false); only(recv) }), mesh = pairs(() => { hl.setOn(true); only(recv.concat([hl.headbeam.mesh])) }, () => { hl.setOn(true); only(recv) })
      restore(); hl.setOn(true); M.freeze(false); return { contactMs: contact, meshMs: mesh, cpuMs: +(H.ms / Math.max(1, H.n)).toFixed(4), viewport: innerWidth + 'x' + innerHeight + '@' + devicePixelRatio, drawCallsMesh: 1, groundfxSlots: H.lastPools?.length ?? 0 } })
    console.log(id, 'G6', JSON.stringify(C.G6))
  }
  await browser.close() }
if (R2) { const F = path.join(OUT, 'index.json'), J = JSON.parse(fs.readFileSync(F, 'utf8')); J.items = J.items.filter((i) => !index.some((n) => n.file === i.file)).concat(index); for (const [r, v] of Object.entries(checks)) Object.assign((J.checks[r] ||= {}), v); J.r2 = { date: new Date().toISOString(), aenderung: 'Georg 23.10.: Ende rund und weich – elliptischer Querschnitt für Fleck und Lichtvolumen, beide blenden über die letzten 30 % der Länge aus (vorher gerade Hell-Dunkel-Kante)' }; fs.writeFileSync(F, JSON.stringify(J, null, 1)); console.log('DONE r2', index.length); process.exit(0) }
if (HANG2) { const F = path.join(OUT, 'index.json'), J = JSON.parse(fs.readFileSync(F, 'utf8')); J.items = J.items.filter((i) => !index.some((n) => n.file === i.file)).concat(index); for (const [r, v] of Object.entries(checks)) Object.assign((J.checks[r] ||= {}), v); J.hang2 = { date: new Date().toISOString(), kamera: 'Spielkamera-Lage nachgestellt (camPose dist 8,6 / pitch 0,62), Platz ≥ 45 m vom Start, angenommen nur bei unverdecktem Strahl (≥ 60 px, ≥ 90 %)' }; fs.writeFileSync(F, JSON.stringify(J, null, 1)); console.log('DONE hang2', index.length); process.exit(0) }
if (ONLY_HANG) { const F = path.join(OUT, 'index.json'), J = JSON.parse(fs.readFileSync(F, 'utf8')); J.items = J.items.filter((i) => !/spielkamera-hang/.test(i.file)).concat(index); J.hangNeu = new Date().toISOString(); J.hangKamera = 'Spielkamera-Lage nachgestellt (camPose dist 8,6 / pitch 0,62, wie eben gemessen), weil die Folgekamera nach dem Versetzen vor dem Hang nicht nachzieht'; fs.writeFileSync(F, JSON.stringify(J, null, 1)); console.log('DONE hang', index.length); process.exit(0) }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: QUICK ? '1600x900@1' : '3200x1800', quality: 88, source: 'kfb-planet ws1/vehicles-r1 test/headbeam5-abnahme.mjs', ab: 'versuch2 = hlt=v2, neu = hlt=cone (Variante A nach Winkeln: Grenze 2°, Unterkante 12°, L = h/tan 2° ≤ 45 m; Richtung Physik + 30 % Deformer)', spots: SPOTS, checks, items: index }, null, 1))
console.log('DONE headbeam5', index.length, 'Bilder →', OUT)
