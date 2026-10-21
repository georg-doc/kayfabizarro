// Lead · Disco K12 (Dioramen-Test Schritt 3) im Spiel (#m1,debug,disco), aus der Spielkamera:
//   A  7 Tänzer (privat, src/private) + MC FrizzleBob geladen, Augen je Platz (Batch-Profil bzw. Anker-Sitz PROOF); ohne private Dateien: Kulisse + MC, PLACEHOLDER
//   B  jeder Platz spielt den Cue der Zeitleiste (discoCueAt, gleiche Formel in Node) · C  Füße nie im Boden (floorLift V-596, Toleranz 2 cm)
//   D  HIT 1 (19,2 s: alle Chicken Dance) · Bilder test/out/disco/disco-*.png · E  keine Seitenfehler
import fs from 'fs'
import { openPage, report } from './_page.mjs'
import { discoCueAt } from '../src/npc/discoLife.js'
const PRIV = fs.existsSync('src/private/50_BLENDER/K12/data/disco_cast_k12.json'), K12 = PRIV ? JSON.parse(fs.readFileSync('src/private/50_BLENDER/K12/data/disco_cast_k12.json', 'utf8')) : null
const { browser, page, errs } = await openPage('#m1,debug,disco,look=terrain3' + (process.env.DISCO_HASH || ''), { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.disco?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 420000 })
const A = await page.evaluate(() => window.__kfbM1.disco().status)
const D = () => page.evaluate(() => window.__kfbM1.disco().debug)
const d0 = await D(), at = d0.at, y = (d0.yawDeg * Math.PI) / 180, fx = Math.sin(y), fz = Math.cos(y)
const put = (dist, side = 0, h = 3.2) => page.evaluate(({ at, fx, fz, dist, side, h }) => { const M = window.__kfbM1, px = at[0] + fx * dist + fz * side, pz = at[1] + fz * dist - fx * side
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(at[0] - px, at[1] - pz)); M.player().camera()?.setLookAt(px + fx * 5, M.terrainH(px, pz) + h, pz + fz * 5, at[0], M.terrainH(at[0], at[1]) + 1.0, at[1], false) }, { at, fx, fz, dist, side, h })
await page.waitForFunction(() => (window.__kfbM1.disco().debug.liftMeasured || []).length > 0, null, { timeout: 120000 }).catch(() => {})
const liftMC = (await D()).liftMeasured
await put(13); await page.waitForTimeout(3000)
const waitSong = async (lo, hi) => { for (let i = 0; i < 400; i++) { const d = await D(); if (d.songT >= lo && d.songT <= hi) return d; await page.waitForTimeout(100) } return null }
// B + C: einmal mitten im Lied, dann HIT 1
const mid = await waitSong(6, 9); await page.screenshot({ path: 'test/out/disco/disco-front.png' })
const fl0 = await page.evaluate(() => window.__kfbM1.discoFeet())
const hit = await waitSong(20.2, 21.5); await page.screenshot({ path: 'test/out/disco/disco-hit1.png' })
await put(9, -6, 2.0); await page.waitForTimeout(1500); await page.screenshot({ path: 'test/out/disco/disco-side.png' })
// Übersicht ohne Spielfigur im Bild: Spieler weit hinter der Kamera, Kamera 8 m vor dem Tanzkreis, 4 m hoch
await page.evaluate(({ at, fx, fz }) => { const M = window.__kfbM1, px = at[0] - fx * 16 + fz * 9, pz = at[1] - fz * 16 - fx * 9; M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(fx, fz))   /* hinter und neben die Disco: weg vom Amphitheater (Dialog-Kamera) */
  M.player().yieldCamera(true); const C = M.player().camera().camera, cx = at[0] + fx * 8.5, cz = at[1] + fz * 8.5; C.position.set(cx, M.terrainH(cx, cz) + 4.2, cz); C.lookAt(at[0] - fx * 1.2, M.terrainH(at[0], at[1]) + 0.6, at[1] - fz * 1.2) }, { at, fx, fz })   /* Kamera vom Spieler lösen (yieldCamera, wie der Dialog) */
await page.waitForTimeout(2000); await page.screenshot({ path: 'test/out/disco/disco-over.png' })
// Gesichter: je Platz Kamera 1,6 m vor dem Kopf (Blickrichtung der Figur), Ausschnitt 360×360 → Bogen
const sharp = (await import('sharp')).default, faces = []
await page.evaluate(() => window.__kfbM1.discoHold(true)); await page.waitForTimeout(800); const mem = (await D()).members
for (const m of mem) {
  await page.evaluate(({ slot }) => { const M = window.__kfbM1, a = M.discoActors().find((x) => x.slot === slot), f = a.figure; f.updateMatrixWorld(true)
    let head = null; f.traverse((o) => { if (!head && o.isBone && o.name === 'head') head = o }); const p = new f.position.constructor(); (head || f).getWorldPosition(p)
    const q = new f.quaternion.constructor(); f.getWorldQuaternion(q); const fwd = new f.position.constructor(0, 0, 1).applyQuaternion(q); fwd.y = 0; fwd.normalize()
    const hq = new f.quaternion.constructor(); (head || f).getWorldQuaternion(hq); const hf = new f.position.constructor(0, 0, 1).applyQuaternion(hq); hf.y = Math.min(0.15, Math.max(-0.15, hf.y)); if (hf.dot(fwd) > 0.2) fwd.copy(hf).normalize()   /* Blick des Kopfes, solange er nach vorn zeigt */
    const big = slot === 'mc' ? 1.05 : ['knight', 'demon', 'witch'].includes(slot) ? 2.3 : 1.6, up = slot === 'mc' ? 0.35 : 0.12
    const C = window.__kfbM1.player().camera().camera; C.position.set(p.x + fwd.x * big, p.y + up + fwd.y * big, p.z + fwd.z * big); C.lookAt(p.x, p.y + 0.1, p.z) }, { slot: m.slot })
  await page.waitForTimeout(700); faces.push({ slot: m.slot, png: await page.screenshot({ clip: { x: 460, y: 180, width: 360, height: 360 } }) }) }
await page.evaluate(() => window.__kfbM1.discoHold(false))
await sharp({ create: { width: 360 * 4, height: 360 * 2, channels: 3, background: '#222' } }).composite(faces.map((f, i) => ({ input: f.png, left: (i % 4) * 360, top: Math.floor(i / 4) * 360 }))).png().toFile('test/out/disco/disco-faces.png')
const fl = [...(fl0 || []), ...((await page.evaluate(() => window.__kfbM1.discoFeet())) || [])].filter((f) => f.minY != null)
await browser.close()
const want = (d) => (K12 ? K12.slots : []).filter((s) => s.cast !== 'fb_game').map((s) => { const cues = [...s.cues].map((c, i) => ({ ...c, _i: i })).sort((a, b) => a.t - b.t || a._i - b._i); const h = discoCueAt(cues, d.songT, K12.clock.length); return { slot: s.slot, clip: h.cue.runtime || h.cue.clip === 'bounce' ? 'Idle_A' : h.cue.clip } })
const cueOk = (d) => !!d && want(d).every((w) => { const m = d.members.find((x) => x.slot === w.slot); return m && (m.clip === w.clip || (w.clip === 'Idle_A' && m.clip)) })
const hitAll = !!hit && hit.members.filter((m) => m.slot !== 'mc' && m.slot !== 'minion').every((m) => m.clip === 'kfb_dance_chicken_a') && hit.members.find((m) => m.slot === 'mc')?.clip === 'kfb_dance_chicken_a'
process.exit(report('disco K12 (Lead, Dioramen-Test Schritt 3)', {
  A_loaded: PRIV ? A.status === 'OK' && A.members.length === 8 && A.members.every((m) => m.status === 'OK') : A.status === 'PLACEHOLDER' && A.members.find((m) => m.slot === 'mc')?.status === 'OK',
  B_cuesMid: PRIV ? cueOk(mid) : true,
  B_cuesHit: PRIV ? cueOk(hit) : true,
  C_feetAboveGround: fl ? fl.every((f) => f.minY >= -0.02) : true,
  D_hit1AllChicken: PRIV ? hitAll : true,
  E_noPageErrors: errs.length === 0,
}, { priv: PRIV, A, liftMC, at, yawDeg: d0.yawDeg, siteDev: d0.siteDev, mid: mid && mid.members.map((m) => `${m.slot}:${m.clip}@${m.t?.toFixed?.(2)} lift ${m.lift}`), hit: hit && hit.members.map((m) => `${m.slot}:${m.clip}`), feet: fl, errs: errs.slice(0, 4) }))
