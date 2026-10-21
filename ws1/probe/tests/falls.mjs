// Wasserfälle F3: Georgs Werte, je Rezept Zahl/Höhe der Fälle; Bilder am höchsten Fall (Übersicht schräg, Fahrtkamera vom Unterlauf)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const OUT = '/Users/georgvonwestphalen/kfb-ws1/probe/tests/out', TAG = process.argv[2] || 'fall', PRESETS = (process.argv[3] || 'Grat-Gebirge').split(',')
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/program not valid|ERROR:|river|Shader Error/i.test(m.text())) errs.push(m.text().slice(0, 300)) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
const CL = { x: 16, y: 106, width: 724, height: 450 }
for (const pr of PRESETS) { await p.evaluate((n) => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === n).click(), pr)
  await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('rivers', true); await p.waitForTimeout(4000)
  const F = await p.evaluate(() => (__RIVER.ST.falls || []).slice())
  const top = [...F].sort((a, b) => b.h - a.h)[0], tag = TAG + '-' + pr.slice(0, 4)
  console.log(pr, JSON.stringify({ falls: F.length, heights: F.map((f) => f.h).sort((a, b) => b - a).slice(0, 8), top }))
  if (!top) continue
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click()
  const fall = await p.evaluate((t) => __RIVER.ST.falls.find((f) => f.x === t.x && f.z === t.z), top)
  await p.evaluate((t) => { const d = __probeDrive(); d.placeCar(t.x, t.z, 0); d.carRoot.visible = false }, fall); await p.waitForTimeout(2500)
  for (const [k, y, pi, dd] of [['o1', 0.6, 0.35, 22], ['o2', 2.2, 0.25, 18]]) { await p.evaluate(([y, pi, dd]) => __probeCam(y, pi, dd), [y, pi, dd]); await p.waitForTimeout(1500); writeFileSync(`${OUT}/${tag}-${k}.png`, await p.screenshot({ clip: CL })) }
  await p.evaluate(() => { __probeDrive().carRoot.visible = true })
  const spot = await p.evaluate((f) => { const ux = (f.bx - f.ax), uz = (f.bz - f.az), l = Math.hypot(ux, uz) || 1, dx = ux / l, dz = uz / l; const wl = __S.water * __S.amp + 0.3; let best = null
    for (const d of [22, 26, 30, 18, 34]) for (const s of [6, -6, 9, -9, 12, -12]) { const x = f.bx + dx * d - dz * s, z = f.bz + dz * d + dx * s, h = __hgt(x, z); if (h > wl && (!best || Math.abs(h - (f.top - f.h)) < Math.abs(best.h - (f.top - f.h)))) best = { x, z, h, a: Math.atan2(-dx, -dz) } }
    if (best) __probeDrive().placeCar(best.x, best.z, best.a); return best }, fall)
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500); await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(200); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)
  writeFileSync(`${OUT}/${tag}-drive.png`, await p.screenshot({ clip: CL }))
  if (process.env.RIVDBG) { await p.evaluate(() => { __terrain.material.uniforms.uRivDbg.value = 3 }); await p.waitForTimeout(300); writeFileSync(`${OUT}/${tag}-drive-dbg.png`, await p.screenshot({ clip: CL })); await p.evaluate(() => { __terrain.material.uniforms.uRivDbg.value = -1 }) } }
console.log(JSON.stringify({ errs: errs.slice(0, 4) })); await b.close()
