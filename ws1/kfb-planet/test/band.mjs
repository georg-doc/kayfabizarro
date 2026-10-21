// WS-NPC Phase D (Lead 21.10.: Modul „band“) · Ork-Band im Spiel (#m1,debug,band), aus der Spielkamera:
//   A  geladen: mit src/private die vier Band-Darsteller (r1b, KFB-Augen, Instrumente gebacken), sonst sichtbarer Platzhalter (Status PLACEHOLDER)
//   B  Takt: Clip-Zeit jedes Musikers = Formel des Scenelets aus der Weltzeit; spielt (Zeit läuft), Schlag passt zur verstrichenen Weltzeit
//   C  Blick: Spieler vor der Band (≤ gazeR) → Köpfe drehen zu ihm (begrenzt); weggehen → zurück auf 0
//   D  weggehen (jenseits Blase und Sichtweite) und zurückkommen: kein Neustart (Schlag = Weltzeit), keine Seitenfehler; Kosten je Schritt klein
//   E  Bild test/out/npc/band.png; Ort per Parameter verschiebbar (zweiter Aufruf mit bandat)
import { openPage, report } from './_page.mjs'
import fs from 'fs'
const PRIV = fs.existsSync('src/private/50_BLENDER/ORKBAND/_privat_kauf_asset/band/KFB_Band_Leader.r1.glb')
const { browser, page, errs } = await openPage('#m1,debug,band', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.band?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const A = await page.evaluate(() => window.__kfbM1.band().status)
const D = () => page.evaluate(() => ({ ...window.__kfbM1.band().debug, wt: window.__kfbM1.clock.t }))
const d0 = await D(), at = d0.at, fx = Math.cos(d0.yaw) * 0 + Math.sin(d0.yaw), fz = Math.cos(d0.yaw) // Blickrichtung der Band (+z lokal)
// Spieler 7 m vor die Band, Blick auf die Band; Spielkamera hinter ihm
await page.evaluate(({ at, fx, fz }) => { const M = window.__kfbM1, px = at[0] + fx * 7, pz = at[1] + fz * 7; M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(at[0] - px, at[1] - pz))
  M.player().camera()?.setLookAt(px + fx * 4.5 + fz * 1.5, M.terrainH(px, pz) + 2.8, pz + fz * 4.5 - fx * 1.5, at[0], M.terrainH(at[0], at[1]) + 1.2, at[1], false) }, { at, fx, fz })
await page.waitForTimeout(2500)
const b1 = await D(); await page.waitForTimeout(1500); const b2 = await D()
await page.screenshot({ path: 'test/out/npc/band.png' })
const bpm = 100, dBeat = b2.beat - b1.beat, dWt = b2.wt - b1.wt
const playing = b2.members.every((m, k) => m.t !== null && b1.members[k].t !== null && m.t !== b1.members[k].t)
const heads = b2.members.map((m) => m.headYaw)
// weg: weit hinter die Band (jenseits Blase, Blick weg), 8 s, zurück
await page.evaluate(({ at, fx, fz }) => { const M = window.__kfbM1, px = at[0] - fx * 150, pz = at[1] - fz * 150; M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(-fx, -fz)) }, { at, fx, fz })
await page.waitForTimeout(1500); const away = await D()
const tA = away.wt; for (let i = 0; i < 120; i++) { await page.waitForTimeout(150); if ((await D()).wt > tA + 8) break }
await page.evaluate(({ at, fx, fz }) => { const M = window.__kfbM1, px = at[0] + fx * 7, pz = at[1] + fz * 7; M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(at[0] - px, at[1] - pz)) }, { at, fx, fz })
await page.waitForTimeout(800); const back = await D(), awayMs = await page.evaluate(() => window.__kfbM1.band().status.ms)
await browser.close()
// zweiter Aufruf: Ort per Parameter
const P2 = await openPage('#m1,debug,band,bandat=-12,24,45', { viewport: { width: 640, height: 360 } })
await P2.page.waitForFunction(() => (window.__kfbM1?.band?.()?.status?.status ?? 'LOADING') !== 'LOADING', null, { timeout: 300000 })
const moved = await P2.page.evaluate(() => window.__kfbM1.band().debug)
await P2.browser.close()
process.exit(report('band (WS-NPC Phase D, Ork-Band im Spiel)', {
  A_loaded: PRIV ? A.status === 'OK' && A.mode === 'private' && A.members.length === 4 && A.members.every((m) => m.loaded && m.head) : A.status === 'PLACEHOLDER' && A.members.every((m) => m.loaded),
  B_playsInTime: playing && Math.abs(dBeat - dWt * bpm / 60) < 0.02,
  C_headsTurnLimited: heads.some((h) => Math.abs(h) > 0.1) && heads.every((h) => Math.abs(h) <= (50 * Math.PI) / 180 + 1e-6),
  D_awayNotAnimated: away.near === false,
  D_backNoRestart: back.near === true && Math.abs((back.beat - b2.beat) - (back.wt - b2.wt) * bpm / 60) < 0.02,
  D_cost: awayMs !== null && awayMs < 1.0,
  E_movable: Math.abs(moved.at[0] + 12) < 1e-9 && Math.abs(moved.at[1] - 24) < 1e-9 && Math.abs(moved.yaw - Math.PI / 4) < 1e-9,
  E_noPageErrors: errs.length === 0 && P2.errs.length === 0,
}, { priv: PRIV, A, dBeat: +dBeat.toFixed(3), dWt: +dWt.toFixed(3), heads: heads.map((h) => +h.toFixed(3)), awayNear: away.near, back: { beat: back.beat, wt: back.wt }, ms: awayMs, errs: [...errs, ...P2.errs].slice(0, 3) }))
