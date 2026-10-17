// M3 · Stufe B (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): Lage – kein Überschlag, kein Nasenstand, ruhige Hangfahrt. Je Bildrate (replay, replay=30).
// Vorher/Nachher im selben Lauf (nur 60 fps; 30 fps nur nachher): „vorher“ = ATT aus (Lage schnappt am Boden auf die Normale, bleibt in der Luft stehen wie bis M2), „nachher“ = ATT.
//   G-B1  4 Rampen × 5 Anlauf-Längen (4/8/12/18/26 m, Vollgas): 0 Überschläge = Lage nie über 70° gekippt (oben·Y < 0,34) und Landung auf den Rädern
//   G-B2  10 Nasen-Tests: langsam (≈ 3 m/s, dann rollen) über die Tafel-Kante und den Kicker: 0 × Nase > 45° länger als 0,5 s
//   Hang  20 Querfahrten am Hang (Hügelring 30–62 m, Start r 45 m, quer zur Falllinie): Luftschritte (Seitwärtshüpfen) und Rollen-Umkehrungen (Dauerrollen) berichtet
import { openPage, report } from './_page.mjs'
import { STUNT, J } from '../src/m3/stuntData.js'

async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ ramps, J, modes }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, ATT0 = { ...M2.att }
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const place = async (x, z, yaw) => { M.input(null); M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(12) }
    // Aufnahme: je Schritt Lage, Luft; inp(i) liefert die Eingabe je Schritt
    const rec = (n, inp) => new Promise((done) => { const o = []; let i = 0; C.onStep = () => { const c = M2.car(); if (!c) return; M.input(inp(i)); const a = c.attitude(); o.push([+a.pitchDeg.toFixed(1), +a.rollDeg.toFixed(1), +a.upY.toFixed(3), c.state().air ? 1 : 0]); if (++i >= n) { C.onStep = null; M.input(null); done(o) } } })
    const set = (on) => Object.assign(M2.att, on ? ATT0 : { ground: 1e6, air: 0 }) // vorher: Schnapp am Boden, Lage in der Luft fest
    const out = {}
    for (const mode of modes) { set(mode === 'nachher'); const R = out[mode] = { ramps: [], nose: [], slope: [] }
      for (const r of ramps) for (const run of [4, 8, 12, 18, 26]) { await place(r.x * J, (r.z + run) * J, Math.PI); R.ramps.push({ id: r.id, run, a: await rec(200, () => ({ forward: true })) }) }
      // Nase: langsam an die Kante (3 s Gas mit ≈ 3 m/s gedeckelt durch kurze Gasstöße), dann rollen
      const tafel = ramps.find((r) => r.id === 'tafel'), kick = ramps.find((r) => r.id === 'kicker')
      for (let k = 0; k < 10; k++) { const r = k < 5 ? tafel : kick, z0 = k < 5 ? r.z - r.len - 2.5 + (k % 5) * 0.4 : r.z + 3 + (k % 5) * 0.5
        await place(r.x * J + ((k % 5) - 2) * 0.5 * J, z0 * J, Math.PI); if (k < 5) await steps(30)
        R.nose.push({ id: r.id, a: await rec(200, (i) => ({ forward: M2.car().speed() < 3 * K && i < 170 })) }) }
      // Hang: Querfahrt bei r ≈ 45 m (Falllinie radial): Fahrtrichtung tangential, 4 s Vollgas
      for (let k = 0; k < 20; k++) { const ang = (k / 20) * Math.PI * 2, rr = 45 * J, x = Math.sin(ang) * rr, z = Math.cos(ang) * rr /* r 45 m (J17) liegt mitten im Hügelring 30–62 m */
        await place(x, z, ang + Math.PI / 2); R.slope.push({ a: await rec(150, () => ({ forward: true })) }) }
      console.log(`[m3-b] ${mode} fertig, Schritt ${C.steps}`) }
    set(true); return out
  }, { ramps: STUNT.ramps, J, modes: hz === 60 ? ['vorher', 'nachher'] : ['nachher'] })
  await browser.close()
  const over = (a) => a.some(([p, r, uy]) => uy < 0.34) || (() => { const i = a.findLastIndex((x) => x[3] === 1); return i >= 0 && i < a.length - 1 && a.slice(i + 1, i + 20).some(([, , uy]) => uy < 0.8) })()
  const noseLong = (a) => { let run = 0, worst = 0; for (const [p] of a) { run = p < -45 || p > 45 ? run + 1 : 0; worst = Math.max(worst, run) } return worst }
  const flips = (a) => { let n = 0; for (let i = 2; i < a.length; i++) { const d1 = a[i][1] - a[i - 1][1], d0 = a[i - 1][1] - a[i - 2][1]; if (Math.abs(d1) > 0.3 && Math.sign(d1) !== Math.sign(d0)) n++ } return n }
  const S = {}
  for (const mode of Object.keys(res)) { const R = res[mode]
    S[mode] = { rampRuns: R.ramps.length, overturns: R.ramps.filter((x) => over(x.a)).length, maxPitch: Math.max(...R.ramps.map((x) => Math.max(...x.a.map((q) => Math.abs(q[0]))))), maxRoll: Math.max(...R.ramps.map((x) => Math.max(...x.a.map((q) => Math.abs(q[1]))))),
      noseFails: R.nose.filter((x) => noseLong(x.a) > 30).length, noseWorstSteps: Math.max(...R.nose.map((x) => noseLong(x.a))),
      slopeAirSteps: R.slope.reduce((n, x) => n + x.a.filter((q) => q[3]).length, 0), slopeRollFlips: R.slope.reduce((n, x) => n + flips(x.a), 0), slopeMaxRoll: Math.max(...R.slope.map((x) => Math.max(...x.a.map((q) => Math.abs(q[1]))))) } }
  return { hz, S, errs }
}
const A = await pass(60), B = await pass(30)
process.exit(report('m3-b', {
  B1_noOverturn40: A.S.nachher.overturns === 0 && B.S.nachher.overturns === 0 && A.S.nachher.rampRuns + B.S.nachher.rampRuns === 40,
  B2_noNoseStand10: A.S.nachher.noseFails === 0 && B.S.nachher.noseFails === 0,
  slopeNoHop: A.S.nachher.slopeAirSteps <= A.S.vorher.slopeAirSteps,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: { hz: 60, ...A.S }, B: { hz: 30, ...B.S }, errs: [...A.errs, ...B.errs].slice(0, 3) }))
