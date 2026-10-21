// Probe · Dioramen-Test O-Town (Disco + Ork-Band, Anker 1–2): einschalten, Terrassen eben (Streuung ≤ 0,03 m), Bilder aus Spielkamera und Übersicht
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/otown/.test(m.text())) errs.push(m.text().slice(0, 200)) })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.evaluate(() => { const el = document.getElementById('otown'); if (!el.checked) el.click() }); await p.waitForTimeout(7000)
const info = await p.evaluate(() => { const { DISCO_A: D, BAND_A: B, OT } = __OT; const flat = (A, rad) => { const hs = []; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283, r = (i % 4) / 4 * rad; hs.push(__hgt(A.x + Math.cos(a) * r, A.z + Math.sin(a) * r)) } return +(Math.max(...hs) - Math.min(...hs)).toFixed(3) }
  return { disco: { x: +D.x.toFixed(1), z: +D.z.toFixed(1), y: +D.y.toFixed(2), on: D.on, flat: flat(D, D.R - 1) }, band: { x: +B.x.toFixed(1), z: +B.z.toFixed(1), y: +B.y.toFixed(2), on: B.on, flat: flat(B, 2.5) }, props: OT.group.children.length } })
console.log(JSON.stringify({ info, errs: errs.slice(0, 4) }))
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500)
await p.evaluate(() => { const D = __OT.DISCO_A, F = [Math.cos(D.open), Math.sin(D.open)]; __probeDrive().placeCar(D.x + F[0] * 26, D.z + F[1] * 26, Math.atan2(-F[0], -F[1])) }); await p.waitForTimeout(3000)
await p.screenshot({ path: `${OUT}/otown-drive.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(1000); await p.evaluate(() => __probeCam(0.3, 0.6, 50)); await p.waitForTimeout(2000)
await p.screenshot({ path: `${OUT}/otown-over.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
await b.close()
