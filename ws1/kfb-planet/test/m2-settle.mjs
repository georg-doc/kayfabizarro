// M2 · Ruhe ohne Eingabe (Georg 16.10.: „hüpft seitlich die ganze Zeit und hört auch nicht auf“). Je Kandidat (A ecctrl, B k2b) drei Lagen:
//   eben (Platz), quer am Hang (Hang fällt seitlich, Fahrtrichtung +Z), nach einer Landung (aus 3 m fallen gelassen).
// Ablauf: 2 s ohne Eingabe, dann 1 s messen. Grenzen: Aufbaubewegung je Schritt ≤ 3 mm – eben und nach der Landung die ganze Bewegung, am Hang nur
// die Unruhe (Abweichung vom gleichmäßigen Rollen: 2. Differenz der Lage) plus Rollwinkel-Änderung ≤ 0,2° je Schritt. Rollen bergab ist erlaubt.
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,replay,car', { viewport: { width: 320, height: 240 }, log: true })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const res = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  const spots = { flat: { p: [12 * K, 0, 30 * K], yaw: Math.PI / 2, drop: 1 * K }, slope: { p: [72 * K, 0, 0], yaw: 0, drop: 1 * K }, landing: { p: [-12 * K, 0, 30 * K], yaw: 0, drop: 3 * K } }
  const out = {}
  for (const kind of ['ecctrl', 'k2b']) {
    out[kind] = {}
    for (const [name, s] of Object.entries(spots)) {
      const y = (M.terrainH(s.p[0], s.p[2]) ?? 0) + s.drop
      M.input(null); M2.setKind(kind, { p: [s.p[0], y, s.p[2]], yaw: s.yaw }); await steps(5); while (!M2.car()) await steps(1)
      await steps(120) // 2 s ohne Eingabe
      const rec = []
      await new Promise((done) => { let i = 0; C.onStep = () => { const c = M2.car(); if (!c) return; const p = c.pos(), b = c.body?.()
        let roll = 0; if (b?.rotation) { const r = b.rotation(); roll = Math.asin(Math.max(-1, Math.min(1, 2 * (r.w * r.z + r.x * r.y)))) }
        rec.push([p.x, p.y, p.z, roll]); if (++i >= 60) { C.onStep = null; done() } } })
      out[kind][name] = rec
    }
    console.log(`[m2-settle] ${kind} fertig`)
  }
  return out
})
await browser.close()

const S = {}
for (const kind of ['ecctrl', 'k2b']) {
  S[kind] = {}
  for (const [name, rec] of Object.entries(res[kind])) {
    let move = 0, jerk = 0, roll = 0
    for (let i = 1; i < rec.length; i++) { move = Math.max(move, Math.hypot(rec[i][0] - rec[i - 1][0], rec[i][1] - rec[i - 1][1], rec[i][2] - rec[i - 1][2])); roll = Math.max(roll, Math.abs(rec[i][3] - rec[i - 1][3])) }
    for (let i = 2; i < rec.length; i++) jerk = Math.max(jerk, Math.hypot(...[0, 1, 2].map((k) => rec[i][k] - 2 * rec[i - 1][k] + rec[i - 2][k])))
    S[kind][name] = { moveMm: +(move * 1000).toFixed(1), jitterMm: +(jerk * 1000).toFixed(1), rollDeg: +((roll * 180) / Math.PI).toFixed(3) }
  }
}
const calm = (s, slope) => (slope ? s.jitterMm <= 3 : s.moveMm <= 3) && s.rollDeg <= 0.2
process.exit(report('m2-settle', {
  ecctrlFlatCalm: calm(S.ecctrl.flat), ecctrlSlopeCalm: calm(S.ecctrl.slope, true), ecctrlLandingCalm: calm(S.ecctrl.landing),
  k2bFlatCalm: calm(S.k2b.flat), k2bSlopeCalm: calm(S.k2b.slope, true), k2bLandingCalm: calm(S.k2b.landing),
  noPageErrors: errs.length === 0,
}, { ...S, errs: errs.slice(0, 3) }))
