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
// ── Paket 2: Almanac, Aktionsleiste, Interaktion, Kassette, Zahnrad ─────────────────────────────────────────────────
s = await st(page); extra.p2 = { loaded: s.loaded, quads: s.quads }
checks.p2Loaded = s.loaded >= 9 && s.quads >= 13
const fan = await page.evaluate(() => ({ imgs: document.querySelectorAll('[data-ui=fan] img').length, cap: [...document.querySelectorAll('#kfb-hud-clay div')].map((d) => d.innerText).find((t) => /CARDS/.test(t)) || '' }))
extra.fan = fan; checks.almanacFan = fan.imgs >= 1 && fan.imgs <= 7 && /\d+ CARDS\s*\|?\s*\d+ DECKS?/.test(fan.cap.replace(/\n/g, ' '))
// Gesamt-Fluff (Owner orchard.total, kfb.save fluffTotal): Zahl links vor den Kugeln, gleiche Höhe, Gruppe mittig
{ const t = await page.evaluate(() => { const el = document.getElementById('kfb-hud3d-total'), r = el?.getBoundingClientRect(), o = window.__kfbClayHud.rects(), L = o.orb0, R5 = o.orb5
    return { own: window.__kfbClayHud.fluffTotal(), txt: el?.textContent, shown: el && getComputedStyle(el).display !== 'none', right: r?.right, cy: r ? r.top + r.height / 2 : 0, orbL: L.x + L.w * 0.1, orbCy: L.y + L.h / 2, groupMid: r ? (r.left + R5.x + R5.w * 0.9) / 2 : 0, W: innerWidth } })
  extra.total = t; checks.fluffTotal = t.own != null && t.shown && +t.txt === t.own && t.right <= t.orbL && Math.abs(t.cy - t.orbCy) < 12 && Math.abs(t.groupMid - t.W / 2) < 40 }
// aktive Waffe: Familie vom Owner → Platz aktiv mit Lichthof
await page.evaluate(() => window.__kfbM1.harvest().hud.setWeapon('blaster')); await wait(page, 500)
const wb = await page.evaluate(() => ({ s1: window.__kfbClayHud.uiState('act1'), s0: window.__kfbClayHud.uiState('act0'), fx: window.__kfbClayHud.fxState('act1') }))
await page.evaluate(() => window.__kfbM1.harvest().hud.setWeapon('fist')); await wait(page, 400)
const wf = await page.evaluate(() => ({ s1: window.__kfbClayHud.uiState('act1'), s0: window.__kfbClayHud.uiState('act0') }))
extra.weapon = { wb, wf }; checks.actionActive = wb.s1 === 'active' && wb.s0 !== 'active' && wb.fx?.haloA > 0.3 && wf.s0 === 'active' && wf.s1 !== 'active'
// Klick = Spieltaste (V/B/N über hostKeys)
await page.evaluate(() => { window.__keys = []; window.addEventListener('keydown', (e) => window.__keys.push(e.code)) })
for (const l of ['Faust (V)', 'Blaster (B)', 'Clown-Bombe (N)']) { await page.click(`button[aria-label="${l}"]`); await wait(page, 150) }
const keys = await page.evaluate(() => window.__keys); extra.keys = keys; checks.actionClickKeys = ['KeyV', 'KeyB', 'KeyN'].every((k) => keys.includes(k))
// Hover: Lichthof 0,4 und 1,08 auf dem Rechteck, weg = Ruhe
{ const r = await page.evaluate(() => window.__kfbClayHud.rects().act2); await page.mouse.move(r.x + r.w / 2, r.y + r.h / 2); await wait(page, 450)
  const h = await page.evaluate(() => window.__kfbClayHud.fxState('act2')); await page.mouse.move(800, 450); await wait(page, 600); const i = await page.evaluate(() => window.__kfbClayHud.fxState('act2'))
  extra.hover = { h, i }; checks.hoverFx = h.haloA >= 0.3 && h.sx > 1.04 && h.rot < -1 && i.haloA < 0.05 && Math.abs(i.sx - 1) < 0.01 }
// Interaktion in Reichweite: Hinweis-Lichthof an der Blase
await page.evaluate(() => window.__kfbM1.harvest().hud.setTarget(true)); await wait(page, 400)
const g1 = await page.evaluate(() => +getComputedStyle(document.querySelector('[data-ui=inter] [data-glow]')).opacity)
await page.evaluate(() => window.__kfbM1.harvest().hud.setTarget(false)); await wait(page, 300)
const g0 = await page.evaluate(() => +getComputedStyle(document.querySelector('[data-ui=inter] [data-glow]')).opacity)
extra.interHint = { g1, g0 }; checks.interactionHint = g1 > 0.3 && g0 < 0.05
// Kassette NEU (Georg 24.10.: N34-Kassette, J17-Knöpfe auf den Spulen, Ton mittig darunter; Truhe größer, Kassette kleiner)
{ const k = await page.evaluate(() => ({ kind: window.__kfbClayHud.cassette(), j17: [...document.querySelectorAll('[data-j17]')].filter((d) => getComputedStyle(d).display !== 'none').map((d) => { const r = d.getBoundingClientRect(); return { k: d.dataset.j17, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width } }),
    chest: window.__kfbClayHud.rects().chest, cas: window.__kfbClayHud.rects().cassette, kv: innerWidth / 1920 }))
  const J = Object.fromEntries(k.j17.map((d) => [d.k, d])); extra.cassetteNew = { kind: k.kind, j17: k.j17.map((d) => d.k), chestW: Math.round(k.chest.w / k.kv), casW: Math.round(k.cas.w / k.kv) }
  checks.cassetteNew = k.kind === 'new' && J.play && J.next && J.mute && J.play.x < J.mute.x && J.mute.x < J.next.x && J.mute.y > J.play.y && J.mute.w < J.play.w
  checks.layoutBalance = k.chest.w / k.kv > 220 && k.cas.w / k.kv < 400 // alt: Truhe 192, Kassette 424 Bezugs-px
  const th = await page.evaluate(() => [...document.querySelectorAll('[data-j17] svg')].map((v) => v.dataset.theme)); extra.cassetteTheme = th
  checks.cassetteR5Day = th.length === 3 && th.every((t) => t === 'day') } // Tag (tod Standard) = Orange; Nacht im eigenen Lauf unten
// Kassette: Ton aus/an an der Knet-Taste, Ansicht neu nur beim Wechsel
await page.evaluate(() => window.__kfbClayHud.resetStats()); await page.click('button[aria-label="Ton an/aus"]'); await wait(page, 500)
const m1 = await page.evaluate(() => ({ muted: window.__kfbClayHud.muted(), rt: window.__kfbClayHud.status().rtRenders, ui: window.__kfbClayHud.uiState('cassette.mute'), icon: document.querySelector('[data-j17=mute] svg')?.dataset.kind }))
await page.screenshot({ path: `${OUT}/5_kassette_stumm.png` })
await page.click('button[aria-label="Ton an/aus"]'); await wait(page, 300)
extra.cassette = m1; checks.cassetteMute = m1.muted && m1.icon === 'mute' && !(await page.evaluate(() => window.__kfbClayHud.muted())) // NEU: Knopf zeigt durchgestrichenen Lautsprecher (DOM), die 3D-Ansicht bleibt
// Zahnrad: Tafel mit Mode und Game/God (God ausgegraut), Fly schaltet den Flug, Walk zurück
await page.click('button[aria-label="Einstellungen"]'); await wait(page, 400)
const sp = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('kfb-hud-settings')).display !== 'none', modes: [...document.querySelectorAll('#kfb-hud-settings [data-mode]')].map((b) => b.dataset.mode + (b.disabled ? ':off' : '')) }))
await page.screenshot({ path: `${OUT}/6_zahnrad.png` })
await page.click('#kfb-hud-settings [data-mode=fly]'); await wait(page, 700)
const fly = await page.evaluate(() => window.__kfbClayHud.mode())
await page.click('#kfb-hud-settings [data-mode=walk]'); await wait(page, 700)
const walk = await page.evaluate(() => window.__kfbClayHud.mode())
extra.settings = { ...sp, fly, walk }
checks.gearSettings = sp.open && ['walk', 'drive', 'fly', 'game', 'god:off'].every((m) => sp.modes.includes(m))
checks.modeFly = fly === 'fly' && walk === 'walk'
await page.keyboard.press('Escape'); await wait(page, 200)
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
// Telefon quer (844 × 390, Emulator): Aktionsplätze gleichmäßig unten Mitte, Taste je Platz rechts unten, Gesamt-Zähler im Maßstab
{ const { browser: b6, page: p6 } = await openPage('#m1,debug,clean,harvest,look=terrain3,hud=3d', { viewport: { width: 844, height: 390 } })
  await p6.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p6.waitForTimeout(3000)
  const q = await p6.evaluate(() => { const R = window.__kfbClayHud.rects(), keys = [...document.querySelectorAll('#kfb-hud-clay div')].filter((d) => /^[VBN]$/.test(d.textContent)).map((d) => d.getBoundingClientRect().left)
    return { xs: [0, 1, 2].map((i) => R['act' + i].x + R['act' + i].w / 2), ws: [0, 1, 2].map((i) => R['act' + i].w), keys, fs: parseFloat(getComputedStyle(document.getElementById('kfb-hud3d-total')).fontSize) } })
  await b6.close(); extra.phone = q
  const d1 = q.xs[1] - q.xs[0], d2 = q.xs[2] - q.xs[1]
  checks.phoneLayout = Math.abs(d1 - d2) < 2 && q.keys.every((kx, i) => kx > q.xs[i] && kx < q.xs[i] + q.ws[i]) && q.fs < 30 }
// Ausrichtung bei 16:10 (1440 × 900): Tastenbuchstaben, leere Ringe und Blase auf derselben Höhe wie die 3D-Aktionen (Fenster ≠ 16:9)
{ const { browser: b5, page: p5 } = await openPage('#m1,debug,clean,harvest,look=terrain3,hud=3d', { viewport: { width: 1440, height: 900 } })
  await p5.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p5.waitForTimeout(3000)
  const a = await p5.evaluate(() => { const R = window.__kfbClayHud.rects(), c = (r) => r.y + r.h / 2, b = document.querySelector('[data-ui=inter]').getBoundingClientRect(), keys = [...document.querySelectorAll('#kfb-hud-clay div')].filter((d) => /^[VBN]$/.test(d.textContent)).map((d) => d.getBoundingClientRect())
    return { act: c(R.act1), bub: b.top + b.height / 2, keyTop: Math.min(...keys.map((k) => k.top)), actTop: R.act1.y } })
  await p5.screenshot({ path: `${OUT}/9_ausrichtung_16x10.png` }); await b5.close()
  extra.align1610 = a; checks.align16x10 = Math.abs(a.bub - a.act) < 30 && a.keyTop > a.actTop }
{ const { browser: b4, page: p4 } = await openPage('#m1,debug,clean,harvest,look=terrain3,tod=night,hud=3d', { viewport: VP })
  await p4.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p4.waitForTimeout(3000)
  const th = await p4.evaluate(() => [...document.querySelectorAll('[data-j17] svg')].map((v) => v.dataset.theme)); await p4.screenshot({ path: `${OUT}/8_kassette_nacht.png` }); await b4.close()
  extra.cassetteNight = th; checks.cassetteR5Night = th.length === 3 && th.every((t) => t === 'night') }
{ const { browser: b3, page: p3 } = await openPage('#m1,debug,clean,harvest,look=terrain3,hud=3d,cas=old', { viewport: VP })
  await p3.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p3.waitForTimeout(3000)
  const o = await p3.evaluate(() => ({ kind: window.__kfbClayHud.cassette(), chestW: window.__kfbClayHud.rects().chest.w / (innerWidth / 1920) })); await p3.screenshot({ path: `${OUT}/7_kassette_ALT.png` }); await b3.close()
  extra.casOld = o; checks.cassetteOldSwitch = o.kind === 'old' && o.chestW < 200 }
for (const [h, want] of [['#m1,debug,harvest,look=terrain3,hud=clay', 'clay'], ['#m1,debug,harvest,look=terrain3,hud=wood', 'wood']]) {
  const { browser: b2, page: p2 } = await openPage(h, { viewport: VP })
  await p2.waitForFunction(() => document.getElementById('kfb-hud-r5f'), null, { timeout: 120000 }).catch(() => {}); await p2.waitForTimeout(2500)
  const k = await p2.evaluate(() => window.__kfbClayHud?.kit || 'wood'); checks['switch_' + want] = k === want; await b2.close()
}
process.exit(report('hud-3d', checks, extra))
