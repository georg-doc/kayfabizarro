// ============================================================================
// sky-cards.js — KFB Travel · Slice S22 · Karten im Himmel als Flugziele
// ----------------------------------------------------------------------------
// Der Kern des Slices, in vier Teilen: Karten im Himmel VERTEILEN · sie so
// AUSRICHTEN, dass man sie lesen und durchfliegen kann · den DURCHFLUG erkennen ·
// die Karte danach als Portal AUFLÖSEN. Vorhang-Cloth, KISS-Strahlen und Wind
// sind bewusst NICHT hier drin (S22b/S22c) — nach dem Durchflug ist das Ding
// spielbar, und genau da soll ein Zwischenstand stehen.
//
// WAS AUS ROLLERCOASTER v11 KOMMT (nicht neu erfunden):
//  · **Portal-Auflösung:** eine geteilte AlphaMap (radial-ovaler Gradient +
//    Value-Noise) und ein STEIGENDER `alphaTest`. Der frisst die Mitte zuerst
//    (dort sind die Werte niedrig) und lässt eine irreguläre Kante stehen.
//    Null CPU, rückwärts derselbe Shader mit fallendem Schwellwert.
//  · **Karten haben keine Rückseite** — sie sind immer zur Kamera gedreht.
//  · **Kartenformat als EINE Zahl** (`KFB_CARD_AR = 1.79`, gemessen, nicht geraten).
//
// WAS NEU IST — und warum es nicht einfach der v11-Code ist: dort hängen die
// Vorhänge an einer SCHIENE (`curve.getPointAt(t)`). Travel hat keine Schiene.
// Also:
//  1. **Zero-G-Bewegung ohne Wiederholung.** Drei Sinus-Terme pro Achse mit
//     inkommensurablen Frequenzen (√2, √3, √5 · Primzahl-Vielfache) — die Summe
//     hat keine gemeinsame Periode, also gibt es kein „jetzt wackelt es wieder
//     genauso". Drift, Neigung und Rollen kommen aus derselben Uhr.
//  2. **Lesbarkeit schlägt Physik.** Die Karte dreht sich zur Kamera, aber
//     GEDÄMPFT (Slerp mit Zeitkonstante): sie folgt der Blickrichtung, ohne zu
//     schnappen, und behält ihr Eigenleben. Ergebnis: immer ein guter Lesewinkel
//     UND ein guter Durchflugwinkel.
//  3. **Durchflug statt Kollision.** Kein Solver: Abstand zur Kartenebene
//     (Skalarprodukt mit der Normale) plus Treffer innerhalb der halben Kanten —
//     der Vorzeichenwechsel IST das Ereignis.
//
//   const sky = createSkyCards({ THREE, count: 7 });
//   scene.add(sky.group);
//   sky.setCenter(x, z);                       // Welt wandert mit dem Spieler
//   sky.update(dt, camera, playerPos);         // pro Frame
//   sky.onPass = (card) => { … };              // Durchflug: Audio, Story, Deck
// ============================================================================

// S62 · Sollformat aus EINER Stelle — der Kommentar oben („Voraussetzung ist, dass beide dasselbe
// Blattformat meinen") ist damit keine Mahnung mehr, sondern verdrahtet.
import { CARD_AR as KFB_CARD_AR, fitCell } from '../cardbuilder/kfb-card-format.js';
const INK = '#1f1a14', PAPER = '#efe6d0';
let lastFit = null;   // S62 · letzte eingelegte Zelle — Abnahme des Sollformats (`formatReport`)

// ---------------------------------------------------------------- Tusche (Kanon, 2026-07-26)
// Bis heute zog dieses Modul seine Kartenkante selbst: vier Ecken, alle 34 bzw. 40 px ein Punkt,
// `jit` auf x UND y mit DERSELBEN Zahl (die Kante zitterte also diagonal statt quer zur Kante),
// dann `stroke lineWidth 7`. Das ist die FALSCHE FAMILIE — gestrichelte Polylinie statt Pinselband
// (`inked` gehört auf Chips und Post-its). Gemessen am 25./26.7.: **20 Stützpunkte** auf der langen
// Kante (v11: 31, Akademie: 44), **Feder 1,74 %** von min(B,H) und konstant (v11: 1,40 %, variabel),
// **Bauchung 1,00 %** gegen 0,44 % bei v11. Kein Parameter repariert das, nur der Umzug — bei einem
// Strich IST der Jitter der Wobble. Nach dem Umbau: Band · 44 · 1,40 % · Bauchung **0,38 %**.
//
// Jetzt trägt die Sky-Karte dieselbe Kante wie die Akademie-Karte: EINE normalisierte Kontur pro
// Seed (`contourAt`, Familie `band`, wob 1,4 · bow 0,196 · Referenzrahmen 1024) und `inkTail` als
// Feder. Die Zahlen stehen NICHT hier — sie stehen an einer Stelle, in `academy-deck.js`; dieses
// Modul importiert die Kontur, es kopiert sie nicht. (Zielzustand ist `cardbuilder/kfb-ink-canon.js`,
// sobald der Umzug der Karten-Pipeline entschieden ist — SSOT v2, offene Punkte.)
// Voraussetzung dafür ist, dass beide dasselbe Blattformat meinen: `SHEET_AR === KFB_CARD_AR`.
// ⚠ **NAHT 1 (v3, 29.8.): der Import der Kartenkante.** In v17 kommen `contourAt` und `SHEET_AR`
// aus `academy-deck.js`, das an `world-context.js` und `kfb-ink.js` hängt — beides braucht die
// Kante nicht. Deshalb steht das Zitat dieser vier Zeilen in `card-contour.js`; dort ist auch
// notiert, aus welchen Zeilen es kommt. Alles andere in dieser Datei ist unverändert v17.
// ⚠ **NAHT 2 (offen): die PLATZIERUNG.** `place()` verteilt die Karten auf einem Ring in einer
// EBENE (`ring`, `ringJit`, `yMin`) und `setCenter(x, z)` schiebt die Welt mit dem Spieler.
// Auf der Kugel braucht das den Tangentialrahmen — dieselbe Umrechnung wie in `sky-dice.js`.
// Bis die steht, ist dieses Modul KOPIERT, aber NICHT verdrahtet (Regel 2: was in der Quelle
// lief, muss hier erst wieder laufen, bevor es als übernommen gilt).
import { contourAt, SHEET_AR } from './card-contour.js';
import { inkTail } from './ink-tail.js';

if (Math.abs(SHEET_AR - KFB_CARD_AR) > 1e-6) {
  console.warn('[sky-cards] Blattformat weicht ab: SHEET_AR', SHEET_AR, '≠ KFB_CARD_AR', KFB_CARD_AR,
               '— die geteilte Kontur wird verzerrt.');
}
const pathOf = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };

// Kanonische Kartennamen aus den Cut-&-Play-Decks (Hopium · Doom · Protopia).
// Platzhalter-Titel wären hier falsch: die Karten sind Beweisstücke, keine Deko.
const DEFAULT_CARDS = [
  { title: 'The Finished City', deck: 'Hopium' },
  { title: 'The Moving Launch Date', deck: 'Hopium' },
  { title: 'The Doomsday Clock', deck: 'Doom' },
  { title: 'The Perpetual Almost', deck: 'Doom' },
  { title: 'The Frozen Watcher', deck: 'Doom' },
  { title: 'The Held Breath', deck: 'Protopia' },
  { title: 'The Reclaimed Second', deck: 'Protopia' },
  { title: 'The Nearest Lever', deck: 'Protopia' },
];

function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Portal-AlphaMap: radial-ovaler Gradient + Value-Noise. Steigender alphaTest frisst
// die Mitte zuerst → Loch mit irregulärer Kante. Eine Textur für alle Karten.
let _portalTex = null;
function portalAlphaTex(THREE) {
  if (_portalTex) return _portalTex;
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), img = g.createImageData(S, S), rnd = mulberry(4242);
  const grid = 16, n = [];
  for (let i = 0; i < (grid + 1) * (grid + 1); i++) n.push(rnd());
  const at = (x, y) => n[Math.min(grid, y) * (grid + 1) + Math.min(grid, x)];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S * grid, v = y / S * grid;
      const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
      const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
      const noise = a + (b - a) * sy;
      const dx = (x / S - 0.5) * 2, dy = (y / S - 0.5) * 2 * 0.78;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const val = Math.max(0, Math.min(1, r * 0.78 + noise * 0.34));
      const o = (y * S + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 255;
      img.data[o + 3] = (val * 255) | 0;
    }
  }
  g.putImageData(img, 0, 0);
  _portalTex = new THREE.CanvasTexture(c);
  return _portalTex;
}

// ── Die KANONISCHE Kartenrückseite ────────────────────────────────────────────────────────────
// Georg, 29.8.: „karten sollten nie mit text angezeigt werden, platzhalter ist immer die KFB card
// backside, die geladen (oder durch game interactions revealed)".
// Was hier stand, war ein gemalter Textsteckbrief (Titel, Deck, Lore) — und der Dateikopf nannte
// ihn „Ladezustand und Fallback, nie ein leeres Blatt". Das war die richtige Regel mit dem
// falschen Blatt: die Antwort auf „nie leer" ist die Rückseite, nicht Typografie. Eine Karte, die
// ihren Titel zeigt, bevor man sie gesammelt hat, verschenkt genau das Ereignis, um das es geht.
//
// EINE Datei, EINMAL geladen, von allen Karten geteilt (`card-carrier.js` nimmt dieselbe URL —
// die Flugkarte des Pets und die Sammelkarten sind dasselbe Blatt).
// Bis das Bild da ist: Papier + Tuschekante, kein Wort.
const BACKSIDE_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/'
  + 'media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png';
let _backImg = null, _backLaeuft = false;
const _backWarter = [];
function backsideLaden() {
  if (_backImg || _backLaeuft) return;
  _backLaeuft = true;
  const im = new Image();
  im.crossOrigin = 'anonymous';
  im.onload = () => {
    _backImg = im; _backLaeuft = false;
    // Alle Karten, die schon ein Blankoblatt tragen, bekommen ihr Motiv nachgereicht.
    while (_backWarter.length) { try { _backWarter.shift()(); } catch (e) {} }
  };
  im.onerror = () => { _backLaeuft = false; console.warn('[sky-cards] Rückseite nicht geladen'); };
  im.src = BACKSIDE_URL;
}
export function backsideBereit() { return !!_backImg; }

// Kartenblatt = **Rückseite**. Das ist der Normalzustand einer nicht aufgedeckten Karte, nicht ein
// Notbehelf. Das Bild wird DECKEND ins Blatt gelegt (`cover`, mittig beschnitten) und auf die
// gejitterte Silhouette geclippt — dieselbe Kontur wie beim Artwork, damit die Kante beim
// Aufdecken nicht springt.
// **v3-Naht 3:** `export`, damit `card-towers.js` dieselbe Textur-Pipeline benutzt statt einer
// zweiten — ein zweiter Kartenmaler war in v2 schon einmal die Ursache für Gutter und Doppelkante.
export function cardTexture(THREE, card, seed) {
  const W = 720, H = Math.round(W / KFB_CARD_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seed, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;

  const malen = () => {
    g.clearRect(0, 0, W, H);
    g.save(); pathOf(g, pts); g.clip();
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    if (_backImg) {
      // `cover`: das Blatt ist voll bedeckt, der Überstand wird mittig beschnitten. Kein `fitCell`
      // hier — eine Rückseite ist keine Deckzelle, sie darf beschnitten werden, aber nie Papier
      // durchblitzen lassen.
      const iw = _backImg.naturalWidth || _backImg.width, ih = _backImg.naturalHeight || _backImg.height;
      const s = Math.max(W / iw, H / ih);
      g.drawImage(_backImg, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
    }
    g.restore();
    inkTail(g, pts, W, H, seed);
    t.needsUpdate = true;
  };

  malen();
  if (!_backImg) { _backWarter.push(malen); backsideLaden(); }
  return t;
}

// Echtes Artwork: der 2×2-Quadrant aus dem Deck-PDF, 1:1 in das Blatt, auf die gejitterte
// Silhouette geclippt — dadurch bleibt die Kartenkante unregelmäßig (kein Rechteck) und die
// kanonische Tuschekante liegt exakt auf derselben Kontur (Kanon aus v11).
// **Derselbe Seed wie das Textblatt** — sonst wechselt die Silhouette in dem Moment, in dem das
// Artwork nachkommt (bis 2026-07-26 waren es zwei verschiedene Reihen: `1000 + i*77` und
// `500 + n*13`, die Karte änderte beim Nachladen sichtbar ihre Kante).
export function artTexture(THREE, crop, seed) {
  const W = 900, H = Math.round(W / KFB_CARD_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seed, W, H);
  g.save(); pathOf(g, pts); g.clip();
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
  // S62 · **Die Zelle wurde hier bis heute auf das Blatt GEZOGEN** (`drawImage(…, 0,0,W,H)`) — ein
  // 1,462er Deck lief damit auf 1,74 breit, die Zeichnung war verzerrt, und niemand konnte es sehen,
  // weil eine verzerrte Comiczeichnung immer noch wie eine Comiczeichnung aussieht. Jetzt liegt die
  // gemessene Zelle mittig im Sollformat, der Fehlbetrag ist Papier.
  const f = fitCell(crop.width, crop.height, W, H);
  lastFit = f;
  g.drawImage(crop, f.x, f.y, f.w, f.h);
  g.restore();
  inkTail(g, pts, W, H, seed);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}



export function createSkyCards(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    count: 7,
    width: 11,            // Weltbreite einer Karte
    ring: 150,            // mittlerer Abstand vom Spieler
    ringJit: 70,
    yMin: 22, yMax: 78,   // Höhenband
    faceDamp: 0.9,        // 1/s — wie schnell sich die Karte zur Kamera dreht (klein = träge)
    driftAmp: 2.6,        // Zero-G-Drift in Weltunits
    tiltAmp: 0.22,        // Neigungs-Amplitude (rad)
    passRadius: 1.0,      // Trefferfenster relativ zur halben Kantenlänge
    passPad: 0.038,       // v3 · S7 · absoluter Zuschlag in Weltmaß = halbe Avatarbreite (Naht 7)
    // v3 · S7i · Stratifizierte Verteilung (siehe `place`).
    // `spanAz` ist der Vorwärts-Sektor, in dem Karten hängen: 2,6 rad ≈ ±75°, der Quellwert.
    // `slotJit` 0…1 = wie weit eine Karte in ihrem Fach wandern darf. 1 = ganzes Fach (kann an
    // die Fachgrenze stoßen), 0,7 lässt einen Rand und damit einen garantierten Restabstand.
    spanAz: 2.6,
    slotJit: 0.7,
    // v3 · S7 · **Die getroffene Karte wird GENOMMEN, nicht aufgelöst.** Georg, 29.8.:
    // „die Karte bleibt nach Kollision noch zu lange stehen · verschwindet zu spät · es sieht
    // aus wie eine ZWEITE Karte, während die echte unten weiter vorbeizieht". Das war genau
    // das: das Portal löste 0,9 s lang IN DER DRIFT auf, während eine Kopie zum Fächer flog —
    // zwei sichtbare Karten für ein Ereignis (Fehlerklasse 1). Ab jetzt verschwindet das
    // Original im Treffer-Bild, und die fliegende Karte IST die Karte.
    // `false` ist der Rückweg auf die v17-Portalauflösung.
    takeOnPass: true,
    dissolveTime: 0.9,    // Sekunden bis die Karte weg ist
    respawn: 3.2,         // Sekunden bis eine neue Karte an neuer Stelle erscheint
    // ⚠ **B6 (D-08), Georg 1.9. freigegeben: der Respawn hängt an der ENTFERNUNG, nicht an der Uhr.**
    // Die Uhr allein hat einen Fehler, den man nur beim Langsamfliegen sieht: wer nach dem
    // Einsammeln stehen bleibt oder schleicht, bekommt die neue Karte 3,2 s später an eine Stelle
    // gesetzt, die er noch im Blick hat — eine Karte, die aus dem Nichts vor der Nase erscheint.
    // Das Prinzip liegt fertig in `portal.js` (`armDistance` 0,38) und in `recycle` gleich unten
    // (Naht 5: nur umsetzen, was HINTER dem Spieler liegt). Beide Regeln gelten ab jetzt auch hier.
    // Die Uhr bleibt als UNTERGRENZE, nicht als Bedingung: das Auflösen braucht seine 0,9 s, und
    // ohne Boden würde ein Durchflug im Stillstand sofort nachliefern.
    respawnDistanz: 0.38, // so weit muss der Spieler von der alten Stelle weg sein (= `armDistance`)
    visible: true,
  }, opts.params || {});

  const group = new THREE.Group();
  group.frustumCulled = false;
  const cards = [];
  /** B6 · Belege für die Entfernungsregel: wie lange ein Platz tatsächlich leer blieb. Ohne diese
   *  Zahl wäre nicht zu unterscheiden, ob die Regel greift oder ob nur die Uhr wie vorher läuft —
   *  bei schnellem Flug sind beide Bedingungen nach 3,2 s erfüllt und das Verhalten ist identisch.
   *  **Eine Regel, die im Normalfall nichts ändert, muss sagen können, wann sie etwas geadert hat.** */
  let respawnZahl = 0, respawnWarteMax = 0, respawnGehalten = 0;
  let deck = opts.cards && opts.cards.length ? opts.cards : DEFAULT_CARDS;
  const registry = opts.registry || null;   // liefert echtes Artwork nach (S23)
  let cx = 0, cz = 0, T = 0, collected = 0, nextIdx = 0;
  const fwd = { x: 0, z: -1 };              // Blick-/Flugrichtung für die Verteilung
  const api = { onPass: null };
  // v3 · S7i · Für die Abstandsprüfung beim Platzieren: Wurf, bester Wurf, Vergleich.
  const _sHome = new THREE.Vector3(), _sBest = new THREE.Vector3(), _sd2 = new THREE.Vector3();

  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _to = new THREE.Vector3();
  const _q = new THREE.Quaternion(), _m = new THREE.Matrix4();
  const _up = new THREE.Vector3(0, 1, 0), _right = new THREE.Vector3(), _look = new THREE.Vector3();
  const _tiltQ = new THREE.Quaternion(), _tiltE = new THREE.Euler();   // vorallokiert wie der Rest

  // ── NAHT 2 (v3, 29.8.): die KUGELFASSUNG ────────────────────────────────
  // v17 fliegt in einer Ebene: `place()` verteilt auf einem Ring in x/z, die Höhe ist ein Band in
  // y, und „oben" ist die Welt-Y-Achse. Auf der Kugel gilt keines davon. Statt die Verteilung neu
  // zu erfinden, wird sie in den TANGENTIALRAHMEN übersetzt — dieselbe Übersetzung wie in
  // `sky-dice.js`: Azimut um die Standortnormale, Radius als BOGEN, Höhe über der Oberfläche.
  // Alles andere (Drift, Ausrichtung, Durchflug, Portal) bleibt Zeile für Zeile v17.
  //
  // Maßstab: v17 rechnet mit Karten von 11 Einheiten Breite und Ring 150. Unser Globus hat Radius
  // 5 und die Flugkarte ist 0,075 breit — Faktor ~140. Die Zahlen im Runner sind damit
  // umgerechnet, nicht geraten.
  const sph = {
    on: false, R: 5,
    center: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    north: new THREE.Vector3(0, 0, -1),
    east: new THREE.Vector3(1, 0, 0),
    fwd: new THREE.Vector3(0, 0, -1),
    alt: 0,
    // ⚠ **Die Karte muss den Boden AN IHRER Stelle kennen, nicht den unter dem Spieler.**
    // Georg, 29.8.: „einige Flug-Karten stecken zum großen Teil im Terrain". Genau das war der
    // Grund: `place()` rechnete die Höhe auf die Flughöhe des SPIELERS, und ein Ring von 1,15 u
    // reicht über Berge von bis zu 0,52 u. Also fragt die Platzierung dieselbe Höhenfunktion,
    // die Flugphysik, Mesh und Schatten lesen — EIN Boden, kein zweiter.
    altAt: null,
    // v11 · ANKER-Modus (Georg, Formular 2.9.: „je Terrain-Karte EINE Sky-Card darüber, kein
    // Recycling-Ring mehr“). Eine Karte hängt dann über IHRER liegenden Karte: kein Ring, kein
    // Fach, kein Respawn — eingesammelt ist weg. `anker` = [{ n, r0, karte }] aus karten-teppich.
    anker: null,
    ankerHoehe: 0.05,   // Schwebehöhe über der höchsten Kante der liegenden Karte (Weltmaß)
  };
  const _sd = new THREE.Vector3();

  /** Der Standort einer Karte auf der Kugel — **stratifiziert**, nicht gewürfelt.
   *
   *  ⚠ Georg, zum zweiten Mal: „die Karten-Verteilung ist immer noch nicht korrekt
   *  berechnet/umgesetzt". Meine erste Antwort war Ablehnungs-Würfeln (acht Versuche, Mindestabstand)
   *  — dieselbe Mechanik wie bei Landmarken und Würfeln. Sie kann hier gar nicht funktionieren, und
   *  das ist rechenbar: **die Karten erscheinen EINZELN.** Wer als erster gesetzt wird, hat keine
   *  Nachbarn und damit keine Einschränkung; die zweite weicht nur der ersten aus. Ablehnung
   *  verhindert Berührung, sie erzeugt keine Gleichverteilung — dafür müsste sie alle sechs
   *  gleichzeitig kennen.
   *
   *  Stratifizierung dreht die Frage um: der Vorwärts-Sektor wird in so viele **Fächer** geteilt,
   *  wie es Karten gibt, und jede Karte gehört dauerhaft in IHR Fach (ihr Index im Feld). Innerhalb
   *  des Fachs wird gewürfelt — also bleibt es unregelmäßig, aber es kann nicht klumpen, weil zwei
   *  Karten nie dasselbe Fach haben. Das ist eine Garantie, keine Wahrscheinlichkeit, und sie
   *  kostet keinen Versuch.
   *  Der Ringabstand wird GEGENLÄUFIG zum Fach gestaffelt (`Math.cos`): benachbarte Fächer liegen
   *  damit in verschiedenen Tiefen — auch bei perspektivischer Überdeckung liest man zwei Karten
   *  als zwei, nicht als Stapel. Das war der eigentliche Bildfehler im Screenshot.
   */
  function place(card) {
    if (card.anker) {
      // Deterministisch: Ort = Anker, Höhe = feste Schwebehöhe. Kein Math.random in der Weltlage.
      const a = card.anker;
      card.home.copy(a.n).multiplyScalar(a.r0 + sph.ankerHoehe);
      card.mesh.position.copy(card.home);
      card.phase = (card.slot * 7.31) % 100;
      card.state = 'idle'; card.t = 0;
      card.mesh.visible = P.visible;
      card.mat.alphaMap = null; card.mat.alphaTest = 0; card.mat.needsUpdate = true;
      card.side = 0;
      card.art = false;
      return;
    }
    if (sph.on) {
      const N = Math.max(1, cards.length);
      const slot = card.slot != null ? card.slot : 0;
      // Vorwärts-Bias wie in der Ebene, nur im Tangentialrahmen: Azimut 0 = Flugrichtung.
      const base = Math.atan2(sph.fwd.dot(sph.east), sph.fwd.dot(sph.north));
      const behind = Math.random() < 0.1;
      const spanne = behind ? 1.6 : P.spanAz;
      const fach = spanne / N;
      // Mitte des eigenen Fachs, plus Jitter INNERHALB des Fachs (nie darüber hinaus).
      const a = base + (behind ? Math.PI : 0)
        + (slot + 0.5) * fach - spanne * 0.5
        + (Math.random() - 0.5) * fach * P.slotJit;
      // Ringabstand gegenläufig gestaffelt: Nachbarfächer liegen in verschiedenen Tiefen.
      const staffel = Math.cos(slot * Math.PI) * 0.5;      // ±0,5, abwechselnd
      const r = P.ring + (staffel + (Math.random() - 0.5) * 0.5) * P.ringJit;
      const h = P.yMin + Math.random() * (P.yMax - P.yMin);          // Höhe ÜBER der Oberfläche
      _sd.copy(sph.up)
        .addScaledVector(sph.north, Math.cos(a) * r / sph.R)
        .addScaledVector(sph.east, Math.sin(a) * r / sph.R)
        .normalize();
      // **Höhenbezug ist der BODEN am Ort der Karte, nicht die Flughöhe des Spielers**
      // (Georg, 29.8.: „die Karten so platzieren, dass Sammeln leicht ist und Darunter-
      // durchfliegen die Ausnahme"). Der Spieler fliegt selbst in konstantem Abstand über Grund
      // (carpet: surfaceAlt + 0,03), also ist ein konstanter Bodenabstand automatisch Flughöhe.
      // Über Wasser gilt der Meeresspiegel, sonst hingen Karten in Senken zu tief.
      const boden = sph.altAt ? Math.max(0, sph.altAt(_sd.x, _sd.y, _sd.z)) : 0;
      card.home.copy(_sd).multiplyScalar(sph.R + boden + 0.03 + h);
      card.mesh.position.copy(card.home);
      card.phase = Math.random() * 100;
      card.state = 'idle'; card.t = 0;
      card.mesh.visible = P.visible;
      card.mat.alphaMap = null; card.mat.alphaTest = 0; card.mat.needsUpdate = true;
      card.side = 0;
      card.art = false;
      return;
    }
    // Vorwärts-Bias: die Karten sollen VOR dem Spieler hängen, nicht rundherum — sonst ist der
    // Himmel in Flugrichtung leer und man muss suchen. ± 75° um die Flugrichtung, der Rest
    // dahinter verteilt (10 %), damit es kein starres Tor wird.
    const base = Math.atan2(fwd.x, fwd.z);
    const behind = Math.random() < 0.1;
    const a = base + (behind ? Math.PI : 0) + (Math.random() - 0.5) * (behind ? 1.6 : 2.6);
    const r = P.ring + (Math.random() - 0.5) * P.ringJit;
    card.home.set(cx + Math.sin(a) * r, P.yMin + Math.random() * (P.yMax - P.yMin), cz + Math.cos(a) * r);
    card.mesh.position.copy(card.home);
    card.phase = Math.random() * 100;
    card.state = 'idle'; card.t = 0;
    card.mesh.visible = P.visible;
    card.mat.alphaMap = null; card.mat.alphaTest = 0; card.mat.needsUpdate = true;
    card.side = 0;
    card.art = false;
  }

  // Text zuerst, Bild später — und Bild NUR AUF ZURUF. Der erste Anlauf hat alle sieben Blätter
  // beim Erscheinen in die Warteschlange geworfen: vier große Deck-PDFs gleichzeitig, dazu ein
  // 1500-px-Seitenrender pro Karte, alles auf demselben Thread wie der Flug — gemessen 0 fps und
  // ein Terrain, das nie fertig gebaut wurde. Jetzt holt der Runner EIN Artwork, wenn er Luft hat,
  // und immer für die NÄCHSTE Karte: die sieht man als erste.
  function pumpArt(player, maxDist) {
    if (!registry || registry.pending || document.hidden) return false;
    // ⚠ **Die FLIEGENDE Karte hat VORRANG, nicht Ausschluss.**
    // Hier stand `c.state !== 'idle'` — die eine Karte, die gerade groß vor der Kamera vorgezeigt
    // wird, war damit die EINZIGE, die kein Artwork bekommen konnte. Und weil ihr Platz nach der
    // Ankunft mit neuen Daten neu belegt wird, wurde das Motiv nie gerendert: das Blatt im Stapel
    // behielt für immer die Rückseite, während der Himmel sich mit Artwork füllte.
    // Genau Georgs Befund, und es traf nur den ERSTEN Fund — danach sind alle Karten längst
    // gepumpt. Gemessen kurz nach dem Laden: Texturbreiten [720, 720, 900, 900, 720, 900];
    // 720 ist die Rückseite, 900 das Artwork. Sekunden später war alles 900, deshalb war der
    // Fehler so schwer zu treffen.
    // **Ein Ausschluss war hier genau falsch herum:** die vorgezeigte Karte ist die größte und am
    // längsten betrachtete im Bild — sie ist das WICHTIGSTE Ziel für ein Motiv, nicht das
    // unwichtigste. Sie wird deshalb bevorzugt, egal wie weit sie vom Spieler entfernt ist
    // (Entfernung ist für eine Karte, die vor der Linse hängt, keine sinnvolle Priorität).
    let best = null, bd = maxDist || 1e9;
    for (const c of cards) {
      if (c.state === 'gone' || c.art || !c.data || c.data.packId == null) continue;
      if (c.state === 'flying') { best = c; break; }          // Vorrang, ohne Abstandsprüfung
      const d = player ? c.mesh.position.distanceTo(player) : 0;
      if (d < bd) { bd = d; best = c; }
    }
    if (!best) return false;
    const card = best;
    card.art = 'pending';
    registry.requestArt(card.data, (crop) => {
      if (card.state === 'gone' || card.art !== 'pending') return;
      if (card.mat.map) card.mat.map.dispose();
      card.mat.map = artTexture(THREE, crop, card.seed);
      card.mat.needsUpdate = true;
      card.art = true;
    }, () => {
      // Gibt die Registry auf, muss das Blatt WIEDER FREI sein — sonst bliebe es die ganze Sitzung
      // als „läuft noch" markiert und bekommt nie Artwork, auch nicht direkt vor der Nase.
      if (card.art === 'pending') card.art = false;
    });
    return true;
  }

  function make(i, ankerEintrag) {
    const data = ankerEintrag ? ankerEintrag.karte : deck[i % deck.length];
    const seed = 1000 + i * 77;   // EIN Seed pro Blatt — Textfassung und Artwork teilen die Kontur
    const w = P.width, h = w / KFB_CARD_AR;
    const geo = new THREE.PlaneGeometry(w, h, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: cardTexture(THREE, data, seed),
      transparent: true, side: THREE.DoubleSide, toneMapped: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    group.add(mesh);
    // `slot` ist das Winkelfach dieser Karte — dauerhaft, damit zwei Karten nie dasselbe haben.
    const card = { data, mesh, mat, geo, seed, slot: cards.length, half: { w: w / 2, h: h / 2 },
                   home: new THREE.Vector3(), phase: 0, state: 'idle', t: 0, side: 0, anker: ankerEintrag || null };
    place(card);
    return card;
  }

  for (let i = 0; i < P.count; i++) cards.push(make(nextIdx++));
  // Die Titel werden auf ein Canvas gemalt. Läuft der Webfont noch, malt der Browser still
  // Georgia — also nach `fonts.ready` EINMAL neu malen. Sonst hängt die Typografie am Zufall
  // der Ladereihenfolge (in v11 zweimal aufgeschlagen).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (c.mat.map) c.mat.map.dispose();
        c.mat.map = cardTexture(THREE, c.data, c.seed);
        c.mat.needsUpdate = true;
      }
    });
  }

  // ── NAHT 6 (v3 · S7) · ÜBERGABE: die Karte WECHSELT DEN BESITZER ──────────────────
  // Georg, 29.8., zu meiner ersten Fassung: „allein die Idee, dass potentiell ZWEI Karten
  // gerendert werden, um eine Animation EINER Karte zu realisieren" — und er hat recht, es war
  // Faulheit, und sie stand als Begründung im Kopf von `card-flight.js`, während Fehlerklasse 1
  // („zwei Verwalter derselben Sache") in meinem eigenen Dokument steht.
  //
  // Es gibt genau EIN Mesh je Karte. Beim Treffer wird es ÜBERGEBEN: `sky-cards` hört auf, es zu
  // bewegen (Zustand `flying` — keine Drift, keine Ausrichtung, kein Treffertest, kein Respawn,
  // kein Texturtausch), der Flug bewegt es, und `release()` gibt es zurück. Kein zweiter Quad,
  // keine zweite Textur, keine zweite Auflösung. Der Besitzer wechselt; die Sache bleibt eine.
  function handOver(card) {
    card.state = 'flying'; card.t = 0; card.side = 0;
    const m = card.mesh, mat = card.mat;
    const col0 = mat.color ? mat.color.clone() : null;
    const ro0 = m.renderOrder;
    return {
      mesh: m, mat, width: card.half.w * 2, color0: col0,
      release() {
        if (card.state !== 'flying') return;
        group.attach(m);                 // zurück in den Kartenraum, Weltpose erhalten
        m.position.copy(card.home);
        m.scale.setScalar(1);
        m.renderOrder = ro0;
        m.visible = false;
        if (col0 && mat.color) mat.color.copy(col0);
        mat.alphaMap = null; mat.alphaTest = 0; mat.needsUpdate = true;
        card.state = 'gone'; card.t = 0;  // ab hier läuft die Respawn-Uhr wie immer
        card.wegPos = (card.wegPos || m.position.clone()).copy(m.position);   // B6 · Bezugsort
      },
    };
  }

  function beginDissolve(card) {
    card.state = 'dissolve'; card.t = 0;
    card.mat.alphaMap = portalAlphaTex(THREE);
    card.mat.needsUpdate = true;
  }

  function update(dt, camera, player) {
    if (!P.visible) return;
    T += dt;
    // Kugelfassung: „oben" ist die Standortnormale, nicht die Welt-Y-Achse. Eine Zeile, und die
    // Ausrichtung unten steht auf der Kugel richtig.
    if (sph.on) _up.copy(sph.up);
    camera.getWorldPosition(_look);
    for (const card of cards) {
      const m = card.mesh;
      // NAHT 6: eine übergebene Karte gehört dem Flug — hier wird sie nicht angefasst.
      if (card.state === 'flying') continue;
      if (card.state === 'gone') {
        if (card.anker) continue;   // v11 · verankerte Karten kommen nicht wieder: eingesammelt ist weg
        card.t += dt;
        // B6 · Zwei Bedingungen, und die Uhr ist nur die erste: sie ist die UNTERGRENZE (Auflösen
        // braucht 0,9 s), die Entfernung ist die Bedingung. Ohne Spielerort bleibt es bei der Uhr —
        // eine Regel, die ihre Eingabe nicht hat, blockiert nicht, sie tritt zurück.
        let weitGenug = true;
        if (player && card.wegPos) {
          weitGenug = card.wegPos.distanceTo(player) >= P.respawnDistanz;
          // Und dieselbe Blickregel wie `recycle` (Naht 5): liegt die alte Stelle noch vor dem
          // Spieler, wird dort nichts gesetzt — auch nicht, wenn er weit genug weg ist.
          if (weitGenug && sph.fwd && sph.fwd.lengthSq() > 1e-9) {
            _v.copy(card.wegPos).sub(player);
            if (_v.lengthSq() > 1e-9 && _v.normalize().dot(sph.fwd) > -0.15) weitGenug = false;
          }
        }
        if (card.t >= P.respawn && !weitGenug) respawnGehalten++;
        if (card.t >= P.respawn && weitGenug) {
          if (card.t > respawnWarteMax) respawnWarteMax = card.t;
          respawnZahl++;
          card.data = deck[nextIdx++ % deck.length];
          card.art = false;
          card.seed = 1000 + nextIdx * 77;   // neues Blatt, neue Kante — aber EINE, siehe make()
          if (card.mat.map) card.mat.map.dispose();   // sonst bleibt pro Durchflug eine Textur liegen
          card.mat.map = cardTexture(THREE, card.data, card.seed);
          place(card);
        }
        continue;
      }
      // --- Zero-G: drei inkommensurable Frequenzen pro Achse. Die Summe hat keine
      // gemeinsame Periode → die Bewegung wiederholt sich nie hörbar/sichtbar.
      const p = card.phase, s = T * 0.16;
      const dx = Math.sin(s * 1.0 + p) + 0.6 * Math.sin(s * 1.4142 + p * 1.7) + 0.35 * Math.sin(s * 2.2360 + p * 2.3);
      const dy = Math.sin(s * 1.1 + p * 1.3) + 0.55 * Math.sin(s * 1.7320 + p * 0.7) + 0.3 * Math.sin(s * 2.6457 + p * 3.1);
      const dz = Math.sin(s * 0.9 + p * 2.1) + 0.6 * Math.sin(s * 1.6180 + p * 1.1) + 0.35 * Math.sin(s * 2.4494 + p * 0.4);
      m.position.set(
        card.home.x + dx * P.driftAmp,
        card.home.y + dy * P.driftAmp * 0.55,
        card.home.z + dz * P.driftAmp);

      // --- Ausrichtung: zur Kamera, aber gedämpft, plus Eigen-Neigung um alle drei Achsen.
      // Erst die Blickachse als Basis (Karten haben keine Rückseite), dann die Neigung
      // OBEN DRAUF — so bleibt der Lesewinkel gut und die Karte trotzdem lebendig.
      _to.subVectors(_look, m.position).normalize();
      _right.crossVectors(_up, _to);
      if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0); else _right.normalize();
      _v.crossVectors(_to, _right).normalize();
      _m.makeBasis(_right, _v, _to);
      _q.setFromRotationMatrix(_m);
      const tilt = P.tiltAmp;
      _tiltE.set(
        Math.sin(s * 1.3 + p) * tilt,
        Math.sin(s * 0.8 + p * 1.9) * tilt * 0.7,
        Math.sin(s * 1.9 + p * 0.6) * tilt);
      _q.multiply(_tiltQ.setFromEuler(_tiltE));
      m.quaternion.slerp(_q, Math.min(1, dt * P.faceDamp * 3));

      if (card.state === 'dissolve') {
        card.t += dt;
        const k = Math.min(1, card.t / P.dissolveTime);
        card.mat.alphaTest = Math.min(0.99, 0.03 + k * 0.97);
        if (k >= 1) { card.state = 'gone'; card.t = 0; m.visible = false;
                      card.wegPos = (card.wegPos || m.position.clone()).copy(m.position); }
        continue;
      }

      // --- Durchflug: Abstand zur Kartenebene, Vorzeichenwechsel = Ereignis.
      // Kein Solver, kein Broadphase — eine Ebene und zwei Kantenlängen.
      if (player) {
        _n.set(0, 0, 1).applyQuaternion(m.quaternion);
        _v.subVectors(player, m.position);
        const d = _v.dot(_n);
        const side = d >= 0 ? 1 : -1;
        if (card.side !== 0 && side !== card.side) {
          // Treffer nur, wenn der Punkt INNERHALB der Karte liegt
          _right.set(1, 0, 0).applyQuaternion(m.quaternion);
          _to.set(0, 1, 0).applyQuaternion(m.quaternion);
          const u = Math.abs(_v.dot(_right)), w2 = Math.abs(_v.dot(_to));
          // NAHT 7 (v3 · S7) · Georg: „immer noch zu oft keine Treffer bei Durchflug".
          // Gemessen war das Fenster bei `passRadius` 1,8: **0,144 × 0,083** — und der Pet/Karten-
          // Avatar ist 0,075 breit. In der HÖHE blieben also ±0,041 für einen 0,075 breiten
          // Körper: man musste einen Schlitz treffen, der schmaler ist als das eigene Fahrzeug.
          // Ein relativer Faktor kann das nicht heilen — er skaliert das 1,74:1-Format mit und
          // bleibt in der Höhe immer knapp. Deshalb ein ABSOLUTER Zuschlag in Weltmaß: der halbe
          // Avatar. Das ist die ehrliche Aussage „wenn mein Körper die Karte berührt, ist es ein
          // Treffer" — und es ist Georgs Regel aus S3i: Sammeln soll leicht sein.
          if (u < card.half.w * P.passRadius + P.passPad
              && w2 < card.half.h * P.passRadius + P.passPad) {
            collected++;
            // NAHT 4: die Textur der getroffenen Karte (der Fächer liest ihr Bild).
            api.lastPassTexture = card.mat.map || null;
            // NAHT 6: Übergabe statt Kopie. `takeOnPass: false` ist der Rückweg auf die
            // v17-Portalauflösung — dann bleibt die Karte hier und löst sich auf.
            const uebergabe = P.takeOnPass ? handOver(card) : (beginDissolve(card), null);
            // 1.9. · Block 3: die Seite, von der aus getroffen wurde — `_v.dot(_right)` steht hier
            // schon für den Treffertest, jetzt auch als fünfter Parameter für `card-flight`s
            // seitenabhängige Drehung (Georgs Entscheidung: dieselbe Regel wie bei den Wegweisern).
            if (api.onPass) { try { api.onPass(card.data, collected, card.mat.map && card.mat.map.image, uebergabe, _v.dot(_right) >= 0 ? 1 : -1); } catch (e) {} }
          }
        }
        card.side = side;
      }
    }
  }

  return {
    name: 'sky-cards', group, update,
    // S62 · Abnahme des Sollformats: was von der Zelle Papierrand wurde, statt abgeschnitten oder
    // verzogen zu werden. `null` heißt: noch kein Artwork eingelegt (nur Textblätter).
    formatReport() {
      if (!lastFit) return { sollformat: KFB_CARD_AR, eingelegt: 0 };
      const cellAR = (lastFit.w / lastFit.scale) / (lastFit.h / lastFit.scale);
      return {
        sollformat: KFB_CARD_AR,
        zelle: +cellAR.toFixed(3),
        randX: +(lastFit.randX * 100).toFixed(2),
        randY: +(lastFit.randY * 100).toFixed(2),
        verzerrungJetzt: 0,                                       // gleichmäßige Skalierung
        verzerrungVorher: +Math.abs(KFB_CARD_AR / cellAR - 1).toFixed(4),
      };
    },
    /** Welche Karten hängen JETZT — mit Deckgröße und Laufindex.
     *  ⚠ Georg: „Karten wiederholen sich gerade ständig…?" Der Respawn zieht nachweislich
     *  `deck[nextIdx++ % deck.length]`, das Deck hat 56 Einträge und es gibt 6 Plätze — die
     *  Wiederholung kann also nicht aus der Zuteilung kommen. Damit bleiben zwei Kandidaten, und
     *  sie sind ohne diese Zahlen nicht zu unterscheiden:
     *    (a) das ARTWORK wiederholt sich (die Registry liefert für verschiedene Karten denselben
     *        Ausschnitt) — dann sind die Titel verschieden und die Bilder gleich;
     *    (b) die Titel wiederholen sich — dann stimmt etwas mit `nextIdx` oder `setDeck`.
     *  **Zwei Ursachen mit demselben Symptom trennt man nicht durch Nachdenken, sondern durch
     *  eine Liste.** Also liefert dieses Modul die Liste. */
    deckReport() {
      return {
        deckGroesse: deck ? deck.length : 0,
        nextIdx,
        jetzt: cards.map((c) => ({
          titel: (c.data && (c.data.title || c.data.n)) || '?',
          pack: c.data && c.data.packId,
          seed: c.seed,
          art: c.art,
          zustand: c.state,
          texBreite: c.mat.map && c.mat.map.image ? c.mat.map.image.width : null,
        })),
        // Doppelte Titel unter den sichtbaren Karten — die Zahl, die (b) beweist oder ausschließt.
        doppelteTitel: cards.length - new Set(cards.map((c) => (c.data && c.data.title) || c.seed)).size,
      };
    },
    get lastPassTexture() { return api.lastPassTexture || null; },
    get onPass() { return api.onPass; },
    set onPass(fn) { api.onPass = fn; },
    setCenter(x, z) { cx = x; cz = z; },
    /** NAHT 2 · Kugelfassung einschalten (Radius der Basiskugel). */
    setSphere(on, radius) { sph.on = !!on; if (radius) sph.R = radius; },
    /** Höhenfunktion der Welt (x, y, z → Auslenkung). Ohne sie rechnet `place` nur mit der
     *  Flughöhe des Spielers — und Karten stecken über Bergen im Boden. */
    setAltFn(fn) { sph.altAt = fn || null; },
    get onSphere() { return sph.on; },
    /** Tangentialrahmen und Ort des Spielers — jedes Bild, wie `sky-dice.setFrame`. */
    setFrame(up, north, east, playerPos, altitude, forward) {
      sph.up.copy(up); sph.north.copy(north); sph.east.copy(east);
      if (playerPos) sph.center.copy(playerPos);
      if (altitude != null) sph.alt = altitude;
      if (forward) sph.fwd.copy(forward);
    },
    // Flugrichtung für die Verteilung: neue Karten erscheinen vor dem Spieler
    /** B6 · Die durchfallbare Zeile zur Entfernungsregel. Sie kann NICHT durchfallen, indem sie
     *  nichts tut — deshalb weist sie beides aus: wie oft ein Respawn zurückgehalten wurde
     *  (`held`) und wie lange der längste Platz leer blieb. Bei schnellem Flug sind Uhr und
     *  Entfernung gleichzeitig erfüllt und `held` bleibt 0; das ist richtig und wird auch so
     *  benannt, statt als Erfolg oder als Mangel gelesen zu werden. */
    respawnTor() {
      if (!respawnZahl) return { idle: true, text: 'idle · no card has respawned yet (floor '
        + P.respawn + ' s, distance ' + P.respawnDistanz + ' u)' };
      const ok = respawnWarteMax >= P.respawn - 0.05;
      return {
        idle: false, ok, respawns: respawnZahl,
        laengsteWartezeit: +respawnWarteMax.toFixed(2),
        zurueckgehalten: respawnGehalten,
        text: (ok ? '✓' : '✗') + ' ' + respawnZahl + ' respawns · longest slot empty '
          + respawnWarteMax.toFixed(2) + ' s (floor ' + P.respawn + ' s)'
          + ' · ' + respawnGehalten + ' frames held back by distance/gaze at ' + P.respawnDistanz + ' u'
          + (respawnGehalten === 0
              ? ' — flying fast enough that the clock and the distance fall due together, as expected'
              : ' — the rule is doing work: a card would have popped in view'),
      };
    },
    setForward(x, z) { const l = Math.hypot(x, z) || 1; fwd.x = x / l; fwd.z = z / l; },
    // Echtes Deck einhängen (Karten-JSON aus der Registry). Die bestehenden Blätter werden
    // beim nächsten Respawn ersetzt; die sichtbaren bekommen sofort Titel und Artwork-Auftrag.
    setDeck(list, replaceNow) {
      if (!list || !list.length) return;
      deck = list; nextIdx = 0;
      if (!replaceNow) return;
      for (const c of cards) {
        if (c.state === 'flying') continue;   // NAHT 6: gehört gerade dem Flug
        c.data = deck[nextIdx++ % deck.length];
        c.art = false;
        c.seed = 1000 + nextIdx * 77;
        if (c.mat.map) c.mat.map.dispose();
        c.mat.map = cardTexture(THREE, c.data, c.seed);
        c.mat.needsUpdate = true;
      }
    },
    pumpArt,
    /** v11 · ANKER-Modus einschalten: alle Blätter neu, eines je Eintrag. `null` = zurück zum Ring
     *  (dann P.count Blätter aus dem Deck). Eingesammelte Anker (karte in `weg`) werden ausgelassen. */
    setAnker(liste) {
      for (const c of cards) { if (c.state === 'flying') continue; group.remove(c.mesh); c.geo.dispose(); if (c.mat.map) c.mat.map.dispose(); c.mat.dispose(); }
      const fliegend = cards.filter((c) => c.state === 'flying');
      cards.length = 0; for (const c of fliegend) cards.push(c);
      sph.anker = liste && liste.length ? liste : null;
      if (sph.anker) { for (const a of sph.anker) cards.push(make(cards.length, a)); }
      else { nextIdx = 0; for (let i = 0; i < P.count; i++) cards.push(make(nextIdx++)); }
      return cards.length;
    },
    get ankerModus() { return !!sph.anker; },
    /** v11 · wie viele verankerte Karten noch hängen. */
    get offen() { return cards.filter((c) => c.anker && c.state === 'idle').length; },
    // Karten, die zu weit hinter dem Spieler liegen, wandern nach vorn — sonst fliegt man
    // aus dem Kartenfeld heraus und der Himmel ist leer.
    recycle(player, maxDist, forward) {
      if (sph.anker) return;   // v11 · verankerte Karten wandern nicht
      const md = maxDist || P.ring * 2.4;
      for (const card of cards) {
        if (card.state !== 'idle') continue;
        if (card.home.distanceTo(player) <= md) continue;
        // NAHT 5: nur umsetzen, was HINTER dem Spieler liegt. Ohne diese Prüfung springt eine
        // Karte im Blickfeld an eine neue Stelle — in v17 unsichtbar (Ring 150), bei uns mitten
        // im Bild (Ring 1,15).
        if (forward) {
          _v.copy(card.home).sub(player);
          if (_v.lengthSq() > 1e-9 && _v.normalize().dot(forward) > -0.15) continue;
        }
        place(card);
      }
    },
    setVisible(on) { P.visible = !!on; for (const c of cards) { if (c.state === 'flying') continue; c.mesh.visible = !!on && c.state !== 'gone'; } },
    /** v3 · S7d · **Alle ruhenden Karten neu setzen.** Gebraucht, sobald sich die Höhenfunktion
     *  ÄNDERT (der Boden zählt jetzt die Bauten mit, damit keine Karte im Turm steckt). Karten im
     *  Flug bleiben unangetastet — sie gehören gerade dem Flug (Naht 6). */
    replaceAll() {
      let n = 0;
      for (const card of cards) {
        if (card.state === 'flying') continue;
        place(card); n++;
      }
      return n;
    },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    get collected() { return collected; },
    get count() { return cards.length; },
    // Nächste Karte ZUM SPIELER — nicht zum Weltursprung. S22b (Strahlen) und S22c (Cloth,
    // Turbulenz) hängen daran; ein Abstand gegen (0,0,0) wäre dort still falsch.
    nearest(player) {
      let best = null, bd = 1e9;
      for (const c of cards) {
        if (c.state !== 'idle') continue;
        const d = player ? c.mesh.position.distanceTo(player) : c.mesh.position.length();
        if (d < bd) { bd = d; best = c; }
      }
      return best;
    },
    reset() { collected = 0; for (const c of cards) if (!(c.anker && c.state === 'gone')) place(c); },
    dispose() { for (const c of cards) { c.geo.dispose(); if (c.mat.map) c.mat.map.dispose(); c.mat.dispose(); } },
  };
}
