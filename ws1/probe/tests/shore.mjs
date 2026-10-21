// Ufer-Nachweis: Übersicht in mehreren Abständen (Georgs Werte), Meer + Küste → tests/out/shore/<tag>.png
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync, mkdirSync } from 'node:fs'
mkdirSync('tests/out/shore', { recursive: true }); const tag = process.argv[2] || 'ist'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 120000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === (process?.x || 'Sanfte Hügel')).click()).catch(() => {})
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click())
await set('sunel', '12'); await set('ground', true); await set('water', '0.06'); await set('fluid', '3'); await p.waitForTimeout(2500)
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(800)
for (const [n, y, pi, d] of [['far', 0.6, 0.9, 420], ['mid', 0.6, 0.7, 220], ['near', 0.6, 0.55, 110]]) { await p.evaluate(({ y, pi, d }) => __probeCam(y, pi, d), { y, pi, d }); await p.waitForTimeout(2200); writeFileSync(`tests/out/shore/${tag}-${n}.png`, await p.screenshot()) }
console.log(JSON.stringify({ errs: errs.slice(0, 3) })); await b.close()
