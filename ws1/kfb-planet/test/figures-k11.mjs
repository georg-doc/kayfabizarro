// WS-NPC · Echte Bewohner-Figuren im Spiel (WSB K11, WS0 V-602; #m1,debug,harvest,look=terrain3,npc), aus der Spielkamera:
//   A  mit src/private: Farmer B = KFB_Farmer_harke.k11 (Gabel), Lorekeeper = KFB_Lorekeeper.k11b (Buch), Darsteller OK, Augen-Rig OK, Kopf da;
//      ohne src/private: öffentliche Fassung (Farmer_B.glb / Lorekeeper.glb aus main), kein Fehler
//   B  Farmer B gräbt bzw. harkt (Digging / Working_C) mit der Gabel; Gabel nur in diesen Clips sichtbar
//   C  Lorekeeper liest (Holding_C / Umblättern / Holding_B) mit Buch; nie Use_Item, solange das Buch da ist; Buch nur in diesen Clips sichtbar
//   D  keine Seitenfehler; Bilder test/out/npc/k11_farmer.png, k11_lorekeeper.png
import { openPage, report } from './_page.mjs'
import fs from 'fs'
const PRIV = fs.existsSync('src/private/50_BLENDER/K11/_privat_kauf_asset/KFB_Lorekeeper.k11b.glb')
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,npc,npct=40', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => (window.__kfbM1?.npc?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const A = await page.evaluate(() => window.__kfbM1.npc().status.residents)
const MOUNTS = { farmer_b: ['Digging', 'Working_C'], lorekeeper: ['Holding_C', 'Holding_B', 'kfb_npc_read_page_turn_a'] }
// wie band.mjs: Spieler 5 m vor der Figur (Blick auf sie), Spielkamera schräg hinter dem Spieler
const look = (id) => page.evaluate((id) => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === id), fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), sx = Math.cos(d.yaw), sz = -Math.sin(d.yaw), px = d.x + fx * 3 + sx * 1.6, pz = d.z + fz * 3 + sz * 1.6
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(d.x - px, d.z - pz)) }, id)
const relook = (id) => page.evaluate((id) => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === id), p = M.feet(), dx = d.x - p[0], dz = d.z - p[2], l = Math.hypot(dx, dz) || 1
  M.player().camera()?.setLookAt(p[0] - dx / l * 2.6 + dz / l * 1.8, p[1] + 1.6, p[2] - dz / l * 2.6 - dx / l * 1.8, d.x, M.terrainH(d.x, d.z) + 0.9, d.z, false) }, id)
async function watch(id, ms, shot) {
  const rec = { inMount: 0, propInMount: 0, outMount: 0, propOutMount: 0, clips: new Set(), shotDone: false }
  const k = A.findIndex((r) => r.id === id)
  for (let t = 0; t < ms; t += 120) {
    await page.waitForTimeout(120)
    const s = await page.evaluate((id) => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === id), r = M.npc().status.residents.find((x) => x.id === id); return { ov: d.overlay, prop: r.prop } }, id)
    if (s.ov) rec.clips.add(s.ov)
    const inM = MOUNTS[id].includes(s.ov)
    if (inM) { rec.inMount++; if (s.prop?.visible) rec.propInMount++ } else { rec.outMount++; if (s.prop?.visible) rec.propOutMount++ }
    if (inM && !rec.shotDone && s.prop?.visible) { await relook(id); await page.waitForTimeout(400); await page.screenshot({ path: shot }); rec.shotDone = true }
  }
  if (!rec.shotDone) await page.screenshot({ path: shot })
  return { ...rec, clips: [...rec.clips], k }
}
await look('farmer_b'); await relook('farmer_b'); const F = await watch('farmer_b', 30000, 'test/out/npc/k11_farmer.png')
await look('lorekeeper'); await relook('lorekeeper'); const L = await watch('lorekeeper', 30000, 'test/out/npc/k11_lorekeeper.png')
const played = await page.evaluate(() => window.__kfbM1.npc().played)
await browser.close()
const fb = A.find((r) => r.id === 'farmer_b'), lk = A.find((r) => r.id === 'lorekeeper')
const usedUseItemWithBook = played.some(([id, c]) => id === 'lorekeeper' && c === 'Use_Item') && !!lk?.prop
process.exit(report('figures-k11 (WS-NPC, echte Bewohner-Figuren WSB K11 im Spiel)', {
  A_bodies: PRIV ? fb?.body === 'private' && lk?.body === 'private' && fb.prop?.id === 'pitchfork' && lk.prop?.id === 'book' : fb?.body === 'public' && lk?.body === 'public',
  A_actorsOk: [fb, lk].every((r) => r && r.status === 'OK' && r.actor === 'OK' && r.head),
  B_farmerWorksWithFork: PRIV ? F.inMount > 0 && F.propInMount === F.inMount && F.propOutMount === 0 && played.some(([id, c]) => id === 'farmer_b' && (c === 'Digging' || c === 'Working_C')) : true,
  C_lorekeeperReadsWithBook: PRIV ? L.inMount > 0 && L.propInMount === L.inMount && L.propOutMount === 0 && !usedUseItemWithBook : true,
  D_noPageErrors: errs.length === 0,
}, { priv: PRIV, A: A.map((r) => ({ id: r.id, cast: r.cast, body: r.body, prop: r.prop, status: r.status, actor: r.actor })), F, L, played: played.slice(-12), errs: errs.slice(0, 3) }))
