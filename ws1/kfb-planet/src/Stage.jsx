// Bühne im Amphitheater (Vorbereitung G4) hinter dem URL-Schalter #stage: Amphitheater-Modul (V-230) auf Knet-Gelände, Billboard R2 hinten auf
// der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera, kein Schnitt; Standard cam=near, Georg 14.10.). Diese Szene ist Host: Kamera, Licht, Himmel; alles andere sind Module.
// Figuren per Hash: actors=none (Standard) | fb (FrizzleBob nach Georgs Export, V-240, links; rechts GothGirl V-269, cast=fb für beidseitig FrizzleBob)
// | rogue (F1-Prüffigur als Platzhalter für Stellproben, kein Darsteller). Karte: card=<deck>:<n>, Biom: biome=<Name>.
// Dialog D1 per Hash: dialog=<n> spielt n Karten des Decks der Startkarte ab (Sprechblasen an den Figuren, Spielerwahl am Bildrand).
import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { stagePaletteFor, FADE_S } from './stagePalette'
import { preferDriftFree } from './cardDrift'
import ModuleHost from './ModuleHost'
import { createAmphitheater, amphLog } from './modules/amphitheater'
import { createBillboard, BIOMES } from './modules/billboard'
import { createActor } from './actors/actorSlot'
import { createDialog } from './modules/dialog'
import { createMeshyScene, MESHY_STAGES, stageCamera } from './modules/meshyStage'
import BubbleHost from './BubbleHost'
import ChoiceHost from './ChoiceHost'
import { getReader, isPoolReady, PREVIEW } from './dialogText'
import { useGame } from './store'
import { playerState } from './world'
import { DECKS, cardAt, cardsOfDeck } from './cards'
import { isCardSafe } from './cardMapping'
import { expose } from './debug'
import { ROGUE, FB, KAYKIT, CAST_IDS } from './actors/stageCast'
import { StageOrbitCam, ORBIT } from './StageOrbitCam'
export { ORBIT } // Prüfungen lesen die Kamera-Werte wie bisher über Stage

const hash = typeof location !== 'undefined' ? location.hash : ''
const [deckId, num] = (/card=([\w]+):(\d+)/.exec(hash) || [0, 'forget_utopia', '1']).slice(1)
const di = DECKS.findIndex((d) => d.id === deckId)
const findCard = (d, n) => { const i = DECKS.findIndex((x) => x.id === d); return i >= 0 ? cardsOfDeck(i).map(cardAt).find((c) => c.num === n) || null : null }
// Vorschau-Text G4 (F-3a, Schalter preview=g4): die drei Karten in Georgs Reihenfolge aus dem Vorschau-Pool (sets[0]); sonst wie bisher
export const PREVIEW_CARDS = PREVIEW ? PREVIEW.sets[0].orderedBeatIds.map((id) => { const [d, n] = id.split(':'); return findCard(d, +n) }).filter(Boolean) : null
const CARD = PREVIEW_CARDS?.[0] || (di >= 0 ? cardsOfDeck(di).map(cardAt).find((c) => c.num === +num) || null : null)
const BIOME = BIOMES.find((b) => b.name === decodeURIComponent(/biome=([^,]+)/.exec(hash)?.[1] || '')) || BIOMES[1]
export const STAGE_CAMS = { two: { pos: [0, 2.7, 12.5], target: [0, 2.4, -3.5] }, wide: { pos: [0, 9, 30], target: [0, 2, -2] }, q: { pos: [9, 3.2, 9], target: [0, 2.2, -3] },
  // G4-Bildaufbau (Georg 14.10.: „near nehmen“): Kamera näher, auf Augenhöhe der Figuren, Figuren vor der Tafel. Standard seit §20.
  near: { pos: [0, 2.15, 9.2], target: [0, 2.1, -3.5] } }
const CAM = STAGE_CAMS[/cam=(\w+)/.exec(hash)?.[1]] ? /cam=(\w+)/.exec(hash)[1] : 'near'
// Meshy-Bühne statt Amphitheater (Vorschau, Georg 15.10.): scene=comic | utopia. Kamera aus der Slot-Datei (WS0), Karte auf der Bildfläche im Modell.
const SCENE = MESHY_STAGES[/scene=(\w+)/.exec(hash)?.[1]] ? /scene=(\w+)/.exec(hash)[1] : null
const SCENE_S = SCENE ? (+(/sscale=([\d.]+)/.exec(hash)?.[1]) || MESHY_STAGES[SCENE].s) : null // Abstimmen per sscale=<m/u>; Standard = Slot-Datei (WS0)
const SCENE_CAM = SCENE ? stageCamera(MESHY_STAGES[SCENE], SCENE_S) : null
const cam = SCENE_CAM || STAGE_CAMS[CAM]
// Publikums-Anker je Kamera: 3,2 m vor der Kamera auf der Blickachse, so tief, dass Blase und Spielerwahl am unteren Bildrand sitzen (NDC y −0,9),
// nicht über der Karte. Der Anker liegt 1,05 m über playerState.pos (BubbleHost). Für cam=two ergibt das die bisherige Lage (0, 0,6, z − 3,2).
export const playerPosFor = (c, fov = 38, d = 3.2, ndcY = -0.9) => { const [px, py, pz] = c.pos, [tx, ty, tz] = c.target, L = Math.hypot(tx - px, ty - py, tz - pz), k = d / L
  return [px + (tx - px) * k, py + (ty - py) * k + ndcY * d * Math.tan((fov / 2) * Math.PI / 180) - 1.05, pz + (tz - pz) * k] }
const PLAYER_POS = playerPosFor(cam)
const ACTORS = ['none', 'fb', 'rogue'].includes(/actors=(\w+)/.exec(hash)?.[1]) ? /actors=(\w+)/.exec(hash)[1] : 'none' // unbekannter Wert → keine Figuren (Prüfer 9, Befund 7)
// Bühnen-Palette (V-270): nach der Karte (Deck-Genre → Insel-Palette → Rollen, Story-Tint), Hash palette=<Insel> zum Vergleichen, plain = ohne Tint (Bildpaar)
const PAL_OVERRIDE = /palette=(\w+)/.exec(hash)?.[1] || null
const PAL_PLAIN = /(^|,)plain(,|$)/.test(hash.replace(/^#/, ''))
const PAL_VARIANT = /palv=b/.test(hash) ? 'b' : 'a' // Variante B (§36): Rolle je Bühnenteil wie Joyride
const palFor = (card) => stagePaletteFor(card, { override: PAL_OVERRIDE, noTint: PAL_PLAIN, variant: PAL_VARIANT })
const PAL0 = palFor(CARD)
const AMPH = { biome: BIOME, palette: PAL0?.amph || null }
const MESHY_OPTS = SCENE ? { stage: SCENE, scale: SCENE_S } : null
const BB = { card: CARD, biome: BIOME, palette: PAL0, maxW: 7, maxH: 5, position: [0, 0, -3.5] }
const palState = { current: PAL0, log: [] } // aktuelle Palette der Bühne + Wechsel-Protokoll (Prüfung)
// Palette der Karte auf Billboard, Amphitheater und Himmel legen (weich, außer beim ersten Bild)
function applyPalette(card, fadeS = FADE_S) {
  const p = palFor(card); if (!p || p.key === palState.current?.key) return palState.current // gleiche Palette und gleicher Akzent: kein Wechsel
  palState.current = p; palState.log.push({ card: card ? card.deck.id + '#' + card.num : null, id: p.id, via: p.via, storyMode: p.storyMode })
  mods.billboard?.setPalette?.(p, fadeS); mods.amph?.setPalette?.(p.amph, fadeS); sky.set(p.sky, fadeS)
  return p
}
const MK = /actors=fb/.test(hash) ? FB : ROGUE
// Standard (V-269, Georg 15.10.): rechts GothGirl, sobald FrizzleBob links steht; cast=<id> wählt einen anderen Kandidaten, cast=fb lässt FrizzleBob beidseitig
export { CAST_IDS } // für Prüfungen und Skripte wie bisher
const CAST_ARG = /cast=([\w-]+)/.exec(hash)?.[1] || null
const CAST_ID = CAST_ARG === 'fb' ? null : CAST_IDS.includes(CAST_ARG) ? CAST_ARG : /actors=fb/.test(hash) ? 'gothgirl' : null
const MKR = CAST_ID ? KAYKIT(CAST_ID) : MK
// Marken der Figuren je Stellung (Bühnenmitte = Ursprung, +z zum Publikum): near = G4-Standard vor der Tafel (Georg 14.10.), two = bisherige Stellung
// Marken je Meshy-Bühne in Modell-Einheiten u (skalieren mit dem Bühnen-Maßstab mit): freie Fläche vor der Kartenwand laut Kamera-Notiz der Slot-Datei
export const SCENE_MARKS = Object.freeze({
  comic: Object.freeze({ left: Object.freeze({ x: -0.58, z: -0.22, yaw: 0.35 }), right: Object.freeze({ x: 0.14, z: -0.28, yaw: -0.35 }) }),
  utopia: Object.freeze({ left: Object.freeze({ x: -0.3, z: 0.08, yaw: 0.35 }), right: Object.freeze({ x: 0.2, z: 0.08, yaw: -0.35 }) }),
})
const sceneMark = (m) => ({ ...m, x: m.x * SCENE_S, z: m.z * SCENE_S })
export const STAGE_MARKS = Object.freeze({
  near: Object.freeze({ left: Object.freeze({ x: -3.7, z: 1.2, yaw: 0.45 }), right: Object.freeze({ x: 3.7, z: 1.2, yaw: -0.45 }) }),
  two: Object.freeze({ left: Object.freeze({ x: -4.2, z: -1.4, yaw: 0.35 }), right: Object.freeze({ x: 4.2, z: -1.4, yaw: -0.35 }) }),
})
// Stellung: place=near (Figuren vor der Tafel, enger; Standard) | place=two (bisherige Stellung hinten). Ohne Angabe folgt sie der Kamera (cam=two → two).
const NEAR = (/place=(\w+)/.exec(hash)?.[1] || (CAM === 'two' ? 'two' : 'near')) === 'near'
const at = (mk, m, id) => ({ ...mk(m.x, m.yaw, id), position: [m.x, 0, m.z] }), MARKS = SCENE ? { left: sceneMark(SCENE_MARKS[SCENE].left), right: sceneMark(SCENE_MARKS[SCENE].right) } : STAGE_MARKS[NEAR ? 'near' : 'two']
const L = at(MK, MARKS.left, 'stage-left'), R = at(MKR, MARKS.right, 'stage-right')
const NDIALOG = /actors=none|^(?!.*actors=)/.test(hash) ? 0 : PREVIEW_CARDS ? PREVIEW_CARDS.length : +(/dialog=(\d+)/.exec(hash)?.[1] || 0) // Dialog nur mit Figuren (sonst Blasen ohne Anker)
// Dialog-Karten ab der Startkarte; drift-freie Seiten bevorzugt (WS0 zu §24.2, Auswahl statt Beschnitt), die Vorschau behält Georgs Reihenfolge
const DECK = PREVIEW_CARDS || (di >= 0 ? preferDriftFree(cardsOfDeck(di).map(cardAt).filter((c) => c.num >= +num), NDIALOG) : [])
const mods = {}
// Ports des Dialogs: werden beim Aufruf aufgelöst (die Module entstehen nacheinander über ModuleHost)
const DIALOG = {
  cards: DECK,
  get reader() { return getReader() },
  billboard: { setCard: (c) => { applyPalette(c); return mods.billboard.setCard(c) } }, // Kartenwechsel = Palettenwechsel (V-245/V-270)
  actors: { get left() { return mods.left }, get right() { return mods.right } },
  say: (anchor, line) => useGame.getState().say(anchor, line),
  openChoice: () => { useGame.getState().openChoice(); return useGame.getState().choice?.id ?? null },
  closeChoice: () => useGame.getState().closeChoice(),
  // Figuren bereit = geladen UND im Bild (FrizzleBob erscheint erst nach Kontaktschatten + Ruhe-Clip; G4-Vorprobe: erste Zeile kam vor der Figur)
  // Billboard bereit = echtes Kartenbild, oder Platzhalter mit Drucktext, wenn die Karte nicht gesichert ist (F-3a: so gewollt, sonst begänne der Dialog nie)
  isReady: () => isPoolReady() && mods.amph?.status().status === 'OK' && billboardReady() && (ACTORS === 'none' || [mods.left, mods.right].every((a) => a?.status().status === 'OK' && a.status().shown !== false)),
}
function billboardReady() { const i = mods.billboard?.info(); if (!i) return false; const c = DECK[0] || CARD; return i.source === 'CARD' || (i.source === 'PLACEHOLDER' && !!c && !isCardSafe(c.deck.id, c.num)) }
const mk = (k, f) => (o) => { mods[k] = f(o); expose('StageMods', mods); return mods[k] }
// Meshy-Bühne: Bühnen-Modul mit Bildflächen-Inhalt auf ihrem Slot (meshyStage.createMeshyScene); `amph` = Bühne, `billboard` = Bildfläche wie beim Billboard
const makeMeshy = (o) => { const { stage, screen } = createMeshyScene({ ...o, card: CARD }); mods.amph = stage; mods.billboard = screen; expose('StageMods', mods); return stage }
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


export default function Stage() {
  // Die Spielerwahl der Bühne: Zurufe des Publikums erscheinen als Blase vorn am Bildrand (Anker „player“ vor der Kamera).
  // Nur solange die Bühne steht; beim Abbau zurück (Prüfer 8, Befund 6: kein Seiteneffekt beim Import).
  useEffect(() => { const prev = playerState.pos.clone(); playerState.pos.set(...PLAYER_POS); return () => { playerState.pos.copy(prev) } }, [])
  // Kennzeichnung der Vorschau im Bild (F-3a: nicht ACCEPTED)
  useEffect(() => { if (!PREVIEW) return undefined; const d = document.createElement('div'); d.id = 'kfb-preview-badge'
    d.style.cssText = 'position:fixed;left:16px;top:14px;padding:6px 12px;border-radius:10px;background:rgba(40,28,16,.72);color:#ffe9b8;font:600 15px/1.2 system-ui,sans-serif;z-index:9000;pointer-events:none'
    d.textContent = 'Vorschau-Text · Georgs Fassungen · nicht abgenommen'; document.body.appendChild(d); return () => d.remove() }, [])
  useEffect(() => { expose('StageCtl', { log: () => ({ amph: { ...amphLog } }), biome: BIOME, card: CARD, cams: STAGE_CAMS, deck: DECK, palette: () => palState.current, palLog: () => palState.log.slice(), sky: () => sky.state(), applyPalette }) }, [])
  // Ergebnis der Spielerwahl → Dialog (Store-Ereignis lastChoice)
  useEffect(() => useGame.subscribe((s, p) => { if (s.lastChoice && s.lastChoice !== p.lastChoice) mods.dialog?.onChoice(s.lastChoice) }), [])
  const sun = useMemo(() => [18, 30, 22], [])
  return (
    <>
      <color attach="background" args={[PAL0?.sky.bottom || '#bcd7ea']} />
      <fog attach="fog" args={[PAL0?.sky.bottom || '#bcd7ea', 80, 260]} />
      <Sky />
      <StageOrbitCam view={cam} />
      <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
      <directionalLight position={sun} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0002} />
      {SCENE ? <ModuleHost create={makeMeshy} options={MESHY_OPTS} /> : <ModuleHost create={makeAmph} options={AMPH} />}
      {!SCENE && <ModuleHost create={makeBB} options={BB} />}
      {ACTORS !== 'none' && <ModuleHost create={makeL} options={L} />}
      {ACTORS !== 'none' && <ModuleHost create={makeR} options={R} />}
      {NDIALOG > 0 && <ModuleHost create={makeDialog} options={DIALOG} />}
      {NDIALOG > 0 && <BubbleHost />}
      {NDIALOG > 0 && <ChoiceHost />}
    </>
  )
}
