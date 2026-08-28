// ============================================================================
// kfb-ink-canon.js — die KFB-Kartenkante als Referenz-Implementierung
// SSOT: skills/SSOT_Card_Ink_Outline_v2.md · Stand 2026-07-25 · KANON-VERSION 2
// ----------------------------------------------------------------------------
// Dies ist der Code, auf den die SSOT zeigt. Wer eine KFB-Karte baut, importiert
// diese Datei — er schreibt keine eigene Jitter-Schleife. Kein three.js, kein DOM
// außer `<canvas>`: die Tusche entsteht in 2D und wird als Textur hochgeladen.
//
// ┌─ DIE EINE REGEL ─────────────────────────────────────────────────────────┐
// │ Die Tusche liegt auf der BILDEBENE, nicht in der Welt. Eine gezeichnete   │
// │ Linie auf Papier hat überall dieselbe Feder — unabhängig von Tiefe,       │
// │ Winkel und Licht.                                                        │
// └──────────────────────────────────────────────────────────────────────────┘
//
// ES GIBT ZWEI FAMILIEN, UND SIE SIND NICHT AUSTAUSCHBAR:
//
//   BAND   (`brushLoop` + `inkRibbon2D`)  → KARTEN und Comic-Panels
//          Wobble = zwei langwellige Sinus über den Umfang, an den Ecken
//          ausgefadet. Gezeichnet als GEFÜLLTES Band zwischen zwei Offsetkurven,
//          EIN `fill()`. Deshalb keine AA-Risse und keine Fugen.
//   STRICH (`chipLoop` + `chipStroke`)    → Buttons, HUD-Chips, POST-ITS
//          Wobble = per-Punkt-Zufallsversatz, gezeichnet als Polylinie.
//
// **Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein Pinselband
// aussehen** — egal, wie man `jit` und `baseW` dreht. Wer an einer Kartenkante
// Parameter dreht und sie bleibt zackig, hat die falsche Familie erwischt.
//
// ── NEU IN KANON-VERSION 2 (gemessen 2026-07-25, `KFB Tusche-Messung.dc.html`) ──
// **`bow` ist eine Kennzahl, kein Nebenwert.** Kanon-Version 1 dokumentierte
// `brushLoop(…, wob = 1.4, bow = 1.4)` als Signatur — v11 ruft aber überall
// `brushLoop(…, 1.4, 1.4 * 0.14)`, also **bow = 0,196**. Ein Port, der die
// Signatur liest statt der Aufrufstelle, baucht die Kante siebenfach: gemessen
// 1,70 % statt 0,44 % Spannweite, Faktor 3,9. Das ist das, was als „Bend statt
// ink" auffällt — nicht die falsche Feder, sondern eine gerade Linie, die sich
// krümmt. Deshalb hat `brushLoop` hier **keine Default-Werte mehr**: die Feder
// kommt aus einem benannten Preset, nicht aus einer Signatur.
//
//   import { INK_PRESETS, contour, drawInk, measureInk } from './kfb-ink-canon.js';
//   const pts = contour('card', seed, W, H);
//   drawInk('card', g, pts, W, H, seed);
//   measureInk(pts, W, H, 'card');     // → { points, featherPct, bowPct, kind, ok }
// ============================================================================

export const INK_CANON_VERSION = 2;
export const INK_COLOR = '#1f1a14';
export const CHIP_COLOR = '#191410';

// ---------------------------------------------------------------------------
// DIE PRESETS — die Varianten, benannt und abgegrenzt.
// `use` sagt, wofür ein Preset gilt. `deprecated` heißt: existiert nur noch als
// Vergleichsmaßstab in der Messung, nie in einer Szene. Ein Preset ohne Fundort
// gibt es nicht — jedes trägt, woher seine Zahlen stammen.
// ---------------------------------------------------------------------------
export const INK_PRESETS = {
  // ▸ KANON für alles, was eine Karte ist.
  card: {
    label: 'Karte (Kanon)', family: 'band', for: 'card',
    use: 'Spielkarten · Lektionskarten · Comic-Panels · jede Karten-Optik',
    from: 'rollercoaster-ride.v11.js „journey v4 master tusche", Aufrufstellen Z. 197/245/300',
    step: 22,          // px zwischen Stützpunkten (Abtastung, formneutral)
    wob: 1.4,          // Punkt-Jitter-Anteil — Textur, nicht Form
    bow: 1.4 * 0.14,   // = 0,196 · Amplitude der langwelligen Bauchung. DIE Zahl.
    cornerFade: 0.16,  // Anteil der Kantenlänge, über den die Bauchung zur Ecke ausfadet
    cornerFadeMax: 64,
    hb: 0.0069,        // Grund-Halbbreite, relativ zu min(W,H)
    taper: 0.85, edge: 1.05, minHalf: 1.2,
    refW: 1024,        // Baurahmen der normalisierten Kontur
    margin: 14,        // Inset im Baurahmen
    color: INK_COLOR,
  },
  // ▸ KANON für alles, was ein Chip ist. Andere Familie, mit Absicht.
  chip: {
    label: 'Chip / Post-it (Kanon)', family: 'stroke', for: 'chip',
    use: 'Post-its · Buttons · HUD-Chips · DOM-Chips',
    from: 'kfb-ink.js (Repo-Root) — `inkChip`, HUD-Rezept',
    step: 34, jit: 1.6, baseW: 4, wobW: 0.5,
    refW: 256, margin: 10,
    color: CHIP_COLOR,
  },
  // ▸ KANON für alles, was ein SCHLAUCH ist (additiv, 2026-08-24, Georgs Entscheidung für die
  //   2D-Comic-Bühne). Dritte Familie, mit Absicht: Arme, Beine, Ohren, Stängel, Rauch und Seile
  //   sind KEINE geschlossene Rechteck-Kontur, sondern eine offene Mittellinie mit runden Kappen.
  //   Der Generator wohnt in `comic-v1/ink-svg.v1.js` (`tubeD`) — hier stehen nur seine Zahlen,
  //   damit sie EINEN Eigentümer haben. Herkunft der Zahlen: Konturkanon-PDF §Rubber Tube
  //   („dicker als die Kontur, leicht schwankende Mittellinie, runde Endkappen, minimale
  //   Breitenvariation, sichtbarer Biegefluss“) — `1.4×` ist die Ansage aus den Design-Notizen.
  tube: {
    label: 'Gummi-Schlauch (Kanon)', family: 'tube', for: 'tube',
    use: 'Arme · Beine · Ohren · Schwänze · Tentakel · Stängel · Rauch · Zeigegesten',
    from: 'PDF „danke. für ein story-telling experiment…“ §KFB-Konturkanon / 2. Rubber Tube',
    contourFactor: 1.4,   // Sollbreite = 1,4 × Federbreite der Kontur derselben Figur
    wobble: 0.5,          // Amplitude der Mittellinien-Schwankung (0 = technisches Rohr)
    cap: 'round',
    color: INK_COLOR,
  },
  // ▸ KANON für FIGUREN-SILHOUETTEN (additiv, 2026-08-24, Georgs Demo-Blätter).
  //   Zwei Ansagen stecken drin: **bold** (die Silhouette muss auf jede Entfernung lesbar sein) und
  //   **Schatten-Logik** (unten und rechts dünner Strich → dicker Strich, wie eine geführte Hand mit
  //   Licht von oben links). Die Karten-Feder ist für ein Blatt Papier gemacht und dafür zu zart:
  //   `hb` 0,0069 → 0,0155 (Faktor 2,25), `edge` 1,05 → 2,10 (doppelte Licht-Spreizung),
  //   `taper` 0,85 → 0,45 (weniger Dick-Dünn-Zittern, mehr durchgezogene Kontur).
  figure: {
    label: 'Figuren-Silhouette (Kanon)', family: 'band', for: 'figure',
    use: 'Körper · Kopf · Hände · Füße · Hüte · Augen — alles, was eine Figur ist',
    from: 'Georgs KFB-Demo-Blätter 2026-08-24 (bold outline, Schatten unten/rechts)',
    step: 26, wob: 1.1, bow: 1.4 * 0.11,
    cornerFade: 0.16, cornerFadeMax: 64,
    hb: 0.0155, taper: 0.45, edge: 2.10, minHalf: 2.2,
    refW: 1024, margin: 14,
    color: '#2b1d14',
  },
  // ▸ Vergleichsmaßstab. NICHT in einer Szene benutzen.
  'academy-2026-07': {
    label: 'Akademie vor der Korrektur', family: 'band', for: 'card', deprecated: true,
    use: 'nur zum Vergleich — der gemessene Fehlstand (bow ×7)',
    from: 'terrain-v10/academy-deck.js INK_BOW = 1.4, Stand 2026-07-25',
    step: 22, wob: 1.4, bow: 1.4, cornerFade: 0.16, cornerFadeMax: 64,
    hb: 0.0069, taper: 0.85, edge: 1.05, minHalf: 1.2,
    refW: 1024, margin: 14, color: INK_COLOR,
  },
  // ▸ Vergleichsmaßstab. NICHT in einer Szene benutzen.
  // `for: 'card'` bei `family: 'stroke'` ist genau der Befund: es SOLL eine Karte sein und ist
  // mit der Chip-Feder gezeichnet. Die Prüfung meldet deshalb „falsche Familie", nicht eine Zahl.
  'sky-2026-07': {
    label: 'Sky-Karten vor der Korrektur', family: 'stroke', for: 'card', deprecated: true,
    use: 'nur zum Vergleich — falsche Familie, Jitter diagonal statt quer',
    from: 'terrain-v10/sky-cards.js, Stand 2026-07-25',
    step: 34, jit: 4, baseW: 7, wobW: 0, diagonalJitter: true,
    refW: 720, margin: 16, color: INK_COLOR,
  },
};

// Die Abnahmezahlen. Wer eine Kante baut, prüft gegen diese Tabelle — nicht gegen den
// Augenschein und nicht gegen einen Parameter.
//
// **Die Schwellen hängen an `for`, nicht an `family`** — also daran, WAS gezeichnet wird, nicht
// WIE. Erste Fassung hatte EINEN Satz Schwellen für alles, und damit fiel das Preset `chip`
// durch seine eigene Prüfung: die 0,5 % Bauchung sind eine KARTEN-Zahl, und bei einem Post-it
// IST der Punkt-Jitter der Wobble — Spannweite ist dort erwartet, kein Fehler. Genau die Klasse,
// die dieses Dokument anprangert: eine Kennzahl mit einem Namen und zwei Bedeutungen.
export const INK_CHECK = {
  card: {
    family: 'band',
    // Spannweite der Kontur QUER ZUR KANTE, gemessen gegen den Extrempunkt-Rahmen der
    // Punktliste (nicht gegen die Sollkante). Bewusst so: die Kennzahl muss allein aus der
    // Kontur prüfbar sein — wer eine fremde Kante nachmisst, kennt weder den Inset noch den
    // Baurahmen. v11 liegt bei 0,44 %, über 40 Seeds 0,23–0,39 %.
    bowPctMax: 0.5,
    // Federbreite in % von min(W,H) — NICHT von der Breite. Zwei Kennzahlen mit demselben
    // Namen und verschiedenem Nenner waren hier schon einmal der Fehler.
    featherPct: [1.2, 1.8],
  },
  // Der Schlauch wird NICHT wie eine Karte geprüft: er hat keine Ecken, also keine Bauchung, und
  // seine Breite IST die Aussage (1,4 × Kontur) statt einer Toleranz um einen Sollwert. Geprüft
  // wird nur die Familie — ein Schlauch, der mit der Chip-Feder gestrichelt wurde, ist der Fehler.
  // Die Figuren-Feder ist ABSICHTLICH fetter als die Karten-Feder — sie trägt eine Silhouette,
  // kein Blatt. Geprüft wird die Familie und ein eigenes Federfenster; die Bauchung nicht, weil
  // eine Ellipsen-/Ei-Kontur keine Ecken hat, gegen die man sie messen könnte.
  figure: { family: 'band', bowPctMax: null, featherPct: [2.4, 4.6] },
  tube: { family: 'tube', bowPctMax: null, featherPct: null },
  chip: {
    family: 'stroke',
    // Bauchung wird NICHT geprüft: bei der Strich-Familie ist der Versatz der Wobble.
    bowPctMax: null,
    // Feder wird NICHT als Absolutzahl geprüft: `baseW` skaliert mit `W/refW`, die gemessene
    // Prozentzahl hängt also an der Auflösung des Messenden, nicht an der gezeichneten Kante.
    // Bei der Band-Familie ist `hb` relativ und die Zahl invariant — bei Strich nicht.
    featherPct: null,
    // Dafür gilt hier die Frequenz: mehr als ~12 Stützpunkte auf der langen Kante lesen als
    // „torn", nicht als ruhige Tuschelinie (SSOT v1, §Auflösungs-Invariante).
    pointsMax: 12,
  },
};

// ---------------------------------------------------------------------------
const clampf = (v, a, b) => Math.max(a, Math.min(b, v));
export function mulberry(seed) {
  let a = seed | 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const P = (name) => {
  const p = INK_PRESETS[name];
  if (!p) throw new Error('[kfb-ink] unbekanntes Preset: ' + name + ' — bekannt: ' + Object.keys(INK_PRESETS).join(', '));
  return p;
};

// ── BAND-Familie ───────────────────────────────────────────────────────────
// Geschlossene Bauch-Schleife. Ecken bleiben fix, die Bauchung fadet zu ihnen
// hin aus — daher „durchgehend" statt zackig. `bow` kommt aus dem Preset und
// hat KEINEN Default: eine erfundene Bauchung ist der dokumentierte Portierfehler.
export function brushLoop(x0, y0, x1, y1, seed, p) {
  const A = p.wob, B = p.bow;
  const rnd = mulberry(seed);
  const cs = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const raw = [], isC = [], fade = [];
  for (let e = 0; e < 4; e++) {
    const a = cs[e], b = cs[(e + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(len / p.step));
    const margin = Math.min(len * p.cornerFade, p.cornerFadeMax);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      raw.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); isC.push(i === 0);
      const d = Math.min(t * len, (1 - t) * len);
      const u = margin > 0 ? clampf(d / margin, 0, 1) : 1;
      fade.push(u * u * (3 - 2 * u));
    }
  }
  const N = raw.length, cum = [0];
  for (let i = 1; i < N; i++) cum[i] = cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
  const total = cum[N - 1] + Math.hypot(raw[0][0] - raw[N - 1][0], raw[0][1] - raw[N - 1][1]) || 1;
  const a1 = (rnd() * 3 + 2) * B, f1 = Math.floor(rnd() * 3 + 3), p1 = rnd() * 6.283;
  const a2 = (rnd() * 1.6 + 0.8) * B, f2 = Math.floor(rnd() * 4 + 6), p2 = rnd() * 6.283;
  const out = [];
  for (let i = 0; i < N; i++) {
    if (isC[i]) { out.push([raw[i][0], raw[i][1]]); continue; }
    const pp = raw[(i - 1 + N) % N], pn = raw[(i + 1) % N];
    const tx = pn[0] - pp[0], ty = pn[1] - pp[1], tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl, th = (cum[i] / total) * Math.PI * 2;
    const fd = fade[i];
    const w = (a1 * Math.sin(f1 * th + p1) + a2 * Math.sin(f2 * th + p2)) * fd;
    const tj = (rnd() - 0.5) * 1.4 * A * fd;
    out.push([raw[i][0] + nx * w + tj, raw[i][1] + ny * w + tj]);
  }
  return out;
}

// Die Feder: Halbbreite relativ zur Zellgröße, moduliert von zwei Sinus und
// einem diagonalen Gradient (unten/rechts satter, wie eine geführte Hand).
export function inkHalfWidth(pts, W, H, seed, p, gain) {
  const N = pts.length, cum = [0];
  for (let i = 1; i < N; i++) cum[i] = cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const tot = cum[N - 1] || 1;
  const rnd = mulberry((seed * 7 + 5) | 0);
  const k1 = 3 + Math.floor(rnd() * 3), q1 = rnd() * 6.283, k2 = 8 + Math.floor(rnd() * 6), q2 = rnd() * 6.283;
  const hb = Math.min(W, H) * p.hb * (gain || 1);
  const halfFn = (i) => {
    const th = cum[i] / tot * Math.PI * 2;
    const mod = 0.62 * Math.sin(k1 * th + q1) + 0.38 * Math.sin(k2 * th + q2);
    const diag = 1 + p.edge * ((pts[i][0] / W * 0.42 + pts[i][1] / H * 0.58) - 0.5);
    return Math.max(p.minHalf, hb * (1 + p.taper * mod * 0.5) * diag);
  };
  halfFn.hb = hb;
  // Kleinste vorkommende Halbbreite. **Die Silhouetten-Maske darf nur so weit
  // aufgeweitet werden** — sonst blitzt die Fläche an den dünnen Stellen heraus.
  halfFn.min = Math.max(p.minHalf, hb * (1 - p.taper * 0.5) * (1 - p.edge * 0.5));
  return halfFn;
}

// Band statt Strich: pro Segment ein Quad zwischen innerer und äußerer Offsetkurve,
// alle Quads als Subpfade in EINEM Pfad, ein `fill()` (nonzero). Geteilte Kanten
// liegen im Inneren der vereinigten Form — kein AA-Riss, keine Fuge.
export function inkRibbon2D(g, pts, halfFn, color) {
  const N = pts.length;
  const off = (j, s) => {
    const pp = pts[(j - 1 + N) % N], cc = pts[j], pn = pts[(j + 1) % N];
    let d1x = cc[0] - pp[0], d1y = cc[1] - pp[1]; const l1 = Math.hypot(d1x, d1y) || 1; d1x /= l1; d1y /= l1;
    let d2x = pn[0] - cc[0], d2y = pn[1] - cc[1]; const l2 = Math.hypot(d2x, d2y) || 1; d2x /= l2; d2y /= l2;
    const n1x = -d1y, n1y = d1x, n2x = -d2y, n2y = d2x;
    let mx = n1x + n2x, my = n1y + n2y; const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
    const ext = halfFn(j) / Math.max(mx * n1x + my * n1y, 0.35) * s;
    return [cc[0] + mx * ext, cc[1] + my * ext];
  };
  g.fillStyle = color;
  g.beginPath();
  for (let i = 0; i < N; i++) {
    const o1 = off(i, 1), i1 = off(i, -1), o2 = off((i + 1) % N, 1), i2 = off((i + 1) % N, -1);
    g.moveTo(o1[0], o1[1]); g.lineTo(i1[0], i1[1]); g.lineTo(i2[0], i2[1]); g.lineTo(o2[0], o2[1]); g.closePath();
  }
  g.fill();
}

// ── STRICH-Familie ─────────────────────────────────────────────────────────
// STRICH-Familie, 1:1 aus `kfb-ink.js` `inkPerimeter`: Ecken fix, dazwischen zwei
// UNABHÄNGIGE Zufallsversätze auf x und y.
export function chipLoop(x0, y0, x1, y1, seed, p) {
  const rnd = mulberry(seed), pts = [];
  const cs = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  for (let k = 0; k < 4; k++) {
    const a = cs[k], b = cs[(k + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(3, Math.round(len / p.step));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      // **`diagonalJitter` ist ein FEHLER, kein Stil.** Er addiert DIESELBE Zahl auf x und y,
      // die Kante zittert dadurch diagonal statt in zwei Achsen — der gemessene Ist-Stand der
      // Sky-Karten. Er steht hier nur, damit man ihn im Vergleich sehen kann, nicht zum Bauen.
      const jx = i ? (rnd() - 0.5) * 2 * p.jit : 0;
      const jy = p.diagonalJitter ? jx : (i ? (rnd() - 0.5) * 2 * p.jit : 0);
      pts.push([a[0] + (b[0] - a[0]) * t + jx, a[1] + (b[1] - a[1]) * t + jy]);
    }
  }
  return pts;
}
export function chipStroke(g, pts, W, p) {
  g.strokeStyle = p.color; g.lineJoin = 'round'; g.lineCap = 'round';
  g.lineWidth = p.baseW * (W / p.refW);
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath(); g.stroke();
}

// ── Die drei Funktionen, die ein Aufrufer wirklich braucht ─────────────────
// **Die Kontur wird EINMAL im Baurahmen gebaut, normalisiert und dann nur noch
// skaliert.** Maske, Decal und Flächen-Clip teilen sich dieselbe Punktliste —
// zwei getrennt gerechnete Konturen ergeben zwei Kanten mit einer Lücke dazwischen.
const _cache = new Map();
export function normContour(presetName, seed, aspect) {
  const p = P(presetName), AR = aspect || 1.79;
  // Ein Schlauch ist keine Rechteck-Kontur. Ohne diese Zeile würde `brushLoop` ihn stumm als
  // Rechteck bauen (family !== 'band' → chipLoop) und der Aufrufer bekäme eine falsche Form
  // ohne Fehlermeldung — genau die Klasse Fehler, die dieser Kanon verhindern soll.
  if (p.family === 'tube') {
    throw new Error('[kfb-ink] Preset "' + presetName + '" ist die TUBE-Familie — '
      + 'normContour baut nur geschlossene Rechteck-Konturen. Nutze tubeD() aus comic-v1/ink-svg.v1.js.');
  }
  const key = presetName + '#' + seed + '#' + AR.toFixed(4);
  if (_cache.has(key)) return _cache.get(key);
  const W = p.refW, H = Math.round(W / AR), m = p.margin;
  const pts = (p.family === 'band' ? brushLoop : chipLoop)(m, m, W - m, H - m, seed, p);
  const out = pts.map((q) => [q[0] / W, q[1] / H]);
  _cache.set(key, out);
  return out;
}
export function contour(presetName, seed, W, H) {
  return normContour(presetName, seed, W / H).map((q) => [q[0] * W, q[1] * H]);
}
export function pathOf(g, pts) {
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
}
export function drawInk(presetName, g, pts, W, H, seed, gain) {
  const p = P(presetName);
  if (p.family === 'band') inkRibbon2D(g, pts, inkHalfWidth(pts, W, H, seed, p, gain), p.color);
  else chipStroke(g, pts, W, p);
}
// Wie weit darf die Fläche unter der Tusche nach außen? Höchstens die kleinste
// vorkommende Halbbreite — sonst blitzt sie an den dünnen Stellen über die Linie.
export function maskGrow(presetName, pts, W, H, seed) {
  const p = P(presetName);
  return p.family === 'band' ? inkHalfWidth(pts, W, H, seed, p).min : p.baseW * 0.25 * (W / p.refW);
}

// ── Die Abnahme. Vier Kennzahlen, aus der Punktliste gerechnet. ────────────
// **Geprüft wird gegen den Satz, der zu `preset.for` gehört** — was gezeichnet wird, entscheidet
// die Schwellen, nicht wie. Eine Karte, die mit der Chip-Feder gezeichnet ist, bekommt deshalb
// „falsche Familie" gemeldet und nicht eine Zahl über einer Karten-Schwelle.
export function measureInk(pts, W, H, presetName, seed) {
  const p = P(presetName);
  const intent = p.for || (p.family === 'band' ? 'card' : 'chip');
  const C = INK_CHECK[intent] || INK_CHECK.card;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const q of pts) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
  const per = [0, 0, 0, 0];
  let bow = 0;
  for (const q of pts) {
    const d = [Math.abs(q[1] - y0), Math.abs(q[0] - x1), Math.abs(q[1] - y1), Math.abs(q[0] - x0)];
    let k = 0; for (let i = 1; i < 4; i++) if (d[i] < d[k]) k = i;
    per[k]++; bow = Math.max(bow, d[k]);
  }
  let fMean, fMax;
  if (p.family === 'band') {
    const half = inkHalfWidth(pts, W, H, seed == null ? 7 : seed, p);
    let sum = 0; fMax = 0;
    for (let i = 0; i < pts.length; i++) { const w = half(i) * 2; sum += w; if (w > fMax) fMax = w; }
    fMean = sum / pts.length;
  } else { fMean = fMax = p.baseW * (W / p.refW); }
  const featherPct = fMean / Math.min(W, H) * 100;
  const bowPct = bow / W * 100;
  const kind = p.family === 'band' ? 'Band' : 'Strich';

  // Die Befunde in der Reihenfolge, in der sie zählen: erst die Familie (ein Strich auf einer
  // Karte ist kein Zahlenproblem), dann die Zahlen, die für DIESE Absicht definiert sind.
  let why = '';
  if (C.family && p.family !== C.family) {
    why = 'falsche Familie — ' + kind + ' statt ' + (C.family === 'band' ? 'Band' : 'Strich')
        + ' für „' + intent + '"';
  } else if (C.bowPctMax != null && bowPct > C.bowPctMax) {
    why = 'Bauchung ' + bowPct.toFixed(2) + ' % über ' + C.bowPctMax + ' % — „Bend statt ink"';
  } else if (C.featherPct && (featherPct < C.featherPct[0] || featherPct > C.featherPct[1])) {
    why = featherPct < C.featherPct[0] ? 'Feder zu zart' : 'Feder zu fett';
  } else if (C.pointsMax != null && per[0] > C.pointsMax) {
    why = per[0] + ' Stützpunkte auf der langen Kante (über ' + C.pointsMax + ') — liest als „torn"';
  }

  return {
    preset: presetName, kind, for: intent,
    points: per[0], pointsTotal: pts.length,
    featherPct: +featherPct.toFixed(2), featherMaxPct: +(fMax / Math.min(W, H) * 100).toFixed(2),
    // **Bei der Strich-Familie hängt die Federzahl an der Messauflösung** (`baseW · W/refW`),
    // nicht an der gezeichneten Kante. Bei Band ist `hb` relativ und die Zahl invariant. Wer die
    // Zahl weiterreicht, muss wissen, welche von beiden er in der Hand hat.
    featherResolutionBound: p.family !== 'band',
    measuredAt: W,
    bowPct: +bowPct.toFixed(2),
    // Was für diese Absicht überhaupt geprüft wird — damit ein „ok" nicht mehr behauptet,
    // als gemessen wurde.
    checked: [C.family ? 'Familie' : null, C.bowPctMax != null ? 'Bauchung' : null,
              C.featherPct ? 'Feder' : null, C.pointsMax != null ? 'Stützpunkte' : null].filter(Boolean),
    ok: !why, why,
  };
}
