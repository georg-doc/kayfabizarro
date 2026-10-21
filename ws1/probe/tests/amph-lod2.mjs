// D5: Amphitheater Original gegen LOD aus der Übersicht, nah (Wagen vor der Öffnung)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const [name, u] of [['orig', '/assets/amph.v1.glb'], ['lod', '/assets/amph.lod60k.glb']]) { const p = await b.newPage({ viewport: { width: 1100, height: 700 } })
  await p.addInitScript((u) => { window.__AMPH_URL = u }, u); await p.goto('http://localhost:8751/')
  await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
  const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
  await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('dio', true)
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(1000); await p.evaluate(() => __probeDrive().placeCar(0, 52, 0)); await p.waitForTimeout(1500)
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(5000)
  for (const [tag, y, pi, d] of [['close', 3.14, 0.28, 16], ['side', 2.2, 0.35, 22]]) { await p.evaluate(([y, pi, d]) => __probeCam(y, pi, d), [y, pi, d]); await p.waitForTimeout(1500); await p.screenshot({ path: `tests/out/amphO-${name}-${tag}.png`, clip: { x: 16, y: 106, width: 724, height: 450 } }) }
  await p.close() }
await b.close()
