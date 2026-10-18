// Elan S1 · Sichtbilder (replay, gerendert): Abheben im Schwungflug, Sturz mit Schub (Kondensstreifen, Manöver-Linien, FOV), Ringe und Perlen.
// → test/out/elan/shot_<n>.png
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
fs.mkdirSync('test/out/elan', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,replay,flight=elan', { viewport: { width: 960, height: 540 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const go = (fn) => page.evaluate(fn)
await go(async () => { const M = window.__kfbM1, C = M.clock, P = M.player(), K = M.k, steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), I = (o) => M.input(o ? { wow: true, ...o } : null)
  P.teleport([0, 1.2 * K, 30 * K], Math.PI); await steps(40); I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(10); I({ jump: true }); P.spaceTap(); await steps(3); I(null); await steps(50)
  for (let i = 0; i < 3; i++) { I({ jump: true }); await steps(2); I(null); await steps(40) } })
await page.screenshot({ path: 'test/out/elan/shot_1.png' })
await go(async () => { const M = window.__kfbM1, C = M.clock, steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), I = (o) => M.input(o ? { wow: true, ...o } : null)
  I({ forward: true }); await steps(80); I({ forward: true, run: true }); await steps(2); I({ forward: true }); await steps(10) })
await page.screenshot({ path: 'test/out/elan/shot_2.png' })
await go(async () => { const M = window.__kfbM1, C = M.clock, steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }), I = (o) => M.input(o ? { wow: true, ...o } : null)
  I({ backward: true }); await steps(50); I(null); await steps(20) })
await page.screenshot({ path: 'test/out/elan/shot_3.png' })
console.log(JSON.stringify({ errs: errs.slice(0, 3) })); await browser.close()
