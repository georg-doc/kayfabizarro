// Bühne im Amphitheater (Vorbereitung G4) hinter dem URL-Schalter #stage: Amphitheater-Modul (V-230) auf Knet-Gelände, Billboard R2 hinten auf
// der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera, kein Schnitt; Standard cam=near, Georg 14.10.). Diese Szene ist Host: Kamera, Licht, Himmel; alles andere sind Module.
// Figuren per Hash: actors=none (Standard) | fb (FrizzleBob nach Georgs Export, V-240; beide Seiten, bis die zweite Besetzung feststeht)
// | rogue (F1-Prüffigur als Platzhalter für Stellproben, kein Darsteller). Karte: card=<deck>:<n>, Biom: biome=<Name>.
// Dialog D1 per Hash: dialog=<n> spielt n Karten des Decks der Startkarte ab (Sprechblasen an den Figuren, Spielerwahl am Bildrand).
import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { stagePaletteFor, FADE_S } from './stagePalette'
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
export const STAGE_CAMS = { two: { pos: [0, 2.7, 12.5], target: [0, 2.4, -3.5] }, wide: { pos: [0, 9, 30], target: [0, 2, -2] }, q: { pos: [9, 3.2, 9], target: [0, 2.2, -3] },
  // G4-Bildaufbau (Georg 14.10.: „near nehmen“): Kamera näher, auf Augenhöhe der Figuren, Figuren vor der Tafel. Standard seit §20.
  near: { pos: [0, 2.15, 9.2], target: [0, 2.1, -3.5] } }
const CAM = STAGE_CAMS[/cam=(\w+)/.exec(hash)?.[1]] ? /cam=(\w+)/.exec(hash)[1] : 'near'
const cam = STAGE_CAMS[CAM]
// Publikums-Anker je Kamera: 3,2 m vor der Kamera auf der Blickachse, so tief, dass Blase und Spielerwahl am unteren Bildrand sitzen (NDC y −0,9),
// nicht über der Karte. Der Anker liegt 1,05 m über playerState.pos (BubbleHost). Für cam=two ergibt das die bisherige Lage (0, 0,6, z − 3,2).
export const playerPosFor = (c, fov = 38, d = 3.2, ndcY = -0.9) => { const [px, py, pz] = c.pos, [tx, ty, tz] = c.target, L = Math.hypot(tx - px, ty - py, tz - pz), k = d / L
  return [px + (tx - px) * k, py + (ty - py) * k + ndcY * d * Math.tan((fov / 2) * Math.PI / 180) - 1.05, pz + (tz - pz) * k] }
const PLAYER_POS = playerPosFor(cam)
const ACTORS = ['none', 'fb', 'rogue'].includes(/actors=(\w+)/.exec(hash)?.[1]) ? /actors=(\w+)/.exec(hash)[1] : 'none' // unbekannter Wert → keine Figuren (Prüfer 9, Befund 7)
// Bühnen-Palette (V-245): nach der Karte (Deck-Genre → Cartoon-Palette → Rollen), Hash palette=<Kennung>|biome zum Vergleichen (Bildbogen)
const PAL_OVERRIDE = /palette=(\w+)/.exec(hash)?.[1] || null
const palFor = (card) => stagePaletteFor(card, { override: PAL_OVERRIDE, biome: BIOME })
const PAL0 = palFor(CARD)
const AMPH = { biome: BIOME, palette: PAL0?.amph || null }
const BB = { card: CARD, biome: BIOME, palette: PAL0, maxW: 7, maxH: 5, position: [0, 0, -3.5] }
const palState = { current: PAL0, log: [] } // aktuelle Palette der Bühne + Wechsel-Protokoll (Prüfung)
// Palette der Karte auf Billboard, Amphitheater und Himmel legen (weich, außer beim ersten Bild)
function applyPalette(card, fadeS = FADE_S) {
  const p = palFor(card); if (!p || p.key === palState.current?.key) return palState.current // gleiche Palette und gleicher Akzent: kein Wechsel
  palState.current = p; palState.log.push({ card: card ? card.deck.id + '#' + card.num : null, id: p.id, via: p.via, storyMode: p.storyMode })
  mods.billboard?.setPalette?.(p, fadeS); mods.amph?.setPalette?.(p.amph, fadeS); sky.set(p.sky, fadeS)
  return p
}
const ROGUE = (x, yaw, id) => ({ recipe: rogueRecipe, faceDriver: 'KFB_NATIVE', url: rogueUrl, clipsUrl, motion: 'Idle_A', profile: pick.profile, contract, height: 2.0,
  actor: { id: 'adventurer-rogue-hooded', path: pick.profile.source.path, revision: pick.profile.source.revision }, position: [x, 0, -1.4], yaw, anchorId: id })
const decals = import.meta.glob('./assets/actors/fb-mouth/*.png', { eager: true, query: '?url', import: 'default' })
const mouthDecals = Object.fromEntries(Object.entries(decals).map(([k, v]) => [k.split('/').pop(), v]))
const pet = georg.pets.find((p) => p.id === fbRecipe.entry.pet)
const FB = (x, yaw, id) => ({ recipe: fbRecipe, pet, faceDriver: 'KFB_NATIVE', modelUrl: fbUrl, earRig, mouthDecals, hairUrl, clipsUrl, motion: 'idle', position: [x, 0, -1.4], yaw, anchorId: id })
const MK = /actors=fb/.test(hash) ? FB : ROGUE
// Zweite Besetzung (F-4): cast=<actorId> stellt rechts eine KayKit-Figur mit ihrem Profil aus Georgs Batch auf (F1-Weg, kaykit-eye-adapter).
// Kandidaten: scripts/cast/build-cast.py (Profil-Auszug, Rezept, GLB-Kopie). KayKit hat keinen Sprechmund: sie spricht heute nur per Blase.
const castProfiles = import.meta.glob('./data/eyes/cast/*.profile.json', { eager: true, import: 'default' })
const castRecipes = import.meta.glob('./data/actors/cast/*.recipe.json', { eager: true, import: 'default' })
const castGlbs = import.meta.glob('./assets/actors/cast/*.glb', { eager: true, query: '?url', import: 'default' })
export const CAST_IDS = Object.keys(castRecipes).map((k) => k.split('/').pop().replace('.recipe.json', ''))
const CAST_ID = CAST_IDS.includes(/cast=([\w-]+)/.exec(hash)?.[1]) ? /cast=([\w-]+)/.exec(hash)[1] : null
const KAYKIT = (id) => {
  const recipe = castRecipes[`./data/actors/cast/${id}.recipe.json`], pickC = castProfiles[`./data/eyes/cast/${id}.profile.json`], ref = recipe.composition.modelRef
  const url = castGlbs[`./assets/actors/cast/${ref.path.split('/').pop()}`]
  return (x, yaw, anchorId) => ({ recipe, faceDriver: 'KFB_NATIVE', url, clipsUrl, motion: 'Idle_A', profile: pickC.profile, contract, classScale: fbRecipe.stage.scale, // gleicher Klassen-Faktor wie FrizzleBob (Rig_Medium, P08 CLASS_K 0,947)
   
    actor: { id, path: ref.path, revision: ref.revision }, position: [x, 0, -1.4], yaw, anchorId })
}
const MKR = CAST_ID ? KAYKIT(CAST_ID) : MK
// Marken der Figuren je Stellung (Bühnenmitte = Ursprung, +z zum Publikum): near = G4-Standard vor der Tafel (Georg 14.10.), two = bisherige Stellung
export const STAGE_MARKS = Object.freeze({
  near: Object.freeze({ left: Object.freeze({ x: -3.7, z: 1.2, yaw: 0.45 }), right: Object.freeze({ x: 3.7, z: 1.2, yaw: -0.45 }) }),
  two: Object.freeze({ left: Object.freeze({ x: -4.2, z: -1.4, yaw: 0.35 }), right: Object.freeze({ x: 4.2, z: -1.4, yaw: -0.35 }) }),
})
// Stellung: place=near (Figuren vor der Tafel, enger; Standard) | place=two (bisherige Stellung hinten). Ohne Angabe folgt sie der Kamera (cam=two → two).
const NEAR = (/place=(\w+)/.exec(hash)?.[1] || (CAM === 'two' ? 'two' : 'near')) === 'near'
const at = (mk, m, id) => ({ ...mk(m.x, m.yaw, id), position: [m.x, 0, m.z] }), MARKS = STAGE_MARKS[NEAR ? 'near' : 'two']
const L = at(MK, MARKS.left, 'stage-left'), R = at(MKR, MARKS.right, 'stage-right')
const NDIALOG = /actors=none|^(?!.*actors=)/.test(hash) ? 0 : +(/dialog=(\d+)/.exec(hash)?.[1] || 0) // Dialog nur mit Figuren (sonst Blasen ohne Anker)
const DECK = di >= 0 ? cardsOfDeck(di).map(cardAt).filter((c) => c.num >= +num).slice(0, NDIALOG) : []
const mods = {}
// Ports des Dialogs: werden beim Aufruf aufgelöst (die Module entstehen nacheinander über ModuleHost)
const DIALOG = {
  cards: DECK,
  get reader() { return getReader() },
  billboard: { setCard: (c) => { applyPalette(c); return mods.billboard.setCard(c) } }, // Kartenwechsel = Palettenwechsel (V-245)
  actors: { get left() { return mods.left }, get right() { return mods.right } },
  say: (anchor, line) => useGame.getState().say(anchor, line),
  openChoice: () => { useGame.getState().openChoice(); return useGame.getState().choice?.id ?? null },
  closeChoice: () => useGame.getState().closeChoice(),
  // Figuren bereit = geladen UND im Bild (FrizzleBob erscheint erst nach Kontaktschatten + Ruhe-Clip; G4-Vorprobe: erste Zeile kam vor der Figur)
  isReady: () => isPoolReady() && mods.amph?.status().status === 'OK' && mods.billboard?.info()?.source === 'CARD' && (ACTORS === 'none' || [mods.left, mods.right].every((a) => a?.status().status === 'OK' && a.status().shown !== false)),
}
const mk = (k, f) => (o) => { mods[k] = f(o); expose('StageMods', mods); return mods[k] }
const makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makeL = mk('left', createActor), makeR = mk('right', createActor)
const makeDialog = (o) => { const d = createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), silence: () => o.reader.silence() } }); mods.dialog = d; expose('StageMods', mods); return d }

// Himmel (V-245, färbt mit): Kuppel mit Verlauf skyBottom → skyTop aus den Rollen; Nebel = skyBottom. Wechsel weich (V-011).
const sky = (() => {
  const top = new THREE.Color(PAL0?.sky.top || '#bcd7ea'), bottom = new THREE.Color(PAL0?.sky.bottom || '#bcd7ea'), F = { on: false, t: 0, dur: 0, a: null, b: null }
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: top }, bottom: { value: bottom } },
    vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying float h; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.02, 0.55, h)), 1.0); }' })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat); mesh.name = 'sky'; mesh.renderOrder = -1
  return { mesh, top, bottom, state: () => ({ top: '#' + top.getHexString(), bottom: '#' + bottom.getHexString(), fading: F.on }),
    set(sk, fadeS) { const b = { top: new THREE.Color(sk.top), bottom: new THREE.Color(sk.bottom) }; if (!(fadeS > 0)) { top.copy(b.top); bottom.copy(b.bottom); F.on = false; return } Object.assign(F, { on: true, t: 0, dur: fadeS, a: { top: top.clone(), bottom: bottom.clone() }, b }) },
    step(dt) { if (!F.on) return; F.t = Math.min(F.dur, F.t + dt); const u = F.t / F.dur, k = u * u * (3 - 2 * u); top.copy(F.a.top).lerp(F.b.top, k); bottom.copy(F.a.bottom).lerp(F.b.bottom, k); if (u >= 1) F.on = false } }
})()
function Sky() {
  useFrame((st, dt) => { sky.step(Math.min(dt, 0.1)); sky.mesh.position.copy(st.camera.position); if (st.scene.fog) st.scene.fog.color.copy(sky.bottom) })
  return <primitive object={sky.mesh} />
}

function Cam() {
  const { camera, size } = useThree()
  useEffect(() => { camera.fov = 38; camera.near = 0.1; camera.far = 600; camera.position.fromArray(cam.pos); camera.lookAt(...cam.target); camera.updateProjectionMatrix(); expose('StageCamera', camera) }, [camera, size])
  return null
}

export default function Stage() {
  // Die Spielerwahl der Bühne: Zurufe des Publikums erscheinen als Blase vorn am Bildrand (Anker „player“ vor der Kamera).
  // Nur solange die Bühne steht; beim Abbau zurück (Prüfer 8, Befund 6: kein Seiteneffekt beim Import).
  useEffect(() => { const prev = playerState.pos.clone(); playerState.pos.set(...PLAYER_POS); return () => { playerState.pos.copy(prev) } }, [])
  useEffect(() => { expose('StageCtl', { log: () => ({ amph: { ...amphLog } }), biome: BIOME, card: CARD, cams: STAGE_CAMS, deck: DECK, palette: () => palState.current, palLog: () => palState.log.slice(), sky: () => sky.state(), applyPalette }) }, [])
  // Ergebnis der Spielerwahl → Dialog (Store-Ereignis lastChoice)
  useEffect(() => useGame.subscribe((s, p) => { if (s.lastChoice && s.lastChoice !== p.lastChoice) mods.dialog?.onChoice(s.lastChoice) }), [])
  const sun = useMemo(() => [18, 30, 22], [])
  return (
    <>
      <color attach="background" args={[PAL0?.sky.bottom || '#bcd7ea']} />
      <fog attach="fog" args={[PAL0?.sky.bottom || '#bcd7ea', 80, 260]} />
      <Sky />
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
