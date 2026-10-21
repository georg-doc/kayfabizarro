// Kontaktbogen aller 14: gleiche Kamera (3/4 vorn-links, fester Abstand in Rig-Einheiten), gleiches neutrales Licht
// (Hemisphäre 0xfff4e0/0x3a3226 1,25 + Sonne 1,8, NoToneMapping, sRGB) -> ../out/vehicles/all14.png
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire('/Users/georgvonwestphalen/kfb-ws1/thrust-survey/survey.mjs')
const sharp = require('sharp')
const HERE = new URL('.', import.meta.url).pathname
const IDS = ['rustwing_cruiser', 'graffiti_jet_cruiser', 'street_racer_hoverbeast', 'crimson_flame_dragster', 'crimson_thunderjet', 'ironclad_skycruiser', 'brasswing_roadster',
  'iron_phantom_hovercar', 'ironclad_wrecker', 'jetbound_roadster', 'rust_runner', 'rustfire_interceptor', 'rustwing_hauler', 'wasteland_beetle']
const COL = JSON.parse(fs.readFileSync(HERE + 'colors-extra.json', 'utf8')).vehicles
const TW = 480, TH = 360, LBL = 58, COLS = 7
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
await page.goto('http://127.0.0.1:8794/probe/tests/rig-extra/survey.html'); await page.waitForFunction(() => window.ready === true)
const comp = []
for (const [i, id] of IDS.entries()) {
  const url = await page.evaluate(([id, w, h]) => window.sheetTile(id, w, h, 14), [id, TW, TH])
  const j = JSON.parse(fs.readFileSync(HERE + 'json/' + id + '.json', 'utf8')), c = COL[id], x = (i % COLS) * TW, y = Math.floor(i / COLS) * (TH + LBL)
  comp.push({ input: Buffer.from(url.split(',')[1], 'base64'), left: x, top: y })
  const neu = i >= 6 ? ' · neu' : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${LBL}"><rect width="100%" height="100%" fill="#1c1b19"/>
    <text x="10" y="22" font-family="Helvetica" font-size="17" fill="#f2efe8">${j.name_de}${neu}</text>
    <text x="10" y="45" font-family="Helvetica" font-size="13" fill="#bdb8ae">${id} · Sätt. ${c.texSat.toFixed(2)} · Lum ${c.texLumLin.toFixed(3)} · Metall ${c.metalMean} · Rauh ${c.roughMean}${c.emissiveMap ? ' · Emissive' : ''}</text>
    <rect x="${TW - 92}" y="10" width="24" height="24" fill="${c.glow.core}"/><rect x="${TW - 64}" y="10" width="24" height="24" fill="${c.glow.plume}"/><rect x="${TW - 36}" y="10" width="24" height="24" fill="${c.glow.spark}"/></svg>`
  comp.push({ input: Buffer.from(svg), left: x, top: y + TH })
}
await sharp({ create: { width: TW * COLS, height: 2 * (TH + LBL), channels: 3, background: '#000' } }).composite(comp).png().toFile(HERE + '../out/vehicles/all14.png')
console.log('all14.png')
await browser.close()
