// Probe · Spielgefühl-Rauchtest (21.10.): Drift lädt Boost (Stufen im HUD), Shift verbraucht die Anzeige, Landung löst Hit-Stop/Trauma aus, keine Seitenfehler
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(800)
await p.evaluate(() => { const d = __probeDrive(), wl = __S.water * __S.amp + 1, ob = (d.OBST.rocks || []); let best = null
  for (let i = 0; i < 4000 && !best; i++) { const x = (Math.random() - 0.5) * 260, z = (Math.random() - 0.5) * 260, h0 = __hgt(x, z); if (h0 < wl) continue; let ok = true
    for (let k = 0; k < 12 && ok; k++) { const a = k / 12 * 6.283, r = 12 + (k % 3) * 10, h = __hgt(x + Math.cos(a) * r, z + Math.sin(a) * r); if (Math.abs(h - h0) > 1.2 || h < wl) ok = false }
    if (ok && !ob.some((o) => Math.hypot(o.x - x, o.z - z) < 35)) best = [x, z] }
  if (best) d.placeCar(best[0], best[1], 0); window.__feelSpot = best })
await p.waitForTimeout(800)
const hud = () => p.evaluate(() => document.getElementById('hudBoost').textContent)
await p.keyboard.down('KeyW'); await p.waitForTimeout(2500); const v0 = await p.evaluate(() => +__probeDrive().D.speed.toFixed(1)); await p.keyboard.down('KeyQ'); await p.keyboard.down('KeyA'); const trace = []; for (let i = 0; i < 8; i++) { await p.waitForTimeout(200); trace.push(await p.evaluate(() => { const D = __probeDrive().D; return [+D.speed.toFixed(1), +(D.drift || 0).toFixed(2), +(D.driftCharge || 0).toFixed(2), D.air, +(9 * 0 + (window.KFBDrive?.K || 0)).toFixed(3)] })) } const during = await hud(); await p.keyboard.up('KeyQ'); await p.keyboard.up('KeyA'); await p.waitForTimeout(150)
const afterDrift = await p.evaluate(() => ({ db: __probeDrive().D.driftBoostT, meter: __probeDrive().D.boostMeter }))
await p.keyboard.down('ShiftLeft'); await p.waitForTimeout(1500); const afterShift = await p.evaluate(() => __probeDrive().D.boostMeter); await p.keyboard.up('ShiftLeft'); await p.keyboard.up('KeyW')
console.log(JSON.stringify({ spot: await p.evaluate(() => window.__feelSpot), v0, trace, during, afterDrift, afterShift, errs: errs.slice(0, 3) })); await b.close()
