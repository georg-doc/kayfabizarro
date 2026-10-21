// WS-NPC Phase C P1 (V-583) · Bewohner und Dark Fluffer (residentSim, sense.threat): der Lorekeeper-Platzhalter geht auf dem Heimweg (Variante a) am
// Fluffer vorbei → bemerkt ihn (≤ threatIn), zuckt zusammen (Hit_A), schaut hin, hält threatHold s, macht weiter und holt ≤ 1,25 × Plantempo auf;
// weicht seitlich aus, solange er näher als avoidR ist (≤ avoidPush, ohne Sprung); geheilt (kein threat) → keine Reaktion. Fluffer aus flufferSim.
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { buildRoutes, planAt } from '../../src/npc/npcDay.js'
import { createResidentSim, SIM } from '../../src/npc/residentSim.js'
import { createFlufferSim } from '../../src/npc/flufferSim.js'

const ctx = { pois: Object.fromEntries(W.pois.map((p) => [p.id, p])), routes: buildRoutes(W.routes), dayS: W.dayS }, DT = 1 / 60
const lk = W.days.find((d) => d.residentId === 'lorekeeper')
// Welcher Tag führt den Lorekeeper auf dem Heimweg über Variante a (an der Spuckstelle vorbei)?
let day = 0; for (; day < 20; day++) { const p = planAt(lk, ctx, day * W.dayS + 0.845 * W.dayS); if (p.routeId === 'lk_work-lk_home_a') break }
const tHome = day * W.dayS + 0.84 * W.dayS
function run(withThreat) {
  const sim = createResidentSim({ days: W.days, ctx, activities: W.activities }), f = createFlufferSim({ ...W.fluffers[0], t0: tHome - 30 })
  const R = { alerts: 0, faced: false, clips: [], minD: Infinity, maxStepK: 0, avoid: 0, lagAfter: null }
  let prev = null
  for (let t = tHome - 40; t < tHome + 60; t += DT) {
    const fs = f.at(t), threat = withThreat && fs.hostile ? { x: fs.x, z: fs.z } : null
    const outs = sim.step(t, DT, { player: null, near: () => true, threat: () => threat })
    const o = outs[1]
    if (o.clip) R.clips.push([+t.toFixed(2), [].concat(o.clip.name)[0]])
    if (o.mode === 'threat' && threat && Math.abs(Math.atan2(Math.sin(o.yaw - Math.atan2(threat.x - o.x, threat.z - o.z)), Math.cos(o.yaw - Math.atan2(threat.x - o.x, threat.z - o.z)))) < 0.1) R.faced = true
    if (threat) R.minD = Math.min(R.minD, Math.hypot(threat.x - o.x, threat.z - o.z))
    if (prev) R.maxStepK = Math.max(R.maxStepK, Math.hypot(o.x - prev.x, o.z - prev.z) / (lk.speed * SIM.catchK * DT + 1e-9))
    prev = { x: o.x, z: o.z }
  }
  const st = sim.byId.get('lorekeeper').state().stats
  return { ...R, alerts: st.alerts, maxSpeedK: st.maxSpeedK, avoid: st.maxAvoid, lagEnd: sim.byId.get('lorekeeper').out.lag }
}
const a = run(true), b = run(false)
process.exit(report('unit-npcThreat (WS-NPC Phase C, Bewohner bemerkt und weicht aus)', {
  passesNearFluffer: a.minD < SIM.threatIn,
  alertsOnce: a.alerts === 1,
  startleClip: a.clips.some(([, c]) => c === 'Hit_A'),
  facesFluffer: a.faced,
  resumesAndCatchesUp: a.lagEnd < 1e-6 && a.maxSpeedK <= SIM.catchK + 1e-6,
  avoidsBounded: a.avoid > 0 && a.avoid <= SIM.avoidPush + 1e-9,
  noJump: a.maxStepK <= 1.6,
  noReactionWithoutThreat: b.alerts === 0 && b.avoid === 0,
}, { day, minD: +a.minD.toFixed(2), alerts: a.alerts, avoid: +a.avoid.toFixed(3), maxStepK: +a.maxStepK.toFixed(3), clips: a.clips.slice(0, 6) }))
