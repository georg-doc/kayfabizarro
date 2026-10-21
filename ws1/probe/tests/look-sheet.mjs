// Bogen aus tests/out/vehicles/look-<id>-<mode>.png: Zeile je Wagen, Spalten Original / A Lack / B Knete
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { readdirSync, readFileSync } from 'node:fs'
const D = 'tests/out/vehicles', ids = [...new Set(readdirSync(D).filter((f) => /^look-.*-0\.png$/.test(f)).map((f) => f.slice(5, -6)))].filter((i) => !process.argv[3] || process.argv[3].split(',').includes(i))
const img = (f) => `data:image/png;base64,${readFileSync(`${D}/${f}`).toString('base64')}`
const html = `<body style="margin:0;background:#20242a;color:#eee;font:15px system-ui"><div style="display:grid;grid-template-columns:150px repeat(3,300px);gap:4px;padding:8px">
<div></div><b>Original (heute)</b><b>A · Lack (Vorschlag)</b><b>B · Knete matt</b>${ids.map((i) => `<div style="align-self:center">${i.replace(/_/g, ' ')}</div>${[0, 1, 2].map((m) => `<img src="${img(`look-${i}-${m}.png`)}" style="width:300px">`).join('')}`).join('')}</div></body>`
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 400 } }); await p.setContent(html); await p.screenshot({ path: process.argv[2] || `${D}/look-sheet.png`, fullPage: true }); await b.close(); console.log('ok', ids.length)
