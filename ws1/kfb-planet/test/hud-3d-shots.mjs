// HUD 3D R1 Abnahmebilder gegen screens/ (EINBAU_WS1 §5): Gehen, Fahren, Kampf, Desktop 2880×1800 (1440×900 @2), look=terrain3, debug,clean.
// Zusätzlich Telefon quer 844×390 @3 (Emulator). Ausgabe: test/out/hud-3d/abnahme/*.png
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js' // Live-Stand wie die Site (world=probe), nur Prüf-Schalter dazu
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d/abnahme'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
async function shot(form, name, extraHash, fn) {
  const ctx = await browser.newContext(FORMS[form])
  // Echter Spielstand statt nur HUD-Anzeige (Lead 24.10.): Kugeln 5/12/2/7/0/26 (tragic, comic, absurd, heroic, mystical, forbidden), Gesamt 97 > Summe 52 = Lebenszeit-Zahl
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } })
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean' + extraHash)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(6000)
  // Bühnenplakat: warten, bis das Kartenbild geladen ist (sonst Textfassung im Bild, Lead 24.10.)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat-Bild nicht geladen: ' + 'Quelle ≠ CARD'))
  const chk = await page.evaluate(() => ({ counts: window.__kfbM1.harvest().hud.counts(), total: window.__kfbClayHud.fluffTotal() })); if (chk.total !== 97 || chk.counts.join() !== '5,12,2,7,0,26') errs.push('Spielstand nicht übernommen: ' + JSON.stringify(chk))
  if (fn) await fn(page)
  await page.screenshot({ path: `${OUT}/${form}_${name}.png` }); console.log(form, name, errs.length ? errs.slice(0, 2) : 'ok'); await ctx.close()
}
for (const form of ['desk', 'phoneL']) {
  await shot(form, '0_AB_kassette_ALT', ',cas=old') // A/B Georg 24.10.: alt (Poly-Kassette, alte Größen) gegen neu (Standard)
  await shot(form, '0_kassette_nacht', ',tod=night') // r5-Tasten nachts türkis (V-707, Werte vorläufig)
  await shot(form, '1_gehen', '')
  await shot(form, '2_fahren', ',car', async (p) => { await p.keyboard.down('KeyW'); await p.waitForTimeout(2500) })
  await shot(form, '2a_tempo_langsam', ',car', async (p) => { await p.keyboard.down('KeyW'); await p.waitForTimeout(800) }) // Tempo-Leiste (Georg 24.10.): niedrig, hoch, Boost
  await shot(form, '2b_tempo_schnell', ',car', async (p) => { await p.keyboard.down('KeyW'); await p.waitForTimeout(4500) })
  await shot(form, '2c_tempo_boost', ',car', async (p) => { await p.keyboard.down('KeyW'); await p.waitForTimeout(2500); await p.keyboard.down('ShiftLeft'); await p.waitForTimeout(700) })
  await shot(form, '4_flyout_karte_ziele', '', async (p) => { await p.click('button[aria-label^="Ziel"]'); await p.waitForTimeout(800) }) // Paket 4: Karte + Zielwahl am Pfeil
  await shot(form, '5_flyout_letzte_karten', '', async (p) => { await p.waitForFunction(() => document.querySelectorAll('[data-ui=fan] img').length > 0, null, { timeout: 45000 }).catch(() => {}); await p.click('[data-ui=fan]'); await p.waitForTimeout(800) })
  await shot(form, '3_kampf', ',weapon=blaster', async (p) => { await p.keyboard.press('Digit3'); await p.waitForTimeout(600) })
}
await browser.close()
