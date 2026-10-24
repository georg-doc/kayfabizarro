// HUD 3D Tempo-Säule R3 (Georg 25.10.): Bilder im Live-Stand + Clip. Zustände leer · langsam · mittel · rot · Boost A · Boost B · Flug · Flug-Boost, Desktop 2880×1800 und Telefon quer.
// Messung „Lichthof → Zahl“: Wagen steht, Bild ohne und mit Boost; die Differenz unter der Säule ist der Lichthof, seine Unterkante muss mit Luft über der Zahl liegen.
// Fahren: Wagen fährt (W), Zonen echt aus der Telemetrie; Tempo eingespeist, damit jeder Zustand genau sitzt. Fliegen: Flug-Start braucht eine Rampe,
// deshalb Flug-Telemetrie eingespeist (Zonen = ELAN in J17-m/s). Clip: echte Fahrt ohne Einspeisung (anfahren, Boost, ausrollen).
// Ausgabe: test/out/hud-3d/tempo-r3/<form>_<zustand>.png, <form>_uebersicht.png, messung.json, clip_fahrt.webm. Einzelbild: ONLY=desk,3_rot
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js'
import fs from 'fs'; import path from 'path'
import sharp from 'sharp'
const OUT = 'test/out/hud-3d/tempo-r3'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
const SAVE = { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } }
const FLY = [['norm', 40], ['fast', 51], ['red', 60]] // Flug: grün bis sThrill, rot ab 85 % von sDive (ELAN-Startwerte in J17-m/s = Telemetrie im Flug)
const STATES = {
  '1_leer': { gas: false, feed: (t) => ({ ms: 0 }) },
  '2_langsam': { gas: true, feed: (t) => ({ ms: t.zones[0][1] * 0.6 }) },
  '3_mittel': { gas: true, feed: (t) => ({ ms: (t.zones[0][1] + t.zones[1][1]) / 2 }) },
  '4_rot': { gas: true, feed: (t) => ({ ms: t.zones[2][1] * 0.96 }) },
  '5_boost_A': { gas: true, hash: ',boost=a', feed: (t) => ({ ms: t.zones[2][1] * 1.15, boosting: true }) },
  '6_boost_B': { gas: true, hash: ',boost=b', feed: (t) => ({ ms: t.zones[2][1] * 1.15, boosting: true }) },
  '7_flug': { gas: true, feed: (t, F) => ({ fly: true, ms: 46, boosting: false, zones: F, stall: 12 }) },
  '8_flug_boost': { gas: true, feed: (t, F) => ({ fly: true, ms: 78, boosting: true, zones: F, stall: 12 }) },
}
const log = []
async function open(form, extra = {}, hash = '') {
  const ctx = await browser.newContext({ ...FORMS[form], ...extra })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean,hud=3d,car' + hash)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(5000)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat nicht geladen'))
  return { ctx, page, errs }
}
async function shot(form, name, S) {
  const { ctx, page, errs } = await open(form, {}, S.hash || '')
  if (S.gas) { await page.keyboard.down('KeyW'); await page.waitForTimeout(1500) }
  await page.evaluate(([src, F]) => { const f = eval('(' + src + ')'); window.__kfbClayHud.speedFeed((t) => f(t, F)) }, [S.feed.toString(), FLY])
  await page.waitForTimeout(1600)
  const st = await page.evaluate(() => { const H = window.__kfbClayHud, R = H.rects(), n = document.getElementById('kfb-hud3d-speed'), nr = n.getBoundingClientRect(), lab = document.querySelector('#kfb-hud3d-label span:last-child')
    return { s: H.speed(), r: R.speed, gear: R.gear, arrow: R.arrow, cas: R.cassette, txt: n.innerText.replace(/\n/g, ' '), num: { cx: nr.x + nr.width / 2, top: nr.top, bottom: nr.bottom, fs: parseFloat(getComputedStyle(n.firstChild).fontSize) }, dist: lab ? parseFloat(getComputedStyle(lab).fontSize) : null, fx: H.fxState('speed'), alt: !!document.getElementById('kfb-hud3d-alt') } })
  const file = `${OUT}/${form}_${name}.png`; await page.screenshot({ path: file })
  const cx = (r) => r.x + r.w / 2
  log.push({ form, name, kmh: st.s.kmh, zone: st.s.zone, shown: st.s.shown, glow: st.s.glow, txt: st.txt, line: { column: +(cx(st.r) - cx(st.gear)).toFixed(1), num: +(st.num.cx - cx(st.gear)).toFixed(1), arrow: +(cx(st.arrow) - cx(st.gear)).toFixed(1) }, numFs: st.num.fs, distFs: st.dist,
    gapGear: +(st.r.y - (st.gear.y + st.gear.h)).toFixed(0), gapCas: +(st.cas.y - st.num.bottom).toFixed(0), rect: st.r, wob: st.fx?.rot ?? null, altShown: st.alt, errs: errs.slice(0, 2) })
  console.log(form, name, st.s.zone, st.s.kmh, st.txt, errs.length ? errs.slice(0, 2) : 'ok')
  await ctx.close(); return file
}
const ONLY = process.env.ONLY
if (ONLY) { const [f, n] = ONLY.split(','); await shot(f, n, STATES[n]); await browser.close(); console.log(JSON.stringify(log[0])); process.exit(0) }
// Lichthof → Zahl (Lead 25.10.): Der Lichthof wird nur in der Hülle (Quad) der Säule gezeichnet. Gemessen wird im Boost:
// 1) theoretische Lichthof-Unterkante = Röhren-Unterkante + haloR, 2) harte Grenze = Hüllen-Unterkante bei größtem Squash (+12 %). Beide müssen mit Luft über der Zahl liegen.
// (Eine Bild-Differenz taugt nicht: die Welt hinter dem HUD bewegt sich auch bei stehendem Wagen.)
async function glowGap(form, kind) {
  const { ctx, page } = await open(form, {}, ',boost=' + kind)
  await page.evaluate(() => window.__kfbClayHud.speedFeed((t) => ({ ms: t.zones[2][1] * 0.98, boosting: true }))); await page.waitForTimeout(1500)
  const g = await page.evaluate(() => { const H = window.__kfbClayHud, R = H.rects().speed, L = H.layout(), k = R.h / (L.speed.h), n = document.getElementById('kfb-hud3d-speed').getBoundingClientRect()
    return { R, k, fill: L.speed.fill, col: L.speedCol, numTop: n.top, fx: H.fxState('speed'), sp: H.speed() } })
  const inner = g.R.h * g.fill, innerTop = g.R.y + (g.R.h - inner) / 2, tubeBottom = innerTop + inner, haloPx = g.col.halo * g.k
  const theo = tubeBottom + haloPx, hard = g.R.y + g.R.h / 2 + (g.R.h / 2) * 1.12
  await ctx.close(); const r = { form, kind, tubeBottom: +tubeBottom.toFixed(1), glowTheo: +theo.toFixed(1), quadHard: +hard.toFixed(1), numTop: +g.numTop.toFixed(1), airTheo: +(g.numTop - theo).toFixed(1), airHard: +(g.numTop - hard).toFixed(1), boost: g.sp.boost, fxHint: g.fx?.hint }
  console.log('lichthof', JSON.stringify(r)); return r
}
const GLOW = []
for (const form of ['desk', 'phoneL']) for (const kind of ['a', 'b']) GLOW.push(await glowGap(form, kind))
if (process.env.GLOW_ONLY) { await browser.close(); process.exit(0) }
for (const form of ['desk', 'phoneL']) {
  const files = []; for (const [name, S] of Object.entries(STATES)) files.push(await shot(form, name, S))
  // Übersicht: rechte Spalte (Pfeil bis Kassette) je Zustand nebeneinander
  const m = await sharp(files[0]).metadata(), cw = Math.round(m.width * 0.2), ch = Math.round(m.height * (form === 'desk' ? 0.66 : 0.76)), left = m.width - cw
  const tiles = []; for (const [i, f] of files.entries()) tiles.push({ input: await sharp(f).extract({ left, top: 0, width: cw, height: ch }).toBuffer(), left: i * (cw + 8), top: 0 })
  await sharp({ create: { width: files.length * (cw + 8) - 8, height: ch, channels: 3, background: '#1f1829' } }).composite(tiles).png().toFile(`${OUT}/${form}_uebersicht.png`)
}
// Clip (Desktop, 1440×900): echte Fahrt – anfahren, Boost, ausrollen
{ const { ctx, page } = await open('desk', { deviceScaleFactor: 1, recordVideo: { dir: OUT + '/_video', size: { width: 1440, height: 900 } } })
  await page.keyboard.down('KeyW'); await page.waitForTimeout(3500); await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(2000); await page.keyboard.up('ShiftLeft'); await page.waitForTimeout(1200); await page.keyboard.up('KeyW'); await page.waitForTimeout(2500)
  const v = page.video(); await ctx.close(); const p = await v.path(); fs.renameSync(p, `${OUT}/clip_fahrt.webm`); fs.rmSync(OUT + '/_video', { recursive: true, force: true }) }
fs.writeFileSync(`${OUT}/messung.json`, JSON.stringify({ zustaende: log, lichthof: GLOW }, null, 1))
await browser.close()
