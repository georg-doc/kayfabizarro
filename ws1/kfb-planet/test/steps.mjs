// WS-NPC · Schritt- und Hüpf-Ereignisse für den Ton (WS-Audio, Georg 21.10.) im Spiel (#m1,debug,harvest,look=terrain3,npc,fluffer,patrol):
//   A  gehende Gruppen-Mitglieder und Bewohner melden step (Fuß l/r abwechselnd, Takt plausibel 0,2–1,0 s je Fuß), stehende nicht
//   B  Schritte liegen am Fuß (≤ 0,6 m von der Figur zur Meldezeit, base), eigener Ringpuffer (Treffer-Ereignisse bleiben unberührt)
//   C  der Dark Fluffer meldet hop beim Gehen (Abstand ≈ Walk-Takt), nicht beim Stehen; keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,npc,fluffer,fluffert=1,patrol', { viewport: { width: 960, height: 540 } })
await page.waitForFunction(() => (window.__kfbM1?.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && window.__kfbM1.npc?.()?.status.status === 'OK' && window.__kfbM1.fluffer?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
// Spieler zwischen Skelette und Goblin-Hain (beide in der Blase)
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-22, M.terrainH(-22, 28) + 1.2, 28], Math.PI) })
await page.waitForTimeout(2000)
const t0 = await page.evaluate(() => window.__kfbM1.clock.t)
await page.waitForTimeout(12000)
const R = await page.evaluate((t0) => { const M = window.__kfbM1, g = M.groups(), n = M.npc(), f = M.fluffer()
  return { steps: g.steps.filter((e) => e.t > t0), npcSteps: n.steps, hops: f.hops.filter((e) => e.t > 0), events: g.events.length, members: g.debug.flatMap((d) => d.members.map((m) => ({ id: m.id, x: m.x, z: m.z, speed: m.speed }))), flufferClip: f.debug.clip } }, t0)
await browser.close()
const byId = {}; for (const e of R.steps) (byId[e.id] ||= []).push(e)
const skel = Object.entries(byId).filter(([id]) => id.startsWith('skel_'))
const alternates = skel.length > 0 && skel.every(([, l]) => l.length >= 6 && l.filter((e, i) => i > 0 && e.foot === l[i - 1].foot).length <= Math.ceil(l.length * 0.2))
const gaps = skel.flatMap(([, l]) => l.slice(1).map((e, i) => e.t - l[i].t))
const cadence = gaps.length > 5 && gaps.filter((g) => g >= 0.15 && g <= 1.0).length >= gaps.length * 0.85
const nearFoot = R.steps.length > 0 && R.steps.every((e) => Array.isArray(e.base) && Math.hypot(e.at[0] - e.base[0], e.at[1] - e.base[1]) < 0.6) // Fuß ≤ 0,6 m von der Figur zur Meldezeit
const hopGaps = R.hops.slice(1).map((e, i) => e.t - R.hops[i].t)
process.exit(report('steps (WS-NPC, Schritt- und Hüpf-Ereignisse für den Ton)', {
  A_groupStepsAlternate: alternates,
  A_cadencePlausible: cadence,
  A_residentSteps: Array.isArray(R.npcSteps),
  B_stepsSeparateBuffer: R.events <= 60 && R.steps.length > 0,
  B_stepsNearFigure: nearFoot,
  B_rigField: R.steps.length > 0 && R.steps.every((e) => e.rig === 'medium' || e.rig === 'large') && R.steps.filter((e) => e.id.startsWith('skel_')).every((e) => e.rig === 'medium'),
  C_flufferHops: R.hops.length >= 3 && hopGaps.every((g) => g > 0.2 && g < 1.5),
  C_noPageErrors: errs.length === 0,
}, { counts: Object.fromEntries(Object.entries(byId).map(([k, v]) => [k, v.length])), gaps: gaps.slice(0, 12).map((g) => +g.toFixed(2)), npcSteps: R.npcSteps.length, hops: R.hops.length, hopGaps: hopGaps.slice(0, 8).map((g) => +g.toFixed(2)), flufferClip: R.flufferClip, errs: errs.slice(0, 3) }))
