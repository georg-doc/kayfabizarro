// A/B Bildzeit alt (old.html) gegen neu (index.html): Georgs Werte, 1440×900 DPR 2 (Pixeldichte im Code 1,25), Fahrt + Übersicht, 3× abwechselnd, Median
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
async function run(url) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(url); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
  const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
  await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true)
  const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 150; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[75].toFixed(1) })
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3500); const drive = await med()
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(3000); const over = await med()
  await p.close(); return { drive, over, errs: errs.slice(0, 2) } }
const R = { old: [], neu: [] }
for (let i = 0; i < 3; i++) { R.old.push(await run('http://localhost:8751/old.html')); R.neu.push(await run('http://localhost:8751/')) }
const m = (a, k) => a.map((x) => x[k]).sort((x, y) => x - y)[1]
console.log(JSON.stringify({ old: { drive: m(R.old, 'drive'), over: m(R.old, 'over') }, neu: { drive: m(R.neu, 'drive'), over: m(R.neu, 'over') }, raw: R })); await b.close()
