/* KFB Bubble Shaper v2 — einhaengbare Fassung fuer das Pet Studio.  shp-v2.0
 *
 * Herkunft: `bubble-shaper.js` (der 80-%-Stand, den Georg abgenommen hat). Geometrie, Kurven und
 * Tusche sind UNVERAENDERT uebernommen — was hier neu ist, steht in zwei Absaetzen:
 *
 * 1. KEINE DOM-IDs. Das Original band sich an `getElementById('art')` und siebzehn Regler-IDs.
 *    Diese Fassung bekommt zwei Leinwaende und ein Objekt mit Werten; wer sie einhaengt, besitzt
 *    seine Oberflaeche selbst. Ein Werkzeug, das seine Bedienelemente kennt, kann nicht umziehen.
 *
 * 2. DIE MINDESTABSTANDS-REGEL (Georgs Befund 25.8.): »die eckige rect-Variante hat zwei Eckpunkte
 *    sehr nahe beieinander, so dass Abrundung oder Glitch entsteht«. Nachgemessen in
 *    `bubble-shapes.json`: rect traegt an jeder Ecke ZWEI Punkte im Abstand von 0,0296 der halben
 *    Breite (die Fase) — bei 400 px halber Breite also ~12 px. `bevelCorners()` faest dort noch
 *    einmal, und aus der Fase wird ein Knick mit Rundung. Regel jetzt: zwei Punkte, die naeher
 *    liegen als `mergePx`, WERDEN ZU EINEM (Mitte beider, Ecke wenn einer eine Ecke war) — beim
 *    Laden und beim Ziehen. Die Ecke kann nicht kaputtgehen, weil es dort nur noch einen Punkt gibt.
 *    Waehrend des Ziehens wird der bedrohte Nachbar rot geringt: man SIEHT es kommen.
 */

import { buildAnchors } from '../podcast-v2/bubbles.v4.js';
import { INK, inkWidthFor } from '../podcast-v2/bubbles.v5.js';
import { INK_PRESETS, inkHalfWidth, inkRibbon2D, mulberry as mb } from '../kfb-ink-canon.js';

export const version = 'shp-v2.0';

/* Die Blasen-Feder: BAND-Familie, abgeleitet vom Kanon-Preset `figure`. `hb` liegt zwischen Karte
   (0,0069) und Figur (0,0155), weil die Tusche DUENNER als das Lettering sein muss (Georg 24.8.). */
export const BUBBLE_INK = {
  ...INK_PRESETS.figure,
  label: 'Sprechblase (Band)', for: 'figure',
  step: 26, wob: 1.1, bow: 1.4 * 0.11,
  hb: 0.0110, taper: 0.50, edge: 1.70, minHalf: 1.4,
  color: '#1f1a14',
};
/* Vierter Eintrag je Stimme: KURSIV. `soft` (Fluestern) ist kursiv — Georgs Vorgabe 25.8. und
   dieselbe Regel wie in SPEC_blasen (Gedanke und Fluestern kursiv). */
/* Georgs Vorgabe 25.8.: `loud` ist die STANDARDGROESSE — laut wird es durch ALLCAPS und das fette
   Schnittbild, nicht durch Punkte. `scream` ist die einzige Stimme, die groesser wird (Bangers),
   deshalb steht sie in der Leiste LINKS: die Reihe laeuft von gross nach klein. */
export const VOICE_STYLE = {
  scream: ["'Bangers', 'Shantell Sans', sans-serif",     400, 36, false, true],
  loud:   ["'Fonteys PRO', 'Shantell Sans', sans-serif", 900, 22, false, true],
  mid:    ["'Shantell Sans', sans-serif",                600, 22, false, false],
  soft:   ["'Shantell Sans', sans-serif",                400, 17, true,  false],
  whisper:["'Shantell Sans', sans-serif",                400, 15, true,  false],
};
export const VOICES = ['scream', 'loud', 'mid', 'soft', 'whisper'];
/* Die Feder je Stimme: DASH ist eine Eigenschaft der STIMME, nicht ein zweiter Zeichner. Das Band
   bleibt dasselbe (gleiche Modulation, gleicher Saum) — es wird nur an Stellen ausgelassen. Deshalb
   gestrichelt und nicht gepunktet: es ist EINE Linie mit Luecken, keine Reihe Striche. */
export const VOICE_INK = {
  whisper: { dash: [0.46, 0.40], phase: 0.15 },   // Strich ≈ Luecke, in em der Stimmengroesse — nicht in Pixeln
};
/* Luft um den Satz je Stimme. Kursiv braucht seitlich mehr (der Schnitt haengt über), ALLCAPS
   braucht oben/unten weniger (keine Unterlängen) — gemessen an den echten Textmetriken, nicht
   geschaetzt. Die Zahlen sind Faktoren auf den Kanon-Innenabstand. */
export const VOICE_PAD = {
  scream:  { x: 1.00, y: 1.00 },
  loud:    { x: 1.00, y: 0.86 },
  mid:     { x: 1.00, y: 1.00 },
  soft:    { x: 1.34, y: 1.00 },
  whisper: { x: 1.40, y: 1.06 },
};
/** Der Wortlaut, wie die Stimme ihn traegt: ALLCAPS ist Teil der Stimme, nicht des Textes. */
export const textOf = (v, t) => ((VOICE_STYLE[v] || VOICE_STYLE.mid)[4] ? String(t).toUpperCase() : String(t));
export const fontOf = (v, size) => {
  const V = VOICE_STYLE[v] || VOICE_STYLE.mid;
  return (V[3] ? 'italic ' : '') + V[1] + ' ' + (size == null ? V[2] : size) + 'px ' + V[0];
};

/* ── Kurven: Ecke = Knick, Kurvenpunkt = weich (zentripetale Catmull-Rom) ─────────────────────── */
function edgeCurve(pts, i, steps) {
  const n = pts.length, at = (j) => pts[((j % n) + n) % n];
  const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
  if (p1.c && p2.c) return [[p1.x, p1.y], [p2.x, p2.y]];
  const a0 = p1.c ? p1 : p0, a3 = p2.c ? p2 : p3;
  const d = (a, b) => Math.pow(Math.hypot(b.x - a.x, b.y - a.y), 0.5) || 1e-4;
  const t0 = 0, t1 = t0 + d(a0, p1), t2c = t1 + d(p1, p2), t3c = t2c + d(p2, a3);
  const out = [];
  for (let s = 0; s <= steps; s++) {
    const t = t1 + ((t2c - t1) * s) / steps;
    const lerp = (pa, pb, ta, tb) => { const u = (t - ta) / (tb - ta); return { x: pa.x + (pb.x - pa.x) * u, y: pa.y + (pb.y - pa.y) * u }; };
    const A1 = lerp(a0, p1, t0, t1), A2 = lerp(p1, p2, t1, t2c), A3 = lerp(p2, a3, t2c, t3c);
    const B1 = lerp(A1, A2, t0, t2c), B2 = lerp(A2, A3, t1, t3c);
    const C = lerp(B1, B2, t1, t2c);
    out.push([C.x, C.y]);
  }
  return out;
}
function bevelCorners(pts, d) {
  const N = pts.length, out = [];
  for (let i = 0; i < N; i++) {
    const p = pts[i], a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
    let ix = p[0] - a[0], iy = p[1] - a[1]; const iL = Math.hypot(ix, iy) || 1; ix /= iL; iy /= iL;
    let ox = b[0] - p[0], oy = b[1] - p[1]; const oL = Math.hypot(ox, oy) || 1; ox /= oL; oy /= oL;
    const turn = Math.acos(Math.max(-1, Math.min(1, ix * ox + iy * oy)));
    if (turn < 0.6) { out.push(p); continue; }
    const k = Math.min(d, iL * 0.45, oL * 0.45);
    out.push([p[0] - ix * k, p[1] - iy * k]);
    out.push([p[0] + ox * k, p[1] + oy * k]);
  }
  return out;
}
function inkContour(pts, seed, p, jitGain) {
  const n = pts.length, raw = [], isC = [], fade = [];
  for (let i = 0; i < n; i++) {
    const curve = edgeCurve(pts, i, 22);
    let len = 0;
    for (let k = 1; k < curve.length; k++) len += Math.hypot(curve[k][0] - curve[k - 1][0], curve[k][1] - curve[k - 1][1]);
    const parts = Math.max(2, Math.round(len / p.step));
    const at = (t) => {
      let want = len * t, acc = 0;
      for (let k = 1; k < curve.length; k++) {
        const d = Math.hypot(curve[k][0] - curve[k - 1][0], curve[k][1] - curve[k - 1][1]);
        if (acc + d >= want) { const u = d ? (want - acc) / d : 0; return [curve[k - 1][0] + (curve[k][0] - curve[k - 1][0]) * u, curve[k - 1][1] + (curve[k][1] - curve[k - 1][1]) * u]; }
        acc += d;
      }
      return curve[curve.length - 1];
    };
    const margin = Math.min(len * p.cornerFade, p.cornerFadeMax);
    for (let k = 0; k < parts; k++) {
      const t = k / parts;
      raw.push(at(t)); isC.push(k === 0);
      const d = Math.min(t * len, (1 - t) * len);
      const u = margin > 0 ? Math.max(0, Math.min(1, d / margin)) : 1;
      fade.push(u * u * (3 - 2 * u));
    }
  }
  /* GERADE BLEIBT GERADE (25.8., Georg: »eine gerade Linie zwischen zwei Punkten macht so etwas
     nicht«). Die Bauchung `bow` lief als Sinus über den GANZEN Umlauf — also auch über Kanten, die
     zwischen zwei Ecken liegen und deshalb Geraden sind. Ergebnis: eine Delle mitten in der Kante.
     Eine gezeichnete Gerade zittert, sie beult nicht. Also: auf Geraden bleibt nur der feine
     Federwackler, die Bauchung wirkt allein auf Kurvensegmente. */
  const straight = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const isStraight = !!(a.c && b.c);
    const curve = edgeCurve(pts, i, 22);
    let len = 0;
    for (let k = 1; k < curve.length; k++) len += Math.hypot(curve[k][0] - curve[k - 1][0], curve[k][1] - curve[k - 1][1]);
    const parts = Math.max(2, Math.round(len / p.step));
    for (let k = 0; k < parts; k++) straight.push(isStraight);
  }
  const N = raw.length, cum = [0];
  for (let i = 1; i < N; i++) cum[i] = cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
  const total = cum[N - 1] + Math.hypot(raw[0][0] - raw[N - 1][0], raw[0][1] - raw[N - 1][1]) || 1;
  const rnd = mb(seed | 0);
  const A = p.wob * (jitGain == null ? 1 : jitGain), B = p.bow;
  const a1 = (rnd() * 3 + 2) * B, f1 = Math.floor(rnd() * 3 + 3), q1 = rnd() * 6.283;
  const a2 = (rnd() * 1.6 + 0.8) * B, f2 = Math.floor(rnd() * 4 + 6), q2 = rnd() * 6.283;
  const out = [];
  for (let i = 0; i < N; i++) {
    if (isC[i]) { out.push([raw[i][0], raw[i][1]]); continue; }
    const pp = raw[(i - 1 + N) % N], pn = raw[(i + 1) % N];
    const tx = pn[0] - pp[0], ty = pn[1] - pp[1], tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl, th = (cum[i] / total) * Math.PI * 2;
    const fd = fade[i];
    const bowGain = straight[i] ? 0 : 1;         // Gerade IST gerade — kein Bogen, nur der Federwackler
    const w = (a1 * Math.sin(f1 * th + q1) + a2 * Math.sin(f2 * th + q2)) * fd * bowGain;
    const tj = (rnd() - 0.5) * 1.4 * A * fd;
    out.push([raw[i][0] + nx * w + tj, raw[i][1] + ny * w + tj]);
  }
  return out;
}
function inside(pts, x, y) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
function innerBoxAt(pts, cx, cy, ar) {
  const fits = (w) => {
    const hw = w / 2, hh = w / ar / 2;
    const probe = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
    return probe.every(([sx, sy]) => inside(pts, cx + sx * hw, cy + sy * hh));
  };
  let lo = 0, hi = 4000;
  for (let i = 0; i < 22; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
  return { w: lo, h: lo / ar };
}
/* Der Satz sitzt im gemessenen PLATZ, nicht in der Mitte des umschliessenden Rechtecks — sonst
   zieht ein Zipfel die Mitte zu sich (Georgs Padding-Befund). */
function innerBox(pts, ar) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) { if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; }
  const NX = 33, NY = 23, cand = [];
  for (let ix = 1; ix < NX; ix++) for (let iy = 1; iy < NY; iy++) {
    const x = minX + ((maxX - minX) * ix) / NX, y = minY + ((maxY - minY) * iy) / NY;
    if (!inside(pts, x, y)) continue;
    const box = innerBoxAt(pts, x, y, ar);
    if (box.w > 1) cand.push({ x, y, w: box.w, box });
  }
  if (!cand.length) return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: 10, h: 10 / ar };
  let bw = 0; for (const q of cand) if (q.w > bw) bw = q.w;
  const good = cand.filter((q) => q.w >= bw * 0.97);
  let gx = 0, gy = 0;
  for (const q of good) { gx += q.x / good.length; gy += q.y / good.length; }
  const box = innerBoxAt(pts, gx, gy, ar);
  return Object.assign(box.w > 1 ? box : { w: bw, h: bw / ar }, { cx: gx, cy: gy });
}

/* ── DIE REGEL: zwei Punkte, die zu nah liegen, sind einer ───────────────────────────────────── */
/**
 * Laeuft den Ring ab und legt Laeufe von Punkten unter `min` px zusammen: Mitte beider, `c` wahr,
 * sobald EINER eine Ecke war (eine Ecke verliert man nicht durch Zusammenlegen). Rueckgabe:
 * { pts, merged } — `merged` ist die Zahl der eingesparten Punkte, die gemeldet wird.
 */
export function collapseNear(pts, min) {
  if (!pts || pts.length < 4 || !(min > 0)) return { pts: pts || [], merged: 0 };
  const out = []; let merged = 0; let run = [pts[0]];
  const flush = () => {
    if (!run.length) return;
    if (run.length === 1) { out.push(run[0]); return; }
    const cx = run.reduce((a, p) => a + p.x, 0) / run.length;
    const cy = run.reduce((a, p) => a + p.y, 0) / run.length;
    /* Der zusammengelegte Punkt ist eine ECKE. Zwei Anfasser, die aufeinander liegen, sitzen bei
       Georgs Formen genau an einer Fase — bliebe daraus ein Kurvenpunkt, waere die Rundung zurueck,
       gegen die die Regel gebaut ist. Der Knick ist die Absicht: `rect` soll eckig sein. */
    out.push({ x: cx, y: cy, c: true });
    merged += run.length - 1;
  };
  for (let i = 1; i < pts.length; i++) {
    const prev = run[run.length - 1], p = pts[i];
    if (Math.hypot(p.x - prev.x, p.y - prev.y) < min) run.push(p); else { flush(); run = [p]; }
  }
  flush();
  // Ring schliessen: erster und letzter koennen sich ebenfalls beruehren
  if (out.length > 3) {
    const a = out[0], b = out[out.length - 1];
    if (Math.hypot(a.x - b.x, a.y - b.y) < min) {
      out[0] = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, c: true };
      out.pop(); merged++;
    }
  }
  return { pts: out.length >= 3 ? out : pts, merged };
}

/* ── Der Shaper ──────────────────────────────────────────────────────────────────────────────── */
/**
 * @param {object} o art · ui (zwei Canvas-Elemente) · shapes (bubble-shapes.json) · onChange(info)
 */
/* ── Tusche fuer kleine Formen: Tipp-Punkte, Marken, Chips ───────────────────────────────────── */
/**
 * DIESELBE FEDER FUER DIE KLEINEN DINGE. Die Tipp-Punkte (\u00bbschreibt gerade \u2026\u00ab) waren vorher ein
 * SVG-Kreis mit `stroke` \u2014 also eine zweite Feder neben dem Kanon, und man sah es: harte Kante,
 * gleiche Breite ringsum, kein Saum. `inkBlob` legt stattdessen das BAND aus `kfb-ink-canon.js` um
 * einen beliebigen geschlossenen Punktzug, mit demselben Schatten unten rechts wie die Blase.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} pts  geschlossener Punktzug [[x,y], \u2026] in Leinwand-Koordinaten
 * @param {object} o   pen (px) \u00b7 seed \u00b7 color \u00b7 fill \u00b7 shadow (bool)
 */
export function inkBlob(ctx, pts, o) {
  const opt = o || {};
  const pen = opt.pen == null ? 2.6 : opt.pen;
  const pk = { ...BUBBLE_INK, step: Math.max(6, pen * 4), wob: BUBBLE_INK.wob * 0.35, bow: 0.04 };
  const bb = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
  for (const q of pts) { bb.x0 = Math.min(bb.x0, q[0]); bb.y0 = Math.min(bb.y0, q[1]); bb.x1 = Math.max(bb.x1, q[0]); bb.y1 = Math.max(bb.y1, q[1]); }
  const bw = bb.x1 - bb.x0, bh = bb.y1 - bb.y0;
  const shifted = pts.map((q) => [q[0] - bb.x0, q[1] - bb.y0]);
  const gain = pen / Math.max(0.01, Math.min(bw, bh) * BUBBLE_INK.hb * 2);
  const half = inkHalfWidth(shifted, bw, bh, opt.seed == null ? 3 : opt.seed, pk, gain);
  const path = (g, list) => { g.beginPath(); g.moveTo(list[0][0], list[0][1]); for (let i = 1; i < list.length; i++) g.lineTo(list[i][0], list[i][1]); g.closePath(); };
  if (opt.shadow !== false) { ctx.save(); ctx.translate(INK.shadow.dx * 0.6, INK.shadow.dy * 0.6); ctx.fillStyle = INK.shadow.color; path(ctx, pts); ctx.fill(); ctx.restore(); }
  if (opt.fill) { ctx.fillStyle = opt.fill; path(ctx, pts); ctx.fill(); }
  ctx.save(); ctx.translate(bb.x0, bb.y0);
  inkRibbon2D(ctx, shifted, half, opt.color || BUBBLE_INK.color);
  ctx.restore();
}
/** Kreis als Punktzug \u2014 damit die Feder ihn wie jede andere Silhouette behandeln kann. */
export function circlePts(cx, cy, r, n) {
  const m = n || 26, out = [];
  for (let i = 0; i < m; i++) { const a = (i / m) * Math.PI * 2; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
}

/* Die Zeichenwerte des Hauses. EINE Quelle — der Shaper startet damit, die Buehne liest sie, der
   Vertrag darf sie ueberschreiben. Vorher standen im Shaper 26/2,2/0,15 und in der Buehne 34/0,7/0,05:
   ein Zeichner, zwei Einstellungen, zwei Looks (Georg 25.8.: »wofuer bauen wir den Bubbles-Tab«).
   `step` ist eine LAENGE in Pixeln und muss deshalb mit der Blasengroesse mitskalieren, sonst sitzen
   auf der kleinen Blase weniger Wackelpunkte auf derselben Kante. */
/** Die Federbreite einer Blase — EINE Formel fuer Shaper und Buehne. Sie haengt an der SCHRIFT,
 *  nicht an der Leinwand (F18). */
export function inkPenFor(voice, fontPx) {
  const V = VOICE_STYLE[voice] || VOICE_STYLE.mid;
  return inkWidthFor(voice, V[2], (fontPx || V[2]) / V[2]);
}
export const BUBBLE_DEF = { step: 26, jit: 2.2, bow: 0.15, seed: 7, mergePx: 14, refFont: 22 };

/* ── EINE FORM FUER ALLE ─────────────────────────────────────────────────────────────── */
/**
 * Georgs Befund (25.8.): »die Blase hat keine Ähnlichkeit mit der rect-Vorgabe«. Richtig — die
 * Buehne baute ihre Punkte SELBST (ein Rechteck mit angesetztem Zipfel), waehrend im Shaper und im
 * Vertrag die abgenommene Form aus `bubble-shapes.json` lag. Ein Zeichner, zwei Formen: dann ist die
 * Vorschau eine Behauptung.
 *
 * `shapeForBox` nimmt die NORMIERTE Form (aus der Bank oder aus `voice.bubble.pts`) und skaliert sie
 * so, dass ihr gemessener INNENRAUM den Satzblock traegt. Zurueck kommen die Punkte in Pixeln UND
 * der Innenraum — damit der Aufrufer den Text dort hinsetzt, wo wirklich Platz ist, statt in die
 * Mitte des umschliessenden Rechtecks (das ist F8).
 *
 * @param {object} shape  { pts:[[x,y,c]], aspect }  x,y normiert in [-1,1]
 * @param {number} wantW  Breite des Satzblocks inkl. Innenabstand
 * @param {number} wantH  Hoehe des Satzblocks inkl. Innenabstand
 * @param {object} o      tail (-1 links · 0 mittig · +1 rechts) · mergeNorm
 */
export function shapeForBox(shape, wantW, wantH, o) {
  const opt = o || {};
  const ar = Math.max(0.25, wantW / Math.max(1, wantH));
  /* DIE MINDESTABSTANDS-REGEL ARBEITET IM NORMIERTEN RAUM (25.8., Georgs Befund: der Zipfel fehlte).
     `mergePx` ist eine ABSOLUTE Pixelzahl — richtig fuer den Shaper, wo von Hand gezogen wird, aber
     toedlich fuer eine kleine Blase: bei ~100 px Formbreite liegen die Zipfel-Punkte naeher als 14 px
     zusammen, also legte die Regel sie zu EINEM Punkt zusammen und der Zipfel war weg. Eine Regel, die
     an Bildschirmpixeln haengt, gilt nur in einer Groesse.
     Im normierten Raum ist der Abstand der rect-Fase 0,0296 — eine Schwelle von 0,06 legt sie
     zusammen und laesst den Zipfel (dessen Punkte weit auseinander liegen) in JEDER Groesse stehen.
     Zusammengelegt wird also EINMAL, vor dem Skalieren. */
  const NRM = opt.mergeNorm == null ? 0.06 : opt.mergeNorm;
  const asp = shape.aspect || 1;
  /* BEIDE RICHTUNGEN (25.8., Georg: »beide Richtungen mitdenken«). Die Blase weicht dem Gesicht auch
     nach unten aus — dann muss der Zipfel nach OBEN zeigen, sonst zeigt er ins Leere. Gespiegelt wird
     die y-Achse; der Umlaufsinn dreht mit, damit die Lichtseite (unten/rechts satter) nicht kippt. */
  let base = shape.pts.map(([x, y, c]) => ({ x: x * asp, y: (opt.flipY ? -y : y), c: !!c }));
  if (opt.flipY) base = base.reverse();
  base = collapseNear(base, NRM).pts;
  /* DER ZIPFEL GLEITET, ER SPIEGELT NICHT (25.8., Georg: »Pfeil springt hin und her« · »ist nicht
     zentriert«). Vorher wurde die ganze Form gespiegelt, sobald der Kopf die Mitte wechselte — ein
     Umschalten, das bei jeder kleinen Bewegung kippt und den Zipfel nie dazwischen stehen laesst.
     Richtig ist eine STETIGE Groesse: der Zipfel wandert an der Unterkante zum Ziel. `tail` = -1 links,
     0 mittig, +1 rechts. Ohne Ziel steht er mittig — das ist der Standard, nicht die Bank-Lage. */

  /* EINE DIVISION STATT EINER SUCHE (25.8.).
     `innerBox` sucht das groesste Rechteck mit FESTEM Seitenverhaeltnis — damit ist `fx` rechnerisch
     immer gleich `fy`, und getrennte Faktoren waren wirkungslos. Ausserdem rutscht die Suche durch
     den konkaven Zipfel (gemessen: Innenraum 190 px breit in einer 187 px breiten Form).
     Sauber ist die Schablone: der KOERPER der Form (alles ausser dem Zipfel) traegt den Satz. Seine
     Kanten sind bekannt, also ist die Groesse eine Division — in x und y unabhaengig:
        kx = wantW / (Koerperbreite_normiert  x nutzbar)
        ky = wantH / (Koerperhoehe_normiert   x nutzbar)
     `nutzbar` ist der Anteil der Koerperflaeche, der Satz tragen kann: bei einem Rechteck fast alles,
     bei einem Oval deutlich weniger. Er kommt aus der Form selbst (Anteil der Punkte auf den
     Aussenkanten), nicht aus einer Konstante. */
  const sgnY = opt.flipY ? -1 : 1;
  /* EINE LUECKE IST NUR EIN ZIPFEL, WENN SIE EINE MINDERHEIT ABTRENNT (Befund 25.8., `free`).
     Die Suche nahm die erste y-Luecke ueber 0,12 als Zipfelbasis. Bei `free` (Erzaehlerkasten, VIER
     Punkte, kein Zipfel) sind die sortierten y-Werte [1 · 0,944 · -0,958 · -1]; die Luecke zwischen
     0,944 und -0,958 ist 1,90 — also galten die zwei OBEREN Punkte als ganzer Koerper, Koerperhoehe
     0,042, und `ky` sprang auf ~1013: eine Blase von 78 x 1922 px auf einer 540 px hohen Buehne.
     Ein Zipfel sind zwei bis drei Punkte von elf, nicht zwei von vier — und er sitzt UNTEN. Also
     zwei Bedingungen zur Luecke: die Gruppe darunter ist hoechstens ein Drittel der Punkte, und sie
     liegt in der unteren Haelfte der Form. Trifft nichts zu, ist die ganze Form der Koerper. */
  const yTail = (() => {
    const ys = base.map((p) => p.y * sgnY).slice().sort((a2, b2) => b2 - a2);
    const yLo = ys[ys.length - 1], yHi = ys[0], span = Math.max(1e-6, yHi - yLo);
    for (let i = 0; i < Math.min(5, ys.length - 1); i++) {
      if (ys[i] - ys[i + 1] <= 0.12) continue;
      const below = i + 1;                                  // so viele Punkte liegen unter der Luecke
      if (below > Math.max(1, Math.floor(base.length / 3))) continue;
      if ((ys[i] - yLo) / span < 0.5) continue;              // die Luecke sitzt nicht unten
      return ys[i + 1];
    }
    return yHi;
  })();
  const body = base.filter((p) => p.y * sgnY <= yTail + 1e-6);
  const bx0 = Math.min.apply(null, body.map((p) => p.x)), bx1 = Math.max.apply(null, body.map((p) => p.x));
  const by0 = Math.min.apply(null, body.map((p) => p.y)), by1 = Math.max.apply(null, body.map((p) => p.y));
  const bw = Math.max(1e-3, bx1 - bx0), bh = Math.max(1e-3, by1 - by0);
  /* Wie eckig ist der Koerper? Anteil der Punkte, die auf einer Aussenkante sitzen (±2 %). Ein
     Rechteck kommt auf ~1, ein Oval auf ~0,2 — daraus der nutzbare Anteil zwischen 0,70 und 0,94. */
  const onEdge = body.filter((p) => Math.abs(p.x - bx0) < bw * 0.02 || Math.abs(p.x - bx1) < bw * 0.02
                                 || Math.abs(p.y - by0) < bh * 0.02 || Math.abs(p.y - by1) < bh * 0.02).length;
  const boxy = onEdge / Math.max(1, body.length);
  const useful = 0.70 + 0.24 * Math.max(0, Math.min(1, boxy));
  const kx = wantW / (bw * useful), ky = wantH / (bh * useful);
  const pts = base.map((p) => ({ x: p.x * kx, y: p.y * ky, c: p.c }));
  const inner = { cx: ((bx0 + bx1) / 2) * kx, cy: ((by0 + by1) / 2) * ky, w: bw * useful * kx, h: bh * useful * ky };
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const p of pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
  /* Der Zipfel wird HIER gesetzt, nicht im normierten Raum: dort waechst die Formbreite mit der
     Verschiebung mit (der Zipfel ragt seitlich heraus), und der Anteil bleibt fast gleich — gemessen
     42,6 % bei `tail 0` statt 50 %. Im Pixelraum ist die Breite bekannt, also ist die Lage eine
     Ansage: 50 % in der Mitte, ±35 % an den Enden. */
  let out = pts.map((p) => ({ x: p.x - minX, y: p.y - minY, c: p.c }));
  {
    const W = maxX - minX, H = maxY - minY;
    /* DIE ZIPFELGRUPPE SAUBER TRENNEN. Vorher: alle Punkte mit `y > bodyY - 0,5` — das erfasste auch
       die unteren Rechteck-Ecken, weil sie auf derselben Hoehe wie die Zipfelbasis liegen. Ergebnis:
       die rechte untere Ecke wanderte mit und beulte aus (Georg 25.8.: »siehst du den Zipfel nicht,
       rechts unten?«).
       Richtig: die grosse LUECKE in den sortierten y-Werten finden. Zwischen der Unterkante des
       Koerpers und der Zipfelspitze liegt ein Sprung; oberhalb davon endet der Koerper. Verschoben
       wird nur, was strikt darunter liegt — die Basispunkte bleiben an der Kante, der Zipfel wird
       schraeg gezogen wie eine gezeichnete Fahne. */
    const yv = (p) => (opt.flipY ? (H - p.y) : p.y);
    const ys = out.map(yv).slice().sort((a, b) => b - a);
    let bodyY = ys[ys.length - 1];
    /* Dieselbe Bedingung wie oben, in Pixeln: eine Luecke trennt nur dann einen Zipfel ab, wenn
       darunter eine Minderheit der Punkte liegt. Sonst wandert bei zipfellosen Formen die halbe
       Silhouette als »Zipfel« zur Seite. */
    let hasTail = false;
    for (let i = 0; i < Math.min(5, ys.length - 1); i++) {
      if (ys[i] - ys[i + 1] <= H * 0.05) continue;
      if (i + 1 > Math.max(1, Math.floor(out.length / 3))) continue;
      bodyY = ys[i + 1]; hasTail = true; break;
    }
    /* DER RUECKFALLWERT IST EINE ENTSCHEIDUNG, KEINE RESTMENGE. Qualifiziert keine Luecke, heisst das
       »kein Zipfel« — also bodyY auf das MAXIMUM, damit `deep` leer bleibt. Vorher stand hier das
       MINIMUM, also »alles ist Zipfel«: bei `free` (vier Punkte, keine Luecke) galten DREI von vier
       Punkten als Zipfelgruppe und wurden seitlich geschoben. Gemessen: Ring x von -10,7 bis 53,8
       statt 0 bis 64,6, waehrend `inner` beim ungeschobenen Mittelpunkt zurueckblieb — der Satz sass
       10,5 px rechts der Formmitte und das Ausrufezeichen kreuzte die Kontur. Die Minderheiten-Regel
       lag nur auf der SUCHE, nicht auf ihrem Rueckfall. */
    if (!hasTail) bodyY = ys[0];
    const deep = [];
    out.forEach((p, i) => { if (yv(p) > bodyY + H * 0.02) deep.push(i); });
    /* Die BASIS wandert mit der Spitze. Sonst bleibt der Fuss stehen und der Zipfel wird schraeg
       gezogen — gemessen: Gruppe nur 1 Punkt (die Spitze), Basis bei 25,6/37,6 %. Ein Zipfel ist
       eine Fahne aus Fuss und Spitze; sie gleitet als GANZES. Die Rechteck-Ecken bleiben, weil sie
       die aeussersten Punkte sind: sie tragen die Silhouette. */
    if (deep.length) {
      const N = out.length;
      const xs = out.map((p) => p.x);
      const xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs);
      const corner = (i) => (out[i].x - xMin < W * 0.04) || (xMax - out[i].x < W * 0.04);
      const add = new Set(deep);
      for (const i of deep) for (const j of [(i - 1 + N) % N, (i + 1) % N]) {
        if (!add.has(j) && yv(out[j]) > bodyY - H * 0.04 && !corner(j)) add.add(j);
      }
      deep.length = 0; for (const i of add) deep.push(i);
    }
    if (deep.length && W > 1) {
      const cxT = deep.reduce((a, i) => a + out[i].x, 0) / deep.length;
      const t = opt.tail == null ? 0 : Math.max(-1, Math.min(1, opt.tail));
      const dx = (0.5 + t * 0.35) * W - cxT;
      for (const i of deep) out[i] = { ...out[i], x: out[i].x + dx };
    }
  }
  return {
    pts: out,
    w: maxX - minX, h: maxY - minY,
    inner: { cx: inner.cx - minX, cy: inner.cy - minY, w: inner.w, h: inner.h },
    boxy: +boxy.toFixed(2), useful: +useful.toFixed(3),
  };
}
/** Die Kontur eines Anfasser-Rings — dieselbe Kurve, die der Zeichner benutzt. */
export function contourOf(pts) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) { const seg = edgeCurve(pts, i, 14); for (let k = 0; k < seg.length - 1; k++) out.push([seg[k][0], seg[k][1]]); }
  return out;
}

/* ── DER EINE BLASEN-ZEICHNER ────────────────────────────────────────────────────────────────────
 * Papier, Saum, Band, Kantenfase und die geschnittenen Luecken — alles an einer Stelle. Vorher lag
 * das hier drin und ein ZWEITER Zeichner im Studio malte die Buehnen-Blase als SVG-Pfad mit
 * `stroke-width` und `stroke-dasharray`. Zwei Zeichner heisst: zwei Federn, und man sieht es
 * (Georg 25.8.: »das ist deadline, nicht KFB ink«). Die Buehnen-Blase ist ein Overlay und damit in
 * ALLEN Tabs sichtbar — also war der falsche Zeichner der sichtbarere.
 *
 * @param {CanvasRenderingContext2D} ctx  Ziel
 * @param {Array} pts   Anfasser [{x,y,c}], geschlossener Ring
 * @param {object} o    pen · seed · step · jit · bow · voice · k (Schriftskalierung) · paper · noPaper
 * @returns {object}    { inked, bb, dashInfo }
 */
function polyPath(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }

export function paintBubble(ctx, pts, o) {
  const opt = o || {};
  const P = { baseW: opt.pen == null ? 2.4 : opt.pen, seed: opt.seed == null ? 7 : opt.seed,
              seg: opt.step == null ? 26 : opt.step, jit: opt.jit == null ? 2.2 : opt.jit,
              bow: opt.bow == null ? 0.15 : opt.bow };
  const S = { pts, voice: opt.voice || 'mid', k: opt.k == null ? 1 : opt.k, dashInfo: null };
  const ga = ctx;
  const INKP = opt.paper ? { ...INK, paper: opt.paper } : INK;
  const pk = { ...BUBBLE_INK, step: P.seg, wob: (P.jit / 2.2) * BUBBLE_INK.wob, bow: P.bow };
  const inked = bevelCorners(inkContour(S.pts, P.seed, pk), P.baseW * 0.9);
  const poly = polyPath;
  ga.save(); ga.translate(INK.shadow.dx, INK.shadow.dy); ga.fillStyle = INK.shadow.color; poly(ga, inked); ga.fill(); ga.restore();
  ga.fillStyle = INKP.paper; poly(ga, inked); ga.fill();
  const bb = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
  for (const q of inked) { bb.x0 = Math.min(bb.x0, q[0]); bb.y0 = Math.min(bb.y0, q[1]); bb.x1 = Math.max(bb.x1, q[0]); bb.y1 = Math.max(bb.y1, q[1]); }
  const bw = bb.x1 - bb.x0, bh = bb.y1 - bb.y0;
  const gain = P.baseW / Math.max(0.01, Math.min(bw, bh) * BUBBLE_INK.hb * 2);
  const shifted = inked.map((q) => [q[0] - bb.x0, q[1] - bb.y0]);
  const half0 = inkHalfWidth(shifted, bw, bh, P.seed, pk, gain);
  const NS = shifted.length;
  let area2 = 0;
  for (let i = 0; i < NS; i++) { const a = shifted[i], b = shifted[(i + 1) % NS]; area2 += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area2 > 0 ? 1 : -1;
  const LX = 0.62, LY = 0.78, ORIENT = 0.34;
  const arc = [0];
  for (let i = 1; i < NS; i++) arc[i] = arc[i - 1] + Math.hypot(shifted[i][0] - shifted[i - 1][0], shifted[i][1] - shifted[i - 1][1]);
  const per = arc[NS - 1] + Math.hypot(shifted[0][0] - shifted[NS - 1][0], shifted[0][1] - shifted[NS - 1][1]) || 1;
  const tips = [];
  for (let i = 0; i < NS; i++) {
    const a = shifted[(i - 2 + NS) % NS], c0 = shifted[i], b = shifted[(i + 2) % NS];
    const v1x = c0[0] - a[0], v1y = c0[1] - a[1], v2x = b[0] - c0[0], v2y = b[1] - c0[1];
    const l1 = Math.hypot(v1x, v1y) || 1, l2 = Math.hypot(v2x, v2y) || 1;
    const turn = Math.acos(Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (l1 * l2)))) * 180 / Math.PI;
    if (turn > 95 && (v1x * v2y - v1y * v2x) * sgn < 0) tips.push(i);
  }
  const tArc = Math.max(10, P.baseW * 5.2);
  const tipFade = (i) => {
    if (!tips.length) return 1;
    let best = Infinity;
    for (const t of tips) { const d = Math.abs(arc[i] - arc[t]); best = Math.min(best, Math.min(d, per - d)); }
    return 0.30 + 0.70 * Math.min(1, best / tArc);
  };
  const half = (i) => {
    const a = shifted[(i - 1 + NS) % NS], b = shifted[(i + 1) % NS];
    const tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1;
    const nx = (ty / L) * sgn, ny = (-tx / L) * sgn;
    return half0(i) * (1 + ORIENT * (nx * LX + ny * LY)) * tipFade(i);
  };
  half.hb = half0.hb; half.min = half0.min * (1 - ORIENT) * 0.30;
  /* DIE UNTERBROCHENE LINIE. Drei Anlaeufe, zwei Irrtuemer — beide von Georg benannt (25.8.):
     (1) Luecken mit `destination-out` DIREKT in die Leinwand radiert: damit war auch das PAPIER
         weg, man sah den Hintergrund durch die Blase. Falsch war nicht das Radieren, sondern die
         LAGE, in der radiert wurde.
     (2) Feder an den Luecken ausduennen lassen (»sie hebt ab«): falsches mentales Modell. Georgs
         Korrektur: »die Linie ist durchgehend, die Feder wird NICHT abgesetzt vom Profi-Zeichner,
         man loescht/cuttet die Luecken.« Eine gezeichnete Kontur ist EIN Zug; das Gestrichelte
         entsteht durch Wegnehmen, nicht durch Zoegern. Deshalb hat ein Strichende auch die volle
         Bandbreite und eine harte Kante.

     Also: die Tusche kommt in eine EIGENE Lage, dort wird gecuttet, und die Lage wird als Ganzes
     aufs Papier gesetzt. Volle Federbreite bis an den Schnitt, harte Kanten, Papier unberuehrt. */
  const vi = VOICE_INK[S.voice];
  if (!vi || !vi.dash) {
    ga.save(); ga.translate(bb.x0, bb.y0); inkRibbon2D(ga, shifted, half, BUBBLE_INK.color); ga.restore();
    S.dashInfo = null;
  } else {
    const em = VOICE_STYLE[S.voice][2] * S.k;
    const on = vi.dash[0] * em, off = vi.dash[1] * em, cyc = on + off;
    const pad2 = Math.ceil(P.baseW * 3 + 6);
    const lay = document.createElement('canvas');
    lay.width = Math.max(1, Math.ceil(bw + pad2 * 2)); lay.height = Math.max(1, Math.ceil(bh + pad2 * 2));
    const lg = lay.getContext('2d');
    lg.translate(pad2, pad2);
    inkRibbon2D(lg, shifted, half, BUBBLE_INK.color);
    /* AUF BOGENLAENGE schneiden, nicht auf Stuetzpunkte. Ein Segment ist `step` lang (26 px), das
       Strichmuster nur ~15 px — wer segmentweise cuttet, bekommt entweder alles oder nichts und
       damit ein grobes, unregelmaessiges Muster. Also einen Punkt AN der Bogenlaenge auslesen und
       genau die Luecke wegnehmen. */
    const at = (t) => {
      const u = ((t % per) + per) % per;
      let lo = 0, hi = NS;
      while (lo + 1 < hi) { const m = (lo + hi) >> 1; if (arc[m] <= u) lo = m; else hi = m; }
      const a0 = arc[lo], a1 = (lo + 1 >= NS) ? per : arc[lo + 1];
      const p0 = shifted[lo], p1 = shifted[(lo + 1) % NS];
      const k = (a1 - a0) ? (u - a0) / (a1 - a0) : 0;
      return { x: p0[0] + (p1[0] - p0[0]) * k, y: p0[1] + (p1[1] - p0[1]) * k, i: lo };
    };
    lg.globalCompositeOperation = 'destination-out';
    lg.lineCap = 'butt'; lg.lineJoin = 'round';
    let cuts = 0;
    const start = (vi.phase || 0) * cyc;
    for (let t = start + on; t < start + per; t += cyc) {
      const t0 = t, t1 = t + off;
      const steps = Math.max(2, Math.ceil(off / 3));
      const pts2 = [];
      for (let k = 0; k <= steps; k++) pts2.push(at(t0 + (off * k) / steps));
      let wmax = 0;
      for (const q of pts2) wmax = Math.max(wmax, half(q.i));
      lg.lineWidth = wmax * 2 + P.baseW * 1.1 + 2.5;
      lg.beginPath(); lg.moveTo(pts2[0].x, pts2[0].y);
      for (let k = 1; k < pts2.length; k++) lg.lineTo(pts2[k].x, pts2[k].y);
      lg.stroke();
      cuts++;
    }
    lg.globalCompositeOperation = 'source-over';
    ga.drawImage(lay, bb.x0 - pad2, bb.y0 - pad2);
    S.dashInfo = { on: +on.toFixed(1), off: +off.toFixed(1), cuts, segs: NS };
  }


  return { inked, bb, dashInfo: S.dashInfo };
}

export function createShaper(o) {
  const art = o.art, ui = o.ui;
  const ga = art.getContext('2d'), gu = ui.getContext('2d');
  const SHAPES = o.shapes || null;
  const S = { pts: [], sel: -1, drag: -1, handles: true, showPts: false, voice: 'mid', k: 1, penManual: false, warn: -1, merged: 0, fit: null, grow: true, autogrow: null, name: null };
  const P = { baseW: 4.6, bow: BUBBLE_DEF.bow, jit: BUBBLE_DEF.jit, seg: BUBBLE_DEF.step, seed: BUBBLE_DEF.seed, text: 'Lorem ipsum', mergePx: BUBBLE_DEF.mergePx, padX: 1.0, padY: 1.0 };
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const UNDO = [];
  const info = () => ({ pts: S.pts.length, corners: S.pts.filter((p) => p.c).length, merged: S.merged, fit: S.fit, voice: S.voice, pen: P.baseW, mergePx: P.mergePx, grow: S.grow, autogrow: S.autogrow, json: toJSON() });
  const emit = () => { if (o.onChange) o.onChange(info()); };
  const pushUndo = () => { UNDO.push(S.pts.map((p) => ({ ...p }))); if (UNDO.length > 40) UNDO.shift(); };

  function apply(min) {
    const r = collapseNear(S.pts, min == null ? P.mergePx : min);
    S.pts = r.pts; S.merged = r.merged; return r.merged;
  }
  function fromShapes(name) {
    const sh = SHAPES && SHAPES.shapes && SHAPES.shapes.find((s) => s.name === name);
    if (!sh) return false;
    S.name = name;
    const W = art.clientWidth, H = art.clientHeight;
    if (W < 50 || H < 50) { S.pending = name; return true; }   // versteckter Tab: nichts laden, was in eine 0-Buehne faellt
    const hw = Math.min(W * 0.36, (H * 0.62 * sh.aspect) / 2), hh = hw / sh.aspect;
    S.pts = sh.pts.map(([x, y, c]) => ({ x: W / 2 + x * hw, y: H / 2 + y * hh, c: !!c }));
    apply();                     // DIE REGEL greift schon beim Laden — dort sitzt der rect-Befund
    draw(); return true;
  }
  function fit() {
    const W = art.clientWidth, H = art.clientHeight;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of S.pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    const k = Math.min((W * 0.56) / (maxX - minX || 1), (H * 0.56) / (maxY - minY || 1));
    S.k = k;
    if (!S.penManual) P.baseW = +inkWidthFor(S.voice, (VOICE_STYLE[S.voice] || VOICE_STYLE.mid)[2], k).toFixed(2);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    S.pts = S.pts.map((p) => ({ x: (p.x - cx) * k + W / 2, y: (p.y - cy) * k + H / 2, c: p.c }));
    apply(); draw();
  }
  function loadPreset(name) {
    /* Eine Buehne von 0 px ist keine Buehne: die Form wuerde auf einen Punkt fallen und die
       Mindestabstands-Regel sie zu einem einzigen Anfasser zusammenlegen. Also merken und beim
       ersten Bild mit Groesse nachholen (`redraw`). */
    if (art.clientWidth < 50 || art.clientHeight < 50) { S.pending = name; return; }
    S.pending = null;
    S.name = name;   // die Herkunft der Form bleibt bekannt — nach dem Zusammenlegen ist sie an der Punktzahl nicht mehr ablesbar
    if (S.pts.length) pushUndo();
    if (fromShapes(name)) { if (S.grow) growToText(); return; }
    if (name === 'box') {
      const w = 300, h = 150;
      S.pts = [{ x: -w / 2, y: -h / 2, c: true }, { x: w / 2, y: -h / 2, c: true }, { x: w / 2, y: h / 2, c: true }, { x: -w / 2, y: h / 2, c: true }];
      fit(); if (S.grow) growToText(); return;
    }
    const A = buildAnchors({ type: name, dir: 'down-left', text: P.text, voice: S.voice, seed: P.seed });
    S.pts = A.pts.map((p) => ({ x: p.x, y: p.y, c: p.c }));
    fit();
    if (S.grow) growToText();
  }
  const shapeContour = () => contourOf(S.pts);
  function toJSON() {
    if (S.pts.length < 3) return '{}';
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of S.pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, rx = (maxX - minX) / 2 || 1, ry = (maxY - minY) / 2 || 1;
    return JSON.stringify({ name: 'custom', aspect: +(rx / ry).toFixed(3), pts: S.pts.map((p) => [+((p.x - cx) / rx).toFixed(4), +((p.y - cy) / ry).toFixed(4), p.c ? 1 : 0]) });
  }

  function draw() {
    const W = art.clientWidth, H = art.clientHeight;
    if (!W || !H) return;
    for (const c of [art, ui]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    ga.setTransform(dpr, 0, 0, dpr, 0, 0); gu.setTransform(dpr, 0, 0, dpr, 0, 0);
    ga.clearRect(0, 0, W, H); gu.clearRect(0, 0, W, H);
    if (S.pts.length < 3) return;
    const poly = polyPath;
    const _b = paintBubble(ga, S.pts, { pen: P.baseW, seed: P.seed, step: P.seg, jit: P.jit, bow: P.bow, voice: S.voice, k: S.k });
    const inked = _b.inked; S.dashInfo = _b.dashInfo;

    const V = VOICE_STYLE[S.voice];
    ga.fillStyle = INK.color; ga.textAlign = 'center';
    /* NICHT `textBaseline = 'middle'`: das mittelt die em-Box, und die ist bei ALLCAPS voller Luft,
       wo die Unterlängen wären — der Satz sitzt dann zu hoch (Georgs `loud`-Befund 25.8.).
       Gemittelt wird die TUSCHE: Oberkante bis Unterkante der wirklich gesetzten Zeichen. */
    ga.textBaseline = 'alphabetic';
    const want = V[2] * S.k;
    ga.font = fontOf(S.voice, +want.toFixed(2));
    const words = textOf(S.voice, P.text);
    const m0 = ga.measureText(words);
    const tw = m0.width, th = want * 1.2;
    const inner = innerBox(shapeContour(), Math.max(0.3, tw / th));
    const pv = VOICE_PAD[S.voice] || { x: 1, y: 1 };
    const pad = (inkWidthFor(S.voice, V[2], S.k) + want * 0.34) * pv.x * P.padX;
    const room = Math.max(8, inner.w - pad * 2);
    const size = Math.max(7, Math.min(want, want * (room / Math.max(1, tw))));
    ga.font = fontOf(S.voice, +size.toFixed(2));
    const m = ga.measureText(words);
    const asc = m.actualBoundingBoxAscent, dsc = m.actualBoundingBoxDescent;
    const inkH = (isFinite(asc) && isFinite(dsc)) ? (asc + dsc) : size * 0.72;
    const base = isFinite(asc) ? (inner.cy + inkH / 2 - dsc) : (inner.cy + size * 0.36);
    ga.fillText(words, inner.cx, base);
    S.fit = { want: +want.toFixed(1), used: +size.toFixed(1), inner: +inner.w.toFixed(0), inkH: +inkH.toFixed(1), asc: +(asc || 0).toFixed(1), dsc: +(dsc || 0).toFixed(1) };

    if (S.showPts) { gu.fillStyle = '#c0392b'; for (const p of inked) gu.fillRect(p[0] - 1, p[1] - 1, 2, 2); }
    if (S.handles) {
      /* KEINE HILFSLINIE AUF DER TUSCHE (25.8.). Das blaue gestrichelte Polygon lag genau auf der
         Kontur und zerhackte sie optisch — die Blase im Tab sah unterbrochen aus, obwohl die Feder
         durchlief, und die Buehnen-Blase wirkte deshalb wie ein anderer Zeichner. Ein Bedienelement,
         das den Gegenstand verdeckt, verhindert genau die Beurteilung, fuer die es da ist.
         Die Anfasser allein genuegen: die Tusche IST die Linie zwischen ihnen. */
      S.pts.forEach((p, i) => {
        /* Kleiner und ohne weissen Rand: die Anfasser sassen mit 1,6 px weissem Rand auf der Kontur
           und liessen die Ecken wie Luecken aussehen (Georgs Bild 1 gegen Bild 3 — dieselbe Form,
           einmal mit, einmal ohne Anfasser). Ein Bedienelement darf den Gegenstand nicht auffressen. */
        gu.fillStyle = i === S.sel ? '#c9a227' : '#2b5fd9'; gu.strokeStyle = 'rgba(255,253,247,.55)'; gu.lineWidth = 0.8;
        gu.beginPath();
        if (p.c) gu.rect(p.x - 2.8, p.y - 2.8, 5.6, 5.6); else gu.arc(p.x, p.y, 3.1, 0, Math.PI * 2);
        gu.fill(); gu.stroke();
      });
      if (S.warn >= 0 && S.pts[S.warn]) {   // der bedrohte Nachbar: man sieht das Zusammenlegen kommen
        const p = S.pts[S.warn];
        gu.strokeStyle = '#b8361f'; gu.lineWidth = 2;
        gu.beginPath(); gu.arc(p.x, p.y, P.mergePx, 0, Math.PI * 2); gu.stroke();
      }
    }
  }

  /* ── AUTOGROW: die Blase waechst am Text, nicht der Text in die Blase ───────────────────────── */
  /**
   * Georgs Befund (25.8.): »das verdammte Padding/Schriftgroesse-Autogrow-Problem«. Die Ursache ist
   * die RICHTUNG. Der Shaper passte die FORM auf die Buehne (56 % der Leinwand) und setzte den Text
   * hinein — also entschied die BUEHNE ueber die Schriftgroesse, und in einer grossen Blase stand
   * ein kleiner Satz mit viel Leerraum.
   *
   * Richtig ist umgekehrt: der Satz steht in seiner Sollgroesse (loud 34 · mid 22 · soft 17 kursiv),
   * das Padding ist Geometrie (Block x √2 x 1,12), und die FORM waechst darum herum. Dafuer braucht
   * man genau EINE gemessene Zahl je Form:
   *
   *     q = Innenraum-Breite / Rahmen-Breite
   *
   * Damit ist Autogrow eine Division und keine Suche: Rahmen = benoetigter Innenraum / q. Zwei
   * Durchgaenge, weil q sich mit der Groesse leicht aendert (der Zipfel skaliert mit).
   */
  function textBlock() {
    const size = VOICE_STYLE[S.voice][2];
    ga.font = fontOf(S.voice, size);
    return { w: ga.measureText(textOf(S.voice, P.text)).width, h: size * 1.2, size };
  }
  /** `ar` MUSS das Satzverhaeltnis sein, nicht das des Rahmens: `draw()` sucht den Innenraum genau
   *  so. Zwei verschiedene Masse fuer dieselbe Flaeche ergeben zwei verschiedene q — und dann waechst
   *  die Blase gegen eine Zahl, die der Zeichner nie benutzt. */
  function innerRatio(ar) {
    const c = shapeContour();
    if (c.length < 3) return { q: 0.5, bw: 1, bh: 1 };
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (const p of c) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    const bw = maxX - minX, bh = maxY - minY;
    const box = innerBox(c, ar || Math.max(0.3, bw / bh));
    return { q: box.w / (bw || 1), bw, bh };
  }
  /** Die Form um den Satz herum wachsen lassen. Rueckgabe: die Zahlen zum Nachrechnen. */
  function growToText() {
    if (S.pts.length < 3) return null;
    const blk = textBlock();
    /* DOPPELTES PADDING war der Fehler (Georg 25.8.: »immer noch zu viel Leerraum«). `draw()` zieht
       vom gemessenen Innenraum selbst schon `Feder + 0,34 x Schriftgroesse` ab — wer obendrauf den
       Kanon-Zuschlag (Block x √2 x 1,12) rechnet, polstert zweimal und bekommt eine Blase, in der
       der Satz verloren aussieht. Gebraucht wird GENAU das, was der Zeichner verlangt. */
    const pv = VOICE_PAD[S.voice] || { x: 1, y: 1 };
    const pad = (inkWidthFor(S.voice, blk.size, 1) + blk.size * 0.34) * pv.x * P.padX;
    const need = blk.w + pad * 2;
    const ar = Math.max(0.3, blk.w / (blk.size * 1.2));
    let out = null;
    for (let pass = 0; pass < 2; pass++) {
      const r = innerRatio(ar);
      const have = r.q * r.bw;
      const f = need / Math.max(1, have);
      if (!isFinite(f) || f <= 0) break;
      let cx = 0, cy = 0;
      for (const p of S.pts) { cx += p.x / S.pts.length; cy += p.y / S.pts.length; }
      S.pts = S.pts.map((p) => ({ x: cx + (p.x - cx) * f, y: cy + (p.y - cy) * f, c: p.c }));
      out = { q: +r.q.toFixed(3), block: Math.round(blk.w), pad: Math.round(pad), padX: +(pv.x * P.padX).toFixed(2), padY: +(pv.y * P.padY).toFixed(2), need: Math.round(need), frame: Math.round(need / r.q), factor: +f.toFixed(3), size: blk.size, italic: !!VOICE_STYLE[S.voice][3] };
    }
    S.k = 1;                 // Sollgroesse: der Satz wird NICHT mehr verkleinert
    /* Die Feder muss MIT: sie stand noch auf dem Wert aus dem Buehnen-Fit (4,6 px fuer eine doppelt
       so grosse Blase) und wirkte an der geschrumpften Form viel zu dick. Federbreite folgt der
       Schriftgroesse — das ist der Kanon, nicht die letzte Leinwandgroesse. */
    if (!S.penManual) P.baseW = +inkWidthFor(S.voice, blk.size, 1).toFixed(2);
    S.autogrow = out;
    draw();
    return out;
  }

  /* ── Bedienung ─────────────────────────────────────────────────────────────────────────────── */
  const near = (x, y) => { let best = -1, bd = 12; S.pts.forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } }); return best; };
  function segmentAt(x, y) {
    const n = S.pts.length; let best = -1, bd = 10;
    for (let i = 0; i < n; i++) {
      const a = S.pts[i], b = S.pts[(i + 1) % n];
      const vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (y - a.y) * vy) / L2));
      const d = Math.hypot(a.x + vx * t - x, a.y + vy * t - y);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  const xy = (e) => { const r = ui.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const onDown = (e) => {
    const [x, y] = xy(e);
    if (e.button === 2) { const i = near(x, y); if (i >= 0 && S.pts.length > 3) { pushUndo(); S.pts.splice(i, 1); S.sel = -1; draw(); emit(); } return; }
    const i = near(x, y);
    if (i >= 0) { pushUndo(); S.drag = i; S.sel = i; ui.setPointerCapture(e.pointerId); draw(); return; }
    const s = segmentAt(x, y);
    if (s >= 0) { pushUndo(); S.pts.splice(s + 1, 0, { x, y, c: false }); S.sel = s + 1; S.drag = s + 1; ui.setPointerCapture(e.pointerId); draw(); emit(); }
  };
  const onMove = (e) => {
    if (S.drag < 0) return;
    const [x, y] = xy(e);
    S.pts[S.drag].x = x; S.pts[S.drag].y = y;
    S.warn = -1;                                   // Warnung: welcher Nachbar wuerde gleich verschmelzen?
    const n = S.pts.length;
    for (const j of [(S.drag - 1 + n) % n, (S.drag + 1) % n]) {
      if (Math.hypot(S.pts[j].x - x, S.pts[j].y - y) < P.mergePx) { S.warn = j; break; }
    }
    draw();
  };
  const onUp = () => {
    if (S.drag < 0) return;
    S.drag = -1; S.warn = -1;
    const n = apply();                             // DIE REGEL beim Ziehen: zu nah = einer
    if (n) S.sel = -1;
    draw(); emit();
  };
  const onDbl = (e) => { const [x, y] = xy(e); const i = near(x, y); if (i >= 0) { pushUndo(); S.pts[i].c = !S.pts[i].c; draw(); emit(); } };
  const noMenu = (e) => e.preventDefault();
  const onKey = (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'z' && UNDO.length) { e.preventDefault(); S.pts = UNDO.pop(); S.sel = -1; draw(); emit(); return; }
    if ((e.key === 'Backspace' || e.key === 'Delete') && S.sel >= 0 && S.pts.length > 3) { pushUndo(); S.pts.splice(S.sel, 1); S.sel = -1; draw(); emit(); }
  };
  const onResize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); draw(); };
  ui.addEventListener('pointerdown', onDown);
  ui.addEventListener('pointermove', onMove);
  ui.addEventListener('pointerup', onUp);
  ui.addEventListener('dblclick', onDbl);
  ui.addEventListener('contextmenu', noMenu);
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);

  if (document.fonts) {
    Promise.all([
      document.fonts.load('400 36px Bangers'),
      document.fonts.load("900 30px 'Fonteys PRO'"),
      document.fonts.load("600 22px 'Shantell Sans'"),
      document.fonts.load("400 17px 'Shantell Sans'"),
      document.fonts.load("italic 400 15px 'Shantell Sans'"),
    ]).then(() => draw()).catch(() => {});
  }

  return {
    version, S, P,
    /* Das Wachsen sitzt IN `loadPreset`, nicht hier. Vorher stand es in dieser Huelle — und der
       verzoegerte Nachruf aus `redraw()` (versteckter Tab, Buehne 0 px) ruft das INNERE loadPreset:
       damit wuchs die Blase beim ersten Oeffnen nie, und der Tab startete genau mit den zwei Fehlern,
       die Georg zweimal gemeldet hat (zu kleine Schrift, zu dicke Feder). Ein Eigentuemer. */
    loadPreset: (n) => { loadPreset(n); emit(); },
    growToText: () => { const r = growToText(); emit(); return r; },
    setGrow(on) { S.grow = !!on; if (on) growToText(); else { fit(); } emit(); },
    draw, fit, toJSON, info,
    redraw: () => { onResize(); if (S.pending) { const n = S.pending; requestAnimationFrame(() => { loadPreset(n); emit(); }); } },
    set(k, v) {
      if (k === 'baseW') S.penManual = true;
      if (k in P) P[k] = v; else if (k in S) S[k] = v;
      if (k === 'mergePx') apply();
      if (S.grow && (k === 'text' || k === 'padX' || k === 'padY')) growToText();
      draw(); emit();
    },
    setVoice(v) { S.voice = v; S.penManual = false; if (S.grow) growToText(); else fit(); emit(); },
    toggle(k) { S[k] = !S[k]; draw(); emit(); return S[k]; },
    mirror() { pushUndo(); const W = art.clientWidth; S.pts = S.pts.map((p) => ({ x: W - p.x, y: p.y, c: p.c })).reverse(); draw(); emit(); },
    undo() { if (UNDO.length) { S.pts = UNDO.pop(); S.sel = -1; draw(); emit(); } },
    collapseNow() { pushUndo(); const n = apply(); draw(); emit(); return n; },
    paste(json) {
      try {
        const o2 = typeof json === 'string' ? JSON.parse(json) : json;
        const W = art.clientWidth, H = art.clientHeight, k = Math.min(W * 0.3, H * 0.3);
        pushUndo();
        S.pts = o2.pts.map(([x, y, c]) => ({ x: W / 2 + x * k * (o2.aspect || 1), y: H / 2 + y * k, c: !!c }));
        apply(); draw(); emit(); return true;
      } catch (e) { return false; }
    },
    /** Die Form so herausgeben, wie `bubble-shapes.json` sie traegt (fuer die Bank). */
    shapeEntry(name, label) {
      const o2 = JSON.parse(toJSON());
      return { name: name || 'custom', label: label || 'Im Studio gezogen', aspect: o2.aspect, pts: o2.pts };
    },
    dispose() {
      ui.removeEventListener('pointerdown', onDown);
      ui.removeEventListener('pointermove', onMove);
      ui.removeEventListener('pointerup', onUp);
      ui.removeEventListener('dblclick', onDbl);
      ui.removeEventListener('contextmenu', noMenu);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    },
  };
}
