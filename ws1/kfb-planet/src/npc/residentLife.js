// WS-NPC A2 · Bewohner im Spiel: EIN Modul nach Host-Vertrag R1.2 (create(options) → { object3d, update(dt, ctx), dispose() }) für alle Bewohner.
// Logik = residentSim (rein, Node-geprüft); dieses Modul zeigt nur: Figur über den Darsteller-Slot (actors/actorSlot → eyeActor, KFB-Augen aus
// Georgs Batch), Fortbewegung über den Gang-Mischer m1-gait (V-248: Abspielrate = Tempo / Eigentempo, Füße stehen), Aktions-Clips as-is als
// Overlay (V-574), Blick Augen → Kopf → Körper (Kanon Gebiet 10): Augen sofort (Eye-Rig lookAt), Kopf verzögert und begrenzt (Knochen „head“ nach
// dem Mixer), Körper dreht die Logik am langsamsten. Kein eigenes Licht, kein eigenes Material: Schatten/Fuß/Knete hängt der Host wie bei Spieler
// und Partnerin an (M1World FootShade).
// options: { world: residents.r1.json, groundAt(x, z) → y, clipUrls: [Adressen], cast(stageCastId) → Darsteller-Optionen (stageCast.KAYKIT),
//            worldScale: K, t0: Startzeit im Tag (s), clock(): Weltzeit (s), player(): { x, y, z } | null, camera(): Kamera | null,
//            threat?(residentId) → { x, z, id } | null (Phase C: feindlicher Dark Fluffer),
//            memory?: true | { store } (Phase B: Lean Memory im Weltstand kfb.world-save/1 des Leads; true = localStorage), memoryFresh?: Weltstand vorher leeren }
import * as THREE from 'three'
import { createNpcFigure, loadClipSet, FIGURE } from './npcFigure.js'
import { buildRoutes } from './npcDay.js'
import { createResidentSim } from './residentSim.js'
import { createNpcMemory } from './npcMemory.js'
import { createWorldSaveStore } from '../world/worldSave.js'

export const LIFE = Object.freeze({ ...FIGURE, visibleFar: 140 })
export const residentLifeLog = { create: 0, update: 0, dispose: 0 }

export function createResidentLife(options) {
  residentLifeLog.create++
  const W = options.world, K = options.worldScale ?? 1
  const ctx = { pois: Object.fromEntries(W.pois.map((p) => [p.id, p])), routes: buildRoutes(W.routes), dayS: W.dayS }
  // Phase B: Gedächtnis (Belege im Weltstand), Begrüßung des Spielers daraus, Weitergabe in Begegnungen
  let mem = null
  if (options.memory) { const store = options.memory.store || createWorldSaveStore(); if (options.memoryFresh) store.clear(); mem = createNpcMemory({ store, dayS: W.dayS }) }
  // Begrüßung (Georg 22.10., G-2): Ereignis greet { reason, id, at, t, seq } im Ringpuffer events() und an options.onGreet (Blase, Stimm-Laut) – auch ohne Gedächtnis
  let seq = 0
  const greet = (e) => { const ev = { type: 'greet', reason: e.reason || 'first', id: e.id, at: e.at, t: e.t, seq: ++seq }; S.events.push(ev); if (S.events.length > 40) S.events.shift(); options.onGreet?.(ev) }
  const hooks = mem ? { greetPlayer: (id) => mem.greetPlayer(id), topic: (a, b) => mem.topic(a, b),
    onEvent: (e) => { if (e.type === 'greet') greet(e); else if (e.type === 'playerNotice') mem.onPlayerNotice(e); else if (e.type === 'threatNotice') mem.onThreatNotice(e)
      else if (e.type === 'encounterDone') mem.onEncounterDone(e); else if (e.type === 'told') mem.tell({ speaker: e.speaker, listener: e.listener, topic: e.topic, t: e.t }) } } : { onEvent: (e) => { if (e.type === 'greet') greet(e) } }
  const sim = createResidentSim({ days: W.days, ctx, activities: W.activities, hooks })
  const root = new THREE.Group(); root.name = 'resident-life'
  const frustum = new THREE.Frustum(), _pv = new THREE.Matrix4(), _sphere = new THREE.Sphere(new THREE.Vector3(), 1.2)
  const S = { t: null, disposed: false, status: 'LOADING', error: null, near: {}, clips: {}, played: [], steps: [], events: [] }

  const R = W.residents.map((def) => {
    const f = createNpcFigure({ cast: options.cast(def.stageCastId), id: def.residentId, worldScale: K, groundAt: options.groundAt, onPlay: (id, c) => { S.played.push([id, c]); if (S.played.length > 60) S.played.shift() },
      onStep: (e) => { S.steps.push({ type: 'step', ...e, t: S.lastT ?? 0 }); if (S.steps.length > 80) S.steps.shift() } }) // Schritte (WS-Audio)
    root.add(f.holder); return { def, f, holder: f.holder, actor: f.actor }
  })

  const ready = (async () => {
    const clips = await loadClipSet(options.clipUrls || [])
    if (S.disposed) return
    S.clips = Object.keys(clips)
    await Promise.all(R.map((r) => r.f.load(clips)))
    S.status = R.every((r) => r.f.status().status === 'OK') ? 'OK' : 'ERROR'; S.error = R.map((r) => r.f.status().error).filter(Boolean).join('; ') || null
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  const playerPos = () => options.player?.() || null
  return {
    object3d: root,
    bubbleAnchors: R.flatMap((r) => r.actor.bubbleAnchors || []),
    ready, sim,
    update(dt, hctx) {
      if (S.disposed) return
      residentLifeLog.update++
      const tm0 = typeof performance !== 'undefined' ? performance.now() : 0
      if (S.t === null) S.t = options.t0 ?? 0
      const t = options.clock ? options.clock() + (options.t0 ?? 0) : (S.t += dt); S.lastT = t
      const pl = playerPos(), cam = options.camera?.() || hctx?.camera || null
      if (cam) { cam.updateMatrixWorld(); _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frustum.setFromProjectionMatrix(_pv) }
      // Blase: nah = im Radius um den Spieler ODER im Bild (bis visibleFar) – im Bild wird nie auf den Plan gesprungen (kein Pop-in)
      const near = (id) => { const b = sim.byId.get(id).out; if (!pl) return false; const d = Math.hypot(b.x - pl.x, b.z - pl.z); if (d < W.bubbleR) return true
        if (!cam || d > LIFE.visibleFar) return false; _sphere.center.set(b.x, options.groundAt(b.x, b.z) + 0.9 * K, b.z); return frustum.intersectsSphere(_sphere) }
      for (const r of R) S.near[r.def.residentId] = near(r.def.residentId)
      const outs = sim.step(t, dt, { player: pl, near: (id) => S.near[id], threat: options.threat ? (id) => options.threat(id) : undefined }) // Phase C: Dark Fluffer
      // MVP-Leistung (Lead 22.10., Muster discoLife): Figuren sind Skin-Meshes ohne Frustum-Culling – sichtbar nur im Bild (bis visibleFar) oder
      // ganz nah (12·K, Schatten ins Bild), sonst ausgeblendet; Plan, Uhr und Gedächtnis laufen weiter
      const show = (o) => { if (!pl) return true; const d = Math.hypot(o.x - pl.x, o.z - pl.z); if (d < 12 * K) return true; if (!cam || d > LIFE.visibleFar) return false; _sphere.center.set(o.x, options.groundAt(o.x, o.z) + 0.9 * K, o.z); return frustum.intersectsSphere(_sphere) }
      R.forEach((r, i) => { r.f.present(outs[i], dt); r.f.update(dt, hctx, show(outs[i])) })
      if (tm0) { const ms = performance.now() - tm0; S.ms = S.ms == null ? ms : S.ms * 0.95 + ms * 0.05; S.msMax = Math.max(S.msMax || 0, ms) } // Kosten je Schritt (gleitend)
    },
    status: () => ({ status: S.status, error: S.error, clips: S.clips.length, ms: S.ms ?? null, msMax: S.msMax ?? null, residents: R.map((r) => ({ id: r.def.residentId, cast: r.def.stageCastId, placeholder: r.def.placeholder, ...r.f.status() })) }),
    // Debug-Zeile je Bewohner (R0.6/R0.7: intent / POI / Route / Phase / Grund) und Messwerte für Tests
    debug: () => sim.brains.map((b) => ({ id: b.id, ...b.out, near: S.near[b.id], plan: (({ phase, poi, routeId, slot, activity, x, z }) => ({ phase, poi, routeId, slot, activity, x, z }))(b.plan(S.lastT ?? 0)), stats: b.state().stats, overlay: R.find((r) => r.def.residentId === b.id)?.f.anim()?.current() ?? null, gait: R.find((r) => r.def.residentId === b.id)?.f.anim()?.last ?? null })),
    soles: () => R.map((r) => r.f.soles()),
    encounter: () => sim.encounter(),
    // Phase B: Heilung beobachten – nur Bewohner in Sichtweite und in der Spielerblase werden Zeugen
    observeCure: ({ flufferId, at, t }) => mem?.onCured({ flufferId, at, t: t ?? S.lastT ?? 0, residents: sim.brains.map((b) => ({ id: b.id, x: b.out.x, z: b.out.z, near: !!S.near[b.id] })) }) ?? [],
    // Phase D3: Gruppen-Ereignisse (Skelett-Patrouille) → Belege der Mitglieder, Bewohner in Sichtweite als Zeugen
    observeGroup: (e) => mem?.onGroupEvent({ ...e, t: e.t ?? S.lastT ?? 0, members: (W.groups || []).find((g) => g.id === e.group)?.members.map((m) => m.id) ?? [], residents: sim.brains.map((b) => ({ id: b.id, x: b.out.x, z: b.out.z, near: !!S.near[b.id] })) }) ?? [],
    memory: () => (mem ? { status: mem.loadStatus, receipts: mem.state().npc.receipts, log: mem.log(), greet: Object.fromEntries(sim.brains.map((b) => [b.id, mem.greetPlayer(b.id).why])) } : null),
    played: () => S.played.slice(),
    steps: () => S.steps.slice(),
    events: () => S.events.slice(), // { type: 'greet', reason: 'cure'|'fight'|'known'|'first', id, at: [x, z], t, seq } (WS-Audio: Stimm-Laut; Blase über onGreet) // { type: 'step', id, foot, at, speed, t } (Weltzeit wie memory)
    holders: () => R.map((r) => r.holder),
    time: () => S.lastT ?? null,
    figures: () => R.map((r) => r.actor.object3d),
    positions: () => sim.brains.map((b) => ({ id: b.id, x: b.out.x, z: b.out.z, y: options.groundAt(b.out.x, b.out.z) })),
    dispose() { residentLifeLog.dispose++; S.disposed = true; for (const r of R) r.f.dispose() },
  }
}
