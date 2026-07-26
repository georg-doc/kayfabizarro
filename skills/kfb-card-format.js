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

// Was `cover` an derselben Zelle WEGSCHNEIDEN würde — die Gegenzahl zur Abnahme.
// Ein Anteil (0..1) der Zellhöhe bzw. -breite, je Seite die Hälfte davon.
export function coverLoss(cellW, cellH, sheetAR = CARD_AR) {
  if (!(cellW > 0 && cellH > 0)) return { hoehe: 0, breite: 0 };
  const cellAR = cellW / cellH;
  return cellAR < sheetAR
    ? { hoehe: 1 - cellAR / sheetAR, breite: 0 }   // Zelle zu hoch → oben/unten weg
    : { hoehe: 0, breite: 1 - sheetAR / cellAR };  // Zelle zu breit → links/rechts weg
}
