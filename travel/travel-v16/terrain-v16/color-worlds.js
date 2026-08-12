// ============================================================================
// color-worlds.js — KFB Travel v16 · Slice L2 · Farbwelten als ORT · cw-v1.0
// ----------------------------------------------------------------------------
// Auftrag Georg (12.8.): „nicht immer mit dem gleichen Story-(Color-)Mode und
// Terrain- bzw. Skydome-Farben starten. Und beim Fliegen neues Biom und
// Farbwelten entdecken, die langsam morphen, wabern & pulsieren = die Welt ist
// farbenfroh und lebt."
//
// **Was hier NICHT gebaut wird, weil es schon da ist.** Der Shader in
// `voxel-terrain.js` hält seit v3 ZWEI Paletten gleichzeitig (`uPA0..2` /
// `uPB0..2`) und blendet sie über eine radiale Front (`uFront`, `uCenterX/Z`,
// `uMaxDist`): `sel = smoothstep(uFront-0.07, uFront+0.07, dist/uMaxDist)`.
// `terrain.setPalette(stops, {spread, cx, cz, maxDist, dur})` fährt sie.
// Bis v15 wurde das für genau EINE Sache benutzt: den Palettenwechsel im Panel.
// Dieses Modul liefert deshalb **keinen Renderer, sondern die zwei fehlenden
// Entscheidungen** — WANN eine Front läuft und WELCHE Palette sie bringt.
//
// ── Die drei Regeln, die vor dem ersten Bild standen ────────────────────────
// (1) **Farbwelt ≠ Story-Modus.** Der Story-Modus trägt die TINTE: HUD, Würfel,
//     Speedlines, Pet-Karte, Ton-Mood. Er gehört der Erzählung (Karten, Würfel)
//     und darf sich nicht ändern, weil jemand nach Norden fliegt. Eine Region
//     wechselt die FARBWELT (Terrain + Himmel + Nebel) — nichts sonst.
//     Das ist dieselbe Trennung wie in S58 („die Tinte bleibt beim Story-Modus").
// (2) ⚠ **Biom ist Farbe und Props, NIE Höhe.** `terrain.setWorldContext()` ruft
//     `rebakeAll()`, und `biomeShape`/`heightScale` verbiegen das Höhenfeld —
//     eine Biomgrenze im Flug würde die Landschaft UNTER dem Spieler neu wachsen
//     lassen. Regionen fassen deshalb nur Uniforms an, nie den WorldContext.
//     (Gleiche Disziplin wie die Wasserregel: „Farbe, niemals eine Ebene".)
// (3) **EINE Bewegung, nicht drei.** „Morphen + Wabern + Pulsieren" gleichzeitig
//     ist die Fehlerklasse aus Overworld v12 (Naht 82: zwei widersprüchliche
//     Bewegungen liest man als Ruckeln — Georgs Konfetti-Befund). Also hat dieses
//     Modul genau EINEN Mechanismus, die Front, und benutzt ihn auf zwei Skalen:
//     **Regionswechsel** (große Front, neue Palette) und **Atem** (kleine Front,
//     dieselbe Palette um wenige Grad im Farbton gedreht). Die Welt atmet in
//     derselben Bewegung, in der sie sich ändert. Wabern und Puls kommen aus
//     Kanälen, die es schon gibt (Cube-Tanz, `uGlowB`/`uGlowE` am Beat).
//
//   const cw = createColorWorlds({ ids: [...], seed: 'abc' });
//   cw.regionAt(x, z) → { key, idx, id }
//   const ev = cw.update(dt, x, z);   // null | { kind:'region'|'atem', id, hue, dur, dist }
// ============================================================================

const CW_VERSION = 'cw-v1.0';

// FNV-1a, wie in `world-context.js` — hier lokal, weil dieses Modul sonst nur
// wegen einer Hash-Funktion am WorldContext hängen würde.
function h32(s) {
  let h = 0x811c9dc5 >>> 0;
  s = String(s);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function unit(...parts) { return (h32(parts.join('·')) >>> 8) / 16777216; }

export function createColorWorlds(opts = {}) {
  const P = Object.assign({
    on: true,
    // Kantenlänge einer Farbwelt. Bei Reisetempo 42 u/s sind 1800 u **43 Sekunden** —
    // lang genug, daß eine Welt eine Welt ist, kurz genug, daß Entdecken sich lohnt.
    cellSize: 1800,
    // **Reihenversatz statt Rauschen.** Ein reines Gitter aus Farbwelten wäre ein
    // Schachbrett und würde als solches gelesen. Jede Reihe verschiebt sich um einen
    // gehashten Betrag — Mauerwerk. Das kostet keinen Rauschruf und ist trotzdem
    // eine reine Funktion des Ortes.
    rowShift: 0.6,
    crossDur: 9,       // s — wie lange die Front über die Welt läuft
    crossDist: 900,    // u — Radius der Front (der Horizont liegt bei ~520)
    // Der Atem: dieselbe Front, kleiner und langsamer, mit einer Farbtondrehung.
    atemOn: true,
    atemGap: 44,       // s zwischen zwei Atemzügen
    atemHue: 0.035,    // Farbtondrehung je Atemzug (≈ 12,6°)
    atemSwing: 3,      // nach so vielen Atemzügen kehrt die Richtung — die Welt driftet nicht weg
    atemDur: 22, atemDist: 620,
    ids: ['story', 'cubescape', 'bubblegum', 'toybox', 'mint_pop', 'sunset_arcade',
          'grape_soda', 'seafoam', 'ember', 'from_cards'],
  }, opts.params || {});

  let seed = String(opts.seed != null ? opts.seed : 'kfb');
  let order = P.ids.slice();
  let curKey = null, curId = null;
  let atemT = 0, atemN = 0, hue = 0;
  let regionChanges = 0, atemzuege = 0;

  // Die Sitzungsreihenfolge der Farbwelten. Sie ist gemischt, aber **deterministisch aus
  // dem Sitzungs-Seed**: dieselbe Zahl gibt dieselbe Welt. Ohne das wäre „ich hatte
  // gerade eine schöne Welt" nicht reproduzierbar, und ein Befund ohne Reproduktion ist
  // eine Anekdote.
  function shuffle() {
    order = P.ids.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(unit(seed, 'ord', i) * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
  }
  shuffle();

  // Welche Farbwelt liegt an diesem Ort? **Reine Funktion des Ortes** (plus Sitzungs-Seed) —
  // dasselbe Prinzip wie `stepAt` in L1 und wie die Ortsschicht in Overworld: Orte werden
  // GERECHNET, nicht vergeben. Damit gibt es keinen Zustand, der auseinanderlaufen kann.
  function regionAt(x, z) {
    // **Der Ursprung liegt in der MITTE einer Kachel, nicht auf ihrer Ecke.** Gemessen: mit
    // `floor(z/cellSize)` startet der Spieler bei (0,0) genau auf einer Kante, und die erste
    // Bewegung löst eine Front aus, die niemand verdient hat — im Boot-Log „2 Wechsel" in den
    // ersten Sekunden. Ein halbes Kachelmaß Versatz macht daraus einen Ort.
    const half = P.cellSize / 2;
    const cz = Math.floor(((z || 0) + half) / P.cellSize);
    const off = (unit(seed, 'row', cz) - 0.5) * P.cellSize * P.rowShift;
    const cx = Math.floor(((x || 0) + half + off) / P.cellSize);
    const key = cx + '/' + cz;
    const idx = Math.floor(unit(seed, 'cell', cx, cz) * order.length) % order.length;
    return { key, idx, id: order[idx], cx, cz };
  }

  // Ein Ereignis oder nichts. Der Aufrufer entscheidet, was er damit macht — dieses Modul
  // kennt weder Shader noch Paletten-Tabelle, nur Kennungen.
  function update(dt, x, z) {
    if (!P.on) return null;
    const r = regionAt(x, z);
    if (r.key !== curKey) {
      const first = curKey === null;
      curKey = r.key;
      if (r.id !== curId || first) {
        curId = r.id;
        regionChanges++;
        atemT = 0;   // eine neue Welt atmet erst, wenn sie angekommen ist
        // Beim ALLERERSTEN Aufruf gibt es keine Front: der Spieler hat nichts überflogen,
        // er ist gerade erst da. Eine Front ohne Anlaß liest sich als Defekt (§4v/85).
        return first ? { kind: 'start', id: curId, hue, dur: 0, dist: 0 }
                     : { kind: 'region', id: curId, hue, dur: P.crossDur, dist: P.crossDist };
      }
      // Nachbar-Kachel mit derselben Farbwelt: **keine Front.** Bei zehn Welten passiert das
      // in etwa jeder zehnten Grenze — dann ist die Grenze eben unsichtbar, und das ist
      // richtiger, als eine Front für einen Wechsel zu fahren, den es nicht gibt.
      return null;
    }
    if (!P.atemOn) return null;
    atemT += dt;
    if (atemT >= P.atemGap) {
      atemT = 0; atemN++; atemzuege++;
      // Hin und zurück: nach `atemSwing` Zügen kehrt die Richtung. Eine Drehung, die immer
      // weiterläuft, ist nach zehn Minuten in einer Farbe, die niemand gewählt hat.
      const dir = (Math.floor(atemN / P.atemSwing) % 2 === 0) ? 1 : -1;
      hue += dir * P.atemHue;
      return { kind: 'atem', id: curId, hue, dur: P.atemDur, dist: P.atemDist };
    }
    return null;
  }

  return {
    name: 'color-worlds', version: CW_VERSION,
    regionAt, update,
    get params() { return P; },
    setParams(p) { Object.assign(P, p || {}); },
    get seed() { return seed; },
    get id() { return curId; },
    get hue() { return hue; },
    get order() { return order.slice(); },
    // Ein neuer Würfelwurf für die Sitzung: neue Reihenfolge, neue Verteilung, alles
    // reproduzierbar aus der einen Zahl. `curKey` wird verworfen, damit der nächste
    // `update` die Welt am aktuellen Ort neu setzt.
    reroll(s) { seed = String(s != null ? s : Math.floor(Math.random() * 1e9)); shuffle(); curKey = null; curId = null; hue = 0; atemN = 0; atemT = 0; return seed; },
    // Was liegt in Reichweite? Für das Panel: die Welt hier und die vier Nachbarn.
    neighbours(x, z) {
      const c = P.cellSize;
      return [[0, 0], [c, 0], [-c, 0], [0, c], [0, -c]].map(([dx, dz]) => regionAt((x || 0) + dx, (z || 0) + dz).id);
    },
    report() {
      return { version: CW_VERSION, seed, an: P.on, hier: curId, farbton: +(hue * 360).toFixed(1),
               wechsel: regionChanges, atemzuege, kachel: P.cellSize, reihenfolge: order.slice() };
    },
  };
}

// ---------------------------------------------------------------- Farbwerkzeug
// Drehen und Riegel. Beides gehört hierher und nicht in den Runner: es sind Aussagen über
// FARBE, keine Verdrahtung.

function rgb2hsl(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
  return [h / 6, s, l];
}
function hsl2rgb(h, s, l) {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const hk = (t) => { t = (t % 1 + 1) % 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  return [hk(h + 1 / 3), hk(h), hk(h - 1 / 3)];
}

/**
 * Die drei Stops um `hue` im Farbton drehen — das ist der Atem.
 * Sättigung und Helligkeit bleiben, sonst wäre es kein Atem, sondern eine andere Palette.
 */
export function rotateStops(stops, hue) {
  if (!hue) return stops;
  return stops.map(([r, g, b]) => {
    const [h, s, l] = rgb2hsl(r, g, b);
    return hsl2rgb(h + hue, s, l);
  });
}

/**
 * ⚠ **Der Lesbarkeits-Riegel.** Die Karten sind cremefarbenes Papier mit Tusche; eine
 * Farbwelt, deren helle Spitze so hell wird wie das Papier, frißt sie. Das ist keine
 * Geschmacksfrage, sondern eine Messung: die Helligkeit des obersten Stops wird auf
 * `maxLum` gedeckelt, der unterste auf `minDark` gehalten (sonst verschwindet der
 * Bodenschatten und mit ihm die Tiefe).
 * Gedeckelt wird die HELLIGKEIT, nicht die Sättigung — eine entsättigte Welt wäre grau,
 * und grau ist kein Ersatz für dunkel.
 */
export function guardStops(stops, maxLum, minDark) {
  const hi = maxLum != null ? maxLum : 0.80, lo = minDark != null ? minDark : 0.02;
  return stops.map((c, i) => {
    const [h, s, l] = rgb2hsl(c[0], c[1], c[2]);
    if (i === 0) return l > 0.34 ? hsl2rgb(h, s, 0.34) : (l < lo ? hsl2rgb(h, s, lo) : c);
    if (i === 2 && l > hi) return hsl2rgb(h, s, hi);
    return c;
  });
}

/** Helligkeit der drei Stops — für die Messzeile im Panel. */
export function stopLums(stops) {
  return stops.map((c) => +rgb2hsl(c[0], c[1], c[2])[2].toFixed(3));
}

/**
 * ⚠ **Die Kontrastfarbe für Ringwellen (v16/L2d).** Erster Anlauf nahm den hellen Stop der
 * aktiven Palette — nachgerechnet und im Bild bestätigt: **eine Welle in der eigenen Farbe der
 * Palette ist per Konstruktion unsichtbar.** Sie mischt eine Farbe über eine Fläche, die schon
 * fast diese Farbe hat; man sieht nichts und findet den Fehler nicht im Code, weil der Code
 * richtig ist.
 *
 * Eine Welle braucht **Kontrast zur Palette, nicht Mitgliedschaft in ihr** — aber der Kontrast
 * muss aus FARBE kommen, nicht aus Dunkelheit. Zweiter Befund (12.8., im Bild): mit der
 * Helligkeit auf die Gegenseite zu gehen (über hellem Boden also dunkler) liest sich als
 * **Schatten**, nicht als Welle. Über rosa Gelände lief ein graues Band durchs Bild — sichtbar,
 * aber genau das Gegenteil von „die Welt ist farbenfroh und lebt".
 *
 * Also: Farbton um `turn` drehen (Vorgabe 155° — nicht die vollen 180°, weil die exakte
 * Komplementärfarbe fremd wirkt und nicht mehr wie dieselbe Welt), **Sättigung hoch**, und die
 * Helligkeit bleibt in der NÄHE der Fläche (nur leicht angehoben, damit sie auf einem
 * Schwarzweiß-Auszug nicht verschwindet). Der Lesbarkeits-Riegel greift danach unverändert.
 */
export function contrastStop(stops, turn) {
  const mid = stops[1] || stops[0];
  const [h, s, l] = rgb2hsl(mid[0], mid[1], mid[2]);
  const hh = h + (turn != null ? turn : 155) / 360;
  // Leichte Anhebung, in einem Band gehalten: nie dunkler als die Fläche (sonst Schatten),
  // nie so hell, dass der Riegel die ganze Arbeit machen muss.
  const ll = Math.max(0.40, Math.min(0.70, l + 0.10));
  return hsl2rgb(hh, Math.min(1, s * 1.35 + 0.35), ll);
}
