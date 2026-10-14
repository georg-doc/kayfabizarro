// F1 · KFB-Figur mit KFB-Eye-Rig (Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), dispose() }).
// Gesichts-Treiber KFB_NATIVE (V-217/V-227/V-228): das Eye-Rig besitzt Augen, Lider, Pupillen, Blick.
// Vorlage 1:1 = Georgs Studio „KFB Batch EyeRig Atlas“ (kfb-hub/stage/toolbox/eye-rig-batch, Branch cloudflare-live), Ablauf aus
// app.js loadActor() Z. 935–1000: Figur laden → normalizeActor() (2,65 hoch) → prepareMediumActorCleanup().apply(true) →
// mountKayKitEyes() (kaykit-eye-adapter.v1.js: facehost.v1 + pet-eye-rig.v6 + eyeoval.v1) → ggf. sampleActorFaceColor().
// Die Anker-Drehung wird NICHT übernommen (V-201): Der Studio-Weg nimmt aus Ankern nur dx/dy/ring, das Eye-Rig blickt geradeaus.
// Werte = Georgs Profil aus eye-rig-medium.batch-1.json (19.09.), unverändert. Kein React, kein Store (Vertrag §2).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mountKayKitEyes } from '../vendor/eyes/kaykit-eye-adapter.v1.js'
import { prepareMediumActorCleanup } from '../vendor/eyes/medium-source-eye-cleanup.v1.js'
import { sampleActorFaceColor } from '../vendor/eyes/face-color-sampler.v1.js'

const CLEANUP_READY = ['AUTO_CANDIDATE', 'SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE', 'AUTO_CANDIDATE_GENERIC'] // app.js Z. 959

// app.js normalizeActor(), unverändert bis auf den Parameter height (Studio: fest 2,65)
function normalizeActor(figure, height) {
  figure.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(figure), size = box.getSize(new THREE.Vector3())
  const scale = height / Math.max(0.001, size.y)
  figure.scale.multiplyScalar(scale); figure.updateMatrixWorld(true)
  const b2 = new THREE.Box3().setFromObject(figure), center = b2.getCenter(new THREE.Vector3())
  figure.position.x -= center.x; figure.position.z -= center.z; figure.position.y -= b2.min.y
  figure.updateMatrixWorld(true)
  return { sourceHeight: +size.y.toFixed(3), scale: +scale.toFixed(5) }
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

// options: { url, clipsUrl?, motion: 'bind'|Clipname, profile, contract, actor: { id, path, revision }, height, position, yaw, anchorId }
export function createEyeActor(options) {
  const { url, clipsUrl = null, motion = 'bind', contract, actor, height = 2.65, position = [0, 0, 0], yaw = 0, anchorId = null } = options
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
    const figure = gltf.scene; state.figure = figure; root.add(figure)
    const norm = normalizeActor(figure, height); log(`${actor.id} geladen · ${norm.sourceHeight} → ${height}`)
    const cleanup = prepareMediumActorCleanup({ THREE, figure, actor, log }); state.cleanup = cleanup
    const cleanupOk = CLEANUP_READY.includes(cleanup.status); if (cleanupOk) cleanup.apply(true)
    profile.sourceFace = { ...profile.sourceFace, ...JSON.parse(JSON.stringify(cleanup.report || {})) }
    state.mixer = new THREE.AnimationMixer(figure)
    const eyes = await mountKayKitEyes({ THREE, figure, sourceRef: { repo: 'georg-doc/kayfabizarro', path: actor.path, revision: actor.revision }, profile, expressionContract: contract, camera: null, log })
    state.eyes = eyes
    if (needsAutoFaceColor(profile)) {
      const fc = sampleActorFaceColor({ THREE, figure, faceHost: eyes.faceHost, anchor: profile.eye?.anchor, preferredHeadMesh: cleanup.report?.headMesh || profile.sourceFace?.headMesh, log })
      if (fc.status === 'OK') { profile.sourceFace.faceColor = fc.color; profile.eye.baseColor = fc.color; eyes.setBaseColor(fc.color) }
    }
    if (clipsUrl && motion !== 'bind') {
      const clips = await loader.loadAsync(clipsUrl)
      const clip = clips.animations.find((c) => c.name === motion)
      if (clip) state.mixer.clipAction(clip, figure).play()
    }
    // Blasen-Anker knapp über dem Kopf (Figur steht auf y = 0, Höhe = height)
    head.position.set(0, height * 1.02, 0)
    state.status = eyes.eyeFrame() ? 'OK' : 'EYES_MISSING'
    state.cleanupStatus = cleanup.status
  })().catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); log('Fehler: ' + state.error) })

  return {
    object3d: root,
    bubbleAnchors: anchorId ? [{ id: anchorId, object3d: head, offset: [0, 0, 0] }] : [],
    ready,
    update(dt) {
      if (state.disposed) return
      state.mixer?.update(dt)
      state.eyes?.update(dt)
    },
    // Blickziel in Bildschirmkoordinaten des Eye-Rigs (−1…1); null = „life“ (Studio-Standard)
    lookAt(nx, ny) { if (!state.eyes) return; if (nx == null) state.eyes.setGazeFollow(false); else { state.eyes.setGazeFollow(true); state.eyes.setPointer(nx, ny) } },
    blinkNow() { state.eyes?.blinkNow() },
    expression(id) { return state.eyes?.applyExpression(id) },
    status: () => ({ status: state.status, cleanup: state.cleanupStatus, error: state.error, log: state.log.slice(-8) }),
    report: () => state.eyes?.report() ?? null,
    debugRig: () => state.eyes?.rig ?? null, // nur Prüfungen (Bildpaar Lid geschlossen)
    dispose() {
      state.disposed = true
      state.mixer?.stopAllAction()
      state.eyes?.dispose(); state.cleanup?.dispose?.()
      root.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { for (const k in m) if (m[k]?.isTexture) m[k].dispose(); m?.dispose?.() }) } })
      root.clear()
    },
  }
}
