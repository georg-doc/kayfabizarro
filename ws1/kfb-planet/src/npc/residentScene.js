// WS-NPC · S3 Modul „Bewohner-Begegnung“ (kfb.scene/1, Typ bewohner): eine Figur aus dem Register steht am Anker und geht ihrer Tätigkeit nach
// (Aktivitäten aus residents.r1.json, z. B. Lorekeeper study = liest, Bäuerin tend = gräbt), schaut den Spieler an, wenn er nah ist, und bemerkt ihn
// (greet-Ereignis wie residentLife: first/known, für Wechselrede und Ton). Kein Fahrplan: die Szene lebt nur, solange die Regie sie stehen lässt.
// Host-Vertrag R1.2: create(options) → { object3d, update(dt, hctx), dispose, events, status }.
import * as THREE from 'three'
import { createNpcFigure, loadClipSet } from './npcFigure.js'
import { createNotice } from './chatterCues.js'
import { SIM } from './residentSim.js'

// options: { scene (kfb.scene/1), activities (residents.r1.json activities), cast(characterId, rolle) → Darsteller-Optionen, clipUrls, groundAt, player(), clock(), worldScale }
export function createResidentScene(options) {
  const { scene, activities = {}, groundAt, worldScale: K = 1 } = options
  const root = new THREE.Group(); root.name = 'scene:' + scene.id
  const b = scene.besetzung[0], id = scene.id + '-' + b.characterId, act = activities[b.aktivitaet] || activities.rest || { base: 'Idle_A', beats: [] }
  const fig = createNpcFigure({ cast: options.cast(b.characterId, b.rolle), id, worldScale: K, groundAt })
  root.add(fig.holder)
  const S = { status: 'LOADING', t: 0, beatAt: 0, beat: null, events: [], seq: 0, notice: createNotice({ inR: SIM.playerIn, outR: SIM.playerOut }) }
  const ready = loadClipSet(options.clipUrls || []).then((c) => fig.load(c)).then(() => { S.status = 'OK' }, (e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })
  const rnd = (() => { let s = [...scene.id].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) })()
  return {
    object3d: root, ready,
    update(dt, hctx) {
      if (S.status !== 'OK') return
      S.t += dt
      const pl = options.player?.() || null, d = pl ? Math.hypot(pl.x - scene.anker.x, pl.z - scene.anker.z) : Infinity, near = d < SIM.playerIn
      // Tätigkeit: Grund-Clip, dazwischen Beats aus der Wunschliste (wie residentLife); nah am Spieler: stehen und schauen
      if (!near && S.t >= S.beatAt && act.beats?.length) { S.beat = act.beats[Math.floor(rnd() * act.beats.length)]; const e = act.every || [4, 7]; S.beatAt = S.t + e[0] + (e[1] - e[0]) * rnd(); S.beatEnd = S.t + 2.2 }
      if (S.beat && S.t > S.beatEnd) S.beat = null
      const yaw = near ? Math.atan2(pl.x - scene.anker.x, pl.z - scene.anker.z) : scene.anker.yaw
      fig.present({ x: scene.anker.x, z: scene.anker.z, yaw, speed: 0, clip: { name: near ? 'Idle_A' : S.beat || act.base || 'Idle_A', mode: 'loop' }, gaze: near ? { x: pl.x, z: pl.z, y: pl.y } : null }, dt)
      fig.update?.(dt, hctx, true)
      const r = S.notice.step(pl ? d : null, (options.clock?.() ?? S.t))
      if (r) { S.events.push({ type: 'greet', reason: r, id, characterId: b.characterId, at: [scene.anker.x, scene.anker.z], t: +S.t.toFixed(3), seq: ++S.seq, source: 'scene', scene: scene.id }); if (S.events.length > 20) S.events.shift() }
    },
    events: () => S.events.slice(),
    status: () => ({ status: S.status, error: S.error || null, scene: scene.id, characterId: b.characterId, figure: fig.status?.() ?? null }),
    dispose() { fig.dispose(); root.clear() },
  }
}
