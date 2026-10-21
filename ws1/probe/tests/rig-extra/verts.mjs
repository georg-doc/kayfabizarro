// Hilfsabfrage: Eckpunkte in einer Box -> stdout JSON
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const [id, mn, mx] = [process.argv[2], JSON.parse(process.argv[3]), JSON.parse(process.argv[4])]
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage(); await page.goto('http://127.0.0.1:8794/probe/tests/rig-extra/survey.html'); await page.waitForFunction(() => window.ready === true)
console.log(JSON.stringify(await page.evaluate(([id, mn, mx]) => window.verts(id, mn, mx), [id, mn, mx])))
await browser.close()
