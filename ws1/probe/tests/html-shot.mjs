import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const [src, out, w] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +(w || 1700), height: 300 } }); await p.goto('file://' + src); await p.screenshot({ path: out, fullPage: true }); await b.close()
