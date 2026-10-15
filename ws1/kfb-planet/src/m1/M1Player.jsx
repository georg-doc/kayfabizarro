// M1 · Spielfigur: ecctrl 2.0.2 wie im Spike (Player.jsx), Figur = FrizzleBob v5b über den Darsteller-Slot (Modul m1-locoActor), kein KayKit-Barbar
// (hero.glb) und keine Hex-Bezüge (V-216). Host-Teil (React): Eingabe → setMovement() je Schritt, Flug (F, eigene einfache Steuerung wie Spike,
// ecctrl pausiert), Landen per Strahl, R = zurück zum Start, Kamera = EcctrlCameraControls (folgt beim Laufen und Fliegen).
// Bewegung liest drei-KeyboardControls (MOVE_MAP aus hostKeys, Falle 3); Aktionstasten nur über den Host-Router (useHostKeys, PRIO.player).
// Takt: ein Durchlauf je Physik-Schritt (m1Clock/M1Loop). Reihenfolge der Handler = Reihenfolge der Geschwister hier:
//   Folgen (Figur an die Kapsel, nach dem Rapier-Schritt) → Figur-Modul (ModuleHost) → Eingabe/Flug/Grenzen/Kamera → ecctrl → Kamera-Steuerung.
// Die Figur hängt NICHT unter der ecctrl-Kapsel: ecctrl kippt die Kapsel (autoBalance), die Figur bleibt senkrecht und übernimmt nur Lage und Gier.
import * as THREE from 'three'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { Ecctrl } from 'ecctrl'
import { EcctrlCameraControls } from 'ecctrl/camera'
import { useHostKeys, PRIO, ACTION_KEYS } from '../hostKeys'
import { playerState } from '../world'
import ModuleHost from '../ModuleHost'
import { createLocoActor } from '../modules/m1-locoActor'
import { STEP } from './m1Clock'
import { TERRAIN, terrainHeight } from '../modules/m1-terrain'
import { isFence } from './m1Host'

export const HALF = 0.5, RAD = 0.4, FLOAT = 0.2
export const FOOT = HALF + RAD + FLOAT // Körpermitte über den Füßen
// Schwebe-Feder (ecctrl springK/dampingC): Standard 80/6 ist für die leichte Kapsel (≈ 0,77 kg) zu weich – bei der Landung federt sie ≈ 27 cm ein.
// 400/30 ≈ kritisch gedämpft (2·√(k·m) ≈ 35). Gilt je Physik-Schritt (ein Durchlauf je Schritt, m1Clock). Vorläufig.
export const M1SPRING = Object.freeze({ springK: 400, dampingC: 30 })
// Körperdrehung (ecctrl autoBalance um die Hochachse): Standard 0,08/0,006 schwingt bei 90° um ≈ 28° über. Mehr Dämpfung, etwas weicher,
// damit der Körper nach Augen und Kopf ankommt und nicht pendelt. Vorläufig.
export const M1TURN = Object.freeze({ autoBalanceSpringOnY: 0.06, autoBalanceDampingOnY: 0.018 })
// Tempi in m/s (Welt) nach V-020/V-248 (H = Klassenhöhe 2,2 m): W = Joggen 1,40 H/s = 3,08 · Shift+W = Sprint 2,22 H/s = 4,88 · Strg+W = Gehen =
// Eigentempo Walking_B auf FB 1,12. Alle innerhalb 0,8–1,25 ihres Clips (m1-gait); die Abspielrate folgt dem Tempo.
export const M1MOVE = Object.freeze({ walk: 1.12, jog: 3.08, run: 4.884, flySlow: 15, flyFast: 30, flyLift: 9, jumpVel: 6.5, landRay: 0.8, flyMinSteps: 54 })
// Welt: Laufen endet am Fuß des Randwalls (hillR + 8 m), Fliegen am Netzrand (R − 25 m) und in 400 m Höhe; unter y −20 m zurück zum Start.
export const M1BOUNDS = Object.freeze({ walkR: TERRAIN.hillR + 8, flyR: TERRAIN.R - 25, flyMaxY: 400, fallY: -20 })
// Kamera: nie unter das Gelände, nie in Theater-Wänden (Strahl Ziel → Kamera), Polarwinkel ≤ 1,45 rad. Standard-Neigung 1,15 rad, Brennweite 55°.
export const M1CAM = Object.freeze({ polar0: 1.15, maxPolar: 1.45, minClear: 0.6, dist: 7.5, distFly: 12, fov: 55, pad: 0.3 })
export const START = Object.freeze([0, -0.125 + FOOT + 0.3, 30]) // vor der offenen Seite des Theaters (+Z), Blick zur Bühne (−Z)
export const START_YAW = Math.PI
const GROUND_LIFT_MAX = 0.35 // Bodenangleich höchstens so weit (Feder hinkt am Hang nach, Kapsel streift im Flug, Stufenkanten)
const LIFT_UP = 0.05, LIFT_DOWN = 0.02 // je Schritt höchstens so viel heben bzw. senken: kein Sprung der Figur gegen die Kapsel

// Eingabe: Tastatur (drei) oder – nur mit Debug-Schalter – ein Skript (M1INPUT.override)
export const M1INPUT = { override: null }
const NOKEYS = { forward: false, backward: false, leftward: false, rightward: false, jump: false, run: false, walk: false }
const _q = new THREE.Quaternion(), _qy = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0)
// Bild-Handler als eigenes Geschwister: React meldet Effekte von Geschwistern in Reihenfolge an, Kinder vor Eltern – ein useFrame im Körper von
// M1Player liefe NACH ecctrl. So steht die Reihenfolge im JSX.
function OnFrame({ fn }) { const r = useRef(fn); r.current = fn; useFrame(() => r.current()); return null }
// Strahlen sehen den Zaun um die Ränge nicht (V-283): er hält nur die Kapsel ab; Landung, Bodenangleich und Kamera richten sich nach dem Sichtbaren
const notFence = (c) => !isFence(c)
const yawOf = (r) => Math.atan2(2 * (r.w * r.y + r.x * r.z), 1 - 2 * (r.y * r.y + r.x * r.x))

const M1Player = forwardRef(function M1Player({ actorOptions, clipUrls, active = true, onMod }, ref) {
  const ecctrl = useRef(null), cam = useRef(null), holder = useRef(null)
  const { camera } = useThree()
  const { world, rapier } = useRapier()
  const [, getKeys] = useKeyboardControls()
  const [view, setView] = useState({ flying: false }) // nur für den Kamera-Abstand (React); alle Steuerung liest S und wirkt im selben Schritt
  const setViewSoon = (f) => queueMicrotask(() => setView(f)) // React-Zustand nie im Bild-Handler setzen (Vertrag Falle 2)
  const S = useRef({ flying: false, flySteps: 0, lastYaw: null, turnRate: 0, camInit: false, frozen: false, hold: null, lift: 0, ctrl: false, camWant: M1CAM.dist })
  const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), gaze: new THREE.Vector3(), q: new THREE.Quaternion() }), [])
  const keys = () => (M1INPUT.override ? { ...NOKEYS, ...M1INPUT.override } : getKeys())
  const mod = useRef(null)
  // ein Strahl je Zweck, wiederverwendet (Prüfer M1-4, Befund 12: mehrere Strahlen je Schritt)
  const R = useMemo(() => ({ down: new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), cam: new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }) }), [rapier])
  const ray = (from, len) => { const r = R.down; r.origin.x = from.x; r.origin.y = from.y; r.origin.z = from.z; return world.castRay(r, len, true, undefined, undefined, undefined, ecctrl.current?.body, notFence) }

  // Flug gegen Wände (Prüfer M1-4, Befund 5): Die Fluggeschwindigkeit ist eine eigene Größe und kannte keine Kontakte – nach einem Aufprall drückte
  // sie jeden Schritt wieder voll hinein (15 m/s: 18 cm in der Fläche, 30 m/s: durch den 2 m dicken Zaun). Daher je Schritt die Kapsel entlang der
  // Geschwindigkeit vorausschieben (castShape, alle festen Kollider inkl. Zaun, eigener Körper ausgenommen): Trifft sie etwas, wird der Anteil in die
  // Fläche hinein auf die Strecke bis zur Berührung gekürzt, der Rest gleitet entlang der Fläche. Zwei Durchgänge für Ecken.
  const FLY_SHAPE = useMemo(() => new rapier.Capsule(HALF, RAD), [rapier]), IDQ = { x: 0, y: 0, z: 0, w: 1 }
  const flyClip = (body, vel, dt) => {
    for (let pass = 0; pass < 2; pass++) {
      const hit = world.castShape(body.translation(), IDQ, vel, FLY_SHAPE, 0.02, dt, true, rapier.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, body)
      if (!hit) break
      // n = aus dem Hindernis heraus zur Kapsel; in rapier-compat 0.19 ist das normal1 (gemessen, scripts/m1/probe-fly.mjs: Außenwand bei +Z → normal1 = −Z)
      const n1 = hit.normal1, nx = n1.x, ny = n1.y, nz = n1.z, into = vel.x * nx + vel.y * ny + vel.z * nz
      if (into >= 0) break
      const cut = into - into * Math.min(1, Math.max(0, hit.time_of_impact / dt))
      vel = { x: vel.x - cut * nx, y: vel.y - cut * ny, z: vel.z - cut * nz }
    }
    return vel
  }

  // Port für das Modul: frisch gelesen je Aufruf. Das Modul läuft nach dem Rapier-Schritt und vor ecctrl: linvel = Tempo des eben gerechneten Schritts.
  const drive = useMemo(() => () => {
    const h = ecctrl.current, b = h?.body
    if (!b) return { speed: 0, grounded: true, vy: 0, y: 0, flying: false, gaze: null }
    const lv = b.linvel(), planar = Math.hypot(lv.x, lv.z), p = b.translation()
    let gaze = null
    if (!S.current.frozen) {
      if (S.current.flying) { gaze = v.gaze.set(lv.x, 0, lv.z); if (gaze.lengthSq() < 0.25) { camera.getWorldDirection(gaze); gaze.y = 0 } } // Flug: Horizont
      else if (h.inputDir && h.inputDir.lengthSq() > 0.01) gaze = v.gaze.copy(h.inputDir).setY(0) // Bewegungsrichtung (Eingabe) führt
      else { // sonst Kamera-Ziel – nur wenn es vor der Figur liegt; dahinter führt das „Leben“ der Augen
        camera.getWorldDirection(v.gaze); v.gaze.y *= 0.4
        const r = b.rotation(); v.c.set(0, 0, 1).applyQuaternion(v.q.set(r.x, r.y, r.z, r.w)).setY(0)
        gaze = v.c.lengthSq() > 1e-6 && v.c.normalize().dot(v.b.copy(v.gaze).setY(0).normalize()) > 0.17 ? v.gaze : null
      }
    }
    // Boden/Sprung: ecctrl läuft immer (Werte aktuell); im Dialog fest „am Boden“
    let grounded = !!h.isOnGround, jumping = !!h.jumpActive
    if (S.current.frozen) { grounded = true; jumping = false }
    if (!S.current.frozen && !S.current.flying && !grounded && lv.y > 1) jumping = true // Absprung auch erkennen, wenn ecctrl jumpActive schon zurückgesetzt hat
    return { speed: S.current.flying ? Math.hypot(lv.x, lv.y, lv.z) : planar, grounded, vy: S.current.frozen ? 0 : lv.y, y: p.y - FOOT, flying: S.current.flying, jumping, gaze, turnRate: S.current.turnRate }
  }, [camera, v, world, rapier])
  const actorOpts = useMemo(() => ({ actor: { ...actorOptions, position: [0, 0, 0], yaw: 0 }, clipUrls, drive }), [actorOptions, clipUrls, drive])
  const makeActor = useMemo(() => (o) => { const m = createLocoActor(o); mod.current = m; onMod?.(m); return m }, [onMod])

  const setFlying = (on) => {
    const b = ecctrl.current?.body; if (!b) return
    if (on && !S.current.flying) { b.setLinvel({ x: 0, y: M1MOVE.flyLift, z: 0 }, true); b.setGravityScale(0, true); S.current.flySteps = 0; S.current.flyVel = { x: 0, y: M1MOVE.flyLift, z: 0 } }
    if (!on) S.current.flyVel = null
    S.current.flying = !!on; setViewSoon((x) => (x.flying === !!on ? x : { ...x, flying: !!on }))
  }
  const teleport = (p, yaw = null) => {
    const b = ecctrl.current?.body; if (!b) return
    b.setTranslation({ x: p[0], y: p[1], z: p[2] }, true); b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true)
    if (yaw != null) b.setRotation(new THREE.Quaternion().setFromAxisAngle(UP, yaw), true)
    S.current.lift = 0 // Bodenangleich gilt für die alte Stelle nicht (Prüfer M1-3, Befund 11)
    if (S.current.frozen) { S.current.hold = { x: p[0], y: p[1], z: p[2] }; b.setGravityScale(0, true) } // eingefroren: diese Lage halten
  }
  useImperativeHandle(ref, () => ({
    // Strahl von oben auf alle Kollider (Gelände, Theater), eigener Körper ausgenommen → Höhe der Oberfläche (Tests)
    castDown: (x, z, from = 80) => { const hit = ray({ x, y: from, z }, from + 50); return hit ? from - hit.timeOfImpact : null },
    teleport, setFlying, flying: () => S.current.flying, frozen: () => S.current.frozen, controllerOn: () => S.current.ctrl, handle: () => ecctrl.current, camera: () => cam.current,
    // Prüfwerte: Kapsel-Unterkante (Physik), Bodenangleich der Figur (Darstellung)
    capsuleBottom: () => { const b = ecctrl.current?.body; return b ? b.translation().y - HALF - RAD : null }, lift: () => S.current.lift,
    // Prüfwert (V-283, Prüfer M1-4 Befund 4): berührt die Kapsel gerade den Zaun um die Ränge? (Kontaktpunkte im aktuellen Schritt)
    fenceTouch: () => { const b = ecctrl.current?.body, c = b?.collider(0); if (!c) return false; let hit = false
      world.contactPairsWith(c, (o) => { if (!hit && isFence(o)) world.contactPair(c, o, (m) => { if (m.numContacts() > 0) hit = true }) }); return hit },
    // Prüfwert: Vorausschieben der Kapsel wie im Flug (flyClip) – Treffer und gekürzte Geschwindigkeit
    flyCast: (vel) => { const b = ecctrl.current?.body; if (!b) return null; const hit = world.castShape(b.translation(), IDQ, vel, FLY_SHAPE, 0.02, STEP, true, rapier.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, b)
      return { hit: hit ? { toi: hit.time_of_impact, n1: hit.normal1, n2: hit.normal2, fence: isFence(hit.collider) } : null, clipped: flyClip(b, vel, STEP), pos: b.translation(), colliders: b.numColliders(), off: b.collider(0)?.translationWrtParent?.() ?? null } },
    // Kamera-Übergabe an den Host (Dialog, V-257): camera-controls schreibt die Kamera in JEDEM update() aus seinem eigenen Zustand (auch wenn
    // enabled = false); solange der Host eine andere Steuerung führt (StageOrbitCam), wird das update ausgesetzt, danach wieder eingesetzt.
    yieldCamera: (on) => { const cc = cam.current; if (!cc) return
      if (on && !S.current.camUpdate) { S.current.camUpdate = cc.update; cc.update = () => false; cc.enabled = false }
      if (!on && S.current.camUpdate) { cc.update = S.current.camUpdate; S.current.camUpdate = null; cc.enabled = true } },
    freeze: (on) => { S.current.frozen = !!on; S.current.hold = null; if (on) setFlying(false) },
  }))

  // F = abheben/landen (ohne Tastenwiederholung), R = zurück zum Start (nur im freien Spiel)
  useHostKeys((e) => {
    if (!active || S.current.frozen || !ecctrl.current || e.repeat) return
    if (e.code === ACTION_KEYS.fly) { setFlying(!S.current.flying); e.preventDefault() }
    if (e.code === ACTION_KEYS.reset) { setFlying(false); teleport(START, START_YAW); e.preventDefault() }
  }, PRIO.player)
  useEffect(() => { cam.current?.dollyTo(view.flying ? M1CAM.distFly : M1CAM.dist, true); S.current.camWant = view.flying ? M1CAM.distFly : M1CAM.dist }, [view.flying])

  // 1 · Folgen: Figur an die Kapsel (nach dem Rapier-Schritt), senkrecht, nur Gier. Bodenangleich stetig: nur anheben, wenn die Füße sonst unter der
  //     Oberfläche lägen (Feder hinkt am Hang nach, Kapsel streift im Flug) – nie nach unten, in der Luft über freiem Grund 0 (Prüfer M1-2, Befund 2/12).
  const follow = () => {
    const b = ecctrl.current?.body, g = holder.current; if (!b || !g) return
    const p = b.translation(), r = b.rotation(), feet = p.y - FOOT
    g.position.set(p.x, feet + S.current.lift, p.z); g.quaternion.setFromAxisAngle(UP, yawOf(r))
    playerState.pos.set(p.x, p.y, p.z)
  }
  // 2b · Bodenangleich NACH dem Figur-Modul (Pose dieses Schritts steht): nötiges Anheben aus der Oberfläche unter der Mitte und unter dem tieferen
  //      Sohlenpunkt (Ferse/Ballen aus dem Netz) je Fuß; nur nach oben, begrenzt, Raten je Schritt. Berücksichtigt bis 35 cm über der Figurwurzel – auch
  //      der schwingende Fuß, damit er nicht durch die Kante der nächsten Stufe geht (kein Fuß-IK: die Figur steigt dann als Ganzes etwas früher).
  const lift = () => {
    const b = ecctrl.current?.body, g = holder.current; if (!b || !g) return
    const p = b.translation(), feet = p.y - FOOT
    const hit = ray(p, FOOT + GROUND_LIFT_MAX)
    let need = hit ? p.y - hit.timeOfImpact - feet : 0
    const SP = mod.current?.status().status === 'OK' ? mod.current.soles() : null
    if (SP) for (const s of ['l', 'r']) {
      const pt = SP['foot.' + s].y < SP['toes.' + s].y ? SP['foot.' + s] : SP['toes.' + s], sy = pt.y - S.current.lift, rel = sy - feet
      if (rel > 0.35) continue
      const h2 = ray({ x: pt.x, y: p.y, z: pt.z }, FOOT + GROUND_LIFT_MAX); if (h2) need = Math.max(need, p.y - h2.timeOfImpact - sy)
    }
    const want = Math.min(GROUND_LIFT_MAX, Math.max(0, need)), cur = S.current.lift
    S.current.lift = want > cur ? Math.min(want, cur + LIFT_UP) : Math.max(want, cur - LIFT_DOWN)
    g.position.y = feet + S.current.lift; g.updateMatrixWorld(true)
  }

  // 3 · Vor ecctrl: Grenzen und Eingabe (setMovement). ecctrl läuft IMMER (enable fest an): Freigabe, Flug, Dialog-Halten und Gehtempo wirken nicht über
  //     React-Props (die kämen erst nach dem Bild an, Prüfer M1-3 Befund 1), sondern im selben Schritt – vor ecctrl über die Eingabe, nach ecctrl (post)
  //     über Geschwindigkeit, Schwerkraft und Lage des Körpers.
  const state = () => {
    const loaded = mod.current?.status().status === 'OK'
    const free = active && loaded && !S.current.frozen // Steuerung erst, wenn die Figur steht (Prüfer M1, Befund 20)
    S.current.ctrl = free && !S.current.flying
    return free
  }
  const pre = () => {
    const h = ecctrl.current, cc = cam.current
    if (!h || !cc || !h.body) return
    const body = h.body
    if (!S.current.camInit) { cc.maxPolarAngle = M1CAM.maxPolar; cc.rotatePolarTo(M1CAM.polar0, false); cc.rotateAzimuthTo(Math.PI + START_YAW, false); cc.dollyTo(M1CAM.dist, false); S.current.camInit = true }
    const p = body.translation(), pos = v.a.set(p.x, p.y, p.z), free = state()
    // Welt-Grenzen: Laufen am Fuß des Randwalls, Fliegen am Netzrand/in der Höhe, Absturz → Start; zu Fuß nicht in den Hang setzen
    { const rr = Math.hypot(pos.x, pos.z), R = S.current.flying ? M1BOUNDS.flyR : M1BOUNDS.walkR
      if (pos.y < M1BOUNDS.fallY) { setFlying(false); teleport(START, START_YAW) }
      else if (rr > R || (S.current.flying && pos.y > M1BOUNDS.flyMaxY)) {
        const k = Math.min(1, R / rr), lv = body.linvel(), nx = pos.x / rr, nz = pos.z / rr, out = Math.max(0, lv.x * nx + lv.z * nz), x = pos.x * k, z = pos.z * k
        const y = S.current.flying ? Math.min(pos.y, M1BOUNDS.flyMaxY) : Math.max(pos.y, terrainHeight(x, z) + FOOT)
        body.setTranslation({ x, y, z }, true)
        body.setLinvel({ x: lv.x - out * nx, y: S.current.flying && pos.y > M1BOUNDS.flyMaxY ? Math.min(0, lv.y) : lv.y, z: lv.z - out * nz }, true)
      } }
    if (free && !S.current.flying) {
      const k = keys()
      S.current.walk = !!k.walk && !k.run // Strg = Gehen: ecctrl kennt nur Gehen/Rennen – sein Gehtempo ist Joggen, Gehen begrenzt post
      h.setMovement({ forward: k.forward, backward: k.backward, leftward: k.leftward, rightward: k.rightward, run: k.run, jump: k.jump })
    } else h.setMovement(NOKEYS)
  }

  // 4 · Nach ecctrl (letztes Wort vor dem nächsten Rapier-Schritt): Halten, Flug, Gehtempo, Landen, Kamera
  const post = () => {
    const h = ecctrl.current, cc = cam.current
    if (!h || !cc || !h.body) return
    const body = h.body, p = body.translation(), pos = v.a.set(p.x, p.y, p.z), free = state()
    if (!free) {
      // eingefroren (Dialog) oder noch nicht geladen: ohne Schwerkraft auf der Stelle halten (ecctrls Impulse dieses Schritts überschrieben)
      body.setGravityScale(0, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      if (S.current.hold) body.setTranslation(S.current.hold, true)
    } else if (!S.current.flying) {
      if (S.current.walk) { const lv = body.linvel(), hs = Math.hypot(lv.x, lv.z); if (hs > M1MOVE.walk) { const c = M1MOVE.walk / hs; body.setLinvel({ x: lv.x * c, y: lv.y, z: lv.z * c }, true) } }
    } else {
      // Flug: eigene einfache Steuerung wie im Spike (Kamera-Richtung, Leertaste = hoch, Shift = schnell). Die Standard-Neigung der Folgekamera
      // zählt als waagrecht (sonst zieht W immer abwärts); steiler nach unten schauen = sinken. Überschreibt ecctrls Impulse dieses Schritts.
      const k = keys(), fdt = STEP
      const fwd = camera.getWorldDirection(v.b), pitch = Math.asin(THREE.MathUtils.clamp(fwd.y, -1, 1)) + (Math.PI / 2 - M1CAM.polar0), yaw0 = Math.atan2(fwd.x, fwd.z)
      fwd.set(Math.sin(yaw0) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw0) * Math.cos(pitch))
      const right = v.c.crossVectors(fwd, camera.up).normalize(), want = new THREE.Vector3()
      if (k.forward) want.add(fwd); if (k.backward) want.sub(fwd); if (k.rightward) want.add(right); if (k.leftward) want.sub(right); if (k.jump) want.add(camera.up)
      if (want.lengthSq() > 0) want.normalize().multiplyScalar(k.run ? M1MOVE.flyFast : M1MOVE.flySlow)
      const lv = S.current.flyVel || body.linvel(), f = 1 - Math.exp(-2.5 * fdt) // eigene Fluggeschwindigkeit (nicht die von ecctrl veränderte)
      const nv = flyClip(body, { x: lv.x + (want.x - lv.x) * f, y: lv.y + (want.y - lv.y) * f, z: lv.z + (want.z - lv.z) * f }, fdt)
      S.current.flyVel = nv
      body.setGravityScale(0, true); body.setLinvel(nv, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      if (nv.x * nv.x + nv.z * nv.z > 1) {
        const yaw = Math.atan2(nv.x, nv.z), r = body.rotation(), cur = _q.set(r.x, r.y, r.z, r.w)
        cur.slerp(_qy.setFromAxisAngle(UP, yaw), 1 - Math.exp(-6 * fdt)); body.setRotation(cur, true)
        if (S.current.lastYaw != null) { let d = yaw - S.current.lastYaw; d = Math.atan2(Math.sin(d), Math.cos(d)); S.current.turnRate += (d / fdt / 1.5 - S.current.turnRate) * 0.15 }
        S.current.lastYaw = yaw
      } else { S.current.turnRate *= 0.9; S.current.lastYaw = null; const r = body.rotation(); body.setRotation(_qy.setFromAxisAngle(UP, yawOf(r)), true) }
      // Landen per Strahl nach unten (eigener Körper ausgenommen), frühestens nach flyMinSteps, nur innerhalb der Laufgrenze. Kein Versetzen (sichtbarer
      // Sprung): Sinken auf ≤ 3 m/s bremsen; ecctrl fängt im nächsten Schritt mit der Schwebe-Feder ab.
      S.current.flySteps++
      if (S.current.flySteps > M1MOVE.flyMinSteps && nv.y <= 0.5 && Math.hypot(pos.x, pos.z) <= M1BOUNDS.walkR) {
        const hit = ray(pos, FOOT + M1MOVE.landRay)
        // Aufsetzen = Anhalten (waagrecht 0): Mit Resttempo schob sich die Kapsel nach der Landung auf den Rängen unter eine überstehende Stufenkante
        // (Sonde probe-landranks: −19 cm). Weiterlaufen geht sofort mit der Eingabe.
        if (hit) { body.setLinvel({ x: 0, y: Math.max(nv.y, -3), z: 0 }, true); body.setGravityScale(1, true); setFlying(false) }
      }
    }
    // Kamera folgt; nie unter das Gelände, nie hinter eine Theater-Wand (Strahl vom Ziel zur Kamera auf alle Kollider). Im Dialog führt der Host.
    if (free || !active) cc.moveTo(pos.x, pos.y + 0.4, pos.z, true)
    if (free) {
      const c = camera.position, hmin = terrainHeight(c.x, c.z) + M1CAM.minClear
      if (c.y < hmin) cc.rotatePolarTo(Math.max(0.2, cc.polarAngle - 0.04), false)
      const tgt = cc.getTarget(v.b), dir = v.c.subVectors(c, tgt), d = dir.length()
      if (d > 0.5) {
        dir.divideScalar(d)
        const cr = R.cam; cr.origin.x = tgt.x; cr.origin.y = tgt.y; cr.origin.z = tgt.z; cr.dir.x = dir.x; cr.dir.y = dir.y; cr.dir.z = dir.z
        const hit = world.castRay(cr, S.current.camWant, true, undefined, undefined, undefined, body, notFence)
        const lim = hit ? Math.max(1.5, hit.timeOfImpact - M1CAM.pad) : S.current.camWant
        if (Math.abs(lim - cc.distance) > 0.05) cc.dollyTo(lim, true)
      }
    }
  }

  return (
    <>
      <OnFrame fn={follow} />
      <group ref={holder} name="m1-player-figure"><ModuleHost create={makeActor} options={actorOpts} /></group>
      <OnFrame fn={lift} />
      <OnFrame fn={pre} />
      <Ecctrl ref={ecctrl} position={START} rotation={[0, START_YAW, 0]} enable ccd
        capsuleHalfHeight={HALF} capsuleRadius={RAD} floatHeight={FLOAT}
        springK={M1SPRING.springK} dampingC={M1SPRING.dampingC} autoBalanceSpringOnY={M1TURN.autoBalanceSpringOnY} autoBalanceDampingOnY={M1TURN.autoBalanceDampingOnY}
        maxWalkVel={M1MOVE.jog} maxRunVel={M1MOVE.run} jumpVel={M1MOVE.jumpVel} fallingGravityScale={1.6} enableToggleRun={false} />
      <OnFrame fn={post} />
      <EcctrlCameraControls ref={cam} makeDefault smoothTime={0.12} minDistance={1.5} maxDistance={40} />
    </>
  )
})
export default M1Player
