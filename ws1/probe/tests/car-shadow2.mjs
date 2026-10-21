// Wagenschatten nah in Georgs Werten (Sonne 12°, Erdung an): je Wagen ein Standbild von oben schräg; dazu Schatten-Kennwerte (Kartengröße, Ausschnitt, Taps)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const TAG = process.argv[2] || 'cs', CARS = (process.argv[3] || 'rustwing_cruiser').split(',')
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click()); await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('rivers', false)
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(800)
const info = await p.evaluate(() => { const R = window.__renderer; let sun = null; let root = __probeDrive().carRoot; while (root.parent) root = root.parent; root.traverse((o) => { if (o.isDirectionalLight && o.castShadow) sun = o })
  return sun ? { map: sun.shadow.mapSize.toArray(), cam: [sun.shadow.camera.left, sun.shadow.camera.right], bias: sun.shadow.bias, nb: sun.shadow.normalBias, type: R.shadowMap.type, shadowdyn: __S.shadowdyn, hero: __S.hero } : null })
for (const c of CARS) { await p.evaluate((c) => { const el = document.getElementById('car'); el.value = c; el.dispatchEvent(new Event('change', { bubbles: true })) }, c); await p.waitForTimeout(3000)
  await p.evaluate(() => { const d = __probeDrive(); let best = null; for (let i = 0; i < 600 && !best; i++) { const x = (i % 30) * 6 - 90, z = Math.floor(i / 30) * 6 - 60, e = 2, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)) / (2 * e); if (s < 0.04 && __hgt(x, z) > 3) best = [x, z] } d.placeCar(best[0], best[1], 0.6) })
  await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.9, 1.0, 13)); await p.waitForTimeout(2200)
  writeFileSync(`tests/out/${TAG}-${c}.png`, await p.screenshot({ clip: { x: 16, y: 106, width: 724, height: 450 } })); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(300) }
console.log(JSON.stringify({ info, errs: errs.slice(0, 3) })); await b.close()
