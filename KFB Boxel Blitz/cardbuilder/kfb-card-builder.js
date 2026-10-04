// ============================================================================
// kfb-card-builder.js — eine KFB-Karte als fertiges three.js-Objekt
// ----------------------------------------------------------------------------
// Für jede Szene, die echte Cut-&-Play-Karten zeigen soll (Zone-Builder, Tisch,
// Diorama, Travel). Der Aufrufer liefert `THREE` und sagt, WELCHE Karte — alles
// andere passiert hier: Deck-Registry vom Repo, PDF-Seite rendern, Quadrant
// schneiden, Blatt malen, Silhouette stanzen, kanonische Tusche als Decal davor.
//
//   import { createCardBuilder } from './kfb-card-builder.js';
//   const cb = createCardBuilder({ THREE });
//   const pool = await cb.pool();                  // alle Karten aller Decks, gemischt
//   const card = cb.make(pool[0], { width: 11 });  // sofort da: Textblatt
//   scene.add(card.group);                         // Artwork schiebt sich selbst nach
//
// ── DIE VIER REGELN, DIE HIER GELTEN ───────────────────────────────────────
// 1. **Text zuerst, Bild später.** Die Karten-JSON kommt in Millisekunden, das
//    PDF-Rendern dauert. Also erst Titel und Lore als Blatt, dann das echte
//    Artwork nachschieben. Nie ein leeres Blatt, nie ein Ladebalken.
// 2. **EIN PDF-Render zur Zeit.** Sonst ruckelt die Szene. Warteschlange mit
//    einem Platz, Seiten gecacht — weitere Quadranten derselben Seite sind billig.
// 3. **RAW-first, dann lokaler Fallback, dann Textkarten.** Das Manifest im Repo
//    ist die Wahrheit; eine lokale Kopie darf nicht veralten.
// 4. **Fläche und Tusche teilen EINE Kontur.** Maske stanzt aus (`alphaMap` +
//    `alphaTest`, harte Kante), das Decal trägt die Linie, 2 cm davor. Zwei
//    getrennt gerechnete Konturen ergeben zwei Kanten mit einer Lücke dazwischen.
//
// ── WAS HIER MIT ABSICHT NICHT PASSIERT ────────────────────────────────────
// Kein Layout, keine Animation, keine Physik, keine Kamera. Der Builder liefert
// eine `THREE.Group` mit bekanntem Aufbau und hört danach auf. Wo die Karte
// hängt, wie sie sich dreht und was ein Durchflug bedeutet, gehört der Szene.
//
// Aufbau der gelieferten Gruppe (stabil, darauf darf man sich verlassen):
//   group
//    ├─ sheet   Mesh(PlaneGeometry(w,h))  · map = Blatt · alphaMap = Silhouette
//    └─ decal   Mesh(PlaneGeometry(w,h))  · map = nur die Tusche · z = +0,02·w/11
// ============================================================================

import { INK_PRESETS, contour, pathOf, drawInk, maskGrow, measureInk, INK_COLOR }
  from './kfb-ink-canon.js';
import { CARD_AR, CARD_AR_FROM, fitCell, coverLoss } from './kfb-card-format.js';

const RAW_INDEX = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

const PAPER = '#efe6d0', CREAM = '#f7f0dd';
function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* Schreibung: der Aufrufer bringt seine Regel mit (`params.titleCase`). OHNE Regel bleibt alles wie
   zuvor — darum aendert dieser Eingriff Podcast v1/v2/v3 und Comic Stage NICHT. Der Grund fuer die
   Option statt einer festen Regel: 21 % der Titel im Pool stehen bereits in Versalien, dort hilft
   kein Weglassen von `toUpperCase`, und wer die Karten anders setzen will, soll das entscheiden. */


export function createCardBuilder(opts = {}) {
  const THREE = opts.THREE;
  if (!THREE) throw new Error('[card-builder] THREE fehlt — createCardBuilder({ THREE })');

  const P = Object.assign({
    preset: 'card',        // Tusche-Preset aus kfb-ink-canon.js
    /* Schreibung: eine Funktion, die der Aufrufer mitbringt. `null` = alles bleibt, wie es kommt —
       darum aendert dieser Eingriff Podcast v1/v2/v3 und Comic Stage nicht. */
    titleCase: null,
    // S62 · Das Blattformat kommt aus EINER Stelle (`kfb-card-format.js`) — vorher stand die Zahl
    // hier, in `academy-deck.js` und in `sky-cards.js`, mit Kommentaren, die mahnten, sie gleich zu
    // halten. Überschreiben darf man sie weiterhin (Sonderformate), aber der Default ist der Kanon.
    aspect: CARD_AR,       // Breite/Höhe des Blatts (Sollformat, Landscape)
    // Auflösungen. Die Linie braucht mehr Pixel als die Silhouette — genau dafür
    // ist die Kontur normalisiert. Maske klein zu halten spart spürbar Speicher.
    sheetRes: 1024, maskRes: 512, decalRes: 1536, pdfRes: 1500,
    // **Das Kartenraster auf der PDF-Seite.** Bruchteile der Seite: wo das 2×2 beginnt und wie
    // groß es ist. Default ist die ganze Seite — das ist der Kanon von v11 und **er stimmt nicht**
    // (siehe `cardGrid`-Befund unten). Ein Deck darf es im Manifest überschreiben (`deck.cardGrid`),
    // sonst gilt das hier, sonst die ganze Seite.
    cardGrid: null,        // { x, y, w, h } in 0..1 · null = ganze Seite (v11-Kanon)
    gridCols: 2, gridRows: 2,
    seeds: [7, 23, 41, 59],   // Kanten-Seeds, geteilt: 4 Texturpaare für beliebig viele Karten
    indexUrl: RAW_INDEX,
    quadrant: null,        // 0=TL 1=TR 2=BL 3=BR · null = Kanon (n−1)%4 · nur fuer Abnahme-Bilder
    gridOverrides: null,   // packId -> cardGrid · vom Aufrufer gepflegt (z. B. Nudge + localStorage)
    localIndex: null,      // optionale URL eines lokalen Fallback-Manifests
    backUrl: null,         // optionale URL der KFB-Rückseite als WARTEZUSTAND statt des Textblatts
    decalLift: 0.02,       // Weltabstand des Decal-Quads bei Breite 11 — skaliert mit
    // S62 · **`fit` ist der Kanon**: die gemessene Zelle liegt mittig im Sollformat, der Fehlbetrag
    // wird cremefarbener Rand innerhalb der Tuschekante. `cover` bleibt für Sonderfälle, ist aber
    // NICHT mehr Default — es schnitt bei `forget_utopia` 18 % der Zellhöhe weg, genau dort stehen
    // Titel und LORE-Zeile. Ein Format, das den Inhalt kostet, ist kein Format.
    /* 'cover' ist zurueck als Default -- aber aus einem anderen Grund als damals. Mit dem stumpfen
       Viertel als Quelle (Seitenrand als Reserve) ist der Cover-Verlust die Differenz der Formate,
       gemessen 1500x836: Viertel 1,794 gegen Blatt 1,740 = 3 % Breite, also 1,5 % je Seite -- das ist
       Kritzelrand, kein Inhalt. 'fit' dagegen laesst oben und unten einen cremefarbenen Streifen
       zwischen Bild und Tusche stehen, und genau das war Georgs Befund vom 17.8.: Maske und Kontur
       muessen EINE Form sein, kein Rand dazwischen. Die alte Warnung (18 % Verlust bei
       `forget_utopia`) galt fuer die eng gemessene Zelle als Quelle, nicht fuer das Viertel.
       NACHTRAG (dieselbe Stunde): 'cover' ist auch nicht die Antwort -- es schnitt bei "Metabolic
       Alkalosis Maggie" links das "P" von POWER und unten die zweite LORE-Zeile ab. Die Loesung ist
       keiner der beiden Modi, sondern das SOLLFORMAT: das Blatt bekommt die Form des Viertels
       (`aspect` = 1,794 statt 1,740), dann deckt 'fit' es exakt -- kein Schnitt, kein Streifen, EINE
       Form fuer Maske, Bild und Tusche. */
    artFit: 'fit',
    /* Wie viel Seitenrand mittig abgezogen wird. **0 = das ganze Viertel**, und dabei bleibt es:
       2 % kosteten unten ~8 px und damit die zweite LORE-Zeile ("maintenance by hypovolaemia…",
       Befund Georg 17.8. am Bild). Georgs Regel: viele Seiten haben Mikro-Geschichten um die vier
       Karten, mehr zeigen ist erlaubt -- ein fehlendes Wort nicht. Der Regler bleibt fuer den Fall,
       dass ein Deck wirklich in die Nachbarkarte laeuft. */
    quadTrim: 0,
    doubleSide: true,
  }, opts.params || {});

  // ---------------------------------------------------------------- Registry & PDF
  let registry = null, pmap = null, pool = null, pdfjs = null, cellAspect = null, lastFit = null, lastCrop = null;
  const deckCache = new Map(), docs = new Map(), pages = new Map(), artCache = new Map();
  let busy = false; const queue = [];
  const poolSkipped = [];               // Decks, deren Zellzuordnung nicht aufgeht (siehe loadDeck)

  async function loadRegistry() {
    if (registry) return registry;
    const urls = [P.indexUrl].concat(P.localIndex ? [P.localIndex] : []);
    for (const url of urls) {
      try { registry = await (await fetch(url)).json(); break; } catch (e) { /* nächster */ }
    }
    if (!registry) registry = { decks: [], baseUrl: '' };
    pmap = {};
    for (const d of (registry.decks || [])) pmap[d.packId] = d;
    return registry;
  }
  const fileUrl = (file) => (registry.baseUrl || '') + '/' + encodeURIComponent(file);

  // Compact-Keys (n/t/p/l/g) und Langform kommen beide im Repo vor — `keyMap` ist Kanon.
  async function loadDeck(packId) {
    if (deckCache.has(packId)) return deckCache.get(packId);
    await loadRegistry();
    const rd = pmap[packId];
    if (!rd || !rd.data) { deckCache.set(packId, []); return []; }
    let raw = null;
    try { raw = await (await fetch(fileUrl(rd.data))).json(); } catch (e) { deckCache.set(packId, []); return []; }
    const list = Array.isArray(raw) ? raw : (raw.cards || raw.data || []);
    const cards = list.map((c) => ({
      n: c.cardNumber != null ? c.cardNumber : c.n,
      title: c.cardName || c.t || '',
      power: c.power || c.p || '',
      lore: c.lore || c.l || '',
      deck: rd.title, packId, role: rd.role, gameMode: rd.gameMode,
    })).filter((c) => c.n && c.title);
    /* ZELLINDEX (17.8., Befund der Abnahme: angesagte != gezeigte Karte).
       Der Kanon rechnet Seite und Quadrant aus der Kartennummer (EMBED §4). Das setzt voraus, dass
       Eintrag 1 die erste Karte auf dem ersten Bogen ist. Bei einigen Decks ist Eintrag 1 die
       COVER-SEITE, dann folgen MANIFESTO / RULES / WARNING -- vier Eintraege, die keine Karte auf
       einem Bogen sind. Beweis am Bedienweg (`1001_kayfabe_nights`): fuer n=54 rechnete der Kanon
       Seite 15 / Quadrant 1, in dieser Zelle steht aber n=58 -- Versatz 5, nicht 1. Die MedKayfab-
       Decks haben keinen Vorspann (`medkayfab_histology` Eintrag 1 = "Epi the Epithelium"), darum
       stimmte dort alles und der Fehler blieb 20 Runden unsichtbar.
       Also: die Zelle zaehlt ueber die ECHTEN Karten, nicht ueber die Eintragsnummer. Erkannt wird
       nur ein VORSPANN-LAUF am Anfang (mitten im Deck wird nichts entfernt -- das wuerde die
       Zuordnung erneut verschieben). `cell` ist ab hier die Wahrheit fuer Seite und Quadrant. */
    const FRONT = /^\s*(the\s+)?(manifesto|warning|credits|impressum)\s*$|\(cover\)|^\s*rules\b|^\s*how\s+to\s+play|^\s*inhalt\b/i;
    let front = 0;
    while (front < cards.length && FRONT.test(cards[front].title)) front++;
    const BLANK = /blank\s*card/i;
    cards.forEach((c, i) => {
      c.cell = i < front ? null : i - front;      // 0-basiert, 4 pro Bogen
      c.front = i < front;
      c.blank = BLANK.test(c.title);
    });
    // Probe: die echten Karten muessen den Bogen voll fuellen (4 pro Seite). Tun sie es nicht, ist
    // die Zuordnung dieses Decks NICHT belastbar -- dann kommt es nicht in den Pool, statt eine
    // falsche Karte zu zeigen.
    const real = cards.length - front;
    deckCache.set(packId, cards);
    cards.gridOk = real > 0 && real % 4 === 0;
    cards.front = front;
    return cards;
  }

  async function buildPool(o = {}) {
    if (pool && !o.force) return pool;
    await loadRegistry();
    const want = (registry.decks || []).filter((d) => (!o.gameMode || d.gameMode === o.gameMode)
                                                   && (!o.packId || d.packId === o.packId));
    const all = [];
    poolSkipped.length = 0;
    for (const d of want) {
      const cards = await loadDeck(d.packId);
      if (!cards.length) continue;
      if (cards.gridOk === false && o.strictGrid !== false) {
        poolSkipped.push({ packId: d.packId, cards: cards.length, front: cards.front || 0 });
        continue;                                  // Zuordnung nicht belastbar -> nicht spielen
      }
      for (const c of cards) if (!c.front && !c.blank) all.push(c);
    }
    if (o.shuffle !== false) {
      const rnd = mulberry(o.seed || 4242);
      for (let i = all.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const t = all[i]; all[i] = all[j]; all[j] = t; }
    }
    pool = all;
    return pool;
  }

  async function ensurePdfjs() {
    if (pdfjs) return pdfjs;
    const lib = await import(PDFJS);
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    pdfjs = lib;
    return lib;
  }
  async function renderPage(url, pageNum, targetW) {
    const key = url + '#' + pageNum;
    if (pages.has(key)) return pages.get(key);
    const lib = await ensurePdfjs();
    let doc = docs.get(url);
    if (!doc) { doc = await lib.getDocument({ url }).promise; docs.set(url, doc); }
    const page = await doc.getPage(pageNum);
    const scale = targetW / page.getViewport({ scale: 1 }).width;
    const vp = page.getViewport({ scale });
    const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height;
    await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    pages.set(key, cv);
    return cv;
  }
  // Der Crop: das Kartenraster der Seite, Zelle nach `cardMapping` (TL·TR·BL·BR).
  //   Seite    = coverOffset + 1 + floor((cardNumber − 1) / 4)
  //   Quadrant = (cardNumber − 1) % 4
  //
  // ⚠ **BEFUND 2026-07-25, offen:** v11 und `card-registry.js` schneiden die Seite blind in
  // Viertel (`hw = pg.width / 2`) — das setzt voraus, dass die SEITE das Raster IST. Gemessen ist
  // sie das nicht: bei `forget_utopia` S. 3 liegt das Raster in x auf 30…569 von 600 und die
  // Zeilentrennung bei 0,466·H statt 0,5·H; `ignore_dystopia` hat zusätzlich ein **Kopfband** über
  // dem Raster, dadurch fängt der TL-Schnitt die Überschrift der Seite und schneidet die Karte
  // unten ab (reproduzierbar bei Karte 45, „The Surrendered Wheel").
  // **Die Zahlen gehören ins Manifest, nicht in den Code** — `index.json` ist die Wahrheit über
  // Deck-Geometrie. Bis `deck.cardGrid` dort steht, bleibt der Default die ganze Seite: derselbe
  // (falsche) Stand wie heute in Travel, aber wenigstens an EINER Stelle und benannt.
  // S61 (v11) · **Sechs Zahlen, nicht vier.** Gemessen am 26.7. mit `tools/cardgrid-pick.html`:
  // zwischen den Zellen liegt bei jedem Deck etwas anderes — Illustration bei `forget_utopia`
  // (gapX 0,160!), eine Schnittlinie bei `ignore_dystopia`, fast nichts bei `embrace_protopia`.
  // Ein Raster ohne Zwischenraum nimmt darum den Nachbarn mit ins Bild. `gapX`/`gapY` sind
  // Bruchteile der SEITE; Zelle = (w − gapX) / 2.
  //
  // ⚠ **S90a (28.7.): hier steht die ZWEITE Crop-Wahrheit, und sie weicht ab.** Travel schneidet seit
  // S90a das stumpfe Seitenviertel + `yShift` (`terrain-v13/card-registry.js` → `windowOf`, Begründung
  // dort und im Changelog). Gemessen an derselben Karte, `forget_utopia` Nr. 5: Travel **750×418**
  // (Seitenviertel), dieser Builder **573×391** (gemessene Zelle). Bewusst NICHT mitgeändert: dieser
  // Builder setzt die Karten, die man ausschneidet und mischt — der Schnitt ist damit eine Entscheidung
  // über physische Karten, nicht über ein Bild. Sie gehört Georg und dem Coworker
  // (`skills/SSOT_KFB_CardBuilder_PDF.md` §4), steht als benannter offener Punkt im Changelog zu S90a
  // und im Coworker-Handover. **Bis dahin: dieses `gridOf` ist NICHT der Kanon für Travel.**
  function gridOf(rd) {
    const g = (rd && rd.cardGrid) || P.cardGrid;
    return g ? { x: g.x || 0, y: g.y || 0, w: g.w != null ? g.w : 1, h: g.h != null ? g.h : 1,
                 gapX: g.gapX || 0, gapY: g.gapY || 0 }
             : { x: 0, y: 0, w: 1, h: 1, gapX: 0, gapY: 0 };
  }

  /* ------------------------------------------------------------------------------------
     GEMESSENES RASTER (17.8.2026). Warum das hier steht, obwohl die Zahlen ins Manifest
     gehoeren (EMBED §4, §6): `media/kfb/index.json` traegt fuer **130 Decks null cardGrid**
     (nachgesehen am Bedienweg) -- also faellt JEDES Deck auf "ganze Seite" zurueck, und das
     ist der Fehlschnitt, den §4 "Blind-Viertel-Crop ist falsch" benennt. Bis die Zahlen im
     Manifest stehen, misst der Builder sie an der gerenderten Seite. Das ersetzt `index.json`
     NICHT: `gridTable()` gibt sie fertig zum Eintragen heraus, und ein Manifest-Eintrag
     (`rd.cardGrid`) schlaegt die Messung immer.

     Gemessen wird der gedruckte Kartenrahmen, nicht die gezeichnete Kante (das ist der Grund,
     warum Travels Auto-Messung scheiterte -- sie suchte die Tuschekante IM Bild). An
     `medkayfab_histology` S. 11, 1500x836:
       linke Rahmenkante x  82 (Dunkelanteil 0,514)
       Naht (Spaltenmitte)  749/750 (0,931)  <- deutlichstes Signal der Seite
       Oberkante y          33 (0,754)
       Unterkante y         819 (0,584)
     Zelle daraus 668 x 384 = **AR 1,740** = `CARD_AR`. Diese Uebereinstimmung IST die Abnahme:
     ein falsch gemessener Rahmen trifft 1,74 nicht. Darum das Tor unten (`tol`), und bei
     Fehlschlag der benannte Notnagel aus §4 ({0.05,0.05,0.90,0.90}, Status "geschaetzt")
     statt einer stillen ganzen Seite. */
  const gridCache = new Map();          // packId -> { grid, status }
  // Linien je Seite+Achse+Band. Fiel bei einer Umstellung heraus und riss das ganze Artwork mit
  // ("nur Text", Fehler `lines@...:275` = ReferenceError, von der Warteschlange still gefangen).
  const lineCache = new Map();

  /* ------------------------------------------------------------------------------------
     DER SCHNITT IST DAS STUMPFE SEITENVIERTEL. Georgs Ansage vom 17.8., und sie ist richtig -- mein
     Denkfehler war die Zielgroesse: ich habe auf "kein Nachbarpixel im Bild" optimiert und dafuer
     sechs Zahlen pro Deck gebraucht. Die richtige Zielgroesse ist "immer die GANZE Karte".

     Warum das Viertel die ganze Karte garantiert: auf einem Bogen liegen VIER IDENTISCHE Karten
     symmetrisch. Damit liegt jede Karte vollstaendig in ihrem Viertel, und was zuviel im Bild ist,
     ist Seitenrand -- gemessen an `medkayfab_histology` S. 11: Viertel 0…418, Karte 33…417, also
     33 px Rand oben und 1 px unten; untere Zeile Viertel 418…836, Karte 418…819. Kein Beschnitt.
     `fitCell` legt die Zelle anschliessend mittig ins Sollformat (EMBED §3), der Rand faellt also
     als cremefarbener Saum an, nicht als Fehler.

     Was den Fehleindruck WIRKLICH erzeugte, war die ZUORDNUNG (siehe `loadDeck`/`cell`): mit dem
     falschen Zellindex zeigte das Viertel die Nachbarkarte, und das sah aus wie ein Schnittfehler.
     Beweis: `1001_kayfabe_nights` n=54 -> Kanon rechnete Seite 15/Quadrant 1, dort steht n=58.

     Deshalb ist der Default hier das Viertel und NICHT mehr der §4-Notnagel {0.05,…}: der schnitt
     bei mehreren Decks sichtbar in die eigene Karte (`medkayfab_neonatal_medicine` Titel angeschnitten,
     `..._obstetrics_gynaecology` LORE gekappt). Lieber etwas Seitenrand als ein fehlendes Wort.

     Feiner geht es weiter, aber nur auf Zuruf: `deck.cardGrid` (Manifest, EMBED §4 -- dort gehoeren
     die Zahlen hin), `P.cardGrid`, `P.gridOverrides[packId]` (Nudge in der Leiste), und
     `P.pageRows: true` schaltet die pro Seite gemessene Zeilenkante zu (Code unten, an
     gestrichelten und durchgezogenen Boegen geprueft). Default: alles aus, stumpfes Viertel. */
  const GRID_QUARTER = { x: 0, y: 0, w: 1, h: 1, gapX: 0, gapY: 0 };

  function lines(cv, axis, b0, b1, key) {
    if (lineCache.has(key)) return lineCache.get(key);
    const W = cv.width, H = cv.height;
    const along = axis === 'y' ? H : W;
    const a = Math.max(0, Math.round(b0) + 4);
    const b = Math.min((axis === 'y' ? W : H) - 1, Math.round(b1) - 4);
    if (b - a < 20) { lineCache.set(key, null); return null; }
    const g = cv.getContext('2d', { willReadFrequently: true });
    const img = axis === 'y' ? g.getImageData(a, 0, b - a + 1, H) : g.getImageData(0, a, W, b - a + 1);
    const d = img.data, iw = img.width, ih = img.height;
    const across = axis === 'y' ? iw : ih;
    /* Zwei Arten von Linie, beide zaehlen:
         DURCHGEZOGEN  Deckung >= 0,60  (medkayfab_histology: Rahmen 0,75-1,00)
         GESTRICHELT   Deckung >= 0,32 UND Spannweite erster..letzter Punkt >= 0,93 des Bandes
       Der zweite Fall ist der Befund vom 17.8.: `1001_kayfabe_nights` S. 14 zeichnet die Karten mit
       Schnitt-Strichlinien -- Deckung nur 0,42-0,52, darum feuerte die Messung nie und der Notnagel
       schnitt sichtbar falsch. Eine Textzeile faellt trotzdem durch: sie ist dicht, aber sie reicht
       nicht von Bandkante zu Bandkante ("Power: Clue Gimmick." spannt ~0,5). */
    const share = new Float32Array(along), span = new Float32Array(along);
    for (let i = 0; i < along; i++) {
      let s = 0, first = -1, last = -1;
      for (let j = 0; j < across; j++) {
        const o = (axis === 'y' ? i * iw + j : j * iw + i) * 4;
        if (0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2] < 130) { s++; if (first < 0) first = j; last = j; }
      }
      share[i] = s / across;
      span[i] = first < 0 ? 0 : (last - first + 1) / across;
    }
    const cand = [];
    for (let i = 1; i < along - 1; i++) {
      const isLine = share[i] >= 0.60 || (share[i] >= 0.32 && span[i] >= 0.93);
      if (isLine && share[i] >= share[i - 1] && share[i] >= share[i + 1]) cand.push({ i, v: share[i] });
    }
    cand.sort((p, q) => q.v - p.v);
    const keep = [];
    for (const o of cand) if (!keep.some((k) => Math.abs(k.i - o.i) < along * 0.01)) keep.push(o);
    keep.sort((p, q) => p.i - q.i);
    const out = keep.length >= 3 ? keep.map((o) => o.i) : null;
    lineCache.set(key, out);
    return out;
  }
  /* Aus der Linienliste die Kanten EINER der zwei Zellen. Die Probe ist die Bauart des Bogens:
     **vier identische Karten**, also sind beide Zellen gleich gross. Genau diese Probe hat das
     Histology-Raster bewiesen (82+668=750, 750+668=1418) -- hier waehlt sie zwischen mehreren
     Kandidaten aus. Beispiel `1001_kayfabe_nights` S. 14, Zeilen 42 | 87 | 447 | 792:
       Aussenkante 42 -> Zellen 405 / 345 (Differenz 60)  = die Seiten-Schnittlinie
       Aussenkante 87 -> Zellen 360 / 345 (Differenz 15)  = die Kartenlinie  <- gewaehlt
     Innen entweder eine Naht oder ein Paar (Zwischenraum, EMBED §4 `gap`; bei
     `kayfabizarro_philosophy` die Self-Care-Spalte, 725 . 835). */
  /* EINE Zahl pro Achse: die NAHT. Alles andere folgt aus der Symmetrie des Bogens.

     Georgs Ansage war "immer 1/4", und das ist auch die Zielgroesse -- aber das stumpfe Viertel
     stimmt nur, wenn das Kartenraster die ganze Seite ist. Hat die Seite ein KOPFBAND (Seitentitel
     oben, EMBED §4 nennt es), rutscht das Viertel nach oben: es fischt die Fusszeile der Karte
     darueber und kappt die eigene. Am Bild belegt (`academic_anarchy`, Karte "Max Gerson"): oben
     eine fremde LORE-Zeile, unten die eigene POWER abgeschnitten.

     Statt sechs Zahlen pro Deck reicht dafuer EINE pro Seite und Achse: liegt die Naht bei S, dann
     ist -- weil beide Zellen gleich gross sind -- die Zellhoehe (H − S) und der Rasteranfang
     2S − H. Ohne Kopfband kommt genau das Viertel heraus, mit Kopfband die verschobene Variante:
       medkayfab_histology S. 11   Naht 417  -> Anfang  -2 ~ 0   Zellen 0…417 / 418…836  (= Viertel)
       1001_kayfabe_nights S. 14   Naht 447  -> Anfang  58       Zellen 58…447 / 447…836
       waagerecht S. 11            Naht 749  -> Anfang  -2 ~ 0   (= Haelften)
     Bei einem Zwischenraum (EMBED §4 `gap`, z. B. die Self-Care-Spalte bei `kayfabizarro_philosophy`,
     725 . 835) zaehlt die MITTE des Paars -- dann ist etwas Steg im Bild, aber die Karte ganz.
     Das ist der Punkt: lieber Seitenrand als ein fehlendes Wort. */
  function seamOf(L, along) {
    if (!L) return null;
    const mid = along / 2, tol = along * 0.10;
    const near = L.filter((y) => Math.abs(y - mid) <= tol);
    if (!near.length) return null;
    const S = (near[0] + near[near.length - 1]) / 2;      // Naht oder Mitte des Zwischenraums
    if (S < along * 0.38 || S > along * 0.62) return null;
    const size = along - S;
    if (size < along * 0.25 || size > along * 0.62) return null;
    return { start: Math.max(0, Math.round(2 * S - along)), size: Math.round(size), seam: Math.round(S) };
  }

  function gridFor(rd) {
    if (rd && rd.cardGrid) return gridOf(rd);                       // Manifest schlaegt alles
    if (P.cardGrid) return gridOf(rd);
    const id = rd.packId;
    const ov = P.gridOverrides && P.gridOverrides[id];
    if (ov) { gridCache.set(id, { grid: ov, status: 'hand' }); return gridOf({ cardGrid: ov }); }
    if (!gridCache.has(id)) gridCache.set(id, { grid: GRID_QUARTER, status: 'viertel' });
    return gridOf({ cardGrid: GRID_QUARTER });
  }

  async function cropCard(card) {
    const ck = card.packId + '#' + card.n;
    /* Auch der Cache-Treffer muss die Messung mitfuehren. Vorher kehrte er frueh zurueck, ohne
       `lastCrop` zu setzen -- die Abnahme las dann die Zahlen der VORIGEN Karte und hielt Karte 12
       (qi 3) fuer qi 2. Ein Messwert, der still von gestern ist, ist schlimmer als keiner. */
    if (artCache.has(ck)) { const h = artCache.get(ck); lastCrop = h.crop; return h.cv; }
    await loadRegistry();
    const rd = pmap[card.packId];
    if (!rd || !rd.pdf) return null;
    const off = rd.coverOffset != null ? rd.coverOffset : 1;
    // `cell` kommt aus `loadDeck` (echte Karten, Vorspann abgezogen). Fehlt sie, gilt der Kanon.
    const cell = card.cell != null ? card.cell : card.n - 1;
    const pageNum = off + 1 + Math.floor(cell / 4);
    // Kanon (EMBED §4): Quadrant = (Kartennummer − 1) % 4, Reihenfolge TL·TR·BL·BR. Der feste
    // Quadrant von heute morgen ist WEG -- er war ein Umweg um das fehlende Raster und zerriss die
    // Identitaet der Karte (Text aus dem Manifest, Bild aus der Nachbarzelle).
    const qi = P.quadrant != null ? P.quadrant : cell % 4;
    const pg = await renderPage(fileUrl(rd.pdf), pageNum, P.pdfRes);
    const G = gridFor(rd);
    const gx = pg.width * G.x, gy = pg.height * G.y;
    const cw = Math.floor(pg.width * (G.w - G.gapX) / P.gridCols);
    const chh = Math.floor(pg.height * (G.h - G.gapY) / P.gridRows);
    cellAspect = cw / chh;   // Deck-Raster; die tatsaechliche Zelle steht in `lastCrop.ar`
    const sx = gx + (qi % P.gridCols) * (cw + pg.width * G.gapX);
    const row = Math.floor(qi / P.gridCols);
    let sy = gy + row * (chh + pg.height * G.gapY), ch = chh, src = 'viertel';
    let sx2 = sx, cw2 = cw;
    /* Naht messen und daraus das Fenster bauen -- senkrecht UND waagerecht. Kein Deck-Wert noetig.
       Faellt eine Achse durch (keine durchlaufende Linie gefunden), bleibt dort das stumpfe Viertel:
       der Rueckweg ist immer der einfache Fall, nie ein erratenes Fenster. */
    /* NAHTMESSUNG IST AUS (`seamFit: true` schaltet sie ein). 17.8., Georgs Einwand "einfach die
       Karten immer 1/4 setzen" -- und er hat recht, gemessen am Bild:
         medkayfab_obstetrics_gynaecology "Chorio-Casper" (Zelle 27, qi 3)
           Naht-Fenster  683x420  -> linke Textspalte angeschnitten ("Snowstorm.." und die
                                     POWER-Zeile beginnen ausserhalb), Unterkante ab
           Viertel       750x418  -> Karte ganz drin, dazu etwas Kritzelrand
       Das ist die ganze Bilanz der letzten Runden: das Viertel ist GROESSER als die Karte, jede
       Verfeinerung kann darum nur wegnehmen, was schon drin war. Der Fehler, der wie ein
       Schnittfehler aussah, war die ZUORDNUNG (Vorspann-Versatz, siehe `card.cell`) -- eine
       Rechenfrage, gegen die ich Messapparate gebaut habe. Ein Viertel ist ein Viertel. */
    if (P.seamFit === true && !rd.cardGrid && !P.cardGrid && !(P.gridOverrides && P.gridOverrides[rd.packId])) {
      const kb = rd.packId + '#' + pageNum + '#';
      const Y = seamOf(lines(pg, 'y', sx, sx + cw, kb + 'y' + (qi % P.gridCols)), pg.height);
      if (Y) { sy = row === 0 ? Y.start : Y.seam; ch = Y.size; src = 'naht'; }
      const X = seamOf(lines(pg, 'x', sy, sy + ch, kb + 'x' + row), pg.width);
      if (X) { sx2 = (qi % P.gridCols) === 0 ? X.start : X.seam; cw2 = X.size; src = Y ? 'naht' : 'naht-x'; }
    }
    const gs = gridCache.get(rd.packId);
    lastCrop = { page: pageNum, qi, cell, sx: Math.round(sx2), sy: Math.round(sy), cw: cw2, ch,
                 pageW: pg.width, pageH: pg.height, ar: +(cw2 / ch).toFixed(3), rowSrc: src,
                 grid: G, gridStatus: gs ? gs.status : (rd.cardGrid ? 'manifest' : 'param') };
    /* `quadTrim` fasst das Viertel mittig etwas enger, damit die Tusche-Kontur nicht in die
       Randbeschriftung der Nachbarkarte schneidet -- der Ersatz fuer den weggeworfenen `artInset`. */
    const trim = P.quadTrim || 0;
    const tx = Math.round(cw * trim), ty = Math.round(ch * trim);
    const cv = document.createElement('canvas'); cv.width = cw - tx * 2; cv.height = ch - ty * 2;
    cv.getContext('2d').drawImage(pg, sx2 + tx, sy + ty, cv.width, cv.height, 0, 0, cv.width, cv.height);
    artCache.set(ck, { cv, crop: lastCrop });
    return cv;
  }
  function pump() {
    if (busy || !queue.length || document.hidden) return;
    const job = queue.shift(); busy = true;
    let done = false;
    // WATCHDOG: pdf.js rendert intern über requestAnimationFrame. Wechselt der Nutzer
    // während eines Renders den Tab, settelt das Promise NIE — ohne diesen Timer bliebe
    // `busy` für die Sitzung hängen und die Pipeline wäre tot, ohne eine Zeile im Log.
    const finish = (ok, err) => {
      if (done) return; done = true; clearTimeout(timer);
      if (!ok) {
        if (job.tries < 2) { job.tries++; queue.push(job); }
        else if (job.fail) job.fail(err);
      }
      busy = false; pump();
    };
    const timer = setTimeout(() => finish(false, null), 20000);
    cropCard(job.card)
      .then((cv) => { if (done) return; if (cv) { done = true; clearTimeout(timer); job.cb(cv); busy = false; pump(); } else finish(false, new Error('kein Artwork im Manifest')); })
      .catch((e) => finish(false, e));
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pump(); });

  // ---------------------------------------------------------------- Texturen
  const tex = (c, srgb) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const _masks = new Map(), _decals = new Map();

  // Silhouette als alphaMap: weiß innen, schwarz außen, harte Kante über `alphaTest`.
  // Die Fläche darf um die KLEINSTE vorkommende Halbbreite nach außen — nicht mehr:
  // `taper` moduliert die Federbreite, an den dünnen Stellen blitzt sie sonst durch.
  function maskTexture(seed) {
    const key = P.preset + '#' + seed + '#' + P.aspect.toFixed(3) + '#' + P.maskRes;
    if (_masks.has(key)) return _masks.get(key);
    const W = P.maskRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    const pts = contour(P.preset, seed, W, H);
    g.fillStyle = '#fff'; g.strokeStyle = '#fff';
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.lineWidth = maskGrow(P.preset, pts, W, H, seed) * 1.6;
    pathOf(g, pts); g.fill(); g.stroke();
    const t = tex(c, false);
    _masks.set(key, t);
    return t;
  }
  // Decal: NUR das Band auf transparentem Grund, auf DERSELBEN Kontur wie die Maske.
  function decalTexture(seed) {
    const key = P.preset + '#' + seed + '#' + P.aspect.toFixed(3) + '#' + P.decalRes;
    if (_decals.has(key)) return _decals.get(key);
    const W = P.decalRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    drawInk(P.preset, c.getContext('2d'), contour(P.preset, seed, W, H), W, H, seed);
    const t = tex(c);
    _decals.set(key, t);
    return t;
  }

  // Das Textblatt — der Zustand VOR dem Artwork und der Fallback, wenn keins kommt.
  // Es ist kein Platzhalter im Sinne von „leer": Titel, Deck und Lore stehen drauf,
  // die Karte ist lesbar und spielbar, auch wenn das PDF nie ankommt.
  /* ⚠ DIE RÜCKSEITE ALS WARTEZUSTAND (Georg 06.09.: »bis die Karte(n) geladen sind, sollten wir die
     KFB card backside zeigen, keine Text/Platzhalter«). ADDITIV: nur wenn `backUrl` gesetzt ist —
     ohne den Parameter bleibt der Textzustand genau wie bisher, damit die anderen Bauten
     (Podcast, SpinballCast) sich nicht ändern. Das Bild wird EINMAL geladen und in dieselbe Kontur
     gestanzt wie das Papier, also teilt es die Silhouette der Karte statt ein Rechteck zu sein.
     Ist es noch nicht da, gilt der Textzustand — ein ehrlicher Rückfall, kein leeres Blatt. */
  let backImg = null, backWarten = [];
  function ensureBack() {
    if (!P.backUrl || backImg !== null) return;
    backImg = undefined;                                   // läuft
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => { backImg = im; const w = backWarten; backWarten = []; for (const f of w) { try { f(); } catch (e) {} } };
    im.onerror = () => { backImg = null; backWarten = []; console.log('[cardbuilder] BEFUND: Kartenrückseite nicht geladen — Textblatt bleibt der Wartezustand.'); };
    im.src = P.backUrl;
  }
  function backSheetTexture(seed) {
    if (!backImg) return null;
    const W = P.sheetRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.save(); pathOf(g, contour(P.preset, seed, W, H)); g.clip();
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    /* `cover`: die Rückseite ist ein gestaltetes Blatt und darf nicht verzerrt werden. */
    const iw = backImg.naturalWidth || backImg.width, ih = backImg.naturalHeight || backImg.height;
    const s = Math.max(W / iw, H / ih);
    g.drawImage(backImg, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
    g.restore();
    const t = tex(c);
    return t;
  }

  function sheetTexture(card, seed) {
    const W = P.sheetRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.save(); pathOf(g, contour(P.preset, seed, W, H)); g.clip();
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    // Papierton: ein sehr blasser Verlauf, damit die Fläche nicht wie Karton wirkt.
    const norm = (s) => (typeof P.titleCase === 'function'
      ? P.titleCase(String(s == null ? '' : s)) : String(s == null ? '' : s));
    const grd = g.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, 'rgba(255,255,255,.5)'); grd.addColorStop(1, 'rgba(31,26,20,.06)');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.fillStyle = INK_COLOR; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    let fs = Math.round(H * 0.155);
    /* KEIN ALLCAPS (Georg 07:00). Irish Grover ist eine Displayschrift mit ausgepraegten Ober- und
       Unterlaengen — in Versalien verliert sie genau die Silhouette, an der man ein Wort erkennt,
       und lange Kartentitel werden dadurch zusaetzlich breiter. Gemischtschreibung ist auch, was auf
       den gedruckten Karten steht. */
    const title = norm(card.title);
    for (let i = 0; i < 14; i++) { g.font = '700 ' + fs + 'px "Irish Grover", Georgia, serif'; if (g.measureText(title).width <= W * 0.84) break; fs = Math.round(fs * 0.92); }
    g.fillText(title, W / 2, H * 0.42);
    g.font = Math.round(H * 0.062) + 'px "Special Elite", monospace';
    g.globalAlpha = 0.72;
    /* DIE DECK-ZEILE SCHRUMPFT WIE DER TITEL. Sie stand als einzige der drei Textzeilen ohne
       Anpassung da: der Titel hat seine Schrumpfschleife (Z. 521), die Lore ihren Umbruch (Z. 530) —
       das Deck hatte weder noch. Gemessen auf der echten Leinwand (1024 × 571):
       „Power Pyramid Plumbing & Global Psyop Wrestling – Expansion Deck 01" = 1294 px auf 1024 px
       Breite, also 26 % Überhang; und weil `textAlign` mittig ist, schneidet es symmetrisch an
       BEIDEN Rändern mitten im Wort ab.
       Dieselbe Schleife wie beim Titel, nicht der Umbruch der Lore: die Zeilen darunter liegen fest
       bei `H * (0,7 + i · 0,075)` und setzen voraus, dass das Deck EINE Zeile bleibt.
       Grenze 0,84 wie beim Titel; 12 Schritte à 0,92 reichen für 2,6-fachen Überhang (0,92^12 = 0,37). */
    const deck = norm(card.deck || 'KFB');
    let ds = Math.round(H * 0.062);
    for (let i = 0; i < 12; i++) {
      g.font = ds + 'px "Special Elite", monospace';
      if (g.measureText(deck).width <= W * 0.84) break;
      ds = Math.max(8, Math.round(ds * 0.92));
    }
    g.fillText(deck, W / 2, H * 0.56);
    if (card.lore) {
      g.globalAlpha = 0.6;
      g.font = Math.round(H * 0.05) + 'px "Special Elite", monospace';
      const max = W * 0.76, lines = []; let line = '';
      for (const w of String(card.lore).split(/\s+/)) {
        const t2 = line ? line + ' ' + w : w;
        if (g.measureText(t2).width > max && line) { lines.push(line); line = w; } else line = t2;
        if (lines.length >= 3) break;
      }
      if (line && lines.length < 3) lines.push(line);
      lines.forEach((l, i) => g.fillText(l, W / 2, H * (0.7 + i * 0.075)));
    }
    g.restore();
    return tex(c);
  }

  // Artwork-Blatt: der PDF-Quadrant auf der Silhouette. **S62 · `fit` ist der Kanon** — die gemessene
  // Zelle liegt MITTIG im Sollformat, der Fehlbetrag wird Papier (Creme) innerhalb der Tuschekante.
  // `cover` füllt und schneidet dafür; das ist der alte, verlustbehaftete Weg (Sonderfälle).
  function artSheetTexture(crop, seed) {
    const W = P.sheetRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    const pts = contour(P.preset, seed, W, H);
    g.save(); pathOf(g, pts); g.clip();
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    if (P.artFit === 'cover') {
      const s = Math.max(W / crop.width, H / crop.height);
      const dw = crop.width * s, dh = crop.height * s;
      g.drawImage(crop, (W - dw) / 2, (H - dh) / 2, dw, dh);
      lastFit = null;
    } else {
      /* Das Bild fuellt GENAU die Tusche-Kontur, nicht die Leinwand. Das ist der dritte Anlauf und
         der richtige: die Kontur des `card`-Presets liegt INNEN (`margin: 14` im Baurahmen
         `refW: 1024` = 1,4 % je Seite), also clippte sie bisher den Blattrand weg -- Georgs
         Marginalien und seine Signatur am Unterrand (Befund 17.8. an "Lead-Pipe Larry" und
         "The Scientologist Artist"). Vorher versucht und verworfen: `artInset` (weisser Ring, zwei
         Formen), `cover` (schnitt "P" von POWER und die LORE-Zeile).
         Jetzt wird der Extrempunkt-Rahmen der Kontur gemessen und das Viertel exakt darin
         aufgezogen: Maske, Bild und Tusche sind EINE Form, und kein Pixel der Seite fehlt.
         Preis: der Rahmen ist nicht exakt formgleich zum Viertel (der Inset ist in Pixeln gleich,
         in Prozent also quer anders) -- das Bild wird um rund 1 % anisotrop gezogen. Ein Prozent
         Verzerrung ist unsichtbar, ein fehlendes Wort nicht. */
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const q of pts) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
      g.drawImage(crop, x0, y0, x1 - x0, y1 - y0);
      lastFit = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, scale: (x1 - x0) / crop.width,
                  randX: 0, randY: 0 };
    }
    g.restore();
    return tex(c);
  }

  // ---------------------------------------------------------------- die Karte
  let made = 0;
  function make(card, o = {}) {
    const w = o.width != null ? o.width : 11;
    const h = w / P.aspect;
    const seed = o.seed != null ? o.seed : P.seeds[(card && card.n != null ? card.n : made) % P.seeds.length];
    made++;

    const group = new THREE.Group();
    group.frustumCulled = false;

    const sheetTex = (P.backUrl ? backSheetTexture(seed) : null) || sheetTexture(card || {}, seed);
    const mat = new THREE.MeshBasicMaterial({
      map: sheetTex, alphaMap: maskTexture(seed), alphaTest: 0.5,
      side: P.doubleSide ? THREE.DoubleSide : THREE.FrontSide, toneMapped: false,
    });
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), mat);
    sheet.frustumCulled = false;
    group.add(sheet);
    /* ⚠ DIE ERSTE KARTE ENTSTEHT VOR DEM BILD. Ohne diesen Nachtrag zeigte genau sie das
       Textblatt — also der Fall, den Georg gemeldet hat. Wer wartet, wird nachgetragen; und nur,
       solange das Artwork noch nicht da ist (`artState === 'text'`), sonst überschriebe die
       Rückseite eine fertige Karte. */
    if (P.backUrl && !backImg) {
      ensureBack();
      backWarten.push(() => {
        if (!rec || rec.artState !== 'text') return;
        const t = backSheetTexture(seed);
        if (!t) return;
        if (mat.map) mat.map.dispose();
        mat.map = t; mat.needsUpdate = true;
      });
    }

    const dmat = new THREE.MeshBasicMaterial({
      map: decalTexture(seed), transparent: true, depthWrite: false,
      side: P.doubleSide ? THREE.DoubleSide : THREE.FrontSide, toneMapped: false,
    });
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), dmat);
    decal.position.z = P.decalLift * (w / 11);
    decal.renderOrder = 1;
    decal.frustumCulled = false;
    group.add(decal);

    const rec = {
      card, group, sheet, mat, decal, dmat, seed, width: w, height: h,
      art: null, artState: 'text',
      // Was die Kante dieser Karte WIRKLICH ist — nicht, was behauptet wird.
      measure() {
        const Wm = P.decalRes, Hm = Math.round(Wm / P.aspect);
        return measureInk(contour(P.preset, seed, Wm, Hm), Wm, Hm, P.preset, seed);
      },
      // Eigene Fläche einsetzen (Live-Render-Textur, Video, Foto). Die Silhouette
      // bleibt dieselbe — die Karte ist ein Steckplatz, kein festes Bild.
      setSurface(texture) {
        if (!texture) return;
        if (mat.map && mat.map !== sheetTex) mat.map.dispose();
        mat.map = texture; mat.needsUpdate = true;
        rec.artState = 'extern';
      },
      dispose() {
        sheet.geometry.dispose(); decal.geometry.dispose();
        if (mat.map) mat.map.dispose();
        mat.dispose(); dmat.dispose();
        // Maske und Decal sind GETEILT (vier Seeds für beliebig viele Karten) —
        // die gehören dem Builder, nicht der Karte. `builder.dispose()` räumt sie ab.
      },
    };

    if (o.art !== false && card && card.packId) {
      rec.artState = 'lädt';
      queue.push({ card, tries: 0,
        cb: (crop) => {
          if (rec.artState === 'extern') return;   // jemand hat inzwischen selbst bestückt
          const t = artSheetTexture(crop, seed);
          if (mat.map) mat.map.dispose();
          mat.map = t; mat.needsUpdate = true;
          rec.art = crop; rec.artState = 'artwork';
          if (o.onArt) { try { o.onArt(rec); } catch (e) {} }
        },
        fail: (e) => { rec.artState = 'nur Text'; if (o.onFail) { try { o.onFail(e); } catch (e2) {} } },
      });
      pump();
    }
    return rec;
  }

  return {
    name: 'kfb-card-builder',
    // ---- Daten
    loadRegistry, loadDeck, pool: buildPool,
    /** Decks, die der Pool auslaesst, weil ihre Zellzuordnung nicht aufgeht (4 pro Bogen). */
    get poolSkipped() { return poolSkipped.slice(); },
    get decks() { return (registry && registry.decks) || []; },
    get cellAspect() { return cellAspect; },
    // Was der letzte Schnitt WIRKLICH war (Seite, Zelle, Versatz in Pixeln) — damit ein Nachjustieren
    // von `quadShift` am Bild eine Zahl hat und keine Vermutung.
    get lastCrop() { return lastCrop; },
    /* Die gemessenen Raster, fertig fuer `media/kfb/index.json` (dort gehoeren sie hin, EMBED §6).
       `{ packId: { cardGrid, cardGrid_status } }` -- "gemessen" oder "geschaetzt". */
    gridTable() {
      const out = {};
      for (const [id, v] of gridCache) out[id] = { cardGrid: v.grid, cardGrid_status: v.status === 'hand' ? 'gemessen (Hand)' : 'stumpfes Viertel' };
      return out;
    },
    // S62 · Abnahme des Sollformats. Sagt für die letzte eingelegte Zelle, wie viel Papierrand
    // entstanden ist — und was `cover` an derselben Zelle GEKOSTET hätte. Beides in einem Blick,
    // sonst ist „Ränder statt Verlust" eine Behauptung.
    formatReport() {
      const cw = lastFit ? lastFit.w / lastFit.scale : null;
      const ch = lastFit ? lastFit.h / lastFit.scale : null;
      const loss = cw ? coverLoss(cw, ch, P.aspect) : null;
      return {
        sollformat: P.aspect,
        anker: CARD_AR_FROM.anker,
        fit: P.artFit,
        zelle: cellAspect ? +(1 / cellAspect).toFixed(3) : null,   // cellAspect ist H/W
        randX: lastFit ? +(lastFit.randX * 100).toFixed(2) : null, // % Blattbreite, je Seite
        randY: lastFit ? +(lastFit.randY * 100).toFixed(2) : null, // % Blatthöhe, oben wie unten
        verlustJetzt: 0,
        verlustMitCover: loss ? +((loss.hoehe || loss.breite) * 100).toFixed(2) : null,
      };
    },
    get pending() { return queue.length + (busy ? 1 : 0); },
    clearQueue() { queue.length = 0; },
    // ---- Bauen
    make,
    // Eine Karte aus dem Pool nach Deck + Nummer, ohne den Pool zu kennen.
    async makeById(packId, n, o) {
      const cards = await loadDeck(packId);
      const card = cards.find((c) => c.n === n);
      return card ? make(card, o) : null;
    },
    // ---- Tusche zum Selbermalen (Rückseiten, Chips, eigene Blätter)
    ink: { INK_PRESETS, contour, pathOf, drawInk, maskGrow, measureInk },
    // ---- Regler. Ändert man Preset, Aspekt oder Auflösung, sind die geteilten
    // Texturen von gestern — deshalb wird der Cache mitgeräumt.
    setParams(p) {
      const touch = p && (p.preset || p.aspect || p.maskRes || p.decalRes);
      // Der Ausschnitt selbst haengt an `quadrant`/`quadShift` — aendert man die, sind die
      // geschnittenen Zellen im `artCache` von gestern. Ohne dieses Leeren misst man den alten
      // Schnitt und haelt ihn fuer den neuen (der Fehler, der `card-grids.json` so lange kostete).
      if (p && (p.quadrant !== undefined || p.cardGrid !== undefined || p.gridOverrides !== undefined)) artCache.clear();
      Object.assign(P, p || {});
      if (touch) { for (const t of _masks.values()) t.dispose(); for (const t of _decals.values()) t.dispose(); _masks.clear(); _decals.clear(); }
    },
    get params() { return P; },
    get presets() { return INK_PRESETS; },
    dispose() {
      queue.length = 0;
      for (const t of _masks.values()) t.dispose();
      for (const t of _decals.values()) t.dispose();
      _masks.clear(); _decals.clear(); pages.clear(); artCache.clear();
    },
  };
}
