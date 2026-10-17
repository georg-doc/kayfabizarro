// M1 · Messwert Rückwand-Stelle für WS0 (V-283: „bis dahin nur berichten“; Prüfer M1-4 Befund 10) – OHNE Zaun (#…,nofence), sonst käme man nicht
// hin. Abnahmewert für das vereinfachte Kollisionsnetz von WS0: Kapsel nie unter der Oberfläche. Nur Bericht (Zeile INFO), keine Prüfung.
// Sonde Rang-Landung (Prüfer-Lauf: Kapsel −18 cm): Flug wie m1-move (8 m über der Bühne, Blick −Z steil nach unten, W), je Schritt Lage, Tempo,
// Flugzustand, Kapsel-Unterkante und Oberfläche unter der Mitte (Strahl von Füße + 1,6 m und von 80 m). node scripts/m1/probe-landranks.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage('#m1,debug,replay,nofence', { viewport: { width: 320, height: 240 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const rows = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), cam = P.camera()
  const steps = (n) => new Promise((r) => { const t = C.steps + n; const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() })
  await steps(30); P.teleport([0, 8 * M.k, -4 * M.k], Math.PI); P.setFlying(true); await steps(30)
  cam.rotateAzimuthTo(0, false); cam.rotatePolarTo(0.6, false); M.input({ forward: true })
  const out = []
  await new Promise((done) => { let i = 0; C.onStep = () => { const b = P.handle().body, p = b.translation(), v = b.linvel(), f = M.feet(), cap = P.capsuleBottom()
    const s16 = P.castDown(p.x, p.z, f[1] + 1.6 * M.k), s80 = P.castDown(p.x, p.z)
    out.push({ i, x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2), vy: +v.y.toFixed(2), vz: +v.z.toFixed(2), fly: P.flying(), capClear16: s16 == null ? null : +((cap - s16) * 100).toFixed(1), capClear80: s80 == null ? null : +((cap - s80) * 100).toFixed(1), lift: +(P.lift() * 100).toFixed(1) })
    if (++i >= 260) { C.onStep = null; done() } } })
  M.input(null); return out
})
const bad = rows.filter((r) => r.capClear16 != null && r.capClear16 < -2)
console.log(JSON.stringify({ worst: rows.reduce((a, r) => (r.capClear16 != null && r.capClear16 < (a?.capClear16 ?? 99) ? r : a), null), firstBad: bad[0], nBad: bad.length, around: bad.length ? rows.slice(Math.max(0, bad[0].i - 4), bad[0].i + 6) : rows.slice(-5) }, null, 0))
const worst = rows.reduce((a, r) => (r.capClear16 != null && r.capClear16 < (a?.capClear16 ?? 99) ? r : a), null)
console.log(`INFO m1-rueckwand (ohne Zaun, nur Bericht): Kapsel tiefster Stand ${worst?.capClear16} cm unter/über der Oberfläche bei z ${worst?.z}, Schritte unter −2 cm: ${bad.length}`)
await browser.close()
