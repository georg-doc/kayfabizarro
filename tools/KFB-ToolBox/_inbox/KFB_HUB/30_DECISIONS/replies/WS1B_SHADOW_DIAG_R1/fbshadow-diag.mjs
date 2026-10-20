// WS1b: FBs Bodenschatten von oben (Kopfbereich), Gegenproben je Einzelbild; dazu AO-Fleck-Lage
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const OUT = process.argv[2]
const b = await chromium.launch({ channel: 'chromium', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await b.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('file://' + path.resolve('dist/index.html') + '#m1,harvest,debug')
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && !document.getElementById('kfb-boot'), null, { timeout: 180000 })
await page.waitForTimeout(4000)
await page.evaluate(() => {
  const M = window.__kfbM1, T = M.three()
  window.__top = (mod, h = 3.2) => { const gl = M.renderer(), sc = M.scene(), sun = sc.getObjectByName('sun'), c = sun.shadow.camera, fb = M.mods.player.object3d, k = M.k
    const p = new T.Vector3(...M.status().pos), d = sun.position.clone().sub(sun.target.position).normalize(), mid = p.clone().addScaledVector(new T.Vector3(-d.x, 0, -d.z).normalize(), 1.6 * k)
    const cam = new T.PerspectiveCamera(50, gl.domElement.width / gl.domElement.height, 0.05, 500); cam.position.set(mid.x + 0.01, mid.y + h * k, mid.z); cam.lookAt(mid); cam.updateMatrixWorld()
    const keep = { near: c.near, r: c.right, nb: sun.shadow.normalBias }, undo = []
    if (mod === 'near-60') c.near = -60
    if (mod === 'breit3') { const r = c.right * 3; Object.assign(c, { left: -r, right: r, top: r, bottom: -r }) }
    if (mod === 'nb0') sun.shadow.normalBias = 0
    if (mod === 'back') fb.traverse((o) => { if (o.isMesh) [].concat(o.material).forEach((m) => { undo.push([m, m.shadowSide]); m.shadowSide = null; m.needsUpdate = true }) })
    c.updateProjectionMatrix(); gl.render(sc, cam); const url = gl.domElement.toDataURL('image/png')
    c.near = keep.near; Object.assign(c, { left: -keep.r, right: keep.r, top: keep.r, bottom: -keep.r }); c.updateProjectionMatrix(); sun.shadow.normalBias = keep.nb; for (const [m, s] of undo) { m.shadowSide = s; m.needsUpdate = true }
    return url }
})
for (const mod of ['ist', 'near-60', 'breit3', 'nb0', 'back']) { const u = await page.evaluate((m) => window.__top(m), mod); fs.writeFileSync(`${OUT}/T_${mod}.png`, Buffer.from(u.split(',')[1], 'base64')) }
// AO: Lage des Flecks gegen die Füße und gegen den Boden
const ao = await page.evaluate(() => { const M = window.__kfbM1, sc = M.scene(), p = M.status().pos, out = []
  sc.traverse((o) => { if (o.name === 'contact-ao' && o.isMesh) out.push({ pos: o.position.toArray(), vis: o.visible }) })
  const g = M.terrainH ? M.terrainH(p[0], p[2]) : null
  return { feet: p, terrainH: g, ao: out } })
fs.writeFileSync(`${OUT}/ao.json`, JSON.stringify(ao, null, 1))
// AO-Gegenprobe: Fleck auf Fußhöhe legen, Bild von schräg hinten
const u = await page.evaluate(() => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), p = new T.Vector3(...M.status().pos), k = M.k
  const cam = new T.PerspectiveCamera(50, gl.domElement.width / gl.domElement.height, 0.05, 500); cam.position.set(p.x + 2.2 * k, p.y + 1.6 * k, p.z + 2.2 * k); cam.lookAt(p.x, p.y + 0.4 * k, p.z); cam.updateMatrixWorld()
  let blob = null; sc.traverse((o) => { if (o.name === 'contact-ao' && o.isMesh && Math.hypot(o.position.x - p.x, o.position.z - p.z) < 0.3) blob = o })
  gl.render(sc, cam); const a = gl.domElement.toDataURL('image/png'); const y0 = blob.position.y; blob.position.y = p.y + 0.01; blob.updateMatrixWorld(); gl.render(sc, cam); const bimg = gl.domElement.toDataURL('image/png'); blob.position.y = y0; return [a, bimg] })
fs.writeFileSync(`${OUT}/AO_ist.png`, Buffer.from(u[0].split(',')[1], 'base64')); fs.writeFileSync(`${OUT}/AO_fusshoehe.png`, Buffer.from(u[1].split(',')[1], 'base64'))
await b.close()
