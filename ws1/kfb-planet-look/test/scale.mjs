// V-345 · J17-Meter auf der Bühne: FB 1,81 m (2,94 Rig × 0,616 m/Rig), Verhältnis FB : GothGirl wie vorher, Amphitheater 14 alte WS1-Meter = 9,1 m,
// Bild des Amphitheaters gleich wie die alte, 1,54-fach große Bühne (wscale=legacy: alles gleichmäßig verkleinert, Kamera mit), Meshy-Bühne Goblin
// (Slot in WS0-Metern, figures.heights_m 1,8/2,0) mit FB ≈ 1,81 m.
import sharp from 'sharp'
import { openPage, report } from './_page.mjs'
import { WORLD_K, FB_HEIGHT_M } from '../src/worldScale.js'
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S.left?.status().shown && S.right?.status().shown !== false && (S.billboard ? S.billboard.info()?.source : true) }, null, { timeout: 420000 })
const probe = (page) => page.evaluate(() => {
  const S = window.__kfbStageMods
  const height = (a) => { let lo = Infinity, hi = -Infinity; a.object3d.updateWorldMatrix(true, true); a.object3d.traverse((o) => { if (o.isMesh && o.geometry && o.visible) { o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); lo = Math.min(lo, b.min.y); hi = Math.max(hi, b.max.y) } }); return +(hi - lo).toFixed(3) }
  return { k: window.__kfbStageCtl.worldK, fb: height(S.left), gg: height(S.right), stageR: S.amph.status().info?.stageR ?? null, left: S.left.object3d.position.toArray().map((v) => +v.toFixed(3)) }
})
const run = async (h, W = 960, H = 540) => { const o = await openPage('#stage,debug,actors=fb,light=l1,tod=day,nobar' + h, { viewport: { width: W, height: H } }); await ready(o.page); await o.page.waitForTimeout(2500)
  await o.page.evaluate(() => { for (const id of ['kfb-cam-marks', 'kfb-compare']) document.getElementById(id)?.style.setProperty('display', 'none') })
  const p = await probe(o.page), img = await o.page.screenshot(); await o.browser.close(); return { ...p, img, errs: o.errs.length } }
const neu = await run(''), old = await run(',wscale=legacy'), gob = await run(',scene=goblin')
// mittlere Abweichung je Pixel (0–255) zwischen alter und neuer Bühne
const raw = async (b) => (await sharp(b).raw().toBuffer({ resolveWithObject: true }))
const A = await raw(neu.img), B = await raw(old.img); let d = 0; for (let i = 0; i < A.data.length; i++) d += Math.abs(A.data[i] - B.data[i]); const meanDiff = +(d / A.data.length).toFixed(2)
process.exit(report('scale V-345 (J17-Meter)', {
  kIsJ17: Math.abs(neu.k - WORLD_K) < 1e-9 && old.k === 1 && Math.abs(WORLD_K - 0.6509) < 0.001,
  fbIs181m: Math.abs(neu.fb - FB_HEIGHT_M) < 0.05, // gemessen über die Hüllboxen im Bind-Zustand (Ohren eingeschlossen)
  oldWas154x: Math.abs(old.fb / neu.fb - 1 / WORLD_K) < 0.02,
  ratioFbGgKept: Math.abs(neu.fb / neu.gg - old.fb / old.gg) < 0.01,
  amphStage91m: Math.abs(neu.stageR - 7 * WORLD_K) < 1e-3 && old.stageR === 7,
  amphImageUnchanged: meanDiff < 6, // gleichmäßig verkleinert samt Kamera: nur Nebel, Schatten-Texel und Knet-Abstände dürfen sich leicht ändern
  goblinFbLikeSlot: Math.abs(gob.fb - FB_HEIGHT_M) < 0.05, // Slot: figures.heights_m [1,8, 2,0]
  noPageErrors: neu.errs + old.errs + gob.errs === 0,
}, { neu: { k: neu.k, fb: neu.fb, gg: neu.gg, stageR: neu.stageR, left: neu.left }, old: { fb: old.fb, gg: old.gg, stageR: old.stageR, left: old.left }, gob: { fb: gob.fb, gg: gob.gg }, meanDiff }))
