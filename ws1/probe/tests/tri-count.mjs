// Dreiecke und Draw-Calls je Bild (lastunabhängig): alt (old.html) gegen neu, Fahrt Richtung Amphitheater
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const url of ['http://localhost:8751/old.html', 'http://localhost:8751/']) { const p = await b.newPage({ viewport: { width: 1100, height: 700 } })
  await p.goto(url); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(1000); await p.evaluate(() => __probeDrive().placeCar(0, 25, 0)); await p.waitForTimeout(8000)
  const r = await p.evaluate(async () => { const R = window.__renderer; R.info.autoReset = false; R.info.reset(); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); const i = R.info.render; const o = { tris: i.triangles, calls: i.calls }; R.info.autoReset = true; return o })
  console.log(url.includes('old') ? 'old' : 'new', JSON.stringify(r)); await p.close() }
await b.close()
