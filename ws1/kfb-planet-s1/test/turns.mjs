import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)))
await page.goto('http://localhost:8765/')
await page.waitForFunction(() => window.__kfbDebug && window.__kfbBeings, null, { timeout: 60000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/30_deal.png` })
const k = async (keys, w = 220) => { for (const x of keys) { await page.keyboard.press(x); await page.waitForTimeout(w) } }
await k(['2', '1', '1', '1', '1'])
const st = () => page.evaluate(() => { const s = window.__kfbStore.getState(); return { actor: s.actor?.name, coll: s.collection.map((c) => c.name), discard: s.discard.length, dialog: s.dialog?.kind, ep: s.episode && { die: s.episode.die, stage: s.episode.stage.map((c) => c?.name || null), quest: s.episode.quest.name, finale: s.episode.finale } } })
console.log('after start', JSON.stringify(await st()))
await page.evaluate(() => { const s = window.__kfbStore.getState(); const l = s.planetCards.prison.cards; s.collect(l[0]); window.__kfbStore.getState().collect(l[1]) })
const p = await page.evaluate(() => window.__kfbStage())
await page.evaluate((p) => window.__kfbDebug.teleport(p[0] * 1.08, p[1] * 1.08, p[2] * 1.08, false), p)
await page.waitForTimeout(2500)
await k(['KeyE'], 500)
await page.screenshot({ path: `${OUT}/31_quest_show.png` })
await k(['1', '1', '1', '1'])        // Quest-Ritual
await k(['1'], 500)                  // würfeln
await page.screenshot({ path: `${OUT}/32_mode.png` })
await page.locator('.slot-pick').first().click(); await page.waitForTimeout(250)
await k(['1'])                       // Szene 1
await k(['1', '1', '1', '1', '2'])   // Ritual + bleibt auf Bühne
await k(['1', '2', '1'])             // Zeile 1
await k(['1']); await page.fill('#own-conn', 'and the King pretended not to see'); await page.keyboard.press('Enter'); await page.waitForTimeout(250); await k(['1'])  // Zeile 2 -> Quest
await page.screenshot({ path: `${OUT}/33_move.png` })
await k(['1'], 400)                  // +2
console.log('after turn 1', JSON.stringify(await st()))
await k(['1'], 300)                  // nächster Zug
await k(['1'], 500)                  // würfeln
await page.locator('.slot-pick').first().click(); await page.waitForTimeout(250)
await k(['1'])                       // freier Slot
await k(['1', '1', '1', '1', '1'])   // Ritual, Power ausgespielt
await k(['1', '1', '1'])             // Zeile 1
await k(['1', '3', '1', '1'])        // Zeile 2: Ziel Szene 1
await k(['1'], 600)                  // +2
console.log('after turn 2', JSON.stringify(await st()))
await page.screenshot({ path: `${OUT}/34_done.png` })
await k(['3'], 1500)                 // Bühne verlassen
await page.screenshot({ path: `${OUT}/35_stage_world.png` })
console.log('errors', errs); await browser.close()
