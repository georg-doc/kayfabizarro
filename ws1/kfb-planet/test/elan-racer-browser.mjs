// Elan S2 im Browser (Fahrmodus K2B, Racer): Doppel-Leertaste in der Luft → Schwungflug, Schub hält ihn oben, Boost leert den Kessel (Säule rot),
// Ringe des Racer-Kurses (× 1,4) sichtbar, loslassen → landet und fährt in K2B weiter. Prüft auch Tastenliste und Seitenfehler.
import { K } from '../src/m1/m1Scale.js'
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,replay,car,fly', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
  const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
  M.input(null); const x0 = 12 * K, z0 = 30 * K; M2.setKind('k2b', { p: [x0, (M.terrainH(x0, z0) ?? 0) + 2 * K, z0], yaw: 0 }); await steps(60); while (!M2.car()) await steps(1); await steps(20)
  const c = M2.car(), F = c.fly(), out = {}
  const hAbove = () => { const p = c.pos(); return p.y - (M.terrainH(p.x, p.z) ?? 0) }
  M.input({ forward: true }); await steps(70)
  M.input({ forward: true, jump: true }); await steps(3); M.input({ forward: true }); await steps(10); M.input({ forward: true, jump: true }); await steps(3); M.input({ forward: true }); await steps(2)
  out.flying = !!F.st; out.why = F.flights
  await steps(180); out.h3 = +hAbove().toFixed(1); out.stillFlying = !!F.st
  const run = M.elanRun?.(); out.ringScale = run ? +(run.course.rings[0].radius / 4.5).toFixed(2) : null // J17: J = 1
  M.input({ forward: true, run: true }); let boilSeen = false, red = false
  for (let i = 0; i < 330 && F.st; i++) { await steps(1); if (F.st?.boilT > 0) { boilSeen = true; const f = document.querySelector('#elan-boiler > div'); red ||= !!f && /192, 57, 43|c0392b/.test(f.style.background) } }
  out.boil = boilSeen; out.boilerRed = red; out.boilerShown = document.getElementById('elan-boiler')?.style.display === 'block'
  let landed = false; for (let i = 0; i < 60 * 40 && !landed; i++) { await steps(1); M.input({ noseDown: true }); landed = !F.st }
  M.input(null); await steps(120); out.landed = landed; out.lands = F.lands; out.grounded = c.grounded() > 0; out.finite = Number.isFinite(c.pos().y)
  out.keys = document.getElementById('m2-keys')?.textContent || ''
  return out
})
await browser.close()
process.exit(report('elan-racer-browser', {
  doubleSpaceFlies: r.flying && r.stillFlying,
  thrustHolds: r.h3 > 2,
  boilerEmptiesAndShows: r.boil && r.boilerRed && r.boilerShown,
  landsBackToK2B: r.landed && r.lands === 1 && r.grounded && r.finite,
  racerCourse: r.ringScale === 1.4,
  keyList: /Racer fliegt/.test(r.keys),
  noPageErrors: errs.length === 0,
}, { ...r, errs: errs.slice(0, 3) }))
