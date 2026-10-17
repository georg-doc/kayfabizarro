// M3 · Stufe D (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379): nie festfahren. 20 Fallen im Testfeld, je mit gehaltenem Gas (kein anderer Tastendruck):
//   Ecke (L aus ecke-1/ecke-2, Nase in die Innenecke) ×5 · Gasse (schräg in die 3,2-m-Mündung zwischen gasse-1/-2, Nase an der Innenwand) ×5 ·
//   Wand (Nase an block-a) ×5 · Kante (Nase an die 0,7-m-Kante der Tafel) ×5
//   G-D1  fahrbereit (≥ 3 m vom Start und ≥ 3 m/s) ≤ 3 s in 20/20; T3 (Respawn) höchstens 2 von 20.
//   Dach/Seitenlage: K2B ist kinematisch (kein Umkippen); die Lage richtet Stufe B in < 0,2 s auf – nicht als Falle geführt.
// Je Bildrate einmal (replay, replay=30); vorher (nur 60 fps) = STUCK aus (window ∞).
import { openPage, report } from './_page.mjs'
import { STUNT, J } from '../src/m3/stuntData.js'

const W = Object.fromEntries(STUNT.walls.map((b) => [b.id, b])), T = STUNT.ramps.find((r) => r.id === 'tafel')
const TRAPS = []
for (let k = 0; k < 5; k++) { const o = (k - 2) * 0.35
  { const cx = W['ecke-2'].x + W['ecke-2'].w / 2, cz = W['ecke-1'].z - W['ecke-1'].d / 2, x = cx + 2.2 + o, z = cz - 2.2 - o; TRAPS.push({ kind: 'ecke', x, z, yaw: Math.atan2(cx - x, cz - z) }) }
  // Gasse: schräg (≈ 35°) in die Mündung zwischen gasse-1/-2 – die Nase verkeilt an der Innenwand (vorher quer IN beiden Wänden gestartet: unmöglicher Zustand)
  { const gz = (W['gasse-1'].z - W['gasse-1'].d / 2 + W['gasse-2'].z + W['gasse-2'].d / 2) / 2, ex = W['gasse-1'].x + W['gasse-1'].w / 2; TRAPS.push({ kind: 'gasse', x: ex + 1.6 + o, z: gz + (k % 2 ? 0.6 : -0.6), yaw: -Math.PI / 2 + (k % 2 ? 0.6 : -0.6) }) }
  TRAPS.push({ kind: 'wand', x: W['block-a'].x + W['block-a'].w / 2 + 2.6, z: W['block-a'].z + o * 3, yaw: -Math.PI / 2 + o * 0.4 })
  TRAPS.push({ kind: 'kante', x: T.x + o * 2, z: T.z - T.len - T.top - 2.6, yaw: 0 + o * 0.3 })
}
async function pass(hz) {
  const { browser, page, errs } = await openPage('#m1,debug,nodraw,car,replay' + (hz === 30 ? '=30' : ''), { viewport: { width: 320, height: 240 }, log: true })
  await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
  const res = await page.evaluate(async ({ J, TRAPS, modes }) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, S0 = { ...M2.stuck }
    const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
    const out = {}
    for (const mode of modes) { Object.assign(M2.stuck, mode === 'nachher' ? S0 : { window: 1e6 }); out[mode] = []
      for (const t of TRAPS) { const x = t.x * J, z = t.z * J; M.input(null); M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw: t.yaw }); await steps(4); while (!M2.car()) await steps(1); await steps(8)
        const r = await new Promise((done) => { let i = 0; const p0 = M2.car().pos(); M.input({ forward: true }); C.onStep = () => { const c = M2.car(); if (!c) return; const p = c.pos(), d = Math.hypot(p.x - p0.x, p.z - p0.z)
          if ((d >= 3 * K && c.speed() >= 3 * K) || ++i >= 360) { C.onStep = null; M.input(null); const st = c.state(); done({ steps: i, free: i < 360, t1: st.t1, t3: st.t3 }) } } })
        out[mode].push({ kind: t.kind, ...r, seconds: +(r.steps / 60).toFixed(2) }) }
      console.log(`[m3-d] ${mode} fertig`) }
    Object.assign(M2.stuck, S0); return out
  }, { J, TRAPS, modes: hz === 60 ? ['vorher', 'nachher'] : ['nachher'] })
  await browser.close()
  const S = {}; for (const m of Object.keys(res)) { const L = res[m]; S[m] = { traps: L.length, freeIn3s: L.filter((x) => x.free && x.seconds <= 3).length, t3: L.filter((x) => x.t3 > 0).length, worst: Math.max(...L.map((x) => x.seconds)), byKind: Object.fromEntries(['ecke', 'gasse', 'wand', 'kante'].map((k) => [k, L.filter((x) => x.kind === k).map((x) => x.seconds + (x.t3 ? '·T3' : ''))])) } }
  return { S, errs }
}
const A = await pass(60), B = await pass(30)
process.exit(report('m3-d', {
  D1_free20in3s: A.S.nachher.freeIn3s === 20 && B.S.nachher.freeIn3s === 20,
  D1_t3AtMost2: A.S.nachher.t3 <= 2 && B.S.nachher.t3 <= 2,
  noPageErrors: A.errs.length === 0 && B.errs.length === 0,
}, { A: A.S, B: B.S, errs: [...A.errs, ...B.errs].slice(0, 3) }))
