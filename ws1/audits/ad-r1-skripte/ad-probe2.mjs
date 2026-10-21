// AD-Audit R1 · Probe: Ein/Aus-Vergleiche und Stimmungen
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2]
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 90000 })
await page.waitForTimeout(1500)
const set = (o) => page.evaluate((o) => { for (const [id, v] of Object.entries(o)) { const el = document.getElementById(id); if (el.type === 'checkbox') el.checked = v; else el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) } }, o)
const stage = await page.locator('#stage').boundingBox(); const clip = { x: stage.x, y: stage.y, width: stage.width, height: stage.height }
const shot = async (n, w = 1500) => { await page.waitForTimeout(w); await page.screenshot({ path: `${OUT}/${n}.png`, clip }) }
const cam = (y, p, d) => page.evaluate(([y, p, d]) => __probeCam(y, p, d), [y, p, d])
await set({ sunel: '12', water: '0.06', fluid: '3', ground: false })
// Steine: welche sind weiß?
await cam(0.6, 0.35, 70); await shot('ab-rockc-an')
await set({ rockc: false }); await shot('ab-rockc-aus'); await set({ rockc: true })
// Sonne/Flare
await cam(2.6, 0.08, 120); await set({ flare: false }); await shot('ab-flare-aus'); await set({ flare: true })
// Sonnenstand-Reihe gleiche Kamera
for (const s of ['4', '30', '70']) { await set({ sunel: s }); await cam(0.6, 0.35, 70); await shot('sun-' + s) }
await set({ sunel: '12' })
// Stimmungen
for (const t of ['gold', 'nacht']) { await set({ tod: t }); await cam(2.2, 0.12, 120); await shot('tod-' + t, 2000) }
await set({ tod: 'tag' })
// Wasser-Fluids nah
for (const f of ['3', '0']) { await set({ fluid: f }); await cam(1.4, 0.4, 40); await shot('fluid-' + f, 2000) }
await set({ fluid: '3' })
// Erdung an vs aus, Fahrt im offenen Gelände, Boost + Sprung
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(1200)
const pos = await page.evaluate(() => { let best = null; for (let i = 0; i < 600; i++) { const x = (Math.random() - 0.5) * 220, z = (Math.random() - 0.5) * 220, e = 1, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)); if (__hgt(x, z) > __S.water * __S.amp + 1.5 && Math.hypot(x, z - 70) > 45 && (!best || s < best[0])) best = [s, x, z] } __probeDrive().placeCar(best[1], best[2], 0.3); return best })
console.log('pos', pos)
await shot('drive-ground-aus', 2500); await set({ ground: true }); await shot('drive-ground-an', 1500); await set({ ground: false })
await page.keyboard.down('KeyW'); await page.waitForTimeout(1200); await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(700); await shot('vfx-boost', 0)
await page.keyboard.down('Space'); await page.waitForTimeout(450); await page.keyboard.up('Space'); await shot('vfx-sprung', 250)
await page.keyboard.up('ShiftLeft'); await page.keyboard.down('KeyQ'); await page.waitForTimeout(600); await shot('vfx-drift', 0); await page.keyboard.up('KeyQ'); await page.keyboard.up('KeyW')
await page.waitForTimeout(2500); await shot('vfx-landung', 0)
console.log('errs', JSON.stringify(errs.slice(0, 3))); await browser.close()
