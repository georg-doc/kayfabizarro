// Prüfbilder: Heck (ortho) | Seite hinten (ortho) | 3/4 hinten-oben mit Markern je Anker -> ../out/vehicles/<id>-anchors.png
// Aufruf: node shots.mjs picks.json [id ...]   (picks: { id: [{type,pos,dir,r}] }); optional --zoom für eine Heck-Nahaufnahme
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire('/Users/georgvonwestphalen/kfb-ws1/thrust-survey/survey.mjs')
const sharp = require('sharp')
const HERE = new URL('.', import.meta.url).pathname, OUT = HERE + '../out/vehicles/'
const args = process.argv.slice(2), zoom = args.includes('--zoom'), rest = args.filter((a) => a !== '--zoom')
const picks = JSON.parse(fs.readFileSync(HERE + rest[0], 'utf8')), ids = rest.slice(1).length ? rest.slice(1) : Object.keys(picks)
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
await page.goto('http://127.0.0.1:8794/probe/tests/rig-extra/survey.html'); await page.waitForFunction(() => window.ready === true)
for (const id of ids) {
  const an = picks[id].map((a) => ({ type: a.type || 'thrust', pos: a.pos, dir: a.dir, r: a.r ?? a.radius }))
  let z = null
  if (zoom && an.length) { const xs = an.map((a) => a.pos[0]), ys = an.map((a) => a.pos[1]); z = { c: [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2], half: Math.max(0.5, (Math.max(...ys) - Math.min(...ys)) / 2 + 0.6, ((Math.max(...xs) - Math.min(...xs)) / 2 + 0.6) * 600 / 760) } }
  const shots = await page.evaluate(([id, an, z]) => window.anchorShots(id, an, 760, 600, z), [id, an, z])
  const bufs = shots.map((u) => Buffer.from(u.split(',')[1], 'base64'))
  const file = OUT + id + (zoom ? '-anchors-zoom.png' : '-anchors.png')
  await sharp({ create: { width: 760 * bufs.length, height: 600, channels: 3, background: '#000' } }).composite(bufs.map((b, i) => ({ input: b, left: 760 * i, top: 0 }))).png().toFile(file)
  console.log(file)
}
await browser.close()
