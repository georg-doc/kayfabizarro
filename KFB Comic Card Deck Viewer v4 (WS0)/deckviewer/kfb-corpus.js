// KFB Corpus — Datenschicht fuer den Deck-Viewer.
// Registry, Kartenindex, Kontaktboegen (IndexedDB), PDF-Zugriff.
// Kanon: media/kfb/index.json ist die einzige Quelle fuer Deck-Zahlen.
(function () {
  if (window.KFBCorpus) return;

  var PDFJS_VER = '3.11.174';
  var CDNS = [
    'https://unpkg.com/pdfjs-dist@' + PDFJS_VER + '/build/',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + PDFJS_VER + '/'
  ];
  var REGISTRY_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';
  var SHEET_VERSION = 's2';   // hochzaehlen, sobald sich Bau oder Aufloesung aendert
  var TILE_W = 460;           // gespeicherte Kachelbreite in Pixel
  var SHEET_PARALLEL = 2;

  function emit(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail: detail }));
  }

  // ---- pdf.js laden (Hauptbibliothek und Worker aus derselben Version) ----
  var pdfjsP = null;
  function pdfjs() {
    if (pdfjsP) return pdfjsP;
    pdfjsP = new Promise(function (res, rej) {
      var i = 0;
      (function tryCdn() {
        if (i >= CDNS.length) return rej(new Error('pdf.js not reachable'));
        var base = CDNS[i++];
        var s = document.createElement('script');
        s.src = base + 'pdf.min.js';
        s.onload = function () {
          var L = window.pdfjsLib;
          if (!L) return tryCdn();
          L.GlobalWorkerOptions.workerSrc = base + 'pdf.worker.min.js';
          res(L);
        };
        s.onerror = tryCdn;
        document.head.appendChild(s);
      })();
    });
    return pdfjsP;
  }

  // ---- IndexedDB ----
  var dbP = null;
  function db() {
    if (dbP) return dbP;
    dbP = new Promise(function (res, rej) {
      var rq = indexedDB.open('kfb-deckviewer', 1);
      rq.onupgradeneeded = function () {
        if (!rq.result.objectStoreNames.contains('sheets')) rq.result.createObjectStore('sheets');
      };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error); };
    }).catch(function () { return null; });
    return dbP;
  }
  function idbGet(key) {
    return db().then(function (d) {
      if (!d) return null;
      return new Promise(function (res) {
        var rq = d.transaction('sheets', 'readonly').objectStore('sheets').get(key);
        rq.onsuccess = function () { res(rq.result || null); };
        rq.onerror = function () { res(null); };
      });
    });
  }
  function idbPut(key, val) {
    return db().then(function (d) {
      if (!d) return;
      return new Promise(function (res) {
        var tx = d.transaction('sheets', 'readwrite');
        tx.objectStore('sheets').put(val, key);
        tx.oncomplete = res; tx.onerror = res; tx.onabort = res;
      });
    });
  }

  // ---- Registry ----
  var regP = null;
  function registry() {
    if (regP) return regP;
    regP = fetch(REGISTRY_URL, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('registry HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      var base = String(j.baseUrl || '').replace(/\/$/, '');
      var decks = (j.decks || []).map(function (d) {
        return Object.assign({}, d, {
          pdfUrl: base + '/' + encodeURIComponent(d.pdf),
          dataUrl: base + '/' + encodeURIComponent(d.data)
        });
      });
      return { schema: j.schema, base: base, decks: decks, sets: j.sets || [], rules: j.rules || [], cardMapping: j.cardMapping };
    });
    return regP;
  }

  // ---- Rohtext eines Deck-JSON (fuer den Editor) ----
  // GitHub ist die Wahrheit: hier wird immer frisch geladen, nie aus der Ablage bedient. Ein
  // Entwurf im Browser ist eine Notiz, keine Quelle — wer exportiert, exportiert gegen den
  // Stand im Repo.
  var rawP = {};
  function rawJson(packId, fresh) {
    if (rawP[packId] && !fresh) return rawP[packId];
    rawP[packId] = registry().then(function (reg) {
      var d = reg.decks.find(function (x) { return x.packId === packId; });
      if (!d) throw new Error('unknown deck ' + packId);
      return fetch(d.dataUrl, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('data ' + r.status);
        return r.text();
      }).then(function (text) {
        return { text: text, file: d.data, url: d.dataUrl };
      });
    });
    rawP[packId].catch(function () { delete rawP[packId]; });
    return rawP[packId];
  }

  // ---- Kartenindex je Deck (nur auf Anfrage, ~40 KB pro Deck) ----
  var cardP = {};
  // Wie viele Blaetter liegen VOR der ersten Karte? Die Registry sagt pauschal 1 (bei allen
  // 103 Decks), und sie rechnet `pages = pageCount + 1`. Beides stimmt nicht immer: bei
  // `the_biology_of_rebellion` hat das PDF 9 Seiten, die Registry behauptet 10, und die
  // 36 Karten fuellen alle 9 Seiten — es gibt dort gar kein Deckblatt. Ergebnis war eine um
  // eins verschobene Zuordnung im ganzen Deck.
  //
  // Gemessen statt geglaubt: die echte Seitenzahl kommt aus dem PDF, die noetigen Blaetter aus
  // der Kartenzahl (Kanon: vier je Blatt). Die Differenz IST der Versatz.
  var offP = {};
  function coverOffset(packId) {
    if (offP[packId]) return offP[packId];
    offP[packId] = registry().then(function (reg) {
      var d = reg.decks.find(function (x) { return x.packId === packId; });
      if (!d) throw new Error('unknown deck ' + packId);
      var fallback = d.coverOffset == null ? 1 : d.coverOffset;
      var n = d.cardCount || 0;
      // Nur rechnen, wenn die Kartenzahl sauber aufgeht — sonst der Registry glauben.
      if (!n || n % 4) return { off: fallback, pages: d.pages };
      return pageCount(packId).then(function (real) {
        if (!real) return { off: fallback, pages: d.pages };
        var sheets = n / 4;
        var free = real - sheets;
        // `free` sind die Seiten ohne Karten. Wo sie liegen, verraet das PDF nicht: eine
        // Textebene gibt es nicht (gemessen: 0 Zeichen auf jeder Seite), die Blaetter sind
        // reine Bilder. Also nur der eindeutige Fall wird entschieden:
        //   free = 0 → jede Seite traegt Karten, es gibt kein Deckblatt → Versatz 0.
        //   free >= 1 → ein Deckblatt vorn, alles Weitere hinten → Versatz 1 (wie bisher).
        // Bei free >= 2 kann eine zweite Vorseite (etwa ein Regelblatt) dahinterstecken; das
        // waere dann ein Versatz 2. Ungeprueft wird das nicht angenommen — sonst verschiebt
        // man elf Decks auf Verdacht. Die Liste steht im Session-Cut.
        if (free < 0 || free > 3) return { off: fallback, pages: real };
        return { off: free === 0 ? 0 : 1, pages: real, free: free };
      }, function () { return { off: fallback, pages: d.pages }; });
    });
    return offP[packId];
  }

  function cards(packId) {
    if (cardP[packId]) return cardP[packId];
    cardP[packId] = registry().then(function (reg) {
      var d = reg.decks.find(function (x) { return x.packId === packId; });
      if (!d) throw new Error('unknown deck ' + packId);
      return Promise.all([
        fetch(d.dataUrl).then(function (r) { return r.json(); }),
        coverOffset(packId)
      ]).then(function (both) {
        var j = both[0], fit = both[1];
        var off = fit.off;
        return {
          pages: fit.pages,
          deckTitle: j.deckTitle || '',
          deckType: j.deckType || '',
          blurb: j.blurb || '',
          marketingText: j.marketingText || '',
          marketingEdition: j.marketingEdition || '',
          deckFunction: j.deckFunction || [],
          exhibitionRole: j.exhibitionRole || '',
          cards: (j.cards || []).map(function (c) {
            var n = c.cardNumber;
            return {
              n: n,
              name: c.cardName || '',
              // Kanon §8: Seite = coverOffset + 1 + floor((n-1)/4), Quadrant = (n-1)%4.
              // `off` ist hier der GEMESSENE Versatz, nicht der pauschale aus der Registry.
              page: off + 1 + Math.floor((n - 1) / 4),
              quadrant: (n - 1) % 4
            };
          })
        };
      });
    });
    return cardP[packId];
  }

  // Alle Decks, gedeckelte Parallelitaet.
  function allCards(onEach) {
    return registry().then(function (reg) {
      var ids = reg.decks.map(function (d) { return d.packId; });
      var out = {};
      var i = 0;
      function next() {
        if (i >= ids.length) return Promise.resolve();
        var id = ids[i++];
        return cards(id).then(function (c) {
          out[id] = c;
          if (onEach) onEach(id, c);
        }).catch(function () { out[id] = null; }).then(next);
      }
      return Promise.all([next(), next(), next()]).then(function () { return out; });
    });
  }

  // ---- PDF-Dokumente, kleiner LRU ----
  // Ein Dokument, an dem gerade gerendert wird, darf NICHT weggeworfen werden — genau daran
  // sind in v1 Kontaktboegen mitten im Bau gestorben (Deck verschwindet und kommt spaeter wieder).
  var docs = new Map();
  var inUse = new Map();
  function hold(packId) { inUse.set(packId, (inUse.get(packId) || 0) + 1); }
  function release(packId) {
    var n = (inUse.get(packId) || 1) - 1;
    if (n <= 0) inUse.delete(packId); else inUse.set(packId, n);
  }
  function doc(packId) {
    if (docs.has(packId)) return docs.get(packId);
    var p = Promise.all([pdfjs(), registry()]).then(function (a) {
      var L = a[0], reg = a[1];
      var d = reg.decks.find(function (x) { return x.packId === packId; });
      return L.getDocument({
        url: d.pdfUrl,
        disableAutoFetch: true,   // Range-Requests, nicht die ganze Datei
        disableStream: false,
        rangeChunkSize: 262144
      }).promise;
    });
    docs.set(packId, p);
    if (docs.size > 3) {
      var victim = null;
      docs.forEach(function (v, k) { if (victim === null && k !== packId && !inUse.has(k)) victim = k; });
      if (victim !== null) {
        var op = docs.get(victim);
        docs.delete(victim);
        op.then(function (d) { try { d.destroy(); } catch (e) {} }).catch(function () {});
      }
    }
    return p;
  }

  // ---- Kontaktbogen: alle Seiten eines Decks als ein Bild, waagerechter Streifen ----
  var sheetP = {};
  var queue = [];
  var running = 0;

  function pump() {
    while (running < SHEET_PARALLEL && queue.length) {
      var job = queue.shift();
      running++;
      job().then(function () { running--; pump(); }, function () { running--; pump(); });
    }
  }

  function buildSheet(packId, key) {
    hold(packId);
    return doc(packId).then(function (d) {
      var n = d.numPages;
      return d.getPage(1).then(function (p1) {
        var vp0 = p1.getViewport({ scale: 1 });
        var ar = vp0.width / vp0.height;
        var tileH = Math.round(TILE_W / ar);
        var c = document.createElement('canvas');
        c.width = TILE_W * n; c.height = tileH;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
        var i = 0;
        function step() {
          if (i >= n) return Promise.resolve();
          var pageNo = ++i;
          return d.getPage(pageNo).then(function (pg) {
            var vp = pg.getViewport({ scale: TILE_W / pg.getViewport({ scale: 1 }).width });
            var t = document.createElement('canvas');
            t.width = Math.round(vp.width); t.height = Math.round(vp.height);
            return pg.render({ canvasContext: t.getContext('2d'), viewport: vp }).promise.then(function () {
              ctx.drawImage(t, (pageNo - 1) * TILE_W, 0, TILE_W, tileH);
              try { pg.cleanup(); } catch (e) {}
              emit('kfb-sheet', { packId: packId, done: pageNo, total: n });
              return step();
            });
          });
        }
        return step().then(function () {
          return new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.82); });
        }).then(function (blob) {
          var rec = { blob: blob, count: n, tileW: TILE_W, tileH: tileH, at: Date.now() };
          idbPut(key, rec);
          return rec;
        });
      });
    }).then(function (rec) { release(packId); return rec; }, function (err) { release(packId); throw err; });
  }

  function sheet(packId) {
    if (sheetP[packId]) return sheetP[packId];
    var key = packId + '|' + TILE_W + '|' + SHEET_VERSION;
    sheetP[packId] = idbGet(key).then(function (rec) {
      if (rec && rec.blob) return rec;
      emit('kfb-sheet', { packId: packId, done: 0, total: 0 });
      return new Promise(function (res, rej) {
        queue.push(function () { return buildSheet(packId, key).then(res, rej); });
        pump();
      });
    }).then(function (rec) {
      return {
        url: URL.createObjectURL(rec.blob),
        count: rec.count, tileW: rec.tileW, tileH: rec.tileH,
        ar: rec.tileW / rec.tileH
      };
    });
    // Ein fehlgeschlagener Bau darf sich nicht als abgelehntes Versprechen festsetzen —
    // sonst bleibt das Deck fuer immer leer.
    sheetP[packId].catch(function () { delete sheetP[packId]; });
    return sheetP[packId];
  }

  // Zieht einen Kontaktbogen vor, ohne dass jemand darauf wartet.
  function prefetch(packId) { sheet(packId).catch(function () {}); }

  // ---- Eine Seite in voller Quellaufloesung (es gibt keinen Vektorinhalt, mehr geht nicht) ----
  function renderPage(packId, pageNo, maxW) {
    return doc(packId).then(function (d) {
      if (pageNo < 1 || pageNo > d.numPages) return null;
      return d.getPage(pageNo).then(function (pg) {
        var vp1 = pg.getViewport({ scale: 1 });
        // Quelle sind ~1553 px breite JPEGs bei 745 pt Seitenbreite, also rund 2,08.
        var native = vp1.width * 2.08;
        var w = Math.min(native, maxW || native);
        var vp = pg.getViewport({ scale: w / vp1.width });
        var c = document.createElement('canvas');
        c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
          try { pg.cleanup(); } catch (e) {}
          return c;
        });
      });
    });
  }

  function pageCount(packId) {
    return doc(packId).then(function (d) { return d.numPages; });
  }

  // ---- Eine Seite als Bild, mit Ablage. Zwei Groessen-Eimer: Leiste und Spalte. ----
  // Nach einem Durchgang liegt das Deck vollstaendig in IndexedDB — danach braucht es kein Netz.
  var imgP = {};
  var imgOrder = [];
  var iq = [];
  var irun = 0;

  function ipump() {
    while (irun < 2 && iq.length) {
      var job = iq.shift();
      irun++;
      job.run().then(function () { irun--; ipump(); }, function () { irun--; ipump(); });
    }
  }

  // Die Warteschlange war reines FIFO. Ein `prefetchDeck` ueber 56 Seiten legte sich damit
  // vor jedes Deck, das danach geoeffnet wurde — die ersten Blaetter blieben leer, bis das
  // alte Deck fertig war. `focus` zieht die Auftraege des laufenden Decks nach vorn; nichts
  // wird verworfen, sonst haengt ein Versprechen fuer immer.
  function focus(packId) {
    if (iq.length < 2) return 0;
    var mine = [], rest = [];
    for (var i = 0; i < iq.length; i++) (iq[i].pack === packId ? mine : rest).push(iq[i]);
    iq = mine.concat(rest);
    return mine.length;
  }

  function makeImage(packId, pageNo, w) {
    hold(packId);
    return renderPage(packId, pageNo, w).then(function (c) {
      release(packId);
      if (!c) return null;
      return new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.86); }).then(function (blob) {
        c.width = c.height = 0;
        return blob;
      });
    }, function (err) { release(packId); throw err; });
  }

  function pageImage(packId, pageNo, w) {
    var mem = packId + ':' + pageNo + ':' + w;
    if (imgP[mem]) return imgP[mem];
    var key = 'img|' + packId + '|' + pageNo + '|' + w + '|' + SHEET_VERSION;
    imgP[mem] = idbGet(key).then(function (rec) {
      if (rec && rec.blob) return rec.blob;
      return new Promise(function (res, rej) {
        iq.push({
          pack: packId, page: pageNo,
          run: function () {
            return makeImage(packId, pageNo, w).then(function (blob) {
              if (blob) idbPut(key, { blob: blob, at: Date.now() });
              res(blob);
            }, rej);
          }
        });
        ipump();
      });
    }).then(function (blob) {
      if (!blob) return null;
      var url = URL.createObjectURL(blob);
      imgOrder.push({ mem: mem, url: url });
      // Deckel gegen Speicherwuchs. Er war bei 40 — zu knapp: ein Deck mit 56 Blaettern plus
      // Leisten-Miniaturen verwarf damit die URLs, die gerade gebraucht wurden.
      while (imgOrder.length > 220) {
        var old = imgOrder.shift();
        URL.revokeObjectURL(old.url);
        delete imgP[old.mem];
      }
      return url;
    });
    imgP[mem].catch(function () { delete imgP[mem]; });
    return imgP[mem];
  }

  // Nur ein Fenster vorwaermen: bei 76 Decks kostet ein ganzes Deck im Voraus mehr, als es
  // bringt — der Rest kommt beim Scrollen nach.
  function prefetchDeck(packId, w, total, upTo) {
    var n = Math.min(total, upTo || total);
    for (var i = 1; i <= n; i++) pageImage(packId, i, w).catch(function () {});
    focus(packId);
  }

  window.KFBCorpus = {
    registry: registry,
    cards: cards,
    coverOffset: coverOffset,
    allCards: allCards,
    sheet: sheet,
    prefetch: prefetch,
    pageImage: pageImage,
    rawJson: rawJson,
    prefetchDeck: prefetchDeck,
    focus: focus,
    renderPage: renderPage,
    pageCount: pageCount,
    TILE_W: TILE_W
  };
})();
