// G0 FrizzleBob v5 · Spender ToolBox Production-06 (Session-Cut 30.09. r1, main @ac9dbaed) lokal ausliefern, FB Ear Rig v5
// laden, Gesicht ohne gespeicherten Eintrag (localStorage leer) abbilden und die Abnahme 1–7 (Socket + Hinge) erneut laufen lassen.
// Aufruf: node scripts/fb/donor-p06.mjs <ausgabe-ordner>
import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const ROOT = path.join(process.env.HOME, 'kfb-ws1/donors/toolbox-p06-r1'), OUT = process.argv[2] || '/tmp/fb-donor'
fs.mkdirSync(OUT, { recursive: true })
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' }
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end() } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) }).listen(8745)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const logs = []; page.on('console', (m) => logs.push(m.type() + ' ' + m.text())); page.on('pageerror', (e) => logs.push('pageerror ' + e.message))
await page.goto('http://localhost:8745/' + encodeURIComponent('KFB ToolBox Production-06.dc.html'))
await page.waitForFunction(() => window.__kfbTB && window.__kfbTB.runtime, null, { timeout: 120000 })
await page.evaluate(async () => { const T = window.__kfbTB; await T.pickRoster(T._rosterEntry('frizzlebob-earrig-v5')) })
await page.waitForFunction(() => window.__kfbTB.runtime && window.__kfbTB.runtime.kind === 'earfb' && window.__kfbTB.runtime.face, null, { timeout: 120000 })
await page.waitForTimeout(3000)
const info = await page.evaluate(() => { const T = window.__kfbTB, rt = T.runtime, f = rt.face; const p = f.export ? f.export() : null
  return { rid: T._rid(), saved: !!((T.ws && T.ws.rigs) || {})[T._rid()], parts: p && p.parts, eye: p && p.eye, clayLids: (T._actorProf && T._actorProf().clay) || null, faceLog: (window.__kfbFaceLog || []).slice(-12) } })
fs.writeFileSync(path.join(OUT, 'donor-default.json'), JSON.stringify(info, null, 1))
await page.screenshot({ path: path.join(OUT, 'donor-default.png') })
console.log(JSON.stringify(info).slice(0, 1500))
if (process.env.ACCEPT) {
  await page.evaluate(async () => { const T = window.__kfbTB; await T.setTab('rig'); })
  const acc = await page.evaluate(async () => { const T = window.__kfbTB; await T.eyeSocketAcceptance(); return window.__kfbSockAcc })
  fs.writeFileSync(path.join(OUT, 'donor-acceptance.json'), JSON.stringify(acc, null, 1)); console.log(JSON.stringify(acc.rows))
}
fs.writeFileSync(path.join(OUT, 'donor-console.log'), logs.join('\n'))
await browser.close(); srv.close()
