/* bubbles.v4.js — Neubau nach Georgs fuenf Basistypen (Screenshots 24.8., 22:13/22:14).
   ═══════════════════════════════════════════════════════════════════════════════════════════════
   DIE FUENF TYPEN, wie sie in seinen Ausschnitten stehen:

     burst  — Stern, Spitzen UNGLEICH lang und ungleich breit, EINE lange Spitze ist der Zipfel
     cloud  — Wolke aus vielen runden Lappen, dazu drei abnehmende Kreise als Spur
     fan     — Trapez mit gewoelbter Ober- und Unterkante, schmaler Zipfel mit Kerbe
     round   — abgerundetes Rechteck, schmaler schraeger Zipfel
     rect    — Rechteck mit fast scharfen Ecken, Zipfel als schmales Dreieck

   GEMEINSAM (und das ist die Sprache, nicht die Form):
     · EINE Strichstaerke, flache Fuellung, WEICHER Schatten nach unten rechts
     · der Zipfel ist SCHMAL und KLEIN: zwei Ankerpunkte, zwei gerade Linien, eine Spitze
     · Kontur-Varianten: durchgezogen · gepunktet · gestrichelt · nur Schatten (ohne Kontur)

   v3 ist verworfen: Tuscheband mit veraenderlicher Breite, Wobble, Eck-Daempfung, Krone auf
   Rechteck, Pueffe-Kette. Hier wird mit BOGENBEFEHLEN gezeichnet, nicht mit Punktwolken.
*/

export const VERSION = 4;
export const TYPES = ['round', 'rect', 'fan', 'cloud', 'burst'];
export const OUTLINES = ['solid', 'dotted', 'dashed', 'shadow'];
export const DIRS = ['down', 'down-left', 'left', 'up-left', 'up', 'up-right', 'right', 'down-right'];

const TAU = Math.PI * 2;
const f = (n) => Math.round(n * 100) / 100;
const D2R = (d) => (d * Math.PI) / 180;
const ANG = { right: 0, 'down-right': 45, down: 90, 'down-left': 135, left: 180, 'up-left': 225, up: 270, 'up-right': 315 };

/* Blindtext, der zur Sache passt: kurz wie eine Replik, nicht wie ein Absatz. */
export const LOREM = { loud: 'Lorem!', mid: 'Lorem ipsum', soft: 'lorem ipsum dolor', long: 'Lorem ipsum dolor sit amet' };

export const VOICE = {
  loud: { family: "'Bangers', cursive",       size: 34, weight: 400, letter: 0.5, italic: false },
  mid:  { family: "'Shantell Sans', cursive", size: 22, weight: 600, letter: 0,   italic: false },
  soft: { family: "'Shantell Sans', cursive", size: 17, weight: 400, letter: 0,   italic: true  },
};

let _mc = null;
function measure(text, v) {
  const lines = String(text == null ? '' : text).split('\n');
  if (!_mc) { try { _mc = document.createElement('canvas').getContext('2d'); } catch (e) { _mc = null; } }
  if (!_mc) return { w: Math.max(...lines.map((l) => l.length)) * v.size * 0.52, h: lines.length * v.size * 1.2, lines };
  _mc.font = (v.italic ? 'italic ' : '') + v.weight + ' ' + v.size + 'px ' + v.family;
  return { w: Math.max(...lines.map((l) => _mc.measureText(l).width)), h: lines.length * v.size * 1.2, lines };
}

let _svgPool = null;
function samplePath(d, step) {
  if (typeof document === 'undefined') return null;
  if (!_svgPool) {
    _svgPool = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _svgPool.setAttribute('width', '0'); _svgPool.setAttribute('height', '0');
    _svgPool.style.cssText = 'position:absolute;left:-9999px;width:0;height:0';
    document.body.appendChild(_svgPool);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  _svgPool.appendChild(p);
  let L = 0;
  try { L = p.getTotalLength(); } catch (e) { L = 0; }
  if (!L) { p.remove(); return null; }
  const n = Math.max(48, Math.min(1200, Math.round(L / (step || 2.4))));
  const pts = [];
  for (let i = 0; i < n; i++) {
    const q = p.getPointAtLength((i / n) * L);
    pts.push({ x: q.x, y: q.y });
  }
  p.remove();
  return { pts, len: L };
}

/** Band um eine abgetastete Mittellinie. Gibt einen Pfad mit evenodd-Fuellung zurueck. */
function inkBand(d, base, opts) {
  const S = samplePath(d, opts && opts.step);
  if (!S) return null;
  const pts = S.pts, n = pts.length;
  const light = { x: -0.62, y: -0.78 };
  const weight = opts && opts.weight != null ? opts.weight : 0.30;
  const breathA = opts && opts.breath != null ? opts.breath : 0.17;
  const ph = (opts && opts.phase) || 0;
  const outer = [], inner = [];
  let wMin = Infinity, wMax = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], p = pts[i];
    let tx = b.x - a.x, ty = b.y - a.y;
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const nx = ty, ny = -tx;
    // Scharfe Ecke? Dann Band schmaler, sonst schneidet es sich selbst.
    const a2 = pts[(i - 3 + n) % n], b2 = pts[(i + 3) % n];
    let ux = p.x - a2.x, uy = p.y - a2.y, vx = b2.x - p.x, vy = b2.y - p.y;
    const ul = Math.hypot(ux, uy) || 1, vl = Math.hypot(vx, vy) || 1;
    const cosT = (ux / ul) * (vx / vl) + (uy / ul) * (vy / vl);
    const corner = cosT < 0.2 ? 0.74 : cosT < 0.7 ? 0.88 : 1;
    const lightDot = nx * light.x + ny * light.y;
    const breath = 1 + breathA * Math.sin((i / n) * TAU * 2.1 + ph);
    const half = (base / 2) * corner * breath * (1 + weight * -lightDot);
    wMin = Math.min(wMin, half * 2); wMax = Math.max(wMax, half * 2);
    outer.push({ x: p.x + nx * half, y: p.y + ny * half });
    inner.push({ x: p.x - nx * half, y: p.y - ny * half });
  }
  const loop = (list, rev) => {
    const L = rev ? list.slice().reverse() : list;
    return L.map((q, i) => (i ? 'L' : 'M') + f(q.x) + ' ' + f(q.y)).join('') + 'Z';
  };
  return { d: loop(outer, false) + loop(inner, true), min: f(wMin), max: f(wMax), span: f(wMax / Math.max(0.01, wMin)) };
}

function mulberry(seed) {
  let a = (seed || 1) >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ── ZIPFEL ─────────────────────────────────────────────────────────────────────────────────────
   Zwei Ankerpunkte auf der Kontur, zwei GERADE Linien, eine Spitze. Er sitzt immer auf der Kante,
   die zum Ziel schaut, und ist klein: Fuss ~11 % der Breite, Laenge ~0,40 der Hoehe. */
function tailSeg(ax, ay, tx, ty, bx, by) {
  return 'L' + f(ax) + ' ' + f(ay) + 'L' + f(tx) + ' ' + f(ty) + 'L' + f(bx) + ' ' + f(by);
}

/** Rechteck-Familie (round · rect · fan): eine Kante traegt den Zipfel.
 *  `r` = Eckradius, `bowT`/`bowB` = Woelbung der Ober-/Unterkante, `slant` = Schraege der Seiten. */
function boxFamily(w, h, deg, o) {
  const r = o.r, bowT = o.bowT || 0, bowB = o.bowB || 0, slant = o.slant || 0;
  const x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
  const a = D2R(deg), dx = Math.cos(a), dy = Math.sin(a);
  const side = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'bottom' : 'top');
  const vert = side === 'left' || side === 'right';
  const edge = vert ? h : w;                            // die Kante, auf der der Zipfel sitzt
  const foot = Math.max(vert ? 12 : 9, edge * (vert ? 0.22 : 0.12));
  const len = Math.max(15, (vert ? w : h) * (vert ? 0.20 : 0.34));
  // Fusspunkt entlang der Kante: Diagonalen ruecken aus der Mitte, gerade Richtungen bleiben mittig.
  const offX = Math.max(x0 + r + foot, Math.min(x1 - r - foot, dx * w * 0.26));
  const offY = Math.max(y0 + r + foot, Math.min(y1 - r - foot, dy * h * 0.26));
  const lean = 0.55;                                   // die Spitze lehnt zum Ziel
  const tl = { x: x0, y: y0 }, tr = { x: x1, y: y0 };
  const bl = { x: x0 + slant, y: y1 }, br = { x: x1 - slant, y: y1 };
  let d = 'M' + f(tl.x + r) + ' ' + f(tl.y);
  // Oberkante (gewoelbt, wenn bowT)
  if (side === 'top') {
    const m = offX, tipX = m + dx * len * lean, tipY = y0 - len;
    d += 'L' + f(m - foot / 2) + ' ' + f(y0) + tailSeg(m - foot / 2, y0, tipX, tipY, m + foot / 2, y0);
    d += 'L' + f(tr.x - r) + ' ' + f(tr.y);
  } else if (bowT) {
    d += 'Q' + f(0) + ' ' + f(y0 - bowT) + ' ' + f(tr.x - r) + ' ' + f(tr.y);
  } else {
    d += 'L' + f(tr.x - r) + ' ' + f(tr.y);
  }
  d += 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x1) + ' ' + f(y0 + r);
  // rechte Kante
  if (side === 'right') {
    const m = offY, tipX = x1 + len, tipY = m + dy * len * lean;
    d += 'L' + f(x1) + ' ' + f(m - foot / 2) + tailSeg(x1, m - foot / 2, tipX, tipY, x1, m + foot / 2);
  }
  d += 'L' + f(br.x) + ' ' + f(y1 - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(br.x - r) + ' ' + f(y1);
  // Unterkante, rueckwaerts
  if (side === 'bottom') {
    const m = offX, tipX = m + dx * len * lean, tipY = y1 + len;
    const yb = (xq) => (bowB ? y1 + bowB * (1 - Math.pow((2 * xq) / Math.max(1, w), 2)) : y1);
    const ar = m + foot / 2, al = m - foot / 2;
    // rechte Haelfte der Unterkante, dann Zipfel, dann linke Haelfte — die Woelbung laeuft weiter.
    if (bowB) d += 'Q' + f((br.x - r + ar) / 2) + ' ' + f(yb((br.x - r + ar) / 2) + bowB * 0.5) + ' ' + f(ar) + ' ' + f(yb(ar));
    else d += 'L' + f(ar) + ' ' + f(y1);
    d += tailSeg(ar, yb(ar), tipX, tipY, al, yb(al));
    if (bowB) d += 'Q' + f((al + bl.x + r) / 2) + ' ' + f(yb((al + bl.x + r) / 2) + bowB * 0.5) + ' ' + f(bl.x + r) + ' ' + f(y1);
    else d += 'L' + f(bl.x + r) + ' ' + f(y1);
  } else if (bowB) {
    d += 'Q' + f(0) + ' ' + f(y1 + bowB) + ' ' + f(bl.x + r) + ' ' + f(y1);
  } else {
    d += 'L' + f(bl.x + r) + ' ' + f(y1);
  }
  d += 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(bl.x) + ' ' + f(y1 - r);
  // linke Kante, rueckwaerts
  if (side === 'left') {
    const m = offY, tipX = x0 - len, tipY = m + dy * len * lean;
    d += 'L' + f(x0) + ' ' + f(m + foot / 2) + tailSeg(x0, m + foot / 2, tipX, tipY, x0, m - foot / 2);   // linke Kante
  }
  d += 'L' + f(x0) + ' ' + f(y0 + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(tl.x + r) + ' ' + f(tl.y) + 'Z';
  /* Ausdehnung: Grundform plus die Spitze, gemessen — in der Richtung, in der sie wirklich liegt. */
  let ex = w / 2, ey = h / 2;
  if (side === 'top' || side === 'bottom') { ex = Math.max(ex, Math.abs(offX) + foot / 2 + Math.abs(dx * len * lean)); ey = Math.max(ey, h / 2 + len); }
  else { ex = Math.max(ex, w / 2 + len); ey = Math.max(ey, Math.abs(offY) + foot / 2 + Math.abs(dy * len * lean)); }
  if (bowT) ey = Math.max(ey, h / 2 + bowT * 0.5);
  if (bowB) ey = Math.max(ey, h / 2 + bowB * 0.5);
  return { d, foot, len, ext: { x: ex, y: ey } };
}

/** Wolke: Girlande aus Kreisboegen. Nahtpunkte AUF der Ellipse, jeder Bogen beult nach aussen,
 *  Radien ungleich — genau die Konstruktion des Zeichners, keine Kreisvereinigung. */
function cloudPath(w, h, N, rng) {
  const rx = w / 2, ry = h / 2, P = [];
  const lobes = [];
  let bulge = 0;
  for (let i = 0; i < N; i++) { const t = (i / N) * TAU; P.push({ x: Math.cos(t) * rx, y: Math.sin(t) * ry }); }
  let d = 'M' + f(P[0].x) + ' ' + f(P[0].y);
  for (let i = 0; i < N; i++) {
    const a = P[i], b = P[(i + 1) % N];
    const r = (Math.hypot(b.x - a.x, b.y - a.y) / 2) * (1.03 + rng() * 0.45);
    d += 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(b.x) + ' ' + f(b.y);
    // Beulung des Bogens ueber der Sehne: r − sqrt(r² − (Sehne/2)²)
    const chord = Math.hypot(b.x - a.x, b.y - a.y) / 2;
    bulge = Math.max(bulge, r - Math.sqrt(Math.max(0, r * r - chord * chord)));
  }
  return { d: d + 'Z', ext: { x: rx + bulge, y: ry + bulge } };
}

/** EXPLOSION (scream/burst). Georgs mentales Modell, 24.8.: das Zentrum liegt im TEXT, und was man
 *  sieht, sind STRAHLEN von dort nach aussen — kein Zickzack auf einer Ellipse.
 *
 *  Daraus folgen drei Dinge, die vorher falsch waren:
 *    1 · Jeder Strahl hat eine eigene LAENGE **und** eine eigene WINKELBREITE. Ein langer Strahl ist
 *        SCHMAL (eine Druckwelle laeuft spitz aus), ein kurzer darf breit sein: w ~ (mittel/L)^1,1.
 *    2 · Der Zipfel ist der laengste Strahl und deshalb der SCHMALSTE — vorher war er so breit wie
 *        seine Nachbarn (Georgs Befund: »Pfeil darf nicht so breit sein wie Zacken«).
 *    3 · Zwischen zwei Strahlen liegt der KERN, und der ist rund. Ohne diesen Schulterpunkt entstehen
 *        die »physikalisch unlogischen« Zacken: zwei Taeler direkt nebeneinander lesen als Falte.
 */
function burstPath(w, h, N, deg, rng) {
  const rx = w / 2, ry = h / 2, a0 = D2R(deg);
  const rr = (rx + ry) / 2;                              // Strahlen: radial. Kern: elliptisch.
  const step = TAU / N;
  const at = (ang, k) => ({ x: Math.cos(ang) * rx * k, y: Math.sin(ang) * ry * k });
  const ray = (ang, k) => ({ x: Math.cos(ang) * rr * k, y: Math.sin(ang) * rr * k });
  const core = 0.56;

  /* Durchgang 1: die Zacken. Jede bekommt Laenge und Winkelbreite (lang → schmal), und ihr
     GEMESSENER Fuss wird gemerkt — daran haengt die Zipfelbreite. */
  const rays = [];
  for (let i = 0; i < N; i++) {
    const ang = a0 + i * step + (i === 0 ? 0 : (rng() - 0.5) * step * 0.34);
    rays.push({ ang, L: 0.78 + rng() * 0.66, tail: i === 0 });
  }
  const mean = rays.reduce((x, r) => x + r.L, 0) / N;
  let maxL = 0;
  for (const r of rays) if (!r.tail) maxL = Math.max(maxL, r.L);
  const feet = [];
  for (const r of rays) {
    if (r.tail) continue;
    const rel = Math.pow(mean / r.L, 1.1);
    const wA = step * Math.max(0.20, Math.min(0.80, 0.58 * rel));
    r.a = at(r.ang - wA / 2, core * (0.92 + rng() * 0.18));
    r.b = at(r.ang + wA / 2, core * (0.92 + rng() * 0.18));
    r.tip = ray(r.ang, r.L);
    r.foot = Math.hypot(r.b.x - r.a.x, r.b.y - r.a.y);
    feet.push(r.foot);
  }
  /* GEORGS REGEL: der Pfeil ist nicht so breit wie die Zacken. Also wird sein Fuss AUS DEN
     GEMESSENEN Zackenfuessen abgeleitet — 0,60 × Median, Untergrenze 7 — und nicht aus einem Anteil
     der kurzen Achse. Eine feste Zahl hat beim Beheben der Nadel in die andere Richtung
     ueberschossen: der Zipfel war danach der BREITESTE Fuss (gemessen 16,4 gegen Median 14,3). */
  feet.sort((x, y) => x - y);
  const med = feet.length ? feet[Math.floor(feet.length / 2)] : 12;
  const tailFoot = Math.max(8, med * 0.72);
  const t = rays.find((r) => r.tail);
  {
    const c = at(t.ang, core);
    const px = -Math.sin(t.ang), py = Math.cos(t.ang);    // quer zur Strahlrichtung
    t.a = { x: c.x - px * tailFoot / 2, y: c.y - py * tailFoot / 2 };
    t.b = { x: c.x + px * tailFoot / 2, y: c.y + py * tailFoot / 2 };
    const L = rr * maxL * 1.14;                           // in JEDER Richtung 1,30 × der laengste Strahl
    t.tip = { x: Math.cos(a0) * L, y: Math.sin(a0) * L };
    t.foot = tailFoot;
  }

  /* Durchgang 2: der Pfad. Zwischen zwei Strahlen liegt eine Schulter IM KERN — ohne sie lesen zwei
     Taeler nebeneinander als Falte (Georgs »physikalisch unlogisch gebaut«). */
  const P = [];
  for (let i = 0; i < N; i++) {
    const r = rays[i], nxt = rays[(i + 1) % N];
    P.push(r.a, r.tip, r.b);
    const nextAng = i === N - 1 ? nxt.ang + TAU : nxt.ang;
    P.push(at((r.ang + nextAng) / 2, core * 1.10));
  }
  let ex = 0, ey = 0;
  for (const p of P) { ex = Math.max(ex, Math.abs(p.x)); ey = Math.max(ey, Math.abs(p.y)); }
  return {
    d: P.map((p, i) => (i ? 'L' : 'M') + f(p.x) + ' ' + f(p.y)).join('') + 'Z',
    ext: { x: ex, y: ey }, rays, verts: P.slice(),
    feet: { tail: f(tailFoot), median: f(med), max: f(Math.max(...feet)) },
  };
}


/* ── ZIPFEL ─────────────────────────────────────────────────────────────────────────────────────
   Zwei Ankerpunkte auf der Kontur, zwei GERADE Linien, eine Spitze. Er sitzt immer auf der Kante,
   die zum Ziel schaut, und ist klein: Fuss ~11 % der Breite, Laenge ~0,40 der Hoehe. */
const OUT = {
  solid:  { dash: null,      stroke: true,  label: 'solid' },
  dotted: { dash: '1.6 5.4', stroke: true,  label: 'dotted' },
  dashed: { dash: '9 6',     stroke: true,  label: 'dashed' },
  shadow: { dash: null,      stroke: false, label: 'nur Schatten' },
};

/**
 * Eine Blase bauen.
 * @param {object} o type · dir · text · voice · outline · seed · stroke · pad · shadow
 */
export function buildBubble(o = {}) {
  const type = TYPES.includes(o.type) ? o.type : 'rect';
  const dir = DIRS.includes(o.dir) ? o.dir : 'down';
  const deg = ANG[dir];
  const v = VOICE[o.voice] || VOICE.mid;
  const rng = mulberry(o.seed == null ? 7 : o.seed);
  const T = measure(o.text == null ? LOREM.mid : o.text, v);
  const pad = o.pad == null ? 1 : o.pad;
  const stroke = o.stroke == null ? 3.6 : o.stroke;
  const ol = OUT[o.outline] || OUT.solid;
  const padX = v.size * 0.95 * pad, padY = v.size * 0.62 * pad;

  let w, h, path, circles = [], geo = {}, ext = null;
  if (type === 'round' || type === 'rect' || type === 'fan') {
    w = Math.max(96, T.w + padX * 2);
    h = Math.max(50, T.h + padY * 2);
    const cfg = type === 'round' ? { r: Math.min(w, h) * 0.19 }
              : type === 'rect'  ? { r: Math.min(w, h) * 0.05 }
              : { r: Math.min(w, h) * 0.09, bowT: h * 0.20, bowB: h * 0.14, slant: w * 0.09 };
    if (type === 'fan') { w *= 1.04; h *= 1.10; }
    geo = boxFamily(w, h, deg, cfg);
    path = geo.d; ext = geo.ext;
  } else if (type === 'cloud') {
    w = Math.max(104, (T.w + padX * 1.5) * 1.30);
    h = Math.max(58, (T.h + padY * 1.5) * 1.30);
    const N = Math.max(7, Math.round((w + h) / 34));
    const cl = cloudPath(w, h, N, rng);
    path = cl.d; ext = cl.ext; geo = { lobes: N };
    const a = D2R(deg), rx = w / 2, ry = h / 2;
    let cr = Math.min(w, h) * 0.105;
    let cx = Math.cos(a) * rx + Math.cos(a) * cr * 2.6;
    let cy = Math.sin(a) * ry + Math.sin(a) * cr * 2.6;
    for (let i = 0; i < 3; i++) {
      circles.push({ cx: f(cx), cy: f(cy), r: f(cr) });
      const nr = cr * 0.62, gap = (cr + nr) * 0.30;
      cx += Math.cos(a) * (cr + nr + gap); cy += Math.sin(a) * (cr + nr + gap); cr = nr;
    }
  } else {
    w = Math.max(112, (T.w + padX * 1.4) * 1.46);
    h = Math.max(64, (T.h + padY * 1.4) * 1.46);
    const bu = burstPath(w, h, 9, deg, rng);
    path = bu.d; ext = bu.ext; geo = { rays: bu.rays, verts: bu.verts };
  }

  /* Bildkasten symmetrisch um (0,0) — damit die Schrift mittig sitzt —, aber aus der GEMESSENEN
     Ausdehnung, nicht aus einem Zuschlag. */
  let ex = ext ? ext.x : w / 2, ey = ext ? ext.y : h / 2;
  if (type === 'cloud') for (const c of circles) { ex = Math.max(ex, Math.abs(c.cx) + c.r); ey = Math.max(ey, Math.abs(c.cy) + c.r); }
  const m = stroke * 1.4 + 3;
  const box = { x: f(-ex - m), y: f(-ey - m), w: f((ex + m) * 2), h: f((ey + m) * 2) };

  /* KFB-Feder als Band. `pen: 'flat'` bleibt als Rueckweg (gleichmaessige Linie, Blatt-2-Optik). */
  let band = null, bandCircles = [];

  return {
    type, dir, path, circles, box, stroke, geo,
    /* Gewicht: zweiter Strich, in die Schattenrichtung versetzt. Licht oben links → unten rechts
       dicker. Der Versatz ist klein: er soll Gewicht geben, keine zweite Linie zeigen. */
    weight: { dx: f(stroke * 0.30), dy: f(stroke * 0.36) },
    dash: ol.dash, stroked: ol.stroke, outline: ol.label,
    /* Harter Schatten, Kanon §7: Versatz ohne Weichzeichnung. */
    /* Schatten: WEICH und grau, wie auf Georgs Blatt 2 — nicht schwarz. */
    shadow: o.shadow === false ? null : { dx: f(stroke * (type === 'burst' ? 0.9 : 1.5)), dy: f(stroke * (type === 'burst' ? 1.1 : 1.8)), color: 'rgba(34,30,24,.17)', blur: 0 },
    fill: o.fill || '#fefcf6',
    ink: o.ink || '#171613',
    font: v, text: T.lines.join('\n'),
    metrics: { w: f(w), h: f(h), textW: f(T.w), textH: f(T.h), foot: geo.foot ? f(geo.foot) : null, len: geo.len ? f(geo.len) : null, box: [box.w, box.h] },
  };
}



/* ── ANFASSER: die Form gibt ihre eigenen Punkte heraus ─────────────────────────────────────────
   Georgs Befund 24.8.: im Shaper standen ZWEI Anfasser auf der Zipfelspitze, und auf den geraden
   Zipfellinien lagen Kurvenpunkte. Beides kam davon, dass ich die Punkte aus dem gezeichneten Pfad
   GEMESSEN habe. Messen kann Vertices nicht erhalten — und es muss auch niemand messen: der
   Generator WEISS, wo Spitze, Schultern, Rundungen und Zacken liegen.

   Regel: eine gerade Kante hat GENAU ZWEI Punkte (ihre Enden). Ein Bogen hat zwei Kurvenpunkte
   (Anfang, Ende) und keinen dazwischen. Der Zipfel hat drei ECKEN: Schulter, Spitze, Schulter.
   c = true heisst Ecke (Tangente bricht), c = false heisst Kurvenpunkt. */
export function buildAnchors(o = {}) {
  const type = TYPES.includes(o.type) ? o.type : 'rect';
  const dirName = DIRS.includes(o.dir) ? o.dir : 'down-left';
  const deg = ANG[dirName];
  const b = buildBubble(Object.assign({}, o, { type, dir: dirName }));
  const w = b.metrics.w, h = b.metrics.h;
  const g = { r: type === 'round' ? Math.min(w, h) * 0.19 : type === 'fan' ? Math.min(w, h) * 0.09 : Math.min(w, h) * 0.05,
              lobes: b.geo && b.geo.lobes, rays: b.geo && b.geo.rays };
  const a = D2R(deg), dx = Math.cos(a), dy = Math.sin(a);
  const P = [];
  const put = (x, y, c) => P.push({ x, y, c: !!c });

  if (type === 'cloud') {
    /* Girlande: Naht = Ecke (Cusp, dort treffen zwei Boegen), dazwischen DREI Kurvenpunkte auf dem
       echten Lappenbogen — mit nur Naht + Scheitel wird die Wolke im Editor ein Achteck. */
    const N = g.lobes || Math.max(7, Math.round((w + h) / 34)), rx = w / 2, ry = h / 2;
    const seam = (i) => { const a2 = (i / N) * TAU; return { x: Math.cos(a2) * rx, y: Math.sin(a2) * ry }; };
    for (let i = 0; i < N; i++) {
      const A = seam(i), B = seam(i + 1);
      const chord = Math.hypot(B.x - A.x, B.y - A.y);
      const R = (chord / 2) * 1.16;                          // > halbe Sehne: es gibt einen Bogen
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      // Kreismitte liegt auf der Mittelsenkrechten, INNEN (dann beult der Bogen nach aussen)
      let px = -(B.y - A.y) / (chord || 1), py = (B.x - A.x) / (chord || 1);
      if (px * mx + py * my > 0) { px = -px; py = -py; }
      const dd = Math.sqrt(Math.max(0, R * R - (chord / 2) * (chord / 2)));
      const cx = mx + px * dd, cy = my + py * dd;
      const a0 = Math.atan2(A.y - cy, A.x - cx);
      let a1 = Math.atan2(B.y - cy, B.x - cx);
      while (a1 <= a0) a1 += TAU;
      put(A.x, A.y, true);                                   // Naht = Cusp
      for (let k = 1; k <= 3; k++) {
        const aa = a0 + ((a1 - a0) * k) / 4;
        put(cx + Math.cos(aa) * R, cy + Math.sin(aa) * R, false);
      }
    }
    return { pts: P, w, h, note: 'Naht = Ecke, drei Kurvenpunkte je Lappenbogen' };
  }

  if (type === 'burst') {
    /* Genau die Pfadpunkte des Sterns, in Pfadreihenfolge. Jeder ist eine Ecke. */
    const V = (g.verts && g.verts.length) ? g.verts : null;
    if (V) { for (const p of V) put(p.x, p.y, true); }
    else {
      const rays = g.rays || [];
      for (let i = 0; i < rays.length; i++) {
        const rr2 = rays[i];
        put(rr2.a.x, rr2.a.y, true); put(rr2.tip.x, rr2.tip.y, true); put(rr2.b.x, rr2.b.y, true);
      }
    }
    if (P.length < 3) { put(-w / 2, -h / 2, true); put(w / 2, -h / 2, true); put(w / 2, h / 2, true); put(-w / 2, h / 2, true); }
    return { pts: P, w, h, note: 'jeder Sternpunkt eine Ecke, Reihenfolge wie im Pfad' };
  }

  /* Kasten-Familie (rect · round · fan): vier Rundungen, vier Kanten, ein Zipfel. */
  const x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
  const r = g.r || Math.min(w, h) * 0.2;
  const vert = Math.abs(dx) > Math.abs(dy);
  const side = vert ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'bottom' : 'top');
  const edge = vert ? h : w;
  const foot = Math.max(vert ? 12 : 9, edge * (vert ? 0.22 : 0.12));
  const len = Math.max(15, (vert ? w : h) * (vert ? 0.20 : 0.34));
  const offX = Math.max(x0 + r + foot, Math.min(x1 - r - foot, dx * w * 0.26));
  const offY = Math.max(y0 + r + foot, Math.min(y1 - r - foot, dy * h * 0.26));
  const lean = 0.55;
  const tail = (ax, ay, tx, ty, bx, by) => { put(ax, ay, true); put(tx, ty, true); put(bx, by, true); };

  put(x0 + r, y0, false);                                   // Ende der Rundung oben links
  if (side === 'top') tail(offX - foot / 2, y0, offX + dx * len * lean, y0 - len, offX + foot / 2, y0);
  put(x1 - r, y0, false); put(x1, y0 + r, false);            // Rundung oben rechts
  if (side === 'right') tail(x1, offY - foot / 2, x1 + len, offY + dy * len * lean, x1, offY + foot / 2);
  put(x1, y1 - r, false); put(x1 - r, y1, false);            // Rundung unten rechts
  if (side === 'bottom') tail(offX + foot / 2, y1, offX + dx * len * lean, y1 + len, offX - foot / 2, y1);
  put(x0 + r, y1, false); put(x0, y1 - r, false);             // Rundung unten links
  if (side === 'left') tail(x0, offY + foot / 2, x0 - len, offY + dy * len * lean, x0, offY - foot / 2);
  put(x0, y0 + r, false);
  return { pts: P, w, h, foot, len, note: 'gerade Kante = zwei Punkte, Zipfel = drei Ecken' };
}

export default { VERSION, TYPES, OUTLINES, DIRS, VOICE, buildBubble };
