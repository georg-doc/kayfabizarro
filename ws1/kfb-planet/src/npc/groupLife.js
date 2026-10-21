// WS-NPC Phase D (Georg 21.10. Go; SPEC_NPC_PATROL_R1) · Gruppen im Spiel: EIN Modul nach Host-Vertrag R1.2 für alle Gruppen (heute die Skelett-Patrouille).
// Logik = groupPatrol (rein, Node-geprüft); Figuren über npcFigure (Darsteller-Slot mit KFB-Augen, Gang-Mischer, Kit-Clips as-is, Blick).
// Blase wie bei den Bewohnern: nah = ein Mitglied im Radius um den Spieler ODER im Bild (bis visibleFar) – im Bild springt nie etwas auf den Plan.
// Begegnungstabelle (SPEC §3, kfb.encounter-table/1): beim Betreten der Zone (Kreis) wird gewürfelt (Gewicht, Seed, Abklingzeit), welche Gruppe unterwegs
// ist. Gruppen aus einer Tabelle sind nur aktiv, wenn gewürfelt; sichtbar bzw. unsichtbar wird eine Gruppe nur, solange keines ihrer Mitglieder im Bild
// ist (kein Pop-in, kein Verschwinden vor der Kamera). Der Plan läuft immer weiter (Fahrplan statt Simulation).
// Phase D3 (R0.6 §3/§4): jedes sichtbare, stehende Mitglied in der Blase ist ein Ziel für den Schuss (orchard.addTarget, kein Schaden, kein Kampfsystem);
// Treffer gehen als sense.hits in groupPatrol (Warnung → Drohung → Aggro → Cartoon-KO). Fluff-Ereignisse → orchard.burst (Tag je Gruppe und Welttag,
// gleicher Tag zweimal = kein neues Fluff); übrige Ereignisse (hit, aggro, ko, awake, calm) → options.onEvent (Gedächtnis, Zeugen).
// options: { groups: residents.r1.json groups, tables?: encounterTables, bubbleR, groundAt(x, z), clipUrls, cast(castId), worldScale, clock(), player(), camera()?,
//   orchard?(), day?(), onEvent?(e), staticUrl?(key) → URL | null (Kulisse je Gruppe, def.statics; fehlt die Datei, bleibt die Stelle leer), classScale? }
// cast(castId, member) darf für fehlende private Figuren auf member.placeholderCastId ausweichen (sichtbarer Platzhalter).
import * as THREE from 'three'
import { createNpcFigure, loadClipSet } from './npcFigure.js'
import { createGroupPatrol } from './groupPatrol.js'
import { rngOf, seedOf } from '../world/fluff.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const GROUP_LIFE = Object.freeze({ visibleFar: 140, targetR: 0.6, targetY: 0.9, burstY: 1.0 })
export const groupLifeLog = { create: 0, update: 0, dispose: 0 }

export function createGroupLife(options) {
  groupLifeLog.create++
  const K = options.worldScale ?? 1, root = new THREE.Group(); root.name = 'group-life'
  const S = { status: 'LOADING', error: null, near: {}, played: [], t: 0, ms: null, events: [], offs: [], targetsOn: false, statics: [] }
  const frustum = new THREE.Frustum(), _pv = new THREE.Matrix4(), _sphere = new THREE.Sphere(new THREE.Vector3(), 1.2)
  const G = (options.groups || []).map((def) => {
    const sim = createGroupPatrol(def)
    const figs = def.members.map((m) => { const f = createNpcFigure({ cast: options.cast(m.castId, m), id: m.id, worldScale: K, groundAt: options.groundAt, onPlay: (id, c) => { S.played.push([id, c]); if (S.played.length > 60) S.played.shift() } }); root.add(f.holder); return f })
    return { def, sim, figs, active: true, shown: true, hits: [] }
  })
  const T = (options.tables || []).map((tb) => ({ tb, inside: false, rolls: 0, coolUntil: -Infinity, chosen: null, log: [] }))
  for (const x of T) for (const e of x.tb.entries) { const g = G.find((g) => g.def.id === e.group); if (g) { g.active = false; g.shown = false; g.table = x.tb.id } }
  function roll(x, t) { const tot = x.tb.entries.reduce((a, e) => a + e.weight, 0), r = rngOf('encounter', x.tb.id, x.tb.seed, x.rolls)() * tot; let acc = 0, pick = null
    for (const e of x.tb.entries) { acc += e.weight; if (r < acc) { pick = e.group; break } }
    x.rolls++; x.chosen = pick; x.coolUntil = t + x.tb.cooldownS; x.log.push({ t: +t.toFixed(2), group: pick }); if (x.log.length > 30) x.log.shift()
    for (const e of x.tb.entries) { const g = G.find((g) => g.def.id === e.group); if (g) g.active = e.group === pick } }
  // Kulisse (z. B. Ladestation, Block-Stapel der Bots): statisch, auf dem Boden, Maßstab wie die Figuren (Klassen-Faktor × Weltmaßstab)
  async function loadStatics() { const loader = new GLTFLoader(), s = (options.classScale ?? 1) * K
    for (const g of G) for (const st of g.def.statics || []) { const url = options.staticUrl?.(st.key); if (!url) { S.statics.push({ group: g.def.id, key: st.key, status: 'MISSING' }); continue }
      const o = (await loader.loadAsync(url)).scene; o.scale.setScalar(s * (st.s || 1)); o.position.set(st.at[0], options.groundAt(st.at[0], st.at[1]), st.at[1]); o.rotation.y = ((st.yawDeg || 0) * Math.PI) / 180
      o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } }); o.name = 'static:' + st.key; root.add(o); S.statics.push({ group: g.def.id, key: st.key, status: 'OK' }) } }
  const ready = (async () => {
    await loadStatics().catch((e) => S.statics.push({ status: 'ERROR', error: String(e?.message || e) }))
    const clips = await loadClipSet(options.clipUrls || [])
    await Promise.all(G.flatMap((g) => g.figs.map((f) => f.load(clips))))
    const bad = G.flatMap((g) => g.figs.map((f) => f.status())).filter((s) => s.status !== 'OK')
    S.status = bad.length ? 'ERROR' : 'OK'; S.error = bad.map((s) => s.error).join('; ') || null
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  // Ziele erst, wenn die Figuren stehen und der Obstgarten da ist (Schuss B); pos null = nicht treffbar (unsichtbar, außerhalb der Blase, liegt);
  // Gruppen mit hittable: false bekommen keine Ziele (Trupp: kein Aufsteh-Clip im Kit)
  function registerTargets() {
    if (S.targetsOn || S.status !== 'OK') return
    const O = options.orchard?.(); if (!O?.addTarget) return
    for (const g of G) if (g.def.hittable !== false) g.def.members.forEach((m, k) => S.offs.push(O.addTarget({ id: 'group:' + m.id, r: GROUP_LIFE.targetR * K,
      pos: () => { const o = g.sim.outs[k]; return g.shown && S.near[g.def.id] && o._ok && !o.ko ? [o.x, options.groundAt(o.x, o.z) + GROUP_LIFE.targetY * K, o.z] : null },
      onHit: () => g.hits.push(m.id) })))
    S.targetsOn = true
  }
  function world(g, e) {
    if (e.type === 'fluff') { const O = options.orchard?.(); O?.burst?.([e.at[0], options.groundAt(e.at[0], e.at[1]) + GROUP_LIFE.burstY * K, e.at[1]], e.n, seedOf(e.tag), e.tag) }
    const ev = { ...e, group: g.def.id }; S.events.push(ev); if (S.events.length > 60) S.events.shift()
    if (e.type !== 'fluff') options.onEvent?.(ev)
  }

  return {
    object3d: root, ready,
    update(dt, hctx) {
      groupLifeLog.update++
      const tm0 = typeof performance !== 'undefined' ? performance.now() : 0
      const t = options.clock ? options.clock() : (S.t += dt); S.t = t
      registerTargets()
      const day = options.day?.() ?? null, pl = options.player?.() || null, cam = options.camera?.() || hctx?.camera || null
      if (cam) { cam.updateMatrixWorld(); _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frustum.setFromProjectionMatrix(_pv) }
      for (const x of T) { const c = x.tb.zone.center, inside = !!pl && Math.hypot(pl.x - c[0], pl.z - c[1]) <= x.tb.zone.r
        if (inside && !x.inside && t >= x.coolUntil) roll(x, t)
        if (!inside && x.inside) for (const e of x.tb.entries) { const g = G.find((g) => g.def.id === e.group); if (g) g.active = false }
        x.inside = inside }
      const inView = (o) => { if (!cam) return false; const d = pl ? Math.hypot(o.x - pl.x, o.z - pl.z) : 0; if (d > GROUP_LIFE.visibleFar) return false; _sphere.center.set(o.x, options.groundAt(o.x, o.z) + 0.9 * K, o.z); return frustum.intersectsSphere(_sphere) }
      for (const g of G) {
        if (g.shown !== g.active && g.sim.outs.every((o) => !o._ok || !inView(o))) { g.shown = g.active; g.swaps = (g.swaps || 0) + 1 } // nur außerhalb des Bildes umschalten
        const near = !!pl && g.sim.outs.some((o) => { const d = Math.hypot(o.x - pl.x, o.z - pl.z); if (d < (options.bubbleR ?? 60)) return true
          if (!cam || d > GROUP_LIFE.visibleFar) return false; _sphere.center.set(o.x, options.groundAt(o.x, o.z) + 0.9 * K, o.z); return frustum.intersectsSphere(_sphere) })
        S.near[g.def.id] = near && g.shown
        const outs = g.sim.step(t, dt, { player: g.shown ? pl : null, near: near && g.shown, hits: g.hits.splice(0), day })
        for (const e of g.sim.drainEvents()) world(g, e)
        g.figs.forEach((f, k) => { f.present(outs[k], dt); f.update(dt, hctx, g.shown) })
      }
      if (tm0) { const ms = performance.now() - tm0; S.ms = S.ms == null ? ms : S.ms * 0.95 + ms * 0.05 }
    },
    status: () => ({ status: S.status, error: S.error, ms: S.ms, statics: S.statics.slice(), groups: G.map((g) => ({ id: g.def.id, members: g.figs.map((f) => f.status()) })) }),
    tables: () => T.map((x) => ({ id: x.tb.id, inside: x.inside, rolls: x.rolls, chosen: x.chosen, log: x.log.slice() })),
    debug: () => G.map((g) => ({ id: g.def.id, near: S.near[g.def.id], active: g.active, shown: g.shown, swaps: g.swaps || 0, state: g.sim.state(), lag: g.sim.lagAt(S.t), plan: g.sim.plan(S.t), members: g.sim.outs.map((o, k) => ({ id: o.id, x: o.x, z: o.z, yaw: o.yaw, speed: o.speed, mode: o.mode, ko: o.ko, gait: g.figs[k].anim()?.last ?? null, overlay: +(g.figs[k].anim()?.overlays.reduce((w, o) => w + o.w, 0) ?? 0).toFixed(3) })) })),
    positions: () => G.flatMap((g) => g.sim.outs.map((o) => ({ id: o.id, x: o.x, z: o.z, y: g.shown ? options.groundAt(o.x, o.z) : -1000 }))), // unsichtbar: Kapsel weit unter die Welt
    soles: () => G.flatMap((g) => g.figs.map((f) => f.soles())),
    holders: () => G.flatMap((g) => g.figs.map((f) => f.holder)),
    played: () => S.played.slice(),
    events: () => S.events.slice(),
    time: () => S.t,
    dispose() { groupLifeLog.dispose++; S.offs.forEach((f) => f()); S.offs = []; for (const g of G) for (const f of g.figs) f.dispose(); root.clear() },
  }
}
