// Staubfahne (dust3=1) · Lieferung an den Lead (nur im Test-Slot), Ablage ~/kfb-ws1/research/audits/abnahme/staubfahne/:
// (1) Videos aus der Spielkamera und von oben, alt (Standard-Staub, 160er-Pool) und neu (Staubfahne) auf derselben flachen Wüstenlinie der Biom-Fahrt,
//     Fahrt gerade → Drift links → gerade → Drift rechts → loslassen (Tempo ≤ 60 %, bleibt am Boden), je Ansicht nebeneinander zusammengesetzt;
// (2) Standbilder im selben Moment (Seite mit beiden Systemen: alt = alter Staub sichtbar/Fahne aus, neu = umgekehrt), Spielkamera, von oben und schräg
//     von oben (≈ 50°, wie Georgs Vorlage), 1600×900 @2 als JPG 88 aus dem Bildpuffer + 1:1-Ausschnitt; index.json ergänzt.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/staubfahne'); fs.mkdirSync(OUT, { recursive: true })
const SUF = process.env.SUF || ''   // r2: Dateien mit Zusatz -r2
const BASE = '#m1,debug,clean,car,look=terrain3,world=endless,mute,drivepanel=0,hour=13'
const PLAN = [[3.0, 'gerade', { forward: true }], [2.6, 'drift-links', { forward: true, leftward: true, strafeL: true }], [1.6, 'gerade-2', { forward: true }], [2.6, 'drift-rechts', { forward: true, rightward: true, strafeR: true }], [2.2, 'loslassen', {}]]
const STILLS = [[2.6, 'gerade'], [5.4, 'drift-links'], [9.6, 'drift-rechts'], [11.6, 'nach-drift']]
const launch = (extra = []) => chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', ...extra] })
const enc = `(b) => { let t = ''; for (let i = 0; i < b.length; i += 0x8000) t += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(t) }`
async function setup(page) {
  await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbDrive?.veg?.()?.info?.().ready, null, { timeout: 180000 })
  const route = await page.evaluate(() => { const T = window.__kfbDrive.terrain(), F = T.field
    for (let k = 0; k < 6000; k++) { const a = k * 2.399963, r = 200 + 4000 * Math.sqrt(k / 6000), x = Math.cos(a) * r, z = Math.sin(a) * r, h = (k * 0.73) % (Math.PI * 2)
      if (F.dominant(x, z).key !== 'wueste' || F.dominant(x, z).w < 0.95) continue; let ok = true
      for (let d = -30; d <= 200 && ok; d += 6) for (const w of [-8, 0, 8]) { const px = x + Math.sin(h) * d + Math.cos(h) * w, pz = z + Math.cos(h) * d - Math.sin(h) * w, e = 2
        const sl = Math.hypot(T.height(px + e, pz) - T.height(px - e, pz), T.height(px, pz + e) - T.height(px, pz - e)) / (2 * e); if (sl > 0.3 || F.dominant(px, pz).key !== 'wueste') { ok = false; break } }
      if (ok) return { x, z, yaw: h } } return null })
  await page.evaluate(async (S) => { const D = window.__kfbDrive, T = D.terrain(); T.setFocus(S.x, S.z); T.flush(); window.__kfbM2.setKind(window.__kfbM2.kind(), { p: [S.x, T.surfaceAt(S.x, S.z) + 0.9, S.z], yaw: S.yaw }); D.atmos?.setWeather?.('klar', { dur: 0.001 }); await new Promise((r) => setTimeout(r, 3000)) }, route)
  return route
}
// Fahrt im Seitenkontext; view 'oben' rendert nach jedem Spielbild die Draufsicht auf die Leinwand (für die Aufnahme)
const DRIVE = `async ({ PLAN, STILLS, view, clip, stills }) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, R = M.renderer(), Th = M.three(), scene = M.scene(), cam = M.camera3(), gl = R.getContext(), K = M.k, enc = ${enc}
  const P3 = scene.getObjectByName('dust-trail'), P1 = scene.getObjectByName('vehicle-rig-dust')
  const top = () => { const car = M2.car(), cp = car.pos(), o = new Th.PerspectiveCamera(50, 16 / 9, 0.1, 800); o.position.set(cp.x, cp.y + 30 * K, cp.z); o.up.set(Math.sin(car.yaw()), 0, Math.cos(car.yaw())); o.lookAt(cp.x, cp.y, cp.z); o.updateMatrixWorld(); return o }
  const oblique = () => { const car = M2.car(), cp = car.pos(), y = car.yaw(), o = new Th.PerspectiveCamera(45, 16 / 9, 0.1, 800), d = 42 * K   // weit wie die Vorlage (Wagen klein, Fahne groß)
    o.position.set(cp.x - Math.sin(y + 0.7) * d * 0.62, cp.y + d * 0.78, cp.z - Math.cos(y + 0.7) * d * 0.62); o.lookAt(cp.x - Math.sin(y) * 3 * K, cp.y, cp.z - Math.cos(y) * 3 * K); o.updateMatrixWorld(); return o }   // ≈ 50° von oben, schräg hinten
  let rec = null; const pend = []
  if (clip) { rec = new MediaRecorder(R.domElement.captureStream(30), { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 })
    rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then((b) => window.__saveClip(enc(new Uint8Array(b))))) }; rec.start(1000) }
  const shots = []; let t = 0, seg = 0, segT = 0, last = performance.now(), si = 0
  const snap = async (label) => { const size0 = R.getSize(new Th.Vector2()), pr0 = R.getPixelRatio(); R.setPixelRatio(2); R.setSize(1600, 900, false); const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, raws = []
    for (const [vname, mk] of [['spiel', () => { const c = cam.clone(); c.aspect = 16 / 9; c.updateProjectionMatrix(); return c }], ['oben', top], ['schraeg', oblique]]) { const c = mk()
      for (const v of ['alt', 'neu']) { if (P3) P3.visible = v === 'neu'; if (P1) P1.visible = v === 'alt'; R.setRenderTarget(null); R.render(scene, c); const buf = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf); raws.push([label + '-' + vname + '-' + v, buf]) } }
    if (P3) P3.visible = true; if (P1) P1.visible = !P3; R.setPixelRatio(pr0); R.setSize(size0.x, size0.y, false)
    for (const [n, b] of raws) await window.__saveStill(n, enc(b), W, H); shots.push(label) }   // erst alle Bilder lesen (selber Moment), dann speichern
  await new Promise((res) => { const f = async (now) => { const dt = (now - last) / 1000; last = now; t += dt; segT += dt
    if (segT > PLAN[seg][0]) { seg++; segT = 0; if (seg >= PLAN.length) { M.input(null); res(); return } }
    const inp = { ...PLAN[seg][2] }; if (inp.forward && Math.abs(M2.car().signals().speed ?? 0) > 0.6) inp.forward = false; M.input(inp)
    if (view === 'oben') R.render(scene, top())   // nach dem Spielbild: Draufsicht auf die Leinwand
    if (stills && si < STILLS.length && t >= STILLS[si][0]) { const L = STILLS[si][1]; si++; await snap(L); last = performance.now() }
    requestAnimationFrame(f) }; requestAnimationFrame(f) })
  if (rec) { rec.stop(); await new Promise((r) => (rec.onstop = r)); await Promise.all(pend) }
  return { shots, seconds: +t.toFixed(1) } }`
async function run(variant, view, { clip = true, stills = false } = {}) {
  const b = await launch(), page = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 }), errs = []; page.on('pageerror', (e) => errs.push(e.message))
  const file = path.join(OUT, `fahrt-${view}-${variant}${SUF}.webm`); if (clip) fs.writeFileSync(file, Buffer.alloc(0))
  await page.exposeFunction('__saveClip', (b64) => { fs.appendFileSync(file, Buffer.from(b64, 'base64')) })
  await page.exposeFunction('__saveStill', async (name, b64, W, H) => { const img = sharp(Buffer.from(b64, 'base64'), { raw: { width: W, height: H, channels: 4 } }).flip()
    await img.clone().jpeg({ quality: 88 }).toFile(path.join(OUT, name + SUF + '.jpg'))
    await img.clone().extract({ left: Math.round(W / 2 - 800), top: Math.round(H * 0.35), width: 1600, height: 900 }).jpeg({ quality: 88 }).toFile(path.join(OUT, name + '-1zu1' + SUF + '.jpg')) })
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + (variant === 'neu' ? ',dust3=1' : ',dust3=0'))
  const route = await setup(page)
  const res = await page.evaluate(new Function('return (' + DRIVE + ')')(), { PLAN, STILLS, view, clip, stills })
  await b.close(); return { ...res, route, file: clip ? path.basename(file) : null, bytes: clip ? fs.statSync(file).size : 0, errs: errs.slice(0, 3) }
}
async function sideBySide(view) {
  const b = await launch(['--allow-file-access-from-files']), page = await b.newPage({ viewport: { width: 1400, height: 500 } }), file = path.join(OUT, `fahrt-${view}-alt-neu-nebeneinander${SUF}.webm`); fs.writeFileSync(file, Buffer.alloc(0))
  await page.exposeFunction('__saveClip', (b64) => { fs.appendFileSync(file, Buffer.from(b64, 'base64')) })
  fs.writeFileSync(path.join(OUT, '_nb.html'), `<html><body style="margin:0;background:#111"><canvas id=c width=2560 height=760></canvas><video id=a muted playsinline src="fahrt-${view}-alt${SUF}.webm"></video><video id=n muted playsinline src="fahrt-${view}-neu${SUF}.webm"></video></body></html>`)
  await page.goto(`file://${OUT}/_nb.html`)
  await page.evaluate(async ({ SEC, view }) => { const c = document.getElementById('c'), g = c.getContext('2d'), a = document.getElementById('a'), n = document.getElementById('n')
    await Promise.all([a, n].map((v) => new Promise((r) => (v.readyState >= 2 ? r() : (v.onloadeddata = r)))))
    const rec = new MediaRecorder(c.captureStream(30), { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 }), pend = []
    rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then((buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return window.__saveClip(btoa(s)) })) }
    rec.start(1000); await Promise.all([a.play(), n.play()]); const t0 = performance.now()
    await new Promise((res) => { const f = () => { g.fillStyle = '#111'; g.fillRect(0, 0, 2560, 760); g.drawImage(a, 0, 40, 1280, 720); g.drawImage(n, 1280, 40, 1280, 720)
      g.fillStyle = '#fff'; g.font = '28px sans-serif'; g.fillText('alt (Staub 160) · ' + view.v, 20, 30); g.fillText('neu (dust3=1: Staubfahne' + (view.suf || '') + ') · ' + view.v, 1300, 30)
      if (performance.now() - t0 < SEC * 1000 && !(a.ended && n.ended)) requestAnimationFrame(f); else res() }; requestAnimationFrame(f) })
    rec.stop(); await new Promise((r) => (rec.onstop = r)); await Promise.all(pend) }, { SEC: 12.4, view: { v: view, suf: SUF } })
  await b.close(); fs.unlinkSync(path.join(OUT, '_nb.html')); return { file: path.basename(file), bytes: fs.statSync(file).size }
}
const res = {}
for (const view of ['spiel', 'oben']) for (const v of ['alt', 'neu']) res[view + '-' + v] = await run(v, view)
res.stills = await run('neu', 'spiel', { clip: false, stills: true })
res.sbsSpiel = await sideBySide('spiel'); res.sbsOben = await sideBySide('oben')
// Vergleich: schräg nach dem Drift (neu) neben Georgs Vorlagen
{ const V = path.join(OUT, 'vorlage'), parts = [path.join(OUT, `nach-drift-schraeg-neu${SUF}.jpg`), path.join(V, 'vorlage-1-kurve.png'), path.join(OUT, `drift-rechts-schraeg-neu${SUF}.jpg`), path.join(V, 'vorlage-2-bogen.png')]
  const tiles = await Promise.all(parts.map((f) => sharp(f).resize(1280, 720, { fit: 'cover' }).toBuffer()))
  await sharp({ create: { width: 2560, height: 1440, channels: 3, background: '#111' } }).composite(tiles.map((b, i) => ({ input: b, left: (i % 2) * 1280, top: Math.floor(i / 2) * 720 }))).jpeg({ quality: 88 }).toFile(path.join(OUT, `vergleich-vorlage${SUF}.jpg`)) }
const ixp = path.join(OUT, 'index.json'), ix = fs.existsSync(ixp) ? JSON.parse(fs.readFileSync(ixp, 'utf8')) : { thema: 'staubfahne' }
ix['lieferung' + SUF.replace('-', '_')] = { date: new Date().toISOString(), hash: BASE + ' (+ ,dust3=1 für neu)', route: res.stills.route, fahrt: PLAN.map((p) => `${p[1]} ${p[0]} s`).join(' → ') + ' (Tempo ≤ 60 %)',
  videos: Object.entries(res).filter(([k]) => /^(spiel|oben)-/.test(k)).map(([k, r]) => ({ file: r.file, bytes: r.bytes, sekunden: r.seconds })).concat([res.sbsSpiel, res.sbsOben]),
  hinweis: 'Standbilder alt/neu im selben Moment auf der Seite mit beiden Systemen: alt = alter Staub (160er-Pool) sichtbar, Fahne aus; neu = Fahne sichtbar, alter Staub aus. Aus dem Bildpuffer wie auf dem Bildschirm.' }
ix['shots' + SUF.replace('-', '_')] = res.stills.shots.flatMap((s) => ['spiel', 'oben', 'schraeg'].flatMap((vw) => ['alt', 'neu'].flatMap((v) => [{ file: `${s}-${vw}-${v}${SUF}.jpg`, objekt: 'staubfahne-' + vw, fall: `${s}-${v}`, hash: BASE + ',dust3=1' }, { file: `${s}-${vw}-${v}-1zu1${SUF}.jpg`, objekt: 'staubfahne-' + vw + '-1zu1', fall: `${s}-${v}`, hash: BASE + ',dust3=1' }])))
fs.writeFileSync(ixp, JSON.stringify(ix, null, 1))
console.log(JSON.stringify(Object.fromEntries(Object.entries(res).map(([k, r]) => [k, { file: r.file, bytes: r.bytes, shots: r.shots, errs: r.errs }]))))
