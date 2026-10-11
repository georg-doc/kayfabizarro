// @ts-nocheck
// Visual Recovery Lab: adapted 1:1 from donors/golden-k1h0/clay-relief.v5.js (KFB's own code). Imports re-pointed; no logic changes.
/* KFB Knet-Relief v5 (S1, 28.09.) — wie v4, eine gemessene Änderung: Nudelholz-Bahnen lasen auf der Fahrbahn als Rechtecke mit
 * geraden Nahtkanten (Georgs Screenshot 00.53.47): v4 schnitt die Bahn quer mit sstep an den Enden und längs mit einem scharfen Grat.
 * v5: Bahn als Ellipse mit welliger Kante, Grat weich und abreißend, keine Längsriefen. */
/* KFB Knet-Relief v4 (K2, 28.09.) — wie v3, eine gemessene Änderung: das feine Kreuzraster auf den Türmen kam aus den
 * Querriefen des Spachtelzugs (0,025 · sin(v/λ), λ 7–13 px). Einzeln geschaltet in K2 (Pixelaufnahme): Fingerabdrücke aus,
 * Feinkorn aus → Raster bleibt; alle Werkzeuge aus → Raster weg; nur Spachtelzug an → Raster da. Überlappende Züge mit
 * verschiedener Richtung und die drei gedrehten Lesungen der Kachelung kreuzen die Riefen zu einem Gitter.
 * v4: Spachtelzug ohne Querriefen (Mulde und Grat bleiben), Nudelholz-Längsriefen auf ein Drittel. */
/* KFB Knet-Relief v3 (K2, 28.09.) — Werkzeuge EINZELN. v2 backte alle Handspuren in eine Karte; dadurch sah jede
 * Fläche nach demselben Werkzeug aus und keine Spur ließ sich in Größe oder Stärke steuern.
 * v3 rechnet je Werkzeug ein eigenes kachelbares Höhenfeld und legt davon den Gradienten ab (wie v2: kein Normal-Map,
 * keine Vorzeichenfalle). Zwei Werkzeuge je RGBA-Karte:
 *   Karte A: R,G Fingerfächer · B,A Spachtelzug
 *   Karte B: R,G Falten       · B,A Daumendellen
 *   Karte C: R,G Daumenstrich · B,A Nudelholz
 * Formen der ersten vier wie v2 (abgelesen an ref/claybound/web/detail-*.jpg), ohne v2s Abdeckungsmaske:
 * wo ein Werkzeug arbeitet, entscheidet jetzt die Werkzeugzone im Material (clay-material.v9).
 * Neu: Daumenstrich (Rinne mit einseitig aufgeworfener Kante, Enden laufen aus) · Nudelholz (lange, flache Bahnen
 * gleicher Richtung mit weicher Kante und feinen Längsriefen). */

export const TOOLS = ['fan', 'smear', 'crease', 'dent', 'thumb', 'roll'];
export const TOOL_LABELS = { fan: 'Fingerfächer', smear: 'Spachtelzug', crease: 'Falten', dent: 'Daumendellen', thumb: 'Daumenstrich', roll: 'Nudelholz' };

function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function ihash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(u, v, P, s) {
  const x = u * P, y = v * P, xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), m = n => ((n % P) + P) % P;
  const a = ihash(m(xi), m(yi), s), b = ihash(m(xi + 1), m(yi), s), c = ihash(m(xi), m(yi + 1), s), d = ihash(m(xi + 1), m(yi + 1), s);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function field(N, seed, tool) {
  const S = new Float32Array(N * N), R = rng(seed), k = N / 1024;
  const wrap = d => d - N * Math.round(d / N), idx = (x, y) => (((y % N) + N) % N) * N + (((x % N) + N) % N);
  const stamp = (cx, cy, rad, fn) => { const x0 = Math.floor(cx - rad), x1 = Math.ceil(cx + rad), y0 = Math.floor(cy - rad), y1 = Math.ceil(cy + rad);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const v = fn(wrap(x - cx), wrap(y - cy)); if (v) S[idx(x, y)] += v; } };
  if (tool === 'dent') for (let i = 0; i < 30; i++) {
    const cx = R() * N, cy = R() * N, r = (40 + R() * 100) * k, a = 0.35 + R() * 0.4;
    stamp(cx, cy, r * 1.6, (dx, dy) => { const q = Math.hypot(dx, dy) / r; return a * (-Math.exp(-q * q * 2.2) + 0.28 * Math.exp(-(((q - 1.05) / 0.22) ** 2))); });
  }
  if (tool === 'smear') for (let i = 0; i < 30; i++) {
    const cx = R() * N, cy = R() * N, ra = (100 + R() * 150) * k, rb = ra * (0.32 + R() * 0.28), th = R() * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const a = 0.5 + R() * 0.5, lam = (7 + R() * 6) * k, ph = R() * 6.28, lipW = 0.022 + R() * 0.02, ns = Math.floor(R() * 1e6);
    stamp(cx, cy, ra + 12 * k, (dx, dy) => { const u = dx * c + dy * s, v = -dx * s + dy * c, ang = Math.atan2(v / rb, u / ra);
      const d = Math.hypot(u / ra, v / rb) * (1 + 0.16 * (vnoise(ang / 6.2832 + 0.5, 0.5, 9, ns) - 0.5)); if (d > 1.25) return 0;
      const inside = 1 - sstep(0.6, 1.0, d), front = sstep(0.5, 0.9, u / ra) * sstep(0.48, 0.66, vnoise(ang / 6.2832 + 0.5, 0.2, 5, ns + 1));
      return a * (-0.3 * inside + 0.28 * front * Math.exp(-(((d - 1.0) / lipW) ** 2))); });
  }
  if (tool === 'fan') for (let i = 0; i < 64; i++) {
    const cx = R() * N, cy = R() * N, r = (36 + R() * 58) * k, th = R() * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const D = r * (1.3 + R() * 2.4), A = (r * 0.95) / D, lam = (5 + R() * 3.2) * k, a = 0.3 + R() * 0.4, wob = R() * 6.28, sharp = 1.6 + R() * 1.4;
    stamp(cx, cy, r * 1.25, (dx, dy) => { const px = dx + c * D, py = dy + s * D, rr = Math.hypot(px, py); let phi = Math.atan2(py, px) - th; phi -= 6.2832 * Math.round(phi / 6.2832);
      const t = phi / A, sr = (rr - D) / r; if (Math.abs(t) > 1 || sr < -1 || sr > 0.8) return 0;
      const env = (1 - sstep(0.55, 1.0, Math.abs(t))) * sstep(-1.0, -0.5, sr) * (1 - sstep(0.4, 0.75, sr)); if (env <= 0) return 0;
      const ridge = Math.pow(0.5 + 0.5 * Math.cos((phi * D / lam) * 6.2832 + 0.7 * Math.sin(rr * 0.045 / k + wob)), sharp), fade = 0.55 + 0.45 * Math.sin(phi * 3.1 + wob + sr * 2.0);
      return a * env * ((ridge - 0.35) * 0.6 * fade - 0.18) + a * 0.5 * Math.exp(-(((sr - 0.62) / 0.07) ** 2)) * (1 - sstep(0.6, 1.0, Math.abs(t))); });
  }
  if (tool === 'crease') {
    const cd = new Float32Array(N * N).fill(99), cs = new Float32Array(N * N), ca = new Float32Array(N * N);
    for (let i = 0; i < 50; i++) { let x = R() * N, y = R() * N, h = R() * Math.PI * 2; const steps = 6 + Math.floor(R() * 22), st = 4 * k, a = 0.3 + R() * 0.45;
      for (let j = 0; j < steps; j++) { h += (R() - 0.5) * 0.22 + (R() < 0.08 ? (R() - 0.5) * 1.4 : 0);
        const nx = x + Math.cos(h) * st, ny = y + Math.sin(h) * st, ex = nx - x, ey = ny - y, L2 = ex * ex + ey * ey, pad = 6 * k;
        for (let yy = Math.floor(Math.min(y, ny) - pad); yy <= Math.ceil(Math.max(y, ny) + pad); yy++) for (let xx = Math.floor(Math.min(x, nx) - pad); xx <= Math.ceil(Math.max(x, nx) + pad); xx++) {
          const qx = xx - x, qy = yy - y, tt = Math.max(0, Math.min(1, (qx * ex + qy * ey) / L2)), d = Math.hypot(qx - ex * tt, qy - ey * tt), id = idx(xx, yy);
          if (d < cd[id]) { cd[id] = d; cs[id] = Math.sign(ex * qy - ey * qx) || 1; ca[id] = a * (0.4 + 0.6 * Math.sin(3.1416 * (j + tt) / steps)); } }
        x = nx; y = ny; } }
    for (let i = 0; i < N * N; i++) if (cd[i] < 8 * k) { const sd = cd[i] * cs[i] / k; S[i] += ca[i] * (-0.9 * Math.exp(-((sd / 1.1) ** 2)) + 0.5 * Math.exp(-(((sd - 2.3) / 1.4) ** 2))); }
  }
  if (tool === 'thumb') for (let i = 0; i < 56; i++) {   // Daumenstrich: Rinne, eine Kante aufgeworfen, Anfang tiefer als Ende
    const cx = R() * N, cy = R() * N, L = (60 + R() * 90) * k, w = (13 + R() * 12) * k, th = R() * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const a = 0.45 + R() * 0.4, bend = (R() - 0.5) * 1.2 / L, side = R() < 0.5 ? -1 : 1;
    stamp(cx, cy, L + 3 * w, (dx, dy) => { const u = dx * c + dy * s; let v = -dx * s + dy * c; v -= bend * u * u; const e = u / L; if (Math.abs(e) > 1.15) return 0;
      const env = (1 - sstep(0.7, 1.1, Math.abs(e))) * (0.75 + 0.25 * -e), z = v / w;
      return a * env * (-Math.exp(-z * z) + 0.42 * Math.exp(-(((z - side * 1.7) / 0.6) ** 2)) + 0.12 * Math.exp(-(((z + side * 1.5) / 0.8) ** 2))); });
  }
  if (tool === 'roll') { const th0 = R() * Math.PI;   // Nudelholz: gleiche Grundrichtung, lange flache Bahnen mit weicher Kante
    for (let i = 0; i < 16; i++) { const cx = R() * N, cy = R() * N, L = (380 + R() * 320) * k, W = (55 + R() * 70) * k, th = th0 + (R() - 0.5) * 0.35, c = Math.cos(th), s = Math.sin(th);
      const a = 0.4 + R() * 0.4, lam = (6 + R() * 5) * k, ph = R() * 6.28, ns = Math.floor(R() * 1e6);
      stamp(cx, cy, L, (dx, dy) => { const u = dx * c + dy * s, v = -dx * s + dy * c, ang = Math.atan2(v / W, u / L);
        const q = Math.hypot(u / L, v / W) * (1 + 0.14 * (vnoise(ang / 6.2832 + 0.5, 0.3, 7, ns) - 0.5)); if (q > 1.3) return 0;
        const lip = Math.exp(-(((q - 1.0) / 0.16) ** 2)) * sstep(0.35, 0.65, vnoise(ang / 6.2832 + 0.5, 0.7, 5, ns + 3));
        return a * (-0.2 * (1 - sstep(0.55, 1.0, q)) + 0.16 * lip); }); } }
  // eine [1 2 1]-Runde gegen Rasterstufen
  const T = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) T[y * N + x] = (S[idx(x - 1, y)] + 2 * S[y * N + x] + S[idx(x + 1, y)]) * 0.25;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) S[y * N + x] = (T[idx(x, y - 1)] + 2 * T[y * N + x] + T[idx(x, y + 1)]) * 0.25;
  return { S, idx };
}

function packGrad(out, off, N, F) {
  const { S, idx } = F, gx = new Float32Array(N * N), gy = new Float32Array(N * N), sample = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x; gx[i] = (S[idx(x + 1, y)] - S[idx(x - 1, y)]) * 0.5; gy[i] = (S[idx(x, y + 1)] - S[idx(x, y - 1)]) * 0.5;
    if ((i & 63) === 0) sample.push(Math.max(Math.abs(gx[i]), Math.abs(gy[i]))); }
  sample.sort((a, b) => a - b); const p99 = sample[Math.floor(sample.length * 0.99)] || 1, sc = 127 / p99;
  for (let i = 0; i < N * N; i++) { out[i * 4 + off] = Math.max(0, Math.min(255, Math.round(128 + gx[i] * sc))); out[i * 4 + off + 1] = Math.max(0, Math.min(255, Math.round(128 + gy[i] * sc))); }
}

/** Drei RGBA-Karten mit je zwei Werkzeug-Gradienten. Asynchron in Schritten, damit die Seite nicht einfriert. */
export async function makeToolReliefs({ size = 1024, seed = 41, onStep = () => {} } = {}) {
  const t0 = performance.now(), N = size, maps = [new Uint8Array(N * N * 4), new Uint8Array(N * N * 4), new Uint8Array(N * N * 4)];
  for (let t = 0; t < TOOLS.length; t++) { onStep(TOOLS[t]); await new Promise(r => setTimeout(r, 0));
    packGrad(maps[t >> 1], (t & 1) * 2, N, field(N, seed + t * 101, TOOLS[t])); }
  return { maps, size: N, ms: Math.round(performance.now() - t0) };
}
