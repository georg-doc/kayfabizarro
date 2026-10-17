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
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EcctrlVehicle, ShapeCastWheel } from 'ecctrl/vehicle'
import { useHostKeys } from '../hostKeys'
import { expose } from '../debug'
import { M1INPUT } from '../m1/M1Player'
import { isFence, inRankFence } from '../m1/m1Host'
import { STEP, interpTrack } from '../m1/m1Clock'
import { VEHICLE_COMMIT } from '../modules/vehicleLineup'
import fbRecipe from '../data/actors/frizzlebob-v5b.recipe.json'
import { createK2t, stepK2t, SQUASH_LOOK } from './k2t'
import { terrainHeight } from '../modules/m1-terrain'
import { K } from '../m1/m1Scale.js'
import { contactBlob } from '../modules/contactBlob'

// ── Fahrzeug (aus crimson_flame_dragster.kfb-vehicle.v3.json, Rig-Einheiten × S) ─────────────────────────────────────────────────────────────────
const S = (fbRecipe.stage?.scale ?? 0.947) * K // V-345: Rig × 0,947 × K = Rig × M_PER_RIG (J17-Meter, wie FB)
const R = (a) => a.map((v) => +(v * S).toFixed(4))
export const M2CAR = {
  id: 'crimson_flame_dragster',
  url: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${VEHICLE_COMMIT}/media/3D_Assets/MeshyModels/vehicles/crimson_flame_dragster/crimson_flame_dragster_browser.v3.glb`,
  box: { c: R([0, 1.4446, 0]), h: R([1.9852, 1.3002, 4.0339]) }, // collision_hints.body_box
  hover: [R([1.3574, 0, 2.6895]), R([-1.3574, 0, 2.6895]), R([1.4091, 0.2132, -2.6895]), R([-1.4091, 0.2133, -2.6895])], // FL FR RL RR (front = +Z)
  cam: { pos: R([0, 5.112, -10.506]), target: R([0, 1.59, 0]) }, // kfb_camera_follow
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
export const M2_ON = /#m1\b.*\bcar\b/.test(H) // #m1,car[=ecctrl|k2b]
// Ereignis-Abos (railImpact/landing/takeoff, Namen wie vehicle-cartoon-deformer.v2) für Squash, VFX, später Stunts (§55): M2EVENTS.on(type, fn) → abmelden
export const M2EVENTS = { subs: new Map(), on(type, fn) { const l = this.subs.get(type) || new Set(); l.add(fn); this.subs.set(type, l); return () => l.delete(fn) }, emit(e) { this.subs.get(e.type)?.forEach((fn) => fn(e)); this.subs.get('*')?.forEach((fn) => fn(e)) } }
export const M2STATE = { kind: /car=ecctrl/.test(H) ? 'ecctrl' : 'k2b', // Start mit B (Georgs Tendenz 16.10.), A per C als Gegenprobe
  resets: 0, switches: 0, rightStarts: 0, model: 'LOADING' }
// Label nach V-367 („Fahrsystem: K2B | ecctrl“, Abnahmepunkt; weg erst beim M2-Merge mit Georgs Zustimmung): aktives System kräftig, das andere blass
const LABEL = (kind) => ['k2b', 'ecctrl'].map((k) => `<span style="opacity:${k === kind ? 1 : 0.35}">${k === 'k2b' ? 'K2B' : 'ecctrl'}</span>`).join(' | ')
// Fahr-Tasten im Info-Symbol (V-347 (4)), unter der M1-Liste; ecctrl ist eingefroren (V-367), Drift und Wendehilfe nur in K2B
const CAR_KEYS = '<b>Auto</b><br>W · Gas &nbsp;·&nbsp; S · bremsen / rückwärts &nbsp;·&nbsp; A D · lenken (langsam: enge Wende)<br>Q E · driften links / rechts (K2B, ab 4,9 m/s)<br>Leertaste · springen (K2B) bzw. Handbremse (ecctrl)<br>R · zurück an den Start &nbsp;·&nbsp; C · Fahrsystem wechseln'
const NOKEYS = { forward: false, backward: false, leftward: false, rightward: false, jump: false, run: false, walk: false }
const OnFrame = ({ fn }) => { useFrame(fn); return null }

// Modell einmal laden (geteilt), je Auto ein Klon; bis dahin ein Kasten in Rumpfgröße
let modelPromise = null
const loadModel = () => (modelPromise ||= new GLTFLoader().loadAsync(M2CAR.url).then((g) => { M2STATE.model = 'OK'; g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } }); return g.scene }).catch((e) => { M2STATE.model = 'ERROR ' + e.message; return null }))
function CarVisual({ squash }) {
  const g = useRef(null), [model, setModel] = useState(null)
  // Knet-Squash wie J17 (holder.scale 1 + 0,12·sq, 1 − 0,18·sq, 1 + 0,06·sq) – nur die Optik, um die Unterseite
  useFrame(() => { const sq = squash?.() ?? 0; g.current?.scale.set(1 + SQUASH_LOOK.x * sq, 1 + SQUASH_LOOK.y * sq, 1 + SQUASH_LOOK.z * sq) })
  useEffect(() => { let alive = true; loadModel().then((m) => { if (alive && m) setModel(m.clone(true)) }); return () => { alive = false } }, [])
  useEffect(() => (g.current?.parent ? interpTrack(g.current.parent) : undefined), []) // Bild-Interpolation: Wurzel = Starrkörper
  return (
    <group ref={g}>
      {model ? <primitive object={model} scale={S} /> : <mesh position={M2CAR.box.c}><boxGeometry args={M2CAR.box.h.map((v) => v * 2)} /><meshStandardMaterial color="#c8432f" /></mesh>}
    </group>
  )
}

// Anzeige der aktiven Fahrphysik: groß oben mittig, beim Wechsel kurz hervorgehoben (Host-DOM, kein HUD-Stil)
function useKindLabel(kind) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.createElement('div'); el.id = 'm2-kind'
    el.style.cssText = "position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:6;padding:8px 18px;border-radius:12px;background:rgba(255,250,240,.82);color:#1f1a14;font:700 22px/1.2 'Shantell Sans',system-ui,sans-serif;box-shadow:0 3px 8px rgba(42,26,12,.25);pointer-events:none;white-space:nowrap;transition:transform .25s,background .25s"
    document.body.appendChild(el); return () => { el.remove(); document.getElementById('m2-keys')?.remove() }
  }, [])
  useEffect(() => {
    const el = document.getElementById('m2-kind'); if (!el) return
    el.innerHTML = 'Fahrsystem: ' + LABEL(kind) + ' <span style="font-weight:400;font-size:15px">· C wechselt</span>'
    const list = document.getElementById('m1-keys'); if (list && !document.getElementById('m2-keys')) { const c = document.createElement('div'); c.id = 'm2-keys'; c.style.marginTop = '6px'; c.innerHTML = CAR_KEYS; list.appendChild(c) }
    el.style.background = 'rgba(255,214,120,.95)'; el.style.transform = 'translateX(-50%) scale(1.12)'
    const t = setTimeout(() => { el.style.background = 'rgba(255,250,240,.82)'; el.style.transform = 'translateX(-50%) scale(1)' }, 900)
    return () => clearTimeout(t)
  }, [kind])
}

const M2Car = forwardRef(function M2Car({ player }, ref) {
  const [kind, setKind] = useState(M2STATE.kind)
  const [session, setSession] = useState(0)
  const spawn = useRef({ p: M2CAR.spawn, yaw: M2CAR.yaw })
  const [, getKeys] = useKeyboardControls()
  const keys = () => (M1INPUT.override ? { ...NOKEYS, ...M1INPUT.override } : getKeys())
  const car = useRef(null)
  const { camera } = useThree()
  const cam = useMemo(() => ({ tgt: new THREE.Vector3(), want: new THREE.Vector3(), init: false }), [])
  useKindLabel(kind)
  useEffect(() => { M2STATE.carPos = () => car.current?.pos() ?? null; return () => { M2STATE.carPos = null } }, [])
  // Kontaktfleck (V-203, contactBlob aus modules/contactBlob – derselbe Fleck wie bei den Figuren): auf dem Boden unter dem Auto, dreht mit, wird mit
  // der Höhe blasser (Sprung). Je Schritt gesetzt und in der Bild-Interpolation geführt (sonst ruckelt er bei 120 Hz gegen das Auto).
  const { world, rapier } = useRapier()
  const blob = useMemo(() => contactBlob(M2CAR.box.h[0] * 2.4, M2CAR.box.h[2] * 2.2, 0.6), [])
  const blobRay = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])
  useEffect(() => interpTrack(blob), [blob])
  useFrame(() => { const c = car.current; if (!c) { blob.visible = false; return } const p = c.pos(), b = c.body?.()
    blobRay.origin.x = p.x; blobRay.origin.y = p.y + 2; blobRay.origin.z = p.z
    const h = world.castRay(blobRay, 60, true, undefined, undefined, undefined, b ?? undefined, (co) => !co.parent()?.userData?.m2Car && !isFence(co))
    const gy = Math.max(h ? p.y + 2 - h.timeOfImpact : -Infinity, terrainHeight(p.x, p.z)), up = Math.max(0, p.y - gy)
    blob.visible = true; blob.position.set(p.x, gy + 0.015 * K, p.z); blob.rotation.y = c.yaw(); blob.material.opacity = blob.userData.op0 * THREE.MathUtils.clamp(1 - up / (6 * K), 0.15, 1) })
  useEffect(() => { loadModel(); player.current?.freeze(true); player.current?.yieldCamera(true); return () => { player.current?.yieldCamera(false); player.current?.freeze(false) } }, [player])
  const restart = (k, at) => { if (at) spawn.current = at; M2STATE.kind = k; setKind(k); setSession((n) => n + 1); cam.init = false }
  useHostKeys((e) => {
    if (e.repeat) return
    if (e.code === 'KeyC') { const p = car.current?.pos(), y = car.current?.yaw() ?? spawn.current.yaw; M2STATE.switches++; restart(kind === 'ecctrl' ? 'k2b' : 'ecctrl', p ? { p: [p.x, p.y + 0.8 * K, p.z], yaw: y } : null); e.preventDefault() }
    if (e.code === 'KeyR') { M2STATE.resets++; restart(kind, { p: M2CAR.spawn, yaw: M2CAR.yaw }); e.preventDefault() }
  }, 12)
  // Folgekamera nach kfb_camera_follow (hinten oben, nur Gierung – ein Überschlag dreht die Kamera nicht mit), weich
  useFrame((_, dt) => {
    const c = car.current; if (!c) return
    const p = c.pos(), yaw = c.yaw(), sy = Math.sin(yaw), cy = Math.cos(yaw), [, ch, cz] = M2CAR.cam.pos
    cam.want.set(p.x + sy * cz, p.y + ch, p.z + cy * cz)
    const k = cam.init ? 1 - Math.exp(-4 * dt) : 1
    camera.position.lerp(cam.want, k); cam.tgt.lerp(new THREE.Vector3(p.x, p.y + M2CAR.cam.target[1], p.z), cam.init ? 1 - Math.exp(-8 * dt) : 1); cam.init = true; camera.lookAt(cam.tgt)
  })
  useEffect(() => { expose('M2', { events: M2EVENTS, kind: () => M2STATE.kind, stats: M2STATE, tune: M2TUNE, spec: M2CAR, car: () => car.current, setKind: (k, at) => restart(k, at), flip: (how) => car.current?.flip?.(how) }) }, [])
  useImperativeHandle(ref, () => ({ kind: () => M2STATE.kind, setKind: (k, at) => restart(k, at), car: () => car.current }))
  const props = { key: kind + session, at: spawn.current, keys, carRef: car, player }
  return <><primitive object={blob} />{kind === 'ecctrl' ? <EcctrlCar {...props} /> : <K2tCar {...props} />}</>
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
  const { c: bc, h: bh } = M2CAR.box
  const shape = useMemo(() => new rapier.Cuboid(bh[0], bh[1], bh[2]), [rapier])
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), e: new THREE.Euler(), m: new THREE.Matrix4(), f: new THREE.Vector3(), u: new THREE.Vector3(), x: new THREE.Vector3(), Y: new THREE.Vector3(0, 1, 0), o: new THREE.Vector3() }), [])
  const skip = (c) => !c.parent()?.userData?.m2Car
  // weiche Hindernisse = Figuren: FrizzleBob (ecctrl-Kapsel) und GothGirl (userData.soft)
  const isSoft = (c) => { const b = c.parent(); return !!b && (b.userData?.soft === true || b.handle === player?.current?.handle?.()?.body?.handle) }
  const env = useMemo(() => ({
    // Bodenhöhe unter dem Ursprung (= Unterseite) + Fahrhöhe. Georg 16.10.: „fährt durch den Berg und fällt endlos“ – der Strahl begann 1,5 m über dem
    // Auto und verfehlte einen steil ansteigenden Hang. Jetzt: Strahl ab 3 m über dem Auto auf Theater/Gelände, und das Gelände-Höhenfeld ist IMMER
    // Mindestboden (nie None, nie darunter); Normale aus dem Höhenfeld, wo der Strahl nichts Höheres trifft.
    ground: (x, z, fromY) => { const from = fromY + 1.5 * K; ray.origin.x = x; ray.origin.y = from; ray.origin.z = z
      const h = world.castRayAndGetNormal(ray, 60, true, undefined, undefined, undefined, body.current ?? undefined, (c) => skip(c) && !isFence(c))
      const ty = terrainHeight(x, z), e = 0.4 * K, tn = new THREE.Vector3(terrainHeight(x - e, z) - terrainHeight(x + e, z), 2 * e, terrainHeight(x, z - e) - terrainHeight(x, z + e)).normalize()
      const hy = h ? from - h.timeOfImpact : -Infinity
      return hy > ty + 0.01 * K ? { y: hy + M2TUNE.rideHeight, n: [h.normal.x, h.normal.y, h.normal.z], floor: ty + M2TUNE.rideHeight } : { y: ty + M2TUNE.rideHeight, n: [tn.x, tn.y, tn.z], floor: ty + M2TUNE.rideHeight } },
    // Wände: Rumpf in seiner Lage (mit Neigung) entlang der Bewegung schieben. castShape meldet nur den ERSTEN Treffer – daher je Treffer: Boden
    // (n.y > 0,3: Hang, Bühnenboden, Rampe) überspringen, Wand kürzen, Kollider ausnehmen und mit der gekürzten Bewegung erneut schieben, bis
    // nichts mehr kommt (höchstens 5 Durchgänge). Sonst sah die Prüfung den Zaun hinter einem Billboard bzw. Boden nicht (m2-g0 16.10.: 3–4/28).
    sweep: (from, delta) => { let dl = delta.slice(), wall = null, soft = false
      const q = tmp.q, o = tmp.o.set(bc[0], bc[1] + 0.05 * K, bc[2]).applyQuaternion(q), skipSet = new Set(), pred = (c) => skip(c) && !skipSet.has(c.handle)
      for (let pass = 0; pass < 5; pass++) {
        if (Math.hypot(...dl) < 1e-6) break
        const hit = world.castShape({ x: from[0] + o.x, y: from[1] + o.y, z: from[2] + o.z }, { x: q.x, y: q.y, z: q.z, w: q.w }, { x: dl[0], y: dl[1], z: dl[2] }, shape, 0.02 * K, 1, true, undefined, undefined, undefined, body.current ?? undefined, pred)
        M2STATE.lastSweep = hit ? { pass, toi: +hit.time_of_impact.toFixed(3), ny: +hit.normal1.y.toFixed(2), fence: isFence(hit.collider) } : { pass, none: true } // Prüfwert
        if (!hit) break
        skipSet.add(hit.collider.handle)
        if (hit.normal1.y > 0.3 && !isFence(hit.collider)) continue // Boden: weiter nach Wänden suchen
        const n = [hit.normal1.x, hit.normal1.y, hit.normal1.z], into = dl[0] * n[0] + dl[1] * n[1] + dl[2] * n[2] // normal1 zeigt aus dem Hindernis (gemessen)
        if (into >= 0) continue
        const cut = into * (1 - Math.min(1, hit.time_of_impact)); dl = [dl[0] - cut * n[0], dl[1] - cut * n[1], dl[2] - cut * n[2]]; wall = n; soft = isSoft(hit.collider)
      }
      return { delta: dl, hit: !!wall, n: wall, soft } },
  }), [world, rapier])
  useEffect(() => {
    tmp.q.setFromAxisAngle(tmp.Y, d.yaw)
    carRef.current = {
      kind: 'k2b', pos: () => ({ x: d.x, y: d.y, z: d.z }), yaw: () => d.yaw, upY: () => tmp.u.fromArray(d.up).normalize().y, grounded: () => (d.air ? 0 : 4), speed: () => Math.hypot(d.speed, d.latV), body: () => body.current, flip: () => {},
      signals: () => d.signals, state: () => ({ kind: 'k2b', grounded: d.air ? 0 : 4, upY: 1, speed: +Math.abs(d.speed).toFixed(2), air: d.air, hits: d.hits, squash: +d.squash.toFixed(3), rescues: d.rescues || 0, fenceRescues: d.fenceRescues || 0 }),
    }
    return () => { if (carRef.current?.kind === 'k2b') carRef.current = null }
  }, [])
  const step = () => {
    const k = keys(), px = d.x, pz = d.z; stepK2t(d, { gas: k.forward, brake: k.backward, left: k.leftward, right: k.rightward, driftL: k.strafeL, driftR: k.strafeR, jump: k.jump }, STEP, env) // Q/E = Drift (V-347, MOVE_MAP-Namen wie zu Fuß)
    for (const e of d.events) M2EVENTS.emit(e)
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
        <CarVisual squash={() => d.squash} />
      </RigidBody>
    </>
  )
}
