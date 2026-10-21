/* Bild der kfb-edge-Vorschau (file://, kein Server) → tests/out/edge-preview.png */
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'
import fs from 'fs'
const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = process.argv[2] || path.join(HERE, '..', 'tests', 'out', 'edge-preview.png')
fs.mkdirSync(path.dirname(OUT), { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
page.on('console', (m) => { if (m.type() === 'error') console.log('KONSOLE', m.text()) })
page.on('pageerror', (e) => console.log('SEITENFEHLER', e.message))
await page.goto(pathToFileURL(path.join(HERE, 'kfb-edge-preview.html')).href)
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 })
await page.waitForTimeout(500)
await page.screenshot({ path: OUT })
console.log(JSON.stringify(await page.evaluate(() => window.__report.map((r) => ({ seed: r.seed, tiles_in: r.tiles_in, tiles_cut: r.tiles_cut, intact_tiles: r.intact_tiles, intact_rest: r.intact_rest, pieces: r.pieces, missing: r.missing, tris: r.tris, stages: r.stages })))))
console.log('BILD', OUT)
await browser.close()
