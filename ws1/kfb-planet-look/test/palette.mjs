// V-270 · Bühnen-Paletten als Harmonie-Systeme: ein deterministischer Prüfpunkt je Eigenschaft (#stage, near, ohne Figuren).
// Insel-Paletten + ENV_ROLES (Lab palettes.ts, 1:1 gewandelt) · Karte → Deck-Genre → Palette · Billboard/Amphitheater (Wand/Boden)/Gelände/Himmel tragen
// die Rollen · Story-Tint aus storymode.v4.js höchstens 15 % · Wechsel weich überblendet (V-011), danach keine Reste · Override palette=<Insel>, plain ohne Tint.
import fs from 'fs'
import { createHash } from 'crypto'
import { openPage, report } from './_page.mjs'

const blob = (f) => { const b = fs.readFileSync(f); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex') }
const vendor = blob('src/vendor/palette/island-palettes.js') === 'a7d13cbddbf215fdda0b122d8cef8ae3abe9cd4c' && blob('src/vendor/palette/storymode.v4.js') === '58a79133e83d77537903dadbfde8703995e1551e'
  && blob('src/vendor/palette/world-context.js') === '478e8cb4a53ea15e5c51833fa30554224e581815'
const T = JSON.parse(fs.readFileSync('src/data/stage-palette.genre.json', 'utf8')), G = JSON.parse(fs.readFileSync('src/data/deck-genres.json', 'utf8')).decks
const palOf = (d) => { for (const g of d.genre) if (T.genreToPalette[g]) return T.genreToPalette[g]; const g = d.bundle && T.bundleToGenre[d.bundle]; return (g && T.genreToPalette[g]) || null }
const mapped = Object.values(G).map(palOf), used = new Set(mapped)

const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' }, null, { timeout: 240000 })
const look = (page) => page.evaluate(() => { const S = window.__kfbStageMods, C = window.__kfbStageCtl, p = C.palette(), bb = S.billboard, body = bb.object3d.getObjectByName('body')
  const col = body.geometry.attributes.color.array, n = col.length, mean = [0, 1, 2].map((k) => { let s = 0; for (let i = k; i < n; i += 3) s += col[i]; return s / (n / 3) })
  let fog = null; S.amph.object3d.traverseAncestors((o) => { if (o.isScene) fog = '#' + o.fog.color.getHexString() })
  return { id: p.id, via: p.via, storyMode: p.storyMode, tint: p.tint, billboard: p.billboard, amph: p.amph, skyP: p.sky, env: { stone: p.env.stone, paved: p.env.paved, accent: p.env.accent, bark: p.env.bark, ground: p.env.ground },
    bbPal: bb.info().palette, amphPal: S.amph.status().palette, sky: C.sky(), fog, bodyMean: mean, fading: bb.fading() || S.amph.status().fading || C.sky().fading, cachedBody: !bb.fading() } })
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y)

// 1 · Standardkarte (forget_utopia #1, genre satire → otown)
const { browser, page, errs } = await openPage('#stage,debug,actors=none', { viewport: { width: 1280, height: 720 } })
await ready(page); await page.waitForTimeout(800)
const a = await look(page)
// 2 · Kartenwechsel auf ein Deck mit anderem Genre (cosmic_grift: conspiracy → canyon); Proben während und nach der Überblendung
await page.evaluate(() => window.__kfbStageCtl.applyPalette({ deck: { id: 'cosmic_grift_dark_journalism' }, num: 1 }))
await page.waitForTimeout(450); const mid = await look(page)
// Ende der Überblendung abwarten (Host-Takt ≤ 0,1 s je Bild: headless mit wenigen Bildern/s dauert sie länger als 1,2 s Wanduhr)
await page.waitForFunction(() => { const S = window.__kfbStageMods; return !S.billboard.fading() && !S.amph.status().fading && !window.__kfbStageCtl.sky().fading }, null, { timeout: 30000 }); const b = await look(page)
const log = await page.evaluate(() => window.__kfbStageCtl.palLog())
// dieselbe Karte noch einmal: kein neuer Wechsel
await page.evaluate(() => window.__kfbStageCtl.applyPalette({ deck: { id: 'cosmic_grift_dark_journalism' }, num: 1 })); const log2 = await page.evaluate(() => window.__kfbStageCtl.palLog().length)
await browser.close()
// 3 · Override ohne Tint: Rollen = Lab-Daten 1:1 (bucht)
const o1 = await openPage('#stage,debug,actors=none,palette=bucht,plain', { viewport: { width: 640, height: 360 } }); await ready(o1.page); const ov = await look(o1.page); await o1.browser.close()
// 4 · Variante B (§36): jede Rolle auf ihrem Bühnenteil wie Joyride (otown ohne Tint)
const o2 = await openPage('#stage,debug,actors=none,palette=otown,plain,palv=b', { viewport: { width: 640, height: 360 } }); await ready(o2.page)
const vb = await o2.page.evaluate(() => { const S = window.__kfbStageMods, p = window.__kfbStageCtl.palette(); return { variant: p.variant, P: { tower: p.palette.tower, hill: p.palette.hill, sand: p.palette.sand, rock: p.palette.rock, top: p.palette.top, strang: p.palette.strang, trunk: p.palette.trunk, path: p.palette.path }, amphPal: S.amph.status().palette, bbPal: S.billboard.info().palette } })
await o2.browser.close()

const dist = (x, y) => x.reduce((s, v, i) => s + Math.abs(v - y[i]), 0)
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
// Tint-Grenze: je Kanal höchstens 15 % des Abstands Palette → Modus-Akzent (+1 Rundung)
const tintOk = (t, plain, acc) => rgb(t).every((v, i) => Math.abs(v - rgb(plain)[i]) <= 0.15 * Math.abs(rgb(acc)[i] - rgb(plain)[i]) + 1)
const rev = (x) => [x[2], x[1], x[0]]
process.exit(report('palette V-270', {
  vendorByteIdentical: vendor,
  everyDeckHasPalette: mapped.every(Boolean) && used.size === 6, // alle 130 Decks, alle sechs Insel-Paletten in Gebrauch
  cardDrivesPalette: a.id === 'otown' && a.via === 'genre satire',
  billboardWearsRoles: a.bbPal.frame === a.billboard.frame && a.bbPal.trim === a.billboard.trim && a.bbPal.post === a.billboard.post,
  amphitheaterWearsRoles: !!a.amphPal && same(a.amphPal.wall, a.amph.wall) && same(a.amphPal.floor, a.amph.floor) && a.amphPal.ground === a.amph.ground,
  skyAndFogWearRoles: a.sky.top === a.skyP.top && a.sky.bottom === a.skyP.bottom && a.fog === a.skyP.bottom,
  rolesAreLabData: ov.id === 'bucht' && ov.via === 'override' && ov.tint === null && ov.billboard.frame === ov.env.accent[0] && ov.billboard.trim === ov.env.accent[2] && ov.billboard.post === ov.env.bark[1]
    && same(ov.amph.wall, rev(ov.env.stone)) && same(ov.amph.floor, rev(ov.env.paved)) && ov.amph.ground === ov.env.ground[1] && ov.billboard.frame === '#b08ae0', // bucht accent[0] aus palettes.ts
  noStoryTintFromCard: a.storyMode === null && a.tint === null && a.billboard.frame === a.env.accent[0], // Georg 16.10./V-342: Karte hat keinen Story-Mode, kein Tint ohne Würfel
  changeFollowsCard: b.id === 'canyon' && log.length === 1 && log[0].id === 'canyon' && b.bbPal.frame === b.billboard.frame && same(b.amphPal.wall, b.amph.wall) && b.sky.top === b.skyP.top,
  changeIsSoft: mid.fading === true && dist(mid.bodyMean, a.bodyMean) > 0.002 && dist(mid.bodyMean, b.bodyMean) > 0.002 && mid.sky.bottom !== a.sky.bottom && mid.sky.bottom !== b.sky.bottom, // dazwischen, kein harter Schnitt (V-011)
  fadeLeavesNothing: b.fading === false && b.cachedBody === true,
  sameCardNoChange: log2 === 1,
  variantBRolePerPart: vb.variant === 'b' && vb.amphPal.mode === 'b' && same(vb.amphPal.cols, [vb.P.tower[0], vb.P.tower[1], vb.P.hill[0], vb.P.hill[1], vb.P.sand, vb.P.rock]) && vb.amphPal.ground === vb.P.top
    && vb.bbPal.frame === vb.P.strang && vb.bbPal.post === vb.P.trunk && vb.bbPal.trim === vb.P.path && vb.P.strang === '#e9b53b', // otown strang = Joyride WORLDS 1:1
  noPageErrors: errs.length === 0 && o1.errs.length === 0 && o2.errs.length === 0,
}, { vb, a: { id: a.id, via: a.via, storyMode: a.storyMode, tint: a.tint, billboard: a.billboard, amph: a.amph }, b: { id: b.id, storyMode: b.storyMode }, log, ov: { id: ov.id, billboard: ov.billboard, amph: ov.amph }, errs }))
