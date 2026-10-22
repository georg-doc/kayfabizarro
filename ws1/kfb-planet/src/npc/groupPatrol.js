// WS-NPC Phase D (Georg 21.10. Go; SPEC_NPC_PATROL_R1, V-464, R0.6 §3/§4) · Gruppen-Patrouille, rein, ohne three, ohne DOM, Node-geprüft
// (test/unit/groupPatrol.mjs, test/unit/groupAggro.mjs).
// Fahrplan statt Simulation: der Anführer folgt einer geschlossenen Route mit Halten; seine zurückgelegte Strecke D(t) ist eine reine Funktion der Zeit
// (Startzeit, Tempo, Halte). Die anderen gehen in Formation: gleiche Route, je Platz ein Abstand nach hinten (back) und zur Seite (side), dazu eine
// kleine Ziehharmonika je Meter Weg und optional Stolpern (Dalton-Gag ohne Skalieren).
// Verhalten:
//   patrol → notice (Spieler ≤ notice.r) → alert (halten, hinschauen, Anführer droht) → weiter, aufholen ≤ catchK × Tempo
//   Treffer (sense.hits, z. B. Schuss B über orchard.addTarget; kein Schaden, kein Kampfsystem), je Begegnungsfenster:
//     1. Warnung (Hit_A, Anführer droht) + 1 Fluff · 2. Drohung (Hit_B, lange Drohung) + 3 Fluff · 3. Aggro: verlässt die Route, folgt dem Spieler an
//     der Leine (leashR um den Austrittspunkt), droht aus der Nähe · jeder weitere Treffer: Cartoon-KO dieses Mitglieds (Skeletons_Death, liegt koS s,
//     steht an Ort und Stelle wieder auf, geht zurück in die Formation; gleiche ID) + 1 Fluff einmal je Mitglied und Fenster
//     Ende der Aggro (Leine, Spieler weit weg, giveUpS ohne Treffer) → zurück zum Austrittspunkt → Route, aufholen. Fenster endet nach disengageS ohne Treffer.
//   Außerhalb der Spielerblase steht die Gruppe exakt auf dem Plan (Respawn außer Sicht, kein Pop-in); die Begegnung ist dann vorbei.
// Ereignisse (drainEvents): { type: 'fluff', n, at: [x, z], tag } (endlich, eindeutiger tag; mit sense.day je Gruppe und Welttag) · { type: 'hit' | 'ko' | 'awake' | 'aggro' | 'calm', id, n?, at?: [x, z], t }
import { createRoute } from './npcRoute.js'

export const GROUP = Object.freeze({ catchK: 1.25, lockK: 2.2, turnRate: 4.0, accordion: { amp: 0.18, perM: 0.12 }, memberMax: 1.7,
  // awakeS = Länge Skeletons_Awaken_Floor (2,3 s, Kit-Clip as-is): erst danach geht er los
  hit: { holdS: [2.5, 3.0], disengageS: 40, fluff: [1, 3], koFluff: 1, koS: 10, awakeS: 2.3 }, aggro: { speed: 1.6, stopAt: 2.4, leashR: 16, giveUpS: 18, loseAt: 25, tauntEvery: 3.5 } })
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))
const turn = (from, to, max) => { const d = wrap(to - from); return Math.abs(d) <= max ? to : wrap(from + Math.sign(d) * max) }

// def kfb.npc-group/1: { id, route: { points (Schleife, letzter = erster optional), stops: [{ i (Punkt-Index), wait }], cornerR }, speed, t0,
//   members: [{ id, castId, back, side, stumble? }], notice: { r, holdS, cooldownS, leaderClip, othersClip }, combat?: { hitClips, warnClip, threatClip, koClip, awakeClip } }
export function createGroupPatrol(def, R = GROUP) {
  // geschlossene Schleife, Beginn in der Mitte der ersten Strecke: so liegt jede Ecke (auch die am Schleifenschluss) innen und wird abgerundet
  const raw = def.route.points, pts = Math.hypot(raw[0][0] - raw.at(-1)[0], raw[0][1] - raw.at(-1)[1]) < 1e-6 ? raw.slice(0, -1) : raw
  const mid = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], closed = [mid, ...pts.slice(1), pts[0], mid]
  const route = createRoute({ id: def.id + ':loop', from: 'a', to: 'a', points: closed }, { cornerR: def.route.cornerR ?? 1.6 })
  const L = route.length
  const near = (p) => { let best = 0, bd = Infinity; for (let s = 0; s <= L; s += 0.05) { const q = route.at(s), d = Math.hypot(q.x - p[0], q.z - p[1]); if (d < bd) { bd = d; best = s } } return best }
  const stops = (def.route.stops || []).map((st) => ({ s: near(pts[st.i]), wait: st.wait })).sort((a, b) => a.s - b.s)
  const lapT = L / def.speed + stops.reduce((a, x) => a + x.wait, 0)
  function distAt(t) {
    if (t <= def.t0) return 0
    const tt = t - def.t0, lap = Math.floor(tt / lapT); let r = tt - lap * lapT, s = 0
    for (const st of stops) { const run = (st.s - s) / def.speed; if (r <= run) return lap * L + s + r * def.speed; r -= run; s = st.s; if (r <= st.wait) return lap * L + s; r -= st.wait }
    return lap * L + Math.min(L, s + r * def.speed)
  }
  const waitingAt = (t) => { const a = distAt(t), b = distAt(t - 1 / 120); return a - b < 1e-9 && t > def.t0 }
  const posAt = (D) => route.at(((D % L) + L) % L)
  // Stolpern (Dalton-Gag, z. B. Nr. 6): alle everyM Meter bleibt er kurz zurück (in 10 % der Strecke um lag m) und holt über 40 % wieder auf –
  // aus dem Weg D abgeleitet, also deterministisch und im Halt ohne Bewegung; beim Beginn ein Stolper-Clip (Kit-Clip as-is)
  const ss = (u) => u * u * (3 - 2 * u)
  function stumbleBack(m, D) { const st = m.stumble; if (!st) return 0; const u = (((D - (m.back || 0)) % st.everyM) + st.everyM) % st.everyM / st.everyM
    return st.lag * (u < 0.1 ? ss(u / 0.1) : u < 0.5 ? 1 - ss((u - 0.1) / 0.4) : 0) }
  const stumbleIdx = (m, D) => (m.stumble ? Math.floor((D - (m.back || 0)) / m.stumble.everyM) : 0)
  function memberPlan(D, m, k) {
    const acc = R.accordion.amp * Math.sin(D * R.accordion.perM * Math.PI * 2 + k * 1.7) * (k ? 1 : 0)
    const s = D - (m.back || 0) - acc - stumbleBack(m, D), p = posAt(s), a = posAt(s - 0.5), b = posAt(s + 0.5), yaw = Math.atan2(b.x - a.x, b.z - a.z) // gleitende Tangente
    const nx = Math.cos(yaw), nz = -Math.sin(yaw) // side > 0 = links von der Laufrichtung (Blick +Z → +X)
    return { x: p.x + nx * (m.side || 0), z: p.z + nz * (m.side || 0), yaw }
  }
  // Formation um einen frei laufenden Anführer (Aggro/Rückweg): back/side relativ zu seiner Blickrichtung, ohne Ziehharmonika
  const formAround = (lx, lz, yaw, m) => ({ x: lx - Math.sin(yaw) * (m.back || 0) + Math.cos(yaw) * (m.side || 0), z: lz - Math.cos(yaw) * (m.back || 0) - Math.sin(yaw) * (m.side || 0), yaw })
  const lockTol = (dt) => Math.max(R.memberMax, def.speed * R.catchK * R.lockK) * dt // eingerastet: folgt dem Ziel exakt bis zu diesem Schritt (äußerer Folger in Kurven beim Aufholen)
  const N = def.notice || { r: 8, holdS: 4, cooldownS: 20 }
  const CB = { hitClips: ['Hit_A', 'Hit_B'], warnClip: ['Skeletons_Taunt', 'Idle_B'], threatClip: ['Skeletons_Taunt_Longer', 'Skeletons_Taunt', 'Idle_B'], koClip: ['Skeletons_Death', 'Death_A'], awakeClip: ['Skeletons_Awaken_Floor', 'Idle_B'], ...(def.combat || {}) }
  const L0 = { D: null, mode: 'patrol', until: -1, cool: -1, hit: { n: 0, last: -Infinity, win: 0, ko: new Set() }, free: null, anchor: null, lastTaunt: -Infinity, events: [],
    stats: { alerts: 0, maxSpeedK: 0, snaps: 0, hits: 0, kos: 0, aggro: 0, fluff: 0, maxLeash: 0 } }
  const M = def.members.map(() => ({ x: 0, z: 0, yaw: null, locked: true, ko: null, ok: false, holdUntil: -Infinity }))
  const outs = def.members.map((m) => ({ id: m.id, x: 0, z: 0, yaw: 0, speed: 0, clip: null, gaze: null, mode: 'patrol', ko: false }))
  const emit = (e) => { L0.events.push(e); if (L0.events.length > 100) L0.events.shift() }

  function onHit(k, t, day) {
    const H = L0.hit, mem = M[k]
    if (mem.ko) return
    if (t - H.last > R.hit.disengageS) { H.n = 0; H.win++; H.ko = new Set() }
    H.n++; H.last = t; L0.stats.hits++
    const at = [mem.x, mem.z], tag = (s) => `hit:${def.id}:${day != null ? 'd' + day : 'w' + H.win}:${s}` // mit Welttag: je Gruppe und Tag endlich (gleicher tag = kein neues Fluff)
    emit({ type: 'hit', id: def.members[k].id, n: H.n, at, t })
    if (H.n <= 2) {
      L0.mode = 'hit'; L0.until = t + R.hit.holdS[H.n - 1]
      outs[k].clip = { name: [CB.hitClips[H.n - 1] || 'Hit_A'], mode: 'once' }; if (k !== 0) outs[0].clip = { name: H.n === 1 ? CB.warnClip : CB.threatClip, mode: 'once' }
      const n = R.hit.fluff[H.n - 1]; emit({ type: 'fluff', n, at, tag: tag(H.n), t }); L0.stats.fluff += n
    } else if (L0.mode !== 'aggro') { // Aggro beginnt (oder nach einer Pause wieder): Austrittspunkt merken
      L0.mode = 'aggro'; L0.stats.aggro++; L0.lastTaunt = t
      if (!L0.free) { L0.free = { x: M[0].x, z: M[0].z, yaw: M[0].yaw ?? 0 }; L0.anchor = { D: L0.D, x: M[0].x, z: M[0].z } }
      outs[k].clip = { name: [CB.hitClips[1] || 'Hit_B'], mode: 'once' }; if (k !== 0) outs[0].clip = { name: CB.threatClip, mode: 'once' }; emit({ type: 'aggro', id: def.id, at: [M[0].x, M[0].z], t })
    } else { // Cartoon-KO dieses Mitglieds
      mem.ko = { until: t + R.hit.koS, awakeAt: null }; mem.locked = false; L0.stats.kos++; outs[k].clip = { name: CB.koClip, mode: 'clamp' }; emit({ type: 'ko', id: def.members[k].id, at, t })
      if (!H.ko.has(k)) { H.ko.add(k); emit({ type: 'fluff', n: R.hit.koFluff, at, tag: tag('ko:' + def.members[k].id), t }); L0.stats.fluff += R.hit.koFluff }
    }
  }

  // ein Schritt: sense = { player: { x, y?, z } | null, near: bool, hits?: [Mitglieds-ID], day?: Welttag (Fluff-Tags je Tag statt je Fenster) }
  function step(t, dt, sense = {}) {
    const P = distAt(t), pl = sense.player
    for (const o of outs) o.clip = null
    if (L0.D === null || !sense.near) { // außerhalb der Blase: exakt der Plan, Begegnung vorbei (Respawn außer Sicht)
      if (L0.D !== null && Math.abs(L0.D - P) > 1e-9) L0.stats.snaps++
      L0.D = P; L0.mode = 'patrol'; L0.free = null; L0.anchor = null; L0.hit.n = 0
      def.members.forEach((m, k) => { const q = memberPlan(P, m, k); Object.assign(M[k], { x: q.x, z: q.z, yaw: q.yaw, locked: true, ko: null }) })
    } else {
      for (const id of sense.hits || []) { const k = def.members.findIndex((m) => m.id === id); if (k >= 0) onHit(k, t, sense.day) }
      const alive = M.map((m) => !m.ko), dP = pl ? Math.min(...M.map((m, k) => (alive[k] ? Math.hypot(m.x - pl.x, m.z - pl.z) : Infinity))) : Infinity
      if ((L0.mode === 'alert' || L0.mode === 'hit') && t >= L0.until) L0.mode = 'patrol'
      if (L0.mode === 'patrol' && dP <= N.r && t >= L0.cool) { L0.mode = 'alert'; L0.until = t + N.holdS; L0.cool = t + N.holdS + N.cooldownS; L0.stats.alerts++
        outs.forEach((o, k) => { if (alive[k]) o.clip = { name: k === 0 ? [].concat(N.leaderClip || 'Idle_B') : [].concat(N.othersClip || 'Idle_B'), mode: 'once' } }) }
      if (L0.mode === 'aggro') { // verfolgen an der Leine
        const f = L0.free, A = R.aggro, dl = pl ? Math.hypot(pl.x - f.x, pl.z - f.z) : Infinity, leash = Math.hypot(f.x - L0.anchor.x, f.z - L0.anchor.z)
        L0.stats.maxLeash = Math.max(L0.stats.maxLeash, leash)
        if (!pl || dl > A.loseAt || leash > A.leashR || t - L0.hit.last > A.giveUpS || alive.every((a) => !a)) { L0.mode = 'return'; emit({ type: 'calm', id: def.id, t }) }
        else { f.yaw = turn(f.yaw, Math.atan2(pl.x - f.x, pl.z - f.z), R.turnRate * dt)
          if (dl > A.stopAt && alive[0]) { const s = Math.min(A.speed * dt, dl - A.stopAt); f.x += Math.sin(f.yaw) * s; f.z += Math.cos(f.yaw) * s }
          if (t - L0.lastTaunt > A.tauntEvery && dl <= A.stopAt + 0.6 && alive[0]) { L0.lastTaunt = t; outs[0].clip = { name: CB.warnClip, mode: 'once' } } }
      }
      if (L0.mode === 'return') { // zurück zum Austrittspunkt, dann wieder auf die Route
        const f = L0.free, d = Math.hypot(L0.anchor.x - f.x, L0.anchor.z - f.z)
        if (d < 0.05) { L0.mode = 'patrol'; L0.D = L0.anchor.D; L0.free = null; L0.anchor = null }
        else { f.yaw = turn(f.yaw, Math.atan2(L0.anchor.x - f.x, L0.anchor.z - f.z), R.turnRate * dt); const s = Math.min(def.speed * 1.1 * dt, d); f.x += Math.sin(f.yaw) * s; f.z += Math.cos(f.yaw) * s }
      }
      if (L0.mode === 'patrol' && L0.D < P) { const ds = Math.min(P - L0.D, def.speed * R.catchK * dt); L0.D += ds; L0.stats.maxSpeedK = Math.max(L0.stats.maxSpeedK, ds / dt / def.speed) }
    }
    const free = L0.free && (L0.mode === 'aggro' || L0.mode === 'return')
    def.members.forEach((m, k) => {
      const mem = M[k], o = outs[k], q = free ? (k === 0 ? { x: L0.free.x, z: L0.free.z, yaw: L0.free.yaw } : formAround(L0.free.x, L0.free.z, L0.free.yaw, m)) : memberPlan(L0.D, m, k)
      const px = mem.x, pz = mem.z
      if (sense.near && mem.ok && t < mem.holdUntil) { /* abgesetzt (E3 Geschenk): steht still, bis er gelandet ist, dann geht er in die Formation */ }
      else if (sense.near && mem.ok && mem.ko) { // liegt, dann steht er an Ort und Stelle auf
        if (mem.ko.awakeAt === null && t >= mem.ko.until) { mem.ko.awakeAt = t + R.hit.awakeS; o.clip = { name: CB.awakeClip, mode: 'once' }; emit({ type: 'awake', id: m.id, at: [mem.x, mem.z], t }) }
        if (mem.ko.awakeAt !== null && t >= mem.ko.awakeAt) mem.ko = null
      } else if (sense.near && mem.ok) {
        const d = Math.hypot(q.x - mem.x, q.z - mem.z), vmax = R.memberMax * dt
        if (mem.locked && d <= lockTol(dt)) { mem.x = q.x; mem.z = q.z } // folgt dem Plan bzw. dem Anführer exakt
        else if (d <= vmax) { mem.locked = true; mem.x = q.x; mem.z = q.z } // angekommen, ohne Ruck
        else { mem.locked = false; mem.x += (q.x - mem.x) / d * vmax; mem.z += (q.z - mem.z) / d * vmax } // geht hin (nach KO, beim Formationswechsel)
        if (m.stumble && L0.mode === 'patrol' && mem.locked) { const i = stumbleIdx(m, L0.D); if (o._si !== undefined && i > o._si && !o.clip) o.clip = { name: m.stumble.clip || ['Hit_B', 'Hit_A'], mode: 'once' }; o._si = i } else if (m.stumble) o._si = stumbleIdx(m, L0.D)
      }
      const looking = !!pl && ['alert', 'hit', 'aggro'].includes(L0.mode) && !mem.ko
      let want = mem.locked ? q.yaw : (Math.hypot(q.x - mem.x, q.z - mem.z) > 0.05 ? Math.atan2(q.x - mem.x, q.z - mem.z) : q.yaw)
      if (looking) want = Math.atan2(pl.x - mem.x, pl.z - mem.z)
      if (mem.ko) want = mem.yaw ?? want
      mem.yaw = mem.yaw === null || !sense.near ? want : turn(mem.yaw, want, R.turnRate * dt)
      const sp = mem.ok && sense.near ? Math.hypot(mem.x - px, mem.z - pz) / Math.max(dt, 1e-9) : (L0.mode === 'alert' || waitingAt(t) ? 0 : def.speed)
      mem.ok = true
      Object.assign(o, { x: mem.x, z: mem.z, yaw: mem.yaw, speed: Math.min(sp, Math.max(R.memberMax, def.speed * R.catchK) * 1.3), gaze: looking ? { x: pl.x, z: pl.z, y: pl.y ?? null } : null, mode: L0.mode, ko: !!mem.ko, _ok: true })
    })
    return outs
  }
  // E3 (Lead 22.10.): Mitglieder an festen Punkten absetzen (z. B. auf dem Geschenkpapier); jedes wartet bis holdUntil und geht dann mit memberMax
  // in seine Formation. Nur in der Blase wirksam (außerhalb steht die Gruppe wie immer auf dem Plan).
  function place(list) { list.forEach((p, k) => { if (!p || !M[k]) return; Object.assign(M[k], { x: p.x, z: p.z, yaw: p.yaw ?? M[k].yaw, locked: false, ok: true, ko: null, holdUntil: p.until ?? -Infinity }) }) }
  return { def, route, length: L, lapT, distAt, step, outs, stops, place,
    plan: (t) => def.members.map((m, k) => memberPlan(distAt(t), m, k)),
    state: () => ({ mode: L0.mode, D: L0.D, hit: { n: L0.hit.n, win: L0.hit.win }, free: L0.free && { ...L0.free }, anchor: L0.anchor && { ...L0.anchor }, ko: M.map((m) => !!m.ko), stats: { ...L0.stats } }),
    lagAt: (t) => distAt(t) - (L0.D ?? 0),
    drainEvents: () => L0.events.splice(0) }
}
