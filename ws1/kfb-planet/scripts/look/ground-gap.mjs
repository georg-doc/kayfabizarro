// V-400 · Schwebe-Messung der Meshy-Bühnen im Browser nach der WSB-Methode (B7 scripts/b7_ground_gap.py): Strahlenraster 120 × 120 von unten nach oben
// innerhalb des Umrisses (kfb.stage-edges/1 footprint), je Strahl der erste Treffer am Modell. Ergebnis je Bühne:
// tiefster Punkt, 98-%-Band der Unterseite über dem tiefsten Punkt (Schwebe), Vorschlag groundY_u = (Schwebe + Einsinken 20 % der untersten Stufe,
// höchstens 4 cm) / scale (Rohmessung, ohne three-mesh-bvh: Zellen-Index über die Dreiecke). Schreibt test/out/look/ground-gap.json; die Werte gehen nach Prüfung in die Stage-Edges-Daten (WS0).
// node scripts/look/ground-gap.mjs [scenes=goblin,atlantis,comic,utopia]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const SCENES = (process.argv[2] || 'goblin,atlantis,comic,utopia').split(',')
fs.mkdirSync('test/out/look', { recursive: true })
const res = {}
for (const sc of SCENES) {
  const { browser, page, errs } = await openPage(`#stage,debug,actors=none,light=l1,nobar,scene=${sc}`, { viewport: { width: 640, height: 360 } })
  await page.waitForFunction(() => window.__kfbStageMods?.amph?.status().status === 'OK', null, { timeout: 480000 }).catch(() => {})
  res[sc] = await page.evaluate(async () => {
    const S = window.__kfbStageMods, root = S.amph.object3d, model = root.children.find((o) => /meshy/i.test(o.name)) || root
    // ohne Modul-Import: Strahltest über die Dreiecke im Weltraum (ein Gitter, deshalb einfacher Ebenen-Test je Dreieck in xz-Zelle)
    const tris = []; model.updateMatrixWorld(true)
    model.traverse((o) => { if (!o.isMesh || o.name === 'screen') return; const P = o.geometry.attributes.position, I = o.geometry.index, M = o.matrixWorld, V = window.__kfbStageCamera.position.constructor
      const a = new V(), b = new V(), c = new V(), n = I ? I.count : P.count
      for (let t = 0; t < n; t += 3) { const ia = I ? I.getX(t) : t, ib = I ? I.getX(t + 1) : t + 1, ic = I ? I.getX(t + 2) : t + 2
        a.fromBufferAttribute(P, ia).applyMatrix4(M); b.fromBufferAttribute(P, ib).applyMatrix4(M); c.fromBufferAttribute(P, ic).applyMatrix4(M)
        tris.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z) } })
    const T = new Float32Array(tris), nt = T.length / 9
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (let i = 0; i < nt; i++) for (let k = 0; k < 3; k++) { const x = T[i * 9 + k * 3], z = T[i * 9 + k * 3 + 2]; x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z) }
    // Zellen-Index für schnelle Suche
    const N = 120, cw = (x1 - x0) / N, ch = (z1 - z0) / N, cells = Array.from({ length: N * N }, () => [])
    for (let i = 0; i < nt; i++) { let ax = Infinity, bx = -Infinity, az = Infinity, bz = -Infinity; for (let k = 0; k < 3; k++) { const x = T[i * 9 + k * 3], z = T[i * 9 + k * 3 + 2]; ax = Math.min(ax, x); bx = Math.max(bx, x); az = Math.min(az, z); bz = Math.max(bz, z) }
      for (let gx = Math.max(0, Math.floor((ax - x0) / cw)); gx <= Math.min(N - 1, Math.floor((bx - x0) / cw)); gx++) for (let gz = Math.max(0, Math.floor((az - z0) / ch)); gz <= Math.min(N - 1, Math.floor((bz - z0) / ch)); gz++) cells[gz * N + gx].push(i) }
    const lowY = (x, z) => { let best = Infinity; const gx = Math.min(N - 1, Math.floor((x - x0) / cw)), gz = Math.min(N - 1, Math.floor((z - z0) / ch))
      for (const i of cells[gz * N + gx]) { const o = i * 9, ax = T[o], ay = T[o + 1], az = T[o + 2], bx = T[o + 3], by = T[o + 4], bz = T[o + 5], cx = T[o + 6], cy = T[o + 7], cz = T[o + 8]
        const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz); if (Math.abs(d) < 1e-12) continue
        const l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d, l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d, l3 = 1 - l1 - l2; if (l1 < 0 || l2 < 0 || l3 < 0) continue
        const y = l1 * ay + l2 * by + l3 * cy; if (y < best) best = y }
      return best }
    const hits = []; for (let gz = 0; gz < N; gz++) for (let gx = 0; gx < N; gx++) { const y = lowY(x0 + (gx + 0.5) * cw, z0 + (gz + 0.5) * ch); if (Number.isFinite(y)) hits.push(y) }
    hits.sort((a, b) => a - b); const minY = hits[0], q = (p) => hits[Math.min(hits.length - 1, Math.floor(p * hits.length))]
    return { tris: nt, hits: hits.length, minY: +minY.toFixed(3), q02: +q(0.02).toFixed(3), q50: +q(0.5).toFixed(3), floor0: 0, info: S.amph.status().info }
  }).catch((e) => ({ error: String(e.message || e) }))
  res[sc].errs = errs.length; console.log(sc, JSON.stringify(res[sc]).slice(0, 300)); await browser.close()
}
fs.writeFileSync('test/out/look/ground-gap.json', JSON.stringify(res, null, 1))
