// Staub-Probe · Lieferung an den Lead (nur im Test-Slot): (1) Video aus der Spielkamera, gleiche Fahrt alt (ohne Schalter) und neu (dust2=1), dazu ein
// Nebeneinander-Video; (2) Standbilder alt/neu im SELBEN Moment (nur der Staub-Shader wird getauscht: Größen-Deckel, Untergrenze, Nah-Ausblenden),
// 1600×900 @2 als JPG 88 plus 1:1-Ausschnitt um den Wagen. Fahrt wie test/dustProbe.mjs: gerade → Drift links → gerade → Drift rechts → loslassen.
// Ablage ~/kfb-ws1/research/audits/abnahme/staub-probe/ (index.json wird ergänzt, Kriterien bleiben).
import fs from 'fs'
// Start: flache Linie durch die Probe-Welt (≥ 30 m vom Amphitheater, 240 m bis zum Rand; vom Spawn aus fuhr die Fahrt über den Weltrand)
export const DUST_START = { x: -127.5, z: 12.6, yaw: Math.PI / 2 - 0.26 }
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/staub-probe'); fs.mkdirSync(OUT, { recursive: true })
const BASE = '#m1,debug,clean,car,look=terrain3,world=probe,mute,dust3=0', PLAN = [[3.0, 'gerade', { forward: true }], [2.6, 'drift-links', { forward: true, leftward: true, strafeL: true }], [1.6, 'gerade-2', { forward: true }], [2.6, 'drift-rechts', { forward: true, rightward: true, strafeR: true }], [1.4, 'loslassen', {}]]
const STILLS = [[2.6, 'gerade'], [8.6, 'drift-rechts'], [10.6, 'loslassen']]
const launch = () => chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const SUF = process.env.SUF || (process.env.R2 ? '-r2' : '')   // r2 (Georg 23.10., Schritt 4): Dateien mit Zusatz -r2, Tag und Nacht
async function run(variant, { clip = true, stills = false, tod = 'day' } = {}) {
  const b = await launch(), page = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 }), errs = []; page.on('pageerror', (e) => errs.push(e.message))
  const file = path.join(OUT, `fahrt-${variant}${SUF}.webm`); if (clip) fs.writeFileSync(file, Buffer.alloc(0))
  await page.exposeFunction('__saveClip', (b64) => { fs.appendFileSync(file, Buffer.from(b64, 'base64')) })
  await page.exposeFunction('__saveStill', async (name, b64, W, H) => { const raw = Buffer.from(b64, 'base64'), img = sharp(raw, { raw: { width: W, height: H, channels: 4 } }).flip()
    await img.clone().jpeg({ quality: 88 }).toFile(path.join(OUT, name + SUF + '.jpg'))
    await img.clone().extract({ left: Math.round(W / 2 - 800), top: Math.round(H * 0.42), width: 1600, height: 900 }).jpeg({ quality: 88 }).toFile(path.join(OUT, name + '-1zu1' + SUF + '.jpg')) })   // 1:1 um den Wagen (unten Mitte)
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + ',tod=' + tod + (variant === 'neu' ? ',dust2=1' : ''))
  await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbM1?.scene?.()?.getObjectByName('vehicle-rig-dust'), null, { timeout: 180000 }); await page.waitForTimeout(4000)
  await page.evaluate(async (S) => { const M2 = window.__kfbM2; M2.setKind(M2.kind(), { p: [S.x, window.__kfbM1.terrainH(S.x, S.z) + 1, S.z], yaw: S.yaw }); await new Promise((r) => setTimeout(r, 2500)) }, DUST_START)
  const res = await page.evaluate(async ({ PLAN, STILLS, clip, stills, TOD }) => {
    const M = window.__kfbM1, R = M.renderer(), Th = M.three(), scene = M.scene(), cam = M.camera3(), cv = R.domElement, D = window.__kfbDust2
    let rec = null; const pend = []
    if (clip) { rec = new MediaRecorder(cv.captureStream(30), { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 10e6 })
      rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then((buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return window.__saveClip(btoa(s)) })) }; rec.start(1000) }
    const W = 3200, H = 1800, shots = []; let t = 0, seg = 0, segT = 0, last = performance.now(), si = 0
    // wie auf dem Bildschirm: Standard-Bildpuffer bei Pixeldichte 2 (1600×900 → 3200×1800); ein sRGB-Render-Ziel zeigte den alten Staub zu hell
    const snap = async (label) => { const gl = R.getContext(), size0 = R.getSize(new Th.Vector2()), pr0 = R.getPixelRatio(); R.setPixelRatio(2); R.setSize(1600, 900, false)
      const buf = new Uint8Array(W * H * 4), c = cam.clone(); c.aspect = 16 / 9; c.updateProjectionMatrix()
      // erst beide Bilder rendern und lesen (kein await dazwischen: das Spiel läuft sonst weiter), dann speichern
      const raws = {}; for (const v of ['alt', 'neu']) { D.shader(v === 'alt' ? 'old' : 'new'); R.setRenderTarget(null); R.render(scene, c); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf)
        let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); raws[v] = btoa(s) }
      for (const v of ['alt', 'neu']) await window.__saveStill(`${label}-${TOD}-${v}`, raws[v], W, H)
      R.setPixelRatio(pr0); R.setSize(size0.x, size0.y, false); D.shader('new'); shots.push(label) }
    await new Promise((res) => { const f = async (now) => { const dt = (now - last) / 1000; last = now; t += dt; segT += dt
      if (segT > PLAN[seg][0]) { seg++; segT = 0; if (seg >= PLAN.length) { M.input(null); res(); return } }
      M.input(PLAN[seg][2])
      if (stills && si < STILLS.length && t >= STILLS[si][0]) { const L = STILLS[si][1]; si++; await snap(L); last = performance.now() }   // beide Bilder ohne Zwischenbild = selber Moment
      requestAnimationFrame(f) }; requestAnimationFrame(f) })
    if (rec) { rec.stop(); await new Promise((r) => (rec.onstop = r)); await Promise.all(pend) }
    return { shots, seconds: +t.toFixed(1) } }, { PLAN, STILLS, clip, stills, TOD: tod })
  await b.close(); return { ...res, file: clip ? file : null, bytes: clip ? fs.statSync(file).size : 0, errs: errs.slice(0, 3) }
}
// Nebeneinander: beide Videos in einer Seite abspielen, auf eine Leinwand (2 × 1280 × 720) zeichnen, aufnehmen
async function sideBySide() {
  // file://-Videos machen die Leinwand sonst „fremd“ (tainted) → captureStream liefert nichts
  const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] }), page = await b.newPage({ viewport: { width: 1400, height: 500 } }), file = path.join(OUT, `fahrt-alt-neu-nebeneinander${SUF}.webm`); fs.writeFileSync(file, Buffer.alloc(0))
  await page.exposeFunction('__saveClip', (b64) => { fs.appendFileSync(file, Buffer.from(b64, 'base64')) })
  const html = `<html><body style="margin:0;background:#111"><canvas id=c width=2560 height=760></canvas><video id=a muted playsinline src="fahrt-alt${SUF}.webm"></video><video id=n muted playsinline src="fahrt-neu${SUF}.webm"></video></body></html>`
  fs.writeFileSync(path.join(OUT, '_nebeneinander.html'), html); await page.goto(`file://${OUT}/_nebeneinander.html`)
  await page.evaluate(async ({ SEC, SUFX }) => { const c = document.getElementById('c'), g = c.getContext('2d'), a = document.getElementById('a'), n = document.getElementById('n')
    await Promise.all([a, n].map((v) => new Promise((r) => (v.readyState >= 2 ? r() : (v.onloadeddata = r)))))
    const rec = new MediaRecorder(c.captureStream(30), { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 }), pend = []
    rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then((buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return window.__saveClip(btoa(s)) })) }
    rec.start(1000); await Promise.all([a.play(), n.play()])
    await new Promise((res) => { const f = () => { g.fillStyle = '#111'; g.fillRect(0, 0, 2560, 760); g.drawImage(a, 0, 40, 1280, 720); g.drawImage(n, 1280, 40, 1280, 720)
      g.fillStyle = '#fff'; g.font = '28px sans-serif'; g.fillText('alt (Standard)', 20, 30); g.fillText(SUFX ? 'neu' + SUFX + ' (dust2=1)' : 'neu (dust2=1: Pixel-Deckel, Drift zur Kurvenaußenseite)', 1300, 30)
      if (performance.now() - t0 < SEC * 1000 && !(a.ended && n.ended)) requestAnimationFrame(f); else res() }; const t0 = performance.now(); requestAnimationFrame(f) })   // MediaRecorder-WebM hat keine Dauer, 'ended' ist unzuverlässig: feste Länge
    rec.stop(); await new Promise((r) => (rec.onstop = r)); await Promise.all(pend) }, { SEC: 11.6, SUFX: SUF })
  await b.close(); fs.unlinkSync(path.join(OUT, '_nebeneinander.html')); return { file, bytes: fs.statSync(file).size }
}
if (process.env.SBS_ONLY) { console.log(JSON.stringify(await sideBySide())); process.exit(0) }   // nur das Nebeneinander-Video neu zusammensetzen
const alt = await run('alt'), neu = await run('neu'), still = await run('neu', { clip: false, stills: true }), stillN = SUF ? await run('neu', { clip: false, stills: true, tod: 'night' }) : null, sbs = await sideBySide()
const ix = JSON.parse(fs.readFileSync(path.join(OUT, 'index.json'), 'utf8')), KEY = SUF ? 'lieferung' + SUF.replace('-', '_') : 'lieferung'
ix[KEY] = { date: new Date().toISOString(), hash: BASE + ' (+ ,tod=day|night, ,dust2=1 für neu)', fahrt: PLAN.map((p) => `${p[1]} ${p[0]} s`).join(' → '),
  videos: [{ file: path.basename(alt.file), bytes: alt.bytes, sekunden: alt.seconds }, { file: path.basename(neu.file), bytes: neu.bytes, sekunden: neu.seconds }, { file: path.basename(sbs.file), bytes: sbs.bytes }],
  hinweis_standbilder: 'alt/neu im selben Moment: Staub-Shader UND Partikelfarbe werden getauscht (alte Farbe je Partikel mitgeführt). Partikel-Lagen = neue Fassung (Drift-Wurf); den Unterschied der Fahne zeigt das Video. Bilder aus dem Bildpuffer wie auf dem Bildschirm (ein sRGB-Render-Ziel zeigte den alten Staub zu hell).' }
const mk = (tod, st) => st.shots.flatMap((s) => ['alt', 'neu'].flatMap((v) => [{ file: `${s}-${tod}-${v}${SUF}.jpg`, objekt: 'staub-spielkamera', fall: `${s}-${tod}-${v}`, hash: BASE + ',tod=' + tod + ',dust2=1' }, { file: `${s}-${tod}-${v}-1zu1${SUF}.jpg`, objekt: 'staub-1zu1', fall: `${s}-${tod}-${v}`, hash: BASE + ',tod=' + tod + ',dust2=1' }]))
ix[SUF ? 'shots' + SUF.replace('-', '_') : 'shots'] = [...mk('day', still), ...(stillN ? mk('night', stillN) : [])]
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(ix, null, 1))
console.log(JSON.stringify({ alt, neu, still, stillN, sbs }))
