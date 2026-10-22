// WS-NPC E3 (WS0 V-634) · Trupp aus dem Geschenk im Spiel (#m1,debug,harvest,look=terrain3,patrol,gift), Spielkamera, headless:
//   A  Geschenk geladen (Original-Modelle), spawnAt am Platzhalter-Ort; Box steht bis 1,0 s, staucht in der Antizipation (≈ 1,12/0,84), dann Papier
//   B  Pop: sechs Soldaten erscheinen auf dem Papier (Absetzpunkte), nacheinander gelandet (soldier_land k = 0…5 aufsteigend)
//   C  danach marschieren sie in ihre Route (Abstand zum Papier wächst, nach ≤ 30 s in Formation auf dem Plan)
//   D  Ereignisse für WS-Audio in Reihenfolge: reveal_start → reveal_anticipation → reveal_pop → soldier_land ×6 → reveal_done; keine Seitenfehler
//   Bilder: test/out/npc/gift_{0_anticipation,1_pop,2_march}.png
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,patrol,gift', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.gift?.()?.status?.status === 'OK' && (window.__kfbM1.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const D = () => page.evaluate(() => { const M = window.__kfbM1, g = M.gift(), s = M.groups().debug.find((x) => x.id === 'toy_squad'); return { gift: g.debug, st: g.status, ev: g.events, sq: { shown: s.shown, mode: s.state.mode, lag: s.lag, members: s.members.map((m) => [m.x, m.z]), plan: s.plan.map((p) => [p.x, p.z]) } } })
await page.evaluate(() => { const M = window.__kfbM1, d = M.gift().debug, fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), px = d.at[0] + fx * 9, pz = d.at[1] + fz * 9
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(d.at[0] - px, d.at[1] - pz)) })
await page.waitForTimeout(1200)
const cam = () => page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), d = M.gift().debug, dx = d.at[0] - p[0], dz = d.at[1] - p[2], n = Math.hypot(dx, dz) || 1
  M.player().camera()?.setLookAt(p[0] - dx / n * 3.5 + dz / n * 2.0, p[1] + 2.4, p[2] - dz / n * 3.5 - dx / n * 2.0, d.at[0], M.terrainH(d.at[0], d.at[1]) + 1.4, d.at[1], false) })
await cam(); await page.waitForTimeout(500)
const before = (await D()).sq.shown // E3: vor dem Geschenk ist der Trupp unsichtbar, auch in der Zone der Begegnungstabelle
const sp = await page.evaluate(() => window.__kfbM1.gift().spawn())
const samples = []; const shots = { 0.66: 'gift_0_anticipation', 1.45: 'gift_1_pop', 4.5: 'gift_2_march' }, done = new Set()
for (let i = 0; i < 120; i++) { await page.waitForTimeout(50); const d = await D(); const tl = d.gift.t; samples.push({ tl, box: d.gift.box, paper: d.gift.paper, members: d.sq.members })
  for (const [ts, name] of Object.entries(shots)) if (tl >= +ts && !done.has(name)) { done.add(name); await cam(); await page.screenshot({ path: `test/out/npc/${name}.png` }) }
  if (tl > 5) break }
const spots = (await D()).gift.spots
let inForm = null; for (let i = 0; i < 160 && !inForm; i++) { await page.waitForTimeout(200); const d = await D(); const dev = Math.max(...d.sq.members.map((m, k) => Math.hypot(m[0] - d.sq.plan[k][0], m[1] - d.sq.plan[k][1]))); if (d.sq.mode === 'patrol' && dev < 0.6) inForm = { t: d.gift.t, dev } }
const fin = await D()
await browser.close()
const at = (t) => samples.reduce((a, s) => (Math.abs(s.tl - t) < Math.abs(a.tl - t) ? s : a))
const s05 = at(0.3), s064 = at(0.64), s12 = at(1.25), s13 = at(1.6)
const evT = fin.ev.map((e) => e.type), lands = fin.ev.filter((e) => e.type === 'soldier_land')
const onSpot = (s) => s.members.filter((m, k) => Math.hypot(m[0] - spots[k].x, m[1] - spots[k].z) < 0.35).length
process.exit(report('gift (WS-NPC E3, Trupp aus dem Geschenk)', {
  A_spawned: sp === true && fin.st.status === 'OK',
  A_squadHiddenBeforeGift: before === false,
  A_boxThenSquashThenPaper: s05.box.visible && s05.box.scale[1] > 0.98 && s064.box.scale[1] < 0.9 && s12.box.visible === false && s12.paper === true,
  B_soldiersOnPaper: onSpot(s13) >= 5,
  B_landInOrder: lands.length === 6 && lands.every((e, i) => e.k === i),
  C_marchIntoFormation: !!inForm && inForm.t < 35,
  D_eventOrder: evT.indexOf('reveal_start') === 0 && evT.indexOf('reveal_anticipation') > 0 && evT.indexOf('reveal_pop') > evT.indexOf('reveal_anticipation') && evT.indexOf('soldier_land') > evT.indexOf('reveal_pop') && evT.includes('reveal_done'),
  D_noPageErrors: errs.length === 0,
}, { s05: s05.box, s064: s064.box, s12: { box: s12.box, paper: s12.paper }, onSpot13: onSpot(s13), inForm, ev: evT, errs: errs.slice(0, 3) }))
