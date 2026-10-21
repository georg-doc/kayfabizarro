// Elan S2 · Profil „racer“ (research/DRAGONRIDING_RESEARCH_R1.md §6.5, WS1-Entscheid 18.10.), reine Logik ohne Browser. Welt: flacher Boden y = 0, g 9,81.
//   R1 Kessel      Boost gehalten aus P = 1: leer nach 4 s (± 1 Schritt), dann „kocht“ 1,5 s ohne Boost; Füllen 0,08/s, mit Thrill 0,15/s, bodennah 0,2/s
//   R2 Schwebefeder aus 2·h0 ohne Sinken: tiefster Punkt ≥ 0,85·h0 (Überschwingen ≤ 15 %), nach 1,5 s in ± 5 % um h0
//   R3 Bodeneffekt ohne Schub: nach 3 s in h0-Höhe mehr Tempo als in 20 m Höhe
//   R4 Gleiten     ohne Schub aus 80 m landet der Racer früher als die Figur (Rumpf gleitet schlechter, §6.5: ohne Schub Gleitlage −12° statt −7°)
//   R5 Dauerschub  W, Nase waagrecht, 100 m Höhe: Tempo ≥ 40 m/s nach 30 s, Höhe ± 5 m
//   R6 Landung     Sinkflug auf ebenen Boden: genau ein Ereignis land, bei h < 1,2·h0 und vy ≤ 0
//   R7 Ladungen    Shift kostet keine Ladung (Boost aus dem Kessel), Leertaste kostet eine
//   R8 Kurs        Ringkurs × 1,4 (RACER_COURSE_SCALE) mit dem Autopiloten aus elan-course (Kurs nach Flugrichtung statt Nase – kAlign × 0,5 lässt die Bahn nachhängen –, plus Schub nur bei Kurs < 0,5 rad Abweichung, Luftbremse ab 1 rad, Boost auf langen Geraden) fliegbar, 10/10 in ≤ 120 s
import { RACER, ELAN, createElan, elanStep, elanSpeed } from '../src/m1/elan.js'
import { makeCourse, createRun, stepRun, RACER_COURSE_SCALE } from '../src/m1/elanCourse.js'
import { terrainHeight } from '../src/modules/m1-terrain.js'
const DT = 1 / 60, flat = { ground: () => 0, sweep: (p, d) => ({ delta: d, hit: false }) }, D = Math.PI / 180
const racer = (o) => createElan({ profile: 'racer', ...o }), out = {}
{ const st = racer({ pos: [0, 200, 0], speed: 30 }); let empty = null, boilEnd = null, boostDuringBoil = false
  for (let i = 0; i < 60 * 8; i++) { const t = (i + 1) * DT; elanStep(st, { boost: true, thrust: true, mousePitch: 0 }, DT, flat); if (empty == null && st.events.some((e) => e.type === 'boil')) empty = t; if (empty != null && st.boilT > 0 && st.boosting) boostDuringBoil = true; if (empty != null && boilEnd == null && st.boilT <= 0) boilEnd = t }
  const fillRate = (spd, h, pre) => { const r = racer({ pos: [0, h, 0], speed: spd }); r.P = 0; for (let i = 0; i < pre; i++) { elanStep(r, { thrust: true, mousePitch: 0 }, DT, flat, { noDrag: true }); r.v[1] = 0; r.pos[1] = h } const p0 = r.P
    for (let i = 0; i < 120; i++) { elanStep(r, { thrust: true, mousePitch: 0 }, DT, flat, { noDrag: true }); r.v[1] = 0; r.pos[1] = h } return +((r.P - p0) / 2).toFixed(3) }
  out.R1 = { emptyAfter: empty && +empty.toFixed(3), boilS: boilEnd && +(boilEnd - empty).toFixed(3), boostDuringBoil, fillBase: fillRate(20, 100, 0), fillThrill: fillRate(45, 100, 40), fillSkim: fillRate(25, 2, 0) } }
{ const h0 = RACER.h0, st = racer({ pos: [0, 2 * h0, 0], speed: 30 }); let minH = 1e9, h15 = null
  for (let i = 0; i < 120; i++) { elanStep(st, { thrust: true, mousePitch: 0 }, DT, flat); minH = Math.min(minH, st.pos[1]); if (i === 89) h15 = st.pos[1] }
  out.R2 = { h0, minH: +minH.toFixed(3), h15: +h15.toFixed(3) } }
{ const low = racer({ pos: [0, RACER.h0, 0], speed: 40 }), high = racer({ pos: [0, 20, 0], speed: 40 })
  for (let i = 0; i < 180; i++) { elanStep(low, { mousePitch: 0 }, DT, flat); elanStep(high, { mousePitch: 0 }, DT, flat); high.pos[1] = 20; high.v[1] = 0 }
  out.R3 = { low: +elanSpeed(low).toFixed(2), high: +elanSpeed(high).toFixed(2) } }
{ const land = (o) => { const st = createElan({ pos: [0, 80, 0], speed: 22, ...o }); for (let i = 0; i < 60 * 120; i++) { elanStep(st, {}, DT, flat); if (st.grounded || st.landed) return +((i + 1) * DT).toFixed(1) } return null }
  out.R4 = { figure: land({}), racer: land({ profile: 'racer' }) } }
{ const st = racer({ pos: [0, 100, 0], speed: 30 }); for (let i = 0; i < 60 * 30; i++) elanStep(st, { thrust: true, mousePitch: 0 }, DT, flat); out.R5 = { speed: +elanSpeed(st).toFixed(1), dh: +(st.pos[1] - 100).toFixed(2) } }
{ const st = racer({ pos: [0, 15, 0], speed: 25 }); let lands = 0, at = null; for (let i = 0; i < 60 * 20; i++) { elanStep(st, { mousePitch: -10 * D }, DT, flat); for (const e of st.events) if (e.type === 'land') { lands++; at = { h: +st.h.toFixed(3), vy: +st.v[1].toFixed(2) } } }
  out.R6 = { lands, at } }
{ const st = racer({ pos: [0, 200, 0], speed: 30 }), c0 = st.charges; elanStep(st, { boost: true }, DT, flat); for (let i = 0; i < 30; i++) elanStep(st, {}, DT, flat); const c1 = st.charges
  elanStep(st, { space: true }, DT, flat); for (let i = 0; i < 15; i++) elanStep(st, {}, DT, flat); out.R7 = { afterShift: c0 - c1, afterSpace: c1 - st.charges } }
{ const course = makeCourse(terrainHeight, 1, RACER_COURSE_SCALE), run = createRun(course), r0 = course.rings[0]
  const st = racer({ pos: [r0.pos[0] - r0.normal[0] * 50, r0.pos[1] + 6, r0.pos[2] - r0.normal[2] * 50], yaw: Math.atan2(r0.normal[0], r0.normal[2]), speed: 35 }); let t = 0
  const trace = []; const env = { ground: (x, z) => terrainHeight(x, z), sweep: (p, d) => ({ delta: d, hit: false }) }
  while (!run.done && t < 120) { const tg = course.rings[Math.min(run.next, 9)].pos, d = [tg[0] - st.pos[0], tg[1] - st.pos[1], tg[2] - st.pos[2]], hd = Math.hypot(d[0], d[2])
    const vh = Math.atan2(st.v[0], st.v[2]), w = Math.atan2(d[0], d[2]), dy = Math.atan2(Math.sin(w - vh), Math.cos(w - vh)), lead = Math.atan2(Math.sin(st.yaw - vh), Math.cos(st.yaw - vh)), steer = dy - 0.6 * lead
    const a = [...st.pos]; elanStep(st, { thrust: Math.abs(dy) < 0.5, airBrake: Math.abs(dy) > 1.0 && elanSpeed(st) > 30, boost: Math.abs(dy) < 0.1 && hd > 60, mousePitch: Math.max(-0.7, Math.min(0.6, Math.atan2(d[1], hd))), left: steer > 0.03, right: steer < -0.03, space: d[1] > 6 && st.charges > 1 && (t % 1) < DT }, DT, env)
    stepRun(run, a, st.pos, DT); t += DT; if (Math.abs(t % 2) < DT) trace.push([+t.toFixed(0), run.next, +elanSpeed(st).toFixed(0), +(st.pos[1] - terrainHeight(st.pos[0], st.pos[2])).toFixed(0), +st.P.toFixed(2)]) }
  out.R8 = { done: run.done, rings: run.passes.length, time: run.last && +run.last.toFixed(1), scale: RACER_COURSE_SCALE }; if (process.env.TRACE) console.log(JSON.stringify(trace)) }
const near = (x, want, tol) => x != null && Math.abs(x - want) <= tol
const checks = {
  R1_boiler: near(out.R1.emptyAfter, 4, DT * 1.5) && near(out.R1.boilS, RACER.boilS, DT * 1.5) && !out.R1.boostDuringBoil && near(out.R1.fillBase, RACER.fill, 0.01) && near(out.R1.fillThrill, RACER.fillThrill, 0.01) && near(out.R1.fillSkim, RACER.fillSkim, 0.01),
  R2_hoverSpring: out.R2.minH >= 0.85 * out.R2.h0 && Math.abs(out.R2.h15 - out.R2.h0) <= 0.05 * out.R2.h0,
  R3_groundEffect: out.R3.low > out.R3.high,
  R4_glidesWorse: out.R4.racer != null && out.R4.figure != null && out.R4.racer < out.R4.figure,
  R5_thrustHolds: out.R5.speed >= 40 && Math.abs(out.R5.dh) <= 5,
  R6_landOnce: out.R6.lands === 1 && out.R6.at.h < RACER.landK * RACER.h0 && out.R6.at.vy <= 0,
  R7_charges: out.R7.afterShift === 0 && out.R7.afterSpace === 1,
  R8_course: out.R8.done && out.R8.rings === 10,
}
console.log(JSON.stringify({ ...out, checks }))
const fail = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
console.log(fail.length ? 'FAIL elan-racer: ' + fail.join(', ') : 'PASS elan-racer'); process.exit(fail.length ? 1 : 0)
