// V-230 · Amphitheater-Bühne (Meshy, Browser-Fassung v1) als Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose }.
// Quelle: media/3D_Assets/MeshyModels/browser/kfb-stage-amphitheater-meshy.browser.v1.glb @829d551d (SHA-256 3f79037e…, Asset Librarian
// private:meshy-claymation-amphitheater-master → runtimeUrl). Geladen über die gepinnte Adresse (nicht in den Einzeldatei-Build eingebettet).
// Maßstab (WS0 14.10., Antwort §9 Punkt 3): Bühnenfläche ≈ 14 m Durchmesser. Auslegung „Innenkreis“: Die Fläche ist nicht rund (Strahltest,
// scripts/amph/measure-stage.mjs: Rand hinten 0,375 · rechts 0,40 · links 0,43 · vorn offen 0,51 Modell-Einheiten); 14 m gelten bis zu den Rängen
// hinten (Radius 0,37 → Faktor 18,92). Dann ist die Fläche ≈ 15,7 m breit, das Theater ≈ 36 × 9,3 × 32 m. Oberfläche y −0,2342; die Bühnenmitte
// liegt danach im Ursprung, der Bühnenboden bei y = 0, die offene Seite zeigt nach +Z.
// Gelände (V-203): Die Unterseite des Modells ist eine geschlossene flache Platte (≈ −0,16 m; Prüfer 7 – nicht „offen“, wie die Quell-Isolation
// vermutete). Darunter bzw. darum liegt ein Knet-Gelände (Relief aus makeClayFamily des Billboard-Spenders, Farbe = Biom-Boden) bei ≈ −0,125 m,
// also knapp über der Platte: Bodenschluss rundum, ohne Spalt am Rand. Die Kamera der Bühne kommt nie unter y = 0,5.
// Schatten: Das Theater empfängt Schatten, wirft aber keine (castShadow aus: Bildzeit und keine Eigenschatten-Streifen auf den Rängen).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'

export const AMPH_COMMIT = '829d551d5cf45eb2fe18ce7a532e37ba7282005a'
export const AMPH_PATH = 'media/3D_Assets/MeshyModels/browser/kfb-stage-amphitheater-meshy.browser.v1.glb'
export const AMPH_URL = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${AMPH_COMMIT}/${AMPH_PATH}`
export const AMPH_SHA256 = '3f79037e51ab3a745243aae6ffb40aba3670226a960199b36a02e45d05051dd4'
// floorY = Oberfläche der Bühnenfläche (−0,2342): das Höhenprofil hat zwei Stufen (−0,243 Unterkante, −0,234 Oberfläche); der Median −0,2396 ließ
// Figuren und Billboard 0,10 m im Boden stehen (test/stage.mjs Höhenprobe), daher die obere Stufe.
export const STAGE = Object.freeze({ center: [-0.0008, 0.1113], floorY: -0.2342, floorR: 0.37, minY: -0.2466, diameterM: 14 })
export const AMPH_SCALE = (STAGE.diameterM / 2) / STAGE.floorR

export const amphLog = { create: 0, update: 0, dispose: 0, freed: null }

// options: { url = AMPH_URL, biome (für die Geländefarbe), groundR = 70 }
export function createAmphitheater(options = {}) {
  amphLog.create++
  const { url = AMPH_URL, biome = null, groundR = 70 } = options
  const s = AMPH_SCALE
  const root = new THREE.Group(); root.name = 'amphitheater'
  const fam = makeClayFamily('G', { uClayNear: { value: 30 }, uClayFar: { value: 90 }, uClayScale: { value: 1.4 }, uClayAmt: { value: 0.45 } }, { oct: 2, near: true, stick: false })
  const groundMat = fam.std(biome?.top || '#9aab62', 0.95)
  const ground = new THREE.Mesh(new THREE.CircleGeometry(groundR, 96), groundMat); ground.name = 'clay-ground'
  ground.rotation.x = -Math.PI / 2; ground.position.y = (STAGE.minY - STAGE.floorY) * s + 0.11 // −0,125 m: über der Bodenplatte (≈ −0,16), unter der Bühnenfläche
  ground.receiveShadow = true; root.add(ground)
  const state = { model: null, status: 'LOADING', error: null, disposed: false, info: null }
  const ready = new GLTFLoader().loadAsync(url).then((g) => {
    if (state.disposed) return null
    const m = g.scene; m.name = 'amphitheater-model'
    m.scale.setScalar(s); m.position.set(-STAGE.center[0] * s, -STAGE.floorY * s, -STAGE.center[1] * s)
    m.traverse((o) => { if (o.isMesh) { o.receiveShadow = true; o.castShadow = false } })
    root.add(m); state.model = m
    let tris = 0; m.traverse((o) => { if (o.isMesh) tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3 })
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(m)
    state.info = { scale: +s.toFixed(4), tris, size: box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(2)), min: box.min.toArray().map((v) => +v.toFixed(3)), groundY: +ground.position.y.toFixed(3), stageR: STAGE.diameterM / 2 }
    state.status = 'OK'; return state.info
  }).catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); return null })

  return {
    object3d: root,
    ready,
    status: () => ({ status: state.status, error: state.error, info: state.info }),
    update() { amphLog.update++ },
    dispose() {
      amphLog.dispose++; state.disposed = true
      const geos = new Set(), mats = new Set(), texs = new Set()
      root.traverse((o) => { if (!o.isMesh) return; geos.add(o.geometry); [].concat(o.material).forEach((m) => { mats.add(m); for (const k in m) if (m[k]?.isTexture) texs.add(m[k]) }) })
      geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); texs.forEach((t) => t.dispose())
      amphLog.freed = { geometries: geos.size, materials: mats.size, textures: texs.size }
      root.clear()
    },
  }
}
