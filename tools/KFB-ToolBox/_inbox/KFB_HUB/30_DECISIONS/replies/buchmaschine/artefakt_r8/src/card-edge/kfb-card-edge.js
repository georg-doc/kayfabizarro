// kfb-card-edge.js · V-1056: EIN Einstieg für Kartenkante und Kartenbild in Spiel, Viewer und Arena.
// Kein eigener Rechenweg, nur der Zusammenbau von Vorhandenem (Herkunft je Datei: README.md hier im Ordner):
//   kfb-ink-canon.js    die Feder (SSOT_Card_Ink_Outline_v2)
//   kfb-card-format.js  fitCell, coverLoss, CARD_AR
//   kfb-card-builder.js Seite, Viertel, Blatt, Maske, Decal (Arena v4, Patches CE1–CE4)
//   frame, inkOutside   die DOM-Kante aus Deck Viewer v4 (ink-frame.js, inkOutside)
//   closeEdge           Kantenstapel aus der SOP §4/§5 (Papier 0,72, kein Höhenversatz, toneMapped false)
// three kommt vom Aufrufer (createCardEdge({ THREE })); frame und flatCard brauchen three nicht.
import { INK_CANON_VERSION, INK_COLOR, INK_PRESETS, INK_CHECK, contour, normContour, pathOf, drawInk, maskGrow, measureInk } from './kfb-ink-canon.js'
import { CARD_AR, fitCell, coverLoss } from './kfb-card-format.js'
import { createCardBuilder } from './kfb-card-builder.js'

export { INK_CANON_VERSION, INK_COLOR, INK_PRESETS, INK_CHECK, contour, normContour, pathOf, drawInk, maskGrow, measureInk, CARD_AR, fitCell, coverLoss, createCardBuilder }

// Das Blattformat in Spiel, Viewer und Arena ist die Viertelseite (V-259; Viewer v4 AR, Arena-Befund 17.8.), nicht CARD_AR 1,74 aus kfb-card-format.
export const QUARTER_AR = 745.091 / 415.636
// SOP §4: die Füllung zieht sich zurück, die Tusche bleibt mittig. Der Träger unter dem Papier nimmt `ink`, das Papier `paper`.
export const EDGE_TESTS = Object.freeze({ paper: 0.72, ink: 0.28 })

// ── DOM-Kante, unverändert aus deckviewer/ink-frame.js ──
function safeOf(npts) {
  let l = 0, t = 0, r = 0, b = 0
  for (const p of npts) {
    const dl = p[0], dr = 1 - p[0], dt = p[1], db = 1 - p[1]
    if (Math.min(dl, dr) <= Math.min(dt, db)) { if (dl < dr) l = Math.max(l, dl); else r = Math.max(r, dr) }
    else { if (dt < db) t = Math.max(t, dt); else b = Math.max(b, db) }
  }
  return { l, t, r, b }
}
const frames = new Map()
function buildFrame(seed, ar, W, gain) {
  const H = Math.round(W / ar), pts = contour('card', seed, W, H), c = document.createElement('canvas')
  c.width = W; c.height = H
  drawInk('card', c.getContext('2d'), pts, W, H, seed, gain)
  const npts = normContour('card', seed, ar)
  const clip = 'polygon(' + npts.map((p) => (p[0] * 100).toFixed(3) + '% ' + (p[1] * 100).toFixed(3) + '%').join(',') + ')'
  return { url: c.toDataURL('image/png'), clip, safe: safeOf(npts) }
}
// seed: eine Zahl je Blatt. ar: Seitenverhältnis. w: Zeichenbreite in Pixeln. gain: Gegenfaktor der Feder (1/Vergrößerung).
export function frame(seed, ar, w, gain = 1) {
  const key = seed + '|' + ar.toFixed(4) + '|' + w + '|' + gain.toFixed(3)
  if (!frames.has(key)) frames.set(key, buildFrame(seed, ar, w, gain))
  return frames.get(key)
}
// Viewer v4 inkOutside: das Blatt wird nicht beschnitten, der Rahmen wächst nach außen. weight = INK_GAIN des Viewers (1,5), Standard 1 = Kanon.
export function inkOutside(seed, w, h, { gain = 1, weight = 1 } = {}) {
  const s = frame(seed, w / h, 512).safe, pad = Math.round(Math.max(s.l * w, s.r * w, s.t * h, s.b * h) * 0.92), w2 = w + pad * 2, h2 = h + pad * 2
  return { pad, ink: frame(seed, w2 / h2, Math.min(1600, Math.round(w2 * 1.2)), gain * weight) }
}
// Viewer: <script> durch diesen Aufruf ersetzen, der Rest des Viewers bleibt (window.KFBInk.frame, Ereignis kfb-ink-ready).
export function installViewerGlobal() { window.KFBInk = { frame }; window.dispatchEvent(new CustomEvent('kfb-ink-ready')) }

// ── Flaches Kartenbild (Fächer, Kartenflug, Kugel-Punkte): dieselbe Form wie in 3D, außerhalb der Tusche durchsichtig ──
// Bild wie Arena artSheetTexture: das Viertel füllt den Extrempunkt-Rahmen der Kontur, kein Pixel der Seite fehlt, Maske und Bild sind eine Form.
// V-1182: ein Bild mit eigenem Format (crop.ownForm, Paket) kommt unverzerrt und ganz in die Fläche; die Kontur folgt ihm, außen bleibt es durchsichtig. Dieselbe Rechnung wie das Blatt im Builder (CE8).
export function flatCard(crop, { seed = 7, width = 1024, aspect = QUARTER_AR, gain = 1, paper = '#f7f0dd' } = {}) {
  const W = width, H = Math.round(W / aspect), own = crop?.ownForm, cH = own ? Math.round(W / QUARTER_AR) : H, c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d'), pts = contour('card', seed, W, cH)
  if (own) { const f = fitCell(crop.width, crop.height, W, H); g.translate(f.x, f.y); g.scale(f.w / W, f.h / cH) }
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const q of pts) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1] }
  g.save(); pathOf(g, pts); g.clip(); g.fillStyle = paper; g.fillRect(0, 0, W, cH)
  if (crop) g.drawImage(crop, x0, y0, x1 - x0, y1 - y0)
  g.restore()
  drawInk('card', g, pts, W, cH, seed, gain)
  return c
}

// Kontur der flachen Karte in Bildpunkten der Leinwand (Hero-Shot: Funken laufen auf der Kante). Dieselbe Rechnung wie flatCard, auch für Bilder mit eigenem Format (crop.ownForm).
export function flatContour(crop, { seed = 7, width = 1024, aspect = QUARTER_AR } = {}) {
  const W = width, H = Math.round(W / aspect), own = crop?.ownForm, cH = own ? Math.round(W / QUARTER_AR) : H, pts = contour('card', seed, W, cH)
  if (!own) return pts
  const f = fitCell(crop.width, crop.height, W, H); return pts.map((p) => [f.x + p[0] * f.w / W, f.y + p[1] * f.h / cH])
}

// ── 3D ──
// SOP §4/§5 auf eine Builder-Karte anwenden, je Karte (SOP §6): Papier 0,72, Tusche ohne Höhenversatz mit polygonOffset, toneMapped aus.
export function closeEdge(rec) {
  rec.mat.alphaTest = EDGE_TESTS.paper; rec.mat.toneMapped = false; rec.mat.needsUpdate = true
  Object.assign(rec.dmat, { toneMapped: false, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, needsUpdate: true })
  rec.decal.position.z = 0; rec.decal.renderOrder = 2
  return rec
}

export function createCardEdge({ THREE, params = {} } = {}) {
  const cb = createCardBuilder({ THREE, params: { aspect: QUARTER_AR, ...params } })
  // make: wie Builder make, dazu closeEdge und die zwei Steckplätze des Aufrufers. decorate(material, 'sheet'|'decal') vor dem ersten Bild (Spiel: Sprenkel-Erscheinen),
  // setGeometry((w, h, role) => BufferGeometry) legt Blatt und Tusche auf eine fremde Fläche (Spiel: Gelände), beide teilen dieselben UV.
  function make(card, { decorate, ...o } = {}) {
    const rec = closeEdge(cb.make(card, o))
    decorate?.(rec.mat, 'sheet'); decorate?.(rec.dmat, 'decal')
    rec.setGeometry = (fn) => { for (const [m, role] of [[rec.sheet, 'sheet'], [rec.decal, 'decal']]) { m.geometry.dispose(); m.geometry = fn(rec.width, rec.height, role) } return rec }
    rec.flat = (fo = {}) => flatCard(rec.art, { seed: rec.seed, aspect: cb.params.aspect, ...fo })
    return rec
  }
  return { builder: cb, make, crop: (card) => cb.crop(card), page: (card, w) => cb.pageOf(card, w), params: cb.params, dispose: () => cb.dispose() }
}
