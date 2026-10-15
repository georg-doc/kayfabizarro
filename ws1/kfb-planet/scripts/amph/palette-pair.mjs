// V-270 · Bildpaar alt | neu für Georg (V-253: Paare erlaubt): zwei Bühnenbilder derselben Karte aus derselben Kamera nebeneinander,
// je 960 × 540, mit großer Beschriftung je Hälfte und Leiste unten. Ergebnis 1920 × 760.
// node scripts/amph/palette-pair.mjs <alt.png> <neu.png> <aus.png> "<Titel>" "<Unterzeile>"
import sharp from 'sharp'
const [alt, neu, out, title, sub = ''] = process.argv.slice(2)
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const half = (f) => sharp(f).resize(960, 540).png().toBuffer()
const label = (t) => Buffer.from(`<svg width="960" height="70" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(20,16,12,0.80)"/><text x="24" y="50" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#fff">${esc(t)}</text></svg>`)
const bar = Buffer.from(`<svg width="1920" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(20,16,12,0.92)"/>
<text x="40" y="60" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="600" fill="#fff">${esc(title)}</text>
<text x="40" y="112" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#fff" fill-opacity="0.9">${esc(sub)}</text></svg>`)
await sharp({ create: { width: 1920, height: 760, channels: 3, background: '#14100c' } }).composite([
  { input: await half(alt), top: 70, left: 0 }, { input: await half(neu), top: 70, left: 960 },
  { input: label('ALT · V-245 Stimmungsfarben'), top: 0, left: 0 }, { input: label('NEU · V-270 Insel-Palette'), top: 0, left: 960 },
  { input: bar, top: 610, left: 0 },
]).png().toFile(out)
console.log(out)
