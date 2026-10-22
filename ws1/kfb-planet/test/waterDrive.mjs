// WS1c (V-631/V-621) · Fahren im, unter und über Wasser (world=probe, K2B): zwei Fahrten am größten Talboden-See.
//   A langsam hinein: kurz Gas, ausrollen → im Wasser (wade) → unter Wasser (under) auf dem Grund, Kamera unter dem Spiegel; dann Sprung = Schwimmstoß →
//     taucht auf und kommt über den Spiegel (Sprung aus dem Wasser)
//   B schnell hinein (Vollgas): gleitet (skim) auf dem Spiegel, Unterseite nie unter dem Spiegel (skimDev = tiefster Abstand Unterseite − Spiegel)
//   Ereignisse 'water' (enter, dive, surface, skim, kick, exit) kommen, VFX-Modul zählt Spritzer/Kielwasser/Bugwelle, keine Seitenfehler
import fs from 'node:fs'
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,car,look=terrain3,world=probe,tod=0.557,replay', { viewport: { width: 640, height: 400 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.() && window.__kfbM1.mods.terrain?.hydro?.(), null, { timeout: 240000 })
const res = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, t = M.mods.terrain, h = t.hydro(), sea = h.seaY, H = t.height
  const steps = (n) => new Promise((r) => { const e = C.steps + n; const f = () => (C.steps >= e ? r() : requestAnimationFrame(f)); f() })
  // größter See unter dem Meeresspiegel bis 150 m: tiefste Stelle, Ufer Richtung Weltmitte
  let best = null; for (let z = -150; z <= 150; z += 2) for (let x = -150; x <= 150; x += 2) { const d = sea - H(x, z); if (d > 1.6 && (!best || d > best.d)) best = { x, z, d } }
  const len = Math.hypot(best.x, best.z), ux = -best.x / len, uz = -best.z / len; let s = 0; while (H(best.x + ux * s, best.z + uz * s) < sea + 0.3 && s < 80) s += 0.5
  const shore = [best.x + ux * s, best.z + uz * s], yaw = Math.atan2(-ux, -uz)
  const run = (startBack, gasSteps, total, jumpAt) => new Promise(async (done) => { M.input(null); const p = [shore[0] + ux * startBack, 0, shore[1] + uz * startBack]; p[1] = H(p[0], p[2]) + 0.6 * M.k
    M2.setKind('k2b', { p, yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(20)
    const W0 = () => M2.stats.water, tl = [], ev = [], tr = []; let i = 0, maxAbove = -1e9, minUnderCam = 0, skimDev = 0, skimN = 0, camUnder = 0, maxDepth = 0
    const off = M2.events.on('water', (e) => ev.push({ i, kind: e.kind, s: +(e.strength ?? 0).toFixed(2) }))
    C.onStep = () => { const c = M2.car(); if (!c) return; const W = W0(), pos = c.pos()
      M.input({ forward: i < gasSteps || (jumpAt && i > jumpAt - 60 && i < jumpAt), jump: jumpAt && i >= jumpAt && i < jumpAt + 4 })
      if (i % 60 === 0) tr.push([i, +pos.x.toFixed(1), +pos.y.toFixed(1), +pos.z.toFixed(1), +c.speed().toFixed(1)])
      if (W) { if (!tl.length || tl[tl.length - 1].m !== W.mode) tl.push({ i, m: W.mode, v: +Math.abs(c.speed()).toFixed(1) })
        if (W.level != null) { maxDepth = Math.max(maxDepth, W.depth); if (jumpAt && i > jumpAt) maxAbove = Math.max(maxAbove, pos.y - W.level)
          if (W.mode === 'skim') { skimDev = Math.min(skimDev, pos.y - W.level); skimN++ } }
        const u = t.under?.(); if (u?.on) camUnder++ }
      if (++i >= total) { C.onStep = null; off(); M.input(null); done({ tr, tl, ev, maxAbove: +maxAbove.toFixed(2), skimDev: +skimDev.toFixed(2), skimN, camUnder, maxDepth: +maxDepth.toFixed(2), stats: { ...W0()?.stats }, fx: M2.stats.waterFx?.stats() || null }) } } })
  const A = await run(14, 40, 900, 620), B = await run(40, 520, 520, 0)
  return { lake: best, shore: shore.map((v) => +v.toFixed(1)), sea, A, B }
})
const fx = await page.evaluate(() => { let o = null; window.__kfbM1.scene().traverse((x) => { if (x.name === 'kfb-water-fx') o = x }); return { fxGroup: !!o, ...(window.__kfbM2.stats.waterFx?.stats() || {}) } })
await browser.close()
const A = res.A, B = res.B, kinds = (r) => new Set(r.ev.map((e) => e.kind)), mA = new Set(A.tl.map((x) => x.m)), mB = new Set(B.tl.map((x) => x.m))
fs.mkdirSync('test/out/water-r1', { recursive: true }); fs.writeFileSync('test/out/water-r1/drive.json', JSON.stringify(res, null, 1))
process.exit(report('waterDrive', {
  'A: ins Wasser (enter)': kinds(A).has('enter'), 'A: unter Wasser (under)': mA.has('under'), 'A: Kamera unter dem Spiegel': A.camUnder > 30, 'A: Schwimmstoß (kick)': kinds(A).has('kick'),
  'A: Sprung aus dem Wasser (> 0,3 m über Spiegel)': A.maxAbove > 0.3, 'A: auftauchen (surface)': kinds(A).has('surface'),
  'B: gleitet (skim)': mB.has('skim') && B.skimN > 30, 'B: nie unter dem Spiegel beim Gleiten': B.skimDev > -0.05 && !mB.has('under'),
  'VFX-Modul hängt': fx.fxGroup, 'VFX A: Spritzer + Blasen': A.fx?.splashes >= 3 && A.fx?.bubbles > 10, 'VFX B: Kielwasser, Bugwelle, Gischt': B.fx?.wakePts > 5 && B.fx?.bowOn > 10 && B.fx?.tail > 10, 'keine Seitenfehler': !errs.length,
}, { lake: res.lake, shore: res.shore, A: { tl: A.tl, ev: A.ev, maxAbove: A.maxAbove, camUnder: A.camUnder, maxDepth: A.maxDepth, stats: A.stats, fx: A.fx }, B: { tl: B.tl, ev: B.ev, skimDev: B.skimDev, skimN: B.skimN, fx: B.fx }, errs: errs.slice(0, 3) }))
