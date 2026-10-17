// M1 · Abnahme 5: Bildrate mit Theater, Gelände, Himmel und Figur auf echter GPU (Apple M4, ANGLE Metal), 1280 × 720 bei Retina-Dichte 2 (wie Georgs
// Bildschirm; M1 rendert mit dpr bis 2), wie scripts/amph/stage-bench.mjs. Prüfung: Median ≥ 58 fps in jedem Abschnitt (Prüfer M1, Befund 19).
// Drei Abschnitte je 5 s: Stehen vor dem Theater · Laufen (Sprint) über den Platz · Fliegen (schnell) über das Gelände. rAF-Abstände: Median, p95, fps.
// Nicht parallel zu anderen Browser-Läufen starten (Messung verfälscht).
import { chromium } from 'playwright'
import path from 'path'
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: +(process.env.M1_DPR || 2) })
await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug')
await p.waitForFunction(() => { const M = window.__kfbM1; const s = M?.status(); return s?.player?.status === 'OK' && s.partner === 'OK' && s.amphTris > 0 }, null, { timeout: 240000 })
await p.waitForTimeout(3000)
const measure = () => p.evaluate(() => new Promise((ok) => { const S0 = { ...window.__kfbM1.clock.stats }, t = [], s0 = window.__kfbM1.clock.steps, t0 = performance.now(); let last = t0; const end = last + 5000; const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else { t.sort((a, b) => a - b); const S1 = window.__kfbM1.clock.stats, d = (k) => S1[k] - S0[k]; ok({ msPerStepNoDraw: +(d('stepMs') / Math.max(1, d('steps'))).toFixed(2), msPerStepWithDraw: +(d('drawMs') / Math.max(1, d('draws'))).toFixed(2), multiStepFrames: d('multi'), stepsPerSec: +((window.__kfbM1.clock.steps - s0) / ((now - t0) / 1000)).toFixed(1), frames: t.length, median: +t[t.length >> 1].toFixed(2), p95: +t[Math.floor(t.length * 0.95)].toFixed(2), fps: +(1000 / t[t.length >> 1]).toFixed(1), dpr: devicePixelRatio, renderer: (() => { const gl = document.querySelector('canvas').getContext('webgl2'); const d = gl?.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : null })() }) } }; requestAnimationFrame(f) }))
const out = {}
out.stand = await measure()
await p.evaluate(() => { window.__kfbM1.player().teleport([0, 1.15 * window.__kfbM1.k, 40 * window.__kfbM1.k], Math.PI / 2); window.__kfbM1.input({ leftward: true, run: true }) })
out.run = await measure()
await p.evaluate(() => { window.__kfbM1.input(null); window.__kfbM1.player().setFlying(true); window.__kfbM1.input({ forward: true, run: true, jump: true }) }) // steigend schnell vorwärts (Kamera schaut leicht nach unten)
await p.waitForTimeout(1500)
out.fly = await measure()
out.flyCheck = await p.evaluate(() => ({ flying: window.__kfbM1.player().flying(), feetY: +window.__kfbM1.feet()[1].toFixed(1) }))
await p.evaluate(() => window.__kfbM1.input(null))
out.info = await p.evaluate(() => { const s = window.__kfbM1.status(); return { pos: s.pos, terrain: s.terrain, amphTris: s.amphTris } })
await b.close(); console.log(JSON.stringify(out))
// Grenzen: Bildschirm-Bilder ≥ 58/s (Median), p95 ≤ 20 ms, Physik-/Logik-Schritte ≥ 58/s (eigene Schleife, ein Durchlauf je Schritt)
// T4 (V-342): Flug p95 ≤ 20 ms und ≤ 1,2 × Boden (Laufen)
out.t4 = { flyP95: out.fly.p95, groundP95: out.run.p95, ratio: +(out.fly.p95 / out.run.p95).toFixed(2) }
const ok = ['stand', 'run', 'fly'].every((k) => out[k].fps >= 58 && out[k].p95 <= 20 && out[k].stepsPerSec >= 58) && out.flyCheck.flying && out.t4.ratio <= 1.2
console.log(ok ? 'PASS m1-bench' : 'FAIL m1-bench')
process.exit(ok ? 0 : 1)
