// M3 · Stufe F (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): Rampen- und Wandzonen. 60 fps voll, 30 fps die Hälfte (Browser-Zeit; im Protokoll).
//   Launch  10 Anläufe auf flach/steil (P2-Fälle mittig, seitlich 1,5 m, falscher Winkel 0,5 rad, langsam, Boost): Launch-Ereignis, Landung auf den
//           Rädern (oben·Y > 0,9) in Fahrtrichtung (Gier gegen Bewegungsrichtung ≤ 15°), kein T3
//   Wand    10 flache Anfahrten an die markierte Fläche von block-b: Einfangen → entlang (≥ 0,8 s) → Freigabe (Haltezeit oder Wandende), Lage 2,5 s danach zurück (< 3°)
//   Abbruch 10 dieselben Anfahrten, nach dem Einfangen von der Wand weg lenken: Freigabe „abort“ binnen 0,6 s
//   Fehl    20 flache Anfahrten an unmarkierte Wände (block-a, ecke-2): 0 × Einfangen
import { openPage, report } from './_page.mjs'
import { STUNT, wallBox, J } from '../src/m3/stuntData.js'

const W = Object.fromEntries(STUNT.walls.map((b) => [b.id, wallBox(b)])), R = Object.fromEntries(STUNT.ramps.map((r) => [r.id, r]))
// flache Anfahrt an die +X-Fläche eines Quaders: Start 5 m seitlich, 12 m davor in +Z, Ziel 2 m vor dem Flächenende
const graze = (q, k) => { const fx = q.c[0] + q.h[0], z1 = Math.max(q.c[2] - q.h[2] + 2 * J, q.c[2] + q.h[2] - 8 * J), /* früh an die Wand: 8 m nach ihrem Anfang */ x0 = fx + (5 + (k % 3) * 0.6) * J, z0 = q.c[2] + q.h[2] + (6 + (k % 2) * 2) * J
  return { x: x0, z: z0, yaw: Math.atan2(fx - x0, z1 - z0) } }
const LAUNCH = []; ['flach', 'steil'].forEach((id) => { const r = R[id]; [[0, 0, 16, false], [1.5, 0, 16, false], [-0.8, 0.5, 16, false], [0, 0, 7, false], [0, 0, 22, true]].forEach(([e, ang, run, boost]) =>
  LAUNCH.push({ id, x: (r.x + e) * J, z: (r.z + run) * J, yaw: Math.PI + ang, boost, dir: r.yaw })) })
const WALL = Array.from({ length: 10 }, (_, k) => graze(W['block-b'], k))
const FALSE = Array.from({ length: 20 }, (_, k) => ({ ...graze(W[['block-a', 'ecke-2'][k % 2]], k), wall: ['block-a', 'ecke-2'][k % 2] }))

async function pass(hz, frac) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const cut = (a) => a.slice(0, Math.ceil(a.length * frac))
  const res = await page.evaluate(async ({ LAUNCH, WALL, FALSE }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x))
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const place = async (j) => { M.input(null); M2.setKind('k2b', { p: [j.x, (M.terrainH(j.x, j.z) ?? 0) + 0.3 * K, j.z], yaw: j.yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(8) }
    const run = (n, inp, each) => new Promise((done) => { let i = 0; C.onStep = () => { const c = M2.car(); if (!c) return; M.input(inp(i, c)); each?.(i, c); if (++i >= n) { C.onStep = null; M.input(null); done() } } })
    const out = { launch: [], wall: [], abort: [], false: [] }
    for (const j of LAUNCH) { await place(j); let landed = null, wasAir = false, air = 0, prev = null, vel = null
      await run(380, () => ({ forward: true, run: j.boost }), (i, c) => { const st = c.state(), p = c.pos(); if (prev) vel = [p.x - prev.x, p.z - prev.z]; prev = { ...p }
        if (st.air && i > 20) { wasAir = true; air++ } else if (wasAir && air > 10 && !landed && vel) landed = { i, upY: c.attitude().upY }
        if (landed && i === landed.i + 18 && vel) landed.yawErr = Math.abs(wrap(c.yaw() - Math.atan2(vel[0], vel[1]))) * 57.3 }) /* Fahrtrichtung = Bewegungsrichtung, 0,3 s nach dem Aufsetzen (wie G-C1) */
      const st = M2.car().state(); await steps(20); out.launch.push({ id: j.id, launches: st.launches, landed, upAfter: M2.car().attitude().upY, t3: st.t3 }) }
    for (const [key, list, abort] of [['wall', WALL, false], ['abort', WALL, true], ['false', FALSE, false]]) for (const j of list) { await place(j); let capAt = -1, relAt = -1, maxRide = 0
      await run(200, (i, c) => { const st = c.state(); const away = abort && capAt >= 0 && st.riding ? (st.lean < 0 ? { leftward: true } : { rightward: true }) : {}; return { forward: true, ...away } },
        (i, c) => { const st = c.state(); if (st.riding && capAt < 0) capAt = i; if (capAt >= 0 && !st.riding && relAt < 0) relAt = i; if (st.riding) maxRide++ })
      const st = M2.car().state(); await steps(150); out[key].push({ wall: j.wall || 'block-b', rides: st.rides, rideS: +(maxRide / 60).toFixed(2), capAt, relAt, relS: relAt > 0 ? +((relAt - capAt) / 60).toFixed(2) : null, why: st.rideLast?.why ?? null, leanAfterDeg: +(Math.abs(M2.car().state().lean) * 57.3).toFixed(1) }) }
    return out
  }, { LAUNCH: cut(LAUNCH), WALL: cut(WALL), FALSE: cut(FALSE) })
  await browser.close()
  const L = res.launch, okL = L.filter((x) => x.launches > 0 && x.landed && x.landed.upY > 0.9 && x.landed.yawErr <= 15 && x.upAfter > 0.9 && !x.t3)
  const okW = res.wall.filter((x) => x.rides >= 1 && x.rideS >= 0.8 && x.relAt > 0 && ['hold', 'end'].includes(x.why) && x.leanAfterDeg < 3)
  const okA = res.abort.filter((x) => x.rides >= 1 && x.why === 'abort' && x.relS != null && x.relS <= 0.6)
  return { hz, n: { launch: L.length, wall: res.wall.length, abort: res.abort.length, false: res.false.length }, ok: { launch: okL.length, wall: okW.length, abort: okA.length, falseCaptures: res.false.filter((x) => x.rides > 0).length }, res, errs }
}
const A = await pass(60, 1), B = await pass(30, 0.5)
const all = (k) => A.ok[k] === A.n[k] && B.ok[k] === B.n[k]
process.exit(report('m3-f', {
  F_launch10of10: all('launch') && A.n.launch === 10,
  F_wall10of10: all('wall') && A.n.wall === 10,
  F_abort10of10: all('abort') && A.n.abort === 10,
  F_noFalseCapture20: A.ok.falseCaptures === 0 && B.ok.falseCaptures === 0 && A.n.false === 20,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: { n: A.n, ok: A.ok, res: A.res }, B: { n: B.n, ok: B.ok }, errs: [...A.errs, ...B.errs].slice(0, 3) }))
