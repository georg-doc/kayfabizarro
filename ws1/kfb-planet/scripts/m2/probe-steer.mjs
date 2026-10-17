// M2 · Sonde Lenkung + Bild je Kandidat (Georg 16.10.: „Lenken funktioniert noch nicht richtig“). node scripts/m2/probe-steer.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage('#m1,debug,replay,car', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const out = {}
for (const kind of ['ecctrl', 'k2b']) {
  out[kind] = await page.evaluate(async (kind) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    M2.setKind(kind, { p: [20, 2, 34], yaw: Math.PI / 2 }); await steps(40); while (!M2.car()) await steps(1)
    const st = () => { const c = M2.car(); return { yaw: +c.yaw().toFixed(3), speed: +c.speed().toFixed(1), upY: +c.upY().toFixed(2) } }
    M.input({ forward: true }); await steps(120); const a = st()
    M.input({ forward: true, leftward: true }); await steps(60); const b = st()
    M.input({ forward: true, rightward: true }); await steps(60); const c = st()
    M.input(null); await steps(180); const d = st() // ohne Eingabe: rollt es aus?
    return { afterGas: a, afterLeft: b, afterRight: c, coast3s: d, yawLeft: +(b.yaw - a.yaw).toFixed(3), yawRight: +(c.yaw - b.yaw).toFixed(3) }
  }, kind)
  await page.screenshot({ path: `test/out/m2_${kind}.png` })
}
console.log(JSON.stringify(out, null, 1)); await browser.close()
