// Wagen-Erdung alt/neu am Hang: Georgs Werte, Wagen auf ~15° Hang, Standbild Nahkamera
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const [name, url] of [['old', 'http://localhost:8751/old.html'], ['new', 'http://localhost:8751/']]) { const p = await b.newPage({ viewport: { width: 900, height: 600 } })
  await p.goto(url); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
  const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
  await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true)
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(600)
  await p.evaluate(() => { let best = null, bs = 0; for (let i = 0; i < 3000; i++) { const x = 40 + (i % 60) * 2.1, z = -60 + Math.floor(i / 60) * 2.3, e = 1.5, gx = (__hgt(x + e, z) - __hgt(x - e, z)) / (2 * e), gz = (__hgt(x, z + e) - __hgt(x, z - e)) / (2 * e), sl = Math.hypot(gx, gz); if (sl > 0.22 && sl < 0.32 && (!best || Math.abs(sl - 0.27) < Math.abs(bs - 0.27))) { best = [x, z, Math.atan2(gx, gz) + 1.57]; bs = sl } } __probeDrive().placeCar(best[0], best[1], best[2]); window.__spot = [best, bs] })
  await p.waitForTimeout(2500); await p.screenshot({ path: `tests/out/carground-${name}.png`, clip: { x: 16, y: 106, width: 724, height: 450 } }); console.log(name, JSON.stringify(await p.evaluate(() => window.__spot))); await p.close() }
await b.close()
