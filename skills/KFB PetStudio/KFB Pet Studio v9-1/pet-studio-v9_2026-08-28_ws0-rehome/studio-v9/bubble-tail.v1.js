/* KFB Pet Studio v9 — ANSATZ UND SPITZE ALS EIGENES BAUTEIL.  tail-v1.0
 *
 * DAS PROBLEM, DAS DIESES MODUL ABSCHAFFT (Georgs Befund 27.8.: »siehst du wie das hier springt und
 * wie die quasi dann jedes Mal neu gerechnet wird«):
 *
 *   In `bubble-shaper.v3.js` ist der Zipfel keine SACHE, sondern ein BEFUND. `shapeForBox` sucht in
 *   der Silhouette nach einer Punktgruppe, die »tief unten und in der Minderheit« liegt, ERNENNT sie
 *   zum Zipfel und verschiebt sie. Bei jeder Bewegung wird neu gesucht — also kippt die Ernennung,
 *   und ein Kippen ist ein Sprung. Zwei Rückfälle und drei Sonderregeln im Code (»die Minderheiten-
 *   Regel lag nur auf der SUCHE, nicht auf ihrem Rueckfall«) sind der Beleg, dass die Suche selbst
 *   der Fehler ist. Man kann eine Suche nicht stabilisieren, man kann sie nur ersetzen.
 *
 * DIE ERSETZUNG, UND SIE IST GEORGS ENTSCHEIDUNG:
 *   Der Zipfel hat DREI EIGENE PUNKTE, die im Entwurf STEHEN und nicht gefunden werden.
 *     ANSATZ A · ANSATZ B   die zwei Punkte, wo er aus der Kante herauswächst.
 *     SPITZE                das Ende, das man zieht.
 *   »Füße bleiben stehen, wo sie gesetzt sind — nur die Spitze bewegt sich« (27.8.). Also ist das
 *   Ziehen der Spitze eine Zuweisung an EIN Feld. Nichts wird gesucht, nichts kann kippen.
 *
 * ZWEI SCHENKEL, ZWEI GERADEN (Georgs Wahl aus vier Vorlagen, 27.8.): A → Spitze → B, alle drei
 * Punkte als ECKE (`c: true`). Die dünn zulaufende Feinspitze kommt danach GRATIS: `paintBubble`
 * kennt die Eckenerkennung (`tips`/`tipFade`) und nimmt die Feder in der Nähe eines scharfen Knicks
 * auf 30 % zurück. Deshalb wird hier KEIN zweiter Zeichner gebaut — der Zipfel ist Teil derselben
 * Kontur, derselben Füllung, desselben Bandes. Eine Feder im Haus.
 *
 * WAS DAS MODUL NICHT TUT: es zeichnet nicht. Es liefert Punkte und Zahlen. Der Zeichner bleibt
 * `paintBubble`, damit Papier, Saum, Kantenfase und geschnittene Lücken für den Zipfel gelten wie
 * für die Kante. Ein separat gemalter Zipfel hätte eine sichtbare Naht.
 */

export const version = 'tail-v1.0';

/* Anteile, keine Pixel. Eine Blase wird skaliert — eine Pixelzahl im Entwurf ist ein Fehler mit
   Verzögerung (Hausregel R10: das Verhältnis ändern, nicht das Objekt). */
export const TAIL_DEF = {
  side: 'bottom',
  a: 0.40,            // Ansatz A, Anteil der Kantenlänge
  b: 0.56,            // Ansatz B
  tip: [0.44, 1.46],  // Spitze in Anteilen von Breite/Höhe; y > 1 heisst unter der Kante
  clear: 0.08,        // Luft, die die Spitze zur Silhouette des Besitzers hält
  minLen: 0.18,       // kürzeste Zipfellänge, Anteil der Blasenhöhe
};

/** Je Bubble-Art eine Grundstellung. `scream` ist lang und schmal — »lang heisst schmal« steht seit
 *  v7 in `edge-treatment.v1.js`, hier ist es dieselbe Zahl in anderer Form. */
export const TAIL_KIND = {
  speech:  { span: 0.16, len: 0.46 },
  whisper: { span: 0.14, len: 0.42 },
  scream:  { span: 0.085, len: 0.86 },
  thought: null,   // Thought hat keinen Zipfel, sondern eine SPUR. Nicht dasselbe Bauteil.
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, d) => (v == null || !isFinite(v) ? null : +(+v).toFixed(d == null ? 4 : d));

export function ensureTail(t, kind) {
  const K = TAIL_KIND[kind || 'speech'];
  const base = { ...TAIL_DEF };
  if (K) {
    base.a = 0.5 - K.span / 2;
    base.b = 0.5 + K.span / 2;
    base.tip = [0.5, 1 + K.len];
  }
  if (!t) return base;
  return { ...base, ...t, tip: (t.tip && t.tip.length === 2) ? [t.tip[0], t.tip[1]] : base.tip };
}

/* ── Der Ort auf der Silhouette ──────────────────────────────────────────────────────────────── */
/**
 * DER ANSATZ LIEGT AUF DER UNTEREN SILHOUETTE, NICHT AUF EINEM SEGMENT.
 *
 * Befund der Abnahme (gemessen, 90 px Blasenbreite, 16 Punkte, nur Form gewechselt):
 *   rect   a .10/b .90 → Spanne 70,16   ·  a .42/b .58 → Spanne 14,40
 *   round  a .10/b .90 → Spanne 16,28   ·  a .30/b .70 → Spanne 16,28  ← identisch
 *   round  B.x klebte über den ganzen Reglerweg auf 45,5 und bewegte sich nie.
 * Ursache: die erste Fassung wählte EIN Segment (das mit der größten mittleren Höhe) und
 * parametrisierte beide Ansätze darauf. Auf dem Oval spannt das unterste Segment nur ~45,5…61,7 px
 * der 90 px — also fielen alle Anteile in dieses Fenster, der Regler war über den halben Weg tot,
 * und `speech span 0.16` lieferte 6,72 px statt 14,40. Die Zusage im Modulkopf (»Anteil der
 * Kantenlänge«) war damit für gekrümmte Formen STILL UNWAHR — genau die Sorte Falschaussage, die
 * dieser Umbau abschaffen sollte.
 *
 * Richtig: für eine gewünschte x-Lage die ganze Kontur umlaufen und die TIEFSTE Kreuzung mit der
 * Senkrechten nehmen. Die beiden Ansätze dürfen auf verschiedenen Segmenten liegen — sie sind Punkte
 * auf einer Silhouette, keine Parameter einer Kante.
 */
function crossLowest(pts, xWant, side, W) {
  const N = pts.length;
  let minX = Infinity, maxX = -Infinity;
  for (const p of pts) { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; }
  const pad = Math.max(0.5, (maxX - minX) * 0.02);
  const xT = clamp(xWant, minX + pad, maxX - pad);
  let best = null;
  for (let i = 0; i < N; i++) {
    const p = pts[i], q = pts[(i + 1) % N];
    const dx = q.x - p.x;
    if (Math.abs(dx) < 1e-9) continue;                 // senkrechtes Segment: kein eindeutiges t
    const t = (xT - p.x) / dx;
    if (t < -1e-6 || t > 1 + 1e-6) continue;
    const y = p.y + (q.y - p.y) * clamp(t, 0, 1);
    const better = !best || (side === 'top' ? y < best.y : y > best.y);
    if (better) best = { i, t: clamp(t, 0, 1), x: xT, y };
  }
  return best;
}

/** Welcher der beiden Bögen zwischen den Kreuzungen ist der UNTERE? Der, dessen Zwischenpunkte
 *  tiefer liegen. Ein leerer Bogen (beide Kreuzungen auf demselben Segment) IST der untere — dann
 *  wird nichts ersetzt, nur eingefügt. Das ist der Rechteck-Fall, ohne Sonderregel dafür. */
function arcDepth(pts, from, to, side) {
  const N = pts.length;
  let n = 0, sum = 0;
  let i = (from.i + 1) % N;
  for (let k = 0; k < N; k++) {
    if (i === (to.i + 1) % N) break;
    sum += pts[i].y; n++;
    i = (i + 1) % N;
  }
  if (!n) return side === 'top' ? -Infinity : Infinity;
  const mean = sum / n;
  return side === 'top' ? -mean : mean;
}

/**
 * Die drei Punkte in Entwurfspixeln, plus der Bogen, den sie ersetzen. EINE Rechnung für Zeichnen,
 * Anfassen und Messen — sonst zeigt der Anfasser woanders hin als die Spitze.
 * `A`/`B` behalten ihre Bedeutung für die Bedienung (A = kleinere x-Lage, B = größere); `start`/`end`
 * sind dieselben zwei Punkte in UMLAUFRICHTUNG, und die entscheidet über den Pfad.
 */
export function resolve(pts, box, tail) {
  if (!pts || pts.length < 3) return null;
  const t = ensureTail(tail);
  const W = box && box.w ? box.w : 1, H = box && box.h ? box.h : 1;
  const lo = Math.min(t.a, t.b), hi = Math.max(t.a, t.b);
  const A = crossLowest(pts, lo * W, t.side, W);
  const B = crossLowest(pts, hi * W, t.side, W);
  if (!A || !B) return null;
  /* Zwei Bögen verbinden dieselben zwei Punkte. Genommen wird der untere — gemessen an der Tiefe
     seiner Zwischenpunkte, nicht geraten aus der Reihenfolge der Namen. */
  const dAB = arcDepth(pts, A, B, t.side), dBA = arcDepth(pts, B, A, t.side);
  const forward = dAB >= dBA;
  const start = forward ? A : B, end = forward ? B : A;
  const T = { x: t.tip[0] * W, y: t.tip[1] * H };
  return { A, B, start, end, T, tail: t, W, H, i: start.i };
}

/**
 * Der Zipfel wird in die Kontur EINGEHÄNGT: der untere Bogen zwischen den beiden Ansätzen wird durch
 * die Spitze ERSETZT. Drei Ecken, ein Pfad. Danach weiß der Zeichner nichts von einem Zipfel — und
 * genau das ist der Punkt: es gibt keinen Sonderfall mehr, den man wiedererkennen müsste.
 */
export function splice(pts, box, tail) {
  const r = resolve(pts, box, tail);
  if (!r) return pts || [];
  const N = pts.length;
  const out = [
    { x: r.start.x, y: r.start.y, c: true },
    { x: r.T.x, y: r.T.y, c: true },
    { x: r.end.x, y: r.end.y, c: true },
  ];
  /* Weiter geht es NACH dem Endsegment und läuft bis zum Startsegment — der Bogen dazwischen ist
     ersetzt. Bei gleichem Segment (Rechteck) läuft die Schleife einmal ganz herum, und es ist eine
     reine Einfügung. */
  let i = (r.end.i + 1) % N;
  for (let k = 0; k < N; k++) {
    out.push({ x: pts[i].x, y: pts[i].y, c: pts[i].c });
    if (i === r.start.i) break;
    i = (i + 1) % N;
  }
  return out;
}

/* ── Bedienen ────────────────────────────────────────────────────────────────────────────────── */
/** DIE EINE ZUWEISUNG. Ziehen der Spitze schreibt zwei Zahlen und rührt die Ansätze nicht an. */
export function setTip(box, tail, x, y) {
  const t = ensureTail(tail);
  const W = box && box.w ? box.w : 1, H = box && box.h ? box.h : 1;
  const yMin = 1 + (t.minLen == null ? TAIL_DEF.minLen : t.minLen) * 0.5;
  return { ...t, tip: [num(clamp(x / W, -0.9, 1.9), 4), num(Math.max(yMin, y / H), 4)] };
}

/** Einen Ansatz verschieben — ausdrückliche Handlung, nicht Nebenwirkung. Der andere bleibt stehen,
 *  und ein Mindestabstand verhindert, dass beide zu EINEM Punkt werden (dann wäre der Zipfel ein
 *  Strich ohne Fläche). */
export function setFoot(box, tail, which, x) {
  const t = ensureTail(tail);
  const W = box && box.w ? box.w : 1;
  const v = clamp(x / W, 0.04, 0.96);
  const min = 0.045;
  if (which === 'a') return { ...t, a: num(Math.min(v, t.b - min), 4) };
  if (which === 'b') return { ...t, b: num(Math.max(v, t.a + min), 4) };
  return t;
}

/** Was hat der Zeiger angefasst? Reihenfolge ist Absicht: die Spitze gewinnt, weil sie das
 *  Bedienelement ist, das man dauernd braucht. */
export function hit(pts, box, tail, x, y, r) {
  const R = r == null ? 11 : r;
  const q = resolve(pts, box, tail);
  if (!q) return null;
  const d = (p) => Math.hypot(p.x - x, p.y - y);
  if (d(q.T) <= R * 1.35) return 'tip';
  if (d(q.A) <= R) return 'a';
  if (d(q.B) <= R) return 'b';
  return null;
}

/**
 * DIE SPITZE ZEIGT AUF DIE MITTE DES BESITZERS UND HÖRT AN SEINER SILHOUETTE AUF.
 * Georgs Regel 27.8.: »zeigt immer auf zentrum des owner modells · ragt möglichst nicht in/über
 * modell«. Das ist eine MESSUNG, keine getippte Zahl: Richtung zur Mitte, Länge = Abstand minus
 * Silhouettenradius minus Luft. Eine getippte Länge steckt im kleinen Maßstab im Kopf.
 * `owner` = { x, y, r } im selben Entwurfsraum wie die Blase.
 */
export function aim(box, tail, owner, boxOrigin) {
  const t = ensureTail(tail);
  if (!owner) return t;
  const W = box && box.w ? box.w : 1, H = box && box.h ? box.h : 1;
  const o = boxOrigin || { x: 0, y: 0 };
  const cx = W / 2, cy = H / 2;                        // Blasenmitte im Entwurfsraum
  const ox = owner.x - o.x, oy = owner.y - o.y;        // Besitzer in denselben Raum
  let dx = ox - cx, dy = oy - cy;
  const L = Math.hypot(dx, dy);
  if (!(L > 1e-6)) return t;
  dx /= L; dy /= L;
  const keep = (owner.r || 0) * (1 + (t.clear == null ? TAIL_DEF.clear : t.clear));
  const len = Math.max(H * (t.minLen == null ? TAIL_DEF.minLen : t.minLen), L - keep);
  return setTip(box, t, cx + dx * len, cy + dy * len);
}

/* ── Abnahme ─────────────────────────────────────────────────────────────────────────────────── */
/**
 * `stamp` ist der Beleg für »springt nicht«: er ändert sich GENAU dann, wenn sich die Geometrie des
 * Zipfels ändert. Wer die Spitze nicht anfasst und trotzdem einen neuen Stempel sieht, hat eine
 * versteckte Neuberechnung gefunden — dieselbe Beweisführung wie beim Neuzeichnungs-Zähler der
 * Blasenschicht in v7 (150 Bilder Ruhe, null Neuzeichnungen).
 */
export function report(pts, box, tail) {
  const q = resolve(pts, box, tail);
  if (!q) return null;
  const span = Math.hypot(q.B.x - q.A.x, q.B.y - q.A.y);
  const mid = { x: (q.A.x + q.B.x) / 2, y: (q.A.y + q.B.y) / 2 };
  const len = Math.hypot(q.T.x - mid.x, q.T.y - mid.y);
  const ang = Math.atan2(q.T.y - mid.y, q.T.x - mid.x) * 180 / Math.PI;
  return {
    span: num(span, 2), len: num(len, 2), ratio: num(len / Math.max(1e-6, span), 3),
    angle: num(ang, 1), edge: q.i, seg: [q.start.i, q.end.i],
    ax: num(q.A.x, 1), bx: num(q.B.x, 1),
    a: num(q.tail.a, 4), b: num(q.tail.b, 4), tip: [num(q.tail.tip[0], 4), num(q.tail.tip[1], 4)],
    stamp: [q.tail.a, q.tail.b, q.tail.tip[0], q.tail.tip[1], q.tail.side].join('|'),
    note: 'Ansatz auf der unteren Silhouette gesetzt, nicht auf einem Segment gefunden',
  };
}
