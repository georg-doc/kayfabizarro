import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)))
await page.goto('http://localhost:8765/')
await page.waitForFunction(() => window.__kfbDebug && window.__kfbBeings, null, { timeout: 60000 })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/20_actor_hud.png` })
// zu einem Kartenwesen auf dem Heimatplaneten teleportieren
const b = await page.evaluate(() => window.__kfbBeings.find((x) => Math.hypot(...x.pos) < 25))
await page.evaluate((p) => window.__kfbDebug.teleport(p[0] * 1.02, p[1] * 1.02, p[2] * 1.02, false), b.pos)
await page.waitForTimeout(2500)
console.log('near', JSON.stringify(await page.evaluate(() => window.__kfbStore.getState().near?.card?.name)))
await page.screenshot({ path: `${OUT}/21_near_card.png` })
await page.keyboard.press('KeyE'); await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/22_card_dialog.png` })
await page.keyboard.press('1'); await page.waitForTimeout(400)
console.log('hand after collect', await page.evaluate(() => window.__kfbStore.getState().hand.map((c) => c.name)))
// zwei weitere Karten direkt in die Hand (Abkürzung für den Test)
await page.evaluate(() => { const s = window.__kfbStore.getState(); const l = s.planetCards.prison.cards; s.collect(l[0]); window.__kfbStore.getState().collect(l[1]) })
const st = await page.evaluate(() => window.__kfbStage())
await page.evaluate((p) => window.__kfbDebug.teleport(p[0] * 1.08, p[1] * 1.08, p[2] * 1.08, false), st)
await page.waitForTimeout(2500)
console.log('near stage', await page.evaluate(() => window.__kfbStore.getState().near))
await page.keyboard.press('KeyE'); await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/23_quests.png` })
await page.keyboard.press('2'); await page.waitForTimeout(400)
for (let i = 0; i < 3; i++) { await page.locator('.slot-pick').first().click(); await page.waitForTimeout(150) }
await page.screenshot({ path: `${OUT}/24_order.png` })
await page.keyboard.press('1'); await page.waitForTimeout(400)
const seq = async (keys) => { for (const k of keys) { await page.keyboard.press(k); await page.waitForTimeout(250) } }
await seq(['1', '2', '1'])                 // SHOW IT: therefore
await seq(['2'])                            // SPIN IT: from
await page.fill('#own-conn', 'and nobody noticed'); await page.keyboard.press('Enter'); await page.waitForTimeout(250)
await seq(['2'])
await page.screenshot({ path: `${OUT}/25_mid.png` })
await seq(['1', '1', '1', '2'])             // SELL IT: but + Sell
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/26_sell.png` })
await seq(['1', '3', '1'])                  // QUEST: unless
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/27_verdict.png` })
console.log(await page.evaluate(() => document.querySelector('.dialog')?.innerText))
console.log('errors', errs); await browser.close()
