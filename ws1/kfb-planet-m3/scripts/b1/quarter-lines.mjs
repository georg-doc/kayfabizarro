// Prüfsonde: ganze PDF-Seite einer Karte mit den Viertel-Linien (Seite halbiert, wie quarter()), zum Sehen von Drift. node scripts/b1/quarter-lines.mjs deck:n [...]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage('#stagetest,debug', { viewport: { width: 800, height: 600 } })
await page.waitForFunction(() => !!window.OW_ART, null, { timeout: 120000 })
fs.mkdirSync('test/out/drift', { recursive: true })
for (const a of process.argv.slice(2)) {
  const [d, n] = a.split(':')
  const r = await page.evaluate(async ([d, n]) => { const q = await window.OW_ART.quarter({ packId: d, n: +n }, 1600); if (!q) return null
    const meta = await window.OW_ART.pageFor?.({ packId: d, n: +n }); // Seite neu rendern über die gleiche Registry-Regel
    const pdfPage = q.page; const full = document.createElement('canvas'); const W = q.canvas.width * 2, H = q.canvas.height * 2; full.width = W; full.height = H
    const g = full.getContext('2d'); // vier Viertel derselben Seite zusammensetzen
    const base = (+n - 1) - ((+n - 1) % 4)
    for (let k = 0; k < 4; k++) { const qq = await window.OW_ART.quarter({ packId: d, n: base + k + 1 }, 1600); if (qq && qq.page === pdfPage) g.drawImage(qq.canvas, (k % 2) * q.canvas.width, ((k / 2) | 0) * q.canvas.height) }
    g.strokeStyle = '#ff00ff'; g.lineWidth = 6; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke()
    g.strokeStyle = '#00c8ff'; g.lineWidth = 10; g.strokeRect((q.quad % 2) * W / 2 + 5, ((q.quad / 2) | 0) * H / 2 + 5, W / 2 - 10, H / 2 - 10)
    return { png: full.toDataURL('image/png'), page: pdfPage, quad: q.quad } }, [d, n])
  if (!r) { console.log(a, 'kein Bild'); continue }
  const f = `test/out/drift/${d}_${n}.png`; fs.writeFileSync(f, Buffer.from(r.png.split(',')[1], 'base64')); console.log(a, 'Seite', r.page, 'Viertel', r.quad, f)
}
await browser.close()
