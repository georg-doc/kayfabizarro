// V-253 · große Beschriftungsleiste unten in ein vorhandenes 1920×1080-Bild setzen. node scripts/present/caption.mjs <ein.png> <aus.png> "<Titel>" "<Unterzeile>"
import sharp from 'sharp'
const [inp, out, title, sub = ''] = process.argv.slice(2)
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const m = await sharp(inp).metadata(), W = m.width, H = m.height, bar = sub ? 150 : 100
const svg = `<svg width="${W}" height="${bar}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(20,16,12,0.80)"/>
<text x="40" y="60" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="600" fill="#fff">${esc(title)}</text>
${sub ? `<text x="40" y="112" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#fff" fill-opacity="0.9">${esc(sub)}</text>` : ''}</svg>`
await sharp(inp).composite([{ input: Buffer.from(svg), top: H - bar, left: 0 }]).toFile(out)
