// Darsteller-Slot · Prüfszene hinter dem URL-Schalter #actortest (Vertrag §6). Licht und Kamera wie die ToolBox P06
// (HemisphereLight 0xfff4e0/0x3a3226 1,25 · Sonne 0xffffff 1,8 bei (6, 11, 7) · fov 38 · keine Tonabbildung), damit das Bildpaar
// „ToolBox | R3F“ aus derselben Kamera entsteht. Kamera-Ansicht per Hash: view=face|full|q (¾).
// Diese Szene ist Host: sie besitzt Kamera und Licht; die Figur kommt über den Darsteller-Slot (createActor) als Modul.
import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import ModuleHost from './ModuleHost'
import { createActor } from './actors/actorSlot'
import { faceActorLog } from './modules/faceMountActor'
import fbUrl from './assets/actors/FB_TEMPLATE_LOOK_v5b.glb?url'
import hairUrl from './assets/actors/fb-hair/FrizzleBob_Yellow.gltf?url'
import clipsUrl from './assets/actors/Rig_Medium_General.glb?url'
import recipe from './data/actors/frizzlebob-v5b.recipe.json'
import georg from './data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json'
const pet = georg.pets.find((p) => p.id === recipe.entry.pet) // V-240: Georgs Eintrag 1:1
import earRig from './data/actors/fb-default.ear-rig.json'
import { expose } from './debug'

const decals = import.meta.glob('./assets/actors/fb-mouth/*.png', { eager: true, query: '?url', import: 'default' })
const mouthDecals = Object.fromEntries(Object.entries(decals).map(([k, v]) => [k.split('/').pop(), v])) // lokale Kopien, main @ac9dbaed

const hash = typeof location !== 'undefined' ? location.hash : ''
export const VIEWS = { face: { pos: [0, 1.62, 2.9], target: [0, 1.5, 0] }, full: { pos: [0, 1.7, 8.2], target: [0, 1.3, 0] }, q: { pos: [2.05, 1.62, 2.05], target: [0, 1.5, 0] }, side: { pos: [2.9, 1.62, 0], target: [0, 1.5, 0] } }
const view = VIEWS[/view=(\w+)/.exec(hash)?.[1]] || VIEWS.face
const motion = /motion=(\w+)/.exec(hash)?.[1] || 'bind'
// donor: Bildpaar gegen den P08-Spender – Modellfarben (im Spiel Exportfarben, WS0 14.10.) und Modellmund in Ruhe (im Spiel mouth.rest, V-243)
const DONOR = /(^|,)donor(,|$)/.test(hash.slice(1)), partColors = DONOR ? 'model' : 'export'
const OPTIONS = { recipe, pet, faceDriver: 'KFB_NATIVE', modelUrl: fbUrl, earRig, mouthDecals, hairUrl, clipsUrl, motion, partColors, ...(DONOR ? { mouthRest: null } : {}), anchorId: 'actortest-fb' }
let last = null
const create = (o) => { last = createActor(o); expose('Actor', last); return last }

function Cam() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.fov = 38; camera.near = 0.005; camera.far = 600
    camera.position.fromArray(view.pos); camera.lookAt(...view.target); camera.updateProjectionMatrix(); expose('ActorCamera', camera)
  }, [camera, size])
  return null
}

export default function ActorTest() {
  const [on, setOn] = useState(true)
  const [, force] = useState(0)
  useEffect(() => { expose('ActorTestCtl', { off: () => setOn(false), rerender: () => force((n) => n + 1), log: () => ({ ...faceActorLog }), createActor, recipe, options: OPTIONS }) }, [])
  return (
    <>
      <color attach="background" args={['#d8d2c8']} />
      <Cam />
      <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
      <directionalLight position={[6, 11, 7]} intensity={1.8} />
      {on && <ModuleHost create={create} options={OPTIONS} />}
    </>
  )
}
