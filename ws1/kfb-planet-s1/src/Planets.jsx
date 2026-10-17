import * as THREE from 'three'
import { useMemo } from 'react'
import { RigidBody, CylinderCollider } from '@react-three/rapier'
import { PLANETS, buildPlanetGeometry, placeOnSurface, rng, STAGE_DIR } from './world'
import { useGame } from './store'

const clay = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, ...extra })

function Planet({ p }) {
  const geo = useMemo(() => buildPlanetGeometry(p), [p])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }), [])
  const onClick = (e) => {
    const s = useGame.getState()
    if (s.mode !== 'build' || e.delta > 4) return
    e.stopPropagation()
    if (s.selected) { s.select(null); return }
    const dir = e.point.clone().sub(p.center).normalize()
    const sizes = { wall: [3.4, 2.4, 0.5], block: [1.6, 1.6, 1.6], pillar: [0.8, 3.2, 0.8] }
    s.addObject({ id: `obj-${Date.now()}`, kind: s.tool, planet: p.id, dir: dir.toArray(), yaw: 0, size: sizes[s.tool] })
  }
  return (
    <RigidBody type="fixed" colliders="trimesh" position={p.center.toArray()}>
      <mesh geometry={geo} material={mat} onClick={onClick} receiveShadow name={`planet-${p.id}`} />
    </RigidBody>
  )
}

// Knete-Bäume auf dem Heimatplaneten
function Trees({ p, count = 34 }) {
  const items = useMemo(() => {
    const r = rng(99); const out = []
    while (out.length < count) {
      const d = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1)
      if (d.lengthSq() > 1 || d.lengthSq() < 0.01) continue
      d.normalize()
      if (d.angleTo(new THREE.Vector3(0, 1, 0)) < 0.45) continue // Startbereich frei halten
      const s = 0.7 + r() * 0.7
      out.push({ ...placeOnSurface(p, d, r() * 6.28, -0.1), s, hue: r() })
    }
    return out
  }, [p, count])
  const trunk = useMemo(() => clay('#8a5a3c'), [])
  const leaves = useMemo(() => [clay('#4f9a52'), clay('#77b85a'), clay('#e0a3c0')], [])
  return items.map((t, i) => (
    <group key={i} position={t.position} quaternion={t.quaternion} scale={t.s}>
      <mesh position={[0, 0.7, 0]} material={trunk} castShadow><cylinderGeometry args={[0.18, 0.26, 1.4, 8]} /></mesh>
      <mesh position={[0, 1.8, 0]} material={leaves[i % 3]} castShadow><sphereGeometry args={[0.85, 14, 10]} /></mesh>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.7, 0.25]} position={[0, 0.7, 0]} />
      </RigidBody>
    </group>
  ))
}

// Landmark Heimatplanet: runde Bühne + Turm (Platzhalter für modellierte Landmarks)
function HomeLandmark({ p }) {
  const stage = placeOnSurface(p, STAGE_DIR, 0, -0.05)
  const tower = placeOnSurface(p, new THREE.Vector3(-0.35, 1, -0.3), 0, -0.2)
  return (
    <>
      <RigidBody type="fixed" colliders="hull" position={stage.position} quaternion={stage.quaternion}>
        <mesh position={[0, 0.3, 0]} material={clay('#e8c35a')} castShadow receiveShadow><cylinderGeometry args={[2.4, 2.6, 0.6, 32]} /></mesh>
      </RigidBody>
      <group position={stage.position} quaternion={stage.quaternion}>
        <mesh position={[0, 0.62, 0]} material={clay('#d9475a')} receiveShadow><cylinderGeometry args={[1.6, 1.6, 0.05, 32]} /></mesh>
      </group>
      <RigidBody type="fixed" colliders="hull" position={tower.position} quaternion={tower.quaternion}>
        <mesh position={[0, 2.5, 0]} material={clay('#f2ead8')} castShadow><cylinderGeometry args={[0.9, 1.3, 5, 16]} /></mesh>
        <mesh position={[0, 5.4, 0]} material={clay('#3f6fb5')} castShadow><coneGeometry args={[1.3, 1.6, 16]} /></mesh>
      </RigidBody>
    </>
  )
}

// Landmark Gefängnisplanet: Wachturm am Labyrinth-Ausgang
function PrisonLandmark({ p }) {
  const t = placeOnSurface(p, new THREE.Vector3(0.35, 0.25, 0.93), 0, -0.2)
  return (
    <RigidBody type="fixed" colliders="hull" position={t.position} quaternion={t.quaternion}>
      <mesh position={[0, 3, 0]} material={clay('#5a5068')} castShadow><boxGeometry args={[1.4, 6, 1.4]} /></mesh>
      <mesh position={[0, 6.4, 0]} material={clay('#f0c84a', { emissive: '#f0a020', emissiveIntensity: 0.6 })}><boxGeometry args={[2.2, 0.9, 2.2]} /></mesh>
    </RigidBody>
  )
}

export default function Planets() {
  const [home, prison] = PLANETS
  return (
    <>
      {PLANETS.map((p) => <Planet key={p.id} p={p} />)}
      <Trees p={home} />
      <HomeLandmark p={home} />
      <PrisonLandmark p={prison} />
    </>
  )
}
