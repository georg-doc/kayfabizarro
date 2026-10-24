// Sprechblasen nach TRIPLET_SSOT_R1 auf der Bühne (lines=ssot): A = Frage-Opener + fetter Titel, B = bereinigte Lore, nie Power; Bilder der Blasen
// Bilder: research/audits/abnahme/ssot-blasen/
import fs from 'fs'
import path from 'path'
import { openPage, report } from './_page.mjs'
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/ssot-blasen'); fs.mkdirSync(OUT, { recursive: true })
const card = process.argv[2] || ''
const { browser, page, errs } = await openPage('#stage,debug,cam=two,actors=rogue,dialog=2,lines=ssot' + (card ? ',card=' + card : ''), { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbStageMods?.dialog?.log?.().some((e) => e.type === 'line'), null, { timeout: 240000 })
const shots = []
for (let k = 0; k < 4; k++) {
  await page.waitForFunction((n) => window.__kfbStageMods.dialog.log().filter((e) => e.type === 'line').length > n, k, { timeout: 120000 }).catch(() => {})
  await page.waitForTimeout(700); const f = `${OUT}/blase-${card || 'm1'}-${k + 1}.png`; await page.screenshot({ path: f }); shots.push(path.basename(f))
}
const log = await page.evaluate(() => window.__kfbStageMods.dialog.log().filter((e) => e.type === 'line'))
const deck = await page.evaluate(() => window.__kfbStageCtl.deck.map((c) => ({ id: c.deck.id + '#' + c.num, name: c.name, power: c.power })))
await browser.close()
const A = log.filter((_, i) => i % 2 === 0), B = log.filter((_, i) => i % 2 === 1)
process.exit(report('ssotStage (TRIPLET_SSOT_R1 Rückfall)', {
  linesSpoken: log.length >= 2,
  aIsQuestionWithTitle: A.every((l) => /\?$/.test(l.text) && l.field === 'ssot-A'),
  bNeverPower: B.every((l) => l.field === 'ssot-B' && !deck.some((d) => d.power && l.text.includes(d.power.slice(0, 25)))),
  noColonEtiquette: log.every((l) => !/^[^.?!]{1,40}:\s/.test(l.text)),
  noPageErrors: errs.length === 0,
}, { log: log.map((l) => ({ speaker: l.speaker, field: l.field, text: l.text })), deck, shots }))
