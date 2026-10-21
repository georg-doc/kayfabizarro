// WS-NPC Phase A (V-585, BRIEF_WS1_NPC_LIFE_R2) · Bewohner im Spiel (#m1,debug,harvest,npc): zwei Bewohner mit Tagesplan, eine echte Begegnung über
// die Grammatik, Unterbrechen und Fortsetzen durch den Spieler, Weggehen und Zurückkommen ohne Pop-in. Prüft im Browser (Spielkamera):
//   A  Darsteller geladen (Slot + KFB-Augen), Platzhalter markiert, Gang-Mischer steht
//   B  Spiegel der Welt (npcWorld) = Spielstand (Baumstellen orchard3d, Fundsachen)
//   C  Begegnung Tag 0 mit voller Beat-Folge und stabiler ID, beide schauen sich in orient/greet/react an, Gruß = Waving (Kit-Clip as-is)
//   D  Füße: Sohlen am Boden (Ferse/Ballen wie M1), Gang-Abspielrate im Fenster 0,8–1,25 (V-248), Figur steht auf dem Gelände
//   E  Spieler stellt sich in den Weg: Stillstand, Drehung, danach Aufholen ≤ 1,25 × Plantempo bis zum Plan
//   F  Weggehen (außerhalb der Blase und der Sichtweite) und Zurückkommen: exakt auf dem Plan, kein Sprung im Kamerabild
//   G  Kosten des Moduls je Schritt, keine Seitenfehler
// Bildreihe test/out/npc/npc-a-sheet.png (Begegnung aus der Spielkamera). PW_GPU=1 empfohlen (SwiftShader ist langsam).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/npc', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,harvest,npc,npct=92', { viewport: { width: 1280, height: 720 } })
const T = () => page.evaluate(() => window.__kfbM1.npc().time)
const waitT = async (t, max = 120000) => { const t0 = Date.now(); while ((await T()) < t && Date.now() - t0 < max) await page.waitForTimeout(150) }
await page.waitForFunction(() => { const n = window.__kfbM1?.npc?.(); return n && n.status.status !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' }, null, { timeout: 300000 })
// A
const A = await page.evaluate(() => window.__kfbM1.npc().status)
// B: Spiegel gegen Spiel
const B = await page.evaluate(async () => { const { orchardTreesXZ, npcWorldObstacles } = window.__kfbNpcTest || {}; const M = window.__kfbM1
  return { trees: M.mods.orchard.trees().map((t) => ({ ref: `orchard:${t.zone}:${t.id}`, x: t.pos[0], z: t.pos[2] })), loot: M.mods.found.items().map((l) => ({ key: l.key, x: l.x, z: l.z })) } })
const { npcWorldObstacles } = await import('../src/npc/npcWorld.js')
const OB = npcWorldObstacles()
const treeDev = Math.max(...OB.trees.map((t) => { const g = B.trees.find((x) => x.ref === t.ref); return g ? Math.hypot(g.x - t.x, g.z - t.z) : Infinity }))
const lootDev = Math.max(...OB.loot.map((l) => { const g = B.loot.find((x) => x.key === l.key); return g ? Math.hypot(g.x - l.x, g.z - l.z) : Infinity }))
// Aufzeichnung je Physik-Schritt (im Spiel): Sprünge im Kamerabild, Sohlen, Gang-Raten, Abweichung zum Plan, Modus
await page.evaluate(() => {
  const M = window.__kfbM1, THREE = M.three(), cam = M.camera3(), fr = new THREE.Frustum(), pv = new THREE.Matrix4(), sp = new THREE.Sphere(new THREE.Vector3(), 1)
  const R = window.__npcRec = { steps: 0, popsInView: 0, maxJumpK: 0, soleMin: Infinity, soleMax: -Infinity, soleSamples: 0, tsMin: Infinity, tsMax: -Infinity, rootDy: 0, prev: null, faceErr: [], modes: {}, maxSpeedK: 0 }
  const vmax = { farmer_b: 1.15 * 1.25, lore_ph: 1.0 * 1.25 }
  M.clock.onStep = () => {
    const n = M.mods.npc; if (!n) return
    R.steps++; cam.updateMatrixWorld(); pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(pv)
    const dbg = n.debug(), soles = n.soles(), pos = n.positions()
    dbg.forEach((d, i) => {
      const p = pos[i], g = M.terrainH(p.x, p.z) ?? p.y; sp.center.set(p.x, p.y + 0.9, p.z); const inView = fr.intersectsSphere(sp)
      const pr = R.prev?.[i]; if (pr && inView && pr.inView) { const j = Math.hypot(p.x - pr.x, p.z - pr.z) / (vmax[d.id] / 60); R.maxJumpK = Math.max(R.maxJumpK, j); if (j > 1.5) R.popsInView++ }
      R.rootDy = Math.max(R.rootDy, Math.abs(p.y - (M.mods.terrain.surfaceAt || M.terrainH)(p.x, p.z)))
      if (soles[i] && d.near) { const ys = Object.values(soles[i]).map((v) => v[1] - p.y); const lo = Math.min(...ys); R.soleMin = Math.min(R.soleMin, lo); R.soleMax = Math.max(R.soleMax, lo); R.soleSamples++ }
      if (d.gait && d.speed > 0.2) for (const [k, w] of Object.entries(d.gait.w)) if (k !== 'idle' && w > 0.5) { R.tsMin = Math.min(R.tsMin, d.gait.ts[k]); R.tsMax = Math.max(R.tsMax, d.gait.ts[k]) }
      R.modes[d.id + ':' + d.mode] = (R.modes[d.id + ':' + d.mode] || 0) + 1
      R.maxSpeedK = Math.max(R.maxSpeedK, d.stats.maxSpeedK)
    })
    R.prev = pos.map((p, i) => ({ x: p.x, z: p.z, inView: (() => { sp.center.set(p.x, p.y + 0.9, p.z); return fr.intersectsSphere(sp) })() }))
  }
})
// C: Spieler hinter den Treffpunkt (Spielkamera schaut auf die Wiese), Begegnung Tag 0 abwarten, Bilder je Beat
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([5.2, M.terrainH(5.2, 33.5) + 1.2, 33.5], Math.PI) })
const shots = [], faceChecks = []
const t0 = Date.now(); let lastBeat = null
while (Date.now() - t0 < 60000) {
  const st = await page.evaluate(() => { const n = window.__kfbM1.npc(); return { beat: n.encounter.current?.beat ?? null, log: n.encounter.log, dbg: n.debug.map((d) => ({ id: d.id, x: d.x, z: d.z, yaw: d.yaw, mode: d.mode })) } })
  if (st.beat && st.beat !== lastBeat) { lastBeat = st.beat; await page.waitForTimeout(450); shots.push({ beat: st.beat, buf: await page.screenshot() })
    if (['greet', 'silent', 'react'].includes(st.beat)) { const [a, b] = st.dbg; const err = (p, q) => Math.abs(Math.atan2(Math.sin(p.yaw - Math.atan2(q.x - p.x, q.z - p.z)), Math.cos(p.yaw - Math.atan2(q.x - p.x, q.z - p.z)))) * 180 / Math.PI; faceChecks.push([err(a, b), err(b, a)]) } }
  if (st.log.some((e) => e.beat === 'resume')) break
  await page.waitForTimeout(120)
}
const encLog = await page.evaluate(() => window.__kfbM1.npc().encounter.log)
const beats = encLog.map((e) => e.beat).join(','), encId = encLog[0]?.id
// E: Farmer B ist nach dem Treffen unterwegs zur Bühne – Spieler stellt sich 1,6 m neben sie, 4 s, dann 12 m weg
await waitT(122)
const before = await page.evaluate(() => window.__kfbM1.npc().debug[0])
await page.evaluate(([x, z]) => { const M = window.__kfbM1; M.player().teleport([x + 1.2, M.terrainH(x + 1.2, z + 1.0) + 1.2, z + 1.0], Math.PI) }, [before.x, before.z])
await page.waitForTimeout(1500)
const during = await page.evaluate(() => { const n = window.__kfbM1.npc(); const d = n.debug[0], p = window.__kfbM1.feet(); return { mode: d.mode, speed: d.speed, yaw: d.yaw, toPlayer: Math.atan2(p[0] - d.x, p[2] - d.z), lag: d.lag } })
await page.waitForTimeout(2500)
await page.evaluate(([x, z]) => { const M = window.__kfbM1; M.player().teleport([x + 12, M.terrainH(x + 12, z + 8) + 1.2, z + 8], Math.PI) }, [before.x, before.z])
let caught = null; const tE = await T(), lagPeak = (await page.evaluate(() => window.__kfbM1.npc().debug[0].lag))
for (let i = 0; i < 120 && caught === null; i++) { await page.waitForTimeout(250); const d = await page.evaluate(() => window.__kfbM1.npc().debug[0]); if (d.lag < 1e-6 && d.mode === 'plan') caught = (await T()) - tE }
// F: weggehen 25 s (≈ 190 m, jenseits Blase und Sichtweite), zurückkommen
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-60, M.terrainH(-60, -130) + 1.2, -130], 0) })
await page.waitForTimeout(1500)
const away = await page.evaluate(() => window.__kfbM1.npc().debug.map((d) => d.near))
const tAway = await T(); await waitT(tAway + 25)
const popsBefore = await page.evaluate(() => window.__npcRec.popsInView)
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([5.2, M.terrainH(5.2, 33.5) + 1.2, 33.5], Math.PI) })
await page.waitForTimeout(800)
const back = await page.evaluate(() => window.__kfbM1.npc().debug.map((d) => ({ id: d.id, near: d.near, dev: Math.hypot(d.x - d.plan.x, d.z - d.plan.z), mode: d.mode })))
await page.waitForTimeout(3000)
const rec = await page.evaluate(() => { const R = window.__npcRec; window.__kfbM1.clock.onStep = null; return { ...R, prev: undefined } })
const G = await page.evaluate(() => window.__kfbM1.npc().status), played = await page.evaluate(() => window.__kfbM1.npc().played)
// Bildreihe
if (shots.length) { const tiles = await Promise.all(shots.slice(0, 6).map((s) => sharp(s.buf).extract({ left: 160, top: 40, width: 960, height: 540 }).resize(480, 270).toBuffer()))
  await sharp({ create: { width: 1440, height: 540, channels: 3, background: '#000' } }).composite(tiles.map((b, i) => ({ input: b, left: (i % 3) * 480, top: Math.floor(i / 3) * 270 }))).png().toFile('test/out/npc/npc-a-sheet.png') }
await browser.close()

const face = faceChecks.length ? Math.max(...faceChecks.flat()) : null
process.exit(report('npc-a (WS-NPC Phase A im Spiel)', {
  A_residentsLoadedWithEyes: A.status === 'OK' && A.residents.length === 2 && A.residents.every((r) => r.status === 'OK' && r.actor === 'OK' && r.visible && r.head),
  A_placeholdersMarked: A.residents.every((r) => r.placeholder == null || /PLATZHALTER/.test(r.placeholder)) && /PLATZHALTER/.test(A.residents.find((r) => r.id === 'lore_ph').placeholder),
  A_farmerBIsRealFigure: A.residents.find((r) => r.id === 'farmer_b').cast === 'farmer-b' && A.residents.find((r) => r.id === 'farmer_b').placeholder == null,
  B_mirrorMatchesGameTrees: treeDev < 1e-3,
  B_mirrorMatchesGameLoot: lootDev < 1e-3,
  C_encounterFullGrammar: ['notice,approach,orient,greet,react,part,resume', 'notice,approach,orient,silent,react,part,resume'].includes(beats),
  C_encounterStableId: encId === 'meet:farmer_b+lore_ph:d0:wiese_rand',
  C_faceEachOther: face !== null && face < 20,
  C_greetGesture: !beats.includes('greet') || played.some(([id, c]) => c === 'Waving'),
  D_solesOnGround: rec.soleSamples > 100 && rec.soleMin > -0.06 && rec.soleMin < 0.06,
  D_gaitRateInWindow: rec.tsMin >= 0.8 - 1e-6 && rec.tsMax <= 1.25 + 1e-6,
  D_rootOnTerrain: rec.rootDy < 0.02,
  E_stopsAndTurnsToPlayer: during.mode === 'player' && during.speed < 1e-6 && Math.abs(Math.atan2(Math.sin(during.yaw - during.toPlayer), Math.cos(during.yaw - during.toPlayer))) < 0.2,
  E_catchesUpToPlan: caught !== null && rec.maxSpeedK <= 1.25 + 1e-6,
  F_awayOutsideBubble: away.every((n) => n === false),
  F_backExactlyOnPlan: back.every((b) => b.near && b.dev < 1e-6),
  F_noPopInView: rec.popsInView === 0 && popsBefore === 0,
  G_moduleCost: G.ms !== null && G.ms < 1.5,
  G_noPageErrors: errs.length === 0,
}, { A, treeDev, lootDev, beats, encId, face, during, lagPeak, caught, away, back, rec: { steps: rec.steps, popsInView: rec.popsInView, maxJumpK: +rec.maxJumpK.toFixed(3), soleMin: +rec.soleMin.toFixed(3), soleMax: +rec.soleMax.toFixed(3), soleSamples: rec.soleSamples, tsMin: rec.tsMin, tsMax: rec.tsMax, rootDy: rec.rootDy, modes: rec.modes, maxSpeedK: rec.maxSpeedK }, ms: G.ms, msMax: G.msMax, played: played.slice(0, 12), errs: errs.slice(0, 3) }))
