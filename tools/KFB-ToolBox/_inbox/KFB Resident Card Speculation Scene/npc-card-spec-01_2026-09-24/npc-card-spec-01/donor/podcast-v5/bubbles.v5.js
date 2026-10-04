/* bubbles.v5.js — Blasen mit ECHTER KFB-Tusche.
   ═══════════════════════════════════════════════════════════════════════════════════════════════
   WAS HIER ANDERS IST ALS IN v4: die Tusche ist nicht mehr erfunden. Sie kommt aus dem
   kanonischen Modul `kfb-ink.js` (Single Source of Truth) nach `KFB_INK_OUTLINE_STYLE_v2.md`:

     · `mulberry(seed)`  — seeded, nie Math.random. Gleicher Seed → gleiche Kante.
     · Perimeter-Regel   — die Kante wird in Segmente von ~34 px zerlegt, Zwischenpunkte um ±jit
                           verschoben, ECKEN BLEIBEN FIX (Kanon §3.2).
     · `drawInkOutline`  — Stil `inked`: gleichmaessige Grundbreite `baseW` mit geglaettetem
                           Wobble (`baseW · (1 + wob·(smooth(i)−0.5)·2)`), lineJoin/Cap round,
                           Farbe `#1f1a14` (Kanon §3.3, §5).
     · 2D-CANVAS bei ECHTER Zielgroesse × dpr — kein skaliertes SVG (Kanon §7, »✕ Nie«).

   Meine Zutat ist nur die VERALLGEMEINERUNG: `inkPerimeter` laeuft im Kanon ein Rechteck ab, eine
   Blase ist keins. Also laeuft dieselbe Regel entlang einer beliebigen geschlossenen Punktliste,
   und »Ecke« heisst: wo der Pfad scharf abbiegt (Zipfelspitze, Schultern, Sternspitzen, Lappennaht).
   Die Geometrie selbst kommt unveraendert aus `bubbles.v4.js` — Form und Tusche sind getrennt.
*/

import { buildBubble as buildGeom, TYPES, DIRS, VOICE } from './bubbles.v4.js';

export const VERSION = 5;
export { TYPES, DIRS, VOICE };

/* Kanon §5: Tusche #1f1a14 · jit ≈4 ruhig · baseW in px · wob 0–1. */
/* GEORG 24.8.: die Tusche darf nicht so dick sein wie das Lettering. Comic-Logik: die Kontur ist
   10–20 % DUENNER als der Buchstabenstamm — sie haelt den Satz, sie ueberschreit ihn nicht.
   Zwei Folgen: die Breite haengt an der SCHRIFTGROESSE (Stamm × 0,85), nicht an einer festen
   Pixelzahl, und sie SKALIERT MIT (vorher war sie klein zu fett und gross zu duenn).
   Dazu Tapering (Kanon §5 `taper`): eine gezeichnete Linie ist nirgends gleich dick. */
export const INK = {
  color: '#1f1a14',
  stem: { loud: 0.105, mid: 0.125, soft: 0.115 },   // Stammbreite je Schriftgroesse
  ratio: 0.85,         // Tusche = 85 % des Stamms
  wob: 0.42,           // Wobble-Amplitude der STRICHBREITE (Kanon §5)
  taper: 0.34,         // langsames thick-thin ueber den Umfang
  jit: 2.2,            // Positions-Jitter der Kante
  seg: 34,             // Segmentlaenge in px (Kanon §3.2)
  paper: '#fbf7ec',
  shadow: { dx: 5, dy: 6, color: 'rgba(34,30,24,.16)' },
};

/** Federbreite aus der Schrift: Stamm × ratio, mal Zielskalierung. */
export function inkWidthFor(voice, size, k) {
  return Math.max(1.2, size * (k || 1) * (INK.stem[voice] || INK.stem.mid) * INK.ratio);
}

const K = () => (typeof window !== 'undefined' ? window.KFBInk : null);

/* ── Pfad → Punktliste ─────────────────────────────────────────────────────────────────────────
   Der fertige Pfad wird abgetastet, nichts verschoben: die Silhouette gehoert der Form. */
let _pool = null;
function samplePath(d, step) {
  if (typeof document === 'undefined') return null;
  if (!_pool) {
    _pool = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _pool.setAttribute('width', '0'); _pool.setAttribute('height', '0');
    _pool.style.cssText = 'position:absolute;left:-9999px;width:0;height:0';
    document.body.appendChild(_pool);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d); _pool.appendChild(p);
  let L = 0;
  try { L = p.getTotalLength(); } catch (e) { L = 0; }
  if (!L) { p.remove(); return null; }
  const n = Math.max(24, Math.min(2000, Math.round(L / Math.max(0.6, step))));
  const pts = [];
  for (let i = 0; i < n; i++) { const q = p.getPointAtLength((i / n) * L); pts.push([q.x, q.y]); }
  p.remove();
  return pts;
}

/** Wo biegt der Pfad scharf ab? Das sind die ECKEN, und Ecken bleiben fix (Kanon §3.2 / §7). */
function corners(pts, degLimit) {
  const n = pts.length, lim = Math.cos(((180 - (degLimit || 32)) * Math.PI) / 180);
  const flag = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
    const lu = Math.hypot(ux, uy) || 1, lv = Math.hypot(vx, vy) || 1;
    const dot = (ux / lu) * (vx / lv) + (uy / lu) * (vy / lv);
    if (dot < lim) flag[i] = true;                        // Richtungswechsel > degLimit
  }
  return flag;
}

/**
 * Die Perimeter-Regel des Kanons, entlang einer beliebigen geschlossenen Kontur.
 * Segmente ~`seg` px, Zwischenpunkte um ±`jit` verschoben, Ecken fix.
 */
export function inkPerimeterAlong(pts, seed, jit, seg) {
  const kfb = K();
  const rnd = kfb ? kfb.mulberry(seed) : Math.random;
  const flag = corners(pts, 32);
  const n = pts.length;
  /* Bogenlaenge und Eckenliste: zwischen zwei Ecken liegt eine KANTE, und jede Kante wird nach
     der Kanon-Regel in ~seg-Stuecke geteilt. Ohne Ecken ist die ganze Kontur eine Kante. */
  const idx = [];
  for (let i = 0; i < n; i++) if (flag[i]) idx.push(i);
  const out = [];
  const walk = (from, to) => {                            // von Ecke bis Ecke, Ecke selbst fix
    const seq = [];
    let i = from;
    while (true) { seq.push(pts[i]); if (i === to) break; i = (i + 1) % n; }
    let len = 0;
    for (let k = 1; k < seq.length; k++) len += Math.hypot(seq[k][0] - seq[k - 1][0], seq[k][1] - seq[k - 1][1]);
    const parts = Math.max(1, Math.round(len / seg));
    for (let k = 0; k < parts; k++) {
      const t = k / parts;
      // Punkt auf der Sequenz bei Anteil t der Bogenlaenge
      let want = len * t, j = 1, acc = 0, p = seq[0];
      while (j < seq.length) {
        const d = Math.hypot(seq[j][0] - seq[j - 1][0], seq[j][1] - seq[j - 1][1]);
        if (acc + d >= want) { const u = d ? (want - acc) / d : 0; p = [seq[j - 1][0] + (seq[j][0] - seq[j - 1][0]) * u, seq[j - 1][1] + (seq[j][1] - seq[j - 1][1]) * u]; break; }
        acc += d; j++;
      }
      if (j >= seq.length) p = seq[seq.length - 1];
      // k === 0 ist der Eckpunkt: KEIN Jitter (Kanon: erst die Ecke setzen, dann zittern)
      const jx = k ? (rnd() - 0.5) * 2 * jit : 0, jy = k ? (rnd() - 0.5) * 2 * jit : 0;
      out.push([p[0] + jx, p[1] + jy]);
    }
  };
  if (!idx.length) {
    let len = 0;
    for (let i = 0; i < n; i++) { const q = pts[(i + 1) % n]; len += Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]); }
    const parts = Math.max(4, Math.round(len / seg));
    for (let k = 0; k < parts; k++) {
      const p = pts[Math.round((k / parts) * n) % n];
      out.push([p[0] + (rnd() - 0.5) * 2 * jit, p[1] + (rnd() - 0.5) * 2 * jit]);
    }
    return out;
  }
  for (let e = 0; e < idx.length; e++) walk(idx[e], idx[(e + 1) % idx.length]);
  return out;
}

function circlePts(cx, cy, r, n) {
  const pts = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); }
  return pts;
}

/**
 * Eine Blase auf ein Canvas zeichnen — bei ECHTER Groesse × dpr (Kanon §7).
 * @param {HTMLCanvasElement} canvas
 * @param {object} o  type · dir · text · voice · seed · height (Zielhoehe der Blase in px)
 *                    · baseW · wob · jit · shadow (false) · ink · paper
 * @returns {object} die Geometrie plus die gezeichneten Kennzahlen
 */
export function drawBubble(canvas, o = {}) {
  const kfb = K();
  const b = buildGeom(o);
  const seed = o.seed == null ? 7 : o.seed;
  const H = o.height || 220;
  const k = H / b.box.h;                                   // Zielgroesse: die Blase, nicht der Kasten
  const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
  const W = Math.round(b.box.w * k);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const g = canvas.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  /* Ursprung in die Mitte, Skalierung EINMAL — danach wird in Zielpixeln gerechnet, damit
     Segmentlaenge, Jitter und Federbreite echte Pixel sind (Kanon §7, »groessen-ehrlich«). */
  const toPx = (p) => [(p[0] - b.box.x) * k, (p[1] - b.box.y) * k];

  const baseW = o.baseW == null ? inkWidthFor(o.voice || 'mid', b.font.size, k) : o.baseW;
  const wob = o.wob == null ? INK.wob : o.wob;
  const jit = o.jit == null ? INK.jit : o.jit;
  const ink = o.ink || INK.color;
  const paper = o.paper || INK.paper;

  /* Kontur in Zielpixeln abtasten (dichte Abtastung, damit Boegen rund bleiben), dann die
     Kanon-Regel anwenden. */
  const raw = samplePath(b.path, Math.max(0.8, 2.2 / k));
  if (!raw) return b;
  const outline = inkPerimeterAlong(raw.map(toPx), seed, jit, INK.seg);
  const trails = b.circles.map((c, i) => {
    const p = toPx([c.cx, c.cy]);
    return inkPerimeterAlong(circlePts(p[0], p[1], c.r * k, 40), seed * 17 + i * 7, jit * 0.55, INK.seg * 0.55);
  });

  const poly = (pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };

  // 1 · Schatten: dieselbe Kante, versetzt, grau, KEIN Blur (Kanon §8: harte, posterisierte Blobs)
  if (o.shadow !== false) {
    const s = INK.shadow;
    g.save(); g.translate(s.dx * (k > 1 ? 1 : k), s.dy * (k > 1 ? 1 : k)); g.fillStyle = s.color;
    poly(outline); g.fill();
    for (const t of trails) { poly(t); g.fill(); }
    g.restore();
  }

  // 2 · Papier
  g.fillStyle = paper;
  poly(outline); g.fill();
  for (const t of trails) { poly(t); g.fill(); }

  // 3 · Die Tusche — kanonisch, `inked`
  const opts = { uniform: true, baseW, wob, wseed: seed, color: ink };
  if (kfb) {
    kfb.drawInkOutline(g, outline, 0, H, opts);
    trails.forEach((t, i) => kfb.drawInkOutline(g, t, 0, H, Object.assign({}, opts, { baseW: baseW * 0.78, wseed: seed * 17 + i })));
  }

  // 4 · Der Wortlaut, in der Mitte der GRUNDFORM (nicht des Kastens)
  const v = b.font;
  const size = v.size * k;
  g.fillStyle = ink;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = (v.italic ? 'italic ' : '') + v.weight + ' ' + size.toFixed(2) + 'px ' + v.family;
  const cx = (0 - b.box.x) * k, cy = (0 - b.box.y) * k;
  const lines = b.text.split('\n');
  const lh = size * 1.2;
  lines.forEach((ln, i) => g.fillText(ln, cx, cy + (i - (lines.length - 1) / 2) * lh));

  return { ...b, drawn: { w: W, h: H, k: Math.round(k * 1000) / 1000, points: outline.length, baseW, jit, dpr } };
}

export default { VERSION, TYPES, DIRS, VOICE, INK, drawBubble, inkPerimeterAlong };
