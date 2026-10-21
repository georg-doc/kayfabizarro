// BAKE: Bild gebacken gegen ungebacken (gleiches Bild?), Zahl der Back-Läufe, Bildzeit Übersicht/Fahrt im Wechsel
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/bake|error/i.test(m.text())) errs.push(m.text().slice(0, 300)) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true)
const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 120; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[60].toFixed(1) })
const CL = { x: 16, y: 106, width: 724, height: 450 }
const res = {}
for (const mode of ['Übersicht', 'Fahren']) { await p.getByRole('button', { name: mode, exact: true }).click(); await p.waitForTimeout(3000)
  const r = { on: [], off: [] }
  for (let i = 0; i < 3; i++) { await p.evaluate(() => { window.__BAKE_OFF = 0 }); await p.waitForTimeout(800); r.on.push(await med()); await p.evaluate(() => { window.__BAKE_OFF = 1 }); await p.waitForTimeout(800); r.off.push(await med()) }
  await p.evaluate(() => { window.__BAKE_OFF = 0 }); await p.waitForTimeout(800); const a = await p.screenshot({ clip: CL }); await p.evaluate(() => { window.__BAKE_OFF = 1 }); await p.waitForTimeout(800); const bb = await p.screenshot({ clip: CL }); await p.evaluate(() => { window.__BAKE_OFF = 0 })
  const tag = mode === 'Fahren' ? 'drive' : 'over'; (await import('node:fs')).writeFileSync(`tests/out/bake-${tag}-on.png`, a); (await import('node:fs')).writeFileSync(`tests/out/bake-${tag}-off.png`, bb)
  const diff = await p.evaluate(async ([a, bb]) => { const ld = (s) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = s }); const A = await ld(a), B = await ld(bb), c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const x = c.getContext('2d'); x.drawImage(A, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data; x.drawImage(B, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data; let n = 0, big = 0; for (let i = 0; i < da.length; i += 4) { const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]); if (d > 12) n++; if (d > 60) big++ } return { pct12: +(100 * n / (da.length / 4)).toFixed(2), pct60: +(100 * big / (da.length / 4)).toFixed(2) } }, ['data:image/png;base64,' + a.toString('base64'), 'data:image/png;base64,' + bb.toString('base64')])
  const md = (v) => [...v].sort((x, y) => x - y)[1]; res[tag] = { onMs: md(r.on), offMs: md(r.off), diff } }
res.bakes = await p.evaluate(() => __BAKE.list.map((B) => B.n)); res.names = await p.evaluate(() => __BAKE.names.length)
console.log(JSON.stringify({ res, errs: errs.slice(0, 4) })); await b.close()
