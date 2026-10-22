// WS-NPC K15 (Lead 22.10.: „je Obstgarten-Zone ein Dark Fluffer an eigenem Baum“) · mehrere Dark Fluffer im Spiel (#m1,debug,harvest,npc,fluffer):
//   A  goblin Ghost nach Plan, atlantis und utopia über spawnAt (E3-Schnittstelle des Welt-Ereignis-Hosts) nahe ihrer Spuckstelle; Sorten nach Tages-Seed
//      (atlantis zuerst Mushroom, utopia eine dritte), je mit KFB_Mouth und noch versteckten weißen Augen; nur diese drei Modelle im Modul
//   B  jeder spuckt auf SEINEN Baum (atlantis t4, utopia t1): Kügelchen dort dunkel, Flecken summiert im Gelände
//   C  Bedrohung je Bewohner-Ort: threat(at) nennt den nächsten feindlichen Fluffer
//   D  Heilen per Schuss trifft nur den gezielten (atlantis), utopia bleibt feindlich; weiße Augen nur beim geheilten
//   E  Sammel-Ereignisse events(): fluffer_spawn je Zone, impact mit id, healed mit id; hops() mit id; Culling-Status; keine Seitenfehler
import { openPage, report } from './_page.mjs'
import W from '../src/data/npc/residents.r1.json' with { type: 'json' }
const { browser, page, errs } = await openPage('#m1,debug,harvest,npc,fluffer,fluffert=2,npct=509', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.fluffer?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
const [, FA, FU] = W.fluffers, near = (f) => { const dx = f.start[0] - f.stand[0], dz = f.start[1] - f.stand[1], l = Math.hypot(dx, dz); return [f.stand[0] + (dx / l) * 1.5, f.stand[1] + (dz / l) * 1.5] }
const sp = await page.evaluate(([a, u]) => { const F = window.__kfbM1.mods.fluffer; return [F.spawnAt(a.id, ...a.at), F.spawnAt(u.id, ...u.at)] }, [{ id: FA.id, at: near(FA) }, { id: FU.id, at: near(FU) }])
await page.waitForFunction(([a, u]) => { const F = window.__kfbM1.mods.fluffer; return F.statusOf(a)?.status === 'OK' && F.statusOf(u)?.status === 'OK' }, [FA.id, FU.id], { timeout: 120000 })
const A = await page.evaluate(([a, u]) => { const F = window.__kfbM1.mods.fluffer; return { st: F.status(), a: F.statusOf(a), u: F.statusOf(u), models: F.object3d.children.length } }, [FA.id, FU.id])
// B: bis beide zweimal getroffen haben (Abwurf), dann Baum-Kügelchen und Gelände prüfen
await page.waitForFunction(([a, u]) => { const F = window.__kfbM1.mods.fluffer; return F.debugOf(a)?.spitsDone >= 2 && F.debugOf(u)?.spitsDone >= 2 }, [FA.id, FU.id], { timeout: 120000 })
const B = await page.evaluate(() => { const M = window.__kfbM1, T = M.mods.orchard.tainted().map((b) => b.key); return { atl: T.filter((k) => k.startsWith('atlantis') && /:t4:/.test(k)).length, uto: T.filter((k) => k.startsWith('utopia') && /:t1:/.test(k)).length, other: T.filter((k) => !(k.startsWith('atlantis') && /:t4:/.test(k)) && !(k.startsWith('utopia') && /:t1:/.test(k))).length, ink: M.mods.terrain.info().ink } })
const C = await page.evaluate(([a, u]) => { const F = window.__kfbM1.mods.fluffer; return { a: F.threat({ x: a.stand[0], z: a.stand[1] })?.id, u: F.threat({ x: u.stand[0], z: u.stand[1] })?.id } }, [FA, FU])
// D: Spieler 4 m vor den atlantis-Fluffer, Schuss auf ihn
await page.evaluate((id) => { const M = window.__kfbM1, g = M.mods.fluffer.debugOf(id), x = g.x + 4, z = g.z; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], -Math.PI / 2) }, FA.id)
await page.waitForTimeout(800)
const D = await page.evaluate(async ([a, u]) => { const M = window.__kfbM1, F = M.mods.fluffer, p = M.feet(), g = F.debugOf(a), dx = g.x - p[0], dz = g.z - p[2], l = Math.hypot(dx, dz)
  const r = M.mods.orchard.shoot(p, [dx / l, 0, dz / l]); await new Promise((res) => setTimeout(res, 1600))
  return { target: r?.target ?? null, aHealed: F.debugOf(a).healed, uHostile: F.debugOf(u).hostile, aEyes: F.statusOf(a).eyes, uEyes: F.statusOf(u).eyes, aShown: F.statusOf(a).shown, uShown: F.statusOf(u).shown } }, [FA.id, FU.id])
const E = await page.evaluate(() => { const F = window.__kfbM1.mods.fluffer, ev = F.events(); return { spawn: [...new Set(ev.filter((e) => e.type === 'fluffer_spawn').map((e) => e.id))], impact: [...new Set(ev.filter((e) => e.type === 'impact').map((e) => e.id))], healed: ev.filter((e) => e.type === 'healed').map((e) => e.id), hops: [...new Set(F.hops().map((h) => h.id))], withAt: ev.filter((e) => e.type === 'impact').every((e) => Array.isArray(e.at) && Array.isArray(e.mouth)) } })
await browser.close()
const kinds = A.st.fluffers.map((f) => f.kind)
process.exit(report('fluffers (WS-NPC K15, Dark Fluffer je Obstgarten-Zone)', {
  A_threeKindsBySeed: sp.every(Boolean) && kinds[0] === 'ghost' && kinds[1] === 'mushroom' && !!kinds[2] && !['ghost', 'mushroom'].includes(kinds[2]) && A.models === 3,
  A_mouthAndHiddenEyes: [A.a, A.u].every((s) => s.mouth === 'KFB_Mouth' && s.eyes === 'hidden'),
  B_ownTreesTainted: B.atl > 0 && B.uto > 0,
  B_inkSummed: !!B.ink,
  C_nearestThreat: C.a === FA.id && C.u === FU.id,
  D_healOnlyTarget: D.target === FA.id && D.aHealed && D.uHostile && D.aEyes === 'white' && D.uEyes === 'hidden',
  D_cullingNearShown: D.aShown === true,
  E_events: [W.fluffers[0].id, FA.id, FU.id].every((id) => E.spawn.includes(id)) && E.impact.includes(FA.id) && E.impact.includes(FU.id) && E.healed.includes(FA.id) && E.withAt,
  E_noPageErrors: errs.length === 0,
}, { kinds, A, B, C, D, E, errs: errs.slice(0, 5) }))
