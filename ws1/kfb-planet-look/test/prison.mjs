// Gefängnisplanet: Landung, Laufen im Labyrinth, Bauen mit Gizmo
import { chromium } from 'playwright'
const OUT = process.argv[2] || '.'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } })
const errs = []
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)) })
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
await page.goto('http://localhost:8765/')
await page.waitForFunction(() => window.__kfbDebug, null, { timeout: 60000 })
const st = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__kfb)))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/10_start_cam.png` })
// über dem Labyrinth-Eingang absetzen (Gefängnisplanet-Zentrum 52,14,-26; Kappe zeigt nach +y)
await page.evaluate(() => window.__kfbDebug.teleport(52, 14 + 12 + 6, -26 - 12, false))
for (let i = 0; i < 4; i++) { await page.waitForTimeout(1000); const s = await st(); console.log('fall', i, s.planet, s.altitude.toFixed(2), s.grounded) }
await page.screenshot({ path: `${OUT}/11_prison_landed.png` })
await page.keyboard.down('KeyW'); await page.waitForTimeout(3000); await page.keyboard.up('KeyW')
console.log('walked', await st())
await page.screenshot({ path: `${OUT}/12_prison_walk.png` })
await page.getByText('Bauen', { exact: true }).click(); await page.waitForTimeout(500)
await page.getByText('Gefängnis', { exact: true }).click(); await page.waitForTimeout(2000)
await page.screenshot({ path: `${OUT}/13_build_prison.png` })
// Wand anklicken (Bildmitte = Kappenmitte ungefähr) -> Auswahl + Gizmo
await page.mouse.click(640, 380); await page.waitForTimeout(800)
console.log('selected', await page.evaluate(() => document.querySelector('.hud').innerText.includes('Löschen')))
await page.screenshot({ path: `${OUT}/14_build_select.png` })
console.log('errors:', errs.slice(0, 10))
await browser.close()
