/* KFB Kit Lab · S13.2 · Dungeon als GRAPH
   Vertrag aus KayKit_Dungeon_Model_S13.html: die FUGE trägt das Merkmal, nicht die Kachel.
   Zellen sind Knoten, Fugen sind Kanten, jede Fuge trägt genau eine Klasse.

   In dieser Datei steht KEINE Zahl, die ein Bauteil beschreibt. Modul, Wandhöhe, Wanddicke,
   Treppenhub, Schenkelmitten, Überstände — alles kommt aus planScan()/measure() und wird als
   `kit` hereingegeben. Die Lehre aus S12/S13 war teuer genug: getippte Maße waren viermal falsch.

   Was hier steht, sind AUSSAGEN ÜBER DAS RASTER (2 Zellen Streifen, 4 Richtungen, 2×2 Mindestraum)
   — die sind Modell, nicht Messung. */

/* ---------- Richtungen · eine Tabelle, alles andere abgeleitet (Vorbild hex-grid.js) ---------- */
export const DIR = { E: [1, 0], S: [0, 1], W: [-1, 0], N: [0, -1] };
export const DIRLIST = Object.entries(DIR);

export const cellId = (L, c, r) => `${L}:${c},${r}`;
/* Kanonischer Fugenschlüssel. Damit ist „zwei Objekte auf einer Fuge" strukturell unmöglich,
   statt nur geprüft: die Fuge ist der Schlüssel, nicht Zelle × Richtung. */
export const seamKey = (a, b) => (a < b ? a + '|' + b : b + '|' + a);

/* Drehung um Y in Vielfachen von 90°. three.js: rotation.y = a bildet (x,z) auf
   (x·cos a + z·sin a, −x·sin a + z·cos a) ab — also +x → −z bei +90°. Das Runden von cos/sin ist
   NUR für Vielfache von 90 zulässig, deshalb der Wurf. */
export function rotVec([x, z], deg) {
  if (((deg % 90) + 90) % 90 !== 0) throw new Error('rotVec: nur Vielfache von 90°');
  const a = (deg * Math.PI) / 180, c = Math.round(Math.cos(a)), s = Math.round(Math.sin(a));
  return [x * c + z * s, -x * s + z * c];
}
const vEq = (a, b) => a[0] === b[0] && a[1] === b[1];

/* ---------- Zufall mit Saat ---------- */
export function rng(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let s = h >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    shuffle: (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; },
    weighted: (entries) => {
      const tot = entries.reduce((s2, e) => s2 + e[1], 0);
      let r = next() * tot;
      for (const e of entries) { r -= e[1]; if (r <= 0) return e[0]; }
      return entries[entries.length - 1][0];
    }
  };
}

/* ---------- Geometrie-Wahrheit ohne Kamera ----------
   Dreiecke einsammeln und in der Draufsicht als FLÄCHE rastern. Eine Vertex-Statistik wäre
   wertlos: ein Wandquader hat acht Ecken, eine Treppe hunderte — gezählt würde die Treppe,
   gemessen werden soll die Platte. */
export function collectTris(node, exclude = null) {
  const tris = [];
  node.updateMatrixWorld?.(true);
  node.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (exclude && exclude.test(o.name)) return;
    const pos = o.geometry.attributes.position;
    if (!pos) return;
    const e = o.matrixWorld.elements;
    const tp = (i) => {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      return [e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]];
    };
    const idx = o.geometry.index, n = idx ? idx.count : pos.count;
    for (let i = 0; i + 2 < n; i += 3) {
      tris.push([tp(idx ? idx.getX(i) : i), tp(idx ? idx.getX(i + 1) : i + 1), tp(idx ? idx.getX(i + 2) : i + 2)]);
    }
  });
  return tris;
}

export function planScan(tris, bands = 64) {
  let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity, mnz = Infinity, mxz = -Infinity;
  for (const t of tris) for (const v of t) {
    if (v[0] < mnx) mnx = v[0]; if (v[0] > mxx) mxx = v[0];
    if (v[1] < mny) mny = v[1]; if (v[1] > mxy) mxy = v[1];
    if (v[2] < mnz) mnz = v[2]; if (v[2] > mxz) mxz = v[2];
  }
  const sx = (mxx - mnx) || 1e-6, sz = (mxz - mnz) || 1e-6;
  const cellW = Math.max(sx, sz) / bands;
  const occ = new Uint8Array(bands * bands);
  const mark = (x, z) => {
    const i = Math.min(bands - 1, Math.max(0, Math.floor(((x - mnx) / sx) * bands)));
    const j = Math.min(bands - 1, Math.max(0, Math.floor(((z - mnz) / sz) * bands)));
    occ[j * bands + i] = 1;
  };
  for (const [A, B, C] of tris) {
    const el = Math.max(Math.hypot(B[0] - A[0], B[2] - A[2]), Math.hypot(C[0] - B[0], C[2] - B[2]), Math.hypot(A[0] - C[0], A[2] - C[2]));
    const n = Math.min(14, Math.max(1, Math.ceil(el / cellW)));
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
      const u = i / n, v = j / n, w = 1 - u - v;
      mark(A[0] * w + B[0] * u + C[0] * v, A[2] * w + B[2] * u + C[2] * v);
    }
  }
  const S = { min: [mnx, mny, mnz], max: [mxx, mxy, mxz], size: [sx, mxy - mny, sz], bands, occ };
  S.at = (i, j) => occ[j * bands + i] === 1;
  S.world = (axis, band) => (axis === 'x' ? mnx + ((band + 0.5) / bands) * sx : mnz + ((band + 0.5) / bands) * sz);
  /* Belegte Ausdehnung entlang `axis` innerhalb eines Bandes der Gegenachse */
  S.extent = (axis, band) => {
    let lo = -1, hi = -1;
    for (let k = 0; k < bands; k++) {
      const on = axis === 'x' ? S.at(k, band) : S.at(band, k);
      if (on) { if (lo < 0) lo = k; hi = k; }
    }
    return lo < 0 ? null : { lo, hi, n: hi - lo + 1 };
  };
  /* Bänder, die über die GANZE Länge laufen: bei einer Wand die tragende Platte, beim Eckteil
     ein Schenkel. Der Rest (Pfeiler, Regal) ist Überstand. */
  S.fullBands = (axis, frac = 0.85) => {
    const out = [];
    for (let b = 0; b < bands; b++) { const e = S.extent(axis, b); if (e && e.n >= frac * bands) out.push(b); }
    return out;
  };
  S.spanOf = (axis, bandList) => (bandList.length
    ? { mid: (S.world(axis, bandList[0]) + S.world(axis, bandList[bandList.length - 1])) / 2,
        w: ((bandList.length) / bands) * (axis === 'x' ? sx : sz) }
    : null);
  return S;
}

/* Öffnungen im AUFRISS messen — die Draufsicht kann sie nicht sehen, und der Name eines Teils ist
   kein Beweis. Projiziert wird auf (Laufachse, Höhe); eine Spalte, in der die Geometrie erst weit
   oben beginnt, ist ein Durchgang, eine Spalte mit Wand unten drunter nur ein Sichtdurchlass.
   Damit ist „begehbar" eine MESSUNG und keine Namensregel.
   Zwei Nebenbefunde, die die Platzierung ändern: `wall_doorway` bringt in derselben Datei ein
   Türblatt-Mesh mit, das die Öffnung füllt (ohne Ausschluss misst man eine zugemauerte Tür), und
   `wall_corner` hat einen Schenkel von 2,0 — eine halbe Fugenlänge. Eine Probe, die stur auf die
   Fugenmitte zielt, kann beides nicht auseinanderhalten. */
export function openingScan(tris, runAxis, bands = 40) {
  const ri = runAxis === 'x' ? 0 : 2;
  let mn = Infinity, mx = -Infinity, my0 = Infinity, my1 = -Infinity;
  for (const t of tris) for (const v of t) {
    if (v[ri] < mn) mn = v[ri]; if (v[ri] > mx) mx = v[ri];
    if (v[1] < my0) my0 = v[1]; if (v[1] > my1) my1 = v[1];
  }
  const sr = (mx - mn) || 1e-6, sy = (my1 - my0) || 1e-6;
  const occ = new Uint8Array(bands * bands);
  const cw = Math.max(sr, sy) / bands;
  const mark = (r, y) => {
    const i = Math.min(bands - 1, Math.max(0, Math.floor(((r - mn) / sr) * bands)));
    const j = Math.min(bands - 1, Math.max(0, Math.floor(((y - my0) / sy) * bands)));
    occ[j * bands + i] = 1;
  };
  for (const [A, B, C] of tris) {
    const el = Math.max(Math.hypot(B[ri] - A[ri], B[1] - A[1]), Math.hypot(C[ri] - B[ri], C[1] - B[1]), Math.hypot(A[ri] - C[ri], A[1] - C[1]));
    const n = Math.min(14, Math.max(1, Math.ceil(el / cw)));
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
      const u = i / n, v = j / n, w = 1 - u - v;
      mark(A[ri] * w + B[ri] * u + C[ri] * v, A[1] * w + B[1] * u + C[1] * v);
    }
  }
  const low = [];
  for (let i = 0; i < bands; i++) {
    let j = 0;
    while (j < bands && !occ[j * bands + i]) j++;
    low.push(j >= bands ? Infinity : my0 + ((j + 0.5) / bands) * sy);
  }
  /* längste zusammenhängende Spaltenfolge, deren Geometrie erst über einem Viertel der Höhe
     beginnt — dort kann man durchgehen */
  const thr = my0 + sy * 0.25;
  let best = null, cur = null;
  for (let i = 0; i <= bands; i++) {
    const open = i < bands && low[i] > thr;
    if (open) cur = cur || { from: i, to: i };
    else if (cur) { cur.to = i - 1; if (!best || cur.to - cur.from > best.to - best.from) best = cur; cur = null; }
    if (open && cur) cur.to = i;
  }
  if (!best) return null;
  const at = (b) => mn + ((b + 0.5) / bands) * sr;
  const lows = low.slice(best.from, best.to + 1).filter((v) => isFinite(v));
  return {
    at: (at(best.from) + at(best.to)) / 2,
    width: ((best.to - best.from + 1) / bands) * sr,
    sill: my0, head: lows.length ? Math.min(...lows) : my1, walkable: true
  };
}

/* Wandrahmen: Laufachse, Plattenmitte (NICHT die Boxmitte — bei wall_pillar liegen die 0,5
   Überstand daneben, und eine an der Boxmitte aufgehängte Wand rutscht um die Hälfte davon von
   der Fuge weg) und der Überstand mit Vorzeichen. */
export function wallFrame(scan) {
  const runAxis = scan.size[0] >= scan.size[2] ? 'x' : 'z';
  const thinAxis = runAxis === 'x' ? 'z' : 'x';
  const ti = thinAxis === 'x' ? 0 : 2, ri = runAxis === 'x' ? 0 : 2;
  const plate = scan.spanOf(thinAxis, scan.fullBands(runAxis, 0.85))
    || { mid: (scan.min[ti] + scan.max[ti]) / 2, w: scan.size[ti] };
  const runMid = (scan.min[ri] + scan.max[ri]) / 2;
  const front = Math.max(scan.max[ti] - (plate.mid + plate.w / 2), 0);
  const back = Math.max((plate.mid - plate.w / 2) - scan.min[ti], 0);
  const over = front - back;
  return {
    runAxis, thinAxis, plateMid: plate.mid, plateThick: plate.w, runMid,
    faceFront: scan.max[ti] - plate.mid, faceBack: plate.mid - scan.min[ti],
    protrude: { sign: Math.abs(over) < 0.06 ? 0 : Math.sign(over), amount: Math.abs(over) },
    anchor: runAxis === 'x' ? [runMid, plate.mid] : [plate.mid, runMid]
  };
}

/* Eckrahmen: wall_corner ist ein L. Das Band, das über die ganze x-Länge läuft, IST der
   x-Schenkel; seine Mitte gibt die z-Achse der Fuge. Umgekehrt für z. Der Schnittpunkt beider
   Schenkelmitten ist der Gelenkpunkt — und genau der muss auf dem Gitterpunkt sitzen, nicht die
   Boxmitte (die liegt beim L um eine halbe Schenkelbreite daneben). */
export function cornerFrame(scan) {
  const legX = scan.spanOf('z', scan.fullBands('x', 0.8));   // x-Schenkel → z-Mitte
  const legZ = scan.spanOf('x', scan.fullBands('z', 0.8));   // z-Schenkel → x-Mitte
  const jz = legX ? legX.mid : (scan.min[2] + scan.max[2]) / 2;
  const jx = legZ ? legZ.mid : (scan.min[0] + scan.max[0]) / 2;
  const cx = (scan.min[0] + scan.max[0]) / 2, cz = (scan.min[2] + scan.max[2]) / 2;
  return {
    joint: [jx, jz],
    arms: [[Math.sign(cx - jx) || 1, 0], [0, Math.sign(cz - jz) || 1]],
    legThick: Math.min(legX ? legX.w : Infinity, legZ ? legZ.w : Infinity)
  };
}

/* Knotenrahmen · S22 — GEMESSEN in `tools/probe-wall-nodes.html`, nicht geraten.
   Verallgemeinert cornerFrame auf beliebige Armzahl: Endstück (1), Ecke (2), T (3), Kreuz (4).
   Ein Arm ist eine PLATTE, die aus der Box herausläuft; erkannt an der Randspanne, die der
   gemessenen Wanddicke entspricht. Zwei Grenzen, beide aus Messwerten:
     · ohne Untergrenze (0,95 × Platte) zählt beim `wall_endcap` die verjüngte Seitenflanke
       (Spanne 0,92 bei Plattendicke 1,00) als Arm mit — das Teil hätte drei Arme statt einem,
     · ohne Obergrenze (1,15 × Platte) zählt bei der geraden `wall` die 4,00 lange Flanke mit.
   Das Gelenk ist der Punkt, der auf den GITTERPUNKT gehört: quer zum Arm die Achse der
   Armplatte, längs zum Arm die Mitte der Gegenarme — und wo es keine Gegenarme gibt (Endstück),
   die Anschlussfläche selbst. Gemessen: wall_endcap Gelenk (0,00 / 0,00), Auskragung 1,07 nach
   aussen, Armweite 0,00 → das letzte Wandmodul bleibt GANZ. wall_Tsplit und wall_crossing haben
   Armweite 2,00 → ihre Nachbarmodule müssen halbiert werden, genau wie bei wall_corner.
   `wall_corner_small` ist damit NICHT zu messen (alle vier Randspannen ≈ Plattendicke) — Ecken
   laufen weiter über cornerFrame. */
export function nodeFrame(scan, plateRef) {
  const B = scan.bands;
  const wx = (i) => scan.min[0] + ((i + 0.5) / B) * scan.size[0];
  const wz = (j) => scan.min[2] + ((j + 0.5) / B) * scan.size[2];
  const span = (list, axis) => {
    if (!list.length) return null;
    const a = axis === 'x' ? wx : wz;
    const lo = a(Math.min(...list)), hi = a(Math.max(...list));
    return { von: lo, bis: hi, mid: (lo + hi) / 2, dick: hi - lo + scan.size[axis === 'x' ? 0 : 2] / B };
  };
  const js = [], je = [], is = [], ie = [];
  for (let j = 0; j < B; j++) { if (scan.at(0, j)) js.push(j); if (scan.at(B - 1, j)) je.push(j); }
  for (let i = 0; i < B; i++) { if (scan.at(i, 0)) is.push(i); if (scan.at(i, B - 1)) ie.push(i); }
  const rand = { '-1,0': span(js, 'z'), '1,0': span(je, 'z'), '0,-1': span(is, 'x'), '0,1': span(ie, 'x') };
  const arms = Object.entries(rand)
    .filter(([, v]) => v && v.dick >= plateRef * 0.95 && v.dick <= plateRef * 1.15)
    .map(([k]) => k.split(',').map(Number));
  const xArme = arms.filter((a) => a[0]), zArme = arms.filter((a) => a[1]);
  const mid = (list) => (list.length ? list.reduce((s, a) => s + rand[a.join(',')].mid, 0) / list.length : null);
  let jz = mid(xArme), jx = mid(zArme);
  if (jx == null) jx = xArme.length === 1 ? (xArme[0][0] > 0 ? scan.max[0] : scan.min[0]) : (scan.min[0] + scan.max[0]) / 2;
  if (jz == null) jz = zArme.length === 1 ? (zArme[0][1] > 0 ? scan.max[2] : scan.min[2]) : (scan.min[2] + scan.max[2]) / 2;
  const reach = {};
  for (const a of arms) {
    reach[a.join(',')] = a[0] ? (a[0] > 0 ? scan.max[0] - jx : jx - scan.min[0])
      : (a[1] > 0 ? scan.max[2] - jz : jz - scan.min[2]);
  }
  return {
    joint: [jx, jz], arms, rand, reach,
    schenkel: arms.length ? Math.max(...Object.values(reach)) : 0,
    legThick: arms.length ? Math.min(...arms.map((a) => rand[a.join(',')].dick)) : null
  };
}

/* Treppenrahmen: Laufachse aus der Box, Steigrichtung aus dem Höhen-Gefälle der Dreiecke
   (Hälfte mit dem höheren Mittel ist oben). Anker ist der FUSSPUNKT, nicht die Mitte. */
export function stairFrame(scan, tris) {
  const runAxis = scan.size[0] >= scan.size[2] ? 'x' : 'z';
  const ai = runAxis === 'x' ? 0 : 2;
  const mid = (scan.min[ai] + scan.max[ai]) / 2;
  let ls = 0, ln = 0, hs = 0, hn = 0;
  for (const t of tris) for (const v of t) { if (v[ai] < mid) { ls += v[1]; ln++; } else { hs += v[1]; hn++; } }
  const ascend = (hn ? hs / hn : 0) >= (ln ? ls / ln : 0) ? 1 : -1;
  const baseRun = ascend > 0 ? scan.min[ai] : scan.max[ai];
  const lateral = runAxis === 'x' ? (scan.min[2] + scan.max[2]) / 2 : (scan.min[0] + scan.max[0]) / 2;
  return {
    runAxis, ascend, run: scan.size[ai], hub: scan.size[1], width: runAxis === 'x' ? scan.size[2] : scan.size[0],
    dir: runAxis === 'x' ? [ascend, 0] : [0, ascend],
    anchor: runAxis === 'x' ? [baseRun, lateral] : [lateral, baseRun]
  };
}

/* Drehung einer Wand: Laufachse muss auf die Fugenachse fallen, der Überstand in die GEWÜNSCHTE
   Zelle zeigen. Beides wird durchprobiert, nicht gerechnet — vier Fälle, keine Vorzeichenfalle. */
export function wallRot(frame, seamRun, into) {
  const nat = frame.runAxis === 'x' ? [1, 0] : [0, 1];
  const pv = frame.protrude.sign
    ? (frame.thinAxis === 'x' ? [frame.protrude.sign, 0] : [0, frame.protrude.sign]) : null;
  let fallback = null;
  for (const deg of [0, 90, 180, 270]) {
    const run = rotVec(nat, deg);
    const runOk = seamRun === 'x' ? Math.abs(run[0]) === 1 : Math.abs(run[1]) === 1;
    if (!runOk) continue;
    if (fallback === null) fallback = deg;
    if (!pv || !into) return deg;
    if (vEq(rotVec(pv, deg), into)) return deg;
  }
  return fallback ?? 0;
}
export function cornerRot(frame, arms) {
  const want = arms.map((a) => a.join(',')).sort().join(';');
  for (const deg of [0, 90, 180, 270]) {
    if (frame.arms.map((a) => rotVec(a, deg).join(',')).sort().join(';') === want) return deg;
  }
  return null;
}
export function dirRot(nat, want) {
  for (const deg of [0, 90, 180, 270]) if (vEq(rotVec(nat, deg), want)) return deg;
  return 0;
}

/* ---------- BSP ----------
   Gewählt, weil BSP ausschliesslich
   achsparallele Rechtecke erzeugt, deren Ecken auf Gitterpunkten liegen, also nur rechte Winkel,
   die wall_corner abdeckt. Ein Verfahren mit diagonalen Räumen wäre mit diesem Pack nicht baubar.
   KORREKTUR S21: die frühere Begründung („das Pack hat kein wall_end, kein T und kein Kreuz")
   ist für 1.1 FALSCH. `wall_endcap`, `wall_half_endcap`, `wall_Tsplit`, `wall_doorway_Tsplit`
   und `wall_crossing` existieren und sind in S21 geladen und vermessen. BSP bleibt die Wahl,
   ist aber keine Zwangslage mehr — freie Enden und T-Knoten wären mit diesen Teilen baubar. */
function bspTree(rect, R, minLeaf, maxDepth) {
  const leaves = [];
  const split = (rc, depth) => {
    const canX = rc.w >= minLeaf * 2, canZ = rc.h >= minLeaf * 2;
    if (depth >= maxDepth || (!canX && !canZ)) { leaves.push(rc); return { leaf: rc }; }
    let axis = canX && canZ ? (rc.w === rc.h ? (R.chance(0.5) ? 'x' : 'z') : (rc.w > rc.h ? 'x' : 'z')) : (canX ? 'x' : 'z');
    if (canX && canZ && R.chance(0.3)) axis = axis === 'x' ? 'z' : 'x';
    const size = axis === 'x' ? rc.w : rc.h;
    const cut = R.int(minLeaf, size - minLeaf);
    const a = axis === 'x' ? { x: rc.x, z: rc.z, w: cut, h: rc.h } : { x: rc.x, z: rc.z, w: rc.w, h: cut };
    const b = axis === 'x' ? { x: rc.x + cut, z: rc.z, w: rc.w - cut, h: rc.h } : { x: rc.x, z: rc.z + cut, w: rc.w, h: rc.h - cut };
    return { axis, a: split(a, depth + 1), b: split(b, depth + 1) };
  };
  const root = split(rect, 0);
  return { root, leaves };
}

function insetRoom(leaf, R) {
  /* Rechts/unten bleibt immer eine Rinne frei, sonst berühren sich zwei Räume und es gibt keinen
     Gang, den man als Gang erkennt. Links/oben ist die Rinne Zufall — das erzeugt die
     unregelmässigen Grundrisse, die eine BSP-Teilung sonst nicht hat. */
  let padL = R.int(0, 1), padT = R.int(0, 1);
  if (leaf.w - padL - 1 < 2) padL = 0;
  if (leaf.h - padT - 1 < 2) padT = 0;
  const w = Math.max(2, leaf.w - padL - 1), h = Math.max(2, leaf.h - padT - 1);
  return { x: leaf.x + padL, z: leaf.z + padT, w: Math.min(w, leaf.w), h: Math.min(h, leaf.h) };
}

function lPath(a, b, horizFirst) {
  const out = []; let x = a[0], z = a[1];
  out.push([x, z]);
  const goX = () => { while (x !== b[0]) { x += Math.sign(b[0] - x); out.push([x, z]); } };
  const goZ = () => { while (z !== b[1]) { z += Math.sign(b[1] - z); out.push([x, z]); } };
  if (horizFirst) { goX(); goZ(); } else { goZ(); goX(); }
  return out;
}

function makeLevel(L, rect, R, minLeaf, maxDepth) {
  const { root, leaves } = bspTree(rect, R, minLeaf, maxDepth);
  const rooms = leaves.map((lf, i) => { lf.room = i; return insetRoom(lf, R); });
  const cells = new Map();
  rooms.forEach((rm, i) => {
    for (let z = rm.z; z < rm.z + rm.h; z++) for (let x = rm.x; x < rm.x + rm.w; x++) {
      cells.set(`${x},${z}`, { level: L, c: x, r: z, kind: 'room', room: i });
    }
  });
  const corridors = [];
  const link = (node) => {
    if (node.leaf) return [node.leaf.room];
    const a = link(node.a), b = link(node.b);
    const ra = rooms[R.pick(a)], rb = rooms[R.pick(b)];
    const path = lPath(
      [Math.floor(ra.x + ra.w / 2), Math.floor(ra.z + ra.h / 2)],
      [Math.floor(rb.x + rb.w / 2), Math.floor(rb.z + rb.h / 2)], R.chance(0.5));
    for (const [x, z] of path) {
      const k = `${x},${z}`;
      if (!cells.has(k)) cells.set(k, { level: L, c: x, r: z, kind: 'corr' });
    }
    corridors.push(path);
    return a.concat(b);
  };
  link(root);
  return { level: L, rect, rooms, cells, corridors };
}

/* Zwei Wege, die nebeneinander laufen, bilden einen 2×2-Block — und ein Gang ist ein Modul breit,
   nicht anderthalb. Eine Zelle des Blocks fällt weg, aber nur wenn der Rest zusammenhängt: sonst
   wäre die Sanierung ein neuer Fehler. Geprüft wird mit einer Breitensuche über die Zellen, nicht
   mit einer Vermutung. */
function thinCorridors(lv, protect = new Set()) {
  const at = (c, r) => lv.cells.get(`${c},${r}`);
  const deg = (cell) => DIRLIST.filter(([, [dx, dz]]) => at(cell.c + dx, cell.r + dz)).length;
  const connectedWithout = (skip) => {
    const all = [...lv.cells.values()].filter((x) => x !== skip);
    if (!all.length) return true;
    const seen = new Set([`${all[0].c},${all[0].r}`]), q = [all[0]];
    while (q.length) {
      const cur = q.pop();
      for (const [, [dx, dz]] of DIRLIST) {
        const nb = at(cur.c + dx, cur.r + dz);
        if (!nb || nb === skip) continue;
        const k = `${nb.c},${nb.r}`;
        if (seen.has(k)) continue;
        seen.add(k); q.push(nb);
      }
    }
    return seen.size === all.length;
  };
  let removed = 0;
  for (let pass = 0; pass < 40; pass++) {
    let hit = null;
    for (const cell of lv.cells.values()) {
      if (cell.kind !== 'corr') continue;
      for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const quad = [cell, at(cell.c + sx, cell.r), at(cell.c, cell.r + sz), at(cell.c + sx, cell.r + sz)];
        if (!quad.every((x) => x && x.kind === 'corr')) continue;
        hit = quad.sort((a, b) => deg(a) - deg(b))
          .find((v) => !protect.has(`${v.c},${v.r}`) && connectedWithout(v));
        if (hit) break;
      }
      if (hit) break;
    }
    if (!hit) break;
    lv.cells.delete(`${hit.c},${hit.r}`);
    removed++;
  }
  return removed;
}

/* Ein Raum, der beim Ausschneiden auf eine Zellbreite abmagert, IST ein Gang — also wird er zu
   einem. Das hält die Prüfung „kein Raum kleiner als 2×2" konstruktiv wahr, statt sie mit einem
   Zwitter zu reissen. */
function starveToCorridor(lv) {
  const byRoom = new Map();
  for (const cell of lv.cells.values()) {
    if (cell.kind !== 'room') continue;
    if (!byRoom.has(cell.room)) byRoom.set(cell.room, []);
    byRoom.get(cell.room).push(cell);
  }
  let changed = 0;
  for (const [, list] of byRoom) {
    const xs = list.map((c) => c.c), zs = list.map((c) => c.r);
    const w = Math.max(...xs) - Math.min(...xs) + 1, h = Math.max(...zs) - Math.min(...zs) + 1;
    if (w >= 2 && h >= 2) continue;
    for (const c of list) { c.kind = 'corr'; delete c.room; changed++; }
  }
  return changed;
}

/* Gebiete = Zusammenhangskomponenten gleicher Zone. Ein Raum kann durch das Ausschneiden in zwei
   Teile fallen; dann sind es zwei Gebiete, nicht ein Raum mit Loch. */
function regionsOf(levels) {
  const regions = [];
  const owner = new Map();
  for (const lv of levels) {
    const zone = (cell) => (cell.kind === 'room' ? 'R' + cell.room : 'C');
    for (const [k, cell] of lv.cells) {
      const id = cellId(lv.level, cell.c, cell.r);
      if (owner.has(id)) continue;
      const rid = regions.length;
      const list = [], q = [cell];
      owner.set(id, rid);
      while (q.length) {
        const cur = q.pop();
        list.push(cur);
        for (const [, [dx, dz]] of DIRLIST) {
          const nb = lv.cells.get(`${cur.c + dx},${cur.r + dz}`);
          if (!nb) continue;
          const nid = cellId(lv.level, nb.c, nb.r);
          if (owner.has(nid) || zone(nb) !== zone(cur)) continue;
          owner.set(nid, rid);
          q.push(nb);
        }
      }
      const xs = list.map((c) => c.c), zs = list.map((c) => c.r);
      regions.push({
        id: rid, level: lv.level, kind: cell.kind, room: cell.room,
        cells: list.map((c) => cellId(lv.level, c.c, c.r)), n: list.length,
        bbox: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)],
        w: Math.max(...xs) - Math.min(...xs) + 1, h: Math.max(...zs) - Math.min(...zs) + 1
      });
      void k;
    }
  }
  return { regions, owner };
}

/* ---------- Der Generator ---------- */
const SOLID_INNER = [['wall', 7], ['wall_cracked', 3.2], ['wall_window_closed', 1.4], ['wall_scaffold', 1],
  ['wall_window_open', 1.1], ['wall_broken', 1.1], ['wall_shelves', 0.9], ['wall_pillar', 1.3]];
/* Nach aussen keine Sichtdurchlässe: hinter einer Aussenwand ist kein Nachbarraum, sondern nichts.
   Ein Fenster ins Leere ist kein Stilmittel, sondern ein Loch im Bild. */
const SOLID_OUTER = [['wall', 8], ['wall_cracked', 3], ['wall_window_closed', 1.2], ['wall_scaffold', 0.8], ['wall_pillar', 1]];

/* ---------- Requisiten-Katalog (S13.4) ----------
   Das Pack hat keine Falle, Statue, Sarkophag, Altar, Käfig (S13, per Ladeversuch) — Bedeutung
   muss aus Fässern, Kisten, Regalen, Betten, Tischen, Knochen, Truhen entstehen. Dieser Katalog
   ist eine KANDIDATENLISTE: die Seite versucht jeden Namen zu laden und reicht nur durch, was
   wirklich existiert und gemessen ist (`propParts`). Ein Name, den es nicht gibt, fällt still
   heraus — dieselbe Regel wie bei den Wandteilen.
   `roles` gewichtet je Raumbedeutung; 0/fehlend heisst: kommt in dieser Bedeutung nicht vor. */
export const PROP_ROLES = [['lager', 3], ['werkstatt', 2], ['wohn', 2.4], ['beinhaus', 1.4], ['schatz', 0.9], ['leer', 1.1]];
export const PROP_CANDIDATES = [
  /* S21-KORREKTUR (2026-09-19): gegen das Register gelesen statt getippt. Die alte Liste hatte
     rund zwanzig Namen, die es im Pack NICHT gibt (`barrel`, `crate`, `bed`, `bookcase`,
     `chest_open`, `bones`, `sack`, `pot`, `bucket`, `ladder`, `coin_stack` …). Sie fielen als
     Kandidaten still heraus — die Räume waren ärmer als das Pack, ohne dass ein Fehler erschien.
     Quelle: registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json, 207 gltf.
     Grosse Teile bleiben in der Liste: der Platzfilter in `assemble()` (Tiefe gegen die
     gemessene Wandfläche, Breite ≤ MOD − 1,2) wirft sie dort heraus, wo sie nicht passen —
     und lässt sie stehen, wo sie passen. */
  { name: 'barrel_large', kind: 'floor', roles: { lager: 7, werkstatt: 3, wohn: 1, schatz: 0.6 } },
  { name: 'barrel_large_decorated', kind: 'floor', roles: { lager: 3, wohn: 1 } },
  { name: 'barrel_small', kind: 'floor', roles: { lager: 4, werkstatt: 2, wohn: 0.8 } },
  { name: 'barrel_small_stack', kind: 'floor', roles: { lager: 3, werkstatt: 1 } },
  { name: 'keg', kind: 'floor', roles: { lager: 3, wohn: 1.4 } },
  { name: 'keg_decorated', kind: 'floor', roles: { lager: 2, wohn: 1 } },
  { name: 'box_large', kind: 'floor', roles: { lager: 6, werkstatt: 4, schatz: 2, wohn: 1 } },
  { name: 'box_small', kind: 'floor', roles: { lager: 4, werkstatt: 3, wohn: 1 } },
  { name: 'box_small_decorated', kind: 'floor', roles: { lager: 2, werkstatt: 2, schatz: 1 } },
  { name: 'box_stacked', kind: 'floor', roles: { lager: 3, werkstatt: 2 } },
  { name: 'crates_stacked', kind: 'floor', roles: { lager: 3, werkstatt: 2 } },
  { name: 'chest', kind: 'floor', roles: { schatz: 7, lager: 2, wohn: 1.4 } },
  { name: 'chest_gold', kind: 'floor', roles: { schatz: 5 } },
  { name: 'trunk_medium_A', kind: 'floor', roles: { schatz: 3, lager: 2 } },
  { name: 'trunk_medium_B', kind: 'floor', roles: { schatz: 3, lager: 2 } },
  { name: 'trunk_medium_C', kind: 'floor', roles: { schatz: 3, lager: 2 } },
  { name: 'trunk_large_A', kind: 'floor', roles: { schatz: 4, lager: 1.5 } },
  { name: 'trunk_large_B', kind: 'floor', roles: { schatz: 4, lager: 1.5 } },
  { name: 'trunk_large_C', kind: 'floor', roles: { schatz: 4, lager: 1.5 } },
  { name: 'coin_stack_small', kind: 'floor', roles: { schatz: 4 } },
  { name: 'coin_stack_medium', kind: 'floor', roles: { schatz: 3 } },
  { name: 'coin_stack_large', kind: 'floor', roles: { schatz: 2.5 } },
  { name: 'bed_decorated', kind: 'floor', roles: { wohn: 6 } },
  { name: 'bed_frame', kind: 'floor', roles: { wohn: 2.5 } },
  { name: 'bed_floor', kind: 'floor', roles: { wohn: 3, beinhaus: 0.6 } },
  { name: 'table_medium', kind: 'floor', roles: { wohn: 4, werkstatt: 5 } },
  { name: 'table_medium_broken', kind: 'floor', roles: { werkstatt: 2, beinhaus: 2 } },
  { name: 'table_medium_tablecloth', kind: 'floor', roles: { wohn: 3 } },
  { name: 'table_small', kind: 'floor', roles: { wohn: 3, werkstatt: 3 } },
  { name: 'table_small_decorated_A', kind: 'floor', roles: { wohn: 2, werkstatt: 2 } },
  { name: 'chair', kind: 'floor', roles: { wohn: 4, werkstatt: 2 } },
  { name: 'stool', kind: 'floor', roles: { wohn: 2.5, werkstatt: 2 } },
  { name: 'shelf_large', kind: 'floor', roles: { wohn: 2, werkstatt: 2, schatz: 1 } },
  { name: 'shelf_small', kind: 'floor', roles: { lager: 3, werkstatt: 3 } },
  { name: 'plate_stack', kind: 'floor', roles: { wohn: 1.2 } },
  { name: 'bottle_A_green', kind: 'floor', roles: { wohn: 1.4, werkstatt: 1.4 } },
  { name: 'bottle_B_brown', kind: 'floor', roles: { wohn: 1.2, lager: 1 } },
  { name: 'sword_shield', kind: 'floor', roles: { schatz: 1.5, wohn: 1 } },
  { name: 'sword_shield_broken', kind: 'floor', roles: { beinhaus: 3, werkstatt: 1 } },
  /* Die Rolle `beinhaus` hat im freien Pack fast nichts: kein Knochen, kein Schädel, kein Sarg.
     Was bleibt, sind Bruch und Schutt — und die sind gross (rubble_half 4,00 × 3,00,
     rubble_large 8,13 × 3,18, gemessen in S21). Der Platzfilter entscheidet, nicht der Name. */
  { name: 'rubble_half', kind: 'floor', roles: { beinhaus: 4, lager: 0.8, werkstatt: 0.8 } },
  { name: 'rubble_large', kind: 'floor', roles: { beinhaus: 2 } },
  { name: 'candle_melted', kind: 'floor', roles: { wohn: 1.4, beinhaus: 1.4, schatz: 0.8 } },
  { name: 'candle_triple', kind: 'floor', roles: { wohn: 1.4, schatz: 0.8 } },
  /* Wandrequisiten: Anker nach der ASYMMETRIE ihrer eigenen Box (S13.3-Messung), nicht nach der
     halben Wanddicke. `frac` ist die Mitte über dem Boden, in Wandhöhen. */
  { name: 'shelves', kind: 'wall', frac: 0.55, roles: { lager: 3, werkstatt: 3, wohn: 2 } },
  { name: 'shelf_small_candles', kind: 'wall', frac: 0.58, roles: { wohn: 3, schatz: 1.5, beinhaus: 1 } },
  /* Banner sind 3,20 hoch bei 4,00 Wandhöhe — Mitte 0,55, sonst steht der Zipfel über der Mauer
     (gemessen in S21). */
  { name: 'banner_shield_white', kind: 'wall', frac: 0.55, roles: { schatz: 3, wohn: 2 } },
  { name: 'banner_yellow', kind: 'wall', frac: 0.55, roles: { schatz: 2, wohn: 1.5 } },
  { name: 'banner_patternA_red', kind: 'wall', frac: 0.55, roles: { wohn: 1.5, schatz: 1 } },
  { name: 'keyring_hanging', kind: 'wall', frac: 0.5, roles: { lager: 2, werkstatt: 2, schatz: 1 } }
];

export function generate(opt) {
  const p = {
    seed: 'A1', grid: 8, density: 0.5, upper: 0.62, levels: 2,
    parts: new Set(), attempts: 40, ...opt
  };
  const minLeaf = p.density > 0.55 ? 3 : 4;
  const maxDepth = 2 + Math.round(p.density * 2);
  const notes = [];
  for (let attempt = 0; attempt < p.attempts; attempt++) {
    const R = rng(p.seed + '#' + attempt);
    /* Die ersten Versuche bestehen auf der geraden Kopffuge. Bleibt sie unlösbar, wird die
       Bedingung fallengelassen — dann steht der Befund im Balken, statt dass die Seite leer
       bleibt. Ein Generator, der nichts liefert, ist nicht strenger, nur nutzloser. */
    const m = assemble(R, { ...p, strict: attempt < Math.floor(p.attempts * 0.75) }, minLeaf, maxDepth, notes);
    if (m) { m.attempt = attempt; m.notes = notes; return m; }
  }
  return { failed: true, notes };
}

function assemble(R, p, minLeaf, maxDepth, notes) {
  const G = p.grid;
  const avail = (n) => p.parts.size === 0 || p.parts.has(n);
  const weights = (list) => list.filter(([n]) => avail(n));

  const lower = makeLevel(0, { x: 0, z: 0, w: G, h: G }, R, minLeaf, maxDepth);
  const thinned = thinCorridors(lower);

  /* ---------- Treppe ZUERST: gemessener Lauf > ein Modul, also braucht sie einen reservierten
     Streifen von zwei Zellen plus die Ankunftszelle oben. Der Rest wird darum gelöst. ---------- */
  const strips = [];
  for (const cell of lower.cells.values()) {
    if (cell.kind !== 'room') continue;
    for (const [dname, [dx, dz]] of DIRLIST) {
      const b = lower.cells.get(`${cell.c + dx},${cell.r + dz}`);
      const c = lower.cells.get(`${cell.c + 2 * dx},${cell.r + 2 * dz}`);
      if (!b || !c || b.kind !== 'room' || c.kind !== 'room') continue;
      if (b.room !== cell.room || c.room !== cell.room) continue;
      /* Seitliche Luft bevorzugen: die gemessene Treppenbreite kann grösser als ein Modul sein,
         dann darf links und rechts keine Wand stehen. */
      const side = [[dz, dx], [-dz, -dx]].filter(([sx, sz]) => {
        const s1 = lower.cells.get(`${cell.c + sx},${cell.r + sz}`);
        const s2 = lower.cells.get(`${b.c + sx},${b.r + sz}`);
        return s1 && s2 && s1.room === cell.room && s2.room === cell.room;
      }).length;
      strips.push({ A: [cell.c, cell.r], B: [b.c, b.r], C: [c.c, c.r], dir: [dx, dz], dname, room: cell.room, side });
    }
  }
  if (!strips.length) { notes.push('kein 3-Zellen-Streifen in einem Raum — neue Saat'); return null; }
  const best = Math.max(...strips.map((s) => s.side));
  const st = R.pick(strips.filter((s) => s.side === best));

  /* ---------- obere Ebene: Teilrechteck, das BEI der Ankunftszelle ENDET ----------
     Erste Fassung setzte das Rechteck zufällig um C — damit lag der Schacht mitten im Obergeschoss
     und seine Kopffuge hatte an BEIDEN Enden ein Eckteil. Zwei Schenkel à 2,0 decken eine Fuge
     von 4 vollständig: der Durchgang war zu, und keine Drehung konnte das retten (die Strahlprobe
     hat es gemeldet, der Solver nicht). Also liegt die Kante der oberen Ebene jetzt genau auf der
     Kopffuge: der Zug läuft dort GERADE durch, kein Eckteil, volle 4 für den Durchgang. */
  const uw = Math.min(G, Math.max(4, Math.round(G * p.upper)));
  const uh = Math.min(G, Math.max(4, Math.round(G * p.upper)));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const [sdx, sdz] = st.dir;
  const ux = sdx === -1 ? clamp(st.C[0] - uw + 1, 0, G - uw)
    : sdx === 1 ? clamp(st.C[0], 0, G - uw)
      : clamp(st.C[0] - R.int(1, Math.max(1, uw - 2)), 0, G - uw);
  const uz = sdz === -1 ? clamp(st.C[1] - uh + 1, 0, G - uh)
    : sdz === 1 ? clamp(st.C[1], 0, G - uh)
      : clamp(st.C[1] - R.int(1, Math.max(1, uh - 2)), 0, G - uh);
  const upper = p.levels > 1 ? makeLevel(1, { x: ux, z: uz, w: uw, h: uh }, R, minLeaf, maxDepth) : null;

  if (upper) {
    upper.cells.delete(`${st.A[0]},${st.A[1]}`);
    upper.cells.delete(`${st.B[0]},${st.B[1]}`);
    /* Kein Boden ohne Boden darunter. Eine obere Zelle über einer Lücke der unteren Ebene
       schwebt — das ist kein Geschoss, das ist ein Fehler mit Aussicht. */
    for (const [k] of [...upper.cells]) if (!lower.cells.has(k)) upper.cells.delete(k);
    if (!upper.cells.has(`${st.C[0]},${st.C[1]}`)) { notes.push('Treppenkopf ohne Boden oben — neue Saat'); return null; }
    if (p.strict) {
      /* Die Kopffuge soll in einem GERADEN Wandzug liegen: dazu müssen die beiden Nachbarn von C
         quer zur Treppe Boden sein und die von B kein Boden. Dann laufen die Nachbarfugen auf
         derselben Linie weiter und an den Endpunkten steht kein Eckteil. */
      const lat = [st.dir[1], -st.dir[0]];
      const has = (c, r) => upper.cells.has(`${c},${r}`);
      const ok = [1, -1].every((sg) =>
        has(st.C[0] + lat[0] * sg, st.C[1] + lat[1] * sg) && !has(st.B[0] + lat[0] * sg, st.B[1] + lat[1] * sg));
      if (!ok) { notes.push('Kopffuge nicht im geraden Zug — neue Saat'); return null; }
    }
    starveToCorridor(upper);
    thinCorridors(upper, new Set([`${st.C[0]},${st.C[1]}`,
      `${st.C[0] + st.dir[1]},${st.C[1] - st.dir[0]}`, `${st.C[0] - st.dir[1]},${st.C[1] + st.dir[0]}`]));
  }

  const levels = upper ? [lower, upper] : [lower];
  let { regions, owner } = regionsOf(levels);

  /* Oben nur behalten, was vom Treppenkopf aus über Fugen erreichbar ist: die Ebenen hängen
     ausschliesslich an der Treppe, also ist ein oberes Gebiet ohne Weg zum Kopf unerreichbar —
     kein Gate kann das nachträglich retten, also wird es nicht gebaut. */
  if (upper) {
    const headRegion = owner.get(cellId(1, st.C[0], st.C[1]));
    const adj = new Map();
    for (const cell of upper.cells.values()) {
      const a = owner.get(cellId(1, cell.c, cell.r));
      for (const [, [dx, dz]] of DIRLIST) {
        const nb = upper.cells.get(`${cell.c + dx},${cell.r + dz}`);
        if (!nb) continue;
        const b = owner.get(cellId(1, nb.c, nb.r));
        if (a === b) continue;
        if (!adj.has(a)) adj.set(a, new Set());
        adj.get(a).add(b);
      }
    }
    const keep = new Set([headRegion]), q = [headRegion];
    while (q.length) for (const n of adj.get(q.pop()) || []) if (!keep.has(n)) { keep.add(n); q.push(n); }
    const dropped = regions.filter((rg) => rg.level === 1 && !keep.has(rg.id));
    for (const rg of dropped) for (const id of rg.cells) {
      const [, cr] = id.split(':');
      upper.cells.delete(cr);
    }
    if (dropped.length) ({ regions, owner } = regionsOf(levels));
    /* Ein Obergeschoss aus drei Zellen ist kein Geschoss, sondern ein Podest. Solange die Saat
       Spielraum hat, wird nachgew\u00fcrfelt. */
    if (p.strict && upper.cells.size < 6) { notes.push('Obergeschoss zu klein \u2014 neue Saat'); return null; }
  }

  const cells = new Map();

  /* Ein Gang, der einen Raum durchquert, schneidet ihn in zwei Gebiete — und eines davon kann eine
     Zelle breit sein. Ein solches Gebiet ist kein Raum mit Mangel, es ist ein Gang. Umgewidmet,
     damit „kein Raum kleiner 2×2" wahr ist statt gemeldet. */
  let slivers = 0;
  for (const rg of regions) {
    if (rg.kind !== 'room' || (rg.w >= 2 && rg.h >= 2)) continue;
    rg.kind = 'corr'; rg.sliver = true; slivers++;
    const lv = levels.find((l) => l.level === rg.level);
    for (const id of rg.cells) {
      const cell = lv.cells.get(id.split(':')[1]);
      if (cell) { cell.kind = 'corr'; delete cell.room; }
    }
  }

  for (const lv of levels) for (const cell of lv.cells.values()) {
    const id = cellId(lv.level, cell.c, cell.r);
    cells.set(id, { ...cell, region: owner.get(id) });
  }
  /* ---------- Fugen: ein Set mit kanonischem Schlüssel ---------- */
  const seams = new Map();
  let visits = 0;
  for (const cell of cells.values()) {
    for (const [, [dx, dz]] of DIRLIST) {
      const nc = cell.c + dx, nr = cell.r + dz;
      const idA = cellId(cell.level, cell.c, cell.r), idB = cellId(cell.level, nc, nr);
      const k = seamKey(idA, idB);
      visits++;
      if (seams.has(k)) continue;
      const nb = cells.get(idB);
      /* Endpunkte der Fuge als GITTERPUNKTE. Sie entscheiden später über das Bauteil: das
         gemessene wall_corner reicht von seinem Gelenk 2,0 in jede Schenkelrichtung, also genau
         bis zur Mitte der Nachbarfuge — eine Ecke verbraucht die HALBE Nachbarfuge. */
      const gc = Math.max(cell.c, nc), gr = Math.max(cell.r, nr);
      const pts = dx ? [`${cell.level}|${gc},${gr}`, `${cell.level}|${gc},${gr + 1}`]
        : [`${cell.level}|${gc},${gr}`, `${cell.level}|${gc + 1},${gr}`];
      seams.set(k, {
        key: k, level: cell.level, a: [cell.c, cell.r], b: [nc, nr],
        run: dx ? 'z' : 'x',                       // Fuge zwischen O/W-Nachbarn läuft entlang z
        mid: [cell.c + dx / 2, cell.r + dz / 2], pts,
        ra: cell.region, rb: nb ? nb.region : null,
        kind: nb ? (nb.region === cell.region ? 'open' : 'pending')
          /* Eine Kante der oberen Ebene über einem Boden der UNTEREN ist eine Balkonkante, keine
             Aussenwand — dort gehört eine Brüstung hin, nicht vier Meter Stein. Gemessen:
             `barrier` 4,00 × 1,10 × 0,50, steht auf dem Boden. Das ist die fünfte Fugenklasse
             `rail`: trägt ein Objekt, sperrt den Weg, bildet aber KEINEN Wandzug (das Pack hat
             keine Brüstungsecke und kein halbes Stück). Vorlage: das dritte KayKit-Promobild. */
          : (cell.level > 0 && lower.cells.has(`${nc},${nr}`) && avail('barrier') ? 'rail' : 'solid')
      });
    }
  }

  /* Treppenkopf VOR den Ecken festlegen: er trägt ein Objekt (wall_doorway), also ändert er die
     Armtopologie. Ein Loch wäre zwei freie Wandenden, und das Pack hat kein wall_end. */
  let headSeam = null;
  if (upper) {
    headSeam = seamKey(cellId(1, st.C[0], st.C[1]), cellId(1, st.B[0], st.B[1]));
    const hs = seams.get(headSeam);
    if (hs) { hs.kind = 'door'; hs.stairHead = true; }
  }

  /* ---------- Ecken und Züge · VOR der Bauteilwahl ----------
   Die Armtopologie hängt nur daran, ob eine Fuge ein Objekt trägt (open oder nicht) — und das
   steht schon fest. Die Ecken müssen deshalb zuerst berechnet werden: erst danach ist bekannt,
   welche Fuge noch 4 Einheiten frei hat (voller Durchgang möglich), welche nur 2 (wall_half) und
   welche gar keine (beide Schenkel füllen sie ganz aus). */
  const armsAt = new Map();
  const addArm = (L, i, j, d, hard) => {
    const k = `${L}|${i},${j}`;
    if (!armsAt.has(k)) armsAt.set(k, { level: L, i, j, arms: new Set(), hard: new Set() });
    armsAt.get(k).arms.add(d);
    if (hard) armsAt.get(k).hard.add(d);
  };
  for (const s of seams.values()) {
    if (s.kind === 'open') continue;
    const hard = s.kind !== 'rail';
    const c = Math.max(s.a[0], s.b[0]), r = Math.max(s.a[1], s.b[1]);
    if (s.run === 'z') { addArm(s.level, c, r, 'S', hard); addArm(s.level, c, r + 1, 'N', hard); }
    else { addArm(s.level, c, r, 'E', hard); addArm(s.level, c + 1, r, 'W', hard); }
  }
  const corners = [], freeEnds = [], junctions = [], cornerAt = new Set();
  let wallMeetsRail = 0;
  for (const [k, pt] of armsAt) {
    const a = [...pt.arms], h = [...pt.hard];
    /* Ein einzeln endender Brüstungsarm ist kein freies Wandende — eine Brüstung DARF am
       Treppenauge aufhören, eine Wand nicht. */
    if (a.length === 1) { if (h.length) freeEnds.push(pt); continue; }
    if (h.length && h.length < a.length) wallMeetsRail++;
    if (h.length < 2) continue;                       // keine zwei Wandarme → kein Eckteil
    if (h.length === 2) {
      if ((h.includes('N') && h.includes('S')) || (h.includes('E') && h.includes('W'))) continue;
      corners.push({ level: pt.level, i: pt.i, j: pt.j, dirs: h, arms: h.map((d) => DIR[d]) });
      cornerAt.add(k);
      continue;
    }
    junctions.push({ ...pt, arms: h });   // T oder Kreuz: beide Züge laufen durch, kein Teil nötig
  }
  const freeLen = (s) => s.pts.filter((k) => !cornerAt.has(k)).length;   // 2 = ganze Fuge frei
  if (p.strict && headSeam && seams.get(headSeam) && freeLen(seams.get(headSeam)) < 2) {
    notes.push('Treppenkopf zwischen zwei Eckteilen — neue Saat');
    return null;
  }

  /* ---------- Verbindungen: Spannbaum über die Gebiete, Treppe als erste Kante ---------- */
  const pairs = new Map();
  for (const s of seams.values()) {
    if (s.kind !== 'pending') continue;
    const pk = Math.min(s.ra, s.rb) + '/' + Math.max(s.ra, s.rb);
    if (!pairs.has(pk)) pairs.set(pk, { a: Math.min(s.ra, s.rb), b: Math.max(s.ra, s.rb), seams: [] });
    pairs.get(pk).seams.push(s);
  }
  const parent = new Map(regions.map((r) => [r.id, r.id]));
  const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra === rb) return false; parent.set(ra, rb); return true; };

  const stairLow = owner.get(cellId(0, st.B[0], st.B[1]));
  const stairHigh = upper ? owner.get(cellId(1, st.C[0], st.C[1])) : null;
  if (upper) union(stairLow, stairHigh);

  const pDoorExtra = 0.12 + 0.45 * p.density;
  /* `gate` war praktisch unerreichbar: die Gebiets-Adjazenz ist fast ein Baum (gemessen über 45
     Grundrisse: 629 Paare, 618 davon Baumkanten), also gab es kaum ein unverbundenes Paar, dem
     ein Gitter zufallen konnte — in jedem sichtbaren Build stand „0 gate", obwohl die Klasse im
     Vertrag steht. Richtig ist die ZWEITE Fuge eines schon verbundenen Paares: eine trägt die
     Tür, eine weitere darf `wall_gated` sein. Semantisch genau die Klasse — sichtbar, nicht
     begehbar — und der Wegegraph zählt sie ohnehin als geschlossen. */
  const pGate = 0.2 + 0.4 * p.density;
  const tree = [];
  let doorsCramped = 0, gateSlots = 0;
  for (const pr of R.shuffle([...pairs.values()])) {
    const inTree = union(pr.a, pr.b);
    const door = inTree || R.chance(pDoorExtra);
    /* Ein Durchgang ist 4 lang und nicht kürzbar — das Pack hat keinen halben Durchgang. Er
       braucht also eine Fuge mit ZWEI freien Gitterpunkten, sonst deckt ein Eckschenkel die halbe
       Öffnung. T-Knoten sind kein Problem: dort läuft der Zug durch, es steht kein Eckteil. */
    const roomy = pr.seams.filter((s) => freeLen(s) === 2);
    if (roomy.length > 1) gateSlots++;
    if (door) {
      const chosen = roomy.length ? R.pick(roomy) : R.pick(pr.seams);
      chosen.kind = 'door';
      if (inTree) tree.push(pr);
      const spare = roomy.filter((s) => s !== chosen);
      if (spare.length && avail('wall_gated') && R.chance(pGate)) R.pick(spare).kind = 'gate';
    } else if (avail('wall_gated') && R.chance(pGate) && roomy.length) {
      R.pick(roomy).kind = 'gate';
    }
    for (const s of pr.seams) if (s.kind === 'pending') s.kind = 'solid';
  }

  /* ---------- Bauteil je Fuge ----------
     Die Länge folgt aus den Ecken, nicht aus dem Geschmack: wall_corner verbraucht 2,0 der
     Nachbarfuge (gemessene Schenkellänge), also bleibt bei einer Ecke am Ende genau wall_half
     übrig und bei zwei Ecken NICHTS — die beiden Schenkel treffen sich in der Fugenmitte. Wer
     dort eine volle Wand setzt, schiebt sie zur Hälfte in das Eckteil. Genau diese Verschneidung
     hat die erste Fassung als „8 Durchdringungen" gemeldet.
     Die Klasse dagegen ist frei: solid-Varianten sind reine Varianz. */
  const regionById = new Map(regions.map((r) => [r.id, r]));
  let halves = 0, covered = 0, cramped = 0;
  for (const s of seams.values()) {
    if (s.kind === 'open') continue;
    const free = freeLen(s);
    s.halfShift = 0;
    /* Auf welcher Hälfte der Fuge darf eine Öffnung liegen? Nicht dort, wo ein Eckschenkel
       2,0 der Fuge belegt. pts[0] liegt eine halbe Fugenlänge in der negativen Laufrichtung. */
    s.openPref = cornerAt.has(s.pts[0]) ? 1 : cornerAt.has(s.pts[1]) ? -1 : 0;
    if (s.kind === 'door') { s.part = 'wall_doorway'; if (free < 2) doorsCramped++; }
    else if (s.kind === 'gate') { s.part = 'wall_gated'; }
    else if (s.kind === 'rail') { s.part = 'barrier'; }
    else if (free === 0) { s.part = null; s.covered = true; covered++; }
    else if (free === 1) {
      s.part = avail('wall_half') ? 'wall_half' : 'wall';
      if (!avail('wall_half')) cramped++; else halves++;
      s.halfShift = cornerAt.has(s.pts[0]) ? 1 : -1;   // in die freie Hälfte schieben
    } else {
      const outer = s.rb === null || s.ra === null;
      const list = weights(outer ? SOLID_OUTER : SOLID_INNER);
      s.part = list.length ? R.weighted(list) : 'wall';
      if (p.density < 0.3 && R.chance(0.5)) s.part = 'wall';
    }
    if (!s.part) continue;
    /* Wohin darf der Überstand ragen? Nie nach draussen, sonst klebt ein Pfeiler an der
       Aussenwand im Nichts. Sonst in das GRÖSSERE Gebiet — ein Gang ist ein Modul breit, dort
       kostet ein halbes Modul Pfeiler am meisten. */
    const dir = [s.b[0] - s.a[0], s.b[1] - s.a[1]];
    const na = s.ra === null ? -1 : (regionById.get(s.ra)?.n ?? 0);
    const nb = s.rb === null ? -1 : (regionById.get(s.rb)?.n ?? 0);
    s.into = nb > na ? dir : [-dir[0], -dir[1]];
  }

  /* ---------- Böden: Material je Gebiet, das ist die ganze Raumsprache ohne Requisiten ---------- */
  const floorLarge = ['floor_tile_large', 'floor_wood_large', 'floor_dirt_large'].filter(avail);
  const roomFloor = [['floor_tile_large', 5], ['floor_wood_large', 2.5], ['floor_dirt_large', 1.5]].filter(([n]) => avail(n));
  for (const rg of regions) {
    rg.floor = rg.kind === 'room'
      ? (roomFloor.length ? R.weighted(roomFloor) : floorLarge[0])
      : (avail('floor_dirt_large') ? 'floor_dirt_large' : floorLarge[0]);
  }
  for (const cell of cells.values()) {
    cell.floor = regionById.get(cell.region)?.floor || floorLarge[0];
    cell.floorRot = R.pick([0, 90, 180, 270]);
  }

  /* ---------- Fackeln: gefordert als Gate, also aus dem Modell, nicht aus Deko-Laune.
     Nur auf Fugen ohne Überstand — ein Regal und eine Fackel auf derselben Wand ist doppelt
     belegt, und genau das soll die Fugenliste verhindern. ---------- */
  const torches = [];
  if (p.parts.size === 0 || p.parts.has('torch_mounted')) {
    /* Nur auf Wänden ohne Überstand — ein Regal und eine Fackel auf derselben Wand wäre die
       Doppelbelegung, die die Fugenliste gerade verhindert. wall_half ist erlaubt, aber die Fackel
       kommt dann in die Mitte der HALBEN Wand, nicht in die Fugenmitte: dort steht der
       Eckschenkel. */
    const plain = new Set(['wall', 'wall_cracked', 'wall_window_closed', 'wall_half']);
    for (const rg of regions) {
      if (rg.kind !== 'room') continue;
      const cand = [];
      for (const s of seams.values()) {
        if (s.level !== rg.level || s.kind !== 'solid' || !plain.has(s.part)) continue;
        const side = s.ra === rg.id ? 1 : s.rb === rg.id ? -1 : 0;
        if (!side) continue;
        const dir = [s.b[0] - s.a[0], s.b[1] - s.a[1]];
        const sh = (s.halfShift || 0) * 0.25;
        cand.push({
          seam: s, part: s.part, full: s.part !== 'wall_half',
          mid: s.run === 'z' ? [s.mid[0], s.mid[1] + sh] : [s.mid[0] + sh, s.mid[1]],
          into: side === 1 ? [-dir[0], -dir[1]] : dir
        });
      }
      const want = Math.max(1, Math.round(rg.n / 6));
      const sorted = R.shuffle(cand).sort((a, b) => (b.full ? 1 : 0) - (a.full ? 1 : 0));
      for (const c of sorted.slice(0, want)) {
        torches.push({ level: rg.level, region: rg.id, seam: c.seam.key, part: c.part, mid: c.mid, into: c.into, run: c.seam.run });
      }
      rg.torches = Math.min(want, cand.length);
    }
  }

  /* ---------- Kerzen: Licht aus einem BAUTEIL, nicht aus einer gemalten Kugel ----------
     Georgs Regel: keine gebastelten Artefakte. Also ist eine Lichtquelle ein Gegenstand des Packs
     — `torch_mounted` an der Wand, `candle` (gemessen 0,33 × 0,87 × 0,33) auf dem Boden. Gesetzt
     wird sie dort, wo das RASTER sagt, dass kein Fackellicht hinkommt: eine Aussage über den
     Grundriss, nicht über die Kamera. Und sie steht in der ECKE einer Zelle an zwei Wänden —
     Requisiten an die Ränder, Mitte frei, damit der Wegegraph unberührt bleibt. */
  const candles = [];
  /* Die "_lit"-Varianten des Packs tragen ihre Flamme am Docht mit (candle_lit 1,05 gegen candle
     0,87 — die Differenz IST das Feuer). Aus Georgs Asset-Übergabe kamen drei Paare dazu, also
     wird gewürfelt statt immer dasselbe zu setzen: dünne Kerze, dicke Kerze, Standfackel. */
  const LIGHT_PROPS = [['candle_lit', 5], ['candle_thin_lit', 3.5], ['torch_lit', 1.4], ['candle', 0.6]];
  /* Die Seite gibt vor, welche Leuchtbauteile eine gelöste, eigenleuchtende Flamme haben — nur
     die werden gesetzt. */
  const litParts = LIGHT_PROPS.filter(([n]) => avail(n) && (!p.lightParts || p.lightParts.includes(n)));
  if (litParts.length) {
    const litR = p.litRadius ?? 2.5;
    const stairStrip = new Set([st.A.join(','), st.B.join(','), st.C.join(',')]);
    const walled = (level, c, r, dx, dz) => {
      const s = seams.get(seamKey(cellId(level, c, r), cellId(level, c + dx, r + dz)));
      return s && s.kind !== 'open';
    };
    for (const rg of regions) {
      if (rg.kind !== 'room') continue;
      let placed = 0;
      for (const id of rg.cells) {
        if (placed >= 3) break;
        const cell = cells.get(id);
        if (!cell || (cell.level === 0 && stairStrip.has(`${cell.c},${cell.r}`))) continue;
        const near = torches.some((t) => t.level === cell.level
          && Math.hypot(cell.c - t.mid[0], cell.r - t.mid[1]) <= litR);
        if (near) continue;
        let best = null;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const px = seams.get(seamKey(cellId(cell.level, cell.c, cell.r), cellId(cell.level, cell.c + sx, cell.r)));
          const pz = seams.get(seamKey(cellId(cell.level, cell.c, cell.r), cellId(cell.level, cell.c, cell.r + sz)));
          const score = (px && px.kind !== 'open' ? 1 : 0) + (pz && pz.kind !== 'open' ? 1 : 0);
          if (!best || score > best.score) {
            best = { corner: [sx, sz], score, faces: [px && px.kind !== 'open' ? px.part : null, pz && pz.kind !== 'open' ? pz.part : null] };
          }
        }
        candles.push({ level: cell.level, region: rg.id, part: R.weighted(litParts), cell: [cell.c, cell.r], corner: best.corner, walls: best.score, faces: best.faces });
        placed++;
      }
      rg.candles = placed;
    }
  }

  /* ---------- Requisiten (S13.4) · Bedeutung UND Streu ----------
     Georgs Wahl: der Raumtyp bestimmt die Streuung, Dichte ~30 %, Requisiten stehen an den
     RÄNDERN, die Zellmitte bleibt frei. Damit bleibt der Wegegraph strukturell unberührt —
     eine Requisite sitzt in einer Zelle, nie auf einer Fuge, und die Fugenliste bleibt die
     einzige Quelle für Begehbarkeit.
     Der Platz wird hier GERECHNET, nicht geschätzt: Abstand von der Zellmitte = halbe Zelle
     minus die gemessene Aussenfläche DIESER Wand (`faces`, nicht die Nenndicke) minus halbe
     Tiefe der Requisite. Was danach nicht mindestens 0,30 vor der Zellmitte endet, wird nicht
     gesetzt, sondern gezählt. */
  const props = [];
  const propFloorCat = (p.propParts || []).filter((x) => x.kind === 'floor' && avail(x.name));
  const propWallCat = (p.propParts || []).filter((x) => x.kind === 'wall' && avail(x.name));
  const propReject = { protrude: 0, torch: 0, candle: 0, noSlot: 0, tooBig: 0, stair: 0 };
  if ((p.propDensity ?? 0) > 0 && (propFloorCat.length || propWallCat.length)) {
    const M = p.mod ?? 4;
    const faceOf = (nm) => (p.faces && p.faces[nm] != null ? p.faces[nm] : M / 8);
    const torchSeams = new Set(torches.map((t) => t.seam));
    const candleCells = new Set(candles.map((c) => `${c.level}:${c.cell[0]},${c.cell[1]}`));
    const strip = new Set([st.A.join(','), st.B.join(','), st.C.join(',')]);
    /* Nur glatte Platten tragen eine Wandrequisite: wall_cracked ist dicker als seine Platte, und
       die gemessene Flaeche liegt hinter der Ausbuchtung — das Banner steckte dort 0,11 in der
       Wand. wall_window_closed ebenso ausgenommen, sonst haengt ein Regal im Fenster. */
    const plainWall = new Set(['wall', 'wall_half']);
    /* Balkonkante freihalten: `barrier` ist 1,10 hoch und 0,50 tief und steht auf der Fuge, nicht
       in der Zelle — eine Requisite daneben verschneidet sich mit ihr (gemessen: Banner 0,37 in
       die Brüstung). Also keine Requisite in einer Zelle an einer Brüstung und keine
       Wandrequisite auf einer Fuge, die einen Gitterpunkt mit ihr teilt. */
    const railCells = new Set();
    const railPts = new Set();
    for (const s of seams.values()) {
      if (s.kind !== 'rail') continue;
      railCells.add(cellId(s.level, s.a[0], s.a[1]));
      railCells.add(cellId(s.level, s.b[0], s.b[1]));
      for (const k of s.pts || []) railPts.add(k);
    }
    const usedSeam = new Set();
    /* Eine Wandrequisite darf nicht über einer Bodenrequisite an DERSELBEN Wandseite hängen:
       `shelves` steht 0–1,95 auf dem Boden und hängt 1,22–3,18 an der Wand — gemessen 0,44
       Durchdringung. Der Schlüssel ist Fuge + Seite, nicht nur die Fuge: gegenüber, im anderen
       Raum, ist die Wand frei. */
    const takenSide = new Set();
    for (const rg of regions) {
      if (rg.kind !== 'room') continue;
      rg.role = R.weighted(PROP_ROLES);
      rg.props = 0;
      if (rg.role === 'leer') continue;
      const want = Math.max(1, Math.round(rg.n * p.propDensity));
      const fitRole = propFloorCat.filter((x) => (x.roles[rg.role] || 0) > 0);
      for (const id of R.shuffle([...rg.cells])) {
        if (!fitRole.length || rg.props >= want) break;
        const cell = cells.get(id);
        if (!cell) continue;
        if (cell.level === 0 && strip.has(`${cell.c},${cell.r}`)) { propReject.stair++; continue; }
        if (candleCells.has(`${cell.level}:${cell.c},${cell.r}`)) { propReject.candle++; continue; }
        if (railCells.has(id)) { propReject.rail = (propReject.rail || 0) + 1; continue; }
        const slots = [];
        for (const [, [dx, dz]] of DIRLIST) {
          const s = seams.get(seamKey(id, cellId(cell.level, cell.c + dx, cell.r + dz)));
          if (!s || s.kind !== 'solid' || !s.part) continue;
          if (torchSeams.has(s.key)) { propReject.torch++; continue; }
          /* Ein Teil mit Überstand frisst genau hier den Platz (wall_pillar 0,24 beidseitig,
             wall_shelves 0,36 einseitig) — an dieser Fuge steht keine Requisite. */
          if (p.protruders && p.protruders.has(s.part)) { propReject.protrude++; continue; }
          if (takenSide.has(`${s.key}:${dx},${dz}`)) continue;
          slots.push({ dir: [dx, dz], seam: s });
        }
        if (!slots.length) { propReject.noSlot++; continue; }
        /* In einer Zelle MIT Durchgang bleibt der Gehkorridor frei: die Strahlprobe tastet die
           Tür auf ± 0,6 quer ab, ein Tisch mit 0,55 freier Mitte hat sie gerade versperrt
           (gemessen, Fuge 3.5,6). Also 0,70 dort, 0,30 in einer Zelle ohne Durchgang. */
        const hasDoor = DIRLIST.some(([, [dx, dz]]) => {
          const s = seams.get(seamKey(id, cellId(cell.level, cell.c + dx, cell.r + dz)));
          return s && s.kind === 'door';
        });
        const free = hasDoor ? 0.70 : 0.30;
        const slot = R.shuffle(slots)[0];
        const room = M / 2 - faceOf(slot.seam.part);
        /* Quer zur Wand muss die Ecke frei bleiben: ein wall_corner-Schenkel ist 2,0 lang und
           1,0 dick, der Bereich 0,5 um die Wandlinie ist an einer Ecke ganz belegt. */
        const fits = fitRole.filter((x) => room - x.size[2] - 0.15 >= free && x.size[0] <= M - 1.2);
        if (!fits.length) { propReject.tooBig++; continue; }
        const name = R.weighted(fits.map((x) => [x.name, x.roles[rg.role]]));
        const it = fits.find((x) => x.name === name);
        const off = +(room - it.size[2] / 2 - 0.15).toFixed(3);
        props.push({
          level: cell.level, region: rg.id, role: rg.role, kind: 'floor', part: name,
          cell: [cell.c, cell.r], dir: slot.dir, seam: slot.seam.key, wallPart: slot.seam.part,
          off, inner: +(off - it.size[2] / 2).toFixed(3), w: it.size[0], d: it.size[2]
        });
        rg.props++;
        takenSide.add(`${slot.seam.key}:${slot.dir[0]},${slot.dir[1]}`);
      }
      /* Wandrequisiten hängen über dem Boden — sie kosten keinen Weg, brauchen aber eine glatte
         Fuge ohne Fackel und teilen keine Fuge mit einer anderen Requisite. */
      const wallRole = propWallCat.filter((x) => (x.roles[rg.role] || 0) > 0);
      const nWall = Math.round(rg.n * p.propDensity * 0.35);
      if (wallRole.length && nWall > 0) {
        const cand = [];
        for (const s of seams.values()) {
          if (s.level !== rg.level || s.kind !== 'solid' || !plainWall.has(s.part)) continue;
          if (torchSeams.has(s.key) || usedSeam.has(s.key)) continue;
          if ((s.pts || []).some((k) => railPts.has(k))) { propReject.rail = (propReject.rail || 0) + 1; continue; }
          /* Seite der Fuge, auf der diese Wandrequisite hängt: `into` zeigt in die Zelle, der
             Slot-Schlüssel der Bodenrequisite zeigt zur Wand — also das Gegenteil. */
          const dirw = [s.b[0] - s.a[0], s.b[1] - s.a[1]];
          const sidev = s.ra === rg.id ? [dirw[0], dirw[1]] : [-dirw[0], -dirw[1]];
          if (takenSide.has(`${s.key}:${sidev[0]},${sidev[1]}`)) continue;
          const side = s.ra === rg.id ? 1 : s.rb === rg.id ? -1 : 0;
          if (!side) continue;
          const dir = [s.b[0] - s.a[0], s.b[1] - s.a[1]];
          const sh = (s.halfShift || 0) * 0.25;
          cand.push({
            s, mid: s.run === 'z' ? [s.mid[0], s.mid[1] + sh] : [s.mid[0] + sh, s.mid[1]],
            into: side === 1 ? [-dir[0], -dir[1]] : dir
          });
        }
        for (const c of R.shuffle(cand).slice(0, nWall)) {
          usedSeam.add(c.s.key);
          takenSide.add(`${c.s.key}:${-c.into[0]},${-c.into[1]}`);
          const name = R.weighted(wallRole.map((x) => [x.name, x.roles[rg.role]]));
          const it = wallRole.find((x) => x.name === name);
          props.push({
            level: rg.level, region: rg.id, role: rg.role, kind: 'wall', part: name,
            seam: c.s.key, wallPart: c.s.part, mid: c.mid, into: c.into, frac: it.frac ?? 0.6
          });
          rg.props++;
        }
      }
    }
  }

  /* ---------- Prüfungen im Modell (die gerenderten kommen in der Seite dazu) ---------- */
  const walk = new Map(regions.map((r) => [r.id, []]));
  for (const s of seams.values()) {
    if (s.ra === null || s.rb === null) continue;
    if (s.kind === 'door' || s.kind === 'open') { walk.get(s.ra)?.push(s.rb); walk.get(s.rb)?.push(s.ra); }
  }
  if (upper) { walk.get(stairLow)?.push(stairHigh); walk.get(stairHigh)?.push(stairLow); }
  const seen = new Set([regions[0].id]), q = [regions[0].id];
  while (q.length) for (const n of walk.get(q.pop()) || []) if (!seen.has(n)) { seen.add(n); q.push(n); }
  const islands = regions.filter((r) => !seen.has(r.id));

  const corrWide = [];
  for (const lv of levels) for (const cell of lv.cells.values()) {
    if (cell.kind !== 'corr') continue;
    const at = (dx, dz) => lv.cells.get(`${cell.c + dx},${cell.r + dz}`);
    if ([at(1, 0), at(0, 1), at(1, 1)].every((n) => n && n.kind === 'corr')) corrWide.push([cell.c, cell.r, lv.level]);
  }
  const smallRooms = regions.filter((r) => r.kind === 'room' && (r.w < 2 || r.h < 2));
  const darkRooms = regions.filter((r) => r.kind === 'room' && !r.torches);

  const wallSeams = [...seams.values()].filter((s) => s.kind !== 'open' && s.part);
  return {
    seed: p.seed, params: { ...p, parts: [...p.parts], minLeaf, maxDepth },
    grid: G, levels: levels.map((l) => ({ level: l.level, rect: l.rect, rooms: l.rooms })),
    cells, seams, regions, corners, junctions, freeEnds, torches, candles, props,
    stair: { ...st, part: p.parts.has('stairs_wood') ? 'stairs_wood' : (p.parts.has('stairs') ? 'stairs' : null), headSeam, low: stairLow, high: stairHigh },
    graph: { tree: tree.length, pairs: pairs.size, islands, reached: seen.size },
    checks: {
      seamVisits: visits, seams: seams.size, doubled: 0,
      walls: wallSeams.length, halves, covered, cramped, doorsCramped, slivers, thinned, gateSlots,
      rails: wallSeams.filter((s) => s.kind === 'rail').length, wallMeetsRail,
      halfMissing: !avail('wall_half'),
      doors: wallSeams.filter((s) => s.kind === 'door').length,
      gates: wallSeams.filter((s) => s.kind === 'gate').length,
      open: seams.size - wallSeams.length,
      freeEnds: freeEnds.length, corners: corners.length, junctions: junctions.length,
      corrWide, smallRooms, darkRooms, islands,
      candles: candles.length, candlesInCorner: candles.filter((c) => c.walls === 2).length,
      props: props.length,
      propsFloor: props.filter((x) => x.kind === 'floor').length,
      propsWall: props.filter((x) => x.kind === 'wall').length,
      propCells: new Set(props.filter((x) => x.kind === 'floor').map((x) => `${x.level}:${x.cell}`)).size,
      roomCells: regions.filter((r) => r.kind === 'room').reduce((s2, r) => s2 + r.n, 0),
      propRoles: regions.filter((r) => r.kind === 'room').reduce((m, r) => { m[r.role || '—'] = (m[r.role || '—'] || 0) + 1; return m; }, {}),
      propMinInner: props.filter((x) => x.kind === 'floor').reduce((m, x) => Math.min(m, x.inner), Infinity),
      propReject
    }
  };
}

/* ---------- Vom Modell zu Platzierungen ----------
   kit = { MOD, HUB, WALL_H, WALL_THICK, box:{name:{min,max,size}}, frame:{name:rahmen} }
   Jede Position ist Ziel minus GEDREHTER Anker. Nie „Boxmitte" als Anker für ein Teil mit
   Überstand — das ist der halbe Modul, der in S13 als teuerster Fehler des Packs beschrieben ist. */
export function layout(model, kit, opt = {}) {
  const { MOD, HUB } = kit;
  const out = [];
  const box = (n) => kit.box[n];
  const put = (name, anchor, target, deg, y, extra) => {
    const a = rotVec(anchor, deg);
    out.push({ a: 'dungeon:' + name, p: [target[0] - a[0], y, target[1] - a[1]], r: deg, ...extra });
  };
  const boxMid = (n) => { const b = box(n); return [(b.min[0] + b.max[0]) / 2, (b.min[2] + b.max[2]) / 2]; };

  for (const cell of model.cells.values()) {
    const b = box(cell.floor); if (!b) continue;
    put(cell.floor, boxMid(cell.floor), [cell.c * MOD, cell.r * MOD], cell.floorRot,
      cell.level * HUB - b.max[1], { layer: 'floor', level: cell.level, cell: [cell.c, cell.r], region: cell.region, kindCell: cell.kind });
  }
  for (const s of model.seams.values()) {
    if (s.kind === 'open' || !s.part) continue;
    const f = kit.frame[s.part], b = box(s.part);
    if (!f || !b) continue;
    /* wall_half sitzt nicht auf der Fugenmitte, sondern in der freien Hälfte: die andere Hälfte
       gehört dem Schenkel des Eckteils. */
    const sh = (s.halfShift || 0) * (MOD / 4);
    const target = s.run === 'z' ? [s.mid[0] * MOD, s.mid[1] * MOD + sh] : [s.mid[0] * MOD + sh, s.mid[1] * MOD];
    let deg = wallRot(f, s.run, s.into);
    let openWorld = null;
    const op = f.opening && f.opening.width >= MOD * 0.25 ? f.opening : null;   // Gitterstäbe sind keine Tür
    if (op) {
      /* Die Öffnung ist gemessen mittig — aber das ist eine Messung, keine Garantie. Von den
         beiden Drehungen, die die Laufachse treffen, wird die genommen, die die Öffnung auf die
         FREIE Hälfte legt: sonst deckt bei einer Fuge mit Ecke der Schenkel den Durchgang. */
      const cands = [deg, (deg + 180) % 360];
      const pick = cands.find((d) => {
        const v = rotVec(f.runAxis === 'x' ? [op.at, 0] : [0, op.at], d);
        const along = s.run === 'z' ? v[1] : v[0];
        return !s.openPref || Math.sign(along) === s.openPref || along === 0;
      });
      deg = pick === undefined ? deg : pick;
      const v = rotVec(f.runAxis === 'x' ? [op.at, 0] : [0, op.at], deg);
      openWorld = [target[0] + v[0], target[1] + v[1]];
    }
    put(s.part, f.anchor, target, deg,
      s.level * HUB - b.min[1], { layer: 'wall', level: s.level, seam: s.key, seamKind: s.kind, pts: s.pts, openWorld, openWidth: op ? op.width : 0, hide: s.kind === 'door' ? 'wall_doorway_door' : null });
  }
  const cf = kit.frame.wall_corner;
  if (cf) for (const c of model.corners) {
    const deg = cornerRot(cf, c.arms);
    if (deg === null) continue;
    put('wall_corner', cf.joint, [(c.i - 0.5) * MOD, (c.j - 0.5) * MOD], deg,
      c.level * HUB - box('wall_corner').min[1], { layer: 'corner', level: c.level, dirs: c.dirs, pts: [`${c.level}|${c.i},${c.j}`] });
  }
  const st = model.stair, sf = st.part ? kit.frame[st.part] : null;
  if (sf && !opt.noStair) {
    put(st.part, sf.anchor, [st.A[0] * MOD, st.A[1] * MOD], dirRot(sf.dir, st.dir),
      0 * HUB - box(st.part).min[1], { layer: 'stair', level: 0 });
  }
  const tb = box('torch_mounted');
  if (tb && !opt.noTorch) for (const t of model.torches) {
    /* Die Montageachse ist NICHT die schmalere — bei torch_mounted sind 0,55 und 0,62 fast gleich,
       und die erste Fassung hat die Fackel deshalb längs an die Wand gedreht, wo sie in den
       Eckschenkel ragte. Das Merkmal ist die EINSEITIGKEIT: die Rückseite liegt in der
       Pivot-Ebene (z von 0 bis 0,62), die Querachse ist um den Pivot zentriert. Also entscheidet
       die Asymmetrie, nicht die Grösse. */
    const asym = (i) => Math.abs(tb.min[i] + tb.max[i]) / Math.max(1e-6, tb.size[i]);
    const pi = asym(2) >= asym(0) ? 2 : 0;                    // Protrusionsachse
    const sgn = Math.sign(tb.min[pi] + tb.max[pi]) || 1;
    const nat = pi === 0 ? [sgn, 0] : [0, sgn];
    const backLocal = sgn > 0 ? tb.min[pi] : tb.max[pi];      // Anker = Rückenebene
    const latLocal = pi === 0 ? (tb.min[2] + tb.max[2]) / 2 : (tb.min[0] + tb.max[0]) / 2;
    const anchor = pi === 0 ? [backLocal, latLocal] : [latLocal, backLocal];
    /* Abstand von der Fugenmitte: die GEMESSENE Aussenfläche des Wandteils, nicht die halbe
       Nenndicke — wall_cracked ist dicker als die Platte, und eine Fackel auf der dicken Seite
       steckt sonst in der Wand. Genommen wird die grössere der beiden Flächen: lieber 0,2 Luft
       als 0,2 Durchdringung. */
    const wf = kit.frame[t.part];
    const off = (wf ? Math.max(wf.faceFront, wf.faceBack) : kit.WALL_THICK / 2) + 0.02;
    const target = [t.mid[0] * MOD + t.into[0] * off, t.mid[1] * MOD + t.into[1] * off];
    put('torch_mounted', anchor, target, dirRot(nat, t.into),
      t.level * HUB + kit.WALL_H * 0.55 - (tb.min[1] + tb.max[1]) / 2,
      { layer: 'torch', level: t.level, seam: t.seam, into: t.into, cellTarget: [target[0] + t.into[0] * 0.3, target[1] + t.into[1] * 0.3] });
  }
  /* Kerze in die Zellecke: Abstand je Achse = halbe Zelle minus die GEMESSENE Aussenfläche der
     Wand auf dieser Seite minus Kerzenradius. Nicht gegen die Nenndicke rechnen — `wall_pillar`
     ist 1,5 dick statt 1,0, und genau dort steckte die Kerze 0,12 in der Wand. */
  if (!opt.noTorch) for (const cd of model.candles) {
    const cb = box(cd.part || 'candle');
    if (!cb) continue;
    const r = Math.max(cb.size[0], cb.size[2]) / 2;
    const face = (nm) => {
      const f = nm ? kit.frame[nm] : null;
      return f ? Math.max(f.faceFront, f.faceBack) : kit.WALL_THICK / 2;
    };
    const offX = MOD / 2 - face(cd.faces && cd.faces[0]) - r - 0.12;
    const offZ = MOD / 2 - face(cd.faces && cd.faces[1]) - r - 0.12;
    put(cd.part || 'candle', [(cb.min[0] + cb.max[0]) / 2, (cb.min[2] + cb.max[2]) / 2],
      [cd.cell[0] * MOD + cd.corner[0] * offX, cd.cell[1] * MOD + cd.corner[1] * offZ],
      0, cd.level * HUB - cb.min[1],
      { layer: 'candle', level: cd.level, cell: cd.cell, corner: cd.corner });
  }
  /* ---------- Requisiten setzen ----------
     Boden: Anker ist die Boxmitte, Drehung bringt die lokale +z-Achse auf die Richtung IN die
     Zelle — damit ist die gemessene Tiefe immer die Achse quer zur Wand, unabhängig von der Seite.
     Höhe ist gemessener Bodenkontakt (−min.y), nicht gesetzt.
     Wand: der Anker folgt der ASYMMETRIE der eigenen Box (S13.3): Rücken in der Pivot-Ebene oder
     Standoff im Bauteil → Pivot auf die Wandfläche; fast mittige Box (keyring) → Pivot auf die
     Mittellinie der Wand. */
  if (!opt.noProps) for (const pr of model.props || []) {
    const b = box(pr.part);
    if (!b) continue;
    if (pr.kind === 'wall') {
      const asym = (i) => Math.abs(b.min[i] + b.max[i]) / Math.max(1e-6, b.size[i]);
      const pi = asym(2) >= asym(0) ? 2 : 0;
      const sgn = Math.sign(b.min[pi] + b.max[pi]) || 1;
      const nat = pi === 0 ? [sgn, 0] : [0, sgn];
      /* Asymmetrie \u2248 0 (keyring_hanging 0,17) heisst NICHT „Pivot auf die Mittellinie der Wand" \u2014
         gemessen w\u00e4re das Teil damit ganz in der 1,00 dicken Platte verschwunden (Pr\u00fcfung meldete
         0,38 Durchdringung, also seine volle Tiefe). Eine mittige Box tr\u00e4gt keinen Standoff, also
         muss der Abstand von aussen kommen: Wandfl\u00e4che + halbe Eigentiefe. */
      const centred = asym(pi) < 0.4;
      const back = centred ? (b.min[pi] + b.max[pi]) / 2 : (sgn > 0 ? b.min[pi] : b.max[pi]);
      const lat = pi === 0 ? (b.min[2] + b.max[2]) / 2 : (b.min[0] + b.max[0]) / 2;
      const anchor = pi === 0 ? [back, lat] : [lat, back];
      const wf = kit.frame[pr.wallPart];
      const off = (wf ? Math.max(wf.faceFront, wf.faceBack) : kit.WALL_THICK / 2) + 0.02
        + (centred ? b.size[pi] / 2 : 0);
      const target = [pr.mid[0] * MOD + pr.into[0] * off, pr.mid[1] * MOD + pr.into[1] * off];
      put(pr.part, anchor, target, dirRot(nat, pr.into),
        pr.level * HUB + kit.WALL_H * (pr.frac ?? 0.6) - (b.min[1] + b.max[1]) / 2,
        { layer: 'prop', propKind: 'wall', level: pr.level, seam: pr.seam, role: pr.role, region: pr.region, pivot: centred ? 'vor der Wand' : 'auf der Wandfläche' });
      continue;
    }
    const target = [pr.cell[0] * MOD + pr.dir[0] * pr.off, pr.cell[1] * MOD + pr.dir[1] * pr.off];
    put(pr.part, boxMid(pr.part), target, dirRot([0, 1], [-pr.dir[0], -pr.dir[1]]),
      pr.level * HUB - b.min[1],
      { layer: 'prop', propKind: 'floor', level: pr.level, cell: pr.cell, region: pr.region, role: pr.role, inner: pr.inner });
  }
  return out;
}
