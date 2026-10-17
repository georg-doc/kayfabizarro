// M2 · Sonde: k2b gegen das Theater (Weg, Sweep-Treffer je 10 Schritte) und ecctrl mit verschiedenen PS. node scripts/m2/probe-k2b.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,replay,car=k2b', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const out = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  M2.setKind('k2b', { p: [8, 2.5, 34], yaw: Math.PI }); await steps(60); const rows = []
  M.input({ forward: true })
  for (let i = 0; i < 24; i++) { await steps(10); const c = M2.car(), p = c.pos(); rows.push([i * 10, +p.x.toFixed(1), +p.y.toFixed(2), +p.z.toFixed(1), +c.speed().toFixed(1), JSON.stringify(M2.stats.lastSweep)]) }
  M.input(null)
  const hp = []
  for (const h of [30, 60, 120]) { M2.tune.hp = h; M2.setKind('ecctrl', { p: [8, 2.5, 34], yaw: Math.PI / 2 }); await steps(60); M.input({ forward: true }); await steps(180); const c = M2.car(); hp.push([h, +c.speed().toFixed(1), +c.pos().x.toFixed(1), c.state().gear, c.state().rpm]); M.input(null) }
  return { rows, hp }
})
for (const r of out.rows) console.log(r.join(' | ')); console.log('hp', JSON.stringify(out.hp)); console.log('errs', errs.slice(0, 3))
await browser.close()
