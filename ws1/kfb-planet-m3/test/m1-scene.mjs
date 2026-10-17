// M1 · Abnahme 4 (Szenen-Test): Bühne betreten → Dialog D1 startet (Bühnenkamera Two-Shot, Controller aus) → Wahl → letzter Beat →
// zurück ins Freie (Folgekamera, Controller an) → von der Bühne weglaufen → erneut auslösbar erst nach Verlassen. Dazu Abnahme 6 zur Laufzeit:
// Host besitzt Nebel und Hintergrund (Szene), die Himmelskuppel hat fog:false, genau ein Canvas.
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,cards=1', { viewport: { width: 960, height: 600 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().partner === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const wait = (fn, ms = 60000, arg) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true).catch(() => false)
const S = () => page.evaluate(() => window.__kfbM1.status())
// Warten in Spielzeit (Physik-Schritte), nicht in Uhrzeit: Headless läuft die Szene bei wenigen Bildern/s gedrosselt (höchstens 4 Schritte je Bild)
const steps = (n) => page.evaluate((n) => new Promise((r) => { const C = window.__kfbM1.clock, t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), n)

// Abnahme 6 (Laufzeit): Nebel/Hintergrund vom Host, Kuppel ohne Nebel, ein Canvas
const env = await page.evaluate(() => { const sky = window.__kfbM1.mods.sky.object3d; let fogOff = true; sky.traverse((o) => { if (o.material && o.material.fog !== false) fogOff = false })
  return { canvases: document.querySelectorAll('canvas').length, skyFogOff: fogOff, cam: window.__kfbM1.status().camera } })

// 1) Vor der Bühne stehen: kein Dialog
const before = await S()
// 2) Auf die Bühne gehen: Teleport an den vorderen Rand (z = 8, außerhalb des Auslösers), dann vorwärts (Kamera schaut nach −Z)
await page.evaluate(() => { window.__kfbM1.player().teleport([0, 1.15, 8.5].map((v) => v * window.__kfbM1.k), Math.PI) })
await steps(48)
await page.evaluate(() => window.__kfbM1.input({ forward: true }))
const started = await wait(() => window.__kfbM1.state.phase === 'dialog', 30000)
await page.evaluate(() => window.__kfbM1.input(null))
await steps(150)
const inDialog = await S()
// V-257: im Dialog führt die Bühnenkamera von #stage (StageOrbitCam) mit ihren Sprungmarken; V-269: Partner GothGirl
const orbitIn = await page.evaluate(() => ({ active: window.__kfbStageOrbit?.active?.() ?? null, marks: getComputedStyle(document.getElementById('kfb-cam-marks') || document.body).display, partner: window.__kfbM1.mods.partner?.plan?.actorId ?? null, partnerStatus: window.__kfbM1.mods.partner?.status?.().status ?? null }))
// Controller aus: Vorwärts drücken bewegt die Figur im Dialog nicht
const p0 = (await S()).pos; await page.evaluate(() => window.__kfbM1.input({ forward: true, run: true })); await steps(60); await page.evaluate(() => window.__kfbM1.input(null))
const p1 = (await S()).pos, ctrlOff = Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) < 0.05 * K && (await page.evaluate(() => window.__kfbM1.player().controllerOn())) === false // ecctrl selbst aus
// 3) Dialog läuft: Wahl erscheint → Taste 1
const choiceOpened = await wait(() => !!window.__kfbChoice?.isOpen?.(), 120000)
const atChoice = await S() // bei Fehlschlag: welche Bereitschaft fehlte (Pool, Karte, Figuren)
await page.keyboard.press('Digit1')
// 4) Letzter Beat → zurück ins Freie
const ended = await wait(() => window.__kfbM1.state.phase === 'free', 90000)
await steps(90)
const after = await S()
const orbitOut = await page.evaluate(() => ({ active: window.__kfbStageOrbit?.active?.() ?? null, marks: getComputedStyle(document.getElementById('kfb-cam-marks') || document.body).display }))
const dlog = after.lastDialog
const dEvents = await page.evaluate(() => (window.__kfbM1.state.lastLog || []).map((e) => e.type))
// Folgekamera: Figur 1,5 s vorwärts – die Kamera muss mitwandern (ähnlicher Weg)
const cam0 = after.camera, pos0 = after.pos
await page.evaluate(() => window.__kfbM1.input({ backward: true })); await steps(90); await page.evaluate(() => window.__kfbM1.input(null)); await steps(36)
const mid = await S(), moved = Math.hypot(mid.pos[0] - pos0[0], mid.pos[2] - pos0[2]), camMoved = Math.hypot(mid.camera[0] - cam0[0], mid.camera[2] - cam0[2])
await page.evaluate(() => { window.__kfbM1.player().teleport([-3.7, 1.15, 1.2].map((v) => v * window.__kfbM1.k), 0.45) }); await steps(36) // zurück auf die Bühne (Abklingen gilt noch)
// 5) Nicht sofort wieder auslösen; von der Bühne weg (+Z), dann erneut hinein → wieder Dialog
const stillFreeOnStage = await page.evaluate(async () => { await new Promise((r) => { const C = window.__kfbM1.clock, t = C.steps + 60; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }); return window.__kfbM1.state.phase === 'free' && window.__kfbM1.state.cooldown === true })
await page.evaluate(() => { window.__kfbM1.player().teleport([0, 1.15, 14].map((v) => v * window.__kfbM1.k), 0) })
await steps(48)
const cooldownCleared = await page.evaluate(() => window.__kfbM1.state.cooldown === false)
await page.evaluate(() => { window.__kfbM1.player().teleport([0, 1.15, 8.5].map((v) => v * window.__kfbM1.k), Math.PI) }); await steps(30)
await page.evaluate(() => window.__kfbM1.input({ forward: true }))
const again = await wait(() => window.__kfbM1.state.phase === 'dialog', 30000)
await page.evaluate(() => window.__kfbM1.input(null))
// zweiter Dialog läuft wirklich (nicht sofort beendet): nach 1,5 s noch im Dialog (Prüfer M1, Befund 8)
await steps(90)
const secondRuns = await page.evaluate(() => window.__kfbM1.state.phase === 'dialog')
await page.keyboard.press('Escape') // Escape beendet den Dialog
const escaped = await wait(() => window.__kfbM1.state.phase === 'free', 15000)
// Mitten im Sprung über der Bühne: kein Dialog (nur am Boden, Prüfer M1-2 Befund 1); nach der Landung auf der Bühne: Dialog
await page.evaluate(() => { window.__kfbM1.player().teleport([0, 1.15, 14].map((v) => v * window.__kfbM1.k), 0) }); await steps(36)
await page.evaluate(() => { window.__kfbM1.player().teleport([0, 3.5, 2].map((v) => v * window.__kfbM1.k), Math.PI) })
const airborneNoDialog = await page.evaluate(async () => { const C = window.__kfbM1.clock, t = C.steps + 20; let any = false; while (C.steps < t) { await new Promise((r) => requestAnimationFrame(r)); const h = window.__kfbM1.player().handle(); if (!h.isOnGround && window.__kfbM1.state.phase === 'dialog') any = true } return !any }) // 20 Schritte Fall (Spielzeit)
const afterLanding = await wait(() => window.__kfbM1.state.phase === 'dialog', 15000)
const landedGrounded = await page.evaluate(() => { const f = window.__kfbM1.feet(); return Math.abs(f[1]) < 0.08 * window.__kfbM1.k })
await page.keyboard.press('Escape'); await wait(() => window.__kfbM1.state.phase === 'free', 15000)
// Spielerweg (Prüfer M1-4, Befund 3): von START zu Fuß auf die Bühne und wieder hinaus – ohne Teleport. Vorn liegt der Ring des Theaters (0,79 m über
// der Bühne, ≈ 0,9 m über dem Gelände, r 9,5–10,5); seit V-331 liegt auf der START-Achse eine unsichtbare Rampe darüber. Joggen nach −Z ohne Sprung
// → Dialog; Escape; nach +Z hinaus über die Rampe → Abklingen gelöscht (r > 9,5).
await page.evaluate(() => { window.__kfbM1.player().teleport([...window.__kfbM1.start], Math.PI) }); await steps(60)
const path = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), cam = P.camera(), raf = () => new Promise((r) => requestAnimationFrame(r))
  const run = async (dirZ, jumpWhen, until, maxSteps) => {
    cam.rotateAzimuthTo(dirZ < 0 ? 0 : Math.PI, false); cam.rotatePolarTo(1.15, false)
    let jumps = 0, last = -999, minR = 99 * M.k; const t0 = C.steps
    while (C.steps - t0 < maxSteps && !until()) {
      const f = M.feet(), h = P.handle(), r = Math.hypot(f[0], f[2]); minR = Math.min(minR, r)
      const jump = h?.isOnGround && jumpWhen(f) && jumps < 3 && C.steps - last > 45
      if (jump) { jumps++; last = C.steps }
      M.input({ forward: true, jump: C.steps - last < 4 }); await raf()
    }
    M.input(null); return { jumps, steps: C.steps - t0, end: M.feet().map((v) => +v.toFixed(2)), minR: +minR.toFixed(2) }
  }
  const inn = await run(-1, () => false, () => M.state.phase === 'dialog', 1500)
  inn.dialog = M.state.phase === 'dialog'
  return inn
})
await steps(120)
await page.keyboard.press('Escape'); const pathEscaped = await wait(() => window.__kfbM1.state.phase === 'free', 15000); await steps(30)
const pathOut = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), cam = P.camera(), raf = () => new Promise((r) => requestAnimationFrame(r))
  cam.rotateAzimuthTo(Math.PI, false); cam.rotatePolarTo(1.15, false)
  const cooldown0 = M.state.cooldown
  let jumps = 0, last = -999; const t0 = C.steps
  while (C.steps - t0 < 1500 && M.feet()[2] < 14 * M.k) {
    const f = M.feet(), h = P.handle(), r = Math.hypot(f[0], f[2])
    M.input({ forward: true, leftward: f[0] < -0.4 * M.k }); await raf() // von der linken Marke schräg zur Rampe (x ≈ 0; Kamera nach +Z: links = +X)
  }
  M.input(null)
  return { jumps, cooldown0, cooldown: M.state.cooldown, phase: M.state.phase, end: M.feet().map((v) => +v.toFixed(2)) }
})
await page.screenshot({ path: 'test/out/m1/scene_end.png' })
await browser.close()

const near = (a, b, d) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < d
process.exit(report('m1-scene', {
  oneCanvas: env.canvases === 1,
  skyNoFog: env.skyFogOff,
  noDialogBeforeStage: before.phase === 'free' && !before.dialog,
  stageStartsDialog: started,
  stageCamera: near(inDialog.camera, [0, 2.15 * K, 9.2 * K], 0.6 * K) && inDialog.fov === 38, // STAGE_CAMS.near, Brennweite wie #stage
  followFovRestored: after.fov === 55,
  partnerIsGothGirl: orbitIn.partner === 'gothgirl' && orbitIn.partnerStatus === 'OK', // V-269 (Darsteller-Plan aus dem Rezept, Figur geladen)
  stageOrbitInDialog: orbitIn.active === true && orbitIn.marks === 'flex',
  stageOrbitOffAfterDialog: orbitOut.active === false && orbitOut.marks === 'none',
  playerOnLeftMark: Math.hypot(inDialog.pos[0] + 3.7 * K, inDialog.pos[2] - 1.2 * K) < 0.4 * K,
  controllerOffInDialog: ctrlOff,
  feetOnStageFloorInDialog: Math.abs(p1[1]) < 0.08 * K, // Bühnenboden y = 0; Figur sinkt nicht ein (Prüfung nach 3,5 s im Dialog)
  choiceOpened,
  dialogRanToEnd: ended && dlog?.phase === 'DONE' && dEvents.includes('card') && dEvents.includes('line') && dEvents.includes('choice') && dEvents.includes('done'),
  followCameraAfterDialog: moved > 1 * K && camMoved > 0.6 * moved,
  noRetriggerWhileOnStage: stillFreeOnStage,
  leavingClearsCooldown: cooldownCleared,
  reenterStartsAgain: again,
  secondDialogRuns: secondRuns,
  escapeEndsDialog: escaped,
  noDialogWhileAirborne: airborneNoDialog,
  dialogAfterLandingOnStage: afterLanding && landedGrounded,
  // Spielerweg ohne Teleport (Befund 3, V-331): zu Fuß über die Rampe auf die Bühne → Dialog → hinaus → Abklingen gelöscht
  walkFromStartStartsDialog: path.dialog === true && path.jumps === 0, // über die Rampe, ohne Sprung (V-331)
  walkOutClearsCooldown: pathEscaped && pathOut.cooldown0 === true && pathOut.cooldown === false && pathOut.phase === 'free' && pathOut.end[2] >= 14 * K,
  noPageErrors: errs.length === 0,
}, { atChoice: { dialog: atChoice.dialog, ready: atChoice.ready }, before: { phase: before.phase }, inDialog: { camera: inDialog.camera, pos: inDialog.pos, dialog: inDialog.dialog }, after: { camera: after.camera, pos: after.pos, lastDialog: dlog, events: dEvents, moved, camMoved }, env, path, pathOut, orbitIn, orbitOut, errs: errs.slice(0, 3) }))
