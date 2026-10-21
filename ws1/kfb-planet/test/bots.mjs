// WS-NPC Phase D (Georg 21.10.: Bots als Arbeitstrupp) · Kayfabrick-Bots B17 r1 (PROOF) im Spiel (#m1,debug,harvest,look=terrain3,patrol):
//   A  drei Bots geladen (mit src/private: B17-Körper, Darsteller OK; sonst Platzhalter), Kulisse (Ladestation, Blöcke) steht
//   B  KFB-Augen sitzen an den Karten-Ankern (eyeActor eyeAnchors → deriveSourceAnchorSeed OK, symmetrisch)
//   C  Tragen: Block sichtbar beim Gehen, unsichtbar beim Halten an Station/Baustelle; Plan exakt (Fahrplan)
//   D  Treffer → Wut (kfb_bot_angry_a) + Fluff; keine Seitenfehler; Frontbild test/out/npc/bot_front.png (für Georg: Augen PROOF), Bild bot_crew.png
import { openPage, report } from './_page.mjs'
import fs from 'fs'
const PRIV = fs.existsSync('src/private/50_BLENDER/B17/_privat_kauf_asset/KayfabrickBot_comic_helm.r1.glb')
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,patrol', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK' && !!window.__kfbM1.mods.orchard, null, { timeout: 300000 })
const A = await page.evaluate(() => { const s = window.__kfbM1.groups().status; return { status: s.status, statics: s.statics, crew: s.groups.find((g) => g.id === 'bot_crew') } })
const G = () => page.evaluate(() => window.__kfbM1.groups().debug.find((x) => x.id === 'bot_crew'))
const ST = () => page.evaluate(() => window.__kfbM1.groups().status.groups.find((g) => g.id === 'bot_crew').members)
// in die Nähe (Blase), Kamera auf den Trupp
const near = () => page.evaluate(() => { const M = window.__kfbM1, g = M.mods.groups.debug().find((x) => x.id === 'bot_crew'), l = g.members[0], px = l.x + Math.cos(l.yaw) * 6, pz = l.z - Math.sin(l.yaw) * 6
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(l.x - px, l.z - pz)) })
await near(); await page.waitForTimeout(1500)
const rec = { walkVis: 0, walkN: 0, holdVis: 0, holdN: 0, maxDev: 0 }
for (let i = 0; i < 120; i++) { await page.waitForTimeout(150); const [g, st] = await Promise.all([G(), ST()])
  g.members.forEach((m, k) => { const p = st[k]?.prop; if (!p) return; if (m.speed > 0.3 && !m.overlay) { rec.walkN++; if (p.visible) rec.walkVis++ } else if (m.speed < 0.05) { rec.holdN++; if (p.visible) rec.holdVis++ } })
  if (g.state.mode === 'patrol' && g.lag < 1e-6) g.members.forEach((m, k) => { rec.maxDev = Math.max(rec.maxDev, Math.hypot(m.x - g.plan[k].x, m.z - g.plan[k].z)) }) }
await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), g = M.mods.groups.debug().find((x) => x.id === 'bot_crew'), c = g.members.reduce((a, m) => [a[0] + m.x / 3, a[1] + m.z / 3], [0, 0]), dx = c[0] - p[0], dz = c[1] - p[2], l = Math.hypot(dx, dz) || 1
  M.player().camera()?.setLookAt(p[0] - dx / l * 4 + dz / l * 1.8, p[1] + 2.2, p[2] - dz / l * 4 - dx / l * 1.8, c[0], M.terrainH(c[0], c[1]) + 0.8, c[1], false) })
await page.waitForTimeout(800); await page.screenshot({ path: 'test/out/npc/bot_crew.png' })
// Frontbild: Spieler 2,6 m vor dem Anführer, leicht seitlich; Kamera über die Schulter auf das Gesicht
await page.evaluate(() => { const M = window.__kfbM1, g = M.mods.groups.debug().find((x) => x.id === 'bot_crew'), l = g.members[0], fx = Math.sin(l.yaw), fz = Math.cos(l.yaw), sx = Math.cos(l.yaw), sz = -Math.sin(l.yaw), px = l.x + fx * 2.6 + sx * 1.2, pz = l.z + fz * 2.6 + sz * 1.2
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(l.x - px, l.z - pz)) })
await page.waitForTimeout(1200)
await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), g = M.mods.groups.debug().find((x) => x.id === 'bot_crew'), l = g.members[0], dx = l.x - p[0], dz = l.z - p[2], n = Math.hypot(dx, dz) || 1
  M.player().camera()?.setLookAt(p[0] - dx / n * 1.8 + dz / n * 1.4, p[1] + 1.4, p[2] - dz / n * 1.8 - dx / n * 1.4, l.x, M.terrainH(l.x, l.z) + 1.1, l.z, false) })
await page.waitForTimeout(800); await page.screenshot({ path: 'test/out/npc/bot_front.png' })
// Treffer → Wut
const shot = await page.evaluate(async () => { const M = window.__kfbM1, p = M.feet(), g = M.mods.groups.debug().find((x) => x.id === 'bot_crew'), m = g.members.reduce((a, b) => (Math.hypot(b.x - p[0], b.z - p[2]) < Math.hypot(a.x - p[0], a.z - p[2]) ? b : a)), l = Math.hypot(m.x - p[0], m.z - p[2])
  const r = M.mods.orchard.shoot(p, [(m.x - p[0]) / l, 0, (m.z - p[2]) / l]); await new Promise((res) => setTimeout(res, 1600)); return { r, ev: M.groups().events.filter((e) => e.group === 'bot_crew').map((e) => [e.type, e.id, e.n]), played: M.groups().played.filter(([id]) => id.startsWith('bot_')).slice(-6) } })
const S1 = await ST()
await browser.close()
const seeds = (A.crew?.members || []).map((m) => m.anchorSeed)
process.exit(report('bots (WS-NPC Phase D, Kayfabrick-Arbeitstrupp B17 PROOF)', {
  A_loaded: A.crew?.members.length === 3 && A.crew.members.every((m) => m.status === 'OK' && m.actor === 'OK') && (PRIV ? A.crew.members.every((m) => m.body === 'private') : true),
  A_statics: PRIV ? A.statics.filter((s) => s.group === 'bot_crew' && s.status === 'OK').length === 4 : A.statics.every((s) => s.status !== 'ERROR'),
  B_eyesAtCardAnchors: PRIV ? seeds.every((s) => s?.status === 'OK' && s.asymmetry.x < 0.02 && s.asymmetry.y < 0.02) : true,
  C_blockWhileWalking: PRIV ? rec.walkN > 20 && rec.walkVis === rec.walkN && rec.holdVis === 0 : true,
  C_onPlan: rec.maxDev < 1e-6,
  D_hitMakesAngry: /^group:bot_/.test(shot.r?.target || '') && shot.ev.some((e) => e[0] === 'hit') && shot.played.some(([, c]) => c === 'Hit_A' || c === 'kfb_bot_angry_a'),
  D_noPageErrors: errs.length === 0,
}, { priv: PRIV, A: { statics: A.statics, members: A.crew?.members.map((m) => ({ status: m.status, actor: m.actor, body: m.body, prop: m.prop, seed: m.anchorSeed && { status: m.anchorSeed.status, anchor: m.anchorSeed.anchor, inset: m.anchorSeed.inset, asym: m.anchorSeed.asymmetry } })) }, rec, shot, errs: errs.slice(0, 3) }))
