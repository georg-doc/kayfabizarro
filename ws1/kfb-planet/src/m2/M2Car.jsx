// M2 · G0 Fahren übers Gelände (V-313), zweite Fahrprobe: echtes Fahrzeug 02 Flammen-Dragster v3 (V-315/V-321, Asset-Branch @9bd8e037,
// crimson_flame_dragster.kfb-vehicle.v3.json). Zwei Kandidaten im Vergleich, Taste C wechselt an Ort und Stelle, die aktive Fahrphysik steht groß
// oben mittig (Georg 16.10.).
//   A · ecctrl = EcctrlVehicle (ecctrl 2.0.2, Rapier-Starrkörper). Der Dragster ist ein Schwebe-Fahrzeug („locomotion: hover“, keine Räder): vier
//               unsichtbare ShapeCastWheels an den Schwebepunkten kfb_hover_* (WS0-Vorschlag), Fahrhöhe als Laufzeitwert. Feste Masse mit tiefem
//               Schwerpunkt (sonst kippte der Kasten schon bei 17 m/s), Lenkwinkel mit dem Tempo kleiner (wie k2b), ohne Gas sanft ausrollen.
//   B · k2b    = J17-Fahrphysik k2b frei auf dem Gelände (k2t.js), kinematisch, mit Hangabtrieb; Hang ist keine Wand mehr.
// Maßstab: GLB in KayKit-Rig-Einheiten wie die Figuren; Welt = Rig × FB-Bühnenmaß × K (V-345: FB 1,81 m, J17-Meter). Fahrzeug ≈ 4,97 m lang.
// Tasten (Folgetasten des Hosts): W/S Gas/rückwärts, A/D lenken, Q/E driften (B, V-347), Leertaste = Handbremse (A) bzw. Sprung (B), R = zurück an den
// Start, C = wechseln. ecctrl ist seit V-367 eingefroren (Vergleich in der Vorschau, keine neue Arbeit).
import * as THREE from 'three'
import { useCallback, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EcctrlVehicle, ShapeCastWheel } from 'ecctrl/vehicle'
import { useHostKeys } from '../hostKeys'
import { expose, DEBUG } from '../debug'
import { M1INPUT, ELAN_MEM } from '../m1/M1Player'
import { isFence, inRankFence } from '../m1/m1Host'
import { STEP, interpTrack, M1INTERP, M1CLOCK } from '../m1/m1Clock'
import { createFollowCam } from '../camera/followCam'
import { VEHICLE_COMMIT } from '../modules/vehicleLineup'
import fbRecipe from '../data/actors/frizzlebob-v5b.recipe.json'
import { createK2t, stepK2t, SQUASH_LOOK, attitude, ATT, LAND, STUCK, ASSIST_M3, PUSH, RIDE, TRICK } from './k2t'
import { attachTumble } from '../vendor/deformer/vehicle-tumble.v1.js'
import { attachFishtail } from '../vendor/deformer/vehicle-fishtail.v1.js'
import { rampZone } from '../m3/stuntData.js'
import { createDeformer } from '../vendor/deformer/vehicle-cartoon-deformer.v2.js'
import DEFORM_PROFILES from '../vendor/deformer/deformer-profiles.json'
import VEHICLE_RIG from '../data/vehicles/kfb-vehicle-rig.r1.json'
import { mountRacerRig } from './racerRig'
import { terrainHeight } from '../modules/m1-terrain'
import { K, G } from '../m1/m1Scale.js'
import { WORLD_K } from '../worldScale.js'
import { createRacerFlight, racerFlightStep, racerAfterK2t, racerDrive } from './racerFlight.js'

// ── Fahrzeug (aus <racer>.kfb-vehicle.v3.json über kfb-vehicle-rig.r1.json, Rig-Einheiten × S) ─────────────────────────────────────────────────────────────────
const S = (fbRecipe.stage?.scale ?? 0.947) * K // V-345: Rig × 0,947 × K = Rig × M_PER_RIG (J17-Meter, wie FB)
const R = (a) => a.map((v) => +(v * S).toFixed(4))
// Fahrzeug-Rigging R1a (V-481): Racer-Wahl #m1,car,racer=<id> aus Georgs 6er-Auswahl (kfb-vehicle-rig.r1.json: Maße, Schwebepunkte, Kamera, Düsen-Anker,
// Antriebsfarben aus dem Fahrzeug); ohne Angabe der Flammen-Dragster wie bisher. Alle sechs schweben (keine Räder), Fahrphysik für alle gleich (Georg 18.10.).
const RACER_ID = (() => { const m = /(^|[#,])racer=(\w+)/.exec(typeof location !== 'undefined' ? location.hash : ''); return m && VEHICLE_RIG.vehicles[m[2]] ? m[2] : 'crimson_flame_dragster' })()
export const RACER = VEHICLE_RIG.vehicles[RACER_ID]
export const M2CAR = {
  id: RACER_ID,
  url: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${VEHICLE_COMMIT}/${RACER.path}`,
  box: { c: R(RACER.box.c), h: R(RACER.box.h) }, // collision_hints.body_box
  hover: RACER.hover.map(R), // FL FR RL RR (front = +Z)
  cam: { pos: R(RACER.cam.pos), target: R(RACER.cam.target) }, // kfb_camera_follow
  spawn: [8 * K, 3 * K, 34 * K], yaw: Math.PI / 2,
}
// Fahrhilfe und Fahrwerk als EIN Tuning-Objekt (V-313, V-151; später im God-Mode stellbar)
export const M2TUNE = {
  rideHeight: 0.7 * S, // m Unterseite über Boden (JSON: Laufzeitwert, Vorschlag 0,52–0,90 Rig)
  // V-345 (ecctrl eingefroren, V-367): nur maßstabsgerecht umgerechnet – Masse/Federn × K³, Längen × K, Motor × K⁴, Lenk-Abfall / K; nicht neu abgestimmt
  mass: 12 * K ** 3, comY: 0.45 * K, // kg, Schwerpunkt m über der Unterseite (tief: kippt nicht so leicht)
  spring: 300 * K ** 3, damp: 42 * K ** 3, hoverR: 0.3 * K, travel: 0.8 * K, // ShapeCastWheel springK/dampingC/rayShapeR/rayLength: Ruhe-Einfederung ≈ m·g / (4·k) ≈ 0,14 m, gut gedämpft
  hp: 25 * K ** 4, gear: 7, grip: 1.3, // Motor, eine Übersetzung (Höchsttempo ≈ 31 m/s), Haftung (weniger = rutscht statt kippt)
  steerFall: 0.06 / K, // Lenkeinschlag × 1 / (1 + v · steerFall) – wie k2b speedFactor
  coast: 0.6, // 1/s Ausrollen ohne Gas (waagrecht); unter 0,8 m/s auf flachem Boden hält die Bremse
  antiRoll: 10, antiRollDamp: 3, airYaw: 1.6, airPitch: 1.2, airDamp: 1.5,
  rightAfter: 0.35, rightRate: 4, rightLift: 3 * K,
}
const H = typeof location !== 'undefined' ? location.hash : ''
export const M2_ON = /#m1\b.*\bcar\b/.test(H) // #m1,car[=ecctrl|k2b] · assist=off: Fahrhilfe M3 zu Beginn aus
// Elan S2: Racer-Flug nur mit Schalter fly (#m1,car,fly) – ohne ihn bleibt K2B unverändert (run-all 18.10.: Rampen-Launch m3-f und Zwei-Rad m3-g
// gerieten über das takeoff-Ereignis in den Flug)
export const RACER_FLY = M2_ON && /[#,]fly(,|$)/.test(H)
if (/(^|[#,])assist=off(,|$)/.test(H)) ASSIST_M3.on = false
// Ereignis-Abos (railImpact/landing/takeoff, Namen wie vehicle-cartoon-deformer.v2) für Squash, VFX, später Stunts (§55): M2EVENTS.on(type, fn) → abmelden
export const M2EVENTS = { subs: new Map(), on(type, fn) { const l = this.subs.get(type) || new Set(); l.add(fn); this.subs.set(type, l); return () => l.delete(fn) }, emit(e) { this.subs.get(e.type)?.forEach((fn) => fn(e)); this.subs.get('*')?.forEach((fn) => fn(e)) } }
export const M2STATE = { kind: /car=ecctrl/.test(H) ? 'ecctrl' : 'k2b', // Start mit B (Georgs Tendenz 16.10.), A per C als Gegenprobe
  resets: 0, switches: 0, rightStarts: 0, model: 'LOADING' }
// Label nach V-367 („Fahrsystem: K2B | ecctrl“, Abnahmepunkt; weg erst beim M2-Merge mit Georgs Zustimmung): aktives System kräftig, das andere blass
const LABEL = (kind) => ['k2b', 'ecctrl'].map((k) => `<span style="opacity:${k === kind ? 1 : 0.35}">${k === 'k2b' ? 'K2B' : 'ecctrl'}</span>`).join(' | ')
// Fahr-Tasten im Info-Symbol (V-347 (4)), unter der M1-Liste; ecctrl ist eingefroren (V-367), Drift und Wendehilfe nur in K2B
const CAR_KEYS = '<b>Auto</b><br>W · Gas &nbsp;·&nbsp; S · bremsen / rückwärts &nbsp;·&nbsp; A D · lenken (langsam: enge Wende)<br>Q E · driften links / rechts (K2B, ab 4,9 m/s)<br>Shift · Boost (K2B) &nbsp;·&nbsp; Leertaste · springen (K2B)<br>im Sprung Leertaste + A/D · Fassrolle &nbsp;·&nbsp; X + A/D · auf zwei Rädern (ab 6 m/s, mit Fahrhilfe)<br>M · Fahrhilfe M3 an/aus (Landen, Lage, Nie-festfahren, Rampen- und Wandzonen) bzw. Handbremse (ecctrl)<br>R · zurück an den Start &nbsp;·&nbsp; C · Fahrsystem wechseln'
const RACER_KEYS = '<br><b>Racer fliegt</b> (K2B): Rampe ab 20 m/s oder in der Luft Leertaste doppelt<br>W · Schub &nbsp;·&nbsp; S · Luftbremse &nbsp;·&nbsp; ↑ ↓ · Nase (oder rechte Maustaste halten) &nbsp;·&nbsp; Leertaste · steigen (+ A/D · Fassrolle)<br>Shift · Boost aus dem Kessel (leer: kocht 1,5 s) &nbsp;·&nbsp; landet von selbst knapp über dem Boden'
const NOKEYS = { forward: false, backward: false, leftward: false, rightward: false, jump: false, run: false, walk: false }
const OnFrame = ({ fn }) => { useFrame(fn); return null }

// Modell einmal laden (geteilt), je Auto ein Klon; bis dahin ein Kasten in Rumpfgröße
let modelPromise = null
const loadModel = () => (modelPromise ||= new GLTFLoader().loadAsync(M2CAR.url).then((g) => { M2STATE.model = 'OK'; g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } }); return g.scene }).catch((e) => { M2STATE.model = 'ERROR ' + e.message; return null }))
// M3 Stufe E (V-379): Deformer v2 (lab-v7 vehicle-cartoon-deformer.v2.js 1:1, kayfabizarro main @904f0e959), Profil CAR_CHILL_LIGHT. Er schreibt nur in
// eigene Knoten unter der Darstellung (Shell-Gruppe), nie in den Starrkörper – die Kollider-Lage bleibt unverändert. Eingang: K2B-Signale je Schritt
// (setSignals) und die Ereignisse railImpact/landing (M2EVENTS). Mit Fahrhilfe aus: Knet-Squash wie M2 (J17 SQUASH_LOOK).
// Zwei-Rad an der Wand (Stufe F, lab-v7 vehicle-twowheel.v1.js deriveTwoWheel): Umfallwinkel = atan(halbe Breite / Schwerpunkthöhe der Hülle),
// Haltewinkel wallride = Umfall + (90° − Umfall) × 0,45. Drehpunkt = Aufstandslinie auf der wandfernen Seite: die wandseitigen Räder heben ab, die
// Unterseite zeigt zur Wand (so ragt die gekippte Hülle nicht in die Wand; das Tempo „trägt“ wie an der Steilwand). Nur Darstellung, der Kollider kippt nicht.
const TW = (() => { const cx = M2CAR.box.h[0], cg = M2CAR.box.c[1], tip = Math.atan(cx / cg); return { contactX: cx, tipDeg: +(tip * 180 / Math.PI).toFixed(1), hold: tip + (Math.PI / 2 - tip) * 0.45 } })()
RIDE.leanRad = TW.hold
TRICK.freeLeanRad = (TW.tipDeg * Math.PI / 180) * 0.92 // Zwei-Rad frei: TIP_SAFETY 0,92 des Umfallwinkels (vehicle-twowheel.v1.js)
export const DEFORM = { profile: DEFORM_PROFILES.profiles.CAR_CHILL_LIGHT, last: null }
// Stufe G: Fassrolle und Schlingern als eigene Gruppen über der Darstellung (lab-v7, 1:1). Unser Schwebewagen hat keine Räder: die vier Schwebepunkte
// (M2CAR.hover) stehen für die Radlage (Aufstandslinie, Vorderachse als Drehpunkt des Schlingerns). Lesewerte für Tests in TRICKS.
const NOSE = { upArrow: false, downArrow: false, rmb: false } // Elan S2: Nasen-Eingabe des Racers im Flug
export const TRICKS = { tumble: null, fish: null, touchdowns: 0, recovers: 0, triggered: 0 }
const TRICK_RIG_WHEELS = M2CAR.hover.map(([x, y, z], i) => ({ centre: { x, y, z }, width: 0.3 * S, end: i < 2 ? 'zPlus' : 'zMinus' }))
function CarVisual({ squash, signals, lean }) {
  const g = useRef(null), tilt = useRef(null), trick = useRef(null), body = useRef(null), [model, setModel] = useState(null), def = useRef(null)
  useEffect(() => { if (!signals || !g.current || !body.current || !tilt.current) return
    const rig = { group: g.current, body: body.current, wheels: TRICK_RIG_WHEELS, frame: { height: M2CAR.box.c[1] + M2CAR.box.h[1], length: M2CAR.box.h[2] * 2, width: M2CAR.box.h[0] * 2, contactY: 0 }, report: { track: M2CAR.hover[0][0] * 2, wheelWidth: 0.3 * S } }
    const host = tilt.current; host.remove(g.current)
    const F = attachFishtail({ THREE, rig, profile: DEFORM.profile, facing: 1 }), T = attachTumble({ THREE, rig, profile: DEFORM.profile, facing: 1, child: F.root }); host.add(T.root)
    const hideMarks = () => T.root.traverse((o) => { if (o.isLine || o.isLineSegments) o.visible = false }) // Lab-Hilfslinien (Achsen, Anker) nicht im Spiel
    hideMarks(); trick.current = { T, F, hideMarks, side: 1 }
    const _q = new THREE.Quaternion(), _u = new THREE.Vector3(); TRICKS.bodyUpY = () => { body.current?.getWorldQuaternion(_q); return _u.set(0, 1, 0).applyQuaternion(_q).y } // Prüfwert: Karosserie aufrecht?
    const off = M2EVENTS.on('trick', (e) => { if (!ASSIST_M3.on) return
      if (e.kind === 'tumble') { T.trigger({ severity: 0.7, speed: e.speed, side: e.side }); hideMarks(); TRICKS.triggered++; trick.current.side = e.side }
      if (e.kind === 'recover') { F.trigger({ severity: 0.8, dir: e.side }); TRICKS.recovers++ } })
    return () => { off(); trick.current = null; host.remove(T.root); F.dispose?.(); T.dispose?.(); host.add(g.current) } }, [signals])
  useEffect(() => { if (!signals || !g.current || !body.current) return
    const D = createDeformer(THREE, { group: g.current, body: body.current, wheels: [], frame: { height: M2CAR.box.h[1] * 2, length: M2CAR.box.h[2] * 2, width: M2CAR.box.h[0] * 2 } }, { profile: DEFORM.profile })
    def.current = D; const offs = [M2EVENTS.on('railImpact', (e) => ASSIST_M3.on && D.railImpact(e)), M2EVENTS.on('landing', (e) => ASSIST_M3.on && D.landing(e))]
    return () => { offs.forEach((f) => f()); D.dispose?.(); def.current = null } }, [signals])
  useFrame(() => { const D = def.current, X = trick.current
    if (X) { const r = X.T.update(STEP); if (r.event === 'touchdown') { TRICKS.touchdowns++; D?.landing({ strength: r.strength }) } if (r.event === 'recover') { X.F.trigger({ severity: 0.8, dir: X.side || 1 }); TRICKS.recovers++ } X.hideMarks()
      TRICKS.tumble = { active: r.active, phase: r.phase, rollDeg: r.rollDeg, turns: r.turns }; const f = X.F.update(STEP); TRICKS.fish = { active: f.active, yawDeg: f.yawDeg } }
    if (tilt.current) { const a = lean?.() ?? 0, px = -Math.sign(a) * TW.contactX; tilt.current.rotation.z = a; tilt.current.position.set(px - px * Math.cos(a), -px * Math.sin(a), 0) } // Drehung um die Aufstandslinie
    if (D && ASSIST_M3.on) { g.current.scale.set(1, 1, 1); D.setSignals(signals()); D.update(STEP); DEFORM.last = D.readout; return }
    if (D) D.reset?.()
    // Knet-Squash wie J17 (holder.scale 1 + 0,12·sq, 1 − 0,18·sq, 1 + 0,06·sq) – nur die Optik, um die Unterseite
    const sq = squash?.() ?? 0; g.current?.scale.set(1 + SQUASH_LOOK.x * sq, 1 + SQUASH_LOOK.y * sq, 1 + SQUASH_LOOK.z * sq) })
  useEffect(() => { let alive = true; loadModel().then((m) => { if (alive && m) setModel(m.clone(true)) }); return () => { alive = false } }, [])
  // R1a: Antriebs-Modul an den Düsen-Ankern des Racers. Modell und Anker hängen gemeinsam in rig.stretch (Stauchen/Strecken bei Boost und Sprung),
  // rig.object3d unter der Deformer-Gruppe – Fahnen bleiben bei jeder Verformung an den Düsen. Gas weich (0,12 s), Tempo aus den K2B-Signalen.
  const rig = useRef(null), drv = useRef({ gas: 0, boost: false, jump: false }), { scene: sceneR } = useThree()
  useEffect(() => { if (!model || !body.current) return
    const M = mountRacerRig({ body: body.current, model, racer: RACER, unit: S, seed: RACER_ID.length, scene: sceneR, dustColor: '#c9b48a' }), R1 = M.rig; rig.current = R1; M2STATE.rig = R1
    return () => { M.release(); rig.current = null; if (M2STATE.rig === R1) M2STATE.rig = null } }, [model])
  useFrame((_, dt) => { const R1 = rig.current; if (!R1) return; const k = M2STATE.drive || {}, sg = signals?.() || {}, D = drv.current
    D.gas += ((k.gas ? 1 : 0) - D.gas) * Math.min(1, dt / 0.12)
    // Elan S2 im Flug: surge(1) beim Boost-Start, ascent(1) beim Steigen (Zähler aus racerFlight), Kessel leer → Gas × 0,3 und Funken über den Brems-Puls
    if (k.fly) { if ((k.surgeN ?? 0) !== D.surgeN) R1.surge(1); if ((k.ascentN ?? 0) !== D.ascentN) R1.ascent(1) }
    else { if (k.boost && !D.boost && D.gas > 0.3) R1.surge(1); if (k.jump && !D.jump && !k.air) R1.ascent(0.9) }
    D.boost = !!k.boost; D.jump = !!k.jump; D.surgeN = k.surgeN ?? 0; D.ascentN = k.ascentN ?? 0
    R1.update(dt, { throttle: D.gas * (k.boil ? 0.3 : 1), speed01: k.fly ? k.speed01 : Math.min(1, Math.abs(sg.speed ?? 0)), boost: k.fly ? !!k.boost : !!k.boost && D.gas > 0.3, brake: !!k.brake, groundAt: terrainHeight }) })
  // Bild-Interpolation: Wurzel = Starrkörper-Gruppe über der Kippgruppe (C1 17.10.: seit M3 lag hier die Kippgruppe – der fahrende Körper wurde nicht
  // mehr interpoliert und ruckelte zwischen den Physik-Schritten). Auch Prüfwert für die Jitter-Messung.
  useEffect(() => { const root = tilt.current?.parent; if (!root) return; M2STATE.visualRoot = root; const off = interpTrack(root); return () => { off(); if (M2STATE.visualRoot === root) M2STATE.visualRoot = null } }, []) // Bild-Interpolation: Wurzel = Starrkörper
  return (
    <group ref={tilt}><group ref={g}>
      <group ref={body}>{model ? null : <mesh position={M2CAR.box.c}><boxGeometry args={M2CAR.box.h.map((v) => v * 2)} /><meshStandardMaterial color="#c8432f" /></mesh>}</group>
    </group></group>
  )
}

// Anzeige der aktiven Fahrphysik: groß oben mittig, beim Wechsel kurz hervorgehoben (Host-DOM, kein HUD-Stil)
function useKindLabel(kind, assist) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.createElement('div'); el.id = 'm2-kind'
    el.style.cssText = "position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:6;padding:8px 18px;border-radius:12px;background:rgba(255,250,240,.82);color:#1f1a14;font:700 22px/1.2 'Shantell Sans',system-ui,sans-serif;box-shadow:0 3px 8px rgba(42,26,12,.25);pointer-events:none;white-space:nowrap;transition:transform .25s,background .25s"
    document.body.appendChild(el); return () => { el.remove(); document.getElementById('m2-keys')?.remove() }
  }, [])
  useEffect(() => {
    const el = document.getElementById('m2-kind'); if (!el) return
    // M3 Fühlprobe (V-379): „Fahrsystem: K2B · Assist M3 an/aus“ – M schaltet die Fahrhilfe (Vergleich mit dem Stand vorher), C wechselt das System
    el.innerHTML = 'Fahrsystem: ' + LABEL(kind) + (kind === 'k2b' ? ` · Assist M3 <span style="color:${assist ? '#2f7d32' : '#a33'}">${assist ? 'an' : 'aus'}</span>` : '') + ' <span style="font-weight:400;font-size:15px">· M Assist · C wechselt</span>'
    const list = document.getElementById('m1-keys'); if (list && !document.getElementById('m2-keys')) { const c = document.createElement('div'); c.id = 'm2-keys'; c.style.marginTop = '6px'; c.innerHTML = RACER_FLY ? CAR_KEYS + RACER_KEYS : CAR_KEYS; list.appendChild(c) }
    el.style.background = 'rgba(255,214,120,.95)'; el.style.transform = 'translateX(-50%) scale(1.12)'
    const t = setTimeout(() => { el.style.background = 'rgba(255,250,240,.82)'; el.style.transform = 'translateX(-50%) scale(1)' }, 900)
    return () => clearTimeout(t)
  }, [kind, assist])
}

const M2Car = forwardRef(function M2Car({ player }, ref) {
  const [kind, setKind] = useState(M2STATE.kind)
  const [session, setSession] = useState(0)
  const spawn = useRef({ p: M2CAR.spawn, yaw: M2CAR.yaw })
  const [, getKeys] = useKeyboardControls()
  const keys = () => (M1INPUT.override ? { ...NOKEYS, ...M1INPUT.override } : getKeys())
  const car = useRef(null)
  const { camera } = useThree()
  const { world, rapier } = useRapier()
  const [assist, setAssist] = useState(ASSIST_M3.on)
  useKindLabel(kind, assist)
  useEffect(() => { M2STATE.carPos = () => car.current?.pos() ?? null; return () => { M2STATE.carPos = null } }, [])
  // Kontaktverdeckung (L3): das Licht-Modul (createContactAO in M1World) legt den Fleck an der Boden-Normale unter einen Stellvertreter in Wagengröße,
  // der dem Auto folgt (Grundfläche einmal gemessen, ungedreht). Löst den eigenen, waagrechten Fleck ab (Georg 17.10.: abgeschnittener Zweitschatten am Hang).
  const proxy = useMemo(() => { const g = new THREE.Group(); g.name = 'm2-car-ao'; const m = new THREE.Mesh(new THREE.BoxGeometry(M2CAR.box.h[0] * 2, 0.01, M2CAR.box.h[2] * 2)); m.visible = false; g.add(m); return g }, [])
  useEffect(() => { M2STATE.ao = { object3d: proxy, status: () => ({ status: car.current ? 'OK' : 'LOADING', shown: !!car.current }) }
    M2STATE.carSize = { half: Math.hypot(M2CAR.box.h[0], M2CAR.box.h[2]), h: M2CAR.box.c[1] + M2CAR.box.h[1] }; return () => { M2STATE.ao = null } }, [proxy])
  useEffect(() => interpTrack(proxy), [proxy])
  useFrame(() => { const c = car.current; if (!c) return; const p = c.pos(); proxy.position.set(p.x, p.y, p.z); proxy.rotation.set(0, c.yaw(), 0) })
  useEffect(() => { loadModel(); player.current?.freeze(true); player.current?.yieldCamera(true); return () => { player.current?.yieldCamera(false); player.current?.freeze(false) } }, [player])
  const restart = (k, at) => { if (at) spawn.current = at; M2STATE.kind = k; setKind(k); setSession((n) => n + 1); follow.reset() } // Neustart/Wechsel: Kamera setzt neu auf (kein Gleiten über die Karte)
  useHostKeys((e) => {
    // Elan S2: Pfeil hoch/runter sind im Host-Tastenplan W/S (ein keydown-Listener, Vertrag §4) – welche Taste zuletzt gedrückt wurde, entscheidet im Flug
    // zwischen Schub/Luftbremse (W/S) und Nase (Pfeile); kein preventDefault, die Bewegung liest weiter KeyboardControls
    if (e.code === 'ArrowUp' || e.code === 'KeyW') NOSE.upArrow = e.code === 'ArrowUp'; if (e.code === 'ArrowDown' || e.code === 'KeyS') NOSE.downArrow = e.code === 'ArrowDown'
    if (e.repeat) return
    if (e.code === 'KeyM') { ASSIST_M3.on = !ASSIST_M3.on; setAssist(ASSIST_M3.on); e.preventDefault(); return }
    if (e.code === 'KeyC') { const p = car.current?.pos(), y = car.current?.yaw() ?? spawn.current.yaw; M2STATE.switches++; restart(kind === 'ecctrl' ? 'k2b' : 'ecctrl', p ? { p: [p.x, p.y + 0.8 * K, p.z], yaw: y } : null); e.preventDefault() }
    if (e.code === 'KeyR') { M2STATE.resets++; restart(kind, { p: M2CAR.spawn, yaw: M2CAR.yaw }); e.preventDefault() }
  }, 12)
  // Folgekamera C1 (V-408/V-088): Orbit von allen Seiten, Recenter nur in Bewegung, Zoom bis Ich-Perspektive, Kollisions-Arm – je Bild nach der
  // Interpolation (M1INTERP.frameCam), Ziel = interpolierte Starrkörper-Gruppe. Grundabstand und Höhe aus kfb_camera_follow (nur Gierung folgt).
  const gl = useThree((s) => s.gl)
  const follow = useMemo(() => { const [, ch, cz] = M2CAR.cam.pos, ray = new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
    return createFollowCam({ dom: gl.domElement, base: Math.hypot(ch - M2CAR.cam.target[1], cz), height: M2CAR.cam.target[1], eye: M2CAR.box.c[1] + M2CAR.box.h[1] * 1.05, eyeAhead: M2CAR.box.h[2] * 0.85, onPov: (on) => { const r = M2STATE.visualRoot; if (r) r.traverse((o) => { if (o.isMesh) o.visible = !on }) }, pitch0: Math.atan2(ch - M2CAR.cam.target[1], -cz), maxArm: 7.5 * K,
      collide: (from, dir, dist) => { ray.origin.x = from.x; ray.origin.y = from.y; ray.origin.z = from.z; ray.dir.x = dir.x; ray.dir.y = dir.y; ray.dir.z = dir.z
        const h = world.castRay(ray, dist, true, undefined, undefined, undefined, undefined, (co) => !co.parent()?.userData?.m2Car && !isFence(co)); return h ? h.timeOfImpact : null },
      ground: (x, z) => terrainHeight(x, z) }) }, [gl, world, rapier])
  useEffect(() => { const v = new THREE.Vector3()
    M1INTERP.frameCam = () => { const c = car.current, root = M2STATE.visualRoot; if (!c || !root) return; root.getWorldPosition(v); follow.update(M1CLOCK.frameDt ?? STEP, camera, { target: v, heading: c.yaw(), moving: Math.abs(c.speed()) > 0.6 * K }) }
    M2STATE.follow = follow; return () => { M1INTERP.frameCam = null; M2STATE.follow = null; follow.detach() } }, [follow, camera])
  useEffect(() => { expose('M2', { att: ATT, land: LAND, stuck: STUCK, push: PUSH, ride: RIDE, twoWheel: TW, trick: TRICK, tricks: TRICKS, assist: ASSIST_M3, deform: DEFORM, events: M2EVENTS, kind: () => M2STATE.kind, stats: M2STATE, tune: M2TUNE, spec: M2CAR, car: () => car.current, setKind: (k, at) => restart(k, at), flip: (how) => car.current?.flip?.(how) }) }, [])
  useImperativeHandle(ref, () => ({ kind: () => M2STATE.kind, setKind: (k, at) => restart(k, at), car: () => car.current }))
  const props = { key: kind + session, at: spawn.current, keys, carRef: car, player }
  return <><primitive object={proxy} />{kind === 'ecctrl' ? <EcctrlCar {...props} /> : <K2tCar {...props} />}</>
})
export default M2Car

// ── A · ecctrl ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function EcctrlCar({ at, keys, carRef }) {
  const v = useRef(null), right = useRef({ t: 0, on: false })
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), up: new THREE.Vector3(), fwd: new THREE.Vector3(), side: new THREE.Vector3(), axis: new THREE.Vector3(), Y: new THREE.Vector3(0, 1, 0) }), [])
  const T = M2TUNE, q0 = useMemo(() => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), at.yaw), [at])
  const { c: bc, h: bh } = M2CAR.box
  // Masse fest, Schwerpunkt tief (Rahmen des Starrkörpers: Ursprung = Unterseite der Karosserie), Trägheit eines Quaders
  const mp = useMemo(() => { const [w, h, l] = bh.map((x) => x * 2), m = T.mass
    return { mass: m, centerOfMass: { x: 0, y: T.comY - bc[1], z: 0 }, principalAngularInertia: { x: (m / 12) * (h * h + l * l), y: (m / 12) * (w * w + l * l), z: (m / 12) * (w * w + h * h) }, angularInertiaLocalFrame: { x: 0, y: 0, z: 0, w: 1 } } }, [])
  const rot = () => { const r = v.current?.body?.rotation(); if (r) tmp.q.set(r.x, r.y, r.z, r.w); return tmp.q }
  const grounded = () => { let n = 0; v.current?.wheelsInfo?.forEach((w) => { if (w.current?.rayHit) n++ }); return n }
  useEffect(() => {
    carRef.current = {
      kind: 'ecctrl',
      pos: () => v.current?.body?.translation() ?? { x: at.p[0], y: at.p[1], z: at.p[2] },
      yaw: () => { if (!v.current?.body) return at.yaw; const f = tmp.fwd.set(0, 0, 1).applyQuaternion(rot()); return Math.atan2(f.x, f.z) },
      upY: () => (v.current?.body ? tmp.up.set(0, 1, 0).applyQuaternion(rot()).y : 1),
      grounded, speed: () => { const l = v.current?.body?.linvel(); return l ? Math.hypot(l.x, l.y, l.z) : 0 },
      body: () => v.current?.body ?? null,
      flip: (how = 'roof') => { const b = v.current?.body; if (!b) return; const p = b.translation(); const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), how === 'side' ? Math.PI / 2 : Math.PI).premultiply(q0)
        b.setTranslation({ x: p.x, y: p.y + 2.5 * K, z: p.z }, true); b.setRotation(q, true); b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true) },
      state: () => ({ kind: 'ecctrl', grounded: grounded(), upY: +carRef.current.upY().toFixed(3), speed: +carRef.current.speed().toFixed(2), rpm: v.current?.engineRPM ?? null, righting: right.current.on }),
    }
    return () => { if (carRef.current?.kind === 'ecctrl') carRef.current = null }
  }, [])
  // vor ecctrl: Eingabe; Lenkung stufenlos über joystickL.x (+ = rechts), mit dem Tempo kleiner
  const pre = () => {
    const k = keys(), l = v.current?.body?.linvel(), sp = l ? Math.hypot(l.x, l.z) : 0, st = ((k.leftward ? 1 : 0) - (k.rightward ? 1 : 0)) / (1 + sp * T.steerFall)
    const flat = tmp.up.set(0, 1, 0).applyQuaternion(rot()).y > 0.99, hold = !k.forward && !k.backward && sp < 0.8 * K && flat
    v.current?.setMovement({ forward: k.forward, backward: k.backward, brake: k.jump || hold, joystickL: { x: -st, y: 0 } })
  }
  // nach ecctrl: Fahrhilfe (M2TUNE)
  const post = () => {
    const b = v.current?.body; if (!b) return
    const av = b.angvel(), dt = STEP, k = keys(), q = rot(), lv = b.linvel()
    const up = tmp.up.set(0, 1, 0).applyQuaternion(q), fwd = tmp.fwd.set(0, 0, 1).applyQuaternion(q), n = grounded()
    const st = right.current
    if (up.y < 0.35 && Math.hypot(lv.x, lv.y, lv.z) < 3 * K) st.t += dt; else if (up.y > 0.9) { st.t = 0; st.on = false }
    if (st.t > T.rightAfter || st.on) { // Selbstaufrichten
      if (!st.on) M2STATE.rightStarts++
      st.on = true; const axis = tmp.axis.crossVectors(up, tmp.Y); if (axis.lengthSq() < 1e-6) axis.copy(fwd); axis.normalize().multiplyScalar(T.rightRate)
      b.setAngvel({ x: axis.x, y: av.y * 0.5, z: axis.z }, true)
      if (lv.y < T.rightLift && up.y < 0.6) b.setLinvel({ x: lv.x * 0.9, y: T.rightLift, z: lv.z * 0.9 }, true)
      return
    }
    if (n > 0) { // Anti-Roll am Boden + Ausrollen ohne Gas
      const side = tmp.side.set(1, 0, 0).applyQuaternion(q), roll = Math.asin(THREE.MathUtils.clamp(side.y, -1, 1)), rr = av.x * fwd.x + av.y * fwd.y + av.z * fwd.z
      const d = (-roll * T.antiRoll - rr * T.antiRollDamp) * dt
      b.setAngvel({ x: av.x + fwd.x * d, y: av.y + fwd.y * d, z: av.z + fwd.z * d }, true)
      if (!k.forward && !k.backward) { const f = Math.max(0, 1 - T.coast * dt); b.setLinvel({ x: lv.x * f, y: lv.y, z: lv.z * f }, true) }
    } else { // Luftkontrolle
      const steer = (k.leftward ? 1 : 0) - (k.rightward ? 1 : 0), pitch = (k.forward ? 1 : 0) - (k.backward ? 1 : 0), side = tmp.side.set(1, 0, 0).applyQuaternion(q)
      const tx = up.x * steer * T.airYaw + side.x * pitch * T.airPitch, ty = up.y * steer * T.airYaw + side.y * pitch * T.airPitch, tz = up.z * steer * T.airYaw + side.z * pitch * T.airPitch, f = Math.min(1, T.airDamp * dt)
      b.setAngvel({ x: av.x + (tx - av.x) * f, y: av.y + (ty - av.y) * f, z: av.z + (tz - av.z) * f }, true)
    }
  }
  const wy = T.rideHeight + T.hoverR - T.travel / 2 // Radmitte so, dass die Unterseite in Ruhe ≈ rideHeight über dem Boden schwebt
  return (
    <>
      <OnFrame fn={pre} />
      <EcctrlVehicle ref={v} position={[at.p[0], at.p[1], at.p[2]]} quaternion={q0.toArray()} ccd colliders={false} name="m2-car" userData={{ m2Car: true }}
        carConfig={{ engineHorsepower: T.hp, gearRatios: [T.gear] }}>
        <CuboidCollider args={bh} position={bc} massProperties={mp} />
        <CarVisual />
        {M2CAR.hover.map(([x, y, z], i) => (
          <ShapeCastWheel key={i} position={[x, y + wy, z]} driveWheel steerWheel={i < 2} brakeWheel rayShapeR={T.hoverR} rayLength={T.travel} springK={T.spring} dampingC={T.damp} tireGripFactor={T.grip} />
        ))}
      </EcctrlVehicle>
      <OnFrame fn={post} />
    </>
  )
}

// ── B · k2b (kinematisch) ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function K2tCar({ at, keys, carRef, player }) {
  const { world, rapier } = useRapier()
  const body = useRef(null), d = useMemo(() => createK2t(at.p[0], at.p[1], at.p[2], at.yaw), [at])
  // Elan S2: Racer-Flug (racerFlight.js). Pfeil hoch/runter = Nase (NOSE, aus dem Host-Tasten-Router), RMB gehalten = Nase aus der Kamera
  const F = useMemo(() => createRacerFlight(K / WORLD_K, G), [d]), { gl } = useThree()
  useEffect(() => { const pd = (e) => { NOSE.rmb = (e.buttons & 2) !== 0 }, cm = (e) => { if (F.st) e.preventDefault() }
    gl.domElement.addEventListener('pointerdown', pd); window.addEventListener('pointerup', pd); gl.domElement.addEventListener('contextmenu', cm)
    return () => { gl.domElement.removeEventListener('pointerdown', pd); window.removeEventListener('pointerup', pd); gl.domElement.removeEventListener('contextmenu', cm); NOSE.rmb = false; if (ELAN_MEM.state === F.st) ELAN_MEM.state = null } }, [F, gl])
  const { c: bc, h: bh } = M2CAR.box
  const shape = useMemo(() => new rapier.Cuboid(bh[0], bh[1], bh[2]), [rapier])
  const shrunk = useMemo(() => new rapier.Cuboid(bh[0] * 0.97, bh[1] * 0.9, bh[2] * 0.97), [rapier]) // Drehprüfung: knapp kleiner, Berührung ist kein Stecken
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])
  const tmp = useMemo(() => ({ q2: new THREE.Quaternion(), o2: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), m: new THREE.Matrix4(), f: new THREE.Vector3(), u: new THREE.Vector3(), x: new THREE.Vector3(), Y: new THREE.Vector3(0, 1, 0), o: new THREE.Vector3() }), [])
  const skip = (c) => !c.parent()?.userData?.m2Car
  const isObstacle = (c) => { const u = c.parent()?.userData; return !!(u?.stunt?.kind === 'wall' || u?.obstacle) }
  // weiche Hindernisse = Figuren: FrizzleBob (ecctrl-Kapsel) und GothGirl (userData.soft)
  const isSoft = (c) => { const b = c.parent(); return !!b && (b.userData?.soft === true || b.handle === player?.current?.handle?.()?.body?.handle) }
  const env = useMemo(() => ({
    // Bodenhöhe unter dem Ursprung (= Unterseite) + Fahrhöhe. Georg 16.10.: „fährt durch den Berg und fällt endlos“ – der Strahl begann 1,5 m über dem
    // Auto und verfehlte einen steil ansteigenden Hang. Jetzt: Strahl ab 3 m über dem Auto auf Theater/Gelände, und das Gelände-Höhenfeld ist IMMER
    // Mindestboden (nie None, nie darunter); Normale aus dem Höhenfeld, wo der Strahl nichts Höheres trifft.
    home: () => ({ x: M2CAR.spawn[0], y: terrainHeight(M2CAR.spawn[0], M2CAR.spawn[2]) + M2TUNE.rideHeight, z: M2CAR.spawn[2], yaw: M2CAR.yaw }), // T3-Rückfall (Stufe D)
    ground: (x, z, fromY) => { const from = fromY + 1.5 * K; ray.origin.x = x; ray.origin.y = from; ray.origin.z = z
      let h = world.castRayAndGetNormal(ray, 60, true, undefined, undefined, undefined, body.current ?? undefined, (c) => skip(c) && !isFence(c))
      // Strahl beginnt in einem Körper (toi ≈ 0, z. B. Wagen an einer Gebäudekante): dieser Körper ist kein Boden (m3-a 17.10.: Wagen kletterte aufs Dach)
      if (h && h.timeOfImpact < 1e-3) { const inside = h.collider; h = world.castRayAndGetNormal(ray, 60, true, undefined, undefined, undefined, body.current ?? undefined, (c) => skip(c) && !isFence(c) && c !== inside) }
      const ty = terrainHeight(x, z), e = 0.4 * K, tn = new THREE.Vector3(terrainHeight(x - e, z) - terrainHeight(x + e, z), 2 * e, terrainHeight(x, z - e) - terrainHeight(x, z + e)).normalize()
      const hy = h ? from - h.timeOfImpact : -Infinity
      // M3 Stufe B: steile Flächen (Normale < 60° zur Senkrechten, z. B. Rampenseite, Tafelkante) sind kein Boden – dann zählt das Gelände
      return hy > ty + 0.01 * K && (h.normal.y >= 0.5 || !ASSIST_M3.on) ? { y: hy + M2TUNE.rideHeight, n: [h.normal.x, h.normal.y, h.normal.z], floor: ty + M2TUNE.rideHeight } : { y: ty + M2TUNE.rideHeight, n: [tn.x, tn.y, tn.z], floor: ty + M2TUNE.rideHeight } },
    // Wände: Rumpf in seiner Lage (mit Neigung) entlang der Bewegung schieben. castShape meldet nur den ERSTEN Treffer – daher je Treffer: Boden
    // (n.y > 0,3: Hang, Bühnenboden, Rampe) überspringen, Wand kürzen, Kollider ausnehmen und mit der gekürzten Bewegung erneut schieben, bis
    // nichts mehr kommt (höchstens 5 Durchgänge). Sonst sah die Prüfung den Zaun hinter einem Billboard bzw. Boden nicht (m2-g0 16.10.: 3–4/28).
    zone: (x, z) => rampZone(x, z), // Stufe F: Rampen-Zonen des Testfelds
    // steckt der Kasten bei Gierung yaw (aufrecht) in einem Hindernis? Hindernis = Gebäude des Testfelds, Theater, Tafel, Partnerin (userData obstacle/soft)
    blocked: (x, y, z, yaw) => { const q = tmp.q2.setFromAxisAngle(tmp.Y, yaw), o = tmp.o2.set(bc[0], bc[1] + 0.05 * K, bc[2]).applyQuaternion(q)
      let hit = false; world.intersectionsWithShape({ x: x + o.x, y: y + o.y, z: z + o.z }, { x: q.x, y: q.y, z: q.z, w: q.w }, shrunk, (c) => { hit = true; return false }, undefined, undefined, undefined, body.current ?? undefined,
        (c) => { const u = c.parent()?.userData; return skip(c) && !isFence(c) && !!(u?.stunt?.kind === 'wall' || u?.obstacle || u?.soft) }); return hit },
    sweep: (from, delta) => { let dl = delta.slice(), wall = null, soft = false, ride = false
      const q = tmp.q, o = tmp.o.set(bc[0], bc[1] + 0.05 * K, bc[2]).applyQuaternion(q), skipSet = new Set(), pred = (c) => skip(c) && !skipSet.has(c.handle)
      for (let pass = 0; pass < 5; pass++) {
        if (Math.hypot(...dl) < 1e-6) break
        const hit = world.castShape({ x: from[0] + o.x, y: from[1] + o.y, z: from[2] + o.z }, { x: q.x, y: q.y, z: q.z, w: q.w }, { x: dl[0], y: dl[1], z: dl[2] }, shape, 0.02 * K, 1, true, undefined, undefined, undefined, body.current ?? undefined, pred)
        M2STATE.lastSweep = hit ? { pass, toi: +hit.time_of_impact.toFixed(3), ny: +hit.normal1.y.toFixed(2), fence: isFence(hit.collider) } : { pass, none: true } // Prüfwert
        if (!hit) break
        skipSet.add(hit.collider.handle)
        // Boden: weiter nach Wänden suchen. Hindernisse (Gebäude, Theater, Tafel) zählen nur mit fast waagrechter Fläche als Boden – an Kanten ist die
        // Treffer-Normale schräg (m3-a 17.10.: n.y > 0,3 an der Kante von ecke-1 ließ den Wagen hinein, der Bodenstrahl hob ihn dann aufs Dach)
        if (hit.normal1.y > (isObstacle(hit.collider) ? 0.85 : 0.3) && !isFence(hit.collider)) continue
        const n = [hit.normal1.x, hit.normal1.y, hit.normal1.z], into = dl[0] * n[0] + dl[1] * n[1] + dl[2] * n[2] // normal1 zeigt aus dem Hindernis (gemessen)
        if (into >= 0) continue
        const cut = into * (1 - Math.min(1, hit.time_of_impact)); dl = [dl[0] - cut * n[0], dl[1] - cut * n[1], dl[2] - cut * n[2]]; wall = n; soft = isSoft(hit.collider); ride = !!hit.collider.parent()?.userData?.stunt?.ride
      }
      return { delta: dl, hit: !!wall, n: wall, soft, ride } },
  }), [world, rapier])
  // Flug-Umgebung: Boden = K2B-Boden unter dem Wagen (Fahrhöhe eingerechnet), Wände über denselben Rumpf-Schub
  const fenv = useMemo(() => ({ ground: (x, z) => env.ground(x, z, d.y).y, sweep: (from, delta) => env.sweep(from, delta) }), [env, d])
  useEffect(() => {
    tmp.q.setFromAxisAngle(tmp.Y, d.yaw)
    carRef.current = {
      kind: 'k2b', pos: () => ({ x: d.x, y: d.y, z: d.z }), yaw: () => d.yaw, upY: () => tmp.u.fromArray(d.up).normalize().y, grounded: () => (d.air ? 0 : 4), speed: () => Math.hypot(d.speed, d.latV), body: () => body.current, flip: () => {},
      signals: () => d.signals, attitude: () => attitude(d), fly: () => F, kick: (o) => { if (DEBUG) Object.assign(d, o) }, // Prüf-Stoß (nur debug): z. B. { latV } in der Luft
      state: () => ({ kind: 'k2b', grounded: d.air ? 0 : 4, upY: 1, speed: +Math.abs(d.speed).toFixed(2), air: d.air, hits: d.hits, squash: +d.squash.toFixed(3), rescues: d.rescues || 0, t1: d.t1 || 0, t3: d.t3 || 0, rides: d.rides || 0, riding: !!d.ride, tricks: d.tricks || 0, freeTip: !!d.freeTip, rideLast: d.rideLast || null, lean: +(d.lean || 0).toFixed(3), launches: d.launches || 0, zone: d.zone?.seg || null, zoneAborted: !!d.zone?.aborted, fenceRescues: d.fenceRescues || 0 }),
    }
    return () => { if (carRef.current?.kind === 'k2b') carRef.current = null }
  }, [])
  const sig = useCallback(() => d.signals, [d]) // Deformer-Eingang (Stufe E), stabil je Wagen
  const step = () => {
    const k = keys(), px = d.x, pz = d.z, N = NOSE, fs = M2STATE.follow?.state
    // Elan S2: erst der Flug (fliegt der Racer, ruht K2B), sonst K2B und danach die Rampen-Prüfung; Nase per Maus: Kameraneigung gegen die Grundneigung
    const fin = { gas: k.forward, brake: k.backward, left: k.leftward, right: k.rightward, jump: k.jump, boost: k.run, noseUp: (k.forward && N.upArrow) || !!k.noseUp, noseDown: (k.backward && N.downArrow) || !!k.noseDown, mousePitch: N.rmb && fs ? 0.32 - fs.wantPitch : (k.mousePitch ?? null) }
    const flew = RACER_FLY && racerFlightStep(F, d, fin, STEP, fenv)
    if (!flew) { stepK2t(d, { gas: k.forward, brake: k.backward, left: k.leftward, right: k.rightward, driftL: k.strafeL, driftR: k.strafeR, boost: k.run, jump: k.jump, tip: k.descend }, STEP, env); if (RACER_FLY) racerAfterK2t(F, d) } // Q/E = Drift (V-347, MOVE_MAP-Namen wie zu Fuß)
    M2STATE.drive = racerDrive(F, fin) || { gas: !!k.forward, brake: !!k.backward, boost: !!k.run, jump: !!k.jump, air: !!d.air } // R1a: Eingang fürs Antriebs-Modul (Gas, Boost, Sprung)
    if (RACER_FLY) ELAN_MEM.state = F.st; if (F.st) for (const e of F.st.events) ELAN_MEM.events.push({ ...e, t: M1CLOCK.steps }) // Ringkurs-Anzeige und Kessel (ElanRings)
    for (const e of d.events) M2EVENTS.emit(e)
    for (const e of F.events) M2EVENTS.emit(e) // fly { why: ramp | double } · land
    // Sicherung Ränge (V-283): landet die Automitte im Zaun-Grundriss, zurück auf den letzten Stand und abprallen (wie die Bodensicherung)
    if (inRankFence(d.x, d.z) && !inRankFence(px, pz)) { d.x = px; d.z = pz; d.speed *= -0.25; d.latV = 0; d.fenceRescues = (d.fenceRescues || 0) + 1 }
    const u = tmp.u.fromArray(d.up).normalize(), f = tmp.f.set(Math.sin(d.yaw), 0, Math.cos(d.yaw)); f.addScaledVector(u, -f.dot(u)).normalize()
    const x = tmp.x.crossVectors(u, f); tmp.m.makeBasis(x, u, f); tmp.q.setFromRotationMatrix(tmp.m); tmp.q.multiply(new THREE.Quaternion().setFromEuler(tmp.e.set(d.pitch, 0, d.roll)))
    body.current?.setNextKinematicTranslation({ x: d.x, y: d.y, z: d.z }); body.current?.setNextKinematicRotation(tmp.q)
  }
  return (
    <>
      <OnFrame fn={step} />
      <RigidBody ref={body} type="kinematicPosition" colliders={false} position={at.p} name="m2-car" userData={{ m2Car: true }}>
        <CuboidCollider args={bh} position={bc} />
        <CarVisual squash={() => d.squash} signals={sig} lean={() => d.lean || 0} />
      </RigidBody>
    </>
  )
}
