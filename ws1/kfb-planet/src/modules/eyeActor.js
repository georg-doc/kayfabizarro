// F1 · KFB-Figur mit KFB-Eye-Rig (Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), dispose() }).
// Gesichts-Treiber KFB_NATIVE (V-217/V-227/V-228): das Eye-Rig besitzt Augen, Lider, Pupillen, Blick.
// Vorlage 1:1 = Georgs Studio „KFB Batch EyeRig Atlas“ (kfb-hub/stage/toolbox/eye-rig-batch, Branch cloudflare-live @db823766, 03.10.).
// Nur diese Fassung kennt Rogue_Hooded (55 Figuren); die von WS0 genannte Fassung work/hub-ux-v2-masterplan @5c3334bd (22.09.) hat
// 27 Figuren ohne Adventurers. Georgs Profil trägt eyeProfileVisuallyApproved: true (front, bind). Ablauf aus
// app.js loadActor() Z. 935–1000: Figur laden → normalizeActor() (2,65 hoch) → prepareMediumActorCleanup().apply(true) →
// mountKayKitEyes() (kaykit-eye-adapter.v1.js: facehost.v1 + pet-eye-rig.v6 + eyeoval.v1) → ggf. sampleActorFaceColor().
// Nicht übernommen (für Rogue_Hooded ohne Wirkung, bei anderen Figuren zu prüfen): applyActorTextureOverride, sourceAnchorSeed/
// applyPlacementCandidate (nur bei UNREVIEWED), poseBind (skeleton.pose), setStageLook/markNoClay (Studio-Bühnenlook).
// Die Anker-Drehung wird NICHT übernommen (V-201): Der Studio-Weg nimmt aus Ankern nur dx/dy/ring, das Eye-Rig blickt geradeaus.
// Werte = Georgs Profil aus eye-rig-medium.batch-1.json (19.09.), unverändert. Kein React, kein Store (Vertrag §2).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mountKayKitEyes } from '../vendor/eyes/kaykit-eye-adapter.v1.js'
import { prepareMediumActorCleanup } from '../vendor/eyes/medium-source-eye-cleanup.v1.js'
import { sampleActorFaceColor } from '../vendor/eyes/face-color-sampler.v1.js'
import { FACE_STEP, FACE_MAX_STEPS } from './faceMountActor'

const CLEANUP_READY = ['AUTO_CANDIDATE', 'SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE', 'AUTO_CANDIDATE_GENERIC'] // app.js Z. 959

// app.js normalizeActor(), unverändert bis auf den Parameter height (Studio: fest 2,65)
// classScale (optional): fester Klassen-Faktor statt Höhen-Normierung – gleiche Skelettklasse, gleicher Maßstab (Rig_Medium wie FrizzleBob, CLASS_K)
function normalizeActor(figure, height, classScale = null) {
  figure.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(figure), size = box.getSize(new THREE.Vector3())
  const scale = classScale ?? height / Math.max(0.001, size.y)
  figure.scale.multiplyScalar(scale); figure.updateMatrixWorld(true)
  const b2 = new THREE.Box3().setFromObject(figure), center = b2.getCenter(new THREE.Vector3())
  figure.position.x -= center.x; figure.position.z -= center.z; figure.position.y -= b2.min.y
  figure.updateMatrixWorld(true)
  return { sourceHeight: +size.y.toFixed(3), scale: +scale.toFixed(5), height: +(size.y * scale).toFixed(3) }
}
// app.js needsAutoFaceColor(), unverändert
function needsAutoFaceColor(profile) {
  if (!profile) return false
  const explicit = profile.sourceFace?.faceColor, source = profile.sourceFace?.faceColorSource
  const base = String(profile.eye?.baseColor || '').toLowerCase()
  if (source === 'catalog-explicit' && explicit) return false
  if (source === 'AUTO_SOURCE_HEAD' || source === 'generic-fallback-unverified' || source === 'runtime-head-texture-sample') return true
  if (!explicit) return true
  return base === '#b58f83'
}

// Zähler für den Vertragstest (Muster probeModule/test/host.mjs)
export const eyeActorLog = { create: 0, update: 0, dispose: 0, lastCtx: null, freed: null }

// options: { url, clipsUrl?, motion: 'bind'|Clipname, profile, contract, actor: { id, path, revision }, height | classScale, position, yaw, anchorId }
export function createEyeActor(options) {
  eyeActorLog.create++
  const { url, clipsUrl = null, motion = 'bind', contract, actor, height = 2.65, classScale = null, position = [0, 0, 0], yaw = 0, anchorId = null } = options
  const profile = JSON.parse(JSON.stringify(options.profile)) // Studio arbeitet auf einer Kopie (ensureProfile)
  const root = new THREE.Group(); root.name = 'eyeActor:' + actor.id
  root.position.fromArray(position); root.rotation.y = yaw
  const head = new THREE.Object3D(); head.name = 'bubbleAnchor'; root.add(head) // Blasen-Anker, wird nach dem Laden über den Kopf gesetzt
  const state = { status: 'LOADING', figure: null, eyes: null, cleanup: null, mixer: null, log: [], error: null, disposed: false }
  const log = (m) => { state.log.push(String(m)); if (state.log.length > 40) state.log.shift() }

  const ready = (async () => {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url)
    if (state.disposed) return
    const figure = gltf.scene; state.figure = figure
    const norm = normalizeActor(figure, height, classScale); state.height = norm.height; log(`${actor.id} geladen · ${norm.sourceHeight} → ${norm.height}${classScale ? ' (Klassen-Faktor ' + classScale + ')' : ''}`) // vor dem Einhängen: Welt = lokal wie im Studio (stageRoot im Ursprung)
    // Aufbau mit Weltdrehung 0 (wie faceMountActor, ToolBox-Befund A15): der Gesichts-Halter richtet sich beim Mounten an der Welt aus;
    // eine gedrehte Figur trüge das Augen-Rig sonst um ihren Winkel verdreht. Die eigene Drehung kommt erst nach dem Aufbau zurück.
    const q0 = root.quaternion.clone(), pq = new THREE.Quaternion(); if (root.parent) root.parent.getWorldQuaternion(pq)
    root.quaternion.copy(pq.invert()); root.updateWorldMatrix(true, true)
    root.add(figure)
    const cleanup = prepareMediumActorCleanup({ THREE, figure, actor, log }); state.cleanup = cleanup
    const cleanupOk = CLEANUP_READY.includes(cleanup.status); if (cleanupOk) cleanup.apply(true)
    profile.sourceFace = { ...profile.sourceFace, ...JSON.parse(JSON.stringify(cleanup.report || {})) }
    state.mixer = new THREE.AnimationMixer(figure)
    const eyes = await mountKayKitEyes({ THREE, figure, sourceRef: { repo: 'georg-doc/kayfabizarro', path: actor.path, revision: actor.revision }, profile, expressionContract: contract, camera: null, log })
    state.eyes = eyes
    if (state.disposed) { eyes.dispose(); return }
    if (needsAutoFaceColor(profile)) {
      const fc = sampleActorFaceColor({ THREE, figure, faceHost: eyes.faceHost, anchor: profile.eye?.anchor, preferredHeadMesh: cleanup.report?.headMesh || profile.sourceFace?.headMesh, log })
      if (fc.status === 'OK') { profile.sourceFace.faceColor = fc.color; profile.eye.baseColor = fc.color; eyes.setBaseColor(fc.color) }
    }
    if (clipsUrl && motion !== 'bind') {
      const clips = await loader.loadAsync(clipsUrl)
      if (state.disposed) return
      const clip = clips.animations.find((c) => c.name === motion)
      if (clip) state.mixer.clipAction(clip, figure).play()
    }
    root.quaternion.copy(q0); root.updateWorldMatrix(true, true) // Aufbau fertig: eigene Drehung zurück
    // Blasen-Anker knapp über dem Kopf (Figur steht auf y = 0, Höhe = height)
    head.position.set(0, (state.height ?? height) * 1.02, 0)
    state.status = eyes.eyeFrame() ? 'OK' : 'EYES_MISSING'
    state.cleanupStatus = cleanup.status
  })().catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); log('Fehler: ' + state.error) })

  return {
    object3d: root,
    bubbleAnchors: anchorId ? [{ id: anchorId, object3d: head, offset: [0, 0, 0] }] : [],
    ready,
    update(dt, ctx) {
      if (state.disposed) return
      eyeActorLog.update++; eyeActorLog.lastCtx = { hasCam: !!ctx?.camera, hasPlayer: !!ctx?.player, hasGame: !!ctx?.game }
      state.mixer?.update(dt)
      // Augen in Teilschritten ≤ FACE_STEP wie faceMountActor (ToolBox-Befund A13): die Pupillen-Feder von pet-eye-rig.v6 schwingt bei langen
      // Bildern auf; auf der Bühne standen die Pupillen nach einem Blickwechsel außerhalb des Auges (_px −0,174 bei Grenze 0,111, weiße Augen).
      if (state.eyes) { const n = Math.min(FACE_MAX_STEPS, Math.max(1, Math.ceil(dt / FACE_STEP))), h = dt / n; for (let i = 0; i < n; i++) state.eyes.update(h) }
    },
    // Blickziel in Bildschirmkoordinaten des Eye-Rigs (−1…1); null = „life“ (Studio-Standard)
    lookAt(nx, ny) { if (!state.eyes) return; if (nx == null) state.eyes.setGazeFollow(false); else { state.eyes.setGazeFollow(true); state.eyes.setPointer(nx, ny) } },
    blinkNow() { state.eyes?.blinkNow() },
    setLife(patch) { state.eyes?.setLife(patch) },
    setKinetics(patch) { state.eyes?.setKinetics(patch) },
    expression(id) { return state.eyes?.applyExpression(id) },
    status: () => ({ status: state.status, cleanup: state.cleanupStatus, error: state.error, log: state.log.slice(-8) }),
    report: () => state.eyes?.report() ?? null,
    debugRig: () => state.eyes?.rig ?? null, // nur Prüfungen (Bildpaar Lid geschlossen)
    debugParts: () => [root, state.eyes?.rig?.rig, state.eyes?.faceHost?.box, state.eyes?.faceHost?.inner].filter(Boolean), // nur Prüfungen (Freigabe)
    dispose() {
      eyeActorLog.dispose++
      state.disposed = true
      state.mixer?.stopAllAction(); state.mixer?.uncacheRoot(state.figure || root)
      // Erst alles einsammeln (Figur, Eye-Rig, FaceHost), dann aushängen: pet-eye-rig.v6 dispose() hängt nur aus (Z. 341),
      // danach wären Rig und FaceHost für root.traverse nicht mehr erreichbar (blinder Prüfer 4, Befund 1).
      const geos = new Set(), mats = new Set(), texs = new Set()
      const collect = (o) => o?.traverse?.((m) => { if (!m.isMesh) return; if (m.geometry) geos.add(m.geometry); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => { if (!mt) return; mats.add(mt); for (const k in mt) if (mt[k]?.isTexture) texs.add(mt[k]) }) })
      collect(root); collect(state.eyes?.rig?.rig); collect(state.eyes?.faceHost?.box); collect(state.eyes?.faceHost?.inner)
      state.eyes?.dispose(); state.cleanup?.dispose?.()
      geos.forEach((g) => g.dispose()); texs.forEach((t) => t.dispose()); mats.forEach((m) => m.dispose())
      eyeActorLog.freed = { geometries: geos.size, materials: mats.size, textures: texs.size }
      root.clear()
    },
  }
}
