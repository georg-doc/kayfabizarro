// MVP-Leistung · Aufschlüsselung (Lead): wer zeichnet wie viel? Je Szene die sichtbaren Meshes nach Wurzel-Gruppe (Kind der Szene, Name/Typ),
// Dreiecke je Bild (Index/3 × Instanzen), Zeichenaufrufe, Schattenwerfer; dazu renderer.info getrennt nach Schattenpass und Hauptpass.
// Keine fps-Messung → läuft ohne Test-Slot (ein Fenster, kurz). SCENES=walk,npc,car
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const SCENES = { walk: '#m1,debug,harvest,look=terrain3,world=probe', npc: '#m1,debug,harvest,look=terrain3,world=probe,npc,patrol,band,disco', car: '#m1,debug,harvest,look=terrain3,world=probe,car' }
const only = process.env.SCENES ? process.env.SCENES.split(',') : Object.keys(SCENES), out = {}
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const sc of only) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await p.goto('file://' + path.resolve('dist/index.html') + SCENES[sc] + ',q=fast')
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }).catch(() => {})
  if (sc === 'car') await p.evaluate(() => window.__kfbM1.input?.({ forward: true }))
  await p.waitForTimeout(5000)
  out[sc] = await p.evaluate(() => {
    const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three()
    const cam = M.player?.()?.camera?.()?.camera || (() => { let c = null; scene.traverse((o) => { if (!c && o.isPerspectiveCamera) c = o }); return c })()
    const fr = new T.Frustum(); if (cam) { cam.updateMatrixWorld(); fr.setFromProjectionMatrix(new T.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)) }
    const groups = {}, root = (o) => { let r = o; while (r.parent && r.parent !== scene) r = r.parent; return (r.name || r.type) + (r.userData?.kfbModule ? ':' + r.userData.kfbModule : '') }
    const vis = (o) => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true }
    let lights = 0, shadowLights = []
    scene.traverse((o) => {
      if (o.isLight) { lights++; if (o.castShadow) shadowLights.push({ type: o.type, size: o.shadow?.mapSize?.x, name: o.name }) }
      if (!(o.isMesh || o.isPoints || o.isLine) || !vis(o)) return
      const g = o.geometry; if (!g) return
      const n = (g.index ? g.index.count : g.attributes.position?.count || 0) / 3, inst = o.isInstancedMesh ? o.count : (g.isInstancedBufferGeometry ? g.instanceCount : 1)
      if (!g.boundingSphere) g.computeBoundingSphere()
      const inFr = o.frustumCulled === false || !cam ? true : (() => { const s = g.boundingSphere.clone().applyMatrix4(o.matrixWorld); return fr.intersectsSphere(s) })()
      const k = root(o), e = groups[k] || (groups[k] = { meshes: 0, tris: 0, trisInView: 0, calls: 0, casters: 0, casterTris: 0, noCull: 0 })
      const mats = Array.isArray(o.material) ? o.material.length : 1, t = n * inst
      e.meshes++; e.tris += t; if (inFr) { e.trisInView += t; e.calls += mats }
      if (o.castShadow) { e.casters++; e.casterTris += t }
      if (o.frustumCulled === false) e.noCull++
    })
    const ar = gl.info.autoReset; gl.info.autoReset = false; gl.info.reset()
    const sm = gl.shadowMap.enabled; gl.shadowMap.enabled = false; gl.shadowMap.needsUpdate = true
    gl.render(scene, cam); const main = { calls: gl.info.render.calls, tris: gl.info.render.triangles }
    gl.shadowMap.enabled = sm; gl.shadowMap.needsUpdate = true; gl.info.reset(); gl.render(scene, cam)
    const both = { calls: gl.info.render.calls, tris: gl.info.render.triangles }; gl.info.autoReset = ar
    const list = Object.entries(groups).map(([k, v]) => ({ group: k, ...v, tris: Math.round(v.tris), trisInView: Math.round(v.trisInView), casterTris: Math.round(v.casterTris) })).sort((a, b) => b.trisInView - a.trisInView)
    return { main, withShadow: both, shadowPass: { calls: both.calls - main.calls, tris: both.tris - main.tris }, lights, shadowLights, shadowType: gl.shadowMap.type, groups: list.slice(0, 25) }
  })
  console.log(sc, JSON.stringify({ main: out[sc].main, shadowPass: out[sc].shadowPass, shadowLights: out[sc].shadowLights }))
  for (const g of out[sc].groups.slice(0, 14)) console.log('  ', g.group.padEnd(36), 'sicht', String(g.trisInView).padStart(8), 'ges', String(g.tris).padStart(8), 'calls', String(g.calls).padStart(4), 'wirft', String(g.casterTris).padStart(8), 'noCull', g.noCull)
  await p.close()
}
await b.close()
fs.mkdirSync('test/out/perf', { recursive: true }); fs.writeFileSync('test/out/perf/perf-breakdown.json', JSON.stringify(out, null, 1))
