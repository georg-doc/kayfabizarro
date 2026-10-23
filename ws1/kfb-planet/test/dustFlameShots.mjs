// Staub/Düsen (Lead 23.10., nur im Test-Slot), Ablage ~/kfb-ws1/research/audits/abnahme/staubfahne/:
//  std     – Staub-Zeichenreihenfolge A/B im SELBEN Moment (A: Staub vor den Flammen gezeichnet = bisher, B: danach = neu), Spielkamera und schräg nah,
//            geradeaus (Vollgas) und Drift, Tag und Nacht; Bild 1600×900 @2 aus dem Bildpuffer + 1:1-Ausschnitt um die Düsen. Suffix -std.
//  flamme  – Flammen-Stil clay gegen glow (flame=clay|glow, eigene Läufe auf derselben Linie und zu denselben Zeitpunkten – der Stil wird beim Bau des
//            Antriebs festgelegt, ein Umschalten im selben Moment gibt es nicht), Crimson Flame Dragster und Crimson Thunderjet (Lüfter + Düsen),
//            Vollgas und Drift, Tag und Nacht; dazu Anteil fast gesättigter Pixel um den Wagen (Überstrahlen). Suffix -flamme.
// Aufruf: node test/dustFlameShots.mjs std|flamme
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const MODE = process.argv[2] || 'std', OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/staubfahne'); fs.mkdirSync(OUT, { recursive: true })
const PLAN = [[2.6, 'gerade', { forward: true }, true], [2.6, 'drift', { forward: true, leftward: true, strafeL: true }, true], [3.2, 'vollgas', { forward: true }, false]]   // [Dauer, Name, Eingabe, Tempo ≤ 60 %]
const STILLS = [[2.4, 'gerade'], [5.0, 'drift'], [8.2, 'vollgas']]
const enc = `(b) => { let t = ''; for (let i = 0; i < b.length; i += 0x8000) t += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(t) }`
async function run(hashExtra, tod, tag, abOrder) {
  const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), page = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 }), errs = []
  page.on('pageerror', (e) => errs.push(e.message)); const meta = []
  await page.exposeFunction('__saveStill', async (name, b64, W, H, cx, cy, sat) => { const img = sharp(Buffer.from(b64, 'base64'), { raw: { width: W, height: H, channels: 4 } }).flip()
    await img.clone().jpeg({ quality: 88 }).toFile(path.join(OUT, name + '.jpg'))
    const left = Math.max(0, Math.min(W - 1600, Math.round(cx - 800))), top = Math.max(0, Math.min(H - 900, Math.round(cy - 450)))   // 1:1 um die Flammen (Schwerpunkt der Maske); sharp schneidet vor dem Spiegeln, also GL-Zeilen (von unten)
    await img.clone().extract({ left, top, width: 1600, height: 900 }).jpeg({ quality: 88 }).toFile(path.join(OUT, name + '-1zu1.jpg')); meta.push({ name, sat }) })
  if (process.env.DBG) await page.addInitScript(() => { window.__dbgMask = true })
  await page.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,car,look=terrain3,world=endless,mute,drivepanel=0,hour=' + (tod === 'nacht' ? '0.5' : '13') + hashExtra)
  await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbDrive?.veg?.()?.info?.().ready, null, { timeout: 180000 })
  const route = await page.evaluate(() => { const T = window.__kfbDrive.terrain(), F = T.field
    for (let k = 0; k < 6000; k++) { const a = k * 2.399963, r = 200 + 4000 * Math.sqrt(k / 6000), x = Math.cos(a) * r, z = Math.sin(a) * r, h = (k * 0.73) % (Math.PI * 2)
      if (F.dominant(x, z).key !== 'wueste' || F.dominant(x, z).w < 0.95) continue; let ok = true
      for (let d = -30; d <= 200 && ok; d += 6) for (const w of [-8, 0, 8]) { const px = x + Math.sin(h) * d + Math.cos(h) * w, pz = z + Math.cos(h) * d - Math.sin(h) * w, e = 2
        const sl = Math.hypot(T.height(px + e, pz) - T.height(px - e, pz), T.height(px, pz + e) - T.height(px, pz - e)) / (2 * e); if (sl > 0.3 || F.dominant(px, pz).key !== 'wueste') { ok = false; break } }
      if (ok) return { x, z, yaw: h } } return null })
  await page.evaluate(async (S) => { const D = window.__kfbDrive, T = D.terrain(); T.setFocus(S.x, S.z); T.flush(); window.__kfbM2.setKind(window.__kfbM2.kind(), { p: [S.x, T.surfaceAt(S.x, S.z) + 0.9, S.z], yaw: S.yaw }); D.atmos?.setWeather?.('klar', { dur: 0.001 }); await new Promise((r) => setTimeout(r, 3000)) }, route)
  const DRIVE = `async ({ PLAN, STILLS, tag, abOrder }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, R = M.renderer(), Th = M.three(), scene = M.scene(), cam = M.camera3(), gl = R.getContext(), K = M.k, enc = ${enc}, TR = window.__kfbM2State?.dustTrail
    const near = () => { const car = M2.car(), cp = car.pos(), y = car.yaw(), o = new Th.PerspectiveCamera(40, 16 / 9, 0.1, 800), d = 11 * K   // schräg nah von hinten-seitlich auf die Düsen
      o.position.set(cp.x - Math.sin(y + 0.55) * d * 0.8, cp.y + d * 0.55, cp.z - Math.cos(y + 0.55) * d * 0.8); o.lookAt(cp.x - Math.sin(y) * 1.8 * K, cp.y + 0.4 * K, cp.z - Math.cos(y) * 1.8 * K); o.updateMatrixWorld(); return o }
    let t = 0, seg = 0, segT = 0, last = performance.now(), si = 0; const shots = []
    const snap = async (label) => { const size0 = R.getSize(new Th.Vector2()), pr0 = R.getPixelRatio(); R.setPixelRatio(2); R.setSize(1600, 900, false); const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, raws = []
      for (const [vname, mk] of [['spiel', () => { const c = cam.clone(); c.aspect = 16 / 9; c.updateProjectionMatrix(); return c }], ['schraeg', near]]) { const c = mk()
        const shot = () => { R.setRenderTarget(null); R.render(scene, c); const buf = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf); return buf }
        const fl = []; scene.getObjectByName('vehicle-rig')?.traverse((g) => { if (g.name.startsWith('anchor:') || g.name === 'vehicle-rig-fx') g.traverse((o) => { if ((o.isMesh || o.isPoints) && o.material?.transparent && !o.material.depthWrite && o.visible && !fl.includes(o)) fl.push(o) }) })   // nur Antriebe (Anker) und Funken, keine Scheinwerfer
        if (TR) TR.order('neu'); fl.forEach((o) => (o.visible = false)); const none = shot(); fl.forEach((o) => (o.visible = true))   // Bezug: ohne Flammen (Staub gleich)
        // Varianten im selben Moment: order = Staub vor/nach den Flammen; glow = Antrieb vorher (kein Nacht-Begrenzen, harte Diamanten 0,62/pow 6) / nachher
        const mats = []; scene.getObjectByName('vehicle-rig')?.traverse((o) => { if (o.material?.uniforms) mats.push(o.material) }), nightNow = mats.find((m) => m.uniforms.uNight)?.uniforms.uNight.value ?? 0
        const glowSet = (old, dim = 0.35, core = 3) => { for (const m of mats) { const u = m.uniforms; if (u.uNight) u.uNight.value = old ? 0 : nightNow; if (u.uDiamPow) { u.uDiam.value = old ? 0.62 : 0.3; u.uDiamPow.value = old ? 6 : 1.5; u.uNightDim.value = dim; u.uNightCore.value = core } }
          if (TR) TR.order(old ? 'neu' : 'korn') }
        const grain = TR?.object3d.children[0], VAR = { order: [['A', () => TR.order('alt')], ['B', () => TR.order('neu')]], glow: [['A', () => glowSet(true)], ['B', () => glowSet(false)]],
          glowdbg: [['A', () => glowSet(true)], ['B0', () => glowSet(false, 0, 0)], ['B1', () => glowSet(false, 0.35, 3)], ['B2', () => glowSet(false, 0.5, 6)], ['B3', () => glowSet(false, 0.6, 10)]] }
        const vs = (VAR[abOrder] || [['x', () => {}]]).map(([v, f]) => { f(); const b = shot(); if (grain) grain.visible = true; return [v, b] }); if (abOrder === 'glow' || abOrder === 'glowdbg') glowSet(false); window.__night = nightNow
        // Flammenmaske: Pixel, an denen die Flammen das Bild ändern (erste Variante gegen ohne Flammen, Summe |ΔRGB| > 24); Sichtbarkeit = mittleres |Δ| je Variante
        const ref = vs[0][1], sig = vs.map(() => 0), sat = vs.map(() => 0); let mn = 0, mx = 0, my = 0
        for (let i = 0; i < W * H; i++) { const j = i * 4, d0 = Math.abs(ref[j] - none[j]) + Math.abs(ref[j + 1] - none[j + 1]) + Math.abs(ref[j + 2] - none[j + 2]); if (d0 <= 24) continue
          mn++; mx += i % W; my += (i / W) | 0; vs.forEach(([, b], k) => (sig[k] += Math.abs(b[j] - none[j]) + Math.abs(b[j + 1] - none[j + 1]) + Math.abs(b[j + 2] - none[j + 2])))
          vs.forEach(([, b], k) => { if (b[j] + b[j + 1] + b[j + 2] >= 735) sat[k]++ }) }   // Überstrahlen: fast weiße Flammenpixel je Variante
        const cx = mn ? mx / mn : W / 2, cy = mn ? my / mn : H / 2
        if (window.__dbgMask) { const m = new Uint8Array(W * H * 4); for (let i = 0; i < W * H; i++) { const j = i * 4, d0 = Math.abs(ref[j] - none[j]) + Math.abs(ref[j + 1] - none[j + 1]) + Math.abs(ref[j + 2] - none[j + 2]); m[j] = m[j + 1] = m[j + 2] = d0 > 24 ? 255 : 0; m[j + 3] = 255 } raws.push([label + '-' + vname + '-maske', m, cx, cy, {}]) }
        vs.forEach(([v, b], k) => raws.push([label + '-' + vname + (v !== 'x' ? '-' + v : ''), b, cx, cy, { nacht: +nightNow.toFixed(3), flammePx: mn, signal: mn ? +(sig[k] / mn).toFixed(1) : 0, anteil: sig[0] ? +(sig[k] / sig[0]).toFixed(3) : 0, weissAnteil: mn ? +(sat[k] / mn).toFixed(3) : 0 }])) }
      if (TR) TR.order('neu'); R.setPixelRatio(pr0); R.setSize(size0.x, size0.y, false)
      for (const [n, buf, cx, cy, sat] of raws) await window.__saveStill(n + '-' + tag, enc(buf), W, H, cx, cy, sat); shots.push(label) }
    await new Promise((res) => { const f = async (now) => { const dt = (now - last) / 1000; last = now; t += dt; segT += dt
      if (segT > PLAN[seg][0]) { seg++; segT = 0; if (seg >= PLAN.length) { M.input(null); res(); return } }
      const inp = { ...PLAN[seg][2] }; if (PLAN[seg][3] && inp.forward && Math.abs(M2.car().signals().speed ?? 0) > 0.6) inp.forward = false; M.input(inp)
      if (si < STILLS.length && t >= STILLS[si][0]) { const L = STILLS[si][1]; si++; await snap(L); last = performance.now() }
      requestAnimationFrame(f) }; requestAnimationFrame(f) })
    return shots }`
  const shots = await page.evaluate(new Function('return (' + DRIVE + ')')(), { PLAN, STILLS, tag, abOrder })
  await b.close(); return { tag, shots, meta, errs: errs.slice(0, 3) }
}
const res = []
if (MODE === 'dbg') res.push(await run('', 'nacht', 'dbg', 'glowdbg'))
else if (MODE === 'glow') { for (const racer of ['crimson_flame_dragster', 'crimson_thunderjet']) for (const tod of ['tag', 'nacht']) res.push(await run(`,racer=${racer}`, tod, `${racer.replace('crimson_', '')}-${tod}-glow`, 'glow')) }
else if (MODE === 'std' || MODE === 'std-glow') { const g = MODE === 'std-glow'; for (const tod of ['tag', 'nacht']) res.push(await run(g ? ',flame=glow' : ',flame=clay', tod, tod + (g ? '-glow' : '') + '-std', 'order')) }
else for (const racer of ['crimson_flame_dragster', 'crimson_thunderjet']) for (const fl of ['clay', 'glow']) for (const tod of ['tag', 'nacht']) res.push(await run(`,racer=${racer},flame=${fl}`, tod, `${racer.replace('crimson_', '')}-${fl}-${tod}-flamme`, null))
const ixp = path.join(OUT, 'index.json'), ix = JSON.parse(fs.readFileSync(ixp, 'utf8')); if (MODE === 'dbg') ix._ = 0
ix[MODE === 'flamme' ? 'lieferung_flamme' : 'lieferung_' + MODE.replace('-', '_')] = { date: new Date().toISOString(), laeufe: res.map((r) => ({ tag: r.tag, bilder: r.meta, errs: r.errs })) }
if (MODE !== 'dbg') fs.writeFileSync(ixp, JSON.stringify(ix, null, 1)); console.log(JSON.stringify(res.map((r) => ({ tag: r.tag, n: r.meta.length, sat: r.meta.map((m) => [m.name, m.sat.anteil, m.sat.weissAnteil, m.sat.flammePx, m.sat.nacht]), errs: r.errs }))))
