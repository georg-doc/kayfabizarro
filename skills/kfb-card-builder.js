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

export function createCardBuilder(opts = {}) {
  const THREE = opts.THREE;
  if (!THREE) throw new Error('[card-builder] THREE fehlt — createCardBuilder({ THREE })');

  const P = Object.assign({
    preset: 'card',        // Tusche-Preset aus kfb-ink-canon.js
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
    localIndex: null,      // optionale URL eines lokalen Fallback-Manifests
    decalLift: 0.02,       // Weltabstand des Decal-Quads bei Breite 11 — skaliert mit
    // S62 · **`fit` ist der Kanon**: die gemessene Zelle liegt mittig im Sollformat, der Fehlbetrag
    // wird cremefarbener Rand innerhalb der Tuschekante. `cover` bleibt für Sonderfälle, ist aber
    // NICHT mehr Default — es schnitt bei `forget_utopia` 18 % der Zellhöhe weg, genau dort stehen
    // Titel und LORE-Zeile. Ein Format, das den Inhalt kostet, ist kein Format.
    artFit: 'fit',         // 'fit' = Zelle mittig ins Sollformat · 'cover' = füllt, schneidet
    doubleSide: true,
  }, opts.params || {});

  // ---------------------------------------------------------------- Registry & PDF
  let registry = null, pmap = null, pool = null, pdfjs = null, cellAspect = null, lastFit = null;
  const deckCache = new Map(), docs = new Map(), pages = new Map(), artCache = new Map();
  let busy = false; const queue = [];

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
    deckCache.set(packId, cards);
    return cards;
  }

  async function buildPool(o = {}) {
    if (pool && !o.force) return pool;
    await loadRegistry();
    const want = (registry.decks || []).filter((d) => (!o.gameMode || d.gameMode === o.gameMode)
                                                   && (!o.packId || d.packId === o.packId));
    const all = [];
    for (const d of want) for (const c of await loadDeck(d.packId)) all.push(c);
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
  function gridOf(rd) {
    const g = (rd && rd.cardGrid) || P.cardGrid;
    return g ? { x: g.x || 0, y: g.y || 0, w: g.w != null ? g.w : 1, h: g.h != null ? g.h : 1,
                 gapX: g.gapX || 0, gapY: g.gapY || 0 }
             : { x: 0, y: 0, w: 1, h: 1, gapX: 0, gapY: 0 };
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
    const pg = await renderPage(fileUrl(rd.pdf), pageNum, P.pdfRes);
    const G = gridOf(rd);
    const gx = pg.width * G.x, gy = pg.height * G.y;
    const cw = Math.floor(pg.width * (G.w - G.gapX) / P.gridCols);
    const chh = Math.floor(pg.height * (G.h - G.gapY) / P.gridRows);
    cellAspect = cw / chh;
    const sx = gx + (qi % P.gridCols) * (cw + pg.width * G.gapX);
    const sy = gy + Math.floor(qi / P.gridCols) * (chh + pg.height * G.gapY);
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = chh;
    cv.getContext('2d').drawImage(pg, sx, sy, cw, chh, 0, 0, cw, chh);
    artCache.set(ck, cv);
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
  function sheetTexture(card, seed) {
    const W = P.sheetRes, H = Math.round(W / P.aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.save(); pathOf(g, contour(P.preset, seed, W, H)); g.clip();
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    // Papierton: ein sehr blasser Verlauf, damit die Fläche nicht wie Karton wirkt.
    const grd = g.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, 'rgba(255,255,255,.5)'); grd.addColorStop(1, 'rgba(31,26,20,.06)');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.fillStyle = INK_COLOR; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    let fs = Math.round(H * 0.155);
    const title = String(card.title || '').toUpperCase();
    for (let i = 0; i < 14; i++) { g.font = '700 ' + fs + 'px "Irish Grover", Georgia, serif'; if (g.measureText(title).width <= W * 0.84) break; fs = Math.round(fs * 0.92); }
    g.fillText(title, W / 2, H * 0.42);
    g.font = Math.round(H * 0.062) + 'px "Special Elite", monospace';
    g.globalAlpha = 0.72;
    g.fillText(String(card.deck || 'KFB').toUpperCase(), W / 2, H * 0.56);
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
    g.save(); pathOf(g, contour(P.preset, seed, W, H)); g.clip();
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    if (P.artFit === 'cover') {
      const s = Math.max(W / crop.width, H / crop.height);
      const dw = crop.width * s, dh = crop.height * s;
      g.drawImage(crop, (W - dw) / 2, (H - dh) / 2, dw, dh);
      lastFit = null;
    } else {
      const f = fitCell(crop.width, crop.height, W, H);
      g.drawImage(crop, f.x, f.y, f.w, f.h);
      lastFit = f;
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

    const sheetTex = sheetTexture(card || {}, seed);
    const mat = new THREE.MeshBasicMaterial({
      map: sheetTex, alphaMap: maskTexture(seed), alphaTest: 0.5,
      side: P.doubleSide ? THREE.DoubleSide : THREE.FrontSide, toneMapped: false,
    });
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), mat);
    sheet.frustumCulled = false;
    group.add(sheet);

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
    get decks() { return (registry && registry.decks) || []; },
    get cellAspect() { return cellAspect; },
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
