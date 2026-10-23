// Staub-Probe · Kosten (Kriterium ≤ 0,1 ms): GPU nur Staub (Kamera-Ebene nur mit dem Staub) und ganze Szene, alter gegen neuen Shader abwechselnd
// im selben Zustand (Timer-Query, Median), CPU dustStep im Probe-Modus je Bild. Fahrt mit Drift, damit der Pool gefüllt ist. Pixeldichte 2.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,car,look=terrain3,world=probe,mute,dust3=0,dust2=1', { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbDust2?.rigs?.length, null, { timeout: 180000 }); await page.waitForTimeout(3000)
await page.evaluate(() => { window.__kfbDust2.ms = 0; window.__kfbDust2.n = 0; window.__kfbM1.input({ forward: true }) }); await page.waitForTimeout(2800)   // gerade: Pool gefüllt (≈ 110 lebend, viele nahe der Kamera)
const r = await page.evaluate(async () => { const M = window.__kfbM1, R = M.renderer(), gl = R.getContext(), scene = M.scene(), cam = M.camera3(), D = window.__kfbDust2, X = gl.getExtension('EXT_disjoint_timer_query_webgl2')
  const cpu = D.n ? D.ms / D.n : null; window.__kfbM2.freezeFx = true
  const P = scene.getObjectByName('vehicle-rig-dust'); let live = 0; for (const v of P.geometry.attributes.aLife.array) if (v > 0) live++
  const time = async (render) => { const out = { old: [], neu: [] }
    for (let k = 0; k < 8; k++) for (const v of ['old', 'neu']) { D.shader(v === 'old' ? 'old' : 'new'); render(); gl.finish()
      for (let i = 0; i < 12; i++) { const q = gl.createQuery(); gl.beginQuery(X.TIME_ELAPSED_EXT, q); render(); gl.endQuery(X.TIME_ELAPSED_EXT); gl.finish()
        for (let w = 0; w < 50 && !gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE); w++) await new Promise((res) => setTimeout(res, 2))
        if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE) && !gl.getParameter(X.GPU_DISJOINT_EXT)) out[v].push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q) } }
    const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? +s[s.length >> 1].toFixed(4) : null }; D.shader('new'); return { old: med(out.old), neu: med(out.neu), n: out.neu.length } }
  const full = X ? await time(() => R.render(scene, cam)) : null
  const c2 = cam.clone(); c2.layers.set(7); P.layers.enable(7); const sa = R.shadowMap.autoUpdate; R.shadowMap.autoUpdate = false   // nur Staub: ohne Schattenpass
  const dust = X ? await time(() => R.render(scene, c2)) : null; P.layers.disable(7); R.shadowMap.autoUpdate = sa
  return { live, cpuMsPerFrame: cpu != null ? +cpu.toFixed(4) : null, frames: D.n, full, dust, timer: !!X } })
await browser.close()
const dDust = r.dust ? +(r.dust.neu - r.dust.old).toFixed(4) : null, dFull = r.full ? +(r.full.neu - r.full.old).toFixed(4) : null
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/dust-cost.json', JSON.stringify({ ...r, dDust, dFull, errs }, null, 1))
process.exit(report('dustCost', { gpuDust: dDust != null && dDust <= 0.1, cpu: r.cpuMsPerFrame != null && r.cpuMsPerFrame <= 0.1, noErr: errs.length === 0 }, { ...r, dDust, dFull, errs }))
