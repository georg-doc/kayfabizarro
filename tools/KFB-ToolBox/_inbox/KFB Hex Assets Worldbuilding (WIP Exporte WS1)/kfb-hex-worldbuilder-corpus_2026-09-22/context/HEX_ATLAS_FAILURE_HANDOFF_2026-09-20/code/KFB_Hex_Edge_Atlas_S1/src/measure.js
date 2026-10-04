/* BT1 · Die Kantenkunde. Sechs Kanten je Kachel, gemessen aus der GEOMETRIE.

   WARUM ÜBERHAUPT NOCH EINE MESSUNG
   `hexrealm/lib/hex-grid.js` hat die Tabelle `TILE_EDGES` — aber nur für das Hexagon-Pack
   (32 Kacheln). Die 128 Hex-Kacheln des Builder Packs sind ungedeckt. Ohne ihre Kanten ist
   jede Rotation ein Wurf, und genau das war im Bild zu sehen: Strände, die landeinwärts
   zeigen.

   WARUM NICHT DIE ALTEN VERFAHREN
   hex-grid.js dokumentiert zwei gescheiterte Anläufe, beide werden hier NICHT wiederholt:
     1 · UV-Sampling je Deckfläche      → hex_grass kam mit sechs »Wasser«-Kanten zurück.
     2 · Draufsicht rendern, Pixel lesen → in z gespiegelt; nur symmetrische Kacheln überlebten.
   Der dritte Anlauf dort war Geometrie im Objektraum, ohne Kamera. Genau der wird hier
   verallgemeinert: kein Rendern, keine Bildschirmachsen, keine Kamera in der Messkette.
   Gerendert wird ausschließlich für den BLICK (Kontaktbogen), nie für eine Zahl.

   WARUM GEEICHT STATT GEGLAUBT
   Das Verfahren wird zuerst gegen `TILE_EDGES` gefahren. Trifft es die 32 bekannten Kacheln
   nicht, ist es kaputt und darf das Builder-Pack nicht anfassen — dann steht das als FAIL da.
   Eine Messung, die niemand gegen eine bekannte Wahrheit gehalten hat, ist eine Behauptung. */
import * as THREE from 'three';
import { hexMetrics, TILE_EDGES } from '../../hexrealm/lib/hex-grid.js';

/* ── Die sechs Kantenrichtungen ─────────────────────────────────────────────────────────
   ABGELEITET aus `hexToWorld`, nicht getippt: Richtung d ist der halbe Vektor zur Zellmitte
   des Nachbarn d. Für pointy-top / odd-r ergibt das exakt d·60° — E, SE, SW, W, NW, NE in
   DIRS-Reihenfolge, also dieselbe Indizierung wie jede Maske im Projekt. */
export function edgeGeometry(m) {
  const dirs = [];
  for (let d = 0; d < 6; d++) {
    const a = (d * Math.PI) / 3;
    dirs.push({ d, angle: a, deg: d * 60, x: Math.cos(a) * m.inradius, z: Math.sin(a) * m.inradius });
  }
  return dirs;
}

/* ── Atlas-Sonde ────────────────────────────────────────────────────────────────────────
   Alle Kacheln teilen sich EINE Atlas-Textur. Die Farbe eines Dreiecks steht also in der
   Textur, nicht im Material. `flipY` wird gelesen, nicht angenommen: GLTFLoader setzt es auf
   false, three sonst auf true — wer das verwechselt, liest das Bild auf dem Kopf. */
export function atlasProbe(texture) {
  const img = texture?.image;
  if (!img || !img.width) return null;
  const w = Math.min(img.width, 1024), h = Math.min(img.height, 1024);
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const flip = texture.flipY !== false;
  return {
    w, h, flipY: flip,
    at(u, v) {
      let uu = u - Math.floor(u), vv = v - Math.floor(v);
      const px = Math.min(w - 1, Math.max(0, Math.floor(uu * w)));
      const row = flip ? 1 - vv : vv;
      const py = Math.min(h - 1, Math.max(0, Math.floor(row * h)));
      const i = (py * w + px) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    },
  };
}

/* ── Dreiecksernte ──────────────────────────────────────────────────────────────────────
   Jedes Dreieck der Kachel mit Schwerpunkt, Fläche, Normale und Atlasfarbe — im Objektraum
   der Kachel, Weltmatrizen eingerechnet. Keine Kamera, keine Projektion.

   DIE SONDE KOMMT JE MATERIAL, NICHT EINMAL FÜR ALLES. Die erste Fassung nahm die ERSTE
   Textur, die auftauchte, und maß alle Kacheln dagegen. Die beiden Packs haben aber
   VERSCHIEDENE Atlanten: die UVs der Builder-Kacheln zeigten damit auf willkürliche Stellen
   des Hexagon-Atlas. Deshalb traf das Hexagon-Pack 99,5 % und das Builder-Pack Unsinn —
   `hex_forest` kam als sechs WASSERkanten zurück, während die Kachel sattgrün im Bild stand.
   Eine Messung gegen die falsche Nachschlagetabelle ist keine Messung. */
export function harvestTriangles(scene, probeFor) {
  scene.updateMatrixWorld(true);
  const tris = [];
  const pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), nrm = new THREE.Vector3();

  scene.traverse((o) => {
    if (!o.isMesh || !o.geometry?.attributes?.position) return;
    const geo = o.geometry;
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    const idx = geo.index;
    const n = idx ? idx.count : pos.count;
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    const flat = mat?.color ? [mat.color.r * 255, mat.color.g * 255, mat.color.b * 255] : [128, 128, 128];
    const probe = probeFor ? probeFor(mat) : null;

    for (let i = 0; i < n; i += 3) {
      const a = idx ? idx.getX(i) : i, b = idx ? idx.getX(i + 1) : i + 1, c = idx ? idx.getX(i + 2) : i + 2;
      pA.fromBufferAttribute(pos, a).applyMatrix4(o.matrixWorld);
      pB.fromBufferAttribute(pos, b).applyMatrix4(o.matrixWorld);
      pC.fromBufferAttribute(pos, c).applyMatrix4(o.matrixWorld);
      ab.subVectors(pB, pA); ac.subVectors(pC, pA);
      nrm.crossVectors(ab, ac);
      const area = nrm.length() / 2;
      if (area < 1e-7) continue;
      nrm.normalize();
      let col = flat;
      if (uv && probe) {
        const u = (uv.getX(a) + uv.getX(b) + uv.getX(c)) / 3;
        const v = (uv.getY(a) + uv.getY(b) + uv.getY(c)) / 3;
        col = probe.at(u, v);
      }
      tris.push({
        ax: pA.x, az: pA.z, bx: pB.x, bz: pB.z, cx: pC.x, cz: pC.z,
        y: (pA.y + pB.y + pC.y) / 3, ny: nrm.y, area, col,
      });
    }
  });
  return tris;
}

/* ── Fugenprobe ─────────────────────────────────────────────────────────────────────────
   ZWEI FASSUNGEN VORHER, BEIDE ÜBER NÄHE, BEIDE ZU UNGENAU:
     1 · 60°-Tortenstück, äußerer Ring   → 75,3 % — maß das halbe Kachelinnere mit.
     2 · Fenster um den Kantenmittelpunkt → 89,4 % — aber `hex_water` kam als `w?w?w?`:
         getestet wurde der SCHWERPUNKT jedes Dreiecks, und das Pack baut Deckflächen aus
         vier großen Dreiecken. Deren Schwerpunkte liegen in der Kachelmitte, an der Fuge
         liegt keiner. Eine Nähe-Heuristik kann die Tesselierung nicht wegrechnen.

   JETZT EINE ÜBERDECKUNGSPROBE: an fünf Punkten entlang jeder Fuge wird gefragt, WELCHE
   Fläche dort liegt — das oberste nach oben zeigende Dreieck, das den Punkt in x/z
   überdeckt. Das ist unabhängig davon, wie fein oder grob das Modell gebaut ist.

   Die Proben liegen bei 0,92 · Inkreis (sicher auf der Kachel, nicht auf der Fuge selbst)
   und fächern entlang der Kante auf. Mehrheit entscheidet; wie einig sie war, steht dabei. */
const inTri = (px, pz, t) => {
  const d1 = (px - t.bx) * (t.az - t.bz) - (t.ax - t.bx) * (pz - t.bz);
  const d2 = (px - t.cx) * (t.bz - t.cz) - (t.bx - t.cx) * (pz - t.cz);
  const d3 = (px - t.ax) * (t.cz - t.az) - (t.cx - t.ax) * (pz - t.az);
  return !(((d1 < 0) || (d2 < 0) || (d3 < 0)) && ((d1 > 0) || (d2 > 0) || (d3 > 0)));
};

export function sectorProfile(tris, m, opts = {}) {
  const UP = opts.up ?? 0.6;
  const DEEP = opts.deep ?? -0.05;
  const AT = (opts.at ?? 0.92) * m.inradius;
  const SPREAD = opts.spread ?? [-0.32, -0.16, 0, 0.16, 0.32];
  const up = tris.filter((t) => t.ny >= UP);
  const out = [];

  for (let d = 0; d < 6; d++) {
    const a = (d * Math.PI) / 3;
    const nx = Math.cos(a), nz = Math.sin(a);
    const px0 = nx * AT, pz0 = nz * AT;
    const tx = -nz * m.circumradius, tz = nx * m.circumradius;   // entlang der Kante
    let wet = 0, dry = 0, r = 0, g = 0, b = 0, hits = 0, low = 0;

    for (const s of SPREAD) {
      const px = px0 + tx * s, pz = pz0 + tz * s;
      let top = null;
      for (const t of up) if (inTri(px, pz, t) && (!top || t.y > top.y)) top = t;
      if (!top) continue;
      hits++;
      r += top.col[0]; g += top.col[1]; b += top.col[2];
      if (top.y < DEEP) { wet++; if (top.y < low) low = top.y; } else dry++;
    }
    out.push({
      d,
      col: hits ? [r / hits, g / hits, b / hits] : null,
      wet: hits ? +(wet / hits).toFixed(3) : 0,
      low: +low.toFixed(3),
      hits, probes: SPREAD.length,
    });
  }
  return out;
}

/* ── Farbgruppen AUS DEM BESTAND ────────────────────────────────────────────────────────
   Die Lehre aus `deriveRockClasses`: eine Schwelle, die den Bestand nicht kennt, kann ihn
   nicht teilen. Hier also kein »grün ist Wiese, gelb ist Sand« — die Sektorfarben aller
   Kacheln werden agglomerativ gruppiert, und die Verschmelzungsgrenze kommt aus der
   Verteilung der Nachbarabstände selbst. Wie viele Gruppen herauskommen, kommt heraus. */
export function deriveColorGroups(samples, opts = {}) {
  const pts = samples.filter((s) => s.col);
  if (!pts.length) return { groups: [], cut: 0 };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  /* Startpunkt: jede Farbe ihr eigener Klumpen, auf ein grobes Raster gerundet, damit aus
     zehntausend Dreiecken eine handhabbare Menge wird. */
  const bins = new Map();
  for (const s of pts) {
    const k = s.col.map((c) => Math.round(c / 12)).join(',');
    if (!bins.has(k)) bins.set(k, { col: [0, 0, 0], n: 0, members: [] });
    const b = bins.get(k);
    b.col[0] += s.col[0]; b.col[1] += s.col[1]; b.col[2] += s.col[2];
    b.n++; b.members.push(s);
  }
  let cl = [...bins.values()].map((b) => ({ col: b.col.map((c) => c / b.n), n: b.n, members: b.members }));

  /* Verschmelzungsgrenze aus der Verteilung: Median der Abstände zum nächsten Nachbarn,
     mal dem Faktor, der die echten Lücken stehen lässt. */
  const nn = cl.map((a) => Math.min(...cl.filter((b) => b !== a).map((b) => dist(a.col, b.col)), Infinity))
               .filter((v) => isFinite(v)).sort((a, b) => a - b);
  const cut = (nn.length ? nn[nn.length >> 1] : 20) * (opts.factor ?? 2.6);

  let merged = true;
  while (merged && cl.length > 1) {
    merged = false;
    let best = null;
    for (let i = 0; i < cl.length; i++) {
      for (let j = i + 1; j < cl.length; j++) {
        const dd = dist(cl[i].col, cl[j].col);
        if (dd < cut && (!best || dd < best.d)) best = { i, j, d: dd };
      }
    }
    if (best) {
      const a = cl[best.i], b = cl[best.j];
      const n = a.n + b.n;
      cl[best.i] = { col: a.col.map((c, k) => (c * a.n + b.col[k] * b.n) / n), n, members: a.members.concat(b.members) };
      cl.splice(best.j, 1);
      merged = true;
    }
  }
  cl.sort((a, b) => b.n - a.n);
  return { groups: cl.map((c, i) => ({ id: i, col: c.col.map((v) => Math.round(v)), n: c.n, members: c.members })), cut: +cut.toFixed(1) };
}

/* ── Eichung ────────────────────────────────────────────────────────────────────────────
   Die Farbgruppen bekommen ihre BEDEUTUNG aus `TILE_EDGES`, nicht aus meinem Kopf: für jede
   Gruppe wird ausgezählt, welche Klasse (g/s/w) die bekannte Tabelle an diesen Kanten führt.
   Die Mehrheit gewinnt, und wie eindeutig sie ist, steht daneben. Eine Gruppe, die in der
   bekannten Menge gar nicht vorkommt, ist eine NEUE Klasse des Builder-Packs und bekommt
   keinen erfundenen Namen, sondern ihre Gruppennummer. */
/* Name aus dem Bestand — reine LESBARKEIT, keine Semantik.
   Eine Gruppe, die nur im Builder-Pack vorkommt, kann `TILE_EDGES` nicht benennen: die
   Tabelle kennt dieses Pack nicht. Sie ist deshalb kein Fehler, sondern eine eigene
   Geländeklasse. Damit man im Bericht sieht, WELCHE, wird das häufigste Namenstoken ihrer
   Proben angezeigt (`hex_forest`, `hex_forest_detail` → »forest«). Für die Kompatibilität
   zählt trotzdem nur die Gruppen-ID — ein Name, den ich aus Dateinamen rate, darf keine
   Bauentscheidung tragen. */
function stockName(members) {
  const t = new Map();
  for (const m of members) {
    const k = (m.base.split('_')[1] || m.base).toLowerCase().replace(/[0-9]+$/, '');
    t.set(k, (t.get(k) || 0) + 1);
  }
  const top = [...t.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

export function calibrate(groups, edgeIndex) {
  const out = [];
  for (const g of groups) {
    const tally = { g: 0, s: 0, w: 0 };
    let known = 0;
    for (const mem of g.members) {
      const truth = edgeIndex.get(mem.base);
      if (!truth) continue;
      tally[truth[mem.d]] = (tally[truth[mem.d]] || 0) + 1;
      known++;
    }
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    out.push({
      ...g,
      known,
      kind: known >= 3 && top[1] / known >= 0.6 ? top[0] : null,
      purity: known ? +(top[1] / known).toFixed(2) : null,
      name: stockName(g.members),
      tally,
    });
  }
  return out;
}

/* Zwei Regeln, und das Werkzeug entscheidet nicht heimlich, welche gilt.

   A · GEOMETRIE SCHLÄGT FARBE — liegt die Fuge unter der Deckhöhe, ist sie Wasser.
   B · NUR FARBE — die Gruppe der Probe entscheidet.

   Regel A traf 94,4 % und lag bei GENAU EINER Sorte daneben: den fünf Uferkacheln, wo
   `sssggg` als `wwwggg` zurückkam. Ein Strand fällt zum Wasser hin ab, die Höhe allein
   trennt ihn nicht vom See. Statt eine vierte Schwelle zu erfinden, fahren beide Regeln
   durch dieselbe Eichung und beide Quoten stehen im Bericht.

   ZWEI AUSGABEN, WEIL ES ZWEI FRAGEN SIND:
     `kinds`    sechs Zeichen aus dem Alphabet der bekannten Tabelle (g/s/w/?) — nur damit
                lässt sich gegen `TILE_EDGES` prüfen. Feste Länge: die erste Fassung gab
                für eine unzuordenbare Farbe `'x'+id` zurück, `hex_water` kam als `wx20wx`
                heraus — vier statt sechs Kanten, und jeder Vergleich verrutschte.
     `classes`  die Klasse, die für NACHBARSCHAFT zählt. Das Builder-Pack bringt eigene
                Geländeklassen mit, die das Hexagon-Alphabet per Konstruktion nicht benennen
                kann. Sie bekommen ihre Gruppen-ID (`#7`) statt eines erfundenen Buchstabens.
                »Passt A an B« heißt ohnehin nur »gleiche Klasse beiderseits der Fuge« —
                das beantwortet eine ID genauso gut wie ein Buchstabe, und sie lügt nicht. */
export function classifyEdges(profile, resolve, opts = {}) {
  const WET = opts.wet ?? 0.35;
  const kinds = [], classes = [];
  for (const s of profile) {
    if (WET <= 1 && s.wet >= WET) { kinds.push('w'); classes.push('w'); continue; }
    const r = s.col ? resolve(s) : null;
    kinds.push(r && r.letter ? r.letter : '?');
    classes.push(r ? r.cls : null);
  }
  return { kinds: kinds.join(''), classes };
}

/* Der Prüfbericht: gemessen gegen bekannt, Kachel für Kachel, Kante für Kante. */
export function verify(measured) {
  const rows = [];
  let hitE = 0, allE = 0, hitT = 0, allT = 0;
  for (const rec of measured) {
    const truth = TILE_EDGES[rec.base];
    if (!truth) continue;
    let hit = 0;
    for (let d = 0; d < 6; d++) if (rec.kinds[d] === truth[d]) hit++;
    hitE += hit; allE += 6; allT++;
    if (hit === 6) hitT++;
    rows.push({ base: rec.base, truth, got: rec.kinds, hit, ok: hit === 6 });
  }
  rows.sort((a, b) => a.hit - b.hit || a.base.localeCompare(b.base));
  return { rows, edges: allE ? +(hitE / allE).toFixed(3) : null, tiles: allT ? +(hitT / allT).toFixed(3) : null,
           tileCount: allT, edgeCount: allE };
}

export { hexMetrics, TILE_EDGES };
