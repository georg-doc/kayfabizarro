// Probe · Bildzeit je Leistungsstufe (hoch/mittel/niedrig), Fahrkamera, 1440×900 @1,25 – 2 Runden abwechselnd, Median
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(2500)
const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 120; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return a[60] })
const set = (v) => p.evaluate((v) => { const el = document.getElementById('perfLevel'); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })) }, v)
const R = { hoch: [], mittel: [], niedrig: [] }
for (let r = 0; r < 2; r++) for (const L of ['hoch', 'mittel', 'niedrig']) { await set(L); await p.waitForTimeout(2000); R[L].push(await med()) }
console.log(JSON.stringify(Object.fromEntries(Object.entries(R).map(([k, v]) => [k, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)])))); await b.close()
