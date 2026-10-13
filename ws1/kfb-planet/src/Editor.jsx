import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TransformControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier'
import { placeOnSurface, planetById, surfaceR } from './world'
import { useGame } from './store'

const UP = new THREE.Vector3(0, 1, 0)
const COLORS = { wall: '#8b7fa3', block: '#c98b5a', pillar: '#e8dcc4' }
const mats = {}
const matFor = (kind, sel) => {
  const key = kind + (sel ? '-sel' : '')
  if (!mats[key]) mats[key] = new THREE.MeshStandardMaterial({ color: COLORS[kind] || '#999', roughness: 0.9, emissive: sel ? '#ffcc33' : '#000', emissiveIntensity: sel ? 0.35 : 0 })
  return mats[key]
}

function transformOf(o) {
  const p = planetById(o.planet)
  return placeOnSurface(p, new THREE.Vector3(...o.dir), o.yaw, o.size[1] / 2 - 0.15)
}

function Shape({ o }) {
  const [w, h, d] = o.size
  if (o.kind === 'pillar') return <cylinderGeometry args={[w / 2, w / 2, h, 16]} />
  return <boxGeometry args={[w, h, d]} />
}

// Kollision: eigener fester Körper, wird nach jeder Änderung neu aufgebaut
function Collider({ o }) {
  const tr = useMemo(() => transformOf(o), [o])
  const [w, h, d] = o.size
  return (
    <RigidBody type="fixed" colliders={false} position={tr.position} quaternion={tr.quaternion}>
      {o.kind === 'pillar' ? <CylinderCollider args={[h / 2, w / 2]} /> : <CuboidCollider args={[w / 2, h / 2, d / 2]} />}
    </RigidBody>
  )
}

function Visual({ o, selected, setRef }) {
  const tr = useMemo(() => transformOf(o), [o])
  const onClick = (e) => {
    const s = useGame.getState()
    if (s.mode !== 'build' || e.delta > 4) return
    e.stopPropagation(); s.select(o.id)
  }
  return (
    <group ref={selected ? setRef : undefined} position={tr.position} quaternion={tr.quaternion}>
      <mesh material={matFor(o.kind, selected)} onClick={onClick} castShadow receiveShadow>
        <Shape o={o} />
      </mesh>
    </group>
  )
}

// Nach dem Ziehen: zurück auf die Oberfläche schnappen, aufrecht stellen, Drehung behalten
function commit(o, obj) {
  const p = planetById(o.planet)
  const pos = obj.getWorldPosition(new THREE.Vector3())
  const dir = pos.sub(p.center).normalize()
  const q = obj.getWorldQuaternion(new THREE.Quaternion())
  const base = new THREE.Quaternion().setFromUnitVectors(UP, dir)
  const local = base.clone().invert().multiply(q)
  const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(local)
  const yaw = Math.atan2(fwd.x, fwd.z)
  const sc = obj.scale
  const size = [o.size[0] * sc.x, o.size[1] * sc.y, o.size[2] * sc.z].map((v) => Math.max(0.2, +v.toFixed(2)))
  obj.scale.set(1, 1, 1)
  return { dir: dir.toArray(), yaw, size }
}

export default function Editor() {
  const objects = useGame((s) => s.objects)
  const selected = useGame((s) => s.selected)
  const mode = useGame((s) => s.mode)
  const gizmo = useGame((s) => s.gizmo)
  const [target, setTarget] = useState(null)
  const tc = useRef(null)
  const controls = useThree((st) => st.controls)
  const gl = useThree((st) => st.gl)
  const camera = useThree((st) => st.camera)
  useEffect(() => {
    window.__kfbEditor = {
      gizmoScreen: () => {
        if (!target) return null
        const r = gl.domElement.getBoundingClientRect()
        const toScr = (v) => { const p = v.clone().project(camera); return [r.left + (p.x + 1) / 2 * r.width, r.top + (1 - p.y) / 2 * r.height] }
        const o = target.getWorldPosition(new THREE.Vector3())
        const x = new THREE.Vector3(1, 0, 0).applyQuaternion(target.getWorldQuaternion(new THREE.Quaternion()))
        return { center: toScr(o), xAxis: toScr(o.clone().addScaledVector(x, 0.9)) }
      },
    }
  }, [target, gl, camera])
  // Kamera sperren, sobald ein Gizmo-Griff angefasst wird (vor der Kamera reagieren)
  useEffect(() => {
    const el = gl.domElement
    const down = () => { if (tc.current?.axis && controls) controls.enabled = false }
    const up = () => { if (controls) controls.enabled = true }
    el.addEventListener('pointerdown', down, { capture: true })
    window.addEventListener('pointerup', up)
    return () => { el.removeEventListener('pointerdown', down, { capture: true }); window.removeEventListener('pointerup', up) }
  }, [gl, controls])
  const sel = objects.find((o) => o.id === selected)

  useEffect(() => {
    const onKey = (e) => {
      const s = useGame.getState(); if (s.mode !== 'build') return
      if (e.code === 'Delete' || e.code === 'Backspace') s.removeSelected()
      if (e.code === 'Escape') s.select(null)
      if (e.code === 'Digit1') s.setGizmo('translate')
      if (e.code === 'Digit2') s.setGizmo('rotate')
      if (e.code === 'Digit3') s.setGizmo('scale')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {objects.map((o) => (
        <group key={o.id}>
          <Visual o={o} selected={o.id === selected} setRef={setTarget} />
          <Collider key={o.v || 0} o={o} />
        </group>
      ))}
      {mode === 'build' && sel && target && (
        <TransformControls
          ref={tc}
          object={target}
          mode={gizmo}
          space="local"
          showX={gizmo !== 'rotate'}
          showY={gizmo !== 'translate'}
          showZ={gizmo !== 'rotate'}
          onMouseUp={() => useGame.getState().updateObject(sel.id, commit(sel, target))}
        />
      )}
    </>
  )
}
