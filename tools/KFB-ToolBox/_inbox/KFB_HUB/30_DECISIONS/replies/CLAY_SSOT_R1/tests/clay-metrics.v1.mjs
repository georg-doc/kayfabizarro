// KFB Clay SSOT R1 · image metrics (pure JS, no DOM): SSIM, stripe metrics (structure-tensor coherence + FFT directional energy), colour.
// Images: { w, h, data: Uint8(Clamped)Array RGBA, top-down }.

const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export function gray(img) { const n = img.w * img.h, g = new Float32Array(n), d = img.data; for (let i = 0; i < n; i++) g[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255; return g; }

/** Mean SSIM (Wang 2004), 8x8 windows, stride 4, on luminance in [0,1]. */
export function ssim(a, b, w, h) {
  const C1 = 0.01 ** 2, C2 = 0.03 ** 2, W = 8; let s = 0, n = 0;
  for (let y = 0; y + W <= h; y += 4) for (let x = 0; x + W <= w; x += 4) {
    let ma = 0, mb = 0; for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) { const k = (y + j) * w + x + i; ma += a[k]; mb += b[k]; }
    ma /= 64; mb /= 64; let va = 0, vb = 0, cv = 0;
    for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) { const k = (y + j) * w + x + i, da = a[k] - ma, db = b[k] - mb; va += da * da; vb += db * db; cv += da * db; }
    va /= 63; vb /= 63; cv /= 63;
    s += ((2 * ma * mb + C1) * (2 * cv + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2)); n++;
  }
  return s / n;
}
export function rgbaDiff(A, B) { let max = 0, changed = 0; for (let i = 0; i < A.data.length; i += 4) { let m = 0; for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(A.data[i + c] - B.data[i + c])); if (m > 0) changed++; if (m > max) max = m; } return { max, changed, pct: (100 * changed) / (A.w * A.h) }; }
export function down2(g, w, h) { const W = w >> 1, H = h >> 1, o = new Float32Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = 2 * y * w + 2 * x; o[y * W + x] = (g[k] + g[k + 1] + g[k + w] + g[k + w + 1]) / 4; } return { g: o, w: W, h: H }; }

function crop(g, w, rect) { const [x0, y0, cw, ch] = rect, o = new Float32Array(cw * ch); for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) o[y * cw + x] = g[(y0 + y) * w + x0 + x]; return o; }
function resample(g, w, h, N) { const o = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const fx = ((x + 0.5) * w) / N - 0.5, fy = ((y + 0.5) * h) / N - 0.5, x0 = Math.max(0, Math.floor(fx)), y0 = Math.max(0, Math.floor(fy)), x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1), tx = Math.min(1, Math.max(0, fx - x0)), ty = Math.min(1, Math.max(0, fy - y0)); o[y * N + x] = (g[y0 * w + x0] * (1 - tx) + g[y0 * w + x1] * tx) * (1 - ty) + (g[y1 * w + x0] * (1 - tx) + g[y1 * w + x1] * tx) * ty; } return o; }
function boxBlur(g, N, r) { const t = new Float32Array(N * N), o = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < N) { s += g[y * N + xx]; c++; } } t[y * N + x] = s / c; } for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < N) { s += t[yy * N + x]; c++; } } o[y * N + x] = s / c; } return o; }
function fft1(re, im, inv = false) { const n = re.length; for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = ((inv ? 2 : -2) * Math.PI) / len, wr = Math.cos(a), wi = Math.sin(a); for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr; re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } }

/**
 * Stripe metrics of the relief only: d = lum(relief on) - lum(relief off), same frame, cropped to rect, resampled to 256².
 *  A relief lit by a directional light is seen as its derivative along the light, so even a perfectly isotropic relief has a
 *  cos² orientation profile in the spectrum (max/mean = 2). Both metrics are therefore measured against that expectation:
 *  coherence:   energy-weighted structure-tensor coherence (lambda1-lambda2)/(lambda1+lambda2), tensor integrated over ~18 px
 *               (larger than one dent, so ring rims average out; parallel grooves over an area do not).
 *  stripePeak:  2D FFT power (periods 3-32 px) in 36 orientation bins, fitted with a + b·cos²(θ-θ0) (= the light-derivative shape
 *               of any isotropic relief); stripePeak = max bin / fit. Isotropic ~1.1-1.3, a stripe field gives a narrow spike.
 *  fftAniso:    raw max/mean of the orientation bins (informational; ~2 for isotropic relief under one light).
 *  energy:      RMS of d (how strong the relief is in the face at all).
 */
export function stripeMetrics(on, off, w, rect, N = 256) {
  const a = crop(on, w, rect), b = crop(off, w, rect), cw = rect[2], ch = rect[3], d0 = new Float32Array(cw * ch);
  for (let i = 0; i < d0.length; i++) d0[i] = a[i] - b[i];
  let d = resample(d0, cw, ch, N);
  const lo = boxBlur(boxBlur(d, N, 6), N, 6); d = d.map((v, i) => v - lo[i]); // high-pass, keeps periods < ~25 px
  let e2 = 0; for (const v of d) e2 += v * v; const energy = Math.sqrt(e2 / d.length);
  // structure tensor
  const jxx = new Float32Array(N * N), jxy = new Float32Array(N * N), jyy = new Float32Array(N * N);
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) { const i = y * N + x, gx = (d[i + 1] - d[i - 1]) / 2, gy = (d[i + N] - d[i - N]) / 2; jxx[i] = gx * gx; jxy[i] = gx * gy; jyy[i] = gy * gy; }
  const sxx = boxBlur(boxBlur(jxx, N, 9), N, 9), sxy = boxBlur(boxBlur(jxy, N, 9), N, 9), syy = boxBlur(boxBlur(jyy, N, 9), N, 9);
  let cs = 0, ws = 0;
  for (let i = 0; i < N * N; i++) { const tr = sxx[i] + syy[i]; if (tr <= 1e-12) continue; const df = Math.sqrt((sxx[i] - syy[i]) ** 2 + 4 * sxy[i] ** 2); cs += df; ws += tr; }
  const coherence = ws > 0 ? cs / ws : 0;
  // FFT directional energy (Hann window)
  const re = new Float64Array(N * N), im = new Float64Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) re[y * N + x] = d[y * N + x] * (0.5 - 0.5 * Math.cos((2 * Math.PI * x) / (N - 1))) * (0.5 - 0.5 * Math.cos((2 * Math.PI * y) / (N - 1)));
  const rr = new Float64Array(N), ri = new Float64Array(N);
  for (let y = 0; y < N; y++) { for (let x = 0; x < N; x++) { rr[x] = re[y * N + x]; ri[x] = im[y * N + x]; } fft1(rr, ri); for (let x = 0; x < N; x++) { re[y * N + x] = rr[x]; im[y * N + x] = ri[x]; } }
  for (let x = 0; x < N; x++) { for (let y = 0; y < N; y++) { rr[y] = re[y * N + x]; ri[y] = im[y * N + x]; } fft1(rr, ri); for (let y = 0; y < N; y++) { re[y * N + x] = rr[y]; im[y * N + x] = ri[y]; } }
  const B = 36, bins = new Float64Array(B), rMin = N / 32, rMax = N / 3;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const fx = x < N / 2 ? x : x - N, fy = y < N / 2 ? y : y - N, r = Math.hypot(fx, fy); if (r < rMin || r > rMax) continue; let t = Math.atan2(fy, fx); if (t < 0) t += Math.PI; bins[Math.min(B - 1, Math.floor((t / Math.PI) * B))] += re[y * N + x] ** 2 + im[y * N + x] ** 2; }
  const mean = bins.reduce((s, v) => s + v, 0) / B, mx = Math.max(...bins);
  // least squares: E(θ) ≈ A + Bc·cos2θ + Bs·sin2θ  (orthogonal basis on equally spaced bins)
  let A = 0, Bc = 0, Bs = 0; for (let i = 0; i < B; i++) { const t = ((i + 0.5) / B) * Math.PI; A += bins[i]; Bc += bins[i] * Math.cos(2 * t); Bs += bins[i] * Math.sin(2 * t); }
  A /= B; Bc *= 2 / B; Bs *= 2 / B; let peak = 0;
  for (let i = 0; i < B; i++) { const t = ((i + 0.5) / B) * Math.PI, m = Math.max(1e-30, A + Bc * Math.cos(2 * t) + Bs * Math.sin(2 * t), 0.05 * A); peak = Math.max(peak, bins[i] / m); }
  return { coherence: +coherence.toFixed(3), stripePeak: +peak.toFixed(3), fftAniso: +(mean > 0 ? mx / mean : 0).toFixed(3), energy: +energy.toFixed(4) };
}

/** Mean OKLab chroma and lightness of img inside mask (mask = white pixels). */
export function colourStats(img, mask) {
  let c = 0, L = 0, n = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    if (mask.data[i] < 128) continue;
    const r = lin(img.data[i] / 255), g = lin(img.data[i + 1] / 255), b = lin(img.data[i + 2] / 255);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    L += 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s; c += Math.hypot(A, Bb); n++;
  }
  return { chroma: n ? c / n : 0, L: n ? L / n : 0, n };
}

/* Self-test of the stripe metric on synthetic images (lit isotropic noise, lit craters, the same with a stripe patch). */
export function stripeSelfTest() {
  const N = 256, rnd = (() => { let a = 12345; return () => { a = (Math.imul(a, 1664525) + 1013904223) >>> 0; return a / 4294967296; }; })();
  const field = (fn) => { const h = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) h[y * N + x] = fn(x, y); return h; };
  const bumps = Array.from({ length: 700 }, () => [rnd() * N, rnd() * N, 2 + rnd() * 5, rnd() - 0.5]);
  const iso = field((x, y) => bumps.reduce((s, [bx, by, r, a]) => s + a * Math.exp(-((x - bx) ** 2 + (y - by) ** 2) / (r * r)), 0));
  const craters = Array.from({ length: 90 }, () => [rnd() * N, rnd() * N, 6 + rnd() * 9]);
  const crat = field((x, y) => craters.reduce((s, [bx, by, r]) => { const q = Math.hypot(x - bx, y - by) / r; return s - Math.exp(-2.5 * q * q) + 0.3 * Math.exp(-(((q - 1) / 0.2) ** 2)); }, 0));
  const stripes = (h) => field((x, y) => h[y * N + x] + ((x > 60 && x < 200 && y > 40 && y < 210) ? 0.12 * Math.sin((x * 0.8 + y * 0.35) * 0.9) : 0));
  const shade = (h, az) => { const lx = Math.cos(az), ly = Math.sin(az); return field((x, y) => { const i = y * N + x, gx = (h[y * N + Math.min(N - 1, x + 1)] - h[y * N + Math.max(0, x - 1)]) / 2, gy = (h[Math.min(N - 1, y + 1) * N + x] - h[Math.max(0, y - 1) * N + x]) / 2; return 0.5 + 0.05 * (gx * lx + gy * ly); }); };
  const flat = new Float32Array(N * N).fill(0.5), rect = [0, 0, N, N], m = (img) => stripeMetrics(img, flat, N, rect);
  return { isotropic: m(shade(iso, 0.6)), craters: m(shade(crat, 0.6)), isotropicPlusStripes: m(shade(stripes(iso), 0.6)), cratersPlusStripes: m(shade(stripes(crat), 0.6)) };
}
