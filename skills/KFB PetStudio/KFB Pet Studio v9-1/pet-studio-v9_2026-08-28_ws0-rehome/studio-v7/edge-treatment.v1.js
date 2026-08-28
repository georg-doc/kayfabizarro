/* KFB Edge Treatment v1 — die Randbehandlung als eigenes Ding.  edg-v1.0
 *
 * Georgs Konzept, zweimal formuliert (25.8.):
 *   Wolke:  »denkblasen werden konzeptionell aus rect (oder auch oval) base form gebaut; die
 *            raender/outlines werden durch auf der base form leicht unregelmaessig verteilte,
 *            ueberlappende (halb)kreise wechselnder groesse gebaut; ink outline dann natuerlich nur
 *            ausse/kontur.«
 *   Schrei: »die gleiche konstruktions-logik brauchen wir auch 1:1 fuer scream — nur mit zacken
 *            statt kreisen.«
 *
 * Daraus folgt die Trennung, an der alle frueheren Anlaeufe gescheitert sind:
 *
 *   DIE GRUNDFORM traegt Groesse, Innenraum und Satz.   (rect · oval — spaeter jede Shaper-Form)
 *   DIE BEHANDLUNG traegt den Rand.                     (circles · spikes · plain)
 *   DIE FEDER traegt die Linie.                         (paintBubble, Kanon)
 *
 * Damit ist die Wolke KEINE eigene Form und der Stern auch nicht — sonst braucht jede Form × jede
 * Behandlung einen eigenen Generator, und genau daran ist die Fuenf-Formen-Grammatik gestorben.
 * Der Innenraum kommt hier ohne Suche zustande: er IST die Grundform. (Die Suche nach dem groessten
 * Rechteck war die Quelle von »zwei Masse fuer dieselbe Flaeche«.)
 *
 * KREISE: die Kontur ist das ERGEBNIS der Kreise, kein Punktzug auf einer Ellipse. Gemessen wird die
 * Huelle als weitester Kreisaustritt je Winkel — exakt, ohne Pfad-Verschneidung und ohne Naht. Die
 * inneren Boegen fallen dabei von selbst weg: deshalb sieht man keine Ueberlappung.
 * ZACKEN: hier gibt es nichts zu vereinigen, die Zacke IST die Kontur. Zwei Fuesse auf der
 * Grundform, eine Spitze nach aussen, dazwischen eine Schulter — ohne Schulter lesen zwei Taeler
 * nebeneinander als Falte statt als Explosion.
 *
 * Zwei Regeln, die aus der Zeichnung kommen und nicht aus der Mathematik:
 *   · Der Groessenwechsel ist ein WECHSEL, nicht Zufall: klein und gross laufen abwechselnd, der
 *     Zufall sitzt nur in der Staerke. Reiner Zufall gibt Klumpen aus drei gleichen Lappen — dann
 *     liest man Girlande statt Wolke.
 *   · Eine lange Zacke ist SCHMAL (eine Druckwelle laeuft spitz aus), eine kurze darf breit sein.
 */

export const version = 'edg-v1.0';

function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── DIE VARIATION ────────────────────────────────────────────────────────────────────────────
 * Georgs Praezisierung (25.8.): »kleine und grosse zacken/bubbles wechseln sich ab, sind aber nie
 * immer nur zwei groessen, sondern variierend natuerlich in einem definierten range«.
 *
 * Also drei Anteile, die zusammen einen stetigen Bereich ergeben statt zweier Stufen:
 *   1. WECHSEL  — das Vorzeichen springt, klein und gross laufen abwechselnd (der Rhythmus, den man
 *                 als »wolkig« liest; reiner Zufall gibt Klumpen aus drei gleichen Lappen).
 *   2. STAERKE  — der Betrag laeuft frei durch 0,20 … 1,00, nicht nur durch die oberen Werte. Vorher
 *                 stand hier 0,55 … 1,00: das sind praktisch zwei Groessen mit Rauschen.
 *   3. DRIFT    — eine langsame Welle ueber den Ring, damit auch die ABFOLGE nicht mechanisch ist:
 *                 eine Seite darf insgesamt groesser sein als die andere.
 * Das Ergebnis wird auf ±1 geklemmt und ist die Stelle IM BEREICH, nicht der Bereich selbst — der
 * steht in `varr` bzw. `lenVar`. Eine Zahl, ein Eigentuemer.
 */
function varyer(rnd, seed) {
  const ph = rnd() * 6.283, f1 = 0.55 + rnd() * 0.5;
  void seed;
  return (i) => {
    const sign = i % 2 ? -1 : 1;
    const mag = 0.20 + 0.80 * rnd();
    const drift = 0.26 * Math.sin(i * f1 + ph);
    return Math.max(-1, Math.min(1, sign * mag + drift));
  };
}

/** Standardwerte. Alle Laengen sind ANTEILE der Grundform, keine Pixel — sonst gilt eine
 *  Einstellung nur in einer Blasengroesse (dieselbe Falle wie bei der Mindestabstands-Regel). */
export const EDGE_DEF = {
  base: 'rect',        // 'rect' | 'oval'
  treat: 'circles',    // 'circles' (Wolke) | 'spikes' (Schrei) | 'plain'
  // Kreise
  r0: 0.42,            // Lappenradius, Anteil der Grundform-HOEHE
  varr: 0.34,          // Groessenwechsel ±
  ov: 0.56,            // Ueberlappung: Mittelpunktabstand = 2·r0·(1−ov)
  inset: 0.66,         // Mittelpunkte liegen inset·r0 INNERHALB der Grundform
  wob: 0.10,           // leichte Unregelmaessigkeit der Mittelpunkte, in r0
  perLobe: 5,          // Stuetzpunkte je Lappen
  // Zacken
  spikes: 11,          // Zahl der Zacken (wird auf den Umfang gerundet)
  len: 0.34,           // Zackenlaenge, Anteil des halben Grundform-Diagonalmasses
  lenVar: 0.42,        // Laengenwechsel ±
  wide: 0.62,          // Grundbreite einer Zacke, Anteil ihres Platzes
  shoulder: 0.06,      // Schulter zwischen zwei Zacken, nach aussen, Anteil der Grundform
  seed: 7,
  steps: 720,
};

/* ── Grundform: ein Punkt auf ihrem Rand, bei Bogenlaenge s ──────────────────────────────────── */
function baseWalker(w, h, base, ins) {
  const W = Math.max(2, w - 2 * ins), H = Math.max(2, h - 2 * ins);
  if (base === 'oval') {
    const rx = W / 2, ry = H / 2;
    const per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    return { per, at: (s) => { const a = (((s % per) + per) % per) / per * Math.PI * 2; return { x: Math.cos(a) * rx, y: Math.sin(a) * ry }; } };
  }
  const per = 2 * (W + H);
  return {
    per,
    at: (s0) => {
      const s = ((s0 % per) + per) % per;
      if (s < W) return { x: -W / 2 + s, y: -H / 2 };
      if (s < W + H) return { x: W / 2, y: -H / 2 + (s - W) };
      if (s < 2 * W + H) return { x: W / 2 - (s - W - H), y: H / 2 };
      return { x: -W / 2, y: H / 2 - (s - 2 * W - H) };
    },
  };
}

/* ── KREISE ──────────────────────────────────────────────────────────────────────────────────── */
/**
 * Lappen-Mittelpunkte entlang der Grundform, um (0,0) zentriert.
 *
 * ZWEI REGELN AUS GEORGS PRAEZISIERUNG (25.8.), die beide an DIESER Stelle sitzen:
 *
 * »alle zacken/bubbles sind zum zentrum orientiert« — der Mittelpunkt liegt auf der RADIALEN vom
 *   Grundform-Punkt zum Zentrum, nicht auf der Kantennormalen. An einer breiten Blase waeren sonst
 *   oben und unten alle Lappen parallel eingezogen; radial gerichtet zeigt jeder Lappen nach aussen
 *   weg von der Schrift, wie eine Wolke, die sich vom Kern nach aussen baut.
 *
 * »alle folgen der base form, so dass sich trotz variation eine erkennbare base form ergibt« — der
 *   Einzug ist ein Anteil des EIGENEN Radius (`inset · r_i`), nicht eine gemeinsame Zahl. Damit
 *   bulgen grosse und kleine Lappen ungefaehr gleich weit ueber die Grundform hinaus: die Silhouette
 *   bleibt ein Rechteck bzw. ein Oval, die Variation sitzt im RAND und nicht im Umriss. Mit einem
 *   gemeinsamen Einzug traegt jeder grosse Lappen seinen ganzen Ueberschuss nach aussen, und nach
 *   zwei Lappen ist die Grundform nicht mehr zu erkennen.
 */
export function lobesOnBase(w, h, o) {
  const P = { ...EDGE_DEF, ...(o || {}) };
  const r0 = Math.max(3, P.r0 * h);
  const wk = baseWalker(w, h, P.base, 0);
  const rnd = mulberry((P.seed | 0) * 2654435761 % 2147483647);
  const vary = varyer(rnd, P.seed);
  const step0 = Math.max(4, 2 * r0 * (1 - P.ov));
  /* MINDESTENS NEUN LAPPEN. Bei einer kleinen Blase (Innenraum 73 x 22 px) ergaben sechs Lappen
     einen Klumpen, keine Wolke — Georgs »okay-ish«. Die Wolke lebt von der ZAHL der Boegen; ist der
     Umfang kurz, werden die Lappen kleiner, nicht weniger. */
  const n = Math.max(9, Math.round(wk.per / step0));
  const step = wk.per / n;
  const out = [];
  for (let i = 0; i < n; i++) {
    const q = wk.at(i * step + (rnd() * 2 - 1) * P.wob * r0 * 0.6);
    const r = r0 * (1 + P.varr * vary(i));
    const dl = Math.hypot(q.x, q.y) || 1;
    const ins = P.inset * r;                       // eigener Radius, nicht ein gemeinsamer Einzug
    out.push({ x: q.x - (q.x / dl) * ins + (rnd() * 2 - 1) * P.wob * r0 * 0.5,
               y: q.y - (q.y / dl) * ins + (rnd() * 2 - 1) * P.wob * r0 * 0.5, r });
  }
  return out;
}

/** Der weiteste Kreisaustritt in Richtung `a`, von (cx,cy) aus. Das IST die Huelle. */
export function hullRadius(lobes, cx, cy, a) {
  const dx = Math.cos(a), dy = Math.sin(a);
  let best = 0;
  for (const L of lobes) {
    const vx = L.x - cx, vy = L.y - cy;
    const b = dx * vx + dy * vy;
    const disc = b * b - (vx * vx + vy * vy - L.r * L.r);
    if (disc <= 0) continue;
    const t = b + Math.sqrt(disc);
    if (t > best) best = t;
  }
  return best;
}

/** Die Huelle als Anfasser-Ring. Kerben (wo zwei Lappen sich treffen) sind ECKEN. */
export function hullRing(lobes, o) {
  const P = { ...EDGE_DEF, ...(o || {}) };
  const N = P.steps;
  let cx = 0, cy = 0;
  for (const L of lobes) { cx += L.x / lobes.length; cy += L.y / lobes.length; }
  const rad = new Float64Array(N);
  for (let i = 0; i < N; i++) rad[i] = hullRadius(lobes, cx, cy, (i / N) * Math.PI * 2);
  /* Kerben finden, aber nicht jedes Rauschen: Fenster ±5 Proben, Mindesttiefe 0,4 %. Sonst wird
     jede Rundungsunschaerfe zur Ecke und die Kantenfase fast die Wolke zu Tode. */
  const win = 5, cusp = [];
  for (let i = 0; i < N; i++) {
    let lo = true;
    for (let k = 1; k <= win; k++) if (rad[(i - k + N) % N] < rad[i] || rad[(i + k) % N] < rad[i]) { lo = false; break; }
    if (!lo) continue;
    if (Math.max(rad[(i - win + N) % N], rad[(i + win) % N]) - rad[i] > rad[i] * 0.004) cusp.push(i);
  }
  const keep = [];
  for (const i of cusp) if (!keep.length || ((i - keep[keep.length - 1] + N) % N) > win) keep.push(i);
  if (keep.length > 1 && ((keep[0] - keep[keep.length - 1] + N) % N) <= win) keep.pop();
  const at = (t) => { const i = ((Math.round(t) % N) + N) % N, a = (i / N) * Math.PI * 2; return { x: cx + Math.cos(a) * rad[i], y: cy + Math.sin(a) * rad[i] }; };
  const dens = Math.max(6, Math.round(N / (lobes.length * P.perLobe)));
  const pts = [];
  if (keep.length < 3) {
    for (let i = 0; i < N; i += dens) { const q = at(i); pts.push({ x: q.x, y: q.y, c: false }); }
  } else {
    for (let k = 0; k < keep.length; k++) {
      const i0 = keep[k], i1 = keep[(k + 1) % keep.length];
      const span = ((i1 - i0 + N) % N) || N;
      const q = at(i0); pts.push({ x: q.x, y: q.y, c: true });
      const K = Math.max(1, Math.round(span / dens));
      for (let j = 1; j < K; j++) { const p = at(i0 + (span * j) / K); pts.push({ x: p.x, y: p.y, c: false }); }
    }
  }
  return { pts, cx, cy, cusps: keep.length };
}

/* ── ZACKEN ──────────────────────────────────────────────────────────────────────────────────── */
/**
 * Dieselbe Konstruktion, nur mit Zacken: zwei Fuesse auf der Grundform, eine Spitze nach aussen,
 * dazwischen eine Schulter. Die Spitze zeigt RADIAL vom Mittelpunkt weg — eine Druckwelle laeuft von
 * der Schrift nach aussen, nicht senkrecht zur Kante (an einer breiten Blase waeren sonst oben und
 * unten alle Zacken parallel).
 *
 * @param {number} tailAng  Richtung des Zipfels in rad (die eine lange, schmale Zacke) · null = keiner
 */
export function spikeRing(w, h, o) {
  const P = { ...EDGE_DEF, ...(o || {}) };
  const wk = baseWalker(w, h, P.base, 0);
  const rnd = mulberry((P.seed | 0) * 40503 % 2147483647);
  const n = Math.max(6, P.spikes | 0);
  const step = wk.per / n;
  const R = Math.hypot(w, h) / 2;
  const L0 = P.len * R;
  /* Erst alle Laengen, dann die Breiten — die Breite haengt am Mittel aller Laengen, also braucht
     sie den ganzen Satz. Wechsel statt Zufall, wie bei den Lappen. */
  const vary = varyer(rnd, P.seed);
  const sp = [];
  for (let i = 0; i < n; i++) sp.push({ s: i * step + (rnd() * 2 - 1) * step * 0.16, L: 1 + P.lenVar * vary(i) });
  let tailIdx = -1;
  if (P.tailAng != null) {
    /* Der Zipfel ist die LAENGSTE und SCHMALSTE Zacke, und er sitzt dort, wo das Gesicht ist. Er
       wird nicht angehaengt, sondern eine bestehende Zacke wird dazu ERKLAERT — sonst hat die Form
       an einer Stelle zwei Spitzen uebereinander. */
    let best = 0, bd = Infinity;
    for (let i = 0; i < n; i++) {
      const q = wk.at(sp[i].s);
      const a = Math.atan2(q.y, q.x);
      let d = Math.abs(((a - P.tailAng + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < bd) { bd = d; best = i; }
    }
    tailIdx = best;
    let maxL = 0; for (const q of sp) maxL = Math.max(maxL, q.L);
    sp[tailIdx].L = maxL * 1.24;
    sp[tailIdx].tail = true;
  }
  const mean = sp.reduce((a, q) => a + q.L, 0) / n;
  const pts = [];
  const put = (x, y, c) => pts.push({ x, y, c: !!c });
  for (let i = 0; i < n; i++) {
    const q = sp[i];
    /* LANG HEISST SCHMAL: die Winkelbreite folgt (Mittel/Laenge)^1,1, der Zipfel bekommt zusaetzlich
       0,72 — er darf nicht so breit sein wie die Zacken (Georgs Befund an der v4-Explosion). */
    const rel = Math.pow(mean / q.L, 1.1) * (q.tail ? 0.72 : 1);
    /* EINE ZACKE DARF NICHT SCHMALER SEIN ALS IHRE FEDER (Befund 25.8., Georgs »scream is broken«).
       Der Zipfel bekommt 0,72 auf die Breite — bei einer kleinen Blase wurde sein Fuss damit
       schmaler als das Band, und die Tusche von links und rechts floss zu einem schwarzen Keil
       zusammen, der quer durch den Satz lief. Also eine Untergrenze in PIXELN, aus der Federbreite:
       Fuss >= 3,2 x Feder. */
    const hwMin = Math.max(2, (P.penHint || 2) * 1.6);
    const hw = Math.max(hwMin, step * 0.5 * Math.max(0.18, Math.min(0.92, P.wide * rel)));
    const a = wk.at(q.s - hw), b = wk.at(q.s + hw), c0 = wk.at(q.s);
    const dl = Math.hypot(c0.x, c0.y) || 1;
    const tip = { x: c0.x + (c0.x / dl) * L0 * q.L, y: c0.y + (c0.y / dl) * L0 * q.L };
    put(a.x, a.y, true); put(tip.x, tip.y, true); put(b.x, b.y, true);    /* Die Schulter liegt ZWISCHEN zwei Zacken, ein Stueck nach aussen: ohne sie liest das Tal als
       Falte. Sie ist ein Kurvenpunkt — das Tal ist rund, die Spitze nicht. Auch sie ist radial
       gerichtet, damit die Grundform durch die Taeler hindurch lesbar bleibt. */
    const mid = wk.at(q.s + step * 0.5);
    const ml = Math.hypot(mid.x, mid.y) || 1;
    put(mid.x + (mid.x / ml) * R * P.shoulder, mid.y + (mid.y / ml) * R * P.shoulder, false);
  }
  return { pts, tailIdx };
}

/* ── Der Vertrag nach aussen ─────────────────────────────────────────────────────────────────── */
/**
 * Dieselbe Rueckgabe wie `shapeForBox` im Shaper: Punkte in Pixeln mit Nullpunkt oben links, dazu
 * der Innenraum, in dem der Satz steht. Der Innenraum IST die Grundform.
 *
 * @param {number} wantW Breite der Grundform (Satzblock + Innenabstand)
 * @param {number} wantH Hoehe der Grundform
 * @param {object} o     EDGE_DEF-Felder · tailAng (rad, nur 'spikes')
 */
export function edgeForBox(wantW, wantH, o) {
  const P = { ...EDGE_DEF, ...(o || {}) };
  let ring, lobes = null;
  if (P.treat === 'spikes') {
    ring = spikeRing(wantW, wantH, P);
  } else if (P.treat === 'plain') {
    const wk = baseWalker(wantW, wantH, P.base, 0);
    const n = P.base === 'oval' ? 24 : 4;
    const pts = [];
    for (let i = 0; i < n; i++) { const q = wk.at((i / n) * wk.per); pts.push({ x: q.x, y: q.y, c: P.base !== 'oval' }); }
    ring = { pts };
  } else {
    lobes = lobesOnBase(wantW, wantH, P);
    ring = hullRing(lobes, P);
  }
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const p of ring.pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
  return {
    pts: ring.pts.map((p) => ({ x: p.x - minX, y: p.y - minY, c: p.c })),
    w: maxX - minX, h: maxY - minY,
    inner: { cx: -minX, cy: -minY, w: wantW, h: wantH },
    lobes: lobes ? lobes.map((L) => ({ x: L.x - minX, y: L.y - minY, r: L.r })) : null,
    cusps: ring.cusps == null ? null : ring.cusps,
    treat: P.treat, base: P.base,
  };
}

/**
 * Der Zeiger der Denkblase: zwei bis drei kleine Kreise, in der Groesse abnehmend, auf der Linie
 * von der Blase zum Kopf. Keine Pfeilspitze — eine Denkblase hat keinen Zipfel, sie hat eine Spur.
 * Rueckgabe in derselben Ebene wie die Blasenpunkte.
 *
 * @param {object} from  {x,y} Rand der Blase (Ausgangspunkt)
 * @param {object} to    {x,y} Ziel (Gesicht)
 * @param {object} o     n (2|3) · r0 (Radius des ersten) · fall (Abnahme je Kreis) · breath (0..1)
 */
export function traceCircles(from, to, o) {
  const P = { n: 3, r0: 7, fall: 0.66, gap: 1.5, breath: 0, ...(o || {}) };
  let dx = to.x - from.x, dy = to.y - from.y;
  const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
  const out = [];
  let d = 0, r = P.r0;
  for (let i = 0; i < P.n; i++) {
    d += r * P.gap;
    /* ATMEN, NICHT WANDERN (Georgs Wahl 25.8.): die Kreise liegen FEST auf der Linie zum Kopf und
       aendern nur ihren Radius, jeder mit eigener Phase. Wer sie wandern laesst, baut eine zweite
       Bewegung neben die traege Blase — und zwei Bewegungen auf einer Achse lesen als Zittern. */
    const br = 1 + P.breath * 0.14 * Math.sin(P.phase == null ? 0 : P.phase - i * 0.9);
    out.push({ x: from.x + dx * d, y: from.y + dy * d, r: r * br });
    d += r * P.gap * 0.15;
    r *= P.fall;
  }
  return out;
}
