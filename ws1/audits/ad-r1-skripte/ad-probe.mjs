// AD-Audit R1 · Bildserie Gelände-Probe. Aufruf: node ad-probe.mjs <out> <std|georg|georgE> (georgE = Georgs Werte mit Erdung an)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2], MODE = process.argv[3] || 'std'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 90000 })
await page.waitForTimeout(1500)
if (MODE.startsWith('georg')) await page.evaluate((g) => { const set = (id, v) => { const el = document.getElementById(id); if (el.type === 'checkbox') el.checked = v; else el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }; set('sunel', '12'); set('water', '0.06'); set('fluid', '3'); set('ground', g) }, MODE === 'georgE')
await page.waitForTimeout(1500)
const stage = await page.locator('#stage').boundingBox()
const clip = { x: stage.x, y: stage.y, width: stage.width, height: stage.height }
const shot = async (n, wait = 1200) => { await page.waitForTimeout(wait); await page.screenshot({ path: `${OUT}/${MODE}-${n}.png`, clip }) }
console.log(MODE, await page.evaluate(() => JSON.stringify({ sunel: __S.sunel, water: __S.water, fluid: __S.fluid, ground: __S.ground, palA: __S.palA, tod: __S.tod })))
// 1 Übersicht (Standardkamera)
await shot('01-uebersicht', 2500)
await page.screenshot({ path: `${OUT}/${MODE}-00-seite.png`, fullPage: false })
// 2 Übersicht flach Richtung Horizont
await page.evaluate(() => __probeCam(0.6, 0.12, 160)); await shot('02-horizont', 2000)
await page.evaluate(() => __probeCam(2.6, 0.08, 120)); await shot('03-horizont-gegen', 2000)
// Fahren
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(1500)
await shot('04-fahrt-start', 1500)
// Ufer suchen (wenn Wasser)
const info = await page.evaluate(async () => { const S = __S, wl = S.water * S.amp + 0.15; let best = null
  if (S.water > 0) for (let i = 0; i < 4000; i++) { const x = (Math.random() - 0.5) * 260, z = (Math.random() - 0.5) * 260, h = __hgt(x, z); if (h > wl + 0.6 && h < wl + 1.5) { const a = Math.random() * 6.283, x2 = x + Math.cos(a) * 9, z2 = z + Math.sin(a) * 9; if (__hgt(x2, z2) < wl - 1) { best = { x, z, yaw: Math.atan2(Math.cos(a), Math.sin(a)) }; break } } }
  if (best) __probeDrive().placeCar(best.x - Math.sin(best.yaw) * 4, best.z - Math.cos(best.yaw) * 4, best.yaw)
  await new Promise((r) => setTimeout(r, 2500)); return { wl, best } })
console.log('ufer', JSON.stringify(info))
if (info.best) { await shot('05-ufer-fahrt', 1000) }
// flaches Stück für Schatten/Erdung, nah
await page.evaluate(() => { let best = null; for (let i = 0; i < 400; i++) { const x = (Math.random() - 0.5) * 200, z = (Math.random() - 0.5) * 200, e = 1, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)); if (__hgt(x, z) > __S.water * __S.amp + 0.5 && Math.hypot(x, z) > 40 && (!best || s < best[0])) best = [s, x, z] } __probeTP(best[1], best[2]) })
await page.waitForTimeout(1500); await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2); for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(80) }
await shot('06-wagen-nah', 2000)
// Fahrt mit Boost (VFX)
await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/${MODE}-07-boost.png`, clip })
await page.keyboard.down('Space'); await page.waitForTimeout(500); await page.keyboard.up('Space'); await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/${MODE}-08-sprung.png`, clip })
await page.keyboard.up('ShiftLeft'); await page.waitForTimeout(2500)
await page.screenshot({ path: `${OUT}/${MODE}-09-fahrt.png`, clip })
await page.keyboard.up('KeyW')
// Übersicht nah (mittel)
await page.getByRole('button', { name: 'Übersicht', exact: true }).click(); await page.waitForTimeout(1500)
await page.evaluate(() => __probeCam(0.6, 0.35, 45)); await shot('10-mittel', 2000)
await page.evaluate(() => __probeCam(0.6, 0.55, 14)); await shot('11-nah', 2000)
if (info.best) { await page.evaluate((b) => { __probeDrive().placeCar(b.x, b.z, b.yaw) }, info.best); await page.waitForTimeout(800); await page.evaluate(() => __probeCam(1.4, 0.3, 30)); await shot('12-ufer-orbit', 2500) }
console.log('errs', JSON.stringify(errs.slice(0, 3)))
await browser.close()
