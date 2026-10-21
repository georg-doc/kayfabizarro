// Kontaktbogen: node sheet.mjs out.png cols w img1 img2 ...
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import fs from 'fs'
const [out, cols, w, ...imgs] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: cols * w, height: 400 } })
const html = `<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},${w}px);background:#222;font:12px sans-serif;color:#fff">` + imgs.map((f) => `<div style="position:relative"><img style="width:${w}px;display:block" src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}"><span style="position:absolute;left:4px;bottom:4px;background:#000a;padding:2px 4px">${f.split('/').pop()}</span></div>`).join('') + '</body>'
await p.setContent(html); await p.waitForTimeout(300); await p.screenshot({ path: out, fullPage: true }); await b.close()
