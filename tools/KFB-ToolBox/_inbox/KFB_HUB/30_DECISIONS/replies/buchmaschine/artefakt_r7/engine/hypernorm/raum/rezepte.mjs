// kfb-hypernorm · Raum-Rezepte R1b (3D-Plan R1, W-009; WSV 07.11.2026)
// title: Englisch, für alles, was im Bild erscheint (Proben, Kontaktbögen); titel und notiz: Arbeitsunterlage.
// Rezepte sind Daten (kfb.hn-raum/1, Schema in schema/kfb.hn-raum.1.schema.json). Die Mechanik steckt in raum.mjs; der 3D-Artist (R2) liefert
// weitere Rezepte im selben Format, ladbar mit ladeRezepte(url). Keine Logik hier außer Auswahl und Normalisierung.
//
// art 'uebergang': spielt zu Beginn einer Einstellung `beats` Beats lang (endet auf dem Beat) zwischen vorig und jetzt.
//   form.typ: 'karte' (Karte mit Dicke, vorn/hinten) · 'kubus' (Quader, Tiefe = Bildbreite; vorn/rechts) · 'ebene' (eine Fläche, vorn)
//   seiten: welches Bild auf welche Seite ('vorig' | 'jetzt'); hintergrund: { farbe } oder { tex, dunkel }
//   spur: Kanäle rot (Grad xyz) und pos (Bildhöhen xyz) als Schlüssel [p, [x,y,z]], weich verbunden (Hermite, Ruhe an Anfang und Ende)
//   licht: richtung (Blickraum), staerke (0 = flach), glanz (nur Karten). Frontal ergibt das Licht genau 1: Anfang und Ende sind bildgleich zum 2D-Bild.
//   rueckfall: Übergang im 2D-Pfad (ohne WebGL2). lesen.lesetext false: nie bei Lesetext-Rollen oder Darstellern (Typo-Konzept 3, Plan Abschnitt 4).
// art 'linse': liegt auf allen Einstellungen (L1): k −1 nach innen (Kuppel, Hohlschale) · 0 flach · +1 Fischauge nach vorn; ab Farbsaum;
//   kKick Puls auf den Kick (nur Kamera-Profil reactive); flip: an der Nahtstelle (Beginn der Absicht) in flipBeats von −k nach +k (Durchflug).
//   lesen.maxK: Obergrenze von |k| bei Lesetext.

export const REZEPTE = Object.freeze({
  'karte.wende': Object.freeze({ schema: 'kfb.hn-raum/1', id: 'karte.wende', titel: 'Karten-Wende', title: 'Card flip', art: 'uebergang', beats: 2, rueckfall: 'CROSS', gewicht: 1,
    flaechen: ['fassade', 'video', 'boden', 'kuppel'],
    form: { typ: 'karte', dicke: .03, rand: '#efe6d2' },
    seiten: { vorn: 'vorig', hinten: 'jetzt' },
    hintergrund: { tex: 'jetzt', dunkel: .55 },
    kamera: { fov: 28 },
    spur: { rot: [[0, [0, 0, 0]], [.5, [-7, 90, 3]], [1, [0, 180, 0]]], pos: [[0, [0, 0, 0]], [.5, [0, .04, -.7]], [1, [0, 0, 0]]] },
    licht: { richtung: [-.45, .55, 1], staerke: .6, glanz: .22 },
    lesen: { lesetext: false, maxNeigung: 60 },
    notiz: 'Die alte Einstellung ist die Vorderseite einer Karte aus Karton, die Karte hebt sich, wendet über die Hochkante und legt sich mit der neuen Einstellung zurück. Dahinter liegt die neue Einstellung abgedunkelt.' }),
  'kubus.dreh': Object.freeze({ schema: 'kfb.hn-raum/1', id: 'kubus.dreh', titel: 'Kubus Film ↔ Collage', title: 'Cube film ↔ collage', art: 'uebergang', beats: 2, rueckfall: 'CROSS', gewicht: 1,
    flaechen: ['fassade', 'video', 'kuppel'],
    vorzug: { base: ['FILM'], faktor: 3 },
    form: { typ: 'kubus', farbe: '#2b241b' },
    seiten: { vorn: 'vorig', rechts: 'jetzt' },
    hintergrund: { farbe: '#14110d' },
    kamera: { fov: 30 },
    spur: { rot: [[0, [0, 0, 0]], [1, [0, -90, 0]]], pos: [[0, [0, 0, 0]], [.5, [0, 0, -.85]], [1, [0, 0, 0]]] },
    licht: { richtung: [.5, .45, 1], staerke: .65, glanz: 0 },
    lesen: { lesetext: false, maxNeigung: 60 },
    notiz: 'Ein Quader dreht eine Vierteldrehung nach links: vorn die alte Einstellung, von rechts kommt die neue. Bevorzugt, wenn eine Seite Film ist (Film ↔ Collage).' }),
  'kuppel.woelbung': Object.freeze({ schema: 'kfb.hn-raum/1', id: 'kuppel.woelbung', titel: 'Kuppel-Wölbung (Linse L1)', title: 'Dome curvature (lens L1)', art: 'linse',
    flaechen: ['kuppel', 'video', 'fassade'],
    linse: { k: -.6, ab: .25, kKick: .15, flip: false, flipBeats: 2 },
    lesen: { lesetext: true, maxK: .35 },
    notiz: 'Wölbung des ganzen Bildes: nach innen wie eine Hohlschale (Kuppel), flach, oder nach vorn wie ein Fischauge. Ränder bleiben am Platz, nichts wird schwarz.' })
});

const extra = new Map();
export const rezept = id => extra.get(id) || REZEPTE[id] || null;
export const alleRezepte = () => [...Object.values(REZEPTE), ...extra.values()];
// weitere Rezepte (Artist, R2): einzelnes Rezept oder { rezepte: [...] }
export async function ladeRezepte(url) {
  const m = await (await fetch(url, { credentials: 'omit' })).json(), L = m.rezepte || [m];
  for (const r of L) { if (r.schema !== 'kfb.hn-raum/1' || !r.id) throw new Error('Raum-Rezept: Schema unbekannt ' + r.schema); extra.set(r.id, Object.freeze(r)); }
  return L.map(r => r.id);
}
export const passtZu = (R, flaeche) => !!R && (!R.flaechen || R.flaechen.includes(flaeche));
// Linse aus Rezept-Id, Objekt (ergänzt kuppel.woelbung) oder null
export function linseNorm(x) {
  if (!x) return null;
  if (typeof x === 'string') { const R = rezept(x); return R && R.art === 'linse' ? Object.assign({ lesen: R.lesen }, R.linse) : null; }
  const R = rezept(x.rezept || 'kuppel.woelbung'); return Object.assign({ lesen: R.lesen }, R.linse, x);
}
// Hermite-Spur: Schlüssel [[p, [x,y,z]], …], Tangenten nach Catmull-Rom innen, 0 an den Enden (Ruhe vorher und nachher)
export function spurBei(keys, p) {
  if (!keys || !keys.length) return [0, 0, 0];
  if (p <= keys[0][0]) return keys[0][1].slice(); const n = keys.length; if (p >= keys[n - 1][0]) return keys[n - 1][1].slice();
  let i = 0; while (i < n - 2 && p > keys[i + 1][0]) i++;
  const [p0, a] = keys[i], [p1, c] = keys[i + 1], h = p1 - p0, u = (p - p0) / h, u2 = u * u, u3 = u2 * u;
  const tan = j => j <= 0 || j >= n - 1 ? [0, 0, 0] : keys[j + 1][1].map((v, q) => (v - keys[j - 1][1][q]) / (keys[j + 1][0] - keys[j - 1][0]));
  const m0 = tan(i), m1 = tan(i + 1);
  return a.map((v, q) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * h * m0[q] + (-2 * u3 + 3 * u2) * c[q] + (u3 - u2) * h * m1[q]);
}
// Neigung der Bildfläche zur Kamera (Grad) zum Fortschritt p: für die Lese-Regel (Lesetext < 15°)
export function neigungBei(R, p) { const r = spurBei(R.spur && R.spur.rot, p); const rx = r[0] * Math.PI / 180, ry = r[1] * Math.PI / 180;
  const nz = Math.abs(Math.cos(rx) * Math.cos(ry)); return Math.acos(Math.min(1, nz)) * 180 / Math.PI; }
