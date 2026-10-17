// M1 · Sonde Flug gegen den Zaun: Vorausschieben der Kapsel (flyCast) an der Außenwand, je Schritt Lage und Treffer. node scripts/m1/probe-fly.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,replay', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const rows = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), cam = P.camera()
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  P.teleport([0, 6, -24], 0); P.setFlying(true); await steps(30)
  const out = [{ static: P.flyCast({ x: 0, y: 0, z: 30 }) }]
  cam.rotateAzimuthTo(Math.PI, false); cam.rotatePolarTo(1.45, false); M.input({ forward: true, run: true })
  await new Promise((done) => { let i = 0; C.onStep = () => { const b = P.handle().body, p = b.translation(), v = b.linvel(); out.push({ i, z: +p.z.toFixed(2), r: +Math.hypot(p.x, p.z).toFixed(2), vz: +v.z.toFixed(1), cast: P.flyCast({ x: v.x, y: v.y, z: v.z }), touch: P.fenceTouch() }); if (++i >= 40) { C.onStep = null; done() } } })
  M.input(null); return out
})
console.log(JSON.stringify(rows.slice(0, 1))); for (const r of rows.slice(1)) console.log(JSON.stringify(r))
console.log('errs', errs.slice(0, 3))
await browser.close()
