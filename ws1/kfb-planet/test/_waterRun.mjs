// WS1c · Fahr-Drehbuch am größten Talboden-See (für Bilder und den 60-s-Clip): im Browser gestartet, Schritt-Zähler in window.__wr
export async function startRun(page, plan) {
  await page.evaluate(async (plan) => {
    const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, t = M.mods.terrain, sea = t.hydro().seaY, H = t.height
    const steps = (n) => new Promise((r) => { const e = C.steps + n; const f = () => (C.steps >= e ? r() : requestAnimationFrame(f)); f() })
    let best = null; for (let z = -150; z <= 150; z += 2) for (let x = -150; x <= 150; x += 2) { const d = sea - H(x, z); if (d > 1.6 && (!best || d > best.d)) best = { x, z, d } }
    const len = Math.hypot(best.x, best.z), ux = -best.x / len, uz = -best.z / len; let s = 0; while (H(best.x + ux * s, best.z + uz * s) < sea + 0.3 && s < 80) s += 0.5
    const shore = [best.x + ux * s, best.z + uz * s], yaw = Math.atan2(-ux, -uz)
    window.__wr = { i: 0, seg: -1, done: false, ev: [], mode: null }
    M2.events.on('water', (e) => window.__wr.ev.push({ i: window.__wr.i, kind: e.kind }))
    for (const [k, sg] of plan.entries()) { M.input(null); const p = [shore[0] + ux * sg.back, 0, shore[1] + uz * sg.back]; p[1] = H(p[0], p[2]) + 0.6 * M.k
      M2.setKind('k2b', { p, yaw: yaw + (sg.yaw || 0) }); await steps(4); while (!M2.car()) await steps(1); await steps(30)
      window.__wr.seg = k
      await new Promise((done) => { let i = 0; C.onStep = () => { const inp = {}; for (const [key, a, b] of sg.keys) if (i >= a && i < b) inp[key] = true; M.input(inp); window.__wr.i = i; window.__wr.mode = M2.stats.water?.mode
        if (++i >= sg.n) { C.onStep = null; M.input(null); done() } } }) }
    window.__wr.done = true
  }, plan)
}
// Standard-Drehbuch: A langsam rein → Grund → Schwimmstoß raus; B Vollgas über den See
export const PLAN = [
  { back: 14, n: 900, keys: [['forward', 0, 40], ['forward', 560, 620], ['jump', 620, 624]] },
  { back: 40, n: 330, keys: [['forward', 0, 330]] },
]
// 60-s-Clip (3600 Schritte): A rein → Grund → Schwimmstoß raus → weiter ans Ufer; B Vollgas drüber; A' wie A aus anderem Winkel
export const PLAN_CLIP = [
  { back: 14, n: 1500, keys: [['forward', 0, 40], ['forward', 300, 440], ['jump', 440, 444], ['forward', 444, 1500]] },
  { back: 40, n: 600, keys: [['forward', 0, 600]] },
  { back: 16, yaw: 0.45, n: 1500, keys: [['forward', 0, 45], ['forward', 320, 430], ['jump', 430, 434], ['forward', 434, 1500]] },
]
