// Abnahme-Bilder Startseite (Lead 22.10., Georg: Einzelbilder in voller Auflösung): Vorhang zu mit Tafel, öffnend, offen; breit und Handy
import path from 'path'
import fs from 'fs'
import { chromium } from 'playwright'
const OUT = process.env.OUT || path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/start'); fs.mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu'] })
for (const [tag, vp, dpr] of [['breit', { width: 1600, height: 900 }, 2], ['handy', { width: 390, height: 844 }, 3]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: dpr }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto('file://' + path.resolve('dist/index.html') + '#m1,harvest,look=terrain3,world=probe,start')
  await p.waitForSelector('.kfb-start .go', { timeout: 60000 }); await p.waitForFunction(() => document.querySelector('.kfb-start .go')?.textContent.includes('Vorhang auf!'), null, { timeout: 300000 }).catch(() => {})
  await p.waitForTimeout(2500); await p.screenshot({ path: `${OUT}/${tag}-1-vorhang-zu.jpg`, quality: 90, type: 'jpeg' })
  await p.click('.kfb-start .go'); await p.waitForTimeout(1300); await p.screenshot({ path: `${OUT}/${tag}-2-oeffnet.jpg`, quality: 90, type: 'jpeg' })
  await p.waitForTimeout(1800); await p.screenshot({ path: `${OUT}/${tag}-3-offen.jpg`, quality: 90, type: 'jpeg' })
  console.log(tag, errs.slice(0, 2)); await p.close()
}
await b.close()
