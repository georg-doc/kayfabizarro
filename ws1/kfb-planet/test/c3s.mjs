// V-487 Stufe 2 · Saugarm in der Laufwelt (#m1,harvest): Spieler vor einem goblin-Baum, Taste T saugt bis zu 6 Kügelchen im Kegel (hängend → Ursprung Baum),
// danach liegende nach einem Faustschlag (Ursprung Boden). Prüft im Browser: Kügelchen verschwinden aus dem Garten beim Ansaugen, fliegen über kfb-fluff-suck
// (Phasen-Cues, Ton fluff_suction_r1), werden erst beim Einsaugen gezählt (Ernte-Stand + Fluff-Leiste), keines bleibt hängen ("sucked"), Ursprungs-Plopp je Herkunft, Kosten je Bild.
// Bildreihe test/out/c3s/c3s-sheet.png (Anlauf / Stretch / Flug / Einsaugen).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/c3s', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,harvest,cards=1', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' && window.__kfbM1.mods.suck, null, { timeout: 300000 })
await page.waitForTimeout(2500)
await page.evaluate(() => { const M = window.__kfbM1, t = M.mods.orchard.trees().find((x) => x.zone === 'goblin' && x.id === 't0')
  M.player().teleport([t.pos[0] + 0.8, t.pos[1] + 1.2, t.pos[2] + 2.6], Math.PI) })
await page.waitForTimeout(2500)
const state = () => page.evaluate(() => { const M = window.__kfbM1, O = M.mods.orchard, H = M.harvest(), bs = O.balls(), sum = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0)
  return { collected: bs.filter((b) => b.state === 'collected').length, sucked: bs.filter((b) => b.state === 'sucked').length, counts: sum(O.counts()), hudCounts: sum(H.counts), suck: M.mods.suck.stats(), cues: H.cues || 0, tries: H.suckTries || 0, swallowed: H.sucked || 0, audio: H.suckAudio || null } })
const s0 = await state()
// Mitten im Flug: im Seitentakt abgefragt (Bildschirmfotos sind unter SwiftShader zu langsam für feste Wartezeiten)
const watchMid = () => page.evaluate(() => new Promise((res) => { const M = window.__kfbM1, t0 = performance.now(), f = () => { const bs = M.mods.orchard.balls(), sk = bs.filter((b) => b.state === 'sucked').length, st = M.mods.suck.stats()
  if (sk >= 1 && st.active >= 1) res({ sucked: sk, collected: bs.filter((b) => b.state === 'collected').length, swallowed: st.swallowed }); else if (performance.now() - t0 > 20000) res(null); else requestAnimationFrame(f) }; f() }))
const done = (n) => page.waitForFunction((n) => { const st = window.__kfbM1.mods.suck.stats(); return st.started >= n && st.active === 0 }, n, { timeout: 120000, polling: 100 }).then(() => true).catch(() => false)
const tA = Date.now(); await page.keyboard.press('KeyT'); const mid = await watchMid()
const shots = []; for (let i = 0; i < 4; i++) { if ((await state()).suck.active === 0) break; shots.push(await page.screenshot()) }
const ok1 = await done(1); const dur1 = Date.now() - tA
const s1 = await state()
// Boden: Faust bis der Baum Kügelchen fallen lässt, Ruhe abwarten, dann noch einmal T
await page.evaluate(async () => { const M = window.__kfbM1, O = M.mods.orchard; for (let i = 0; i < 4; i++) { O.hitTree('goblin', 't0', 'punch'); await new Promise((r) => setTimeout(r, 80)) } })
await page.waitForFunction(() => window.__kfbM1.mods.orchard.stats().zones.find((z) => z.zone === 'goblin').falling === 0, null, { timeout: 60000 }).catch(() => {})
await page.waitForTimeout(400)
await page.keyboard.press('KeyT'); await page.waitForTimeout(300); const ok2 = await done(s1.suck.started + 1)
const s2 = await state()
const perf = await page.evaluate(() => { const S = window.__kfbM1.mods.suck, t = performance.now(); for (let i = 0; i < 200; i++) S.update(1 / 60); return { updateMs: (performance.now() - t) / 200 } })
await browser.close()
const W = 480, H = 270
const tiles = await Promise.all(shots.map((b) => sharp(b).resize(W, H).png().toBuffer()))
if (tiles.length) await sharp({ create: { width: W * tiles.length, height: H, channels: 3, background: '#222' } }).composite(tiles.map((b, i) => ({ input: b, left: i * W, top: 0 }))).png().toFile('test/out/c3s/c3s-sheet.png')
const n1 = s1.suck.swallowed - s0.suck.swallowed, n2 = s2.suck.swallowed - s1.suck.swallowed
fs.writeFileSync('test/out/c3s/c3s.json', JSON.stringify({ s0, mid, s1, s2, perf }, null, 1))
process.exit(report('c3s fluff suction arm (V-487/2)', {
  treeBallsSucked: n1 >= 1 && s1.suck.plops.tree >= 1,
  hiddenWhileFlying: !!mid && mid.sucked >= 1 && mid.collected === s0.collected + (mid.swallowed - s0.suck.swallowed),
  countedOnSwallow: s1.collected - s0.collected === n1 && s1.counts - s0.counts === n1 && s1.hudCounts - s0.hudCounts === n1,
  finished: ok1 && ok2,
  noneStuck: s1.sucked === 0 && s2.sucked === 0 && s2.suck.active === 0,
  groundBallsSucked: n2 >= 1 && s2.suck.plops.ground >= 1,
  cuesFired: s2.cues >= 5 * (n1 + n2),
  audio: !!s2.audio?.ok && s2.audio.plays >= 3 && s2.audio.loop, // fluff_suction_r1 geladen, beim zweiten Saugstoß Anlauf + Plopps + Schlürfen
  cheap: perf.updateMs < 1.5,
  noErrors: errs.length === 0,
}, { n1, n2, dur1, s0, mid, s1, s2, perf, errs: errs.slice(0, 3) }))
