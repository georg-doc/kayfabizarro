// Probe · Bildzeit-Paar für einen Schalter (Georg 21.10.: „wie teuer wäre die Clay-Textur?“). Median über 240 Frames je Zustand, gleiche Kamera.
// Aufruf: node tests/perf-pair.mjs <checkbox-id> [<checkbox-id2> ...]
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const IDS = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)
const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 120; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[60].toFixed(1) })
const out = {}
for (const id of IDS) { const set = (v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.checked !== v) el.click() }, { id, v })
  const ds = [], ons = [], offs = []; for (let r = 0; r < 3; r++) { await set(false); await p.waitForTimeout(1200); const off = await med(); await set(true); await p.waitForTimeout(1800); const on = await med(); ds.push(on - off); ons.push(on); offs.push(off) }
  await set(true); ds.sort((a, b) => a - b); const mid = (a) => [...a].sort((x, y) => x - y)[1]; out[id] = { offMs: +mid(offs).toFixed(1), onMs: +mid(ons).toFixed(1), deltaMs: +ds[1].toFixed(1), spread: +(ds[2] - ds[0]).toFixed(1) } }   /* 3× abwechselnd, Median: andere Sitzungen teilen sich die GPU */
console.log(JSON.stringify(out)); await b.close()
