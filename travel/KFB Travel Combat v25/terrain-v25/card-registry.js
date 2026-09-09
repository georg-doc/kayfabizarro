// ============================================================================
// card-registry.js — KFB Travel · Slice S23 · echte Karten aus Deck-PDF + JSON
// ----------------------------------------------------------------------------
// PORTIERT aus `rollercoaster-v11` (`loadRegistry`, `renderPdfPage`,
// `ensureCardArt`). Der Vertrag steht im Repo-Manifest und wird hier NICHT neu
// erfunden — er ist Kanon:
//
//   media/kfb/index.json  ·  schema kfb-deck-registry/v2
//   cardMapping: 2×2 Zellen pro Seite, Reihenfolge TL · TR · BL · BR
//   Seite     = coverOffset + 1 + floor((cardNumber − 1) / 4)
//   Quadrant  = (cardNumber − 1) % 4
//   URL       = baseUrl + '/' + encodeURIComponent(dateiname)
//   keyMap    = { n: cardNumber, t: cardName, p: power, l: lore, g: grade }
//
// DREI REGELN, die in v11 teuer gelernt wurden und hier von Anfang an gelten:
//  1. **Text zuerst, Bild später.** Die Karten-JSON kommt in Millisekunden, das
//     PDF-Rendern dauert. Also erst Titel/Lore als Blatt zeigen, dann das echte
//     Artwork nachschieben. Nie ein leeres Blatt, nie ein Ladebalken.
//  2. **EIN PDF-Render zur Zeit.** Sonst ruckelt der Flug. Eine Warteschlange mit
//     einem Platz; Seiten werden gecacht, weitere Crops derselben Seite sind billig.
//  3. **RAW-first, lokaler Fallback, dann Textkarten.** Das Manifest im Repo ist
//     die Wahrheit; eine lokale Kopie darf nicht veralten.
//
//   const reg = createCardRegistry();
//   const pool = await reg.pool();            // gemischt über alle Decks
//   reg.requestArt(card, (canvas) => …);      // gedrosselt, ruft zurück wenn da
// ============================================================================

const RAW_INDEX = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';
const LOCAL = (p) => new URL(p, import.meta.url).href;
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

import { CARD_AR as SHEET_AR } from '../cardbuilder/kfb-card-format.js';

function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function createCardRegistry(opts = {}) {
  let registry = null, pmap = null, pool = null, pdfjs = null;
  const decks = new Map();          // packId → normalisierte Kartenliste
  const docs = new Map();           // url → pdf-Dokument
  const pages = new Map();          // url#seite → Canvas
  const artCache = new Map();       // packId#n → Canvas (Quadrant)
  let busy = false;
  const queue = [];
  let cellAspect = null;            // GEMESSEN aus der gerenderten Zelle (H/W)
  let lastCrop = null;              // S83 · Abnahme: Zelle, aufgezogenes Blatt, Zuwachs, geklemmt?
  // S90a · Crop-Modus. 'viertel' = der Ausschnitt IST das Seitenviertel (Standard, siehe `windowOf`),
  // 'raster' = der alte Weg über die sechs gemessenen Zahlen. Beides liest `card-grids.json`.
  let modus = 'viertel';
  const yShift = Object.create(null);   // packId → Versatz der OBEREN Zeile, Bruchteil der Seitenhöhe

  async function loadRegistry() {
    if (registry) return registry;
    for (const url of [RAW_INDEX, LOCAL('./kfb-index.json')]) {
      try { registry = await (await fetch(url)).json(); break; }
      catch (e) { /* nächster Versuch */ }
    }
    if (!registry) registry = { decks: [], baseUrl: '' };
    // S90b-Vorbereitung · **Decks von außen einhängen.** Im Repo liegen mehr Deck-PDFs als im Manifest
    // stehen (gemessen 28.7.: neun PDFs, vier Einträge). Damit ein Deck geprüft werden kann, BEVOR der
    // Coworker es ins Manifest schreibt, darf der Aufrufer welche mitgeben — das Manifest gewinnt
    // trotzdem, gemischt wird nur, was es selbst nicht führt. Kein Ersatz für das Manifest, ein Vorlauf.
    if (Array.isArray(opts.extraDecks) && opts.extraDecks.length) {
      const have = new Set((registry.decks || []).map((d) => d.packId));
      registry.decks = (registry.decks || []).concat(opts.extraDecks.filter((d) => d && d.packId && !have.has(d.packId)));
    }
    pmap = {};
    for (const d of (registry.decks || [])) pmap[d.packId] = d;
    // S61/S90a · **Kartenraster einmischen.** Die Zahlen stehen NUR in `card-grids.json`, nicht im Code
    // (Regel: eine Zahl, ein Ort). Seit S90a ist das eine Zahl pro Deck (`yShift`) statt sechs; der
    // alte Rahmen liegt unter `legacy` und gilt nur im Modus 'raster'.
    // Der Fehlschlag ist harmlos: ohne Datei bleibt es beim stumpfen Seitenviertel, yShift 0.
    try {
      const g = await (await fetch(LOCAL('./card-grids.json'))).json();
      if (g.modus === 'raster' || g.modus === 'viertel') modus = g.modus;
      for (const id of Object.keys(g.grids || {})) {
        const e0 = g.grids[id] || {};
        if (e0.yShift != null) yShift[id] = +e0.yShift || 0;
      }
      // Rückweg: im Raster-Modus wieder der gemessene Rahmen. Das Manifest gewinnt weiter, wo es selbst
      // ein `cardGrid` führt — im Viertel-Modus wird es ignoriert, weil das Viertel keinen Rahmen braucht.
      for (const id of Object.keys(g.legacy || {})) {
        const d = pmap[id], L = g.legacy[id];
        if (d && !d.cardGrid && L && L.cardGrid) d.cardGrid = L.cardGrid;
      }
    } catch (e) { console.warn('[card-registry] kein Kartenraster geladen — Crop bleibt beim stumpfen Seitenviertel', e); }
    return registry;
  }

  const fileUrl = (file) => (registry.baseUrl || '') + '/' + encodeURIComponent(file);

  // Karten-JSON eines Decks. Compact-Keys (n/t/p/l/g) werden über keyMap aufgelöst —
  // beide Schreibweisen kommen im Repo vor.
  async function loadDeck(packId) {
    if (decks.has(packId)) return decks.get(packId);
    await loadRegistry();
    const rd = pmap[packId];
    if (!rd || !rd.data) { decks.set(packId, []); return []; }
    let raw = null;
    try { raw = await (await fetch(fileUrl(rd.data))).json(); } catch (e) { decks.set(packId, []); return []; }
    const list = Array.isArray(raw) ? raw : (raw.cards || raw.data || []);
    const cards = list.map((c) => ({
      n: c.cardNumber != null ? c.cardNumber : c.n,
      title: c.cardName || c.t || '',
      power: c.power || c.p || '',
      lore: c.lore || c.l || '',
      deck: rd.title, packId, role: rd.role, gameMode: rd.gameMode,
    })).filter((c) => c.n && c.title);
    decks.set(packId, cards);
    return cards;
  }

  // Ein gemischter Pool über alle (oder gefilterte) Decks. Der Almanach ist eindeutig:
  // gemischt wird es erst gut — der Funke springt zwischen zwei Stimmungen.
  async function buildPool(o = {}) {
    if (pool && !o.force) return pool;
    await loadRegistry();
    const want = (registry.decks || []).filter((d) => (!o.gameMode || d.gameMode === o.gameMode));
    const all = [];
    for (const d of want) {
      const cards = await loadDeck(d.packId);
      for (const c of cards) all.push(c);
    }
    const rnd = mulberry(o.seed || 4242);
    for (let i = all.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const t = all[i]; all[i] = all[j]; all[j] = t; }
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
    // S90a+ · **Die Breite gehört in den Cache-Schlüssel.** Vorher war er nur `url#seite` — das ging
    // gut, solange alle Aufrufe 1500 px verlangten. `measureYShift` rendert die Seite absichtlich klein
    // (420 px), und ohne die Breite im Schlüssel hätte der nächste Crop diese kleine Seite
    // weiterverwendet (oder umgekehrt): ein Ausschnitt aus der falschen Auflösung, ohne Fehlermeldung.
    const key = url + '#' + pageNum + '@' + targetW;
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

  // S90a · **Das Fenster IST das Seitenviertel.** Georgs Vorgabe, wörtlich: „ganz stumpf ein Raster,
  // wo ich einfach immer zweimal mit sich schneide" — und nachgerechnet ist das die richtige Antwort,
  // nicht die bequeme.
  //
  // Warum es den Widerspruch auflöst: die sechs gemessenen Zahlen ergaben pro Deck ein anderes
  // Zellverhältnis (1,462 · 1,740 · 1,969), obwohl ausgeschnittene Karten EINES Spiels gleich groß
  // sein müssen. Das Viertel entscheidet das nicht, es rechnet es weg: die PDF-Seite ist bei allen
  // Decks 1,79 (aus ihren eigenen Zahlen zurückgerechnet: 1,793 / 1,792 / 1,792), also hat jedes
  // Viertel 1,79, also sind alle Karten gleich groß — ohne dass jemand eine Höhe schätzt.
  //
  // **Quer braucht es keine Zahl.** Gemessen sitzen alle drei abgenommenen Raster mittig auf der
  // Seite (Rand links/rechts 0,050/0,051 · 0,060/0,061 · 0,048/0,049, Abweichung ≤ 0,001) — die
  // Seitenmitte IST die Schnittlinie. Bei `forget_utopia` läuft sie mitten durch die
  // Illustrationsspalte, und genau deshalb las sich deren Zelle als 1,462: die halbe Spalte war ihr
  // abgezogen, obwohl sie zur Karte gehört (mit ihr: 334,9 × 194,7 pt = 1,72, also B).
  //
  // **Hochkant braucht es eine Zahl, und nur für die obere Zeile.** Das Kopfband drückt das Raster
  // nach unten (Rand oben/unten: A 0,037/0,016 · B 0,117/0,060 · C 0,093/0,085). `yShift` schiebt das
  // obere Fenster so weit nach innen, wie es braucht, damit die Karte ganz drin liegt — nicht weiter.
  // Der Überschuss fällt damit an den AUSSEN liegenden Seitenrand, also auf Seite statt auf die
  // Nachbarkarte. Die untere Zeile liegt bei allen vier vermessenen Decks schon in der unteren
  // Seitenhälfte (Unterkanten 0,984 · 0,940 · 0,915 · 0,955), sie bekommt deshalb 0.
  //
  // Rückweg: `modus = 'raster'` (in `card-grids.json` oder per `setCropModus`) rechnet wieder mit dem
  // gemessenen Rahmen aus `legacy` — Zeile für Zeile derselbe Code wie bis S83c.
  function windowOf(rd, packId, qi, pgW, pgH) {
    const col = qi % 2, row = qi >= 2 ? 1 : 0;
    if (modus !== 'raster') {
      const cw = Math.floor(pgW / 2), ch = Math.floor(pgH / 2);
      const dy = row === 0 ? (yShift[packId] || 0) : 0;
      const sy = Math.max(0, Math.min(pgH - ch, Math.round((row * 0.5 + dy) * pgH)));
      return { sx: col * cw, sy, cw, ch, dy };
    }
    const g = rd && rd.cardGrid;
    const G = g ? { x: g.x || 0, y: g.y || 0, w: g.w != null ? g.w : 1, h: g.h != null ? g.h : 1,
                    gapX: g.gapX || 0, gapY: g.gapY || 0 }
                : { x: 0, y: 0, w: 1, h: 1, gapX: 0, gapY: 0 };
    const cw = Math.floor(((G.w - G.gapX) / 2) * pgW);
    const ch = Math.floor(((G.h - G.gapY) / 2) * pgH);
    const sx = Math.round((G.x + col * (((G.w - G.gapX) / 2) + G.gapX)) * pgW);
    const sy = Math.round((G.y + row * (((G.h - G.gapY) / 2) + G.gapY)) * pgH);
    return { sx, sy, cw, ch, dy: 0 };
  }

  async function cropCard(card) {
    const ck = card.packId + '#' + card.n;
    if (artCache.has(ck)) return artCache.get(ck);
    await loadRegistry();
    const rd = pmap[card.packId];
    if (!rd || !rd.pdf) return null;
    const off = rd.coverOffset != null ? rd.coverOffset : 1;
    const pageNum = off + 1 + Math.floor((card.n - 1) / 4);
    const qi = (card.n - 1) % 4;
    const pg = await renderPage(fileUrl(rd.pdf), pageNum, 1500);
    const win = windowOf(rd, card.packId, qi, pg.width, pg.height);
    const cw = win.cw, chh = win.ch, sx = win.sx, sy = win.sy;
    cellAspect = chh / cw;
    // S83 · **Georgs Lösung: nicht enger schneiden als das Blatt — lieber die SEITE weiter zeigen.**
    // Die gemessene Zelle hat pro Deck ein anderes Verhältnis (1,462 · 1,740 · 1,969) als das Sollformat.
    // Bisher wurde der Fehlbetrag ein Band, und jede Füllung dafür war falsch: feste Creme = weißer
    // Streifen, Randfarbe = zu dunkel, Quantil = hellblauer Gutter, Anschnitt = verzerrte Bildzeilen.
    // Jetzt wird der Ausschnitt auf das Sollformat AUFGEZOGEN — in die Illustration der Seite hinein, die
    // dort ohnehin liegt (bei `forget_utopia` 0,135 der Seitenbreite zwischen den Zellen). Nichts wird
    // erfunden, nichts gestreckt, **nichts von der Karte abgeschnitten**: man sieht ein Stück Seite, und
    // das ist die Wahrheit — die Karte wird aus einer Seite geschnitten.
    // Am Seitenrand kann es klemmen: dann verschiebt sich der Ausschnitt (statt zu schrumpfen), und was
    // dann noch fehlt, fängt die Papierfläche im Blatt-Renderer ab.
    let ex = sx, ey = sy, ew = cw, eh = chh;
    if (cw / chh < SHEET_AR) {
      ew = Math.min(pg.width, Math.round(chh * SHEET_AR));
      ex = Math.round(sx - (ew - cw) / 2);
    } else if (cw / chh > SHEET_AR) {
      eh = Math.min(pg.height, Math.round(cw / SHEET_AR));
      ey = Math.round(sy - (eh - chh) / 2);
    }
    const geklemmt = ex < 0 || ey < 0 || ex + ew > pg.width || ey + eh > pg.height;
    ex = Math.max(0, Math.min(pg.width - ew, ex));
    ey = Math.max(0, Math.min(pg.height - eh, ey));
    lastCrop = {
      zelle: { w: cw, h: chh, ar: +(cw / chh).toFixed(3) },
      blatt: { w: ew, h: eh, ar: +(ew / eh).toFixed(3) },
      zugewachsen: { x: ew - cw, y: eh - chh }, geklemmt, soll: SHEET_AR,
      modus, yShift: +(win.dy || 0).toFixed(3), zeile: qi >= 2 ? 'unten' : 'oben',
    };
    const cv = document.createElement('canvas'); cv.width = ew; cv.height = eh;
    cv.getContext('2d').drawImage(pg, ex, ey, ew, eh, 0, 0, ew, eh);
    artCache.set(ck, cv);
    return cv;
  }

  // S90a+ · **Versucht und verworfen: den `yShift` automatisch messen.** Die Idee war naheliegend — die
  // Zahl beschreibt nur, wo zwischen den beiden Kartenzeilen die Lücke liegt, und das müsste als
  // hellster waagerechter Streifen in der Seitenmitte messbar sein. **Ist es nicht.** Gemessen am
  // 28.7. über alle elf Deck-PDFs (Werkzeug-Fassung mit Tabelle, Beleg im Changelog zu S90a):
  // das hellste Band im mittleren Drittel liegt je Deck bei 0,434 · 0,532 · 0,513 · 0,474 … — also
  // nicht an der Zeilengrenze, sondern in weißen Textfeldern INNERHALB der Karten. Und die Tinte im
  // gefundenen Band (20–55) liegt zu nah am Seitenmittel (44–143), um eine Lücke zu sein: die Karten
  // sind randlos gesetzt, das Aquarell läuft über die Grenze. Auf der halben Seitenbreite gemessen war
  // es schlimmer als auf der ganzen.
  //
  // Damit bleibt es bei dem, was die alte Notiz schon sagte (*„automatisch messen scheitert an der
  // handgezeichneten Tuschekante“*): **`yShift` ist eine Zahl, die man am BILD setzt** — mit
  // `tools/travel/cardcrop-check.html`, ein Blick pro Deck. Sie ist billig (eine Zahl, Default 0, ein
  // Fehler kostet nur Seitenrand) und deshalb kein Grund für einen Messapparat, der lügt.

  function pump() {
    if (busy || !queue.length) return;
    if (document.hidden) return;        // pdf.js rendert intern per rAF — im versteckten Tab kommt nichts
    const job = queue.shift();
    busy = true;
    let done = false;
    // WATCHDOG: pdf.js treibt seinen Canvas-Render intern über requestAnimationFrame. Wechselt der
    // Nutzer während eines Renders den Tab, settelt das Promise NIE — ohne diesen Timer bliebe
    // `busy` für die ganze Sitzung hängen und die Artwork-Pipeline wäre tot, ohne eine Zeile im Log.
    const finish = (ok, err) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (!ok) {
        if (job.tries < 2) { job.tries++; queue.push(job); }
        else { if (job.fail) job.fail(err); if (err) console.warn('[card-registry] Artwork fehlgeschlagen', job.card.packId, job.card.n, err); }
      }
      busy = false;
      pump();
    };
    const timer = setTimeout(() => finish(false, null), 20000);
    cropCard(job.card)
      .then((cv) => { if (done) return; if (cv) { done = true; clearTimeout(timer); job.cb(cv, cellAspect); busy = false; pump(); } else finish(false, new Error('kein Artwork im Manifest')); })
      .catch((e) => finish(false, e));
  }

  // Ein Tab-Wechsel darf keinen Slice abschalten: sobald das Bild wieder sichtbar ist, läuft die
  // Warteschlange weiter.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pump(); });

  return {
    name: 'card-registry', loadRegistry, loadDeck, pool: buildPool,
    get decks() { return (registry && registry.decks) || []; },
    get cellAspect() { return cellAspect; },
    get pending() { return queue.length + (busy ? 1 : 0); },
    cropReport() { return lastCrop; },
    // S90a · Rückweg zur Laufzeit. Der Modus sitzt vor dem Crop, also müssen die fertigen Ausschnitte
    // UND die gerenderten Seiten fallen — sonst zeigt der halbe Himmel noch den alten Schnitt.
    setCropModus(m) {
      if (m !== 'viertel' && m !== 'raster') return modus;
      if (m === modus) return modus;
      modus = m; artCache.clear(); pages.clear();
      return modus;
    },
    get cropModus() { return modus; },
    // EIN Render zur Zeit — der Flug darf davon nichts merken. `fail` wird gerufen, wenn der Job
    // endgültig aufgibt: der Aufrufer muss seine Karte wieder freigeben, sonst bleibt sie für die
    // Sitzung als „läuft noch" markiert und bekommt nie Artwork.
    requestArt(card, cb, fail) {
      if (!card || !cb) return;
      const ck = card.packId + '#' + card.n;
      if (artCache.has(ck)) { cb(artCache.get(ck), cellAspect); return; }
      if (queue.some((j) => j.card === card)) return;
      queue.push({ card, cb, fail, tries: 0 });
      pump();
    },
    clearQueue() { queue.length = 0; },
  };
}
