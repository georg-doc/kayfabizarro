// Bühne im Amphitheater (Vorbereitung G4) hinter dem URL-Schalter #stage: Amphitheater-Modul (V-230) auf Knet-Gelände, Billboard R2 hinten auf
// der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera, kein Schnitt). Diese Szene ist Host: Kamera, Licht, Himmel; alles andere sind Module.
// Figuren per Hash: actors=none (Standard) | fb (FrizzleBob nach Georgs Export, V-240; beide Seiten, bis die zweite Besetzung feststeht)
// | rogue (F1-Prüffigur als Platzhalter für Stellproben, kein Darsteller). Karte: card=<deck>:<n>, Biom: biome=<Name>.
// Dialog D1 per Hash: dialog=<n> spielt n Karten des Decks der Startkarte ab (Sprechblasen an den Figuren, Spielerwahl am Bildrand).
import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import ModuleHost from './ModuleHost'
import { createAmphitheater, amphLog } from './modules/amphitheater'
import { createBillboard, BIOMES } from './modules/billboard'
import { createActor } from './actors/actorSlot'
import { createDialog } from './modules/dialog'
import BubbleHost from './BubbleHost'
import ChoiceHost from './ChoiceHost'
import { getReader, isPoolReady } from './dialogText'
import { useGame } from './store'
import { playerState } from './world'
import { DECKS, cardAt, cardsOfDeck } from './cards'
import rogueUrl from './assets/actors/Rogue_Hooded.glb?url'
import clipsUrl from './assets/actors/Rig_Medium_General.glb?url'
import pick from './data/eyes/rogue-hooded.profile.json'
import contract from './data/eyes/kfb-pet-graft-driver.v4.json'
import rogueRecipe from './data/actors/rogue-hooded.recipe.json'
import fbUrl from './assets/actors/FB_TEMPLATE_LOOK_v5b.glb?url'
import hairUrl from './assets/actors/fb-hair/FrizzleBob_Yellow.gltf?url'
import fbRecipe from './data/actors/frizzlebob-v5b.recipe.json'
import georg from './data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json'
import earRig from './data/actors/fb-default.ear-rig.json'
import { expose } from './debug'

const hash = typeof location !== 'undefined' ? location.hash : ''
const [deckId, num] = (/card=([\w]+):(\d+)/.exec(hash) || [0, 'forget_utopia', '1']).slice(1)
const di = DECKS.findIndex((d) => d.id === deckId)
const CARD = di >= 0 ? cardsOfDeck(di).map(cardAt).find((c) => c.num === +num) || null : null
const BIOME = BIOMES.find((b) => b.name === decodeURIComponent(/biome=([^,]+)/.exec(hash)?.[1] || '')) || BIOMES[1]
export const STAGE_CAMS = { two: { pos: [0, 2.7, 12.5], target: [0, 2.4, -3.5] }, wide: { pos: [0, 9, 30], target: [0, 2, -2] }, q: { pos: [9, 3.2, 9], target: [0, 2.2, -3] } }
const cam = STAGE_CAMS[/cam=(\w+)/.exec(hash)?.[1]] || STAGE_CAMS.two
const ACTORS = ['none', 'fb', 'rogue'].includes(/actors=(\w+)/.exec(hash)?.[1]) ? /actors=(\w+)/.exec(hash)[1] : 'none' // unbekannter Wert → keine Figuren (Prüfer 9, Befund 7)
const AMPH = { biome: BIOME }
const BB = { card: CARD, biome: BIOME, maxW: 7, maxH: 5, position: [0, 0, -3.5] }
const ROGUE = (x, yaw, id) => ({ recipe: rogueRecipe, faceDriver: 'KFB_NATIVE', url: rogueUrl, clipsUrl, motion: 'Idle_A', profile: pick.profile, contract, height: 2.0,
  actor: { id: 'adventurer-rogue-hooded', path: pick.profile.source.path, revision: pick.profile.source.revision }, position: [x, 0, -1.4], yaw, anchorId: id })
const decals = import.meta.glob('./assets/actors/fb-mouth/*.png', { eager: true, query: '?url', import: 'default' })
const mouthDecals = Object.fromEntries(Object.entries(decals).map(([k, v]) => [k.split('/').pop(), v]))
const pet = georg.pets.find((p) => p.id === fbRecipe.entry.pet)
const FB = (x, yaw, id) => ({ recipe: fbRecipe, pet, faceDriver: 'KFB_NATIVE', modelUrl: fbUrl, earRig, mouthDecals, hairUrl, clipsUrl, motion: 'idle', position: [x, 0, -1.4], yaw, anchorId: id })
const MK = /actors=fb/.test(hash) ? FB : ROGUE
const L = MK(-4.2, 0.35, 'stage-left'), R = MK(4.2, -0.35, 'stage-right')
const NDIALOG = /actors=none|^(?!.*actors=)/.test(hash) ? 0 : +(/dialog=(\d+)/.exec(hash)?.[1] || 0) // Dialog nur mit Figuren (sonst Blasen ohne Anker)
const DECK = di >= 0 ? cardsOfDeck(di).map(cardAt).filter((c) => c.num >= +num).slice(0, NDIALOG) : []
const mods = {}
// Ports des Dialogs: werden beim Aufruf aufgelöst (die Module entstehen nacheinander über ModuleHost)
const DIALOG = {
  cards: DECK,
  get reader() { return getReader() },
  billboard: { setCard: (c) => mods.billboard.setCard(c) },
  actors: { get left() { return mods.left }, get right() { return mods.right } },
  say: (anchor, line) => useGame.getState().say(anchor, line),
  openChoice: () => { useGame.getState().openChoice(); return useGame.getState().choice?.id ?? null },
  closeChoice: () => useGame.getState().closeChoice(),
  isReady: () => isPoolReady() && mods.amph?.status().status === 'OK' && mods.billboard?.info()?.source === 'CARD' && (ACTORS === 'none' || (mods.left?.status().status === 'OK' && mods.right?.status().status === 'OK')),
}
const mk = (k, f) => (o) => { mods[k] = f(o); expose('StageMods', mods); return mods[k] }
const makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makeL = mk('left', createActor), makeR = mk('right', createActor)
const makeDialog = (o) => { const d = createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), silence: () => o.reader.silence() } }); mods.dialog = d; expose('StageMods', mods); return d }

function Cam() {
  const { camera, size } = useThree()
  useEffect(() => { camera.fov = 38; camera.near = 0.1; camera.far = 600; camera.position.fromArray(cam.pos); camera.lookAt(...cam.target); camera.updateProjectionMatrix(); expose('StageCamera', camera) }, [camera, size])
  return null
}

export default function Stage() {
  // Die Spielerwahl der Bühne: Zurufe des Publikums erscheinen als Blase vorn am Bildrand (Anker „player“ vor der Kamera).
  // Nur solange die Bühne steht; beim Abbau zurück (Prüfer 8, Befund 6: kein Seiteneffekt beim Import).
  useEffect(() => { const prev = playerState.pos.clone(); playerState.pos.set(0, 0.6, cam.pos[2] - 3.2); return () => { playerState.pos.copy(prev) } }, [])
  useEffect(() => { expose('StageCtl', { log: () => ({ amph: { ...amphLog } }), biome: BIOME, card: CARD, cams: STAGE_CAMS, deck: DECK }) }, [])
  // Ergebnis der Spielerwahl → Dialog (Store-Ereignis lastChoice)
  useEffect(() => useGame.subscribe((s, p) => { if (s.lastChoice && s.lastChoice !== p.lastChoice) mods.dialog?.onChoice(s.lastChoice) }), [])
  const sun = useMemo(() => [18, 30, 22], [])
  return (
    <>
      <color attach="background" args={['#bcd7ea']} />
      <fog attach="fog" args={['#bcd7ea', 80, 260]} />
      <Cam />
      <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
      <directionalLight position={sun} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0002} />
      <ModuleHost create={makeAmph} options={AMPH} />
      <ModuleHost create={makeBB} options={BB} />
      {ACTORS !== 'none' && <ModuleHost create={makeL} options={L} />}
      {ACTORS !== 'none' && <ModuleHost create={makeR} options={R} />}
      {NDIALOG > 0 && <ModuleHost create={makeDialog} options={DIALOG} />}
      {NDIALOG > 0 && <BubbleHost />}
      {NDIALOG > 0 && <ChoiceHost />}
    </>
  )
}
