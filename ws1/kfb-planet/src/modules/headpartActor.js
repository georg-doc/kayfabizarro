// C2 (V-409/V-422) · Kopfteil-Figuren auf der Bühne (Lord Hunky, Lady Dory): nur über die Figurenkarte und den vendorbaren Loader
// (vendor/figure/kfb-figure-loader.v1.js). Körper zur Laufzeit von fester Adresse, sha256 gegen Karte bzw. Variante (Sockelrand 80°),
// Kopf + EyeRig v6 + E2-Lidhaut (vendor/e2/clay-skin-attach.v1.js) wie im WS0-Beweis proof_r1e.html. Passt die Prüfung nicht, steht an der
// Stelle das rote Schild (refusedFigure), nie eine stille Ersatzfigur. Mund/Brauen/Stiel-Federn folgen später (Karte: mouth decal-set, V-338).
// Knete: kein eigenes Material hier – die Bühne setzt das Figuren-Knet wie bei allen Figuren (clayLook, eingefroren bis kfb-clay.v1, V-429).
// Modul nach Host-Vertrag R1.2 mit Darsteller-Schnittstelle. options: { card, variant, figureRecipe (kfb.pets/1 + kfb.headpart/1), url?, clipsUrl, motion, classScale, position, yaw,
// anchorId, receiveShadow, where }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EyeRig } from '../vendor/eyes/pet-eye-rig.v6.js'
import { attachClaySkin, LID_SKIN_NAME } from '../vendor/e2/clay-skin-attach.v1.js'
import { applyVariant, loadFigureBody, buildHeadpartEyes, setLidState } from '../vendor/figure/kfb-figure-loader.v1.js'
import { createRefusedFigure } from './refusedFigure'
import { FACE_STEP, FACE_MAX_STEPS } from './faceMountActor'

export const headpartLog = { create: 0, update: 0, dispose: 0 }

export function createHeadpartActor(options) {
  headpartLog.create++
  const { card, variant = null, figureRecipe: recipe, url = null, clipsUrl = null, motion = 'Idle_A', classScale = null, height = 2.65, position = [0, 0, 0], yaw = 0, anchorId = null, receiveShadow = false, where = 'stage' } = options
  const root = new THREE.Group(); root.name = 'headpartActor:' + (card?.id || '?'); root.position.fromArray(position); root.rotation.y = yaw
  const head = new THREE.Object3D(); head.name = 'bubbleAnchor'; root.add(head)
  const state = { status: 'LOADING', figure: null, eyes: null, mixer: null, refused: null, sha256: null, variant: null, error: null, disposed: false, log: [] }
  const log = (m) => { state.log.push(String(m)); if (state.log.length > 40) state.log.shift() }
  const refuse = (reason) => { state.status = 'REFUSED'; state.error = reason; log('abgelehnt: ' + reason); const s = createRefusedFigure({ id: card?.id || '?', reason }); state.refused = s; root.add(s.object3d) }

  const ready = (async () => {
    const v = applyVariant(card, variant); if (!v.ok) return refuse(v.reason)
    state.variant = v.variant
    const body = await loadFigureBody({ card: v.card, url, where, GLTFLoader })
    state.sha256 = body.sha256 || null
    if (state.disposed) return
    if (!body.ok) return refuse(body.reason)
    const fig = body.gltf.scene; state.figure = fig; fig.visible = false
    fig.traverse((o) => { if (o.isMesh) o.frustumCulled = false })
    // Lid-Material des Wirts: Lidfarbe des Rezepts unverändert (WS0 16.10.: kein × 0,72), matt; das Bühnen-Knet ersetzt es wie bei allen Figuren
    const makeMat = (hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 1, metalness: 0 })
    const eyes = buildHeadpartEyes({ THREE, EyeRig, attachClaySkin, fig, recipe, makeMat }); state.eyes = eyes
    // Maß wie die KayKit-Figuren der Bühne (gleicher Klassen-Faktor Rig_Medium, sonst feste Höhe), Fußpunkt auf y = 0
    fig.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(fig), size = box.getSize(new THREE.Vector3()), s = classScale ?? height / Math.max(0.001, size.y)
    fig.scale.multiplyScalar(s); fig.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(fig), c = b2.getCenter(new THREE.Vector3())
    fig.position.x -= c.x; fig.position.z -= c.z; fig.position.y -= b2.min.y
    state.height = +(size.y * s).toFixed(3); log(`${card.id} geladen · sha ${state.sha256.slice(0, 12)} · ${state.variant?.id || 'Karten-Körper'} · Höhe ${state.height}`)
    root.add(fig)
    // V-429 ein Rig: feste Teile werfen Schatten, mit Licht-Modul empfangen sie auch; Augen, Lidhaut und Schalen (Overlay/Shader) nicht
    fig.traverse((n) => { if (!n.isMesh) return; const mt = n.material, thin = !!(n.userData.petOverlay || n.name === LID_SKIN_NAME || (mt && (mt.isShaderMaterial || mt.transparent)))
      n.castShadow = !thin; n.receiveShadow = receiveShadow && !thin })
    if (clipsUrl && motion !== 'bind') {
      const clips = await new GLTFLoader().loadAsync(clipsUrl); if (state.disposed) return
      const clip = clips.animations.find((k) => k.name === motion)
      if (clip) { state.mixer = new THREE.AnimationMixer(fig); state.mixer.clipAction(clip, fig).play(); state.mixer.update(0) }
    }
    head.position.set(0, state.height * 1.02, 0)
    state.status = 'OK'; fig.visible = true
  })().catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); log('Fehler: ' + state.error) })

  const lidSkins = () => { const out = []; state.figure?.traverse((m) => { if (m.isMesh && m.name === LID_SKIN_NAME) out.push(m) }); return out }
  return {
    object3d: root,
    bubbleAnchors: anchorId ? [{ id: anchorId, object3d: head, offset: [0, 0, 0] }] : [],
    ready,
    refused: false,
    update(dt) {
      if (state.disposed) return
      headpartLog.update++
      state.mixer?.update(dt)
      const rig = state.eyes?.rig
      if (rig) { const n = Math.min(FACE_MAX_STEPS, Math.max(1, Math.ceil(dt / FACE_STEP))), h = dt / n; for (let i = 0; i < n; i++) rig.update(h) }
    },
    say: () => null, // Mund-Decal (Karte mouth.decal-set) kommt mit dem Mund-Schritt; bis dahin spricht die Figur per Blase
    lookAt(nx, ny) { const r = state.eyes?.rig; if (!r) return; if (nx == null) r.setGazeFollow(false); else { r.setGazeFollow(true); r.pointTo(nx, ny) } },
    blinkNow() { state.eyes?.rig.blinkNow() },
    setLife(patch) { state.eyes?.rig.setLife(patch) },
    setKinetics(patch) { state.eyes?.rig.setKinetics(patch) },
    setLid(name) { return state.eyes ? setLidState(state.eyes.rig, name) : false }, // Beweis: open | rest | half | closed
    status: () => ({ status: state.status, shown: state.status === 'OK' ? !!state.figure?.visible : state.status === 'REFUSED', reason: state.error, sha256: state.sha256, variant: state.variant, height: state.height, log: state.log.slice(-8) }),
    report: () => ({ id: card?.id, status: state.status, lidSkins: lidSkins().length, v6ShellsVisible: (state.eyes?.rig.eyes || []).reduce((a, e) => a + (e._up.visible ? 1 : 0) + (e._lo.visible ? 1 : 0), 0), fit: state.eyes?.skin.fit || null }),
    debugRig: () => state.eyes?.rig ?? null,
    dispose() {
      headpartLog.dispose++; state.disposed = true
      state.mixer?.stopAllAction(); if (state.figure) state.mixer?.uncacheRoot(state.figure)
      const geos = new Set(), mats = new Set(), texs = new Set()
      root.traverse((m) => { if (!m.isMesh) return; if (m.geometry) geos.add(m.geometry); [].concat(m.material).forEach((mt) => { if (!mt) return; mats.add(mt); for (const k in mt) if (mt[k]?.isTexture) texs.add(mt[k]) }) })
      state.eyes?.skin.detach?.(); state.eyes?.rig.dispose(); state.refused?.dispose()
      geos.forEach((g) => g.dispose()); texs.forEach((t) => t.dispose()); mats.forEach((m) => m.dispose())
      root.clear()
    },
  }
}
