// Ruck beim Neuberechnen der Flüsse: Wagen fährt (W gehalten) über ~40 s; längstes Bild und Bilder > 50 ms, Flüsse an/aus; dazu Slices der letzten Berechnung
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Wirbel-Dünen').click())
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await p.getByRole('button', { name: 'Fahren', exact: true }).click()
const out = {}
for (const on of [true, false]) { await set('rivers', on); await p.waitForTimeout(3000)
  const r = await p.evaluate(async () => { const d = __probeDrive(); let max = 0, n50 = 0, t0 = performance.now(), last = t0, frames = 0; const jumps = []
    for (let k = 0; k < 6; k++) { d.placeCar(d.P.x + 170, d.P.z + 40, 1.3); const tj = performance.now(); let mj = 0
      while (performance.now() - tj < 2500) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(), dt = t - last; last = t; frames++; if (dt > mj) mj = dt; if (dt > 50) n50++ } jumps.push(+mj.toFixed(0)); max = Math.max(max, mj) }
    return { max: +max.toFixed(0), n50, jumps, frames, st: { builds: __RIVER.ST.n, ms: __RIVER.ST.ms, slices: __RIVER.ST.slices, maxSlice: __RIVER.ST.maxSlice, at: __RIVER.BG.maxAt } } })
  out[on ? 'on' : 'off'] = r }
console.log(JSON.stringify({ ...out, errs: errs.slice(0, 3) })); await b.close()
