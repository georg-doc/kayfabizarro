// M1 · „Bewegung mit FrizzleBob v5b“ hinter dem URL-Schalter #m1 (Briefing BRIEF_WS1_M1_BEWEGUNG_R1). Diese Szene ist Host (Vertrag §1):
// Kamera, Licht, Nebel, Hintergrund und Himmel gehören ihr; alles andere sind Module (create/update/dispose über ModuleHost).
//   Takt    = ein Durchlauf je Physik-Schritt (m1Clock, M1Loop): Canvas frameloop="never", Physik pausiert und von Stepper geschritten.
//             Reihenfolge der Bild-Handler (Rang 0, in Anmelde-Reihenfolge): Stepper → Folgen → Figur-Modul → vor ecctrl → ecctrl → nach ecctrl.
//             drei CameraControls läuft mit Rang −1 davor (Kamera nutzt das Ziel des vorigen Schritts). Szenen-Module und Szenen-Logik hängen beim
//             ersten Laden je nach Suspense vor oder hinter der Physik – sie lesen nur, ihre Reihenfolge ist für die Bewegung ohne Belang.
//   Himmel  = Skydome 4a (modules/m1-sky, SKY3 createSkydome 1:1), Nebel/Hintergrund = Horizontfarbe der Kuppel.
//   Welt    = Amphitheater V-230 (modules/amphitheater, Browser-Fassung v1) in offenem Knet-Gelände (modules/m1-terrain, ≥ 400 m), Rapier-Trimesh
//             für Gelände und Theater. Bühne begehbar; Ränge = Kulisse ohne Begehen (V-283): unsichtbarer Zaun (m1Host rankFence), bis WS0 das
//             vereinfachte Kollisionsnetz liefert. Kein Hex, kein Racetrack (V-194, V-210 ruht).
//   Figur   = FrizzleBob v5b (V-240) über den Darsteller-Slot (m1-locoActor), gesteuert von ecctrl (M1Player).
//   Bühne   = Wer (am Boden) die Bühnenfläche betritt, startet den Dialog D1 (modules/dialog, unverändert): Spieler auf die linke Marke, Partner
//             GothGirl (V-269, actors/stageCast wie #stage) rechts, Billboard hinten. Kamera: StageOrbitCam wie #stage (V-257), Startblick
//             STAGE_CAMS.near mit Brennweite 38°. Nach dem letzten Beat oder mit Escape zurück zur Folgekamera (55°); erneut erst nach Verlassen der Bühne.
// Hash: #m1 · debug (window.__kfbM1) · replay[=120|30] (siehe m1Clock) · cards=n (Dialoglänge, Standard 2) · nofence (nur mit debug: Zaun um die Ränge aus –
//       Gegenlauf und Messwert der Rückwand-Stelle für WS0, scripts/m1/probe-landranks.mjs)
import * as THREE from 'three'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody, TrimeshCollider, ConvexHullCollider, CuboidCollider, CylinderCollider, CapsuleCollider, CoefficientCombineRule, useRapier } from '@react-three/rapier'
import ModuleHost from '../ModuleHost'
import { StageOrbitCam, ORBIT } from '../StageOrbitCam'
import { KAYKIT, FB } from '../actors/stageCast'
import M1Loop from './M1Loop'
import M2Car, { M2_ON, M2STATE, RACER_FLY, TRAVEL_ON, TRAVEL, carLive } from '../m2/M2Car'
import { createTravelState } from './travelState'
import StuntField from '../m3/stuntField'
import ElanRings, { ELAN_RUN } from './ElanRings'
import { RACER_COURSE_SCALE } from './elanCourse'
import { WORLD_K } from '../worldScale.js'
import M1Player, { FOOT, START, M1INPUT, M1MOVE, M1BOUNDS, M1CAM, ELAN_MEM } from './M1Player'
import { STAGE_CAMS, STAGE_MARKS } from '../Stage'
import { M1CLOCK, STEP } from './m1Clock'
import { K, G } from './m1Scale.js'
import { trimeshOf, amphModelOf, worldPosOf, trackDialog, keyList, rankFence, FENCE_TAG, rampVerts } from './m1Host'
import { createSky, skyLog } from '../modules/m1-sky'
import { createSkyR13 } from '../modules/sky-r13'
import { isTerrain3, TERRAIN3_CFG, applyShadowTone3, applyFootShade, applyFigureShadow } from '../look/terrain3.js'
import * as T3LOOK from '../look/terrain3.js' // T3_CALM (Beruhigung, nur im mvp-Stand vorhanden; fehlt sie, gilt 0)
import { createTerrain, TERRAIN, terrainLog, GROUND_Y, terrainHeight, groundHeight } from '../modules/m1-terrain'
import { createAmphitheater, amphLog, AMPH_LOD_URL } from '../modules/amphitheater'
import { SHADE_ON, SHADE_TEST, scanShadeFloor, updateShadeFloor } from '../look/shadeFloor' // V-683: Schattenseite aller Nicht-Gelände-Objekte (shade=1, A/B)
import { FIGLIGHT_ON, FIG_LIGHT_TEST, attachFigureLights } from '../look/figureLights' // Figurenlicht R1 (Georg 23.10.): je Figur, die nächsten vier, immer, mit Lichtkreis (figlight=1, A/B)
import { FIGAMB_ON, FIG_AMB_TEST, applyFigureAmbient, updateFigureAmbient } from '../look/figureAmbient' // Georg 23.10.: Figuren lesbar mit bestehendem Licht (figamb=1, A/B)
import { OUTLINE_ON, OUTLINE_TEST, createFigureOutline } from '../look/figureOutline' // Probe Georg 23.10.: Umriss nur außen für Figuren (outline=1)
import { SHADOW_CULL_ON, createShadowCull } from '../look/shadowCull.js'
import { locoActorLog } from '../modules/m1-locoActor'
import { faceActorLog } from '../modules/faceMountActor'
import { eyeActorLog } from '../modules/eyeActor'
import { createBillboard, BIOMES, billboardLog } from '../modules/billboard'
import { createStageLight, createContactAO, createPracticals, castFrontFaces, applyTone, parseTod, moodAt, shadowLength, sunDirection, MOOD_SETS } from '../vendor/light/kfb-stage-light.v1.1.js'
import { createActor } from '../actors/actorSlot'
import { createDialog } from '../modules/dialog'
import BubbleHost from '../BubbleHost'
import ChoiceHost from '../ChoiceHost'
import { getReader, isPoolReady } from '../dialogText'
import { callLine } from '../poolReader' // WS-NPC chat=syl: Rufe V-712 der Figuren
import { anchorAt, registerAnchor } from '../bubbleAnchors'
import { CHAT_SYL, setHudRects } from '../bubbleAvoid' // WS-NPC chat=syl: Blasen meiden HUD und Figuren
import { createTalkDirector } from '../npc/talkDirector' // WS-NPC chat=syl: Wechselrede (Lead 24.10.)
import * as kfbAudio from '../audio/kfbAudio.js' // WS-Audio speak() (chat=syl), fehlt es, gilt die Lesezeit
import { useGame } from '../store'
import { DECKS, cardAt, cardsOfDeck } from '../cards'
import { useHostKeys, PRIO, ACTION_KEYS } from '../hostKeys'
import { expose, DEBUG, DEVUI, onDevUi } from '../debug'
import { GFX, gfxChannel } from '../look/groundFx.js' // V-632: Boden-Lichteffekte (Kegel, Pfütze, Ring) über kfb-groundfx; löst die Einhängung des Lichtpfützen-Kits V-572 ab
import clipsGeneral from '../assets/actors/Rig_Medium_General.glb?url'
import clipsMove from '../assets/actors/Rig_Medium_MovementBasic.glb?url'
import clipsSim from '../assets/actors/Rig_Medium_Simulation.glb?url' // WS-NPC: Waving (Gruß), KayKit Character Animations as-is (Lead-OK 21.10.)
import clipsSpecial from '../assets/actors/Rig_Medium_Special.glb?url' // WS-NPC Phase D: Skeletons_* (KayKit Character Animations 1.1 as-is, Blob 4c2277de)
import clipsRanged from '../assets/actors/Rig_Medium_CombatRanged.glb?url' // Kampf R1: Ranged_1H_* (KayKit Character Animations 1.1 as-is, kayfabizarro main, Blob df56bad0)
import { createCombatPlayer } from '../modules/combatPlayer'
import { createOrchard3d } from '../modules/orchard3d'
import { createFluffSuck } from '../modules/fluffSuck.js'
import { createSuckAudio } from '../audio/suckAudio.js'
import { createGemLanterns, lanternsAlongPath } from '../modules/gemLanterns.js'
import { createGroundContact } from '../world/grounding.js' // V-654 C6: Erdkeil + Kontakt-Steinchen um Kristalle, Bäume, Fundsachen, Amphitheater
import { isTerrain2, TERRAIN2_CFG } from '../look/terrain2.js'
import { stagePaletteFor } from '../stagePalette'
import HudR5f from '../HudR5f'
import { cardImage } from '../cardImage'
import HudClay, { clayHudAvailable, hud3dAvailable } from '../HudClay' // Knet-HUD R1 (V-656): hud=clay, Standard Holz bis Georgs Abnahme
import { createFoundItems3d } from '../modules/foundItems3d'
import { createPath3d } from '../modules/path3d'
import { placeLoot } from '../world/loot.js'
import { createClaySSOT } from '../modules/claySSOT'
import { applyKitFigure } from '../look/clayKit'
import { figureCards } from '../actors/figureCard'
import { SKIP_DEFAULT, MAX_PULL } from '../vendor/clay/kfb-clay.v1.1.js'
import { createHarvestState } from '../world/harvest.js'
import { createSaveStore, freshSave } from '../world/save.js'
import TREE_ANCHORS from '../data/world/kaykit-tree-fluff-anchors.v1.json'
import { createResidentLife } from '../npc/residentLife'
import NPC_WORLD from '../data/npc/residents.r1.json'
import { interpTrack } from './m1Clock'
import { createFlufferSet } from '../npc/flufferSet'
import FLUFFER_K15 from '../data/npc/fluffer.kinds.k15.json'
import ghostFluffUrl from '../assets/fluffer/KFB_Ghost_healed.k11c.glb?url'
import { createGroupLife } from '../npc/groupLife'
import { createBandLife } from '../npc/bandLife'
import { createDiscoLife } from '../npc/discoLife' // Lead: Disco K12 (Dioramen-Test Schritt 3)
import { discoK12, discoCast, discoMC, MOTION_LIBRARY_URL } from '../actors/discoCast'
import { withPrivateBody } from '../actors/privateCast'
import { botCast, botStationUrl, botBlockUrl } from '../actors/botCast'
import GREET_LINES from '../data/npc/greet.lines.json'
import { createGiftReveal } from '../npc/giftReveal'
import REVEAL_TOY from '../data/npc/reveal.toy-soldier.json'
import giftBaseUrl from '../assets/gift/Present_Base.gltf?url'
import giftBaseBin from '../assets/gift/Present_Base.bin?url'
import giftPaperUrl from '../assets/gift/Present_UnwrappedBase.gltf?url'
import giftPaperBin from '../assets/gift/Present_UnwrappedBase.bin?url'
import giftTex from '../assets/gift/toy_soldier_texture.png?url'
import { CLASS_SCALE } from '../actors/stageCast'
import AudioHost from '../audio/AudioHost.jsx' // WS-Audio R1 (V-598): ein Ton-Pfad (Mixer, Motor/Flug, Atmo, Kampf, Musik)
import { ENDLESS_ON, EndlessDrive, adoptRig, createEndlessTerrainMod, createDriveSkyMod } from '../world/EndlessDrive.jsx' // V-619 world=endless (WS1b): endlose Biom-Fahrt, Licht nur über das Rig

const hash = typeof location !== 'undefined' ? location.hash : ''
const BIOME = BIOMES[1] // wie #stage (Moos-Insel), bis WS0 Biom/Kartenzone der Bühne festlegt (§14.4)
// Bühnenkamera und Marken = Standard der Bühne (Stage.jsx STAGE_CAMS.near / STAGE_MARKS.near, Georg 14.10. „near nehmen“, §20) – übernommen.
// Brennweite wie #stage (Stage.jsx Cam: fov 38).
const STAGE_CAM = STAGE_CAMS.near, STAGE_FOV = 38
const STAGE_VIEW = { pos: STAGE_CAM.pos, target: STAGE_CAM.target, fov: STAGE_FOV }
const MK = (m) => [m.x * K, m.z * K, m.yaw] // V-345: STAGE_MARKS sind alte WS1-Bühnenmeter (Stage rechnet sie selbst × K), STAGE_CAMS schon J17
const MARK = { left: MK(STAGE_MARKS.near.left), right: MK(STAGE_MARKS.near.right) }
const STAGE_TRIGGER = { r: 6.2 * K, leaveR: 9.5 * K, maxDy: 0.9 * K } // Bühnenfläche ≈ 14 m (Innenkreis); Auslösen innerhalb 6,2 m um die Mitte, nur am Boden
const NCARDS = Math.max(1, +(/cards=(\d+)/.exec(hash)?.[1] || 2))
const di = DECKS.findIndex((d) => d.id === 'forget_utopia')
const DECK = di >= 0 ? cardsOfDeck(di).map(cardAt).filter((c) => c.num >= 1).slice(0, NCARDS) : []
// C3 (V-423, Langlauf R2 Stufe 3) · Fluff-Ernte (Hash harvest): drei Obstgarten-Zonen vor der offenen Theaterseite, je Zone eine Haupt-Sorte (V-368).
// Tasten (Platzhalter bis Georgs HUD-ZIP): V Faust (Schlagring), B Schuss (Projektil), N Explosion, T Saugarm (V-487 Stufe 2); Aufsammeln bei Kontakt (zu Fuß, im Auto). Stand in kfb.save/1.
const HARVEST = /(^|[#,])harvest(=\w+)?(,|$)/.test(hash)
const HARVEST_ZONES = [{ zone: 'goblin', main: 'absurd', center: [-26 * K, 46 * K], seed: 3 }, { zone: 'atlantis', main: 'tragic', center: [26 * K, 46 * K], seed: 5 }, { zone: 'utopia', main: 'heroic', center: [0, 74 * K], seed: 7 }]
export const HARVEST_STATE = { counts: {}, last: null, saved: null }
// C3b (V-434/V-437) · Fundsachen-Demo: ein Weg vom Start durch die Wiese zu den Gärten, Fundsachen in Gruppen daneben (nie auf dem Weg), schwebend auf
// 0,15 m über dem Boden (V-450); Aufheben mit I (oder R5f „Interagieren“) in den Rucksack, Wegwerfen in der Rucksack-Ansicht
export const DEMO_PATH = { pts: [[0, 30 * K], [0, 44 * K], [-14 * K, 50 * K], [-26 * K, 46 * K]], halfW: 1.3 }
const LOOT_ZONES = [{ zone: 'wiese', center: [9 * K, 40 * K], r: 9 }, { zone: 'goblin', center: HARVEST_ZONES[0].center, r: 12 }, { zone: 'atlantis', center: HARVEST_ZONES[1].center, r: 12 }, { zone: 'utopia', center: HARVEST_ZONES[2].center, r: 12 }]
// V-450 (Georg 18.10.): Fundsachen schweben mit gleichem Bodenabstand 0,15 m (ersetzt die Hüfthöhe aus V-437/§81), Länglich-Teile 35° gekippt (foundItems3d)
const PATH_OPTS = { path: DEMO_PATH, terrainH: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), ...(isTerrain3(hash) ? { color: (TERRAIN3_CFG.palettes[(/palette=(\w+)/.exec(hash) || [0, TERRAIN3_CFG.palette])[1]] || TERRAIN3_CFG.palettes.mesa).sand, shade: (m) => applyShadowTone3(m, { palette: (/palette=(\w+)/.exec(hash) || [0, TERRAIN3_CFG.palette])[1] }) } : {}) }

// Spieler = FrizzleBob aus derselben Besetzung wie #stage (actors/stageCast FB, V-206; Prüfer M1-5 Befund N5) – ohne Bühnen-Lage und Clips der Bühne:
// Lage führt ecctrl, Clips lädt der Darsteller-Slot (CLIP_URLS)
const { clipsUrl: _c, motion: _m, position: _p, yaw: _y, ...FB_OPTS } = FB(0, 0, 'stage-left')
const PLAYER_ACTOR = { ...FB_OPTS, worldScale: K } // V-345: Figur in J17-Meter (createActor), Tempo-Abgleich im Loco-Modul
// Partner (V-269, Georg 15.10.): GothGirl wie in #stage – gleiche Besetzung über actors/stageCast (V-206), Lage = rechte Marke
const PARTNER = { ...KAYKIT('gothgirl')(MARK.right[0], MARK.right[2], 'stage-right'), position: [MARK.right[0], 0, MARK.right[1]], worldScale: K }
// Kampf R1: mit harvest (Ziele, Schuss) auch die KayKit-Kampfclips Ranged_* für die K10-Waffen auf dem Mixer der Figur (ein Mixer, Einmal-Clip)
const CLIP_URLS = HARVEST ? [clipsMove, clipsGeneral, clipsRanged] : [clipsMove, clipsGeneral]
const SKY = { variant: 'S', mode: 3 }
// #439 (V-561): look=terrain2 = Cartoon-Terrain-Variante (Farbflächen, Palettenschatten, keine Kontaktflecke); world=canyon|bucht|otown wählt die Palette
export const TERRAIN2 = isTerrain2(hash), T2_WORLD = (/world=(canyon|bucht|otown)/.exec(hash) || [0, TERRAIN2_CFG.world])[1]
const T2_AMPH_PAL = TERRAIN2 ? stagePaletteFor(null, { override: T2_WORLD, variant: 'b' })?.amph || null : null
// #439 look=terrain3 (Georg 21.10.): Malweise der Gelände-Probe – Fließfarben, Himmel v2 mit Kuppelwolken; palette=mesa|moos|wueste|schnee|pastell
export const TERRAIN3 = isTerrain3(hash), T3_PAL = (/palette=(mesa|moos|wueste|schnee|pastell)/.exec(hash) || [0, TERRAIN3_CFG.palette])[1]
// #439 world=probe (Georg 21.10.): Geländeform der Gelände-Probe als zweite Welt, kombinierbar mit look=terrain3 (nicht mit terrain2: dort wählt world die Palette)
export const PROBE_WORLD = /(^|[#,])world=probe(,|$)/.test(hash)
const TERR = { biome: BIOME, ...(PROBE_WORLD ? { world: 'probe', light: () => LIGHT_INFO()?.mood || null } : {}),   // WS1c: Unterwasser-Licht aus dem einen Rig
  ...(TERRAIN3 ? { look: 'terrain3', palette: T3_PAL } : {}), ...(TERRAIN2 ? { look: 'terrain2', world: T2_WORLD, ring: T2_AMPH_PAL ? { stage: T2_AMPH_PAL.cols[4], rock: T2_AMPH_PAL.cols[3] } : null } : {}) }
const AMPH_FULL = DEBUG && /(^|[#,])amph=full(,|$)/.test(hash) // Vergleich mit dem Original (349 k Dreiecke)
const AMPH = { biome: BIOME, groundR: 0.01, worldK: K, ...(AMPH_FULL ? {} : { url: AMPH_LOD_URL }), ...(TERRAIN2 ? { palette: T2_AMPH_PAL, palAmt: 1, clay: true, castShadow: true } : {}) } // #439: gleiche Palette, Knete v1.1 und echter Schatten wie das Gelände // Boden kommt vom Gelände (gleiche Höhe −0,125 m), kein zweiter Boden
const BB = { card: DECK[0] || null, biome: BIOME, maxW: 7, maxH: 5, position: [0, 0, -3.5 * K], worldK: K }

const mods = {}
const mk = (k, f) => (o) => { mods[k] = f(o); return mods[k] }
// WS-NPC Phase A (V-585, BRIEF_WS1_NPC_LIFE_R2): Bewohner mit Tagesplan hinter dem Hash npc (sinnvoll mit harvest: Arbeits-POIs an den Obstgärten).
// npct=<s> setzt die Startzeit im Tag (Standard 0,27 Tag: das erste Treffen am Wiesenrand folgt nach ≈ 20 s). Nur im J17-Maßstab (nicht wscale=legacy).
const NPC_ON = /(^|[#,])npc(,|$)/.test(hash) && K !== 1, NPC_T0 = +(/npct=(\d+(?:\.\d+)?)/.exec(hash)?.[1] ?? NPC_WORLD.dayS * 0.27)
const makeNpc = mk('npc', (o) => { const m = createResidentLife(o), offs = m.holders().map((h) => interpTrack(h)), own = m.dispose; m.dispose = () => { offs.forEach((f) => f()); own() }; return m })
// WS-NPC Phase C P1 (V-583, Georg 21.10.: Ghost, Heil-Waffe Gun_Pistol) hinter dem Hash fluffer (braucht harvest: Baum, Schuss, Fluff); fluffert=<s> Startzeit
const FLUFFER_ON = /(^|[#,])fluffer(,|$)/.test(hash) && /(^|[#,])harvest(=\w+)?(,|$)/.test(hash) && K !== 1, FLUFFER_T0 = +(/fluffert=(\d+(?:\.\d+)?)/.exec(hash)?.[1] ?? 4)
// K15 (Lead 22.10.): je Obstgarten-Zone ein Dark Fluffer (fluffers[]); Sorte je Erscheinen per Tages-Seed; Modelle erst beim Erscheinen laden (glob ohne eager)
// fluffern=<n> begrenzt auf die ersten n Zonen (1 = nur der Ghost am Goblin-Baum)
const FLUFFER_K15_URL = import.meta.glob('../assets/fluffer/k15/*_healed.k11c.glb', { query: '?url', import: 'default' })
const flufferUrlOf = (kind) => { if (kind === 'ghost') return Promise.resolve(ghostFluffUrl); const k = FLUFFER_K15.kinds.find((x) => x.kind === kind), load = k && FLUFFER_K15_URL['../assets/fluffer/k15/' + k.file]; return load ? load() : Promise.resolve(null) }
const FLUFFER_N = +(/fluffern=(\d+)/.exec(hash)?.[1] ?? NPC_WORLD.fluffers.length)
const makeFluffer = mk('fluffer', (o) => createFlufferSet(o))
const FLUFFER_OPTS = { defs: NPC_WORLD.fluffers.slice(0, FLUFFER_N), kinds: FLUFFER_K15.kinds.map((k) => k.kind), urlOf: flufferUrlOf, T0: FLUFFER_T0, dayS: NPC_WORLD.dayS, dayOf: (t) => Math.floor((t + NPC_T0) / NPC_WORLD.dayS), maxNear: NPC_WORLD.flufferSpawns?.maxNear ?? 3, playerPos: () => { const p = worldPosOf(mods.player); return p ? { x: p.x, z: p.z } : null }, track: (h) => interpTrack(h), worldScale: K, onEvent: (e) => { if (e.type === 'healed') mods.npc?.observeCure?.({ flufferId: e.flufferId, at: e.at, t: (M1CLOCK.t ?? 0) + NPC_T0 }) }, clock: () => M1CLOCK.t, groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), terrain: () => mods.terrain, orchard: () => mods.orchard, player: () => mods.player }
// WS-NPC Phase D (Georg 21.10. Go, SPEC_NPC_PATROL_R1): Gruppen auf Fahrplan hinter dem Hash patrol (heute: Skelett-Patrouille westlich des Theaters)
const PATROL_ON = /(^|[#,])patrol(,|$)/.test(hash) && K !== 1, GROUP_IDS = NPC_WORLD.groups.flatMap((g) => g.members.map((m) => m.id))
const makeGroups = mk('groups', (o) => { const m = createGroupLife(o), offs = m.holders().map((h) => interpTrack(h)), own = m.dispose; m.dispose = () => { offs.forEach((f) => f()); own() }; return m })
// WS-NPC Phase D · Ork-Band (Lead 21.10.): #band; Ort #bandat=x,z,Grad. Private Assets (KayKit-Kauf) nur, wenn src/private beim Bauen da ist (gitignored,
// Verweis auf ~/kfb-ws1/private-assets, flacher Klon von assets/private); sonst Platzhalter. Nichts davon gehört ins Repo.
const BAND_ON = /(^|[#,])band(,|$)/.test(hash) && K !== 1, BAND_DEF = NPC_WORLD.bands?.[0]
const BAND_PRIV = import.meta.glob('../private/50_BLENDER/ORKBAND/_privat_kauf_asset/band/KFB_Band_*.r1.glb', { query: '?url', import: 'default', eager: true })
const BAND_SCENE = Object.values(import.meta.glob('../private/50_BLENDER/ORKBAND/scenelet/orc_band_01.scenelet.json', { import: 'default', eager: true }))[0] || null
const BAND_AT = (() => { const m = /bandat=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(-?\d+(?:\.\d+)?))?/.exec(hash); return m ? { at: [+m[1], +m[2]], yawDeg: m[3] != null ? +m[3] : BAND_DEF?.yawDeg ?? 0 } : { at: BAND_DEF?.at || [0, 0], yawDeg: BAND_DEF?.yawDeg ?? 0 } })()
const BAND_IDS = (BAND_SCENE?.actors || BAND_DEF?.fallback?.actors || []).map((a) => 'band-' + a.id)
const makeBand = mk('band', createBandLife)
// Lead · Disco K12 (#disco, discoat=x,z[,Grad]): 7 Tänzer aus src/private (WSB K12) + MC FrizzleBob; ohne private Dateien Kulisse + MC (PLACEHOLDER).
// Ort: ohne discoat die flachste freie Stelle 22–70 m um die Band (abseits Band und Platzmitte), Publikum zur Platzmitte.
const DISCO_ON = /(^|[#,])disco(,|$)/.test(hash) && K !== 1
const DISCO_AT = (() => { const m = /discoat=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(-?\d+(?:\.\d+)?))?/.exec(hash); return m ? { at: [+m[1], +m[2]], yawDeg: m[3] != null ? +m[3] : null } : { at: null, yawDeg: null } })()
const makeDisco = mk('disco', createDiscoLife)
const DISCO_OPTS = { k12: discoK12(), cast: discoCast, mc: discoMC, createActor, at: DISCO_AT.at, yawDeg: DISCO_AT.yawDeg, near: BAND_AT.at, avoid: [{ at: BAND_AT.at, r: 20 }, { at: [0, 0], r: 28 }],
  groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), clock: () => (M1CLOCK.t ?? 0) + NPC_T0, player: () => { const p = worldPosOf(mods.player); return p ? { x: p.x, y: p.y, z: p.z } : null },
  worldScale: K, classScale: CLASS_SCALE, motionLibraryUrl: MOTION_LIBRARY_URL, propsBase: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/c746a9567e0ea20a24b8969fe9130ac0756e7a7e/media/3D_Assets/' }
const BAND_OPTS = BAND_DEF ? { scenelet: BAND_SCENE || { ...BAND_DEF.fallback, assets: {} }, urls: Object.fromEntries(Object.entries(BAND_PRIV).map(([k, v]) => [k.split('/').pop(), v])), at: BAND_AT.at, yaw: (BAND_AT.yawDeg * Math.PI) / 180,
  groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), clock: () => (M1CLOCK.t ?? 0) + NPC_T0, player: () => { const p = worldPosOf(mods.player); return p ? { x: p.x, y: p.y, z: p.z } : null }, worldScale: K, classScale: CLASS_SCALE,
  placeholder: { cast: () => KAYKIT(BAND_DEF.placeholderCast)(0, 0, null), clipUrls: [clipsGeneral, clipsSim] } } : null
// WS-NPC N15 (WS0 22.10., ersetzt G-3): Spielzeug-KO/Aufstehen aus WSB N15 (privat, optional aus src/private); fehlt die Datei, bleiben die Skelett-Clips
const N15_URL = Object.values(import.meta.glob('../private/50_BLENDER/N15/_privat_kauf_asset/KFB_ToySoldier_duel.r3d.n15.glb', { eager: true, query: '?url', import: 'default' }))[0] || null
const GROUP_DEFS = NPC_WORLD.groups.map((g) => (N15_URL && g.combatN15 ? { ...g, combat: { ...(g.combat || {}), ...g.combatN15 } } : g))
const GROUP_OPTS = { groups: GROUP_DEFS, tables: NPC_WORLD.encounterTables, revealOnly: /(^|[#,])gift(,|$)/.test(hash) && NPC_WORLD.gifts?.[0] ? [NPC_WORLD.gifts[0].group] : [], /* E3: Trupp nur aus dem Geschenk */ bubbleR: NPC_WORLD.bubbleR, groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), clipUrls: [clipsMove, clipsGeneral, clipsSim, clipsSpecial], cast: (id, m) => { const c = botCast(id) || KAYKIT(/^kayfabrick-bot:/.test(id) ? m?.placeholderCastId || 'adventurer-barbarian' : id)(0, 0, null); return N15_URL && m?.clipSources?.includes('N15') ? { ...c, extraClipUrls: [N15_URL] } : c }, worldScale: K, classScale: CLASS_SCALE, // Bots B17 privat (PROOF), sonst Platzhalter
  staticUrl: (key) => { const [kind, c] = key.split(':'); return kind === 'station' ? botStationUrl(c) : kind === 'block' ? botBlockUrl(c) : null },
  clock: () => M1CLOCK.t, player: () => { const p = worldPosOf(mods.player); return p ? { x: p.x, y: p.y, z: p.z } : null }, orchard: () => mods.orchard, // D3: Ziele, Fluff
  day: () => Math.floor(((M1CLOCK.t ?? 0) + NPC_T0) / NPC_WORLD.dayS), onEvent: (e) => mods.npc?.observeGroup?.({ ...e, t: (M1CLOCK.t ?? 0) + NPC_T0 }) }
// Phase B: Gedächtnis im Weltstand kfb.world-save/1 (localStorage, getrennt von kfb.save/1); npcfresh leert ihn vorher (Tests); npcmem=0 schaltet ab
// WS-NPC E3 (WS0 V-634, Lead 22.10.): Trupp aus dem Geschenk. #gift (braucht patrol); Ort #giftat=x,z,Grad; Auslöser debug __kfbM1.gift().spawn() bzw. #giftauto=<s>
const GIFT_ON = /(^|[#,])gift(,|$)/.test(hash) && PATROL_ON, GIFT_DEF = NPC_WORLD.gifts?.[0]
const GIFT_AT = (() => { const m = /giftat=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(-?\d+(?:\.\d+)?))?/.exec(hash); return m ? { at: [+m[1], +m[2]], yawDeg: m[3] != null ? +m[3] : GIFT_DEF?.yawDeg ?? 0 } : { at: GIFT_DEF?.at || [0, 0], yawDeg: GIFT_DEF?.yawDeg ?? 0 } })()
const GIFT_AUTO = /giftauto=(\d+(?:\.\d+)?)/.exec(hash)?.[1]
const makeGift = mk('gift', (o) => { const m = createGiftReveal(o), own = m.update; let auto = GIFT_AUTO != null; m.update = (dt, c) => { if (auto && (M1CLOCK.t ?? 0) >= +GIFT_AUTO && m.spawnAt()) auto = false; own(dt, c) }; return m })
const GIFT_OPTS = GIFT_DEF ? { spec: REVEAL_TOY, def: { ...GIFT_DEF, ...GIFT_AT }, urls: { base: giftBaseUrl, baseBin: giftBaseBin, unwrapped: giftPaperUrl, unwrappedBin: giftPaperBin, tex: giftTex },
  groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), clock: () => M1CLOCK.t ?? 0, groups: () => mods.groups, worldScale: K, classScale: CLASS_SCALE } : null
const NPC_OPTS = { world: NPC_WORLD, partners: () => { const st = mods.partner?.status?.(), p = st?.status === 'OK' && st.shown !== false ? worldPosOf(mods.partner) : null; return p ? [{ id: 'gothgirl', x: p.x, z: p.z }] : [] }, partnerBlocked: () => M1STATE.phase === 'dialog', /* Sprech-Anlass gothgirl (Georg 24.10.): Bemerken als greet ohne Blase */ threat: (id, at) => mods.fluffer?.threat?.(at) ?? null, memory: !/(^|[#,])npcmem=0(,|$)/.test(hash), memoryFresh: /(^|[#,])npcfresh(,|$)/.test(hash), groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), clipUrls: [clipsMove, clipsGeneral, clipsSim], cast: (id) => withPrivateBody(id, KAYKIT(id)(0, 0, null)), worldScale: K, t0: NPC_T0,
  onGreet: (e) => { if (CHAT_SYL) return; if (!GREET_LINES.noBubble.includes(e.reason)) useGame.getState().say('npc-' + e.id, getReader().silence(), 'thought') }, // G-2: Blase je Grund (greet.<reason>); bis WS0-Zeilen da sind nur „…“ (S5b),
  clock: () => M1CLOCK.t, player: () => { const p = worldPosOf(mods.player); return p ? { x: p.x, y: p.y, z: p.z } : null } }
// WS-NPC chat=syl (Lead 24.10., Georg-GO): Sprech-Anlässe werden Wechselrede mit Blase und Laut (talkDirector; Laut WS-Audio speak). Standard bleibt bis Georgs Urteil.
// Begrüßungen zeigen dann die Ruf-Blase statt „…“ (onGreet oben schweigt); der Disco-MC bleibt ruhig, bis er ruft (mcWaitsForCall)
const makeTalk = mk('talk', createTalkDirector)
const TALK_OPTS = { sources: () => ({ band: mods.band, disco: mods.disco, npc: mods.npc }), reader: { ssotLine: (...a) => getReader().ssotLine(...a) }, callLine, anchorAt, registerAnchor,
  say: (anchor, line, life) => useGame.getState().say(anchor, line, 'speech', undefined, life), speak: (a) => kfbAudio.speak?.(a) ?? null,
  busy: () => M1STATE.phase === 'dialog', onCall: (b) => { if (b.bt.mc) mods.disco?.mcCall?.() }, player: () => worldPosOf(mods.player) }
if (CHAT_SYL) DISCO_OPTS.mcWaitsForCall = true
// V-487 Stufe 3 · Kristall-Laternen (kfb-gem.v1 r4) entlang des Demo-Wegs, nachts leuchtend; echte Lichter nur über den Practicals-Pool (≤ 6, nächste zur
// Kamera), Lichtfleck am Boden für alle (gem pool). Stärke = Stimmungs-glow (Tag 0, Gold 0,35, Nacht 1). lanterns=0 schaltet aus.
const LANTERNS_ON = !/(^|[#,])lanterns=0(,|$)/.test(hash)
// V-654 C6 (MVP-Kritiker R1 K4, Georg 22.10.): Erdung – Gelände steigt an Kristall-Laternen, Bäumen, Fundsachen und am Amphitheater-Fuß an (Erdkeil im
// Geländematerial), Kontakt-Steinchen in ungeraden Gruppen; Amphitheater-Eingang (Rampe, +z) bleibt frei. ground=0 schaltet aus (Vorher-Bild).
const GROUND_ON = !/(^|[#,])ground=0(,|$)/.test(hash)
const amphGround = () => { const A = mods.amph; if (A?.status?.().status !== 'OK' || !A.footRadii) return null; const R = A.footRadii()
  return { id: 'amph', kind: 'amph', x: 0, z: 0, r: Math.min(...R), radii: (a) => { const t = (((a / (2 * Math.PI)) % 1 + 1) % 1) * 64, i = Math.floor(t) % 64, f = t - Math.floor(t); return R[i] * (1 - f) + R[(i + 1) % 64] * f }, gaps: [[Math.PI / 2 - 0.36, Math.PI / 2 + 0.36]] } }
const GROUND_OPTS = { terrain: () => mods.terrain, palette: TERRAIN3 ? (TERRAIN3_CFG.palettes[T3_PAL] || TERRAIN3_CFG.palettes.mesa) : { sand: BIOME.top, low: BIOME.top, mid: BIOME.top, high: BIOME.top, cliff: '#6b5a4a' },
  neverBlackRoots: () => [mods.orchard?.object3d],   // Kronen-Unterseiten nie schwarz (V-570)
  sources: () => [amphGround(), ...(mods.lanterns?.anchors?.() || []), ...(mods.orchard?.trees?.() || []).map((t) => ({ id: 'tree:' + t.zone + ':' + t.id, kind: 'tree', x: t.pos[0], z: t.pos[2], r: 0.24 })), ...(mods.found?.anchors?.() || []), ...(mods.orchard?.balls?.() || []).filter((b) => b.state === 'resting').map((b) => ({ id: 'fall:' + b.key, kind: 'item', x: b.p[0], z: b.p[2], r: (b.r || 0.12) * 0.95 }))] }   // Fallobst: kleiner Erdkeil (eingesunken, Georg 23.10.)
const makeGround = mk('ground', createGroundContact)
const makeLanterns = mk('lanterns', createGemLanterns), makePract = mk('practicals', createPracticals)
const makeSuck = mk('suck', createFluffSuck), SUCK_OPTS = { maxJobs: 24, onCue: (c, j) => { HARVEST_STATE.cues = (HARVEST_STATE.cues || 0) + 1; HARVEST_STATE.lastCue = c; SUCK_AUDIO.a?.cue(c, j) } }, SUCK_AUDIO = { a: null } // Ton ab dem ersten T (Browser-Regel)
// Kampf R1 (Georg 22.10.): FrizzleBob mit den K10-Waffen (Pistole, HeroMan-Blaster) aus dem Rucksack; Ziffern 1/2/3 wechseln (ACTION_KEYS.weapon), B feuert mit
// aktiver K10-Waffe (ohne bleibt der alte Schuss). weapon=pistol|blaster setzt die Startwaffe. Figur dreht über M1Player.face (Controller besitzt die Blickrichtung).
const PLAYER_CTRL = { ref: null }, WEAPON0 = (/(^|[#,])weapon=(pistol|blaster)(,|$)/.exec(hash) || [])[2] || null
const makeCombat = mk('combat', createCombatPlayer)
const COMBAT_OPTS = { player: () => mods.player, orchard: () => mods.orchard, groups: () => mods.groups, groundAt: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), face: (yaw) => PLAYER_CTRL.ref?.current?.face?.(yaw), worldScale: K }
const makePath = mk('path', (o) => createPath3d(o)), makeOrchard = mk('orchard', createOrchard3d), makeClay = mk('clay', createClaySSOT), makeFound = mk('found', createFoundItems3d)
// V-429 · Knete aus kfb-clay.v1.1 auch in der Laufwelt: Spieler und Partnerin nach ihrer Figurenkarte (character), Obstgarten-Bäume midground (Kügelchen und
// Wirkungen behalten ihr Material: Instanz-Farben je Sorte); clay=0 schaltet aus
const CARDS = figureCards(), CLAY_ON = !/(^|[#,])clay=0(,|$)/.test(hash)
// WS-NPC C5 (MVP-Kritiker R1, WS0 V-654): „eine Machart“ – Knete (kfb-clay v1.1, Profil character wie die Bühnenfiguren) auch auf Kit-Figuren
// (Bewohner, Gruppen, Band); Kit-Farben auf die Rollen der aktiven Biom-Palette (terrain3) gezogen, Augen/Augen-Rig über SKIP_DEFAULT ausgenommen.
// Schalter #kitclay (Standard an erst nach Georgs Abnahme). Zug vorläufig = Kanon-Obergrenze MAX_PULL (V-340, 18 %), Wert legt WS0/Georg nach A/B fest.
const KITCLAY = !/(^|[#,])kitclay=0(,|$)/.test(hash) // Georg 22.10.: Kit-Knete ist Standard, kitclay=0 = ohne
// V-662 (Lead 22.10.): kitclay=1 = character mit kitSkip-Fix, kitclay=2 = kit-figure (clayKit, Vorschlag kfb-clay v1.2) mit Fix. Ohne Schalter bleibt das Bild
// exakt wie abgenommen (Fix ändert das Bild erst nach Georgs neuer Abnahme): eyeActor-Figuren faktisch ohne Knete, Band wie bisher.
const KITCLAY2 = /(^|[#,])kitclay=2(,|$)/.test(hash), KITFIX = KITCLAY2 || /(^|[#,])kitclay=1(,|$)/.test(hash)
// Beruhigung (terrain3 calm, mvp): Rollenfarben genau wie der Gelände-Shader dämpfen – Sättigung −35 %·calm, dann Zug 40 %·calm zum Mittelton
// t3m = mix(mix(low, mid, 0,5), sand, 0,3) (terrain3.js Z. 127/128), damit die Figuren zum beruhigten Boden passen
const kitPalette = () => { const P = TERRAIN3 && TERRAIN3_CFG.palettes?.[T3_PAL]; if (!P) return null
  const calm = +(T3LOOK.T3_CALM ?? 0), c = (h) => new THREE.Color(h), mid = c(P.low).lerp(c(P.mid), 0.5).lerp(c(P.sand), 0.3)
  return ['sand', 'low', 'mid', 'high', 'peak', 'cliff', 'water'].filter((r) => P[r]).map((r) => { const k = c(P[r]); if (calm > 0) { const L = 0.2126 * k.r + 0.7152 * k.g + 0.0722 * k.b
    k.lerp(new THREE.Color(L, L, L), 0.35 * calm); k.lerp(mid, 0.4 * calm) } return '#' + k.getHexString() }) }
const KIT_PAL = kitPalette()
// V-662-Befund 22.10.: SKIP_DEFAULT prüft den ganzen Pfad – die Wurzel „eyeActor:<id>“ trifft /eye/, damit blieb jeder Mesh der Kit-Figuren ohne Knete.
// kitSkip prüft nur die Namen unterhalb der Figurenwurzel (Augen, Lider, Mund des Augen-Rigs werden weiter ausgelassen).
const kitSkip = (root) => (o) => { for (let n = o; n && n !== root; n = n.parent) if (SKIP_DEFAULT.test(n.name || '')) return true; return false }
const kitClayTargets = () => [...(mods.npc?.actors?.() || []), ...(mods.groups?.actors?.() || []), ...(mods.band?.clayTargets?.() || [])]
  .map((a) => ({ module: a, profile: 'character', seed: a.object3d?.name || 'kit', ...(KITFIX ? { skip: kitSkip(a.object3d) } : {}), ...(KIT_PAL ? { palette: KIT_PAL, pull: MAX_PULL } : {}), ...(KITCLAY2 ? { after: applyKitFigure } : {}) }))
const CLAY_M1 = { targets: () => [{ module: mods.player, card: CARDS.frizzlebob }, { module: mods.partner, card: CARDS.gothgirl }, ...(KITCLAY ? kitClayTargets() : []),
  ...(mods.found ? [{ module: mods.found, profile: 'midground', seed: 'found', scaleRef: 0.9, skip: (o) => o.name === 'contact-blob' || SKIP_DEFAULT.test(o.name || '') }] : []),
  ...(mods.orchard ? [{ module: mods.orchard, profile: 'midground', seed: 'orchard', scaleRef: 2.6, skip: (o) => o.name === 'orchard-fluff' || !/^tree:/.test(o.parent?.name || '') && !/tree:/.test(pathName(o)) || SKIP_DEFAULT.test(o.name || '') }] : [])] }
const pathName = (o) => { const a = []; for (let n = o; n; n = n.parent) a.push(n.name || ''); return a.join('/') }
const makeSky = mk('sky', ENDLESS_ON ? createDriveSkyMod : TERRAIN3 ? (o) => createSkyR13({ ...o, palette: T3_PAL, mood: TODV <= 0.25 ? 'nacht' : TODV < 0.75 ? 'gold' : 'tag', sunDir: () => { const m = LIGHT_INFO()?.mood; return m ? sunDirection(m.elev, m.az) : null } }) : createSky), makeTerrain = mk('terrain', ENDLESS_ON ? createEndlessTerrainMod : createTerrain), makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makePartner = mk('partner', createActor), makeAO = mk('blobs', createContactAO), makeRig = mk('light', createStageLight)
// Kontaktflecke (V-203, L1: für alle Figuren; Georg 16.10.: „FrizzleBob schwebt“): Spieler und Partnerin (in M2 steht FB noch neben dem Auto)
// Kontaktverdeckung (L3, V-392/V-393 Stufe 0: Licht nur über das Bühnen-Licht-Modul): Spieler, Partnerin und im Fahrmodus das Auto (M2STATE.ao), je an
// der Boden-Normale ausgerichtet (GROUND_AT: Strahl auf die Kollider, sonst Gelände-Gradient)
export const GROUND_AT = { fn: null }
const M1GL = { gl: null, scene: null }
// C3 · Obstgarten-Wirt: Gelände-Höhe aus dem Terrain-Modul, Sammler = Spieler (zu Fuß) bzw. Auto (M2). Anzeige über HUD R5f (WS0 18.10.): gesammelter Fluff
// springt in die Fluff-Leiste (fl.land je Sorte), V Faust / B Blaster setzen die Waffe der Aktionsleiste, N legt die Cartoon-Bombe in den Kontext-Platz und
// zündet sie (Klick auf die Bombe zündet ebenso). Rucksack-Taste nur angezeigt (Fundsachen folgen mit C3b).
const KIND_INDEX = { tragic: 0, comic: 1, absurd: 2, heroic: 3, mystical: 4, forbidden: 5 }
// Knet-HUD (V-656): Schalter hud=clay | hud=wood (Standard clay seit Georgs Abnahme 22.10.). Ohne src/private immer Holz.
const HUD_SKIN = (/(^|[#,])hud=(clay|wood|3d)(,|$)/.exec(hash) || [0, 0, 'clay'])[2] /* hud=3d: HUD 3D R1 Spike (Georg 24.10.), nur per Schalter */ // Georg 22.10.: Knet-HUD ist Standard, hud=wood = Holz-HUD
// Ziele für den HUD-Pfeil (vorerst): Bühne und die drei Obstgarten-Mitten (HARVEST_ZONES); Höhe = Gelände + 2 m
const goalAt = (x, z) => () => ({ x, y: (mods.terrain?.surfaceAt || terrainHeight)(x, z) + 2, z })
const ORCHARD_NAME = { goblin: 'Goblin-Garten', atlantis: 'Atlantis-Garten', utopia: 'Utopia-Garten' }
const HUD_GOALS = [{ id: 'stage', name: 'Bühne', world: 'Amphitheater', pos: goalAt(0, 0) }, ...HARVEST_ZONES.map((z) => ({ id: 'orchard:' + z.zone, name: ORCHARD_NAME[z.zone] || z.zone, world: 'Obstgarten', pos: goalAt(z.center[0], z.center[1]) }))]
const HUD_GOAL = { id: 'stage' }
// S1 Fortbewegung (V-746) · travel=1: Auto rufen und verlassen zur Laufzeit wie ein Reittier, EINE Zustandsmaschine (travelState.js) für zu Fuß, Auto
// und Flug. Auslöser: HUD Settings › Mode (später das Fahrzeug-Symbol, WS1e). Ohne Schalter nicht vorhanden; carLive() === M2_ON.
const TRAVEL_SM = TRAVEL_ON ? createTravelState() : null, TRAVEL_FX = []
const travelClick = () => { if (TRAVEL_SM) TRAVEL_FX.push(...TRAVEL_SM.send('click', { canSummon: !PLAYER_CTRL.ref?.current?.flying?.() })) }
const CLAY_HOST = {
  palette: () => (TERRAIN3 ? TERRAIN3_CFG.palettes[T3_PAL] : TERRAIN3_CFG.palettes.moos), // Insel-Palette des Geländes (V-653); ohne terrain3 die Moos-Insel wie BIOME
  target: () => (carLive() ? M2STATE.carPos?.() : null) || worldPosOf(mods.player),
  terrain: () => mods.terrain || null, k: K,
  path: DEMO_PATH.pts.map(([x, z]) => [x, z]),
  marks: () => [{ x: 0, z: 0, color: '#e9c14a', r: 8 }], // Bühne (Amphitheater im Ursprung)
  // HUD 3D Zielpfeil (Lead 24.10.: der M1-Wirt besitzt den Ziel-Haken, bis es einen Quest-/POI-Owner gibt): vorerst die Bühne als Ziel
  goal: () => { const g = HUD_GOALS.find((x) => x.id === HUD_GOAL.id) || HUD_GOALS[0]; return { id: g.id, name: g.name, pos: g.pos() } },
  // HUD 3D Paket 4 (Lead 24.10., additiv): Zielliste für das Karten-Flyout; Auswahl setzt das Ziel des Pfeils. Owner vorerst der M1-Wirt, später Quest/POI.
  goals: () => HUD_GOALS.map((g) => ({ id: g.id, name: g.name, world: g.world, pos: g.pos() })),
  setGoal: (id) => { if (HUD_GOALS.some((g) => g.id === id)) HUD_GOAL.id = id; return HUD_GOAL.id },
  telemetry: () => (carLive() ? M2STATE.telemetry?.() ?? null : null), // HUD-Tempo-Leiste: Tempo/Boost vom Fahrzeug (nur lesend)
  isNight: () => TODV <= 0.25, // Kassetten-Tasten Tag/Nacht (V-707), gleiche Grenze wie das Nacht-Figurenlicht
  fluffTotal: () => mods.orchard?.total?.() ?? null, // Gesamt-Fluff (kfb.save fluffTotal, dd7de55): je gesammelt, nie verbraucht – HUD liest nur
  // HUD 3D Almanac (Lead 24.10.: Haken beim M1-Wirt, Startinhalt = Bühnen-Deck; echter Owner später das Karten-Journal kfb.world-save/2)
  almanac: () => ({ cards: DECK.map((c) => ({ deckId: c.deck.id, num: c.num })), total: DECK.length, decks: new Set(DECK.map((c) => c.deck.id)).size }),
  // HUD 3D Settings › Mode: Fly über den Spieler (wie Taste F), Drive nur über „car“ in der Adresse (neu laden; mit travel=1 ohne Neuladen über die Zustandsmaschine), God hat keinen Owner (folgt)
  mode: () => (carLive() ? 'drive' : PLAYER_CTRL.ref?.current?.flying?.() ? 'fly' : 'walk'),
  setMode: (m) => { const car = m === 'drive'; if (TRAVEL_SM) { if (car !== carLive()) travelClick(); else if (!car) PLAYER_CTRL.ref?.current?.setFlying?.(m === 'fly'); return }
    if (car !== M2_ON) { const h = location.hash.replace(/(^#|,)car(=\w+)?(?=,|$)/g, '$1').replace(/,,+/g, ',').replace(/,$/, ''); location.hash = car ? h.replace(/^#m1/, '#m1,car') : h; location.reload(); return }
    PLAYER_CTRL.ref?.current?.setFlying?.(m === 'fly') },
  cards: () => Promise.all(DECK.slice(0, 3).map((c) => cardImage(c.deck.id, c.num, 700).then((r) => r?.canvas || null, () => null))),
}
function Orchard() {
  const store = useMemo(() => createSaveStore(), [])
  const hud = useRef(null)
  const opts = useMemo(() => { const r = store.load(), st = createHarvestState(r.state || freshSave())
    return { zones: HARVEST_ZONES, terrainH: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), anchors: TREE_ANCHORS, state: st,
      collector: () => { const cp = carLive() ? M2STATE.carPos?.() : null, p = cp || worldPosOf(mods.player); return p ? { pos: [p.x, p.y, p.z], mode: cp ? 'vehicle' : 'walk' } : null },
      onCollect: (keys, counts) => { HARVEST_STATE.counts = counts; HARVEST_STATE.saved = store.save(st.toSave())
        const by = {}; for (const k of keys) { const b = mods.orchard?.balls().find((x) => x.key === k); if (b) by[b.kind] = (by[b.kind] || 0) + 1 }
        for (const [kind, n] of Object.entries(by)) hud.current?.land(KIND_INDEX[kind], n) } } }, [store])
  const counts0 = useMemo(() => { const c = opts.state.counts(); HARVEST_STATE.counts = c; return Object.keys(KIND_INDEX).map((k) => c[k] || 0) }, [opts])
  const { camera } = useThree()
  const act = useCallback((w) => { const p = worldPosOf(mods.player); if (!p || !mods.orchard) return null
    const d = camera.getWorldDirection(new THREE.Vector3()); d.y = 0; d.normalize(); return (HARVEST_STATE.last = mods.orchard[w]([p.x, p.y, p.z], [d.x, 0, d.z])) }, [camera])
  // Kampf R1: mit aktiver K10-Waffe feuert B die Waffe (Zielwahl wie der Schuss, Blick der Kamera), V/N wirken wie bisher und lassen die Aktionsleiste auf der Waffe
  const fireK10 = useCallback(() => { const p = worldPosOf(mods.player), C = mods.combat; if (!p || !C?.active()) return null
    const d = camera.getWorldDirection(new THREE.Vector3()); d.y = 0; d.normalize(); return (HARVEST_STATE.lastFire = C.fire({ from: [p.x, p.y, p.z], dir: [d.x, 0, d.z] })) }, [camera])
  useHostKeys((e) => { if (e.repeat || M1STATE.phase !== 'free') return; const w = { KeyV: 'punch', KeyB: 'shoot', KeyN: 'blast' }[e.code]; if (!w) return
    const k10 = !!mods.combat?.active(); if (w === 'shoot' && k10) { fireK10(); e.preventDefault(); return }
    if (!k10) hud.current?.setWeapon(w === 'shoot' ? 'blaster' : 'fist'); if (w === 'blast') hud.current?.setCtx('bomb')
    act(w); if (w === 'blast') setTimeout(() => hud.current?.setCtx(null), 600); e.preventDefault() }, PRIO.player)
  // Kampf R1: Waffe aktiv setzen (Rucksack, Ziffern): Kampfmodul, Aktionsleiste (Familie: Pistole/Blaster → 'blaster', keine → 'fist'), Häkchen im Rucksack
  const equip = useCallback((id) => { const C = mods.combat; if (!C || !C.equip(id ?? null)) return false; const w = id ? C.weapons().find((x) => x.id === id) : null
    hud.current?.setWeapon(w ? w.hud : 'fist'); hud.current?.setActiveWeapon?.(id ?? null); HARVEST_STATE.weapon = id ?? null; return true }, [])
  useHostKeys((e) => { if (e.repeat || M1STATE.phase !== 'free' || !(e.code in ACTION_KEYS.weapon)) return; if (equip(ACTION_KEYS.weapon[e.code])) e.preventDefault() }, PRIO.player)
  // Waffen in den Rucksack, sobald das Kampfmodul sie geladen hat (ohne src/private: keine Einträge, Status „keine Waffen“); Startwaffe aus weapon=
  const bagDone = useRef(false), bagEquipped = useRef(false)
  useEffect(() => onDevUi(() => { bagDone.current = false }), []) // V-655: Schalter „Entwickler-Infos“ → Rucksack-Notizen neu (Kit-Notiz bzw. Spielertext)
  useFrame(() => { const C = mods.combat; if (bagDone.current || !C || !hud.current || !M1GL.gl || C.status().status === 'LOADING') return; bagDone.current = true
    const list = C.weapons().filter((w) => w.status === 'OK').map((w) => ({ wid: w.id, id: 'k10.' + w.id, n: w.name, k: DEVUI ? 'Waffe · K10' : 'Waffe', icon: 'blaster', note: DEVUI ? w.note : 'Einzelschuss', /* Georg 22.10.: keine Entwicklertexte im Spielbild */ shot: C.thumbnail(w.id, M1GL.gl) })) // Bild = Original-Modell
    hud.current.setWeapons?.(list); HARVEST_STATE.bagWeapons = list.map((w) => w.wid); if (!bagEquipped.current && WEAPON0 && list.some((w) => w.wid === WEAPON0)) equip(WEAPON0); bagEquipped.current = true })
  const lanterns = useMemo(() => ({ items: lanternsAlongPath(DEMO_PATH, { n: 8, terrainH: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z) }), renderer: () => M1GL.gl, mood: () => moodAt(TODV, MOOD_SET), ground: BIOME.top }), [])
  const pract = useMemo(() => ({ practicals: () => (mods.lanterns?.practicals() || []).map((p) => ({ ...p, intensity: 1, halo: { size: 0.001 } })), weight: () => moodAt(TODV, MOOD_SET).glow ?? 0 }), []) // Leuchthof bringt kfb-gem selbst mit
  const found = useMemo(() => ({ items: placeLoot({ zones: LOOT_ZONES, path: DEMO_PATH, seed: 18 }), terrainH: (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z), lightTone: () => { const m = LIGHT_INFO()?.mood; return m ? { color: m.hemiSky, glow: m.glow ?? 0 } : null } }), []) // Georg 22.10.: schwebend (≈ 0,15 m), im Rig-Ton ausgeleuchtet
  const pickUp = useCallback(() => { const p = worldPosOf(mods.player); if (!p || !mods.found) return null; const it = mods.found.pick([p.x, p.y, p.z]); if (it) { hud.current?.addItem({ id: it.key, key: it.key, lootId: it.id, n: it.n, k: it.type === 'tool' ? 'Fundsache · selten' : 'Fundsache', icon: it.icon, note: 'Aus der Wiese aufgehoben.' }); HARVEST_STATE.picked = (HARVEST_STATE.picked || 0) + 1 } return it }, [])
  const throwAway = useCallback((it) => { const p = worldPosOf(mods.player); if (!p || !mods.found) return; const d = camera.getWorldDirection(new THREE.Vector3()); d.y = 0; d.normalize(); mods.found.drop({ key: it.key, id: it.lootId, n: it.n, icon: it.icon }, [p.x, p.y, p.z], [d.x, 0, d.z]); HARVEST_STATE.thrown = (HARVEST_STATE.thrown || 0) + 1 }, [camera])
  useHostKeys((e) => { if (e.repeat || M1STATE.phase !== 'free' || e.code !== 'KeyI') return; pickUp(); e.preventDefault() }, PRIO.player)
  // V-487 Stufe 2 · Saugarm (Platzhalter, bis Bots/Stationen/Saugarm-Beute aus Pack P2 kommen): T saugt bis zu 6 Kügelchen im Kegel vor dem Spieler
  // (≤ 6 m, gestaffelt 0,12 s) zur rechten Hand; Ablauf und Cues aus kfb-fluff-suck, gezählt wird erst beim Einsaugen (deliver → Fluff-Leiste)
  const hand = useRef(null)
  const nozzle = useCallback(() => { const P = mods.player?.object3d; if (P && !hand.current) P.traverse((o) => { if (!hand.current && /hand.?slot.?r|hand_?r$|righthand/i.test(o.name || '')) hand.current = o })
    const v = new THREE.Vector3(); if (hand.current) return { pos: hand.current.getWorldPosition(v) }
    const p = worldPosOf(mods.player); return { pos: v.set(p?.x || 0, (p?.y || 0) + 0.9, p?.z || 0) } }, [])
  const suckNow = useCallback(() => { const p = worldPosOf(mods.player); if (!p || !mods.orchard || !mods.suck) return []
    if (!SUCK_AUDIO.a) SUCK_AUDIO.a = createSuckAudio({ muted: /(^|[#,])mute(,|$)/.test(hash) }); SUCK_AUDIO.a.resume()
    const d = camera.getWorldDirection(new THREE.Vector3()); d.y = 0; d.normalize(); const keys = mods.orchard.suckable([p.x, p.y, p.z], [d.x, 0, d.z], 6, 0.5, 6)
    keys.forEach((k, i) => setTimeout(() => { const b = mods.orchard?.take(k); if (b) mods.suck?.suck(b, nozzle, b.origin, { onSwallow: () => { mods.orchard?.deliver(k); HARVEST_STATE.sucked = (HARVEST_STATE.sucked || 0) + 1 } }) }, i * 120))
    HARVEST_STATE.suckTries = (HARVEST_STATE.suckTries || 0) + 1; return keys }, [camera, nozzle])
  useHostKeys((e) => { if (e.repeat || M1STATE.phase !== 'free' || e.code !== 'KeyT') return; suckNow(); e.preventDefault() }, PRIO.player)
  useFrame((_, dt) => { if (!mods.suck) return; HARVEST_STATE.suck = mods.suck.stats(); SUCK_AUDIO.a?.update(dt, mods.suck.active()); HARVEST_STATE.suckAudio = SUCK_AUDIO.a?.info() })
  useFrame(() => { const p = worldPosOf(mods.player); if (!p || !mods.found || !hud.current) return; const t = !!mods.found.near([p.x, p.y, p.z]); if (t !== HARVEST_STATE.target) { HARVEST_STATE.target = t; hud.current.setTarget(t) } })
  return <><ModuleHost create={makeOrchard} options={opts} /><ModuleHost create={makeFound} options={found} /><ModuleHost create={makePath} options={PATH_OPTS} /><ModuleHost create={makeSuck} options={SUCK_OPTS} /><ModuleHost create={makeCombat} options={COMBAT_OPTS} />
    {LANTERNS_ON && <><ModuleHost create={makeLanterns} options={lanterns} /><ModuleHost create={makePract} options={pract} /></>}
    {(() => { const P = { counts: counts0, onApi: (a) => { hud.current = a; HARVEST_STATE.hud = a; if (CHAT_SYL) setHudRects(a?.clay ? () => a.clay()?.rects?.() : null) }, onCtx: (c) => { if (c === 'bomb') { act('blast'); hud.current?.setCtx(null) } }, onInteract: pickUp, onThrow: throwAway, onEquip: equip }
      return HUD_SKIN === '3d' && hud3dAvailable() ? <HudClay {...P} host={CLAY_HOST} kit="3d" /> : HUD_SKIN === 'clay' && clayHudAvailable() ? <HudClay {...P} host={CLAY_HOST} /> : <HudR5f {...P} /> })()}</>
}
// V-572 (Strahler-Bug global): Laternen-Pfützen als Kegel-Projektion auf Gelände, Weg und Steine; Stärke und Farbe 1:1 aus dem Practicals-Angebot
// von kfb-gem (Stimmung × Puls × Flackern), tagsüber 0. V-632: über kfb-groundfx (gleiche Kegel-Rechnung wie kfb-light-pool.v1), Kanal 'lanterns' –
// die Plätze teilen sich Laternen, Scheinwerfer (M2Car), später Disco und Boombox. Empfänger werden einmal je Material angeschlossen, Fokus = Kamera.
const _lpDown = new THREE.Vector3(0, -1, 0), LANTERN_CH = gfxChannel('lanterns')
function LightPools() {
  const tick = useRef(0), { camera } = useThree()
  useFrame((_, dt) => {
    tick.current += dt
    if (tick.current > 1) { tick.current = 0; for (const m of [mods.terrain, mods.path, mods.lanterns, mods.orchard, mods.found]) GFX.attach(m?.object3d) }
    GFX.setFocus(camera.position)
    const offers = mods.lanterns?.practicals?.() || []
    if (offers.length || LANTERN_CH.list.length) LANTERN_CH.set(offers.slice(0, 16).map((p) => ({ origin: new THREE.Vector3(p.pos[0], p.pos[1] + 0.35 * K, p.pos[2]), dir: _lpDown, angle: 1.05, soft: 0.75, color: p.color, intensity: p.intensity * 1.4, range: Math.max(2.5 * K, (p.range || 1) * 2.2) })))
  })
  return null
}
const AO = { targets: () => [mods.player, mods.partner, M2STATE.ao].filter(Boolean), groundAt: (x, z) => GROUND_AT.fn?.(x, z) ?? null, strength: 0.42 }

export const M1STATE = { phase: 'free', cooldown: false, dialogs: 0, amphTris: 0, lastDialog: null, lastLog: null }
const resetState = () => { for (const k of Object.keys(mods)) delete mods[k]; Object.assign(M1STATE, { phase: 'free', cooldown: false, dialogs: 0, amphTris: 0, lastDialog: null, lastLog: null }); M1INPUT.override = null; M1CLOCK.onStep = null } // Takt nicht zurücksetzen: M1Loop läuft weiter (Bildzähler), Schritte zählt nur die Physik

// Host: Nebel und Hintergrund (Horizontfarbe der Kuppel), Tonemapping; Licht = Rig des Bühnen-Licht-Moduls (L3)
// Licht-Rig L3 wie #stage: Stimmungs-Satz lset=mesa (Standard) | cozy | r2, Tageszeit tod=day|gold|night|0..1. Schattenbereich = Kugel um das, was der
// Spieler steuert (Auto bzw. FrizzleBob), Radius = halbe Länge + Schattenlänge der Sonnenhöhe × Höhe (+ 1 m Rand) – auch der lange Gold-Schatten liegt
// ganz darin (Georg 17.10.: „zweiter, abgeschnittener Schatten“ bei ±7,8 m festem Ausschnitt). Bias leitet das Modul ab (fitShadow), keine feste Zahl.
// Nacht-Mondschatten (Georg 23.10.: nachts fehlte der Bodenschatten, Figuren wirkten schwebend; abgenommen, Standard): Mond stärker, Himmelsfüllung schwächer (Gesamthelligkeit ähnlich),
// Schattenstärke nach glow bis 1,0 – Mondschatten unter den Figuren lesbar wie bei Gold. Nur Stimmungswerte und Schattenstärke, kein neues Licht.
const NSH_ON = !/(^|[#,])nsh=0(,|$)/.test(hash), /* Georg 23.10.: Standard; nsh=0 = alter Stand */ NSH = Object.freeze({ moonK: 1.7, hemiK: 0.7, shadowNight: 1.0 })
const nshMoods = (S) => (S && NSH_ON ? Object.freeze({ ...S, night: Object.freeze({ ...S.night, sunI: S.night.sunI * NSH.moonK, hemiI: S.night.hemiI * NSH.hemiK }) }) : S)
const LSET = (/lset=(r2|cozy|mesa)/.exec(hash) || [0, 'mesa'])[1], MOOD_SET = nshMoods(MOOD_SETS[LSET]) || undefined, TODV = parseTod(hash)
const fitTarget = () => { const cp = carLive() ? M2STATE.carPos?.() : null; if (cp) return { p: cp, half: M2STATE.carSize?.half ?? 2.6 * K, h: M2STATE.carSize?.h ?? 1.8 * K }
  const p = worldPosOf(mods.player); return p ? { p, half: 0.6 * K, h: 2.79 * K } : null }
const RIG = { moods: MOOD_SET, tod: () => TODV, groundColor: () => BIOME.top, figures: () => (FIGLIGHT_ON && !FIG_LIGHT_TEST.off ? [] : M1STATE.phase === 'dialog' ? [mods.player, mods.partner].filter(Boolean) : TODV <= 0.25 && mods.player ? [mods.player] : []), /* figlight=1: Figurenlicht je Figur übernimmt (figureLights.js); im Prüfmodus off wieder der heutige Spot = A wie heute */ /* Kritiker MVP R1 C4: nachts trägt FB das warme Figurenlicht des Rigs (sonst kaum lesbar) */ figureLight: { distance: 4.6 * K, up: 2.6 * K },
  fit: () => { const t = fitTarget(), M = moodAt(TODV, MOOD_SET); if (!t) return { center: { x: 0, y: 0, z: 0 }, radius: 12 * K }
    // #439 (WS1b-Diagnose): Kasten mind. 16 m, damit Bäume neben der Figur werfen; Sonne um Kronenhöhe ÷ sin(Sonnenhöhe) + Rand zurück (Nah-Ebene schneidet keine Krone)
    const e = Math.max(8, M.elev) * Math.PI / 180; return { center: { x: t.p.x, y: t.p.y, z: t.p.z }, radius: Math.max(t.half + shadowLength(M.elev) * t.h + 1 * K, 16 * K), margin: (14 * K) / Math.sin(e) + 4 * K } },
  shadowSoft: isTerrain3(hash) ? 5 : 7, shadowBlurSamples: 16, shadowIntensity: isTerrain3(hash) ? 0.62 : 0.82 }   // terrain3: leiser und kontaktnäher (Schattenkonzept R1, KayKit)   // VSM: Weichzeichner-Radius (Texel) und Proben des Blur-Durchgangs
if (ENDLESS_ON) adoptRig(RIG) // V-619: Stimmung je Bild aus der Atmosphäre der Biom-Fahrt (lebender moods-Satz), Schatten nach Sonnen-/Mondhöhe
export const LIGHT_INFO = () => mods.light?.info?.() || null
const AUDIO_HOST = (player) => ({ mods, player, harvest: HARVEST ? HARVEST_STATE : null, m1: M1STATE, light: LIGHT_INFO, flatR: TERRAIN.flatR, k: K }) // WS-Audio: nur lesend
// terrain3: dunkler Fuß wie KayKit an Figuren (Schattenkonzept R1, Georg 21.10.), Bodenhöhe = Wurzel der Figur (steht auf dem Boden, m1-ground);
// Materialien jede Sekunde nachgezogen (Teile laden nach), applyFootShade hängt sich nur einmal je Material an
// V-683 (WS0, Georg 22.10.): eine Regel für die Schattenseite aller Nicht-Gelände-Objekte – Boden im Rig-Ton, kein Zusatzlicht. Schalter shade=1 bis zu Georgs Wahl.
// Figurenlicht R1 (docs/FIGURENLICHT_KONZEPT_R1.md): vier schattenlose Lichter für Spieler + drei nächste Figuren, Stärke aus der laufenden Rig-Stimmung
function FigureLights() {
  const { scene, camera } = useThree(), ref = useRef(null)
  useEffect(() => { const A = attachFigureLights(scene, { player: () => mods.player?.object3d || null, partner: () => mods.partner?.object3d || null, mood: () => mods.light?.mood?.() || LIGHT_INFO()?.mood || null, K })
    ref.current = A.lights; expose('FigLight', { test: FIG_LIGHT_TEST, status: A.lights.status }); return () => { ref.current = null; A.detach() } }, [scene])
  useFrame((_, dt) => ref.current?.update(dt, camera))
  return null
}
function ShadeFloor() {
  const { scene } = useThree(), t = useRef(0)
  useEffect(() => { expose('Shade', SHADE_TEST) }, [])
  useFrame((_, dt) => { const m = LIGHT_INFO()?.mood; if (m) updateShadeFloor({ color: m.hemiSky, glow: m.glow ?? 0 }); if ((t.current -= dt) <= 0) { t.current = 1; scanShadeFloor(scene) } })
  return null
}

// nsh=1: Schattenstärke der Sonne bzw. des Mondes folgt glow (Tag Rig-Wert, Nacht NSH.shadowNight); das Rig setzt seinen festen Wert je Bild, hier wird er als Basis gelesen
// Probe Umriss nur außen (outline=1): Stencil-Hülle für Spieler + 5 nächste Figuren
// Schatten-Hebel (Georg 24.10.): Fundsachen und Plakat werfen nur Schatten, wenn sie (mit Schattenreichweite) das Bild berühren
function ShadowCullHost() {
  const { camera } = useThree(), ref = useRef(null)
  useEffect(() => { const C = createShadowCull({ camera, reach: 6 * K, roots: () => [mods.found?.object3d, mods.billboard?.object3d] }); ref.current = C; expose('ShadowCull', C); return () => { ref.current = null } }, [camera])
  useFrame((_, dt) => ref.current?.update(dt))
  return null
}
function FigureOutline() {
  const { scene, gl } = useThree(), ref = useRef(null)
  useEffect(() => { const F = createFigureOutline({ scene, player: () => mods.player?.object3d || null }); ref.current = F; expose('Outline', { test: OUTLINE_TEST, status: F.status }); return () => { ref.current = null } }, [scene])
  useFrame((_, dt) => ref.current?.update(dt, gl))
  return null
}
function NightShadow() {
  useFrame(() => { const sh = mods.light?.lights?.sun?.shadow; if (!sh) return
    if (!sh.userData) sh.userData = {}
    if (!sh.userData.nsh) { let base = sh.intensity; Object.defineProperty(sh, 'intensity', { configurable: true, get: () => { const g = Math.min(1, Math.max(0, mods.light?.mood?.()?.glow ?? 0)); return base + (NSH.shadowNight - base) * g }, set: (v) => { base = v } }); sh.userData.nsh = true } })
  return null
}
function FootShade() {
  useEffect(() => { if (FIGAMB_ON) expose('FigAmb', Object.assign(FIG_AMB_TEST, { refresh: () => updateFigureAmbient(mods.light?.mood?.() || LIGHT_INFO()?.mood) })) }, []) // refresh: Prüfhilfe bei angehaltener Uhr
  const U = useMemo(() => Object.fromEntries(['player', 'partner'].map((k) => [k, { uFootY: { value: 0 }, uFootH: { value: 0.35 * K }, uFootK: { value: 0.2 } }])), [])
  const t = useRef(0), v = useMemo(() => new THREE.Vector3(), []), FS = useMemo(() => ({ uFigShadowK: { value: 0.55 } }), [])   // Selbstschatten auf Figuren gedämpft (Arm-Kante, Georg 21.10.)
  useFrame((_, dt) => { const scan = (t.current -= dt) <= 0; if (scan) t.current = 1
    const list = [['player', mods.player?.object3d], ['partner', mods.partner?.object3d], ...[...(mods.npc?.holders?.() || []), ...(mods.groups?.holders?.() || []), ...(mods.band?.holders?.() || [])].map((h) => [h.name, h])]   // WS-NPC: Bewohner wie Spieler und Partnerin
    for (const [k, o] of list) { if (!o) continue; const u = (U[k] ||= { uFootY: { value: 0 }, uFootH: { value: 0.35 * K }, uFootK: { value: 0.2 } })
      if (scan) o.traverse((m) => { if (m.isMesh && m.visible) for (const mt of [].concat(m.material)) if (mt && !mt.isShaderMaterial && !mt.isMeshBasicMaterial) { applyFootShade(mt, u); applyFigureShadow(mt, FS); if (FIGAMB_ON) applyFigureAmbient(mt) } })
      o.getWorldPosition(v); u.uFootY.value = v.y }
    if (FIGAMB_ON) updateFigureAmbient(mods.light?.mood?.() || LIGHT_INFO()?.mood) })
  return null
}
function HostEnv() {
  const { scene, gl } = useThree()
  useEffect(() => applyTone(gl, 'aces', 1), [gl]) // ein Tonemapping für alle Schichten (L3 Regel 5)
  // VSM nur in der Laufwelt (Georg 20.10.: Schatten weich ohne Stufen und Körnung): Karte einmal je Bild weichgezeichnet, je Pixel eine Abfrage; Bühne/Prüfungen bleiben PCF
  useEffect(() => { const prev = gl.shadowMap.type; gl.shadowMap.type = SHADOW_VSM ? THREE.VSMShadowMap : THREE.PCFShadowMap; gl.shadowMap.needsUpdate = true; return () => { gl.shadowMap.type = prev; gl.shadowMap.needsUpdate = true } }, [gl])
  // MVP-Startseite (V-618): einmal 'kfb:ready', sobald Spielfigur und Gelände stehen (Vorhang darf aufgehen); kein Debug-Zugang nötig
  useEffect(() => { let done = false; const iv = setInterval(() => { if (done || mods.player?.status?.().status !== 'OK' || !mods.terrain) return; done = true; clearInterval(iv); window.dispatchEvent(new Event('kfb:ready')) }, 250); return () => clearInterval(iv) }, [])
  useEffect(() => { M1GL.gl = gl; M1GL.scene = scene }, [gl, scene]) // Prüfungen/Bildskripte (nur debug über M1.renderer)
  const cff = useRef(0)
  useFrame((_, dt) => { if ((cff.current -= dt) <= 0) { cff.current = 1; castFrontFaces(scene) } }) // Licht v1.1 (V-440): Vorderseiten werfen Schatten, nachgeladene Teile jede Sekunde
  useEffect(() => {
    const c = mods.sky?.horizonColor?.() || new THREE.Color('#bcd7ea')
    scene.background = c.clone(); scene.fog = new THREE.Fog(c.clone(), 140 * K, 620 * K)
    return () => { scene.fog = null; scene.background = null }
  }, [scene])
  // WS1c (V-631): Nebel unter Wasser – Wasserton im Licht des Rigs (terrain.under().color), nah und dicht, weich über under().k; darüber unverändert
  const fogW = useRef(null)
  useFrame(() => { const f = scene.fog, u = mods.terrain?.under?.(); if (!f?.isFog) return; if (!fogW.current) fogW.current = { c: f.color.clone(), near: f.near, far: f.far, on: false }
    const F = fogW.current, k = u ? u.k : 0; if (k < 0.002) { if (F.on) { f.color.copy(F.c); f.near = F.near; f.far = F.far; F.on = false } return }
    if (!F.on) { F.c.copy(f.color); F.near = f.near; F.far = f.far; F.on = true }
    f.color.copy(F.c).lerp(u.color, k); f.near = F.near + (0.5 - F.near) * k; f.far = F.far + (14 + 10 / (1 + u.depth) - F.far) * k })
  return <ModuleHost create={makeRig} options={RIG} />
}

// Physik-Schritt: genau einer je Durchlauf, als ERSTER Bild-Handler in der Physik (vor Figur und ecctrl). Zuschlag 1e-9: Rapiers Akkumulator
// (Gleitkomma) ließe sonst gelegentlich einen Schritt aus und machte im nächsten Durchlauf zwei.
// Boden unter (x, z) für die Kontaktverdeckung: Strahl von oben auf alle Kollider außer Zaun und Auto, sonst das Gelände; Normale wie getroffen
function GroundProbe() {
  const { world, rapier } = useRapier(), ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])
  useEffect(() => { GROUND_AT.fn = (x, z) => { const ty = mods.terrain?.height(x, z) ?? GROUND_Y, from = ty + 40 * K; ray.origin.x = x; ray.origin.y = from; ray.origin.z = z
    const h = world.castRayAndGetNormal(ray, 80 * K, true, undefined, undefined, undefined, undefined, (c) => !!c.parent()?.isFixed?.() && !c.parent()?.userData?.m2Car && !c.parent()?.userData?.tag)   // #439: nur feste Körper – nie die eigene Spielerkapsel (Fleck saß auf 1,23 m)
    if (h && from - h.timeOfImpact > ty + 0.01 * K && h.normal.y > 0.5) return { y: from - h.timeOfImpact, normal: [h.normal.x, h.normal.y, h.normal.z] }
    const e = 0.4 * K, H = (a, b) => mods.terrain?.height(a, b) ?? ty; return { y: ty, normal: [H(x - e, z) - H(x + e, z), 2 * e, H(x, z - e) - H(x, z + e)] } }
    return () => { GROUND_AT.fn = null } }, [world, ray])
  return null
}

function Stepper() {
  const { step } = useRapier()
  useFrame(() => { M1CLOCK.steps++; step(STEP + 1e-9) })
  return null
}

// Schatten (Georg 22.10.: „pcf nehmen“): PCF zeichnet nur Werfer ins Schattenbild – VSM zeichnete alle Empfänger mit (Gelände ≈ 180 k, gesamt −256 k Dreiecke/Bild).
// shadow=vsm (debug) = der alte weiche Schatten zum Vergleich
const SHADOW_VSM = DEBUG && /(^|[#,])shadow=vsm(,|$)/.test(hash)
const NOFENCE = DEBUG && /(^|[#,])nofence(,|$)/.test(hash)
// Reibung am Zaun: ecctrl-Kapsel hat −0,5; mit „Average“ ergäbe das −0,25 (negative Reibung hebt die Figur an der Wand, Prüfer M1-5 Befund N3) →
// „Max“ mit 0 = reibungsfrei gleiten
const FENCE = rankFence() // Ränge = Kulisse (V-283): Zaun nur für die Physik, unsichtbar, Strahlen schauen vorbei (isFence)
const RAMP = rampVerts() // unsichtbare Rampe zur Bühne (V-331): Strahlen sehen sie (man läuft darauf)
function Colliders({ ready }) {
  const terr = useMemo(() => mods.terrain?.colliderData(), [])
  const amph = useMemo(() => (ready ? trimeshOf(amphModelOf(mods.amph)) : null), [ready])
  useEffect(() => { if (amph) M1STATE.amphTris = amph.indices.length / 3 }, [amph])
  // Billboard und Partnerin sind fest (Prüfer M1-5, Befund N13: man lief durch sie hindurch): Billboard = Quader aus seiner Weltbox, sobald die Karte
  // steht; GothGirl = Zylinder auf der rechten Marke (r 0,35 m, 2 m hoch). Strahlen sehen beide (Kamera weicht aus wie bei Theaterwänden).
  const [bb, setBb] = useState(null)
  useEffect(() => { let alive = true; const t = setInterval(() => { const b = mods.billboard; if (!alive || !b?.object3d || !['CARD', 'PLACEHOLDER'].includes(b.info?.()?.source)) return
    const box = new THREE.Box3().setFromObject(b.object3d); if (box.isEmpty()) return
    setBb({ c: box.getCenter(new THREE.Vector3()).toArray(), h: box.getSize(new THREE.Vector3()).multiplyScalar(0.5).toArray() }); clearInterval(t) }, 200); return () => { alive = false; clearInterval(t) } }, [])
  return (
    <>
      {terr && <RigidBody type="fixed" colliders={false} name="m1-terrain"><TrimeshCollider args={[terr.vertices, terr.indices]} /></RigidBody>}
      {amph && <RigidBody type="fixed" colliders={false} name="m1-amph" userData={{ obstacle: true }}><TrimeshCollider args={[amph.vertices, amph.indices]} /></RigidBody>}
      {bb && <RigidBody type="fixed" colliders={false} name="m1-billboard" userData={{ obstacle: true }} position={bb.c}><CuboidCollider args={bb.h} /></RigidBody>}
      <RigidBody type="fixed" colliders={false} name="m1-ramp"><ConvexHullCollider args={[RAMP]} /></RigidBody>
      <RigidBody type="fixed" colliders={false} name="m1-partner" userData={{ soft: true }} position={[MARK.right[0], 1 * K, MARK.right[1]]}><CylinderCollider args={[1 * K, 0.35 * K]} /></RigidBody>
      {!NOFENCE && <RigidBody type="fixed" colliders={false} name={FENCE_TAG} userData={{ tag: FENCE_TAG, ecctrl: { excludeRay: true } }}>{FENCE.map((c, i) => <ConvexHullCollider key={i} args={[c.verts]} friction={0} frictionCombineRule={CoefficientCombineRule.Max} />)}</RigidBody>}
    </>
  )
}

// WS-NPC: Bewohner sind fest für den Spieler (wie die Partnerin, Prüfer M1-5 N13): je Bewohner eine kinematische Kapsel, Lage aus dem Modul je Schritt
const RESIDENT_IDS = NPC_WORLD.residents.map((r) => r.residentId)
function NpcBodies({ source = 'npc', list = RESIDENT_IDS }) {
  const refs = useRef([])
  useFrame(() => { const ps = mods[source]?.positions?.() || []; ps.forEach((p, i) => refs.current[i]?.setNextKinematicTranslation({ x: p.x, y: p.y + 0.9 * K, z: p.z })) })
  return list.map((id, i) => <RigidBody key={id} ref={(b) => { refs.current[i] = b }} type="kinematicPosition" colliders={false} name={'npc-' + id} userData={{ soft: true, npc: id }}><CapsuleCollider args={[0.55 * K, 0.35 * K]} /></RigidBody>)
}

// Wurzel mit Abbau-Schalter für den Vertragstest (nur mit Debug): window.__kfbM1Root.off() hängt die ganze Szene aus. Die Schleife bleibt.
export default function M1Root() {
  const [on, setOn] = useState(true)
  useEffect(() => { expose('M1Root', { off: () => setOn(false), on: () => setOn(true) }) }, [])
  return <>{on ? <M1World /> : null}<M1Loop /></>
}

// travel=1: führt die Aufträge der Zustandsmaschine aus – Wagen neben der Figur ein- und aushängen, Figur einfrieren und verbergen, Kamera abgeben.
// Figur im Dach (J-7) und Entstehen/Einsaugen (kfb-fluff-suck build/suck) kommen erst nach Georgs Bild-Abnahme; bis dahin Platzhalter.
const CAR_STATES = ['drive', 'flyRacer', 'exit']
function TravelHost({ player }) {
  const [at, setAt] = useState(null)
  const travel = useMemo(() => at && { at, state: () => TRAVEL_SM.state, progress: () => TRAVEL_SM.progress(), drives: () => TRAVEL_SM.state === 'drive' || TRAVEL_SM.state === 'flyRacer', camOnCar: () => CAR_STATES.includes(TRAVEL_SM.state) }, [at])
  const side = (yaw, d) => [Math.cos(yaw) * d, -Math.sin(yaw) * d]
  const gh = (x, z) => (mods.terrain?.surfaceAt || terrainHeight)(x, z)   // Oberfläche wie Pfad/NPC (world=probe: Probe-Gelände)
  const apply = (fx) => { const P = player.current, fig = mods.player?.object3d
    for (const e of fx) {
      if (e.type === 'car' && e.on) { const p = worldPosOf(mods.player); if (!p || !fig) continue; const q = fig.getWorldQuaternion(new THREE.Quaternion()), yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y, [dx, dz] = side(yaw, 3.5 * K)
        TRAVEL.car = true; setAt({ p: [p.x + dx, gh(p.x + dx, p.z + dz) + 1.2 * K, p.z + dz], yaw }) }
      if (e.type === 'car' && !e.on) { TRAVEL.car = false; setAt(null) }
      if (e.type === 'player') P?.freeze(e.freeze)
      if (e.type === 'camera' && e.to === 'car') { P?.yieldCamera(true); if (fig) fig.visible = false }
      if (e.type === 'camera' && e.to === 'player') { const cp = M2STATE.carPos?.(); if (cp) { const yaw = M2STATE.carYaw?.() ?? 0, [dx, dz] = side(yaw, -2.6 * K); P?.teleport([cp.x + dx, gh(cp.x + dx, cp.z + dz) + FOOT + 0.3 * K, cp.z + dz], yaw) /* teleport setzt die Kapselmitte (wie START) */ }
        if (fig) fig.visible = true; P?.yieldCamera(false) }
    } }
  useFrame((_, dt) => { const fl = !!player.current?.flying?.(), st = TRAVEL_SM.state
    if (fl && st === 'foot') TRAVEL_FX.push(...TRAVEL_SM.send('flyStart')); else if (!fl && st === 'flyFigure') TRAVEL_FX.push(...TRAVEL_SM.send('flyEnd'))
    TRAVEL_FX.push(...TRAVEL_SM.update(dt)); if (TRAVEL_FX.length) apply(TRAVEL_FX.splice(0)) })
  useEffect(() => { expose('Travel', { sm: TRAVEL_SM, click: travelClick, car: () => TRAVEL.car }); return () => { TRAVEL.car = false; if (mods.player?.object3d) mods.player.object3d.visible = true } }, [])
  return travel ? <M2Car player={player} travel={travel} /> : null
}

function M1World() {
  const player = useRef(null)
  PLAYER_CTRL.ref = player // Kampf R1: Blickrichtung zum Ziel über M1Player.face (Ref bleibt stabil)
  const orbit = useRef(null) // Griff der Bühnenkamera (StageOrbitCam): setActive(on) synchron, target()
  const fovBlend = useRef({ on: false, from: 55, to: 55, t: 0 })
  const [amphReady, setAmphReady] = useState(false)
  const [phase, setPhase] = useState('free') // free | dialog
  const [session, setSession] = useState(0)
  const camera = useThree((s) => s.camera)
  const onPlayer = useCallback((m) => { mods.player = m }, [])
  const keysUi = useRef(null)

  useEffect(() => { useGame.setState({ dialog: null, choice: null }); return resetState }, []) // Spike-Startdialog gehört nicht in M1; Abbau leert den Szenen-Zustand
  useEffect(() => { let alive = true; const t = setInterval(() => { if (mods.amph?.status().status === 'OK' && alive) { setAmphReady(true); clearInterval(t) } }, 100); return () => { alive = false; clearInterval(t) } }, [])
  useEffect(() => useGame.subscribe((s, p) => { if (s.lastChoice && s.lastChoice !== p.lastChoice) mods.dialog?.onChoice(s.lastChoice) }), [])
  useEffect(() => { keysUi.current = keyList(); return () => keysUi.current.remove() }, [])
  useEffect(() => { camera.fov = M1CAM.fov; camera.updateProjectionMatrix() }, [camera])

  const endDialog = useCallback(() => {
    if (M1STATE.phase !== 'dialog') return
    M1STATE.lastDialog = mods.dialog?.state?.() ?? null; M1STATE.lastLog = mods.dialog?.log?.() ?? null
    mods.dialog = null // nicht auf den entsorgten Dialog schauen (Prüfer M1, Befund 8)
    useGame.getState().closeChoice()
    M1STATE.phase = 'free'; M1STATE.cooldown = true; queueMicrotask(() => setPhase('free'))
    player.current?.freeze(false)
    // Kamera zurück an die Folgekamera ohne Sprung (Prüfer M1-5, N1/N2): im selben Schritt die Bühnenkamera aus (synchron über ihren Griff) und
    // camera-controls exakt auf ihren letzten Stand setzen (Lage UND Orbit-Ziel), dann weich hinter die Figur; Bildfeld 38° → 55° überblenden
    const orbitTarget = orbit.current?.target?.() ?? null
    orbit.current?.setActive?.(false)
    player.current?.yieldCamera(false)
    const cc = player.current?.camera(), p = worldPosOf(mods.player), c = camera.position, t = orbitTarget || new THREE.Vector3(p?.x ?? 0, (p?.y ?? 0) + 1.3 * K, p?.z ?? 0)
    if (cc && p) { cc.setLookAt(c.x, c.y, c.z, t.x, t.y, t.z, false); cc.setLookAt(p.x, p.y + 3.2 * K, p.z + 7.5 * K, p.x, p.y + 1.3 * K, p.z, true) }
    Object.assign(fovBlend.current, { on: true, from: camera.fov, to: M1CAM.fov, t: 0 })
  }, [camera])
  const startDialog = useCallback(() => {
    if (M1STATE.phase !== 'free' || !player.current) return
    M1STATE.phase = 'dialog'; M1STATE.dialogs++; mods.dialog = null; queueMicrotask(() => { setPhase('dialog'); setSession((n) => n + 1) })
    player.current.freeze(true)
    player.current.teleport([MARK.left[0], FOOT + 0.02 * K, MARK.left[1]], MARK.left[2])
    // V-257: dieselbe Bühnenkamera wie #stage (StageOrbitCam: drehen, Zoom zum Cursor, verschieben, Fokus per Doppelklick, Sprungmarken
    // Standard/Nah), Startblick STAGE_CAMS.near mit 38°; sie gleitet von der Folgekamera dorthin. Die Folgekamera pausiert solange.
    fovBlend.current.on = false
    player.current.yieldCamera(true)
    orbit.current?.setActive?.(true) // synchron im selben Schritt (N2); die Bühnenkamera blendet das Bildfeld selbst auf 38° über
  }, [camera])

  // Escape beendet den Dialog (Rang dialog über dem Spieler); H blendet die Tastenliste um (ohne Tastenwiederholung)
  useHostKeys((e) => {
    if (M1STATE.phase === 'dialog' && e.code === ACTION_KEYS.close && !useGame.getState().choice) { endDialog(); e.preventDefault() }
    if (e.code === 'KeyH' && !e.repeat && !useGame.getState().choice) { keysUi.current?.toggle(); e.preventDefault() }
  }, PRIO.dialog)

  // Bildfeld nach dem Dialog weich zurück (38° → 55°, Dauer und Verlauf wie das Gleiten der Bühnenkamera)
  useFrame((_, dt) => { const f = fovBlend.current; if (!f.on) return
    f.t = Math.min(ORBIT.glideS, f.t + Math.min(dt, 0.1)); const u = f.t / ORBIT.glideS, k = u * u * (3 - 2 * u)
    camera.fov = f.from + (f.to - f.from) * k; camera.updateProjectionMatrix(); if (u >= 1) f.on = false })
  // Bühne betreten (am Boden) → Dialog; nach dem letzten Beat zurück; erneut erst nach Verlassen der Bühne
  useFrame(() => {
    const p = worldPosOf(mods.player); if (!p) return
    const r = Math.hypot(p.x, p.z), h = player.current?.handle()
    if (M1STATE.phase === 'free') {
      if (M1STATE.cooldown && r > STAGE_TRIGGER.leaveR) M1STATE.cooldown = false
      if (!M1STATE.cooldown && r < STAGE_TRIGGER.r && Math.abs(p.y) < STAGE_TRIGGER.maxDy && !player.current?.flying() && h?.isOnGround && !h?.jumpActive) startDialog()
    } else if (M1STATE.phase === 'dialog' && mods.dialog?.state?.().phase === 'DONE') endDialog()
  })

  const dialogOpts = useMemo(() => ({
    cards: DECK,
    get reader() { return getReader() },
    billboard: { setCard: (c) => mods.billboard.setCard(c) },
    actors: { get left() { return mods.player }, get right() { return mods.partner } },
    say: (anchor, line) => useGame.getState().say(anchor, line),
    openChoice: () => { useGame.getState().openChoice(); return useGame.getState().choice?.id ?? null },
    closeChoice: () => useGame.getState().closeChoice(),
    isReady: () => isPoolReady() && mods.amph?.status().status === 'OK' && ['CARD', 'PLACEHOLDER'].includes(mods.billboard?.info()?.source) && mods.player?.status().status === 'OK' && mods.partner?.status().status === 'OK' && mods.partner?.status().shown !== false, // wie Stage.jsx isReady (beide Darsteller-Arten melden shown; false = noch unsichtbar)
    _session: session,
  }), [session])
  const makeDialog = useCallback((o) => trackDialog(createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), ssotLine: (...a) => o.reader.ssotLine(...a), silence: () => o.reader.silence() } }), mods), [])

  useEffect(() => {
    if (!DEBUG) return
    expose('M1', {
      mods, state: M1STATE, clock: M1CLOCK, camera3: () => camera, elan: () => ELAN_MEM, elanRun: () => ELAN_RUN.run, input: (o) => { M1INPUT.override = o }, mouse: (m) => { M1INPUT.mouse = m }, player: () => player.current,
      status: () => ({ phase: M1STATE.phase, amphReady, amphTris: M1STATE.amphTris, player: mods.player?.status(), partner: mods.partner?.status().status, terrain: mods.terrain?.info(), sky: mods.sky?.info(),
        pos: worldPosOf(mods.player)?.toArray(), dialog: mods.dialog?.state?.() ?? null, lastDialog: M1STATE.lastDialog, camera: camera.position.toArray(), cameraDir: camera.getWorldDirection(new THREE.Vector3()).toArray(), fov: camera.fov,
        ready: { pool: isPoolReady(), card: mods.billboard?.info()?.source ?? null, player: mods.player?.status().status, partner: mods.partner?.status().status, partnerShown: mods.partner?.status().shown },
        keysShown: keysUi.current?.shown?.() ?? null }),
      harvest: () => HARVEST_STATE, // C3/C3b: Ernte-Stand, HUD-api, Zähler (nur debug)
      combat: () => mods.combat ? { status: mods.combat.status(), debug: mods.combat.debug(), events: mods.combat.events(), active: mods.combat.active(), weapons: mods.combat.weapons() } : null, // Kampf R1 (nur debug)
      groups: () => mods.groups ? { status: mods.groups.status(), debug: mods.groups.debug(), tables: mods.groups.tables(), played: mods.groups.played(), events: mods.groups.events(), steps: mods.groups.steps(), time: mods.groups.time() } : null,
      band: () => mods.band ? { status: mods.band.status(), debug: mods.band.debug() } : null, // WS-NPC Phase D (nur debug) // WS-NPC Phase D (nur debug)
      disco: () => mods.disco ? { status: mods.disco.status(), debug: mods.disco.debug() } : null, // Lead: Disco K12 (nur debug)
      discoFeet: () => mods.disco?.feet?.() ?? null,
      discoActors: () => mods.disco?.actors?.() ?? [],
      discoHold: (on) => mods.disco?.hold?.(on),
      gift: () => mods.gift ? { status: mods.gift.status(), debug: mods.gift.debug(), events: mods.gift.events(), spawn: (x, z, yawDeg) => mods.gift.spawnAt(x, z, yawDeg) } : null, // WS-NPC E3 (nur debug) // WS-NPC Phase D (nur debug)
      fluffer: () => mods.fluffer ? { status: mods.fluffer.status(), debug: mods.fluffer.debug(), mouth: mods.fluffer.mouthWorld(), hops: mods.fluffer.hops(), events: mods.fluffer.events() } : null, // WS-NPC Phase C (nur debug)
      npc: () => mods.npc ? { status: mods.npc.status(), debug: mods.npc.debug(), encounter: mods.npc.encounter(), played: mods.npc.played(), steps: mods.npc.steps(), events: mods.npc.events(), time: mods.npc.time(), memory: mods.npc.memory() } : null, // WS-NPC (nur debug)
      renderer: () => M1GL.gl, scene: () => M1GL.scene, three: () => THREE, // Bildskripte: eigene Kamera rendern (nur debug)
      feet: () => worldPosOf(mods.player)?.toArray(), fence: { on: !NOFENCE }, startDialog, endDialog, move: M1MOVE, bounds: M1BOUNDS, start: START, k: K, g: G, terrainH: (x, z) => mods.terrain?.height(x, z), trigger: STAGE_TRIGGER,
      logs: () => ({ sky: { ...skyLog }, terrain: { ...terrainLog }, amph: { ...amphLog }, billboard: { create: billboardLog.create, update: billboardLog.update, dispose: billboardLog.dispose }, loco: { ...locoActorLog },
        face: { create: faceActorLog.create, update: faceActorLog.update, dispose: faceActorLog.dispose, lastCtx: faceActorLog.lastCtx },
        eye: { create: eyeActorLog.create, update: eyeActorLog.update, dispose: eyeActorLog.dispose, lastCtx: eyeActorLog.lastCtx }, three: THREE.REVISION }), // eye = KayKit-Partner (V-269)
    })
  }, [amphReady, camera, startDialog, endDialog])

  return (
    <>
      <HostEnv />
      {TERRAIN3 && <FootShade />}
      {NSH_ON && <NightShadow />}
      {OUTLINE_ON && <FigureOutline />}
      {SHADOW_CULL_ON && <ShadowCullHost />}
      {SHADE_ON && <ShadeFloor />}
      {FIGLIGHT_ON && <FigureLights />}
      <LightPools />
      <ModuleHost create={makeSky} options={SKY} />
      <ModuleHost create={makeTerrain} options={TERR} />
      <ModuleHost create={makeAmph} options={AMPH} />
      {GROUND_ON && <ModuleHost create={makeGround} options={GROUND_OPTS} />}
      <ModuleHost create={makeBB} options={BB} />
      <ModuleHost create={makePartner} options={PARTNER} />
      {/* createContactAO entfernt (WS0 V-587 zu §116: kein Blob-Schatten, V-564); Erdung über dunklen Fuß (terrain3) und echten Schatten */}
      {NPC_ON && <ModuleHost create={makeNpc} options={NPC_OPTS} />}
      {FLUFFER_ON && HARVEST && <ModuleHost create={makeFluffer} options={FLUFFER_OPTS} />}
      {PATROL_ON && <ModuleHost create={makeGroups} options={GROUP_OPTS} />}
      {BAND_ON && BAND_OPTS && <ModuleHost create={makeBand} options={BAND_OPTS} />}
      {DISCO_ON && <ModuleHost create={makeDisco} options={DISCO_OPTS} />}
      {CHAT_SYL && <ModuleHost create={makeTalk} options={TALK_OPTS} />}
      {GIFT_ON && GIFT_OPTS && <ModuleHost create={makeGift} options={GIFT_OPTS} />}
      {HARVEST && <Orchard />}
      {CLAY_ON && <ModuleHost create={makeClay} options={CLAY_M1} />}
      <Suspense fallback={null}>{/* Rapier lädt asynchron: eigene Grenze, damit die Hüllen davor nicht verworfen und doppelt erzeugt werden (Prüfer M1, Befund 3) */}
      <Physics gravity={[0, -G, 0]} timeStep={1 / 60} paused>
        <Stepper />
        <GroundProbe />
        <Colliders ready={amphReady} />
        {NPC_ON && <NpcBodies />}
        {PATROL_ON && <NpcBodies source="groups" list={GROUP_IDS} />}
        {BAND_ON && BAND_OPTS && <NpcBodies source="band" list={BAND_IDS} />}
        <M1Player ref={player} actorOptions={PLAYER_ACTOR} clipUrls={CLIP_URLS} onMod={onPlayer} />
        {M2_ON && <M2Car player={player} />}
        {TRAVEL_SM && <TravelHost player={player} />}
        {M2_ON && <StuntField />}
        {ENDLESS_ON && <EndlessDrive mods={mods} />}
        {!M2_ON && <ElanRings groundAt={groundHeight} J={K / WORLD_K} playerPos={() => worldPosOf(mods.player)} playerObj={() => mods.player?.object3d} />}
        {RACER_FLY && <ElanRings groundAt={groundHeight} J={K / WORLD_K} scale={RACER_COURSE_SCALE} bestKey="kfb.elan.s2.racer.best" playerPos={() => M2STATE.carPos?.() ?? null} playerObj={() => M2STATE.visualRoot} />}
      </Physics>
      </Suspense>
      <StageOrbitCam ref={orbit} view={STAGE_VIEW} active={phase === 'dialog'} />
      {phase === 'dialog' && <ModuleHost key={session} create={makeDialog} options={dialogOpts} />}
      <BubbleHost />
      <AudioHost host={AUDIO_HOST(player)} />
      <ChoiceHost />
    </>
  )
}
export { TERRAIN }
