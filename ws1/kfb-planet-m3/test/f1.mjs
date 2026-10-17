// F1 Augen · KFB-Eye-Rig auf Rogue_Hooded (Georgs Profil ADJUSTED_APPROVED, 19.09.) im R3F-Rahmen, Prüfszene #eyetest.
// Prüft: Spender byte-gleich, Modulvertrag (Status, Bereinigung der Original-Augen), Messwerte = Studio-Referenz
// (test/ref/f1_studio_rogue_hooded.report.json, aufgenommen aus dem Studio-Quellcode), symmetrische Augenlage
// (keine Anker-Drehung, V-201), Blick folgt Blickziel parallel, Lidschlag schließt, Bild gegen Studio-Referenz.
import fs from 'fs'
import crypto from 'crypto'
import { openPage, report } from './_page.mjs'
const blob = (f) => { const b = fs.readFileSync(f); return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`), b])).digest('hex') }
const VENDOR = {
  'pet-eye-rig.v6.js': '853bcf5fb090dd6564fda8bc83d0b4cb527e6b26', 'facehost.v1.js': '38ec7770f5fccf3aca93ee234f94b801d527d415',
  'eyeoval.v1.js': '55b9dbb9bb74b662c96d61c3261643e9fd181c55', // Spender 90c5e44b + freigegebene Lid-Naht (WS0 14.10., Diff in WS1_STATUS §15) 'donoreyes.v1.js': 'b0b46bdca058e0feb3dbe18b7067b3d30e625395',
  'pet-library.v6.js': '45d0679127740adaa83f57027e2de41e0e778c4b', 'kaykit-eye-adapter.v1.js': 'f09b39bbd1e56597907fcb17e38fb15262da9036',
  'medium-source-eye-cleanup.v1.js': 'c66a08e9f36b2ea7946ebe8b4289e25eb7a1f607', 'source-face-cleanup.v1.js': '7c0404b7dfaa3f6db44366a90dd1226848d49e15',
  'face-color-sampler.v1.js': '7155595290f8d46bfec789cc50ce0ed2e0e7be5b',
}
const vendorBad = Object.entries(VENDOR).filter(([f, h]) => blob('src/vendor/eyes/' + f) !== h).map(([f]) => f)
const assetsOk = blob('src/assets/actors/Rogue_Hooded.glb') === '7063f6cbca7fd2445c9b804a9f157c11c0e7b0f2' && blob('src/assets/actors/Rig_Medium_General.glb') === '5d16cb6815fc8371705147188813f851c10ba26a' && blob('src/data/eyes/kfb-pet-graft-driver.v4.json') === 'f202a1c2f1670ab6045176af6621c94041124e76'
const REF = JSON.parse(fs.readFileSync('test/ref/f1_studio_rogue_hooded.report.json', 'utf8'))
const PROFILE = JSON.parse(fs.readFileSync('src/data/eyes/rogue-hooded.profile.json', 'utf8')).profile

const { browser, page, errs } = await openPage('#eyetest,debug', { viewport: { width: 900, height: 900 } }) // wie das Studio-Bild
await page.waitForFunction(() => window.__kfbEyeActor && window.__kfbEyeActor.status().status !== 'LOADING', null, { timeout: 90000 })
await page.waitForTimeout(500)
const st = await page.evaluate(() => window.__kfbEyeActor.status())
const rep = await page.evaluate(() => window.__kfbEyeActor.report())
// Blick: Pupillen-Weltpositionen vor/nach Blickziel links (beide Augen müssen sich gleich gerichtet bewegen)
// Blickrichtung je Auge = Weltrichtung des Pupillen-Drehpunkts (pet-eye-rig.v6 mkEye: Kinder [Sklera, puPivot, Lider])
const pupils = () => page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); return rig.eyes.map((e) => { const piv = e.children[1]; const d = piv.getWorldDirection(new piv.position.constructor()); return [d.x, d.y] }) })
const p0 = await pupils()
await page.evaluate(() => window.__kfbEyeActor.lookAt(-0.85, 0)); await page.waitForTimeout(800)
const pL = await pupils()
await page.evaluate(() => window.__kfbEyeActor.lookAt(null))
// Lidschlag: in der Mitte gehalten, Lider müssen sichtbar zugehen (Bildvergleich Augenbereich offen vs. zu)
const eyeCrop = { x: 300, y: 170, width: 300, height: 110 }
// Offen-Bild ohne zufälligen Lidschlag: Auto-Blinzeln anhalten und den Blick zur Ruhe kommen lassen (unter Last fiel das Bild sonst ins Blinzeln)
await page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); rig._blinkK = -1; rig.__blinkT = rig._blinkT; rig._blinkT = 1e9 }); await page.waitForTimeout(700)
const open1 = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 }); await page.waitForTimeout(400)
const shut = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); rig.blink.dur = rig.__dur; rig._blinkK = -1; rig._blinkT = rig.__blinkT ?? 0 })
const full = await page.screenshot()
// Modulvertrag §6 (Muster test/host.mjs): create 1× auch nach Re-Renders, update bekommt ctx, dispose 1× beim Aushängen,
// danach kein update; jede Geometrie und jedes Material von Figur, Eye-Rig und FaceHost wird freigegeben (dispose-Ereignis).
for (let i = 0; i < 5; i++) await page.evaluate(() => window.__kfbEyeTestCtl.rerender())
await page.waitForTimeout(600)
const before = await page.evaluate(() => {
  const parts = window.__kfbEyeActor.debugParts(), geos = new Set(), mats = new Set()
  for (const p of parts) p.traverse((m) => { if (!m.isMesh) return; geos.add(m.geometry); (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x && mats.add(x)) })
  window.__freedSet = { g: new Set(), m: new Set() } // eindeutig: doppelte Freigabe (Spender räumt Teile selbst) zählt einmal
  geos.forEach((g) => g.addEventListener('dispose', () => window.__freedSet.g.add(g.uuid))); mats.forEach((x) => x.addEventListener('dispose', () => window.__freedSet.m.add(x.uuid)))
  return { geos: geos.size, mats: mats.size, log: window.__kfbEyeTestCtl.log() }
})
await page.evaluate(() => window.__kfbEyeTestCtl.off())
await page.waitForTimeout(600)
const after = await page.evaluate(() => ({ log: window.__kfbEyeTestCtl.log(), freed: { g: window.__freedSet.g.size, m: window.__freedSet.m.size } }))
await page.waitForTimeout(800)
const later = await page.evaluate(() => window.__kfbEyeTestCtl.log().update)
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/f1_front.png', full); fs.writeFileSync('test/out/f1_eyes_open.png', open1); fs.writeFileSync('test/out/f1_eyes_shut.png', shut)
// Bildvergleich gegen Studio-Referenz (gleiche Kamera, 900 × 900) und offen/zu
const cmp = await page.evaluate(async ([a, b, o, s]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const px = (img, x, y, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h); return c.getContext('2d').getImageData(0, 0, w, h).data }
  const diff = (A, B) => { let d = 0; for (let i = 0; i < A.length; i += 4) for (let k = 0; k < 3; k++) d += Math.abs(A[i + k] - B[i + k]); return d / (A.length / 4 * 3) }
  // Augenweiß (Sklera #f3ede2): hell und kaum gesättigt; ein geschlossenes Lid (Hautton) deckt es ab
  const white = (A) => { let n = 0; for (let i = 0; i < A.length; i += 4) { const r = A[i], g = A[i + 1], b = A[i + 2]; if (Math.min(r, g, b) > 215 && Math.max(r, g, b) - Math.min(r, g, b) < 22) n++ } return n }
  const [R, S, O, Z] = await Promise.all([load(a), load(b), load(o), load(s)])
  // Pupille (matte-cute, fast schwarz): sehr dunkel. Bei geschlossenem Lid darf davon nichts sichtbar bleiben (WS0-Abgleich 14.10., P0).
  // Pupille = neutrales Schwarz; Brauen/Lidschatten sind dunkel, aber farbig und zählen nicht
  const dark = (A) => { let n = 0; for (let i = 0; i < A.length; i += 4) { const mx = Math.max(A[i], A[i + 1], A[i + 2]), mn = Math.min(A[i], A[i + 1], A[i + 2]); if (mx < 45 && mx - mn < 10) n++ } return n }
  const PO = px(O, 0, 0, O.width, O.height), PZ = px(Z, 0, 0, Z.width, Z.height)
  return { faceVsStudio: diff(px(R, 250, 90, 400, 260), px(S, 250, 90, 400, 260)), whiteOpen: white(PO), whiteShut: white(PZ), pupilOpen: dark(PO), pupilShut: dark(PZ) }
}, ['data:image/png;base64,' + full.toString('base64'), 'data:image/png;base64,' + fs.readFileSync('test/ref/f1_studio_front.png').toString('base64'), 'data:image/png;base64,' + open1.toString('base64'), 'data:image/png;base64,' + shut.toString('base64')])
await browser.close()

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const c = rep?.controls || {}, e = rep?.eyeFrame || {}
const dxL = pL[0][0] - p0[0][0], dxR = pL[1][0] - p0[1][0]
const code = report('f1 eyes', {
  vendorByteIdentical: vendorBad.length === 0,
  assetsPinned: assetsOk,
  mounted: st.status === 'OK',
  sourceEyesRemoved: st.cleanup === 'AUTO_CANDIDATE_GENERIC' && st.log.some((l) => /138 Dreiecke/.test(l)),
  profileValuesApplied: same(c.anchor, PROFILE.eye.anchor) && c.pupilSize === PROFILE.eye.pupilSize && c.converge === PROFILE.eye.converge && c.pupilStyle === PROFILE.eye.pupilStyle,
  controlsEqualStudio: same(c, REF.controls),
  eyeFrameEqualStudio: same(e, REF.eyeFrame),
  symmetricNoAnchorRotation: !!e.left && e.left[0] === -e.right[0] && e.left[1] === e.right[1] && e.left[2] === e.right[2],
  // Blinzeln, Leben, Kinetik exakt wie Georgs Profil im Studio (Kinetik steht dort auf aus: Abweichung zu WS0-Wortlaut, gemeldet)
  blinkLifeKineticsAsStudio: same(c.blink, REF.controls.blink) && same(c.life, REF.controls.life) && same(c.kinetics, REF.controls.kinetics) && c.blink?.enabled !== false,
  contractCreateOnce: before.log.create === 1,
  contractUpdateGetsCtx: before.log.update > 5 && before.log.lastCtx?.hasCam === true,
  contractDisposeOnce: after.log.dispose === 1 && later === after.log.update,
  contractAllFreed: before.geos > 5 && after.freed.g === before.geos && after.freed.m === before.mats,
  gazeParallel: dxL < -0.003 && dxR < -0.003 && Math.abs(dxL - dxR) < Math.max(Math.abs(dxL), Math.abs(dxR)) * 0.5,
  lidsCoverSclera: cmp.whiteOpen > 800 && cmp.whiteShut < cmp.whiteOpen * 0.25, // Augenweiß verschwindet zu mehr als 75 % (sagt nichts über die Pupille)
  imageMatchesStudio: cmp.faceVsStudio < 6,
  pupilHiddenWhenClosed: cmp.pupilOpen > 300 && cmp.pupilShut <= cmp.pupilOpen * 0.05, // nach freigegebener Lid-Naht (eyeoval seatPupils)
  noPageErrors: errs.length === 0,
}, {
  contract: { before, after, later }, kinetics: c.kinetics, life: c.life, st: { status: st.status, cleanup: st.cleanup }, eyeFrame: e, dx: [dxL, dxR], cmp, vendorBad, errs })
process.exit(code)
