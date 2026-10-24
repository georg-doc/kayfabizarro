// HUD 3D Paket 7 (Georg 25.10.: Boost A, Almanach A, Säule auch zu Fuß, Flughöhe über Grund) + V-743 (HUD 3D Standard) + N33 controlTheme (Kassette).
// Bilder im Live-Stand (Site-Hash, Spielstand 97), Desktop und Telefon quer: Racer-Flug (Flug-Telemetrie eingespeist, Start braucht eine Rampe), Fuß-Flug
// (echt: Elan, 25 m hoch, Telemetrie aus dem M1-Wirt), Boost (Überkochen), Almanach (Zoom), Kassette Tag/Nacht neben dem r5-Bogen. Clip: Fuß-Flug mit Höhe.
// Ausgabe test/out/hud-3d/p7/
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js'
import fs from 'fs'; import path from 'path'
import sharp from 'sharp'
const OUT = 'test/out/hud-3d/p7'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
const SAVE = { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } }
const FLY = [['norm', 40], ['fast', 51], ['red', 60]]
const wait = (p, ms) => p.waitForTimeout(ms)
async function open(form, extra = '', ctxExtra = {}) {
  const ctx = await browser.newContext({ ...FORMS[form], ...ctxExtra })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean' + extra)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await wait(page, 5000)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat nicht geladen'))
  return { ctx, page, errs }
}
const footFly = (page) => page.evaluate(() => { const M = window.__kfbM1, P = M.player(), f = M.feet(); P.teleport([f[0], f[1] + 25 * M.k, f[2]], P.heading?.() ?? 0); P.setFlying(true) })
const state = (page) => page.evaluate(() => { const H = window.__kfbClayHud; return { kit: H.kit, mode: H.mode(), sp: H.speed(), alt: H.altState(), l3: H.l3(), cas: H.cassette?.() } })
const log = []
const shot = async (form, name, page, errs) => { await page.screenshot({ path: `${OUT}/${form}_${name}.png` }); const st = await state(page); log.push({ form, name, ...st, errs: errs.slice(0, 2) }); console.log(form, name, st.kit, st.mode, st.sp?.kmh, st.alt?.visible ? st.alt.m + ' m' : '-', errs.length ? errs.slice(0, 2) : 'ok') }
for (const form of ['desk', 'phoneL']) {
  { const { ctx, page, errs } = await open(form, ',flight=elan'); await footFly(page); await wait(page, 1600); await shot(form, '1_fussflug', page, errs); await ctx.close() }
  { const { ctx, page, errs } = await open(form, ',car'); await page.keyboard.down('KeyW'); await wait(page, 1500)
    await page.evaluate((F) => window.__kfbClayHud.speedFeed(() => ({ fly: true, ms: 46, zones: F, stall: 12, agl: 34 })), FLY); await wait(page, 1500); await shot(form, '2_racerflug', page, errs)
    await page.evaluate(() => window.__kfbClayHud.speedFeed((t) => ({ ms: t.zones[2][1] * 1.15, boosting: true, fly: false, agl: null }))); await wait(page, 1500); await shot(form, '3_boost', page, errs); await ctx.close() }
  { const { ctx, page, errs } = await open(form, ',cards=12'); await page.waitForFunction(() => document.querySelectorAll('[data-ui=fan] img').length > 0, null, { timeout: 45000 }).catch(() => {})
    await page.click('[data-ui=fan]'); await wait(page, 500); await page.click('#kfb-hud3d-fan button[data-l3=almanac]'); await wait(page, 900); await page.click('#kfb-l3-decks [data-deck]'); await wait(page, 1500); await shot(form, '4_almanach', page, errs); await ctx.close() }
}
// Kassette Tag/Nacht (N33 controlTheme) neben dem r5-Bogen: Ausschnitt unten rechts, Desktop
const R5 = path.resolve('src/private/50_BLENDER/N34/_privat_kauf_asset/out/N34_r5_kassette.png'), crops = []
for (const [n, h] of [['tag', ',ctl=day'], ['nacht', ',ctl=night']]) { const { ctx, page, errs } = await open('desk', h); const r = await page.evaluate(() => window.__kfbClayHud.rects().cassette)
  const f = `${OUT}/desk_5_kassette_${n}.png`; await page.screenshot({ path: f, clip: { x: r.x - 20, y: r.y - 20, width: r.w + 40, height: r.h + 40 } }); crops.push(f); log.push({ form: 'desk', name: '5_kassette_' + n, ...(await state(page)), errs }); await ctx.close() }
if (fs.existsSync(R5)) { const m = await sharp(R5).metadata(), ref = await sharp(R5).resize({ width: 900 }).toBuffer(), rm = await sharp(ref).metadata(), a = await sharp(crops[0]).resize({ height: 300 }).toBuffer(), b = await sharp(crops[1]).resize({ height: 300 }).toBuffer(), am = await sharp(a).metadata()
  await sharp({ create: { width: 900 + 24 + am.width, height: Math.max(rm.height, 640), channels: 3, background: '#e9e2d4' } }).composite([{ input: ref, left: 0, top: 0 }, { input: a, left: 924, top: 20 }, { input: b, left: 924, top: 340 }]).png().toFile(`${OUT}/desk_5_kassette_gegen_r5.png`) }
// Clip: Fuß-Flug mit Höhe (gleiten, mit W sinken, mit Leertaste steigen)
{ const { ctx, page } = await open('desk', ',flight=elan', { deviceScaleFactor: 1, recordVideo: { dir: OUT + '/_v', size: { width: 1440, height: 900 } } })
  await wait(page, 500); await footFly(page); await wait(page, 2000); await page.keyboard.down('KeyW'); await wait(page, 900); await page.keyboard.up('KeyW'); await wait(page, 800)
  for (let i = 0; i < 2; i++) { await page.keyboard.press('Space'); await wait(page, 900) } await wait(page, 1500)
  const v = page.video(); await ctx.close(); fs.renameSync(await v.path(), `${OUT}/clip_fussflug_hoehe.webm`); fs.rmSync(OUT + '/_v', { recursive: true, force: true }); console.log('clip ok') }
fs.writeFileSync(`${OUT}/messung.json`, JSON.stringify(log, null, 1))
await browser.close()
