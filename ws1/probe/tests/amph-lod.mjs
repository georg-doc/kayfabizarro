// D5 Amphitheater-LOD: Original (349k) gegen LOD (59k): Bild aus 30 m und 70 m (Spielkamera), Bildzeit Median
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), out = {}
for (const [name, u] of [['orig', '/assets/amph.v1.glb'], ['lod', '/assets/amph.lod60k.glb'], ['orig2', '/assets/amph.v1.glb'], ['lod2', '/assets/amph.lod60k.glb']]) { const p = await b.newPage({ viewport: { width: 1100, height: 700 } })
  await p.addInitScript((u) => { window.__AMPH_URL = u }, u); await p.goto('http://localhost:8751/')
  await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
  const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
  await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('dio', true)
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(6000)
  const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 150; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[75].toFixed(1) })
  const r = {}
  for (const d of [30, 70]) { await p.evaluate((d) => { const D = { x: 0, z: 70, open: -Math.PI / 2 }; const F = [Math.cos(D.open), Math.sin(D.open)]; __probeDrive().placeCar(D.x + F[0] * d, D.z + F[1] * d, Math.atan2(-F[0], -F[1])) }, d); await p.waitForTimeout(2500)
    r['ms' + d] = await med(); if (!name.endsWith('2')) await p.screenshot({ path: `tests/out/amph-${name}-${d}.png`, clip: { x: 16, y: 106, width: 724, height: 450 } }) }
  out[name] = r; await p.close() }
console.log(JSON.stringify(out)); await b.close()
