/* Parität kfbEdgeD GPU ↔ JS: lädt kfb-edge-parity.html über file:// (kein Server), Metal-GPU wie die Probe-Tests. Aufruf: node kfb-edge-parity.mjs */
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'
const HERE = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('SEITENFEHLER', e.message))
await page.goto(pathToFileURL(path.join(HERE, 'kfb-edge-parity.html')).href)
await page.waitForFunction(() => window.__parity, null, { timeout: 30000 })
const r = await page.evaluate(() => window.__parity)
await browser.close()
if (r.error) { console.log('FAIL  Parität:', r.error); process.exit(1) }
console.log(`${r.ok ? 'PASS' : 'FAIL'}  Parität kfbEdgeD GPU ↔ JS  · ${r.n} Punkte (${r.inBand} im Band 0 < D < 1), max |ΔD| ${r.maxAbsD.toExponential(2)} (mit strength), ${r.maxAbsD_strength1.toExponential(2)} (strength 1), mittel ${r.meanAbsD.toExponential(2)}; earth max |Δ| ${r.maxAbsEarth.toExponential(2)}, S max |Δ| ${r.maxAbsS.toExponential(2)} · GPU: ${r.gpu}`)
process.exit(r.ok ? 0 : 1)
