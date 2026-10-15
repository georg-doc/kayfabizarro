// Meshy-Bühnen mit Bildfläche (V-256, V-265, V-268) als Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose }.
// Eine Bühne = Browser-Fassung (WS0-Asset-Branch, gepinnter Commit) + Slot-Datei (*.slot.json, WS0): Maßstab s (m/u), Bühnen-Umrechnung
// p_m = (x·s, (y − floorY)·s, z·s) mit Bodenmitte im Ursprung, Bildfläche `kfb_screen_slot` (Mesh im Modell, UV flipY = false), Standardkamera.
// Der Träger ist hier die Bildfläche im Modell selbst (kein Billboard davor, V-256). Den Inhalt (Karte) setzt das Inhalts-Modul darauf;
// `surface` ist dieselbe Schnittstelle wie beim Billboard: { mesh, fit(meta) → info, flipY: false }.
// Erste Bühnen (Vorschau, Georg 15.10.): Comic-Broadcast (PASS V-268) und Utopia-Bühne (Fix nach TUNE, Abnahme offen).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import comicSlot from '../data/stages/kfb-meshy-comic-broadcast.screen-a.v1.slot.json'
import utopiaSlot from '../data/stages/kfb-meshy-utopia-stage.screen-a.v1.slot.json'

const ASSET_COMMIT = '8ce77addef0fce73216ba4f1704dcfcc7ee6149a' // Branch assets/meshy-stages-utopia-comic-2026-10-15
const raw = (file) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${ASSET_COMMIT}/media/3D_Assets/MeshyModels/browser/${file}`
// Bodenhöhe aus der Umrechnungs-Vorschrift der Slot-Datei („(y + 0,491)“) – keine eigene Zahl
const floorOf = (slot) => -parseFloat(/\(y \+ ([\d.,]+)\)/.exec(slot.slot.stageTransform)[1].replace(',', '.'))
const stageOf = (id, slot) => ({ id, url: raw(slot.file), sha256: slot.sha256, bytes: slot.bytes, slot, s: slot.scale_m_per_u, floorY: floorOf(slot) })
export const MESHY_STAGES = Object.freeze({ comic: stageOf('comic', comicSlot), utopia: stageOf('utopia', utopiaSlot) })
export const meshyLog = { create: 0, update: 0, dispose: 0, freed: null }

// Standardkamera der Slot-Datei in Bühnenmetern
// sOverride: Maßstab zum Abstimmen (Georg 15.10.: Figuren im Comic-Diorama zu groß → Bühne größer statt Figuren kleiner, Klassengröße bleibt)
export function stageCamera(st, sOverride = null) {
  const s = sOverride || st.s, c = st.slot.defaultCamera, m = (p) => [p[0] * s, (p[1] - st.floorY) * s, p[2] * s]
  return { pos: m(c.pos), target: m(c.target), fov: c.fovV_deg, note: c.note }
}

// options: { stage: 'comic' | 'utopia', scale? (m/u, Abstimm-Wert statt Slot-Datei) }
export function createMeshyStage(options = {}) {
  const st0 = MESHY_STAGES[options.stage], st = st0 && options.scale ? { ...st0, s: options.scale } : st0
  if (!st) throw new Error('MESHY_STAGE_UNKNOWN: ' + options.stage)
  meshyLog.create++
  const root = new THREE.Group(); root.name = 'meshy-stage:' + st.id
  const state = { status: 'LOADING', error: null, info: null, disposed: false, slotMesh: null, surfaceInfo: null }
  const ready = new GLTFLoader().loadAsync(st.url).then((g) => {
    if (state.disposed) return null
    const m = g.scene; m.name = 'meshy-model:' + st.id
    m.scale.setScalar(st.s); m.position.set(0, -st.floorY * st.s, 0)
    m.traverse((o) => { if (o.isMesh) { o.receiveShadow = true; o.castShadow = false } })
    const slotMesh = m.getObjectByName(st.slot.slot.mesh) || m.getObjectByName(st.slot.slot.node)
    let mesh = null; slotMesh?.traverse((o) => { if (!mesh && o.isMesh) mesh = o })
    if (mesh) { // Platzhalter-Farbe (#1A212E) würde die Karte einfärben: Fläche weiß und ungetönt, Inhalt kommt als Textur
      mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }); mesh.name = 'screen'
    }
    state.slotMesh = mesh
    root.add(m); root.updateMatrixWorld(true)
    let tris = 0; m.traverse((o) => { if (o.isMesh) tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3 })
    const box = new THREE.Box3().setFromObject(m)
    state.info = { stage: st.id, scale: st.s, floorY: st.floorY, tris, size: box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(2)), slot: !!mesh, aspect: st.slot.targetAspect }
    state.status = mesh ? 'OK' : 'SLOT_MISSING'; return state.info
  }).catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); return null })

  // Bildfläche als Träger: festes Format (targetAspect ≈ 1,79), der Inhalt füllt sie; anderes Format → Hinweis (nie beschneiden, V-256)
  const surface = {
    get mesh() { return state.slotMesh || new THREE.Mesh() }, flipY: false,
    fit(meta) { state.surfaceInfo = { source: meta.source, aspect: +meta.aspect.toFixed(4), slotAspect: st.slot.targetAspect, fills: Math.abs(meta.aspect - st.slot.targetAspect) < 0.02, canvas: meta.canvas, card: meta.card }; return state.surfaceInfo },
  }
  return {
    object3d: root,
    ready,
    stage: st,
    surface,
    status: () => ({ status: state.status, error: state.error, info: state.info, surface: state.surfaceInfo }),
    update() { meshyLog.update++ },
    dispose() {
      meshyLog.dispose++; state.disposed = true
      const geos = new Set(), mats = new Set(), texs = new Set()
      root.traverse((o) => { if (!o.isMesh) return; geos.add(o.geometry); [].concat(o.material).forEach((mt) => { mats.add(mt); for (const k in mt) if (mt[k]?.isTexture) texs.add(mt[k]) }) })
      geos.forEach((x) => x.dispose()); mats.forEach((x) => x.dispose()); texs.forEach((x) => x.dispose())
      meshyLog.freed = { geometries: geos.size, materials: mats.size, textures: texs.size }
      root.clear()
    },
  }
}
