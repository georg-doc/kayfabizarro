// F1 · Prüfszene hinter dem URL-Schalter #eyetest (Vertrag §6): Studio-Frontansicht nachgestellt, damit das Bildpaar
// „Studio | R3F“ aus derselben Kamera entsteht. Kamera, Licht und Hintergrund wie eye-rig-batch app.js Z. 805–825 / setView('front').
// Diese Szene ist Host: sie besitzt Kamera und Licht; die Figur ist ein Modul über ModuleHost.
import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import ModuleHost from './ModuleHost'
import { createEyeActor, eyeActorLog } from './modules/eyeActor'
import rogueUrl from './assets/actors/Rogue_Hooded.glb?url'
import clipsUrl from './assets/actors/Rig_Medium_General.glb?url'
import pick from './data/eyes/rogue-hooded.profile.json'
import contract from './data/eyes/kfb-pet-graft-driver.v4.json'
import { expose } from './debug'

const motion = typeof location !== 'undefined' && /motion=(\w+)/.exec(location.hash)?.[1] || 'bind'
const OPTIONS = {
  url: rogueUrl, clipsUrl, motion, profile: pick.profile, contract, height: 2.65, anchorId: 'eyetest-actor',
  actor: { id: 'adventurer-rogue-hooded', path: pick.profile.source.path, revision: pick.profile.source.revision },
}
let lastActor = null
const create = (o) => { lastActor = createEyeActor(o); expose('EyeActor', lastActor); return lastActor }

function StudioCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.fov = 28; camera.near = 0.01; camera.far = 100
    camera.position.set(0, 1.48, 5.25); camera.lookAt(0, 1.42, 0); camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

export default function EyeTest() {
  const ground = useMemo(() => [-Math.PI / 2, 0, 0], [])
  const [on, setOn] = useState(true)
  const [, force] = useState(0)
  useEffect(() => { expose('EyeTestCtl', { off: () => setOn(false), rerender: () => force((n) => n + 1), log: () => ({ ...eyeActorLog }) }) }, [])
  return (
    <>
      <color attach="background" args={['#d8d2c8']} />
      <StudioCamera />
      <hemisphereLight args={[0xffffff, 0x6c6973, 2.1]} />
      <directionalLight position={[3.4, 5.8, 4.2]} intensity={2.5} castShadow />
      <directionalLight position={[-4, 2.6, 2.2]} intensity={1.2} color={0xffdeda} />
      <directionalLight position={[1.5, 3, -5]} intensity={1.0} color={0xdde7ff} />
      <mesh rotation={ground} position={[0, 0.002, 0]} receiveShadow><circleGeometry args={[2.5, 64]} /><shadowMaterial color={0x382f2a} opacity={0.16} transparent /></mesh>
      {on && <ModuleHost create={create} options={OPTIONS} />}
    </>
  )
}
