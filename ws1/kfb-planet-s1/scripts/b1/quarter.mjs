// Rohe Viertelseite aus cardImage() (Host-Dienst) als PNG + die Billboard-Leinwand, zum Vergleich auf Beschnitt.
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const card = process.argv[2] || 'forget_utopia:1', [d, n] = card.split(':')
const { browser, page } = await openPage(`#stagetest,debug,card=${card}`, { viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbBillboard?.info()?.source === 'CARD', null, { timeout: 180000 })
const r = await page.evaluate(async ([d, n]) => { const x = await window.__kfbCardImage(d, +n); return { w: x?.w, h: x?.h, page: x?.page, quad: x?.quad, url: x?.png } }, [d, n])
fs.writeFileSync('test/out/quarter_raw.png', Buffer.from(r.url.split(',')[1], 'base64')); delete r.url; console.log(JSON.stringify(r)); await browser.close()
