// WS-Audio R1 (V-598) · Anschluss des Tons an die Laufwelt (M1): einmal je Takt Hörer (Kamera-Ausrichtung, Lage der Figur bzw. des Racers), Modus
// (zu Fuß | Fahrt | Flug), Tempo/Gas/Drehzahl, Gangphase, Tageszeit, Wasser in der Nähe → kfbAudio.frame. Ereignisse: M2EVENTS (Fahrzeug),
// Obstgarten-Aktionen V/B/N (Ergebnis aus HARVEST_STATE.last), Fluff gesammelt/aufgehoben, Sprung/Landung zu Fuß, Dark Fluffer (fluffer(e)), NPC-Gruppen (groups.events()).
// Laden 2 s nach dem Weltstart (still), hörbar erst nach der ersten Eingabe (Taste über den Host-Router, Zeiger), Browser-Regel. Liest nur – kein Spielzustand wird verändert.
// props.host: { mods, player (Ref auf M1Player), harvest (HARVEST_STATE), m1 (M1STATE), light (LIGHT_INFO), flatR }
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useHostKeys } from '../hostKeys'
import { expose } from '../debug'
import { M2_ON, M2STATE, M2EVENTS, RACER, RACER_FLY } from '../m2/M2Car'
import { worldPosOf } from '../m1/m1Host'
import * as A from './kfbAudio.js'
import { groupKey, stepKey, greetKey } from './cueMap.js'
import { createWaterIndexAsync, waterNear, stepSurface, hoverSurface } from './waterAudio.js'
import { mountAudioPanel } from './audioPanel.js'

const todName = (t) => (t == null ? 'day' : t < 0.18 ? 'night' : t < 0.55 ? 'evening' : 'day')
// Flugart aus den Düsen des aktuellen Racers – Racer sind wechselbar (WS1d: RACER lebendige Bindung, M2STATE.racerSwaps zählt Wechsel)
const FK = { swaps: -1, kind: 'antigrav' }
const flyKind = () => { const n = M2STATE.racerSwaps ?? 0; if (n !== FK.swaps) { FK.swaps = n; const t = new Set((RACER?.anchors || []).map((a) => a.type)); FK.kind = t.has('thrust') ? 'jet' : t.has('fan') ? 'turbine' : 'antigrav' } return FK.kind }
const _p = new THREE.Vector3(), _f = new THREE.Vector3(), _u = new THREE.Vector3(), _f2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _b = new THREE.Vector3()

export default function AudioHost({ host }) {
  const { camera } = useThree()
  const R = useRef({ pending: null, counts: -1, picked: 0, air: 'ground', prevCar: null, carV: 0, carVy: 0, prevFig: null, figV: 0, figVy: 0, water: null, waterAt: -9, emitters: [], biome: 'meadow', farm: null, stopWater: null, panel: null, t: 0, fluffSeen: new Set() })
  const unlock = () => { A.preload({ car: M2_ON }); A.unlock().then(() => { if (A.audioMode() === 'full' && !R.current.panel && typeof document !== 'undefined') R.current.panel = mountAudioPanel(A) }) }
  // erste Eingabe: jede Taste (vor allen anderen, ohne sie zu verbrauchen) und Zeiger; V/B/N merken für den Kampf-Ton
  useHostKeys((e) => {
    unlock()
    if (e.repeat || host.m1?.phase !== 'free') return
    const w = { KeyV: 'punch', KeyB: 'shoot', KeyN: 'blast' }[e.code]; if (w && host.harvest && !(w === 'shoot' && host.mods?.combat?.active?.())) R.current.pending = { kind: w, prev: host.harvest.last } // Kampf R1: K10-Schuss tönt über k10()
  }, 1000)
  useEffect(() => { const on = () => unlock(); window.addEventListener('pointerdown', on); return () => window.removeEventListener('pointerdown', on) }, [])
  // Fahrzeug-Ereignisse (k2t, racerFlight) an den Ton
  useEffect(() => { if (!M2_ON) return; return M2EVENTS.on('*', (e) => { const p = M2STATE.carPos?.(); A.vehicleEvent(e, p ? { x: p.x, y: p.y, z: p.z } : null) }) }, [])
  useEffect(() => () => { R.current.stopWater?.(); R.current.panel?.dispose() }, [])
  useFrame((_, dt) => {
    const H = R.current, mods = host.mods || {}; H.t += dt
    if (!H.pre && H.t > 2) { H.pre = true; A.preload({ car: M2_ON }) } // Laden 2 s nach dem Start der Welt (vor der ersten Eingabe, noch still)
    if (A.audioMode() !== 'full') { if (A.audioMode() === 'public') A.frame({ mode: 'foot' }); return }
    // Lage und Modus
    const car = M2_ON ? M2STATE.carPos?.() : null, fig = car ? null : worldPosOf(mods.player, _p), pos = car || fig
    if (!pos) return
    camera.getWorldDirection(_f); _u.set(0, 1, 0).applyQuaternion(camera.quaternion)
    const st = { listener: { x: pos.x, y: pos.y + (car ? 0.8 : 1.2), z: pos.z, fx: _f.x, fy: _f.y, fz: _f.z, ux: _u.x, uy: _u.y, uz: _u.z }, dialogue: host.m1?.phase === 'dialog', tod: todName(host.light?.()?.mood?.tod) }
    if (car) {
      if (H.prevCar && dt > 0) { const dx = car.x - H.prevCar.x, dz = car.z - H.prevCar.z; if (Math.hypot(dx, dz) > 1e-4) { H.carDx = dx; H.carDz = dz } const v = Math.hypot(dx, dz) / dt, vy = (car.y - H.prevCar.y) / dt; H.carV += (v - H.carV) * Math.min(1, dt * 8); H.carVy += (vy - H.carVy) * Math.min(1, dt * 6) }
      H.prevCar = { x: car.x, y: car.y, z: car.z }
      const k = M2STATE.drive || {}, eng = M2STATE.rig?.engine
      // Rutschwinkel: Fahrtrichtung (Lage-Differenz) gegen die Nase des Racers (+Z der Darstellung); Untergrund unter dem Racer alle 0,25 s
      let slip = 0; const vr = M2STATE.visualRoot; if (vr && H.carDx !== undefined && H.carV > 3) { _f2.set(0, 0, 1).applyQuaternion(vr.getWorldQuaternion(_q)); _f2.y = 0; const n = Math.hypot(H.carDx, H.carDz); if (n > 1e-4 && _f2.lengthSq() > 1e-6) { _f2.normalize(); slip = Math.acos(Math.min(1, Math.abs((_f2.x * H.carDx + _f2.z * H.carDz) / n))) } }
      if (H.t - (H.csAt || -9) > 0.25) { H.csAt = H.t; const T = mods.terrain, h = T?.height, e = 0.6, sy = T?.hydro?.()?.seaY ?? null
        const slope = h ? Math.hypot(h(car.x + e, car.z) - h(car.x - e, car.z), h(car.x, car.z + e) - h(car.x, car.z - e)) / (2 * e) : 0
        H.carSurface = hoverSurface({ slope, y: h ? h(car.x, car.z) : car.y, flatY: 1.2 * (host.k || 1), nearWater: H.emitters.find((w) => w.kind === 'river')?.d ?? Infinity, seaY: sy }) }
      Object.assign(st, { surface: H.carSurface, slip, air: !!k.air, mode: RACER_FLY && k.fly ? 'fly' : 'drive', speed: H.carV, throttle: k.gas ? (k.boil ? 0.3 : 1) : 0, brake: k.brake ? 1 : 0, rpm01: eng?.rpm, gear: eng?.gear, gears: 5, flyKind: flyKind(), vertical: H.carVy / 12 })
    } else {
      const ps = mods.player?.status?.(), fly = !!host.player?.current?.flying?.()
      // Tempo aus der Lage (der Schwebeflug bewegt den Körper teils direkt, linvel ist dann 0), geglättet
      if (H.prevFig && dt > 0) { const v = Math.hypot(fig.x - H.prevFig.x, fly ? fig.y - H.prevFig.y : 0, fig.z - H.prevFig.z) / dt, vy = (fig.y - H.prevFig.y) / dt; if (v < 120) { H.figV += (v - H.figV) * Math.min(1, dt * 8); H.figVy += (vy - H.figVy) * Math.min(1, dt * 6) } }
      H.prevFig = { x: fig.x, y: fig.y, z: fig.z }; const sp = H.figV
      Object.assign(st, { mode: fly ? 'fly' : 'foot', speed: sp, throttle: Math.min(1, sp / 20), flyKind: 'antigrav', vertical: H.figVy / 10 })
      // Sprung / Landung aus dem Loco-Zustand
      const air = ps?.air || 'ground'
      if (air !== H.air) { if (H.air === 'ground' && air === 'up') A.play('foot.jump', { pos }); else if ((H.air === 'up' || H.air === 'fall') && air === 'ground') A.play('foot.land', { pos }); H.air = air }
      const T = mods.terrain, hy = T?.hydro?.(), r = Math.hypot(pos.x, pos.z), sea = hy?.seaY ?? null
      if (H.t - (H.surfAt || -9) > 0.25) { H.surfAt = H.t; const e = 0.8, h = T?.height
        const slope = h ? Math.hypot(h(pos.x + e, pos.z) - h(pos.x - e, pos.z), h(pos.x, pos.z + e) - h(pos.x, pos.z - e)) / (2 * e) : 0
        H.surface = stepSurface({ r, flatR: host.flatR || 0, nearWater: H.emitters.find((w) => w.kind === 'river')?.d ?? Infinity, y: pos.y, seaY: sea, slope }) }
      st.foot = { phase: ps?.phase, moving: sp > 0.4, grounded: air === 'ground', surface: H.surface }
    }
    // Raumklang: Gelände für die Verdeckung; Geländeform um den Hörer (mittlerer Anstieg in 8 Richtungen, 25 m) alle 0,5 s
    const hgt = mods.terrain?.height; if (hgt && !H.terrSet) { H.terrSet = true; A.setTerrain(hgt) }
    if (hgt && H.t - (H.riseAt || -9) > 0.5) { H.riseAt = H.t; let s = 0; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; s += hgt(pos.x + Math.cos(a) * 25, pos.z + Math.sin(a) * 25) - pos.y } H.rise = s / 8 }
    st.rise = H.rise
    // Wasser (world=probe): Index einmal (Meer zeilenweise), Abfrage alle 0,4 s, Quellen gleiten mit
    if (!H.water && !H.stopWater && mods.terrain?.hydro?.()) H.stopWater = createWaterIndexAsync(mods.terrain.hydro(), (W) => { H.water = W })
    if (H.water && H.t - H.waterAt > 0.4) { H.waterAt = H.t; const q = waterNear(H.water, pos, H.biome); H.emitters = q.emitters; H.biome = q.biome }
    if (H.water) { st.water = H.emitters; st.biome = H.biome }
    // Farm-Teppich an den Obstgärten
    if (!H.farm && mods.orchard?.trees) { const by = {}; for (const t of mods.orchard.trees()) { const z = (by[t.zone] ||= { x: 0, y: 0, z: 0, n: 0 }); z.x += t.pos[0]; z.y += t.pos[1]; z.z += t.pos[2]; z.n++ } H.farm = Object.values(by).map((z) => ({ x: z.x / z.n, y: z.y / z.n + 1, z: z.z / z.n })) }
    if (H.farm) st.farm = H.farm
    A.frame(st)
    // Obstgarten-Aktion: Ergebnis steht nach dem Tastendruck in HARVEST_STATE.last (Treffer = neues Ergebnis)
    if (H.pending && host.harvest) { const P = H.pending; H.pending = null; const res = host.harvest.last, hit = !!res && res !== P.prev
      let target = null; if (hit && res.tree && mods.orchard?.trees) { const t = mods.orchard.trees().find((x) => x.id === res.tree && (!res.zone || x.zone === res.zone)); if (t) target = { x: t.pos[0], y: t.pos[1] + 2, z: t.pos[2] } }
      A.combatAction(P.kind, { hit, pos: { x: pos.x, y: pos.y + 1.2, z: pos.z }, target }) }
    // Fluff gesammelt / Fundsache aufgehoben → UI
    if (host.harvest) { const c = host.harvest.counts || {}, n = Object.values(c).reduce((a, b) => a + (+b || 0), 0)
      if (H.counts >= 0 && n > H.counts) A.ui('collect'); H.counts = n
      const pk = host.harvest.picked || 0; if (pk > H.picked) A.ui('pickup'); H.picked = pk }
    // NPC-Gruppen (WS-NPC): mods.groups.events() – Ringpuffer der letzten 60, älteste zuerst; je Ereignis einmal (Schlüssel group|type|id|t bzw. tag)
    const Gm = mods.groups; if (Gm?.events && H.t - (H.grAt || 0) > 0.1) { H.grAt = H.t; H.grSeen ||= new Set()
      for (const e of Gm.events() || []) { const key = groupKey(e); if (H.grSeen.has(key)) continue; H.grSeen.add(key); if (H.grSeen.size > 400) H.grSeen.delete(H.grSeen.values().next().value)
        const h = mods.terrain?.height, p = Array.isArray(e.at) ? { x: e.at[0], y: (h ? h(e.at[0], e.at[1]) : pos.y) + 1, z: e.at[1] } : null; A.groupEvent(e, p) } }
    // Schritte und Hüpfer der NPCs (WS-NPC): groups.steps(), npc.steps(), fluffer.hops() – Ringpuffer, je Eintrag einmal (id|foot|t bzw. id|t)
    if (H.t - (H.stAt || 0) > 0.05) { H.stAt = H.t; H.stSeen ||= new Set(); const hh = mods.terrain?.height
      H.stInit ||= {}
      for (const [src, list] of [['g', mods.groups?.steps?.()], ['n', mods.npc?.steps?.()], ['f', mods.fluffer?.hops?.()]]) { if (!list) continue; const first = !H.stInit[src]; H.stInit[src] = true; for (const e of list) {
        const key = src + stepKey(e); if (H.stSeen.has(key)) continue; H.stSeen.add(key); if (H.stSeen.size > 800) H.stSeen.delete(H.stSeen.values().next().value)
        if (first) continue // erstes Lesen je Quelle: nur merken (keine alten Schritte nachspielen)
        if (!Array.isArray(e.at)) continue; const x = e.at[0], z = e.at[1], y = hh ? hh(x, z) : pos.y
        A.npcStep(e, { x, y: y + 0.05, z }, e.group ? null : stepSurface({ r: Math.hypot(x, z), flatR: host.flatR || 0, y })) } } }
    // Publikum an der Band (WS0 N15): leise Schleife, solange die Figur in 30 m Nähe der Band ist
    const Bp = mods.band?.positions?.(); if (Bp?.length && H.t - (H.bdAt || 0) > 0.5) { H.bdAt = H.t; _b.set(Bp.reduce((s, p) => s + p.x, 0) / Bp.length, Bp.reduce((s, p) => s + p.y, 0) / Bp.length, Bp.reduce((s, p) => s + p.z, 0) / Bp.length);   /* Mitte der Musiker über positions() – der React-Host greift nicht auf Modul-Szenenknoten zu (contract-static) */ if (Math.hypot(_b.x - pos.x, _b.z - pos.z) < 30) A.presence('bandCrowd', 'npc.bandCrowd', { x: _b.x, y: _b.y + 1, z: _b.z }, 1.2) }
    // Kampf R1 (Kampfmodul combatPlayer): K10-Ereignisse (fire, contact, kill) aus dem Ringpuffer events(), je Ereignis einmal (seq) → k10(); erstes Lesen nur merken
    const Cb = mods.combat; if (Cb?.events) { const L = Cb.events(); if (H.cbSeq == null) H.cbSeq = L.at(-1)?.seq ?? 0; else for (const e of L) if (e.seq > H.cbSeq) { H.cbSeq = e.seq; A.k10(e) } }
    // Begrüßung der Bewohner (WS-NPC 'greet' { reason, id, at }): aus npc.greets() bzw. npc.events(), je Eintrag einmal, beim ersten Lesen nur merken
    const Nm = mods.npc, GL = Nm?.greets?.() || Nm?.events?.(); if (GL && H.t - (H.grtAt || 0) > 0.1) { H.grtAt = H.t; H.grtSeen ||= new Set(); const first = !H.grtInit; H.grtInit = true
      for (const e of GL) { if (e?.type !== 'greet') continue; const key = greetKey(e); if (H.grtSeen.has(key)) continue; H.grtSeen.add(key); if (H.grtSeen.size > 300) H.grtSeen.delete(H.grtSeen.values().next().value); if (first) continue
        const hh = mods.terrain?.height, at = Array.isArray(e.at) ? { x: e.at[0], y: (hh ? hh(e.at[0], e.at[1]) : pos.y) + 1.6, z: e.at[1] } : null; A.greet(e, at) } }
    // Dark Fluffer (WS-NPC): K15 fluffer.events() – alle Fluffer (bis 3), je seq einmal, Ort = Maul (mouth) bzw. at; beim ersten Lesen nur merken.
    // Auch hinter der Kamera (Culling ruht nur die Animation). Ohne events() der alte Weg über debug().events (nur der Ghost).
    const F = mods.fluffer; if (F?.events && H.t - (H.flAt || 0) > 0.1) { H.flAt = H.t; const list = F.events(), first = H.flSeq == null, last = list.at(-1)?.seq ?? 0; if (!first && last < H.flSeq) H.flSeq = 0 // Modul neu angelegt: seq beginnt von vorn
      let top = H.flSeq ?? 0; for (const e of list) { if (first || !(e?.seq > H.flSeq)) { top = Math.max(top, e?.seq || 0); continue } top = Math.max(top, e.seq)
        const hh = mods.terrain?.height, m = e.mouth, at = Array.isArray(m) ? { x: m[0], y: m[1], z: m[2] } : Array.isArray(e.at) ? { x: e.at[0], y: (hh ? hh(e.at[0], e.at[1]) : pos.y) + 0.6, z: e.at[1] } : null; A.fluffer(e, at) }
      H.flSeq = top
    } else if (F?.debug && !F.events && H.t - (H.flAt || 0) > 0.1) { H.flAt = H.t; const d = F.debug(), m = F.mouthWorld?.()
      for (const e of d.events || []) { const key = e.t + ':' + e.type + ':' + e.k; if (H.fluffSeen.has(key)) continue; H.fluffSeen.add(key)
        const at = m ? { x: m[0] ?? m.x, y: m[1] ?? m.y, z: m[2] ?? m.z } : d.x != null ? { x: d.x, y: pos.y, z: d.z } : null; A.fluffer(e, at) } }
  })
  useEffect(() => { expose('Audio', { stats: A.stats, play: A.play, k10: A.k10, fluffer: A.fluffer, groupEvent: A.groupEvent, npcStep: A.npcStep, presence: A.presence, ambienceContext: A.ambienceContext, ambienceLightning: A.ambienceLightning, musicPulse: A.musicPulse, greet: A.greet, vehicleEvent: A.vehicleEvent, combatAction: A.combatAction, setVolume: A.setVolume, unlock: A.unlock, capture: A.captureStream }) }, [])
  return null
}
