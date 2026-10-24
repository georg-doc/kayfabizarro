// S1 Fortbewegung (V-746) · travel=1 im Browser: Auto zur Laufzeit rufen und wegschicken, ohne Neuladen. Rufen → Wagen neben der Figur, Fahrt nach
// Einsteigen (Figur eingefroren und verborgen, Kapsel fährt ohne Kollider mit, Kamera am Wagen, W fährt den Wagen, Racer-Flug per Leertaste doppelt ohne Schalter fly), zweiter Klick → Aussteigen → Verschwinden → zu Fuß (Wagen ausgehängt,
// Figur neben dem Wagen sichtbar, W bewegt die Figur). Ohne Schalter: kein __kfbTravel, kein Wagen. Nur im Test-Slot (PW_GPU=1).
import path from 'path'
import { chromium } from 'playwright'
import { report } from './unit/_report.mjs'
const BASE = '#m1,harvest,debug,clean,look=terrain3,world=probe,hud=3d'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const open = async (hash) => { const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage(), errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve((process.env.DIST || 'dist') + '/index.html') + hash); await page.waitForFunction(() => window.__kfbM1?.status?.().ready?.player === 'OK', null, { timeout: 240000 }); await page.mouse.click(640, 360); await page.waitForTimeout(1500); return { page, errs } }
const st = (page) => page.evaluate(() => { const T = window.__kfbTravel, M1 = window.__kfbM1, fig = M1.mods.player.object3d, c = window.__kfbM2?.car?.()?.pos?.()
  return { ride: T?.ride?.() ?? null, state: T?.sm.state ?? null, car: T?.car() ?? null, fig: M1.status().pos, figVisible: fig.visible, carPos: c ? [c.x, c.y, c.z] : null, cam: M1.status().camera, model: window.__kfbM2?.stats?.model ?? null } })
const dist = (a, b) => (a && b ? Math.hypot(a[0] - b[0], a[2] - b[2]) : NaN)
const hold = async (page, key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key) }

// Standard ohne Schalter
const D = await open(BASE); const def = await D.page.evaluate(() => ({ travel: typeof window.__kfbTravel, m2: typeof window.__kfbM2 })); await D.page.context().close()

// travel=1
const { page, errs } = await open(BASE + ',travel=1')
const s0 = await st(page)
await page.evaluate(() => window.__kfbTravel.click()); await page.waitForTimeout(300); const s1 = await st(page)
await page.waitForFunction(() => window.__kfbTravel.sm.state === 'drive', null, { timeout: 15000 }); await page.waitForTimeout(800); const s2 = await st(page)
await hold(page, 'KeyW', 1500); await page.waitForTimeout(300); const s3 = await st(page)
// Racer-Flug ohne Schalter fly: Sprung, in der Luft Leertaste doppelt → flyRacer; Klick im Flug wirkt nicht; Landung → drive
const tap = async () => { await page.keyboard.down('Space'); await page.waitForTimeout(70); await page.keyboard.up('Space') }
await page.keyboard.down('KeyW'); await page.waitForTimeout(600); await tap(); await page.waitForTimeout(150); await tap(); await page.waitForTimeout(120); await tap(); await page.keyboard.up('KeyW')
const flew = await page.waitForFunction(() => window.__kfbTravel.sm.state === 'flyRacer', null, { timeout: 4000 }).then(() => true, () => false)
const fClick = flew ? await page.evaluate(() => { window.__kfbTravel.click(); return window.__kfbTravel.sm.state }) : null
await page.keyboard.down('KeyS'); const landed = flew && await page.waitForFunction(() => window.__kfbTravel.sm.state === 'drive', null, { timeout: 30000 }).then(() => true, () => false); await page.keyboard.up('KeyS')
await page.waitForTimeout(1200); const s3b = await st(page)
await page.evaluate(() => window.__kfbTravel.click()); await page.waitForTimeout(200); const s4 = await st(page)
await page.waitForFunction(() => window.__kfbTravel.sm.state === 'foot', null, { timeout: 15000 }); await page.waitForTimeout(600); const s5 = await st(page)
await hold(page, 'KeyW', 1200); await page.waitForTimeout(300); const s6 = await st(page)
const log = await page.evaluate(() => window.__kfbTravel.sm.snapshot().log.map((l) => l.to))
await browser.close()

process.exit(report('s1-travel', {
  defaultUntouched: def.travel === 'undefined' && def.m2 === 'undefined',
  startOnFoot: s0.state === 'foot' && s0.car === false && !s0.carPos,
  summonPlacesCarBeside: s1.state === 'summon' && s1.car === true && dist(s1.carPos, s1.fig) < 6,
  driveFreezesAndHides: s2.state === 'drive' && s2.figVisible === false && s2.model === 'OK',
  wDrivesCarNotFigure: dist(s3.carPos, s2.carPos) > 3,
  capsuleRidesAlong: dist(s3.fig, s3.carPos) < 1 && s3.ride === true,
  racerFlyWithoutFlySwitch: flew && fClick === 'flyRacer' && landed && s3b.state === 'drive',
  secondClickExits: s4.state === 'exit',
  vanishUnmounts: s5.state === 'foot' && s5.car === false && s5.figVisible === true,
  figureBesideCarOnGround: dist(s5.fig, s4.carPos) < 6 && Math.abs(s5.fig[1] - s4.carPos[1]) < 2.5 && dist(s6.fig, s5.fig) < 8 && s6.fig[1] > -2, // nicht durch den Boden (darf von der Bühne steigen)
  wMovesFigureAgain: dist(s6.fig, s5.fig) > 1,
  cycle: log.join() === (flew ? 'summon,enter,drive,flyRacer,drive,exit,vanish,foot' : 'summon,enter,drive,exit,vanish,foot'),
  noPageErrors: errs.length === 0,
}, { flew, fClick, landed, s3b, def, s0, s1, s2, s3, s4, s5, s6, log, errs: errs.slice(0, 5) }))
