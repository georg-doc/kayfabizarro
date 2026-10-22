// Abnahme Scheinwerfer-Tune (Georg 22.10.: zwei getrennte Kegel mit rundem Ende, tagsüber leiser): A = alte Werte, B = Tune, im selben Moment und mit
// derselben Kamera (HEADLIGHT_TUNE zur Laufzeit + HEADLIGHTS.rebuild, Antrieb eingefroren). Einzelbilder 1600×900 @2, JPG 88, #debug,clean.
// Ablage ~/kfb-ws1/research/audits/abnahme/scheinwerfer/<racer>-<tag|gold|nacht>-<alt|neu>.jpg + index.json. Nur mit Test-Slot.
// Aufruf: node test/headlight-abnahme.mjs [racer,racer,…]
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/scheinwerfer'); fs.mkdirSync(OUT, { recursive: true })
const RAC = (process.argv[2] || 'crimson_flame_dragster,crimson_thunderjet,wasteland_beetle,rust_runner').split(',')
const BASE = '#m1,car,debug,clean,look=terrain3,world=probe,prefetch=0', VP = { width: 1600, height: 900 }, index = []
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
    for (const [lab, on, h] of [['alt', false, ',hlt=0'], ['neu', true, '']]) { await page.evaluate((on) => { window.__kfbM2.headlightTune.on = on; window.__kfbM2.headlights.rebuild?.() }, on); await page.waitForTimeout(700); await shoot(page, id, `${tod}-${lab}`, th + h) }
    await page.evaluate(() => { window.__kfbM2.freeze(false); window.__kfbM2.camPose(null) }) }
  if (errs.length) console.log('errs', errs.slice(0, 3)); await browser.close() }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: '1600x900@2', quality: 88, source: 'kfb-planet ws1/vehicles-r1 test/headlight-abnahme.mjs', ab: 'alt = hlt=0 (Werte bis 22.10.), neu = Tune', items: index }, null, 1))
console.log('PASS headlight-abnahme', index.length, 'Bilder →', OUT)
