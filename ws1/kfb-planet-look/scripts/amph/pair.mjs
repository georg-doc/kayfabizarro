// V-230 Abnahme: Master | Browser-Fassung aus gleichen Kameras (amph.html der Quell-Isolation, unverändert) + Bildzeit wie in der Tabelle
// (Apple M4, ANGLE Metal, 1536 × 864, 120 Bilder Rundflug, readPixels-Sync). Server-Wurzel ~/kfb-ws1 (wie bei der Quell-Isolation).
// Aufruf: node scripts/amph/pair.mjs <browser.glb relativ zu ~/kfb-ws1> <ausgabe-ordner>
import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const ROOT = path.join(process.env.HOME, 'kfb-ws1'), REL = process.argv[2] || 'assets/meshy-browser/kfb-stage-amphitheater-meshy.browser.v1.glb', OUT = process.argv[3] || 'test/out/amph'
fs.mkdirSync(OUT, { recursive: true })
const T = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary' }
const srv = http.createServer((q, s) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/tools/amph.html') u = '/kfb-planet/scripts/amph/amph.html'; const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end() } s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s) }).listen(8743)
const VIEWS = [['orbit_az000', 'view', [0, 35]], ['orbit_az090', 'view', [90, 35]], ['orbit_az180', 'view', [180, 35]], ['orbit_az270', 'view', [270, 35]], ['low_az000', 'view', [0, 6]], ['top', 'view', [0, 89]], ['inside_az000', 'inside', [0]], ['inside_az180', 'inside', [180]], ['detail_az000', 'view', [0, 25, 0.55, -0.1, 30]]]
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const res = {}
for (const [tag, url] of [['master', '/assets/meshy/Meshy_AI_Claymation_Amphitheat_1014024048_image-to-3d-texture.glb'], ['browser', '/' + REL]]) {
  const p = await b.newPage({ viewport: { width: 1536, height: 864 } })
  await p.goto('http://127.0.0.1:8743/tools/amph.html'); await p.waitForFunction(() => window.ready && window.bench)
  const info = await p.evaluate((u) => window.load(u), url)
  for (const [name, fn, args] of VIEWS) { const d = await p.evaluate(([fn, args]) => window[fn](...args), [fn, args]); fs.writeFileSync(`${OUT}/${tag}_${name}.jpg`, Buffer.from(d.split(',')[1], 'base64')) }
  const bench = await p.evaluate(() => window.bench(120))
  res[tag] = { info: { ms: info.ms, tris: info.tris, maps: info.maps, size: info.size }, bench }
  await p.close()
}
// Bildabweichung je Ansicht (mittlere Helligkeit, 0–255)
const p = await b.newPage()
for (const [name] of VIEWS) {
  res.diff = res.diff || {}
  res.diff[name] = await p.evaluate(async ([a, c]) => { const L = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u }); const [x, y] = await Promise.all([L(a), L(c)]); const px = (im) => { const k = document.createElement('canvas'); k.width = im.width; k.height = im.height; const g = k.getContext('2d'); g.drawImage(im, 0, 0); return g.getImageData(0, 0, k.width, k.height).data }
    const P = px(x), Q = px(y); let s = 0; for (let i = 0; i < P.length; i += 4) s += Math.abs((0.299 * P[i] + 0.587 * P[i + 1] + 0.114 * P[i + 2]) - (0.299 * Q[i] + 0.587 * Q[i + 1] + 0.114 * Q[i + 2])); return +(s / (P.length / 4)).toFixed(2) },
  ['data:image/jpeg;base64,' + fs.readFileSync(`${OUT}/master_${name}.jpg`).toString('base64'), 'data:image/jpeg;base64,' + fs.readFileSync(`${OUT}/browser_${name}.jpg`).toString('base64')])
}
fs.writeFileSync(`${OUT}/pair-report.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1)); await b.close(); srv.close()
