// M1 · Bodenkontakt global (Georg 21.10.: Figur schwebte nach dem Laden; Kanon K4 „kein Schweben“ = hartes FAIL, V-568).
// Gemessen wird die sichtbare Unterkante (gehäutete Netze, Box3 präzise) gegen die Oberfläche darunter (Physik-Strahl castDown bzw. Bühnennetz).
//   spawn   : Figur nach dem Laden (+2 s Ruhe) – Sohle auf dem Boden
//   release : Startrennen nachgestellt – einfrieren, auf Starthöhe (+0,3 K) setzen, 1,5 s schlafen lassen, freigeben → muss landen (Fix 21.10.: Schwerkraft zurück + wecken)
//   slopes  : drei Hangstellen nach Teleport (je 2,5 s) – Wurzel = Fußhöhe gegen Boden darunter
//   partner : Figur auf der Bühne gegen das Bühnennetz
//   props   : Bäume und Laternen schweben nicht (Unterkante ≤ +2 cm; Einstecken erlaubt), Fundsachen sinken nicht ein (Unterkante ≥ −2 cm; Schweben gewollt, V-450)
// Toleranz Figuren: |Abstand| ≤ 1,5 cm (alte WS1-Meter, ÷ K), am Hang + 12 cm × tan(Steigung) (Sohle setzt bergseitig auf). Ausgabe in cm.
import { openPage, report } from './_page.mjs'

const { browser, page, errs } = await openPage('#m1,debug,harvest', { viewport: { width: 640, height: 400 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().partner === 'OK' && window.__kfbM1.status().amphTris > 0 && window.__kfbM1.state.phase === 'free', null, { timeout: 240000 })
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, T = M.three(), mods = M.mods, P = M.player(), K = M.k
  const wait = (ms) => new Promise((res) => setTimeout(res, ms))
  const cm = (v) => +(v / K * 100).toFixed(1)
  const box = new T.Box3(), tmp = new T.Box3()
  const skip = /shadow|contact|blob|glow|beam|pool|ao$/i
  const bottomOf = (root, near) => { box.makeEmpty(); root.updateWorldMatrix(true, true)
    root.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && o.visible && !skip.test(o.name)) { tmp.setFromObject(o, true); if (!near) { box.union(tmp); return } const c = tmp.getCenter(new T.Vector3()); if (Math.hypot(c.x - near[0], c.z - near[2]) < 2 * K) box.union(tmp) } })
    return box.isEmpty() ? null : box.clone() }
  const playerGap = () => { const f = M.feet(), b = bottomOf(mods.player.object3d, f), g = P.castDown(f[0], f[2]); return { mesh: b && g != null ? cm(b.min.y - g) : null, root: g != null ? cm(f[1] - g) : null } }
  const out = {}
  await wait(2000); out.spawn = playerGap()
  // Startrennen: eingefroren ohne Schwerkraft über dem Boden halten, Körper schlafen lassen, dann freigeben
  const S0 = M.start, footH = S0[1] - P.castDown(S0[0], S0[2]) - 0.3 * K
  P.freeze(true); P.teleport([S0[0], S0[1], S0[2] - 2 * K]); await wait(1500)
  P.handle()?.body?.sleep?.()   // genau der Fehlerfall: Körper schläft ohne Schwerkraft über dem Boden ein (je nach Ladezeit)
  const slept = P.handle()?.body?.isSleeping?.() ?? null
  P.freeze(false); await wait(2500); out.release = { ...playerGap(), slept }
  out.slopes = []
  for (const [x, z] of [[70, 40], [-90, 20], [40, 110]]) { const X = x * K, Z = z * K, g = P.castDown(X, Z); P.teleport([X, g + footH + 0.3 * K, Z]); await wait(2500)
    const f = M.feet(), e = 0.3 * K, sx = (P.castDown(f[0] + e, f[2]) - P.castDown(f[0] - e, f[2])) / (2 * e), sz = (P.castDown(f[0], f[2] + e) - P.castDown(f[0], f[2] - e)) / (2 * e)
    out.slopes.push({ ...playerGap(), slopeDeg: +(Math.atan(Math.hypot(sx, sz)) * 180 / Math.PI).toFixed(1) }) }   // am Hang setzt die Sohle bergseitig auf: Toleranz + halbe Fußlänge × Steigung
  // Partnerin auf der Bühne: Unterkante gegen das Bühnennetz (der Strahl auf die Physik träfe ihren eigenen Zylinder)
  { const b = bottomOf(mods.partner.object3d), cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2, ray = new T.Raycaster(new T.Vector3(cx, b.min.y + 1.5, cz), new T.Vector3(0, -1, 0)); let top = null
    mods.amph.object3d.traverse((o) => { if (o.isMesh && o.visible) { try { const h = ray.intersectObject(o, false)[0]; if (h && (top == null || h.point.y > top)) top = h.point.y } catch (e) {} } })
    out.partner = top == null ? null : cm(b.min.y - top) }
  const propGaps = (key) => { const a = []; for (const c of mods[key].object3d.children) { const b = bottomOf(c); if (!b) continue; const g = P.castDown((b.min.x + b.max.x) / 2, (b.min.z + b.max.z) / 2); if (g != null) a.push(cm(b.min.y - g)) } a.sort((p, q) => p - q); return { n: a.length, min: a[0], max: a.at(-1) } }
  out.props = { orchard: propGaps('orchard'), lanterns: propGaps('lanterns'), found: propGaps('found') }
  return out
})
await browser.close()

const TOL = 1.5, FOOT_HALF = 12 // cm (alte WS1-Meter): halbe Sohlenlänge FB
const ok = (g) => { if (!g || g.mesh == null) return false; const t = TOL + (g.slopeDeg ? FOOT_HALF * Math.tan(g.slopeDeg * Math.PI / 180) : 0); return Math.abs(g.mesh) <= t && Math.abs(g.root) <= t }
const P = r.props
process.exit(report('m1-ground', {
  spawnGrounded: ok(r.spawn),
  releaseGrounded: r.release?.slept === true && ok(r.release),
  slopesGrounded: r.slopes.length === 3 && r.slopes.every(ok),
  partnerGrounded: r.partner != null && Math.abs(r.partner) <= TOL,
  treesNotFloating: P.orchard.n > 0 && P.orchard.max <= 2,
  lanternsNotFloating: P.lanterns.n > 0 && P.lanterns.max <= 2,
  foundNotSunk: P.found.n > 0 && P.found.min >= -2,
  noPageErrors: errs.length === 0,
}, { ...r, errs: errs.slice(0, 3) }))
