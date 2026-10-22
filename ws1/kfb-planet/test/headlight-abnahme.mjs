// Abnahme Scheinwerfer-Tune (Georg 22.10.: zwei getrennte Kegel mit rundem Ende, tagsüber leiser): A = alte Werte, B = Tune, im selben Moment und mit
// derselben Kamera (HEADLIGHT_TUNE zur Laufzeit + HEADLIGHTS.rebuild, Antrieb eingefroren). Einzelbilder 1600×900 @2, JPG 88, #debug,clean.
// Ablage ~/kfb-ws1/research/audits/abnahme/scheinwerfer2/ (HL_OUT): <racer>-<tag|gold|nacht>-<alt|neu>.jpg, dazu <racer>-nah-nacht-<alt|neu>.jpg
// (schräg von vorn-seitlich: Übergang Lampe → Kegel), <racer>-hang-nacht-<alt|neu>.jpg (Seitenansicht bergauf) + index.json. Nur mit Test-Slot.
// Aufruf: node test/headlight-abnahme.mjs [racer,racer,…]
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/' + (process.env.HL_OUT || 'scheinwerfer3'));
fs.mkdirSync(OUT, { recursive: true })
const A = process.env.HL_A || 'v2', B = process.env.HL_B || 'v3'   // A/B-Stufen: alt | v2 | v3
const RAC = (process.argv[2] || 'crimson_flame_dragster,crimson_thunderjet,wasteland_beetle,rust_runner').split(',')
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0', VP = { width: 1600, height: 900 }, index = []
let HANG = null
async function open(extra) {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), errs = []
  const page = await (await browser.newContext({ viewport: VP, deviceScaleFactor: 2 })).newPage(); page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + BASE + extra + ',racer=' + RAC[0]); await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  await page.addStyleTag({ content: '#m2-kind,#m2-keys{display:none!important}' }); await page.mouse.click(800, 450); await page.waitForTimeout(1500); return { browser, page, errs }
}
const swap = (page, id) => page.evaluate(async (id) => { const M = window.__kfbM2; if (M.stats.modelId !== id) M.setRacer(id); await new Promise((res) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id && M.headlights.inst ? res() : setTimeout(w, 50)); w() }) }, id)
const shoot = async (page, id, fall, hash) => { const f = `${id}-${fall}.jpg`; await sharp(await page.screenshot()).jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, racer: id, fall, hash: BASE + hash + ',racer=' + id }); console.log('ok', f) }
for (const [tod, th] of [['tag', ''], ['gold', ',tod=gold'], ['nacht', ',tod=night']]) {
  const { browser, page, errs } = await open(th)
  for (const id of RAC) { await swap(page, id); await page.evaluate(() => window.__kfbM2.setKind('k2b', null)); await page.waitForTimeout(1500)
    // von hinten oben, Ziel 6 m vor dem Wagen: beide Lichtflecken und der Wagen im Bild
    await page.evaluate(() => { window.__kfbM2.camPose({ dist: 12, yaw: Math.PI, pitch: 0.62, ty: 0.3, ahead: 7 }); window.__kfbM2.freeze('rig') }); await page.waitForTimeout(800)
    for (const [lab, mode] of [['alt', A], ['neu', B]]) { await page.evaluate((mode) => { window.__kfbM2.headlightTune.mode = mode; window.__kfbM2.headlights.rebuild?.() }, mode); await page.waitForTimeout(700); await shoot(page, id, `${tod}-${lab}`, th + ',hlt=' + (mode === 'alt' ? '0' : mode)) }
    if (tod === 'nacht') { // Nahbild schräg von vorn-seitlich: Lampe und Ansatz des Kegels
      await page.evaluate(() => window.__kfbM2.camPose({ dist: 8.5, yaw: 1.3, pitch: 0.32, ty: 0.3, ahead: 3.5 })); await page.waitForTimeout(800)
      for (const [lab, mode] of [['alt', A], ['neu', B]]) { await page.evaluate((mode) => { window.__kfbM2.headlightTune.mode = mode; window.__kfbM2.headlights.rebuild?.() }, mode); await page.waitForTimeout(700); await shoot(page, id, `nah-nacht-${lab}`, th + ',hlt=' + (mode === 'alt' ? '0' : mode)) } }
    if (tod === 'nacht') { // Seitenansicht am Hang: Wagen bergauf auf einer Stelle mit 25–40 % Steigung (einmal gesucht), Kamera von der Seite
      HANG ||= await page.evaluate(() => { const g = window.__kfbM2.ground, c = window.__kfbM2.car().pos(); let best = null
        for (let k = 0; k < 3000; k++) { const a = k * 2.399963, r = 6 + 120 * Math.sqrt(k / 3000), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r
          for (let j = 0; j < 8; j++) { const h = j * Math.PI / 4, sl = (g(x + Math.sin(h) * 10, z + Math.cos(h) * 10) - g(x, z)) / 10, side = Math.abs(g(x + Math.cos(h) * 3, z - Math.sin(h) * 3) - g(x - Math.cos(h) * 3, z + Math.sin(h) * 3)) / 6
            if (sl > 0.25 && sl < 0.4 && side < 0.1 && (!best || Math.abs(sl - 0.32) < Math.abs(best.s - 0.32))) best = { x, z, yaw: h, s: sl } } } return best })
      if (HANG) { await page.evaluate((s) => { window.__kfbM2.freeze(false); window.__kfbM2.setKind('k2b', { p: [s.x, window.__kfbM2.ground(s.x, s.z) + 1.5, s.z], yaw: s.yaw }) }, HANG); await page.waitForTimeout(3000)
        await page.evaluate(() => { window.__kfbM2.camPose({ dist: 10, yaw: 1.45, pitch: 0.18, ty: 0.3, ahead: 4 }); window.__kfbM2.freeze('rig') }); await page.waitForTimeout(800)
        for (const [lab, mode] of [['alt', A], ['neu', B]]) { await page.evaluate((mode) => { window.__kfbM2.headlightTune.mode = mode; window.__kfbM2.headlights.rebuild?.() }, mode); await page.waitForTimeout(700); await shoot(page, id, `hang-nacht-${lab}`, th + ',hlt=' + (mode === 'alt' ? '0' : mode)) } } }
    await page.evaluate(() => { window.__kfbM2.freeze(false); window.__kfbM2.camPose(null) }) }
  if (errs.length) console.log('errs', errs.slice(0, 3)); await browser.close() }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: '1600x900@2', quality: 88, source: 'kfb-planet ws1/vehicles-r1 test/headlight-abnahme.mjs', ab: `alt = ${A}, neu = ${B} (hlt=0 | v2 | v3)`, items: index }, null, 1))
console.log('PASS headlight-abnahme', index.length, 'Bilder →', OUT)
