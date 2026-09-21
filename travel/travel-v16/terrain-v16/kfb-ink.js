// KFB Ink Outline — v1 (2026-07-15). Dependency-free 2D-canvas ink edges.
// Kanonisches Modul. Single Source of Truth für den KFB-Tusche-Kanten-Look.
// Nutzung: Cards, Buttons, Boxen, UI-Chips, HUD, 3D-Panel-Texturen.
// Doku/QA/Playground: "KFB Ink Outline Spec.dc.html".
//
// Load (Browser, klassisch):   <script src="./kfb-ink.js"></script>  → window.KFBInk
// Load (ES-Module / DC):       import { inkChip } from './kfb-ink.js'
//
// GOLDENE REGELN:
//  · Immer bei ECHTER Zielgröße zeichnen (× devicePixelRatio), nie ein Bild skalieren.
//  · Pro Element ein stabiler seed (aus id/index) → Kante bleibt über Reloads gleich.
//  · lineCap/lineJoin = 'round' (macht das Modul) → weiche Tusche-Ecken.
//  · Rand m ≥ halbe max. Strichbreite + jit, sonst Abschnitt am Elementrand.
//  · UI-Chips nach document.fonts.ready neu malen (offsetWidth/Height stimmt erst dann).

(function (root) {
  'use strict';

  // seeded PRNG → deterministische, non-repetitive Kante (kein Math.random!).
  function mulberry(seed) {
    let a = seed | 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Geschlossene wobbly Punktliste entlang eines Rechtecks.
  // jit = Positions-Jitter (klein ≈4 ruhig/inked · groß ≈9 ausgerissen/torn). Ecken bleiben fix.
  function inkPerimeter(x0, y0, x1, y1, seed, jit) {
    const rnd = mulberry(seed), pts = [];
    const edge = (ax, ay, bx, by) => {
      const len = Math.hypot(bx - ax, by - ay), n = Math.max(3, Math.round(len / 34));
      for (let i = 0; i < n; i++) {
        const t = i / n, jx = i ? (rnd() - 0.5) * 2 * jit : 0, jy = i ? (rnd() - 0.5) * 2 * jit : 0;
        pts.push([ax + (bx - ax) * t + jx, ay + (by - ay) * t + jy]);
      }
    };
    edge(x0, y0, x1, y0); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0);
    return pts;
  }

  // Der Strich. Zwei Modi:
  //  · uniform:true = 'inked'  → gleichmäßige Grundbreite baseW + geglätteter Wobble (Amp wob).
  //                              Gegenüberliegende Kanten gleich dick → konsistentes Gutter.
  //  · sonst        = 'torn'   → Licht-Verlauf topW→botW über die Höhe (oben dünn, unten dick).
  // opts: { uniform, baseW, wob, wseed, topW, botW, color }
  function drawInkOutline(g, pts, y0, hgt, o) {
    o = o || {};
    g.strokeStyle = o.color || '#191410'; g.lineCap = 'round'; g.lineJoin = 'round';
    const N = pts.length;
    if (o.uniform) {
      const base = o.baseW != null ? o.baseW : 9, amp = o.wob != null ? o.wob : 0.42;
      const wr = mulberry(((o.wseed || 1) | 0) ^ 0x9e37), raw = [];
      for (let i = 0; i < N; i++) raw.push(wr());
      const sm = (i) => (raw[(i - 1 + N) % N] + raw[i] + raw[(i + 1) % N]) / 3;
      for (let i = 0; i < N; i++) {
        const a = pts[i], b = pts[(i + 1) % N];
        g.lineWidth = Math.max(1.4, base * (1 + amp * (sm(i) - 0.5) * 2));
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      return;
    }
    const tw = o.topW != null ? o.topW : 2.5, bw = o.botW != null ? o.botW : 7;
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[(i + 1) % N];
      const my = Math.max(0, Math.min(1, ((a[1] + b[1]) / 2 - y0) / hgt));
      g.lineWidth = tw + (bw - tw) * my;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
  }

  // Fill + Outline in einem — für UI-Boxen. Bei Ist-Größe zeichnen!
  // opts wie drawInkOutline + { fill, jit }.
  function inkChip(g, x0, y0, x1, y1, seed, o) {
    o = o || {};
    const pts = inkPerimeter(x0, y0, x1, y1, seed, o.jit != null ? o.jit : 2.2);
    if (o.uniform && o.wseed == null) o.wseed = seed;
    if (o.fill) {
      g.fillStyle = o.fill; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.closePath(); g.fill();
    }
    drawInkOutline(g, pts, y0, y1 - y0, o);
  }

  // Convenience: DOM-Element als geinkten Chip hinterlegen (background-image bei Ist-Größe × dpr).
  // Nach document.fonts.ready erneut aufrufen. opts wie inkChip.
  function paintChipEl(el, seed, o) {
    if (!el) return;
    const w = el.offsetWidth, h = el.offsetHeight; if (!w || !h) return;
    o = o || {};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const c = document.createElement('canvas');
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bw = o.uniform ? (o.baseW != null ? o.baseW : 9) * 1.5 : (o.botW != null ? o.botW : 7);
    const m = bw + (o.jit != null ? o.jit : 2) + 1.5;
    inkChip(g, m, m, w - m, h - m, seed, o);
    el.style.backgroundImage = 'url(' + c.toDataURL() + ')';
    el.style.backgroundSize = '100% 100%';
    el.style.backgroundRepeat = 'no-repeat';
  }

  const API = { mulberry, inkPerimeter, drawInkOutline, inkChip, paintChipEl, INK: '#1f1a14', VERSION: '1' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.KFBInk = API;
})(typeof window !== 'undefined' ? window : this);
