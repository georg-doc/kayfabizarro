// Abnahme-Bilder Racer (Lead 22.10. für Georgs Abnahme-Seite mit Zoom und A/B-Wischregler): Einzelbilder 1600×900 @2, JPG 88, ohne Testtexte (#clean).
// Ablage ~/kfb-ws1/research/audits/abnahme/racer/<racer>-<fall>.jpg + index.json (Datei, Racer, Fall, Hash). Nur mit Test-Slot.
//   matte-std / matte-vmatte          nah, Tag, Wagen steht, Effekte eingefroren; A und B im selben Moment (Mattierung zur Laufzeit umgeschaltet)
//   front-std / front-vmatte          Schrägansicht vorn-oben (Licht auf der Lackfläche), ebenso
//   look-<tag|gold|nacht>-<nah|fahrt|uebersicht>
//   flamme                            hinten-seitlich bei Gas, nah
// Aufruf: node test/racer-abnahme.mjs [racer,racer,…]
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/racer'); fs.mkdirSync(OUT, { recursive: true })
const RAC = (process.argv[2] || 'crimson_flame_dragster,crimson_thunderjet,wasteland_beetle,rust_runner').split(',')
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0', VP = { width: 1600, height: 900 }, index = []
const HIDE = '#m2-kind,#m2-keys{display:none!important}'

async function open(extra) {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), errs = []
  const page = await (await browser.newContext({ viewport: VP, deviceScaleFactor: 2 })).newPage(); page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + extra + ',racer=' + RAC[0]); await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  await page.addStyleTag({ content: HIDE }); await page.mouse.click(800, 450); await page.waitForTimeout(1500); return { browser, page, errs }
}
const swap = (page, id) => page.evaluate(async (id) => { const M = window.__kfbM2; if (M.stats.modelId !== id) M.setRacer(id); await new Promise((res) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id ? res() : setTimeout(w, 50)); w() }) }, id)
const reset = async (page) => { await page.evaluate(() => window.__kfbM2.setKind('k2b', null)); await page.waitForTimeout(1200) }
// Wagen auf einen Anteil der Bildhöhe bringen (Hülle 0,8 ≈ sichtbar 60 %, die Hüllen-Ecken sind höher als die Form): Debug-Kameralage relativ zum Wagen (camPose), Abstand schrittweise nachgeführt (nur Karosserie gemessen)
const bodyFrac = (page) => page.evaluate(() => { const M = window.__kfbM2, cam = M.camera(), root = M.stats.rig?.stretch; if (!root || !cam) return null
  let lo = 1, hi = -1; const v = new cam.position.constructor(); root.updateMatrixWorld(true)
  root.traverse((o) => { if (!o.isMesh || !o.geometry || [].concat(o.material).some((m) => m.isShaderMaterial || m.isSpriteMaterial)) return; o.geometry.computeBoundingBox?.(); const bb = o.geometry.boundingBox; if (!bb) return
    for (let k = 0; k < 8; k++) { v.set(k & 1 ? bb.max.x : bb.min.x, k & 2 ? bb.max.y : bb.min.y, k & 4 ? bb.max.z : bb.min.z).applyMatrix4(o.matrixWorld).project(cam); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y) } })
  return (hi - lo) / 2 })
const pose = async (page, yaw, pitch, frac) => { let dist = 9
  for (let i = 0; i < 8; i++) { await page.evaluate((p) => window.__kfbM2.camPose(p), { dist, yaw, pitch, ty: 0.8 }); await page.waitForTimeout(250); const h = await bodyFrac(page); if (h == null) break; if (Math.abs(h - frac) < 0.03) break; dist *= Math.pow(h / frac, 0.9) }
  await page.waitForTimeout(400) }
const unpose = (page) => page.evaluate(() => window.__kfbM2.camPose(null))
const shoot = async (page, id, fall, hash) => { const f = `${id}-${fall}.jpg`; await sharp(await page.screenshot()).jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, racer: id, fall, hash: BASE + hash + ',racer=' + id }); console.log('ok', f) }
const frames = (page, n = 3) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)) }, n)

// 1 Mattierung: Tag, Wagen steht, A/B im selben Moment
{ const { browser, page, errs } = await open('')
  for (const id of RAC) { await swap(page, id)
    for (const [view, fall] of [[[Math.PI - 0.7, 0.28], 'matte'], [[0.6, 0.55], 'front']]) { await reset(page); await pose(page, view[0], view[1], 0.8)
      await page.evaluate(() => window.__kfbM2.freeze(true)); await page.evaluate(() => window.__kfbM2.setMatte(false)); await frames(page); await shoot(page, id, fall + '-std', '')
      await page.evaluate(() => window.__kfbM2.setMatte(true)); await frames(page); await shoot(page, id, fall + '-vmatte', ',vmatte=1'); await page.evaluate(() => { window.__kfbM2.setMatte(false); window.__kfbM2.freeze(false) }); await unpose(page) } }
  if (errs.length) console.log('errs', errs.slice(0, 3)); await browser.close() }

// 2 Look Tag/Gold/Nacht × nah/Fahrt/Übersicht · 3 Flamme nah (nur Tag)
for (const [tod, th] of [['tag', ''], ['gold', ',tod=gold'], ['nacht', ',tod=night']]) {
  const { browser, page, errs } = await open(th)
  for (const id of RAC) { await swap(page, id)
    await reset(page); await pose(page, Math.PI - 0.7, 0.28, 0.8); await shoot(page, id, `look-${tod}-nah`, th); await unpose(page)
    await reset(page); await page.keyboard.down('KeyW'); await page.waitForTimeout(1700); await shoot(page, id, `look-${tod}-fahrt`, th); await page.keyboard.up('KeyW')
    await reset(page); await page.evaluate(() => { const f = window.__kfbM2.stats.follow; f.orbit(0.3, 0.35); for (let i = 0; i < 8; i++) f.zoomBy(400) }); await page.keyboard.down('KeyW'); await page.waitForTimeout(1800); await shoot(page, id, `look-${tod}-uebersicht`, th); await page.keyboard.up('KeyW')
    if (tod === 'tag') { await reset(page); await page.keyboard.down('KeyW'); await pose(page, Math.PI - 0.75, 0.12, 0.7); await page.waitForTimeout(300); await shoot(page, id, 'flamme', th); await page.keyboard.up('KeyW'); await unpose(page) } }
  if (errs.length) console.log('errs', errs.slice(0, 3)); await browser.close() }

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: '1600x900@2', quality: 88, source: 'kfb-planet ws1/vehicles-r1 test/racer-abnahme.mjs', items: index }, null, 1))
console.log('PASS racer-abnahme', index.length, 'Bilder →', OUT)
