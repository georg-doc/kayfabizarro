// Papierrand je Deck (Karte 1 jedes SAFE-Decks): welche Viertelseiten haben einen weißen Rand (→ runde Innenecken)?
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage('#stagetest,debug', { viewport: { width: 800, height: 600 } })
await page.waitForFunction(() => window.__kfbSafeDecks, null, { timeout: 60000 })
const decks = (await page.evaluate(() => window.__kfbSafeDecks())).slice(0, +(process.argv[2] || 60))
const out = []
for (const d of decks) {
  const r = await page.evaluate(async (d) => { const n = (await window.__kfbCardSafe?.(d)) ?? 1; const x = await window.__kfbCardImage(d, 1); if (!x) return null
    const i = new Image(); await new Promise((ok) => { i.onload = ok; i.src = x.png }); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0)
    const w = c.width, h = c.height, D = g.getImageData(0, 0, w, h).data, paper = (k) => { const a = D[k], b = D[k + 1], e = D[k + 2]; return Math.min(a, b, e) > 225 && Math.max(a, b, e) - Math.min(a, b, e) < 28 }
    const row = (y) => { let n = 0; for (let x = 0; x < w; x++) if (!paper((y * w + x) * 4)) n++; return n <= w * 0.002 }, col = (x) => { let n = 0; for (let y = 0; y < h; y++) if (!paper((y * w + x) * 4)) n++; return n <= h * 0.002 }
    let t = 0; while (t < h / 2 && row(t)) t++; let b = 0; while (b < h / 2 && row(h - 1 - b)) b++; let l = 0; while (l < w / 2 && col(l)) l++; let r = 0; while (r < w / 2 && col(w - 1 - r)) r++
    return { w, h, m: [t, b, l, r] } }, d)
  if (r) out.push([d, r.m.join('/'), Math.min(...r.m)])
}
console.log(out.map((x) => x.join(' ')).join('\n')); await browser.close()
