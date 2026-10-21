/* kfb-edge.v1 · Laufzeit-Port von kfb_edge_bpy (EdgeField, free_end, rubble_nest) für die Gelände-Probe (three r147, ohne Bundler, ohne THREE-Abhängigkeit).
   Quelle: CANON_3D/lib/kfb_edge_bpy.py + kfb_edge_params.json + kfb_env.py (nest_ok) @ e77445fde. Plan: DIORAMEN_PAINPOINT_PLAN_R1 §3.3, §4 Schritt 5.
   Achsen: Blender (x, y) → three (x, z). Anker wie dioSD der Probe: A = (x, z, R, y), C = (hx, hz, rot, blend); Kreis = hx = hz = 0.
   Warp läuft in Anker-lokalen Koordinaten (p − A.xy): gleiche Formel wie _nz, aber kleine Argumente → GPU-sin genau, GLSL = JS.
   Saat: Text → Hash → mulberry32 (Parameter-Parität mit Blender, keine Stück-Gleichheit). */
(function (root) {
  'use strict';
  const VERSION = 'kfb-edge.v1';
  /* Parameter wörtlich aus kfb_edge_params.json (Bytes unverändert, SHA-256 darunter) */
  const PARAMS_TEXT = String.raw`{
 "schema": "kfb.edge-params/1",
 "by": "WSB K8",
 "date": "2026-10-20",
 "basis": "SPEC_EDGE_RUBBLE_GRAMMAR_R1 (V-577, Kanon Gebiet 4) + Georg 20.10.: freies Ende = Platte in Pfad-artige Stücke geschnitten, gerundet, von dicht nach locker verteilt wie KayKit path_A → path_D",
 "free_end": {
  "path_stages": {"A": {"diam": 1.0, "gap_side": 0.025, "note": "KayKit path_A/B: 7 Steine r 0,4–0,67, Fugen 3–7 cm"},
                  "D": {"diam": 0.4, "gap_side": 0.155, "note": "KayKit path_D: 6 Steine r 0,1–0,3, Abstände 23–40 cm"}},
  "w_in": 1.0, "w_out": 0.2, "warp": [0.38, 0.12], "warp_scale": [0.55, 1.9],
  "intact_below": 0.15, "stage_from": 0.15, "stage_to": 0.95,
  "missing_from": 0.7, "missing_max": 0.45,
  "fase": 0.05, "edge_wobble": 0.012, "chip_prob": 0.15, "chaikin": 2,
  "thickness": 0.32, "sink_max": 0.04, "tilt_max_deg": 6, "drift_max": 0.28, "jitter": 0.05,
  "earth": {"band": 0.55, "sprinkle_width": 0.45, "level_in": -0.02, "level_drop": 0.03},
  "point_candidates": 500
 },
 "built_end": {
  "wall_head": {"len_of_T": 0.6, "wide_of_T": 1.18, "high_of_H": 1.04, "round_of_T": 0.38, "segments": 4},
  "kantenstein": {"len": 0.9, "gap": 0.04, "wide": 0.32, "high": 0.16, "round": 0.07, "segments": 3, "sink": 0.06},
  "rubble": {"count": 3, "R": 0.12}
 },
 "ruin_end": {"break_len_of_H": 1.6, "keep_min_of_H": 0.22, "steps": [4, 6], "bevel_of_T": 0.08, "rubble": {"nests": 2, "count": [5, 7], "R": 0.16}},
 "rubble": {"classes": {"S": [0.10, 0.16], "XS": [0.05, 0.09]}, "thickness_of_r": 0.7, "sink_frac": [0.3, 0.55]}
}
`;
  const PARAMS_SHA = 'd5bb1d5ae3b2c7e8c55ca6567205c9e0c029b7963bcd80df7577369391a8a42f';
  const params = JSON.parse(PARAMS_TEXT);
  if (params.schema !== 'kfb.edge-params/1') throw new Error('kfb-edge: falsches Schema ' + params.schema);
  const FE = params.free_end, ER = FE.earth, SA = FE.path_stages.A, SD = FE.path_stages.D;

  /* ---------------------------------------------------------------- Hilfen */
  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  function sm(a, b, v) { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); }
  function hashStr(s) { s = String(s); let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) } h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0 }
  function mulberry32(a) { a >>>= 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
  function rng(seed) { const r = typeof seed === 'number' ? mulberry32(seed) : mulberry32(hashStr(seed)); return { random: r, uniform: (a, b) => a + (b - a) * r(), randint: (a, b) => a + Math.floor(r() * (b - a + 1)) } }
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
  function crc32(s) { const b = new TextEncoder().encode(String(s)); let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }

  /* Anker vereinheitlichen: Objekt der Probe ({x, z, R, y, hx, hz, rot, blend}) oder {A: [4], C: [4]} */
  function anc(a) {
    if (a && a.A && a.C) return { x: a.A[0], z: a.A[1], R: a.A[2], y: a.A[3], hx: a.C[0], hz: a.C[1], rot: a.C[2], blend: a.C[3], strength: a.strength ?? 1 };
    return { x: a.x, z: a.z, R: a.R, y: a.y || 0, hx: a.hx || 0, hz: a.hz || 0, rot: a.rot || 0, blend: a.blend ?? 8, strength: a.strength ?? 1 };
  }
  const px_ = (p) => (Array.isArray(p) || ArrayBuffer.isView(p) ? p[0] : p.x);
  const pz_ = (p) => (Array.isArray(p) || ArrayBuffer.isView(p) ? p[1] : p.z);

  /* ---------------------------------------------------------------- das eine Zerfallsfeld (GLSL-Zwilling unten) */
  function sdfXZ(x, z, a) {   /* = dioSD der Probe: abgerundete Box (Kreis bei hx = hz = 0), innen negativ */
    const qx = x - a.x, qz = z - a.z, cs = Math.cos(a.rot), sn = Math.sin(a.rot), rx = cs * qx + sn * qz, rz = -sn * qx + cs * qz;
    const ex = Math.abs(rx) - a.hx, ez = Math.abs(rz) - a.hz;
    return Math.hypot(Math.max(ex, 0), Math.max(ez, 0)) + Math.min(Math.max(ex, ez), 0) - a.R;
  }
  const nz = (x, y) => Math.sin(x * 1.13 + 0.7 * Math.sin(y * 0.61)) * Math.sin(y * 0.97 + 0.6 * Math.sin(x * 0.53));   /* _nz 1:1 */
  function warpQ(qx, qz) { const a = FE.warp[0], b = FE.warp[1], s1 = FE.warp_scale[0], s2 = FE.warp_scale[1]; return a * nz(qx * s1, qz * s1) + b * nz(qx * s2 + 3.1, qz * s2 - 1.7) }
  function sXZ(x, z, a) { return sdfXZ(x, z, a) + warpQ(x - a.x, z - a.z) }
  function DXZ(x, z, a, strength) { const wi = FE.w_in * (strength ?? 1); return sm(-wi, FE.w_out, sXZ(x, z, a)) }
  function earthXZ(x, z, a) {   /* > 0 = Erde; Rand als Sprenkel, nie Linie; innen immer Erde */
    const qx = x - a.x, qz = z - a.z, s = sXZ(x, z, a), d = ER.band - s;
    const cl = Math.sin(qx * 5.3 + 1.7 * Math.sin(qz * 2.1)) * Math.sin(qz * 4.7 + 1.3 * Math.sin(qx * 1.9)), k = Math.max(0, 1 - Math.abs(d) / ER.sprinkle_width);
    return d + k * 0.5 * (0.9 * cl + 0.25 * Math.sin(qx * 11.0 + qz * 9.0));
  }
  function outwardXZ(x, z, a, e = 0.05) { const gx = sdfXZ(x + e, z, a) - sdfXZ(x - e, z, a), gz = sdfXZ(x, z + e, a) - sdfXZ(x, z - e, a), L = Math.hypot(gx, gz) || 1; return [gx / L, gz / L] }
  /* Plattenoberkante über dem Gelände: Umkehr von ground_level (Gelände = Oberkante + level_in − level_drop·D) */
  function plateTopXZ(x, z, a, groundAt, strength) { return groundAt(x, z) - ER.level_in + ER.level_drop * DXZ(x, z, a, strength) }

  const D = (p, anchor, strength) => DXZ(px_(p), pz_(p), anc(anchor), strength);
  const earth = (p, anchor) => earthXZ(px_(p), pz_(p), anc(anchor));
  const sdf = (p, anchor) => sdfXZ(px_(p), pz_(p), anc(anchor));
  const S = (p, anchor) => sXZ(px_(p), pz_(p), anc(anchor));

  /* ---------------------------------------------------------------- GLSL (Konstanten aus den Parametern, gleiche Reihenfolge wie JS) */
  const g = (v) => { const s = String(v); return /[.eE]/.test(s) ? s : s + '.0' };
  const glsl = `/* ${VERSION} · Feld GLSL = JS (params sha ${PARAMS_SHA.slice(0, 12)}). A = (x, z, R, y), C = (hx, hz, rot, blend) wie dioSD. */
float kfbNz(vec2 p){ return sin(p.x*1.13+0.7*sin(p.y*0.61))*sin(p.y*0.97+0.6*sin(p.x*0.53)); }
float kfbEdgeWarp(vec2 q){ return ${g(FE.warp[0])}*kfbNz(q*${g(FE.warp_scale[0])}) + ${g(FE.warp[1])}*kfbNz(vec2(q.x*${g(FE.warp_scale[1])}+3.1, q.y*${g(FE.warp_scale[1])}-1.7)); }
float kfbEdgeSdf(vec2 p, vec4 A, vec4 C){ vec2 q=p-A.xy; float cs=cos(C.z), sn=sin(C.z); vec2 r=vec2(cs*q.x+sn*q.y, -sn*q.x+cs*q.y); vec2 e=abs(r)-C.xy; return length(max(e,0.0))+min(max(e.x,e.y),0.0)-A.z; }
float kfbEdgeS(vec2 p, vec4 A, vec4 C){ return kfbEdgeSdf(p,A,C)+kfbEdgeWarp(p-A.xy); }
float kfbEdgeD(vec2 p, vec4 A, vec4 C){ return smoothstep(${g(-FE.w_in)}, ${g(FE.w_out)}, kfbEdgeS(p,A,C)); }
float kfbEdgeD(vec2 p, vec4 A, vec4 C, float strength){ return smoothstep(${g(-FE.w_in)}*strength, ${g(FE.w_out)}, kfbEdgeS(p,A,C)); }   /* = freeEnd mit anchor.strength */
float kfbEdgeEarth(vec2 p, vec4 A, vec4 C){ vec2 q=p-A.xy; float d=${g(ER.band)}-kfbEdgeS(p,A,C);
  float cl=sin(q.x*5.3+1.7*sin(q.y*2.1))*sin(q.y*4.7+1.3*sin(q.x*1.9)); float k=max(0.0, 1.0-abs(d)/${g(ER.sprinkle_width)});
  return d+k*0.5*(0.9*cl+0.25*sin(q.x*11.0+q.y*9.0)); }
`;

  /* ---------------------------------------------------------------- Polygon-Werkzeuge (Port) */
  function chaikin(P, n) {
    for (let it = 0; it < n; it++) { const Q = []; const m = P.length; for (let k = 0; k < m; k++) { const a = P[k], b = P[(k + 1) % m]; Q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]) } P = Q }
    return P;
  }
  function clip(poly, a, b, c) {   /* Halbebene a·x + b·z ≤ c */
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const p = poly[k], q = poly[(k + 1) % poly.length], fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c;
      if (fp <= 0) out.push(p);
      if ((fp <= 0) !== (fq <= 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
    }
    return out;
  }
  const area2 = (P) => { let s = 0; for (let k = 0; k < P.length; k++) { const a = P[k], b = P[(k + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1] } return s / 2 };
  const centroidV = (P) => { let x = 0, z = 0; for (const p of P) { x += p[0]; z += p[1] } return [x / P.length, z / P.length] };   /* wie Python: Eckpunkt-Mittel */
  function perimeter(P) { let s = 0; for (let k = 0; k < P.length; k++) { const a = P[k], b = P[(k + 1) % P.length]; s += Math.hypot(b[0] - a[0], b[1] - a[1]) } return s }
  function dpOpen(P, i0, i1, tol, keep) {
    let best = -1, bi = -1; const a = P[i0], b = P[i1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1e-12;
    for (let i = i0 + 1; i < i1; i++) { const d = Math.abs((P[i][0] - a[0]) * dz - (P[i][1] - a[1]) * dx) / L; if (d > best) { best = d; bi = i } }
    if (best > tol) { keep[bi] = 1; dpOpen(P, i0, bi, tol, keep); dpOpen(P, bi, i1, tol, keep) }
  }
  function simplifyClosed(P, tol, minN) {   /* Douglas-Peucker am geschlossenen Umriss (Budget-Regler) */
    const n = P.length; if (n <= minN) return P;
    let far = 0, fd = -1; for (let i = 1; i < n; i++) { const d = Math.hypot(P[i][0] - P[0][0], P[i][1] - P[0][1]); if (d > fd) { fd = d; far = i } }
    const Q = P.concat([P[0]]), keep = new Uint8Array(n + 1); keep[0] = keep[far] = keep[n] = 1; dpOpen(Q, 0, far, tol, keep); dpOpen(Q, far, n, tol, keep);
    let out = []; for (let i = 0; i < n; i++) if (keep[i]) out.push(P[i]);
    if (out.length < minN) { out = []; for (let k = 0; k < minN; k++) out.push(P[Math.floor((k * n) / minN)]) }
    return out;
  }
  function inTri(p, a, b, c) {
    const d1 = (p[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (p[1] - b[1]), d2 = (p[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (p[1] - c[1]), d3 = (p[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (p[1] - a[1]);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }
  function earclip(P) {   /* Ohrenschnitt für einfache Polygone (gegen den Uhrzeigersinn in x/z) */
    const idx = P.map((_, i) => i), tris = [];
    while (idx.length > 3) {
      let found = false;
      for (let k = 0; k < idx.length; k++) {
        const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length], a = P[i0], b = P[i1], c = P[i2];
        if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 1e-12) continue;
        let ok = true; for (const j of idx) { if (j === i0 || j === i1 || j === i2) continue; if (inTri(P[j], a, b, c)) { ok = false; break } }
        if (!ok) continue; tris.push([i0, i1, i2]); idx.splice(k, 1); found = true; break;
      }
      if (!found) { for (let k = 1; k < idx.length - 1; k++) tris.push([idx[0], idx[k], idx[k + 1]]); return tris }   /* Notfall: Fächer */
    }
    tris.push([idx[0], idx[1], idx[2]]); return tris;
  }
  /* Marching Squares: Gitter G ((nx+1)·(nz+1), innen < 0) → geschlossene Umrisse (innen links), Koordinaten über map(i, j) */
  function marching(G, nx, nzc, map) {
    const at = (i, j) => G[j * (nx + 1) + i], pts = new Map(), segs = new Map();
    const pt = (key, i0, j0, i1, j1) => { let p = pts.get(key); if (!p) { const a = at(i0, j0), b = at(i1, j1), t = a / (a - b); const A = map(i0, j0), B = map(i1, j1); p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; pts.set(key, p) } return p };
    for (let j = 0; j < nzc; j++) for (let i = 0; i < nx; i++) {
      const v = [at(i, j) < 0, at(i + 1, j) < 0, at(i + 1, j + 1) < 0, at(i, j + 1) < 0], c = v[0] | (v[1] << 1) | (v[2] << 2) | (v[3] << 3);
      if (c === 0 || c === 15) continue;
      const E = [['h' + i + ',' + j, i, j, i + 1, j], ['v' + (i + 1) + ',' + j, i + 1, j, i + 1, j + 1], ['h' + i + ',' + (j + 1), i + 1, j + 1, i, j + 1], ['v' + i + ',' + j, i, j + 1, i, j]];
      const starts = [], ends = []; for (let k = 0; k < 4; k++) { if (v[k] && !v[(k + 1) % 4]) starts.push(k); if (!v[k] && v[(k + 1) % 4]) ends.push(k) }
      let pairs;
      if (starts.length === 1) pairs = [[starts[0], ends[0]]];
      else { const ctr = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4 < 0; pairs = c === 5 ? (ctr ? [[0, 1], [2, 3]] : [[0, 3], [2, 1]]) : (ctr ? [[1, 2], [3, 0]] : [[1, 0], [3, 2]]) }
      for (const [s, e] of pairs) { const es = E[s], ee = E[e]; pt(es[0], es[1], es[2], es[3], es[4]); pt(ee[0], ee[1], ee[2], ee[3], ee[4]); segs.set(es[0], ee[0]) }
    }
    const loops = [], used = new Set();
    for (const k0 of segs.keys()) {
      if (used.has(k0)) continue; const L = []; let k = k0, guard = 0;
      while (k !== undefined && !used.has(k) && guard++ < 1e6) { used.add(k); L.push(pts.get(k)); k = segs.get(k) }
      if (L.length >= 3 && k === k0) loops.push(L);
    }
    return loops;
  }
  const rboxSdf = (u, v, hx, hz, r) => { const ex = Math.abs(u) - (hx - r), ez = Math.abs(v) - (hz - r); return Math.hypot(Math.max(ex, 0), Math.max(ez, 0)) + Math.min(Math.max(ex, ez), 0) - r };

  /* ---------------------------------------------------------------- Platte → Dreiecke (Deckfläche, Knet-Fase-Ringe, Wand bis −T; ohne Boden, liegt im Gelände) */
  function emitSlab(B, poly, s) {
    const n = poly.length, cx = s.cx, cz = s.cz;
    /* Knet-Fase als Viertelkreis (0°, 45°) + Schürze bis s.wall unter die Oberkante; Normalen analytisch → rund mit 3 Ringen (Python: 5 Ringe bis −T).
       Die Schürze endet im Gelände (Oberkante liegt nur 0–5 cm über dem Boden); s.wall = T gibt die volle Wand zurück. */
    const f = s.fase, c45 = Math.SQRT1_2, wall = Math.max(s.wall, f + 0.01), rings = f > 0.004 ? [[f, 0], [f * (1 - c45), -f * (1 - c45)], [0, -wall]] : [[0, 0], [0, -wall]];
    const ringN = f > 0.004 ? [[0.25, 0.97], [c45, c45], [1, 0]] : [[1, 0], [1, 0]];
    /* Eckpunkt-Normalen (außen) des Umrisses, CCW in x/z → Kantennormale (dz, −dx) */
    const vn = [], miter = [];
    for (let k = 0; k < n; k++) {
      const p0 = poly[(k + n - 1) % n], p1 = poly[k], p2 = poly[(k + 1) % n];
      let ax = p1[0] - p0[0], az = p1[1] - p0[1], bx = p2[0] - p1[0], bz = p2[1] - p1[1]; const la = Math.hypot(ax, az) || 1, lb = Math.hypot(bx, bz) || 1; ax /= la; az /= la; bx /= lb; bz /= lb;
      let nx = az + bz, nz2 = -ax - bx; const L = Math.hypot(nx, nz2); if (L < 1e-9) { nx = az; nz2 = -ax } else { nx /= L; nz2 /= L }
      vn.push([nx, nz2]); miter.push(1 / Math.max(0.35, nx * az - nz2 * ax));
    }
    /* Starrkörper: Gieren um y, Kippen um k = oben × außen (Außenseite sinkt), dann Versatz; Scherung auf die Geländeneigung */
    const cy = Math.cos(s.yaw || 0), sy = Math.sin(s.yaw || 0), th = s.tilt || 0, ct = Math.cos(th), st = Math.sin(th), kx = s.oz || 0, kz = -(s.ox || 0);
    const rot = (x, y, z) => { const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; if (!th) return [x1, y, z1]; const kv = kx * x1 + kz * z1, cxp = 0 * z1 - kz * y, cyp = kz * x1 - kx * z1, czp = kx * y - 0 * x1; return [x1 * ct + cxp * st + kx * kv * (1 - ct), y * ct + cyp * st, z1 * ct + czp * st + kz * kv * (1 - ct)] };
    const ox = cx + (s.dx || 0), oy = s.topY, oz = cz + (s.dz || 0), sx = s.slope ? s.slope[0] : 0, sz = s.slope ? s.slope[1] : 0;
    const base = B.pos.length / 3, tone = s.tone ?? 1;
    const push = (lx, ly, lz, nxl, nyl, nzl) => {
      const p = rot(lx, ly, lz), q = rot(nxl, nyl, nzl), wx = ox + p[0], wz = oz + p[2], wy = oy + p[1] + sx * p[0] + sz * p[2];
      let mx = q[0] - sx * q[1], my = q[1], mz = q[2] - sz * q[1]; const L = Math.hypot(mx, my, mz) || 1;
      B.pos.push(wx, wy, wz); B.nor.push(mx / L, my / L, mz / L); B.col.push(tone, tone, tone);
    };
    const ins = (k, d) => { const p = poly[k], rc = Math.hypot(p[0] - cx, p[1] - cz); const o = Math.min(d * miter[k], 0.45 * rc); return [p[0] - vn[k][0] * o - cx, p[1] - vn[k][1] * o - cz] };
    /* Deckfläche (eigene Eckpunkte, Normale oben) */
    const top = []; for (let k = 0; k < n; k++) { const q = ins(k, rings[0][0]); top.push(q); push(q[0], rings[0][1], q[1], 0, 1, 0) }
    const tri = (a, b, c) => {   /* Wicklung an der mittleren Eckpunkt-Normale ausrichten */
      const P = B.pos, N = B.nor, ax = P[3 * a], ay = P[3 * a + 1], az = P[3 * a + 2];
      const ux = P[3 * b] - ax, uy = P[3 * b + 1] - ay, uz = P[3 * b + 2] - az, wx = P[3 * c] - ax, wy = P[3 * c + 1] - ay, wz = P[3 * c + 2] - az;
      const fx = uy * wz - uz * wy, fy = uz * wx - ux * wz, fz = ux * wy - uy * wx, mx = N[3 * a] + N[3 * b] + N[3 * c], my = N[3 * a + 1] + N[3 * b + 1] + N[3 * c + 1], mz = N[3 * a + 2] + N[3 * b + 2] + N[3 * c + 2];
      if (fx * mx + fy * my + fz * mz >= 0) B.idx.push(a, b, c); else B.idx.push(a, c, b);
    };
    for (const [a, b, c] of earclip(top)) tri(base + a, base + b, base + c);
    /* Fase-Ringe + Wand */
    const rb = base + n;
    for (let r = 0; r < rings.length; r++) { const [d, y] = rings[r], N2 = ringN[r]; for (let k = 0; k < n; k++) { const q = ins(k, d); push(q[0], y, q[1], vn[k][0] * N2[0], N2[1], vn[k][1] * N2[0]) } }
    for (let r = 0; r < rings.length - 1; r++) for (let k = 0; k < n; k++) {
      const a = rb + r * n + k, b = rb + r * n + ((k + 1) % n), c = rb + (r + 1) * n + k, d = rb + (r + 1) * n + ((k + 1) % n);
      tri(a, c, d); tri(a, d, b);
    }
    return (n - 2) + (rings.length - 1) * 2 * n;
  }

  /* ---------------------------------------------------------------- free_end: Pflasterkern + Verfall zur Wiese (dicht → locker wie path_A → path_D) */
  function freeEnd(anchor, opts = {}) {
    const a = anc(anchor), seed = String(opts.seed ?? 'free_end'), strength = opts.strength ?? a.strength ?? 1;
    const groundAt = typeof opts.groundAt === 'function' ? opts.groundAt : () => a.y;
    const wallD = opts.fullWall ? FE.thickness : FE.fase + (opts.skirt ?? 0.06), T = opts.tile ?? 2.4, joint0 = opts.joint ?? 0.03, rc = opts.corner ?? 0.16, maxTris = opts.maxTris ?? 20000, th = FE.intact_below, h = opts.cell ?? 0.08;
    const Dw = (x, z) => DXZ(x, z, a, strength);
    const cs = Math.cos(a.rot), sn = Math.sin(a.rot);
    const W = (u, v) => [a.x + cs * u - sn * v, a.z + sn * u + cs * v];   /* Anker-lokal → Welt (Umkehr der dioSD-Drehung) */
    const rep = { tool: VERSION, seed, params_sha: PARAMS_SHA, tiles_in: 0, tiles_cut: 0, intact_tiles: 0, intact_rest: 0, pieces: 0, missing: 0, outside: 0, stages: { A: 0, B: 0, C: 0, D: 0 }, piecesD: [], missingD: [], tris: 0, verts: 0 };
    const slabs = [];
    const plane = (x, z) => { const e = 0.5; return [(groundAt(x + e, z) - groundAt(x - e, z)) / (2 * e), (groundAt(x, z + e) - groundAt(x, z - e)) / (2 * e)] };
    /* Kachelraster im Anker-Rahmen, deckt alles mit D < 1 ab (+ Warp-Reserve) */
    const Lx = a.hx + a.R + FE.w_out + FE.warp[0] + FE.warp[1] + 0.3, Lz = a.hz + a.R + FE.w_out + FE.warp[0] + FE.warp[1] + 0.3;
    const nX = Math.ceil((2 * Lx) / T), nZ = Math.ceil((2 * Lz) / T), u0 = (-nX * T) / 2, v0 = (-nZ * T) / 2;
    for (let tj = 0; tj < nZ; tj++) for (let ti = 0; ti < nX; ti++) {
      const tu = u0 + (ti + 0.5) * T, tv = v0 + (tj + 0.5) * T;
      let dMax = 0, dMin = 1; for (let q = 0; q <= 4; q++) for (let r = 0; r <= 4; r++) { const w = W(tu + (q / 4 - 0.5) * T, tv + (r / 4 - 0.5) * T), d = Dw(w[0], w[1]); if (d > dMax) dMax = d; if (d < dMin) dMin = d }
      if (dMin >= 0.999) continue;
      rep.tiles_in++; const rn = rng(seed + ':t' + ti + '_' + tj);
      const loose = clamp01(dMax / th), joint = joint0 * (1 + 1.5 * loose), hb = T / 2 - joint / 2;   /* Mitte dicht und glatt, nach außen loser */
      const tc = W(tu, tv);
      if (dMax < th) {   /* heile Platte: gerundeter Knet-Block (Vorbild _rounded_block) */
        const P = []; for (const [sx_, sz_, a0] of [[1, 1, 0], [-1, 1, 0.5 * Math.PI], [-1, -1, Math.PI], [1, -1, 1.5 * Math.PI]]) for (let k = 0; k <= 3; k++) { const an = a0 + (k / 3) * 0.5 * Math.PI; P.push(W(tu + sx_ * (hb - rc) + Math.cos(an) * rc, tv + sz_ * (hb - rc) + Math.sin(an) * rc)) }
        const c = centroidV(P), ow = outwardXZ(c[0], c[1], a);
        slabs.push({ poly: P, fixed: true, kind: 'intact', s: { cx: c[0], cz: c[1], topY: groundAt(c[0], c[1]) - ER.level_in + rn.uniform(-0.004, 0.004) * loose, slope: plane(c[0], c[1]), fase: FE.fase, T: FE.thickness, wall: wallD, yaw: (rn.uniform(-1, 1) * loose * Math.PI) / 180, tilt: (rn.uniform(0, 0.6) * loose * Math.PI) / 180, ox: ow[0], oz: ow[1], tone: 1 + rn.uniform(-0.03, 0.03) } });
        rep.intact_tiles++; continue;
      }
      rep.tiles_cut++;
      /* Risspunkte nur im Bruchbereich (D ≥ intact_below), Mindestabstand aus der Stufe A → D */
      const pts = [];
      for (let k = 0; k < FE.point_candidates; k++) {
        const lu = tu + rn.uniform(-hb, hb), lv = tv + rn.uniform(-hb, hb), w = W(lu, lv), d = Dw(w[0], w[1]);
        if (d < th) continue;
        const md = SA.diam + (SD.diam - SA.diam) * sm(FE.stage_from, FE.stage_to, d);
        let ok = true; for (const p of pts) if (Math.hypot(w[0] - p[0], w[1] - p[1]) < md * 0.5 + p[2] * 0.5) { ok = false; break }
        if (ok) pts.push([w[0], w[1], md]);
      }
      const box = [W(tu - hb, tv - hb), W(tu + hb, tv - hb), W(tu + hb, tv + hb), W(tu - hb, tv + hb)];
      for (let i = 0; i < pts.length; i++) {
        const [px, pz] = pts[i]; let poly = box;
        for (let j = 0; j < pts.length; j++) if (i !== j) { const [qx, qz] = pts[j]; poly = clip(poly, qx - px, qz - pz, (qx * qx + qz * qz - px * px - pz * pz) / 2) }
        if (poly.length < 3) continue;
        let c = centroidV(poly); const dc = Dw(c[0], c[1]), e_ = 0.05;
        const gx = (Dw(c[0] + e_, c[1]) - Dw(c[0] - e_, c[1])) / (2 * e_), gz = (Dw(c[0], c[1] + e_) - Dw(c[0], c[1] - e_)) / (2 * e_);
        poly = clip(poly, -gx, -gz, dc - th - 0.02 / strength - gx * c[0] - gz * c[1]);   /* an der Isolinie zum heilen Rest abschneiden (Tangente); Versatz / strength = gleiche Fuge in Metern */
        if (poly.length < 3) continue;
        c = centroidV(poly); const d = Dw(c[0], c[1]);
        if (d >= 0.999) { rep.outside++; continue }   /* jenseits D = 1 ist Gelände: kein Stück (sonst gerade Rasterkante) */
        if (rn.random() < Math.max(0, (d - FE.missing_from) / (1 - FE.missing_from)) * FE.missing_max) { rep.missing++; rep.missingD.push(d); continue }
        if (d < th) continue;
        const gp = SA.gap_side + (SD.gap_side - SA.gap_side) * Math.pow(sm(FE.stage_from, 1.0, d), 1.4);
        let P2 = poly.map((q) => { const L = Math.hypot(q[0] - c[0], q[1] - c[1]) || 1, f = Math.max(0, 1 - gp / L); return [c[0] + (q[0] - c[0]) * f, c[1] + (q[1] - c[1]) * f] });
        P2 = chaikin(P2, FE.chaikin);   /* erst Grundform runden, dann leicht wellig + Abplatzer */
        const Q = [];
        for (let k = 0; k < P2.length; k++) {
          const [x0, z0] = P2[k], [x1, z1] = P2[(k + 1) % P2.length], L = Math.hypot(x1 - x0, z1 - z0) || 1, nxv = (z1 - z0) / L, nzv = -(x1 - x0) / L;
          const ph = rn.uniform(0, 6.3), chip = rn.random() < FE.chip_prob ? [rn.uniform(0.3, 0.7), rn.uniform(0.02, 0.05)] : null;
          for (let jj = 0; jj < 2; jj++) {
            const t = jj / 2; let w = FE.edge_wobble * 4 * L * Math.sin(Math.PI * t) * Math.sin(6.3 * t + ph);
            if (chip && Math.abs(t - chip[0]) < 0.15) w -= chip[1] * Math.cos(((t - chip[0]) / 0.15) * Math.PI / 2) ** 2;
            Q.push([x0 + (x1 - x0) * t + nxv * w, z0 + (z1 - z0) * t + nzv * w]);
          }
        }
        P2 = chaikin(Q, 1); if (area2(P2) < 0) P2.reverse();
        if (Math.abs(area2(P2)) < 1e-4) continue;
        const ow = outwardXZ(c[0], c[1], a), sink = FE.sink_max * Math.pow(d, 1.3) * rn.uniform(0.7, 1.3), tilt = FE.tilt_max_deg * Math.pow(d, 1.5) * rn.uniform(0.3, 1.2);
        const drift = FE.drift_max * Math.pow(sm(0.3, 1.0, d), 1.5) * rn.uniform(0.5, 1.2), j_ = FE.jitter * d, jx = rn.uniform(-j_, j_), jz = rn.uniform(-j_, j_), yaw = (rn.uniform(-5, 5) * d * Math.PI) / 180;
        slabs.push({ poly: P2, fixed: false, kind: 'piece', d, s: { cx: c[0], cz: c[1], topY: plateTopXZ(c[0], c[1], a, groundAt, strength) - sink, slope: plane(c[0], c[1]), fase: FE.fase, T: FE.thickness, wall: wallD, yaw, tilt: (tilt * Math.PI) / 180, ox: ow[0], oz: ow[1], dx: ow[0] * drift + jx, dz: ow[1] * drift + jz, tone: 1 - 0.07 * d + rn.uniform(-0.035, 0.035) } });
        rep.pieces++; rep.piecesD.push(d); rep.stages[d < 0.4 ? 'A' : d < 0.6 ? 'B' : d < 0.8 ? 'C' : 'D']++;
      }
      /* heiler Rest: Platte bis zur Isolinie D = intact_below (Marching Squares auf max(D − th, Kachel-SDF)), Bruchkante gerundet über die Fase */
      const m = Math.ceil((2 * hb + 3 * h) / h), g0u = tu - (m * h) / 2, g0v = tv - (m * h) / 2, G = new Float64Array((m + 1) * (m + 1));
      for (let j = 0; j <= m; j++) for (let i = 0; i <= m; i++) { const u = g0u + i * h, v = g0v + j * h, w = W(u, v); G[j * (m + 1) + i] = Math.max(Dw(w[0], w[1]) - th, rboxSdf(u - tu, v - tv, hb, hb, rc)) }
      for (const L of marching(G, m, m, (i, j) => W(g0u + i * h, g0v + j * h))) {
        if (area2(L) <= 0.02) continue;   /* Löcher und Krümel weg */
        const c = centroidV(L);
        slabs.push({ poly: L, fixed: false, kind: 'rest', s: { cx: c[0], cz: c[1], topY: groundAt(c[0], c[1]) - ER.level_in, slope: plane(c[0], c[1]), fase: FE.fase, T: FE.thickness, wall: wallD, tone: 1 + rn.uniform(-0.03, 0.03) } });
        rep.intact_rest++;
      }
    }
    /* Budget: eine Douglas-Peucker-Toleranz für alle freien Umrisse, so dass die Summe ≤ maxTris bleibt */
    const bands = 2, triOf = (nn) => nn - 2 + bands * 2 * nn;
    let nMin = 9; const minN = (sl) => (sl.kind === 'piece' ? nMin : nMin + 1);
    const total = (tol) => { let t = 0; for (const sl of slabs) t += triOf(sl.fixed ? sl.poly.length : simplifyClosed(sl.poly, tol, minN(sl)).length); return t };
    while (nMin > 5 && total(0.5) > maxTris) nMin--;   /* Notfall: sehr viele Stücke → weniger Mindestpunkte */
    let tol = 0.002; if (total(tol) > maxTris) { let lo = tol, hi = 0.5; for (let it = 0; it < 24; it++) { const mid = Math.sqrt(lo * hi); if (total(mid) > maxTris) lo = mid; else hi = mid } tol = hi }
    rep.min_points = nMin;
    const B = { pos: [], nor: [], col: [], idx: [] };
    for (const sl of slabs) { let P = sl.fixed ? sl.poly : simplifyClosed(sl.poly, tol, minN(sl)); if (area2(P) < 0) P = P.slice().reverse(); rep.tris += emitSlab(B, P, sl.s) }
    rep.verts = B.pos.length / 3; rep.dp_tol = +tol.toFixed(4); rep.tile = T;
    const positions = new Float32Array(B.pos), normals = new Float32Array(B.nor), colors = new Float32Array(B.col), index = rep.verts > 65535 ? new Uint32Array(B.idx) : new Uint16Array(B.idx);
    return { positions, normals, colors, index, report: rep };
  }

  /* ---------------------------------------------------------------- Rubbel-Nester (Port kfb_env.nest / relax / rule_report / nest_ok + rubble_nest) */
  const NEST = { sizes: [1.0, 0.62, 0.38], med: [-1.2, 0.1, 1.3], small: [-0.6, 0.7, -2.0, 2.05, 3.1], k: 0.86, spread: 1.75 };
  const RULES = { size_tol: 0.20, spread: 0.30, line_tol: 0.05, neighbour_r: 4.5, overlap: 0.85, air: 1.25 };
  const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function relax(items, k = 8, pull = 0.85, gap = 1.25, split = 1.05) {
    for (let it = 0; it < k; it++) for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const A = items[i], Bb = items[j], d = d2(A.c, Bb.c), s = A.r + Bb.r, q = s ? d / s : 9;
      if (d <= 1e-9 || q <= pull + 1e-6 || q >= gap - 1e-6) continue;
      const want = (q < split ? pull : gap) * s * 1.0001, ux = (Bb.c[0] - A.c[0]) / d, uy = (Bb.c[1] - A.c[1]) / d, m = (want - d) / 2;
      A.c = [A.c[0] - ux * m, A.c[1] - uy * m]; Bb.c = [Bb.c[0] + ux * m, Bb.c[1] + uy * m];
    }
    return items;
  }
  function nest(p, count, R, seed, hang) {
    if (count % 2 === 0) count -= 1; const r_ = mulberry32(seed), out = [];
    const size = (i) => R * NEST.sizes[i === 0 ? 0 : i <= 3 ? 1 : 2] * (0.9 + 0.2 * r_());
    out.push({ c: [p[0], p[1]], r: size(0), role: 'anchor' });
    for (let i = 1; i <= Math.min(3, count - 1); i++) { const r = size(i), an = hang + NEST.med[i - 1] + (r_() - 0.5) * 0.5, d = (R + r) * NEST.k * NEST.spread * (0.9 + 0.3 * r_()); out.push({ c: [p[0] + Math.cos(an) * d, p[1] + Math.sin(an) * d], r, role: 'support' }) }
    for (let i = 4; i < Math.min(count, 4 + NEST.small.length); i++) { const r = size(i), an = hang + NEST.small[i - 4] + (r_() - 0.5) * 0.4, d = (R * 1.62 + r * 0.9) * NEST.spread * (0.9 + 0.3 * r_()); out.push({ c: [p[0] + Math.cos(an) * d, p[1] + Math.sin(an) * d], r, role: 'pebble' }) }
    return relax(out);
  }
  function ruleReport(items) {
    const P = items.map((it) => it.c), r = items.map((it) => it.r ?? 1), n = items.length, nn = [], nnd = [];
    for (let i = 0; i < n; i++) { let bj = -1, bd = Infinity; for (let j = 0; j < n; j++) if (j !== i) { const d = d2(P[i], P[j]); if (d < bd) { bd = d; bj = j } } nn.push(bj); nnd.push(bd) }
    let same = 0; const seen = new Set();
    for (let i = 0; i < n; i++) { const j = nn[i], key = Math.min(i, j) + ',' + Math.max(i, j); if (j < 0 || seen.has(key)) continue; seen.add(key); if (Math.abs(r[i] - r[j]) / Math.max(r[i], r[j]) < RULES.size_tol) same++ }
    const fin = nnd.filter(Number.isFinite), mx = fin.length ? Math.max(...fin) : 0, spread = fin.length >= 2 && mx > 0 ? (mx - Math.min(...fin)) / mx : 1;
    const near = (x, y) => d2(P[x], P[y]) <= (RULES.neighbour_r * (r[x] + r[y])) / 2; let lines = 0;
    for (let m = 0; m < n; m++) for (let x = 0; x < n; x++) { if (x === m || !near(x, m)) continue; for (let c = x + 1; c < n; c++) { if (c === m || !near(c, m)) continue
      const acx = P[c][0] - P[x][0], acy = P[c][1] - P[x][1], L2 = acx * acx + acy * acy; if (L2 <= 0) continue; const amx = P[m][0] - P[x][0], amy = P[m][1] - P[x][1], t = (amx * acx + amy * acy) / L2
      if (t > 0 && t < 1 && Math.hypot(amx - acx * t, amy - acy * t) <= RULES.line_tol * Math.sqrt(L2)) lines++ } }
    let touch = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const q = d2(P[i], P[j]) / (r[i] + r[j]); if (RULES.overlap < q && q < RULES.air) touch++ }
    const failed = [['odd', n % 2 === 0], ['sameSizeAdjacent', same > 0], ['neighbourSpread', spread < RULES.spread], ['collinear', lines > 0], ['nearTouch', touch > 0]].filter((f) => f[1]).map((f) => f[0]);
    return { n, sameSize: same, spread: +spread.toFixed(4), lines, nearTouch: touch, ok: !failed.length, failed };
  }
  function nestOk(p, count, R, seed, hang, tries = 16) {
    let last = null;
    for (let t = 0; t < tries; t++) {
      const out = nest(p, count, R, (seed * 7919 + t) >>> 0, hang), rr = ruleReport(out); last = out;
      if (rr.ok) return { items: out, ok: true };
      if (rr.failed.length === 1 && rr.failed[0] === 'neighbourSpread') {   /* A4: kleinste Stütze sinkt in den Anker */
        const A = out[0], s = out.slice(1).reduce((m, it) => (it.r < m.r ? it : m)), d = d2(A.c, s.c) || 1, want = 0.85 * (A.r + s.r);
        s.c = [A.c[0] + ((s.c[0] - A.c[0]) * want) / d, A.c[1] + ((s.c[1] - A.c[1]) * want) / d];
        if (ruleReport(out).ok) return { items: out, ok: true };
      }
    }
    return { items: last, ok: false };   /* Python wirft hier; im Spiel lieber melden als abbrechen */
  }
  /* contacts: [{x, z, count = 3, R = built_end.rubble.R, hang = vom Anker weg (bergab), seed}] → [{x, z, r, sink, T, y, role}]; sink = eingesunkener Anteil (rubble.sink_frac) */
  function rubbleNests(anchor, contacts, opts = {}) {
    const a = anc(anchor), groundAt = typeof opts.groundAt === 'function' ? opts.groundAt : () => a.y, RB = params.rubble, out = [], rule_ok = [];
    (contacts || []).forEach((ct, k) => {
      const seedTxt = String(ct.seed ?? (opts.seed ?? 'rubble') + ':' + k), hang = ct.hang ?? Math.atan2(ct.z - a.z, ct.x - a.x);
      const G = nestOk([ct.x, ct.z], ct.count ?? params.built_end.rubble.count, ct.R ?? params.built_end.rubble.R, crc32(seedTxt) % 100000, hang); rule_ok.push(G.ok);
      const rn = rng(seedTxt);
      for (const it of G.items) { const T = it.r * RB.thickness_of_r, sk = rn.uniform(RB.sink_frac[0], RB.sink_frac[1]); out.push({ x: it.c[0], z: it.c[1], r: it.r, sink: sk, T, y: groundAt(it.c[0], it.c[1]) + T * (1 - sk), role: it.role, nest: k }) }
    });
    out.report = { nests: rule_ok.length, rule_ok }; return out;
  }

  const api = { version: VERSION, params, paramsText: PARAMS_TEXT, paramsSha: PARAMS_SHA, glsl, D, earth, sdf, S, freeEnd, rubbleNests,
    _: { DXZ, sXZ, sdfXZ, earthXZ, warpQ, nz, outwardXZ, plateTopXZ, sm, marching, chaikin, clip, simplifyClosed, earclip, ruleReport, nestOk, hashStr, mulberry32, crc32, anc } };
  root.KFB_EDGE = api;
  if (typeof module === 'object' && module && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
