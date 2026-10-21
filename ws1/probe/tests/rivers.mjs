// Flüsse F2: Georgs Werte; Statistik (Läufe, Seen, Rechenzeit), Rinne JS gegen GPU (BAKE-Rücklese an Flusspunkten), Bilder Übersicht + Fahrt am Fluss
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { writeFileSync } from 'node:fs'
const OUT = '/Users/georgvonwestphalen/kfb-ws1/probe/tests/out', TAG = process.argv[2] || 'riv', PRESET = process.argv[3] || ''
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/program not valid|ERROR:|river|Shader Error/i.test(m.text())) errs.push(m.text().slice(0, 300)) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
if (PRESET) await p.evaluate((n) => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === n).click(), PRESET)
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('rivers', true); await p.waitForTimeout(4000)
const st = await p.evaluate(() => JSON.parse(JSON.stringify(__RIVER.ST)))
const CL = { x: 16, y: 106, width: 724, height: 450 }
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.evaluate(() => __probeCam(0.8, 1.0, 420)); await p.waitForTimeout(3000); writeFileSync(`${OUT}/${TAG}-over.png`, await p.screenshot({ clip: CL }))
// längster Fluss: Wagen ans Ufer, Blick flussabwärts
const spot = await p.evaluate(() => { const L = [...__RIVER.ST.lines].sort((a, b) => b.len - a.len)[0]; return L })
let near = null
if (spot) { near = await p.evaluate(() => { const g = __RIVER.group.children[0]; const LL = __RIVER.ST.lines; let off = 0, best = -1, bo = 0; LL.forEach((l, i) => { if (best < 0 || l.len > LL[best].len) { best = i; bo = off } off += l.n * 9 }); if (!g) return null; const pa = g.geometry.attributes.position, lv = g.geometry.attributes.aLvl; const k = bo + Math.floor(LL[best].n * 0.4) * 9 + 4; return { x: pa.getX(k), z: pa.getZ(k), lv: lv.getX(k), x2: pa.getX(k + 45), z2: pa.getZ(k + 45), hC: __hgt(pa.getX(k), pa.getZ(k)), hB: __hgt(pa.getX(k - 2), pa.getZ(k - 2)) } })
  await p.evaluate((n) => { const a = Math.atan2(n.x2 - n.x, n.z2 - n.z), d = __probeDrive(); d.placeCar(n.x - Math.sin(a) * 14 + Math.cos(a) * 9, n.z - Math.cos(a) * 14 - Math.sin(a) * 9, a); __probeCam(a + Math.PI + 0.5, 0.45, 40) }, near); await p.waitForTimeout(3000); writeFileSync(`${OUT}/${TAG}-near-over.png`, await p.screenshot({ clip: CL }))
  await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3500); writeFileSync(`${OUT}/${TAG}-drive.png`, await p.screenshot({ clip: CL })) }
console.log(JSON.stringify({ maxA: st.maxA, seaFrac: st.seaFrac, lines: st.lines.length, lakes: st.lakes.length, ms: st.ms, builds: st.n, longest: spot, near, sample: st.lines.slice(0, 6), lakeList: st.lakes.slice(0, 6), errs: errs.slice(0, 4) }))
await b.close()
