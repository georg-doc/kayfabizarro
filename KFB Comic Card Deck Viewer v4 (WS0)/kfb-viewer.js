/*!
 * KayfabizarroViewer — self-contained deck viewer module (v1)
 * Turns a landscape KayfaBizarro deck PDF (2×2 card grid per page) into an
 * immersive, keyboard/touch navigable card presentation.
 *
 * - Single file, vanilla JS, no build step. Shadow-DOM scoped (no style bleed).
 * - Rendering: CSS + Canvas only (pdf.js). No WebGL.
 * - Layout is DERIVED arithmetically from deck JSON (cardCount/pageCount/coverScore),
 *   self-validating; mismatching decks fall back to page mode ("needs-review").
 * - API: KayfabizarroViewer.mount(el, opts) -> viewer instance. See handover §4.
 */
(function () {
  'use strict';

  var PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var pdfjsPromise = null;

  function loadPdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = (window.pdfjsLib ? Promise.resolve() : new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = PDFJS_CDN;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('pdf.js failed to load')); };
        document.head.appendChild(s);
      })).then(function () {
        // Load the worker as a same-origin blob: a cross-origin workerSrc makes
        // pdf.js fall back to its main-thread "fake worker", which is drastically
        // slower on heavy collage pages and janks the UI.
        return fetch(PDFJS_WORKER).then(function (r) {
          if (!r.ok) throw new Error('worker HTTP ' + r.status);
          return r.text();
        }).then(function (src) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        }).catch(function () {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; // fallback
        }).then(function () { return window.pdfjsLib; });
      });
    }
    return pdfjsPromise;
  }

  /* ------------------------------------------------------------------ i18n */
  var STRINGS = {
    en: {
      loading: 'Loading deck', preparing: 'Preparing pages', page: 'Page', card: 'Card',
      cover: 'Cover', of: 'of', modeToggle: 'Mode: pages / cards (M)', theme: 'Theme (T)',
      fullscreen: 'Fullscreen (F)', info: 'Card info (I)', settings: 'Settings',
      gutterTitle: 'Grid & cut', marginX: 'Margin X', marginY: 'Margin Y',
      gapX: 'Gap X', gapY: 'Gap Y', offsetX: 'Shift X', offsetY: 'Shift Y', readingOrder: 'Reading order',
      rowMajor: 'Rows', colMajor: 'Columns', firstPageCover: 'First page is cover',
      forceGrid: 'Cut 2×2 anyway', needsReview: 'Layout mismatch — showing full pages.',
      needsReviewBadge: 'needs review', suggestion: 'Numbers reconcile if page 1 counts as cards, not cover.',
      apply: 'Apply', dismiss: 'Dismiss', noData: 'No deck data — 2×2 convention assumed.',
      pdfMismatch: 'PDF has {a} pages, deck data expects {b}.',
      zoomIn: 'Zoom in (+)', zoomOut: 'Zoom out (−)', close: 'Close (Esc)',
      language: 'Language', prev: 'Previous (←)', next: 'Next (→)',
      errLoad: 'Could not load this PDF.', errHint: 'If the link blocks cross-origin access (e.g. Dropbox), download the file and upload it here instead.',
      power: 'Power', lore: 'Lore', grade: 'G', reset: 'Reset', gradeWord: 'Grade',
      gradeReason: 'Grade rationale', artPrompt: 'Art prompt',
      cutPreview: 'Cut preview — drag the sliders, lines update live.',
      pageMode: 'Pages', cardMode: 'Cards'
    },
    de: {
      loading: 'Deck wird geladen', preparing: 'Seiten werden vorbereitet', page: 'Seite', card: 'Karte',
      cover: 'Cover', of: 'von', modeToggle: 'Modus: Seiten / Karten (M)', theme: 'Theme (T)',
      fullscreen: 'Vollbild (F)', info: 'Karten-Info (I)', settings: 'Einstellungen',
      gutterTitle: 'Raster & Schnitt', marginX: 'Rand X', marginY: 'Rand Y',
      gapX: 'Steg X', gapY: 'Steg Y', offsetX: 'Versatz X', offsetY: 'Versatz Y', readingOrder: 'Leserichtung',
      rowMajor: 'Zeilen', colMajor: 'Spalten', firstPageCover: 'Erste Seite ist Cover',
      forceGrid: 'Trotzdem 2×2 schneiden', needsReview: 'Layout-Abweichung — ganze Seiten werden gezeigt.',
      needsReviewBadge: 'needs review', suggestion: 'Die Zahlen gehen auf, wenn Seite 1 als Karten zählt, nicht als Cover.',
      apply: 'Übernehmen', dismiss: 'Ausblenden', noData: 'Keine Deck-Daten — 2×2-Konvention angenommen.',
      pdfMismatch: 'PDF hat {a} Seiten, Deck-Daten erwarten {b}.',
      zoomIn: 'Vergrößern (+)', zoomOut: 'Verkleinern (−)', close: 'Schließen (Esc)',
      language: 'Sprache', prev: 'Zurück (←)', next: 'Weiter (→)',
      errLoad: 'Dieses PDF konnte nicht geladen werden.', errHint: 'Wenn der Link Cross-Origin blockiert (z. B. Dropbox): Datei herunterladen und hier hochladen.',
      power: 'Power', lore: 'Lore', grade: 'G', reset: 'Zurücksetzen', gradeWord: 'Grade',
      gradeReason: 'Grade-Begründung', artPrompt: 'Art-Prompt',
      cutPreview: 'Schnitt-Vorschau — Regler ziehen, Linien folgen live.',
      pageMode: 'Seiten', cardMode: 'Karten'
    }
  };

  /* ------------------------------------------------------------- utilities */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(s, map) {
    return s.replace(/\{(\w+)\}/g, function (_, k) { return map[k] != null ? map[k] : ''; });
  }

  function makeGrainDataUrl() {
    try {
      var c = document.createElement('canvas'); c.width = 96; c.height = 96;
      var ctx = c.getContext('2d');
      var img = ctx.createImageData(96, 96);
      for (var i = 0; i < img.data.length; i += 4) {
        var v = 118 + Math.floor(Math.random() * 20);
        img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v;
        img.data[i + 3] = Math.random() < 0.5 ? 10 : 22;
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL('image/png');
    } catch (e) { return ''; }
  }
  var GRAIN = null;

  function cellRect(grid, row, col) {
    var mx = grid.margin.x, my = grid.margin.y, gx = grid.gap.x, gy = grid.gap.y;
    var ox = (grid.offset && grid.offset.x) || 0, oy = (grid.offset && grid.offset.y) || 0;
    var w = (1 - 2 * mx - (grid.cols - 1) * gx) / grid.cols;
    var h = (1 - 2 * my - (grid.rows - 1) * gy) / grid.rows;
    return { x: mx + ox + col * (w + gx), y: my + oy + row * (h + gy), w: w, h: h };
  }
  function cellForIndex(grid, idx, order) {
    if (order === 'col') return { row: idx % grid.rows, col: Math.floor(idx / grid.rows) };
    return { row: Math.floor(idx / grid.cols), col: idx % grid.cols };
  }

  /* ------------------------------------------------------------------- CSS */
  var CSS = [
    ':host, .kv-root { all: initial; }',
    '.kv-root{display:block;position:relative;width:100%;height:100%;overflow:hidden;outline:none;',
    ' font-family:"Archivo","Helvetica Neue",Helvetica,system-ui,sans-serif;',
    ' -webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none;',
    ' --ease:cubic-bezier(.22,.9,.24,1);}',
    /* themes */
    '.kv-root.t-paper{--bg:#F4EFE6;--bg2:#EDE6D8;--ink:#26221C;--muted:#7B7368;--chrome-bg:rgba(250,247,240,.82);',
    ' --chrome-line:rgba(38,34,28,.14);--card-shadow:0 22px 48px -18px rgba(56,44,26,.42),0 6px 16px -8px rgba(56,44,26,.28);',
    ' --panel-bg:rgba(252,250,245,.96);--accent:#A6512E;--grain-opacity:1;}',
    '.kv-root.t-dark{--bg:#0E0E10;--bg2:#141417;--ink:#E8E6E1;--muted:#8E8B85;--chrome-bg:rgba(24,24,27,.82);',
    ' --chrome-line:rgba(232,230,225,.16);--card-shadow:0 26px 54px -20px rgba(0,0,0,.85),0 8px 18px -8px rgba(0,0,0,.6);',
    ' --panel-bg:rgba(28,28,32,.96);--accent:#D08A5F;--grain-opacity:0;}',
    '.kv-root.t-light{--bg:#FAFAF8;--bg2:#F0F0EC;--ink:#2A2A28;--muted:#87857E;--chrome-bg:rgba(255,255,255,.85);',
    ' --chrome-line:rgba(42,42,40,.12);--card-shadow:0 14px 30px -14px rgba(30,30,28,.3),0 4px 10px -6px rgba(30,30,28,.18);',
    ' --panel-bg:rgba(255,255,255,.97);--accent:#9C5230;--grain-opacity:0;}',
    '.kv-root{background:radial-gradient(120% 90% at 50% 8%,var(--bg) 55%,var(--bg2) 100%);color:var(--ink);}',
    '.kv-grain{position:absolute;inset:0;pointer-events:none;opacity:calc(.5 * var(--grain-opacity));z-index:1;}',
    /* stage */
    '.kv-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;',
    ' touch-action:none;padding:56px 64px 76px;box-sizing:border-box;perspective:1400px;}',
    '@media (max-width:720px){.kv-stage{padding:44px 10px 84px;}}',
    '.kv-layer{position:absolute;display:flex;align-items:center;justify-content:center;will-change:transform,opacity;}',
    '.kv-layer.enter{opacity:0;}',
    '.kv-cardbox{position:relative;overflow:hidden;background:#fff;box-shadow:var(--card-shadow);',
    ' border-radius:6px;transform-style:preserve-3d;}',
    '.kv-cardbox canvas{position:absolute;display:block;image-rendering:auto;}',
    '.kv-anim .kv-layer{transition:opacity .38s var(--ease),transform .38s var(--ease);}',
    /* chrome shared */
    '.kv-chrome{position:absolute;inset:0;z-index:5;pointer-events:none;transition:opacity .35s ease;}',
    '.kv-root.idle .kv-chrome,.kv-root.idle .kv-caption{opacity:0;pointer-events:none;}',
    '.kv-root.idle{cursor:none;}',
    '.kv-bar{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:6px;',
    ' padding:12px 14px;pointer-events:none;}',
    '.kv-title{position:absolute;left:50%;top:14px;transform:translateX(-50%);max-width:44%;',
    ' white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;font-weight:600;',
    ' letter-spacing:.14em;text-transform:uppercase;color:var(--muted);pointer-events:none;}',
    '@media (max-width:720px){.kv-title{display:none;}}',
    '.kv-btns{margin-left:auto;display:flex;gap:6px;pointer-events:auto;}',
    '.kv-btn{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;',
    ' border:1px solid var(--chrome-line);background:var(--chrome-bg);color:var(--ink);border-radius:999px;',
    ' cursor:pointer;font:inherit;font-size:13px;padding:0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
    ' transition:transform .15s ease,background .15s ease;}',
    '.kv-btn:hover{transform:translateY(-1px);}',
    '.kv-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}',
    '.kv-btn.on{border-color:var(--accent);color:var(--accent);}',
    '.kv-btn svg{display:block;}',
    '.kv-btn.txt{width:auto;padding:0 11px;font-size:11px;font-weight:700;letter-spacing:.08em;}',
    /* nav arrows */
    '.kv-arrow{position:absolute;top:0;bottom:0;width:88px;display:flex;align-items:center;',
    ' pointer-events:auto;cursor:pointer;border:0;background:transparent;color:var(--ink);opacity:0;',
    ' transition:opacity .25s ease;padding:0;}',
    '.kv-arrow.l{left:0;justify-content:flex-start;padding-left:14px;}',
    '.kv-arrow.r{right:0;justify-content:flex-end;padding-right:14px;}',
    '.kv-arrow span{width:40px;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;',
    ' background:var(--chrome-bg);border:1px solid var(--chrome-line);backdrop-filter:blur(6px);}',
    '.kv-root:not(.idle) .kv-arrow{opacity:.9;}',
    '.kv-arrow:focus-visible span{outline:2px solid var(--accent);outline-offset:2px;}',
    '@media (pointer:coarse){.kv-arrow{display:none;}}',
    /* footer */
    '.kv-foot{position:absolute;left:0;right:0;bottom:0;padding:10px 16px 12px;display:flex;',
    ' align-items:flex-end;justify-content:space-between;pointer-events:none;}',
    '.kv-counter{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--muted);',
    ' letter-spacing:.06em;background:var(--chrome-bg);border:1px solid var(--chrome-line);border-radius:999px;',
    ' padding:5px 10px;backdrop-filter:blur(6px);}',
    '.kv-progress{position:absolute;left:0;right:0;bottom:0;height:2px;background:transparent;}',
    '.kv-progress i{display:block;height:100%;background:var(--accent);width:0;transition:width .3s var(--ease);}',
    /* caption / card info */
    '.kv-caption{position:absolute;left:50%;bottom:38px;transform:translateX(-50%);z-index:6;max-width:min(620px,88vw);',
    ' pointer-events:auto;transition:opacity .35s ease;display:flex;flex-direction:column;align-items:center;gap:8px;}',
    '.kv-cap-pill{display:inline-flex;align-items:center;gap:9px;background:var(--chrome-bg);',
    ' border:1px solid var(--chrome-line);border-radius:999px;padding:7px 14px;cursor:pointer;',
    ' backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);max-width:100%;}',
    '.kv-cap-pill:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}',
    '.kv-cap-name{font-size:13px;font-weight:600;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.kv-cap-grade{flex:none;font-family:ui-monospace,Menlo,monospace;font-size:10px;font-weight:700;',
    ' color:var(--accent);border:1px solid currentColor;border-radius:4px;padding:1.5px 5px;letter-spacing:.05em;}',
    '.kv-cap-chev{flex:none;color:var(--muted);transition:transform .25s ease;display:flex;}',
    '.kv-caption.open .kv-cap-chev{transform:rotate(180deg);}',
    '.kv-cap-detail{display:none;background:var(--panel-bg);border:1px solid var(--chrome-line);border-radius:12px;',
    ' padding:14px 16px;box-shadow:0 18px 40px -18px rgba(0,0,0,.35);width:min(560px,86vw);box-sizing:border-box;',
    ' max-height:min(42vh,340px);overflow:auto;overscroll-behavior:contain;}',
    '.kv-caption.open .kv-cap-detail{display:block;}',
    '.kv-cap-detail h4{margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);}',
    '.kv-cap-detail p{margin:0 0 10px;font-size:13.5px;line-height:1.5;color:var(--ink);}',
    '.kv-cap-detail p:last-child{margin-bottom:0;}',
    '.kv-cap-detail p.mono{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--muted);}',
    '.kv-cap-detail .kv-more{border-top:1px solid var(--chrome-line);margin-top:12px;padding-top:10px;}',
    /* banner */
    '.kv-banner{position:absolute;top:56px;left:50%;transform:translateX(-50%);z-index:7;max-width:min(560px,90vw);',
    ' background:var(--panel-bg);border:1px solid var(--chrome-line);border-left:3px solid var(--accent);',
    ' border-radius:10px;padding:11px 14px;font-size:12.5px;line-height:1.45;box-shadow:0 14px 34px -16px rgba(0,0,0,.3);',
    ' pointer-events:auto;display:flex;flex-direction:column;gap:8px;}',
    '.kv-banner .row{display:flex;gap:8px;flex-wrap:wrap;}',
    '.kv-banner button{font:inherit;font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:999px;',
    ' border:1px solid var(--chrome-line);background:transparent;color:var(--ink);cursor:pointer;}',
    '.kv-banner button.pri{background:var(--accent);border-color:var(--accent);color:#FCFAF5;}',
    '.kv-badge{display:inline-block;font-family:ui-monospace,Menlo,monospace;font-size:9.5px;font-weight:700;',
    ' letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border:1px solid currentColor;',
    ' border-radius:4px;padding:1px 6px;vertical-align:1px;}',
    /* panel */
    '.kv-panel{position:absolute;top:56px;right:14px;z-index:8;width:min(300px,calc(100vw - 28px));',
    ' background:var(--panel-bg);border:1px solid var(--chrome-line);border-radius:14px;padding:16px;',
    ' box-shadow:0 22px 48px -18px rgba(0,0,0,.35);pointer-events:auto;box-sizing:border-box;',
    ' max-height:calc(100% - 120px);overflow:auto;}',
    '.kv-panel h3{margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);}',
    '.kv-panel .sec{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--chrome-line);}',
    '.kv-panel .sec:last-child{margin-bottom:0;padding-bottom:0;border-bottom:0;}',
    '.kv-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;}',
    '.kv-row:last-child{margin-bottom:0;}',
    '.kv-row label{font-size:12.5px;color:var(--ink);}',
    '.kv-row .hint{font-size:11px;color:var(--muted);line-height:1.4;}',
    '.kv-slider{display:flex;align-items:center;gap:9px;}',
    '.kv-slider input[type=range]{flex:1;accent-color:var(--accent);height:20px;margin:0;}',
    '.kv-slider output{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--muted);width:38px;text-align:right;}',
    '.kv-seg{display:inline-flex;border:1px solid var(--chrome-line);border-radius:999px;overflow:hidden;}',
    '.kv-seg button{font:inherit;font-size:11px;font-weight:600;padding:5px 11px;border:0;background:transparent;',
    ' color:var(--muted);cursor:pointer;}',
    '.kv-seg button.on{background:var(--accent);color:#FCFAF5;}',
    '.kv-switch{position:relative;width:36px;height:20px;flex:none;border-radius:999px;border:1px solid var(--chrome-line);',
    ' background:var(--bg2);cursor:pointer;transition:background .2s ease;padding:0;}',
    '.kv-switch i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:999px;background:var(--muted);',
    ' transition:transform .2s ease,background .2s ease;}',
    '.kv-switch.on{background:var(--accent);border-color:var(--accent);}',
    '.kv-switch.on i{transform:translateX(16px);background:#FCFAF5;}',
    '.kv-panel .note{font-size:11px;color:var(--muted);line-height:1.45;margin:6px 0 0;}',
    '.kv-panel .linkbtn{font:inherit;font-size:11.5px;color:var(--accent);background:none;border:0;padding:0;',
    ' cursor:pointer;text-decoration:underline;}',
    /* cut preview overlay */
    '.kv-cutlines{position:absolute;inset:0;pointer-events:none;}',
    '.kv-cutlines .cell{position:absolute;border:1.5px dashed var(--accent);border-radius:2px;',
    ' box-shadow:0 0 0 1px rgba(255,255,255,.35);}',
    '.kv-cutnote{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;color:var(--ink);background:var(--chrome-bg);border:1px solid var(--chrome-line);border-radius:999px;padding:4px 10px;backdrop-filter:blur(6px);}',
    /* loading & error */
    '.kv-load{position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;align-items:center;',
    ' justify-content:center;gap:16px;background:radial-gradient(120% 90% at 50% 8%,var(--bg) 55%,var(--bg2) 100%);',
    ' transition:opacity .4s ease;}',
    '.kv-load.hide{opacity:0;pointer-events:none;}',
    '.kv-load .word{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);}',
    '.kv-load .track{width:180px;height:2px;background:var(--chrome-line);border-radius:2px;overflow:hidden;}',
    '.kv-load .track i{display:block;height:100%;width:0;background:var(--accent);transition:width .25s ease;}',
    '.kv-load .err{max-width:340px;text-align:center;font-size:13px;line-height:1.55;color:var(--ink);padding:0 20px;}',
    '.kv-load .err small{display:block;margin-top:8px;color:var(--muted);font-size:11.5px;}',
    '@media (prefers-reduced-motion:reduce){.kv-anim .kv-layer{transition:none;}',
    ' .kv-btn,.kv-cap-chev,.kv-switch i{transition:none;}}'
  ].join('\n');

  /* --------------------------------------------------------------- icons */
  var IC = {
    chevL: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 3 5 8 10 13"/></svg>',
    chevR: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 3 11 8 6 13"/></svg>',
    chevD: '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 10 8 5 13 10"/></svg>',
    grid: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/><rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/></svg>',
    pageIc: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2" width="11" height="12" rx="1"/></svg>',
    sun: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="3.4"/><path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" stroke-linecap="round"/></svg>',
    infoIc: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="6.2" stroke-width="1.3"/><path d="M8 7.2v3.6"/><circle cx="8" cy="4.8" r="0.4" fill="currentColor"/></svg>',
    gear: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.6v2M8 12.4v2M1.6 8h2M12.4 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4" stroke-linecap="round"/></svg>',
    full: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>',
    minus: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 8h10"/></svg>',
    x: '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>'
  };

  /* ================================================================ Viewer */
  function Viewer(target, opts) {
    var self = this;
    opts = opts || {};
    this.opts = opts;
    this.target = target;
    this.lang = opts.lang === 'de' ? 'de' : 'en';
    this.mode = opts.mode === 'page' ? 'page' : 'card';
    this.theme = /^(paper|dark|light)$/.test(opts.theme) ? opts.theme : 'paper';
    this.grid = {
      rows: (opts.grid && opts.grid.rows) || 2,
      cols: (opts.grid && opts.grid.cols) || 2,
      margin: { x: 0, y: 0 }, gap: { x: 0, y: 0 }, offset: { x: 0, y: 0 }
    };
    if (opts.grid && opts.grid.offset) { this.grid.offset.x = opts.grid.offset.x || 0; this.grid.offset.y = opts.grid.offset.y || 0; }
    if (opts.grid && opts.grid.margin) { this.grid.margin.x = opts.grid.margin.x || 0; this.grid.margin.y = opts.grid.margin.y || 0; }
    if (opts.grid && opts.grid.gap) { this.grid.gap.x = opts.grid.gap.x || 0; this.grid.gap.y = opts.grid.gap.y || 0; }
    this.coverOpt = opts.cover === undefined ? 'auto' : opts.cover;
    this.readingOrder = opts.readingOrder === 'col' ? 'col' : 'row';
    this.showCardInfo = opts.showCardInfo !== false;
    this.index = opts.startIndex || 0;
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.slides = [];
    this.pageCache = [];        // [{key, canvas}]
    this.deckData = null;
    this.pdf = null;
    this.forceGrid = false;
    this.coverOverride = null;  // null | true | false (user toggle wins)
    this.destroyed = false;
    this.idleTimer = null;
    this.captionOpen = false;
    this.panelOpen = null;      // null | 'settings'
    this.cutPreview = false;
    this._listeners = [];
    this._renderSeq = 0;

    this._loadGlobalPrefs();

    // ---------- DOM skeleton
    var host = document.createElement('div');
    host.style.cssText = 'width:100%;height:100%;display:block;';
    target.appendChild(host);
    this.host = host;
    var shadow = host.attachShadow({ mode: 'open' });
    this.shadow = shadow;
    var styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    shadow.appendChild(styleEl);

    var root = document.createElement('div');
    root.className = 'kv-root kv-anim t-' + this.theme;
    root.tabIndex = 0;
    shadow.appendChild(root);
    this.root = root;

    if (GRAIN === null) GRAIN = makeGrainDataUrl();
    var grain = document.createElement('div');
    grain.className = 'kv-grain';
    if (GRAIN) grain.style.backgroundImage = 'url(' + GRAIN + ')';
    root.appendChild(grain);

    this.stage = document.createElement('div');
    this.stage.className = 'kv-stage';
    root.appendChild(this.stage);

    this.chrome = document.createElement('div');
    this.chrome.className = 'kv-chrome';
    root.appendChild(this.chrome);

    this.captionEl = document.createElement('div');
    this.captionEl.className = 'kv-caption';
    this.captionEl.style.display = 'none';
    root.appendChild(this.captionEl);

    this.bannerEl = document.createElement('div');
    this.bannerEl.className = 'kv-banner';
    this.bannerEl.style.display = 'none';
    root.appendChild(this.bannerEl);

    this.panelEl = document.createElement('div');
    this.panelEl.className = 'kv-panel';
    this.panelEl.style.display = 'none';
    root.appendChild(this.panelEl);

    this.loadEl = document.createElement('div');
    this.loadEl.className = 'kv-load';
    root.appendChild(this.loadEl);
    this._renderLoading(0);

    this._buildChrome();
    this._bindInput();

    // ---------- async boot
    this._boot().catch(function (err) {
      if (!self.destroyed) self._showError(err);
    });

    setTimeout(function () { try { root.focus({ preventScroll: true }); } catch (e) { } }, 0);
  }

  Viewer.prototype.t = function (k) {
    return (STRINGS[this.lang] && STRINGS[this.lang][k]) || STRINGS.en[k] || k;
  };

  /* ------------------------------------------------------------ persistence */
  Viewer.prototype._prefsKey = 'kfb-viewer:prefs';
  Viewer.prototype._loadGlobalPrefs = function () {
    try {
      var p = JSON.parse(localStorage.getItem(this._prefsKey) || '{}');
      if (!this.opts.theme && /^(paper|dark|light)$/.test(p.theme || '')) this.theme = p.theme;
      if (!this.opts.lang && (p.lang === 'de' || p.lang === 'en')) this.lang = p.lang;
      if (this.opts.showCardInfo === undefined && typeof p.showCardInfo === 'boolean') this.showCardInfo = p.showCardInfo;
    } catch (e) { }
  };
  Viewer.prototype._saveGlobalPrefs = function () {
    try {
      localStorage.setItem(this._prefsKey, JSON.stringify({
        theme: this.theme, lang: this.lang, showCardInfo: this.showCardInfo
      }));
    } catch (e) { }
  };
  Viewer.prototype._deckKey = function () {
    var id = (this.deckData && this.deckData.sourceFile) ||
      (this.opts.source && this.opts.source.url) ||
      (this.opts.source && this.opts.source.name) || 'unknown-deck';
    return 'kfb-viewer:deck:' + id;
  };
  Viewer.prototype._loadDeckPrefs = function () {
    try {
      var p = JSON.parse(localStorage.getItem(this._deckKey()) || 'null');
      if (!p) return;
      if (typeof p.cover === 'boolean') this.coverOverride = p.cover;
      if (typeof p.forceGrid === 'boolean') this.forceGrid = p.forceGrid;
      if (p.readingOrder === 'row' || p.readingOrder === 'col') this.readingOrder = p.readingOrder;
      if (p.grid) {
        this.grid.margin.x = clamp(+p.grid.margin.x || 0, 0, 0.12);
        this.grid.margin.y = clamp(+p.grid.margin.y || 0, 0, 0.12);
        this.grid.gap.x = clamp(+p.grid.gap.x || 0, 0, 0.12);
        this.grid.gap.y = clamp(+p.grid.gap.y || 0, 0, 0.12);
        if (p.grid.offset) {
          this.grid.offset.x = clamp(+p.grid.offset.x || 0, -0.12, 0.12);
          this.grid.offset.y = clamp(+p.grid.offset.y || 0, -0.12, 0.12);
        }
      }
    } catch (e) { }
  };
  Viewer.prototype._saveDeckPrefs = function () {
    try {
      localStorage.setItem(this._deckKey(), JSON.stringify({
        cover: this.coverOverride, forceGrid: this.forceGrid,
        readingOrder: this.readingOrder,
        grid: { margin: this.grid.margin, gap: this.grid.gap, offset: this.grid.offset }
      }));
    } catch (e) { }
  };

  // fetch with download progress — also the hook a single-file bundler can shim
  function fetchArrayBuffer(url, onProgress) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
      var total = +(r.headers.get('Content-Length') || 0);
      if (!r.body || !r.body.getReader || !total) return r.arrayBuffer();
      var reader = r.body.getReader(), chunks = [], got = 0;
      function pump() {
        return reader.read().then(function (res) {
          if (res.done) {
            var buf = new Uint8Array(got), off = 0;
            chunks.forEach(function (c) { buf.set(c, off); off += c.length; });
            return buf.buffer;
          }
          chunks.push(res.value); got += res.value.length;
          if (onProgress) onProgress(got, total);
          return pump();
        });
      }
      return pump();
    });
  }

  /* ------------------------------------------------------------------ boot */
  Viewer.prototype._boot = function () {
    var self = this;
    var deckDataP = Promise.resolve(null);
    var dd = this.opts.deckData;
    if (dd) {
      if (dd.url) {
        deckDataP = fetch(dd.url).then(function (r) {
          if (!r.ok) throw new Error('deckData HTTP ' + r.status);
          return r.json();
        }).catch(function () { return null; }); // deckData optional — viewer runs without
      } else {
        deckDataP = Promise.resolve(dd);
      }
    }
    return loadPdfJs().then(function (pdfjs) {
      var src = self.opts.source;
      var params;
      if (src instanceof ArrayBuffer) params = { data: src };
      else if (src && src.buffer instanceof ArrayBuffer) params = { data: src };
      else if (typeof File !== 'undefined' && src instanceof File) {
        return src.arrayBuffer().then(function (buf) {
          return self._openPdf(pdfjs, { data: buf }, deckDataP);
        });
      } else if (src && src.url) {
        return fetchArrayBuffer(src.url, function (got, total) {
          self._renderLoading(got / total);
        }).then(function (buf) {
          return self._openPdf(pdfjs, { data: buf }, deckDataP);
        });
      } else {
        throw new Error('No PDF source given');
      }
      return self._openPdf(pdfjs, params, deckDataP);
    });
  };

  Viewer.prototype._openPdf = function (pdfjs, params, deckDataP) {
    var self = this;
    var task = pdfjs.getDocument(Object.assign({}, params)); // NOTE: keep eval enabled — disabling it explodes render time on pattern/function-heavy pages
    this._loadingTask = task;
    task.onProgress = function (p) {
      if (p && p.total) self._renderLoading(p.loaded / p.total);
      else self._renderLoading(null);
    };
    return Promise.all([task.promise, deckDataP]).then(function (res) {
      if (self.destroyed) return;
      self.pdf = res[0];
      self.deckData = res[1] || null;
      self._loadDeckPrefs();
      self._resolveLayout();
      self._buildSlides();
      self.index = clamp(self.index, 0, self.slides.length - 1);
      self._buildChrome();
      self._buildPanel();
      self._updateBanner();
      self.loadEl.classList.add('hide');
      self._go(self.index, 0, true);
      self._preload();
      if (typeof self.opts.onReady === 'function') {
        self.opts.onReady({
          pageCount: self.pdf.numPages,
          cardCount: self.deckData ? (self.deckData.cardCount || (self.deckData.cards || []).length) : null,
          slideCount: self.slides.length,
          layoutStatus: self.layoutStatus
        });
      }
      self._armIdle();
    });
  };

  /* ------------------------------------------------------ layout resolver §6 */
  Viewer.prototype._resolveLayout = function () {
    var d = this.deckData;
    var cells = this.grid.rows * this.grid.cols;
    var pageCount = this.pdf.numPages;
    var hasCoverSignal = !!(d && (d.coverScore != null || d.coverQA));
    var cover;
    if (this.coverOverride !== null) cover = this.coverOverride ? 1 : 0;
    else if (this.coverOpt === true) cover = 1;
    else if (this.coverOpt === false) cover = 0;
    else cover = d ? (hasCoverSignal ? 1 : 0) : 1; // no data: assume cover, toggle is always visible

    this.coverPages = cover;
    this.pdfPageMismatch = !!(d && d.pageCount && d.pageCount !== pageCount);

    if (d && (d.cardCount || (d.cards && d.cards.length))) {
      var cardCount = d.cardCount || d.cards.length;
      this.cardCount = cardCount;
      var expected = Math.ceil(cardCount / cells) + cover;
      var layoutOK = expected === pageCount;
      // alternate hypothesis (cover flipped) — basis for the manual override suggestion
      var altCover = cover ? 0 : 1;
      var altOK = (Math.ceil(cardCount / cells) + altCover) === pageCount;
      this.layoutOK = layoutOK;
      this.altCoverReconciles = !layoutOK && altOK;
      this.layoutStatus = layoutOK ? 'ok' : 'needs-review';
    } else {
      this.cardCount = null;
      this.layoutOK = true; // convention-based, nothing to validate against
      this.altCoverReconciles = false;
      this.layoutStatus = 'no-data';
    }
    if (this.pdfPageMismatch && this.layoutStatus === 'ok') this.layoutStatus = 'needs-review';
  };

  Viewer.prototype._cardModeAvailable = function () {
    return this.layoutStatus !== 'needs-review' || this.forceGrid;
  };

  /* ---------------------------------------------------------------- slides */
  Viewer.prototype._buildSlides = function () {
    var slides = [];
    var pageCount = this.pdf.numPages;
    var cells = this.grid.rows * this.grid.cols;
    var effMode = this.mode === 'card' && this._cardModeAvailable() ? 'card' : 'page';
    this.effMode = effMode;

    if (effMode === 'page') {
      for (var p = 1; p <= pageCount; p++) slides.push({ kind: 'page', page: p });
    } else {
      if (this.coverPages) slides.push({ kind: 'cover', page: 1 });
      var gridPages = pageCount - this.coverPages;
      var totalCells = gridPages * cells;
      var limit = (this.layoutStatus === 'ok' && this.cardCount) ? this.cardCount : totalCells;
      for (var k = 0; k < Math.min(totalCells, limit); k++) {
        var page = this.coverPages + 1 + Math.floor(k / cells);
        var rc = cellForIndex(this.grid, k % cells, this.readingOrder);
        slides.push({ kind: 'card', page: page, row: rc.row, col: rc.col, cardIdx: k });
      }
    }
    this.slides = slides;
  };

  /* ------------------------------------------------------------- rendering */
  Viewer.prototype._stageBox = function () {
    var r = this.stage.getBoundingClientRect();
    var cs = getComputedStyle(this.stage);
    return {
      w: Math.max(60, r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)),
      h: Math.max(60, r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom))
    };
  };

  Viewer.prototype._cachedCanvas = function (pageNo, pxWidth) {
    var bucket = Math.min(6144, Math.ceil(pxWidth / 256) * 256);
    var key = pageNo + '@' + bucket;
    for (var i = 0; i < this.pageCache.length; i++) {
      if (this.pageCache[i].key === key) return this.pageCache[i].canvas;
    }
    return null;
  };

  Viewer.prototype._renderPageCanvas = function (pageNo, pxWidth) {
    var self = this;
    var bucket = Math.min(6144, Math.ceil(pxWidth / 256) * 256);
    var key = pageNo + '@' + bucket;
    for (var i = 0; i < this.pageCache.length; i++) {
      if (this.pageCache[i].key === key) {
        var hit = this.pageCache.splice(i, 1)[0];
        this.pageCache.push(hit);
        return Promise.resolve(hit.canvas);
      }
    }
    if (!this._pageRenders) this._pageRenders = {};
    if (this._pageRenders[key]) return this._pageRenders[key];
    var p = this.pdf.getPage(pageNo).then(function (page) {
      var vp1 = page.getViewport({ scale: 1 });
      var scale = bucket / vp1.width;
      // pixel cap ≈ 22 MP
      var maxScale = Math.sqrt(22e6 / (vp1.width * vp1.height));
      scale = Math.min(scale, maxScale);
      var vp = page.getViewport({ scale: scale });
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
      var ctx = canvas.getContext('2d', { alpha: false });
      var task = page.render({ canvasContext: ctx, viewport: vp });
      // watchdog: cancel pathologically slow renders (heavy collage pages)
      var watchdog = setTimeout(function () { try { task.cancel(); } catch (e) { } }, 30000);
      return task.promise.then(function () {
        clearTimeout(watchdog);
        self.pageCache.push({ key: key, canvas: canvas });
        while (self.pageCache.length > 5) {
          var old = self.pageCache.shift();
          old.canvas.width = old.canvas.height = 0; // free memory
        }
        return canvas;
      }, function (err) {
        clearTimeout(watchdog);
        canvas.width = canvas.height = 0;
        throw err;
      });
    });
    // clear the in-flight slot on BOTH outcomes — a rejected render must not
    // poison this page/bucket forever
    p = p.then(function (canvas) {
      delete self._pageRenders[key];
      return canvas;
    }, function (err) {
      delete self._pageRenders[key];
      throw err;
    });
    this._pageRenders[key] = p;
    return p;
  };

  // Layout geometry for a slide at current zoom. Returns css sizes + needed page px width.
  Viewer.prototype._geometry = function (slide) {
    var self = this;
    return this.pdf.getPage(slide.page).then(function (page) {
      var vp = page.getViewport({ scale: 1 });
      var box = self._stageBox();
      var dpr = Math.min(2.5, window.devicePixelRatio || 1);
      var frac = slide.kind === 'card' ? cellRect(self.grid, slide.row, slide.col) : { x: 0, y: 0, w: 1, h: 1 };
      var cw = vp.width * frac.w, ch = vp.height * frac.h;
      var fit = Math.min(box.w / cw, box.h / ch) * self.zoom;
      var cssW = cw * fit, cssH = ch * fit;
      var pageCssW = vp.width * fit, pageCssH = vp.height * fit;
      return {
        frac: frac, cssW: cssW, cssH: cssH,
        pageCssW: pageCssW, pageCssH: pageCssH,
        pxWidth: pageCssW * dpr
      };
    });
  };

  Viewer.prototype._buildSlideEl = function (slide) {
    var self = this;
    var QUICK = 1536; // fast first paint bucket for heavy pages
    return this._geometry(slide).then(function (g) {
      var seq = self._renderSeq;
      function makeBox(pageCanvas) {
        var box = document.createElement('div');
        box.className = 'kv-cardbox';
        box.style.width = g.cssW + 'px';
        box.style.height = g.cssH + 'px';
        var cv = pageCanvas.cloneNode(false);
        cv.getContext('2d', { alpha: false }).drawImage(pageCanvas, 0, 0);
        cv.style.width = g.pageCssW + 'px';
        cv.style.height = g.pageCssH + 'px';
        cv.style.left = (-g.frac.x * g.pageCssW) + 'px';
        cv.style.top = (-g.frac.y * g.pageCssH) + 'px';
        box.appendChild(cv);
        if (self.cutPreview && slide.kind !== 'card') self._appendCutlines(box);
        return box;
      }
      // Progressive: if the target resolution isn't cached yet and is expensive,
      // paint a quick low-res version immediately and upgrade in place.
      var needsQuick = g.pxWidth > QUICK + 256 && !self._cachedCanvas(slide.page, g.pxWidth);
      if (!needsQuick) {
        return self._renderPageCanvas(slide.page, g.pxWidth).then(makeBox);
      }
      return self._renderPageCanvas(slide.page, QUICK).then(function (quick) {
        var box = makeBox(quick);
        self._renderPageCanvas(slide.page, g.pxWidth).then(function (hi) {
          if (self.destroyed || seq !== self._renderSeq || !box.isConnected) return;
          var oldCv = box.querySelector('canvas');
          if (!oldCv) return;
          var fresh = hi.cloneNode(false);
          fresh.getContext('2d', { alpha: false }).drawImage(hi, 0, 0);
          fresh.style.cssText = oldCv.style.cssText;
          box.replaceChild(fresh, oldCv);
        }).catch(function () { /* keep the quick version */ });
        return box;
      });
    });
  };

  Viewer.prototype._appendCutlines = function (box) {
    var wrap = document.createElement('div');
    wrap.className = 'kv-cutlines';
    for (var r = 0; r < this.grid.rows; r++) {
      for (var c = 0; c < this.grid.cols; c++) {
        var f = cellRect(this.grid, r, c);
        var d = document.createElement('div');
        d.className = 'cell';
        d.style.left = (f.x * 100) + '%'; d.style.top = (f.y * 100) + '%';
        d.style.width = (f.w * 100) + '%'; d.style.height = (f.h * 100) + '%';
        wrap.appendChild(d);
      }
    }
    var note = document.createElement('div');
    note.className = 'kv-cutnote';
    note.textContent = this.t('cutPreview');
    wrap.appendChild(note);
    box.appendChild(wrap);
    this._cutlinesEl = wrap;
  };

  Viewer.prototype._go = function (i, dir, instant) {
    var self = this;
    i = clamp(i, 0, Math.max(0, this.slides.length - 1));
    this.index = i;
    this.zoom = 1; this.pan = { x: 0, y: 0 };
    var seq = ++this._renderSeq;
    var slide = this.slides[i];
    if (!slide) return;
    this._updateCaption();
    this._updateCounter();
    this._buildSlideEl(slide).then(function (box) {
      if (self.destroyed || seq !== self._renderSeq) return;
      var layer = document.createElement('div');
      layer.className = 'kv-layer';
      layer.appendChild(box);
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var old = self._layer;
      self._layer = layer;
      self._box = box;
      if (instant || reduce || !dir) {
        self.stage.appendChild(layer);
        if (old) old.remove();
      } else {
        layer.classList.add('enter');
        layer.style.transform = 'translateX(' + (dir * 46) + 'px) scale(.985)';
        self.stage.appendChild(layer);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            layer.classList.remove('enter');
            layer.style.transform = 'translateX(0) scale(1)';
            if (old) {
              old.style.opacity = '0';
              old.style.transform = 'translateX(' + (dir * -34) + 'px) scale(.99)';
              setTimeout(function () { old.remove(); }, 420);
            }
          });
        });
      }
      self._preload();
      if (typeof self.opts.onChange === 'function') self.opts.onChange(self.index, self.slides.length);
    }).catch(function (err) {
      // never leave the stage silently empty
      if (self.destroyed || seq !== self._renderSeq) return;
      var layer = document.createElement('div');
      layer.className = 'kv-layer';
      var msg = document.createElement('div');
      msg.style.cssText = 'font-size:12.5px;color:var(--muted);background:var(--panel-bg);border:1px solid var(--chrome-line);border-radius:10px;padding:12px 16px;max-width:320px;text-align:center;';
      msg.textContent = self.t('errLoad') + ' (' + ((err && err.message) || err) + ')';
      layer.appendChild(msg);
      var old = self._layer;
      self._layer = layer; self._box = null;
      self.stage.appendChild(layer);
      if (old) old.remove();
    });
  };

  Viewer.prototype._preload = function () {
    var self = this;
    // don't compete with an in-flight heavy render of the current slide
    if (this._pageRenders && Object.keys(this._pageRenders).length > 1) return;
    [this.index + 1, this.index - 1].forEach(function (j) {
      var s = self.slides[j];
      if (!s) return;
      self._geometry(s).then(function (g) {
        return self._renderPageCanvas(s.page, Math.min(g.pxWidth, 2048));
      }).catch(function () { });
    });
  };

  Viewer.prototype._rerenderCurrent = function () {
    this._go(this.index, 0, true);
  };

  /* ---------------------------------------------------------------- chrome */
  Viewer.prototype._buildChrome = function () {
    var self = this;
    var t = function (k) { return self.t(k); };
    this.chrome.innerHTML =
      '<div class="kv-title"></div>' +
      '<div class="kv-bar">' +
      '<div class="kv-btns">' +
      '<button class="kv-btn txt" data-act="lang" aria-label="' + esc(t('language')) + '"></button>' +
      '<button class="kv-btn" data-act="mode" title="' + esc(t('modeToggle')) + '" aria-label="' + esc(t('modeToggle')) + '"></button>' +
      '<button class="kv-btn" data-act="info" title="' + esc(t('info')) + '" aria-label="' + esc(t('info')) + '">' + IC.infoIc + '</button>' +
      '<button class="kv-btn" data-act="theme" title="' + esc(t('theme')) + '" aria-label="' + esc(t('theme')) + '">' + IC.sun + '</button>' +
      '<button class="kv-btn" data-act="zoomout" title="' + esc(t('zoomOut')) + '" aria-label="' + esc(t('zoomOut')) + '">' + IC.minus + '</button>' +
      '<button class="kv-btn" data-act="zoomin" title="' + esc(t('zoomIn')) + '" aria-label="' + esc(t('zoomIn')) + '">' + IC.plus + '</button>' +
      '<button class="kv-btn" data-act="settings" title="' + esc(t('settings')) + '" aria-label="' + esc(t('settings')) + '">' + IC.gear + '</button>' +
      '<button class="kv-btn" data-act="fs" title="' + esc(t('fullscreen')) + '" aria-label="' + esc(t('fullscreen')) + '">' + IC.full + '</button>' +
      '</div></div>' +
      '<button class="kv-arrow l" data-act="prev" aria-label="' + esc(t('prev')) + '"><span>' + IC.chevL + '</span></button>' +
      '<button class="kv-arrow r" data-act="next" aria-label="' + esc(t('next')) + '"><span>' + IC.chevR + '</span></button>' +
      '<div class="kv-foot"><div class="kv-counter"></div></div>' +
      '<div class="kv-progress"><i></i></div>';

    this.chrome.querySelector('.kv-title').textContent =
      (this.deckData && this.deckData.deckTitle) || (this.opts.title || '');
    this.chrome.querySelector('[data-act=lang]').textContent = this.lang.toUpperCase();
    this._syncModeBtn();
    this._syncInfoBtn();

    if (!this._chromeBound) {
      this._chromeBound = true;
      this.chrome.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-act]') : null;
      if (!b) return;
      ev.stopPropagation();
      self._poke();
      var act = b.getAttribute('data-act');
      if (act === 'prev') self.prev();
      else if (act === 'next') self.next();
      else if (act === 'mode') self.setMode(self.mode === 'card' ? 'page' : 'card');
      else if (act === 'theme') self._cycleTheme();
      else if (act === 'info') self.toggleCardInfo();
      else if (act === 'settings') self._togglePanel();
      else if (act === 'fs') self.toggleFullscreen();
      else if (act === 'zoomin') self._setZoom(self.zoom * 1.4);
      else if (act === 'zoomout') self._setZoom(self.zoom / 1.4);
      else if (act === 'lang') self.setLang(self.lang === 'en' ? 'de' : 'en');
      });
    }
    this._updateCounter();
  };

  Viewer.prototype._syncModeBtn = function () {
    var b = this.chrome.querySelector('[data-act=mode]');
    if (b) b.innerHTML = this.mode === 'card' ? IC.grid : IC.pageIc;
  };
  Viewer.prototype._syncInfoBtn = function () {
    var b = this.chrome.querySelector('[data-act=info]');
    if (b) b.classList.toggle('on', this.showCardInfo);
  };

  Viewer.prototype._updateCounter = function () {
    var c = this.chrome.querySelector('.kv-counter');
    var p = this.chrome.querySelector('.kv-progress i');
    if (!c) return;
    var tot = this.slides.length || 1;
    var slide = this.slides[this.index];
    var label = '';
    if (slide) {
      if (slide.kind === 'page') label = this.t('page') + ' ' + slide.page + ' / ' + this.pdf.numPages;
      else if (slide.kind === 'cover') label = this.t('cover') + ' · 1 / ' + tot;
      else label = this.t('card') + ' ' + (slide.cardIdx + 1) + ' / ' + (tot - (this.coverPages ? 1 : 0));
    }
    c.textContent = label;
    if (p) p.style.width = ((this.index + 1) / tot * 100) + '%';
  };

  /* --------------------------------------------------------------- caption */
  Viewer.prototype._cardForSlide = function (slide) {
    if (!slide || slide.kind !== 'card' || !this.deckData || !this.deckData.cards) return null;
    return this.deckData.cards[slide.cardIdx] || null;
  };

  Viewer.prototype._updateCaption = function () {
    var self = this;
    var slide = this.slides[this.index];
    var card = this._cardForSlide(slide);
    var show = this.showCardInfo && !!card;
    this.captionEl.style.display = show ? 'flex' : 'none';
    if (!show) { this.captionOpen = false; return; }
    var hasDetail = !!(card.power || card.lore || card.gradeReason || card.artworkPrompt);
    this.captionEl.className = 'kv-caption' + (this.captionOpen && hasDetail ? ' open' : '');
    var html = '';
    if (hasDetail) {
      var more = '';
      if (card.gradeReason) {
        more += '<h4>' + esc(this.t('gradeReason')) + (card.grade != null ? ' · G' + esc(card.grade) : '') + '</h4><p>' + esc(card.gradeReason) + '</p>';
      }
      if (card.artworkPrompt) {
        more += '<h4>' + esc(this.t('artPrompt')) + '</h4><p class="mono">' + esc(card.artworkPrompt) + '</p>';
      }
      html += '<div class="kv-cap-detail">' +
        (card.power ? '<h4>' + esc(this.t('power')) + '</h4><p>' + esc(card.power) + '</p>' : '') +
        (card.lore ? '<h4>' + esc(this.t('lore')) + '</h4><p>' + esc(card.lore) + '</p>' : '') +
        (more ? '<div class="kv-more">' + more + '</div>' : '') +
        '</div>';
    }
    html += '<button class="kv-cap-pill" aria-expanded="' + (this.captionOpen ? 'true' : 'false') + '">' +
      (card.grade != null ? '<span class="kv-cap-grade">G' + esc(card.grade) + '</span>' : '') +
      '<span class="kv-cap-name">' + esc(card.cardName || (this.t('card') + ' ' + (slide.cardIdx + 1))) + '</span>' +
      (hasDetail ? '<span class="kv-cap-chev">' + IC.chevD + '</span>' : '') +
      '</button>';
    this.captionEl.innerHTML = html;
    var pill = this.captionEl.querySelector('.kv-cap-pill');
    pill.onclick = function (ev) {
      ev.stopPropagation();
      self.captionOpen = !self.captionOpen;
      self._updateCaption();
      self._poke();
    };
  };

  /* ---------------------------------------------------------------- banner */
  Viewer.prototype._updateBanner = function () {
    var self = this;
    var msgs = [];
    if (this.layoutStatus === 'needs-review' && !this.forceGrid) {
      var m = '<span class="kv-badge">' + esc(this.t('needsReviewBadge')) + '</span> ' + esc(this.t('needsReview'));
      if (this.pdfPageMismatch) {
        m += ' ' + esc(fmt(this.t('pdfMismatch'), { a: this.pdf.numPages, b: this.deckData.pageCount }));
      }
      var buttons = '';
      if (this.altCoverReconciles) {
        m += '<br>' + esc(this.t('suggestion'));
        buttons += '<button class="pri" data-b="alt">' + esc(this.t('apply')) + '</button>';
      }
      buttons += '<button data-b="force">' + esc(this.t('forceGrid')) + '</button>';
      buttons += '<button data-b="dismiss">' + esc(this.t('dismiss')) + '</button>';
      msgs.push('<div>' + m + '</div><div class="row">' + buttons + '</div>');
    } else if (this.layoutStatus === 'no-data' && !this._noDataDismissed) {
      msgs.push('<div>' + esc(this.t('noData')) + '</div><div class="row"><button data-b="dismiss">' + esc(this.t('dismiss')) + '</button></div>');
    }
    if (!msgs.length || this._bannerDismissed) {
      this.bannerEl.style.display = 'none';
      return;
    }
    this.bannerEl.style.display = 'flex';
    this.bannerEl.innerHTML = msgs[0];
    this.bannerEl.onclick = function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-b]') : null;
      if (!b) return;
      ev.stopPropagation();
      var act = b.getAttribute('data-b');
      if (act === 'dismiss') { self._bannerDismissed = true; self._noDataDismissed = true; self._updateBanner(); }
      else if (act === 'force') { self.forceGrid = true; self._saveDeckPrefs(); self._reflow(); }
      else if (act === 'alt') {
        self.coverOverride = !self.coverPages ? true : false;
        self.forceGrid = true;
        self._saveDeckPrefs(); self._reflow();
      }
    };
  };

  Viewer.prototype._reflow = function () {
    var cur = this.slides[this.index];
    this._resolveLayout();
    this._buildSlides();
    // keep position: find slide on same page
    var idx = 0;
    if (cur) {
      for (var i = 0; i < this.slides.length; i++) {
        if (this.slides[i].page >= cur.page) { idx = i; break; }
        idx = i;
      }
    }
    this.index = idx;
    this._updateBanner();
    this._buildPanel();
    this._syncModeBtn();
    this._go(this.index, 0, true);
  };

  /* ----------------------------------------------------------------- panel */
  Viewer.prototype._togglePanel = function () {
    this.panelOpen = this.panelOpen ? null : 'settings';
    this.cutPreview = false;
    this._buildPanel();
  };

  Viewer.prototype._buildPanel = function () {
    var self = this;
    var t = function (k) { return self.t(k); };
    if (!this.panelOpen) {
      this.panelEl.style.display = 'none';
      if (this.cutPreview) { this.cutPreview = false; this._rerenderCurrent(); }
      return;
    }
    this.panelEl.style.display = 'block';
    var g = this.grid;
    function sliderRow(id, label, val, min, max) {
      return '<div class="kv-row"><label for="kv-' + id + '">' + esc(label) + '</label></div>' +
        '<div class="kv-slider"><input id="kv-' + id + '" type="range" min="' + (min == null ? 0 : min) + '" max="' + (max == null ? 10 : max) + '" step="0.25" value="' + (val * 100).toFixed(2) + '" data-g="' + id + '">' +
        '<output>' + (val * 100).toFixed(1) + '%</output></div>';
    }
    var coverOn = this.coverPages === 1;
    var showForce = this.layoutStatus === 'needs-review';
    this.panelEl.innerHTML =
      '<h3>' + esc(t('settings')) + '</h3>' +
      '<div class="sec">' +
      '<div class="kv-row"><label>' + esc(t('firstPageCover')) + '</label>' +
      '<button class="kv-switch' + (coverOn ? ' on' : '') + '" role="switch" aria-checked="' + coverOn + '" data-p="cover" aria-label="' + esc(t('firstPageCover')) + '"><i></i></button></div>' +
      (showForce ?
        '<div class="kv-row"><label>' + esc(t('forceGrid')) + '</label>' +
        '<button class="kv-switch' + (this.forceGrid ? ' on' : '') + '" role="switch" aria-checked="' + this.forceGrid + '" data-p="force" aria-label="' + esc(t('forceGrid')) + '"><i></i></button></div>' : '') +
      '<div class="kv-row"><label>' + esc(t('readingOrder')) + '</label>' +
      '<span class="kv-seg">' +
      '<button data-p="ro-row" class="' + (this.readingOrder === 'row' ? 'on' : '') + '">' + esc(t('rowMajor')) + '</button>' +
      '<button data-p="ro-col" class="' + (this.readingOrder === 'col' ? 'on' : '') + '">' + esc(t('colMajor')) + '</button>' +
      '</span></div>' +
      '</div>' +
      '<div class="sec">' +
      '<h3 style="margin-bottom:10px">' + esc(t('gutterTitle')) + '</h3>' +
      sliderRow('mx', t('marginX'), g.margin.x) +
      sliderRow('my', t('marginY'), g.margin.y) +
      sliderRow('gx', t('gapX'), g.gap.x) +
      sliderRow('gy', t('gapY'), g.gap.y) +
      sliderRow('ox', t('offsetX'), g.offset.x, -10, 10) +
      sliderRow('oy', t('offsetY'), g.offset.y, -10, 10) +
      '<div class="kv-row" style="margin-top:10px"><button class="linkbtn" data-p="reset">' + esc(t('reset')) + '</button></div>' +
      '<p class="note">' + esc(t('cutPreview')) + '</p>' +
      '</div>';

    this.panelEl.onclick = function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-p]') : null;
      ev.stopPropagation();
      if (!b) return;
      var act = b.getAttribute('data-p');
      if (act === 'cover') {
        self.coverOverride = !(self.coverPages === 1);
        self._saveDeckPrefs(); self._reflow();
      } else if (act === 'force') {
        self.forceGrid = !self.forceGrid;
        self._saveDeckPrefs(); self._reflow();
      } else if (act === 'ro-row' || act === 'ro-col') {
        self.readingOrder = act === 'ro-row' ? 'row' : 'col';
        self._saveDeckPrefs(); self._reflow();
      } else if (act === 'reset') {
        self.grid.margin = { x: 0, y: 0 }; self.grid.gap = { x: 0, y: 0 }; self.grid.offset = { x: 0, y: 0 };
        self._saveDeckPrefs(); self._buildPanel(); self._gutterChanged();
      }
    };
    this.panelEl.oninput = function (ev) {
      var inp = ev.target;
      if (!inp.getAttribute || !inp.getAttribute('data-g')) return;
      var id = inp.getAttribute('data-g');
      var isOffset = id === 'ox' || id === 'oy';
      var v = clamp(parseFloat(inp.value) / 100, isOffset ? -0.1 : 0, 0.1);
      if (id === 'mx') self.grid.margin.x = v;
      else if (id === 'my') self.grid.margin.y = v;
      else if (id === 'ox') self.grid.offset.x = v;
      else if (id === 'oy') self.grid.offset.y = v;
      else if (id === 'gx') self.grid.gap.x = v;
      else if (id === 'gy') self.grid.gap.y = v;
      var out = inp.parentElement.querySelector('output');
      if (out) out.textContent = (v * 100).toFixed(1) + '%';
      self._saveDeckPrefs();
      self._gutterChanged();
    };
  };

  Viewer.prototype._gutterChanged = function () {
    var self = this;
    if (typeof this.opts.onGutterChange === 'function') {
      this.opts.onGutterChange(JSON.parse(JSON.stringify(this.grid)));
    }
    // live update: card mode → recrop current slide; page mode → cut-line overlay
    if (this.effMode === 'card') {
      clearTimeout(this._gutT);
      this._gutT = setTimeout(function () { self._rerenderCurrent(); }, 60);
    } else {
      this.cutPreview = true;
      if (this._cutlinesEl && this._box) {
        this._cutlinesEl.remove();
        this._appendCutlines(this._box);
      } else {
        this._rerenderCurrent();
      }
    }
  };

  /* ------------------------------------------------------------- load / err */
  Viewer.prototype._renderLoading = function (frac) {
    var pct = frac == null ? null : Math.round(clamp(frac, 0, 1) * 100);
    this.loadEl.innerHTML =
      '<div class="word">' + esc(this.t('loading')) + (pct != null ? ' · ' + pct + '%' : '') + '</div>' +
      '<div class="track"><i style="width:' + (pct == null ? 30 : pct) + '%"></i></div>';
  };
  Viewer.prototype._showError = function (err) {
    this.loadEl.classList.remove('hide');
    this.loadEl.innerHTML =
      '<div class="err"><strong>' + esc(this.t('errLoad')) + '</strong>' +
      '<small>' + esc(this.t('errHint')) + '</small>' +
      '<small style="opacity:.6;margin-top:10px">' + esc(err && err.message || err) + '</small></div>';
  };

  /* ----------------------------------------------------------------- input */
  Viewer.prototype._on = function (el, ev, fn, opt) {
    el.addEventListener(ev, fn, opt);
    this._listeners.push([el, ev, fn, opt]);
  };

  Viewer.prototype._poke = function () {
    var self = this;
    this.root.classList.remove('idle');
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(function () {
      if (!self.panelOpen && !self.captionOpen) self.root.classList.add('idle');
    }, 3200);
  };
  Viewer.prototype._armIdle = function () { this._poke(); };

  Viewer.prototype._bindInput = function () {
    var self = this;
    var root = this.root;

    this._on(root, 'mousemove', function () { self._poke(); });
    this._on(root, 'keydown', function (ev) {
      var k = ev.key;
      var handled = true;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') self.next();
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') self.prev();
      else if (k === 'Home') self.goTo(0);
      else if (k === 'End') self.goTo(self.slides.length - 1);
      else if (k === 'f' || k === 'F') self.toggleFullscreen();
      else if (k === 't' || k === 'T') self._cycleTheme();
      else if (k === 'm' || k === 'M') self.setMode(self.mode === 'card' ? 'page' : 'card');
      else if (k === 'i' || k === 'I') self.toggleCardInfo();
      else if (k === '+' || k === '=') self._setZoom(self.zoom * 1.4);
      else if (k === '-' || k === '_') self._setZoom(self.zoom / 1.4);
      else if (k === 'Escape') {
        if (self.panelOpen) { self.panelOpen = null; self._buildPanel(); }
        else if (self.captionOpen) { self.captionOpen = false; self._updateCaption(); }
        else if (self.zoom > 1) self._setZoom(1);
        else handled = false;
      }
      else handled = false;
      if (handled) { ev.preventDefault(); self._poke(); }
    });

    // pointer: swipe / pan / tap zones / pinch-zoom
    var pd = null;
    var pts = new Map();      // active pointers (touch)
    var pinch = null;         // { d0, z0, live }
    function pinchDist() {
      var a = Array.from(pts.values());
      return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
    }
    this._on(this.stage, 'pointerdown', function (ev) {
      if (ev.button !== 0 && ev.pointerType === 'mouse') return;
      pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (pts.size === 2) {
        pinch = { d0: pinchDist(), z0: self.zoom, live: self.zoom };
        pd = null;
        return;
      }
      pd = { x: ev.clientX, y: ev.clientY, t: Date.now(), moved: false, px: self.pan.x, py: self.pan.y };
      try { self.stage.setPointerCapture(ev.pointerId); } catch (e) { }
    });
    this._on(this.stage, 'pointermove', function (ev) {
      self._poke();
      if (pts.has(ev.pointerId)) pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (pinch && pts.size === 2) {
        var ratio = pinchDist() / (pinch.d0 || 1);
        pinch.live = clamp(pinch.z0 * ratio, 1, 4);
        if (self._layer) {
          self._layer.style.transform = 'translate(' + self.pan.x + 'px,' + self.pan.y + 'px) scale(' + (pinch.live / self.zoom) + ')';
        }
        return;
      }
      if (!pd) { self._tilt(ev); return; }
      var dx = ev.clientX - pd.x, dy = ev.clientY - pd.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) pd.moved = true;
      if (self.zoom > 1 && self._layer) {
        self.pan.x = pd.px + dx; self.pan.y = pd.py + dy;
        self._applyPanZoom();
      }
    });
    function endPointer(ev) {
      pts.delete(ev.pointerId);
      if (pinch && pts.size < 2) {
        var target = pinch.live;
        pinch = null;
        if (self._layer) self._layer.style.transform = 'translate(' + self.pan.x + 'px,' + self.pan.y + 'px)';
        if (Math.abs(target - self.zoom) > 0.02) self._setZoom(target);
        return true;
      }
      return false;
    }
    this._on(this.stage, 'pointerup', function (ev) {
      self._poke();
      if (endPointer(ev)) { pd = null; return; }
      if (!pd) return;
      var dx = ev.clientX - pd.x, dy = ev.clientY - pd.y, dt = Date.now() - pd.t;
      var wasTap = !pd.moved && dt < 400;
      pd = null;
      if (self.zoom > 1) { if (wasTap) self._tapZones(ev); return; }
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) self.next(); else self.prev();
        return;
      }
      if (wasTap) self._tapZones(ev);
    });
    this._on(this.stage, 'pointercancel', function (ev) { endPointer(ev); pd = null; });
    this._on(this.stage, 'pointerleave', function () { self._untilt(); });
    this._on(this.stage, 'dblclick', function () {
      self._setZoom(self.zoom > 1 ? 1 : 2);
    });

    // wheel / trackpad: two-finger swipe navigates, ctrl/cmd+wheel (trackpad pinch) zooms
    var wheelAcc = 0, wheelLock = 0, wheelLast = 0;
    this._on(this.stage, 'wheel', function (ev) {
      self._poke();
      ev.preventDefault();
      if (ev.ctrlKey || ev.metaKey) { // browsers report trackpad pinch as ctrl+wheel
        self._setZoom(self.zoom * (ev.deltaY < 0 ? 1.13 : 0.885));
        return;
      }
      if (self.zoom > 1) { // scroll pans when zoomed in
        self.pan.x -= ev.deltaX; self.pan.y -= ev.deltaY;
        self._applyPanZoom();
        return;
      }
      var now = Date.now();
      if (now - wheelLast > 260) wheelAcc = 0; // decay between gestures
      wheelLast = now;
      if (now < wheelLock) return;
      var d = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
      wheelAcc += d;
      if (Math.abs(wheelAcc) > 90) {
        wheelLock = now + 480;
        if (wheelAcc > 0) self.next(); else self.prev();
        wheelAcc = 0;
      }
    }, { passive: false });

    this._on(document, 'fullscreenchange', function () { self._poke(); });

    var resizeT = null;
    this._on(window, 'resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        if (!self.destroyed && self.pdf) self._rerenderCurrent();
      }, 160);
    });
  };

  Viewer.prototype._tapZones = function (ev) {
    var r = this.root.getBoundingClientRect();
    var fx = (ev.clientX - r.left) / r.width;
    if (this.panelOpen) { this.panelOpen = null; this._buildPanel(); return; }
    if (fx < 0.22) this.prev();
    else if (fx > 0.78) this.next();
    else {
      // middle tap: toggle chrome (mobile affordance)
      if (this.root.classList.contains('idle')) this._poke();
      else { clearTimeout(this.idleTimer); this.root.classList.add('idle'); }
    }
  };

  Viewer.prototype._tilt = function (ev) {
    if (this.zoom > 1 || !this._box) return;
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
    }
    var r = this.stage.getBoundingClientRect();
    var fx = (ev.clientX - r.left) / r.width - 0.5;
    var fy = (ev.clientY - r.top) / r.height - 0.5;
    this._box.style.transform = 'rotateY(' + (fx * 2.4) + 'deg) rotateX(' + (-fy * 1.8) + 'deg)';
  };
  Viewer.prototype._untilt = function () {
    if (this._box) this._box.style.transform = '';
  };

  Viewer.prototype._applyPanZoom = function () {
    if (!this._layer) return;
    var lim = 4000;
    this.pan.x = clamp(this.pan.x, -lim, lim);
    this.pan.y = clamp(this.pan.y, -lim, lim);
    this._layer.style.transform = 'translate(' + this.pan.x + 'px,' + this.pan.y + 'px)';
  };

  Viewer.prototype._setZoom = function (z) {
    z = clamp(z, 1, 4);
    if (Math.abs(z - this.zoom) < 0.01) return;
    this.zoom = z;
    if (z === 1) this.pan = { x: 0, y: 0 };
    this._untilt();
    var self = this;
    clearTimeout(this._zoomT);
    this._zoomT = setTimeout(function () { self._rerenderCurrentKeepPan(); }, 40);
  };
  Viewer.prototype._rerenderCurrentKeepPan = function () {
    var self = this;
    var pan = { x: this.pan.x, y: this.pan.y };
    var seq = ++this._renderSeq;
    var slide = this.slides[this.index];
    if (!slide) return;
    this._buildSlideEl(slide).then(function (box) {
      if (self.destroyed || seq !== self._renderSeq) return;
      var layer = document.createElement('div');
      layer.className = 'kv-layer';
      layer.appendChild(box);
      var old = self._layer;
      self._layer = layer; self._box = box;
      self.pan = pan;
      self._applyPanZoom();
      self.stage.appendChild(layer);
      if (old) old.remove();
    }).catch(function () { });
  };

  /* --------------------------------------------------------------- actions */
  Viewer.prototype.next = function () { if (this.index < this.slides.length - 1) this._go(this.index + 1, 1); };
  Viewer.prototype.prev = function () { if (this.index > 0) this._go(this.index - 1, -1); };
  Viewer.prototype.goTo = function (i) { this._go(i, i > this.index ? 1 : -1); };

  Viewer.prototype.setMode = function (m) {
    m = m === 'page' ? 'page' : 'card';
    if (m === this.mode) return;
    this.mode = m;
    this._reflow();
    this._syncModeBtn();
  };
  Viewer.prototype._cycleTheme = function () {
    var order = ['paper', 'dark', 'light'];
    this.setTheme(order[(order.indexOf(this.theme) + 1) % 3]);
  };
  Viewer.prototype.setTheme = function (th) {
    if (!/^(paper|dark|light)$/.test(th)) return;
    this.root.classList.remove('t-' + this.theme);
    this.theme = th;
    this.root.classList.add('t-' + th);
    this._saveGlobalPrefs();
  };
  Viewer.prototype.setGrid = function (g) {
    if (!g) return;
    if (g.rows) this.grid.rows = g.rows;
    if (g.cols) this.grid.cols = g.cols;
    if (g.margin) { this.grid.margin.x = g.margin.x || 0; this.grid.margin.y = g.margin.y || 0; }
    if (g.gap) { this.grid.gap.x = g.gap.x || 0; this.grid.gap.y = g.gap.y || 0; }
    if (g.offset) { this.grid.offset.x = g.offset.x || 0; this.grid.offset.y = g.offset.y || 0; }
    this._saveDeckPrefs();
    this._reflow();
  };
  Viewer.prototype.setCover = function (b) {
    this.coverOverride = !!b;
    this._saveDeckPrefs();
    this._reflow();
  };
  Viewer.prototype.toggleCardInfo = function () {
    this.showCardInfo = !this.showCardInfo;
    this._saveGlobalPrefs();
    this._syncInfoBtn();
    this._updateCaption();
  };
  Viewer.prototype.setLang = function (l) {
    this.lang = l === 'de' ? 'de' : 'en';
    this._saveGlobalPrefs();
    this._buildChrome();
    this._buildPanel();
    this._updateBanner();
    this._updateCaption();
    this._updateCounter();
  };
  Viewer.prototype.toggleFullscreen = function () {
    var el = this.host;
    if (document.fullscreenElement) {
      document.exitFullscreen && document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  /* Export preparation (§19): slice pipeline exposes per-card bitmaps. */
  Viewer.prototype.getCardCanvas = function (cardIdx, pxWidth) {
    var self = this;
    var cells = this.grid.rows * this.grid.cols;
    var page = this.coverPages + 1 + Math.floor(cardIdx / cells);
    var rc = cellForIndex(this.grid, cardIdx % cells, this.readingOrder);
    var frac = cellRect(this.grid, rc.row, rc.col);
    var wantPageW = (pxWidth || 1200) / frac.w;
    return this._renderPageCanvas(page, wantPageW).then(function (pc) {
      var c = document.createElement('canvas');
      c.width = Math.round(pc.width * frac.w);
      c.height = Math.round(pc.height * frac.h);
      c.getContext('2d').drawImage(pc,
        Math.round(pc.width * frac.x), Math.round(pc.height * frac.y), c.width, c.height,
        0, 0, c.width, c.height);
      return c;
    });
  };

  /* ---- structured data access (for hosts, apps, LLM agents) ---- */
  Viewer.prototype.getDeckData = function () { return this.deckData; };
  Viewer.prototype.getCardData = function (i) {
    return (this.deckData && this.deckData.cards && this.deckData.cards[i]) || null;
  };
  Viewer.prototype.getCurrentSlide = function () {
    var s = this.slides[this.index];
    if (!s) return null;
    return {
      index: this.index, kind: s.kind, page: s.page,
      cardIdx: s.cardIdx != null ? s.cardIdx : null,
      card: this._cardForSlide(s)
    };
  };
  // Curated deck-level context: QA, scores, known bugs (font artifacts), marketing.
  Viewer.prototype.getDeckMeta = function () {
    var d = this.deckData || {};
    return {
      deckTitle: d.deckTitle, deckType: d.deckType, seriesId: d.seriesId,
      genre: d.genre, bundle: d.bundle, exhibitionRole: d.exhibitionRole,
      pageCount: d.pageCount, cardCount: d.cardCount,
      gradeDistribution: d.gradeDistribution, overallScore: d.overallScore,
      viralScore: d.viralScore, qa: d.qa, coverScore: d.coverScore, coverQA: d.coverQA,
      verdict: d.verdict, blurb: d.blurb, notes: d.notes, todos: d.todos,
      topCards: d.topCards, worstCards: d.worstCards, hashtags: d.hashtags,
      exhibitions: d.exhibitions, channels: d.channels, marketingText: d.marketingText,
      fontArtifactCount: d.fontArtifactCount, RAF: d.RAF,
      layoutStatus: this.layoutStatus
    };
  };

  Viewer.prototype.destroy = function () {
    this.destroyed = true;
    clearTimeout(this.idleTimer);
    clearTimeout(this._gutT); clearTimeout(this._zoomT);
    if (this._loadingTask && this._loadingTask.destroy) { try { this._loadingTask.destroy(); } catch (e) { } }
    this._listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    this._listeners = [];
    this.pageCache.forEach(function (e) { e.canvas.width = e.canvas.height = 0; });
    this.pageCache = [];
    if (this.host && this.host.parentNode) this.host.parentNode.removeChild(this.host);
  };

  /* ------------------------------------------------- headless deck handle */
  // KayfabizarroViewer.loadDeck({source, deckData, grid?, cover?, readingOrder?})
  // Loads PDF + JSON without any UI. For integrations (gameplay sims, exports)
  // that need card bitmaps + structured card data from several decks at once.
  function loadDeck(opts) {
    opts = opts || {};
    var grid = {
      rows: (opts.grid && opts.grid.rows) || 2,
      cols: (opts.grid && opts.grid.cols) || 2,
      margin: (opts.grid && opts.grid.margin) || { x: 0, y: 0 },
      gap: (opts.grid && opts.grid.gap) || { x: 0, y: 0 },
      offset: (opts.grid && opts.grid.offset) || { x: 0, y: 0 }
    };
    var readingOrder = opts.readingOrder === 'col' ? 'col' : 'row';
    var deckDataP = Promise.resolve(null);
    if (opts.deckData) {
      deckDataP = opts.deckData.url
        ? fetch(opts.deckData.url).then(function (r) { if (!r.ok) throw new Error('deckData HTTP ' + r.status); return r.json(); }).catch(function () { return null; })
        : Promise.resolve(opts.deckData);
    }
    return loadPdfJs().then(function (pdfjs) {
      var srcP;
      var src = opts.source;
      if (typeof File !== 'undefined' && src instanceof File) srcP = src.arrayBuffer().then(function (b) { return { data: b }; });
      else if (src instanceof ArrayBuffer) srcP = Promise.resolve({ data: src });
      else if (src && src.buffer instanceof ArrayBuffer) srcP = Promise.resolve({ data: src });
      else if (src && src.url) srcP = fetchArrayBuffer(src.url).then(function (b) { return { data: b }; });
      else return Promise.reject(new Error('No PDF source given'));
      return srcP.then(function (params) {
        return Promise.all([
          pdfjs.getDocument(Object.assign({}, params)).promise,
          deckDataP
        ]);
      });
    }).then(function (res) {
      var pdf = res[0], data = res[1] || null;
      var cells = grid.rows * grid.cols;
      var hasCoverSignal = !!(data && (data.coverScore != null || data.coverQA));
      var cover = opts.cover === true ? 1 : opts.cover === false ? 0 : (hasCoverSignal ? 1 : 0);
      var cardCount = data ? (data.cardCount || (data.cards || []).length) : (pdf.numPages - cover) * cells;
      var expected = Math.ceil(cardCount / cells) + cover;
      var layoutStatus = data ? (expected === pdf.numPages ? 'ok' : 'needs-review') : 'no-data';
      var cache = [];
      function renderPage(pageNo, pxWidth) {
        var bucket = Math.min(6144, Math.ceil(pxWidth / 256) * 256);
        var key = pageNo + '@' + bucket;
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].key === key) return Promise.resolve(cache[i].canvas);
        }
        return pdf.getPage(pageNo).then(function (page) {
          var vp1 = page.getViewport({ scale: 1 });
          var scale = Math.min(bucket / vp1.width, Math.sqrt(22e6 / (vp1.width * vp1.height)));
          var vp = page.getViewport({ scale: scale });
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
          return page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport: vp }).promise.then(function () {
            cache.push({ key: key, canvas: canvas });
            while (cache.length > 3) { var old = cache.shift(); old.canvas.width = old.canvas.height = 0; }
            return canvas;
          });
        });
      }
      return {
        pdf: pdf,
        deckData: data,
        cards: (data && data.cards) || [],
        pageCount: pdf.numPages,
        cardCount: cardCount,
        coverPages: cover,
        layoutStatus: layoutStatus,
        getCardData: function (i) { return (data && data.cards && data.cards[i]) || null; },
        getCoverCanvas: function (pxWidth) { return cover ? renderPage(1, pxWidth || 1200) : Promise.resolve(null); },
        getCardCanvas: function (cardIdx, pxWidth) {
          var page = cover + 1 + Math.floor(cardIdx / cells);
          var idx = cardIdx % cells;
          var rc = readingOrder === 'col'
            ? { row: idx % grid.rows, col: Math.floor(idx / grid.rows) }
            : { row: Math.floor(idx / grid.cols), col: idx % grid.cols };
          var frac = cellRect(grid, rc.row, rc.col);
          return renderPage(page, (pxWidth || 1200) / frac.w).then(function (pc) {
            var c = document.createElement('canvas');
            c.width = Math.round(pc.width * frac.w);
            c.height = Math.round(pc.height * frac.h);
            c.getContext('2d').drawImage(pc,
              Math.round(pc.width * frac.x), Math.round(pc.height * frac.y), c.width, c.height,
              0, 0, c.width, c.height);
            return c;
          });
        },
        destroy: function () {
          try { pdf.destroy(); } catch (e) { }
          cache.forEach(function (e) { e.canvas.width = e.canvas.height = 0; });
          cache.length = 0;
        }
      };
    });
  }

  /* --------------------------------------------------------------- exports */
  window.KayfabizarroViewer = {
    mount: function (target, opts) { return new Viewer(target, opts); },
    loadDeck: loadDeck,
    version: '1.1.0'
  };
})();
