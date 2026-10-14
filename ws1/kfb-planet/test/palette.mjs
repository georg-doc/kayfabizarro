// V-245 · Bühnen-Palette: ein deterministischer Prüfpunkt je Eigenschaft (#stage, near, ohne Figuren).
// Besitzer palette-roles.js R2 + world-palettes.js (1:1) · Karte → Deck-Genre → Palette · Billboard/Amphitheater/Boden/Himmel tragen die Rollen
// · Wechsel weich überblendet (V-011), danach keine Reste · Override palette=<id> und Rückfall Biom.
import fs from 'fs'
import { createHash } from 'crypto'
import { openPage, report } from './_page.mjs'

const blob = (f) => { const b = fs.readFileSync(f); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex') }
const vendor = blob('src/vendor/palette/palette-roles.js') === 'fd13480d9899081ec81e2270688c4d8f85a715ae' && blob('src/vendor/palette/world-palettes.js') === 'f6121ae41f00804a321592f60cdefb78206e76c6'
  && blob('src/vendor/palette/world-context.js') === '478e8cb4a53ea15e5c51833fa30554224e581815'
const T = JSON.parse(fs.readFileSync('src/data/stage-palette.genre.json', 'utf8')), G = JSON.parse(fs.readFileSync('src/data/deck-genres.json', 'utf8')).decks
const palOf = (d) => { for (const g of d.genre) if (T.genreToPalette[g]) return T.genreToPalette[g]; const g = d.bundle && T.bundleToGenre[d.bundle]; return (g && T.genreToPalette[g]) || null }
const mapped = Object.values(G).map(palOf), used = new Set(mapped)

const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' }, null, { timeout: 240000 })
const look = (page) => page.evaluate(() => { const S = window.__kfbStageMods, C = window.__kfbStageCtl, p = C.palette(), bb = S.billboard, body = bb.object3d.getObjectByName('body')
  const col = body.geometry.attributes.color.array, n = col.length, mean = [0, 1, 2].map((k) => { let s = 0; for (let i = k; i < n; i += 3) s += col[i]; return s / (n / 3) })
  return { id: p.id, via: p.via, storyMode: p.storyMode, wcAccent: p.wcAccent, roles: { frame: p.roles.frame, trim: p.roles.trim, post: p.roles.post, skyTop: p.roles.skyTop, skyBottom: p.roles.skyBottom }, amph: p.amph,
    bbPal: bb.info().palette, amphPal: S.amph.status().palette, sky: C.sky(), fog: '#' + window.__kfbStageCamera.parent?.fog?.color?.getHexString?.(), bodyMean: mean, fading: bb.fading() || S.amph.status().fading || C.sky().fading,
    cachedBody: !bb.fading() } })

// 1 · Standardkarte (forget_utopia #1, genre satire)
const { browser, page, errs } = await openPage('#stage,debug,actors=none', { viewport: { width: 1280, height: 720 } })
await ready(page); await page.waitForTimeout(800)
const a = await look(page)
const fogA = await page.evaluate(() => { let f = null; window.__kfbStageMods.amph.object3d.traverseAncestors((o) => { if (o.isScene) f = '#' + o.fog.color.getHexString() }); return f })
// 2 · Kartenwechsel auf ein Deck mit anderem Genre (cosmic_grift: conspiracy → grape_soda); Proben während und nach der Überblendung
await page.evaluate(() => window.__kfbStageCtl.applyPalette({ deck: { id: 'cosmic_grift_dark_journalism' }, num: 1 }))
await page.waitForTimeout(450); const mid = await look(page)
// Ende der Überblendung abwarten (Host-Takt ≤ 0,1 s je Bild: headless mit wenigen Bildern/s dauert sie länger als 1,2 s Wanduhr)
await page.waitForFunction(() => { const S = window.__kfbStageMods; return !S.billboard.fading() && !S.amph.status().fading && !window.__kfbStageCtl.sky().fading }, null, { timeout: 30000 }); const b = await look(page)
const log = await page.evaluate(() => window.__kfbStageCtl.palLog())
// dieselbe Karte noch einmal: kein neuer Wechsel
await page.evaluate(() => window.__kfbStageCtl.applyPalette({ deck: { id: 'cosmic_grift_dark_journalism' }, num: 1 })); const log2 = await page.evaluate(() => window.__kfbStageCtl.palLog().length)
await browser.close()
// 3 · Override und Rückfall
const o1 = await openPage('#stage,debug,actors=none,palette=ember', { viewport: { width: 640, height: 360 } }); await ready(o1.page); const ov = await look(o1.page); await o1.browser.close()
const o2 = await openPage('#stage,debug,actors=none,palette=biome', { viewport: { width: 640, height: 360 } }); await ready(o2.page); const fb = await look(o2.page); await o2.browser.close()

const dist = (x, y) => x.reduce((s, v, i) => s + Math.abs(v - y[i]), 0)
process.exit(report('palette V-245', {
  vendorByteIdentical: vendor,
  everyDeckHasPalette: mapped.every(Boolean) && used.size === 8, // alle 130 Decks, alle acht Paletten in Gebrauch
  cardDrivesPalette: a.id === 'cubescape' && a.via === 'genre satire',
  billboardWearsRoles: a.bbPal.frame === a.roles.frame && a.bbPal.trim === a.roles.trim && a.bbPal.post === a.roles.post,
  amphitheaterWearsRoles: a.amphPal && a.amphPal.c0 === a.amph.c0 && a.amphPal.c1 === a.amph.c1 && a.amphPal.c2 === a.amph.c2 && a.amphPal.ground === a.amph.ground,
  skyAndFogWearRoles: a.sky.top === a.roles.skyTop && a.sky.bottom === a.roles.skyBottom && fogA === a.roles.skyBottom,
  changeFollowsCard: b.id === 'grape_soda' && log.length === 1 && log[0].id === 'grape_soda' && b.bbPal.frame === b.roles.frame && b.amphPal.c1 === b.amph.c1 && b.sky.top === b.roles.skyTop,
  changeIsSoft: mid.fading === true && dist(mid.bodyMean, a.bodyMean) > 0.002 && dist(mid.bodyMean, b.bodyMean) > 0.002 && mid.sky.bottom !== a.sky.bottom && mid.sky.bottom !== b.sky.bottom, // dazwischen, kein harter Schnitt (V-011)
  fadeLeavesNothing: b.fading === false && b.cachedBody === true,
  sameCardNoChange: log2 === 1,
  accentFromCardLikeR2: !!a.storyMode && /^#[0-9a-f]{6}$/.test(a.wcAccent) && a.sky.top === a.roles.skyTop, // zweiter Akzent über Story-Modus der Karte (R2 computeContext)
  overrideAndFallback: ov.id === 'ember' && ov.via === 'override' && /^biome:/.test(fb.id) && fb.via === 'Rückfall Biom',
  noPageErrors: errs.length === 0 && o1.errs.length === 0 && o2.errs.length === 0,
}, { a, mid, b, log, ov: { id: ov.id, via: ov.via }, fb: { id: fb.id, via: fb.via }, fogA, errs }))
