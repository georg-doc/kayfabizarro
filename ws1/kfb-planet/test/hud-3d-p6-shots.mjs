// HUD 3D Paket 6 (Board 08): Einstellungen L3 im Live-Stand (Site-Hash, Spielstand 97), Desktop und Telefon quer, je Reiter ein Bild; Fluchten der
// Bedienelemente (rechte Kanten ≤ 2 px) und Tangenten (Abstand zwischen Zeilen > 0) gemessen; Clip öffnen → Reiter → schließen.
// Ausgabe test/out/hud-3d/p6/<form>_<n>_<reiter>.png, messung.json, clip_einstellungen.webm
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js'
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d/p6'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
const SAVE = { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } }
const wait = (p, ms) => p.waitForTimeout(ms)
async function open(form, ctxExtra = {}) {
  const ctx = await browser.newContext({ ...FORMS[form], ...ctxExtra })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean')
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await wait(page, 5000)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat nicht geladen'))
  return { ctx, page, errs }
}
const measure = (page) => page.evaluate(() => { const rows = [...document.querySelectorAll('#kfb-l3-rows > div')].map((r) => r.getBoundingClientRect())
  const ends = [...document.querySelectorAll('#kfb-l3-rows > div')].filter((r) => r.children.length === 2).map((r) => { const c = r.lastElementChild.getBoundingClientRect(), o = r.getBoundingClientRect(); return +(o.right - c.right).toFixed(1) })
  const gaps = rows.slice(1).map((r, i) => +(r.top - rows[i].bottom).toFixed(1)), labels = [...document.querySelectorAll('#kfb-l3-rows > div > span:first-child')].map((s) => +s.getBoundingClientRect().left.toFixed(1))
  return { rightInset: ends, rightSpread: ends.length ? +(Math.max(...ends) - Math.min(...ends)).toFixed(1) : 0, labelSpread: labels.length ? +(Math.max(...labels) - Math.min(...labels)).toFixed(1) : 0, minGap: gaps.length ? Math.min(...gaps) : null, overflow: (() => { const l = document.getElementById('kfb-l3-rows'); return l.scrollHeight > l.clientHeight + 1 })() } })
const log = []
for (const form of ['desk', 'phoneL']) {
  const { ctx, page, errs } = await open(form)
  await page.click('button[aria-label="Einstellungen"]'); await wait(page, 600)
  for (const [i, tab] of ['game', 'audio', 'controls', 'access'].entries()) {
    await page.click(`#kfb-l3-tabs [data-tab=${tab}]`); await wait(page, 300)
    const m = await measure(page); await page.screenshot({ path: `${OUT}/${form}_${i + 1}_${tab}.png` }); log.push({ form, tab, ...m, errs: errs.slice(0, 2) }); console.log(form, tab, JSON.stringify(m))
  }
  await ctx.close()
}
{ const { ctx, page } = await open('desk', { deviceScaleFactor: 1, recordVideo: { dir: OUT + '/_v', size: { width: 1440, height: 900 } } })
  await wait(page, 600); await page.click('button[aria-label="Einstellungen"]'); await wait(page, 1200)
  for (const tab of ['audio', 'controls', 'access', 'game']) { await page.click(`#kfb-l3-tabs [data-tab=${tab}]`); await wait(page, 900) }
  await page.keyboard.press('Escape'); await wait(page, 1000); await page.click('button[aria-label="Einstellungen"]'); await wait(page, 900); await page.click('#kfb-l3 [data-l3=close]'); await wait(page, 900)
  const v = page.video(); await ctx.close(); fs.renameSync(await v.path(), `${OUT}/clip_einstellungen.webm`); fs.rmSync(OUT + '/_v', { recursive: true, force: true }) }
fs.writeFileSync(`${OUT}/messung.json`, JSON.stringify(log, null, 1))
await browser.close()
