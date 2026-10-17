// M1 · Vertragstest der M1-Module (Briefing M1 Punkt 7, Host-Vertrag R1.2 §2/§6, Muster test/host.mjs; Prüfer M1, Befund 2 + 3):
//   create je Modul genau einmal (auch über die Suspense-Grenze von Rapier hinweg), update je Bild mit ctx (Kamera), dispose genau einmal beim
//   Abbau, danach kein update mehr; Himmel folgt der Kamera; Host besitzt Licht, Nebel und Hintergrund; eine three-Instanz (Laufzeit-Anteil).
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'
import { execSync } from 'child_process'
// eine three-Instanz im Baum (wie test/deps.mjs) und zur Laufzeit dieselbe Revision
const threeInstalls = execSync('npm ls three --all --parseable', { encoding: 'utf8' }).trim().split('\n').filter((l) => /node_modules\/three$/.test(l)).length

const { browser, page, errs } = await openPage('#m1,debug', { viewport: { width: 640, height: 400 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().partner === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
await page.evaluate((n) => new Promise((r) => { const C = window.__kfbM1.clock, t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), 60)
const a = await page.evaluate(() => {
  const M = window.__kfbM1, L = M.logs(), sky = M.mods.sky.object3d, cam = M.status().camera
  const lights = []; let scene = sky; while (scene.parent) scene = scene.parent
  scene.traverse((o) => { if (o.isLight) lights.push(o.type) })
  let skyFogOff = true; sky.traverse((o) => { if (o.material && o.material.fog !== false) skyFogOff = false })
  return { L, skyAtCam: Math.hypot(sky.position.x - cam[0], sky.position.y - cam[1], sky.position.z - cam[2]), lights, fog: !!scene.fog, bg: !!scene.background, skyFogOff,
    threeRev: (window.__THREE__ || null), canvases: document.querySelectorAll('canvas').length }
})
await page.evaluate((n) => new Promise((r) => { const C = window.__kfbM1.clock, t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), 30)
const b = await page.evaluate(() => window.__kfbM1.logs())
// Weltgrenzen (Prüfer M1, Befund 5) und Kamera nie unter das Gelände (Befund 10)
const bounds = await page.evaluate(async () => {
  const M = window.__kfbM1, P = M.player(), w = (ms) => new Promise((r) => { const C = M.clock, t = C.steps + Math.ceil(ms * 0.06); const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), r = () => { const f = M.feet(); return Math.hypot(f[0], f[2]) }
  P.teleport([300 * M.k, 40 * M.k, 0], 0); await w(600); const walkR = r()
  P.setFlying(true); P.teleport([0, 600 * M.k, 300 * M.k], 0); await w(600); const flyR = r(), flyY = M.feet()[1]; P.setFlying(false)
  P.teleport([0, -40 * M.k, 30 * M.k], 0); await w(600); const afterFall = M.feet()
  const cc = P.camera(); cc.rotatePolarTo(1.7, false); await w(400); const polar = cc.polarAngle
  return { walkR, flyR, flyY, afterFall, polar, limits: M.bounds }
})
await page.evaluate(() => window.__kfbM1Root.off()) // nach dem Abbau gibt es keine Physik mehr: ab hier in Bildern warten (M1Loop läuft weiter)
await page.evaluate((n) => new Promise((r) => { const C = window.__kfbM1.clock, t = C.frame + n; const f = () => (C.frame >= t ? r() : requestAnimationFrame(f)); f() }), 48)
const c = await page.evaluate(() => window.__kfbM1.logs())
await page.evaluate((n) => new Promise((r) => { const C = window.__kfbM1.clock, t = C.frame + n; const f = () => (C.frame >= t ? r() : requestAnimationFrame(f)); f() }), 36)
const d = await page.evaluate(() => window.__kfbM1.logs())
const keysGone = await page.evaluate(() => !document.getElementById('m1-keys'))
await browser.close()

const k = ['sky', 'terrain', 'amph', 'loco']
const once = (L, f) => k.every((m) => L[m][f] === 1)
process.exit(report('m1-contract', {
  createdOnce: once(a.L, 'create'),
  billboardOnce: a.L.billboard.create === 1,
  ctxHasCamera: !!a.L.face.lastCtx?.hasCam && !!a.L.eye.lastCtx?.hasCam, // Spieler und Partner bekommen den Kontext (Prüfer M1-5, N8)
  oneThreeInstall: threeInstalls === 1,
  threeRevision: a.L.three === '186' && a.threeRev === '186',
  twoActorsOnce: a.L.face.create === 1 && a.L.eye.create === 1, // Spieler (FrizzleBob, face-mount) + Partner (GothGirl, KayKit-Augen, V-269), je einmal
  updatesRun: k.every((m) => b[m].update > a.L[m].update),
  noDisposeWhileMounted: k.every((m) => a.L[m].dispose === 0),
  skyFollowsCamera: a.skyAtCam < 0.01,
  skyNoFog: a.skyFogOff,
  hostOwnsFogAndBackground: a.fog && a.bg,
  hostLights: a.lights.includes('HemisphereLight') && a.lights.includes('DirectionalLight'),
  oneCanvas: a.canvases === 1,
  walkStaysInside: bounds.walkR <= bounds.limits.walkR + 1 * K,
  flyStaysInside: bounds.flyR <= bounds.limits.flyR + 1 * K && bounds.flyY <= bounds.limits.flyMaxY + 1 * K,
  fallResetsToStart: Math.hypot(bounds.afterFall[0], bounds.afterFall[2] - 30 * K) < 2 * K && bounds.afterFall[1] > -1 * K,
  cameraNotBelow: bounds.polar <= 1.4501,
  disposedOnce: once(c, 'dispose'),
  actorsDisposed: c.face.dispose === 1 && c.eye.dispose === 1,
  noUpdateAfterDispose: k.every((m) => d[m].update === c[m].update),
  createdOnceAfterDispose: once(c, 'create'),
  terrainFreed: !!c.terrain.freed,
  keyListRemoved: keysGone,
  noPageErrors: errs.length === 0,
}, { a, b, c, d, bounds, errs: errs.slice(0, 3) }))
