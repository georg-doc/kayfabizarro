// KFB · Formsprache: groessenrelativer Radius auf Silhouettenkanten
//
// Georgs Entscheidung 2026-09-22: eigene Geometrie wird ECHT gerundet,
// Spender-Modelle (die KayKit-Autos) werden nur ueber Normalen weichgezeichnet.
//
// Die Regel, und warum sie so und nicht als Bevel gebaut ist (§4 verbietet
// "arbitrary bevel-everything" und "generic smooth plastic" ausdruecklich):
//
//   Ein FESTER Radius liest auf einem 4-m-Auto wie Spielzeug und auf einem
//   46-m-Haus wie gar nichts. Was die KayKit-Sachen knuffig macht, ist nicht
//   der Kantenradius an sich, sondern ein Radius, der zur MASSE des Objekts
//   passt. Darum: r = K * kleinste Objektdimension, gedeckelt.
//
//   Und nur auf SILHOUETTENKANTEN — den Kanten, die gegen den Himmel stehen.
//   Bei einem Baukoerper sind das die senkrechten Ecken und die Dachkante.
//   Die Sohle bleibt scharf: sie steht auf dem Boden, dort sieht sie niemand,
//   und sie zu runden kostet nur Dreiecke und laesst das Haus schweben.

export const FORM = {
  K: 0.11,          // Anteil der kleinsten Dimension
  MIN_M: 0.25,      // darunter lohnt die Rundung nicht
  MAX_M: 2.4,       // darueber wird aus dem Karton eine Kapsel
  CORNER_SEG: 2,    // Stuetzpunkte pro gerundeter Ecke
  ROOF_SEG: 2,      // Ringe im Dachviertelkreis
  MAX_CORNERS: 24,  // darueber bleibt der Grundriss scharf (Dreiecksbudget)
  DONOR_INFLATE: 0.012   // Anteil der Objektgroesse, Spender-Weichzeichnung
};

// Der Radius selbst. Eine Stelle, damit Strecke, Gebaeude und Landmarken
// spaeter nachweislich dieselbe Zahl benutzen.
export function cornerRadius(minDimM, heightM) {
  const base = Math.min(minDimM, heightM === undefined ? Infinity : heightM);
  const r = base * FORM.K;
  if (!isFinite(r) || r < FORM.MIN_M) return 0;
  return Math.min(FORM.MAX_M, r);
}

// --------------------------------------------------------------- Grundriss
// Kuerzeste Kante des Rings. Der Radius darf nie groesser als die halbe
// kuerzeste Kante werden, sonst schlagen benachbarte Ecken ineinander um und
// der Grundriss klappt sich selbst durch.
export function shortestEdge(ring) {
  let m = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    m = Math.min(m, Math.hypot(b.x - a.x, b.z - a.z));
  }
  return m;
}

// Ecken des Rings durch Kreisboegen ersetzen. Quadratische Bezier ueber die
// Originalecke: A = Ecke - Richtung_ein * r, B = Ecke + Richtung_aus * r.
// Das ist kein exakter Kreis, aber bei 3 Stuetzpunkten optisch nicht davon zu
// unterscheiden und immun gegen die Sonderfaelle spitzer Winkel.
export function roundRing(ring, r, seg = FORM.CORNER_SEG) {
  const n = ring.length;
  if (n < 3 || r <= 0) return ring;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = ring[i], prev = ring[(i - 1 + n) % n], next = ring[(i + 1) % n];
    const d1 = Math.hypot(p.x - prev.x, p.z - prev.z);
    const d2 = Math.hypot(next.x - p.x, next.z - p.z);
    if (d1 < 1e-4 || d2 < 1e-4) { out.push({ x: p.x, z: p.z }); continue; }
    const rr = Math.min(r, d1 * 0.48, d2 * 0.48);
    const ax = p.x + (prev.x - p.x) / d1 * rr, az = p.z + (prev.z - p.z) / d1 * rr;
    const bx = p.x + (next.x - p.x) / d2 * rr, bz = p.z + (next.z - p.z) / d2 * rr;
    for (let k = 0; k <= seg; k++) {
      const t = k / seg, u = 1 - t;
      out.push({
        x: u * u * ax + 2 * u * t * p.x + t * t * bx,
        z: u * u * az + 2 * u * t * p.z + t * t * bz
      });
    }
  }
  return out;
}

// Signierte Flaeche (Schnuersenkelformel). Entscheidet die Wicklung des Rings.
// OSM-Grundrisse kommen in BEIDEN Wicklungen — wer eine annimmt, versetzt ein
// Drittel der Stadt nach AUSSEN.
export function signedArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    a += p.x * q.z - q.x * p.z;
  }
  return a * 0.5;
}

// Ring nach INNEN versetzen, entlang der Winkelhalbierenden (Gehrung).
// Nicht zum Schwerpunkt hin skalieren: das staucht lange schmale Grundrisse
// und laesst Reihenhaeuser zu Rauten werden.
//
// GEMESSENER FEHLER DER ERSTEN FASSUNG: die Kantennormale wurde aus einer
// ANGENOMMENEN Wicklung gebaut ("laeuft gegen den Uhrzeigersinn"). Bei der
// anderen Wicklung zeigte sie nach aussen, und aus dem Dachviertelkreis wurde
// ein Pilzkopf, der nach oben BREITER wird — auf einem 10x6-Ring wuchs die
// Flaeche von 60 auf 96 statt zu schrumpfen. Jetzt entscheidet das Vorzeichen
// der Flaeche, nicht eine Annahme.
export function offsetRing(ring, inset) {
  const n = ring.length;
  if (inset <= 0) return ring.map(q => ({ x: q.x, z: q.z }));
  // Vorzeichen GEMESSEN, nicht hergeleitet: fuer einen Ring mit POSITIVER
  // Flaeche zeigt die Halbierende aus der Formel unten nach AUSSEN, fuer einen
  // mit negativer nach innen. Probe: 10x6-Rechteck, inset 1 — der Betrag der
  // Flaeche muss in BEIDEN Wicklungen von 60 auf 32 fallen.
  const wind = signedArea(ring) >= 0 ? -1 : 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = ring[i], prev = ring[(i - 1 + n) % n], next = ring[(i + 1) % n];
    let e1x = p.x - prev.x, e1z = p.z - prev.z;
    let e2x = next.x - p.x, e2z = next.z - p.z;
    const l1 = Math.hypot(e1x, e1z) || 1, l2 = Math.hypot(e2x, e2z) || 1;
    e1x /= l1; e1z /= l1; e2x /= l2; e2z /= l2;
    let nx = (-e1z + -e2z) * 0.5 * wind, nz = (e1x + e2x) * 0.5 * wind;
    const ln = Math.hypot(nx, nz);
    if (ln < 1e-5) { out.push({ x: p.x, z: p.z }); continue; }
    nx /= ln; nz /= ln;
    // Gehrungsfaktor gedeckelt: an einer Nadelspitze waere er unendlich.
    const cosHalf = Math.max(0.35, (e1x * e2x + e1z * e2z + 1) * 0.5);
    const m = Math.min(3, 1 / Math.sqrt(cosHalf));
    out.push({ x: p.x - nx * inset * m, z: p.z - nz * inset * m });
  }
  return out;
}

// Fuer eine Reihe ineinandergeschachtelter Ringe die Seitenflaechen bauen.
export function ringStrip(pushTri, ringA, yA, ringB, yB, n) {
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    pushTri(ringA[i], yA, ringB[i], yB, ringA[j], yA);
    pushTri(ringA[j], yA, ringB[i], yB, ringB[j], yB);
  }
}

// --------------------------------------------------------- Wicklung
// Die REIHENFOLGE der Dreiecksecken bestimmt, wohin eine Flaeche schaut. Die
// Wicklung eines OSM-Grundrisses wechselt von Objekt zu Objekt — genau die
// Groesse, die offsetRing() schon respektiert. Wer die Reihenfolge fest
// verdrahtet, baut auf etwa drei Vierteln der Haeuser Daecher, die nach UNTEN
// schauen, und bei FrontSide sieht man von oben durch sie hindurch.
//
// Herleitung, damit hier niemand raten muss: fuer zwei Ringpunkte a, b um die
// Mitte c in der xz-Ebene ist die y-Komponente der Normalen von (c, a, b)
// gleich -(2D-Kreuzprodukt von a-c und b-c). Dasselbe Vorzeichen traegt die
// signierte Flaeche. Positive Flaeche + Reihenfolge (c, a, b) = schaut NACH UNTEN.
export function fanIndices(centerIdx, row, ring, faceUp) {
  const flip = (signedArea(ring) >= 0) === !!faceUp;
  const out = [];
  for (let i = 0; i < row.length; i++) {
    const a = row[i], b = row[(i + 1) % row.length];
    if (flip) out.push(centerIdx, b, a); else out.push(centerIdx, a, b);
  }
  return out;
}

// Seitenwand zwischen zwei Ringebenen, Normalen nach AUSSEN.
// Bei positiver Ringflaeche zeigt (A[i], A[j], B[i]) nach innen — gleiche
// Ursache, gleiche Pruefung.
export function wallIndices(rowLow, rowHigh, ring) {
  const flip = signedArea(ring) >= 0;
  const out = [];
  const n = rowLow.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const a = rowLow[i], b = rowLow[j], c = rowHigh[i], d = rowHigh[j];
    if (flip) out.push(a, c, b, b, c, d);
    else out.push(a, b, c, c, b, d);
  }
  return out;
}

// Gerundeter Quader nach derselben Regel wie die Gebaeude: Radius aus der
// kleinsten Dimension, gerundet werden die SENKRECHTEN Ecken und die obere
// Kante. Die Sohle bleibt scharf \u2014 sie steht auf dem Boden oder steckt im
// naechsten Bauteil, dort sieht sie niemand.
export function roundedBox(THREE, w, h, d, radius, seg = FORM.CORNER_SEG, roofSeg = FORM.ROOF_SEG) {
  const r = Math.min(radius, w * 0.48, d * 0.48, h * 0.45);
  if (!(r > 0.001)) return new THREE.BoxGeometry(w, h, d);
  const rect = [
    { x: -w / 2, z: -d / 2 }, { x: w / 2, z: -d / 2 },
    { x: w / 2, z: d / 2 }, { x: -w / 2, z: d / 2 }
  ];
  const ring = roundRing(rect, r, seg);
  const n = ring.length;
  const pos = [], idx = [];
  const at = (q, y) => { pos.push(q.x, y, q.z); return pos.length / 3 - 1; };

  const levels = [{ ring, y: -h / 2 }, { ring, y: h / 2 - r }];
  for (let k = 1; k <= roofSeg; k++) {
    const a = (k / roofSeg) * Math.PI / 2;
    levels.push({ ring: offsetRing(ring, r * (1 - Math.cos(a))), y: h / 2 - r + r * Math.sin(a) });
  }
  const rows = levels.map(L => L.ring.map(q => at(q, L.y)));
  for (let L = 0; L < rows.length - 1; L++)
    for (const v of wallIndices(rows[L], rows[L + 1], ring)) idx.push(v);

  const topC = at({ x: 0, z: 0 }, levels[levels.length - 1].y);
  for (const v of fanIndices(topC, rows[rows.length - 1], ring, true)) idx.push(v);
  const botC = at({ x: 0, z: 0 }, -h / 2);
  for (const v of fanIndices(botC, rows[0], ring, false)) idx.push(v);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// --------------------------------------------------------------- Spender
// Spender-Netze bekommen KEINE neue Topologie. Was hier passiert, ist
// ehrlich benannt: die Normalen werden zusammengefuehrt, sodass angrenzende
// Flaechen ineinander uebergehen statt an einer harten Kante zu brechen, und
// die Huelle wird um einen winzigen, groessenrelativen Betrag entlang der
// Normalen aufgeblaeht. Das rundet die BELEUCHTUNG der Kante, nicht die Kante.
// Eine echte Rundung braeuchte neue Geometrie — die gehoert dem Spender.
export function softenDonor(THREE, root, opts = {}) {
  const inflate = opts.inflate === undefined ? FORM.DONOR_INFLATE : opts.inflate;
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const amount = Math.min(size.x, size.y, size.z) * inflate;
  const touched = [];
  root.traverse(o => {
    if (!o.isMesh || !o.geometry || o.userData.kfbSoftened) return;
    const g = o.geometry;
    if (!g.attributes.position) return;
    o.userData.kfbOriginalGeometry = g;
    const ng = mergeByPosition(THREE, g);
    ng.computeVertexNormals();
    if (amount > 0) {
      const pos = ng.attributes.position, nor = ng.attributes.normal;
      for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(i,
          pos.getX(i) + nor.getX(i) * amount,
          pos.getY(i) + nor.getY(i) * amount,
          pos.getZ(i) + nor.getZ(i) * amount);
      }
      pos.needsUpdate = true;
      ng.computeVertexNormals();
    }
    o.geometry = ng;
    o.userData.kfbSoftened = true;
    if (o.material && 'flatShading' in o.material) {
      o.material.flatShading = false;
      o.material.needsUpdate = true;
    }
    touched.push(o.name || o.type);
  });
  return { meshes: touched.length, inflateM: +amount.toFixed(4), names: touched.slice(0, 8) };
}

export function unsoftenDonor(root) {
  let n = 0;
  root.traverse(o => {
    if (o.isMesh && o.userData.kfbOriginalGeometry) {
      o.geometry = o.userData.kfbOriginalGeometry;
      delete o.userData.kfbOriginalGeometry;
      o.userData.kfbSoftened = false;
      n++;
    }
  });
  return n;
}

// Gleiche Positionen zu einem Vertex zusammenfassen. Ohne das teilen sich die
// Flaechen eines exportierten Wuerfels keinen Vertex und computeVertexNormals
// liefert wieder exakt die harten Kanten.
//
// GEMESSENE URSACHE fuer Georgs "die Fenster verschwinden": die KayKit-Autos
// sind EIN Netz mit EINEM Material — keine Material-Gruppen, keine Glas-Netze.
// Ihre Farben kommen allein aus einem Textur-Atlas (citybits_texture.png), also
// aus den UVs. Wer nur nach POSITION zusammenfasst, klebt an jeder Atlas-Naht
// zwei verschiedene UVs aufeinander: die Scheiben waren nie weg, sie waren
// lackiert. Der Schluessel traegt deshalb die UV mit — an Atlas-Nahten bleiben
// die Vertices getrennt und die Kante hart, und das ist richtig so: eine
// Atlas-Naht IST eine Materialkante.
function mergeByPosition(THREE, geo, tol = 1e-4) {
  const src = geo.index ? geo.toNonIndexed() : geo;
  const pos = src.attributes.position;
  const uv = src.attributes.uv;
  const map = new Map(), pts = [], uvs = [], idx = [];
  const q = v => Math.round(v / tol);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    let key = q(x) + ',' + q(y) + ',' + q(z);
    if (uv) key += '|' + q(uv.getX(i)) + ',' + q(uv.getY(i));
    let at = map.get(key);
    if (at === undefined) {
      at = pts.length / 3; map.set(key, at); pts.push(x, y, z);
      if (uv) uvs.push(uv.getX(i), uv.getY(i));
    }
    idx.push(at);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  // Material-Gruppen uebernehmen, falls ein Spender doch welche hat — die
  // Dreiecksreihenfolge bleibt hier unveraendert.
  for (const gr of (src.groups || [])) g.addGroup(gr.start, gr.count, gr.materialIndex);
  return g;
}
