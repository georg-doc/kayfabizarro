// F-3a auf der Bühne (#stage,preview=g4): drei Karten in Georgs Reihenfolge, Sprecher A sagt Georgs Fassung (Opener als erster Blasen-Teil),
// Sprecher B den Power-Text aus dem Druck, Spielerwahl je Karte (Taste 1), Billboard zeigt den Platzhalter mit Drucktext (keine der drei gesichert),
// Kennzeichnung „Vorschau-Text“ im Bild; ohne Schalter keine Vorschau.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,actors=fb,preview=g4', { viewport: { width: 1920, height: 1080 } })
const st = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state())
const until = async (f, ms = 300000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await st(); if (s && f(s)) return s; await page.waitForTimeout(150) } throw new Error('timeout ' + JSON.stringify(await st())) }
const bubbles = () => page.evaluate(() => (window.__kfbBubbles?.() || []).filter((b) => b.shown).map((b) => ({ anchor: b.anchor, text: b.text })))
const shots = [], seen = []
fs.mkdirSync('test/out/g4preview', { recursive: true })
for (let beat = 0; beat < 3; beat++) {
  await until((s) => s.beat === beat && s.phase === 'A'); await page.waitForTimeout(900)
  const bb = await page.evaluate(() => window.__kfbStageMods.billboard.info())
  seen.push({ beat, bubbles: await bubbles(), bb: { source: bb.source, card: bb.card } })
  const f = `test/out/g4preview/karte_${beat + 1}_A.png`; fs.writeFileSync(f, await page.screenshot()); shots.push(f)
  await until((s) => s.beat === beat && s.phase === 'B'); await page.waitForTimeout(700)
  fs.writeFileSync(`test/out/g4preview/karte_${beat + 1}_B.png`, await page.screenshot())
  await until((s) => s.beat === beat && s.phase === 'CHOICE'); await page.waitForTimeout(500); await page.keyboard.press('1')
}
await until((s) => s.phase === 'DONE')
const log = await page.evaluate(() => window.__kfbStageMods.dialog.log())
const badge = await page.evaluate(() => document.getElementById('kfb-preview-badge')?.textContent || null)
const deck = await page.evaluate(() => window.__kfbStageCtl.deck.map((c) => ({ id: c.deck.id + '#' + c.num, name: c.name, power: c.power })))
await browser.close()
// Gegenprobe: ohne Schalter keine Vorschau-Zeile
const o = await openPage('#stage,debug,actors=fb,card=kayfabizarro_monomyth_mayhem:1,dialog=1', { viewport: { width: 1280, height: 720 } })
const s2 = async (f) => { const t0 = Date.now(); while (Date.now() - t0 < 300000) { const s = await o.page.evaluate(() => window.__kfbStageMods?.dialog?.state()); if (s && f(s)) return; await o.page.waitForTimeout(150) } }
await s2((s) => s.phase === 'A'); const plainLog = await o.page.evaluate(() => window.__kfbStageMods.dialog.log()); const plainBadge = await o.page.evaluate(() => !!document.getElementById('kfb-preview-badge')); await o.browser.close()

const lines = log.filter((e) => e.type === 'line'), A = lines.filter((_, i) => i % 2 === 0), B = lines.filter((_, i) => i % 2 === 1)
const OPEN = ['Welcome to', 'Remember', 'You know']
process.exit(report('g4 preview on stage (F-3a)', {
  threeCardsInGeorgsOrder: deck.map((d) => d.id).join(',') === 'kayfabizarro_monomyth_mayhem#1,kayfabizarro_monomyth_mayhem#5,help_i_am_a_human#10' && log.filter((e) => e.type === 'card').length === 3,
  speakerASaysGeorgsVersion: A.length === 3 && A.every((e, i) => e.source === 'PREVIEW' && e.text.startsWith(OPEN[i] + ' ')),
  openerIsOwnBubblePart: seen.every((x, i) => x.bubbles.some((b) => b.text.startsWith(OPEN[i]))),
  speakerBSaysPrintPower: B.length === 3 && B.every((e, i) => e.source === 'CARD' && e.text === deck[i].power),
  billboardPlaceholderWithPrintText: seen.every((x) => x.bb.source === 'PLACEHOLDER'),
  dialogFinishesWithChoices: log.filter((e) => e.type === 'choice').length === 3 && log.some((e) => e.type === 'done'),
  markedAsPreview: /Vorschau/.test(badge || ''),
  noPreviewWithoutSwitch: !plainBadge && plainLog.filter((e) => e.type === 'line').every((e) => e.source !== 'PREVIEW'),
  noPageErrors: errs.length === 0 && o.errs.length === 0,
}, { seen, A: A.map((e) => [e.source, e.text.slice(0, 50)]), B: B.map((e) => [e.source, e.text.slice(0, 40)]), badge, shots, errs }))
