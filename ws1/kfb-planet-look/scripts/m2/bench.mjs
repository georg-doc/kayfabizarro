// M2 · Raster (c): Bildrate beim Fahren auf echter GPU (Apple M4, ANGLE Metal), 1280 × 720 bei dpr 2 wie scripts/m1/bench.mjs. Je Kandidat 6 s Vollgas
// vom Platz hinaus über die Hügel (Kuppen = Sprünge). Grenze (WS0 zu V-313): Median 60 fps (≥ 58) und kein Bild über 33 ms. Nicht parallel zu
// anderen Browser-Läufen starten. node scripts/m2/bench.mjs
import { chromium } from 'playwright'
import path from 'path'
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,car')
await p.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
await p.waitForTimeout(3000)
const measure = (ms) => p.evaluate((ms) => new Promise((ok) => { const t = [], t0 = performance.now(); let last = t0, air = 0; const end = t0 + ms
  const f = (now) => { t.push(now - last); last = now; if (window.__kfbM2.car().grounded() === 0) air++; if (now < end) requestAnimationFrame(f); else { const s = [...t].sort((a, b) => a - b); ok({ frames: t.length, median: +s[s.length >> 1].toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2), max: +s.at(-1).toFixed(1), over33: t.filter((x) => x > 33).length, fps: +(1000 / s[s.length >> 1]).toFixed(1), airFrames: air }) } }
  requestAnimationFrame(f) }), ms)
const out = {}
for (const kind of ['ecctrl', 'k2b']) {
  await p.evaluate((k) => { window.__kfbM2.setKind(k, { p: [40, 2, 34], yaw: Math.PI / 2 }) }, kind); await p.waitForTimeout(1500)
  await p.evaluate(() => window.__kfbM1.input({ forward: true })); await p.waitForTimeout(300)
  out[kind] = await measure(6000)
  await p.evaluate(() => window.__kfbM1.input(null))
}
console.log(JSON.stringify(out)); await b.close()
const ok = ['ecctrl', 'k2b'].every((k) => out[k].fps >= 58 && out[k].over33 === 0)
console.log(ok ? 'PASS m2-bench' : 'FAIL m2-bench')
process.exit(ok ? 0 : 1)
