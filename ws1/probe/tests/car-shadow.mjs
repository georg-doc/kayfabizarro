// Probe · Wagenschatten-Befund (Georg 21.10.: „riesiger Auto-Schatten, nicht unser KayKit-Konzept“). Übersicht nah am Wagen, Bilder:
// a = Stand · b = Wagen wirft keinen Schatten · c = nur das Modell wirft (Düsen/Glühen/Bänder aus) · Liste aller Schattenwerfer unter carRoot.
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(800)
await page.evaluate(async () => { let best = null; for (let i = 0; i < 400; i++) { const x = (Math.random() - 0.5) * 200, z = (Math.random() - 0.5) * 200, e = 2, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)); if (__hgt(x, z) > __S.water * __S.amp + 1 && Math.hypot(x, z) > 50 && (!best || s < best[0])) best = [s, x, z] } __probeDrive().placeCar(best[1], best[2], 0.3); await new Promise((r) => setTimeout(r, 2000)) })
await page.getByRole('button', { name: 'Übersicht', exact: true }).click(); await page.waitForTimeout(800)
await page.evaluate(() => __probeCam(0.9, 0.9, 14)); await page.waitForTimeout(1500)
const casters = await page.evaluate(() => { const out = []; __probeDrive().carRoot.traverse((o) => { if ((o.isMesh || o.isSprite) && o.castShadow) { o.geometry.computeBoundingBox?.(); const b = o.geometry.boundingBox, s = new THREE.Vector3(); o.getWorldScale(s); out.push({ name: o.name || o.type, type: o.type, vis: o.visible, size: b ? [(b.max.x - b.min.x) * s.x, (b.max.y - b.min.y) * s.y, (b.max.z - b.min.z) * s.z].map((v) => +v.toFixed(2)) : null }) } }); return out })
console.log(JSON.stringify(casters))
const shot = (n) => page.screenshot({ path: `${OUT}/carsh-${n}.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
await shot('a')
await page.evaluate(() => __probeDrive().carRoot.traverse((o) => { if (o.isMesh) { o.userData._cs = o.castShadow; o.castShadow = false } })); await page.waitForTimeout(800); await shot('b')
await page.evaluate(() => __probeDrive().carRoot.traverse((o) => { if (o.isMesh) o.castShadow = o.name === 'rustwing_cruiser' })); await page.waitForTimeout(800); await shot('c')
console.log('errs', errs.slice(0, 2)); await browser.close()
