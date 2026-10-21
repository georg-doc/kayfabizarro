// Elan S1 · Gates der reinen Logik (research/DRAGONRIDING_RESEARCH_R1.md §6.10), ohne Browser. Welt: flacher Boden y = 0, keine Wände, g 9,81, J 1.
//   G1 Energie   c1 = c2 = 0, keine Fähigkeiten: 10 s Tauchen (−30°) und Abfangen (+20°) – E = ½s² + g·h bleibt in ±1 %
//   G2 Sturz     aus sCruise (22 m/s) mit 60° nach unten: sThrill nach ≤ 3 s, sDive (≥ 97 %) nach ≤ 6 s, nie über sDive (+1 %) ohne Fähigkeit
//   G3 Abfangen  aus sDive mit 30° steigen bis sStall: Höhengewinn ≥ 60 % von s²/2g
//   G4 Unendlich „3 s tauchen (−20°), 2 s steigen (+30°), Schub bei c > 2“ gegen „flach gleiten“ (ohne Eingabe: Gleitwinkel ≈ 7°, sCruise §6.2), je 120 s
//                ab 80 m (§6.10 nennt keine Starthöhe): Skript hält die Starthöhe im Mittel (≥ 90 %) und landet nie, flaches Gleiten landet in ≤ 40 s
//   G5 Aufladen  bei s ≥ sThrill (ohne Widerstand gehalten) 4 s je Ladung, am Boden 3 s (± 1 Schritt)
//   G7 Komfort   FOV konstant 55°, Kick 0, Kamera-Rollen 0 – auch bei Schub, Rolle und Kurve
import { ELAN, createElan, elanStep, elanEnergy, elanSpeed, elanCamera } from '../src/m1/elan.js'
const DT = 1 / 60, env = { ground: () => 0, sweep: (p, d) => ({ delta: d, hit: false }) }, D = Math.PI / 180
const fly = (st, n, inp, opt) => { for (let i = 0; i < n; i++) elanStep(st, typeof inp === 'function' ? inp(i, st) : inp, DT, env, opt) }
const out = {}
{ const st = createElan({ pos: [0, 300, 0], speed: 22 }), opt = { noDrag: true, abilities: false }, E0 = elanEnergy(st); let dev = 0
  fly(st, 300, { mousePitch: -30 * D }, opt); dev = Math.max(dev, Math.abs(elanEnergy(st) / E0 - 1))
  for (let i = 0; i < 300; i++) { elanStep(st, { mousePitch: 20 * D }, DT, env, opt); dev = Math.max(dev, Math.abs(elanEnergy(st) / E0 - 1)) }
  out.G1 = { maxDevPct: +(dev * 100).toFixed(3), speedEnd: +elanSpeed(st).toFixed(1) } }
{ const st = createElan({ pos: [0, 2000, 0], speed: 22 }); let tThrill = null, tDive = null, maxS = 0
  for (let i = 0; i < 600; i++) { elanStep(st, { mousePitch: -60 * D }, DT, env); const s = elanSpeed(st), t = (i + 1) * DT; maxS = Math.max(maxS, s)
    if (tThrill == null && s >= ELAN.sThrill) tThrill = t; if (tDive == null && s >= 0.97 * ELAN.sDive) tDive = t }
  out.G2 = { tThrill: tThrill && +tThrill.toFixed(2), tDive: tDive && +tDive.toFixed(2), maxS: +maxS.toFixed(1) } }
{ const st = createElan({ pos: [0, 100, 0], speed: ELAN.sDive }), h0 = st.pos[1], s0 = elanSpeed(st); let t = 0
  while (elanSpeed(st) > ELAN.sStall && t < 30) { elanStep(st, { mousePitch: 30 * D }, DT, env); t += DT }
  out.G3 = { gain: +(st.pos[1] - h0).toFixed(1), ideal: +((s0 * s0) / (2 * st.g)).toFixed(1), share: +((st.pos[1] - h0) / ((s0 * s0) / (2 * st.g))).toFixed(3), seconds: +t.toFixed(2) } }
{ const a = createElan({ pos: [0, 80, 0], speed: 22 }); let sum = 0, n = 0, minH = 1e9
  for (let i = 0; i < 7200; i++) { const ph = (i * DT) % 5; elanStep(a, { mousePitch: ph < 3 ? -20 * D : 30 * D, shift: a.charges > 2 && ph > 3 && ph < 3.05 }, DT, env); sum += a.pos[1]; n++; minH = Math.min(minH, a.pos[1]) }
  const b = createElan({ pos: [0, 80, 0], speed: 22 }); let land = null
  for (let i = 0; i < 7200 && land == null; i++) { elanStep(b, {}, DT, env); if (b.grounded) land = (i + 1) * DT }
  out.G4 = { scriptMeanH: +(sum / n).toFixed(1), scriptMinH: +minH.toFixed(1), flatLandsAfter: land && +land.toFixed(1) } }
{ const st = createElan({ pos: [0, 500, 0], speed: 45 }); st.charges = 0; const got = []
  for (let i = 0; i < 60 * 20; i++) { elanStep(st, { mousePitch: 0 }, DT, env, { noDrag: true }); st.v = st.v.map((x) => x * 45 / elanSpeed(st)); st.v[1] = 0; if (st.events.some((e) => e.type === 'charge')) got.push((i + 1) * DT) }
  const g = createElan({ pos: [0, 0, 0], speed: 0 }); g.charges = 0; const gg = []
  for (let i = 0; i < 60 * 12; i++) { elanStep(g, {}, DT, env); if (g.events.some((e) => e.type === 'charge')) gg.push((i + 1) * DT) }
  const iv = (a) => a.slice(1).map((t, i) => +(t - a[i]).toFixed(2))
  out.G5 = { thrillIntervals: iv(got), groundIntervals: iv(gg), firstThrill: got[0] && +got[0].toFixed(2), firstGround: gg[0] && +gg[0].toFixed(2) } }
{ const st = createElan({ pos: [0, 200, 0], speed: 50 }); const f = []
  for (let i = 0; i < 300; i++) { elanStep(st, { left: i > 30, shift: i === 60, space: i === 120, right: i === 124 }, DT, env); const c = elanCamera(st, { comfort: true }); f.push(c) }
  const n = createElan({ pos: [0, 200, 0], speed: 50 }); let maxFov = 0, maxRoll = 0
  for (let i = 0; i < 300; i++) { elanStep(n, { left: i > 30, shift: i === 60 }, DT, env); const c = elanCamera(n); maxFov = Math.max(maxFov, c.fov); maxRoll = Math.max(maxRoll, Math.abs(c.roll)) }
  out.G7 = { comfortFov: [...new Set(f.map((c) => c.fov))], comfortRoll: Math.max(...f.map((c) => Math.abs(c.roll))), normalMaxFov: +maxFov.toFixed(1), normalMaxRollDeg: +(maxRoll / D).toFixed(1) } }
const near = (a, want, tol) => a.length > 0 && a.every((x) => Math.abs(x - want) <= tol)
const checks = {
  G1_energy: out.G1.maxDevPct <= 1,
  G2_dive: out.G2.tThrill != null && out.G2.tThrill <= 3 && out.G2.tDive != null && out.G2.tDive <= 6 && out.G2.maxS <= ELAN.sDive * 1.01,
  G3_pullUp: out.G3.share >= 0.6,
  G4_endless: out.G4.scriptMeanH >= 0.9 * 80 && out.G4.scriptMinH > 0 && out.G4.flatLandsAfter != null && out.G4.flatLandsAfter <= 40,
  G5_regen: near(out.G5.thrillIntervals, 4, DT * 1.5) && near(out.G5.groundIntervals, 3, DT * 1.5),
  G7_comfort: out.G7.comfortFov.length === 1 && out.G7.comfortFov[0] === 55 && out.G7.comfortRoll === 0,
}
console.log(JSON.stringify({ ...out, checks }))
const fail = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
console.log(fail.length ? 'FAIL elan-logic: ' + fail.join(', ') : 'PASS elan-logic'); process.exit(fail.length ? 1 : 0)
