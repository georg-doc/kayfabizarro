// M2 · Rauchtest G0 (V-312: kurz, ein Seitenaufruf): beide Kandidaten fahren, lenken, Kuppe; ecctrl Überschlag → Aufrichten (< 2 s, V-313).
// node scripts/m2/smoke.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,replay,car', { viewport: { width: 640, height: 400 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const out = await page.evaluate(async () => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  const st = () => { const c = M2.car(), p = c.pos(); return { kind: c.kind, x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2), yaw: +c.yaw().toFixed(2), speed: +c.speed().toFixed(2), upY: +c.upY().toFixed(2), grounded: c.grounded() } }
  const run = async (kind) => {
    const r = { kind }; M2.setKind(kind, { p: [8, 2.5, 34], yaw: Math.PI }); await steps(90); r.rest = st()
    M.input({ forward: true }); await steps(180); r.after3s = st()
    M.input({ forward: true, leftward: true }); await steps(90); r.turn = st()
    M.input(null); await steps(120); r.stop = st()
    return r
  }
  const a = await run('ecctrl')
  // Überschlag: aufs Dach legen, Zeit bis aufrecht (oben·Y > 0,9) messen
  M2.flip('roof'); let t = 0, up = 0; await steps(2)
  while (t < 300) { await steps(1); t++; up = M2.car().upY(); if (up > 0.9 && t > 10) break }
  a.rightSteps = t; a.rightUp = +up.toFixed(2); a.afterRight = st()
  const b = await run('k2b')
  return { a, b, stats: M2.stats }
})
console.log(JSON.stringify(out, null, 1)); console.log('errs', errs.slice(0, 5))
await page.screenshot({ path: 'test/out/m2_smoke.png' })
await browser.close()
