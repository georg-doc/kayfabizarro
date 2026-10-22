// WS-NPC Phase C P1 (V-583 Dark Fluffer; Georg 21.10.: Gegner Ghost, Heil-Waffe Gun_Pistol) · Modul nach Host-Vertrag R1.2 für EINEN Dark Fluffer.
// Ablauf = flufferSim (rein, Node-geprüft); dieses Modul zeigt ihn und gibt die Weltereignisse an die vorhandenen Besitzer weiter:
//   Figur    KFB_Ghost_healed.k11c.glb (WSB K11, Quaternius MonsterCuteCubes Ghost as-is + KFB_Mouth + KFB_HealedEyes; weiße Augen sichtbar ab dem Heilen), Kit-Clips as-is (Idle, Walk, Bite_Front,
//            Yes, Dance), vorne = +Z (Spender gemessen, isoliert nachgeprüft), auf das Gelände gestellt, Blick weich nachgeführt
//   Spucken  spuck.v3: Tropfen sammeln sich 0,34 s am Maul (Anker KFB_Mouth von WSB, V-589), dann 3–5 Tropfen auf einem Bogen mit Mindeststeigung und
//            Nachlauf, Aufprall erst danach; Tinte #1f1a14, Material wie im Spender (MeshBasic, toneMapped aus). Keine Zielmarke.
//   Welt     Fleck → terrain.setInkPatches; 1. Aufprall → orchard.taint; 2. Aufprall → orchard.hitTree (native Abwurf-Physik); Heilen → orchard.burst
//            (einmal bunter Fluff), Fleck verblasst, taint aus. Treffer über orchard.addTarget (Schuss B), kein Schaden, kein Kampfsystem.
//   Waffe    Gun_Pistol.gltf (KayKit Prototype Bits, as-is) am Hand-Slot handslot.r des Spielers (V-574) mit EINER festen Halterungsdrehung (V-581, GUN_SLOT).
//   Bewohner threat() → { x, z } solange feindlich (residentSim: bemerken, zusammenzucken, ausweichen)
// options: { def: residents.r1.json fluffers[i], t0 (Weltsekunden), clock(): Weltzeit, groundAt(x, z), terrain(), orchard(), player() (Loco-Modul),
//            onEvent?(e) (Phase B: { type: 'healed', flufferId, at, t } an das Gedächtnis der Bewohner),
//            K15 (Lead 22.10.): modelUrl? (Boden-Cube k11c, Standard Ghost), kind?, gun? (false = Waffe trägt ein anderer Fluffer), show?(x, z) (Culling), onWorld?(e) (jedes Weltereignis mit id) }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createFlufferSim } from './flufferSim.js'
import ghostUrl from '../assets/fluffer/KFB_Ghost_healed.k11c.glb?url' // WSB K11 k11c (WS0 V-602): Ghost as-is + KFB_Mouth + KFB_HealedEyes (CC0, Quaternius)
import gunUrl from '../assets/fluffer/Gun_Pistol.gltf?url'
import gunBin from '../assets/fluffer/Gun_Pistol.bin?url'
import gunTex from '../assets/fluffer/prototypebits_texture.png?url'

// V-581 (Kit-Waffen einpassen): EINE feste, gemessene Halterungsdrehung je Waffe, Grund kit-axis-mismatch (Prototype-Bits-Lauf +Z, Rig_Medium handslot.r
// zeigt in der Ruhehaltung +Z nach oben). Gemessen 21.10. an FrizzleBob v5b in Idle_A (test/out/npc/gun_measure.mjs): Lauf → Körper-Vorwärts, Oberseite → oben,
// Ergebnis achsenparallel Euler XYZ (−90°, 0°, 180°). Gilt für alle Clips; kein Nachdrehen je Bild.
export const GUN_SLOT = Object.freeze({ bone: 'handslot.r', rotation: Object.freeze([0, Math.SQRT1_2, Math.SQRT1_2, 0]), reason: 'kit-axis-mismatch' })
// SPIT ist auf refH 1,1 m abgestimmt; Größenwerte (ballR, trail, spread, arc[0], minRise) ziehen mit heightM / refH mit (WS0 V-616). Trefferradius bleibt.
export const SPIT = Object.freeze({ drops: [3, 5], dropR: [0.4, 1.0], ballR: 0.075, trail: 0.13, spread: 0.055, arc: [0.3, 0.14], minRise: 0.42, ink: '#1f1a14', turnRate: 5, refH: 1.1, targetR: 0.7 })
export const darkFlufferLog = { create: 0, update: 0, dispose: 0 }

export function createDarkFluffer(options) {
  darkFlufferLog.create++
  const def = options.def, sim = createFlufferSim({ ...def, t0: options.t0 ?? 0 })
  const sk = (def.heightM || SPIT.refH) / SPIT.refH // Größenfaktor für Tropfen und Bogen (WS0 V-616)
  const root = new THREE.Group(); root.name = 'dark-fluffer:' + def.id
  const holder = new THREE.Group(); holder.name = 'fluffer-holder'; holder.visible = false; root.add(holder)
  const S = { status: 'LOADING', error: null, mixer: null, actions: {}, clip: null, yaw: null, mouth: null, scale: 1, prevT: null, t: 0, events: [], gun: null, gunOn: false, offTarget: null, patchKey: '', heals: 0, hops: [], hop: { body: null, y1: null, y0: null, last: -Infinity } }
  // Tropfen-Pool: je Spucke bis zu 5 Kugeln, Größen und Versatz aus dem Spuck-Seed (deterministisch)
  const inkMat = new THREE.MeshBasicMaterial({ color: SPIT.ink, toneMapped: false }), dropGeo = new THREE.SphereGeometry(1, 12, 9)
  const pools = sim.spits.map((s) => { let h = (def.seed * 9301 + s.k * 49297) % 233280; const rnd = () => (h = (h * 9301 + 49297) % 233280) / 233280
    const n = SPIT.drops[0] + Math.floor(rnd() * (SPIT.drops[1] - SPIT.drops[0] + 1))
    return Array.from({ length: n }, (_, j) => { const m = new THREE.Mesh(dropGeo, inkMat); m.visible = false; m.castShadow = true; m.frustumCulled = false; root.add(m)
      return { m, r: SPIT.ballR * sk * (SPIT.dropR[0] + (SPIT.dropR[1] - SPIT.dropR[0]) * rnd() ** 1.6), off: [(rnd() - 0.5) * 2 * SPIT.spread * sk, (rnd() - 0.5) * 2 * SPIT.spread * sk, (rnd() - 0.5) * 2 * SPIT.spread * sk], lag: (j / Math.max(1, n - 1)) * SPIT.trail } }) })
  const release = new Map() // k → Maul-Lage beim Abgang

  const loader = new GLTFLoader()
  const ready = (async () => {
    const g = await loader.loadAsync(options.modelUrl || ghostUrl), o = g.scene
    o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } })
    const box = new THREE.Box3().setFromObject(o); S.scale = (def.heightM || 1.1) / Math.max(0.01, box.max.y - box.min.y); o.scale.setScalar(S.scale)
    holder.add(o); S.mouth = o.getObjectByName('KFB_Mouth') || o.getObjectByName('Mouth'); S.eyes = o.getObjectByName('KFB_HealedEyes'); if (S.eyes) S.eyes.visible = false // Spucken aus KFB_Mouth (V-589); weiße Augen erst nach dem Heilen
    S.mixer = new THREE.AnimationMixer(o)
    for (const c of g.animations) S.actions[c.name] = S.mixer.clipAction(c)
    for (const n of ['Yes', 'Dance', 'Bite_Front']) if (S.actions[n]) { S.actions[n].setLoop(THREE.LoopOnce, 1); S.actions[n].clampWhenFinished = true }
    S.status = 'OK'
    if (options.gun === false) return
    // Heil-Waffe (as-is): gltf + bin + Textur aus den Spiel-Assets (Adressen über den URL-Abgleich)
    const man = new THREE.LoadingManager(); man.setURLModifier((u) => (u.endsWith('Gun_Pistol.bin') ? gunBin : u.endsWith('prototypebits_texture.png') ? gunTex : u))
    const txt = await (await fetch(gunUrl)).text()
    S.gun = await new Promise((res, rej) => new GLTFLoader(man).parse(txt, '', (gg) => res(gg.scene), rej))
    S.gun.name = 'heal-weapon:Gun_Pistol'; S.gun.traverse((m) => { if (m.isMesh) m.castShadow = true })
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  const play = (name) => { if (S.clip === name || !S.actions[name]) return; const a = S.actions[name]; a.reset().fadeIn(0.18).play(); if (S.clip && S.actions[S.clip]) S.actions[S.clip].fadeOut(0.18); S.clip = name }
  const mouthWorld = (out) => { if (S.mouth) { S.mouth.updateWorldMatrix(true, false); return S.mouth.getWorldPosition(out) } return out.set(holder.position.x, holder.position.y + (def.heightM || 1.1) * 0.3, holder.position.z) }
  const _m = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _hb = new THREE.Vector3()

  function attachGun() {
    if (S.gunOn || !S.gun) return
    const pl = options.player?.(), bones = pl?.figureBones?.([GUN_SLOT.bone]); const slot = bones?.[GUN_SLOT.bone]; if (!slot) return
    S.gun.quaternion.fromArray(GUN_SLOT.rotation); slot.add(S.gun); S.gunOn = true // V-574/V-581: Original am Kit-Slot, eine feste Halterungsdrehung
  }
  function registerTarget() {
    if (S.offTarget || S.status !== 'OK') return
    const O = options.orchard?.(); if (!O?.addTarget) return
    S.offTarget = O.addTarget({ id: def.id, r: SPIT.targetR, // Trefferradius bleibt (WS0 V-616: Heilen nicht schwerer)
      pos: () => (sim.at(S.t).target ? [holder.position.x, holder.position.y + (def.heightM || 1.1) * 0.5, holder.position.z] : null),
      onHit: () => { if (sim.heal(S.t)) S.heals++ }, priority: () => !!sim.at(S.t).hostile }) // Georg 21.10. (a): feindlich am Stamm → Schuss nimmt den Ghost statt der Krone
  }
  function world(e) {
    const O = options.orchard?.(), tr = def.tree
    if (e.type === 'taint' || e.type === 'fade') S.tainted = e.type === 'taint'
    if (e.type === 'taint') O?.taint?.(tr.zone, tr.id, true)
    else if (e.type === 'drop') O?.hitTree?.(tr.zone, tr.id, 'explosion')
    else if (e.type === 'burst') O?.burst?.([holder.position.x, holder.position.y + (def.heightM || 1.1) * 0.6, holder.position.z], e.n, e.seed, e.tag)
    else if (e.type === 'fade') O?.taint?.(tr.zone, tr.id, false)
    if (e.type === 'healed') options.onEvent?.({ type: 'healed', flufferId: def.id, at: [holder.position.x, holder.position.z], t: e.t }) // Phase B: Zeugen
    S.events.push({ t: +e.t.toFixed(3), type: e.type, k: e.k ?? null }); if (S.events.length > 60) S.events.shift()
    options.onWorld?.({ type: e.type, k: e.k ?? null, t: +e.t.toFixed(3), id: def.id, kind: options.kind ?? null, at: [holder.position.x, holder.position.z], mouth: mouthWorld(new THREE.Vector3()).toArray() }) // K15: Sammel-Ereignisse der Fluffer-Menge
  }

  return {
    object3d: root, ready, sim,
    update(dt) {
      darkFlufferLog.update++
      const t = options.clock ? options.clock() : S.t + dt // Weltzeit (M1CLOCK.t); def.t0 = Startzeit des Fluffers in dieser Zeit
      S.t = t
      if (S.status !== 'OK') return
      attachGun(); registerTarget()
      const st = sim.at(t)
      // Lage, Blick (weich), Clip
      const y = options.groundAt(st.x, st.z); holder.position.set(st.x, y, st.z)
      if (S.yaw === null) S.yaw = st.yaw; else { let d = st.yaw - S.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); S.yaw += Math.sign(d) * Math.min(Math.abs(d), SPIT.turnRate * dt) }
      // K15-Culling (Muster groupLife): nur im Bild oder ganz nah sichtbar; verdeckt ruht der Mixer, Plan und Welt laufen weiter
      S.shown = st.phase !== 'gone' && st.phase !== 'wait' && (options.show ? !!options.show(st.x, st.z) : true)
      holder.rotation.set(0, S.yaw, 0); holder.visible = S.shown; if (S.eyes) S.eyes.visible = !!st.healed
      play(st.clip); if (S.actions.Walk) S.actions.Walk.timeScale = THREE.MathUtils.clamp(st.speed / 0.9, 0.8, 1.25) // Eigentempo Walk nicht gemessen (Lücke)
      if (S.shown) S.mixer.update(dt)
      // Hüpfer (WS-Audio, Georg 21.10.): Tiefpunkt des Knochens „Body“ beim Gehen (Walk) = Aufsetzen → Ereignis hop (eigener Ringpuffer)
      if (holder.visible && st.clip === 'Walk' && st.speed > 0.1) { const H = S.hop, b = (H.body ||= holder.getObjectByName('Body')); if (b) { b.updateWorldMatrix(true, false); const yb = _hb.setFromMatrixPosition(b.matrixWorld).y - y
        if (H.y1 !== null && H.y0 !== null && H.y1 < H.y0 && H.y1 <= yb && S.t - H.last > 0.2) { H.last = S.t; S.hops.push({ type: 'hop', id: def.id, kind: options.kind ?? null, at: [holder.position.x, holder.position.z], t: S.t }); if (S.hops.length > 60) S.hops.shift() }
        H.y0 = H.y1; H.y1 = yb } } else { S.hop.y0 = S.hop.y1 = null }
      // Weltereignisse (genau einmal)
      const from = S.prevT ?? -Infinity // beim ersten fertigen Bild alle schon fälligen Ereignisse nachholen (Welt konsistent mit dem Plan)
      for (const e of sim.events(from, t)) { if (e.type === 'spit') release.set(e.k, mouthWorld(new THREE.Vector3()).toArray()); world(e) }
      S.prevT = t
      // Fleck: nur bei Änderung an das Gelände (Stärke in 1/50 gestuft)
      const key = st.patch ? Math.round(st.patch.amount * 50) + '' : ''
      if (key !== S.patchKey) { S.patchKey = key; options.terrain?.()?.setInkPatches?.(st.patch ? [st.patch] : []) }
      // Tropfen: sammeln am Maul, dann Bogen zum Aufprall
      for (const pool of pools) for (const d of pool) d.m.visible = false
      if (!S.shown) return
      if (st.gathering) { const pool = pools[st.gathering.k], m = mouthWorld(_m), u = Math.min(1, st.gathering.u)
        pool.forEach((d) => { d.m.visible = true; d.m.position.set(m.x + d.off[0] * u, m.y + d.off[1] * u, m.z + d.off[2] * u); d.m.scale.setScalar(Math.max(0.001, d.r * (0.3 + 0.7 * u))) }) }
      for (const f of st.flying) { const pool = pools[f.k], a0 = release.get(f.k); if (!a0) continue
        _a.fromArray(a0); _c.set(f.to[0], options.groundAt(f.to[0], f.to[1]), f.to[1])
        const dist = Math.hypot(_c.x - _a.x, _c.z - _a.z), top = Math.max(_a.y + SPIT.minRise * sk, Math.max(_a.y, _c.y) + SPIT.arc[0] * sk + dist * SPIT.arc[1])
        _b.set((_a.x + _c.x) / 2, 2 * top - (_a.y + _c.y) / 2, (_a.z + _c.z) / 2) // Kontrollpunkt: Scheitel der Bézier-Kurve liegt auf „top“
        pool.forEach((d) => { const k = Math.max(0, f.u - d.lag); if (k <= 0) return; const q = 1 - k
          d.m.visible = true; d.m.position.set(q * q * _a.x + 2 * q * k * _b.x + k * k * _c.x + d.off[0], q * q * _a.y + 2 * q * k * _b.y + k * k * _c.y + d.off[1], q * q * _a.z + 2 * q * k * _b.z + k * k * _c.z + d.off[2]); d.m.scale.setScalar(d.r) }) }
    },
    threat: () => { const st = sim.at(S.t); return S.status === 'OK' && st.hostile ? { x: st.x, z: st.z, id: def.id } : null },
    status: () => ({ status: S.status, error: S.error, kind: options.kind ?? null, shown: !!S.shown, gun: S.gunOn, target: !!S.offTarget, mouth: S.mouth?.name ?? null, eyes: S.eyes ? (S.eyes.visible ? 'white' : 'hidden') : null, scale: +S.scale.toFixed(4) }),
    debug: () => { const st = sim.at(S.t); return { t: +S.t.toFixed(3), phase: st.phase, clip: S.clip, x: st.x, z: st.z, patch: st.patch, spitsDone: st.spitsDone, healed: st.healed, hostile: st.hostile, heals: S.heals, events: S.events.slice(), arrive: sim.arrive, spits: sim.spits.map((s) => ({ windup: s.windup, release: s.release, impact: s.impact })), drops: pools.flat().filter((d) => d.m.visible).length } },
    mouthWorld: () => mouthWorld(new THREE.Vector3()).toArray(),
    hops: () => S.hops.slice(), // { type: 'hop', id, at: [x, z], t } (WS-Audio: DF07_fluffer_hop)
    holder: () => holder,
    dispose() { darkFlufferLog.dispose++; S.offTarget?.(); if (S.tainted) options.orchard?.()?.taint?.(def.tree.zone, def.tree.id, false); S.gun?.parent?.remove(S.gun); options.terrain?.()?.setInkPatches?.([]); S.mixer?.stopAllAction(); inkMat.dispose(); dropGeo.dispose(); root.clear() },
  }
}
