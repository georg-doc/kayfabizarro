// WS-NPC N15 (WS0 22.10., ersetzt G-3) · Spielzeugsoldaten-KO im Spiel (#m1,debug,harvest,look=terrain3,patrol,gift):
//   mit src/private: KO = kfb_toy_topple_a, Aufstehen = kfb_toy_standup_a (Aufsteh-Dauer 1,0 s), sonst Rückfall auf die Skelett-Clips; keine Seitenfehler
import { openPage, report } from './_page.mjs'
import fs from 'fs'
const PRIV = fs.existsSync('src/private/50_BLENDER/N15/_privat_kauf_asset/KFB_ToySoldier_duel.r3d.n15.glb')
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,patrol,gift', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.gift?.()?.status?.status === 'OK' && (window.__kfbM1.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
await page.evaluate(() => { const M = window.__kfbM1, d = M.gift().debug, fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), px = d.at[0] + fx * 7, pz = d.at[1] + fz * 7
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(d.at[0] - px, d.at[1] - pz)); M.gift().spawn() })
await page.waitForTimeout(4500)
const shoot = () => page.evaluate(async () => { const M = window.__kfbM1, p = M.feet(), g = M.groups().debug.find((x) => x.id === 'toy_squad'), m = g.members.filter((x) => !x.ko).reduce((a, b) => (Math.hypot(b.x - p[0], b.z - p[2]) < Math.hypot(a.x - p[0], a.z - p[2]) ? b : a)), l = Math.hypot(m.x - p[0], m.z - p[2])
  const r = M.mods.orchard.shoot(p, [(m.x - p[0]) / l, 0, (m.z - p[2]) / l]); await new Promise((res) => setTimeout(res, 900)); return r })
const shots = []; for (let i = 0; i < 5; i++) shots.push(await shoot())
const ev = () => page.evaluate(() => window.__kfbM1.groups().events.filter((e) => e.group === 'toy_squad'))
let ko = null; for (let i = 0; i < 20 && !ko; i++) { await page.waitForTimeout(200); ko = (await ev()).find((e) => e.type === 'ko') }
let awake = null; for (let i = 0; i < 80 && !awake; i++) { await page.waitForTimeout(250); awake = (await ev()).find((e) => e.type === 'awake' && e.id === ko?.id) }
await page.waitForTimeout(1200)
const st = await page.evaluate((id) => { const M = window.__kfbM1, g = M.groups().debug.find((x) => x.id === 'toy_squad'); return { koNow: g.members.find((m) => m.id === id)?.ko, played: M.groups().played.filter(([i]) => i === id).map(([, c]) => c) } }, ko?.id)
await browser.close()
const want = PRIV ? ['kfb_toy_topple_a', 'kfb_toy_standup_a'] : ['Skeletons_Death', 'Skeletons_Awaken_Floor']
process.exit(report('toyko (WS-NPC N15, Spielzeugsoldaten-KO)', {
  A_ko: !!ko && st.played.includes(want[0]),
  B_standUp: !!awake && st.played.includes(want[1]) && st.koNow === false,
  C_noPageErrors: errs.length === 0,
}, { priv: PRIV, shots: shots.map((s) => s?.target), ko, awake, st, errs: errs.slice(0, 3) }))
