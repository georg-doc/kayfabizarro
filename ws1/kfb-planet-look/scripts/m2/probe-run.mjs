// M2 · Sonde einzelner G0-Lauf (k2b): je 5 Schritte Lage, Luft, Tempo, letzter Sweep. node scripts/m2/probe-run.mjs <deg> <r>
import { openPage } from '../../test/_page.mjs'
const deg = +(process.argv[2] ?? -174), r = +(process.argv[3] ?? 34)
const { browser, page } = await openPage('#m1,debug,replay,car', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const rows = await page.evaluate(async ([deg, r]) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
  const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
  const a = (deg * Math.PI) / 180, x = Math.sin(a) * r, z = -Math.cos(a) * r, yaw = Math.atan2(-x, -z)
  M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 2, z], yaw }); await steps(30); while (!M2.car()) await steps(1); M.input({ forward: true })
  const out = []; await new Promise((done) => { let i = 0; C.onStep = () => { const c = M2.car(); if (!c) return; const p = c.pos(), s = c.state()
    if (i % 3 === 0) out.push([i, +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2), +Math.hypot(p.x, p.z).toFixed(2), s.air ? 'AIR' : 'gnd', s.speed, s.hits, JSON.stringify(M2.stats.lastSweep ?? null)]); if (++i >= 150) { C.onStep = null; done() } } })
  M.input(null); return out
}, [deg, r])
for (const x of rows) console.log(x.join('\t')); await browser.close()
