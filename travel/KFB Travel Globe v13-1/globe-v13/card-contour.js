// ============================================================================
// card-contour.js — die kanonische Kartenkante, ZITAT aus academy-deck.js
// ----------------------------------------------------------------------------
// `sky-cards.js` importiert `contourAt` und `SHEET_AR` aus `terrain-v17/academy-deck.js`.
// Diese Datei hängt aber an `world-context.js` (MODES) und `kfb-ink.js` — beides braucht die
// Kartenkante nicht, und beides zöge den Akademie-Stack in den Globe-Runner.
//
// **Deshalb ein ZITAT statt eines Nachbaus** (Regel 2 aus `use-what-works_v1.md`: übernehmen heißt
// kopieren, mit Zeilennummern, plus einer Naht). Wörtlich aus `terrain-v17/academy-deck.js`:
//   · Zeile 240  `const CONTOUR_REF = 1024;`
//   · Zeile 244  `const INK_WOB = 1.4, INK_BOW = 1.4 * 0.14;   // = 0,196`
//   · Zeile 245–253  `_contours` + `normContour(seed)`
//   · Zeile 254  `export function contourAt(seed, W, H)`
//   · Zeile 43   `export const SHEET_AR = CARD_AR;`
// Nichts davon ist umgeschrieben. Der Kommentar der Quelle zu den Zahlen gilt weiter: v11 ruft
// `brushLoop(…, 1.4, 1.4 * 0.14)`, und bis 25.7.2026 stand dort `INK_BOW = 1.4` — siebenmal zu
// viel („Bend statt ink").
//
// **Die Naht ist diese Datei selbst:** hier endet das Zitat, hier beginnt der Halter. Wer die
// Akademie-Karten ändert, muss diese vier Zeilen nachziehen — sie stehen deshalb einzeln benannt.
// ============================================================================

import { brushLoop } from './ink-tail.js';
import { CARD_AR } from '../cardbuilder/kfb-card-format.js';

export const SHEET_AR = CARD_AR;

const CONTOUR_REF = 1024;
const INK_WOB = 1.4, INK_BOW = 1.4 * 0.14;   // = 0,196
const _contours = {};

function normContour(seed) {
  if (_contours[seed]) return _contours[seed];
  const W = CONTOUR_REF, H = Math.round(W / SHEET_AR), m = 14;
  const pts = brushLoop(m, m, W - m, H - m, seed, INK_WOB, INK_BOW);
  _contours[seed] = pts.map((p) => [p[0] / W, p[1] / H]);
  return _contours[seed];
}

export function contourAt(seed, W, H) { return normContour(seed).map((p) => [p[0] * W, p[1] * H]); }
