// Probe · Wagenschatten am Startplatz in Georgs Übersicht (21.10.: „riesiger, verwaschener Schatten“). Ausschnitt um den Wagen in doppelter Auflösung:
// a = Stand · s = ohne Sonnenschatten · g = ohne Boden-AO · w = Wagen wirft nicht
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.waitForTimeout(3000)
const SUNEL = process.argv[3]; if (SUNEL) await page.evaluate((v) => { const el = document.getElementById('sunel'); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })) }, SUNEL)
const fix = () => page.evaluate(() => __probeCam(0.75, 0.62, 70))
await fix(); await page.waitForTimeout(1500)
const box = await page.evaluate(() => { const d = __probeDrive(), v = new THREE.Vector3(0, d.P.y, 0).project(d.camera), cv = document.getElementById('cv').getBoundingClientRect(); return { x: cv.left + (v.x + 1) / 2 * cv.width, y: cv.top + (1 - v.y) / 2 * cv.height } })
const clip = { x: box.x - 110, y: box.y - 70, width: 220, height: 140 }
const shot = async (n) => { await fix(); await page.waitForTimeout(900); await fix(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/sp-${n}.png`, clip }) }
const tog = (id, v) => page.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.checked !== v) el.click() }, { id, v })
await shot('a')
await tog('shadows', false); await shot('s'); await tog('shadows', true)
await tog('ground', false); await shot('g'); await tog('ground', true)
await page.evaluate(() => __probeDrive().carRoot.traverse((o) => { if (o.isMesh) o.castShadow = false })); await shot('w')
console.log(JSON.stringify(box)); await browser.close()
