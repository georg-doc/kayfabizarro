import * as THREE from 'three'
import { useHostKeys, PRIO, ACTION_KEYS } from './hostKeys'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei'
import { Ecctrl } from 'ecctrl'
import { EcctrlCameraControls } from 'ecctrl/camera'
import { useCustomGravity } from 'ecctrl/gravity'
import { EcctrlAnimationStateController, useEcctrlAnimationStore } from 'ecctrl/animation'
import heroUrl from './assets/hero.glb?url'
import { nearestPlanet, planetById, playerState } from './world'
import { adapter, SCENE, TOWER } from './scene'
import { useGame } from './store'

const G = 14 // Schwerkraft-Stärke
const INFLUENCE = 28 // ab dieser Höhe: Schwerelosigkeit
const HALF = 0.45, RAD = 0.35, FLOAT = 0.2
const FOOT = HALF + RAD + FLOAT

const ANIM = { IDLE: 'Idle', WALK: 'Walking_A', RUN: 'Running_A', JUMP_START: 'Jump_Start', JUMP_IDLE: 'Jump_Idle', JUMP_FALL: 'Jump_Idle', JUMP_LAND: 'Jump_Land' }
const HIDE = ['1H_Axe_Offhand', 'Barbarian_Round_Shield', '1H_Axe', '2H_Axe', 'Mug']

export function GravitySetup() {
  const setGravityField = useCustomGravity((s) => s.setGravityField)
  useEffect(() => {
    const g = new THREE.Vector3()
    setGravityField((pos) => adapter.gravity(pos, g))
  }, [setGravityField])
  return null
}

function Hero() {
  const group = useRef()
  const { scene, animations } = useGLTF(heroUrl)
  const { actions } = useAnimations(animations, group)
  const animState = useEcctrlAnimationStore((s) => s.animationState)
  const flying = useGame((s) => s.flying)
  const emote = useGame((s) => s.emote)
  useMemo(() => {
    scene.traverse((o) => {
      if (HIDE.includes(o.name)) o.visible = false
      if (o.isMesh) { o.castShadow = true; if (o.material) { o.material.roughness = 1; o.material.metalness = 0 } }
    })
  }, [scene])
  useEffect(() => {
    const name = emote ? emote.name : flying ? 'Jump_Idle' : ANIM[animState] || 'Idle'
    const a = actions[name]; if (!a) return
    a.reset().fadeIn(0.15).play()
    if (emote || name === 'Jump_Start' || name === 'Jump_Land') { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true } else a.setLoop(THREE.LoopRepeat, Infinity)
    return () => a.fadeOut(0.15)
  }, [actions, animState, flying, emote])
  return (
    <group ref={group} position={[0, -FOOT, 0]} scale={0.75}>
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload(heroUrl)

export function startPosition() { return adapter.start() }

export default function Player() {
  const ecctrl = useRef(null)
  const cam = useRef(null)
  const { camera } = useThree()
  const mode = useGame((s) => s.mode)
  const flying = useGame((s) => s.flying)
  const buildFocus = useGame((s) => s.buildFocus)
  const assisting = useGame((s) => s.assisting)
  const dialogOpen = useGame((s) => !!s.dialog)
  const controllerOn = mode === 'play' && !flying && !assisting && !dialogOpen
  const [, getKeys] = useKeyboardControls()
  const t = useRef({ flyStart: 0, upLerp: new THREE.Vector3(0, 1, 0), wasBuild: false })
  const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), m: new THREE.Matrix4(), q: new THREE.Quaternion(), zero: new THREE.Vector3() }), [])
  const start = useMemo(() => startPosition(), [])
  const startArr = useMemo(() => start.toArray(), [start])
  const { world, rapier } = useRapier()
  const assist = useRef(null) // geführter Sprung { from, to, t0, dur, h }
  const lastPlat = useRef(null)
  const jumpWas = useRef(false)

  // Tasten: F = abheben/landen, R = zurück zum Start
  useHostKeys((e) => {
      const s = useGame.getState()
      if (s.mode !== 'play' || s.dialog || !ecctrl.current) return
      const body = ecctrl.current.body
      if (!body) return
      if (e.code === ACTION_KEYS.fly) {
        if (!s.flying) {
          const up = nearestUp(body.translation())
          body.setLinvel({ x: up.x * 9, y: up.y * 9, z: up.z * 9 }, true)
          t.current.flyStart = performance.now()
          s.setFlying(true)
        } else s.setFlying(false)
      }
      if (e.code === ACTION_KEYS.reset) {
        body.setTranslation(start, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true); s.setFlying(false)
      }
  }, PRIO.player)

  useEffect(() => { cam.current?.dollyTo(flying ? 12 : 7.5, true) }, [flying])

  // Bauen: Figur einfrieren, Kamera auf Planet
  useEffect(() => {
    const body = ecctrl.current?.body
    if (mode === 'build') {
      if (body) { body.setLinvel({ x: 0, y: 0, z: 0 }, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true) }
      useGame.getState().setFlying(false)
      const pos = body ? vec(body.translation()) : start
      const planet = buildFocus ? planetById(buildFocus) : nearestPlanet(pos).planet
      const off = pos.clone().sub(planet.center).normalize().multiplyScalar(planet.r * 2.8)
      cam.current?.setLookAt(planet.center.x + off.x, planet.center.y + off.y, planet.center.z + off.z, planet.center.x, planet.center.y, planet.center.z, true)
    } else if (cam.current) {
      cam.current.dollyTo(7.5, true)
    }
  }, [mode, start, buildFocus])

  useFrame((state, dt) => {
    const h = ecctrl.current; const cc = cam.current
    if (!h || !cc) return
    const body = h.body
    if (!body) return
    if (!t.current.camInit) { cc.rotatePolarTo(1.05, false); cc.dollyTo(7.5, false); t.current.camInit = true }
    if (!window.__kfbDebug) window.__kfbDebug = {
      teleport: (x, y, z, fly) => { body.setTranslation({ x, y, z }, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true); useGame.getState().setFlying(!!fly); t.current.flyStart = performance.now() },
      faceToward: (x, z) => { const p = body.translation(); cc.rotateAzimuthTo(Math.atan2(-(x - p.x), -(z - p.z)), false) },
      targets: () => (TOWER ? TOWER.targets.map((q) => ({ kind: q.kind, pos: q.pos.toArray(), name: q.card?.name })) : []),
    }
    const pos = vec(body.translation())
    playerState.pos.copy(pos)
    const zone = SCENE === 'hex' && inTower(pos)

    // Geführter Sprung läuft: Bogen von A nach B, ecctrl pausiert
    if (assist.current) {
      const A = assist.current
      const u = Math.min(1, (performance.now() - A.t0) / A.dur)
      const p = A.from.clone().lerp(A.to, u); p.y += A.h * 4 * u * (1 - u)
      body.setTranslation(p, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      body.setRotation(A.rot, true)
      if (u >= 1) { assist.current = null; useGame.setState({ assisting: false }); useGame.getState().playEmote('Jump_Land', 500) }
    }

    if (s0().mode === 'play' && !s0().flying && !s0().dialog && !assist.current) {
      const k = getKeys()
      let jump = k.jump
      const pressed = k.jump && !jumpWas.current
      jumpWas.current = k.jump
      if (pressed) t.current.jumpBuf = performance.now() + 350 // Eingabe kurz puffern
      const buffered = performance.now() < (t.current.jumpBuf || 0)
      const steady = h.isOnGround || (lastPlat.current && Math.abs(body.linvel().y) < 1.5)
      if (zone && buffered && steady) {
        t.current.jumpBuf = 0
        const tg = pickTarget(pos, k, camera)
        if (tg) {
          const from = pos.clone()
          const to = tg.pos.clone(); to.y += FOOT + 0.05
          const hd = Math.hypot(to.x - from.x, to.z - from.z)
          const yaw = Math.atan2(to.x - from.x, to.z - from.z)
          assist.current = { from, to, t0: performance.now(), dur: 450 + hd * 45, h: 1.1 + Math.max(0, to.y - from.y) * 0.35, rot: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw) }
          window.__kfbAssist = { target: tg.kind, to: to.toArray().map((v) => +v.toFixed(1)), from: from.toArray().map((v) => +v.toFixed(1)) }
          useGame.setState({ assisting: true }); useGame.getState().playEmote('Jump_Idle', 450 + hd * 45)
          jump = false
        }
      }
      h.setMovement({ forward: k.forward, backward: k.backward, leftward: k.leftward, rightward: k.rightward, run: k.run, jump })
    } else h.setMovement({ forward: false, backward: false, leftward: false, rightward: false, run: false, jump: false })

    // Letzte Plattform merken, weich zurücksetzen beim Absturz
    if (SCENE === 'hex' && TOWER) {
      if (h.isOnGround && !assist.current) {
        const on = TOWER.targets.find((t) => Math.hypot(t.pos.x - pos.x, t.pos.z - pos.z) < t.r + 0.2 && Math.abs(pos.y - FOOT - t.pos.y) < 0.6)
        if (on) lastPlat.current = on
        else if (pos.y - FOOT < TOWER.base.y + 0.8) lastPlat.current = null
      }
      const lp = lastPlat.current
      if (lp && !assist.current && !useGame.getState().flying && pos.y < lp.pos.y - 7) {
        body.setTranslation({ x: lp.pos.x, y: lp.pos.y + FOOT + 0.4, z: lp.pos.z }, true); body.setLinvel({ x: 0, y: 0, z: 0 }, true)
        useGame.getState().showToast('Hoppla! Zurück auf die letzte Plattform')
      }
      if (zone !== t.current.zone && !useGame.getState().flying) { t.current.zone = zone; cc.dollyTo(zone ? 10.5 : 7.5, true); if (zone) cc.rotatePolarTo(0.95, true) }
    }
    const s = useGame.getState()
    s.setPlanetName(adapter.name(pos))

    // Flug: eigene, einfache Steuerung (ecctrl pausiert)
    if (s.flying && s.mode === 'play') {
      const k = getKeys()
      const fwd = camera.getWorldDirection(v.a)
      const right = v.b.crossVectors(fwd, camera.up).normalize()
      const want = v.c.set(0, 0, 0)
      if (k.forward) want.add(fwd)
      if (k.backward) want.sub(fwd)
      if (k.rightward) want.add(right)
      if (k.leftward) want.sub(right)
      if (k.jump) want.add(camera.up)
      const speed = k.run ? 30 : 15
      if (want.lengthSq() > 0) want.normalize().multiplyScalar(speed)
      const lv = body.linvel()
      const f = 1 - Math.exp(-2.5 * dt)
      const nv = { x: lv.x + (want.x - lv.x) * f, y: lv.y + (want.y - lv.y) * f, z: lv.z + (want.z - lv.z) * f }
      body.setLinvel(nv, true)
      body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      const up = nearestUp(pos)
      const dir = v.a.set(nv.x, nv.y, nv.z)
      if (dir.lengthSq() > 1) {
        dir.normalize()
        if (Math.abs(dir.dot(up)) < 0.98) {
          v.m.lookAt(dir, v.zero, up); v.q.setFromRotationMatrix(v.m)
          const r = body.rotation(); const cur = new THREE.Quaternion(r.x, r.y, r.z, r.w).slerp(v.q, 1 - Math.exp(-6 * dt))
          body.setRotation(cur, true)
        }
      }
      // Landen, wenn nah am Boden (Strahl nach „unten“, eigener Körper ausgenommen)
      if (performance.now() - t.current.flyStart > 900) {
        const down = nearestUp(pos).clone().negate()
        const hit = world.castRay(new rapier.Ray(pos, down), FOOT + 0.8, true, undefined, undefined, undefined, body)
        if (hit) s.setFlying(false)
      }
    }

    // Kamera: folgt der Figur, "oben" zeigt vom Planeten weg
    if (s.mode === 'play') {
      cc.moveTo(pos.x, pos.y + 0, pos.z, true)
      const up = s.flying ? nearestUp(pos) : h.upAxis
      camera.up.lerp(up, 1 - Math.exp(-5 * dt)).normalize()
      cc.setUp(camera.up)
    }
    window.__kfb = { pos: pos.toArray(), place: adapter.name(pos), flying: s.flying, grounded: h.isOnGround, mode: s.mode, ctrl: controllerOn, assist: !!assist.current, lastPlat: lastPlat.current?.kind }
  })

  return (
    <>
      <EcctrlAnimationStateController ecctrl={ecctrl} />
      <Ecctrl
        ref={ecctrl}
        position={startArr}
        enableCustomGravity
        enable={controllerOn}
        capsuleHalfHeight={HALF}
        capsuleRadius={RAD}
        floatHeight={FLOAT}
        maxWalkVel={3.2}
        maxRunVel={7}
        jumpVel={6.5}
        fallingGravityScale={1.6}
        enableToggleRun={false}
      >
        <Hero />
      </Ecctrl>
      <EcctrlCameraControls ref={cam} makeDefault smoothTime={0.12} minDistance={3} maxDistance={60} />
    </>
  )
}

const s0 = () => useGame.getState()
const _up = new THREE.Vector3()
function nearestUp(p) {
  const pos = p.isVector3 ? p : vec(p)
  return adapter.up(pos, _up)
}
function vec(t) { return new THREE.Vector3(t.x, t.y, t.z) }

// Plattformer-Zone = Umkreis des Deck-Turms oberhalb des Bodens
function inTower(pos) {
  const t = TOWER; if (!t) return false
  return Math.hypot(pos.x - t.base.x, pos.z - t.base.z) < t.radius + 7 && pos.y > t.base.y + 0.5
}

// Zielplattform für den geführten Sprung: in Eingabe- bzw. Blickrichtung, erreichbar, nicht die eigene
const _f = new THREE.Vector3(), _r = new THREE.Vector3(), _w = new THREE.Vector3()
function pickTarget(pos, k, camera) {
  camera.getWorldDirection(_f); _f.y = 0; _f.normalize()
  _r.set(-_f.z, 0, _f.x)
  _w.set(0, 0, 0)
  if (k.forward) _w.add(_f); if (k.backward) _w.sub(_f); if (k.rightward) _w.add(_r); if (k.leftward) _w.sub(_r)
  if (_w.lengthSq() < 0.01) _w.copy(_f)
  _w.normalize()
  const feet = pos.y - FOOT
  let best = null, bestScore = Infinity
  for (const t of TOWER.targets) {
    const dx = t.pos.x - pos.x, dz = t.pos.z - pos.z
    const hd = Math.hypot(dx, dz), dy = t.pos.y - feet
    if (hd < t.r + 0.1 || hd - t.r > 7.5 || dy > 3.8 || dy < -6) continue
    const ang = Math.acos(Math.max(-1, Math.min(1, (dx * _w.x + dz * _w.z) / hd)))
    if (ang > 0.95) continue
    const score = ang * 3 + hd * 0.08 + (dy < -0.5 ? 0.6 : 0)
    if (score < bestScore) { bestScore = score; best = t }
  }
  return best
}
export { planetById }
