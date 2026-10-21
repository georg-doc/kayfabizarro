// alle Racer: laden ohne Fehler, Fahrbox/Schweben, Standbild je Wagen (Georgs Werte), Fahrt 3 s
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click()); await set('sunel', '12'); await set('ground', true); await set('rivers', false)
const cars = await p.evaluate(() => [...document.getElementById('car').options].map((o) => [o.value, o.textContent]))
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500); const res = []
for (const [c, n] of cars) { await p.evaluate((c) => { const el = document.getElementById('car'); el.value = c; el.dispatchEvent(new Event('change', { bubbles: true })) }, c)
  await p.waitForFunction(() => document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 60000 }); await p.waitForTimeout(1500)
  await p.evaluate(() => __probeDrive().placeCar(-30, 20, 0.6)); await p.waitForTimeout(1200)
  await p.keyboard.down('KeyW'); await p.waitForTimeout(2500); await p.keyboard.up('KeyW'); await p.waitForTimeout(800)
  const st = await p.evaluate(() => { const d = __probeDrive(); return { y: +(d.P.y - __hgt(d.P.x + 0, d.P.z)).toFixed(2), speedOk: Math.hypot(d.P.x + 30, d.P.z - 20) > 5, hud: document.getElementById('hudMode').textContent } })
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.9, 0.45, 12)); await p.waitForTimeout(1500)
  writeFileSync(`tests/out/car-${c}.png`, await p.screenshot({ clip: { x: 160, y: 180, width: 500, height: 330 } })); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(200)
  res.push({ c, n, ...st }) }
console.log(JSON.stringify({ res, errs: errs.slice(0, 4) })); await b.close()
