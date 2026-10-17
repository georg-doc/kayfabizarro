// M3 · Stufe A (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): fester Schritt unter K2B. Je Bildrate einmal: replay (60 Bilder/s, ein Schritt je Bild) und
// replay=30 (zwei Schritte je Bild = gedrosselt auf 30 fps). Die Physik läuft in beiden mit festen 1/60-s-Schritten; die Wandprüfung ist ein
// Shape-Cast über den ganzen Schritt (kein Durchtunneln per Bau) – geprüft wird, dass das auch bei Vollgas + Boost hält.
//   G-A1  50 Anfahrten je Bildrate mit Vollgas + Boost aus 20 m auf die Gebäude des Testfelds (Fächer ±70° je Gebäude, je 12 Richtungen, freie Startpunkte): 0 Durchfahrten
//         (Automitte im Gebäude-Grundriss unterhalb des Dachs, im Zaun der Ränge oder > 0,5 m unter dem Gelände)
//   G-A2  Sprungweite über die Rampe „steil“ (aus 8 m Anlauf, Vollgas): Abweichung 30 gegen 60 fps ≤ 3 %
//   fps   Bilder je Sekunde des Test-Browsers im Protokoll (headless ≈ 8 – Takt ist per replay bildunabhängig; die Bildrate auf echter GPU misst bench)
// G-A3 (Regression M2: Wende, Überschläge, Neigung) misst scripts/m2/turn-circle.mjs ohne Browser.
import { openPage, report } from './_page.mjs'
import { inRankFence } from '../src/m1/m1Host.js'
import { STUNT, wallBox, inWall } from '../src/m3/stuntData.js'
import { K } from '../src/m1/m1Scale.js'

const runs = []
STUNT.walls.forEach((b, wi) => { const q = wallBox(b), base = Math.atan2(20 * K - q.c[0], 0 - q.c[2]) // Richtung vom Gebäude zum Platz
  for (let i = 0; i < 12; i++) { const a = base + ((i - 5.5) / 5.5) * ((70 * Math.PI) / 180), r = 20 * K + Math.max(q.h[0], q.h[2]), x = q.c[0] + Math.sin(a) * r, z = q.c[2] + Math.cos(a) * r
    if (!inWall(x, z, -3 * K) && !inRankFence(x, z)) runs.push({ wall: b.id, x, z, yaw: Math.atan2(q.c[0] - x, q.c[2] - z) }) } })
const RUNS = runs.slice(0, 50)

async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ RUNS, steil }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const place = async (x, z, yaw) => { M.input(null); M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(12) }
    // Fahrt bis n Schritte, bei untilHit höchstens 25 Schritte nach dem ersten Wandstoß (Anfahrten: der Stoß ist das Ereignis, danach nur noch Abprall)
    const drive = (n, inp, untilHit) => new Promise((done) => { const path = []; let i = 0, hitAt = -1; M.input(inp); C.onStep = () => { const c = M2.car(); if (!c) return; const p = c.pos(), st = c.state(); path.push([p.x, p.y, p.z, M.terrainH(p.x, p.z) ?? -99, st.air ? 1 : 0]); if (hitAt < 0 && st.hits > 0) hitAt = i; if (++i >= n || (untilHit && hitAt >= 0 && i - hitAt >= 25)) { C.onStep = null; M.input(null); done(path) } } })
    const t0 = performance.now(), f0 = C.frame, out = { runs: [] }
    for (const r of RUNS) { await place(r.x, r.z, r.yaw); const path = await drive(150, { forward: true, run: true }, true); { const st = M2.car().state(); out.runs.push({ wall: r.wall, start: [r.x, r.z, r.yaw], path, hits: st.hits, t1: st.t1, t3: st.t3, rides: st.rides }) } if (out.runs.length % 10 === 0) console.log(`[m3-a] ${out.runs.length}/50 Schritt ${C.steps}`) }
    // Sprungweite: Anlauf 16 m vor dem Rampenfuß, Vollgas bis zur Landung; Absprung = erster Luft-Schritt, Landung = erster Boden-Schritt danach
    await place(steil.x, steil.z + 8 * K, Math.PI); const jp = await drive(420, { forward: true }) // 8 m Anlauf: Flug landet noch auf dem Platz/Hang
    const i0 = jp.findIndex((p, k) => k > 20 && p[4] === 1), i1 = jp.findIndex((p, k) => k > i0 && p[4] === 0) // ab Schritt 20: das Absetzen ist kein Absprung
    out.jump = i0 > 0 && i1 > 0 ? { from: jp[i0].slice(0, 3), to: jp[i1].slice(0, 3), air: i1 - i0, dist: Math.hypot(jp[i1][0] - jp[i0][0], jp[i1][2] - jp[i0][2]) } : null
    out.jumpDiag = { airSteps: jp.filter((p) => p[4]).length, maxY: Math.max(...jp.map((p) => p[1])), end: jp.at(-1).slice(0, 3), launches: M2.car().state().launches, t3: M2.car().state().t3 }
    out.fps = +((C.frame - f0) / ((performance.now() - t0) / 1000)).toFixed(1)
    return out
  }, { RUNS, steil: STUNT.ramps.find((r) => r.id === 'steil') })
  await browser.close()
  const bad = res.runs.filter((r) => r.path.some(([x, y, z, h]) => inWall(x, z, 0, y) || inRankFence(x, z) || y < h - 0.5 * K))
  // Dach-Fahrten zur Kontrolle (Automitte über einem Gebäude-Grundriss, auch auf dem Dach): Verlauf der letzten 60 Schritte davor
  const roofRuns = res.runs.filter((r) => r.path.some(([x, y, z]) => inWall(x, z))).map((r) => { const k = r.path.findIndex(([x, y, z]) => inWall(x, z))
    return { wall: r.wall, start: r.start.map((v) => +v.toFixed(2)), trace: r.path.slice(Math.max(0, k - 60), k + 2).filter((_, i) => i % 5 === 0).map((p) => p.map((v) => +v.toFixed(2))) } })
  return { hz, fps: res.fps, jumpDiag: res.jumpDiag, roofRuns, runs: res.runs.length, crossings: bad.length, bad: bad.map((r) => ({ wall: r.wall, start: r.start.map((v) => +v.toFixed(2)), t1: r.t1, t3: r.t3, at: r.path.find(([x, y, z, h]) => inWall(x, z, 0, y) || inRankFence(x, z) || y < h - 0.5 * K)?.map((v) => +v.toFixed(2)) })), hitRuns: res.runs.filter((r) => r.hits > 0).length, jump: res.jump && { ...res.jump, dist: +res.jump.dist.toFixed(2) }, errs }
}
const A = await pass(60), B = await pass(30)
const dev = A.jump && B.jump ? Math.abs(A.jump.dist - B.jump.dist) / A.jump.dist : null
process.exit(report('m3-a', {
  A1_noTunnel60: A.runs === 50 && A.crossings === 0,
  A1_noTunnel30: B.runs === 50 && B.crossings === 0,
  A1_wallsHit: A.hitRuns >= 45 && B.hitRuns >= 45, // die Anfahrten treffen wirklich eine Wand
  A2_jumpFpsIndependent: dev != null && dev <= 0.03 && A.jump.dist > 5 * K,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { runsPlanned: runs.length, A: { ...A, errs: A.errs.slice(0, 2) }, B: { ...B, errs: B.errs.slice(0, 2) }, jumpDeviation: dev != null ? +(dev * 100).toFixed(2) + ' %' : null }))
