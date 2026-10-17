// M1 · FrizzleBob in Bewegung: Modul nach Host-Vertrag R1.2 §2 (create(options) -> { object3d, update(dt, ctx), dispose() }).
// Figur = derselbe Darsteller-Slot und derselbe Code-Pfad wie auf der Bühne (actors/actorSlot.js → faceMountActor, V-206, V-240); der Slot
// lädt in der Bindepose (motion 'bind'), sein eigener Mixer bleibt ohne Aktion. Bewegung kommt aus dem Mixer des ActorAnimator:
//   Fortbewegung nach V-248 (ersetzt die festen LOCO-Anker): Gang-Mischer m1-gait (Aufbau wie ActorAnimator aus anim.mjs, cloudflare-live @e21e4904),
//   Abspielrate = Tempo / Eigentempo des Clips, Grenzen 0,8–1,25, außerhalb Clipwechsel; gemeinsame Gangphase mit Linksfuß-Versatz (Handover §3). Clips KayKit Character Animations 1.1
//   @378b2093 (Rig_Medium_MovementBasic Blob 98e965e8, Rig_Medium_General = Idle_A). G0: Skelett v5b = Rig_Medium (23 Knochen, Bindepose ≤ 0,03°).
//   Überblendungen nur für Sprung, Landung, Flug und Emotes (ActorAnimator.play als Overlay).
//   Maßstab: Die Figur steht mit recipe.stage.scale (0,947). LOCO-Tempi sind Rig-Einheiten → Tempo-Parameter = Weltgeschwindigkeit / scale.
//   Abweichung (offengelegt): Der Slot hat einen eigenen, leeren Mixer (motion 'bind'); anim.mjs sagt „exactly one AnimationMixer per actor“.
//   Es läuft nur der Mixer des ActorAnimator. Clip-Pakete lädt dieses Modul einmal je Adresse und teilt sie (clipCache).
// Blick führt (Briefing M1 Punkt 4), Reihenfolge Augen → Kopf → Körper:
//   Augen  – sofort: actor.lookAt(nx, ny) (Eye-Rig pointTo, vorhandene Schnittstelle; keine neue Augen-Logik). Die Pupillen folgen mit der Feder
//            des Eye-Rigs (150/13). Blinzeln, Lider, Leben laufen weiter.
//   Kopf   – folgt dem Ziel verzögert (headDelay) und gedämpft (headLag), begrenzt (headMaxDeg), als Drehung des Knochens „head“ NACH dem Mixer.
//            Die Drehung ist im Raum der Figur definiert und in den Raum des Elternknochens umgerechnet (auch bei Oberkörper-Neigung im Clip).
//            Vorläufig (WS0 §18.7 / F-5.1 offen).
//   Körper – dreht der Controller (ecctrl) am langsamsten; das Modul liest nur die Körperrichtung.
//   Blickziel = Bewegungsrichtung bzw. Kamera-Ziel (Port drive().gaze), im Flug der Horizont (gaze.y = 0).
// Kinetik: aus (G0 §18.6, P08 speist setKinetics nur über Regler). Ohren: Wind = −Geschwindigkeit macht der Slot selbst (earWind).
// Reihenfolge je Bild: Mixer (LOCO + Overlays) → Kopf-Schicht → actor.update (Gesicht, Lider, Ohren). Kein React, kein Store.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GaitAnimator, GAITS, gaitWeights } from './m1-gait'
import { soleOffsets, solePoints } from './m1-sole'
import { createActor } from '../actors/actorSlot'

export const M1LOCO = Object.freeze({
  headDelay: 0.06, headLag: 0.14, headMaxYawDeg: 50, headMaxPitchDeg: 20, eyeMaxDeg: 32, flyLeanDeg: 28, flyBankDeg: 22,
  fallMinTime: 0.15, fallMinVy: 1.2, landMinDrop: 0.35, // Fall erst nach 0,15 s ohne Boden und sinkend; Landung nur nach ≥ 0,35 m Fall (keine Rangstufen)
})
export const locoActorLog = { create: 0, update: 0, dispose: 0 }

// Clip-Pakete: einmal je Adresse laden, Animationen teilen, Szenen der Pakete sofort freigeben (sie werden nicht gezeigt)
const clipCache = new Map()
function loadClips(url) {
  if (!clipCache.has(url)) clipCache.set(url, new GLTFLoader().loadAsync(url).then((g) => {
    g.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); [].concat(o.material).forEach((m) => m?.dispose()) } })
    return g.animations
  }).catch((e) => { clipCache.delete(url); throw e }))
  return clipCache.get(url)
}

// options: { actor: Optionen des Darsteller-Slots (wie Stage FB, motion wird 'bind'), clipUrls: [Adressen der Clip-Pakete],
//            drive(): { speed, grounded, vy, y, flying, jumping, gaze: Vector3 (Welt) | null, turnRate } – liest der Host frisch je Aufruf }
export function createLocoActor(options) {
  locoActorLog.create++
  // Der Slot baut das Gesicht selbst in Weltdrehung 0 auf (faceMountActor @dde5ba2, Befund A15: facehost richtet den Halter an der Welt aus)
  const actor = createActor({ ...options.actor, motion: 'bind' })
  const W = options.actor.worldScale ?? 1, scale = (options.actor.recipe?.stage?.scale ?? 1) * W // V-345: Figur × worldScale → Tempo in Rig-Einheiten bleibt gleich
  const drive = options.drive || (() => ({ speed: 0, grounded: true, vy: 0, y: 0, flying: false }))
  const S = { anim: null, fig: null, head: null, headYaw: 0, headPitch: 0, hist: [], clock: 0, air: 'ground', airT: 0, offT: 0, peakY: 0, fly: false,
    status: 'LOADING', error: null, disposed: false, eyes: { nx: 0, ny: 0 }, lastSpeed: 0, flyLean: 0, flyBank: 0, inner: null, gazeOwn: false, headBase: null, headOut: null }
  const _q = new THREE.Quaternion(), _qa = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _qf = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _m = new THREE.Matrix4()

  const ready = (async () => {
    await actor.ready
    if (S.disposed) return
    if (actor.status().status !== 'OK') throw new Error('Darsteller: ' + actor.status().status + ' ' + (actor.status().error || ''))
    let fig = null; actor.object3d.traverse((o) => { if (!fig && /^figure · /.test(o.name)) fig = o })
    if (!fig) throw new Error('Figur im Slot nicht gefunden')
    fig.visible = false // bis der LOCO-Mixer steht: keine Bindepose (T-Pose) im Bild, wie der Slot für seinen Ruhe-Clip (V-214)
    const clips = {}
    for (const u of options.clipUrls || []) { const list = await loadClips(u); if (S.disposed) return; for (const c of list) if (!clips[c.name]) clips[c.name] = c }
    const need = ['Idle_A', ...GAITS.map((g) => g.clip), 'Jump_Start', 'Jump_Idle', 'Jump_Land', 'Jump_Full_Short', 'Jump_Full_Long']
    const missing = need.filter((n) => !clips[n]); if (missing.length) throw new Error('Clips fehlen: ' + missing.join(', '))
    S.soles = soleOffsets(THREE, fig) // Ferse/Ballen aus dem Netz, in der Bindepose (vor dem ersten Clip-Bild)
    S.anim = new GaitAnimator(fig, clips); S.fig = fig
    fig.traverse((o) => { if (!S.head && o.isBone && o.name === 'head') S.head = o })
    S.inner = fig.parent // „pose-root“ des Slots: Flug-Neigung hier, nicht am Körper des Controllers
    S.anim.update(0, 0); fig.visible = true
    S.status = 'OK'
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) }) // Figur bleibt dann verborgen (kein Ersatz)

  // Blickziel im Raum der Figur → Gier-/Nickwinkel (Figur schaut entlang lokal +Z)
  const anglesTo = (gazeWorld) => {
    actor.object3d.updateWorldMatrix(true, false)
    _m.copy(actor.object3d.matrixWorld).invert(); _v.copy(gazeWorld).transformDirection(_m)
    return [Math.atan2(_v.x, _v.z), Math.atan2(_v.y, Math.hypot(_v.x, _v.z))]
  }

  function airState(d, dt) {
    const A = S.anim, L = M1LOCO
    if (d.flying) {
      if (!S.fly) { S.fly = true; A.play('Jump_Idle', { mode: 'loop', fade: 0.25 }); actor.earImpulse?.('up') }
      S.air = 'fly'; return
    }
    if (S.fly) { S.fly = false; S.air = 'fall'; S.airT = 0; S.peakY = d.y ?? 0 } // nach dem Flug: Landung nach Fallhöhe entscheiden (Host meldet „Boden“ per Strahl)
    if (S.air === 'ground') {
      S.offT = d.grounded ? 0 : S.offT + dt
      // Sprung je Zustand (V-023; Lab travel-core.j17 Z. 165–171): Stand = Start/Luft/Landung, aus dem Joggen Jump_Full_Short, aus dem Sprint
      // Jump_Full_Long; der ganze Sprung-Clip läuft einmal, Abspielrate auf die Flugzeit (Ausholen 0,09 s + 2·v/g + 0,28 s wie im Lab)
      if (d.jumping) { const full = d.jumpKind === 'short' ? 'Jump_Full_Short' : d.jumpKind === 'long' ? 'Jump_Full_Long' : null
        if (full && A.has(full)) { const c = A.clips[full], air = 0.09 + 2 * (d.jumpV ?? 6.5) * (d.jumpKind === 'long' ? 1.15 : 1) / (d.g ?? 14) + 0.28; A.play(full, { mode: 'once', fade: 0.08, timeScale: c ? c.duration / Math.max(0.3, air) : 1 }); S.full = full }
        else { A.play('Jump_Start', { mode: 'once', fade: 0.08 }); S.full = null }
        S.air = 'up'; S.airT = 0; S.peakY = d.y ?? 0; actor.earImpulse?.('up') }
      else if (S.offT > L.fallMinTime && d.vy < -L.fallMinVy * W) { A.play('Jump_Idle', { mode: 'loop', fade: 0.2 }); S.air = 'fall'; S.airT = 0; S.peakY = d.y ?? 0 }
    } else if (S.air === 'up' || S.air === 'fall') {
      S.airT += dt; S.peakY = Math.max(S.peakY, d.y ?? 0)
      if (S.air === 'up' && !S.full && (A.progress('Jump_Start') > 0.95 || S.airT > 0.6)) { A.play('Jump_Idle', { mode: 'loop', fade: 0.12 }); S.air = 'fall' }
      if (d.grounded && S.airT > 0.1) {
        if (S.full) { A.stop(S.full, 0.18); S.full = null; actor.earImpulse?.('land') } // ganzer Sprung-Clip enthält die Landung
        else if (S.peakY - (d.y ?? 0) >= L.landMinDrop * W || S.air === 'up') { A.play('Jump_Land', { mode: 'once', fade: 0.08 }); actor.earImpulse?.('land') } else A.stop(null, 0.15)
        S.air = 'ground'; S.offT = 0
      }
    }
  }

  // Kopf-Schicht nach dem Mixer: Drehung R im Raum der Figur → lokal: L' = (A·R·A⁻¹)·L mit A = P⁻¹·F (P = Welt des Elternknochens, F = Welt der Figur).
  // Schreibt kein aktiver Clip den Kopf (Gewicht 0), steht dort noch unser Wert vom letzten Bild – dann von der letzten Clip-Haltung aus rechnen.
  function applyHead() {
    const H = S.head; if (!H || !H.parent) return
    if (S.headOut && H.quaternion.equals(S.headOut)) H.quaternion.copy(S.headBase); else (S.headBase ||= new THREE.Quaternion()).copy(H.quaternion)
    if (Math.abs(S.headYaw) < 1e-5 && Math.abs(S.headPitch) < 1e-5) { (S.headOut ||= new THREE.Quaternion()).copy(H.quaternion); return }
    H.parent.updateWorldMatrix(true, false); H.parent.getWorldQuaternion(_qp); S.fig.getWorldQuaternion(_qf)
    _qa.copy(_qp).invert().multiply(_qf) // A = P⁻¹·F
    _q.setFromEuler(_e.set(-S.headPitch, S.headYaw, 0, 'YXZ'))
    _q.premultiply(_qa).multiply(_qa.invert()) // A·R·A⁻¹
    H.quaternion.premultiply(_q); (S.headOut ||= new THREE.Quaternion()).copy(H.quaternion)
  }

  return {
    object3d: actor.object3d,
    bubbleAnchors: actor.bubbleAnchors,
    ready,
    actor,
    update(dt, ctx) {
      if (S.disposed) return
      locoActorLog.update++
      const d = drive()
      if (S.anim) {
        S.clock += dt
        airState(d, dt)
        const sp = d.flying ? 0 : Math.max(0, d.speed) / scale
        S.lastSpeed = sp
        S.anim.update(dt, sp)
        // Flug: Neigung nach vorn mit dem Tempo, Schräglage in Kurven (am pose-root des Slots, die Kapsel bleibt aufrecht)
        const tl = d.flying ? THREE.MathUtils.clamp((d.speed || 0) / 30, 0, 1) * M1LOCO.flyLeanDeg : 0
        const tb = d.flying ? THREE.MathUtils.clamp(d.turnRate || 0, -1, 1) * M1LOCO.flyBankDeg : 0
        const k = 1 - Math.exp(-6 * dt); S.flyLean += (tl - S.flyLean) * k; S.flyBank += (tb - S.flyBank) * k
        if (S.inner) S.inner.rotation.set(S.flyLean * Math.PI / 180, 0, -S.flyBank * Math.PI / 180)
        // Blick: Augen sofort (Feder des Eye-Rigs), Kopf verzögert + gedämpft, Körper (Controller) zuletzt
        const L = M1LOCO, D2R = Math.PI / 180
        let ty = 0, tp = 0, gaze = null
        if (d.gaze && d.gaze.lengthSq() > 1e-6) { gaze = anglesTo(d.gaze); ty = THREE.MathUtils.clamp(gaze[0], -L.headMaxYawDeg * D2R, L.headMaxYawDeg * D2R); tp = THREE.MathUtils.clamp(gaze[1], -L.headMaxPitchDeg * D2R, L.headMaxPitchDeg * D2R) }
        S.hist.push([S.clock, ty, tp]); while (S.hist.length > 2 && S.hist[1][0] <= S.clock - L.headDelay) S.hist.shift()
        const [, dy, dp] = S.hist[0][0] <= S.clock - L.headDelay ? S.hist[0] : [0, S.headYaw, S.headPitch] // Kopfziel = Ziel von vor headDelay
        const hk = 1 - Math.exp(-dt / L.headLag)
        S.headYaw += (dy - S.headYaw) * hk; S.headPitch += (dp - S.headPitch) * hk
        applyHead()
        if (gaze) {
          const ex = THREE.MathUtils.clamp((gaze[0] - S.headYaw) / (L.eyeMaxDeg * D2R), -1, 1), ey = THREE.MathUtils.clamp((gaze[1] - S.headPitch) / (L.eyeMaxDeg * D2R), -1, 1)
          S.eyes = { nx: ex, ny: ey }; S.gazeOwn = true; actor.lookAt(ex, ey)
        } else if (S.gazeOwn) { actor.lookAt(null); S.gazeOwn = false } // kein Ziel (z. B. Dialog führt den Blick): Augen nur einmal freigeben
      }
      actor.update(dt, ctx)
    },
    status: () => ({ status: S.status, error: S.error, actor: actor.status(), phase: S.anim ? +S.anim.phase.toFixed(6) : null, air: S.air, fly: S.fly, speedParam: +S.lastSpeed.toFixed(3), weights: gaitWeights(S.lastSpeed).w, ts: gaitWeights(S.lastSpeed).ts, overlay: S.anim?.current() ?? null, head: !!S.head, eyes: S.eyes, headYawDeg: +(S.headYaw * 180 / Math.PI).toFixed(2) }),
    // Messwerte der Wirkung (Test m1-eyes): echte Pupillen-Auslenkung des Eye-Rigs und Gier des Kopfknochens gegenüber der Figur (Grad)
    measure() {
      const R = actor.debugRig?.(), ex = R?.eyes?.length && R._max ? R.eyes.reduce((s, e) => s + (e?._px || 0), 0) / R.eyes.length / R._max : null
      let headDeg = null
      if (S.head && S.fig) { S.head.updateWorldMatrix(true, false); S.head.getWorldQuaternion(_qp); S.fig.getWorldQuaternion(_qf); _v.set(0, 0, 1).applyQuaternion(_qa.copy(_qf).invert().multiply(_qp)); headDeg = Math.atan2(_v.x, _v.z) * 180 / Math.PI }
      return { pupil: ex, headDeg }
    },
    // Weltlage von Ferse/Ballen je Fuß ({ 'foot.l': Vector3, 'toes.l', 'foot.r', 'toes.r' }) – für Bodenangleich und Messung
    soles: () => (S.soles ? solePoints(THREE, S.soles) : null),
    figureBones: (names) => { const out = {}, want = new Map(names.map((n) => [THREE.PropertyBinding.sanitizeNodeName(n), n])); actor.object3d.traverse((o) => { if (o.isBone && want.has(o.name)) out[want.get(o.name)] = o }); return out },
    lookAt: (nx, ny) => actor.lookAt(nx, ny),
    say: (t) => actor.say(t),
    speaking: () => actor.speaking?.(),
    blinkNow: () => actor.blinkNow(),
    debugRig: () => actor.debugRig?.(),
    dispose() { locoActorLog.dispose++; S.disposed = true; try { S.anim?.dispose() } catch (e) { /* weiter */ } actor.dispose() },
  }
}
