// S1 · Kartenbilder (Host-Vertrag R1.2 §5): cardImage(deckId, n) auf dem Registry-Vertrag (cardMapping).
// Dünne Hülle über card-art-2d.js, derselbe Code-Pfad wie im Lab-Almanach (V-206): OW_ART.quarter().
// Die Viertelseite kommt ohne Beschnitt und ohne Tusche und wird mit `fit` eingepasst.
import * as THREE from 'three'
import './vendor/card-art-2d.js' // 1:1 aus overworld-v13 @main (Blob d14b497e), setzt window.OW_ART

// Kartenquelle festgenagelt: media/kfb auf georg-doc/kayfabizarro main @ ac9dbae (index.json Blob af276a8b)
export const MEDIA_COMMIT = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099'
const MEDIA_BASE = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${MEDIA_COMMIT}/media/kfb/`
// card-art-2d liest die Deck-Basis über window.OW_SRC.kfb('') (Vertrag der Vorlage)
if (typeof window !== 'undefined' && !window.OW_SRC) window.OW_SRC = { kfb: (p) => MEDIA_BASE + p }

// Seitenverhältnis der KFB-Karte = Viertel der Querformat-Seite (forget_utopia: 745,09 × 415,64 pt → 1,79)
export const CARD_AR = 1.79
export const PAPER = '#fbf3e2'

// Nacheinander statt gleichzeitig: quarter() lädt pdf.js beim ersten Aufruf, und ein zweiter Aufruf
// während dieses Ladens bekommt in der Vorlage still `null` (ensureLib: libTried). Die Vorlage bleibt
// unverändert; die Hülle reiht die Aufrufe ein, mit demselben 20-s-Wachhund wie pump() in der Vorlage.
const raw = new Map() // 'deck#n' -> Promise<{canvas, ar, page, quad} | null>
let chain = Promise.resolve()
const WATCHDOG_MS = 20000
export function cardImage(deckId, n, res = 1400) {
  const key = deckId + '#' + n
  if (!raw.has(key)) {
    const job = chain.then(() => Promise.race([
      window.OW_ART.quarter({ packId: deckId, n }, res),
      new Promise((ok) => setTimeout(() => { console.warn('[cardImage] Wachhund:', key); ok(null) }, WATCHDOG_MS)),
    ])).catch(() => null)
    chain = job.then(() => {}, () => {})
    raw.set(key, job)
    // kein Bild (Wachhund, Netz): nicht für die Sitzung merken, der nächste Aufruf versucht es neu
    job.then((v) => { if (!v) raw.delete(key) })
  }
  return raw.get(key)
}

// fit: das ganze Bild sichtbar, Rest Papierfarbe. Nichts wird abgeschnitten.
export function fitCanvas(src, ar, width = 1024) {
  const c = document.createElement('canvas')
  c.width = width; c.height = Math.round(width / ar)
  const g = c.getContext('2d')
  g.fillStyle = PAPER; g.fillRect(0, 0, c.width, c.height)
  const k = Math.min(c.width / src.width, c.height / src.height)
  const w = src.width * k, h = src.height * k
  g.drawImage(src, (c.width - w) / 2, (c.height - h) / 2, w, h)
  return c
}

export function makeTexture(canvas, anisotropy = 8) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = anisotropy
  return t
}

// Echte Kartentextur, je Karte und Zielformat einmal gebaut und für die Sitzung geteilt.
const textures = new Map()
export const cardStats = { requested: 0, loaded: 0, failed: 0 }
export function cardTexture(deckId, n, ar = CARD_AR) {
  const key = deckId + '#' + n + '@' + ar.toFixed(3)
  if (!textures.has(key)) {
    cardStats.requested++
    textures.set(key, cardImage(deckId, n).then((img) => {
      if (!img) { cardStats.failed++; textures.delete(key); return null }
      cardStats.loaded++
      return makeTexture(fitCanvas(img.canvas, ar))
    }))
  }
  return textures.get(key)
}

if (typeof window !== 'undefined') {
  window.__kfbCardImage = async (deckId, n) => {
    const r = await cardImage(deckId, n)
    return r && { page: r.page, quad: r.quad, ar: r.ar, w: r.canvas.width, h: r.canvas.height, png: r.canvas.toDataURL('image/png') }
  }
  window.__kfbCardStats = () => ({ ...cardStats, media: MEDIA_COMMIT, art: window.OW_ART?.version })
}
