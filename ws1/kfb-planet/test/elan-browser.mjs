// Elan S1 · Einbau in die M1-Figur (Browser, replay, nodraw): Abheben im Schwungflug (flight=elan, Doppel-Leertaste), Sturz (W) bringt Tempo und FOV,
// Schub (Shift) kostet eine Ladung und gibt Stoß, Hochziehen (S) tauscht Tempo gegen Höhe, Wand im vollen Flug: kein Durchflug (Zaun-Grundriss der
// Ränge), G in der Luft wechselt zum Schwebeflug und zurück, Komfortmodus (K): FOV bleibt 55°, Landung nach langsamem Gleiten, Perlen und Ringe sichtbar.
import { openPage, report } from './_page.mjs'
import { inRankFence } from '../src/m1/m1Host.js'
const { browser, page, errs } = await openPage('#m1,debug,nodraw,replay,flight=elan', { viewport: { width: 640, height: 360 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), K = M.k, cam = M.camera3(), E = () => M.elan().state
  const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
  const I = (o) => M.input(o ? { wow: true, ...o } : null), sp = () => { const s = E(); return s ? Math.hypot(...s.v) : 0 }, out = {}
  P.teleport([0, 1.2 * K, 30 * K], Math.PI); await steps(40)
  I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(10); I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(60)
  out.liftoff = { flying: P.flying(), elan: !!E(), y: +M.feet()[1].toFixed(1), charges: E()?.charges }
  // Steigen kostet eine Ladung; dann im Flug hoch über das Gelände vom Theater weg (+Z) – Platz für Sturz und Abfangen, kein Dialog auf der Bühne
  { const c0 = E()?.charges; I({ jump: true }); await steps(2); I(null); await steps(30); out.ascent = { charges0: c0, charges1: E()?.charges } }
  const J = K / 0.6509; P.teleport([0, 240 * J, 120 * J], Math.PI); await steps(20) /* von außen zur Mitte: Sturz und Abfangen bleiben in der Flugwelt (Radius 159 m, Höhe ≤ 260 m) */; out.climbY = +M.feet()[1].toFixed(1)
  const s0 = sp(), fov0 = cam.fov; I({ forward: true }); await steps(180); I(null); const s1 = sp(), fov1 = cam.fov
  out.dive = { s0: +s0.toFixed(1), s1: +s1.toFixed(1), fov0: +fov0.toFixed(1), fov1: +fov1.toFixed(1), mode: E()?.mode }
  const c0 = E()?.charges; I({ run: true }); await steps(2); I(null); await steps(10); out.surge = { charges0: c0, charges1: E()?.charges, events: M.elan().events.slice(-5).map((e) => e.type) }
  { let yMin = 1e9, vMax = 0; I({ backward: true }); for (let i = 0; i < 160; i++) { await steps(1); yMin = Math.min(yMin, M.feet()[1]); vMax = Math.max(vMax, sp()) } I(null)
    out.pullUp = { gain: +(M.feet()[1] - yMin).toFixed(1), vMax: +vMax.toFixed(1), v1: +sp().toFixed(1) } }
  // G: Schwebeflug, dann zurück
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyG' })); await steps(5); out.toggleHover = !E() && P.flying()
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyG' })); await steps(5); out.toggleBack = !!E()
  out.hud = { pearls: document.getElementById('elan-hud')?.style.display, rings: [...document.querySelectorAll('canvas')].length }
  // Komfortmodus: FOV bleibt 55 im Sturz
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' })); await steps(120); I({ forward: true }); let fmax = 0; for (let i = 0; i < 80; i++) { await steps(1); fmax = Math.max(fmax, cam.fov) } I(null)
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' })); out.comfortMaxFov = +fmax.toFixed(2)
  // Wand: aus 20 m Höhe vor der Rückwand mit Schub auf die Ränge zu – Lage nie im Zaun-Grundriss
  P.setFlying(false); await steps(20); P.teleport([0, 12 * K, -26 * K], 0); await steps(10); P.setFlying(true); await steps(5)
  const path = []; I({ run: true }); await steps(2); I({ forward: true }); for (let i = 0; i < 150; i++) { await steps(1); const f = M.feet(); path.push([f[0], f[2]]) } I(null)
  out.wallPath = path.filter((_, i) => i % 3 === 0)
  // Landung: langsam auf den Platz gleiten
  P.setFlying(false); await steps(10); P.teleport([0, 6 * J, 45 * J], 0); await steps(5); P.setFlying(true); await steps(5)
  let landed = false; for (let i = 0; i < 900 && !landed; i++) { await steps(1); landed = !P.flying() } out.landed = landed
  out.rings = { visibleNext: !!document.querySelector('canvas'), runNext: M.elanRun()?.next }
  return out
})
await browser.close()
const crossed = r.wallPath.some(([x, z]) => inRankFence(x, z))
process.exit(report('elan-browser', {
  liftoffIntoElan: r.liftoff.flying && r.liftoff.elan,
  ascentCostsCharge: r.ascent.charges1 === r.ascent.charges0 - 1,
  diveGainsSpeedAndFov: r.dive.s1 > r.dive.s0 + 8 && r.dive.fov1 > r.dive.fov0 + 2, // FOV-Feder ≈ 0,25 s hinkt dem Tempo nach
  surgeCostsCharge: r.surge.charges1 === r.surge.charges0 - 1,
  pullUpTradesSpeedForHeight: r.pullUp.gain > 3 && r.pullUp.v1 < r.pullUp.vMax,
  gTogglesInAir: r.toggleHover && r.toggleBack,
  pearlsShown: r.hud.pearls === 'flex',
  comfortKeepsFov55: r.comfortMaxFov <= 55.1,
  noWallTunnel: !crossed,
  landsAfterGlide: r.landed,
  noPageErrors: errs.length === 0,
}, { ...r, wallPath: undefined, crossed, errs: errs.slice(0, 3) }))
