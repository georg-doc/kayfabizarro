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
import { STEP, interpTrack, M1CLOCK } from './m1Clock'
import { TERRAIN, terrainHeight, GROUND_Y } from '../modules/m1-terrain'
import { isFence } from './m1Host'
import { K, G, JUMP_K, MASS_K, INERTIA_K } from './m1Scale.js'
import { WORLD_K } from '../worldScale.js'
import { createElan, elanStep, elanCamera, elanSpeed, ELAN } from './elan.js'

export const HALF = 0.5 * K, RAD = 0.4 * K, FLOAT = 0.2 * K // V-345: alte Maße × K (m1Scale)
export const FOOT = HALF + RAD + FLOAT // Körpermitte über den Füßen
// Schwebe-Feder (ecctrl springK/dampingC): Standard 80/6 ist für die leichte Kapsel (≈ 0,77 kg) zu weich – bei der Landung federt sie ≈ 27 cm ein.
// 400/30 ≈ kritisch gedämpft (2·√(k·m) ≈ 35). Gilt je Physik-Schritt (ein Durchlauf je Schritt, m1Clock). Vorläufig.
export const M1SPRING = Object.freeze({ springK: 400 * MASS_K, dampingC: 30 * MASS_K }) // V-345: × K³ (Kapselmasse), gleiche Eigenfrequenz
// Körperdrehung (ecctrl autoBalance um die Hochachse): Standard 0,08/0,006 schwingt bei 90° um ≈ 28° über. Mehr Dämpfung, etwas weicher,
// damit der Körper nach Augen und Kopf ankommt und nicht pendelt. Vorläufig.
export const M1TURN = Object.freeze({ autoBalanceSpringOnY: 0.06 * INERTIA_K, autoBalanceDampingOnY: 0.018 * INERTIA_K, autoBalanceSpringK: 0.5 * INERTIA_K, autoBalanceDampingC: 0.03 * INERTIA_K }) // V-345: × K⁵ (Trägheit); Kipp-Feder = ecctrl-Standard × K⁵
// Tempi in m/s (Welt) nach V-020/V-248 (H = Klassenhöhe 2,2 m): W = Joggen 1,40 H/s = 3,08 · Shift+W = Sprint 2,22 H/s = 4,88 · Strg+W = Gehen =
// Eigentempo Walking_B auf FB 1,12. Alle innerhalb 0,8–1,25 ihres Clips (m1-gait); die Abspielrate folgt dem Tempo.
// V-345: Tempi und Längen × K, Absprung × JUMP_K (Sprunghöhe × K bei g 9,81); Zeiten (flyMinSteps) und Anteile bleiben
export const M1MOVE = Object.freeze({ walk: 1.12 * K, jog: 3.08 * K, run: 4.884 * K, flySlow: 15 * K, flyFast: 30 * K, flyLift: 9 * K, jumpVel: 6.5 * JUMP_K, landRay: 0.8 * K, flyMinSteps: 54, landDamp: 0.15 })
// Welt: Laufen endet am Fuß des Randwalls (hillR + 8 m), Fliegen am Netzrand (R − 25 m) und in 400 m Höhe; unter y −20 m zurück zum Start.
export const M1BOUNDS = Object.freeze({ walkR: TERRAIN.hillR + 8 * K, flyR: TERRAIN.R - 25 * K, flyMaxY: 400 * K, fallY: -20 * K }) // TERRAIN ist schon × K
// Kamera: nie unter das Gelände, nie in Theater-Wänden (Strahl Ziel → Kamera), Polarwinkel ≤ 1,45 rad. Standard-Neigung 1,15 rad, Brennweite 55°.
export const M1CAM = Object.freeze({ polar0: 1.15, maxPolar: 1.45, minClear: 0.6 * K, dist: 7.5 * K, distFly: 12 * K, fov: 55, pad: 0.3 * K, min: 1.5 * K, max: 40 * K, lookUp: 0.4 * K })
export const START = Object.freeze([0, GROUND_Y + FOOT + 0.3 * K, 30 * K]) // vor der offenen Seite des Theaters (+Z), Blick zur Bühne (−Z)
export const START_YAW = Math.PI
const GROUND_LIFT_MAX = 0.35 * K // Bodenangleich höchstens so weit (Feder hinkt am Hang nach, Kapsel streift im Flug, Stufenkanten)
const LIFT_UP = 0.05 * K, LIFT_DOWN = 0.02 * K // je Schritt höchstens so viel heben bzw. senken: kein Sprung der Figur gegen die Kapsel

// Eingabe: Tastatur (drei) oder – nur mit Debug-Schalter – ein Skript (M1INPUT.override)
export const M1INPUT = { override: null, mouse: null } // Tests: override = Tasten (ohne wow: kamerabezogen wie bisher), mouse = { l, r }
// WoW-Schema nach Lab-Vorlage (V-022/V-342; replies/donors/lab-walker-2026-10-16: main.ts Z. 307–357 und 532–535, walk-controller.js turnRate):
// ohne Maus A/D drehen die Figur (2,0 rad/s), Q/E strafen; RMB gehalten: A/D strafen, die Maus dreht Kamera UND Figur; LMB: nur Kamera; beide = vorwärts.
// Bewegung relativ zur Blickrichtung der Figur (ecctrl useCustomForward + lockForward), die Kamera folgt hinten nach. Sprünge je Zustand
// (travel-core.j17.js Z. 165–171): Stand = Start/Luft/Landung, aus dem Joggen Jump_Full_Short, aus dem Sprint Jump_Full_Long mit 1,15 × Absprung.
// Flug (V-342, Neubau freigegeben): Doppel-Leertaste < 400 ms hebt ab (einzeln nie, länger = zwei Sprünge); W in Blickrichtung der Figur (mit RMB
// steuert die Kameraneigung das Steigen), A/D drehen, Q/E strafen, Leertaste halten steigt, X halten sinkt, Shift Schub; Bodenkontakt landet.
export const M1WOW = Object.freeze({ turnRate: 2.0, camFollow: 8, doubleTapSteps: 24, longJump: 1.15, standJumpBelow: 0.4 * K })
// Elan S1 (Schwungflug, research/DRAGONRIDING_RESEARCH_R1.md §6): Hash flight=elan startet Flüge im Schwungflug (sonst Schwebeflug, G wechselt in der Luft);
// comfort = Komfortmodus von Anfang an (K schaltet). ELAN_MEM: Ladungen über Flüge hinweg, Ereignisse und Zustand für Anzeige und Tests.
const _h = typeof location !== 'undefined' ? location.hash : ''
const ELAN_START = /(^|[#,])flight=elan(,|$)/.test(_h), COMFORT0 = /(^|[#,])comfort(,|$)/.test(_h)
export const ELAN_MEM = { charges: null, events: [], state: null }
const NOKEYS = { forward: false, backward: false, leftward: false, rightward: false, jump: false, run: false, walk: false, strafeL: false, strafeR: false, descend: false }
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
  const S = useRef({ flying: false, flySteps: 0, lastYaw: null, turnRate: 0, camInit: false, frozen: false, hold: null, lift: 0, ctrl: false, camWant: M1CAM.dist,
    heading: START_YAW, lastSpace: -999, mouse: { l: false, r: false }, lock: null, jumpKind: null, longBoost: 0, wasGround: true, jumpHeld: false,
    flyMode: ELAN_START ? 'elan' : 'hover', elan: null, fov: M1CAM.fov, comfort: COMFORT0 })
  const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), gaze: new THREE.Vector3(), q: new THREE.Quaternion() }), [])
  const keys = () => (M1INPUT.override ? { ...NOKEYS, ...M1INPUT.override } : getKeys())
  const mod = useRef(null)
  useEffect(() => (holder.current ? interpTrack(holder.current) : undefined), []) // Figur-Halter: Bild-Interpolation (M1Loop)
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
      const hit = world.castShape(body.translation(), IDQ, vel, FLY_SHAPE, 0.02 * K, dt, true, rapier.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, body)
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
      if (S.current.flying) { gaze = v.gaze.set(lv.x, 0, lv.z); if (gaze.lengthSq() < 0.25 * K * K) { camera.getWorldDirection(gaze); gaze.y = 0 } } // Flug: Horizont
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
    return { speed: S.current.flying ? Math.hypot(lv.x, lv.y, lv.z) : planar, grounded, vy: S.current.frozen ? 0 : lv.y, y: p.y - FOOT, flying: S.current.flying, jumping, jumpKind: S.current.jumpKind, jumpV: M1MOVE.jumpVel, g: G, gaze, turnRate: S.current.turnRate }
  }, [camera, v, world, rapier])
  const actorOpts = useMemo(() => ({ actor: { ...actorOptions, position: [0, 0, 0], yaw: 0 }, clipUrls, drive }), [actorOptions, clipUrls, drive])
  const makeActor = useMemo(() => (o) => { const m = createLocoActor(o); mod.current = m; onMod?.(m); return m }, [onMod])

  // Doppel-Leertaste: zweiter Druck höchstens doubleTapSteps (400 ms Spielzeit) nach dem ersten → Abheben; einzeln nie
  const spaceTap = () => { const now = M1CLOCK.steps, S0 = S.current; if (S0.flying) { S0.lastSpace = -999; return }
    if (now - S0.lastSpace <= M1WOW.doubleTapSteps) { setFlying(true); S0.lastSpace = -999 } else S0.lastSpace = now }
  // Elan S1: Schwungflug-Zustand aus der aktuellen Lage und Bewegung (Tempo mindestens Gleittempo, Ladungen bleiben über Flüge hinweg)
  // liftOff: vom Boden mit Abriss-Tempo nach vorn und dem Steig-Impuls (§6.3 „Abheben plus Ascent-Impuls“, ohne Ladung); im Flug umgeschaltet: Tempo bleibt
  const elanOn = (liftOff = false) => { const b = ecctrl.current?.body; if (!b) return; const p = b.translation(), lv = S.current.flyVel || b.linvel(), J = K / WORLD_K
    const st = createElan({ pos: [p.x, p.y, p.z], yaw: S.current.heading, speed: liftOff ? ELAN.sStall : Math.max(22, Math.hypot(lv.x, lv.y, lv.z) / J), J, g: G })
    if (liftOff) st.v[1] = ELAN.ascentUp * J
    if (ELAN_MEM.charges != null) st.charges = ELAN_MEM.charges; S.current.elan = st; S.current.flyVel = null }
  const elanOff = () => { const st = S.current.elan; if (!st) return; ELAN_MEM.charges = st.charges; ELAN_MEM.state = null; S.current.flyVel = { x: st.v[0], y: st.v[1], z: st.v[2] }; S.current.elan = null; S.current.camWant = M1CAM.distFly; cam.current?.dollyTo(M1CAM.distFly, true) }
  const setFlying = (on) => {
    const b = ecctrl.current?.body; if (!b) return
    if (on && !S.current.flying) { b.setLinvel({ x: 0, y: M1MOVE.flyLift, z: 0 }, true); b.setGravityScale(0, true); S.current.flySteps = 0; S.current.flyVel = { x: 0, y: M1MOVE.flyLift, z: 0 } }
    if (!on) { if (S.current.elan) ELAN_MEM.charges = S.current.elan.charges; S.current.flyVel = null; S.current.elan = null; ELAN_MEM.state = null }
    if (on && S.current.flyMode === 'elan' && !S.current.elan) elanOn(true)
    S.current.flying = !!on; setViewSoon((x) => (x.flying === !!on ? x : { ...x, flying: !!on }))
  }
  const teleport = (p, yaw = null) => {
    const b = ecctrl.current?.body; if (!b) return
    b.setTranslation({ x: p[0], y: p[1], z: p[2] }, true); b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true)
    if (yaw != null) { b.setRotation(new THREE.Quaternion().setFromAxisAngle(UP, yaw), true); S.current.heading = yaw }
    S.current.lift = 0; S.current.landDamp = null // Bodenangleich und Landungs-Abdämpfen gelten für die alte Stelle nicht (Prüfer M1-3, Befund 11)
    if (S.current.frozen) { S.current.hold = { x: p[0], y: p[1], z: p[2] }; b.setGravityScale(0, true) } // eingefroren: diese Lage halten
  }
  useImperativeHandle(ref, () => ({
    // Strahl von oben auf alle Kollider (Gelände, Theater), eigener Körper ausgenommen → Höhe der Oberfläche (Tests)
    castDown: (x, z, from = 80) => { const hit = ray({ x, y: from, z }, from + 50); return hit ? from - hit.timeOfImpact : null },
    teleport, setFlying, flying: () => S.current.flying, spaceTap: () => spaceTap(), heading: () => S.current.heading, jumpKind: () => S.current.jumpKind, frozen: () => S.current.frozen, controllerOn: () => S.current.ctrl, handle: () => ecctrl.current, camera: () => cam.current,
    // Prüfwerte: Kapsel-Unterkante (Physik), Bodenangleich der Figur (Darstellung)
    capsuleBottom: () => { const b = ecctrl.current?.body; return b ? b.translation().y - HALF - RAD : null }, lift: () => S.current.lift,
    // Prüfwert (V-283, Prüfer M1-4 Befund 4): berührt die Kapsel gerade den Zaun um die Ränge? (Kontaktpunkte im aktuellen Schritt)
    fenceTouch: () => { const b = ecctrl.current?.body, c = b?.collider(0); if (!c) return false; let hit = false
      world.contactPairsWith(c, (o) => { if (!hit && isFence(o)) world.contactPair(c, o, (m) => { if (m.numContacts() > 0) hit = true }) }); return hit },
    // Prüfwert: Vorausschieben der Kapsel wie im Flug (flyClip) – Treffer und gekürzte Geschwindigkeit
    flyCast: (vel) => { const b = ecctrl.current?.body; if (!b) return null; const hit = world.castShape(b.translation(), IDQ, vel, FLY_SHAPE, 0.02 * K, STEP, true, rapier.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, b)
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
    if (e.code === 'Space') spaceTap() // Doppel-Leertaste < 400 ms hebt ab (V-024/V-179 (5)); die erste springt normal (ecctrl über MOVE_MAP)
    // G: am Boden Gehen ein/aus (V-331), in der Luft Schwebeflug ↔ Schwungflug (Elan S1, §6.3: „sofort, nur in der Luft“); K: Komfortmodus
    if (e.code === 'KeyG') { if (S.current.flying) { S.current.flyMode = S.current.flyMode === 'elan' ? 'hover' : 'elan'; if (S.current.flyMode === 'elan') elanOn(); else elanOff() } else S.current.walkToggle = !S.current.walkToggle; e.preventDefault() }
    if (e.code === 'KeyK') { S.current.comfort = !S.current.comfort; e.preventDefault() }
    if (e.code === ACTION_KEYS.reset) { setFlying(false); teleport(START, START_YAW); e.preventDefault() }
  }, PRIO.player)
  // Maustasten für das WoW-Schema (Lab main.ts Z. 420–422: Zustand aus der e.buttons-Maske, ein zweiter Knopf feuert kein pointerdown); Kontextmenü aus
  const gl = useThree((st) => st.gl)
  useEffect(() => { const el = gl.domElement, set = (e) => { S.current.mouse.l = !!(e.buttons & 1); S.current.mouse.r = !!(e.buttons & 2) }, ctx = (e) => e.preventDefault()
    el.addEventListener('pointerdown', set); el.addEventListener('pointermove', set); el.addEventListener('pointerup', set); el.addEventListener('contextmenu', ctx)
    return () => { el.removeEventListener('pointerdown', set); el.removeEventListener('pointermove', set); el.removeEventListener('pointerup', set); el.removeEventListener('contextmenu', ctx) } }, [gl])
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
      if (rel > 0.35 * K) continue
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
    if (!S.current.camInit) { cc.maxPolarAngle = M1CAM.maxPolar; cc.rotatePolarTo(M1CAM.polar0, false); cc.rotateAzimuthTo(Math.PI + START_YAW, false); cc.dollyTo(M1CAM.dist, false); S.current.camInit = true
      const ACT = cc.constructor?.ACTION; if (ACT) cc.mouseButtons.right = ACT.ROTATE } // RMB dreht die Kamera (und im WoW-Schema die Figur), nicht Verschieben
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
    const S0 = S.current, k = keys(), wow = !M1INPUT.override || !!M1INPUT.override.wow, mb = M1INPUT.mouse || S0.mouse
    // WoW-Schema: Blickrichtung der Figur (heading). RMB: Figur folgt der Kamera-Gierung, A/D strafen; sonst drehen A/D die Figur
    const strafeL = !!k.strafeL || (mb.r && !!k.leftward), strafeR = !!k.strafeR || (mb.r && !!k.rightward), turn = mb.r ? 0 : (k.leftward ? 1 : 0) - (k.rightward ? 1 : 0)
    if (wow && free) {
      if (mb.r) { camera.getWorldDirection(v.c); S0.heading = Math.atan2(v.c.x, v.c.z) } else S0.heading += turn * M1WOW.turnRate * STEP
      h.setForwardDir?.(v.b.set(Math.sin(S0.heading), 0, Math.cos(S0.heading)))
      // Kamera hinterher (Lab recenterView), solange keine Maustaste sie führt
      if (!mb.l && !mb.r && (turn || k.forward || k.backward || strafeL || strafeR || S0.flying)) { const want = S0.heading + Math.PI, az = cc.azimuthAngle, d = Math.atan2(Math.sin(want - az), Math.cos(want - az))
        cc.rotateAzimuthTo(az + d * (1 - Math.exp(-M1WOW.camFollow * STEP)), false) }
    } else if (free) { camera.getWorldDirection(v.c); v.c.y = 0; if (v.c.lengthSq() > 1e-6) h.setForwardDir?.(v.c.normalize()) } // Tests ohne wow: kamerabezogen wie bisher
    if (S0.lock !== wow) { h.setLockForward?.(wow); S0.lock = wow }
    S0.wow = wow; S0.turnKey = turn
    if (free && !S0.flying) {
      // Gehen (V-331 Punkt 7): G schaltet um (auf dem Mac ist Strg belegt); Tests setzen walk über M1INPUT. ecctrl kennt nur Gehen/Rennen – sein
      // Gehtempo ist Joggen, Gehen begrenzt post. Shift (Sprint) hat Vorrang.
      S0.walk = (S0.walkToggle || (!!M1INPUT.override && !!k.walk)) && !k.run
      const fwd = !!k.forward || (wow && mb.l && mb.r)
      // Sprung je Zustand (travel-core.j17 Z. 168): Kante der Leertaste am Boden → Art aus Tempo und Shift
      const jumpEdge = !!k.jump && !S0.jumpHeld; S0.jumpHeld = !!k.jump
      if (jumpEdge && h.isOnGround) { const lv = body.linvel(), sp = Math.hypot(lv.x, lv.z); S0.jumpKind = fwd && sp > M1WOW.standJumpBelow ? (k.run ? 'long' : 'short') : 'stand'; if (S0.jumpKind === 'long') S0.longBoost = 14 }
      if (wow) h.setMovement({ forward: fwd, backward: !!k.backward, leftward: strafeL, rightward: strafeR, run: !!k.run, jump: !!k.jump })
      else h.setMovement({ forward: k.forward, backward: k.backward, leftward: k.leftward, rightward: k.rightward, run: k.run, jump: k.jump })
    } else h.setMovement(NOKEYS)
  }

  // 4 · Nach ecctrl (letztes Wort vor dem nächsten Rapier-Schritt): Halten, Flug, Gehtempo, Landen, Kamera
  const post = () => {
    const h = ecctrl.current, cc = cam.current
    if (!h || !cc || !h.body) return
    const body = h.body, p = body.translation(), pos = v.a.set(p.x, p.y, p.z), free = state()
    if (!S.current.elan && Math.abs(S.current.fov - M1CAM.fov) > 0.01) { S.current.fov += (M1CAM.fov - S.current.fov) * (1 - Math.exp(-STEP / 0.25)); camera.fov = S.current.fov; camera.updateProjectionMatrix() } // nach dem Schwungflug zurück
    if (!free) {
      // eingefroren (Dialog) oder noch nicht geladen: ohne Schwerkraft auf der Stelle halten (ecctrls Impulse dieses Schritts überschrieben)
      body.setGravityScale(0, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      if (S.current.hold) body.setTranslation(S.current.hold, true)
    } else if (!S.current.flying) {
      // Weitsprung aus dem Sprint (travel-core.j17 Z. 169: Absprung × 1,15): in den ersten Schritten nach dem Absprung nachschieben
      // (ecctrl meldet in den ersten Schritten noch Bodenkontakt: Absprung am Steigen erkennen, nicht an isOnGround)
      // und ecctrl setzt während seiner Absprungphase das Steigtempo je Schritt neu – daher in jedem Schritt der Phase nachschieben)
      if (S.current.longBoost > 0) { S.current.longBoost--; const lv = body.linvel(), want = M1MOVE.jumpVel * M1WOW.longJump; if (lv.y > 1 * K && lv.y < want && h.jumpActive) body.setLinvel({ x: lv.x, y: want, z: lv.z }, true) }
      if (S.current.walk) { const lv = body.linvel(), hs = Math.hypot(lv.x, lv.z); if (hs > M1MOVE.walk) { const c = M1MOVE.walk / hs; body.setLinvel({ x: lv.x * c, y: lv.y, z: lv.z * c }, true) } }
      // weiches Aufsetzen nach dem Flug (V-331 Punkt 6, ≈ 0,15 s): das Resttempo der Landung blendet in das Tempo von ecctrl über, statt hart auf 0
      const L = S.current.landDamp
      if (L) { L.t += STEP; const k = Math.min(1, L.t / M1MOVE.landDamp), lv = body.linvel(); body.setLinvel({ x: L.x * (1 - k) + lv.x * k, y: lv.y, z: L.z * (1 - k) + lv.z * k }, true); if (k >= 1) S.current.landDamp = null }
    } else if (S.current.elan) {
      // Elan S1 (Schwungflug): elanStep rechnet Tempo, Bahn, Fähigkeiten und Ladungen; Bewegung über die Flug-Sperre flyClip (keine Wand-Durchflüge),
      // Landung wie im Schwebeflug (Strahl nach unten, Sinken gebremst). W/S Nase runter/hoch, A/D gieren, Leertaste Steigen (dann A/D binnen 150 ms =
      // Fassrolle), Shift Schub; RMB gehalten: Nase direkt aus der Kameraneigung.
      const k = keys(), S0 = S.current, st = S0.elan, mb = M1INPUT.mouse || S0.mouse, p0 = body.translation()
      st.pos = [p0.x, p0.y, p0.z]
      const cf = camera.getWorldDirection(v.b), camPitch = Math.asin(THREE.MathUtils.clamp(cf.y, -1, 1)) + (Math.PI / 2 - M1CAM.polar0)
      const env = { ground: (x, z) => terrainHeight(x, z) + FOOT, sweep: (from, d) => { const vel = flyClip(body, { x: d[0] / STEP, y: d[1] / STEP, z: d[2] / STEP }, STEP), c = [vel.x * STEP, vel.y * STEP, vel.z * STEP]
        const dx = d[0] - c[0], dy = d[1] - c[1], dz = d[2] - c[2], l = Math.hypot(dx, dy, dz); return { delta: c, hit: l > 1e-6, n: l > 1e-6 ? [-dx / l, -dy / l, -dz / l] : null } } }
      elanStep(st, { noseUp: !!k.backward, noseDown: !!k.forward, left: !!k.leftward, right: !!k.rightward, space: !!k.jump, shift: !!k.run, mousePitch: mb.r ? camPitch : null }, STEP, env)
      for (const e of st.events) ELAN_MEM.events.push({ ...e, t: M1CLOCK.steps })
      ELAN_MEM.charges = st.charges; ELAN_MEM.state = st; ELAN_MEM.comfort = S0.comfort
      const vel = { x: (st.pos[0] - p0.x) / STEP, y: (st.pos[1] - p0.y) / STEP, z: (st.pos[2] - p0.z) / STEP }
      body.setGravityScale(0, true); body.setLinvel(vel, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      S0.heading = st.yaw; body.setRotation(_qy.setFromAxisAngle(UP, st.yaw), true)
      S0.turnRate += (((k.leftward ? 1 : 0) - (k.rightward ? 1 : 0)) * 1.2 - S0.turnRate) * 0.15
      // Kamera-Kurve §6.6: FOV (Tempo + Stoß, Deckel 75, Komfort 55) über eine Feder von ≈ 0,25 s, Abstand mit dem Tempo
      const camC = elanCamera(st, { comfort: S0.comfort, fov0: M1CAM.fov, distFly: M1CAM.distFly })
      S0.fov += (camC.fov - S0.fov) * (1 - Math.exp(-STEP / 0.25)); if (Math.abs(camera.fov - S0.fov) > 0.01) { camera.fov = S0.fov; camera.updateProjectionMatrix() }
      if (Math.abs(camC.dist - S0.camWant) > 0.05 * K) { S0.camWant = camC.dist; cc.dollyTo(camC.dist, true) }
      S0.flySteps++
      if (S0.flySteps > M1MOVE.flyMinSteps && vel.y <= 0.5 * K && elanSpeed(st) < ELAN.sThrill * st.J && Math.hypot(pos.x, pos.z) <= M1BOUNDS.walkR) {
        const hit = ray(pos, FOOT + M1MOVE.landRay)
        if (hit) { const hs = Math.hypot(vel.x, vel.z), c = hs > M1MOVE.run ? M1MOVE.run / hs : 1, lx = vel.x * c, lz = vel.z * c
          body.setLinvel({ x: lx, y: Math.max(vel.y, -3 * K), z: lz }, true); body.setGravityScale(1, true); setFlying(false); S0.landDamp = { t: 0, x: lx, z: lz } }
      }
    } else {
      // Flug: eigene einfache Steuerung wie im Spike (Kamera-Richtung, Leertaste = hoch, Shift = schnell). Die Standard-Neigung der Folgekamera
      // zählt als waagrecht (sonst zieht W immer abwärts); steiler nach unten schauen = sinken. Überschreibt ecctrls Impulse dieses Schritts.
      const k = keys(), fdt = STEP, S0 = S.current, mb = M1INPUT.mouse || S0.mouse
      const cf = camera.getWorldDirection(v.b), camPitch = Math.asin(THREE.MathUtils.clamp(cf.y, -1, 1)) + (Math.PI / 2 - M1CAM.polar0)
      // WoW-Flug (V-342): Richtung = Blickrichtung der Figur; Steigen über Leertaste/X, mit RMB zusätzlich über die Kameraneigung. Tests ohne wow: wie bisher
      const yaw0 = S0.wow ? S0.heading : Math.atan2(cf.x, cf.z), pitch = S0.wow ? (mb.r ? camPitch : 0) : camPitch
      const fwd = v.b.set(Math.sin(yaw0) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw0) * Math.cos(pitch))
      const right = v.c.crossVectors(fwd, camera.up).normalize(), want = new THREE.Vector3()
      const fw = !!k.forward || (S0.wow && mb.l && mb.r), sl = S0.wow ? !!k.strafeL || (mb.r && !!k.leftward) : !!k.leftward, sr = S0.wow ? !!k.strafeR || (mb.r && !!k.rightward) : !!k.rightward
      if (fw) want.add(fwd); if (k.backward) want.sub(fwd); if (sr) want.add(right); if (sl) want.sub(right); if (k.jump) want.add(camera.up); if (k.descend) want.sub(camera.up)
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
      if (S.current.flySteps > M1MOVE.flyMinSteps && nv.y <= 0.5 * K && Math.hypot(pos.x, pos.z) <= M1BOUNDS.walkR) {
        const hit = ray(pos, FOOT + M1MOVE.landRay)
        // Aufsetzen: Sinken auf ≤ 3 m/s; das waagrechte Resttempo wird über landDamp (≈ 0,15 s) weich abgebaut (V-331 Punkt 6). Der frühere harte Halt
        // war nur wegen der Rangkante nötig – die Ränge sind seit V-283 gesperrt.
        // Flugtempo (15–30 m/s) nie auf den Boden mitnehmen: höchstens Sprinttempo, sonst pflügt die Kapsel in den Hang (m1-move landTerrain: −11 cm)
        if (hit) { const hs = Math.hypot(nv.x, nv.z), c = hs > M1MOVE.run ? M1MOVE.run / hs : 1, lx = nv.x * c, lz = nv.z * c
          body.setLinvel({ x: lx, y: Math.max(nv.y, -3 * K), z: lz }, true); body.setGravityScale(1, true); setFlying(false); S.current.landDamp = { t: 0, x: lx, z: lz } }
      }
    }
    // Kamera folgt; nie unter das Gelände, nie hinter eine Theater-Wand (Strahl vom Ziel zur Kamera auf alle Kollider). Im Dialog führt der Host.
    if (free || !active) cc.moveTo(pos.x, pos.y + M1CAM.lookUp, pos.z, true)
    if (free) {
      const c = camera.position, hmin = terrainHeight(c.x, c.z) + M1CAM.minClear
      if (c.y < hmin) cc.rotatePolarTo(Math.max(0.2, cc.polarAngle - 0.04), false)
      const tgt = cc.getTarget(v.b), dir = v.c.subVectors(c, tgt), d = dir.length()
      if (d > 0.5 * K) {
        dir.divideScalar(d)
        const cr = R.cam; cr.origin.x = tgt.x; cr.origin.y = tgt.y; cr.origin.z = tgt.z; cr.dir.x = dir.x; cr.dir.y = dir.y; cr.dir.z = dir.z
        const hit = world.castRay(cr, S.current.camWant, true, undefined, undefined, undefined, body, notFence)
        const lim = hit ? Math.max(M1CAM.min, hit.timeOfImpact - M1CAM.pad) : S.current.camWant
        if (Math.abs(lim - cc.distance) > 0.05 * K) cc.dollyTo(lim, true)
      }
    }
  }

  return (
    <>
      <OnFrame fn={follow} />
      <group ref={holder} name="m1-player-figure"><ModuleHost create={makeActor} options={actorOpts} /></group>
      <OnFrame fn={lift} />
      <OnFrame fn={pre} />
      <Ecctrl ref={ecctrl} position={START} rotation={[0, START_YAW, 0]} enable ccd useCustomForward
        capsuleHalfHeight={HALF} capsuleRadius={RAD} floatHeight={FLOAT}
        springK={M1SPRING.springK} dampingC={M1SPRING.dampingC} autoBalanceSpringOnY={M1TURN.autoBalanceSpringOnY} autoBalanceDampingOnY={M1TURN.autoBalanceDampingOnY} autoBalanceSpringK={M1TURN.autoBalanceSpringK} autoBalanceDampingC={M1TURN.autoBalanceDampingC}
        rayLength={RAD + 1 * K} rayHitForgiveness={0.28 * K} fallingMaxVel={20 * K}
        maxWalkVel={M1MOVE.jog} maxRunVel={M1MOVE.run} jumpVel={M1MOVE.jumpVel} fallingGravityScale={1.6} enableToggleRun={false} />
      <OnFrame fn={post} />
      <EcctrlCameraControls ref={cam} makeDefault smoothTime={0.12} minDistance={M1CAM.min} maxDistance={M1CAM.max} />
    </>
  )
})
export default M1Player
