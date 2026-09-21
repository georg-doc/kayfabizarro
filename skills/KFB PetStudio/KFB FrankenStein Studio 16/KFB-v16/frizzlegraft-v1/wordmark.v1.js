/* FrizzleGraft v1 · wordmark.v1 — DIE WORTMARKE AUF DEM JACKENRÜCKEN.  13.09.2026
 *
 * HERKUNFT: übernommen aus **KFB Animation Lab v2** (`lab-v2/graft.js`, `composeKFB()`), Georgs
 * eigene Fassung vom 12./13.09. Nicht neu erfunden — eine zweite Fassung wären zwei Wortmarken, die
 * auseinanderlaufen. Übernommen sind die GEMESSENEN Werte, nicht die Bauweise:
 *   Kästen im Atlas 1024²   Rücken 833,853 126 × 87   ·   Trikot 676,846 56 × 38
 *   Schräge −8°   ·   Rot #b3311f   ·   Tinte #141210   ·   Papier #f6efd9   ·   Irish Grover
 *   Bizarro gibt das Maß, Kayfa folgt mit 88 %, beide werden in den Kasten eingepaßt.
 *
 * DER EINE UNTERSCHIED ZUM LAB, und er ist der Grund für dieses Modul: das Lab tauscht eine ZWEITE
 * Bildtafel ein. Im Studio gibt es die Zonen-Leinwand aus `matzones.v1` bereits — die Marke wird
 * deshalb DORT HINEIN gemalt, als Stempel. Nur so gilt sie auch, wenn die Jacke schwarz ist:
 * das Übermalen der beiden GO-GO-GO-Kästen nimmt die Farbe aus der AKTUELLEN Leinwand (je Zeile die
 * häufigste Farbe des Farbfelds neben dem Kasten), nicht aus dem Original. Bei einer getauschten
 * Tafel wäre das alte Orange zurückgekommen.
 *
 * ⚠ Irish Grover ist eine Webschrift. Ein Bildskript außerhalb der Seite kennt sie nicht, die Seite
 * kennt sie — deshalb entsteht die Marke zur Laufzeit und der Bericht sagt, WELCHE Schrift wirklich
 * gegriffen hat (Georgia als Rückweg, benannt statt still).
 */

export const SCHEMA = 'kfb.wordmark/0.1';
export const FONT_URL = 'https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap';
export const FAMILY = '"Irish Grover", Georgia, serif';

/* Gemessen im Atlas 1024² (Animation Lab v2 · über die Abweichung von der Bandfarbe gefunden). */
export const LOGO_BOXES = [
  { id: 'back',  x: 833, y: 853, w: 126, h: 87, mark: true },
  { id: 'chest', x: 676, y: 846, w: 56,  h: 38, mark: false },
];
export const DEFAULTS = { on: true, ink: '#141210', plate: '#b3311f', paper: '#f6efd9', tilt: -8 };

let fontPromise = null;
export function loadFont() {
  if (fontPromise) return fontPromise;
  fontPromise = (async () => {
    try {
      if (!document.querySelector('link[data-kfb-irish]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = FONT_URL; l.setAttribute('data-kfb-irish', '1');
        document.head.appendChild(l);
      }
      await document.fonts.load('400 40px "Irish Grover"');
      await document.fonts.ready;
    } catch (e) {}
    return document.fonts && document.fonts.check ? document.fonts.check('400 40px "Irish Grover"') : false;
  })();
  return fontPromise;
}

/**
 * Malt beide Kästen zu und setzt die Marke auf den Rücken. `cx` ist der Zeichenkontext der
 * Zonen-Leinwand, `W`/`H` ihre Maße. Rückgabe ist ein Bericht mit den benutzten Maßen.
 */
export function drawWordmark(cx, W, H, opt = {}) {
  const P = { ...DEFAULTS, ...opt };
  const k = W / 1024;
  const boxes = LOGO_BOXES.map((L) => ({ ...L, x: Math.round(L.x * k), y: Math.round(L.y * k), w: Math.round(L.w * k), h: Math.round(L.h * k) }));
  const BANDW = 128 * k;
  let d;
  try { d = cx.getImageData(0, 0, W, H); } catch (e) { return { status: 'NICHT_LESBAR', reason: e.message }; }
  const a = d.data;
  const inBox = (x, y) => boxes.some((q) => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h);
  /* Je Zeile die häufigste Farbe des Farbfelds NEBEN dem Kasten — so bleibt der Verlauf erhalten,
     und bei umgefärbter Jacke ist es die NEUE Farbe. */
  for (const q of boxes) {
    const band = Math.floor(q.x / BANDW);
    for (let y = q.y; y < q.y + q.h; y++) {
      const hist = new Map();
      for (let x = Math.round(band * BANDW); x < Math.round((band + 1) * BANDW) && x < W; x++) {
        if (inBox(x, y)) continue;
        const o = (y * W + x) * 4, key = a[o] + ',' + a[o + 1] + ',' + a[o + 2];
        hist.set(key, (hist.get(key) || 0) + 1);
      }
      let best = null, bn = 0;
      hist.forEach((n, key) => { if (n > bn) { bn = n; best = key; } });
      if (!best) continue;
      const c = best.split(',').map(Number);
      for (let x = q.x; x < q.x + q.w; x++) { const o = (y * W + x) * 4; a[o] = c[0]; a[o + 1] = c[1]; a[o + 2] = c[2]; a[o + 3] = 255; }
    }
  }
  cx.putImageData(d, 0, 0);
  if (!P.on) return { status: 'NUR_GELOESCHT', cleared: boxes.map((q) => q.id).join(' + ') };

  const B = boxes.find((q) => q.mark);
  const F = (s) => '400 ' + s + 'px ' + FAMILY;
  const innerW = B.w - 10 * k, innerH = B.h - 8 * k;
  let sB = Math.round(52 * k), sK = 0, pw = 0, ph = 0, blockH = 0;
  for (; sB > 10; sB--) {
    sK = Math.round(sB * 0.88);
    cx.font = F(sB); pw = cx.measureText('Bizarro').width + 10 * k; ph = sB + 10 * k;
    cx.font = F(sK); const wK = cx.measureText('Kayfa').width;
    blockH = sK * 1.02 + ph + 3 * k;
    if (Math.max(pw, wK) <= innerW && blockH <= innerH) break;
  }
  cx.save();
  cx.translate(B.x + B.w / 2, B.y + B.h / 2);
  cx.rotate((P.tilt * Math.PI) / 180);
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  const top = -blockH / 2;
  cx.font = F(sK); cx.fillStyle = P.ink; cx.fillText('Kayfa', 0, top + sK * 0.55);
  cx.font = F(sB); pw = cx.measureText('Bizarro').width + 10 * k;
  const plateTop = top + sK * 1.02 + 3 * k;
  cx.fillStyle = P.plate; cx.fillRect(-pw / 2, plateTop, pw, ph);
  cx.fillStyle = P.paper; cx.fillText('Bizarro', 0, plateTop + ph / 2 + 1);
  cx.restore();

  const font = document.fonts && document.fonts.check && document.fonts.check('400 40px "Irish Grover"')
    ? 'Irish Grover' : 'Georgia (Irish Grover nicht geladen)';
  return { status: 'OK', font, atlas: W + '×' + H, bizarro: sB + 'px', kayfa: sK + 'px',
    plate: Math.round(pw) + '×' + Math.round(ph), block: Math.round(blockH) + ' von ' + Math.round(innerH),
    cleared: boxes.map((q) => q.id + ' ' + q.x + ',' + q.y + ' ' + q.w + '×' + q.h).join(' · ') };
}

/** Welche Atlasfelder die Marke berührt — damit der Stempel nach dem Umfärben dieser Zonen läuft. */
export function zonesTouched(grid) {
  const cw = grid.w / grid.cols, ch = grid.h / grid.rows;
  const out = new Set();
  for (const L of LOGO_BOXES) {
    const k = grid.w / 1024;
    for (const [x, y] of [[L.x * k, L.y * k], [(L.x + L.w) * k, (L.y + L.h) * k]]) {
      out.add('r' + Math.min(grid.rows - 1, Math.floor(y / ch)) + 'c' + Math.min(grid.cols - 1, Math.floor(x / cw)));
    }
  }
  return [...out];
}

export default { SCHEMA, FAMILY, LOGO_BOXES, DEFAULTS, loadFont, drawWordmark, zonesTouched };
