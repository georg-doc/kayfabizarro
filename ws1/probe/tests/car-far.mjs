// Fahrzeug aus der Ferne: Übersicht in 3 Abständen, Look A, Wüsten-Palette ähnlich Georgs Bild → tests/out/vehicles/far-<tag>-<d>.png (Ausschnitt um den Wagen)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const tag = process.argv[2] || 'neu', car = process.argv[3] || 'graffiti_jet_cruiser'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 120000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (!el) return; if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Wirbel-Dünen').click()); await set('sunel', '12'); await set('ground', true)
await set('car', car); await p.waitForFunction(() => document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 }); await p.waitForTimeout(800)
if (process.argv[4]) { await set('carlook', process.argv[4]); await p.waitForTimeout(600) }
const look = await p.evaluate(() => document.getElementById('carlook').value)
await p.getByRole('button', { name: 'Übersicht', exact: true }).click()
for (const d of [20, 60, 120]) { await p.evaluate((d) => __probeCam(0.9, 0.5, d), d); await p.waitForTimeout(1800); writeFileSync(`tests/out/vehicles/far-${tag}-${d}.png`, await p.screenshot({ clip: { x: 228, y: 232, width: 360, height: 240 } })) }
console.log(JSON.stringify({ look, errs: errs.slice(0, 3) })); await b.close()
