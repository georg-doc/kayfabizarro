// M1 TUNE · Raster T1–T3 (V-342): Steuerung nach Lab-Vorlage (replies/donors/lab-walker-2026-10-16). Replay mit festem Takt, Eingaben über
// M1INPUT.override mit wow: true (WoW-Deutung wie die Tastatur) und M1INPUT.mouse (Maustasten).
//   T1 WoW-Schema auch ohne W: A dreht auf der Stelle; Q/E strafen für sich (V-199 (1) behoben); W läuft in Blickrichtung; RMB + A strafen statt
//      drehen; LMB + RMB = vorwärts.
//   T2 Sprünge je Zustand: Stand → Jump_Start, aus dem Joggen → Jump_Full_Short, Sprint + Leertaste → Jump_Full_Long, höher als der kurze.
//   T3 Doppel-Leertaste < 400 ms hebt ab; einzeln nie; zweiter Druck nach > 400 ms = zweiter Sprung, kein Flug. Im Flug: Leertaste steigt, X sinkt,
//      W fliegt in Blickrichtung.
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,replay', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), loco = M.mods.player, I = (o) => M.input(o ? { wow: true, ...o } : null)
  const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
  const pos = () => { const f = M.feet(); return { x: f[0], y: f[1], z: f[2] } }
  const out = {}
  const home = async (yaw = Math.PI / 2) => { I(null); M.mouse?.(null); P.teleport([0, 1.15 * M.k, 40 * M.k], yaw); await steps(40) }
  // T1a: A allein dreht auf der Stelle
  await home(); { const h0 = P.heading(), p0 = pos(); I({ leftward: true }); await steps(60); I(null); await steps(20); const p1 = pos(); out.turnA = { dHeading: +(P.heading() - h0).toFixed(3), moved: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(3) } }
  // T1b: W läuft in Blickrichtung (nach dem Drehen)
  { const h = P.heading(), p0 = pos(); I({ forward: true }); await steps(90); I(null); await steps(20); const p1 = pos(), d = [p1.x - p0.x, p1.z - p0.z], L = Math.hypot(...d); out.walkW = { dist: +L.toFixed(2), alongHeading: +((d[0] * Math.sin(h) + d[1] * Math.cos(h)) / (L || 1)).toFixed(3) } }
  // T1c: Q allein strafet nach links, Blickrichtung bleibt
  await home(); { const h0 = P.heading(), p0 = pos(); I({ strafeL: true }); await steps(90); I(null); await steps(20); const p1 = pos(), d = [p1.x - p0.x, p1.z - p0.z], L = Math.hypot(...d)
    const lx = Math.cos(h0), lz = -Math.sin(h0) // links von (sin h, cos h)
    out.strafeQ = { dist: +L.toFixed(2), alongLeft: +((d[0] * lx + d[1] * lz) / (L || 1)).toFixed(3), dHeading: +(P.heading() - h0).toFixed(3) } }
  // T1d: RMB + A strafet statt zu drehen
  await home(); { M.mouse({ l: false, r: true }); await steps(5); const h0 = P.heading(), p0 = pos(); I({ leftward: true }); await steps(90); I(null); await steps(10); M.mouse(null); const p1 = pos()
    out.rmbA = { dist: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2), dHeading: +(P.heading() - h0).toFixed(3) } }
  // T1e: LMB + RMB = vorwärts
  await home(); { M.mouse({ l: true, r: true }); I({}); const p0 = pos(); await steps(90); M.mouse(null); I(null); await steps(10); const p1 = pos(); out.bothButtons = { dist: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2) } }
  // T2: Sprünge je Zustand
  const jump = async (keys) => { I(keys); await steps(keys.forward ? 60 : 5); const y0 = pos().y; I({ ...keys, jump: true }); await steps(3); const kind = P.jumpKind(); let peak = y0, over = null
    for (let i = 0; i < 70; i++) { await steps(1); peak = Math.max(peak, pos().y); const o = loco.status().overlay; if (o && !over) over = o } I(null); await steps(60); return { kind, overlay: over, rise: +(peak - y0).toFixed(2) } }
  await home(); out.jumpStand = await jump({})
  await home(); out.jumpJog = await jump({ forward: true })
  await home(); out.jumpLong = await jump({ forward: true, run: true })
  // T3: Doppel-Leertaste
  await home(); { I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(15); I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(10); out.doubleTap = { flying: P.flying() } }
  { if (P.flying()) { I({ jump: true }); await steps(60); const h = P.heading(), p0 = pos(); I({ forward: true }); await steps(60); const p1 = pos(), d = [p1.x - p0.x, p1.z - p0.z], L = Math.hypot(...d)
      const y1 = pos().y; I({ descend: true }); await steps(100); const y2 = pos().y; I(null)
      out.flight = { climbedTo: +p0.y.toFixed(1), fwdDist: +L.toFixed(1), alongHeading: +((d[0] * Math.sin(h) + d[1] * Math.cos(h)) / (L || 1)).toFixed(3), descendedBy: +(y1 - y2).toFixed(2) }; P.setFlying(false); await steps(150) } }
  await home(); { I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(60); out.singleTap = { flying: P.flying() } }
  await home(); { I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(40); I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(10); out.slowTaps = { flying: P.flying() } }
  return out
})
await browser.close()
const ok = {
  T1_turnInPlace: Math.abs(r.turnA.dHeading) > 1.5 && r.turnA.moved < 0.3 * K,
  T1_walkAlongHeading: r.walkW.dist > 3 * K && r.walkW.alongHeading > 0.95,
  T1_strafeQWithoutW: r.strafeQ.dist > 2 * K && r.strafeQ.alongLeft > 0.9 && Math.abs(r.strafeQ.dHeading) < 0.05,
  T1_rmbAStrafes: r.rmbA.dist > 2 * K && Math.abs(r.rmbA.dHeading) < 0.2,
  T1_bothButtonsForward: r.bothButtons.dist > 3 * K,
  T2_stand: r.jumpStand.kind === 'stand' && r.jumpStand.overlay === 'Jump_Start' && r.jumpStand.rise > 0.5 * K,
  T2_jogShort: r.jumpJog.kind === 'short' && r.jumpJog.overlay === 'Jump_Full_Short',
  T2_sprintLong: r.jumpLong.kind === 'long' && r.jumpLong.overlay === 'Jump_Full_Long' && r.jumpLong.rise > r.jumpJog.rise * 1.15,
  T3_doubleTapFlies: r.doubleTap.flying === true,
  T3_singleTapNever: r.singleTap.flying === false,
  T3_slowTapsTwoJumps: r.slowTaps.flying === false,
  T3_flightControls: !!r.flight && r.flight.descendedBy > 1 * K && r.flight.fwdDist > 5 * K && r.flight.alongHeading > 0.95,
  noPageErrors: errs.length === 0,
}
process.exit(report('m1-wow', ok, { ...r, errs: errs.slice(0, 3) }))
