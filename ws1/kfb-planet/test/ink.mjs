// WS-NPC Phase C P1 (V-583, Lead-OK 21.10. a) · Tusche-Patch im Gelände (m1-terrain setInkPatches, src/look/inkPatch.js), im Spiel geprüft für den
// Standard-Look und terrain3. In EINEM synchronen Durchlauf (kein Physik-Schritt, keine Animation dazwischen) wird dieselbe Kamera in ein festes
// Render-Ziel gezeichnet: A ohne Patch (Schicht noch nicht angehängt), B mit einem Patch, C nach dem Entfernen (Schicht angehängt, Stärke 0).
//   · A und C byte-gleich (ohne Patch ändert sich kein Pixel; die Schicht wird beim letzten Patch wieder abgenommen)
//   · B weicht nur innerhalb des projizierten Patch-Kreises (+ Rand) ab, dort deutlich dunkler (Richtung #1f1a14); außerhalb höchstens ≤ 5 Pixel um ±1
//     (neu übersetztes Shader-Programm, gemessen 21.10.: Standard-Look 1 Pixel ±1, terrain3 0)
//   · Kollisionsnetz und Höhen bleiben gleich, Schicht hängt erst nach dem ersten Patch
import { openPage, report } from './_page.mjs'
const res = {}
for (const look of ['standard', 'terrain3']) {
  const { browser, page, errs } = await openPage(`#m1,debug${look === 'terrain3' ? ',look=terrain3' : ''}`, { viewport: { width: 960, height: 600 } })
  await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.terrain, null, { timeout: 300000 })
  await page.waitForTimeout(1500)
  res[look] = await page.evaluate(() => {
    const M = window.__kfbM1, T = M.mods.terrain, THREE = M.three(), r = M.renderer(), scene = M.scene()
    const W = 480, H = 300, rt = new THREE.WebGLRenderTarget(W, H), cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 400)
    const P = { x: -11.5, z: 30.4, r: 1.6, amount: 1, seed: 3 }
    const gy = T.height(P.x, P.z); cam.position.set(P.x, gy + 6, P.z + 7); cam.lookAt(P.x, gy, P.z); cam.updateMatrixWorld()
    const grab = () => { r.setRenderTarget(rt); r.render(scene, cam); const px = new Uint8Array(W * H * 4); r.readRenderTargetPixels(rt, 0, 0, W, H, px); r.setRenderTarget(null); return px }
    const col0 = T.colliderData(), h0 = [T.height(0, 20), T.height(P.x, P.z), T.surfaceAt(P.x, P.z)]
    const before = T.info().ink
    const A = grab(), A2 = grab()
    let aaDiff = 0; for (let i = 0; i < A.length; i += 4) if (A[i] !== A2[i] || A[i + 1] !== A2[i + 1] || A[i + 2] !== A2[i + 2]) aaDiff++
    T.setInkPatches([P]); const B = grab(); const afterSet = T.info().ink
    T.setInkPatches([]); const C = grab(); const afterClear = T.info().ink
    const col1 = T.colliderData(), h1 = [T.height(0, 20), T.height(P.x, P.z), T.surfaceAt(P.x, P.z)]
    // Patch-Kreis in Bildpunkte projizieren (Rand 1,35 × r für die Rauschkante)
    const ring = []; for (let k = 0; k < 64; k++) { const a = k / 64 * Math.PI * 2, rr = P.r * 1.35, v = new THREE.Vector3(P.x + Math.cos(a) * rr, T.height(P.x + Math.cos(a) * rr, P.z + Math.sin(a) * rr), P.z + Math.sin(a) * rr).project(cam); ring.push([(v.x + 1) / 2 * W, (v.y + 1) / 2 * H]) }
    const inside = (x, y) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c } return c }
    let acDiff = 0, acMax = 0, bOutMax = 0, bOut = 0, bIn = 0, darkIn = 0, lumA = 0, lumB = 0
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4
      if (A[i] !== C[i] || A[i + 1] !== C[i + 1] || A[i + 2] !== C[i + 2]) { acDiff++; acMax = Math.max(acMax, Math.abs(A[i] - C[i]), Math.abs(A[i + 1] - C[i + 1]), Math.abs(A[i + 2] - C[i + 2])) }
      const d = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2])
      if (d > 0) { if (inside(x + 0.5, y + 0.5)) { bIn++; lumA += A[i] + A[i + 1] + A[i + 2]; lumB += B[i] + B[i + 1] + B[i + 2]; if (B[i] + B[i + 1] + B[i + 2] < A[i] + A[i + 1] + A[i + 2] - 30) darkIn++ } else { bOut++; bOutMax = Math.max(bOutMax, d) } } }
    rt.dispose()
    const same = (a, b) => a.vertices.length === b.vertices.length && a.vertices.every((v, i) => v === b.vertices[i]) && a.indices.every((v, i) => v === b.indices[i])
    return { before, afterSet, afterClear, aaDiff, acDiff, acMax, bOutMax, bIn, bOut, darkIn, darker: bIn ? +(1 - lumB / lumA).toFixed(3) : 0, colliderSame: same(col0, col1), heightsSame: h0.every((v, i) => v === h1[i]) }
  })
  res[look].errs = errs.length
  await browser.close()
}
const ok = (f) => Object.values(res).every(f)
process.exit(report('ink (Tusche-Patch m1-terrain, Standard + terrain3)', {
  lazyInstallAndRemove: ok((r) => r.before === false && r.afterSet === true && r.afterClear === false),
  withoutPatchByteEqual: ok((r) => r.acDiff === 0),
  patchChangesOnlyInside: ok((r) => r.bOut <= 5 && r.bOutMax <= 1 && r.bIn > 200),
  patchIsInkDark: ok((r) => r.darkIn > 0.8 * r.bIn && r.darker > 0.4),
  colliderAndHeightsUnchanged: ok((r) => r.colliderSame && r.heightsSame),
  noPageErrors: ok((r) => r.errs === 0),
}, { res }))
