// ============================================================================
// card-backside.js — KFB Travel v24 · Die kanonische Kartenrückseite, EINMAL
// ----------------------------------------------------------------------------
// Georg, 29.8.: „karten sollten nie mit text angezeigt werden, platzhalter ist immer die KFB card
// backside, die geladen (oder durch game interactions revealed)".
// Georg, 5.9.: „es werden noch texte/platzhalter bei karten angezeigt, statt der KFB backside."
//
// Beim ersten Mal habe ich nur `sky-cards.js` umgestellt — und das war der halbe Job. Es gibt in
// dieser Welt MEHRERE Kartenmaler, und der zweite (`academy-deck.fieldTexture`) trug seinen
// Textsteckbrief weiter; sein eigener Kommentar sagte sogar „das Feld ist erkennbar ein
// Platzhalter". Eine Regel, die an einer von zwei Stellen steht, ist keine Regel.
//
// **Warum ein eigenes Modul und nicht ein Import aus sky-cards.js:** `sky-cards.js` importiert
// `contourAt` und `SHEET_AR` AUS `academy-deck.js`. Ein Gegenimport wäre ein Zyklus. Dieses Modul
// hängt an nichts — es bekommt den fertigen Kontext und die Maße vom Aufrufer und malt.
//
//   import { malRueckseite, beiRueckseite, rueckseiteBereit } from './card-backside.js';
//   g.save(); pathOf(g, pts); g.clip();
//   malRueckseite(g, W, H);              // Papier + Bild, deckend
//   g.restore();
//   if (!rueckseiteBereit()) beiRueckseite(nochmalMalen);
// ============================================================================

export const PAPER = '#efe6d0';

// EINE Datei, EINMAL geladen, von allen Kartenmalern geteilt (`card-carrier.js` nimmt dieselbe
// URL — die Flugkarte des Pets und die Sammelkarten sind dasselbe Blatt).
const URL_RUECKSEITE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/'
  + 'media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png';

let bild = null, laeuft = false;
const warter = [];

export function rueckseiteBereit() { return !!bild; }

export function rueckseiteLaden() {
  if (bild || laeuft) return;
  laeuft = true;
  const im = new Image();
  im.crossOrigin = 'anonymous';
  im.onload = () => {
    bild = im; laeuft = false;
    // Alle Karten, die schon ein Blankoblatt tragen, bekommen ihr Motiv nachgereicht.
    while (warter.length) { try { warter.shift()(); } catch (e) {} }
  };
  im.onerror = () => { laeuft = false; console.warn('[card-backside] Rückseite nicht geladen'); };
  im.src = URL_RUECKSEITE;
}

/** Nachreichen anmelden. Ruft `fn` genau einmal, wenn das Bild da ist — und startet das Laden,
 *  falls es noch niemand getan hat. Ist es schon da, ruft es sofort. */
export function beiRueckseite(fn) {
  if (bild) { try { fn(); } catch (e) {} return; }
  warter.push(fn);
  rueckseiteLaden();
}

/** Papier + Bild in ein bereits geclipptes Canvas. `cover`: das Blatt ist voll bedeckt, der
 *  Überstand wird mittig beschnitten. Kein Einpassen des Seitenverhältnisses — eine Rückseite ist
 *  keine Deckzelle, sie darf beschnitten werden, aber nie Papier durchblitzen lassen.
 *  Bis das Bild da ist: nur Papier. KEIN Wort, keine Schraffur, keine Nummer. */
export function malRueckseite(g, W, H) {
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
  if (!bild) return false;
  const iw = bild.naturalWidth || bild.width, ih = bild.naturalHeight || bild.height;
  const s = Math.max(W / iw, H / ih);
  g.drawImage(bild, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
  return true;
}
