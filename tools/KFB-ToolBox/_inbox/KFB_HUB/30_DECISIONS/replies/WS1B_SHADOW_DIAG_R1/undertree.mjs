// WS1b: FB-Kopf im Kronenschatten (Nah-Ebene −60, damit die Krone ganz wirft); Gegenprobe: Haarbüschel/Brauen empfangen Schatten
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const OUT = process.argv[2]
const b = await chromium.launch({ channel: 'chromium', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await b.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('file://' + path.resolve('dist/index.html') + '#m1,harvest,debug')
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' && !document.getElementById('kfb-boot'), null, { timeout: 180000 })
await page.waitForTimeout(3000)
await page.evaluate(() => { const M = window.__kfbM1, sc = M.scene(), sun = sc.getObjectByName('sun'), d = sun.position.clone().sub(sun.target.position).normalize()
  const s = M.status().pos, t = M.mods.orchard.trees().map((t) => ({ ...t, dist: Math.hypot(t.pos[0] - s[0], t.pos[2] - s[2]) })).sort((a, b) => a.dist - b.dist)[0], k = M.k
  const sh = Math.hypot(d.x, d.z); M.player().teleport([t.pos[0] - d.x / sh * 3.2 * k, t.pos[1] + 1 * k, t.pos[2] - d.z / sh * 3.2 * k], null); window.__away = [-d.x / sh, -d.z / sh] })
await page.waitForTimeout(3000)
const shots = await page.evaluate(() => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), sun = sc.getObjectByName('sun'), c = sun.shadow.camera, fb = M.mods.player.object3d, k = M.k
  const box = new T.Box3().setFromObject(fb), head = new T.Vector3(box.getCenter(new T.Vector3()).x, box.max.y - 0.8 * k, box.getCenter(new T.Vector3()).z)
  const cam = new T.PerspectiveCamera(45, gl.domElement.width / gl.domElement.height, 0.01, 500); const a = window.__away; cam.position.set(head.x + a[0] * 1.7 * k, head.y + 0.8 * k, head.z + a[1] * 1.7 * k); cam.lookAt(head); cam.updateMatrixWorld()
  const r = (fixRecv) => { const undo = []; if (fixRecv) fb.traverse((o) => { if (o.isMesh && !o.receiveShadow) { undo.push(o); o.receiveShadow = true; [].concat(o.material).forEach((m) => m.needsUpdate = true) } })
    c.near = -60; c.updateProjectionMatrix(); gl.render(sc, cam); const u = gl.domElement.toDataURL('image/png'); c.near = 0.05; c.updateProjectionMatrix()
    for (const o of undo) { o.receiveShadow = false; [].concat(o.material).forEach((m) => m.needsUpdate = true) } return u }
  return [r(false), r(true)] })
fs.writeFileSync(`${OUT}/K_ist.png`, Buffer.from(shots[0].split(',')[1], 'base64')); fs.writeFileSync(`${OUT}/K_alle_empfangen.png`, Buffer.from(shots[1].split(',')[1], 'base64'))
await b.close()
