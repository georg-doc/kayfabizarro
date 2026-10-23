// Staub-Probe Schritt 1 (Lead 23.10., WS0 Particle-First): den vorhandenen 160-Partikel-Staub des Racers isoliert messen – nur lesen, nichts ändern.
// Fahrt mit festem Ablauf aus der Spielkamera: gerade → Kurve links mit Drift (Q) → gerade → Kurve rechts mit Drift (E) → loslassen. Je Bild:
// lebende Partikel, Größe in Gerätepixeln (gl_PointSize, wie im Shader gerechnet) und in CSS-Pixeln, Abstand zur Kamera, Lage hinter dem Wagen,
// lebend überschriebene Partikel (Ring zu klein?), Drift-Signal. Pixeldichte per Argument (Standard 2 wie Georgs Mac). Hash-Zusatz per Argument
// (z. B. ,dust2=1 für die Probe). Bericht test/out/dust-probe<zusatz>.json.
import fs from 'fs'
// Start: flache Linie durch die Probe-Welt (≥ 30 m vom Amphitheater, 240 m bis zum Rand; vom Spawn aus fuhr die Fahrt über den Weltrand)
export const DUST_START = { x: -127.5, z: 12.6, yaw: Math.PI / 2 - 0.26 }
import { openPage } from './_page.mjs'
const DPR = +(process.env.DPR || 2), EXTRA = process.argv[2] || ''
const { browser, page, errs } = await openPage('#m1,debug,car,look=terrain3,world=probe,mute,dust3=0' + EXTRA, { viewport: { width: 1280, height: 720 }, deviceScaleFactor: DPR })
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbM1?.scene?.()?.getObjectByName('vehicle-rig-dust'), null, { timeout: 180000 }); await page.waitForTimeout(4000)
await page.evaluate(async (S) => { const M2 = window.__kfbM2; M2.setKind(M2.kind(), { p: [S.x, window.__kfbM1.terrainH(S.x, S.z) + 1, S.z], yaw: S.yaw }); await new Promise((r) => setTimeout(r, 2500)) }, DUST_START)
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, R = M.renderer(), scene = M.scene(), cam = M.camera3(), P = scene.getObjectByName('vehicle-rig-dust'), G = P.geometry
  const N = G.attributes.aLife.count, life = G.attributes.aLife.array, size = G.attributes.aSize.array, pos = G.attributes.position.array, uScale = P.material.uniforms.uScale.value
  const U2 = P.material.uniforms.uMaxPx ? P.material.uniforms : null, sstep = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u) }
  const gl0 = R.getContext(), ptMax = gl0.getParameter(gl0.ALIASED_POINT_SIZE_RANGE)[1], prev = new Float32Array(N), born = new Float64Array(N).fill(-1), ages = [], pr = R.getPixelRatio(), hBuf = R.domElement.height
  // Ablauf (s): Eingaben als Tasten (M.input), Abschnitte benannt
  const plan = [[3.0, 'gerade', { forward: true }], [2.6, 'drift-links', { forward: true, leftward: true, strafeL: true }], [1.6, 'gerade-2', { forward: true }], [2.6, 'drift-rechts', { forward: true, rightward: true, strafeR: true }], [1.4, 'loslassen', {}]]
  const frames = []; let t = 0, seg = 0, segT = 0, last = performance.now(), overwritten = 0, emitted = 0
  const v = new (M.three().Vector3)(), hist = []
  await new Promise((res) => { const f = (now) => { const dt = (now - last) / 1000; last = now; t += dt; segT += dt
    if (segT > plan[seg][0]) { seg++; segT = 0; if (seg >= plan.length) { M.input(null); res(); return } }
    M.input(plan[seg][2])
    const car = M2.car(), cp = car.pos?.() || null, sg = car.signals?.() || {}, yaw = car.yaw?.() ?? 0
    if (cp) { hist.push([cp.x, cp.z, t]); while (hist.length && t - hist[0][2] > 2.5) hist.shift() }
    // Abstand zur gefahrenen Spur: nächster Punkt der Wagen-Spur (letzte 2,5 s), Vorzeichen links (+) / rechts (−) der Fahrtrichtung dort
    const pathOff = (x, z) => { let bi = -1, bd = 1e9; for (let i = 0; i < hist.length; i++) { const d = (hist[i][0] - x) ** 2 + (hist[i][1] - z) ** 2; if (d < bd) { bd = d; bi = i } }
      if (bi < 0 || hist.length < 3) return null; const a = hist[Math.max(0, bi - 1)], b = hist[Math.min(hist.length - 1, bi + 1)], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz); if (l < 1e-4) return null
      return ((x - hist[bi][0]) * (tz / l) - (z - hist[bi][1]) * (tx / l)) }   // links von der Fahrtrichtung (+)
    cam.updateMatrixWorld(); const inv = cam.matrixWorldInverse
    let allSum = 0, allN = 0, pathSum = 0, pathN = 0, cover = 0, live = 0, visN = 0, behind = 0, big64 = 0, maxDev = 0, maxCss = 0, nearZ = 1e9, sumBack = 0, sumSide = 0, nBack = 0; const devs = []
    for (let j = 0; j < N; j++) {
      if (life[j] > prev[j] + 0.01) { emitted++; if (prev[j] > 0.02) overwritten++; if (born[j] >= 0 && prev[j] <= 0.02) ages.push(t - born[j]); born[j] = t }
      if (life[j] <= 0) { if (prev[j] > 0 && born[j] >= 0) { ages.push(t - born[j]); born[j] = -1 } prev[j] = life[j]; continue }
      prev[j] = life[j]; live++
      { const o = pathOff(pos[j * 3], pos[j * 3 + 2]); if (o != null) { allSum += o; allN++ } }
      v.set(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]).applyMatrix4(inv); const z = -v.z
      const s0 = size[j] * uScale * (0.4 + life[j]) / Math.max(0.2, z)
      const dev = Math.min(ptMax, U2 ? Math.min(Math.max(s0, U2.uMinPx.value), U2.uMaxPx.value) : s0)   // wie der jeweilige Shader, gedeckelt von der Hardware
      const fade = U2 ? Math.min(1, s0 / U2.uMinPx.value) * sstep(U2.uNear.value.x, U2.uNear.value.y, z) : 1
      // sichtbar: vor der Nah-Ebene und (mit halber Scheibe) im Bild
      let vis = z > cam.near; if (vis) { v.applyMatrix4(cam.projectionMatrix); const rx = dev / R.domElement.width, ry = dev / R.domElement.height; vis = Math.abs(v.x) < 1 + rx && Math.abs(v.y) < 1 + ry }
      if (!vis) { behind++; continue }
      if (fade <= 0) { behind++; continue }
      cover += Math.PI * (dev / 2) ** 2 * life[j] * 0.55 * fade
      nearZ = Math.min(nearZ, z); visN++; devs.push(dev); maxDev = Math.max(maxDev, dev); maxCss = Math.max(maxCss, dev / pr); if (dev > 64 * pr) big64++
      { const o = pathOff(pos[j * 3], pos[j * 3 + 2]); if (o != null) { pathSum += o; pathN++ } }
      if (cp) { const dx = pos[j * 3] - cp.x, dz = pos[j * 3 + 2] - cp.z, fx = Math.sin(yaw), fz = Math.cos(yaw); sumBack += -(dx * fx + dz * fz); sumSide += dx * fz - dz * fx; nBack++ } }
    devs.sort((a, b) => a - b)
    frames.push({ t: +t.toFixed(3), seg: plan[seg][1], path: pathN ? +(pathSum / pathN).toFixed(2) : null, pathAll: allN ? +(allSum / allN).toFixed(2) : null, cover: +cover.toFixed(0), live, vis: visN, notVis: behind, big64, maxDev: +maxDev.toFixed(1), p95Dev: devs.length ? +devs[Math.floor(devs.length * 0.95)].toFixed(1) : 0, maxCss: +maxCss.toFixed(1), nearZ: +nearZ.toFixed(2),
      back: nBack ? +(sumBack / nBack).toFixed(2) : null, side: nBack ? +(sumSide / nBack).toFixed(2) : null, drift: +(sg.drift ?? 0).toFixed(3), driftRig: window.__kfbDust2 ? +window.__kfbDust2.drift.toFixed(3) : null, speed: +(sg.speed ?? 0).toFixed(3) })
    requestAnimationFrame(f) }; requestAnimationFrame(f) })
  return { dust2: !!U2, maxPxUniform: U2 ? U2.uMaxPx.value : null, N, ptMax, uScale: +uScale.toFixed(2), pixelRatio: pr, bufH: hBuf, frames, overwritten, emitted, ages }
})
await browser.close()
const F = r.frames, segs = [...new Set(F.map((f) => f.seg))], q = (a, k) => { const s = a.slice().sort((x, y) => x - y); return s.length ? +s[Math.floor(k * (s.length - 1))].toFixed(2) : null }
// Flackern: Bild-zu-Bild-Änderung der Deckfläche (relativ, nur wenn genug Staub im Bild)
const flick = []; for (let i = 1; i < F.length; i++) { const a = F[i - 1].cover, b = F[i].cover; if (Math.max(a, b) > 2000) flick.push(Math.abs(b - a) / Math.max(a, b)) }
const summary = { dust2: r.dust2, maxPxUniform: r.maxPxUniform, flickerP95: q(flick, 0.95), DPR, extra: EXTRA, pool: r.N, hwPointMax: r.ptMax, framesWithBig64: F.filter((f) => f.big64 > 0).length, frames: F.length, visP50: q(F.map((f) => f.vis), 0.5), uScale: r.uScale, pixelRatio: r.pixelRatio, emitted: r.emitted, overwrittenAlive: r.overwritten, lifeS: { p50: q(r.ages, 0.5), p95: q(r.ages, 0.95), max: q(r.ages, 1) },
  maxDevPx: Math.max(...F.map((f) => f.maxDev)), maxCssPx: Math.max(...F.map((f) => f.maxCss)), nearestZ: Math.min(...F.map((f) => f.nearZ)),
  bySeg: Object.fromEntries(segs.map((s) => { const G = F.filter((f) => f.seg === s); return [s, { frames: G.length, liveMax: Math.max(...G.map((f) => f.live)), liveP50: q(G.map((f) => f.live), 0.5), visP50: q(G.map((f) => f.vis), 0.5), big64Frames: G.filter((f) => f.big64 > 0).length, maxDev: Math.max(...G.map((f) => f.maxDev)), p95Dev: q(G.map((f) => f.p95Dev), 0.5), drift: q(G.map((f) => Math.abs(f.drift)), 0.5), driftMax: Math.max(...G.map((f) => Math.abs(f.drift))), back: q(G.map((f) => f.back).filter((x) => x != null), 0.5), pathOff: q(G.map((f) => f.path).filter((x) => x != null), 0.5), pathOffAll: q(G.map((f) => f.pathAll).filter((x) => x != null), 0.5), pathOffDrift: q(G.filter((f) => Math.abs(f.drift) >= 0.8).map((f) => f.path).filter((x) => x != null), 0.5), side: q(G.map((f) => f.side).filter((x) => x != null), 0.5), speed: q(G.map((f) => f.speed), 0.5) }] })), errs: errs.slice(0, 3) }
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/dust-probe' + EXTRA.replace(/[^a-z0-9]+/gi, '_') + '.json', JSON.stringify({ summary, frames: F }, null, 1))
console.log(JSON.stringify(summary, null, 1))
