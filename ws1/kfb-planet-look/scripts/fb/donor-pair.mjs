// Referenz für das Bildpaar „ToolBox | R3F“: Spender P06 r1 lokal, FrizzleBob v5 mit GENAU dem Eintrag aus
// src/data/actors/frizzlebob-v5.recipe.json (face → ws.rigs, clayLids → Akteurprofil), Boden/Raster aus, Hintergrund wie
// die R3F-Prüfszene, Kamera aus ActorTest.VIEWS, 900 × 900, Bindepose. Nur Inspektion: der Spender bleibt unverändert.
// Aufruf: node scripts/fb/donor-pair.mjs <ausgabe-ordner> [view …]
import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const ROOT = path.join(process.env.HOME, 'kfb-ws1/donors/toolbox-p06-r1'), OUT = process.argv[2] || 'test/out/donor'
const VIEWS_ARG = process.argv.slice(3).length ? process.argv.slice(3) : ['face', 'q', 'full']
fs.mkdirSync(OUT, { recursive: true })
const recipe = JSON.parse(fs.readFileSync('src/data/actors/frizzlebob-v5.recipe.json', 'utf8'))
const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k.startsWith('_') ? undefined : v)))
const VIEWS = { face: { pos: [0, 1.62, 2.9], target: [0, 1.5, 0] }, full: { pos: [0, 1.7, 8.2], target: [0, 1.3, 0] }, q: { pos: [2.05, 1.62, 2.05], target: [0, 1.5, 0] } } // = src/ActorTest.jsx
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' }
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end() } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) }).listen(8745)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8745/' + encodeURIComponent('KFB ToolBox Production-06.dc.html'))
await page.waitForFunction(() => window.__kfbTB && window.__kfbTB.runtime, null, { timeout: 120000 })
await page.evaluate(async ([face, clay]) => {
  const T = window.__kfbTB; T.ws.rigs = T.ws.rigs || {}; T.ws.rigs['frizzlebob-earrig-v5'] = face
  T._actorProf('frizzlebob-earrig-v5').clay = clay
  await T.pickRoster(T._rosterEntry('frizzlebob-earrig-v5'))
}, [strip(recipe.face), { ...strip(recipe.clayLids) }])
await page.waitForFunction(() => window.__kfbTB.runtime?.kind === 'earfb' && window.__kfbTB.runtime.face && window.__kfbTB.runtime.hair, null, { timeout: 120000 })
await page.waitForTimeout(3000)
const info = await page.evaluate(() => { const T = window.__kfbTB, f = T.runtime.face, x = f.export(), ef = f.rig.eyeFrame(), v = (a) => a.toArray().map((n) => +n.toFixed(4))
  const a = T.roots.get('actor'); return { parts: x.parts, eye: x.eye, eyeFrame: { left: v(ef.left), right: v(ef.right), radius: +ef.radius.toFixed(4), unit: +ef.unit.toFixed(4) }, actorPos: a && a.position.toArray(), actorScale: a && a.scale.toArray(),
    hemi: [T.hemi.color.getHexString(), T.hemi.groundColor.getHexString(), T.hemi.intensity], sun: [T.sun.color.getHexString(), T.sun.intensity, T.sun.position.toArray()], tone: T.renderer.toneMapping, mixers: T.mixers.length } })
fs.writeFileSync(path.join(OUT, 'donor-info.json'), JSON.stringify(info, null, 1)); console.log(JSON.stringify(info))
// Bindepose wie die R3F-Prüfszene (motion=bind): das Posen-Werkzeug der ToolBox (pose-rig, Arme ab) wird für die Aufnahme abgeschaltet.
await page.evaluate(() => { const T = window.__kfbTB, rt = T.runtime; T.__bind = true; const f0 = T._studioBones.bind(T); T._studioBones = (r, dt) => { if (!T.__bind) f0(r, dt) }
  rt.figure.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.pose() }) })
// Augen einfrieren wie test/actors.mjs (freeze): Leben aus, Blinzeln aus, Blick fest geradeaus → Referenz bildgenau wiederholbar
await page.evaluate(() => { const R = window.__kfbTB.runtime.face.rig; R.setLife({ on: false }); R._blinkK = -1; R._blinkT = 1e9; R.setGazeFollow(true); R.pointTo(0, 0) })
await page.waitForTimeout(1500)
const head = await page.evaluate(() => { const h = window.__kfbTB.runtime.figure.getObjectByName('head'); return h.getWorldPosition(new h.position.constructor()).toArray().map((n) => +n.toFixed(4)) })
console.log('head', JSON.stringify(head))
for (const vn of VIEWS_ARG) {
  const V = VIEWS[vn]
  const png = await page.evaluate(([V]) => { const T = window.__kfbTB, R = T.renderer, c = T.cam, THREE = T.THREE
    T.floor.visible = false; T.grid.visible = false; T.scene.background = new THREE.Color('#d8d2c8'); T.controls.enabled = false
    R.setPixelRatio(1); R.setSize(900, 900, false); c.aspect = 1; c.fov = 38; c.position.fromArray(V.pos); c.lookAt(...V.target); T.controls.target.set(...V.target); c.updateProjectionMatrix()
    R.render(T.scene, c); return R.domElement.toDataURL('image/png') }, [V])
  fs.writeFileSync(path.join(OUT, `donor_${vn}.png`), Buffer.from(png.split(',')[1], 'base64'))
}
console.log('errs', errs.slice(0, 5)); await browser.close(); srv.close()
