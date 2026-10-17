// B1 · Prüfszene hinter dem URL-Schalter #stagetest (Vertrag §6): Billboard R2 mit Karte, davor zwei Darsteller (FrizzleBob v5) im
// ruhigen Two-Shot (eine feste Kamera, kein Schnitt). Prüfboden = schlichte Scheibe (der kompakte Clay-Boden der Bühne kommt mit G4).
// Karte per Hash: card=<deckId>:<n> (Standard forget_utopia #1, SAFE). view=two|face|q (Abnahme-Ansichten).
// Diese Szene ist Host: Kamera, Licht, Boden; Billboard und Figuren sind Module über ModuleHost.
import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import ModuleHost from './ModuleHost'
import { createBillboard, billboardLog, fitFace, BB_RES, BIOMES } from './modules/billboard'
import { createActor } from './actors/actorSlot'
import { DECKS, cardAt, cardsOfDeck } from './cards'
import { isCardSafe } from './cardMapping'
import fbUrl from './assets/actors/FB_TEMPLATE_LOOK_v5b.glb?url'
import hairUrl from './assets/actors/fb-hair/FrizzleBob_Yellow.gltf?url'
import clipsUrl from './assets/actors/Rig_Medium_General.glb?url'
import recipe from './data/actors/frizzlebob-v5b.recipe.json'
import georg from './data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json'
const pet = georg.pets.find((p) => p.id === recipe.entry.pet) // V-240: Georgs Eintrag 1:1
import earRig from './data/actors/fb-default.ear-rig.json'
import { expose } from './debug'

const decals = import.meta.glob('./assets/actors/fb-mouth/*.png', { eager: true, query: '?url', import: 'default' })
const mouthDecals = Object.fromEntries(Object.entries(decals).map(([k, v]) => [k.split('/').pop(), v]))
const hash = typeof location !== 'undefined' ? location.hash : ''
const [deckId, num] = (/card=([\w]+):(\d+)/.exec(hash) || [0, 'forget_utopia', '1']).slice(1)
const di = DECKS.findIndex((d) => d.id === deckId)
const CARD = di >= 0 ? cardsOfDeck(di).map(cardAt).find((c) => c.num === +num) || null : null
export const STAGE_VIEWS = { two: { pos: [0, 2.6, 13.5], target: [0, 2.3, 0] }, face: { pos: [0, 2.85, 6.2], target: [0, 2.85, 0] }, q: { pos: [7.5, 2.6, 9.5], target: [0, 2.3, 0] } }
const view = STAGE_VIEWS[/view=(\w+)/.exec(hash)?.[1]] || STAGE_VIEWS.two
const motion = /motion=(\w+)/.exec(hash)?.[1] || 'idle'
// Biom per Hash (biome=<Name>); Prüfstandard Moos-Insel (Rahmen orange, Pfosten braun, Boden grün = Georgs Referenz 14.10.), die Bühne wählt ihr Biom selbst
const BIOME = BIOMES.find((b) => b.name === decodeURIComponent(/biome=([^,]+)/.exec(hash)?.[1] || '')) || BIOMES[1]
const BB = { card: CARD, biome: BIOME, maxW: 7, maxH: 5, position: [0, 0, -0.6] }
const ACTOR = (x, yaw, id) => ({ recipe, pet, faceDriver: 'KFB_NATIVE', modelUrl: fbUrl, earRig, mouthDecals, hairUrl, clipsUrl, motion, position: [x, 0, 1.6], yaw, anchorId: id })
// Figuren seitlich vor der Tafel, außerhalb der Kartenbreite (W ≤ 7 m): die Karte bleibt zwischen ihnen ganz lesbar (R2 §1)
const LEFT = ACTOR(-4.2, 0.38, 'stage-left'), RIGHT = ACTOR(4.2, -0.38, 'stage-right')
let bb = null; const actors = {}
const makeBB = (o) => { bb = createBillboard(o); expose('Billboard', bb); return bb }
const makeL = (o) => { actors.left = createActor(o); expose('StageActors', actors); return actors.left }
const makeR = (o) => { actors.right = createActor(o); expose('StageActors', actors); return actors.right }

function Cam() {
  const { camera, size } = useThree()
  useEffect(() => { camera.fov = 38; camera.near = 0.05; camera.far = 400; camera.position.fromArray(view.pos); camera.lookAt(...view.target); camera.updateProjectionMatrix(); expose('StageCamera', camera) }, [camera, size])
  return null
}

export default function StageTest() {
  const ground = useMemo(() => [-Math.PI / 2, 0, 0], [])
  const [on, setOn] = useState(true)
  useEffect(() => { expose('StageTestCtl', { off: () => setOn(false), log: () => ({ ...billboardLog }), card: CARD, lib: { fitFace, BB_RES, BIOMES, createBillboard, isCardSafe }, cards: { DECKS, cardAt, cardsOfDeck } }) }, [])
  return (
    <>
      <color attach="background" args={['#bcd3e2']} />
      <Cam />
      <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
      <directionalLight position={[6, 11, 7]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
      <mesh rotation={ground} receiveShadow><circleGeometry args={[9, 64]} /><meshStandardMaterial color={BIOME.top} roughness={0.95} /></mesh>
      {on && <ModuleHost create={makeBB} options={BB} />}
      {on && <ModuleHost create={makeL} options={LEFT} />}
      {on && <ModuleHost create={makeR} options={RIGHT} />}
    </>
  )
}
