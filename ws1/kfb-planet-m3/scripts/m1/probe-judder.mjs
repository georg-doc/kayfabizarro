// M1 · Sonde Ruckeln (Georg 16.10.: „ruckelt sehr stark beim Fliegen“): Bildschirm-Bewegung der Figur je gezeichnetem Bild, im Flug (Shift, 30 m/s)
// und am Boden (Joggen), bei 60 Hz (replay) und 120 Hz (replay=120: ein Physik-Schritt je zweitem Bild, wie ein ProMotion-Bildschirm).
// Gemessen im Zeichenmoment (M1CLOCK.onDraw), also die gezeichnete Lage. Ruckeln = ungleichmäßige Bewegung von Bild zu Bild: Anteil der Bilder ohne Bewegung und Streuung der Schrittweite (Variationskoeffizient).
// node scripts/m1/probe-judder.mjs
import { openPage } from '../../test/_page.mjs'
const out = {}
for (const hz of [60, 120]) {
  const { browser, page } = await openPage('#m1,debug,replay' + (hz === 120 ? '=120' : ''), { viewport: { width: 640, height: 400 } })
  await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
  out[hz] = await page.evaluate(async () => {
    const M = window.__kfbM1, C = M.clock, P = M.player()
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    // Messung im Zeichenmoment (onDraw): gezeichnete (interpolierte) Lage der Figur und der Kamera
    const v = { x: 0, y: 0, z: 0 }
    const measure = (frames) => new Promise((done) => { const xs = []; C.onDraw = () => { const o = M.mods.player.object3d, p = o.getWorldPosition(new o.position.constructor()), c = P.camera().camera
      c.updateMatrixWorld(); const e = c.matrixWorldInverse.elements, pr = c.projectionMatrix.elements; v.x = p.x; v.y = p.y + 1; v.z = p.z
      const vx = e[0] * v.x + e[4] * v.y + e[8] * v.z + e[12], vy = e[1] * v.x + e[5] * v.y + e[9] * v.z + e[13], vz = e[2] * v.x + e[6] * v.y + e[10] * v.z + e[14], vw = e[3] * v.x + e[7] * v.y + e[11] * v.z + e[15]
      const cx = pr[0] * vx + pr[4] * vy + pr[8] * vz + pr[12] * vw, cy = pr[1] * vx + pr[5] * vy + pr[9] * vz + pr[13] * vw, cw = pr[3] * vx + pr[7] * vy + pr[11] * vz + pr[15] * vw
      xs.push({ wx: p.x, wz: p.z, sx: (cx / cw) * 320, sy: (cy / cw) * 200, step: C.steps }); if (xs.length >= frames) { C.onDraw = null; done(xs) } } })
    const stats = (xs) => { const d = []; for (let i = 1; i < xs.length; i++) d.push(Math.hypot(xs[i].wx - xs[i - 1].wx, xs[i].wz - xs[i - 1].wz))
      const still = d.filter((x) => x < 1e-4).length, m = d.reduce((a, b) => a + b, 0) / d.length, sd = Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / d.length)
      const s = []; for (let i = 1; i < xs.length; i++) s.push(Math.hypot(xs[i].sx - xs[i - 1].sx, xs[i].sy - xs[i - 1].sy))
      return { frames: xs.length, worldPerFrameM: +m.toFixed(3), stillFrames: still, cv: +(sd / (m || 1)).toFixed(2), screenJumpPxMax: +Math.max(...s).toFixed(1), screenJumpPxMed: +s.sort((a, b) => a - b)[s.length >> 1].toFixed(1) } }
    const r = {}
    P.teleport([0, 1.15, 40], Math.PI / 2); await steps(30); M.input({ rightward: true }); await steps(60); r.jog = stats(await measure(120)); M.input(null)
    P.setFlying(true); M.input({ jump: true }); await steps(60); M.input({ forward: true, run: true }); await steps(60); r.flyFast = stats(await measure(120)); M.input(null)
    return r
  })
  await browser.close()
}
console.log(JSON.stringify(out, null, 1))
