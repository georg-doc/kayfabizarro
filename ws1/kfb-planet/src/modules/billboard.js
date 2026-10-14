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
//   4. Farben (Georg 14.10.): aus der Cartoon-Palette des Bioms / der Insel / der Kartenzone über buildPalette(spec, island) des Spenders;
//      die Biome sind die Tabelle BIOMES aus billboard-stage.js Z. 6–12 (Daten 1:1, das Stage-Modul selbst wird nicht übernommen).
// Nicht übernommen: Insel-Anker, BillboardScheduler, Kaleido-Schnitte, TV-Stil (R2 §1, §4). Keine Lesefolge bis zu freigegebenen Zitaten.
import * as THREE from 'three'
import { bodyGeometry, faceGeometry, buildPalette, STYLES, makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { cardImage, PAPER, CARD_AR, subscribeRetry } from '../cardImage'
import { isCardSafe } from '../cardMapping'

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
export const BB_RES = 2800 // Seitenbreite für pdf.js → Viertelseite ~1400 px (Fläche bis 7 m); cardImage-Standard 1400 → 700 px wäre zu grob
export const SPENDER_GB = STYLES.plain.gb // 3,0 (Spender)
STYLES.plain.gb = LOW_GB // einmal beim Laden (siehe Kopf, Änderung 2)

// Platzhalter für Karten ohne gesichertes Bild (Deck nicht SAFE, Karte gesperrt, Bild lädt noch): wörtlicher Kartentext, nichts erfunden.
// Der ganze Text muss auf die Fläche: die Schrift wird verkleinert, bis Name, Power und Lore vollständig passen (nie still gekürzt).
export function placeholderCanvas(card) {
  const W = 1024, H = Math.round(W / CARD_AR), c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d'), pad = 40, mw = W - 2 * pad
  const lines = (t, font) => { g.font = font; const out = []; let l = ''; for (const s of String(t || '').split(/\s+/).filter(Boolean)) { const k = l ? l + ' ' + s : s; if (g.measureText(k).width > mw && l) { out.push(l); l = s } else l = k } if (l) out.push(l); return out }
  const parts = [[String(card?.name || '…').toUpperCase(), 'bold', 46, '#2a2040'], [card?.power, '', 30, '#2a2040'], [card?.lore, 'italic', 26, '#5b4d74']]
  let k = 1, laid
  for (; k > 0.3; k -= 0.05) {
    let y = pad; laid = parts.map(([t, st, px, col]) => { const f = `${st} ${Math.round(px * k)}px Nunito, system-ui, sans-serif`, L = lines(t, f), lh = Math.round(px * k * 1.2), blk = { f, L, lh, col, y }; y += L.length * lh + Math.round(18 * k); return blk })
    if (y <= H - pad) break
  }
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H); g.textAlign = 'left'; g.textBaseline = 'top'
  for (const b of laid) { g.font = b.f; g.fillStyle = b.col; b.L.forEach((l, i) => g.fillText(l, pad, b.y + i * b.lh)) }
  c.__fontScale = +k.toFixed(2)
  return c
}

export const billboardLog = { create: 0, update: 0, dispose: 0, freed: null }

// options: { card, biome (Objekt wie BIOMES) | biomeName, maxW = 7, maxH = 5, position, yaw }
export function createBillboard(options = {}) {
  const { maxW = 7, maxH = 5, position = [0, 0, 0], yaw = 0 } = options
  const fam = makeClayFamily('B', { uClayNear: { value: 26 }, uClayFar: { value: 70 }, uClayScale: { value: 2.6 }, uClayAmt: { value: 0.4 } })
  const bodyMat = fam.std('#ffffff', 0.88, { vertexColors: true })
  const biome = options.biome || biomeByName(options.biomeName) || null
  if (!biome) throw new Error('BILLBOARD_BIOME_REQUIRED: Palette kommt aus Biom/Insel/Kartenzone (options.biome oder biomeName)')
  billboardLog.create++ // erst nach der Prüfung: ein abgelehnter Aufruf erzeugt nichts
  const P = buildPalette({ biomePalette: { mode: 'island-biome' } }, { biome })
  const g = new THREE.Group(); g.name = 'billboard-plain'; g.position.fromArray(position); g.rotation.y = yaw
  const body = new THREE.Mesh(undefined, bodyMat); body.name = 'body'; body.castShadow = body.receiveShadow = true; g.add(body)
  // Die Textur zeigt die Quelle direkt (Viertelseite aus cardImage bzw. Platzhalter): keine Kopie, kein Skalieren, kein Beschnitt
  // (Prüfer 6, Befund 3: eine zweite 4-MB-Kopie je Karte entfällt). Viertelseiten über 2048 px würden verkleinert kopiert.
  let tex = new THREE.CanvasTexture(document.createElement('canvas')); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8
  const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  const face = new THREE.Mesh(undefined, faceMat); face.name = 'face'; g.add(face)
  const state = { card: null, token: 0, info: null, disposed: false }
  const fit2048 = (src) => { if (src.width <= 2048) return src; const c = document.createElement('canvas'); c.width = 2048; c.height = Math.round(2048 * src.height / src.width); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height); return c }

  function layout(src0, source) {
    const src = fit2048(src0), aspect = src.width / src.height, { w: W, h: H } = fitFace(aspect, maxW, maxH), cw = src.width, ch = src.height
    if (tex.image !== src) { const t = new THREE.CanvasTexture(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; tex.dispose(); tex = t; faceMat.map = t; faceMat.needsUpdate = true } // ganze Viertelseite, randlos
    const r = Math.max(0, Math.min(STYLES.plain.corner, Math.min(W, H) * 0.3)) // cornerOf des Spenders mit faceCornerM = STYLES.plain.corner
    body.geometry = bodyGeometry(W, H, P, 'plain', r) // geteilter Cache des Spenders, nicht freigeben
    face.geometry = faceGeometry(W, H, r)
    face.position.set(0, STYLES.plain.gb + H / 2, FACE_Z)
    tex.needsUpdate = true
    state.info = { source, W: +W.toFixed(4), H: +H.toFixed(4), aspect: +aspect.toFixed(4), gb: STYLES.plain.gb, cornerR: +r.toFixed(4), palette: { biome: biome.name, frame: P.frame, trim: P.trim, post: P.post }, canvas: [cw, ch],
      top: +(STYLES.plain.gb + H + 0.45 + 0.08).toFixed(3), faceCenter: [0, STYLES.plain.gb + H / 2, FACE_Z], fontScale: src.__fontScale ?? null, card: state.card ? state.card.deck.id + '#' + state.card.num : null }
  }

  // Ergebnis eines überholten Aufrufs: { stale: true } statt der Daten der neueren Karte (Prüfer 6, Befund 6)
  function setCard(card) {
    const tk = ++state.token; state.card = card
    layout(placeholderCanvas(card), 'PLACEHOLDER')
    if (!card || !isCardSafe(card.deck.id, card.num)) return Promise.resolve(state.info)
    return cardImage(card.deck.id, card.num, BB_RES).then((img) => {
      if (state.disposed || tk !== state.token) return { stale: true }
      if (img) layout(img.canvas, 'CARD')
      return state.info
    })
  }
  // Neuer Versuch nach Ladefehler (Wachhund, Netz): derselbe Takt wie CardArt/useCardTexture (Prüfer 6, Befund 5)
  const offRetry = subscribeRetry(() => { const c = state.card; if (!state.disposed && c && state.info?.source === 'PLACEHOLDER' && isCardSafe(c.deck.id, c.num)) setCard(c) })
  const ready = setCard(options.card || null)

  return {
    object3d: g,
    ready,
    setCard,
    info: () => state.info,
    update() { billboardLog.update++ }, // ruhend: kein Takt, keine Lesefolge (R2 §4)
    dispose() {
      billboardLog.dispose++; state.disposed = true; offRetry()
      tex.dispose(); faceMat.dispose(); bodyMat.dispose() // Geometrien gehören dem Cache von billboard-clay.js (wie im Spender)
      billboardLog.freed = { textures: 1, materials: 2 }
      g.clear()
    },
  }
}
