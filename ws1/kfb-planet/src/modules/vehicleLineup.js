// L2 Schritt 3 (V-340) · Aufstellung aller 14 Dieselpunk-Fahrzeuge (v3, V-321) auf einer eigenen Fläche, Modul nach Host-Vertrag R1.2.
// Quelle: Branch assets/meshy-arcade3-marble-vehicles3-2026-10-16 @9bd8e037, media/3D_Assets/MeshyModels/vehicles/<id>/<id>_browser.v3.glb.
// Die GLBs sind in KayKit-Rig-Einheiten normiert (Front +Z, Boden y = 0, Figuren 1:1). Umrechnung in Bühnenmeter über rigToStage() (Stage: gemessene
// FB-Höhe / 2,94 Rig, WS0-Maß FB v5b mit Ohren), damit Fahrzeuge und Figuren im richtigen Verhältnis stehen (Größenblatt 05_v3_groessenvergleich).
// Zwei Reihen à 7, Front zur Kamera, Abstand nach Breite; nur Material wird später umgestellt (Knet `vehicle`, V-336), keine Netzänderung.
// options: { ids?, figure: () => FB-Modul (Maßstab = seine Höhe / 2,94 Rig), rows = 2, gap = 0.9 (m) }
export const FB_RIG_HEIGHT = 2.94 // WS0 V-311: FB_TEMPLATE_LOOK_v5b misst 2,94 Rig = 1,81 m mit Ohren
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const VEHICLE_COMMIT = '9bd8e0376105b29375377ea3052e33528d50fbb6'
export const VEHICLE_IDS = Object.freeze(['crimson_flame_dragster', 'brasswing_roadster', 'crimson_thunderjet', 'graffiti_jet_cruiser', 'iron_phantom_hovercar', 'ironclad_skycruiser', 'ironclad_wrecker',
  'jetbound_roadster', 'rust_runner', 'rustfire_interceptor', 'rustwing_cruiser', 'rustwing_hauler', 'street_racer_hoverbeast', 'wasteland_beetle'])
const url = (id) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${VEHICLE_COMMIT}/media/3D_Assets/MeshyModels/vehicles/${id}/${id}_browser.v3.glb`

export function createVehicleLineup({ ids = VEHICLE_IDS, figure = () => null, rows = 2, gap = 0.9 } = {}) {
  const fbBox = new THREE.Box3()
  const rigToStage = () => { const f = figure(); if (!f?.object3d || f.status?.().shown !== true) return null; fbBox.setFromObject(f.object3d); const h = fbBox.max.y - fbBox.min.y; return h > 0.5 ? h / FB_RIG_HEIGHT : null }
  const root = new THREE.Group(); root.name = 'vehicle-lineup'
  const holder = new THREE.Group(); holder.name = 'vehicles'; root.add(holder)
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cdb48c', roughness: 1, metalness: 0 }))
  ground.name = 'lineup-ground'; ground.receiveShadow = true; root.add(ground)
  const state = { status: 'LOADING', error: null, loaded: 0, scale: null, items: [], disposed: false }
  const loader = new GLTFLoader()
  const ready = Promise.all(ids.map((id) => loader.loadAsync(url(id)).then((g) => { if (state.disposed) return null
    const o = g.scene; o.name = 'vehicle:' + id; o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } })
    const box = new THREE.Box3().setFromObject(o), size = box.getSize(new THREE.Vector3())
    state.items.push({ id, o, size: size.toArray() }); state.loaded++; return o })))
    .then(() => { state.status = state.disposed ? 'DISPOSED' : 'LOADED' })
    .catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e) })
  // Anordnen, sobald alle geladen sind und der Maßstab bekannt ist (FB sichtbar)
  function layout(k) {
    holder.clear(); const order = ids.map((id) => state.items.find((it) => it.id === id)).filter(Boolean), perRow = Math.ceil(order.length / rows)
    order.forEach((it, i) => {
      const r = Math.floor(i / perRow), row = order.slice(r * perRow, (r + 1) * perRow), j = i - r * perRow
      const widths = row.map((x) => x.size[0] * k + gap), total = widths.reduce((a, b) => a + b, 0)
      const x = -total / 2 + widths.slice(0, j).reduce((a, b) => a + b, 0) + widths[j] / 2
      const depth = Math.max(...order.slice(0, perRow).map((x2) => x2.size[2] * k)) + 2.5
      it.o.scale.setScalar(k); it.o.position.set(x, 0, -r * depth); it.o.rotation.y = 0; holder.add(it.o)
    })
    state.scale = k; state.status = 'OK'
  }
  return {
    object3d: root,
    ready,
    status: () => ({ status: state.status, error: state.error, loaded: state.loaded, total: ids.length, scale: state.scale }),
    info: () => state.items.map((it) => ({ id: it.id, rigLength: +it.size[2].toFixed(3), stageLength: state.scale ? +(it.size[2] * state.scale).toFixed(2) : null })),
    update() { if (state.status !== 'LOADED') return; const k = rigToStage(); if (k) layout(k) },
    dispose() {
      state.disposed = true; const geos = new Set(), mats = new Set(), texs = new Set()
      root.traverse((o) => { if (!o.isMesh) return; geos.add(o.geometry); [].concat(o.material).forEach((m) => { mats.add(m); for (const key in m) if (m[key]?.isTexture) texs.add(m[key]) }) })
      state.items.forEach((it) => it.o.traverse((o) => { if (!o.isMesh) return; geos.add(o.geometry); [].concat(o.material).forEach((m) => { mats.add(m); for (const key in m) if (m[key]?.isTexture) texs.add(m[key]) }) }))
      geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); texs.forEach((t) => t.dispose()); root.clear()
    },
  }
}
