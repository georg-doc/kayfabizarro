// Diegetische Bühne: Szene-Slots, Quest-Karte, Story-Mode-Licht; Actor-Karte schwebt über der Figur
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGame } from './store'
import { playerState } from './world'
import { adapter, SCENE } from './scene'
import { RigidBody } from '@react-three/rapier'
import { STORY_MODES } from './cards'
import { cardTexture } from './CardBeings'

const texCache = new Map()
const texFor = (card) => { if (!texCache.has(card.idx)) texCache.set(card.idx, cardTexture(card)); return texCache.get(card.idx) }
const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _m = new THREE.Matrix4()

// Karte, die sich zur Kamera dreht (nur um die lokale Hochachse) und beim Erscheinen aufrichtet
function Standee({ card, position, scale = 1, born }) {
  const ref = useRef()
  const { camera } = useThree()
  const tex = useMemo(() => texFor(card), [card])
  useFrame(() => {
    const g = ref.current; if (!g) return
    const t = Math.min(1, (performance.now() - born) / 650)
    const k = t < 1 ? 1 - Math.pow(1 - t, 3) * Math.cos(t * 9) : 1
    g.scale.set(scale, scale * Math.max(0.02, k), scale)
    // Blick zur Kamera in der Bühnenebene
    const parent = g.parent; parent.updateWorldMatrix(true, false)
    _v.copy(camera.position); parent.worldToLocal(_v); _v.y = g.position.y
    g.lookAt(_v.applyMatrix4(parent.matrixWorld))
  })
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh position={[0, 0.88, 0]} castShadow><planeGeometry args={[1.25, 1.75]} /><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.85} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.12} /></mesh>
        <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.9, 0.06, 0.35]} /><meshStandardMaterial color="#3a2d5c" roughness={0.9} /></mesh>
      </group>
    </group>
  )
}

const SLOTS = [[-1.45, 0.62, 0.7], [0, 0.62, 1.55], [1.45, 0.62, 0.7]]

export default function StageShow() {
  const episode = useGame((s) => s.episode)
  const storyMode = useGame((s) => s.storyMode)
  const flash = useGame((s) => s.stageFlash)
  const tr = useMemo(() => adapter.stage(), [])
  const light = useRef(), disc = useRef()
  const born = useRef(new Map())
  const bornOf = (card) => { if (!born.current.has(card.idx)) born.current.set(card.idx, performance.now()); return born.current.get(card.idx) }
  const color = storyMode != null ? STORY_MODES[storyMode].color : '#ffffff'
  useFrame((st) => {
    const on = storyMode != null
    if (light.current) { light.current.color.set(color); light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, on ? 40 + Math.sin(st.clock.elapsedTime * 3) * 6 : 0, 0.08) }
    if (disc.current) { disc.current.material.color.set(on ? color : '#d9475a'); disc.current.material.emissive.set(on ? color : '#000000'); disc.current.material.emissiveIntensity = on ? 0.55 : 0 }
  })
  return (
    <group position={tr.position} quaternion={tr.quaternion}>
      {SCENE === 'hex' && <RigidBody type="fixed" colliders="hull"><mesh position={[0, 0.3, 0]} castShadow receiveShadow><cylinderGeometry args={[2.4, 2.6, 0.6, 6]} /><meshStandardMaterial color="#e8c35a" roughness={0.9} flatShading /></mesh></RigidBody>}
      <mesh ref={disc} position={[0, 0.655, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.6, 40]} /><meshStandardMaterial color="#d9475a" roughness={0.8} /></mesh>
      <pointLight ref={light} position={[0, 4.5, 0]} distance={14} decay={1.6} intensity={0} />
      {SLOTS.map((p, k) => {
        const c = episode?.stage?.[k]
        return c ? <Standee key={c.idx} card={c} position={p} scale={0.8} born={bornOf(c)} />
          : <mesh key={'e' + k} position={[p[0], 0.67, p[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.32, 0.42, 24]} /><meshBasicMaterial color="#fff4d6" transparent opacity={episode ? 0.6 : 0.2} /></mesh>
      })}
      {episode?.quest && <Standee key={'q' + episode.quest.idx} card={episode.quest} position={[0, 0.62, -2.6]} scale={1.15} born={bornOf(episode.quest)} />}
      <ActorBadge flash={flash} />
    </group>
  )
}

// Actor-Karte schwebt über der Figur (die Figur spielt die Karte)
function ActorBadge() {
  const actor = useGame((s) => s.actor)
  const ref = useRef()
  const { camera } = useThree()
  const tex = useMemo(() => (actor ? texFor(actor) : null), [actor])
  useFrame((st) => {
    const g = ref.current; if (!g || !actor) return
    const up = adapter.up(playerState.pos, _v)
    const parent = g.parent; parent.updateWorldMatrix(true, false)
    const world = playerState.pos.clone().addScaledVector(up, 1.9 + Math.sin(st.clock.elapsedTime * 2) * 0.05)
    g.position.copy(parent.worldToLocal(world))
    // zur Kamera drehen, aufrecht relativ zum Planeten
    _m.lookAt(camera.position, world, up); _q.setFromRotationMatrix(_m)
    parent.getWorldQuaternion(g.quaternion).invert().multiply(_q)
  })
  if (!actor) return null
  return (
    <group ref={ref}>
      <mesh><planeGeometry args={[0.42, 0.59]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    </group>
  )
}
