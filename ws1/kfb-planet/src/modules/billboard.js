// B1 · Bühnen-Billboard nach BILLBOARD_STANDARD_R2 (V-223/V-224/V-228). Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose }.
// Körper 1:1 = World Billboard Clay01 r2 `billboard-clay.js` (vendor/billboard, byte-gleich), Stil `plain`: Knet-Rahmen auf zwei Pfosten.
// Material wie der Spender (billboard-stage.js Z. 58–60): makeClayFamily('B', …) · std('#ffffff', 0,88, { vertexColors }).
// Änderungen laut Vorlagen-Zeile (WS1_STATUS §14), sonst nichts:
//   1. responsive Fläche: fitFace (= fit_face aus build_billboard_b3_v2.py, Vorlage STAGE_LIVE_R1) aus dem Seitenverhältnis der Viertelseite;
//      Leinwand = Kartenverhältnis, Karte füllt sie ganz (randlos, nie beschnitten); Rahmen und Pfosten folgen über bodyGeometry(W, H).
//   2. kurze Pfosten: STYLES.plain.gb (Bodenabstand der Fläche) 3,0 → 0,9 im exportierten Objekt, gesetzt beim Laden dieses Moduls,
//      bevor irgendein plain-Körper gebaut wird (bodyGeometry-Cache kennt gb nicht). Diff: `STYLES.plain.gb: 3.0 → 0.9`. Datei unverändert.
//   5. Lage der Fläche: z = 0,285 statt 0,035 (Spender), also vor der geraden Innenwand der Rahmenöffnung (z 0,08–0,28) und hinter der nach
//      außen öffnenden Fase. Sonst verdeckt die Innenwand in Schrägansicht einen Kartenstreifen (blinder Prüfer 6, Befund 1).
//   3. Innenecken (Georg 14.10., ersetzt R2 §3): Der Knet-Rahmen hat IMMER runde Innenecken, Radius = STYLES.plain.corner des Spenders
//      (0,45 m, über cornerOf ≤ 0,3 · min(W, H)); die Karte liegt darunter mit Maske (faceGeometry mit Radius: UV über die volle Box,
//      Bild unverzerrt, nur die Ecken fallen weg – Spender-Verhalten).
//   4. Farben (Georg 14.10., V-245 → V-270): Rollen frame/trim/post aus der Insel-Palette je Karte (stagePalette.js) über buildPalette(fixed) des Spenders,
//      Rückfall: Cartoon-Palette des Bioms über buildPalette(spec, island);
//      die Biome sind die Tabelle BIOMES aus billboard-stage.js Z. 6–12 (Daten 1:1, das Stage-Modul selbst wird nicht übernommen).
// Nicht übernommen: Insel-Anker, BillboardScheduler, Kaleido-Schnitte, TV-Stil (R2 §1, §4). Keine Lesefolge bis zu freigegebenen Zitaten.
import * as THREE from 'three'
import { bodyGeometry, faceGeometry, buildPalette, STYLES, makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { createCardContent, placeholderCanvas, BB_RES } from './surfaceContent'

// Spender billboard-stage.js Z. 6–12 (Insel-Biome), 1:1. buildPalette nimmt accent → Rahmen, paper → Zierleiste, rock → Pfosten, top → Boden.
export const BIOMES = Object.freeze([
  { name: 'Senf-Plateau', top: '#e9c14a', rock: '#a8643a', road: '#3a342a', accent: '#c2412c', paper: '#f3ead3' },
  { name: 'Moos-Insel', top: '#9aab62', rock: '#6f4e37', road: '#3a342a', accent: '#d97c3a', paper: '#ece1c0' },
  { name: 'Violett-Mesa', top: '#a48bb4', rock: '#6b4e7d', road: '#2c2733', accent: '#e9c14a', paper: '#f3ead3' },
  { name: 'Klinik-Riff', top: '#86b8b1', rock: '#3e6a83', road: '#2b3236', accent: '#a64670', paper: '#ece1c0' },
  { name: 'Heroic-Canyon', top: '#e3a066', rock: '#a64670', road: '#3a2a26', accent: '#4f8a85', paper: '#f3ead3' },
].map(Object.freeze))
export const biomeByName = (name) => BIOMES.find((b) => b.name === name) || null
export const fitFace = (aspect, maxW, maxH) => { let w = maxW, h = maxW / aspect; if (h > maxH) { h = maxH; w = maxH * aspect } return { w, h } }
export const LOW_GB = 0.9
export const FACE_Z = 0.08 + 0.2 + 0.005 // buildPlain: Rahmen bei z 0,08, Tiefe 0,2 → gerade Wand bis 0,28; Fläche 5 mm davor
export { BB_RES, placeholderCanvas } // seit V-256 im Inhalts-Modul surfaceContent.js; hier weiter erreichbar (Prüfungen, StageTest)
export const SPENDER_GB = STYLES.plain.gb // 3,0 (Spender)
STYLES.plain.gb = LOW_GB // einmal beim Laden (siehe Kopf, Änderung 2)

export const billboardLog = { create: 0, update: 0, dispose: 0, freed: null }

// V-256 · Träger: Knet-Körper + Bildfläche (Rundrechteck-Maske, Größe nach fitFace) + Palette. Der Inhalt ist ein eigenes Modul (surfaceContent.js),
// das nur die Fläche kennt: Er setzt die Textur und meldet sein Seitenverhältnis über surface.fit(); der Träger formt danach Rahmen und Fläche.
// Nach außen bleibt alles wie vor dem Schnitt (setCard, info, ready, setPalette), damit Dialog, Bühne und Prüfungen unverändert laufen.
// options: { card, content? (Inhalt, Standard createCardContent()), palette (stagePaletteFor(...), V-270) | biome (Objekt wie BIOMES, Rückfall) | biomeName, maxW = 7, maxH = 5, position, yaw }
// palette: Rahmen/Zierleiste/Pfosten/Boden aus den ENV_ROLES der Insel-Palette (stagePalette.js); setPalette(p, fadeS) wechselt weich (V-011).
export function createBillboard(options = {}) {
  const { maxW = 7, maxH = 5, position = [0, 0, 0], yaw = 0 } = options
  const fam = makeClayFamily('B', { uClayNear: { value: 26 }, uClayFar: { value: 70 }, uClayScale: { value: 2.6 }, uClayAmt: { value: 0.4 } })
  const bodyMat = fam.std('#ffffff', 0.88, { vertexColors: true })
  const biome = options.biome || biomeByName(options.biomeName) || null
  if (!biome && !options.palette) throw new Error('BILLBOARD_BIOME_REQUIRED: Palette kommt aus Biom/Insel/Kartenzone (options.palette, options.biome oder biomeName)')
  billboardLog.create++ // erst nach der Prüfung: ein abgelehnter Aufruf erzeugt nichts
  // Spender-Palette: aus den Bühnen-Rollen (fixed, Farben = Rollen) oder aus dem Biom (island-biome, wie bisher)
  const palOf = (sp) => buildPalette({ biomePalette: { mode: 'fixed', name: sp.id, colors: sp.billboard } }, null)
  let P = options.palette ? palOf(options.palette) : buildPalette({ biomePalette: { mode: 'island-biome' } }, { biome })
  let palName = options.palette ? options.palette.id : biome.name
  const fade = { from: null, to: null, own: null, t: 0, dur: 0 } // Überblendung: Farbwerte zwischen zwei Cache-Geometrien, in einer eigenen Kopie
  const g = new THREE.Group(); g.name = 'billboard-plain'; g.position.fromArray(position); g.rotation.y = yaw
  const body = new THREE.Mesh(undefined, bodyMat); body.name = 'body'; body.castShadow = body.receiveShadow = true; g.add(body)
  // Bildfläche des Trägers: Material und Maske gehören dem Träger, die Textur setzt der Inhalt
  const faceMat = new THREE.MeshBasicMaterial({ toneMapped: false })
  const face = new THREE.Mesh(undefined, faceMat); face.name = 'face'; g.add(face)
  const state = { info: null, disposed: false }

  // Träger formt sich nach dem Seitenverhältnis des Inhalts (R2 „responsiv“, fitFace) und gibt seine Info zurück
  function fit(meta) {
    const { w: W, h: H } = fitFace(meta.aspect, maxW, maxH)
    const r = Math.max(0, Math.min(STYLES.plain.corner, Math.min(W, H) * 0.3)) // cornerOf des Spenders mit faceCornerM = STYLES.plain.corner
    endFade(); state.dims = { W, H, r }
    body.geometry = bodyGeometry(W, H, P, 'plain', r) // geteilter Cache des Spenders, nicht freigeben
    face.geometry = faceGeometry(W, H, r)
    face.position.set(0, STYLES.plain.gb + H / 2, FACE_Z)
    state.info = { source: meta.source, W: +W.toFixed(4), H: +H.toFixed(4), aspect: +meta.aspect.toFixed(4), gb: STYLES.plain.gb, cornerR: +r.toFixed(4), palette: { biome: palName, frame: P.frame, trim: P.trim, post: P.post }, canvas: meta.canvas,
      top: +(STYLES.plain.gb + H + 0.45 + 0.08).toFixed(3), faceCenter: [0, STYLES.plain.gb + H / 2, FACE_Z], fontScale: meta.fontScale, card: meta.card }
    return state.info
  }
  const content = options.content || createCardContent()
  content.attach({ mesh: face, fit })
  const setCard = (card) => content.setCard(card)
  function endFade() { if (!fade.own) return; body.geometry = fade.to; fade.own.dispose(); fade.own = null }
  // Palette wechseln: Ziel-Geometrie aus dem Cache, Farben über fadeS Sekunden überblenden (gleiche Topologie, nur Farbwerte)
  function setPalette(sp, fadeS = 0) {
    const P2 = palOf(sp); palName = sp.id
    if (state.info) state.info.palette = { biome: palName, frame: P2.frame, trim: P2.trim, post: P2.post }
    if (!state.dims) { P = P2; return }
    const { W, H, r } = state.dims; endFade()
    const A = body.geometry, B = bodyGeometry(W, H, P2, 'plain', r); P = P2
    if (!(fadeS > 0) || A === B || !A.attributes.color || A.attributes.color.count !== B.attributes.color.count) { body.geometry = B; return }
    fade.from = A; fade.to = B; fade.own = B.clone(); fade.t = 0; fade.dur = fadeS
    fade.own.attributes.color.array.set(A.attributes.color.array); fade.own.attributes.color.needsUpdate = true; body.geometry = fade.own
  }
  function stepFade(dt) {
    if (!fade.own) return
    fade.t = Math.min(fade.dur, fade.t + dt); const u = fade.t / fade.dur, k = u * u * (3 - 2 * u) // weich ein- und ausblenden
    const a = fade.from.attributes.color.array, b = fade.to.attributes.color.array, o = fade.own.attributes.color.array
    for (let i = 0; i < o.length; i++) o[i] = a[i] + (b[i] - a[i]) * k
    fade.own.attributes.color.needsUpdate = true; if (u >= 1) endFade()
  }
  const ready = setCard(options.card || null)

  return {
    object3d: g,
    ready,
    setCard,
    content,
    surface: () => ({ mesh: face, dims: state.dims ? { ...state.dims } : null }),
    setPalette,
    fading: () => !!fade.own,
    info: () => state.info,
    update(dt) { billboardLog.update++; stepFade(dt || 0) }, // ruhend bis auf die Paletten-Überblendung: kein Takt, keine Lesefolge (R2 §4)
    dispose() {
      billboardLog.dispose++; state.disposed = true
      content.dispose() // Inhalt gibt seine Textur frei
      endFade(); faceMat.dispose(); bodyMat.dispose() // Geometrien gehören dem Cache von billboard-clay.js (wie im Spender); die Überblend-Kopie ist eigen
      billboardLog.freed = { textures: 1, materials: 2 }
      g.clear()
    },
  }
}
