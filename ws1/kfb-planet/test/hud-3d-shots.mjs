// HUD 3D R1 Abnahmebilder gegen screens/ (EINBAU_WS1 §5): Gehen, Fahren, Kampf, Desktop 2880×1800 (1440×900 @2), look=terrain3, debug,clean.
// Zusätzlich Telefon quer 844×390 @3 (Emulator). Ausgabe: test/out/hud-3d/abnahme/*.png
import { chromium } from 'playwright'
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d/abnahme'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
async function shot(form, name, extraHash, fn) {
  const ctx = await browser.newContext(FORMS[form]); const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,hud=3d' + extraHash)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(6000)
  await page.evaluate(() => { const h = window.__kfbM1.harvest().hud; [5, 12, 2, 7, 0, 26].forEach((n, i) => n && h.land(i, n)) }); await page.waitForTimeout(2600)
  if (fn) await fn(page)
  await page.screenshot({ path: `${OUT}/${form}_${name}.png` }); console.log(form, name, errs.length ? errs.slice(0, 2) : 'ok'); await ctx.close()
}
for (const form of ['desk', 'phoneL']) {
  await shot(form, '1_gehen', '')
  await shot(form, '2_fahren', ',car', async (p) => { await p.keyboard.down('KeyW'); await p.waitForTimeout(2500) })
  await shot(form, '3_kampf', ',weapon=blaster', async (p) => { await p.keyboard.press('Digit3'); await p.waitForTimeout(600) })
}
await browser.close()
