// V-245 · Bildbogen für Georg: je Cartoon-Palette ein Bühnenbild (#stage, near, FrizzleBob) mit einer passenden Karte.
// Karte = erste gesicherte Karte (mapping-audit „ok“) des ersten SAFE-Decks, dessen Genre auf die Palette zeigt (Tabelle stage-palette.genre.json).
// node scripts/amph/palette-sheet.mjs [out-ordner]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/palette-sheet'; fs.mkdirSync(OUT, { recursive: true })
const T = JSON.parse(fs.readFileSync('src/data/stage-palette.genre.json', 'utf8')), G = JSON.parse(fs.readFileSync('src/data/deck-genres.json', 'utf8')).decks
const A = JSON.parse(fs.readFileSync('src/data/mapping-audit.json', 'utf8')), AD = A.decks || A
const C = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), ids = C.decks.map((d) => d[0])
const palOf = (d) => { for (const g of d.genre) if (T.genreToPalette[g]) return [T.genreToPalette[g], g]; const g = d.bundle && T.bundleToGenre[d.bundle]; return g && T.genreToPalette[g] ? [T.genreToPalette[g], g] : [null, null] }
const PALS = ['cubescape', 'bubblegum', 'toybox', 'mint_pop', 'sunset_arcade', 'grape_soda', 'seafoam', 'ember']
const pick = (pal) => {
  for (const [deck, d] of Object.entries(G)) {
    const [p, g] = palOf(d); if (p !== pal || AD[deck]?.status !== 'SAFE' || deck.startsWith('medkayfab_')) continue
    const di = ids.indexOf(deck), have = new Set(C.cards.filter((c) => c[0] === di).map((c) => c[1]))
    const n = (AD[deck].ok || []).find((k) => have.has(k)); if (n) return { deck, n, genre: g, name: C.cards.find((c) => c[0] === di && c[1] === n)[2] }
  }
  return null
}
const rows = []
for (const pal of PALS) {
  const k = pick(pal); if (!k) { rows.push({ pal, missing: true }); continue }
  const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,card=${k.deck}:${k.n}`, { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().shown }, null, { timeout: 300000 })
  await page.waitForTimeout(1500)
  const info = await page.evaluate(() => { const p = window.__kfbStageCtl.palette(); return { id: p.id, via: p.via, stops: p.stops, bb: window.__kfbStageMods.billboard.info().palette, sky: window.__kfbStageCtl.sky() } })
  const file = `${OUT}/${pal}.png`; fs.writeFileSync(file, await page.screenshot())
  rows.push({ pal, ...k, ...info, file, errs: errs.length }); await browser.close()
}
fs.writeFileSync(`${OUT}/palette-sheet.json`, JSON.stringify(rows, null, 1))
console.log(JSON.stringify(rows.map((r) => [r.pal, r.deck, r.n, r.genre, r.id, r.via, r.errs])))
