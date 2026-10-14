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
  'eyeoval.v1.js': '90c5e44b17bbb59b1cc26dc5dc943f1091cd5b3b', 'donoreyes.v1.js': 'b0b46bdca058e0feb3dbe18b7067b3d30e625395',
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
const open1 = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 }); await page.waitForTimeout(400)
const shut = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbEyeActor.debugRig(); rig.blink.dur = rig.__dur; rig._blinkK = -1 })
const full = await page.screenshot()
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/f1_front.png', full)
// Bildvergleich gegen Studio-Referenz (gleiche Kamera, 900 × 900) und offen/zu
const cmp = await page.evaluate(async ([a, b, o, s]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const px = (img, x, y, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h); return c.getContext('2d').getImageData(0, 0, w, h).data }
  const diff = (A, B) => { let d = 0; for (let i = 0; i < A.length; i += 4) for (let k = 0; k < 3; k++) d += Math.abs(A[i + k] - B[i + k]); return d / (A.length / 4 * 3) }
  const [R, S, O, Z] = await Promise.all([load(a), load(b), load(o), load(s)])
  return { faceVsStudio: diff(px(R, 250, 90, 400, 260), px(S, 250, 90, 400, 260)), openVsShut: diff(px(O, 0, 0, O.width, O.height), px(Z, 0, 0, Z.width, Z.height)) }
}, ['data:image/png;base64,' + full.toString('base64'), 'data:image/png;base64,' + fs.readFileSync('test/ref/f1_studio_front.png').toString('base64'), 'data:image/png;base64,' + open1.toString('base64'), 'data:image/png;base64,' + shut.toString('base64')])
await browser.close()

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const c = rep?.controls || {}, e = rep?.eyeFrame || {}
const dxL = pL[0][0] - p0[0][0], dxR = pL[1][0] - p0[1][0]
process.exit(report('f1 eyes', {
  vendorByteIdentical: vendorBad.length === 0,
  assetsPinned: assetsOk,
  mounted: st.status === 'OK',
  sourceEyesRemoved: st.cleanup === 'AUTO_CANDIDATE_GENERIC' && st.log.some((l) => /138 Dreiecke/.test(l)),
  profileValuesApplied: same(c.anchor, PROFILE.eye.anchor) && c.pupilSize === PROFILE.eye.pupilSize && c.converge === PROFILE.eye.converge && c.pupilStyle === PROFILE.eye.pupilStyle,
  controlsEqualStudio: same(c, REF.controls),
  eyeFrameEqualStudio: same(e, REF.eyeFrame),
  symmetricNoAnchorRotation: !!e.left && e.left[0] === -e.right[0] && e.left[1] === e.right[1] && e.left[2] === e.right[2],
  blinkLifeKineticsOn: !!c.blink && !!c.life && !!c.kinetics && same(c.blink, REF.controls.blink),
  gazeParallel: dxL < -0.003 && dxR < -0.003 && Math.abs(dxL - dxR) < Math.max(Math.abs(dxL), Math.abs(dxR)) * 0.5,
  lidsClose: cmp.openVsShut > 4,
  imageMatchesStudio: cmp.faceVsStudio < 6,
  noPageErrors: errs.length === 0,
}, { st: { status: st.status, cleanup: st.cleanup }, eyeFrame: e, dx: [dxL, dxR], cmp, vendorBad, errs }))
