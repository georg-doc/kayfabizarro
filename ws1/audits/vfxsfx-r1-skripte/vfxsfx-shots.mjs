// VFX/SFX-Audit R1 · Probe-Bilder: Fahrt, Boost, Sprung/Landung, Wasser, Drift – mit Standard und Georgs Werten (Sonne 12°, Erdung aus). Nur lesend.
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2], TAG = process.argv[3] || 'std'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
if (TAG === 'georg') await page.evaluate(() => { const set = (id, v) => { const e = document.getElementById(id); if (e.type === 'checkbox') e.checked = v; else e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })) }; set('sunel', 12); set('ground', false) })
await page.evaluate(() => { const e = document.getElementById('water'); e.value = 0.12; e.dispatchEvent(new Event('input', { bubbles: true })) }); await page.waitForTimeout(500)
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(800)
const W = await page.evaluate(() => __S.water * __S.amp)
// flache Landstelle weit vom Wasser und eine Uferstelle
const spots = await page.evaluate((wl) => { let flat = null, shore = null
  for (let i = 0; i < 3000; i++) { const x = (Math.random() - 0.5) * 400, z = (Math.random() - 0.5) * 400, e = 2, h = __hgt(x, z), s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e))
    if (h > wl + 2 && Math.hypot(x, z) > 40 && (!flat || s < flat[0])) flat = [s, x, z]
    if (h > wl + 0.3 && h < wl + 1.2 && __hgt(x + 25, z) < wl - 0.5 && (!shore || s < shore[0])) shore = [s, x, z] }
  return { flat, shore } }, W)
console.log('water', W, JSON.stringify(spots))
const shot = (n) => page.screenshot({ path: `${OUT}/vfx-${TAG}-${n}.png`, clip: { x: 16, y: 106, width: 724, height: 452 } })
const hud = () => page.evaluate(() => [...document.querySelectorAll('[id^=hud]')].map((e) => e.textContent).join(' | '))
await page.evaluate(([x, z]) => __probeDrive().placeCar(x, z, 0.3), [spots.flat[1], spots.flat[2]]); await page.waitForTimeout(1500)
await shot('1-stand'); console.log('1', await hud())
await page.keyboard.down('KeyW'); await page.waitForTimeout(3500); await shot('2-fahrt'); console.log('2', await hud())
await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(250); await shot('3-boost-stoss'); await page.waitForTimeout(1200); await shot('3b-boost'); console.log('3', await hud())
await page.keyboard.up('ShiftLeft')
await page.keyboard.down('Space'); await page.waitForTimeout(120); await page.keyboard.up('Space'); await page.waitForTimeout(350); await shot('5-sprung'); console.log('5', await hud())
// Landung abwarten und Moment des Aufkommens fotografieren
const tl0 = await page.evaluate(async () => { const t0 = performance.now(); while (__probeDrive().P.air && performance.now() - t0 < 4000) await new Promise((r) => requestAnimationFrame(r)); return performance.now() - t0 })
await shot('6-landung'); console.log('6 land after', Math.round(tl0), await hud())
await page.keyboard.down('KeyQ'); await page.keyboard.down('KeyA'); await page.waitForTimeout(900); await shot('4-drift'); console.log('4', await hud()); await page.keyboard.up('KeyQ'); await page.keyboard.up('KeyA')

await page.keyboard.up('KeyW')
if (spots.shore) { await page.evaluate(([x, z]) => __probeDrive().placeCar(x, z, Math.PI / 2), [spots.shore[1], spots.shore[2]]); await page.waitForTimeout(1200)
  await page.keyboard.down('KeyW'); await page.waitForTimeout(2200); await shot('7-wasser'); console.log('7', await hud()); await page.keyboard.up('KeyW') }
console.log('errs', errs.slice(0, 3)); await browser.close()
