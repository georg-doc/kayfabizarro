// Kritiker R3 Bug „schwebender dunkler Stein“ (V-654/V-675 Runde 3, Lead-Paket look-r2 Punkt 5) · nichts liegt schwebend auf dem Gelände:
//   (a) ruhende Fluff-Kügelchen (Fallobst): Unterkante 2–10 cm im Boden (setzen sich ein, nicht tangential), Erdkeil je Kügelchen,
//   (b) Kontakt-Steinchen der Erdung: Unterkante ≤ 0 (im Boden), Oberkante > 0,5 cm (sichtbar),
//   (c) Rundumsuche: kein kleines Objekt (< 2,5 m hoch) mit Unterkante 3 cm … 3 m über der Fläche, außer bewusst schwebenden Fundsachen (found=float),
//       Früchten am Baum (hanging) und Figuren.
// Hash wie der MVP-Kritiker: #m1,debug,clean,harvest,look=terrain3,world=probe
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,clean,harvest,look=terrain3,world=probe', { viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats?.().status === 'OK' && window.__kfbM1.mods.ground?.info?.().pebbles > 0, null, { timeout: 300000 })
await new Promise((r) => setTimeout(r, 4000))
const r = await page.evaluate(() => {
  const M = window.__kfbM1, T = M.three(), S = M.mods.terrain, sc = M.scene(), m = new T.Matrix4(), p = new T.Vector3(), s = new T.Vector3(), q = new T.Quaternion()
  // (a) Fallobst
  const fl = M.mods.orchard.object3d.getObjectByName('orchard-fluff'), balls = M.mods.orchard.balls(), rest = []
  balls.forEach((b, i) => { if (b.state !== 'resting') return; fl.getMatrixAt(i, m); m.decompose(p, q, s); p.applyMatrix4(fl.matrixWorld); rest.push(p.y - s.y - S.surfaceAt(p.x, p.z)) })
  // (b) Kontakt-Steinchen
  const pb = M.mods.ground.object3d.getObjectByName('contact-pebbles'), pebs = []; pb.geometry.computeBoundingBox()
  for (let i = 0; i < pb.count; i++) { pb.getMatrixAt(i, m); const bb = pb.geometry.boundingBox.clone().applyMatrix4(m), c = bb.getCenter(new T.Vector3()), g = S.surfaceAt(c.x, c.z); pebs.push([bb.min.y - g, bb.max.y - g]) }
  // (c) Rundumsuche (Einzel-Meshes; Instanzen oben getrennt)
  const skip = /terrain|sky|water|ground-skirt|demo-path|item:|player|partner|eyeActor|loco|faceMount|fb|rain|drops|orchard-fluff|contact-pebbles|lantern-crystal|crystal|halo|pool|beam|glow|amphitheater|billboard|tree:|npc|band|disco|fluffer|racer|car/i
  const path = (o) => { const a = []; for (let n = o; n && n !== sc; n = n.parent) a.push(n.name || n.type); return a.join('/') }, box = new T.Box3(), floaters = []
  sc.traverse((o) => { if (!o.isMesh || o.isInstancedMesh || !o.visible) return; for (let n = o; n; n = n.parent) if (!n.visible) return; const pt = path(o); if (skip.test(pt)) return
    box.setFromObject(o, true); if (box.isEmpty()) return; const c = box.getCenter(new T.Vector3()), gap = box.min.y - S.surfaceAt(c.x, c.z), h = box.max.y - box.min.y
    if (gap > 0.03 && gap < 3 && h < 2.5) floaters.push({ p: pt.slice(0, 120), gap: +gap.toFixed(3) }) })
  return { rest: { n: rest.length, min: Math.min(...rest), max: Math.max(...rest) }, pebs: { n: pebs.length, maxBottom: Math.max(...pebs.map((x) => x[0])), minTop: Math.min(...pebs.map((x) => x[1])) }, floaters: floaters.slice(0, 10), nFloat: floaters.length }
})
await browser.close()
process.exit(report('floatingProps (Kritiker R3: schwebender Stein)', {
  fallenFluffSits: r.rest.n > 0 && r.rest.min >= -0.1 && r.rest.max <= -0.02,
  pebblesInGround: r.pebs.n > 0 && r.pebs.maxBottom <= 0 && r.pebs.minTop > 0.005,
  noOtherFloaters: r.nFloat === 0,
  noPageErrors: errs.length === 0,
}, r))
