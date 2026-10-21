// F5: JS-Zeit je Regler-Ereignis (alt/neu): sunel (nur Licht) und amp (Gelände); Kontrolle, dass amp weiter neu aufbaut (Steinband-Lage ändert sich)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const url of ['http://localhost:8751/old.html', 'http://localhost:8751/']) { const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(url); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 }); await p.waitForTimeout(4000)
  const r = await p.evaluate(() => { const ev = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })) }
    const time = (id, vals) => { const t0 = performance.now(); for (const v of vals) ev(id, v); return +((performance.now() - t0) / vals.length).toFixed(2) }
    const sig = () => { let k = 0; window.__OT && 0; const sc = __probeDrive().carRoot; let root = sc; while (root.parent) root = root.parent; root.traverse((o) => { if (o.isInstancedMesh) k += o.count }); return k }
    const sun0 = document.getElementById('sunel').value, amp0 = document.getElementById('amp').value
    const a = time('sunel', [20, 30, 40, 50, 25, 35, 45, 55, 30, +sun0]); const c0 = sig(); const bb = time('amp', [+amp0 + 4, +amp0 + 8, +amp0]); return { sunelMs: a, ampMs: bb, inst: c0 } })
  console.log(url.includes('old') ? 'old' : 'new', JSON.stringify(r), errs.slice(0, 2)); await p.close() }
await b.close()
