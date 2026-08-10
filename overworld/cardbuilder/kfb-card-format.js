// ============================================================================
// kfb-card-format.js — KFB · Slice S62 · DAS SOLLFORMAT DER KARTE
// ----------------------------------------------------------------------------
// **Eine Zahl, ein Ort.** Jede KFB-Karte hat dasselbe Blattformat — egal aus
// welchem Deck sie kommt. Entscheidung Georg, 26.7.2026: Karten, die man
// ausschneidet und mischt, müssen gleich groß sein.
//
// Warum das ein eigenes Modul ist: die Zahl stand dreimal im Projekt
// (`kfb-card-builder.js` P.aspect · `academy-deck.js` SHEET_AR ·
// `sky-cards.js` KFB_CARD_AR) mit einem Kommentar daneben, der mahnte, sie
// gleich zu halten. Ein Kommentar ist keine Verdrahtung. Fehlerklasse v8:
// *eine Zahl, ein Ort.*
//
// GEMESSEN (S61, `tools/cardgrid-pick.html`) sind die Zellen der Decks
// UNTERSCHIEDLICH:
//
//   forget_utopia     284,6 × 194,7 pt   →  1,462
//   ignore_dystopia   294,0 × 168,9 pt   →  1,740   ← Anker
//   embrace_protopia  328,2 × 166,7 pt   →  1,969
//
// `ignore_dystopia` ist der Anker, weil es zwischen den anderen liegt: A und C
// gehen je den halben Weg, statt dass ein Extrem die Norm setzt.
//
// **Was mit dem Unterschied passiert: er wird Papier, nicht Verlust.** Die
// gemessene Zelle wird MITTIG ins Sollformat gelegt (`fitCell`) — nie `cover`.
// `cover` schnitt bei Deck A 18 % der Zellhöhe weg, je 9 % oben und unten, und
// genau dort stehen Titel und LORE-Zeile. Der Fehlbetrag wird cremefarbener
// Rand INNERHALB der Tuschekante: der Rand ist Teil des Blattes, nicht ein
// Fehler am Bild.
// ============================================================================

// Breite / Höhe des Kartenblatts (Landscape). Die eine Zahl.
export const CARD_AR = 1.74;

// Woher die Zahl kommt — zitierbar, damit sie niemand „rundet".
export const CARD_AR_FROM = {
  entschieden: '2026-07-26 (Georg): ein Sollformat für alle Decks',
  anker: 'ignore_dystopia · Zelle 294,0 × 168,9 pt = 1,740',
  gemessen: { forget_utopia: 1.462, ignore_dystopia: 1.740, embrace_protopia: 1.969 },
  werkzeug: 'tools/cardgrid-pick.html (S61)',
};

// Die gemessene Zelle mittig ins Blatt legen (contain), ohne etwas abzuschneiden.
// Gibt Zeichenrechteck und die Randanteile zurück — die Randanteile SIND die
// Abnahmezahl dieses Slices.
export function fitCell(cellW, cellH, sheetW, sheetH) {
  if (!(cellW > 0 && cellH > 0 && sheetW > 0 && sheetH > 0)) {
    return { x: 0, y: 0, w: sheetW || 0, h: sheetH || 0, randX: 0, randY: 0, scale: 1 };
  }
  const s = Math.min(sheetW / cellW, sheetH / cellH);
  const w = cellW * s, h = cellH * s;
  return {
    x: (sheetW - w) / 2, y: (sheetH - h) / 2, w, h, scale: s,
    randX: (sheetW - w) / 2 / sheetW,   // Anteil der Blattbreite, je Seite
    randY: (sheetH - h) / 2 / sheetH,   // Anteil der Blatthöhe, oben wie unten
  };
}

// S82/S83 · **Kein Gutter, keine gezogenen Bildzeilen.** `fitCell` legt die Zelle mittig ein (S62:
// nichts abschneiden); der Fehlbetrag daneben ist ein Band — bei Zellformat 1,969 gegen Sollformat 1,74
// sind das 5,88 % oben und unten, bei 1,462 sind es 7,85 % links und rechts.
//
// **Vier Irrwege, alle gemessen, alle verworfen** — sie stehen hier, damit sie niemand wieder nimmt:
//  1. Feste Cremefarbe → weiße Streifen (Georgs erster Befund): jedes Deck hat eigenes Papier.
//  2. Mittelwert der Randzeile → zu dunkel (221 gegen Papier 231), die Zeile mittelt Schrift mit.
//  3. Helligkeits-Quantil des Randes → auf einem Blatt mit Zonenfeld `rgb(216,218,239)`: hellblauer Rand.
//  4. Anschnitt (die Randzeile über das Band GEZOGEN) → `forget_utopia`: dunkler Schmier, weil dort die
//     Außenspalte der Kartenrahmen ist; und mit gesuchter Papierzeile immer noch **verzerrte Bildzeilen**
//     (Georgs Screenshot: gestreckte blaue Linie und Farbschlieren oben und unten).
//
// **Was gilt: EINE FLÄCHE in der Papierfarbe der Karte.** Gesucht wird die Papierzeile (im äußeren
// Rand die Linie mit der höchsten mittleren Helligkeit), von ihr wird der MEDIAN als eine Farbe
// genommen und das Band damit gefüllt. Keine Pixel werden gestreckt (also keine Schlieren), keine
// Farbe geraten (es ist die Farbe der Karte), und kein Pixel abgeschnitten.
let _pad = null;
function padCtx(crop, w, h) {
  if (!_pad) _pad = document.createElement('canvas');
  if (_pad.width < w) _pad.width = w;
  if (_pad.height < h) _pad.height = h;
  const cx = _pad.getContext('2d', { willReadFrequently: true });
  cx.clearRect(0, 0, w, h);
  cx.drawImage(crop, 0, 0);
  return cx;
}
function lineStat(cx, x, y, w, h) {
  const d = cx.getImageData(x, y, w, h).data;
  const px = [];
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue;
    const l = (d[i] + d[i + 1] + d[i + 2]) / 3;
    px.push([d[i], d[i + 1], d[i + 2], l]); sum += l;
  }
  if (!px.length) return null;
  px.sort((a, b) => a[3] - b[3]);
  const m = px[Math.floor(px.length / 2)];
  return { lum: sum / px.length, css: 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')', med: Math.round(m[3]) };
}
// Die hellste Linie im äußeren Rand IST das Papier — der Rand der gemessenen Zelle ist es nicht
// verlässlich (bei einem Deck liegt dort der dunkle Rahmen des Kartendesigns).
function paperTone(cx, side, cw, ch, fallback) {
  const ref = (side === 'top' || side === 'bottom') ? ch : cw;
  const span = Math.max(4, Math.round(ref * 0.14)), step = Math.max(1, Math.round(span / 12));
  let best = null, bestK = 1;
  for (let k = 1; k <= span; k += step) {
    let x = 0, y = 0, w = cw, h = 2;
    if (side === 'top') y = k;
    else if (side === 'bottom') y = ch - k - 2;
    else { w = 2; h = ch; x = side === 'left' ? k : cw - k - 2; }
    if (x < 0 || y < 0 || x + w > cw || y + h > ch) continue;
    const st = lineStat(cx, x, y, w, h);
    if (st && (!best || st.lum > best.lum)) { best = st; bestK = k; }
  }
  return best ? { css: best.css, k: bestK, lum: Math.round(best.lum) } : { css: fallback, k: 0, lum: null };
}
export function fillPad(g, crop, f, sheetW, sheetH, fallback) {
  const cw = (crop && (crop.width || crop.naturalWidth)) || 0;
  const ch = (crop && (crop.height || crop.naturalHeight)) || 0;
  const padX = f.x > 0.5, padY = f.y > 0.5;
  if (!cw || !ch || (!padX && !padY)) return { padX: 0, padY: 0, art: 'keins' };
  let cx = null;
  try { cx = padCtx(crop, cw, ch); } catch (e) { cx = null; }
  const tone = (side) => (cx ? paperTone(cx, side, cw, ch, fallback) : { css: fallback, k: 0, lum: null });
  const found = {};
  if (padY) {
    const top = Math.ceil(f.y) + 1, bot = Math.floor(f.y + f.h) - 1;
    const t = tone('top'), b = tone('bottom');
    found.oben = t; found.unten = b;
    g.fillStyle = t.css; g.fillRect(0, 0, sheetW, top);
    g.fillStyle = b.css; g.fillRect(0, bot, sheetW, sheetH - bot);
  }
  if (padX) {
    const left = Math.ceil(f.x) + 1, right = Math.floor(f.x + f.w) - 1;
    const l = tone('left'), r = tone('right');
    found.links = l; found.rechts = r;
    g.fillStyle = l.css; g.fillRect(0, 0, left, sheetH);
    g.fillStyle = r.css; g.fillRect(right, 0, sheetW - right, sheetH);
  }
  return { padX: +(f.randX || 0).toFixed(4), padY: +(f.randY || 0).toFixed(4), art: 'papierfläche', papier: found };
}

// Was `cover` an derselben Zelle WEGSCHNEIDEN würde — die Gegenzahl zur Abnahme.
// Ein Anteil (0..1) der Zellhöhe bzw. -breite, je Seite die Hälfte davon.
export function coverLoss(cellW, cellH, sheetAR = CARD_AR) {
  if (!(cellW > 0 && cellH > 0)) return { hoehe: 0, breite: 0 };
  const cellAR = cellW / cellH;
  return cellAR < sheetAR
    ? { hoehe: 1 - cellAR / sheetAR, breite: 0 }   // Zelle zu hoch → oben/unten weg
    : { hoehe: 0, breite: 1 - sheetAR / cellAR };  // Zelle zu breit → links/rechts weg
}
