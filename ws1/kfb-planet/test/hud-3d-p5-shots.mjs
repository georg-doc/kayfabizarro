// HUD 3D Paket 5 (Georg 25.10.): Abnahmebilder + Clips im Live-Stand (Site-Hash, Spielstand 97). Truhe klappt auf + Truhe 20, fraktaler Almanach (Decks → Karten → Detail).
// Almanach mit cards=12 (Owner-Schalter des M1-Wirts, sonst nur 2 Karten); Truhe mit echten Waffen (weapon=blaster ausgerüstet) und drei Fundsachen aus der Beute-Tabelle
// (gleiche Form wie das Aufheben im Spiel). Ausgabe test/out/hud-3d/p5/: <form>_<n>_*.png, clip_truhe.webm, clip_almanach_zoom.webm, clip_almanach_page.webm (B: Seitenwechsel)
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js'
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d/p5'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
const SAVE = { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } }
const TABLE = JSON.parse(fs.readFileSync('src/data/world/loot_items.r2.json', 'utf8')).items, ICON = { food: 'candy', drink: 'potion', sweet: 'candy' }
const LOOT = ['burger', 'donut_pink', TABLE.find((i) => i.type === 'drink')?.id].filter(Boolean).map((id) => TABLE.find((i) => i.id === id)).map((it, i) => ({ id: 'p5_' + i, key: 'p5_' + i, lootId: it.id, n: it.name_de, k: 'Fundsache', icon: ICON[it.type] || 'spark', note: 'Aus der Wiese aufgehoben.' }))
const wait = (p, ms) => p.waitForTimeout(ms)
async function open(form, extra = '', ctxExtra = {}) {
  const ctx = await browser.newContext({ ...FORMS[form], ...ctxExtra })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean,hud=3d,cards=12,weapon=blaster' + extra)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await wait(page, 5000)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat nicht geladen'))
  await page.waitForFunction(() => (window.__kfbM1.harvest().hud.weapons?.() || []).length > 0, null, { timeout: 30000 }).catch(() => errs.push('keine Waffen geladen'))
  await page.evaluate((L) => { for (const it of L) window.__kfbM1.harvest().hud.addItem(it) }, LOOT)
  await page.waitForFunction(() => document.querySelectorAll('[data-ui=fan] img').length > 0, null, { timeout: 45000 }).catch(() => errs.push('Fächer ohne Bilder'))
  return { ctx, page, errs }
}
const log = []
const snap = async (page, form, name, errs) => { await page.screenshot({ path: `${OUT}/${form}_${name}.png` }); const st = await page.evaluate(() => ({ l3: window.__kfbClayHud.l3(), lid: window.__kfbClayHud.lid(), title: document.getElementById('kfb-l3-title')?.textContent || null }))
  log.push({ form, name, ...st, errs: errs.slice(0, 3) }); console.log(form, name, st.title, errs.length ? errs.slice(0, 2) : 'ok') }
for (const form of ['desk', 'phoneL']) {
  { const { ctx, page, errs } = await open(form)
    const r = await page.evaluate(() => window.__kfbClayHud.rects().chest)
    await page.click('button[aria-label="Truhe öffnen"]'); await wait(page, 150)
    await page.screenshot({ path: `${OUT}/${form}_1_truhe_deckel.png`, clip: { x: 0, y: Math.max(0, r.y - r.h * 0.6), width: Math.min(FORMS[form].viewport.width, r.x + r.w * 2.2), height: Math.min(r.h * 1.8, FORMS[form].viewport.height - Math.max(0, r.y - r.h * 0.6)) } }) // Überschwingen des Deckels, bevor die Tafel kommt
    await wait(page, 900); await snap(page, form, '2_truhe20_waffe', errs)
    await page.click('#kfb-l3-chest [data-slot="3"]'); await wait(page, 300); await snap(page, form, '3_truhe20_fundsache', errs)
    await page.click('#kfb-l3 [data-l3=close]'); await wait(page, 300)
    await page.click('[data-ui=fan]'); await wait(page, 500); await page.click('#kfb-hud3d-fan button[data-l3=almanac]'); await wait(page, 900); await snap(page, form, '4_almanach_decks', errs)
    await page.click('#kfb-l3-decks [data-deck]'); await wait(page, 1500); await snap(page, form, '5_almanach_karten', errs)
    await page.click('#kfb-l3-cards [data-card="3"]').catch(() => page.click('#kfb-l3-cards [data-card]')); await wait(page, 1500); await snap(page, form, '6_almanach_detail', errs)
    await ctx.close() }
}
// Clips (Desktop 1440×900): Truhe auf/zu; Almanach öffnen, fächern, Detail, blättern, mit Esc zurück – A zoom (fraktal), B page (Seitenwechsel)
async function clip(name, extra, fn) {
  const { ctx, page } = await open('desk', extra, { deviceScaleFactor: 1, recordVideo: { dir: OUT + '/_v', size: { width: 1440, height: 900 } } })
  await fn(page); const v = page.video(); await ctx.close(); fs.renameSync(await v.path(), `${OUT}/${name}.webm`); fs.rmSync(OUT + '/_v', { recursive: true, force: true }); console.log('clip', name)
}
await clip('clip_truhe', '', async (p) => { await wait(p, 600); await p.click('button[aria-label="Truhe öffnen"]'); await wait(p, 1400); await p.click('#kfb-l3-chest [data-slot="1"]'); await wait(p, 900); await p.click('#kfb-l3-chest [data-slot="3"]'); await wait(p, 900); await p.click('#kfb-l3 [data-l3=close]'); await wait(p, 1500) })
const almanachRun = async (p) => { await wait(p, 600); await p.click('[data-ui=fan]'); await wait(p, 900); await p.click('#kfb-hud3d-fan button[data-l3=almanac]'); await wait(p, 1300); await p.click('#kfb-l3-decks [data-deck]'); await wait(p, 1600)
  await p.click('#kfb-l3-cards [data-card="3"]').catch(() => p.click('#kfb-l3-cards [data-card]')); await wait(p, 1500); await p.click('#kfb-l3 [data-l3=next]'); await wait(p, 900); await p.click('#kfb-l3 [data-l3=next]'); await wait(p, 900)
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Escape'); await wait(p, 1000) } }
await clip('clip_almanach_zoom', ',alm=zoom', almanachRun)
await clip('clip_almanach_page', ',alm=page', almanachRun)
fs.writeFileSync(`${OUT}/messung.json`, JSON.stringify(log, null, 1))
await browser.close()
