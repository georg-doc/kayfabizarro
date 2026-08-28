/* KFB Bubble KISS v1 — Sprechblase, Denkblase, Schrei.  kss-v1.0
 *
 * WARUM ES DIESES MODUL GIBT (Post-mortem in einem Absatz)
 * Die v6-Blase hat sich bei jeder Kamerabewegung neu gezeichnet: Schriftgroesse aus der projizierten
 * Kachel, in 3-px-Stufen gerundet, Form daraus neu gebaut, Tusche neu gelegt. Jede Stufe war ein
 * sichtbarer Sprung — und weil Lage, Form und Zipfel voneinander abhingen, sprang es auch im
 * Stillstand. Zehn Reparaturen an den Symptomen haben das nicht geheilt.
 *
 * DIE REGEL DIESER FASSUNG
 *   1. Die Blase wird EINMAL gezeichnet, in einer festen Entwurfsgroesse (`REF`).
 *   2. Auf die Buehne kommt sie nur noch als SKALIERUNG (`transform: scale(k)`).
 *   3. `k` ist eine stetige Zahl. Keine Stufen, keine Glaettung, kein Neuzeichnen.
 * Damit KANN die Groesse nicht springen: es gibt keinen Neubau, der springen koennte. Neu gezeichnet
 * wird nur, wenn sich der TEXT oder die ART aendert — also wenn jemand etwas anderes sagt.
 *
 * WAS EINGEFROREN IST
 * Die Kanon-Tusche (Band zwischen zwei Offsetkurven, moduliert nach Lichtrichtung) ist fuer Blasen
 * ausgesetzt \u2014 Georgs Freigabe 25.8.: »von mir aus auch deadlines mit shadow«. Hier laeuft eine
 * gleichmaessige Linie plus ein harter Schatten unten rechts. Dieselbe Lichtlogik (Licht oben links),
 * nur ohne die Modulation, die bei kleinen Formen die Linie auffrisst. Die Kanon-Feder bleibt fuer
 * Karten, Figuren und Bodenschatten unveraendert gueltig.
 */

export const version = 'kss-v1.0';

import { edgeForBox } from './edge-treatment.v1.js';

/* Die Werte der Randbehandlung, an EINER Stelle, damit Wolke und Stern nicht auseinanderlaufen.
   Sie sind die, die im Abnahmeblatt richtig aussahen (Variante C/D).
   KEIN ZIPFEL AM SCHREI (Georg 25.8.: »scream hat einen pfeil«): ein Schrei hat Zacken, keine
   Pfeilspitze — `tailAng: null` laesst die Zipfel-Zacke weg. */
export const EDGE = {
  thought: { treat: 'circles', base: 'rect', r0: 0.54, varr: 0.42, ov: 0.62, inset: 0.60, seed: 7 },
  scream:  { treat: 'spikes', base: 'rect', spikes: 13, len: 0.30, lenVar: 0.46, wide: 0.62, shoulder: 0.06, seed: 11, tailAng: null },
};

/* Die Entwurfsgroesse. Alles hier ist EIN Satz Zahlen fuer alle Blasen \u2014 wer sie aendert, aendert
   jede Blase gleichmaessig. Bei dieser Schriftgroesse sieht die Linie richtig aus; kleiner wird sie
   nur durch `k`, und dann skaliert die Linie mit. */
export const REF = {
  font: 34,          // Entwurfs-Schriftgroesse
  pen: 3.4,          // Linienbreite bei Entwurfsgroesse
  padX: 20, padY: 15,
  radius: 20,        // Ecken der Sprechblase
  tail: 46,          // Zipfellaenge bei Entwurfsgroesse (Reserve rings um den Koerper)
  foot: 30,          // Fussbreite des Zipfels auf der Kante
  shadow: [5, 6],    // Versatz unten rechts, hart (kein Blur)
  ink: '#1f1a14',
  shade: 'rgba(31,26,20,.22)',
  /* DIE EINE KALIBRIERUNG (Georg 25.8.: »die Skalierung fuer die reale Screen-Groesse der Pets muss
     sitzen — einmal fuer alle Arten, der Rest skaliert mit der ground plane«).

     Sie steht als ANTEIL DER KACHEL da, nicht als Pixelzahl, und wird aus der Comic-Konvention
     abgeleitet statt geschaetzt:

        Letteringhoehe ≈ 8,5 % der FIGURENhoehe          (Comic-Konvention)
        Figurenhoehe    ≈ 0,71 x Kachel                   (GEMESSEN, nicht geschaetzt: Pinguin
                                                           230 px bei Kachel 322 px — die Buehne
                                                           fuellt die Kachel mit der GRUNDFORM,
                                                           Kopfschopf und Ohren stehen darueber)
        → Letteringhoehe ≈ 0,085 x 0,71 = 0,061 x Kachel

     Daraus folgt die Kachelbreite, bei der k = 1 gilt: Entwurfsschrift / Anteil = 34 / 0,061 = 557.
     Bezug ist die KACHEL und nicht die gemessene Figur — sonst bekaeme der Hase eine andere Blase als
     der Pinguin, obwohl beide auf derselben Kachel gleich gross stehen. Wer die Blase insgesamt
     groesser oder kleiner will, dreht `letterShare`: EINE Zahl fuer alle vier Arten, weil alle vier
     ihre Groesse aus derselben Entwurfsschrift ziehen. Der Regler »Balloon scale« multipliziert nur
     noch darauf. */
  letterShare: 0.061,
  min: 0.22, max: 2.60,
};
REF.tile = +(REF.font / REF.letterShare).toFixed(0);   // 557 px Kachelbreite = Entwurfsgroesse

const FONTS = {
  speech:  { css: "600 34px 'Shantell Sans', cursive", caps: false },
  thought: { css: "600 34px 'Shantell Sans', cursive", caps: false },
  whisper: { css: "italic 400 34px 'Shantell Sans', cursive", caps: false },
  scream:  { css: "400 40px Bangers, 'Shantell Sans', cursive", caps: true },
};
export const KINDS = ['speech', 'thought', 'whisper', 'scream'];

/** Alle Schriften laden, BEVOR gemessen wird \u2014 sonst misst die Leinwand still die Ausweichschrift. */
export async function ready() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load("600 34px 'Shantell Sans'"),
    document.fonts.load("italic 400 34px 'Shantell Sans'"),
    document.fonts.load('400 40px Bangers'),
  ]).catch(() => {});
}

let mg = null;
function measure(kind, text) {
  const F = FONTS[kind] || FONTS.speech;
  mg = mg || document.createElement('canvas').getContext('2d');
  mg.font = F.css;
  const t = F.caps ? String(text).toUpperCase() : String(text);
  const m = mg.measureText(t);
  const asc = isFinite(m.actualBoundingBoxAscent) ? m.actualBoundingBoxAscent : REF.font * 0.72;
  const dsc = isFinite(m.actualBoundingBoxDescent) ? m.actualBoundingBoxDescent : REF.font * 0.2;
  return { t, w: m.width, asc, dsc, h: asc + dsc, css: F.css };
}

/* ── Die drei Silhouetten ────────────────────────────────────────────────────────────────────────
   Jede bekommt den KOERPER (das Rechteck, in dem der Satz steht) und legt ihren Rand darum. Der
   Koerper ist die Bezugsgroesse \u2014 deshalb sitzt der Satz in jeder Art an derselben Stelle. */

function roundRectPath(g, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.lineTo(x + w - rr, y); g.quadraticCurveTo(x + w, y, x + w, y + rr);
  g.lineTo(x + w, y + h - rr); g.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  g.lineTo(x + rr, y + h); g.quadraticCurveTo(x, y + h, x, y + h - rr);
  g.lineTo(x, y + rr); g.quadraticCurveTo(x, y, x + rr, y);
  g.closePath();
}

/**
 * EINE FLAECHE, EINE UMLAUFENDE LINIE (Georg 25.8.: »es muss eine form/flaeche sein mit umfliessender
 * outline«). Der Zipfel war ein zweites Dreieck neben der Blase — also zwei Silhouetten, zwei Linien
 * und eine Naht quer durch den Zipfelfuss. Richtig ist: der Zipfel steckt IM Pfad. Die Linie laeuft
 * um Koerper UND Zipfel, und im Fuss gibt es keine Linie, weil dort keine Kante ist.
 *
 * Das vertraegt sich mit »einmal zeichnen«, weil die LEINWAND von Anfang an Platz fuer den Zipfel
 * reserviert (`REF.tail` ringsum): der Kasten bleibt gleich gross, wenn der Zipfel die Kante wechselt.
 * Nur der Pfad aendert sich — und ein Pfad, der gefuellt und gestrichen wird, kostet Bruchteile einer
 * Millisekunde. Gesprungen ist in v6 nicht das Zeichnen, sondern das NACHMESSEN.
 *
 * @param {object} t  {dx,dy} Richtung zum Gesicht (normiert) · len · foot
 */
function bodyPath(g, bw, bh, r, t) {
  const x0 = -bw / 2, y0 = -bh / 2, x1 = bw / 2, y1 = bh / 2;
  const rr = Math.min(r, bw / 2, bh / 2);
  if (!t) { roundRectPath(g, x0, y0, bw, bh, rr); return null; }
  /* DER ZIPFEL KOMMT AUS DER UNTERKANTE UND NEIGT SICH (Georgs Rueckfrage 25.8.: »konzept?«).
     Vorher entschied die Geometrie: die Kante, die zum Gesicht schaut. Bei einer Blase seitlich ueber
     dem Kopf war das die SEITENkante — und ein waagerechter Zipfel liest sich nicht als Zipfel,
     sondern als Lappen. Die Comic-Konvention ist einfacher und immer richtig:

        der Fuss sitzt auf der Unterkante, die Spitze zeigt nach unten und LEHNT zum Sprecher.

     Damit gibt es nur noch zwei Faelle — unten (Normalfall) und oben, wenn die Blase unter dem
     Gesicht sitzt. Kein Kantenwechsel mehr, also auch kein Umklappen. */
  const up = t.dy < 0;                       // Gesicht ist OBEN: Zipfel an die Oberkante
  const sy = up ? -1 : 1;
  const len = t.len;
  const foot = Math.min(t.foot, bw - rr * 2 - 6);
  const lean = Math.max(-1, Math.min(1, t.dx * 1.7));            // wie stark er zum Sprecher neigt
  const half = bw / 2 - rr - foot / 2;
  const along = Math.max(-half, Math.min(half, lean * half));    // Fussmitte auf der Kante
  const tipX = Math.max(-bw / 2 - len * 0.6, Math.min(bw / 2 + len * 0.6, along + lean * len * 0.8));
  const tipY = sy * (bh / 2 + len);
  g.beginPath();
  const seg = [];
  const L = (x, y) => seg.push(['l', x, y]);
  const Q = (cx, cy, x, y) => seg.push(['q', cx, cy, x, y]);
  if (!up) {
    g.moveTo(x0 + rr, y0);
    L(x1 - rr, y0); Q(x1, y0, x1, y0 + rr);
    L(x1, y1 - rr); Q(x1, y1, x1 - rr, y1);
    L(along + foot / 2, y1); L(tipX, tipY); L(along - foot / 2, y1);
    L(x0 + rr, y1); Q(x0, y1, x0, y1 - rr);
    L(x0, y0 + rr); Q(x0, y0, x0 + rr, y0);
  } else {
    g.moveTo(x0 + rr, y0);
    L(along - foot / 2, y0); L(tipX, tipY); L(along + foot / 2, y0);
    L(x1 - rr, y0); Q(x1, y0, x1, y0 + rr);
    L(x1, y1 - rr); Q(x1, y1, x1 - rr, y1);
    L(x0 + rr, y1); Q(x0, y1, x0, y1 - rr);
    L(x0, y0 + rr); Q(x0, y0, x0 + rr, y0);
  }
  for (const q of seg) { if (q[0] === 'l') g.lineTo(q[1], q[2]); else g.quadraticCurveTo(q[1], q[2], q[3], q[4]); }
  g.closePath();
  return { edge: up ? 't' : 'b', tip: { x: tipX, y: tipY }, along };
}

/** Wolke und Stern kommen aus der RANDBEHANDLUNG: Grundform + Kreise bzw. Zacken auf ihrer Kante.
 *  Georgs Befund 25.8.: »scream & thought haben das erklaerte konzept noch nicht umgesetzt« — zu
 *  Recht, ich hatte hier eine eigene, schlechtere Wolke und einen eigenen Stern gebaut. Das Konzept
 *  steht in `edge-treatment.v1.js`; hier wird es nur noch benutzt. */
function edgeRing(kind, bw, bh) {
  const P = kind === 'scream' ? EDGE.scream : EDGE.thought;
  const fit = edgeForBox(bw, bh, { ...P, penHint: REF.pen });
  /* Der Ring kommt mit Nullpunkt oben links plus dem Innenraum (= die Grundform). Diese Leinwand
     zeichnet um (0,0), also wird auf die Mitte der GRUNDFORM umgerechnet — nicht auf die Mitte des
     Rings: der Rand ragt ungleich weit heraus, und der Satz gehoert in die Grundform. */
  return fit.pts.map((p) => [p.x - fit.inner.cx, p.y - fit.inner.cy]);
}

function strokePoly(g, pts, close) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (close !== false) g.closePath();
}

/**
 * Die Blase in Entwurfsgroesse auf eine Leinwand zeichnen.
 *
 * @param {object} o kind \u00b7 text \u00b7 paper \u00b7 reveal (Zeichen, null = alles)
 * @returns {object} { cv, w, h, body:{x,y,w,h}, cx, cy }  \u2014 Masse in ENTWURFSpixeln
 */
export function render(o) {
  const kind = KINDS.includes(o.kind) ? o.kind : 'speech';
  const M = measure(kind, o.text == null ? '' : o.text);
  const bw = Math.max(REF.font * 2.2, M.w + REF.padX * 2);
  const bh = Math.max(REF.font * 1.6, M.h + REF.padY * 2);
  let ring = null;
  if (kind === 'thought' || kind === 'scream') ring = edgeRing(kind, bw, bh);
  let ex = bw / 2, ey = bh / 2;
  if (ring) for (const p of ring) { ex = Math.max(ex, Math.abs(p[0])); ey = Math.max(ey, Math.abs(p[1])); }
  const pad = Math.ceil(REF.pen + Math.max(REF.shadow[0], REF.shadow[1]) + 2
                        + ((kind === 'speech' || kind === 'whisper') ? REF.tail : 0));
  const W = Math.ceil(ex * 2 + pad * 2), H = Math.ceil(ey * 2 + pad * 2);
  const cv = o.cv || document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.translate(W / 2, H / 2);
  const paper = o.paper || '#fdf7e6';
  const path = () => {
    if (ring) strokePoly(g, ring);
    else bodyPath(g, bw, bh, REF.radius, o.tail || null);
  };
  /* Harter Schatten unten rechts \u2014 dieselbe Lichtrichtung wie Karte und Bodenschatten. */
  g.save(); g.translate(REF.shadow[0], REF.shadow[1]); g.fillStyle = REF.shade; path(); g.fill(); g.restore();
  g.fillStyle = paper; path(); g.fill();
  g.lineJoin = 'round'; g.lineCap = 'round'; g.lineWidth = REF.pen; g.strokeStyle = REF.ink;
  path(); g.stroke();
  /* Der Satz: linksbuendig ab der Blockmitte, damit beim Aufbauen kein Buchstabe wandert. */
  const shown = o.reveal == null ? M.t : M.t.slice(0, Math.max(0, o.reveal));
  if (shown) {
    g.font = M.css; g.fillStyle = REF.ink; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.fillText(shown, -M.w / 2, M.h / 2 - M.dsc);
  }
  return { cv, w: W, h: H, body: { w: bw, h: bh }, cx: W / 2, cy: H / 2, kind,
           reach: { x: ex, y: ey }, text: { w: +M.w.toFixed(1), of: M.t.length } };
}

/**
 * Verbindung zum Kopf, jedes Bild neu \u2014 sie ist BEWEGUNG und gehoert deshalb nicht in die
 * gezeichnete Blase. Sprechblase: ein Dreieck. Denkblase: drei Kreise, abnehmend. Schrei: nichts.
 *
 * Alles in BUEHNEN-Koordinaten, also dieselben Zahlen, die auch die Blase positionieren \u2014 damit
 * kann nichts um einen Versatz daneben liegen.
 *
 * @param {object} o from {x,y} Blasenmitte \u00b7 to {x,y} Gesicht \u00b7 rx,ry halbe Blasenausdehnung
 *                   \u00b7 k Skalierung \u00b7 kind \u00b7 paper \u00b7 phase (Atem)
 */
export function connector(g, o) {
  const kind = o.kind, k = o.k == null ? 1 : o.k;
  if (kind === 'scream') return null;
  let dx = o.to.x - o.from.x, dy = o.to.y - o.from.y;
  const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
  /* Austritt aus der Blase: auf der Ellipse ihrer halben Ausdehnung. Reicht fuer alle drei Formen,
     weil der Koerper immer mittig sitzt \u2014 und es ist eine Zeile statt einer Huellenrechnung. */
  const rx = o.rx, ry = o.ry;
  const tEll = 1 / Math.hypot(dx / rx, dy / ry);
  const ex = o.from.x + dx * tEll, ey = o.from.y + dy * tEll;
  const gap = Math.max(0, L - tEll);
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = REF.ink; g.fillStyle = o.paper || '#fdf7e6';
  if (kind === 'thought') {
    /* Drei Kreise, abnehmend, auf der Linie zum Gesicht \u2014 sie atmen nur, sie wandern nicht. */
    let r = Math.max(4, REF.font * 0.55 * k), d = r * 0.8;
    const out = [];
    for (let i = 0; i < 3 && d + r < gap + r * 2; i++) {
      const br = 1 + 0.10 * Math.sin((o.phase || 0) - i * 0.9);
      const cx = ex + dx * d, cy = ey + dy * d, rr = r * br;
      g.save(); g.translate(REF.shadow[0] * k * 0.7, REF.shadow[1] * k * 0.7);
      g.fillStyle = REF.shade; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill(); g.restore();
      g.fillStyle = o.paper || '#fdf7e6';
      g.lineWidth = Math.max(1, REF.pen * k * 0.8);
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill(); g.stroke();
      out.push({ x: +cx.toFixed(1), y: +cy.toFixed(1), r: +rr.toFixed(1) });
      d += rr * 1.9; r *= 0.66;
    }
    return { kind, circles: out };
  }
  /* Sprechblase: ein Dreieck von der Blasenkante zum Gesicht. Es zeigt IMMER auf den Kopf, weil es
     jedes Bild neu gezeichnet wird \u2014 kein Umschalten, kein Rasten, keine Silhouette-Aenderung. */
  const len = Math.min(gap * 0.92, Math.max(18 * k, 52 * k));
  const px = -dy, py = dx;
  const foot = Math.max(8 * k, 15 * k);
  const ax = ex - dx * 2 + px * foot, ay = ey - dy * 2 + py * foot;
  const bx = ex - dx * 2 - px * foot, by = ey - dy * 2 - py * foot;
  const tx = ex + dx * len, ty = ey + dy * len;
  const tri = [[ax, ay], [tx, ty], [bx, by]];
  g.save(); g.translate(REF.shadow[0] * k * 0.7, REF.shadow[1] * k * 0.7);
  g.fillStyle = REF.shade; strokePoly(g, tri); g.fill(); g.restore();
  g.lineWidth = Math.max(1, REF.pen * k);
  g.fillStyle = o.paper || '#fdf7e6';
  strokePoly(g, tri); g.fill();
  /* Nur die zwei AUSSENkanten stricheln \u2014 die Basis liegt in der Blase und darf keine Linie haben. */
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(tx, ty); g.lineTo(bx, by); g.stroke();
  return { kind, tip: [+tx.toFixed(1), +ty.toFixed(1)], len: +len.toFixed(1) };
}

/** Die Skalierung: eine stetige Zahl aus der projizierten Kachel. Keine Stufen, keine Glaettung. */
export function scaleFor(tilePx, userScale) {
  const k = (tilePx / REF.tile) * (userScale == null ? 1 : userScale);
  return Math.max(REF.min, Math.min(REF.max, k));
}
