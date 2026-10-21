// V-619 · Lange Fahrt im Spiel: 5 km geradeaus und 5 km im Zickzack (Kurswechsel ±50° alle 400 m) mit dem echten Wagen (Autopilot, Gas + Lenken
// nach Gierfehler). Prüft je Bild: Wagen über der gezeigten Fläche (kein Durchfallen an Kachelgrenzen), Kollider unter dem Wagen (Strahl alle 0,5 s),
// keine Höhensprünge der Fläche unter dem Wagen (|Δ Boden| je Bild ≤ 0,5 m), Bildzeiten. Bericht test/out/biome-drive/km.json. Dauer ≈ 10 min.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const OUT = 'test/out/biome-drive'; fs.mkdirSync(OUT, { recursive: true })
const KM = +(process.env.KM || 5)
const { browser, page, errs } = await openPage('#m1,debug,car,look=terrain3,world=endless,mute,drivepanel=0,hour=12.5', { viewport: { width: 1280, height: 800 } })
page.on('console', (m) => { if (/Shader Error|VALIDATE_STATUS/.test(m.text())) errs.push('shader') })
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbDrive?.veg()?.info().ready, null, { timeout: 180000 })
async function run(name, zig) {
  return page.evaluate(async ({ name, zig, KM }) => { const M = window.__kfbM1, M2 = window.__kfbM2, D = window.__kfbDrive, T = D.terrain()
    const x0 = 120, z0 = 120, h0 = 0.8; T.setFocus(x0, z0); T.flush(); M2.setKind('k2b', { p: [x0, T.surfaceAt(x0, z0) + 0.9, z0], yaw: h0 }); await new Promise((r) => setTimeout(r, 2500))
    let dist = 0, prev = M2.car().pos(), seg = 0, head = h0, minClear = Infinity, maxDg = 0, lastG = null, noColl = 0, rays = 0, stuck = 0, t = 0, resets = 0; const dts = []; let last = performance.now()
    await new Promise((res) => { const f = (now) => { const dt = now - last; last = now; dts.push(dt); t += dt
      const c = M2.car(); if (!c) { requestAnimationFrame(f); return }
      const p = c.pos(); const step = Math.hypot(p.x - prev.x, p.z - prev.z); if (step < 30) dist += step; prev = { x: p.x, y: p.y, z: p.z }
      if (zig && Math.floor(dist / 400) !== seg) { seg = Math.floor(dist / 400); head = h0 + (seg % 2 ? 0.87 : -0.87) }
      let e = head - c.yaw(); e = Math.atan2(Math.sin(e), Math.cos(e)); M.input({ forward: true, leftward: e > 0.04, rightward: e < -0.04 })
      const g = T.surfaceAt(p.x, p.z); minClear = Math.min(minClear, p.y - g); if (lastG != null && step < 2) maxDg = Math.max(maxDg, Math.abs(g - lastG) - Math.abs(step) * 1.2); lastG = g
      if (dts.length % 30 === 0) { rays++; const r = M.player().castDown?.(p.x, p.z); if (r == null) noColl++ }
      if (dts.length % 300 === 0) { if (step < 0.02) stuck++ }
      if (dist < KM * 1000 && t < 900000) requestAnimationFrame(f); else res() }; requestAnimationFrame(f) })
    M.input(null); const a = dts.slice(30).sort((x, y) => x - y), q = (k) => +a[Math.floor(k * (a.length - 1))].toFixed(1)
    return { name, km: +(dist / 1000).toFixed(2), sec: +(t / 1000).toFixed(0), minClear: +minClear.toFixed(3), maxGroundJumpM: +maxDg.toFixed(3), rays, noColl, stuck,
      fps: +(1000 / (a.reduce((s, v) => s + v, 0) / a.length)).toFixed(1), p50: q(0.5), p95: q(0.95), over20: a.filter((v) => v > 20).length, frames: a.length, terrain: T.info() } }, { name, zig, KM })
}
const straight = await run('gerade', false), zigzag = await run('zickzack', true)
await browser.close()
const ok = (r) => r.km >= KM * 0.99 && r.minClear > -0.3 && r.noColl === 0 && r.maxGroundJumpM < 0.5
const res = { straight, zigzag, errs: errs.slice(0, 5) }
fs.writeFileSync(`${OUT}/km.json`, JSON.stringify(res, null, 1))
process.exit(report('biomeDriveKm', { straight: ok(straight), zigzag: ok(zigzag), noErrors: errs.length === 0 }, res))
