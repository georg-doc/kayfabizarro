// M3 · Stufe E (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): Deformer v2 + Abprallen an Gebäuden. Je Bildrate 15 Aufpralle (zusammen 30) aus 10–22 m
// mit Vollgas auf die Gebäude des Testfelds, Winkel gefächert.
//   G-E1  railImpact-Ereignis bei 30/30 Aufprallen über der Schwelle (≥ 8 m/s); der Deformer antwortet (readout.impactWeight > 0,2 binnen 10 Schritten);
//         Kollider-Lage unverändert = Starrkörper-Lage gleich der K2B-Lage (≤ 1 mm, je Schritt); kein Stillstand: höchstens 0,5 s unter 1 m/s nach dem Stoß
import { openPage, report } from './_page.mjs'
import { STUNT, wallBox, J } from '../src/m3/stuntData.js'
import { K } from '../src/m1/m1Scale.js'

const PLAN = []
// nur unmarkierte Wände: an block-b (ride) fängt die Wandfahrt flache Anfahrten ein, dort gibt es absichtlich keinen Prall
STUNT.walls.filter((b) => !b.id.startsWith('gasse') && !b.ride).forEach((b) => { const q = wallBox(b)
  for (let i = 0; i < 5; i++) { const a = Math.atan2(20 * K - q.c[0], -q.c[2]) + (i - 2) * 0.4, r = (10 + i * 3) * K + Math.max(q.h[0], q.h[2])
    PLAN.push({ wall: b.id, x: q.c[0] + Math.sin(a) * r, z: q.c[2] + Math.cos(a) * r, yaw: a + Math.PI }) } })
async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ PLAN }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const out = []
    for (const j of PLAN.slice(0, 15)) { M.input(null); M2.setKind('k2b', { p: [j.x, (M.terrainH(j.x, j.z) ?? 0) + 0.3 * K, j.z], yaw: j.yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(8)
      const r = await new Promise((done) => { let i = 0, lastP = null, ev = null, evAt = -1, resp = 0, poseErr = 0, slow = 0, slowMax = 0; const off = M2.events.on('railImpact', (e) => { if (!ev && e.speed >= 8 * K) { ev = e; evAt = i } })
        M.input({ forward: true }); C.onStep = () => { const c = M2.car(); if (!c) return; const p = c.pos(), b = c.body()?.translation(); if (b && lastP) poseErr = Math.max(poseErr, Math.hypot(b.x - lastP.x, b.y - lastP.y, b.z - lastP.z)); lastP = { ...p } // Starrkörper = K2B-Lage des vorigen Schritts (Rapier schreitet zuerst)
          if (evAt >= 0 && i - evAt <= 10) resp = Math.max(resp, M2.deform.last?.impactWeight ?? 0)
          if (evAt >= 0) { slow = c.speed() < 1 * K ? slow + 1 : 0; slowMax = Math.max(slowMax, slow) }
          if (++i >= 200 || (evAt >= 0 && i - evAt >= 60)) { C.onStep = null; M.input(null); off(); done({ event: !!ev, speed: ev ? +ev.speed.toFixed(1) : null, frontal: ev?.frontal ?? null, resp: +resp.toFixed(2), poseErrMm: +(poseErr * 1000).toFixed(2), stillSteps: slowMax }) } } })
      out.push({ wall: j.wall, ...r }) }
    return out
  }, { PLAN })
  await browser.close()
  return { runs: res, events: res.filter((x) => x.event).length, responded: res.filter((x) => x.resp > 0.2).length, maxPoseMm: Math.max(...res.map((x) => x.poseErrMm)), maxStillS: +(Math.max(...res.map((x) => x.stillSteps)) / 60).toFixed(2), errs }
}
const A = await pass(60), B = await pass(30)
process.exit(report('m3-e', {
  E1_event30of30: A.events + B.events === 30,
  E1_deformerResponds: A.responded === A.events && B.responded === B.events,
  E1_colliderPoseUnchanged: A.maxPoseMm <= 1 && B.maxPoseMm <= 1,
  E1_noStandstill: A.maxStillS <= 0.5 && B.maxStillS <= 0.5,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: { ...A, errs: undefined }, B: { ...B, errs: undefined }, errs: [...A.errs, ...B.errs].slice(0, 3) }))
