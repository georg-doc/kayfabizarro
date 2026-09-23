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
import { TUNNEL_SHELL, tunnelShellGroundSpan } from './cologne-track.v1.js';
import { FORM, cornerRadius, roundRing, offsetRing, shortestEdge, signedArea, fanIndices, wallIndices, roundedBox, softenDonor, unsoftenDonor } from './kfb-round.v1.js';

// Formsprache-Schalter (§8: Geometrie- und Oberflaechenversuche muessen
// unabhaengig schaltbar sein). Wird VOR dem Bau gesetzt; ein Wechsel baut die
// Welt neu, so wie der Palettenwechsel es auch tut.
let FORM_ON = true;
export function setFormLanguage(on) { FORM_ON = !!on; }
export function getFormLanguage() { return FORM_ON; }
export { softenDonor, unsoftenDonor, FORM };

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
  let tris = 0, portals = 0, skipped = 0, pierSkipped = 0, rounded = 0, crownFlares = 0, worstFlare = 0;

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

    // --- Formsprache ------------------------------------------------------
    // Georgs Regel: Radius aus der MASSE des Objekts, nicht fest. Kleinste
    // Dimension hier = die schmalere Seite des Grundrisses gegen die Hoehe.
    let rMin = Infinity;
    if (FORM_ON) {
      let nx0 = 1e9, xx0 = -1e9, nz0 = 1e9, xz0 = -1e9;
      for (const q of ringOf(c.b.footprint)) {
        nx0 = Math.min(nx0, q.x); xx0 = Math.max(xx0, q.x);
        nz0 = Math.min(nz0, q.z); xz0 = Math.max(xz0, q.z);
      }
      rMin = Math.min(xx0 - nx0, xz0 - nz0);
    }
    const roundM = FORM_ON ? cornerRadius(rMin, c.h - base) : 0;
    if (roundM > 0) rounded++;

    const prism = extrudeFootprint(THREE, c.b.footprint, c.h, {
      // BuildingElastic — Werte in der Groessenordnung des Spenders, nach oben staerker
      lean: (r() * 2 - 1) * 0.030,
      leanZ: (r() * 2 - 1) * 0.030,
      bend: (r() * 2 - 1) * 0.022,
      bendZ: (r() * 2 - 1) * 0.022,
      taper: 0.06 + r() * 0.07,
      twist: (r() * 2 - 1) * 2.6 * Math.PI / 180,
      cx: c.cx, cz: c.cz, base, round: roundM
    });
    if (!prism) continue;
    tris += prism.index.count / 3;
    if (prism.userData.crownFlareM > 0.01) {
      crownFlares++;
      worstFlare = Math.max(worstFlare, prism.userData.crownFlareM);
    }
    if (!buckets.has(toneIdx)) buckets.set(toneIdx, []);
    buckets.get(toneIdx).push(prism);

    if (piers) {
      for (const q of piers) {
        // Ein Pfeiler darf NIE im Fahrkorridor stehen. Gemessener Befund aus Georgs
        // Bild: runde Stuempfe standen im Band. Die Ecke lag ausserhalb, aber pierAt
        // zieht den Pfeiler um 6 % zum Schwerpunkt ein — damit wanderte er hinein.
        // Geprueft wird jetzt die EINGEZOGENE Lage, mit dem Pfeilerradius als
        // Zuschlag. Wer den Test nicht besteht, wird nicht gebaut.
        const ix = c.cx + (q.x - c.cx) * 0.94, iz = c.cz + (q.z - c.cz) * 0.94;
        const dn = nearRoute(ix, iz, 120);
        const need = (dn.point ? dn.point.w * 0.5 : 9) + PIER_R + 2.5;
        if (dn.dist < need) { pierSkipped++; continue; }
        const pg = pierAt(THREE, q.x, q.z, c.cx, c.cz, base);
        if (pg) buckets.get(toneIdx).push(pg);
      }
    }

    // Dachplatte als eigene Farbe — gibt der Skyline Rhythmus ohne Streifung
    const cap2 = capPlate(THREE, c.b.footprint, c.h, c.cx, c.cz,
      prism.userData.crownRing ? { ring: prism.userData.crownRing, center: prism.userData.crownCenter } : null);
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
      pierSkipped,
      formLanguage: FORM_ON ? 'CARTOON_FORM' : 'CURRENT',
      roundedBuildings: rounded,
      crownFlares,
      worstCrownFlareM: +worstFlare.toFixed(3),
      cornerRule: `r = ${FORM.K} x kleinste Dimension, ${FORM.MIN_M}–${FORM.MAX_M} m, nur Silhouettenkanten`,
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
// Pfeilerradius. Steht hier, weil der Korridortest ihn braucht.
export const PIER_R = 1.5;

function pierAt(THREE, x, z, cx, cz, top) {
  if (!(top > 1)) return null;
  const r = PIER_R;
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
  const ring0 = ringOf(fp);
  if (ring0.length < 3 || ring0.length > 160) return null;
  const y0 = p.base || 0;

  // --- Formsprache: groessenrelativer Radius auf den Silhouettenkanten ----
  // Gerundet werden die SENKRECHTEN Ecken und die DACHKANTE — die Kanten, die
  // gegen den Himmel stehen. Die Sohle bleibt scharf: sie steht auf dem Boden,
  // dort sieht sie niemand, und eine gerundete Sohle laesst das Haus schweben.
  const r = (p.round > 0 && ring0.length <= FORM.MAX_CORNERS)
    ? Math.min(p.round, shortestEdge(ring0) * 0.48, (h - y0) * 0.33)
    : 0;
  const ring = r > 0 ? roundRing(ring0, r) : ring0;
  const n = ring.length;

  const pos = [], idx = [];
  const at = (q, y) => {
    const e = elasticPoint(q.x, y, q.z, h, p);
    pos.push(e.x, e.y, e.z);
    return pos.length / 3 - 1;
  };

  // Ringebenen von unten nach oben. Ohne Rundung sind es genau die zwei
  // Ebenen der urspruenglichen Fassung — die Current-Form bleibt Bit fuer Bit.
  const levels = [{ ring, y: y0 }];
  if (r > 0) {
    levels.push({ ring, y: h - r });
    for (let k = 1; k <= FORM.ROOF_SEG; k++) {
      const a = (k / FORM.ROOF_SEG) * Math.PI / 2;
      levels.push({ ring: offsetRing(ring, r * (1 - Math.cos(a))), y: h - r + r * Math.sin(a) });
    }
  } else {
    levels.push({ ring, y: h });
  }

  const rows = levels.map(L => L.ring.map(q => at(q, L.y)));
  for (let L = 0; L < rows.length - 1; L++) {
    for (const v of wallIndices(rows[L], rows[L + 1], ring)) idx.push(v);
  }
  // Dachdeckel nur bei gerundetem Bau: dort ist der oberste Ring eingezogen
  // und wuerde sonst als Loch in der Krone stehen. Ohne Rundung schliesst wie
  // bisher die farbige Dachplatte ab.
  let crownCenterIdx = -1;
  if (r > 0) {
    crownCenterIdx = at({ x: p.cx, z: p.cz }, levels[levels.length - 1].y);
    for (const v of fanIndices(crownCenterIdx, rows[rows.length - 1], ring, true)) idx.push(v);
  }
  // Untere Deckflaeche, damit die Durchfahrt von unten geschlossen wirkt.
  // Sie wird VON UNTEN gesehen — man faehrt hindurch —, also faceUp = false.
  if (y0 > 0) {
    const o = pos.length / 3;
    pos.push(p.cx, y0, p.cz);
    const row = [];
    for (const q of ring) { pos.push(q.x, y0, q.z); row.push(pos.length / 3 - 1); }
    for (const v of fanIndices(o, row, ring, false)) idx.push(v);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);

  // SELBSTPRUEFUNG der Formsprache, am Ort der Entstehung.
  // Die Frage "wird die Krone breiter als die Wand?" laesst sich an der
  // fertigen Stadt nicht beantworten: die Netze sind nach Farbton verschmolzen
  // und jede Rasterzelle mischt hohe und niedrige Haeuser. Ein Zellentest hat
  // genau deshalb 42 % gemeldet, wo die Ringkette nachweislich monoton
  // schrumpft — er zaehlte ausserdem den lean/bend-Versatz von BuildingElastic
  // als Verbreiterung. Hier liegen beide Ringe des SELBEN Hauses vor, in
  // Weltkoordinaten, nach dem Elastic-Transform.
  if (r > 0 && rows.length > 2) {
    const ext = (row) => {
      let mnx = 1e9, mxx = -1e9, mnz = 1e9, mxz = -1e9;
      for (const vi of row) {
        const x = pos[vi * 3], z = pos[vi * 3 + 2];
        mnx = Math.min(mnx, x); mxx = Math.max(mxx, x);
        mnz = Math.min(mnz, z); mxz = Math.max(mxz, z);
      }
      return Math.max(mxx - mnx, mxz - mnz);
    };
    g.userData.crownFlareM = +(ext(rows[rows.length - 1]) - ext(rows[1])).toFixed(3);
    // Die Dachplatte muss auf GENAU diesem Ring sitzen, sonst haengt sie ueber
    // der Krone: sie kannte bisher weder die Eckenrundung noch den
    // Elastic-Transform und stand deshalb auf der ungeneigten Rohform.
    const topRow = rows[rows.length - 1];
    g.userData.crownRing = topRow.map(vi => ({ x: pos[vi * 3], y: pos[vi * 3 + 1], z: pos[vi * 3 + 2] }));
    g.userData.crownCenter = crownCenterIdx >= 0
      ? { x: pos[crownCenterIdx * 3], y: pos[crownCenterIdx * 3 + 1], z: pos[crownCenterIdx * 3 + 2] }
      : null;
  }
  return g;
}

function capPlate(THREE, fp, h, cx, cz, crown) {
  // Mit Rundung: die Platte liegt auf dem fertigen Kronenring des Prismas —
  // gerundet, getapert, geneigt, verdreht, genau wie die Krone selbst.
  if (crown && crown.ring && crown.ring.length >= 3 && crown.center) {
    const pos = [crown.center.x, crown.center.y + 0.06, crown.center.z];
    const row = [];
    for (const q of crown.ring) { pos.push(q.x, q.y + 0.06, q.z); row.push(pos.length / 3 - 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(fanIndices(0, row, crown.ring, true));
    return g;
  }
  const ring = ringOf(fp);
  if (ring.length < 3 || ring.length > 160) return null;
  const pos = [cx, h + 0.35, cz];
  const row = [];
  for (const q of ring) {
    pos.push(cx + (q.x - cx) * 0.94, h + 0.35, cz + (q.z - cz) * 0.94);
    row.push(pos.length / 3 - 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(fanIndices(0, row, ring, true));
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

  // Farbe: der Dom stand bisher in seiner eigenen Steinpalette und damit neben
  // der Stadt. Auf Georgs Ansage nimmt er die GEBAEUDETOENE der Szene — die
  // hellen Werte fuer den Koerper, die Dachtoene fuer die Daecher, damit er zur
  // Skyline gehoert statt daneben zu stehen. Die Identitaetspalette aus
  // landmark-style-profiles bleibt als Rueckfall, falls keine Toene da sind.
  const T = BUILDING_TONES, RT = ROOF_TONES;
  const tone = (i, fb) => (T && T.length ? T[i % T.length] : fb);
  const roofTone = (i, fb) => (RT && RT.length ? RT[i % RT.length] : fb);
  const mkMat = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.95, flatShading: false }, o || {}));
  const stone = mkMat(tone(1, 0x7c7770), { metalness: 0.02 });
  const second = mkMat(tone(3, 0x9b958b));
  const upper = mkMat(roofTone(0, 0x57534e), { roughness: 0.92 });
  const accent = mkMat(C.lineGold, { roughness: 0.6 });
  // Verglasung folgt der Palette wie alles andere am Bauwerk. Sie traegt 25 der
  // Netze (14 Obergaden, 10 Seitenschiff, 1 Rosette) und war als einziges
  // Material hart auf 0x3f6275 verdrahtet — in einer gruen/magenta gewuerfelten
  // Stadt stand der Dom damit in seinen Farben, aber mit schiefergrauen Fenstern.
  //
  // Was hier garantiert werden KANN, und was nicht:
  //
  // Der Farbton gehoert der Palette. Sie faerbt die Materialien nach ROLLE um,
  // NACH dem Bau — zwei Versuche, das Glas hier auf einen kuehlen Ton zu setzen,
  // sind daran gescheitert: erst ueber einen Dachton (Ergebnis Farbton 0 Grad
  // gegen 10 Grad der Masse), dann ueber C.water mit Farbton 193 (Ergebnis 234
  // gegen 231). Beide Male stand "kuehler" im Kommentar und war falsch. Der
  // Farbton ist nicht unser Besitz, und §6 sagt genau das: auf Rollenebene
  // arbeiten, nicht einzelne Netze umfaerben.
  //
  // Garantiert und gemessen wird deshalb das, was hier tatsaechlich gesetzt wird:
  // das Glas ist DUNKLER als die Masse (weniger als die halbe Helligkeit; zwei
  // Bootlaeufe: 0,130 gegen 0,279 und 0,075 gegen 0,161) und es LEUCHTET (das
  // Zwei- bis Vierfache des frueheren Effektivwerts 0,0168). Als VERHAELTNIS
  // notiert, nicht als Absolutwert: der Palettenseed verschiebt die Helligkeit,
  // eine feste Zahl waere schon beim naechsten Wurf wieder falsch.
  // Damit liest das Glas als Oeffnung statt als Wandstueck, und im
  // Strahlerlicht gliedern die Fensterbaender den Koerper — unabhaengig davon,
  // welchen Farbton die Palette gerade ausgibt.
  // GEMESSENER FEHLER DER ERSTEN FASSUNG: sie nahm einen DACHTON und dunkelte ihn
  // 55 % ab. Ein Dachton ist warm (dieser Bootlauf: Farbton 0 Grad, wie die
  // Masse), und 55 % Richtung Schwarz loescht Kuehle und Leuchten in einem
  // Zug — heraus kam ein schwarzes Loch in Steinfarbe bei halber Leuchtkraft
  // des Vorgaengers. Der Kommentar behauptete trotzdem "kuehler".
  //
  // Jetzt von Bau aus kuehl: C.water (Farbton 193 Grad) als Quelle, nur 45 %
  // abgedunkelt, damit die Helligkeit ueber der Masse-Schwelle bleibt, und das
  // Eigenleuchten kraeftig genug, dass die Fensterbaender im Strahlerlicht
  // wirklich gliedern.
  const glazeBase = new THREE.Color(C.water).lerp(new THREE.Color(0x0c1418), 0.45);
  const glaze = mkMat(glazeBase.getHex(), {
    roughness: 0.3,
    emissive: glazeBase.clone().multiplyScalar(0.85).getHex(),
    emissiveIntensity: 0.6
  });

  // Formsprache: derselbe groessenrelative Radius wie an den 775 Gebaeuden.
  const ROUND = getFormLanguage();
  const boxGeo = (w, h, d) => ROUND
    ? roundedBox(THREE, w, h, d, cornerRadius(Math.min(w, d), h))
    : new THREE.BoxGeometry(w, h, d);

  const towerGroup = new THREE.Group(); towerGroup.name = 'dom-towers';
  const body = new THREE.Group(); body.name = 'dom-body';

  const box = (parent, name, w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(boxGeo(w, h, d), mat);
    m.position.set(x, y, z); m.name = name; m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  };

  // KEIN Sockel mehr. Georgs Ansage: der Dom soll IM Gelaende stehen, nicht auf
  // einer Platte. Die alte 'foundation' war ein 44 x 1 x 64 Quader, auf dem das
  // ganze Bauwerk sass — zusammen mit der Bodenplatte auf -2,6 m sah das aus wie
  // ein Modell auf einem Brett. Stattdessen reichen die tragenden Massen nach
  // UNTEN durch: jede Grundmasse bekommt SINK Meter Zugabe nach unten und ihre
  // Mitte wandert um die Haelfte mit. Was unter dem Boden liegt, sieht niemand,
  // aber die Fuge ist weg.
  const SINK = 3.4;   // Spendereinheiten, also 6,4 m in der Welt
  const grounded = (parent, name, w, h, d, mat, x, y, z) =>
    box(parent, name, w, h + SINK, d, mat, x, y - SINK / 2, z);

  grounded(body, 'nave', 14, 18, 42, stone, 0, 10, 1);
  grounded(body, 'aisle-left', 6, 11, 38, stone, -10, 6.5, 1);
  grounded(body, 'aisle-right', 6, 11, 38, stone, 10, 6.5, 1);
  grounded(body, 'transept', 32, 18, 10, stone, 0, 10, -4);
  grounded(body, 'choir', 14, 18, 9, stone, 0, 10, -24.5);
  grounded(body, 'west-facade', 20, 20, 8, stone, 0, 11, 22);

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
      const m = new THREE.Mesh(boxGeo(w, h, d), mat);
      m.position.set(0, y, 0); m.name = name; m.castShadow = true; t.add(m);
    };
    b('body', 6.4, 36 + SINK, 6.4, stone, 19 - SINK / 2);
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

  // --- Strahler am Boden ---------------------------------------------------
  // Wie am echten Dom: eine Reihe Bodenstrahler, die das Bauwerk von unten
  // anleuchten. Zweck hier ist nicht nur Stimmung — Georgs Begruendung war,
  // Modell UND Farbe ueberhaupt beurteilen zu koennen. Streiflicht von unten
  // zeigt Silhouette und Rundung, die das flache Tageslicht verschluckt.
  //
  // Sie haengen AUSSERHALB der skalierten Gruppe, in Weltmetern, damit ihre
  // Reichweite nicht mit dem Modellmassstab mitwaechst.
  const flood = new THREE.Group();
  flood.name = 'dom-floodlights';
  const FIX = [
    { x: -34, z: 52, ty: 120, name: 'west-left' },
    { x: 34, z: 52, ty: 120, name: 'west-right' },
    { x: -46, z: -4, ty: 42, name: 'nave-left' },
    { x: 46, z: -4, ty: 42, name: 'nave-right' },
    { x: -30, z: -58, ty: 40, name: 'choir-left' },
    { x: 30, z: -58, ty: 40, name: 'choir-right' }
  ];
  const fixMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.8, metalness: 0.3 });
  const lensMat = new THREE.MeshBasicMaterial({ color: C.sun || 0xfed95a, toneMapped: false });
  const lamps = [];
  for (const f of FIX) {
    const housing = new THREE.Mesh(boxGeo(2.2, 1.4, 2.6), fixMat);
    housing.position.set(f.x, 0.7, f.z);
    housing.name = 'dom-floodlight-housing-' + f.name;
    flood.add(housing);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.75, 16), lensMat);
    lens.position.set(f.x, 1.45, f.z);
    lens.rotation.x = -Math.PI / 2;
    lens.name = 'dom-floodlight-lens-' + f.name;
    flood.add(lens);

    const sp = new THREE.SpotLight(C.sun || 0xfed95a, 0, 420, Math.PI / 7, 0.55, 1.1);
    sp.position.set(f.x, 1.6, f.z);
    sp.castShadow = false;                 // sechs Schattenkarten waeren der Ruckel
    sp.target.position.set(f.x * 0.12, f.ty, f.z * 0.12);
    sp.name = 'dom-floodlight-' + f.name;
    flood.add(sp, sp.target);
    lamps.push({ light: sp, lens });
  }

  let floodOn = false, floodLevel = 1;
  const applyFlood = () => {
    for (const l of lamps) l.light.intensity = floodOn ? 900 * floodLevel : 0;
    lensMat.color.set(floodOn ? (C.sun || 0xfed95a) : 0x3a332b);
  };
  applyFlood();

  const outer = new THREE.Group();
  outer.name = 'dom-anchor';
  outer.add(g);
  outer.add(flood);
  outer.rotation.y = -Math.PI / 2;
  outer.position.set(opts.x ?? -301.298, 0, opts.z ?? -75.744);

  return {
    group: outer, towers, body, floodlights: flood,
    // Ein Schalter, ein Pegel. Ereignis, Uhrzeit oder Taste koennen ihn
    // bedienen — der Besitzer bleibt das Bauwerk.
    setFloodlights(on, level) {
      floodOn = !!on;
      if (level !== undefined) floodLevel = Math.max(0, Math.min(2, level));
      applyFlood();
      return { on: floodOn, level: floodLevel, lamps: lamps.length };
    },
    getFloodlights() { return { on: floodOn, level: floodLevel, lamps: lamps.length }; },
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
// GEMESSENER BEFUND 2026-09-22: die Bodenplatte liegt auf KONSTANTER Hoehe
// -2,6 m und spannt 3 647 x 3 384 m. Die Strecke faellt zwischen Stuetzpunkt
// 76 und 133 (s 263-460 m, Marke TUNNEL) auf bis zu -9,88 m ab. Auf diesen
// 197 m lag die Platte als geschlossener, undurchsichtiger Deckel bis zu 7,3 m
// UEBER der Fahrbahn: man faehrt in eine riesige braune Flaeche (#422d1d).
//
// Warum kein Pruefwerkzeug das gemeldet hat: auditRoute() und scrubCorridor()
// fragen beide "ragt ein NETZ in den Fahrraum?" und nehmen kartenweite Netze
// ausdruecklich aus, weil deren Huelle ueber einzelne Teile nichts sagt -
// 'ground-plate' steht namentlich in der skip-Liste des Schrubbers. Die
// tatsaechliche Frage war eine andere: "liegt eine durchgehende FLAECHE ueber
// der Fahrbahn?" Dieselbe Luecke wie beim Sichtachsen-Fall im Postmortem, nur
// eine Ebene tiefer. Das Werkzeug dafuer ist der Hoehenvergleich unten.
//
// Fix, eine Naht: die Platte wird dort aufgeschnitten, wo die Fahrbahn unter
// ihr liegt, und der Schnitt bekommt Waende und eine Sohle, die dem Gefaelle
// folgen. Aus dem Deckel wird ein offener Einschnitt, der in die gedeckte
// Roehre fuehrt. Die Route wurde NICHT angefasst - sie gehoert
// cologne-route.v1.js.
export const GROUND_Y = -2.6;

// Spanne, auf der die Fahrbahn unter der Platte liegt. Je ein Stuetzpunkt
// Zugabe an beiden Enden, damit die Oeffnung genau dort ausklingt, wo die
// Rampe die Plattenhoehe wieder erreicht.
function groundCutSpan(route) {
  const p = route.points;
  let lo = -1, hi = -1;
  for (let i = 0; i < p.length; i++) {
    if (p[i].y < GROUND_Y) { if (lo < 0) lo = i; hi = i; }
  }
  if (lo < 0) return null;
  return { lo: Math.max(0, lo - 1), hi: Math.min(p.length - 1, hi + 1) };
}

// Tiefen-Rampe an den Muendern: ueber die aeussersten TAPER_PTS Stuetzpunkte
// faehrt die Tiefe auf null, damit die Waende dort auf null auslaufen.
function smoothTaper(i, cut, taperPts = 4) {
  const u = Math.min(1, Math.min(i - cut.lo, cut.hi - i) / taperPts);
  return u * u * (3 - 2 * u);
}

export function buildGround(THREE, ctx, route) {
  const b = ctx.bounds;
  const w = (b.max.x - b.min.x) * 1.6, d = (b.max.z - b.min.z) * 1.6;
  const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;

  const group = new THREE.Group();
  group.name = 'ground-plate';   // Name bleibt: der Korridor-Schrubber nimmt ihn aus

  // Bodenton: gemessener dunkler Warmwert von Tafel 02 (#422d1d, 3,44 %).
  // Ein heller Grund wuerde das teale Band schlucken — die Fahrbahn ist der Held.
  const mat = new THREE.MeshStandardMaterial({ color: 0x422d1d, roughness: 1 });

  const cut = route ? groundCutSpan(route) : null;

  // Schnittkanten: Bandbreite plus Bankett. Einmal berechnet, von Platte,
  // Waenden und Sohle gemeinsam benutzt, damit keine Naht klafft.
  //
  // Die Sohle liegt DEPTH_M unter der Fahrbahn, aber nicht auf der ganzen
  // Laenge: ueber die aeussersten TAPER_PTS Stuetzpunkte wird die Tiefe auf 0
  // heruntergefahren, und die Sohle wird zusaetzlich auf GROUND_Y gedeckelt.
  // Damit ist die Wandhoehe an beiden Muendern exakt null und der Einschnitt
  // schliesst buendig an die Platte an.
  //
  // GEMESSENER FEHLER DER ERSTEN FASSUNG, hier notiert damit er nicht
  // zurueckkommt: sie rechnete min(GROUND_Y - 0,4, y - 3). Der erste Term kann
  // nie gewinnen, weil die Fahrbahn an den Spannenenden schon auf ~-2,6 m
  // liegt und y - 3 damit immer kleiner ist. Ergebnis war eine abrupte
  // 2,9-m-Stufe an allen vier Muendungsecken — eine rechteckige Kerbe in der
  // Platte, genau dort wo der Fahrer mit Tempo in den Takt einfaehrt.
  const MARGIN_M = 7;
  const DEPTH_M = 3;
  const TAPER_PTS = 4;
  // RSTAB-1: ten support points keep the cut-edge slope near the historical
  // 1 m/support-point guard without a second post-process that can pull an edge
  // back away from the shell after it has already been marked covered.
  const COVER_BLEND = 10;
  const SHELL_SEAM_CLEARANCE_M = 0.03;  // tiny hole-side clearance; never place ground under the visible shell
  const edge = [];
  if (cut) {
    const isTunnel = i => route.points[i] && route.points[i].kind === 'TUNNEL';
    // Abstand in Stuetzpunkten bis zum naechsten UNgedeckten Punkt.
    const depthInCover = (i) => {
      if (!isTunnel(i)) return 0;
      let k = 1;
      while (k <= COVER_BLEND && isTunnel(i - k) && isTunnel(i + k)) k++;
      return k;
    };
    for (let i = cut.lo; i <= cut.hi; i++) {
      const p = route.points[i];
      // GEMELDETER BEFUND (Georg): im Tunnel steht ein brauner Keil neben der
      // Fahrbahn. Gemessen: die Schnittkante lag bei w/2 + 7 m, die Tunnelschale
      // endet aber schon bei rund w/2 x 1,28 — dazwischen blieb offene Grabenwand
      // stehen, und weil die Schale ein HALBrohr ist, sieht man im flachen Winkel
      // an ihrer Unterkante vorbei genau darauf.
      //
      // Wo eine Schale steht, endet der Einschnitt deshalb GENAU auf ihr: der
      // Punkt, an dem die Schale die Plattenhoehe schneidet.
      //
      // GEMESSENER FEHLER DER ERSTEN FASSUNG: der Uebergang sprang in EINEM
      // Segment von 13,5 auf 5,7 m. Die Lochkante steht dadurch so schraeg zur
      // Strecke, dass sie die Sohle seitlich ueberholt — ein schmaler Schlitz
      // blieb offen, genau am Tunnelmund. Die Kante zieht sich jetzt ueber
      // COVER_BLEND Stuetzpunkte heran, und diese Uebergangspunkte gelten als
      // UNgedeckt, bekommen also Wand und Sohle.
      const cover = depthInCover(i);
      let leftHalf = p.w * 0.5 + MARGIN_M;
      let rightHalf = leftHalf;
      let covered = false;
      let shellSpan = null;

      if (cover > 0) {
        // RSTAB-1: use the ACTUAL rendered shell, not a smooth unbanked circle.
        // buildTrack() banks crossPoint() and draws only TUNNEL_SHELL.rib facets.
        // On the old symmetric formula a ~23° bank moved the real left/right
        // ground intersections by more than 2 m relative to each other, producing
        // a ground overlap on one side and a gap on the other.
        shellSpan = tunnelShellGroundSpan(p, GROUND_Y);
        if (shellSpan.negative != null && shellSpan.positive != null) {
          // lx is +normal, rx is -normal. Keep each side independent.
          const targetLeft = shellSpan.positive + SHELL_SEAM_CLEARANCE_M;
          const targetRight = shellSpan.negative + SHELL_SEAM_CLEARANCE_M;
          const u = Math.min(1, cover / COVER_BLEND);
          const k = u * u * (3 - 2 * u);
          leftHalf += (targetLeft - leftHalf) * k;
          rightHalf += (targetRight - rightHalf) * k;

          // Only declare the trench closed by the tunnel when the blend has
          // actually reached the rendered shell seam. The old COVER_BLEND=3 +
          // later SLEW pass could mark a point covered while its cut edge was
          // still several metres outside the shell.
          covered = cover >= COVER_BLEND;
        }
      }

      edge.push({
        covered, leftHalf, rightHalf, shellSpan,
        lx: p.x + p.nx * leftHalf, lz: p.z + p.nz * leftHalf,
        rx: p.x - p.nx * rightHalf, rz: p.z - p.nz * rightHalf,
        floor: Math.min(GROUND_Y, p.y - DEPTH_M * smoothTaper(i, cut))
      });
    }

    // RSTAB-1: no second SLEW pass. The transition blend itself owns edge
    // continuity now. A post-pass that changes the edge after "covered" was set
    // was the state split that created the previous shell/ground mismatch.
  }

  // --- Platte, bei Bedarf mit Loch --------------------------------------
  // ShapeGeometry trianguliert in XY; nach rotateX(-90 Grad) wird aus (x, u)
  // die Weltlage (x, 0, -u). Darum wird durchgehend u = -z gerechnet.
  let geo;
  if (edge.length > 1) {
    const outer = new THREE.Shape();
    outer.moveTo(cx - w / 2, -(cz - d / 2));
    outer.lineTo(cx + w / 2, -(cz - d / 2));
    outer.lineTo(cx + w / 2, -(cz + d / 2));
    outer.lineTo(cx - w / 2, -(cz + d / 2));
    outer.closePath();
    const hole = new THREE.Path();
    hole.moveTo(edge[0].lx, -edge[0].lz);
    for (let i = 1; i < edge.length; i++) hole.lineTo(edge[i].lx, -edge[i].lz);
    for (let i = edge.length - 1; i >= 0; i--) hole.lineTo(edge[i].rx, -edge[i].rz);
    hole.closePath();
    outer.holes.push(hole);
    geo = new THREE.ShapeGeometry(outer);
  } else {
    geo = new THREE.PlaneGeometry(w, d, 1, 1);
    geo.translate(cx, -cz, 0);
  }
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  const plate = new THREE.Mesh(geo, mat);
  plate.position.y = GROUND_Y;
  plate.receiveShadow = true;
  plate.name = 'ground-plate-surface';
  group.add(plate);

  // --- Einschnitt: zwei Waende und eine Sohle ---------------------------
  // Die Waende laufen an beiden Muendern auf null aus, weil die Tiefe dort
  // heruntergefahren ist (siehe Rampe oben) und die Sohle auf GROUND_Y
  // gedeckelt wird — gemessen, nicht angenommen: group.userData.cut.mouthWallM.
  // Keine Stirnwaende: die Oeffnung endet genau auf Plattenhoehe.
  //
  // DREI getrennte Netze, nicht eines. Ein verschmolzenes Netz haette eine
  // Huelle von 130 x 10 x 74 m, die die Fahrbahn auf der ganzen Laenge
  // umspannt — genau das Problem, das das Projekt fuer die oms-* Netze schon
  // dokumentiert: die Huelle sagt ueber einzelne Teile nichts. auditRoute()
  // haette daraufhin einen Fehlalarm gemeldet, und zwar auf dem Werkzeug, das
  // §3 als ERSTES laufen lassen will. Getrennt benannt ist jede Huelle ehrlich
  // und jedes Teil einzeln adressierbar (§10).
  if (edge.length > 1) {
    const strip = (fn) => {
      const v = [];
      // Unter einer Tunnelschale gibt es keine Grabenwand und keine Sohle: dort
      // schliesst die Schale selbst den Boden. RSTAB-1 setzt "covered" erst,
      // wenn die zehnstuetzige asymmetrische Blende die echte banked/faceted
      // Shell-Naht erreicht hat. Deshalb bleibt der Uebergang selbst Wand/Sohle
      // und nur ein Segment mit ZWEI tatsaechlich gedeckten Enden wird ausgelassen.
      for (let i = 0; i < edge.length - 1; i++) {
        if (edge[i].covered && edge[i + 1].covered) continue;
        fn(v, edge[i], edge[i + 1]);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      g.computeVertexNormals();
      return g;
    };
    const quad = (v, a, b, c, e) => v.push(...a, ...b, ...c, ...a, ...c, ...e);
    const cutMat = new THREE.MeshStandardMaterial({ color: 0x422d1d, roughness: 1, side: THREE.DoubleSide });

    const parts = [
      ['ground-cut-wall-left', strip((v, A, B) =>
        quad(v, [A.lx, GROUND_Y, A.lz], [A.lx, A.floor, A.lz], [B.lx, B.floor, B.lz], [B.lx, GROUND_Y, B.lz]))],
      ['ground-cut-wall-right', strip((v, A, B) =>
        quad(v, [B.rx, GROUND_Y, B.rz], [B.rx, B.floor, B.rz], [A.rx, A.floor, A.rz], [A.rx, GROUND_Y, A.rz]))],
      ['ground-cut-invert', strip((v, A, B) =>
        quad(v, [A.lx, A.floor, A.lz], [A.rx, A.floor, A.rz], [B.rx, B.floor, B.rz], [B.lx, B.floor, B.lz]))]
    ].filter(p => p[1].attributes.position.count > 0);
    for (const [name, g] of parts) {
      const m = new THREE.Mesh(g, cutMat);
      m.receiveShadow = true;
      m.name = name;
      group.add(m);
    }
    group.userData.cut = {
      fromIndex: cut.lo, toIndex: cut.hi,
      lengthM: +(route.points[cut.hi].s - route.points[cut.lo].s).toFixed(1),
      deepestM: +Math.min(...edge.map(e => e.floor)).toFixed(2),
      marginM: MARGIN_M,
      taperPoints: TAPER_PTS,
      mouthWallM: [
        +(GROUND_Y - edge[0].floor).toFixed(3),
        +(GROUND_Y - edge[edge.length - 1].floor).toFixed(3)
      ],
      coveredPoints: edge.filter(e => e.covered).length,
      coverBlendPoints: COVER_BLEND,
      shellSeamClearanceM: SHELL_SEAM_CLEARANCE_M,
      asymmetricShellSpan: true,
      maxEdgeStepM: +Math.max(0, ...edge.slice(1).flatMap((e, i) => [
        Math.abs(e.leftHalf - edge[i].leftHalf),
        Math.abs(e.rightHalf - edge[i].rightHalf)
      ])).toFixed(3),
      maxWallM: +Math.max(...edge.filter(e => !e.covered).map(e => GROUND_Y - e.floor), 0).toFixed(2),
      parts: parts.map(p => p[0])
    };
  }

  return group;
}
