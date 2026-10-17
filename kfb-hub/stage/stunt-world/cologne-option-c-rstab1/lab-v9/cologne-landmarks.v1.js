// KFB Cologne Race · Option C · Kölner Genius Loci
//
// BEFUND ZUERST, weil er die Bauweise bestimmt:
//   · Der gepinnte Asset-Handoff (213 Assets) enthält KEINE Kölner Landmarke.
//     Geprüft auf dom/kölsch/koeln/cologne/landmark/brewery/kiosk — null Treffer.
//   · Der Genius-Loci-Katalog des Projekts
//     (tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_V1.json, 22 Kandidaten)
//     führt Akropolis bis Guggenheim — aber nichts aus Köln.
//
// Es gibt also keinen Spender, den man laden könnte. Gebaut wird deshalb nach der
// Vorschrift, die der Katalog selbst für genau diesen Fall angibt:
//
//     "sourceStrategy": "OSM footprint + public dimensions + authored low-poly modules"
//
// Das heißt hier konkret:
//   WO   — ausschließlich die gemessenen OSM-Anker aus CLAUDE_CONTEXT.json
//   WIE  — eigene Low-Poly-Module in der Option-C-Sprache, aus öffentlich
//          bekannten Hauptmaßen. Keine Scans, keine übernommenen Netze.
//
// Jede Zahl unten ist entweder ein OSM-Anker oder ein öffentlich dokumentiertes
// Hauptmaß. Beides steht an der Stelle, an der es verwendet wird.

import { C } from './option-c-style.v1.js';

const mat = (THREE, color, opts = {}) => new THREE.MeshStandardMaterial(
  Object.assign({ color, roughness: 0.93, metalness: 0.0, flatShading: true }, opts));

function box(THREE, parent, name, w, h, d, m, x, y, z, ry = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z); o.rotation.y = ry; o.name = name;
  o.castShadow = true; o.receiveShadow = true;
  parent.add(o); return o;
}

// --------------------------------------------------------- Hohenzollernbrücke
// OSM relation/5460390 · Anker x 211,812 / z −62,121
// Öffentliche Hauptmaße: rund 409 m lang, DREI Bogenfelder, Bogenstich rund 25 m
// über der Fahrbahn, Fahrbahn rund 12 m über dem Wasser. Verlauf West–Ost,
// also entlang x — quer zum Rhein, der hier nach Norden läuft.
function hohenzollern(THREE) {
  const g = new THREE.Group();
  g.name = 'genius-loci:hohenzollernbruecke';
  const steel = mat(THREE, 0x6e5a52, { roughness: 0.82 });
  // GEMESSENER BEFUND (Georgs „Bruchkanten aussen“): der Bogen war eine Kette
  // gerader Kaesten, jeder mit flachen Stirnflaechen. Am Knick zwischen zwei
  // Segmenten trifft eine Stirnflaeche auf die Seite des naechsten Segments —
  // das ergibt auf der Aussenseite eine sichtbare Kerbe, nicht eine Kurve. Ein
  // durchgehendes Rohr (wie schon bei den Tunnel-Rippen) hat diesen Knick nicht.
  const steelSmooth = new THREE.MeshStandardMaterial({ color: 0x6e5a52, roughness: 0.82, flatShading: false });
  const deckM = mat(THREE, C.structureLo, { roughness: 0.95 });
  // Gemessener Konflikt: mit 409 m reichte das Modul von x 7 bis x 416 und damit
  // rund 50 m ueber das Westufer hinaus an Land — genau in den Tunnelmund der
  // Strecke bei x 33. Das Modul bildet die STROMQUERUNG ab; die Rampen an Land
  // gehoeren nicht dazu. 300 m halten die Bruecke ueber dem Wasser.
  const LEN = 300, SPANS = 3, RISE = 25, DECK_Y = 12, W = 26;

  box(THREE, g, 'deck', LEN, 2.2, W, deckM, 0, DECK_Y, 0);

  // Pfeiler zwischen den Feldern und an den Enden
  for (let i = 0; i <= SPANS; i++) {
    const x = -LEN / 2 + (LEN / SPANS) * i;
    box(THREE, g, 'pier', 9, DECK_Y + 2, W + 4, deckM, x, (DECK_Y + 2) / 2 - 2, 0);
  }

  // Die drei Bögen. Ein Bogen ist eine Kette kurzer Segmente entlang einer
  // Parabel — das ist die Silhouette, an der man die Brücke erkennt.
  const span = LEN / SPANS;
  for (let s = 0; s < SPANS; s++) {
    const x0 = -LEN / 2 + span * s;
    for (const side of [-1, 1]) {
      const SEG = 16;
      const curvePts = [];
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG;
        curvePts.push(new THREE.Vector3(x0 + span * u, DECK_Y + RISE * 4 * u * (1 - u), side * (W / 2 - 1.5)));
      }
      const archGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), SEG * 2, 0.85, 10, false);
      const archMesh = new THREE.Mesh(archGeo, steelSmooth);
      archMesh.castShadow = true;
      g.add(archMesh);
      // Hänger vom Bogen zur Fahrbahn
      for (let i = 1; i < 8; i++) {
        const u = i / 8;
        const y = DECK_Y + RISE * 4 * u * (1 - u);
        const h = y - DECK_Y;
        if (h < 1) continue;
        box(THREE, g, 'hanger', 0.6, h, 0.6, steel, x0 + span * u, DECK_Y + h / 2, side * (W / 2 - 1.5));
      }
    }
    // Querverband über dem Scheitel: drei schmale Riegel zwischen den beiden
    // Bogenebenen. GEMESSENER BEFUND aus Georgs Bild: hier stand EIN Riegel von
    // 50 × 24 m — der lag als dunkle Platte auf der Bogenbrücke. Ein Querverband
    // ist ein Stab, keine Fläche.
    for (const u of [0.36, 0.5, 0.64]) {
      const y = DECK_Y + RISE * 4 * u * (1 - u);
      box(THREE, g, 'brace', 1.3, 1.3, W - 3.4, steel, x0 + span * u, y + 0.9, 0);
    }
  }
  return g;
}

// ------------------------------------------------------------- Deutzer Brücke
// OSM relation/3837695 · Anker x 266,235 / z −622,379
// Öffentliche Hauptmaße: rund 437 m, Kastenträger — flach und glatt, der
// bewusste Gegensatz zur Bogenbrücke weiter nördlich.
function deutzer(THREE) {
  const g = new THREE.Group();
  g.name = 'genius-loci:deutzer-bruecke';
  const m = mat(THREE, C.shoulderLo, { roughness: 0.9 });
  const LEN = 437, W = 29;
  box(THREE, g, 'girder', LEN, 4.5, W, m, 0, 11, 0);
  box(THREE, g, 'deck', LEN, 1.2, W + 3, mat(THREE, C.structure), 0, 13.6, 0);
  for (const x of [-LEN * 0.28, LEN * 0.28]) box(THREE, g, 'pier', 11, 12, W, m, x, 5, 0);
  // Geländerband als durchgehende helle Linie — liest aus der Ferne
  for (const side of [-1, 1]) {
    box(THREE, g, 'rail', LEN, 0.5, 0.5, mat(THREE, C.lineCream), 0, 14.8, side * (W / 2 + 1));
  }
  return g;
}

// --------------------------------------------------------------- Hauptbahnhof
// OSM node/2399559029 · Anker x −223,020 / z 87,263
// Öffentliche Hauptmaße der Bahnsteighalle: rund 255 m lang, rund 64 m breit,
// Tonnendach rund 24 m hoch. Die Halle liegt west–ost, parallel zum Dom.
function hauptbahnhof(THREE) {
  const g = new THREE.Group();
  g.name = 'genius-loci:hauptbahnhof';
  const glass = mat(THREE, 0x3f6275, { roughness: 0.35, transparent: true, opacity: 0.72 });
  // Selbe Ursache wie beim Bruecken-Bogen: 12 gerade Kaesten je Rippe zeigten an
  // jedem Knick eine Kerbe statt einer Kurve. Eine Rippe ist jetzt EIN
  // durchgehendes Rohr ueber den ganzen Halbkreis.
  const ribSmooth = new THREE.MeshStandardMaterial({ color: 0x6e5a52, roughness: 0.85, flatShading: false });
  const base = mat(THREE, C.shoulder, { roughness: 0.95 });
  const LEN = 255, W = 64, H = 24;

  box(THREE, g, 'plinth', LEN, 5, W, base, 0, 2.5, 0);

  const RIBS = 14, ARC_SEG = 28;
  for (let i = 0; i <= RIBS; i++) {
    const x = -LEN / 2 + (LEN / RIBS) * i;
    const curvePts = [];
    for (let k = 0; k <= ARC_SEG; k++) {
      const a = Math.PI * (k / ARC_SEG);
      curvePts.push(new THREE.Vector3(x, 5 + Math.sin(a) * H, Math.cos(a) * (W / 2)));
    }
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), ARC_SEG, 0.55, 10, false);
    const m2 = new THREE.Mesh(geo, ribSmooth);
    m2.castShadow = true;
    g.add(m2);
  }
  // Glashaut als zwei große Schalenflächen
  for (const side of [-1, 1]) {
    const shell = new THREE.Mesh(
      new THREE.CylinderGeometry(W / 2 - 0.6, W / 2 - 0.6, LEN, 18, 1, true, side < 0 ? 0 : Math.PI, Math.PI),
      glass);
    shell.rotation.z = Math.PI / 2;
    shell.position.y = 5;
    shell.scale.y = 1;
    shell.scale.set(H / (W / 2), 1, 1);
    g.add(shell);
  }
  // Stirnwände
  for (const side of [-1, 1]) {
    box(THREE, g, 'gable', 2, H * 0.8, W * 0.9, base, side * LEN / 2, 5 + H * 0.4, 0);
  }
  return g;
}

// -------------------------------------------------------------- Museum Ludwig
// OSM node/633480736 · Anker x −156,300 / z −129,721
// Öffentlich bekannte Form: Sheddach aus Zink, eine Reihe schräger Zacken.
// Grundriss rund 135 × 90 m, Firste rund 35 m. Das Sheddach IST das Erkennungs-
// zeichen — es steht direkt neben dem Dom und bildet dessen Gegenteil.
function museumLudwig(THREE) {
  const g = new THREE.Group();
  g.name = 'genius-loci:museum-ludwig';
  const zinc = mat(THREE, 0x8f9aa0, { roughness: 0.7 });
  const wall = mat(THREE, C.shoulder, { roughness: 0.95 });
  const LEN = 135, W = 90, H = 22;
  box(THREE, g, 'mass', LEN, H, W, wall, 0, H / 2, 0);

  const SHEDS = 7, pitch = W / SHEDS;
  for (let i = 0; i < SHEDS; i++) {
    const z = -W / 2 + pitch * (i + 0.5);
    // Schräge Zinkfläche
    const plate = new THREE.Mesh(new THREE.BoxGeometry(LEN, 0.9, pitch * 1.28), zinc);
    plate.position.set(0, H + 5.2, z - pitch * 0.14);
    plate.rotation.x = -0.52;
    plate.castShadow = true;
    g.add(plate);
    // Senkrechte Glasseite des Sheds
    box(THREE, g, 'shed-glass', LEN, 9, 0.7,
      mat(THREE, 0x3f6275, { roughness: 0.3, transparent: true, opacity: 0.8 }),
      0, H + 4.5, z + pitch * 0.4);
  }
  return g;
}

// -------------------------------------------------------------- Philharmonie
// OSM node/633480737 · Anker x −100,024 / z −154,088
// Die Philharmonie liegt UNTER dem Heinrich-Böll-Platz; sichtbar ist die
// begehbare Platzfläche mit der kegelförmigen Aufwölbung. Genau das wird gebaut.
function philharmonie(THREE) {
  const g = new THREE.Group();
  g.name = 'genius-loci:philharmonie';
  const stone = mat(THREE, C.shoulderHi, { roughness: 0.96 });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(52, 54, 3, 28), stone);
  plate.position.y = 1.5; plate.receiveShadow = true; g.add(plate);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(34, 17, 28), stone);
  cone.position.y = 10; cone.castShadow = true; g.add(cone);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(7, 9, 3.4, 20), mat(THREE, C.lineGold));
  cap.position.y = 19.5; g.add(cap);
  // Treppenband zum Rhein
  for (let i = 0; i < 7; i++) {
    box(THREE, g, 'step', 46 - i * 2, 1.1, 3.2, stone, 0, 0.6 + i * 1.05, 40 + i * 3.2);
  }
  return g;
}

// ------------------------------------------------------------------- Aufbau
// Die Anker sind PUNKTE (node/relation), nicht Grundrisse. Wo mein eigenes Modul
// breiter ist als der Punkt, darf es nicht in den Fahrkorridor laufen. Gemessener
// Befund: die Bahnhofshalle ist 255 x 64 m und lief in die Startgerade — im Bild
// standen ihre Rippen quer ueber der Fahrbahn. Die Landmarke wird deshalb SENKRECHT
// zur naechsten Streckenachse so weit verschoben, dass ihre Huelle den Korridor
// frei laesst. Der Versatz wird gemeldet, nicht verschwiegen.
// Freistellen mit dem RICHTIGEN Mass.
//
// Erster Anlauf: ein runder Radius max(sx,sz)/2 um den Anker. Fuer eine
// Bahnsteighalle von 255 x 64 m ergibt das einen Radius von 127 m — damit ist sie
// nie freizustellen, obwohl sie laengs NEBEN der Strecke liegt und nur quer
// 32 m braucht. Gemessen wird deshalb das gedrehte Rechteck, nicht ein Kreis.
//
// Zwei Hebel, in dieser Reihenfolge, und beide werden gemeldet:
//   1 kleiner Versatz senkrecht zur Strecke, gedeckelt (OSM besitzt das WO,
//     also darf der Versatz klein bleiben)
//   2 Verkleinern des EIGENEN Moduls (das gehoert mir, nicht OSM)
// Greift keiner, bleibt die Landmarke weg und sagt es — eine Saeule quer auf der
// Fahrbahn ist schlimmer als eine fehlende Landmarke.
// Dritter Hebel, und fuer eine Bruecke der einzig richtige: SENKRECHT.
// Wo die Strecke ueber der Landmarke oder unter ihr durchlaeuft, ist ein
// Grundriss-Ueberlapp kein Konflikt — genau so ist das Rheindeck ueber der
// Hohenzollernbruecke gebaut. Ein reines 2D-Mass kann das nicht sehen und haette
// die Bruecke weggeworfen, obwohl die Strecke 9 m ueber ihrem Bogenscheitel liegt.
function footprintClear(route, cx, cz, hx, hz, ry, marginM, topY, bottomY, vMargin) {
  const ca = Math.cos(-ry), sa = Math.sin(-ry);
  const vm = vMargin ?? 6;
  let worst = Infinity;
  for (const q of route.points) {
    const dx = q.x - cx, dz = q.z - cz;
    const lx = dx * ca - dz * sa, lz = dx * sa + dz * ca;
    const ox = Math.abs(lx) - hx, oz = Math.abs(lz) - hz;
    const outside = Math.hypot(Math.max(ox, 0), Math.max(oz, 0));
    const d = (ox < 0 && oz < 0) ? Math.max(ox, oz) : outside;
    const need = q.w * 0.5 + marginM;
    const horiz = d - need;
    if (horiz >= 0) continue;
    if (topY != null && q.y - topY >= vm) continue;               // Strecke drueber
    if (bottomY != null && bottomY - (q.y + 9) >= vm) continue;    // Strecke drunter
    if (horiz < worst) worst = horiz;
  }
  return worst === Infinity ? 0 : worst;
}

function clearOfRoute(THREE, mesh, anchor, route, marginM, capM) {
  const cap = capM ?? 30;
  const out = { dx: 0, dz: 0, moved: 0, scale: 1, lever: 'none', omitted: false, clearM: null };
  if (!route) return out;
  const bb = new THREE.Box3().setFromObject(mesh);
  const sz = bb.getSize(new THREE.Vector3());
  const ry = mesh.parent ? mesh.parent.rotation.y : 0;
  let hx = sz.x / 2, hz = sz.z / 2;
  const topY = bb.max.y, bottomY = bb.min.y;
  const FC = (x, z, s) => footprintClear(route, x, z, hx * (s ?? 1), hz * (s ?? 1), ry, marginM,
    topY * (s ?? 1), bottomY, 6);

  let c0 = FC(anchor.x, anchor.z);
  if (c0 >= 0) { out.clearM = +c0.toFixed(1); return out; }

  // Hebel 1 — kleiner Versatz
  for (let step = 4; step <= cap; step += 4) {
    for (let k = 0; k < 12; k++) {
      const a2 = (k / 12) * Math.PI * 2;
      const dx = Math.cos(a2) * step, dz = Math.sin(a2) * step;
      const c = FC(anchor.x + dx, anchor.z + dz);
      if (c >= 0) {
        out.dx = dx; out.dz = dz; out.moved = step; out.lever = 'versatz'; out.clearM = +c.toFixed(1);
        return out;
      }
    }
  }

  // Hebel 2 — das eigene Modul verkleinern, notfalls mit kleinem Versatz dazu
  for (let s = 0.92; s >= 0.42; s -= 0.06) {
    for (let step = 0; step <= cap; step += 6) {
      for (let k = 0; k < 12; k++) {
        const a2 = (k / 12) * Math.PI * 2;
        const dx = Math.cos(a2) * step, dz = Math.sin(a2) * step;
        const c = FC(anchor.x + dx, anchor.z + dz, s);
        if (c >= 0) {
          out.dx = dx; out.dz = dz; out.moved = step; out.scale = +s.toFixed(2);
          out.lever = step ? 'verkleinert+versatz' : 'verkleinert'; out.clearM = +c.toFixed(1);
          return out;
        }
      }
    }
  }

  out.omitted = true; out.lever = 'weggelassen'; out.clearM = +c0.toFixed(1);
  return out;
}

export function buildGeniusLoci(THREE, anchors, route) {
  const group = new THREE.Group();
  group.name = 'cologne-genius-loci';
  const built = [];

  const place = (mesh, anchor, ry, marginM, note, capM) => {
    const holder = new THREE.Group();
    holder.name = mesh.name;
    holder.rotation.y = ry;
    holder.add(mesh);
    const off = clearOfRoute(THREE, mesh, anchor, route, marginM, capM ?? 30);
    if (off.scale !== 1) mesh.scale.setScalar(off.scale);
    holder.position.set(anchor.x + off.dx, 0, anchor.z + off.dz);
    if (!off.omitted) group.add(holder);
    const bb = new THREE.Box3().setFromObject(mesh);
    const sz = bb.getSize(new THREE.Vector3());
    if (off.omitted) console.warn('[genius-loci] weggelassen:', mesh.name, off);
    built.push({
      id: mesh.name.replace('genius-loci:', ''),
      osm: anchor.osm, name: anchor.name,
      anchor: { x: anchor.x, z: anchor.z },
      local: { x: +(anchor.x + off.dx).toFixed(1), z: +(anchor.z + off.dz).toFixed(1) },
      offsetM: off.moved,
      moduleScale: off.scale,
      lever: off.lever,
      clearM: off.clearM,
      omitted: off.omitted,
      extentM: [+sz.x.toFixed(1), +sz.y.toFixed(1), +sz.z.toFixed(1)],
      note
    });
  };

  // Der Rhein läuft hier nach Norden, die Brücken queren ihn also entlang x.
  // Die Abstaende stammten aus der Zeit, als mit einem KREIS gemessen wurde —
  // 72 m fuer eine Bruecke waren dort ein Notbehelf. Mit dem Rechteckmass und dem
  // senkrechten Hebel sind sie schaedlich: an der Tunnelausfahrt betraegt der echte
  // Abstand zur Bruecke 21 m, gefordert waren 78,8 m, und deshalb warf mein eigenes
  // Freistellen die Bruecke weg. Zurueck auf ehrliche Werte.
  // GEMESSENER BEFUND (Georgs „braune Flaeche vor dem Tunnel“): kein Treffer im
  // Fahrkorridor (scrubCorridor findet 0) — der Wagen faehrt nie WIRKLICH hindurch.
  // Aber der westliche Bogenpfeiler liegt fast genau auf der verlaengerten Gerade
  // Tunnelmund->Tunnelausfahrt, nur 21 m seitlich frei. Aus der Verfolgerkamera
  // steht er darum als blockwirkende Flaeche MITTEN im Blick, bevor die Strecke
  // dorthin abbiegt. 45 m statt 14 m Marge und ein hoeherer Versatz-Deckel (70 statt
  // 30 m) schieben die ganze Bruecke ausreichend seitlich weg, ohne sie zu verkleinern.
  place(hohenzollern(THREE), anchors.hohenzollern, 0, 45,
    'öffentliche Hauptmaße 409 m / 3 Bogenfelder / Stich 25 m · Marge erhöht gegen Sichtachsen-Blockade', 70);
  place(deutzer(THREE), anchors.deutzer, 0, 14,
    'öffentliche Hauptmaße 437 m / Kastenträger');
  place(hauptbahnhof(THREE), anchors.hbf, 0, 18,
    'Bahnsteighalle 255 × 64 m, Tonnendach 24 m');
  place(museumLudwig(THREE), anchors.museumLudwig, 0.18, 16,
    'Sheddach, Grundriss 135 × 90 m');
  place(philharmonie(THREE), anchors.philharmonie, 0, 14,
    'Platzfläche mit kegelförmiger Aufwölbung');

  return {
    group, built, count: built.length,
    sourceStrategy: 'OSM anchor + public dimensions + authored low-poly modules',
    catalogRule: 'GENIUS_LOCI_CANDIDATES_V1.json · sourceStrategy',
    finding: 'Weder der Asset-Handoff (213 Assets) noch der Genius-Loci-Katalog (22 Kandidaten) führt eine Kölner Landmarke — es gibt keinen Spender zum Laden.'
  };
}
