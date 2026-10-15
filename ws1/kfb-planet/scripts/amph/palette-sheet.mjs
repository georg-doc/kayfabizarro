// V-270 · Abnahme-Bilder für Georg (V-253): je Insel-Palette ein eigenes Bühnenbild 1920 × 1080 (#stage, near, Besetzung FB | GothGirl)
// mit einer passenden Karte und großer Beschriftung im Bild. Karte = erste gesicherte Karte (mapping-audit „ok“) des ersten SAFE-Decks,
// dessen Genre auf die Palette zeigt (Tabelle stage-palette.genre.json). Der Story-Tint folgt dieser Karte.
// node scripts/amph/palette-sheet.mjs [out-ordner] [zusatz-hash, z. B. palv=b,plain] [beschriftung]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/palette-sheet'; fs.mkdirSync(OUT, { recursive: true })
const HX = process.argv[3] ? ',' + process.argv[3] : '', LABEL = process.argv[4] || ''
const T = JSON.parse(fs.readFileSync('src/data/stage-palette.genre.json', 'utf8')), G = JSON.parse(fs.readFileSync('src/data/deck-genres.json', 'utf8')).decks
const A = JSON.parse(fs.readFileSync('src/data/mapping-audit.json', 'utf8')), AD = A.decks || A
const C = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), ids = C.decks.map((d) => d[0])
const palOf = (d) => { for (const g of d.genre) if (T.genreToPalette[g]) return [T.genreToPalette[g], g]; const g = d.bundle && T.bundleToGenre[d.bundle]; return g && T.genreToPalette[g] ? [T.genreToPalette[g], g] : [null, null] }
const PALS = ['otown', 'bucht', 'canyon', 'wueste', 'kfb_town', 'protopia']
const NAMES = { otown: 'O-Town (schräge Vorstadt)', bucht: 'Bikini-Bucht', canyon: 'Claybound-Canyon', wueste: 'Pyramiden-Wüste', kfb_town: 'KFB Town (Burg)', protopia: 'Protopia (Bergwiese)' }
const pick = (pal) => {
  for (const [deck, d] of Object.entries(G)) {
    const [p, g] = palOf(d); if (p !== pal || AD[deck]?.status !== 'SAFE' || deck.startsWith('medkayfab_')) continue
    const di = ids.indexOf(deck), have = new Set(C.cards.filter((c) => c[0] === di).map((c) => c[1]))
    const n = (AD[deck].ok || []).find((k) => have.has(k)); if (n) return { deck, n, genre: g, name: C.cards.find((c) => c[0] === di && c[1] === n)[2] }
  }
  return null
}
export async function caption(page, title, sub) {
  await page.evaluate(({ title, sub }) => { const d = document.createElement('div'); d.id = 'kfb-caption'
    d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:22px 40px;background:rgba(20,16,12,.78);color:#fff;font:600 44px/1.15 system-ui,sans-serif;z-index:99999'
    d.innerHTML = `<div>${title}</div>${sub ? `<div style="font:400 28px/1.3 system-ui,sans-serif;opacity:.9;margin-top:6px">${sub}</div>` : ''}`; document.body.appendChild(d) }, { title, sub })
}
const rows = []
for (const [i, pal] of PALS.entries()) {
  const k = pick(pal); if (!k) { rows.push({ pal, missing: true }); continue }
  const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,card=${k.deck}:${k.n}${HX}`, { viewport: { width: 1920, height: 1080 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().shown !== false }, null, { timeout: 300000 })
  await page.waitForTimeout(2000)
  const info = await page.evaluate(() => { const p = window.__kfbStageCtl.palette(); return { id: p.id, via: p.via, storyMode: p.storyMode, tint: p.tint, billboard: p.billboard, amph: p.amph, sky: p.sky } })
  await caption(page, `${i + 1}/6 · ${LABEL ? LABEL + ' · ' : ''}Palette ${NAMES[pal]}`, `Karte „${k.name}“ (${k.deck} #${k.n}) · Genre ${k.genre} · ` + (info.tint ? `Story-Modus ${info.storyMode || '–'}, Tint 12 %` : 'ohne Story-Tint (reine Palette)'))
  await page.evaluate(() => document.getElementById('kfb-cam-marks')?.style.setProperty('display', 'none')); await page.waitForTimeout(150)
  const file = `${OUT}/${i + 1}_${pal}.png`; fs.writeFileSync(file, await page.screenshot())
  rows.push({ pal, ...k, ...info, file, errs: errs.length }); await browser.close()
}
fs.writeFileSync(`${OUT}/palette-sheet.json`, JSON.stringify(rows, null, 1))
console.log(JSON.stringify(rows.map((r) => [r.pal, r.deck, r.n, r.genre, r.id, r.via, r.storyMode, r.errs])))
