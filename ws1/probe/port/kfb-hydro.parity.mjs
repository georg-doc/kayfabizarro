// Parität kfb-hydro.v1.js (erzeugt) gegen die Probe: gleicher Eingang → Feld bitgleich, gleiche Läufe/Seen/Fälle; je Rezept
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 900, height: 600 } })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => window.__probeDrive && document.getElementById('hudMode').textContent !== 'Racer lädt …', null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
let ok = true
for (const n of (process.argv[2] || 'Sanfte Hügel,Grat-Gebirge,Wirbel-Dünen').split(',')) { await p.evaluate((n) => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === n).click(), n); await set('water', '0.06'); await set('rivers', true)
  await p.waitForFunction(() => __RIVER.ST.n > 0 && !__RIVER.BG.gen && window.__HYDRO_IN, null, { timeout: 30000 }); await p.waitForTimeout(1500); await p.waitForFunction(() => !__RIVER.BG.gen)
  const r = await p.evaluate(async () => { const M = await import('/kfb-hydro.v1.js'), I = window.__HYDRO_IN, out = M.hydro({ ...I, hgt: window.__hgtBase }), D = __RIVD.data, F = out.field.data
    let diff = 0, maxd = 0; for (let i = 0; i < D.length; i++) { const d = Math.abs(D[i] - F[i]); if (d > 0) diff++; if (d > maxd) maxd = d }
    return { texDiff: diff, maxd, lines: [out.lines.length, __RIVER.ST.lines.length], lakes: [out.lakes.length, __RIVER.ST.lakes.length], falls: [out.falls.length, __RIVER.ST.falls.length], ribbonVerts: out.ribbon.pos.length / 3, origin: [out.field.ox === __RIVD.ox, out.field.oz === __RIVD.oz] } })
  const pass = r.texDiff === 0 && r.lines[0] === r.lines[1] && r.lakes[0] === r.lakes[1] && r.falls[0] === r.falls[1] && r.origin.every(Boolean); ok = ok && pass
  console.log(pass ? 'PASS' : 'FAIL', n, JSON.stringify(r)) }
await b.close(); process.exit(ok ? 0 : 1)
