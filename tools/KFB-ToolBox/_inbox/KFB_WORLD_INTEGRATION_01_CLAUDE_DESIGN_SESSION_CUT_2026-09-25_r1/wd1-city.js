/* KFB WB-DESIGN-PARALLEL-01 · City presenter
   Liest die Presentation Seam (wd1-seam.js). Keine Geometrie wird erfunden: jede Fläche ist eine
   OSM-Fläche, jede Linie eine OSM-Mittellinie der Fixture.

   Owner, IMPORTED_AND_CALLED (vom Host übergeben):
   · EG  experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs @0c59e92d
         buildElasticShell · buildElasticRoof · protectedDetails  (Elastic Grotesque Clay V2)
   · ELASTIC_PALETTE  KFB_WONKY_90S_CLAY_V1 — wörtlich aus viewer.mjs @0c59e92d (walls/roofs/
         windows/doors/ground/road/curb/path), Zuordnung colorSlot() wie im Viewer
   · CC  tools/osm-city-lab/src/style/cartoon-city.js  stableHash
   · Wasser-Material: wd1-water.js (Presets), hier nur Geometrie + aFlow
   Straßen (Georg 24.09.: „Bastel-Kreise müssen weg"): KEINE Straßengeometrie mehr. Alle Straßen,
   Wege und Grünflächen werden als Karte in EINE Bodentextur gezeichnet (Canvas, round join/cap, je
   Klasse in fester Reihenfolge) — Vereinigung statt überlappender Bänder, keine Endscheiben, kein
   z-Fighting zwischen Schichten. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const ELASTIC_PALETTE = {
  id: 'KFB_WONKY_90S_CLAY_V1',
  walls: ['#f1c85b', '#e77d62', '#82b9a2', '#79a8c7', '#cf92b6', '#b8c85c', '#ef9e58', '#a993c9'],
  roofs: ['#d55e4b', '#4e7e79', '#695f86', '#c77a4b', '#78604d', '#58728d'],
  windows: ['#315d66', '#394c6d', '#336c70'],
  doors: ['#a94f46', '#5a6f84', '#c06a3c', '#6d527a', '#477b69'],
  ground: '#adc767', road: '#89768f', curb: '#e0c779', path: '#d9bb84', sky: '#bdc8aa'
};
const CLEAN = { ground: '#ece8e0', green: '#cfd8c6', water: '#bccdd6', road: '#6d6a72', curb: '#9a969c', path: '#f6f3ec', foot: '#dcd6ca', rail: { bed: '#cfc8bb', sleeper: '#b9b0a2', rail: '#8a8478' } };
const DRIVE = new Set(['primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'residential', 'service', 'living_street', 'unclassified']);
const FOOT = new Set(['footway', 'path', 'cycleway', 'steps', 'corridor', 'platform', 'track']);

export function layersFrom(style) {
  const L = style.layers, g = L.groundY;
  return { plate: L.landuseY - g, water: L.waterAreaY - g + 0.03 };
}
/* Welt-z ist gespiegelt (src2w) und OSM-Ringe haben beliebigen Umlaufsinn → EG-Schalen kommen mit
   gemischt orientierten Dreiecken an. Für FrontSide + shadowSide Back (gegen Schatten-Akne) wird die
   Orientierung repariert, OHNE die Geometrie zu ändern:
   · Wände (die ersten (rows−1)·L·6 Indizes): Stichprobe in der mittleren Reihe — zeigt die Normale in
     den Ring der Reihe hinein, werden alle Wand-Dreiecke gedreht.
   · Deckel (Rest): je Dreieck, oben nach +y, unten nach −y. */
function orientEG(g, L) {
  const P = g.attributes.position, ix = g.index.array, rows = P.count / L;
  if (!Number.isInteger(rows) || rows < 2) return 0;
  const nWall = (rows - 1) * L * 6, v = (k) => [P.getX(k), P.getY(k), P.getZ(k)];
  const flip = (t) => { const x = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = x; };
  const fn = (t) => { const A = v(ix[t]), B = v(ix[t + 1]), C = v(ix[t + 2]); const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], w = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]; return { n: [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]], c: [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3] }; };
  let flips = 0;
  const mid = Math.floor((rows - 1) / 2), rowPts = []; for (let i = 0; i < L; i++) rowPts.push({ x: P.getX(mid * L + i), z: P.getZ(mid * L + i) });
  let votes = 0;
  for (let i = 0; i < L; i += Math.max(1, Math.floor(L / 7))) {
    const t = (mid * L + i) * 6; if (t + 2 >= nWall) break;
    const f = fn(t), h = Math.hypot(f.n[0], f.n[2]) || 1, px = f.c[0] + f.n[0] / h * 0.3, pz = f.c[2] + f.n[2] / h * 0.3;
    votes += pointInPoly(px, pz, rowPts) ? -1 : 1;
  }
  if (votes < 0) { for (let t = 0; t < nWall; t += 3) flip(t); flips++; }
  let ymin = Infinity, ymax = -Infinity; for (let k = 0; k < P.count; k++) { const y = P.getY(k); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
  const ym = (ymin + ymax) / 2;
  for (let t = nWall; t < ix.length; t += 3) { const f = fn(t); if ((f.c[1] > ym ? 1 : -1) * f.n[1] < 0) flip(t); }
  g.index.needsUpdate = true; g.computeVertexNormals();
  return flips;
}
function solidity(r) {
  const area = (p) => { let a = 0; for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j].x + p[i].x) * (p[j].z - p[i].z); return Math.abs(a) / 2; };
  const pts = r.slice().sort((a, b) => a.x - b.x || a.z - b.z), cr = (o, a, b) => (a.x - o.x) * (b.z - o.z) - (a.z - o.z) * (b.x - o.x), lo = [], hi = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const hull = lo.slice(0, -1).concat(hi.slice(0, -1)), ha = area(hull);
  return ha > 0 ? area(r) / ha : 1;
}
function ring(pts) { const r = pts.slice(); if (r.length > 2 && Math.hypot(r[0].x - r[r.length - 1].x, r[0].z - r[r.length - 1].z) < 0.01) r.pop(); return r; }
export const pointInPoly = (x, z, r) => { let ins = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const xi = r[i].x, zi = r[i].z, xj = r[j].x, zj = r[j].z; if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) ins = !ins; } return ins; };
const distToRing = (x, z, r) => { let best = Infinity; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const ax = r[j].x, az = r[j].z, dx = r[i].x - ax, dz = r[i].z - az, l2 = dx * dx + dz * dz || 1, k = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2)); best = Math.min(best, Math.hypot(x - ax - dx * k, z - az - dz * k)); } return best; };
/* Teil der Landmarke = ≥ 60 % der Ecken im OSM-Grundriss der Landmarke oder ≤ 3 m davor */
const partOf = (r, lm) => { let n = 0; for (const p of r) if (pointInPoly(p.x, p.z, lm) || distToRing(p.x, p.z, lm) <= 3) n++; return n / r.length >= 0.6; };

/* ---------- Boden als Karte: eine Textur, keine Straßennetze ---------- */
/* rect/px (WORLD-INTEGRATION-01): the same map, drawn for a sub-rect at higher resolution — the walkable
   edit tile needs ~3 cm/px; the zone-wide 4096 px map is 0.17 m/px and reads pixelated at street level. */
function groundTexture(zone, col, stats, renderer, rect = null, px = 4096) {
  const R = rect || zone.rectW, W = R.maxX - R.minX, D = R.maxZ - R.minZ;
  const cw = px, ch = Math.round(cw * D / W), s = cw / W;
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const c = cv.getContext('2d');
  const P = (p) => [(p.x - R.minX) * s, (p.z - R.minZ) * s];
  c.fillStyle = col.ground; c.fillRect(0, 0, cw, ch);
  const poly = (pts, fill) => { const r = ring(pts); if (r.length < 3) return; c.beginPath(); r.forEach((p, i) => { const [x, y] = P(p); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); c.fillStyle = fill; c.fill(); };
  for (const l of zone.landuse) if (l.cls === 'green') poly(l.poly, col.green);
  for (const w of [...zone.water, ...zone.landuse.filter((l) => l.cls === 'water')]) poly(w.poly, col.water);
  const tiers = { foot: [], ped: [], drive: [] };
  for (const r of zone.roads) {
    if (r.cls === 'elevator') continue;
    if (r.tunnel === 'yes' || r.layer < 0) { stats.tunnelsSkipped++; continue; }
    const t = DRIVE.has(r.cls) ? 'drive' : r.cls === 'pedestrian' ? 'ped' : FOOT.has(r.cls) ? 'foot' : null;
    if (!t) continue;
    tiers[t].push(r); stats.roadParts++; stats.roadsByTier[t] = (stats.roadsByTier[t] || 0) + 1;
  }
  /* Straßen-Enden/-Anschlüsse (Georg 24.09.): OSM teilt eine Straße in viele Wege mit wechselnder Breite.
     Runde Kappen an JEDEM Wegende erzeugten Beulen und Einschnürungen. Jetzt:
     · Wege gleicher Klasse + Breite, die an einem Knoten Ende-an-Ende stoßen, werden zu EINER Polylinie
       verkettet (Knick wird Gehrung/round join, keine Kappe);
     · Kappen stumpf (butt);
     · an jedem Knoten mit ≥ 2 Wegenden eine Kreisscheibe mit dem Radius der BREITESTEN Straße dort
       (glatte Kreuzung, nichts ragt über die breiteste Fahrbahn hinaus);
     · echte Sackgassen (1 Wegende, kein anderer Weg in der Nähe) bekommen eine runde Kappe.
     Dieselbe Topologie für Bordstein (+0,9 m je Seite) und Fahrbahn. */
  const wOf = (r, d) => Math.max(d, r.w || d);
  const key = (p) => Math.round(p.x * 2) + ',' + Math.round(p.z * 2);
  function chains(list, width) {
    const byEnd = new Map(), used = new Set(), out = [];
    /* WORLD-INTEGRATION-01 (Georg 25.09., street level): chain by CLASS, not class+width. OSM changes the width
       tag mid-street; chaining only equal widths left a visible step in kerb and road at every change. The chain
       is drawn at the widest member's width → one continuous line. */
    const sig = (r) => r.cls;
    list.forEach((r, i) => { for (const e of [0, 1]) { const k = key(e ? r.line[r.line.length - 1] : r.line[0]); if (!byEnd.has(k)) byEnd.set(k, []); byEnd.get(k).push({ i, e }); } });
    const nextAt = (k, s, self) => { const L = (byEnd.get(k) || []).filter((q) => q.i !== self && !used.has(q.i)); return L.length === 1 && (byEnd.get(k).length === 2) && sig(list[L[0].i]) === s ? L[0] : null; };
    list.forEach((r, i) => {
      if (used.has(i)) return; used.add(i);
      let pts = r.line.slice(); const s = sig(r); let wMax = width(r);
      for (let dir = 0; dir < 2; dir++) {
        for (;;) {
          const endP = dir ? pts[0] : pts[pts.length - 1], n = nextAt(key(endP), s, -1);
          if (!n) break; used.add(n.i); wMax = Math.max(wMax, width(list[n.i]));
          let add = list[n.i].line.slice(); if (n.e === 1) add.reverse();      // add beginnt am Knoten
          if (dir) { add.reverse(); pts = add.slice(0, -1).concat(pts); } else pts = pts.concat(add.slice(1));
        }
      }
      out.push({ r, pts, w: wMax });
    });
    return { out, byEnd };
  }
  function strokeNet(list, width, color, extra = 0) {
    const { out, byEnd } = chains(list, width);
    c.strokeStyle = color; c.fillStyle = color; c.lineJoin = 'round'; c.lineCap = 'butt';
    for (const ch of out) { c.lineWidth = Math.max(1, (ch.w + extra) * s); c.beginPath(); ch.pts.forEach((p, i) => { const [x, y] = P(p); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
    const nodeW = new Map();
    for (const ch of out) for (const p of [ch.pts[0], ch.pts[ch.pts.length - 1]]) { const k = key(p); nodeW.set(k, { p, w: Math.max(nodeW.get(k)?.w || 0, ch.w + extra), n: (nodeW.get(k)?.n || 0) + 1 }); }
    for (const [k, v] of nodeW) {
      const deg = (byEnd.get(k) || []).length;
      if (deg >= 2 || v.n >= 2 || deg === 1) { const [x, y] = P(v.p); c.beginPath(); c.arc(x, y, Math.max(0.5, v.w * s / 2), 0, Math.PI * 2); c.fill(); }
    }
    return out.length;
  }
  stats.chains = {};
  stats.chains.foot = strokeNet(tiers.foot, (r) => Math.min(3, wOf(r, 1.6)), col.foot);
  stats.chains.ped = strokeNet(tiers.ped, (r) => wOf(r, 4), col.path);
  strokeNet(tiers.drive, (r) => wOf(r, 7), col.curb, 1.8);          // Bordstein = Fahrbahn + 2 × 0,9 m
  stats.chains.drive = strokeNet(tiers.drive, (r) => wOf(r, 7), col.road);
  /* Schienen (Hauptstrecken): OSM railway=rail, ohne service (Abstell-/Rangiergleise) und ohne Tunnel.
     Cartoon-Gleis in der Bodenkarte: Schotterbett → Schwellen → zwei Schienen. Farben aus KFB_WONKY_90S_CLAY_V1
     (Bett roofs #78604d · Schwellen roofs #c77a4b · Schiene walls #79a8c7). Die Mittellinien
     bleiben in der Seam (zone.railways) — fahrbar wie Straßen ist Sache des späteren Track-/Zone-Owners. */

  stats.railMode = 'geometry (crisp; not in the ground map)';
  c.setLineDash([]);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  stats.groundTexture = cw + ' × ' + ch + ' px · ' + (1 / s).toFixed(2) + ' m/px';
  return tex;
}

/* ---------- Türen/Fenster, die der Schale folgen ----------
   Platzierung (u, t, Breite, Höhe, Tiefe, Versatz) ist protectedDetails() aus elastic-grotesque-clay.mjs
   WORTGLEICH — dieselbe Zufallsfolge (mulberry32(stableHash('kfb-elastic-facade-v2:'+id))), dieselben
   Aufrufe in derselben Reihenfolge. DELTA: statt eines flachen Quaders am Mittelpunkt wird jede Tür
   und jedes Fenster als gekrümmte Platte gebaut — jeder Eckpunkt läuft durch deformElasticXZ/Y und
   die Fassadennormale in SEINER Höhe. Damit folgen sie Bauch, Neigung, Biegung und Drehung. */
function longestEdge(p) { let best = { i: 0, len: 0 }; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], len = Math.hypot(b.x - a.x, b.z - a.z); if (len > best.len) best = { i, len, a, b }; } return best; }
function detailSpecs(EG, CC, building, shell) {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const P = shell.params, p = EG.openFootprint(building.footprint), edge = longestEdge(p), a = edge.a, b = edge.b;
  const r = CC.mulberry32(CC.stableHash('kfb-elastic-facade-v2:' + building.id)), out = [];
  const doorU = .16 + r() * .68, doorW = 1.45 + r() * .55, doorH = 2.35 + r() * .55, doorT = clamp((doorH * .5) / P.h, .06, .22);
  out.push({ kind: 'door', u: doorU, t: doorT, w: doorW, h: doorH, d: .15, off: .13 });
  const wanted = 2 + (r() > .52 ? 1 : 0), picked = [];
  for (let tries = 0; tries < 30 && picked.length < wanted; tries++) {
    const u = .13 + r() * .74, v = .25 + r() * .50;
    if (Math.abs(u - doorU) < .22) continue;
    if (picked.some((w) => Math.hypot((u - w.u) * 1.15, v - w.v) < .23)) continue;
    picked.push({ u, v });
  }
  for (const w of picked) out.push({ kind: 'window', u: w.u, t: w.v, w: .82 + r() * .34, h: 1.65 + r() * .55, d: .10, off: .105 });
  return { P, a, b, len: edge.len, list: out };
}
/* Umriss je Detail: Breitenfaktor über die Höhe v∈[0,1] (unten → oben) */
const SHAPE_W = {
  rect: () => 1,
  'trap-up': (v) => 0.8 + 0.4 * v,          // nach oben breiter
  'trap-down': (v) => 1.18 - 0.36 * v,      // nach oben schmaler
  arch: (v) => v < 0.6 ? 1 : Math.sqrt(Math.max(0.05, 1 - Math.pow((v - 0.6) / 0.4, 2)))
};
function conformDetail(EG, S, d, yBase, P_, I_) {
  const { P, a, b, len } = S, dx = b.x - a.x, dz = b.z - a.z, NU = 2, NV = !d.shape || d.shape === 'rect' ? 2 : 6, wf = SHAPE_W[d.shape] || SHAPE_W.rect;
  const base0 = P_.length / 3;
  const at = (uu, tt, depth) => {
    const t = Math.max(0, Math.min(1, tt)), bp = { x: a.x + dx * uu, z: a.z + dz * uu };
    const q = EG.deformElasticXZ(bp, t, P), y = EG.deformElasticY(bp, t, P);
    const da = EG.deformElasticXZ(a, t, P), db = EG.deformElasticXZ(b, t, P), ex = db.x - da.x, ez = db.z - da.z, l = Math.hypot(ex, ez) || 1;
    let nx = -ez / l, nz = ex / l;
    if (S.out) { nx *= S.out; nz *= S.out; }      // Außenseite am unverformten Grundriss bestimmt (konkav-sicher)
    else { const cc = EG.deformElasticXZ(P.c, t, P); if (nx * ((da.x + db.x) / 2 - cc.x) + nz * ((da.z + db.z) / 2 - cc.z) < 0) { nx = -nx; nz = -nz; } }
    return [q.x + nx * depth, y + yBase, q.z + nz * depth];
  };
  const du = d.w / len, dt = d.h / P.h;
  for (const depth of [d.off + d.d / 2, d.off - d.d / 2 - 0.04]) {      // Front, Rückseite (in der Wand)
    for (let j = 0; j <= NV; j++) { const k = wf(j / NV); for (let i = 0; i <= NU; i++) P_.push(...at(d.u + (i / NU - .5) * du * k, d.t + (j / NV - .5) * dt, depth)); }
  }
  const F = (i, j) => base0 + j * (NU + 1) + i, B = (i, j) => F(i, j) + (NU + 1) * (NV + 1);
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) I_.push(F(i, j), F(i + 1, j), F(i, j + 1), F(i + 1, j), F(i + 1, j + 1), F(i, j + 1));
  const side = (p, q) => I_.push(F(...p), F(...q), B(...p), F(...q), B(...q), B(...p));
  for (let i = 0; i < NU; i++) { side([i, 0], [i + 1, 0]); side([i + 1, NV], [i, NV]); }
  for (let j = 0; j < NV; j++) { side([NU, j], [NU, j + 1]); side([0, j + 1], [0, j]); }
}

/* ---------- KFB FACADE RULE v1 (Georg 25.09.: „auch größere Gebäude ohne Fenster sieht doof aus“) ----------
   Globale Regel für ALLE Zonen, ersetzt protectedDetails() (1 Tür + 2–3 Fenster auf der längsten Kante).
   · Jede Fassadenkante ≥ minEdge, die NICHT Brandwand ist (Sonde 1 m vor der Kante liegt in einem
     Nachbargrundriss), bekommt Fensterreihen je Geschoss (floorH).
   · Unregelmäßig, aber lesbar: Raster je Gebäude (Abstand aus spacing), Reihe je Geschoss leicht versetzt
     (rowShift), je Fenster Jitter in u/t, einzelne Lücken (skip).
   · Tür auf der Kante, die einer OSM-Straße/einem Weg am nächsten ist (sonst längste freie Kante); lange
     Straßenfassaden bekommen weitere Türen (extraDoorEvery). Garagen: ein breites Tor, keine Fenster.
   · Varianz: Grundform je Gebäude (rect/arch/trap-up/trap-down) mit Ausreißern je Detail, Größen gestreut.
   · Deterministisch: mulberry32(stableHash(rule.id + ':' + id)). Obergrenze je Gebäude: cap. */
export const FACADE_RULE = { id: 'kfb-facade-rule-v1', floorH: 3.0, minEdge: 2.4, margin: 0.8, spacing: [2.6, 3.8], skip: 0.13, rowShift: 0.1, jitterU: 0.2, jitterT: 0.05, cap: 140, extraDoorEvery: 15, roadProbeM: 1.5, roadMaxM: 40 };
function facadeContext(zone) {
  const CB = 25, bg = new Map(), key = (i, j) => i + ',' + j;
  for (const b of zone.buildings) {
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const p of b.fp) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
    for (let i = Math.floor(x0 / CB); i <= Math.floor(x1 / CB); i++) for (let j = Math.floor(z0 / CB); j <= Math.floor(z1 / CB); j++) { const k = key(i, j); if (!bg.has(k)) bg.set(k, []); bg.get(k).push(b); }
  }
  const CR = 8, rg = new Map();
  for (const r of zone.roads) {
    if (r.tunnel === 'yes' || r.layer < 0 || !(DRIVE.has(r.cls) || FOOT.has(r.cls) || r.cls === 'pedestrian')) continue;
    for (let i = 1; i < r.line.length; i++) { const A = r.line[i - 1], B = r.line[i], L = Math.hypot(B.x - A.x, B.z - A.z), n = Math.max(1, Math.ceil(L / 3)); for (let k = 0; k <= n; k++) { const x = A.x + (B.x - A.x) * k / n, z = A.z + (B.z - A.z) * k / n, c = key(Math.floor(x / CR), Math.floor(z / CR)); if (!rg.has(c)) rg.set(c, []); rg.get(c).push(x, z); } }
  }
  return {
    inOther(x, z, id) { const L = bg.get(key(Math.floor(x / CB), Math.floor(z / CB))); return !!L && L.some((o) => o.id !== id && pointInPoly(x, z, o.fp)); },
    roadDist(x, z, max) { const ci = Math.floor(x / CR), cj = Math.floor(z / CR), R = Math.ceil(max / CR); let best = Infinity; for (let i = ci - R; i <= ci + R; i++) for (let j = cj - R; j <= cj + R; j++) { const L = rg.get(key(i, j)); if (L) for (let k = 0; k < L.length; k += 2) best = Math.min(best, Math.hypot(L[k] - x, L[k + 1] - z)); } return best <= max ? best : Infinity; }
  };
}
function facadeSpecs(EG, CC, building, shell, FX, st) {
  const R = FACADE_RULE, P = shell.params, fp = EG.openFootprint(building.footprint), n = fp.length;
  const rnd = CC.mulberry32(CC.stableHash(R.id + ':' + building.id)), lerp = (a, b, k) => a + (b - a) * k;
  const SH = ['rect', 'rect', 'rect', 'rect', 'arch', 'arch', 'trap-up', 'trap-down'];
  const baseShape = SH[Math.floor(rnd() * SH.length)], shapeOf = () => rnd() < 0.18 ? SH[Math.floor(rnd() * SH.length)] : baseShape;
  const H = P.h, floors = Math.max(1, Math.floor(H / R.floorH + 0.15)), fh = H / floors;
  const garage = /^garages?$|^carport$/.test(building.kind || '');
  const edges = [], all = [];
  for (let i = 0; i < n; i++) {
    const a = fp[i], b = fp[(i + 1) % n], len = Math.hypot(b.x - a.x, b.z - a.z);
    let nx = -(b.z - a.z) / (len || 1), nz = (b.x - a.x) / (len || 1); const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
    const out = pointInPoly(mx + nx * 0.3, mz + nz * 0.3, fp) ? -1 : 1; nx *= out; nz *= out;
    all.push({ S: { P, a, b, len, out }, len });
    if (len < R.minEdge) continue;
    st.edges++;
    let hits = 0; for (const u of [0.25, 0.5, 0.75]) if (FX.inOther(a.x + (b.x - a.x) * u + nx, a.z + (b.z - a.z) * u + nz, building.id)) hits++;
    if (hits >= 2) { st.partyEdges++; continue; }
    edges.push({ S: { P, a, b, len, out }, len, road: FX.roadDist(mx + nx * R.roadProbeM, mz + nz * R.roadProbeM, R.roadMaxM) });
  }
  const out = [], push = (e, d) => out.push({ S: e.S, d });
  /* Rückfall (Prüfer 25.09.): kein Gebäude bleibt kahl — eine Tür, auf die Kante geklemmt, auf der längsten freien Kante, sonst der längsten Kante überhaupt */
  const fallback = (kind) => {
    const e = (edges.length ? edges : all).reduce((m, q) => q.len > m.len ? q : m);
    const garageDoor = kind === 'garage', w = Math.min(garageDoor ? lerp(2.3, 2.9, rnd()) : lerp(1.1, 1.5, rnd()), e.len - 0.4);
    if (w < 0.7) return out;
    const h = Math.min(H * 0.78, garageDoor ? lerp(2.0, 2.4, rnd()) : lerp(2.1, 2.5, rnd()));
    push(e, { kind: 'door', u: 0.5, t: (h / 2) / H, w, h, d: .12, off: .12, shape: garageDoor ? 'rect' : shapeOf() });
    st[garageDoor ? 'garageDoors' : 'doors']++; st.fallback++;
    return out;
  };
  if (!edges.length) return fallback(garage ? 'garage' : 'door');
  const street = edges.reduce((m, e) => (e.road < m.road || (e.road === m.road && e.len > m.len)) ? e : m, edges[0]);
  if (street.road < Infinity) st.streetDoors++;
  /* Türen */
  const doors = [];
  if (garage) {
    const w = Math.min(lerp(2.3, 2.9, rnd()), street.len - 0.5), h = Math.min(H * 0.78, lerp(2.0, 2.4, rnd()));
    if (w >= 1.8) { const u = Math.max((w / 2 + 0.25) / street.len, Math.min(1 - (w / 2 + 0.25) / street.len, 0.5 + (rnd() - .5) * 0.3)); doors.push({ e: street, u, w }); push(street, { kind: 'door', u, t: (h / 2) / H, w, h, d: .12, off: .12, shape: rnd() < 0.75 ? 'rect' : 'trap-down' }); st.garageDoors++; }
    else return fallback('garage');
    return out;
  }
  const nDoor = 1 + (street.len > R.extraDoorEvery * 1.4 ? Math.floor((street.len - R.extraDoorEvery * 0.4) / R.extraDoorEvery * (0.55 + rnd() * 0.45)) : 0);
  for (let k = 0; k < nDoor; k++) {
    const w = lerp(1.2, 1.9, rnd()), h = Math.min(fh * 0.86, lerp(2.2, 2.8, rnd())), lo = (w / 2 + R.margin) / street.len;
    if (lo >= 0.5) break;
    const u = Math.max(lo, Math.min(1 - lo, (k + 0.2 + rnd() * 0.6) / nDoor));
    if (doors.some((q) => Math.abs(q.u - u) * street.len < (q.w + w) / 2 + 1.2)) continue;
    doors.push({ e: street, u, w }); push(street, { kind: 'door', u, t: (h / 2) / H, w, h, d: .15, off: .13, shape: shapeOf() }); st.doors++;
  }
  /* Fenster */
  const spacing = lerp(R.spacing[0], R.spacing[1], rnd()), ww = lerp(0.85, 1.25, rnd()), wh = lerp(1.25, 1.85, rnd());
  let est = 0; for (const e of edges) est += Math.max(0, Math.floor((e.len - 2 * R.margin) / spacing)) * floors;
  const skip = Math.max(R.skip, est > R.cap ? 1 - R.cap / est : 0); if (est > R.cap) st.capped++;
  for (const e of edges) {
    const usable = e.len - 2 * R.margin; let cols = Math.floor(usable / spacing);
    if (cols < 1) { if (usable > 1.1 && rnd() < 0.7) cols = 1; else continue; }
    for (let f = 0; f < floors; f++) {
      const shift = (rnd() - .5) * 2 * R.rowShift / cols;
      for (let c = 0; c < cols; c++) {
        if (rnd() < skip) continue;
        const w = Math.min(ww * lerp(0.9, 1.1, rnd()), usable / cols - 0.4), h = Math.min(fh * 0.58, wh * lerp(0.92, 1.08, rnd()));
        if (w < 0.5) continue;
        const u = (R.margin + (c + 0.5 + (rnd() - .5) * 2 * R.jitterU) * usable / cols) / e.len + shift;
        if (u * e.len < w / 2 + 0.3 || (1 - u) * e.len < w / 2 + 0.3) continue;
        if (f === 0 && doors.some((q) => q.e === e && Math.abs(q.u - u) * e.len < (q.w + w) / 2 + 0.45)) continue;
        const y = f * fh + fh * (f === 0 ? 0.56 : 0.52) + (rnd() - .5) * 2 * R.jitterT * fh;
        push(e, { kind: 'window', u, t: y / H, w, h, d: .10, off: .105, shape: shapeOf() }); st.windows++;
      }
    }
  }
  if (!doors.length) {
    /* Straßenkante zu kurz für eine Tür in voller Breite: geklemmte Tür auf der längsten freien Kante */
    const e = edges.reduce((m, q) => q.len > m.len ? q : m), w = Math.min(lerp(1.1, 1.5, rnd()), e.len - 0.4);
    if (w >= 0.7) {
      const h = Math.min(fh * 0.86, lerp(2.1, 2.5, rnd()));
      for (let k = out.length - 1; k >= 0; k--) { const q = out[k]; if (q.S === e.S && q.d.t * H < fh && Math.abs(q.d.u - 0.5) * e.len < (q.d.w + w) / 2 + 0.3) out.splice(k, 1), st.windows--; }
      push(e, { kind: 'door', u: 0.5, t: (h / 2) / H, w, h, d: .15, off: .13, shape: shapeOf() }); st.doors++; st.fallback++;
    }
  }
  if (!out.length) return fallback('door');
  return out;
}

/* mode 'elastic' = KFB Elastic Grotesque Clay V2 · 'clean' = Quellansicht (exakte Extrusion, neutral)
   facade 'rule-v1' = FACADE_RULE (global) · 'owner' = protectedDetails() wörtlich (Vergleich) */
export function groundMapFor(zone, { style, renderer = null, rect, px = 4096 }) {
  const E = ELASTIC_PALETTE, col = { ground: E.ground, green: style.palette.green, water: '#1f4f5c', road: E.road, curb: E.curb, path: E.path, foot: E.path };
  const stats = { roadParts: 0, tunnelsSkipped: 0, roadsByTier: {} };
  const tex = groundTexture(zone, col, stats, renderer, rect, px);
  return { tex, stats };
}
export function buildCityLayer(zone, { mode = 'elastic', style, CC, EG, ghosts = true, renderer = null, extraBase = new Set(), facade = 'rule-v1' }) {
  const group = new THREE.Group(); group.name = 'city:' + mode;
  const Ly = layersFrom(style), clean = mode === 'clean', E = ELASTIC_PALETTE;
  const stats = { buildings: 0, base: 0, base2: 0, ghosts: 0, flatRoofRouted: 0, details: 0, roadParts: 0, tunnelsSkipped: 0, roadsByTier: {}, facade: { rule: facade === 'owner' ? 'owner protectedDetails()' : FACADE_RULE.id, doors: 0, garageDoors: 0, windows: 0, edges: 0, partyEdges: 0, streetDoors: 0, capped: 0, bare: 0, fallback: 0 } };
  const FX = mode === 'clean' || facade === 'owner' ? null : facadeContext(zone);
  const col = clean ? CLEAN : { ground: E.ground, green: style.palette.green, water: '#1f4f5c', road: E.road, curb: E.curb, path: E.path, foot: E.path };

  const R = zone.rectW, W = R.maxX - R.minX, D = R.maxZ - R.minZ;
  const plateGeo = new THREE.PlaneGeometry(W, D); plateGeo.rotateX(-Math.PI / 2); plateGeo.translate((R.minX + R.maxX) / 2, Ly.plate, (R.minZ + R.maxZ) / 2);
  const plate = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({ map: groundTexture(zone, col, stats, renderer), roughness: 0.97, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }));
  plate.name = 'city-ground-map'; plate.receiveShadow = true; group.add(plate);

  /* Schienen als GEOMETRIE (Georg 24.09.: „tracks wirken pixelig“ — in der 0,2-m/px-Bodenkarte zu grob).
     OSM railway=rail ohne service, ohne Tunnel. Bett = flaches Band 4,4 m, Schwellen = InstancedMesh
     (2,6 × 0,12 × 0,35 m, Takt 1,6 m), zwei Schienen = Bänder 0,22 m (Spur 1,6 m, leicht überzeichnet).
     Mittellinien bleiben in der Seam (zone.railways) für die spätere Befahrbarkeit. */
  {
    const rails = (zone.railways || []).filter((r) => r.cls === 'rail' && !r.service && r.tunnel !== 'yes' && r.layer >= 0);
    stats.railParts = rails.length;
    const RC = col.rail || { bed: '#78604d', sleeper: '#c77a4b', rail: '#79a8c7' };
    const y0 = Ly.plate + 0.06, GA = 1.6;
    const strip = (pts, u0, u1, y, P, I) => {
      const n = pts.length, base = P.length / 3;
      for (let i = 0; i < n; i++) {
        const A = pts[Math.max(0, i - 1)], B = pts[Math.min(n - 1, i + 1)];
        let tx = B.x - A.x, tz = B.z - A.z; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        let m = 1; if (i > 0 && i < n - 1) { const sx = pts[i].x - pts[i - 1].x, sz = pts[i].z - pts[i - 1].z, sl = Math.hypot(sx, sz) || 1; m = 1 / Math.max(0.5, (tx * sx + tz * sz) / sl); }
        const nx = -tz * m, nz = tx * m;
        P.push(pts[i].x + nx * u0, y, pts[i].z + nz * u0, pts[i].x + nx * u1, y, pts[i].z + nz * u1);
        if (i) { const k = base + (i - 1) * 2; I.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
    };
    const sheetOf = (P, I, color, po, name) => {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
      const nn = new Float32Array(P.length); for (let i = 1; i < nn.length; i += 3) nn[i] = 1; g.setAttribute('normal', new THREE.BufferAttribute(nn, 3)); g.setIndex(I);
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -po, polygonOffsetUnits: -po * 2 }));
      m.name = name; m.receiveShadow = true; return m;
    };
    const bed = { P: [], I: [] }, rl = { P: [], I: [] }, sl = [];
    for (const r of rails) {
      const pts = r.line; if (pts.length < 2) continue;
      strip(pts, -2.2, 2.2, y0, bed.P, bed.I);
      for (const u of [GA / 2, -GA / 2]) strip(pts, u - 0.11, u + 0.11, y0 + 0.2, rl.P, rl.I);
      let acc = 0.8;
      for (let i = 1; i < pts.length; i++) {
        const A = pts[i - 1], B = pts[i], L = Math.hypot(B.x - A.x, B.z - A.z); if (L < 1e-3) continue;
        const yaw = Math.atan2(B.x - A.x, B.z - A.z);
        while (acc <= L) { const k = acc / L; sl.push({ x: A.x + (B.x - A.x) * k, z: A.z + (B.z - A.z) * k, yaw }); acc += 1.6; }
        acc -= L;
      }
    }
    const rg = new THREE.Group(); rg.name = 'rails (OSM railway=rail · main lines)';
    if (bed.P.length) rg.add(sheetOf(bed.P, bed.I, RC.bed, 2, 'rail-bed'));
    if (rl.P.length) { const m = sheetOf(rl.P, rl.I, RC.rail, 3, 'rail-steel'); m.material.roughness = 0.5; m.material.metalness = 0.1; rg.add(m); }
    if (sl.length) {
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(2.6, 0.12, 0.35), new THREE.MeshStandardMaterial({ color: RC.sleeper, roughness: 0.95, metalness: 0 }), sl.length);
      const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0), S1 = new THREE.Vector3(1, 1, 1);
      sl.forEach((p, i) => { Q.setFromAxisAngle(Y, p.yaw); M4.compose(new THREE.Vector3(p.x, y0 + 0.07, p.z), Q, S1); im.setMatrixAt(i, M4); });
      im.name = 'rail-sleepers'; im.receiveShadow = true; rg.add(im);
    }
    stats.sleepers = sl.length;
    group.add(rg); var railGroup = rg;
  }

  /* Wasser: Geometrie + aFlow hier, Material über wd1-water.js (Preset je Wasserklasse) */
  const out = { group, plate, stats, waters: [] };
  if (!clean) {
    for (const w of zone.water) {
      const r = ring(w.poly); if (r.length < 3) continue;
      const g = new THREE.ShapeGeometry(new THREE.Shape(r.map((p) => new THREE.Vector2(p.x, -p.z))));
      g.rotateX(-Math.PI / 2); g.translate(0, Ly.water, 0);
      const river = w.id === 'relation/11280522:0';
      /* aFlow: normalized.json führt KEINE Rhein-Mittellinie (waterLines = Kanal + Abläufe). Richtung
         deshalb = Hauptachse des OSM-Flusspolygons im Crop (PCA), Vorzeichen nach Norden (−z Welt,
         Rhein fließt in Köln nordwärts). Stillwasser 0. */
      let fx = 0, fz = 0;
      if (river) {
        let cx = 0, cz = 0; for (const p of r) { cx += p.x; cz += p.z; } cx /= r.length; cz /= r.length;
        let sxx = 0, szz = 0, sxz = 0; for (const p of r) { const dx = p.x - cx, dz = p.z - cz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
        const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz); fx = Math.cos(ang); fz = Math.sin(ang);
        if (fz > 0) { fx = -fx; fz = -fz; }
        stats.rhineFlow = [+fx.toFixed(3), +fz.toFixed(3)];
      }
      const n = g.attributes.position.count, fl = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { fl[i * 2] = fx; fl[i * 2 + 1] = fz; }
      g.setAttribute('aFlow', new THREE.BufferAttribute(fl, 2));
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x1f4f5c })); m.name = 'fluid:' + (river ? 'rhein' : w.id); m.renderOrder = 2;
      group.add(m); out.waters.push({ id: w.id, mesh: m, river, sea: false, src: w.src });
    }
  }

  /* Gebäude */
  const lmFp = zone.landmark ? zone.landmark.footprint : null;
  const buckets = { blocks: [], roofs: [], base: [], base2: [], ghost: [] };
  const details = { window: new Map(), door: new Map() };
  const colorSlot = (arr, id, salt) => arr[CC.stableHash(E.id + ':' + salt + ':' + id) % arr.length];
  const tint = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); if (g.attributes.uv) g.deleteAttribute('uv'); return g; };
  const anchor = zone.landmark ? zone.landmark.centroid : { x: (R.minX + R.maxX) / 2, z: (R.minZ + R.maxZ) / 2 };   // blockPull zur Landmarke, ohne Landmarke Blockmittel wie im Viewer — Host-Setzung
  for (let b of zone.buildings) {
    const r = ring(b.fp); if (r.length < 3) continue;
    /* Bodenhöhe (Georg 24.09.): OSM min_height ist nur wahr, wenn DARUNTER ein anderer Teil steht
       (Arkade, Überbau). Fehlt der Träger in der Fixture, schwebte der Teil. Regel: minH bleibt nur, wenn
       der Schwerpunkt in einem anderen Grundriss liegt, dessen Höhe ≥ minH − 0,5 m ist; sonst Boden. */
    if (b.minH > 0) {
      let cx = 0, cz = 0; for (const p of r) { cx += p.x; cz += p.z; } cx /= r.length; cz /= r.length;
      const carried = zone.buildings.some((o) => o !== b && (o.h || 0) >= b.minH - 0.5 && pointInPoly(cx, cz, o.fp));
      if (!carried) { b = { ...b, minH: 0 }; stats.groundedParts = (stats.groundedParts || 0) + 1; }
    }
    const h = Math.max(3, (b.h || 9) - (b.minH || 0));
    const role = lmFp && partOf(r, lmFp) ? 'base' : extraBase.has(b.id) ? 'base2' : (!clean && zone.conflicts.has(b.id)) ? 'ghost' : 'blocks';
    if (clean || role === 'ghost') {
      let g; try { g = new THREE.ExtrudeGeometry(new THREE.Shape(r.map((p) => new THREE.Vector2(p.x, -p.z))), { depth: h, steps: 1, bevelEnabled: false }); } catch (e) { stats.failed = (stats.failed || 0) + 1; continue; }
      g.rotateX(-Math.PI / 2); g.translate(0, b.minH || 0, 0);
      const N = g.attributes.normal, a = new Float32Array(N.count * 3), cw = new THREE.Color(0xd6d0c6), cr = new THREE.Color(0xb8b1a6);
      for (let i = 0; i < N.count; i++) { const k = Math.abs(N.getY(i)) > 0.7 ? cr : cw; a[i * 3] = k.r; a[i * 3 + 1] = k.g; a[i * 3 + 2] = k.b; }
      g.setAttribute('color', new THREE.BufferAttribute(a, 3)); g.deleteAttribute('uv');
      buckets[role === 'ghost' ? 'ghost' : role].push(g);
    } else {
      /* Dach-Routing (Host, benannt): buildElasticRoof schrumpft Ringe zum Schwerpunkt; bei stark
         konkaven Grundrissen (Fläche / konvexe Hülle < 0,85) kreuzen sich die Firstlinien — dort 'flat'. */
      const concave = solidity(r) < 0.85;
      if (concave && b.roof && b.roof.type !== 'flat') stats.flatRoofRouted++;
      const src = { id: b.id, footprint: r, heightM: h, roof: concave ? { ...(b.roof || {}), type: 'flat' } : b.roof, materialClass: b.mc };
      let shell; try { shell = EG.buildElasticShell(src, anchor); } catch (e) { stats.failed = (stats.failed || 0) + 1; continue; }
      const sg = tint(shell.geometry, colorSlot(E.walls, b.id, 'wall')); sg.userData.ground = !b.minH;
      const rg = tint(EG.buildElasticRoof(src, shell), colorSlot(E.roofs, b.id, 'roof'));
      stats.wallsFlipped = (stats.wallsFlipped || 0) + orientEG(sg, shell.topRing.length); orientEG(rg, shell.topRing.length);
      if (b.minH) { sg.translate(0, b.minH, 0); rg.translate(0, b.minH, 0); }
      if (role === 'base' || role === 'base2') { buckets[role].push(sg, rg); }
      else {
        buckets.blocks.push(sg); buckets.roofs.push(rg);
        const wc = colorSlot(E.windows, b.id, 'window'), dc = colorSlot(E.doors, b.id, 'door');
        let list;
        if (FX) list = facadeSpecs(EG, CC, { ...src, kind: b.kind }, shell, FX, stats.facade);
        else { const SP = detailSpecs(EG, CC, src, shell); list = SP.list.map((d) => ({ S: SP, d })); for (const q of list) stats.facade[q.d.kind === 'door' ? 'doors' : 'windows']++; }
        if (!list.length) stats.facade.bare++;
        for (const { S: SP, d } of list) { const map = details[d.kind === 'window' ? 'window' : 'door'], key = d.kind === 'window' ? wc : dc; if (!map.has(key)) map.set(key, { P: [], I: [] }); const acc = map.get(key); conformDetail(EG, SP, d, b.minH || 0, acc.P, acc.I); stats.details++; }
      }
    }
    stats[role === 'blocks' ? 'buildings' : role === 'ghost' ? 'ghosts' : role]++;
  }
  /* shadowSide Back: gegen Schatten-Akne (Streifen) auf gewölbten Dächern bei streifendem Licht */
  const mat = (rough) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: rough, metalness: 0, flatShading: clean, side: THREE.FrontSide, shadowSide: THREE.BackSide });
  const add = (list, m, name, shadow = true) => { if (!list.length) return null; const mesh = new THREE.Mesh(mergeGeometries(list), m); mesh.name = name; mesh.castShadow = shadow; mesh.receiveShadow = true; group.add(mesh); return mesh; };
  /* Sockel (Georg 25.09.: „heller Schein unter den Häusern“): die unterste Wandreihe 0,6 m unter die Bodenplatte
     ziehen — kein Spalt, durch den Licht unter die Schale fällt, egal wo die Verformung den Fuß hinlegt.
     Erst nach dem Fassadendurchlauf, der die Schale unverändert liest. */
  for (const g of buckets.blocks) {
    if (!g.userData.ground) continue;
    const p = g.attributes.position; let lo = Infinity; for (let i = 0; i < p.count; i++) lo = Math.min(lo, p.getY(i));
    for (let i = 0; i < p.count; i++) if (p.getY(i) < lo + 0.02) p.setY(i, lo - 0.6);
    stats.sunkBases = (stats.sunkBases || 0) + 1;
  }
  out.blocks = add(buckets.blocks, mat(clean ? 0.95 : 0.975), clean ? 'buildings-clean' : 'ElasticGrotesqueClayV2:walls');
  out.roofs = add(buckets.roofs, mat(0.98), 'ElasticGrotesqueClayV2:roofs');
  out.base = add(buckets.base, mat(0.95), 'landmark-base:procedural (OSM parts inside ' + (zone.landmark ? zone.landmark.id : '—') + ')');
  out.base2 = add(buckets.base2, mat(0.95), 'landmark-base:procedural (OSM parts under the Hbf hall)');
  if (buckets.ghost.length) {
    out.ghost = new THREE.Mesh(mergeGeometries(buckets.ghost), new THREE.MeshStandardMaterial({ color: 0xf6efe0, transparent: true, opacity: 0.22, depthWrite: false, roughness: 1 }));
    out.ghost.name = 'track-socket-conflicts (deferred to WORLD-ZONE-BAKE-01)'; out.ghost.renderOrder = 5; out.ghost.visible = !!ghosts; group.add(out.ghost);
  }
  if (!clean) {
    const dg = new THREE.Group(); dg.name = 'protectedDetails (conformed to shell)';
    for (const [kind, map] of Object.entries(details)) for (const [hex, acc] of map) {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(acc.P, 3)); g.setIndex(acc.I); g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: hex, roughness: kind === 'window' ? 0.86 : 0.96, metalness: 0, side: THREE.DoubleSide }));
      m.name = kind; m.receiveShadow = true; dg.add(m);
    }
    group.add(dg); out.details = dg;
  }
  /* Zonenrand */
  const edge = new THREE.BufferGeometry().setFromPoints([[R.minX, R.minZ], [R.maxX, R.minZ], [R.maxX, R.maxZ], [R.minX, R.maxZ], [R.minX, R.minZ]].map(([x, z]) => new THREE.Vector3(x, 0.45, z)));
  out.edge = new THREE.Line(edge, new THREE.LineDashedMaterial({ color: clean ? 0x8a8478 : 0xe0c779, dashSize: 10, gapSize: 7 }));
  out.edge.computeLineDistances(); out.edge.name = 'zone-edge'; group.add(out.edge);
  if (clean && lmFp) {
    const lf = ring(lmFp); lf.push(lf[0]);
    const lg = new THREE.Line(new THREE.BufferGeometry().setFromPoints(lf.map((p) => new THREE.Vector3(p.x, 0.5, p.z))), new THREE.LineBasicMaterial({ color: 0xb04a3a }));
    lg.name = 'landmark-footprint ' + zone.landmark.id; group.add(lg);
  }
  out.rails = railGroup;
  out.flatParts = [plate, out.edge, out.ghost, railGroup, ...out.waters.map((f) => f.mesh)].filter(Boolean);
  return out;
}
