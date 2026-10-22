// MVP-Leistung (V-618 „Qualitätsregler, Messung aus der Spielkamera“): fps-Tabelle je Szene × Qualität bei Georgs Bildschirm (1440×900 CSS, Pixeldichte 2 = 2880×1800).
// Szenen: zu Fuß am Platz · Bewohner + Band + Disco · Fahrt im Racer. Qualität über Hash q=fast|standard|sharp (dpr 1 / [1,1.25] / [1,1.5]).
// Je Lauf: 4 s warm, 8 s Bildzeiten aus requestAnimationFrame, M1-Uhr (Schritt- und Zeichenzeit), renderer.info (Zeichenaufrufe, Dreiecke). Nur im Test-Slot laufen lassen.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import { evaluate } from '../src/world/perfBudget.js'
fs.mkdirSync('test/out/perf', { recursive: true })
const SCENES = { walk: '#m1,debug,harvest,look=terrain3,world=probe', npc: '#m1,debug,harvest,look=terrain3,world=probe,npc,patrol,band,disco', car: '#m1,debug,harvest,look=terrain3,world=probe,car' }
const QS = (process.env.QS || 'fast,standard,sharp').split(','), only = process.env.SCENES ? process.env.SCENES.split(',') : Object.keys(SCENES)
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), rows = []
for (const sc of only) for (const q of QS) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto('file://' + path.resolve('dist/index.html') + SCENES[sc] + ',q=' + q)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }).catch(() => {})
  if (sc === 'car') await p.evaluate(() => window.__kfbM1.input?.({ forward: true }))
  await p.waitForTimeout(4000)
  const r = await p.evaluate(async () => {
    const M = window.__kfbM1, st0 = { ...M.clock.stats }, fr = []; let last = performance.now()
    await new Promise((ok) => { const f = (t) => { fr.push(t - last); last = t; if (fr.length < 480) requestAnimationFrame(f); else ok() }; requestAnimationFrame(f) })
    const st1 = M.clock.stats, gl = M.renderer?.() || null, info = gl ? { calls: gl.info.render.calls, triangles: gl.info.render.triangles } : null
    const steps = st1.steps - st0.steps, draws = (st1.draws ?? 0) - (st0.draws ?? 0)
    return { frames: fr.slice(5), stepMs: steps ? (st1.stepMs - st0.stepMs) / steps : null, drawMs: draws ? (st1.drawMs - st0.drawMs) / draws : (st1.drawMs - st0.drawMs) / fr.length, info, dpr: gl?.getPixelRatio?.() ?? null }
  })
  const ev = evaluate({ info: r.info || {}, frameMs: r.frames, device: 'reference' })
  const row = { scene: sc, q, dpr: r.dpr, avgFps: +(1000 / ev.avgMs).toFixed(1), p95Fps: ev.p95Fps && +ev.p95Fps.toFixed(1), stepMs: r.stepMs && +r.stepMs.toFixed(2), drawMs: r.drawMs && +r.drawMs.toFixed(2), calls: r.info?.calls ?? null, tris: r.info?.triangles ?? null, errs: errs.length }
  rows.push(row); console.log(JSON.stringify(row)); await p.close()
}
await b.close()
fs.writeFileSync('test/out/perf/perf-mvp.json', JSON.stringify({ date: new Date().toISOString(), viewport: '1440x900@2', rows }, null, 1))
const md = ['| Szene | Qualität | dpr | fps Ø | fps p95 | Schritt ms | Zeichnen ms | Draw Calls | Dreiecke |', '|---|---|---|---|---|---|---|---|---|', ...rows.map((r) => `| ${r.scene} | ${r.q} | ${r.dpr} | ${r.avgFps} | ${r.p95Fps} | ${r.stepMs} | ${r.drawMs} | ${r.calls} | ${r.tris} |`)].join('\n')
fs.writeFileSync('test/out/perf/perf-mvp.md', md + '\n'); console.log(md)
