// Schatten-Hebel (Georg 24.10.) · Racer-Schatten aus vereinfachter Form (rshadow=lite) gegen volles Modell im SELBEN Moment, Tag und Gold
// (lange Schatten), Spielkamera und schräg von oben; dazu Dreiecke im Schattenbild vorher/nachher. Bilder: research/audits/abnahme/schatten-hebel/
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/schatten-hebel'); fs.mkdirSync(OUT, { recursive: true })
const W = 1600, H = 900, res = {}
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const tod of ['day', 'gold']) {
  const p = await b.newPage({ viewport: { width: W, height: H } }), errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,car,tod=' + tod)
  await p.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK' && window.__kfbM1?.scene?.().getObjectByName('shadow-proxy'), null, { timeout: 300000 })
  await p.waitForTimeout(4000)
  const r = await p.evaluate(async ({ W, H }) => {
    const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), px = sc.getObjectByName('shadow-proxy'), model = px.parent
    const frame = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); for (let i = 0; i < 4; i++) await frame()
    const parts = []; model.traverse((o) => { if (o.isMesh && o !== px) parts.push(o) })
    const setMode = (lite) => { px.visible = lite; for (const o of parts) o.castShadow = !lite; gl.shadowMap.needsUpdate = true }
    const c = new T.Vector3(); model.getWorldPosition(c)
    const sun = sc.getObjectByName('sun'), sd = new T.Vector3().copy(sun.position).sub(sun.target.position).normalize()
    const cams = {
      spiel: M2cam(),
      oben: (() => { const k = new T.PerspectiveCamera(30, W / H, 0.1, 500), h = new T.Vector3(sd.x, 0, sd.z).normalize(), el = Math.max(0.12, Math.asin(Math.min(1, sd.y))), off = Math.min(8, 1.6 / Math.tan(el)), mid = c.clone().addScaledVector(h, -off * 0.5); k.position.set(mid.x + 1.5, mid.y + 12, mid.z + 1.5); k.lookAt(mid); return k })() }
    function M2cam() { const k = new T.PerspectiveCamera(42, W / H, 0.1, 500), d = new T.Vector3(); model.getWorldDirection(d); d.y = 0; d.normalize(); k.position.set(c.x - d.x * 7, c.y + 3, c.z - d.z * 7); k.lookAt(c.x + d.x * 3, c.y, c.z + d.z * 3); return k }
    const out = {}
    for (const [k, cam] of Object.entries(cams)) { cam.updateMatrixWorld()
      for (const lite of [false, true]) { setMode(lite); gl.info.autoReset = false; gl.info.reset(); gl.setRenderTarget(null); gl.render(sc, cam); out[`tris-${k}-${lite ? 'lite' : 'voll'}`] = gl.info.render.triangles; gl.info.autoReset = true; out[`${k}-${lite ? 'lite' : 'voll'}`] = gl.domElement.toDataURL('image/jpeg', 0.9) } }
    setMode(true)
    return { out, stats: px.userData.stats, cull: window.__kfbShadowCull?.status?.() } }, { W, H })
  for (const [k, v] of Object.entries(r.out)) { if (k.startsWith('tris-')) continue; fs.writeFileSync(`${OUT}/${k}-${tod}.jpg`, Buffer.from(v.split(',')[1], 'base64')) }
  res[tod] = { proxy: r.stats, tris: Object.fromEntries(Object.entries(r.out).filter(([k]) => k.startsWith('tris-'))), cull: r.cull, errs }
  await p.close()
}
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res)); await b.close()
