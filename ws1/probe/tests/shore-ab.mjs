// Ufer A/B: gleiche Kamera, Flüsse an/aus, Meer an/aus → tests/out/shore/ab-<v>.png
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 120000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click())
await set('sunel', '12'); await set('ground', true); await set('water', '0.06'); await set('fluid', '3'); await p.waitForTimeout(2500)
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate((c) => __probeCam(...c), [+(process.env.CY||0.6), +(process.env.CP||0.55), +(process.env.CD||110)]); await p.waitForTimeout(2500)
const shot = async (v) => { await p.waitForTimeout(2500); writeFileSync(`tests/out/shore/ab-${process.argv[2] || ''}${v}.png`, await p.screenshot({ clip: { x: 16, y: 106, width: 724, height: 452 } })) }
await shot('ist'); await set('rivers', false); await shot('ohneFluss'); await set('rivers', true); await set('water', '0'); await shot('ohneMeer')
const info = await p.evaluate(() => ({ wl: __S.water * __S.amp + 0.15, amp: __S.amp }))
console.log(JSON.stringify({ info, errs: errs.slice(0, 3) })); await b.close()
