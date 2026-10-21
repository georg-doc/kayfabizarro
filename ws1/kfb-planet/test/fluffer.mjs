// WS-NPC Phase C P1 (V-583 Dark Fluffer; Georg 21.10.: Ghost, Heil-Waffe Gun_Pistol) · im Spiel (#m1,debug,harvest,npc,fluffer), Abnahme nach dem
// Web-Chat-Brief (A–F), soweit im Spiel messbar:
//   A  Ghost geladen, Maul-Knochen „Mouth“ vorhanden, Heil-Waffe am Hand-Slot des Spielers (Isolationsbilder: test/out/npc/iso, nicht hier)
//   B  Fleck entsteht erst beim Aufprall (vorher kein Tusche-Shader), wächst 0,4 → 0,7 → 1,0
//   C  Baum Goblin t4: dunkel nach dem 1. Aufprall, fällt nach dem 2., liegt, sinkt ein; andere Bäume unverändert
//   D  der Lorekeeper-Platzhalter kommt auf dem Heimweg vorbei: bemerkt (einmal), schaut hin, kehrt zum Plan zurück (Rückstand 0)
//   E  Heilen per Schuss: geheilt, genau ein bunter Fluff (6 Sorten), danach kein Spucken; Fleck verblasst, Tusche-Shader wieder ab
//   F  Kosten des Moduls je Schritt, keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,npc,fluffer,fluffert=2,npct=509', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.fluffer?.()?.status.status === 'OK' && window.__kfbM1.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
const F = () => page.evaluate(() => { const M = window.__kfbM1; return { ...M.fluffer(), ink: M.mods.terrain.info().ink, now: M.clock.t } })
const waitT = async (t) => { for (let i = 0; i < 2000; i++) { if ((await F()).now >= t) return; await page.waitForTimeout(150) } }
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-9.0, M.terrainH(-9, 43) + 1.2, 43.0], Math.PI * 1.25) })
const f0 = await F(), sp = f0.debug.spits
// Aufzeichnung je Schritt: Lorekeeper-Modus und Rückstand, Fleck-Stärke
await page.evaluate(() => { const M = window.__kfbM1, R = window.__flRec = { modes: {}, alertT: null, faced: false, lagMaxAfter: 0 }
  M.clock.onStep = () => { const n = M.mods.npc, f = M.mods.fluffer; if (!n || !f) return; const d = n.debug()[1], th = f.threat()
    R.modes[d.mode] = (R.modes[d.mode] || 0) + 1; if (d.mode === 'threat' && R.alertT === null) R.alertT = M.clock.t
    if (d.mode === 'threat' && th) { const want = Math.atan2(th.x - d.x, th.z - d.z), e = Math.atan2(Math.sin(d.yaw - want), Math.cos(d.yaw - want)); if (Math.abs(e) < 0.15) R.faced = true }
    R.last = { mode: d.mode, lag: d.lag, alerts: d.stats.alerts } } })
const bInkBefore = (await F()).ink
await waitT(sp[0].impact - 0.2); const bPre = await F()
const treeKeys = await page.evaluate(() => window.__kfbM1.mods.orchard.balls().filter((b) => b.key.startsWith('goblin') && /:t4:/.test(b.key) && b.state === 'hanging').map((b) => b.key))
const others0 = await page.evaluate(() => Object.fromEntries(window.__kfbM1.mods.orchard.balls().filter((b) => b.key.startsWith('goblin') && !/:t4:/.test(b.key)).map((b) => [b.key, b.state]))) // Startzustand (je Baum liegt Fallobst schon am Boden)
await waitT(sp[0].impact + 0.2); const b1 = await F(); const t1 = await page.evaluate(() => window.__kfbM1.mods.orchard.tainted().length)
await waitT(sp[1].impact + 0.2); const b2 = await F()
await waitT(sp[2].impact + 0.2); const b3 = await F()
await waitT(sp[2].impact + 6); const c = await page.evaluate((keys) => { const O = window.__kfbM1.mods.orchard, st = Object.fromEntries(O.balls().map((b) => [b.key, b.state])); return { states: keys.map((k) => st[k]), othersNow: Object.fromEntries(O.balls().filter((b) => b.key.startsWith('goblin') && !/:t4:/.test(b.key)).map((b) => [b.key, b.state])) } }, treeKeys)
// D: Lorekeeper geht ab Tageszeit 0,84 heim (Variante a) und kommt am lauernden Ghost vorbei
await waitT(85)
const d = await page.evaluate(() => ({ ...window.__flRec, last: window.__flRec.last }))
// E: heilen
const counts0 = await page.evaluate(() => Object.values(window.__kfbM1.mods.orchard.counts()).reduce((s, v) => s + v, 0))
const eyesBefore = await page.evaluate(() => window.__kfbM1.fluffer().status.eyes)
// Georg 21.10. (a): Heilschuss aus 6 m schräg von der Baumseite (Stamm näher als die Ghost-Mitte, Fall aus dem WS-Audio-Video) trifft den Ghost
const six = await page.evaluate(() => { const M = window.__kfbM1, g = M.fluffer().debug, tr = M.mods.orchard.trees().find((t) => t.zone === 'goblin' && t.id === 't4'), tx = tr.pos[0] - g.x, tz = tr.pos[2] - g.z, n = Math.hypot(tx, tz) || 1
  const a = Math.atan2(tx, tz) + 0.45, px = g.x + Math.sin(a) * 6, pz = g.z + Math.cos(a) * 6; M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(g.x - px, g.z - pz))
  return { treeD: +Math.hypot(tr.pos[0] - px, tr.pos[2] - pz).toFixed(2), ghostD: 6, hostile: g.hostile } })
await page.waitForTimeout(400)
const e0 = await page.evaluate(async () => { const M = window.__kfbM1, p = M.feet(), g = M.fluffer().debug, dx = g.x - p[0], dz = g.z - p[2], l = Math.hypot(dx, dz); const r = M.mods.orchard.shoot(p, [dx / l, 0, dz / l]); await new Promise((res) => setTimeout(res, 1600)); return { r, healed: M.fluffer().debug.healed } })
const spitsAtHeal = (await F()).debug.spitsDone
await page.waitForTimeout(6500)
const e1 = await F()
const burst = await page.evaluate(() => { const O = window.__kfbM1.mods.orchard; return O.balls().filter((b) => b.key.startsWith('heal:')).map((b) => ({ key: b.key, kind: b.kind, state: b.state, p: b.p })) })
const got = await page.evaluate((bs) => bs.reduce((n, b) => n + (b.state === 'resting' ? window.__kfbM1.mods.orchard.collectAt(b.p, 'walk').length : 0), 0), burst)
const again = await page.evaluate(async () => { const M = window.__kfbM1, p = M.feet(), g = M.fluffer().debug, dx = g.x - p[0], dz = g.z - p[2], l = Math.hypot(dx, dz); const r = M.mods.orchard.shoot(p, [dx / l, 0, dz / l]); await new Promise((res) => setTimeout(res, 1500)); return { r, heals: M.fluffer().debug.heals, bursts: M.fluffer().debug.events.filter((e) => e.type === 'burst').length } })
const G = await page.evaluate(() => ({ npc: window.__kfbM1.npc().status.ms, fluffer: window.__kfbM1.fluffer().status }))
await page.evaluate(() => { window.__kfbM1.clock.onStep = null })
await browser.close()
const evTypes = e1.debug.events.map((e) => e.type)
process.exit(report('fluffer (WS-NPC Phase C P1 im Spiel)', {
  A_ghostMouthGun: f0.status.status === 'OK' && f0.status.mouth && f0.status.gun,
  B_noInkBeforeImpact: bInkBefore === false && bPre.ink === false && bPre.debug.patch === null,
  B_patchGrowsOnImpact: b1.ink === true && Math.abs(b1.debug.patch.amount - 0.4) < 1e-6 && Math.abs(b2.debug.patch.amount - 0.7) < 1e-6 && Math.abs(b3.debug.patch.amount - 1) < 1e-6,
  C_treeDarkAfterFirst: t1 === treeKeys.length && treeKeys.length > 0,
  C_fallsRestsSinks: c.states.every((s) => s === 'sunk'),
  C_otherTreesUntouched: Object.keys(others0).length > 10 && Object.entries(others0).every(([k, v]) => c.othersNow[k] === v),
  D_residentNoticesOnce: d.alertT !== null && d.last.alerts === 1 && d.faced,
  D_residentBackToPlan: d.last.mode === 'plan' && d.last.lag < 1e-6,
  E_healedByShot: e0.r?.target === 'dark_fluffer_ghost' && e0.healed,
  E_healFromSixMetresTreeNearer: six.hostile && six.treeD < six.ghostD && e0.r?.target === 'dark_fluffer_ghost', // Vorrang feindlicher Fluffer vor dem Baum
  E_whiteEyesAfterHeal: eyesBefore === 'hidden' && G.fluffer.eyes === 'white' && G.fluffer.mouth === 'KFB_Mouth', // WSB K11 k11c: weiße Augen erst nach dem Heilen, Spucken aus KFB_Mouth
  E_noSpitAfterHeal: e1.debug.spitsDone === spitsAtHeal && evTypes.filter((t) => t === 'spit').length === 3,
  E_burstOnceSixKinds: burst.length === 6 && new Set(burst.map((b) => b.kind)).size === 6 && again.bursts === 1 && again.heals === 1,
  E_burstCollectable: got === 6,
  E_patchFadesInkOff: e1.debug.patch === null && e1.ink === false,
  F_moduleCost: G.npc !== null && G.npc < 1.5,
  F_noPageErrors: errs.length === 0,
}, { spits: sp.map((s) => +s.impact.toFixed(2)), b: [bPre.debug.patch, b1.debug.patch?.amount, b2.debug.patch?.amount, b3.debug.patch?.amount], treeKeys: treeKeys.length, t1, c: { states: c.states, others: Object.keys(others0).length }, d: { alertT: d.alertT, faced: d.faced, last: d.last, modes: d.modes }, e0, spitsAtHeal, evTypes, burst: burst.map((b) => b.kind + ':' + b.state), got, counts0, again, G, errs: errs.slice(0, 3) }))
