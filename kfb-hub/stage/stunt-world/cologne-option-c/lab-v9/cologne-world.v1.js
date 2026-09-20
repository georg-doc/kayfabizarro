// KFB Cologne Race · Option C · Weltschichten
//
// OSM besitzt WO. KFB besitzt WIE. (CLAUDE_CONTEXT.designRules)
//
// Quellen, gepinnt:
//   kayfabizarro @2ff8b350beefe02912bbff6eeeead3882e583d08
//   tools/osm-city-lab/data/dom-zentrum-v0/normalized.json   (6 351 Gebaeude)
//   tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json (Anker, Rhein, Dom-Grundriss)
//   © OpenStreetMap contributors · ODbL 1.0
//
// Verformungsfamilien (§8, §25) — getrennte Regeln, geteilte Weltparameter:
//   BuildingElastic  Neigung, Verjuengung, Drehung, bodenverankert
//   LandmarkElastic  Turmbiegung um die gemessene Hoehenachse, Silhouette bleibt
//
// Die Gebaeude-Grammatik folgt dem Spender
//   tools/osm-city-lab/src/style/cartoon-city.js  blob d08c19fc45d9
// (stabiler OSM-Identitaets-Seed, bodenverankert, nach oben staerker).

import { C, BUILDING_TONES, ROOF_TONES } from './option-c-style.v1.js';

export const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
export const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' +
  p.split('/').map(encodeURIComponent).join('/');

function stableHash(v) { let h = 2166136261; for (const c of String(v)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(seed) { let a = (seed >>> 0) || 1; return function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------------------------------------------------------------- Gebaeude
export async function buildCity(THREE, route, opts = {}) {
  const maxDist = opts.corridorM ?? 360;
  // Sichtachsen: um jede Heldenkamera bleibt ein Kreis frei. Gemessener Befund —
  // ohne das stand bei CCTV1 ein Block genau zwischen Kamera und Strecke.
  const clear = opts.keepClear || [];
  const cap = opts.maxBuildings ?? 900;
  const group = new THREE.Group();
  group.name = 'BuildingElastic';

  const res = await fetch(RAW('tools/osm-city-lab/data/dom-zentrum-v0/normalized.json'));
  if (!res.ok) throw new Error('normalized.json HTTP ' + res.status);
  const data = await res.json();
  const all = (data.features && data.features.buildings) || [];

  // Korridorfilter: Abstand zur Streckenmittellinie, grob ueber ein Raster
  const rp = route.points;
  const cell = 60;
  const grid = new Map();
  for (const p of rp) {
    const k = Math.floor(p.x / cell) + ',' + Math.floor(p.z / cell);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(p);
  }
  const nearRoute = (x, z, radius) => {
    const cx = Math.floor(x / cell), cz = Math.floor(z / cell);
    const r = Math.ceil((radius || maxDist) / cell);
    let best = Infinity, bp = null;
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) {
      const arr = grid.get((cx + a) + ',' + (cz + b));
      if (!arr) continue;
      for (const p of arr) {
        const d = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
        if (d < best) { best = d; bp = p; }
      }
    }
    return { dist: Math.sqrt(best), point: bp };
  };

  // Streckenpunkte in ein grobes Raster: fuer den Punkt-in-Polygon-Test braucht
  // jedes Gebaeude nur die Stuetzpunkte seiner eigenen Umgebung.
  const rgrid = new Map();
  const RC = 40;
  rp.forEach((q, qi) => {
    const k = Math.floor(q.x / RC) + ',' + Math.floor(q.z / RC);
    if (!rgrid.has(k)) rgrid.set(k, []);
    rgrid.get(k).push(q);
  });
  const routePointsNear = (minx, maxx, minz, maxz) => {
    const out = [];
    for (let a = Math.floor(minx / RC); a <= Math.floor(maxx / RC); a++)
      for (let b = Math.floor(minz / RC); b <= Math.floor(maxz / RC); b++) {
        const arr = rgrid.get(a + ',' + b);
        if (arr) out.push(...arr);
      }
    return out;
  };
  const pointInRing = (x, z, ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i].x, zi = ring[i].z, xj = ring[j].x, zj = ring[j].z;
      if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) inside = !inside;
    }
    return inside;
  };

  const domAnchor = { x: -301.298, z: -75.744 };
  const candidates = [];
  for (const b of all) {
    const fp = b.footprint;
    if (!fp || fp.length < 4) continue;
    let cx = 0, cz = 0;
    for (const q of fp) { cx += q.x; cz += q.z; }
    cx /= fp.length; cz /= fp.length;
    // Der Dom selbst wird durch den Landmark-Spender ersetzt, nicht als Masse gebaut
    if (Math.hypot(cx - domAnchor.x, cz - domAnchor.z) < 95) continue;
    const near = nearRoute(cx, cz);
    const d = near.dist;
    if (d > maxDist) continue;
    let blocked = false;
    for (const k of clear) { if (Math.hypot(cx - k.x, cz - k.z) < (k.r || 34)) { blocked = true; break; } }
    if (blocked) continue;
    candidates.push({ b, cx, cz, d, near, h: Math.max(3, Number(b.heightM) || 9) });
  }
  candidates.sort((a, b) => a.d - b.d);
  const chosen = candidates.slice(0, cap);

  // Nach Ton buendeln und zu wenigen Netzen verschmelzen
  const buckets = new Map();
  const roofBuckets = new Map();
  let tris = 0, portals = 0, skipped = 0;

  for (const c of chosen) {
    const id = c.b.id;
    const seed = stableHash('kfb-city:' + id);
    const r = mulberry32(seed);
    const toneIdx = seed % BUILDING_TONES.length;
    const roofIdx = (seed >>> 5) % ROOF_TONES.length;

    // --- Durchfahrt -------------------------------------------------------
    // Gemessener Befund aus der Fahrt: Gebaeude standen AUF der Strecke, man fuhr
    // durch sie hindurch. Sie werden nicht geloescht — sie bekommen eine Durchfahrt.
    // Der Block beginnt erst ueber der Durchfahrtshoehe und steht auf Pfeilern, die
    // ausserhalb des Fahrbahnkorridors bis zum Boden reichen.
    let base = 0;
    let piers = null;
    const rp2 = c.near.point;
    if (rp2) {
      const clearHalf = rp2.w * 0.5 + CLEAR_MARGIN;
      const ring0 = ringOf(c.b.footprint);
      // Entlang der KANTEN abtasten, nicht nur an den Ecken. Gemessener Befund aus
      // Georgs Bild: ein grosser Block, dessen Kante die Strecke kreuzt, dessen Ecken
      // aber beide ausserhalb liegen, bestand die Eckenpruefung und blieb massiv —
      // die Verfolgerkamera stand darin.
      let inside = 0;
      const outsideVerts = [];

      // ENTSCHEIDENDER Test, der vorher fehlte: laeuft die Strecke durch den
      // Grundriss HINDURCH? Ein grosser Block, dessen Kanten alle weiter als der
      // Suchradius entfernt liegen, bestand die Kantenpruefung und blieb massiv —
      // man fuhr mitten hindurch. Punkt-in-Polygon beantwortet das direkt.
      let bmnx = 1e9, bmxx = -1e9, bmnz = 1e9, bmxz = -1e9;
      for (const q of ring0) {
        bmnx = Math.min(bmnx, q.x); bmxx = Math.max(bmxx, q.x);
        bmnz = Math.min(bmnz, q.z); bmxz = Math.max(bmxz, q.z);
      }
      for (const q of routePointsNear(bmnx, bmxx, bmnz, bmxz)) {
        if (pointInRing(q.x, q.z, ring0)) { inside += 99; break; }
      }

      for (let vi = 0; vi < ring0.length; vi++) {
        const q = ring0[vi], q2 = ring0[(vi + 1) % ring0.length];
        const dq = nearRoute(q.x, q.z, clearHalf + 12).dist;
        if (dq < clearHalf) inside++; else outsideVerts.push(q);
        const len = Math.hypot(q2.x - q.x, q2.z - q.z);
        const steps = Math.min(12, Math.floor(len / 6));
        for (let k = 1; k <= steps; k++) {
          const t2 = k / (steps + 1);
          const mx = q.x + (q2.x - q.x) * t2, mz = q.z + (q2.z - q.z) * t2;
          if (nearRoute(mx, mz, clearHalf + 12).dist < clearHalf) { inside++; break; }
        }
      }
      if (inside > 0) {
        // Bei einer echten Durchfahrt bestimmt der Streckenpunkt UNTER dem Grundriss
        // die Lichte, nicht der naechste zum Schwerpunkt.
        let ry = rp2.y;
        for (const q of routePointsNear(bmnx, bmxx, bmnz, bmxz)) {
          if (pointInRing(q.x, q.z, ring0)) { ry = q.y; break; }
        }
        const clearTop = ry + CLEAR_HEIGHT;
        if (c.h < clearTop + 2.5) { skipped++; continue; }
        if (outsideVerts.length < 2) { skipped++; continue; }
        base = clearTop;
        piers = outsideVerts;
        portals++;
      }
    }

    const prism = extrudeFootprint(THREE, c.b.footprint, c.h, {
      // BuildingElastic — Werte in der Groessenordnung des Spenders, nach oben staerker
      lean: (r() * 2 - 1) * 0.030,
      leanZ: (r() * 2 - 1) * 0.030,
      bend: (r() * 2 - 1) * 0.022,
      bendZ: (r() * 2 - 1) * 0.022,
      taper: 0.06 + r() * 0.07,
      twist: (r() * 2 - 1) * 2.6 * Math.PI / 180,
      cx: c.cx, cz: c.cz, base
    });
    if (!prism) continue;
    tris += prism.index.count / 3;
    if (!buckets.has(toneIdx)) buckets.set(toneIdx, []);
    buckets.get(toneIdx).push(prism);

    if (piers) {
      for (const q of piers) {
        const pg = pierAt(THREE, q.x, q.z, c.cx, c.cz, base);
        if (pg) buckets.get(toneIdx).push(pg);
      }
    }

    // Dachplatte als eigene Farbe — gibt der Skyline Rhythmus ohne Streifung
    const cap2 = capPlate(THREE, c.b.footprint, c.h, c.cx, c.cz);
    if (cap2) {
      if (!roofBuckets.has(roofIdx)) roofBuckets.set(roofIdx, []);
      roofBuckets.get(roofIdx).push(cap2);
    }
  }

  const merge = (list) => {
    const pos = [], idx = [];
    let off = 0;
    for (const g of list) {
      const p = g.getAttribute('position');
      for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i));
      const ix = g.index;
      for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off);
      off += p.count;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    out.setIndex(idx);
    out.computeVertexNormals();
    return out;
  };

  for (const [toneIdx, list] of buckets) {
    const m = new THREE.Mesh(merge(list), new THREE.MeshStandardMaterial({
      color: BUILDING_TONES[toneIdx], roughness: 0.95, metalness: 0, flatShading: true
    }));
    m.name = 'oms-block-' + toneIdx;
    m.castShadow = false; m.receiveShadow = true;
    group.add(m);
  }
  for (const [roofIdx, list] of roofBuckets) {
    const m = new THREE.Mesh(merge(list), new THREE.MeshStandardMaterial({
      color: ROOF_TONES[roofIdx], roughness: 0.9, metalness: 0, flatShading: true
    }));
    m.name = 'oms-roof-' + roofIdx;
    group.add(m);
  }

  return {
    group,
    stats: {
      sourceBuildings: all.length,
      inCorridor: candidates.length,
      built: chosen.length,
      portals,
      skipped,
      clearanceM: CLEAR_HEIGHT,
      triangles: Math.round(tris),
      corridorM: maxDist
    }
  };
}

// Durchfahrtsmasse. Das Fahrzeug ist 1,90 m hoch; 11 m Lichte gibt einem Spielzeug-
// Koeln Luft fuer Spruenge und Kameraschwenks und passt zur Tunnelschale (11,5 m).
export const CLEAR_HEIGHT = 11.0;
// Der Rand ist nicht nur fuer das Fahrzeug: die Verfolgerkamera haengt rund 9 m hinter
// dem Wagen und schwenkt in Kurven ueber die Bandkante hinaus. 9 m Zuschlag halten sie frei.
export const CLEAR_MARGIN = 9.0;

function pierAt(THREE, x, z, cx, cz, top) {
  if (!(top > 1)) return null;
  const r = 1.5;
  const ix = cx + (x - cx) * 0.94, iz = cz + (z - cz) * 0.94;
  const pos = [], idx = [];
  const SEG = 6;
  for (let s = 0; s < SEG; s++) {
    const a = (s / SEG) * Math.PI * 2;
    const px = ix + Math.cos(a) * r, pz = iz + Math.sin(a) * r;
    pos.push(px, 0, pz, px, top, pz);
  }
  for (let s = 0; s < SEG; s++) {
    const a = s * 2, b = a + 1, c = ((s + 1) % SEG) * 2, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

function elasticPoint(x, y, z, h, p) {
  const t = Math.max(0, Math.min(1, y / Math.max(1e-5, h)));
  let rx = x - p.cx, rz = z - p.cz;
  const s = Math.max(0.68, 1 - p.taper * t);
  rx *= s; rz *= s;
  const a = p.twist * t, ca = Math.cos(a), sa = Math.sin(a);
  const tx = rx * ca - rz * sa, tz = rx * sa + rz * ca;
  return {
    x: p.cx + tx + (p.bend * t * t + p.lean * t) * h,
    y,
    z: p.cz + tz + (p.bendZ * t * t + p.leanZ * t) * h
  };
}

function ringOf(fp) {
  const pts = fp.map(q => ({ x: q.x, z: q.z }));
  if (pts.length > 1) {
    const a = pts[0], b = pts[pts.length - 1];
    if (Math.hypot(a.x - b.x, a.z - b.z) < 0.001) pts.pop();
  }
  return pts;
}

function extrudeFootprint(THREE, fp, h, p) {
  const ring = ringOf(fp);
  if (ring.length < 3 || ring.length > 160) return null;
  const pos = [], idx = [];
  const n = ring.length;
  const y0 = p.base || 0;
  for (const q of ring) {
    const lo = elasticPoint(q.x, y0, q.z, h, p);
    const hi = elasticPoint(q.x, h, q.z, h, p);
    pos.push(lo.x, lo.y, lo.z);
    pos.push(hi.x, hi.y, hi.z);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2, b = a + 1, c = ((i + 1) % n) * 2, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  // Untere Deckflaeche, damit die Durchfahrt von unten geschlossen wirkt
  if (y0 > 0) {
    const o = pos.length / 3;
    pos.push(p.cx, y0, p.cz);
    for (const q of ring) pos.push(q.x, y0, q.z);
    for (let i = 1; i <= n; i++) idx.push(o, o + (i % n) + 1, o + i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

function capPlate(THREE, fp, h, cx, cz) {
  const ring = ringOf(fp);
  if (ring.length < 3 || ring.length > 160) return null;
  const pos = [cx, h + 0.35, cz];
  for (const q of ring) pos.push(cx + (q.x - cx) * 0.94, h + 0.35, cz + (q.z - cz) * 0.94);
  const idx = [];
  for (let i = 1; i <= ring.length; i++) idx.push(0, i, i % ring.length + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

// ------------------------------------------------------------------- Rhein
// OSM besitzt die Lage (relation/11280522:0, 127 Punkte, Band x 50..881).
// KFB besitzt die Darstellung: Cartoon-Wasser mit wandernder Stroemung
// und heller Uferkante — kein flaches undurchsichtiges Blau (§10).
export function buildRhine(THREE, ctx) {
  const surf = (ctx.water && ctx.water.surfaces || []).find(w => w.id === 'relation/11280522:0');
  if (!surf) return null;
  const ring = ringOf(surf.polygon || surf.points || []);
  if (ring.length < 3) return null;

  const shape = new THREE.Shape(ring.map(q => new THREE.Vector2(q.x, q.z)));
  const geo = new THREE.ShapeGeometry(shape, 4);
  geo.rotateX(Math.PI / 2);
  geo.scale(1, 1, -1);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(C.waterDeep) },
      uShallow: { value: new THREE.Color(C.water) },
      uFoam: { value: new THREE.Color(C.waterFoam) },
      uSun: { value: new THREE.Color(C.sun) }
    },
    vertexShader: `
      varying vec3 vW;
      void main(){ vW = (modelMatrix*vec4(position,1.0)).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uDeep,uShallow,uFoam,uSun;
      varying vec3 vW;
      void main(){
        // Gemessener Befund aus der Schraegsicht: das Produkt zweier Wellen (eine in x,
        // eine in z) hat seine Maxima auf einem GITTER — daraus wurden gleichmaessig
        // verteilte weisse Scheiben. Und eine Glanzwelle mit unterschiedlicher Periode
        // in x und z legt diagonale Baender ueber den Fluss. Beides ist raus.
        // Der Rhein laeuft nach Norden: alle Wellen laufen mit ihm, entlang z.
        float w1 = sin(vW.z*0.040 - uTime*0.55) * 0.5 + 0.5;
        float w2 = sin(vW.z*0.115 - uTime*0.95 + vW.x*0.008) * 0.5 + 0.5;
        float band = w1*0.68 + w2*0.32;
        vec3 col = mix(uDeep, uShallow, smoothstep(0.22, 0.86, band));
        // Schaum als quer laufende Kaemme, nicht als Punktwolke
        float crest = smoothstep(0.90, 1.0, w2);
        col = mix(col, uFoam, crest*0.30);
        // Uferkante: naeher am Rand heller
        float edge = smoothstep(120.0, 40.0, abs(vW.x - 300.0));
        col = mix(col, uShallow, edge*0.22);
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -1.6;
  mesh.name = 'rhine';
  mesh.renderOrder = -1;
  return { mesh, mat, points: ring.length };
}

// --------------------------------------------------------------------- Dom
// Spender: tools/img2threejs/prototypes/koelner-dom/v0.2/index.html @844cb8a9/c0a3fd9d
// Profil:  tools/img2threejs/styles/landmark-style-profiles.v1.json, Eintrag koelner-dom
// Gemessene Einpassung:
//   Spendermodell reicht bis y ~84 u, echte Hoehe laut OSM-Tag 157,38 m -> Faktor 1,873
//   Spendergrundriss 44 (x) x 64 (z) u -> 82 x 120 m; echter Grundriss 146 x 86,8 m
//   Die Laengsachse des Spenders liegt auf z, die echte auf x -> Drehung -90 Grad um Y,
//   damit die Doppeltuerme nach Westen zeigen.
export function buildDom(THREE, opts = {}) {
  const SCALE = 1.873;
  const g = new THREE.Group();
  g.name = 'LandmarkElastic:koelner-dom';

  // Identitaetspalette aus landmark-style-profiles.v1.json (koelner-dom)
  const stone = new THREE.MeshStandardMaterial({ color: 0x7c7770, roughness: 0.95, metalness: 0.02, flatShading: true });
  const second = new THREE.MeshStandardMaterial({ color: 0x9b958b, roughness: 0.94, flatShading: true });
  const upper = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.92, flatShading: true });
  const accent = new THREE.MeshStandardMaterial({ color: 0xd0aa56, roughness: 0.6, flatShading: true });
  const glaze = new THREE.MeshStandardMaterial({ color: 0x3f6275, roughness: 0.3, flatShading: true, emissive: 0x1a2f3c, emissiveIntensity: 0.6 });

  const towerGroup = new THREE.Group(); towerGroup.name = 'dom-towers';
  const body = new THREE.Group(); body.name = 'dom-body';

  const box = (parent, name, w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.name = name; m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  };

  box(body, 'foundation', 44, 1, 64, second, 0, 0.5, 0);
  box(body, 'nave', 14, 18, 42, stone, 0, 10, 1);
  box(body, 'aisle-left', 6, 11, 38, stone, -10, 6.5, 1);
  box(body, 'aisle-right', 6, 11, 38, stone, 10, 6.5, 1);
  box(body, 'transept', 32, 18, 10, stone, 0, 10, -4);
  box(body, 'choir', 14, 18, 9, stone, 0, 10, -24.5);
  box(body, 'west-facade', 20, 20, 8, stone, 0, 11, 22);

  // Dachlandschaft — Satteldaecher als Prismen, wie im Spender
  const prism = (w, rise, len) => {
    const s = [[-w / 2, 0], [w / 2, 0], [0, rise]];
    const v = [], ix = [];
    for (const zz of [-len / 2, len / 2]) for (const [x, y] of s) v.push(x, y, zz);
    ix.push(0, 2, 1, 3, 4, 5);
    for (let i = 0; i < 3; i++) { const j = (i + 1) % 3; ix.push(i, j, j + 3, i, j + 3, i + 3); }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    gg.setIndex(ix); gg.computeVertexNormals(); return gg;
  };
  const addRoof = (name, geo, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(geo, upper); m.position.set(x, y, z); m.rotation.y = ry;
    m.name = name; m.castShadow = true; body.add(m);
  };
  addRoof('roof-nave-front', prism(14.8, 7, 16.6), 0, 19, 9.7);
  addRoof('roof-nave-choir', prism(14.8, 7, 20), 0, 19, -19.4);
  addRoof('roof-transept-left', prism(10.8, 7, 9.4), -12.1, 19, -4, Math.PI / 2);
  addRoof('roof-transept-right', prism(10.8, 7, 9.4), 12.1, 19, -4, Math.PI / 2);
  addRoof('roof-west-facade', prism(20, 7, 8), 0, 21, 22);
  addRoof('roof-crossing', prism(11, 9, 11), 0, 19, -4);

  // Doppeltuerme — Identitaetsmerkmal, bleibt lesbar (§9)
  const tower = (x, side) => {
    const t = new THREE.Group(); t.name = 'dom-tower-' + side;
    const b = (name, w, h, d, mat, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(0, y, 0); m.name = name; m.castShadow = true; t.add(m);
    };
    b('body', 6.4, 36, 6.4, stone, 19);
    b('cornice', 8, 4, 8, second, 37);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 3.6, 18, 8), stone); up.position.y = 48; up.castShadow = true; t.add(up);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(3.2, 22, 8), upper); sp.position.y = 68; sp.castShadow = true; t.add(sp);
    const fi = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 8, 5), accent); fi.position.y = 80; t.add(fi);
    for (const y of [25, 31]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 0.2), glaze); w.position.set(0, y, 3.3); t.add(w);
    }
    t.position.set(x, 0, 22);
    t.userData.baseY = 0;
    towerGroup.add(t);
    return t;
  };
  const towers = [tower(-6.5, 'left'), tower(6.5, 'right')];

  // Nebenfialen mit echtem Auflager
  const spire = (x, z, baseY, s) => {
    const shaft = 5 * s, tip = 9 * s;
    const a = new THREE.Mesh(new THREE.CylinderGeometry(1.1 * s, 1.5 * s, shaft, 8), stone);
    a.position.set(x, baseY + shaft / 2, z); a.castShadow = true; body.add(a);
    const b = new THREE.Mesh(new THREE.ConeGeometry(1.5 * s, tip, 8), upper);
    b.position.set(x, baseY + shaft + tip / 2, z); b.castShadow = true; body.add(b);
  };
  spire(-5.1, -27, 19, 1.1); spire(5.1, -27, 19, 1.1);
  spire(-15, -4, 19, 0.8); spire(15, -4, 19, 0.8);

  // Strebewerk
  for (const side of [-1, 1]) for (const z of [14, 7, -12, -18]) {
    box(body, 'buttress', 1.2, 13, 1.2, second, side * 14.5, 7.5, z);
  }
  // Fenster
  for (const side of [-1, 1]) {
    for (const z of [15, 10, 5, -12, -17, -23, -27]) box(body, 'clerestory', 0.2, 2.6, 1.35, glaze, side * 7.06, 17.3, z);
    for (const z of [15, 10, 5, -12, -17]) box(body, 'aisle-window', 0.2, 4.2, 1.45, glaze, side * 13.06, 8, z);
  }
  box(body, 'portal', 5.5, 7.6, 0.2, upper, 0, 4.8, 26.07);
  box(body, 'rose', 4.4, 4.4, 0.25, glaze, 0, 14.5, 26.1);

  g.add(body); g.add(towerGroup);
  g.scale.setScalar(SCALE);
  const outer = new THREE.Group();
  outer.name = 'dom-anchor';
  outer.add(g);
  outer.rotation.y = -Math.PI / 2;
  outer.position.set(opts.x ?? -301.298, 0, opts.z ?? -75.744);

  return {
    group: outer, towers, body,
    measured: {
      scale: SCALE,
      osmHeightM: 157.38,
      osmFootprintM: { x: 146.0, z: 86.8 },
      donorTopU: 84,
      donor: 'tools/img2threejs/prototypes/koelner-dom/v0.2/index.html',
      profile: 'landmark-style-profiles.v1.json#koelner-dom'
    },
    // LandmarkElastic: nur die Tuerme antworten auf Wind, der Koerper steht
    update(t, wind) {
      for (let i = 0; i < towers.length; i++) {
        const ph = i * 1.7;
        towers[i].rotation.z = Math.sin(t * 0.42 + ph) * 0.0075 * wind;
        towers[i].rotation.x = Math.cos(t * 0.31 + ph) * 0.0055 * wind;
      }
    }
  };
}

// ----------------------------------------------------------------- Boden
export function buildGround(THREE, ctx) {
  const b = ctx.bounds;
  const w = (b.max.x - b.min.x) * 1.6, d = (b.max.z - b.min.z) * 1.6;
  const geo = new THREE.PlaneGeometry(w, d, 1, 1);
  geo.rotateX(-Math.PI / 2);
  // Bodenton: gemessener dunkler Warmwert von Tafel 02 (#422d1d, 3,44 %).
  // Ein heller Grund wuerde das teale Band schlucken — die Fahrbahn ist der Held.
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x422d1d, roughness: 1 }));
  m.position.set((b.min.x + b.max.x) / 2, -2.6, (b.min.z + b.max.z) / 2);
  m.receiveShadow = true;
  m.name = 'ground-plate';
  return m;
}
