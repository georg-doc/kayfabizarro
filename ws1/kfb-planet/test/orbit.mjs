// V-257 · Bühnen-Kamera (#stage, Standard near): ein Prüfpunkt je Eigenschaft – Standard-Blick beim Start, Drehen hält den Abstand,
// Zoom zum Cursor, nie unter 0,5 m (V-203), Sprungmarken „Standard“/„Nah“ landen genau, Fokus per Doppelklick, ruhig nach dem Loslassen (V-026).
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,actors=none', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbStageMods?.amph?.status().status === 'OK' && window.__kfbStageMods?.billboard?.info()?.source && window.__kfbStageOrbit, null, { timeout: 240000 })
await page.waitForTimeout(800)
const cam = () => page.evaluate(() => { const c = window.__kfbStageCamera, t = window.__kfbStageOrbit.controls.target; return { p: c.position.toArray(), t: t.toArray(), d: c.position.distanceTo(t) } })
const settle = () => page.waitForFunction(() => !window.__kfbStageOrbit.glide(), null, { timeout: 20000 }).then(() => page.waitForTimeout(1500))
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const c0 = await cam(), marks = await page.evaluate(() => { const m = window.__kfbStageOrbit.marks(); return { std: m.standard.pos.toArray(), stdT: m.standard.target.toArray(), nah: m.nah.pos.toArray() } })
// Drehen: waagrecht ziehen
await page.mouse.move(640, 360); await page.mouse.down(); for (let i = 1; i <= 10; i++) await page.mouse.move(640 + i * 30, 360); await page.mouse.up(); await page.waitForTimeout(1500)
const c1 = await cam()
// ruhig: nach dem Loslassen kommt die Kamera zur Ruhe (Schritte je Bild klingen ab, kein Zittern)
const steps = await page.evaluate(() => new Promise((ok) => { const c = window.__kfbStageCamera, out = []; let last = c.position.clone(), n = 0; const f = () => { out.push(c.position.distanceTo(last)); last = c.position.clone(); if (++n < 40) requestAnimationFrame(f); else ok(out) }; requestAnimationFrame(f) }))
// Zoom zum Cursor: Rad am rechten Bildrand → Abstand kleiner, Ziel wandert zur Cursor-Seite
const tBefore = (await cam()).t; await page.mouse.move(1000, 360); for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(150) } await page.waitForTimeout(1500)
const c2 = await cam()
// nie unter 0,5 m: stark nach oben ziehen (Kamera kippt nach unten)
await page.mouse.move(640, 200); await page.mouse.down(); for (let i = 1; i <= 15; i++) await page.mouse.move(640, 200 + i * 40); await page.mouse.up(); await page.waitForTimeout(1500)
const c3 = await cam()
// Sprungmarken über die Knöpfe
await page.click('#kfb-cam-marks [data-mark="nah"]'); await settle(); const cN = await cam()
await page.click('#kfb-cam-marks [data-mark="standard"]'); await settle(); const cS = await cam()
// Fokus: Doppelklick auf die Kartenfläche (Mitte der Tafel im Standard-Blick)
const face = await page.evaluate(() => { const f = window.__kfbStageMods.billboard.object3d.getObjectByName('face'), c = window.__kfbStageCamera, V = c.position.constructor; f.updateWorldMatrix(true, false); const w = f.getWorldPosition(new V()), p = w.clone().project(c); return { w: w.toArray(), px: [(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight] } })
await page.mouse.dblclick(face.px[0], face.px[1]); await settle(); const cF = await cam()
// Ein- und Ausschalten über den Griff (M1-Prüfer 5, N1/N2): aus = Steuerung und Knöpfe weg, Kamera unberührt; ein = sofort wirksam, Gleiten zum Startblick, Bildfeld überblendet
const sw = await page.evaluate(async () => { const O = window.__kfbStageOrbit, cam = window.__kfbStageCamera, wait = (ms) => new Promise((r) => setTimeout(r, ms))
  O.setActive(false); const off = { enabled: O.controls.enabled, btn: document.getElementById('kfb-cam-marks').style.display, active: O.active() }
  cam.position.set(6, 3, 6); cam.fov = 55; cam.updateProjectionMatrix(); cam.lookAt(0, 2, -3); await wait(400); const stayed = cam.position.toArray().map((v) => +v.toFixed(4)), fovStayed = cam.fov
  O.setActive(true); const on0 = { enabled: O.controls.enabled, glide: O.glide(), fov0: cam.fov, btn: document.getElementById('kfb-cam-marks').style.display }
  let mid = null; for (let t0 = Date.now(); Date.now() - t0 < 30000 && O.glide();) { await wait(50); if (mid == null && cam.fov < 54.5 && cam.fov > 38.5) mid = cam.fov }
  return { off, stayed, fovStayed, on0, mid, fov: cam.fov, pos: cam.position.toArray(), std: O.marks().standard.pos.toArray() } })
await browser.close()
const yaw = (c) => Math.atan2(c.p[0] - c.t[0], c.p[2] - c.t[2])
process.exit(report('orbit camera V-257', {
  startsAtStandardView: dist(c0.p, marks.std) < 0.01 && dist(c0.t, marks.stdT) < 0.01,
  rotateKeepsDistance: Math.abs(yaw(c1) - yaw(c0)) > 0.2 && Math.abs(c1.d - c0.d) < 0.05 * c0.d,
  calmAfterRelease: steps.every((x, i) => i === 0 || x <= steps[i - 1] * 1.05 + 1e-6) && steps[steps.length - 1] < steps[0] / 5, // klingt gleichmäßig ab, kein Zittern (V-026 geglätteter Arm)
  zoomTowardCursor: c2.d < c1.d * 0.9 && dist(c2.t, tBefore) > 0.05,
  neverBelowHalfMetre: c3.p[1] >= 0.5 - 1e-6,
  jumpMarkNah: dist(cN.p, marks.nah) < 0.02 && Math.abs(cN.d - 0.6 * c0.d) < 0.05,
  jumpMarkStandard: dist(cS.p, marks.std) < 0.02 && dist(cS.t, marks.stdT) < 0.02,
  offLeavesCameraAlone: sw.off.enabled === false && sw.off.btn === 'none' && sw.off.active === false && JSON.stringify(sw.stayed) === JSON.stringify([6, 3, 6]) && sw.fovStayed === 55,
  onGlidesBackFovBlended: sw.on0.enabled === true && sw.on0.glide === true && sw.on0.fov0 === 55 && sw.on0.btn === 'flex' && sw.mid != null && Math.abs(sw.fov - 38) < 0.01 && dist(sw.pos, sw.std) < 0.05,
  focusOnDoubleClick: dist(cF.t, face.w) < 0.6 && dist(cF.t, marks.stdT) > 0.01,
  noPageErrors: errs.length === 0,
}, { c0, c1, c2, c3, cN, cS, cF, face, steps: steps.map((x) => +x.toFixed(4)), errs }))
