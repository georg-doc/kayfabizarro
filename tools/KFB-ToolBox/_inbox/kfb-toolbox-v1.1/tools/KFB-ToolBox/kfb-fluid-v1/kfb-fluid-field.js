/**
 * KFB Fluid v1 · FELD
 * ===================
 * Reine Mathematik, KEIN three.js. Dieses Modul beantwortet genau vier Fragen:
 *
 *   1. WELCHE Zellen gehoeren zum Graben (und zum Fluss)?          ringCells / riverCells
 *   2. WIE HOCH ist der Boden dort?                                bottomAt / bankTopAt / riverTopAt
 *   3. WO steht die Wasserlinie?                                   waterLevelFrom
 *   4. IN WELCHE RICHTUNG stroemt es?                              flowAt
 *
 * Warum getrennt von der Darstellung: die Zahlen sind pruefbar. Ein Test kann die Zellliste
 * zaehlen, die Wasserlinie gegen den Zonenboden halten und die Stroemungsvektoren normieren,
 * ohne einen Renderer zu starten (KFB-Regel 3: messen statt glauben).
 *
 * KOORDINATEN. Die Zone ist ein Rechteck um (0, centerZ) mit den Halbmassen halfX / halfZ.
 * Zellmittelpunkte liegen auf (i + 0.5) * cell — dasselbe Raster wie voxel-terrain v10.
 * Die Abstandsmetrik ist CHEBYSHEV PRO ACHSE:  d = max(|x| / halfX, |z - centerZ| / halfZ).
 * d <= 1 ist Plateau, d > 1 ist Graben. Eine euklidische Metrik ergaebe abgerundete Ecken,
 * die nicht zum Rechteck der Karte passen.
 *
 * HOEHENRASTER. Alle Hoehen rasten auf SUB = cell / subSteps (Standard: sechs Stufen pro Cube,
 * "D6"). Das ist die gemeinsame Sprache von Terrain, Zone und Graben — ohne sie springen
 * Uebergaenge in ganzen Cubes.
 *
 * @module kfb-fluid-field
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09) — dort inline, hier herausgeloest
 */

// ---------------------------------------------------------------- Rauschen (deterministisch)

/** Integer-Hash → [0,1). Zwei Koordinaten plus Seed. Keine Math.random-Abhaengigkeit. */
export function h2(a, b, s) {
  let h = (s ^ Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Value-Noise mit smoothstep-Interpolation. */
export function vnoise(x, z, s) {
  const x0 = Math.floor(x), z0 = Math.floor(z), fx = x - x0, fz = z - z0;
  const u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  const a = h2(x0, z0, s), b = h2(x0 + 1, z0, s), c = h2(x0, z0 + 1, s), d = h2(x0 + 1, z0 + 1, s);
  return (a * (1 - u) + b * u) * (1 - w) + (c * (1 - u) + d * u) * w;
}

/**
 * Vier Oktaven, gemittelt. ACHTUNG beim Weiterverwenden: der Rueckgabewert clustert um 0.5
 * (gemessen 0.44 … 0.79), er schoepft 0…1 NIE aus. Wer Streuung braucht, muss spreizen —
 * dafuer gibt es `spread()` weiter unten. Das war im Lab der Grund, warum das Ufer als
 * gezeichneter Rahmen las: die Quantisierung schluckte die ungespreizte Streuung weg.
 */
export function fbm(x, z, s) {
  let sum = 0, amp = 0.5, f = 1, n = 0;
  for (let i = 0; i < 4; i++) { sum += vnoise(x * f, z * f, s + i * 977) * amp; n += amp; amp *= 0.5; f *= 2.03; }
  return sum / n;
}

/** Kontrastkurve auf den ECHTEN fbm-Bereich. Ohne sie bleibt jede Ufervariation unter einer Rasterweite. */
export const spread = (v) => Math.max(0, Math.min(1, (v - 0.5) * 3.4 + 0.5));

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (t) => t * t * (3 - 2 * t);

// ---------------------------------------------------------------- Feld

/**
 * @typedef {object} GutterFieldOptions
 * @property {number} [cell=3]        Kantenmass einer Zelle in Welteinheiten.
 * @property {number} [subSteps=6]    Hoehenstufen pro Zelle (D6).
 * @property {number} [halfX=24]      Halbe Zonenbreite  (X).
 * @property {number} [halfZ=13.5]    Halbe Zonentiefe   (Z).
 * @property {number} [centerZ=-1.5]  Z-Mitte der Zone. Muss zum Terrain-Raster passen.
 * @property {number} [rows=3]        Grabenbreite in ZELLREIHEN (nicht als Bruchteil!).
 * @property {boolean}[river=true]    Flusslauf an.
 * @property {number} [riverWidth=3]  Flussbreite in Zellen.
 * @property {number} [seed=7]        Steuert Flussrichtung und -maeander.
 * @property {(x:number,z:number)=>number} [groundHeightAt] Terrainhoehe. Fehlt sie, gilt 0.
 */

/**
 * Baut das Feld. Alle Rueckgaben sind reine Daten — das Modul haelt keinen Zustand ausser
 * dem gecachten Flusspfad.
 * @param {GutterFieldOptions} opts
 */
export function createGutterField(opts = {}) {
  const cell = opts.cell || 3;
  const subSteps = opts.subSteps || 6;
  const SUB = cell / subSteps;
  const halfX = opts.halfX != null ? opts.halfX : cell * 8;
  const halfZ = opts.halfZ != null ? opts.halfZ : cell * 4.5;
  const centerZ = opts.centerZ != null ? opts.centerZ : -cell * 0.5;
  /**
   * Anti-Flacker-Abstand der Wasserebene zum Boden darunter. MUSS kleiner als eine Hoehenstufe
   * sein: mit cell*0.3 (> SUB) lag die Ebene bis zu zwei Stufen ueber der Zelle, die sie fuellen
   * soll — also als schwebender Film ueber trockenem Sand.
   */
  const WMARGIN = SUB * 0.4;

  const S = {
    rows: Math.max(2, Math.round(opts.rows != null ? opts.rows : 3)),
    river: opts.river !== false,
    riverWidth: opts.riverWidth != null ? opts.riverWidth : 3,
    seed: opts.seed != null ? opts.seed : 7,
    ground: opts.groundHeightAt || (() => 0),
  };
  let riverCache = null;

  const snapSub = (y) => Math.round(y / SUB) * SUB;

  // ------------------------------------------------------------ Reichweite & Carve

  /**
   * Reichweite des Graben-Meshes, PRO ACHSE. Genau daran haengt auch der Terrain-Carve:
   * reicht der Carve weniger weit als der Ring, steht Terrain im Graben und das Wasser spannt
   * sich ueber ein Loch. Ein gemeinsames Pad aus halfX stanzt die kurze Achse zu weit aus.
   *
   * Die +cell*0.1 ist der Ueberlappzuschlag: auf Z sind Graben- und Terrainraster einen halben
   * Cube versetzt. Ueberlappung ist unsichtbar, eine Ritze nicht.
   */
  function reach() {
    const w = S.rows;
    return { x: halfX + w * cell + cell * 0.1, z: halfZ + w * cell + cell * 0.1, rows: w };
  }

  /** Das Rechteck, das an voxel-terrain.setCarve() geht. */
  function carveRect() {
    const r = reach();
    return { x: 0, z: centerZ, hx: r.x, hz: r.z };
  }

  /**
   * Drei ueberlappende Ruhezonen-Kreise, die das Rechteck annaehern (voxel-terrain.setZones()).
   * EIN Kreis mit Radius aus halfX laesst die Terrainwelle auf der langen Achse direkt am
   * Plateau wieder voll aufschlagen. Der Radius ist so gewaehlt, dass die ECKE des Rechtecks
   * noch im vollruhigen Kern (d <= r*0.55) liegt — sonst zuckt genau die Ecke, wo das Auge
   * hinsieht.
   */
  function calmZones() {
    const r0 = reach();
    const cx = Math.max(0, r0.x - r0.z * 0.6);
    const r = Math.hypot(r0.x - cx, r0.z) / 0.55;
    return [
      { x: -cx, z: centerZ, r, amt: 1 },
      { x: 0, z: centerZ, r, amt: 1 },
      { x: cx, z: centerZ, r, amt: 1 },
    ];
  }

  // ------------------------------------------------------------ Zellen

  /**
   * BOGENLAENGE am Zonenrand, umlaufend und monoton: 0 an der Ecke (-halfX, +halfZ), dann im
   * Uhrzeigersinn ueber alle vier Seiten. Damit hat JEDER Randpunkt genau einen Parameter —
   * auch sein Spiegelbild bekommt einen anderen.
   *
   * Vorher lief das Ufer-Rauschen ueber eine achsenparallele Koordinate, die unter Spiegelung
   * unveraendert bleibt: das Ufer war auf beiden Achsen deckungsgleich und las als gezeichneter
   * Rahmen. Bogenlaenge ist ausserdem genau der Parameter, den eine POLYLINE liefert — der
   * Flussfall braucht dann nur eine andere Kurve, nicht andere Mathematik.
   */
  function perimS(x, z) {
    const cz = z - centerZ;
    const dx = Math.abs(x) - halfX, dz = Math.abs(cz) - halfZ;
    const cx = Math.max(-halfX, Math.min(halfX, x)), ccz = Math.max(-halfZ, Math.min(halfZ, cz));
    if (dx > dz) return x > 0 ? 2 * halfX + (halfZ - ccz) : 4 * halfX + 2 * halfZ + (ccz + halfZ);
    return cz > 0 ? (cx + halfX) : 2 * halfX + 2 * halfZ + (halfX - cx);
  }

  /** Chebyshev-Abstand, pro Achse normiert. <= 1 ist Plateau. */
  function zoneDist(x, z) {
    return Math.max(Math.abs(x) / halfX, Math.abs(z - centerZ) / halfZ);
  }

  /**
   * Die WANNE ist pro Achse gleichmaessig breit, damit ihre Aussenkante genau auf dem
   * Carve-Rechteck liegt — dann stoesst das Terrain direkt an das Ufer und es braucht keine
   * Fuellzellen. Unregelmaessig ist nur, was unregelmaessig sein soll: die WASSERLINIE und
   * die Tiefe der Wanne.
   *
   * `ring` zaehlt in ZELLEN ab Plateaukante, nicht normiert: bei einem schmalen Graben gibt es
   * kein "u zwischen 0.34 und 0.62". Ring 0 liegt am Plateau, der letzte Ring ist das Ufer.
   */
  function ringCells() {
    const out = [], r = reach();
    const iMax = Math.ceil((r.x + cell) / cell), jMax = Math.ceil((r.z + cell) / cell);
    for (let i = -iMax; i <= iMax; i++) {
      for (let j = -jMax; j <= jMax; j++) {
        const x = (i + 0.5) * cell, z = (j + 0.5) * cell;
        if (Math.abs(x) > r.x || Math.abs(z - centerZ) > r.z) continue;
        if (zoneDist(x, z) <= 1) continue;
        const dxC = (Math.abs(x) - halfX) / cell, dzC = (Math.abs(z - centerZ) - halfZ) / cell;
        const ring = Math.max(0, Math.floor(Math.max(dxC, dzC)));
        const last = r.rows - 1;
        out.push({ x, z, ring, last, u: last > 0 ? ring / last : 0, river: false });
      }
    }
    return out;
  }

  /**
   * FLUSSLAUF als Polyline. Die Kurve wandert aus dem Graben nach aussen und maeandert; ihre
   * Form kommt aus demselben Rauschen wie das Ufer, damit Fluss und Zone dieselbe Handschrift
   * haben. Startpunkt ist die Zonenkante, Endpunkt weit draussen — spaeter die naechste Zone.
   */
  function riverPath() {
    if (riverCache && riverCache.seed === S.seed) return riverCache.pts;
    const seed = S.seed;
    const dir = (seed % 2) ? 1 : -1;
    const pts = [];
    const x0 = dir * (halfX + cell * 0.5), z0 = centerZ + (((seed >>> 3) % 5) - 2) * cell;
    for (let i = 0; i <= 9; i++) {
      const t = i / 9;
      const x = x0 + dir * t * cell * 22;
      const z = z0 + (fbm(t * 2.6 + 3.1, seed % 17, 5501) - 0.5) * cell * 9 + t * cell * 4 * dir;
      pts.push([x, z]);
    }
    riverCache = { seed, pts };
    return pts;
  }

  /**
   * EIN Radius fuer Carve UND Bett. Waeren sie verschieden, staende im Zwischenband ein
   * Flusscube UND ein Terraincube, und ihre Oberseiten wuerden im Tiefenpuffer streiten
   * (flackernde Deckflaechen am Fluss).
   */
  function riverHalf() { return S.riverWidth * cell * 0.5 + cell * 0.5; }

  /** Abstand zum Lauf und Bogenlaenge darauf — dieselben zwei Zahlen, die perimS liefert. */
  function riverField(x, z) {
    const pts = riverPath();
    let best = Infinity, s = 0, acc = 0, L = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i][0], az = pts[i][1], bx = pts[i + 1][0], bz = pts[i + 1][1];
      const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz, l = Math.sqrt(l2);
      let t = l2 > 0 ? ((x - ax) * dx + (z - az) * dz) / l2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + dx * t - x, pz = az + dz * t - z;
      const d = Math.sqrt(px * px + pz * pz);
      if (d < best) { best = d; s = acc + l * t; }
      acc += l; L += l;
    }
    return { d: best, s, L, pts };
  }

  /** Zellen des Flussbettes: alles im Streifen der Kurve, das nicht schon zum Graben gehoert. */
  function riverCells() {
    if (!S.river) return [];
    const out = [], r = reach(), half = riverHalf(), pts = riverPath();
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    pts.forEach(([x, z]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); });
    const iA = Math.floor((x0 - half) / cell), iB = Math.ceil((x1 + half) / cell);
    const jA = Math.floor((z0 - half) / cell), jB = Math.ceil((z1 + half) / cell);
    for (let i = iA; i <= iB; i++) {
      for (let j = jA; j <= jB; j++) {
        const x = (i + 0.5) * cell, z = (j + 0.5) * cell;
        if (Math.abs(x) <= r.x && Math.abs(z - centerZ) <= r.z) continue;   // gehoert dem Graben
        if (riverField(x, z).d > half) continue;
        out.push({ x, z, ring: 1, last: 1, u: 0, river: true });
      }
    }
    return out;
  }

  /** Graben + Fluss in EINER Liste. Ein Fluss ist hier nichts anderes als ein Graben mit offener Kurve. */
  function allCells() { return ringCells().concat(riverCells()); }

  // ------------------------------------------------------------ Hoehen

  /**
   * EIN Niveau-Modell fuer die ganze Zone:
   *
   *   Zonenboden, Hauptniveau     ──────────────  Modus der Zellhoehen
   *   Wasserlinie                 ─ ─ ─ ─ ─ ─ ─   1,5 Stufen darunter
   *   Wannenboden                 ______________   noch eine halbe Zelle tiefer
   *   Aussenufer                  Terrainhoehe, aber nie unter der Wasserlinie
   *
   * BEZUG IST DER HAEUFIGSTE BODEN, nicht ein Quantil. Die Zellhoehen rasten auf SUB, ein
   * Quantil liegt deshalb oft genau auf dem Hauptniveau — dann flutet der Hauptboden selbst.
   * Der Modus ist per Definition "das Bodenniveau der Zone".
   *
   * FLACHER BODEN = KEIN WASSER. Ohne Mulden gibt es nichts zu fluten, also liegt die Ebene
   * unter dem tiefsten Punkt und die Insel bleibt trocken.
   *
   * @param {number[]} zoneTops Hoehen aller Zonenzellen.
   * @param {number} [ceilY=0] Oberkante des Plateaus — die Linie liegt nie darueber.
   */
  function waterLevelFrom(zoneTops, ceilY = 0) {
    const tops = (zoneTops || []).slice().sort((a, b) => a - b);
    if (!tops.length) return -cell * 0.5;
    const min = tops[0], max = tops[tops.length - 1];
    if (max - min < cell * 0.5) return min - cell * 0.5;
    const hist = new Map();
    tops.forEach((y) => { const k = Math.round(y / SUB); hist.set(k, (hist.get(k) || 0) + 1); });
    let mode = Math.round(tops[Math.floor(tops.length / 2)] / SUB), best = -1;
    hist.forEach((n, k) => { if (n > best) { best = n; mode = k; } });
    return Math.min(mode * SUB - SUB * 1.5, ceilY - SUB);
  }

  /**
   * Wannenboden: fest eine halbe Zelle unter der Wasserlinie, Tiefe nur in D6-Stufen variiert.
   * Haengt die Tiefe am Rauschen, liegt nicht jede Bodenzelle sicher unter dem Wasserstand —
   * der Ring wird gefleckt.
   */
  function bottomAt(x, z, waterY) {
    return waterY - cell * 0.5 - Math.round(h2(Math.round(x), Math.round(z), 5150) * 2) * SUB;
  }

  /**
   * UFER ALS HOEHENFELD — die Kernidee des Moduls.
   *
   *   dC    = Abstand nach aussen ab Plateaukante, in Zellen (0 … rows)
   *   shore = wo die Wasserlinie geschnitten wird, aus Rauschen ENTLANG der Kante
   *   slope = ueber wie viele Zellen das Ufer ansteigt
   *   Hoehe = Wannenboden → Terrainhoehe, ueberblendet, auf SUB gerastet
   *
   * DIE WASSERLINIE IST DER PARAMETER, nicht ein Nebenprodukt. Endet die Rampe immer bei
   * dC = rows und aendert das Rauschen nur die Steilheit, bleibt der Durchgang konstruktiv in
   * derselben Zellreihe: die Uferlinie ist dann ein Rechteck. Hier wandert die Kreuzung selbst
   * ueber den ganzen Graben — unter 1 ragt eine Landzunge bis ans Plateau, ueber rows-1
   * schneidet eine Bucht bis ins Terrain.
   *
   * ZIEL IST DIE TERRAINHOEHE, ohne Deckel. Ein Deckel (z. B. waterY + cell*1.1) greift bei
   * fast jeder Zelle und macht aus dem Ufer ein gleichmaessig hohes Band mit rechteckiger
   * Aussenkante — derselbe gezeichnete Rahmen, nur eine Reihe weiter aussen.
   */
  function bankTopAt(x, z, waterY, bottom) {
    const rows = reach().rows;
    const dxC = (Math.abs(x) - halfX) / cell, dzC = (Math.abs(z - centerZ) - halfZ) / cell;
    const dC = Math.max(0, Math.max(dxC, dzC));
    // Abtastung auf einem KREIS, dessen Umfang der Bogenlaenge entspricht: periodisch (kein
    // Sprung an der Naht bei s = 0) und trotzdem fuer jede Umfangsposition anders. Radius so,
    // dass ein Merkmal 2-3 Zellen lang wird.
    const L = 4 * (halfX + halfZ);
    const a = 2 * Math.PI * perimS(x, z) / L;
    const R = L / (cell * 2.5 * 2 * Math.PI);
    const n1 = fbm(Math.cos(a) * R + 11.5, Math.sin(a) * R + 4.2, 8123);
    const n2 = fbm(Math.cos(a) * R * 0.55 + 40.7, Math.sin(a) * R * 0.55 - 17.3, 3391);
    const shore = -0.3 + spread(n1) * (rows + 0.9);
    const slope = 0.5 + n2 * 1.8;
    const t = clamp01((dC - (shore - slope * 0.5)) / slope);
    const gh = S.ground(x, z);
    const target = Math.max(waterY + cell * 0.2, gh);
    const top = snapSub(bottom + (target - bottom) * smooth(t));
    // EINE Wahrheit fuer "nass": liegt die Zelle unter der Wasserlinie, muss sie auch unter der
    // Anti-Flacker-Schwelle liegen — sonst gilt sie als nass, bekommt aber kein Quad (dunkle
    // Loecher in der Flaeche).
    const wet = waterY - WMARGIN - SUB;
    return top < waterY && top > wet ? wet : top;
  }

  /**
   * FLUSSUFER. Dieselbe Rechnung wie am Zonenufer, nur mit Abstand-zur-Kurve statt
   * Abstand-zum-Rechteck und Bogenlaenge ENTLANG der Kurve statt am Umfang. Kein zweites
   * Hoehenmodell, keine zweite Wasserlogik. Nicht periodisch abgetastet — eine offene Kurve
   * hat keine Naht, die sich schliessen muss.
   */
  function riverTopAt(x, z, waterY, bottom) {
    const f = riverField(x, z);
    const halfC = Math.max(1.2, riverHalf() / cell);
    const dC = Math.max(0, f.d / cell - halfC * 0.35);
    const rows = halfC;
    const n1 = fbm(f.s / (cell * 2.5) + 21.7, 6.4, 8123);
    const n2 = fbm(f.s / (cell * 5.5) - 8.2, 19.1, 3391);
    const shore = -0.2 + spread(n1) * (rows + 0.8);
    const slope = 0.4 + n2 * 1.5;
    const t = clamp01((dC - (shore - slope * 0.5)) / slope);
    const gh = S.ground(x, z);
    const target = Math.max(waterY + cell * 0.2, gh);
    const top = snapSub(bottom + (target - bottom) * smooth(t));
    const wet = waterY - WMARGIN - SUB;
    return top < waterY && top > wet ? wet : top;
  }

  /** Die EINE Stelle, an der ueber die Oberkante einer Grabenzelle entschieden wird. */
  function topAt(c, waterY) {
    const bottom = bottomAt(c.x, c.z, waterY);
    const top = c.river ? riverTopAt(c.x, c.z, waterY, bottom)
      : c.ring === 0 ? bottom              // innerste Reihe bleibt Boden: am Plateaufuss liegt immer Wasser
        : bankTopAt(c.x, c.z, waterY, bottom);
    return { bottom, top, dry: top > waterY - WMARGIN };
  }

  /** Nass-Test. EINE Quelle fuer Fluid-Netz, Blasen und Audio — sonst blubbert es im Trockenen. */
  function isWet(top, waterY) { return top != null && top < waterY - WMARGIN; }

  // ------------------------------------------------------------ Stroemung

  /**
   * Stroemung = Tangente des Laufs, STAERKE als Rampe ueber den Abstand zum Lauf — auch fuer
   * Grabenzellen. Traegt der Graben strikt 0 und der Fluss strikt 1, schaltet die Animation an
   * der Muendung hart um; das ist ein sichtbarer Bruch. So laeuft die Richtung ueber ein paar
   * Zellen aus und der Graben beruhigt sich zum Stillwasser hin.
   *
   * @returns {[number,number]} Richtung * Staerke, Betrag 0…1.
   */
  function flowAt(x, z) {
    if (!S.river) return [0, 0];
    const f = riverField(x, z), pts = f.pts, half = riverHalf();
    const amt = clamp01(1 - (f.d - half) / (cell * 3.5));
    if (amt <= 0.001) return [0, 0];
    let acc = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1][0] - pts[i][0], dz = pts[i + 1][1] - pts[i][1];
      const l = Math.sqrt(dx * dx + dz * dz);
      if (f.s <= acc + l || i === pts.length - 2) return [dx / l * amt, dz / l * amt];
      acc += l;
    }
    return [0, 0];
  }

  // ------------------------------------------------------------ API

  return {
    name: 'kfb-fluid-field', version: '1.0.0',
    get cell() { return cell; },
    get SUB() { return SUB; },
    get WMARGIN() { return WMARGIN; },
    get halfX() { return halfX; },
    get halfZ() { return halfZ; },
    get centerZ() { return centerZ; },
    get options() { return Object.assign({}, S); },

    set(patch) {
      if (patch.rows != null) S.rows = Math.max(2, Math.round(patch.rows));
      if (patch.river != null) S.river = !!patch.river;
      if (patch.riverWidth != null) S.riverWidth = patch.riverWidth;
      if (patch.seed != null && patch.seed !== S.seed) { S.seed = patch.seed; riverCache = null; }
      if (patch.groundHeightAt) S.ground = patch.groundHeightAt;
      if (patch.riverWidth != null || patch.river != null) riverCache = riverCache; // Pfad bleibt, nur Breite aendert
      return this;
    },

    reach, carveRect, calmZones, zoneDist, perimS,
    ringCells, riverCells, allCells,
    riverPath, riverField, riverHalf,
    waterLevelFrom, bottomAt, bankTopAt, riverTopAt, topAt, isWet, flowAt,
    snapSub,
  };
}

export default createGutterField;
