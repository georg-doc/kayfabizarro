// Fahrzeug-Look: alle Racer × Original / A Lack / B Knete, gleiche Kamera, Georgs Werte (Sonne 12°, Boden an) → tests/out/vehicles/look-<id>-<mode>.png + Bogen
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync, mkdirSync } from 'node:fs'
mkdirSync('tests/out/vehicles', { recursive: true })
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'warning' && /carLook/.test(m.text())) errs.push(m.text()) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 120000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click()); await set('sunel', '12'); await set('ground', true); await set('rivers', false)
const only = process.argv[2] ? process.argv[2].split(',') : null
const cars = (await p.evaluate(() => [...document.getElementById('car').options].map((o) => [o.value, o.textContent]))).filter(([c]) => !only || only.includes(c))
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(400); const res = []
for (const [c, n] of cars) { await set('car', c); await p.waitForFunction(() => document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 }); await p.waitForTimeout(800)
  await p.evaluate(() => __probeDrive().placeCar(-30, 20, 0.6)); await p.waitForTimeout(900)
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.9, 0.45, 12)); await p.waitForTimeout(900)
  for (const mode of ['0', '1', '2']) { await set('carlook', mode); await p.waitForTimeout(700); writeFileSync(`tests/out/vehicles/look-${c}-${mode}.png`, await p.screenshot({ clip: { x: 210, y: 200, width: 400, height: 280 } })) }
  res.push({ c, n, gain: await p.evaluate(() => window.__carLook) }); await set('carlook', '0'); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(200) }
console.log(JSON.stringify({ n: res.length, errs: errs.slice(0, 4) })); await b.close()
