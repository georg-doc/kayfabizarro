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

// Palette (V-270): options.palette = stagePaletteFor(...).amph trägt { wall: [3], floor: [3], ground } (Verläufe dunkel → hell).
// Die Helligkeit der Meshy-Textur wird auf einen Drei-Stufen-Verlauf gelegt (Anteil PAL_AMT), die Zeichnung bleibt. Welcher Verlauf, entscheidet die
// Flächen-Normale in Weltkoordinaten: senkrechte Flächen (Ränge, Mauern, Bögen) nehmen wall = stone, waagrechte (Bühnenboden, Stufen-Oberseiten)
// floor = paved; Übergang weich zwischen n.y 0,55 und 0,8. Das Gelände nimmt ground. setPalette(amph, fadeS) wechselt weich (V-011).
// Ohne Palette: Originaltextur, Gelände aus dem Biom (wie bisher).
// V-286 (Georg 15.10.): gemalte Meshy-Texturen nur sanft tönen, Textur bleibt lesbar; die volle Palette tragen Rahmen, Requisiten, Himmel.
// Vorher 0,85 (Rollen-Umfärbung V-270). WS0-Vorschlag höchstens ~15–20 %; die genaue Stärke ist offen bei Georg (Farbkonzept R1, G-6).
export const PAL_AMT = 0.18
// Variante B (§36): Bühnenteile nach Weltlage (Meter, Bühnenmitte = Ursprung, Bühnenboden y = 0), vermessen mit scripts/amph/band-probe.mjs.
// Oberhalb yArch = Torbögen und Mauerkrone (tower), innerhalb stageR und waagrecht = Bühnenboden (sand), dazwischen Sitzreihen in Höhenbändern
// der Höhe rowH ab y0 (hill[0]/hill[1] im Wechsel). Farbe = Rolle, Helligkeit der Meshy-Textur formt sie (0,6 … 1,15).
export const AMPH_BANDS = Object.freeze({ yArch: 4.55, y0: 0.05, rowH: 0.71, stageR: 7.3 }) // Tritte bei ≈ 0,7 · 1,4 · 2,1 · 2,8 · 3,55 · 4,4 m: je Band ein Setzstein mit seinem Tritt
// options: { url = AMPH_URL, biome (für die Geländefarbe), palette (V-270), groundR = 70 }
export function createAmphitheater(options = {}) {
  amphLog.create++
  // worldK (V-345): alte WS1-Bühnenmeter → J17-Meter; skaliert Modell, Gelände, Höhenbänder und Knet-Abstände gleich, damit das Bild gleich bleibt
  const { url = AMPH_URL, biome = null, groundR = 70, palette = null, worldK = 1 } = options
  const s = AMPH_SCALE * worldK
  const root = new THREE.Group(); root.name = 'amphitheater'
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * worldK }, uClayFar: { value: 90 * worldK }, uClayScale: { value: 1.4 * worldK }, uClayAmt: { value: 0.45 } }, { oct: 2, near: true, stick: false })
  const groundMat = fam.std(palette?.ground || biome?.top || '#9aab62', 0.95)
  // Paletten-Uniforms: gemeinsam für alle Modell-Materialien; Überblendung lerpt sie (und die Geländefarbe) von → nach
  const KEYS = ['w0', 'w1', 'w2', 'f0', 'f1', 'f2']
  const cols = (pa) => (pa ? pa.cols || [...pa.wall, ...pa.floor] : Array(6).fill('#000000')) // A: Wand- und Boden-Verlauf · B: tower0, tower1, hill0, hill1, top, rock
  const PU = { amt: { value: palette ? PAL_AMT : 0 }, mode: { value: palette?.mode === 'b' ? 1 : 0 } }; cols(palette).forEach((c, i) => { PU[KEYS[i]] = { value: new THREE.Color(c) } })
  const fade = { on: false, t: 0, dur: 0, from: null, to: null }
  const inject = (m) => {
    m.onBeforeCompile = (sh) => {
      for (const k of KEYS) sh.uniforms['p' + k] = PU[k]; sh.uniforms.pamt = PU.amt; sh.uniforms.pmode = PU.mode
      sh.uniforms.pband = { value: [AMPH_BANDS.yArch * worldK, AMPH_BANDS.y0 * worldK, AMPH_BANDS.rowH * worldK, AMPH_BANDS.stageR * worldK] }
      sh.vertexShader = 'varying vec3 vKfbWN; varying vec3 vKfbWP;\n' + sh.vertexShader.replace('#include <defaultnormal_vertex>', `#include <defaultnormal_vertex>
  vKfbWN = normalize(mat3(modelMatrix) * objectNormal);`).replace('#include <project_vertex>', `#include <project_vertex>
  vKfbWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`)
      sh.fragmentShader = 'uniform vec3 pw0; uniform vec3 pw1; uniform vec3 pw2; uniform vec3 pf0; uniform vec3 pf1; uniform vec3 pf2; uniform float pamt; uniform float pmode; uniform float pband[4]; varying vec3 vKfbWN; varying vec3 vKfbWP;\n' + sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
  { float L = clamp((dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)) - 0.04) / 0.45, 0.0, 1.0);
    vec3 wall = L < 0.5 ? mix(pw0, pw1, L * 2.0) : mix(pw1, pw2, (L - 0.5) * 2.0);
    vec3 flo = L < 0.5 ? mix(pf0, pf1, L * 2.0) : mix(pf1, pf2, (L - 0.5) * 2.0);
    float up = normalize(vKfbWN).y;
    vec3 ramp = mix(wall, flo, smoothstep(0.55, 0.8, up));
    if (pmode > 0.5) { // Variante B: Rolle je Bühnenteil (pw0 tower0, pw1 tower1, pw2 hill0, pf0 hill1, pf1 sand, pf2 rock)
      vec3 base; float r = length(vKfbWP.xz);
      if (vKfbWP.y > pband[0]) base = up > 0.6 ? pw1 : pw0;
      else if (r < pband[3] && up > 0.5) base = pf1;
      else base = mod(floor((vKfbWP.y - pband[1]) / pband[2]), 2.0) < 1.0 ? pw2 : pf0;
      ramp = base * mix(0.6, 1.15, L); }
    diffuseColor.rgb = mix(diffuseColor.rgb, ramp, pamt); }`)
    }
    m.customProgramCacheKey = () => 'kfb-amph-palette-v270b'; m.needsUpdate = true
  }
  const snap = () => ({ c: KEYS.map((k) => PU[k].value.clone()), amt: PU.amt.value, ground: groundMat.color.clone() })
  const plain = (pa) => (pa.mode === 'b' ? { mode: 'b', cols: [...pa.cols], ground: pa.ground } : { wall: [...pa.wall], floor: [...pa.floor], ground: pa.ground })
  function setPalette(pa, fadeS = 0) {
    const to = { c: cols(pa).map((x) => new THREE.Color(x)), amt: PAL_AMT, ground: new THREE.Color(pa.ground) }
    state.palette = plain(pa); PU.mode.value = pa.mode === 'b' ? 1 : 0
    if (!(fadeS > 0)) { fade.on = false; apply(to, to, 1); return }
    Object.assign(fade, { on: true, t: 0, dur: fadeS, from: snap(), to })
  }
  function apply(a, b, k) { KEYS.forEach((n, i) => PU[n].value.copy(a.c[i]).lerp(b.c[i], k)); PU.amt.value = a.amt + (b.amt - a.amt) * k; groundMat.color.copy(a.ground).lerp(b.ground, k) }
  function stepFade(dt) { if (!fade.on) return; fade.t = Math.min(fade.dur, fade.t + dt); const u = fade.t / fade.dur; apply(fade.from, fade.to, u * u * (3 - 2 * u)); if (u >= 1) fade.on = false }
  const ground = new THREE.Mesh(new THREE.CircleGeometry(groundR * worldK, 96), groundMat); ground.name = 'clay-ground'
  ground.rotation.x = -Math.PI / 2; ground.position.y = (STAGE.minY - STAGE.floorY) * s + 0.11 * worldK // −0,125 m: über der Bodenplatte (≈ −0,16), unter der Bühnenfläche
  ground.receiveShadow = true; root.add(ground)
  const state = { model: null, status: 'LOADING', error: null, disposed: false, info: null, palette: palette ? plain(palette) : null }
  const ready = new GLTFLoader().loadAsync(url).then((g) => {
    if (state.disposed) return null
    const m = g.scene; m.name = 'amphitheater-model'
    m.scale.setScalar(s); m.position.set(-STAGE.center[0] * s, -STAGE.floorY * s, -STAGE.center[1] * s)
    m.traverse((o) => { if (o.isMesh) { o.receiveShadow = true; o.castShadow = false; [].concat(o.material).forEach(inject) } }) // Palette immer eingehängt (amt 0 = Original)
    root.add(m); state.model = m
    let tris = 0; m.traverse((o) => { if (o.isMesh) tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3 })
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(m)
    state.info = { scale: +s.toFixed(4), tris, size: box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(2)), min: box.min.toArray().map((v) => +v.toFixed(3)), groundY: +ground.position.y.toFixed(3), stageR: STAGE.diameterM * worldK / 2 }
    state.status = 'OK'; return state.info
  }).catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); return null })

  return {
    object3d: root,
    ready,
    status: () => ({ status: state.status, error: state.error, info: state.info, palette: state.palette, fading: fade.on }),
    setPalette,
    update(dt) { amphLog.update++; stepFade(dt || 0) },
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
