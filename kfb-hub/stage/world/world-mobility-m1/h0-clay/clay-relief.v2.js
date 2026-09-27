/* KFB Knet-Relief v1 — eine kachelbare Relief-Karte aus Handspuren, auf der CPU, deterministisch.
 *
 * Abgelesen an den Claybound-Nahaufnahmen (ref/claybound/web/detail-*.jpg), nicht erfunden:
 *   · Fingerfächer   feine, gebogene Parallelrillen, die von einem Drehpunkt ausstrahlen
 *   · Spachtelzug    flache Mulde mit langen Zügen und einem DÜNNEN aufgeworfenen Grat an der Vorderkante
 *                    (das sind die »Risslinien« auf den Blöcken)
 *   · Falten         schmale Kerbe mit einseitiger Schulter, wo Knete übereinandergeschoben wurde
 *   · Daumendellen   weite, weiche Mulden
 *   · Feinkorn       Rauschen plus kleine Poren (eigener Kanal)
 *
 * Ausgabe ist KEINE Höhe und KEINE Normal-Map, sondern der GRADIENT der Höhe je Achse der Kachel.
 * Der Shader baut daraus die Normale im Objektraum. Grund: ein Gradient hat pro Projektionsachse eine
 * eindeutige Richtung — die Vorzeichenfalle der Normal-Maps (Claybound PR #62, GLTFLoader-Y-Flip)
 * kann hier nicht auftreten.
 *
 * RGBA8: R,G = Gradient Handspuren (du, dv) · B,A = Gradient Feinkorn (du, dv). 128 = flach.
 */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function ihash(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** kachelbares Wertrauschen, Periode P Zellen über die Kachel */
function vnoise(u, v, P, s) {
  const x = u * P, y = v * P;
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const m = n => ((n % P) + P) % P;
  const a = ihash(m(xi), m(yi), s), b = ihash(m(xi + 1), m(yi), s);
  const c = ihash(m(xi), m(yi + 1), s), d = ihash(m(xi + 1), m(yi + 1), s);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function makeClayRelief({ size = 1024, seed = 11, density = 1 } = {}) {
  const t0 = performance.now();
  const N = size, S = new Float32Array(N * N), G = new Float32Array(N * N);
  const R = rng(seed);
  const wrap = d => d - N * Math.round(d / N);
  const idx = (x, y) => (((y % N) + N) % N) * N + (((x % N) + N) % N);
  const stamp = (cx, cy, rad, fn) => {
    const x0 = Math.floor(cx - rad), x1 = Math.ceil(cx + rad), y0 = Math.floor(cy - rad), y1 = Math.ceil(cy + rad);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const v = fn(wrap(x - cx), wrap(y - cy));
      if (v) S[idx(x, y)] += v;
    }
  };
  const k = N / 1024;
  const count = { lumps: 1, dents: 0, smears: 0, fans: 0, creases: 0 };

  // 0 · Grundwelle: das Stück ist von Hand gedrückt, nicht gepresst
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N;
    S[y * N + x] = 0.55 * (vnoise(u, v, 3, seed) - 0.5) + 0.3 * (vnoise(u, v, 7, seed + 1) - 0.5);
  }

  // 1 · Daumendellen
  count.dents = Math.round(26 * density);
  for (let i = 0; i < count.dents; i++) {
    const cx = R() * N, cy = R() * N, r = (40 + R() * 100) * k, a = 0.35 + R() * 0.4;
    stamp(cx, cy, r * 1.6, (dx, dy) => {
      const q = Math.hypot(dx, dy) / r;
      return a * (-Math.exp(-q * q * 2.2) + 0.28 * Math.exp(-(((q - 1.05) / 0.22) ** 2)));
    });
  }

  // 2 · Spachtelzüge: Mulde, lange Züge, dünner Grat vorn
  count.smears = Math.round(26 * density);
  for (let i = 0; i < count.smears; i++) {
    const cx = R() * N, cy = R() * N, ra = (100 + R() * 150) * k, rb = ra * (0.32 + R() * 0.28);
    const th = R() * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const a = 0.5 + R() * 0.5, lam = (7 + R() * 6) * k, ph = R() * 6.28, lipW = 0.022 + R() * 0.02, ns = Math.floor(R() * 1e6);
    stamp(cx, cy, ra + 12 * k, (dx, dy) => {
      const u = dx * c + dy * s, v = -dx * s + dy * c;
      // Rand nicht als Ellipse: Rauschen verbiegt ihn, der Grat steht nur vorn und reißt ab
      const ang = Math.atan2(v / rb, u / ra);
      const d = Math.hypot(u / ra, v / rb) * (1 + 0.16 * (vnoise(ang / 6.2832 + 0.5, 0.5, 9, ns) - 0.5));
      if (d > 1.25) return 0;
      const inside = 1 - sstep(0.6, 1.0, d);
      const front = sstep(0.5, 0.9, u / ra) * sstep(0.48, 0.66, vnoise(ang / 6.2832 + 0.5, 0.2, 5, ns + 1));
      return a * (-0.3 * inside
        + 0.025 * inside * Math.sin((v / lam) * 6.2832 + 0.9 * Math.sin(u * 0.018 / k + ph))
        + 0.28 * front * Math.exp(-(((d - 1.0) / lipW) ** 2)));
    });
  }

  // 3 · Fingerfächer: Rillen strahlen vom Drehpunkt aus, Abstand wächst nach außen
  count.fans = Math.round(58 * density);
  for (let i = 0; i < count.fans; i++) {
    // nur dort, wo die Abdeckungsmaske es erlaubt: große Flächen bleiben glatt
    let cx = R() * N, cy = R() * N, tries = 0;
    while (vnoise(cx / N, cy / N, 4, seed + 9) < 0.52 && tries++ < 12) { cx = R() * N; cy = R() * N; }
    const r = (36 + R() * 58) * k;
    const th = R() * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const D = r * (1.3 + R() * 2.4), A = (r * 0.95) / D, lam = (5 + R() * 3.2) * k;
    const a = 0.3 + R() * 0.4, wob = R() * 6.28, sharp = 1.6 + R() * 1.4;
    stamp(cx, cy, r * 1.25, (dx, dy) => {
      const px = dx + c * D, py = dy + s * D;
      const rr = Math.hypot(px, py);
      let phi = Math.atan2(py, px) - th;
      phi -= 6.2832 * Math.round(phi / 6.2832);
      const t = phi / A, sr = (rr - D) / r;
      if (Math.abs(t) > 1 || sr < -1 || sr > 0.8) return 0;
      const env = (1 - sstep(0.55, 1.0, Math.abs(t))) * sstep(-1.0, -0.5, sr) * (1 - sstep(0.4, 0.75, sr));
      if (env <= 0) return 0;
      const phase = (phi * D / lam) * 6.2832 + 0.7 * Math.sin(rr * 0.045 / k + wob);
      const ridge = Math.pow(0.5 + 0.5 * Math.cos(phase), sharp);
      const fade = 0.55 + 0.45 * Math.sin(phi * 3.1 + wob + sr * 2.0);
      return a * env * ((ridge - 0.35) * 0.6 * fade - 0.18)
        + a * 0.5 * Math.exp(-(((sr - 0.62) / 0.07) ** 2)) * (1 - sstep(0.6, 1.0, Math.abs(t)));
    });
  }

  // 4 · Falten: Kerbe mit einseitiger Schulter, als Abstandsfeld (Vereinigung, keine Doppelzählung)
  count.creases = Math.round(44 * density);
  const cd = new Float32Array(N * N).fill(99), cs = new Float32Array(N * N), ca = new Float32Array(N * N);
  for (let i = 0; i < count.creases; i++) {
    let x = R() * N, y = R() * N, h = R() * Math.PI * 2;
    const steps = 6 + Math.floor(R() * 22), st = 4 * k, a = 0.3 + R() * 0.45;
    for (let j = 0; j < steps; j++) {
      h += (R() - 0.5) * 0.22 + (R() < 0.08 ? (R() - 0.5) * 1.4 : 0);
      const nx = x + Math.cos(h) * st, ny = y + Math.sin(h) * st;
      const ex = nx - x, ey = ny - y, L2 = ex * ex + ey * ey;
      const pad = 6 * k;
      for (let yy = Math.floor(Math.min(y, ny) - pad); yy <= Math.ceil(Math.max(y, ny) + pad); yy++)
        for (let xx = Math.floor(Math.min(x, nx) - pad); xx <= Math.ceil(Math.max(x, nx) + pad); xx++) {
          const qx = xx - x, qy = yy - y;
          const tt = Math.max(0, Math.min(1, (qx * ex + qy * ey) / L2));
          const d = Math.hypot(qx - ex * tt, qy - ey * tt);
          const id = idx(xx, yy);
          if (d < cd[id]) { cd[id] = d; cs[id] = Math.sign(ex * qy - ey * qx) || 1; ca[id] = a * (0.4 + 0.6 * Math.sin(3.1416 * (j + tt) / steps)); }
        }
      x = nx; y = ny;
    }
  }
  for (let i = 0; i < N * N; i++) if (cd[i] < 8 * k) {
    const sd = cd[i] * cs[i] / k;
    S[i] += ca[i] * (-0.9 * Math.exp(-((sd / 1.1) ** 2)) + 0.5 * Math.exp(-(((sd - 2.3) / 1.4) ** 2)));
  }

  // weich ziehen: eine [1 2 1]-Runde, damit keine Treppen aus dem Raster übrig bleiben
  const blur = F => {
    const T = new Float32Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) T[y * N + x] = (F[idx(x - 1, y)] + 2 * F[y * N + x] + F[idx(x + 1, y)]) * 0.25;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) F[y * N + x] = (T[idx(x, y - 1)] + 2 * T[y * N + x] + T[idx(x, y + 1)]) * 0.25;
  };
  blur(S);

  // 5 · Feinkorn: zwei Rauschlagen und Poren
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N;
    G[y * N + x] = 0.55 * (vnoise(u, v, 90, seed + 5) - 0.5) + 0.3 * (vnoise(u, v, 210, seed + 6) - 0.5);
  }
  const pores = Math.round(1100 * density);
  for (let i = 0; i < pores; i++) {
    const cx = R() * N, cy = R() * N, r = (0.8 + R() * 1.8) * k, a = (R() < 0.8 ? -1 : 0.6) * (0.5 + R());
    const x0 = Math.floor(cx - r * 2), x1 = Math.ceil(cx + r * 2), y0 = Math.floor(cy - r * 2), y1 = Math.ceil(cy + r * 2);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const q = Math.hypot(wrap(x - cx), wrap(y - cy)) / r;
      G[idx(x, y)] += a * Math.exp(-q * q);
    }
  }

  // Gradienten, auf das 99. Perzentil normiert
  const out = new Uint8Array(N * N * 4);
  const grad = (F, off) => {
    const gx = new Float32Array(N * N), gy = new Float32Array(N * N);
    const sample = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x;
      gx[i] = (F[idx(x + 1, y)] - F[idx(x - 1, y)]) * 0.5;
      gy[i] = (F[idx(x, y + 1)] - F[idx(x, y - 1)]) * 0.5;
      if ((i & 63) === 0) sample.push(Math.max(Math.abs(gx[i]), Math.abs(gy[i])));
    }
    sample.sort((a, b) => a - b);
    const p99 = sample[Math.floor(sample.length * 0.99)] || 1;
    const sc = 127 / p99;
    for (let i = 0; i < N * N; i++) {
      out[i * 4 + off] = Math.max(0, Math.min(255, Math.round(128 + gx[i] * sc)));
      out[i * 4 + off + 1] = Math.max(0, Math.min(255, Math.round(128 + gy[i] * sc)));
    }
    return p99;
  };
  const p99S = grad(S, 0), p99G = grad(G, 2);
  return { data: out, size: N, ms: Math.round(performance.now() - t0), count, pores, p99S, p99G, seed };
}

