// V-240 Referenz „ToolBox | Spiel“: Spender P08 (Cut 01.10. r1) lokal, Akteur FrizzleBob (Figur v5b), Georgs Export über P08 rigImport
// (genau wie „Import rig JSON…“), Bindepose (pose-rig für die Aufnahme aus), Augen eingefroren wie test/actors.mjs, Boden/Raster aus,
// Kamera aus ActorTest.VIEWS, 900 × 900. Am Spender ändert sich nichts. Aufruf: node scripts/fb/donor-pair-p08.mjs <ordner> [view …]
import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const ROOT = path.join(process.env.HOME, 'kfb-ws1/donors/toolbox-p08'), OUT = process.argv[2] || 'test/out/donor08'
const VIEWS_ARG = process.argv.slice(3).length ? process.argv.slice(3) : ['face', 'q', 'side']
fs.mkdirSync(OUT, { recursive: true })
const EXPORT = fs.readFileSync('src/data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json', 'utf8')
const VIEWS = { face: { pos: [0, 1.62, 2.9], target: [0, 1.5, 0] }, full: { pos: [0, 1.7, 8.2], target: [0, 1.3, 0] }, q: { pos: [2.05, 1.62, 2.05], target: [0, 1.5, 0] }, side: { pos: [2.9, 1.62, 0], target: [0, 1.5, 0] } } // = src/ActorTest.jsx
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' }
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end() } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) }).listen(8747)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8747/' + encodeURIComponent('KFB ToolBox Production-08.dc.html'))
await page.waitForFunction(() => window.__kfbTB && window.__kfbTB.runtime, null, { timeout: 180000 })
await page.evaluate(async () => { const T = window.__kfbTB; await T.pickRoster(T._rosterEntry('frizzlebob-earrig-v5')) })
await page.waitForFunction(() => window.__kfbTB.runtime?.kind === 'earfb' && window.__kfbTB.runtime.face && window.__kfbTB.runtime.hair, null, { timeout: 180000 })
await page.evaluate(async (txt) => { const T = window.__kfbTB; await T.rigImport({ target: { files: [{ text: async () => txt }], value: '' } }) }, EXPORT)
await page.waitForTimeout(1500)
// Bindepose: skeleton.pose() setzt auch die Ohr-Basisknochen zurück → Georgs Ohren-Einstellung danach erneut anwenden (P08 _applyEars)
await page.evaluate(() => { const T = window.__kfbTB, rt = T.runtime; T._studioBones = () => {}; rt.figure.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.pose() }); T._applyEars()
  const R = rt.face.rig; R.setLife({ on: false }); R._blinkK = -1; R._blinkT = 1e9; R.setGazeFollow(true); R.pointTo(0, 0); rt.face.set('brow.life.on', false) }) // Augen + Brauen-Leben aus
await page.waitForTimeout(2000)
const info = await page.evaluate(() => { const T = window.__kfbTB, f = T.runtime.face, x = f.export(), ef = f.rig.eyeFrame(), v = (a) => a.toArray().map((n) => +n.toFixed(4))
  return { rigRT: T.state.rigRT, applied: (f.applied || []).length, rejected: f.rejected || [], parts: x.parts, eye: x.eye, eyeFrame: { left: v(ef.left), right: v(ef.right), radius: +ef.radius.toFixed(4), unit: +ef.unit.toFixed(4) }, lids: T._actorProf().lids, clayOn: T._actorProf().clay?.on, ears: T._actorProf().ears, hair: T.runtime.hair?.params, fig: T.runtime.figure.name,
    earBase: ['L', 'R'].map((k) => { const b0 = T.runtime.ears[k].bones[0], n = b0?.parent?.userData?.kfbChainBase ? b0.parent : b0; return { side: k, p: n.position.toArray().map((v) => +v.toFixed(5)), q: n.quaternion.toArray().map((v) => +v.toFixed(5)) } }) } })
fs.writeFileSync(path.join(OUT, 'donor-info.json'), JSON.stringify(info, null, 1)); console.log(JSON.stringify({ ...info, ears: undefined, hair: undefined }).slice(0, 1500))
for (const vn of VIEWS_ARG) {
  const V = VIEWS[vn]
  const png = await page.evaluate(([V]) => { const T = window.__kfbTB, R = T.renderer, c = T.cam, THREE = T.THREE
    T.floor.visible = false; T.grid.visible = false; T.scene.background = new THREE.Color('#d8d2c8'); T.controls.enabled = false
    if (!window.__kfbShadowsOn) { T.sun.castShadow = false; T.scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { m.needsUpdate = true }) }) } // wie die Prüfszene des Spiels: ohne Schattenwurf
    R.setPixelRatio(1); R.setSize(900, 900, false); c.aspect = 1; c.fov = 38; c.position.fromArray(V.pos); c.lookAt(...V.target); T.controls.target.set(...V.target); c.updateProjectionMatrix()
    R.render(T.scene, c); return R.domElement.toDataURL('image/png') }, [V])
  fs.writeFileSync(path.join(OUT, `donor_${vn}.png`), Buffer.from(png.split(',')[1], 'base64'))
}
console.log('errs', errs.slice(0, 5)); await browser.close(); srv.close()
