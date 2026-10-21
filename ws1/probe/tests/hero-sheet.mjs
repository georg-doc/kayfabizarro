// Heldenfarbe an/aus je Racer: Draufsicht nah, gleiche Stelle, Georgs Werte
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const TAG = process.argv[2] || 'hero'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click()); await set('sunel', '12'); await set('ground', true); await set('rivers', false)
const cars = await p.evaluate(() => [...document.getElementById('car').options].map((o) => o.value))
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500)
for (const c of cars) for (const hero of [true, false]) { await set('hero', hero); await p.evaluate((c) => { const el = document.getElementById('car'); if (el.value !== c) { el.value = c; el.dispatchEvent(new Event('change', { bubbles: true })) } }, c); await p.waitForTimeout(2500)
  await p.evaluate(() => { const d = __probeDrive(); d.placeCar(-30, 20, 0.6) }); await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.9, 1.1, 10)); await p.waitForTimeout(1800)
  writeFileSync(`tests/out/${TAG}-${c}-${hero ? 'on' : 'off'}.png`, await p.screenshot({ clip: { x: 230, y: 200, width: 360, height: 300 } })); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(200) }
console.log(cars.join(',')); await b.close()
