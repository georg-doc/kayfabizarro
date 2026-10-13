import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://localhost:8765/#debug')
await page.waitForFunction(() => window.__kfbDebug && window.__kfb, null, { timeout: 60000 })
for (const k of ['1', '1', '1', '1', '1']) { await page.keyboard.press(k); await page.waitForTimeout(200) }
await page.evaluate(() => window.__kfbDebug.teleport(45.8, 30, -28.5, false))
for (let i = 0; i < 6; i++) { await page.waitForTimeout(700); const s = await page.evaluate(() => window.__kfb); console.log(i, s.pos.map((v) => v.toFixed(2)).join(','), s.grounded) }
await page.screenshot({ path: `${OUT}/43_probe.png` })
await page.evaluate(() => window.__kfbDebug.teleport(2, 6, 2, false))
for (let i = 0; i < 4; i++) { await page.waitForTimeout(700); const s = await page.evaluate(() => window.__kfb); console.log('spawn', i, s.pos.map((v) => v.toFixed(2)).join(','), s.grounded) }
await browser.close()
