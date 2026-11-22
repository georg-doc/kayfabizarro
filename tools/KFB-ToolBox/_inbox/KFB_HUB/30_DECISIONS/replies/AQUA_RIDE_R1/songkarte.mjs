import fs from 'node:fs'
import { chromium } from 'playwright'
const [, , json, out] = process.argv
const d = JSON.parse(fs.readFileSync(json, 'utf8'))
const n = d.energie[0].length
const sum = Array.from({ length: n }, (_, i) => d.energie.reduce((s, r) => s + r[i], 0))
const max = Math.max(...sum)
const AB = [
  [1, 8, 'Einsaugen', '#6b4e7d'], [9, 22, 'Kelp-Röhre', '#3e6a83'], [23, 28, 'Zeitlupe', '#e9c14a'],
  [29, 39, 'Looping', '#3e6a83'], [40, 58, 'Ringe', '#7a8d4a'], [59, 70, 'Glaskugel', '#a64670'],
  [71, 72, 'Zeitlupe', '#e9c14a'], [73, 90, 'Jagd', '#d97c3a'], [91, 94, 'Höhepunkt', '#c81e1e'],
  [95, 104, 'Auslauf', '#d97c3a'], [105, 106, 'HyperNorm', '#111'],
]
const W = 1640, H = 520, x0 = 50, bw = (W - 100) / n, base = 380
let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#0e1a22"/>`
for (const [a, b, name, col] of AB) {
  const x = x0 + (a - 1) * bw, w = (b - a + 1) * bw
  s += `<rect x="${x}" y="42" width="${w}" height="${base - 42}" fill="${col}" opacity="0.28"/>`
  s += `<rect x="${x}" y="${base + 8}" width="${w - 2}" height="52" rx="6" fill="${col}"/>`
  if (w > 110) s += `<text x="${x + w / 2}" y="${base + 41}" fill="#fff" font-family="Helvetica" font-weight="700" font-size="22" text-anchor="middle">${name}</text>`
  else s += `<text x="${x + w / 2}" y="30" fill="${col === '#111' ? '#f4efe2' : col}" font-family="Helvetica" font-weight="700" font-size="17" text-anchor="middle">${name}</text>`
}
for (let i = 0; i < n; i++) {
  const h = (sum[i] / max) * (base - 70)
  s += `<rect x="${x0 + i * bw + 1}" y="${base - h}" width="${bw - 2}" height="${h}" fill="#f4efe2" opacity="0.9"/>`
}
s += `<text x="${x0}" y="${H - 50}" fill="#f4efe2" font-family="Helvetica" font-size="22">Cartoon Chase · Lautstärke je Takt (weiß) · Abschnitte des Rides (Farbe)</text>`
s += `<text x="${x0}" y="${H - 18}" fill="#9fb3bf" font-family="Helvetica" font-size="18">Exit-Knopf jederzeit · am Ende geht es in die HyperNorm-Röhre</text></svg>`
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: W, height: H } })
await p.setContent(`<body style="margin:0">${s}</body>`)
await p.screenshot({ path: out, type: 'jpeg', quality: 90 })
await b.close()
