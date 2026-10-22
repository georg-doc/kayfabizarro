// Knet-HUD R1 (V-656, V-655, V-653) · Browser-Prüfung im Spiel (#m1, look=terrain3): Props geladen, Zonenfarben = Insel-Palette, Kompass zu/auf,
// Einflug in die Truhe + Score, Truhe öffnet die Rucksack-Ansicht, Radio-Tasten, Zahnrad-Settings mit „Entwickler-Infos“ (DEVUI zur Laufzeit,
// localStorage, M2-Label), „clean“ erzwingt aus, Reaktion auf M2-Ereignisse, Holz-HUD als Rückfall (hud=wood), Zeit je Bild im Overlay-Pass.
// Bilder: test/out/hud-clay/*.png. Mit echter GPU: PW_GPU=1 (sonst SwiftShader, langsam, Zeiten nur grob).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
import { hudZones } from '../src/hud/hudPalette.js'
import { TERRAIN3_CFG } from '../src/look/terrain3.js'
const OUT = 'test/out/hud-clay'; fs.mkdirSync(OUT, { recursive: true })
const VP = { width: 1600, height: 900 }
const wait = (p, ms) => p.waitForTimeout(ms)
const st = (page) => page.evaluate(() => window.__kfbClayHud?.status())
const idle = async (page, ms) => { await page.evaluate(() => window.__kfbClayHud.resetStats()); await wait(page, ms); return st(page) }
const checks = {}, extra = {}

// 1 · Knet-HUD zu Fuß
{
  const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,palette=mesa,hud=clay', { viewport: VP })
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {})
  await wait(page, 4000)
  let s = await st(page); extra.load = { status: s?.status, loaded: s?.loaded, tris: s?.tris }
  checks.loaded = s?.status === 'OK' && s.loaded === 6
  checks.trisSmall = s?.tris > 4000 && s.tris < 20000
  const want = hudZones(TERRAIN3_CFG.palettes.mesa)
  checks.zonesFromPalette = s?.zones.base === want.base && s?.zones.accent === want.accent && s?.zones.detail === want.detail
  extra.zones = s?.zones
  checks.woodHidden = await page.evaluate(() => { const r = document.getElementById('kfb-hud-r5f'); return !!r && [...r.children].every((c) => c.style.display === 'none') })
  checks.audioPanelHidden = await page.evaluate(() => { const p = document.getElementById('kfb-audio-panel'); return !p || getComputedStyle(p).display === 'none' })
  checks.hitAreas = await page.evaluate(() => ['Einstellungen', 'Kompass: Karte auf/zu', 'Truhe öffnen', 'Ton an/aus', 'Nächster Titel'].every((l) => !!document.querySelector(`#kfb-hud-clay button[aria-label="${l}"]`)))
  await page.screenshot({ path: `${OUT}/1_zu.png` })
  // Ruhe: kaum neue Ansichten, Overlay-Pass < 1 ms (CPU)
  s = await idle(page, 3000); extra.idle = { draws: s.draws, rtRenders: s.rtRenders, avg: s.drawMsAvg, p95: s.drawMsP95, max: s.drawMsMax }
  checks.idleCached = s.draws > 20 && s.rtRenders <= Math.max(3, s.draws * 0.15)
  checks.idleUnder1ms = s.drawMsP95 < 1
  // Kompass auf → Minimap
  await page.click('button[aria-label="Kompass: Karte auf/zu"]'); await wait(page, 900)
  s = await st(page); const rc = await page.evaluate(() => window.__kfbClayHud.rects().compass)
  checks.compassOpen = s.compassOpen && rc.w > 260
  s = await idle(page, 2000); extra.open = { draws: s.draws, rtRenders: s.rtRenders, avg: s.drawMsAvg, p95: s.drawMsP95 }
  checks.openUnder1ms = s.drawMsP95 < 1
  await page.screenshot({ path: `${OUT}/2_karte.png` })
  await page.click('button[aria-label="Kompass: Karte auf/zu"]'); await wait(page, 700)
  checks.compassClosed = !(await st(page)).compassOpen
  // Einflug: 2 + 3 Fluff → Score 5, Zähler im Holz-HUD gleich
  const before = await page.evaluate(() => window.__kfbM1.harvest().hud.counts().reduce((a, b) => a + b, 0))
  await page.evaluate(() => { const h = window.__kfbM1.harvest().hud; h.land(0, 2); h.land(3, 3) })
  await wait(page, 250); await page.screenshot({ path: `${OUT}/3_einflug.png` })
  await wait(page, 1800); s = await st(page)
  const after = await page.evaluate(() => window.__kfbM1.harvest().hud.counts().reduce((a, b) => a + b, 0))
  extra.fly = { before, after, score: s.score, flights: s.flights, landed: s.landed }
  checks.flyIn = after === before + 5 && s.score === after && s.landed === s.flights && s.flights >= 2
  // Truhe: mit Fundsache öffnet sie die Rucksack-Ansicht, zweiter Klick schließt
  await page.evaluate(() => window.__kfbM1.harvest().hud.addItem({ id: 't1', key: 't1', n: 'Probe-Stein', k: 'Fundsache', icon: 'spark' }))
  await page.click('button[aria-label="Truhe öffnen"]'); await wait(page, 600)
  const open = await page.evaluate(() => ({ bag: window.__kfbM1.harvest().hud.bagOpen(), chest: window.__kfbClayHud.status().chestOpen }))
  await page.screenshot({ path: `${OUT}/4_truhe.png` })
  await page.evaluate(() => window.__kfbM1.harvest().hud.closeBag()); await wait(page, 500)
  const shut = await page.evaluate(() => ({ bag: window.__kfbM1.harvest().hud.bagOpen(), chest: window.__kfbClayHud.status().chestOpen }))
  checks.chestBag = open.bag && open.chest && !shut.bag && !shut.chest
  // Radio: Ton aus/an über die Knet-Taste, Laufschrift folgt
  await page.click('button[aria-label="Ton an/aus"]'); await wait(page, 700)
  const m1 = await page.evaluate(() => ({ muted: window.__kfbClayHud.muted(), ticker: window.__kfbClayHud.status().ticker }))
  await page.click('button[aria-label="Ton an/aus"]'); await wait(page, 300)
  checks.radioMute = m1.muted && /Ton aus/.test(m1.ticker) && !(await page.evaluate(() => window.__kfbClayHud.muted()))
  // Settings + Entwickler-Infos
  await page.click('button[aria-label="Einstellungen"]'); await wait(page, 500)
  checks.settingsOpen = await page.evaluate(() => getComputedStyle(document.getElementById('kfb-hud-settings')).display !== 'none')
  await page.screenshot({ path: `${OUT}/5_settings.png` })
  const dev0 = await page.evaluate(() => document.querySelector('[data-setting=devui]').getAttribute('aria-checked'))
  await page.click('[data-setting=devui]'); await wait(page, 200)
  const dev1 = await page.evaluate(() => ({ aria: document.querySelector('[data-setting=devui]').getAttribute('aria-checked'), ls: localStorage.getItem('kfb.devui.v1') }))
  checks.devuiToggle = dev0 === 'true' && dev1.aria === 'false' && dev1.ls === '0'
  await page.keyboard.press('Escape'); await wait(page, 200)
  checks.settingsEsc = await page.evaluate(() => getComputedStyle(document.getElementById('kfb-hud-settings')).display === 'none')
  // Reaktion: Landung bewegt die Props kurz, danach Ruhe
  await page.evaluate(() => window.__kfbClayHud.event?.({ type: 'landing', strength: 1 }))
  checks.errors0 = errs.length === 0; extra.errs = errs.slice(0, 3)
  await browser.close()
}
// 2 · Fahrt: DEVUI-Schalter wirkt auf das M2-Label, Reaktion auf Landung
{
  const { browser, page, errs } = await openPage('#m1,car,debug,harvest,look=terrain3,hud=clay', { viewport: VP })
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK' && document.getElementById('m2-kind'), null, { timeout: 120000 }).catch(() => {})
  await wait(page, 3000)
  const lab0 = await page.evaluate(() => document.getElementById('m2-kind')?.textContent || '')
  await page.click('button[aria-label="Einstellungen"]'); await page.click('[data-setting=devui]'); await wait(page, 400)
  const lab1 = await page.evaluate(() => document.getElementById('m2-kind')?.textContent || '')
  await page.click('[data-setting=devui]'); await wait(page, 400)
  const lab2 = await page.evaluate(() => document.getElementById('m2-kind')?.textContent || '')
  extra.label = { lab0: lab0.slice(0, 40), lab1: lab1.slice(0, 40), lab2: lab2.slice(0, 40) }
  checks.devuiLabel = /Fahrsystem/.test(lab0) && !/Fahrsystem/.test(lab1) && lab1.length > 0 && /Fahrsystem/.test(lab2)
  await page.keyboard.press('Escape')
  const m0 = (await st(page)).motion
  await page.evaluate(() => window.__kfbClayHud.kick({ type: 'landing', strength: 1 })); await wait(page, 120)
  const m1 = (await st(page)).motion; await wait(page, 2500); const m2 = (await st(page)).motion
  extra.motion = { m0, m1, m2 }
  checks.reactLanding = m1 > 1 && m2 < 0.3
  await page.keyboard.down('KeyW'); await wait(page, 2500); const sp = (await st(page)).speedShown; await page.keyboard.up('KeyW')
  extra.speed = sp; checks.tachoSpeed = sp > 5
  await page.screenshot({ path: `${OUT}/6_fahrt.png` })
  checks.errorsCar0 = errs.length === 0; extra.errsCar = errs.slice(0, 3)
  await browser.close()
}
// 3 · clean erzwingt „aus“, auch mit gespeichertem „an“
{
  const { browser, page } = await openPage('#m1,car,debug,clean,harvest,look=terrain3,hud=clay', { viewport: VP })
  await page.evaluate(() => localStorage.setItem('kfb.devui.v1', '1'))
  await page.reload(); await page.waitForFunction(() => document.getElementById('m2-kind'), null, { timeout: 120000 }).catch(() => {})
  await wait(page, 2500)
  const lab = await page.evaluate(() => document.getElementById('m2-kind')?.textContent || '')
  checks.cleanForcesOff = !/Fahrsystem/.test(lab)
  await browser.close()
}
// 4 · Holz-HUD unverändert (Standard ohne hud=, und hud=wood)
for (const h of ['#m1,debug,harvest,look=terrain3', '#m1,debug,harvest,look=terrain3,hud=wood']) {
  const { browser, page } = await openPage(h, { viewport: VP })
  await page.waitForFunction(() => document.getElementById('kfb-hud-r5f'), null, { timeout: 120000 }).catch(() => {})
  await wait(page, 2500)
  const w = await page.evaluate(() => ({ clay: !!document.getElementById('kfb-hud-clay') || !!window.__kfbClayHud, wood: [...(document.getElementById('kfb-hud-r5f')?.children || [])].some((c) => c.style.display !== 'none') }))
  checks[h.endsWith('wood') ? 'woodSwitch' : 'woodDefault'] = !w.clay && w.wood
  if (h.endsWith('wood')) await page.screenshot({ path: `${OUT}/7_holz.png` })
  await browser.close()
}
process.exit(report('hud-clay', checks, extra))
