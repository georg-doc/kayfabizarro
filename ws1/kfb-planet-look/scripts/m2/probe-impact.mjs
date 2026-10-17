// M2 · Sonde: Aufprall an FrizzleBob (weich) gegen Wand (Zaun), Bilder mit Schatten und Kontaktfleck. node scripts/m2/probe-impact.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,replay,car', { viewport: { width: 1600, height: 900 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.() && window.__kfbM2.stats.model === 'OK', null, { timeout: 240000 })
const run = (spec) => page.evaluate(async (s) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  M2.setKind('k2b', { p: s.p, yaw: s.yaw }); await steps(30); while (!M2.car()) await steps(1)
  const ev = []; const off = M2.events.on('railImpact', (e) => ev.push(e))
  M.input({ forward: true }); let hitAt = null, minD = 1e9
  for (let i = 0; i < s.steps; i++) { await steps(1); const p = M2.car().pos(); if (ev.length && !hitAt) { hitAt = { x: p.x, z: p.z, speed: +M2.car().speed().toFixed(1) }; M.input(null) } }
  await steps(60); off(); const p = M2.car().pos()
  return { firstImpact: ev[0] ?? null, impacts: ev.length, hitAt, after1s: { x: +p.x.toFixed(2), z: +p.z.toFixed(2) }, back: hitAt ? +Math.hypot(p.x - hitAt.x, p.z - hitAt.z).toFixed(2) : null }
}, spec)
const out = {}
out.fb = await run({ p: [0, 1, 52], yaw: Math.PI, steps: 150 }) // FB steht bei z = 30 auf der Achse
await page.screenshot({ path: 'test/out/m2_impact_fb.png' })
out.wall = await run({ p: [0, 1, -45], yaw: 0, steps: 150 }) // Zaun hinter der Rückwand
await page.evaluate(async () => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock; const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  M2.setKind('k2b', { p: [40, 1, 30], yaw: Math.PI / 2 }); await steps(30); M.input({ forward: true }); await steps(90); M.input(null); await steps(60) })
await page.screenshot({ path: 'test/out/m2_shadow_far.png' })
console.log(JSON.stringify(out, null, 1), 'errs', errs.slice(0, 3)); await browser.close()
