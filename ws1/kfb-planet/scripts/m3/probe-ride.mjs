// Sonde Wandfahrt: eine flache Anfahrt an block-b, je Schritt nach dem Einfangen Lage, latV-Wirkung, letzter Sweep-Treffer
import { openPage } from '../../test/_page.mjs'
import { STUNT, wallBox, J } from '../../src/m3/stuntData.js'
const q = wallBox(STUNT.walls.find((b) => b.id === 'block-b')), fx = q.c[0] + q.h[0], z1 = q.c[2] - q.h[2] + 2 * J, x0 = fx + 5 * J, z0 = q.c[2] + q.h[2] + 6 * J
const { browser, page } = await openPage('#m1,debug,nodraw,car,replay', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const r = await page.evaluate(async ({ x0, z0, yaw }) => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  M2.setKind('k2b', { p: [x0, (M.terrainH(x0, z0) ?? 0) + 0.5 * K, z0], yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(20)
  return await new Promise((done) => { const o = []; let i = 0, cap = -1; M.input({ forward: true }); C.onStep = () => { const c = M2.car(), st = c.state(), p = c.pos(); if (st.riding && cap < 0) cap = i
    if (cap >= 0 && i - cap < 70 && (i - cap) % 4 === 0) o.push({ i: i - cap, x: +p.x.toFixed(3), z: +p.z.toFixed(2), yaw: +c.yaw().toFixed(3), riding: st.riding, why: st.rideLast?.why, air: st.air, lean: st.lean, sp: st.speed })
    if (++i >= 200) { C.onStep = null; M.input(null); done({ cap, o }) } } }) }, { x0, z0, yaw: Math.atan2(fx - x0, z1 - z0) })
console.log('wall face x', fx.toFixed(3)); console.log(JSON.stringify(r).replace(/\},\{/g, '},\n{'))
await browser.close()
