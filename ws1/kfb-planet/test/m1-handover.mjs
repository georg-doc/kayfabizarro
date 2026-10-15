// M1 · Kamera-Übergabe Folgekamera ↔ Bühnenkamera (V-257; Prüfer M1-5, Befunde N1/N2). Replay mit festem Takt: je Physik-Schritt (dt = 1/60 für alle
// useFrame-Handler) Phase, Bildfeld und Blickrichtung aufzeichnen.
//   Start: Figur landet auf der Bühne → Dialog → Bühnenkamera gleitet auf den Standard-Blick (38°).
//   Ruhe: im Dialog steht die Kamera still – keine zwei Steuerungen, die gegeneinander schreiben (N2).
//   Ende: Escape-Weg (endDialog) → Folgekamera übernimmt am letzten Stand der Bühnenkamera, Bildfeld 38° → 55° überblendet (N1).
// Kein harter Schnitt: In keinem Schritt mehr als 20 % der gesamten Änderung im Fenster um den Wechsel (Bildfeld bzw. Blickwinkel; ein Schnitt = 100 %).
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,replay,cards=1', { viewport: { width: 640, height: 400 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().partner === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const rec = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player()
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  await steps(30)
  const out = []; let endAt = -1
  await new Promise((done) => { let i = 0; C.onStep = () => {
    if (i === 10) P.teleport([0, 1.15, 3], Math.PI) // auf die Bühne (innerhalb des Auslösers) – Dialog startet beim Aufsetzen
    if (i === 260 && M.state.phase === 'dialog') { M.endDialog(); endAt = i }
    const st = M.status(); out.push({ i, phase: M.state.phase, fov: st.fov, dir: st.cameraDir, orbit: window.__kfbStageOrbit?.active?.() ?? null })
    if (++i >= 420) { C.onStep = null; done() } } })
  return { out, endAt }
})
await browser.close()

const R = rec.out, ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * 180 / Math.PI
const windowAt = (from, to, len = 90) => {
  const i = R.findIndex((r, k) => k > 0 && R[k - 1].phase === from && r.phase === to); if (i < 0) return null
  const w = R.slice(i - 1, i + len); let maxF = 0, maxA = 0
  for (let k = 1; k < w.length; k++) { maxF = Math.max(maxF, Math.abs(w[k].fov - w[k - 1].fov)); maxA = Math.max(maxA, ang(w[k].dir, w[k - 1].dir)) }
  const totF = Math.abs(w.at(-1).fov - w[0].fov), totA = ang(w.at(-1).dir, w[0].dir)
  return { at: i, maxFovStep: +maxF.toFixed(3), totalFov: +totF.toFixed(2), maxAngStep: +maxA.toFixed(3), totalAng: +totA.toFixed(2), fovShare: totF ? +(maxF / totF).toFixed(3) : 0, angShare: totA ? +(maxA / totA).toFixed(3) : 0, fovEnd: +w.at(-1).fov.toFixed(2), orbitEnd: w.at(-1).orbit }
}
const start = windowAt('free', 'dialog'), end = windowAt('dialog', 'free')
// Ruhe im Dialog: von 120 Schritten nach dem Start (Gleiten fertig) bis kurz vor dem Ende
let still = null
if (start) { const q = R.filter((r) => r.i >= start.at + 120 && r.i < rec.endAt - 2); let m = 0; for (let k = 1; k < q.length; k++) m = Math.max(m, ang(q[k].dir, q[k - 1].dir)); still = { steps: q.length, maxAngStep: +m.toFixed(4), fovs: [...new Set(q.map((r) => +r.fov.toFixed(2)))] } }
const smooth = (h) => !!h && h.fovShare <= 0.2 && (h.totalAng < 1 || h.angShare <= 0.2)
process.exit(report('m1-handover', {
  dialogStarted: !!start,
  startSmooth: smooth(start),
  startReachesStageFov: start?.fovEnd === 38 && start?.orbitEnd === true,
  dialogCameraStill: !!still && still.steps > 50 && still.maxAngStep < 0.05 && still.fovs.length === 1 && still.fovs[0] === 38,
  dialogEnded: !!end && rec.endAt > 0,
  endSmooth: smooth(end),
  endReachesFollowFov: end?.fovEnd === 55 && end?.orbitEnd === false,
  noPageErrors: errs.length === 0,
}, { start, still, end, endAt: rec.endAt, errs: errs.slice(0, 3) }))
