// HUD 3D R1 Spike-Paket 1 (hud=3d, Georg 24.10., EINBAU_WS1 §4/§5) · Browser-Prüfung: Laden, Kugeln = Zähler (leer grau), Einflug Fluff → Kugel,
// Truhe ↔ Rucksack, Zielpfeil (Peilung links/rechts/hinten, oben/unten mit Höhentext, kein Ziel = kein Pfeil, Entfernung nach V-333, Annäherungsfarbe),
// Feder beruhigt sich (Totzone, kein Flackern), Ruhe gecacht, Overlay-Pass < 1 ms, keine Seitenfehler, hud=clay und hud=wood unverändert erreichbar.
// Abnahmebilder: test/out/hud-3d/*.png (Pfeil links/rechts/hinten/oben/unten). Mit echter GPU: PW_GPU=1.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const OUT = 'test/out/hud-3d'; fs.mkdirSync(OUT, { recursive: true })
const VP = { width: 1600, height: 900 }
const wait = (p, ms) => p.waitForTimeout(ms)
const st = (page) => page.evaluate(() => window.__kfbClayHud?.status())
const checks = {}, extra = {}
const { browser, page, errs } = await openPage('#m1,debug,clean,harvest,look=terrain3,hud=3d', { viewport: VP })
await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {})
await wait(page, 3000)
let s = await st(page); extra.load = { status: s?.status, kit: await page.evaluate(() => window.__kfbClayHud?.kit), quads: s?.quads, tris: s?.tris }
checks.loaded = s?.status === 'OK' && extra.load.kit === '3d' && s.quads >= 7
checks.woodHidden = await page.evaluate(() => { const r = document.getElementById('kfb-hud-r5f'); return !!r && [...r.children].every((c) => c.style.display === 'none') })
checks.orbsMatchCounts = await page.evaluate(() => { const H = window.__kfbClayHud.status(), c = window.__kfbM1.harvest().hud.counts(); return c.every((n, i) => H.counts[i] === n && H.shown[i] === n) })
// Einflug: 2 tragic + 1 heroic → Kugeln 0 und 3 zählen hoch, erst nach dem Kontakt
const c0 = await page.evaluate(() => window.__kfbM1.harvest().hud.counts())
await page.evaluate(() => { const h = window.__kfbM1.harvest().hud; h.land(0, 2); h.land(3, 1) })
await wait(page, 200); const mid = await st(page); await page.screenshot({ path: `${OUT}/1_einflug.png` })
await wait(page, 2200); s = await st(page)
extra.fly = { c0, midShown: mid.shown, shown: s.shown, flights: s.flights, landed: s.landed }
checks.flyIn = s.shown[0] === c0[0] + 2 && s.shown[3] === c0[3] + 1 && s.landed === s.flights && mid.shown[0] === c0[0]
// Truhe: mit Fundsache öffnet sie den Rucksack (gleiches Overlay), Klick zu
await page.evaluate(() => window.__kfbM1.harvest().hud.addItem({ id: 't1', key: 't1', n: 'Probe-Stein', k: 'Fundsache', icon: 'spark' }))
await page.click('button[aria-label="Truhe öffnen"]'); await wait(page, 600)
const op = await page.evaluate(() => ({ bag: window.__kfbM1.harvest().hud.bagOpen(), chest: window.__kfbClayHud.status().chestOpen }))
await page.screenshot({ path: `${OUT}/2_truhe.png` })
await page.evaluate(() => window.__kfbM1.harvest().hud.closeBag()); await wait(page, 500)
const cl = await page.evaluate(() => ({ bag: window.__kfbM1.harvest().hud.bagOpen(), chest: window.__kfbClayHud.status().chestOpen }))
checks.chestBag = op.bag && op.chest && !cl.bag && !cl.chest
// Pfeil: Standard-Ziel Bühne sichtbar mit Name
s = await st(page); const lab0 = await page.evaluate(() => document.getElementById('kfb-hud3d-label')?.innerText || '')
checks.goalStage = s.arrow.visible && /BÜHNE/.test(lab0); extra.lab0 = lab0.replace(/\n/g, ' ')
// Richtungen (Debug-Ziel relativ zur Kamera): Peilung kommt an, Bild je Richtung
const dirs = [['links', -90, 0, 300], ['rechts', 90, 0, 300], ['hinten', 180, 0, 300], ['oben', 20, 35, 120], ['unten', -20, -35, 120]]
extra.dirs = {}
for (const [n, b, p, d] of dirs) {
  await page.evaluate(([b, p, d]) => window.__kfbClayHud.goalRel(b, p, d), [b, p, d]); await wait(page, 1600)
  s = await st(page); const lab = await page.evaluate(() => document.getElementById('kfb-hud3d-label')?.innerText || '')
  extra.dirs[n] = { want: b, b: s.arrow.b, p: s.arrow.p, lab: lab.replace(/\n/g, ' ') }
  await page.screenshot({ path: `${OUT}/3_pfeil_${n}.png` })
}
const D = extra.dirs, near = (a, b, t = 6) => Math.abs(((a - b + 540) % 360) - 180) <= t
checks.arrowBearing = near(D.links.b, -90) && near(D.rechts.b, 90) && near(Math.abs(D.hinten.b), 180, 8) && near(D.oben.b, 20) && near(D.unten.b, -20)
checks.arrowPitch = D.oben.p > 25 && D.unten.p < -25 && /↑/.test(D.oben.lab) && /↓/.test(D.unten.lab)
// Ruhe: Ziel steht still → keine neuen Ansichten, Overlay-Pass < 1 ms
await page.evaluate(() => window.__kfbClayHud.goalRel(30, 0, 400)); await wait(page, 1500)
await page.evaluate(() => window.__kfbClayHud.resetStats()); await wait(page, 3000); s = await st(page)
extra.idle = { draws: s.draws, rtRenders: s.rtRenders, arrowRenders: s.arrow.renders, avg: s.drawMsAvg, p95: s.drawMsP95, upd: s.updMsAvg, rtBytes: s.rtBytes }
checks.idleCached = s.draws > 20 && s.rtRenders <= 2 && s.arrow.renders <= 2
checks.idleUnder1ms = s.drawMsP95 < 1
// Entfernung und Farbe: nah = keine Zahl und grün, weit = km und gelb
await page.evaluate(() => window.__kfbClayHud.goalRel(0, 0, 5)); await wait(page, 600)
const near5 = await page.evaluate(() => ({ lab: document.getElementById('kfb-hud3d-label')?.innerText || '', col: window.__kfbClayHud.status().arrow.color }))
await page.evaluate(() => window.__kfbClayHud.goalRel(0, 0, 2400)); await wait(page, 600)
const far = await page.evaluate(() => ({ lab: document.getElementById('kfb-hud3d-label')?.innerText || '', col: window.__kfbClayHud.status().arrow.color }))
extra.dist = { near5, far }
checks.distFormat = !/\d/.test(near5.lab) && near5.col === '#58be4e' && /2\.4 KM/i.test(far.lab) && far.col === '#f2c230'
// kein Ziel = kein Pfeil, keine Beschriftung
await page.evaluate(() => window.__kfbClayHud.goal(null)); await wait(page, 400); s = await st(page)
checks.noGoalNoArrow = !s.arrow.visible && await page.evaluate(() => getComputedStyle(document.getElementById('kfb-hud3d-label')).display === 'none')
await page.screenshot({ path: `${OUT}/4_kein_ziel.png` })
await page.evaluate(() => window.__kfbClayHud.goal(undefined))
checks.errors0 = errs.length === 0; extra.errs = errs.slice(0, 3)
await browser.close()
// Rückfall-Schalter unverändert: hud=clay = Knet-HUD R1, hud=wood = Holz
for (const [h, want] of [['#m1,debug,harvest,look=terrain3,hud=clay', 'clay'], ['#m1,debug,harvest,look=terrain3,hud=wood', 'wood']]) {
  const { browser: b2, page: p2 } = await openPage(h, { viewport: VP })
  await p2.waitForFunction(() => document.getElementById('kfb-hud-r5f'), null, { timeout: 120000 }).catch(() => {}); await p2.waitForTimeout(2500)
  const k = await p2.evaluate(() => window.__kfbClayHud?.kit || 'wood'); checks['switch_' + want] = k === want; await b2.close()
}
process.exit(report('hud-3d', checks, extra))
