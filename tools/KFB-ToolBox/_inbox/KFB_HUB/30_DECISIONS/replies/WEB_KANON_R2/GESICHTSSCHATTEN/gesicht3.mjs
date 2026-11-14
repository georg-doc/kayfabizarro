// FB Web-Kanon R1 · Export aus dem laufenden Spiel (lokaler Build, Stand aus build.json; r1d: game/integration-r2 @9b18f5acd + assets/private @b76ac864, Release-Schalter, debug):
// r1d: Mund in Ruhe (Figurendatei), Mimik-Posen (faceMountActor MIMIK) im Spiel gemessen, Lidhaut zusätzlich oben_weit/unten_weit, Spielbilder je Mundform und Mimik.
// FB wie im Spiel zur Laufzeit zusammengesetzt (Ohr-Graft A11, Schwanz, Shirt, EyeRig v6 + E2-Lidhaut, Brauen, Nase, Haar, Mund Satz A) →
// Bindepose, Gesicht neutral (FB-Grundstellung) → Lidhaut als Morphs (oben/unten halb/zu) → Knete aus clayBake (Gradienten-Texturen T0–T2 im Atlas clayUv)
// zu Farb- und Tangenten-Normalatlas (voller Ebenen-Anteil wie in der Nahansicht; Formel = kfb-clay FRAG_NORMAL/FRAG_COLOR) → Standard-PBR → GLB.
// Licht-Studie (WEB_KANON_R2 Teil 3): node licht.mjs <buildDir> <outDir> <fb|char:id> → Spielbilder (vorn/seite/gesicht) je Variante der Figuren-Uniforms
import fs from 'fs'; import path from 'path'; import http from 'http'; import { createRequire } from 'module'
const require = createRequire('/Users/georg/kfb_work/game-r2/package.json'); const { chromium } = require('playwright')
const ROOT = process.argv[2], OUT = process.argv[3], VAR = process.argv[4] || 'fb'; fs.mkdirSync(OUT, { recursive: true })
const WEB = '/Users/georg/.kfb_tmp/webkanon/web'
const B0 = JSON.parse(fs.readFileSync(path.join(ROOT, 'build.json'), 'utf8'))
const HASH = '#' + B0.schalter.replace(/^#/, '') + ',debug,mute,drivepanel=0,tod=' + (process.env.TOD || '11') + (process.env.WK_HASH_ZUSATZ || '') + (VAR === 'twin' ? ',jetvar=twin' : '') + (/^char:/.test(VAR) ? ',char=' + VAR.slice(5) : '')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ktx2': 'image/ktx2', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u.startsWith('/__wk/') ? path.join(WEB, u.slice(6)) : path.join(ROOT, u.replace(/\/$/, '/index.html'))
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(d) }) })
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok)); const BASE = `http://127.0.0.1:${srv.address().port}/`
const Bz = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--mute-audio'] })
const ctx = await Bz.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage(); const err = []; p.on('pageerror', (e) => err.push(e.message))
p.on('console', (m) => { if (m.type() === 'error' || /\[wk\]/.test(m.text())) err.push('console: ' + m.text().slice(0, 300)) })
await p.addInitScript(() => { const T = new EventTarget(); window.__THREE_DEVTOOLS__ = T; window.__wkR = null; T.addEventListener('observe', (e) => { if (e.detail?.isWebGLRenderer && !window.__wkR) window.__wkR = e.detail }) })
await p.goto(BASE + HASH, { timeout: 300000 }); await p.waitForFunction(() => window.__kfbM1?.clock?.steps > 200 && window.__kfbM1.mods.player.status?.()?.actor?.status === 'OK', null, { timeout: 300000 })
await p.evaluate(() => setInterval(() => { for (const s of ['[data-ui=card-hero-ok]', '[data-ui=intro-skip]']) document.querySelector(s)?.click() }, 400))
// warten: Knete gebacken (alle FB-Knete-Materialien mit uClayBakeOn > 0)
await p.waitForFunction(() => { const R = window.__wkR, o = window.__kfbM1.mods.player.object3d; if (!R) return false; let n = 0, ok = 0
  o.traverse((x) => { if (!x.isMesh) return; const m = [].concat(x.material)[0]; if (!m?.userData?.kfbClayBake) return; n++; const u = R.properties.get(m).uniforms; if (u?.uClayBakeOn?.value?.x > 0.5) ok++ }); if (n === 0) { window.__wkN0 = (window.__wkN0 || 0) + 1; return window.__wkN0 > 15 } return ok === n }, null, { timeout: 240000, polling: 1000 })
await p.waitForTimeout(3000)

await p.waitForTimeout(3000)
await p.evaluate((e) => { window.__wkElev = e }, +(process.env.ELEV || 0))
if (process.env.SKIP0) await p.evaluate(() => { const FS = window.__kfbFigShadow; FS.__skip0 = true; const d = Object.getOwnPropertyDescriptor(FS.uFigSkip, 'value'); let v = 0; Object.defineProperty(FS.uFigSkip, 'value', { get: () => 0, set: (x) => { v = x }, configurable: true }) })   // Prüfung: Eigenschatten-Ausnahme der Figuren (q300) aus
const res = await p.evaluate(async (SEITE) => {
  const { THREE: T } = await import('/__wk/three_exp.js')
  const M = window.__kfbM1, pm = M.mods.player, R = window.__wkR, LOG = []; const log = (...a) => LOG.push(a.map((x) => typeof x === 'string' ? x : JSON.stringify(x)).join(' '))
  try { pm.mimikLeer?.(null); pm.mimikLeerBasis?.(null); pm.mimik?.(null) } catch { }
  await new Promise((ok) => setTimeout(ok, 1500))
  const f = pm.actor?.()?.debugFace?.(); if (f?.browHold) { f.browHold(null); f.browReact?.('both') }   // Brauen ohne Zufallsreaktion (Hülle 0)
  window.requestAnimationFrame = () => 0; await new Promise((ok) => setTimeout(ok, 300))
  const o = pm.object3d, E = pm.debugRig(); E._follow = false; E._pt = null; for (const e of E.eyes) { e._tx = 0; e._ty = 0; e._px = 0; e._py = 0; e._pvx = 0; e._pvy = 0 } for (let k = 0; k < 120; k++) { E._blinkK = -1; E._blinkT = 1e9; E.update(1 / 60) }
  if (f?.browLife) f.browLife(0)
  let sc = o; while (sc.parent) sc = sc.parent
  const sun = M.mods.light?.lights?.sun
  { const EL = +(window.__wkElev || 0); if (EL) { const v = sun.position.clone().sub(sun.target.position), L = v.length(), az0 = Math.atan2(v.x, v.z), e = EL * Math.PI / 180; sun.position.copy(sun.target.position).add(new T.Vector3(Math.sin(az0) * Math.cos(e), Math.sin(e), Math.cos(az0) * Math.cos(e)).multiplyScalar(L)); sun.updateMatrixWorld(true) } }
  const sd = sun.position.clone().sub(sun.target.position).normalize(), elev = Math.asin(sd.y) * 180 / Math.PI
  // FB so drehen, dass die Sonne für „seitlich“ von FBs rechter Seite kommt, für „steil“ von vorn oben (Blickrichtung zur Sonne)
  const az = Math.atan2(sd.x, sd.z); o.rotation.y = SEITE ? az - Math.PI / 2 : az; o.updateMatrixWorld(true)
  const b = new T.Box3().setFromObject(o, true), c = b.getCenter(new T.Vector3()), h = b.max.y - b.min.y, fw = new T.Vector3(0, 0, 1).applyQuaternion(o.getWorldQuaternion(new T.Quaternion())); fw.y = 0; fw.normalize()
  const flags = {}; o.traverse((m) => { if (m.isMesh && /Nose|Brow|Mouth|nose|brow/.test(m.name)) flags[m.name] = m.castShadow })
  { const rec = {}; o.traverse((m) => { if (m.isMesh && /Head|head|Body|Ear/.test(m.name)) rec[m.name] = { empfaengt: m.receiveShadow, wirft: m.castShadow } }); const sc2 = sun.shadow.camera; log('kopf-empfang', rec, 'schattenkarte', { px: sun.shadow.mapSize.toArray(), breite_m: +(sc2.right - sc2.left).toFixed(1), hoehe_m: +(sc2.top - sc2.bottom).toFixed(1), texel_cm: +((sc2.right - sc2.left) / sun.shadow.mapSize.x * 100).toFixed(2), radius: sun.shadow.radius, bias: sun.shadow.bias, normalBias: sun.shadow.normalBias }) }
  log('sonne', { elevation_grad: +elev.toFixed(1), fbGier: +o.rotation.y.toFixed(2), uFigSkip: window.__kfbFigShadow?.uFigSkip?.value, uFigShadowK: window.__kfbFigShadow?.uFigShadowK?.value, wirft: flags })
  const out = {}, ty = b.min.y + h * 0.66
  for (const [n, deg] of [['vorn', 0], ['dreiviertel', 35]]) { const A = deg * Math.PI / 180, dir = fw.clone().applyAxisAngle(new T.Vector3(0, 1, 0), A), cam = new T.PerspectiveCamera(30, 900 / 1100, 0.05, 2000); cam.position.copy(c).addScaledVector(dir, h * 1.3); cam.position.y = ty; cam.lookAt(c.x, ty, c.z)
    // A/B im selben Bild: genau die Wirkung von gesichtsschatten=r1 (faceMountActor Z. 175: castShadow an Brauen- und Nasen-Netzen des Face-Mounts, Mund nicht)
    const teile = []; const an = (x) => x?.traverse?.((m) => { if (m.isMesh) teile.push(m) }); an(f?.brow?.mesh); an(f?.nose?.mesh); for (const k of ['brows', 'nose']) (f?.orig?.[k]?.items || []).forEach((it) => an(it.mesh))
    const vorher = teile.map((m) => m.castShadow)
    for (const [tag, wirf] of [['heute', null], ['mit', true]]) { teile.forEach((m, i) => { m.castShadow = wirf === null ? vorher[i] : true })
      const LS = []; sc.traverse((x) => { if (x.isLight && x.castShadow && x.shadow) { x.shadow.needsUpdate = true; LS.push(x) } }); R.setRenderTarget(null); R.setPixelRatio(1); R.setSize(900, 1100, false); R.shadowMap.autoUpdate = true; R.shadowMap.needsUpdate = true; R.render(sc, cam); out[tag + '_' + n] = R.domElement.toDataURL('image/png'); if (tag === 'heute' && n === 'vorn') log('schattenlichter', LS.map((x) => ({ typ: x.type, name: x.name, auto: x.shadow.autoUpdate, karte: x.shadow.mapSize?.x, kamera_breite: x.shadow.camera?.right - x.shadow.camera?.left, istSonne: x === sun })), 'shadowMap', { auto0: R.shadowMap.autoUpdate, typ: R.shadowMap.type }) }
    teile.forEach((m, i) => { m.castShadow = vorher[i] }); log('teile', teile.map((m) => m.name)) }
  return { LOG, out }
}, !!process.env.SEITE)
const tag = (/figschatten/.test(process.env.WK_HASH_ZUSATZ || '') ? 'fs_' : '') + '_' + (process.env.SEITE ? 'flach' : 'steil') + (process.env.SKIP0 ? '_skip0' : '')
const LT = process.env.SEITE ? 'flach' : 'steil'; for (const [k, v] of Object.entries(res.out)) { const [ab, an] = k.split('_'); fs.writeFileSync(path.join(OUT, `${tag}${ab}_${LT}_${an}.png`), Buffer.from(v.split(',')[1], 'base64')) }
fs.writeFileSync(path.join(OUT, tag + (process.env.SEITE ? 'flach' : 'steil') + '.json'), JSON.stringify({ log: res.LOG, fehler: err.slice(0, 5) }, null, 1)); console.log(tag, res.LOG.join(' | ').slice(0, 600)); await Bz.close(); srv.close(); process.exit(0)
