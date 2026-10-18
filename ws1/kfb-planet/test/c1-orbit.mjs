// C1 Kamera (V-408) · Orbit 360° um das stehende und das fahrende Auto (K2B, ≈ 4,5 m/s) ohne Sprung: Orbit-Eingabe gleichmäßig über 3 s (wie Ziehen),
// je Bild Azimut der Kamera um das Auto und Abstand. Kein Sprung = kein Bild-zu-Bild-Schritt größer als 3 × Median und keine Abstandsänderung > 8 %
// je Bild; dazu läuft die Kamera wirklich einmal herum (Summe ≥ 330°) und das Auto bleibt im Bild. Echter Bildtakt, norender, 60 und 30 fps.
import { openPage, report } from './_page.mjs'
async function run(moving, half) {
  const { browser, page, errs } = await openPage(`#m1,debug,norender,car${half ? ',fps=30' : ''}`, { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.() && window.__kfbM2.stats.follow, null, { timeout: 240000 })
  const r = await page.evaluate(async (moving) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, J = K / 0.6509
    const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
    const x = -18 * J, z = -14 * J; M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw: Math.PI / 2 }); await steps(10); while (!M2.car()) await steps(1); await steps(60)
    C.onStep = () => { const c = M2.car(); M.input(moving ? { forward: (c?.speed() ?? 0) < 4.5 } : null) }
    const F = M2.stats.follow, V = M2.stats.visualRoot.position.clone(), cam = M.camera3(), out = []; let t0 = null, done
    const fin = new Promise((r) => { done = r })
    C.onDraw = () => { const now = performance.now(); if (t0 == null) t0 = now; const t = (now - t0) / 1000
      if (t < 3) F.orbit((2 * Math.PI / 3) * (M.clock.frameDt || 1 / 60), 0) // gleichmäßig 360° in 3 s, wie ein ruhiges Ziehen
      M2.stats.visualRoot.getWorldPosition(V); const dx = cam.position.x - V.x, dz = cam.position.z - V.z, s = V.clone(); s.y += 1 * K; s.project(cam)
      out.push([Math.atan2(dx, dz), Math.hypot(dx, dz), s.x, s.y]); if (t > 4) { C.onDraw = null; done() } }
    await fin; C.onStep = null; M.input(null); return out }, moving)
  await browser.close()
  const steps = []; let sum = 0
  for (let i = 1; i < r.length; i++) { const d = Math.atan2(Math.sin(r[i][0] - r[i - 1][0]), Math.cos(r[i][0] - r[i - 1][0])); steps.push(Math.abs(d)); sum += d }
  const moving_ = steps.filter((s) => s > 1e-4).sort((a, b) => a - b), med = moving_[Math.floor(moving_.length / 2)] || 0
  const maxStep = Math.max(...steps), maxDist = Math.max(...r.slice(1).map((q, i) => Math.abs(q[1] - r[i][1]) / r[i][1]))
  return { moving, fps: half ? 30 : 60, frames: r.length, turnedDeg: +(Math.abs(sum) * 57.3).toFixed(0), medStepDeg: +(med * 57.3).toFixed(2), maxStepDeg: +(maxStep * 57.3).toFixed(2), maxDistPct: +(maxDist * 100).toFixed(2),
    inView: r.every((q) => Math.abs(q[2]) < 1 && Math.abs(q[3]) < 1), errs }
}
const R = []
for (const moving of [false, true]) for (const half of [false, true]) R.push(await run(moving, half))
const ok = (x) => x.turnedDeg >= 330 && x.maxStepDeg <= 3 * x.medStepDeg + 0.5 && x.maxDistPct <= 8 && x.inView
process.exit(report('c1-orbit', { orbitStanding: R.filter((x) => !x.moving).every(ok), orbitMoving: R.filter((x) => x.moving).every(ok), noPageErrors: R.every((x) => x.errs.length === 0) }, { R: R.map(({ errs, ...x }) => x) }))
