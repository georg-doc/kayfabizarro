// WS1b Schatten-Diagnose 2: eigene Kamera hinter FB mit Blick auf den Baum; FB in mehreren Abständen; Gegenproben je Einzelbild
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const OUT = process.argv[2]
const b = await chromium.launch({ channel: 'chromium', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await b.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('file://' + path.resolve('dist/index.html') + '#m1,harvest,debug')
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' && !document.getElementById('kfb-boot'), null, { timeout: 180000 })
await page.waitForTimeout(3000)
// Bildfunktion im Browser: eigene Kamera, optionaler Eingriff in den Schattenkasten nur für dieses Bild
await page.evaluate(() => {
  const M = window.__kfbM1, T = M.three()
  window.__diag = (camPos, look, mod) => { const gl = M.renderer(), sc = M.scene(), sun = sc.getObjectByName('sun'), c = sun.shadow.camera
    const cam = new T.PerspectiveCamera(55, gl.domElement.width / gl.domElement.height, 0.1, 2000); cam.position.fromArray(camPos); cam.lookAt(...look); cam.updateMatrixWorld()
    const keep = { near: c.near, l: c.left, r: c.right, t: c.top, b: c.bottom, far: c.far, sp: sun.position.clone() }
    if (mod?.near != null) c.near = mod.near
    if (mod?.wide) { const r = c.right * mod.wide; Object.assign(c, { left: -r, right: r, top: r, bottom: -r }) }
    c.updateProjectionMatrix(); gl.render(sc, cam); const url = gl.domElement.toDataURL('image/png')
    Object.assign(c, { near: keep.near, left: keep.l, right: keep.r, top: keep.t, bottom: keep.b, far: keep.far }); c.updateProjectionMatrix(); return url }
})
const save = async (name, camPos, look, mod) => { const u = await page.evaluate(([a, b, m]) => window.__diag(a, b, m), [camPos, look, mod || null]); fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(u.split(',')[1], 'base64')) }
const geo = await page.evaluate(() => { const M = window.__kfbM1, sc = M.scene(), sun = sc.getObjectByName('sun'); const d = sun.position.clone().sub(sun.target.position).normalize()
  const s = M.status().pos, trees = M.mods.orchard.trees().map((t) => ({ ...t, dist: Math.hypot(t.pos[0] - s[0], t.pos[2] - s[2]) })).sort((a, b) => a.dist - b.dist); return { sunDir: d.toArray(), tree: trees[0], k: M.k } })
const k = geo.k, T = geo.tree.pos, sd = geo.sunDir, sh = [-sd[0], -sd[2]], L = Math.hypot(...sh), s = [sh[0] / L, sh[1] / L], perp = [-s[1], s[0]]
const res = []
for (const off of [1.5, 3, 4.5, 6]) { // FB entlang der Schattenrichtung des Baums, 1,2 m seitlich
  const p = [T[0] + s[0] * off * k + perp[0] * 1.2 * k, T[1] + 1 * k, T[2] + s[1] * off * k + perp[1] * 1.2 * k]
  await page.evaluate((p) => window.__kfbM1.player().teleport(p, null), p); await page.waitForTimeout(2500)
  const fb = await page.evaluate(() => window.__kfbM1.status().pos)
  const camPos = [fb[0] + s[0] * 3.2 * k - perp[0] * 1.5 * k, fb[1] + 3.0 * k, fb[2] + s[1] * 3.2 * k - perp[1] * 1.5 * k], look = [T[0] + s[0] * 1.5 * k, T[1], T[2] + s[1] * 1.5 * k]
  await save(`F_off${off}_ist`, camPos, look)
  await save(`F_off${off}_near-60`, camPos, look, { near: -60 })
  await save(`F_off${off}_near-60_breit3`, camPos, look, { near: -60, wide: 3 })
  res.push({ off, fb })
}
// Nahbild Kopf FB (helle Flecken?)
const fb = await page.evaluate(() => window.__kfbM1.status().pos)
const head = [fb[0], fb[1] + 2.2 * k, fb[2]]
await save('G_kopf_ist', [head[0] - s[0] * 1.6 * k, head[1] + 0.9 * k, head[2] - s[1] * 1.6 * k], head)
await save('G_kopf_near-60', [head[0] - s[0] * 1.6 * k, head[1] + 0.9 * k, head[2] - s[1] * 1.6 * k], head, { near: -60 })
await save('G_kopf_sonnenseite', [head[0] + sd[0] * 1.8 * k, head[1] + 0.5 * k, head[2] + sd[2] * 1.8 * k], head)
fs.writeFileSync(`${OUT}/res.json`, JSON.stringify({ geo, res }, null, 1))
await b.close()
