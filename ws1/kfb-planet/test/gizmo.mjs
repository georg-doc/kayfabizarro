import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8765/')
await page.waitForFunction(() => window.__kfbDebug, null, { timeout: 60000 })
await page.evaluate(() => window.__kfbDebug.teleport(52, 32, -38, false)); await page.waitForTimeout(2500)
await page.getByText('Bauen', { exact: true }).click(); await page.waitForTimeout(400)
await page.getByText('Gefängnis', { exact: true }).click(); await page.waitForTimeout(2000)
await page.mouse.click(640, 380); await page.waitForTimeout(800)
const before = await page.evaluate(() => JSON.parse(localStorage.getItem('kfb-planet-spike-r1-objects')).length)
const g = await page.evaluate(() => window.__kfbEditor.gizmoScreen()); console.log('gizmo', JSON.stringify(g))
const [ax, ay] = g.xAxis, [cx, cy] = g.center, dx = ax - cx, dy = ay - cy
await page.mouse.move(ax, ay); await page.waitForTimeout(400); await page.mouse.down()
for (let i = 1; i <= 10; i++) { await page.mouse.move(ax + dx * i * 0.4, ay + dy * i * 0.4); await page.waitForTimeout(80) }
await page.mouse.up(); await page.waitForTimeout(1000)
console.log('gizmo after', JSON.stringify(await page.evaluate(() => window.__kfbEditor.gizmoScreen())))
await page.screenshot({ path: `${OUT}/15_after_drag.png` })
// Neue Wand setzen: Klick ins Leere abwählen, dann Klick auf Planet
await page.keyboard.press('Escape'); await page.getByText('Säule', { exact: true }).click()
await page.mouse.click(820, 520); await page.waitForTimeout(1000)
const after = await page.evaluate(() => JSON.parse(localStorage.getItem('kfb-planet-spike-r1-objects')))
console.log('count before', before, 'after', after.length, 'last', after[after.length-1].kind, 'edited', after.filter(o=>o.v).map(o=>o.id+':'+o.dir.map(v=>v.toFixed(2))))
await page.screenshot({ path: `${OUT}/16_after_place.png` })
console.log('errors', errs); await browser.close()
