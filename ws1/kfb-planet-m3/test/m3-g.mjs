// M3 · Stufe G (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379, optional): Tricks ohne eigenen Stunt-Modus. Je Bildrate 10 Fassrollen (Sprung, in der Luft Leertaste + A/D) und
// 10 Zwei-Rad-Fahrten (X + A/D), zusammen je 20, auf dem Platz hinter dem Theater mit Gas; während des Tricks wird gelenkt.
//   G-G  jeder Trick endet auf den Rädern (Karosserie oben·Y > 0,95, 2,6 s nach dem Auslösen; Zwei-Rad: Kippung danach < 3°); Lenkung bleibt aktiv
//        (Gierung ändert sich während des Tricks um > 10° bei gehaltener Lenkung); Fassrolle: Lab-Ablauf mit Aufsetzen und Schlingern als Erholung
import { openPage, report } from './_page.mjs'
import { J } from '../src/m3/stuntData.js'

const PLAN = Array.from({ length: 20 }, (_, k) => ({ kind: k < 10 ? 'tumble' : 'twoWheel', side: k % 2 ? 'leftward' : 'rightward', x: -6 * J, z: (-16 - (k % 5) * 1.4) * J }))
async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ PLAN }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, T = M2.tricks
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const out = []
    for (const j of PLAN) { M.input(null); M2.setKind('k2b', { p: [j.x, (M.terrainH(j.x, j.z) ?? 0) + 0.5 * K, j.z], yaw: Math.PI / 2 }); await steps(4); while (!M2.car()) await steps(1); await steps(20)
      const t0 = { touch: T.touchdowns, rec: T.recovers }
      const r = await new Promise((done) => { let i = 0, at = -1, yawAt = null, yawMid = null, maxLean = 0, minUp = 1, phases = new Set(); C.onStep = () => { const c = M2.car(); if (!c) return; const st = c.state()
        const hop = j.kind === 'tumble' && i >= 50 && i < 54, trig = i >= 60 && i < 64, steer = i >= 64 && i < 64 + 60 /* Fassrolle: erst springen, dann in der Luft Leertaste + A/D */
        M.input({ forward: true, [j.side]: trig || steer, jump: hop || (trig && j.kind === 'tumble'), descend: trig && j.kind === 'twoWheel' })
        if (at < 0 && st.tricks > 0) { at = i; yawAt = c.yaw() } if (at >= 0 && i === at + 50) yawMid = c.yaw()
        if (at >= 0) { maxLean = Math.max(maxLean, Math.abs(st.lean)); minUp = Math.min(minUp, T.bodyUpY?.() ?? 1); if (T.tumble?.phase) phases.add(T.tumble.phase) }
        if (++i >= 64 + 160) { C.onStep = null; M.input(null); done({ at, dYaw: yawAt != null && yawMid != null ? Math.abs(Math.atan2(Math.sin(yawMid - yawAt), Math.cos(yawMid - yawAt))) * 57.3 : 0, maxLeanDeg: maxLean * 57.3, minUp, phases: [...phases], upEnd: T.bodyUpY?.() ?? null, leanEnd: Math.abs(M2.car().state().lean) * 57.3 }) } } })
      out.push({ kind: j.kind, ...r, touch: T.touchdowns - t0.touch, rec: T.recovers - t0.rec }) }
    return out
  }, { PLAN })
  await browser.close()
  const ok = (x) => x.at >= 0 && x.upEnd > 0.95 && x.dYaw > 10 && (x.kind === 'tumble' ? x.minUp < -0.5 && x.touch >= 1 && x.rec >= 1 : x.maxLeanDeg > 30 && x.leanEnd < 3)
  return { hz, n: res.length, ok: res.filter(ok).length, res: res.map((x) => ({ ...x, minUp: +x.minUp.toFixed(2), upEnd: +(x.upEnd ?? 0).toFixed(3), dYaw: +x.dYaw.toFixed(0), maxLeanDeg: +x.maxLeanDeg.toFixed(0), leanEnd: +x.leanEnd.toFixed(1) })), errs }
}
const A = await pass(60), B = await pass(30)
process.exit(report('m3-g', {
  G_allOnWheels20: A.ok === 20 && B.ok === 20,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: { ok: A.ok, res: A.res }, B: { ok: B.ok, res: B.res }, errs: [...A.errs, ...B.errs].slice(0, 3) }))
