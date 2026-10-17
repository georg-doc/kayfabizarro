// M2 · V-347 im Browser (K2B, nach V-367): dieselbe Fahrphysik wie scripts/m2/turn-circle.mjs, aber mit Host-Tasten, Gelände und Label.
//   Wende: aus dem Stand W + A auf dem Platz, Durchmesser der Spur bis 360° (Ziel ≈ 2 Wagenlängen = 9,9 m in J17)
//   Drift: 70 Schritte W, dann 60 Schritte W + A (+ Q) – mit Q mehr Drehung, Signal drift < 0 (links), Heck rutscht
//   Anzeige: Label „Fahrsystem: K2B | ecctrl“, Auto-Tasten Q E im Info-Symbol
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,replay,car', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
  const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
  const place = async (x, z, yaw) => { M.input(null); M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 2 * K, z], yaw }); await steps(40); while (!M2.car()) await steps(1); await steps(20) }
  const out = {}
  // Wende
  await place(12 * K, 30 * K, 0); { const c = M2.car(), y0 = c.yaw(), pts = []; let unwrap = 0, last = y0; M.input({ forward: true, leftward: true })
    for (let i = 0; i < 600 && Math.abs(unwrap) < 2 * Math.PI; i++) { await steps(1); const y = c.yaw(); let dy = y - last; dy -= Math.round(dy / (2 * Math.PI)) * 2 * Math.PI; unwrap += dy; last = y; const p = c.pos(); pts.push([p.x, p.z]) }
    M.input(null); let D = 0; for (let i = 0; i < pts.length; i += 2) for (let j = i; j < pts.length; j += 2) D = Math.max(D, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]))
    out.wende = { diameter: +D.toFixed(1), turned: +unwrap.toFixed(2), steps: pts.length } }
  // Drift
  const drift = async (q) => { await place(12 * K, 30 * K, 0); const c = M2.car(); M.input({ forward: true }); await steps(70); const y0 = c.yaw(), v0 = c.speed(); let sig = 0
    M.input({ forward: true, leftward: true, strafeL: q }); for (let i = 0; i < 60; i++) { await steps(1); sig = Math.min(sig, c.signals().drift) } M.input(null)
    let dy = c.yaw() - y0; dy -= Math.round(dy / (2 * Math.PI)) * 2 * Math.PI; return { speedIn: +v0.toFixed(1), yaw: +dy.toFixed(2), driftSignal: +sig.toFixed(2) } }
  out.driftQ = await drift(true); out.noQ = await drift(false)
  out.label = document.getElementById('m2-kind')?.textContent || ''
  out.keys = document.getElementById('m2-keys')?.textContent || ''
  return out
})
await browser.close()
process.exit(report('m2-v347', {
  wendeTwoCarLengths: r.wende.turned >= 2 * Math.PI - 0.05 && r.wende.diameter <= 2.3 * 2 * 4.0339 * 0.947 * K,
  driftTurnsMore: r.driftQ.yaw > r.noQ.yaw * 1.3 && r.driftQ.driftSignal < -0.5 && r.noQ.driftSignal === 0,
  label: /Fahrsystem: K2B \| ecctrl/.test(r.label),
  keyList: /Q E/.test(r.keys),
  noPageErrors: errs.length === 0,
}, { ...r, errs: errs.slice(0, 3) }))
