// WS1b Kopf-Diagnose: Nahbild FB-Kopf (Ohrschatten), Gegenproben je Einzelbild
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
  window.__head = (view, mod) => { const gl = M.renderer(), sc = M.scene(), sun = sc.getObjectByName('sun'), fb = M.mods.player.object3d
    const box = new T.Box3().setFromObject(fb), c = box.getCenter(new T.Vector3()), top = box.max.y, k = M.k, d = sun.position.clone().sub(sun.target.position).normalize()
    const head = new T.Vector3(c.x, top - 0.75 * k, c.z), side = new T.Vector3(-d.z, 0, d.x).normalize()
    const away = new T.Vector3(-d.x, 0, -d.z).normalize()
    const pos = view === 'schatten' ? head.clone().addScaledVector(away, 1.1 * k).addScaledVector(side, 0.5 * k).add(new T.Vector3(0, 0.7 * k, 0)) : head.clone().addScaledVector(side, 1.2 * k).add(new T.Vector3(0, 0.4 * k, 0))
    const cam = new T.PerspectiveCamera(40, gl.domElement.width / gl.domElement.height, 0.01, 500); cam.position.copy(pos); cam.lookAt(head); cam.updateMatrixWorld()
    const undo = []
    if (mod === 'back') fb.traverse((o) => { if (o.isMesh) [].concat(o.material).forEach((m) => { undo.push([m, m.shadowSide]); m.shadowSide = null; m.needsUpdate = true }) })
    if (mod === 'nb3') { const n = sun.shadow.normalBias; sun.shadow.normalBias = n * 3; undo.push(['nb', n]) }
    if (mod === 'norecv') fb.traverse((o) => { if (o.isMesh) { undo.push([o, o.receiveShadow]); o.receiveShadow = false; [].concat(o.material).forEach((m) => m.needsUpdate = true) } })
    if (mod === 'nocast') fb.traverse((o) => { if (o.isMesh) { undo.push(['c', o, o.castShadow]); o.castShadow = false } })
    gl.render(sc, cam); const url = gl.domElement.toDataURL('image/png')
    for (const u of undo) { if (u[0] === 'nb') sun.shadow.normalBias = u[1]; else if (u[0] === 'c') u[1].castShadow = u[2]; else if (u[0].isMesh) { u[0].receiveShadow = u[1]; [].concat(u[0].material).forEach((m) => m.needsUpdate = true) } else { u[0].shadowSide = u[1]; u[0].needsUpdate = true } }
    return url }
})
for (const view of ['schatten', 'seite']) for (const mod of ['ist', 'back', 'nb3', 'norecv', 'nocast']) {
  const u = await page.evaluate(([v, m]) => window.__head(v, m), [view, mod]); fs.writeFileSync(`${OUT}/H_${view}_${mod}.png`, Buffer.from(u.split(',')[1], 'base64'))
  await page.waitForTimeout(300) }
const mats = await page.evaluate(() => { const M = window.__kfbM1, out = []; M.mods.player.object3d.traverse((o) => { if (o.isMesh) out.push([o.name, o.castShadow, o.receiveShadow, [].concat(o.material).map((m) => m.type + '/' + m.side + '/' + m.shadowSide + (m.userData?.clay ? '/clay' : ''))]) }); return out })
fs.writeFileSync(`${OUT}/fb-meshes.json`, JSON.stringify(mats, null, 1))
await b.close()
