// Staubfahne (dust3=1) · Messung der Kriterien K1–K6 des Leads (23.10.), alles aus dem Bildpuffer wie auf dem Bildschirm (Pixeldichte 2).
// Fahrt: flache Linie durch die Probe-Welt, gerade → Drift links → gerade → Drift rechts → loslassen → stehen; dann Neustart per Teleport.
// K1 Deckung (Deckungs-Durchgang: Szene schwarz zur Verdeckung, Staub weiß mit seiner Deckkraft) entlang der GEFAHRENEN Bahn 0,5–6,5 m hinter dem Heck,
//    aus der Spielkamera und von oben; K3 Bildschirmgröße (Shader-Formel) und Rand; K4 Kontrast Tag/Nacht (mit/ohne Staub im selben Moment);
// K5 GPU an/aus abwechselnd (Spielkamera, Kamera mitten in der Fahne) + CPU je Bild; K6 Stehen (kein neuer Staub, Fahne vergeht) und Neustart
// (keine Partikel entlang des Sprungs). Pool-Belegung und Überschreiben. Aufruf: node test/dustTrail.mjs <day|night> [alt]. Bericht test/out/dust-trail-<tod>.json
import fs from 'fs'
import { openPage } from './_page.mjs'
const TOD = process.argv[2] || 'day', ALT = process.argv[3] === 'alt', S = { x: -127.5, z: 12.6, yaw: Math.PI / 2 - 0.26 }
// Welt: Biom-Fahrt, flache Wüstenlinie (die Probe-Welt hat überall Hügel und Seen – der Wagen flog bzw. fuhr ins Wasser, kein Staub; Georgs Vorlage: Sandwüste)
const WORLD = process.env.WORLD || 'endless'
const { browser, page, errs } = await openPage('#m1,debug,clean,car,look=terrain3,world=' + WORLD + ',mute,drivepanel=0,tod=' + TOD + (WORLD === 'endless' ? ',hour=' + (TOD === 'night' ? '0.5' : '13') : '') + (ALT ? ',dust3=0' : ',dust3=1'), { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
page.on('console', (m) => { if (/Shader Error|VALIDATE_STATUS/.test(m.text())) errs.push('shader') })
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbM1?.scene?.()?.getObjectByName('vehicle-rig-dust'), null, { timeout: 180000 }); await page.waitForTimeout(3000)
if (WORLD === 'endless') { await page.waitForFunction(() => window.__kfbDrive?.veg?.()?.info?.().ready, null, { timeout: 180000 })
  const route = await page.evaluate(() => { const T = window.__kfbDrive.terrain(), F = T.field
    for (let k = 0; k < 6000; k++) { const a = k * 2.399963, r = 200 + 4000 * Math.sqrt(k / 6000), x = Math.cos(a) * r, z = Math.sin(a) * r, h = (k * 0.73) % (Math.PI * 2)
      if (F.dominant(x, z).key !== 'wueste' || F.dominant(x, z).w < 0.95) continue; let ok = true
      for (let d = -30; d <= 200 && ok; d += 6) for (const w of [-8, 0, 8]) { const px = x + Math.sin(h) * d + Math.cos(h) * w, pz = z + Math.cos(h) * d - Math.sin(h) * w, e = 2
        const sl = Math.hypot(T.height(px + e, pz) - T.height(px - e, pz), T.height(px, pz + e) - T.height(px, pz - e)) / (2 * e); if (sl > 0.3 || F.dominant(px, pz).key !== "wueste") { ok = false; break } }
      if (ok) return { x, z, yaw: h } } return null })
  if (!route) { console.log(JSON.stringify({ error: 'keine flache Wüstenlinie' })); process.exit(1) }
  Object.assign(S, route)
  await page.evaluate(async (S) => { const D = window.__kfbDrive, T = D.terrain(); T.setFocus(S.x, S.z); T.flush(); window.__kfbM2.setKind(window.__kfbM2.kind(), { p: [S.x, T.surfaceAt(S.x, S.z) + 0.9, S.z], yaw: S.yaw }); D.atmos?.setWeather?.('klar', { dur: 0.001 }); await new Promise((r) => setTimeout(r, 3000)) }, S)
} else await page.evaluate(async (S) => { const M2 = window.__kfbM2; M2.setKind(M2.kind(), { p: [S.x, window.__kfbM1.terrainH(S.x, S.z) + 1, S.z], yaw: S.yaw }); await new Promise((r) => setTimeout(r, 2500)) }, S)
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, R = M.renderer(), Th = M.three(), scene = M.scene(), cam = M.camera3(), gl = R.getContext(), K = M.k
  const P = scene.getObjectByName('dust-trail') || scene.getObjectByName('vehicle-rig-dust'), TR = window.__kfbM2State?.dustTrail || null
  const size0 = R.getSize(new Th.Vector2()), pr0 = R.getPixelRatio(); R.setPixelRatio(2); R.setSize(1280, 720, false)
  const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, A = new Uint8Array(W * H * 4), B = new Uint8Array(W * H * 4), C = new Uint8Array(W * H * 4)
  const hist = [], v = new Th.Vector3(), out = { shots: [] }
  const luma = (b, i) => 0.2126 * b[i] + 0.7152 * b[i + 1] + 0.0722 * b[i + 2]
  // Deckung: Szene normal (echte Tiefe), nur Farbe löschen, Staub (alle Teile der Gruppe) weiß mit seiner Deckkraft
  const covPass = (c) => { if (!TR?.coverage) return null; const cC = c.clone(), ac = R.autoClear, cc0 = R.getClearColor(new Th.Color()), ca0 = R.getClearAlpha(), tm = R.toneMapping, bg = scene.background
    R.setRenderTarget(null); P.visible = false; R.render(scene, c); P.visible = true; R.autoClear = false; R.toneMapping = Th.NoToneMapping; R.setClearColor(0, 1); R.clear(true, false, false)
    TR.layer(9, true); cC.layers.set(9); TR.coverage(true); scene.background = null; R.render(scene, cC); scene.background = bg; TR.coverage(false); TR.layer(9, false)
    gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, C); R.autoClear = ac; R.setClearColor(cc0, ca0); R.toneMapping = tm; return C }
  // Bahn hinter dem Heck: Punkte der Wagen-Spur mit Bahnabstand 0,5–6,5 m hinter dem Heck (Heck = halbe Wagenlänge hinter der Mitte)
  const pathBehind = () => { const pts = []; let d = 0, half = 2.6 * K; for (let i = hist.length - 1; i > 0; i--) { d += Math.hypot(hist[i][0] - hist[i - 1][0], hist[i][1] - hist[i - 1][1]); if (d < half + 0.5 * K) continue; if (d > half + 6.5 * K) break; pts.push([hist[i - 1][0], hist[i - 1][1], +((d - half) / K).toFixed(1)]) } return pts }
  const shoot = (label, view) => { const car = M2.car(), cp = car.pos(), c = view === 'oben' ? (() => { const o = new Th.PerspectiveCamera(50, 16 / 9, 0.1, 500); o.position.set(cp.x, cp.y + 26 * K, cp.z); o.up.set(Math.sin(car.yaw()), 0, Math.cos(car.yaw())); o.lookAt(cp.x, cp.y, cp.z); o.updateMatrixWorld(); return o })() : (() => { const o = cam.clone(); o.updateMatrixWorld(); return o })()
    R.setRenderTarget(null); R.render(scene, c); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, A); P.visible = false; R.render(scene, c); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, B); P.visible = true
    const cov = covPass(c); let hit = 0, tot = 0
    if (label === 'drift-links' || label === 'gerade') { const enc = (b) => { let t = ''; for (let i = 0; i < b.length; i += 0x8000) t += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(t) }; (window.__dbg ||= []).push({ name: label + '-' + view, W, H, a: enc(A), c: cov ? enc(cov) : null }) }
    const detail = [], PB = pathBehind()
    // Sichtbarkeit der Bahnpunkte: Szenentiefe, dann je Punkt ein Marker mit Tiefentest – fehlt er, verdeckt Geometrie (Wagen, Flammen) den Punkt
    const vis = new Uint8Array(W * H * 4); { const g = new Th.BufferGeometry().setFromPoints(PB.map(([x, z]) => new Th.Vector3(x, M.terrainH(x, z) + 0.2 * K, z))), mk = new Th.Points(g, new Th.PointsMaterial({ color: 0xffffff, size: 4, sizeAttenuation: false, depthTest: true, toneMapped: false }))
      const ac = R.autoClear; R.setRenderTarget(null); P.visible = false; R.render(scene, c); P.visible = true; R.autoClear = false; R.setClearColor(0, 1); R.clear(true, false, false); const sc2 = new Th.Scene(); sc2.add(mk); R.render(sc2, c); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, vis); R.autoClear = ac; g.dispose(); mk.material.dispose() }
    if (cov) for (const [x, z, dm] of PB) { v.set(x, M.terrainH(x, z) + 0.2 * K, z).project(c); const px = Math.round((v.x * 0.5 + 0.5) * W), py = Math.round((v.y * 0.5 + 0.5) * H); if (px < 0 || py < 0 || px >= W || py >= H || v.z > 1) continue; tot++
      const cv = cov[(py * W + px) * 4] / 255, seen = vis[(py * W + px) * 4] > 128
      if (!seen) { tot--; detail.push([dm, +cv.toFixed(2), 'verdeckt']); continue }   // von Geometrie verdeckt: zählt nicht als fehlender Staub
      if (cv >= 0.15) hit++; detail.push([dm, +cv.toFixed(2), '']) }
    // Kontrast auf der Fahnenfläche (Deckung ≥ 0,05)
    let n = 0, sum = 0, sgn = 0, dark = 0, la = 0, lb = 0; if (cov) for (let i = 0; i < W * H; i++) { if (cov[i * 4] < 13) continue; const a = luma(A, i * 4), b = luma(B, i * 4); n++; sum += Math.abs(a - b); sgn += a - b; la += a; lb += b; if (a - b < -6) dark++ }
    out.shots.push({ label, view, detail, live: TR?.live?.() ?? null, covPath: tot ? +(hit / tot).toFixed(3) : null, pathN: tot, plumePx: n, contrast: n ? +(sum / n).toFixed(2) : 0, signed: n ? +(sgn / n).toFixed(2) : 0, darkFrac: n ? +(dark / n).toFixed(4) : 0, lumDust: n ? +(la / n).toFixed(1) : 0, lumGround: n ? +(lb / n).toFixed(1) : 0 }) }
  const plan = [[3.0, 'gerade', { forward: true }], [2.6, 'drift-links', { forward: true, leftward: true, strafeL: true }], [1.6, 'gerade-2', { forward: true }], [2.6, 'drift-rechts', { forward: true, rightward: true, strafeR: true }], [1.4, 'loslassen', {}], [1.3, 'bremsen', { backward: true }], [4.0, 'stehen', {}]]
  const snaps = { 'gerade': 2.6, 'drift-links': 2.4, 'drift-rechts': 2.4, 'stehen': 3.9 }
  let seg = 0, segT = 0, last = performance.now(), done = {}, stand = null
  await new Promise((res) => { const f = (now) => { const dt = (now - last) / 1000; last = now; segT += dt
    if (segT > plan[seg][0]) { seg++; segT = 0; if (seg >= plan.length) { M.input(null); res(); return } }
    const inp = { ...plan[seg][2] }; if (inp.forward && Math.abs(M2.car().signals().speed ?? 0) > 0.6) inp.forward = false   // Tempo ≤ 60 %: bleibt am Boden (Hügel der Probe-Welt)
    M.input(inp); const cp = M2.car().pos(); hist.push([cp.x, cp.z]); if (hist.length > 2000) hist.shift()
    const L = plan[seg][1]; if (snaps[L] && !done[L] && segT >= snaps[L]) { done[L] = 1; shoot(L, 'spiel'); shoot(L, 'oben') }
    if (L === 'stehen' && segT > 1.0) { const T = TR?.info?.(), sp = Math.abs(M2.car().signals().speed ?? 0); if (T) { stand ||= { emitWhileStanding: 0, frames: 0, liveStart: T.live }; stand.frames++; if (sp < 0.06) stand.emitWhileStanding += T.lastEmit; stand.liveEnd = T.live; stand.speed = +sp.toFixed(3) } }
    requestAnimationFrame(f) }; requestAnimationFrame(f) })
  out.stand = stand
  // K6 Neustart: Teleport 60 m weiter; junge Partikel dürfen nur nahe dem neuen Wagen entstehen
  const cp0 = M2.car().pos(); M2.setKind(M2.kind(), { p: [cp0.x + 40 * K, M.terrainH(cp0.x + 40 * K, cp0.z + 40 * K) + 1, cp0.z + 40 * K], yaw: 0.3 }); await new Promise((q) => setTimeout(q, 600))
  M.input({ forward: true }); await new Promise((q) => setTimeout(q, 900)); M.input(null)
  const TR2 = window.__kfbM2State?.dustTrail || TR, P2 = scene.getObjectByName('dust-trail') || P; out.restartSameTrail = TR2 === TR   // seit c0f4e48+: eine Fahne je Szene, beim Neueinhängen geleert (cachedSwap); maßgeblich ist restart.farFromCar = 0
  if (TR2) { const c = M2.car().pos(), ys = TR2.young(1.4); let far = 0; for (const [x, z] of ys) if (Math.hypot(x - c.x, z - c.z) > 30 * K) far++; const young = ys.length
    out.restart = { young, farFromCar: far } }
  // K5 GPU: Staub an/aus abwechselnd, Spielkamera und Kamera mitten in der Fahne (1 m über Grund, entlang der Bahn)
  const X = gl.getExtension('EXT_disjoint_timer_query_webgl2'), med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? +s[s.length >> 1].toFixed(3) : null }
  const time = async (c) => { const on = [], off = []; if (!X) return null; for (let k = 0; k < 6; k++) for (const vis of [true, false]) { P.visible = vis; R.render(scene, c); gl.finish()
    for (let i = 0; i < 12; i++) { const q = gl.createQuery(); gl.beginQuery(X.TIME_ELAPSED_EXT, q); R.render(scene, c); gl.endQuery(X.TIME_ELAPSED_EXT); gl.finish(); for (let w = 0; w < 50 && !gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE); w++) await new Promise((q2) => setTimeout(q2, 2))
      if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE) && !gl.getParameter(X.GPU_DISJOINT_EXT)) (vis ? on : off).push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q) } }
    P.visible = true; return { on: med(on), off: med(off), extra: on.length ? +(med(on) - med(off)).toFixed(3) : null } }
  // Fahne neu aufbauen (Drift links) und messen
  M.input({ forward: true, leftward: true, strafeL: true }); await new Promise((q) => setTimeout(q, 2600)); M.input(null); window.__kfbM2State && (window.__kfbM2State.freezeFx = true)
  const gc = cam.clone(); gc.updateMatrixWorld(); out.gpuGame = await time(gc)
  const hp = hist.length > 60 ? hist[hist.length - 40] : null; if (hp && TR) { const ic = new Th.PerspectiveCamera(55, 16 / 9, 0.05, 500), cp = M2.car().pos(); ic.position.set(hp[0], M.terrainH(hp[0], hp[1]) + 1.0 * K, hp[1]); ic.lookAt(cp.x, cp.y, cp.z); ic.updateMatrixWorld(); out.gpuInside = await time(ic) }
  // Kosten einer Tiefen-Vorstufe (für einen sauberen Depth-Fade per depthTexture): Szene ein weiteres Mal mit Tiefenmaterial in ein Render-Ziel, voll und halb
  if (X) { const depthCost = async (scale) => { const w = Math.round(W * scale), h = Math.round(H * scale), rt = new Th.WebGLRenderTarget(w, h, { depthTexture: new Th.DepthTexture(w, h) }), dm = new Th.MeshDepthMaterial(), ts = []
      for (let i = 0; i < 24; i++) { const q = gl.createQuery(); gl.beginQuery(X.TIME_ELAPSED_EXT, q); R.setRenderTarget(rt); scene.overrideMaterial = dm; P.visible = false; R.render(scene, gc); P.visible = true; scene.overrideMaterial = null; R.setRenderTarget(null); gl.endQuery(X.TIME_ELAPSED_EXT); gl.finish()
        for (let w2 = 0; w2 < 50 && !gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE); w2++) await new Promise((q2) => setTimeout(q2, 2)); if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) ts.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q) }
      rt.dispose(); dm.dispose(); return med(ts) }
    out.depthPrepass = { full: await depthCost(1), half: await depthCost(0.5) } }
  window.__kfbM2State && (window.__kfbM2State.freezeFx = false)
  out.trail = TR ? TR.info() : null; out.lightLum = TR ? +(TR.material.uniforms.uLum ?? 0).toFixed(3) : null; out.nightK = TR ? (TR.material.uniforms.uNightK ?? null) : null; out.ratioFn = !!TR?.emitters; out.uniforms = null
  R.setPixelRatio(pr0); R.setSize(size0.x, size0.y, false); return out })
const dbg = process.env.DBG ? await page.evaluate(() => window.__dbg || []) : []
await browser.close()
if (dbg.length) { const sharp = (await import('sharp')).default; for (const d of dbg) { await sharp(Buffer.from(d.a, 'base64'), { raw: { width: d.W, height: d.H, channels: 4 } }).flip().resize(1280, 720).jpeg({ quality: 80 }).toFile(`${process.env.DBG}/${d.name}.jpg`); if (d.c) await sharp(Buffer.from(d.c, 'base64'), { raw: { width: d.W, height: d.H, channels: 4 } }).flip().resize(1280, 720).jpeg({ quality: 80 }).toFile(`${process.env.DBG}/${d.name}-cov.jpg`) } }
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync(`test/out/dust-trail-${TOD}${ALT ? '-alt' : ''}.json`, JSON.stringify({ ...r, errs }, null, 1))
console.log(JSON.stringify({ ...r, route: S, errs }))
