// C1 Kamera (V-408) · Jitter: Bildschirm-Position der Figur bzw. des Autos (Mitte, 1 m über dem Boden), Standardabweichung über 10 s gleichmäßiger
// Bewegung nach 2 s Einschwingen. Echter Bildtakt (kein replay), Bild 1280 × 720, ohne renderer.render (norender: Interpolation, Kamera und Messung
// laufen je Bild wie im Spiel; der Software-Renderer des Test-Browsers fiele sonst auf ≈ 8 Bilder/s). fps=30: jedes zweite Bild ausgelassen.
//   Laufen: FB joggt geradeaus über den Platz · Fahren: K2B mit ≈ 4,5 m/s geradeaus (Gas nach Tempo), beide 12 s
//   Gate: ≤ 1 px bei 60 fps, ≤ 2 px gedrosselt auf 30 fps (max. aus x- und y-Streuung); dazu „hp“ = Streuung um das gleitende Mittel (0,5 s), nur Bericht
import { openPage, report } from './_page.mjs'

const W = 1280, H = 720
async function measure(mode, half) {
  const { browser, page, errs } = await openPage(`#m1,debug,norender${mode === 'car' ? ',car' : ''}${half ? ',fps=30' : ''}`, { viewport: { width: W, height: H } })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM1.status().player?.status === 'OK' && (!location.hash.includes('car') || window.__kfbM2?.car?.()), null, { timeout: 240000 })
  const r = await page.evaluate(async ({ mode, W, H }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, P = M.player()
    const steps = (n) => new Promise((res) => { const t = C.steps + n; const f = () => (C.steps >= t ? res() : requestAnimationFrame(f)); f() })
    if (mode === 'car') { const x = -18 * K / 0.6509, z = -14 * K / 0.6509; /* hinter dem Theater, frei von Gebäuden, nach +X */ M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw: Math.PI / 2 }); await steps(10); while (!M2.car()) await steps(1); await steps(30) }
    else { P.teleport([-14 * K / 0.6509, 1.2 * K, 24 * K / 0.6509], Math.PI / 2); await steps(40); P.camera()?.rotateAzimuthTo?.(-Math.PI / 2, false) }
    const V = new (M.mods.amph.object3d.position.constructor)()
    const pts = [], t0 = performance.now(); let frames = 0
    const drive = () => { if (mode === 'car') { const c = M2.car(); M.input({ forward: (c?.speed() ?? 0) < 4.5 }) } else M.input({ forward: true }) }
    C.onStep = drive
    await new Promise((done) => { C.onDraw = () => { frames++; const tt = (performance.now() - t0) / 1000
        const o = mode === 'car' ? M2.stats.visualRoot : M.mods.player?.object3d; if (!o) return
        o.getWorldPosition(V); V.y += 1 * K; const cm = M.camera3(); cm.updateMatrixWorld(); V.project(cm)
        if (tt >= 2) pts.push([(V.x + 1) * W / 2, (1 - V.y) * H / 2, tt]); if (tt >= 12) { C.onDraw = null; done() } } })
    C.onStep = null; M.input(null)
    return { pts, fps: +(frames / ((performance.now() - t0) / 1000)).toFixed(1) }
  }, { mode, W, H })
  await browser.close()
  const P = r.pts, sd = (a) => { const m = a.reduce((s, v) => s + v, 0) / a.length; return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length) }
  const hp = (k) => { const n = P.length, w = Math.max(3, Math.round(n / 20)), out = []; for (let i = w; i < n - w; i++) { let s = 0; for (let j = i - w; j <= i + w; j++) s += P[j][k]; out.push(P[i][k] - s / (2 * w + 1)) } return sd(out) }
  return { mode, fps: r.fps, n: P.length, sdX: +sd(P.map((p) => p[0])).toFixed(2), sdY: +sd(P.map((p) => p[1])).toFixed(2), hpX: +hp(0).toFixed(2), hpY: +hp(1).toFixed(2), errs }
}
const out = {}
for (const mode of ['walk', 'car']) for (const half of [false, true]) out[`${mode}${half ? 30 : 60}`] = await measure(mode, half)
const j = (k) => Math.max(out[k].sdX, out[k].sdY)
process.exit(report('c1-jitter', {
  walk60: j('walk60') <= 1, walk30: j('walk30') <= 2, car60: j('car60') <= 1, car30: j('car30') <= 2,
  measured: Object.values(out).every((x) => x.n > 200),
  noPageErrors: Object.values(out).every((x) => x.errs.length === 0),
}, { out }))
