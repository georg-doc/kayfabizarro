// WS-NPC Phase D3 (R0.6 §3/§4) · Treffer, Aggro und Cartoon-KO der Skelett-Patrouille im Spiel (#m1,debug,harvest,patrol), echte Schüsse (orchard.shoot):
//   A  1. Treffer: Warnung (Hit_A am Getroffenen) + 1 Fluff am Mitglied · 2. Treffer: Drohung (Hit_B, Anführer Skeletons_Taunt_Longer) + 3 Fluff
//   B  3. Treffer: Aggro – Anführer verlässt die Route und kommt auf den Spieler zu (bis stopAt), schaut hin
//   C  4. Treffer: Cartoon-KO (Skeletons_Death), liegt still, nicht treffbar; nach koS Skeletons_Awaken_Floor an Ort und Stelle, gleiche ID, steht wieder
//   D  Ruhe (giveUpS ohne Treffer) → zurück zum Austrittspunkt → Route; Fluff endlich (gleicher Tag zweimal = kein neues Fluff)
//   (Der Schuss trifft das nächste Ziel im Kegel; geprüft wird über die getroffene ID.)
//   F  Gedächtnis (#npc): Belege hit_warning, hostile_response, resident_downed (KO selbst participated), respawned im Weltstand kfb.world-save/1
//   E  im Bild nie ein Sprung, Sohlen am Boden (Fortbewegung ohne Clip-Overlay; Treffer-, KO-, Drohungs-Clips as-is nur als Wert), keine Seitenfehler; Bild test/out/npc/aggro.png (KO im Bild)
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,patrol,npc,npcfresh', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK' && !!window.__kfbM1.mods.orchard, null, { timeout: 300000 })
const A0 = await page.evaluate(() => window.__kfbM1.groups().status)
await page.evaluate(() => { const M = window.__kfbM1, R = window.__aRec = { pops: 0, prev: null, soleMin: Infinity, n: 0, soleMinCombat: Infinity }
  const THREE = M.three(), cam = M.camera3(), fr = new THREE.Frustum(), pv = new THREE.Matrix4(), sp = new THREE.Sphere(new THREE.Vector3(), 1)
  M.clock.onStep = () => { const g = M.mods.groups; if (!g) return; const d = g.debug()[0], n0 = d.members.length, pos = g.positions().slice(0, n0), soles = g.soles().slice(0, n0)
    cam.updateMatrixWorld(); pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(pv)
    pos.forEach((p, k) => { sp.center.set(p.x, p.y + 0.9, p.z); const vis = fr.intersectsSphere(sp), pr = R.prev?.[k]; if (pr && vis && pr.vis && Math.hypot(p.x - pr.x, p.z - pr.z) > 0.08) R.pops++
      if (soles[k] && d.near && !d.members[k].ko) { const lo = Math.min(...Object.values(soles[k]).map((v) => v[1] - p.y)); if (d.members[k].overlay < 0.05) { R.soleMin = Math.min(R.soleMin, lo); R.n++ } else R.soleMinCombat = Math.min(R.soleMinCombat, lo) } })
    R.prev = pos.map((p) => { sp.center.set(p.x, p.y + 0.9, p.z); return { x: p.x, z: p.z, vis: fr.intersectsSphere(sp) } }) } })
const G = () => page.evaluate(() => window.__kfbM1.groups().debug[0])
const fluffKeys = () => page.evaluate(() => window.__kfbM1.mods.orchard.balls().filter((b) => b.key.startsWith('hit:skeleton_patrol:')).length)
// Spieler 5 m seitlich vom Anführer, Blick auf die Gruppe
await page.evaluate(() => { const M = window.__kfbM1, d = M.mods.groups.debug()[0], l = d.members[0], px = l.x + Math.cos(l.yaw) * 5.5, pz = l.z - Math.sin(l.yaw) * 5.5
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(l.x - px, l.z - pz)) })
await page.waitForTimeout(1500)
const shoot = (k) => page.evaluate(async (k) => { const M = window.__kfbM1, p = M.feet(), m = M.mods.groups.debug()[0].members[k], dx = m.x - p[0], dz = m.z - p[2], l = Math.hypot(dx, dz)
  const r = M.mods.orchard.shoot(p, [dx / l, 0, dz / l]); await new Promise((res) => setTimeout(res, 1300)); return r }, k)
const ev = () => page.evaluate(() => window.__kfbM1.groups().events.filter((e) => e.group === 'skeleton_patrol'))
const played = () => page.evaluate(() => window.__kfbM1.groups().played)
const s1 = await shoot(1), e1 = await ev(), f1 = await fluffKeys()
const s2 = await shoot(2), e2 = await ev(), f2 = await fluffKeys(), p2 = await played()
const s3 = await shoot(0), d3a = await G()
await page.waitForTimeout(2500)
const d3 = await G(), feet3 = await page.evaluate(() => window.__kfbM1.feet())
const dist = (m, f) => Math.hypot(m.x - f[0], m.z - f[2])
const s4 = await shoot(1)
await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), d = M.mods.groups.debug()[0], c = d.members.reduce((a, m) => [a[0] + m.x / d.members.length, a[1] + m.z / d.members.length], [0, 0]), dx = c[0] - p[0], dz = c[1] - p[2], l = Math.hypot(dx, dz) || 1
  M.player().camera()?.setLookAt(p[0] - dx / l * 4.5, p[1] + 2.6, p[2] - dz / l * 4.5, c[0], M.terrainH(c[0], c[1]) + 0.5, c[1], false) }) // Spielkamera hinter dem Spieler auf die Gruppe
await page.waitForTimeout(900); await page.screenshot({ path: 'test/out/npc/aggro.png' })
const d4 = await G(), p4 = await played(), f4 = await fluffKeys()
// liegt still und ist nicht treffbar (Schuss geht an ihm vorbei)
await page.waitForTimeout(3000); const d4b = await G()
const s4b = await shoot(1), d4c = await G()
// Aufstehen nach koS
let awake = null; for (let i = 0; i < 80 && !awake; i++) { await page.waitForTimeout(250); const e = await ev(); awake = e.find((x) => x.type === 'awake') || null }
await page.waitForTimeout(2800); const d5 = await G(), p5 = await played() // Skeletons_Awaken_Floor dauert 2,3 s
// Ruhe → zurück → Route
let calm = null; for (let i = 0; i < 160 && !calm; i++) { await page.waitForTimeout(250); calm = (await ev()).find((x) => x.type === 'calm') || null }
let back = null; for (let i = 0; i < 160 && !back; i++) { await page.waitForTimeout(250); const d = await G(); if (d.state.mode === 'patrol') back = d }
const fEnd = await fluffKeys(), evEnd = await ev()
const memR = await page.evaluate(() => (window.__kfbM1.npc()?.memory?.receipts || []).filter((e) => e.residentId.startsWith('skel_')).map((e) => [e.residentId, e.kind, e.mode, e.eventKey]))
const rec = await page.evaluate(() => { const R = window.__aRec; window.__kfbM1.clock.onStep = null; return { ...R, prev: undefined } })
await browser.close()
const has = (pl, id, c) => pl.some(([i, n]) => i === id && n === c)
const idOf = (s) => s?.target?.replace(/^group:/, ''), mOf = (d, id) => d.members.find((m) => m.id === id)
const X4 = idOf(s4), kos = (back?.state?.stats ?? d5.state.stats).kos
process.exit(report('aggro (WS-NPC Phase D3, Treffer, Aggro, Cartoon-KO im Spiel)', {
  A_loaded: A0.status === 'OK',
  A_hit1Warn: !!idOf(s1) && e1.some((e) => e.type === 'hit' && e.n === 1 && e.id === idOf(s1)) && f1 === 1,
  A_hit2Threat: !!idOf(s2) && e2.some((e) => e.type === 'hit' && e.n === 2) && f2 === 4 && has(p2, idOf(s2), 'Hit_B') && (idOf(s2) === 'skel_warrior' || has(p2, 'skel_warrior', 'Skeletons_Taunt_Longer')),
  B_aggroApproaches: !!idOf(s3) && d3a.state.mode === 'aggro' && d3.state.mode === 'aggro' && dist(d3.members[0], feet3) < dist(d3a.members[0], feet3) - 0.5 && dist(d3.members[0], feet3) < 2.6,
  C_koDeath: !!X4 && mOf(d4, X4).ko === true && has(p4, X4, 'Skeletons_Death') && f4 === 5,
  C_liesStillNotTargetable: mOf(d4b, X4).ko && Math.hypot(mOf(d4b, X4).x - mOf(d4, X4).x, mOf(d4b, X4).z - mOf(d4, X4).z) < 1e-6 && idOf(s4b) !== X4,
  C_awakensInPlace: !!awake && awake.id === X4 && has(p5, X4, 'Skeletons_Awaken_Floor') && mOf(d5, X4).ko === false,
  D_calmReturnPatrol: !!calm && !!back && back.state.free === null,
  D_fluffFinite: fEnd === 4 + kos && evEnd.filter((e) => e.type === 'fluff').length === 2 + kos && new Set(evEnd.filter((e) => e.type === 'fluff').map((e) => e.tag)).size === 2 + kos,
  F_memoryReceipts: ['hit_warning', 'hostile_response', 'resident_downed', 'respawned'].every((k) => memR.some((r) => r[1] === k)) && memR.some((r) => r[0] === X4 && r[1] === 'resident_downed' && r[2] === 'participated') && new Set(memR.map((r) => r.join('|'))).size === memR.length,
  E_noPopInView: rec.pops === 0,
  E_solesOnGround: rec.n > 100 && rec.soleMin > -0.06 && rec.soleMin < 0.08, // Fortbewegung; Overlay-Clips as-is (V-574) nur als Wert (soleMinCombat)
  E_noPageErrors: errs.length === 0,
}, { shots: [s1, s2, s3, s4, s4b].map(idOf), f: [f1, f2, f4, fEnd], d3: { a: +dist(d3a.members[0], feet3).toFixed(2), b: +dist(d3.members[0], feet3).toFixed(2) }, stats: back?.state?.stats ?? d5.state.stats, rec, mem: memR.length, events: evEnd.map((e) => [e.type, e.id, e.n, e.tag]).slice(0, 14), errs: errs.slice(0, 3) }))
