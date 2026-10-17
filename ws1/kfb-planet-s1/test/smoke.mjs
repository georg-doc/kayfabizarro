// Headless-Test: lädt Spiel, läuft, springt, fliegt, prüft Zustände, macht Screenshots
import { chromium } from 'playwright'
const OUT = process.argv[2] || '.'
const url = process.argv[3] || 'http://localhost:8765/'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } })
const errs = []
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 300)) })
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
const t0 = Date.now()
await page.goto(url)
await page.waitForFunction(() => window.__kfb, null, { timeout: 60000 })
console.log('geladen in', Date.now() - t0, 'ms')
const st = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__kfb)))
const fps = () => page.evaluate(() => new Promise((r) => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 2000) requestAnimationFrame(f); else r(n / 2) }; requestAnimationFrame(f) }))
await page.waitForTimeout(2500)
console.log('start', await st(), 'fps', await fps())
await page.screenshot({ path: `${OUT}/01_start.png` })
// Laufen vorwärts 6 s, Positionen loggen
await page.keyboard.down('KeyW')
for (let i = 0; i < 6; i++) { await page.waitForTimeout(1000); const s = await st(); console.log('walk', i, s.pos.map((v) => v.toFixed(1)).join(','), 'alt', s.altitude.toFixed(2), 'ground', s.grounded) }
await page.screenshot({ path: `${OUT}/02_walk.png` })
await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(4000); await page.keyboard.up('ShiftLeft')
console.log('run', await st())
await page.keyboard.up('KeyW')
await page.keyboard.press('Space'); await page.waitForTimeout(250); console.log('jump', await st())
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/03_after_run.png` })
// Fliegen
await page.keyboard.press('KeyF'); await page.waitForTimeout(1200); console.log('fly up', await st())
await page.screenshot({ path: `${OUT}/04_fly.png` })
await page.keyboard.press('KeyF'); await page.waitForTimeout(3000); console.log('after land', await st())
// Bauen
await page.getByText('Bauen', { exact: true }).click(); await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/05_build.png` })
console.log('errors:', errs.slice(0, 15))
await browser.close()
