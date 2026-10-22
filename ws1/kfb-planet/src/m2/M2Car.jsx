// M2 · G0 Fahren übers Gelände (V-313), zweite Fahrprobe: echtes Fahrzeug 02 Flammen-Dragster v3 (V-315/V-321, Asset-Branch @9bd8e037,
// crimson_flame_dragster.kfb-vehicle.v3.json). Zwei Kandidaten im Vergleich, Taste C wechselt an Ort und Stelle, die aktive Fahrphysik steht groß
// oben mittig (Georg 16.10.).
//   A · ecctrl = EcctrlVehicle (ecctrl 2.0.2, Rapier-Starrkörper). Der Dragster ist ein Schwebe-Fahrzeug („locomotion: hover“, keine Räder): vier
//               unsichtbare ShapeCastWheels an den Schwebepunkten kfb_hover_* (WS0-Vorschlag), Fahrhöhe als Laufzeitwert. Feste Masse mit tiefem
//               Schwerpunkt (sonst kippte der Kasten schon bei 17 m/s), Lenkwinkel mit dem Tempo kleiner (wie k2b), ohne Gas sanft ausrollen.
//   B · k2b    = J17-Fahrphysik k2b frei auf dem Gelände (k2t.js), kinematisch, mit Hangabtrieb; Hang ist keine Wand mehr.
// Maßstab: GLB in KayKit-Rig-Einheiten wie die Figuren; Welt = Rig × FB-Bühnenmaß × K (V-345: FB 1,81 m, J17-Meter). Fahrzeug ≈ 4,97 m lang.
// Tasten (Folgetasten des Hosts): W/S Gas/rückwärts, A/D lenken, Q/E driften (B, V-347), Leertaste = Handbremse (A) bzw. Sprung (B), R = zurück an den
// Start, C = wechseln. ecctrl ist seit V-367 eingefroren (Vergleich in der Vorschau, keine neue Arbeit).
import * as THREE from 'three'
import { useCallback, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EcctrlVehicle, ShapeCastWheel } from 'ecctrl/vehicle'
import { useHostKeys } from '../hostKeys'
import { expose, DEBUG, DEVUI, onDevUi } from '../debug'
import { M1INPUT, ELAN_MEM } from '../m1/M1Player'
import { isFence, inRankFence } from '../m1/m1Host'
import { STEP, interpTrack, M1INTERP, M1CLOCK } from '../m1/m1Clock'
import { createFollowCam } from '../camera/followCam'
import { VEHICLE_COMMIT } from '../modules/vehicleLineup'
import fbRecipe from '../data/actors/frizzlebob-v5b.recipe.json'
import { createK2t, stepK2t, SQUASH_LOOK, attitude, ATT, LAND, STUCK, ASSIST_M3, PUSH, RIDE, TRICK, FLOW, FEEL, ASSIST } from './k2t'
import { attachTumble } from '../vendor/deformer/vehicle-tumble.v1.js'
import { attachFishtail } from '../vendor/deformer/vehicle-fishtail.v1.js'
import { rampZone } from '../m3/stuntData.js'
import { createDeformer } from '../vendor/deformer/vehicle-cartoon-deformer.v2.js'
import DEFORM_PROFILES from '../vendor/deformer/deformer-profiles.json'
import VEHICLE_RIG from '../data/vehicles/kfb-vehicle-rig.r1.json'
import { mountRacerRig, mountHeadlights, releaseModel, terrainDustColor } from './racerRig'
import { createEngineAudio } from '../audio/engineAudio'
import { prepVehicleLook, hookVehicleLook, applyHeroColor, heroEnabled, setHeroMaps, slicer, warmVehicleEnv, prepVehicleClay } from '../look/vehicleLook.js'
import { applyClay } from '../vendor/clay/kfb-clay.v1.1.js'
import { TERRAIN3_CFG } from '../look/terrain3.js'
import { FB_RIG_HEIGHT } from '../worldScale.js'
import { headlightDaylight, HEADLIGHTS } from '../look/headlights.js'
import { gfxChannel } from '../look/groundFx.js'
import { parseTod, moodAt, MOOD_SETS } from '../vendor/light/kfb-stage-light.v1.1.js'
import { groundHeight, waterActive } from '../modules/m1-terrain' // #439 world=probe: Höhe der aktiven Welt · WS1c: Wasserspiegel
import { createWaterDrive, waterGround, waterAfter, waterCamClamp } from './waterDrive.js' // WS1c (V-631): Fahren im/unter/über Wasser
import { createWaterFx } from '../modules/waterFx.js'
import ModuleHost from '../ModuleHost'
import { K, G } from '../m1/m1Scale.js'
import { WORLD_K } from '../worldScale.js'
import { createRacerFlight, racerFlightStep, racerAfterK2t, racerDrive } from './racerFlight.js'

// ── Fahrzeug (aus <racer>.kfb-vehicle.v3.json über kfb-vehicle-rig.r1.json, Rig-Einheiten × S) ─────────────────────────────────────────────────────────────────
const S = (fbRecipe.stage?.scale ?? 0.947) * K // V-345: Rig × 0,947 × K = Rig × M_PER_RIG (J17-Meter, wie FB)
const R = (a) => a.map((v) => +(v * S).toFixed(4))
// Fahrzeug-Rigging R1a (V-481): Racer-Wahl #m1,car,racer=<id>; ohne Angabe der Flammen-Dragster wie bisher. V-631: alle 14 Dieselpunk-Racer
// (kfb-vehicle-rig.r1.json: Maße, Schwebe- bzw. Radpunkte, Kamera, Düsen- und Scheinwerfer-Anker, Antriebsfarben, Klasse). Wechsel im Spiel mit V / Umschalt+V
// oder Ereignis 'kfb:racer' (Startseite): applyRacer() schreibt M2CAR/RACER und die abgeleiteten Werte neu, dann setzt das Auto an Ort und Stelle neu auf.
// Fahrphysik je Klasse aus den vorhandenen Werten (kein Neubau): K2B für alle gleich (V-251, Georg 18.10.); Klasse wählt nur das Verformungsprofil
// (racer CAR_CHILL_LIGHT, hauler SPACE_HAULER aus deformer-profiles.json) und bei Rad-Fahrzeugen (wheels) sitzt die Darstellung um die Fahrhöhe tiefer.
const H = typeof location !== 'undefined' ? location.hash : ''
export const RACER_IDS = Object.keys(VEHICLE_RIG.vehicles).sort((a, b) => VEHICLE_RIG.vehicles[a].name_de.localeCompare(VEHICLE_RIG.vehicles[b].name_de, 'de', { numeric: true }))
const RACER_ID0 = (() => { const m = /(^|[#,])racer=(\w+)/.exec(H); return m && VEHICLE_RIG.vehicles[m[2]] ? m[2] : 'crimson_flame_dragster' })()
export let RACER = null
export const M2CAR = { spawn: [8 * K, 3 * K, 34 * K], yaw: Math.PI / 2 }
export const DEFORM = { profile: DEFORM_PROFILES.profiles.CAR_CHILL_LIGHT, last: null }
// Zwei-Rad an der Wand (Stufe F, lab-v7 vehicle-twowheel.v1.js deriveTwoWheel): Umfallwinkel = atan(halbe Breite / Schwerpunkthöhe der Hülle),
// Haltewinkel wallride = Umfall + (90° − Umfall) × 0,45. Drehpunkt = Aufstandslinie auf der wandfernen Seite: die wandseitigen Räder heben ab, die
// Unterseite zeigt zur Wand (so ragt die gekippte Hülle nicht in die Wand; das Tempo „trägt“ wie an der Steilwand). Nur Darstellung, der Kollider kippt nicht.
const TW = {}
// Stufe G: Fassrolle und Schlingern als eigene Gruppen über der Darstellung (lab-v7, 1:1). Schwebewagen haben keine Räder: die vier Schwebepunkte
// (M2CAR.hover) stehen für die Radlage (Aufstandslinie, Vorderachse als Drehpunkt des Schlingerns).
const TRICK_RIG_WHEELS = []
export function applyRacer(id) {
  RACER = VEHICLE_RIG.vehicles[id]
  Object.assign(M2CAR, { id, name: RACER.name_de, cls: RACER.class || 'racer', wheels: !!RACER.wheels, headlights: RACER.headlights || null,
    url: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${VEHICLE_COMMIT}/${RACER.path}`,
    box: { c: R(RACER.box.c), h: R(RACER.box.h) }, // collision_hints.body_box
    hover: RACER.hover.map(R), // FL FR RL RR (front = +Z)
    cam: { pos: R(RACER.cam.pos), target: R(RACER.cam.target) } }) // kfb_camera_follow
  const cx = M2CAR.box.h[0], cg = M2CAR.box.c[1], tip = Math.atan(cx / cg); Object.assign(TW, { contactX: cx, tipDeg: +(tip * 180 / Math.PI).toFixed(1), hold: tip + (Math.PI / 2 - tip) * 0.45 })
  RIDE.leanRad = TW.hold
  TRICK.freeLeanRad = (TW.tipDeg * Math.PI / 180) * 0.92 // Zwei-Rad frei: TIP_SAFETY 0,92 des Umfallwinkels (vehicle-twowheel.v1.js)
  TRICK_RIG_WHEELS.length = 0; M2CAR.hover.forEach(([x, y, z], i) => TRICK_RIG_WHEELS.push({ centre: { x, y, z }, width: 0.3 * S, end: i < 2 ? 'zPlus' : 'zMinus' }))
  DEFORM.profile = DEFORM_PROFILES.profiles[RACER.deform] || DEFORM_PROFILES.profiles.CAR_CHILL_LIGHT
  return M2CAR
}
applyRacer(RACER_ID0)
// Fahrhilfe und Fahrwerk als EIN Tuning-Objekt (V-313, V-151; später im God-Mode stellbar)
export const M2TUNE = {
  rideHeight: 0.7 * S, // m Unterseite über Boden (JSON: Laufzeitwert, Vorschlag 0,52–0,90 Rig)
  // V-345 (ecctrl eingefroren, V-367): nur maßstabsgerecht umgerechnet – Masse/Federn × K³, Längen × K, Motor × K⁴, Lenk-Abfall / K; nicht neu abgestimmt
  mass: 12 * K ** 3, comY: 0.45 * K, // kg, Schwerpunkt m über der Unterseite (tief: kippt nicht so leicht)
  spring: 300 * K ** 3, damp: 42 * K ** 3, hoverR: 0.3 * K, travel: 0.8 * K, // ShapeCastWheel springK/dampingC/rayShapeR/rayLength: Ruhe-Einfederung ≈ m·g / (4·k) ≈ 0,14 m, gut gedämpft
  hp: 25 * K ** 4, gear: 7, grip: 1.3, // Motor, eine Übersetzung (Höchsttempo ≈ 31 m/s), Haftung (weniger = rutscht statt kippt)
  steerFall: 0.06 / K, // Lenkeinschlag × 1 / (1 + v · steerFall) – wie k2b speedFactor
  coast: 0.6, // 1/s Ausrollen ohne Gas (waagrecht); unter 0,8 m/s auf flachem Boden hält die Bremse
  antiRoll: 10, antiRollDamp: 3, airYaw: 1.6, airPitch: 1.2, airDamp: 1.5,
  rightAfter: 0.35, rightRate: 4, rightLift: 3 * K,
}
export const M2_ON = /#m1\b.*\bcar\b/.test(H) // #m1,car[=ecctrl|k2b] · assist=off: Fahrhilfe M3 zu Beginn aus
// Elan S2: Racer-Flug nur mit Schalter fly (#m1,car,fly) – ohne ihn bleibt K2B unverändert (run-all 18.10.: Rampen-Launch m3-f und Zwei-Rad m3-g
// gerieten über das takeoff-Ereignis in den Flug)
export const RACER_FLY = M2_ON && /[#,]fly(,|$)/.test(H)
const WATER_WORLD = M2_ON && /(^|[#,])world=probe(,|$)/.test(H) // WS1c: Wasser gibt es nur auf dem Probe-Gelände
if (/(^|[#,])assist=off(,|$)/.test(H)) ASSIST_M3.on = false
// Ereignis-Abos (railImpact/landing/takeoff, Namen wie vehicle-cartoon-deformer.v2) für Squash, VFX, später Stunts (§55): M2EVENTS.on(type, fn) → abmelden
export const M2EVENTS = { subs: new Map(), on(type, fn) { const l = this.subs.get(type) || new Set(); l.add(fn); this.subs.set(type, l); return () => l.delete(fn) }, emit(e) { this.subs.get(e.type)?.forEach((fn) => fn(e)); this.subs.get('*')?.forEach((fn) => fn(e)) } }
export const M2STATE = { kind: /car=ecctrl/.test(H) ? 'ecctrl' : 'k2b', // Start mit B (Georgs Tendenz 16.10.), A per C als Gegenprobe
  resets: 0, switches: 0, rightStarts: 0, racerSwaps: 0, model: 'LOADING' }
// Label nach V-367 („Fahrsystem: K2B | ecctrl“, Abnahmepunkt; Georg 22.10.: weg für Spieler, nur noch im Testmodus): aktives System kräftig, das andere blass
const LABEL = (kind) => ['k2b', 'ecctrl'].map((k) => `<span style="opacity:${k === kind ? 1 : 0.35}">${k === 'k2b' ? 'K2B' : 'ecctrl'}</span>`).join(' | ')
// Fahr-Tasten im Info-Symbol (V-347 (4)), unter der M1-Liste; ecctrl ist eingefroren (V-367), Drift und Wendehilfe nur in K2B
const CAR_KEYS = '<b>Auto</b> (V · nächster Racer, Umschalt+V · voriger)<br>W · Gas &nbsp;·&nbsp; S · bremsen / rückwärts &nbsp;·&nbsp; A D · lenken (langsam: enge Wende)<br>Q E · driften links / rechts (K2B, ab 4,9 m/s)<br>Shift · Boost (K2B) &nbsp;·&nbsp; Leertaste · springen (K2B)<br>im Sprung Leertaste + A/D · Fassrolle &nbsp;·&nbsp; X + A/D · auf zwei Rädern (ab 6 m/s, mit Fahrhilfe)<br>M · Fahrhilfe M3 an/aus (Landen, Lage, Nie-festfahren, Rampen- und Wandzonen) bzw. Handbremse (ecctrl)<br>R · zurück an den Start &nbsp;·&nbsp; C · Fahrsystem wechseln'
const RACER_KEYS = '<br><b>Racer fliegt</b> (K2B): Rampe ab 20 m/s oder in der Luft Leertaste doppelt<br>W · Schub &nbsp;·&nbsp; S · Luftbremse &nbsp;·&nbsp; ↑ ↓ · Nase (oder rechte Maustaste halten) &nbsp;·&nbsp; Leertaste · steigen (+ A/D · Fassrolle)<br>Shift · Boost aus dem Kessel (leer: kocht 1,5 s) &nbsp;·&nbsp; landet von selbst knapp über dem Boden'
const NOKEYS = { forward: false, backward: false, leftward: false, rightward: false, jump: false, run: false, walk: false }
const OnFrame = ({ fn }) => { useFrame(fn); return null }

// Modell je Racer einmal laden (geteilt, im Speicher gehalten: Zurückwechseln ohne Neuladen), je Auto ein Klon; bis dahin ein Kasten in Rumpfgröße.
// Look A und Heldenfarbe einmal am geladenen Modell (Reihenfolge wie die Probe: Look misst die Grundhelligkeit am Original, dann Heldenfarbe);
// vlook=0 = Meshy-Original zum Vergleich. Heldenfarbe (Georg 22.10.): Standard aus = Originalfarbe; Einstellung an der Startseite (kfb:hero), Hash hero=1 für Tests.
// Ohne Ruckler (V-631): Look und Heldenfarbe rechnen in Häppchen (≤ 6 ms je Task), danach lädt warmModel die Texturen einzeln (je Bild eine) auf die GPU
// und übersetzt die Shader vorab (compileAsync) – erst dann erscheint der Wagen, bis dahin steht der Kasten.
export const HERO_ON = { on: heroEnabled(), switches: 0 }
// Knet-Stufe der Racer (V-654 C5 „eine Machart“): Standard an (Georg 22.10.), vclay=0 = Original zum Vergleich.
// An: Foto-Textur auf die Rollen der Biom-Palette umgetönt (prepVehicleClay), kfb-clay Profil 'vehicle' (= midground) mit Maßstab der Figur (FB-Höhe),
// Palettenzug 0,12; Düsen als Knet-Flamme (vehicleRig style 'clay'). Ein Programm für alle Racer (kfb-clay: customProgramCacheKey = Version).
const VCLAY_DEFAULT = true
export const VCLAY_ON = /(^|[#,])vclay=1(,|$)/.test(H) || (VCLAY_DEFAULT && !/(^|[#,])vclay=0(,|$)/.test(H))
const VCLAY_PAL = (() => { const k = (/palette=(mesa|moos|wueste|schnee|pastell)/.exec(H) || [0, TERRAIN3_CFG.palette])[1]; return TERRAIN3_CFG.palettes[k] || TERRAIN3_CFG.palettes.mesa })()
// Heldenfarbe umschalten (Startseite, Ereignis kfb:hero): fehlt die Umrechnung bei geladenen Racern, rechnet sie in Häppchen nach; dann Texturen tauschen
async function applyHeroSetting(on, gl) {
  HERO_ON.on = !!on; HERO_ON.switches++
  for (const [id, p] of [...MODELS]) { const m = await p, I = MODEL_INFO.get(id); if (!m || !I) continue
    if (I.clay) { await prepVehicleClay(m, { palette: VCLAY_PAL, hero: on, tick: slicer(6), tune: VEHICLE_RIG.vehicles[id]?.clayTone }); I.clay.hero = on; if (HERO_ON.on !== !!on) return; if (id === M2CAR.id) M2STATE.hero = { ...I.hero, on: HERO_ON.on }; continue }   // Knet-Stufe: Heldenfarbe = Lackgruppe in KFB-Rot
    if (on && I.hero.off) I.hero = await applyHeroColor(m, { tick: slicer(6), apply: false })
    if (HERO_ON.on !== !!on) return
    setHeroMaps(m, on); if (on && gl) m.traverse((o) => { if (o.isMesh) for (const mt of [].concat(o.material)) if (mt.userData.hero?.tex) gl.initTexture(mt.userData.hero.tex) })
    if (id === M2CAR.id) M2STATE.hero = { ...I.hero, on: HERO_ON.on } }
}
const CLAY_ORIG = new WeakMap()
const VEHICLE_CLAY_ROLES = () => ['sand', 'low', 'mid', 'high', 'peak', 'cliff', 'water'].map((k) => VCLAY_PAL[k]).filter(Boolean)
const MODELS = new Map(), MODEL_INFO = new Map(), LOADLOG = []   // LOADLOG: Prüfhilfe [Schritt, ms] je Ladevorgang (letzte 60)
const llog = (k) => { LOADLOG.push([k, +performance.now().toFixed(1)]); if (LOADLOG.length > 60) LOADLOG.shift() }
const racerUrl = (id) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${VEHICLE_COMMIT}/${VEHICLE_RIG.vehicles[id].path}`
const loadModel = (id = M2CAR.id, url = racerUrl(id)) => { touchModel(id); if (!MODELS.has(id)) MODELS.set(id, (llog('fetch ' + id), new GLTFLoader().loadAsync(url)).then(async (g) => { llog('parsed'); g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  const tick = slicer(6), t0 = performance.now(), look = /(^|[#,])vlook=0(,|$)/.test(H) ? { applied: 0, off: true } : await prepVehicleLook(g.scene, tick), t1 = performance.now()
  const hero = VCLAY_ON ? { applied: 0, off: true, clay: true } : HERO_ON.on ? await applyHeroColor(g.scene, { tick }) : { applied: 0, off: true }
  let clay = null
  if (VCLAY_ON) { llog('clay tone'); const t2 = performance.now(), tone = await prepVehicleClay(g.scene, { palette: VCLAY_PAL, hero: HERO_ON.on, tick, tune: VEHICLE_RIG.vehicles[id]?.clayTone }); llog('clay apply')
    const h = applyClay(g.scene, THREE, { profile: 'vehicle', seed: id, scaleRef: FB_RIG_HEIGHT, palette: VEHICLE_CLAY_ROLES(), pull: 0.12 })
    // kfb-clay legt das Original-Material in mesh.userData ab; Object3D.clone kopiert userData per JSON → Material.toJSON wandelte die 2048er-Textur
    // bei jedem Klon in einen Daten-Text (≈ 600 ms am Stück). Verweis hier in eine WeakMap (kfb-clay selbst bleibt byte-gleich).
    g.scene.traverse((o) => { if (o.userData.kfbClayOrig) { CLAY_ORIG.set(o, o.userData.kfbClayOrig); delete o.userData.kfbClayOrig } }); clay = { ...h.info(), tone, ms: +(performance.now() - t2).toFixed(1), hero: HERO_ON.on } }
  llog('prepped'); MODEL_INFO.set(id, { look, hero, clay, prepMs: { look: +(t1 - t0).toFixed(1), hero: +(performance.now() - t1).toFixed(1) } }); return g.scene })
  .catch((e) => { MODELS.delete(id); M2STATE.model = 'ERROR ' + e.message; return null }))
  return MODELS.get(id) }
// Vorwärmen (Lead 22.10.: Erstladen des Abschlepp-Kolosses 290 ms, 8 neue Shader-Varianten): steht der Wagen, lädt der Leerlauf den nächsten und den
// vorigen Racer der V-Reihenfolge (Laden, Look/Heldenfarbe in Häppchen, Texturen je Bild eine, Shader vorab) – V wechselt dann ohne Übersetzen.
// Speicher: höchstens MODEL_KEEP Racer bleiben geladen; ältere (nicht der aktuelle, nicht die Nachbarn) geben Geometrie und Texturen frei. prefetch=0 schaltet ab.
const MODEL_KEEP = 5, MODEL_ORDER = [], PREFETCH = !/(^|[#,])prefetch=0(,|$)/.test(H)
const neighbours = (id) => { const n = RACER_IDS.length, i = RACER_IDS.indexOf(id); return [RACER_IDS[(i + 1) % n], RACER_IDS[(i + n - 1) % n]] }
function touchModel(id) {
  const k = MODEL_ORDER.indexOf(id); if (k >= 0) MODEL_ORDER.splice(k, 1); MODEL_ORDER.push(id)
  const keep = new Set([M2CAR.id, id, ...neighbours(M2CAR.id)])
  for (const old of MODEL_ORDER.slice()) { if (MODEL_ORDER.length <= MODEL_KEEP) break; if (keep.has(old)) continue
    MODEL_ORDER.splice(MODEL_ORDER.indexOf(old), 1); const p = MODELS.get(old); MODELS.delete(old); MODEL_INFO.delete(old); llog('evict ' + old)
    p?.then((m) => setTimeout(() => releaseModel(m), 3000)) }
}
async function prefetchNeighbours(gl, camera, scene, alive) {
  for (const id of neighbours(M2CAR.id)) {
    if (!alive()) return; const fresh = !MODELS.has(id), m = await loadModel(id), I = MODEL_INFO.get(id)
    if (!m || !I || I.warm || !alive()) continue
    llog('prefetch ' + id + (fresh ? '' : ' (geladen)')); await warmModel(gl, m, camera, scene); I.warm = true; llog('prefetched ' + id)
  }
}
// Platzhalter-Kasten bis das Modell steht: Geometrie und Material bleiben (sonst übersetzt jeder Racer-Wechsel den Shader des Kastens neu)
const BOX_GEO = new THREE.BoxGeometry(1, 1, 1), BOX_MAT = new THREE.MeshStandardMaterial({ color: '#c8432f' })
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))
async function warmModel(gl, root, camera, scene) {
  const texs = new Set(); root.traverse((o) => { if (o.isMesh) for (const mt of [].concat(o.material)) for (const k of ['map', 'metalnessMap', 'roughnessMap', 'normalMap', 'emissiveMap', 'aoMap']) if (mt[k] && !mt[k].userData.kfbWarm) texs.add(mt[k]) })
  const env = warmVehicleEnv(gl); await nextFrame()
  root.traverse((o) => { if (o.isMesh) for (const mt of [].concat(o.material)) if (mt.userData.vehicleLook && mt.envMap !== env) { mt.envMap = env; mt.needsUpdate = true } })   // Spiegelumgebung vor dem Übersetzen (sonst wird die Variante ohne envMap vorgewärmt)
  for (const t of texs) { llog('tex ' + (t.image?.width || 0)); gl.initTexture(t); t.userData.kfbWarm = true; llog('tex ok'); await nextFrame() }
  llog('compile'); try { await gl.compileAsync(root, camera, scene); llog('compiled') } catch (e) { /* ohne Parallel-Übersetzung: übersetzt beim ersten Zeichnen */ }
}
// M3 Stufe E (V-379): Deformer v2 (lab-v7 vehicle-cartoon-deformer.v2.js 1:1, kayfabizarro main @904f0e959), Profil je Klasse (DEFORM.profile). Er schreibt nur in
// eigene Knoten unter der Darstellung (Shell-Gruppe), nie in den Starrkörper – die Kollider-Lage bleibt unverändert. Eingang: K2B-Signale je Schritt
// (setSignals) und die Ereignisse railImpact/landing (M2EVENTS). Mit Fahrhilfe aus: Knet-Squash wie M2 (J17 SQUASH_LOOK).
const NOSE = { upArrow: false, downArrow: false, rmb: false } // Elan S2: Nasen-Eingabe des Racers im Flug
export const TRICKS = { tumble: null, fish: null, touchdowns: 0, recovers: 0, triggered: 0 }
// Scheinwerfer (V-631): Tageslicht aus der Tageszeit des Licht-Rigs (wie M1World: lset, tod), HEADLIGHTS.daylight überschreibt (z. B. Biom-Fahrt)
const HL_DAY = (() => { const tod = parseTod(H), set = MOOD_SETS[(/lset=(r2|cozy|mesa)/.exec(H) || [0, 'mesa'])[1]]; return headlightDaylight(tod, moodAt(tod, set).elev) })()
function CarVisual({ squash, signals, lean }) {
  const g = useRef(null), tilt = useRef(null), trick = useRef(null), body = useRef(null), [model, setModel] = useState(null), def = useRef(null)
  useEffect(() => { if (!signals || !g.current || !body.current || !tilt.current) return
    const rig = { group: g.current, body: body.current, wheels: TRICK_RIG_WHEELS, frame: { height: M2CAR.box.c[1] + M2CAR.box.h[1], length: M2CAR.box.h[2] * 2, width: M2CAR.box.h[0] * 2, contactY: 0 }, report: { track: M2CAR.hover[0][0] * 2, wheelWidth: 0.3 * S } }
    const host = tilt.current; host.remove(g.current)
    const F = attachFishtail({ THREE, rig, profile: DEFORM.profile, facing: 1 }), T = attachTumble({ THREE, rig, profile: DEFORM.profile, facing: 1, child: F.root }); host.add(T.root)
    const hideMarks = () => T.root.traverse((o) => { if (o.isLine || o.isLineSegments) o.visible = false }) // Lab-Hilfslinien (Achsen, Anker) nicht im Spiel
    hideMarks(); trick.current = { T, F, hideMarks, side: 1 }
    const _q = new THREE.Quaternion(), _u = new THREE.Vector3(); TRICKS.bodyUpY = () => { body.current?.getWorldQuaternion(_q); return _u.set(0, 1, 0).applyQuaternion(_q).y } // Prüfwert: Karosserie aufrecht?
    const off = M2EVENTS.on('trick', (e) => { if (!ASSIST_M3.on) return
      if (e.kind === 'tumble') { T.trigger({ severity: 0.7, speed: e.speed, side: e.side }); hideMarks(); TRICKS.triggered++; trick.current.side = e.side }
      if (e.kind === 'recover') { F.trigger({ severity: 0.8, dir: e.side }); TRICKS.recovers++ } })
    return () => { off(); trick.current = null; host.remove(T.root); F.dispose?.(); T.dispose?.(); host.add(g.current) } }, [signals])
  useEffect(() => { if (!signals || !g.current || !body.current) return
    const D = createDeformer(THREE, { group: g.current, body: body.current, wheels: [], frame: { height: M2CAR.box.h[1] * 2, length: M2CAR.box.h[2] * 2, width: M2CAR.box.h[0] * 2 } }, { profile: DEFORM.profile })
    def.current = D; const offs = [M2EVENTS.on('railImpact', (e) => ASSIST_M3.on && D.railImpact(e)), M2EVENTS.on('landing', (e) => ASSIST_M3.on && D.landing(e))]
    return () => { offs.forEach((f) => f()); D.dispose?.(); def.current = null } }, [signals])
  useFrame(() => { const D = def.current, X = trick.current
    if (X) { const r = X.T.update(STEP); if (r.event === 'touchdown') { TRICKS.touchdowns++; D?.landing({ strength: r.strength }) } if (r.event === 'recover') { X.F.trigger({ severity: 0.8, dir: X.side || 1 }); TRICKS.recovers++ } X.hideMarks()
      TRICKS.tumble = { active: r.active, phase: r.phase, rollDeg: r.rollDeg, turns: r.turns }; const f = X.F.update(STEP); TRICKS.fish = { active: f.active, yawDeg: f.yawDeg } }
    if (tilt.current) { const a = lean?.() ?? 0, px = -Math.sign(a) * TW.contactX; tilt.current.rotation.z = a; tilt.current.position.set(px - px * Math.cos(a), -px * Math.sin(a), 0) } // Drehung um die Aufstandslinie
    if (D && ASSIST_M3.on) { g.current.scale.set(1, 1, 1); D.setSignals(signals()); D.update(STEP); DEFORM.last = D.readout; return }
    if (D) D.reset?.()
    // Knet-Squash wie J17 (holder.scale 1 + 0,12·sq, 1 − 0,18·sq, 1 + 0,06·sq) – nur die Optik, um die Unterseite
    const sq = squash?.() ?? 0; g.current?.scale.set(1 + SQUASH_LOOK.x * sq, 1 + SQUASH_LOOK.y * sq, 1 + SQUASH_LOOK.z * sq) })
  const { gl: glR, camera: camW, scene: sceneW } = useThree()
  // Neuversuch (Lead 22.10.: Startseite wartete 240 s, vermutlich GitHub-Abruf gescheitert): ein Fehler ließ bisher dauerhaft den Kasten stehen.
  // Jetzt bis zu 3 Neuversuche nach 2, 5 und 10 s; M2STATE.modelTries zählt mit, M2STATE.model trägt den letzten Fehler.
  useEffect(() => { let alive = true; M2STATE.model = 'LOADING'; M2STATE.modelTries = 0; const id = M2CAR.id
    const tryLoad = () => { M2STATE.modelTries++; return loadModel().then((m) => (m || !alive || M2STATE.modelTries > 3 ? m : new Promise((r) => setTimeout(r, [2000, 5000, 10000][M2STATE.modelTries - 1])).then(() => (alive ? tryLoad() : null)))) }
    tryLoad().then(async (m) => { if (!alive || !m) return; const c = m.clone(true), I = MODEL_INFO.get(id)
    if (!I.look.off) hookVehicleLook(c) // Look A (Georg 21.10.) am Klon: Materialien geteilt (schon umgestellt), Zeichen-Haken je Klon
    const t0 = performance.now(); if (!I.warm) await warmModel(glR, c, camW, sceneW); if (!alive) return   // schon vorgewärmt (Zurückwechseln, Vorladen): sofort zeigen, kein Warten auf Bilder
    M2STATE.look = I.look; M2STATE.hero = { ...I.hero, on: HERO_ON.on }; M2STATE.clay = I.clay; M2STATE.prepMs = { ...I.prepMs, warm: +(performance.now() - t0).toFixed(1) }; M2STATE.model = 'OK'; M2STATE.modelId = id; I.warm = true; setModel(c)
    if (PREFETCH) setTimeout(() => alive && prefetchNeighbours(glR, camW, sceneW, () => alive), 1500) }); return () => { alive = false } }, [])
  // R1a: Antriebs-Modul an den Düsen-Ankern des Racers. Modell und Anker hängen gemeinsam in rig.stretch (Stauchen/Strecken bei Boost und Sprung),
  // rig.object3d unter der Deformer-Gruppe – Fahnen bleiben bei jeder Verformung an den Düsen. Gas weich (0,12 s), Tempo aus den K2B-Signalen.
  const rig = useRef(null), drv = useRef({ gas: 0, boost: false, jump: false }), { scene: sceneR } = useThree()
  const dustColorAt = useCallback((x, z) => terrainDustColor(groundHeight, x, z, { flatY: 1.2 * K }), []) // über ≈ 0,8 m Geländehöhe = Hügel mit Gras
  useEffect(() => { if (!model || !body.current) return
    const M = mountRacerRig({ body: body.current, model, racer: RACER, unit: S, seed: M2CAR.id.length, scene: sceneR, dustColor: '#c9b48a', style: VCLAY_ON ? 'clay' : 'glow' }), R1 = M.rig; rig.current = R1; M2STATE.rig = R1
    if (M2CAR.wheels) R1.object3d.position.y = -M2TUNE.rideHeight // Rad-Fahrzeuge (V-631, wie die Probe): Räder auf den Boden statt in Schwebehöhe
    const A = createEngineAudio({ types: new Set([...RACER.anchors.map((x) => x.type), 'hover']), muted: /(^|[#,])mute(,|$)/.test(H) }); M2STATE.audio = A // R1a Ton (propulsion_r1)
    return () => { M.release(); A.stop(); rig.current = null; if (M2STATE.rig === R1) M2STATE.rig = null; if (M2STATE.audio === A) M2STATE.audio = null } }, [model])
  // Front-Scheinwerfer (V-631, Georg 22.10.): Gläser am Modell (Modell-Einheiten), Kegel in der Szene, Lichtfleck über kfb-groundfx (Kanal 'headlights');
  // Farbe = Antriebsfarbe des Racers; Zielpunkte am Boden über die Geländehöhe. hl=0 schaltet ab. Zeit je Bild in HEADLIGHTS.ms (Mittel).
  const { camera: camR } = useThree()
  useEffect(() => { if (!model || !HEADLIGHTS.on) return
    const X = mountHeadlights({ model, racer: RACER, scene: sceneR, pools: gfxChannel('headlights'), ground: groundHeight, unit: S }); if (!X) return
    HEADLIGHTS.inst = X.hl; HEADLIGHTS.ms = 0; HEADLIGHTS.n = 0; return () => { X.release(); if (HEADLIGHTS.inst === X.hl) HEADLIGHTS.inst = null } }, [model])
  useFrame((_, dt) => { const hl = HEADLIGHTS.inst; if (!hl) return; const t0 = performance.now(); hl.update(dt, { daylight: HEADLIGHTS.daylight?.() ?? Math.min(HL_DAY, 1 - HEADLIGHTS.dark), camera: camR }); HEADLIGHTS.ms += performance.now() - t0; HEADLIGHTS.n++ })
  useFrame((_, dt) => { const R1 = rig.current; if (!R1) return; const k = M2STATE.drive || {}, sg = signals?.() || {}, D = drv.current
    D.gas += ((k.gas ? 1 : 0) - D.gas) * Math.min(1, dt / 0.12)
    const A = M2STATE.audio; if (A && (k.gas || k.boost || k.jump)) A.resume() // Browser-Regel: Ton erst nach einer Eingabe
    const boostStart = k.fly ? (k.surgeN ?? 0) !== D.surgeN : !!k.boost && !D.boost && D.gas > 0.3
    // Elan S2 im Flug: surge(1) beim Boost-Start, ascent(1) beim Steigen (Zähler aus racerFlight), Kessel leer → Gas × 0,3 und Funken über den Brems-Puls
    if (k.fly) { if ((k.surgeN ?? 0) !== D.surgeN) R1.surge(1); if ((k.ascentN ?? 0) !== D.ascentN) R1.ascent(1) }
    else { if (k.boost && !D.boost && D.gas > 0.3) R1.surge(1); if (k.jump && !D.jump && !k.air) R1.ascent(0.9); if (k.brake && !D.brake && Math.abs(sg.speed ?? 0) > 0.25) R1.brake(1) } // brake: Nase taucht (V-487 §86)
    D.boost = !!k.boost; D.jump = !!k.jump; D.brake = !!k.brake; D.surgeN = k.surgeN ?? 0; D.ascentN = k.ascentN ?? 0
    const ev = R1.update(dt, { throttle: D.gas * (k.boil ? 0.3 : 1), speed01: k.fly ? k.speed01 : Math.min(1, Math.abs(sg.speed ?? 0)), boost: k.fly ? !!k.boost : !!k.boost && D.gas > 0.3, brake: !!k.brake, groundAt: groundHeight, groundColorAt: dustColorAt })
    if (A) { if (boostStart) A.event({ type: 'boost' }); for (const x of ev) A.event(x); A.update(dt, { rpm: R1.engine.rpm, thrust: R1.thrust, boost: R1.boostLevel }) } })
  // Bild-Interpolation: Wurzel = Starrkörper-Gruppe über der Kippgruppe (C1 17.10.: seit M3 lag hier die Kippgruppe – der fahrende Körper wurde nicht
  // mehr interpoliert und ruckelte zwischen den Physik-Schritten). Auch Prüfwert für die Jitter-Messung.
  useEffect(() => { const root = tilt.current?.parent; if (!root) return; M2STATE.visualRoot = root; const off = interpTrack(root); return () => { off(); if (M2STATE.visualRoot === root) M2STATE.visualRoot = null } }, []) // Bild-Interpolation: Wurzel = Starrkörper
  return (
    <group ref={tilt}><group ref={g}>
      <group ref={body}>{model ? null : <mesh position={M2CAR.box.c} scale={M2CAR.box.h.map((v) => v * 2)} geometry={BOX_GEO} material={BOX_MAT} />}</group>
    </group></group>
  )
}

// Anzeige der aktiven Fahrphysik: groß oben mittig, beim Wechsel kurz hervorgehoben (Host-DOM, kein HUD-Stil)
function useKindLabel(kind, assist, racer) {
  const [devui, setDevui] = useState(DEVUI) // V-655: Schalter „Entwickler-Infos“ im Zahnrad schaltet das Label zur Laufzeit um
  useEffect(() => onDevUi(setDevui), [])
  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.createElement('div'); el.id = 'm2-kind'
    el.style.cssText = "position:fixed;left:50%;top:" + (DEVUI ? 14 : 88) + "px;transform:translateX(-50%);z-index:6;padding:8px 18px;border-radius:12px;background:rgba(255,250,240,.82);color:#1f1a14;font:700 22px/1.2 'Shantell Sans',system-ui,sans-serif;box-shadow:0 3px 8px rgba(42,26,12,.25);pointer-events:none;white-space:nowrap;transition:transform .25s,background .25s"
    document.body.appendChild(el); return () => { el.remove(); document.getElementById('m2-keys')?.remove() }
  }, [])
  useEffect(() => {
    const el = document.getElementById('m2-kind'); if (!el) return
    // M3 Fühlprobe (V-379): „Fahrsystem: K2B · Assist M3 an/aus“ – M schaltet die Fahrhilfe (Vergleich mit dem Stand vorher), C wechselt das System
    el.innerHTML = 'Fahrsystem: ' + LABEL(kind) + (kind === 'k2b' ? ` · Assist M3 <span style="color:${assist ? '#2f7d32' : '#a33'}">${assist ? 'an' : 'aus'}</span>` : '') + ` <span style="font-weight:400;font-size:15px">· M Assist · C wechselt · V Racer: ${M2CAR.name.replace(/^\d+\s/, '')}</span>`
    const list = document.getElementById('m1-keys'); if (list && !document.getElementById('m2-keys')) { const c = document.createElement('div'); c.id = 'm2-keys'; c.style.marginTop = '6px'; c.innerHTML = RACER_FLY ? CAR_KEYS + RACER_KEYS : CAR_KEYS; list.appendChild(c) }
    /* Georg 22.10. (V-367 freigegeben): Abnahme-Text „Fahrsystem … Assist …“ nur im Testmodus (debug); Spieler sehen kurz den Racer-Namen unter der Holzleiste */
    el.style.top = (DEVUI ? 14 : 88) + 'px'; el.style.opacity = '1'
    if (!DEVUI) { el.textContent = M2CAR.name.replace(/^\d+\s/, ''); el.style.opacity = '1'; el.style.transition = 'opacity .6s'; const tf = setTimeout(() => { el.style.opacity = '0' }, 2600); return () => clearTimeout(tf) }
    el.style.background = 'rgba(255,214,120,.95)'; el.style.transform = 'translateX(-50%) scale(1.12)'
    const t = setTimeout(() => { el.style.background = 'rgba(255,250,240,.82)'; el.style.transform = 'translateX(-50%) scale(1)' }, 900)
    return () => clearTimeout(t)
  }, [kind, assist, racer, devui])
}

const M2Car = forwardRef(function M2Car({ player }, ref) {
  const [kind, setKind] = useState(M2STATE.kind)
  const [session, setSession] = useState(0)
  const spawn = useRef({ p: M2CAR.spawn, yaw: M2CAR.yaw })
  const [, getKeys] = useKeyboardControls()
  const keys = () => (M1INPUT.override ? { ...NOKEYS, ...M1INPUT.override } : getKeys())
  const car = useRef(null)
  const { camera } = useThree()
  const { world, rapier } = useRapier()
  const [assist, setAssist] = useState(ASSIST_M3.on)
  const [racer, setRacerId] = useState(M2CAR.id)
  useKindLabel(kind, assist, racer)
  useEffect(() => { M2STATE.carPos = () => car.current?.pos() ?? null; return () => { M2STATE.carPos = null } }, [])
  // Kontaktverdeckung (L3): das Licht-Modul (createContactAO in M1World) legt den Fleck an der Boden-Normale unter einen Stellvertreter in Wagengröße,
  // der dem Auto folgt (Grundfläche einmal gemessen, ungedreht). Löst den eigenen, waagrechten Fleck ab (Georg 17.10.: abgeschnittener Zweitschatten am Hang).
  const proxy = useMemo(() => { const g = new THREE.Group(); g.name = 'm2-car-ao'; const m = new THREE.Mesh(new THREE.BoxGeometry(M2CAR.box.h[0] * 2, 0.01, M2CAR.box.h[2] * 2)); m.visible = false; g.add(m); return g }, [racer])
  useEffect(() => { M2STATE.ao = { object3d: proxy, status: () => ({ status: car.current ? 'OK' : 'LOADING', shown: !!car.current }) }
    M2STATE.carSize = { half: Math.hypot(M2CAR.box.h[0], M2CAR.box.h[2]), h: M2CAR.box.c[1] + M2CAR.box.h[1] }; return () => { M2STATE.ao = null } }, [proxy])
  useEffect(() => interpTrack(proxy), [proxy])
  useFrame(() => { const c = car.current; if (!c) return; const p = c.pos(); proxy.position.set(p.x, p.y, p.z); proxy.rotation.set(0, c.yaw(), 0) })
  useEffect(() => { loadModel(); player.current?.freeze(true); player.current?.yieldCamera(true); return () => { player.current?.yieldCamera(false); player.current?.freeze(false) } }, [player])
  // V-631: Racer an Ort und Stelle wechseln (Maße, Kamera, Verformungsprofil neu; Modell aus dem Speicher oder nachladen); Adresse merkt sich die Wahl
  const swapRacer = (id) => { if (!VEHICLE_RIG.vehicles[id] || id === M2CAR.id) return; const p = car.current?.pos(), y = car.current?.yaw() ?? spawn.current.yaw
    applyRacer(id); M2STATE.racerSwaps++; setRacerId(id); restart(kind, p ? { p: [p.x, p.y + 0.3 * K, p.z], yaw: y } : null)
    if (typeof history !== 'undefined') { const h = location.hash, nh = /(^|[#,])racer=\w+/.test(h) ? h.replace(/((?:^|[#,])racer=)\w+/, `$1${id}`) : h + ',racer=' + id; history.replaceState(null, '', location.pathname + location.search + nh) } }
  useEffect(() => { const on = (e) => swapRacer(e.detail?.id); window.addEventListener('kfb:racer', on); return () => window.removeEventListener('kfb:racer', on) })
  const restart = (k, at) => { if (at) spawn.current = at; M2STATE.kind = k; setKind(k); setSession((n) => n + 1); follow.reset() } // Neustart/Wechsel: Kamera setzt neu auf (kein Gleiten über die Karte)
  useHostKeys((e) => {
    // Elan S2: Pfeil hoch/runter sind im Host-Tastenplan W/S (ein keydown-Listener, Vertrag §4) – welche Taste zuletzt gedrückt wurde, entscheidet im Flug
    // zwischen Schub/Luftbremse (W/S) und Nase (Pfeile); kein preventDefault, die Bewegung liest weiter KeyboardControls
    if (e.code === 'ArrowUp' || e.code === 'KeyW') NOSE.upArrow = e.code === 'ArrowUp'; if (e.code === 'ArrowDown' || e.code === 'KeyS') NOSE.downArrow = e.code === 'ArrowDown'
    if (e.repeat) return
    if (e.code === 'KeyM') { ASSIST_M3.on = !ASSIST_M3.on; setAssist(ASSIST_M3.on); e.preventDefault(); return }
    if (e.code === 'KeyC') { const p = car.current?.pos(), y = car.current?.yaw() ?? spawn.current.yaw; M2STATE.switches++; restart(kind === 'ecctrl' ? 'k2b' : 'ecctrl', p ? { p: [p.x, p.y + 0.8 * K, p.z], yaw: y } : null); e.preventDefault() }
    if (e.code === 'KeyR') { M2STATE.resets++; restart(kind, { p: M2CAR.spawn, yaw: M2CAR.yaw }); e.preventDefault() }
    if (e.code === 'KeyV') { const n = RACER_IDS.length, i = RACER_IDS.indexOf(M2CAR.id); swapRacer(RACER_IDS[(i + (e.shiftKey ? n - 1 : 1)) % n]); e.preventDefault() }
  }, 12)
  // Folgekamera C1 (V-408/V-088): Orbit von allen Seiten, Recenter nur in Bewegung, Zoom bis Ich-Perspektive, Kollisions-Arm – je Bild nach der
  // Interpolation (M1INTERP.frameCam), Ziel = interpolierte Starrkörper-Gruppe. Grundabstand und Höhe aus kfb_camera_follow (nur Gierung folgt).
  const gl = useThree((s) => s.gl)
  useEffect(() => { const on = (e) => applyHeroSetting(!!e.detail?.on, gl); window.addEventListener('kfb:hero', on); return () => window.removeEventListener('kfb:hero', on) }, [gl])   // Heldenfarbe live umschalten (Startseite)
  const follow = useMemo(() => { const [, ch, cz] = M2CAR.cam.pos, ray = new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
    return createFollowCam({ dom: gl.domElement, base: Math.hypot(ch - M2CAR.cam.target[1], cz), height: M2CAR.cam.target[1], eye: M2CAR.box.c[1] + M2CAR.box.h[1] * 1.05, eyeAhead: M2CAR.box.h[2] * 0.85, onPov: (on) => { const r = M2STATE.visualRoot; if (r) r.traverse((o) => { if (o.isMesh) o.visible = !on }) }, pitch0: Math.atan2(ch - M2CAR.cam.target[1], -cz), maxArm: 7.5 * K,
      collide: (from, dir, dist) => { ray.origin.x = from.x; ray.origin.y = from.y; ray.origin.z = from.z; ray.dir.x = dir.x; ray.dir.y = dir.y; ray.dir.z = dir.z
        const h = world.castRay(ray, dist, true, undefined, undefined, undefined, undefined, (co) => !co.parent()?.userData?.m2Car && !isFence(co)); return h ? h.timeOfImpact : null },
      ground: (x, z) => groundHeight(x, z),
      mod: () => M2STATE.water?.cam || null, clampY: (x, z, y) => (M2STATE.water ? waterCamClamp(M2STATE.water, waterActive.level, x, z, y, groundHeight) : y) }) }, [gl, world, rapier, racer]) // WS1c: Kamera am Wasser
  useEffect(() => { const v = new THREE.Vector3()
    M1INTERP.frameCam = () => { const c = car.current, root = M2STATE.visualRoot; if (!c || !root) return; root.getWorldPosition(v); follow.update(M1CLOCK.frameDt ?? STEP, camera, { target: v, heading: c.yaw(), moving: Math.abs(c.speed()) > 0.6 * K }) }
    M2STATE.follow = follow; return () => { M1INTERP.frameCam = null; M2STATE.follow = null; follow.detach() } }, [follow, camera])
  useEffect(() => { expose('M2', { att: ATT, land: LAND, stuck: STUCK, push: PUSH, ride: RIDE, twoWheel: TW, trick: TRICK, tricks: TRICKS, assist: ASSIST_M3, deform: DEFORM, events: M2EVENTS, kind: () => M2STATE.kind, stats: M2STATE, tune: M2TUNE, spec: M2CAR, car: () => car.current, setKind: (k, at) => restart(k, at), flip: (how) => car.current?.flip?.(how), racers: RACER_IDS, racer: () => M2CAR.id, setRacer: (id) => swapRacer(id), headlights: HEADLIGHTS, models: () => [...MODEL_INFO.keys()], modelInfo: (id) => MODEL_INFO.get(id), renderer: () => gl, loadLog: LOADLOG, heroSetting: HERO_ON, setHero: (on) => applyHeroSetting(on, gl), ground: groundHeight }) })
  useImperativeHandle(ref, () => ({ kind: () => M2STATE.kind, setKind: (k, at) => restart(k, at), car: () => car.current }))
  const props = { key: kind + session, at: spawn.current, keys, carRef: car, player }
  return <><primitive object={proxy} />{kind === 'ecctrl' ? <EcctrlCar {...props} /> : <K2tCar {...props} />}</>
})
export default M2Car

// ── A · ecctrl ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function EcctrlCar({ at, keys, carRef }) {
  const v = useRef(null), right = useRef({ t: 0, on: false })
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), up: new THREE.Vector3(), fwd: new THREE.Vector3(), side: new THREE.Vector3(), axis: new THREE.Vector3(), Y: new THREE.Vector3(0, 1, 0) }), [])
  const T = M2TUNE, q0 = useMemo(() => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), at.yaw), [at])
  const { c: bc, h: bh } = M2CAR.box
  // Masse fest, Schwerpunkt tief (Rahmen des Starrkörpers: Ursprung = Unterseite der Karosserie), Trägheit eines Quaders
  const mp = useMemo(() => { const [w, h, l] = bh.map((x) => x * 2), m = T.mass
    return { mass: m, centerOfMass: { x: 0, y: T.comY - bc[1], z: 0 }, principalAngularInertia: { x: (m / 12) * (h * h + l * l), y: (m / 12) * (w * w + l * l), z: (m / 12) * (w * w + h * h) }, angularInertiaLocalFrame: { x: 0, y: 0, z: 0, w: 1 } } }, [])
  const rot = () => { const r = v.current?.body?.rotation(); if (r) tmp.q.set(r.x, r.y, r.z, r.w); return tmp.q }
  const grounded = () => { let n = 0; v.current?.wheelsInfo?.forEach((w) => { if (w.current?.rayHit) n++ }); return n }
  useEffect(() => {
    carRef.current = {
      kind: 'ecctrl',
      pos: () => v.current?.body?.translation() ?? { x: at.p[0], y: at.p[1], z: at.p[2] },
      yaw: () => { if (!v.current?.body) return at.yaw; const f = tmp.fwd.set(0, 0, 1).applyQuaternion(rot()); return Math.atan2(f.x, f.z) },
      upY: () => (v.current?.body ? tmp.up.set(0, 1, 0).applyQuaternion(rot()).y : 1),
      grounded, speed: () => { const l = v.current?.body?.linvel(); return l ? Math.hypot(l.x, l.y, l.z) : 0 },
      body: () => v.current?.body ?? null,
      flip: (how = 'roof') => { const b = v.current?.body; if (!b) return; const p = b.translation(); const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), how === 'side' ? Math.PI / 2 : Math.PI).premultiply(q0)
        b.setTranslation({ x: p.x, y: p.y + 2.5 * K, z: p.z }, true); b.setRotation(q, true); b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true) },
      state: () => ({ kind: 'ecctrl', grounded: grounded(), upY: +carRef.current.upY().toFixed(3), speed: +carRef.current.speed().toFixed(2), rpm: v.current?.engineRPM ?? null, righting: right.current.on }),
    }
    return () => { if (carRef.current?.kind === 'ecctrl') carRef.current = null }
  }, [])
  // vor ecctrl: Eingabe; Lenkung stufenlos über joystickL.x (+ = rechts), mit dem Tempo kleiner
  const pre = () => {
    const k = keys(), l = v.current?.body?.linvel(), sp = l ? Math.hypot(l.x, l.z) : 0, st = ((k.leftward ? 1 : 0) - (k.rightward ? 1 : 0)) / (1 + sp * T.steerFall)
    const flat = tmp.up.set(0, 1, 0).applyQuaternion(rot()).y > 0.99, hold = !k.forward && !k.backward && sp < 0.8 * K && flat
    v.current?.setMovement({ forward: k.forward, backward: k.backward, brake: k.jump || hold, joystickL: { x: -st, y: 0 } })
  }
  // nach ecctrl: Fahrhilfe (M2TUNE)
  const post = () => {
    const b = v.current?.body; if (!b) return
    const av = b.angvel(), dt = STEP, k = keys(), q = rot(), lv = b.linvel()
    const up = tmp.up.set(0, 1, 0).applyQuaternion(q), fwd = tmp.fwd.set(0, 0, 1).applyQuaternion(q), n = grounded()
    const st = right.current
    if (up.y < 0.35 && Math.hypot(lv.x, lv.y, lv.z) < 3 * K) st.t += dt; else if (up.y > 0.9) { st.t = 0; st.on = false }
    if (st.t > T.rightAfter || st.on) { // Selbstaufrichten
      if (!st.on) M2STATE.rightStarts++
      st.on = true; const axis = tmp.axis.crossVectors(up, tmp.Y); if (axis.lengthSq() < 1e-6) axis.copy(fwd); axis.normalize().multiplyScalar(T.rightRate)
      b.setAngvel({ x: axis.x, y: av.y * 0.5, z: axis.z }, true)
      if (lv.y < T.rightLift && up.y < 0.6) b.setLinvel({ x: lv.x * 0.9, y: T.rightLift, z: lv.z * 0.9 }, true)
      return
    }
    if (n > 0) { // Anti-Roll am Boden + Ausrollen ohne Gas
      const side = tmp.side.set(1, 0, 0).applyQuaternion(q), roll = Math.asin(THREE.MathUtils.clamp(side.y, -1, 1)), rr = av.x * fwd.x + av.y * fwd.y + av.z * fwd.z
      const d = (-roll * T.antiRoll - rr * T.antiRollDamp) * dt
      b.setAngvel({ x: av.x + fwd.x * d, y: av.y + fwd.y * d, z: av.z + fwd.z * d }, true)
      if (!k.forward && !k.backward) { const f = Math.max(0, 1 - T.coast * dt); b.setLinvel({ x: lv.x * f, y: lv.y, z: lv.z * f }, true) }
    } else { // Luftkontrolle
      const steer = (k.leftward ? 1 : 0) - (k.rightward ? 1 : 0), pitch = (k.forward ? 1 : 0) - (k.backward ? 1 : 0), side = tmp.side.set(1, 0, 0).applyQuaternion(q)
      const tx = up.x * steer * T.airYaw + side.x * pitch * T.airPitch, ty = up.y * steer * T.airYaw + side.y * pitch * T.airPitch, tz = up.z * steer * T.airYaw + side.z * pitch * T.airPitch, f = Math.min(1, T.airDamp * dt)
      b.setAngvel({ x: av.x + (tx - av.x) * f, y: av.y + (ty - av.y) * f, z: av.z + (tz - av.z) * f }, true)
    }
  }
  const wy = T.rideHeight + T.hoverR - T.travel / 2 // Radmitte so, dass die Unterseite in Ruhe ≈ rideHeight über dem Boden schwebt
  return (
    <>
      <OnFrame fn={pre} />
      <EcctrlVehicle ref={v} position={[at.p[0], at.p[1], at.p[2]]} quaternion={q0.toArray()} ccd colliders={false} name="m2-car" userData={{ m2Car: true }}
        carConfig={{ engineHorsepower: T.hp, gearRatios: [T.gear] }}>
        <CuboidCollider args={bh} position={bc} massProperties={mp} />
        <CarVisual />
        {M2CAR.hover.map(([x, y, z], i) => (
          <ShapeCastWheel key={i} position={[x, y + wy, z]} driveWheel steerWheel={i < 2} brakeWheel rayShapeR={T.hoverR} rayLength={T.travel} springK={T.spring} dampingC={T.damp} tireGripFactor={T.grip} />
        ))}
      </EcctrlVehicle>
      <OnFrame fn={post} />
    </>
  )
}

// ── B · k2b (kinematisch) ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function K2tCar({ at, keys, carRef, player }) {
  const { world, rapier } = useRapier()
  const body = useRef(null), d = useMemo(() => createK2t(at.p[0], at.p[1], at.p[2], at.yaw), [at])
  // Elan S2: Racer-Flug (racerFlight.js). Pfeil hoch/runter = Nase (NOSE, aus dem Host-Tasten-Router), RMB gehalten = Nase aus der Kamera
  const F = useMemo(() => createRacerFlight(K / WORLD_K, G), [d]), { gl } = useThree()
  useEffect(() => { const pd = (e) => { NOSE.rmb = (e.buttons & 2) !== 0 }, cm = (e) => { if (F.st) e.preventDefault() }
    gl.domElement.addEventListener('pointerdown', pd); window.addEventListener('pointerup', pd); gl.domElement.addEventListener('contextmenu', cm)
    return () => { gl.domElement.removeEventListener('pointerdown', pd); window.removeEventListener('pointerup', pd); gl.domElement.removeEventListener('contextmenu', cm); NOSE.rmb = false; if (ELAN_MEM.state === F.st) ELAN_MEM.state = null } }, [F, gl])
  const { c: bc, h: bh } = M2CAR.box
  const shape = useMemo(() => new rapier.Cuboid(bh[0], bh[1], bh[2]), [rapier])
  const shrunk = useMemo(() => new rapier.Cuboid(bh[0] * 0.97, bh[1] * 0.9, bh[2] * 0.97), [rapier]) // Drehprüfung: knapp kleiner, Berührung ist kein Stecken
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])
  const tmp = useMemo(() => ({ q2: new THREE.Quaternion(), o2: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), m: new THREE.Matrix4(), f: new THREE.Vector3(), u: new THREE.Vector3(), x: new THREE.Vector3(), Y: new THREE.Vector3(0, 1, 0), o: new THREE.Vector3() }), [])
  const skip = (c) => !c.parent()?.userData?.m2Car
  const isObstacle = (c) => { const u = c.parent()?.userData; return !!(u?.stunt?.kind === 'wall' || u?.obstacle) }
  // weiche Hindernisse = Figuren: FrizzleBob (ecctrl-Kapsel) und GothGirl (userData.soft)
  const isSoft = (c) => { const b = c.parent(); return !!b && (b.userData?.soft === true || b.handle === player?.current?.handle?.()?.body?.handle) }
  const W = useMemo(() => createWaterDrive(), []) // WS1c (V-631): Wasser-Zustand je Wagen
  const env = useMemo(() => ({
    // Bodenhöhe unter dem Ursprung (= Unterseite) + Fahrhöhe. Georg 16.10.: „fährt durch den Berg und fällt endlos“ – der Strahl begann 1,5 m über dem
    // Auto und verfehlte einen steil ansteigenden Hang. Jetzt: Strahl ab 3 m über dem Auto auf Theater/Gelände, und das Gelände-Höhenfeld ist IMMER
    // Mindestboden (nie None, nie darunter); Normale aus dem Höhenfeld, wo der Strahl nichts Höheres trifft.
    home: () => ({ x: M2CAR.spawn[0], y: groundHeight(M2CAR.spawn[0], M2CAR.spawn[2]) + M2TUNE.rideHeight, z: M2CAR.spawn[2], yaw: M2CAR.yaw }), // T3-Rückfall (Stufe D)
    ground: (x, z, fromY) => { const from = fromY + 1.5 * K; ray.origin.x = x; ray.origin.y = from; ray.origin.z = z
      let h = world.castRayAndGetNormal(ray, 60, true, undefined, undefined, undefined, body.current ?? undefined, (c) => skip(c) && !isFence(c))
      // Strahl beginnt in einem Körper (toi ≈ 0, z. B. Wagen an einer Gebäudekante): dieser Körper ist kein Boden (m3-a 17.10.: Wagen kletterte aufs Dach)
      if (h && h.timeOfImpact < 1e-3) { const inside = h.collider; h = world.castRayAndGetNormal(ray, 60, true, undefined, undefined, undefined, body.current ?? undefined, (c) => skip(c) && !isFence(c) && c !== inside) }
      const ty = groundHeight(x, z), e = 0.4 * K, tn = new THREE.Vector3(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize()
      const hy = h ? from - h.timeOfImpact : -Infinity
      // M3 Stufe B: steile Flächen (Normale < 60° zur Senkrechten, z. B. Rampenseite, Tafelkante) sind kein Boden – dann zählt das Gelände
      return hy > ty + 0.01 * K && (h.normal.y >= 0.5 || !ASSIST_M3.on) ? { y: hy + M2TUNE.rideHeight, n: [h.normal.x, h.normal.y, h.normal.z], floor: ty + M2TUNE.rideHeight } : { y: ty + M2TUNE.rideHeight, n: [tn.x, tn.y, tn.z], floor: ty + M2TUNE.rideHeight } },
    // Wände: Rumpf in seiner Lage (mit Neigung) entlang der Bewegung schieben. castShape meldet nur den ERSTEN Treffer – daher je Treffer: Boden
    // (n.y > 0,3: Hang, Bühnenboden, Rampe) überspringen, Wand kürzen, Kollider ausnehmen und mit der gekürzten Bewegung erneut schieben, bis
    // nichts mehr kommt (höchstens 5 Durchgänge). Sonst sah die Prüfung den Zaun hinter einem Billboard bzw. Boden nicht (m2-g0 16.10.: 3–4/28).
    zone: (x, z) => rampZone(x, z), // Stufe F: Rampen-Zonen des Testfelds
    // steckt der Kasten bei Gierung yaw (aufrecht) in einem Hindernis? Hindernis = Gebäude des Testfelds, Theater, Tafel, Partnerin (userData obstacle/soft)
    blocked: (x, y, z, yaw) => { const q = tmp.q2.setFromAxisAngle(tmp.Y, yaw), o = tmp.o2.set(bc[0], bc[1] + 0.05 * K, bc[2]).applyQuaternion(q)
      let hit = false; world.intersectionsWithShape({ x: x + o.x, y: y + o.y, z: z + o.z }, { x: q.x, y: q.y, z: q.z, w: q.w }, shrunk, (c) => { hit = true; return false }, undefined, undefined, undefined, body.current ?? undefined,
        (c) => { const u = c.parent()?.userData; return skip(c) && !isFence(c) && !!(u?.stunt?.kind === 'wall' || u?.obstacle || u?.soft) }); return hit },
    sweep: (from, delta) => { let dl = delta.slice(), wall = null, soft = false, ride = false
      const q = tmp.q, o = tmp.o.set(bc[0], bc[1] + 0.05 * K, bc[2]).applyQuaternion(q), skipSet = new Set(), pred = (c) => skip(c) && !skipSet.has(c.handle)
      for (let pass = 0; pass < 5; pass++) {
        if (Math.hypot(...dl) < 1e-6) break
        const hit = world.castShape({ x: from[0] + o.x, y: from[1] + o.y, z: from[2] + o.z }, { x: q.x, y: q.y, z: q.z, w: q.w }, { x: dl[0], y: dl[1], z: dl[2] }, shape, 0.02 * K, 1, true, undefined, undefined, undefined, body.current ?? undefined, pred)
        M2STATE.lastSweep = hit ? { pass, toi: +hit.time_of_impact.toFixed(3), ny: +hit.normal1.y.toFixed(2), fence: isFence(hit.collider) } : { pass, none: true } // Prüfwert
        if (!hit) break
        skipSet.add(hit.collider.handle)
        // Boden: weiter nach Wänden suchen. Hindernisse (Gebäude, Theater, Tafel) zählen nur mit fast waagrechter Fläche als Boden – an Kanten ist die
        // Treffer-Normale schräg (m3-a 17.10.: n.y > 0,3 an der Kante von ecke-1 ließ den Wagen hinein, der Bodenstrahl hob ihn dann aufs Dach)
        if (hit.normal1.y > (isObstacle(hit.collider) ? 0.85 : 0.3) && !isFence(hit.collider)) continue
        const n = [hit.normal1.x, hit.normal1.y, hit.normal1.z], into = dl[0] * n[0] + dl[1] * n[1] + dl[2] * n[2] // normal1 zeigt aus dem Hindernis (gemessen)
        if (into >= 0) continue
        const cut = into * (1 - Math.min(1, hit.time_of_impact)); dl = [dl[0] - cut * n[0], dl[1] - cut * n[1], dl[2] - cut * n[2]]; wall = n; soft = isSoft(hit.collider); ride = !!hit.collider.parent()?.userData?.stunt?.ride
      }
      return { delta: dl, hit: !!wall, n: wall, soft, ride } },
  }), [world, rapier])
  useMemo(() => { const g0 = env.ground; env.ground = (x, z, fromY) => waterGround(W, g0(x, z, fromY), x, z, waterActive.level, M2TUNE.rideHeight) }, [env, W]) // WS1c: gleitend ist der Spiegel der Boden
  // Flug-Umgebung: Boden = K2B-Boden unter dem Wagen (Fahrhöhe eingerechnet), Wände über denselben Rumpf-Schub
  const fenv = useMemo(() => ({ ground: (x, z) => env.ground(x, z, d.y).y, sweep: (from, delta) => env.sweep(from, delta) }), [env, d])
  useEffect(() => {
    tmp.q.setFromAxisAngle(tmp.Y, d.yaw)
    carRef.current = {
      kind: 'k2b', pos: () => ({ x: d.x, y: d.y, z: d.z }), yaw: () => d.yaw, upY: () => tmp.u.fromArray(d.up).normalize().y, grounded: () => (d.air ? 0 : 4), speed: () => Math.hypot(d.speed, d.latV), body: () => body.current, flip: () => {},
      signals: () => d.signals, attitude: () => attitude(d), fly: () => F, kick: (o) => { if (DEBUG) Object.assign(d, o) }, // Prüf-Stoß (nur debug): z. B. { latV } in der Luft
      state: () => ({ kind: 'k2b', grounded: d.air ? 0 : 4, upY: 1, speed: +Math.abs(d.speed).toFixed(2), air: d.air, hits: d.hits, squash: +d.squash.toFixed(3), rescues: d.rescues || 0, t1: d.t1 || 0, t3: d.t3 || 0, rides: d.rides || 0, riding: !!d.ride, tricks: d.tricks || 0, freeTip: !!d.freeTip, rideLast: d.rideLast || null, lean: +(d.lean || 0).toFixed(3), launches: d.launches || 0, zone: d.zone?.seg || null, zoneAborted: !!d.zone?.aborted, fenceRescues: d.fenceRescues || 0 }),
    }
    return () => { if (carRef.current?.kind === 'k2b') carRef.current = null }
  }, [])
  const sig = useCallback(() => d.signals, [d]) // Deformer-Eingang (Stufe E), stabil je Wagen
  // WS1c: Wasser-VFX (Bugwelle, Kielwasser, Spritzer, Gischt, Blasen) – Eingang Wagen + Wasser-Zustand + 'water'-Ereignisse
  const fxOpts = useMemo(() => ({ car: () => ({ x: d.x, y: d.y, z: d.z, yaw: d.yaw, speed: d.speed }), water: () => W, on: (t, fn) => M2EVENTS.on(t, fn), bubbles: (...a) => waterActive.bubbles?.(...a) ?? 0, expose: (api, own) => { if (api) M2STATE.waterFx = api; else if (M2STATE.waterFx === own) M2STATE.waterFx = null } }), [d, W])
  const step = () => {
    const k = keys(), px = d.x, pz = d.z, N = NOSE, fs = M2STATE.follow?.state
    // Elan S2: erst der Flug (fliegt der Racer, ruht K2B), sonst K2B und danach die Rampen-Prüfung; Nase per Maus: Kameraneigung gegen die Grundneigung
    const fin = { gas: k.forward, brake: k.backward, left: k.leftward, right: k.rightward, jump: k.jump, boost: k.run, noseUp: (k.forward && N.upArrow) || !!k.noseUp, noseDown: (k.backward && N.downArrow) || !!k.noseDown, mousePitch: N.rmb && fs ? 0.32 - fs.wantPitch : (k.mousePitch ?? null) }
    const flew = RACER_FLY && racerFlightStep(F, d, fin, STEP, fenv)
    if (!flew) { stepK2t(d, { gas: k.forward, brake: k.backward, left: k.leftward, right: k.rightward, driftL: k.strafeL, driftR: k.strafeR, boost: k.run, jump: k.jump, tip: k.descend }, STEP, env); if (RACER_FLY) racerAfterK2t(F, d)
      if (waterActive.level) { waterAfter(W, d, { jump: k.jump }, STEP, { level: waterActive.level, carH: bc[1] + bh[1], rideH: M2TUNE.rideHeight, maxF: FLOW.maxForward, jumpImpulse: FEEL.jumpImpulse, gravity: ASSIST.flyGravity }); M2STATE.water = W } } // WS1c // Q/E = Drift (V-347, MOVE_MAP-Namen wie zu Fuß)
    M2STATE.drive = racerDrive(F, fin) || { gas: !!k.forward, brake: !!k.backward, boost: !!k.run, jump: !!k.jump, air: !!d.air } // R1a: Eingang fürs Antriebs-Modul (Gas, Boost, Sprung)
    if (RACER_FLY) ELAN_MEM.state = F.st; if (F.st) for (const e of F.st.events) ELAN_MEM.events.push({ ...e, t: M1CLOCK.steps }) // Ringkurs-Anzeige und Kessel (ElanRings)
    for (const e of d.events) M2EVENTS.emit(e)
    for (const e of F.events) M2EVENTS.emit(e) // fly { why: ramp | double } · land
    // Sicherung Ränge (V-283): landet die Automitte im Zaun-Grundriss, zurück auf den letzten Stand und abprallen (wie die Bodensicherung)
    if (inRankFence(d.x, d.z) && !inRankFence(px, pz)) { d.x = px; d.z = pz; d.speed *= -0.25; d.latV = 0; d.fenceRescues = (d.fenceRescues || 0) + 1 }
    const u = tmp.u.fromArray(d.up).normalize(), f = tmp.f.set(Math.sin(d.yaw), 0, Math.cos(d.yaw)); f.addScaledVector(u, -f.dot(u)).normalize()
    const x = tmp.x.crossVectors(u, f); tmp.m.makeBasis(x, u, f); tmp.q.setFromRotationMatrix(tmp.m); tmp.q.multiply(new THREE.Quaternion().setFromEuler(tmp.e.set(d.pitch, 0, d.roll)))
    body.current?.setNextKinematicTranslation({ x: d.x, y: d.y, z: d.z }); body.current?.setNextKinematicRotation(tmp.q)
  }
  return (
    <>
      <OnFrame fn={step} />
      {WATER_WORLD && <ModuleHost create={createWaterFx} options={fxOpts} />}
      <RigidBody ref={body} type="kinematicPosition" colliders={false} position={at.p} name="m2-car" userData={{ m2Car: true }}>
        <CuboidCollider args={bh} position={bc} />
        <CarVisual squash={() => d.squash} signals={sig} lean={() => d.lean || 0} />
      </RigidBody>
    </>
  )
}
