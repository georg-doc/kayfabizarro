// V-230 · Amphitheater-Bühne (#stage) · ein deterministischer Prüfpunkt je zugesagter Eigenschaft.
import { WORLD_K as K } from '../src/worldScale.js'
import fs from 'fs'
import { createHash } from 'crypto'
import { openPage, report } from './_page.mjs'
import { AMPH_URL, AMPH_SHA256, AMPH_COMMIT } from '../src/modules/amphitheater.js'

// gepinnte Browser-Fassung: Inhalt am Commit = registrierte Prüfsumme (Asset Librarian runtimeUrl / runtimeSha256).
// Cache nach Prüfsumme (test/out/cache): nur ein Download je Rechner; Netz- oder Dateifehler werden zu FAIL, nicht zu einer Ausnahme.
let bytes = null, pinnedSha = null, rec = null, fetchErr = null
try {
  const cf = 'test/out/cache/' + AMPH_SHA256 + '.glb'
  if (fs.existsSync(cf)) bytes = fs.readFileSync(cf)
  else { bytes = Buffer.from(await (await fetch(AMPH_URL)).arrayBuffer()); fs.mkdirSync('test/out/cache', { recursive: true }); fs.writeFileSync(cf, bytes) }
  pinnedSha = createHash('sha256').update(bytes).digest('hex')
} catch (e) { fetchErr = String(e.message || e) }
try {
  const live = JSON.parse(fs.readFileSync(process.env.KFB_REPO_LIVE || `${process.env.HOME}/kfb-ws1/kayfabizarro/tools/asset_registry/librarian/live/private-asset-live.json`, 'utf8'))
  rec = live.assets.find((a) => a.assetId === 'private:meshy-claymation-amphitheater-master')
} catch (e) { fetchErr = (fetchErr ? fetchErr + ' · ' : '') + 'Registry: ' + e.message }

const { browser, page, errs } = await openPage('#stage,debug,cam=two,actors=rogue', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().status === 'OK' && S.right?.status().status === 'OK' }, null, { timeout: 240000 })
await page.waitForTimeout(2000)
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/stage_two.png', await page.screenshot())
// Höhenproben auf dem Modell (senkrechter Strahl gegen die Dreiecke des Modells in Weltlage)
const m = await page.evaluate((K) => {
  const S = window.__kfbStageMods, root = S.amph.object3d, model = root.getObjectByName('amphitheater-model'), ground = root.getObjectByName('clay-ground'), cam = window.__kfbStageCamera, V = cam.position.constructor
  // eigener Strahltest: Dreiecke des Modells (Welt) gegen senkrechten Strahl; genügt für Höhenproben
  let mesh = null; model.traverse((o) => { if (o.isMesh && !mesh) mesh = o })
  mesh.updateWorldMatrix(true, false)
  const P = mesh.geometry.attributes.position, I = mesh.geometry.index, M = mesh.matrixWorld, a = new V(), b = new V(), c = new V()
  const heightAt = (x, z) => { let best = -Infinity; for (let t = 0; t < I.count; t += 3) { a.fromBufferAttribute(P, I.getX(t)).applyMatrix4(M); b.fromBufferAttribute(P, I.getX(t + 1)).applyMatrix4(M); c.fromBufferAttribute(P, I.getX(t + 2)).applyMatrix4(M)
      const d = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z); if (Math.abs(d) < 1e-12) continue; const l1 = ((b.z - c.z) * (x - c.x) + (c.x - b.x) * (z - c.z)) / d, l2 = ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / d, l3 = 1 - l1 - l2
      if (l1 < 0 || l2 < 0 || l3 < 0) continue; const y = l1 * a.y + l2 * b.y + l3 * c.y; if (y > best && y < 3 * K) best = y } return best }
  const bbBox = (() => { const bb = S.billboard.object3d; bb.updateWorldMatrix(true, true); const box = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] }; bb.traverse((o) => { if (!o.isMesh) return; o.geometry.computeBoundingBox(); const q = o.geometry.boundingBox; for (const x of [q.min.x, q.max.x]) for (const y of [q.min.y, q.max.y]) for (const z of [q.min.z, q.max.z]) { const w = new V(x, y, z).applyMatrix4(o.matrixWorld); ['x', 'y', 'z'].forEach((k, i) => { box.min[i] = Math.min(box.min[i], w[k]); box.max[i] = Math.max(box.max[i], w[k]) }) } }); return box })()
  return { info: S.amph.status().info, groundY: ground.position.y, h0: heightAt(0, 0), h65: heightAt(6.5 * K, 0), hm65: heightAt(-6.5 * K, 0), hb65: heightAt(0, -6.5 * K), h80: heightAt(8.5 * K, 0), hb85: heightAt(0, -8.5 * K), bbBox, cams: window.__kfbStageCtl.cams }
}, K)
// Karte im Two-Shot: Bildschirm-Überdeckung mit Figuren und Sichtlinie Kamera → Kartenecken frei (kein Theater-Teil davor)
const ov = await page.evaluate(() => {
  const S = window.__kfbStageMods, face = S.billboard.object3d.getObjectByName('face'), cam = window.__kfbStageCamera, V = cam.position.constructor
  const rect = (pts) => { const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  face.geometry.computeBoundingBox(); const bb = face.geometry.boundingBox, fc = []
  for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) fc.push(face.localToWorld(new V(x, y, 0)).project(cam))
  const actorRect = (a) => { const pts = []; a.object3d.updateWorldMatrix(true, true); a.object3d.traverse((m) => { if (!m.isMesh || !m.visible) return; let q; if (m.isSkinnedMesh) { m.computeBoundingBox(); q = m.boundingBox } else { m.geometry.computeBoundingBox(); q = m.geometry.boundingBox } for (const x of [q.min.x, q.max.x]) for (const y of [q.min.y, q.max.y]) for (const z of [q.min.z, q.max.z]) pts.push(m.localToWorld(new V(x, y, z)).project(cam)) }); return rect(pts) }
  const F = rect(fc), L = actorRect(S.left), R = actorRect(S.right), inter = (P, Q) => Math.max(0, Math.min(P[2], Q[2]) - Math.max(P[0], Q[0])) * Math.max(0, Math.min(P[3], Q[3]) - Math.max(P[1], Q[1]))
  return { overlap: inter(F, L) + inter(F, R), faceInView: F[0] > -1 && F[2] < 1 && F[1] > -1 && F[3] < 1, F }
})
const life = await page.evaluate(() => { const S = window.__kfbStageMods, seen = new Set(); S.amph.object3d.traverse((o) => { if (o.isMesh) { o.geometry.addEventListener('dispose', () => seen.add(o.geometry.uuid)) } }); const n = (() => { let k = 0; S.amph.object3d.traverse((o) => { if (o.isMesh) k++ }); return k })(); S.amph.dispose(); return { meshes: n, freed: seen.size, log: window.__kfbStageCtl.log().amph } })
await browser.close()

const i = m.info
process.exit(report('stage amphitheater', {
  // Master-Kennung (integrity = Master in Dropbox) und Laufzeit-Variante (runtimeSha256/Bytes = Browser-Fassung) getrennt geprüft
  pinnedAssetMatchesRegistry: pinnedSha === AMPH_SHA256 && rec?.delivery?.runtimeUrl === AMPH_URL && AMPH_URL.includes(AMPH_COMMIT) && rec?.delivery?.runtimeSha256 === AMPH_SHA256 && rec?.delivery?.runtimeBytes === bytes?.length
    && rec?.integrity?.sha256 === '11846848465efb0f119bf2ab27290787cdbb2c63f55773915d1dca38952a9efb',
  browserBudget: !!bytes && bytes.length < 20e6 && i.tris >= 300000 && i.tris <= 400000,
  scaleStage14m: Math.abs(i.scale - 18.9189 * K) < 1e-3 && Math.abs(m.h0) < 0.03 && Math.abs(m.h65) < 0.05 && Math.abs(m.hm65) < 0.05 && Math.abs(m.hb65) < 0.05 && (m.h80 > 0.3 * K || m.hb85 > 0.3 * K), // V-345: 14 alte WS1-Meter = 9,1 J17-Meter; Bühnenboden bei y = 0 (±3 cm Mitte), eben bis r 6,5 m, Ränge dahinter
  groundCloseUnderModel: m.groundY > i.min[1] && m.groundY < 0, // Bodenschluss: Gelände über der offenen Unterkante, unter der Bühnenfläche
  camerasAboveGround: Object.values(m.cams).every((c) => c.pos[1] > 0.5),
  billboardOnStageFloor: Math.hypot(Math.max(Math.abs(m.bbBox.min[0]), Math.abs(m.bbBox.max[0])), Math.max(Math.abs(m.bbBox.min[2]), Math.abs(m.bbBox.max[2]))) < 7 * K && m.bbBox.min[1] > -1.25 * K, // Pfosten stecken wie im Spender 1,2 m im Boden (STYLES.plain.sink)
  cardReadableTwoShot: ov.faceInView && ov.overlap === 0,
  disposeFreesAll: life.freed === life.meshes && life.log.dispose === 1,
  noPageErrors: errs.length === 0,
}, { pinnedSha, bytes: bytes?.length ?? null, fetchErr, m, ov, life, errs }))
