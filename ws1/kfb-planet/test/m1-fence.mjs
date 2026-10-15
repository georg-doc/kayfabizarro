// M1 · Ränge = Kulisse ohne Begehen (V-283, WS0 15.10.: „die Kollision soll das Betreten verhindern“). Der Zaun (m1Host rankFence) hält zu Fuß
// und im Flug ab; Bühne und Gelände bleiben frei. Nachweis je Abschnitt (Prüfer M1-4, Befund 4): die Kapsel BERÜHRT den Zaun (Kontaktpunkte mit
// einem Zaun-Kollider, player.fenceTouch) – nicht nur „steht irgendwo still“ –, ihre Mitte kommt nie über die Zaunfläche hinaus (Abstand zur Fläche
// ≥ Kapselradius − 5 cm), der Dialog startet dabei nicht, und gesprungen wird nachweislich (Luftzustand „up“, Steighöhe).
// Replay mit festem Takt (#m1,debug,replay), nur Spieler-Tasten (kamerabezogen: Vorwärts = Blickrichtung der Folgekamera).
// Grenzen (Prüfer M1-5, N6): Kapselmitte ≥ Radius − 7 cm vor der Zaunfläche (gemessen bis 5,1 cm Eindringen des Lösers an den Ecken der 1,25°-Stücke
// beim Joggen gegen die Wand; 7 cm lassen 2 cm Spiel, ein Durchbruch wären ≥ 40 cm);
// zu Fuß bleibt die Figur auf dem Bühnenboden (Füße ≤ 8 cm über y = 0: Bodenangleich in Ruhe ≤ 3 cm, die erste Stufe ist ≥ 20 cm hoch); Sprung am
// Zaun nicht höher als ein freier Sprung + 10 cm (N3: negative Reibung hob die Figur an der Wand).
// Gegenlauf (M1_NOFENCE=1, Hash nofence): dieselben Wege ohne Zaun – kein Kontakt, und die Figur gerät in den gesperrten Bereich. Belegt, dass die
// Prüfungen ohne Zaun scheitern würden (Bericht m1-fence-gegenlauf).
// Winkel θ wie m1Host: 0 = −Z (hinten), +90° = +X; Richtung nach außen = (sin θ, −cos θ); Kamera-Azimut dafür = −θ.
import { openPage, report } from './_page.mjs'
import { inRankFence, rankFenceClear, rankOuterR } from '../src/m1/m1Host.js'
import fs from 'fs'
// Kapselradius aus M1Player (JSX, in Node nicht importierbar)
const RAD = +/export const HALF = [\d.]+, RAD = ([\d.]+)/.exec(fs.readFileSync(new URL('../src/m1/M1Player.jsx', import.meta.url), 'utf8'))[1]

const NOFENCE = process.env.M1_NOFENCE === '1'
const { browser, page, errs } = await openPage('#m1,debug,replay' + (NOFENCE ? ',nofence' : ''), { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })

const res = await page.evaluate(async (outerBack) => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), loco = M.mods.player, cam = P.camera()
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  // je Schritt: Lage (Figur = Kapselmitte in x/z), Höhe, Kontakt mit dem Zaun, Luftzustand, Dialog-Phase, Kapsel- und Oberflächenabstand
  function record(n, each) {
    const o = { xz: [], y: [], touch: [], air: [], phase: [], capClear: [], fly: [] }
    return new Promise((done) => { let i = 0; C.onStep = () => { if (each) each(i)
      const f = M.feet(), s = P.castDown(f[0], f[2], f[1] + 1.6), cap = P.capsuleBottom()
      o.xz.push([f[0], f[2]]); o.y.push(f[1]); o.touch.push(P.fenceTouch()); o.air.push(loco.status().air); o.phase.push(M.state.phase); o.capClear.push(s == null ? 9 : cap - s); o.fly.push(P.flying())
      if (++i >= n) { C.onStep = null; done(o) } } })
  }
  const unfreeze = async () => { if (M.state.phase === 'dialog') M.endDialog(); await steps(5) } // ohne Zaun landet die Figur auch auf der Bühne → Dialog
  const at = (deg, r) => [Math.sin((deg * Math.PI) / 180) * r, -Math.cos((deg * Math.PI) / 180) * r]
  const out = { fenceOn: M.fence.on, outerBack }
  // freier Vergleichssprung (Sprint + Sprung wie unten) auf dem Platz vor dem Theater
  P.teleport([10, 1.15, 30], 0); await steps(30); cam.rotateAzimuthTo(0, false); cam.rotatePolarTo(1.15, false); await steps(2)
  M.input({ forward: true, run: true }); out.freeJump = await record(120, (i) => M.input({ forward: true, run: true, jump: i >= 20 && i < 24 })); M.input(null); await steps(30)
  // zu Fuß von der Bühne nach außen (Start r 6,3: außerhalb des Dialog-Auslösers r < 6,2): hinten, beide Seiten, schräg, Flügel
  const walks = [
    { key: 'back', deg: 0 }, { key: 'right', deg: 90 }, { key: 'left', deg: -90, run: true }, { key: 'rightBack', deg: 130 }, { key: 'wingLeft', deg: -145 },
    { key: 'jumpLeft', deg: -90, run: true, jump: true }, { key: 'jumpBack', deg: 0, run: true, jump: true },
  ]
  for (const w of walks) {
    const [x, z] = at(w.deg, 6.3); P.teleport([x, 1.15, z], Math.PI - (w.deg * Math.PI) / 180); await steps(30)
    cam.rotateAzimuthTo((-w.deg * Math.PI) / 180, false); cam.rotatePolarTo(1.15, false); await steps(2)
    M.input({ forward: true, run: !!w.run })
    out[w.key] = await record(180, (i) => { if (w.jump) M.input({ forward: true, run: !!w.run, jump: i >= 20 && i < 24 }) })
    M.input(null); await steps(20)
  }
  // zu Fuß von außen hinter der Rückwand nach +Z auf das Theater zu
  { const x = 0, z = -28; P.teleport([x, M.terrainH(x, z) + 1.15, z], 0); await steps(30); cam.rotateAzimuthTo(Math.PI, false); cam.rotatePolarTo(1.15, false); await steps(2) }
  M.input({ forward: true, run: true }); out.outsideWalk = await record(300); M.input(null); await steps(20)
  // Flug über der Bühne nach hinten, sinkend (Kamera steil): Zaun hält ab, Landung auf der Bühne
  await unfreeze()
  P.teleport([0, 8, -4], Math.PI); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(0, false); cam.rotatePolarTo(0.6, false); M.input({ forward: true })
  out.flyStage = await record(400); M.input(null); out.flyStageDone = !P.flying()
  { const f = M.feet(); out.flyStageAt = { feet: f, surface: P.castDown(f[0], f[2], f[1] + 1.6) } }
  await steps(30); if (M.state.phase === 'dialog') M.endDialog() // auf der Bühne gelandet → Dialog; beenden, damit die Figur frei ist
  cam.rotatePolarTo(1.15, false); await steps(30)
  // Flug von außen, sinkend (15 m/s): Zaun hält ab, Landung auf dem Gelände davor
  await unfreeze()
  P.teleport([0, 12, -34], 0); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(Math.PI, false); cam.rotatePolarTo(0.75, false); M.input({ forward: true })
  out.flyOutside = await record(420); M.input(null); out.flyOutsideDone = !P.flying()
  { const f = M.feet(); out.flyOutsideAt = { feet: f, surface: P.castDown(f[0], f[2], f[1] + 1.6) } }
  // schneller Flug (Shift, 30 m/s) waagrecht gegen die Außenwand und gegen die Stirnseite: kein Durchtunneln (Befund 5)
  await unfreeze()
  P.teleport([0, 6, -45], 0); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(Math.PI, false); cam.rotatePolarTo(1.45, false); M.input({ forward: true, run: true })
  out.flyFast = await record(150); M.input(null); P.setFlying(false); await steps(120)
  // von vorn (frei) quer nach −X auf die linke Stirnseite zu: sie läuft von (−150°, innen) nach (−155°, außen), also bei z ≈ 8,9 um x ≈ −4,6
  await unfreeze(); P.teleport([3, 3, 8.9], -Math.PI / 2); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(Math.PI / 2, false); cam.rotatePolarTo(1.45, false); M.input({ forward: true, run: true })
  out.flyFastCap = await record(150); M.input(null); P.setFlying(false); await steps(60)
  // schneller Flug von innen: von der Bühnenmitte in 3 m Höhe nach hinten gegen die Innenwand (N12)
  await unfreeze()
  P.teleport([0, 3, 0], Math.PI); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(0, false); cam.rotatePolarTo(1.45, false); M.input({ forward: true, run: true })
  out.flyFastIn = await record(120); M.input(null); P.setFlying(false); await steps(90); if (M.state.phase === 'dialog') M.endDialog(); await steps(20)
  // Vorausblick direkt (N7): vor der Rückwand schwebend, 30 m/s auf die Wand zu → Treffer, Normale zeigt aus der Wand heraus (−Z), Anteil in die Wand gekürzt
  await unfreeze()
  { const r0 = out.outerBack + 0.45; P.teleport([0, 6, -r0], 0); P.setFlying(true); await steps(3); out.cast = P.flyCast({ x: 0, y: 0, z: 30 }); P.setFlying(false); await steps(60) }
  cam.rotatePolarTo(1.15, false)
  return out
}, rankOuterR(0))
await page.screenshot({ path: 'test/out/m1/fence_end.png' })
await browser.close()

// Auswertung (Node): Abstand der Kapselmitte zur Zaunfläche (rankFenceClear: Grundriss-Kante, positiv außerhalb) – innen, außen und Stirn gleich
const clear = (rec) => Math.min(...rec.xz.map(([x, z]) => rankFenceClear(x, z)))
const inside = (rec) => rec.xz.filter(([x, z]) => inRankFence(x, z)).length
const touches = (rec) => rec.touch.filter(Boolean).length
const rise = (rec) => +(Math.max(...rec.y) - rec.y[0]).toFixed(2)
const maxY = (rec) => +Math.max(...rec.y).toFixed(3)
const minCap = (rec) => +(Math.min(...rec.capClear) * 100).toFixed(1)
const dialogs = (rec) => rec.phase.filter((p) => p !== 'free').length
const cm = (v) => +(v * 100).toFixed(1)
const W = {}
for (const k of ['back', 'right', 'left', 'rightBack', 'wingLeft', 'jumpLeft', 'jumpBack']) {
  const r = res[k]; W[k] = { touches: touches(r), inside: inside(r), clearCm: cm(clear(r)), maxY: maxY(r), rise: rise(r), dialogSteps: dialogs(r), up: r.air.includes('up'), capCm: minCap(r), end: r.xz.at(-1).map((v) => +v.toFixed(2)) }
}
const fly = (k) => ({ touches: touches(res[k]), inside: inside(res[k]), clearCm: cm(clear(res[k])), capCm: minCap(res[k]), end: res[k].xz.at(-1).map((v) => +v.toFixed(2)) })
const cast = res.cast, nOut = cast?.hit ? cast.hit.n1 : null
const summary = { fenceOn: res.fenceOn, radius: RAD, freeJumpRise: rise(res.freeJump), walks: W,
  outsideWalk: { ...fly('outsideWalk'), rise: rise(res.outsideWalk) },
  flyStage: { ...fly('flyStage'), landed: res.flyStageDone, at: res.flyStageAt }, flyOutside: { ...fly('flyOutside'), landed: res.flyOutsideDone, at: res.flyOutsideAt },
  flyFast: fly('flyFast'), flyFastCap: fly('flyFastCap'), flyFastIn: fly('flyFastIn'),
  cast: cast && { hit: !!cast.hit, toi: cast.hit?.toi ?? null, n1: nOut, clipped: cast.clipped, intoAfter: nOut ? +(cast.clipped.x * nOut.x + cast.clipped.y * nOut.y + cast.clipped.z * nOut.z).toFixed(3) : null, fence: cast.hit?.fence ?? null } }
const tolCm = cm(RAD - 0.07)
const jumpCap = summary.freeJumpRise + 0.1
const walkOk = (w, jump) => w.touches >= 5 && w.inside === 0 && w.clearCm >= tolCm && w.dialogSteps === 0 && w.capCm > -2 && (jump ? w.up && w.rise > 0.5 && w.rise <= jumpCap : w.maxY <= 0.08)
const flyOk = (f, minTouch = 1) => f.touches >= minTouch && f.inside === 0 && f.clearCm >= tolCm
let checks
if (!NOFENCE) {
  checks = {
    fenceOn: res.fenceOn === true,
    walkBackBlocked: walkOk(W.back), walkRightBlocked: walkOk(W.right), walkLeftRunBlocked: walkOk(W.left), walkRightBackBlocked: walkOk(W.rightBack), walkWingBlocked: walkOk(W.wingLeft),
    jumpLeftBlocked: walkOk(W.jumpLeft, true), jumpBackBlocked: walkOk(W.jumpBack, true),
    outsideWalkBlocked: flyOk(summary.outsideWalk, 5),
    flyStageLandsOnStage: flyOk(summary.flyStage, 0) && res.flyStageDone && res.flyStageAt.surface != null && Math.abs(res.flyStageAt.surface) < 0.05 && Math.abs(res.flyStageAt.feet[1] - res.flyStageAt.surface) < 0.05 && summary.flyStage.capCm > -2,
    flyOutsideLandsOnTerrain: flyOk(summary.flyOutside) && res.flyOutsideDone && res.flyOutsideAt.surface != null && Math.abs(res.flyOutsideAt.feet[1] - res.flyOutsideAt.surface) < 0.05 && summary.flyOutside.capCm > -2,
    flyFastNoTunnel: flyOk(summary.flyFast), flyFastCapNoTunnel: flyOk(summary.flyFastCap), flyFastInNoTunnel: flyOk(summary.flyFastIn),
    // Normale zeigt aus der Wand heraus (vom Theater weg, hinten = −Z), und die gekürzte Geschwindigkeit hat keinen Anteil mehr in die Wand hinein
    castNormalOutOfWall: !!cast?.hit && cast.hit.fence === true && nOut.z < -0.5 && (cast.clipped.x * nOut.x + cast.clipped.y * nOut.y + cast.clipped.z * nOut.z) > -0.05,
    noPageErrors: errs.length === 0,
  }
} else {
  // Gegenlauf ohne Zaun: kein Kontakt mit einem Zaun, und mindestens drei der sieben Fußwege bzw. beide Flüge geraten in den gesperrten Bereich
  const entered = Object.values(W).filter((w) => w.inside > 0 || w.maxY > 0.15).length
  checks = {
    fenceOff: res.fenceOn === false,
    noFenceContacts: Object.values(W).every((w) => w.touches === 0) && summary.flyFast.touches === 0,
    walksWouldFail: entered >= 3,
    flightsWouldFail: summary.flyFast.inside > 0 || summary.flyFastIn.inside > 0,
    noPageErrors: errs.length === 0,
  }
  summary.entered = entered
}
process.exit(report(NOFENCE ? 'm1-fence-gegenlauf' : 'm1-fence', checks, { ...summary, errs: errs.slice(0, 3) }))
