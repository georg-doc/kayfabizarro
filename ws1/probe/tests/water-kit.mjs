// Probe · Island-Kit-Wasser (Georg 21.10.: Island Kit Fluid 1:1 einbauen). Wasserstand setzen, Ufer suchen, Wagen dorthin, Bilder: Fahrt-Ansicht + Übersicht.
// Aufruf: node tests/water-kit.mjs <Ausgabeordner> [Wasserstand] [fluid]   (fluid 3 = Island Kit, 0 = Probe alt)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp', WL = process.argv[3] || '0.18', FL = process.argv[4] || '3'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
const errs = [], cons = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' || /THREE\.WebGLProgram|ERROR:/.test(m.text())) cons.push(m.text().slice(0, 400)) })
await page.goto('http://localhost:8751/'); if (process.argv[5]) await page.evaluate((v) => { window.__SUNEL = v }, process.argv[5])
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.evaluate(({ WL, FL }) => { const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }; set('water', WL); set('fluid', FL); if (window.__SUNEL) set('sunel', window.__SUNEL) }, { WL, FL })
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(1200)
const info = await page.evaluate(async () => { const S = __S, wl = S.water * S.amp + 0.15; let best = null
  for (let i = 0; i < 3000; i++) { const x = (Math.random() - 0.5) * 260, z = (Math.random() - 0.5) * 260, h = __hgt(x, z); if (h > wl + 0.6 && h < wl + 1.5) { const a = Math.random() * 6.283, x2 = x + Math.cos(a) * 9, z2 = z + Math.sin(a) * 9; if (__hgt(x2, z2) < wl - 1) { best = { x, z, yaw: Math.atan2(Math.cos(a), Math.sin(a)) }; break } } }
  if (best) { __probeDrive().placeCar(best.x - Math.sin(best.yaw) * 4, best.z - Math.cos(best.yaw) * 4, best.yaw) }
  await new Promise((r) => setTimeout(r, 2500)); return { wl: +wl.toFixed(2), found: !!best, fluid: S.fluid } })
console.log(JSON.stringify(info))
await page.screenshot({ path: `${OUT}/water-drive.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
await page.getByRole('button', { name: 'Übersicht', exact: true }).click(); await page.waitForTimeout(2000)
await page.screenshot({ path: `${OUT}/water-over.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
const page2 = page; await page2.evaluate(() => { window.__probeCam && __probeCam(0.6, 0.55, 12) }); await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/water-close.png`, clip: { x: 16, y: 106, width: 724, height: 450 } })
console.log('errs', JSON.stringify(errs.slice(0, 3)), 'console', JSON.stringify(cons.slice(0, 3))); await browser.close()
