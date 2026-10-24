// HUD 3D R1 (Standard seit Georg 25.10., V-743 – ohne Schalter geprüft; EINBAU_WS1 §4/§5) · Browser-Prüfung: Laden, Kugeln = Zähler (leer grau), Einflug Fluff → Kugel,
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
const { browser, page, errs } = await openPage('#m1,debug,clean,harvest,look=terrain3', { viewport: VP })
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
await page.waitForFunction(() => document.querySelectorAll('[data-ui=fan] img').length > 0, null, { timeout: 45000 }).catch(() => {}) // Kartenbilder kommen aus dem Netz (cardImage)
const fan = await page.evaluate(() => ({ imgs: document.querySelectorAll('[data-ui=fan] img').length, cap: [...document.querySelectorAll('#kfb-hud-clay div')].map((d) => d.innerText).find((t) => /CARDS/.test(t)) || '' }))
extra.fan = fan; checks.almanacFan = fan.imgs >= 1 && fan.imgs <= 7 && /\d+ CARDS\s*\|?\s*\d+ DECKS?/.test(fan.cap.replace(/\n/g, ' '))
// Gesamt-Fluff (Owner orchard.total, kfb.save fluffTotal): Zahl links vor den Kugeln, gleiche Höhe, Gruppe mittig
{ const t = await page.evaluate(() => { const el = document.getElementById('kfb-hud3d-total'), r = el?.getBoundingClientRect(), o = window.__kfbClayHud.rects(), L = o.orb0, R5 = o.orb5
    return { own: window.__kfbClayHud.fluffTotal(), txt: el?.dataset.value, shown: el && getComputedStyle(el).display !== 'none', right: r?.right, cy: r ? r.top + r.height / 2 : 0, orbL: L.x + L.w * 0.1, orbCy: L.y + L.h / 2, groupMid: r ? (r.left + R5.x + R5.w * 0.9) / 2 : 0, W: innerWidth } })
  extra.total = t; checks.fluffTotal = t.own != null && t.shown && +t.txt === t.own && t.right <= t.orbL && Math.abs(t.cy - t.orbCy) <= 2 && Math.abs(t.groupMid - t.W / 2) < 40 } // Flucht ≤ 2 px (Georg 24.10.)
// Fluchten und Größen (Georg 24.10.): Blase = Maßstab; Aktionen/Truhe als Verhältnis; Blase auf der Mittellinie der Aktionen; Zahnrad und Pfeil eine Spalte;
// keine Tangenten: Ton-Knopf klar innerhalb der Kassette und mit Abstand zu den Spulen-Knöpfen; Tasten wie das „I“ (gleiche Schrift, Lage, Abstand)
{ const g = await page.evaluate(() => { const H = window.__kfbClayHud, R = H.rects(), L = H.layout(), core = (k) => R[k].h * L[k].fill, cy = (r) => r.y + r.h / 2, cx = (r) => r.x + r.w / 2
    const bub = document.querySelector('[data-ui=inter]').getBoundingClientRect(), CB = H.cassetteButtons(), keys = [...document.querySelectorAll('#kfb-hud-clay div')].filter((d) => /^[VBNI]$/.test(d.textContent)).map((d) => ({ t: d.textContent, fs: getComputedStyle(d).fontSize, x: d.getBoundingClientRect().left, y: d.getBoundingClientRect().top }))
    const keyI = keys.find((k) => k.t === 'I'), keyV = keys.find((k) => k.t === 'V')
    return { actRatio: core('act0') / bub.height, chestRatio: core('chest') / bub.height, bubDy: Math.abs(cy(R.act0) - (bub.top + bub.height / 2)), colDx: Math.abs(cx(R.gear) - cx(R.arrow)),
      muteGapEdge: (CB.box.y1 - (CB.mute.y + CB.mute.r)) / (CB.box.y1 - CB.box.y0), muteGapSpool: Math.hypot(CB.mute.x - CB.play.x, CB.mute.y - CB.play.y) - CB.mute.r - CB.play.r,
      keyFsSame: keyI && keyV && keyI.fs === keyV.fs, keyIdx: keyI && (keyI.x - (bub.right)), keyVdx: keyV && (keyV.x - (R.act0.x + R.act0.w / 2 + core('act0') / 2)),
      infoHidden: getComputedStyle(document.getElementById('m1-keys-info') || document.body).display === 'none' || !document.getElementById('m1-keys-info'), RATIO: L.ratio || null } })
  extra.geometry = g
  checks.flightLines = g.bubDy <= 2 && g.colDx <= 2
  checks.sizeRatios = Math.abs(g.actRatio - 1.18) < 0.06 && Math.abs(g.chestRatio - 1.95) < 0.1
  checks.noTangents = g.muteGapEdge > 0.05 && g.muteGapSpool > 4 && g.keyIdx > 0 && g.keyVdx > 0
  checks.keysLikeI = !!g.keyFsSame
  checks.infoInGear = g.infoHidden /* Tastenliste in den Einstellungen: unten bei settingsL3 geprüft */ }
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
// Zahnrad → Einstellungen L3 (Paket 6, Board 08): Reiter Spiel/Ton/Steuerung/Barrierefreiheit; Mode und Game/God (God ausgegraut), Fly schaltet den Flug, Walk zurück
await page.click('button[aria-label="Einstellungen"]'); await wait(page, 500)
const sp = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('kfb-l3')).display !== 'none', L: window.__kfbClayHud.l3(), title: document.getElementById('kfb-l3-title')?.textContent, tabs: [...document.querySelectorAll('#kfb-l3-tabs [data-tab]')].map((b) => b.dataset.tab),
  modes: [...document.querySelectorAll('#kfb-l3-rows [data-mode]')].map((b) => b.dataset.mode + (b.disabled ? ':off' : '')), dev: !!document.querySelector('#kfb-l3-rows [data-setting=devui]'), gearOn: window.__kfbClayHud.status().ui?.gear }))
await page.screenshot({ path: `${OUT}/6_einstellungen.png` })
await page.click('#kfb-l3-rows [data-mode=fly]'); await wait(page, 700)
const fly = await page.evaluate(() => window.__kfbClayHud.mode())
await page.click('#kfb-l3-rows [data-mode=walk]'); await wait(page, 700)
const walk = await page.evaluate(() => window.__kfbClayHud.mode())
await page.click('#kfb-l3-tabs [data-tab=audio]'); await wait(page, 200)
const au = await page.evaluate(() => ({ sliders: document.querySelectorAll('#kfb-l3-rows input[type=range]').length, sound: !!document.querySelector('#kfb-l3-rows [data-setting=sound]') }))
await page.click('#kfb-l3-tabs [data-tab=controls]'); await wait(page, 200)
const ky = await page.evaluate(() => document.querySelector('#kfb-l3-rows [data-setting=keys]')?.textContent || '')
await page.click('#kfb-l3-tabs [data-tab=access]'); await wait(page, 200)
const rm0 = await page.evaluate(() => localStorage.getItem('kfb.hud.reducedMotion.v1')); await page.click('#kfb-l3-rows [data-setting=reducedMotion]'); await wait(page, 150)
const rm1 = await page.evaluate(() => localStorage.getItem('kfb.hud.reducedMotion.v1')); await page.click('#kfb-l3-rows [data-setting=reducedMotion]'); await wait(page, 150)
await page.keyboard.press('Escape'); await wait(page, 300); const closed = await page.evaluate(() => window.__kfbClayHud.l3()?.kind ?? null)
extra.settings = { ...sp, fly, walk, au, ky: ky.slice(0, 60), rm0, rm1, closed }
checks.gearSettings = sp.open && sp.L?.kind === 'settings' && ['walk', 'drive', 'fly', 'game', 'god:off'].every((m) => sp.modes.includes(m))
checks.settingsL3 = sp.title === 'EINSTELLUNGEN' && sp.tabs.join() === 'game,audio,controls,access' && sp.dev && au.sliders === 4 && au.sound && rm0 !== rm1 && closed === null
checks.infoInGear = checks.infoInGear && /vorwärts/.test(ky)
checks.modeFly = fly === 'fly' && walk === 'walk'
await page.keyboard.press('Escape'); await wait(page, 200)
// ── Paket 4: Flyouts L2 ─────────────────────────────────────────────────────────────────────────────────────────────
await page.click('button[aria-label^="Ziel"]'); await wait(page, 500)
const mf = await page.evaluate(() => { const el = document.getElementById('kfb-hud3d-map'), cv = el?.querySelector('canvas'), px = cv?.getContext('2d').getImageData(cv.width >> 1, cv.height >> 1, 1, 1).data
  const pr = el.getBoundingClientRect(), br = el.querySelector('[data-goal=return]').getBoundingClientRect()
  return { inside: br.bottom <= pr.bottom - 2 && br.right <= pr.right - 2, open: el && getComputedStyle(el).display !== 'none', goals: [...el.querySelectorAll('[data-goal]')].map((b) => b.dataset.goal), drawn: !!px && px[3] > 0, arrowUi: window.__kfbClayHud.uiState('arrow') } })
await page.screenshot({ path: `${OUT}/10_karte_ziele.png` })
await page.click('#kfb-hud3d-map [data-goal="orchard:goblin"]'); await wait(page, 1200)
const lab1 = await page.evaluate(() => document.getElementById('kfb-hud3d-label')?.innerText || '')
await page.keyboard.press('Escape'); await wait(page, 300)
const mfClosed = await page.evaluate(() => getComputedStyle(document.getElementById('kfb-hud3d-map')).display === 'none')
extra.mapFly = { ...mf, lab1: lab1.replace(/\n/g, ' '), mfClosed }
checks.mapFlyout = mf.open && mf.inside && mf.drawn && ['active', 'hover'].includes(mf.arrowUi) && ['stage', 'orchard:goblin', 'orchard:atlantis', 'orchard:utopia', 'return'].every((g) => mf.goals.includes(g)) && mfClosed
checks.goalSelect = /GOBLIN-GARTEN/.test(lab1)
// Return to start = Taste R
await page.evaluate(() => { window.__keys = [] }); await page.click('button[aria-label^="Ziel"]'); await wait(page, 300); await page.click('#kfb-hud3d-map [data-goal="return"]'); await wait(page, 300)
const rk = await page.evaluate(() => ({ keys: window.__keys, closed: getComputedStyle(document.getElementById('kfb-hud3d-map')).display === 'none', label: document.querySelector('#kfb-hud3d-map [data-goal="return"]')?.textContent }))
extra.returnStart = rk; checks.returnToStart = rk.keys.includes('KeyR') && rk.closed && rk.label === 'Return to start'
await page.evaluate(() => window.__kfbClayHud.goal(undefined)); await page.evaluate(() => document.querySelector('#kfb-hud3d-map [data-goal="stage"]')?.click())
// Fächer → letzte Karten
await page.click('[data-ui=fan]'); await wait(page, 400)
const ff = await page.evaluate(() => { const el = document.getElementById('kfb-hud3d-fan'); return { open: el && getComputedStyle(el).display !== 'none', imgs: el.querySelectorAll('img').length, fanImgs: document.querySelectorAll('[data-ui=fan] img').length, allEnabled: !!el.querySelector('button[data-l3=almanac]') && !el.querySelector('button[data-l3=almanac]').disabled } })
await page.screenshot({ path: `${OUT}/11_letzte_karten.png` })
await page.click('[data-ui=fan]'); await wait(page, 300)
const ffClosed = await page.evaluate(() => getComputedStyle(document.getElementById('kfb-hud3d-fan')).display === 'none')
extra.fanFly = { ...ff, ffClosed }; checks.fanFlyout = ff.open && ff.imgs === ff.fanImgs && ff.imgs >= 1 && ff.allEnabled && ffClosed
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
// ── Paket 5 (Georg 25.10.): Truhe klappt cartoonig auf (Deckel-Feder mit Überschwingen, Rückprall beim Zuklappen), Truhe 20 als L3; fraktaler Almanach
{ await page.click('button[aria-label="Truhe öffnen"]'); const lid = []; for (let i = 0; i < 14; i++) { lid.push((await page.evaluate(() => window.__kfbClayHud.lid()))?.angle); await wait(page, 30) }
  await wait(page, 500)
  const op = await page.evaluate(() => { const L = window.__kfbClayHud.l3(), t = document.getElementById('kfb-l3-title')?.textContent || ''; return { L, t, slots: document.querySelectorAll('#kfb-l3-chest [data-slot]').length, filled: document.querySelectorAll('#kfb-l3-chest [data-slot]:not([disabled])').length, lid: window.__kfbClayHud.lid(), vis: getComputedStyle(document.getElementById('kfb-l3')).display } })
  await page.screenshot({ path: `${OUT}/p5_truhe20.png` })
  await page.click('#kfb-l3 [data-l3=close]'); const lz = []; for (let i = 0; i < 16; i++) { lz.push((await page.evaluate(() => window.__kfbClayHud.lid()))?.angle); await wait(page, 30) }
  await wait(page, 400); const cl = await page.evaluate(() => ({ L: window.__kfbClayHud.l3(), lid: window.__kfbClayHud.lid() }))
  extra.p5chest = { op, cl, lid, lz }
  checks.chestL3 = op.vis === 'block' && op.L?.kind === 'chest' && op.slots === 20 && op.filled >= 1 && /^TRUHE · \d+ \/ 20$/.test(op.t)
  checks.chestLidCartoon = Math.min(...lid.filter((x) => x != null)) < -105 && Math.abs(op.lid.angle + 100) < 2 && cl.L.kind === null && Math.abs(cl.lid.angle) < 1 && Math.max(...lz.filter((x) => x != null)) <= 0.01 }
{ await page.click('[data-ui=fan]'); await wait(page, 400); await page.click('#kfb-hud3d-fan button[data-l3=almanac]'); await wait(page, 700)
  const l1 = await page.evaluate(() => ({ L: window.__kfbClayHud.l3(), decks: document.querySelectorAll('#kfb-l3-decks [data-deck]').length }))
  await page.screenshot({ path: `${OUT}/p5_almanach_1_decks.png` })
  await page.click('#kfb-l3-decks [data-deck]'); await wait(page, 800)
  const l2 = await page.evaluate(() => ({ L: window.__kfbClayHud.l3(), cards: document.querySelectorAll('#kfb-l3-cards [data-card]').length, n: window.__kfbM1?.harvest ? null : null }))
  await page.screenshot({ path: `${OUT}/p5_almanach_2_karten.png` })
  await page.click('#kfb-l3-cards [data-card]'); await wait(page, 900)
  const l3 = await page.evaluate(() => { const b = document.getElementById('kfb-l3-big'); return { L: window.__kfbClayHud.l3(), big: !!b && b.naturalWidth > 0, strip: document.querySelectorAll('#kfb-l3-strip button').length } })
  await page.screenshot({ path: `${OUT}/p5_almanach_3_detail.png` })
  const esc = []; for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape'); await wait(page, 450); esc.push(await page.evaluate(() => window.__kfbClayHud.l3()?.level)) }
  await page.click('[data-ui=fan]'); await wait(page, 400); await page.click('#kfb-hud3d-fan img[role=button]'); await wait(page, 700)
  const direct = await page.evaluate(() => window.__kfbClayHud.l3()); await page.keyboard.press('Escape'); await wait(page, 300); await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await wait(page, 300)
  extra.p5alm = { l1, l2, l3, esc, direct }
  checks.almanacFractal = l1.L?.level === 1 && l1.decks >= 1 && l2.L?.level === 2 && l2.cards >= 1 && l3.L?.level === 3 && l3.big && l3.strip === l2.cards && esc.join() === '2,1,0'
  checks.almanacFromFan = direct?.kind === 'almanac' && direct.level === 3 }
await browser.close()
// Rückfall-Schalter unverändert: hud=clay = Knet-HUD R1, hud=wood = Holz
// Telefon quer (844 × 390, Emulator): Aktionsplätze gleichmäßig unten Mitte, Taste je Platz rechts unten, Gesamt-Zähler im Maßstab
{ const { browser: b6, page: p6 } = await openPage('#m1,debug,clean,harvest,look=terrain3', { viewport: { width: 844, height: 390 } })
  await p6.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p6.waitForTimeout(3000)
  const q = await p6.evaluate(() => { const R = window.__kfbClayHud.rects(), keys = [...document.querySelectorAll('#kfb-hud-clay div')].filter((d) => /^[VBN]$/.test(d.textContent)).map((d) => d.getBoundingClientRect().left)
    const ib = document.getElementById('m1-keys-info')?.getBoundingClientRect(), cs = R.cassette
    return { iBottom: ib ? ib.bottom : null, casTop: cs.y, xs: [0, 1, 2].map((i) => R['act' + i].x + R['act' + i].w / 2), ws: [0, 1, 2].map((i) => R['act' + i].w), keys, fs: parseFloat(getComputedStyle(document.getElementById('kfb-hud3d-total')).fontSize) } })
  await b6.close(); extra.phone = q
  const d1 = q.xs[1] - q.xs[0], d2 = q.xs[2] - q.xs[1]
  checks.infoAboveCassette = q.iBottom == null || q.iBottom <= q.casTop + 2
  checks.phoneLayout = Math.abs(d1 - d2) < 2 && q.keys.every((kx, i) => kx > q.xs[i] && kx < q.xs[i] + q.ws[i]) && q.fs < 30 }
// Tempo-Leiste (Georg 24.10.): zu Fuß weg; im Racer sichtbar, Füllung folgt dem Tempo, Boost glüht (Hinweis-Lichthof), Zahl = km/h; Spalte Zahnrad/Pfeil
{ const walk = await (async () => { const { browser: bw, page: pw } = await openPage('#m1,debug,clean,harvest,look=terrain3', { viewport: VP }); await pw.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await pw.waitForTimeout(2500)
    const r = await pw.evaluate(() => window.__kfbClayHud.speed()); await bw.close(); return r })()
  const { browser: b7, page: p7 } = await openPage('#m1,car,debug,clean,harvest,look=terrain3', { viewport: VP })
  await p7.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p7.waitForTimeout(3000)
  const S0 = await p7.evaluate(() => window.__kfbClayHud.speed())
  await p7.keyboard.down('KeyW'); await p7.waitForTimeout(3500); const S1 = await p7.evaluate(() => ({ s: window.__kfbClayHud.speed(), txt: document.getElementById('kfb-hud3d-speed')?.innerText || '', num: (() => { const n = document.getElementById('kfb-hud3d-speed'), r = n.getBoundingClientRect(), R = window.__kfbClayHud.rects().speed, d = document.querySelector('#kfb-hud3d-label span:last-child'); return { dx: Math.abs(r.x + r.width / 2 - (R.x + R.w / 2)), below: r.top >= R.y + R.h * (1 + window.__kfbClayHud.layout().speed.fill) / 2 - 2, fs: parseFloat(getComputedStyle(n.firstChild).fontSize), fd: d ? parseFloat(getComputedStyle(d).fontSize) : null } })(), alt: (() => { const e = document.getElementById('kfb-hud3d-alt'); return !!e && getComputedStyle(e).display !== 'none' })(), /* Höhe nur im Flug */ col: Math.abs((window.__kfbClayHud.rects().speed.x + window.__kfbClayHud.rects().speed.w / 2) - (window.__kfbClayHud.rects().gear.x + window.__kfbClayHud.rects().gear.w / 2)) }))
  await p7.keyboard.down('ShiftLeft'); await p7.waitForTimeout(700); const S2 = await p7.evaluate(() => { const H = window.__kfbClayHud, R = H.rects().speed, L = H.layout(), inner = R.h * L.speed.fill, tubeBottom = R.y + (R.h + inner) / 2, k = R.h / L.speed.h, n = document.getElementById('kfb-hud3d-speed').getBoundingClientRect()
    return { s: H.speed(), fx: H.fxState('speed'), airGlow: n.top - (tubeBottom + L.speedCol.halo * k), airHard: n.top - (R.y + R.h / 2 + R.h / 2 * 1.12) } }); await p7.screenshot({ path: `${OUT}/12_tempo_boost.png` })
  await p7.keyboard.up('ShiftLeft'); await p7.waitForTimeout(1500); const S3 = await p7.evaluate(() => window.__kfbClayHud.speed()); await p7.keyboard.up('KeyW'); await b7.close()
  extra.speedBar = { walk, S0, S1, S2, S3 }
  checks.speedHiddenWalking = walk && !walk.visible
  checks.speedFollows = S0.visible && S1.s.visible && S1.s.shown > 0.15 && Math.abs(S1.s.shown - S1.s.target) < 0.08 && S1.txt.startsWith(String(S1.s.kmh)) && /KM\/H/.test(S1.txt) && S1.col <= 2
  // Säule R2 (Georg 25.10.): Zahl mittig unter der Säule in der Schrift der Entfernung, Zonen aus der Telemetrie, keine Höhen-Attrappe
  checks.speedColumnR2 = S1.num.dx <= 2 && S1.num.below && S1.num.fd != null && Math.abs(S1.num.fs - S1.num.fd) < 0.5 && Array.isArray(S1.s.zones) && S1.s.zones.length === 3 && !S1.alt
  checks.speedBoost = S2.s.boost && S2.s.glow > 0.05 && S2.fx?.hint && !S3.boost
  // R3 (Georg 25.10.): drei Zonen grün → gelb → rot (Rot = Ende), Boost als Effekt (A: Füllung über der Kappe), Lichthof berührt die Zahl nie (mit Luft)
  checks.speedR3 = S1.s.zones?.map((z) => z[0]).join() === 'norm,fast,red' && S2.s.over > 0.05 && S2.airGlow > 8 && S2.airHard > 2 }
// Paket 7 (Georg 25.10.): Säule auch beim Fliegen zu Fuß (Elan-Telemetrie aus dem M1-Wirt), Flughöhe über Grund links daneben (eine Flucht, Zahl auf Höhe der km/h)
{ const { browser: b8, page: p8 } = await openPage('#m1,debug,clean,harvest,look=terrain3,flight=elan', { viewport: VP })
  await p8.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p8.waitForTimeout(2500)
  const ground = await p8.evaluate(() => ({ alt: window.__kfbClayHud.altState() }))
  await p8.evaluate(() => { const M = window.__kfbM1, P = M.player(), f = M.feet(); P.teleport([f[0], f[1] + 25 * M.k, f[2]], P.heading?.() ?? 0); P.setFlying(true) }); await p8.waitForTimeout(1500)
  const fl = await p8.evaluate(() => { const H = window.__kfbClayHud, R = H.rects(), L = H.layout(), n = (id) => document.getElementById(id)?.getBoundingClientRect()
    const sp = R.speed, al = R.alt, k = sp.h / L.speed.h, inS = sp.h * L.speed.fill, inA = al.h * L.alt.fill, sTop = sp.y + (sp.h - inS) / 2 + (inS - L.speedCol.tubeBottom * k + L.speedCol.tubeTop * k), aTop = al.y + (al.h - inA) / 2
    const ns = n('kfb-hud3d-speed'), na = n('kfb-hud3d-alt')
    return { mode: H.mode(), sp: H.speed(), alt: H.altState(), tubeTop: sTop, tubeBottom: sp.y + (sp.h + inS) / 2, altTop: aTop, altBottom: aTop + inA, numTop: [ns.top, na.top], numGap: ns.left - na.right, colGap: sp.x + (sp.w - sp.w * 0.5) / 2 - (al.x + al.w), txt: document.getElementById('kfb-hud3d-alt').innerText.replace(/\n/g, ' ') } })
  await p8.screenshot({ path: `${OUT}/13_fussflug_hoehe.png` }); await b8.close()
  extra.p7 = { ground, fl }
  checks.footFlightColumn = fl.mode === 'fly' && fl.sp.visible && fl.sp.zones?.map((z) => z[0]).join() === 'norm,fast,red' && fl.sp.kmh > 0
  checks.altitude = !ground.alt.visible && fl.alt.visible && fl.alt.m > 5 && /M$/.test(fl.txt) && Math.abs(fl.altTop - fl.tubeTop) <= 2 && Math.abs(fl.altBottom - fl.tubeBottom) <= 2 && Math.abs(fl.numTop[0] - fl.numTop[1]) <= 2 && fl.numGap > 4 }
// Ausrichtung bei 16:10 (1440 × 900): Tastenbuchstaben, leere Ringe und Blase auf derselben Höhe wie die 3D-Aktionen (Fenster ≠ 16:9)
{ const { browser: b5, page: p5 } = await openPage('#m1,debug,clean,harvest,look=terrain3', { viewport: { width: 1440, height: 900 } })
  await p5.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p5.waitForTimeout(3000)
  const a = await p5.evaluate(() => { const R = window.__kfbClayHud.rects(), c = (r) => r.y + r.h / 2, b = document.querySelector('[data-ui=inter]').getBoundingClientRect(), keys = [...document.querySelectorAll('#kfb-hud-clay div')].filter((d) => /^[VBN]$/.test(d.textContent)).map((d) => d.getBoundingClientRect())
    return { act: c(R.act1), bub: b.top + b.height / 2, keyTop: Math.min(...keys.map((k) => k.top)), actTop: R.act1.y } })
  await p5.screenshot({ path: `${OUT}/9_ausrichtung_16x10.png` }); await b5.close()
  extra.align1610 = a; checks.align16x10 = Math.abs(a.bub - a.act) < 30 && a.keyTop > a.actTop }
{ const { browser: b4, page: p4 } = await openPage('#m1,debug,clean,harvest,look=terrain3,tod=night', { viewport: VP })
  await p4.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p4.waitForTimeout(3000)
  const th = await p4.evaluate(() => [...document.querySelectorAll('[data-j17] svg')].map((v) => v.dataset.theme)); await p4.screenshot({ path: `${OUT}/8_kassette_nacht.png` }); await b4.close()
  extra.cassetteNight = th; checks.cassetteR5Night = th.length === 3 && th.every((t) => t === 'night') }
{ const { browser: b3, page: p3 } = await openPage('#m1,debug,clean,harvest,look=terrain3,cas=old', { viewport: VP })
  await p3.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }).catch(() => {}); await p3.waitForTimeout(3000)
  const o = await p3.evaluate(() => ({ kind: window.__kfbClayHud.cassette(), chestW: window.__kfbClayHud.rects().chest.w / (innerWidth / 1920) })); await p3.screenshot({ path: `${OUT}/7_kassette_ALT.png` }); await b3.close()
  extra.casOld = o; checks.cassetteOldSwitch = o.kind === 'old' && o.chestW < 200 }
for (const [h, want] of [['#m1,debug,harvest,look=terrain3,hud=clay', 'clay'], ['#m1,debug,harvest,look=terrain3,hud=wood', 'wood']]) {
  const { browser: b2, page: p2 } = await openPage(h, { viewport: VP })
  await p2.waitForFunction(() => document.getElementById('kfb-hud-r5f'), null, { timeout: 120000 }).catch(() => {}); await p2.waitForTimeout(2500)
  const k = await p2.evaluate(() => window.__kfbClayHud?.kit || 'wood'); checks['switch_' + want] = k === want; await b2.close()
}
process.exit(report('hud-3d', checks, extra))
