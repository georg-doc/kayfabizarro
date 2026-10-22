// WS-NPC E3 (WS0 V-634, Lead 22.10.: „Trupp aus dem Geschenk“) · Modul nach Host-Vertrag R1.2: ein großes Geschenk erscheint, staucht und kippelt,
// springt auf (Present_Base → Present_UnwrappedBase im Pop-Frame), die Spielzeugsoldaten Nr. 1–6 springen nacheinander heraus und marschieren in ihre
// Route. Spur = Resident Atlas „Toy Soldier · Geschenk-Enthüllung“ 1:1 (data/npc/reveal.toy-soldier.json, revealTrack). Modelle = KayKit Mystery S6
// „6 – December 2025 – Toy Soldier“ (kayfabizarro @29c7500, öffentlich), kein erfundener Deckel.
// Ort und Auslöser gehören dem Welt-Ereignis-Host (Lead): spawnAt(x, z, yawDeg). Bis dahin Platzhalter-Ort per Hash (giftat=x,z,Grad), Auslöser per
// debug (__kfbM1.gift().spawn()) bzw. giftauto=<s>.
// Ereignisse (events(), Ringpuffer 40, WS-Audio): reveal_start, reveal_anticipation, reveal_pop, soldier_land { k, id }, reveal_done.
// Box und Papier bleiben als Kulisse liegen, bis der Trupp außerhalb der Blase ist; dann verschwinden sie (außer Sicht, kein Pop-out im Bild).
// options: { spec, def: { group, at, yawDeg, boxScale, stagger }, urls: { base, baseBin, unwrapped, unwrappedBin, tex }, groundAt, clock(), groups(),
//   worldScale, classScale, camera?() }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { nodeAt, restTime, phaseAt } from './revealTrack.js'

export const GIFT = Object.freeze({ spotFrac: 0.55 })
export const giftLog = { create: 0, update: 0, dispose: 0 }

export function createGiftReveal(options) {
  giftLog.create++
  const { spec, def } = options, K = options.worldScale ?? 1, sU = (options.classScale ?? 1) * K, sBox = sU * (def.boxScale ?? 1)
  const root = new THREE.Group(); root.name = 'gift'; root.visible = false
  const S = { status: 'LOADING', error: null, active: false, t0: null, at: def.at.slice(), yaw: ((def.yawDeg ?? 0) * Math.PI) / 180, events: [], seq: 0, fired: new Set(), phase: null, done: false, nodes: {}, base: {} }
  const emit = (type, extra = {}) => { S.events.push({ type, ...extra, at: S.at.slice(), t: options.clock(), seq: ++S.seq }); if (S.events.length > 40) S.events.shift() }

  async function loadGltf(url, binName, bin, tex) {
    const man = new THREE.LoadingManager(); man.setURLModifier((u) => (u.endsWith(binName) ? bin : u.endsWith('toy_soldier_texture.png') ? tex : u))
    const txt = await (await fetch(url)).text()
    return new Promise((res, rej) => new GLTFLoader(man).parse(txt, '', (g) => res(g.scene), rej))
  }
  const ready = (async () => {
    const U = options.urls
    const box = await loadGltf(U.base, 'Present_Base.bin', U.baseBin, U.tex), paper = await loadGltf(U.unwrapped, 'Present_UnwrappedBase.bin', U.unwrappedBin, U.tex)
    for (const [id, o] of [['present', box], ['unwrapped', paper]]) {
      o.name = 'gift:' + id; o.scale.setScalar(sBox); o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } })
      root.add(o); S.nodes[id] = o; S.base[id] = { s: o.scale.clone(), r: o.rotation.clone(), p: o.position.clone() }
    }
    S.status = 'OK'
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  const members = () => options.groups?.()?.groupDef?.(def.group)?.members || []
  // Absetzpunkte auf dem Papier: zwei Reihen à drei, im Papier-Raum gedreht
  function spots() {
    const n = members().length, half = (4.93 / 2) * sBox * GIFT.spotFrac, c = Math.cos(S.yaw), s = Math.sin(S.yaw), out = []
    for (let k = 0; k < n; k++) { const col = (k % 3) - 1, row = Math.floor(k / 3) - 0.5, lx = col * half * 0.8, lz = row * half * 0.9
      out.push({ x: S.at[0] + lx * c + lz * s, z: S.at[1] - lx * s + lz * c, yaw: S.yaw }) }
    return out
  }
  // Lage des Soldaten k zur Spurzeit tl (je stagger s versetzt): { scaleAll, y (m), ry (Grad) }
  const soldierPose = (k, tl) => { const v = nodeAt(spec, 'soldier', tl - k * (def.stagger ?? 0.3)); return { scaleAll: v.scaleAll ?? 1, y: (v.y ?? 0) * sU, ry: v.ry ?? 0 } }
  const landAt = (k) => 1.5 + k * (def.stagger ?? 0.3) // Spur soldier.y erreicht 0 bei 1,5 s
  const endAt = () => Math.max(restTime(spec), landAt(Math.max(0, members().length - 1)) + 0.6)

  function spawnAt(x = S.at[0], z = S.at[1], yawDeg = (S.yaw * 180) / Math.PI) {
    if (S.status !== 'OK') return false
    S.at = [x, z]; S.yaw = (yawDeg * Math.PI) / 180; S.t0 = options.clock(); S.active = true; S.done = false; S.fired.clear(); S.phase = null
    root.position.set(x, options.groundAt(x, z), z); root.rotation.set(0, S.yaw, 0); root.visible = true
    for (const id of ['present', 'unwrapped']) { const o = S.nodes[id], b = S.base[id]; o.scale.copy(b.s); o.rotation.copy(b.r); o.position.copy(b.p) }
    emit('reveal_start', { group: def.group }); return true
  }

  return {
    object3d: root, ready, spawnAt,
    update(dt) {
      giftLog.update++
      if (!S.active || S.status !== 'OK') return
      const tl = options.clock() - S.t0
      for (const id of ['present', 'unwrapped']) { const o = S.nodes[id], b = S.base[id], v = nodeAt(spec, id, tl)
        if ('visible' in v) o.visible = !!v.visible
        if (v.scale) o.scale.set(b.s.x * v.scale[0], b.s.y * v.scale[1], b.s.z * v.scale[2]); if (v.scaleAll != null) o.scale.copy(b.s).multiplyScalar(v.scaleAll)
        if (v.rz != null) o.rotation.z = b.r.z + THREE.MathUtils.degToRad(v.rz); if (v.y != null) o.position.y = b.p.y + v.y * sBox }
      const ph = phaseAt(spec, tl); if (ph !== S.phase) { S.phase = ph; if (ph === 'Antizipation') emit('reveal_anticipation') }
      const G = options.groups?.()
      if (tl >= 1.0 && !S.fired.has('pop')) { S.fired.add('pop'); emit('reveal_pop', { group: def.group })
        const sp = spots(); G?.revealGroup?.(def.group, { spots: sp.map((p, k) => ({ ...p, until: S.t0 + landAt(k) + 0.25 })), pose: (k, t) => soldierPose(k, t - S.t0), until: S.t0 + endAt() }) }
      members().forEach((m, k) => { if (tl >= landAt(k) && !S.fired.has('land' + k)) { S.fired.add('land' + k); emit('soldier_land', { k, id: m.id }) } })
      if (tl >= endAt() && !S.done) { S.done = true; emit('reveal_done', { group: def.group }) }
      if (S.done && G && G.isNear && !G.isNear(def.group)) { S.active = false; root.visible = false } // Kulisse weg, wenn der Trupp außer Blase/Bild ist
    },
    status: () => ({ status: S.status, error: S.error, active: S.active, done: S.done, phase: S.phase }),
    debug: () => ({ at: S.at.slice(), yaw: S.yaw, t: S.t0 == null ? null : +(options.clock() - S.t0).toFixed(3), phase: S.phase, box: S.nodes.present ? { visible: S.nodes.present.visible, scale: S.nodes.present.scale.toArray().map((v) => +(v / sBox).toFixed(3)), rz: +THREE.MathUtils.radToDeg(S.nodes.present.rotation.z).toFixed(2) } : null, paper: S.nodes.unwrapped ? S.nodes.unwrapped.visible : null, spots: spots() }),
    events: () => S.events.slice(),
    dispose() { giftLog.dispose++; root.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); [].concat(o.material).forEach((m) => m?.dispose()) } }); root.clear() },
  }
}
