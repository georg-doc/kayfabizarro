// Bühne im Amphitheater (Vorbereitung G4) hinter dem URL-Schalter #stage: Amphitheater-Modul (V-230) auf Knet-Gelände, Billboard R2 hinten auf
// der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera, kein Schnitt; Standard cam=near, Georg 14.10.). Diese Szene ist Host: Kamera, Licht, Himmel; alles andere sind Module.
// Figuren per Hash: actors=none (Standard) | fb (FrizzleBob nach Georgs Export, V-240, links; rechts GothGirl V-269, cast=fb für beidseitig FrizzleBob)
// | rogue (F1-Prüffigur als Platzhalter für Stellproben, kein Darsteller). Karte: card=<deck>:<n>, Biom: biome=<Name>.
// Dialog D1 per Hash: dialog=<n> spielt n Karten des Decks der Startkarte ab (Sprechblasen an den Figuren, Spielerwahl am Bildrand).
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
import { ROGUE, CAST_IDS } from './actors/stageCast'
import { figureFor } from './actors/figureCard'
import { createRefusedFigure } from './modules/refusedFigure'
import { StageOrbitCam, ORBIT } from './StageOrbitCam'
import { skyAtTod, skyLookB, SKY_TINT } from './stageLight'
import { createStageLight, createContactAO, createPracticals, applyTone, parseTod, moodAt, castFrontFaces, selfTest, MOOD_SETS } from './vendor/light/kfb-stage-light.v1.1.js'
import { useHostKeys, PRIO } from './hostKeys'
import EDGES from './data/stages/kfb-stage-edges.r1.json'
import { stitchFor } from './world/terrainStitch'
import { createStageGround } from './modules/stageGround'
import { evaluate, createFrameSampler, overlayLine } from './world/perfBudget'
import { createClaySSOT } from './modules/claySSOT'
import { createVehicleLineup } from './modules/vehicleLineup'
import { mountCompareBar, toggleClean } from './compareBar'
import { worldKFor } from './worldScale'
import { setSpeaker, bootSpeech } from './audio/kfbAudio.js'
export { ORBIT } // Prüfungen lesen die Kamera-Werte wie bisher über Stage

const hash = typeof location !== 'undefined' ? location.hash : ''
const [deckId, num] = (/card=([\w]+):(\d+)/.exec(hash) || [0, 'forget_utopia', '1']).slice(1)
const di = DECKS.findIndex((d) => d.id === deckId)
const findCard = (d, n) => { const i = DECKS.findIndex((x) => x.id === d); return i >= 0 ? cardsOfDeck(i).map(cardAt).find((c) => c.num === n) || null : null }
// Vorschau-Text G4 (F-3a, Schalter preview=g4): die drei Karten in Georgs Reihenfolge aus dem Vorschau-Pool (sets[0]); sonst wie bisher
export const PREVIEW_CARDS = PREVIEW ? PREVIEW.sets[0].orderedBeatIds.map((id) => { const [d, n] = id.split(':'); return findCard(d, +n) }).filter(Boolean) : null
const CARD = PREVIEW_CARDS?.[0] || (di >= 0 ? cardsOfDeck(di).map(cardAt).find((c) => c.num === +num) || null : null)
const BIOME = BIOMES.find((b) => b.name === decodeURIComponent(/biome=([^,]+)/.exec(hash)?.[1] || '')) || BIOMES[1]
// V-345 · J17-Meter: alle eigenen WS1-Bühnenmaße (Amphitheater, Tafel, Marken, Kameras, Nebel, Schatten-Frustum, Figuren) × K. Die Zahlen unten bleiben
// die bisherigen WS1-Werte (abgenommene Bildaufbauten), umgerechnet wird an einer Stelle. Meshy-Bühnen sind schon in WS0-Metern (Slot-Datei), dort nur die Figuren.
// wscale=legacy zeigt die alte, 1,54-fach große Bühne zum Vergleich.
export const K = worldKFor(hash)
const camK = (c) => ({ ...c, pos: c.pos.map((v) => v * K), target: c.target.map((v) => v * K) })
const STAGE_CAMS0 = { two: { pos: [0, 2.7, 12.5], target: [0, 2.4, -3.5] }, wide: { pos: [0, 9, 30], target: [0, 2, -2] }, q: { pos: [9, 3.2, 9], target: [0, 2.2, -3] },
  // G4-Bildaufbau (Georg 14.10.: „near nehmen“): Kamera näher, auf Augenhöhe der Figuren, Figuren vor der Tafel. Standard seit §20.
  near: { pos: [0, 2.15, 9.2], target: [0, 2.1, -3.5] } }
export const STAGE_CAMS = Object.fromEntries(Object.entries(STAGE_CAMS0).map(([k, c]) => [k, camK(c)]))
const CAM = STAGE_CAMS[/cam=(\w+)/.exec(hash)?.[1]] ? /cam=(\w+)/.exec(hash)[1] : 'near'
// Meshy-Bühne statt Amphitheater (Vorschau, Georg 15.10.): scene=comic | utopia | goblin | atlantis (L1-Probebühnen). Kamera aus der Slot-Datei (WS0), Karte auf der Bildfläche im Modell.
const SCENE = MESHY_STAGES[/scene=(\w+)/.exec(hash)?.[1]] ? /scene=(\w+)/.exec(hash)[1] : null
const SCENE_S = SCENE ? (+(/sscale=([\d.]+)/.exec(hash)?.[1]) || MESHY_STAGES[SCENE].s) : null // Abstimmen per sscale=<m/u>; Standard = Slot-Datei (WS0)
const SCENE_CAM = SCENE ? stageCamera(MESHY_STAGES[SCENE], SCENE_S) : null
// L2 Schritt 3 (V-340): lineup=1 = Aufstellung aller 14 Fahrzeuge + Figuren auf eigener Fläche statt Amphitheater/Billboard
const LINEUP = /(^|[#,])lineup=1(,|$)/.test(hash)
const LINEUP_CAM = camK({ pos: [0, 11, 34], target: [0, 1.6, -4], fov: 38 })
const cam = SCENE_CAM || (LINEUP ? LINEUP_CAM : STAGE_CAMS[CAM])
const CAM_VIEW = { ...cam, focus: () => cardFocus() } // cardFocus steht weiter unten (braucht mods); erst beim Klick auf „Nah“ ausgewertet
// Publikums-Anker je Kamera: 3,2 m vor der Kamera auf der Blickachse, so tief, dass Blase und Spielerwahl am unteren Bildrand sitzen (NDC y −0,9),
// nicht über der Karte. Der Anker liegt 1,05 m über playerState.pos (BubbleHost). Für cam=two ergibt das die bisherige Lage (0, 0,6, z − 3,2).
export const playerPosFor = (c, fov = 38, d = 3.2, ndcY = -0.9) => { const [px, py, pz] = c.pos, [tx, ty, tz] = c.target, L = Math.hypot(tx - px, ty - py, tz - pz), k = d / L
  return [px + (tx - px) * k, py + (ty - py) * k + ndcY * d * Math.tan((fov / 2) * Math.PI / 180) - 1.05, pz + (tz - pz) * k] }
const PLAYER_POS = playerPosFor(cam, 38, 3.2 * K)
const ACTORS = ['none', 'fb', 'rogue', 'aliens'].includes(/actors=(\w+)/.exec(hash)?.[1]) ? /actors=(\w+)/.exec(hash)[1] : 'none' // unbekannter Wert → keine Figuren (Prüfer 9, Befund 7)
// Bühnen-Palette (V-270): nach der Karte (Deck-Genre → Insel-Palette → Rollen, Story-Tint), Hash palette=<Insel> zum Vergleichen, plain = ohne Tint (Bildpaar)
// Look-Slice (V-402/V-406, Georg 17.10.): mit light=l1 trägt die Bühne EINE Bühnenpalette mit Rollen aus den drei Joyride-Welten (world=canyon|bucht|otown,
// Standard canyon = Joyride-Standard: violetter Boden, orange Bögen), voll nach Rollen umgefärbt (Variante B, pamt 1); die Karte färbt nur noch Akzente.
// look=legacy zeigt den alten Stand (Palette nach Kartengenre, 18 %). palette=<id> bleibt als Vergleich vorrangig.
const STAGE_WORLD = /(^|[#,])light=l1(,|$)/.test(hash) && !/look=legacy/.test(hash) ? ((/world=(canyon|bucht|otown)/.exec(hash) || [0, 'canyon'])[1]) : null
const PAL_OVERRIDE = /palette=(\w+)/.exec(hash)?.[1] || STAGE_WORLD
const PAL_PLAIN = /(^|,)plain(,|$)/.test(hash.replace(/^#/, ''))
const PAL_VARIANT = /palv=b/.test(hash) || (STAGE_WORLD && !/palv=a/.test(hash)) ? 'b' : 'a' // Variante B (§36): Rolle je Bühnenteil wie Joyride
const palFor = (card) => stagePaletteFor(card, { override: PAL_OVERRIDE, noTint: PAL_PLAIN, variant: PAL_VARIANT })
const PAL0 = palFor(CARD)
// pamt=0..1: Anteil der Umfärbung des Amphitheaters nach Helligkeit (Look-Slice-Probe, Georg 17.10.); ohne Schalter V-286 (18 %)
const PAMT = /pamt=([\d.]+)/.exec(hash) ? Math.min(1, +/pamt=([\d.]+)/.exec(hash)[1]) : STAGE_WORLD ? 1 : undefined
const AMPH = { biome: BIOME, palette: PAL0?.amph || null, worldK: K, palAmt: PAMT, clay: !!STAGE_WORLD && !/clay=0/.test(hash) } // Look-Slice: Amphitheater als Knete
const MESHY_OPTS = SCENE ? { stage: SCENE, scale: SCENE_S } : null
const BB = { card: CARD, biome: BIOME, palette: PAL0, maxW: 7, maxH: 5, position: [0, 0, -3.5 * K], worldK: K }
const palState = { current: PAL0, log: [] } // aktuelle Palette der Bühne + Wechsel-Protokoll (Prüfung)
// Palette der Karte auf Billboard, Amphitheater und Himmel legen (weich, außer beim ersten Bild)
function applyPalette(card, fadeS = FADE_S) {
  if (STAGE_WORLD) return palState.current // Bühnenpalette bleibt fest, die Karte färbt nur Akzente (V-402)
  const p = palFor(card); if (!p || p.key === palState.current?.key) return palState.current // gleiche Palette und gleicher Akzent: kein Wechsel
  palState.current = p; palState.log.push({ card: card ? card.deck.id + '#' + card.num : null, id: p.id, via: p.via, storyMode: p.storyMode })
  mods.billboard?.setPalette?.(p, fadeS); mods.amph?.setPalette?.(p.amph, fadeS); sky.set(p.sky, fadeS)
  return p
}
// V-391 · Figuren nur über ihre Karte (actors/figureCard.js): FB und GothGirl aus src/data/figures, Körper byte-gleich mit der Karte; ohne gültige Karte
// steht ein rotes Schild „FIGURE REFUSED“ an ihrer Stelle. Rogue bleibt die F1-Prüffigur der Stellproben (kein Darsteller, actors=rogue).
// Kandidaten ohne Karte (cast=<KayKit-id>) nur im Casting-Vergleich mit uncarded=1.
const UNCARDED = /(^|[#,])uncarded=1(,|$)/.test(hash)
const pick = (id) => figureFor(id, { allowUncarded: UNCARDED })
// C2 (V-409/V-422): actors=aliens stellt Lord Hunky (links) und Lady Dory (rechts) aus ihren Karten auf (E2-Lider, Sockelrand 80°)
const ALIENS = ACTORS === 'aliens'
const FIG_L = /actors=fb/.test(hash) ? pick('frizzlebob') : ALIENS ? pick('lord_hunky') : null
// Standard (V-269, Georg 15.10.): rechts GothGirl, sobald FrizzleBob links steht; cast=<id> wählt einen anderen Kandidaten, cast=fb lässt FrizzleBob beidseitig
export { CAST_IDS } // für Prüfungen und Skripte wie bisher
const CAST_ARG = /cast=([\w-]+)/.exec(hash)?.[1] || null
const CAST_ID = CAST_ARG === 'fb' ? null : CAST_IDS.includes(CAST_ARG) ? CAST_ARG : /actors=fb/.test(hash) ? 'gothgirl' : null
const FIG_R = ALIENS ? pick('lady_dory') : CAST_ID ? pick(CAST_ID) : FIG_L
export const FIGURES = { left: FIG_L && { ok: FIG_L.ok, id: FIG_L.id, status: FIG_L.status, reason: FIG_L.reason }, right: FIG_R && { ok: FIG_R.ok, id: FIG_R.id || CAST_ID, status: FIG_R.status, reason: FIG_R.reason } }
setSpeaker('stage-left', FIGURES.left?.id); setSpeaker('stage-right', FIGURES.right?.id) // WS-Audio Chatter-Silben: Stimme der Bühnen-Blasen (Anker → Figur)
// Marken der Figuren je Stellung (Bühnenmitte = Ursprung, +z zum Publikum): near = G4-Standard vor der Tafel (Georg 14.10.), two = bisherige Stellung
// Marken je Meshy-Bühne in Modell-Einheiten u (skalieren mit dem Bühnen-Maßstab mit): freie Fläche vor der Kartenwand laut Kamera-Notiz der Slot-Datei
export const SCENE_MARKS = Object.freeze({
  comic: Object.freeze({ left: Object.freeze({ x: -0.58, z: -0.22, yaw: 0.35 }), right: Object.freeze({ x: 0.14, z: -0.28, yaw: -0.35 }) }),
  utopia: Object.freeze({ left: Object.freeze({ x: -0.3, z: 0.08, yaw: 0.35 }), right: Object.freeze({ x: 0.2, z: 0.08, yaw: -0.35 }) }),
  // ab den v2-Slots liefert WS0 die Figuren-Plätze selbst (slot.figures.positions_u, [x, z] in u); Blickwinkel wie bei den übrigen Bühnen
  ...Object.fromEntries(['goblin', 'atlantis'].map((id) => { const [a, b] = MESHY_STAGES[id].slot.figures.positions_u
    return [id, Object.freeze({ left: Object.freeze({ x: a[0], z: a[1], yaw: 0.35 }), right: Object.freeze({ x: b[0], z: b[1], yaw: -0.35 }) })] })),
})
const sceneMark = (m) => ({ ...m, x: m.x * SCENE_S, z: m.z * SCENE_S })
export const STAGE_MARKS = Object.freeze({
  near: Object.freeze({ left: Object.freeze({ x: -3.7, z: 1.2, yaw: 0.45 }), right: Object.freeze({ x: 3.7, z: 1.2, yaw: -0.45 }) }),
  two: Object.freeze({ left: Object.freeze({ x: -4.2, z: -1.4, yaw: 0.35 }), right: Object.freeze({ x: 4.2, z: -1.4, yaw: -0.35 }) }),
})
// Stellung: place=near (Figuren vor der Tafel, enger; Standard) | place=two (bisherige Stellung hinten). Ohne Angabe folgt sie der Kamera (cam=two → two).
const NEAR = (/place=(\w+)/.exec(hash)?.[1] || (CAM === 'two' ? 'two' : 'near')) === 'near'
const RIG_SHADOW = /(^|[#,])light=l1(,|$)/.test(hash) // V-429 ein Rig: mit Licht-Modul empfangen auch die Figuren Schatten
const stageMark = (m) => ({ ...m, x: m.x * K, z: m.z * K }) // alte WS1-Bühnenmeter → J17
const at = (fig, m, id) => (fig === null ? { ...ROGUE(m.x, m.yaw, id), position: [m.x, 0, m.z], worldScale: K } : fig.ok && fig.build ? { ...fig.build(m.x, m.yaw, id), position: [m.x, 0, m.z], worldScale: K, receiveShadow: RIG_SHADOW }
  : { refused: true, id: fig.id || id, reason: fig.reason || 'abgelehnt', position: [m.x, 0, m.z], yaw: m.yaw, scale: K }), MARKS = SCENE ? { left: sceneMark(SCENE_MARKS[SCENE].left), right: sceneMark(SCENE_MARKS[SCENE].right) } : LINEUP ? { left: stageMark({ x: -1.3, z: 8, yaw: 0 }), right: stageMark({ x: 1.3, z: 8, yaw: 0 }) } : { left: stageMark(STAGE_MARKS[NEAR ? 'near' : 'two'].left), right: stageMark(STAGE_MARKS[NEAR ? 'near' : 'two'].right) }
const L = at(FIG_L, MARKS.left, 'stage-left'), R = at(FIG_R, MARKS.right, 'stage-right')
const NDIALOG = /actors=none|^(?!.*actors=)/.test(hash) ? 0 : PREVIEW_CARDS ? PREVIEW_CARDS.length : +(/dialog=(\d+)/.exec(hash)?.[1] || 0) // Dialog nur mit Figuren (sonst Blasen ohne Anker)
// Dialog-Karten ab der Startkarte; drift-freie Seiten bevorzugt (WS0 zu §24.2, Auswahl statt Beschnitt), die Vorschau behält Georgs Reihenfolge
const DECK = PREVIEW_CARDS || (di >= 0 ? preferDriftFree(cardsOfDeck(di).map(cardAt).filter((c) => c.num >= +num), NDIALOG) : [])
const mods = {}
// Kartenmitte in Weltkoordinaten für die Kamera-Marke „Nah“: Billboard = Bildfläche `face`, Meshy-Bühne = Mitte der Slot-Fläche
const cardFocus = () => {
  const bb = mods.billboard, face = bb?.object3d?.getObjectByName?.('face'), slot = mods.amph?.surface?.mesh
  const m = face?.geometry ? face : slot?.geometry?.attributes?.position ? slot : null; if (!m) return null
  m.updateWorldMatrix(true, false); return new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3()).toArray()
}
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
const makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makeL = mk('left', (o) => (o.refused ? createRefusedFigure(o) : createActor(o))), makeR = mk('right', (o) => (o.refused ? createRefusedFigure(o) : createActor(o)))
const makeDialog = (o) => { const d = createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), ssotLine: (...a) => o.reader.ssotLine(...a), silence: () => o.reader.silence() } }); mods.dialog = d; expose('StageMods', mods); return d }

// Himmel (V-245, färbt mit): Kuppel mit Verlauf skyBottom → skyTop aus den Rollen; Nebel = skyBottom. Wechsel weich (V-011).
const sky = (() => {
  const top = new THREE.Color(PAL0?.sky.top || '#bcd7ea'), bottom = new THREE.Color(PAL0?.sky.bottom || '#bcd7ea'), F = { on: false, t: 0, dur: 0, a: null, b: null }
  const viewTop = top.clone(), viewBottom = bottom.clone() // angezeigte Farben: Palette (top/bottom) × Tageszeit (L1); ohne L1 gleich der Palette
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: viewTop }, bottom: { value: viewBottom } },
    vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying float h; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.02, 0.55, h)), 1.0); }' })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat); mesh.name = 'sky'; mesh.renderOrder = -1
  return { mesh, top, bottom, viewTop, viewBottom, state: () => ({ top: '#' + top.getHexString(), bottom: '#' + bottom.getHexString(), fading: F.on }),
    set(sk, fadeS) { const b = { top: new THREE.Color(sk.top), bottom: new THREE.Color(sk.bottom) }; if (!(fadeS > 0)) { top.copy(b.top); bottom.copy(b.bottom); F.on = false; return } Object.assign(F, { on: true, t: 0, dur: fadeS, a: { top: top.clone(), bottom: bottom.clone() }, b }) },
    step(dt) { if (F.on) { F.t = Math.min(F.dur, F.t + dt); const u = F.t / F.dur, k = u * u * (3 - 2 * u); top.copy(F.a.top).lerp(F.b.top, k); bottom.copy(F.a.bottom).lerp(F.b.bottom, k); if (u >= 1) F.on = false }
      if (L1) { const b = LOOK === 'b' ? skyLookB('#' + top.getHexString(), '#' + bottom.getHexString(), LSET === 'mesa' ? SKY_TINT.mesa : SKY_TINT.v346) : { top: '#' + top.getHexString(), bottom: '#' + bottom.getHexString() }
        viewTop.set(skyAtTod(b.top, lightState.tod)); viewBottom.set(skyAtTod(b.bottom, lightState.tod)) } else { viewTop.copy(top); viewBottom.copy(bottom) } } }
})()
// L3 (V-382/V-385/V-386/V-392, LIGHT_MODEL_R2) · Licht nur aus dem Bühnen-Licht-Modul (vendor/light/kfb-stage-light.v1.js, Fehlerliste Stufe 0):
// ein Rig (Sonne als einziger Schattenwerfer, Hemisphäre mit Boden = edgePalette der Bühne, ein warmes Figurenlicht von vorn-oben), Stimmungen
// Tag/Gold/Nacht als Einstellungen, ein Tonemapping für alle Schichten bei fester Belichtung. Entfernt: Randlicht, Gegenlicht, Gesichts-Fill,
// toneSplit, Look-B-Lichtsättigung, unbeleuchtete Karte (alles frühere WS0-Aufträge, ersetzt durch R2). Hinter light=l1, timeOfDay über tod=.
const L1 = /(^|[#,])light=l1(,|$)/.test(hash)
export const lightState = { tod: parseTod(hash), current: null }
// Tonemapping: tm=aces | neutral | agx | none; Wahl per Messung bei fester Belichtung (scripts/light/l3-tone.mjs), Standard = Ergebnis der Messung
const L1_TM = (/tm=(aces|neutral|agx|none)/.exec(hash) || [0, 'aces'])[1] // Messung 17.10. (l3-proof tone): AgX 7,73 knapp vor ACES 8,50, Neutral 16,03, ohne clippt; AgX entsättigt sichtbar (FB blass), Georg: zu hell und flach → ACES mit Mesa
// Look B ist nur noch Himmelstönung (Regel 3: keine Lichtsättigung); look=a zeigt die Palette ungetönt
const LOOK = L1 && !/look=a/.test(hash) ? 'b' : 'a'
// Knet: mit L1 Standard für alle Figuren (V-346), clay=1 nur KayKit, clay=0 aus. Figuren-Samt ≤ 0,05 (Regel 1, gegen den hellen Saum)
const CLAY = L1 ? !/(^|[#,])clay=0(,|$)/.test(hash) : /(^|[#,])clay=(1|all)(,|$)/.test(hash)
const CLAY_FB = L1 ? !/(^|[#,])clay=(0|1)(,|$)/.test(hash) : /(^|[#,])clay=all(,|$)/.test(hash)
// V-429: Knete aus dem zentralen Modul kfb-clay.v1.1 (Profil und Seed aus der Figurenkarte, keine WS1-Werte mehr); Fahrzeuge = midground
const cardOf = (f) => (f?.ok ? f.card : null)
const CLAYS = { targets: () => [...(CLAY_FB ? [{ module: mods.left, card: cardOf(FIG_L), profile: 'character', seed: 'stage-left' }] : []), ...(CAST_ID || ALIENS ? [{ module: mods.right, card: cardOf(FIG_R), profile: 'character', seed: 'stage-right' }] : [])] }
const makeClay = (o) => { const m = createClaySSOT(o); mods.clay = m; return m }
const LINEUP_OPTS = { figure: () => mods.left, gap: 0.9 * K }
const makeLineup = (o) => { const m = createVehicleLineup(o); mods.amph = m; mods.lineup = m; expose('StageMods', mods); return m }
const CLAYV = { targets: () => (mods.lineup ? [{ module: mods.lineup, profile: 'midground', seed: 'lineup' }] : []) }
const makeClayV = (o) => { const m = createClaySSOT(o); mods.clayV = m; return m }
// Bühnen-Ränder (kfb.stage-edges/1, WS0 @d4e24f15): Hemi-Boden = größter Flächenanteil der edgePalette, in OKLCH höchstens +10 % L (V-396);
// Amphitheater: mittlerer Bühnenboden-Ton der Palette, Aufstellung: Bodenfläche
const EDGE_ID = { goblin: 'goblin_bank', atlantis: 'atlantis', comic: 'comic_broadcast', utopia: 'utopia_stage' }
const edge = SCENE ? EDGES.stages[EDGE_ID[SCENE]] || null : null
const liftL = (hex, k = 1.1) => { const c = new THREE.Color(hex), hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, hsl.s, Math.min(1, hsl.l * k)); return '#' + c.getHexString() }
const GROUND = edge?.edgePalette?.length ? liftL([...edge.edgePalette].sort((a, b) => b.share - a.share)[0].hex) : LINEUP ? '#cdb48c' : (PAL0?.amph?.floor?.[1] || PAL0?.amph?.cols?.[4] || '#9a8a78') // Variante B: Bühnenboden = Sand-Rolle
// Schattenbereich: Spielfläche der Bühne (Amphitheater-Bühne ⌀ 9,1 m, Meshy-Slot nach Figuren-Zone, Aufstellung weit)
const FIT = SCENE ? { center: { x: 0, y: 0, z: 0 }, radius: 7 } : LINEUP ? { center: { x: 0, y: 0, z: -4 * K }, radius: 16 } : { center: { x: 0, y: 1, z: -1.2 * K }, radius: 7.6 * K }
// Stimmungs-Satz: lset=mesa (Standard, Georg 17.10.: Krazy-Kat-Sonntagsseiten, Mesas, laue Abende) | cozy (wärmer, weniger hell) | r2 (J17-Tag nach LIGHT_MODEL_R2)
const LSET = (/lset=(r2|cozy|mesa)/.exec(hash) || [0, 'mesa'])[1], MOOD_SET = MOOD_SETS[LSET] || undefined
const RIG = { moods: MOOD_SET, tod: () => lightState.tod, groundColor: () => GROUND, fit: () => FIT, figures: () => [mods.left, mods.right], figureLight: { distance: 4.6 * K, up: 2.6 * K } }
const makeRig = (o) => { const m = createStageLight(o); mods.light = m; return m }
const AO = { targets: () => [mods.left, mods.right], strength: 0.42 }
// Slice 1 · Gelände um Meshy-Bühnen mit Sprenkel-Band (V-341/V-396/V-403); Inseln ohne Gelände; Zonenboden = Boden-Rolle der Bühnenpalette
const STITCH = SCENE && L1 && edge ? stitchFor(edge, { scale: SCENE_S, floorY_u: MESHY_STAGES[SCENE].floorY }) : null
const GROUND_OPTS = { stitch: STITCH, zoneColor: PAL0?.amph?.ground || GROUND, seed: SCENE || 'stage' }
const makeStageGround = (o) => { const m = createStageGround(o); mods.ground = m; return m }
const makeAO = (o) => { const m = createContactAO(o); mods.blobs = m; return m }
// Praktische: Meshy-Bühnen aus den Rändern (u → m wie der Slot); Amphitheater = die B22-Arm-Lampen der Tafel (WSB-Assets, V-429 erfüllt); Stärke = Rig-glow
const toMeters = (u) => [u[0] * SCENE_S, (u[1] - MESHY_STAGES[SCENE].floorY) * SCENE_S, u[2] * SCENE_S]
const SCENE_PRACT = SCENE ? (edge?.practicals || []).map((p) => ({ ...p, pos: toMeters(p.pos) })) : null
const PRACT = { practicals: () => SCENE_PRACT || (mods.billboard?.lampPoints?.() || []).map((pos, i) => ({ id: 'bb-lamp-' + i, type: 'lamp', pos, color: '#ffd98a', intensity: 1, range: 6 * K, halo: { size: 0.45 * K } })),
  weight: () => moodAt(lightState.tod, MOOD_SET).glow }
const makePract = (o) => { const m = createPracticals(o); mods.practicals = m; return m }
// F1 · Leistungsanzeige (V-370-Budget, perfBudget.js): Hash perf → Zeile unten am Rand mit p95, fps, Draw Calls, Dreiecken; kein finales HUD (§44.3)
const PERF = /(^|[#,])perf(,|$)/.test(hash)
function PerfOverlay() {
  const { gl } = useThree()
  const st = useMemo(() => ({ s: createFrameSampler(600), t: 0, el: null, last: null }), [])
  useEffect(() => { const d = document.createElement('div'); d.id = 'kfb-perf'; d.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:8px;padding:4px 10px;border-radius:8px;background:rgba(20,16,12,.7);color:#e9f3d8;font:500 11px/1.3 ui-monospace,Menlo,monospace;z-index:8998;pointer-events:none;white-space:nowrap'
    document.body.appendChild(d); st.el = d; expose('StagePerf', { last: () => st.last }); return () => d.remove() }, [st])
  useFrame((_, dt) => { st.s.push(dt * 1000); st.t += dt; if (st.t < 0.5 || !st.el) return; st.t = 0
    st.last = evaluate({ info: { calls: gl.info.render.calls, triangles: gl.info.render.triangles }, frameMs: st.s.samples() }); st.el.textContent = overlayLine(st.last) })
  return null
}
function LightL3() {
  const { gl } = useThree()
  useEffect(() => { const undo = applyTone(gl, L1_TM, 1)
    expose('StageLight', { state: lightState, set: (t) => { lightState.tod = t }, info: () => lightState.current, selfTest: () => selfTest(gl), renderer: () => gl, three: () => THREE, gl: () => ({ calls: gl.info.render.calls, tris: gl.info.render.triangles, programs: gl.info.programs?.length ?? null }) })
    return undo }, [gl])
  const { scene } = useThree(), cff = useRef(0)
  useFrame((_, dt) => { if ((cff.current -= dt) <= 0) { cff.current = 1; castFrontFaces(scene) } // v1.1 (V-440): Vorderseiten werfen Schatten (Saum-Fix), nachgeladene Teile jede Sekunde
    mods.billboard?.setGlow?.(moodAt(lightState.tod, MOOD_SET).glow) // B22-Lichtkeile nach Rig-glow
    lightState.current = { look: LOOK, tm: L1_TM, lset: LSET, ground: GROUND, ...(mods.light?.info?.() || {}) } })
  return null
}

// Nebel folgt der gezeigten Horizontfarbe (L1 Regel 3): viewBottom = Palette × Tageszeit
function Sky() {
  useFrame((st, dt) => { sky.step(Math.min(dt, 0.1)); sky.mesh.position.copy(st.camera.position); if (st.scene.fog) st.scene.fog.color.copy(sky.viewBottom) })
  return <primitive object={sky.mesh} />
}


const FOG_K = SCENE ? 1 : K // Nebel in Bühnenmaß; Meshy-Bühnen sind schon WS0-Meter
export default function Stage() {
  useEffect(() => (L1 ? mountCompareBar({ hash, lightState }) : undefined), []) // Vergleichsleiste für Georgs Abnahme (nur mit light=l1)
  useHostKeys((e) => { if (L1 && e.code === 'KeyH' && !e.repeat) { toggleClean(); e.preventDefault() } }, PRIO.editor) // V-383: Sauberes Bild an/aus
  // Die Spielerwahl der Bühne: Zurufe des Publikums erscheinen als Blase vorn am Bildrand (Anker „player“ vor der Kamera).
  // Nur solange die Bühne steht; beim Abbau zurück (Prüfer 8, Befund 6: kein Seiteneffekt beim Import).
  useEffect(() => { const prev = playerState.pos.clone(); playerState.pos.set(...PLAYER_POS); return () => { playerState.pos.copy(prev) } }, [])
  useEffect(() => { bootSpeech() }, []) // WS-Audio Chatter-Silben: nur mit #chat=syl – lädt allein die Silben-Clips (keine Musik/Atmo auf der Bühne)
  // V-391 Regel 5 · Kandidaten-Vermerk außerhalb des Motivs (V-383: unten rechts am Rand, mit „Sauberes Bild“ ausblendbar)
  useEffect(() => { const c = [FIGURES.left, FIGURES.right].filter((f) => f?.ok && f.status === 'candidate'); if (!c.length) return undefined
    const d = document.createElement('div'); d.id = 'kfb-figure-status'; d.style.cssText = 'position:fixed;right:10px;bottom:10px;padding:4px 9px;border-radius:8px;background:rgba(40,28,16,.6);color:#ffe9b8;font:500 11px/1.2 system-ui,sans-serif;z-index:8999;pointer-events:none'
    d.textContent = [...new Set(c.map((f) => f.id))].join(', ') + ' · Kandidat (Figurenkarte)'; document.body.appendChild(d); return () => d.remove() }, [])
  // Kennzeichnung der Vorschau im Bild (F-3a: nicht ACCEPTED)
  useEffect(() => { if (!PREVIEW) return undefined; const d = document.createElement('div'); d.id = 'kfb-preview-badge'
    d.style.cssText = 'position:fixed;left:16px;top:14px;padding:6px 12px;border-radius:10px;background:rgba(40,28,16,.72);color:#ffe9b8;font:600 15px/1.2 system-ui,sans-serif;z-index:9000;pointer-events:none'
    d.textContent = 'Vorschau-Text · Georgs Fassungen · nicht abgenommen'; document.body.appendChild(d); return () => d.remove() }, [])
  useEffect(() => { expose('StageCtl', { figures: FIGURES, worldK: K, log: () => ({ amph: { ...amphLog } }), biome: BIOME, card: CARD, cams: STAGE_CAMS, deck: DECK, palette: () => palState.current, palLog: () => palState.log.slice(), sky: () => sky.state(), applyPalette }) }, [])
  // Ergebnis der Spielerwahl → Dialog (Store-Ereignis lastChoice)
  useEffect(() => useGame.subscribe((s, p) => { if (s.lastChoice && s.lastChoice !== p.lastChoice) mods.dialog?.onChoice(s.lastChoice) }), [])
  const sun = useMemo(() => [18, 30, 22], [])
  return (
    <>
      <color attach="background" args={[PAL0?.sky.bottom || '#bcd7ea']} />
      <fog attach="fog" args={[PAL0?.sky.bottom || '#bcd7ea', 80 * FOG_K, 260 * FOG_K]} />
      <Sky />
      <StageOrbitCam view={CAM_VIEW} />
      {PERF && <PerfOverlay />}
      {L1 ? <><LightL3 /><ModuleHost create={makeRig} options={RIG} /></> : <>
        <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
        <directionalLight position={sun} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0002} />
      </>}
      {SCENE ? <ModuleHost create={makeMeshy} options={MESHY_OPTS} /> : LINEUP ? <ModuleHost create={makeLineup} options={LINEUP_OPTS} /> : <ModuleHost create={makeAmph} options={AMPH} />}
      {!SCENE && !LINEUP && <ModuleHost create={makeBB} options={BB} />}
      {LINEUP && CLAY && <ModuleHost create={makeClayV} options={CLAYV} />}
      {ACTORS !== 'none' && <ModuleHost create={makeL} options={L} />}
      {L1 && ACTORS !== 'none' && <ModuleHost create={makeAO} options={AO} />}
      {L1 && <ModuleHost create={makePract} options={PRACT} />}
      {STITCH && <ModuleHost create={makeStageGround} options={GROUND_OPTS} />}
      {CLAY && ACTORS !== 'none' && <ModuleHost create={makeClay} options={CLAYS} />}
      {ACTORS !== 'none' && <ModuleHost create={makeR} options={R} />}
      {NDIALOG > 0 && <ModuleHost create={makeDialog} options={DIALOG} />}
      {NDIALOG > 0 && <BubbleHost />}
      {NDIALOG > 0 && <ChoiceHost />}
    </>
  )
}
