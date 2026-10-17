// M1 · Abnahme 1 + 2 (Briefing BRIEF_WS1_M1_BEWEGUNG_R1). Replay mit festem Takt (#m1,debug,replay; Varianten M1_HZ=120|30): ein Logik-Durchlauf je
// Physik-Schritt, live wie im Replay (m1Clock, M1Loop) – die Varianten müssen dieselben Zahlen liefern wie 60 Hz. Eingaben aus einem Skript, nur
// Spieler-Tasten. Auswertung in Node mit demselben Code für Spiel und Referenz (test/m1-feet.mjs).
//  1  Laufen, rennen, springen: Füße rutschen nicht.
//     Kontaktpunkt = feste Sohlenmitte (Mittel foot/toes) je Seite; Kontakt = bis 2 cm über dem tiefsten Punkt relativ zur Figur.
//     V-248: Joggen (W) Rutschanteil < 0,1 wird geprüft; Gehen (Strg) und Sprint (Shift) werden berichtet (Konflikt bei WS0, §31).
//     Referenz = derselbe Gang-Mischer (m1-gait) mit denselben Clips, demselben Tempo-Verlauf, ohne Controller. Geprüft: Die Einbindung fügt nichts hinzu
//     (Spiel ≤ Referenz + 1 cm Kriechen, + 0,05 Rutschanteil). Berichtet, NICHT als bestanden geführt (offen bei WS0, F-5.3): absolute Grenze
//     Handover §6 (≤ 4,4 cm) und das Rutschen der Clips selbst bei den LOCO-Tempi.
//  2  Abheben, fliegen, landen ohne Durchfallen (Spielerweg: F, Leertaste, Shift + W, Kamera steiler nach unten, keine Sinktaste).
//     Physik getrennt von Darstellung: Kapsel-Unterkante nie unter der Oberfläche (Strahl auf alle Kollider); Sohle nie mehr als 2 cm darunter;
//     Bodenangleich der Figur in Ruhe ≤ 3 cm; die Figur springt nie gegen die Kapsel (Sprung der Lage je Schritt ≤ 5 cm).
//  +  Strecken: flacher Platz (gerade), Kurve, Hang.
//  Ränge = Kulisse ohne Begehen (V-283): geprüft in test/m1-fence.mjs (Zaun hält zu Fuß und im Flug ab); die frühere Prüfung „über die Ränge“
//  gehört nicht mehr zur MVP-0-Abnahme (Fuß-IK/Stufen: MVP-1).
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'
import { analyse, locoReference } from './m1-feet.mjs'

const HZ = process.env.M1_HZ ? +process.env.M1_HZ : 60
const { browser, page, errs } = await openPage('#m1,debug,replay' + (HZ !== 60 ? '=' + HZ : ''), { viewport: { width: 320, height: 240 } }) // klein: Takt ist bildunabhängig
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })

const res = await page.evaluate(async () => {
  const M = window.__kfbM1, K = M.k, C = M.clock, P = M.player(), loco = M.mods.player
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  const V = (o) => { o.updateWorldMatrix(true, false); const e = o.matrixWorld.elements; return [e[12], e[13], e[14]] }
  // Ferse/Ballen aus dem Netz (m1-sole, wie Bodenangleich und Referenz): Sohle = der tiefere der beiden Hautpunkte je Fuß
  const A3 = (q) => [q.x, q.y, q.z]
  const ft = (s) => { const S = loco.soles(); return { foot: A3(S['foot.' + s]), toes: A3(S['toes.' + s]) } }
  const sole = (s) => { const q = ft(s); return q.foot[1] < q.toes[1] ? q.foot : q.toes }
  // Mitschnitt je Schritt: Sohlen, Figurwurzel, Kapsel, Oberfläche unter Kapsel und Sohlen, Bodenangleich, Luftzustand, Tempo, Phase
  // Aufnahme über den Schritt-Haken (M1CLOCK.onStep): genau eine Probe je Physik-Schritt, auch wenn ein Bild mehrere Schritte macht (replay=30)
  function record(n) {
    const o = { l: [], r: [], body: [], bodyXZ: [], air: [], speed: [], phase: [], t: [], cap: [], surf: [], solePen: [], lift: [], rootY: [] }
    return new Promise((done) => { let i = 0; C.onStep = () => { sample(o); if (++i >= n) { C.onStep = null; done(o) } } })
  }
  function sample(o) {
    {
      const L = sole('l'), R = sole('r'); o.l.push(ft('l')); o.r.push(ft('r'))
      const st = loco.status(), p = M.feet(); o.body.push(p[1]); o.bodyXZ.push([p[0], p[2]]); o.rootY.push(p[1]); o.air.push(st.air); o.speed.push(st.speedParam); o.phase.push(st.phase); o.t.push(C.steps / 60)
      // Oberfläche per Strahl von kurz über der Figur (1,6 m über den Füßen), nicht von 80 m: sonst träfe er Torbögen und Überhänge der Ränge
      const from = p[1] + 1.6 * K, s = P.castDown(p[0], p[2], from); o.surf.push(s); o.cap.push(P.capsuleBottom()); o.lift.push(P.lift())
      const sl = P.castDown(L[0], L[2], from), sr = P.castDown(R[0], R[2], from); o.solePen.push(Math.min(sl == null ? 9 : L[1] - sl, sr == null ? 9 : R[1] - sr))
    }
  }
  const out = {}
  // gerade Strecke x 24 → ≈ −10 auf dem flachen Platz vor dem Theater (Kamera schaut nach −Z, „links“ = −X)
  P.teleport([24 * K, (-0.125 + 1.1 + 0.05) * K, 30 * K], -Math.PI / 2); await steps(30)
  M.input({ leftward: true }); out.start = await record(36) // Anlauf (0,6 s)
  await steps(54)
  out.walk = await record(180) // W = Joggen (V-020)
  M.input({ leftward: true, walk: true }); await steps(90); out.gehen = await record(180) // Strg+W = Gehen
  M.input({ leftward: true, run: true }); await steps(90)
  out.run = await record(180)
  M.input({ leftward: true }); await steps(120)
  M.input(null); out.stop = await record(60); await steps(30)
  out.rest = await record(30) // Ruhe: Bodenangleich ≈ 0
  // Kurve (vorwärts + rechts, 3 s)
  // echte Kurve: vorwärts joggen, die Kamera dreht dabei gleichmäßig (Eingabe ist kamerabezogen) → Kreisbogen ≈ 90° in 3 s
  { const cc = P.camera(), a0 = cc.azimuthAngle; M.input({ forward: true }); const o = { l: [], r: [], body: [], bodyXZ: [], air: [], speed: [], phase: [], t: [], cap: [], surf: [], solePen: [], lift: [], rootY: [] }
    await new Promise((done) => { let i = 0; C.onStep = () => { cc.rotateAzimuthTo(a0 + (i / 180) * Math.PI / 2, false); sample(o); if (++i >= 180) { C.onStep = null; done() } } })
    out.curve = o; M.input(null); cc.rotateAzimuthTo(a0, false); await steps(60) } // Kamera zurück: folgende Strecken sind kamerabezogen
  // Hang: vom Rand des Platzes bergauf nach +X (Kamera nach −Z, „rechts“ = +X)
  { const x0 = 50 * K, y0 = M.terrainH(x0, 0); P.teleport([x0, y0 + (1.1 + 0.05) * K, 0], Math.PI / 2); await steps(30) }
  M.input({ rightward: true, run: true }); out.slope = await record(240); M.input(null); await steps(60)
  // Springen auf dem Platz
  P.teleport([10 * K, 1.15 * K, 30 * K], 0); await steps(40)
  M.input({ jump: true }); await steps(4); M.input(null); out.jump = await record(110)
  // Fliegen + Landen auf dem Gelände: F, steigen, Shift + W; dann Kamera steiler nach unten → Sinkflug (Spielerweg)
  const cam = P.camera()
  P.setFlying(true); M.input({ jump: true }); await steps(90)
  M.input({ forward: true, run: true }); await steps(120)
  const fs = loco.status(); out.flyMid = { fly: fs.fly, overlay: fs.overlay, feetY: +M.feet()[1].toFixed(2) }
  cam.rotatePolarTo(0.6, false)
  out.landTerrain = await record(400); M.input(null); out.landTerrainDone = !P.flying()
  cam.rotatePolarTo(1.15, false); await steps(60)
  cam.rotatePolarTo(1.15, false)
  return out
})
await page.screenshot({ path: `test/out/m1/move_end_${HZ}.png` })
await browser.close()

// Auswertung (Node)
const F = {}
for (const k of ['start', 'walk', 'gehen', 'run', 'stop', 'curve']) {
  const rec = res[k], game = analyse(rec)
  const ref = await locoReference(rec.t.map((t, i) => ({ t, speedParam: rec.speed[i], phase: rec.phase[i] })))
  F[k] = { game, ref, speedParam: +(rec.speed.reduce((a, b) => a + b, 0) / rec.speed.length).toFixed(3) }
}
// Abstände in cm ÜBER der Oberfläche (negativ = darunter)
const pen = (rec) => {
  const capPen = Math.min(...rec.cap.map((c, i) => (rec.surf[i] == null ? 9 : c - rec.surf[i]))), solePen = Math.min(...rec.solePen)
  let jump = 0; for (let i = 1; i < rec.rootY.length; i++) jump = Math.max(jump, Math.abs((rec.rootY[i] - rec.rootY[i - 1]) - ((rec.cap[i] - rec.cap[i - 1]))))
  // absoluter Ruck der Figurwurzel (zweite Ableitung der Höhe je Schritt): ein Sprung der Figur zeigt sich hier, egal ob die Kapsel mitspringt
  let jerk = 0; for (let i = 2; i < rec.rootY.length; i++) jerk = Math.max(jerk, Math.abs(rec.rootY[i] - 2 * rec.rootY[i - 1] + rec.rootY[i - 2]))
  return { capsuleClearCm: +(capPen * 100).toFixed(1), soleClearCm: +(solePen * 100).toFixed(1), rootVsCapsuleJumpCm: +(jump * 100).toFixed(1), maxLiftCm: +(Math.max(...rec.lift) * 100).toFixed(1), rootJerkCm: +(jerk * 100).toFixed(1) }
}
const P = {}; for (const k of ['walk', 'run', 'curve', 'slope', 'jump', 'landTerrain']) P[k] = pen(res[k])
const restLift = Math.max(...res.rest.lift)
const airSeq = [...new Set(res.jump.air)]
const summary = { hz: HZ, feet: F, pen: P, restLiftCm: +(restLift * 100).toFixed(1), jumpAir: airSeq, flyMid: res.flyMid, landTerrainDone: res.landTerrainDone,
  slopeRise: +(Math.max(...res.slope.rootY) - Math.min(...res.slope.rootY)).toFixed(2),
  // Kurve: Die Figur dreht ohne Dreh-Clip um ihre Mitte, der gepflanzte Fuß wird mitgedreht (Handover §3: „Turn in place … still open“) – berichtet
  curveCreep: { game: F.curve.game.creepCm, ref: F.curve.ref.creepCm },
  v248: { jog: F.walk.game.slipRatio, gehen: F.gehen.game.slipRatio, sprint: F.run.game.slipRatio, grenze: 0.1 },
  offenWS0: { gehenSprintV248: 'Gehen: Walking_B rutscht schon bei Eigentempo; Sprint 4,88 m/s liegt in der Clip-Lücke (§31 a/b/c)', handover44: { jog: F.walk.game.creepCm, sprint: F.run.game.creepCm, grenze: 4.4 }, start: F.start.game.creepCm, stop: F.stop.game.creepCm } }
const notWorse = (k, slip = true) => F[k].game.creepCm <= F[k].ref.creepCm + 1 * K && (!slip || F[k].game.slipRatio == null || F[k].ref.slipRatio == null || F[k].game.slipRatio <= F[k].ref.slipRatio + 0.05)
// Physik: Kapsel nie mehr als 2 cm in der Oberfläche; Darstellung: Hautsohle (Ferse/Ballen aus dem Netz) nicht mehr als 2 cm unter der Oberfläche; Figur ohne Sprung (Ruck ≤ 6 cm je Schritt²), Bodenangleich nie am Anschlag (35 cm)
// Ruck nur beim Laufen (Sprung/Landung haben echte Stöße: Absprung 6,5 m/s in einem Schritt ≈ 11 cm/Schritt²)
const noPen = (k, walking = true) => P[k].capsuleClearCm > -2 * K && P[k].soleClearCm > -2 * K && (!walking || P[k].rootJerkCm <= 6 * K) && P[k].maxLiftCm < 34.5 * K
const checks = {
  walkMeasured: F.walk.game.contacts >= 4 && F.walk.ref.contacts >= 4,
  walkNotWorseThanClips: notWorse('walk'),
  jogV248SlipBelow01: F.walk.game.slipRatio != null && F.walk.game.slipRatio < 0.1, // V-248-Abnahme für Joggen (W)
  gehenMeasured: F.gehen.game.contacts >= 4,
  gehenNotWorseThanClips: notWorse('gehen'),
  sprintMeasured: F.run.game.contacts >= 4 && F.run.ref.contacts >= 4,
  sprintNotWorseThanClips: notWorse('run'),
  startNotWorseThanClips: notWorse('start', false),
  stopNotWorseThanClips: notWorse('stop', false),
  restLiftSmall: restLift <= 0.03 * K,
  flatNoPenetration: noPen('walk') && noPen('run') && noPen('curve'),
  slopeClimbed: summary.slopeRise > 1 * K,
  slopeNoPenetration: noPen('slope'),
  jumpAirStates: airSeq.includes('up') && airSeq.includes('ground') && res.jump.air.at(-1) === 'ground',
  jumpNoPenetration: noPen('jump', false),
  flyUsesFlightPose: res.flyMid.fly === true && res.flyMid.overlay === 'Jump_Idle',
  landsOnTerrain: res.landTerrainDone,
  landTerrainNoPenetration: noPen('landTerrain', false),
  noPageErrors: errs.length === 0,
}
process.exit(report('m1-move' + (HZ !== 60 ? '@' + HZ : ''), checks, { ...summary, errs: errs.slice(0, 3) }))
