// Volumen + Unterwasser: Georgs Werte; Wagen auf den tiefsten Seegrund, Fahrtkamera (unter Wasser) und Übersicht schräg; Fluss von oben
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const OUT = '/Users/georgvonwestphalen/kfb-ws1/probe/tests/out', TAG = process.argv[2] || 'uw', PR = process.argv[3] || 'Grat-Gebirge'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/program not valid|ERROR:|Shader Error/i.test(m.text())) errs.push(m.text().slice(0, 300)) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await p.evaluate((n) => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === n).click(), PR)
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('rivers', true); await p.waitForTimeout(4000)
const CL = { x: 16, y: 106, width: 724, height: 450 }
const spot = await p.evaluate(() => { const R = __RIVD, N = R.N, D = R.data; let best = null; for (let j = 0; j < N; j += 2) for (let i = 0; i < N; i += 2) { const k = (j * N + i) * 4; if (D[k + 3] < -900) continue; const x = R.ox + (i + 0.5) * R.size / N, z = R.oz + (j + 0.5) * R.size / N, d = D[k + 3] - __hgt(x, z); if (!best || d > best.d) best = { x, z, d, lv: D[k + 3] } } return best })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500)
await p.evaluate((s) => __probeDrive().placeCar(s.x, s.z, 0.7), spot); await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(200); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)
const st = await p.evaluate(() => ({ under: __UNDER.quad.visible, camY: +__probeDrive().camera.position.y.toFixed(2) }))
writeFileSync(`${OUT}/${TAG}-drive.png`, await p.screenshot({ clip: CL }))
console.log(JSON.stringify(await p.evaluate(() => { const c = __probeDrive().camera, P = __probeDrive().P, wx = c.position.x + P.x, wz = c.position.z + P.z, R = __RIVD, N = R.N, i = Math.floor((wx - R.ox) / R.size * N), j = Math.floor((wz - R.oz) / R.size * N), k = (j * N + i) * 4; return { cam: [wx, c.position.y, wz], lvHere: R.data[k + 3], wHere: R.data[k + 1], hCam: __hgt(wx, wz), car: [P.x, P.y, P.z], falls: __RIVER.ST.falls.filter((f) => Math.hypot(f.x - P.x, f.z - P.z) < 60) } })))
for (const v of [0, 1, 2]) { await p.evaluate((v) => { __RIVER.group.children.forEach((m, i) => m.visible = i !== v) }, v); await p.waitForTimeout(300); writeFileSync(`${OUT}/${TAG}-drive-no${v}.png`, await p.screenshot({ clip: CL })); await p.evaluate(() => { __RIVER.group.children.forEach((m) => m.visible = true) }) }
console.log(JSON.stringify(await p.evaluate(() => __RIVER.group.children.map((m) => [m.material.type, m.geometry.attributes.position.count]))))
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.7, 0.55, 30)); await p.waitForTimeout(2500); writeFileSync(`${OUT}/${TAG}-over.png`, await p.screenshot({ clip: CL }))
console.log(JSON.stringify({ spot, st, errs: errs.slice(0, 3) })); await b.close()
