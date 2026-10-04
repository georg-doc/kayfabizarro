/* Extracted Joyride J14, pin 927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f.
 * track-look.v5.js helpers 38–43, W3 180, curvature/profile 183–217.
 * Seam: supplied immutable stream and presentation atlas; no new track owner. */
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };


export function createStrandProfile(stream, AT) {
 const S=stream.samples,N=S.length;
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  // Krümmung (vorzeichenbehaftet: > 0 = Rechtskurve, innen = rechts), geglättet über ±8 m
  const kr = new Float32Array(N), ks = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = S[Math.max(0, i - 4)], b = S[Math.min(N - 1, i + 4)], q = S[i];
    const d = (b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]; kr[i] = d / Math.max(0.5, b.s - a.s); }
  for (let i = 0; i < N; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; }

  // ---------- Querschnitt des Strangs je Seite (seitenlokal: x nach außen, y hoch) ----------
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } };
  const RIB = 3.5;   // Rippenabstand (m), eine Rippe = zwei Handbreiten
  const sideProfile = (q, i, sd) => {
    const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), H = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    // T4: bt 0 = Strang (T3) … 1 = Bordsteinlippe (Stadt, am Boden, rückt an die Fahrbahnkante) bzw. breite flache Wiesenlippe (Natur)
    const bt = AT.barrierT(q.s, sd, i), bn = AT.bio(q.s) === 1, Hx = lerp(H, bn ? 0.5 : 0.32, bt), rxK = bn ? 1 + 0.9 * bt : 1, ibx = bn ? ib : lerp(ib, e + 0.35, bt);
    const inner = sstep(0.008, 0.022, ks[i] * sd) * (1 - bt), outer = sstep(0.014, 0.04, -ks[i] * sd) * (1 - bt);
    const wave = 0.06 * (vnoise(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (Hx + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer), rX = r * rxK;
    const cx = Math.max(ibx, e + 0.4) + 0.85 * rX + 0.12 * outer, top = Hx + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]];
    const xa = cx - 0.94 * rX, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t);
      y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * rxK * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * rX + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * rX + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * rX, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts;
  };
  const ringOf = (q, i) => { const L = sideProfile(q, i, -1), R = sideProfile(q, i, 1);
    const pts = L.map(([x, y]) => W3(q, (q.prm.offset || 0) - x, y)); for (let n = R.length - 1; n >= 0; n--) pts.push(W3(q, (q.prm.offset || 0) + R[n][0], R[n][1])); return pts; };


 return {sideProfile,ringOf,W3,ks};
}
