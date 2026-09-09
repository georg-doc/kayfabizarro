// ============================================================================
// ink-tail.js — KFB Travel · die KANONISCHE Karten-Tusche
// ----------------------------------------------------------------------------
// **1:1 portiert aus `rollercoaster-v11/rollercoaster-ride.v11.js`** (dort als
// „journey v4 master tusche" bezeichnet): `brushLoop` · `inkRibbon2D` · `inkTail`.
// Nicht nachgebaut, nicht getunt — kopiert, weil genau diese drei Funktionen die
// Kartenkante sind, die in KFB als richtig abgenommen ist.
//
// WARUM DAS NICHT `drawInkOutline` IST — der Fehler, der mich drei Runden gekostet hat:
// `kfb-ink.js` hat zwei Familien, und sie sehen NICHT gleich aus.
//   · `inkChip`/`drawInkOutline` (Stil `inked`): **per-Punkt-Zufallsversatz** plus
//     eine GESTRICHENE Polylinie. Richtig für Buttons, HUD-Chips, Post-its.
//   · `inkTail` (hier): **kein Punktrauschen.** Der Wobble sind ZWEI langwellige
//     Sinus über den Umfang (3–5 und 6–9 Perioden auf der ganzen Schleife), die an
//     den Ecken ausgefadet werden — deshalb bleiben Ecken ruhig und Kanten bauchen
//     sich. Gezeichnet wird ein GEFÜLLTES BAND mit variabler Halbbreite (Taper 0.85
//     plus diagonaler Licht-Gradient `edge` 1.05), als EIN Pfad mit einem `fill()`.
//     Das ist die Karte. Eine gestrichene Polylinie kann so nicht aussehen.
//
// Zwei Eigenschaften, die den Port billig machen:
//  · **Auflösungsunabhängig von Natur aus.** Die Bandbreite ist `0.0069·min(W,H)`,
//    und die Wobble-Form hängt am Umfangs-Parameter, nicht an der Punktzahl. Punkte
//    alle 22 px sind nur die Abtastung — die FORM bleibt gleich.
//  · Deterministisch über `mulberry(seed)`.
//
//   const pts = brushLoop(m, m, W - m, H - m, 7, 1.4, 1.4);
//   inkTail(g, pts, W, H, 7);        // malt das Band in '#1f1a14'
// ============================================================================

export function mulberry(seed) {
  let a = seed | 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clampf = (v, a, b) => Math.max(a, Math.min(b, v));

// Geschlossene Bauch-Schleife um ein Rechteck. `wob` = Punkt-Jitter-Anteil,
// `bow` = Amplitude der langwelligen Bauchung. Ecken bleiben fix (isC) und die
// Bauchung fadet zu den Ecken hin aus (margin) — daher „durchgehend", nicht zackig.
export function brushLoop(x0, y0, x1, y1, seed, wob, bow) {
  const A = wob == null ? 1 : wob;
  const B = bow == null ? A : bow;
  const rnd = mulberry(seed);
  const cs = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const raw = [], isC = [], fade = [];
  for (let e = 0; e < 4; e++) {
    const a = cs[e], b = cs[(e + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(len / 22));
    const margin = Math.min(len * 0.16, 64);
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

// Band statt Strich: pro Segment ein Quad zwischen innerer und äußerer Offsetkurve,
// alle Quads als Subpfade in EINEM Pfad, ein `fill()` (nonzero) — geteilte Kanten
// liegen im Inneren der vereinigten Form, also kein Anti-Aliasing-Riss, keine Fuge.
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

// Die Feder: Grundhalbbreite `hb` relativ zur Zellgröße, moduliert von zwei Sinus
// (Taper 0.85) und einem diagonalen Gradient (`edge` 1.05 — unten/rechts satter).
// Kanonische Werte aus Infinite Journey v4: seed 7 · ink 10 · taper 0.85 · edge 1.05.
export function inkHalfWidth(pts, W, H, seed, gain) {
  const N = pts.length, cum = [0];
  for (let i = 1; i < N; i++) cum[i] = cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const tot = cum[N - 1] || 1;
  const rnd = mulberry((seed * 7 + 5) | 0);
  const k1 = 3 + Math.floor(rnd() * 3), q1 = rnd() * 6.283, k2 = 8 + Math.floor(rnd() * 6), q2 = rnd() * 6.283;
  const hb = Math.min(W, H) * 0.0069 * (gain || 1), taper = 0.85, edge = 1.05;
  const halfFn = (i) => {
    const th = cum[i] / tot * Math.PI * 2;
    const mod = 0.62 * Math.sin(k1 * th + q1) + 0.38 * Math.sin(k2 * th + q2);
    const dx = pts[i][0] / W, dy = pts[i][1] / H;
    const diag = 1 + edge * ((dx * 0.42 + dy * 0.58) - 0.5);
    return Math.max(1.2, hb * (1 + taper * mod * 0.5) * diag);
  };
  halfFn.hb = hb;
  // kleinste vorkommende Halbbreite — die Silhouetten-Maske darf nur so weit
  // aufgeweitet werden, sonst blitzt die Fläche an den dünnen Stellen heraus.
  halfFn.min = Math.max(1.2, hb * (1 - taper * 0.5) * (1 - edge * 0.5));
  return halfFn;
}

export function inkTail(g, pts, W, H, seed, gain) {
  inkRibbon2D(g, pts, inkHalfWidth(pts, W, H, seed, gain), '#1f1a14');
}
