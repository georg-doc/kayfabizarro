/* KFB WorldDesign Lab v1 · Makro-Texturgenerator (echt periodisch/toroidal)
   Brief-Korrektur §2: die eine bewiesene kachelbare RGB-Textur ist EIN Kandidat, nicht die
   KFB-Textur. Hier entsteht sie parametrisch — und zwar so, dass Kachelbarkeit KONSTRUKTIV
   garantiert ist, nicht nachträglich geprüft:

   · jeder Pinselstrich und jeder Klecks wird NEUNFACH gezeichnet (0, ±Kachelbreite in x und y),
     die über den Rand laufende Hälfte kommt damit auf der Gegenseite wieder herein;
   · die Verzerrung (Warp) benutzt nur Sinusfelder mit GANZZAHLIGEN Perioden über die Kachel,
     ist also selbst periodisch;
   · die Weichzeichnung läuft auf einer 3×3-Kachelung, aus der danach die MITTLERE Kachel
     geschnitten wird — ein Blur am Rand kann so nichts abschneiden, was drüben fehlen würde;
   · Normale und Rauheit werden mit umlaufendem Zugriff (modulo) abgeleitet.

   Das ersetzt `RepeatWrapping` auf einem nicht-kachelbaren Bitmap NICHT nachträglich — es macht
   die Quelle selbst periodisch. Die verifizierte Seam-Lab-Erkenntnis (PR #173) wird damit
   benutzt, nicht neu gelöst. */

export const DEF = {
  seed: 20260922,
  brush: 22,        // Pinselbreite in px der Kachel
  strokeLen: 110,   // Strichlänge
  strokeDens: 160,  // Strichdichte (Anzahl)
  blob: 40,         // Kleckgröße
  blobDens: 55,     // Kleckdichte
  warp: 0.22,       // Verzerrung
  blur: 1.8,        // Weichheit
  contrast: 1.2,    // Kontrast
  rBal: 1.0, gBal: 0.98, bBal: 0.92,  // RGB-Kanalbalance
  size: 512
};

const mulberry = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const cv = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
};

/* neunfach gezeichnet = über den Rand hinaus ist gleich wieder drin */
function wrap9(ctx, size, draw) {
  for (let ox = -1; ox <= 1; ox++) {
    for (let oy = -1; oy <= 1; oy++) {
      ctx.save();
      ctx.translate(ox * size, oy * size);
      draw(ctx);
      ctx.restore();
    }
  }
}

export function generate(p0 = {}) {
  const p = { ...DEF, ...p0 };
  const N = p.size;
  const rnd = mulberry(p.seed >>> 0);
  const base = cv(N, N);
  const b = base.getContext('2d');
  /* RGB-Modus (Derek-Verfahren): jeder Strich/Klecks trägt GENAU EINEN reinen Kanal. Die Kachel
     ist dann keine Farbe, sondern eine Maske: R/G/B werden im Shader je Material durch drei
     Palettenfarben ersetzt. Grau-Modus = Wertkachel wie bisher. */
  const RGB = !!p.rgb;
  const CH = ['255,40,40', '40,255,60', '50,60,255'];
  const tone = (dark, l) => (RGB ? CH[Math.floor(rnd() * 3)] : Math.round(l) + ',' + Math.round(l * 0.96) + ',' + Math.round(l * 0.88));

  b.fillStyle = RGB ? 'rgb(' + CH[Math.floor(rnd() * 3)] + ')' : '#7d7568';
  b.fillRect(0, 0, N, N);

  for (let i = 0; i < p.blobDens; i++) {
    const x = rnd() * N, y = rnd() * N, r = p.blob * (0.5 + rnd()) * (RGB ? 1.6 : 1);
    const dark = rnd() < 0.5;
    const l = dark ? 40 + rnd() * 30 : 140 + rnd() * 70;
    const col = tone(dark, l);
    const al = RGB ? 0.45 + rnd() * 0.35 : 0.1 + rnd() * 0.12;
    wrap9(b, N, (c) => {
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(' + col + ',' + al.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + col + ',0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r, 0, 7);
      c.fill();
    });
  }
  b.lineCap = 'round';
  for (let i = 0; i < p.strokeDens; i++) {
    const x = rnd() * N, y = rnd() * N, a = rnd() * Math.PI * 2;
    const len = p.strokeLen * (0.4 + rnd() * 1.2);
    const w = Math.max(1, p.brush * (0.35 + rnd() * 0.9) * (RGB ? 1.5 : 1));
    const dark = rnd() < 0.55;
    const l = dark ? 55 + rnd() * 40 : 165 + rnd() * 70;
    const col = tone(dark, l);
    const al = (RGB ? 0.35 + rnd() * 0.35 : 0.05 + rnd() * 0.1).toFixed(3);
    const bend = (rnd() - 0.5) * len * 0.5;
    wrap9(b, N, (c) => {
      c.strokeStyle = 'rgba(' + col + ',' + al + ')';
      c.lineWidth = w;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a + 1) * bend, y + Math.sin(a + 1) * bend,
        x + Math.cos(a) * len, y + Math.sin(a) * len);
      c.stroke();
    });
  }

  /* Warp · nur ganzzahlige Perioden, damit die Verzerrung selbst periodisch bleibt */
  let src = base;
  if (p.warp > 0.001) {
    const out = cv(N, N);
    const oc = out.getContext('2d');
    const si = base.getContext('2d').getImageData(0, 0, N, N).data;
    const di = oc.createImageData(N, N);
    const amp = p.warp * N * 0.12;
    const f1 = 2, f2 = 3, f3 = 5;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = (x / N) * Math.PI * 2, v = (y / N) * Math.PI * 2;
        const dx = amp * (Math.sin(v * f1 + 1.3) * 0.6 + Math.sin(v * f3 + 0.7) * 0.4);
        const dy = amp * (Math.sin(u * f2 + 2.1) * 0.6 + Math.sin(u * f1 + 4.2) * 0.4);
        const sx = ((Math.round(x + dx) % N) + N) % N;
        const sy = ((Math.round(y + dy) % N) + N) % N;
        const s = (sy * N + sx) * 4, d = (y * N + x) * 4;
        di.data[d] = si[s]; di.data[d + 1] = si[s + 1]; di.data[d + 2] = si[s + 2]; di.data[d + 3] = 255;
      }
    }
    oc.putImageData(di, 0, 0);
    src = out;
  }

  /* Weichzeichnung auf der 3×3-Kachelung, danach die Mitte schneiden → bleibt periodisch */
  if (p.blur > 0.01) {
    const big = cv(N * 3, N * 3);
    const bc = big.getContext('2d');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) bc.drawImage(src, i * N, j * N);
    const sm = cv(N * 3, N * 3);
    const sc = sm.getContext('2d');
    sc.filter = 'blur(' + p.blur.toFixed(2) + 'px)';
    sc.drawImage(big, 0, 0);
    const cut = cv(N, N);
    cut.getContext('2d').drawImage(sm, -N, -N);
    src = cut;
  }

  /* Kontrast + Kanalbalance, und aus derselben Luminanz Höhe → Normale + Rauheit */
  const fc = src.getContext('2d');
  const img = fc.getImageData(0, 0, N, N);
  const d = img.data;
  const lum = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], bl = d[i * 4 + 2];
    const L = (0.299 * r + 0.587 * g + 0.114 * bl) / 255;
    if (RGB) {
      /* Maske: Kanalreinheit statt Luminanzkontrast */
      const mn = Math.min(r, g, bl), mx = Math.max(r, g, bl, 1);
      const q = Math.min(0.9, 0.35 * p.contrast);
      d[i * 4] = Math.min(255, ((r - mn * q) / (mx - mn * q)) * 255 * p.rBal);
      d[i * 4 + 1] = Math.min(255, ((g - mn * q) / (mx - mn * q)) * 255 * p.gBal);
      d[i * 4 + 2] = Math.min(255, ((bl - mn * q) / (mx - mn * q)) * 255 * p.bBal);
      lum[i] = Math.max(r, g, bl) / 255 * 0.6 + L * 0.4;
      continue;
    }
    const c = Math.min(1, Math.max(0, (L - 0.5) * p.contrast + 0.5));
    const k = L > 0.001 ? c / L : 1;
    d[i * 4] = Math.min(255, r * k * p.rBal);
    d[i * 4 + 1] = Math.min(255, g * k * p.gBal);
    d[i * 4 + 2] = Math.min(255, bl * k * p.bBal);
    lum[i] = c;
  }
  fc.putImageData(img, 0, 0);

  const nrm = cv(N, N);
  const nc = nrm.getContext('2d');
  const ni = nc.createImageData(N, N);
  const at = (x, y) => lum[(((y % N) + N) % N) * N + (((x % N) + N) % N)];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const gx = (at(x + 1, y) - at(x - 1, y)) * 3.2;
      const gy = (at(x, y + 1) - at(x, y - 1)) * 3.2;
      const len = Math.sqrt(gx * gx + gy * gy + 1);
      const i = (y * N + x) * 4;
      ni.data[i] = ((-gx / len) * 0.5 + 0.5) * 255;
      ni.data[i + 1] = ((-gy / len) * 0.5 + 0.5) * 255;
      ni.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      ni.data[i + 3] = 255;
    }
  }
  nc.putImageData(ni, 0, 0);

  const rgh = cv(N, N);
  const rc = rgh.getContext('2d');
  const ri = rc.createImageData(N, N);
  for (let i = 0; i < N * N; i++) {
    const v = Math.min(255, Math.max(0, (1 - lum[i] * 0.55) * 255));
    ri.data[i * 4] = ri.data[i * 4 + 1] = ri.data[i * 4 + 2] = v;
    ri.data[i * 4 + 3] = 255;
  }
  rc.putImageData(ri, 0, 0);

  return { params: p, diffuse: src, normal: nrm, rough: rgh };
}

/* 2×2-Wiederholung: die Nahtprüfung von Hand, sichtbar statt behauptet */
export function repeatPreview(canvas, n = 2, out = 220) {
  const c = cv(out, out);
  const ctx = c.getContext('2d');
  const s = out / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) ctx.drawImage(canvas, i * s, j * s, s, s);
  return c;
}

/* Naht-Messung: mittlere Abweichung gegenüberliegender Ränder (0 = perfekt periodisch) */
export function seamError(canvas) {
  const N = canvas.width;
  const d = canvas.getContext('2d').getImageData(0, 0, N, N).data;
  const px = (x, y) => (y * N + x) * 4;
  let sx = 0, sy = 0;
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < 3; k++) {
      sx += Math.abs(d[px(0, i) + k] - d[px(N - 1, i) + k]);
      sy += Math.abs(d[px(i, 0) + k] - d[px(i, N - 1) + k]);
    }
  }
  const per = (sx + sy) / (N * 6 * 2);
  return Math.round(per * 100) / 100;
}

export const PARAMS = [
  ['seed', 'Seed', 1, 99999999, 1],
  ['brush', 'Brush Size', 2, 90, 1],
  ['strokeLen', 'Stroke Length', 10, 400, 1],
  ['strokeDens', 'Stroke Density', 0, 600, 1],
  ['blob', 'Blob Size', 4, 180, 1],
  ['blobDens', 'Blob Density', 0, 240, 1],
  ['warp', 'Warp', 0, 1, 0.01],
  ['blur', 'Softness / Blur', 0, 12, 0.1],
  ['contrast', 'Contrast', 0.2, 2.6, 0.01],
  ['rBal', 'R Balance', 0.4, 1.6, 0.01],
  ['gBal', 'G Balance', 0.4, 1.6, 0.01],
  ['bBal', 'B Balance', 0.4, 1.6, 0.01]
];
