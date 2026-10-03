/* KFB WB-W0 · Region (lokale ENU-Welt, 1 Einheit = 1 Meter)
   Reihenfolge wie im Gate: ROUTE → Korridor/Sperrzonen → Gelände um die Route → Inhalt.
   Koordinaten: Quelle (OSM dom-zentrum-v0 / Racer cologne-route) x = Ost, z = Nord.
   three.js hier: X = Ost, Y = oben, Z = −Nord (rechtshändig; sonst wäre die Karte gespiegelt
   und der Globus-Übergang zeigte ein Spiegelbild). Umrechnung ausschliesslich in `src2w`.

   Gelände (eine Höhenwahrheit, `H(x,z)` = dasselbe Gitter, das gerendert wird):
     1 · WB2 terrainHeightAt — Rauschauszug und Zahlen UNVERÄNDERT (seed 43129 · 2,6 · 3,2 · 0,55)
     2 · Biome-Blending: WIESE (nur WB2) ⇄ HÜGEL (Kuppen-fbm) über eine tieffrequente Maske
     3 · Route zuerst: Fahrbahn + Schulter tragen die Routenhöhe, Böschung blendet aus
     4 · Pads (Spawn, Haus, Billboard, Türweg) liegen auf Routenhöhe
     5 · Erosion (thermisch, Talus = Hanggrenze) NUR ausserhalb von Korridor und Pads
     6 · Rand blendet auf 0 — dort schliesst die Fernfläche an
   Hang-/Höhenregeln färben: flach = Wiese, steil = Fels, hoch = trocken. */

import * as THREE from 'three';

/* ---- ZyFou/ProceduralTerrains@f58a8ddb MIT subset, wörtlich aus WB2 @8922d4b1 ---- */
function fract(v){return v-Math.floor(v)}
function hash12(px,py){let p3x=fract(px*0.1031),p3y=fract(py*0.1031),p3z=p3x;const d=p3x*(p3y+33.33)+p3y*(p3z+33.33)+p3z*(p3x+33.33);p3x+=d;p3y+=d;return fract((p3x+p3y)*(p3z+d));}
function vnoise2(px,py){const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy;const ux=fx*fx*fx*(fx*(fx*6-15)+10),uy=fy*fy*fy*(fy*(fy*6-15)+10);const a=hash12(ix,iy),b=hash12(ix+1,iy),c=hash12(ix,iy+1),d=hash12(ix+1,iy+1);const top=a+(b-a)*ux,bot=c+(d-c)*ux;return top+(bot-top)*uy;}
function rot2(x,y){return [0.80*x+0.60*y,-0.60*x+0.80*y]}
function fbm2(px,py,octaves,pers,lac){let amp=.5,sum=0,norm=0,x=px,y=py;const n=Math.max(1,Math.min(9,octaves|0));for(let i=0;i<n;i++){sum+=amp*vnoise2(x,y);norm+=amp;amp*=pers;const r=rot2(x,y);x=r[0]*lac;y=r[1]*lac;}return sum/Math.max(norm,1e-4);}
function seedDomainOffset(value){const numeric=Number(value);if(!Number.isFinite(numeric))return 0;const seed=Math.trunc(numeric);if(seed===0)return 0;let hash=seed>>>0;hash=Math.imul(hash^(hash>>>16),0x7feb352d);hash=Math.imul(hash^(hash>>>15),0x846ca68b);hash=(hash^(hash>>>16))>>>0;return Math.fround((hash/0x100000000)*2048-1024);}
/* ---- end pinned donor subset ---- */

export const WB2_TERRAIN = { seed: 43129, height: 2.6, macroScale: 3.2, detail: 0.55 };   // WB2 DEFAULT_DOC
function wb2Height(x, z, t) {   // WB2 terrainHeightAt ohne Sculpt-Term (Sculpt addiert der Host)
  const ox = seedDomainOffset(t.seed), oz = seedDomainOffset(t.seed ^ 0x51f15e);
  const macro = fbm2((x + ox) * (.13 / t.macroScale), (z + oz) * (.13 / t.macroScale), 5, .5, 2.0);
  const fine = fbm2((x - ox * .37) * (.55 * t.detail), (z + oz * .29) * (.55 * t.detail), 3, .5, 2.13);
  return (macro - .5) * t.height + (fine - .5) * t.height * .18;
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const src2w = (x, zNorth, out = new THREE.Vector3()) => out.set(x, 0, -zNorth);

/* ---------- Massvertrag: jede Zahl mit Quelle ---------- */
export function crossSection(TRACK_WIDTH) {
  const surface = TRACK_WIDTH.STANDARD;            // 18,0 · cologne-route.v1.js TRACK_WIDTH.STANDARD
  const half = surface / 2;
  return {
    surfaceWidth: surface,
    shoulder: 0.30 * half,                          // 2,7 · cologne-track.v1.js crossPoint u 1,00 → 1,30
    walkHalf: 1.30 * half,                          // 11,7 · Fahrbahn + Schulter = Gehbereich
    exclusionHalf: 1.46 * half,                     // 13,14 · äusserstes gebautes Element (Kaskade u 1,46)
    embank: 26,                                     // W0-Setzung: Böschungsbreite, in der das Gelände ausblendet
    notes: 'Racer-Schulter fällt dort 0,9 m auf 2,7 m ab (18°) — in W0 flach, weil Gehbereich ≤ 10° verlangt ist'
  };
}

/* ---------- Route: Racer-Kontrollpunkte, nur der erste SURFACE_BOUND-Abschnitt ---------- */
export function routeFromRacer(R) {
  const all = R.buildRoute({ samplesPerSpan: 26, baseWidth: R.TRACK_WIDTH.STANDARD });
  const cp = R.CONTROL_POINTS;
  const pick = all.points.filter((p) => p.seg <= 1);
  const endCp = cp[2];
  pick.push({ x: endCp[0], z: endCp[1], y: endCp[2], kind: endCp[4], name: endCp[5], seg: 2 });
  const pts = pick.map((p) => ({ w: src2w(p.x, p.z), y: p.y || 0, name: p.name, kind: p.kind }));
  let s = 0;
  pts.forEach((p, i) => { if (i) s += p.w.distanceTo(pts[i - 1].w); p.s = s; p.w.y = p.y; });
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)].w, b = pts[Math.min(pts.length - 1, i + 1)].w;
    p.t = b.clone().sub(a).setY(0).normalize();
    p.n = new THREE.Vector3(-p.t.z, 0, p.t.x);       // links der Fahrtrichtung
  });
  const L = s;
  function sampleAt(u) {
    const d = Math.max(0, Math.min(L, u));
    let i = 1; while (i < pts.length - 1 && pts[i].s < d) i++;
    const a = pts[i - 1], b = pts[i], k = (d - a.s) / Math.max(1e-6, b.s - a.s);
    return { p: a.w.clone().lerp(b.w, k), t: a.t.clone().lerp(b.t, k).normalize(), n: a.n.clone().lerp(b.n, k).normalize(), y: a.y + (b.y - a.y) * k };
  }
  /* Abstand zur Mittellinie + Bogenlänge + Routenhöhe am Fusspunkt */
  function nearest(x, z) {
    let best = Infinity, bs = 0, by = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1].w, b = pts[i].w, dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1;
      const k = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
      const px = a.x + dx * k, pz = a.z + dz * k, d = Math.hypot(x - px, z - pz);
      if (d < best) { best = d; bs = pts[i - 1].s + (pts[i].s - pts[i - 1].s) * k; by = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k; }
    }
    return { d: best, s: bs, y: by };
  }
  return {
    pts, length: L, sampleAt, nearest,
    source: 'cologne-route.v1.js CONTROL_POINTS[0..2] · ' + cp[0][5] + ' → ' + cp[2][5] + ' · kinds ' + [...new Set(cp.slice(0, 3).map((c) => c[4]))].join('/'),
    widthNote: 'buildRoute w = breitenFaktor × 18 (1,15 · 1,15 · 1,05) wird NICHT benutzt — W0 beweist das konstante Profil 18,0'
  };
}

/* ---------- Zonen (Sperrflächen) ---------- */
export function rectZone(id, c, yaw, hw, hd, margin, kind) {
  const cs = Math.cos(yaw), sn = Math.sin(yaw);
  return {
    id, kind, c: c.clone(), yaw, hw, hd, margin,
    local(x, z) { const dx = x - c.x, dz = z - c.z; return { u: dx * cs - dz * sn, v: dx * sn + dz * cs }; },
    dist(x, z) { const q = this.local(x, z); const ex = Math.max(0, Math.abs(q.u) - hw), ez = Math.max(0, Math.abs(q.v) - hd); return Math.hypot(ex, ez) - ((Math.abs(q.u) <= hw && Math.abs(q.v) <= hd) ? Math.min(hw - Math.abs(q.u), hd - Math.abs(q.v)) : 0); }
  };
}
export function circleZone(id, c, r, kind) { return { id, kind, c: c.clone(), r, dist(x, z) { return Math.hypot(x - c.x, z - c.z) - r; } }; }
export function segZone(id, a, b, half, kind) {
  return { id, kind, a: a.clone(), b: b.clone(), half, dist(x, z) {
    const dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1, k = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
    return Math.hypot(x - (a.x + dx * k), z - (a.z + dz * k)) - half; } };
}

/* ---------- Gelände ---------- */
export function buildTerrain({ route, xs, pads, center, half = 256, step = 2, erosionTalusDeg = 30, edgeColor = null, log = () => {} }) {
  const N = Math.round(half * 2 / step), V = N + 1;
  const H = new Float32Array(V * V), keep = new Float32Array(V * V), biome = new Float32Array(V * V);
  const x0 = center.x - half, z0 = center.z - half;
  const t = WB2_TERRAIN;
  for (let j = 0; j < V; j++) for (let i = 0; i < V; i++) {
    const x = x0 + i * step, z = z0 + j * step, k = j * V + i;
    const sx = x, sz = -z;                                          // Quellkoordinaten für das Rauschen
    const base = wb2Height(sx, sz, t);
    const wb = sstep(0.36, 0.64, fbm2(sx / 420 + 17.1, sz / 420 - 3.7, 3, .5, 2));
    const hills = Math.max(0, fbm2(sx / 140 + 5.3, sz / 140 + 11.9, 5, .5, 2) - 0.42) * 2 * 16;
    let h = base + wb * hills;
    biome[k] = wb;
    /* Route zuerst: Gehbereich = Routenhöhe, Böschung blendet über `embank` aus */
    const nr = route.nearest(x, z);
    let w = 1 - sstep(xs.walkHalf, xs.exclusionHalf + xs.embank, nr.d);
    let hy = nr.y;
    for (const p of pads) {
      const d = p.dist(x, z), wp = 1 - sstep(0, p.blend, d);
      if (wp > w) { w = wp; hy = p.y; }
    }
    /* Rand: auf 0 ausblenden (Anschluss an die Fernfläche) */
    const edge = Math.min(i, j, N - i, N - j) * step;
    const we = sstep(0, 70, edge);
    h = (h * (1 - w) + hy * w) * we;
    keep[k] = Math.max(w * w * w, (1 - we) * (1 - we));   // nur fast volle Route/Pads/Rand sind geschützt — Böschungen erodieren mit
    H[k] = h;
  }
  /* Thermische Erosion: Talus = Hanggrenze. Korridor/Pads/Rand bleiben unberührt. */
  const tal = Math.tan(erosionTalusDeg * Math.PI / 180) * step;
  let moved = 0;
  for (let it = 0; it < 400; it++) {
    moved = 0;
    for (let j = 1; j < N; j++) for (let i = 1; i < N; i++) {
      const k = j * V + i;
      for (const o of [1, -1, V, -V]) {
        const d = H[k] - H[k + o];
        if (d <= tal) continue;
        const m = (d - tal) * 0.5 * (1 - keep[k]) * (1 - keep[k + o]);
        if (m <= 1e-5) continue;
        H[k] -= m; H[k + o] += m; moved += m;
      }
    }
    if (moved < 0.01) break;
  }
  /* Abfrage: dieselbe Dreieckszerlegung wie three.PlaneGeometry nach rotateX(−π/2)
     (Diagonale von (i, j+1) nach (i+1, j)) — Figur und Bild stehen auf derselben Fläche */
  function Hat(x, z) {
    const fx = (x - x0) / step, fz = (z - z0) / step;
    if (fx < 0 || fz < 0 || fx >= N || fz >= N) return 0;
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
    const h00 = H[j * V + i], h10 = H[j * V + i + 1], h01 = H[(j + 1) * V + i], h11 = H[(j + 1) * V + i + 1];
    return u + v <= 1 ? h00 + (h10 - h00) * u + (h01 - h00) * v : h11 + (h01 - h11) * (1 - u) + (h10 - h11) * (1 - v);
  }
  function slopeDeg(x, z) {
    const e = step * 0.5;
    const gx = (Hat(x + e, z) - Hat(x - e, z)) / (2 * e), gz = (Hat(x, z + e) - Hat(x, z - e)) / (2 * e);
    return Math.atan(Math.hypot(gx, gz)) * 180 / Math.PI;
  }
  /* Mesh */
  const g = new THREE.PlaneGeometry(half * 2, half * 2, N, N);
  g.rotateX(-Math.PI / 2);
  const P = g.attributes.position, col = new Float32Array(P.count * 3);
  const grass = new THREE.Color(0x5f9a3f), meadow = new THREE.Color(0x7fae4c), dry = new THREE.Color(0xb3a067), rock = new THREE.Color(0x8b7d6b), c = new THREE.Color();
  for (let q = 0; q < P.count; q++) {
    const x = P.getX(q) + center.x, z = P.getZ(q) + center.z;
    const i = Math.round((x - x0) / step), j = Math.round((z - z0) / step), k = j * V + i;
    const h = H[k];
    P.setXYZ(q, x, h, z);
    const sl = slopeDeg(x, z);
    c.copy(grass).lerp(meadow, 1 - biome[k]);
    c.lerp(dry, sstep(6, 16, h) * 0.6);
    c.lerp(rock, sstep(erosionTalusDeg - 2, erosionTalusDeg + 3, sl));   // über der Grenze sichtbar Fels = nicht begehbar
    if (edgeColor) { const ed = Math.min(x - x0, z - z0, x0 + half * 2 - x, z0 + half * 2 - z); c.lerp(edgeColor, 1 - sstep(10, 90, ed)); }
    col[q * 3] = c.r; col[q * 3 + 1] = c.g; col[q * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
  mesh.name = 'w0:terrain';
  mesh.receiveShadow = true;
  let maxS = 0, over = 0, cells = 0, overNearWalk = Infinity;
  for (let j = 1; j < N; j += 2) for (let i = 1; i < N; i += 2) {
    const x = x0 + i * step, z = z0 + j * step, s = slopeDeg(x, z);
    cells++; maxS = Math.max(maxS, s);
    if (s > erosionTalusDeg) {
      over++;
      let d = route.nearest(x, z).d - xs.walkHalf;
      for (const p of pads) d = Math.min(d, p.dist(x, z));
      overNearWalk = Math.min(overNearWalk, d);
    }
  }
  log('terrain · ' + (half * 2) + ' × ' + (half * 2) + ' m @' + step + ' m · WB2 base (seed ' + t.seed + ' · ' + t.height + ' · ' + t.macroScale + ' · ' + t.detail + ') + hills biome · erosion talus ' + erosionTalusDeg + '° · max slope ' + maxS.toFixed(1) + '°');
  return { mesh, H: Hat, slopeDeg, x0, z0, N, step, half, center, maxSlope: maxS, overShare: over / cells, overNearWalk, limitDeg: erosionTalusDeg };
}

/* ---------- Fahrbahn als Band (Racer TrackFlow-Querschnitt, flach) ---------- */
export function buildRouteMesh(route, xs, C, lift = 0.04) {
  const group = new THREE.Group(); group.name = 'w0:route';
  const flat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...o });
  const band = (u0, u1, y, mat, name, s0 = 0, s1 = route.length) => {
    const pos = [], idx = [];
    const n = Math.max(2, Math.ceil((s1 - s0) / 1.5));
    for (let i = 0; i <= n; i++) {
      const q = route.sampleAt(s0 + (s1 - s0) * i / n);
      const a = q.p.clone().addScaledVector(q.n, u0), b = q.p.clone().addScaledVector(q.n, u1);
      pos.push(a.x, q.y + y, a.z, b.x, q.y + y, b.z);
      if (i) { const k = (i - 1) * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); m.name = name; m.receiveShadow = true;
    if (g.attributes.normal.getY(0) < 0) { g.index.array.reverse(); g.computeVertexNormals(); }
    group.add(m); return m;
  };
  const h = xs.surfaceWidth / 2;
  band(-h, h, lift, flat(C.bed, { emissive: C.bedDark, emissiveIntensity: 0.35 }), 'route-surface');
  band(h, xs.walkHalf, lift * 0.8, flat(C.shoulder), 'route-shoulder-L');
  band(-xs.walkHalf, -h, lift * 0.8, flat(C.shoulder), 'route-shoulder-R');
  band(h * 0.955, h, lift * 1.4, flat(C.lineOuter), 'route-edge-L');
  band(-h, -h * 0.955, lift * 1.4, flat(C.lineOuter), 'route-edge-R');
  for (let s = 0; s < route.length - 5; s += 12) band(-h * 0.026, h * 0.026, lift * 1.5, flat(C.lineYellow), 'route-dash', s, s + 5);   // Racer DASH 5 / GAP 7
  return group;
}
