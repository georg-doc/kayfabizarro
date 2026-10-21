// Probe · Nahaufnahme Wagenschatten (Georg 21.10.: pixelig/Treppen). Drei Bilder: alles an, ohne Boden-AO, ohne Schattenkarte.
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.getByRole('button', { name: 'Fahren', exact: true }).click()
await page.evaluate(() => { let best = null; for (let i = 0; i < 300; i++) { const x = (Math.random() - 0.5) * 200, z = (Math.random() - 0.5) * 200, e = 1, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)); if (__hgt(x, z) > __S.water * __S.amp + 0.5 && Math.hypot(x, z) > 60 && (!best || s < best[0])) best = [s, x, z] } __probeTP(best[1], best[2]) })
await page.waitForTimeout(1500); await page.mouse.move(370, 330); for (let i = 0; i < 2; i++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(80) } await page.waitForTimeout(1500)
const shot = async (n) => { await page.waitForTimeout(800); await page.screenshot({ path: `${OUT}/shadow-${n}.png`, clip: { x: 200, y: 280, width: 340, height: 220 } }) }
await shot('all')
console.log(await page.evaluate(() => JSON.stringify({ ground: __S.ground, shadows: __S.shadows, ao: __S.ao })))
await browser.close()
