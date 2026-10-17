// M2 · G0-Raster (V-313, WS0-Ergänzung zu BRIEF_WS1_M2_FAHREN_R1): je Kandidat (ecctrl, k2b) im Replay mit festem Takt
//   (a) Selbstaufrichten < 2 s nach Stillstand auf Dach bzw. Seite (nur ecctrl; k2b ist kinematisch und kippt nie – berichtet)
//   (b) 0 Durchfahrten in 20 Läufen mit Vollgas: 14 von außen auf das Theater zu (Zaun, Wände, Flügel; vorn darf das Auto über den Ring auf die
//       Bühne – das ist keine Durchfahrt), 6 vom Platz hinaus in die Hügel. Durchfahrt = Autmitte im Zaun-Grundriss (inRankFence) oder mehr als
//       0,5 m unter der Geländeoberfläche.
// Replay=30: zwei Physik-Schritte je Bild (gleiche Ergebnisse wie replay, m1 hz-equal), damit 40 Fahrten in den Test-Browser passen.
// Bildrate (c) misst scripts/m2/bench.mjs auf echter GPU. Fahrgefühl urteilt Georg live (V-312), nicht dieser Test.
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import { openPage, report } from './_page.mjs'
import { inRankFence } from '../src/m1/m1Host.js'

const { browser, page, errs } = await openPage('#m1,debug,replay=30,car', { viewport: { width: 320, height: 240 }, log: true })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const KINDS = process.env.M2_BOTH === '1' ? ['k2b', 'ecctrl'] : ['k2b'] // ecctrl nur noch als Gegenprobe (Georg 16.10.: Tendenz k2b)
const res = await page.evaluate(async (KINDS) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  const runs = []
  for (let i = 0; i < 20; i++) runs.push(i < 14 ? { deg: -180 + i * (360 / 14) + 6, r: 34 * K, inward: true } : { deg: (i - 14) * 60 + 15, r: 50 * K, inward: false })
  // Georg 16.10. („fährt durch den Berg und fällt endlos“): zusätzlich 8 Läufe mit Vollgas den Berg hinauf (aus r 80 nach außen) und quer zum Hang
  for (let i = 0; i < 4; i++) runs.push({ deg: i * 90 + 40, r: 80 * K, inward: false })
  for (let i = 0; i < 4; i++) runs.push({ deg: i * 90 + 10, r: 110 * K, cross: true })
  const out = {}
  for (const kind of KINDS) {
    const R = []
    for (const run of runs) {
      const a = (run.deg * Math.PI) / 180, x = Math.sin(a) * run.r, z = -Math.cos(a) * run.r, yaw = run.cross ? Math.atan2(-z, x) : Math.atan2(run.inward ? -x : x, run.inward ? -z : z)
      M2.setKind(kind, { p: [x, (M.terrainH(x, z) ?? 0) + 2 * K, z], yaw }); await steps(30); while (!M2.car()) await steps(1); M.input({ forward: true })
      const path = []; await new Promise((done) => { let i = 0; C.onStep = () => { const c = M2.car(); if (!c) return; /* nach dem Neueinhängen kurz kein Auto: im Schritt-Haken nie werfen, sonst steht die Schleife */ const p = c.pos(); path.push([p.x, p.y, p.z, M.terrainH(p.x, p.z) ?? -0.125]); if (++i >= 150) { C.onStep = null; done() } } })
      M.input(null); R.push({ run, path: path.filter((_, k) => k % 2 === 0) }); console.log(`[m2-g0] ${kind} ${R.length}/20 Schritt ${C.steps}`)
    }
    out[kind] = R
  }
  // (a) Aufrichten (ecctrl): Dach und Seite, je auf dem flachen Platz; Zeit bis oben·Y > 0,9 und wieder Bodenkontakt
  const right = []
  if (KINDS.includes('ecctrl')) for (const how of ['roof', 'side']) {
    M2.setKind('ecctrl', { p: [12 * K, 2 * K, 30 * K], yaw: Math.PI / 2 }); await steps(60); M2.flip(how); await steps(2)
    let t = 0, ok = false; while (t < 360) { await steps(1); t++; const c = M2.car(); if (!c) continue; if (c.upY() > 0.9 && c.grounded() >= 3) { ok = true; break } }
    right.push({ how, steps: t, seconds: +(t / 60).toFixed(2), ok })
  }
  return { out, right, stats: M2.stats }
}, KINDS)
await browser.close()

const cross = (path) => path.filter(([x, y, z, h]) => inRankFence(x, z) || y < h - 0.5 * K).length
const S = {}
for (const kind of KINDS) {
  const R = res.out[kind]
  S[kind] = { runs: R.length, crossings: R.reduce((n, r) => n + (cross(r.path) > 0 ? 1 : 0), 0), bad: R.filter((r) => cross(r.path) > 0).map((r) => ({ deg: r.run.deg, r: r.run.r, at: r.path.find(([x, y, z, h]) => inRankFence(x, z) || y < h - 0.5 * K)?.map((v) => +v.toFixed(2)) })),
    maxDist: +Math.max(...R.map((r) => Math.hypot(r.path.at(-1)[0] - r.path[0][0], r.path.at(-1)[2] - r.path[0][2]))).toFixed(1) }
}
process.exit(report('m2-g0', {
  // Durchfahrt (Zaun-Grundriss) oder Durchfaller (> 0,5 m unter dem Gelände) – beides zählt
  k2bNoCrossingOrFall28: S.k2b.runs === 28 && S.k2b.crossings === 0,
  k2bMoves: S.k2b.maxDist > 15 * K,
  ...(S.ecctrl ? { ecctrlRightsRoof: res.right[0].ok && res.right[0].seconds < 2, ecctrlRightsSide: res.right[1].ok && res.right[1].seconds < 2, ecctrlNoCrossing28: S.ecctrl.crossings === 0 } : {}),
  noPageErrors: errs.length === 0,
}, { right: res.right, ecctrl: S.ecctrl, k2b: S.k2b, stats: res.stats, errs: errs.slice(0, 3) }))
