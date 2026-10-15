// V-256 · Bildflächen-Inhalt, getrennt vom Träger. Art `card`: Viertelseite aus cardImage (ganz, randlos, nichts beschnitten) bzw. Platzhalter
// mit wörtlichem Drucktext. Der Inhalt kennt keinen Träger: Er bekommt eine Fläche übergeben (surface = { mesh, fit(meta) }), setzt die
// Textur auf mesh.material.map und meldet Seitenverhältnis und Quelle über fit(); wie die Fläche geformt ist (Rahmen, Maske, Größe),
// entscheidet der Träger. Weitere Arten (video per CSS3D, später loop/quote) kommen nach Vorlagen-Zeile §26.3 als eigene Fabriken dazu.
// Herkunft: aus billboard.js (B1) herausgelöst, Ablauf und Werte unverändert (Platzhalter, Wachhund-Neuversuch, veraltete Aufrufe → { stale }).
import * as THREE from 'three'
import { cardImage, PAPER, CARD_AR, subscribeRetry } from '../cardImage'
import { isCardSafe } from '../cardMapping'

export const BB_RES = 2800 // Seitenbreite für pdf.js → Viertelseite ~1400 px (Fläche bis 7 m); cardImage-Standard 1400 → 700 px wäre zu grob

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

// createCardContent({ card? }) → { kind, attach(surface), setCard(card) → Promise<info|{stale}>, current(), dispose() }
// surface.fit({ aspect, source, canvas: [w, h], fontScale, card }) wird nach jedem Bildwechsel gerufen und liefert die Träger-Info zurück.
export function createCardContent() {
  const state = { card: null, token: 0, info: null, disposed: false, surface: null, tex: null }
  const fit2048 = (src) => { if (src.width <= 2048) return src; const c = document.createElement('canvas'); c.width = 2048; c.height = Math.round(2048 * src.height / src.width); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height); return c }
  // Die Textur zeigt die Quelle direkt (Viertelseite aus cardImage bzw. Platzhalter): keine Kopie, kein Skalieren, kein Beschnitt
  // (Prüfer 6, Befund 3: eine zweite 4-MB-Kopie je Karte entfällt). Viertelseiten über 2048 px würden verkleinert kopiert.
  function show(src0, source) {
    const S = state.surface; if (!S) return null
    const src = fit2048(src0), mat = S.mesh.material
    if (!state.tex || state.tex.image !== src) { const t = new THREE.CanvasTexture(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; state.tex?.dispose(); state.tex = t; mat.map = t; mat.needsUpdate = true } // ganze Viertelseite, randlos
    state.info = S.fit({ aspect: src.width / src.height, source, canvas: [src.width, src.height], fontScale: src.__fontScale ?? null, card: state.card ? state.card.deck.id + '#' + state.card.num : null })
    state.tex.needsUpdate = true
    return state.info
  }
  // Ergebnis eines überholten Aufrufs: { stale: true } statt der Daten der neueren Karte (Prüfer 6, Befund 6)
  function setCard(card) {
    if (card && card === state.card && state.info?.source === 'CARD') return Promise.resolve(state.info) // dieselbe Karte steht schon: kein Platzhalter-Flackern
    const tk = ++state.token; state.card = card
    show(placeholderCanvas(card), 'PLACEHOLDER')
    if (!card || !isCardSafe(card.deck.id, card.num)) return Promise.resolve(state.info)
    return cardImage(card.deck.id, card.num, BB_RES).then((img) => {
      if (state.disposed || tk !== state.token) return { stale: true }
      if (img) show(img.canvas, 'CARD')
      return state.info
    })
  }
  // Neuer Versuch nach Ladefehler (Wachhund, Netz): derselbe Takt wie CardArt/useCardTexture (Prüfer 6, Befund 5)
  const offRetry = subscribeRetry(() => { const c = state.card; if (!state.disposed && c && state.info?.source === 'PLACEHOLDER' && isCardSafe(c.deck.id, c.num)) setCard(c) })
  return {
    kind: 'card',
    attach(surface) { state.surface = surface },
    setCard,
    current: () => state.info,
    texture: () => state.tex,
    dispose() { state.disposed = true; offRetry(); state.tex?.dispose(); state.tex = null },
  }
}
