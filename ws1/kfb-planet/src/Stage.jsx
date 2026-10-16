// Bühne im Amphitheater (Vorbereitung G4) hinter dem URL-Schalter #stage: Amphitheater-Modul (V-230) auf Knet-Gelände, Billboard R2 hinten auf
// der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera, kein Schnitt; Standard cam=near, Georg 14.10.). Diese Szene ist Host: Kamera, Licht, Himmel; alles andere sind Module.
// Figuren per Hash: actors=none (Standard) | fb (FrizzleBob nach Georgs Export, V-240, links; rechts GothGirl V-269, cast=fb für beidseitig FrizzleBob)
// | rogue (F1-Prüffigur als Platzhalter für Stellproben, kein Darsteller). Karte: card=<deck>:<n>, Biom: biome=<Name>.
// Dialog D1 per Hash: dialog=<n> spielt n Karten des Decks der Startkarte ab (Sprechblasen an den Figuren, Spielerwahl am Bildrand).
import { useEffect, useMemo } from 'react'
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
import { ROGUE, FB, KAYKIT, CAST_IDS } from './actors/stageCast'
import { StageOrbitCam, ORBIT } from './StageOrbitCam'
import { lightAt, parseTod, skyAtTod, lookB, skyLookB, SKY_TINT, LIGHT_INTENT, LIGHT_INTENT_V340, followShadow, shadowLength } from './stageLight'
import { createActorRim } from './modules/actorRim'
import { createClayLook } from './modules/clayLook'
import { createVehicleLineup } from './modules/vehicleLineup'
import { mountCompareBar } from './compareBar'
import { createContactBlobs } from './modules/contactBlob'
import { createPracticals } from './modules/practicals'
import { createToneSplit } from './modules/toneSplit'
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
// Meshy-Bühne statt Amphitheater (Vorschau, Georg 15.10.): scene=comic | utopia | goblin | atlantis (L1-Probebühnen). Kamera aus der Slot-Datei (WS0), Karte auf der Bildfläche im Modell.
const SCENE = MESHY_STAGES[/scene=(\w+)/.exec(hash)?.[1]] ? /scene=(\w+)/.exec(hash)[1] : null
const SCENE_S = SCENE ? (+(/sscale=([\d.]+)/.exec(hash)?.[1]) || MESHY_STAGES[SCENE].s) : null // Abstimmen per sscale=<m/u>; Standard = Slot-Datei (WS0)
const SCENE_CAM = SCENE ? stageCamera(MESHY_STAGES[SCENE], SCENE_S) : null
// L2 Schritt 3 (V-340): lineup=1 = Aufstellung aller 14 Fahrzeuge + Figuren auf eigener Fläche statt Amphitheater/Billboard
const LINEUP = /(^|[#,])lineup=1(,|$)/.test(hash)
const LINEUP_CAM = { pos: [0, 11, 34], target: [0, 1.6, -4], fov: 38 }
const cam = SCENE_CAM || (LINEUP ? LINEUP_CAM : STAGE_CAMS[CAM])
const CAM_VIEW = { ...cam, focus: () => cardFocus() } // cardFocus steht weiter unten (braucht mods); erst beim Klick auf „Nah“ ausgewertet
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
const at = (mk, m, id) => ({ ...mk(m.x, m.yaw, id), position: [m.x, 0, m.z] }), MARKS = SCENE ? { left: sceneMark(SCENE_MARKS[SCENE].left), right: sceneMark(SCENE_MARKS[SCENE].right) } : LINEUP ? { left: { x: -1.3, z: 8, yaw: 0 }, right: { x: 1.3, z: 8, yaw: 0 } } : STAGE_MARKS[NEAR ? 'near' : 'two']
const L = at(MK, MARKS.left, 'stage-left'), R = at(MKR, MARKS.right, 'stage-right')
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
const makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makeL = mk('left', createActor), makeR = mk('right', createActor)
const makeDialog = (o) => { const d = createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), silence: () => o.reader.silence() } }); mods.dialog = d; expose('StageMods', mods); return d }

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
      if (L1) { const b = LOOK === 'b' ? skyLookB('#' + top.getHexString(), '#' + bottom.getHexString(), TUNE ? SKY_TINT.v346 : SKY_TINT.v340) : { top: '#' + top.getHexString(), bottom: '#' + bottom.getHexString() }
        viewTop.set(skyAtTod(b.top, lightState.tod)); viewBottom.set(skyAtTod(b.bottom, lightState.tod)) } else { viewTop.copy(top); viewBottom.copy(bottom) } } }
})()
// L1 (V-329) · Licht-Schreiber hinter light=l1: der einzige Ort, der Sonne, Hemisphäre, Gegenlicht und Tonemapping setzt. Werte aus stageLight.js
// (J17-Tag, E50-Gold, Story-Nacht), timeOfDay über tod=day|gold|night|0..1. Nur die Sonne wirft Schatten, enger Frustum um die Spielfläche
// (±12 m, 2048² → ≈ 1,2 cm je Texel, Ziel fest im Bühnenmittelpunkt, daher kein Nachrasten nötig). Ausgabe ACES wie J17; die Kartenfläche ist toneMapped: false.
// Kontaktschatten (V-203, Spender Lab contact-blob.ts) als eigenes Modul unter jeder Figur (modules/contactBlob.js); FB behält zusätzlich seinen contact-ao.
const L1 = /(^|[#,])light=l1(,|$)/.test(hash)
export const lightState = { tod: parseTod(hash), current: null }
const ORIGIN = { x: 0, y: 0, z: 0 }
// V-346 (Georgs Look-Urteile, TUNE in einem Schritt): mit light=l1 sind jetzt Standard: Look B, Randlicht, Knet für alle, ACES mit Boden „ohne“.
// tune=0 zeigt zum Vergleich den Stand vor V-346 (Himmel stark verschoben, GothGirl-Glow 0,5, kein Gesichts-Fill, Knet ohne Abstimmung).
const TUNE = L1 && !/(^|[#,])tune=0(,|$)/.test(hash)
// Tonemapping: tm=none (ohne) | tm=aces (ACES überall, Stand V-342) | Standard split = ACES global, Boden/Bühne toneMapped: false (V-346 Punkt 3)
const L1_TM = /tm=none/.test(hash) ? 'none' : /tm=aces/.test(hash) ? 'aces' : 'split'
// L2 Schritt 1 (V-340): look=a (L1 genau) | look=b (warmer Krazy-Kat-Grundton, seit V-346 Standard); Licht-Identität je Figur (Randlicht) immer mit L1
const LOOK = L1 && !/look=a/.test(hash) ? 'b' : 'a', RIM = L1
const INTENT = TUNE ? LIGHT_INTENT : LIGHT_INTENT_V340
const RIMS = { targets: () => [{ module: mods.left, intent: INTENT.frizzlebob }, { module: mods.right, intent: INTENT[CAST_ID] || INTENT.default }] }
const makeRim = (o) => { const m = createActorRim(o); mods.rim = m; return m }
// L2 Schritt 2 (V-340): clay=1 stellt KayKit-Figuren auf das K1/H0-Knet-Material (Profil figure) um; FB behält sein abgenommenes ToolBox-Material.
// clay=all stellt auch FB um (G9 „eine Materialfamilie“). V-346: mit L1 ist clay=all Standard (Georg: FB bekommt Knet); clay=1 nur KayKit, clay=0 aus.
// Ohne L1 bleibt alles wie vorher (nur mit Schalter).
const CLAY = L1 ? !/(^|[#,])clay=0(,|$)/.test(hash) : /(^|[#,])clay=(1|all)(,|$)/.test(hash)
const CLAY_FB = L1 ? !/(^|[#,])clay=(0|1)(,|$)/.test(hash) : /(^|[#,])clay=all(,|$)/.test(hash)
// V-346: GothGirl wirkte im Knet überstrahlt → Samt weniger, Grundfarbe × 0,95 (WS1-Wert nach Messung: × 0,88 lag 8 % unter „Knet aus“, scripts/light/v346-pairs.mjs); Fahrzeuge farbtreu
const CLAY_TUNE = { gothgirl: { sheen: 0.06, colorK: 0.95 } }, VEHICLE_TUNE = { sheen: 0 }
const CLAYS = { targets: () => [...(CLAY_FB ? [mods.left] : []), ...(CAST_ID ? [{ module: mods.right, tune: TUNE ? CLAY_TUNE[CAST_ID] || {} : {} }] : [])], profile: 'figure' }
const makeClay = (o) => { const m = createClayLook(o); mods.clay = m; return m }
const LINEUP_OPTS = { figure: () => mods.left }
const makeLineup = (o) => { const m = createVehicleLineup(o); mods.amph = m; mods.lineup = m; expose('StageMods', mods); return m }
const CLAYV = { targets: () => (mods.lineup ? [mods.lineup] : []), profile: 'vehicle', tune: TUNE ? VEHICLE_TUNE : {} }
// Boden ohne Tonemapping (tm split): Bühne bzw. in der Aufstellung nur die Bodenfläche
const TONES = { targets: () => [LINEUP ? { object3d: mods.lineup?.object3d.getObjectByName('lineup-ground') } : { object3d: mods.amph?.object3d, ready: () => mods.amph?.status().status === 'OK' }] }
const makeTones = (o) => { const m = createToneSplit(o); mods.tones = m; return m }
const makeClayV = (o) => { const m = createClayLook(o); mods.clayV = m; return m }
const BLOBS = { targets: () => [mods.left, mods.right] }
const makeBlobs = (o) => { const m = createContactBlobs(o); mods.blobs = m; return m }
// Lokale Lichter der Bühne aus ihrem Deskriptor (kfb.stage-descriptor/1, practicals[] in u → Meter wie die Slot-Umrechnung); nachts voll, tags fast aus
const DESCRIPTORS = import.meta.glob('./data/stages/*.stage.json', { eager: true, import: 'default' })
const stageDesc = SCENE ? DESCRIPTORS[`./data/stages/${SCENE}.stage.json`] || null : null
const toMeters = (u) => [u[0] * SCENE_S, (u[1] - MESHY_STAGES[SCENE].floorY) * SCENE_S, u[2] * SCENE_S]
const PRACT = { practicals: (stageDesc?.practicals || []).map((p) => ({ ...p, pos: toMeters(p.pos) })), weight: () => Math.pow(1 - lightState.tod, 1.5), actors: () => [mods.left, mods.right] }
const makePract = (o) => { const m = createPracticals(o); mods.practicals = m; return m }
function LightRigL1() {
  const { gl } = useThree()
  const sunRef = useMemo(() => ({ sun: null, back: null, hemi: null }), [])
  useEffect(() => { const prev = gl.toneMapping; gl.toneMapping = L1_TM === 'none' ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping // split: global ACES, Boden per Material
    expose('StageLight', { state: lightState, set: (t) => { lightState.tod = t }, info: () => lightState.current })
    return () => { gl.toneMapping = prev } }, [gl])
  useFrame(() => {
    const L0 = lightAt(lightState.tod), L = LOOK === 'b' ? { ...lookB(L0), sunDir: L0.sunDir, tod: L0.tod, elev: L0.elev, az: L0.az } : L0, { sun, back, hemi } = sunRef; if (!sun || !back || !hemi) return
    const d = L.sunDir, R = 40
    followShadow(sun, ORIGIN, { size: 12, dist: R, sunDir: d }); sun.color.set(L.sun); sun.intensity = L.sunI // Bühne: Ziel fest in der Mitte; M1/M2 übergeben Figur bzw. Fahrzeug
    back.position.set(-d[0] * R, Math.max(6, d[1] * R * 0.5), -d[2] * R); back.color.set(L.back); back.intensity = L.backI
    hemi.color.set(L.hemiSky); hemi.groundColor.set(L.hemiGround); hemi.intensity = L.hemiI
    lightState.current = { look: LOOK, rim: RIM, tm: L1_TM, tune: TUNE, shadowLen: +shadowLength(L.elev).toFixed(3), tod: L.tod, hemiGround: L.hemiGround, back: L.back, sun: L.sun, sunI: +L.sunI.toFixed(3), hemiI: +L.hemiI.toFixed(3), backI: +L.backI.toFixed(3), elev: +L.elev.toFixed(2), az: +L.az.toFixed(2) }
  })
  return <>
    <hemisphereLight ref={(o) => { sunRef.hemi = o }} />
    <directionalLight ref={(o) => { sunRef.sun = o }} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-near={1} shadow-camera-far={90} shadow-bias={-0.0002} shadow-normalBias={0.02} />
    <directionalLight ref={(o) => { sunRef.back = o }} />
  </>
}

// Nebel folgt der gezeigten Horizontfarbe (L1 Regel 3): viewBottom = Palette × Tageszeit
function Sky() {
  useFrame((st, dt) => { sky.step(Math.min(dt, 0.1)); sky.mesh.position.copy(st.camera.position); if (st.scene.fog) st.scene.fog.color.copy(sky.viewBottom) })
  return <primitive object={sky.mesh} />
}


export default function Stage() {
  useEffect(() => (L1 ? mountCompareBar({ hash, lightState }) : undefined), []) // Vergleichsleiste für Georgs Abnahme (nur mit light=l1)
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
      <StageOrbitCam view={CAM_VIEW} />
      {L1 ? <LightRigL1 /> : <>
        <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
        <directionalLight position={sun} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0002} />
      </>}
      {SCENE ? <ModuleHost create={makeMeshy} options={MESHY_OPTS} /> : LINEUP ? <ModuleHost create={makeLineup} options={LINEUP_OPTS} /> : <ModuleHost create={makeAmph} options={AMPH} />}
      {!SCENE && !LINEUP && <ModuleHost create={makeBB} options={BB} />}
      {LINEUP && CLAY && <ModuleHost create={makeClayV} options={CLAYV} />}
      {ACTORS !== 'none' && <ModuleHost create={makeL} options={L} />}
      {L1 && ACTORS !== 'none' && <ModuleHost create={makeBlobs} options={BLOBS} />}
      {L1 && <ModuleHost create={makePract} options={PRACT} />}
      {L1 && L1_TM === 'split' && <ModuleHost create={makeTones} options={TONES} />}
      {CLAY && ACTORS !== 'none' && <ModuleHost create={makeClay} options={CLAYS} />}
      {RIM && ACTORS !== 'none' && <ModuleHost create={makeRim} options={RIMS} />}
      {ACTORS !== 'none' && <ModuleHost create={makeR} options={R} />}
      {NDIALOG > 0 && <ModuleHost create={makeDialog} options={DIALOG} />}
      {NDIALOG > 0 && <BubbleHost />}
      {NDIALOG > 0 && <ChoiceHost />}
    </>
  )
}
