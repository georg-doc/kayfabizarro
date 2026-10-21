// WS-NPC Phase D (Georg 21.10. Go; SPEC_NPC_PATROL_R1) · Skelett-Patrouille im Spiel (#m1,debug,patrol): drei Skelette (Warrior, Rogue, Mage, KFB-Augen
// aus Georgs Batch) in Formation auf Fahrplan. Prüft aus der Spielkamera:
//   A  geladen (Slot + Augen), Gang-Mischer; Figuren auf dem Gelände, Sohlen am Boden, Gang-Rate im Fenster 0,8–1,25
//   B  ohne Spieler exakt auf dem Plan
//   C  Spieler stellt sich an die Route: Gruppe hält, schaut hin, Anführer Skeletons_Taunt, danach weiter und aufgeholt
//   D  weggehen (jenseits Blase und Sichtweite) und zurückkommen: exakt auf dem Plan, im Bild nie ein Sprung
//   E  Kosten je Schritt, keine Seitenfehler; Bild test/out/npc/patrol.png
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,patrol', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const A = await page.evaluate(() => window.__kfbM1.groups().status)
const G = () => page.evaluate(() => window.__kfbM1.groups().debug[0])
await page.evaluate(() => { const M = window.__kfbM1, R = window.__pRec = { soleMin: Infinity, soleMax: -Infinity, n: 0, tsMin: Infinity, tsMax: -Infinity, pops: 0, prev: null, rootDy: 0, maxDev: 0 }
  const THREE = M.three(), cam = M.camera3(), fr = new THREE.Frustum(), pv = new THREE.Matrix4(), sp = new THREE.Sphere(new THREE.Vector3(), 1)
  M.clock.onStep = () => { const g = M.mods.groups; if (!g) return; const d = g.debug()[0], n0 = d.members.length, soles = g.soles().slice(0, n0), pos = g.positions().slice(0, n0) // nur die Skelett-Patrouille (erste Gruppe)
    cam.updateMatrixWorld(); pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(pv)
    pos.forEach((p, k) => { R.rootDy = Math.max(R.rootDy, Math.abs(p.y - (M.mods.terrain.surfaceAt || M.terrainH)(p.x, p.z)))
      if (soles[k] && d.near) { const lo = Math.min(...Object.values(soles[k]).map((v) => v[1] - p.y)); R.soleMin = Math.min(R.soleMin, lo); R.soleMax = Math.max(R.soleMax, lo); R.n++ }
      const m = d.members[k]; if (m.gait && m.speed > 0.2) for (const [key, w] of Object.entries(m.gait.w)) if (key !== 'idle' && w > 0.5) { R.tsMin = Math.min(R.tsMin, m.gait.ts[key]); R.tsMax = Math.max(R.tsMax, m.gait.ts[key]) }
      sp.center.set(p.x, p.y + 0.9, p.z); const vis = fr.intersectsSphere(sp), pr = R.prev?.[k]; if (pr && vis && pr.vis && Math.hypot(p.x - pr.x, p.z - pr.z) > 0.08) R.pops++
      if (d.mode !== 'alert' && d.lag < 1e-6) R.maxDev = Math.max(R.maxDev, Math.hypot(p.x - d.plan[k].x, p.z - d.plan[k].z)) })
    R.prev = pos.map((p) => { sp.center.set(p.x, p.y + 0.9, p.z); return { x: p.x, z: p.z, vis: fr.intersectsSphere(sp) } }) } })
// Kamera-Spieler in die Nähe (Blase), aber weg von der Route
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) })
await page.waitForTimeout(6000)
const B = await G()
// C: Spieler an die Route, wo die Gruppe in ~5 s ankommt
const C0 = await page.evaluate(() => { const M = window.__kfbM1, g = M.mods.groups.debug()[0], t = M.clock.t; return { t } })
const spot = await page.evaluate((t) => { const M = window.__kfbM1, sim = M.mods.groups; const d = sim.debug()[0]; return d.plan[0] }, C0.t)
await page.evaluate(() => { const M = window.__kfbM1, d = M.mods.groups.debug()[0]; const p = d.members[0]; const yaw = d.members[0].yaw, ax = p.x + Math.sin(yaw) * 5 + Math.cos(yaw) * 2.6, az = p.z + Math.cos(yaw) * 5 - Math.sin(yaw) * 2.6
  M.player().teleport([ax, M.terrainH(ax, az) + 1.2, az], yaw + Math.PI) })
let alert = null
for (let i = 0; i < 80 && !alert; i++) { await page.waitForTimeout(150); const d = await G(); if (d.state.mode === 'alert') alert = d }
await page.waitForTimeout(1200); await page.screenshot({ path: 'test/out/npc/patrol.png' })
const played = await page.evaluate(() => window.__kfbM1.groups().played)
const faced = await page.evaluate(() => { const M = window.__kfbM1, d = M.mods.groups.debug()[0], p = M.feet(); return d.members.map((m) => Math.abs(Math.atan2(Math.sin(m.yaw - Math.atan2(p[0] - m.x, p[2] - m.z)), Math.cos(m.yaw - Math.atan2(p[0] - m.x, p[2] - m.z))))) })
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) })
let caught = null; const tC = await page.evaluate(() => window.__kfbM1.clock.t)
for (let i = 0; i < 150 && caught === null; i++) { await page.waitForTimeout(200); const d = await G(); if (d.state.mode !== 'alert' && d.lag < 1e-6) caught = (await page.evaluate(() => window.__kfbM1.clock.t)) - tC }
// D: weg (jenseits 140 m und hinter dem Theater), 20 s, zurück
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([60, M.terrainH(60, -130) + 1.2, -130], 0) }); await page.waitForTimeout(1500)
const awayNear = (await G()).near
const tA = await page.evaluate(() => window.__kfbM1.clock.t); for (let i = 0; i < 400; i++) { await page.waitForTimeout(150); if ((await page.evaluate(() => window.__kfbM1.clock.t)) > tA + 20) break }
const popsBefore = await page.evaluate(() => window.__pRec.pops)
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) }); await page.waitForTimeout(700)
const D1 = await G(), devBack = Math.max(...D1.members.map((m, k) => Math.hypot(m.x - D1.plan[k].x, m.z - D1.plan[k].z)))
await page.waitForTimeout(2500)
const rec = await page.evaluate(() => { const R = window.__pRec; window.__kfbM1.clock.onStep = null; return { ...R, prev: undefined } })
const E = await page.evaluate(() => window.__kfbM1.groups().status.ms)
await browser.close()
process.exit(report('patrol (WS-NPC Phase D, Skelett-Patrouille im Spiel)', {
  A_loadedWithEyes: A.status === 'OK' && A.groups[0].members.length === 3 && A.groups[0].members.every((m) => m.status === 'OK' && m.actor === 'OK' && m.head),
  A_solesOnGround: rec.n > 200 && rec.soleMin > -0.06 && rec.soleMin < 0.08,
  A_gaitInWindow: rec.tsMin >= 0.8 - 1e-6 && rec.tsMax <= 1.25 + 1e-6,
  A_rootOnTerrain: rec.rootDy < 0.02,
  B_onPlanWithoutPlayer: B.near === true && rec.maxDev < 1e-6,
  C_alertTauntFace: !!alert && played.some(([id, c]) => id === 'skel_warrior' && c === 'Skeletons_Taunt') && faced.every((e) => e < 0.15),
  C_resumesAndCatchesUp: caught !== null,
  D_awayOutsideBubble: awayNear === false,
  D_backOnPlan: devBack < 1e-6,
  D_noPopInView: rec.pops === 0 && popsBefore === 0,
  E_cost: E !== null && E < 1.5,
  E_noPageErrors: errs.length === 0,
}, { A: A.groups[0].members.map((m) => m.status), rec: { n: rec.n, soleMin: +rec.soleMin.toFixed(3), soleMax: +rec.soleMax.toFixed(3), tsMin: rec.tsMin, tsMax: rec.tsMax, rootDy: rec.rootDy, pops: rec.pops, maxDev: rec.maxDev }, alert: !!alert, played: played.slice(0, 8), faced: faced.map((e) => +e.toFixed(3)), caught, awayNear, devBack, E, errs: errs.slice(0, 3) }))
