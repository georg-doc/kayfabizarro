// WS-NPC Phase D (V-464, SPEC_NPC_PATROL_R1 §3) · Spielzeugsoldaten-Trupp Nr. 1–6 über die Begegnungstabelle im Spiel (#m1,debug,patrol):
//   A  sechs Spielzeugsoldaten geladen (Slot + KFB-Augen)
//   B  Zone betreten → Wurf (Seed 5: erster Wurf = Trupp); Trupp wird erst sichtbar, wenn kein Mitglied im Bild ist (Umschalten nie im Bild)
//   C  Zone verlassen → Trupp verschwindet nur außerhalb des Bildes; wieder betreten nach der Abklingzeit → neuer Wurf (2. Wurf = keiner)
//   E  Soldaten treffbar (Georg 21.10.): Schuss → Warnung + Fluff (KO/Aufstehen wie Skelette, Rig_Medium-Clips as-is, eigener Clip beauftragt)
//   D  Nr. 6 stolpert (Hit_B), Formation hält (Nr. 2–6 hinter Nr. 1); Plan exakt; keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,patrol', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const A = await page.evaluate(() => window.__kfbM1.groups().status.groups.find((g) => g.id === 'toy_squad'))
await page.evaluate(() => { const M = window.__kfbM1, THREE = M.three(), cam = M.camera3(), fr = new THREE.Frustum(), pv = new THREE.Matrix4(), sp = new THREE.Sphere(new THREE.Vector3(), 1.2), R = window.__sq = { swapsInView: 0, swaps: 0, lastShown: null, maxDev: 0, ahead: 0 }
  M.clock.onStep = () => { const G = M.mods.groups; if (!G) return; const g = G.debug().find((x) => x.id === 'toy_squad'); cam.updateMatrixWorld(); pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(pv)
    if (R.lastShown !== null && g.shown !== R.lastShown) { R.swaps++; if (g.members.some((m) => { sp.center.set(m.x, M.terrainH(m.x, m.z) + 0.9, m.z); return fr.intersectsSphere(sp) })) R.swapsInView++ }
    R.lastShown = g.shown
    if (g.shown && g.state.mode !== 'alert' && g.lag < 1e-6) { g.members.forEach((m, k) => { R.maxDev = Math.max(R.maxDev, Math.hypot(m.x - g.plan[k].x, m.z - g.plan[k].z)) })
      const l = g.members[0], f = Math.sin(l.yaw), c = Math.cos(l.yaw); for (const m of g.members.slice(1)) if ((m.x - l.x) * f + (m.z - l.z) * c > 0.05) R.ahead++ } } })
const tbl = () => page.evaluate(() => window.__kfbM1.groups().tables[0])
const sq = () => page.evaluate(() => window.__kfbM1.groups().debug.find((x) => x.id === 'toy_squad'))
const t0 = await tbl()
// B: in die Zone, Blick weg vom Trupp (Kamera sieht ihn anfangs nicht) → Wurf, sichtbar außerhalb des Bildes
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([22, M.terrainH(22, 2) + 1.2, 2], Math.PI) })
for (let i = 0; i < 60; i++) { await page.waitForTimeout(150); if ((await sq()).shown) break }
const b = { tbl: await tbl(), sq: await sq() }
// D: dem Trupp zusehen (nah an der Route), bis Nr. 6 stolpert
await page.evaluate(() => { const M = window.__kfbM1, g = M.mods.groups.debug().find((x) => x.id === 'toy_squad'), p = g.members[0]; const ax = p.x + Math.cos(p.yaw) * 9, az = p.z - Math.sin(p.yaw) * 9; M.player().teleport([ax, M.terrainH(ax, az) + 1.2, az], p.yaw - Math.PI / 2)
  M.player().camera()?.setLookAt(ax + Math.cos(p.yaw) * 4, M.terrainH(ax, az) + 3, az - Math.sin(p.yaw) * 4, p.x, M.terrainH(p.x, p.z) + 1, p.z, false) })
for (let i = 0; i < 120; i++) { await page.waitForTimeout(150); const pl = await page.evaluate(() => window.__kfbM1.groups().played); if (pl.some(([id, c]) => id === 'toy_6' && /^Hit_/.test(c))) break }
await page.screenshot({ path: 'test/out/npc/squad.png' })
// E (Georg 21.10.: Soldaten treffbar): Schuss auf den Trupp → Treffer-Ereignis mit Warnung und Fluff; Nr. 6 bleibt im Trupp
const shotE = await page.evaluate(async () => { const M = window.__kfbM1, p = M.feet(), g = M.mods.groups.debug().find((x) => x.id === 'toy_squad'), m = g.members.reduce((a, b) => (Math.hypot(b.x - p[0], b.z - p[2]) < Math.hypot(a.x - p[0], a.z - p[2]) ? b : a)), l = Math.hypot(m.x - p[0], m.z - p[2])
  const r = M.mods.orchard.shoot(p, [(m.x - p[0]) / l, 0, (m.z - p[2]) / l]); await new Promise((res) => setTimeout(res, 1500)); return { r, ev: M.groups().events.filter((e) => e.group === 'toy_squad').map((e) => [e.type, e.id, e.n, e.tag]) } })
const played = await page.evaluate(() => window.__kfbM1.groups().played)
// C: Zone verlassen (weit weg), warten bis unsichtbar, nach Abklingzeit wieder hinein
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) })
for (let i = 0; i < 80; i++) { await page.waitForTimeout(150); if (!(await sq()).shown) break }
const c1 = { sq: await sq() }
const tL = await page.evaluate(() => window.__kfbM1.clock.t); for (let i = 0; i < 800; i++) { await page.waitForTimeout(150); if ((await page.evaluate(() => window.__kfbM1.clock.t)) > b.tbl.log[0].t + 61) break }
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([22, M.terrainH(22, 2) + 1.2, 2], Math.PI) }); await page.waitForTimeout(1500)
const c2 = { tbl: await tbl(), sq: await sq() }
const rec = await page.evaluate(() => { const R = window.__sq; window.__kfbM1.clock.onStep = null; return R })
await browser.close()
process.exit(report('squad (WS-NPC Phase D, Spielzeugsoldaten über Begegnungstabelle)', {
  A_sixWithEyes: A.members.length === 6 && A.members.every((m) => m.status === 'OK' && m.actor === 'OK' && m.head),
  B_hiddenBeforeRoll: t0.rolls === 0,
  B_rollOnEnterPicksSquad: b.tbl.rolls === 1 && b.tbl.chosen === 'toy_squad' && b.sq.shown,
  C_hiddenAfterLeaving: c1.sq.shown === false && c1.sq.active === false,
  C_reRollAfterCooldown: c2.tbl.rolls === 2 && c2.tbl.chosen === null && c2.sq.shown === false,
  BC_neverSwapInView: rec.swaps >= 2 && rec.swapsInView === 0,
  D_nr6Stumbles: played.some(([id, c]) => id === 'toy_6' && /^Hit_/.test(c)),
  D_formationBehindLeader: rec.ahead === 0,
  D_onPlan: rec.maxDev < 1e-6,
  E_toyHittable: /^group:toy_/.test(shotE.r?.target || '') && shotE.ev.some((e) => e[0] === 'hit' && e[2] === 1) && shotE.ev.some((e) => e[0] === 'fluff' && /^hit:toy_squad:/.test(e[3])),
  noPageErrors: errs.length === 0,
}, { t0, b: b.tbl, c1: { shown: c1.sq.shown, active: c1.sq.active }, c2: c2.tbl, rec, shotE, played: played.filter(([id]) => id.startsWith('toy')).slice(0, 8), errs: errs.slice(0, 3) }))
