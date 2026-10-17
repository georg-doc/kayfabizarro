// M3 · Stufe C (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): Landehilfe in Fahrtrichtung. Je Bildrate 15 Drift-Sprünge (zusammen 30) auf dem Platz hinter
// dem Theater: 1,2 s Gas, dann Drift (Q/E) mit Lenken, im Drift Leertaste, in der Luft ein seitlicher Prüf-Stoß (latV 5/7/9 m/s alter Maße × K). In K2B
// folgt die Flugrichtung der Nase; Drift allein ergab beim Aufsetzen ≤ 2° (m3-c 17.10.) – der Stoß stellt die schräge Landung her, die die Hilfe fängt.
//   G-C1  Gierfehler (Nase gegen Bewegungsrichtung) 0,3 s nach dem Aufsetzen ≤ 10°; 0 Spin-Outs (Gierung dreht in 1 s nach der Landung > 90° oder
//         Tempo < 30 %); Tangentialtempo 0,3 s nach dem Aufsetzen ≥ 85 % des Tempos kurz davor
//   vorher (nur 60 fps) = LAND aus (grip 0, kein Boost) zum Vergleich
import { openPage, report } from './_page.mjs'
import { J } from '../src/m3/stuntData.js'

const PLAN = Array.from({ length: 15 }, (_, k) => ({ x: -6 * J, z: (-16 - (k % 5) * 1.4) * J, /* bis −21,6: −24 traf nach dem Stoß ein Hindernis (Rückwärts-Prall, kein Landefehler) */ side: k % 2 ? 'strafeL' : 'strafeR', steer: k % 2 ? 'leftward' : 'rightward', drift: [30, 40, 50][k % 3], kick: (k % 2 ? 1 : -1) * [5, 7, 9][k % 3] }))
async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ PLAN, modes }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, L0 = { ...M2.land }
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const out = {}
    for (const mode of modes) { Object.assign(M2.land, mode === 'nachher' ? L0 : { grip: 0, boostOn: false }); out[mode] = []
      for (const j of PLAN) { M.input(null); M2.setKind('k2b', { p: [j.x, (M.terrainH(j.x, j.z) ?? 0) + 0.5 * K, j.z], yaw: Math.PI / 2 }); await steps(4); while (!M2.car()) await steps(1); await steps(20)
        const a = await new Promise((done) => { const o = []; let i = 0, flew = false, airN = 0; C.onStep = () => { const c = M2.car(); if (!c) return; const st = c.state(), p = c.pos()
          const t0 = 70, t1 = t0 + j.drift; if (st.air && i > t0) { flew = true; if (++airN === 10) c.kick({ latV: j.kick * K }) } /* seitlicher Stoß in der Luft (Bodenwelle, schräger Absprung) */
          M.input({ forward: true, [j.side]: i >= t0 && i < t1 && !flew, [j.steer]: i >= t0 && i < t1 && !flew, jump: i >= t1 - 4 && i < t1 && !flew })
          o.push([p.x, p.z, c.yaw(), st.air ? 1 : 0]); if (++i >= 260) { C.onStep = null; M.input(null); done(o) } } })
        out[mode].push({ ...j, a }) }
      console.log(`[m3-c] ${mode} fertig, Schritt ${C.steps}`) }
    Object.assign(M2.land, L0); return out
  }, { PLAN, modes: hz === 60 ? ['vorher', 'nachher'] : ['nachher'] })
  await browser.close()
  const D = 180 / Math.PI, wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x))
  const S = {}
  for (const mode of Object.keys(res)) { const L = []
    for (const j of res[mode]) { const a = j.a, i0 = a.findIndex((q, k) => k > 60 && q[3] === 1); let i1 = -1; for (let k = i0 + 10; k > 0 && k < a.length; k++) if (a[k][3] === 0 && a[k - 1][3] === 1) { i1 = k; break }
      if (i0 < 0 || i1 < 0 || i1 + 60 >= a.length) { L.push({ landed: false, i0, i1 }); continue }
      const vel = (k) => [a[k + 1][0] - a[k - 1][0], a[k + 1][1] - a[k - 1][1]], spd = (k) => Math.hypot(...vel(k)) * 30
      const err = (k) => { const v = vel(k), y = a[k][2]; return Math.abs(wrap(Math.atan2(v[0], v[1]) - y)) * D }
      const k3 = i1 + 18, before = spd(i1 - 3), after = spd(k3), spin = Math.max(...a.slice(i1, i1 + 60).map((q) => Math.abs(wrap(q[2] - a[i1][2])))) * D
      L.push({ landed: true, errAtTouch: +err(i1 + 1).toFixed(1), err03: +err(k3).toFixed(1), keep: +(after / before).toFixed(2), spinDeg: +spin.toFixed(0), spinOut: spin > 90 || after < 0.3 * before }) }
    const ok = L.filter((x) => x.landed)
    S[mode] = { jumps: L.length, landed: ok.length, maxErrTouch: Math.max(...ok.map((x) => x.errAtTouch)), maxErr03: Math.max(...ok.map((x) => x.err03)), within10: ok.filter((x) => x.err03 <= 10).length, spinOuts: ok.filter((x) => x.spinOut).length, minKeep: Math.min(...ok.map((x) => x.keep)), list: L } }
  return { S, errs }
}
const A = await pass(60), B = await pass(30)
const n = A.S.nachher, m = B.S.nachher
process.exit(report('m3-c', {
  C1_landed30: n.landed + m.landed === 30,
  C1_realYawError: A.S.vorher.maxErrTouch >= 10, // ohne Hilfe setzen die Sprünge wirklich schräg auf (mit Hilfe ist der Fehler schon im ersten Schritt kleiner)
  C1_yawWithin10: n.within10 === n.landed && m.within10 === m.landed,
  C1_noSpinOut: n.spinOuts === 0 && m.spinOuts === 0,
  C1_keepTangential85: n.minKeep >= 0.85 && m.minKeep >= 0.85,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: A.S, B: B.S, errs: [...A.errs, ...B.errs].slice(0, 3) }))
