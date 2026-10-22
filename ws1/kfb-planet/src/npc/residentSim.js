// WS-NPC A2/A3 · Live-Schicht der Bewohner: Plan (npcDay.planAt) ist die Wahrheit; diese Schicht erlaubt kurze, sichtbare Abweichungen und führt
// danach zum Plan zurück. Rein: ohne three, ohne DOM, Node-geprüft (test/unit/npcSim.mjs). Ein Aufruf step(t, dt, sense) je Physik-Schritt (1/60 s).
//   · Spieler kommt nah (≤ playerIn): der Bewohner bleibt stehen, dreht sich zum Spieler, schaut ihn an (bemerken); geht der Spieler (≥ playerOut)
//     oder ist die Haltezeit um, macht er weiter. Danach Abklingzeit, damit niemand ewig starrt.
//   · Rückstand auf dem Weg holt er mit höchstens catchK × Plantempo auf (Tempo-Fenster der Gangart 0,8–1,25, V-248: Füße rutschen nicht).
//     War der Plan schon beim nächsten Weg, läuft er erst den alten Weg zu Ende (kein Abkürzen durch Bäume).
//   · Außerhalb der Spielerblase (sense.near = false) steht er exakt auf dem Plan (Fahrplan statt Simulation, SPEC_NPC_PATROL_R1) – keine
//     Vorgeschichte, kein Pop-in beim Zurückkommen.
//   · Begegnung: zwei Bewohner mit gegenseitigem meet am selben Treffpunkt → EncounterBeatBus (Grammatik 'kfb') mit stabiler ID aus dem Plan.
//     Kommt der Spieler dazu: interrupt, danach resume am selben Beat; endet das Plan-Fenster vorher: cancel (part → resume).
import { planAt, meetingAt, poiYaw } from './npcDay.js'
import { EncounterBeatBus, createEncounterHost } from './encounterBus.js'
import { rngOf } from '../world/fluff.js'

export const SIM = Object.freeze({ playerIn: 3.2, playerOut: 5.0, holdMaxS: 9, cooldownS: 14, catchK: 1.25, turnRate: 4.0, greetShare: 0.75, beatFirstS: 1.2,
  // Phase C (V-583): Bedrohung (feindlicher Dark Fluffer) – bemerken bis threatIn, zusammenzucken (Hit_A), hinschauen threatHold s, dann weiter; Abklingzeit;
  // weicht seitlich aus, solange der Weg näher als avoidR vorbeiführt (höchstens avoidPush m, weich nachgeführt)
  threatIn: 12, threatHold: 2.6, threatCooldown: 45, avoidR: 4, avoidPush: 1.2, avoidRate: 2.5 })
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a }
const turn = (from, to, max) => { const d = wrap(to - from); return Math.abs(d) <= max ? to : wrap(from + Math.sign(d) * max) }
const yawTo = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az)

// Ein Bewohner. day: kfb.npc-day/1, ctx: { pois, routes, dayS }, activities: { name: { base, beats[], every:[a,b] } }
export function createResidentBrain(day, ctx, activities = {}, rules = SIM, hooks = {}) {
  const routeById = new Map(ctx.routes.map((r) => [r.id, r]))
  const L = { slot: null, routeId: null, s: 0, x: 0, z: 0, yaw: 0, mode: 'plan', since: 0, cooldownUntil: -1, lastPlayerAt: -1, beatAt: 0, beatN: 0, init: false, ox: 0, oz: 0, threatUntil: -1, threatCool: -1, stats: { maxSpeedK: 0, interrupts: 0, resumes: 0, snaps: 0, alerts: 0, maxAvoid: 0 } }
  const out = { x: 0, z: 0, yaw: 0, speed: 0, gaze: null, clip: null, mode: 'plan', lag: 0, phase: 'stay', poi: null, slot: null, activity: null }

  function snapToPlan(p) { L.slot = p.slot; L.routeId = p.routeId; L.s = p.s; L.x = p.x; L.z = p.z; L.yaw = p.yaw; L.init = true }
  function posOn(routeId, s, p) { const r = routeId && routeById.get(routeId); if (r) return r.at(s); const poi = ctx.pois[p.poi]; return { x: poi.pos[0], z: poi.pos[1], yaw: poiYaw(poi), s: 0 } }

  function step(t, dt, sense = {}) {
    const p = planAt(day, ctx, t)
    out.clip = null
    if (!L.init || !sense.near) { // außerhalb der Blase: exakt der Plan
      if (L.init && (Math.hypot(L.x - p.x, L.z - p.z) > 1e-6)) L.stats.snaps++
      snapToPlan(p); L.mode = 'plan'; L.ox = L.oz = 0
      Object.assign(out, { x: p.x, z: p.z, yaw: p.yaw, speed: p.speed, gaze: null, mode: 'plan', lag: 0, phase: p.phase, poi: p.poi, slot: p.slot, activity: p.activity })
      return out
    }
    const pl = sense.player, enc = sense.encounter || null
    const dP = pl ? Math.hypot(pl.x - L.x, pl.z - L.z) : Infinity
    // Spieler bemerken / loslassen
    if (L.mode === 'player') {
      if (dP >= rules.playerOut || t - L.since > rules.holdMaxS) { L.mode = 'plan'; L.cooldownUntil = t + rules.cooldownS; L.stats.resumes++ }
    } else if (dP <= rules.playerIn && t >= L.cooldownUntil) { L.mode = 'player'; L.since = t; L.stats.interrupts++
      // Phase B: Begrüßung aus dem Gedächtnis (vor dem neuen Beleg entschieden), dann Beleg
      const g = hooks.greetPlayer?.(day.residentId); out.clip = { name: g?.clip ?? 'Idle_B', mode: 'once' }; L.greetWhy = g?.why ?? 'first'
      hooks.onEvent?.({ type: 'greet', id: day.residentId, reason: L.greetWhy, at: [L.x + L.ox, L.z + L.oz], t }) // Blase + Stimm-Laut (Georg 22.10., G-2)
      hooks.onEvent?.({ type: 'playerNotice', id: day.residentId, slot: p.slot, t }) }
    // Bedrohung (Phase C): nur ohne Spieler-Halt und ohne Begegnung; einmal je Abklingzeit
    const th = sense.threat || null, dT = th ? Math.hypot(th.x - L.x, th.z - L.z) : Infinity
    if (L.mode === 'threat' && t >= L.threatUntil) { L.mode = 'plan'; L.stats.resumes++ }
    if (L.mode === 'plan' && !enc && th && dT <= rules.threatIn && t >= L.threatCool) { L.mode = 'threat'; L.threatUntil = t + rules.threatHold; L.threatCool = t + rules.threatCooldown; L.stats.alerts++; out.clip = { name: ['Hit_A', 'Idle_B'], mode: 'once' }
      hooks.onEvent?.({ type: 'threatNotice', id: day.residentId, flufferId: th.id ?? 'fluffer', t }) }
    const hold = L.mode === 'player' || L.mode === 'threat' || (enc && enc.hold)
    // Wegstrecke: alter Weg zu Ende, dann der Plan-Weg; nie schneller als catchK × Plantempo
    const vMax = day.speed * rules.catchK
    let moved = 0
    if (!hold) {
      if (L.slot !== p.slot) {
        const r = L.routeId && routeById.get(L.routeId)
        if (r && L.s < r.length - 1e-6) { const ds = Math.min(r.length - L.s, vMax * dt); L.s += ds; moved = ds }
        if (!r || L.s >= r.length - 1e-6) { L.slot = p.slot; L.routeId = p.routeId; L.s = 0 }
      }
      if (L.slot === p.slot && p.routeId && L.s < p.s) { const ds = Math.min(p.s - L.s, vMax * dt - moved); if (ds > 0) { L.s += ds; moved += ds } }
      if (L.slot === p.slot && !p.routeId) L.s = 0
    }
    const at = posOn(L.slot === p.slot ? p.routeId : L.routeId, L.s, p)
    const onRouteEnd = !(L.slot === p.slot ? p.routeId : L.routeId) || L.s >= ((routeById.get(L.slot === p.slot ? p.routeId : L.routeId)?.length) ?? 0) - 1e-6
    const atPoi = L.slot === p.slot && onRouteEnd && p.phase === 'stay'
    L.x = at.x; L.z = at.z
    // Ausweichen: seitlicher Versatz weg von der Bedrohung, weich nachgeführt (Darstellung; der Weg selbst bleibt der Plan)
    let wx = 0, wz = 0
    if (th && dT < rules.avoidR) { const k = (rules.avoidR - dT) / rules.avoidR * rules.avoidPush, d = Math.max(1e-6, dT); wx = (L.x - th.x) / d * k; wz = (L.z - th.z) / d * k }
    const ka = 1 - Math.exp(-rules.avoidRate * dt); L.ox += (wx - L.ox) * ka; L.oz += (wz - L.oz) * ka; L.stats.maxAvoid = Math.max(L.stats.maxAvoid, Math.hypot(L.ox, L.oz))
    const speed = moved / Math.max(dt, 1e-9)
    L.stats.maxSpeedK = Math.max(L.stats.maxSpeedK, speed / day.speed)
    // Blickrichtung: Spieler > Begegnung > Weg > POI
    let want = at.yaw, gaze = null
    if (L.mode === 'player' && pl) { want = yawTo(L.x, L.z, pl.x, pl.z); gaze = { x: pl.x, z: pl.z, y: pl.y ?? null } }
    else if (L.mode === 'threat' && th) { want = yawTo(L.x, L.z, th.x, th.z); gaze = { x: th.x, z: th.z, y: null } }
    else if (th && dT <= rules.threatIn) gaze = { x: th.x, z: th.z, y: null } // behält den Fluffer im Blick
    else if (enc && enc.face && atPoi) { want = yawTo(L.x, L.z, enc.face.x, enc.face.z); gaze = enc.gaze ? { x: enc.face.x, z: enc.face.z, y: null } : null }
    else if (enc && enc.gaze) { gaze = { x: enc.gaze.x, z: enc.gaze.z, y: null }; if (atPoi) want = poiYaw(ctx.pois[p.poi]) }
    else if (atPoi) { const poi = ctx.pois[p.poi]; want = poiYaw(poi); if (poi.faceTo) gaze = { x: poi.faceTo[0], z: poi.faceTo[1], y: null } }
    L.yaw = turn(L.yaw, want, rules.turnRate * dt)
    // Aktivität am POI: Takt aus dem Plan-Slot (gleicher Seed = gleiche Folge), nur im Plan-Modus ohne Begegnung
    if (atPoi && L.mode === 'plan' && !enc) {
      const A = activities[p.activity]
      if (A?.beats?.length) {
        if (L.beatSlot !== p.slot) { L.beatSlot = p.slot; L.beatN = 0; L.beatAt = t + rules.beatFirstS }
        if (t >= L.beatAt) { const rng = rngOf('npc-beat', day.residentId, p.slot, L.beatN); out.clip = { name: A.beats[Math.floor(rng() * A.beats.length)], mode: 'once' }; L.beatN++; L.beatAt = t + A.every[0] + rng() * (A.every[1] - A.every[0]) }
      }
    }
    if (enc?.clip) out.clip = enc.clip
    const lag = L.slot === p.slot ? Math.max(0, p.s - L.s) : (routeById.get(L.routeId)?.length ?? 0) - L.s + p.s
    Object.assign(out, { x: L.x + L.ox, z: L.z + L.oz, yaw: L.yaw, speed, gaze, mode: enc ? 'encounter' : L.mode, greetWhy: L.greetWhy ?? null, lag, threatD: Number.isFinite(dT) ? dT : null, phase: atPoi ? 'stay' : 'travel', poi: p.poi, slot: p.slot, activity: p.activity })
    return out
  }
  return { id: day.residentId, day, step, out, state: () => ({ ...L, stats: { ...L.stats } }), interrupted: () => L.mode === 'player' || L.mode === 'threat', plan: (t) => planAt(day, ctx, t) }
}

// Alle Bewohner + Begegnungen. days: kfb.npc-day/1[], ctx wie oben. sense(t) liefert { player: {x,y,z}|null, near(residentId) → bool }.
// hooks (Phase B, optional): { greetPlayer(id) → { clip, why }, onEvent(e), topic(speaker, listener) → { eventKey, kind } | null }
export function createResidentSim({ days, ctx, activities = {}, rules = SIM, bus = new EncounterBeatBus(), hooks = {} }) {
  const brains = days.map((d) => createResidentBrain(d, ctx, activities, rules, hooks)), byId = new Map(brains.map((b) => [b.id, b]))
  const pairs = []
  for (let i = 0; i < days.length; i++) for (let j = i + 1; j < days.length; j++) if (days[i].entries.some((e) => e.meet === days[j].residentId)) pairs.push([days[i], days[j]])
  const host = createEncounterHost({ bus, grammar: 'kfb' })
  const E = { key: null, done: new Set(), log: [], meeting: null, t: 0, told: [] }
  bus.subscribe((e) => { E.log.push({ beat: e.beat, id: e.encounterId, cancelled: e.cancelled ?? null }); if (E.log.length > 200) E.log.shift()
    // Phase B: in 'react' erzählt, wer etwas gesehen hat, dem anderen davon (ein Thema je Begegnung); in 'resume' ist die Begegnung ein Erlebnis beider
    if (e.beat === 'react' && hooks.topic && !e.cancelled) { const pairs = [[e.targetId, e.actorId], [e.actorId, e.targetId]]
      for (const [sp, li] of pairs) { const tp = hooks.topic(sp, li); if (tp) { E.told.push({ key: e.encounterId, speaker: sp, listener: li, topic: tp }); hooks.onEvent?.({ type: 'told', speaker: sp, listener: li, topic: tp, t: E.t }); break } } }
    if (e.beat === 'resume') hooks.onEvent?.({ type: 'encounterDone', key: e.encounterId, a: e.actorId, b: e.targetId, decision: e.decision, cancelled: e.cancelled ?? null, t: E.t }) })
  const lead = () => host.seconds.notice + host.seconds.approach

  function encounterSense(id, t) {
    const c = host.current; if (!c || (c.actorId !== id && c.targetId !== id)) return null
    const other = byId.get(c.actorId === id ? c.targetId : c.actorId).out
    const b = c.beat, faceBeats = ['orient', 'greet', 'silent', 'react']
    return { beat: b, hold: c.paused, face: faceBeats.includes(b) ? { x: other.x, z: other.z } : null, gaze: ['notice', 'approach', ...faceBeats].includes(b) ? { x: other.x, z: other.z } : null, clip: E.clipFor?.(id, c) ?? null }
  }

  function step(t, dt, sense) {
    E.t = t
    // Begegnung starten, wenn der Plan ein Treffen hat (Beginn = spätere Ankunft − notice − approach), einmal je Schlüssel
    for (const [a, b] of pairs) {
      const m = meetingAt(a, b, ctx, t)
      if (!m) continue
      E.meeting = m
      if (!host.isActive && !E.done.has(m.key) && t >= m.start - lead() && t < m.end - host.seconds.part) {
        const rng = rngOf('npc-meet', m.key), decision = rng() < rules.greetShare ? 'greet' : 'silent'
        const r = host.start({ actorId: a.residentId, targetId: b.residentId, decision, encounterKey: m.key })
        if (r.ok) { E.key = m.key; E.done.add(m.key); E.started = t }
      }
      if (host.isActive && host.current.encounterId === m.key && !host.current.cancelled && t >= m.end - host.seconds.part) host.cancel('window-end')
    }
    // Spieler unterbricht einen Beteiligten → Begegnung pausiert; beide wieder frei → weiter
    if (host.isActive) {
      const c = host.current, anyHeld = [c.actorId, c.targetId].some((id) => byId.get(id).interrupted())
      if (anyHeld && !c.paused) host.interrupt('player')
      else if (!anyHeld && c.paused) host.resume()
      host.update(dt)
    }
    for (const b of brains) b.step(t, dt, { player: sense.player, near: sense.near(b.id), encounter: encounterSense(b.id, t), threat: sense.threat?.(b.id, b.out) ?? null })
    return brains.map((b) => b.out)
  }
  // Clip-Wunsch je Beat (Kit-Clips as-is; Waving aus Rig_Medium_Simulation, Lead-OK 21.10., sonst Interact): einmal beim Eintritt in den Beat
  const seen = new Map()
  E.clipFor = (id, c) => {
    const k = id + '|' + c.encounterId + '|' + c.beat; if (seen.get(id) === k) return null; seen.set(id, k)
    const speaker = c.beat === 'react' ? c.targetId : c.actorId
    if (c.beat === 'notice') return { name: 'Idle_B', mode: 'once' }
    if (c.beat === 'greet' && id === speaker) return { name: ['Waving', 'Interact'], mode: 'once' }
    const told = c.beat === 'react' ? E.told.find((x) => x.key === c.encounterId) : null // Phase B: wer erzählt, gestikuliert (Interact), der andere hört zu
    if (told) return id === told.speaker ? { name: ['Interact', 'Idle_B'], mode: 'once' } : null
    if (c.beat === 'react' && id === speaker) return { name: ['Waving', 'Idle_B'], mode: 'once' } // Antwort-Gruß
    return null
  }
  return { brains, byId, host, bus, step, encounter: () => ({ ...E, done: [...E.done], current: host.current }) }
}
