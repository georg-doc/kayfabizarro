// WS-NPC Phase C P1 (V-583 Dark Fluffer, Georg 21.10.: Gegner Ghost, Heil-Waffe Gun_Pistol) · reiner Ablauf eines Dark Fluffers, ohne three, ohne DOM,
// Node-geprüft (test/unit/flufferSim.mjs). Fahrplan statt Simulation wie bei den Bewohnern: alles folgt aus Startzeit, Seed und den Ereignissen
// heal(t) – gleicher Seed, gleiche Spucken, gleiche Aufpralle.
//   anmarsch  vom Startpunkt zur Spuckstelle (Route, Tempo), Blick in Laufrichtung
//   spucken   3 Spucken nach spuck.v3 (Ansage 0,34 s am Maul, Flug 0,42–0,95 s nach Distanz, Aufprall = Fleck wächst 0,4 → 0,7 → 1,0)
//             1. Aufprall: Baum wird tainted (Fluff dunkel), 2. Aufprall: Baum wirft ab (native Physik), danach endlich: keine weiteren Spucken
//   lauern    pendelt an der Spuckstelle (Walk/Idle), bleibt Ziel
//   geheilt   heal(t) (Treffer mit der Heil-Waffe): hört sofort auf zu spucken, freut sich (Yes, Dance, Kit-Clips), lässt EINMAL bunten Fluff fallen,
//             Fleck verblasst in fadeS, Baum-Tainted aus; danach friedlich (kein Spucken, kein zweiter Fluff)
//   ablauf    ohne Heilung verblasst der Fleck expireS nach dem letzten Aufprall, der Fluffer geht zurück und verschwindet
// Ereignisse (für Darstellung und Welt): { t, type: 'windup'|'spit'|'impact'|'taint'|'drop'|'healed'|'burst'|'fade'|'gone', ... } – idempotent über seq.
import { rngOf } from '../world/fluff.js'
import { createRoute } from './npcRoute.js'

export const FLUFFER = Object.freeze({ speed: 0.9, windup: 0.34, flight: [0.42, 0.95], range: 8, spits: 3, firstAfter: 1.2, every: 3.2, amounts: [0.4, 0.7, 1.0],
  patchR: 1.4, impactJitter: 0.35, fadeS: 4, expireS: 180, loiter: 1.6, loiterSpeed: 0.45, burstN: 6, joyS: 2.6 })

// def: { id, seed, start: [x, z], stand: [x, z], via?: [[x, z]…], target: [x, z] (Fleck-Mitte), tree: { zone, id }, t0 (Weltsekunden) }
export function createFlufferSim(def, R = FLUFFER) {
  const route = createRoute({ id: def.id + ':in', from: 'start', to: 'stand', points: [def.start, ...(def.via || []), def.stand] })
  const back = createRoute({ id: def.id + ':out', from: 'stand', to: 'start', points: [def.stand, ...(def.via || []).slice().reverse(), def.start] })
  const arrive = def.t0 + route.length / R.speed
  const rng = rngOf('fluffer', def.id, def.seed)
  // Spuckplan: Zeiten und Aufprallpunkte (leicht gestreut um die Fleck-Mitte), Flugdauer nach Distanz
  const dist = Math.hypot(def.target[0] - def.stand[0], def.target[1] - def.stand[1])
  const fl = R.flight[0] + (R.flight[1] - R.flight[0]) * Math.min(1, dist / R.range)
  const spits = Array.from({ length: R.spits }, (_, k) => { const a = rng() * Math.PI * 2, r = rng() * R.impactJitter, tw = arrive + R.firstAfter + k * R.every
    return { k, windup: tw, release: tw + R.windup, impact: tw + R.windup + fl, at: [def.target[0] + Math.cos(a) * r, def.target[1] + Math.sin(a) * r], amount: R.amounts[k] } })
  const lastImpact = spits.at(-1).impact
  const S = { healedAt: null }
  const faceTarget = Math.atan2(def.target[0] - def.stand[0], def.target[1] - def.stand[1])

  // Zustand zur Zeit t (rein aus t und healedAt)
  function at(t) {
    const H = S.healedAt
    const live = (s) => H === null || s.release < H // nach der Heilung kein Abgang mehr; schon fliegende Spucke landet noch
    const done = spits.filter((s) => live(s) && s.impact <= t)
    let amount = done.length ? done.at(-1).amount : 0
    let fade = 0
    if (H !== null && t >= H) fade = Math.min(1, (t - H) / R.fadeS)
    else if (H === null && t >= lastImpact + R.expireS) fade = Math.min(1, (t - lastImpact - R.expireS) / R.fadeS)
    amount *= 1 - fade
    const expired = H === null && t >= lastImpact + R.expireS
    // Lage und Phase
    let phase, x, z, yaw, speed = 0, clip = 'Idle'
    if (t < def.t0) { phase = 'wait'; ({ x, z } = route.at(0)); yaw = route.at(0).yaw }
    else if (t < arrive && !(H !== null && H <= t)) { phase = 'anmarsch'; const p = route.at((t - def.t0) * R.speed); x = p.x; z = p.z; yaw = p.yaw; speed = R.speed; clip = 'Walk' }
    else if (H !== null && t >= H) {
      const p0 = t < arrive ? route.at(Math.min(route.length, (H - def.t0) * R.speed)) : route.at(route.length)
      phase = 'geheilt'; x = p0.x; z = p0.z; yaw = t < H + R.joyS ? faceTarget : faceTarget + Math.PI * 0.5 * Math.sin((t - H - R.joyS) * 0.4)
      clip = t < H + R.joyS * 0.5 ? 'Yes' : t < H + R.joyS ? 'Dance' : 'Idle'
    } else if (expired) {
      const s = (t - lastImpact - R.expireS) * R.speed; if (s >= back.length) { phase = 'gone'; ({ x, z } = back.at(back.length)); yaw = 0 }
      else { phase = 'abzug'; const p = back.at(s); x = p.x; z = p.z; yaw = p.yaw; speed = R.speed; clip = 'Walk' }
    } else {
      const sp = spits.find((s) => live(s) && t >= s.windup && t < s.release)
      const stand = route.at(route.length)
      if (sp) { phase = 'spucken'; x = stand.x; z = stand.z; yaw = faceTarget; clip = 'Bite_Front' }
      else if (t < lastImpact) { phase = 'spucken'; x = stand.x; z = stand.z; yaw = faceTarget; clip = 'Idle' }
      else { // lauern: pendelt quer zur Blickrichtung um die Spuckstelle
        const u = (t - lastImpact) * R.loiterSpeed / R.loiter, w = Math.sin(u * Math.PI), off = w * R.loiter * 0.5, cw = Math.cos(u * Math.PI)
        phase = 'lauern'; x = stand.x + Math.cos(faceTarget) * off; z = stand.z - Math.sin(faceTarget) * off
        speed = Math.abs(cw) * R.loiterSpeed * Math.PI * 0.5; clip = speed > 0.15 ? 'Walk' : 'Idle'; yaw = speed > 0.15 ? faceTarget + (cw > 0 ? Math.PI / 2 : -Math.PI / 2) : faceTarget }
    }
    const flying = spits.filter((s) => live(s) && t >= s.release && t < s.impact).map((s) => ({ k: s.k, u: (t - s.release) / (s.impact - s.release), from: s.release, to: s.at }))
    const gathering = spits.find((s) => live(s) && t >= s.windup && t < s.release) || null
    return { phase, x, z, yaw, speed, clip, patch: amount > 0 ? { x: def.target[0], z: def.target[1], r: R.patchR, amount, seed: def.seed } : null,
      tainted: done.length >= 1 && fade < 1, dropped: done.length >= 2, healed: H !== null && t >= H, spitsDone: done.length, flying, gathering: gathering ? { k: gathering.k, u: (t - gathering.windup) / R.windup } : null,
      hostile: phase === 'anmarsch' || phase === 'spucken' || phase === 'lauern', target: phase !== 'gone' && !(H !== null && t >= H) && t >= def.t0 }
  }

  // Ereignisse im Intervall (t0, t1] – für die Darstellung (Tropfen, Fleck, Baum, Fluff), jedes genau einmal (seq)
  const fired = new Set()
  function events(t0, t1) {
    const out = [], H = S.healedAt, push = (key, ev) => { if (!fired.has(key) && ev.t > t0 - 1e-9 && ev.t <= t1 + 1e-9) { fired.add(key); out.push(ev) } }
    for (const s of spits) { if (H !== null && s.release >= H) continue
      push('w' + s.k, { t: s.windup, type: 'windup', k: s.k }); push('s' + s.k, { t: s.release, type: 'spit', k: s.k, to: s.at, flight: s.impact - s.release })
      push('i' + s.k, { t: s.impact, type: 'impact', k: s.k, at: s.at, amount: s.amount })
      if (s.k === 0) push('taint', { t: s.impact, type: 'taint', tree: def.tree })
      if (s.k === 1) push('drop', { t: s.impact, type: 'drop', tree: def.tree }) }
    if (H !== null) { push('healed', { t: H, type: 'healed' }); push('burst', { t: H + 0.35, type: 'burst', n: R.burstN, tag: `heal:${def.id}`, seed: def.seed }); push('fade', { t: H + R.fadeS, type: 'fade', tree: def.tree }) }
    else { push('fade', { t: lastImpact + R.expireS + R.fadeS, type: 'fade', tree: def.tree }); push('gone', { t: lastImpact + R.expireS + back.length / R.speed, type: 'gone' }) }
    return out.sort((a, b) => a.t - b.t)
  }

  return {
    def, route, arrive, spits, lastImpact, at, events,
    // Treffer mit der Heil-Waffe; nur einmal und nur, solange er ein Ziel ist. Rückgabe true, wenn jetzt geheilt
    heal(t) { if (S.healedAt !== null || !at(t).target) return false; S.healedAt = t; return true },
    healedAt: () => S.healedAt,
  }
}
