/* Hex grid lab · KayKit Medieval Hexagon Pack
   Measured facts (runtime probe, tools/measure-hex.html):
   - every tile is 2.0 (x, flat-to-flat) × 2.309 (z, point-to-point) — a POINTY-TOP hexagon
     (top-face vertices sit at ±30°, ±90°, ±150°, circumradius 1.097)
   - the tile TOP sits at y = 0 and the body hangs below it, so anything standing on a tile
     goes to y = 0 — no snapping needed (unlike the KayKit city tiles, which are 0.10 high)
   - all tiles share ONE material (`hexagons_medieval`, a texture atlas), so the racing kit's
     "read the vertices of the material named road" trick does NOT work here. What IS measurable:
     render each tile TOP-DOWN and read the pixel at its six edge midpoints — see EDGE_MASKS
     below and tools/scan-hex-render.html. That yields a real 6-bit connection mask per tile.
   - the 13 road shapes turn out to be exactly the 13 non-empty edge subsets of a hexagon up to
     rotation, so the road set is COMPLETE: every hex network is buildable. Rivers ship 12 (no
     single-edge source), coast tiles carry a sand beach on some edges and water on others. */
import * as THREE from 'three';

export function hexMetrics(size) {
  const W = size[0];                 // flat-to-flat, along x
  const H = size[2];                 // point-to-point, along z
  return {
    W, H,
    colStep: W,                      // neighbour in +x is one full width away
    rowStep: H * 0.75,               // pointy-top rows overlap by a quarter height
    rowOffset: W / 2,                // odd rows shift half a width
    inradius: W / 2,
    circumradius: H / 2
  };
}

/* offset ("odd-r") coordinates -> world */
export function hexToWorld(col, row, m) {
  return [col * m.colStep + (row & 1 ? m.rowOffset : 0), 0, row * m.rowStep];
}

/* world -> offset ("odd-r"), die exakte Umkehrung von hexToWorld.
   Näherungen gibt es hier nicht mehr: ein Kreis um den Zellmittelpunkt kachelt nicht. Mit
   Radius = Inkreis bleiben die sechs Ecken unabgedeckt, mit Radius = Umkreis überlappen die
   Nachbarn — in beiden Fällen ist „auf welcher Kachel stehe ich" nicht beantwortbar. Der Weg
   über Axialkoordinaten und Würfelrundung ist dagegen eindeutig: er liefert für JEDEN Punkt der
   Ebene genau eine Zelle, lückenlos und überschneidungsfrei. */
export function worldToHex(x, z, m) {
  const rf = z / m.rowStep;
  const qf = x / m.colStep - rf / 2;
  /* Würfelrundung: die drei Achsen müssen sich zu null addieren; die mit dem größten
     Rundungsfehler wird aus den beiden anderen nachgezogen. */
  const yf = -qf - rf;
  let q = Math.round(qf), r = Math.round(rf), y = Math.round(yf);
  const dq = Math.abs(q - qf), dr = Math.abs(r - rf), dy = Math.abs(y - yf);
  if (dq > dr && dq > dy) q = -r - y;
  else if (dr > dy) r = -q - y;
  const row = r;
  const col = q + (row - (row & 1)) / 2;
  return [col, row];
}

/* the six edge directions of a pointy-top hex in odd-r offset coordinates, in the order
   E, SE, SW, W, NW, NE — index IS the bit position in a connection mask */
export const DIRS = [
  [[+1, 0], [0, +1], [-1, +1], [-1, 0], [-1, -1], [0, -1]],   // even rows
  [[+1, 0], [+1, +1], [0, +1], [-1, 0], [0, -1], [+1, -1]]    // odd rows
];
export function neighbor(col, row, dir) {
  const [dc, dr] = DIRS[row & 1][dir];
  return [col + dc, row + dr];
}

/* The first attempt at this read the PAINTED COLOUR out of the shared texture atlas through
   each top-face triangle's UVs. It is gone: the sampling proved unreliable (hex_grass came back
   with six "water" edges), and the replacement — rendering each tile top-down and reading the
   pixel — produced the clean table below. Keeping a second, wrong measurement around would just
   invite trusting it. Scanner: tools/scan-hex-render.html */

/* Bitzählung und Ringlauf — Grundrechenarten für alles Folgende, deshalb ganz vorn. */
export const popcount = (m) => { let n = 0; while (m) { n += m & 1; m >>>= 1; } return n; };
/* Ein Bitmuster ist ein zusammenhängender Lauf auf dem Sechseck-Ring (zyklisch). */
export function isRun(mask) {
  const n = popcount(mask);
  if (n === 0 || n === 6) return true;
  for (let s = 0; s < 6; s++) {
    let m = 0;
    for (let i = 0; i < n; i++) m |= 1 << ((s + i) % 6);
    if (m === mask) return true;
  }
  return false;
}

/* ---------- MENTALES MODELL DER KACHELN: EINE Tabelle, sechs Kanten, drei Klassen ----------

   Jede Kachel des Packs ist vollständig beschrieben durch die Klasse ihrer sechs Kanten in
   DIRS-Reihenfolge (0 O, 1 SO, 2 SW, 3 W, 4 NW, 5 NO):

     g  Wiese   · geschlossen, hier geht nichts weiter
     s  Sand    · Weg oder Strand — die Linie läuft über die Fuge zum Nachbarn
     w  Wasser  · Flussrinne oder offene See

   Daraus folgt alles andere: die Anschlussmaske ist die Bitmenge einer Klasse, die Drehung ist
   eine Rotation des Strings, und „passt Kachel A an Kachel B" heißt: gleiche Klasse auf beiden
   Seiten der Fuge. Deshalb steht hier nur diese eine Tabelle, und Masken werden ABGELEITET —
   zwei Tabellen wären zwei Wahrheiten.

   WIE SIE ZUSTANDE KAM — dritter Versuch, die ersten zwei waren falsch.
   1 UV-Sampling aus dem geteilten Atlas: lieferte für hex_grass sechs „Wasser"-Kanten. Raus.
   2 Draufsicht-Rendering, Kantenmitte gelesen: plausibel, aber in z GESPIEGELT. Der Sampler
     rechnete `y = ((wz/half)*0.5+0.5)*(SIZE-1)`, während `readRenderTargetPixels` Zeilen von
     UNTEN liefert und der Bildschirm-Aufwärtsvektor der Draufsichtkamera auf −z zeigt. Beide
     Effekte treffen dieselbe Achse; nur die spiegelsymmetrischen Kacheln (A, D, G, H, I, K, L,
     M — Masken, die unter d ↔ (6−d) invariant sind) überlebten das, alle anderen standen
     falsch: jeder Knick spiegelverkehrt, jeder Strand landeinwärts.
   3 Bodenwahrheit OHNE Kamera (tools/truth-hex-axes.html): die Wasserfläche einer Uferkachel ist
     eigene Geometrie auf y ≈ −0,20. Ihr Vertex-Schwerpunkt im Objektraum zeigt in Richtung des
     Wasserlaufs — absolut, ohne Pixel. Gemessen:
       hex_coast_B  Schwerpunkt  88,7°  → Kanten {1,2}   (Tabelle sagte 270°, also {4,5})
       hex_coast_C  Schwerpunkt  59,6°  → Kanten {0,1,2} (Tabelle sagte 300°)
     Beides genau die Spiegelung d ↔ (6−d) mod 6. Die Tabelle unten ist deshalb gespiegelt —
     nicht geraten, sondern gegen Geometrie belegt.
   Dasselbe Werkzeug prüft den DREHSINN getrennt: dieselbe Kachel um rotDeg(1) = 300° gedreht
   wandert von 88,7° auf 148,7°, also +60° = Kante i → i+1. `rotDeg` ist damit bestätigt.

   DIE VIER FAMILIEN, jede mit ihrer eigenen Logik:

   · BASIS — volle Sechsecke, alle sechs Kanten gleich. hex_grass 'gggggg', hex_water 'wwwwww'.
     Deckfläche y = 0, Körper hängt bis −1 darunter.

   · STRASSEN A…M — Sand-Arme von der Mitte zu einer Kantenmenge. Die 13 Kacheln sind GENAU die
     13 nichtleeren Kantenmengen eines Sechsecks bis auf Drehung (1 Einzel + 3 Paare + 4 Tripel
     + 3 Quadrupel + 1 Quintupel + 1 alle). Das Set ist vollständig: jedes Straßennetz ist
     baubar, jede Zelle hat eine passende Kachel.

   · FLÜSSE A…L — dieselben Muster als Wasserrinne, aber nur 12: keine Einzelkante, also keine
     Quellkachel. Ein Fluss beginnt und endet deshalb am Wasser oder am Kartenrand, nie im Feld.

   · UFER A…E — die einzige Familie, die die Landzelle ERSETZT statt sie zu bemalen: sie bringt
     ihre eigene Wasserfläche mit. Und ihr Bauprinzip ist die eigentliche Entdeckung:
     Sand liegt auf GENAU DEN ZWEI KANTEN, DIE DEN WASSERLAUF FLANKIEREN.
       B  s w w s g g   See {1,2}   — Lauf 2, Flanken 0 und 3
       C  w w w s g s   See {0,1,2} — Lauf 3, Flanken 5 und 3
       D  w w w s s w   See {5,0,1,2} — Lauf 4, Flanken 4 und 3
       A  s s s g g g   kein See, Strand über drei Kanten (Binnenstrand)
       E  g s s g g g   kein See, Strand über zwei Kanten
     Damit ist die Strandkette von selbst durchgehend: endet der Seelauf einer Kachel an Kante d,
     beginnt der Lauf des Nachbarn an der Gegenkante d+3, und beide setzen dort Sand. Es muss
     also nur die WASSERmaske exakt stimmen — die Landkanten ergeben sich.
     Und es folgt eine harte Grenze: baubar sind nur ZUSAMMENHÄNGENDE Seeläufe von 2, 3 oder 4
     Kanten. Für eine einzelne Seekante, für fünf und für zwei getrennte Läufe gibt es keine
     Kachel. Eine Karte, die das verlangt, ist nicht baubar — nicht „fast baubar".
     Weil B vier, C drei und D nur zwei Landkanten hat, bestimmt diese Familie auch die FORM:
     ein frei gezeichneter Umriss erzeugt lauter C/D-Randzellen und zerfällt zu Zacken. Ein
     Hex-Kreis hat sechs gerade Seiten (alles B) und sechs Ecken (C) — deshalb ist die Insel
     ein Hex-Kreis. */
export const TILE_EDGES = {
  hex_grass: 'gggggg',
  hex_water: 'wwwwww',

  hex_road_A: 'sggsgg',   // {0,3}       gerade durch
  hex_road_B: 'gggsgs',   // {3,5}       sanfter Knick
  hex_road_C: 'gggssg',   // {3,4}       scharfer Knick
  hex_road_D: 'gsgsgs',   // {1,3,5}     Y, alternierend
  hex_road_E: 'sggsgs',   // {0,3,5}
  hex_road_F: 'ssgsgg',   // {0,1,3}
  hex_road_G: 'ggsssg',   // {2,3,4}     Fächer
  hex_road_H: 'sgsssg',   // {0,2,3,4}
  hex_road_I: 'gssgss',   // {1,2,4,5}   X
  hex_road_J: 'ssssgg',   // {0,1,2,3}
  hex_road_K: 'gsssss',   // fünf
  hex_road_L: 'ssssss',   // alle sechs
  hex_road_M: 'gggsgg',   // {3}         Sackgasse

  hex_coast_A: 'sssggg',  // kein See, Strand {0,1,2}
  hex_coast_B: 'swwsgg',  // See {1,2},     Sand {0,3}
  hex_coast_C: 'wwwsgs',  // See {0,1,2},   Sand {3,5}
  hex_coast_D: 'wwwssw',  // See {5,0,1,2}, Sand {3,4}
  hex_coast_E: 'gssggg'   // kein See, Strand {1,2}
};
/* Flüsse tragen dieselben Muster als Wasserrinne — abgeleitet, nicht abgeschrieben. */
for (const l of 'ABCDEFGHIJKL') TILE_EDGES['hex_river_' + l] = TILE_EDGES['hex_road_' + l].replace(/s/g, 'w');

export const kindsMask = (kinds, k) => [...kinds].reduce((m, c, i) => (c === k ? m | (1 << i) : m), 0);
export const rotKinds = (kinds, n) => {
  const out = Array(6);
  for (let i = 0; i < 6; i++) out[(i + n) % 6] = kinds[i];
  return out.join('');
};
/* Kern der Uferkachel: entscheidet, ob darauf etwas STEHEN kann. Drei oder mehr Seekanten
   heißt, die Kachelmitte liegt im Wasser. */
export const COAST_CORE = Object.fromEntries('ABCDE'.split('').map((l) => {
  const n = popcount(kindsMask(TILE_EDGES['hex_coast_' + l], 'w'));
  return ['hex_coast_' + l, n >= 3 ? 'w' : 'g'];
}));
export const COAST_EDGES = Object.fromEntries('BCDAE'.split('').map((l) => ['hex_coast_' + l, TILE_EDGES['hex_coast_' + l]]));

/* Anschlussmasken, ABGELEITET aus TILE_EDGES — Straße = Sandkanten, Fluss = Wasserkanten. */
export const EDGE_MASKS = {
  road: Object.fromEntries('ABCDEFGHIJKLM'.split('').map((l) => ['hex_road_' + l, kindsMask(TILE_EDGES['hex_road_' + l], 's')])),
  river: Object.fromEntries('ABCDEFGHIJKL'.split('').map((l) => ['hex_river_' + l, kindsMask(TILE_EDGES['hex_river_' + l], 'w')]))
};

/* Küste lösen: die WASSERmaske muss exakt passen, Landkanten dürfen g oder s sein.
   sea = 6-Bit-Maske der Kanten, hinter denen Wasser ODER offenes Meer (void) liegt. */
export function solveCoast(sea) {
  /* Innenzelle: keine Uferkachel, sondern Wiese. hex_coast_E trägt selbst einen Strand auf zwei
     Kanten und würde mitten in der Wiese eine Sandzunge setzen. */
  if (!sea) return { name: 'hex_grass', rot: 0, turns: 0, sea: 0, kinds: TILE_EDGES.hex_grass, core: 'g' };
  for (const [name, kinds] of Object.entries(COAST_EDGES)) {
    const w = kindsMask(kinds, 'w');
    if (!w) continue;
    for (let n = 0; n < 6; n++) {
      if (rotMask(w, n) === sea) return { name, rot: rotDeg(n), turns: n, sea, kinds: rotKinds(kinds, n), core: COAST_CORE[name] };
    }
  }
  return null;
}

/* rotate a 6-bit edge mask by n sixths (a tile rotated 60° moves every opening one edge on) */
export const rotMask = (mask, n) => {
  let out = 0;
  for (let i = 0; i < 6; i++) if (mask & (1 << i)) out |= 1 << ((i + n) % 6);
  return out & 0b111111;
};

/* Von der Kantenverschiebung zum DREHWINKEL — und hier lag der Fehler, der alles verdrehte.
   `rotMask(m, n)` verschiebt Kante i nach i+n. Eine Drehung des Objekts um +θ um die Y-Achse
   bildet aber einen Punkt (x,z) auf (x·cosθ + z·sinθ, −x·sinθ + z·cosθ) ab: ein Merkmal beim
   Winkel a landet bei a−θ, die Kante also bei i−n. Mit `rot = n*60` war jede Kachel um −2n
   verdreht — richtig nur für n=0 und n=3. Deshalb sahen gerade Straßen (A, symmetrisch unter
   n=3) korrekt aus, während jede Kurve spiegelverkehrt lag und der Strand landeinwärts zeigte
   statt zum Meer. Eine Prozentzahl „Straße 22/22" kann das nicht sehen: die Maske passte, die
   Kachel stand falsch. */
export const rotDeg = (n) => ((6 - (n % 6)) % 6) * 60;

/* Pick the tile + rotation whose MEASURED mask matches the wanted connection mask exactly.
   family: 'road' | 'river'. Returns null when nothing fits — a gate should show that, not
   silently drop a cell (the S5 lesson). */
export function solveHexTile(wanted, family = 'road') {
  const table = EDGE_MASKS[family];
  for (const [name, mask] of Object.entries(table)) {
    for (let n = 0; n < 6; n++) if (rotMask(mask, n) === wanted) return { name, rot: rotDeg(n), mask, turns: n };
  }
  return null;
}

/* Wanted mask for a path cell: which of its six neighbours are also on the path.
   `has(col,row)` tells the solver whether that neighbour belongs to the same network. */
export function wantedMask(col, row, has) {
  let m = 0;
  for (let d = 0; d < 6; d++) {
    const [nc, nr] = neighbor(col, row, d);
    if (has(nc, nr)) m |= 1 << d;
  }
  return m;
}

/* ---------- Netze sind KETTEN, keine Zellenmengen ----------
   Der alte Code hielt Straße und Fluss als Menge von Zellen und leitete die Anschlussmaske aus
   der Nachbarschaft IN DIESER MENGE ab. Damit ist „benachbart, aber nicht verbunden" nicht
   ausdrückbar: zwei Wege, die zufällig aneinander vorbeilaufen, verschmelzen zur Kreuzung. Und
   ein Sprung in der Liste (eine Zelle, die nicht Kante-an-Kante an der vorigen hängt) fällt gar
   nicht auf — er erzeugt lautlos zwei Sackgassen.

   Eine Kette ist eine Folge kantenbenachbarter Zellen. Die Anschlussmaske einer Zelle ist die
   Vereinigung der Kanten, die tatsächlich an ihr hängen. Kreuzungen entstehen dort, wo sich
   Ketten eine Zelle teilen — absichtlich, nicht zufällig. */
export function dirBetween(a, b) {
  for (let d = 0; d < 6; d++) {
    const [nc, nr] = neighbor(a[0], a[1], d);
    if (nc === b[0] && nr === b[1]) return d;
  }
  return -1;
}
export function buildNetwork(chains) {
  const k = (c, r) => c + ',' + r;
  const mask = new Map();
  const breaks = [];
  const add = (c, r, d) => mask.set(k(c, r), (mask.get(k(c, r)) || 0) | (1 << d));
  for (const ch of chains) {
    for (const [c, r] of ch.cells) if (!mask.has(k(c, r))) mask.set(k(c, r), 0);
    for (let i = 0; i + 1 < ch.cells.length; i++) {
      const a = ch.cells[i], b = ch.cells[i + 1];
      const d = dirBetween(a, b);
      if (d < 0) { breaks.push({ chain: ch.id, from: a, to: b }); continue; }
      add(a[0], a[1], d);
      add(b[0], b[1], (d + 3) % 6);
    }
  }
  const ends = chains.flatMap((ch) => [ch.cells[0], ch.cells[ch.cells.length - 1]]);
  return { mask, breaks, ends, cells: [...mask.keys()].map((s) => s.split(',').map(Number)) };
}

/* ---------- Kantenschluss: die Prüfung, die den Drehfehler hätte fangen müssen ----------
   „Straße 22/22 gelöst" hat monatelang grün geleuchtet, während jede Kurve spiegelverkehrt lag:
   der Solver prüft nur, ob eine WUNSCHMASKE erfüllbar ist, nicht ob die GESETZTE Kachel zum
   Nachbarn passt. Diese Prüfung liest die gedrehte Maske der wirklich gesetzten Kachel und
   vergleicht Kante für Kante mit der Gegenkante des Nachbarn. `open` ist die GEDREHTE Maske
   (rotMask(maske, turns)), nicht die Wunschmaske — sonst prüft man wieder nur sich selbst.
   opts.isOpenOutside(col,row,dir) erlaubt offene Kanten nach außen (Mündung ins Meer, Strand). */
export function auditTileFit(list, opts = {}) {
  const k = (c, r) => c + ',' + r;
  const by = new Map(list.map((t) => [k(t.col, t.row), t]));
  const outside = opts.isOpenOutside || (() => false);
  const bad = [];
  for (const t of list) {
    for (let d = 0; d < 6; d++) {
      const [nc, nr] = neighbor(t.col, t.row, d);
      const n = by.get(k(nc, nr));
      const mine = (t.open >> d) & 1;
      const theirs = n ? (n.open >> ((d + 3) % 6)) & 1 : 0;
      if (mine && !theirs && !outside(t.col, t.row, d)) bad.push({ cell: [t.col, t.row], a: t.a, dir: d, why: 'offen ins Leere' });
      else if (!mine && theirs) bad.push({ cell: [t.col, t.row], a: t.a, dir: d, why: 'Nachbar offen, hier zu' });
    }
  }
  return { checked: list.length * 6, bad, clean: bad.length === 0 };
}

/* Erreichbarkeit im Netz: welche Zellen hängen zusammen. Beantwortet die Frage, die eine
   Zellenmenge nie beantworten konnte: hängt das Dorf wirklich an der Burg? */
export function netComponents(net) {
  const k = (c, r) => c + ',' + r;
  const seen = new Set(), comps = [];
  for (const [start] of net.mask) {
    if (seen.has(start)) continue;
    const comp = [], stack = [start];
    seen.add(start);
    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);
      const [c, r] = cur.split(',').map(Number);
      const m = net.mask.get(cur) || 0;
      for (let d = 0; d < 6; d++) {
        if (!(m & (1 << d))) continue;
        const [nc, nr] = neighbor(c, r, d);
        const nk = k(nc, nr);
        if (net.mask.has(nk) && !seen.has(nk)) { seen.add(nk); stack.push(nk); }
      }
    }
    comps.push(comp);
  }
  return comps.sort((a, b) => b.length - a.length);
}

/* ---------- Ufer normalisieren ----------
   Eine Landzelle am Meer braucht 2, 3 oder 4 ZUSAMMENHÄNGENDE Seekanten, sonst hat das Pack
   keine Kachel für sie (siehe COAST_EDGES). Statt solche Zellen stillschweigend als Wiese stehen
   zu lassen — der harte Grasabbruch ins Meer aus S11.2 — wird die Küstenlinie an diese Grenze
   angepasst und JEDE Änderung gemeldet:
     1 Seekante oder zerfallener Lauf → die Kerbe wird zu Land (die Küste glättet sich)
     5 oder 6 Seekanten              → die Zelle wird zu Wasser (eine Nadel, die nichts trägt)

   Der Normalisierer darf NUR gegen offenes Meer (void) arbeiten. Die erste Fassung durfte auch
   gezeichnete Wasserzellen füllen — und schluckte den ganzen Binnensee: jede Landzelle am
   Seeufer hatte eine einzelne Wasserkante, das Füllen erzeugte die nächste, und nach sechs
   Läufen war der See Wiese. Eine Reparatur, die die Absicht des Autors auffrisst, ist keine.
   `terrain` ist eine Map "c,r" -> 'g' | 'w'; void = offenes Meer. */
export function normaliseShore(terrain, opts = {}) {
  const passes = opts.passes ?? 6;
  const k = (c, r) => c + ',' + r;
  const changes = [], residual = [];
  const sea = (c, r) => terrain.get(k(c, r)) !== 'g';
  for (let pass = 0; pass < passes; pass++) {
    let touched = 0;
    residual.length = 0;
    for (const [ck, ch] of [...terrain]) {
      if (ch !== 'g') continue;
      const [c, r] = ck.split(',').map(Number);
      let m = 0;
      for (let d = 0; d < 6; d++) { const [nc, nr] = neighbor(c, r, d); if (sea(nc, nr)) m |= 1 << d; }
      const n = popcount(m);
      if (n === 0 || (n >= 2 && n <= 4 && isRun(m))) continue;
      if (n >= 5) {
        terrain.set(ck, 'w');
        changes.push({ cell: [c, r], from: 'g', to: 'w', why: `${n} Seekanten` });
        touched++;
        continue;
      }
      /* kleinsten Seelauf zuschieben — aber nur, wenn er ganz aus offenem Meer besteht */
      const runs = [];
      for (let d = 0; d < 6; d++) {
        if (!(m & (1 << d))) continue;
        const prev = m & (1 << ((d + 5) % 6));
        if (prev && runs.length) runs[runs.length - 1].push(d);
        else runs.push([d]);
      }
      if (runs.length > 1 && (m & 1) && (m & 0b100000)) runs[0] = runs.pop().concat(runs[0]);
      runs.sort((a, b) => a.length - b.length);
      const fillable = runs.find((run) => run.every((d) => {
        const [nc, nr] = neighbor(c, r, d);
        return !terrain.has(k(nc, nr));
      }));
      if (!fillable) { residual.push({ cell: [c, r], sea: m, n }); continue; }
      for (const d of fillable) {
        const [nc, nr] = neighbor(c, r, d);
        terrain.set(k(nc, nr), 'g');
        changes.push({ cell: [nc, nr], from: 'void', to: 'g', why: `Kerbe an ${c},${r}` });
        touched++;
      }
    }
    if (!touched) return { changes, residual: [...residual], passes: pass + 1, settled: true };
  }
  return { changes, residual: [...residual], passes, settled: false };
}

/* Ein Kettenende (Quelle, Mündung) braucht eine zweite offene Kante, sonst gibt es keine Kachel
   — das Pack hat keine Einzelkanten-Flusskachel. Sie kommt aus dem Meer, aber nur EINE: die
   Kante, die dem Lauf am weitesten gegenüberliegt. Die erste Fassung nahm ALLE Seekanten und
   ließ die Quelle scheinbar dreifach in die Klippe fransen. */
export function endSeaEdge(col, row, chainMask, isSea) {
  let best = -1, bestScore = -1;
  for (let d = 0; d < 6; d++) {
    if (chainMask & (1 << d)) continue;
    const [nc, nr] = neighbor(col, row, d);
    if (!isSea(nc, nr)) continue;
    let score = 6;
    for (let e = 0; e < 6; e++) {
      if (!(chainMask & (1 << e))) continue;
      const diff = Math.min((d - e + 6) % 6, (e - d + 6) % 6);
      score = Math.min(score, diff);
    }
    if (score > bestScore) { bestScore = score; best = d; }
  }
  return best < 0 ? 0 : 1 << best;
}

/* Seam audit: every placed tile's rendered centre must sit on its grid position, and neighbouring
   tiles must be exactly one step apart — the hex analogue of the lane-joint audit. */
export function auditHexSeams(placed, m, opts = {}) {
  const tol = opts.tolerance ?? 0.02;
  const rows = [], bad = [];
  for (const it of placed) {
    const want = hexToWorld(it.col, it.row, m);
    const dx = Math.abs(it.world[0] - want[0]), dz = Math.abs(it.world[2] - want[2]);
    const row = { col: it.col, row: it.row, a: it.a, dev: +Math.max(dx, dz).toFixed(3) };
    rows.push(row);
    if (row.dev > tol) bad.push(row);
  }
  return { count: rows.length, bad, worst: +rows.reduce((mx, r) => Math.max(mx, r.dev), 0).toFixed(3), clean: bad.length === 0, rows };
}

/* ---------- Standort-Audit für RASTERFESTE Aufbauten ----------
   auditHexSeams prüft die Kachelschicht, auditOnLand nur, dass etwas Land unter sich hat — keine
   von beiden merkt, wenn ein Sechseck-Plateau NEBEN seiner Zelle steht. Genau das passierte in
   S11.4: `relaxOverlaps` durfte Natur um 0,8 schieben, und `mountain_B` landete 0,74 neben
   Zelle (7,2), mit sichtbarer Unterseite über der Kachelgrenze. Die Zahl im Balken blieb grün.
   Diese Prüfung liest die MITTE DER GERENDERTEN BOX und vergleicht sie mit der Zellmitte —
   dieselbe Logik wie der Spurgelenk-Audit in S3, nur für Aufbauten. */
export function auditOnCell(root, m, opts = {}) {
  const tol = opts.tolerance ?? 0.03;
  const pick = opts.pick || ((rec) => rec?.fixed);
  const rows = [], bad = [];
  root.traverse((o) => {
    const rec = o.userData?.recipe;
    if (!rec || !pick(rec) || !rec.cell) return;
    const box = new THREE.Box3().setFromObject(o);
    const c = box.getCenter(new THREE.Vector3());
    const want = hexToWorld(rec.cell[0], rec.cell[1], m);
    const dx = c.x - want[0], dz = c.z - want[2];
    const row = { a: rec.a, cell: rec.cell, dx: +dx.toFixed(3), dz: +dz.toFixed(3), dev: +Math.hypot(dx, dz).toFixed(3) };
    rows.push(row);
    if (row.dev > tol) bad.push(row);
  });
  return { count: rows.length, bad, worst: +rows.reduce((mx, r) => Math.max(mx, r.dev), 0).toFixed(3), clean: bad.length === 0, rows };
}

/* Standort-Audit für Aufbauten: jedes Gebäude, jeder Baum, jede Requisite braucht eine Kachel
   unter sich. Das war die Lücke, durch die zwei Felsen auf dem See landeten (S11.2): auditHexSeams
   prüft nur die Kachelschicht, auditFootprints nimmt Kachelpaare aus, und relaxOverlaps schaut
   nicht nach unten. cellKind(col,row) liefert 'g' | 'w' | undefined. */
export function auditOnLand(placements, cellKind, opts = {}) {
  const allowWater = new Set(opts.allowWater || []);
  const rows = [], offMap = [], onWater = [];
  for (const p of placements) {
    if (!p.cell || p.layer === 'tile') continue;
    const kind = cellKind(p.cell[0], p.cell[1]);
    const row = { a: p.a, cell: p.cell, kind: kind || 'leer', layer: p.layer };
    rows.push(row);
    if (!kind) offMap.push(row);
    else if (kind === 'w' && !allowWater.has(p.a)) onWater.push(row);
  }
  return {
    count: rows.length, onLand: rows.length - offMap.length - onWater.length,
    offMap, onWater, clean: offMap.length === 0 && onWater.length === 0, rows
  };
}
