// S1 Ansicht · feste Position über der zweiten Turmkarte, Bildschirmfoto für das Bildpaar (kein Pass/Fail-Kriterium allein).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out', { recursive: true })
const { browser, page, errs } = await openPage('#debug')
await page.waitForFunction(() => window.__kfbTeleport && window.__kfbTower, null, { timeout: 90000 })
const info = await page.evaluate(() => {
  const s = window.__kfbStore.getState(); s.closeDialog()
  const tower = window.__kfbTower(), pos = window.__kfbTowerPos()
  for (const c of tower.slice(0, 12)) s.collect(c)
  const p = pos[1]; window.__kfbTeleport(p[0] + 0.8, p[1] + 1.4, p[2] + 2.2)
  return { cards: tower.map((c) => c.deck.id + '#' + c.num + ' ' + c.name), p }
})
await page.waitForFunction(() => window.__kfbCardStats().loaded >= 12, null, { timeout: 180000 }).catch(() => {})
await page.waitForTimeout(8000)
const stats = await page.evaluate(() => window.__kfbCardStats())
await page.screenshot({ path: 'test/out/s1_tower.png' })
await browser.close()
process.exit(report('s1 tower view', { allTowerCardsLoaded: stats.loaded >= 12 && stats.failed === 0, noPageErrors: errs.length === 0 }, { info, stats, errs }))
