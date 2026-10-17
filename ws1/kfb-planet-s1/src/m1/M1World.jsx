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
import { Physics, RigidBody, TrimeshCollider, ConvexHullCollider, CuboidCollider, CylinderCollider, CoefficientCombineRule, useRapier } from '@react-three/rapier'
import ModuleHost from '../ModuleHost'
import { StageOrbitCam, ORBIT } from '../StageOrbitCam'
import { KAYKIT, FB } from '../actors/stageCast'
import M1Loop from './M1Loop'
import M1Player, { FOOT, START, M1INPUT, M1MOVE, M1BOUNDS, M1CAM } from './M1Player'
import { STAGE_CAMS, STAGE_MARKS } from '../Stage'
import { M1CLOCK, STEP } from './m1Clock'
import { trimeshOf, amphModelOf, worldPosOf, trackDialog, keyList, rankFence, FENCE_TAG, rampVerts } from './m1Host'
import { createSky, skyLog } from '../modules/m1-sky'
import { createTerrain, TERRAIN, terrainLog } from '../modules/m1-terrain'
import { createAmphitheater, amphLog } from '../modules/amphitheater'
import { locoActorLog } from '../modules/m1-locoActor'
import { faceActorLog } from '../modules/faceMountActor'
import { eyeActorLog } from '../modules/eyeActor'
import { createBillboard, BIOMES, billboardLog } from '../modules/billboard'
import { createActor } from '../actors/actorSlot'
import { createDialog } from '../modules/dialog'
import BubbleHost from '../BubbleHost'
import ChoiceHost from '../ChoiceHost'
import { getReader, isPoolReady } from '../dialogText'
import { useGame } from '../store'
import { DECKS, cardAt, cardsOfDeck } from '../cards'
import { useHostKeys, PRIO, ACTION_KEYS } from '../hostKeys'
import { expose, DEBUG } from '../debug'
import clipsGeneral from '../assets/actors/Rig_Medium_General.glb?url'
import clipsMove from '../assets/actors/Rig_Medium_MovementBasic.glb?url'

const hash = typeof location !== 'undefined' ? location.hash : ''
const BIOME = BIOMES[1] // wie #stage (Moos-Insel), bis WS0 Biom/Kartenzone der Bühne festlegt (§14.4)
// Bühnenkamera und Marken = Standard der Bühne (Stage.jsx STAGE_CAMS.near / STAGE_MARKS.near, Georg 14.10. „near nehmen“, §20) – übernommen.
// Brennweite wie #stage (Stage.jsx Cam: fov 38).
const STAGE_CAM = STAGE_CAMS.near, STAGE_FOV = 38
const STAGE_VIEW = { pos: STAGE_CAM.pos, target: STAGE_CAM.target, fov: STAGE_FOV }
const MK = (m) => [m.x, m.z, m.yaw]
const MARK = { left: MK(STAGE_MARKS.near.left), right: MK(STAGE_MARKS.near.right) }
const STAGE_TRIGGER = { r: 6.2, leaveR: 9.5, maxDy: 0.9 } // Bühnenfläche ≈ 14 m (Innenkreis); Auslösen innerhalb 6,2 m um die Mitte, nur am Boden
const NCARDS = Math.max(1, +(/cards=(\d+)/.exec(hash)?.[1] || 2))
const di = DECKS.findIndex((d) => d.id === 'forget_utopia')
const DECK = di >= 0 ? cardsOfDeck(di).map(cardAt).filter((c) => c.num >= 1).slice(0, NCARDS) : []

// Spieler = FrizzleBob aus derselben Besetzung wie #stage (actors/stageCast FB, V-206; Prüfer M1-5 Befund N5) – ohne Bühnen-Lage und Clips der Bühne:
// Lage führt ecctrl, Clips lädt der Darsteller-Slot (CLIP_URLS)
const { clipsUrl: _c, motion: _m, position: _p, yaw: _y, ...FB_OPTS } = FB(0, 0, 'stage-left')
const PLAYER_ACTOR = FB_OPTS
// Partner (V-269, Georg 15.10.): GothGirl wie in #stage – gleiche Besetzung über actors/stageCast (V-206), Lage = rechte Marke
const PARTNER = { ...KAYKIT('gothgirl')(MARK.right[0], MARK.right[2], 'stage-right'), position: [MARK.right[0], 0, MARK.right[1]] }
const CLIP_URLS = [clipsMove, clipsGeneral]
const SKY = { variant: 'S', mode: 3 }
const TERR = { biome: BIOME }
const AMPH = { biome: BIOME, groundR: 0.01 } // Boden kommt vom Gelände (gleiche Höhe −0,125 m), kein zweiter Boden
const BB = { card: DECK[0] || null, biome: BIOME, maxW: 7, maxH: 5, position: [0, 0, -3.5] }

const mods = {}
const mk = (k, f) => (o) => { mods[k] = f(o); return mods[k] }
const makeSky = mk('sky', createSky), makeTerrain = mk('terrain', createTerrain), makeAmph = mk('amph', createAmphitheater), makeBB = mk('billboard', createBillboard), makePartner = mk('partner', createActor)

export const M1STATE = { phase: 'free', cooldown: false, dialogs: 0, amphTris: 0, lastDialog: null, lastLog: null }
const resetState = () => { for (const k of Object.keys(mods)) delete mods[k]; Object.assign(M1STATE, { phase: 'free', cooldown: false, dialogs: 0, amphTris: 0, lastDialog: null, lastLog: null }); M1INPUT.override = null; M1CLOCK.onStep = null } // Takt nicht zurücksetzen: M1Loop läuft weiter (Bildzähler), Schritte zählt nur die Physik

// Host: Licht, Nebel, Hintergrund. Sonne folgt der Figur (Schattenausschnitt), Nebel/Hintergrund = Horizontfarbe der Kuppel.
function HostEnv() {
  const { scene } = useThree()
  const sun = useRef(), tgt = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    const c = mods.sky?.horizonColor?.() || new THREE.Color('#bcd7ea')
    scene.background = c.clone(); scene.fog = new THREE.Fog(c.clone(), 140, 620)
    scene.add(tgt); if (sun.current) sun.current.target = tgt
    return () => { scene.fog = null; scene.background = null; scene.remove(tgt) }
  }, [scene, tgt])
  useFrame(() => {
    const p = worldPosOf(mods.player); if (!p || !sun.current) return
    tgt.position.copy(p); sun.current.position.set(p.x + 18, p.y + 30, p.z + 22)
  })
  return (
    <>
      <hemisphereLight args={[0xfff4e0, 0x3a3226, 1.25]} />
      <directionalLight ref={sun} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-far={120} shadow-bias={-0.0002} />
    </>
  )
}

// Physik-Schritt: genau einer je Durchlauf, als ERSTER Bild-Handler in der Physik (vor Figur und ecctrl). Zuschlag 1e-9: Rapiers Akkumulator
// (Gleitkomma) ließe sonst gelegentlich einen Schritt aus und machte im nächsten Durchlauf zwei.
function Stepper() {
  const { step } = useRapier()
  useFrame(() => { M1CLOCK.steps++; step(STEP + 1e-9) })
  return null
}

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
      {amph && <RigidBody type="fixed" colliders={false} name="m1-amph"><TrimeshCollider args={[amph.vertices, amph.indices]} /></RigidBody>}
      {bb && <RigidBody type="fixed" colliders={false} name="m1-billboard" position={bb.c}><CuboidCollider args={bb.h} /></RigidBody>}
      <RigidBody type="fixed" colliders={false} name="m1-ramp"><ConvexHullCollider args={[RAMP]} /></RigidBody>
      <RigidBody type="fixed" colliders={false} name="m1-partner" position={[MARK.right[0], 1, MARK.right[1]]}><CylinderCollider args={[1, 0.35]} /></RigidBody>
      {!NOFENCE && <RigidBody type="fixed" colliders={false} name={FENCE_TAG} userData={{ tag: FENCE_TAG, ecctrl: { excludeRay: true } }}>{FENCE.map((c, i) => <ConvexHullCollider key={i} args={[c.verts]} friction={0} frictionCombineRule={CoefficientCombineRule.Max} />)}</RigidBody>}
    </>
  )
}

// Wurzel mit Abbau-Schalter für den Vertragstest (nur mit Debug): window.__kfbM1Root.off() hängt die ganze Szene aus. Die Schleife bleibt.
export default function M1Root() {
  const [on, setOn] = useState(true)
  useEffect(() => { expose('M1Root', { off: () => setOn(false), on: () => setOn(true) }) }, [])
  return <>{on ? <M1World /> : null}<M1Loop /></>
}

function M1World() {
  const player = useRef(null)
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
    const cc = player.current?.camera(), p = worldPosOf(mods.player), c = camera.position, t = orbitTarget || new THREE.Vector3(p?.x ?? 0, (p?.y ?? 0) + 1.3, p?.z ?? 0)
    if (cc && p) { cc.setLookAt(c.x, c.y, c.z, t.x, t.y, t.z, false); cc.setLookAt(p.x, p.y + 3.2, p.z + 7.5, p.x, p.y + 1.3, p.z, true) }
    Object.assign(fovBlend.current, { on: true, from: camera.fov, to: M1CAM.fov, t: 0 })
  }, [camera])
  const startDialog = useCallback(() => {
    if (M1STATE.phase !== 'free' || !player.current) return
    M1STATE.phase = 'dialog'; M1STATE.dialogs++; mods.dialog = null; queueMicrotask(() => { setPhase('dialog'); setSession((n) => n + 1) })
    player.current.freeze(true)
    player.current.teleport([MARK.left[0], FOOT + 0.02, MARK.left[1]], MARK.left[2])
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
  const makeDialog = useCallback((o) => trackDialog(createDialog({ ...o, reader: { lineFor: (...a) => o.reader.lineFor(...a), silence: () => o.reader.silence() } }), mods), [])

  useEffect(() => {
    if (!DEBUG) return
    expose('M1', {
      mods, state: M1STATE, clock: M1CLOCK, input: (o) => { M1INPUT.override = o }, player: () => player.current,
      status: () => ({ phase: M1STATE.phase, amphReady, amphTris: M1STATE.amphTris, player: mods.player?.status(), partner: mods.partner?.status().status, terrain: mods.terrain?.info(), sky: mods.sky?.info(),
        pos: worldPosOf(mods.player)?.toArray(), dialog: mods.dialog?.state?.() ?? null, lastDialog: M1STATE.lastDialog, camera: camera.position.toArray(), cameraDir: camera.getWorldDirection(new THREE.Vector3()).toArray(), fov: camera.fov,
        ready: { pool: isPoolReady(), card: mods.billboard?.info()?.source ?? null, player: mods.player?.status().status, partner: mods.partner?.status().status, partnerShown: mods.partner?.status().shown },
        keysShown: keysUi.current?.shown?.() ?? null }),
      feet: () => worldPosOf(mods.player)?.toArray(), fence: { on: !NOFENCE }, startDialog, endDialog, move: M1MOVE, bounds: M1BOUNDS, start: START, terrainH: (x, z) => mods.terrain?.height(x, z), trigger: STAGE_TRIGGER,
      logs: () => ({ sky: { ...skyLog }, terrain: { ...terrainLog }, amph: { ...amphLog }, billboard: { create: billboardLog.create, update: billboardLog.update, dispose: billboardLog.dispose }, loco: { ...locoActorLog },
        face: { create: faceActorLog.create, update: faceActorLog.update, dispose: faceActorLog.dispose, lastCtx: faceActorLog.lastCtx },
        eye: { create: eyeActorLog.create, update: eyeActorLog.update, dispose: eyeActorLog.dispose, lastCtx: eyeActorLog.lastCtx }, three: THREE.REVISION }), // eye = KayKit-Partner (V-269)
    })
  }, [amphReady, camera, startDialog, endDialog])

  return (
    <>
      <HostEnv />
      <ModuleHost create={makeSky} options={SKY} />
      <ModuleHost create={makeTerrain} options={TERR} />
      <ModuleHost create={makeAmph} options={AMPH} />
      <ModuleHost create={makeBB} options={BB} />
      <ModuleHost create={makePartner} options={PARTNER} />
      <Suspense fallback={null}>{/* Rapier lädt asynchron: eigene Grenze, damit die Hüllen davor nicht verworfen und doppelt erzeugt werden (Prüfer M1, Befund 3) */}
      <Physics gravity={[0, -14, 0]} timeStep={1 / 60} paused>
        <Stepper />
        <Colliders ready={amphReady} />
        <M1Player ref={player} actorOptions={PLAYER_ACTOR} clipUrls={CLIP_URLS} onMod={onPlayer} />
      </Physics>
      </Suspense>
      <StageOrbitCam ref={orbit} view={STAGE_VIEW} active={phase === 'dialog'} />
      {phase === 'dialog' && <ModuleHost key={session} create={makeDialog} options={dialogOpts} />}
      <BubbleHost />
      <ChoiceHost />
    </>
  )
}
export { TERRAIN }
